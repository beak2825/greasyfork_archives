// ==UserScript==
// @name         Fast Vote Loop x3 - B1A4 산들
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto vote 3 times for B1A4 산들 with popup confirm and fast execution per cycle.
// @author       JBT
// @license      JBT
// @match        https://starnewskorea.com/star-ranking/male-idol/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534982/Fast%20Vote%20Loop%20x3%20-%20B1A4%20%EC%82%B0%EB%93%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/534982/Fast%20Vote%20Loop%20x3%20-%20B1A4%20%EC%82%B0%EB%93%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_NAME = "라이즈 소희";
    const TOTAL_VOTES = 2;
    const DELAY_BETWEEN_VOTES = 1500; // 1.5 sec between cycles

    const log = msg => console.log(`[🔁 AutoVote] ${msg}`);
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function findNomineeVoteBtn(name) {
        const nameDivs = [...document.querySelectorAll("div.text-14\\/20.font-bold.mt-2")];
        for (const div of nameDivs) {
            if (div.textContent.trim() === name) {
                const rootLi = div.closest("li");
                if (!rootLi) continue;
                const btn = [...rootLi.querySelectorAll("button")]
                    .find(b => b.textContent.includes("투표하기"));
                if (btn) return btn;
            }
        }
        return null;
    }

    async function waitForPopupVoteBtn(timeout = 3000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const popupBtn = [...document.querySelectorAll("div[role='dialog'] button")]
                .find(btn => btn.textContent.includes("투표하기") && btn.offsetParent !== null);
            if (popupBtn) return popupBtn;
            await sleep(100);
        }
        return null;
    }

    async function voteCycle() {
        for (let i = 1; i <= TOTAL_VOTES; i++) {
            log(`🔄 Cycle ${i} of ${TOTAL_VOTES}`);

            const btn = findNomineeVoteBtn(TARGET_NAME);
            if (!btn) {
                log("❌ Vote button not found. Retrying...");
                await sleep(1000);
                continue;
            }

            btn.click();
            log("🖱️ Clicked main vote button.");

            const popupBtn = await waitForPopupVoteBtn();
            if (popupBtn) {
                popupBtn.click();
                log("✅ Vote confirmed in popup.");
            } else {
                log("⚠️ Popup not found. Skipping this round.");
            }

            if (i < TOTAL_VOTES) {
                log(`⏳ Waiting ${DELAY_BETWEEN_VOTES}ms before next vote...`);
                await sleep(DELAY_BETWEEN_VOTES);
            }
        }

        log("🎉 Voting complete!");
    }

    function runWhenReady() {
        const tryStart = () => {
            const btn = findNomineeVoteBtn(TARGET_NAME);
            if (btn) {
                log(`🎯 Found "${TARGET_NAME}". Starting loop...`);
                voteCycle();
                return true;
            }
            return false;
        };

        if (!tryStart()) {
            const observer = new MutationObserver(() => {
                if (tryStart()) observer.disconnect();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    requestIdleCallback(runWhenReady, { timeout: 2000 });
})();
