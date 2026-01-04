// ==UserScript==
// @name        Bilibili-macOS-PIP
// @namespace   https://github.com/BlueCocoa
// @description Enable PIP(Picture-In-Picture) on macOS for bilibili. Only for macOS 10.12+
// @author      Authorized by: BlueCocoa
// @homepage    https://github.com/BlueCocoa/Bilibili-macOS-PIP
// @match       http*://www.bilibili.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31671/Bilibili-macOS-PIP.user.js
// @updateURL https://update.greasyfork.org/scripts/31671/Bilibili-macOS-PIP.meta.js
// ==/UserScript==

var re = /^http:\/\/www.bilibili.com\/video\/av/;
var bangumi = /^http:\/\/bangumi.bilibili.com\/anime\/v/;

// if we're in video page
// please note that this hacking only works when you're using HTML5 player
if (re.exec(window.location.href) !== null || bangumi.exec(window.location.href)) {
    // enumerate all div tags
    var elements = document.getElementsByTagName('div');
    for (var i = 0; i < elements.length; i++) {
        // target is bgray-btn-wrap
        if (elements[i].className == "bgray-btn-wrap") {
            // create script tag to enable/disable controls for video tag
            var onclick_script = document.createElement('script');
            onclick_script.innerHTML = '\
            var enabled = false; \
            function native_player(btn) {\
                function enable_native(e) {\
                    var player = document.getElementsByTagName("video")[0];\
                    console.log("Did Set!");\
                    if (e) {\
                        player.setAttribute("controls", "controls");\
                        player.setAttribute("x-webkit-airplay", "");\
                    } else {\
                        player.removeAttribute("controls");\
                    }\
                }\
                enable_native(!enabled);\
                if (!enabled) { \
                    btn.setAttribute("style", "color: #00a1d6; border-color: #00a1d6;");\
                    enabled = true; \
                } else {\
                    btn.setAttribute("style", "border: 1px solid #99a2aa; color: #99a2aa;");\
                    enabled = false; \
                }\
            }';
            // append this script to body
            document.body.appendChild(onclick_script);
            // create a button for user to enable/disable controls for video tag
            var div = document.createElement('div');
            div.setAttribute("class", "bgray-btn");
            div.setAttribute("onclick", "native_player(this)");
            div.innerHTML = 'macOS<br>播放器';
            elements[i].insertBefore(div, elements[i].childNodes[2]);
            elements[i].setAttribute('style', 'display: block');
            break;
        }
    }
}


