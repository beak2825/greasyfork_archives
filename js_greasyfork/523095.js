// ==UserScript==
// @name         按钮：使用新版本Common.css
// @namespace    http://tampermonkey.net/
// @version      2025-01-06
// @description  在最顶部的导航栏加个按钮，点击可以强制加载最新版本的MediaWiki:Common.css。 (请按需魔改)
// @author       GPT
// @license      CC0
// @match        https://wiki.biligame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=biligame.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523095/%E6%8C%89%E9%92%AE%EF%BC%9A%E4%BD%BF%E7%94%A8%E6%96%B0%E7%89%88%E6%9C%ACCommoncss.user.js
// @updateURL https://update.greasyfork.org/scripts/523095/%E6%8C%89%E9%92%AE%EF%BC%9A%E4%BD%BF%E7%94%A8%E6%96%B0%E7%89%88%E6%9C%ACCommoncss.meta.js
// ==/UserScript==

function onCilckPurgeCss() {
    var linkTags = document.querySelectorAll('head link');
    var targetHref = `load.php?lang=zh-cn&modules=site.styles&only=styles&skin=vector`;

    linkTags.forEach(linkTag => {
        var href = linkTag.getAttribute('href');

        if (href && href.includes(targetHref)) {
            var currentTime = new Date().getTime();
            var updatedHref = `${href}&random=${currentTime}`;

            // 创建一个新的link标签
            var newLink = document.createElement('link');
            newLink.setAttribute('rel', 'stylesheet');
            newLink.setAttribute('href', updatedHref);
            var oldLink = linkTag;

            // 在目标元素后插入新的link标签
            oldLink.parentNode.insertBefore(newLink, oldLink.nextSibling);
            var btn = document.getElementById('common-css-btn');
            btn.innerHTML = '（无缓存已加载）';

            // 等待100毫秒后删除目标元素
            setTimeout(() => {
                oldLink.parentNode.removeChild(oldLink);
                console.log(new Date().toISOString(), '已删除老的common css链接：');
                btn.innerHTML = '（旧链接已删除）';
                setTimeout(() => {
                    btn.parentNode.parentNode.removeChild(btn.parentNode);
                }, 300);
            }, 300);

            console.log(new Date().toISOString(), '已修改common css链接：' + updatedHref);

            return;
        }
    });
}


document.addEventListener("DOMContentLoaded", function() {
    var fixedDiv = document.createElement('li');
    fixedDiv.innerHTML = `<a id="common-css-btn" href="#" hover="点击绕过缓存加载Common.css">更新CSS</a>`;
    fixedDiv.addEventListener('click', function(event) {
        event.preventDefault();
        onCilckPurgeCss();
    });
    document.querySelector('.bili-game-header-nav-wrap').appendChild(fixedDiv);
});