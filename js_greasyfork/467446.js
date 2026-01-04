// ==UserScript==
// @name         新商盟和新平台自动填充账号密码(完美)--新增:1.排除密码为空时保存账号密码, 2.如果检测到"验证码无效"提示,就再次自动填充账号密码
// @namespace    http://tampermonkey.net/
// @version      23.10.9
// @description  自动填充网站账号密码，并保存密码到本地
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467446/%E6%96%B0%E5%95%86%E7%9B%9F%E5%92%8C%E6%96%B0%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%28%E5%AE%8C%E7%BE%8E%29--%E6%96%B0%E5%A2%9E%3A1%E6%8E%92%E9%99%A4%E5%AF%86%E7%A0%81%E4%B8%BA%E7%A9%BA%E6%97%B6%E4%BF%9D%E5%AD%98%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%2C%202%E5%A6%82%E6%9E%9C%E6%A3%80%E6%B5%8B%E5%88%B0%22%E9%AA%8C%E8%AF%81%E7%A0%81%E6%97%A0%E6%95%88%22%E6%8F%90%E7%A4%BA%2C%E5%B0%B1%E5%86%8D%E6%AC%A1%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/467446/%E6%96%B0%E5%95%86%E7%9B%9F%E5%92%8C%E6%96%B0%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%28%E5%AE%8C%E7%BE%8E%29--%E6%96%B0%E5%A2%9E%3A1%E6%8E%92%E9%99%A4%E5%AF%86%E7%A0%81%E4%B8%BA%E7%A9%BA%E6%97%B6%E4%BF%9D%E5%AD%98%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%2C%202%E5%A6%82%E6%9E%9C%E6%A3%80%E6%B5%8B%E5%88%B0%22%E9%AA%8C%E8%AF%81%E7%A0%81%E6%97%A0%E6%95%88%22%E6%8F%90%E7%A4%BA%2C%E5%B0%B1%E5%86%8D%E6%AC%A1%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    //新商盟+新平台记住账号密码
    let usernameInputs = document.querySelectorAll('#username, #login_username');
    let passwordInputs = document.querySelectorAll('#password, #login_userpwd, #mcmm, #mcmm1');
    let loginButtons = document.querySelectorAll('#btn-login, #login_Toindexbtn');

    let storedUsernames = JSON.parse(localStorage.getItem('usernames')) || [];
    let storedPasswords = JSON.parse(localStorage.getItem('passwords')) || [];

    usernameInputs.forEach(function(usernameInput, index) {
        let passwordInput = passwordInputs[index];
        let loginButton = loginButtons[index];
        if (storedUsernames.length && storedPasswords.length) {
            usernameInput.value = storedUsernames[storedUsernames.length - 1];
            passwordInput.value = storedPasswords[storedPasswords.length - 1];
        }

        loginButton.addEventListener('click', function() {
            if (passwordInput.value.trim() !== '') {
                let index = storedUsernames.indexOf(usernameInput.value);
                if (index > -1) {
                    storedUsernames.splice(index, 1);
                    storedPasswords.splice(index, 1);
                }
                storedUsernames.push(usernameInput.value);
                localStorage.setItem('usernames', JSON.stringify(storedUsernames));
                storedPasswords.push(passwordInput.value);
                localStorage.setItem('passwords', JSON.stringify(storedPasswords));
            }
        });

        setInterval(function() {
            // 获取错误信息元素
            var errorMsgElement = document.querySelector('.msg_error_txt');

            // 检查错误信息元素是否存在并且文本内容为 "验证码无效"
            if (errorMsgElement && errorMsgElement.textContent.trim() === '验证码无效') {
                // 自动填充密码
                usernameInput.value = storedUsernames[storedUsernames.length - 1];
                passwordInput.value = storedPasswords[storedPasswords.length - 1];
            }
        }, 10);


        let list;
        usernameInput.addEventListener('click', function() {
            list = document.createElement('ul');
            list.style.position = 'absolute';
            list.style.zIndex = '999';
            list.style.listStyleType = 'none';
            list.style.padding = '0';
            list.style.margin = '0';
            for (let i = 0; i < storedUsernames.length; i++) {
                let item = document.createElement('li');
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.background = '#fff';
                item.style.padding = '5px 10px';
                item.style.cursor = 'pointer';

                let span = document.createElement('span');
                span.innerText = storedUsernames[i];
                span.style.flexGrow = '1';

                    //span.style.fontSize = '22px'; // 设置字体大小为22
                    if (window.innerWidth < window.innerHeight) {
                        // 如果屏幕宽度小于高度，则为竖屏
                        span.style.fontSize = '40px';
                    } else {
                        // 否则为横屏
                        span.style.fontSize = '22px';
                    }

                item.appendChild(span);

                let button = document.createElement('button');
                button.innerText = '删除';
                button.style.border = 'none';
                button.style.background = '#f00';
                button.style.color = '#fff';
                button.style.padding = '1px 5px';
                button.style.cursor = 'pointer';
                button.addEventListener('click', function(event) {
                    event.stopPropagation();
                    storedUsernames.splice(i, 1);
                    localStorage.setItem('usernames', JSON.stringify(storedUsernames));
                    storedPasswords.splice(i, 1);
                    localStorage.setItem('passwords', JSON.stringify(storedPasswords));
                    document.body.removeChild(list);
                });
                item.appendChild(button);

                item.addEventListener('click', function() {
                    usernameInput.value = storedUsernames[i];
                    passwordInput.value = storedPasswords[i];
                    document.body.removeChild(list);
                });
                list.appendChild(item);
            }
            document.body.appendChild(list);
            let rect = usernameInput.getBoundingClientRect();
            list.style.top = rect.top + rect.height + 'px';
            list.style.left = rect.left + 'px';

            // 添加事件监听器，当点击外部时隐藏列表
            document.addEventListener('click', function(event) {
                if (event.target !== usernameInput && event.target !== list) {
                    document.body.removeChild(list);
                }
            });
        });
    });





    //下面方法为基础版(只能记住一个账号密码)
    /*// 获取账号和密码输入框元素
    let usernameInput = document.querySelector('#username');
    let passwordInput = document.querySelector('#password');

    // 检查是否存在本地存储的账号和密码
    let storedUsername = localStorage.getItem('username');
    let storedPassword = localStorage.getItem('password');

    if (storedUsername && storedPassword) {
        // 如果存在，则自动填充到输入框中
        usernameInput.value = storedUsername;
        passwordInput.value = storedPassword;
    }

    // 当用户在输入框中输入内容时，将其存储到本地存储中
    usernameInput.addEventListener('input', function() {
        localStorage.setItem('username', usernameInput.value);
    });
    passwordInput.addEventListener('input', function() {
        localStorage.setItem('password', passwordInput.value);
    });*/




})();

