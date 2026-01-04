// ==UserScript==
// @name         笔趣阁优化
// @namespace    https://gitee.com/linhq1999/OhMyScript
// @version      5.2
// @description  专注阅读
// @author       LinHQ
// @match        http*://www.shuquge.com/*.html
// @exclude      http*://www.shuquge.com/*index.html
// @match        http*://www.sywx8.com/*.html
// @match        http*://www.biqugetv.com/*.html
// @match        http*://www.bqxs520.com/*.html
// @match        https://www.dshfood.net/*.html
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/427726-gbk-url-js/code/GBK_URLjs.js?version=953098
// @inject-into  auto
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/434661/%E7%AC%94%E8%B6%A3%E9%98%81%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/434661/%E7%AC%94%E8%B6%A3%E9%98%81%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
'use strict';
/** 配置示例
* 建议在定制 search 函数时， rq 函数始终把参数写全
* "sites": [
*   {
*       "desc": "shuquge", 网站链接关键字
*       "url": "https://....", 网站首页链接
*       "main": "div.reader", 主要部分选择器
*       "title": ".reader h1", 标题选择器
*       "txt": "#content", 文字部分选择器
*       "toc": "dd a", 目录链接选择器
*       "tocJump": 12, 跳过前面多少章
*       "filter": ["div.header", "div.nav", "div.link"], 带有此选择器的元素将被删除
*       "txtfilter": ["shuqu"] 带有此关键字的行将被删除
*       "funcFilter"?: () => void, 自定义过滤器
*       "nodash"?: boolean, 判断是否应该在书籍详情页链接后加额外的斜杠
*       "search"?: (keywords: string, baseurl:string) => Promise<Link[]> 搜索行为
*   }
* ]
*/
(() => {
    // 缺省值，一般不用修改
    const lineHeight = 1.3;
    // const defaultFont = "楷体";
    const defaultFont = "Source Han Sans SC VF";
    let C = {
        "sites": [
            {
                "desc": "shuquge",
                "url": "https://www.shuquge.com/",
                "main": "div.reader",
                "title": ".reader h1",
                "txt": "#content",
                "toc": "dd a",
                "tocJump": 12,
                "filter": [
                    "div.header", "div.nav", "div.link", "img",
                    "#coupletleft", "#coupletright", "#HMRichBox"
                ],
                "txtfilter": ["shuqu"],
                "funcFilter": () => { var _a, _b; return (_b = (_a = fd(document, "#content")) === null || _a === void 0 ? void 0 : _a.previousSibling) === null || _b === void 0 ? void 0 : _b.remove(); }
            },
            {
                "desc": "sywx",
                "url": "https://www.sywx8.com/",
                "main": "div#container",
                "title": "div>h1",
                "toc": "li a",
                "tocJump": 0,
                "txt": "div#BookText",
                "filter": ["div.top", ".link.xb", "#footer"],
                "txtfilter": ["最快更新", "松语", "本章完", "本章未完"],
                // javascript 不支持 gbk 的 uri 编码，所以无法实现
                // 但是用 gbk.js 就不一样了
                "search": async (keywords, baseurl) => {
                    let links = [];
                    let doc = await rq({
                        "url": `https://www.sywx8.com/modules/article/search.php?searchkey=${$URL.encode(keywords)}`
                    }, 8000, "GBK");
                    for (let a of doc.querySelectorAll(".c_row .c_subject a")) {
                        // 这个网站比较特殊，链接默认是完整的
                        links.push({ "title": `(sywx) ${a.textContent}`, "href": attr(a, "href") });
                    }
                    return links;
                }
            },
            {
                "desc": "bqxs",
                "url": "http://www.bqxs520.com/",
                "main": ".box_con",
                "title": "div.content_read h1",
                "toc": "#list dd a",
                "tocJump": 9,
                "txt": "#content",
                "filter": [".ywtop", ".header", ".nav", ".bottem1", ".lm", "#page_set", ".bookname~.box_con"],
                "txtfilter": ["请记住本书", "http"],
                "search": async (keywords, baseurl) => {
                    let links = [];
                    let doc = await rq({
                        "method": "POST",
                        "headers": { "Content-Type": "application/x-www-form-urlencoded" },
                        "url": encodeURI(`http://www.bqxs520.com/case.php?m=search`),
                        "data": `&key=${encodeURI(keywords)}`
                    }, 7000, "UTF-8");
                    for (let a of doc.querySelectorAll(".l .s2 a")) {
                        links.push({ "title": `(bqxs) ${a.textContent}`, "href": concatURL(baseurl, attr(a, "href")) });
                    }
                    return links;
                }
            },
            {
                "desc": "biqugetv",
                "url": "https://www.biqugetv.com/",
                "main": ".box_con",
                "title": "div.content_read h1",
                "toc": "#list dd a",
                "tocJump": 0,
                "txt": "#content",
                "filter": [".ywtop", ".header", ".nav", ".bottem1", ".lm", "#page_set"],
                "txtfilter": [],
                "search": async (keywords, baseurl) => {
                    let links = [];
                    let doc = await rq({
                        "url": encodeURI(`https://www.biqugetv.com/search.php?keyword=${keywords}`)
                    }, 6000, "UTF-8");
                    for (let a of doc.querySelectorAll("h3 a")) {
                        links.push({ "title": `(biqugetv) ${a.textContent}`, "href": concatURL(baseurl, attr(a, "href")) });
                    }
                    return links;
                }
            },
            {
                "desc": "dshfood",
                "url": "https://www.dshfood.net/",
                "main": ".box_con",
                "title": "div.content_read h1",
                "toc": "#list dd a",
                "tocJump": 9,
                "txt": "#content",
                "filter": [".ywtop", ".header", ".nav", ".bottem1", "#page_set", "#content>div"],
                "txtfilter": ["笔趣阁"],
                "nodash": true,
                "funcFilter": () => document.querySelectorAll("img")
                    .forEach(e => { var _a; return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.remove(); }),
                "search": async (keywords, baseurl) => {
                    let links = [];
                    let doc = await rq({
                        "method": "POST",
                        "headers": {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "referer": "https://www.dshfood.net/so/"
                        },
                        "url": "https://www.dshfood.net/so/",
                        // 鉴于使用了 GBK 进行编码，不能再使用 URLSearchParams
                        "data": `?searchtype=articlename&searchkey=${$URL.encode(keywords)}&submit=`
                    }, 6000, "GBK");
                    for (let a of doc.querySelectorAll(".line a.blue")) {
                        links.push({ "title": `(dshfood) ${a.textContent}`, "href": concatURL(baseurl, attr(a, "href")) });
                    }
                    return links;
                }
            }
        ],
        "states": {
            "fontSize": 16,
            "lineHeight": 16 * lineHeight,
            "toc": false,
            "flow": false
        },
        "style": `
            body {
                background-color: #EAEAEF !important;
            }

            .bqg.inject.win {
                width: 55vw !important;
                min-width: 600px;
                border: 2px double gray !important;
                border-radius: 8px;
            }

            .bqg.inject.txt {
                font-family: Calibri,'${defaultFont}',serif!important;
                background-color: #EAEAEF !important;
                padding: 0.5em 1em !important;
                margin: 0.5em auto !important;
                width: auto !important;
                white-space: pre-wrap;
            }

            .bqg.inject.title {
                color: black;
                background-color: #EAEAEF;
                font-family: Calibri,'${defaultFont}',serif!important;
                cursor: pointer !important;
            }

            .bqg.inject.title:hover {
                color: #0258d8 !important;
            }
            
            .hq.inject.toc {
                font-family: Calibri,sans-serif;
                width: 275px;
                position: fixed;
                top: 30px;
                left: 8px;
                /*目录默认是关闭的*/
                transform: translateX(-300px);
                opacity: 0;
                padding: 5px;
                display: flex;
                flex-flow: column;
                box-shadow: #7b7b7b 5px 4px 5px;
                transition-property: transform, box-shadow, opacity;
                transition-duration: .5s;
                transition-timing-function:cubic-bezier(0.35, 1.06, 0.83, 0.99);
                background: rgb(246 246 246 / 60%);
                backdrop-filter: blur(2px);
                border-radius: 8px;
            }

            .hq.inject ul {
                height: 280px;
                width: 100%;
                /*offsetTop 计算需要*/
                position:relative;
                overflow: auto;
            }

            .hq.inject ul li {
                cursor: pointer;
                margin: 2px;
                width: 95%;
                padding: 1px 4px;
                font-size: 12px;
                border-radius: 4px;
            }

            .hq.inject ul li:hover {
                background: #0258d8;
                color: #f6f6f6;
            }

            .hq.inject.toc>h3 {
                font-size: 1.1rem;
                font-weight: bold;
                border-radius: 2px;
                align-self: center;
                cursor: pointer;
                margin: 4px 0 8px 0;
            }

            .hq.inject.toc>h3:hover {
                color: #ffa631 !important;
            }

            .hq.inject.search {
                font-family: Calibri,sans-serif;
                width: 275px;
                position: fixed;
                top: 30px;
                padding: 5px;
                display: flex;
                flex-flow: column;
                transition: right 0.5s cubic-bezier(0.35, 1.06, 0.83, 0.99);
                background: rgb(246 246 246 / 60%);
                border-radius: 8px;
            }

            .hq.inject.search input {
                margin: 8px auto;
                width: 95%;
            }
            `
    };
    // 查询已经保存的字体信息
    let savedStates = localStorage.getItem("bqg_cfg");
    // 检查是否存在已有设置且和当前版本相符
    let states;
    if (savedStates === null) {
        states = C.states;
        console.warn("当前状态已保存");
    }
    else {
        let cfg = JSON.parse(savedStates);
        let defaultStates = Object.keys(C.states);
        let cfg_ = Object.keys(cfg);
        let useSaved = true;
        // 检查键是否匹配
        if (defaultStates.length == cfg_.length) {
            for (let key of Object.keys(cfg)) {
                if (!defaultStates.includes(key)) {
                    useSaved = false;
                    break;
                }
            }
        }
        else {
            useSaved = false;
        }
        if (useSaved) {
            states = cfg;
        }
        else {
            states = C.states;
            console.warn("检测到版本变化，状态已重置");
        }
    }
    // 检测当前的网址，应用对应的设置
    let tmp = C.sites.filter(site => document.URL.includes(site.desc));
    if (tmp.length == 0) {
        console.warn("没有匹配的设置，脚本已终止！");
        return;
    }
    let currentSite = tmp[0];
    // 完成样式注入
    GM_addStyle(C.style);
    /**
     * 保存交互式状态
     */
    function saveStates() {
        localStorage.setItem("bqg_cfg", JSON.stringify(states));
    }
    /**
     * 上一章，同时移除所有 flow 拼接结果
     */
    function prevChapter() {
        var _a;
        (_a = fd(document, "a", "上一")) === null || _a === void 0 ? void 0 : _a.click();
    }
    /**
     * 下一章，同时移除所有 flow 拼接结果
     */
    function nextChapter() {
        var _a;
        (_a = fd(document, "a", "下一")) === null || _a === void 0 ? void 0 : _a.click();
    }
    /**
     * 异步，向下拼页
     * 绑定到事件上时务必注意重复触发的情况
     */
    async function concatNextCh() {
        var _a;
        let next = fd(document, "a", "下一");
        let prev = fd(document, "a", "上一");
        let currentText = fd(document, currentSite.txt);
        try {
            let doc = await rq({ url: next === null || next === void 0 ? void 0 : next.href });
            let text = fd(doc, currentSite.txt);
            // console.log(text.textContent)
            // 更好的性能
            currentText.insertAdjacentHTML("beforeend", "<br><hr style='border: unset;border-top: 1px solid gray; margin: ${states.lineHeight}px 0'>");
            currentText.insertAdjacentText("beforeend", txtFilter((_a = text.innerText) !== null && _a !== void 0 ? _a : "文本过滤错误", /(?![a-zA-Z0-9!.'"])\s+/));
            // /id/xxx_1.html -> /id/xxx_1
            let href = attr(next, "href").replace(/\.html$/, "");
            // 重新渲染目录，currentBookToc 不可能为 null
            renderTOC(JSON.parse(currentBookToc), ul, href);
            // 重设上一页和下一页按钮的链接
            prev.href = fd(doc, "a", "上一").href;
            next.href = fd(doc, "a", "下一").href;
        }
        catch (error) {
            currentText.innerText = currentText.innerText.concat("\n\n\t获取下一页错误，上下滚动以重新获取");
        }
    }
    // 目录切换
    function switchToc(open) {
        let toc = fd(document, ".hq.inject.toc");
        if (open) {
            toc.style.transform = "translateX(0)";
            toc.style.opacity = "1";
            toc.style.boxShadow = "box-shadow: #7b7b7b 5px 3px 4px 0px;";
            states.toc = true;
        }
        else {
            toc.style.transform = "translateX(-300px)";
            toc.style.opacity = "0";
            toc.style.boxShadow = "box-shadow: #7b7b7b 5px 2px 0px 0px;";
            states.toc = false;
        }
        saveStates();
    }
    // 目录开关
    function toggleToc() {
        if (states.toc) {
            switchToc(false);
        }
        else {
            switchToc(true);
        }
    }
    /**
     * 根据 site 中的条件进行过滤，同时将缩进统一
     *
     * @param itxt 需要过滤的，innerText 通用性最好
     * @param delim 默认的切分点，从网页解析得到的内容和 ajax 获取到的内容切分点不一致
     * @returns 过滤后字符串
     */
    function txtFilter(itxt, delim = /\n/g) {
        var _a;
        // innerText 相对于 textContent 保留了视觉上的换行（块的换行）
        return (_a = itxt === null || itxt === void 0 ? void 0 : itxt.split(delim)) === null || _a === void 0 ? void 0 : _a.filter(line => {
            if (/^\s*$/.test(line))
                return false;
            // 去除白行和包含的关键字
            for (const keyword of currentSite.txtfilter) {
                if (line.includes(keyword)) {
                    return false;
                }
            }
            return true;
        }).map(line => `${"　".repeat(2)}${line.trim()}`).join("\n\n");
    }
    if (states.flow) {
        // 变相 throttle 一下不然顶不住
        let loading = false;
        document.onscroll = async (_) => {
            if (!loading && chkBoundry(true, window.innerHeight * 0.75)) {
                loading = true;
                // 意思是上一次拼页完过1.5秒才允许继续拼页，避免在加载下一页时反复调用拼页函数
                // 效果比固定延迟要稳定
                await concatNextCh();
                setTimeout(() => { loading = false; }, 1500);
            }
        };
    }
    // 对可变部分产生影响
    let doInject = function () {
        var _a;
        // 执行元素过滤
        currentSite.filter.forEach(filter => { var _a; return (_a = document.querySelectorAll(filter)) === null || _a === void 0 ? void 0 : _a.forEach(ele => ele.remove()); });
        // 执行自定义过滤
        if (currentSite.funcFilter) {
            currentSite.funcFilter();
        }
        // 应用已经保存的状态
        let textWin = fd(document, currentSite.txt);
        textWin.setAttribute("style", `font-size:${states.fontSize}px;line-height:${states.lineHeight}px`);
        textWin.classList.add("bqg", "inject", "txt");
        // 执行文字过滤
        textWin.textContent = txtFilter((_a = textWin.innerText) !== null && _a !== void 0 ? _a : "文本过滤错误");
        let mainWin = fd(document, currentSite.main);
        mainWin.classList.add("bqg", "inject", "win");
        let title = fd(document, currentSite.title);
        title.title = "点击显示目录";
        title.classList.add("bqg", "inject", "title");
        title.onclick = (ev) => {
            toggleToc();
            // 避免跳到上一章
            // 比下面的更为具体，所以有效。
            ev.stopPropagation();
        };
        // 阻止双击事件被捕获（双击会回到顶部）
        document.body.ondblclick = (ev) => ev.stopImmediatePropagation();
        document.body.onclick = (ev) => {
            let root = document.documentElement;
            let winHeight = window.innerHeight;
            // 下半屏单击下滚，反之上滚
            if (ev.clientY > root.clientHeight / 2) {
                if (chkBoundry() && !states.flow)
                    nextChapter();
                window.scrollBy({ top: (window.innerHeight - lineHeight) * 1 });
            }
            else {
                if (chkBoundry(false)) {
                    prevChapter();
                }
                window.scrollBy({ top: (window.innerHeight - lineHeight) * -1 });
            }
        };
        document.body.onkeydown = (ev) => {
            switch (ev.key) {
                case "-":
                    states.fontSize -= 2;
                    textWin.style.fontSize = `${states.fontSize}px`;
                    states.lineHeight = states.fontSize * lineHeight;
                    textWin.style.lineHeight = `${states.lineHeight}px`;
                    saveStates();
                    break;
                case "=":
                    states.fontSize += 2;
                    textWin.style.fontSize = `${states.fontSize}px`;
                    states.lineHeight = states.fontSize * lineHeight;
                    textWin.style.lineHeight = `${states.lineHeight}px`;
                    saveStates();
                    break;
                case "j":
                    if (chkBoundry() && !states.flow) {
                        nextChapter();
                    }
                    else {
                        window.scrollBy({ top: window.innerHeight - states.lineHeight });
                    }
                    break;
                case "k":
                    // 考虑在 flow 模式下也允许上一章
                    if (chkBoundry(false) && !states.flow) {
                        prevChapter();
                    }
                    else {
                        window.scrollBy({ top: -1 * (window.innerHeight - states.lineHeight) });
                    }
                    break;
                case "h":
                    prevChapter();
                    break;
                case "l":
                    nextChapter();
                    break;
                case "t":
                    toggleToc();
                    break;
                case "s":
                    toggleSearch();
                    break;
                case "f":
                    states.flow = !states.flow;
                    saveStates();
                    break;
                default:
                    break;
            }
        };
    };
    // 先调用一次，后面是有变化时才会触发，避免有时无法起作用
    doInject();
    // 强力覆盖
    new MutationObserver((_, ob) => {
        doInject();
    }).observe(document.body, { childList: true });
    // 添加目录
    let toc = document.createElement("div");
    toc.className = "hq inject toc";
    toc.onclick = ev => ev.stopPropagation();
    // 已保存状态读取
    document.body.append(toc);
    if (states.toc)
        switchToc(true);
    // 目录状态指示灯
    let pointer = document.createElement("h3");
    // 当然也可以靠不同类名实现
    let pointerColors = { "loaded": "#afdd22", "loading": "#ffa631", "unload": "#ed5736" };
    pointer.title = "点击以重新加载目录";
    pointer.innerHTML = "目<span style='display: inline-block;width: 1em'></span>录";
    pointer.style.cursor = "pointer";
    pointer.style.color = pointerColors.unload;
    toc.append(pointer);
    // 目录列表
    let ul = document.createElement("ul");
    toc.append(ul);
    /**
     * 从源渲染目录到指定元素
     *
     * @param toc 目录源
     * @param ul 容器
     * @param href 定位链接，格式 http://host/id/chp.html 中最短为 /id/chp 部分
     */
    function renderTOC(toc, ul, href) {
        var _a;
        // 清空旧内容
        ul.innerHTML = "";
        let current = null;
        // 进度计数器
        let counter = 1;
        for (let lnk of toc) {
            let li = document.createElement("li");
            li.textContent = lnk.title;
            // 根据传入的 href 是否包含目录中的链接来判定，因为有的网站包含子页面 XXXX_1.html 形式
            // 比对时标准目录链接 lnk: /id/chp.html 之中，仅取用 chp
            let last = (_a = lnk.href.replace(".html", "")) !== null && _a !== void 0 ? _a : "";
            if (current == null && href.includes(last)) {
                li.innerHTML = `${lnk.title}<span style="flex: 1;"></span>${(counter / toc.length * 100).toFixed(1)}%`;
                current = li;
            }
            li.onclick = (ev) => {
                document.location.href = lnk.href;
                ev.stopPropagation();
            };
            ul.append(li);
            counter++;
        }
        // 渲染完修改指示灯状态
        pointer.style.color = pointerColors.loaded;
        // 滚动到当前位置，并高亮
        if (current !== null) {
            current.setAttribute("style", "display:flex;font-weight:bold;background: #0258d8;color: #f6f6f6;");
            ul.scrollTo({ top: current.offsetTop - 130 });
        }
    }
    /**
     * 获取目录信息
     *
     * @param currentBookLink 当前书的链接，用作存储的键
     * @param pointer 指示灯，在需要的时候修改状态
     */
    async function fetchTOC(currentBookLink, pointer) {
        var _a;
        // 修改指示灯状态
        pointer.style.color = pointerColors.loading;
        try {
            let doc = await rq({ url: currentBookLink });
            let tocs = doc.querySelectorAll(currentSite.toc);
            let data = [];
            // 序列化存储准备
            for (let link of tocs) {
                // 使用字面意义上的链接 /chapter.html 而不是 http://**/id/chapter.html 以减小存储量
                data.push({ "title": (_a = link.textContent) !== null && _a !== void 0 ? _a : "", "href": attr(link, "href") });
            }
            if (currentSite.tocJump)
                data = data.slice(currentSite.tocJump);
            // 缓存目录信息
            let stdata = JSON.stringify(data);
            sessionStorage.setItem(currentBookLink, stdata);
            // 更新变量，避免章节拼接时以为找不到
            currentBookToc = stdata;
            renderTOC(data, ul, href);
        }
        catch (_) {
            pointer.style.color = pointerColors.unload;
        }
    }
    let source = document.URL.split("/");
    source.pop();
    // 用来定位的 url
    let href = document.URL.replace(/\.html$/, "");
    // 最后加斜杠保险
    let currentBook = source.join("/");
    if (!currentSite.nodash) {
        currentBook += "/";
    }
    let currentBookToc = sessionStorage.getItem(currentBook);
    if (currentBookToc === null) {
        fetchTOC(currentBook, pointer);
    }
    else {
        renderTOC(JSON.parse(currentBookToc), ul, href);
    }
    // 单击指示灯刷新目录缓存
    pointer.onclick = _ => fetchTOC(currentBook, pointer);
    // 添加聚合搜索
    let searchBox = document.createElement("div");
    searchBox.onclick = ev => ev.stopPropagation();
    searchBox.onkeydown = ev => ev.stopPropagation();
    searchBox.className = "hq inject search";
    searchBox.style.right = "-300px";
    searchBox.innerHTML = `
    <input id="insearch" type="search" placeholder="至少输入两个字"/>
    <span style="align-self:center;margin-bottem: 4px;color: ${pointerColors.loaded}">已就绪</span>
    `;
    document.body.append(searchBox);
    let inputBox = fd(searchBox, "#insearch");
    let search_ul = document.createElement("ul");
    searchBox.append(search_ul);
    let search_pointer = fd(searchBox, "#insearch~span");
    // debounce 一下不然顶不住
    let timer = null;
    inputBox.oninput = _ => {
        if (timer !== null)
            clearTimeout(timer);
        timer = setTimeout(async () => {
            var _a, _b;
            // 放外面也可
            if (((_a = inputBox) === null || _a === void 0 ? void 0 : _a.value.length) < 2)
                return;
            // 更新指示灯
            search_pointer.textContent = `正在搜索：${inputBox.value}`;
            search_pointer.style.color = pointerColors.loading;
            let requests = [];
            let others = [{ "title": "没有搜索结果，也可以看看:", "href": "#" }];
            for (let s of C.sites) {
                if (s.search !== undefined) {
                    // 搜索开始
                    requests.push(s.search((_b = inputBox) === null || _b === void 0 ? void 0 : _b.value, s.url));
                }
                else {
                    others.push({ "title": s.desc, "href": s.url });
                }
            }
            let result_count = 0, failed = 0;
            let list = await Promise.allSettled(requests);
            // 获取结果后清空旧内容
            search_ul.innerHTML = "";
            for (let site of list) {
                if (site.status === "fulfilled") {
                    for (let lnk of site.value) {
                        let li = document.createElement("li");
                        li.textContent = lnk.title.trim();
                        li.onclick = ev => GM_openInTab(lnk.href, { active: true });
                        search_ul.append(li);
                        result_count++;
                    }
                }
                else {
                    failed++;
                }
            }
            // 处理一下没有结果的情况，把没有实现 search 的网站摆上去
            if (result_count === 0) {
                for (let o of others) {
                    let li = document.createElement("li");
                    li.textContent = o.title;
                    li.onclick = ev => GM_openInTab(o.href, { active: true });
                    search_ul.append(li);
                }
            }
            // 更新指示
            search_pointer.textContent = `搜索完成：${result_count} 条结果 [${failed} 错误]`;
            search_pointer.style.color = pointerColors.loaded;
        }, 1000);
    };
    // 搜索框开关
    function toggleSearch() {
        if (parseInt(searchBox.style.right) < 0) {
            searchBox.style.right = "8px";
        }
        else {
            searchBox.style.right = "-300px";
        }
    }
    /*
      以下是工具函数
     */
    /**
     * 发起请求
     *
     * @param details 油猴标准请求格式，onload,onerror,responseType 会被忽略
     * @param timeout 超时时间 默认：5000
     * @param encoding 请求数据的编码 默认：当前所在页面的编码
     * @returns Promise<Document>
     */
    function rq(details, timeout = 5000, encoding) {
        // 自动探测一手
        if (!encoding)
            encoding = document.characterSet;
        return new Promise((res, rej) => {
            details.onerror = rej;
            details.ontimeout = rej;
            details.timeout = timeout;
            details.responseType = "arraybuffer";
            details.onload = resp => {
                if (resp.status != 200)
                    rej();
                let decoder = new TextDecoder(encoding);
                res(new DOMParser()
                    .parseFromString(decoder.decode(resp.response), "text/html"));
            };
            GM_xmlhttpRequest(details);
        });
    }
    /**
     * 返回符合条件的第一个元素
     *
     * @param doc 被查找的文档
     * @param selector 选择器
     * @param text 可选 元素的文本（子字符串）
     * @returns 符合条件的元素
     */
    function fd(doc, selector, text) {
        var _a;
        if (text) {
            for (let e of doc.querySelectorAll(selector)) {
                if ((_a = e.textContent) === null || _a === void 0 ? void 0 : _a.includes(text)) {
                    return e;
                }
            }
        }
        else {
            return doc.querySelector(selector);
        }
        return null;
    }
    /**
     * 拼接 URL
     *
     * @param host 网站域名
     * @param path 一般是链接之中的相对路径
     * @returns 完整的 URL
     */
    function concatURL(host, path) {
        let url = new URL(host);
        url.pathname = path;
        return url.toString();
    }
    /**
     * 如果是 a 标签，且想要获取字面上的 href，必须使用此方法，不可以用 a.href
     *
     * @param ele 标签名
     * @param attr 属性名
     * @returns 属性值
     */
    function attr(ele, attr) {
        var _a;
        return (_a = ele.getAttribute(attr)) !== null && _a !== void 0 ? _a : "";
    }
    /**
     * 检查当前位置是否处于边界
     *
     * @param bottom 是否检查到达底部，否则检查是否处于顶部
     * @param range 距离底部多少，默认是 0（最底部）
     * @returns boolean
     */
    function chkBoundry(bottom = true, range = 0) {
        let root = document.documentElement;
        let winHeight = window.innerHeight;
        if (bottom) {
            return (root.scrollTop + winHeight + range >= root.scrollHeight);
        }
        else {
            return (root.scrollTop == 0);
        }
    }
})();
