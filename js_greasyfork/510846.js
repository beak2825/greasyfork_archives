// ==UserScript==
// @name         找出 symfony 文档翻译脚本
// @namespace    fireloong
// @version      0.0.1
// @description  遍历自己的脚本
// @author       Itsky71
// @match        https://greasyfork.org/zh-CN/users/768378-itsky71
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510846/%E6%89%BE%E5%87%BA%20symfony%20%E6%96%87%E6%A1%A3%E7%BF%BB%E8%AF%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/510846/%E6%89%BE%E5%87%BA%20symfony%20%E6%96%87%E6%A1%A3%E7%BF%BB%E8%AF%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    let person = {};
    $('.script-link').each(function(i, c){
        const pattern_sid = /\d{6}/;
        const sid = pattern_sid.exec($(c).attr('href'));

        const pattern_page = /^(Symfony).*\s([\w\-\/]+)\.html$/;
        const page = pattern_page.exec($(c).text());

        // console.log(page);

        if(page !== null){
            person[page[2]] = sid[0];
        }
    });

    console.log(JSON.stringify(person, null, "    "), Object.keys(person).length);
})($);
