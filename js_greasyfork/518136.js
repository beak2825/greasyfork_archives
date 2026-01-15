// ==UserScript==
// @name         MoviePilot自动登录
// @version      1.2.2
// @namespace    https://www.muooy.com/
// @description  因为MoviePilot每次重启都要重新登陆，而且浏览器又不能自动填充账号密码，我比较懒不想输账号密码所有我写了这个脚本。
// @author       Daliyuer
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5.2
// @grant        none
// @require      https://unpkg.com/axios/dist/axios.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/518136/MoviePilot%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/518136/MoviePilot%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /* 
    * 更新记录
    * v1.2.2（2026-01-10）
    * 修复2.9.3以后的版本无法登录的问题
    * 
    * v1.2（2025-04-01）
    * 修复2.3.1以后的版本无法登录的问题
    * 修复了MoviePilot的账号密码错误无法自动登录的问题（账号密码错误重新弹出配置窗口）
    * 优化登录逻辑
    * 无需修改@match配置等代码配置自动判断当前网站是否是MoviePilot，对小白更友好（新增）
    *
    * v1.1（2025-01-05）
    * 新增配置窗口，无需更改文件可直接更改MoviePilot账号密码url信息，第一次使用会弹窗
    * 修复会登录其他程序的问题
    *
    */
    if (document.title == 'MoviePilot') {
        console.log("当前网站为MoviePilot开始执行自动登录程序");
        if (localStorage.getItem('AutomaticLoginConfig') === 'true') {
            startMonitoring();
        } else {
            popUps();
        }
    }
    function startMonitoring() {
        //注意上面的注释的 @match  也要改成你的MoviePilot的IP地址不要加端口
        let uname = localStorage.getItem("auname"); //MoviePilot账号
        let upassword = localStorage.getItem("aupwd"); //MoviePilot密码
        //let MoviePilotHost = localStorage.getItem("auurl"); //MoviePilot地址ip+端口 后缀不需要加 /
        let MoviePilotHost = window.location.origin; // 获取当前域名和端口

        //不懂的不要动以下代码
        var currentUrl = window.location.href;
        let intervalId;
        let vueRouter;
        var isCloud = 0;
        function waitForVue() {
            return new Promise((resolve) => {
                const checkVue = () => {
                    if (window.Vue && window.Vue.prototype.$router) {
                        vueRouter = window.Vue.prototype.$router;
                        resolve();
                    } else {
                        setTimeout(checkVue, 1000);
                    }
                };
                checkVue();
            });
        }


        function checkUrlChange() {
            const newUrl = window.location.href;
            if (!newUrl.includes(MoviePilotHost + '/#/login')) {
                clearInterval(intervalId);
                currentUrl = newUrl;
                startMonitoring();
            } else {
                info11();
            }
        }


        function info11() {

            let formData = new FormData();
            formData.append('username', uname);
            formData.append('password', upassword);
            // 查找用户名和密码输入框
            let usernameInput = document.querySelector('input[name="username"]');
            let passwordInput = document.querySelector('input[name="password"]');
            let loginButton = document.querySelector('button[type="submit"], button.login-button'); // 适配不同按钮

            function setInputValue(element, value) {
                let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(element, value);
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
            }

            setInputValue(usernameInput, localStorage.getItem("auname"));
            setInputValue(passwordInput, localStorage.getItem("aupwd"));

            loginButton.click();

            axios.post(MoviePilotHost + '/api/v1/login/access-token', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(function (response) {
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 401) {
                        console.log('Unauthorized: 401 Status Code');
                        localStorage.setItem('AutomaticLoginConfig', 'false');
                        alert("账号密码错误，请重新输入");
                        window.history.go(0);
                    } else {
                        console.error('Error posting data:', error);
                        window.history.go(0);
                    }
                });
        }

        // function info11() {

        //     let formData = new FormData();
        //     formData.append('username', uname);
        //     formData.append('password', upassword);




        //     axios.post(MoviePilotHost + '/api/v1/login/access-token', formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     })
        //         .then(function (response) {

        //             axios.get(MoviePilotHost + '/api/v1/user/config/Layout', {
        //                 headers: {
        //                     'Authorization': 'Bearer ' + response.data.access_token
        //                 }
        //             }).then((responsea) => {


        //                 localStorage.setItem('auth', '{"token":"' + response.data.access_token + '","remember":true,"originalPath":"/dashboard"}');

        //                 axios.get(MoviePilotHost + '/api/v1/user/config/Dashboard', {
        //                     headers: {
        //                         'Authorization': 'Bearer ' + response.data.access_token
        //                     }
        //                 }).then((responsea) => {

        //                     location.rel·oad();




        //                 });
        //             });

        //         })
        //         .catch(function (error) {
        //             if (error.response && error.response.status === 401) {
        //                 console.log('Unauthorized: 401 Status Code');
        //                 localStorage.setItem('AutomaticLoginConfig', 'false');
        //                 alert("账号密码错误，请重新输入");
        //                 window.history.go(0);
        //             } else {
        //                 console.error('Error posting data:', error);
        //                 window.history.go(0);
        //             }
        //         });
        // }


        function startMonitoring() {
            intervalId = setInterval(checkUrlChange, 1000);
        }


        function setupRouteChangeListeners() {

            const pushState = history.pushState;
            history.pushState = function (state) {
                pushState.apply(history, arguments);
                checkUrlChange();
            };


            window.addEventListener('hashchange', checkUrlChange);


            window.addEventListener('popstate', checkUrlChange);
        }

        async function navigateToNewUrl() {
            await waitForVue();
            const newPath = '/dashboard';
            vueRouter.push(newPath);
        }


        window.onload = startMonitoring();
        setupRouteChangeListeners();
        console.log("本脚本出生于2024-11-20，功能原创，请勿盗版！博客：https://www.muooy.com")
        return;

    }
    function popUps() {
        const style = document.createElement('style');
        style.innerHTML = `
    .AutomaticLoginForm {
    max-width: 650px;
    margin: 50px auto;
    padding: 20px;
    background: #f2f2f2;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.AutomaticLoginForm h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}

.AutomaticLoginForm input[type="text"],
.AutomaticLoginForm input[type="password"] {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
}

.AutomaticLoginForm input[type="submit"] {
    width: 100%;
    padding: 10px;
    background: rgb(145, 85, 253);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.AutomaticLoginForm input[type="submit"]:hover {
    background: rgb(148, 91, 255);
}
    `;
        document.head.appendChild(style);

        // 创建弹窗的 HTML（包含表单）
        const modalHTML = `
        <div id="AutomaticLoginMode" style="display:none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 500px; height: auto; z-index: 9999;">
            <form id="AutomaticLoginForm"class="AutomaticLoginForm" action="#" method="post">
                   <h2>MoviePilot自动登录配置</h2>
                   <input type="text" id="ausername" name="ausername" placeholder="MoviePilot的账号" required>
                   <input type="password" id="apassword" name="apassword" placeholder="MoviePilot的密码" required>
                   <!--input type="text" id="aurls" name="aurls" placeholder="地址:ip+端口,如:http://192.168.5.10:3000" required--!>
                   <p id="message" style="display:none;text-align: center; color: red;">配置成功!</p>
                   <input type="submit" value="保存">
            </form>
             </div>
        <div id="modalBackdrop" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9998;"></div>
    `;


        document.body.insertAdjacentHTML('beforeend', modalHTML);


        const amodal = document.getElementById('AutomaticLoginMode');
        const backdrop = document.getElementById('modalBackdrop');
        const aform = document.getElementById('AutomaticLoginForm');
        const amessage = document.getElementById('message');


        function showModal() {
            amodal.style.display = 'block';
            backdrop.style.display = 'block';
        }


        function closeModal() {
            amodal.style.display = 'none';
            backdrop.style.display = 'none';
            startMonitoring();
            //location.reload();
        }

        // 表单提交处理
        function handleSubmit(event) {
            event.preventDefault();


            const auname = document.getElementById('ausername').value;
            const aupwd = document.getElementById('apassword').value;
            //const auurl = document.getElementById('aurls').value;
            localStorage.setItem("auname", auname);
            localStorage.setItem("aupwd", aupwd);
            // localStorage.setItem("auurl", auurl);



            amessage.style.display = 'block';
            localStorage.setItem('AutomaticLoginConfig', 'true'); // 设置提交标记

            setTimeout(closeModal, 1000); // 1秒后关闭弹窗
        }

        // 绑定表单提交事件
        aform.addEventListener('submit', handleSubmit);

        // 在页面加载完成后，显示弹窗
        window.addEventListener('load', showModal);
    }
})();