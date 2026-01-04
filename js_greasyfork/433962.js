// ==UserScript==
// @name         BS.to Streamtape AutoSelect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AutoSelect Streamtape if available
// @author       You
// @match        https://bs.to/serie/*
// @icon         https://www.google.com/s2/favicons?domain=bs.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433962/BSto%20Streamtape%20AutoSelect.user.js
// @updateURL https://update.greasyfork.org/scripts/433962/BSto%20Streamtape%20AutoSelect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // &&& markieren, wenn user anderen stream auswäjlt => nicht zu streamtape wechseln
    var pathArr = location.pathname.split("/")
    if (pathArr.length < 6) {
        localStorage.streamtaped = ""
    } else {
        if (pathArr.length == 6) {
            pathArr.splice(pathArr.length-1,1)
        } else
            pathArr.splice(pathArr.length-2,2)
        const path = pathArr.join("/")

        if (localStorage.streamtaped != path) {
            localStorage.streamtaped = ""
            var streamtape = document.getElementsByClassName("hoster Streamtape")
            for (var i=0;i<streamtape.length;i++) {
                if (!streamtape[i].parentElement.attributes.title && streamtape[i].parentElement.parentElement.className!="active" && streamtape[i].parentElement.parentElement.previousElementSibling) {
                    localStorage.streamtaped = path;
                    streamtape[i].parentElement.click()
                }
            }
        }
    }

})();