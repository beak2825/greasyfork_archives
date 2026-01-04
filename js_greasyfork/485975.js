// ==UserScript==
// @name         装b专用
// @namespace    http://tampermonkey.net/
// @version      2024-01-29
// @description  需要自定义缩略词
// @author       xxx
// @match        https://invites.fun/u/
// @license         MIT
// @run-at          document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=invites.fun
// @require         https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485975/%E8%A3%85b%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/485975/%E8%A3%85b%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 查找所有具有类名 ".Button" 和 ".Button--link" 的按钮，并包含有文本内容为 "赞" 的 span 元素
    function dianzan(element) {
        var likeButtons = jQuery('.Button.Button--link').filter(function() {
    return jQuery(this).find('.Button-label').text() === '赞';
});
        alert(`发现${likeButtons.length}条记录,这逼真能水`);

        var count = 1;

function clickButtonWithDelay(button, delay) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            button.click();
jQuery(element).find('.Button-label').text('批量点赞 ' + count++);
            resolve();
        }, delay);
    });
}

// 依次点击按钮，并等待3秒钟
likeButtons.each(function(index) {
    var button = jQuery(this);
    clickButtonWithDelay(button, index * 3000);
});

    }

    // 创建一个新的 <li> 元素
var newLiElement = $('<li class="item-money-rewards"><a class="hasIcon"><i aria-hidden="true" class="icon fas fa-money-bill Button-icon"></i><span class="Button-label">批量点赞</span></a></li>');

// 在给定的元素后面新增创建的新元素
$('.item-money-rewards').after(newLiElement);

// 为新增的元素绑定点击事件
newLiElement.find('a').click(function() {
    // 调用自定义的dianzan()函数
    alert('开始点赞');
    dianzan(this);
});
})();