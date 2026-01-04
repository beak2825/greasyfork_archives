// ==UserScript==
// @name         安全微课脚本
// @namespace    https://weiban.mycourse.cn/
// @version      0.1.1
// @description  呃呃
// @author       QCTech
// @match        *://weiban.mycourse.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weiban.mycourse.cn
// @grant        GM_xmlhttpRequest
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/468780/%E5%AE%89%E5%85%A8%E5%BE%AE%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/468780/%E5%AE%89%E5%85%A8%E5%BE%AE%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



(function () {
    'use strict';
    const style = document.createElement('style');
    style.innerHTML =
        `
  .md-button {
    display: inline-block;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    background-color: #2196f3;
    color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.26);
    transition: all 0.3s ease-in-out;
  }

  .md-button:hover,
  .md-button:focus {
    background-color: #1976d2;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.35);
  }
`;

    document.head.appendChild(style);


    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    function finishWxCourse() {
        try {
            console.log(exportRoot.currentFrame)
        } catch (e) {}
        try {
            var finishWxHost = document.referrer.replace("http://", "").replace("https://", "").split("/")[0];
            if (document.referrer == "" || document.referrer == null || document.referrer == undefined) {
                finishWxHost = "weiban.mycourse.cn"
            }

            let q = {};
            document.querySelector('iframe').getAttribute('src').replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => q[k] =
                v);

            const webUrl = window.location.href;
            const finishWxUrl = `https://weiban.mycourse.cn/pharos/usercourse/v1/${q.methodToken}.do`;

            const finishData = {
                "userCourseId": q.userCourseId,
                "tenantCode": q.tenantCode
            };

            $.ajax({
                async: false,
                url: finishWxUrl,
                type: "GET",
                dataType: "jsonp",
                data: finishData,
                timeout: 5000,

                success: function (data) {
                    if (data.msg == "ok") {
                        alert("恭喜，您已完成本微课的学习");
                    } else {
                        alert("发送完成失败");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {}
            });
        } catch (e) {
            alert("报了啥错误" + e)
        }
    }
    const elementContainer = document.getElementById('app');

    const myButton = document.createElement('button');

    myButton.style.position = 'absolute';
    myButton.style.top = '100px';
    myButton.style.left = '500px';
    myButton.style.heigh = '50px';
    myButton.style.width = '150px';
    myButton.textContent = '点击我速通本课';
    myButton.classList.add('md-button');

    myButton.addEventListener('click', function () {
        finishWxCourse();
        history.back();
    });

    elementContainer.appendChild(myButton);

})();