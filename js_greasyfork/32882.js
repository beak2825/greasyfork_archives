// ==UserScript==
// @name            SINGULARITY'S AlliancePlus
// @description     Shares Nu turn data with allies
// @version			1.6
// @author			Singularity
// @include			http://play.planets.nu/*
// @include			http://*.planets.nu/*
// @include			http://planets.nu/*
// @namespace       https://greasyfork.org/users/15085
//
// @history         0.1: Google Cloud prototype
// @history         0.2: AWS prototype
// @history         0.3: Working version.
// @history         0.4: Misc Bug fixes. Added ship, starbase, planet UI.

// @history         1.0 (20/9/17) Cleaned up for release.
// @history         1.1 (22/9/17) Added drawAllyWaypoints.
//
// @history         1.2 (25/9/17) Removed drawAllyWaypoints and updated vgap.loadWaypoints instead.
//                       Added drawLongWaypoints option.
//                       Added hyp, chunnel, temporal lance to ally waypoints.
//                       Fixed upload historic turn bug.
//
// @history         1.3 (26/9/17) Highlight ally's ship if selected.
//
// @history         1.4 (27/9/17) Added Beam transfer to ship UI.
//                       Fixed pickObject bug (when parameters were undefined).
//                       Updated dashboard VCR counters after data merge.
//                       Enemy ship list called after data merge.
//                       Added save on exit/end turn.
//                       Added try/catches around "JSON.parse" and "new Function".
//
// @history         1.5 (28/9/17) Compress+Upload now processed in parallel thread for speed.
//
// @history         1.6 (16/11/18)  Name changed from "Data Share" to "AlliancePlus". semi Elint compliant. Code cleaned up.

//
// @downloadURL https://update.greasyfork.org/scripts/32882/SINGULARITY%27S%20AlliancePlus.user.js
// @updateURL https://update.greasyfork.org/scripts/32882/SINGULARITY%27S%20AlliancePlus.meta.js
// ==/UserScript==

//Description:
// Uploads the current turn (not historic turn) every 1 hour.
// Uploads historic turns only if they are missing from server.

// Checks for other player's turns every 30 minutes (or when we change turn)...
// .. and downloads them only if they have changed...
// .. and merges data with our own so we can see ally's turn.

//To-Do
//HIGH Authorised games not working

//(MED) planet owner bug
//(MED) Highlight ally ship - not fully working when ship is in a fleet.

//(MED?) merge messages + reports? glory device, ship build, emork.
//We have discovered an ancient artifact on planet Bortex ID#172. Our researchers have identified it as Emork's Mind.

//(MED-LOW) merge planets/ships - why am I getting slightly different (but valid) 3rd-party data from two rsts with same infoturn?
//.....which takes precedence?
//.....usually planet/ship has changed via me or ally in past. So one has slightly newer intel.
//.....can we determin which is the more recent from the current turn? if not can we keep an index over many turns?

//(LOW) relations sync bug - sync seems ok. bug in client?
//(LOW) add relationship grid (new page on diplomacy screen)?
//(LOW?) add ally message viewer screen?
//(LOW) test: wormholes sync

//(HOLD) artifacts: create defaultArtifact. show artifacts on ship + planet


function wrapper () { // wrapper for injection
	"use strict";

	var version = '1.5';
	console.log('Data Share : v' + version);


    //Elint compliance
    var $ = window.$;
    var vgap = window.vgap;
    //var hamsters = window.hamsters;
    //var AWS = window.AWS;
    //var LZString = window.LZString;



	// ---- Amazon Web Services (AWS) ---- //
	$('head').append('<script src="https://sdk.amazonaws.com/js/aws-sdk-2.100.0.min.js"></script>');

	var s3;
	var bucketName = 'singularity-nu-data';
	var bucketRegion = 'us-west-2';
	var IdentityPoolId = 'us-west-2:5b65d091-0397-43a2-a2e9-e53fb75a79db';


	// ---- lz-string compression ---- //
	$('head').append('<script src="https://s3-us-west-2.amazonaws.com/javascript-lib/lz-string.min.js"></script>');


	// ----- hamsters.io multi-processing ------ //
	$('head').append('<script src="https://s3-us-west-2.amazonaws.com/javascript-lib/hamsters.js"></script>');
	var hamstersRunning= false;


	// ---- global variables ---- //
	var authorisedGames= [192774, //Indy Sector
						  233616, //Die Hard Team II
						  234246, //test game
                          255561, //Chrome Sector (Paranoid Android + Social Assassin)
						 ];

	var syncTimer;              //check for server changes every x minutes
	var gameSaveOccured;        //set to true when player is actively making changes in client.
	var nowTurnTimeStamps= [];  //array showing LastModified time of other player's turns (milliseconds since 1/1/1900)
	var old_drawWaypoints= null; //holds modified vga.map.drawWaypoints on execution

	var cachedListObjects= {   //holds the latest s3.listObjects
		timestamp: 0,
		objects: {},
	};


	//UI settings
	var drawAllyWaypoints= true;
	var showLongWaypoints= true;
	vgap.surveyShipId= null;


	//---- plugin! ----//
	var plugin = {
		processload: function() {
			initHamsters();
			initAWS();
			change_drawWaypoints();
		},

		loaddashboard: function() {
			gameSaveOccured= true;
			sync();
		},

		loadmap: function() {
			vgap.map.addMapTool("<span style='color:#00AA00'>Ally waypoints</span>", "ShowMinerals", function () {
				drawAllyWaypoints= !drawAllyWaypoints;
				vgap.loadWaypoints();
				vgap.map.draw();
			} );
		},

		draw: function () {

			if ($('#SurveyPic').is(":visible"))
				highlightShip(vgap.surveyShipId);

		},
	};//plugin


	//--- hamsters ----//

	function initHamsters() {

		var startOptions = {
			maxThreads: 16,
			cache: false, //memorisation
			debug: false, //disable for production
			persistence: true, //spawns threads and keeps alive
		};

		if (!hamstersRunning) {
			hamsters.init(startOptions);
			hamstersRunning= true;
		}

	}//initHamsters


	// ---- AWS ---- //

	function initAWS() {

		if (s3)
			return;

		AWS.config.update({
			region: bucketRegion,
			credentials: new AWS.CognitoIdentityCredentials({
				IdentityPoolId: IdentityPoolId
			}) });

		s3 = new AWS.S3({
			apiVersion: '2006-03-01',
			params: {
				Bucket: bucketName,
				ACL: 'public-read-write',
			} });

	}//initAWS


	// ---------- sync functions --------- //


	//gameSaveOccured is true when player is making orders in the client
	var old_processSave = vgap.processSave;
	vgap.processSave = function (result) {

		gameSaveOccured= true;
		old_processSave.apply(this, arguments);
	}; //vgap.processSave



	function sync() {
		//console.log('sync()');

		//Have we exited the game, or failed to load rst?
		if (!vgap || !vgap.rst || !vgap.container || !vgap.container[0] || !vgap.container[0].isConnected) {
			clearTimeout(syncTimer);
			return;
		}//if


		//are we in an authorised game?
		var authorised= false;
		for (var game=0; game<authorisedGames.length; game++){
			if (authorisedGames[game]===vgap.game.id) {
				authorised= true;
				break;
			}//if
		}//for

		if (!authorised) {
			clearTimeout(syncTimer);
			return;
		}//if


		//schedule a new sync in 30 minutes
		//(although we may sync sooner if we change turn)
		syncTimer = setTimeout(sync, 30*60*1000);


		//is cachedListObjects fresh enough to avoid a new listObjects call?
		var timeElapsed= Date.now() - cachedListObjects.timestamp;
		if (timeElapsed < 5*60*1000) { //5 minutes

			doSync(cachedListObjects.objects); //sync!

		} else {

			//cache is stale / missing
			var params= {
				Prefix: getFolderName(),
			};
			s3.listObjects(params, function (err, objects) {

				//Check for connection errors?
				if (err) {
					console.error('Data Share - listObjects() had an error.');
					console.error(err);
					clearTimeout(syncTimer);
					return;
				}//if

				//update cachedListObjects
				cachedListObjects= {
					timestamp: Date.now(),
					objects: objects
				};

				doSync(objects); //sync!

			});//s3.listObjects
		}//else
	}//sync


	function doSync(objects) {

		//console.log('doSync()');

		var fileType;

		//upload my nowTurn (if client is in use, save is due and game is not finished)
		//(we can skip upload if game has been idle)
		if (gameSaveOccured && !vgap.inHistory && vgap.game.status!==3) {

			fileType= {
				folder: getFolderName(),
				gameid: vgap.gameId,
				playerid: vgap.player.id,
				turn: vgap.nowTurn,
				final: false,
			};

			var timeElapsed= Date.now() - getTime(fileType, objects);
			if (timeElapsed > 60*60*1000) { //1hr
				//console.log('uploading current turn');
				uploadResult(fileType);
				gameSaveOccured= false;
			}//if

		}//if gameSaveOccured


		//upload/finalise history
		if (vgap.inHistory || vgap.game.status===3) {

			//finalise the turn if it is not on server
			fileType= {
				folder: getFolderName(),
				gameid: vgap.gameId,
				playerid: vgap.player.id,
				turn: vgap.game.turn, //historic turn not nowTurn
				final: true,
			};

			var time= getTime(fileType, objects); //check to see if file exists
			if (time === 0) {

				//upload final version
				//console.log('finalising historic turn');
				uploadResult(fileType);

				//delete the old/non-final version
				fileType.final= false;
				deleteFile(fileType);
			}//if

		}//if in history


		//download+merge all turns matching my current turn (if needed).
		fileType= {
			folder: getFolderName(),
			gameid: vgap.gameId,
			playerid: null,
			turn: vgap.game.turn, //historic turn not nowTurn
			final: null,
		};
		downloadMergeAll(fileType, objects);

	}//doSync



	//save on Exit and End turn
	var old_continueExiting = vgap.continueExiting;
	vgap.continueExiting= function () {

		//upload my nowTurn if it has changed
		if (gameSaveOccured && !vgap.inHistory && vgap.game.status!==3) {

			var fileType= {
				folder: getFolderName(),
				gameid: vgap.gameId,
				playerid: vgap.player.id,
				turn: vgap.nowTurn,
				final: false,
			};

			uploadResult(fileType);
			gameSaveOccured= false;
		}//if

		//continue exit procedure
		old_continueExiting.apply(this, arguments);
	};



	function getFolderName() {
		return vgap.game.name +' ('+ vgap.gameId +')/';
	}//getFolderName


	function uploadResult(fileType) {

		//get filename
		var rstName= fileType.gameid+'-'+fileType.playerid+'-'+fileType.turn;
		var filename= fileType.folder+rstName+(fileType.final ? '-final.crst' : '.crst');

		//remove junk items (saves server space + internet bandwidth)
		var rst= vgap.rst[rstName];
		var accountsettings= rst.accountsettings;
		var playertext= rst.rst.player.t;
		var activity= rst.activity;

		var savedObj= {
			players: rst.rst.players,
			racehulls: rst.rst.racehulls,
			scores: rst.rst.scores,
			ionstorms: rst.rst.ionstorms,
			nebulas: rst.rst.nebulas,
			stars: rst.rst.stars,
			notes: rst.rst.notes,
			races: rst.rst.races,
			hulls: rst.rst.hulls,
			beams: rst.rst.beams,
			engines: rst.rst.engines,
			torpedos: rst.rst.torpedos,
			advantages: rst.rst.advantages,
			activebadges: rst.rst.activebadges,
			settings: rst.rst.settings,
			game: rst.rst.game,
		};

		delete vgap.rst[rstName].accountsettings;
		delete vgap.rst[rstName].rst.player.t;
		delete vgap.rst[rstName].activity;

		for (var obj in savedObj) //delete rst.rst things we saved
			delete vgap.rst[rstName].rst[obj];


		//remove vgap.rst circular references
		var oldPlanets= [];
		var planetLength= vgap.rst[rstName].rst.planets.length;

		for (var planet=0; planet<planetLength; planet++){
			oldPlanets[planet]= vgap.rst[rstName].rst.planets[planet];
			delete vgap.rst[rstName].rst.planets[planet].target;
		}//for

		var oldShips= [];
		var shipLength= vgap.rst[rstName].rst.ships.length;

		for (var ship=0; ship<shipLength; ship++){
			oldShips[ship]= vgap.rst[rstName].rst.ships[ship];
			delete vgap.rst[rstName].rst.ships[ship].target;
		}//for


		try {

			//try clean up, compress and upload the data
			var input= vgap.rst[rstName];
			hamsters.tools.stringifyJson(input, function(json) {
				uploadFile(json, filename);
			});

		} catch(err) {
			console.error('uploadResult() : '+err);
		}//catch


		//add back vgap.rst circular references
		for (planet=0; planet<planetLength; planet++)
			vgap.rst[rstName].rst.planets[planet].target= oldPlanets[planet];

		for (ship=0; ship<shipLength; ship++)
			vgap.rst[rstName].rst.ships[ship].target= oldShips[ship];


		//add back junk
		vgap.rst[rstName].accountsettings= accountsettings;
		vgap.rst[rstName].rst.player.t= playertext;
		vgap.rst[rstName].activity= activity;

		for (obj in savedObj)
			vgap.rst[rstName].rst[obj]= savedObj[obj];

	}//uploadResult



	function uploadFile(json, filename) {
		//this runs in a web worker

		var compressedJson= LZString.compressToUint8Array(json);
		var blobFile = new Blob([compressedJson], { type: 'application/octet-stream' });

		console.log('Data share - uploading file: '+filename);

		s3.upload({
			Key: filename,
			Body: blobFile,
		}, function(err, data) {

			if (err) {
				console.error('uploadResult - There was an error uploading file: ', err.message);
				return;
			}//if

			//force cache to update next sync
			cachedListObjects.timestamp= 0;

		});//s3.upload

	}//uploadFile



	function downloadMergeAll(fileType, objects) {

		//download+merge available rsts from this game turn
		//(only if I need them or they are newer than the one I have)

		//  start-of-string, filename, '/',  5-6 digits, '-', 1-2 digits, '-', 1-3 digits, (optionaly '-final'), '.crst', end-of-string
		var validCrstFile = new RegExp( /^[^\/\?\*]+\/\d{5,6}-\d{1,2}-\d{1,3}(-final)?\.crst$/, 'i');

		//  5-6 digits, '-', 1-2 digits, '-', 1-3 digits, (optionaly '-final')
		var getCrstData = new RegExp( /\d{5,6}-\d{1,2}-\d{1,3}(-final)?/,'i');


		//for each file in the directory
		var end= objects.Contents.length;
		for (var fileLoop=0; fileLoop<end; fileLoop++) {
			var file = objects.Contents[fileLoop];

			//make sure it is a valid looking .crst file
			if (validCrstFile.test(file.Key)) {

				//extract fileData from file.Key
				//'Battle of Nowhere (123456)/123456-10-92-final.crst'
				var filename= getCrstData.exec(file.Key); //0= '123456-10-92', 1= '-final'
				var filename0 = filename[0].split('-'); //0= '123456', 1='10', 2='92'

				var fileData= {
					folder: fileType.folder,
					gameid: Number(filename0[0]),
					playerid: Number(filename0[1]),
					turn: Number(filename0[2]),
					final: (filename[1]==='-final'),
				};


				//skip if this file is not our game or turn
				if (fileType.gameid !== fileData.gameid || fileType.turn !== fileData.turn)
					continue;

				//skip if this file is/was ours
				if (fileData.playerid === vgap.player.id)
					continue;

				//skip if we don't need it
				if (fileData.turn === vgap.nowTurn) {

					//nowTurn: skip download if our client RST is identical to server RST
					var serverTime= Date.parse(file.LastModified);
					var clentTime= nowTurnTimeStamps[fileData.playerid];

					if (serverTime === clentTime)
						continue;

				} else {

					//historic turns: skip download if we have the client RST already
					var rstname= fileData.gameid + '-' + fileData.playerid + '-' + fileData.turn;
					if (vgap.rst[rstname])
						continue;

				}//if else


				//download this file
				var params = {
					Key: file.Key,
				};
				s3.getObject(params, gotRSTObject.bind(null, fileData));

			}//if valid crst file
		}//for

	}//downloadMergeAll



	function gotRSTObject(fileType, err, data) {
		//this comes back asyncronously, but in main thread
		//move to webworker

		if (err) {
			console.error('gotRSTObject - an error occurred');
			console.error(err);
			return;
		}//if

		console.time('decompress + parse');
		//try decompress and parse rst
		var rst;
		try {
			//clean up, compress and upload the data
			var json= LZString.decompressFromUint8Array(data.Body);
			rst= JSON.parse(json);

		} catch(err) {
			console.error(err);
			return;
		}//catch
		//console.timeEnd('decompress + parse');


		//add rst to vgap
		var rstname= fileType.gameid + '-' + fileType.playerid + '-' + fileType.turn;
		vgap.rst[rstname]= rst;

		if (fileType.final)
			console.log('Data share - downloaded file: ' +rstname + '.final.crst');
		else
			console.log('Data share - downloaded file:' +rstname + '.crst');

		//if nowTurn, update client timestamp
		if (fileType.turn===vgap.nowTurn) {
			nowTurnTimeStamps[fileType.playerid]= Date.parse(data.LastModified);
		}//if

		//merge it into our rst
		mergeResult(rst);

	}//gotRSTObject


	function gotRSTObject2(fileType, err, data) {
		//this comes back asyncronously, but in main thread
		//move to webworker

		if (err) {
			console.error('gotRSTObject - an error occurred');
			console.error(err);
			return;
		}//if


		//print file downloaded
		var rstname= fileType.gameid + '-' + fileType.playerid + '-' + fileType.turn;
		if (fileType.final)
			console.log('Data share - downloaded file: ' +rstname + '.final.crst');
		else
			console.log('Data share - downloaded file:' +rstname + '.crst');

		//if nowTurn, update client timestamp
		if (fileType.turn===vgap.nowTurn) {
			nowTurnTimeStamps[fileType.playerid]= Date.parse(data.LastModified);
		}//if



		//run hamster
		var params = {
			data:data
		};
		hamsters.run(params, decompressCRST, processCRST, 1, false);



		function decompressCRST() {
			console.log('decompressCRST');
			var data= params.data;

			rtn.data= 'myoutput';

			//var json= LZString.decompressFromUint8Array(data.Body);
			//rst= JSON.parse(json);

		}//decompressCRST


		function processCRST(arg) {
			console.log('processCRST');
			var data= arg[0].data;


			//find rstname


			//add rst to vgap
			//vgap.rst[rstname]= rst;
			//mergeResult(rst);

		}//processCRST


	}//gotRSTObject2



	function getTime(fileType, objects) {

		var searchKey= fileType.folder+fileType.gameid+'-'+fileType.playerid+'-'+fileType.turn;
		searchKey+= (fileType.final ? '-final.crst' : '.crst');

		//find the file that matches searchKey
		var end= objects.Contents.length;
		for (var fileLoop= 0; fileLoop<end; fileLoop++){
			var file= objects.Contents[fileLoop];

			//return time since 1900
			if (file.Key.startsWith(searchKey))
				return Date.parse(file.LastModified);

		}//for

		return 0;
	}//getTime



	function deleteFile(fileType) {

		var filename= fileType.folder+fileType.gameid+'-'+fileType.playerid+'-'+fileType.turn;
		filename+= (fileType.final ? '-final.crst' : '.crst');

		//delete it
		var params = {
			Key: filename,
		};
		s3.deleteObject(params, function(err, data) {
			if (err) {
				console.error('deleteFile - failed to delete a file');
				console.error(err);
			}

			//force cache to update next sync
			cachedListObjects.timestamp= 0;
		});

	}//deleteFile



	//------ merge ----- //
	function mergeResult(newRST) {

		//find my RST to merge it with
		var gameid= vgap.gameId;
		var playerid= vgap.player.id;
		var turn= vgap.game.turn;
		var myRST = vgap.rst[gameid+'-'+playerid+'-'+turn];


		fixBugs(newRST, myRST);


		//merge RSTs together
		myRST.rst.ships=      mergeArrays('ships', newRST, myRST, defaultShip);
		myRST.rst.planets=    mergeArrays('planets', newRST, myRST, defaultPlanet);
		myRST.rst.starbases=  mergeArrays('starbases', newRST, myRST, defaultStarbase);
		myRST.rst.minefields= mergeArrays('minefields', newRST, myRST, defaultMinefield);
		myRST.rst.stock=      mergeArrays('stock', newRST, myRST, defaultStock);
		myRST.rst.vcrs=       mergeArrays('vcrs', newRST, myRST, defaultVCR);
		//myRST.rst.wormholes=  mergeArrays('wormholes', newRST, myRST, defaultWormhole);
		//myRST.rst.artifacts=  mergeArrays('artifacts', newRST, myRST, defaultArtifact); //needs testing and default object
		//myRST.rst.relations=  mergeArrays('relations', newRST, myRST, defaultRelation);
		//myRST.rst.messages= mergeArrays('messages', newRST, myRST, defaultMessage); //needs testing


		//update vgap
		vgap.ships= myRST.rst.ships;
		vgap.planets= myRST.rst.planets;
		vgap.starbases= myRST.rst.starbases;
		vgap.minefields= myRST.rst.minefields;
		vgap.stock= myRST.rst.stock;
		vgap.vcrs= myRST.rst.vcrs;
		//vgap.wormholes= myRST.rst.wormholes;
		//vgap.artifacts= myRST.rst.artifacts;
		//vgap.relations= myRST.rst.relations;
		//vgap.messages= myRST.rst.messages;


		//refresh vcr buttons
		$('#DashboardMenu li:contains(" VCRs »")').html(vgap.vcrs.length + ' VCRs »');
		vgap.dash.summary();

		//update vgap objects with new data
		processData();

		//update Enemy Ships plugin with new data
		if (vgap.plugins.enemyShipListPlugin)
			vgap.plugins.enemyShipListPlugin.processload();

	}//mergeResult



	function fixBugs(newRST, myRST) {

		//clear all targets
		//(they get added back later in processData)
		var loop, ship ,planet;
		for (loop=0; loop<newRST.rst.ships.length; loop++) {
			ship= newRST.rst.ships[loop];
			ship.target = null;
		}//for

		for (loop=0; loop<myRST.rst.ships.length; loop++) {
			ship= myRST.rst.ships[loop];
			ship.target = null;
		}//for

		for (loop=0; loop<myRST.rst.planets.length; loop++) {
			planet= myRST.rst.planets[loop];
			planet.target= null;
		}//for

		for (loop=0; loop<newRST.rst.planets.length; loop++) {
			planet= newRST.rst.planets[loop];
			planet.target= null;

			//also clear newRST planet colours
			delete planet.note;
			delete planet.colorfrom;
			delete planet.colorto;
		}//for


		//fix NaN happiness bug
		var planetLen= myRST.rst.planets.length;
		for (loop=0; loop<planetLen; loop++) {
			planet= myRST.rst.planets[loop];

			if (isNaN(planet.colhappychange))
				planet.colhappychange= null;

			if (isNaN(planet.nativehappychange))
				planet.nativehappychange= null;
		}//for


		//fix planet owner bug
		var player1= newRST.rst.player.id;

		planetLen=  newRST.rst.planets.length;
		for (loop=0; loop<planetLen; loop++) {

			var planet1= myRST.rst.planets[loop];
			if (!isObj(planet1))
				continue;

			var planet2= vgap.getArray(myRST.rst.planets, planet1.id);
			if (!isObj(planet2))
				continue;

			//if I think my ally owns planet, but he definitely doesn't, then we treat it as unowned
			if (planet2.ownerid === player1 && planet1.ownerid !== player1 && planet1.infoturn<vgap.game.turn) {
				planet2.ownerid= 0;
				planet2.colorto= "#993300";
				planet2.colorfrom= "#ffffcc";
				console.log('planet owner bug fixed on p'+planet1.id+ ' : '+planet1.name);
			}//if

		}//for


		//starbase owner fix
		//starbases dont use ownerid. normally you use the planet.ownerid instead.
		//this fix allows me to look up the owner in a more standardised way.
		var starbase;
		for (loop=0; loop<newRST.rst.starbases.length; loop++) {
			starbase= newRST.rst.starbases[loop];
			planet= vgap.getArray(newRST.rst.planets, starbase.planetid);
			if (!isNull(planet))
				starbase.ownerid= planet.ownerid;
		}//for


		for (loop=0; loop<myRST.rst.starbases.length; loop++) {
			starbase= myRST.rst.starbases[loop];
			planet= vgap.getArray(myRST.rst.planets, starbase.planetid);
			if (!isNull(planet))
				starbase.ownerid= planet.ownerid;

		}//for

	}//fixBugs



	function processData () {

		vgap.map.createSimpleHitMap(); //hitmap
		vgap.createLookups(); //planetMap, shipMap

		for (var pLoop = 0; pLoop < vgap.planets.length; pLoop++) {
			var planet = vgap.planets[pLoop];

			planet.changed = 0;
			planet.img = planet.img.replace("http://library.vgaplanets.nu", "http://play.planets.nu/img");
			planet.colhappychange = vgap.colonistTaxChange(planet);
			planet.nativehappychange = vgap.nativeTaxChange(planet);
			planet.isbase = vgap.getStarbase(planet.id) !== null;
			planet.target = vgap.getTarget(planet.targetx, planet.targety);

			if (vgap.hasNote(planet.id, 1))
				planet.note = vgap.getNote(planet.id, 1);

			vgap.setPlanetColors(planet);
			delete planet.artifacts;
		}//for each planet



		for (var sLoop = 0; sLoop < vgap.ships.length; sLoop++) {
			var ship = vgap.ships[sLoop];

			ship.changed = 0;
			ship.img = hullImg(ship.hullid);

			if (vgap.hasNote(ship.id, 2))
				ship.note = vgap.getNote(ship.id, 2);

			vgap.setShipColors(ship);
			delete ship.artifacts;

			//initialize waypoints (for older rsts)
			if (!ship.waypoints || typeof ship.waypoints == "string")
				ship.waypoints = [];

			if (ship.ownerid === vgap.player.id) {

				//initialize target variable
				var dest = vgap.getDest(ship);
				ship.target = vgap.getTarget(dest.x, dest.y);
			}
		}//for each ship


		for (var sbLoop = 0; sbLoop < vgap.starbases.length; sbLoop++) {
			var sb = vgap.starbases[sbLoop];

			sb.changed = 0;
			sb.img = vgap.getStarbaseIcon(sb.starbasetype);
		}//for each starbase


		for (var mfLoop = 0; mfLoop < vgap.minefields.length; mfLoop++) {
			vgap.setMineColors(vgap.minefields[mfLoop]);
		}//for each minefield


		if (vgap.artifacts) {
			for (var artifactLoop = 0; artifactLoop < vgap.artifacts.length; artifactLoop++) {
				var artifact = vgap.artifacts[artifactLoop];

				var holder;
				if (artifact.locationtype == 1) //planet
					holder = vgap.getPlanet(artifact.locationid);

				if (artifact.locationtype == 2) //ship
					holder = vgap.getShip(artifact.locationid);

				if (!holder.artifacts)
					holder.artifacts = [];

				holder.artifacts.push(artifact);
			}
		}//for each artifact


		//if sphere is enabled we want to mirror objects near the edge
		if (vgap.settings.sphere) {
			vgap.sphereduplicate = vgap.accountsettings.sphereduplicate;
			vgap.sphere();
			vgap.createLookups();
		}//if sphere


		vgap.createInspaceCache(); //inspace
		vgap.parseMessages(); //puts explosions and web strikes on map
		vgap.loadWaypoints(); //draws my ship's waypoints on map
		vgap.map.draw();

	}//processData


	var old_loadWaypoints = vgap.loadWaypoints;
	vgap.loadWaypoints = function () {

		//disable the existing sub-routine that processes other ships
		var code= old_loadWaypoints.toString();

		//planets.nu version
		code= code.replace('function (){', '{');
		code= code.replace('t.heading!=-1', 'false');

		//test.planets.nu version
		code= code.replace('function () {', '{');
		code= code.replace('ship.heading != -1', 'false');

		//run loadWaypoints (less the disabled part)
		try {
			var new_loadWaypoints = new Function(code);
			new_loadWaypoints.apply(this, arguments);

			//then run my part
			addOtherWaypoints();

		} catch (err){
			old_loadWaypoints.apply(this, arguments);
		}

	};//loadWaypoints



	function addOtherWaypoints() {

		var sets = vgap.accountsettings;

		var len= vgap.ships.length;
		for (var sLoop=0; sLoop < len; sLoop++) {
			var ship= vgap.ships[sLoop];

			//check for ship not owned by me
			if (ship.ownerid != vgap.player.id) {

				var rstName= vgap.game.id + '-' + ship.ownerid + '-' + vgap.game.turn;
				var shared= isObj(vgap.rst[rstName]);

				//find colour
				var color= (vgap.allied(ship.ownerid) ? sets.allyshipto : sets.enemyshipto);

				var relation = vgap.getRelation(ship.ownerid);
				if (relation && relation.color && relation.color !== "")
					color = "#" + relation.color;


				//for moving ships that we are NOT receiving shared data about
				if (!shared && ship.heading !== -1 && ship.warp >0) {

					var x2, y2;
					if (showLongWaypoints) {
						//show long waypoints
						x2= ship.targetx;
						y2= ship.targety;
					} else {
						//trim long waypoints
						var speed = vgap.getSpeed(ship.warp, ship.hullid);
						x2 = ship.x + Math.round(Math.sin(Math.toRad(ship.heading)) * speed);
						y2 = ship.y + Math.round(Math.cos(Math.toRad(ship.heading)) * speed);
					}//if else

					vgap.waypoints.push( {id: ship.id, color: color, x1: ship.x, y1: ship.y, x2: x2, y2: y2 } );
				}//if not


				//for ships we ARE receiving shared data about
				if (shared && drawAllyWaypoints) {

					//add first waypoint
					var lastxy= {x: ship.x, y: ship.y};
					var nextxy= {x: ship.targetx, y: ship.targety};
					addWaypoint(ship, color, lastxy, nextxy);

					//step through ship.waypoints[]
					for (var loop= 0; loop < ship.waypoints; loop++) {
						lastxy= nextxy;
						nextxy= ship.waypoints[loop];
						addWaypoint(ship, color, lastxy, nextxy);
					}//for each waypoint

				}//if

			}//shipowner != me
		}//for each ship

		//sort vgap.waypoints
		vgap.waypoints= vgap.waypoints.sort(function(a, b) { return (a.id - b.id); });

	}//addOtherWaypoints


	function addWaypoint(ship, color, lastxy, nextxy) {

		var dasharray= null;
		var linewidth= null;

		if (isHyping(ship))
			dasharray= [2, 2];

		if (vgap.isChunnelling(ship)) {
			var targetShip = vgap.getChunnelTarget(ship);
			nextxy.x= targetShip.x;
			nextxy.y= targetShip.y;
			dasharray= [9, 4];
		} //if chunneling

		if (vgap.isTemporalLancing(ship)) {
			var target = vgap.getTemporalLanceEndPoint(ship);
			nextxy.x= target.x;
			nextxy.y= target.y;
			color = "#FF00FF";
			linewidth = 2;
			dasharray= [9, 4];
		}//if lancing

		if (lastxy.x !== nextxy.x || lastxy.y !== nextxy.y)
			vgap.waypoints.push({
				id: ship.id, color: color,
				x1: lastxy.x, y1: lastxy.y, x2: nextxy.x, y2: nextxy.y,
				dasharray: dasharray, linewidth: linewidth
			});
	}//addWaypoint



	function isHyping(ship) {
		//we dont use fcode hyp as a test because this may be a multi-leg journey with hyp being used later
		//instead we use 340..360ly as a test even though anything >20ly will initiate.

		var hyperHull= (ship.hullid === 51 || ship.hullid === 77 || ship.hullid === 87 || ship.hullid === 110);

		if (hyperHull && ship.neutronium >= 50 && ship.warp > 0 && vgap.getDebrisDisk(ship.x, ship.y) === null) {

			var dist=  Math.dist(ship.x, ship.y, ship.targetx, ship.targety);
			return (dist >= 340 && dist <= 360);

		}//if

		return false;
	}//isHyping



	function highlightShip(shipId) {
		//draw ship selector and ship specific content

		var ship= vgap.getShip(shipId);
		if (isNull(ship))
			return;

		var towee = vgap.isTowTarget(ship.id);

		//intentionally getting the planet rad for the ship
		var rad = vgap.map.planetRad(ship) + 2;
		var x1 = vgap.map.screenX(ship.x);
		var y1 = vgap.map.screenY(ship.y);

		var color = "#FFFF00"; //yellow
		if (towee)
			color = "#FF00FF"; //magenta

		//circle around the selected ship
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(x1, y1, rad, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.stroke();

		//circle around selected target
		if (ship.target) {

			var x2 = vgap.map.screenX(ship.target.x);
			var y2 = vgap.map.screenY(ship.target.y);
			rad = vgap.map.planetRad(ship.target) + 2;

			ctx.beginPath();
			ctx.arc(x2, y2, rad, 0, Math.PI * 2, false);
			ctx.closePath();
			ctx.stroke();

		}//if

		vgap.map.drawWaypoints(ctx, ship.id, color);
	}//highlightShip



	//----------  MERGE FUNCTIONS ------------ //

	function mergeArrays(name, RST1, RST2, emptyObject) {

		//console.log('mergeArrays() : '+name);

		var player1= RST1.rst.player.id; //other player eg Lizards
		var player2= RST2.rst.player.id; //usually me eg Rebels

		var array1 = RST1.rst[name]; //e.g. planets[], ships[] etc
		var array2 = RST2.rst[name];

		if (isNull(array1) || !defined(array1) || isNull(array2) || !defined(array2)) //skip merge if it doesnt exist
			return;

		var newArray= [];
		var object1, object2, newObject;
		var foundObject;


		try {

			//scan through array1
			for (var loop1=0; loop1<array1.length; loop1++) {

				//check for bad object1
				object1= array1[loop1];
				if (!isObj(object1)) {
					console.log('BAD OBJECT in array1 :'+loop1);
					continue;
				}//if

				object2= vgap.getArray(array2, object1.id);
				//add anything not found in array2
				if (!isObj(object2)) {
					newObject= JSON.parse(JSON.stringify(object1));
					newArray.push(newObject);
					continue;
				}//if


				//avoid duplication
				foundObject= vgap.getArray(newArray, object1.id);
				if (!isNull(foundObject))
					continue;

				//pick object and add
				newObject= pickObject(name, object1, player1, object2, player2, emptyObject);
				newObject= JSON.parse(JSON.stringify(newObject));
				newArray.push(newObject);

			}//for


			//scan through array2
			for (var loop2=0; loop2<array2.length; loop2++) {

				//check for bad object2
				object2= array2[loop2];
				if (!isObj(object2)) {
					console.log('BAD OBJECT in array2 :'+loop2);
					continue;
				}//if

				object1= vgap.getArray(array1, object2.id);


				//add anything not found in array1
				if (!isObj(object1)) {
					newObject= JSON.parse(JSON.stringify(object2));
					newArray.push(newObject);
					continue;
				}//if


				//avoid duplication
				foundObject= vgap.getArray(newArray, object2.id);
				if (!isNull(foundObject))
					continue;


				//pick object and add
				newObject= pickObject(name, object1, player1, object2, player2, emptyObject);
				newObject= JSON.parse(JSON.stringify(newObject));
				newArray.push(newObject);
				continue;
			}//for

			//return sorted array (sorted by id)
			return newArray.sort(function(a, b) {  return (a.id - b.id);  });

		} catch (err) {
			console.error(err);
			return RST2;
		}

	}//mergeArrays



	function pickObject(name, object1, player1, object2, player2, emptyObject) {

		//establish ownership of object1 and object2
		var owner1, owner2;

		switch(name) {
			case 'planets':
			case 'ships':
			case 'minefields':
			case 'starbases': //ony works because of starbase owner fix
				owner1= object1.ownerid;
				owner2= object2.ownerid;
				break;

			case 'wormholes':
				owner1= null; //treat as a third party object
				owner2= null;
				break;

			default: //stock, relations, vcrs, artifacts, anything else
				owner1= player1;
				owner2= player2;
				break;
		}//switch


		//I own it = use my data
		if (owner2 === player2)
			return object2;


		//Ally owns it = use his data
		if (owner1 === player1)
			return object1;


		//Other owner = merge objects
		var priorityObject;

		switch(name) {
			case 'planets':
			case 'starbases':
			case 'minefields':
				priorityObject= ( object1.infoturn > object2.infoturn ? object1 : object2 ); //use newest object
				break;

			case 'wormholes':
				priorityObject= ( object1.turn > object2.turn ? object1 : object2 ); //use newest object
				break;

			default:
				priorityObject= object2; //default to my data
		}//switch



		//make newObject one property at a time

		try {

			var newObject= {};
			for (var prop in emptyObject) { //use emptyObject as a template

				var prop1= object1[prop];
				var prop2= object2[prop];      //may be undefined
				var prop0= emptyObject[prop];  //may be undefined


				//if properties are identical, use either
				if (objectEquals(prop1, prop2)) {
					newObject[prop]= JSON.parse(JSON.stringify(prop1));
					continue;
				}//if


				//test if they are defined and different from defaultObject
				var valid1= defined(prop1) && !objectEquals(prop1, prop0);
				var valid2= defined(prop2) && !objectEquals(prop2, prop0);


				//if only prop1 is valid, use it
				if (valid1 && !valid2) {
					newObject[prop]= JSON.parse(JSON.stringify(prop1));
					continue;
				}


				//if only prop2 is valid, use it
				if (!valid1 && valid2) {
					newObject[prop]= JSON.parse(JSON.stringify(prop2));
					continue;
				}


				//if neither are valid, use default object
				if (!valid1 && !valid2) {
					newObject[prop]= JSON.parse(JSON.stringify(prop0));
					continue;
				}

				//if both are valid. Use property from priority object.
				if (valid1 && valid2) {
					newObject[prop]= JSON.parse(JSON.stringify(priorityObject[prop]));
					continue;
				}

			}//for each property

			return newObject;

		} catch(err) {
			console.error(err);
			return object2;
		}

	}//pickObject



	function objectEquals(x, y) {

		if (x === null || x === undefined || y === null || y === undefined) {
            return x === y;
        }

		// after this just checking type of one would be enough
		if (x.constructor !== y.constructor) { return false; }

		// if they are functions, they should exactly refer to same one (because of closures)
		if (x instanceof Function) { return x === y; }

		// if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
		if (x instanceof RegExp) { return x === y; }
		if (x === y || x.valueOf() === y.valueOf()) { return true; }
		if (Array.isArray(x) && x.length !== y.length) { return false; }

		// if they are dates, they must had equal valueOf
		if (x instanceof Date) { return false; }

		// if they are strictly equal, they both need to be object at least
		if (!(x instanceof Object)) { return false; }
		if (!(y instanceof Object)) { return false; }

		// recursive object equality check
		var p = Object.keys(x);
		return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
			p.every(function (i) { return objectEquals(x[i], y[i]); });

	}//objectEquals





	//------- screen changes ------//


	//modify vgap.fullallied
	var old_fullallied = vgap.fullallied;
	vgap.fullallied = function (toId) {

		//if we have their rst, then we treat them as a full ally
		//(the client then shows the full planetSurvey or shipSurvey screen)
		var rstName= vgap.game.id + '-' + toId + '-' + vgap.game.turn;
		if (vgap.rst[rstName])
			return true;

		//otherwise use normal routine
		old_fullallied.apply(this, arguments);
	};//fullallied



	var old_shipSurvey = sharedContent.prototype.shipSurvey;
	sharedContent.prototype.shipSurvey = function (shipId) {

		//generate shipSurvey as normal
		old_shipSurvey.apply(this, arguments);


		//check if we have tactical intel about this ship
		var ship= vgap.getShip(shipId);
		var rstName= vgap.game.id + '-' + ship.ownerid + '-' + vgap.game.turn;

		if (isObj(vgap.rst[rstName])) {

			//get tactical data
			var missionText= getMissionText(ship);
			var peText = (ship.enemy>0 ? vgap.getPlayer(ship.enemy).fullname : 'None');
			var fcode= ship.friendlycode;
			var crewxp= ship.experience;
			var beamText= beamTransfers(ship);

			//make html and add to screen
			var html= '<div class="DarkBar">Tactical Information</div>';
			html += '<div class="SepContainer">';

			html += '<table width="100%">';
			html += '<colgroup>';
			html += '<col span="1" style="width: 30%;">';
			html += '<col span="1" style="width: 70%;">';
			html += '</colgroup>';

			html += '<tbody>';
			html += '<tr><td class="head">Mission:</td><td class="val">'+missionText+'</tr>';
			html += '<tr><td class="head">Primary Enemy:</td><td class="val">'+peText+'</tr>';
			html += '<tr><td class="head">Friendly Code:</td><td class="val">'+fcode+'</tr>';
			html += '<tr><td class="head">Beam Target:</td><td class="val">'+beamText.line1+'</tr>';
			html += '<tr><td class="head">Beaming:</td><td class="val">'+beamText.line2+'</tr>';
			html += '<tr><td class="head">Crew XP:</td><td class="val">'+crewxp+'</tr>';
			html += '</tbody>';

			html += '</table></div>';
			$('#MoreScreen .SepContainer:first .SepContainer:first').after(html);


			//if we know the ship has no weapons, then replace "? Beams" with "No beams"
			if (ship.beams===0 && ship.friendlycode !== '') {
				$('#MoreScreen .SepContainer:first td:contains("? Beams")').html('No Beams');
			}//if


			//show this ship's flightpath in highlighted colour
			vgap.surveyShipId= ship.id;
			highlightShip(vgap.surveyShipId);

		}//if ally
	};


	function beamTransfers(ship) {

		var xferType= ship.transfertargettype;
		var xferID= ship.transfertargetid;

		var xferInProgress= (ship.transfersupplies ||
							 ship.transferclans ||
							 ship.transferneutronium ||
							 ship.transferduranium ||
							 ship.transfertritanium ||
							 ship.transfermolybdenum ||
							 ship.transferammo);

		var xferText= "None";
		var xferText2= "None";

		if (xferInProgress) {
			if (xferType === 1)  //beaming to foreign planet
				xferText= "Planet : "+vgap.getPlanet(xferID).name;

			if (xferType === 2) //beaming to foreign ship
				xferText= "Ship "+xferID+": "+vgap.getShip(xferID).name;

			if (xferType === 3) //jettison
				xferText= "Jettison";

			//Add transfer detail
			if (xferType>0) {
				xferText2= "";
				if (ship.transferneutronium>0) xferText2+= "N"+ship.transferneutronium+" ";
				if (ship.transferduranium>0) xferText2+= "D"+ship.transferduranium+" ";
				if (ship.transfertritanium>0) xferText2+= "T"+ship.transfertritanium+" ";
				if (ship.transfermolybdenum>0) xferText2+= "M"+ship.transfermolybdenum+" ";
				if (ship.transfersupplies>0) xferText2+= "S"+ship.transfersupplies+" ";
				if (ship.transferclans>0) xferText2+= "C"+ship.transferclans;

			}//if showTransferDetail

		}//if xferInProgress

		return {line1: xferText,
				line2: xferText2 };

	}//beamTransfers


	function change_drawWaypoints() {

		//vgap.map.drawWaypoints is not avaialbe at wrapper load time
		//so we update it at processload
		var code= vgap.map.drawWaypoints.toString();
		var newCode;


		//planets.nu version
		if (code.indexOf('function (b,f,d)')>=0) {

			code= code.replace('function (b,f,d){', '{');

			newCode=   'var c=true;\n';
			newCode += 'if (j.id === vgap.surveyShipId && f === undefined && $("#SurveyPic").is(":visible"))\n';
			newCode +=   'c = false;\n';

			code= code.replace('var c=true;', newCode);

			try {
				vgap.map.drawWaypoints = new Function('b', 'f', 'd', code);
			} catch (err) {
				//failed patch. use original.
			}

		}//if planet.nu


		//test.planets.nu version
		if (code.indexOf('function (ctx, id, fixedColor)')>=0) {

			code= code.replace('function (ctx, id, fixedColor) {', '{');

			newCode=   'var draw = true;\n';
			newCode += 'if (waypoint.id === vgap.surveyShipId && id === undefined && $("#SurveyPic").is(":visible"))\n';
			newCode +=    'draw = false;\n';

			code= code.replace('var draw = true;', newCode);

			try {
				vgap.map.drawWaypoints = new Function('ctx', 'id', 'fixedColor', code);
			} catch (err) {
				//failed patch. use original.
			}

		}//if test.planets.nu

	}//change_drawWaypoints



	function getMissionText(ship) {

		var missionText= vgap.getShipMissionShortText(ship); //default text e.g. Minesweep
		var missionTarget= (ship.mission1target === 0 ? null : vgap.getShip(ship.mission1target));

		//missions with targets have more complex text
		switch (ship.mission) {
			case 6: //tow
				if (missionTarget !== null)
					missionText= "Tow ship " + missionTarget.id + ": " + missionTarget.name.substr(0, 30);
				else
					missionText= "Tow: <span class=BadText>No Target</span>";
				break;

			case 7: //intercept
				if (missionTarget !== null)
					missionText= "Intercept ship " + missionTarget.id + ": " + missionTarget.name.substr(0, 30);
				else
					missionText= "Intercept: <span class=BadText>No Target</span>";
				break;

			case 15: //repair ship
				if (missionTarget !== null)
					missionText= "Repair ship " + missionTarget.id + ": " + missionTarget.name.substr(0, 30);
				else
					missionText= "Repair: <span class=BadText>No Target</span>";
				break;

			case 18: //send fighters
				var receiver = "<span class=BadText>Invalid Target</span>";

				if (ship.mission1target === null || ship.mission1target === 0)
					receiver= "All Receivers";

				//send to ship (id between -1000 and +1000)
				if (ship.mission1target > -1000 && ship.mission1target < 1000) {
					missionTarget = vgap.getShip(ship.mission1target);

					if (missionTarget !== null)
						receiver = missionTarget.id + ": " + missionTarget.name;
				}//if

				//send to planet (id under -1000 or over 1000)
				if (ship.mission1target < -1000 || ship.mission1target > 1000 ) {

					var planet = vgap.getPlanet(ship.mission1target % 1000);
					if (planet !== null)
						receiver = planet.id + ": " + planet.name;
				}//if

				missionText= "Send Fighters to " + receiver;
				break;

			case 20: //cloak and intercept
				if (missionTarget !== null)
					missionText= "Cloak and Intercept ship " + missionTarget.id + ": " + missionTarget.name.substr(0, 30);
				else
					missionText= "Cloak and Intercept: <span class=BadText>No Target</span>";
				break;

			case 24: //beam up artifact
				missionText= "Load artifact from planet";
				break;

			case 25: //beam transfer artifact
				missionText= "Transfer artifact to ship/planet";
				break;
		}//switch

		return missionText;
	}//getMissionText



	//Add info to planetSurvey
	var old_planetSurvey = sharedContent.prototype.planetSurvey;
	sharedContent.prototype.planetSurvey = function (planetId) {

		//make normal planetSurvey screen
		old_planetSurvey.apply(this, arguments);


		//add additional information
		var planet= vgap.getPlanet(planetId);
		var rstName= vgap.game.id + '-' + planet.ownerid + '-' + vgap.game.turn;

		if (isObj(vgap.rst[rstName])) {

			var player= vgap.getPlayer(planet.ownerid);
			var race = vgap.getRace(player.raceid);
			var raceColonists= race.adjective + ' ' + nu.t.colonists;

			//make html
			var html= "<div class='SepContainer'>";

			//colonist table
			if (planet.ownerid > 0) {

				var cHappy= planet.colonisthappypoints;
				var cChange= (planet.colhappychange < 0 ? planet.colhappychange : '+'+planet.colhappychange);
				var cTax= planet.colonisttaxrate;
				var cIncome= colonistTaxAmount(planet);

				html += "<table width='100%'>";
				html += "<tr><td class='colpic'><img src='http://play.planets.nu/img/races/1.jpg'/></td>";

				html += "<td><table width='100%'>";
				html += "<tr><td class='head'>" + raceColonists +":</td><td class='val'>" + addCommas(planet.clans * 100) + "</td></tr>";
				html += "<tr><td class='head'>Happiness:</td><td class='val'>" + cHappy + " (" + cChange + ")</td></tr>"; //happiness
				html += "<tr><td class='head'>Tax Rate:</td><td class='val'>" + cTax + "% (+" + cIncome + " Mcr)</td></tr>"; //tax

				html += "</table></td>";
				html += "</tr></table>";
			}//if

			//native table
			if (planet.nativeclans > 0) {

				var nHappy= planet.nativehappypoints;
				var nChange= (planet.nativehappychange < 0 ? planet.nativehappychange : '+'+planet.nativehappychange);
				var nTax= planet.nativetaxrate;
				var nIncome= nativeTaxAmount(planet);

				html += "<table width='100%'>";
				html += "<tr><td class='colpic'><img src='http://play.planets.nu/img/natives/" + planet.nativetype + ".gif'/></td>";

				html += "<td><table width='100%'>";
				html += "<tr><td class='head'>" + nu.t.nativerace + ":</td><td colspan='2'>" + planet.nativeracename + "</td></tr>";
				html += "<tr><td class='head'>" + nu.t.government + ":</td><td colspan='2'>" + planet.nativegovernmentname + "</td></tr>";
				html += "<tr><td class='head'>" + nu.t.population + ":</td><td class='val'>" + addCommas(planet.nativeclans * 100) + "</td></tr>";

				html += "<tr><td class='head'>Happiness:</td><td class='val'>" + nHappy + " (" + nChange + ")</td></tr>"; //Happiness
				html += "<tr><td class='head'>Tax Rate:</td><td class='val'>" + nTax + "% (+" + nIncome + " Mcr)</td></tr>"; //Tax Rate

				html += "</table></td>";
				html += "</tr></table>";
			}//if

			html += "</div>"; //SepContainer

			$('#PlanetSurvey .SepContainer:contains(' + raceColonists + ')').html(html);
		}//if

	};//planetSurvey


	function colonistTaxAmount(planet) {

		var player = vgap.getPlayer(planet.ownerid);
		var colTax = Math.round(planet.colonisttaxrate * planet.clans / 1000);

		//player tax rate (fed bonus)
		if (player.raceid===2)
			colTax = colTax * 2;

		if (colTax > 5000)
			colTax = 5000;

		return colTax;
	}//colonistTaxAmount


	function nativeTaxAmount(planet) {

		//amorph / none
		if (planet.nativetype === 5 || planet.nativetype === 0)
			return 0;

		//cyborg max 20%
		var nativetaxrate = planet.nativetaxrate;
		var player = vgap.getPlayer(planet.ownerid);

		if (player !== null && player.raceid === 6 && nativetaxrate > 20)
			nativetaxrate = 20;

		var val = Math.round(nativetaxrate * planet.nativetaxvalue / 100 * planet.nativeclans / 1000);

		if (val > planet.clans)
			val = planet.clans;

		//player tax rate (fed bonus)
		if (player.raceid===2)
			val = val * 2;

		//insectoid bonus
		if (planet.nativetype === 6)
			val = val * 2;

		if (val > 5000)
			val = 5000;

		return val;
	}//nativeTaxAmount



	//Add info to starbaseSurvey
	var old_starbaseSurvey = sharedContent.prototype.starbaseSurvey;
	sharedContent.prototype.starbaseSurvey = function (planetId) {

		//make normal starbaseSurvey screen
		old_starbaseSurvey.apply(this, arguments);


		//add additional information to starbase screen
		var planet= vgap.getPlanet(planetId);
		var starbase= vgap.getStarbase(planetId);
		var rstName= vgap.game.id + '-' + planet.ownerid + '-' + vgap.game.turn;
		var stock;

		if (starbase && isObj(vgap.rst[rstName])) {

			//mission + fix + torp storage
			var missionText= starbaseMission(starbase);
			var fixRecycleText;
			var fixRecycleTarget;

			if (starbase.shipmission > 0 && starbase.targetshipid > 0) {

				fixRecycleText = (starbase.shipmission === 1 ? nu.t.fixing : nu.t.recycling );

				var ship = vgap.getShip(starbase.targetshipid);
				if (!isNull(ship))
					fixRecycleTarget = starbase.targetshipid + ": " + ship.name;

			}//if starbase.shipmission


			//make html
			var html= '<div class="DarkBar">Tactical &amp Torpedo Storage</div>';
			html += '<div class="SepContainer">';

			html += '<table width="100%">';
			html += '<colgroup>';
			html += '<col span="1" style="width: 30%;">';
			html += '<col span="1" style="width: 70%;">';
			html += '</colgroup>';

			html += '<tbody>';
			html += '<tr><td class="head">Mission:</td><td class="val">' + missionText + '</tr>'; //sb mission

			if (starbase.shipmission > 0 && starbase.targetshipid > 0)
				html += '<tr><td class="head">' + fixRecycleText + ':</td><td class="val">' + fixRecycleTarget + '</tr>'; //fix / recycle

			for (var torpid=1; torpid<=10; torpid++) { // torps in storage

				stock= vgap.getStock(starbase.id, 5, torpid);
				if (!isNull(stock) && stock.amount>0) {

					var torpName= vgap.getTorpedo(torpid).name;
					html += '<tr><td class="head">' + torpName + ':</td><td class="val">' + stock.amount + '</tr>';

				}//if

			}//for

			html += '</tbody></table></div>';
			$("#StarbaseSurvey .SepContainer:contains('" + nu.t.torptech + "')").after(html);



			//component storage (exclusing current build)
			var spare;
			var emptyStorage= true;

			html= '<div class="DarkBar">Spare Component Storage</div>';
			html += '<div class="SepContainer">';
			html += '<table width="100%">';
			html += '<colgroup>';
			html += '<col span="1" style="width: 90%;">';
			html += '<col span="1" style="width: 10%;">';
			html += '</colgroup>';
			html += '<tbody>';


			//hulls
			var hullEnd= vgap.stock.length;
			for (var stockLoop=0; stockLoop<hullEnd; stockLoop ++) {
				stock = vgap.stock[stockLoop];

				if (stock.amount>0 && stock.stocktype === 1 && stock.starbaseid === starbase.id) {

					var hullName= vgap.getHull(stock.stockid).name;
					spare= stock.amount;

					//subtract parts allocated to current build
					if (starbase.buildhullid === stock.stockid)
						spare -=1;

					if (spare>0) {
						html += '<tr><td class="head">' + hullName + ':</td><td class="val">' + spare + '</tr>';
						emptyStorage= false;
					}//if
				}//if
			}//for


			//engines
			var hullEngineQty= (starbase.buildhullid ? vgap.getHull(starbase.buildhullid).engines : 0);

			for (var engineid= 1; engineid<11; engineid ++) {

				stock= vgap.getStock(starbase.id, 2, engineid);
				if (!isNull(stock) && stock.amount>0) {

					var engineName= vgap.getEngine(engineid).name;
					spare= stock.amount;

					//subtract parts allocated to current build
					if (starbase.buildengineid === engineid)
						spare -= hullEngineQty;

					if (spare>0) {
						html += '<tr><td class="head">' + engineName + ':</td><td class="val">' + spare + '</tr>';
						emptyStorage= false;
					}//if

				}//if
			}//for

			//beams
			for (var beamid= 1; beamid<11; beamid ++) {

				stock= vgap.getStock(starbase.id, 3, beamid);
				if (!isNull(stock) && stock.amount>0) {

					var beamName= vgap.getBeam(beamid).name;
					spare= stock.amount;

					//subtract parts allocated to current build
					if (starbase.buildbeamid === beamid)
						spare -= starbase.buildbeamcount;

					if (spare>0) {
						html += '<tr><td class="head">' + beamName + ':</td><td class="val">' + spare + '</tr>';
						emptyStorage= false;
					}//if

				}//if
			}//for

			//launchers
			for (var launcherid= 1; launcherid<11; launcherid ++) {

				stock= vgap.getStock(starbase.id, 4, launcherid);
				if (!isNull(stock) && stock.amount>0) {

					var launcherName= vgap.getTorpedo(launcherid).name;
					spare= stock.amount;

					//subtract parts allocated to current build
					if (starbase.buildtorpedoid === launcherid)
						spare -= starbase.buildtorpcount;

					if (spare>0) {
						html += '<tr><td class="head">' + launcherName + ' launchers:</td><td class="val">' + spare + '</tr>';
						emptyStorage= false;
					}//if

				}//if
			}//for

			//empty
			if (emptyStorage)
				html += '<tr><td class="head">None</td><td class="val"></tr>';

			html += '</tbody></table></div>';
			$("#StarbaseSurvey .SepContainer:last").after(html);
		}//if

	};//starbaseSurvey


	function starbaseMission(starbase) {

		var sbMissions= ['none', 'refuel', 'maxdefense', 'loadtorpsontoships', 'unloadallfreighters',
						 'repairbase', 'forceasurrender', 'sendmegacredits', 'receivemegacredits',
						 'laymines', 'laywebmines', 'minesweep', 'sendfighters', 'receivefighters'];

		var mission= sbMissions[starbase.mission];
		return nu.t[mission];

	}//starbaseMission



	// -------- other functions ---------//

	function isNull(variable) {
		return (variable === null && typeof variable === 'object');
	}//isNull


	function notNull(variable) {
		return !(variable === null && typeof variable === 'object');
	}//notNull


	function isObj(variable) {
		return variable instanceof Object;
	}//isObj


	function defined(variable) {
		return (typeof variable !== 'undefined');
	}//defined


	function isUndefined(variable) {
		return (typeof variable === 'undefined');
	}//isUndefined



	// ---- Default objects ---- //

	var defaultPlanet= {
		"id": 0,
		"infoturn": 0,
		"name": "???",
		"x": -1,
		"y": -1,
		"friendlycode": "???",
		"mines": -1,
		"factories": -1,
		"defense": -1,
		"targetmines": 0,
		"targetfactories": 0,
		"targetdefense": 0,
		"builtmines": 0,
		"builtfactories": 0,
		"builtdefense": 0,
		"buildingstarbase": false,
		"megacredits": -1,
		"supplies": -1,
		"suppliessold": 0,
		"neutronium": -1,
		"molybdenum": -1,
		"duranium": -1,
		"tritanium": -1,
		"groundneutronium": -1,
		"groundmolybdenum": -1,
		"groundduranium": -1,
		"groundtritanium": -1,
		"densityneutronium": -1,
		"densitymolybdenum": -1,
		"densityduranium": -1,
		"densitytritanium": -1,
		"totalneutronium": 0, //dark sense
		"totalmolybdenum": 0,
		"totalduranium": 0,
		"totaltritanium": 0,
		"checkneutronium": 0,
		"checkmolybdenum": 0,
		"checkduranium": 0,
		"checktritanium": 0,
		"checkmegacredits": 0,
		"checksupplies": 0,
		"temp": -1,
		"ownerid": 0,
		"clans": -1,
		"colchange": 0,
		"colonisttaxrate": 0,
		"colonisthappypoints": 0,
		"colhappychange": null,
		"nativeclans": -1,
		"nativechange": 0,
		"nativegovernment": 0,
		"nativetaxvalue": 0,
		"nativetype": 0,
		"nativetaxrate": 0,
		"nativehappypoints": 0,
		"nativehappychange": null,
		"debrisdisk": 0,
		"flag": 0,
		"readystatus": 0,
		"burrowsize": 0,
		"podhullid": 0,
		"podspeed": 0,
		"podcargo": 0,
		"larva": 0,
		"larvaturns": 0,
		"img": "http://play.planets.nu/img/planets/unknown.png",
		"nativeracename": "none",
		"nativegovernmentname": "?",
		"isbase": false,
		"isPlanet": true,
		"colorfrom": "",
		"colorto": "",
	};//planet

	var defaultShip = {
		"id": 0,
		"infoturn": 0,
		"friendlycode": "",
		"name": "",
		"warp": 0,
		"x": -1,
		"y": -1,
		"beams": 0,
		"bays": 0,
		"torps": 0,
		"mission": 0,
		"mission1target": 0,
		"mission2target": 0,
		"enemy": 0,
		"damage": -1,
		"crew": -1,
		"clans": 0,
		"neutronium": 0,
		"tritanium": 0,
		"duranium": 0,
		"molybdenum": 0,
		"supplies": 0,
		"ammo": 0,
		"megacredits": 0,
		"transferclans": 0,
		"transferneutronium": 0,
		"transferduranium": 0,
		"transfertritanium": 0,
		"transfermolybdenum": 0,
		"transfersupplies": 0,
		"transferammo": 0,
		"transfermegacredits": 0,
		"transfertargetid": 0,
		"transfertargettype": 0,
		"targetx": -1,
		"targety": -1,
		"mass": 0,
		"heading": -1,
		"turn": 0,
		"turnkilled": 0,
		"beamid": 0,
		"engineid": 0,
		"hullid": 0,
		"ownerid": 0,
		"torpedoid": 0,
		"experience": 0,
		"podhullid": 0,
		"podcargo": 0,
		"goal": 0,
		"goaltarget": 0,
		"goaltarget2": 0,
		"waypoints": [],
		"history": [],
		"iscloaked": false,
		"readystatus": 0,
	};//defaultShip


	var defaultStarbase= {
		"id": 0,
		"infoturn": 0,
		"defense": 0,
		"builtdefense": 0,
		"damage": 0,
		"enginetechlevel": 0,
		"hulltechlevel": 0,
		"beamtechlevel": 0,
		"torptechlevel": 0,
		"hulltechup": 0,
		"enginetechup": 0,
		"beamtechup": 0,
		"torptechup": 0,
		"fighters": 0,
		"builtfighters": 0,
		"shipmission": 0,
		"mission": 0,
		"mission1target": 0,
		"planetid": 0,
		"raceid": 0, //not used
		"targetshipid": 0,
		"buildbeamid": 0,
		"buildengineid": 0,
		"buildtorpedoid": 0,
		"buildhullid": 0,
		"buildbeamcount": 0,
		"buildtorpcount": 0,
		"isbuilding": false,
		"starbasetype": 0,
		"readystatus": 0,
	};//defaultStarbase

	var defaultMinefield= {
		"id": 0,
		"infoturn": 0,
		"ownerid": 0,
		"isweb": false,
		"units": 0,
		"friendlycode": "???",
		"x": 0,
		"y": 0,
		"radius": 0,
		"color": "",
	};//defaultMinefield

	var defaultStock= {
		"id": 0,
		"starbaseid": 0, //same as planet id
		"stocktype": 0, //1=hull, 2=engine, 3=beams, 4=launcher, 5=torpedo (ammo)
		"stockid": 0, //hullid, engine id etc
		"amount": 0,
		"builtamount": 0,
	};//defaultStock

	var defaultMessage= {
		"id": 0,
		"ownerid": 0,
		"messagetype": 0,
		"headline": "",
		"body": "",
		"target": 0,
		"turn": 0,
		"x": 0,
		"y": 0,
	};//defaultMessage

	var defaultRelation= {
		"id": 0,
		"playerid": 0,
		"playertoid": 0,
		"relationto": 0,
		"relationfrom": 0,
		"conflictlevel": 0,
		"color": "",
	};//defaultRelation

	var defaultVCR= {
		"id": 0,
		"seed": 0,
		"x": 0,
		"y": 0,
		"battletype": 0,
		"leftownerid": 0,
		"rightownerid": 0,
		"turn": 0,
		"left": {},
		"right": {},
	};//defaultVCR

	var defaultWormhole= {
		"id": 0,
		"turn": 0,
		"name": "",
		"stability": 100,
		"targetx": 0,
		"targety": 0,
		"x": 0,
		"y": 0,
	};//defaultWormhole

	var defaultArtifact= {};//defaultArtifact


	//register with Nu
	vgap.registerPlugin(plugin, 'DataShare');

} //wrapper for injection

var script = document.createElement('script');
script.type = 'application/javascript';
script.textContent = '(' + wrapper + ')();';

document.body.appendChild(script);

