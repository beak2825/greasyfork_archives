// ==UserScript==
// @name        teams-meets-curl
// @namespace   https://github.com/spmn/
// @match       https://teams.microsoft.com/*
// @grant       none
// @version     1.0
// @author      spmn
// @description Generates a ready-to-use curl command that downloads a specific meeting recording
// @downloadURL https://update.greasyfork.org/scripts/413977/teams-meets-curl.user.js
// @updateURL https://update.greasyfork.org/scripts/413977/teams-meets-curl.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function getCookieValue(a) {
        var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
    }
  
    function copyToClipboard(text) {
        var dummy = document.createElement("textarea");

        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }
  
    window.open = (url, target) => {
        const token  = getCookieValue('skypetoken_asm');
        const cookie = `skypetoken_asm=${token}`;
        const cmd    = `curl '${url}' -H 'Cookie: ${cookie}' --compressed --output dl.mp4`;
        
        console.log(cmd);
        copyToClipboard(cmd);
    };
})();