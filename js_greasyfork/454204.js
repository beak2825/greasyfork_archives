// ==UserScript==
// @name         起始页加书签Helper
// @namespace    https://viayoo.com/
// @version      0.4
// @description  VIA浏览器专用
// @author       xunbu
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/454204/%E8%B5%B7%E5%A7%8B%E9%A1%B5%E5%8A%A0%E4%B9%A6%E7%AD%BEHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/454204/%E8%B5%B7%E5%A7%8B%E9%A1%B5%E5%8A%A0%E4%B9%A6%E7%AD%BEHelper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let a = document.querySelector('meta[name=idcode]');
    if (a && a?.content.includes('fastpage')) {
        //在首页的逻辑
        let waitMarks = GM_getValue('bookMarkWaitingAdd', '[]');
        waitMarks = JSON.parse(waitMarks);
        console.log('waitMarks', waitMarks);
        if (!waitMarks) {
            return
        }
        let bookMarkList = window.vm.bookMarkList;
        console.log('bookMarkList', bookMarkList.value);
        waitMarks.forEach((value, index) => {
            bookMarkList.value.push({
                id: bookMarkList.value.length,
                name: value.name,
                url: value.url,
                type: 'bM',
            });
        });
        GM_setValue('bookMarkWaitingAdd', '[]');//清空GM数据库
    } else {
        //其他页面上的逻辑
        let count = 0;
        window.addEventListener('click', () => {
            count += 1;
            if (count === 4) {
                console.log('点击四次')
                const url = window.location.href;
                let urlExisted = false;
                let waitMarks = GM_getValue('bookMarkWaitingAdd', '[]');
                waitMarks = JSON.parse(waitMarks);
                let oldMarks = waitMarks;
                oldMarks.forEach((value, index) => {
                    if (value?.url === url) {//已经存在url
                        waitMarks.splice(index);
                        GM_setValue('bookMarkWaitingAdd', JSON.stringify(waitMarks))
                        console.log(GM_listValues(), GM_getValue('bookMarkWaitingAdd', '[]'));
                        alert('取消加入书签');
                        urlExisted = true;
                    }
                })
                if (!urlExisted) {
                    //新加入书签
                    let title=document.querySelector('title')?.textContent
                    let nowMark = {
                        name: title,
                        url: url,
                    };
                    waitMarks.push(nowMark);
                    GM_setValue('bookMarkWaitingAdd', JSON.stringify(waitMarks))
                    console.log(GM_listValues(), GM_getValue('bookMarkWaitingAdd', '[]'));
                    alert('加入书签');
                }
            }
            setTimeout(() => {
                count = 0
            }, 600);
        });
    }
    // Your code here...
})();