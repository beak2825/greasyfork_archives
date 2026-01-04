// ==UserScript==
// @name        Better Fullscreen AIFap
// @include     *aifap.net/view/*
// @run-at      document-start
// @grant       GM_addStyle
// @locale en
// @description fullscreen for aifap
// @version 0.0.1.20190111070049
// @namespace https://greasyfork.org/users/31574
// @downloadURL https://update.greasyfork.org/scripts/376573/Better%20Fullscreen%20AIFap.user.js
// @updateURL https://update.greasyfork.org/scripts/376573/Better%20Fullscreen%20AIFap.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/

async function GM_main () {
  
    document.showing = false;
  
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    await sleep(2000); 
  
    var info = document.getElementsByClassName('AIF-PostInformation')[0];
    var topBar = document.getElementsByClassName('AIF-MainHeader')[0];
    var postViewer = document.getElementsByClassName('AIF-PostViewer')[0];
    var image = document.getElementsByClassName('AIF-PostViewerImage')[0];
    var content = document.getElementsByClassName('AIF-PostViewer__Content')[0];
    
    var FullScreenBtn = document.createElement("BUTTON");
    FullScreenBtn.id = "fullscreen";
    FullScreenBtn.textContent = "Fullscreen";
    FullScreenBtn.onclick = function() {
    // if already full screen; exit
    // else go fullscreen
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        var cssStyle = document.createElement('style');
        cssStyle.type = 'text/css';
        var rules = document.createTextNode(".AIF-PostViewer__Content{height: 100%}");
        cssStyle.appendChild(rules);
        document.getElementsByTagName("head")[0].appendChild(cssStyle);
      } 
    } else {
      if (postViewer.requestFullscreen) {
        postViewer.requestFullscreen();
         
        var cssStyle = document.createElement('style');
        cssStyle.type = 'text/css';
        var rules = document.createTextNode(".AIF-PostViewer__Content{height: 100% !important}");
        cssStyle.appendChild(rules);
        document.getElementsByTagName("head")[0].appendChild(cssStyle);
      } 
    }
}
  
    document.getElementsByClassName('AIF-MainHeader__Nav')[0].appendChild(FullScreenBtn);
    
    
}

addJS_Node (null, null, GM_main);

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
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

