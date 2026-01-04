// ==UserScript==
// @name         9gag volume and controls
// @namespace    https://greasyfork.org/en/scripts/382093
// @match        https://9gag.com/*
// @run-at       document-end
// @grant        none
// @version      1.0.3
// @description  Adds the controls to the videos ("gifs") and sets the default volume to 30%
// @author       Artain
// @homepageURL  https://greasyfork.org/en/scripts/382093
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/382093/9gag%20volume%20and%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/382093/9gag%20volume%20and%20controls.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function changeVid(mutationsList, observer){
        var vids = document.querySelectorAll("video:not(.alreadyChanged)");
        for(var i=0; i < vids.length; ++i) {
            var v = vids[i];
            v.volume = 0.3;
            v.setAttribute("class", "alreadyChanged");
            v.setAttribute("controls", "true")
        }
    }

    window.onload = function(event) {
        start(0);
    };

    function start(iteration) {
        setTimeout(function(){
            var list = document.getElementById("list-view-2"),
                observer;
            if(typeof list !== "undefined" && list != null) {
                changeVid(false,false);
                observer = new MutationObserver(changeVid);
                observer.observe(list, {subtree: true, childList: true});
            } else {
                list = document.getElementById("individual-post");
                if(typeof list !== "undefined" && list != null) {
                changeVid(false,false);
                observer = new MutationObserver(changeVid);
                observer.observe(list, {subtree: true, childList: true});
                } else {
                    if(iteration < 20){
                        start(iteration++);
                    } else {
                        console.log("Error " + list + "is null or undefined");
                    }
                }
            }
        }, 200);
    }
})();