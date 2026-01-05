// ==UserScript==
// @name         HF Live Player on HackForums
// @namespace    http://saadtronics.com
// @version      0.1
// @description  Adds a web player instance of HF Live on your browser <br>http://i.imgur.com/s7DJX3R.png
// @author       Saad Tronics (King of Hearts)
// @match        http://hackforums.net/*
// @match        http://www.hackforums.net/*
// @exclude      http://www.hackforums.net/member.php?action=login
// @exclude      http://hackforums.net/member.php?action=login
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require		 http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @noframes
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/11551/HF%20Live%20Player%20on%20HackForums.user.js
// @updateURL https://update.greasyfork.org/scripts/11551/HF%20Live%20Player%20on%20HackForums.meta.js
// ==/UserScript==

/*Get everything ready for the iFrame*/
var iframe = '<iframe src="'+document.location.href +'" style="width:100%;height:100%;" frameborder="0" id="iframe" onload="resizeIframe(this);"></iframe></body>';
var settingsModal = '';
    
$("html").html(iframe);

$('<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js" />"<script language="javascript" type="text/javascript"> function getCookie(cname) {    var name = cname + "=";    var ca = document.cookie.split(\';\');    for(var i=0; i<ca.length; i++) {        var c = ca[i];        while (c.charAt(0)==\' \') c = c.substring(1);        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);    }    return "";} function setCookie(cname, cvalue, exdays) {    var d = new Date();    d.setTime(d.getTime() + (exdays*24*60*60*1000));    var expires = "expires="+d.toUTCString();    document.cookie = cname + "=" + cvalue + "; " + expires;} function resizeIframe(obj) {    obj.style.height = obj.contentWindow.document.body.scrollHeight + \'px\';  }</script>').appendTo($('head'));


$( "#iframe" ).on('load',function() {
    document.title = document.getElementById("iframe").contentDocument.title;
	
	window.history.pushState(null,null, document.getElementById("iframe").contentDocument.location.href);
});
GM_addStyle('body{position: relative;margin-top: -2px;margin-bottom: -2px;margin-left: -2px;margin-right: -2px;}');
GM_addStyle('.modalDialog { position: fixed; font-family: Arial, Helvetica, sans-serif; top: 0; right: 0; bottom: 0; left: 0; background: rgba(0, 0, 0, 0.8); z-index: 99999; opacity:0; -webkit-transition: opacity 400ms ease-in; -moz-transition: opacity 400ms ease-in; transition: opacity 400ms ease-in; pointer-events: none; } .modalDialog:target { opacity:1; pointer-events: auto; } .modalDialog > div { width: 400px; position: relative; margin: 10% auto; padding: 5px 20px 13px 20px; border-radius: 10px; background: #fff; background: -moz-linear-gradient(#fff, #999); background: -webkit-linear-gradient(#fff, #999); background: -o-linear-gradient(#fff, #999); } .close { background: #606061; color: #FFFFFF; line-height: 25px; position: absolute; right: -12px; text-align: center; top: -10px; width: 24px; text-decoration: none; font-weight: bold; -webkit-border-radius: 12px; -moz-border-radius: 12px; border-radius: 12px; -moz-box-shadow: 1px 1px 3px #000; -webkit-box-shadow: 1px 1px 3px #000; box-shadow: 1px 1px 3px #000; } .close:hover { background: #00d9ff; }');

/*Done with iFrame. Get everything ready for the htmlPlayer*/
var css = '#outer { position: fixed; bottom: 0;box-shadow: rgba(0, 0, 0, 0.298039) 1px 1px 8px 0px; color: rgb(51, 51, 0); height: 36px; width: 100%; perspective-origin: 230px 18px; transform-origin: 230px 18px; background: rgb(64, 64, 64) -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgb(68, 68, 68)), color-stop(0.5, rgb(85, 85, 85)), color-stop(0.51, rgb(68, 68, 68)), to(rgb(68, 68, 68))) repeat scroll 0% 0% / auto padding-box border-box; border: 0px none rgb(51, 51, 0); font: normal normal normal normal 12px/18px monospace; margin: 15px 0px 20px; outline: rgb(51, 51, 0) none 0px; overflow: hidden; }/*#DIV_1*/ #DIV_2 { color: rgb(51, 51, 0); float: left; height: 40px; width: 25px; perspective-origin: 19px 24px; transform-origin: 19px 24px; border-top: 0px none rgb(51, 51, 0); border-right: 1px solid rgb(0, 0, 0); border-bottom: 0px none rgb(51, 51, 0); border-left: 0px none rgb(51, 51, 0); font: normal normal normal normal 12px/18px monospace; outline: rgb(51, 51, 0) none 0px; overflow: hidden; padding: 4px 6px; }/*#DIV_2*/ .playBtn { background-position: -2px -1px; color: rgb(51, 51, 0); cursor: pointer; height: 40px; width: 25px; perspective-origin: 12.5px 20.5px; transform-origin: 12.5px 20.5px; background: rgba(0, 0, 0, 0) url(http://kolber.github.io/audiojs/audiojs/player-graphics.gif) no-repeat scroll -2px -1px / auto padding-box border-box; border: 0px none rgb(51, 51, 0); font: normal normal normal normal 13px/19.5px monospace; margin: 0px; outline: rgb(51, 51, 0) none 0px; padding: 0px 0px 1px; }/*#P_3*/ #nowplaying { color: rgb(51, 51, 0); float: left; height: 14px; position: relative; width: 74%; perspective-origin: 140px 7.5px; transform-origin: 140px 7.5px; background: rgb(90, 90, 90) none repeat scroll 0% 0% / auto padding-box border-box; border-top: 1px solid rgb(63, 63, 63); border-right: 0px none rgb(51, 51, 0); border-bottom: 0px none rgb(51, 51, 0); border-left: 0px none rgb(51, 51, 0); font: normal normal normal normal 12px/18px monospace; margin: 10px; outline: rgb(51, 51, 0) none 0px; overflow: hidden; }/*#DIV_7*/ #third { width:13%; color: rgb(221, 221, 221); height: 36px; text-shadow: rgba(0, 0, 0, 0.498039) 1px 1px 0px; float: right; perspective-origin: 51.109375px 18px; transform-origin: 51.109375px 18px; border-top: 0px none rgb(221, 221, 221); border-right: 0px none rgb(221, 221, 221); border-bottom: 0px none rgb(221, 221, 221); border-left: 1px solid rgb(0, 0, 0); font: normal normal normal normal 12px/36px monospace; margin: 0px 0px 0px 6px; outline: rgb(221, 221, 221) none 0px; padding: 0px 6px 0px 12px; }/*#DIV_8*/ #EM_9 { color: rgb(249, 249, 249); text-shadow: rgba(0, 0, 0, 0.498039) 1px 1px 0px; border: 0px none rgb(249, 249, 249); font: normal normal normal normal 12px/36px monospace; outline: rgb(249, 249, 249) none 0px; padding: 0px 2px 0px 0px; }/*#EM_9*/ #STRONG_10 { color: rgb(221, 221, 221); text-shadow: rgba(0, 0, 0, 0.498039) 1px 1px 0px; border: 0px none rgb(221, 221, 221); font: normal normal normal normal 12px/36px monospace; outline: rgb(221, 221, 221) none 0px; padding: 0px 0px 0px 2px; }/*#STRONG_10*/ .pauseBtn { background-position: -2px -91px; color: rgb(51, 51, 0); cursor: pointer; height: 40px; width: 25px; perspective-origin: 12.5px 20.5px; transform-origin: 12.5px 20.5px; background: rgba(0, 0, 0, 0) url(http://kolber.github.io/audiojs/audiojs/player-graphics.gif) no-repeat scroll -2px -91px / auto padding-box border-box; border: 0px none rgb(51, 51, 0); font: normal normal normal normal 13px/19.5px monospace; margin: 0px; outline: rgb(51, 51, 0) none 0px; padding: 0px 0px 1px; }/*#P_1*/ #toShow{ font-size: .75vw; }';
GM_addStyle(css);

//add htmlPlayer
var htmlPlayer = '<div id="outer"><div id="DIV_2" style="width: 60px;text-align: center;line-height: 28px;"> <a href="http://hflive.net" target="_blank" style="color: white;text-decoration: none;">HF Live </a> </div><div id="DIV_2"> <p id="audioBtn" class="pauseBtn" onclick="playStop();"> </p> </div> <div id="nowplaying"> <marquee id="nowplayingMarquee" style="color: white">Now Playing</marquee> </div> <div id="third"> <div id="toShow"> </div> </div>';
$(htmlPlayer).appendTo($('body'));

//add js to head
var audioPlayerJs = '<script language="javascript" type="text/javascript">/*We can\'t really pause becuase it\'s a live stream*/ var volumeToReset = 1; function playStop() { if(audio.volume == 0){ setCookie("isPlaying", "1", 5); audio.volume = volumeToReset; audio.play(); document.getElementById(\'audioBtn\').className = \'pauseBtn\';  }else { setCookie("isPlaying", "0"); volumeToReset = audio.volume; audio.volume = 0; document.getElementById(\'audioBtn\').className = \'playBtn\'; } } var audio = new Audio("http://albireo.shoutca.st:9390/live?autoplay=true"); audio.play(); audio.volume = 0; if(getCookie("isPlaying") == "1") audio.volume = volumeToReset; else document.getElementById(\'audioBtn\').className = \'playBtn\'; </script>';
$(audioPlayerJs).appendTo($('head'));




//now get Radio Info for htmlPlayer
var nowPlaying = '';
var currentDj = '';
var currentListeners = '';

$.get('http://hflive.net/radiostats.php?format=json&t=' + Date.now(), function(data){console.log(data);});

function getRadioInfo(){
	GM_xmlhttpRequest ( 
		{
		    method:     "GET",
		    url:        'http://hflive.net/radiostats.php?format=json&t=' + Date.now(),
		    onload:     
		    	function (response) {
	                var json = JSON.parse(response.responseText);
	                console.log(json);
	                if(json.errors)
	                	alert(json.errors);
	                else
	                	json = json.data

	                nowPlaying = json.song;
	                currentDj = json.dj;
					currentListeners = json.listeners;
	                $('#toShow').html('Current Listeners: ' + currentListeners);
	                $('#nowplayingMarquee').html('Now Playing: ' + nowPlaying);	                

				}
		} 
	);
}


getRadioInfo();
setInterval(function(){ 

    if($('#toShow').html().indexOf('Listeners') == -1){   
        $("#toShow").fadeOut(function() {
			$(this).text('Current Listeners: ' + currentListeners)
		}).fadeIn();
    }else{
        $("#toShow").fadeOut(function() {
			$(this).text('Current Dj: ' + currentDj)
		}).fadeIn();        
    }
    
}, 10000);//every 10s

setInterval(function(){ 
	getRadioInfo();
}, 45000);//every 60s


