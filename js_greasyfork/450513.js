// ==UserScript==
// @name         微博阅读全文
// @version      0.2
// @description  代码简洁，性能极佳。自动显示全文，并替换关注按钮为“已显示全文”。
// @author       shenmailg
// @match        *://weibo.com/ttarticle/*
// @grant        none
// @namespace https://greasyfork.org/users/952802
// @downloadURL https://update.greasyfork.org/scripts/450513/%E5%BE%AE%E5%8D%9A%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/450513/%E5%BE%AE%E5%8D%9A%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var newsDom = document.querySelector('.WB_editor_iframe_new') || document.querySelector('.WB_editor_iframe_word');
    var readMore = document.querySelector('.artical_add_box');
    // 监听dom样式变化的回调
    var mCallBack = function() {
        // 等待透明度渐入结束
        if (newsDom.style.opacity === '1') {
            // 移除控制半文展示样式
            newsDom.style = '';
            // 替换关注按钮
            if (!!readMore) {
                readMore.innerHTML='<p style="text-align: center; font-size: 16px; padding: 12px;">已显示全文</p>';
            }
            // 处理完毕，停止观察
            observer.disconnect();
            console.log('已展示全文，可以愉快阅读了');
        }
    }
    var observer = new MutationObserver(mCallBack);
    var checkDom = function() {
        if (!newsDom) {
            window.requestAnimationFrame(checkDom);
            console.log('微博可能更改了DOM class名称，请等待版本同步更新~');
        } else {
            observer.observe(newsDom, {
                attributes: true,
                attributeOldValue: true,
                attributeFilter: ['style']
            });
        }
    }

    checkDom();
})();