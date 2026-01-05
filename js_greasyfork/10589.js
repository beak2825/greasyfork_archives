/** YouTube link resolving Originally written by angelsl
 With contributions from Manish Burman http://mburman.com
 With contributions from LouCypher https://github.com/LouCypher

 YTGrab is distributed under the GNU LGPL v3 or later and comes with no warranty.
 Full preamble at https://github.com/angelsl/misc-Scripts/blob/master/Greasemonkey/LICENSE.md#ytgrab

//===========DS===========//
 This is a DefSoul MOD for use with hive. All non hive related code is credited to angelsl and contributers above. (My code will have //===========DS===========// above it)
 angelsl's scripts can be found here > https://github.com/angelsl/misc-Scripts
//===========DS===========\\

// ==UserScript==
// @name          	Hive - YouTube to Hive / Local Download
// @namespace     	https://openuserjs.org/users/DefSoul/scripts
// @description   	Inserts a download button on YouTube video pages and sends to hive -Major fixes
// @version       	1.9 > added ability to send whole playlists to hive
// @run-at        	document-end
// @include       	http*://www.youtube.com/*
// @include		  	http*://api.hive.im/api/*
// @include		  	https://touch.hive.im/account/*
// @exclude		  	http*://*.google.com/*
// @exclude		 	http*://*.facebook.com/*
// @exclude		 	http*://facebook.com/*
// @exclude		  	about:blank
// @exclude		 	http*://*.stripe.com/*
// @require       	https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @resource     	toastrCss		http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @require      	http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @grant         	GM_xmlhttpRequest
// @grant         	GM_getValue
// @grant         	GM_setValue
// @grant         	GM_log
// @grant        	GM_getResourceText
// @grant        	GM_addStyle
// @grant         	unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/10589/Hive%20-%20YouTube%20to%20Hive%20%20Local%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/10589/Hive%20-%20YouTube%20to%20Hive%20%20Local%20Download.meta.js
// ==/UserScript==
 */
//===========DS===========//
var nameB = "YouTube to Hive / Local Download: Test ";
GM_log(nameB + location.href);

var folderName = "# YouTube #"; // CASE SENSITIVE
var uploadFolderId;
var auth;
auth = GM_getValue("auth");
var link;
GM_setValue("ready", "false");
//GM_deleteValue("auth");

var ru;
var uploadToHive;
var uploadPng = "data:image/png;base64,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";
var downloadPng = "data:image/png;base64,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";
function log(str){console.log('%c ' + str, 'background: #000000; color: #FFFFFF');} // CUSTOM LOG

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


$(document).on("click", "#hiveSwitch", function(){ 
	if ($("#hiveSwitch").attr("src") === uploadPng){
		uploadToHive = false;
		$("#hiveSwitch").attr("src", downloadPng);
		$("#hiveSwitch").attr("title", "Local download activated.");
		document.getElementById('btnDownload').innerHTML  = 'Download';
		$("#hiveSwitch").css("right", "9px");
		
		if ($("#watch-action-panels").css("display") == "none")
		document.getElementById("btnDownload").click();
	}
	else{
		uploadToHive = true;
		$("#hiveSwitch").attr("src", uploadPng);	
		$("#hiveSwitch").attr("title", "Upload to Hive activated.");
		document.getElementById('btnDownload').innerHTML  = ' Upload ';
		$("#hiveSwitch").css("right", "0px");
		
		if ($("#watch-action-panels").css("display") == "none")
		document.getElementById("btnDownload").click();
	}
	
});
//===========DS===========\\

if (typeof unsafeWindow === 'undefined' || typeof unsafeWindow.ytplayer === 'undefined') {
    var p = document.createElement('p');
    p.setAttribute('onclick', 'return window;');
    unsafeWindow = p.onclick();
}

function main(decipher) {
	var dashmpd = unsafeWindow.ytplayer.config.args.dashmpd, mpbsrgx = /\/s\/([\w\.]+)/, mpbs;
	if (typeof dashmpd !== 'undefined') {
		mpbs = mpbsrgx.exec(dashmpd); if(mpbs) dashmpd = dashmpd.replace(mpbsrgx, "/signature/"+decipher(mpbs[1]));
		GM_xmlhttpRequest({method: "GET", url: dashmpd, onload: function (t) { main2(t.responseText, decipher); }});
	} else main2(false, decipher);
}

function main2(dashmpd, decipher) {
    "use strict";
    var
        uriencToMap = function (s) {
            var n = {}, a = s.split("&"), idy, c;
            for (idy = 0; idy < a.length; idy++) {
                c = a[idy].split("=");
                n[c[0]] = decodeURIComponent(c[1]);
            }
            return n;
        },
        uwyca = unsafeWindow.ytplayer.config.args,
        title = uwyca.title.replace(/[\/\\\:\*\?\"<\>\|]/g, ""),
        fmtrgx = /^[\-\w+]+\/(?:x-)?([\-\w+]+)/, 
        fmt_map = {}, idx, idz, n, a, qual, fmt, fmt_list, map, uefmss, dashlist, ul, q, div,
		type, itag, maporder, fpsa, fpsb, fpsw = false;

    fmt_list = uwyca.fmt_list.split(",");
    for (idx = 0; idx < fmt_list.length; idx++) {
        a = fmt_list[idx].split("/");
        fmt_map[a[0]] = a[1].split("x")[1] + "p";
    }

    map = {};
    uefmss = uwyca.url_encoded_fmt_stream_map.split(",");
    for (idx = 0; idx < uefmss.length; idx++) {
        n = uriencToMap(uefmss[idx]);
        qual = fmt_map[n.itag];

        if (!(qual in map)) { map[qual] = []; }
        fmt = fmtrgx.exec(n.type);
        map[qual].push($("<a>" + (fmt ? fmt[1] : "MISSINGNO.").toUpperCase() + "</a>").attr("href", n.url + ((n.url.indexOf("signature=") !== -1) ? "" : ("&signature=" + (n.sig || decipher(n.s)))) + "&title=" + title).attr("title", "Format ID: " + n.itag + " | Quality: " + n.quality + " | Mime: " + n.type));
    }

    dashlist = uwyca.adaptive_fmts;
    if (typeof dashlist !== 'undefined') {
        dashlist = dashlist.split(",");
        for (idx = 0; idx < dashlist.length; idx++) {
            n = uriencToMap(dashlist[idx]);
            qual = n.type.indexOf("audio/") === 0 ? "Audio" : (("size" in n) ? (n.size.split('x')[1] + 'p' + n.fps) : (n.itag in fmt_map) ? (fmt_map[n.itag]) : ("Unknown"));

            if (!(qual in map)) { map[qual] = []; }
            fmt = fmtrgx.exec(n.type);
			if (parseInt(n.fps) == 1) fpsw = 1;
            map[qual].push($("<a>DASH" + (fmt ? fmt[1] : "MISSINGNO.").toUpperCase() + "</a>").attr("href", n.url + ((n.url.indexOf("signature=") !== -1) ? "" : ("&signature=" + (n.sig || decipher(n.s)))) + "&title=" + title).attr("title", "Format ID: " + n.itag + " | Bitrate: " + n.bitrate + " | Mime: " + n.type  + " | Res: " + n.size + " | FPS: " + n.fps));
        }
    }
	
	if (dashmpd !== false) {
		dashmpd = $($.parseXML(dashmpd));
		dashmpd.find("AdaptationSet").each(function() {
			q = $(this); type = q.attr("mimeType");
			q.children("Representation").each(function() {
				n = $(this); itag = n.attr("id");
				qual = type.indexOf("audio/") === 0 ? "Audio" : (n.attr("height") + 'p' + n.attr("frameRate"));
				if (!(qual in map)) { map[qual] = []; }
				fmt = fmtrgx.exec(type);
				if (parseInt(n.attr("frameRate")) == 1) fpsw = 1;
				map[qual].push($("<a>MPD" + (fmt ? fmt[1] : "MISSINGNO.").toUpperCase() + "</a>").attr("href", n.children("BaseURL").text() + "&title=" + title).attr("title", "Format ID: " + itag + " | Bitrate: " + n.attr("bandwidth") + " | Mime: " + type + (type.indexOf("audio/") === 0 ? " | Sample Rate: " + n.attr("audioSamplingRate") : " | Res: " + n.attr("width") + 'x' + n.attr("height") + " | FPS: " + n.attr("frameRate"))));
			});
		});
	}

	maporder = Object.keys(map);
	maporder.sort(function(a,b) {
		if((a == "Audio" && b == "Unknown") || (b == "Audio" && a != "Unknown")) return -1;
		if ((b == "Audio" && a == "Unknown") || (a == "Audio" && b != "Unknown")) return 1;
		fpsa = a.split('p')[1] || 0; fpsb = b.split('p')[1] || 0; if (fpsa != fpsb) return parseInt(fpsb)-parseInt(fpsa);
		return parseInt(b)-parseInt(a); });
    ul = $("<ul class=\"watch-extras-section\" />");
    for (n = 0; n < maporder.length; ++n) {
		q = maporder[n];
        if (map[q].length < 1) { continue; }
        div = $("<div class=\"content\" />").append(map[q][0]);
        for (idz = 1; idz < map[q].length; idz++) {
            div.append(" ").append(map[q][idz]);
        }
        ul.append($("<li><h4 class=\"title\" style=\"font-weight: bold; color: #333333;\">" + q + "</h4></li>").append(div));
    }

    $("#action-panel-share").after($("<div id=\"action-panel-sldownload\" class=\"action-panel-content hid\" data-panel-loaded=\"true\" />").append(ul));
    $("#watch8-secondary-actions").find("> div").eq(1).after($('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity action-panel-trigger yt-uix-button-opacity yt-uix-tooltip" style="text-align: center;" type="button" onclick=";return false;" title="" id="btnDownload" data-trigger-for="action-panel-sldownload" data-button-toggle="true"><span class="yt-uix-button-content">Upload</span></button>')).size();
	//===========DS===========//
	//$("#hiveSwitch").css("display", "block");
	$("#watch8-secondary-actions").find("> div").eq(1).after($('<img title="Upload to Hive activated." src="' + uploadPng + '" type="button" onclick=";return false;" title="" id="hiveSwitch" style="right: 0px; bottom: 41px; z-index: 9999999; cursor: pointer; position: absolute; display: block; height: 50px; width: 50px; padding-left: 5px;" data-button-toggle="true"><span class=""></span></button>')).size();
	
	//===========DS===========\\
	if (fpsw) ul.after($("<p style='color: green;'>At this time Hive only accepts Mp4 & Flv video files, the other formats are for local downloading.</p>"));
}

function run() {
	if (typeof unsafeWindow.ytplayer !== 'undefined')
		{ GM_xmlhttpRequest({method: "GET", url: unsafeWindow.ytplayer.config.assets.js.replace(/^\/\//, "https://"), onload: function (t) { main((function (u) {
			"use strict"; var sres = /function ([a-zA-Z$0-9]+)\(a\)\{a=a\.split\(""\);([a-zA-Z0-9]*)\.?.*?return a\.join\(""\)\};/g.exec(u);
			if (!sres) { return function (v) { return v; }; }
			return eval("(function(s){" + (sres[2] !== "" ? (new RegExp("var " + sres[2] + "={.+?}};", "g").exec(u)[0]) : "") + sres[0] + "return " + sres[1] + "(s);})");
		}(t.responseText))); }}); }
}

//DS//
function run2(val) {
	log("run2 running");
	GM_xmlhttpRequest({
		method: "GET", 
		url: val, 
		onload: function(t){

			json = JSON.parse(t.responseText);
			
			//for(var key in json) {
			//	var value = json[key];
			//	log(value);
			//}
	}}); 
}

setInterval(function(){
	if ($(".playlist-actions").length && !$("#PlaylistToHive").length){
		$(".playlist-actions").append('<button id="PlaylistToHive" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-has-icon no-icon-markup yt-uix-playlistlike  yt-uix-tooltip" type="button" onclick=";return false;" aria-label="To Hive" title="To Hive" data-like-tooltip="Save to Playlists" data-unlike-tooltip="Remove" data-like-label="Save" data-unlike-label="Saved" data-tooltip-text="To Hive" aria-labelledby="yt-uix-tooltip95-arialabel" data-tooltip-hide-timer="235"><span class="yt-uix-button-content">To Hive</span></button>');
	}
}, 1000);

//DS\\

waitForKeyElements("#watch8-secondary-actions", run);

//===========DS===========/

function createFolder(uploadFolderName){
	GM_xmlhttpRequest({ //CROSS DOMAIN POST REQUEST
		"method": "get",
		"url": "https://api.hive.im/api/hive/get/",
		"headers": {  
			'Content-Type': 'application/x-www-form-urlencoded;',
			'Authorization': auth,
			'Client-Type': 'Browser',
			'Client-Version': '0.1',
			'Referer': 'https://touch.hive.im/myfiles/videos',
			'Origin': 'https://touch.hive.im/'
		},
		"onload": function(data){
			var r = data.responseText;
			var json = JSON.parse(r);
			
			for (var i = 0; i < json.data.length; i++){
				var id;
				
				if (json.data[i].title === "Videos"){ // FINDS INITIAL VIDEOS FOLDER ID
					//log("we got a video ova here", "green");	
					
					parentId = json.data[i].parentId;
					id = json.data[i].id;
					
					GM_xmlhttpRequest({ //CROSS DOMAIN POST REQUEST
						"method": "post",
						"url": "https://api.hive.im/api/hive/get-children/",
						"data": "&parentId=" + id + "&limit=1000",
						"headers": {  
							'Content-Type': 'application/x-www-form-urlencoded;',
							'Authorization': auth,
							'Client-Type': 'Browser',
							'Client-Version': '0.1',
							'Referer': 'https://touch.hive.im/',
							'Origin': 'https://touch.hive.im/'
						},
						"onload": function(data){
							var r = data.responseText;
							var json = JSON.parse(r);
							var hasFolderIndex;
							
							Object.keys(json.data).forEach(function(key) {
								//log(json.data[key].title, "blue");
								hasFolderIndex += json.data[key].title;
								
								if (json.data[key].title === uploadFolderName){
									uploadFolderId = json.data[key].id;
									log("<" + uploadFolderName + "> Already exists. " + uploadFolderId, "green");
									//return json.data[key].id;
								}
							});
							
							if (hasFolderIndex.indexOf(uploadFolderName) == -1){ // SEARCHES VIDEOS FOLDER TO SEE IF uploadFolderName EXISTS
								log("does not contain: " + uploadFolderName, "red");
								
								GM_xmlhttpRequest({ //CROSS DOMAIN POST REQUEST
									"method": "post",
									"url": "https://api.hive.im/api/hive/create/",
									"data": "filename=" + uploadFolderName + "&parent=" + id + "&locked=false",
									"headers": {  
										'Content-Type': 'application/x-www-form-urlencoded;',
										'Authorization': auth,
										'Client-Type': 'Browser',
										'Client-Version': '0.1',
										'Referer': 'https://touch.hive.im/',
										'Origin': 'https://touch.hive.im/'
									},
									"onload": function(data){
										var r = data.responseText;
										var json = JSON.parse(r);
										
										uploadFolderId = json.data.id;

										log("Create folder <" + uploadFolderName + "> " + json.data.id);
										return json.data.id;
									}
								});
							}
							else{
								//log("does contain: " + uploadFolderName, "green");
							}
						}
					});
					//log(parentId + "\n" + currentId);
				}
				
				//log(item, "blue");
			}
			
			//log(r, "blue");
		}
	});	
}

function cdReq(href, nameT, folderId){
	log("cdReq start: " + href);
	GM_xmlhttpRequest({ //CROSS DOMAIN POST REQUEST
		"method": "post",
		"url": "https://api.hive.im/api/transfer/add/",
		"data": "remoteUrl=" + window.btoa(href) + "&parentId=" + folderId,
		//"data": "remoteUrl=" + window.btoa(href),
		"headers": {  
			'Content-Type': 'application/x-www-form-urlencoded;',
			'Authorization': GM_getValue("auth"),
			'Client-Type': 'Browser',
			'Client-Version': '0.1',
			'Referer': 'https://touch.hive.im/',
			'Origin': 'https://touch.hive.im/'
		},
		"onload": function(data){
			var r = data.responseText;
			var json = JSON.parse(r);
			
			if (json.status === "success"){
				toastr.success(nameT, "Status: " + json.data.status); 
				
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
			
			//log("cdReq >" + data.responseText);
			
			//transferItemsList(); // GO GET ITEMS IN CURRENT TRANSFER LIST
		}
	});	
}

$(document).on("click", "#PlaylistToHive", function(e){ // MAIN CLICK EVENT
	e.preventDefault();
	
	toastr.warning("Extracting links.", "Please don't navigate from page!");
	
	var tiles = document.getElementsByClassName("yt-uix-tile");
	var titlesClass = document.getElementsByClassName("pl-video-title-link");
	var titles = [];
	var vids = []; // CONTAINS ALL COMPLETE URLS OF ALL ITEMS IN PLAYLIST
	var mp4s = [];
	
	for (var i = 0; i < tiles.length; i++){
		var r = $(titlesClass[i]).html();
		r = r.replace(/(\r\n|\n|\r)/gm,"");
		r = r.trim();
		r = r.replace(/[`~!@#$%^&*()_|+\=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '%20');
		r =  r.replace(/ /g, "%20");
		//r = "&title=" +  r;
		
		//log(r);
		
		titles.push(r); // CREATES ARRAY OF VIDEO TITLES
		
		vids.push("https://www.youtube.com/watch?v=" + $(tiles[i]).attr("data-video-id")); // CREATES ARRAY OF VIDEO URLS
	}

	var jjj = 0;
	for (var jI = 0; jI < vids.length; jI++){
		var toastTitle;

		extract(vids[jI]).done(function (result) {
			
			for (var j = 0; j < result.formats.length; j++){
				if (result.formats[j].ext === "mp4" && typeof result.formats[j].format_note == "undefined"){
					toastTitle = titles[jjj];
					toastTitle = toastTitle.replace(/%20/g, " ");
					
					mp4s = [];
					mp4s.push(result.formats[j].url + "&title=" + titles[jjj]);
				}
			}

			//log("MP4S 1: >>" + mp4s[0], "blue"); // HIGHEST QUALITY MP4
			cdReq(mp4s[0], toastTitle, uploadFolderId);
			
			jjj++;
			
			setTimeout(function(){
				if (jjj === jI){
					toastr.info("Finished!");	
				}
			}, 5000);
		});
	}

});

if (window.top === window.self) {
//=========MAIN WINDOW=========//
	if (document.location.href.indexOf("touch.hive.im") !== -1){
		return;	
	}
	
	createFolder(folderName);
	
		if (!$("#iframeHive").length || typeof auth == "undefined"){
			var iframe = document.createElement('iframe');
			iframe.id = "iframeHive";
			iframe.src = "https://touch.hive.im/account/?1";
			iframe.style = "height: 0px; width: 0px; display: none; overflow:hidden";
			document.body.appendChild(iframe);
			$("#iframeHive").attr("style", "height: 0px; width: 0px; display: none; overflow:hidden");
			//$("#iframeHive").attr("style", "height: 600px; width: 600px; display: block; overflow:hidden");
			log("iframe created! " + nameB);
		}
		
		var onceB = 0;
		setInterval(function(){
			//log("AA: " + auth);
			if (onceB === 0 && typeof auth !== "undefined"){
				GM_setValue("ready", "true")
				GM_setValue("auth", auth);
				$("#iframeHive").remove();
				//log("TRUE: " + auth);
			}
			
			if (onceB === 0 && GM_getValue("ready") == "true"){
				onceB =  1;
				
				auth = GM_getValue("auth");
				log("A: " + auth);
				
				$("#iframeHive").remove();
				//init();
			}
		}, 250);
	
	$(document).on("click", "a", function(evt){ // MAIN CLICK EVENT
		if ($(this).attr('href').indexOf('googlevideo') !== -1){
			if (uploadToHive === false)
				return;

				log($("#hiveSwitch").attr("src"));
				
				evt.preventDefault();
				ru = $(this).attr('href');
			//log("pre: " + ru);
				ru = ru.replace(/ /g, "%20");
			
			//log("post: " + ru);
			var vidTitle = $("#eow-title").attr("title");
			cdReq(ru, vidTitle, uploadFolderId);
		}
	});
} 
else 
{
//=========IFRAME WINDOW=========//
	try{
		auth = unsafeWindow.account.token;
	}
	catch(err){}
	
	var once = 0;
	setInterval(function(){ // EVENT FOR WHEN PAGE IS LOADED // RUNS ONCE
		if (once === 0 && $("#username").text().indexOf("My Account") !== -1){
			once = 1;
			log("ready");
			
			auth = unsafeWindow.account.token;
			GM_setValue("auth", unsafeWindow.account.token);
			GM_setValue("ready", "true");
			
		}
		else if (once === 1 && auth == "undefined"){
			GM_setValue("ready", "false");	
			try{
				auth = unsafeWindow.account.token;
			}
			catch(err){}
		}
	}, 200);
}
//===========DS===========\\

// START YT-LINKS CODE //
var YT_FORMATS = {
    '5': {'ext': 'flv', 'width': 400, 'height': 240},
    '6': {'ext': 'flv', 'width': 450, 'height': 270},
    '13': {'ext': '3gp'},
    '17': {'ext': '3gp', 'width': 176, 'height': 144},
    '18': {'ext': 'mp4', 'width': 640, 'height': 360},
    '22': {'ext': 'mp4', 'width': 1280, 'height': 720},
    '34': {'ext': 'flv', 'width': 640, 'height': 360},
    '35': {'ext': 'flv', 'width': 854, 'height': 480},
    '36': {'ext': '3gp', 'width': 320, 'height': 240},
    '37': {'ext': 'mp4', 'width': 1920, 'height': 1080},
    '38': {'ext': 'mp4', 'width': 4096, 'height': 3072},
    '43': {'ext': 'webm', 'width': 640, 'height': 360},
    '44': {'ext': 'webm', 'width': 854, 'height': 480},
    '45': {'ext': 'webm', 'width': 1280, 'height': 720},
    '46': {'ext': 'webm', 'width': 1920, 'height': 1080},
    '59': {'ext': 'mp4', 'width': 854, 'height': 480},
    '78': {'ext': 'mp4', 'width': 854, 'height': 480},

    // 3d videos
    '82': {'ext': 'mp4', 'height': 360, 'format_note': '3D', 'preference': -20},
    '83': {'ext': 'mp4', 'height': 480, 'format_note': '3D', 'preference': -20},
    '84': {'ext': 'mp4', 'height': 720, 'format_note': '3D', 'preference': -20},
    '85': {'ext': 'mp4', 'height': 1080, 'format_note': '3D', 'preference': -20},
    '100': {'ext': 'webm', 'height': 360, 'format_note': '3D', 'preference': -20},
    '101': {'ext': 'webm', 'height': 480, 'format_note': '3D', 'preference': -20},
    '102': {'ext': 'webm', 'height': 720, 'format_note': '3D', 'preference': -20},

    // Apple HTTP Live Streaming
    '92': {'ext': 'mp4', 'height': 240, 'format_note': 'HLS', 'preference': -10},
    '93': {'ext': 'mp4', 'height': 360, 'format_note': 'HLS', 'preference': -10},
    '94': {'ext': 'mp4', 'height': 480, 'format_note': 'HLS', 'preference': -10},
    '95': {'ext': 'mp4', 'height': 720, 'format_note': 'HLS', 'preference': -10},
    '96': {'ext': 'mp4', 'height': 1080, 'format_note': 'HLS', 'preference': -10},
    '132': {'ext': 'mp4', 'height': 240, 'format_note': 'HLS', 'preference': -10},
    '151': {'ext': 'mp4', 'height': 72, 'format_note': 'HLS', 'preference': -10},

    // DASH mp4 video
    '133': {'ext': 'mp4', 'height': 240, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '134': {'ext': 'mp4', 'height': 360, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '135': {'ext': 'mp4', 'height': 480, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '136': {'ext': 'mp4', 'height': 720, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '137': {'ext': 'mp4', 'height': 1080, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '138': {'ext': 'mp4', 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},  // Height can vary (https://github.com/rg3/youtube-dl/issues/4559)
    '160': {'ext': 'mp4', 'height': 144, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '264': {'ext': 'mp4', 'height': 1440, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '298': {
        'ext': 'mp4',
        'height': 720,
        'format_note': 'DASH video',
        'acodec': 'none',
        'preference': -40,
        'fps': 60,
        'vcodec': 'h264'
    },
    '299': {
        'ext': 'mp4',
        'height': 1080,
        'format_note': 'DASH video',
        'acodec': 'none',
        'preference': -40,
        'fps': 60,
        'vcodec': 'h264'
    },
    '266': {
        'ext': 'mp4',
        'height': 2160,
        'format_note': 'DASH video',
        'acodec': 'none',
        'preference': -40,
        'vcodec': 'h264'
    },

    // Dash mp4 audio
    '139': {
        'ext': 'm4a',
        'format_note': 'DASH audio',
        'acodec': 'aac',
        'vcodec': 'none',
        'abr': 48,
        'preference': -50,
        'container': 'm4a_dash'
    },
    '140': {
        'ext': 'm4a',
        'format_note': 'DASH audio',
        'acodec': 'aac',
        'vcodec': 'none',
        'abr': 128,
        'preference': -50,
        'container': 'm4a_dash'
    },
    '141': {
        'ext': 'm4a',
        'format_note': 'DASH audio',
        'acodec': 'aac',
        'vcodec': 'none',
        'abr': 256,
        'preference': -50,
        'container': 'm4a_dash'
    },

    // Dash webm
    '167': {
        'ext': 'webm',
        'height': 360,
        'width': 640,
        'format_note': 'DASH video',
        'acodec': 'none',
        'container': 'webm',
        'vcodec': 'VP8',
        'preference': -40
    },
    '168': {
        'ext': 'webm',
        'height': 480,
        'width': 854,
        'format_note': 'DASH video',
        'acodec': 'none',
        'container': 'webm',
        'vcodec': 'VP8',
        'preference': -40
    },
    '169': {
        'ext': 'webm',
        'height': 720,
        'width': 1280,
        'format_note': 'DASH video',
        'acodec': 'none',
        'container': 'webm',
        'vcodec': 'VP8',
        'preference': -40
    },
    '170': {
        'ext': 'webm',
        'height': 1080,
        'width': 1920,
        'format_note': 'DASH video',
        'acodec': 'none',
        'container': 'webm',
        'vcodec': 'VP8',
        'preference': -40
    },
    '218': {
        'ext': 'webm',
        'height': 480,
        'width': 854,
        'format_note': 'DASH video',
        'acodec': 'none',
        'container': 'webm',
        'vcodec': 'VP8',
        'preference': -40
    },
    '219': {
        'ext': 'webm',
        'height': 480,
        'width': 854,
        'format_note': 'DASH video',
        'acodec': 'none',
        'container': 'webm',
        'vcodec': 'VP8',
        'preference': -40
    },
    '278': {
        'ext': 'webm',
        'height': 144,
        'format_note': 'DASH video',
        'acodec': 'none',
        'preference': -40,
        'container': 'webm',
        'vcodec': 'VP9'
    },
    '242': {'ext': 'webm', 'height': 240, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '243': {'ext': 'webm', 'height': 360, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '244': {'ext': 'webm', 'height': 480, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '245': {'ext': 'webm', 'height': 480, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '246': {'ext': 'webm', 'height': 480, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '247': {'ext': 'webm', 'height': 720, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '248': {'ext': 'webm', 'height': 1080, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '271': {'ext': 'webm', 'height': 1440, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '272': {'ext': 'webm', 'height': 2160, 'format_note': 'DASH video', 'acodec': 'none', 'preference': -40},
    '302': {
        'ext': 'webm',
        'height': 720,
        'format_note': 'DASH video',
        'acodec': 'none',
        'preference': -40,
        'fps': 60,
        'vcodec': 'VP9'
    },
    '303': {
        'ext': 'webm',
        'height': 1080,
        'format_note': 'DASH video',
        'acodec': 'none',
        'preference': -40,
        'fps': 60,
        'vcodec': 'VP9'
    },
    '308': {
        'ext': 'webm',
        'height': 1440,
        'format_note': 'DASH video',
        'acodec': 'none',
        'preference': -40,
        'fps': 60,
        'vcodec': 'VP9'
    },
    '313': {
        'ext': 'webm',
        'height': 2160,
        'format_note': 'DASH video',
        'acodec': 'none',
        'preference': -40,
        'vcodec': 'VP9'
    },
    '315': {
        'ext': 'webm',
        'height': 2160,
        'format_note': 'DASH video',
        'acodec': 'none',
        'preference': -40,
        'fps': 60,
        'vcodec': 'VP9'
    },

    // Dash webm audio
    '171': {'ext': 'webm', 'vcodec': 'none', 'format_note': 'DASH audio', 'abr': 128, 'preference': -50},
    '172': {'ext': 'webm', 'vcodec': 'none', 'format_note': 'DASH audio', 'abr': 256, 'preference': -50},

    // Dash webm audio with opus inside
    '249': {
        'ext': 'webm',
        'vcodec': 'none',
        'format_note': 'DASH audio',
        'acodec': 'opus',
        'abr': 50,
        'preference': -50
    },
    '250': {
        'ext': 'webm',
        'vcodec': 'none',
        'format_note': 'DASH audio',
        'acodec': 'opus',
        'abr': 70,
        'preference': -50
    },
    '251': {
        'ext': 'webm',
        'vcodec': 'none',
        'format_note': 'DASH audio',
        'acodec': 'opus',
        'abr': 160,
        'preference': -50
    },

    // RTMP (unnamed)
    '_rtmp': {'protocol': 'rtmp'},
}

// QueryString - begin

// This is public domain code written in 2011 by Jan Wolter and distributed
// for free at http://unixpapa.com/js/querystring.html
//
// Query String Parser
//
//    qs= new QueryString()
//    qs= new QueryString(string)
//
//        Create a query string object based on the given query string. If
//        no string is given, we use the one from the current page by default.
//
//    qs.value(key)
//
//        Return a value for the named key.  If the key was not defined,
//        it will return undefined. If the key was multiply defined it will
//        return the last value set. If it was defined without a value, it
//        will return an empty string.
//
//   qs.values(key)
//
//        Return an array of values for the named key. If the key was not
//        defined, an empty array will be returned. If the key was multiply
//        defined, the values will be given in the order they appeared on
//        in the query string.
//
//   qs.keys()
//
//        Return an array of unique keys in the query string.  The order will
//        not necessarily be the same as in the original query, and repeated
//        keys will only be listed once.
//
//    QueryString.decode(string)
//
//        This static method is an error tolerant version of the builtin
//        function decodeURIComponent(), modified to also change pluses into
//        spaces, so that it is suitable for query string decoding. You
//        shouldn't usually need to call this yourself as the value(),
//        values(), and keys() methods already decode everything they return.
//
// Note: W3C recommends that ; be accepted as an alternative to & for
// separating query string fields. To support that, simply insert a semicolon
// immediately after each ampersand in the regular expression in the first
// function below.

function QueryString(qs) {
    this.dict = {};

    // If no query string  was passed in use the one from the current page
    if (!qs) qs = location.search;

    // Delete leading question mark, if there is one
    if (qs.charAt(0) == '?') qs = qs.substring(1);

    // Parse it
    var re = /([^=&]+)(=([^&]*))?/g;
    while (match = re.exec(qs)) {
        var key = decodeURIComponent(match[1].replace(/\+/g, ' '));
        var value = match[3] ? QueryString.decode(match[3]) : '';
        if (this.dict[key])
            this.dict[key].push(value);
        else
            this.dict[key] = [value];
    }
}

QueryString.decode = function (s) {
    s = s.replace(/\+/g, ' ');
    s = s.replace(/%([EF][0-9A-F])%([89AB][0-9A-F])%([89AB][0-9A-F])/gi,
        function (code, hex1, hex2, hex3) {
            var n1 = parseInt(hex1, 16) - 0xE0;
            var n2 = parseInt(hex2, 16) - 0x80;
            if (n1 == 0 && n2 < 32) return code;
            var n3 = parseInt(hex3, 16) - 0x80;
            var n = (n1 << 12) + (n2 << 6) + n3;
            if (n > 0xFFFF) return code;
            return String.fromCharCode(n);
        });
    s = s.replace(/%([CD][0-9A-F])%([89AB][0-9A-F])/gi,
        function (code, hex1, hex2) {
            var n1 = parseInt(hex1, 16) - 0xC0;
            if (n1 < 2) return code;
            var n2 = parseInt(hex2, 16) - 0x80;
            return String.fromCharCode((n1 << 6) + n2);
        });
    s = s.replace(/%([0-7][0-9A-F])/gi,
        function (code, hex) {
            return String.fromCharCode(parseInt(hex, 16));
        });
    return s;
};

QueryString.prototype.value = function (key) {
    var a = this.dict[key];
    return a ? a[a.length - 1] : undefined;
};

QueryString.prototype.values = function (key) {
    var a = this.dict[key];
    return a ? a : [];
};

QueryString.prototype.keys = function () {
    var a = [];
    for (var key in this.dict)
        a.push(key);
    return a;
};

// QueryString - end

var Queue = function () {
    var previous = new $.Deferred().resolve();

    return function (fn, fail) {
        return previous = previous.then(fn, fail || fn);
    };
};

var queue = Queue(); // lower case for idiomatic use

var LAST_PLAYER_URL = null;
var LAST_FUNC = null;

function log(s) {
    try {
        console.log(s);
    } catch (ignore) {
    }
}

function download(url) {
    log('Downloading webpage ' + url);

    var deferred = $.Deferred();

    //var userAgent = navigator.userAgent;
    var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36';

    $.get('http://query.yahooapis.com/v1/public/yql', {
        q: 'select * from xClient where url="' + url + '" and ua="' + userAgent + '"',
        format: 'json',
        env: 'store://datatables.org/alltableswithkeys',
        callback: ''
    }).done(function (data) {
        try {
            deferred.resolve(data.query.results.resources.content);
        } catch (e) {
            log(e);
            deferred.resolve(null);
        }
    });

    return deferred.promise();
}

function extractId(url) {
    var r = /^http(s?):\/\/www\.youtube\.com\/watch\?v=(.+)/.exec(url);
    return r !== null ? r[2] : null;
}

function searchRegex(regex, string, defaultValue) {
    var r = regex.exec(string);

    if (r !== null) {
        return r[1];
    } else {
        return defaultValue;
    }
}

function parseQS(s) {
    var qs = new QueryString(s);

    var obj = {};

    var keys = qs.keys();
    var size = keys.length;

    for (var i = 0; i < size; i++) {
        var k = keys[i];
        obj[k] = qs.values(k);
    }

    return obj;
}

function decryptSignature(s, playerUrl) {
    var deferred = $.Deferred();

    if (playerUrl === null) {
        log('Cannot decrypt signature without player_url');
        deferred.resolve(null);
    }

    if (playerUrl.indexOf('//') === 0) {
        playerUrl = 'https:' + playerUrl;
    }

    if (LAST_PLAYER_URL === playerUrl && LAST_FUNC !== null) {
        var func = LAST_FUNC;
        var signature = func(s);
        deferred.resolve(signature);
    } else {
        download(playerUrl).done(function (jscode) {
            var func = null;

            if (LAST_PLAYER_URL === playerUrl && LAST_FUNC !== null) {
                func = LAST_FUNC;
            } else {

                var r = /\.sig\|\|([a-zA-Z0-9$]+)\(/.exec(jscode);
                if (r === null) {
                    log("Couldn't find the signature code with regex");
                }

                var funcname = r[1];

                function shortcut(jscode) {
                    var p = jscode.split('function ' + funcname + '(');
                    if (p.length !== 2) {
                        return null;
                    }

                    var i1 = p[0].lastIndexOf('};var ');
                    if (i1 === -1) {
                        return null;
                    }

                    var p1 = p[0].substr(i1 + 2);

                    var i2 = p[1].indexOf('};');
                    if (i2 === -1) {
                        return null;
                    }

                    var p2 = p[1].substr(0, i2 + 2);

                    return p1 + 'function ' + funcname + '(' + p2;
                }

                var temp = shortcut(jscode);
                if (temp !== null) {
                    jscode = temp;
                }

                var ast = esprima.parse(jscode);

                function traverse(object, level, visitor) {
                    var key, child;

                    if (visitor.call(null, object) === false) {
                        return;
                    }

                    if (level > 8) {
                        return;
                    }

                    for (key in object) {
                        if (object.hasOwnProperty(key)) {
                            child = object[key];
                            if (typeof child === 'object' && child !== null) {
                                traverse(child, level + 1, visitor);
                            }
                        }
                    }
                }

                traverse(ast, 0, function (node) {
                    if (node.type === 'FunctionDeclaration' && node.id.name == funcname) {
                        func = eval('(' + escodegen.generate(node) + ')');
                    }

                    if (node.type === 'VariableDeclarator') {
                        try {
                            eval(escodegen.generate(node));
                        } catch (ignore) {
                        }
                    }
                });

                LAST_PLAYER_URL = playerUrl;
                LAST_FUNC = func;
            }

            var signature = func(s);
            deferred.resolve(signature);
        });
    }

    return deferred.promise();
}

function parseDashManifest(video_id, dash_manifest_url, player_url, age_gate) {
    var deferred = $.Deferred();

    var r = /\/s\/([a-fA-F0-9\.]+)/.exec(dash_manifest_url);

    if (r !== null) {
        var s = r[1];

        var formats = [];

        decryptSignature(s, player_url).done(function (dec_s) {
            dash_manifest_url = dash_manifest_url.replace(new RegExp('/s/' + s), '/signature/' + dec_s);

            download(dash_manifest_url).done(function (dash_doc) {
                dash_doc = $.parseXML(dash_doc);

                $(dash_doc).find('AdaptationSet').each(function (index, elemSet) {
                    var mimeType = $(elemSet).attr('mimeType');

                    $(elemSet).find('Representation').each(function (index, elemRep) {
                        var url_el = $(elemRep).find('BaseURL');

                        if (mimeType.indexOf('audio/') === 0 || mimeType.indexOf('video/') === 0) {

                            var format_id = $(elemRep).attr('id');
                            var video_url = $(url_el).text();
                            var filesize = parseInt($(url_el).attr('yt:contentLength'));

                            var f = {
                                format_id: format_id,
                                url: video_url,
                                widt: parseInt($(elemRep).attr('width')),
                                height: parseInt($(elemRep).attr('height')),
                                filesize: filesize
                            }

                            formats.push(f);
                        }
                    });
                });

                deferred.resolve({
                    dash_manifest_url: dash_manifest_url,
                    formats: formats
                });
            });
        });
    } else {
        deferred.resolve(null);
    }

    return deferred.promise();
}

function getSubtitles(videoId) {
    var deferred = $.Deferred();

    download('https://video.google.com/timedtext?hl=en&type=list&v=' + videoId).done(function (subsDoc) {
        subsDoc = $.parseXML(subsDoc);

        var subLangList = {};

        $(subsDoc).find('track').each(function (index, track) {
            var lang = $(track).attr('lang_code');
            if (subLangList.hasOwnProperty(lang)) {
                return;
            }

            var subFormats = [];

            ['sbv', 'vtt', 'srt'].forEach(function (ext) {
                var params = $.param({
                    lang: lang,
                    v: videoId,
                    fmt: ext,
                    name: $(track).attr('name'),
                });

                subFormats.push({
                    'url': 'https://www.youtube.com/api/timedtext?' + params,
                    'ext': ext,
                });
            });

            subLangList[lang] = subFormats;
        });

        deferred.resolve(subLangList);
    }).fail(function () {
        deferred.resolve(null);
    });

    return deferred.promise();
}

function extractSupport(video_id, video_webpage, age_gate, embed_webpage, video_info) {
    var deferred = $.Deferred();

    function fail(s) {
        log(s);
        deferred.resolve(null);
        return deferred.promise();
    }

    if (!video_info.hasOwnProperty('token')) {
        if (video_info.hasOwnProperty('reason')) {
            return fail('YouTube said: ' + video_info['reason'][0]);
        }
        else {
            return fail('"token" parameter not in video info for unknown reason');
        }
    }

    var view_count = 0;
    if (video_info.hasOwnProperty('view_count')) {
        view_count = parseInt(video_info['view_count'][0]);
    }

    // Check for "rental" videos
    if (video_info.hasOwnProperty('ypc_video_rental_bar_text') && !video_info.hasOwnProperty('author')) {
        return fail('"rental" videos not supported');
    }

    //Start extracting information
    //self.report_information_extraction(video_id)

    // uploader
    if (!video_info.hasOwnProperty('author')) {
        return fail('Unable to extract uploader name');
    }

    var video_uploader = decodeURIComponent(video_info['author'][0]);

    // uploader_id
    var video_uploader_id = null;

    var mobj = /<link itemprop="url" href="http:\/\/www.youtube.com\/(?:user|channel)\/([^"]+)">/.exec(video_webpage);
    if (mobj !== null) {
        video_uploader_id = mobj[1];
    }
    else {
        //return fail('unable to extract uploader nickname');
        log('unable to extract uploader nickname');
    }

    // title
    var video_title = '_';
    if (video_info.hasOwnProperty('title')) {
        video_title = video_info['title'][0];
    }
    else {
        return fail('Unable to extract video title');
    }

    // upload date
    var upload_date = null;
    mobj = /id="eow-date.*?>(.*?)<\/span>/.exec(video_webpage);
    if (mobj === null) {
        mobj = /id="watch-uploader-info".*?>.*?(?:Published|Uploaded|Streamed live) on (.*?)<\/strong>/.exec(video_webpage);
    }
    if (mobj !== null) {
        upload_date = new Date(mobj[1]);
        //upload_date = ' '.join(re.sub(r'[/,-]', r' ', mobj.group(1)).split())
        //upload_date = unified_strdate(upload_date)
    }

    // TODO: categories

    // description
    // TODO:

    // subtitles
    var videoSubtitles = null;
    queue(function () {
        return getSubtitles(video_id).done(function (subs) {
            videoSubtitles = subs;
        });
    });
    // TODO:
    //automatic_captions = self.extract_automatic_captions(video_id, video_webpage)

    var video_duration = null;
    if (!video_info.hasOwnProperty('length_seconds')) {
        return fail('unable to extract video duration');
    }
    else {
        video_duration = parseInt(decodeURIComponent(video_info['length_seconds'][0]));
    }

    // TODO:
    // annotations
    //video_annotations = None
    //if self._downloader.params.get('writeannotations', False):
    //  video_annotations = self._extract_annotations(video_id)

    var formats = [];

    if (video_info.hasOwnProperty('conn') && video_info['conn'][0].startswith('rtmp')) {
        return fail('RTMP not supported');
    } else if (video_info.hasOwnProperty('url_encoded_fmt_stream_map') || video_info.hasOwnProperty('adaptive_fmts')) {
        var encodedUrlMap = '';
        if (video_info.hasOwnProperty('url_encoded_fmt_stream_map')) {
            encodedUrlMap = encodedUrlMap + ',' + video_info['url_encoded_fmt_stream_map'][0];
        }
        if (video_info.hasOwnProperty('adaptive_fmts')) {
            encodedUrlMap = encodedUrlMap + ',' + video_info['adaptive_fmts'][0];
        }
        if (encodedUrlMap.indexOf('rtmpe%3Dyes') !== -1) {
            return fail('rtmpe downloads are not supported');
        }

        var arr = encodedUrlMap.split(',');
        var size = arr.length;

        for (var i = 0; i < size; i++) {
            if (arr[i].length == 0) {
                continue;
            }

            var urlData = parseQS(arr[i]);

            if (!urlData.hasOwnProperty('itag') || !urlData.hasOwnProperty('url')) {
                continue;
            }

            var formatId = urlData['itag'][0];
            var url = urlData['url'][0];

            if (url.indexOf('ratebypass') === -1) {
                url += '&ratebypass=yes';
            }

            if (urlData.hasOwnProperty('sig')) {
                url += '&signature=' + urlData['sig'][0];
                formats.push({
                    format_id: formatId,
                    url: url
                });
            } else if (urlData.hasOwnProperty('s')) {
                var encrypted_sig = urlData['s'][0];
                var ASSETS_RE = /"assets":.+?"js":\s*("[^"]+")/;

                var jsplayer_url_json = searchRegex(ASSETS_RE, age_gate ? embed_webpage : video_webpage);

                // TODO:
                /*
                 if not jsplayer_url_json and not age_gate:
                 # We need the embed website after all
                 if embed_webpage is None:
                 embed_url = proto + '://www.youtube.com/embed/%s' % video_id
                 embed_webpage = self._download(
                 embed_url, video_id, 'Downloading embed webpage')
                 jsplayer_url_json = self._searchRegex(
                 ASSETS_RE, embed_webpage, 'JS player URL')
                 */

                var playerUrl = JSON.parse(jsplayer_url_json);

                (function (encrypted_sig, playerUrl, formatId, url) {
                    queue(function () {
                        return decryptSignature(encrypted_sig, playerUrl).done(function (signature) {
                            url += '&signature=' + signature;
                            formats.push({
                                format_id: formatId,
                                url: url
                            });
                        });
                    });
                })(encrypted_sig, playerUrl, formatId, url);
            } else if (url.indexOf('signature') !== -1) { // already decrypted
                formats.push({
                    format_id: formatId,
                    url: url
                });
            }
        }
    } else if (video_info.hasOwnProperty('hlsvp')) {
        return fail('HLS not supported');
    } else {
        return fail('no conn, hlsvp or url_encoded_fmt_stream_map information found in video info');
    }

    var dashManifestUrl = null;

    function buildResult(formats) {
        var size = formats.length;

        for (var i = 0; i < size; i++) {
            var fmt = formats[i];
            var master = YT_FORMATS[fmt['format_id']];

            $.extend(fmt, master);
        }

        return {
            'id': video_id,
            'uploader': video_uploader,
            'uploader_id': video_uploader_id,
            'upload_date': upload_date,
            'title': video_title,
            'thumbnail': 'https://i.ytimg.com/vi/' + video_id + '/hqdefault.jpg',
            //'description': video_description,
            //'categories': video_categories,
            subtitles: videoSubtitles,
            //'automatic_captions': automatic_captions,
            'duration': video_duration,
            'age_limit': age_gate ? 18 : 0,
            //'annotations': video_annotations,
            'webpage_url': 'https://www.youtube.com/watch?v=' + video_id,
            'view_count': view_count,
            //'average_rating': float_or_none(video_info.get('avg_rating', [None])[0]),
            'formats': formats,
            dash_manifest_url: dashManifestUrl
        }
    }

    // Look for the DASH manifest
    if (video_info.hasOwnProperty('dashmpd')) {
        dashManifestUrl = video_info['dashmpd'][0];

        queue(function () {
            return parseDashManifest(video_id, dashManifestUrl, playerUrl, age_gate).done(function (dash) {
                if (dash != null) {
                    dashManifestUrl = dash.dash_manifest_url;
                }
                deferred.resolve(buildResult(dash && dash.formats ? formats.concat(dash.formats) : formats));
            });
        });
    }

    return deferred.promise();
}

function extract(url) {

    var deferred = $.Deferred();

    var video_id = extractId(url);

    // Get video webpage
    url = 'https://www.youtube.com/watch?v=' + video_id + '&gl=US&hl=en&has_verified=1&bpctr=9999999999';

    download(url).done(function (video_webpage) {
        var age_gate = false;

        if (/player-age-gate-content">/i.test(video_webpage)) {
            age_gate = true;
            // We simulate the access to the video from www.youtube.com/v/{video_id}
            // this can be viewed without login into Youtube
            url = 'https://www.youtube.com/embed/' + video_id;
            download(url).done(function (embed_webpage) {
                var sts = searchRegex(/"sts"\s*:\s*(\d+)/, embed_webpage);
                var videoInfoUrl = 'https://www.youtube.com/get_video_info?video_id=' + video_id + '&eurl=' + encodeURIComponent('https://youtube.googleapis.com/v/' + video_id) + '&sts=' + sts;
                download(videoInfoUrl).done(function (video_info_webpage) {
                    var video_info = parseQS(video_info_webpage);
                    extractSupport(video_id, video_webpage, age_gate, embed_webpage, video_info).done(function (result) {
                        deferred.resolve(result);
                    });
                });
            });
        } else {
            age_gate = false;
            var videoInfoUrl = 'https://www.youtube.com/get_video_info?&video_id=' + video_id + '&el=detailpage&ps=default&eurl=&gl=US&hl=en'
            download(videoInfoUrl).done(function (video_info_webpage) {
                var videoInfo = parseQS(video_info_webpage);
                extractSupport(video_id, video_webpage, age_gate, '', videoInfo).done(function (result) {
                    deferred.resolve(result);
                });
            }).fail(function () {
                deferred.resolve(null);
            });
        }
    });

    return deferred.promise();
}

function search(q) {

    var deferred = $.Deferred();

    var url = 'http://www.youtube.com/results?search_query=' + encodeURIComponent(q) + '&hl=en';

    download(url).done(function (html) {
        var re = /<h3 class="yt-lockup-title"><a href="\/watch\?v=(.*?)".*? title="(.*?)".*? Duration: (.*?)\.<\/span>.*?by <a href="\/user\/(.*?)".*?<li>([\d,]*) views<\/li>/ig;
        var m = null;

        var results = [];

        while (m = re.exec(html)) {
            var videoId = m[1];

            var r = {
                id: videoId,
                url: 'https://www.youtube.com/watch?v=' + videoId,
                title: m[2],
                duration: m[3],
                user: m[4],
                views: parseInt(m[5].replace(/,/g, ''), 10),
                thumbnail: 'https://i.ytimg.com/vi/' + videoId + '/mqdefault.jpg',
            };

            results.push(r);
        }

        deferred.resolve(results);
    });

    return deferred.promise();
}

function ytAutocompleteSource(request, response) {

    // setup global object
    if (typeof google === 'undefined') {
        google = {
            sbox: {
                p50: function (data) {
                    data = data[1];
                    var result = [];
                    var size = data.length;
                    for (var i = 0; i < size; i++) {
                        result.push(data[i][0]);
                    }
                    google.sbox.response(result);
                },
                response: function (data) {
                    log(data)
                }
            }
        }
    }

    // set global response
    google.sbox.response = response;

    $.ajax({
        url: 'https://clients1.google.com/complete/search?client=youtube&hl=en&gl=us&gs_rn=23&gs_ri=youtube&ds=yt&cp=2&gs_id=8',
        dataType: 'script',
        data: {
            q: request.term,
            callback: 'google.sbox.p50'
        },
        success: function (data) {
            // ignore
        }
    });
}
// END YT-LINKS CODE //

// START WAITFORKEYELEMENTS CODE //
/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
// END WAITFORKEYELEMENTS CODE //

