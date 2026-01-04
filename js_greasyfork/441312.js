// ==UserScript==
// @name         駿河屋・打ち出の小槌
// @namespace    http://resourcez.org/
// @version      0.2.1
// @description  駿河屋の大人モード切り替え
// @author       Keisuke URAGO <bravo@resourcez.org>
// @match        https://www.suruga-ya.jp/search?*
// @icon         https://www.google.com/s2/favicons?domain=suruga-ya.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441312/%E9%A7%BF%E6%B2%B3%E5%B1%8B%E3%83%BB%E6%89%93%E3%81%A1%E5%87%BA%E3%81%AE%E5%B0%8F%E6%A7%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/441312/%E9%A7%BF%E6%B2%B3%E5%B1%8B%E3%83%BB%E6%89%93%E3%81%A1%E5%87%BA%E3%81%AE%E5%B0%8F%E6%A7%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var value = '3';
    var change= 'アダルトのみ';
    var ptn = /(?<delim>[&?])adult_s=(?<value>[0-9]+)/;
    var adult_s = document.URL.match(ptn);
    var url = document.URL + '&adult_s=3';
    if (adult_s !== null) {
        value = adult_s.groups.value === '3' ? '1' : '3';
        change = adult_s.groups.value === '3' ? 'アダルト以外も含む' : 'アダルトのみ'
        url = adult_s.input.replace(ptn, adult_s.groups.delim + 'adult_s=' + value);
    }
    document.querySelector('#search_header > div > ul').insertAdjacentHTML('afterbegin', '<li><a href="' + url + '">'+ change);
})();