// ==UserScript==
// @name         MewTube
// @namespace    *://*.youtube.com*
// @version      0.2
// @description  just makes youtube look ever so slightly better...
// @author       KillaMeep
// @match        https://www.youtube.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462471/MewTube.user.js
// @updateURL https://update.greasyfork.org/scripts/462471/MewTube.meta.js
// ==/UserScript==

//changes for 0.2
//added github version checking


(function() {
    'use strict';
    document.addEventListener('readystatechange', () => {if (document.readyState == 'complete') main();});
    function main(){
        var waitForEl = function(selector, callback) {
            if (jQuery(selector).length) {
                callback();
            } else {
                setTimeout(function() {
                    waitForEl(selector, callback);
                }, 100);
            }
        };
        console.log('MewTube init')
        var head = document.getElementsByTagName('head')[0]
        var html = "<style>#shadowBox { background-color: rgb(0, 0, 0); /* Fallback color */ background-color: rgba(0, 0, 0, 0.2); /* Black w/opacity/see-through */ border: 3px solid;}.red_fade { background: linear-gradient(to right, #ff0000, #ff4000 , #ff5e00, #ff4000, #ff0000); -webkit-background-clip: text; background-clip: text; color: transparent; animation: rainbow_animation 6s ease-in-out infinite; background-size: 400% 100%;}.green_fade { background: linear-gradient(to right, #4dff00, #00ff11 , #00ff40, #00ff59, #00ff80); -webkit-background-clip: text; background-clip: text; color: transparent; animation: rainbow_animation 6s ease-in-out infinite; background-size: 400% 100%;}.blue_fade { background: linear-gradient(to right, #0084ff, #0051ff , #001aff, #1900ff, #5d00ff); -webkit-background-clip: text; background-clip: text; color: transparent; animation: rainbow_animation 6s ease-in-out infinite; background-size: 400% 100%;}.rainbow { text-align: center; text-decoration: underline; font-size: 32px; font-family: monospace; letter-spacing: 5px;}.rainbow_text_animated { background: linear-gradient(to right, #6666ff, #0099ff , #00ff00, #ff3399, #6666ff); -webkit-background-clip: text; background-clip: text; color: transparent; animation: rainbow_animation 6s ease-in-out infinite; background-size: 400% 100%;}@keyframes rainbow_animation { 0%,100% { background-position: 0 0; } 50% { background-position: 100% 0; }}</style>"
        head.innerHTML += html
        document.getElementsByName("search_query")[0].className+=" rainbow_text_animated"
        var widgets = document.getElementsByClassName("style-scope yt-chip-cloud-chip-renderer")
        for (let a = 0; a < widgets.length; a++){
            if(a % 2 == 0) {
                widgets[a].className+=" red_fade"
            }
            else {
                widgets[a].className+=" blue_fade"
            }

        }
        waitForEl('#guide-section-title', function() {
            var tabs = document.getElementsByClassName("title style-scope ytd-guide-entry-renderer")
            console.log(tabs)
            for (let b = 0; b < tabs.length; b++){
                console.log(tabs[b].innerHTML)
                if(tabs[b].innerHTML == "Home"){
                    tabs[b].style.color = 'white'
                    console.log(tabs[b].className)
                }
            }
        });
    }
})();
