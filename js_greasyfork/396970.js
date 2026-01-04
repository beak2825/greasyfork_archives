// ==UserScript==
// @name         Siki学院的上/下一课按钮
// @namespace    https://bathur.cn/
// @version      0.1
// @description  A next button group for sikiedu
// @author       Bathur
// @match        *://www.sikiedu.com/course/*/task/*/show
// @grant        none

// @create       2020-02-27
// @copyright    2020+, Bathur.cn
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/396970/Siki%E5%AD%A6%E9%99%A2%E7%9A%84%E4%B8%8A%E4%B8%8B%E4%B8%80%E8%AF%BE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/396970/Siki%E5%AD%A6%E9%99%A2%E7%9A%84%E4%B8%8A%E4%B8%8B%E4%B8%80%E8%AF%BE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var next_button_group = document.getElementsByClassName('btn-group pull-left visible-xs js-mobile-btn')[0];
    next_button_group.classList.remove('visible-xs');
    next_button_group.classList.remove('js-mobile-btn');
})();