// ==UserScript==
// @name         AliHelpKiller
// @namespace    mailto:azuzula.cz@gmail.com
// @version      1.01
// @description  Killing that ugly and obstructing "help" thing in lower right corner
// @author       Zuzana Nyiri
// @match        *www.aliexpress.com/p/order/*
// @match        *www.aliexpress.com/account/*
// @license  MIT
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @resource https://gist.github.com/raw/2625891/waitForKeyElements.js/waitForKeyElements.js
// @grant    GM_getResourceText("waitForKeyElements")
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/440207/AliHelpKiller.user.js
// @updateURL https://update.greasyfork.org/scripts/440207/AliHelpKiller.meta.js
// ==/UserScript==

(function(){
    $(document).ready(function(){
        waitForKeyElements ("[id$='J_xiaomi_dialog']", killNode);
    });
})();

function killNode (jNode) {
    jNode.remove ();
}

//wait for add this external script https://gist.github.com/raw/2625891/waitForKeyElements.js