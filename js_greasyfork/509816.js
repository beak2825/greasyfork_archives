// ==UserScript==
// @name         屈臣氏后台
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  屈臣氏uat后台快捷打开菜单
// @author       wivenzheng
// @match        http://epapi-uat.was.ink/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=was.ink
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/509816/%E5%B1%88%E8%87%A3%E6%B0%8F%E5%90%8E%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/509816/%E5%B1%88%E8%87%A3%E6%B0%8F%E5%90%8E%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function creatUl () {
        const hpzt = document.querySelector('#ucFuncList1_DataList1_ctl00_hlFuncName');
        const ydhd = document.querySelector('#ucFuncList1_DataList1_ctl01_hlFuncName');
        const ydglht = document.querySelector('#ucFuncList1_DataList1_ctl04_hlFuncName');

        if(!hpzt) return

        const host = 'http://localhost'
        const urls = {
            hpzt: {
                url: hpzt.href.replace('http://goods-mp.was.ink', host + ':8080'),
                title: '货品中台'
            },
            ydhd: {
                url: ydhd.href.replace('https://mystore-uat.watsonsestore.com.cn/01h5/new-cms', host + ':8081'),
                title: '云店活动'
            },
            hdglht: {
                url: ydglht.href.replace('http://msc-mystore-uat-admin.was.ink', host + ':9527'),
                title: '云店管理后台'
            }
        }
        const ul = document.createElement('ul');

        ul.style.position = 'fixed';
        ul.style.top = '0';
        ul.style.right = '0';
        ul.style.background = '#fff'
        for(const k in urls) {
            const li = document.createElement('li');

            const a = document.createElement('a');
            a.href = urls[k].url;
            a.target = '_blank';
            a.textContent = urls[k].title;

            li.appendChild(a);
            ul.appendChild(li);
        }
        document.body.appendChild(ul);
    }

    window.onload = () => {
        creatUl()
    }
    // Your code here...
})();