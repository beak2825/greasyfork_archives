// ==UserScript==
// @name        Clippy Came Back
// @include     *
// @version      2025-08-24
// @description  Bringing Clippy back, one page at a time! - CAUTION: IT'S CLIPPY, HE'S KINDA ANNOYING
// @author       You
// @match        *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @match       *
// @namespace Brickmason_Games
// @license MIT
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/547147/Clippy%20Came%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/547147/Clippy%20Came%20Back.meta.js
// ==/UserScript==
/* global $, clippy */
/* eslint-disable no-multi-spaces */

//-- These particular target page(s) already have jQuery, otherwise addJS_Node() it too.

//$("head").append ( `
//    <link  href="//rawcdn.githack.com/pi0/clippyjs/refs/heads/master/assets/clippy.css"
//    rel="stylesheet" type="text/css">
//` );
var node = document.createElement("link");
node.rel = "stylesheet";
node.type = "text/css";
node.href="https://cdn.jsdelivr.net/clippy.js/1.0/clippy.min.css";
document.head.appendChild(node);
addJS_Node(null,"https://unpkg.com/jquery@3.2.1",null, addJS_Node(null, "https://cdn.jsdelivr.net/clippy.js/1.0/clippy.min.js", null, startClippy));
function getRandomInteger(min, max) {
      min = Math.ceil(min); // Ensures min is rounded up for inclusive range
      max = Math.floor(max); // Ensures max is rounded down for inclusive range
      return Math.floor(Math.random() * (max - min + 1)) + min;
}
//-- addJS_Node waits for clippyjs to load before running this...
function startClippy () {
    clippy.BASE_PATH = "//rawcdn.githack.com/donnyworks/clippy.js/refs/heads/master/agents/";
    clippy.load ('Clippy', function (agent) {
        agent.show ();
        setTimeout(() => {
            agent.speak("Did you miss me?");
        }, 1000);
        setTimeout(() => {
            agent.moveTo(100,100);
        }, 1000);
        function timeoutFunction() {
            console.log(getRandomInteger(10,30)*1000);
            agent.speak("It seems you're having trouble browsing this website.\nDo you need some help?");
            setTimeout(timeoutFunction,getRandomInteger(10,30)*1000);
        }
        setTimeout(timeoutFunction,getRandomInteger(10,30)*1000);
        function timeoutFunction2() {
            console.log(getRandomInteger(5,10)*1000);
            agent.animate();
            setTimeout(timeoutFunction2,getRandomInteger(5,10)*1000);
        }
        setTimeout(timeoutFunction2,getRandomInteger(5,10)*1000);
});

}

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

    var targ = D.getElementsByTagName ('body')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}