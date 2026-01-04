// ==UserScript==
// @namespace         https://github.com/sheiun/
// @name              Remove Plurk css
// @author            SheiUn
// @description       刪除自定義的 Plurk CSS
// @version           1.0.0
// @license           LGPLv3
// @match             https://www.plurk.com/*
// @downloadURL https://update.greasyfork.org/scripts/460018/Remove%20Plurk%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/460018/Remove%20Plurk%20css.meta.js
// ==/UserScript==

function removejscssfile(filename, filetype) {
    var targetelement = filetype == "js" ? "script" : filetype == "css" ? "link" : "none";
    var targetattr = filetype == "js" ? "src" : filetype == "css" ? "href" : "none";
    var allsuspects = document.getElementsByTagName(targetelement);
    for (var i = allsuspects.length; i >= 0; i--) {
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) allsuspects[i].parentNode.removeChild(allsuspects[i])
    }
}
removejscssfile("/Users/getCustomCss", "css");