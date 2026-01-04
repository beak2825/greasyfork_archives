// ==UserScript==
// @name         2
// @namespace    gpt4-account-switch-5
// @version      0.0.8
// @description  为GPT4直连账号切换提供便利
// @author       LLinkedList771
// @run-at       document-start

// @match        https://gpt4.xn--fiqq6k90ovivepbxtg0bz10m.xyz/*
// @match        https://chat.freegpts.org/*



// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495801/2.user.js
// @updateURL https://update.greasyfork.org/scripts/495801/2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let accountData = null;

    function setAccountData(data) {
        accountData = data;
    }

  

    // ----------------- Styles -----------------
    function addStyles() {
        const styles = `
            .tools-logger-panel {
                position: fixed;
                top: 10%;
                right: 2%;
                background-color: white;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                width: 250px;

            }
            .tools-logger-panel.minimized {
                width: auto;
                padding: 5px;
            }
 

            .switch.minimized {
                display: none;
            }

            .head {
                font-weight: bold;
                margin-bottom: 10px;
            }
            .switch
           //     display: inline-block;
                vertical-align: middle;
display: flex;
                justify-content: space-evenly;
            }
            .close {
                cursor: pointer;
            }
            .loadAccountJsonBtn {
                border: 1px solid #ccc;
                border-radius: 5px;
                text-decoration: underline;

            }
           .account-container {
                display: flex;
                flex-direction: column; 
                align-items: center; 
                margin-bottom: 10px; 
            }

            .account-btn {
                padding: 5px 10px;
                margin: 2px 0; 
                background-color: #f0f0f0;
                font-weight: bold;
            }
  .account-btn2 {
                display: inline-block; /* 确保按钮并排显示 */  
                padding: 5px 10px;  
                margin-right: 10px; /* 右侧外边距，用于按钮之间的间距 */  
                background-color: #f0f0f0;  
                font-weight: bold;  
            }  
            .email-display {
                font-size: 0.8em; 
                color: #666; 
                margin-top: 2px; 
            }


            .latex-toggle {
                cursor: pointer;
                float:right;
                margin-right:5px;
            }
            .latex-toggle.minimized::before {
                content: "[+]";
            }
            .latex-toggle.maximized::before {
                content: "[-]";
            }

        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    // ----------------- UI Creation -----------------
    function createUI() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'tools-logger-panel';
    
        controlDiv.innerHTML = `
            <div class="head">
                <span class="title">GPT4账号切换助手</span>
                <span class="latex-toggle maximized"></span>
                </div>
            <div class="main">
                <button id="loadAccountJsonBtn">导入账号信息</button>
            </div>
            <div class="switch">

            </div>
        `;
    
        document.body.appendChild(controlDiv);
    
        // controlDiv.querySelector(".close").onclick = function() {
        //     controlDiv.remove();
        // };
        
        const toggleIcon = controlDiv.querySelector(".latex-toggle");
        const title = controlDiv.querySelector(".title");
        const switchDiv = controlDiv.querySelector(".switch");
        toggleIcon.onclick = function() {
            if (toggleIcon.classList.contains("maximized")) {
                controlDiv.querySelector(".main").style.display = "none";
                title.style.display = "none";
                toggleIcon.classList.remove("maximized");
                toggleIcon.classList.add("minimized");
                controlDiv.classList.add("minimized");
                switchDiv.classList.add("minimized");


            } else {
                controlDiv.querySelector(".main").style.display = "block";
                title.style.display = "inline-block";
                toggleIcon.classList.remove("minimized");
                toggleIcon.classList.add("maximized");
                controlDiv.classList.remove("minimized");
                switchDiv.classList.remove("minimized");
            }
            saveSettings(controlDiv); // Save settings when panel state is changed
        };
    

        // 添加文件输入元素
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        controlDiv.appendChild(fileInput);
    
        // 为导入账号信息按钮添加点击事件监听器
        document.getElementById("loadAccountJsonBtn").addEventListener("click", function() {
            fileInput.click();
        });
    
        // 监听文件选择事件
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
    
            // 创建FileReader对象
            const reader = new FileReader();
    
            // 监听文件读取完成事件
            reader.onload = function(event) {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    // 在这里处理获取到的JSON数据
                    console.log(jsonData);
                    processAccountJsonData(jsonData);
                    // 可以在这里执行其他操作,如在页面上显示数据等
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };
            // 读取文件内容为文本
            reader.readAsText(file);
        });
        loadSettings(controlDiv); // Load settings when panel is created
    }
   
    // 获取当前的url的(去掉路由) 
    function getCurrentUrl() {
        const targetURLBase = window.location.protocol + '//' + window.location.host;
        return targetURLBase;
    }
    
    function redirectToBaseUrl(){
        // https://gpt4.xn--fiqq6k90ovivepbxtg0bz10m.xyz/auth/login
        console.log('Log in');
        const targetURLBase = getCurrentUrl();
        window.location.href = targetURLBase;
    }

    function logOutCurrentAccount(accessToken) {
        const targetURLBase = getCurrentUrl();
        const logoutURL = targetURLBase + '/auth/logout';

        window.location.href = logoutURL;
    }

    function logInNewAccount(userName, passWork) {
        // var loginBtn = document.querySelector('#submit');
        // if(loginBtn) {
        //     loginBtn.click();
        // }
        // 第一个输入id="username" 填入userName
        var userNameArea = document.getElementById('username');
        if(userNameArea) {
            userNameArea.value = userName; // 将 '你的用户名' 替换为你想要输入的内容        
        }

        // 第二个输入id="password" 填入passWork
        var passWordArea = document.getElementById('password');
        if(passWordArea) {
            passWordArea.value = passWork; // 将 '你的密码' 替换为你想要输入的内容        
        }

        // 找到登录按钮
        var loginBtn = document.querySelector('button[type="submit"]');
        if(loginBtn) {
            loginBtn.click();
        }
        // // 找到button里面的值（innerHtml)为OK的按钮
        // var okBtn = Array.from(document.querySelectorAll('button')).find(function(btn) {
        //     return btn.innerText.trim() === 'OK';
        // });
    
        // if(okBtn) {
        //     okBtn.click();
        // }

    }


    function processAccountJsonData(jsonData) {

       

        // 检查所有键是否都是有效的电子邮件
        const allKeysAreValid = Object.keys(jsonData).every(isValidEmail);

        if (allKeysAreValid) {
            clearPreviousAccountData(); // 调用清理函数
            localStorage.setItem('gpt4_account_json', JSON.stringify(jsonData));
            setAccountData(jsonData);
            creatSwitchBtnUI(); // 确保此时已经有有效的accountData来创建按钮
        } else {
            alert('Some entries are invalid. Please check the data.');
        }


    }
    function alertLoadAccountData() {
        alert('请先导入账号信息');
    }

    function retriveAccountData() {
        // 1.首先判断当前的accountData是否为空
        if(accountData !== null) {
            return true;
        }
        // 2.从localStorage中读取数据
        const jsonData = localStorage.getItem('gpt4_account_json');
        if(jsonData !== null) {
            accountData = JSON.parse(jsonData);
            return true;
        }
        
        // 如果当前的accountData为空, 但是localStoraage也为空, 则提示当前需要加载账号信息
        alertLoadAccountData();
        return false;
    }

    // ----------------- Save and Load Settings -----------------
function saveSettings(controlDiv) {
    const panelState = controlDiv.classList.contains("minimized") ? "minimized" : "maximized";
    localStorage.setItem('gpt4PanelState', panelState);
    }
    
    function loadSettings(controlDiv) {
    const panelState = localStorage.getItem('gpt4PanelState');
    
    const toggleIcon = controlDiv.querySelector(".latex-toggle");
    const title = controlDiv.querySelector(".title");
    const switchDiv = controlDiv.querySelector(".switch");

    if (panelState === "minimized") {
    controlDiv.querySelector(".main").style.display = "none";
    title.style.display = "none";
    toggleIcon.classList.remove("maximized");
    toggleIcon.classList.add("minimized");
    controlDiv.classList.add("minimized");
    switchDiv.classList.add("minimized");
    } else {
    controlDiv.querySelector(".main").style.display = "block";
    title.style.display = "inline-block";
    toggleIcon.classList.remove("minimized");
    toggleIcon.classList.add("maximized");
    controlDiv.classList.remove("minimized");
    switchDiv.classList.remove("minimized");
    }
    }

    function creatSwitchBtnUI() {
        const controlDiv = document.querySelector('.tools-logger-panel .switch');
        if (!controlDiv) return;
        let button = document.createElement('button');
        button.className = 'account-btn';

        button.textContent = `登出账号`;
        button.onclick = () => {
            // Logic to switch accounts
            // setAccountData(accountData[key]);
            logOutCurrentAccount();
            console.log('Switched to account:', accountData[key]);

        };
        controlDiv.appendChild(button);
        //                 redirectToBaseUrl();

        button = document.createElement('button');
        button.className = 'account-btn';

        button.textContent = `登录账号`;
        button.onclick = () => {
            // Logic to switch accounts
            // setAccountData(accountData[key]);
            redirectToBaseUrl();
            console.log('Switched to account:', accountData[key]);

        };
        controlDiv.appendChild(button);
        Object.keys(accountData).forEach((email, index) => {
            // 创建包含按钮和电子邮件地址的容器
            const container = document.createElement('div');
            container.className = 'account-container';

            // 创建登录按钮
            const button = document.createElement('button');
            button.className = 'account-btn';
            button.textContent = `登录账号${index + 1}`;
            button.onclick = () => {
                logInNewAccount(email, accountData[email]);
                console.log('Switched to account:', email);
            };

            // 创建显示电子邮件地址的元素
            const emailDisplay = document.createElement('span');
            emailDisplay.className = 'email-display';
            emailDisplay.textContent = email;

            // 将按钮和电子邮件地址添加到容器
            container.appendChild(button);
            container.appendChild(emailDisplay);

            // 将容器添加到主DIV
            controlDiv.appendChild(container);
        });
    }


    function loadAndCreateAccountSwitchBtnUI(){
        // 首先判断localStorage中是否有数据
        if(!retriveAccountData())
        {
            return;
        }
        creatSwitchBtnUI(); // Create switch buttons based on account data

        // 现在开始加载UI

    }
    

   // ----------------- Initialization -----------------
   addStyles();

   // 确保在DOM完全加载后再创建UI
   document.addEventListener('DOMContentLoaded', function() {
       createUI();
       loadAndCreateAccountSwitchBtnUI(); // Ensure the switch buttons are created after UI is loaded and data is retrieved

   })
   
   ;
   


})();

function clearPreviousAccountData() {
    // 清除内存中的账号数据
    accountData = null;
   
    localStorage.removeItem('gpt4_account_json');

   
    const switchDiv = document.querySelector('.tools-logger-panel .switch');
    if (switchDiv) {
    
        while (switchDiv.firstChild) {
            switchDiv.removeChild(switchDiv.firstChild);
        }
    }
}
function isValidEmail(email) {
    // 使用正则表达式验证电子邮件地址
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}