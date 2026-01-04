// ==UserScript==
// @name         网大知识中心exam助手
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Your assistant
// @author       xiang
// @match        *
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/493611/%E7%BD%91%E5%A4%A7%E7%9F%A5%E8%AF%86%E4%B8%AD%E5%BF%83exam%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/493611/%E7%BD%91%E5%A4%A7%E7%9F%A5%E8%AF%86%E4%B8%AD%E5%BF%83exam%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const popupHTML = `
    <div id="search-results-popup" style="
        position: fixed;
        top: 10px;
        right: 10px;
        width: 600px;
        background-color: white;
        border: 1px solid #000;
        padding: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        z-index: 9999;
        max-height: 600px;
        overflow: auto;
         margin-top: 50px;
        display: block; /* 默认显示 */
    ">
        <div style="
            text-align: right;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 5px;
        ">关闭</div>
        <select id="server-selector" style="margin-bottom: 10px;">
            <option value="select">请选择</option>
            <option value="kaoshibao">考试宝</option>
            <option value="gpt3_5">GPT-3.5</option>
            <option value="gpt4_0">GPT-4.0</option>
            <option value="gpt4o">GPT-4o</option>
            <option value="gpt4o_all">GPT-4o-All</option>
        </select>
        <div id="extra-input-container" style="margin-bottom: 5px;"></div>
        <div style="
            display: flex;
            align-items: center; /* 垂直居中 */
        ">
            <textarea id="tm-search-input" placeholder="输入搜索关键词" style="width: 480px; height: 100%;" rows="5"></textarea>
            <button id="tm-search-btn" style="height: 106px;width: 66px;margin-left: 5px;">搜索</button>
        </div>
        <div id="search-results-content">输入关键词以搜索</div>
    </div>
    <div id="popup-icon" style="
        display: none;
        position: fixed;
        top: 10px;
        right: 10px;
        width: 50px;
        height: 50px;
        background-color: #17fc03;
        z-index: 9999;
        margin-top: 50px;
        cursor: pointer;
    ">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%;">
            <circle cx="11" cy="11" r="8" stroke="white" stroke-width="2"/>
            <line x1="16" y1="16" x2="22" y2="22" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
    </div>
`;

    document.body.insertAdjacentHTML('beforeend', popupHTML);
    const searchButton = document.getElementById('tm-search-btn');
    const serverSelector = document.getElementById('server-selector');
    const extraInputContainer = document.getElementById('extra-input-container');
    const icon = document.getElementById('popup-icon');
    let moving = false;
    let xOffset = 0;
    let yOffset = 0;

    serverSelector.addEventListener('change', function () {
        if (this.value === 'gpt3_5' || this.value === 'gpt4_0' || this.value === 'gpt4o' || this.value === 'gpt4o_all') {
            const urlInputHtml = `
            <input type="text" id="gpt_url" placeholder="输入URL(例如:https://api.openai.com/v1/chat/completions)" style="width: 100%; height: 30px; margin-bottom: 5px;">
            <input type="password" id="gpt_key" placeholder="输入api_key(例如:sk-xxxxxxxx)" style="width: 100%; height: 30px; margin-bottom: 5px;">
        `;
            extraInputContainer.innerHTML = urlInputHtml;
            loadDataGpt();  // 尝试加载数据


        } else if (this.value === 'kaoshibao') {
            const urlInputHtml = `
            <input type="text" id="kaoshibao_url" placeholder="输入代理URL(留空默认http://www.wangyimusic.top:2086/kaoshibao/question)" style="width: 100%; height: 30px; margin-bottom: 5px;">
            <input type="password" id="kaoshibao_key" placeholder="输入邀请码" style="width: 100%; height: 30px; margin-bottom: 5px;">
            <input type="password" id="kaoshibao_token" placeholder="输入考试宝token(若输入则直接请求官方接口，使用代理不需要填写)" style="width: 100%; height: 30px; margin-bottom: 5px;">
        `;
            extraInputContainer.innerHTML = urlInputHtml;
            loadDataKaoshibao();  // 尝试加载数据


        } else {
            extraInputContainer.innerHTML = '';
        }
    });


    let lastClickTime = 0;

    searchButton.addEventListener('click', function () {
        const currentTime = Date.now();

        if (currentTime - lastClickTime < 5000) {
            alert("点击过于频繁，请稍后再试。");
            return;
        }

        lastClickTime = currentTime;

        const question = document.getElementById('tm-search-input').value;
        const server = serverSelector.value;

        if (server === 'kaoshibao') {
            kaoshibao("search", {question: question});
        } else if (server === 'gpt3_5') {
            const url = document.getElementById('gpt_url') ? document.getElementById('gpt_url').value : '';
            const gpt_key = document.getElementById('gpt_key') ? document.getElementById('gpt_key').value : '';
            gpt3_5("search", {question: question, url: url, gpt_key: gpt_key});
        } else if (server === 'gpt4_0') {
            const url = document.getElementById('gpt_url') ? document.getElementById('gpt_url').value : '';
            const gpt_key = document.getElementById('gpt_key') ? document.getElementById('gpt_key').value : '';
            gpt4_0("search", {question: question, url: url, gpt_key: gpt_key});
        } else if (server === 'gpt4o') {
            const url = document.getElementById('gpt_url') ? document.getElementById('gpt_url').value : '';
            const gpt_key = document.getElementById('gpt_key') ? document.getElementById('gpt_key').value : '';
            gptRequest("gpt-4o", "search", {question: question, url: url, gpt_key: gpt_key});
        } else if (server === 'gpt4o_all') {
            const url = document.getElementById('gpt_url') ? document.getElementById('gpt_url').value : '';
            const gpt_key = document.getElementById('gpt_key') ? document.getElementById('gpt_key').value : '';
            gptRequest("gpt-4o-all", "search", {question: question, url: url, gpt_key: gpt_key});
        } else {
            console.error("未知服务器类型");
        }
    });


    const closeButton = document.querySelector('#search-results-popup div');

    closeButton.addEventListener('click', function () {
        togglePopup();
    });

    icon.addEventListener('mousedown', function (e) {
        moving = true;
        xOffset = e.clientX - icon.getBoundingClientRect().left;
        yOffset = e.clientY - icon.getBoundingClientRect().top;
        icon.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function (e) {
        if (moving) {
            icon.style.top = `${e.clientY - yOffset}px`;
            icon.style.left = `${e.clientX - xOffset}px`;
        }
    });

    document.addEventListener('mouseup', function () {
        if (moving) {
            moving = false;
            icon.style.cursor = 'pointer';
        }
    });

    icon.addEventListener('click', function () {
        togglePopup();
    });

    // 追踪鼠标按下事件，记录偏移量
    document.getElementById('search-results-popup').addEventListener('mousedown', function (e) {
        moving = true;
        xOffset = e.clientX - parseInt(window.getComputedStyle(this).left);
        yOffset = e.clientY - parseInt(window.getComputedStyle(this).top);
    });

// 追踪鼠标移动事件，更新弹窗位置
    document.addEventListener('mousemove', function (e) {
        if (moving) {
            const newX = e.clientX - xOffset;
            const newY = e.clientY - yOffset;
            document.getElementById('search-results-popup').style.left = newX + 'px';
            document.getElementById('search-results-popup').style.top = newY + 'px';
        }
    });

// 停止追踪鼠标移动事件
    document.addEventListener('mouseup', function () {
        moving = false;
    });


    function togglePopup() {
        var popup = document.getElementById('search-results-popup');
        if (popup.style.display === 'none') {
            popup.style.display = 'block';
            icon.style.display = 'none';
        } else {
            popup.style.display = 'none';
            icon.style.display = 'block';
        }
    }


    // Clipboard and text selection code from the first script
    var getSelectedText = function () {
        if (window.getSelection) return window.getSelection().toString();
        if (document.getSelection) return document.getSelection().toString();
        if (document.selection) return document.selection.createRange().text;
        return "";
    };

    var bindClipboardEvent = function (clipboard) {
        clipboard.on("success", function (e) {
            $("#_copy").html("复制成功").fadeOut(1000);
            e.clearSelection();
        });
        clipboard.on("error", function (e) {
            $("#_copy").html("复制失败").fadeOut(1000);
            e.clearSelection();
        });
    };

    function unfreeze() {
        var sti = setInterval(() => {
            if (document.body) {
                clearInterval(sti);
                document.addEventListener("mouseup", function (e) {
                    if ($(e.target).is("#_copy")) return;
                    $("#_copy").remove();
                    var copyText = getSelectedText();
                    if (!copyText) return "";
                    var template = `<div id="_copy" style="cursor:pointer;border-radius:5px;padding: 5px 10px;color: #FFF;background: #0065fb;position: absolute; z-index:1000;left:${e.pageX + 30}px;top:${e.pageY}px;" data-clipboard-text="${copyText.replace(/"/g, "&quot;")}">复制</div>`;
                    $("body").append(template);
                    $("#_copy").mousedown(event => event.stopPropagation()).mouseup(event => event.stopPropagation());
                    var clipboard = new ClipboardJS("#_copy");
                    bindClipboardEvent(clipboard);
                });


            }
        }, 100);
    }

    // Special logic for exam pages
    if (window.location.hash.match("/exam/exam/answer-paper/")) {
        unsafeWindow.onblur = null;
        Object.defineProperty(unsafeWindow, 'onblur', {
            set: function (v) {
                console.log('onblur', v);
            }
        });

        unfreeze();
    }


    function kaoshibao(action, params) {
        const token = document.getElementById('kaoshibao_token') ? document.getElementById('kaoshibao_token').value : '';
        switch (action) {
            case "search":
                if (token) {
                    // 如果 token 已填写，直接调用考试宝官方接口
                    sendSearchRequest(params.question, "null", "https://www.kaoshibao.com/api/search/questions");
                } else {
                    // 如果 token 为空，调用代理接口
                    const url = document.getElementById('kaoshibao_url') ? document.getElementById('kaoshibao_url').value : '';
                    const key = document.getElementById('kaoshibao_key') ? document.getElementById('kaoshibao_key').value : '';
                    const encryptedKey = encrypt(key, Math.floor(Date.now() / 1000));
                    sendSearchRequest(params.question, encryptedKey, url);
                }
                break;
        }


        function sendSearchRequest(question, key, url) {
            if (!url || url === 'undefined') {
                url = "http://www.wangyimusic.top:2086/kaoshibao/question"
            }

            const time = Math.floor(Date.now()).toString();
            const cookie = generateUUID();
            const sign = generateSign(cookie, time, url);


            const headers = {
                "Authorization": `%22${token}=%22`,
                "Cookie": `uu=${cookie}; token=${token}`,
                "Sign": sign,
                "TimeStamp": time,
                "Content-Type": "application/json",
                "X-Encrypted-Key": key
            };

            // console.log(headers);
            const data = JSON.stringify({
                keyword: question,
                page: 1,
                paperid: "",
                qtype: "",
                size: "15"
            });

            document.getElementById('search-results-content').innerHTML = '正在请求考试宝...';

            saveDataKaoshibao()

            // console.log(data)

            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: headers,
                data: data,
                onload: function showResults(response) {
                    // console.log('请求成功:', response.responseText);
                    const result = JSON.parse(response.responseText);
                    if (result.code !== "200") {
                        console.error('请求失败:', result.msg);
                        document.getElementById('search-results-content').innerHTML = result.msg;
                        document.getElementById('search-results-popup').style.display = 'block';
                        return;
                    }
                    if (result.data.rows === null || result.data.rows.length === 0) {
                        document.getElementById('search-results-content').innerHTML = "未找到相关问题";
                        document.getElementById('search-results-popup').style.display = 'block';
                        return;
                    }
                    const questions = result.data.rows;

                    let content = questions.map(question => {
                        let options = [];
                        try {
                            options = JSON.parse(question.options);
                        } catch (e) {
                            console.error('解析选项失败:', question.options);
                        }
                        const optionsHtml = options.map(option => {
                            return `<div>${option.Key}: ${option.Value}</div>`;
                        }).join('');

                        return `<div>
            <h4>问题: ${question.question}</h4>
            <div style="margin-left: 20px;">${optionsHtml}</div>
            <p>答案: ${question.answer}</p>
        </div>`;
                    }).join('');

                    // 将内容插入到弹窗容器中，并展示弹窗
                    document.getElementById('search-results-content').innerHTML = content;
                    document.getElementById('search-results-popup').style.display = 'block';
                }
                ,

                onerror: function (error) {
                    console.error('请求失败:', error);
                }
            });
        }

        function encrypt(data, timestamp) {
            const key = CryptoJS.enc.Utf8.parse("aljasgfguihihuoa");  // 确保密钥长度正确
            const dataWithTs = data + String(timestamp).substring(0, 10);

            // 计算需要填充的空格数量
            const paddingLength = (16 - (dataWithTs.length % 16)) % 16;

            // 手动添加空格进行填充
            let paddedDataWithTs = dataWithTs;
            for (let i = 0; i < paddingLength; i++) {
                paddedDataWithTs += " ";
            }

            const iv = CryptoJS.lib.WordArray.random(16);  // 生成16字节的随机IV

            // 配置加密参数
            const options = {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.NoPadding  // 设置为NoPadding
            };

            // 执行加密操作
            const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(paddedDataWithTs), key, options);
            const ivAndEncryptedData = iv.toString(CryptoJS.enc.Hex) + encrypted.ciphertext.toString(CryptoJS.enc.Hex);

            // 对结果进行Base64编码
            return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(ivAndEncryptedData));
        }

        function generateUUID() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }

        function generateSign(cookie, time, url) {
            const secret = "12b6bb84e093532fb72b4d65fec3f00b";
            const endpoint = url.split('/api')[1];
            const signInput = secret + cookie + endpoint + time + secret;
            return md5Hex(signInput);
        }


    }

    function gpt3_5(action, params) {


        if (action === "search") {
            if (!params.url || !params.gpt_key) {
                params.url = "https://api.gptapi.us/v1/chat/completions";
                let gpt_key = "tl.X7UVVkWGrBEkqHWB6dF8755g291d5437:9EbE6C36587Gc16";
                params.gpt_key = a(gpt_key);
            }
            const payload = JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {role: "user", content: params.question}
                ],
                temperature: 0.7
            });

            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${params.gpt_key}`
            };

            // const apiUrl = "https://api.gptapi.us/v1/chat/completions";
            const apiUrl = params.url;
            document.getElementById('search-results-content').innerHTML = '正在请求GPT-3.5...';
            document.getElementById('search-results-popup').style.display = 'block';
            saveDataGpt(); // 保存数据到 localStorage

            GM_xmlhttpRequest({
                method: "POST",
                url: apiUrl,
                headers: headers,
                data: payload,
                onload: function (response) {
                    const result = JSON.parse(response.responseText);
                    if (result.choices && result.choices.length > 0) {
                        const answer = result.choices[0].message.content;
                        document.getElementById('search-results-content').innerHTML = answer;
                        document.getElementById('search-results-popup').style.display = 'block';
                    } else {
                        console.error('GPT-3.5 未返回有效答案');
                        document.getElementById('search-results-content').innerHTML = '未能获取有效回答';
                    }
                },
                onerror: function (error) {
                    console.error('GPT-3.5 请求失败:', error);
                    document.getElementById('search-results-content').innerHTML = '请求失败';
                }
            });


            function a(gpt_key) {
                let decryptedKey = '';
                const offset = 1;
                for (let i = 0; i < gpt_key.length; i++) {
                    const decryptedCharCode = gpt_key.charCodeAt(i) - offset;
                    decryptedKey += String.fromCharCode(decryptedCharCode);
                }
                return decryptedKey;
            }
        }
    }

    function gpt4_0(action, params) {


        if (action === "search") {
            const payload = JSON.stringify({
                model: "gpt-4-turbo",
                messages: [
                    {role: "user", content: params.question}
                ],
                temperature: 0.7
            });

            const headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + params.gpt_key
            };

            // const apiUrl = "https://api.gptapi.us/v1/chat/completions";
            const apiUrl = params.url;
            document.getElementById('search-results-content').innerHTML = '正在请求GPT-4.0...';
            document.getElementById('search-results-popup').style.display = 'block';
            saveDataGpt(); // 保存数据到 localStorage

            GM_xmlhttpRequest({
                method: "POST",
                url: apiUrl,
                headers: headers,
                data: payload,
                onload: function (response) {
                    const result = JSON.parse(response.responseText);
                    if (result.choices && result.choices.length > 0) {
                        const answer = result.choices[0].message.content;
                        document.getElementById('search-results-content').innerHTML = answer;
                        document.getElementById('search-results-popup').style.display = 'block';
                    } else {
                        console.error('GPT-4.0 未返回有效答案');
                        document.getElementById('search-results-content').innerHTML = '未能获取有效回答';
                    }
                },
                onerror: function (error) {
                    console.error('GPT-4.0 请求失败:', error);
                    document.getElementById('search-results-content').innerHTML = '请求失败';
                }
            });
        }
    }

    function gptRequest(modelName, action, params) {
        if (action === "search") {
            if (!params.url || !params.gpt_key) {
                params.url = "https://api.bltcy.ai/v1/chat/completions";
                let gpt_key = "um/pDx[N79GPN3NL4lp938d;6F4CdCh6g93:56hDd62F7:f3f23";
                params.gpt_key = a(gpt_key);
            }

            if (modelName === "gpt-4o-all") {
                params.question = "如果能联网，请联网搜索答案。" + params.question;
            }

            params.question = "请尽量精简的首先给出答案，如果不知道请直接回答不知道。" + params.question;

            const payload = JSON.stringify({
                model: modelName,  // 使用传入的模型名称
                messages: [{role: "user", content: params.question}],
                temperature: 0.7
            });

            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${params.gpt_key}`
            };

            const apiUrl = params.url;
            document.getElementById('search-results-content').innerHTML = `正在请求${modelName}...`;
            document.getElementById('search-results-popup').style.display = 'block';
            saveDataGpt();

            GM_xmlhttpRequest({
                method: "POST",
                url: apiUrl,
                headers: headers,
                data: payload,
                onload: function (response) {
                    const result = JSON.parse(response.responseText);
                    if (result.choices && result.choices.length > 0) {
                        const answer = result.choices[0].message.content;
                        document.getElementById('search-results-content').innerHTML = answer;
                        document.getElementById('search-results-popup').style.display = 'block';
                    } else {
                        console.error(`${modelName} 未返回有效答案`);
                        document.getElementById('search-results-content').innerHTML = '未能获取有效回答';
                    }
                },
                onerror: function (error) {
                    console.error(`${modelName} 请求失败:`, error);
                    document.getElementById('search-results-content').innerHTML = '请求失败';
                }
            });

            function a(gpt_key) {
                let decryptedKey = '';
                const offset = 2;
                for (let i = 0; i < gpt_key.length; i++) {
                    const decryptedCharCode = gpt_key.charCodeAt(i) - offset;
                    decryptedKey += String.fromCharCode(decryptedCharCode);
                }
                return decryptedKey;
            }
        }
    }


    function saveDataKaoshibao() {
        const url = document.getElementById('kaoshibao_url').value;
        const kaoshibao_key = document.getElementById('kaoshibao_key').value;
        const kaoshibao_token = document.getElementById('kaoshibao_token').value;
        localStorage.setItem('kaoshibao_url', url);
        localStorage.setItem('kaoshibao_key', kaoshibao_key);
        localStorage.setItem('kaoshibao_token', kaoshibao_token);
    }

// 保存数据到 localStorage
    function saveDataGpt() {
        const url = document.getElementById('gpt_url').value;
        const gpt_key = document.getElementById('gpt_key').value;
        localStorage.setItem('gpt_url', url);
        localStorage.setItem('gpt_key', gpt_key);
    }

// 从 localStorage 加载数据
    function loadDataGpt() {
        const url = localStorage.getItem('gpt_url');
        const gpt_key = localStorage.getItem('gpt_key');
        if (url && gpt_key) {
            document.getElementById('gpt_url').value = url;
            document.getElementById('gpt_key').value = gpt_key;
        }
    }

    function loadDataKaoshibao() {
        const url = localStorage.getItem('kaoshibao_url');
        const kaoshibao_key = localStorage.getItem('kaoshibao_key');
        const kaoshibao_token = localStorage.getItem('kaoshibao_token');
        if (url || kaoshibao_key || kaoshibao_token) {
            document.getElementById('kaoshibao_url').value = url;
            document.getElementById('kaoshibao_key').value = kaoshibao_key;
            document.getElementById('kaoshibao_token').value = kaoshibao_token;
        }

    }


// 页面加载时尝试加载数据
    window.addEventListener('loadGpt', loadDataGpt);
    window.addEventListener('loadKaoshibao', loadDataKaoshibao);

// 辅助变量和函数定义
    const HEX_CHARS = '0123456789abcdef'.split('');
    const EXTRA = [128, 32768, 8388608, -2147483648,];
    const SHIFT = [0, 8, 16, 24];
    const ARRAY_BUFFER = true;

    function Md5(append) {
        var buffer = new ArrayBuffer(68);
        var buffer8 = new Uint8Array(buffer);
        var blocks = new Uint32Array(buffer);
        if (true)
            blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0,
                this.blocks = blocks,
                this.buffer8 = buffer8;
        else if (ARRAY_BUFFER) {
            var t = new ArrayBuffer(68);
            this.buffer8 = new Uint8Array(t),
                this.blocks = new Uint32Array(t)
        } else
            this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0,
            this.finalized = this.hashed = !1,
            this.first = !0
    }

    Md5.prototype.update = function (e) {
        if (!this.finalized) {
            var t, n = typeof e;
            if ("string" !== n) {
                if ("object" !== n)
                    ;
                if (null === e)
                    ;
                if (ARRAY_BUFFER && e.constructor === ArrayBuffer)
                    e = new Uint8Array(e);
                else if (!(Array.isArray(e) || ARRAY_BUFFER && ArrayBuffer.isView(e)))
                    throw ERROR;
                t = !0
            }
            for (var code, i, r = 0, o = e.length, l = this.blocks, c = this.buffer8; r < o;) {
                if (this.hashed && (this.hashed = !1,
                    l[0] = l[16],
                    l[16] = l[1] = l[2] = l[3] = l[4] = l[5] = l[6] = l[7] = l[8] = l[9] = l[10] = l[11] = l[12] = l[13] = l[14] = l[15] = 0),
                    t)
                    if (ARRAY_BUFFER)
                        for (i = this.start; r < o && i < 64; ++r)
                            c[i++] = e[r];
                    else
                        for (i = this.start; r < o && i < 64; ++r)
                            l[i >> 2] |= e[r] << SHIFT[3 & i++];
                else if (ARRAY_BUFFER)
                    for (i = this.start; r < o && i < 64; ++r)
                        (code = e.charCodeAt(r)) < 128 ? c[i++] = code : code < 2048 ? (c[i++] = 192 | code >> 6,
                            c[i++] = 128 | 63 & code) : code < 55296 || code >= 57344 ? (c[i++] = 224 | code >> 12,
                            c[i++] = 128 | code >> 6 & 63,
                            c[i++] = 128 | 63 & code) : (code = 65536 + ((1023 & code) << 10 | 1023 & e.charCodeAt(++r)),
                            c[i++] = 240 | code >> 18,
                            c[i++] = 128 | code >> 12 & 63,
                            c[i++] = 128 | code >> 6 & 63,
                            c[i++] = 128 | 63 & code);
                else
                    for (i = this.start; r < o && i < 64; ++r)
                        (code = e.charCodeAt(r)) < 128 ? l[i >> 2] |= code << SHIFT[3 & i++] : code < 2048 ? (l[i >> 2] |= (192 | code >> 6) << SHIFT[3 & i++],
                            l[i >> 2] |= (128 | 63 & code) << SHIFT[3 & i++]) : code < 55296 || code >= 57344 ? (l[i >> 2] |= (224 | code >> 12) << SHIFT[3 & i++],
                            l[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[3 & i++],
                            l[i >> 2] |= (128 | 63 & code) << SHIFT[3 & i++]) : (code = 65536 + ((1023 & code) << 10 | 1023 & e.charCodeAt(++r)),
                            l[i >> 2] |= (240 | code >> 18) << SHIFT[3 & i++],
                            l[i >> 2] |= (128 | code >> 12 & 63) << SHIFT[3 & i++],
                            l[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[3 & i++],
                            l[i >> 2] |= (128 | 63 & code) << SHIFT[3 & i++]);
                this.lastByteIndex = i,
                    this.bytes += i - this.start,
                    i >= 64 ? (this.start = i - 64,
                        this.hash(),
                        this.hashed = !0) : this.start = i
            }
            return this.bytes > 4294967295 && (this.hBytes += this.bytes / 4294967296 << 0,
                this.bytes = this.bytes % 4294967296),
                this
        }
    }


    Md5.prototype.finalize = function () {
        if (!this.finalized) {
            this.finalized = !0;
            var e = this.blocks
                , i = this.lastByteIndex;
            e[i >> 2] |= EXTRA[3 & i],
            i >= 56 && (this.hashed || this.hash(),
                e[0] = e[16],
                e[16] = e[1] = e[2] = e[3] = e[4] = e[5] = e[6] = e[7] = e[8] = e[9] = e[10] = e[11] = e[12] = e[13] = e[14] = e[15] = 0),
                e[14] = this.bytes << 3,
                e[15] = this.hBytes << 3 | this.bytes >>> 29,
                this.hash()
        }
    }

    Md5.prototype.hash = function () {
        var a, b, e, t, n, r, o = this.blocks;
        this.first ? b = ((b = ((a = ((a = o[0] - 680876937) << 7 | a >>> 25) - 271733879 << 0) ^ (e = ((e = (-271733879 ^ (t = ((t = (-1732584194 ^ 2004318071 & a) + o[1] - 117830708) << 12 | t >>> 20) + a << 0) & (-271733879 ^ a)) + o[2] - 1126478375) << 17 | e >>> 15) + t << 0) & (t ^ a)) + o[3] - 1316259209) << 22 | b >>> 10) + e << 0 : (a = this.h0,
            b = this.h1,
            e = this.h2,
            b = ((b += ((a = ((a += ((t = this.h3) ^ b & (e ^ t)) + o[0] - 680876936) << 7 | a >>> 25) + b << 0) ^ (e = ((e += (b ^ (t = ((t += (e ^ a & (b ^ e)) + o[1] - 389564586) << 12 | t >>> 20) + a << 0) & (a ^ b)) + o[2] + 606105819) << 17 | e >>> 15) + t << 0) & (t ^ a)) + o[3] - 1044525330) << 22 | b >>> 10) + e << 0),
            b = ((b += ((a = ((a += (t ^ b & (e ^ t)) + o[4] - 176418897) << 7 | a >>> 25) + b << 0) ^ (e = ((e += (b ^ (t = ((t += (e ^ a & (b ^ e)) + o[5] + 1200080426) << 12 | t >>> 20) + a << 0) & (a ^ b)) + o[6] - 1473231341) << 17 | e >>> 15) + t << 0) & (t ^ a)) + o[7] - 45705983) << 22 | b >>> 10) + e << 0,
            b = ((b += ((a = ((a += (t ^ b & (e ^ t)) + o[8] + 1770035416) << 7 | a >>> 25) + b << 0) ^ (e = ((e += (b ^ (t = ((t += (e ^ a & (b ^ e)) + o[9] - 1958414417) << 12 | t >>> 20) + a << 0) & (a ^ b)) + o[10] - 42063) << 17 | e >>> 15) + t << 0) & (t ^ a)) + o[11] - 1990404162) << 22 | b >>> 10) + e << 0,
            b = ((b += ((a = ((a += (t ^ b & (e ^ t)) + o[12] + 1804603682) << 7 | a >>> 25) + b << 0) ^ (e = ((e += (b ^ (t = ((t += (e ^ a & (b ^ e)) + o[13] - 40341101) << 12 | t >>> 20) + a << 0) & (a ^ b)) + o[14] - 1502002290) << 17 | e >>> 15) + t << 0) & (t ^ a)) + o[15] + 1236535329) << 22 | b >>> 10) + e << 0,
            b = ((b += ((t = ((t += (b ^ e & ((a = ((a += (e ^ t & (b ^ e)) + o[1] - 165796510) << 5 | a >>> 27) + b << 0) ^ b)) + o[6] - 1069501632) << 9 | t >>> 23) + a << 0) ^ a & ((e = ((e += (a ^ b & (t ^ a)) + o[11] + 643717713) << 14 | e >>> 18) + t << 0) ^ t)) + o[0] - 373897302) << 20 | b >>> 12) + e << 0,
            b = ((b += ((t = ((t += (b ^ e & ((a = ((a += (e ^ t & (b ^ e)) + o[5] - 701558691) << 5 | a >>> 27) + b << 0) ^ b)) + o[10] + 38016083) << 9 | t >>> 23) + a << 0) ^ a & ((e = ((e += (a ^ b & (t ^ a)) + o[15] - 660478335) << 14 | e >>> 18) + t << 0) ^ t)) + o[4] - 405537848) << 20 | b >>> 12) + e << 0,
            b = ((b += ((t = ((t += (b ^ e & ((a = ((a += (e ^ t & (b ^ e)) + o[9] + 568446438) << 5 | a >>> 27) + b << 0) ^ b)) + o[14] - 1019803690) << 9 | t >>> 23) + a << 0) ^ a & ((e = ((e += (a ^ b & (t ^ a)) + o[3] - 187363961) << 14 | e >>> 18) + t << 0) ^ t)) + o[8] + 1163531501) << 20 | b >>> 12) + e << 0,
            b = ((b += ((t = ((t += (b ^ e & ((a = ((a += (e ^ t & (b ^ e)) + o[13] - 1444681467) << 5 | a >>> 27) + b << 0) ^ b)) + o[2] - 51403784) << 9 | t >>> 23) + a << 0) ^ a & ((e = ((e += (a ^ b & (t ^ a)) + o[7] + 1735328473) << 14 | e >>> 18) + t << 0) ^ t)) + o[12] - 1926607734) << 20 | b >>> 12) + e << 0,
            b = ((b += ((r = (t = ((t += ((n = b ^ e) ^ (a = ((a += (n ^ t) + o[5] - 378558) << 4 | a >>> 28) + b << 0)) + o[8] - 2022574463) << 11 | t >>> 21) + a << 0) ^ a) ^ (e = ((e += (r ^ b) + o[11] + 1839030562) << 16 | e >>> 16) + t << 0)) + o[14] - 35309556) << 23 | b >>> 9) + e << 0,
            b = ((b += ((r = (t = ((t += ((n = b ^ e) ^ (a = ((a += (n ^ t) + o[1] - 1530992060) << 4 | a >>> 28) + b << 0)) + o[4] + 1272893353) << 11 | t >>> 21) + a << 0) ^ a) ^ (e = ((e += (r ^ b) + o[7] - 155497632) << 16 | e >>> 16) + t << 0)) + o[10] - 1094730640) << 23 | b >>> 9) + e << 0,
            b = ((b += ((r = (t = ((t += ((n = b ^ e) ^ (a = ((a += (n ^ t) + o[13] + 681279174) << 4 | a >>> 28) + b << 0)) + o[0] - 358537222) << 11 | t >>> 21) + a << 0) ^ a) ^ (e = ((e += (r ^ b) + o[3] - 722521979) << 16 | e >>> 16) + t << 0)) + o[6] + 76029189) << 23 | b >>> 9) + e << 0,
            b = ((b += ((r = (t = ((t += ((n = b ^ e) ^ (a = ((a += (n ^ t) + o[9] - 640364487) << 4 | a >>> 28) + b << 0)) + o[12] - 421815835) << 11 | t >>> 21) + a << 0) ^ a) ^ (e = ((e += (r ^ b) + o[15] + 530742520) << 16 | e >>> 16) + t << 0)) + o[2] - 995338651) << 23 | b >>> 9) + e << 0,
            b = ((b += ((t = ((t += (b ^ ((a = ((a += (e ^ (b | ~t)) + o[0] - 198630844) << 6 | a >>> 26) + b << 0) | ~e)) + o[7] + 1126891415) << 10 | t >>> 22) + a << 0) ^ ((e = ((e += (a ^ (t | ~b)) + o[14] - 1416354905) << 15 | e >>> 17) + t << 0) | ~a)) + o[5] - 57434055) << 21 | b >>> 11) + e << 0,
            b = ((b += ((t = ((t += (b ^ ((a = ((a += (e ^ (b | ~t)) + o[12] + 1700485571) << 6 | a >>> 26) + b << 0) | ~e)) + o[3] - 1894986606) << 10 | t >>> 22) + a << 0) ^ ((e = ((e += (a ^ (t | ~b)) + o[10] - 1051523) << 15 | e >>> 17) + t << 0) | ~a)) + o[1] - 2054922799) << 21 | b >>> 11) + e << 0,
            b = ((b += ((t = ((t += (b ^ ((a = ((a += (e ^ (b | ~t)) + o[8] + 1873313359) << 6 | a >>> 26) + b << 0) | ~e)) + o[15] - 30611744) << 10 | t >>> 22) + a << 0) ^ ((e = ((e += (a ^ (t | ~b)) + o[6] - 1560198380) << 15 | e >>> 17) + t << 0) | ~a)) + o[13] + 1309151649) << 21 | b >>> 11) + e << 0,
            b = ((b += ((t = ((t += (b ^ ((a = ((a += (e ^ (b | ~t)) + o[4] - 145523070) << 6 | a >>> 26) + b << 0) | ~e)) + o[11] - 1120210379) << 10 | t >>> 22) + a << 0) ^ ((e = ((e += (a ^ (t | ~b)) + o[2] + 718787259) << 15 | e >>> 17) + t << 0) | ~a)) + o[9] - 343485551) << 21 | b >>> 11) + e << 0,
            this.first ? (this.h0 = a + 1732584193 << 0,
                this.h1 = b - 271733879 << 0,
                this.h2 = e - 1732584194 << 0,
                this.h3 = t + 271733878 << 0,
                this.first = !1) : (this.h0 = this.h0 + a << 0,
                this.h1 = this.h1 + b << 0,
                this.h2 = this.h2 + e << 0,
                this.h3 = this.h3 + t << 0)
    }

    Md5.prototype.hex = function () {
        this.finalize();
        var e = this.h0
            , h1 = this.h1
            , h2 = this.h2
            , h3 = this.h3;
        return HEX_CHARS[e >> 4 & 15] + HEX_CHARS[15 & e] + HEX_CHARS[e >> 12 & 15] + HEX_CHARS[e >> 8 & 15] + HEX_CHARS[e >> 20 & 15] + HEX_CHARS[e >> 16 & 15] + HEX_CHARS[e >> 28 & 15] + HEX_CHARS[e >> 24 & 15] + HEX_CHARS[h1 >> 4 & 15] + HEX_CHARS[15 & h1] + HEX_CHARS[h1 >> 12 & 15] + HEX_CHARS[h1 >> 8 & 15] + HEX_CHARS[h1 >> 20 & 15] + HEX_CHARS[h1 >> 16 & 15] + HEX_CHARS[h1 >> 28 & 15] + HEX_CHARS[h1 >> 24 & 15] + HEX_CHARS[h2 >> 4 & 15] + HEX_CHARS[15 & h2] + HEX_CHARS[h2 >> 12 & 15] + HEX_CHARS[h2 >> 8 & 15] + HEX_CHARS[h2 >> 20 & 15] + HEX_CHARS[h2 >> 16 & 15] + HEX_CHARS[h2 >> 28 & 15] + HEX_CHARS[h2 >> 24 & 15] + HEX_CHARS[h3 >> 4 & 15] + HEX_CHARS[15 & h3] + HEX_CHARS[h3 >> 12 & 15] + HEX_CHARS[h3 >> 8 & 15] + HEX_CHARS[h3 >> 20 & 15] + HEX_CHARS[h3 >> 16 & 15] + HEX_CHARS[h3 >> 28 & 15] + HEX_CHARS[h3 >> 24 & 15]
    }

    function md5Hex(msg) {
        const md5 = new Md5();
        md5.update(msg);
        return md5.hex();
    }


})
();
