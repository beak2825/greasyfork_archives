// ==UserScript==
// @name         csgo prosetting donwload cfg
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  download crosshair viewmodel cfg
// @author       You
// @match        https://prosettings.net/*
// @icon         <$ICON$>
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431956/csgo%20prosetting%20donwload%20cfg.user.js
// @updateURL https://update.greasyfork.org/scripts/431956/csgo%20prosetting%20donwload%20cfg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function download(filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    }
    var crosshair = document.getElementsByTagName("code")[0].innerText;
    console.log(crosshair);
    var viewmodel = document.getElementsByTagName("code")[1].innerText;
    var text = crosshair + "\r\n" + viewmodel;

    var textname = document.getElementsByClassName("entry-title")[0].innerText + ".cfg"
    // Your code here...
    document.getElementsByClassName("entry-title")[0].insertAdjacentHTML("afterEnd","<h1 class='entry-title download'>生成cfg</h1>");
    document.getElementsByClassName("download")[0].onclick = function(){
        download(textname, text);
    };

})();