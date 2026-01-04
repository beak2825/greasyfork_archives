// ==UserScript==
// @name         LINE購物app簽到集章
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  LINE購物app簽到
// @author       fase
// @match        https://buy.line.me/account
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idv.tw
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467770/LINE%E8%B3%BC%E7%89%A9app%E7%B0%BD%E5%88%B0%E9%9B%86%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/467770/LINE%E8%B3%BC%E7%89%A9app%E7%B0%BD%E5%88%B0%E9%9B%86%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '50%';
    button.style.zIndex = '9999';
    button.textContent = '執行簽到';

    GM_addStyle(`
        button {
            background-color: #00008b;
            color: #ffffff;
            padding: 10px 20px;
            font-size: 16px;
        }
    `);

    // 將按鈕添加到網頁的body元素中
    document.body.appendChild(button);

    var jsondata = JSON.stringify({
      "query" : "mutation {\n  completeSignInEvent {\n    success\n    errorCode\n    __typename\n  }\n}\n",
      "variables" : {

      },
      "operationName" : null
    });
    button.addEventListener('click', function() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://buy.line.me/api/graphql', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
        xhr.setRequestHeader('Accept-Encoding', 'gzip, deflate, br');
        xhr.setRequestHeader('Origin', 'https://buy.line.me');
        xhr.setRequestHeader('Accept-Language', 'zh-TW,zh-Hant;q=0.9');
        xhr.setRequestHeader('Referer', 'https://buy.line.me/account');
        xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Mobile LINE/TW_Shopping_App_iOS');

        // 監聽請求完成事件
        xhr.onload = function() {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.data.completeSignInEvent.success === true) {
                   button.textContent = '執行成功';
                } else {
                   button.textContent = '有錯誤';
                }
            } else {
               button.textContent = '傳送失敗';
            }
        };

        // 發送POST請求
        xhr.send(jsondata);
    });
})();