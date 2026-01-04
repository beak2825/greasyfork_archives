// ==UserScript==
// @name         Zipwhip Plugin Bootstrapper for App Store
// @namespace   http://zipwhip.com/
// @version      0.1
// @description  Updated 6/2/20
// @author       You
// @match        https://app.zipwhip.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404149/Zipwhip%20Plugin%20Bootstrapper%20for%20App%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/404149/Zipwhip%20Plugin%20Bootstrapper%20for%20App%20Store.meta.js
// ==/UserScript==

console.log("Plugin - Pre-run");
setTimeout(function() {

    console.log("Plugin - Bootsrapper running...");

    var script = document.createElement('script');

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                console.log("Plugin - Got boot.js downloaded"); // 'This is the returned text.'
                script.text = xhr.responseText;
                document.getElementsByTagName('head')[0].appendChild(script);

            } else {
                console.log('Error: ' + xhr.status); // An error occurred during the request.
            }
        }
    };

    xhr.open('GET', 'https://raw.githubusercontent.com/chilipeppr/zw-plugin-bootstrap/master/boot.js');
    xhr.send(null);

    console.log("Plugin - Bootsrapper ran");
}, 1000);