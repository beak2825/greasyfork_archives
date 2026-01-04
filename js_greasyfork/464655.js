// ==UserScript==
// @name         Wenku Doc Downloader
// @namespace    http://tampermonkey.net/
// @version      1.8.3
// @description  对文档截图，合并为纯图片PDF。有限地支持（1）豆丁网 （2）道客巴巴 （3）360个人图书馆（4）得力文库 （5）MBA智库（6）爱问文库（7）原创力文档（8）读根网（9）国标网（10）安全文库网（11）人人文库（12）云展网（13）360文库（14）技工教育网（15）文库吧（16）中国社会科学文库。在网页左侧中间有按钮区和小猴子图标，说明脚本生效了。预览多少页，导出多少页。额外支持（1）食典通（2）JJG 计量技术规范，详见下方说明。
// @author       2690874578@qq.com
// @match        *://*.docin.com/p-*
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
// @match        *://www.bing.com/search?q=Bing+AI&showconv=1*
// @match        *://wenku.so.com/d/*
// @match        *://jg.class.com.cn/cms/resourcedetail.htm?contentUid=*
// @match        *://preview.imm.aliyuncs.com/index.html?url=*/jgjyw/*
// @match        *://www.wenkub.com/p-*.html*
// @match        *://www.sklib.cn/manuscripts/?*
// @match        *://www.jinchutou.com/shtml/view-*
// @match        *://www.jinchutou.com/p-*
// @require      https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js
// @icon         https://s2.loli.net/2022/01/12/wc9je8RX7HELbYQ.png
// @icon64       https://s2.loli.net/2022/01/12/tmFeSKDf8UkNMjC.png
// @grant        none
// @run-at       document-idle
// @license      GPL-3.0-only
// @create       2021-11-22
// @note         1. 新增支持金锄头
// @downloadURL https://update.greasyfork.org/scripts/464655/Wenku%20Doc%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/464655/Wenku%20Doc%20Downloader.meta.js
// ==/UserScript==
 
 
(function () {
    'use strict';
 
    const
        ping = Symbol("ping"),
        pong = Symbol("pong"),
        onPing = Symbol("onPing"),
        onPong = Symbol("onPong");
 
 
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
        [onPong](e, resolve) {
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
        [ping]() {
            return new Promise((resolve, reject) => {
                // 绑定pong检查监听器
                const listener = this.listen(
                    e => this[onPong](e, resolve)
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
        [onPing](e, resolve) {
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
        [pong]() {
            return new Promise(resolve => {
                // 绑定ping检查监听器
                const listener = this.listen(
                    e => this[onPing](e, resolve)
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
                return this[ping]();
            }
            // 后发起握手
            return this[pong]();
        }
    }
 
 
    const base = {
        Socket,
 
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
            const input = document.createElement("input");
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            input.remove();
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
 
    globalThis.wk$ = base.$;
    globalThis.wk$$ = base.$$;
 
    const utils = {
        Socket: base.Socket,
 
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
                ARROW_ARG = /^([^(]+?)=>/,
                FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m,
                STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
                fn_text = Function.prototype.toString.call(fn).replace(STRIP_COMMENTS, ''),
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
        uint8ArrToHexStr: function(arr) {
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
        emphasizeText: function(elem) {
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
        untilDOMStill: async function(elem, timeout=2000) {
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
         * 返回子数组位置，找不到返回-1
         * @param {Array} arr 父数组
         * @param {Array} sub_arr 子数组
         * @param {number} from 开始位置
         * @returns {number} index
         */
        indexOfSubArray: function(arr, sub_arr, from) {
            // 如果子数组为空，则返回-1
            if (sub_arr.length === 0) return -1;
            // 初始化当前位置为from
            let position = from;
            // 算出最大循环次数
            const length = arr.length - sub_arr.length + 1;
 
            // 循环查找子数组直到没有更多
            while (position < length) {
                // 如果当前位置的元素与子数组的第一个元素相等，则开始比较后续元素
                if (arr[position] === sub_arr[0]) {
                    // 初始化匹配标志为真
                    let match = true;
                    // 循环比较后续元素，如果有不相等的，则将匹配标志设为假，并跳出循环
                    for (let i = 1; i < sub_arr.length; i++) {
                        if (arr[position + i] !== sub_arr[i]) {
                            match = false;
                            break;
                        }
                    }
                    // 如果匹配标志为真，则说明找到了子数组，返回当前位置
                    if (match) return position;
                }
                // 更新当前位置为下一个位置
                position++;
            }
            // 如果循环结束还没有找到子数组，则返回-1
            return -1;
        },
 
        /**
         * 用文件头切断文件集合体
         * @param {Uint8Array} data 
         * @param {Uint8Array} head 默认 null，即使用 data 前 8 字节
         * @returns {Array<Uint8Array>} files
         */
        splitFiles: function(data, head=null) {
            // 创建一个空数组用于存放结果
            const files = [];
            // 初始化当前位置为0
            let pos = 0;
            let next_pos = 0;
            // 确定 head
            head = head ? head : data.slice(0, 8);
        
            // 循环查找PNG标识直到没有更多
            while (next_pos < data.length) {
                // 查找下一个PNG标识的位置
                next_pos = this.indexOfSubArray(
                    data, head, pos + 1
                );
        
                let image;
                if (next_pos === -1) {
                    // 如果没有找到，则说明已经到达最后一张图片，将其复制并添加到结果中
                    image = data.slice(pos);
                    files.push(image);
                    break;
                }
                image = data.slice(pos, next_pos);
                files.push(image);
        
                // 更新当前位置为下一个PNG标识的位置
                pos = next_pos;
            }
            // 返回结果数组
            return files;
        },
 
        /**
         * 函数装饰器：仅执行一次 func
         * @param {Function} func 无参无返回值函数
         * @returns {Function}
         */
        once: function(func) {
            return async function() {
                let used = false;
                if (!used) {
                    used = true;
                    return func();
                }
            }
        },
 
        /**
         * 将类似于dict的简单object转为get请求的queryString
         * @param {Object} dict 
         * @returns {string}
         */
        dictToQueryStr: function(dict) {
            const params = [];
            for (let prop in dict) {
                params.push(`${prop}=${dict[prop]}`);
            }
            return params.join("&");
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
                let [done, values] = base.getAllValus(iterators);
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
        getAllStyles: function() {
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
        copyText: function(text) {
            // 输出到控制台和剪贴板
            console.log(text);
            
            if (!navigator.clipboard) {
                base.oldCopy(text);
                return;
            }
            navigator.clipboard.writeText(text)
            .catch(_ => base.oldCopy(text));
        },
 
        /**
         * 复制媒体到剪贴板
         * @param {Blob} blob
         */
        copyData: async function(blob) {
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
        saveAs: function(file_name, content, type="") {
            const blob = new Blob(
                [content], { type }
            );
            console.log(`blob saved, size: ${blob.size}, type: ${blob.type}`);
 
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.download = file_name;
            a.href = url;
            a.click();
            URL.revokeObjectURL(url);
        },
 
        /**
         * 显示/隐藏按钮区
         */
        toggleBtnsBox: function() {
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
        allowPrint: function() {
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
        getParam: function(key) {
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
        enhanceBtnClick: async function(i) {
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
         * @param {(btn: HTMLButtonElement) => Promise<void>} listener click监听器，第一个参数是按钮的引用
         * @param {number} i 按钮序号
         * @param {string} new_text 按钮的新文本，为null则不替换
         * @returns {Function} 事件处理函数
         */
        setBtnListener: function(listener, i, new_text=null) {
            const btn = this.btn(i);
 
            // 如果需要，替换按钮内文本
            if (new_text) {
                btn.textContent = new_text;
            }
            
            const _listener = async () => {
                const btn = this.btn(i);
                await listener(btn);
                await this.enhanceBtnClick(i);
                btn.textContent = new_text;
            };
 
            // 绑定事件，添加到页面上
            btn.addEventListener("click", _listener, true);
            return _listener;
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
         * @param {string} selector 
         */
        forceHide: function(selector) {
            const cls = "force-hide";
            wk$(selector).forEach(elem => {
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
        untilVisible: async function(elem) {
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
         * @param {Function | Promise<Function>} isReady 判断条件达成与否的函数
         * @param {number} timeout 最大等待秒数, 默认5000毫秒
         */
        waitUntil: async function(isReady, timeout=5000) {
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
        hideBtnThenPrint: async function() {
            // 隐藏按钮，然后打印页面
            this.toggleBtnsBox();
            await this.sleep(1000);
            print();
            this.toggleBtnsBox();
        },
 
        /**
         * 切换按钮显示/隐藏状态
         * @param {number} i 按钮序号
         * @returns 按钮元素的引用
         */
        toggleBtn: function(i) {
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
         * @param {Element} cur_page 当前页码
         * @param {string | Number} aim_page 目标页码
         * @param {string} event_type 键盘事件类型："keyup" | "keypress" | "keydown"
         */
        toPageNo: function(cur_page, aim_page, event_type) {
            // 设置跳转页码为目标页码
            cur_page.value = `${aim_page}`;
            // 模拟回车事件来跳转
            let keyboard_event_enter = new KeyboardEvent(event_type, {
                bubbles: true,
                cancelable: true,
                keyCode: 13
            });
            cur_page.dispatchEvent(keyboard_event_enter);
        },
 
        /**
         * 判断给定的url是否与当前页面同源
         * @param {string} url 
         * @returns {boolean}
         */
        isSameOrigin: function(url) {
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
        openURL: function(url, fname="") {
            const a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            if (fname && this.isSameOrigin(url)) {
                a.download = fname;
            }
            a.click();
        },
 
        /**
         * 用try移除元素
         * @param {Element} element 要移除的元素
         */
        remove: function(element) {
            try {
                element.remove();
            } catch (e) {}
        },
 
        /**
         * 用try移除若干元素
         * @param {Iterable<Element>} elements 要移除的元素列表
         */
        removeMulti: function(elements) {
            Array.from(elements).forEach(elem => 
                this.remove(elem)
            );
        },
 
        /**
         * 使文档在页面上居中
         * @param {string} selector 文档容器的css选择器
         * @param {string} default_offset 文档部分向右偏移的百分比（0-59）
         * @returns 偏移值是否合法
         */
        centerDoc: function(selector, default_offset) {
            const doc_main = wk$(selector)[0];
            const offset = prompt("请输入偏移百分位:", default_offset);
            // 如果输入的数字不在 0-59 内，提醒用户重新设置
            if (offset.length === 1 && offset.search(/[0-9]/) !== -1) {
                doc_main.style.marginLeft = offset + "%";
                return true;
            } else if (offset.length === 2 && offset.search(/[1-5][0-9]/) !== -1) {
                doc_main.style.marginLeft = offset + "%";
                return true
            } else {
                alert("请输入一个正整数，范围在0至59之间，用来使文档居中\n（不同文档偏移量不同，所以需要手动调整）");
                return false;
            }
        },
 
        /**
         * 等待全部任务落定后返回值的列表
         * @param {Iterable<Promise>} tasks 
         * @returns {Promise<Array>} values
         */
        gather: async function(tasks) {
            const results = await Promise.allSettled(tasks);
            return results
                .filter(result => result.value)
                .map(result => result.value);
        },
 
        /**
         * html元素列表转为canvas列表
         * @param {ArrayLike<HTMLElement>} elements 
         * @returns {Promise<Array<HTMLCanvasElement>>}
         */
        elementsToCanvases: async function(elements) {
            if (!globalThis.html2canvas) {
                await this.loadWebScript(
                    "https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js"
                );
            }
 
            // 如果是空列表, 则抛出异常
            if (elements.length === 0) {
                throw new Error("htmlToCanvases 未得到任何html元素");
            }
 
            return this.gather(
                Array.from(elements).map(html2canvas)
            );
        },
 
        /**
         * 将html元素转为canvas再合并到pdf中，最后下载pdf
         * @param {ArrayLike<HTMLElement>} elements html元素列表
         * @param {string} title 文档标题
         */
        elementsToPDF: async function(elements, title = "文档") {
            // 如果是空元素列表，终止函数
            const canvases = await this.elementsToCanvases(elements);
            // 控制台检查结果
            console.log("生成的canvas元素如下：");
            console.log(canvases);
            // 合并为PDF
            this.imgsToPDF(canvases, title);
        },
 
        /**
         * 使用xhr异步GET请求目标url，返回响应体blob
         * @param {string} url 
         * @returns {Promise<Blob>} blob
         */
        xhrGetBlob: async function(url) {
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
        loadWebScript: async function(url) {
            try {
                // xhr+eval方式
                Function(
                    await (await this.xhrGetBlob(url)).text()
                )();
            } catch(e) {
                console.error(e);
                // 嵌入<script>方式
                const script = document.createElement("script");
                script.src = url;
                document.body.append(script);
            }
        },
 
        /**
         * b64编码字符串转Uint8Array
         * @param {string} sBase64 b64编码的字符串
         * @param {number} nBlockSize 字节数
         * @returns {Uint8Array} arr
         */
        base64DecToArr: function(sBase64, nBlockSize=1) {
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
        canvasToBlob: function(canvas, type="image/png") {
            return new Promise(
                resolve => canvas.toBlob(resolve, type, 1)
            );
        },
 
        /**
         * 合并blobs到压缩包，然后下载
         * @param {Iterable<Blob>} blobs 
         * @param {string} base_name 文件名通用部分，如 image-1.jpg 中的 image
         * @param {string} ext 扩展名，如 jpg
         * @param {string} zip_name 压缩包名称
         */
        blobsToZip: async function(blobs, base_name, ext, zip_name) {
            const zip = new JSZip();
            // 归档
            for (let [i, blob] of this.enumerate(blobs)) {
                zip.file(
                    `${base_name}-${i+1}.${ext}`, blob, { binary: true }
                );
            }
            // 导出
            const zip_blob = await zip.generateAsync({ type: "blob" });
            console.log(zip_blob);
            this.saveAs(`${zip_name}.zip`, zip_blob);
        },
 
        /**
         * 存储所有canvas图形为png到一个压缩包
         * @param {Iterable<HTMLCanvasElement>} canvases canvas元素列表
         * @param {string} title 文档标题
         */
        canvasesToZip: async function(canvases, title) {
            // canvas元素转为png图像
            // 所有png合并为一个zip压缩包
            const tasks = [];
            for (let canvas of canvases) {
                tasks.push(this.canvasToBlob(canvas));
            }
            const blobs = await this.gather(tasks);
            this.blobsToZip(blobs, "page", "png", title);
        },
 
 
 
        /**
         * 合并图像并导出PDF
         * @param {Iterable<HTMLCanvasElement | Uint8Array | HTMLImageElement>} imgs 图像元素列表
         * @param {string} title 文档标题
         * @param {number} width (可选)页面宽度 默认 0
         * @param {number} height (可选)页面高度 默认 0
         * @param {boolean} blob (可选)是否返回 blob 默认 false
         */
        imgsToPDF: async function(imgs, title, width = 0, height = 0, blob=false) {
            imgs = Array.from(imgs);
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
            // 保存每一页文档到每一页pdf
            imgs.forEach((canvas, i) => {
                pdf.addImage(canvas, 'png', 0, 0, width, height);
                pdf.addPage();
                this.popupText(`PDF 已经绘制 ${i + 1} 页`);
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
        bmpToCanvas: function(bmp) {
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
        saveImgURLs: function(urls) {
            this.saveAs(
                "urls.csv",
                Array.from(urls).join("\n")
            );
        },
 
        /**
         * 图片blobs合并并导出为单个PDF
         * @param {Array<Blob>} blobs 
         * @param {string} title (可选)文档名称, 不含后缀, 默认为"文档"
         * @param {boolean} filter (可选)是否过滤 type 不以 "image/" 开头的 blob; 默认为 true
         * @param {boolean} blob (可选)是否返回 blob
         */
        imgBlobsToPDF: async function(blobs, title="文档", filter=true, blob=false) {
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
            return this.imgsToPDF(tasks, title, 0, 0, blob);
        },
 
        /**
         * 下载可以简单直接请求的图片，合并到 PDF 并导出
         * @param {Iterable<string>} urls 图片链接列表
         * @param {string} title 文档名称
         * @param {number} min_num 如果成功获取的图片数量 < min_num, 则等待 2 秒后重试; 默认 0 不重试
         * @param {boolean} clear 是否在请求完成后清理控制台输出，默认false
         */
        imgURLsToPDF: async function(urls, title, min_num=0, clear=false) {
            // 强制转换为迭代器类型
            urls = urls[Symbol.iterator]();
            const first = urls.next().value;
            
            // 如果不符合同源策略，在打开新标签页
            if (!this.isSameOrigin(first)) {
                console.info("URL 不符合同源策略；转为新标签页打开目标网站");
                this.openURL((new URL(first)).origin);
                return;
            }
 
            let tasks, img_blobs, i = 3;
            // 根据请求成功数量判断是否循环
            do {
                i -= 1;
                // 发起请求
                tasks = [this.xhrGetBlob(first)];  // 初始化时加入第一个
                // 然后加入剩余的
                for (const [j, url] of this.enumerate(urls)) {
                    tasks.push(this.xhrGetBlob(url));
                    this.popupText(`已经请求 ${j} 张图片`);
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
            await this.imgBlobsToPDF(img_blobs, title, false);
        },
 
        /**
         * 返回子串个数
         * @param {string} str 
         * @param {string} sub 
         */
        countSubStr: function(str, sub) {
            return [...str.matchAll(sub)].length;
        },
 
        btnsSec: function() {
            const sec = wk$(".wk-box .btns_section")[0];
            if (!sec) throw new Error("wk 按钮区找不到");
            return sec;
        },
 
        /**
         * 折叠按钮区，返回是否转换了状态
         */
        foldBtns: function() {
            const sec = this.btnsSec();
            const hide_btn = wk$(".wk-box .hide_btn_wk")[0];
            const display = getComputedStyle(sec).display;
            if (display !== "block") return false; 
            
            // 显示 -> 隐藏
            sec.style.display = "none";
            hide_btn.style.left = "20px";
            hide_btn.textContent = "🙈";
            return true;
        },
 
        /**
         * 展开按钮区，返回是否转换了状态
         */
        unfoldBtns: function() {
            const sec = this.btnsSec();
            const hide_btn = wk$(".wk-box .hide_btn_wk")[0];
            const display = getComputedStyle(sec).display;
            if (display === "block") return false; 
            
            // 隐藏 -> 显示
            sec.style.display = "block";
            hide_btn.style.left = "155px";
            hide_btn.textContent = "🐵";
            return true;
        },
 
        /**
         * 运行基于按钮的、显示进度条的函数
         * @param {number} i 按钮序号
         * @param {Function} task 需要等待的耗时函数
         */
        runWithProgPopup: async function(i, task) {
            const btn = utils.btn(i);
            let new_btn;
 
            if (!$("#wk-popup")[0]) {
                this.addPopup();
            }
 
            this.foldBtns();
            this.toID("wk-popup");
 
            new_btn = btn.cloneNode(true);
            btn.replaceWith(new_btn);
            this.setBtnListener(
                () => utils.toID("wk-popup"), i, "显示进度"
            );
 
            try {
                await task();
            } catch(e) {
                console.error(e);
            }
 
            this.toID("");
            this.unfoldBtns();
            new_btn.replaceWith(btn);
        },
 
        /**
         * 创建5个按钮：展开文档、导出图片、导出PDF、未设定4、未设定5；除第1个外默认均为隐藏
         */
        createBtns: function() {
            // 创建大容器
            const box = document.createElement("div");
            box.className = "wk-box";
            document.body.append(box);
 
            // 创建按钮组
            const section = document.createElement("section");
            section.className = "btns_section";
            section.innerHTML = `
            <p class="logo_tit">Wenku Doc Downloader</p>
            <button class="btn-1">展开文档 😈</button>
            <button class="btn-2">未设定2</button>
            <button class="btn-3">未设定3</button>
            <button class="btn-4">未设定4</button>
            <button class="btn-5">未设定5</button>`;
            box.append(section);
 
            // 添加隐藏/展示按钮
            // 隐藏【🙈】，展开【🐵】
            const hide_btn = document.createElement("p");
            hide_btn.className = "hide_btn_wk";
            hide_btn.textContent = "🐵";
            hide_btn.onclick = () => this.foldBtns() || this.unfoldBtns();
            box.append(hide_btn);
 
            // 设定样式
            const style = document.createElement("style");
            style.innerHTML = `
            .hide_btn_wk {
                position: fixed;
                left: 155px;
                top: 36%;
                user-select: none;
                font-size: large;
                z-index: 2000;
            }
            .btns_section{
                position: fixed;
                width: 154px;                
                left: 10px;
                top: 32%;
                background: #E7F1FF;
                border: 2px solid #1676FF;                
                padding: 0px 0px 10px 0px;
                font-weight: 600;
                border-radius: 2px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
                'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                'Segoe UI Emoji', 'Segoe UI Symbol';
                z-index: 1000;
            }
            .logo_tit{
                width: 100%;
                background: #1676FF;
                text-align: center;
                font-size:12px ;
                color: #E7F1FF;
                line-height: 40px;
                height: 40px;
                margin: 0 0 16px 0;
            }
            .btn-1{
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
            .btn-2{
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
            .btn-3{
                display: none;
                width: 128px;
                height: 28px;
                background:#FA5151;
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
            .btn-4{
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
            .btn-5{
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
            .btn-1:hover,.btn-2:hover,.btn-3:hover,.btn-4,.btn-5:hover{ opacity: .8;}
            .btn-1:active,.btn-2:active,.btn-3:active,.btn-4,.btn-5:active{ opacity: 1;}`;
            document.head.append(style);
        },
 
        /**
         * 添加弹窗到 body, 通过 utils.toID("wk-popup") 激发
         */
        addPopup: function() {
            const container = document.createElement("div");
            container.className = "wk-popup-container";
            container.innerHTML = `
            <div class='modal-wrapper' id='wk-popup'>
            <div class='modal-body wk-card'>
            <div class='modal-header'>
            <h2 class='wk-popup-head'>下载进度条</h2>
            <a href='#!' role='wk-button' class='close' aria-label='close this modal'>
            <svg viewBox='0 0 24 24'>
            <path d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z'></path>
            </svg>
            </a>
            </div>
            <p class='wk-popup-body'>正在初始化内容...</p>
            </div>
            <a href='#!' class='outside-trigger'></a>
            </div>
            <style>.wk-popup-container{height:100vh;width:100vw;position:fixed;top:0;z-index:999;background:0 0}.wk-popup-head{font-size:1.5em;margin-bottom:12px}.wk-card{background:#fff;background-image:linear-gradient(48deg,#fff 0,#e5efe9 100%);border-top-right-radius:16px;border-bottom-left-radius:16px;box-shadow:-20px 20px 35px 1px rgba(10,49,86,.18);display:flex;flex-direction:column;padding:32px;margin:40px;max-width:400px;width:100%}.content-wrapper{font-size:1.1em;margin-bottom:44px}.content-wrapper:last-child{margin-bottom:0}.wk-button{align-items:center;background:#e5efe9;border:1px solid #5a72b5;border-radius:4px;color:#121943;cursor:pointer;display:flex;font-size:1em;font-weight:700;height:40px;justify-content:center;width:150px}.wk-button:focus{border:2px solid transparent;box-shadow:0 0 0 2px #121943;outline:solid 4px transparent}.link{color:#121943}.link:focus{box-shadow:0 0 0 2px #121943}.input-wrapper{display:flex;flex-direction:column}.input-wrapper .label{align-items:baseline;display:flex;font-weight:700;justify-content:space-between;margin-bottom:8px}.input-wrapper .optional{color:#5a72b5;font-size:.9em}.input-wrapper .input{border:1px solid #5a72b5;border-radius:4px;height:40px;padding:8px}.modal-header{align-items:baseline;display:flex;justify-content:space-between}.close{background:0 0;border:none;cursor:pointer;display:flex;height:16px;text-decoration:none;width:16px}.close svg{width:16px}.modal-wrapper{align-items:center;background:rgba(0,0,0,.7);bottom:0;display:flex;justify-content:center;left:0;position:fixed;right:0;top:0}#wk-popup{opacity:0;transition:opacity .25s ease-in-out;visibility:hidden}#wk-popup:target{opacity:1;visibility:visible}#wk-popup:target .modal-body{opacity:1;transform:translateY(1)}#wk-popup .modal-body{max-width:500px;opacity:0;transform:translateY(-100px);transition:opacity .25s ease-in-out;width:100%;z-index:1}.outside-trigger{bottom:0;cursor:default;left:0;position:fixed;right:0;top:0}</style>;`;
            document.body.append(container);
        },
 
        /**
         * 设置弹窗标题
         * @param {string} text 
         */
        setPopupHead: function(text) {
            const head = wk$(".wk-popup-head")[0];
            if (!head) return;
            head.textContent = text;
        },
 
        /**
         * 设置弹窗正文
         * @param {string} text 
         */
        popupText: function(text) {
            const body = wk$(".wk-popup-body")[0];
            if (!body) return;
            body.textContent = text;
        },
 
        /**
         * 移除弹窗
         */
        removePopup: function() {
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
    function ensureWebScript(global_obj_name, cdn_url, func) {
        async function inner(...args) {
            if (!window[global_obj_name]) {
                // 根据需要加载依赖
                await utils.loadWebScript(cdn_url);
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
    for (let prop of Object.keys(utils)) {
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
            // 绑死this
            utils[prop] = utils[prop].bind(utils);
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
        let name = prop.toLowerCase();
        if (name.includes("tozip")) {
            obj = "JSZip";
            url = "https://cdn.staticfile.org/jszip/3.7.1/jszip.min.js";
        } else if (name.includes("topdf")) {
            obj = "jspdf";
            url = "https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js";
        } else {
            continue;
        }
        utils[prop] = ensureWebScript(obj, url, utils[prop]);
    }
 
 
    /**
     * ---------------------------------------------------------------------
     * 为 utils 部分函数绑定更详细的说明
     * ---------------------------------------------------------------------
     */
 
    utils.base64DecToArr.__doc__ = `
/**
 * b64编码字符串转Uint8Array
 * @param {string} sBase64 b64编码的字符串
 * @param {number} nBlockSize 字节数
 * @returns {Uint8Array} arr
 */
`;
 
    utils.blobsToZip.__doc__ = `
/**
 * 合并blobs到压缩包，然后下载
 * @param {Iterable<Blob>} blobs 
 * @param {string} base_name 文件名通用部分，如 image-1.jpg 中的 image
 * @param {string} ext 扩展名，如 jpg
 * @param {string} zip_name 压缩包名称
 */
`;
 
    utils.imgsToPDF.__doc__ = `
/**
 * 合并图像并导出PDF
 * @param {Iterable<HTMLCanvasElement | Uint8Array | HTMLImageElement>} imgs 图像元素列表
 * @param {string} title 文档标题
 * @param {number} width (可选)页面宽度 默认 0
 * @param {number} height (可选)页面高度 默认 0
 * @param {boolean} blob (可选)是否返回 blob 默认 false
 */
`;
 
    utils.imgURLsToPDF.__doc__ = `
/**
 * 下载可以简单直接请求的图片，合并到 PDF 并导出
 * @param {Iterable<string>} urls 图片链接列表
 * @param {string} title 文档名称
 * @param {number} min_num 如果成功获取的图片数量 < min_num, 则等待 2 秒后重试; 默认 0 不重试
 * @param {boolean} clear 是否在请求完成后清理控制台输出，默认false
 */
`;
 
    utils.imgBlobsToPDF.__doc__ = `
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
    console.log("wk: `wk$` 已经挂载到全局");
 
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
            utils.toPageNo(cur_page, page_max, "keypress");
            // 返回顶部
            await utils.sleep(1000);
            utils.toPageNo(cur_page, "1", "keypress");
        }
        // 文档展开后，显示按钮
        else {
            for (const i of utils.range(1, 6)) {
                utils.toggleBtn(i);
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
        return utils.untilVisible(elem).then(hide);
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
        utils.copyText(getSelectedText());
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
    async function walkThrough$3() {
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
                await utils.waitUntil(async() => {
                    let page = wk$(`#page_${i}`)[0];
                    // page无法选中说明有弹窗
                    if (!page) {
                        // 关闭弹窗，等待，然后递归
                        wk$("#ym-window .DOC88Window_close")[0].click();
                        await utils.sleep(500);
                        walkThrough$3();
                        throw new Error("walkThrough 递归完成，终止函数");
                    }
                    // canvas尚未绘制时width=300
                    return page.width !== 300;
                });
                // 凸显页码
                utils.emphasizeText(page_num);
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
        utils.createBtns();
 
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
        utils.setBtnListener(readAllDoc88, 1);
 
        // // btn_2: 加载全部页面
        utils.setBtnListener(walkThrough$3, 2, "加载所有页面");
        
        // btn_3: 导出PDF
        function imgsToPDF() {
            if (confirm("确定每页内容都加载完成了吗？")) {
                utils.runWithProgPopup(
                    3, () => utils.imgsToPDF(...prepare())
                );
            }
        }    utils.setBtnListener(imgsToPDF, 3, "导出图片到PDF");
 
        // btn_4: 导出ZIP
        utils.setBtnListener(() => {
            if (confirm("确定每页内容都加载完成了吗？")) {
                utils.canvasesToZip(...prepare());
            }
        }, 4, "导出图片到ZIP");
 
        // btn_5: 复制选中文字
        utils.setBtnListener(btn => {
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
 
    async function _clickUntilNone(selector) {
        // 翻页
        while (true) {
            // 翻到首页
            const prev_btn = wk$(selector)[0];
            if (!prev_btn) break;
            prev_btn.click();
            await utils.sleep(2000);
        }
    }
 
    /**
     * 加载完所有免费页面
     */
    async function walkThrough$2() {
        // 隐藏按钮
        utils.toggleBtnsBox();
        // 向前翻页
        await _clickUntilNone(".page_prev");
        // 向后翻页
        await _clickUntilNone(".page_next");
        // 显示按钮
        utils.toggleBtnsBox();
    }
 
 
    function exportPDF$5() {
        if (confirm("页面加载完毕了吗？")) {
            utils.imgsToPDF(
                wk$(".hkswf-content2 canvas"),
                document.title.split(" - ")[0]
            );
        }
    }
 
 
    /**
     * 豆丁文档下载策略
     */
    function docin() {
        // 创建脚本启动按钮
        utils.createBtns();
        
        // btn_2: 加载所有页面
        utils.setBtnListener(
            walkThrough$2, 1, "加载所有页面"
        );
 
        // btn_3: 导出PDF
        utils.setBtnListener(
            exportPDF$5, 2, "导出PDF"
        );
        utils.toggleBtn(2);
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
        utils.createBtns();
 
        // btn_1: 识别文档类型 -> 导出PDF
        utils.setBtnListener(jumpToHost, 1, "到下载页面");
        // btn_2: 不支持爱问办公
        utils.setBtnListener(() => null, 2, "不支持爱问办公");
        // utils.toggleBtnStatus(4);
    }
 
    /**
     * 返回包含对于数量svg元素的html元素
     * @param {string} data
     * @returns {HTMLDivElement} article
     */
    function _createDiv(data) {
        let num = utils.countSubStr(data, data.slice(0, 10));
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
        utils.setBtnListener(change, 4, "切换显示模式");
 
        utils.toggleBtn(2);
        utils.toggleBtn(3);
        utils.toggleBtn(4);
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
 
        utils.createBtns();
        utils.setBtnListener(utils.hideBtnThenPrint, 1, "打印页面到PDF");
        utils.setBtnListener(setGapGUI, 2, "重设页间距");
        utils.setBtnListener(handleSVGtext, 3, "显示空白点我");
 
        utils.toggleBtn(2);
        utils.toggleBtn(3);
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
        return utils.splitFiles(data, head);
    }
 
 
    /**
     * 图像Uint8数组列表合并然后导出PDF
     * @param {string} fname
     * @param {Array<Uint8Array>} img_data_list 
     */
    async function imgDataArrsToPDF(fname, img_data_list) {
        return utils.imgsToPDF(
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
        await utils.blobsToZip(
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
        utils.setBtnListener(exportPDF$4, 2, "下载并导出PDF");
        utils.toggleBtn(1);
        utils.toggleBtn(2);
    }
 
 
    async function exportPDF$4() {
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
                utils.setBtnListener(
                    () => saveAsZip(...args),
                    3,
                    "导出ZIP"
                );
                utils.toggleBtn(3);  // 显示导出ZIP按钮
                utils.toggleBtn(2);  // 隐藏导出PDF按钮
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
            fname: utils.getParam("fname"),
            path: utils.getParam("path")
        };
 
        // 显示提示
        showHints();
 
        // 创建按钮区
        utils.createBtns();
 
        // btn_1: 识别文档类型，处理SVG或下载数据
        utils.setBtnListener(getImgs, 1, "下载数据");
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
                
                await utils.imgsToPDF(
                    utils.splitFiles(whole_data),
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
        utils.createBtns();
        utils.setBtnListener(jumpToHostage, 1, "到下载页面");
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
        document.title = utils.getParam("fname");    document.body.innerHTML = body;
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
            base_url = genBaseURL(utils.getParam("path")),
            fname = utils.getParam("fname"),
            num = parseInt(utils.getParam("num"));
 
        let lmt = parseInt(utils.getParam("lmt"));
        lmt = lmt > 3 ? lmt : 20;
        lmt = lmt > num ? num : lmt;
 
        window.deliJS = {
            base_url,
            num,
            fname,
            lmt
        };
    }
 
 
    function exportPDF$3() {
        return utils.runWithProgPopup(
            1, () => utils.imgURLsToPDF(
                genURLs(deliJS.base_url, deliJS.num),
                deliJS.fname,
                deliJS.lmt,
                true  // 请求完成后清理控制台
            )
        );
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
        utils.createBtns();
        // btn_1: 导出PDF
        utils.setBtnListener(exportPDF$3, 1, "导出PDF");
    }
 
    function readAll360Doc() {
        // 展开文档
        document.querySelector(".article_showall a").click();
        // 隐藏按钮
        utils.toggleBtn(1);
        // 显示按钮
        utils.toggleBtn(2);
        utils.toggleBtn(3);
        utils.toggleBtn(4);
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
        utils.saveAs(`${title}.txt`, content.join("\n"));
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
        if (!utils.centerDoc(".a_left", "20")) {
            return; // 如果输入非法，终止函数调用
        }
        // 隐藏按钮，然后打印页面
        utils.hideBtnThenPrint();
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
        utils.createBtns();
        // btn_1: 展开文档
        utils.setBtnListener(readAll360Doc, 1);
        // btn_2: 导出纯文本
        utils.setBtnListener(saveText_360Doc, 2, "导出纯文本");
        // btn_3: 打印页面到PDF
        utils.setBtnListener(printPage360Doc, 3, "打印页面到PDF");
        // btn_3: 清理页面
        utils.setBtnListener(cleanPage, 4, "清理页面(推荐)");
    }
 
    async function getPDF() {
        if (!window.DEFAULT_URL) {
            alert("当前文档无法解析，请加 QQ 群反馈");
            return;
        }
        let title = document.title.split(" - ")[0] + ".pdf";
        let blob = await utils.xhrGetBlob(DEFAULT_URL);
        utils.saveAs(title, blob);
    }
 
 
    function mbalib() {
        utils.createBtns();
        utils.setBtnListener(getPDF, 1, "下载PDF");
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
    function toPage$1(page_num) {
        // 先尝试官方接口，不行再用模拟的
        try {
            Viewer._GotoPage(page_num);
        } catch(e) {
            console.error(e);
            utils.toPageNo(
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
            toPage$1(i);
            await utils.waitUntil(
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
    function getImgUrls$1() {
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
        let [ok, urls] = getImgUrls$1();
        if (!ok) {
            return;
        }
        utils.saveAs("urls.csv", urls.join("\n"));
    }
 
 
    function exportPDF$2() {
        let [ok, urls] = getImgUrls$1();
        if (!ok) {
            return;
        }
        let title = document.title.split("－")[0];
        return utils.runWithProgPopup(
            3, () => utils.imgURLsToPDF(urls, title)
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
        utils.createBtns();
 
        // 绑定监听器
        // 按钮1：展开文档
        utils.setBtnListener(walkThrough$1, 1, "加载可预览页面");
        // 按钮2：导出图片链接
        utils.setBtnListener(exportImgUrls, 2, "导出图片链接");
        utils.toggleBtn(2);
        // 按钮3：导出PDF
        utils.setBtnListener(exportPDF$2, 3, "导出PDF");
        utils.toggleBtn(3);
    }
 
    /**
     * 取得文档类型
     * @returns {String} 文档类型str
     */
    function getDocType() {
        let type_elem = document.querySelector(".title .icon.icon-format");
        // ["icon", "icon-format", "icon-format-doc"]
        let cls_str = type_elem.classList[2];
        // "icon-format-doc"
        let type = cls_str.split("-")[2];
        return type;
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
    function isPPT() {
        return isTypeof(["ppt", "pptx"]);
    }
 
 
    /**
     * 判断文档类型是否为Excel
     * @returns 是否为Excel
     */
    function isEXCEL() {
        return isTypeof(["xls", "xlsm", "xlsx"]);
    }
 
 
    /**
     * 取得最大页码
     * @returns {Number} 最大页码
     */
    function getPageCounts$1() {
        return preview.getPage().preview;
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
                new Set(utils.range(1, book118JS.page_counts)),
                new Set(loaded)
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
        utils.toggleBtnsBox();
 
        // 取得总页码
        // preview.getPage()
        // {current: 10, actual: 38, preview: 38, remain: 14}
        const { preview: all } = preview.getPage();
        for (let i = 1; i <= all; i++) {
            // 逐页加载
            preview.jump(i);
            await utils.waitUntil(
                () => wk$(`[data-id="${i}"] img`)[0].src, 1000
            );
        }
        console.log("遍历完成");
        utils.toggleBtnsBox();
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
        utils.saveAs("urls.csv", urls.join("\n"));
    }
 
 
    /**
     * 打开PPT预览页面
     */
    function openPPTpage() {
        alert("请点击【开始预览】按钮以继续......");
    }
 
 
    /**
     * 原创力文档(非PPT或Excel)下载策略
     */
    async function book118_CommonDoc() {
        await utils.waitUntil(
            () => !!wk$(".counts")[0]
        );
 
        // 创建全局对象
        window.book118JS = {
            doc_type: getDocType(),
            page_counts: getPageCounts$1()
        };
 
        // 处理非PPT文档
        // 创建按钮组
        utils.createBtns();
        // 绑定监听器到按钮
        // 按钮1：加载全文
        utils.setBtnListener(walkThrough, 1, "加载全文");
        // 按钮2：导出图片链接
        utils.setBtnListener(wantUrls, 2, "导出图片链接");
        utils.toggleBtn(2);
        // // 按钮3：自动导出链接
        // utils.setBtnListener(toAPIPage, 3, "自动导出链接(荐)");
        // utils.toggleBtn(3);
    }
 
 
    /**
     * 取得PPT文档最大页码
     * @returns PPT文档最大页码int
     */
    async function getPageCountsPPT() {
        await utils.waitUntil(
            () => !!wk$("#PageCount")[0].textContent
        );
        return parseInt(
            wk$("#PageCount")[0].textContent
        );
    }
 
 
    /**
     * 取得当前的页码
     * @returns {Number} this_page
     */
    function getThisPage() {
        return parseInt(
            wk$("#PageIndex")[0].textContent
        );
    }
 
 
    /**
     * 点击下一动画直到变成下一页，再切回上一页
     * @param {Number} next_page 下一页的页码
     */
    async function __nextFrameUntillNextPage(next_page) {
        // 如果已经抵达下一页，则返回上一页
        const this_page = getThisPage();
 
        // 最后一页直接退出
        if (next_page > window.book118JS.page_counts) {
            return;
        }
        // 不是最后一页，但完成了翻页动作
        else if (this_page === next_page) {
            // 下一帧动画
            document.querySelector(".btmLeft").click();
            await utils.waitUntil(() => this_page === next_page - 1);
            return;
        }
        // 否则递归的点击下一动画
        document.querySelector(".btmRight").click();
        await utils.sleep(500);
        await __nextFrameUntillNextPage(next_page);
    }
 
 
    /**
     * 确保当前页面是最后一帧动画
     */
    async function toLastFrame() {
        // 取得当前页码和下一页页码
        const this_page = getThisPage();
        // 开始点击下一页按钮，直到变成下一页，再点击上一页按钮来返回
        await __nextFrameUntillNextPage(this_page + 1);
    }
 
 
    /**
     * （异步）转换当前视图为canvas，添加到book118JS.canvases中。在递归终止时显示btn_2。
     */
    async function docView2Canvas() {
        await toLastFrame();
        // 取得页码
        const cur_page = getThisPage();
        // 取得视图元素，计数从0开始
        const doc_view = wk$(`#view${cur_page - 1}`)[0];
 
        // 满足 [DOM 不再变化] 并且 [等够秒数] 才能继续
        await Promise.allSettled([
            utils.untilDOMStill(doc_view),
            utils.sleep(book118JS.delay * 1000)
        ]);
 
        // 转化为canvas
        const canvas = await html2canvas(doc_view);
        book118JS.canvases.push(canvas);
        console.log(`page ${cur_page} finished`);
 
        // 如果到最后一页
        if (cur_page === book118JS.page_counts) {
            // 终止递归，并且显示导出PDF按钮
            utils.toggleBtn(2);
            return;
        }
        // 否则下一次递归（继续捕获下一页）
        wk$(".pgRight")[0].click();
        await utils.sleep(500);
        await docView2Canvas();
    }
 
 
    /**
     * 将捕获的canvases合并，然后导出为pdf
     * @returns 
     */
    function canvases2pdf() {
        // 校验数量
        const
            canvases = book118JS.canvases,
            stored = canvases.length,
            all = book118JS.page_counts,
            diff = all - stored;
 
        if (diff > 0) {
            alert(`缺失了 ${diff} 页`);
        }
        // 导出pdf
        utils.imgsToPDF(canvases, "原创力PPT文档");
    }
 
 
    /**
     * 调整等待动画延时
     */
    function adjustDelay() {
        const input = prompt(
            `当前等待动画延时为【${window.book118JS.delay}】秒，改为多少秒？`
        );
        const delay = parseFloat(input);
        if (0 <= delay && delay <= 10) {
            book118JS.delay = delay;
        }
    }
 
 
    /**
     * 原创力文档(PPT)下载策略
     */
    async function book118_PPT() {
        // 创建全局对象
        window.book118JS = {
            page_counts: await getPageCountsPPT(),
            canvases: [],  // 存储每页文档转化的canvas
            // tasks: []
            delay: 2  // 等待动画的延时(秒)
        };
 
        // 创建按钮区
        utils.createBtns();
 
        // 按钮1：捕获页面
        utils.setBtnListener(() => {
            let hint = [
                "正在为文档“截图”，请耐心等待过程完成，不要操作",
                "“截图”效果不佳，可以调整每页动画等待的延时",
                "比如改成 5 秒或 10 秒；默认是 2 秒",
                "但无论怎样，“截图”得到的 PDF 效果很可能不好",
                "请勿就此问题反馈，反馈了我也改不了"
            ];
            alert(hint.join("\n"));
            // 隐藏按钮1
            utils.toggleBtn(1);
            // 开始捕获页面（异步）
            docView2Canvas();
        }, 1, "捕获页面");
 
        // 按钮2：合并图片到PDF
        utils.setBtnListener(canvases2pdf, 2, "导出PDF");
 
        // 按钮3：调整等待延时
        utils.setBtnListener(adjustDelay, 3, "调整等待延时");
        utils.toggleBtn(3);
    }
 
 
    /**
     * 取得当前页面的excel，返回csv string
     * @returns {String} csv
     */
    function excel2CSV() {
        const
            table = [],
            rows = wk$("tr[id]");
 
        // 遍历行
        for (let row of rows) {
            const csv_row = [];
            // 遍历列（单元格）
            for (let cell of wk$.call(row, "td[class*=fi], td.tdrl")) {
                // 判断单元格是否存储图片
                const img = cell.querySelector("img");
                if (img) {
                    // 如果是图片，保存图片链接
                    csv_row.push(img.src);
                } else {
                    // 否则保存单元格文本
                    csv_row.push(cell.textContent);
                }
            }
            table.push(csv_row.join(","));
        }
        return table.join("\n").replace(/\n{2,}/g, "\n");
    }
 
 
    /**
     * 下载当前表格内容，保存为csv（utf-8编码）
     */
    function wantEXCEL() {
        let file_name = "原创力表格_UTF-8.csv";
        utils.saveAs(file_name, excel2CSV());
    }
 
 
    /**
     * 在Excel预览页面给出操作提示
     */
    function help() {
        let hint = [
            "【导出表格到CSV】只能导出当前sheet，",
            "如果有多张sheet请在每个sheet上用按钮分别导出CSV。",
            "CSV是一种简单的表格格式，可以被Excel打开，",
            "并转为 xls 或 xlsx 格式存储，",
            "但CSV本身不能存储图片，所以用图片链接代替，请自行下载图片",
            "",
            "本功能导出的CSV文件无法直接用Excel打开，因为中文会乱码。",
            "有两个办法：",
            "1. 打开Excel，选择【数据】，选择【从文本/CSV】，",
            "  选择文件，【文件原始格式】选择【65001: Unicode(UTF-8)】，选择【加载】。",
            "2. 用【记事本】打开CSV文件，【文件】->【另存为】->",
            "  【编码】选择【ANSI】->【保存】。现在可以用Excel直接打开它了。"
        ];
        alert(hint.join("\n"));
    }
 
 
    /**
     * 原创力文档(EXCEL)下载策略
     */
    function book118_EXCEL() {
        // 创建按钮区
        utils.createBtns();
        // 绑定监听器到按钮
        utils.setBtnListener(wantEXCEL, 1, "导出表格到CSV");
        utils.setBtnListener(help, 2, "使用说明");
        // 显示按钮
        utils.toggleBtn(2);
    }
 
 
    /**
     * 打开Excel预览页面
     */
    function openEXCELpage() {
        openPPTpage();
    }
 
 
    // /**
    //  * 跳转到图片接口页面
    //  * @returns 
    //  */
    // function toAPIPage() {
    //     let type = window?.base?.detail?.preview?.channel;
    //     if (type !== "pic") {
    //         alert("当前文档类型不适用");
    //         return;
    //     }
 
    //     let base = window.base;
    //     let query = utils.dictToQueryStr({
    //         project_id: 1,
    //         aid: base.detail.preview.office.aid,
    //         t: base.detail.senddate,
    //         view_token: base.detail.preview.pic.view_token,
    //         filetype: getDocType(),
    //         callback: "jQuery123_456",
    //         max: base.detail.preview.pic.preview_page,
    //     });
 
    //     open(`https://openapi.book118.com/?${query}`);
    // }
 
 
    /**
     * 原创力文档下载策略
     */
    function book118() {
        const host = window.location.hostname;
        if (host === 'max.book118.com') {
            if (isEXCEL()) {
                utils.createBtns();
                utils.setBtnListener(openEXCELpage, 1, "访问EXCEL");
            } else if (isPPT()) {
                utils.createBtns();
                utils.setBtnListener(openPPTpage, 1, "访问PPT");
            } else {
                book118_CommonDoc();
            }
        } else if (host === "view-cache.book118.com") {
            book118_PPT();
        } else if (host.match(/view[0-9]{1,3}.book118.com/)) {
            book118_EXCEL();
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
        return utils.imgsToPDF(
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
        utils.createBtns();
        // 绑定监听器
        // 按钮1：导出PDF
        utils.setBtnListener(hintThenDownload$1, 1, "导出PDF");
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
 
 
    function* genImgURLs() {
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
        return utils.imgURLsToPDF(genImgURLs(), title);
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
        return utils.runWithProgPopup(
            1, fetchThenExportPDF
        );
    }
 
 
    /**
     * safewk文档下载策略
     */
    async function safewk() {
        // 创建按钮区
        utils.createBtns();
        // 绑定监听器
        // 按钮1：导出PDF
        utils.setBtnListener(
            hintThenDownload, 1, "导出PDF"
        );
    }
 
    /**
     * 跳转到页码
     * @param {string | number} num 
     */
    function toPage(num) {
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
    function toPageGUI() {
        let num = prompt("请输入要跳转的页码")?.trim();
        if (/^[0-9]+$/.test(num)) {
            toPage(num);
        } else {
            console.log(`输入值 [${num}] 不是合法整数`);
        }
    }
 
 
    /**
     * 记录prop不存在value到控制台
     * @param {string} prop 
     * @param {any} value 
     */
    function logEmpty(prop, value) {
        console.log(`wk: info's [${prop}] is an empty value: [${value}]`);
    }
 
 
    /**
     * 验证info对象是否成功采集各项数据，失败时输出到控制台
     * @param {Object} info 
     */
    function isIntact(info) {
        for (let prop in info) {
            let value = info[prop];
 
            if (value === undefined || value === "" || value === NaN) {
                logEmpty(prop, value);
                return false;
            }
 
            if (typeof value === "object") {
                if (!isIntact(value)) {
                    return false;
                }
            }
        }
        return true;
    }
 
 
    /**
     * 更新 WebPreview.Base.data 中的时间戳属性
     */
    function updateStamp() {
        let data = window?.WebPreview?.Base?.data;
        if (data) {
            let now = Date.now();
            data.jsoncallback = 'callback' + now;
            data.callback = 'callback' + now;
            data._ = now;
        }
    }
 
 
    /**
     * 收集文档信息，用于跨页面传递
     * @returns 
     */
    function collectInfo() {
        let 
            win = window,
            params = win.previewParams,
            view = win.WebPreview,
            ver = view?.version,
            base = view?.Base,
            data = view?.Data,
            pages = parseInt(wk$('meta[property="og:document:page"]')[0].content),
            preview = data?.preview_page,  // 默认值可能不准，需要从加密图像url链接的请求中获取更新值
            encrypted_at = base?.page?.start,
            query_str = utils.dictToQueryStr(base?.data);
 
        // WebPreview 为 true 说明>=6页
        // general.encrypted 为 true 说明>=21页
        let info = {
            direct: {
                base_url: params?.pre,
                fake_type: params?.ShowType === 2 ? ".svg" : ".gif"
            },
 
            encrypted: {
                query_str,
                step: base?.page?.zone,
                api: base?.host + base?.requestUrl
            },
 
            general: {
                WebPreview: !!view,
                renrendoc_ver: ver,
                ver_followed: ver ? ver === "2022.10.25_2" : "unknown",
                pages,
                encrypted_at,
                preview,
                encrypted:
                    preview && encrypted_at ? (
                        preview < encrypted_at ? false : true       // 预览页码小于加密起始页码，肯定不加密
                    ) : (                                  // 不存在某个页码，说明页数少，不加密
                        pages && encrypted_at ? (
                            pages < encrypted_at ? false : true     // 总页码小于加密起始页码，肯定不加密
                        ) : false                                   // 不存在某个页码，说明页数少，不加密
                    )
            }
        };
        isIntact(info);
        window.rrdocJS.info = info;
        return info;
    }
 
 
    /**
     * 为请求失败抛出异常
     * @param {Response} resp 
     */
    function raiseForStatus(resp) {
        let code = resp.status;
        if ("45".includes(`${code}`[0])) {
            throw new Error(`request failed: ${code}`);
        }
    }
 
    /**
     * 获取加密图片的链接列表的JSON响应
     * @param {Object} info 
     * @param {number} begin 请求的起始页码，一般是 5n + 1 且 n >= 21
     * @returns {Promise<Object>}
     */
    async function _getEncryptedImgUrlsJson(info, begin) {
        // 配置请求
        let url = new URL(
            `${info.encrypted.api}?${info.encrypted.query_str}`
        );
        url.searchParams.set("start", begin);
        
        // 请求图像链接列表
        let resp = await fetch(url);
        raiseForStatus(resp);
        let text = await resp.text();
        let json = text.replace(/callback[0-9]+[(]/, "").slice(0, -1);
        return JSON.parse(json);
    }
 
 
    /**
     * 通过请求一次加密图片链接列表来更新可预览页数
     */
    async function updatePreviewPageNum(info) {
        let begin = info.general.encrypted_at;
        let data = await _getEncryptedImgUrlsJson(info, begin);
        console.log(data);
 
        let prop = window?.WebPreview?.Data;
        if (!prop) {
            logEmpty("window?.WebPreview?.Data", prop);
            return;
        }
        let preview = data?.data?.read_count;
        if (preview) {
            prop.preview_page = parseInt(preview);
        }
    }
 
 
    /**
     * 获取加密图片的链接列表(length=5)
     * @param {Object} info 
     * @param {number} begin 请求的起始页码，一般是 5n + 1 且 n >= 21
     * @returns {Promise<string>}
     */
    async function getEncryptedImgUrls(info, begin) {
        // 请求JSON
        let data = await _getEncryptedImgUrlsJson(info, begin);
        
        // 提取列表
        if (data.data && data.data.preview_list) {
            return data.data.preview_list.map(page => "https:" + page.url);
        }
        return [];
    }
 
 
    /**
     * 获取全部加密图片链接构成的列表
     * @param {Object} info 
     * @returns {Promise<Array<string>>}
     */
    async function getAllEncryptedImgUrls(info) {
        info = await getLatestInfo(info);
        
        let
            gap = window.rrdocJS.gap,
            max_gap = window.rrdocJS.max_gap,
            begin = info.general.encrypted_at,
            stop = info.general.preview,
            step = info.encrypted.step,
            tasks = [];
        await utils.sleep(gap, max_gap);
        
        // 总进度条
        window.rrdocJS.all = stop + 1 - begin;
 
        for (let i of utils.range(begin, stop + 1, step)) {
            tasks.push(getEncryptedImgUrls(info, i));
            // 当前进度
            window.rrdocJS.requested += step;
            // 等待间隔，2-2.5秒
            await utils.sleep(gap, max_gap);
        }
        return (await utils.gather(tasks)).flat();
    }
 
 
    function _notNull(value, default_value) {
        return value !== null ? value : default_value;
    }
 
 
    /**
     * 获取全部直接请求的图片
     * @param {Object} info 
     * @param {number} end 可以手动指定终止页码, 默认为null
     * @param {string} base 可以手动指定基准url, 默认为null
     * @param {string} type 可以手动指定图像类型, 默认为null
     * @returns
     */
    function* genDirectImgUrls(info, end=null, base=null, type=null) {
        let pages = info.general.pages;
        end = pages > 20 ? 20 : pages;
        base = _notNull(base, info.direct.base_url);
        type = _notNull(type, info.direct.fake_type);
 
        for (let i of utils.range(1, end + 1)) {
            yield `${base}${i}${type}`;
        }
    }
 
 
    // /**
    //  * 获取全部直接请求的图片
    //  * @param {Object} info 
    //  * @param {number} end 可以手动指定终止页码, 默认为null
    //  * @returns {Promise<Array<Blob>>}
    //  */
    // async function getDirectImgs(info, end=null) {
    //     let tasks = [];
 
    //     for (let url of genDirectImgUrls(info, end)) {
    //         tasks.push(
    //             (async() => (await fetch(url)).blob())()
    //         );
    //     }
    //     return utils.gather(tasks);
    // }
 
 
    /**
     * 提取首个图片链接的 [base_url, type]
     * @returns {Array<string>}
     */
    function getBaseUrlOnPage() {
        let img = wk$(".page > img")[0];
        let origin = img.getAttribute("data-original");
        let url = origin ? origin : img.src;
        let type = url.slice(-8).split("1.")[1];
        return [url.replace("1." + type, ""), type];
    }
 
 
    // async function exportPDFWithDirectImgs(info, end) {
    //     let blobs = await getDirectImgs(info, end);
    //     await utils.imgBlobsToPDF(blobs, document.title);
    // }
 
    /**
     * 以旧info查询并返回新的
     * @param {Object} info 
     * @returns {Promise<Object>}
     */
    async function getLatestInfo(info) {
        updateStamp();
        info = collectInfo();
        await updatePreviewPageNum(info);
        return collectInfo();
    }
 
 
    /**
     * 初始化进度条弹窗
     */
    function initProgressPopup() {
        let all = -1;
        Object.defineProperty(
            window.rrdocJS,
            "all",
            {
                get: () => all,
                set: val => all = val
            }
        );
 
        utils.addPopup();
 
        let sent = 0;
        Object.defineProperty(
            window.rrdocJS,
            "requested", {
                get: () => sent,
                set: val => {
                    sent = val;
                    // 计算进度
                    let
                        rate = (val / all * 100),
                        show_val = val <= all ? val : all,
                        remain
                            = 0.5 * (
                                window.rrdocJS.gap + window.rrdocJS.max_gap
                            ) * 0.001 * (all - val)
                            / window.rrdocJS.info.encrypted.step;
                    rate = (rate <= 100 ? rate : 100).toFixed(2);
                    remain = (remain >= 0 ? remain : 0).toFixed(1);
                    // 更新进度条
                    utils.popupText(
                        `当前进度: ${rate}%，${show_val}/${all}(+20)页，预计剩余${remain}秒`
                    );
                }
            }
        );
        // 按钮3：显示进度条
        utils.setBtnListener(
            () => utils.toID("wk-popup"),
            3,
            "显示进度条"
        );
        utils.toggleBtn(3);
        // 按钮4：为什么下载慢
        utils.setBtnListener(
            () => {
                let delay = (window.rrdocJS.gap / 1000).toFixed(0);
                alert(`因网站限制，请求间隔必须大于 ${delay} 秒，请理解`);
            },
            4,
            "为什么下载慢"
        );
        utils.toggleBtn(4);
        // 显示弹窗
        utils.toID("wk-popup");
        // 隐藏跳转页码以降低触发网络请求的可能性
        utils.toggleBtn(2);
    }
 
 
    /**
     * 销毁进度条弹窗
     */
    function destoryProgressPopup() {
        let {all, requested} = window.rrdocJS;
        Object.defineProperties(window.rrdocJS, {
            "all": {
                value: all
            },
            "requested": {
                value: requested
            }
        });
        utils.removePopup();
        // 隐藏按钮3
        utils.toggleBtn(3);
        // 显示跳转页码
        utils.toggleBtn(2);
    }
 
 
    function showDocType() {
        let type = window.rrdocJS.doc_type;
        alert(`当前文档类型：${type}\n1类：最多导出5页的链接\n2类：最多导出20页的链接\n3类：不确定`);
    }
 
 
    async function judgeFileType() {
        // 创建按钮区
        utils.createBtns();
 
        const
            info = collectInfo(),
            pages = info.general.pages;
        let handler, doc_type;
        
        // 判断页数范围
        // 小于等于5页
        if (pages < 6) {
            doc_type = 1;
            handler = () => {
                let [base, type] = getBaseUrlOnPage();
                utils.saveImgURLs(
                    genDirectImgUrls(info, null, base, type)
                );
            };
        }
        
        // 没有加密图片
        else if (!info.general.encrypted) {
            doc_type = 2;
            handler = () => utils.saveImgURLs(
                genDirectImgUrls(info)
            );
        }
 
        // 有加密图片
        else if (info.general.encrypted) {
            doc_type = 3;
            handler = async() => {
                utils.toggleBtn(1);
                initProgressPopup();
                let urls = [
                    ...genDirectImgUrls(info),
                    ...(await getAllEncryptedImgUrls(info))
                ];
                utils.saveImgURLs(urls);
                destoryProgressPopup();
            };
            // 按钮2：转到页码
            utils.setBtnListener(toPageGUI, 2, "转到页码");
            utils.toggleBtn(2);
 
        // 未知情况
        } else {
            doc_type = -1;
            console.log(info);
            alert("未能处理该文档，请加 QQ 群反馈");
            return;
        }
        window.rrdocJS.doc_type = doc_type;
 
        // 正版授权文档
        if (!info.base_url || wk$(".tag-stand")[0]) {
            handler = () => {
                if (!confirm("是否预览完毕？")) {
                    return;
                }
 
                // https://www.renrendoc.com/paper/*.html
                let urls = wk$("#page .page img").map(img => 
                    !utils.isSameOrigin(img.src) ?
                        img.src : img.getAttribute("data-original")
                );
                
                // https://www.renrendoc.com/p-*.html
                if (urls.length === 0) {
                    urls = wk$(".inner_page img").map(img => img.src);
                }
                utils.saveImgURLs(urls);
            }; 
        }
 
        // 按钮1：导出图片链接
        utils.setBtnListener(handler, 1, "导出图片链接");
        // 按钮5：为什么不全
        utils.setBtnListener(showDocType, 5, "显示文档类型");
        utils.toggleBtn(5);
    }
 
 
    /**
     * 人人文档下载策略
     */
    async function renrendoc() {
        window.rrdocJS = {
            info: {},
            doc_type: null,
            gap: 2000,  // 请求间隔, ms
            max_gap: 2500,  // 请求间隔的波动上限, ms
            all: -1,  // 一共需要请求的页数        
            requested: 0  // 已经请求的页数
        };
 
        await utils.sleep(500);
        judgeFileType();  // 判断完类型会显示按钮1
    }
 
    /**
     * 取得全部图片连接
     * @returns {Array<string>}
     */
    function getImgUrls() {
        // '../files/large/'
        let pre_path = htmlConfig.bookConfig.largePath;
        if (pre_path instanceof Array) {
            pre_path = pre_path[0];
        }
        const
            base = location.href,
            urls = window.htmlConfig.fliphtml5_pages.map(obj => {
                // "../files/large/d8b6c26f987104455efb3ec5addca7c9.jpg"
                let path = pre_path + obj.n[0].split("?")[0];
                let url = new URL(path, base);
                // https://book.yunzhan365.com/mctl/itid/files/large/d8b6c26f987104455efb3ec5addca7c9.jpg
                return url.href;
            });
 
        globalThis.img_urls = urls;
        return urls;
    }
 
 
    /**
     * 导出图片到PDF
     */
    function exportPDF$1() {
        const
            urls = getImgUrls(),
            title = htmlConfig.meta.title;
 
        alert("正在下载图片，请稍等，时长取决于图片数量");
        return utils.runWithProgPopup(
            1, () => utils.imgURLsToPDF(urls, title)
        );
    }
 
 
    /**
     * 移除多余空按钮
     */
    function removeSpareBtns() {
        utils.removeMulti(
            wk$(".btns_section [class*=btn-]").slice(1)
        );
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
        utils.createBtns();
        utils.setBtnListener(exportPDF$1, 1, "导出PDF");
        removeSpareBtns();
    }
 
    /**
     * 截取当前对话，返回canvas
     * @param {Function} once 一次性任务
     * @returns {Promise<HTMLCanvasElement>}
     */
    async function captureChat(once) {
        // 执行一次性任务
        await once();
        return (
            await utils.elementsToCanvases([window.chat])
        )[0];
    }
 
 
    /**
     * 导出图片到文件和剪贴板
     * @param {HTMLCanvasElement} canvas
     */
    async function exportCanvas(canvas) {
        const blob = await utils.canvasToBlob(canvas);
        utils.saveAs("BingAI对话.png", blob);
        utils.copyData(blob);
    }
 
 
    /**
     * 截图并导出对话
     */
    async function exportChatAsImage() {
        // 定义一次性任务
        const once = utils.once(() => {
            // 移除video元素
            utils.removeMulti(wk$("video"));
            // 移除对话外元素
            for (let elem of [...document.body.children].slice(2)) {
                utils.remove(elem);
            }        // 移除顶部欢迎
            utils.remove(
                wk$.call(window.chat, "cib-welcome-container")[0]
            );
        });
 
        return exportCanvas(
            await captureChat(once)
        );
    }
 
 
    /**
     * 初始化工作
     */
    async function init() {
        const
            box1 = (await wk$$(".cib-serp-main"))[0],
            box2 = (await wk$$.call(box1.shadowRoot, "#cib-conversation-main"))[0],
            chat = (await wk$$.call(box2.shadowRoot, "#cib-chat-main"))[0],
            outer_bar = (await wk$$.call(box1.shadowRoot, "#cib-action-bar-main"))[0],
            bar = (await wk$$.call(outer_bar.shadowRoot, ".root"))[0],
            ori_btn = (await wk$$.call(bar, ".outside-left-container"))[0];
        window.chat = chat;
            
        if (!(ori_btn instanceof HTMLElement)) {
            throw Error(`${ori_btn} 的类型不是 HTMLElement!`);
        }
 
        // 复制按钮
        let button = ori_btn.cloneNode(false);
        window.button = button;
        
        // 更换按钮图标
        button.innerHTML = `
        <div class="button-compose-wrapper">
        <button class="button-compose" type="button" aria-label="新主题" collapsed="">
        <div class="button-compose-content">
        <div size="32" style="--icon-size:32px;" class="button-compose-icon">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet">
        <metadata>
        Created by potrace 1.15, written by Peter Selinger 2001-2017, edited by Allen Lv 2023
        </metadata>
        <g transform="translate(4.7, 4.7) scale(0.02, 0.02)">
        <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" fill="#ffffff" stroke="none">
        <path d="M3998 12784 c-62 -33 -58 154 -58 -2439 l0 -2365 -800 0 -800 0 -31
        -28 c-39 -35 -43 -89 -8 -136 66 -90 3316 -4165 3340 -4188 22 -21 39 -28 69
        -28 29 0 47 7 70 28 16 15 779 968 1695 2117 1163 1460 1667 2099 1671 2121 7
        36 -8 70 -40 96 -19 16 -78 18 -823 18 l-803 0 0 2375 0 2375 -29 32 -29 33
        -1699 2 c-1488 2 -1701 0 -1725 -13z"></path>
        <path d="M1687 4649 l-288 -8 -32 -27 c-17 -15 -332 -286 -699 -602 l-668
        -575 0 -1719 0 -1718 5630 0 5630 0 0 1718 -1 1717 -700 603 -700 603 -252 5
        c-139 3 -267 7 -284 9 l-33 4 0 -800 0 -799 -3645 0 c-2423 0 -3645 -3 -3645
        -10 0 -5 -3 -10 -7 -10 -5 0 -7 364 -5 810 1 445 -1 809 -5 808 -5 0 -137 -5
        -296 -9z"></path></g></g></svg></div>
        <div class="button-compose-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">保存对话</font></font></div></div>
        </button>
        <div class="button-compose-hint"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">保存对话</font></font></div>
        </div>`;
        
        // 为点击绑定回调
        button
            .querySelector(".button-compose-content")
            .addEventListener("click", exportChatAsImage);
 
        // 添加到DOM
        bar.append(button);
    }
 
 
    /**
     * BingAI对话辅助工具
     */
    async function bingAIChat() {
        init();
    }
 
    /**
     * 导出图片链接
     */
    function exportURLs$1() {
        const all = parseInt(
            wk$("#bot-bar-inn > span")[0].textContent.split("/")[1]
        );
        const imgs = wk$("[data-num] img");
        const got = imgs.length;
 
        if (got < all) {
            if (!confirm(
                `当前浏览页数：${got}，总页数：${all}\n建议浏览剩余页面以导出全部链接\n是否继续导出链接？`
            )) {
                return;
            }
        }
        utils.saveImgURLs(
            imgs.map(img => img.src)
        );
    }
 
 
    /**
     * 取出图片链接，发给同源页面让其代下载
     */
    async function callAgent() {
        const url = new URL(
            wk$("[data-num] img")[0].src
        );
        const aim = "swf.ishare.down.sina.com.cn";
        
        if (url.hostname !== aim) {
            alert("当前页面不适用！");
            console.log(url);
            return;
        }
 
        const sock = new utils.Socket(
            open(`${url.protocol}//${aim}/?wk=true`)
        );
        await sock.connect(false);
 
        // 移除请求的内容范围，等价于请求整体
        url.searchParams.delete("range");
        sock.talk({
            wk: true,
            action: true,
            img_url: url.href,
            title: document.title.split(" - ")[0].replace(".pdf", ""),
        });
        alert("请于新打开的页面查收 PDF");
    }
 
 
    /**
     * 360文库文档下载策略
     */
    function wenku360() {
        utils.createBtns();
        utils.setBtnListener(
            exportURLs$1, 1, "导出图片链接"
        );
 
        utils.setBtnListener(
            callAgent, 2, "导出PDF"
        );
        utils.toggleBtn(2);
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
        utils.saveAs(info.fname + `.${info.ext}`, blob);
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
                await utils.canvasToBlob(canvas)
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
        utils.toggleBtn(1);
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
        utils.setBtnListener(
            () => utils.imgBlobsToPDF(imgs, fname),
            2,
            "导出PDF"
        );
        utils.toggleBtn(2);
 
        utils.setBtnListener(
            () => utils.blobsToZip(imgs, "page", "png", fname),
            3,
            "导出ZIP"
        );
        utils.toggleBtn(3);
    }
 
 
    /**
     * 技工教育文档预览页面策略
     */
    function jgPreview() {
        utils.createBtns();
        utils.setBtnListener(
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
        return utils.runWithProgPopup(
            2, () => utils.imgURLsToPDF(urls, title)
        );
    }
 
 
    function exportURLs() {
        const urls = getImgURLs();
        utils.saveImgURLs(urls);
    }
 
 
    /**
     * 文库吧文档下载策略
     */
    function wenkub() {
        utils.createBtns();
        
        utils.setBtnListener(
            exportURLs, 1, "导出图片链接"
        );
 
        utils.setBtnListener(
            exportPDF, 2, "导出PDF(测试)"
        );
        utils.toggleBtn(2);
    }
 
    const PDF_LIB_CDN = "https://cdn.staticfile.org/pdf-lib/1.17.1/pdf-lib.min.js";
 
 
    function* pageURLGen() {
        const
            url = new URL(location.href),
            params = url.searchParams,
            base = url.origin + (basePath || "/manuscripts/pdf"),
            type = params.get("type") || "pdf",
            id = params.get("id");
        
        let i = 0;
        while (true) {
            yield [i, `${base}/data/${type}/${id}/${i++}?random=null`];
        }
    }
 
 
    /**
     * 合并多个PDF
     * @param {Array<ArrayBuffer | Uint8Array>} pdfs 
     * @returns {Promise<Uint8Array>}
     */
    async function joinPDFs(pdfs) {
        if (!window.PDFLib) {
            await utils.loadWebScript(PDF_LIB_CDN);
        }
 
        const combined = await PDFLib.PDFDocument.create();
 
        for (const [i, buffer] of utils.enumerate(pdfs)) {
            const pdf = await PDFLib.PDFDocument.load(buffer);
            const pages = await combined.copyPages(
                pdf, pdf.getPageIndices()
            );
 
            for (const page of pages) {
                combined.addPage(page);
            }
            utils.popupText(`已经合并 ${i + 1} 组`);
        }
 
        return await combined.save();
    }
 
 
    async function downloadPDF() {
        const pdfs = [];
        let
            last_digest = NaN,
            size = 1;
 
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
                utils.base64DecToArr(b64_data)
            );
            utils.popupText(
                `已经获取 ${i + 1} 组 (${(i + 1) * size} 页)`
            );
        }
 
        const combined = await joinPDFs(pdfs);
        utils.saveAs(
            document.title + ".pdf",
            combined,
            "application/pdf"
        );
    }
 
 
    function downloadPDFGUI() {
        return utils.runWithProgPopup(
            1, async() => {
                try {
                    await downloadPDF();
                } catch(e) {
                    console.error(e);
                }
            }
        );
    }
 
 
    /**
     * 中国社会科学文库文档策略
     */
    function sklib() {
        utils.createBtns();
        utils.setBtnListener(
            downloadPDFGUI, 1, "导出PDF"
        );
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
        utils.saveImgURLs(
            imgURLGen()
        );
    }
 
 
    function jinchutou() {
        utils.createBtns();
        utils.setBtnListener(
            getURLs, 1, "导出图片链接"
        );
    }
 
    /**
     * 主函数：识别网站，执行对应文档下载策略
     */
    function main() {
        // 显示当前位置
        const host = location.hostname;
        const params = new URL(location.href).searchParams;
        console.log(`当前 host: ${host}`);
        // ---调试用---
        // window.loaded_doc = new DOMParser()
        //     .parseFromString(wk$("html")[0].outerHTML, "text/html");
        // console.log(loaded_doc);
        // -----------
 
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
        } else if (host === "www.bing.com") {
            bingAIChat();
        } else if (host === "wenku.so.com") {
            wenku360();
        } else if (host === "jg.class.com.cn") {
            jg();
        } else if (host === "preview.imm.aliyuncs.com") {
            jgPreview();
        } else if (host === "www.wenkub.com") {
            wenkub();
        } else if (host === "www.sklib.cn") {
            sklib();
        } else if (host === "www.jinchutou.com") {
            jinchutou();
        } else {
            console.log("匹配到了无效网页");
        }
    }
 
 
    setTimeout(main, 1000);
 
})();