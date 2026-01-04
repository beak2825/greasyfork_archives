// ==UserScript==
// @name         THU校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为校园网登录加上了自动登录选项
// @author       imaginationFog
// @match        https://auth4.tsinghua.edu.cn/srun_portal_pc.php?ac_id=163&
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tsinghua.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446076/THU%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/446076/THU%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (!localStorage.ifAutoLog) {
        localStorage.setItem("ifAutoLog", "0");
    }

    var label = document.createElement('label');
    label.style.width = "166.93px"

    var checkAutoLog = document.createElement('input');
    checkAutoLog.setAttribute('type', 'checkbox');
    checkAutoLog.style.position = "relative";
    checkAutoLog.style.left = '30px';

    var autoLog = document.createElement('div');
    autoLog.setAttribute('class', 'checkbox_text');
    autoLog.setAttribute('style', 'color: #93278f;font-weight: 550;');
    autoLog.textContent = '自动登录';
    autoLog.style.position = "relative";
    autoLog.style.left = '30px';


    if (parseInt(localStorage.ifAutoLog)) {
        checkAutoLog.checked = true;
    } else {
        checkAutoLog.checked = false;
    }

    if (checkAutoLog.checked) {
        checkAutoLog.onclick = function () {
            localStorage.setItem("ifAutoLog", "0");
        }
        document.getElementById('username').setAttribute('value', '请填写你的用户名');//改为你的学号
        document.getElementById('password').setAttribute('value', '请填写你的密码');//改为你的密码
        document.getElementById('connect').click();
    } else {
        checkAutoLog.onclick = function () {
            alert('test');
            localStorage.setItem("ifAutoLog", "1");
        }
    }

    label.appendChild(checkAutoLog);
    label.appendChild(autoLog);
    document.getElementById('form2').insertBefore(label, document.getElementById('connect'));
    console.log(localStorage.ifAutoLog);

    // Your code here...
})();