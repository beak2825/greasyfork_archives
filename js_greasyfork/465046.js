// ==UserScript==
// @name            flash-game-downloader
// @namespace       http://tampermonkey.net/
// @version         0.0.6
// @description     一键下载 flash 游戏（swf），有限地支持（1）4399（2）7k7k（3）nitrome
// @author          2690874578@qq.com
// @match           https://www.4399.com/flash/*
// @match           https://s2.4399.com
// @match           http://www.7k7k.com/swf/*.htm*
// @match           *://www.nitrome.com/*
// @require         https://cdn.staticfile.org/jszip/3.7.1/jszip.min.js
// @require         https://cdn.staticfile.org/sweetalert2/11.7.5/sweetalert2.all.min.js
// @icon            data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzE0XzIpIj4KPHBhdGggZD0iTTI4LjI2NjcgMEgzLjczMzMzQzEuNzA2NjcgMCAwIDEuNzA2NjcgMCAzLjczMzMzVjI4LjI2NjdDMCAzMC4yOTMzIDEuNzA2NjcgMzIgMy43MzMzMyAzMkgyOC4yNjY3QzMwLjI5MzMgMzIgMzIgMzAuMjkzMyAzMiAyOC4yNjY3VjMuNzMzMzNDMzIgMS43MDY2NyAzMC4yOTMzIDAgMjguMjY2NyAwWk0yMy40NjY3IDEwLjEzMzNDMjMuNDY2NyAxMC40NTMzIDIzLjI1MzMgMTAuNjY2NyAyMi45MzMzIDEwLjY2NjdDMjAuMjY2NyAxMC42NjY3IDIwLjE2IDEwLjk4NjcgMTkuNzMzMyAxMi4xNkMxOS42MjY3IDEyLjM3MzMgMTkuNjI2NyAxMi41ODY3IDE5LjUyIDEyLjhIMjEuODY2N0MyMi4xODY3IDEyLjggMjIuNCAxMy4wMTMzIDIyLjQgMTMuMzMzM1YxNy42QzIyLjQgMTcuOTIgMjIuMTg2NyAxOC4xMzMzIDIxLjg2NjcgMTguMTMzM0gxOC4wMjY3QzE2Ljg1MzMgMjIuMjkzMyAxMi40OCAyNi42NjY3IDggMjYuNjY2N0M3LjY4IDI2LjY2NjcgNy40NjY2NyAyNi40NTMzIDcuNDY2NjcgMjYuMTMzM1YyMS44NjY3QzcuNDY2NjcgMjEuNTQ2NyA3LjY4IDIxLjMzMzMgOCAyMS4zMzMzQzExLjMwNjcgMjEuMzMzMyAxMi4yNjY3IDE4LjY2NjcgMTMuMzMzMyAxNS4yNTMzQzEzLjU0NjcgMTQuNzIgMTMuNjUzMyAxNC4yOTMzIDEzLjg2NjcgMTMuNzZDMTUuMjUzMyA5LjkyIDE2Ljg1MzMgNS4zMzMzMyAyMi45MzMzIDUuMzMzMzNDMjMuMjUzMyA1LjMzMzMzIDIzLjQ2NjcgNS41NDY2NyAyMy40NjY3IDUuODY2NjdWMTAuMTMzM1oiIGZpbGw9IiNEODFFMDYiLz4KPHBhdGggZD0iTTIxLjE3ODkgMzYuMDg0MkMxOS45MTU4IDM2LjA4NDIgMTguNjUyNiAzNS41Nzg5IDE3LjY0MjEgMzQuNTY4NEMxNS42MjEgMzIuNTQ3NCAxNS42MjEgMjkuMzg5NSAxNy42NDIxIDI3LjM2ODRMMjAuMjk0NyAyNC43MTU4TDIyLjA2MzIgMjYuNDg0MkwxOS40MTA1IDI5LjEzNjhDMTguNCAzMC4xNDc0IDE4LjQgMzEuNjYzMiAxOS40MTA1IDMyLjY3MzdDMjAuNDIxIDMzLjY4NDIgMjEuOTM2OCAzMy42ODQyIDIyLjk0NzQgMzIuNjczN0wyNi40ODQyIDI5LjEzNjhDMjYuOTg5NSAyOC42MzE2IDI3LjI0MjEgMjggMjcuMjQyMSAyNy4zNjg0QzI3LjI0MjEgMjYuNzM2OCAyNi45ODk1IDI2LjEwNTMgMjYuNjEwNSAyNS42TDI1LjIyMTEgMjQuMzM2OEwyNi45ODk1IDIyLjU2ODRMMjguMzc4OSAyMy45NTc5QzI5LjI2MzIgMjQuODQyMSAyOS43Njg0IDI2LjEwNTMgMjkuNzY4NCAyNy40OTQ3QzI5Ljc2ODQgMjguODg0MiAyOS4yNjMyIDMwLjE0NzQgMjguMjUyNiAzMS4wMzE2TDI0LjcxNTggMzQuNTY4NEMyMy44MzE2IDM1LjU3ODkgMjIuNDQyMSAzNi4wODQyIDIxLjE3ODkgMzYuMDg0MlpNMjUuMjIxMSAyOS42NDIxTDIzLjgzMTYgMjguMzc4OUMyMS44MTA1IDI2LjM1NzkgMjEuODEwNSAyMy4yIDIzLjgzMTYgMjEuMTc4OUwyNy4zNjg0IDE3LjY0MjFDMjkuMzg5NSAxNS42MjEgMzIuNTQ3NCAxNS42MjEgMzQuNTY4NCAxNy42NDIxQzM2LjU4OTUgMTkuNjYzMiAzNi41ODk1IDIyLjgyMSAzNC41Njg0IDI0Ljg0MjFMMzEuOTE1OCAyNy40OTQ3TDMwLjE0NzQgMjUuNzI2M0wzMi44IDIzLjA3MzdDMzMuODEwNSAyMi4wNjMyIDMzLjgxMDUgMjAuNTQ3NCAzMi44IDE5LjUzNjhDMzEuNzg5NSAxOC41MjYzIDMwLjE0NzQgMTguNTI2MyAyOS4yNjMyIDE5LjUzNjhMMjUuNiAyMi45NDc0QzI0LjU4OTUgMjMuOTU3OSAyNC41ODk1IDI1LjQ3MzcgMjUuNiAyNi40ODQyTDI2Ljk4OTUgMjcuODczN0wyNS4yMjExIDI5LjY0MjFaIiBmaWxsPSIjMjcyNjM2Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTRfMiI+CjxyZWN0IHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K
// @grant           none
// @run-at          document-idle
// @license         GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/465046/flash-game-downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/465046/flash-game-downloader.meta.js
// ==/UserScript==


(function() {
    /**
     * 脚本级全局常量
     */

    FLASH_ICON = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzE0XzIpIj4KPHBhdGggZD0iTTI4LjI2NjcgMEgzLjczMzMzQzEuNzA2NjcgMCAwIDEuNzA2NjcgMCAzLjczMzMzVjI4LjI2NjdDMCAzMC4yOTMzIDEuNzA2NjcgMzIgMy43MzMzMyAzMkgyOC4yNjY3QzMwLjI5MzMgMzIgMzIgMzAuMjkzMyAzMiAyOC4yNjY3VjMuNzMzMzNDMzIgMS43MDY2NyAzMC4yOTMzIDAgMjguMjY2NyAwWk0yMy40NjY3IDEwLjEzMzNDMjMuNDY2NyAxMC40NTMzIDIzLjI1MzMgMTAuNjY2NyAyMi45MzMzIDEwLjY2NjdDMjAuMjY2NyAxMC42NjY3IDIwLjE2IDEwLjk4NjcgMTkuNzMzMyAxMi4xNkMxOS42MjY3IDEyLjM3MzMgMTkuNjI2NyAxMi41ODY3IDE5LjUyIDEyLjhIMjEuODY2N0MyMi4xODY3IDEyLjggMjIuNCAxMy4wMTMzIDIyLjQgMTMuMzMzM1YxNy42QzIyLjQgMTcuOTIgMjIuMTg2NyAxOC4xMzMzIDIxLjg2NjcgMTguMTMzM0gxOC4wMjY3QzE2Ljg1MzMgMjIuMjkzMyAxMi40OCAyNi42NjY3IDggMjYuNjY2N0M3LjY4IDI2LjY2NjcgNy40NjY2NyAyNi40NTMzIDcuNDY2NjcgMjYuMTMzM1YyMS44NjY3QzcuNDY2NjcgMjEuNTQ2NyA3LjY4IDIxLjMzMzMgOCAyMS4zMzMzQzExLjMwNjcgMjEuMzMzMyAxMi4yNjY3IDE4LjY2NjcgMTMuMzMzMyAxNS4yNTMzQzEzLjU0NjcgMTQuNzIgMTMuNjUzMyAxNC4yOTMzIDEzLjg2NjcgMTMuNzZDMTUuMjUzMyA5LjkyIDE2Ljg1MzMgNS4zMzMzMyAyMi45MzMzIDUuMzMzMzNDMjMuMjUzMyA1LjMzMzMzIDIzLjQ2NjcgNS41NDY2NyAyMy40NjY3IDUuODY2NjdWMTAuMTMzM1oiIGZpbGw9IiNEODFFMDYiLz4KPHBhdGggZD0iTTIxLjE3ODkgMzYuMDg0MkMxOS45MTU4IDM2LjA4NDIgMTguNjUyNiAzNS41Nzg5IDE3LjY0MjEgMzQuNTY4NEMxNS42MjEgMzIuNTQ3NCAxNS42MjEgMjkuMzg5NSAxNy42NDIxIDI3LjM2ODRMMjAuMjk0NyAyNC43MTU4TDIyLjA2MzIgMjYuNDg0MkwxOS40MTA1IDI5LjEzNjhDMTguNCAzMC4xNDc0IDE4LjQgMzEuNjYzMiAxOS40MTA1IDMyLjY3MzdDMjAuNDIxIDMzLjY4NDIgMjEuOTM2OCAzMy42ODQyIDIyLjk0NzQgMzIuNjczN0wyNi40ODQyIDI5LjEzNjhDMjYuOTg5NSAyOC42MzE2IDI3LjI0MjEgMjggMjcuMjQyMSAyNy4zNjg0QzI3LjI0MjEgMjYuNzM2OCAyNi45ODk1IDI2LjEwNTMgMjYuNjEwNSAyNS42TDI1LjIyMTEgMjQuMzM2OEwyNi45ODk1IDIyLjU2ODRMMjguMzc4OSAyMy45NTc5QzI5LjI2MzIgMjQuODQyMSAyOS43Njg0IDI2LjEwNTMgMjkuNzY4NCAyNy40OTQ3QzI5Ljc2ODQgMjguODg0MiAyOS4yNjMyIDMwLjE0NzQgMjguMjUyNiAzMS4wMzE2TDI0LjcxNTggMzQuNTY4NEMyMy44MzE2IDM1LjU3ODkgMjIuNDQyMSAzNi4wODQyIDIxLjE3ODkgMzYuMDg0MlpNMjUuMjIxMSAyOS42NDIxTDIzLjgzMTYgMjguMzc4OUMyMS44MTA1IDI2LjM1NzkgMjEuODEwNSAyMy4yIDIzLjgzMTYgMjEuMTc4OUwyNy4zNjg0IDE3LjY0MjFDMjkuMzg5NSAxNS42MjEgMzIuNTQ3NCAxNS42MjEgMzQuNTY4NCAxNy42NDIxQzM2LjU4OTUgMTkuNjYzMiAzNi41ODk1IDIyLjgyMSAzNC41Njg0IDI0Ljg0MjFMMzEuOTE1OCAyNy40OTQ3TDMwLjE0NzQgMjUuNzI2M0wzMi44IDIzLjA3MzdDMzMuODEwNSAyMi4wNjMyIDMzLjgxMDUgMjAuNTQ3NCAzMi44IDE5LjUzNjhDMzEuNzg5NSAxOC41MjYzIDMwLjE0NzQgMTguNTI2MyAyOS4yNjMyIDE5LjUzNjhMMjUuNiAyMi45NDc0QzI0LjU4OTUgMjMuOTU3OSAyNC41ODk1IDI1LjQ3MzcgMjUuNiAyNi40ODQyTDI2Ljk4OTUgMjcuODczN0wyNS4yMjExIDI5LjY0MjFaIiBmaWxsPSIjMjcyNjM2Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTRfMiI+CjxyZWN0IHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K`;


    /**
     * 脚本级公用函数和对象
     */

    /**
     * 元素选择器
     * @param {string} selector 选择器
     * @returns {Array<HTMLElement>} 元素列表
     */
    function $(selector) {
        const self = this?.querySelectorAll ? this : document;
        return [...self.querySelectorAll(selector)];
    }


    /**
     * 安全元素选择器，直到元素存在时才返回元素列表，最多等待5秒
     * @param {string} selector 选择器
     * @returns {Promise<Array<HTMLElement>>} 元素列表
     */
    async function $$(selector) {
        const self = this?.querySelectorAll ? this : document;

        for (let i = 0; i < 10; i++) {
            let elems = [...self.querySelectorAll(selector)];
            if (elems.length > 0) {
                return elems;
            }
            await new Promise(r => setTimeout(r, 500));
        }
        throw Error(`"${selector}" not found`);
    }


    const util = {
        /**
         * 查找数组中某元素的全部位置，找不到返回空列表
         * @param {Array} arr 
         * @param {Array} elem 
         * @returns {Array<number>}
         */
        get_indexes: function(arr, elem) {
            const indexes = [];
            let from = 0;
            let i = arr.indexOf(elem, from);

            while (i !== -1) {
                indexes.push(i);
                from = i + 1;
                i = arr.indexOf(elem, from);
            }
            return indexes;
        },

        /**
         * 返回子数组位置，找不到返回-1
         * @param {Array<number>} arr 父数组
         * @param {Array<number>} sub_arr 子数组
         * @param {number} from 开始位置
         * @returns {number} index
         */
        index_of_sub_arr: function(arr, sub_arr, from) {
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

        Socket: class Socket {
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
                        self.not_listen(wrapped);
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
            not_listen(listener) {
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
                        listener => listener.ping ? this.not_listen(listener) : 0
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
                        listener => listener.pong ? this.not_listen(listener) : 0
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
         * 返回一个包含计数器的迭代器, 其每次迭代值为 [index, value]
         * @param {Iterable} iterable 
         * @returns 
         */
        enumerate: function* (iterable) {
            let i = 0;
            for (let value of iterable) {
                yield [i++, value];
            }
        },
    
        /**
         * 同步的迭代若干可迭代对象
         * @param  {...Iterable} iterables 
         * @returns 
         */
        zip: function* (...iterables) {
            // 强制转为迭代器
            const iterators = iterables.map(
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
            };
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
            };
    
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
            const blob = new Blob(
                [content], { type }
            );
            const size = (blob.size / 1024).toFixed(1);
            console.log(`blob saved, size: ${size} kb, type: ${blob.type}`);
    
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.download = file_name || "未命名文件";
            a.href = url;
            a.click();
            URL.revokeObjectURL(url);
        },
    
        sleep: async function(delay_ms) {
            return new Promise(
                resolve => setTimeout(resolve, delay_ms)
            );
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
         * 等待直到函数返回true
         * @param {Function} is_ok 判断条件达成与否的函数
         * @param {number} timeout 最大等待秒数, 默认5000毫秒
         */
        wait_until: async function(is_ok, timeout=5000) {
            const gap = 200;
            let chances = parseInt(timeout / gap);
            chances = chances < 1 ? 1 : chances;
            
            while (! await is_ok()) {
                await this.sleep(200);
                chances -= 1;
                if (!chances) {
                    break;
                }
            }
        },
    
        /**
         * 用try移除元素
         * @param {HTMLElement} element 要移除的元素
         */
        remove: function(element) {
            try {
                element.remove();
            } catch (e) {}
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
                }
                xhr.send();
            });
        },
    
        /**
         * 加载CDN脚本
         * @param {string} url 
         */
        load_web_script: async function(url) {
            try {
                // xhr+eval方式
                Function(
                    await (await this.xhr_get_blob(url)).text()
                )();
            } catch(e) {
                console.error(e);
                // 嵌入<script>方式
                const script = document.createElement("script");
                script.src = url;
                document.body.append(script);
            }
        },
    };
    

    /**
     * 域名级主函数
     */


    /**
     * 启动下载 4399 flash 游戏
     */
    function dl_flash_4399() {
        /**
         * 域名级全局常量、变量
         */

        BASE_URL = "https://s2.4399.com/4399swf";
        let sock;


        async function send_url() {
            const title = $(".name a")[0].textContent.trim() || "flash游戏";
            const path = window._strGamePath;

            if (!path) util.raise(
                "_strGamePath 不存在，找不到游戏文件路径"
            );
            if (!path.endsWith(".swf")) util.raise(
                `当前游戏不是 flash 游戏。\n游戏路径为：${path}`
            );

            const id = "flash-dl-src";
            let iframe = $(`#${id}`)[0];

            if (!iframe) {
                iframe = document.createElement("iframe");
                iframe.id = id;
                iframe.src = "https://s2.4399.com";
                document.body.append(iframe);
                sock = new util.Socket(iframe.contentWindow);
                await sock.connect(false);
            }
            
            sock.talk({
                flash_dl: true,
                url: BASE_URL + path,
                title,
            });
        }

        function add_style() {
            const style = `
            <style>
                #flash-dl-btn {
                    text-align: center;
                    background: url("${FLASH_ICON}");
                    background-repeat: no-repeat;
                    background-position: top;
                    width: 40px;
                    padding-top: 30px;
                    margin: 0 10px;
                    float: left;
                    display: inline;
                    cursor: pointer;
                }

                #flash-dl-src {
                    display: none;
                }
            <style>
            `;
            document.head.insertAdjacentHTML(
                "beforeend", style
            );
        }

        async function add_dl_btn() {
            const box = (await $$("#uplayer .fr"))[0];

            // 修改误导性的下载按钮文本（下载4399游戏盒子）
            $("#down_a")[0].textContent = "盒子";
            
            // 新按钮
            const btn = document.createElement("a");
            btn.id = "flash-dl-btn";
            btn.textContent = "下载";
            btn.onfocus = () => btn.blur();
            btn.onclick = send_url;
            box.insertAdjacentElement("afterbegin", btn);
        }

        (() => {
            console.log("enter: dl_flash");
            add_style();
            add_dl_btn();
        })();
    }

    /**
     * 执行下载 4399 flash 游戏
     */
    function dl_flash_4399_in_origin() {
        /**
         * @param {MessageEvent} e 
         */
        async function on_msg(e) {
            if (!e.data.flash_dl) return;

            const { url, title } = e.data;
            const resp = await fetch(url, {
                headers: {
                    "Host": "szhong.4399.com",
                    "X-Requested-With": "ShockwaveFlash/34.0.0.282",
                }
            });
            if (!resp.ok) util.raise(
                `游戏下载失败，错误代码：${resp.status}，原因：${resp.statusText}`
            );

            const blob = await resp.blob();
            util.save(
                title.endsWith(".swf") ? title : title + ".swf",
                blob,
                "application/x-shockwave-flash"
            );
        }

        (() => {
            console.log("enter: dl_flash_in_origin")
            if (window.top === window) return;

            const sock = new util.Socket(window.top);
            sock.listen(on_msg);
            sock.connect(true);
        })();
    }

    /**
     * 下载 7k7k flash 游戏
     */
    function dl_flash_7k7k() {
        /**
         * 域名级全局常量变量
         */

        let swf_url;
        let dl_btn;
        const fnames = ["启动器.swf"];
        const HOW_TO_PLAY = `
            【如何游玩多 SWF 文件组成的 Flash 游戏？】
            1. 在你的电脑上下载并安装 python
            2. 将 python 解释器目录加入环境变量
            3. 在解压为文件夹的游戏目录下打开 cmd 或 powershell
            4. 输入命令：python -m http.server --bind 0.0.0.0 5678
            5. 回车执行上述命令
            6. 用支持 Flash 的浏览器（如 [cef flash browser](https://github.com/Mzying2001/CefFlashBrowser) 访问：http://127.0.0.1:5678/启动器.swf
        `.replace(/ {2,}/g, ""); 


        /**
         * @returns {number} 
         */
        function get_game_id() {
            return window?.gameInfo?.gameId ||
                parseInt(
                    // http://www.7k7k.com/swf/28079.htm?abc
                    location.pathname.match(/(?<=[/])[0-9]+?(?=[.]htm)/)[0]
                );
        }


        /**
         * @param {string | URL} url 
         * @returns {Promise<ArrayBuffer>}
         */
        async function fetch_as_buffer(url) {
            const resp = await fetch(url);
            console.log(resp);
            if (!resp.ok) util.raise(`资源获取失败：${resp.status}`);
            return await resp.arrayBuffer();
        }


        /**
         * @param {string} fname 
         */
        function update_url(fname) {
            const parts = swf_url.pathname.split("/");
            parts.splice(-1, 1, fname);
            swf_url.pathname = parts.join("/");
        }


        /**
         * @param {number} game_id 
         * @returns {Promise<ArrayBuffer>}
         */
        async function get_swf(game_id) {
            // 查询游戏信息
            const info_url = `http://www.7k7k.com/swf/game/${game_id}/?time`;
            const resp = await fetch(info_url);
            console.log(resp);
            if (!resp.ok) util.raise(`游戏信息查询失败：${resp.status}`);

            const info = await resp.json();
            console.log(info);

            // 查询游戏页面 url
            const iframe_url = info?.result?.url;
            console.log(iframe_url);
            if (!iframe_url) util.raise(
                `找不到游戏页面路径：<游戏信息>.result.url 不存在`
            );

            // 如果是游戏文件链接，直接下载，返回空结果用于终止后续函数
            if (iframe_url.endsWith(".swf")) {
                const swf = await fetch_as_buffer(iframe_url);
                const blob = new Blob(
                    [swf], { type: "application/x-shockwave-flash" }
                );
                util.save(get_title() + ".swf", blob);
                return;
            }

            // 从游戏页面 html 中提取游戏链接
            const resp2 = await fetch(iframe_url);
            console.log(resp2);
            if (!resp2.ok) util.raise(`游戏页面获取失败：${resp2.status}`);

            const html = await resp2.text();
            const matches = html.match(/_src_\s*?=\s*?(['"])(.+)?\1/)
                || html.match(/var\s+?p\s*?=\s*(['"])(.+)?\1/);
            console.log(matches);

            const swf_name = matches[2];
            console.log(swf_name);

            if (!swf_name) {
                console.log(html);
                util.raise(`游戏路径查询失败：游戏页面中找不到 _src_ = "..."`);
            }

            swf_url = new URL(iframe_url);
            update_url(swf_name);

            // 下载游戏文件
            return await fetch_as_buffer(swf_url);
        }


        function get_title() {
            return document.title.split(",")[0];
        }


        /**
         * @param {ArrayBuffer} data
         * @returns {string} 
         */
        function get_sub_fname(data) {
            const bytes = new Uint8Array(data);
            const end = util.index_of_sub_arr(
                //             .swf
                bytes, [0x2e, 0x73, 0x77, 0x66], 0
            );
            if (end === -1) {
                console.log(`找不到子文件路径：找不到 .swf 字符串`);
                return "";
            }

            const begin = bytes.lastIndexOf(0, end);
            if (begin === -1) {
                console.log(`找不到子文件路径：找不到 .swf 前的 \x00`);
                return "";
            }

            return new TextDecoder()
                .decode(bytes.subarray(begin + 1, end)) + ".swf";
        }


        /**
         * @param {ArrayBuffer} swf 
         * @param {Array<Blob>} files 
         * @returns {Promise<void>} 
         */
        async function collect_swfs(swf, files) {
            const fname = get_sub_fname(swf);
            if (!fname) return;

            fnames.push(fname);
            update_url(fname);

            const new_swf = await fetch_as_buffer(swf_url);
            files.push(new Blob(
                [new_swf], { type: "application/x-shockwave-flash" }
            ));
            collect_swfs(new_swf, files);
        }


        async function download_game() {
            const game_id = get_game_id();
            const swf = await get_swf(game_id);
            if (!swf) return;

            const files = [new Blob(
                [swf], { type: "application/x-shockwave-flash" }
            )];

            await collect_swfs(swf, files);
            const title = get_title();
            // 单文件游戏直接下载
            if (files.length === 1) {
                util.save(title + ".swf", files[0]);
                return;
            }

            // 多文件游戏下载压缩包
            const zip = new window.JSZip();
            files.forEach((blob, i) => zip.file(
                fnames[i], blob, { binary: true }
            ));
            const help = new Blob([HOW_TO_PLAY]);
            zip.file("使用说明.txt", help, { binary: true });

            // 导出
            const zip_blob = await zip.generateAsync({ type: "blob" });
            console.log(zip_blob);
            util.save(`${title}.zip`, zip_blob);
        }


        function add_style() {
            const style = `
            <style>
                #flash-dl-btn {
                    background: url("${FLASH_ICON}");
                    background-repeat: no-repeat;
                    background-position: center;
                    width: 40px;
                    height: 100%;
                    cursor: pointer;
                }

                .play_header {
                    display: flex !important;
                    flex-direction: row;
                    justify-content: space-between;
                }

                .disabled {
                    filter: grayscale(75%);
                    pointer-events: none;
                }
            <style>
            `;
            document.head.insertAdjacentHTML(
                "beforeend", style
            );
        }


        async function add_btn() {
            dl_btn = document.createElement("button");
            dl_btn.id = "flash-dl-btn";

            dl_btn.onclick = async () => {
                dl_btn.classList.add("disabled");
                try {
                    await download_game(); 
                } catch (err) {
                    console.error(err);
                    alert(`下载失败，请在脚本主页反馈并附上网址，谢谢`);
                    dl_btn.classList.remove("disabled");
                }
                dl_btn.classList.remove("disabled");
            };

            const targets = await $$(".play_header");
            const target = targets[0];
            target.insertAdjacentElement("beforeend", dl_btn);
        }


        (() => {
            add_style();
            add_btn();
        })();
    }


    /**
     * 下载 nitrome flash 游戏
     */
    function dl_flash_nitrome() {
        function on_game_page() {
            function add_style() {
                const style = `
                <style>
                    #flash-dl-btn {
                        background: url("${FLASH_ICON}");
                        background-repeat: no-repeat;
                        background-position: center;
                        width: 100%;
                        height: 70px;
                        cursor: pointer;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                    }
    
                    .comment-info {
                        flex-direction: column !important;
                    }
                <style>
                `;
                document.head.insertAdjacentHTML(
                    "beforeend", style
                );
            }
    
    
            function add_btn() {
                const dl_btn = document.createElement("a");
                // http://www.nitrome.com/games/finalninja/
                const fname = location.pathname.split("/").at(-2) + ".swf";
                dl_btn.download = fname;
                dl_btn.href = fname;
                dl_btn.target = "_blank";
                dl_btn.id = "flash-dl-btn";
                dl_btn.textContent = "下载游戏文件";
    
                $(".comment-info")[0].insertAdjacentElement(
                    "beforeend", dl_btn
                );
            }
    
    
            function main() {
                add_style();
                add_btn();
            }
    
    
            setTimeout(main, 1000);
        }


        function on_list_page() {
            const DL_BTN = `
            <a id="flash-dl-btn" data-src="$1" onclick="copy_link(this)"></a>
            `;


            function add_style() {
                const style = `
                <style>
                    #flash-dl-btn {
                        background: url("${FLASH_ICON}");
                        background-repeat: no-repeat;
                        background-position: center;
                        width: 32px;
                        height: 33px;
                        cursor: cell;
                        position: absolute;
                        z-index: 200;
                        margin-left: -28px;
                        transform: scale(0.7);
                        filter: hue-rotate(185deg);
                    }

                    #flash-dl-btn:hover {
                        filter: none;
                    }

                    .copy-icon {
                        border: none !important;
                        margin: 0 1.25em !important;
                        margin: 0 0 0 10px !important;
                    }

                    .copy-container {
                        margin: 8px 16px !important;
                        padding: 0 !important;
                        font-size: 14px !important;
                        
                    }
                    
                    .copy-popup {
                        top: 60px;
                        padding: 4px 10px !important;
                        height: 44px !important;
                        font-size: 12px !important;
                        width: fit-content !important;
                        align-content: center;
                        box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset !important;
                    }

                    .swal2-popup {
                        border-radius:0 !important;    
                    }
                </style>
                `;
                document.head.insertAdjacentHTML(
                    "beforeend", style
                );
            }


            /**
             * @param {HTMLAnchorElement} elem 
             */
            window.copy_link = function(elem) {
                const link = elem.dataset.src;
                console.log(link);
                navigator.clipboard.writeText(link);
                Sweetalert2.fire({
                    text: "复制成功，可以粘贴咯~",
                    toast: true,
                    timer: 2000,
                    showConfirmButton: false,
                    icon: "success",
                    position: "top",
                    customClass: {
                        popup: "copy-popup",
                        htmlContainer: "copy-container",
                        icon: "copy-icon"
                    }
                });
            };


            function add_btn() {
                $(".box_wrap").forEach(box => {
                    if (box.querySelector("#flash-dl-btn")) return;

                    const game = box
                        .querySelector("[itemprop=link]")
                        .href
                        .split("/")
                        .at(-2);

                    console.log(`game name: ${game}`);

                    const href = `http://www.nitrome.com/games/${game}/${game}.swf`;
                    const btn = DL_BTN.replace("$1", href);
                    box.insertAdjacentHTML("beforeend", btn);
                });
            }


            (() => {
                add_style();
                add_btn();
            })();
        }


        (() => {
            console.log("enter: sub route");

            const path = location.pathname.toLowerCase();
            const game_types = [
                "/all-games/",
                "/multiplayer-games/",
                "/hearted-games/",
                "/demos/"
            ];

            const map = new Map([
                ...game_types.map(type => [type, on_list_page]),
                ["/games/.+", on_game_page]
            ]);
            
            for (const [pattern, handler] of map.entries()) {
                if (new RegExp(`^${pattern}$`).test(path)) {
                    return handler();
                }
            }
            console.log(`不受支持的路径：${path}`);
        })();
    }


    /**
     * 路由函数，脚本主函数入口
     */
    function route() {
        console.log("enter: main route");

        const host = location.hostname;
        const map = new Map([
            ["www.4399.com", dl_flash_4399],
            ["s2.4399.com", dl_flash_4399_in_origin],
            ["www.7k7k.com", dl_flash_7k7k],
            ["www.nitrome.com", dl_flash_nitrome],
        ]);

        if (!map.has(host)) {
            console.log(`不受支持的域名：${host}`);
            return;
        }
        map.get(host)();
    }


    setTimeout(route, 500);

    /**
     * 更新日志
     * ---
     * 更新日期：2023/4/28
     * 更新版本：0.0.1
     * - 完成第一版  4399 flash 文件下载脚本
     * ---
     * 更新日期：2023/5/18
     * 更新版本：0.0.2
     * - 脚本名称变更
     * - 新增支持 7k7k
     * ---
     * 更新日期：2023/5/19
     * 更新版本：0.0.3
     * - 7k7k 游戏文件地址搜索增强
     * ---
     * 更新日期：2023/5/19
     * 更新版本：0.0.4
     * - 新增支持 nitrome
     * ---
     * 更新日期：2023/5/19
     * 更新版本：0.0.5
     * - 修复 7k7k 部分游戏下载失败的 bug
     * ---
     * 更新日期：2023/5/22
     * 更新版本：0.0.6
     * - 在 nitrome 游戏列表页增加了复制下载链接按钮
     */
})();