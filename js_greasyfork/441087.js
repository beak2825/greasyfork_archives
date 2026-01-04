// ==UserScript==
// @name         YouTube watch page - no icon labels
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  show icons without text on YouTube watch page
// @author       Sigi_cz
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441087/YouTube%20watch%20page%20-%20no%20icon%20labels.user.js
// @updateURL https://update.greasyfork.org/scripts/441087/YouTube%20watch%20page%20-%20no%20icon%20labels.meta.js
// ==/UserScript==

//20220423
//0.5 fix the script double start
//20220310
//0.4 YT >> YouTube
//20220217
//0.3 all buttons, change style
//20220202
//0.2 added ytd-download-button-renderer
//20210221
//0.1 first version

(function() {
    'use strict';

// select elements by 'byTagname' '?byName' '#byID' '.byClass' './xpath' '//xpath'
function $(q, root, single) {
  if (root && typeof root === 'string') {
    root = $(root, null, true);
    if (!root) { return null; }
  }
  root = root || document;
  if (q[0]==='/' || (q[0]==='.' && q[1]==='/')) {
    if (single) { return document.evaluate(q, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; }
    return document.evaluate(q, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  }
  else if (q[0]==='#') { return root.getElementById(q.substr(1)); }
  else if (q[0]==='.') { return root.getElementsByClassName(q.substr(1)); }
  else if (q[0]==='?') { return root.getElementsByName(q.substr(1)); }
  return root.getElementsByTagName(q);
}

// -----------------------------------------------------------------------------

function start_script() {
    setTimeout(function (){
        delayed_start();
    }, 1000);
}

function delayed_start() {

    //alert("YT transitionend");
    var addr = window.location.href;

    if (addr.match("/watch?")) {
        //console.log("YT watch !")

        try {
            var menu = $('//ytd-video-primary-info-renderer/div/div/div[3]/div/ytd-menu-renderer/div//yt-formatted-string');
            for (var i = 1; i < menu.snapshotLength; i++) {
                menu.snapshotItem(i).style.display = 'none';
                menu.snapshotItem(i).parentNode.style.padding = "0px";
                //menu.snapshotItem(i).parentNode.firstChild.style.padding = "0px";
                menu.snapshotItem(i).parentNode.parentNode.style.marginLeft = '0px';
            }
        } catch(x) { console.log("YT err mod btn: " + i); }

    }

}

    //document.addEventListener('DOMContentLoaded', start_script());
    //document.onload = start_script();
    document.body.addEventListener("yt-navigate-finish", function (event) {
        //console.log('Youtube page Change');
        start_script();
    });

})();
