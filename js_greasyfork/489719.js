// ==UserScript==
// @name               「神算 π 的奇幻挑戰」自動程式
// @description        自動操作香港麥當勞的「神算 π 的奇幻挑戰」小遊戲。
// @icon               https://icons.duckduckgo.com/ip3/campaign.mcdonalds.com.hk.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.1
// @license            MIT
// @match              https://campaign.mcdonalds.com.hk/promo-activation/pieday2024/
// @run-at             document-end
// @grant              GM.getValue
// @grant              GM.setValue
// @grant              GM.registerMenuCommand
// @require            https://cdn.jsdelivr.net/npm/uuid-random@1.3.2/uuid-random.min.js
// @require            https://update.greasyfork.org/scripts/482311/1297431/queue.js
// @require            https://cdn.jsdelivr.net/npm/chance@1.1.11/chance.min.js
// @require            https://update.greasyfork.org/scripts/482358/1296680/sleep.js
// @downloadURL https://update.greasyfork.org/scripts/489719/%E3%80%8C%E7%A5%9E%E7%AE%97%20%CF%80%20%E7%9A%84%E5%A5%87%E5%B9%BB%E6%8C%91%E6%88%B0%E3%80%8D%E8%87%AA%E5%8B%95%E7%A8%8B%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/489719/%E3%80%8C%E7%A5%9E%E7%AE%97%20%CF%80%20%E7%9A%84%E5%A5%87%E5%B9%BB%E6%8C%91%E6%88%B0%E3%80%8D%E8%87%AA%E5%8B%95%E7%A8%8B%E5%BC%8F.meta.js
// ==/UserScript==

const RESET_KEY = uuid();

{
    let pathname = location.pathname;

    const observer = new MutationObserver(() =>
    {
        if (location.pathname !== pathname)
        {
            pathname = location.pathname;
            window.dispatchEvent(new CustomEvent(RESET_KEY));
        }
    });

    observer.observe(document.body, { subtree: true, childList: true });
}

GM.registerMenuCommand("啟動程式", async () =>
{
    if (location.pathname !== "/promo-activation/pieday2024/game")
    {
        alert("本程式只在遊戲頁面運作！");
        return;
    }

    const delay = await getDelay();

    const queue = new Queue({ autostart: true, concurrency: 1 });
    queue.addEventListener("error", (event) => console.error(event.detail.error));

    const keys = new Map();
    {
        const _keys = document.querySelectorAll(".key");
        for (const key of _keys)
        {
            const digit = key.className.match(/key-(\d|dot)/)[1];
            keys.set((digit === "dot") ? "." : digit, key);
        }
    }

    const observer = new MutationObserver((records) =>
    {
        for (const record of records)
        {
            for (const node of record.addedNodes)
            {
                queue.push(() => handleDigitElement(node));
            }
        }
    });
    observer.observe(document.querySelector(".input-number-wrapper"), { childList: true });

    const digits = document.querySelectorAll(".char:not(.active)");
    for (const digit of digits)
    {
        queue.push(() => handleDigitElement(digit));
    }

    window.addEventListener(RESET_KEY, () =>
    {
        queue.stop();
        observer.disconnect();
    }, { once: true });

    async function handleDigitElement(element)
    {
        keys.get(element.innerText).click();
        await sleep(chance.integer({ min: delay[0], max: delay[1] }));
    }
});

GM.registerMenuCommand("停止程式", () =>
{
   window.dispatchEvent(new CustomEvent(RESET_KEY));
});

GM.registerMenuCommand("設定輸入延遲", () =>
{
    setTimeout(async () =>
    {
        const input = prompt("設定輸入延遲（毫秒）：", await getDelay());
        if (!input) { return; }

        const delay = input.split(",").map((entry) => Number.parseInt(entry));
        if (Number.isInteger(delay[0]) && Number.isInteger(delay[1]) && (delay[0] <= delay[1]))
        {
            await GM.setValue("delay", [delay[0], delay[1]]);
        }
    }, 0);
});

function getDelay()
{
    return GM.getValue("delay", [250, 500]);
}
