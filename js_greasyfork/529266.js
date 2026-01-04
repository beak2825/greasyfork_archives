// ==UserScript==
// @name         SOOP auto reload live
// @version      2025-03-09
// @description  play.sooplive.co.kr 에서 대기하다가 방송이 시작되면 자동으로 새로고침해줘요
// @author       chatting banned
// @match        https://play.sooplive.co.kr/*
// @icon         https://res.sooplive.co.kr/favicon.ico
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace https://greasyfork.org/users/1443830
// @downloadURL https://update.greasyfork.org/scripts/529266/SOOP%20auto%20reload%20live.user.js
// @updateURL https://update.greasyfork.org/scripts/529266/SOOP%20auto%20reload%20live.meta.js
// ==/UserScript==

(async()=>{
    /**
     * wait and returns the HTMLElement until it is found.
     *
     * @param {String} selector sizzle selector for querySelector
     * @return {Promise<HTMLElement>}
     */
    const waitForElement = async (selector) => {
        return new Promise((resolve) => {
        let observedElement = document.querySelector(selector);
        if (observedElement) return resolve(observedElement);

        let observer = new MutationObserver(() => {
                let observedElement = document.querySelector(selector);
                if (observedElement) {
                observer.disconnect();
                resolve(observedElement);
                }
        });

        observer.observe(document.documentElement, {
                childList: !0,
                subtree: !0,
        });
        });
    };

    /**
     * awaits for t ms.
     * @param {Number} t sleep time
     * @returns {Promise<null>}
     */
    const sleep = t => new Promise(r=>setTimeout(r,t));

    const reloadBroadCastMain = async () => {
        const intl = new Intl.DateTimeFormat("ko-KR", {
            minute: "2-digit",
            hour: "2-digit",
            second: "2-digit",
            hour12: false,
        });
        let broadCastText = await waitForElement(`.notBroadingInfoTitle`);
        const bjid = location.pathname.split("/").at(1);
        let BNO = undefined;
        do {
            await sleep(1000);
            const { CHANNEL: resp } = await fetch(
                "https://live.sooplive.co.kr/afreeca/player_live_api.php",
                {
                    headers: {"content-type": "application/x-www-form-urlencoded",},
                    body: `bid=${bjid}&bno=null&type=live&pwd=&player_type=html5&stream_type=common&quality=HD&mode=landing&from_api=0&is_revive=false`,
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                }
            ).then((r) => r.json());
            BNO = resp.BNO;
            if (broadCastText) {
                const textContent = `방송 시작을 기다리는 중이에요 (${intl.format(
                    new Date(Date.now())
                )})`;
                broadCastText.textContent = textContent;
                // console.log(textContent);
            }
            if (BNO > 0) break;
        } while (BNO === undefined || location.pathname.split("/").at(-1) != BNO);

        if (BNO != location.pathname.split("/").at(-1) && BNO) {
            location.pathname = `/${bjid}/${BNO}`;
        }
    };

    await reloadBroadCastMain();
    await waitForElement(`#player > div.video_blind > div > div > div`); // detects broadcast End
    await reloadBroadCastMain();
})();