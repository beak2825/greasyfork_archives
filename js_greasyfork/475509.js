// ==UserScript==
// @name         小猴皮皮点读笔下载地址获取
// @namespace    https://github.com/tsccai
// @version      0.1
// @description  小猴皮皮的资源下载网站(https)使用了http的资源链接，导致下载不正常。现将资源的下载链接提取出来，附在页面上，点击即可下载。
// @author       Tsccai
// @match        https://piyopen.lovereadingbooks.com/content/*
// @icon         https://www.lovereadingbooks.com/themes/contrib/bootstrap/logo.svg
// @license MIT
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/475509/%E5%B0%8F%E7%8C%B4%E7%9A%AE%E7%9A%AE%E7%82%B9%E8%AF%BB%E7%AC%94%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/475509/%E5%B0%8F%E7%8C%B4%E7%9A%AE%E7%9A%AE%E7%82%B9%E8%AF%BB%E7%AC%94%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const RES_BASE_URL = 'https://p.lovereadingbooks.com/api/v1/content?_format=json&page=0&id=';
    const id = window.location.pathname.replace('/content/', '');
    getLinks();
    async function getLinks() {

        const json = await (await fetch(RES_BASE_URL + id)).json();
        //console.log(json);
        const ele_books = document.querySelectorAll('.ant-list-item-main');
        let cnt = 0;
        for (let i of ele_books) {

            const anchor = document.createElement('a');
            anchor.target = ":blank";
            anchor.innerHTML = i.querySelector('i').innerHTML.replace('currentColor', 'red');
            //anchor.innerHTML = anchor.innerHTML.replace('currentColor','red');
            //anchor.innerHTML='真下载地址';
            anchor.href = json[cnt].fileUrl;
            anchor.addEventListener('click', startDownload);
            i.querySelector('i').remove();
            i.querySelector('.ant-list-item-action span').appendChild(anchor);
            cnt++;
        }
        cnt = 0;


        function startDownload(evt) {
            const url = evt.target.parentElement.href;
            GM_openInTab(url);
        }
    }

})();