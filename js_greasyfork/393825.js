// ==UserScript==
// @name         img.albums.icu download
// @namespace    http://tampermonkey.net/
// @version      0.3.14
// @description  Download http://img.albums.icu with ctrl+D
// @author       You
// @match        http://img.albums.icu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393825/imgalbumsicu%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/393825/imgalbumsicu%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    onkeydown = function(e){
        if(e.ctrlKey && (e.keyCode == 'D'.charCodeAt(0) || e.keyCode == 'S'.charCodeAt(0))){
            if (window.location.href.match(/^http:\/\/img.albums.icu\/img\//)) {
                console.log(Date().toString() + "already on image")
                return
            }
            e.preventDefault();

            var classes = ["_2di5p", "_l6uaz", "_6kyf0", "_ro0gg", "_g9va4"];
            try {
                var source = document.getElementsByClassName("prev")[0].getElementsByTagName("a")[0].href;
            } catch(e) {
                console.log(Date().toString() + ": No image node found");
            }
            if (!source) {
                console.log(Date().toString() + ": No image node found");
                return;
            }
            if (source) {
                window.location = source;
            }
        }
    };
})();