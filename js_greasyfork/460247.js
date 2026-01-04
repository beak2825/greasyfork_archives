// ==UserScript==
// @name               Opens “Tools” Menu by Default on Google
// @name:zh-TW         預設開啟 Google 的「工具」選單
// @name:zh-CN         预设开启 Google 的“工具”选单
// @name:ja            Google のデフォルトで「ツール」メニューを開く
// @description        Opens the “Tools” menu on Google Search automatically when page loaded.
// @description:zh-TW  在 Google 搜尋載入後自動打開「工具」選單。
// @description:zh-CN  在 Google 搜索载入后自动打开“工具”选单。
// @description:ja     ページが読み込まれると、Google 検索の「ツール」メニューが自動的に開きます。
// @icon               https://wsrv.nl/?url=https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.2.1
// @license            MIT
// @match              https://www.google.com/search?*
// @match              https://www.google.ad/search?*
// @match              https://www.google.ae/search?*
// @match              https://www.google.com.af/search?*
// @match              https://www.google.com.ag/search?*
// @match              https://www.google.al/search?*
// @match              https://www.google.am/search?*
// @match              https://www.google.co.ao/search?*
// @match              https://www.google.com.ar/search?*
// @match              https://www.google.as/search?*
// @match              https://www.google.at/search?*
// @match              https://www.google.com.au/search?*
// @match              https://www.google.az/search?*
// @match              https://www.google.ba/search?*
// @match              https://www.google.com.bd/search?*
// @match              https://www.google.be/search?*
// @match              https://www.google.bf/search?*
// @match              https://www.google.bg/search?*
// @match              https://www.google.com.bh/search?*
// @match              https://www.google.bi/search?*
// @match              https://www.google.bj/search?*
// @match              https://www.google.com.bn/search?*
// @match              https://www.google.com.bo/search?*
// @match              https://www.google.com.br/search?*
// @match              https://www.google.bs/search?*
// @match              https://www.google.bt/search?*
// @match              https://www.google.co.bw/search?*
// @match              https://www.google.by/search?*
// @match              https://www.google.com.bz/search?*
// @match              https://www.google.ca/search?*
// @match              https://www.google.cd/search?*
// @match              https://www.google.cf/search?*
// @match              https://www.google.cg/search?*
// @match              https://www.google.ch/search?*
// @match              https://www.google.ci/search?*
// @match              https://www.google.co.ck/search?*
// @match              https://www.google.cl/search?*
// @match              https://www.google.cm/search?*
// @match              https://www.google.cn/search?*
// @match              https://www.google.com.co/search?*
// @match              https://www.google.co.cr/search?*
// @match              https://www.google.com.cu/search?*
// @match              https://www.google.cv/search?*
// @match              https://www.google.com.cy/search?*
// @match              https://www.google.cz/search?*
// @match              https://www.google.de/search?*
// @match              https://www.google.dj/search?*
// @match              https://www.google.dk/search?*
// @match              https://www.google.dm/search?*
// @match              https://www.google.com.do/search?*
// @match              https://www.google.dz/search?*
// @match              https://www.google.com.ec/search?*
// @match              https://www.google.ee/search?*
// @match              https://www.google.com.eg/search?*
// @match              https://www.google.es/search?*
// @match              https://www.google.com.et/search?*
// @match              https://www.google.fi/search?*
// @match              https://www.google.com.fj/search?*
// @match              https://www.google.fm/search?*
// @match              https://www.google.fr/search?*
// @match              https://www.google.ga/search?*
// @match              https://www.google.ge/search?*
// @match              https://www.google.gg/search?*
// @match              https://www.google.com.gh/search?*
// @match              https://www.google.com.gi/search?*
// @match              https://www.google.gl/search?*
// @match              https://www.google.gm/search?*
// @match              https://www.google.gr/search?*
// @match              https://www.google.com.gt/search?*
// @match              https://www.google.gy/search?*
// @match              https://www.google.com.hk/search?*
// @match              https://www.google.hn/search?*
// @match              https://www.google.hr/search?*
// @match              https://www.google.ht/search?*
// @match              https://www.google.hu/search?*
// @match              https://www.google.co.id/search?*
// @match              https://www.google.ie/search?*
// @match              https://www.google.co.il/search?*
// @match              https://www.google.im/search?*
// @match              https://www.google.co.in/search?*
// @match              https://www.google.iq/search?*
// @match              https://www.google.is/search?*
// @match              https://www.google.it/search?*
// @match              https://www.google.je/search?*
// @match              https://www.google.com.jm/search?*
// @match              https://www.google.jo/search?*
// @match              https://www.google.co.jp/search?*
// @match              https://www.google.co.ke/search?*
// @match              https://www.google.com.kh/search?*
// @match              https://www.google.ki/search?*
// @match              https://www.google.kg/search?*
// @match              https://www.google.co.kr/search?*
// @match              https://www.google.com.kw/search?*
// @match              https://www.google.kz/search?*
// @match              https://www.google.la/search?*
// @match              https://www.google.com.lb/search?*
// @match              https://www.google.li/search?*
// @match              https://www.google.lk/search?*
// @match              https://www.google.co.ls/search?*
// @match              https://www.google.lt/search?*
// @match              https://www.google.lu/search?*
// @match              https://www.google.lv/search?*
// @match              https://www.google.com.ly/search?*
// @match              https://www.google.co.ma/search?*
// @match              https://www.google.md/search?*
// @match              https://www.google.me/search?*
// @match              https://www.google.mg/search?*
// @match              https://www.google.mk/search?*
// @match              https://www.google.ml/search?*
// @match              https://www.google.com.mm/search?*
// @match              https://www.google.mn/search?*
// @match              https://www.google.com.mt/search?*
// @match              https://www.google.mu/search?*
// @match              https://www.google.mv/search?*
// @match              https://www.google.mw/search?*
// @match              https://www.google.com.mx/search?*
// @match              https://www.google.com.my/search?*
// @match              https://www.google.co.mz/search?*
// @match              https://www.google.com.na/search?*
// @match              https://www.google.com.ng/search?*
// @match              https://www.google.com.ni/search?*
// @match              https://www.google.ne/search?*
// @match              https://www.google.nl/search?*
// @match              https://www.google.no/search?*
// @match              https://www.google.com.np/search?*
// @match              https://www.google.nr/search?*
// @match              https://www.google.nu/search?*
// @match              https://www.google.co.nz/search?*
// @match              https://www.google.com.om/search?*
// @match              https://www.google.com.pa/search?*
// @match              https://www.google.com.pe/search?*
// @match              https://www.google.com.pg/search?*
// @match              https://www.google.com.ph/search?*
// @match              https://www.google.com.pk/search?*
// @match              https://www.google.pl/search?*
// @match              https://www.google.pn/search?*
// @match              https://www.google.com.pr/search?*
// @match              https://www.google.ps/search?*
// @match              https://www.google.pt/search?*
// @match              https://www.google.com.py/search?*
// @match              https://www.google.com.qa/search?*
// @match              https://www.google.ro/search?*
// @match              https://www.google.ru/search?*
// @match              https://www.google.rw/search?*
// @match              https://www.google.com.sa/search?*
// @match              https://www.google.com.sb/search?*
// @match              https://www.google.sc/search?*
// @match              https://www.google.se/search?*
// @match              https://www.google.com.sg/search?*
// @match              https://www.google.sh/search?*
// @match              https://www.google.si/search?*
// @match              https://www.google.sk/search?*
// @match              https://www.google.com.sl/search?*
// @match              https://www.google.sn/search?*
// @match              https://www.google.so/search?*
// @match              https://www.google.sm/search?*
// @match              https://www.google.sr/search?*
// @match              https://www.google.st/search?*
// @match              https://www.google.com.sv/search?*
// @match              https://www.google.td/search?*
// @match              https://www.google.tg/search?*
// @match              https://www.google.co.th/search?*
// @match              https://www.google.com.tj/search?*
// @match              https://www.google.tl/search?*
// @match              https://www.google.tm/search?*
// @match              https://www.google.tn/search?*
// @match              https://www.google.to/search?*
// @match              https://www.google.com.tr/search?*
// @match              https://www.google.tt/search?*
// @match              https://www.google.com.tw/search?*
// @match              https://www.google.co.tz/search?*
// @match              https://www.google.com.ua/search?*
// @match              https://www.google.co.ug/search?*
// @match              https://www.google.co.uk/search?*
// @match              https://www.google.com.uy/search?*
// @match              https://www.google.co.uz/search?*
// @match              https://www.google.com.vc/search?*
// @match              https://www.google.co.ve/search?*
// @match              https://www.google.co.vi/search?*
// @match              https://www.google.com.vn/search?*
// @match              https://www.google.vu/search?*
// @match              https://www.google.ws/search?*
// @match              https://www.google.rs/search?*
// @match              https://www.google.co.za/search?*
// @match              https://www.google.co.zm/search?*
// @match              https://www.google.co.zw/search?*
// @match              https://www.google.cat/search?*
// @run-at             document-end
// @grant              none
// @supportURL         https://greasyfork.org/scripts/460247/feedback
// @downloadURL https://update.greasyfork.org/scripts/460247/Opens%20%E2%80%9CTools%E2%80%9D%20Menu%20by%20Default%20on%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/460247/Opens%20%E2%80%9CTools%E2%80%9D%20Menu%20by%20Default%20on%20Google.meta.js
// ==/UserScript==

const TOOLS_BUTTON_ATTRIBUTES = [
    ["aria-controls", "hdtbMenus"],
    ["jsname", "I4bIT"],
    ["jscontroller", "LbcJwc"],
];

const TOOLS_BUTTON_SELECTOR = TOOLS_BUTTON_ATTRIBUTES.map(([name, value]) => `[${name}=${value}]`).join(",");

function handleToolsButton(button)
{
    console.debug("“Tools” button found, activating the “Tools” menu...");

    clearTimeout(observerTimeout);
    observer.disconnect();

    const interval = setInterval(() =>
    {
        if (button.getAttribute("aria-expanded") === "true")
        {
            console.debug("“Tools” menu activated, congration!");

            clearTimeout(activateTimeout);
            clearInterval(interval);
        }
        else
        {
            button.click();
        }
    }, 250);

    const activateTimeout = setTimeout(() =>
    {
        console.debug("“Tools” menu not opened, aborting...");
        clearInterval(interval);
    }, 120000);
}

const observer = new MutationObserver((records) =>
{
    for (const record of records)
    {
        for (const node of record.addedNodes)
        {
            if (node instanceof Element)
            {
                if (TOOLS_BUTTON_ATTRIBUTES.some(([name, value]) => (node.getAttribute(name) === value)))
                {
                    handleToolsButton(node);
                }
                else
                {
                    const button = node.querySelector(TOOLS_BUTTON_SELECTOR);
                    if (button)
                    {
                        handleToolsButton(button);
                    }
                }
            }
        }
    }
});

observer.observe(document.body, { subtree: true, childList: true });
const observerTimeout = setTimeout(() =>
{
    console.debug("“Tools” button still not exist, aborting...");
    observer.disconnect();
}, 120000);

const button = document.querySelector(TOOLS_BUTTON_SELECTOR);
if (button)
{
    handleToolsButton(button);
}
else
{
    console.debug("“Tools” button not exist, attempting the MutationObserver method...");
}
