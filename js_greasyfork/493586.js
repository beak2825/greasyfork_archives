// ==UserScript==
// @name         Stage1自动签到
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  进行Stage1自动签到
// @author       serj005
// @license      MIT
// @match        https://bbs.saraba1st.com/2b/forum.php
// @icon         https://bbs.saraba1st.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493586/Stage1%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493586/Stage1%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(() => {
    'use strict'
    const a = document.getElementById('um')
        ?.getElementsByTagName('p')[0]
        ?.getElementsByTagName('a')[2]
    if (!(a && a.innerText && a.innerText.includes('打卡签到') && a.href)) return;
    fetch(a.href).then(response => {
        if (!response.ok) throw new Error('网络响应不正常。');
        showAlert("签到成功", 2)
        a.previousElementSibling.remove()
        a.remove()
    })
    .catch(error => {
        console.error('您的fetch操作出现问题:', error);
        showAlert('签到过程中出现错误', 3)
    });
})();

function showAlert(message, delayInSeconds) {
    const alertBox = document.createElement('div');
    alertBox.style.cssText = 'position:fixed;z-index:1000;padding:20px;background-color:rgb(51,51,51);color:white;border-radius:5px;font-size:16px;width:300px;text-align:center;box-shadow:rgba(0,0,0,0.3) 0px 2px 5px;left:50%;top:20%;transform:translateX(-50%);transition:opacity 0.2s ease-in-out 0s;display:block;opacity: 0'
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.style.opacity = '1'
    }, 1)
    setTimeout(() => {
        alertBox.style.opacity = '0'
        setTimeout(() => {alertBox.remove()}, 200)
    }, delayInSeconds * 1000);
}