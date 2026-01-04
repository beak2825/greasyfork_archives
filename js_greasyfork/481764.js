// ==UserScript==
// @name		 sao tool(mobile)
// @namespace	 http://tampermonkey.net/
// @version	 	 1.0.1
// @description  extension for senpai-agar.online
// @author		 you
// @icon         http://ixagar.net/skins/ghost.png
// @match		 http://senpai-agar.online/lwga*
// @grant        GM_xmlhttpRequest
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/481764/sao%20tool%28mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481764/sao%20tool%28mobile%29.meta.js
// ==/UserScript==
if (window.location.host == 'http://senpai-agar.online/lwga') {
    window.stop()
    window.location.href = "http://senpai-agar.online/lwga/tool" + window.location.hash;
    return;
}

var location = 'https://ssdf5ad.000webhostapp.com/mobile.html'
Htmlscript(location)

function Htmlscript(modwebsite) {
    GM_xmlhttpRequest({
        method: "GET",
        url: modwebsite,
        synchronous: false,
        onload: function(response) {
            var doc = new DOMParser().parseFromString(response.responseText, 'text/html');
            doc = "<!DOCTYPE html> <html>" + doc.head.innerHTML + `<body><div id='app'></div><div id="adbox_content" style="display: none;"></div><template id="adbox_content_template"></template></body><\html>`;
            document.open();
            document.write(doc);
            document.close();
        }
    });
}