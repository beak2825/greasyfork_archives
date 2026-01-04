// ==UserScript==
// @name         综合素质评价优化
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  优化综合素质评价体验
// @author       share121
// @match        *://czzp.gdedu.gov.cn/czzhszpj/web/*
// @icon         https://czzp.gdedu.gov.cn/czzhszpj/themes/default/zhszpj/skins/images/common/zh_logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459132/%E7%BB%BC%E5%90%88%E7%B4%A0%E8%B4%A8%E8%AF%84%E4%BB%B7%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/459132/%E7%BB%BC%E5%90%88%E7%B4%A0%E8%B4%A8%E8%AF%84%E4%BB%B7%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(async () => {
    const data = await (
        await fetch(
            "https://czzp.gdedu.gov.cn/czzhszpj/web/formsNav/xsCltbIndex.do?method=queryZbTxList"
        )
    ).json();
    let arr = [];
    data.xsbtxList.forEach((e) => {
        e.erjizblist.forEach((e) => {
            e.sanjizblist.forEach((e) => {
                let tmp = {};
                tmp[e.gcd_mc] = e.tbsm;
                arr.push(JSON.stringify(tmp));
            });
        });
    });
    console.log([...new Set(arr)].map((e) => JSON.parse(e)));
})();
