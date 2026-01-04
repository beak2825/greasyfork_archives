// ==UserScript==
// @name         起点投推荐票
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  起点自动投推荐票
// @author       TZXinTai
// @match        https://book.qidian.com/info/1035849533/
// @icon         https://qdfepccdn.qidian.com/my.qidian.com/static/qdp/img/header-logonew@2x.20e25.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480932/%E8%B5%B7%E7%82%B9%E6%8A%95%E6%8E%A8%E8%8D%90%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/480932/%E8%B5%B7%E7%82%B9%E6%8A%95%E6%8E%A8%E8%8D%90%E7%A5%A8.meta.js
// ==/UserScript==
// 将@match网址最后的数字修改为你要投票的书籍ID就可 https://book.qidian.com/info/1035849533/
// 会把所有的推荐票都投给一本书
(function () {
    'use strict';
    setTimeout(() => {
        if (document.getElementById("nav-user-name").textContent != "") {
            document.getElementById('topVoteBtn').click(); // 投票互动
            document.getElementById('recTab').click(); // 推荐票
            setTimeout(() => {
                let tp = document.getElementById('voteRec'); // 投票
                if (tp == null) { window.close(); } else { tp.click(); }
                window.close();
            }, 3000);
        } else {alert("请登录账号");}
    }, 10000);
})();