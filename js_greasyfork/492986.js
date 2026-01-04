// ==UserScript==
// @name         小红书快捷键（个人用）
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  自定义快捷键
// @author       hztdream
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492986/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%88%E4%B8%AA%E4%BA%BA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/492986/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%88%E4%B8%AA%E4%BA%BA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function like(){
        var likeBtn = document.querySelector('#noteContainer .engage-bar-style span.like-wrapper.like-active');
        if(!likeBtn) return;
        likeBtn.click();
    }
    function viewUserPage(url){
        var domDiv = document.createElement('div');
        domDiv.id = 'customIframeContainer';
        domDiv.style = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #00000066;z-index:999;'
        domDiv.addEventListener('click', removeIframe);
        var domIframe = document.createElement('iframe');
        domIframe.style = 'position: absolute; top: 10vh; left: 10vw; width: 80vw; height: 80vh; border: none;';
        domIframe.src = url;
        domIframe.addEventListener('load', function() {
            domIframe.contentWindow.focus();
        });

        domDiv.appendChild(domIframe);
        document.body.appendChild(domDiv);
    }
    function removeIframe(){
        var topDocument = window.top.document;
        topDocument.body.removeChild(topDocument.querySelector('#customIframeContainer'));
    }
    function followUser(){
        var followBtn = document.querySelector('#userPageContainer .follow-button');
        if(!followBtn) return;
        followBtn.click();
    }
    document.addEventListener('click', function(event) {
        if (event.target.className === 'note-detail-mask') {
            event.target.remove();
            event.stopPropagation()
        }
    })
    document.addEventListener('keydown', function(event) {
        if (event.key === 'c') {
            like();
        }
        if (event.key === 'v') {
            var topDocument = window.top.document;
            var createdIframe = topDocument.querySelector('#customIframeContainer');
            if(createdIframe) {
                removeIframe();
                return;
            }
            var userLink = document.querySelector('#noteContainer .info>a:first-child');
            if(!userLink) return;
            var link = userLink.getAttribute('href');
            viewUserPage(link);
        }
        if (event.key === 'f') {
            followUser();
        }
    });
})();