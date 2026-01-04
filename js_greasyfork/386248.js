// ==UserScript==
// @name         直接获取动漫花园种子下载链接
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  直接在资源列表页显示种子的下载链接
// @author       pboymt
// @match        https://share.dmhy.org/topics/list*
// @match        https://share.dmhy.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386248/%E7%9B%B4%E6%8E%A5%E8%8E%B7%E5%8F%96%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E7%A7%8D%E5%AD%90%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/386248/%E7%9B%B4%E6%8E%A5%E8%8E%B7%E5%8F%96%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E7%A7%8D%E5%AD%90%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const allLink = [];

    const thead = document.querySelector('#topic_list > thead > tr');
    const th = document.querySelector('#topic_list > thead > tr > th:nth-child(4)');
    const nth = th.cloneNode(true);
    nth.querySelector('span').remove();

    const copyAllLink = document.createElement('a');
    copyAllLink.href = '#';
    copyAllLink.textContent = '種子';
    copyAllLink.title = '點擊所有複製鏈接';
    copyAllLink.classList.add('title');
    copyAllLink.style.color = '#ffffff';
    copyAllLink.addEventListener('click', () => {
        window.navigator.clipboard.writeText(allLink.join('\n'));
    });

    nth.appendChild(copyAllLink);
    thead.insertBefore(nth, th);

    const trList = document.querySelectorAll('#topic_list > tbody > tr');

    trList.forEach(ele => {

        const dateStr = ele.querySelector('td:nth-child(1) span').textContent.trim();
        const date = new Date(dateStr);

        const magnetEle = ele.querySelector('.download-arrow.arrow-magnet');
        const magnet = magnetEle.getAttribute('href');
        const ma = magnet.match(/[2-7A-Z]{32}/);
        const base32 = ma[0];
        const hash = base32ToMagnet(base32);

        const link = getTorrentLink(hash, date);

        allLink.push(link);

        const td = document.createElement('td');
        const a = document.createElement('a');

        a.classList.add('download-arrow', 'arrow-magnet');
        a.textContent = '';
        a.href = link;
        a.style.filter = 'invert(100%)';

        td.appendChild(a);

        ele.insertBefore(td, ele.querySelector('td:nth-child(4)'));

    });

    function base32ToMagnet(str) {

        console.log(str);
        const dict32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        const dictHex = '0123456789abcdef';

        let binStr = '';
        for (const char of str) {
            const i = dict32.indexOf(char);
            binStr += i.toString(2).padStart(5, '0');
        }

        let magnet = '';
        for (let index = 0; index < binStr.length; index = index + 4) {
            const bin = binStr.substr(index, 4);
            const i = parseInt(bin, 2);
            magnet += dictHex[i];
        }

        return magnet;

    }

    function getTorrentLink(hash = '', date = new Date) {

        const template = 'https://dl.dmhy.org/$YEAR/$MONTH/$DATE/$HASH.torrent';

        let link = template.replace('$HASH', hash);
        link = link.replace('$YEAR', date.getFullYear().toString().padStart(2, '0'));
        link = link.replace('$MONTH', (date.getMonth() + 1).toString().padStart(2, '0'));
        link = link.replace('$DATE', date.getDate().toString().padStart(2, '0'));

        return link;
    }

})();