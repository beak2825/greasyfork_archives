// ==UserScript==
// @name         	Hive - Mods (nearly public ready)
// @namespace    	https://openuserjs.org/users/DefSoul/scripts
// @version      	2.1
// @description  	RSS Working, Misc, Files Limit Working -Major fixes
// @author       	DefSoul
// @include      	https://touch.hive.im/*
// @exclude		 	http*://touch.hive.im/account?=1
// @exclude		 	http*://touch.hive.im/account?=2
// @exclude		 	http*://*.facebook.com/*
// @exclude		 	http*://facebook.com/*
// @grant        	GM_addStyle
// @grant		 	GM_getValue
// @grant		 	GM_setValue
// @grant        	GM_getResourceText
// @grant	     	GM_xmlhttpRequest
// @resource     	jQueryUICSS		http://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css
// @require      	http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require      	https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js
// @resource     	toastrCss		http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @require      	http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @downloadURL https://update.greasyfork.org/scripts/10590/Hive%20-%20Mods%20%28nearly%20public%20ready%29.user.js
// @updateURL https://update.greasyfork.org/scripts/10590/Hive%20-%20Mods%20%28nearly%20public%20ready%29.meta.js
// ==/UserScript==

//=========TODO=========//
// move away from ajax/gmRequests and directly call functions within hive such as adding torrents, clearing items etc -> Half Done
//======================//

//=========================================CONFIG - EDIT HERE===============================================//
var auth; // IF YOU HAVE ANOTHER AUTH TOKEN YOU WANT TO USE THEN EDIT THIS

// RSS TV
var runRssTV = true;
var rssFeedTV = "http://showrss.info/rss.php?user_id=251131&hd=1&proper=0"; // ONLY WORKS WITH SHOWRSS FEEDS
var RssTVHardCodedFolders = false; 		// LOCAL EXPRIMENTAL > KEEP FALSE

// RSS MOVIES
var runRssMovies = false;
var rssFeedMovies = "https://kat.cr/usearch/2015 category:movies seeds:500 age:year lang_id:2/?rss=1"; // ONLY WORKS WITH KAT FEEDS
var RssMoviesHardCodedFolders = false; 	// LOCAL EXPRIMENTAL > KEEP FALSE

// BUTTONS
var RssButton = true;
var PlayAllButton = false; // TODO
var EncodeButton = true;
var RemoveTransfersButton = true;
var HideButtons = true; // HIDES SOME BUTTONS

// MISC
var DeleteKey = true; 					// HOOKS DELETE KEY, WILL DELETE SELECTED FILE/S
var CtrASelectAll = true; 				// ENABLES SELECT ALL FILES USING CTRL+A
var ChooseFolderSize = "40em"; 			// CHANGES THE LENGTH OF THE CHOOSE FOLDER WHEN MOVING FILES
var InfiniteScroll = true; 				// AUTO CLICKS MORE BUTTON WHEN SCROLLING NEAR THE END OF THE PAGE
var latestMediaContentScroll = true; 	// CHROME FIX FOR RIGHT LATEST MEDIA PANEL

// AUTO QUALITY SELECTION
var qualitySelectionEnable = false; 	// TODO
var qualitySelection = "480"; 			// TODO

// LIMITATIONS BYPASS (SOME ARE SERVER SIDE RESTRICTED AND WON'T WORK)
var filesLimit = 100; 					// 20 THE AMOUNT OF ITEMS TO LOAD WHEN ENTERING A FOLDER BEFORE MORE BUTTON APPEARS
var concurrentChunks = 4	; 			// 4
var concurrentUploads = 9999; 			// 2
var chunkSize = 8388608; 				// 8388608
var webLinkLimit = 9999; 				// 2
var webLinkLimitFree = 9999; 			// 2
var webLinkLimitPremium = 9999; 		// 4
var concurrentTransfers = 9999; 		// 30
var uploadSizeLimit = 262144000; 		// 262144000
var uploadVideoSizeLimit = 21474836480; // 21474836480
var friendLimit = 9999; 				// 100
var copyLimit = 99999; 					// 100
var selectItemsMultiple = true;			// DONT THINK THIS WORKS
var selectionDragging = true;			// DONT THINK THIS WORKS

//==============================================================================================//

// DONT EDIT BELOW UNLESS YOU KNOW WHAT YOU ARE DOING

function log(str, colour){console.log('%c dbg> ' + str, 'background: #D3D3D3; color: ' + colour);} // CUSTOM LOG

var newCSS = GM_getResourceText ("toastrCss");
GM_addStyle(newCSS);

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "12000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

addGlobalStyle(".toast {opacity: 1 !important;");

//=========UNSAFEWINDOW=========//
var bGreasemonkeyServiceDefined	= false;

try {if (typeof Components.interfaces.gmIGreasemonkeyService === "object") {bGreasemonkeyServiceDefined = true;}}
catch (err) {}

if (typeof unsafeWindow === "undefined"  ||  !bGreasemonkeyServiceDefined){
    unsafeWindow = (function(){
		var a = document.createElement('p');
        a.setAttribute ('onclick', 'return window;');
        return a.onclick ();
    })();
}
//========GENERAL GLOBALS========//
//var val = "magnet:?xt=urn:btih:2a1e4d27c95753a19e75dcd2571d61293d246e2b&dn=South+Park+S18E09+HDTV+x264-KILLERS+%5Beztv%5D&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969";
var clearLoop;
//===============================//

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


function conf(){
	auth = unsafeWindow.account.token;
	
	unsafeWindow.concurrentChunks = concurrentChunks;
	unsafeWindow.concurrentUploads = concurrentUploads;
	unsafeWindow.chunkSize = chunkSize;
	unsafeWindow.webLinkLimit = webLinkLimit;
	unsafeWindow.webLinkLimitFree = webLinkLimitFree;
	unsafeWindow.webLinkLimitPremium = webLinkLimitPremium;
	unsafeWindow.concurrentTransfers = concurrentTransfers;
	unsafeWindow.uploadSizeLimit = uploadSizeLimit;
	unsafeWindow.uploadVideoSizeLimit = uploadVideoSizeLimit;
	unsafeWindow.friendLimit = friendLimit;
	unsafeWindow.copyLimit = copyLimit;
	unsafeWindow.selectItemsMultiple = selectItemsMultiple;
	unsafeWindow.files.limit = filesLimit;
	
	unsafeWindow.selectionDragging = selectionDragging;
}

function deleteKey(){
	if (DeleteKey === true){
		$('html').keyup(function(e){ // DELETE KEY EVENT
			if(e.keyCode == 46){
				$("#iconTrash").click();
				setTimeout(function(){
					document.getElementById("alertAgree").click();
				}, 300);
			}
		});
	}
}

function ctrlA(){
	if (CtrASelectAll === true){
		var ctrlDown = false;
		var ctrlKey = 17, aKey = 65;
		
		$(document).keydown(function(e){
			if (e.keyCode == ctrlKey) ctrlDown = true;
		}).keyup(function(e){
			if (e.keyCode == ctrlKey) ctrlDown = false;
		});
		
		$(document).keydown(function(e){
			if (ctrlDown && (e.keyCode == aKey)){
				unsafeWindow.selectAllItems();
			}
		});
	}
}

//=========INIT=========//
function init(){ // INITS SOME STUFF AT START
	if (RssButton === true && !$("#btnRss").length){
		$('#screens').append('<li id="btnRss" )><span>RSS</span></li>');
		$("#btnRss").css("background-image", "url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTIgNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMjYiIHk9IjE3IiB3aWR0aD0iNCIgaGVpZ2h0PSIxNiIgZmlsbD0iIzc3Nzc3NyIvPjxyZWN0IHg9IjIwIiB5PSIyMyIgd2lkdGg9IjE2IiBoZWlnaHQ9IjQiIGZpbGw9IiM3Nzc3NzciLz48L3N2Zz4=)");
		//getRssTV();
		
		// HIDE BUTTONS ON LEFT SCREEN
		if (HideButtons === true){
			$("#navPhotos, #navDocuments, #navTrash").attr("style", "display: none !important;");
			//$("#navPhotos, #navDocuments, #navTrash, #navFindFiles").attr("style", "display: none !important;");
		}
		
		// CHOOSE FOLDER SIZE
		$("#chooseFolder > div").attr("style", "height: " + ChooseFolderSize + " !important;"); //ADD SIZE FOLDER
	}
	
	if (InfiniteScroll === true){
		$(window).scroll(function() {
		   if($(window).scrollTop() + $(window).height() > $(document).height() - 9000) {
			   if ($("#more").length && document.location.href != "https://touch.hive.im/addfiles"){
					$("#more").click();	
			}
		   }
		});
	}
	
	if (RemoveTransfersButton === true && !$("#btnDelete").length){
		$('#screens').append('<li id="btnDelete" )><span>Remove Transfers</span></li>');
		$("#btnDelete").css("background-image", "url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTIgNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSAyMCAxNyBMIDIwIDIwIEwgMzYgMjAgTCAzNiAxNyBMIDMyIDE3IEwgMzIgMTUgTCAyNCAxNSBMIDI0IDE3IEwgMjAgMTcgWiIgZmlsbD0iIzc3Nzc3NyIvPjxyZWN0IHg9IjIyIiB5PSIyMSIgd2lkdGg9IjEyIiBoZWlnaHQ9IjExIiBmaWxsPSIjNzc3Nzc3Ii8+PC9zdmc+)");
		//getRssTV();
	}
	
	if (latestMediaContentScroll === true){
		$("#latestMediaContent").hover(function(){
			$("#latestMediaContent").attr("style", "overflow-x: hidden;");
			$("#latestMediaContent").attr("style", "overflow-y: scroll;");
		});
	}
	
	conf();
	ctrlA();
	deleteKey();
}

var once = 0;
setInterval(function(){ // EVENT FOR WHEN PAGE IS LOADED // RUNS ONCE
	if (once === 0 && $("#appCacheDom").css('display') == 'none'){
		log("ready", "green");
		init();
		
		GM_setValue("dsHive", auth);
		//log("COOKIE > " + x);
		
		once =  1;
	}
}, 100);
//========================//

//=========RSS=========//
var strC;
var strCMovies;
var magnets = [];
var magnetsMovies = [];
var strDB = [];
var strDC = [];

//var folderId = "6890246"; //defsoul 1.New Episodes Folder
var folderId; //defsoul 1.New Episodes Folder
var folderIdMovies = "6890246";

function delTransferItem(jobId){ // DELETES TRANSFER ITEM BY JOBID
	var transferRequest = new getJSON(apiServer + '/api/transfer/archive/');
	var transferData  = 'jobId=' + jobId;
	
	transferRequest.get(transferData, false, null, function(json) {
		log("delTransferItem: " + json.status, "green");
	});	
}

function transferItemsList(){ // GETS ITEMS IN CURRENT TRANSFER LIST
	var xhrXi = new XMLHttpRequest();
	xhrXi.open('POST', 'https://api.hive.im/api/transfer/list/', true);
	xhrXi.setRequestHeader('Authorization', auth);
	xhrXi.setRequestHeader('Client-Type', 'Browser');
	xhrXi.setRequestHeader('Client-Version', '0.1');
	xhrXi.onload = function () {
		var strResA = this.responseText; // THIS IS THE RESULT OF CURRENT ITEMS IN TRANSFER LIST, ALL DATA MIXED IN ONE STRING VAR		
		strDB = strResA.match(/jobId(.*?)status/g); // MAKES AN ARRAY OF ALL ITEMS IN THE TRANSFER LIST
		strDC = strResA.match(/jobId(.*?)}/g); // MAKES A SEPERATE ARRAY OF ALL ITEMS THAT INCLUDE METADATA LIKE STATUS IN TRANSFER LIST
		//log(strDC);
		//if (strDB.length == "null"){
		//	return;	
		//}

		for (var i = 0; i < strDB.length; i++) { // strDB.length IS THE TOTAL AMOUNT OF ITEMS IN TRANSFER LIST
			if (strDC[i].indexOf('Complete') == -1){ // DOES NOT CONTAIN
				if (strDC[i].indexOf('Finished') == -1){ // DOES NOT CONTAIN
					if (strDC[i].indexOf('Downloaded') == -1){ // DOES NOT CONTAIN
						if (strDC[i].indexOf('Unsupported') == -1){ // DOES NOT CONTAIN
								//log("dbgA transferItemsList >" + "Must be DOWNLOADING yo >");
						}
					}
				}
			}
			else{
				if (strDC[i].indexOf("status") !== -1){
					//log("dbgA transferItemsList >" + "Must be COMPLETE yo >");
					strDB[i] = strDB[i].replace(/\"/g, "");
					strDB[i] = strDB[i].replace(':', '');
					strDB[i] = strDB[i].replace(',', '');
					strDB[i] = strDB[i].replace('jobId', '');
					strDB[i] = strDB[i].replace('status', '');

					delTransferItem(strDB[i]);	// DELETE COMPLETED TRANSFERS
					//log("remItem >>" + strDB[i]);
				}
			}
		}
	};
	xhrXi.send();
}

function addTorrent(postMag, nameT){ // ADDS TORRENT FROM BASE64 ENCODED MAGNET URI TO TRANSFER LIST
	var transferRequest = new getJSON(apiServer + '/api/transfer/add/');
	var transferData  = 'remoteUrl=' + postMag;
	
	if (RssTVHardCodedFolders === true){
		transferData += '&parentId=' + folderId;
	}
	
	transferRequest.get(transferData, false, null, function(json) {
		transferItemsList();
		//if (json.status === "success"){
		//	log("========= addTorrent success =========", "green");
		//	log("Job ID: " + json.data.jobId, "blue");
		//	log("Data Status: " + json.data.status, "blue");
		//	log("", "red");
		//}
		//else{
		//	log("========= addTorrent error =========", "green");
		//	log("Message: " + json.message, "blue");
		//	log("", "red");
		
			//var r = data.responseText;
			//var json = JSON.parse(r);
			
			if (json.status === "success"){
				toastr.success("Status: " + json.data.status, nameT); 
				
				log("========= " + nameT + " success =========", "green");
				log("Job ID: " + json.data.jobId, "blue");
				log("Data Status: " + json.data.status, "blue");
				log("Folder Id: " + folderId, "blue");
				log("", "red");
			}
			else{
				if (json.message === "quotaExceeded"){
					toastr.warning(nameT, "Quota Exceeded");
				}
				else if (json.message === "securityViolation"){
					toastr.error(nameT, "Security Violation");
				}

				log("========= " + nameT + " error =========", "green");
				log("Message: " + json.message, "blue");
				log("", "red");
			}
		
		});
}

function addTorrentMovies(postMag){ // ADDS TORRENT FROM BASE64 ENCODED MAGNET URI TO TRANSFER LIST	
	var transferRequest = new getJSON(apiServer + '/api/transfer/add/');
	var transferData  = 'remoteUrl=' + postMag;
	
	if (RssMoviesHardCodedFolders === true){
		transferData += '&parentId=' + folderIdMovies;
	}
	
	transferRequest.get(transferData, false, null, function(json) {
		transferItemsList();
		if (json.status === "success"){
			log("========= addTorrentMovies success =========", "green");
			log("Job ID: " + json.data.jobId, "blue");
			log("Data Status: " + json.data.status, "blue");
			log("", "red");
		}
		else{ 
			log("========= addTorrentMovies error =========", "green");
			log("Message: " + json.message, "blue");
			log("", "red");
		}
	});
	
}

function getRssTV(){ // GETS CUSTOM RSS FEED IN XML OF PAST 10 DAYS FROM showrss.info
	if (runRssTV === true){
		log("getRssTV start", "green");
		
		GM_xmlhttpRequest({
			method: "GET",
			url: rssFeedTV,
			headers: {  
				 "Content-Type": "application/javascript"
			},
			onload: function(response) {
				//log(response.responseText);
				var resG = response.responseText;
				resG = resG.match(/<link>(.*?)<\/link>/g); // RAW MAGNET LINKS EXTRACTION INTO ARRAY

				//log("dbgA getRssTV RSS LINKS TOTAL >" + resG.length);

				for (var i = 1; i < resG.length; i++) {
					resG[i] = resG[i].replace('<link>', '');
					resG[i] = resG[i].replace('</link>', '');
					//log(resG[i]);
					magnets.push(resG[i]); // PUSH CLEANED MAGNET LINKS INTO MAGNETS ARRAY
				}
				
				//
				var j = 0;                     
				function myLoop(){setTimeout(function(){ // DELAYED LOOP THAT SENDS ENCODED MAGNET LINKS TO BE ADDED TO TRANSFER LIST
					clearLoop = true;
					torrentTitle(magnets[j]);
					addTorrent(window.btoa(magnets[j]), torrentInfo(magnets[j]));
					   j++;                    
					if (j < magnets.length) {            
						 myLoop();             
					}
					else{
						clearLoop = false;
						setTimeout(function(){ // delay
							log("End of TV RSS", "red");
						}, 3000);
					}
				}, 2500);}
				myLoop();                      
			}
		});
	}
}

function getRssMovies(){ // GETS RSS FEED IN XML OF TOP 2015 MOVIES FROM KAT
	if (runRssMovies === true){
		log("getRssMovies start", "green");
		
		GM_xmlhttpRequest({
			method: "GET",
			url: rssFeedMovies,
			headers: {  
				 "Content-Type": "application/javascript"
			},
			onload: function(response) {
				//log(response.responseText);
				var resG = response.responseText;
				resG = resG.match(/<torrent:magnetURI>(.*?)<\/torrent:magnetURI>/g); // RAW MAGNET LINKS EXTRACTION INTO ARRAY

				//log("dbgA getRss RSS LINKS TOTAL >" + resG.length);

				for (var i = 1; i < resG.length; i++) {
					resG[i] = resG[i].replace('<torrent:magnetURI>', '');
					resG[i] = resG[i].replace('</torrent:magnetURI>', '');
					resG[i] = resG[i].replace('<![CDATA[', '');
					resG[i] = resG[i].replace(']]>', '');

					//log(resG[i]);
					magnetsMovies.push(resG[i]); // PUSH CLEANED MAGNET LINKS INTO MAGNETS ARRAY
				}
				//
			
				var j = 0;                     
				function myLoop(){setTimeout(function(){ // DELAYED LOOP THAT SENDS ENCODED MAGNET LINKS TO BE ADDED TO TRANSFER LIST
					clearLoop = true;
					addTorrentMovies(window.btoa(magnetsMovies[j]));
					   j++;                    
					if (j < magnetsMovies.length) {            
						 myLoop();             
					}
					else{
						clearLoop = false;
						setTimeout(function(){
							log("End of Movies RSS", "red");		
						}, 3000);
					}
				}, 3000);}
				myLoop();                      
			}
		});
	}
}

setInterval(function(){
	if (clearLoop === true){
		transferItemsList();
	}
}, 500);

function torrentInfo(str){ // EXPERIMENTAL
	try {
		var result = "";
		result = unescape(str);
		result = result.match(/dn=(.*?)tr=/g); // EXTRACTION INTO ARRAY
		result[0] = result[0].replace("dn=", "");
		result[0] = result[0].replace("&amp;tr=", "");
		result[0] = result[0].replace(/\+/g, ".");

		var myRegexp = /(.*?)\.S?(\d{1,2})E?(\d{2})\.(.*)/g;
		var match = myRegexp.exec(result[0]);
		
		var name = match[1];
		var season = match[2];
		var episode = match[3];
		name = name.replace(/\./g, " ");
		//var r = result[0].toString();
		var r = name + " S" + season + " E" + episode;
		
		//log("" + r + "> " + folderId);
		return r;
	}
	catch(err){ 
		log("oh o! " + err, "red"); 
	}
}

function torrentTitle(str){ // EXPERIMENTAL
	try {
		folderId = "";
		var result = "";
		result = unescape(str);
		result = result.match(/dn=(.*?)tr=/g); // EXTRACTION INTO ARRAY
		result[0] = result[0].replace("dn=", "");
		result[0] = result[0].replace("&amp;tr=", "");
		result[0] = result[0].replace(/\+/g, ".");

		var myRegexp = /(.*?)\.S?(\d{1,2})E?(\d{2})\.(.*)/g;
		var match = myRegexp.exec(result[0]);
		result[0] = match[1];
		result[0] = result[0].replace(/\./g, " ");
		var r = result[0].toString();
		
		// CRUDE HARD CODED FOLDER IDS // TODO AUTO FIND AND ASSIGN
		if (r.indexOf("Air Crash") 					!== -1){folderId = "7230680";}
		else if (r.indexOf("American Dad") 			!== -1){folderId = "7221733";}
		else if (r.indexOf("Anthony Bourdain") 		!== -1){folderId = "7068875";}
		else if (r.indexOf("Aqua TV Show Show") 	!== -1){folderId = "6576282";}
		else if (r.indexOf("Archer") 				!== -1){folderId = "4800883";}
		else if (r.indexOf("Better Call Saul") 		!== -1){folderId = "4661077";}
		else if (r.indexOf("Black Mirror") 			!== -1){folderId = "5442171";}
		else if (r.indexOf("Blue Bloods") 			!== -1){folderId = "5442519";}
		else if (r.indexOf("Boardwalk Empire") 		!== -1){folderId = "7069116";}
		else if (r.indexOf("Brain Games") 			!== -1){folderId = "7230935";}
		else if (r.indexOf("Brooklyn Nine") 		!== -1){folderId = "5442708";}
		else if (r.indexOf("Community") 			!== -1){folderId = "4689112";}
		else if (r.indexOf("Cops") 					!== -1){folderId = "7230974";}
		else if (r.indexOf("Cosmos") 				!== -1){folderId = "6267162";}
		else if (r.indexOf("Downton Abbey") 		!== -1){folderId = "6174960";}
		else if (r.indexOf("Drugs") 				!== -1){folderId = "7231008";}
		else if (r.indexOf("Drunk History") 		!== -1){folderId = "7231017";}
		else if (r.indexOf("Family Guy") 			!== -1){folderId = "4671627";}
		else if (r.indexOf("Game of Thrones") 		!== -1){folderId = "6174961";}
		else if (r.indexOf("Gotham") 				!== -1){folderId = "5442569";}
		else if (r.indexOf("Homeland") 				!== -1){folderId = "7068991";}
		else if (r.indexOf("Horizon") 				!== -1){folderId = "7048650";}
		else if (r.indexOf("How Its Made") 			!== -1){folderId = "6714205";}
		else if (r.indexOf("Always Sunny") 			!== -1){folderId = "6593800";}
		else if (r.indexOf("Mad Men") 				!== -1){folderId = "6201607";}
		else if (r.indexOf("Modern Family") 		!== -1){folderId = "4661054";}
		else if (r.indexOf("Pickles") 				!== -1){folderId = "7231112";}
		else if (r.indexOf("MythBusters") 			!== -1){folderId = "4593633";}
		else if (r.indexOf("Peep Show") 			!== -1){folderId = "7080246";}
		else if (r.indexOf("QI") 					!== -1){folderId = "6887067";}
		else if (r.indexOf("Rick and Morty") 		!== -1){folderId = "6231421";}
		else if (r.indexOf("Shameless") 			!== -1){folderId = "6217594";}
		else if (r.indexOf("Sherlock") 				!== -1){folderId = "6703067";}
		else if (r.indexOf("South Park") 			!== -1){folderId = "4671629";}
		else if (r.indexOf("The Americans") 		!== -1){folderId = "6714118";}
		else if (r.indexOf("The Carbonaro Effect") 	!== -1){folderId = "7231162";}
		else if (r.indexOf("The Simpsons") 			!== -1){folderId = "6924962";}
		else if (r.indexOf("The Strain") 			!== -1){folderId = "7069461";}
		else if (r.indexOf("Through the Wormhole") 	!== -1){folderId = "7048649";}
		else if (r.indexOf("Tim and Eric") 			!== -1){folderId = "7231183";}
		else if (r.indexOf("Top Gear") 				!== -1){folderId = "6798804";}
		else if (r.indexOf("Tosh") 					!== -1){folderId = "7221753";}
		else if (r.indexOf("True Detective") 		!== -1){folderId = "6703034";}
		else if (r.indexOf("Vikings") 				!== -1){folderId = "6174963";}
		else if (r.indexOf("Workaholics") 			!== -1){folderId = "6243114";}
		else{folderId = "6890246";}
		//folderId = "6890246";
		
		//log("" + r + "> " + folderId);
		return r;
	}
	catch(err){ 
		log("oh o! " + err, "red"); 
	}
}

$(document).on("click", "#btnRss", function(){ // BUTTON RSS CLICK EVENT
	getRssTV();
	getRssMovies();	
});
//========================//

function transferItemsDelAll(){ // GETS ITEMS IN CURRENT TRANSFER LIST
	var xhrXi = new XMLHttpRequest();
	xhrXi.open('POST', 'https://api.hive.im/api/transfer/list/', true);
	xhrXi.setRequestHeader('Authorization', auth);
	xhrXi.setRequestHeader('Client-Type', 'Browser');
	xhrXi.setRequestHeader('Client-Version', '0.1');
	xhrXi.onload = function () {
		// do something to response
		var strResA = this.responseText; // THIS IS THE RESULT OF CURRENT ITEMS IN TRANSFER LIST, ALL DATA MIXED IN ONE STRING VAR

		strDB = strResA.match(/jobId(.*?)status/g); // MAKES AN ARRAY OF ALL ITEMS IN THE TRANSFER LIST
		//strDC = strResA.match(/jobId(.*?)}/g); // MAKES A SEPERATE ARRAY OF ALL ITEMS THAT INCLUDE METADATA LIKE STATUS IN TRANSFER LIST

		for (var i = 0; i < strDB.length; i++) {
			strDB[i] = strDB[i].replace(/\"/g, "");
			strDB[i] = strDB[i].replace(':', '');
			strDB[i] = strDB[i].replace(',', '');
			strDB[i] = strDB[i].replace('jobId', '');
			strDB[i] = strDB[i].replace('status', '');

			delTransferItem(strDB[i]);	// DELETE COMPLETED TRANSFERS
		}
	};
	xhrXi.send();
}

$(document).on("click", "#btnDelete", function(){ // BUTTON RSS CLICK EVENT
	transferItemsDelAll();
});

function customAddWebLink(val){	// EXPERIMENTAL
	var transferRequest = new getJSON(apiServer + '/api/transfer/add/');
	var one = "magnet:?xt=urn:btih:D1F3EC13F5E3397674E75F6F113FADEA52E10813&dn=How+Its+Made+S25E11+720p+HDTV+x264+DHD&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://open.demonii.com:1337";
	var two = "magnet:?xt=urn:btih:F49F64DB758A7E854C57DC60D7CC43061A2A02DA&dn=Game+of+Thrones+S05E09+PROPER+HDTV+x264+KILLERS&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://open.demonii.com:1337"
	var transferData  = 'remoteUrl=' + window.btoa(one) + "|" + window.btoa(two);
	//transferData += '&parentId=' + parentId;
	
	transferRequest.get(transferData, false, null, function(json) {
		
		log("========= customAddWebLink =========", "green");
			log("Status: " + json.status, "blue");
			log("Message: " + json.message, "blue");
			log("Job ID: " + json.data.jobId, "blue");
			log("Data Status: " + json.data.status, "blue");
			//log("Date: " + json.date, "blue");
			//log("Elapsed: " + json._elapsed, "blue");
			log("", "red");
	});
}

$(document).on("click", "#navMusic", function(){ // BUTTON RSS CLICK EVENT
	//customAddWebLink();
	log("Music clicked >", "green");
});

