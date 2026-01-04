// ==UserScript==
// @name         keledge-helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  可知网导出页面到PDF，仅对PDF预览有效
// @author       2690874578@qq.com
// @match        https://www.keledge.com/pdfReader?*
// @require      https://cdn.staticfile.net/pdf-lib/1.17.1/pdf-lib.min.js
// @require      https://cdn.staticfile.net/sweetalert2/11.10.3/sweetalert2.all.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keledge.com
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/470119/keledge-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/470119/keledge-helper.meta.js
// ==/UserScript==


(function () {
    "use strict";

    // 全局常量
    const GUI = `<div><style class="keledge-style">.keledge-fold-btn{position:fixed;left:151px;top:36%;user-select:none;font-size:large;z-index:1001}.keledge-fold-btn::after{content:"🐵"}.keledge-fold-btn.folded{left:20px}.keledge-fold-btn.folded::after{content:"🙈"}.keledge-box{position:fixed;width:154px;left:10px;top:32%;z-index:1000}.btns-sec{background:#e7f1ff;border:2px solid #1676ff;padding:0 0 10px 0;font-weight:600;border-radius:2px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Helvetica Neue',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'}.btns-sec.folded{display:none}.logo-title{width:100%;background:#1676ff;text-align:center;font-size:large;color:#e7f1ff;line-height:40px;height:40px;margin:0 0 16px 0}.keledge-box button{display:block;width:128px;height:28px;border-radius:4px;color:#fff;font-size:12px;border:none;outline:0;margin:8px auto;font-weight:700;cursor:pointer;opacity:.9}.keledge-box button.folded{display:none}.keledge-box .btn-1{background:linear-gradient(180deg,#00e7f7 0,#feb800 .01%,#ff8700 100%)}.keledge-box .btn-1:hover,.keledge-box .btn-2:hover{opacity:.8}.keledge-box .btn-1:active,.keledge-box .btn-2:active{opacity:1}</style><div class="keledge-box"><section class="btns-sec"><p class="logo-title">keledge-helper</p><button class="btn-1" onclick="btn1_fn(this)">{{btn1_desc}}</button></section><p class="keledge-fold-btn" onclick="[this, this.parentElement.querySelector('.btns-sec')].forEach(elem => elem.classList.toggle('folded'))"></p></div></div>`;
    const pdf_data_map = new Map();
    const println = console.log.bind(console);
    const logs = [];

    // 全局变量
    let page_index = -1;

    // 全局属性
    Object.assign(window, { println, pdf_data_map });

    function log(...args) {
        const time = new Date().toTimeString().split(" ")[0];
        const record = `[${time}]\t${args}`;
        logs.push(record);
        println(...args);
    }

    function clear_pdf_data() {
        const size = pdf_data_map.size;
        pdf_data_map.clear();
        log(`PDF缓存已清空，共清理 ${size} 页`);
    }

    /**
     * @param {number} delay
     */
    function sleep(delay) {
        return new Promise((resolve) => setTimeout(resolve, delay));
    }

    /**
     * @param {string[]} libs
     */
    async function wait_for_libs(libs) {
        let not_ready = true;
        while (not_ready) {
            for (const lib of libs) {
                if (!window[lib]) {
                    not_ready = true;
                    break;
                } else {
                    not_ready = false;
                }
            }
            await sleep(200);
        }
    }

    /**
     * 替换 window.glob_obj_name.method 为 new_method
     * @param {string} glob_obj_name
     * @param {string} method
     * @param {Function} new_method
     */
    function hook_method(glob_obj_name, method, new_method) {
        const obj = window[glob_obj_name];
        window[method] = obj[method].bind(obj);
        window["_" + glob_obj_name] = obj;

        window[glob_obj_name] = new Proxy(obj, {
            get(target, property, _) {
                if (property === method) {
                    println(
                        `代理并替换了 ${glob_obj_name}.${property} 属性(方法)访问`
                    );
                    return new_method;
                }
                return target[property];
            },
        });
    }

    function hooked_get_doc(pdf_data) {
        // debugger;
        if (!pdf_data_map.has(page_index)) {
            pdf_data_map.set(page_index, pdf_data.data);
            log(`已经捕获数量：${pdf_data_map.size}`);
        }
        return window["getDocument"](pdf_data);
    }

    function hook_pdfjs() {
        hook_method("pdfjsLib", "getDocument", hooked_get_doc);
    }

    /**
     * @param {{ id: string, container: HTMLDivElement, eventBus: any, "110n": any, linkService: any, textLayerMode: number }} config
     */
    function hooked_viewer(config) {
        // id: "pdf-page-0"
        page_index = parseInt(config.id.split("-").at(-1));
        log(`正在加载页面：${page_index + 1}`);
        return new window["PDFViewer"](config);
    }

    function hook_viewer() {
        hook_method("pdfjsViewer", "PDFViewer", hooked_viewer);
    }

    /**
     * 返回一个包含计数器的迭代器, 其每次迭代值为 [index, value]
     * @param {Iterable} iterable
     * @returns
     */
    function* enumerate(iterable) {
        let i = 0;
        for (let value of iterable) {
            yield [i, value];
            i++;
        }
    }

    async function myalert(text) {
        return Sweetalert2.fire({
            text,
            icon: "error",
            allowOutsideClick: false,
        });
    }

    /**
     * 合并多个PDF
     * @param {Array<ArrayBuffer | Uint8Array>} pdfs
     * @returns {Promise<Uint8Array>}
     */
    async function join_pdfs(pdfs) {
        if (!window.PDFLib) {
            const url =
                "https://cdn.staticfile.org/pdf-lib/1.17.1/pdf-lib.min.js";
            const code = await fetch(url).then((resp) => resp.text());
            eval(code);
        }

        if (!window.PDFLib) {
            const msg = "缺少 PDFLib 无法导出 PDF！";
            myalert(msg);
            throw new Error(msg);
        }

        const combined = await PDFLib.PDFDocument.create();

        for (const [i, buffer] of enumerate(pdfs)) {
            const pdf = await PDFLib.PDFDocument.load(buffer);
            const pages = await combined.copyPages(pdf, pdf.getPageIndices());

            for (const page of pages) {
                combined.addPage(page);
            }
            log(`已经合并 ${i + 1} 组`);
        }

        return combined.save();
    }

    /**
     * 创建并下载文件
     * @param {string} file_name 文件名
     * @param {ArrayBuffer | ArrayBufferView | Blob | string} content 内容
     * @param {string} type 媒体类型，需要符合 MIME 标准
     */
    function save(file_name, content, type = "") {
        const blob = new Blob([content], { type });
        const size = (blob.size / 1024).toFixed(1);
        log(`blob saved, size: ${size} kb, type: ${blob.type}`);

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = file_name || "未命名文件";
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * @param {string} text
     * @returns {Promise<boolean>}
     */
    async function myconfirm(text) {
        const result = await Sweetalert2.fire({
            text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            allowOutsideClick: false,
        });
        return result.isConfirmed;
    }

    async function export_pdf() {
        const yes = await myconfirm("是否导出已经捕获的页面？导出后会清空缓存");
        if (!yes) {
            return;
        }

        // 每个 Item 是 [页码, 数据]
        const pdfs = Array.from(pdf_data_map)
            .sort((a, b) => a[0] - b[0])
            .map((item) => item[1]);

        const combined = await join_pdfs(pdfs);
        save(document.title + ".pdf", combined, "application/pdf");
        clear_pdf_data();
    }

    function show_tips() {
        Sweetalert2.fire({
            title: "可知助手小提示",
            html: "<p>以下快捷键可用: </p><p>显示帮助: ALT + H</p><p>导出文档: ALT + S</p><p>显示日志: ALT + L</p><p>进度明细: ALT + P</p><p>清空缓存: ALT + C</p>",
            timer: 10000,
            timerProgressBar: true,
            allowOutsideClick: true,
        });
    }

    /**
     * 按下 alt + h 弹出帮助文档
     * @param {KeyboardEvent} event
     */
    function shortcut_alt_h(event) {
        if (!(event.altKey && event.code === "KeyH")) {
            return;
        }
        show_tips();
    }

    /**
     * 按下 alt + s 以导出PDF
     * @param {KeyboardEvent} event
     */
    function shortcut_alt_s(event) {
        if (!(event.altKey && event.code === "KeyS")) {
            return;
        }
        export_pdf();
    }

    /**
     * 按下 alt + l 以显示日志
     * @param {KeyboardEvent} event
     */
    function shortcut_alt_l(event) {
        if (!(event.altKey && event.code === "KeyL")) {
            return;
        }
        const text = logs.join("\n");
        Sweetalert2.fire({
            title: "可知助手日志",
            html: `<textarea readonly rows="10" cols="50" style="resize: none;">${text}</textarea>`,
            showConfirmButton: false,
        });
    }

    /**
     * 描述整数数组
     * @param {number[]} nums
     * @returns {string}
     */
    function desc_num_arr(nums) {
        const result = [];
        let start = null;
        let end = null;

        for (let i = 0; i < nums.length; i++) {
            if (start === null) {
                start = nums[i];
                end = nums[i];
            } else if (nums[i] === end + 1) {
                end = nums[i];
            } else {
                if (start === end) {
                    result.push(`${start}`);
                } else {
                    result.push(`${start}-${end}`);
                }
                start = nums[i];
                end = nums[i];
            }
        }

        if (start !== null) {
            if (start === end) {
                result.push(start.toString());
            } else {
                result.push(`${start}-${end}`);
            }
        }

        return result.join(", ");
    }

    /**
     * 按下 alt + p 以显示进度详情
     * @param {KeyboardEvent} event
     */
    function shortcut_alt_p(event) {
        if (!(event.altKey && event.code === "KeyP")) {
            return;
        }

        const captured = Array
            .from(pdf_data_map.keys())
            .sort((a, b) => a - b)
            .map(pn => pn + 1);
        const progress = desc_num_arr(captured);

        Sweetalert2.fire({
            title: "页面捕获进度",
            text: captured.length ? `已经捕获的页码：${progress}` : `尚未捕获任何页面`,
        });
    }

    /**
     * 按下 alt + c 以显示进度详情
     * @param {KeyboardEvent} event
     */
    async function shortcut_alt_c(event) {
        if (!(event.altKey && event.code === "KeyC")) {
            return;
        }

        const hint = `是否清空所有已经捕获的页面（共 ${pdf_data_map.size} 页）？`;
        const yes = await myconfirm(hint);
        if (!yes) {
            return;
        }

        clear_pdf_data();
        Sweetalert2.fire({
            icon: "info",
            text: "缓存已清空",
        });
    }

    async function early_main() {
        log("进入 keledge-helper 脚本");

        await wait_for_libs(["pdfjsLib", "pdfjsViewer"]);
        hook_viewer();
        hook_pdfjs();

        window.btn1_fn = export_pdf;
        const gui = GUI.replace("{{btn1_desc}}", "导出PDF");
        document.body.insertAdjacentHTML("beforeend", gui);
    }

    function set_shortcuts() {
        const shortcuts = [
            shortcut_alt_h,  // 显示帮助
            shortcut_alt_s,  // 导出pdf
            shortcut_alt_l,  // 显示日志
            shortcut_alt_p,  // 显示捕获进度
            shortcut_alt_c,  // 清空缓存
        ];

        for (const shortcut of shortcuts) {
            window.addEventListener("keydown", shortcut, true);
        }
    }

    function later_main() {
        show_tips();
        set_shortcuts();
    }

    function main() {
        early_main();
        document.addEventListener("DOMContentLoaded", later_main);
    }

    main();
})();
