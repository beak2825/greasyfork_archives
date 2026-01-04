// ==UserScript==
// @name			GaiaGps Uploader
// @namespace		https://greasyfork.org/users/583371
// @description		Allow the user to upload multiple files at once and more than 1000 waypoints
// @grant			none
// @version			3.1.2
// @author			Franzz
// @license			GNU GPLv3
// @match			https://www.gaiagps.com/map/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419497/GaiaGps%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/419497/GaiaGps%20Uploader.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

//Ctrl+Alt+Shift+I to open network tab on addon

/* GPXParser - v3.0.8 - https://github.com/Luuka/GPXParser.js/blob/master/src/GPXParser.js */
/* Personnal modifications have been applied, care on upgrade */

/**
 * GPX file parser
 * 
 * @constructor
 */
 let gpxParser = function () {
	this.xmlSource	= "";
	this.metadata	= {};
	this.waypoints	= [];
	this.tracks		= [];
	this.routes		= [];
};

/**
 * Parse a gpx formatted string to a GPXParser Object
 * 
 * @param {string} gpxstring - A GPX formatted String
 * 
 * @return {gpxParser} A GPXParser object
 */
gpxParser.prototype.parse = function (gpxstring) {
	let keepThis = this;

	let domParser = new window.DOMParser();
	this.xmlSource = domParser.parseFromString(gpxstring, 'text/xml');

	let metadata = this.xmlSource.querySelector('metadata');
	if(metadata != null){
		this.metadata.name = this.getElementValue(metadata, "name");
		this.metadata.desc = this.getElementValue(metadata, "desc");
		this.metadata.time = this.getElementValue(metadata, "time");

		let author = {};
		let authorElem = metadata.querySelector('author');
		if(authorElem != null){
			author.name = this.getElementValue(authorElem, "name");
			author.email = {};
			let emailElem = authorElem.querySelector('email');
			if(emailElem != null){
				author.email.id	 = emailElem.getAttribute("id");
				author.email.domain = emailElem.getAttribute("domain");
			}

			let link = {};
			let linkElem = authorElem.querySelector('link');
			if(linkElem != null){
				link.href = linkElem.getAttribute('href');
				link.text = this.getElementValue(linkElem, "text");
				link.type = this.getElementValue(linkElem, "type");
			}
			author.link = link;
		}
		this.metadata.author = author;

		let link = {};
		let linkElem = this.queryDirectSelector(metadata, 'link');
		if(linkElem != null){
			link.href = linkElem.getAttribute('href');
			link.text = this.getElementValue(linkElem, "text");
			link.type = this.getElementValue(linkElem, "type");
			this.metadata.link = link;
		}
	}

	var wpts = [].slice.call(this.xmlSource.querySelectorAll('wpt'));
	for (let idx in wpts){
		var wpt	= wpts[idx];
		let pt	= {};
		pt.name	= keepThis.getElementValue(wpt, "name");
		pt.lat	= parseFloat(wpt.getAttribute("lat"));
		pt.lon	= parseFloat(wpt.getAttribute("lon"));
		//let floatValue = parseFloat(keepThis.getElementValue(wpt, "ele")); 
		//pt.ele = isNaN(floatValue) ? null : floatValue;
		pt.ele	= parseFloat(keepThis.getElementValue(wpt, "ele")) || null;
		pt.cmt	= keepThis.getElementValue(wpt, "cmt");
		pt.desc	= keepThis.getElementValue(wpt, "desc");
		pt.sym	= keepThis.getElementValue(wpt, "sym");

		//let time = keepThis.getElementValue(wpt, "time");
		//pt.time = time == null ? null : new Date(time);
		pt.time = (keepThis.getElementValue(wpt, "time") || keepThis.metadata.time) || null;

		keepThis.waypoints.push(pt);
	}

	var rtes = [].slice.call(this.xmlSource.querySelectorAll('rte'));
	for (let idx in rtes){
		let rte = rtes[idx];
		let route = {};
		route.name	= keepThis.getElementValue(rte, "name");
		route.cmt	= keepThis.getElementValue(rte, "cmt");
		route.desc	= keepThis.getElementValue(rte, "desc");
		route.src	= keepThis.getElementValue(rte, "src");
		route.number= keepThis.getElementValue(rte, "number");

		let type	= keepThis.queryDirectSelector(rte, "type");
		route.type	= type != null ? type.innerHTML : null;

		let link	= {};
		let linkElem= rte.querySelector('link');
		if(linkElem != null){
			link.href = linkElem.getAttribute('href');
			link.text = keepThis.getElementValue(linkElem, "text");
			link.type = keepThis.getElementValue(linkElem, "type");
		}
		route.link = link;

		let routepoints = [];
		var rtepts = [].slice.call(rte.querySelectorAll('rtept'));

		for (let idxIn in rtepts){
			let rtept = rtepts[idxIn];
			let pt	= {};
			pt.lat	= parseFloat(rtept.getAttribute("lat"));
			pt.lon	= parseFloat(rtept.getAttribute("lon"));
			//let floatValue = parseFloat(keepThis.getElementValue(rtept, "ele")); 
			//pt.ele = isNaN(floatValue) ? null : floatValue;
			pt.ele	= parseFloat(keepThis.getElementValue(rtept, "ele")) || null;

			//let time = keepThis.getElementValue(rtept, "time");
			//pt.time = time == null ? null : new Date(time);
			pt.time	= (keepThis.getElementValue(rtept, "time") || keepThis.metadata.time) || null;

			routepoints.push(pt);
		}

		//route.distance = keepThis.calculDistance(routepoints);
		//route.elevation = keepThis.calcElevation(routepoints);
		//route.slopes	= keepThis.calculSlope(routepoints, route.distance.cumul);
		route.points	= routepoints;

		keepThis.routes.push(route);
	}

	var trks = [].slice.call(this.xmlSource.querySelectorAll('trk'));
	for (let idx in trks){
		let trk = trks[idx];
		let track = {};

		track.name	= keepThis.getElementValue(trk, "name");
		track.cmt	= keepThis.getElementValue(trk, "cmt");
		track.desc	= keepThis.getElementValue(trk, "desc");
		track.src	= keepThis.getElementValue(trk, "src");
		track.number= keepThis.getElementValue(trk, "number");
		track.color	= keepThis.getElementValue(trk, "DisplayColor");
		track.time	= keepThis.metadata.time;

		let type	= keepThis.queryDirectSelector(trk, "type");
		track.type	= type != null ? type.innerHTML : null;

		let link	= {};
		let linkElem= trk.querySelector('link');
		if(linkElem != null){
			link.href = linkElem.getAttribute('href');
			link.text = keepThis.getElementValue(linkElem, "text");
			link.type = keepThis.getElementValue(linkElem, "type");
		}
		track.link = link;

		let trackpoints = [];
		let trkpts = [].slice.call(trk.querySelectorAll('trkpt'));
		for (let idxIn in trkpts){
			var trkpt = trkpts[idxIn];
			let pt = {};
			pt.lat = parseFloat(trkpt.getAttribute("lat"));
			pt.lon = parseFloat(trkpt.getAttribute("lon"));
			//let floatValue = parseFloat(keepThis.getElementValue(trkpt, "ele")); 
			//pt.ele = isNaN(floatValue) ? null : floatValue;
			pt.ele = parseFloat(keepThis.getElementValue(trkpt, "ele")) || null;

			//let time = keepThis.getElementValue(trkpt, "time");
			//pt.time = time == null ? null : new Date(time);
			pt.time = (keepThis.getElementValue(trkpt, "time") || keepThis.metadata.time) || null;

			trackpoints.push(pt);
		}
		//track.distance  = keepThis.calculDistance(trackpoints);
		//track.elevation = keepThis.calcElevation(trackpoints);
		//track.slopes    = keepThis.calculSlope(trackpoints, track.distance.cumul);
		track.points = trackpoints;

		keepThis.tracks.push(track);
	}
};

/**
 * Get value from a XML DOM element
 * 
 * @param {Element} parent - Parent DOM Element
 * @param {string} needle - Name of the searched element
 * 
 * @return {} The element value
 */
gpxParser.prototype.getElementValue = function(parent, needle){
	let elem = parent.querySelector(needle);
	if(elem != null){
		//Get value (in case of CDATA)
		let sValue = (elem.innerHTML != undefined && elem.innerHTML.substring(0, 8) != '<![CDATA') ? elem.innerHTML : elem.childNodes[0].data;

		//If decoded HTML, re-encode
		if(sValue.substr(0, 4)== '&lt;') sValue = $('<div>').html(sValue).text();
		
		//Strip HTML tags & trim value
		return $('<div>').html(sValue).text().trim();
	}
	return elem;
};

/**
 * Search the value of a direct child XML DOM element
 * 
 * @param {Element} parent - Parent DOM Element
 * @param {string} needle - Name of the searched element
 * 
 * @return {} The element value
 */
gpxParser.prototype.queryDirectSelector = function(parent, needle) {

	let elements = parent.querySelectorAll(needle);
	let finalElem = elements[0];

	if(elements.length > 1) {
		let directChilds = parent.childNodes;

		for(idx in directChilds) {
			elem = directChilds[idx];
			if(elem.tagName === needle) {
				finalElem = elem;
			}
		}
	}

	return finalElem;
};


class Gaia {
	static get URL() { return 'https://www.gaiagps.com'; }
	static get API() { return Gaia.URL+'/api/objects'; }

	constructor() {
		this.reset();
	}

	reset() {
		this.asFiles = [];
		this.aoWaypoints = [];
		this.aoTracks = [];
		this.asFolders = {};
		this.progress = {current:0, total:0};
	}

	setLayout() {
		this.reset();
	
		/* FIXME: adapts on GaiaGPS upgrade */
		let $InputButton = $('a[href="https://help.gaiagps.com/hc/en-us/articles/360052763513"]').parent().find('button');

		//If the button is found (=displayed)
		if($InputButton.length > 0) {
				this.$InputBox = $InputButton.parent();

			//Add Feedback box
			this.$Feedback = ($('#ggu-feedback').length > 0)?$('#ggu-feedback'):($('<div>', {
				'id':'ggu-feedback',
				'style':'width:calc(100% + 64px); height:400px; margin:1em 0 0 -32px; display:inline-block; text-align:left; overflow:auto;'
			}).insertAfter($InputButton));

			/*
			//Add Folder Name Input next to button
			this.$InputName = ($('#ggu-inputname').length > 0)?$('#ggu-inputname'):($('<input>', {
				'type':'text',
				'id': 'ggu-inputname',
				'name':'ggu-inputname',
				'placeholder':'Folder Name',
				'style': 'border-width:2px; border-color:rgba(0, 0, 0, 0.1); border-radius:4px; font-family:Inter,Helvetica Neue,Helvetica,Arial; font-size:15px; padding:8px 12px; margin-bottom:12px;'
			}).val('PCT').prependTo(this.$InputBox));
			*/
		
			//Reset File Input DOM Element
			let $InputFile = $('input[type=file]');
			this.$InputFile = $InputFile.clone()
				.insertAfter($InputFile)
				.attr('multiple', 'multiple')
				.attr('name', 'files[]')
				.change(() => { this.readInputFiles(); });
			$InputFile.remove();

			//Reset button
			this.$InputButton = $InputButton.clone()
				.insertAfter($InputButton)
				.click(() => {this.$InputFile.click();});
			$InputButton.remove();

			//Clear all upload notifications
			this.resetNotif();
		}
	}

	feedback(sType, sMsg) {
		let sColor = 'black';
		let sIcon = '';
		switch(sType) {
			case 'error':	sColor = 'red';		sIcon = '\u274C';	break;
			case 'warning':	sColor = 'orange';	sIcon = '\u26A0';	break;
			case 'info':	sColor = '#2D5E38';	sIcon = '\u2713';	break;
		}

		var sFormattedMsg = sIcon+' '+sMsg+(sMsg.slice(-1)=='.'?'':'.');
		console.log(sFormattedMsg);
		
		this.$Feedback.append($('<p>', {'style': 'color: '+sColor+';'}).text(sFormattedMsg));
		this.$Feedback.scrollTop(this.$Feedback.prop("scrollHeight"));
	}

	incProgress() {
		if(!this.progress.current) {
			this.progress.$Done = $('<div>', {'style':'overflow:hidden; background:#2D5E38; color: white; text-align:right;'});
			this.progress.$Left = $('<div>', {'style':'overflow:hidden; background:white; color: #2D5E38; text-align:left;'});
			this.progress.$Box = $('<div>', {'id':'ggu-progress', 'style':'margin-top:1em;'})
				.append($('<div>', {'style':'display:flex; width:calc(100% + 64px); margin-left:-32px; border-radius:3px; border: 1px solid #2D5E38; box-sizing: border-box;'})
					.append(this.progress.$Done)
					.append(this.progress.$Left)
				);
			this.$Feedback.before(this.progress.$Box);
		}

		this.progress.current++;

		if(this.progress.current < this.progress.total) {
			let iRatio = Math.round(this.progress.current / this.progress.total * 100);
			let sTextDone = '', sTextLeft = '';
			if(iRatio < 50) {
				sTextDone = '';
				sTextLeft = '&nbsp;'+iRatio+'% ('+this.progress.current+' / '+this.progress.total+')';
			}
			else {
				sTextDone = '('+this.progress.current+' / '+this.progress.total+') '+iRatio+'%&nbsp;';
				sTextLeft = '';
			}
			this.progress.$Done.css('flex', iRatio+' 1 0%').html(sTextDone);
			this.progress.$Left.css('flex', (100 - iRatio)+' 1 0%').html(sTextLeft);
		}
		else {
			this.progress.$Box.remove();
			this.progress = {current:0, total:0};
		}
	}

	//Marking all upload notifications as read
	resetNotif() {
		this.feedback('info', 'Marking all upload notifications as read');
		$.get(Gaia.URL+'/social/notifications/popup/').done((asNotifs) => {
			for(var i in asNotifs) {
				if(!asNotifs[i].isViewed && asNotifs[i].html.indexOf('has completed') != -1) {
					$.post(Gaia.URL+'/social/notifications/'+asNotifs[i].id+'/markviewed/');
				}
			}
		});
	}

	//Parse files from input (multiple)
	readInputFiles() {
		if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
			this.feedback('error', 'File APIs are not fully supported in this browser');
			return;
		}
		else this.feedback('info', 'Parsing input files');

		//Get Folder Name (text input)
		let aoReaders = [];
		let iCount = 0;
		this.asFiles = this.$InputFile.prop('files');
		for(var i=0 ; i < this.asFiles.length ; i++) {
			aoReaders[i] = new FileReader();
			aoReaders[i].onload = ((oFileReader) => {
				return (asResult) => {
					iCount++;
					this.feedback('info', 'Reading file "'+oFileReader.name+'" ('+iCount+'/'+this.asFiles.length+')');
					this.parseFile(oFileReader.name, asResult.target.result);
					this.asFolders[oFileReader.name] = {};
					
					if(iCount == this.asFiles.length) {
						this.progress.total = this.aoTracks.length + this.aoWaypoints.length + this.asFiles.length; //extra action per file: Create folder
						this.createFolders();
					}
				};
			})(this.asFiles[i]);
			aoReaders[i].readAsText(this.asFiles[i]);
		}
	}
	
	//Parse GPX files to consolidate tracks & waypoints
	parseFile(sFileName, oContent) {
		this.feedback('info', 'Parsing file "'+sFileName+'"');

		var oGPX = new gpxParser();
		oGPX.parse(oContent);

		//Waypoints
		for(var w in oGPX.waypoints) {
			oGPX.waypoints[w].filename = sFileName;
			var sWaypointName = oGPX.waypoints[w].name;
			/* if(sWaypointName.indexOf('Milestone - ') != -1 && sWaypointName.substr(-2) != '00') { //1 milestone every 100 miles
				this.feedback('info', 'Ignoring milestone waypoint "'+sWaypointName+'"');
			}
			else */this.aoWaypoints.push(oGPX.waypoints[w]);
		}

		//Tracks
		for(var t in oGPX.tracks) {
			oGPX.tracks[t].filename = sFileName;
			this.aoTracks.push(oGPX.tracks[t]);
		}
	}

	//Delete existing folder with same name & recreating it
	createFolders() {
		let iCount = 0;
		$.each(this.asFolders, (sFileName, asFolder) => {

			//Folder Name
			let sFolderName = sFileName.replace(/\.[^\.]+$/, '');
			
			this.feedback('info', 'Looking for existing folder "'+sFolderName+'"...');
			$.get(Gaia.API+'/folder/?search='+sFolderName).done((asFolders) => {
				if(asFolders != '' && !$.isEmptyObject(asFolders)) {
					for(var f in asFolders) {
						this.feedback('info', 'Deleting "'+asFolders[f].title+'" folder');
						$.ajax({
							url: Gaia.API+'/folder/'+asFolders[f].id+'/',
							type: 'DELETE'
						});
					}
				}
				else this.feedback('info', 'No folder named "'+sFolderName+'" found');

				this.feedback('info', 'Creating folder "'+sFolderName+'"');
				let sTime = (new Date()).toISOString();
				$.post({
					url: Gaia.API+'/folder/',
					contentType: 'application/json',
					data: JSON.stringify({
						title: sFolderName,
						imported: true
					})
				}).done((asFolder) => {
					this.feedback('info', 'Folder "'+asFolder.properties.name+'" created');
					this.asFolders[sFileName] = asFolder;
					this.incProgress();
					
					iCount++;
					if(iCount == Object.keys(this.asFolders).length) this.uploadTrack();
				}).fail(() => {
					this.feedback('error', 'Folder "'+sFolderName+'" could not be created');
				});
			});
		});
	}

	//Build & Upload Track File
	uploadTrack(iIndex) {
		iIndex = iIndex || 0;

		if(iIndex == 0) this.feedback('info', 'Uploading tracks...');

		let aoTrack = this.aoTracks[iIndex];
		this.feedback('info', 'Uploading track "'+aoTrack.name+'"');

		let sColor = '#4ABD32';
		switch(aoTrack.color) {
			
			//Personal Colors
			case 'DarkBlue':	sColor = '#2D3FC7';	break;
			case 'Magenta':		sColor = '#B60DC3';	break;
			
			//Garmin Colors
			case 'Black':		sColor = '#000000';	break;
			case 'DarkRed':		sColor = '#F90553';	break;
			case 'DarkGreen':	sColor = '#009B89';	break;
			case 'DarkYellow':	sColor = '#DCEE0E';	break;
			//case 'DarkBlue':	sColor = '#5E23CA';	break;
			case 'DarkMagenta':	sColor = '#B60DC3';	break;
			case 'DarkCyan':	sColor = '#00ACF8';	break;
			case 'LightGray':	sColor = '#A4A4A4';	break;
			case 'DarkGray':	sColor = '#577B8E';	break;
			case 'Red':			sColor = '#F90553';	break;
			case 'Green':		sColor = '#36C03B';	break;
			case 'Yellow':		sColor = '#FFF011';	break;
			case 'Blue':		sColor = '#2D3FC7';	break;
			//case 'Magenta':		sColor = '#B60DC3';	break;
			case 'Cyan':		sColor = '#00C3DD';	break;
			case 'White':		sColor = '#FFFFFF';	break;
			case 'Transparent':	sColor = '#784D3E';	break;
		}

		//Add track points
		let aoCoords = [];
		for(var p in aoTrack.points) {
			let pt = aoTrack.points[p];
			aoCoords.push([pt.lon, pt.lat, pt.ele, 0]);
		}

		//Convert to geojson
		let sPostedData = JSON.stringify({
			geometry: {
				coordinates: [aoCoords],
				type: 'MultiLineString'
			},
			properties: {
				archived: false,
				color: sColor,
				//distance: 168405.62350073704,
				filename: aoTrack.filename,
				hexcolor: sColor,
				isLatestImport: true,
				isLocallyCreated: true,
				isPublicTrack: false,
				isValid: true,
				localId: 'track'+(iIndex + 1),
				notes: aoTrack.desc,
				parent_folder_id: this.asFolders[aoTrack.filename].id,
				routing_mode: null,
				time_created: aoTrack.time || (new Date()).toISOString(),
				title: aoTrack.name,
				type: 'track',
				writable: true
			},
			type: 'Feature'
		});

		var self = this;
		$.post({
			url: Gaia.API+'/track/',
			contentType: 'application/json',
			data: sPostedData,
			trackName: aoTrack.name
		}).done(function(asTrack) {
			self.aoTracks[iIndex] = asTrack;
			self.confirmTrack(iIndex, asTrack, this.data);
		}).fail(function() {
			self.feedback('error', 'Track "'+this.trackName+'" upload failed (stage 1). Retrying...');
			self.uploadTrack(iIndex);
		});
	}

	confirmTrack(iIndex, asTrack, sPostedData) {
		iIndex = iIndex || 0;

		var self = this;
		$.ajax({
			url: Gaia.API+'/track/'+asTrack.features[0].id+'/',
			type: 'PUT',
			contentType: 'application/json',
			data: sPostedData,
			trackName: asTrack.features[0].properties.title
		}).done(function() {
			self.feedback('info', 'Track "'+this.trackName+'" uploaded');
			self.incProgress();
			iIndex++;
			if(iIndex < self.aoTracks.length) self.uploadTrack(iIndex);
			else {
				self.feedback('info', 'All tracks uploaded');
				self.uploadWayPoints();
			}
		}).fail(function() {
			self.feedback('error', 'Track "'+this.trackName+'" upload failed (stage 2). Retrying...');
			self.confirmTrack(iIndex, asTrack, sPostedData);
		});
	}

	/*
	//Wait for file to be processed by Gaia
	checkNotif() {
		this.feedback('info', 'Waiting for Gaia to process consolidated track');
		$.get(Gaia.URL+'/social/notifications/popup/').done((asNotifs) => {
			for(var i in asNotifs) {
				if(!asNotifs[i].isViewed && asNotifs[i].html.indexOf('has completed') != -1) {
					this.feedback('info', 'Notification '+asNotifs[i].id+' found. Marking as read');
					var $Notif = $('<span>').html(asNotifs[i].html);
					this.sFolderId = $Notif.find('a').attr('href').split('/')[3];
					$.post(Gaia.URL+'/social/notifications/'+asNotifs[i].id+'/markviewed/');
				}
			}

			if(this.sFolderId != '') {
				this.setTracksColor();
				this.uploadWayPoints();
			}
			else setTimeout((() => {this.checkNotif();}), 1000);
		});
	}
	*/

	uploadWayPoints(iIndex) {
		iIndex = iIndex || 0;

		//Upload waypoints
		var sWaypointName = this.aoWaypoints[iIndex].name;
		var aoWaypoint = this.aoWaypoints[iIndex];

		this.feedback('info', 'Uploading waypoint '+(iIndex + 1)+'/'+this.aoWaypoints.length+' ('+aoWaypoint.name+')');
		var asPost = {
			geometry: {
				coordinates: [
					aoWaypoint.lon,
					aoWaypoint.lat,
					aoWaypoint.ele
				],
				type: 'Point'
			},
			properties: {
				archived: false,
				filename: aoWaypoint.filename,
				icon: Gaia.getIconName(aoWaypoint.sym),
				isLatestImport: true,
				isLocallyCreated: true,
				isValid: true,
				localId: iIndex+'',
				notes: aoWaypoint.desc,
				parent_folder_id: this.asFolders[aoWaypoint.filename].id,
				time_created: aoWaypoint.time || (new Date()).toISOString(),
				title: aoWaypoint.name,
				type: 'waypoint',
				writable: true
			},
			type: 'Feature'
		};

		let sData = JSON.stringify(asPost);
		var self = this;
		$.post({
			url: Gaia.API+'/waypoint/',
			contentType: 'application/json',
			data: sData
		}).done(function(asWaypoint) {
			self.aoWaypoints[iIndex] = asWaypoint;
			self.confirmWayPoint(iIndex, asWaypoint, this.data);
		}).fail(function(){
			self.feedback('error', 'Failed to upload waypoint #'+(iIndex + 1)+' "'+sWaypointName+'" (Stage 1). Trying again...');
			self.uploadWayPoints(iIndex);
		});
	}

	confirmWayPoint(iIndex, asWaypoint, sPostedData) {
		$.ajax({
			url: Gaia.API+'/waypoint/'+asWaypoint.properties.id+'/',
			type: 'PUT',
			contentType: 'application/json',
			data: sPostedData
		}).done(() => {
			iIndex++;
			this.incProgress();
			if(iIndex < this.aoWaypoints.length) this.uploadWayPoints(iIndex);
			//else this.assignElementsToFolders();
			else this.feedback('info', 'Done');
		}).fail(() => {
			this.feedback('error', 'Failed to upload waypoint #'+(iIndex + 1)+' "'+asWaypoint.properties.title+'" (Stage 2). Trying again...');
			this.confirmWayPoint(iIndex, asWaypoint, sPostedData);
		});
	}

	/*
	assignElementsToFolders(iIndex) {
		iIndex = iIndex || 0;
		let asFolders = Object.keys(this.asFolders).map(key => this.asFolders[key]);
		let asFolder = asFolders[iIndex];

		this.feedback('info', 'Assigning elements of folder "'+asFolder.properties.name+'"');

		//Folder metadata
		let asData = {
			cover_photo_id:	asFolder.properties.cover_photo_id,
			id: 			asFolder.id,
			name:			asFolder.properties.name,
			notes:			asFolder.properties.notes,
			time_created:	asFolder.properties.time_created,
			updated_date:	asFolder.properties.updated_date
		}
		
		//Assign waypoints to folder
		asData.waypoints = [];
		for(var w in this.aoWaypoints) {
			if(this.aoWaypoints[w].parent_folder_id = asFolder.id) asData.waypoints.push(this.aoWaypoints[w].properties.id);
		}
		
		//Assign tracks to folder
		asData.tracks = [];
		for(var t in this.aoTracks) {
			if(this.aoTracks[t].parent_folder_id = asFolder.id) asData.tracks.push(this.aoTracks[t].features[0].id);
		}

		$.ajax({
			url: Gaia.API+'/folder/'+asFolder.id+'/',
			type: 'PUT',
			contentType: 'application/json',
			data: JSON.stringify(asData)
		}).done(() => {
			iIndex++;
			this.incProgress();
			this.feedback('info', 'Tracks & waypoints assigned to folder "'+asFolder.properties.name+'"');
			if(iIndex < asFolders.length) this.assignElementsToFolders(iIndex);
			else this.feedback('info', 'Done');
		}).fail(() => {
			this.feedback('warning', 'Failed to assign waypoints & tracks to folder "'+asFolder.properties.name+'". Trying again...');
			this.assignElementsToFolders(iIndex);
		});
	}
	*/

	static getIconName(sGarminName) {
		var asMapping = {
			'Bridge': 'bridge',
			'Campground': 'campsite-24',
			'Car': 'car-24',
			'Cemetery': 'cemetery-24',
			'Church': 'ghost-town',
			'City (Capitol)': 'city-24',
			'Convenience Store': 'market',
			'Drinking Water': 'potable-water',
			'Flag, Blue': 'blue-pin-down',
			'Flag, Green': 'green-pin',
			'Flag, Red': 'red-pin-down',
			'Forest': 'forest',
			'Ground Transportation': 'car-24',
			'Lodging': 'lodging-24',
			'Park': 'park-24',
			'Pharmacy': 'hospital-24',
			'Picnic Area': 'picnic',
			'Post Office': 'resupply',
			'Powerline': 'petroglyph',
			'Residence': 'building-24',
			'Restaurant': 'restaurant-24',
			'Restroom': 'toilets-24',
			'Shopping Center': 'market',
			'Ski Resort': 'skiing-24',
			'Summit': 'peak',
			'Toll Booth': 'ranger-station',
			'Trail Head': 'known-route',
			'Truck': 'car-24',
			'Water Source': 'water-24'
		};
		return (sGarminName in asMapping)?asMapping[sGarminName]:'red-pin-down';
	}
}

console.log('Loading GaiaGps Uploader '+GM_info.script.version);

let oGaia = new Gaia();

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

let observer = new MutationObserver((mutations, observer) => {

	/* FIXME: adapts on GaiaGPS upgrade */
	let $Import = $('div[aria-label="Import Data"]');
	if($Import.length > 0) {
		observer.disconnect();
		$Import.parent('li').on('click', () => { setTimeout(() => { oGaia.setLayout(); }, 500)});
	}
});

observer.observe(document, { subtree: true, attributes: true});