
// ==UserScript==
// @name         Wordcat Downloader
// @namespace    http://tampermonkey.net/
// @version      1.10.0
// @description  可以对PDF进行解析成word。【❤️ 文档自动解析，体会拥有VIP的感觉❤️，适配PC+移动 】
// @author       xsunvip@qq.com
// @match        *://*.docin.com/p-*
// @match        *://docimg1.docin.com/?wk=true
// @match        *://ishare.iask.sina.com.cn/f/*
// @match        *://ishare.iask.com/f/*
// @match        *://swf.ishare.down.sina.com.cn/?path=*
// @match        *://swf.ishare.down.sina.com.cn/?wk=true
// @match        *://www.deliwenku.com/p-*
// @match        *://file.deliwenku.com/?num=*
// @match        *://file3.deliwenku.com/?num=*
// @match        *://www.doc88.com/p-*
// @match        *://www.360doc.com/content/*
// @match        *://doc.mbalib.com/view/*
// @match        *://www.dugen.com/p-*
// @match        *://max.book118.com/html/*
// @match        *://openapi.book118.com/?*
// @match        *://view-cache.book118.com/pptView.html?*
// @match        *://*.book118.com/?readpage=*
// @match        *://c.gb688.cn/bzgk/gb/showGb?*
// @match        *://www.safewk.com/p-*
// @match        *://www.renrendoc.com/paper/*
// @match        *://www.renrendoc.com/p-*
// @match        *://www.yunzhan365.com/basic/*
// @match        *://book.yunzhan365.com/*index.html*
// @match        *://wenku.so.com/d/*
// @match        *://jg.class.com.cn/cms/resourcedetail.htm?contentUid=*
// @match        *://preview.imm.aliyuncs.com/index.html?url=*/jgjyw/*
// @match        *://www.wenkub.com/p-*.html*
// @match        *://*/manuscripts/?*
// @match        *://gwfw.sdlib.com:8000/*
// @match        *://www.jinchutou.com/shtml/view-*
// @match        *://www.jinchutou.com/p-*
// @match        *://www.nrsis.org.cn/*/read/*
// @match        https://xianxiao.ssap.com.cn/index/rpdf/read/id/*/catalog_id/0.html?file=*
// @require      https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js
// @icon         https://s2.loli.net/2022/01/12/wc9je8RX7HELbYQ.png
// @icon64       https://s2.loli.net/2022/01/12/tmFeSKDf8UkNMjC.png
// @grant        none
// @run-at       document-idle
// @license      GPL-3.0-only
// @create       2021-11-22
// @note         1. 新增支持【先晓书院】
// @downloadURL https://update.greasyfork.org/scripts/481574/Wordcat%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/481574/Wordcat%20Downloader.meta.js
// ==/UserScript==
 
 
(function () {
    'use strict';
 
    /**
     * 基于 window.postMessage 通信的套接字对象
     */
    class Socket {
        /**
         * 创建套接字对象
         * @param {Window} target 目标窗口
         */
        constructor(target) {
            if (!(target.window && (target === target.window))) {
                console.log(target);
                throw new Error(`target is not a [Window Object]`); 
            }
            this.target = target;
            this.connected = false;
            this.listeners = new Set();
        }
 
        get [Symbol.toStringTag]() { return "Socket"; }
 
        /**
         * 向目标窗口发消息
         * @param {*} message 
         */
        talk(message) {
            if (!this.target) {
                throw new TypeError(
                    `socket.target is not a window: ${this.target}`
                );
            }
            this.target.postMessage(message, "*");
        }
 
        /**
         * 添加捕获型监听器，返回实际添加的监听器
         * @param {Function} listener (e: MessageEvent) => {...}
         * @param {boolean} once 是否在执行后自动销毁，默认 false；如为 true 则使用自动包装过的监听器
         * @returns {Function} listener
         */
        listen(listener, once=false) {
            if (this.listeners.has(listener)) {
                return;
            }
 
            let real_listener = listener;
            // 包装监听器
            if (once) {
                const self = this;
                function wrapped(e) {
                    listener(e);
                    self.notListen(wrapped);
                }
                real_listener = wrapped;
            }
            
            // 添加监听器
            this.listeners.add(real_listener);
            window.addEventListener(
                "message", real_listener, true
            );
            return real_listener;
        }
 
        /**
         * 移除socket上的捕获型监听器
         * @param {Function} listener (e: MessageEvent) => {...}
         */
        notListen(listener) {
            console.log(listener);
            console.log(
                "listener delete operation:",
                this.listeners.delete(listener)
            );
            window.removeEventListener("message", listener, true);
        }
 
        /**
         * 检查对方来信是否为pong消息
         * @param {MessageEvent} e 
         * @param {Function} resolve 
         */
        _on_pong(e, resolve) {
            // 收到pong消息
            if (e.data.pong) {
                this.connected = true;
                this.listeners.forEach(
                    listener => listener.ping ? this.notListen(listener) : 0
                );
                console.log("Client: Connected!\n" + new Date());
                resolve(this);
            }
        }
 
        /**
         * 向对方发送ping消息
         * @returns {Promise<Socket>}
         */
        _ping() {
            return new Promise((resolve, reject) => {
                // 绑定pong检查监听器
                const listener = this.listen(
                    e => this._on_pong(e, resolve)
                );
                listener.ping = true;
 
                // 5分钟后超时
                setTimeout(
                    () => reject(new Error(`Timeout Error during receiving pong (>5min)`)),
                    5 * 60 * 1000
                );
                // 发送ping消息
                this.talk({ ping: true });
            });
        }
 
        /**
         * 检查对方来信是否为ping消息
         * @param {MessageEvent} e 
         * @param {Function} resolve 
         */
        _on_ping(e, resolve) {
            // 收到ping消息
            if (e.data.ping) {
                this.target = e.source;
                this.connected = true;
                this.listeners.forEach(
                    listener => listener.pong ? this.notListen(listener) : 0
                );
                console.log("Server: Connected!\n" + new Date());
                
                // resolve 后期约状态无法回退
                // 但后续代码仍可执行
                resolve(this);
                // 回应pong消息
                this.talk({ pong: true });
            }
        }
 
        /**
         * 当对方来信是为ping消息时回应pong消息
         * @returns {Promise<Socket>}
         */
        _pong() {
            return new Promise(resolve => {
                // 绑定ping检查监听器
                const listener = this.listen(
                    e => this._on_ping(e, resolve)
                );
                listener.pong = true;
            });
        }
 
        /**
         * 连接至目标窗口
         * @param {boolean} talk_first 是否先发送ping消息
         * @param {Window} target 目标窗口
         * @returns {Promise<Socket>}
         */
        connect(talk_first) {
            // 先发起握手
            if (talk_first) {
                return this._ping();
            }
            // 后发起握手
            return this._pong();
        }
    }
 
 
    const base = {
        Socket,
 
        init_gbk_encoder() {
 
            let table;
 
            function initGbkTable() {
                // https://en.wikipedia.org/wiki/GBK_(character_encoding)#Encoding
                const ranges = [
                    [0xA1, 0xA9,  0xA1, 0xFE],
                    [0xB0, 0xF7,  0xA1, 0xFE],
                    [0x81, 0xA0,  0x40, 0xFE],
                    [0xAA, 0xFE,  0x40, 0xA0],
                    [0xA8, 0xA9,  0x40, 0xA0],
                    [0xAA, 0xAF,  0xA1, 0xFE],
                    [0xF8, 0xFE,  0xA1, 0xFE],
                    [0xA1, 0xA7,  0x40, 0xA0],
                ];
                const codes = new Uint16Array(23940);
                let i = 0;
 
                for (const [b1Begin, b1End, b2Begin, b2End] of ranges) {
                    for (let b2 = b2Begin; b2 <= b2End; b2++) {
                        if (b2 !== 0x7F) {
                            for (let b1 = b1Begin; b1 <= b1End; b1++) {
                                codes[i++] = b2 << 8 | b1;
                            }
                        }
                    }
                }
                table = new Uint16Array(65536);
                table.fill(0xFFFF);
 
                const str = new TextDecoder('gbk').decode(codes);
                for (let i = 0; i < str.length; i++) {
                    table[str.charCodeAt(i)] = codes[i];
                }
            }
 
            const defaultOnAlloc = (len) => new Uint8Array(len);
            const defaultOnError = () => 63;   // '?'
 
            /**
             * 字符串编码为gbk字节串
             * @param {string} str
             * @param {Function} onError 处理编码失败时返回字符替代值的函数，默认是返回 63('?') 的函数
             * @returns {Uint8Array}
             */
            return function(str, onError=null) {
                if (!table) {
                    initGbkTable();
                }
                const onAlloc = defaultOnAlloc;
                onError = onError === null ? defaultOnError : onError;
 
                const buf = onAlloc(str.length * 2);
                let n = 0;
 
                for (let i = 0; i < str.length; i++) {
                    const code = str.charCodeAt(i);
                    if (code < 0x80) {
                        buf[n++] = code;
                        continue;
                    }
 
                    const gbk = table[code];
 
                    if (gbk !== 0xFFFF) {
                        buf[n++] = gbk;
                        buf[n++] = gbk >> 8;
                    }
                    
                    else if (code === 8364) {
                        // 8364 == '€'.charCodeAt(0)
                        // Code Page 936 has a single-byte euro sign at 0x80
                        buf[n++] = 0x80;
                    }
                    
                    else {
                        const ret = onError(i, str);
                        if (ret === -1) {
                            break;
                        }
                        if (ret > 0xFF) {
                            buf[n++] = ret;
                            buf[n++] = ret >> 8;
                        } else {
                            buf[n++] = ret;
                        }
                    }
                }
                return buf.subarray(0, n)
            }
        },
 
        /**
         * Construct a table with table[i] as the length of the longest prefix of the substring 0..i
         * @param {Array<number>} arr 
         * @returns {Array<number>}
         */
        longest_prefix: function(arr) {
 
            // create a table of size equal to the length of `str`
            // table[i] will store the prefix of the longest prefix of the substring str[0..i]
            let table = new Array(arr.length);
            let maxPrefix = 0;
            // the longest prefix of the substring str[0] has length
            table[0] = 0;
 
            // for the substrings the following substrings, we have two cases
            for (let i = 1; i < arr.length; i++) {
                // case 1. the current character doesn't match the last character of the longest prefix
                while (maxPrefix > 0 && arr[i] !== arr[maxPrefix]) {
                    // if that is the case, we have to backtrack, and try find a character  that will be equal to the current character
                    // if we reach 0, then we couldn't find a chracter
                    maxPrefix = table[maxPrefix - 1];
                }
                // case 2. The last character of the longest prefix matches the current character in `str`
                if (arr[maxPrefix] === arr[i]) {
                    // if that is the case, we know that the longest prefix at position i has one more character.
                    // for example consider `-` be any character not contained in the set [a-c]
                    // str = abc----abc
                    // consider `i` to be the last character `c` in `str`
                    // maxPrefix = will be 2 (the first `c` in `str`)
                    // maxPrefix now will be 3
                    maxPrefix++;
                    // so the max prefix for table[9] is 3
                }
                table[i] = maxPrefix;
            }
            return table;
        },
 
        // 用于取得一次列表中所有迭代器的值
        getAllValus: function(iterators) {
            if (iterators.length === 0) {
                return [true, []];
            }
        
            let values = [];
            for (let iterator of iterators) {
                let {value, done} = iterator.next();
                if (done) {
                    return [true, []];
                }
                values.push(value);
            }
            return [false, values];
        },
 
        /**
         * 使用过时的execCommand复制文字
         * @param {string} text
         */
        oldCopy: function(text) {
            document.oncopy = function(event) {
                event.clipboardData.setData('text/plain', text);
                event.preventDefault();
            };
            document.execCommand('Copy', false, null);
        },
 
        b64ToUint6: function(nChr) {
            return nChr > 64 && nChr < 91 ?
                nChr - 65
                : nChr > 96 && nChr < 123 ?
                nChr - 71
                : nChr > 47 && nChr < 58 ?
                nChr + 4
                : nChr === 43 ?
                62
                : nChr === 47 ?
                63
                :
                0;
        },
 
        /**
         * 元素选择器
         * @param {string} selector 选择器
         * @returns {Array<HTMLElement>} 元素列表
         */
        $: function(selector) {
            const self = this?.querySelectorAll ? this : document;
            return [...self.querySelectorAll(selector)];
        },
 
        /**
         * 安全元素选择器，直到元素存在时才返回元素列表，最多等待5秒
         * @param {string} selector 选择器
         * @returns {Promise<Array<HTMLElement>>} 元素列表
         */
        $$: async function(selector) {
            const self = this?.querySelectorAll ? this : document;
 
            for (let i = 0; i < 10; i++) {
                let elems = [...self.querySelectorAll(selector)];
                if (elems.length > 0) {
                    return elems;
                }
                await new Promise(r => setTimeout(r, 500));
            }
            throw Error(`"${selector}" not found in 5s`);
        },
 
        /**
         * 将2个及以上的空白字符（除了换行符）替换成一个空格
         * @param {string} text 
         * @returns {string}
         */
        stripBlanks: function(text) {
            return text
                .replace(/([^\r\n])(\s{2,})(?=[^\r\n])/g, "$1 ")
                .replace(/\n{2,}/, "\n");
        },
 
        /**
         * 复制属性(含访问器)到 target
         * @param {Object} target 
         * @param  {...Object} sources 
         * @returns 
         */
        superAssign: function(target, ...sources) {
            sources.forEach(source => 
                Object.defineProperties(
                    target, Object.getOwnPropertyDescriptors(source)
                )
            );
            return target;
        },
 
        makeCRC32: function() {
            function makeCRCTable() {
                let c;
                let crcTable = [];
                for(var n =0; n < 256; n++){
                    c = n;
                    for(var k =0; k < 8; k++){
                        c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                    }
                    crcTable[n] = c;
                }
                return crcTable;
            }
 
            const crcTable = makeCRCTable();
 
            /**
             * @param {string} str
             * @returns {number}
             */
            return function(str) {
                let crc = 0 ^ (-1);
            
                for (var i = 0; i < str.length; i++ ) {
                    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
                }
            
                return (crc ^ (-1)) >>> 0;
            };
        }
    };
 
    const box = `
<div class="wk-box">
    <section class="btns-sec">
        <p class="logo_tit">Wenku Doc Downloader</p>
        <button class="btn-1">展开文档 😈</button>
        <button class="btn-2">空按钮 2</button>
        <button class="btn-3">空按钮 3</button>
        <button class="btn-4">空按钮 4</button>
        <button class="btn-5">空按钮 5</button>
    </section>
    <p class="wk-fold-btn unfold"></p>
</div>
`;
 
    const style = `
<style class="wk-style">
    .wk-fold-btn {
        position: fixed;
        left: 151px;
        top: 36%;
        user-select: none;
        font-size: large;
        z-index: 1001;
    }
 
    .wk-fold-btn::after {
        content: "🐵";
    }
    
    .wk-fold-btn.folded {
        left: 20px;
    }
    
    .wk-fold-btn.folded::after {
        content: "🙈";
    }
 
    .wk-box {
        position: fixed;
        width: 154px;
        left: 10px;
        top: 32%;
        z-index: 1000;
    }
 
    .btns-sec {
        background: #E7F1FF;
        border: 2px solid #1676FF;
        padding: 0px 0px 10px 0px;
        font-weight: 600;
        border-radius: 2px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
            'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol';
    }
 
    .btns-sec.folded {
        display: none;
    }
 
    .logo_tit {
        width: 100%;
        background: #1676FF;
        text-align: center;
        font-size: 12px;
        color: #E7F1FF;
        line-height: 40px;
        height: 40px;
        margin: 0 0 16px 0;
    }
 
    .btn-1 {
        display: block;
        width: 128px;
        height: 28px;
        background: linear-gradient(180deg, #00E7F7 0%, #FEB800 0.01%, #FF8700 100%);
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        border: none;
        outline: none;
        margin: 8px auto;
        font-weight: bold;
        cursor: pointer;
        opacity: .9;
    }
 
    .btn-2 {
        display: none;
        width: 128px;
        height: 28px;
        background: #07C160;
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        border: none;
        outline: none;
        margin: 8px auto;
        font-weight: bold;
        cursor: pointer;
        opacity: .9;
    }
 
    .btn-3 {
        display: none;
        width: 128px;
        height: 28px;
        background: #FA5151;
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        border: none;
        outline: none;
        margin: 8px auto;
        font-weight: bold;
        cursor: pointer;
        opacity: .9;
    }
 
    .btn-4 {
        display: none;
        width: 128px;
        height: 28px;
        background: #1676FF;
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        border: none;
        outline: none;
        margin: 8px auto;
        font-weight: bold;
        cursor: pointer;
        opacity: .9;
    }
 
    .btn-5 {
        display: none;
        width: 128px;
        height: 28px;
        background: #ff6600;
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        border: none;
        outline: none;
        margin: 8px auto;
        font-weight: bold;
        cursor: pointer;
        opacity: .9;
    }
 
 
    .btns-sec button:hover {
        opacity: 0.8;
    }
 
    .btns-sec button:active{
        opacity: 1;
    }
 
    .btns-sec button[disabled] {
        cursor: not-allowed;
        opacity: 1;
        filter: grayscale(1);
    }
 
    .wk-popup-container {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        z-index: 999;
        background: 0 0;
    }
 
    .wk-popup-head {
        font-size: 1.5em;
        margin-bottom: 12px
    }
 
    .wk-card {
        background: #fff;
        background-image: linear-gradient(48deg, #fff 0, #e5efe9 100%);
        border-top-right-radius: 16px;
        border-bottom-left-radius: 16px;
        box-shadow: -20px 20px 35px 1px rgba(10, 49, 86, .18);
        display: flex;
        flex-direction: column;
        padding: 32px;
        margin: 0;
        max-width: 400px;
        width: 100%
    }
 
    .content-wrapper {
        font-size: 1.1em;
        margin-bottom: 44px
    }
 
    .content-wrapper:last-child {
        margin-bottom: 0
    }
 
    .wk-button {
        align-items: center;
        background: #e5efe9;
        border: 1px solid #5a72b5;
        border-radius: 4px;
        color: #121943;
        cursor: pointer;
        display: flex;
        font-size: 1em;
        font-weight: 700;
        height: 40px;
        justify-content: center;
        width: 150px
    }
 
    .wk-button:focus {
        border: 2px solid transparent;
        box-shadow: 0 0 0 2px #121943;
        outline: solid 4px transparent
    }
 
    .link {
        color: #121943
    }
 
    .link:focus {
        box-shadow: 0 0 0 2px #121943
    }
 
    .input-wrapper {
        display: flex;
        flex-direction: column
    }
 
    .input-wrapper .label {
        align-items: baseline;
        display: flex;
        font-weight: 700;
        justify-content: space-between;
        margin-bottom: 8px
    }
 
    .input-wrapper .optional {
        color: #5a72b5;
        font-size: .9em
    }
 
    .input-wrapper .input {
        border: 1px solid #5a72b5;
        border-radius: 4px;
        height: 40px;
        padding: 8px
    }
 
    .modal-header {
        align-items: baseline;
        display: flex;
        justify-content: space-between
    }
 
    .close {
        background: 0 0;
        border: none;
        cursor: pointer;
        display: flex;
        height: 16px;
        text-decoration: none;
        width: 16px
    }
 
    .close svg {
        width: 16px
    }
 
    .modal-wrapper {
        background: rgba(0, 0, 0, .7);
    }
 
    #wk-popup {
        opacity: 0;
        transition: opacity .25s ease-in-out;
        display: none;
        flex-direction: row;
        justify-content: space-around;
    }
 
    #wk-popup:target {
        opacity: 1;
        display: flex;
    }
 
    #wk-popup:target .modal-body {
        opacity: 1;
        transform: translateY(1);
    }
 
    #wk-popup .modal-body {
        max-width: 500px;
        opacity: 0;
        transform: translateY(-3vh);
        transition: opacity .25s ease-in-out;
        width: 100%;
        z-index: 1
    }
 
    .outside-trigger {
        bottom: 0;
        cursor: default;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
    }
</style>
`;
 
    const popup = `
<div class="wk-popup-container">
    <div class='modal-wrapper' id='wk-popup'>
        <div class='modal-body wk-card'>
            <div class='modal-header'>
                <h2 class='wk-popup-head'>下载进度条</h2>
                <a href='#!' role='wk-button' class='close' aria-label='close this modal'>
                    <svg viewBox='0 0 24 24'>
                        <path
                            d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z'>
                        </path>
                    </svg>
                </a>
            </div>
            <p class='wk-popup-body'>正在初始化内容...</p>
        </div>
        <a href='#!' class='outside-trigger'></a>
    </div>
</div>
`;
 
    globalThis.wk$ = base.$;
    globalThis.wk$$ = base.$$;
 
 
    const utils = {
        Socket: base.Socket,
 
        PDF_LIB_URL: "https://cdn.staticfile.org/pdf-lib/1.17.1/pdf-lib.min.js",
 
        encode_to_gbk: base.init_gbk_encoder(),
 
        print: function(...args) {
            const time = new Date().toTimeString().slice(0, 8);
            console.info(`[wk ${time}]`, ...args);
        },
 
        /**
         * 字节串转b64字符串
         * @param {Uint8Array} bytes 
         * @returns {Promise<string>}
         */
        bytes_to_b64: function(bytes) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = () => reject(new Error("转换失败", { cause: bytes }));
                reader.onloadend = () => resolve(reader.result.split(",")[1]);
                reader.readAsDataURL(new Blob([bytes]));
            });
        },
 
        /**
         * 以指定原因弹窗提示并抛出错误
         * @param {string} reason 
         */
        raise: function(reason) {
            alert(reason);
            throw new Error(reason);
        },
 
        /**
         * 将错误定位转为可读的字符串
         * @param {Error} err 
         * @returns {string}
         */
        get_stack: function(err) {
            let stack = `${err.stack}`;
            const matches = stack.matchAll(/at .+?( [(].+[)])/g);
 
            for (const group of matches) {
                stack = stack.replace(group[1], "");
            }
            return stack.trim();
        },
 
        /**
         * 合并多个PDF
         * @param {Array<ArrayBuffer | Uint8Array>} pdfs 
         * @param {Function} loop_fn
         * @param {Window} win
         * @returns {Promise<Uint8Array>}
         */
        join_pdfs: async function(pdfs, loop_fn=null, win=null) {
            const _win = win || window;
            if (!_win.PDFLib) {
                await this.load_web_script(this.PDF_LIB_URL);
            }
 
            const combined = await PDFLib.PDFDocument.create();
 
            for (const [i, buffer] of this.enumerate(pdfs)) {
                const pdf = await PDFLib.PDFDocument.load(buffer);
                const pages = await combined.copyPages(
                    pdf, pdf.getPageIndices()
                );
 
                for (const page of pages) {
                    combined.addPage(page);
                }
 
                if (loop_fn) {
                    // 如有，则使用自定义钩子函数
                    loop_fn();
                } else {
                    // 否则使用旧版 popup
                    this.update_popup(`已经合并 ${i + 1} 组`);
                }
            }
 
            return await combined.save();
        },
 
        /**
         * raise an error for status which is not in [200, 299] 
         * @param {Response} response 
         */
        raise_for_status(response) {
            if (!response.ok) {
                throw new Error(
                    `Fetch Error with status code: ${response.status}`
                );
            }
        },
 
        /**
         * 计算 str 的 CRC32 摘要(number)
         * @param {string} str
         * @returns {number}
         */
        crc32: base.makeCRC32(),
 
        /**
         * 返回函数参数定义
         * @param {Function} fn 
         * @param {boolean} print 是否打印到控制台，默认 true
         * @returns {string | undefined}
         */
        help: function(fn, print=true) {
            if (!(fn instanceof Function))
                throw new Error(`fn must be a function`);
 
            const
                _fn = fn.__func__ || fn,
                ARROW_ARG = /^([^(]+?)=>/,
                FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m,
                STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
                fn_text = Function.prototype.toString.call(_fn).replace(STRIP_COMMENTS, ''),
                args = fn_text.match(ARROW_ARG) || fn_text.match(FN_ARGS),
                // 如果自带 doc，优先使用，否则使用源码
                doc = fn.__doc__ ? fn.__doc__ : args[0];
            
            if (!print) return base.stripBlanks(doc);
 
            const color = (window.matchMedia &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches
                ) ;
            console.log("%c" + doc, `color: ${color}; font: small italic`);
        },
 
        /**
         * 字节数组转十六进制字符串
         * @param {Uint8Array} arr 
         * @returns {string}
         */
        hex_bytes: function(arr) {
            return Array.from(arr)
                .map(byte => byte.toString(16).padStart(2, "0"))
                .join("");
        },
 
        /**
         * 取得对象类型
         * @param {*} obj 
         * @returns {string} class
         */
        classof: function(obj) {
            return Object
                .prototype
                .toString
                .call(obj)
                .slice(8, -1);
        },
 
        /**
         * 随机改变字体颜色、大小、粗细
         * @param {HTMLElement} elem 
         */
        emphasize_text: function(elem) {
            const rand = Math.random;
            elem.style.cssText = `
            font-weight: ${200 + parseInt(700 * rand())};
            font-size: ${(1 + rand()).toFixed(1)}em;
            color: hsl(${parseInt(360 * rand())}, ${parseInt(40 + 60 * rand())}%, ${parseInt(60 * rand())}%);
            background-color: yellow;`;
        },
 
        /**
         * 等待直到 DOM 节点停止变化
         * @param {HTMLElement} elem 监听节点 
         * @param {number} timeout 超时毫秒数
         * @returns {Promise<MutationObserver>} observer
         */
        until_stop: async function(elem, timeout=2000) {
            // 创建用于共享的监听器
            let observer;
            // 创建超时 Promise
            const timeout_promise = new Promise((_, reject) => {
                setTimeout(() => {
                    // 停止监听、释放资源
                    observer.disconnect();
                    const error = new Error(
                        `Timeout Error occured on listening DOM mutation (max ${timeout}ms)`,
                        { cause: elem }
                    );
                    reject(error);
                }, timeout);
            });
            
            // 开始元素节点变动监听
            return Promise.race([
                new Promise(resolve => {
                    // 创建监听器
                    observer = new MutationObserver(
                        (_, observer) => {
                            // DOM 变动结束后终止监听、释放资源
                            observer.disconnect();
                            // 返回监听器
                            resolve(observer);
                        }
                    );
                    // 开始监听目标节点
                    observer.observe(elem, {
                        subtree: true,
                        childList: true,
                        attributes: true
                    });
                }),
                timeout_promise,
            ])
            .catch(error => {
                if (`${error}`.includes("Timeout Error")) {
                    return observer;
                }
                console.error(error);
                throw error;
            });
        },
 
        /**
         * Find all the patterns that matches in a given string `str`
         * this algorithm is based on the Knuth–Morris–Pratt algorithm. Its beauty consists in that it performs the matching in O(n)
         * @param {Array<number>} arr 
         * @param {Array<number>} sub_arr 
         * @returns {Array<number>}
         */
        kmp_matching: function(arr, sub_arr) {
            // find the prefix table in O(n)
            let prefixes = base.longest_prefix(sub_arr);
            let matches = [];
 
            // `j` is the index in `P`
            let j = 0;
            // `i` is the index in `S`
            let i = 0;
            while (i < arr.length) {
                // Case 1.  S[i] == P[j] so we move to the next index in `S` and `P`
                if (arr[i] === sub_arr[j]) {
                    i++;
                    j++;
                }
                // Case 2.  `j` is equal to the length of `P`
                // that means that we reached the end of `P` and thus we found a match
                if (j === sub_arr.length) {
                    matches.push(i - j);
                    // Next we have to update `j` because we want to save some time
                    // instead of updating to j = 0 , we can jump to the last character of the longest prefix well known so far.
                    // j-1 means the last character of `P` because j is actually `P.length`
                    // e.g.
                    // S =  a b a b d e
                    // P = `a b`a b
                    // we will jump to `a b` and we will compare d and a in the next iteration
                    // a b a b `d` e
                    //     a b `a` b
                    j = prefixes[j - 1];
                }
                // Case 3.
                // S[i] != P[j] There's a mismatch!
                else if (arr[i] !== sub_arr[j]) {
                    // if we have found at least a character in common, do the same thing as in case 2
                    if (j !== 0) {
                        j = prefixes[j - 1];
                    } else {
                        // otherwise, j = 0, and we can move to the next character S[i+1]
                        i++;
                    }
                }
            }
 
            return matches;
        },
 
        /**
             * 用文件头切断文件集合体
             * @param {Uint8Array} bytes 
             * @param {Uint8Array} head 默认 null，即使用 data 前 8 字节
             * @returns {Array<Uint8Array>}
             */
        split_files_by_head: function(bytes, head=null) {
            const sub = bytes.subarray || bytes.slice;
            head = head || sub.call(bytes, 0, 8);
            
            const indexes = this.kmp_matching(bytes, head);
            const size = indexes.length;
            indexes.push(bytes.length);
 
            const parts = new Array(size);
            for (let i = 0; i < size; i++) {
                parts[i] = sub.call(bytes, indexes[i], indexes[i+1]);
            }
            // 返回结果数组
            return parts;
        },
 
        /**
         * 函数装饰器：仅执行一次 func
         */
        once: function(fn) {
            let used = false;
            return function() {
                if (!used) {
                    used = true;
                    return fn();
                }
            }
        },
 
        /**
         * 返回一个包含计数器的迭代器, 其每次迭代值为 [index, value]
         * @param {Iterable} iterable 
         * @returns 
         */
        enumerate: function* (iterable) {
            let i = 0;
            for (let value of iterable) {
                yield [i, value];
                i++;
            }
        },
 
        /**
         * 同步的迭代若干可迭代对象
         * @param  {...Iterable} iterables 
         * @returns 
         */
        zip: function* (...iterables) {
            // 强制转为迭代器
            let iterators = iterables.map(
                iterable => iterable[Symbol.iterator]()
            );
 
            // 逐次迭代
            while (true) {
                const [done, values] = base.getAllValus(iterators);
                if (done) {
                    return;
                }
                if (values.length === 1) {
                    yield values[0];
                } else {
                    yield values;
                }
            }
        },
 
        /**
         * 返回指定范围整数生成器
         * @param {number} end 如果只提供 end, 则返回 [0, end)
         * @param {number} end2 如果同时提供 end2, 则返回 [end, end2)
         * @param {number} step 步长, 可以为负数，不能为 0
         * @returns 
         */
        range: function*(end, end2=null, step=1) {
            // 参数合法性校验
            if (step === 0) {
                throw new RangeError("step can't be zero");
            }
            const len = end2 - end;
            if (end2 && len && step && (len * step < 0)) {
                throw new RangeError(`[${end}, ${end2}) with step ${step} is invalid`);
            }
 
            // 生成范围
            end2 = end2 === null ? 0 : end2;
            let [small, big] = [end, end2].sort((a, b) => a - b);
            // 开始迭代
            if (step > 0) {
                for (let i = small; i < big; i += step) {
                    yield i;
                }
            } else {
                for (let i = big; i > small; i += step) {
                    yield i;
                }
            }    },
 
        /**
         * 获取整个文档的全部css样式
         * @returns {string} css text
         */
        get_all_styles: function() {
            let styles = [];
            for (let sheet of document.styleSheets) {
                let rules;
                try {
                    rules = sheet.cssRules;
                } catch(e) {
                    if (!(e instanceof DOMException)) {
                        console.error(e);
                    }
                    continue;
                }
 
                for (let rule of rules) {
                    styles.push(rule.cssText);   
                }
            }
            return styles.join("\n\n");
        },
 
        /**
         * 复制text到剪贴板
         * @param {string} text 
         * @returns 
         */
        copy_text: function(text) {
            // 输出到控制台和剪贴板
            console.log(
                text.length > 20 ?
                    text.slice(0, 21) + "..." : text
            );
            
            if (!navigator.clipboard) {
                base.oldCopy(text);
                return;
            }
            navigator.clipboard
                .writeText(text)
                .catch(_ => base.oldCopy(text));
        },
 
        /**
         * 复制媒体到剪贴板
         * @param {Blob} blob
         */
        copy: async function(blob) {
            const data = [new ClipboardItem({ [blob.type]: blob })];
            try {
                await navigator.clipboard.write(data);
                console.log(`${blob.type} 成功复制到剪贴板`);
            } catch (err) {
                console.error(err.name, err.message);
            }
        },
 
        /**
         * 创建并下载文件
         * @param {string} file_name 文件名
         * @param {ArrayBuffer | ArrayBufferView | Blob | string} content 内容
         * @param {string} type 媒体类型，需要符合 MIME 标准 
         */
        save: function(file_name, content, type="") {
            if (!type && (content instanceof Blob)) {
                type = content.type;
            }
 
            let blob = null;
            if (content instanceof Array) {
                blob = new Blob(content, { type });
            } else {
                blob = new Blob([content], { type });
            }
            
            const size = parseInt((blob.size / 1024).toFixed(0)).toLocaleString();
            console.log(`blob saved, size: ${size} KB, type: ${blob.type}`, blob);
 
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.download = file_name || "未命名文件";
            a.href = url;
            a.click();
            URL.revokeObjectURL(url);
        },
 
        /**
         * 显示/隐藏按钮区
         */
        toggle_box: function() {
            let sec = wk$(".wk-box")[0];
            if (sec.style.display === "none") {
                sec.style.display = "block";
                return;
            }
            sec.style.display = "none";
        },
 
        /**
         * 异步地睡眠 delay 毫秒, 可选 max_delay 控制波动范围
         * @param {number} delay 等待毫秒
         * @param {number} max_delay 最大等待毫秒, 默认为null
         * @returns
         */
        sleep: async function(delay, max_delay=null) {
            max_delay = max_delay === null ? delay : max_delay;
            delay = delay + (max_delay - delay) * Math.random();
            return new Promise(resolve => setTimeout(resolve, delay));
        },
 
        /**
         * 允许打印页面
         */
        allow_print: function() {
            const style = document.createElement("style");
            style.innerHTML = `
            @media print {
                body { display: block; }
            }`;
            document.head.append(style);
        },
 
        /**
         * 取得get参数key对应的value
         * @param {string} key
         * @returns {string} value
         */
        get_param: function(key) {
            return new URL(location.href).searchParams.get(key);
        },
 
        /**
         * 求main_set去除cut_set后的set
         * @param {Iterable} main_set 
         * @param {Iterable} cut_set 
         * @returns 差集
         */
        diff: function(main_set, cut_set) {
            const _diff = new Set(main_set);
            for (let elem of cut_set) {
                _diff.delete(elem);
            }
            return _diff;
        },
 
        /**
         * 增强按钮（默认为蓝色按钮：展开文档）的点击效果
         * @param {string} i 按钮序号
         */
        enhance_click: async function(i) {
            let btn = this.btn(i);
            const style = btn.getAttribute("style") || "";
            
            // 变黑缩小
            btn.setAttribute(
                "style",
                style + "color: black; font-weight: normal;"
            );
            
            await utils.sleep(500);
            btn = this.btn(i);
            // 复原加粗
            btn.setAttribute("style", style);
        },
 
        /**
         * 绑定事件处理函数到指定按钮，返回实际添加的事件处理函数
         * @param {(event: PointerEvent) => Promise<void>} listener click监听器
         * @param {number} i 按钮序号
         * @param {string} new_text 按钮的新文本，为null则不替换
         * @returns {Function} 事件处理函数
         */
        onclick: function(listener, i, new_text=null) {
            const btn = this.btn(i);
 
            // 如果需要，替换按钮内文本
            if (new_text) {
                btn.textContent = new_text;
            }
 
            // 绑定事件，添加到页面上
            /**
             * @param {PointerEvent} event 
             */
            async function wrapped_listener(event) {
                const btn = event.target;
                const text = btn.textContent;
                btn.disabled = true;
                try {
                    await listener.call(btn, event);
                } catch(err) {
                    console.error(err);
                }
                btn.disabled = false;
                btn.textContent = text;
            }
 
            btn.onclick = wrapped_listener;
            return wrapped_listener;
        },
 
        /**
         * 返回第 index 个按钮引用
         * @param {number} i 
         * @returns {HTMLButtonElement}
         */
        btn: function(i) {
            return wk$(`.wk-box [class="btn-${i}"]`)[0];
        },
 
        /**
         * 强制隐藏元素
         * @param {string | Array<HTMLElement>} selector_or_elems 
         */
        force_hide: function(selector_or_elems) {
            const cls = "force-hide";
            const elems = selector_or_elems instanceof Array ?
                selector_or_elems : wk$(selector_or_elems);
 
            elems.forEach(elem => {
                elem.classList.add(cls);
            });
 
            // 判断css样式是否已经存在
            let style = wk$(`style.${cls}`)[0];
            // 如果已经存在，则无须重复创建
            if (style) {
                return;
            }
            // 否则创建
            style = document.createElement("style");
            style.innerHTML = `style.${cls} {
            visibility: hidden !important;
            display: none !important;
        }`;
            document.head.append(style);
        },
 
        /**
         * 等待直到元素可见。最多等待5秒。
         * @param {HTMLElement} elem 一个元素
         * @returns {Promise<HTMLElement>} elem
         */
        until_visible: async function(elem) {
            let [max, i] = [25, 0];
            let style = getComputedStyle(elem);
            // 如果不可见就等待0.2秒/轮
            while (i <= max &&
                (style.display === "none" ||
                style.visibility !== "hidden")
                ) {
                i++;
                style = getComputedStyle(elem);
                await this.sleep(200);
            }
            return elem;
        },
 
        /**
         * 等待直到函数返回true
         * @param {Function} isReady 判断条件达成与否的函数
         * @param {number} timeout 最大等待秒数, 默认5000毫秒
         */
        wait_until: async function(isReady, timeout=5000) {
            const gap = 200;
            let chances = parseInt(timeout / gap);
            chances = chances < 1 ? 1 : chances;
            
            while (! await isReady()) {
                await this.sleep(200);
                chances -= 1;
                if (!chances) {
                    break;
                }
            }
        },
 
        /**
         * 隐藏按钮，打印页面，显示按钮
         */
        print_page: function() {
            // 隐藏按钮，然后打印页面
            this.toggle_box();
            setTimeout(window.print, 500);
            setTimeout(this.toggle_box, 1000);
        },
 
        /**
         * 切换按钮显示/隐藏状态
         * @param {number} i 按钮序号
         * @returns 按钮元素的引用
         */
        toggle_btn: function(i) {
            const btn = this.btn(i);
            const display = getComputedStyle(btn).display;
            
            if (display === "none") {
                btn.style.display = "block";
            } else {
                btn.style.display = "none";
            }
            return btn;
        },
 
        /**
         * 用input框跳转到对应页码
         * @param {HTMLInputElement} input 当前页码
         * @param {string | number} page_num 目标页码
         * @param {string} type 键盘事件类型："keyup" | "keypress" | "keydown"
         */
        to_page: function(input, page_num, type) {
            // 设置跳转页码为目标页码
            input.value = `${page_num}`;
            // 模拟回车事件来跳转
            const enter = new KeyboardEvent(type, {
                bubbles: true,
                cancelable: true,
                keyCode: 13
            });
            input.dispatchEvent(enter);
        },
 
        /**
         * 判断给定的url是否与当前页面同源
         * @param {string} url 
         * @returns {boolean}
         */
        is_same_origin: function(url) {
            url = new URL(url);
            if (url.protocol === "data:") {
                return true;
            }
            if (location.protocol === url.protocol
                && location.host === url.host
                && location.port === url.port
                ) {
                return true;
            }
            return false;
        },
 
        /**
         * 在新标签页打开链接，如果提供文件名则下载
         * @param {string} url 
         * @param {string} fname 下载文件的名称，默认为空，代表不下载
         */
        open_in_new_tab: function(url, fname="") {
            const a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            if (fname && this.is_same_origin(url)) {
                a.download = fname;
            }
            a.click();
        },
 
        /**
         * 用try移除元素
         * @param {HTMLElement | string} elem_or_selector
         */
        remove: function(elem_or_selector) {
            try {
                const cls = this.classof(elem_or_selector);
                if (cls === "String") {
                    wk$(elem_or_selector).forEach(
                        elem => elem.remove()
                    );
                }
                else if (cls.endsWith("Element")) {
                    elem_or_selector.remove();
                }
            } catch (e) {
                console.error(e);
            }
        },
 
        /**
         * 用try移除若干元素
         * @param {Iterable<HTMLElement>} elements 要移除的元素列表
         */
        remove_multi: function(elements) {
            for (const elem of elements) {
                this.remove(elem);
            }
        },
 
        /**
         * 等待全部任务落定后返回值的列表
         * @param {Array<Promise>} tasks 
         * @returns {Promise<Array>}
         */
        gather: async function(tasks) {
            const results = await Promise.allSettled(tasks);
            const values = [];
 
            for (const result of results) {
                // 期约成功解决且返回值不为空的才有效
                if (result.status === "fulfilled"
                    && !([NaN, null, undefined].includes(result.value))) {
                    values.push(result.value);
                }
            }
            return values;
        },
 
        /**
         * html元素列表转为canvas列表
         * @param {Array<HTMLElement>} elements 
         * @returns {Promise<Array<HTMLCanvasElement>>}
         */
        elems_to_canvases: async function(elements) {
            if (!globalThis.html2canvas) {
                await this.load_web_script(
                    "https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js"
                );
            }
 
            // 如果是空列表, 则抛出异常
            if (elements.length === 0) {
                throw new Error("htmlToCanvases 未得到任何html元素");
            }
 
            return this.gather(
                elements.map(html2canvas)
            );
        },
 
        /**
         * 将html元素转为canvas再合并到pdf中，最后下载pdf
         * @param {Array<HTMLElement>} elements 元素列表
         * @param {string} title 文档标题
         */
        elems_to_pdf: async function(elements, title="文档") {
            // 如果是空元素列表，终止函数
            const canvases = await this.elems_to_canvases(elements);
            // 控制台检查结果
            console.log("生成的canvas元素如下：");
            console.log(canvases);
            // 合并为PDF
            this.imgs_to_pdf(canvases, title);
        },
 
        /**
         * 使用xhr异步GET请求目标url，返回响应体blob
         * @param {string} url 
         * @returns {Promise<Blob>} blob
         */
        xhr_get_blob: async function(url) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            
            return new Promise((resolve, reject) => {
                xhr.onload = () => {
                    const code = xhr.status;
                    if (code >= 200 && code <= 299) {
                        resolve(xhr.response);
                    }
                    else {
                        reject(new Error(`Network Error: ${code}`));
                    }
                };
                xhr.send();
            });
        },
 
        /**
         * 加载CDN脚本
         * @param {string} url 
         */
        load_web_script: async function(url) {
            try {
                const resp = await fetch(url);
                const code = await resp.text();
                Function(code)();
 
            } catch(e) {
                console.error(e);
                // 嵌入<script>方式
                return new Promise(resolve => {
                    const script = document.createElement("script");
                    script.src = url;
                    script.onload = resolve;
                    document.body.append(script);
                });
            }
        },
 
        /**
         * b64编码字符串转Uint8Array
         * @param {string} sBase64 b64编码的字符串
         * @param {number} nBlockSize 字节数
         * @returns {Uint8Array} arr
         */
        b64_to_bytes: function(sBase64, nBlockSize=1) {
            const
                sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
                nOutLen = nBlockSize ? Math.ceil((nInLen * 3 + 1 >>> 2) / nBlockSize) * nBlockSize : nInLen * 3 + 1 >>> 2, aBytes = new Uint8Array(nOutLen);
 
            for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
                nMod4 = nInIdx & 3;
                nUint24 |= base.b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
                
                if (nMod4 === 3 || nInLen - nInIdx === 1) {
                    for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                        aBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                    }
                    nUint24 = 0;
                }
            }
            return aBytes;
        },
 
        /**
         * canvas转blob
         * @param {HTMLCanvasElement} canvas 
         * @param {string} type
         * @returns {Promise<Blob>}
         */
        canvas_to_blob: function(canvas, type="image/png") {
            return new Promise(
                resolve => canvas.toBlob(resolve, type, 1)
            );
        },
 
        /**
         * 合并blobs到压缩包，然后下载
         * @param {Iterable<Blob>} blobs 
         * @param {string} base_name 文件名通用部分，如 page-1.jpg 中的 page
         * @param {string} ext 扩展名，如 jpg
         * @param {string} zip_name 压缩包名称
         * @param {boolean} download 是否下载，可选，默认true，如果不下载则返回压缩包对象
         * @returns {"Promise<JSZip | null>"}
         */
        blobs_to_zip: async function(blobs, base_name, ext, zip_name, download=true) {
            const zip = new window.JSZip();
            // 归档
            for (const [i, blob] of this.enumerate(blobs)) {
                zip.file(`${base_name}-${i+1}.${ext}`, blob, { binary: true });
            }
 
            // 导出
            if (!download) {
                return zip;
            }
 
            const zip_blob = await zip.generateAsync({ type: "blob" });
            console.log(zip_blob);
            this.save(`${zip_name}.zip`, zip_blob);
            return null;
        },
 
        /**
         * 存储所有canvas图形为png到一个压缩包
         * @param {Iterable<HTMLCanvasElement>} canvases canvas元素列表
         * @param {string} title 文档标题
         */
        canvases_to_zip: async function(canvases, title) {
            // canvas元素转为png图像
            // 所有png合并为一个zip压缩包
            const tasks = [];
            for (let canvas of canvases) {
                tasks.push(this.canvas_to_blob(canvas));
            }
            const blobs = await this.gather(tasks);
            this.blobs_to_zip(blobs, "page", "png", title);
        },
 
 
 
        /**
         * 合并图像并导出PDF
         * @param {Iterable<HTMLCanvasElement | Uint8Array | HTMLImageElement>} imgs 图像元素列表
         * @param {string} title 文档标题
         * @param {number} width (可选)页面宽度 默认 0
         * @param {number} height (可选)页面高度 默认 0
         * @param {boolean} blob (可选)是否返回 blob 默认 false
         */
        imgs_to_pdf: async function(imgs, title, width = 0, height = 0, blob=false) {
            imgs = Array.from(imgs);
            if (imgs.length === 0) {
                this.raise("没有任何图像用于合并为PDF");
            }
 
            // 先获取第一个canvas用于判断竖向还是横向，以及得到页面长宽
            const first = imgs[0];
 
            // 如果没有手动指定canvas的长宽，则自动检测
            if (!width && !height) {
                // 如果是字节数组
                if (first instanceof Uint8Array) {
                    const cover = await createImageBitmap(
                        new Blob([first])
                    );
                    [width, height] = [cover.width, cover.height];
 
                    // 如果是画布或图像元素
                } else if (
                    first instanceof HTMLCanvasElement ||
                    first instanceof HTMLImageElement
                    ) {
                    if (first.width && parseInt(first.width) && parseInt(first.height)) {
                        [width, height] = [first.width, first.height];
                    } else {
                        const
                            width_str = first.style.width.replace(/(px)|(rem)|(em)/, ""),
                            height_str = first.style.height.replace(/(px)|(rem)|(em)/, "");
                        width = parseInt(width_str);
                        height = parseInt(height_str);
                    }
                } else {
                    // 其他未知类型
                    throw TypeError("不能处理的画布元素类型：" + this.classof(first));
                }
            }
            console.log(`canvas数据：宽: ${width}px，高: ${height}px`);
            
            // 如果文档第一页的宽比长更大，则landscape，否则portrait
            const orientation = width > height ? 'l' : 'p';
            // jsPDF的第三个参数为format，当自定义时，参数为数字数组。
            const pdf = new jspdf.jsPDF(orientation, 'px', [height, width]);
 
            const last = imgs.pop();
            const self = this;
            // 保存每一页文档到每一页pdf
            imgs.forEach((canvas, i) => {
                pdf.addImage(canvas, 'png', 0, 0, width, height);
                pdf.addPage();
                self?.update_popup(`PDF 已经绘制 ${i + 1} 页`);
            });
            // 添加尾页
            pdf.addImage(last, 'png', 0, 0, width, height);
            
            // 导出文件
            if (blob) {
                return pdf.output("blob");
            }
            pdf.save(`${title}.pdf`);
        },
 
        /**
         * imageBitMap转canvas
         * @param {ImageBitmap} bmp 
         * @returns {HTMLCanvasElement} canvas
         */
        bmp_to_canvas: function(bmp) {
            const canvas = document.createElement("canvas");
            canvas.height = bmp.height;
            canvas.width = bmp.width;
            
            const ctx = canvas.getContext("bitmaprenderer");
            ctx.transferFromImageBitmap(bmp);
            return canvas;
        },
 
        /**
         * 导出图片链接
         * @param {Iterable<string>} urls
         */
        save_urls: function(urls) {
            const _urls = Array
                .from(urls)
                .map((url) => {
                    const _url = url.trim();
                    if (url.startsWith("//"))
                        return "https:" + _url;
                    return _url;
                })
                .filter(url => url);
 
            this.save("urls.csv", _urls.join("\n"), "text/csv");
        },
 
        /**
         * 图片blobs合并并导出为单个PDF
         * @param {Array<Blob>} blobs 
         * @param {string} title (可选)文档名称, 不含后缀, 默认为"文档"
         * @param {boolean} filter (可选)是否过滤 type 不以 "image/" 开头的 blob; 默认为 true
         * @param {boolean} blob (可选)是否返回 blob，默认 false
         */
        img_blobs_to_pdf: async function(blobs, title="文档", filter=true, blob=false) {
            // 格式转换：img blob -> bmp
            let tasks = blobs;
            if (filter) {
                tasks = blobs.filter(
                    blob => blob.type.startsWith("image/")
                );
            }
            tasks = await this.gather(
                tasks.map(blob => blob.arrayBuffer())      
            );
            tasks = tasks.map(buffer => new Uint8Array(buffer));
            // 导出PDF
            return this.imgs_to_pdf(tasks, title, 0, 0, blob);
        },
 
        /**
         * 下载可以简单直接请求的图片，合并到 PDF 并导出
         * @param {Iterable<string>} urls 图片链接列表
         * @param {string} title 文档名称
         * @param {number} min_num 如果成功获取的图片数量 < min_num, 则等待 2 秒后重试; 默认 0 不重试
         * @param {boolean} clear 是否在请求完成后清理控制台输出，默认false
         * @param {boolean} blobs 是否返回二进制图片列表，默认 false（即直接导出PDF）
         */
        img_urls_to_pdf: async function(urls, title, min_num=0, clear=false, blobs=false) {
            // 强制转换为迭代器类型
            urls = urls[Symbol.iterator]();
            const first = urls.next().value;
            
            // 如果不符合同源策略，在打开新标签页
            if (!this.is_same_origin(first)) {
                console.info("URL 不符合同源策略；转为新标签页打开目标网站");
                this.open_in_new_tab((new URL(first)).origin);
                return;
            }
 
            let tasks, img_blobs, i = 3;
            // 根据请求成功数量判断是否循环
            do {
                i -= 1;
                // 发起请求
                tasks = [this.xhr_get_blob(first)];  // 初始化时加入第一个
                // 然后加入剩余的
                for (const [j, url] of this.enumerate(urls)) {
                    tasks.push(this.xhr_get_blob(url));
                    this.update_popup(`已经请求 ${j} 张图片`);
                }
                
                // 接收响应
                img_blobs = (await this.gather(tasks)).filter(
                    blob => blob.type.startsWith("image/")
                );
 
                if (clear) {
                    console.clear();
                }
 
                if (
                    min_num 
                    && img_blobs.length < min_num 
                    && i
                    ) {
                    // 下轮行动前冷却
                    console.log(`打盹 2 秒`);
                    await utils.sleep(2000);
                } else {
                    // 结束循环
                    break;
                }
            } while (true)
 
            if (blobs) return img_blobs;
            await this.img_blobs_to_pdf(img_blobs, title, false);
        },
 
        /**
         * 返回子串个数
         * @param {string} str 
         * @param {string} sub 
         */
        count_sub_str: function(str, sub) {
            return [...str.matchAll(sub)].length;
        },
 
        /**
         * 返回按钮区引用
         * @returns 
         */
        sec: function() {
            const sec = wk$(".wk-box .btns-sec")[0];
            if (!sec) throw new Error("wk 按钮区找不到");
            return sec;
        },
 
        _monkey: function() {
            const mky = wk$(".wk-box .wk-fold-btn")[0];
            if (!mky) throw new Error("wk 小猴子找不到");
            return mky;
        },
 
        /**
         * 折叠按钮区，返回是否转换了状态
         */
        fold_box: function() {
            const sec = this.sec();
            const mky = this._monkey();
            const display = getComputedStyle(sec).display;
            if (display !== "block") return false; 
            
            // 显示 -> 隐藏
            [sec, mky].forEach(
                elem => elem.classList.add("folded")
            );
            return true;
        },
 
        /**
         * 展开按钮区，返回是否转换了状态
         */
        unfold_box: function() {
            const sec = this.sec();
            const mky = this._monkey();
            const display = getComputedStyle(sec).display;
            if (display === "block") return false; 
            
            // 隐藏 -> 显示
            // 显示 -> 隐藏
            [sec, mky].forEach(
                elem => elem.classList.remove("folded")
            );
            return true;
        },
 
        /**
         * 运行基于按钮的、显示进度条的函数
         * @param {number} i 按钮序号
         * @param {Function} task 需要等待的耗时函数
         */
        run_with_prog: async function(i, task) {
            const btn = utils.btn(i);
            let new_btn;
 
            if (!wk$("#wk-popup")[0]) {
                this.add_popup();
            }
 
            this.fold_box();
            this.toID("wk-popup");
 
            new_btn = btn.cloneNode(true);
            btn.replaceWith(new_btn);
            this.onclick(
                () => utils.toID("wk-popup"), i, "显示进度"
            );
 
            try {
                await task();
            } catch(e) {
                console.error(e);
            }
 
            this.toID("");
            this.unfold_box();
            this.remove_popup();
            new_btn.replaceWith(btn);
        },
 
        /**
         * 创建5个按钮：展开文档、导出图片、导出PDF、未设定4、未设定5；除第1个外默认均为隐藏
         */
        create_btns: function() {
            // 添加样式
            document.head.insertAdjacentHTML("beforeend", style);
            // 添加按钮区
            document.body.insertAdjacentHTML("beforeend", box);
 
            // 绑定小猴子按钮回调
            const monkey = wk$(".wk-fold-btn")[0];
            // 隐藏【🙈】，展开【🐵】
            monkey.onclick = () => this.fold_box() || this.unfold_box();
        },
 
        /**
         * 添加弹窗到 body, 通过 utils.toID("wk-popup") 激发
         */
        add_popup: function() {
            document.body.insertAdjacentHTML("beforeend", popup);
        },
 
        /**
         * 设置弹窗正文
         * @param {string} text 
         */
        update_popup: function(text) {
            const body = wk$(".wk-popup-body")[0];
            if (!body) return;
            body.textContent = text;
        },
 
        /**
         * 移除弹窗
         */
        remove_popup: function() {
            this.remove(wk$(".wk-popup-container")[0]);
        },
 
        /**
         * 滚动页面到id位置的元素处
         * @param {string} id 
         */
        toID: function(id) {
            location.hash = `#${id}`;
        }
    };
 
 
    /**
     * ---------------------------------------------------------------------
     * 绑定使用 this 的函数到 utils，使其均成为绑定方法
     * ---------------------------------------------------------------------
     */
 
    /**
     * 确保特定外部脚本加载的装饰器
     * @param {string} global_obj_name 
     * @param {string} cdn_url 
     * @param {Function} func
     * @returns
     */
    function ensure_script_existed(global_obj_name, cdn_url, func) {
        async function inner(...args) {
            if (!window[global_obj_name]) {
                // 根据需要加载依赖
                await utils.load_web_script(cdn_url);
            }
            return func(...args);
        }
        // 存储参数定义
        base.superAssign(inner, func);
        return inner;
    }
 
 
    /**
     * 确保引用外部依赖的函数都在调用前加载了依赖
     */
    for (const prop of Object.keys(utils)) {
        // 跳过非函数
        if (
            !(typeof utils[prop] === "function")
            && !`${utils[prop]}`.startsWith("class")
            ) {  
            continue;
        }
 
        // 绑定this到utils
        if (/ this[.[][a-z_]/.test(`${utils[prop]}`)) {
            // 存储参数定义
            const doc = utils.help(utils[prop], false);
            // 绑死this，同时提供 __func__ 来取回原先的函数
            const fn = utils[prop];
            utils[prop] = utils[prop].bind(utils);
            utils[prop].__func__ = fn;
            // 重设参数定义
            utils[prop].__doc__ = doc;
        }
 
        // 设定 __doc__ 为访问器属性
        const doc_box = [
            utils.help(utils[prop], false)
        ];
        Object.defineProperty(utils[prop], "__doc__", {
            configurable: true,
            enumerable: true,
            get() { return doc_box.join("\n"); },
            set(new_doc) { doc_box.push(new_doc); },
        });
 
        // 为有外部依赖的函数做包装
        let obj, url;
        const name = prop.toLowerCase();
 
        if (name.includes("_to_zip")) {
            obj = "JSZip";
            url = "https://cdn.staticfile.org/jszip/3.7.1/jszip.min.js";
 
        } else if (name.includes("_to_pdf")) {
            obj = "jspdf";
            url = "https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js";
 
        } else {
            continue;
        }
        utils[prop] = ensure_script_existed(obj, url, utils[prop]);
    }
 
 
    /**
     * ---------------------------------------------------------------------
     * 为 utils 部分函数绑定更详细的说明
     * ---------------------------------------------------------------------
     */
 
    utils.b64_to_bytes.__doc__ = `
/**
 * b64编码字符串转Uint8Array
 * @param {string} sBase64 b64编码的字符串
 * @param {number} nBlockSize 字节数
 * @returns {Uint8Array} arr
 */
`;
 
    utils.blobs_to_zip.__doc__ = `
/**
 * 合并blobs到压缩包，然后下载
 * @param {Iterable<Blob>} blobs 
 * @param {string} base_name 文件名通用部分，如 image-1.jpg 中的 image
 * @param {string} ext 扩展名，如 jpg
 * @param {string} zip_name 压缩包名称
 */
`;
 
    utils.imgs_to_pdf.__doc__ = `
/**
 * 合并图像并导出PDF
 * @param {Iterable<HTMLCanvasElement | Uint8Array | HTMLImageElement>} imgs 图像元素列表
 * @param {string} title 文档标题
 * @param {number} width (可选)页面宽度 默认 0
 * @param {number} height (可选)页面高度 默认 0
 * @param {boolean} blob (可选)是否返回 blob 默认 false
 */
`;
 
    utils.img_urls_to_pdf.__doc__ = `
/**
 * 下载可以简单直接请求的图片，合并到 PDF 并导出
 * @param {Iterable<string>} urls 图片链接列表
 * @param {string} title 文档名称
 * @param {number} min_num 如果成功获取的图片数量 < min_num, 则等待 2 秒后重试; 默认 0 不重试
 * @param {boolean} clear 是否在请求完成后清理控制台输出，默认false
 */
`;
 
    utils.img_blobs_to_pdf.__doc__ = `
/**
 * 图片blobs合并并导出为单个PDF
 * @param {Array<Blob>} blobs 
 * @param {string} title (可选)文档名称, 不含后缀, 默认为"文档"
 * @param {boolean} filter (可选)是否过滤 type 不以 "image/" 开头的 blob; 默认为 true
 * @param {boolean} blob (可选)是否返回 blob
 */
`;
 
 
    /**
     * ---------------------------------------------------------------------
     * 绑定 utils 成员到 wk$，允许外部轻松调用
     * ---------------------------------------------------------------------
     */
 
    base.superAssign(wk$, utils);
    console.info("wk: `wk$` 已经挂载到全局");
 
    /**
     * 展开道客巴巴的文档
     */
    async function readAllDoc88() {
        // 获取“继续阅读”按钮
        let continue_btn = wk$("#continueButton")[0];
        // 如果存在“继续阅读”按钮
        if (continue_btn) {
            // 跳转到文末（等同于展开全文）
            let cur_page = wk$("#pageNumInput")[0];
            // 取得最大页码
            let page_max = cur_page.parentElement.textContent.replace(" / ", "");
            // 跳转到尾页
            utils.to_page(cur_page, page_max, "keypress");
            // 返回顶部
            await utils.sleep(1000);
            utils.to_page(cur_page, "1", "keypress");
        }
        // 文档展开后，显示按钮
        else {
            for (const i of utils.range(1, 6)) {
                utils.toggle_btn(i);
            }
        }
    }
 
 
    /**
     * 隐藏选择文字的弹窗
     */
    async function hideSelectPopup() {
        const
            elem = (await wk$$("#left-menu"))[0],
            hide = elem => elem.style.zIndex = -1;
        return utils.until_visible(elem).then(hide);
    }
 
 
    /**
     * 初始化任务
     */
    async function initService() {
        // 初始化
        console.log("正在执行初始化任务");
 
        // 1. 查找复制文字可能的api名称
        const prop = getCopyAPIValue();
        globalThis.doc88JS._apis = Object
            .getOwnPropertyNames(prop)
            .filter(name => {
                if (!name.startsWith("_")) {
                    return false;
                }
                if (prop[name] === "") {
                    return true;
                }
            });
        
        // 2. 隐藏选中文字的提示框
        await hideSelectPopup();
        // 3. 隐藏搜索框
        // hideSearchBox();
        // 4. 移除vip复制弹窗
        // hideCopyPopup();
    }
 
 
    /**
     * 取得 doc88JS.copy_api 所指向属性的值
     * @returns 
     */
    function getCopyAPIValue() {
        let aim = globalThis;
        for (let name of globalThis.doc88JS.copy_api) {
            aim = aim[name];
        }
        return aim;
    }
 
 
    /**
     * 返回选中的文字
     * @returns {string}
     */
    function getSelectedText() {
        // 首次复制文字，需要先找出api
        if (globalThis.doc88JS.copy_api.length === 3) {
            // 拼接出路径，得到属性
            let prop = getCopyAPIValue();  // 此时是属性，尚未取得值
 
            // 查询值
            for (let name of globalThis.doc88JS._apis) {
                let value = prop[name];
                // 值从空字符串变为非空字符串了，确认是目标api名称
                if (typeof value === 'string'
                    && value.length > 0
                    && !value.match(/\d/)  // 开头不能是数字，因为可能是 '1-179-195' 这种值
                    ) {
                    globalThis.doc88JS.copy_api.push(name);
                    break;
                }
            }
        }
        return getCopyAPIValue();
    }
 
 
    /**
     * 输出选中的文字到剪贴板和控制台，返回是否复制了文档
     * @returns {boolean} doc_is_copied
     */
    function copySelected() {
        // 尚未选中文字
        if (getComputedStyle(wk$("#left-menu")[0]).display === "none") {
            console.log("尚未选中文字");
            return false;
        }
        // 输出到控制台和剪贴板
        utils.copy_text(getSelectedText());
        return true;
    }
 
 
    /**
     * 捕获 ctrl + c 以复制文字
     * @param {KeyboardEvent} e 
     * @returns 
     */
    function onCtrlC(e) {
        // 判断是否为 ctrl + c
        if (!(e.code === "KeyC" && e.ctrlKey === true)) {
            return;
        }
 
        // 判断触发间隔
        let now = Date.now();
        // 距离上次小于0.5秒
        if (now - doc88JS.last_copy_time < 500 * 1) {
            doc88JS.last_copy_time = now;
            return;
        }
        // 大于1秒
        // 刷新最近一次触发时间
        doc88JS.last_copy_time = now;
        // 复制文字
        copySelected();
        // if (!copySelected()) return;
        
        // 停止传播
        e.stopImmediatePropagation();
        e.stopPropagation();
    }
 
 
    /**
     * 浏览并加载所有页面
     */
    async function walkThrough$2() {
        // 文档容器
        let container = wk$("#pageContainer")[0];
        container.style.display = "none";
        // 页码
        let page_num = wk$("#pageNumInput")[0];
        // 文末提示
        let tail = wk$("#readEndDiv > p")[0];
        let origin = tail.textContent;
        // 按钮
        wk$('.btns_section > [class*="btn-"]').forEach(
            elem => elem.style.display = "none"
        );
 
        // 逐页渲染
        let total = parseInt(Config.p_pagecount);
        try {
            for (let i = 1; i <= total; i++) {
                // 前往页码
                GotoPage(i);
                await utils.wait_until(async() => {
                    let page = wk$(`#page_${i}`)[0];
                    // page无法选中说明有弹窗
                    if (!page) {
                        // 关闭弹窗，等待，然后递归
                        wk$("#ym-window .DOC88Window_close")[0].click();
                        await utils.sleep(500);
                        walkThrough$2();
                        throw new Error("walkThrough 递归完成，终止函数");
                    }
                    // canvas尚未绘制时width=300
                    return page.width !== 300;
                });
                // 凸显页码
                utils.emphasize_text(page_num);
                tail.textContent = `请勿反复点击按钮，耐心等待页面渲染：${i}/${total}`;
            }
        } catch(e) {
            // 捕获退出信号，然后退出
            console.log(e);
            return;
        }
 
        // 恢复原本显示
        container.style.display = "";
        page_num.style = "";
        tail.textContent = origin;
        // 按钮
        wk$('.btns_section > [class*="btn-"]').forEach(
            elem => elem.style.display = "block"
        );
        wk$(".btns_section > .btn-1")[0].style.display = "none";
    }
 
 
    /**
     * 道客巴巴文档下载策略
     */
    async function doc88() {
        // 全局对象
        globalThis.doc88JS = {
            last_copy_time: 0,  // 上一次 ctrl + c 的时间戳（毫秒）
            copy_api: ["Core", "Annotation", "api"]
        };
 
        // 创建脚本启动按钮1、2
        utils.create_btns();
 
        // 绑定主函数
        let prepare = function() {
            // 获取canvas元素列表
            let node_list = wk$(".inner_page");
            // 获取文档标题
            let title;
            if (wk$(".doctopic h1")[0]) {
                title = wk$(".doctopic h1")[0].title;
            } else {
                title = "文档";
            }
            return [node_list, title];
        };
 
        // btn_1: 展开文档
        utils.onclick(readAllDoc88, 1);
 
        // // btn_2: 加载全部页面
        utils.onclick(walkThrough$2, 2, "加载所有页面");
        
        // btn_3: 导出PDF
        function imgsToPDF() {
            if (confirm("确定每页内容都加载完成了吗？")) {
                utils.run_with_prog(
                    3, () => utils.imgs_to_pdf(...prepare())
                );
            }
        }    utils.onclick(imgsToPDF, 3, "导出图片到PDF");
 
        // btn_4: 导出ZIP
        utils.onclick(() => {
            if (confirm("确定每页内容都加载完成了吗？")) {
                utils.canvases_to_zip(...prepare());
            }
        }, 4, "导出图片到ZIP");
 
        // btn_5: 复制选中文字
        utils.onclick(btn => {
            if (!copySelected()) {
                btn.textContent = "未选中文字";
            } else {
                btn.textContent = "复制成功！";
            }
        }, 5, "复制选中文字");
 
        // 为 ctrl + c 添加响应
        window.addEventListener("keydown", onCtrlC, true);
        // 执行一次初始化任务
        window.addEventListener(
            "mousedown", initService, { once: true, capture: true }
        );
    }
 
    function get_title$1() {
        return document.title.slice(0,-6);
    }
 
 
    function save_canvases(type) {
        return () => {
            if (!wk$(".hkswf-content2 canvas").length) {
                alert("当前页面不适用此按钮");
                return;
            }
        
            if (confirm("页面加载完毕了吗？")) {
                const title = get_title$1();
                const canvases = wk$(".hkswf-content2 canvas");
                let data_to;
 
                switch (type) {
                    case "pdf":
                        data_to = utils.imgs_to_pdf;
                        break;
 
                    case "zip":
                        data_to = utils.canvases_to_zip;
                        break;
                
                    default:
                        data_to = () => utils.raise(`未知 type: ${type}`);
                        break;
                }
                data_to(canvases, title);
            }
        }
    }
 
 
    function get_base_url() {
        // https://docimg1.docin.com/docinpic.jsp?file=2179420769&width=1000&sid=bZh4STs-f4NA88IA02INyapgA9Z5X3NN1sGo4WnpquIvk4CyflMk1Oxey1BsO1BG&pageno=2&pcimg=1
        return `https://docimg1.docin.com/docinpic.jsp?` +
            `file=` + location.pathname.match(/p-(\d+)[.]html/)[1] + 
            `&width=1000&sid=` + window.readerConfig.flash_param_hzq + 
            `&pcimg=1&pageno=`;
    }
 
 
    /**
     * 返回总页码
     * @returns {number}
     */
    function get_page_num() {
        return parseInt(
            wk$(".page_num")[0].textContent.slice(1)
        );
    }
 
    function init_save_imgs() {
        const iframe = document.createElement("iframe");
        iframe.src = "https://docimg1.docin.com/?wk=true";
        iframe.style.display = "none";
        
        let sock;
 
        /**
         * @param {MessageEvent} event 
         */
        function on_client_msg(event) {
            if (event.data.author !== "wk"
                || event.data.action !== "finish"
            ) return;
        
            sock.notListen(on_client_msg);
            iframe.remove();
            utils.toggle_btn(1);
            utils.toggle_btn(3);
        }
        
        /**
         * @param {string} type "pdf" | "zip"
         */
        return (type) => {
            return async function() {
                if (!wk$("[id*=img_] img").length) {
                    alert("当前页面不适用此按钮");
                    return;
                }
                
                utils.toggle_btn(1);
                utils.toggle_btn(3);
 
                document.body.append(iframe);
                await utils.sleep(500);
        
                sock = new utils.Socket(iframe.contentWindow);
                await sock.connect(false);
                sock.listen(on_client_msg);
                sock.talk({
                    author: "wk",
                    type,
                    title: get_title$1(),
                    base_url: get_base_url(),
                    max: get_page_num()
                });
            }
        }
    }
 
 
    const save_imgs = init_save_imgs();
 
 
    async function walk_through() {
        // 隐藏按钮
        utils.toggle_btn(5);
        // 隐藏文档页面
        wk$("#contentcontainer")[0].setAttribute("style", "visibility: hidden;");
 
        const total = get_page_num();
        const input = wk$("#page_cur")[0];
        
        for (let i = 1; i <= total; i++) {
            utils.to_page(input, i, "keydown");
            await utils.wait_until(
                () => {
                    const page = wk$(`#page_${i}`)[0];
                    const contents = wk$.call(page, `.canvas_loaded, img`);
                    return contents.length > 0;
                },
                5000
            );
        }
 
        // 显示文档页面
        wk$("#contentcontainer")[0].removeAttribute("style");
    }
 
 
    function main_page() {
        // 创建脚本启动按钮
        utils.create_btns();
        
        utils.onclick(
            save_imgs("pdf"), 1, "合并图片为PDF"
        );
        
        utils.onclick(
            save_canvases("pdf"), 2, "合并画布为PDF"
        );
        utils.toggle_btn(2);
 
        utils.onclick(
            save_imgs("zip"), 3, "打包图片到ZIP"
        );
        utils.toggle_btn(3);
        
        utils.onclick(
            save_canvases("zip"), 4, "打包画布到ZIP"
        );
        utils.toggle_btn(4);
 
        utils.onclick(
            walk_through, 5, "自动浏览页面"
        );
        utils.toggle_btn(5);
    }
 
 
 
    function init_background() {
        const sock = new utils.Socket(window.top);
 
        /**
         * @param {MessageEvent} event 
         */
        async function on_server_msg(event) {
            if (event.data.author !== "wk") return;
        
            const { title, base_url, max, type } = event.data;
            const urls = Array
                .from(utils.range(1, max + 1))
                .map(i => (base_url + i));
            
            const imgs = await utils.img_urls_to_pdf(
                urls, title, 0, false, true
            );
        
            switch (type) {
                case "pdf":
                    await utils.img_blobs_to_pdf(imgs, title);
                    break;
            
                case "zip":
                    const ext = imgs[0].type ? imgs[0].type.split("/")[1] : "png";
                    await utils.blobs_to_zip(
                        imgs, "page", ext, title
                    );
                    break;
 
                default:
                    utils.raise(`未知 type: ${type}`);
                    break;
            }
 
            sock.talk({
                author: "wk",
                action: "finish"
            });
            sock.notListen(on_server_msg);
        }
        
        return async function() {
            sock.listen(on_server_msg);
            await sock.connect(true);
        }
    }
 
 
    const background = init_background();
 
 
    /**
     * 豆丁文档下载策略
     */
    function docin() {
        const host = location.hostname;
        switch (host) {
            case "jz.docin.com":
            case "www.docin.com":
                main_page();
                break;
 
            case "docimg1.docin.com":
                background();
                break;
        
            default:
                console.log(`未知域名: ${host}`);
                break;
        }
    }
 
    function jumpToHost() {
        // https://swf.ishare.down.sina.com.cn/1DrH4Qt2cvKd.jpg?ssig=DUf5x%2BXnKU&Expires=1673867307&KID=sina,ishare&range={}-{}
        let url = wk$(".data-detail img, .data-detail embed")[0].src;
        if (!url) {
            alert("找不到图片元素");
            return;
        }
 
        let url_obj = new URL(url);
        let path = url_obj.pathname.slice(1);
        let query = url_obj.search.slice(1).split("&range")[0];
        let title = document.title.split(" - ")[0];
        let target = `${url_obj.protocol}//${url_obj.host}?path=${path}&fname=${title}&${query}`;
        // https://swf.ishare.down.sina.com.cn/
        globalThis.open(target, "hostage");
        // 然后在跳板页面发起对图片的请求
    }
 
 
    /**
     * 爱问文库下载跳转策略
     */
    function ishare() {
        // 创建按钮区
        utils.create_btns();
 
        // btn_1: 识别文档类型 -> 导出PDF
        utils.onclick(jumpToHost, 1, "到下载页面");
        // btn_2: 不支持爱问办公
        utils.onclick(() => null, 2, "不支持爱问办公");
        // utils.toggleBtnStatus(4);
    }
 
    /**
     * 返回包含对于数量svg元素的html元素
     * @param {string} data
     * @returns {HTMLDivElement} article
     */
    function _createDiv(data) {
        let num = utils.count_sub_str(data, data.slice(0, 10));
        let article = document.createElement("div");
        article.id = "article";
        article.innerHTML = `
        <style class="wk-settings">
            body {
                margin: 0px;
                width: 100%;
                background-color: rgb(95,99,104);
            }
            #article {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
            }
            #root-box {
                display: flex;
                flex-direction: column;
                background-color: white;
                padding: 0 2em;
            }
            .gap {
                height: 50px;
                width: 100%;
                background-color: transparent;
            }
        </style>
        <div id="root-box">
        ${
            `<object class="svg-box"></object>
            <div class="gap"></div>`.repeat(num)
        }
    `;
        // 移除最后一个多出的gap
        Array.from(article.querySelectorAll(".gap")).at(-1).remove();
        return article;
    }
 
 
    function setGap(height) {
        let style = wk$(".wk-settings")[0].innerHTML;
        wk$(".wk-settings")[0].innerHTML = style.replace(
            /[.]gap.*?{.*?height:.+?;/s,
            `.gap { height: ${parseInt(height)}px;`    
        );
    }
 
 
    function setGapGUI() {
        let now = getComputedStyle(wk$(".gap")[0]).height;
        let new_h = prompt(`当前间距：${now}\n请输入新间距：`);
        if (new_h) {
            setGap(new_h);
        }
    }
 
 
    function getSVGtext(data) {
        let div = document.createElement("div"); 
        div.innerHTML = data;
        return div.textContent;
    }
 
 
    function toDisplayMode1() {
        let content = globalThis["ishareJS"].content_1;
        if (!content) {
            content = globalThis["ishareJS"].text
            .replace(/\n{2,}/g, "<hr>")
            .replace(/\n/g, "<br>")
            .replace(/\s/g, "&nbsp;")
            .replace(/([a-z])([A-Z])/g, "$1 $2");  // 英文简单分词
 
            globalThis["ishareJS"].content_1 = content;
        }
 
        wk$("#root-box")[0].innerHTML = content;
    }
 
 
    function toDisplayMode2() {
        let content = globalThis["ishareJS"].content_2;
        if (!content) {
            content = globalThis["ishareJS"].text
                .replace(/\n{2,}/g, "<hr>")
                .replace(/\n/g, "")
                .replace(/\s/g, "&nbsp;")
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .split("<hr>")
                .map(paragraph => `<p>${paragraph}</p>`)
                .join("");
            
                globalThis["ishareJS"].content_2 = content;
            wk$(".wk-settings")[0].innerHTML += `
            #root-box > p {
                text-indent: 2em;
                width: 40em;
                word-break: break-word;
            }
        `;
        }
 
        wk$("#root-box")[0].innerHTML = content;
    }
 
 
    function changeDisplayModeWrapper() {
        let flag = true;
 
        function inner() {
            if (flag) {
                toDisplayMode1();
            } else {
                toDisplayMode2();
            }
            flag = !flag;
        }
        return inner;
    }
 
 
    function handleSVGtext() {
        globalThis["ishareJS"].text = getSVGtext(
            globalThis["ishareJS"].data
        );
 
        let change = changeDisplayModeWrapper();
        utils.onclick(change, 4, "切换显示模式");
 
        utils.toggle_btn(2);
        utils.toggle_btn(3);
        utils.toggle_btn(4);
        change();
    }
 
 
    /**
     * 处理svg的url
     * @param {string} svg_url 
     */
    async function handleSVGurl(svg_url) {
        let resp = await fetch(svg_url);
        let data = await resp.text();
        globalThis["ishareJS"].data = data;
 
        let sep = data.slice(0, 10);
        let svg_texts = data
            .split(sep)
            .slice(1)
            .map(svg_text => sep + svg_text);
 
        console.log(`共 ${svg_texts.length} 张图片`);
 
        let article = _createDiv(data);
        let boxes = article.querySelectorAll(".svg-box");
        boxes.forEach((obj, i) => {
            let blob = new Blob([svg_texts[i]], {type: "image/svg+xml"});
            let url = URL.createObjectURL(blob);
            obj.data = url;
            URL.revokeObjectURL(blob);
        });
 
        let body = wk$("body")[0];
        body.innerHTML = "";
        body.appendChild(article);
 
        utils.create_btns();
        utils.onclick(utils.print_page, 1, "打印页面到PDF");
        utils.onclick(setGapGUI, 2, "重设页间距");
        utils.onclick(handleSVGtext, 3, "显示空白点我");
 
        utils.toggle_btn(2);
        utils.toggle_btn(3);
    }
 
 
    /**
     * 取得图片下载地址
     * @param {string} fname 
     * @param {string} path
     * @returns 
     */
    function getImgUrl(fname, path) {
        if (!fname) {
            throw new Error("URL Param `fname` does not exist.");
        } 
        return location.href
            .replace(/[?].+?&ssig/, "?ssig")
            .replace("?", path + "?");
    }
 
 
    /**
     * 下载整个图片包
     * @param {string} img_url
     * @returns 
     */
    async function getData(img_url) {   
        let resp = await fetch(img_url);
        // window.data = await resp.blob();
        // throw Error("stop");
        let buffer = await resp.arrayBuffer();
        return new Uint8Array(buffer);
    }
 
 
    /**
     * 分切图片包为若干图片
     * @param {Uint8Array} data 多张图片合集数据包
     * @returns {Array<Uint8Array>} 图片列表
     */
    function parseData(data) {
        // 判断图像类型/拿到文件头
        let head = data.slice(0, 8);
        return utils.split_files_by_head(data, head);
    }
 
 
    /**
     * 图像Uint8数组列表合并然后导出PDF
     * @param {string} fname
     * @param {Array<Uint8Array>} img_data_list 
     */
    async function imgDataArrsToPDF(fname, img_data_list) {
        return utils.imgs_to_pdf(
            img_data_list,
            fname
        );
    }
 
 
    /**
     * 
     * @param {string} fname 文件名
     * @param {Array<Uint8Array>} img_data_list 数据列表
     */
    async function saveAsZip(fname, img_data_list) {
        await utils.blobs_to_zip(
            img_data_list,
            "page",
            "png",
            fname
        );
    }
 
 
    /**
     * 取得图片集合体并切分，如果是 SVG 则对应处理
     * @returns {Array<Uint8Array>} imgs
     */
    async function getImgs() {
        let [fname, path] = [
            window.ishareJS.fname,
            window.ishareJS.path
        ];
 
        let img_url = getImgUrl(fname, path);
 
        // 处理svg
        if (path.includes(".svg")) {
            document.title = fname;
            await handleSVGurl(img_url);
            return;
        }
        // 处理常规图像
        let data = await getData(img_url);
        let img_data_list = parseData(data);
        console.log(`共 ${img_data_list.length} 张图片`);
 
        window.ishareJS.imgs = img_data_list;
 
        // 下载完成，可以导出
        utils.onclick(exportPDF$3, 2, "下载并导出PDF");
        utils.toggle_btn(1);
        utils.toggle_btn(2);
    }
 
 
    async function exportPDF$3() {
        let args = [
            window.ishareJS.fname,
            window.ishareJS.imgs
        ];
 
        try {
            await imgDataArrsToPDF(...args);
        } catch(e) {
            console.error(e);
            
            // 因 jsPDF 字符串拼接溢出导致的 Error
            if (`${e}`.includes("RangeError: Invalid string length")) {
                // 提示失败
                alert("图片合并为 PDF 时失败，请尝试下载图片压缩包");
                // 备选方案：导出图片压缩包
                utils.onclick(
                    () => saveAsZip(...args),
                    3,
                    "导出ZIP"
                );
                utils.toggle_btn(3);  // 显示导出ZIP按钮
                utils.toggle_btn(2);  // 隐藏导出PDF按钮
            } else {
                throw e;
            }
        }
 
    }
 
 
    function showHints() {
        wk$("h1")[0].textContent = "wk 温馨提示";
        wk$("p")[0].innerHTML = [
            "下载 270 页的 PPT (70 MB) 需要约 30 秒",
            "请耐心等待，无需反复点击按钮",
            "如果很久没反应，请加 QQ 群反馈问题"
        ].join("<br>");
        wk$("hr")[0].nextSibling.textContent = "403 Page Hostaged By Wenku Doc Downloader";
    }
 
 
    /**
     * 爱问文库下载策略
     */
    async function ishareData() {
        // 全局对象
        globalThis["ishareJS"] = {
            data: "",
            imgs: [],
            text: "",
            content_1: "",
            content_2: "",
            fname: utils.get_param("fname"),
            path: utils.get_param("path")
        };
 
        // 显示提示
        showHints();
 
        // 创建按钮区
        utils.create_btns();
 
        // btn_1: 识别文档类型，处理SVG或下载数据
        utils.onclick(getImgs, 1, "下载数据");
    }
 
    /**
     * 提供提示信息
     */
    function showTips$1() {
        const h2 = document.createElement("h2");
        h2.id = "wk-tips";
        document.body.append(h2);
    }
 
 
    /**
     * 更新文字到 h2 元素
     * @param {string} text 
     */
    function update(text) {
        wk$("#wk-tips")[0].textContent = text;
    }
 
 
    /**
     * 被动连接，取出数据，请求并分割图片，导出PDF
     */
    function mainTask() {
        const sock = new utils.Socket(opener);
        sock.listen(async e => {
            if (e.data.wk && e.data.action) {
                update("图片下载中，请耐心等待...");
 
                const url = e.data.img_url;
                const resp = await fetch(url);
                update("图片下载完成，正在解析...");
 
                const buffer = await resp.arrayBuffer();
                const whole_data = new Uint8Array(buffer);
                update("图片解析完成，正在合并...");
                
                await utils.imgs_to_pdf(
                    utils.split_files_by_head(whole_data),
                    e.data.title
                );
                update("图片合并完成，正在导出 PDF...");
            }
        });
        sock.connect(true);
    }
 
 
    /**
     * 爱问文库图片下载策略v2
     * @returns 
     */
    function ishareData2() {
        showTips$1();
        if (!(window.opener && window.opener.window)) {
            update("wk: 抱歉，页面出错了");
            return;
        }
        mainTask();
    }
 
    function getPageNum() {
        // ' / 6 ' -> ' 6 '
        return parseInt(
            wk$("span.counts")[0].textContent.split("/")[1]
        );
    }
 
 
    function jumpToHostage() {
        const
            // '/fileroot/2019-9/23/73598bfa-6b91-4cbe-a548-9996f46653a2/73598bfa-6b91-4cbe-a548-9996f46653a21.gif'
            url = new URL(wk$("#pageflash_1 > img")[0].src),
            num = getPageNum(),
            // '七年级上册地理期末试卷精编.doc-得力文库'
            fname = document.title.slice(0, -5),
            path = url.pathname,
            tail = "1.gif";
        
        if (!path.endsWith(tail)) {
            throw new Error(`url尾部不为【${tail}】！path：【${path}】`);
        }
        const base_path = path.slice(0, -5);
        open(`${url.protocol}//${url.host}/?num=${num}&lmt=${lmt}&fname=${fname}&path=${base_path}`);
    }
 
 
    function deliwenku() {
        utils.create_btns();
        utils.onclick(jumpToHostage, 1, "到下载页面");
    }
 
    function showTips() {
        const body = `
        <style>
            h1 { color: black; } 
            #main {
                margin: 1vw 5%;
                border-radius: 10%;
            }
            p { font-size: large; }
            .info {
                color: rgb(230,214,110);
                background: rgb(39,40,34);
                text-align: right;
                font-size: medium;
                padding: 1vw;
                border-radius: 4px;
            }
        </style>
        <div id="main">
            <h1>wk: 跳板页面</h1>
            <p>有时候点一次下载等半天没反应，就再试一次</p>
            <p>如果试了 2 次还不行加 QQ 群反馈吧...</p>
            <p>导出的 PDF 如果页面数量少于应有的，那么意味着免费页数就这么多，我也爱莫能助</p>
            <p>短时间连续使用导出按钮会导致 IP 被封禁</p>
            <hr>
            <div class="info">
                文档名称：${deliJS.fname}<br>
                原始文档页数：${deliJS.num}<br>
                最大免费页数：${deliJS.lmt}<br>
            </div>
        </div>`;
        document.title = utils.get_param("fname");    document.body.innerHTML = body;
    }
 
 
    /**
     * url生成器
     * @param {string} base_url 
     * @param {number} num 
     */
    function* genURLs(base_url, num) {
        for (let i=1; i<=num; i++) {
            yield `${base_url}${i}.gif`;
        }
    }
 
 
    function genBaseURL(path) {
        return `${location.protocol}//${location.host}${path}`;
    }
 
 
    function parseParamsToDeliJS() {
        const
            base_url = genBaseURL(utils.get_param("path")),
            fname = utils.get_param("fname"),
            num = parseInt(utils.get_param("num"));
 
        let lmt = parseInt(utils.get_param("lmt"));
        lmt = lmt > 3 ? lmt : 20;
        lmt = lmt > num ? num : lmt;
 
        window.deliJS = {
            base_url,
            num,
            fname,
            lmt
        };
    }
 
 
    async function exportPDF$2() {
        utils.toggle_btn(1);
        await utils.run_with_prog(
            1, () => utils.img_urls_to_pdf(
                genURLs(deliJS.base_url, deliJS.num),
                deliJS.fname,
                deliJS.lmt,
                true  // 请求完成后清理控制台
            )
        );
        utils.toggle_btn(1);
    }
 
 
    /**
     * 得力文库跳板页面下载策略
     */
    async function deliFile() {
        // 从URL解析文档参数
        parseParamsToDeliJS();
        // 显示提示
        showTips();
 
        // 创建按钮区
        utils.create_btns();
        // btn_1: 导出PDF
        utils.onclick(exportPDF$2, 1, "导出PDF");
    }
 
    function readAll360Doc() {
        // 展开文档
        document.querySelector(".article_showall a").click();
        // 隐藏按钮
        utils.toggle_btn(1);
        // 显示按钮
        utils.toggle_btn(2);
        utils.toggle_btn(3);
        utils.toggle_btn(4);
    }
 
 
    function saveText_360Doc() {
        // 捕获图片链接
        let images = wk$("#artContent img");
        let content = [];
 
        for (let i = 0; i < images.length; i++) {
            let src = images[i].src;
            content.push(`图${i+1}，链接：${src}`);
        }
        // 捕获文本
        let text = wk$("#artContent")[0].textContent;
        content.push(text);
 
        // 保存纯文本文档
        let title = wk$("#titiletext")[0].textContent;
        utils.save(`${title}.txt`, content.join("\n"));
    }
 
 
    /**
     * 使文档在页面上居中
     * @param {string} selector 文档容器的css选择器
     * @param {string} default_offset 文档部分向右偏移的百分比（0-59）
     * @returns 偏移值是否合法
     */
    function centre(selector, default_offset) {
        const elem = wk$(selector)[0];
        const offset = prompt("请输入偏移百分位:", default_offset);
        
        // 如果输入的数字不在 0-59 内，提醒用户重新设置
        if (offset.length === 1 && offset.search(/[0-9]/) !== -1) {
            elem.style.marginLeft = offset + "%";
            return true;
        }
 
        if (offset.length === 2 && offset.search(/[1-5][0-9]/) !== -1) {
            elem.style.marginLeft = offset + "%";
            return true;
        }
 
        alert("请输入一个正整数，范围在0至59之间，用来使文档居中");
        return false;
    }
 
 
    function printPage360Doc() {
        if (!confirm("确定每页内容都加载完成了吗？")) {
            return;
        }
        // # 清理并打印360doc的文档页
        // ## 移除页面上无关的元素
        let selector = ".fontsize_bgcolor_controler, .atfixednav, .header, .a_right, .article_data, .prev_next, .str_border, .youlike, .new_plbox, .str_border, .ul-similar, #goTop2, #divtort, #divresaveunder, .bottom_controler, .floatqrcode";
        let elem_list = wk$(selector);
        let under_doc_1, under_doc_2;
        try {
            under_doc_1 = wk$("#bgchange p.clearboth")[0].nextElementSibling;
            under_doc_2 = wk$("#bgchange")[0].nextElementSibling.nextElementSibling;
        } catch (e) {}
        // 执行移除
        for (let elem of elem_list) {
            utils.remove(elem);
        }
        utils.remove(under_doc_1);
        utils.remove(under_doc_2);
        // 执行隐藏
        wk$("a[title]")[0].style.display = "none";
 
        // 使文档居中
        alert("建议使用:\n偏移量: 20\n缩放: 默认\n");
        if (!centre(".a_left", "20")) {
            return; // 如果输入非法，终止函数调用
        }
        // 隐藏按钮，然后打印页面
        utils.print_page();
    }
 
 
    /**
     * 阻止监听器生效
     * @param {Event} e 
     */
    function stopSpread(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
    }
 
 
    /**
     * 阻止捕获事件
     */
    function stopCapturing() {
        ["click", "mouseup"].forEach(
            type => {
                document.body.addEventListener(type, stopSpread, true);
                document["on" + type] = undefined;
            }
        );
        
        ["keypress", "keydown"].forEach(
            type => {
                window.addEventListener(type, stopSpread, true);
                window["on" + type] = undefined;
            }
        );
    }
 
 
    /**
     * 重置图像链接和最大宽度
     * @param {Document} doc
     */
    function resetImg(doc=document) {
        wk$.call(doc, "img").forEach(
            elem => {
                elem.style.maxWidth = "100%";
                for (let attr of elem.attributes) {
                    if (attr.name.endsWith("-src")) {
                        elem.setAttribute("src", attr.value);
                        break;
                    }
                }
            }
        );
    }
 
 
    /**
     * 仅保留全屏文档
     */
    function getFullScreen() {
        FullScreenObj.init();
        wk$("#artContent > p:nth-child(3)")[0]?.remove();
        let data = wk$("#artfullscreen__box_scr > table")[0].outerHTML;
        window.doc360JS = { data };
        let html_str = `
        <html><head></head><body style="display: flex; flex-direction: row; justify-content: space-around">
            ${data}
        </body><html>
    `;
        wk$("html")[0].replaceWith(wk$("html")[0].cloneNode());
        wk$("html")[0].innerHTML = html_str;
        resetImg();
    }
 
 
    function cleanPage() {
        getFullScreen();
        stopCapturing();
    }
 
 
    /**
     * 360doc个人图书馆下载策略
     */
    function doc360() {
        // 创建按钮区
        utils.create_btns();
        // btn_1: 展开文档
        utils.onclick(readAll360Doc, 1);
        // btn_2: 导出纯文本
        utils.onclick(saveText_360Doc, 2, "导出纯文本");
        // btn_3: 打印页面到PDF
        utils.onclick(printPage360Doc, 3, "打印页面到PDF");
        // btn_3: 清理页面
        utils.onclick(cleanPage, 4, "清理页面(推荐)");
    }
 
    async function getPDF() {
        if (!window.DEFAULT_URL) {
            alert("当前文档无法解析，请加 QQ 群反馈");
            return;
        }
        let title = document.title.split(" - ")[0] + ".pdf";
        let blob = await utils.xhr_get_blob(DEFAULT_URL);
        utils.save(title, blob);
    }
 
 
    function mbalib() {
        utils.create_btns();
        utils.onclick(getPDF, 1, "下载PDF");
    }
 
    /**
     * 判断是否进入预览模式
     * @returns Boolean
     */
    function isInPreview() {
        let p_elem = wk$("#preview_tips")[0];
        if (p_elem && p_elem.style && p_elem.style.display === "none") {
            return true;
        }
        return false;
    }
 
 
    /**
     * 确保进入预览模式
     */
    async function ensureInPreview() {
        while (!isInPreview()) {
            // 如果没有进入预览，则先进入
            if (typeof window.preview !== "function") {
                alert("脚本失效，请加 QQ 群反馈");
                throw new Error("preview 全局函数不存在");
            }
 
            await utils.sleep(500);
            preview();
        }
    }
 
 
    /**
     * 前往页码
     * @param {number} page_num 
     */
    function toPage(page_num) {
        // 先尝试官方接口，不行再用模拟的
        try {
            Viewer._GotoPage(page_num);
        } catch(e) {
            console.error(e);
            utils.to_page(
                wk$("#pageNumInput")[0],
                page_num,
                "keydown"
            );
        }
    }
 
 
    /**
     * 展开全文预览，当展开完成后再次调用时，返回true
     * @returns 
     */
    async function walkThrough$1() {
        // 隐藏页面
        wk$("#pageContainer")[0].style.display = "none";
 
        // 逐页加载
        let lmt = window.dugenJS.lmt;
        for (let i of utils.range(1, lmt + 1)) {
            toPage(i);
            await utils.wait_until(
                () => wk$(`#outer_page_${i}`)[0].style.width.endsWith("px")
            );
        }
 
        // 恢复显示
        wk$("#pageContainer")[0].style.display = "";
        console.log(`共 ${lmt} 页加载完毕`);
    }
 
 
    /**
     * 返回当前未加载页面的页码
     * @returns not_loaded
     */
    function getNotloadedPages() {
        // 已经取得的页码
        let pages = document.querySelectorAll("[id*=pageflash_]");
        let loaded = new Set();
        pages.forEach((page) => {
            let id = page.id.split("_")[1];
            id = parseInt(id);
            loaded.add(id);
        });
        // 未取得的页码
        let not_loaded = [];
        for (let i of utils.range(1, window.dugenJS.lmt + 1)) {
            if (!loaded.has(i)) {
                not_loaded.push(i);
            }
        }
        return not_loaded;
    }
 
 
    /**
     * 取得全部文档页面的链接，返回urls；如果有页面未加载，则返回null
     * @returns
     */
    function getImgUrls() {
        let pages = wk$("[id*=pageflash_]");
        // 尚未浏览完全部页面，返回false
        if (pages.length < window.dugenJS.lmt) {
            let hints = [
                "尚未加载完全部页面",
                "以下页面需要浏览并加载：",
                getNotloadedPages().join(",")
            ];
            alert(hints.join("\n"));
            return [false, []];
        }
        // 浏览完全部页面，返回urls
        return [true, pages.map(page => page.querySelector("img").src)];
    }
 
 
    function exportImgUrls() {
        let [ok, urls] = getImgUrls();
        if (!ok) {
            return;
        }
        utils.save("urls.csv", urls.join("\n"));
    }
 
 
    function exportPDF$1() {
        let [ok, urls] = getImgUrls();
        if (!ok) {
            return;
        }
        let title = document.title.split("－")[0];
        return utils.run_with_prog(
            3, () => utils.img_urls_to_pdf(urls, title)
        );
    }
 
 
    /**
     * dugen文档下载策略
     */
    async function dugen() {
        await ensureInPreview();
        // 全局对象
        window.dugenJS = {
            lmt: window.lmt ? window.lmt : 20
        };
 
        // 创建按钮区
        utils.create_btns();
 
        // 绑定监听器
        // 按钮1：展开文档
        utils.onclick(walkThrough$1, 1, "加载可预览页面");
        // 按钮2：导出图片链接
        utils.onclick(exportImgUrls, 2, "导出图片链接");
        utils.toggle_btn(2);
        // 按钮3：导出PDF
        utils.onclick(exportPDF$1, 3, "导出PDF");
        utils.toggle_btn(3);
    }
 
    // 域名级全局常量
    const img_tasks = [];
 
 
    /**
     * 取得文档类型
     * @returns {String} 文档类型str
     */
    function getDocType() {
        const
            // ["icon", "icon-format", "icon-format-doc"]
            elem = wk$(".title .icon.icon-format")[0],
            // "icon-format-doc"
            cls = elem.classList[2];    
        return cls.split("-")[2];
    }
 
 
    /**
     * 判断文档类型是否为type_list其中之一
     * @returns 是否为type
     */
    function isTypeof(type_list) {
        const type = getDocType();
        if (type_list.includes(type)) {
            return true;
        }
        return false;
    }
 
 
    /**
     * 判断文档类型是否为PPT
     * @returns 是否为PPT
     */
    function is_ppt() {
        return isTypeof(["ppt", "pptx"]);
    }
 
 
    /**
     * 判断文档类型是否为Excel
     * @returns 是否为Excel
     */
    function is_excel() {
        return isTypeof(["xls", "xlsm", "xlsx"]);
    }
 
 
    /**
     * 取得未加载页面的页码
     * @returns {Array} not_loaded 未加载页码列表
     */
    function getNotLoaded() {
        const loaded = wk$("[data-id] img[src]").map(
            img => parseInt(
                img.closest("[data-id]").getAttribute("data-id")
            )
        );
        return Array.from(
            utils.diff(
                utils.range(1, window.book118JS.page_counts + 1),
                loaded
            )
        );
    }
 
 
    /**
     * 取得全部文档页的url
     * @returns [<是否全部加载>, <urls列表>, <未加载页码列表>]
     */
    function getUrls() {
        const urls = wk$("[data-id] img[src]").map(
            img => img.src
        );
        // 如果所有页面加载完毕
        if (urls.length === book118JS.page_counts) {
            return [true, urls, []];
        }
        // 否则收集未加载页面的url
        return [false, urls, getNotLoaded()];
    }
 
 
    /**
     * 展开全文
     */
    async function walkThrough() {
        // 遍历期间隐藏按钮区
        utils.toggle_box();
 
        // 取得总页码
        // preview.getPage()
        // {current: 10, actual: 38, preview: 38, remain: 14}
        const { preview: all } = preview.getPage();
        for (let i = 1; i <= all; i++) {
            // 逐页加载
            preview.jump(i);
            await utils.wait_until(
                () => wk$(`[data-id="${i}"] img`)[0].src, 1000
            );
        }
        console.log("遍历完成");
        utils.toggle_box();
    }
 
 
    /**
     * btn_2: 导出图片链接
     */
    function wantUrls() {
        let [flag, urls, escaped] = getUrls();
        // 页面都加载完毕，下载urls
        if (!flag) {
            // 没有加载完，提示出未加载好的页码
            const hint = [
                "仍有页面没有加载",
                "请浏览并加载如下页面",
                "是否继续导出图片链接？",
                "[" + escaped.join(",") + "]"
            ].join("\n");
            // 终止导出
            if (!confirm(hint)) {
                return
            }
        }
        utils.save("urls.csv", urls.join("\n"));
    }
 
 
    /**
     * 打开PPT预览页面
     */
    async function open_iframe() {
        wk$(".front a")[0].click();
        const iframes = await wk$$("iframe.preview-iframe");
        window.open(iframes[0].src);
    }
 
 
    /**
     * 取得最大页码
     * @returns {number} 最大页码
     */
    function getPageCounts$1() {
        return window?.preview?.getPage()?.preview || NaN;
    }
 
 
    /**
     * 原创力文档(非PPT或Excel)下载策略
     */
    async function common_doc() {
        await utils.wait_until(
            () => !!wk$(".counts")[0]
        );
 
        // 创建全局对象
        window.book118JS = {
            doc_type: getDocType(),
            page_counts: getPageCounts$1()
        };
 
        // 处理非PPT文档
        // 创建按钮组
        utils.create_btns();
        // 绑定监听器到按钮
        // 按钮1：加载全文
        utils.onclick(walkThrough, 1, "加载全文");
        // 按钮2：导出图片链接
        utils.onclick(wantUrls, 2, "导出图片链接");
        utils.toggle_btn(2);
    }
 
 
    /**
     * @returns {string}
     */
    function table_to_tsv() {
        return wk$("table").map(table => {
            // 剔除空表和行号表
            const len = table.rows.length;
            if (len > 1000 || len === 1) {
                return "";
            }
 
            // 遍历行
            return [...table.rows].map(row => {
                // 遍历列（单元格）
                return [...row.cells].map(cell => {
                    // 判断单元格是否存储图片
                    const img = cell.querySelector("img");
                    if (img) {
                        // 如果是图片，保存图片链接
                        return img.src;
                    }
                    
                    // 否则保存单元格文本
                    return cell
                        .textContent
                        .trim()
                        .replace(/\n/g, "  ")
                        .replace(/\t/g, "    ");
                }).join("\t");
            }).join("\n").trim();
        }).join("\n\n---\n\n");
    }
 
 
    /**
     * 下载当前表格内容，保存为csv（utf-8编码）
     */
    function wantEXCEL() {
        const tsv = table_to_tsv();
        const bytes = utils.encode_to_gbk(tsv);
        const fname = "原创力表格.tsv";
        utils.save(fname, bytes);
    }
 
 
    /**
     * 在Excel预览页面给出操作提示
     */
    function help$1() {
        const hint = [
            "【导出表格到TSV】只能导出当前 sheet",
            "如果有多张 sheet 请在每个 sheet 上用按钮分别导出 TSV",
            "TSV 文件请用记事本或 Excel 打开",
            "TSV 不能存储图片，所以用图片链接代替",
            "或使用此脚本复制表格到剪贴板：",
            "https://greasyfork.org/zh-CN/scripts/469550",
        ];
        alert(hint.join("\n"));
    }
 
 
    /**
     * 原创力文档(EXCEL)下载策略
     */
    function excel() {
        // 创建按钮区
        utils.create_btns();
        // 绑定监听器到按钮
        utils.onclick(wantEXCEL, 1, "导出表格到TSV");
        utils.onclick(help$1, 2, "使用说明");
        // 显示按钮
        utils.toggle_btn(2);
    }
 
 
    /**
     * ------------------------------ PPT 策略 ---------------------------------
     */
 
 
    /**
     * 返回当前页码
     * @returns {number}
     */
    function cur_page_num() {
        return parseInt(
            wk$("#PageIndex")[0].textContent
        );
    }
 
 
    function add_page() {
        const view = wk$("#view")[0];
        view.setAttribute("style", "");
 
        const i = cur_page_num() - 1;
        const cur_view = wk$(`#view${i}`)[0];
 
        img_tasks.push(
            html2canvas(cur_view)
        );
        utils.btn(1).textContent = `截图: ${img_tasks.length}`;
    }
 
 
    function reset_tasks() {
        img_tasks.splice(0);
        utils.btn(1).textContent = `截图: 0`;
    }
 
 
    function canvas_to_blob(canvas) {
        return utils.canvas_to_blob(canvas);
    }
 
 
    async function export_imgs_as_pdf() {
        alert("正在合并截图，请耐心等待");
        utils.toggle_btn(3);
 
        try {
            const imgs = await utils.gather(img_tasks);
            const blobs = await utils.gather(
                imgs.map(canvas_to_blob)
            );
 
            if (!blobs.length) {
                alert("你尚未截取任何页面！");
            } else {
                await utils.img_blobs_to_pdf(blobs, "原创力幻灯片");
            }
        } catch(err) {
            console.error(err);
        }
        
        utils.toggle_btn(3);
    }
 
 
 
    function ppt() {
        utils.create_btns();
 
        const btn1 = utils.btn(1);
        btn1.onclick = add_page;
        btn1.textContent = "截图当前页面";
 
        utils.onclick(reset_tasks, 2, "清空截图");
        utils.onclick(export_imgs_as_pdf, 3, "合并为PDF");
 
        utils.toggle_btn(2);
        utils.toggle_btn(3);
    }
 
 
    /**
     * 原创力文档下载策略
     */
    function book118() {
        const host = window.location.hostname;
 
        if (host === 'max.book118.com') {
            if (is_excel()) {
                utils.create_btns();
                utils.onclick(open_iframe, 1, "访问EXCEL");
            } else if (is_ppt()) {
                utils.create_btns();
                utils.onclick(open_iframe, 1, "访问PPT");
            } else {
                common_doc();
            }
        
        } else if (wk$("#ppt")[0]) {
            if (window.top !== window) return;
            ppt();
        
        } else if (wk$(`[src*="excel.min.js"]`)[0]) {
            excel();
        
        } else {
            console.log(`wk: Unknown host: ${host}`);
        }
    }
 
    // test url: https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=E86BBCE32DA8E67F3DA04ED98F2465DB
 
 
    /**
     * 绘制0x0的bmp, 作为请求失败时返回的page
     * @returns {Promise<ImageBitmap>} blank_page
     */
    async function blankBMP() {
        let canvas = document.createElement("canvas");
        [canvas.width, canvas.height] = [0, 0];
        return createImageBitmap(canvas);
    }
 
 
    /**
     * resp导出bmp
     * @param {string} page_url 
     * @param {Promise<Response> | ImageBitmap} pms_or_bmp 
     * @returns {Promise<ImageBitmap>} page
     */
    async function respToPage(page_url, pms_or_bmp) {
        let center = globalThis.gb688JS;
        // 此时是bmp
        if (pms_or_bmp instanceof ImageBitmap) {
            return pms_or_bmp;
        }
 
        // 第一次下载, 且无人处理
        if (!center.pages_status.get(page_url)) {
            // 处理中, 设为占用
            center.pages_status.set(page_url, 1);
 
            // 处理
            let resp;
            try {
                resp = await pms_or_bmp;
            } catch(err) {
                console.log("下载页面失败");
                console.error(err);
                return blankBMP();
            }
 
            let page_blob = await resp.blob();
            let page = await createImageBitmap(page_blob);
            center.pages.set(page_url, page);
            
            // 处理结束, 设为释放
            center.pages_status.set(page_url, 0);
            return page;
        }
 
        // 有人正在下载且出于处理中
        while (center.pages_status.get(page_url)) {
            await utils.sleep(500);
        }
        return center.pages.get(page_url);
    }
 
 
    /**
     * 获得PNG页面
     * @param {string} page_url 
     * @returns {Promise<ImageBitmap>} bmp
     */
    async function getPage(page_url) {
        // 如果下载过, 直接返回缓存
        let pages = globalThis.gb688JS.pages;
        if (pages.has(page_url)) {
            return respToPage(page_url, pages.get(page_url));
        }
 
        // 如果从未下载过, 就下载
        let resp = fetch(page_url, {
            "headers": {
                "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                "proxy-connection": "keep-alive"
            },
            "referrer": location.href,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        pages.set(page_url, resp);
        return respToPage(page_url, resp);
    }
 
 
    /**
     * 返回文档页div的裁切和粘贴位置信息: [[cut_x, cut_y, paste_x%, paset_y%],...]
     * @param {HTMLDivElement} page_div 文档页元素
     * @returns {Array<Array<number>>} positions
     */
    function getPostions(page_div) {
        let positions = [];
 
        Array.from(page_div.children).forEach(span => {
            // 'pdfImg-3-8' -> {left: 30%; top: 80%;}
            let paste_pos = span.className.split("-").slice(1).map(
                v => parseInt(v) / 10
            );
            // '-600px 0px' -> [600, 0]
            let cut_pos = span.style.backgroundPosition.split(" ").map(
                v => Math.abs(parseInt(v))
            );
            positions.push([...cut_pos, ...paste_pos]);
        });
        return positions;
    }
 
 
    /**
     * 取得文档页的图像url
     * @param {HTMLDivElement} page_div 
     * @returns {string} url
     */
    function getPageURL(page_div) {
        // 拿到目标图像url
        let path = location.pathname.split("/").slice(0, -1).join("/");
        let prefix = location.origin + path + "/";
        let url = page_div.getAttribute("bg");
        if (!url) {
            // 'url("viewGbImg?fileName=VS72l67k0jw5g3j0vErP8DTsnWvk5QsqnNLLxaEtX%2FM%3D")'
            url = page_div.children[0].style.backgroundImage.split('"')[1];
        }
        return prefix + url;
    }
 
 
    /**
     * 下载目标图像并拆解重绘, 返回canvas
     * @param {number} i 第 i 页 (从0开始)
     * @param {HTMLDivElement} page_div
     * @returns {Promise<Array>} [页码, Canvas]
     */
    async function getAndDrawPage(i, page_div) {
        // 拿到目标图像
        let url = getPageURL(page_div);
        let page = await getPage(url);
 
        // 绘制空白A4纸背景
        let [page_w, page_h] = [1190, 1680];
        let bg = document.createElement("canvas");
        bg.width = page_w;  // 注意canvas作为取景框的大小
        bg.height = page_h;  // 如果不设置等于一个很小的取景框
        
        let bg_ctx = bg.getContext("2d");
        bg_ctx.fillStyle = "white";
        bg_ctx.fillRect(0, 0, page_w, page_h);
 
        // 逐个区块剪切取出并粘贴
        // wk$("#viewer .page").forEach(page_div => {
        getPostions(page_div).forEach(pos => {
            bg_ctx.drawImage(
                page,  // image source
                pos[0],  // source x
                pos[1],  // source y
                120,  // source width
                169,  // source height
                pos[2] * page_w,  // destination x = left: x%
                pos[3] * page_h,  // destination y = top: y%
                120,  // destination width
                169  // destination height
            );
        });
        // });
        return [i, bg];
    }
 
 
    /**
     * 页面批量请求、裁剪重绘, 合成PDF并下载
     */
    async function turnPagesToPDF() {
        // 渲染每页
        const tasks = wk$("#viewer .page").map(
            (page_div, i) => getAndDrawPage(i, page_div)
        );
        
        // 等待每页渲染完成后，排序
        const results = await utils.gather(tasks);
        results.sort((prev, next) => prev[0] - next[0]);
        
        // 合并为PDF并导出
        return utils.imgs_to_pdf(
            results.map(item => item[1]),
            // '在线预览|GB 14023-2022'
            document.title.split("|")[1]
        );
    }
 
 
    /**
     * 提示预估下载耗时，然后下载
     */
    function hintThenDownload$1() {
        // '/93'
        let page_num = parseInt(wk$("#numPages")[0].textContent.slice(1));
        let estimate = Math.ceil(page_num / 3);
        alert(`页数: ${page_num}，预计花费: ${estimate}秒；如遇网络异常可能更久\n请勿反复点击按钮；如果无法导出请 QQ 群反馈`);
        turnPagesToPDF();
    }
 
 
    /**
     * gb688文档下载策略
     */
    async function gb688() {
        // 创建全局对象
        globalThis.gb688JS = {
            pages: new Map(),  // {url: bmp}
            pages_status: new Map()  // {url: 0或1} 0释放, 1占用
        };
 
        // 创建按钮区
        utils.create_btns();
        // 绑定监听器
        // 按钮1：导出PDF
        utils.onclick(hintThenDownload$1, 1, "导出PDF");
    }
 
    function getPageCounts() {
        // " / 39"
        const counts_str = wk$(".counts")[0].textContent.split("/")[1];
        const counts = parseInt(counts_str);
        return counts > 20 ? 20 : counts;
    }
 
 
    /**
     * 返回图片基础路径
     * @returns {string} base_url
     */
    function getImgBaseURL() {
        return wk$("#dp")[0].value;
    }
 
 
    function* genImgURLs$1() {
        let counts = getPageCounts();
        let base_url = getImgBaseURL();
        for (let i = 1; i <= counts; i++) {
            yield base_url + `${i}.gif`;
        }
    }
 
 
    /**
     * 下载图片，转为canvas，合并为PDF并下载
     * @returns {Promise<void>}
     */
    function fetchThenExportPDF() {
        // db2092-2014-河北特种设备使用安全管理规范_安全文库网safewk.com
        let title = document.title.split("_")[0];
        return utils.img_urls_to_pdf(genImgURLs$1(), title);
    }
 
 
    /**
     * 提示预估下载耗时，然后下载
     */
    function hintThenDownload() {
        let hint = [
            "只能导出可预览的页面(最多20页)",
            "请勿短时间反复点击按钮，导出用时大约不到 10 秒",
            "点完后很久没动静请至 QQ 群反馈"
        ];
        alert(hint.join("\n"));
        return utils.run_with_prog(
            1, fetchThenExportPDF
        );
    }
 
 
    /**
     * safewk文档下载策略
     */
    async function safewk() {
        // 创建按钮区
        utils.create_btns();
        // 绑定监听器
        // 按钮1：导出PDF
        utils.onclick(
            hintThenDownload, 1, "导出PDF"
        );
    }
 
    /**
     * 跳转到页码
     * @param {string | number} num 
     */
    function _to_page(num) {
        if (window.WebPreview
            && WebPreview.Page
            && WebPreview.Page.jump
        ) {
            WebPreview.Page.jump(parseInt(num));
        } else {
            console.error("window.WebPreview.Page.jump doesn't exist");
        }
    }
 
 
    /**
     * 跳转页码GUI版
     */
    function to_page() {
        let num = prompt("请输入要跳转的页码")?.trim();
        if (/^[0-9]+$/.test(num)) {
            _to_page(num);
        } else {
            console.log(`输入值 [${num}] 不是合法整数`);
        }
    }
 
 
    function capture_urls() {
        if (!confirm(
            "只能导出已经预览页面的链接，是否继续？"
        )) return;
 
        let imgs = wk$("[data-id] img");
        if (imgs.length === 0) {
            imgs = wk$("img[data-page]");
        }
        console.log(imgs);
 
        const urls = imgs.map(img => {
            const src = img.dataset.src || img.src;
            if (!src) return;
            return src.startsWith("//") ? "https:" + src : src
        });
        
        const lacked = [];
        const existed = urls.filter((url, i) => {
            if (url) return true;
            lacked.push(i + 1);
        });
 
        utils.save_urls(existed);
        alert(
            `已经浏览的页面中有 ${lacked.length} 页图片尚未加载，` +
            `已经从结果中剔除。\n它们的页码是：\n${lacked}`
        );
    }
 
 
    function* genImgURLs() {
        const params = window?.previewParams;
        if (!params) throw new Error(
            "接口为空: window.previewParams"
        );
 
        let i = -4;
        const
            base = "https://openapi.renrendoc.com/preview/getPreview?",
            query = {
                temp_view: 0,
                jsoncallback: "a",
                callback: "b",
                encrypt: params.encrypt,
                doc_id: params.doc_id,
                get _() { return Date.now() },
                get start() { return i += 5; },
            };
        
        while (true) {
            const keys = Reflect.ownKeys(query);
            yield base + keys.map(
                key => `${key}=${query[key]}`
            ).join("&");
        }
    }
 
 
    async function _fetch_preview_urls() {
        let
            is_empty = true,
            switch_counts = 0,
            previews = [];
        
        for (const [i, url] of utils.enumerate(genImgURLs())) {
            const resp = await fetch(url);
                utils.raise_for_status(resp);
                const raw_data = await resp.text(),
                data = raw_data.slice(2, -1),
                img_urls = JSON
                    .parse(data)
                    .data
                    ?.preview_list
                    ?.map(pair => pair.url);
            if (!img_urls) break;
 
            previews = previews.concat(...img_urls);
            utils.update_popup(`已经请求 ${i + 1} 组图片链接`);
            
            if (is_empty !== (img_urls.length ? false : true)) {
                is_empty = !is_empty;
                switch_counts++;
            }
            if (switch_counts === 2) break;
 
            await utils.sleep(1000);
        }
        
        const
            params = window.previewParams,
            free = params.freepage || 20,
            base = params.pre || wk$(".page img")[0].src.slice(0, -5),
            free_urls = Array.from(
                utils.range(1, free + 1)
            ).map(
                n => `${base}${n}.gif`
            );
 
        const urls = free_urls.concat(...previews);
        utils.save_urls(urls);
    }
 
 
    function fetch_preview_urls() {
        return utils.run_with_prog(
            3, _fetch_preview_urls
        );
    }
 
 
    function help() {
        alert(
            "【捕获】和【请求】图片链接的区别：\n" + 
            " - 【捕获】是从当前已经加载的文档页中提取图片链接\n" + 
            " - 【请求】是使用官方接口直接下载图片链接\n" + 
            " - 【捕获】使用麻烦，但是稳定\n" + 
            " - 【请求】使用简单，速度快，但可能失效"
        );
    }
 
 
    /**
     * 人人文档下载策略
     */
    async function renrendoc() {
        utils.create_btns();
        
        utils.onclick(to_page, 1, "跳转到页码");
        utils.onclick(capture_urls, 2, "捕获图片链接");
        utils.onclick(fetch_preview_urls, 3, "请求图片链接");
        utils.onclick(help, 4, "使用说明");
 
        utils.toggle_btn(2);
        utils.toggle_btn(3);
        utils.toggle_btn(4);
    }
 
    /**
     * 取得全部图片连接
     * @returns {Array<string>}
     */
    function get_img_urls() {
        const src = wk$("#page1 img")[0]?.src;
 
        // 适用于图片类型
        if (src) {
            const path = src.split("?")[0].split("/").slice(3, -1).join("/");
            const origin = new URL(location.href).origin;
        
            const urls = window.htmlConfig.fliphtml5_pages.map(obj => {
                const fname = obj.n[0].split("?")[0].split("/").at(-1);
                return `${origin}/${path}/${fname}`;
            });
            const unique = [...new Set(urls)];
        
            window.img_urls = unique;
            return unique;
        }
 
        // 适用于其他类型
        const relative_path = wk$(".side-image img")[0].getAttribute("src").split("?")[0];
        // ../files/large/
        const relative_dir = relative_path.split("/").slice(0, -1).join("/") + "/";
 
        const base = location.href;
        const urls = window.htmlConfig.fliphtml5_pages.map(obj => {
            // "../files/large/d8b6c26f987104455efb3ec5addca7c9.jpg"
            const path = relative_dir + obj.n[0].split("?")[0];
            const url = new URL(path, base);
            // https://book.yunzhan365.com/mctl/itid/files/large/d8b6c26f987104455efb3ec5addca7c9.jpg
            return url.href.replace("/thumb/", "/content-page/");
        });
 
        window.img_urls = urls;
        return urls;
    }
 
 
    function imgs_to_pdf() {
        const urls = get_img_urls();
        const title = document.title;
        const task = () => utils.img_urls_to_pdf(urls, title);
 
        utils.run_with_prog(1, task);
        alert(
            "正在下载图片，请稍等，时长取决于图片数量\n" +
            "如果导出的文档只有一页空白页，说明当前文档不适用"
        );
    }
 
 
    /**
     * 将数组中的连续数字描述为字符串
     * 例如 [1, 2, 3, 5] => "1 - 3, 5"
     * @param {number[]} nums 整数数组
     * @returns {string} 描述数组的字符串
     */
    function describe_nums(nums) {
        let result = "";
        let start = nums[0];
        let end = nums[0];
        
        for (let i = 1; i < nums.length; i++) {
            if (nums[i] === end + 1) {
                end = nums[i];
            } else {
                if (start === end) {
                result += start + ", ";
                } else {
                result += start + " - " + end + ", ";
                }
                start = nums[i];
                end = nums[i];
            }
        }
        
        if (start === end) {
            result += start;
        } else {
            result += start + " - " + end;
        }
        
        return result;
    }
 
 
    /**
     * 取得总页码（作为str）
     * @returns {string}
     */
    function get_total() {
        const total = window?.bookConfig?.totalPageCount;
        if (total) {
            return String(total);
        }
        return wk$("#tfPageIndex input")[0].value.split("/")[1].trim();
    }
 
 
    /**
     * 下载稀疏数组的pdf数据，每个元素应该是 [pdf_blob, pwd_str]
     * @param {Array} pdfs_data 
     */
    async function data_to_zip(pdfs_data) {
        // 导入jszip
        await utils.blobs_to_zip([], "empty", "dat", "empty", false);
 
        // 分装截获的数据
        const page_nums = Object.keys(pdfs_data)
            .map(index => parseInt(index) + 1);
        const len = page_nums.length;
        const pwds = new Array(len + 1);
        pwds[0] = "page-num,password";
        
        // 创建压缩包，归档加密的PDF页面
        const zip = new window.JSZip();
        const total = get_total();
        const digits = total.length;
 
        // 归档
        for (let i = 0; i < len; i++) {
            // 页码左侧补零
            const page_no = page_nums[i];
            const page_no_str = page_no.toString().padStart(digits, "0");
            // 记录密码
            pwds[i+1] = `${page_no_str},${pdfs_data[page_no - 1][1]}`;
            // 添加pdf内容到压缩包
            const blob = pdfs_data[page_no - 1][0];
            zip.file(`page-${page_no_str}.pdf`, blob, { binary: true });
        }
        console.log("zip:", zip);
 
        // 添加密码本到压缩包
        const pwds_blob = new Blob([pwds.join("\n")], { type: "text/plain" });
        zip.file(`密码本.txt`, pwds_blob, { binary: true });
        
        // 下载
        console.info("正在合成压缩包并导出，请耐心等待几分钟......");
        const zip_blob = await zip.generateAsync({ type: "blob" });
        utils.save(`${document.title}.zip`, zip_blob, "application/zip");
    }
 
 
    /**
     * 下载多个pdf为一个压缩包，其中包含一个密码本
     * @param {PointerEvent} event
     */
    async function export_zip(event) {
        // 异常判断
        if (!window.pdfs_data) utils.raise(`pdfs_data 不存在！`);
 
        // 确认是否继续导出PDF
        const page_nums = Object.keys(pdfs_data)
            .map(index => parseInt(index) + 1);
        const donwload = confirm(
            `已经捕获 ${page_nums.length} 个页面，是否导出？\n` +
            `已捕获的页码：${describe_nums(page_nums)}\n` + 
            `(如果某页缺失可以先多向后翻几页，然后翻回来，来重新加载它)`
        );
        if (!donwload) return;
        
        // 隐藏按钮
        const btn = event.target;
        btn.style.display = "none";
 
        // 下载压缩包
        await data_to_zip(pdfs_data);
 
        // 显示按钮
        btn.style.display = "block";
    }
 
 
    function steal_pdf_when_page_loaded() {
        // 共用变量
        // 存放pdf数据，[[<pdf_blob>, <pwd_str>], ...]
        window.pdfs_data = [];
        // 代表当前页码
        let page_no = NaN;
 
        // hook PdfLoadingTask.prototype.start
        const _start = PdfLoadingTask.prototype.start;
        wk$._start = _start;
        PdfLoadingTask.prototype.start = function() {
            // 取得页码
            page_no = this.index;
 
            // 如果不存在此页，则准备捕获此页面
            if (!pdfs_data[page_no - 1]) {
                pdfs_data[page_no - 1] = [];
            }
            
            return _start.call(this);
        };
 
        // hook getBlob
        const _get_blob = getBlob;
        wk$._get_blob = _get_blob;
        window.getBlob = async function(param) {
            const result = await _get_blob.call(this, param);
            // 如果当前页面需要捕获，则设置对应项的密码
            if (page_no > 0) {
                const resp = await fetch(result.url);
                const blob = await resp.blob();
 
                pdfs_data[page_no - 1] = [blob, result.password];
                page_no = NaN;
            } 
            return result;
        };
 
        utils.onclick(export_zip, 1, "导出PDF压缩包");
    }
 
 
    /**
     * 请求 url 并将资源转为 [pdf_blob, password_str]
     * @param {string} url
     * @returns {Array} 
     */
    async function url_to_item(url) {
        // 取得pdf数据
        const resp = await fetch(url);
        const buffer = await resp.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const len = bytes.length;
 
        // 更新进度
        window.downloaded_count++;
        window.downloaded_size += len;
        console.log(
            `已经下载了 ${downloaded_count} 页，\n` +
            `累计下载了 ${(downloaded_size / 1024 / 1024).toFixed(1)} MB`
        );
 
        // 取出密钥
        const pwd = new Uint8Array(6);
        pwd.set(bytes.subarray(1080, 1083));
        pwd.set(bytes.subarray(-1003, -1000), 3);
        const pwd_str = new TextDecoder().decode(pwd);
 
        // 解密出数据
        const pdf = bytes.subarray(1083, -1003);
        pdf.subarray(0, 4000).forEach((byte, i) => {
            pdf[i] = 255 - byte;
        });
        return [
            new Blob([pdf, pdf.subarray(4000)], { type: "application/pdf" }),
            pwd_str
        ];
    }
 
 
    /**
     * 直接下载并解析原始数据，导出PDF压缩包
     * @param {PointerEvent} event
     */
    async function donwload_zip(event) {
        // 隐藏按钮
        const btn = event.target;
        btn.style.display = "none";
        
        // 共用进度变量
        window.downloaded_count = 0;
        window.downloaded_size = 0;
 
        // 取得数据地址
        const urls = get_img_urls()
            .map(url => url.replace("/thumb/", "/content-page/"));
        // 批量下载
        const item_tasks = urls.map(url_to_item);
        const items = await utils.gather(item_tasks);
        // 导出ZIP
        await data_to_zip(items);
 
        // 显示按钮
        btn.style.display = "block";
    }
 
 
    /**
     * 导出图片到PDF
     */
    function judge_file_type() {
        const ext = window
            ?.htmlConfig
            ?.fliphtml5_pages[0]
            ?.n[0]
            ?.split("?")[0]
            ?.split(".").at(-1);
 
        console.log("ext:", ext);
 
        if (["zip"].includes(ext)
            && window?.PdfLoadingTask
            && window?.getBlob) {
 
            utils.onclick(steal_pdf_when_page_loaded, 1, "开始捕获");
            utils.onclick(donwload_zip, 2, "下载PDF压缩包");
            utils.toggle_btn(2);
        }
        else if (wk$("#page1 img")[0]) {
            utils.onclick(imgs_to_pdf, 1, "导出PDF");
        }
        else {
            utils.onclick(() => null, 1, "此文档不适用");
        }
    }
 
 
    /**
     * 云展网文档下载策略
     */
    async function yunzhan365() {
        // 根据网址分别处理
        if (location.pathname.startsWith("/basic")) {
            return;
        }
 
        // 创建脚本启动按钮
        utils.create_btns();
        judge_file_type();
    }
 
    /**
     * 导出图片链接
     */
    function exportURLs$1() {
        const all = parseInt(
            wk$("[class*=total]")[0]
        );
        const imgs = wk$("[class*=imgContainer] img");
        const got = imgs.length;
 
        if (got < all) {
            if (!confirm(
                `当前浏览页数：${got}，总页数：${all}\n建议浏览剩余页面以导出全部链接\n是否继续导出链接？`
            )) {
                return;
            }
        }
        utils.save_urls(
            imgs.map(img => img.src)
        );
    }
 
 
    /**
     * 360文库文档下载策略
     */
    function wenku360() {
        utils.create_btns();
        utils.onclick(
            exportURLs$1, 1, "导出图片链接"
        );
 
        // utils.onclick(
        //     callAgent, 2, "导出PDF"
        // );
        // utils.toggle_btn(2);
    }
 
    async function getFileInfo() {
        const
            uid = new URL(location.href).searchParams.get("contentUid"),
            resp = await fetch("https://zyjy-resource.webtrn.cn/sdk/api/u/open/getResourceDetail", {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "content-type": "application/json",
                },
                "referrer": "https://jg.class.com.cn/",
                "body": `{"params":{"contentUid":"${uid}"}}`,
                "method": "POST",
            }),
            data = await resp.json(),
            url = data["data"]["downloadUrl"],
            fname = data["data"]["title"];
 
        let ext;
        try {
            // validate the URL format 
            // and get the file format
            ext = new URL(url).pathname.split(".").at(-1);
        } catch(e) {
            console.log(data);
            throw new Error("API changed, the script is invalid now.");
        }
        return { url, fname, ext };
    }
 
 
    /**
     * 保存文件
     * @param {{fname: string, url: string, ext: string}} info 
     */
    async function saveFile(info) {
        const
            resp = await fetch(info.url),
            blob = await resp.blob();
        utils.save(info.fname + `.${info.ext}`, blob);
    }
 
 
    /**
     * 劫持保存网页，改为保存文件
     * @param {KeyboardEvent} e 
     */
    function onCtrlS(e) {
        if (e.code === "KeyS" &&
            e.ctrlKey) {
            console.log("ctrl + s is captured!!");
            getFileInfo().then(info => saveFile(info));
 
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
        }
    }
 
 
    /**
     * 技工教育网文档策略
     */
    function jg() {
        window.addEventListener(
            "keydown", onCtrlS, true
        );
    }
 
    async function estimateTimeCost() {
        wk$(".w-page").at(-1).scrollIntoView();
        await utils.sleep(1000);
 
        let total = wk$("#pageNumber-text")[0].textContent.split("/")[1];
        total = parseInt(total);
        return confirm([
            "注意，一旦开始截图就无法停止，除非刷新页面。",
            "浏览器窗口最小化会导致截图提前结束！",
            "建议将窗口最大化，这将【显著增大清晰度和文件体积】",
            `预计耗时 ${1.1 * total} 秒，是否继续？`,
        ].join("\n"));
    }
 
 
    /**
     * 逐页捕获canvas
     * @returns {Promise<Array<Blob>>}
     */
    async function collectAll() {
        const imgs = [];
        let div = wk$(".w-page")[0];
        let i = 0;
        
        while (true) {
            // 取得 div
            const anchor = Date.now();
            while (!div && (Date.now() - anchor < 1000)) {
                console.log(`retry on page ${i+1}`);
                await utils.sleep(200);
            }
            if (!div) throw new Error(
                `can not fetch <div>: page ${i}`
            );
            
            // 移动到 div
            div.scrollIntoView({ behavior: "smooth" });
            await utils.sleep(1000);
            
            // 取得 canvas
            let canvas = wk$.call(div, "canvas")[0];
            let j = 0;
            while (!canvas && j < 100) {
                div = div.nextElementSibling;
                canvas = wk$.call(div, "canvas")[0];
                j++;
            }
            if (!div)  throw new Error(
                `can not fetch <div>: page ${i}*`
            );
 
            // 存储 canvas
            imgs.push(
                await utils.canvas_to_blob(canvas)
            );
            console.log(`canvas stored: ${++i}`);
 
            // 下一轮循环
            div = div.nextElementSibling;
            if (!div) break;
        }
        console.log("done");
        return imgs;
    }
 
 
    /**
     * 放大或缩小文档画面
     * @param {boolean} up 
     */
    async function scale(up) {
        let s = "#magnifyBtn";
        if (!up) {
            s = "#shrinkBtn";
        }
        const btn = wk$(s)[0];
        for (let _ of utils.range(10)) {
            btn.click();
            await utils.sleep(500);
        }
    }
 
 
    /**
     * 获取全部canvas，显示功能按钮
     * @returns 
     */
    async function prepare() {
        if (! await estimateTimeCost()) {
            return;
        }
 
        // 隐藏按钮
        utils.toggle_btn(1);
        // 放大画面
        await scale(true);
 
        let imgs;
        try {
            imgs = await collectAll();
        } catch(e) {
            console.error(e);
        } finally {
            // 缩小画面
            scale(false);
        }
        
        // window.imgs = imgs;
        // 显示功能按钮
        const fname = "技工教育网文档";
        utils.onclick(
            () => utils.img_blobs_to_pdf(imgs, fname),
            2,
            "导出PDF"
        );
        utils.toggle_btn(2);
 
        utils.onclick(
            () => utils.blobs_to_zip(imgs, "page", "png", fname),
            3,
            "导出ZIP"
        );
        utils.toggle_btn(3);
    }
 
 
    /**
     * 技工教育文档预览页面策略
     */
    function jgPreview() {
        utils.create_btns();
        utils.onclick(
            prepare, 1, "截图文档"
        );
    }
 
    /**
     * 取得文档标题
     * @returns {string}
     */
    function getTitle() {
        return document.title.slice(0, -4);
    }
 
 
    /**
     * 取得基础URL
     * @returns {string}
     */
    function getBaseURL$1() {
        return wk$("#dp")[0].value;
    }
 
 
    /**
     * 获取总页码
     * @returns {number}
     */
    function getTotalPageNum() {
        const num = wk$(".shop3 > li:nth-child(3)")[0]
            .textContent
            .split("/")[1]
            .trim();
        return parseInt(num);
    }
 
 
    /**
     * 返回图片链接生成器
     * @param {string} base 基础图片链接地址
     * @param {number} max 最大数量
     * @returns {Generator<string, void, unknown>}
     */
    function* imgURLsMaker(base, max) {
        for (let i of utils.range(1, max + 1)) {
            yield `${base}${i}.gif`;
        }
    }
 
 
    /**
     * 取得当前页面全部图片链接(生成器)
     * @returns {Generator<string, void, unknown>}
     */
    function getImgURLs() {
        const
            base = getBaseURL$1(),
            total = getTotalPageNum();
        return imgURLsMaker(base, total)
    }
 
 
    function exportPDF() {
        const urls = getImgURLs();
        const title = getTitle();
        return utils.run_with_prog(
            2, () => utils.img_urls_to_pdf(urls, title)
        );
    }
 
 
    function exportURLs() {
        const urls = getImgURLs();
        utils.save_urls(urls);
    }
 
 
    /**
     * 文库吧文档下载策略
     */
    function wenkub() {
        utils.create_btns();
        
        utils.onclick(
            exportURLs, 1, "导出图片链接"
        );
 
        utils.onclick(
            exportPDF, 2, "导出PDF(测试)"
        );
        utils.toggle_btn(2);
    }
 
    function* pageURLGen() {
        const
            url = new URL(location.href),
            params = url.searchParams,
            base = url.origin + (window.basePath || "/manuscripts/pdf"),
            type = params.get("type") || "pdf",
            id = params.get("id")
                || new URL(wk$("#pdfContent")[0].src).searchParams.get("id")
                || utils.raise("书本ID未知");
        
        let i = 0;
        let cur_url = "";
        
        if (window.wk_sklib_url) {
            console.log(`sklib 使用自定义 url: ${window.wk_sklib_url}`);
 
            while (true) {
                cur_url = window.wk_sklib_url.replace("{id}", id).replace("{index}", `${i}`);
                yield [i, cur_url];
                console.log("wk: target:", cur_url);
                i++;
            }
        } else {
            while (true) {
                cur_url = `${base}/data/${type}/${id}/${i}?random=null`;
                yield [i, cur_url];
                console.log("wk: target:", cur_url);
                i++;
            }
        }
 
    }
 
 
    async function get_bookmarks() {
        const url = new URL(location.origin);
        const id = utils.get_param("id");
        url.pathname = `/manuscripts/pdf/catalog/pdf/${id}`;
        const resp = await fetch(url.href);
        const data = await resp.json();
        const bookmarks = JSON.parse(data.data).outline;
        return bookmarks;
    }
 
 
    async function save_bookmarks() {
        const bookmarks = await get_bookmarks();
        const text = JSON.stringify(bookmarks, null, 2);
        utils.save("bookmarks.json", text, { type: "application/json" });
    }
 
 
    /**
     * 下载所有pdf文件数据，返回字节串数组
     * @returns {Promise<Array<Uint8Array>>}
     */
    async function fetch_all_pdfs() {
        // 如果已经下载完成，则直接返回之前的结果
        if (window.download_finished) {
            return window.pdfs;
        }
 
        // 显示进度的按钮
        const prog_btn = utils.btn(3);
        window.download_finished = false;
 
        // 存储pdf字节串
        const pdfs = [];
        let
            last_digest = NaN,
            size = NaN;
 
        // 读取每个PDF的页数
        if (window.loadPdfInfo) {
            try {
                const resp = await loadPdfInfo();
                const info = JSON.parse(resp.data);
                size = parseInt(info.size) || size;
            } catch(e) {
                console.error(e);
            }
        }
 
        for (const [i, url] of pageURLGen()) {
            // 取得数据
            const b64_data = await fetch(url).then(resp => resp.text());
            // 如果获取完毕，则退出
            if (!b64_data.length) break;
            // 计算摘要
            const digest = utils.crc32(b64_data);
            // 如果摘要重复了，说明到达最后一页，退出
            if (digest === last_digest) break;
            // 否则继续
            last_digest = digest;
            pdfs.push(
                utils.b64_to_bytes(b64_data)
            );
 
            // 更新进度
            const progress = `已经获取 ${i + 1} 组页面，每组`
                + (size ? ` ${size} 页` : '页数未知');
            console.info(progress);
            prog_btn.textContent = `${i + 1} 组 / ${size} 页`;
        }
 
        window.pdfs = pdfs;
        window.download_finished = true;
        return pdfs;
    }
 
 
    /**
     * @param {Function} async_fn 
     * @returns {Function}
     */
    function toggle_dl_btn_wrapper(async_fn) {
        return async function(...args) {
            utils.toggle_btn(1);
            utils.toggle_btn(2);
            await async_fn(...args);
            utils.toggle_btn(1);
            utils.toggle_btn(2);
        }
    }
 
 
    async function download_pdf$1() {
        alert(
            "如果看不到进度条请使用开发者工具（F12）查看日志\n" +
            "如果文档页数过多可能导致合并PDF失败\n" +
            "此时请使用【下载PDF数据集】按钮"
        );
 
        const pdfs = await fetch_all_pdfs();
        const combined = await utils.join_pdfs(pdfs);
        utils.save(
            document.title + ".pdf",
            combined,
            "application/pdf"
        );
        utils.btn(3).textContent = "进度条";
    }
 
    download_pdf$1 = toggle_dl_btn_wrapper(download_pdf$1);
 
 
    async function download_data_bundle() {
        alert(
            "下载的是 <文档名称>.dat 数据集\n" +
            "等价于若干 PDF 的文件顺序拼接\n" +
            "请使用工具切割并合并为一份 PDF\n" +
            "工具（pdfs-merger）链接在脚本主页"
        );
 
        const pdfs = await fetch_all_pdfs();
        const blob = new Blob(pdfs, { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.download = document.title + ".dat";
        a.href = url;
        a.click();
 
        URL.revokeObjectURL(url);
        console.log("pdf数据集", blob);
    }
 
    download_data_bundle = toggle_dl_btn_wrapper(download_data_bundle);
 
 
    function sdlib() {
        const url = new URL(location.href);
        const encrypted_id = url.pathname.split("/")[2];
        window.basePath = `/https/${encrypted_id}${basePath}`;
    }
 
 
    /**
     * 钩子函数，启动于主函数生效时，便于不同网站微调
     */
    function load_hooks() {
        const host_to_fn = {
            "gwfw.sdlib.com": sdlib,
        };
        const fn = host_to_fn[location.hostname];
        if (fn) {
            // 如果存在对应 hook 函数，则调用，否则忽略
            fn();
        }
    }
 
 
    /**
     * 中国社会科学文库文档策略
     */
    function sklib() {
        // 如果存在 pdf iframe 则在 iframe 中调用自身
        const iframe = wk$("iframe#pdfContent")[0];
        if (iframe) return;
        
        // 加载钩子，方便适应不同网站
        load_hooks();
 
        // 创建按钮区
        utils.create_btns();
        // 设置功能
        utils.onclick(download_pdf$1, 1, "下载PDF");
        utils.onclick(download_data_bundle, 2, "下载PDF数据集");
        utils.onclick(() => false, 3, "进度条");
        utils.onclick(save_bookmarks, 4, "下载书签");
        // 显示按钮
        utils.toggle_btn(2);
        utils.toggle_btn(3);
        utils.toggle_btn(4);
        // 设置按钮样式
        utils.btn(3).style.pointerEvents = "none";
    }
 
    /**
     * 返回基础图片地址，接上 <页码>.gif 即为完整URL
     * @returns {string}
     */
    function getBaseURL() {
        const
            elem = wk$("#page_1 img")[0],
            src = elem.src;
 
        if (!src) {
            alert("当前页面不能解析！");
            return;
        }
        if (!src.endsWith("1.gif")) {
            alert("当前文档不能解析！");
            throw new Error("第一页图片不以 1.gif 结尾");
        }
        return src.slice(0, -5);
    }
 
 
    function* imgURLGen() {
        const
            base = getBaseURL(),
            max = parseInt(
                // ' / 23 '
                wk$(".counts")[0].textContent.split("/")[1]
            );
 
        for (const i of utils.range(1, max + 1)) {
            yield `${base}${i}.gif`;
        }
    }
 
 
    function getURLs() {
        utils.save_urls(
            imgURLGen()
        );
    }
 
 
    function jinchutou() {
        utils.create_btns();
        utils.onclick(
            getURLs, 1, "导出图片链接"
        );
    }
 
    // http://www.nrsis.org.cn/mnr_kfs/file/read/55806d6159b7d8e19e633f05fa62fefa
 
 
    function get_pdfs() {
        // 34
        const size = window?.Page.size;
        if (!size) utils.raise("无法确定总页码");
 
        // '/mnr_kfs/file/readPage'
        const path = window
            ?.loadPdf
            .toString()
            .match(/url:'(.+?)',/)[1];
        if (!path) utils.raise("无法确定PDF路径");
 
        const code = location.pathname.split("/").at(-1);
 
        const tasks = [...utils.range(1, size + 1)].map(
            async i => {
                const resp = await fetch(path + "?wk=true", {
                    "headers": {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    "body": `code=${code}&page=${i}`,
                    "method": "POST",
                });
 
                if (!resp.ok) utils.raise(`第 ${i} 页获取失败！`);
                utils.update_popup(`已经获取第 ${i} 页`);
 
                const b64_str = await resp.text();
                return utils.b64_to_bytes(b64_str);
            }
        );
        return utils.gather(tasks);
    }
 
 
    function get_title() {
        return document.title.slice(0, -5);
    }
 
 
    function download_pdf() {
        utils.run_with_prog(1, async () => {
            const pdfs = await get_pdfs();
            debugger;
            const pdf = await utils.join_pdfs(pdfs);
            utils.save(
                get_title(), pdf, "application/pdf"
            );
        });
    }
 
 
    function add_style() {
        const style = `
    <style>
        #nprogress .nprogress-spinner-icon.forbidden {
            border-top-color: #b171ff;
            border-left-color: #bf8aff;
            animation: nprogress-spinner 2.4s linear infinite;
        }
    </style>
    `;
        document.body.insertAdjacentHTML(
            "beforeend", style
        );
    }
 
 
    function init_forbid_origin_pdf_fetch() {
        console.log("hooked xhr.open");
 
        // 修改转圈图标
        wk$(".nprogress-spinner-icon")[0]
            .classList.add("forbidden");
 
        const open = XMLHttpRequest.prototype.open;
 
        // 重写 XMLHttpRequest.prototype.open 方法
        XMLHttpRequest.prototype.open = function() {
            const args = Array.from(arguments);
            const url = args[1];
 
            if (!(url.includes("readPage") &&
                !url.includes("wk=true")
            )) return;
            
            this.send = () => undefined;
            open.apply(this, args);
        };
 
        return function regain_open() {
            const url = new URL(location.href);
            url.searchParams.set("intercept", "0");
            location.assign(url.toString());
        }
    }
 
 
    /**
     * nrsis 文档策略
     */
    function nrsis() {
        utils.create_btns();
        utils.onclick(download_pdf, 1, "下载PDF");
        
        if (!utils.get_param("intercept")) {
            add_style();
            const regain_open = init_forbid_origin_pdf_fetch();
            utils.onclick(regain_open, 2, "恢复页面加载");
            utils.toggle_btn(2);
        }
    }
 
    // ==UserScript==
    // @name         先晓书院PDF下载
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  先晓书院PDF下载，仅对PDF预览有效
    // @author       2690874578@qq.com
    // @match        https://xianxiao.ssap.com.cn/index/rpdf/read/id/*/catalog_id/0.html?file=*
    // @require      https://greasyfork.org/scripts/445312-wk-full-cli/code/wk-full-cli.user.js
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=xianxiao.ssap.com.cn
    // @grant        none
    // @run-at       document-idle
    // @license      GPL-3.0-only
    // ==/UserScript==
 
 
 
    /**
     * @param {number} begin 
     * @param {number} end 
     * @param {() => void} onload 
     * @returns {Promise<ArrayBuffer>}
     */
    async function fetch_file_chunk(url, begin, end, onload) {
        const resp = await fetch(url, {
            headers: { "Range": `bytes=${begin}-${end}` }
        });
        const buffer = await resp.arrayBuffer();
        onload();
        return buffer;
    }
 
 
    /**
     * 取得文档 ID
     * @returns {number}
     */
    function get_doc_id() {
        const id_text = location.pathname.split("id/")[1].split("/")[0];
        return parseInt(id_text);
    }
 
 
    /**
     * @param {string} url 
     * @returns {Promise<number>}
     */
    async function get_file_size(url) {
        const resp = await fetch(url, {
            headers: { "Range": `bytes=0-1` }
        });
        const size_text = resp.headers.get("content-range").split("/")[1];
        return parseInt(size_text);
    }
 
 
    /**
     * @param {PointerEvent} event 
     */
    async function export_pdf(event) {
        const btn = event.target;
 
        // 准备请求
        const doc_id = get_doc_id();
        const url = `https://xianxiao.ssap.com.cn/rpdf/pdf/id/${doc_id}/catalog_id/0.pdf`;
        const size = await get_file_size(url);
        const chunk = 65536;
        const times = Math.floor(size / chunk);
        
        // 准备进度条
        let finished = 0;
        const update_progress = () => {
            finished++;
            const loaded = ((finished * chunk) / 1024 / 1024).toFixed(2);
            const text = `已下载 ${loaded} MB`;
            utils.print(`chunk<${finished}>:`, text);
            btn.textContent = text;
        };
 
        // 分片请求PDF
        const tasks = [];
        for (let i = 0; i < times; i++) {
            tasks[i] = fetch_file_chunk(
                url,
                i * chunk,
                (i + 1) * chunk - 1,
                update_progress,
            );
        }
 
        // 请求最后一片
        const tail = size % chunk;
        tasks[times] = fetch_file_chunk(
            url,
            size - tail,
            size - 1,
            update_progress,
        );
 
        // 等待下载完成
        const buffers = await utils.gather(tasks);
        utils.print("--------全部下载完成--------");
        utils.print("全部数据分片:", { get data() { return buffers; } });
 
        // 导出PDF
        const blob = new Blob(buffers);
        const fname = top.document.title.split("_")[0] + ".pdf";
        utils.save(fname, blob, "application/pdf");
    }
 
 
    /**
     * 先晓书院 文档策略
     */
    function xianxiao() {
        utils.print("进入<先晓书院PDF下载>脚本");
        utils.create_btns();
        utils.onclick(export_pdf, 1, "下载PDF");
    }
 
    function hook_log() {
        // 保证 console.log 可用性
        const con = window.console;
        const { log, info, warn, error } = con;
 
        // 对于 console.log 能 hook 则 hook
        if (Object.getOwnPropertyDescriptor(window, "console").configurable
        && Object.getOwnPropertyDescriptor(con, "log").configurable) {
            // 保证 console 不能被改写
            Object.defineProperty(window, "console", {
                get: function() { return con; },
                set: function(value) {
                    log.call(con, "window.console 想改成", value, "？没门！");
                },
                enumerable: false,
                configurable: false,
            });
 
            // 保证日志函数不被改写
            const fn_map = { log, info, warn, error };
            Object.getOwnPropertyNames(fn_map).forEach((prop) => {
                Object.defineProperty(con, prop, {
                    get: function() { return fn_map[prop]; },
                    set: function(value) {
                        log.call(con, `console.${prop} 想改成`, value, "？没门！");
                    },
                    enumerable: false,
                    configurable: false,
                });
            });
        }
    }
 
 
    /**
     * 主函数：识别网站，执行对应文档下载策略
     */
    function main(host=null) {
        // 绑定函数到全局
        window.wk_main = main;
 
        // 显示当前位置
        host = host || location.hostname;
        const url = new URL(location.href);
        const params = url.searchParams;
        const path = url.pathname;
 
        hook_log();    
        console.log(`当前 host: ${host}\n当前 url: ${url.href}`);
 
        if (host.includes("docin.com")) {
            docin();
        } else if (host === "swf.ishare.down.sina.com.cn") {
            if (params.get("wk") === "true") {
                ishareData2();
            } else {
                ishareData();
            }
        } else if (host.includes("ishare.iask")) {
            ishare();
        } else if (host === "www.deliwenku.com") {
            deliwenku();
        } else if (host.includes("file") && host.includes("deliwenku.com")) {
            deliFile();
        } else if (host === "www.doc88.com") {
            doc88();
        } else if (host === "www.360doc.com") {
            doc360();
        } else if (host === "doc.mbalib.com") {
            mbalib();
        } else if (host === "www.dugen.com") {
            dugen();
        } else if (host === "c.gb688.cn") {
            gb688();
        } else if (host === "www.safewk.com") {
            safewk();
        } else if (host.includes("book118.com")) {
            book118();
        } else if (host === "www.renrendoc.com") {
            renrendoc();
        } else if (host.includes("yunzhan365.com")) {
            yunzhan365();
        } else if (host === "wenku.so.com") {
            wenku360();
        } else if (host === "jg.class.com.cn") {
            jg();
        } else if (host === "preview.imm.aliyuncs.com") {
            jgPreview();
        } else if (host === "www.wenkub.com") {
            wenkub();
        } else if (
            (host.includes("sklib") && path === "/manuscripts/")
            || host === "gwfw.sdlib.com") {
            sklib();
        } else if (host === "www.jinchutou.com") {
            jinchutou();
        } else if (host === "www.nrsis.org.cn") {
            nrsis();
        } else if (host === "xianxiao.ssap.com.cn") {
            xianxiao();
        } else {
            console.log("匹配到了无效网页");
        }
    }
 
 
    setTimeout(main, 1000);
 
})();