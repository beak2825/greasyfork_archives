// ==UserScript==
// @name         AntiRickroll
// @namespace    https://github.com/charlie-moomoo
// @version      0.2
// @description  Removes the page when you're trying to access a Rickroll page.
// @author       CharlieMoomoo
// @match        *://blogs.mtdv.me/*
// @match        *://r.mtdv.me/*
// @match        *://*.youtube.com/*
// @icon         https://static.wikia.nocookie.net/youtube/images/c/ce/RickRollButWithADifferentLink.jpg/revision/latest?cb=20201023192005
// @grant        window.onurlchange
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/455437/AntiRickroll.user.js
// @updateURL https://update.greasyfork.org/scripts/455437/AntiRickroll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const run = ()=>{
        if (location.host.match(/.*\.youtube\.com/gm)){
            const rickrolls = ['dQw4w9WgXcQ','AACOcpA8i-U','j8PxqgliIno','bIwVIx5pp88','HnfkEVtetuE','QB7ACr7pUuE','mrThFRR3n8A','MCjlo7PtXMQ','a6pbjksYUHY','ll-mQPDCn-U','iik25wqIuFo','dRV6NaciZVk','LWErcuHm_C4','j7gKwxRe7MQ'];
            if (!rickrolls.includes(location.href.split('?v=')[1])) return;
        }
        document.write('Rickroll detected!<br><br>Rickroll removal powered by AntiRickroll');
        document.title = 'Rickroll detected';
        window.stop();
    }
    run()
    window.addEventListener("urlchange",run);
})();