// ==UserScript==
// @name         妖火自动打赏脚本（老哥我是真想感谢你啊）
// @namespace    https://www.yaohuo.me/bbs/userinfo.aspx?touserid=20740
// @version      1.0.1
// @description  当浏览“资源共享”版块帖子时，回帖内容包含“感谢分享”四个字就自动打赏楼主101妖晶
// @author       SiXi
// @match        https://www.yaohuo.me/bbs-*.html
// @icon         https://www.yaohuo.me/css/favicon.ico
// @license      Apache 2
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/526174/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E6%89%93%E8%B5%8F%E8%84%9A%E6%9C%AC%EF%BC%88%E8%80%81%E5%93%A5%E6%88%91%E6%98%AF%E7%9C%9F%E6%83%B3%E6%84%9F%E8%B0%A2%E4%BD%A0%E5%95%8A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/526174/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E6%89%93%E8%B5%8F%E8%84%9A%E6%9C%AC%EF%BC%88%E8%80%81%E5%93%A5%E6%88%91%E6%98%AF%E7%9C%9F%E6%83%B3%E6%84%9F%E8%B0%A2%E4%BD%A0%E5%95%8A%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断是否是“资源共享”版块帖子
    function checkResourcePost() {
        const rewardLink = document.querySelector('.showReward');
        if (!rewardLink) return false;

        const href = rewardLink.href;
        const params = new URLSearchParams(href.split('?')[1]);
        return params.get('classid') === '201';
    }

    // 获取必要参数
    function getParams() {
        const myuserid = document.querySelector('input[name="myuserid"]').value;
        const rewardLink = document.querySelector('.showReward');
        const hrefParams = new URLSearchParams(rewardLink.href.split('?')[1]);

        return {
            myuserid: myuserid,
            classid: hrefParams.get('classid'),
            id: hrefParams.get('id'),
            touserid: hrefParams.get('touserid'),
            siteid: hrefParams.get('siteid')
        };
    }

    // 打上完成后显示提示信息
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            background: rgba(0,0,0,0.8);
            color: white;
            border-radius: 5px;
            z-index: 9999;
            font-size: 16px;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 5000);
    }

    // 发起打赏请求
    function sendReward(params) {
        const url = `https://www.yaohuo.me/bbs/SendMoney_freeMain.aspx?action=sendmoney&classid=${params.classid}&id=${params.id}&touserid=${params.touserid}&siteid=${params.siteid}`;

        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: `sendmoney=101&action=gomod&id=${params.id}&classid=${params.classid}&siteid=${params.siteid}&touserid=${params.touserid}&myuserid=${params.myuserid}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const tip = doc.querySelector('.tip');
                if (tip) {
                    showToast(tip.textContent.trim());
                }
            }
        });
    }

    // 主函数
    function init() {
        if (!checkResourcePost()) return;

        const submitBtn = document.querySelector('input[value="快速回复"]');
        const textarea = document.querySelector('.retextarea');

        submitBtn.addEventListener('click', function(e) {
            if (textarea.value.includes('感谢分享')) {
                const params = getParams();
                sendReward(params);
            }
        }, true);
    }

    // 等待页面加载完成
    window.addEventListener('load', init);
})();