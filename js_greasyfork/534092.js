// ==UserScript==
// @name         icode pro
// @namespace    https://www.icode.org.cn/
// @version      0.0.1
// @description  icode pro!!!
// @author       Dev
// @match        http://*.icode.org.cn/*
// @match        https://*.icode.org.cn/*
// @icon         https://static.icode.org.cn/assets/zone/static/favicon.ico
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534092/icode%20pro.user.js
// @updateURL https://update.greasyfork.org/scripts/534092/icode%20pro.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.clear = () => {};

    function addStyle(css) {
        if (css instanceof URL) {
            const style = document.createElement("link");
            style.rel = "stylesheet";
            style.href = css.toString();
            document.documentElement.appendChild(style);
        } else {
            const style = document.createElement("style");
            style.textContent = css;
            document.documentElement.appendChild(style);
        }
    }

    addStyle(`
.command-output {
    color: #4CAF50;
}
.result-output {
    color: #AAFFDD;
}
.error-output {
    color: #FF6655;
}
    `);

    /**
     * @template T
     * @template {keyof T} Key
     * @param {T} obj
     * @param {Key} p
     * @param {(fn: T[Key]) => T[Key]} fn
     */
    function patch(obj, p, fn) {
        if (obj[p]) obj[p] = fn(obj[p]);
    }

    class VueElementMixin {
        constructor() {
            this._events = new Map();
        }
        on(tagName, fn) {
            const v = this._events.get(tagName);
            if (v) v.push(fn);
            else this._events.set(tagName, [fn]);
        }
        emit(instance) {
            const tag =
                  instance.$vnode?.componentOptions?.tag ??
                  instance._vnode?.componentOptions?.tag ??
                  instance.$vnode?.tag?.split("-")?.at(-1);
            console.log("vue - " + tag, instance, typeof tag);
            /**if (tag === "96") {
                instance.courseList.forEach((courseInfo) => {
                    console.log(12345, courseInfo);
                    if (courseInfo.locked) courseInfo.locked=false;
                });
            }*/
            if (this._events.has(tag)) {
                for (const v of this._events.get(tag)) {
                    try {
                        v(instance);
                    } catch (e) {
                        logger.error(e);
                    }
                }
            }
        }
    }
    let IDEBOX = undefined;
    const webpackListener = [];
    function requireVue(callback) {
        let captured = false;
        patch(Function.prototype, "call", (call) => {
            return function (self, ...args) {
                if (
                    args.length === 3 &&
                    typeof args[0] === "object" &&
                    args[0] !== null &&
                    typeof args[1] === "object" &&
                    args[1] !== null &&
                    typeof args[2] === "function" &&
                    args[0].exports
                ) {
                    const fn = this;
                    // const require = args[2]
                    const str = fn.toString();
                    if (str.includes("ENABLE_XES_CONSOLE")) {
                        return;
                    }
                    const res = call.apply(this, [self, ...args]);
                    const exports = args[0].exports;
                    if (!exports) return res;
                    webpackListener.forEach((v) => v(exports));
                    if (
                        typeof exports.default === "function" &&
                        typeof exports.default.version === "string" &&
                        !captured && self.default.prototype !== undefined
                    ) {
                        // This is vue.
                        console.log("Vue", self.default);
                        captured = true;
                        callback(self.default);
                    }
                    return res;
                } else if (self?.editor && self?.clickActionImageButton) {
                    if (!IDEBOX) IDEBOX = self, window.idebox = IDEBOX;
                    return call.apply(this, [self, ...args]);
                } else return call.apply(this, [self, ...args]);
            };
        });
    }
    const vueMixinManager = new VueElementMixin();
    requireVue((Vue) => {
        patch(Vue.prototype, "_init", (_init) => {
            return function (args) {
                _init.call(this, args);
                vueMixinManager.emit(this);
            };
        });
    });
    (() => {
        let loaded = false;
        vueMixinManager.on("App", (instance) => {
            if (instance.$http && instance.$http.getAxios && typeof instance.$http.getAxios === "function" && !loaded) {
                console.log(instance, instance.$http.getAxios);
                loaded = true;
                instance.$http.getAxios.interceptors.response.use(function (resp) {
                    console.log("rerere", resp);
                    //if (window.location.pathname.startsWith("/live/creator/"))
                    //if (resp.config.url.startsWith(`${resp.config.baseURL}user/queryUserInfo`)) {
                    //    resp.data.data.isVip = 1;
                    //    resp.data.data.vipExpireTime = 6666666666;
                    //}
                    return resp;
                });
            }
        });

    })();

    /*
    const urlValues = new WeakMap();

    ((orgobj) => {
        let a = 0;

        Object.defineProperty(Object.prototype, 'url', {
            get() {
                a++;
                return urlValues.get(this) || '#'+a; // 默认值
            },
            set(value) {
                urlValues.set(this, value);
                alert(`设置url: ${value}`);
            },
            configurable: true,
            enumerable: false
        });
    })(Object);


    /*
    ((originalApply, originalCall) => {
        let newcall = function(thisArg, ...args) {
            alert(`调用函数: ${this}\nthis值: ${thisArg}\n参数: ${JSON.stringify(args)}`);
            Function.prototype.call = originalCall;
            let result = Function.prototype.call.call(this, thisArg, ...args);
            Function.prototype.call = newcall;
            return result;
        };
        Function.prototype.call = newcall;
    })(Function.prototype.apply, Function.prototype.call);
    */

    $(document).ready(() => {
        // 运行前处理
        (()=>{
            if (!window.adventureManager) return;
            // 无代码规范判定
            window.adventureManager.analysisPythonCode = (code)=>"";

            // 行数无忧
            window.adventureManager.getCurrentCodeLines = ()=>1;
        })();

        // IDEBOX
        (()=>{
            if (!IDEBOX) return;
            // 新主题
            IDEBOX.editor.setTheme("ace/theme/tomorrow_night_bright")
        })();

        /**
         * 创建不受父元素影响的可拖动虚拟终端
         * @param {Object} options 配置选项
         * @param {string} [options.title='Terminal'] 终端标题
         * @param {number} [options.width=600] 宽度(px)
         * @param {number} [options.height=400] 高度(px)
         * @param {number} [options.left=100] 初始左侧位置(px)
         * @param {number} [options.top=100] 初始顶部位置(px)
         */
        function createIsolatedTerminal(options = {}) {
            // 合并配置
            const config = {
                title: options.title || 'Terminal',
                width: options.width || 600,
                height: options.height || 400,
                left: options.left || 100,
                top: options.top || 100,
                ...options
            };

            // 创建终端容器（使用fixed定位）
            const terminalContainer = document.createElement('div');
            terminalContainer.id = 'isolated-terminal-' + Math.random().toString(36).substr(2, 9);
            Object.assign(terminalContainer.style, {
                position: 'fixed',
                left: `${config.left}px`,
                top: `${config.top}px`,
                width: `${config.width}px`,
                height: `${config.height}px`,
                backgroundColor: '#252526',
                borderRadius: '5px',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                userSelect: 'none',
                fontFamily: '"Courier New", monospace',
                color: '#f0f0f0',
                zIndex: 9999  // 确保在最上层
            });

            // 创建终端头部（可拖动区域）
            const terminalHeader = document.createElement('div');
            terminalHeader.className = 'terminal-header';
            Object.assign(terminalHeader.style, {
                backgroundColor: '#333',
                color: '#fff',
                padding: '8px 12px',
                cursor: 'move',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            });

            const terminalTitle = document.createElement('div');
            terminalTitle.className = 'terminal-title';
            terminalTitle.textContent = config.title;
            terminalTitle.style.fontWeight = 'bold';

            const terminalClose = document.createElement('div');
            terminalClose.className = 'terminal-close';
            terminalClose.textContent = '×';
            terminalClose.style.cursor = 'pointer';
            terminalClose.style.fontSize = '18px';
            terminalClose.onclick = () => {
                document.body.removeChild(terminalContainer);
                // 清理事件监听器防止内存泄漏
                document.removeEventListener('mousemove', dragMove);
                document.removeEventListener('mouseup', dragEnd);
            };

            terminalHeader.appendChild(terminalTitle);
            terminalHeader.appendChild(terminalClose);

            // 创建终端内容区域
            const terminalBody = document.createElement('div');
            terminalBody.className = 'terminal-body';
            Object.assign(terminalBody.style, {
                flexGrow: '1',
                padding: '10px',
                overflowY: 'auto',
                backgroundColor: '#1e1e1e'
            });

            // 创建输入行
            const inputLine = document.createElement('div');
            inputLine.className = 'input-line';
            Object.assign(inputLine.style, {
                display: 'flex',
                marginTop: '5px',
                padding: '0 10px 10px'
            });

            const prompt = document.createElement('span');
            prompt.textContent = '$ ';
            prompt.style.color = '#4CAF50';

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'terminal-input';
            Object.assign(input.style, {
                flexGrow: '1',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f0f0f0',
                fontFamily: '"Courier New", monospace',
                fontSize: '14px'
            });

            inputLine.appendChild(prompt);
            inputLine.appendChild(input);

            // 组装终端
            terminalContainer.appendChild(terminalHeader);
            terminalContainer.appendChild(terminalBody);
            terminalContainer.appendChild(inputLine);

            // 添加到文档
            document.body.appendChild(terminalContainer);

            // 拖拽功能实现（改进版）
            let isDragging = false;
            let startX, startY, startLeft, startTop;

            const dragStart = (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = parseInt(terminalContainer.style.left, 10) || 0;
                startTop = parseInt(terminalContainer.style.top, 10) || 0;

                // 防止文本选中
                document.body.style.userSelect = 'none';
            };

            const dragMove = (e) => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                // 计算新位置（限制在视口内）
                const newLeft = Math.max(0, Math.min(window.innerWidth - terminalContainer.offsetWidth, startLeft + dx));
                const newTop = Math.max(0, Math.min(window.innerHeight - terminalContainer.offsetHeight, startTop + dy));

                terminalContainer.style.left = `${newLeft}px`;
                terminalContainer.style.top = `${newTop}px`;
            };

            const dragEnd = () => {
                isDragging = false;
                document.body.style.userSelect = '';
            };

            terminalHeader.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', dragEnd);

            // 终端功能实现
            function addOutput(text, className = '') {
                const output = document.createElement('div');
                output.className = className;
                output.textContent = text;
                output.style.whiteSpace = 'pre-wrap';
                terminalBody.appendChild(output);
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }

            console.log = (e) => {addOutput(e, 'result-output');};
            const commands = ['help', 'clear'];
            const commandsInfo = {
                'help': {
                    'describe': '获取帮助',
                    'parnum': [1, 0],
                    'parameter': {
                        'command': {
                            'optional': true,
                        },
                    },
                    'callback': (command) => {
                        if (command===undefined) {
                            let _out = '可用的命令:\n';
                            for (let _com of commands) {
                                _out = _out + `  ${_com}`;
                                for (let _par of Object.getOwnPropertyNames(commandsInfo[_com]['parameter'])) {
                                    _out = _out + ` [${commandsInfo[_com]['parameter'][_par]['optional']?'?':''}${_par}]`;
                                }
                                _out = _out + ` - ${commandsInfo[_com]['describe']}\n`;
                            }
                            addOutput(_out);
                        } else {
                            if (!commands.includes(command)) addOutput(`获取帮助失败，没有命令: ${command}`, 'error-output');
                            else {
                                let _out = `命令: ${command} - ${commandsInfo[command]['describe']}\n参数: \n`;
                                for (let _par of Object.getOwnPropertyNames(commandsInfo[command]['parameter'])) {
                                    _out = _out + `  ${_par} - ${commandsInfo[command]['parameter'][_par]['optional']?'可选':'不可选'}参数\n`;
                                }
                                addOutput(_out);
                            }
                        }
                    },
                },
                'clear': {
                    'describe': '清楚控制台输出',
                    'parnum': [0],
                    'parameter': {},
                    'callback': () => {
                        terminalBody.innerHTML = '';
                        addOutput('ICode PRO  |  by Dev\n\n欢迎使用ICode PRO - CONSOLE!\nCtrl + Alt + T可在控制台关闭后重新显示\nICode PRO提供的命令以“..”开头，如输入“..help”或“..?”获取帮助\n ');
                    },
                },
            };

            function processCommand(cmd) {
                if (cmd.startsWith('..')) {
                    cmd = cmd.slice(2).split(" ").filter((e)=>e.trim());
                    const arg = cmd.slice(1);
                    cmd = cmd[0].trim().toLowerCase();
                    if (!cmd) return false;
                    if (cmd==='?') cmd = 'help';
                    addOutput(`$(..) ${cmd}`, 'command-output');
                    if (!commands.includes(cmd)) addOutput(`没有命令: ${cmd}`, 'error-output');
                    else {
                        if (!commandsInfo[cmd]['parnum'].includes(arg.length)) addOutput(`命令“${cmd}”不能有${arg.length}个参数`, 'error-output');
                        else {
                            commandsInfo[cmd]['callback'](...arg);
                        }
                    }
                } else {
                    addOutput(`$ ${cmd}`, 'command-output');
                    try {
                        addOutput(`${eval(cmd)}`, 'result-output');
                    } catch(e) {
                        addOutput(`${e}`, 'error-output');
                    }
                }
                return true;
            }

            // 输入处理
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    if (processCommand(input.value)) input.value = '';
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.altKey && e.key === 't') {
                    document.body.appendChild(terminalContainer);
                    document.addEventListener('mousemove', dragMove);
                    document.addEventListener('mouseup', dragEnd);
                    input.focus();
                }
            });

            // 初始消息
            addOutput('ICode PRO  |  by Dev\n\n欢迎使用ICode PRO - CONSOLE!\nCtrl + Alt + T可在控制台关闭后重新显示\nICode PRO提供的命令以“..”开头，如输入“..help”或“..?”获取帮助\n ');

            // 聚焦输入框
            input.focus();

            // 处理窗口大小变化时保持终端在可视区域内
            window.addEventListener('resize', () => {
                const left = parseInt(terminalContainer.style.left, 10) || 0;
                const top = parseInt(terminalContainer.style.top, 10) || 0;

                terminalContainer.style.left = `${Math.min(left, window.innerWidth - terminalContainer.offsetWidth)}px`;
                terminalContainer.style.top = `${Math.min(top, window.innerHeight - terminalContainer.offsetHeight)}px`;
            });

            // 返回终端对象以便外部控制
            return {
                container: terminalContainer,
                addOutput,
                executeCommand: processCommand,
                destroy: () => {
                    document.body.removeChild(terminalContainer);
                    document.removeEventListener('mousemove', dragMove);
                    document.removeEventListener('mouseup', dragEnd);
                    window.removeEventListener('resize', adjustPosition);
                }
            };
        }

        // 创建终端
        const myTerm = createIsolatedTerminal({
            title: 'ICode PRO - CONSOLE',
            width: 720,
            height: 480,
            left: 200,
            top: 150
        });

        // 销毁终端（当不再需要时）
        // myTerm.destroy();
    });
})();
