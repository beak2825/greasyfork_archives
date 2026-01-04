// ==UserScript==
// @name         文泉书局助手-无空白页
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  适用于【文泉书局】，对文档截图，合并为PDF。
// @author       2690874578@qq.com
// @match        https://*.wqxuetang.com/deep/read/pdf?bid=*
// @match        https://*/deep/read/pdf?bid=*
// @require      https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://greasyfork.org/scripts/445312-wk-full-cli/code/wk-full-cli.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wqxuetang.com
// @grant        none
// @run-at       document-body
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/473852/%E6%96%87%E6%B3%89%E4%B9%A6%E5%B1%80%E5%8A%A9%E6%89%8B-%E6%97%A0%E7%A9%BA%E7%99%BD%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/473852/%E6%96%87%E6%B3%89%E4%B9%A6%E5%B1%80%E5%8A%A9%E6%89%8B-%E6%97%A0%E7%A9%BA%E7%99%BD%E9%A1%B5.meta.js
// ==/UserScript==


// import { utils } from "../utils";
(function() {
    "use strict";

    /**
     * 闭包内变量
    */
    const utils = wk$;
    const pnum_to_chars = new Map();
    let font_scale = 0.8;
    let last_begin = NaN;
    let last_end = NaN;
    

    function print(...args) {
        console.info("[wk]:", ...args);
    }


    /**
     * 添加字体（base64编码的字符串）到pdf，并使用
     * @param {"jsPDF"} doc jsPDF 文档对象
     * @param {string} font ttf 格式的字体数据
     * @param {string} name 字体名称，仅限小写字母和连字符
     */
    function use_font(doc, font, name) {
        const _name = name.replace(/[^a-z-]/g, "");
        if (!_name) utils.raise(`字体名称不合法：${name}，仅限小写字母和连字符`);
    
        doc.addFileToVFS(`${_name}-normal.ttf`, font);
        doc.addFont(`${_name}-normal.ttf`, _name, 'normal');
        doc.setFont(_name);
    }
    
    
    /**
     * 添加图像（水平拼接）到当前页面
     * @param {jsPDF} doc jsPDF 文档对象
     * @param {number} pn 目标页码
     * @param {HTMLImageElement[]} imgs 图像列表
     */
    async function add_imgs(doc, pn, imgs) {
        // blob url => arraybuffer
        const tasks = imgs.map(
            img => fetch(img.src).then(
                resp => resp.arrayBuffer()
            )
        );
        const buffer_list = await utils.gather(tasks);

        // 拿到图像宽度
        const w = imgs[0].naturalWidth;
        
        // 选取页面
        doc.setPage(pn);
        // 逐图绘制
        for (const [i, buffer] of buffer_list.entries()) {
            const bytes = new Uint8Array(buffer);
            doc.addImage(bytes, "WEBP", w * i, 0);
        }
    }
    
    
    /**
     * 图像容器转为排序好的图像列表
     * @param {HTMLDivElement} box 
     * @returns {HTMLImageElement[]}
     */
    function box_to_imgs(box) {
        const imgs = [...box.children];
        imgs.sort(
            (a, b) => parseFloat(a.style.left) - parseFloat(b.style.left)
        );
        return imgs;
    }
    
    
    /**
     * 根据第一页图像生成doc
     * @returns {Promise<{ doc: jsPDF, orientation: string, format: number[] }>}
     */
    async function init_doc() {
        // 加载 jspdf
        if (!window.jspdf) {
            const url = "https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js";
            await utils.load_web_script(url);
        }
    
        // 取得第一页图像
        const imgs = [...get_boxes()[0].children];
        const [w, h] = [imgs[0].naturalWidth, imgs[0].naturalHeight];
    
        // 设置页面
        const params = {
            orientation: "p",
            format: [w * imgs.length, h],
        };
        const doc = new window.jspdf.jsPDF({
            ...params,
            unit: "px",
            compress: true,
            hotfixes: ["px_scaling"],
        });
    
        // 使用中文字体
        if (window.hua_wen_fang_song) {
            use_font(doc, hua_wen_fang_song, "song");
        } else {
            alert("缺失中文字体！");
        }

        // 返回文档和页面设置
        return { doc, ...params, };
    }
    
    
    /**
     * hook xhr 原型，当请求页面文字时，结果会追加到 pnum_to_chars Map中 
     */
    function hook_xhr_for_text() {
        // 提取原属性
        const proto = XMLHttpRequest.prototype
        const { open } = proto;
    
        // 重写XHR属性
        Object.defineProperty(proto, "open", {
            writable: true,
            value: function (method, url, ...args) {
                // 如果请求目标是页面文本，则hook，截获结果
                if (
                    method.toUpperCase() === "GET" &&
                    /[/]page[?]bid=[0-9]+&pnum=[0-9]+&k=/.test(url)
                ) {
                    // 截获响应
                    this.addEventListener("load", () => {
                        // 提取响应
                        const page_texts = JSON.parse(this.responseText);
                        // 空响应直接退出
                        if (!page_texts?.data) return;

                        const chars = page_texts.data
                            .map(line => line.chars.map(char => { return {
                                size: char.height * font_scale,
                                text: char.char,
                                x: char.left,
                                y: char.top,
                                // 横向缩放比例
                                h_scale: char.width / (char.height * font_scale)
                            };})).flat(1);
    
                        // 提取url中的页码
                        const params = new URLSearchParams(
                            url.split("?")[1].split("&").map(seg => seg.split("="))
                        );
                        const pnum = parseInt(params.get("pnum"));
    
                        // 保存结果
                        pnum_to_chars.set(pnum, chars);
                        print(`提取了第 ${pnum} 页文本，共 ${chars.length} 字`);
                    });
                }
                return open.call(this, method, url, ...args);
            }
        });
    }
    

    /**
     * 添加文字到目标页面
     * @param {jsPDF} doc 
     * @param {number} pn 
     */
    function add_chars(doc, pn) {
        const chars = pnum_to_chars.get(pn);
        if (!chars) return;

        // 通用文字书写参数
        const opt = { 
            baseline: "top",
            renderingMode: "invisible",
        };

        // 选择页面
        doc.setPage(pn);
        // print("pn", pn, "chars[0]", chars[0]);

        // 逐字书写
        for (const char of chars) {
            // 先设置字号
            doc.setFontSize(char.size);
            // 然后增加文字
            try {
                doc.text(
                    char.text,
                    char.x,
                    char.y,
                    { horizontalScale: char.h_scale, ...opt }
                );
            } catch(e) {
                console.error(e);
                // debugger;
            }
        }
    }

    
    /**
     * 根据已预览页面生成PDF
     * @param {{ finished: number, all: number }} progress 
     * @returns {Promise<jsPDF>}
     */
    async function write_doc(progress) {
        // 初始化文档
        const { doc, orientation, format } = await init_doc();
    
        // 取得已预览页面的图像
        const boxes = get_boxes();
        
        const len = boxes.length;
        progress.all = len;
        print(`一共捕获了 ${len} 页非空页面`);
        
        // 准备任务队列
        const tasks = [];

        // 遍历已经预览的页面图像，绘制到文档上
        for (const [i, box] of boxes.entries()) {
            // 生成异步任务
            const task = (async() => {
                // 先绘制图像
                const imgs = box_to_imgs(box);
                await add_imgs(doc, i, imgs);

                // 再添加文字
                add_chars(doc, i);

                // 新增一页
                if (i < len - 1) {
                    doc.addPage(format, orientation);
                }

                // 向外部提交进度：已完成页数+1
                progress.finished++;
            })();

            // 添加任务到队列
            tasks.push(task);
        }
        // 等待任务全部完成
        await utils.gather(tasks);
        return doc;
    }


    /**
     * 导出PDF
     * @param {PointerEvent} event 
     */
    async function export_pdf(event) {
        if (!confirm("仅导出已经预览的页面，是否继续？")) return;

        const btn = event.target;
        const view_btn = utils.btn(2);
        // 禁用按钮
        btn.disabled = true;
        view_btn.disabled = true;

        let fin = 0;  // 保存已完成页数
        // 进度对象
        const progress = {
            all: 0,  // 总页数
            get finished () {
                return fin;
            },
            // 更新页码时同步展示到按钮上
            set finished (value) {
                fin = value;
                const text = `已绘制 ${value} / ${this.all} 页`;
                print(text);
                btn.textContent = text;
            }
        };

        // 绘制每页
        const doc = await write_doc(progress);
        // 取得文档名称
        const title = wk$(".read-header-title")[0].textContent.trim();
        // 文档对象转为字节串
        const buffer = doc.output("arraybuffer");
        // 根据自动浏览记录生成文件名
        const fname = isNaN(last_begin + last_end)
            ? `${title}.pdf`
            : `${title}_${last_begin}-${last_end + 1}.pdf`;
        // 下载
        utils.save(fname, buffer, "application/pdf");
        
        // 启用按钮
        view_btn.disabled = false;
        btn.disabled = false;
        btn.textContent = "导出PDF";
    }
    

    /**
     * 重设字体比例
     * @param {PointerEvent} _ 
     */
    function set_font_scale(_) {
        const new_scale = prompt(`请输入新的字体缩放比例（ 0 - 2 的小数），当前：${font_scale}`);
        // 取消设置
        if (!new_scale) return;
        
        // 数值合法化
        let valid_scale = parseFloat(new_scale);
        if (valid_scale <= 2 && valid_scale > 0) {
            font_scale = valid_scale;
            return;
        }
        alert(`输入的数值【${new_scale}】不符合要求`);
    }


    /**
     * 以 Image 的方式请求 url，返回 blob url
     * @param {string} url 
     * @returns {Promise<string>} blob_url
     */
    async function fetch_img(url) {
        const headers = new Headers({
            "Host": location.hostname,
            "Connection": "keep-alive",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
            "sec-ch-ua-mobile": "?0",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            "sec-ch-ua-platform": "\"Windows\"",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Dest": "image",
            "Referer": location.href,
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
        });
        
        const opt = {
            method: 'GET',
            headers: headers,
        };
        
        try {
            const resp = await fetch(url, opt);
            const blob = await resp.blob();
            const blob_url = URL.createObjectURL(blob);
            return blob_url; 
        } catch (error) {
            console.error(error);
        }
    }


    /**
     * @param {string} blob_url 
     * @returns {string}
     */
    function reset_url_host(blob_url) {
        const url = new URL(blob_url.slice(5));
        url.host = location.host;
        return "blob:" + url.href;
    }


    /**
     * @param {Set<string>} maintained 
     * @param {string} new_url
     */
    async function add_new_release_old(maintained, new_url) {
        // release old
        const urls_now = wk$(".page-lmg img").map(img => img.src);
        for (const url of maintained) {
            if (!urls_now.includes(url)) {
                
                URL.revokeObjectURL(url);
                maintained.delete(url);
                print(`释放了图像资源`, {
                    get _url() { return url; },
                    get url() { return reset_url_host(url) },
                });
            }
        }
        // add new
        maintained.add(new_url);
    }


    /**
     * hook Image 原型，会将响应转为 Blob url 作为 src，便于提取原数据
     */
    function hook_img_for_raw_data() {
        const proto = Image.prototype;
        const set_attr = proto.setAttribute;
        const maintained = new Set();
        
        proto.setAttribute = async function(name, value) {
            if (!(this instanceof Image && name === "src")) {
                set_attr.call(this, name, value);
                return;
            }
            
            // 仅当元素是Image且在设置src时才hook
            const url = await fetch_img(value);
            set_attr.call(this, "src", url);
            add_new_release_old(maintained, url);
        }
    }


    /**
     * 返回最大页码
     * @returns {number}
     */
    function get_max_pn() {
        return wk$("div[index]").length || 30;
    }


    /**
     * 取得全部加载好的图像容器
     * @returns {HTMLDivElement[]}
     */
    function get_boxes() {
        return wk$(".page-lmg")
            .filter(div => div.childElementCount);
    }


    /**
     * 浏览指定页码范围
     * @param {number} begin 
     * @param {number} end 
     */
    async function walk_through(begin, end) {
        const max_pn = get_max_pn();
        // 范围校验
        if (!(
            begin < end &&  // 起始页码 < 终止页码
            begin >= 1 &&  // 起始页码 >= 1
            end - begin <= 30 &&  // 页码范围 <= 30
            end <= max_pn  // 终止页码 <= 最大页码
        )) {
            // 如果范围校验失败，则退出
            utils.raise(`[${begin}, ${end}] 不是合法页码范围`);
        }

        // 记录到闭包内，便于生成文件名
        [last_begin, last_end] = [begin, end];
        // 取得每页图像数量
        const imgs_per_page = get_boxes()[0]?.childElementCount;
        if (!imgs_per_page) {
            utils.raise("页面结构异常，请稍后重试");
        }

        // 通过范围校验
        for (let i = begin; i <= end; i++) {
            const page = wk$(`div[index="${i}"]`)[0];
            page.scrollIntoView({ behavior: "smooth" });

            // 等待页面加载，最多等待 4秒/页
            for (let j = 0; j < 20; j++) {
                // 如果图像数量满足要求，则认为加载完成
                const imgs = page.querySelector(".page-lmg").childElementCount;
                if (imgs >= imgs_per_page) {
                    break;
                }
                await utils.sleep(200);
            }
        }
    }


    /**
     * 自动浏览30页
     * @param {PointerEvent} event 
     */
    async function view_30_pages(event) {
        const hint = isNaN(last_begin + last_end) ? "" : `\n上次结束于${last_end + 1}`;
        const begin_str = prompt("请输入起始页码（然后自动浏览 30 页）" + hint);
        // 取消浏览
        if (!begin_str) return;

        // 开始浏览
        // 先禁用按钮
        const btn = event.target;
        const pdf_btn = utils.btn(1);
        btn.disabled = true;
        pdf_btn.disabled = true;

        const max_pn = get_max_pn();
        const begin = parseInt(begin_str);
        const end = Math.min(begin + 28, max_pn);

        try {
            await walk_through(begin, end);
            alert("浏览完成");
        } catch(err) {
            console.error(err);
        }
        
        // 恢复按钮
        btn.disabled = false;
        pdf_btn.disabled = false;
    }

    
    /**
     * 文泉书局文档下载策略
     */
    function wqbook() {
        // hook 文字
        hook_xhr_for_text();
        // hook 图像
        hook_img_for_raw_data();
        
        // 创建按钮区
        utils.create_btns();
        
        // 设置按钮功能
        utils.onclick(export_pdf, 1, "导出PDF");
        utils.onclick(view_30_pages, 2, "自动浏览");
        utils.onclick(set_font_scale, 3, "重设字号缩放比");

        // 显示按钮
        utils.toggle_btn(2);
    }


    wqbook();


    /**
     * 更新日志
     * ---
     * (v0.0.2) [2023-08-08]
     * - 隐藏了【重设字号缩放比】按钮
     * - 优化了图像捕获方式，现在质量不变体积更小
     * ---
     * (v0.0.3) [2023-08-08]
     * - 新增了自动浏览功能（自动浏览30页）
     * ---
     * (v0.0.4) [2023-08-18]
     * - 优化资源释放
     * ---
     * (v0.0.5) [2023-08-18]
     * - 优化资源释放
     * ---
     * (v0.0.6) [2023-08-19]
     * - 调整网址匹配
     */
})();
