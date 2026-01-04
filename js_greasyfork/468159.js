// ==UserScript==
// @name         聚BT子标题加粗加大
// @namespace    https://github.com/dadaewqq/fun
// @version      0.2
// @description  修改聚BT子标题样式
// @author       dadaewqq
// @match        https://jubt.fun/*
// @match        https://jubt11.xyz/*
// @icon         https://jubt.fun/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468159/%E8%81%9ABT%E5%AD%90%E6%A0%87%E9%A2%98%E5%8A%A0%E7%B2%97%E5%8A%A0%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/468159/%E8%81%9ABT%E5%AD%90%E6%A0%87%E9%A2%98%E5%8A%A0%E7%B2%97%E5%8A%A0%E5%A4%A7.meta.js
// ==/UserScript==


(function() {
    'use strict';

    $('h4.text-gray').css({
        'color': 'black',
        'font-weight': 'bold',
        'font-size': '24px'
    });

    $('h4.text-gray:first').css({
        'font-size': '36px'
    });

})();