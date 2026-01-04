// ==UserScript==
// @name         屏蔽雪球机器人
// @namespace    cyqtest
// @version      1.0
// @description  屏幕雪球上用户id为用户加数字的垃圾用户!
// @author       devil
// @match        https://xueqiu.com/*
// @icon         https://assets.imedao.com/ugc/images/profiles/new/identity_icon_7-291fac8d46.png
// @grant        none
// @run-at  document-end
// @license test
// @downloadURL https://update.greasyfork.org/scripts/469573/%E5%B1%8F%E8%94%BD%E9%9B%AA%E7%90%83%E6%9C%BA%E5%99%A8%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/469573/%E5%B1%8F%E8%94%BD%E9%9B%AA%E7%90%83%E6%9C%BA%E5%99%A8%E4%BA%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("location.hostname:",location.hostname);
    let userInfo;
    if (document.domain == 'xueqiu.com'){
        //过滤雪球机器人用户
        setTimeout(() => {
        let ops =document.querySelector('.status-list');
        filter(ops);
        ops.addEventListener("DOMNodeInserted", function(event) {
            filter(ops)
        });
        }, 1000);
    };

    function filter(root){
        let regEx = /用户(\d*)/g
        userInfo = root.querySelectorAll("article.timeline__item");
        for (var index=0;index<userInfo.length;index++){
            let userName = userInfo[index].getElementsByClassName("user-name")[0];
            let user_id = userName.innerText.match(regEx);
            if (user_id){
                userInfo[index].style.display = 'none';
                console.log('删除"' + user_id + '的帖子')
            }
        }
    }
    // Your code here...
})();