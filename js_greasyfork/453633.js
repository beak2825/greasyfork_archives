// ==UserScript==
// @name         MEST Accounts Switcher
// @namespace    joyings.com.cn
// @version      1.3.0
// @description  fast switch account cookies
// @author       zmz125000
// @match        http://*/mest/*
// @icon         http://www.google.com/s2/favicons?domain=openwrt.org
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/453633/MEST%20Accounts%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/453633/MEST%20Accounts%20Switcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    if ($('button:contains("登录")')[0]) {
        $('button:contains("登录")')[0].addEventListener('click', function () {
            localStorage['password'] = document.querySelector('[placeholder="密码"]').value;
            localStorage['phone'] = document.querySelector('[placeholder="用户名"]').value;
            localStorage.removeItem('userName');
            importCookie();
        })
    }

    async function monitorLogout() {
        while (true) {
            if ($('button:contains("重新登录")')[0]) {
                window.open('http://112.74.92.133/mest/#/login', '_self');
            }
            await sleep(2000);
        }
    }

    async function monitorLoginPage() {
        while (!$('#login-box')[0]) {
            await sleep(3000);
            monitorLoginPage();
            return;
        }
        $('#panelDiv')[0].style.display = 'block';
    }

    async function insertDiv() {
        var div = document.createElement('div');
        div.className = 'item is-link';
        div.id = 'togglePanelBtn';
        div.setAttribute('style', 'vertical-align: middle;');

        var panelDiv = document.createElement('div');
        panelDiv.className = 'multiaccPanel';
        panelDiv.id = 'panelDiv';
        panelDiv.innerHTML = '<div id="accBtnsDiv"></div>\
        <button type=button id=multiaccImport class=multiaccBtn>更多插件</button>'
        panelDiv.style.display = 'none';
        div.addEventListener('click', function (e) {
            //importCookie();
            if ($('#panelDiv')[0].style.display == 'block') {
                $('#panelDiv')[0].style.display = 'none';
            } else {
                $('#panelDiv')[0].style.display = 'block';
            }
        }, false);

        let span = document.createElement('span');
        span.textContent = "切换员工";
        div.appendChild(span);
        document.body.appendChild(panelDiv);
        if ($('#login-box')[0]) {
            $('#panelDiv')[0].style.display = 'block';
        }
        while (!$('[class="user"]')[0]) {
            await sleep(200);
        }
        $('[class="user"]')[0].prepend(div);
        $('#panelDiv')[0].style.display = 'none';
        $('li:contains("退出登录")')[0].addEventListener('click', function () {
            $('#panelDiv')[0].style.display = 'block';
        });
        document.addEventListener('mouseup', function (e) {
            if (!panelDiv.contains(e.target) && !div.contains(e.target) && !$('#login-box')[0]) {
                panelDiv.style.display = 'none';
            }
        });
        $('#multiaccImport')[0].addEventListener('click', function () {
            window.open('https://greasyfork.org/en/users/906989-zmz125000', '_blank');
        });
        $('#multiaccImport')[0].style.display = 'none';
        monitorLoginPage();
        return div;
    }

    function updateOption() {
        for (let name in cookieData) {
            if (!$('button[class="accSelBtn"]:contains(' + name + ')')[0]) {
                let btn = document.createElement('button');
                btn.className = 'accSelBtn';
                btn.textContent = name;
                $('#accBtnsDiv')[0].appendChild(btn);
                let btnDel = document.createElement('button');
                btnDel.textContent = 'X';
                btnDel.className = 'accSelBtn';
                $('#accBtnsDiv')[0].appendChild(btnDel);
                let linebreak = document.createElement("br");
                $('#accBtnsDiv')[0].appendChild(linebreak);
                btn.addEventListener('click', function () {
                    changeActiveCookie(cookieData[name][0], cookieData[name][1]);
                });
                btnDel.addEventListener('click', function () {
                    if (confirm("确定删除" + name + "?")) {
                        deleteCookie(name);
                        $('#accBtnsDiv')[0].removeChild(btn);
                        $('#accBtnsDiv')[0].removeChild(btnDel);
                        $('#accBtnsDiv')[0].removeChild(linebreak);
                    }
                });
            }
        }
    }

    // 保存 读取 导入 切换 删除cookie
    // cookieData={ name:cookie,...}
    function loadData() {
        try {
            return JSON.parse(localStorage["multiacc"]);
        } catch (e) {
            localStorage["multiacc"] = {};
            return {};
        }
    }

    function saveData() {
        localStorage["multiacc"] = JSON.stringify(cookieData);
    }

    // save button
    async function importCookie() {
        if ($('button:contains("登录")')[0]) {
            await sleep(1000);
            importCookie();
            return;
        }

        if (!$('input[placeholder="请选择账套"]')[0]) {
            var name = localStorage['userName'];
            var phone = localStorage['phone'];
            var password = localStorage['password'];
            if (name && !cookieData[name]) {
                cookieData[name] = [];
            }
            if (phone) {
                cookieData[name][0] = phone;
            }
            if (password) {
                cookieData[name][1] = password;
            }
            localStorage.removeItem('phone');
            localStorage.removeItem('password');
            saveData();
            updateOption();
        }
    }

    function deleteCookie(name) {
        if (name) {
            delete cookieData[name];
            saveData();
        }
    }

    function changeActiveCookie(phone, password) {
        var url = new URL(window.location.href);
        var scd = url.searchParams.get("scd");
        var process = url.searchParams.get("process");
        var order = url.searchParams.get("order");
        var host = window.location.host;
        var password = password ? password : '123456';
        if (scd) {
            var url = 'http://' + host + '/mest/?autologin=1&username=' + phone + '&password=' + password + '&scd=' + scd + '#/login?redirect=%2Fbusiness_example_production%2FprocessReport';
        } else {
            var url = 'http://' + host + '/mest/?autologin=1&username=' + phone + '&password=' + password + '#/login';
        }
        //localStorage.removeItem('mest__ALL_MENU_ROUTES');
        //localStorage.removeItem('mest__ACCESSED_ROUTES');
        //localStorage.removeItem('permissions');
        window.open(url, '_blank');
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        // style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    // init
    window.cookieData = loadData();
    insertDiv();
    monitorLogout();
    updateOption();
    addGlobalStyle(`.multiaccPanel {
        position: fixed;
        z-index: 1000000;
        height: auto;
        width: auto;
        border: black;
        top: 30px;
        right: 30px;
        opacity: 0.95;
        right: 190px;
        background: #E5E7E9;
        border-radius: 12px;
        padding: 10px 10px;
    }

    .multiaccBtn {
        margin-top: 10px;
        margin-left: 10px;
        margin-bottom: 10px;
        font-size: large;
        background-color: #633974;
        border: none;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
    }

    .multiaccBtn:hover {
        background-color: green;
    }

    .accSelBtn {
        background-color: #2980B9;
        border: none;
        color: white;
        padding: 10px 15px;
        text-align: center;
        font-size: large;
        border-radius: 8px;
        vertical-align: middle;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 10px;
        margin-right: 10px;
    }
    
    .is-link {
        cursor: pointer;
    }

    .accSelBtn:hover {
        background-color: green;
    }`);
})();