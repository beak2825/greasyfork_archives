// ==UserScript==
// @name         博树自动记录学习位置
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  刷新页面可以还原学习位置
// @author       You
// @match        https://www.boshu.cn/*
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.boshu.cn
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443571/%E5%8D%9A%E6%A0%91%E8%87%AA%E5%8A%A8%E8%AE%B0%E5%BD%95%E5%AD%A6%E4%B9%A0%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/443571/%E5%8D%9A%E6%A0%91%E8%87%AA%E5%8A%A8%E8%AE%B0%E5%BD%95%E5%AD%A6%E4%B9%A0%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css= `
      .form__input, .form__select, .form__textarea {
        line-height: 1.6;
      }
    `
    GM_addStyle(css)
    
    function init() {
        if(document.querySelector('.unit-row__title-inner') != null) {
            $(document).scrollTop(localStorage.getItem('a_test_bs'))
            $('.course-lesson__wrap').click(function () {
                localStorage.setItem('a_test_bs', this.offsetTop - 200)
            })
        } else {
            setTimeout(init, 500)
        }
    }
    init()

    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#/timeline') {
            init()
        }
    }, false);
})();