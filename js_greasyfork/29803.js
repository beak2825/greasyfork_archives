// ==UserScript==
// @name         NyanPass AutoClick
// @author       Ichijō Hotaru
// @version      Alpha 0.0.1
// @description  Auto Click nyanpass.com
// @match        http://nyanpass.com/
// @icon         http://nyanpass.com/favicon.ico
// @namespace    http://nyanpass.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29803/NyanPass%20AutoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/29803/NyanPass%20AutoClick.meta.js
// ==/UserScript==

function xpath(query) {
    return document.evaluate(query, document, null,
                             XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

function anchorclick(node)
{
    var evt = document.createEvent("MouseEvents"); 
    evt.initMouseEvent("click", true, true, window, 
                       0, 0, 0, 0, 0, false, false, false, false, 0, null);
    var allowDefault = node.dispatchEvent(evt);
}

var btnITags =xpath("//div[@id='nyanpass']");
if ( btnITags.snapshotLength > 0)
{
    var thisDiv =  btnITags.snapshotItem(0);
    setInterval(function(){
            anchorclick(thisDiv);
    }, 5000);
}