// ==UserScript==
// @namespace   为大佬论坛（dalao.net）增加一个关闭按钮
// @name     dalao.net增加关闭按钮
// @version  1
// @grant    none
// @description  点击关闭后，帖子永远消失
// @author       Damon
// @match       *://dalao.net/*
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/472090/dalaonet%E5%A2%9E%E5%8A%A0%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/472090/dalaonet%E5%A2%9E%E5%8A%A0%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    function fetchData(url, liElement) {
    }

    function addCloseButton(liElement, postId) {
        var closeButton = document.createElement('span');
        closeButton.textContent = '关闭';
        closeButton.style.color = 'red';
        closeButton.style.marginLeft = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', function(event) {
            event.stopPropagation();
            liElement.style.display = 'none'; // 隐藏帖子
            markPostAsClosed(postId); // 记录帖子ID，永久屏蔽
        });
        liElement.appendChild(closeButton);
    }

    function markPostAsClosed(postId) {
        var closedPosts = JSON.parse(localStorage.getItem('closedPosts')) || [];
        if (!closedPosts.includes(postId)) {
            closedPosts.push(postId);
            localStorage.setItem('closedPosts', JSON.stringify(closedPosts));
        }
    }

    function isPostClosed(postId) {
        var closedPosts = JSON.parse(localStorage.getItem('closedPosts')) || [];
        return closedPosts.includes(postId);
    }

    if (window.location.href.indexOf('dalao.net') !== -1) {
        var liElements = document.querySelectorAll('li.media.thread.tap');
        liElements.forEach(function(liElement) {
            var postId = liElement.getAttribute('data-href');
            var url = window.location.href + postId;
            console.log(url);
            fetchData(url, liElement);
            addCloseButton(liElement, postId);
            if (isPostClosed(postId)) {
                liElement.style.display = 'none'; // 隐藏已关闭的帖子
            }
        });
    }

    // 在页面加载完成后，再次检查已关闭的帖子并隐藏
    window.addEventListener('load', function() {
        var liElements = document.querySelectorAll('li.media.thread.tap');
        liElements.forEach(function(liElement) {
            var postId = liElement.getAttribute('data-href');
            if (isPostClosed(postId)) {
                liElement.style.display = 'none'; // 隐藏已关闭的帖子
            }
        });
    });
})();
