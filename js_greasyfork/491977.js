// ==UserScript==
// @name         WHUT Campus Network Auto-Login
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Automatically logs into the campus network by fetching saved credentials from localStorage
// @author       Alleyf
// @match        http://172.30.21.100/tpl/whut/login.html*
// @match        https://172.30.21.100/tpl/whut/login.html*
// @icon         http://qnpicmap.fcsluck.top/pics/202311162214229.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491977/WHUT%20Campus%20Network%20Auto-Login.user.js
// @updateURL https://update.greasyfork.org/scripts/491977/WHUT%20Campus%20Network%20Auto-Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global variable for the modal
    let modal;

    //请求在线状态
    function isLogin() {
      $.get(
        host_url + '/account/status' + '?token=' + localStorage.getItem('token'),
        function (result) {
          if (result.code === 0) {
            console.log('校园网已登陆在线')
            return true;
          }else{
            toLogin();
            return false;
          }
        }
      )
    }
    // Function to check if the network is available
    function isNetworkAvailable() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                resolve(true);
            };
            img.onerror = function() {
                resolve(false);
            };
            img.src = 'https://www.baidu.com/favicon.ico?' + new Date().getTime();
        });
    }

    //登录
    function login() {
        // if (!allowClick) {
        //     return
        // }
        if ($('#username').val() === '' || $('#password').val() === '') {
            alert('账号或密码不能为空');
            return
        }
        postData.username = $('#username').val()
        postData.password = $('#password').val()
        postData.captcha = $('#codeNumber').val()
        //console.log(postData)
        // 清除浏览器存储的token
        //localStorage.clear("token")
        $('#login-account').css('opacity', '0.5')  // 提交
        $.post(
            host_url + '/account/login',
            postData,
            function (result) {
                // code=0 认证成功 code=1 认证失败 code=2 需要验证码
                if (result.code === 0) {
                    localStorage.setItem('token', result.token) //存储token
                    /*window.open(
                        'success.html',
                        'newwindow',
                        'height=400, width=460, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no'
                    )
                    window.location.href = decodeURIComponent(urlHref)*/
                    console.log('登陆成功')
                    return
                } else if (result.code === 1) {
                    // allowClick = true; // 允许点击
                    $('#login-account').css('opacity', '1')
                    var errMsg = result.authMsg ? result.authMsg : result.msg;
                    alert(errMsg)
                    return
                } else if (result.code === 2) {
                    alert(result.msg)        // allowClick = true; // 允许点击
                    $('#login-account').css('opacity', '1')
                    $('#code').css('display', 'block');
                    $('#codeImg').attr('src', result.captcha.picPath);
                    postData.captchaId = result.captcha.captchaId
                    return
                }
            }
        )
        return true;
    }

    // Function to attempt automatic login
    function autoLogin() {
        const loginForm = document.querySelector('div.loginForm'); // Replace with the actual form selector
        if (!loginForm) {
            console.error('Login form not found');
            return;
        }

        const username = localStorage.getItem('campusUsername');
        const password = localStorage.getItem('campusPassword');

        if (username && password) {
            //const usernameField = loginForm.querySelector('input#username');
            //const passwordField = loginForm.querySelector('input#password');
            //usernameField.value = username;
            //passwordField.value = password;
            $('#username').val(username);
            $('#password').val(password);
            //console.log('登录信息为：',username,password)
            login();
            //checkForm();
        } else {
            console.log('No saved credentials found. Please enter your username and password to save and log in.');
            showLoginModal();
        }
    }

    // Function to create and show the modal for entering credentials
    function showLoginModal() {
        const modalContainerStyle = {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '300px',
            zIndex: '10000',
            transition: 'opacity 0.3s ease-in-out', // 添加过渡效果
            opacity: 0 // 初始透明度为0，显示时再设置为1
        };

        // 创建模态窗
        const modalContainer = document.createElement('div');
        modalContainer.id = 'loginModal';
        Object.assign(modalContainer.style, modalContainerStyle);

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = 'X'; // 使用Font Awesome图标
        closeButton.onclick = function() {
            modalContainer.style.opacity = '0';
            setTimeout(() => modalContainer.remove(), 300); // 延迟移除模态窗
        };

        // 创建表单
        const form = document.createElement('form');
        form.innerHTML = `
<div class="main" style="position: relative; display: flex; flex-direction: column; background-color: #240046; max-height: 420px; overflow: hidden; border-radius: 12px; box-shadow: 7px 7px 10px 3px #24004628;">
    <div class="login" style="position: relative; width: 100%; height: 100%;">
            <label style="margin: 25% 0 5%; color: #fff; font-size: 2rem; justify-content: center; display: flex; font-weight: bold; cursor: pointer; transition: .5s ease-in-out;">Log In</label>
            <input class="input" id="campusUsername" type="text" name="campusUsername" placeholder="Email" required="" style="width: 100%; height: 40px; background: #e0dede; padding: 10px; border: none; outline: none; border-radius: 4px;">
            <input class="input"  id="campusPassword" type="password" name="campusPassword" placeholder="Password" required="" style="width: 100%; height: 40px; background: #e0dede; padding: 10px; border: none; outline: none; border-radius: 4px;">
            <button type="submit" id="loginButton" style="width: 100%; height: 40px; margin: auto; color: #fff; background: #573b8a; font-size: 1rem; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; transition: .2s ease-in;">Log in</button>
    </div>
</div>
`;
        form.onsubmit = function(event) {
            event.preventDefault();
            const username = document.getElementById('campusUsername').value;
            const password = document.getElementById('campusPassword').value;
            localStorage.setItem('campusUsername', username);
            localStorage.setItem('campusPassword', password);
            //autoLogin();
            modalContainer.style.display = 'none';
        };

        // Make the modal draggable
            let isDragging = false;
            let dragStartX, dragStartY;
            let modalStartX, modalStartY;

            function handleMouseDown(event) {
                isDragging = true;
                dragStartX = event.clientX;
                dragStartY = event.clientY;
                modalStartX = modalContainer.offsetLeft;
                modalStartY = modalContainer.offsetTop;
            }

            function handleMouseMove(event) {
                if (!isDragging) return;
                const dx = event.clientX - dragStartX;
                const dy = event.clientY - dragStartY;
                modalContainer.style.left = `${modalStartX + dx}px`; modalContainer.style.top = `${modalStartY + dy}px`;
            }

            function handleMouseUp() {
                isDragging = false;
            }

            modalContainer.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

        modalContainer.appendChild(closeButton);
        modalContainer.appendChild(form);
        document.body.appendChild(modalContainer);
       // 显示模态窗时设置透明度为1
        modalContainer.style.opacity = '1';
    }

    // Event listener for ESC key to close the modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('loginModal');
            if (modal && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        }
    });

    // Create the icon and event listener for clicking the icon
    const icon = document.createElement('img');
    icon.src = 'https://qnpicmap.fcsluck.top/pics/202311162214229.png';
    icon.style.position = 'fixed';
    icon.style.right = '30px';
    icon.style.bottom = '30px';
    icon.style.width = '24px';
    icon.style.height = '24px';
    icon.style.cursor = 'pointer';
    icon.onclick = showLoginModal;
    document.body.appendChild(icon);

    // Main function to run on page load
    function toLogin() {
        $('#username').val('');
        $('#password').val('');
        if (localStorage.getItem('campusUsername') && localStorage.getItem('campusPassword')) {
                autoLogin();
            } else {
                showLoginModal();
                console.log('显示登录脚本配置')
       }
    }

  function main() {
    isLogin();
  }


  function old_main() {
      if (window.navigator.onLine == true) {
                        $.ajax({
                            url: "http://qnpicmap.fcsluck.top/pics/202311162214229.png",
                            type: "POST",
                            timeout: 3000,
                            dataType: "json",
                        }).complete(function (XMLHttpRequest) {
                            console.log(XMLHttpRequest);
                            if (XMLHttpRequest.status == 200) {
                                console.log("已经可以正常上网");
                                return true;
                            } else {
                                console.log("开始自动登录");
                                toLogin();
                                return false;
                                //window.open(e, i);
                            }
                        });
                    } else {
                        console.error("网络未连接--请检查网络");
                        toLogin();
                        return false;
                    }
    }

    // 运行主函数
    main();
})();