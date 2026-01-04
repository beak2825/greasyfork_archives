// ==UserScript==
// @name         b站直播聊天室弹幕发送增强
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @description  原理是分开发送。接管了发送框，会提示屏蔽词
// @author       Pronax
// @include      /https:\/\/live\.bilibili\.com\/(blanc\/)?\d+/
// @icon         http://bilibili.com/favicon.ico
// @grant        GM_addStyle
// @run-at		 document-end
// @require      https://greasyfork.org/scripts/439903-blive-room-info-api/code/blive_room_info_api.js?version=1037039
// @downloadURL https://update.greasyfork.org/scripts/432741/b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/432741/b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

// todo 接管全屏输入栏

; (async function () {
    'use strict';

    if (!document.cookie.match(/bili_jct=(\w*); /)) { return; }

    // proxyFetch();    // 魔改fetch

    let jct = document.cookie.match(/bili_jct=(\w*); /)[1];
    let roomId = await ROOM_INFO_API.getRid();
    let toastCount = 0;
    let isProcessing = false;
    let formData = new FormData();
    formData.set("bubble", 0);
    formData.set("color", 16777215);
    formData.set("mode", 1);
    formData.set("fontsize", 25);
    formData.set("roomid", roomId);

    const LIMIT = await ROOM_INFO_API.getDanmuLength(roomId);

    const riverCrabs = { "母鸡": "f", "小赤佬": "f", "速器": "fire", "商丘": "fire", "慎判": "fire", "代练": "f", "违规直播": "f", "低俗": "f", "系统": "f", "渣女": "f", "肥": "fire", "墙了": "f", "变质": "f", "小熊": "f", "疫情": "f", "感染": "f", "分钟": "f", "爽死": "f", "黑历史": "f", "超度": "f", "渣男": "f", "和谐": "f", "河蟹": "f", "敏感": "f", "你妈": "f", "代孕": "f", "硬了": "f", "抖音": "f", "保卫": "f", "被gan": "f", "寄吧": "f", "郭楠": "f", "里番": "f", "小幸运": "f", "试看": "f", "加QQ": "f", "警察": "f", "营养": "f", "资料": "f", "家宝": "f", "饿死": "f", "不认字": "f", "横幅": "f", "hentai": "f", "诱惑": "f", "垃圾": "f", "福报": "f", "拉屎": "f", "顶不住": "f", "一口气": "f", "苏联": "f", "哪个平": "f", "老鼠台": "f", "顶得住": "f", "gay": "f", "黑幕": "f", "蜀黍我啊": "f", "梯子": "f", "美国": "f", "米国": "f", "未成年": "f", "爪巴": "f", "包子": "fire", "党": "fire", "89": "fire", "戏精": "fire", "八九": "fire", "八十九": "fire", "你画我猜": "fire", "叔叔我啊": "fire", "爬": "fire" };
    let wordTree = {};
    initTree();

    // 弹出框CSS
    GM_addStyle(".link-toast.error{left:40px;right:40px;white-space:normal;margin:auto;text-align:center;box-shadow:0 .2em .1em .1em rgb(255 100 100/20%)}");
    // 原始粉丝牌
    GM_addStyle(".chat-input-focus .medal-section{display:none !important;}");
    // 发送按钮 CSS
    GM_addStyle(".chat-input-focus button.right-action-btn{background-color:var(--brand_pink);}.chat-input-ctnr-new button.right-action-btn{min-width: 50px;}.chat-input-ctnr-new button.right-action-btn:hover{background-color:var(--brand_pink);}.chat-input-ctnr-new div.right-actions{margin-right:5px;}");
    // 输入框及母盒子
    GM_addStyle("#control-panel-ctnr-box{padding:10px 8px 8px}#control-panel-ctnr-box>.chat-input-ctnr-new{margin-top:10px;align-items:center;height:fit-content !important;border-radius:10px;min-height:52px;}");
    // 插件输入框及背景框的公共CSS
    GM_addStyle("#liveDanmuInputBackground,#liveDanmuInputArea.focus{line-height:19px;height:87px;padding:.2rem .5rem .2rem .6rem}#chat-control-panel-vm{max-height:180px !important;}");
    GM_addStyle(".input-area{word-break: break-all;}");
    // @别人的提示标志
    GM_addStyle("#liveDanmuAtLabel,.at #liveDanmuInputBackground::before{content:'@'attr(data-at);border-radius:2px;background-color:var(--Pi4_u);box-shadow:0 0 0 1px var(--Pi4_u);padding:0 3px;margin:0 5px 0 3px;color:var(--text_white)}");

    // 用于回复@别人
    let at = {
        username: undefined,
        uid: undefined,
        calDom: undefined,
        set user(username) {
            this.username = username;
            if (!this.username) {
                this.uid = undefined;
                inputArea.inputParentBox.classList.remove("at");
                inputArea.dom.style.textIndent = '';
                return;
            }
            // 计算字符长度赋值给text-indent
            at.calDom.innerText = "@" + this.username;
            // 查找UID
            let danmuDom = document.querySelector(`.chat-item[data-uname="${this.username}"]`);
            if (danmuDom && danmuDom.dataset.uid) {
                this.uid = danmuDom.dataset.uid;
                inputArea.inputParentBox.classList.add("at");
                inputArea.dom.dataset.at = this.username;
                inputArea.bgDom.dataset.at = this.username;
                let width = parseInt(getComputedStyle(at.calDom).width) + 15; // 我也不知道为什么加这个数
                inputArea.dom.style.textIndent = width + 'px';
            } else {
                console.warn(`初始化@数据失败：无法找到${this.username}的弹幕`);
            }
        }
    }
    let inputArea = {
        dom: undefined,
        bgDom: undefined,
        limitHintDom: undefined,
        inputParentBox: undefined,
        _textValue: '',
        _htmlValue: '',
        _internalTimeout: undefined,
        set textValue(val) {
            this._textValue = val;
            this.bgDom.innerText = this._textValue;
            this.bgDom.scrollTop = this.dom.scrollTop;
            // 屏蔽词过滤
            clearTimeout(this._internalTimeout);
            this._internalTimeout = setTimeout(() => {
                inputArea.htmlValue = filter(inputArea.textValue);
            }, 170);
            // 指示器内容更新
            if (this.textValue.length > LIMIT) {
                this.limitHintDom.classList.add("over");
            } else {
                this.limitHintDom.classList.remove("over");
            }
            this.limitHintDom.innerText = `${this.textValue.length}/${LIMIT}`;
        },
        get textValue() { return this._textValue; },
        set htmlValue(val) {
            this._htmlValue = val;
            this.bgDom.innerHTML = this._htmlValue;
        },
        get htmlValue() { return this._htmlValue; },
    }

    let deadLine = Date.now() + 7000;
    let itv = setInterval(() => {
        if (Date.now() > deadLine) {
            clearInterval(itv);
            console.log("弹幕发送增强-无法找到加载点");
        }
        let emojiBtn = document.querySelector(".emoticons-panel");  // 小表情按钮会在页面加载完成后出现，所以用它作为加载点
        if (emojiBtn) {
            clearInterval(itv);

            let textarea = document.querySelector(".chat-input-ctnr .chat-input");  // 这个元素目前是原版输入框(textarea)
            inputArea.inputParentBox = textarea.parentElement;
            inputArea.inputParentBox.classList.add("p-relative");
            // 原版打标签
            textarea.id = "originInputArea";

            // SC的大按钮改小按钮
            // GM_addStyle(".icon-left-part-new .super-chat{width: 65px !important;}");
            // let scText = document.querySelector(".super-chat-text");
            // scText && (scText.innerText = "SC");

            // 长度提示
            GM_addStyle(".input-limit-hint{display:none}.chat-input-focus .text-limit-hint{opacity:1}.text-limit-hint{opacity:0;z-index:2;font-size:12px;line-height:19px;color:var(--Ga3);bottom:0;right:.5rem}.text-limit-hint.over{color:var(--brand_blue)}.chat-input-focus .text-limit-hint.has-scrollbar{right:1.5rem;}");
            inputArea.limitHintDom = document.createElement("span");
            inputArea.limitHintDom.className = "text-limit-hint none-select p-absolute";
            inputArea.limitHintDom.innerText = "0/" + LIMIT;
            // textarea.parentNode.after(inputArea.limitHintDom);
            textarea.after(inputArea.limitHintDom);

            // 背景
            GM_addStyle("#liveDanmuInputBackground{box-sizing:border-box;inset:0;opacity:0;color:transparent;overflow-y:auto;pointer-events:none;}.chat-input-focus #liveDanmuInputBackground{opacity:1}");
            inputArea.bgDom = document.createElement("div");
            inputArea.bgDom.id = "liveDanmuInputBackground";
            inputArea.bgDom.className = "textarea-panel p-absolute chat-input input-area";
            for (let item of Object.keys(textarea.dataset)) {
                inputArea.bgDom.dataset[item] = textarea.dataset[item];
            }
            textarea.after(inputArea.bgDom);

            // 输入框
            GM_addStyle("#liveDanmuInputArea{padding:.2rem .4rem;z-index:1;position:relative;background-color:transparent;resize:none;overflow: auto;}");
            GM_addStyle(".f-word{background-color:var(--Ly4)}.fire-word{background-color:var(--Or5)}");
            GM_addStyle("#liveDanmuInputArea.default{text-indent:.5rem;padding:.2rem 0}.at #liveDanmuInputArea.default{padding:.2rem 0.5rem;}");
            // 用input配合一个div背景。如果用contentEditable来搞，容易搞坏光标定位和编辑栈，已放弃
            inputArea.dom = textarea.cloneNode();
            inputArea.dom.id = "liveDanmuInputArea";
            inputArea.dom.classList.add("input-area");
            inputArea.dom.classList.add("dp-block");
            inputArea.dom.classList.add("default");
            inputArea.dom.classList.remove("default-height");

            inputArea.dom.addEventListener("scroll", (e) => {
                inputArea.bgDom.scrollTop = e.target.scrollTop;
                // 处理长度提示的位置
                let hasScroll = e.target.scrollHeight > e.target.clientHeight;
                inputArea.limitHintDom.classList.toggle('has-scrollbar', hasScroll);
            });
            inputArea.dom.addEventListener("focus", (e) => {
                e.target.classList.add("focus");
                e.target.classList.remove("default");
                textarea.dispatchEvent(new Event('focus'));
                // document.querySelector(".chat-input-ctnr-new").classList.add("chat-input-focus");
                document.querySelector("#chat-control-panel-vm").style.height = "176px";
            });
            inputArea.dom.addEventListener("blur", (e) => {
                // 如果没有内容才添加default
                if (e.target.value.length == 0) {
                    e.target.classList.add("default");
                }
                e.target.classList.remove("focus");
                textarea.dispatchEvent(new Event('blur'));
                // document.querySelector(".chat-input-ctnr-new").classList.remove("chat-input-focus");
                document.querySelector("#chat-control-panel-vm").style.height = "";
            });
            inputArea.dom.addEventListener("input", (e) => {
                inputArea.textValue = e.target.value;
            });
            inputArea.dom.addEventListener("keydown", (e) => {
                if (e.key == 'Enter' || e.keyCode == 13) {
                    // 回车在输入框里没有任何作用，发出去会变成一个空格，且好像会造成奇怪的bug，这里直接拦截掉
                    e.preventDefault();
                    e.stopPropagation();
                    // 回车发送
                    if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
                    } else {
                        dealDanmu(e.target);
                    }
                } else if (e.key == 'Backspace' || e.keyCode == 8) {
                    const startOffset = inputArea.dom.selectionStart; // 光标开始位置
                    const endOffset = inputArea.dom.selectionEnd;     // 光标结束位置（如果有选中的内容）
                    // 在首位删除时，如果存在@标识，那就抹掉
                    if (startOffset === 0 && endOffset === 0 && inputArea.inputParentBox.classList.contains("at")) {
                        at.user = undefined;
                    }
                }
            });
            let sendBtn = document.querySelector(".bottom-actions .right-action button");
            if (sendBtn) {
                sendBtn.addEventListener("click", (e) => {
                    dealDanmu(inputArea.dom);
                });
            }
            textarea.after(inputArea.dom);

            // 适配新版小表情
            GM_addStyle(".emotion-recent-wrap{display:none !important;}");  // 最近使用  懒，一刀切了吧
            // let emojiBtn = document.querySelector(".emoticons-panel");
            emojiBtn.addEventListener("click", () => {
                let deadline = Date.now() + 1000;
                (function init() {
                    let emojiPanel = document.querySelector(".emoji-wrap");
                    if (emojiPanel) {
                        emojiPanel.onclick = e => {
                            let target = e.target;
                            if (e.target.tagName == "IMG") {
                                target = e.target.parentNode;
                            }
                            inputArea.dom.value = inputArea.dom.value + target.title;
                            inputArea.dom.dispatchEvent(new Event('input'));
                            cleanOriginInput();
                        }
                    } else if (Date.now() < deadline) {
                        requestIdleCallback(init, { timeout: 1000 });
                    }
                })();
            });

            // @别人
            setTimeout(() => {  // 页面刚加载完毕时，只有一个菜单，没有@按钮，所以注册一个监听器等首次打开菜单时才注册事件到@按钮上
                let observer = new MutationObserver(function (mutations) {
                    let danmuMenuAt = document.querySelector(".danmaku-menu .at-this-guy");
                    if (danmuMenuAt) {
                        danmuMenuAt.addEventListener("click", async (e) => {
                            let menu = e.target.closest(".danmaku-menu");
                            let username = menu.querySelector(".username").innerText;
                            at.user = username;

                            inputArea.dom.classList.add("focus");
                            inputArea.dom.classList.remove("default");
                            document.querySelector("#chat-control-panel-vm").style.height = "176px";

                            cleanOriginInput(textarea);
                        });
                        // 首次触发后@按钮就一直在，不需要监听DOM了
                        observer.disconnect();
                        observer = null;
                    }
                });
                observer.observe(document.querySelector(".danmaku-menu"), {
                    childList: true,
                    subtree: true
                });
            }, 3000);
            // @别人 用来测量字符长度的小框
            GM_addStyle("#liveDanmuAtLabel{font-size:12px;opacity:0;z-index:-1;pointer-events:none;width:auto;left:6px;top: 5px;}.chat-input-ctnr:not(.chat-input-focus) .at #liveDanmuAtLabel{opacity:1;z-index:0;}");
            at.calDom = document.createElement("span");
            at.calDom.id = "liveDanmuAtLabel";
            at.calDom.removeAttribute("placeholder");
            at.calDom.className = "p-absolute none-select at-label";
            for (let item of Object.keys(textarea.dataset)) {
                at.calDom.dataset[item] = textarea.dataset[item];
            }
            textarea.before(at.calDom);

            textarea.style.display = "none";

            console.log("弹幕发送增强-加载完毕");
        }
    }, 100);

    async function dealDanmu(textarea) {
        let msg = textarea.value;
        if (!msg) { toast("请输入内容", 1500, "info"); return; }
        if (isProcessing) { toast("弹幕正在发送中", 1500, "info"); return; }
        isProcessing = true;
        let page = 1;
        let segment = LIMIT;
        if (msg.length > segment) {
            // 自动平均每条弹幕的长度
            while (msg.length / segment % 1 < 0.7 && msg.length / segment % 1 != 0) {
                segment--;
            }
            page = Math.ceil(msg.length / segment);
            console.log(`长度：${msg.length} 间隔：${segment} 分页：${page}`);
        }
        let count = 0;
        do {
            let str = msg.substr(0, segment);
            // console.log("发送", str); await sleep(count++ ? 500 + Math.random() * 1000 >> 1 : 0);
            let result = await sendMsg(str, count++ ? 500 + Math.random() * 1000 >> 1 : 0);
            if (at.uid) { at.user = undefined; } // 首条@过后就不@了
            msg = msg.substr(segment);
            textarea.value = msg;
            textarea.dispatchEvent(new Event('input'));
        } while (msg.length > 0);
        isProcessing = false;
    };

    function filter(str) {
        let result = testStr(str);
        for (let word of result) {
            str = str.replaceAll(word.w, `<span class="${word.t}-word">${word.w}</span>`);
        }
        str = str.replaceAll(/\n/g, "<br>"); // 替换换行
        // str = str.replaceAll(/\s/g, "&nbsp;"); // 替换空格，不替换的话多空格在HTML会缩成1个
        return str;
    }

    // 清理原版的输入框内容 如果有内容会卡在输入状态，粉丝牌就不见了
    function cleanOriginInput(textarea) {
        if (!textarea) {
            textarea = document.querySelector("#originInputArea");
        }
        if (textarea) {
            textarea.value = '';
            textarea.dispatchEvent(new Event('input'));
        }
    }

    async function sendMsg(msg, timer = 500) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                jct = document.cookie.match(/bili_jct=(\w*); /)[1];
                formData.set("csrf", jct);
                formData.set("csrf_token", jct);
                formData.set("msg", msg);
                formData.set("rnd", Math.floor(new Date() / 1000));
                if (at.uid) {   // 补充@别人的参数
                    formData.set("reply_mid", at.uid);
                } else {
                    formData.delete("reply_mid");
                }
                fetch("//api.live.bilibili.com/msg/send", {
                    credentials: 'include',
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.code != 0 || result.msg != "") {
                            switch (result.msg) {
                                case "f":
                                    result.msg = "含有敏感词";
                                    break;
                                case "fire":
                                    result.msg = "弹幕含有违禁词汇";
                                    break;
                                case "k":
                                    result.msg = "内容含有房间屏蔽词";
                                    break;
                                default:
                                    result.msg = result.message;
                            }
                            if (result.code == -111) {
                                jct = document.cookie.match(/bili_jct=(\w*); /)[1];
                                formData.set("csrf", jct);
                                formData.set("csrf_token", jct);
                            }
                            toast(result.msg);
                            isProcessing = false;
                            reject(result);
                        } else {
                            resolve(true);
                        }
                    })
                    .catch(err => {
                        console.log("发送弹幕出错：", err);
                        toast(err.msg || err.message);
                        isProcessing = false;
                        reject(err);
                    });
            }, timer);
        });
    }

    function testStr(str) {
        let result = [];
        for (let index = 0; index < str.length; index++) {
            let r = check(wordTree, str, index);
            if (r.i >= 0) {
                result.push({
                    s: index,
                    e: r.i,
                    w: r.w,
                    t: r.t
                });
                index = r.i - 1;  // 减一用于抵消++
            }
        }
        return result;

        function check(obj, str, index, word = "") {
            let letter = str[index];
            if (str.length > index && obj[letter]) {
                word += letter;
                if (obj[letter].end) {
                    return { i: index + 1, w: word, t: obj[letter].type };
                }
                return check(obj[letter], str, index + 1, word);
            } else {
                return { i: -1, w: word };
            }
        }
    }

    function initTree() {
        for (const item of Object.keys(riverCrabs)) {
            init(wordTree, item, 0);
        }

        function init(obj, str, index) {
            if (!obj[str[index]]) {
                obj[str[index]] = {};
            }
            if (str.length - 1 == index) {
                obj[str[index]].end = true;
                obj[str[index]].type = riverCrabs[str];
            } else {
                Reflect.deleteProperty(obj[str[index]], "end");
                obj[str[index]] = init(obj[str[index]], str, index + 1);
            }
            return obj;
        }
    }

    function toast(msg, time = 2000, type = "error") {
        let id = Math.random() * 1000 >> 1;
        let dom = document.createElement("span");
        dom.innerHTML = `<div class="link-toast ${type} link-toast-${id}" style="bottom:${105 + toastCount++ * 50}px"><span class="toast-text">${msg}</span></div>`;
        dom = dom.firstChild;
        let panel = document.querySelector("#chat-control-panel-vm");
        panel.append(dom);
        setTimeout(() => {
            toastCount--;
            dom.remove();
        }, time);
    }

    // 魔改fetch，拦截B站自己的弹幕发送请求
    // 2024-9-9 作废：暂时没法修改输入框的限长
    // function proxyFetch() {
    //     const { fetch: originalFetch } = unsafeWindow;
    //     unsafeWindow.fetch = async (...args) => {
    //         let [resource, config] = args;
    //         let isDanmu = resource.startsWith("//api.live.bilibili.com/msg/send");
    //         if (isDanmu) {
    //             // console.log("请求", resource, config);
    //             // 图片表情
    //             let emotion = config && config.data && config.data.emoticonOptions;
    //             if (!emotion) {
    //                 // 拦截弹幕请求，直接返回一个假的
    //                 return new Response("{\"code\":1}", { status: 200 });
    //             }
    //         }
    //         const response = await originalFetch(resource, config);
    //         if (isDanmu) {
    //             // console.log("返回", response);
    //         }
    //         return response;
    //     };
    // }

})();

// 大表情
// bubble: 0
// msg: upower_[Minicatty_吃瓜]
// color: 16777215
// mode: 1
// dm_type: 1
// emoticonOptions: [object Object]
// fontsize: 25
// rnd: 1725808681
// roomid: 2323777
// csrf: 1
// csrf_token: 1

// @人
// bubble: 0
// msg: [狗叫]123
// color: 16777215
// mode: 1
// room_type: 0
// jumpfrom: 0
// reply_mid: 23237777
// reply_attr: 0
// replay_dmid: 42945fa0764e7be6388b4dfd3666ddb356
// statistics: {"appId":100,"platform":5}
// fontsize: 25
// rnd: 1725808681
// roomid: 2323777
// csrf: 1
// csrf_token: 1

// 普通弹幕
// bubble: 0
// msg: [狗叫]123
// color: 16777215
// mode: 1
// room_type: 0
// jumpfrom: 0
// reply_mid: 0
// reply_attr: 0
// replay_dmid:
// statistics: {"appId":100,"platform":5}
// fontsize: 25
// rnd: 1725808681
// roomid: 2323777
// csrf: 1
// csrf_token: 1