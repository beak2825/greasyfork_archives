// ==UserScript==
// @name         Save Nickname Diep.IO MOD
// @version      1.6
// @description  Save your name nickname instead of typing again
// @author       magepino123
// @match        *://diep.io/
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      diep.io
// @namespace twitter.com/@magepino123
// @downloadURL https://update.greasyfork.org/scripts/19732/Save%20Nickname%20DiepIO%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/19732/Save%20Nickname%20DiepIO%20MOD.meta.js
// ==/UserScript==
window.stop();
document.documentElement.innerHTML = null;
var s = '',
    doc = '';
GM_xmlhttpRequest({
    method: "GET",
    url: 'http://diep.io/d.js',
    onload: function(event) {
        s = event.responseText;
        GM_xmlhttpRequest({
            method: "GET",
            url: 'http://diep.io/',
            onload: function(event) {
                doc = event.responseText;
                doc = doc.replace(/<script src="d\.js" async><\/script>/i, '');
                doc = doc.replace(/<\/body>/i, '<script>' + s + '</script><script>document.getElementById("textInput").value = localStorage.getItem("_nickname");window.addEventListener("beforeunload", function() {localStorage.setItem("_nickname", document.getElementById("textInput").value);});</script></body>');
                document.open();
                document.write(doc);
                document.close();
            }
        });

    }
});
