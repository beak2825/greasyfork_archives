// ==UserScript==
// @name         epiano volume
// @namespace    https://epiano.jp/
// @version      0.01
// @description  epiano
// @match        https://epiano.jp/sp/*
// @grant        none
// @run-at document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/425148/epiano%20volume.user.js
// @updateURL https://update.greasyfork.org/scripts/425148/epiano%20volume.meta.js
// ==/UserScript==

function press(id, vol)
{
    var newVol = vol;
    // 音量調節 右側の数値を書き換えてください
    newVol = newVol * 0.8;

    playPiano(id,loginInfo.myID,newVol);
	if($("#disconnect").is(":checked") == 0){
        socket.emit('p',id,newVol);
	}
}

addJS_Node(press);
function addJS_Node(text, s_URL, funcToRun, runOnLoad)
{
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}