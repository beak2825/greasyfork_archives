// ==UserScript==
// @name            SINGULARITY'S Shared Intel plugin
// @description     Shares planetary and ship data with ally
// @author			Singularity
// @include			http://*.planets.nu/*
// @include			http://planets.nu/*
// @version			0.6.1
// @namespace       https://greasyfork.org/users/82986
// @downloadURL https://update.greasyfork.org/scripts/25161/SINGULARITY%27S%20Shared%20Intel%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/25161/SINGULARITY%27S%20Shared%20Intel%20plugin.meta.js
// ==/UserScript==

// History
// 0.1  Prototype. Added sendPlanet. Missing receivePlanet.

// 0.2  First release.
//      Added: receivePlanet.

// 0.3  Update: Smaller/tidier sendPlanet function.
//      Update: Calculated racename and governmentname to save message space.
//      Bug fix: Starts at Dashboard, rather than in Diplomacy screen.
//      Added: planet.img (shows graphic of planet).

// 0.4  Bug fixed: stopped spamming of (stale) planetData while in History.
//      Bug fixed: prevented overwriting your 1st hand data with 2nd hand (potentially stale) data.
//      Updated: receivePlanet can now handle data from multiple allies in the same sector.

// 0.5  Added: parseMessage/intel object to centralise and simplify message handling
//      Bug fixed: Was sometimes selecting stale data in preference to current data.
//      Added: sendPlanet now sends metadata line (including turn number).
//      Updated: receivePlanet now uses turn number from metadata. Stops using message.turn (which can be wrong).
//      Bug fixed: messagetype 0 has "to" and "from" fields backwards.

// 0.6  Bug fixed: Corrected data types to match types used by client/host. e.g.  mines:"100" to mines:100


//To-Do
//HIGH   Dont share data with full ally (except 3rd party intel)
//HIGH   Message "From" use header, rather than to/from fields
//HIGH   Share info via https://cloud.google.com/datastore/docs/

//MED    sendShips / receiveShips
//MED    sendStarbase / receiveStarbase
//MED    Relay third party shared intel (ships planets mines) to my ally
//MED    Identify third party starbases and share
//MED    Include Intel on enemy ship weapons, fighters torps from VCRs

//LOW    Non-shared intel ally is shown as grey (unknown) on starmap
//LOW    check message size is under 64000. split if needed


function wrapper () { // wrapper for injection
	
	//Settings
	var version= "0.6.1";

	var share= [
		{gameid: 192774, playerFrom: 2, playerTo: 10, planets:true, ships: true}, //Indy sector Lizard
		{gameid: 192774, playerFrom: 10, playerTo: 2, planets:true, ships: true}, //Indy sector Rebel
		{gameid: 205497, playerFrom: 1, playerTo: 2, planets:true, ships: true}, //Test game Fed
		{gameid: 205497, playerFrom: 2, playerTo: 1, planets:true, ships: true}, //Test game Lizard
	];


	//Script	
	if (vgap.version < 3) {
		console.warn("Shared Intel plugin needs Nu version 3 or above");
		return;
	} else
		console.log("Shared Intel plugin v"+version+" running");


	var plugin = {
		//processload: function() {  sharedIntel();  },
	};//plugin




	function sharedIntel() {

		//find game data
		var gameid= vgap.game.id;
		var me= vgap.player.id;

		for (var g=0; g<share.length; g+=1) {
			var game= share[g];

			//sendPlanets to all valid players in this sector
			if (game.gameid===gameid && game.playerFrom===me && game.planets)
				sendPlanets(game.playerTo);

			//sendShips to all valid players in this sector
			if (game.gameid===gameid && game.playerFrom===me && game.ships)
				sendShips(game.playerTo);
		}//for

		receivePlanets();
		receiveShips();

	}//sharedIntel



	function sendPlanets(playerTo) {

		//dont try to send messages if we are in the past
		if (vgap.inHistory) return;


		//check mymessages to see if we've already sent this turn
		var turn= vgap.game.turn;
		var me= vgap.player.id;
		
		console.log("sendPlanets()");
		console.log("turn:",turn," me:",me);
		

		for (var m=0; m<vgap.mymessages.length; m+=1) {
			var message= vgap.mymessages[m];
			var intel= parseMessage(message);
			
			if (intel.version>0)  console.log("message:",m," intel:",intel);

			if (intel.version>0 && intel.turn===turn && intel.from===me && intel.to===playerTo) {
				console.log("Shared Intel: Skipping sendPlanets()");
				return;
			}//if

		}//for


		//make message
		var body= "Shared_Intel_v" + version + "#PLANETS#";    //add header
		body+= turn+"#";                                       //add meta data line (v0.5 and above)

		//add planet data
		for (var ploop=0, pend=vgap.myplanets.length; ploop<pend; ploop+=1){
			var p= vgap.myplanets[ploop];

			var imgid= p.img.split("/")[5].split(".")[0];
			var isbase= p.isbase ? 1 : 0;
			var data4= [p.id, p.temp, imgid, isbase, p.friendlycode, p.mines, p.factories, p.defense, p.clans,
						p.megacredits, p.supplies, p.neutronium, p.duranium, p.tritanium, p.molybdenum,
						p.groundneutronium, p.groundduranium, p.groundtritanium, p.groundmolybdenum,
						p.densityneutronium, p.densityduranium, p.densitytritanium, p.densitymolybdenum,
						p.nativeclans, p.nativetype, p.nativegovernment];

			//assemble body
			for (var loop=0; loop<data4.length; loop+=1)
				body += data4[loop] + ",";

			body += "#"; //end each planet line

		}//for each planet

		//terminate
		body = body.replace(/,#/g, "#"); //replace all ",#" with "#"
		body += "END";
		sendMessage(playerTo, body);

	}//sendPlanets



	function sendShips(playerTo) {

		//only send message if you are in the current turn
		//(in game messags sent from the past aren't added to mymessages)
		if (vgap.inHistory) return;

	}//sendShips



	function receivePlanets() {
		//scan mymessages for planet data
		//we may receive multiple messages from multiple allies

		//set up
		//console.log("receivePlanets()");
		var turn= vgap.game.turn; //game turn. This could be the current turn or a historic turn
		var me= vgap.player.id;

		var intelList= [];
		for (var loop=0; loop <= vgap.game.slots; loop+=1)
			intelList[loop]= null;


		//analyse mymessages
		for (var m=0, mend=vgap.mymessages.length; m<mend; m+=1) {

			//analyse message
			var message= vgap.mymessages[m];
			var intel= parseMessage(message);
			var mFrom= intel.from;

			//if this message usable? Or is it more recent than the one we found previously?
			if (intel.version>0 && intel.to===me && intel.turn<=turn && (isNull(intelList[mFrom]) || intel.turn>intelList[mFrom].turn))
				intelList[mFrom]= intel;

		}//for


		//process the best message from each race
		for (var i=0, iend=intelList.length; i<iend; i+=1)
			if (!isNull(intelList[i]))
				processPlanetMessage( intelList[i] );

	}//receivePlanets




	function parseMessage(message) {

		//make intel object
		var intel= {
			id: message.id,
			to: null,
			from: null,
			turn: null,
			planetData: [],
			meta: null,
			version: null,
		};



		//Remove all whitespace added by Nu server
		var mBody= message.body.replace(/\s/g, "");
		var header= mBody.match(/Shared_Intel_v\d+.\d+#PLANETS#/);   //example: Shared_Intel_v0.5#PLANETS#
		var lines= mBody.split("#");
		var l;


		//To and from
		if (message.messagetype===17 || message.messagetype===18) { //this is the usual way around
			intel.to= message.ownerid;
			intel.from= message.target;
		}//if

		if (message.messagetype===0) {                              //but sometimes it's backwards
			intel.to= message.target;
			intel.from= message.ownerid;
		}//if



		//find the message version (if any)
		if (!isNull(header))
			intel.version= Number(header[0].split("#")[0].split("_v")[1]); //extract the 0.5 from "Shared_Intel_v0.5#PLANETS#"


		//version 0.1 to 0.4
		if (intel.version>=0.1 && intel.version<=0.4) {

			intel.meta= null;                             //before v0.5 we didn't use meta data
			intel.turn= message.turn;                     //and we got the turn number from message.turn

			for (l=2; l<lines.length-1; l+=1)             //line 2 onwards is planet data
				intel.planetData.push(lines[l]);

		}//if


		//version 0.5 onward
		if (intel.version>=0.5) {

			intel.meta= lines[2];                         //after 0.5 we embed meta data in line 2
			intel.turn= Number(intel.meta.split(",")[0]); //and the meta data includes the turn number it was sent

			for (l=3; l<lines.length-1; l+=1)             //line 3 onwards is planet data
				intel.planetData.push(lines[l]);

		} //if

		return intel;
	}//parseMessage



	function processPlanetMessage(intel) {

		var owner= intel.from;
		var turn= intel.turn;

		//process each planet in the message
		for (var p=0; p<intel.planetData.length; p++)
			processPlanet(owner, turn, intel.planetData[p]);

	}//processPlanetMessage



	function processPlanet(owner, turn, dataStr) {

		//validate the data
		var data= dataStr.split(",");

		//find the planet
		var id= data[0];
		var planet= vgap.getPlanet(id);

		//never overwrite 1st hand data with 2nd hand data
		if (planet.ownerid===vgap.player.id)   return;


		//update it with data received
		planet.ownerid= owner;
		planet.infoturn= turn;

		planet.temp= Number(data[1]);
		planet.img= "http://play.planets.nu/img/planets/" + data[2] + ".png";
		planet.isbase= Boolean( Number(data[3]) ); //"1"=true, "0"=false
		planet.friendlycode= data[4];

		planet.mines= Number(data[5]);
		planet.factories= Number(data[6]);
		planet.defense= Number(data[7]);

		planet.clans= Number(data[8]);
		planet.megacredits= Number(data[9]);
		planet.supplies= Number(data[10]);

		planet.neutronium= Number(data[11]);
		planet.duranium= Number(data[12]);
		planet.tritanium= Number(data[13]);
		planet.molybdenum= Number(data[14]);

		planet.groundneutronium= Number(data[15]);
		planet.groundduranium= Number(data[16]);
		planet.groundtritanium= Number(data[17]);
		planet.groundmolybdenum= Number(data[18]);

		planet.densityneutronium= Number(data[19]);
		planet.densityduranium= Number(data[20]);
		planet.densitytritanium= Number(data[21]);
		planet.densitymolybdenum= Number(data[22]);

		planet.nativeclans= Number(data[23]);

		planet.nativetype= Number(data[24]);
		planet.nativegovernment= Number(data[25]);

		//find correct govt and race names
		var nativegovernment= ["?", "Anarchy", "Pre-Tribal", "EarlyTribal", "Tribal", "Feudal", "Monarchy", "Representative", "Participatory", "Unity"];
		planet.nativegovernmentname= nativegovernment[planet.nativegovernment];

		var nativetype= ["?","Humanoid", "Bovinoid", "Reptilian", "Avian", "Amorphous", "Insectoid",  "Amphibian", "Ghipsoldal", "Siliconoid"];
		planet.nativeracename= nativetype[planet.nativetype];

	}//processPlanet



	function receiveShips() {
	}//receiveShips




	function sendMessage (to, body) {

		console.log("Shared Intel: sendMessage()");

		var data = new dataObject();
		data.add("gameid", vgap.gameId);
		data.add("playerid", vgap.player.id);
		data.add("apikey", vgap.apikey);
		data.add("to", to);
		data.add("body", body);

		alert("sendMessage()");
		vgap.request("/game/sendmessage", data, function (result) {
			processSendMessage(result);
		});

	}//sendMessage


	function processSendMessage(result) {

		if (result) {

			if (result.success)
				vgap.mymessages = result.mymessages;
			else 
				alert(result.error);

		} else {
			//We are disconnected from the internet.  Warn the user.
			vgap.disconnected();
		}
	}//processSendMessage



	//modify vgap.fullallied
	var old_fullallied = vgap.fullallied;
	vgap.fullallied = function (toId) {
		//console.log("my fullallied()");

/*		
        //if we are sharing intel, then return true
		var gameid= vgap.game.id;
		var me= vgap.player.id;

		for (var g=0; g<share.length; g+=1) {
			var game= share[g];

			if (game.gameid===gameid && game.playerFrom===me && game.playerTo===toId && (game.planets || game.ships))
				return true;
		}//for
*/		

		//normal routine here
		old_fullallied.apply(this, arguments);
	};//fullallied



	function isNull(variable) {
		if(variable === null && typeof variable === "object")
			return true;
		else
			return false;
	}//isNull


	// register your plugin with Nu
	vgap.registerPlugin(plugin, "SharedIntel");


} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);  