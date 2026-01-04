// ==UserScript==
// @name         Rabbit Hide UI
// @namespace    http://kmcgurty.com
// @version      0.1
// @description  Hides the Rabbit UI when entering fullscreen
// @author       Kmc
// @match        https://www.rabb.it/kmcgurty1
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/36595/Rabbit%20Hide%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/36595/Rabbit%20Hide%20UI.meta.js
// ==/UserScript==

GM_addStyle(".hidden {display: none;");

setTimeout(addListener, 5000);

function addListener(){
    alert("go");

    document.querySelector(".fullscreenButton").addEventListener("click", function(){
        var hidden = !!document.querySelector(".tray").className.match(/hidden/);

        if(!hidden){
            document.querySelector(".tray").className = "tray screencast shown hidden";
            document.querySelector(".miniToolbarContainer").className = "miniToolbarContainer hidden";
            document.querySelector(".hideBarButton").className += "hideBarButton hidden";
            document.querySelector(".roomControlsLayoutView").className += "roomControlsLayoutView hidden";
        } else {
            document.querySelector(".tray").className = "tray screencast shown";
            document.querySelector(".miniToolbarContainer").className = "miniToolbarContainer";
            document.querySelector(".hideBarButton").className += "hideBarButton";
            document.querySelector(".roomControlsLayoutView").className += "roomControlsLayoutView";
        }
    });

    document.addEventListener("keyup", function(d){
        var hidden = !!document.querySelector(".tray").className.match(/hidden/);
        if(d.key == "Escape" && hidden){
            document.querySelector(".tray").className = "tray screencast shown";
            document.querySelector(".miniToolbarContainer").className = "miniToolbarContainer";
            document.querySelector(".hideBarButton").className += "hideBarButton";
            document.querySelector(".roomControlsLayoutView").className += "roomControlsLayoutView";
        }

    });
}