// ==UserScript==
// @name         anti-xiuzan
// @namespace    http://tampermonkey.net/
// @version      2024-11-16
// @description  nga反修赞
// @author       You
// @match        https://nga.178.com/read.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=178.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517651/anti-xiuzan.user.js
// @updateURL https://update.greasyfork.org/scripts/517651/anti-xiuzan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const div = document.getElementById('postbtop');
    const tr = div.querySelector('tr');

    const x = tr.getBoundingClientRect().left;
    const y = tr.getBoundingClientRect().top;

    const a = document.createElement('button');
    a.type = 'button';
    a.textContent = '反修赞';
    a.style = `position: absolute; left: ${x - 70}px; top: ${y + 3}px; width: 60px; height: 30px; cursor: pointer;`;
    document.body.appendChild(a);

    a.onclick = async () => {
        const spans = document.querySelectorAll('[id^=postcontentandsubject]');
        if (!spans.length) {
            console.error(`反修赞失败：查找点赞按钮失败`);
            return;
        }

        let spanArr = [...spans].reverse();

        for (let span of spanArr) {
            const as = span.querySelectorAll('a');
            // random
            const index = Math.floor(Math.random() * 2);
            as[index].click();
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        console.log(`反修赞完毕`);
        // alert(`反修赞完毕`);
    }
})();