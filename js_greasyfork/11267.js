// ==UserScript==
// @name           9gag Auto Gif Controls
// @namespace      http://www.diamonddownloads.weebly.com
// @version        1.3
// @description    Shows the gif/mp4 controls automatically
// @author         RF Geraci
// @include        *9gag.com*
// @grant          none
// @run-at         document-body
// @downloadURL https://update.greasyfork.org/scripts/11267/9gag%20Auto%20Gif%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/11267/9gag%20Auto%20Gif%20Controls.meta.js
// ==/UserScript==

gag = {

    init : function(t){

       setInterval(function(){

            var classN = "badge-animated-container-animated post-view"; //Default
            var winLoc = window.location.href;

            var pages =["hot", "trending", "fresh"];

            for (var o = 0; o<pages.length; o++){

                if (winLoc.indexOf(pages[o]) > -1 || document.getElementsByClassName('badge-animated-container-animated').length > 0){
                    classN = "badge-animated-container-animated"; //Change var if these pages are open
                    break;
                }
            }

            var ele = document.getElementsByClassName(classN);

            for(var i=0; i<ele.length; i++){

                var c  = ele[i].childNodes[1];

                if (!c.hasAttribute('controls')){
                    console.log("[9GAG AUTO GIF CONTROLS] -> Added Control attribute to " + ele[i].className + " (inst " + i + ")");
                    c.setAttribute("controls", "");
                }
            }     

        }, t);
    }

};

gag.init(1000);