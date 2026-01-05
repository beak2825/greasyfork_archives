// ==UserScript==
// @name            Hive - Send to Hive Index Page
// @namespace     	https://openuserjs.org/users/DefSoul/scripts
// @description     Allows sending multiple items from index pages to hive
// @version         2.4 > Transfers now go into Videos/# Index # (Can be changed in source config)
// @author          DefSoul
// @include         http*://*
// @include		  	http*://touch.hive.im/account/*
// @include		  	http*://api.hive.im/api/*
// @exclude		 	http*://www.youtube.com/*
// @exclude		 	http*://*.google.com/*
// @exclude		 	http*://*.stripe.com/*
// @exclude		 	http*://*.facebook.com/*
// @exclude		 	http*://facebook.com/*
// @grant		 	GM_getValue
// @grant		 	GM_setValue
// @grant			GM_deleteValue
// @grant			GM_listValues
// @grant		 	GM_log
// @grant		 	GM_xmlhttpRequest
// @grant       	GM_addStyle
// @grant       	GM_getResourceText
// @require      	http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @resource     	toastrCss          http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @require      	http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @require      	https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js
// @resource     	jQueryUICSS          http://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css
// @downloadURL https://update.greasyfork.org/scripts/10588/Hive%20-%20Send%20to%20Hive%20Index%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/10588/Hive%20-%20Send%20to%20Hive%20Index%20Page.meta.js
// ==/UserScript==
/*jshint multistr: true */

// CONFIG //
var detectIndexPage = true; // FALSE MEANS IT WILL RUN ON EVERY PAGE
var folderName = "# Index #"; // CASE SENSITIVE
// END CONFIG //

// GLOBALS //
var nameB = "Send to Hive Index Page: Test ";
GM_log(nameB + location.href);
var auth;
var bA;
var postMag = [];
var a = [];
var s;
var origHref = [];
var uploadFolderId;

//auth = "";
//GM_deleteValue("auth");

auth = GM_getValue("auth");
var link;
GM_setValue("ready", "false");

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
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

//=========
function log(str, colour){console.log('%c dbg> ' + str, 'background: #D3D3D3; color: ' + colour);} // CUSTOM LOG

var newCSS = GM_getResourceText ("toastrCss");
GM_addStyle(newCSS);

var newCSS2 = GM_getResourceText ("jQueryUICSS");
GM_addStyle(newCSS2);

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
//

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
};

$(document).on("click", "#bntDAll", function(){ // selector click event
	log("bntDALL clicked begin ");
	log("btnDALL: begin " + $(".ui-selected").attr("href")); 
	postMag.length = 0;
	s = "";
	a = $('.ui-selected').map(function(){      //	puts all un-encoded videos ids into an array
		return document.location.href + $(this).attr("href");		// returns an int array of videos id values
	});
	
	origHref = $('.ui-selected').map(function(){      //	puts all un-encoded videos ids into an array
		return $(this).attr("href");		// returns an int array of videos id values
	});

	for (var i = 0; i < a.length; i++){
		s = a[i];
		if (s.indexOf(".avi") 	!== -1 ||
    		s.indexOf(".mp4") 	!== -1 || 
    		s.indexOf(".flp") 	!== -1 || 
    		s.indexOf(".mp3") 	!== -1 || 
    		s.indexOf(".mpg") 	!== -1 || 
    		s.indexOf(".mov") 	!== -1 ||
    		s.indexOf(".mpeg") 	!== -1 ||
    		s.indexOf(".jpg") 	!== -1 ||
    		s.indexOf(".mkv") 	!== -1 ||
    		s.indexOf(".png") 	!== -1 ||
    		s.indexOf(".jpeg") 	!== -1 ||
    		s.indexOf(".wmv") 	!== -1){
			
			log("bntDALL: " + a[i]);
			
			cdReq(a[i], origHref[i], uploadFolderId);
			//log(a[i]);
		}
	}
	log("bntDALL clicked end");
});

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


if (window.top === window.self) {
//=========MAIN WINDOW=========//
	try{
		createFolder(folderName);
		
		bA = $("body h1").html();
		log(bA + nameB + " >body h1");
	}
	catch(err){bA = "";}
	
	if (!$("#iframeHive").length){
		var iframe = document.createElement('iframe');
		iframe.id = "iframeHive";
		iframe.src = "https://touch.hive.im/account/?3";
		iframe.style = "height: 0px; width: 0px; display: none; overflow:hidden";
		document.body.appendChild(iframe);
		
		$("#iframeHive").attr("style", "height: 0px; width: 0px; display: none; overflow:hidden");
		//$("#iframeHive").attr("style", "height: 400px; width: 600px; display: block; overflow:hidden");
		log("iframe created! " + nameB + ": " + location.href);
	}
	
	if (detectIndexPage === true && typeof bA !== "undefined" && bA.indexOf("Index of") !== -1){ // START HERE
		//toastr.info("Connecting to Hive....");
		
		$("body").append('<button type="button" id="bntDAll" title="Send Selected oo Hive" style="height: 2em; width: 12em;">Send Selected to Hive </button>');
		
		$("pre").attr("id", "selectable");
		$("pre").selectable({
			filter: ":not(:contains('/'))",
		});
		
		$("pre a:contains('/')").hover(function() { // HOVER OVER FOLDER
      		$( "pre" ).selectable( "option", "distance", 50000 );
    	});
		
		$("pre a:not(:contains('/'))").hover(function() {
			//$("pre").attr("id", "selectable");
      		$( "pre" ).selectable( "option", "distance", 0 );
    	});
		
		addGlobalStyle("#feedback { font-size: 1.4em; }\
						.ui-selecting { background: #FECA40; }\
						.ui-selected{ background: #F39814; color: white; }\
						#selectable { list-style-type: none; margin: 0; padding: 0; width: 60%; }\
						#selectable li { margin: 3px; padding: 0.4em; font-size: 1.4em; height: 18px; }");
		
		var onceB = 0;
		var onceD = 0;
		setInterval(function(){
			//log("AA: " + auth);
			//log("AA: " + onceB);
			//log("AA: " + GM_getValue("auth"));
			if (onceD === 0 && typeof auth !== "undefined"){
				//GM_setValue("ready", "true");
				//GM_setValue("auth", auth);
				log("OLD: " + auth);
				onceD = 1;
			}
			
			if (onceB === 0 && GM_getValue("ready") == "true"){
				onceB =  1;
				
				auth = GM_getValue("auth");
				log("TRUE: " + GM_getValue("auth"));
				
				$("#iframeHive").remove();
				log("#iframeHive removed");
				
				//toastr.success("Hive Connected!");
				
			}
		}, 250);

		$(document).on("click", "a", function(e){ // selector click event
			var linkA = $(this).attr("href");
			link = document.location.href + $(this).attr("href");
			log(linkA + nameB + " >link");
			if (linkA.indexOf(".avi") !== -1 ||
				linkA.indexOf(".mp4") !== -1 || 
				linkA.indexOf(".flp") !== -1 || 
				linkA.indexOf(".mp3") !== -1 || 
				linkA.indexOf(".mpg") !== -1 || 
				linkA.indexOf(".mov") !== -1 ||
				linkA.indexOf(".mpeg") !== -1 ||
				linkA.indexOf(".jpg") !== -1 ||
				linkA.indexOf(".mkv") !== -1 ||
				linkA.indexOf(".png") !== -1 ||
				linkA.indexOf(".jpeg") !== -1 ||
				linkA.indexOf(".wmv") !== -1) {
				e.preventDefault();
				log(linkA + nameB + " >link");

				log("test >" + link);

				$('body').prepend('<a href="#" class="hive">Hive</a>');
				$(".hive").attr("style", 'display: block;width: 40px;height: 40px;text-indent: -9999px;position: fixed;z-index: 999999;right: 50%;top: 3px;background: url("http://imgh.us/download_4.svg") no-repeat center 50%;border-radius: 30px');
				$(".hive").fadeOut("slow");
				
				cdReq(link, linkA, uploadFolderId);
			}
		});
	}
	else{
		try{
			 $("#bntDAll").remove();
		}
		catch(err){
			log("Could not remove btnDall");	
		}
	}
} 
else 
{
//=========IFRAME WINDOW=========//
	//GM_deleteValue("auth");
	try{
		auth = unsafeWindow.account.token;
	}
	catch(err){}
	
	var once = 0;
	setInterval(function(){ // EVENT FOR WHEN PAGE IS LOADED // RUNS ONCE
		//log($("#username").text() + nameB) + " >username";
		if (once === 0 && $("#username").text().indexOf("My Account") !== -1){
			once = 1;
			log("Iframe ready auth: " + auth);
			log("Iframe ready unsafeWindow.account.token: " + unsafeWindow.account.token);
			
			//if (auth !== unsafeWindow.account.token){
				log("auth !== unsafeWindow.account.token");
				//GM_deleteValue("auth");
				GM_setValue("auth", unsafeWindow.account.token);
				GM_setValue("ready", "true");
			//}
			//else{
				//auth = unsafeWindow.account.token;
				
				//GM_setValue("auth", unsafeWindow.account.token);
				//GM_setValue("ready", "true");
				//log("Iframe Post: ready");
			//}
			
		}
		else if (once === 1 && auth == "undefined"){
			GM_setValue("ready", "false");	
			try{
				//auth = unsafeWindow.account.token;
			}
			catch(err){
				log("iframe: " + err);
			}
		}
	}, 200);
}












