// ==UserScript==
// @name         user替换
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  ddddd
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478915/user%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/478915/user%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    function replaceElements() {
        // 替换头像
        const newAvatarURL = 'https://thirdwx.qlogo.cn/mmopen/vi_32/gnbClianDhojRibrUibib8WjS83iasPf9vS6xVFcA9D0Uic8ciby9Ze9gUCPl5hz62pK2GWf5sxib3UkH0d8uXLjwSLPpw/132';
        const avatarElement = document.querySelector('img[style="object-fit: contain;"]');

        if (avatarElement) {
            // 替换头像链接
            avatarElement.src = newAvatarURL;
        } else {
            console.error('找不到头像元素，请检查CSS选择器是否正确。');
        }

        // 替换用户名
        const newUsername = '潘柳cs(oUCl2wNosLcE-Yopa8vyi_3KexSU)';
        const usernameElement = document.querySelector('span[class="el-link--inner"]');

        if (usernameElement) {
            // 替换用户名内容
            usernameElement.textContent = newUsername;
        } else {
            console.error('找不到用户名元素，请检查CSS选择器是否正确。');
        }
    }

    // 使用 MutationObserver 监视内容变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            replaceElements(); // 内容发生变化时触发替换操作
        });
    });

    // 监视整个文档
    const config = { attributes: false, childList: true, characterData: true, subtree: true };
    observer.observe(document.body, config);

    // 初始执行替换操作
    replaceElements();
})();