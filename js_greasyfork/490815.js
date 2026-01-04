// ==UserScript==
// @name         fsm vote next
// @namespace    http://tampermonkey.net/
// @version      240325 v1.0
// @author       orance
// @match        https://fsm.name/Votes/details?voteId=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @description  fsm自治委员会投票“下一题”脚本
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490815/fsm%20vote%20next.user.js
// @updateURL https://update.greasyfork.org/scripts/490815/fsm%20vote%20next.meta.js
// ==/UserScript==

(function() {
    const currentUrl = window.location.href;
    const voteId = currentUrl.match(/voteId=(\d+)/)[1];

    const prevButton = document.createElement('button');
    prevButton.textContent = '上一题';
    prevButton.style.position = 'fixed';
    prevButton.style.top = '10px';
    prevButton.style.right = '70px';
    prevButton.addEventListener('click', function() {
        const prevVoteId = parseInt(voteId) - 1;
        window.location.href = `https://fsm.name/Votes/details?voteId=${prevVoteId}`;
    });

    const nextButton = document.createElement('button');
    nextButton.textContent = '下一题';
    nextButton.style.position = 'fixed';
    nextButton.style.top = '10px';
    nextButton.style.right = '10px';
    nextButton.addEventListener('click', function() {
        const nextVoteId = parseInt(voteId) + 1;
        window.location.href = `https://fsm.name/Votes/details?voteId=${nextVoteId}`;
    });

    document.body.appendChild(prevButton);
    document.body.appendChild(nextButton);
})();