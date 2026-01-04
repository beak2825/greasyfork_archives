// ==UserScript==
// @name         页面数据自动填充
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  页面数据自动填充。
// @author       qiuqiu_xqy
// @include      http://*
// @include      https://*
// @icon         https://s21.ax1x.com/2025/02/08/pEmURwF.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526254/%E9%A1%B5%E9%9D%A2%E6%95%B0%E6%8D%AE%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/526254/%E9%A1%B5%E9%9D%A2%E6%95%B0%E6%8D%AE%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==





let evt;

function f1(param) {
    evt.initEvent('input', true, true);
    let inputs = document.querySelectorAll(".el-input--small>input");
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].attributes["placeholder"].value.indexOf("账号") > -1) {
            inputs[i].value = param.username;
            inputs[i].dispatchEvent(evt);
        } else if (inputs[i].attributes["placeholder"].value.indexOf("密码") > -1) {
            inputs[i].value = param.password;
            inputs[i].dispatchEvent(evt);
        }
    }
}

function f2(param) {
    evt.initEvent('input', true, true);
    let inputs = document.querySelectorAll(".el-input--small>input");
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].attributes["placeholder"].value.indexOf("账号") > -1) {
            inputs[i].value = param.username;
            inputs[i].dispatchEvent(evt);
        } else if (inputs[i].attributes["placeholder"].value.indexOf("密码") > -1) {
            inputs[i].value = param.password;
            inputs[i].dispatchEvent(evt);
        }
    }
}

function f3(param) {
    evt.initEvent('input', true, true);
    let input = document.querySelector(".pass input");
    console.log(input)
    input.value = param.password;
    input.dispatchEvent(evt);
}

function f4(param) {
    let tab_first = document.querySelector("#tab-first");//账号密码登录
    let tab_second = document.querySelector("#tab-second");//电子社保卡登录
    let tab_third = document.querySelector("#tab-third");//短信验证码登录
    let tab_forth = document.querySelector("#tab-forth");//正在维护

    //让账号密码登录模块显示出来
    tab_first.style.display = "inline-block";

    //模拟点击账号密码登录模块
    evt.initEvent('click', true, false);
    tab_first.dispatchEvent(evt);

    //赋账号密码值
    let accountLogin = document.querySelector("#pane-first");
    let usernameInput = document.querySelector("#username");
    let passwordInput = document.querySelector("#password");
    accountLogin.style.display = "block";
    usernameInput.value = param.username;
    passwordInput.value = param.password;
    evt.initEvent('input', true, true);
    usernameInput.dispatchEvent(evt);
    passwordInput.dispatchEvent(evt);
}

function f5(param) {
    let tab_first = document.querySelector("#tab-first");//账号密码登录
    let tab_second = document.querySelector("#tab-second");//电子社保卡登录
    let tab_third = document.querySelector("#tab-third");//短信验证码登录
    let tab_forth = document.querySelector("#tab-forth");//正在维护

    //让账号密码登录模块显示出来
    tab_first.style.display = "inline-block";

    //模拟点击账号密码登录模块
    evt.initEvent('click', true, false);
    tab_first.dispatchEvent(evt);

    //赋账号密码值
    let accountLogin = document.querySelector("#pane-first");
    let usernameInput = document.querySelector("#username");
    let passwordInput = document.querySelector("#password");
    accountLogin.style.display = "block";
    usernameInput.value = param.username;
    passwordInput.value = param.password;
    evt.initEvent('input', true, true);
    usernameInput.dispatchEvent(evt);
    passwordInput.dispatchEvent(evt);
}


let urls = [
    {
        //vpms设计态
        index: 1,
        url: "https://10.30.8.187/#/SSFLogin",
        func: f1,
        username: "WvpmDevM",
        password: "ERROR@zQY1"
    }, {
        //vpms运行态
        index: 2,
        url: "https://10.30.8.192/rdm_",
        func: f2,
        username: "WvpmDevM",
        password: "Caeri@123456"
    }, {
        //vpms原型
        index: 3,
        url: "https://lanhuapp.com/link/#/invite?sid=qx0TWxCt",
        func: f3,
        password: "Xjik"
    }, {
        index: 4,
        url: "10.10.50.10/auth-ui/",
        func: f4,
        username: "500231199810214153",
        password: "123!@#qweQWE"
    }, {
        index: 5,
        url: "10.10.50.11/web-auth-ui/",
        func: f5,
        username: "500231199810214153",
        password: "123!@#qweQWE"
    }, {
        index: 6,
        url: "23.99.1.10/auth-ui/",
        func: f4,
        username: "500231199810214153",
        password: "123!@#qweQWE"
    }
];


// 创建悬浮按钮
function createFloatingButton() {
    try {
        // 检查按钮是否已存在
        if (document.querySelector('#autoFillButton')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'autoFillButton';
        
        // 使用SVG图标替代文字
        button.innerHTML = `
          <svg t="1753165916199" class="icon" viewBox="0 0 1217 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1669" width="16" height="16"><path d="M441.759135 795.897081a34.594595 34.594595 0 0 1 63.930811 26.43027c-6.199351 15.027892-18.874811 35.369514-39.880649 55.48973-30.636973 29.336216-70.46227 48.570811-119.475892 52.583784a34.594595 34.594595 0 0 1-5.645837-68.940108c32.463568-2.684541 57.648432-14.834162 77.24281-33.598271 11.789838-11.264 19.234595-22.361946 22.694054-29.50227l1.134703-2.490811zM492.682378 502.451892a34.594595 34.594595 0 0 1 46.135352-2.490811l2.795243 2.490811 151.939459 151.939459a34.594595 34.594595 0 0 1-46.107675 51.476757l-2.795243-2.546162-151.93946-151.93946a34.594595 34.594595 0 0 1 0-48.930594z" fill="#ffffff" p-id="1670"></path><path d="M1000.143568 52.860541C1052.256865 7.057297 1129.167568 0.719568 1173.088865 43.727568c42.980324 42.122378 38.164757 115.269189-5.009297 166.496864l-4.317406 4.898595-398.944865 435.283027-157.114811 153.876757-0.166054 3.957621c-3.127351 46.799568-23.911784 90.803892-60.277621 128.747244l-5.867243 5.922594c-47.408432 46.605838-123.461189 68.718703-220.519784 73.478919-58.700108 2.905946-121.108757-0.83027-182.438054-8.745513a1185.044757 1185.044757 0 0 1-36.670271-5.31373l-15.636756-2.656865-9.907892-1.85427-64.733406-13.007568 47.546811-45.803243c0.968649-0.940973 2.739892-2.767568 5.258379-5.479784l4.289729-4.73254c8.38573-9.40973 17.850811-20.895135 28.090811-34.483892 29.640649-39.382486 59.447351-87.593514 87.344433-144.937514a1117.709838 1117.709838 0 0 0 41.59654-97.141621c26.43027-70.572973 101.209946-95.42573 185.288649-78.239135l7.472432 1.66054 9.40973 2.186378 156.118486 152.908109 107.298595-105.056865-162.096432-158.803027 471.04-414.028108zM389.756541 640.415135c-50.646486-8.579459-87.731892 4.981622-99.355676 36.089081a1186.788324 1186.788324 0 0 1-44.170379 103.119568c-27.398919 56.32-56.679784 104.724757-86.237405 145.408l-8.053622 10.904216-2.546162 3.321081 17.158919 2.103351a981.656216 981.656216 0 0 0 132.732541 6.586811l18.210594-0.664216c81.643243-4.012973 142.972541-21.863784 175.436108-53.718486 32.629622-32.048432 47.93427-67.722378 45.581838-105.444325l-0.498162-5.452108-144.494703-141.561081-3.763891-0.691892zM1124.656432 93.184c-14.612757-14.308324-48.017297-12.371027-74.475243 8.081297l-4.345081 3.570162L630.728649 469.628541l108.516324 106.30227L1112.755892 168.378811c22.638703-24.686703 26.485622-56.956541 14.114594-72.731676l-2.214054-2.490811z" fill="#ffffff" p-id="1671"></path></svg>        `;
        
        button.style.cssText = `
            position: fixed;
            left: 0;
            bottom: 15px;
            z-index: 2147483647;
            width: 40px;
            height: 40px;
            background: linear-gradient(145deg, #409eff, #3187ff);
            color: white;
            border: 2px solid white;
            border-left: none;
            border-radius: 0 20px 20px 0;
            cursor: pointer;
            box-shadow: 0 3px 10px rgba(64, 158, 255, 0.35);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            outline: none;
            transform: translateX(-32px);
        `;

        // 添加悬停效果
        button.onmouseover = () => {
            button.style.transform = 'translateX(0)';
            button.style.boxShadow = '0 6px 20px rgba(64, 158, 255, 0.45)';
        };

        button.onmouseout = () => {
            button.style.transform = 'translateX(-32px)';
            button.style.boxShadow = '0 3px 10px rgba(64, 158, 255, 0.35)';
        };

        // 添加点击效果
        button.onmousedown = () => {
            button.style.transform = 'translateX(0) scale(0.95)';
        };
        
        button.onmouseup = () => {
            button.style.transform = 'translateX(0)';
        };

        // 点击执行自动填充
        button.onclick = () => {
            executeAutoFill();
        };

        // 确保按钮添加到 body
        if (document.body) {
            document.body.appendChild(button);
        }
    } catch (error) {
        console.error('创建悬浮按钮失败:', error);
    }
}

// 执行自动填充的函数
function executeAutoFill() {
    evt = document.createEvent('HTMLEvents');
    let href = document.URL;
    let item = urls.find(item => href.indexOf(item.url) > -1);
    if (item) {
        let param = JSON.parse(JSON.stringify(item));
        delete param.index;
        delete param.url;
        delete param.func;
        item.func(param);
    }
}

// 修改页面加载完成时的执行逻辑
window.addEventListener('load', function() {
    createFloatingButton();
    executeAutoFill();
});

// 为了确保按钮能显示，添加 DOMContentLoaded 事件监听
document.addEventListener('DOMContentLoaded', function() {
    createFloatingButton();
});

