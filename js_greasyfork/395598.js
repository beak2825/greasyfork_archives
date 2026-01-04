// ==UserScript==
// @name         Bloble.io Custom Skin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Discord Server : https://discord.gg/ezPK8QN
// @author       You
// @match        bloble.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395598/Blobleio%20Custom%20Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/395598/Blobleio%20Custom%20Skin.meta.js
// ==/UserScript==

function httpGetAsync(theUrl, callback) { //theURL or a path to file
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var data = httpRequest.responseText;  //if you fetch a file you can JSON.parse(httpRequest.responseText)
            if (callback) {
                callback(data);
            }                   
        }
    };

    httpRequest.open('GET', theUrl, true); 
    httpRequest.send(null);
}

httpGetAsync('http://..... or fetch a file', function(data) {
    //do something with your data
})

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}