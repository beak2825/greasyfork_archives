// ==UserScript==
// @name         FuckZhengfang
// @namespace    https://imtwice.cn
// @version      0.1.3
// @description  give everyone the power to fuck Zhengfang
// @author       Twice
// @match        http://jwglxt.qust.edu.cn/jwglxt/xsxk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371937/FuckZhengfang.user.js
// @updateURL https://update.greasyfork.org/scripts/371937/FuckZhengfang.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let count = 0;
    let limit = true;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function refresh() {
        await sleep(500);
        let heads = document.getElementsByClassName('kc_head');
        let last = heads[heads.length - 1];
        if(last) {
            last.click();
            await sleep(500);
            window.scrollTo(0,document.body.scrollHeight);
            let sib = last.nextElementSibling;
            console.log(/【(.+)】/.exec(sib.innerText)[1])
            if(/尔雅|卓越/.test(sib.innerText)) {
                console.log('Found 尔雅 or 卓越...');
                let tr = sib.firstElementChild.lastElementChild.firstElementChild;
                let btn = tr.children[tr.children.length - 2].firstElementChild;
                btn.click();
                await sleep(3000);
            }
        }
        if (limit && count > 60 * 5) {
            return;
        }
        console.log(`Refreshing ${count}...`);
        count ++;
        document.getElementsByName('query')[0].click();
        refresh();
    }

    document.getElementById('firstXkkzId').nextElementSibling.children[0].click()
    await sleep(1000);
    refresh();
})();