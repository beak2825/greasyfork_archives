// ==UserScript==
// @name         合肥工业大学图书馆PDF下载
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  适用于【合肥工业大学图书馆-纸电一体化读者服务平台】，对文档截图，合并为PDF。
// @author       2690874578@qq.com
// @match        https://hfut.zhitongda.cn/opac/readBook
// @require      https://greasyfork.org/scripts/445312-wk-full-cli/code/wk-full-cli.user.js
// @icon         https://hfut.zhitongda.cn/opac/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/473245/%E5%90%88%E8%82%A5%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86PDF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/473245/%E5%90%88%E8%82%A5%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86PDF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


// import { utils } from "../utils";
(function() {
    "use strict";

    // 平台网址
    // https://hfut.zhitongda.cn/opac/reads

    // 全局常量
    const API = "getPdfUrl";  // 取得 PDF 数据的全局函数名称
    const DL_BTN = 1;  // 按钮序号，此按钮用于下载 PDF
    const utils = wk$;
    
    // 全局变量
    let iframe = null;


    /**
     * 输出 [info] 级别日志到控制台
     * @param  {...any} args 
     */
    function print(...args) {
        console.info("[wk]:", ...args);
    }


    /**
     * 将错误定位转为可读的字符串
     * @param {Error} err 
     * @returns {string}
     */
    function get_stack(err) {
        let stack = `${err.stack}`;
        const matches = stack.matchAll(/at .+?( [(].+[)])/g);

        for (const group of matches) {
            stack = stack.replace(group[1], "");
        }
        return stack.trim();
    }


    /**
     * @param {(event: PointerEvent) => Promise<void>} btn_fn 
     * @returns {(event: PointerEvent) => Promise<void>}
     */
    function wrap_btn_fn(btn_fn) {
        async function inner(event) {
            const btn = event.target;
            const text = btn.textContent;
            btn.disabled = true;
            try {
                await btn_fn(event);
            } catch(err) {
                utils.raise(
                    `发生错误，请在评论区反馈，或联系 2690874578@qq.com\n` + 
                    `错误原因：\n` + 
                    `${err}\n` +
                    `发生位置：\n` + 
                    `${get_stack(err)}`
                );
            }
            btn.textContent = text;
            btn.disabled = false;
        }
        return inner;
    }


    /**
     * 初始化进度计数器
     */
    function init_counter() {
        let _counter = 0;
        let _text = "未初始化进度：{}";

        /**
         * 设置进度文本，必须正好包含一对大括号，用于填充 counter
         * @param {string} text 
         */
        function set_text(text) {
            const [left, right] = [_text.indexOf("{}"), _text.lastIndexOf("{}")];
            if (left === -1) {
                throw new Error(`进度文本中必须包含一对大括号`);
            }
            if (left !== right) {
                throw new Error(`进度文本中能且仅能包含一对大括号`);
            }

            _text = text;
        }

        /**
         * counter + 1，且输出进度
         */
        function count() {
            _counter += 1;
            const progress = _text.replace("{}", `${_counter}`);

            try {
                print("<进度>", progress);
                utils.btn(DL_BTN).textContent = progress;
            } catch (err) {
                console.error(err);
            }
        }

        /**
         * 重置 counter
         */
        function reset_counter() {
            _counter = 0;
            _text = "未初始化进度：{}";
        }

        return { set_text, count, reset_counter };
    }

    const { set_text, count, reset_counter } = init_counter();


    /**
     * iframe 内单元素选择器
     * @param {string} selectors 
     * @returns {HTMLElement | undefined}
     */
    function iframe$(selectors) {
        if (iframe instanceof HTMLIFrameElement) {
            return iframe.contentDocument.querySelector(selectors);
        }

        const _iframe = document.querySelector("iframe");
        if (_iframe) {
            if (!iframe) {
                iframe = _iframe;
            }
            return iframe.contentDocument.querySelector(selectors);
        }
    }


    /**
     * 请求第 pn 页 PDF
     * @param {number} pn 
     * @returns {Promise<undefined | Uint8Array>}
     */
    async function get_data_by_pn(pn) {
        const result = await window[API](pn);
        count();  // 更新进度

        if (!result.data) {
            print(`第 ${pn} 页请求得到空响应`);
            return;
        }
        if (!result.success) {
            print(`第 ${pn} 页请求失败`);
            return;
        }

        return utils.b64_to_bytes(result.data);
    }


    /**
     * 下载并返回全部 PDF 数据
     * @param {number} max_pn
     * @returns {Promise<Array<Uint8Array>>} 
     */
    async function fetch_pdfs(max_pn) {
        // 准备请求
        reset_counter();
        set_text(`已下载 {}/${max_pn} 页`);
        print(`最大页码：${max_pn}`);
        print("开始下载 PDF");
        const tasks = [];
        
        // 请求数据
        for (let i = 0; i < max_pn; i++) {
            tasks[i] = get_data_by_pn(i);
        }

        // 完成请求完成
        const pdfs = await utils.gather(tasks);
        reset_counter();
        print("全部 PDF 下载完成");
        return pdfs;
    }


    /**
     * 请求并下载 PDF
     * @returns {Promise<void>}
     */
    async function make_pdf() {
        // 确认继续
        if (!confirm("开始下载后会导致文档预览消失，是否继续？")) {
            return;
        }

        // 环境检测
        if (!window[API] || !(window[API] instanceof Function)) {
            utils.raise(`window.${API} 不存在，无法请求 PDF 数据`);
        }

        const title = iframe$("#bookName")?.title || iframe$("title")?.textContent || "电子书";
        const max_pn = parseInt(iframe$("#pageNumber").max);
        // const max_pn = 2;
        if (max_pn < 1) {
            utils.raise(`不正常的最大页码：${max_pn}`);
        }

        // 移除PDF预览
        iframe.remove();

        const pdfs = await fetch_pdfs(max_pn);
        let size = pdfs.map(bytes => bytes.length).reduce((sum, len) => sum + len);
        size = size / 1024 / 1024;

        // 下载原始数据
        alert(`即将保存原始数据集（${size.toFixed(0)} MB），请用【pdfs-merger】转换为 PDF`);
        const type = "application/octet-stream";
        const blob = new Blob(pdfs, { type });
        utils.save(`${title}.dat`, blob, type);
    }

    make_pdf = wrap_btn_fn(make_pdf);


    /**
     * 合肥工业大学图书馆-纸电一体化读者服务平台-文档下载策略
     */
    function zhitongda() {
        utils.create_btns();
        utils.onclick(make_pdf, DL_BTN, "下载PDF");
    }
    

    zhitongda();


    /**
     * 更新日志
     * ---
     * (v0.0.1) [2023-08-17]
     * - 发布初版
     * ---
     * (v0.0.2) [2023-08-18]
     * - 移除了网页上合成PDF的功能，现在只能下载数据集（原先的合成PDF功能有BUG）
     */
})();
