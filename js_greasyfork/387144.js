// ==UserScript==
// @name         IG download
// @namespace    http://etanon.net/
// @version      2019.06.11
// @description  Download IG imaged with ctrl+D
// @author       etanon
// @match        https://instagram.com/*
// @match        https://*.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387144/IG%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/387144/IG%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    onkeydown = function(e){
        if(e.ctrlKey && (e.keyCode == 'D'.charCodeAt(0) || e.keyCode == 'S'.charCodeAt(0))){
            e.preventDefault();

            var classes = ["_2di5p", "_l6uaz", "_6kyf0", "_ro0gg", "_g9va4", "FFVAD"];
            var source;
            for (var _class of classes) {
                var elemlist = document.getElementsByClassName(_class);
                for (var elem of elemlist) {
                    source = elem.src;
                    if (!!source) break;
                    for (var child of elem.children) {
                        source = child.src;
                        if (!!source) break;
                    }
                }
                if (!!source) break;
            }
            if (!source) {
                try {
                    source = document.querySelector("[srcset]").src
                    return;
                } catch (e) {
                    console.log(Date().toString() + ": No image node found");
                    return;
                }
            }
            try {
                if (source) {
                    let newURL = new URL(source)
                    newURL.searchParams.append("dl","1")
                    window.location = newURL;
                    console.log(Date().toString() + ": Opened " + _class + ": " + source);
                } else {
                    throw TypeError();
                }
            } catch(error) {
                if (error instanceof TypeError) {
                    console.log(Date().toString() + ": No image node found for " + _class);
                }
                console.log(Date().toString() + ": " + error);
            }
        }
    };
    console.log("IG Script loaded")
})();