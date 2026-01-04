// ==UserScript==
// @name          ZZULIOJ 同一页上选题、看题、提交
// @namespace     myt-zzuli-x-onSamePage
// @version       0.7.2
// @description   ZZULI 郑州轻工业大学在线评测系统，同一页上选题、看题、提交，方便使用
// @author        Myitian
// @license       MIT
// @match         *://acm.zzuli.edu.cn/problemset.php*
// @icon          http://acm.zzuli.edu.cn/favicon.ico
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/474616/ZZULIOJ%20%E5%90%8C%E4%B8%80%E9%A1%B5%E4%B8%8A%E9%80%89%E9%A2%98%E3%80%81%E7%9C%8B%E9%A2%98%E3%80%81%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/474616/ZZULIOJ%20%E5%90%8C%E4%B8%80%E9%A1%B5%E4%B8%8A%E9%80%89%E9%A2%98%E3%80%81%E7%9C%8B%E9%A2%98%E3%80%81%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

/**
 * GET 请求
 * @param {string} url 请求地址
 * @param {string} responseType 响应类型
 * @param {number} timeout 超时
 * @returns {Promise<XMLHttpRequest>} Promise 对象，其 resolve 和 reject 均传入请求所用的 XMLHttpRequest 对象
 */
function get(url, responseType = "document", timeout = 0) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.timeout = timeout;
        xhr.withCredentials = true;
        xhr.responseType = responseType;
        xhr.send();
        xhr.onload = () => {
            if (xhr.status < 300) { resolve(xhr); } else { reject(xhr); }
        }; xhr.ontimeout = () => reject(timeout);
    });
}

/**
 * @this {HTMLAnchorElement}
 * @param {Event} event
 */
function openSidebar(event) {
    event.preventDefault();
    MYT_ZZULI_X.dataset.id = this.dataset.id;
    MYT_ZZULI_X.className = "x-shown";
    refresh();
}

/**
 * @this {HTMLIFrameElement}
 */
function cleanDocument() {
    if (!this.contentWindow) {
        return;
    }
    /**
     * @type {?HTMLElement}
     */
    var e = this.contentWindow.document.querySelector(".container");
    if (e) {
        e.style.width = "100%";
    }
    e = this.contentWindow.document.querySelector("nav");
    if (e) {
        e.style.display = "none";
    }
    var es = this.contentWindow.document.querySelectorAll("a")
    for (var a of es) {
        if (!a.href.startsWith("javascript:")) {
            a.target = "_blank";
        }
    }
}

/**
 * @param {string} url
 * @param {HTMLElement} node
 */
function loadCss(url, node) {
    var styles = `@import url("${url}");`;
    var lnk = document.createElement("link");
    lnk.rel = "stylesheet";
    lnk.href = "data:text/css," + encodeURIComponent(styles);
    node.appendChild(lnk);
}

/**
 * @param {string} url
 * @param {HTMLElement} node
 * @returns {Promise}
 */
function loadScript(url, node) {
    var script = document.createElement("script");
    script.src = url;
    script.async = false;
    var callback = new Promise(resolve => script.addEventListener("load", resolve));
    node.appendChild(script);
    return callback;
}

/**
 * @param {string} content
 * @param {HTMLElement} node
 */
function loadScriptContent(content, node) {
    var script = document.createElement("script");
    script.innerHTML = content;
    node.appendChild(script);
}

/**
 * @param {HTMLElement} targetElement
 * @param {HTMLElement} buttonElement
 */
function toggleCustomElement(targetElement, buttonElement) {
    if (!(targetElement && buttonElement)) {
        return;
    }
    var c = targetElement.className;
    if (c.indexOf("x-hidden") >= 0) {
        targetElement.className = c.replace("x-hidden", "x-shown");
        buttonElement.title = "收起";
    } else if (c.indexOf("x-shown") >= 0) {
        targetElement.className = c.replace("x-shown", "x-hidden");
        buttonElement.title = "展开";
    } else {
        targetElement.className = c.trim().concat(" x-hidden");
        buttonElement.title = "展开";
    }
}

/**
 * @this {HTMLIFrameElement}
 */
function problemDocumentLoad() {
    if (!this.contentWindow) {
        return;
    }
    cleanDocument.call(this);
    var pid = new URLSearchParams(this.contentWindow.location.search).get("id")
    /**
     * @type {?HTMLSpanElement}
     */
    var uid = this.contentWindow.document.querySelector("#profile");
    /**
     * @type {HTMLDivElement}
     */
    var codeDiv = this.contentWindow.document.querySelector(".jumbotron");
    if (codeDiv && pid && uid && uid.innerText) {
        codeDiv.className = "panel panel-default x-shown";
        codeDiv.innerHTML = `
<div class="panel-heading x-with-buttons">
  <span>上次提交内容</span>
  <div class="x-button-container">
    <button id="myt-zzuli-x-toggle-last-submit" class="x-myt-button x-myt-toggle" title="收起"></button>
  </div>
</div>
`;
        get(`http://acm.zzuli.edu.cn/status.php?problem_id=${pid}&user_id=${uid.innerText}`).then(
            xhr => {
                /**
                * @type {Document}
                */
                var doc = xhr.response;
                var td = doc.querySelector("td");
                if (td) {
                    return get("http://acm.zzuli.edu.cn/showsource.php?id=" + td.innerText)
                }
            }
        ).then(
            xhr => {
                if (xhr instanceof XMLHttpRequest) {
                    /**
                     * @type {Document}
                     */
                    var doc = xhr.response;
                    var pre = doc.querySelector(".jumbotron pre");
                    codeDiv.appendChild(pre);
                    /**
                     * @type {NodeListOf<HTMLLinkElement>}
                     */
                    var links = doc.querySelectorAll(".jumbotron link");
                    for (var link of links) {
                        loadCss(link.href, codeDiv);
                    }
                    /**
                     * @type {NodeListOf<HTMLScriptElement>}
                     */
                    var scripts = doc.querySelectorAll(".jumbotron script[src]");
                    var callbacks = Array(scripts.length);
                    var i = 0;
                    for (var script of scripts) {
                        callbacks[i] = loadScript(script.src, codeDiv);
                    }
                    Promise.all(callbacks).then(() => {
                        loadScriptContent(`SyntaxHighlighter.config.space = " ";SyntaxHighlighter.highlight();`, codeDiv);
                    });
                } else {
                    throw "无已提交内容！";
                }
            }
        ).catch(
            e => {
                if (e instanceof XMLHttpRequest) {
                    codeDiv.innerHTML += `<div class="panel-body content">${e.status} ${e.statusText}</div>`;
                } else if (e instanceof Error || e instanceof DOMException) {
                    codeDiv.innerHTML += `<div class="panel-body content">${e.message}</div>`;
                } else if (typeof (e) == "number") {
                    codeDiv.innerHTML += `<div class="panel-body content">响应超时 ${e}</div>`;
                } else if (typeof (e) == "string") {
                    codeDiv.innerHTML += `<div class="panel-body content">${e}</div>`;
                }
            }
        ).finally(
            () => {
                var toggleLastSubmit = codeDiv.querySelector("#myt-zzuli-x-toggle-last-submit");
                toggleLastSubmit.addEventListener("click", () => toggleCustomElement(codeDiv, toggleLastSubmit));
                var style_overwrite = this.contentWindow.document.createElement("style");
                style_overwrite.innerHTML = `
.syntaxhighlighter {
  max-height: 25em !important;
}

.syntaxhighlighter a,
.syntaxhighlighter div,
.syntaxhighlighter code,
.syntaxhighlighter table,
.syntaxhighlighter table td,
.syntaxhighlighter table tr,
.syntaxhighlighter table tbody,
.syntaxhighlighter table thead,
.syntaxhighlighter table caption,
.syntaxhighlighter textarea {
  line-height: 1.25em !important;
}

.syntaxhighlighter .toolbar {
  right: 16px !important;
}

.panel-heading.x-with-buttons {
  display: flex;
  align-items: center;
}

.x-button-container {
  position: absolute;
  right: 2em;
}

button.x-myt-button {
  border: none;
  background: transparent no-repeat center center;
  width: 2em;
  height: 2em;
  border-radius: .3em;
  margin: .1em;
  cursor: pointer;
  transition: all 0.2s ease;
}

button.x-myt-button:active {
  background-color: #aaa;
}

button.x-myt-button:hover {
  background-color: #ccc;
}

.x-with-buttons .x-myt-toggle {
  transform: rotate(90deg);
}

.x-hidden .x-with-buttons .x-myt-toggle {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath stroke-linecap='round' d='M9 6l6 6 -6 6' fill='none' stroke-width='2' stroke='%23444'/%3E%3C/svg%3E");
}

.x-shown .x-with-buttons .x-myt-toggle {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath stroke-linecap='round' d='M15 6l-6 6 6 6' fill='none' stroke-width='2' stroke='%23444'/%3E%3C/svg%3E");
}

.x-hidden .panel-heading+div {
  max-height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
`;
                codeDiv.appendChild(style_overwrite);
            }
        )
    }
}

function toggle() {
    if (MYT_ZZULI_X.className == "x-hidden") {
        MYT_ZZULI_X.className = "x-shown";
        document.querySelector("#myt-zzuli-x-toggle").title = "收起";
    } else {
        MYT_ZZULI_X.className = "x-hidden";
        document.querySelector("#myt-zzuli-x-toggle").title = "展开";
    }
}

function refresh() {
    /**
     * @type {HTMLIFrameElement}
     */
    var problem = MYT_ZZULI_X.querySelector("#myt-zzuli-x-problem");
    /**
     * @type {HTMLIFrameElement}
     */
    var submitpage = MYT_ZZULI_X.querySelector("#myt-zzuli-x-submitpage");
    if (MYT_ZZULI_X.dataset.id) {
        problem.src = "http://acm.zzuli.edu.cn/problem.php?id=" + MYT_ZZULI_X.dataset.id;
        submitpage.src = "http://acm.zzuli.edu.cn/submitpage.php?id=" + MYT_ZZULI_X.dataset.id;
    } else {
        problem.src = "";
        submitpage.src = "";
    }
}

function settings() {
    var w = prompt("设置宽度", GM_getValue("myt-zzuli-x.width", "50%"));
    if (w) {
        MYT_ZZULI_X.style.setProperty("--width", w);
        GM_setValue("myt-zzuli-x.width", w);
    }
}

function newtab() {
    if (MYT_ZZULI_X.dataset.id) {
        window.open("http://acm.zzuli.edu.cn/problem.php?id=" + MYT_ZZULI_X.dataset.id, "_blank").focus();
    }
}

/**
 * 主函数
 */
function main() {
    /**
     * @type {NodeListOf<HTMLAnchorElement>}
     */
    var problems = document.querySelectorAll("td:nth-child(3)>.left>a");
    for (var problem of problems) {
        var i = problem.href.indexOf("id=");
        problem.dataset.id = problem.href.substring(i + 3);
        problem.addEventListener("click", openSidebar, true);
    }

    MYT_ZZULI_X.id = "myt-zzuli-x";
    MYT_ZZULI_X.className = "x-hidden";
    MYT_ZZULI_X.innerHTML = `
<div id="myt-zzuli-x-sidebar">
    <ul>
        <button id="myt-zzuli-x-toggle" class="x-myt-button x-myt-toggle" title="展开"></button>
        <button id="myt-zzuli-x-refresh" class="x-myt-button x-myt-refresh" title="刷新"></button>
        <button id="myt-zzuli-x-settings" class="x-myt-button x-myt-settings" title="设置"></button>
        <button id="myt-zzuli-x-newtab" class="x-myt-button x-myt-newtab" title="在新标签页打开题目页面"></button>
        <!--<button id="myt-zzuli-x-ext" class="x-myt-button x-myt-ext" title="扩展功能按钮（预留）"></button>-->
    </ul>
</div>
<div id="myt-zzuli-x-iframecontainer">
    <iframe id="myt-zzuli-x-problem"></iframe>
    <iframe id="myt-zzuli-x-submitpage"></iframe>
</div>
<style>
#myt-zzuli-x {
  --width: ${GM_getValue("myt-zzuli-x.width", "50%")};
  position: fixed;
  right: 0;
  top: 0px;
  width: var(--width);
  height: 100%;
  background: rgba(255, 255, 255, 0.5) none repeat scroll 0% 0%;
  z-index: 10;
  transition: all 0.5s ease;
}

#myt-zzuli-x.x-hidden {
  right: calc(-1*var(--width));
}

#myt-zzuli-x.x-shown {
  right: 0;
}

#myt-zzuli-x-sidebar {
  position: absolute;
  right: 100%;
  background: white;
  border: solid 1px #428BCA;
  border-right: none;
  border-radius: 5px 0 0 5px;
}

#myt-zzuli-x ul {
  padding: .1em;
  text-align: center;
  margin: .1em;
}

button.x-myt-button {
  border: none;
  background: #eee no-repeat center center;
  width: 2em;
  height: 2em;
  border-radius: .3em;
  margin: .1em;
  cursor: pointer;
  transition: all 0.2s ease;
}

button.x-myt-button:hover {
  background-color: #ccc;
}

button.x-myt-button:active {
  background-color: #aaa;
}

#myt-zzuli-x.x-hidden .x-myt-toggle {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath stroke-linecap='round' d='M15 6l-6 6 6 6' fill='none' stroke-width='2' stroke='%23444'/%3E%3C/svg%3E");
}

#myt-zzuli-x.x-shown .x-myt-toggle {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath stroke-linecap='round' d='M9 6l6 6 -6 6' fill='none' stroke-width='2' stroke='%23444'/%3E%3C/svg%3E");
}

#myt-zzuli-x .x-myt-refresh {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' stroke='%23444' fill='none' stroke-linecap='round' stroke-width='2'%3E%3Cpath d='M6.804 10a6 6 0 0 1 10.392 0m-3 0h3V7m0 7a6 6 0 0 1-10.392 0m3 0h-3v3'/%3E%3C/svg%3E");
}

#myt-zzuli-x .x-myt-settings {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' stroke='%23444'%3E%3Cg stroke-linecap='square' stroke-width='4'%3E%3Cpath d='M7 12H6'/%3E%3Cpath transform='rotate(45 12 12)' d='M7 12H6'/%3E%3Cpath d='M12 7V6'/%3E%3Cpath transform='rotate(45 12 12)' d='M12 7V6'/%3E%3Cpath d='M18 12h-1'/%3E%3Cpath transform='rotate(45 12 12)' d='M18 12h-1'/%3E%3Cpath d='M12 18v-1'/%3E%3Cpath transform='rotate(45 12 12)' d='M12 18v-1'/%3E%3C/g%3E%3Ccircle cx='12' cy='12' r='3' stroke-width='2' fill='none'/%3E%3C/svg%3E");
}

#myt-zzuli-x .x-myt-newtab {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' stroke='%23444' fill='none' stroke-linecap='round' stroke-width='2'%3E%3Cpath d='M6 18a9 9 0 0 1 9-9h3m-3-3l3 3-3 3'/%3E%3C/svg%3E");
}

#myt-zzuli-x-iframecontainer {
  height: 100%;
  width: 100%;
  border: solid 1px #428BCA;
}

#myt-zzuli-x iframe {
  height: 50%;
  width: 100%;
  display: block;
  border: solid 1px #428BCA;
}
</style>
`;
    GM_registerMenuCommand("切换侧边栏展开状态", toggle);
    GM_registerMenuCommand("刷新侧边栏", refresh);
    GM_registerMenuCommand("设置侧边栏宽度", settings);
    GM_registerMenuCommand("在新标签页打开题目页面", newtab);
    GM_registerMenuCommand("清除本地存储", () => GM_deleteValue("myt-zzuli-x.width"));
    MYT_ZZULI_X.querySelector("#myt-zzuli-x-toggle").addEventListener("click", toggle);
    MYT_ZZULI_X.querySelector("#myt-zzuli-x-refresh").addEventListener("click", refresh);
    MYT_ZZULI_X.querySelector("#myt-zzuli-x-settings").addEventListener("click", settings);
    MYT_ZZULI_X.querySelector("#myt-zzuli-x-newtab").addEventListener("click", newtab);
    MYT_ZZULI_X.querySelector("#myt-zzuli-x-problem").addEventListener("load", problemDocumentLoad);
    MYT_ZZULI_X.querySelector("#myt-zzuli-x-submitpage").addEventListener("load", cleanDocument);
    document.body.appendChild(MYT_ZZULI_X);
}

const MYT_ZZULI_X = document.createElement("div");
main();