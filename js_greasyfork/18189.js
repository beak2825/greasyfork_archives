// ==UserScript==
// @name         Jungletrain enhancement
// @version      1.1
// @description  Google search when clicking on track name - in case you hear something good. :)
// @author       Zsolt Erdélyi
// @include      http://jungletrain.net/*
// @grant        none
// @namespace https://greasyfork.org/users/34612
// @downloadURL https://update.greasyfork.org/scripts/18189/Jungletrain%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/18189/Jungletrain%20enhancement.meta.js
// ==/UserScript==

if(typeof updateNowPlaying !== "undefined"){
    updateNowPlaying = (function(){
        var original = updateNowPlaying;
        return function(){
            original.apply(this, arguments);
            var playing = document.getElementById("showTitle");
            (function waitUntilLoaded(callback){
                setTimeout(function(){
                    playing.textContent === "Loading..." ? waitUntilLoaded(callback) : callback();
                }, 500);
            })(function(){
                playing.innerHTML = '<a href="https://www.google.com/search?q=' + encodeURIComponent(playing.textContent) + '" target="_blank">' + playing.innerHTML + "</a>";
            });
        };
    })();
    updateNowPlaying();
}