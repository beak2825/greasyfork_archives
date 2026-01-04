// ==UserScript==
// @name            douyin-portrait-view
// @namespace       http://tampermonkey.net/
// @version         0.0.7
// @description     适用于手机端的抖音网页版，必须以电脑端视图访问才有效（PC端UA）
// @author          2690874578@qq.com
// @match           https://www.douyin.com/*
// @grant           none
// @run-at          document-idle
// @license         GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/469061/douyin-portrait-view.user.js
// @updateURL https://update.greasyfork.org/scripts/469061/douyin-portrait-view.meta.js
// ==/UserScript==


(function() {
    "use strict";


    /**
     * 脚本启动延时
     */
    const BOOT_DELAY = 2000;
    const MENU = [
        "推荐", "我的"
    ];
    window.s = $;

    /**
     * 路由表
     */
    const ROUTES = [];


    /**
     * 多元素选择
     * @param {string} selector 
     * @returns {Array<HTMLElement>}
     */
    function $(selector) {
        const self = this?.querySelectorAll ? this : document;
        return [...self.querySelectorAll(selector)];
    }


    /**
     * 公用函数库
     */
    const util = {
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
            for (const value of iterable) {
                yield [i, value];
                i++;
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
                throw new RangeError(
                    `[${end}, ${end2}) with step ${step} is invalid`
                );
            }

            // 生成范围
            end2 = end2 === null ? 0 : end2;
            const [small, big] = [end, end2].sort((a, b) => a - b);
            // 开始迭代
            if (step > 0) {
                for (let i = small; i < big; i += step) {
                    yield i;
                }
            } else {
                for (let i = big; i > small; i += step) {
                    yield i;
                }
            }
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
                console.error(err);
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

        /**
         * 异步地睡眠 delay 毫秒, 可选 max_delay 控制波动范围
         * @param {number} delay 等待毫秒
         * @param {number} max_delay 最大等待毫秒, 默认为null
         * @returns
         */
        sleep: async function(delay) {
            return new Promise(
                resolve => setTimeout(resolve, delay)
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
         * 强制隐藏元素
         * @param {string | Array<HTMLElement>} selector_or_elems 
         */
        hide: function(selector_or_elems) {
            const cls = "force-hide";
            const elems = selector_or_elems instanceof Array ?
                selector_or_elems : $(selector_or_elems);

            elems.forEach(elem => {
                elem.classList.add(cls);
            });
        },


        /**
         * 等待直到函数返回true
         * @param {Function} is_ready 判断条件达成与否的函数
         * @param {number} timeout 最大等待秒数, 默认5000毫秒
         */
        wait_until: async function(is_ready, timeout=5000) {
            const gap = 200;
            let chances = parseInt(timeout / gap);
            chances = chances < 1 ? 1 : chances;
            
            while (! await is_ready()) {
                await this.sleep(200);
                chances -= 1;
                if (!chances) {
                    break;
                }
            }
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
         * 安全的移除元素
         * @param {string | Array<HTMLElement>} selector_or_elems 要移除的元素列表/选择器
         */
        remove: function(selector_or_elems) {
            const elems = selector_or_elems instanceof Array ?
                selector_or_elems : $(selector_or_elems);
            try {
                elems.forEach(elem => elem.remove());
            } catch (e) {
                console.log(e);
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
    };


    /**
     * 通用页面初始化
     * @param {Function | null} repeated_fn
     */
    function init(repeated_fn) {
        if (repeated_fn === null) {
            repeated_fn = () => {};
        }

        function insert_style() {
            const style = `
            <style>
                .force-hide {
                    display: none;
                }

                xg-slider {
                    display: none;
                }

                div:has(> div > [data-e2e="search-guess-container"]) {
                    display: none;
                }

                [class*="-os"] {
                    flex-direction: column;
                }

                #douyin-right-container {
                    z-index: 3000;
                }
                
                #slidelist > div {
                    padding: 0;
                }

                [class*="-os"] > div:not(#douyin-right-container) {
                    flex-basis: initial;
                    height: 8vh;
                    position: fixed;
                    bottom: 0;
                    z-index: 4000;
                    width: 100vw;
                }

                [data-e2e=douyin-navigation] {
                    width: 100vw;
                    height: fit-content;
                }

                [data-e2e=douyin-navigation] a {
                    transform: scale(3);
                    margin-bottom: 3.2vh;
                    margin-top: 2vh;
                }

                [data-e2e=douyin-navigation] > div > div {
                    margin: 0;
                    width: auto;
                }

                [data-e2e=douyin-navigation] > div > div > div {
                    height: fit-content;
                    width: max-content;
                    justify-content: space-around;
                    flex-direction: row;
                    display: flex;
                }

                header > div > div:has([data-e2e=searchbar-button]) {
                    justify-content: center;
                }

                header > div > div > div:has([data-e2e=searchbar-button]) {
                    transform: none;
                    width: max-content;
                    left: auto;
                    right: auto;
                }

                div:has(> form [data-e2e=searchbar-input]) {
                    position: fixed;
                    left: 40vw;
                    width: 20vw;
                    top: 1em;
                    transition: width 2s, height 2s, left 2s;
                }
                
                div:has(> form [data-e2e=searchbar-input]:focus) {
                    left: 10vw;
                    width: 80vw;
                    height: 45px;
                    transition: width 2s, height 2s, left 2s;
                }

                div:has(> form) {
                    height: 3vh;
                    margin-top: 0.5vh;
                }

                div:has(> header) {
                    height: 100%;
                    padding: 0;
                }

                #douyin-header {
                    height: 5vh;
                }

                .positionBox {
                    bottom: 20vh;
                }

                #relatedVideoCard > div > div > div > svg {
                    margin-top: 128px;
                    height: 256px;
                    width: 256px;
                }

                svg[class*=xg-volume] {
                    width: 45px;
                    height: 45px;
                }

                div:has(> svg[class*=xg-volume]) {
                    margin-top: 3em;
                }

                div#videoSideBar span {
                    font-size: xxx-large;
                    line-height: 1.8em;
                }

                #videoSideBar.show {
                    position: fixed;
                    left: 0;
                    width: 100vw;
                    background: rgba(0, 0, 0, 0.9);
                }

                [data-e2e=feed-active-video] .playerContainer.show {
                    width: 100vw;
                }

                button.comment-reply-expand-btn {
                    margin-top: 7%;
                    margin-bottom: 9%;
                }
            </style>
            `;
            document.head.insertAdjacentHTML(
                "beforeend", style.replace(/;/g, " !important;")
            );
        }


        let mute;
        function reset_mute_icon() {
            mute = $(`[data-state=mute]`).at(-1) || mute;
            const more = $(`[data-e2e="video-play-more"]`).at(-1);
            if (!mute || !more) return;
            
            // 移动 [静音] 到 [更多] 下方
            more.insertAdjacentElement(
                "afterend", mute
            );
            // 移除 [更多]
            more.remove();
        }


        function reset_comment_view() {
            const icon = $(`[data-e2e="feed-comment-icon"]`).at(-1);
            if (!icon) return;

            const s = `#videoSideBar, [data-e2e=feed-active-video] .playerContainer`;
            const s2 = `#relatedVideoCard > div > div > div > svg`;

            icon.ontouchend = () => {
                console.log("点击评论图标");
                icon.click();
                $(s).forEach(
                    async (elem) => {
                        await util.sleep(200);
                        elem.classList.add("show");
                    }
                );
            };

            $(s2).forEach(
                elem => elem.ontouchend = () => {
                    console.log("点击 X 图标");
                    async (elem2) => {
                        await util.sleep(200);
                        elem2.classList.remove("show");
                    }
                }
            );
        }


        function reset_view() {
            reset_mute_icon();
            reset_comment_view();
            repeated_fn();
        }
         
        
        /**
         * @param {TouchEvent} event 
         */
        function on_searchbar_touched(event) {
            event.preventDefault();
            event.stopPropagation();
            const keyword = prompt("请输入要查询的内容");
            if (!keyword) return;
            
            location.pathname = "/search/" + encodeURIComponent(keyword);
        }


        function reset_searchbar() {
            const input = $("[data-e2e=searchbar-input]")[0];
            if (!input) return;
            
            input.addEventListener(
                "touchend",
                on_searchbar_touched,
                true
            );
        }


        (function main() {
            console.log("通用页面初始化");
            
            // 插入样式表
            insert_style();
            // 持续重置页面布局
            reset_view();
            setInterval(reset_view, 1000);
            // 监听缩放变化
            reset_searchbar();
        })();
    }


    /**
     * route 0: index
     */
    route("/")`${
    function index() {
        function adjust_positions() {
            const major = $("#douyin-right-container")[0];
            major.parentElement.insertAdjacentElement(
                "afterbegin", major
            );
        }

        (function main() {
            console.log("进入推荐");
            
            // 调整元素位置
            adjust_positions();
        })();
    }}
    
    ${
    function repeated_fn() {
        function clean() {
            util.remove(`
                #douyin-sidebar,
                [class*="-os"] > div:not(#douyin-right-container) > div:not([data-e2e=douyin-navigation]),
                div:has(> footer),
                div:has(> div > a[href="//www.douyin.com/"]:not([target])),
                #douyin-right-container > div:not([id]),
                #douyin-header > div:not([data-click]),
                header > div > div > div:has([data-e2e=something-button]),
                [data-e2e="douyin-navigation"] div:has(> div > a) > div:not(:has(a)),
                .slider-video + div
            `);
    
            util.remove(
                $(`[data-e2e="douyin-navigation"] a`).filter(
                    elem => !MENU.includes(
                        elem.textContent.trim()
                    )
                )
            );
        }

        (function main() {
            clean();
        })();
    }}`;


    /**
     * route 1: search
     */
    route("/search/.+")`${
    function search() {
        (function main() {
            console.log("进入搜索结果");
        })();
    }}`;


    /**
     * 路由装饰器，用于注册路径处理函数
     * @param {string} path 
     * @returns {Function}
     */
    function route(path) {
        /**
         * @param {Array<string>} _
         * @param {Function} handler
         * @param {Function | null} clean
         */
        return (_, handler, clean=null) => {
            ROUTES.push([
                path,
                () => { init(clean); handler(); }
            ]);
        };
    }


    /**
     * 主路由
     */
    (() => {
        function router() {
            const url = new URL(location.href);
            const cur_path = url.pathname;
            console.info(`url: ${url}\npath: ${cur_path}`);

            for (const [path, handler] of ROUTES) {
                if (new RegExp(`^${path}$`).test(cur_path)) {
                    handler();
                    return;
                }
            }
            console.warn(`Unkown path: ${cur_path}`);
        }

        Object.defineProperty(document, "URL", {
            configurable: false,
            enumerable: true,
            get: function() {
                return location.href;
            },
            set: function(v) {
                if (v !== location.href) {
                    console.warn(`new url: ${v} !== location.href: ${location.href}`);
                    return;
                }
                // 当 URL 变化时执行
                setTimeout(router, BOOT_DELAY);
            }
        });

        setTimeout(router, BOOT_DELAY);
    })();
})();