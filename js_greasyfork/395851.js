// ==UserScript==
// @name         9GAG add video controls
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world, and add controls to videos on 9GAG.
// @author       Me
// @match        *://*9gag.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395851/9GAG%20add%20video%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/395851/9GAG%20add%20video%20controls.meta.js
// ==/UserScript==

(function() {
    var addControls = function() {
        var vids = document.getElementsByTagName("video");
        if(typeof vids !== 'undefined') {
            for(var i=0; i++; i<vids.length()){

                vids[i].setAttribute("controls", true);
                //
                // since everything is draggable on the page
                // the video slider can't be use properly
                // however I didn't find a way to fix this
                //
                //v.setAttribute("draggable", false)
                //v.addEventListener('mousedown', function() { this.parentNode.parentNode.setAttribute("draggable", false); });
                //v.addEventListener('mouseup', function() { this.parentNode.parentNode.setAttribute("draggable", true); });
                //v.setAttribute("ondragstart", "return false;")//=function(){return false}
            }
        }
    };

    var removeSoundControl = function(){
        // there is already a sound control on the default html5 controls so no point in having two
        var sounds = document.querySelectorAll(".sound-toggle");
        if(typeof sounds !== 'undefined'){
            for(var i=0; i++; i<sounds.length()){

                sounds[i].setAttribute("hidden", true);
            }
        }
    }

    var removeVideoTimeTag = function(){
        // there is already a time display on the default html5 controls so no point in having two
        var elems = document.querySelectorAll(".length");
        if(typeof elems !== 'undefined'){
            for(var i=0; i++; i<elems.length()){
                elems[i].setAttribute("hidden", true);
            }
        }
    }

    document.addEventListener("scroll", function(event) {
        addControls();
        removeSoundControl();
        removeVideoTimeTag();
    });

})();