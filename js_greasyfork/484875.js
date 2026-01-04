// ==UserScript==
// @name         口袋登录器
// @version      1.2.0
// @description  快速登录网页版
// @author       liuming
// @match        https://warh5.rivergame.net/*
// @license MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @namespace http://your-namespace.com
// @downloadURL https://update.greasyfork.org/scripts/484875/%E5%8F%A3%E8%A2%8B%E7%99%BB%E5%BD%95%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/484875/%E5%8F%A3%E8%A2%8B%E7%99%BB%E5%BD%95%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        #mainDiv > button {
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
        #mainDiv {
            width: 56px;
            height: 72px;
            position: fixed;
            bottom: 3%;
            left: 68%;
            padding: 12px;
            z-index: 999;
            border-radius: 12px;
        }
        #closeButton {
            position: absolute;
            top: 1px;
            right: 1px;
            background-color: transparent;
            border: none;
            color: lightgray;
            font-size: 16px;
          }
          
          #loginBtn {    
            margin-bottom: 10px;
            background-color: #2ecc71;
            padding: 6px 12px;
            color: #ffffff;
            border: none;
            border-radius: 8px;
          }
          
          #selectBtn {
            background-color: #3498db;
            padding: 6px 12px;
            color: #ffffff; 
            border: none;
            border-radius: 8px;
          }          


        button:hover {
            background-color: #2980b9; 
        }
    `);
    var panel = document.createElement('Div');
    panel.id = 'mainDiv';
    
    function removePanel() {
        document.body.removeChild(panel);
    };
    function createButton() {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'x';
        closeButton.id = 'closeButton';

        const loginBtn = document.createElement('button');
        loginBtn.textContent = '登录';
        loginBtn.id = 'loginBtn';

        const selectBtn = document.createElement('button');
        selectBtn.textContent = '设置';
        selectBtn.id = 'selectBtn';

        selectBtn.addEventListener('click', function() {
            showFileInput();
        });

        closeButton.addEventListener('click', function() {
            removePanel();
        });

        loginBtn.addEventListener('click', function() {
            const storedInput = GM_getValue('userInput', '');
            if (storedInput) {
                panel.removeChild(loginBtn);
                try {
                    eval(storedInput);
                    removePanel();
                } catch (error) {
                    console.log(error);
                    alert("登录失败,:"+ error.message);
                };
            }else {
                alert('请设置用户信息');
            }
        });

        document.body.appendChild(panel);
        panel.appendChild(loginBtn);
        panel.appendChild(closeButton);
        panel.appendChild(selectBtn);
    };

    function createModel () {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        const input = document.createElement('input');
        input.type = 'text';
        input.value = '';
        input.style.marginRight = '10px';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '保存';
        modal.appendChild(input);
        modal.appendChild(cancelButton);
        modal.appendChild(confirmButton);
        confirmButton.addEventListener('click', function() {
            const userInput = input.value.trim();
            GM_setValue('userInput', userInput);
            document.body.removeChild(modal);
        });
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        document.body.appendChild(modal)
    }

    function showFileInput() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt'; 
        fileInput.addEventListener('change', function() {
            const selectedFile = fileInput.files[0];
            if (selectedFile) {
                readFileContent(selectedFile);
            }
        });
        fileInput.click();
    }
    function readFileContent(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileContent = event.target.result;
            GM_setValue('userInput', fileContent);
        };
        reader.readAsText(file);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createButton);
    } else {
        createButton();
    }
})();