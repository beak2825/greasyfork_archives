// ==UserScript==
// @name         TW ingoreDenise
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ignore denise everywhere
// @author       You
// @match        https://*.the-west.de/game*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404560/TW%20ingoreDenise.user.js
// @updateURL https://update.greasyfork.org/scripts/404560/TW%20ingoreDenise.meta.js
// ==/UserScript==

async function init(){
    await new Promise(r => setTimeout(r, 10000));
    Chat.IgnoreButler.ignore("Denise6666");
    Chat.IgnoreButler.ignore("Denise666");
    removeDeniseFromChats();
}
async function removeDeniseFromChats()
{
    for(var i = 0 ; i < document.getElementsByClassName("tw2gui_scrollpane_clipper_contentpane").length; i++){
        if(document.getElementsByClassName("tw2gui_scrollpane_clipper_contentpane")[i].innerText.includes("Denise66"))
            document.getElementsByClassName("tw2gui_scrollpane_clipper_contentpane")[i].innerText = document.getElementsByClassName("tw2gui_scrollpane_clipper_contentpane")[i].innerText.replace(new RegExp("Denise6*:.*\n", "mg"), "");
    }
    await new Promise(r => setTimeout(r, 500));
    removeDeniseFromChats();
}
init();