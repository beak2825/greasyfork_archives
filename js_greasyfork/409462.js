// ==UserScript==
// @name        zkillboardNoPopup
// @namespace   Test
// @description remove popup window that demands to turn of ad blockers on zkillboard.com (works on firefox only because using non-standard event 'beforescriptexecute')
// @include     https://zkillboard.com/*
// @version     2
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/409462/zkillboardNoPopup.user.js
// @updateURL https://update.greasyfork.org/scripts/409462/zkillboardNoPopup.meta.js
// ==/UserScript==

function addScript(text) {
    text = text.replace(/function annoyAdBlockers.*$/,'function annoyAdBlockers(){}');
    var newScript = document.createElement('script');
    newScript.type = "text/javascript";
    newScript.textContent = text;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(newScript);
}

window.addEventListener('beforescriptexecute', function(e) {
    var src = e.target.src;
    if (src.search(/common\.js/) != -1) {
        e.preventDefault();
        e.stopPropagation();
        GM_xmlhttpRequest({
            method: "GET",
            url: e.target.src,
            onload: function(response) {
                addScript(response.responseText);
            }
        });
    }
});