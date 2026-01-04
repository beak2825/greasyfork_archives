// ==UserScript==
// @name         Ioa Plus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto click feishu login btn
// @author       iMeiji
// @include      https://docs-vywrajy.micoworld.net/login.action?*
// @include      https://jira-vywrajy.micoworld.net/login*
// @include      https://micous-idp.cig.tencentcs.com/login*
// @include      https://open.feishu.cn/open-apis/authen/v1/user_auth_page_beta*
// @match        https://docs-vywrajy.micoworld.net/login*
// @icon         https://www.google.com/s2/favicons?domain=micoworld.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437416/Ioa%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/437416/Ioa%20Plus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    const observer = new MutationObserver(main);
    let article = document.body;

    let options = {
        'subtree': true,
        'attributes': true
    };

    observer.observe(article, options);


    function getElementsByClassName2(names, rootElement) {
        if (!rootElement) {
            rootElement = document;
        }

        // if (rootElement.getElementsByClassName) {
        //     console.log("走的是原生方法");
        //     return rootElement.getElementsByClassName(names);
        // }

        console.log("走的是兼容方案");
        var classElements = [];
        var allElements = rootElement.getElementsByTagName("*");
        var pattern = new RegExp(names);

        for (var i = 0, j = 0; i < allElements.length; i++) {
            if (pattern.test(allElements[i].className)) {
                classElements[j] = allElements[i];
                j++;
            }
        }

        return classElements;
    }

    function main() {
        console.log("main")
        var list = document.getElementsByClassName("aui-button aui-style aui-button-primary")
        for (let item of list) {
            if (item.text == '使用玉符登录') {
                item.click()
            }
        }

        list = document.getElementsByClassName("ant-btn ant-btn-primary ant-btn-lg ant-btn-block")
        for (let item of list) {
            item.click()
        }

        list = getElementsByClassName2("index--bottom-btn-accept")
        for (let item of list) {
            item.click()
        }
    }

    window.onload = function () {
        main()
    }

})();