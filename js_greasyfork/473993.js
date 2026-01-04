// ==UserScript==
// @license      GPL
// @name         Bing添加-site
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  baidu和google暂不支持
// @author       procrastination-user@github
// @match        *://www.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/473993/Bing%E6%B7%BB%E5%8A%A0-site.user.js
// @updateURL https://update.greasyfork.org/scripts/473993/Bing%E6%B7%BB%E5%8A%A0-site.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const searchForm = document.querySelector('form[action="/search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', interceptSearch);
    }
})();

function interceptSearch(event) {
    let currentURL = window.location.href;

    let myConf = getSEConf().find(obj => currentURL.indexOf(obj.url) > -1);
    if (myConf) {
        let input = document.getElementById(myConf.inputId)
        if (input) {
            const inputValue = input.value;

            const array = getWebSiteConf()
            const prefix = " -site:";
            const separator = " , ";

            // 使用 map() 方法添加前缀
            const arrayWithPrefix = array.map(item => prefix + item);
            // 使用 join() 方法将数组转换为字符串，并添加分隔符
            const resultString = arrayWithPrefix.join(separator);

            if (input.value.indexOf(resultString) < 0) {
                input.value = inputValue + resultString;
            }
        }
    }

    // 提交搜索表单
    const formElement = document.querySelector('form[action="/search"]');
    if (formElement) {
        formElement.submit();
    }
}

function getSEConf() {
    return [
        {name: 'bing', url: 'www.bing.com', inputId: 'sb_form_q'}
    ]
}

function getWebSiteConf() {
    return [
        'csdn.net',
        'baijiahao.baidu.com'
    ]
}
