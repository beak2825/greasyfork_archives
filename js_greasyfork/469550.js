// ==UserScript==
// @name            table-copier
// @namespace       http://tampermonkey.net/
// @version         0.6
// @description     适用于任意网站，快速复制表格为纯文本、HTML、图片
// @match           *://*/*
// @require         https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js
// @grant           none
// @run-at          document-idle
// @license         GPL-3.0-only
// @create          2023-06-27
// @downloadURL https://update.greasyfork.org/scripts/469550/table-copier.user.js
// @updateURL https://update.greasyfork.org/scripts/469550/table-copier.meta.js
// ==/UserScript==


(function() {
    "use strict";

    const SCRIPTS = [
        ["html2canvas", "https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js"]
    ];
    const BTN = `<button class="table-copier-btn" style="width: 70px; height: 30px;" onclick="copy_table(this)">复制表格</button>`;
    const BOOT_DELAY = 2000;

    /**
     * 元素选择器
     * @param {string} selector 
     * @returns {Array<HTMLElement>}
     */
    function $(selector) {
        const self = this?.querySelectorAll ? this : document;
        return [...self.querySelectorAll(selector)];
    }

    /**
     * 加载CDN脚本
     * @param {string} url 
     */
    async function load_script(url) {
        try {
            const code = await (await fetch(url)).text();
            Function(code)();
        } catch(e) {
            return new Promise(resolve => {
                console.error(e);
                // 嵌入<script>方式
                const script = document.createElement("script");
                script.src = url;
                script.onload = resolve;
                document.body.appendChild(script);
            });
        }
    }

    async function until_scripts_loaded() {
        return gather(SCRIPTS.map(
            // kv: [prop, url]
            kv => (async () => {
                if (window[kv[0]]) return;
                await load_script(kv[1]);
            })()
        ));
    }

    /**
     * 等待全部任务落定后返回值的列表
     * @param {Iterable<Promise>} tasks 
     * @returns {Promise<Array>} values
     */
    async function gather(tasks) {
        const results = await Promise.allSettled(tasks);
        const filtered = [];
        for (const result of results) {
            if (result.value) {
                filtered.push(result.value);
            }
        }
        return filtered;
    }

    /**
     * 递归的修正表内元素
     * @param {HTMLElement} elem 
     */
    function adjust_table(elem) {
        for (const child of elem.children) {
            adjust_table(child);

            for (const attr of child.attributes) {
                // 链接补全
                const name = attr.name;
                if (["src", "href"].includes(name)) {
                    child.setAttribute(name, child[name]);
                }
            }
        }
    }

    /**
     * canvas转blob
     * @param {HTMLCanvasElement} canvas 
     * @param {string} type
     * @returns {Promise<Blob>}
     */
    function canvas_to_blob(canvas) {
        return new Promise(
            resolve => canvas.toBlob(resolve, "image/png")
        );
    }

    /**
     * @param {HTMLTableCellElement} cell
     * @returns {string} 
     */
    function cell_to_text(cell) {
        return cell
            .textContent
            .replace(/\n/g, " ")
            .replace(/\t/g, "    ")
            .trim();
        // const children = cell.children;
        // if (children.length === 0) {
        //     return cell
        //         .textContent
        //         .replace(/\n/g, " ")
        //         .replace(/\t/g, "    ")
        //         .trim();
        // }

        // return [...children].map(
        //     (child) => cell_to_text(child, depth + 1)
        // ).join(" ".repeat(depth));
    }

    /**
     * 表格转tsv字符串
     * @param {HTMLTableElement} table 
     * @returns {string}
     */
    function table_to_tsv(table) {
        return [...table.rows].map((row) => {
            return [...row.cells].map((cell) => {
                return cell_to_text(cell);
            }).join("\t")
        }).join("\n");
    }

    /**
     * 以包含变量名getter属性的对象输出到控制台，延迟计算
     * @param {*} obj 
     */
    function log_as_getter(obj) {
        const name = Object.getOwnPropertyNames(obj)[0];
        const getter = {
            get [name]() {
                return obj[name];
            }
        };
        console.log(name + ":", getter);
    }

    /**
     * @param {HTMLTableElement} table 
     * @returns {Promise<Blob>} 
     */
    async function table_to_text_blob(table) {
        console.log("table to text");
        // table 转 tsv 格式文本
        const text = table_to_tsv(table);
        log_as_getter({ text });
        return new Blob([text], { type: "text/plain" });
    }

    /**
     * @param {HTMLTableElement} table 
     * @returns {Promise<Blob>} 
     */
    async function table_to_html_blob(table) {
        console.log("table to html");

        const _table = table.cloneNode(true);
        adjust_table(_table);
        return new Blob([_table.outerHTML], { type: "text/html" });
    }

    /**
     * @param {HTMLTableElement} table 
     * @returns {Promise<Blob>} 
     */
    async function table_to_image_blob(table) {
        console.log("table to image");

        let canvas;
        try {
            canvas = await window.html2canvas(table);
        } catch(e) {
            console.error(e);
        }
        log_as_getter({ canvas });
        if (!canvas) return;

        return canvas_to_blob(canvas);
    }

    /**
     * 使用过时的 execCommand 复制文本
     * @param {string} text 
     * @returns {Promise<string>}
     */
    async function copy_text_legacy(text) {
        return new Promise(resolve => {
            document.oncopy = event => {
                event.clipboardData.setData("text/plain", text);
                event.preventDefault();
                resolve();
            };
            document.execCommand("copy");
        });
    }

    /**
     * @param {Array<Blob>} blobs 
     * @returns {Object}
     */
    function merge_blobs_to_bundle(blobs) {
        const bundle = Object.create(null);
        for (const blob of blobs) {
            bundle[blob.type] = blob;
        }
        return bundle;
    }

    /**
     * @param {Array<Blob>} blobs 
     * @returns {Promise<void>}
     */
    function copy(blobs) {
        const bundle = merge_blobs_to_bundle(blobs);
        const item = new ClipboardItem(bundle);
        log_as_getter({ bundle });
        log_as_getter({ item });
        return navigator.clipboard.write([item]);
    }
    
    /**
     * @param {HTMLTableElement} table
     * @returns {Promise<void>} 
     */
    async function copy_table_as_multi_types(table) {
        const converts = [
            table_to_text_blob,
            table_to_html_blob,
            table_to_image_blob,
        ];
        
        const blobs = await gather(converts.map(
            convert => convert(table)
        ));

        try {
            await copy(blobs);
            alert("复制成功！");

        } catch(e) {
            console.error(e);
            alert("复制失败！");
        }
    }

    /**
     * @param {HTMLTableElement} table
     * @returns {Promise<void>} 
     */
    async function copy_table_as_text_legacy(table) {
        try {
            await copy_text_legacy(table_to_tsv(table));
            alert("复制成功！");
        } catch(e) {
            console.error(e);
            alert("复制失败！");
        }
    }

    /**
     * 异步的复制表格到剪贴板
     * @param {HTMLButtonElement} btn
     * @param {boolean} ret_val 是否返回值（tsv）而不是复制到剪贴板（默认 false）
     * @returns {Promise<null | string>}
     * 
     */
    async function copy_table(btn, ret_val=false) {
        const table = btn.closest("table");
        if (!table) {
            alert("出错了：按钮外部没有表格");
            return;
        }

        if (ret_val) {
            return table_to_tsv(table);
        }

        // 移除按钮
        $(".table-copier-btn").forEach(
            btn => btn.remove()
        );
        // 复制表格
        if (!navigator.clipboard) {
            await copy_table_as_text_legacy(table);
        } else {
            await copy_table_as_multi_types(table);
        }
        // 增加按钮
        add_btns();
        return null;
    }

    function add_btns() {
        for (const table of $("table")) {
            // 跳过隐藏的表格
            if (!table.getClientRects()[0]) continue;
            table.insertAdjacentHTML("afterbegin", BTN);
        }
    }

    async function main() {
        try {
            await until_scripts_loaded();
        } catch(e) {
            console.error(e);
        }

        window.copy_table = copy_table;
        add_btns();

        // 递归的注入自身到iframe
        $("iframe").forEach(iframe => {
            try {
                iframe.contentWindow.eval(main.toString());
            } catch(e) {}
        });
    };

    setTimeout(main, BOOT_DELAY);
})();