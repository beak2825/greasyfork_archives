// ==UserScript==
// @name         iconfont一键复制SVG
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  适用于 iconfont 快速复制 SVG 代码。支持图标库文件复制，矢量插画库文件复制。默认复制图标为20px，方便调整。
// @author       2690874578@qq.com
// @match        https://www.iconfont.cn/*
// @icon         http://img.alicdn.com/imgextra/i4/O1CN01Z5paLz1O0zuCC7osS_!!6000000001644-55-tps-83-82.svg
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.all.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/464228/iconfont%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6SVG.user.js
// @updateURL https://update.greasyfork.org/scripts/464228/iconfont%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6SVG.meta.js
// ==/UserScript==


(async function () {
    "use strict";

    // 脚本级全局常量
    // minify js and css
    // https://www.minifier.org/
    // minify html
    // https://www.atatus.com/tools/html-minify
    const SCRIPT_SETTINGS_POPUP = `
<dialog id="script-popup"><form method="dialog"><h1 class="set-tit1">插件设置</h1><fieldset><legend class="set-tit2">复制大小</legend><input name="size" placeholder="" type="number" max="5000" min="4" class="set-size" value="20"></fieldset><fieldset class="set-radio"><legend class="set-tit2">复制格式</legend><input id="radio-svg" type="radio" name="format" value="svg" class="svg-ra" checked="checked"><label class="s-txt" for="radio-svg">SVG</label><input id="radio-png" type="radio" name="format" value="png" class="svg-ra"><label class="s-txt" for="radio-png">PNG</label></fieldset><fieldset class="btn-outdiv"><button id="dialog-cancel" class="btb-cancel" onclick="document.querySelector('#radio-cancel').click()">取消</button><button id="dialog-confirm" class="btn-ok" onclick="document.querySelector('#radio-confirm').click()">确定</button><input id="radio-cancel" type="radio" name="action" value="cancel" class="hidden"> <input id="radio-confirm" type="radio" name="action" value="confirm" class="hidden"></fieldset></form><style>
dialog#script-popup{*{all:revert;margin:0;padding:0;border-top-width:0;padding-right:0;padding-left:0;border-left-width:0;border-bottom-width:0;padding-bottom:0;margin:0;padding-top:0;border-right-width:0}.hidden{display:none}ul{list-style:none}img{border:none}a{text-decoration:none}.fl{float:left}.fr{float:right}.clear{clear:both;overflow:hidden;height:0}.center{width:1300px;margin:0 auto}.lv{color:#379e3e!important}.hong{color:#f00!important}a:hover img{filter:alpha(opacity=80);opacity:.8;-webkit-transition:all 0.2s linear;-moz-transition:all 0.2s linear;-ms-transition:all 0.2s linear;transition:all 0.2s linear}&{position:fixed;width:340px;padding:40px 30px;background-color:#fff;border:none;border-radius:4px;box-sizing:border-box;box-shadow:rgb(0 0 0 / .2) 0 12px 28px 0,rgb(0 0 0 / .1) 0 2px 4px 0,rgb(255 255 255 / .05) 0 0 0 1px inset}legend{font-weight:700}.set-tit1{max-width:100%;text-align:center;text-transform:none;word-wrap:break-word;color:#333;font-size:30px;font-style:normal;font-weight:700;margin-bottom:32px}.set-tit2{font-size:18px;color:#333;margin-bottom:8px}.set-size{border:2px solid #e8ebf3;box-sizing:border-box;padding:0 16px;width:100%;margin-bottom:32px;height:46px;border-radius:8px;font-size:14px}.set-size:focus{border:2px solid #4569ff;outline:none;box-shadow:inset 0 1px 1px rgb(0 0 0 / .06),0 0 0 3px rgb(62 157 255 / 30%)}.svg-ra{width:16px;height:16px;vertical-align:middle;margin:0 0 4px 0;padding:0}.set-radio label{margin-left:.5em;margin-right:32px}.s-txt{color:#666;text-align:center;font-size:14px;font-style:normal;font-weight:400;line-height:27px}.btn-outdiv{display:flex;align-items:flex-start;gap:8px;align-self:stretch;margin-top:32px}.btb-cancel{display:flex;width:73px;height:39px;padding:10px;justify-content:center;align-items:center;gap:10px;background-color:#fff;border:1px solid #dcdee2;outline:0;color:#999;transition:all 0.3s ease;border-radius:8px}.btb-cancel:hover{background-color:#e2e8f0;transition:all 0.3s ease}input[type='radio']:checked{border-color:red}.btn-ok{display:flex;height:39px;padding:10px;justify-content:center;align-items:center;gap:10px;flex:1 0 0%;background-color:#4569ff;transition:all 0.3s ease;color:#fff;border:0;outline:0;border-radius:8px}.btn-ok:hover{background:linear-gradient(0deg,rgb(0 0 0 / .1) 0%,rgb(0 0 0 / .1) 100%),#3f5dfa;transition:all 0.3s ease}}
</style></dialog>
    `;
    const IS_FIREFOX = navigator.userAgent.includes("Firefox");
    const SMALL_DELAY = 200,
        MEDIUM_DELAY = 500,
        LARGE_DELAY = 1000,
        XML = new XMLSerializer(),
        // 支持的图像导出格式
        OUT_FMTS = ["svg", "png"],
        // 设置表: [设置的名称, 默认值]
        MENU = {
            SVG_SIZE: ["svg_size", 20],
            OUT_FMT: ["out_fmt", "svg"],
        };

    /**
     * 脚本配置初始化 -------------------------------------------------------------------------
     */

    const CFG = (() => {
        /**
         * 判断 size 是否为 1 - 1000 内的整数
         * @param {string | number} size
         * @returns {boolean}
         */
        function _is_size_valid(size) {
            const _size = parseFloat(size);
            if (_size === NaN) return false;
            if (_size - parseInt(size) !== 0) return false;
            if (_size < 4 || _size > 5000) return false;
            return true;
        }

        /**
         * 生成 x 合规函数生成器
         * @param {(x: string) => T} parse
         * @param {(x: string) => boolean} is_valid
         * @param {() => T} getter
         * @returns {(alter_on_invalid: (string) => void) => (size: string) => number}
         */
        function _gen_validator(parse, is_valid, getter) {
            return (alter_on_invalid) => (x) => {
                const _x = parse(x);
                if (!is_valid(x)) {
                    console.warn(`无效的插件设置项:`, x);
                    alter_on_invalid(x);
                    return getter();
                }
                return _x;
            };
        }

        /**
         * 从对话框关闭事件提取表单数据为字典
         * @param {CloseEvent} event
         * @returns {Map<string, string>}
         */
        function _extract_form_data(event) {
            const form = event.target.querySelector("form");
            const data = new FormData(form);
            return new Map(data.entries());
        }

        function _is_format_valid(format) {
            return OUT_FMTS.includes(format);
        }

        /**
         * 生成提示函数
         * @param {string} text 应该有 {x} 占位符
         * @param {string} title
         * @returns {(x: string) => void}
         */
        function _alert_invalid_x(text, title) {
            return (x) => alert_error(text.replace("{x}", x), title);
        }

        /**
         * 解包表单数据，合法化，对非法的弹窗提示
         * @param {Map<string, string>} data
         * @returns {{ size: number, format: string }}
         */
        function _unpack(data) {
            const alert_size = _alert_invalid_x(
                "尺寸 {x} 不是有效数字！",
                "无效尺寸！"
            );
            const alert_format = _alert_invalid_x(
                "图像格式 {x} 不受支持！",
                "无效格式！"
            );
            const get_stored_x = (x) => () => GM_getValue(...x);
            const validate_size = _gen_validator(
                parseInt,
                _is_size_valid,
                get_stored_x(MENU.SVG_SIZE)
            );
            const pass = (x) => x;
            const validate_format = _gen_validator(
                pass,
                _is_format_valid,
                get_stored_x(MENU.OUT_FMT)
            );

            const size = validate_size(alert_size)(data.get("size"));
            const format = validate_format(alert_format)(data.get("format"));
            return { size, format };
        }

        /**
         * 弹出脚本配置弹窗以获取配置
         * @param {(data: { size: number, format: string }, ...tasks: (data: { size: number, format: string }) => Promise<void>) => Promise<void>} on_success
         * @param {...(data: { size: number, format: string }) => Promise<void>} tasks
         * @returns {Promise<{ valid: boolean, size: number, format: string }>}
         */
        async function ask_for_config(on_success, ...tasks) {
            const event = await show_settings();
            const data = _extract_form_data(event);
            console.info(`从对话框中提取的表单数据:`, data);

            if (data.get("action") === "cancel") {
                show_msg("取消设置", "warning");
                return { valid: false };
            }

            const { size, format } = _unpack(data);
            on_success({ size, format }, ...tasks);
            return {
                valid: true,
                size,
                format,
            };
        }

        // 在 GM_registerMenuCommand 函数中注册
        /**
         * 显式插件设置成功
         * @param {{ size: number, format: string }} _
         * @returns {Promise<void>}
         */
        async function _show_config_ok(_) {
            show_msg("插件设置成功~");
            console.info("插件设置成功弹窗已经触发");
        }

        // 在 GM_registerMenuCommand 函数中注册
        /**
         * 设置复制图标的提示文本
         * @param {{ size: number, format: string }} config
         * @returns {Promise<void>}
         */
        async function _set_icon_title(config) {
            const { format } = config;
            const _format = format.toUpperCase();
            const icons = $("span.svg-copy");

            for (const span of icons) {
                span.title = "复制" + _format;
            }
            console.info(`全部图标 title 已经更新完成 -> ${_format}`);
        }

        /**
         * 当插件设置成功时批量执行任务
         * @param {{ size: number, format: string }} config
         * @param  {...(data: { size: number, format: string }) => Promise<void>} tasks
         */
        async function on_config_success(config, ...tasks) {
            console.info("插件设置成功，正在批量执行后置任务，使用最新配置:", config);
            for (const task of tasks) {
                task(config);
            }
        }

        /**
         * 获取存储的值(失败时使用默认值)
         * @returns {{ size: number, format: string }}
         */
        function get_stored_config() {
            return {
                size: GM_getValue(...MENU.SVG_SIZE),
                format: GM_getValue(...MENU.OUT_FMT),
            };
        }

        /**
         * 为弹窗对话框插入存储的配置
         * @param {HTMLDialogElement} popup
         * @param {{ size: number, format: string }} config
         */
        function insert_config(popup, config) {
            const $ = (s) => popup.querySelector(s);
            $('input[name="size"]').value = config.size;
            $(`[id="radio-${config.format}"]`).click();
        }

        /**
         * 弹出脚本设置弹窗，返回弹窗关闭事件
         * @returns {Promise<CloseEvent>}
         */
        function show_settings() {
            const popup = $("#script-popup")[0];
            const config = get_stored_config();
            insert_config(popup, config);
            popup.showModal();

            return new Promise((resolve, _) => {
                popup.addEventListener("close", resolve);
            });
        }

        GM_registerMenuCommand("插件设置", async () => {
            const config = await ask_for_config(
                on_config_success,
                _show_config_ok,
                _set_icon_title,
            );
            if (!config.valid) return;

            GM_setValue(MENU.SVG_SIZE[0], config.size);
            GM_setValue(MENU.OUT_FMT[0], config.format);
        });

        return {
            /**
             * @returns {number}
             */
            get SVG_SIZE() {
                return GM_getValue(...MENU.SVG_SIZE);
            },

            /**
             * @returns {string}
             */
            get OUT_FMT() {
                return GM_getValue(...MENU.OUT_FMT);
            },
        };
    })();

    /**
     * 公用函数 ----------------------------------------------------------------------------
     */

    function fire(...args) {
        const Swal = window["Swal"];
        if (!(Swal instanceof Function)) {
            // debugger;
            const msg = "弹窗库 SweetAlert2 未加载！";
            alert(msg + "\n你将无法看到正常弹窗，但功能仍会执行！");
            console.warn("弹窗消息:", ...args);
            return Promise.reject(new Error(msg));
        }
        return Swal.fire(...args);
    }

    /**
     * 弹出小型提示框，2秒后消失
     * @param {string} text 提示文本
     * @param {"success" | "warning" | "error" | "info" | "question"} status 状态
     * @returns {Promise}
     */
    function show_msg(text = "复制成功，可以粘贴咯~", status = "success") {
        return fire({
            text,
            toast: true,
            timer: 2000,
            showConfirmButton: false,
            icon: status,
            position: "top",
            customClass: {
                popup: "copy-popup",
                htmlContainer: "copy-container",
                icon: "copy-icon",
            },
        });
    }

    /**
     * 显示警告弹窗
     * @param {string} text
     * @param {string} title
     */
    function alert_error(text, title = null) {
        fire({
            icon: "error",
            title,
            text,
        });
    }

    /**
     * 异步的等待 delay_ms 毫秒
     * @param {number} delay_ms
     * @returns {Promise<void>}
     */
    function sleep(delay_ms) {
        return new Promise((resolve) => setTimeout(resolve, delay_ms));
    }

    /**
     * 将 svg 元素序列化为大小为 20x20 的 svg 代码
     * @param {SVGElement} svg
     * @returns {string}
     */
    function svgToStr(svg) {
        // 设置大小
        svg.setAttribute("width", `${CFG.SVG_SIZE}`);
        svg.setAttribute("height", `${CFG.SVG_SIZE}`);

        // 序列化
        return XML.serializeToString(svg);
    }

    /**
     * 元素选择器
     * @param {string} selector 选择器
     * @returns {HTMLElement[]} 元素
     */
    function $(selector) {
        const self = this?.querySelectorAll ? this : document;
        return [...self.querySelectorAll(selector)];
    }

    /**
     * 安全元素选择器，直到元素存在时才返回元素列表，最多等待5秒
     * @param {string} selector 选择器
     * @returns {Promise<Array<HTMLElement>} 元素列表
     */
    async function $$(selector) {
        const self = this?.querySelectorAll ? this : document;

        for (let i = 0; i < 10; i++) {
            let elems = [...self.querySelectorAll(selector)];
            if (elems.length > 0) {
                return elems;
            }
            await sleep(200);
        }

        const not_found_error = new Error(
            `"${selector}" not found in 2s`
        );
        console.error(not_found_error);
        return [];
    }

    /**
     * 域名主函数 ----------------------------------------------------------------------
     */

    /**
     * iconfont 主函数
     */
    async function iconfont() {
        console.log("进入 iconfont");
        init_task();

        // 域名级全局常量
        const PATHS = ["search", "illustrations", "collections"];
        const STYLE_TEXT = `
.force-hide{visibility:hidden!important}.block-icon-list li:hover div.icon-cover{display:grid;grid-template-columns:auto auto}.block-icon-list li .icon-cover span.cover-item-line{height:auto;line-height:50px}.svg-copy.disabled{color:#6d6d6d!important}.icon-fuzhidaima:before{font-size:24px}.copy-icon{border:none!important;margin:0 1.25em!important;margin:0 0 0 10px!important}.copy-container{margin:8px 16px!important;padding:0!important;font-size:14px!important}.copy-popup{top:60px;padding:4px 10px!important;height:44px!important;font-size:12px!important;width:fit-content!important;align-content:center;box-shadow:rgb(0 0 0 / .2) 0 12px 28px 0,rgb(0 0 0 / .1) 0 2px 4px 0,rgb(255 255 255 / .05) 0 0 0 1px inset!important}
        `;

        /**
         * 阻塞直到图标区存在
         */
        while (true) {
            if ($(".block-icon-list > li")[0]) break;
            await sleep(SMALL_DELAY);
        }
        console.log("图标区出现了，开始执行任务");

        function addStyle() {
            const id = "iconfont-svg-copy-style";
            if ($(`#${id}`)[0]) return;

            const style = document.createElement("style");
            style.id = id;
            style.innerHTML = STYLE_TEXT;
            document.head.append(style);
        }

        /**
         * 初始化 writeText 钩子
         * @returns {Function}
         */
        function initHookOnWriteText() {
            const writeText = navigator.clipboard.writeText;
            const boundedWriteText = (text) =>
                writeText.call(navigator.clipboard, text);

            /**
             *
             * @param {(value) => any} resolve
             * @returns {(text: string) => string}
             */
            function wrapHookedWriteText(resolve) {
                /**
                 * @param {string} text
                 * @returns {string}
                 */
                return async function (text) {
                    console.log("进入 hooked 的 writeText 函数");

                    // 无论成功与否，writeText 都要改回去
                    Object.defineProperty(navigator.clipboard, "writeText", {
                        value: writeText,
                        writable: false,
                        enumerable: true,
                        configurable: true,
                    });

                    // 没有取得 svg 字符串，解决为空字符串
                    if (!`${text}`.includes("<svg")) {
                        resolve("");
                        return;
                    }

                    // 成功取得 svg 字符串，解决为SVG代码
                    try {
                        // await boundedWriteText(text);
                        resolve(text);
                    } catch (e) {
                        return e;
                    }
                };
            }

            function hookWriteText() {
                return new Promise((resolve) => {
                    // 劫持 writeText 函数，直到一次调用后失效
                    Object.defineProperty(navigator.clipboard, "writeText", {
                        value: wrapHookedWriteText(resolve),
                        writable: false,
                        enumerable: true,
                        configurable: true,
                    });
                });
            }
            return hookWriteText;
        }

        /**
         * 返回期约，直到 writeText 被调用且复制内容包含 "<svg" 时才解决为 svg_str。
         * 如果调用 writeText 的内容不包含 "<svg"，则解决为 ""。
         */
        const hookWriteText = initHookOnWriteText();

        /**
         * 在弹窗中获取 svg
         * @param {HTMLElement} card
         */
        async function copyInPopup(card) {
            // 禁用复制按钮
            const icon = $.call(card, ".svg-copy")[0];
            icon.classList.add("disabled");
            icon.removeEventListener("click", on_copy_icon_clicked, true);

            // 触发弹窗
            const download = $.call(card, "[title='下载'], [title='Download']")[0];
            download.click();

            // 等待弹窗加载完毕
            while (true) {
                if ($("[id*='dlg_'], [id*='mask_dlg_']").length) {
                    break;
                }
                await sleep(SMALL_DELAY);
            }

            // 隐藏弹窗
            const dialogs = await $$("[id*='dlg_']");
            dialogs.forEach((elem) => elem.classList.add("force-hide"));

            let popup;
            for (let elem of dialogs) {
                if (elem.id.startsWith("dlg_")) {
                    popup = elem;
                    break;
                }
            }
            if (!popup) throw new Error("#dlg_ not found");

            // 取得复制SVG按钮
            const copy_btn = (await $$("#btn-copy-svg"))[0];
            if (!copy_btn) {
                alert_error("此插画无法复制！可能是版权受限！", "复制失败");
                return;
            }

            let svg_str = "";
            let i = 1;
            do {
                const copy_task = hookWriteText();
                copy_btn.click();
                await sleep(SMALL_DELAY);
                svg_str = await copy_task;
                console.info(`try copy svg in popup: ${i}`);
                i += 1;
                // debugger;
            } while (svg_str === "" && i < 10);

            if (svg_str === "") {
                alert_error("复制失败！可能是网络异常！请稍后再试！", "复制失败");
                return;
            }

            // debugger;
            await copy_svg_to_aim_fmt(svg_str);

            // 关闭弹窗
            $(".mp-e2e-dialog-close")[0].click();
            // 重新启用复制按钮
            icon.classList.remove("disabled");
            icon.addEventListener("click", on_copy_icon_clicked, true);
        }

        /**
         * 复制 blobs 为一个剪贴板对象
         * @param {Blob[]} blobs
         */
        async function copy_blobs(blobs) {

            console.log("blob to be written:", blobs);
            const bundle = {};
            blobs.forEach((blob) => {
                if (IS_FIREFOX && blob.type === "image/svg+xml") {
                    console.log("火狐浏览器不支持 SVG，忽略 SVG 类型数据复制");
                    return;
                }

                bundle[blob.type] = blob;
            });
            const item = new ClipboardItem(bundle);
            // 复制到剪贴板
            try {
                await navigator.clipboard.write([item]);
                // 提示复制成功
                show_msg();
            }
            catch (err) {
                console.error(err);
                show_msg("复制到剪贴板失败！", "error");
            }
        }

        /**
         * svg str 转 png blob
         * @param {string} svg
         * @returns {Promise<Blob[]>}
         */
        async function svg_to_png(svg) {
            // prepare an image for format convertion
            const img = new Image();
            const svg_blob = new Blob([svg], { type: "image/svg+xml" });
            const svg_url = URL.createObjectURL(svg_blob);
            img.src = svg_url;

            // draw white background
            const canvas = document.createElement("canvas");
            const size = CFG.SVG_SIZE;
            const sizes = [size, size];
            [canvas.width, canvas.height] = sizes;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "transparent";
            ctx.fillRect(0, 0, ...sizes);

            // draw image
            await new Promise((resolve) => {
                img.onload = resolve;
            });
            ctx.drawImage(img, 0, 0);
            // release svg resource
            URL.revokeObjectURL(svg_url);

            // convert to png
            return new Promise((resolve) =>
                canvas.toBlob(resolve)
            );
        }

        /**
         * 复制 svg 代码为目标格式到剪贴板
         * @param {string} svg_str
         */
        async function copy_svg_to_aim_fmt(svg_str) {
            const fmt_to_blobs = new Map([
                ["svg", async () => [
                    new Blob([svg_str], { type: "text/plain" }),
                    new Blob([svg_str], { type: "image/svg+xml" }),
                ]],
                ["png", async () => [await svg_to_png(svg_str)]],
            ]);

            const blob_for_exception = new Blob([`未知输出格式: ${CFG.OUT_FMT}`], { type: "text/plain" });
            const gen_ex_blobs = async () => [blob_for_exception];
            const gen_blobs = fmt_to_blobs.get(CFG.OUT_FMT) ?? gen_ex_blobs;
            const blobs = await gen_blobs();

            await copy_blobs(blobs);
        }

        /**
         * 当点击复制图标时复制 svg 到剪贴板
         * @param {PointerEvent} event
         */
        function on_copy_icon_clicked(event) {
            // 取得svg
            const card = event.target.closest("li");
            const svg = $.call(card, "svg")[0];

            // 如果是在 iframe 中的，那就要通过模拟点击下载的方式来获取
            if (!svg) {
                copyInPopup(card);
                return;
            }

            // 序列化
            const svg_str = svgToStr(svg);
            copy_svg_to_aim_fmt(svg_str);
        }

        function addCopyIcon() {
            // 获取卡片
            const cards = $(".block-icon-list > li");
            if (!cards[0]) throw new Error("无法选中图标块");

            // 制作按钮元素模板
            const template = document.createElement("span");
            template.title = "复制" + CFG.OUT_FMT.toUpperCase();
            template.classList.add(
                "cover-item",
                "iconfont",
                "cover-item-line",
                "icon-fuzhidaima",
                "svg-copy"
            );

            cards.forEach((card) => {
                // 添加复制图标
                const icon_copy = template.cloneNode();
                // 增加复制功能
                icon_copy.addEventListener("click", on_copy_icon_clicked, true);
                card.querySelector(".icon-cover").append(icon_copy);
            });
        }

        function add_script_settings_popup(popup_html) {
            // 弹窗已存在，退出
            if ($("#script-popup")[0]) return;
            // 弹窗不存在，创建并插入
            document.body.insertAdjacentHTML("beforeend", popup_html);
        }

        async function mainTask() {
            console.log("mainTask entered");

            const first_path = location.pathname.split("/")[1];
            console.log("当前一级路径：" + first_path);

            // 无关路径
            if (!first_path || !PATHS.includes(first_path)) return;

            // 等待直到图标块出现
            while (true) {
                if ($(".block-icon-list > li")[0]) break;
                await sleep(SMALL_DELAY);
            }

            // 如果已经存在按钮，退出主函数
            if ($(".icon-cover span.svg-copy")[0]) return;
            console.log("正在建造 [复制SVG] 图标...");

            addStyle();
            addCopyIcon();

            console.log("[复制SVG] 图标 建造完成");
        }

        function delayedTask() {
            setTimeout(mainTask, 0);
        }

        function getIconsBox(block = true) {
            const s = ".block-icon-list";
            if (block) return $(`${s} li`)[0].closest(s);
            return $$(`${s} li`).then((elems) => elems[0].closest(s));
        }

        function monitorIconsChanging() {
            const observer = new MutationObserver(delayedTask);
            observer.observe(getIconsBox(), { childList: true });
        }

        const onMainChanged = (function () {
            let icons_box = getIconsBox();

            async function inner() {
                const new_box = await getIconsBox(false);
                if (icons_box === new_box) return;

                icons_box = new_box;
                mainTask();
                monitorIconsChanging();
            }

            function delayed() {
                setTimeout(inner, LARGE_DELAY);
            }

            return delayed;
        })();

        async function monitorMainChanging() {
            const elem = (await $$("#magix_vf_main"))[0],
                observer = new MutationObserver(onMainChanged);
            observer.observe(elem, { attributes: true });
        }

        function init_task() {
            console.info("执行初始化任务");
            add_script_settings_popup(SCRIPT_SETTINGS_POPUP);
        }

        function main() {
            console.log("进入 iconfont.main");
            mainTask();
            monitorMainChanging();
            monitorIconsChanging();
            addEventListener("popstate", mainTask, true);
        }

        main();
    }

    function execute_route(route, host) {
        const action = route[host];
        if (!action) {
            console.log(`未知域名，不能处理：${host}`);
            return;
        }
        action();
    }

    /**
     * 路由，主函数入口
     */
    (() => {
        console.log("进入 route");
        const host = location.hostname;
        const route = {
            "www.iconfont.cn": iconfont,
        };
        execute_route(route, host);
    })();

    /**
     * [更新日志]
     *
     * 更新日期：2023/4/23
     * 更新版本：1.1.2
     * - 美化SVG尺寸设置弹窗
     *
     * 更新日期：2023/7/24
     * 更新版本：1.1.3
     * - 新增复制为PNG选项
     *
     * 更新日期：2024/6/15
     * 更新版本：1.1.4
     * - 重写配置弹窗，合并尺寸和图像类型到一个弹窗中
     *
     * 更新日期：2024/6/15
     * 更新版本：1.1.5
     * - 修复非图标页面不能打开设置弹窗的 BUG
     *
     * 更新日期：2024/6/16
     * 更新版本：1.1.6
     * - 修复复制图标 title 不随复制格式变化而变化的 BUG
     *
     * 更新日期：2024/7/11
     * 更新版本：1.1.7
     * - 修复复制部分插画失败的问题
     * - 当无法复制时弹窗提示(copyInPopup情形下)
     *
     * 更新日期：2024/7/11
     * 更新版本：1.1.8
     * - 调整 sweetalert2 依赖
     *
     * 更新日期：2024/7/11
     * 更新版本：1.1.9
     * - 优化部分代码
     *
     * 更新日期：2025/5/13
     * 更新版本：1.2.1
     * - 修正在火狐浏览器上复制失败的问题
     */
})();
