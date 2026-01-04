// ==UserScript==
// @name         AntiRickRoll
// @namespace    
// @version      1-BETA
// @description  Removes and puts text over a rickroll. More links will be included.
// @author       FxxmBxxs299
// @match        *://blogs.mtdv.me/*
// @match        *://r.mtdv.me/*
// @match        *://*.youtube.com/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3g45YP4IfOS7SzRNbfoAIfHafKOr7bzoOGg&s
// @grant        window.onurlchange
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/495970/AntiRickRoll.user.js
// @updateURL https://update.greasyfork.org/scripts/495970/AntiRickRoll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const run = ()=>{
        if (location.host.match(/.*\.youtube\.com/gm)){
            const rickrolls = ['dQw4w9WgXcQ','AACOcpA8i-U','j8PxqgliIno','bIwVIx5pp88','HnfkEVtetuE','QB7ACr7pUuE','mrThFRR3n8A','MCjlo7PtXMQ','a6pbjksYUHY','ll-mQPDCn-U','iik25wqIuFo','dRV6NaciZVk','LWErcuHm_C4','j7gKwxRe7MQ', 'xvFZjo5PgG0', 'mkxer6pxQ6I', 'AuKR2fQbMBk', '7_pRiUfp938', 'PMH54eetPSo', 'QdezFxHfatw', 'KyElxl_j4Wc', 'cRLXMVbA_sk', 'jajj1wjrKuE', 'jajj1wjrKuE'];
            if (!rickrolls.includes(location.href.split('?v=')[1])) return;
        }
        document.write('Rickroll detected!<br><br>Rickroll removal powered by AntiRickRoll<br><br>Made by FxxmBxxs299');
        document.title = 'Rickroll BANNED!';
        window.stop();
    }
    run()
    window.addEventListener("urlchange",run);
})();