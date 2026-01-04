// ==UserScript==
// @name         Classic LC Contest Ranking
// @namespace    http://github.com/bramar2
// @version      2024-09-13
// @description  Classic Contest Rank Page >>> New Contest Rank Page
// @author       bramar2
// @match        https://leetcode.com/contest/*
// @grant        none
// @license      GNU General Public License Version 3
// @downloadURL https://update.greasyfork.org/scripts/508284/Classic%20LC%20Contest%20Ranking.user.js
// @updateURL https://update.greasyfork.org/scripts/508284/Classic%20LC%20Contest%20Ranking.meta.js
// ==/UserScript==

/** LICENSED with GNU GPL v3 */

/*
BUG: When going back from OLD contest ranking page -> contest page, it will show "To register for the contest, you need to be logged in."
*/

(async function() {
    'use strict';
    async function oldRankingPage() {
        let pn = window.location.pathname;
        if(!pn.toLowerCase().includes("ranking")) {
            if(!pn.endsWith("/")) pn += "/";
            pn += "ranking";
        }
        return await (await fetch(pn, {method: "GET", credentials: "omit"})).text();
    }
    async function gotoRanking() {
        let pn = window.location.pathname;
        if(!pn.endsWith("/")) pn += "/";
        pn += "ranking";
        let x = await oldRankingPage();
        window.history.pushState({}, "", pn);
        try {
        document.open(); document.write(x); document.close();
        }catch(e) { document.close(); console.error("Error 1", e); }
    }
    async function gotoContestPage() {
        let pn = window.location.pathname;
        if(pn.toLowerCase().includes("ranking")) {
            pn = pn.substr(0, pn.toLowerCase().lastIndexOf("ranking"));
        }
        let x = await (await fetch(pn)).text();
        window.history.pushState({}, "", pn);
        try {
        document.open(); document.write(x); document.close();
        }catch(e) { document.close(); console.error("Error 2", e); }
    }
    function checkBtn(a) {
        try {
            let bb = document.querySelector('.ranking-more-btn');
            if(bb) {
                let cc = bb.cloneNode(true);
                cc.addEventListener('click', gotoRanking);
                bb.parentNode.replaceChild(cc, bb);
            }else if(a <= 2) setTimeout(checkBtn, 500, a+1);
        }catch(e) {
            if(a <= 2) setTimeout(checkBtn, 500, a+1);
            console.error("Error 3", e);
        }
    }
    function checkOldBackBtn(a) {
        if(!window.location.href.toLowerCase().includes("ranking")) return;
        try {
            let bb = document.querySelector('#contest-app > div > div > h1 > span > a');
            if(bb) {
                let cc = bb.cloneNode(true);
                cc.addEventListener('click', gotoContestPage);
                bb.parentNode.replaceChild(cc, bb);
            }else if(a <= 5) setTimeout(checkOldBackBtn, 100, a+1);
        }catch(e) {
            if(a <= 5) setTimeout(checkOldBackBtn, 100, a+1);
             console.error("Error 4", e);
        }
    }
    if(window.location.pathname.includes("ranking") && document.querySelector('html').className == "dark") {
        document.body.style.display = 'none'
        const x = await oldRankingPage();
        clearTimeout(); clearInterval();
        setTimeout(() => {
            document.open();
            document.write("");
            document.close();
            setTimeout(() => {
                try {
                document.open();
                document.write(x);
                document.close();
                }catch(e) { document.close(); console.error("Error 5", e); }
                checkOldBackBtn(0);
            }, 50);
        }, 1299);
    }else{
        checkBtn(0); checkOldBackBtn(0);
    }
    const hps = window.history.pushState;
    window.history.pushState = (a, b, c) => {
        hps(a, b, c);
        checkBtn(0); checkOldBackBtn(0);
    };
})();