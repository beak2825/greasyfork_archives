// ==UserScript==
// @name         晋江小说下载
// @namespace    http://tampermonkey.net/
// @version      2024-09-18
// @description  支持下载晋江文学城小说(需要自定义解析字体加密)
// @author       You
// @match        https://m.jjwxc.net/book2/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jjwxc.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509057/%E6%99%8B%E6%B1%9F%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/509057/%E6%99%8B%E6%B1%9F%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    /**
     *  @typedef Chapter 章节信息
     *  @property {string} title 章节标题
     *  @property {string} url 章节地址
     *  @property {string[]} content 章节内容
     *  @property {string} html 章节网页
     *  @property {'init' | 'work' | 'ok' | 'fail'} status 章节状态
     */

    waitForDownload()
        .then(url => resolveIndex(url))
        .then(chapters => resolveChapters(chapters, 2))
        .then(chapters => saveChapters(chapters))
        .catch(err => console.error(err))
        .finally(() => window.location.reload());


    function waitForDownload() {
        let move = false;
        let x = 0, y = 0;
        // 创建按钮并设置样式
        const btn = document.createElement("button");
        Object.assign(btn.style, {
            position: "fixed",
            bottom: "20px", right: "20px",
            width: "60px", height: "60px",
            borderRadius: "50%"
        })
        btn.innerText = "下载"
        document.body.appendChild(btn);
        // 定义按钮移动事件
        btn.addEventListener("mousedown", event => {
            x = event.x;
            y = event.y;
            move = true;
        });
        document.addEventListener("mouseup", () => {
            move = false;
        });
        document.addEventListener("mousemove", event => {
            if (!move) {
                return;
            }
            btn.style.bottom = parseInt(btn.style.bottom.replace("px", "")) - event.y + y + "px";
            btn.style.right = parseInt(btn.style.right.replace("px", "")) - event.x + x + "px";
            x = event.x;
            y = event.y;
        });

        // 获取当前目录地址
        function findIndexUrl() {
            for (const a of document.querySelectorAll("a")) {
                if ("目录" === a.innerText) {
                    return a.href + "?more=0&whole=1";
                }
            }
            throw new Error("没找到目录地址");
        }

        return new Promise(resolve => {
            const url = findIndexUrl();
            btn.addEventListener("click", () => resolve(url));
        });
    }

    function readBlobAsText(blob, charset) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(blob, charset);
            reader.onload = () => resolve(reader.result);
            reader.onerror = err => reject(err);
        });
    }

    async function downloadPage(url, charset = "gbk") {
        const res = await fetch(url);
        // 读取文本
        if (res.status >= 200 && res.status < 300) {
            const blob = await res.blob();
            const text = await readBlobAsText(blob, charset);
            return "//@url=" + url + "\n" + text;
        }
        // 抛出异常
        const error = new Error(res.statusText);
        error.name = res.status.toString();
        error.response = res;
        throw error;
    }

    /**
     * 解析主页, 并提取出章节列表
     *
     * @param {string} indexUrl 主页地址
     * @returns {Promise<Chapter[]>} 章节列表
     */
    async function resolveIndex(indexUrl) {

        function numOfLinkCount(ele, map) {
            if (ele.nodeName === "A") {
                map.set(ele, 1);
                return 1;
            }
            let count = 0;
            for (const node of ele.children) {
                count += numOfLinkCount(node, map);
            }
            map.set(ele, count);
            return count;
        }

        function chapterOf(title, url) {
            return {title, url: url.split("?")[0], content: '', html: '', status: 'init'};
        }

        const html = await downloadPage(indexUrl);
        // 解析出文档对象
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        // 统计每个节点下的超链接个数
        const map = new Map();
        const count = numOfLinkCount(doc.body, map);
        // 查找主干节点
        const main = mainNode(doc.body, map, count);
        // 获取主干节点下的超链接, 并解析成章节对象
        const chapters = [];
        main.querySelectorAll('a').forEach(a => chapters.push(chapterOf(a.innerText, a.href)))
        return chapters;
    }

    /**
     * 查找主干节点
     *
     * @param {Element} ele 根节点
     * @param {Map<Element, number>} map 节点数值映射
     * @param {number} count 根节点数值
     * @returns {Element} 主干节点
     */
    function mainNode(ele, map, count) {
        const half = count / 2;
        for (const node of ele.children) {
            const num = map.get(node) || 0;
            if (num > half) {
                return mainNode(node, map, num);
            }
        }
        return ele;
    }

    function resolveChapters(chapters, limit = 5) {

        function findChapter(html) {
            const url = /@url=(.+?)\n/.exec(html)[1]
            for (const chapter of chapters) {
                if (chapter.url === url) {
                    chapter.html = html;
                    return chapter;
                }
            }
            // 不可能抛出的异常
            throw 'chapter not found';
        }

        return new Promise(resolve => {
            let working = 0, complete = 0;

            showProgress(chapters);

            function submit() {
                if (working >= limit || complete >= chapters.length) {
                    return;
                }
                for (const chapter of chapters.filter(o => o.status === 'init')) {
                    if (chapter.status !== 'init') {
                        continue;
                    }
                    chapter.status = 'work';
                    downloadPage(chapter.url)
                        .then(html => findChapter(html))
                        .then(chapter => renderAndGetContent(chapter))
                        .then(chapter => setFont(chapter))
                        .finally(() => {
                            ++complete === chapters.length && resolve(chapters);
                            working--;
                            submit();
                        });
                    if (++working >= limit) {
                        break;
                    }
                }
            }

            submit();
        });
    }

    function showProgress(chapters) {
        const dialog = document.createElement("dialog");
        dialog.style.width = "300px";
        dialog.id = "modal";
        dialog.innerText = "正在解析章节, 请稍等...";
        document.body.appendChild(dialog);
        // 显示对话框, 并每隔1秒钟刷新一次信息
        dialog.showModal();
        const id = setInterval(() => {
            const fail = chapters.filter(o => o.status === 'fail').length;
            const ok = chapters.filter(o => o.status === 'ok').length;
            dialog.innerText = `正在解析内容(${fail + ok}/${chapters.length}), 失败 ${fail}, 成功 ${ok}`;
            if (ok + fail === chapters.length) {
                dialog.close();
                document.body.removeChild(dialog);
                clearInterval(id);
            }
        }, 1000);
    }

    function renderAndGetContent(chapter) {

        return new Promise((resolve, reject) => {
            // 创建一个frame用于加载文档
            const iframe = document.createElement("iframe");
            document.body.appendChild(iframe);
            // 加载文档内容
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(removeImages(chapter.html));
            doc.close();
            // iframe加载完毕后执行
            iframe.onload = () => {
                clearAllInterval(iframe.contentWindow);
                try {
                    chapter.title = doc.querySelector('h2').innerText;
                    chapter.content = getContent(doc);
                    chapter.status = 'ok';
                    resolve(chapter);
                } catch (err) {
                    chapter.status = 'fail';
                    reject(err);
                } finally {
                    document.body.removeChild(iframe);
                }
            };
            // iframe加载失败
            iframe.onerror = (err) => {
                chapter.status = 'fail';
                document.body.removeChild(iframe);
                reject(err);
            }
        });
    }

    function removeImages(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        // 移除全部图片
        const arr = doc.querySelectorAll("img");
        for (let i = arr.length - 1; i >= 0; i--) {
            arr[i].remove();
        }
        // 获取网页文本
        return doc.documentElement.outerHTML;
    }

    function clearAllInterval(win) {
        // 清除全部定时器
        const id = win.setInterval(() => {
        }, 1000);
        for (let i = 0; i <= id; i++) {
            win.clearInterval(i);
        }
    }

    function getContent(doc) {

        function pseudoElement(node, style) {
            const content = window.getComputedStyle(node, style).getPropertyValue("content");
            return content.replaceAll("none", "").replaceAll("\"", "").trim();
        }

        function mainText(ele, result) {
            for (const node of ele.childNodes) {
                if ("script" === node.nodeName.toLowerCase()) {
                    continue;
                }
                if (node.nodeType === Node.TEXT_NODE) {
                    const str = node.wholeText.trim();
                    str.length > 0 && result.push(str);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const before = pseudoElement(node, "before");
                    before.length > 0 && result.push(before);
                    mainText(node, result);
                    const after = pseudoElement(node, "after");
                    after.length > 0 && result.push(after);
                }
                if (["br", "p"].includes(node.nodeName.toLowerCase())) {
                    result.push("\n");
                }
            }
            return result;
        }

        // 查找主干节点
        const main = doc.querySelector('.content_ul');
        // 收集主干节点下的全部文本
        return mainText(main, []);
    }

    function saveChapters(chapters) {
        const tmpName = /(?<=《).+(?=》)/.exec(document.title)[0].replace(/[/\\?%*:|"<>]/g, " ");
        const name = prompt("章节下载成功, 请输入小说名", tmpName);
        // 合并章节内容
        const content = mergeChapters(chapters);
        // 保存为文件
        const a = document.createElement("a");
        const url = URL.createObjectURL(new Blob([content], {type: "text/plain"}));
        a.href = url;
        a.download = name.endsWith(".txt") ? name : name + ".txt";
        a.click();
        URL.revokeObjectURL(url);
        // 清理章节对象
        for (let i = 0; i < chapters.length; i++) {
            chapters[i] = null;
        }
    }

    function mergeChapters(chapters) {
        const result = [];
        chapters.forEach(chapter => {
            result.push(chapter.title);
            chapter.status ? result.push(chapter.content.join('')) : result.push("下载失败: " + chapter.url);
        });
        const fail = chapters.filter(chapter => chapter.status === 'fail').length;
        fail > 0 && result.unshift(`下载失败(${fail}/${chapters.length})`);
        return result.join("\n")
    }

    function setFont(chapter) {
        if (!chapter.url.includes("/vip/")) {
            return chapter;
        }
        const group = /fonts\/(.+?)\.woff2/.exec(chapter.html);
        if (group) {
            chapter.content.unshift(`//@font=${group[1]}\n`);
        }
        return chapter;
    }
})();