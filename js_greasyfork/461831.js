// ==UserScript==
// @name         Tweakers classic frontpage
// @namespace    https://github.com/4zbest/css-hacks
// @version      0.11
// @description  Script to revert the Tweakers frontpage to classic look
// @author       Azbest
// @license      CC-BY-SA
// @match        https://tweakers.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tweakers.net
// @resource     customCSS https://github.com/4zbest/css-hacks/raw/main/tweakers_classic-frontpage.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/461831/Tweakers%20classic%20frontpage.user.js
// @updateURL https://update.greasyfork.org/scripts/461831/Tweakers%20classic%20frontpage.meta.js
// ==/UserScript==

function removejscssfile(filename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"
    var allsuspects=document.getElementsByTagName(targetelement)
    for (var i=allsuspects.length; i>=0; i--){
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
        allsuspects[i].parentNode.removeChild(allsuspects[i])
    }
}

removejscssfile("frontpage-style.", "css")

var newCSS = GM_getResourceText ("customCSS");
GM_addStyle (newCSS);