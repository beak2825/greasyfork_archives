// ==UserScript==
// @name         Fastest Youtube Downloader! (Video or MP3)
// @namespace    https://dunkoyun.com
// @version      4.69
// @description  The fastest and best quality video and music (mp3) YouTube download plug-in from Onur YASAR!
// @author       Onur YASAR
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/33219/Fastest%20Youtube%20Downloader%21%20%28Video%20or%20MP3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/33219/Fastest%20Youtube%20Downloader%21%20%28Video%20or%20MP3%29.meta.js
// ==/UserScript==

function go() {
    start();
}

window.addEventListener('spfdone', go, false);
window.addEventListener('DOMContentLoaded', go, false);
window.addEventListener('yt-navigate-finish', go, false);

function start() {
    function isMaterial() {
        var temp;
        temp = document.querySelector("ytd-app, [src*='polymer'],link[href*='polymer']");
        if (!temp) { // old UI
            var urldl = window.location.href;
            if(str.indexOf("youdl") < 0){
            temp = document.createElement("template");
            temp.innerHTML = //
                `<div id='material-notice' style='border-radius:2px;color:#FFF;padding:10px;background-color:#ff0000;box-shadow:0 0 3px rgba(0,0,0,.5);font-size:18px;position:fixed;bottom:20px;right:50px;z-index:99999'>
				<strong><ins>WARNING : </ins></strong>Fastest Youtube Downloader is <B>Only compatible with the new YouTube Material Layout</B><br>
				<a href='https://youtube.com/new' target='_blank' style='font-weight:bold;'>Click here</a> to activate the new YouTube Material Layout.<br>
				<br/><br/>
				<span id='close' onclick='document.getElementById("material-notice").remove(); return false;' align='center' STYLE='display:block;width:100px;height: 100%;margin: 0 auto;'><strong><ins><a href=""> [X] CLOSE </a></ins></strong></span>
				</div>`;
            document.documentElement.appendChild(temp.content.firstChild);
            document.documentElement.removeAttribute("data-user_settings");
            return true;
            }
        }
    }
    isMaterial();
    var lasturl = "";

    function check() {
        if (location.href == lasturl) return;
        lasturl = location.href;
        if (lasturl.indexOf("watch?v=")) removeframe();
    }
    setInterval(check, 1000);

    bvd2_btn_onclick = function() {
        var url = window.location.href;
        var myHosts = ['http://youdl1.byethost17.com/', 'http://youdl2.byethost8.com/', 'http://youdl3.byethost15.com/', 'http://youdl5.byethost8.com/', 'http://youdl6.byethost17.com/'];
        var randHost = myHosts[Math.floor(Math.random() * myHosts.length)];
        window.open(randHost+"api.php?y="+url, "_blank", "toolbar=no,scrollbars=no,resizable=no,top=200,left=200,width=600,height=330");
    };

    getSpan = function(text, className) {
        var _tn = document.createTextNode(text);
        var span = document.createElement("span");
        span.className = className;
        span.appendChild(_tn);
        return span;
    };

    createButton = function() {
        var obj = document.querySelector('#top-row>#subscribe-button');
        if (obj !== null) {
            // check if the button has already been created
            var btnRow = document.getElementById('bestvd2');
            if (btnRow === null) {
                var bestvd2 = document.createElement("div");
                bestvd2.id = "bestvd2";
                bestvd2.className = "style-scope";

                var bvd2_btn = document.createElement("div");
                bvd2_btn.className = "style-scope bvd2_btn";

                bvd2_btn.style = "background-color: green; border: solid 2px green; border-radius: 2px; color: white; padding: 0px 15px; font-size: 14px; cursor:pointer; height:33px;margin-right: 7px;margin-top: 7px;line-height: 33px;font-weight: 500; display:inline-block;";

                bvd2_btn.appendChild(getSpan("Open Download Screen", ""));
                bvd2_btn.onclick = bvd2_btn_onclick;

                obj.parentNode.insertBefore(bestvd2, obj);
                bestvd2.appendChild(bvd2_btn);
            }
        }
    };
    var intervalCheck = setInterval(function() {
        createButton();
    }, 250);
}