// ==UserScript==
// @name         仓库提取码填写
// @namespace    moe.jixun.gal.code
// @version      0.2.2
// @description  自动填写提取码到百度链接 (搭配 #1002, #19864 食用)。
// @author       Jixun <https://jixun.moe/>
// @include      https://galacg.me/*
// @include      https://cangku.moe/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/21469/%E4%BB%93%E5%BA%93%E6%8F%90%E5%8F%96%E7%A0%81%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/21469/%E4%BB%93%E5%BA%93%E6%8F%90%E5%8F%96%E7%A0%81%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

/* jshint esnext:true */
(function (callback) {
    addEventListener('xhrRequestEvent', callback);
})(function () {
    'use strict';
    function find (base, query) {
        return base.querySelector(query);
    }

    function findAll (base, query) {
        return base.querySelectorAll(query);
    }

    var downBoxes = document.getElementsByClassName('dl-box');
    Array.prototype.forEach.call(downBoxes, box => {
        let info = find(box, 'span.info');
        let code = info.textContent.match(/提取码?\s*[：:]\s*(\w{4}|\W\w)/);
        if (code && code.length == 2) {
            code = code[1];

            let links = findAll(box, '.dl-link a');
            Array.prototype.filter.call(links, link => {
                return link.href.indexOf('baidu.com') != -1 && link.href.indexOf('#') == -1;
            }).forEach(link => {
                link.href += '#' + code;
                link.target = '';
            });
        }
    });
});
