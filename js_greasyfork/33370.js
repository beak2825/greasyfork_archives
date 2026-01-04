// ==UserScript==
// @name        Max Screen
// @author      hotrods20
// @namespace   MaxDFScreen
// @description Max DF Screen Size
// @match       https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21&webplayer=1
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33370/Max%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/33370/Max%20Screen.meta.js
// ==/UserScript==

function updateTimer()
{
  var d = new Date();
  document.title = "DF | "+d.getHours() + ":" + ('0'+d.getMinutes()).slice(-2);
}

function executor()
{
  if(GetUnity() === null)
  {
    var script = document.createElement('script');
    script.src = 'http://administration.dfprofiler.com/dfscript/UnityObject.js';
    script.type = 'text/js';
    script.onload = function() {
      DFLoaderSettings();
      console.log("Loaded User Settings");
    };
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  var unityInst = GetUnity();
  unityInst.setAttribute("style", "display: block; position: absolute; top: 0; bottom: 0; right: 0; left: 0; width: 100%; height: 100%;");
  document.getElementsByTagName("body")[0].setAttribute("style", "overflow-y: hidden;");
  if(document.fullscreenEnabled)
  {
    unityInst.requestFullscreen();
  }
  updateTimer();
  setInterval(updateTimer, 30000);
}

window.addEventListener("load", executor);