// ==UserScript==
// @name         Load external script
// @description  Tool to let you load external scripts
// @version      1
// @author       A Meaty Alt
// @grant        none
// ==/UserScript==

function loadScript(scriptURL) {
    'use strict';
    function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    }
    return new Promise(function(resolve){
        httpGetAsync(scriptURL, function(response){
            var s = document.createElement("script");
            s.text = response;
            document.getElementsByTagName("head")[0].appendChild(s);
            resolve();
        });
    });

}