// ==UserScript==
// @name         批量删除哔哩哔哩动态
// @namespace    https://github.com/SunsetMkt/delBili
// @version      0.0.2
// @description  批量删除哔哩动态
// @author       plain
// @match        *://space.bilibili.com/*/dynamic
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448788/%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/448788/%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = () => {
        function del() {
            for (let i = 0; i < 9999; i++) {
                setTimeout(function () {

                    if (document.querySelector('.bili-modal')) {
                        var item = document.querySelectorAll('.bili-modal__button');
                        for (let i = 0; i < item.length; i++) {
                            if (item[i].innerText.includes('删除')) {
                                item[i].click();
                            }
                        }
                    } else {
                        var item2 = document.querySelectorAll('.bili-dyn-more__menu__item')
                        // for all item
                        for (let i = 0; i < item2.length; i++) {
                            // If include 删除
                            if (item2[i].innerText.includes('删除')) {
                                item2[i].click();
                            }
                        }
                    }

                    // Scroll to bottom
                    window.scrollTo(0, document.body.scrollHeight);

                    // Refresh page every 20 loops
                    i > 20 && window.location.reload();

                }, 1000 * i);
            }
        }

        // 判断如果有cookie 就不再弹窗，直接进行删除微薄
        if (document.cookie.indexOf('delBili=1') !== -1) {
            del();
        } else {
            var r = confirm("确定好要删除所有动态了吗，确定好了就点确定吧!");
            if (r === true) {
                document.cookie = 'delBili=1';
                del();
            }
        }
    };
})();
