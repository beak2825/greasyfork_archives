// ==UserScript==
// @name         国区Steam显示成人内容选项
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动去除account_setting_not_customer_facing这一class使得成人内容选项可以展示，并添加描述内容
// @author       GamerNoTitle
// @match        https://store.steampowered.com/account/preferences*
// @grant        none
// @icon         https://store.steampowered.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/515414/%E5%9B%BD%E5%8C%BASteam%E6%98%BE%E7%A4%BA%E6%88%90%E4%BA%BA%E5%86%85%E5%AE%B9%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/515414/%E5%9B%BD%E5%8C%BASteam%E6%98%BE%E7%A4%BA%E6%88%90%E4%BA%BA%E5%86%85%E5%AE%B9%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify elements
    function modifyElements() {
        // Remove class account_setting_not_customer_facing from all elements
        document.querySelectorAll('.account_setting_not_customer_facing').forEach(el => {
            el.classList.remove('account_setting_not_customer_facing');
        });

        // Add content to element with data-parentdescid="1"
        let element1 = document.querySelector('[data-parentdescid="1"]');
        if (element1 && !element1.querySelector('.custom-store_pref_desc')) {
            let newContent1 = `
                <div class="store_pref_desc custom-store_pref_desc">
                    <label class="account_manage_checkbox">
                        频繁的裸露画面或色情内容&nbsp;
                    </label>
                    <span class="account_setting_parenthetical">
                        主要展示裸露或性主题的游戏或内容。 勾选此复选框即表示您确认自己已至少年满 18 周岁。<br>
                        <a href="javascript:ViewTitlesWithDescriptors(4);">查看示例产品</a>
                    </span>
                </div>
            `;
            element1.insertAdjacentHTML('beforeend', newContent1);
        }

        // Add content to element with data-parentdescid="4"
        let element4 = document.querySelector('[data-parentdescid="4"]');
        if (element4 && !element4.querySelector('.custom-store_pref_desc')) {
            let newContent4 = `
                <div class="store_pref_desc custom-store_pref_desc">
                    <label class="account_manage_checkbox">
                        仅限成人的色情内容&nbsp;
                    </label>
                    <span class="account_setting_parenthetical">
                        包含仅针对成人受众的明显或露骨色情的游戏或内容。 勾选此复选框即表示您确认自己已至少年满 18 周岁。<br>
                        <a href="javascript:ViewTitlesWithDescriptors(3);">查看示例产品</a>
                    </span>
                </div>
            `;
            element4.insertAdjacentHTML('beforeend', newContent4);
        }
    }

    // Wait for the page to load completely
    window.addEventListener('load', modifyElements);
    // Also run the function after any AJAX call (just in case the content is loaded dynamically)
    let observer = new MutationObserver(modifyElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();
