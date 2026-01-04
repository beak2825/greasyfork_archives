// ==UserScript==
// @name         Block_Zhihu_Users
// @namespace    your-namespace
// @version      1.1
// @description  Block users on a website by clicking a button
// @match        https://www.zhihu.com/question/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471694/Block_Zhihu_Users.user.js
// @updateURL https://update.greasyfork.org/scripts/471694/Block_Zhihu_Users.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let executedUrls = [];

    async function blockUsers() {
        console.log('blockUsers...')

        let arr = document.querySelectorAll("div.ContentItem-meta > div.AuthorInfo.AnswerItem-authorInfo.AnswerItem-authorInfo--related")
            console.log(`加载完成...arr:${arr.length}`)
            let k = 0;
        let count = 0;
        let index = 0;
        for (let a of arr) {
            index += 1;

            let userUrl = null;
            try {
                let crr = a.querySelectorAll("a");
                if (crr.length == 0) {
                    k++;
                    a.parentElement.parentElement.parentElement.remove();
                } else {
                    userUrl = crr[0].href;
                }
            } catch (e) {
                //a.remove();
                continue;
            }

            let end = index >= arr.length - k - 3;

            let urlToken = '';
            try {
                urlToken = userUrl.substring(userUrl.lastIndexOf('/') + 1);
            } catch (e) {
                console.log(`err:url:${userUrl}`);
                continue;
            }

            if (executedUrls.includes(urlToken)) {
                //console.log(`${index}/${arr.length}:Skipping ${userUrl} as it has already been blocked`);
                console.log(`${index}/${arr.length}`);
                try {
                    let b = a.parentElement.parentElement.parentElement.parentElement;
                    if (end) {
                        b.style = 'display:none';
                    } else {
                        b.remove();
                    }

                } catch (e) {}
                continue;
            }

            // 检查是否已执行过该 urlToken
            if (localStorage.getItem(urlToken)) {
                //console.log(`${index}/${arr.length}:Skipping ${userUrl} as it has already been blocked`);
                console.log(`${index}/${arr.length}`);
                try {
                    let b = a.parentElement.parentElement.parentElement.parentElement;
                    if (end) {
                        b.style = 'display:none';
                    } else {
                        b.remove();
                    }
                } catch (e) {}
                continue;
            }

            console.log(`${index}:${count}/${arr.length},屏蔽用户:${userUrl}`);
            const response = await fetch(`/api/v4/members/${urlToken}/actions/block`, {
                method: 'POST',
                headers: new Headers({
                    'x-xsrftoken': document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)[0],
                }),
            });
            try {
                let b = a.parentElement.parentElement.parentElement.parentElement;
                if (end) {
                    b.style = 'display:none';
                } else {
                    b.remove();
                }
            } catch (e) {}
            count += 1;
            executedUrls.push(urlToken);
            localStorage.setItem(urlToken, 'blocked'); // 将已执行过的 urlToken 存入 localStorage
            await sleep(200);
        }

        //debugger
        if (arr.length === 0 || executedUrls.length === 0 || executedUrls.length === arr.length) {
            console.log('No more data or all urlTokens have been blocked. Simulating page scroll to load more data...');
            showMessage(`Block ${count} users,total:${executedUrls.length}! \n No more data or all urlTokens have been blocked. Click button or page scroll to load more data...`);
        }

        // 移动鼠标到最下面
        //window.scrollTo(0, document.body.scrollHeight);
        window.focus(); // 聚焦到当前页面
        for (let i = 0; i < 5; i++) {
            const event = new KeyboardEvent('keydown', {
                key: 'G',
                code: 'KeyG',
                shiftKey: true
            });
            document.dispatchEvent(event);
            await sleep(10);

        }
    }

    // 创建消息框元素
    function createAlertElement() {
        var alertElement = document.createElement('div');
        alertElement.setAttribute('id', 'alert-box');
        alertElement.style.display = 'none';

        GM_addStyle(`
    #alert-box {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      padding: 10px;
      background-color: #f44336;
      color: white;
      font-size: 18px;
      text-align: center;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    #alert-box.show {
      opacity: 1;
    }
  `);

        document.body.appendChild(alertElement);
        return alertElement;
    }

    // 弹出消息框
    function showMessage(message, timeout) {
        var alertElement = document.getElementById('alert-box') || createAlertElement();
        alertElement.textContent = message;
        alertElement.style.display = 'block';
        alertElement.classList.add('show');
        setTimeout(function () {
            alertElement.classList.remove('show');
            setTimeout(function () {
                alertElement.style.display = 'none';
            }, 300);
        }, timeout || 1000);
    }

    // 创建悬浮按钮元素
    const button = document.createElement('button');
    button.textContent = '屏蔽用户';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 20px';
    button.style.border = 'none';
    button.style.borderRadius = '10px';
    button.style.color = '#fff';
    button.style.fontSize = '16px';
    button.style.fontWeight = 'bold';
    button.style.background = 'red';
    button.style.cursor = 'pointer';

    // 添加点击事件监听器
    button.addEventListener('click', async() => {
        await blockUsers();
    });

    // 将按钮添加到页面中
    document.body.appendChild(button);

    document.addEventListener('keydown', async function (event) {
        if (event.key === 'b' || event.key === 'B') {
            await blockUsers();
        }
    });

})();
