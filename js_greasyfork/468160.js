// ==UserScript==
// @name         防止要福利部分链接二次跳转乱码
// @namespace    https://github.com/dadaewqq/fun
// @version      0.2
// @description  替换要福利href中的网址，防止二次跳转乱码
// @author       dadaewqq
// @match        https://1fuli.xyz/*
// @match        https://1fuli.life/*
// @match        https://www.yeeach.com/*
// @match        https://www.xunihao.org/*
// @match        https://seju.life/*
// @icon         https://1fuli.xyz/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468160/%E9%98%B2%E6%AD%A2%E8%A6%81%E7%A6%8F%E5%88%A9%E9%83%A8%E5%88%86%E9%93%BE%E6%8E%A5%E4%BA%8C%E6%AC%A1%E8%B7%B3%E8%BD%AC%E4%B9%B1%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/468160/%E9%98%B2%E6%AD%A2%E8%A6%81%E7%A6%8F%E5%88%A9%E9%83%A8%E5%88%86%E9%93%BE%E6%8E%A5%E4%BA%8C%E6%AC%A1%E8%B7%B3%E8%BD%AC%E4%B9%B1%E7%A0%81.meta.js
// ==/UserScript==


(function() {
    'use strict';

    $(document).ready(function() {
    $('a[href*="https://jubt.top"]').each(function() {
        var href = $(this).attr('href');
        $(this).attr('href', href.replace('https://jubt.top', 'https://jubt.fun'));
    });
});

})();