// ==UserScript==
// @name         WordPress 特色图像上传文件(有问题)
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.rijupao.com/wp-admin/post-new.php
// @match        https://www.rijupao.com/wp-admin/post.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/lodash.js/4.17.19/lodash.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410057/WordPress%20%E7%89%B9%E8%89%B2%E5%9B%BE%E5%83%8F%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6%28%E6%9C%89%E9%97%AE%E9%A2%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/410057/WordPress%20%E7%89%B9%E8%89%B2%E5%9B%BE%E5%83%8F%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6%28%E6%9C%89%E9%97%AE%E9%A2%98%29.meta.js
// ==/UserScript==

// 避免 WordPress 后台 _ 冲突
window.lodash = _.noConflict();
(function() {
    'use strict';

    // 绑定组合键 CTRL+SHIFT+ALT+U
    $(document).on('keydown', function(evt) {
        // 键码对照表：https://blog.csdn.net/web_callBack/article/details/70160331
        const which = evt.which; // 85 - U
        const ctrlKey = evt.ctrlKey || evt.metaKey;
        const altKey = evt.altKey;
        const shiftKey = evt.shiftKey;
//         console.log(which, ctrlKey, altKey, shiftKey);
        if (which === 85 && ctrlKey && altKey && shiftKey) {
            openUpload();
        }
    });

    function openUpload() {
        const $set_thumbnail = $('#set-post-thumbnail');
        if (!$set_thumbnail.length) {
            alert('未找到[设置特色图像]按钮');
            return;
        }
        console.log($set_thumbnail);

        // CLICK没有反应!!
        $set_thumbnail.click();
        setTimeout(function() {
            const $menu_upload = ('#menu-item-upload');
            $menu_upload.click();
        }, 1500);
    }
})();