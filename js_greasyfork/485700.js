// ==UserScript==
// @name         慎独
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  君子慎其独，自动展示一言的先哲语句帮助你重新找回理智,需要自己修改@match 规则
// @author       lover
// @match        *://*/*
// @grant        GM_addStyle
// @grant		 GM_addElement
// @grant		 GM_xmlhttpRequest
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/485700/%E6%85%8E%E7%8B%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/485700/%E6%85%8E%E7%8B%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const overlayCSS = `
        #outer-wrapper {
            filter: blur(25px);
            -webkit-filter: blur(25px); /* For Safari browser compatibility */
        }
    `;
    // 创建一个新的外层 div
    const outerDiv = document.createElement('div');
    outerDiv.id = 'outer-wrapper'; // 添加 id 以便于后续操作或样式设置
    // 获取 body 元素
    const body = document.body;
    // 将 body 中的所有子节点移到新创建的 div 中
    while (body.firstChild) {
        outerDiv.appendChild(body.firstChild);
    }
    // 将新创建的 div 插入到 body 的开始位置
    body.insertBefore(outerDiv, body.firstChild);
    // Add the custom style
    GM_addStyle(overlayCSS);

    const hitokotoCss = `
        .hitokoto-fullpage {
            position: fixed;
            color: #2F4976;
            z-index: 1000;
            top:50%;
            left:50%;
            transform:translate(-50%, -50%) !important;
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, Arial, sans-serif;
        }
        @media screen and (min-width: 600px) {
            .hitokoto-fullpage {
                width: 55%;
            }
        }
        .hitokoto-fullpage .bracket.left {
            position: absolute;
            left: 0;
            top: 0;
        }
        .hitokoto-fullpage .bracket.right {
            position: absolute;
            right: 0;
            bottom: 64px;
        }
        .hitokoto-fullpage .bracket {
            font-size: 30px;
        }
        .hitokoto-fullpage .word {
            font-size: 32.2px;
            text-align: center;
            line-height: 50px;
            word-break: normal;
            margin: 0;
            padding: 15px 50px;
        }
        .hitokoto-fullpage .author {
            font-size: 20px;
            color: #2F497680;
            float: right;
            margin-top: 40px;
        }
    `;
    const hitokotoElement = document.createElement('div');
    hitokotoElement.innerHTML = `
        <div id="hitokoto" class="hitokoto-fullpage bounce animated">
            <div class="bracket left">『</div>
            <div class="word" id="hitokoto_text">
                <a href='#' id="hitokoto_link">:D 获取中...</a>
            </div>
            <div class="bracket right">』</div>
            <div class="author" id="hitokoto_author"></div>
        </div>
    `;
    document.body.append(hitokotoElement);
    GM_addStyle(hitokotoCss);

    getInfo();
    function getInfo() {
        GM_xmlhttpRequest({
            method: "post",
            url: "https://v1.hitokoto.cn?c=k",
            headers: {
                "Content-Type": "application/json"
            },
            // data:JSON.stringify({c:'k' }),
            onload: function(response) {
                console.log(response);
                if (response.readyState === 4 && response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const hitokoto = data.hitokoto; // Assuming the API returns a JSON object with a "hitokoto" key

                        const hitokotoFrom = document.querySelector('#hitokoto_author');
                        hitokotoFrom.innerHTML = '—— ' + data.from_who + '「' + data.from + '」'
                        const hitokotoLink = document.querySelector('#hitokoto_link');
                        hitokotoLink.innerText = data.hitokoto;
                        hitokotoLink.href = `https://hitokoto.cn/?uuid=${data.uuid}`
                        setTimeout(() => {
                            getInfo()
                        }, 10000);

                    } catch (error) {
                        console.error('Error parsing API response:', error);
                    }
                } else {
                    console.error('Error fetching hitokoto:', response.statusText);
                }
            },
            onerror: function(response) {
                console.error('There was an error making the request:', response);
            }
        });
    }

})();