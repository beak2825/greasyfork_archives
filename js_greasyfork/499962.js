// ==UserScript==
// @name         jlpt自动登录
// @namespace    http:yowayimono.cn/
// @version      1.0
// @description  自动补全账号密码,直接显示验证码，输入完验证码自动登录功能,添加图形界面功能，可以自由修改密码，用户无感知
// @author       yowayimono
// @match        https://jlpt.neea.edu.cn/index.do*
// @match        https://jlpt.neea.cn/index.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499962/jlpt%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/499962/jlpt%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否已经保存了账号和密码
    let savedId = localStorage.getItem('ksIDNO');
    let savedPwd = localStorage.getItem('ksPwd');

    // 创建一个弹出窗口
    let popup = document.createElement('div');
    popup.id = 'loginPopup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = '#fff';
    popup.style.padding = '20px';
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    popup.style.borderRadius = '8px';
    popup.style.zIndex = '1000';
    popup.style.width = '300px';
    popup.style.textAlign = 'center';
    popup.innerHTML = `
        <h3 style="margin-bottom: 20px;">请输入您的账号和密码</h3>
        <input type="text" id="inputId" placeholder="身份证号" value="${savedId || ''}" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
        <input type="password" id="inputPwd" placeholder="密码" value="${savedPwd || ''}" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
        <button id="saveBtn" style="width: 48%; padding: 10px; margin-right: 2%; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">保存</button>
        <button id="closeBtn" style="width: 48%; padding: 10px; background-color: #ccc; color: #000; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
    `;

    document.body.appendChild(popup);

    // 保存输入的账号和密码
    document.getElementById('saveBtn').addEventListener('click', function () {
        let id = document.getElementById('inputId').value;
        let pwd = document.getElementById('inputPwd').value;
        if (id && pwd) {
            localStorage.setItem('ksIDNO', id);
            localStorage.setItem('ksPwd', pwd);
            alert('账号和密码已保存');
        } else {
            alert('请输入完整的账号和密码');
        }
    });

    // 关闭弹出窗口
    document.getElementById('closeBtn').addEventListener('click', function() {
        document.getElementById('loginPopup').style.display = 'none';
    });

    // 创建一个按钮来显示弹出窗口
    let showPopupBtn = document.createElement('button');
    showPopupBtn.id = 'showPopupBtn';
    showPopupBtn.textContent = '修改账号密码';
    showPopupBtn.style.position = 'fixed';
    showPopupBtn.style.top = '10px';
    showPopupBtn.style.right = '10px';
    showPopupBtn.style.zIndex = '1001';
    showPopupBtn.style.padding = '10px 15px';
    showPopupBtn.style.background = '#007bff';
    showPopupBtn.style.color = '#fff';
    showPopupBtn.style.border = 'none';
    showPopupBtn.style.borderRadius = '4px';
    showPopupBtn.style.cursor = 'pointer';
    document.body.appendChild(showPopupBtn);

    // 显示弹出窗口
    document.getElementById('showPopupBtn').addEventListener('click', function() {
        document.getElementById('loginPopup').style.display = 'block';
    });

    if (savedId && savedPwd) {
        let cl = document.getElementById('closeBtn');
        cl.click();
    }

    function init() {
        var imgCode = document.querySelector("[name=chkImgCode]");
        new MutationObserver(function (mutations, observer) {
            mutations.forEach(function(mutation) {
                var chkImgDiv = document.getElementById('chkImgDiv');
                if(chkImgDiv.style.display!='block'){
                    chkImgDiv.style.display='block';
                    if(document.getElementById('loginDiv').style.display!='none'){getChkimgAjax('loginDiv');}
                    if(document.querySelector("[name=ksIDNO]").value == ""){
                        document.querySelector("[name=ksIDNO]").value=localStorage.getItem('ksIDNO');
                        document.querySelector("[name=ksPwd]").value=localStorage.getItem('ksPwd');
                        imgCode.focus();
                    };
                }
                imgCode.oninput = function (e) {
                    if(imgCode.value.length == 4)login(document.forms[0]);
                }
            });
        }).observe(document.querySelector('#layer'), {'attributes':true});
    }

    init();
})();