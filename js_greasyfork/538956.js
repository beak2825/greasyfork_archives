// ==UserScript==
// @name         微信素材库复制图片链接
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在微信公众号素材库页面，添加“复制链接”按钮，点击后复制图片URL到剪贴板
// @author       Grok
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg*
// @match        https://mp.weixin.qq.com/cgi-bin/filepage*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538956/%E5%BE%AE%E4%BF%A1%E7%B4%A0%E6%9D%90%E5%BA%93%E5%A4%8D%E5%88%B6%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/538956/%E5%BE%AE%E4%BF%A1%E7%B4%A0%E6%9D%90%E5%BA%93%E5%A4%8D%E5%88%B6%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保jQuery无冲突
    const $ = window.jQuery.noConflict(true);

    // 动态创建按钮和Toptips样式
    const style = `
        .weui-desktop-icon-btnxx {
            width: 36px;
            height: 36px;
            border-radius: 18px;
            cursor: pointer;
            font-size: 12px;
            border: none;
            color: #07C160;
        }
        .weui-desktop-icon-btnxx:hover {
            color: #07C160;
            background: #07C16040;
        }
        .weui-toptips {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 16px;
            background: #07C16020;
            color: #07C160;
            font-size: 14px;
            border-radius: 4px;
            z-index: 9999;
            display: none;
        }
    `;
    $('<style>').text(style).appendTo('head');

    // 创建Toptips提示函数
    function showToptips(message) {
        const $toptips = $('<div class="weui-toptips"></div>').text(message);
        $toptips.appendTo('body').fadeIn(200);
        setTimeout(() => {
            $toptips.fadeOut(200, () => {
                $toptips.remove();
            });
        }, 2000); // 2秒后自动消失
    }

    // 查找所有素材库图片项
    $('.weui-desktop-img-picker__item').each(function() {
        const $item = $(this);
        const $tooltipWrp = $item.find('.weui-desktop-link').first();

        // 在指定的weui-desktop-tooltip__wrp前插入新按钮
        const $newButton = $(`
            <div class="weui-desktop-tooltip__wrp weui-desktop-link" style="right: 94px;">
                <button href="javascript:;" target="_blank" class="weui-desktop-icon-btnxx">URL</button>
            </div>
        `);
        $newButton.insertBefore($tooltipWrp);

        // 点击按钮获取<i>标签的style中的URL
        $newButton.find('button').on('click', function() {
            const $img = $item.find('i.weui-desktop-img-picker__img-thumb').first();
            const style = $img.attr('style');
            if (!style) {
                showToptips('未找到图片URL');
                return;
            }

            // 使用正则提取background-image中的URL
            const urlMatch = style.match(/url\(["']?(.*?)["']?\)/);
            if (!urlMatch || !urlMatch[1]) {
                showToptips('未找到有效的图片URL');
                return;
            }

            let imgUrl = urlMatch[1];
            // 如果URL缺少协议头，补全为https
            if (imgUrl.startsWith('//')) {
                imgUrl = 'https:' + imgUrl;
            }

            // 复制URL到剪贴板
            GM_setClipboard(imgUrl);
            showToptips('图片URL已复制到剪贴板');
        });
    });
})();