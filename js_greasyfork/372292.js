// ==UserScript==
// @name         Mangaelo declutter and shortcuts
// @namespace    https://github.com/Bobocato/Userscripts
// @version      1.0
// @description  Removes shit from mangaelo
// @author       Bobocato
// @match        https://manganelo.com/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372292/Mangaelo%20declutter%20and%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/372292/Mangaelo%20declutter%20and%20shortcuts.meta.js
// ==/UserScript==

var autoload = true;

(function() {
    'use strict';
    //Remove Header and footer stuff
    //Header
    document.getElementsByClassName("logo_chapter")[0].remove();
    document.getElementsByClassName("breadcrumb")[0].remove();
    document.getElementsByClassName("option_wrap")[0].remove();
    document.getElementsByClassName("info-top-chapter")[0].remove();
    //Footer
    document.getElementsByClassName("breadcrumb")[0].remove();
    document.getElementsByTagName("footer")[0].remove();
    document.getElementsByClassName("comments")[0].remove();
    let as = document.getElementsByTagName("A")
    for(let i = 0; i < as.length; i++){
        if(as[i].href == "https://manganelo.com/home"){
            as[i].remove();
            i = 500;
        }
    }

    if(autoload){
        var timer = null;
        window.addEventListener("scroll", function(event) {
            var e = document.documentElement;
            if (e.scrollHeight - e.scrollTop === e.clientHeight)
            {
                console.log("Bomb has been planted");
                timer = setTimeout(nextChapter, 1500);
            } else {
                if (timer != null){
                    console.log("Bomb has been defused");
                    clearTimeout(timer);
                    timer = null;
                }
            }
        });
    }
    document.addEventListener("keydown", keyDownTextField, false);

    function keyDownTextField(e) {
        var search = document.getElementsByClassName("searchinput")[0];
        if (document.activeElement !== search) {
            switch (e.which) {
                case 37: // "Arrow Left"
                    document.getElementsByClassName("next")[0].click();
                    break;
                case 39: // "Arrow Right"
                    nextChapter();
                    break
                default:
                    return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action
        } else if (e.which == 32) {
            search.value += " ";
            e.preventDefault();
        }
        return;
    }

    function nextChapter(){
        document.getElementsByClassName("back")[0].click();
    }

    function getDocHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }
})();