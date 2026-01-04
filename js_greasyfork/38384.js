// ==UserScript==
// @name         youtube-playback-rate
// @namespace    mikeOS
// @version      0.5
// @description  Sets video playback rate and does other stuff.
// @author       Favlist.ru
// @include      *youtube.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38384/youtube-playback-rate.user.js
// @updateURL https://update.greasyfork.org/scripts/38384/youtube-playback-rate.meta.js
// ==/UserScript==

var rates = new Array(1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.1,2.2,2.3);
var video;
var channel_name;
var upload_date;
if (!localStorage.myratescheck) localStorage.myratescheck = "true";

window.setInterval(function(){
if (document.location.href.indexOf("watch") > 0){
video = document.getElementsByTagName("video")[0];
  if (document.getElementById("player-container")) displayProgress(video);

        if (!document.getElementById("myrate")){
    var div = document.getElementById("player-container");
    var defaultrate = 1; if(localStorage.defaultrate && localStorage.myratescheck == "true") defaultrate = localStorage.defaultrate;
    for (var i = 0; i<rates.length; i++){
        var button = document.createElement("button");
        button.innerHTML = rates[i];
        button.setAttribute("value",rates[i]);
        button.setAttribute("class","favlist_yt_rate_button");
        if (i===0) button.setAttribute("style","margin-left:10px");
       button.setAttribute("onclick","this.setAttribute(\"disabled\",true);document.getElementById(\"myrate\").disabled=false;document.getElementById(\"myrate\").id=\"\";this.setAttribute(\"id\",\"myrate\");document.getElementsByTagName(\"video\")[0].playbackRate=this.value;localStorage.setItem(\"defaultrate\",this.value);this.blur();");
        if (defaultrate == rates[i]) {button.setAttribute("id","myrate");button.setAttribute("disabled",true);}
        div.appendChild(button);
    }

var label = document.createElement("label");
label.setAttribute("style","position:relative;top:1px;left:6px;padding:1px 3px 1px 3px;border:1px solid #E0E0E0;background-color:#FAFAFA;color:#C9C9C9");

var check = document.createElement("input"); check.setAttribute("type","checkbox"); check.setAttribute("id","myratescheck");
check.setAttribute("style","display:none");
            check.setAttribute("onclick","localStorage.setItem(\"myratescheck\",this.checked);p=this.parentNode;if(this.checked){p.style.border=\"1px solid #C7C7C7\";p.style.color=\"#808080\";}else{p.style.border=\"1px solid #E0E0E0\";p.style.color=\"#C9C9C9\";}");
if(localStorage.myratescheck == "true") {check.setAttribute("checked",true);
label.setAttribute("style","position:relative;top:3px;left:6px;padding:1px 6px 1px 6px;border:1px solid #545454;background-color:#545454;color:#808080;font-size:17px");
}
            label.appendChild(check);
            var txt = document.createElement("span"); txt.innerHTML = "&#10003;";label.appendChild(txt);
            div.appendChild(label);

            video.playbackRate=defaultrate;
        }
        var myrate = document.getElementById("myrate");
        video.playbackRate=myrate.value;

  if (document.getElementById('channel_name') === null){
     var txt1 = document.createElement("span"); txt1.innerHTML = document.getElementsByClassName('date')[0].textContent.replace("Published on ","");
            txt1.setAttribute('id','upload_date');
            txt1.setAttribute("style","color:#A7A7A7;font-size:12px;margin-left:10px");
            document.getElementById("player-container").appendChild(txt1);
   upload_date = document.getElementById('upload_date').textContent;

            var txt2 = document.createElement("span"); txt2.innerHTML = document.getElementById('owner-container').textContent;
            txt2.setAttribute('id','channel_name');
            txt2.setAttribute("style","color:#A7A7A7;font-size:14px;font-weight:bold;margin-left:10px;white-space: pre;");
            document.getElementById("player-container").appendChild(txt2);
    channel_name = document.getElementById('channel_name').textContent.replace("Verified","");
}

if (channel_name !== '' && channel_name != document.getElementById('owner-container').textContent) {
  document.getElementById('channel_name').innerHTML = document.getElementById('owner-container').textContent.replace("Verified","");
  channel_name = document.getElementById('channel_name').textContent.replace("Verified","");
}
document.getElementById('upload_date').innerHTML = document.getElementsByClassName('date')[0].textContent.replace("Published on ","");
}
},1000);

function displayProgress(video){
  var playerwidth = document.getElementById("player-container").offsetWidth;
  var pcent = (video.currentTime / video.duration)*100;
  var progress_bar = document.getElementById("progress_bar");
  var progress_counter = document.getElementById("progress_counter");
  if (!progress_bar) {
var bar = document.createElement("div"); bar.id = "progress_bar"; bar.setAttribute("style","height:3px;width:0px;background:#FF4646;position:relative;top:1px;margin-bottom:4px");
document.getElementById("player-container").appendChild(bar);
var counter = document.createElement("span"); counter.id = "progress_counter";
counter.setAttribute("style","font-family: 'Courier';font-size:20px;font-weight:bold;color:#A7A7A7;position:relative;top:2px;margin-right:10px;");
document.getElementById("player-container").appendChild(counter);
  } else {progress_bar.style.width = (playerwidth / 100) * pcent + "px";}
  if (video.duration) progress_counter.innerHTML = humanTime(Math.round(video.currentTime)) + "/" + humanTime(Math.round(video.duration));
}

function humanTime(totalSec){
var hours = parseInt( totalSec / 3600 ) % 24;
var minutes = parseInt( totalSec / 60 ) % 60;
var seconds = totalSec % 60;
if (hours > 0) {
return hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
}else{
return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
}
}

var style = document.createElement("style");
style.innerHTML = ".favlist_yt_rate_button{cursor:pointer;font-size:10px;margin-left:1px;height:24px;width:26px;text-align:center;color:#FAFAFA;border:none;border-left:1px solid #545454;border-right:1px solid #545454;background-color:#545454;}"+
".favlist_yt_rate_button[disabled]{color:#545454;border-left:1px solid transparent;border-right:1px solid transparent;background:transparent;cursor:default;} #eow-title{white-space:nowrap;font-size:18px}"+
"#subitle-container-first{display:none}#watch7-sidebar{margin-top:-389px!important}"+
".ytd-iframe-companion-renderer{display:none}"+
"#player-container {white-space:nowrap;position:relative;bottom:16px}ytd-video-primary-info-renderer{padding: 33px 0 28px 0;}";
document.getElementsByTagName("head")[0].appendChild(style);







var globalKey ='';
var keyInterval = 0;
var keyStop = 1;
var docTitle = '';
window.addEventListener("keydown", myFunction);

function myFunction(event) {
    if (event.keyCode == 83 && globalKey != event.keyCode) {
		keyInterval ++; keyStop = 0;docTitle = document.title;
		startKeyInterval();
	}
    globalKey = event.keyCode;
}
window.addEventListener("keyup", myFunction2);

function myFunction2(event) {
	if (keyInterval > 10){
    if (event.keyCode == 83) {
		document.location = 'https://www.youtube.com/feed/subscriptions';
	}
}
document.title = docTitle;
	keyInterval = 0; keyStop = 1;
	globalKey = '';
}

function startKeyInterval(){
	if (keyInterval > 10 && document.title != "--- " + docTitle){
	document.title = "[☯] - " + docTitle;
}
if (keyInterval > 0&& keyStop === 0) window.setTimeout(function(){keyInterval ++;startKeyInterval();},100);
}
