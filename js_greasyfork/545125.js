// ==UserScript==
// @name         SOOP(숲) 라이브 대기
// @version      1.0.0
// @description  play.sooplive.co.kr 에서 대기하다가 방송이 시작되면 자동으로 새로고침
// @author       멍멍이
// @match        https://play.sooplive.co.kr/*
// @icon         https://res.sooplive.co.kr/favicon.ico
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://greasyfork.org/users/1443830
// @downloadURL https://update.greasyfork.org/scripts/545125/SOOP%28%EC%88%B2%29%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8C%80%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/545125/SOOP%28%EC%88%B2%29%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8C%80%EA%B8%B0.meta.js
// ==/UserScript==
 
(async () => {
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
                childList: true,
                subtree: true,
            });
        });
    };
 
    const sleep = (t) => new Promise((r) => setTimeout(r, t));
 
    const formatKoreanTime = () => {
        const now = new Date();
        const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
        const day = weekdays[now.getDay()];
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
        return `${dateStr} (${day}) ${timeStr}`;
    };
 
    const reloadBroadCastMain = async () => {
        let broadCastText = await waitForElement(`.notBroadingInfoTitle`);
        const bjid = location.pathname.split("/").at(1);
        let BNO = undefined;
 
        do {
            await sleep(1000);
            const { CHANNEL: resp } = await fetch(
                "https://live.sooplive.co.kr/afreeca/player_live_api.php",
                {
                    headers: { "content-type": "application/x-www-form-urlencoded" },
                    body: `bid=${bjid}&bno=null&type=live&pwd=&player_type=html5&stream_type=common&quality=HD&mode=landing&from_api=0&is_revive=false`,
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                }
            ).then((r) => r.json());
 
            BNO = resp.BNO;
 
            if (broadCastText) {
                broadCastText.innerHTML = `
                    <div style="font-size:35px; margin-bottom:10px;">
                        ${formatKoreanTime()}
                    </div>
                    <div style="font-size:25px;">
                        방송 시작 기다리는 중...
                    </div>
                `;
            }
 
            if (BNO > 0) break;
        } while (BNO === undefined || location.pathname.split("/").at(-1) != BNO);
 
        if (BNO != location.pathname.split("/").at(-1) && BNO) {
            location.pathname = `/${bjid}/${BNO}`;
        }
    };
 
    await reloadBroadCastMain();
    await waitForElement(`#player > div.video_blind > div > div > div`);
    await reloadBroadCastMain();
})();