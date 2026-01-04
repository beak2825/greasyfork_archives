// ==UserScript==
// @name         CSUAutoLogin
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  自动登录“中南大学统一身份认证平台”及使用该平台鉴权的校内网页的油猴脚本
// @author       YJM

// @match        *://ca.csu.edu.cn/authserver/login*

// @match        *://mail.csu.edu.cn/
// @match        *://mail.csu.edu.cn/coremail/

// @match        *://libdb.csu.edu.cn/reslist
// @match        *://libdb.csu.edu.cn/reslist/

// @match        *://ehall.csu.edu.cn/v2/site/index
// @match        *://ehall.csu.edu.cn/v2/site/index/

// @match        *://award.csu.edu.cn/*

// @match        *://jf.csu.edu.cn/xysf/

// @match        *://libzw.csu.edu.cn/home/web/f_second
// @match        *://libzw.csu.edu.cn/home/web/f_second/

// @match        *://pan.csu.edu.cn/*

// @match        *://gms.csu.edu.cn/stu/logon
// @match        *://gms.csu.edu.cn/stu/logon/

// @match        *://ecard.csu.edu.cn/*

// 有些应用第一次使用需要手动授权，如ecard
// @match        *://ca.csu.edu.cn/authserver/oauth2.0/authorize*

// 校园网自动登录
// @match        *://10.1.1.1
// @match        *://portal.csu.edu.cn/*

// @match        *://ms.csu.edu.cn/*

// 学生管理系统，很卡很难打开
// todo http://202.197.71.125/xgxt/a
// todo https://career.csu.edu.cn/ 毕业生才能登录？
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507926/CSUAutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/507926/CSUAutoLogin.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    // 请替换为自己的学号和密码
    const username = 'xxx';
    const password = 'xxx';
    // 请替换为自己的网络类型，例如 'telecomn'（电信）, 'cmccn'（移动）, 'unicomn'（联通） 或 ''（校园网）
    const netType = '';

    // 如果是统一身份认证平台
    var ca = function () {
        // 点击登录按钮
        let xpath = '//*[@id="login_submit"]';
        let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (matchingElement) {
            // Fill the username and password
            let usernameInput = document.evaluate('//*[@id="username"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            let passwordInput = document.evaluate('//*[@id="password"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            let rememberMeCheckbox = document.evaluate('//*[@id="rememberMe"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (usernameInput) {
                // 请输入你的学号
                usernameInput.value = username;
            } else {
                console.error('脚本未找到用户名输入框！')
            }

            if (passwordInput) {
                // 请输入你的密码
                passwordInput.value = password;
            } else {
                console.error('脚本未找到密码输入框！')
            }

            if (rememberMeCheckbox) {
                // 勾选7天免登录
                rememberMeCheckbox.checked = true;
            } else {
                console.error('脚本未找到记住我复选框！')
            }

            matchingElement.click();
        } else {
            console.error('脚本未找到登录按钮！')
        }
    };
    // 如果是邮箱登录页面
    var mail = function () {
        // 点击统一身份认证登录按钮（如果已登录，由于没有篡改猴脚本匹配的url，因此不会执行）
        let xpath = '/html/body/div[3]/div[4]/div[3]/div[3]/div[1]/form/div[4]/button';
        let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (matchingElement) {
            matchingElement.click();
        } else {
            console.error('脚本未找到统一身份认证登录按钮！')
        }
    };
    // 如果是图书馆页面
    var libdb = function () {
        let xpath = '/html/body/div[2]/div/div[1]/div/span[1]';
        let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // 如果不存在用户名（你好，），跳转到登录页面
        if (matchingElement == null) {
            window.location.href = 'http://libdb.csu.edu.cn/login';
        } else {
            console.info('已登录')
        }
    };
    // 如果是网上办事大厅页面
    var ehall = function () {
        // 已登录
        let username_xpath = '/html/body/div[1]/div[1]/div/div[3]/div';
        let matchingElement = document.evaluate(username_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // 如果不存在用户名，跳转到登录页面
        if (matchingElement == null) {
            let login_logout_xpath = '/html/body/div[1]/div[1]/div/div[3]/button';
            let matchingElement = document.evaluate(login_logout_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (matchingElement) {
                matchingElement.click();
            } else {
                console.error('脚本未找到登录按钮！')
            }
        } else {
            console.info('已登录')
        }
    };
    // 如果是奖助学金管理系统登录页面
    var award = function () {
        // 点击系统登录按钮（如果已登录，由于没有对应的文本，因此不会执行）
        let inner_text = '系统登录';
        let xpath = '//*[@id="app"]/div[1]/div[2]/div[1]/div[1]/div/div[3]/div';
        let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (matchingElement && matchingElement.innerText.indexOf(inner_text) !== -1) {
            matchingElement.click();
        } else {
            console.error('脚本未找到系统登录按钮！')
        }
    };
    // 如果是校园统一支付平台页面
    var zf = function () {
        let inner_text = '校内统一身份认证';
        let xpath = '//*[@id="form1"]/div[3]/div[1]/a[3]';
        let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (matchingElement && matchingElement.innerText === inner_text) {
            matchingElement.click();
        } else {
            console.error('脚本未找到校内统一身份认证按钮！')
        }
    };
    // 如果是图书馆座位管理系统页面
    var libzw = function () {
        let login_xpath = '/html/body/div[2]/div[1]/ul/li[4]';
        let logout_xpath = '/html/body/div[2]/div[1]/ul/li[6]';

        let loginElement = document.evaluate(login_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let logoutElement = document.evaluate(logout_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (loginElement && logoutElement) {
            if (loginElement.style.display !== "none" && logoutElement.style.display === "none") {
                let click_xpath = '/html/body/div[2]/div[1]/ul/li[4]/a';
                let clickElement = document.evaluate(click_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                // 注意点击的位置
                clickElement.click();
            } else {
                console.info('已登录')
            }
        } else {
            console.error('脚本未找到登录按钮！')
        }
    };
    // 如果是云盘页面
    var pan = function (xpath) {
        // 点击登录按钮
        // let xpath = '//*[@id="index-login"]/div/div[2]/div[2]/div[1]/form/div[3]/button';
        let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (matchingElement) {
            // Fill the username and password
            let usernameInput = document.evaluate('//*[@id="index-login"]/div/div[2]/div[2]/div[1]/form/div[1]/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            let passwordInput = document.evaluate('//*[@id="index-login"]/div/div[2]/div[2]/div[1]/form/div[2]/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (usernameInput) {
                // 请输入你的学号
                usernameInput.value = username;
                // 触发input事件
                let event = new Event('input', {bubbles: true});
                usernameInput.dispatchEvent(event);
            } else {
                console.error('脚本未找到用户名输入框！')
            }

            if (passwordInput) {
                // 请输入你的密码
                passwordInput.value = password;
                // 触发input事件
                let event = new Event('input', {bubbles: true});
                passwordInput.dispatchEvent(event);
            } else {
                console.error('脚本未找到密码输入框！')
            }

            matchingElement.click();
        } else {
            console.error('脚本未找到登录按钮！')
        }
    };

    var stu_gms = function () {
        let login_button = '//*[@id="loginIt"]';
        let matchingElement = document.evaluate(login_button, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (matchingElement) {
            let username_xpath = '//*[@id="username"]';
            let usernameInput = document.evaluate(username_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (usernameInput) {
                usernameInput.value = username;
            }

            let password_xpath = '//*[@id="password"]';
            let passwordInput = document.evaluate(password_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (passwordInput) {
                passwordInput.value = password;
            }

            // 只能手动输入验证码
            // matchingElement.click();
        }
    }
    var ecard = function () {
        // 主页：https://ecard.csu.edu.cn/plat-pc/serviceclassification
        let inner_text1 = '登录';
        let inner_text_xpath1 = '//*[@id="header"]/div[1]/div/div[2]/div/div[2]/span';
        let matchingElement1 = document.evaluate(inner_text_xpath1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // MutationObserver 用于监听 DOM 变化
        const observer = new MutationObserver((mutations, observer) => {
            // 登录页面：https://ecard.csu.edu.cn/plat-pc/login
            let inner_text2 = '统一身份认证登录';
            let inner_text_xpath2 = '//*[@id="app"]/div[3]/div[2]/div[1]/div[1]/div/div[5]/div[1]/a/span';
            let matchingElement2 = document.evaluate(inner_text_xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (matchingElement2 && matchingElement2.innerText === inner_text2) {
                console.info('跳转统一身份认证页面中...');
                window.location.href = 'https://ecard.csu.edu.cn/berserker-auth/cas/oauth2?resultUrl=https%3A%2F%2Fecard.csu.edu.cn';
                // todo 有时候跳转统一认证平台自动登录后还会有一个登录按钮，有时候没有，需要手动点击。但其实不点击也登陆了
                observer.disconnect(); // 找到元素后停止观察
            }
        });

        // 开始监听整个文档的 DOM 变化
        observer.observe(document, {
            childList: true,
            subtree: true
        });

        if (matchingElement1 && matchingElement1.innerText === inner_text1) {
            // 未登录
            let login_button = '//*[@id="header"]/div[1]/div/div[2]/div/div[2]';
            let matchingElement = document.evaluate(login_button, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (matchingElement) {
                console.info('点击登录按钮...')
                matchingElement.click(); // 跳转登陆页面：https://ecard.csu.edu.cn/plat-pc/login
            } else {
                console.error('脚本未找到登录按钮！')
            }
        }
    }

    var ca_auth = function () {
        // 授权页面
        let inner_text3 = '授权';
        let inner_text_xpath3 = '/html/body/div/div/form/div[2]/input';
        let matchingElement3 = document.evaluate(inner_text_xpath3, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (matchingElement3 && matchingElement3.getAttribute('value') === inner_text3) {
            // 未登录，点击授权按钮
            console.info('登陆中...')
            matchingElement3.click();
        } else {
            console.error('脚本未找到授权按钮！')
        }
    }

    var portal = function () {
        // 参考代码：https://github.com/barkure/CSU-Net-Portal/blob/main/portal.py
        const url = 'https://10.1.1.1/drcom/chkstatus?callback=dr';  // IP直连，避免DNS解析出错
        fetch(url)
            .then(response => response.text())
            .then(data => {
                // 解析返回的数据
                const resultMatch = data.match(/"result":\s*(\d+)/);
                if (resultMatch && resultMatch[1] !== '1') {
                    // 如果结果不是1，则进行登录
                    login();
                } else {
                    console.info('已登录');
                }
            })
            .catch(error => console.error('获取登录状态失败：', error));


        // 登录函数
        function login() {
            const userAccount = `${username}@${netType}`;

            const loginUrl = `https://10.1.1.1:802/eportal/portal/login?user_account=${userAccount}&user_password=${password}`;

            // 发起 GET 请求进行登录
            fetch(loginUrl, {mode: 'no-cors'})
                .then(response => response.text())
                .then(data => {
                    // 解析返回的数据
                    const resultMatch = data.match(/"result":\s*(\d+)/);
                    if (resultMatch && resultMatch[1] !== '1') {
                        console.error('认证失败：', data);
                    } else {
                        console.info('认证成功');
                        window.location.reload()
                    }
                })
                .catch(error => console.error('登录出错：', error));
        }
    }

    var ms = function () {
        const inner_text = '登录';
        let login_button = '/html/body/div[3]/div/div[1]/a';
        let matchingElement = document.evaluate(login_button, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (matchingElement && matchingElement.innerText === inner_text) {
            console.info('跳转统一身份认证页面中...');
            window.location.href = 'http://userms.csu.edu.cn/login';
        } else {
            console.info('已登录')
        }
    }

    if (window.location.href.indexOf('ca.csu.edu.cn/authserver/login') !== -1) {
        window.addEventListener('load', ca);
    } else if (window.location.href.indexOf('mail.csu.edu.cn') !== -1) {
        window.addEventListener('load', mail);
    } else if (window.location.href.indexOf('libdb.csu.edu.cn') !== -1) {
        window.addEventListener('load', libdb);
    } else if (window.location.href.indexOf('ehall.csu.edu.cn') !== -1) {
        window.addEventListener('load', ehall);
    } else if (window.location.href.indexOf('award.csu.edu.cn') !== -1
        // && window.location.href.indexOf('/#/login') !== -1
        && window.location.href.indexOf('/#/dashboard') === -1
    ) {
        window.addEventListener('load', award);
    } else if (window.location.href.indexOf('jf.csu.edu.cn') !== -1) {
        window.addEventListener('load', zf);
    } else if (window.location.href.indexOf('libzw.csu.edu.cn') !== -1) {
        window.addEventListener('load', libzw);
    } else if (window.location.href.indexOf('pan.csu.edu.cn') !== -1 && window.location.href.indexOf('/#') !== -1) {
        window.addEventListener('load', function () {
            // 创建一个 MutationObserver 实例
            const observer = new MutationObserver(function (mutations, observer) {
                // 检查指定的登录按钮是否存在
                let xpath = '//*[@id="index-login"]/div/div[2]/div[2]/div[1]/form/div[3]/button';
                let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                if (matchingElement) {
                    // 当登录按钮出现时执行 pan 函数
                    pan(xpath);
                    // 停止观察
                    observer.disconnect();
                }
            });

            // 监听整个文档的 DOM 变化
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        });
    } else if (window.location.href.indexOf('gms.csu.edu.cn/stu/logon') !== -1) {
        window.addEventListener('load', stu_gms);
    } else if (window.location.href.indexOf('ecard.csu.edu.cn') !== -1 && window.location.href.indexOf('ca.csu.edu.cn') === -1) { // 避免授权页面含有相同的网址干扰匹配
        window.addEventListener('load', ecard);
    } else if (window.location.href.indexOf('ca.csu.edu.cn/authserver/oauth2.0/authorize') !== -1) {
        window.addEventListener('load', ca_auth);
    } else if (window.location.href.indexOf('10.1.1.1') !== -1 ||
        window.location.href.indexOf('portal.csu.edu.cn') !== -1
    ) {
        window.addEventListener('load', portal);
    } else if (window.location.href.indexOf('ms.csu.edu.cn') !== -1) {
        window.addEventListener('load', ms);
    } else {
        console.error('未知页面')
    }
})();