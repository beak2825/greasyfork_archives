// ==UserScript==
// @name         知网学位论文专利自动跳转海外下载页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动跳转海外版知网专利页面，下载PDF版本专利
// @author       Albert
// @match        https://kns.cnki.net/kcms/detail/detail.aspx?*
// @icon         https://www.cnki.net/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442445/%E7%9F%A5%E7%BD%91%E5%AD%A6%E4%BD%8D%E8%AE%BA%E6%96%87%E4%B8%93%E5%88%A9%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%B5%B7%E5%A4%96%E4%B8%8B%E8%BD%BD%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/442445/%E7%9F%A5%E7%BD%91%E5%AD%A6%E4%BD%8D%E8%AE%BA%E6%96%87%E4%B8%93%E5%88%A9%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%B5%B7%E5%A4%96%E4%B8%8B%E8%BD%BD%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    var url_part_list = url.split('.');
    url_part_list[0] = 'https://oversea';
    var new_url = '';
    for (var i = 0; i < url_part_list.length; i++) {
        new_url += url_part_list[i];
        if (i+1 != url_part_list.length) {new_url += '.';}
    }
    self.location.href = new_url;
})();