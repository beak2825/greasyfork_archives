// ==UserScript==
// @name         Hidden Host
// @version      0.1.0.0.0.0.1
// @description  None
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @namespace https://greasyfork.org/users/94615
// @downloadURL https://update.greasyfork.org/scripts/29113/Hidden%20Host.user.js
// @updateURL https://update.greasyfork.org/scripts/29113/Hidden%20Host.meta.js
// ==/UserScript==

function getText(url){
    // read text from URL location
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                return request.responseText;
            }
        }
    }
}

(function() {
    if (window.location.href.includes("hh")){
        window.stop();
        document.getElementsByTagName("html")[0].innerHTML=getText(window.location.href.split(".com/")[1]);
    }
})();