// ==UserScript==
// @name         yuque comment sort
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  yuque comment sort change
// @author       You
// @match        https://aliyuque.antfin.com/csfe/vtfebt/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=antfin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479425/yuque%20comment%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/479425/yuque%20comment%20sort.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('yuque comment sort change start');

    const onChangeCommentSort = () => {
        const commentList = document.querySelectorAll('.commentFloorListItem-module_commentFloorListItem_hEa7c');
        const parent = commentList[0].parentNode;


        parent.innerHTML = '';
        for (let i = commentList.length - 1; i >=0; i--) {
            parent.innerHTML = parent.innerHTML + commentList[i].innerHTML;
        }
    };

    setTimeout(() => {

        const trigger = document.createElement('div');
        trigger.innerText = '评论按时间倒序排列';
        trigger.setAttribute('id', 'change-comment-sort-trigger');
        trigger.setAttribute('style', 'color: blue;cursor: pointer;position: fixed; bottom: 300px;right: 100px;z-index: 1000;');
        trigger.addEventListener('click', () => {
            onChangeCommentSort();
        }, false);


        document.body.appendChild(trigger);
        console.log('yuque comment sort change end');

    }, 1000);

})();