// ==UserScript==
// @name         知乎屏蔽用户
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽特定知乎用户的答案
// @author       DragonWind
// @match        https://www.zhihu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472720/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/472720/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var userList = ['落叶', '云南华软学校', '非著名游戏开发湿', '博毅创为', 'BYCW丶蓝冰'];
    var buttonList=['1'];
    // 添加按钮和事件处理函数
    function addButtonToAnswer(answerElement, user) {
        if (!buttonList.includes(user)) {
            buttonList.push(user);
        }else{
            return;
        }
        var btn = document.createElement('button');
        btn.textContent = '屏蔽用户';
        btn.style.marginLeft = '10px';
        btn.style.backgroundColor = 'blue';
        btn.style.color = 'white';                 // 设置文字颜色为白色
        btn.style.padding = '10px 20px';           // 设置内边距
        btn.style.border = 'none';                 // 设置无边框
        btn.style.borderRadius = '5px';            // 设置边框圆角
        btn.style.cursor = 'pointer';              // 设置光标样式为手型
        btn.addEventListener('click', function() {
            addUserToUserList(user);
            //deleteAns();
        });
        answerElement.appendChild(btn);
    }

    // 将用户添加到userList中
    function addUserToUserList(user) {
        if (!userList.includes(user)) {
            userList.push(user);
            // 保存更新后的userList到本地
            saveUserListToLocalStorage();
                    buttonList=[];
            deleteAns();
        }
    }

    // 保存userList到本地
    function saveUserListToLocalStorage() {
        localStorage.setItem('userList', JSON.stringify(userList));
    }

    // 获取保存在本地的userList
    function getUserListFromLocalStorage() {
        var userListString = localStorage.getItem('userList');
        if (userListString) {
            return JSON.parse(userListString);
        }
        return [];
    }

    // 从本地加载userList
    userList = getUserListFromLocalStorage();

    var answers = document.getElementsByClassName('ContentItem AnswerItem');

    function deleteAns() {

        for (var i = 0; i < answers.length; i++) {
            for (var j = 0; j < userList.length; j++) {
                if (answers[i].dataset.zop.includes(userList[j])) {
                    answers[i].remove();
                }
            }
            // 给每条回答添加按钮
            var user = answers[i].querySelector('.ContentItem-meta').querySelector('.AuthorInfo.AnswerItem-authorInfo.AnswerItem-authorInfo--related')
            //.querySelector('.AuthorInfo.AnswerItem-authorInfo.AnswerItem-authorInfo--related').querySelector('AuthorInfo');
            const metaElements = user.querySelectorAll('meta');
            for (const metaElement of metaElements) {
    if (metaElement.getAttribute('itemprop') === 'name') {
        user=metaElement.getAttribute('content')
        break;
    }
}
            console.log(user);
            addButtonToAnswer(answers[i], user);
        }
    }

    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                deleteAns();
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
})();
