// ==UserScript==
// @name         AddPenguin
// @namespace    http://www.qq.com/
// @version      0.2
// @description  add a penguin logo to www.qq.com
// @author       You
// @match        https://www.qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373384/AddPenguin.user.js
// @updateURL https://update.greasyfork.org/scripts/373384/AddPenguin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.top-logo').css({
        width: 'auto'
    });
    $('.top-logo').find('img').css({
        width: '131px'
    });
    $('.top-logo').append('<img style="width:80px;" src="//sqimg.qq.com/qq_product_operations/im/qqlogo/imlogo_b.png" alt="QQ">');
})();