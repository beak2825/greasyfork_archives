// ==UserScript==
// @name         	Hive - Magnet Catcher
// @namespace    	https://openuserjs.org/users/DefSoul/scripts
// @description  	When enabled will hook magnets when clicked and send to hive
// @version      	2.0 > Fixed page detection (works on kat, eztv etc)
// @author       	DefSoul
// @include         http*://*
// @include		  	http*://touch.hive.im/account/*
// @include		  	http*://api.hive.im/api/*
// @exclude		 	http*://www.youtube.com/*
// @exclude		 	http*://*.google.com/*
// @exclude		 	http*://*.stripe.com/*
// @exclude		 	http*://*.facebook.com/*
// @exclude		 	http*://facebook.com/*
// @exclude		  	about:blank
// @grant		 	GM_getValue
// @grant		 	GM_setValue
// @grant		 	GM_deleteValue
// @grant		 	GM_listValues
// @grant		 	GM_log
// @grant		 	GM_xmlhttpRequest
// @grant       	GM_addStyle
// @grant       	GM_getResourceText
// @require      	http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @resource     	toastrCss          http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @require      	http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @downloadURL https://update.greasyfork.org/scripts/10587/Hive%20-%20Magnet%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/10587/Hive%20-%20Magnet%20Catcher.meta.js
// ==/UserScript==

// CONFIG //
var folderName = "# Magnets #"; // CASE SENSITIVE
// END CONFIG //

var nameB = "Magnet Catcher: Test ";
GM_log(nameB + location.href);

var mag;
var auth;
auth = GM_getValue("auth");
var link;
GM_setValue("ready", "false");
//GM_deleteValue("auth");

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

var newCSS = GM_getResourceText ("toastrCss");
GM_addStyle(newCSS);

function log(str, colour){console.log('%c dbg> ' + str, 'background: #D3D3D3; color: ' + colour);} // CUSTOM LOG

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
//--------------------
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
	//log("cdReq start: " + href);
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
			
			//log("cdReq >" + data.responseText);
			
			//transferItemsList(); // GO GET ITEMS IN CURRENT TRANSFER LIST
		}
	});	
}

function torrentInfo(str){ // EXPERIMENTAL
	try {
		var result = "";
		result = unescape(str);
		
		log(result);
		
		result = result.match(/dn=(.*?)tr=/g); // EXTRACTION INTO ARRAY
		result[0] = result[0].replace("dn=", "");
		result[0] = result[0].replace("&amp;tr=", "");
		result[0] = result[0].replace("&tr=", "");
		result[0] = result[0].replace(/\+/g, " ");

		//var myRegexp = /(.*?)\.S?(\d{1,2})E?(\d{2})\.(.*)/g;
		//var match = myRegexp.exec(result[0]);
		
		var name = result[0];
		//var season = match[2];
		//var episode = match[3];
		//name = name.replace(/\./g, " ");
		//var r = result[0].toString();
		var r = result[0];
		
		//log("" + r + "> " + folderId);
		return r;
	}
	catch(err){ 
		log("oh o! " + err, "red"); 
	}
}

//
if (window.top === window.self) {
//=========MAIN WINDOW=========//
	//log(document.documentElement.innerHTML);
	var source = document.documentElement.innerHTML;
	try{
		bA = $("body h1").html();
		
		if (typeof bA == "undefined"){
			bA = "";	
		}
		
		log(bA + nameB + " >body h1");
	}
	catch(err){bA = "";}
	
	if (bA.indexOf("Index of") == -1 && document.location.href.indexOf("touch.hive.im") == -1){
		createFolder(folderName);
		
		//var keys = GM_listValues();
		//for (var i=0, key=null; key=keys[i]; i++) {
		//  GM_deleteValue(key);
		//}
			if (!$("#iframeHive").length || typeof auth === "undefined"){
				var iframe = document.createElement('iframe');
				iframe.id = "iframeHive";
				iframe.src = "https://touch.hive.im/account/?3";
				iframe.style = "height: 0px; width: 0px; display: none; overflow:hidden";
				document.body.appendChild(iframe);
				$("#iframeHive").attr("style", "height: 0px; width: 0px; display: none; overflow:hidden");
				//$("#iframeHive").attr("style", "height: 600px; width: 600px; display: block; overflow:hidden");
				log("iframe created! " + nameB + ": " + location.href);
			}

			var onceB = 0;
			setInterval(function(){
				//log("AA: " + auth);
				if (onceB === 0 && typeof auth !== "undefined"){
					GM_setValue("ready", "true");
					GM_setValue("auth", auth);
					//$("#iframeHive").remove();
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

		$(document).on("click", "a", function(event){ // selector click event
			if ($(this).attr('href').indexOf("magnet") !== -1){
				mag = $(this).attr('href');
				event.preventDefault();
				log("WE GOT A MAGNET OVA HERE >" + mag);

				$('body').prepend('<a href="#" class="hive">Hive</a>');
				$(".hive").attr("style", 'display: block;width: 40px;height: 40px;text-indent: -9999px;position: fixed;z-index: 999999;right: 50%;top: 3px;background: url("http://imgh.us/download_4.svg") no-repeat center 50%;border-radius: 30px');
				$(".hive").fadeOut("slow");

				cdReq(mag, torrentInfo(mag), uploadFolderId);
			}
		});
	}
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
			
			try{
				auth = unsafeWindow.account.token;
			}
			catch(err){}
			GM_setValue("auth", unsafeWindow.account.token);
			GM_setValue("ready", "true");
			
		}
		else if (once === 1 && typeof auth == "undefined"){
			GM_setValue("ready", "false");	
			try{
				auth = unsafeWindow.account.token;
			}
			catch(err){}
		}
	}, 200);
}


