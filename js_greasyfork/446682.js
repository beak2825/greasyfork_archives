// ==UserScript==
// @name         SL+ API Swapper
// @namespace    https://pixelmelt.dev/
// @version      0.1
// @description  Swap your SL+ api to a faster alternative
// @author       You
// @match        https://starblast.dankdmitron.dev/
// @icon         https://icons.duckduckgo.com/ip2/dankdmitron.dev.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446682/SL%2B%20API%20Swapper.user.js
// @updateURL https://update.greasyfork.org/scripts/446682/SL%2B%20API%20Swapper.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const endpoint = `https://api.pixelmelt.dev/endpoint`
 
    console.clear();
    console.log(`[SL+ API Swapper] Swapping your API provider...`);
    if (window.location.pathname == "/") {
        document.open();
        document.write(``);
        document.close();
        var url = "https://starblast.dankdmitron.dev/";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var htmledit = xhr.responseText;
                document.open();
                document.write(htmledit.replace(`js/api_providers/default.js`, endpoint));
                document.close();
            }
        };
        xhr.send();
    };
})();