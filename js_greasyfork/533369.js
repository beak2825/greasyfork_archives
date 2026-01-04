// ==UserScript==
// @name         网盘转存直链
// @namespace    http://tampermonkey.net/
// @version      0.03
// @license      MIT
// @description  2025年4月更新可用，不限制速度的百度网盘转存下载
// @author       cg-software
// @match        https://pan.baidu.com/disk/main*
// @grant        GM_notification
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @downloadURL https://update.greasyfork.org/scripts/533369/%E7%BD%91%E7%9B%98%E8%BD%AC%E5%AD%98%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/533369/%E7%BD%91%E7%9B%98%E8%BD%AC%E5%AD%98%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initScript();
    } else {
        window.addEventListener('load', initScript);
    }

    function initScript() {
        if (!document.querySelector('#uploaderConfirmDialog')) {
            return;
        }
        createShareButton();
/*
        const observer = new MutationObserver(function(mutations) {
            createShareButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });*/
        const targetNode = document.querySelector('#content');
        const observer2 = new MutationObserver(function(mutations) {
            const target = document.querySelector('.wp-s-share-to-link__link-copy-tip');
            if(target){
                alert('链接已复制，点击确定后前往工具网站');
                window.location.href = "https://www.cg-software.cn/vip/bi";
            }
        });

        observer2.observe(document.body, {
            childList: true,
            subtree: true
        });

    }
    function createShareButton() {
            if (document.getElementById('tm-share-btn')) {
                return;
            }
            $('.wp-s-agile-tool-bar__header.is-header-tool').prepend(
          '<div class="wp-s-agile-tool-bar__h-group"><button type="button" id="tm-share-btn" class="u-button nd-file-list-toolbar-action-item u-button--success u-button--small is-has-icon"><span>网盘转存</span></button></div>'
        );
            const btn = document.getElementById('tm-share-btn');
        if(btn){
            btn.addEventListener('click', function() {
                shareSelectedFiles();
            });
        }


    }
    function shareSelectedFiles() {
            try {
            const selectedItems = document.querySelectorAll('.selected .text-ellip');
                if (selectedItems.length === 0) {
                    Swal.fire({
                        title: '提示',
                        text: '请先选择要分享的文件',
                        icon: 'warning'
                    });
                    return;
                }
                const shareBtn = document.querySelector('.u-button .u-icon-share');
                if (shareBtn) {
                    Swal.fire({
                        title: '温馨提示',
                        html: '1.请确保已安装IDM,并修改下载用户代理<br>2.请将要下载内容分享，产生分享链接<br>3.到本工具网站粘贴转存，获取下载直链',
                        icon: 'info',
                        showCancelButton: false,
                        confirmButtonText: '确定'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            shareBtn.click();
                        }
                    });

                }

            }catch (e) {
                Swal.fire({
                    title: '发生错误',
                    text: e.message,
                    icon: 'error'
                });
                console.error(e);
            }
        }
})();