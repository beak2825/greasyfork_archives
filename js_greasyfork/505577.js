// ==UserScript==
// @name         Microsoft To-Do Markdown Preview Support - mstodo-md-preview
// @namespace    https://github.com/joisun
// @version      1.1.4
// @author       Zhongyi Sun
// @description  Microsoft To-Do Markdown Preview Support， microsoft to-do list markdown， microsoft todo markdown
// @license      MIT
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://to-do.live.com/&size=64
// @match        https://to-do.live.com/*
// @require      https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.10.0/highlight.min.js
// @require      https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js
// @resource     highlight.js/styles/tokyo-night-dark.min.css  https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.10.0/styles/tokyo-night-dark.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/505577/Microsoft%20To-Do%20Markdown%20Preview%20Support%20-%20mstodo-md-preview.user.js
// @updateURL https://update.greasyfork.org/scripts/505577/Microsoft%20To-Do%20Markdown%20Preview%20Support%20-%20mstodo-md-preview.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const e=document.createElement("style");e.textContent=o,document.head.append(e)})(' .markdown-body{color:#fffffff1;font-size:1em;font-weight:lighter;line-height:1.75;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}.markdown-body u{text-underline-offset:6px}.markdown-body hr{border:none;height:1px;background-color:#ffffff0a;margin:2.5em 0}.markdown-body abbr:where([title]){text-decoration:underline dotted}.markdown-body a{color:var(--fg-deeper);text-decoration:none;font-weight:500}.markdown-body b,.markdown-body code,.markdown-body kbd,.markdown-body samp,.markdown-body pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}.markdown-body sub{bottom:-.25em}.markdown-body sup{top:-.5em}.markdown-body blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}.markdown-body fieldset{margin:0;padding:0}.markdown-body legend{padding:0}.markdown-body ol,.markdown-body ul,.markdown-body menu{list-style:none;margin:0;padding:0}.markdown-body dialog{padding:0}.markdown-body textarea{resize:vertical}.markdown-body button,.markdown-body [role=button]{cursor:pointer}:disabled{cursor:default}.markdown-body [class~=lead]{color:#4b5563;font-size:1.25em;line-height:1.6;margin-top:1.2em;margin-bottom:1.2em}.markdown-body strong{font-weight:600;margin:0 .2em;color:#ffffffda}.markdown-body i{padding:0 .4em;color:inherit;font-style:italic;background-color:transparent}.markdown-body em{padding:0 .4em;background-color:#00f73685;font-style:normal}.markdown-body u{font-weight:600;font-weight:400;margin:0 .2em;border-radius:4px;padding:.1em .4em;text-underline-offset:.4em;text-decoration:underline 1px dashed;text-decoration-color:#f44}.markdown-body ol>li,.markdown-body ul>li{position:relative;padding-left:1.25em}.markdown-body ol>li:before{content:counter(list-item,var(--list-counter-style, decimal)) ".";position:absolute;font-weight:400;color:#6b7280;left:0}.markdown-body ul>li:before{content:"";position:absolute;background-color:#d1d5db;border-radius:50%;width:.375em;height:.375em;top:.6875em;left:.25em}.markdown-body blockquote{font-weight:500;font-style:italic;color:inherit;font-size:.9em;opacity:.8;border-left:solid #444;background-color:#4444444a;border-left-width:.4rem;quotes:"\u201C" "\u201D" "\u2018" "\u2019";margin-top:.6em;margin-bottom:.6em;margin-left:auto;padding:.5em .5em .5em 1em}.markdown-body blockquote p:first-of-type:before{content:open-quote}.markdown-body blockquote p:last-of-type:after{content:close-quote}.markdown-body h1,.markdown-body h2,.markdown-body h3,.markdown-body h4,.markdown-body h5,.markdown-body h6{color:#ffffffd0;font-family:ui-serif,Georgia,Cambria,Times New Roman,Times,serif;letter-spacing:.1em;margin:0}.markdown-body h1{font-weight:800;font-size:3rem;margin-top:0;margin-bottom:.8888889em;line-height:1.1111111}.markdown-body h2{font-weight:700;font-size:2.25rem;line-height:2.5rem;margin-top:2em;margin-bottom:1em}.markdown-body h3{font-weight:700;font-size:1.875rem;line-height:2.25rem;margin-top:1.6em;margin-bottom:.6em}.markdown-body h4{font-weight:700;font-size:1.5rem;line-height:2rem;margin-top:1.5em;margin-bottom:.5em}.markdown-body h5{font-weight:700;font-size:1.25rem;line-height:1.75rem;margin-top:1.5em;margin-bottom:.5em}.markdown-body h6{font-weight:700;font-size:1.125rem;line-height:1.75rem;margin-top:1.5em;opacity:.7;margin-bottom:.5em}.markdown-body h2+*{margin-top:0}.markdown-body figure figcaption{color:#6b7280;font-size:.875em;line-height:1.4285714;margin-top:.8571429em}.markdown-body code{color:inherit;font-weight:600;font-size:.875em}.markdown-body p code{font-weight:700;margin:0 .5em;font-size:1.1em}.markdown-body p code:before{content:"`"}.markdown-body p code:after{content:"`"}.markdown-body a code{color:#111827}.markdown-body pre code:before,.markdown-body pre code:after{content:none}.markdown-body table{width:100%;table-layout:auto;text-align:left;margin-top:2em;margin-bottom:2em;font-size:.875em;line-height:1.7142857;border-collapse:collapse}.markdown-body thead{color:inherit;font-weight:600;border-bottom-width:1px;border-bottom-color:#d1d5db}.markdown-body thead th{vertical-align:bottom;white-space:nowrap;padding-right:.5714286em;padding-bottom:.5714286em;padding-left:.5714286em}.markdown-body tbody tr{border-bottom:1px solid #ffffff0f}.markdown-body tbody tr:last-child{border-bottom-width:0}.markdown-body tbody td{vertical-align:top;padding:.5714286em}.markdown-body p{margin-top:.25em;margin-bottom:.25em}.markdown-body img{width:auto;height:auto;max-width:100%;margin-top:2em;margin-bottom:2em}.markdown-body video{margin-top:2em;margin-bottom:2em}.markdown-body figure{margin-top:2em;margin-bottom:2em}.markdown-body figure>*{margin-top:0;margin-bottom:0}.markdown-body h2 code{font-size:.875em}.markdown-body h3 code{font-size:.9em}.markdown-body ol,.markdown-body ul{margin-top:0;margin-bottom:1em;margin-left:1em;list-style-type:none}.markdown-body pre{border-radius:.375em;border-width:1px;overflow:auto;padding:1.25em;background-color:#00000073;margin:.2em .4em}.markdown-body pre code{color:inherit;background:none;font-size:.975em;font-weight:400} ');

(function (markdownit, hljs) {
  'use strict';

  function behindDebounce(func, duration) {
    let timer = null;
    return () => {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        func();
      }, duration);
    };
  }
  function waitForElement(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      const observer2 = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer2.disconnect();
        }
      });
      observer2.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("highlight.js/styles/tokyo-night-dark.min.css");
  const createBtnWithIcon = function(id, icon) {
    const btn = document.createElement("button");
    btn.id = id;
    btn.innerHTML = icon;
    btn.style.width = "auto";
    btn.style.height = "auto";
    btn.style.color = "inherit";
    btn.style.padding = ".2em .5em";
    btn.style.backgroundColor = "#555";
    btn.style.border = "none";
    btn.style.borderRadius = "4px";
    btn.style.display = "inline-flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.cursor = "pointer";
    btn.style.transition = "background-color 0.3s ease";
    btn.addEventListener("mouseenter", () => {
      btn.style.backgroundColor = "#444";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.backgroundColor = "#555";
    });
    return btn;
  };
  const listenPasteImg = () => {
    document.addEventListener("paste", (event) => {
      var _a;
      const items = (_a = event.clipboardData) == null ? void 0 : _a.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              var _a2;
              const base64Image = (_a2 = e.target) == null ? void 0 : _a2.result;
              const markdownImage = `![Image](${base64Image})`;
              insertMarkdownAtCursor(markdownImage);
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    });
    function insertMarkdownAtCursor(markdown) {
      const activeElement = document.activeElement;
      if (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT") {
        const inputElement = activeElement;
        const start = inputElement.selectionStart || 0;
        const end = inputElement.selectionEnd || 0;
        const text = inputElement.value;
        inputElement.value = text.slice(0, start) + markdown + text.slice(end);
        inputElement.selectionStart = inputElement.selectionEnd = start + markdown.length;
      } else if (activeElement.isContentEditable) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const markdownNode = document.createTextNode(markdown);
          range.insertNode(markdownNode);
          range.setStartAfter(markdownNode);
          range.setEndAfter(markdownNode);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  };
  const md = markdownit({
    // Enable HTML tags in source
    html: true,
    // Use '/' to close single tags (<br />)
    xhtmlOut: false,
    // Convert '\n' in paragraphs into <br>
    breaks: false,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: true,
    // Enable smartypants and other sweet transforms
    typographer: true,
    highlight: function(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {
        }
      }
      return "";
    }
  });
  const EDIT_BTN_ID = "mstodo:editBtn";
  const VIEW_BTN_ID = "mstodo:viewBtn";
  waitForElement(".ql-editor").then(() => {
    observerHandler();
    hideEditor();
    observe();
    clickListen();
    listenPasteImg();
  });
  let isEdit = false;
  function hideEditor() {
    if (isEdit) return;
    const editor = document.querySelector(".ql-editor");
    editor && (editor.style.height = "0px");
    const viewer = document.getElementById("tstodo:mdViewer");
    viewer && (viewer.style.height = "auto");
  }
  function showEditor() {
    isEdit = true;
    const editor = document.querySelector(".ql-editor");
    editor && (editor.style.height = "auto");
    const viewer = document.getElementById("tstodo:mdViewer");
    viewer && (viewer.style.height = "0px");
  }
  const initBtns = () => {
    var _a;
    if (document.getElementById("mstodo:btns")) return;
    const detailNote = document.querySelector(".detailNote");
    if (!detailNote) return;
    const edit = createBtnWithIcon(
      EDIT_BTN_ID,
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h7.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V10.4q0 .275-.162.475t-.413.3q-.4.15-.763.388T18 12.1l-5.4 5.4q-.275.275-.437.638T12 18.9V21q0 .425-.288.713T11 22zm8-1v-1.65q0-.2.075-.387t.225-.338l5.225-5.2q.225-.225.5-.325t.55-.1q.3 0 .575.113t.5.337l.925.925q.2.225.313.5t.112.55t-.1.563t-.325.512l-5.2 5.2q-.15.15-.337.225T16.65 22H15q-.425 0-.712-.287T14 21m6.575-4.6l.925-.975l-.925-.925l-.95.95zM14 9h4l-5-5l5 5l-5-5v4q0 .425.288.713T14 9"/></svg>`
    );
    const view = createBtnWithIcon(
      VIEW_BTN_ID,
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4zM790.2 326L602 137.8V326zM426.13 600.93l59.11 132.97a16 16 0 0 0 14.62 9.5h24.06a16 16 0 0 0 14.63-9.51l59.1-133.35V758a16 16 0 0 0 16.01 16H641a16 16 0 0 0 16-16V486a16 16 0 0 0-16-16h-34.75a16 16 0 0 0-14.67 9.62L512.1 662.2l-79.48-182.59a16 16 0 0 0-14.67-9.61H383a16 16 0 0 0-16 16v272a16 16 0 0 0 16 16h27.13a16 16 0 0 0 16-16z"/></svg>`
    );
    const btns = document.createElement("div");
    btns.id = "mstodo:btns";
    btns.style.display = "flex";
    btns.style.gap = ".5em";
    btns.style.justifyContent = "flex-end";
    btns.style.padding = "0.5em 1em";
    btns.appendChild(edit);
    btns.appendChild(view);
    detailNote.parentElement && ((_a = detailNote.parentElement) == null ? void 0 : _a.insertBefore(btns, detailNote));
    edit.addEventListener("click", () => {
      showEditor();
    });
    view.addEventListener("click", () => {
      isEdit = false;
      hideEditor();
    });
  };
  const createContainer = (qlEditor) => {
    var _a;
    if (!qlEditor) return;
    const container = document.createElement("div");
    container.id = "tstodo:mdViewer";
    container.classList.add("markdown-body");
    container.style = `
    overflow: hidden;
    background-color: inherit;
  `;
    container.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
    });
    qlEditor.parentElement && ((_a = qlEditor.parentElement) == null ? void 0 : _a.insertBefore(container, qlEditor));
    return container;
  };
  const observerHandler = behindDebounce(function() {
    const qlEditor = document.querySelector(".ql-editor");
    console.log("mstodo:editor existed: ", !!qlEditor);
    const mdViewer = document.getElementById("tstodo:mdViewer") || createContainer(qlEditor);
    console.log("mstodo:mdviewer existed: ", !!mdViewer);
    initBtns();
    if (!qlEditor) return;
    const mdContent = qlEditor.innerText;
    try {
      console.log("mstodo:parsing....");
      let result = md.render(mdContent.replace(/\u00A0/g, "  "));
      mdViewer.innerHTML = result;
      if (!isEdit) hideEditor();
    } catch (err) {
      console.error(err);
    }
  }, 100);
  const observer = new MutationObserver(observerHandler);
  function disconnect() {
    observer.disconnect();
  }
  function observe() {
    disconnect();
    observer.observe(document.querySelector(".ql-editor"), {
      characterData: true,
      // 观察目标节点内文本内容的变化
      childList: true,
      // 观察目标节点中直接子节点的增删
      subtree: true,
      // 观察所有后代节点
      characterDataOldValue: true
      // 记录文本内容的变化前信息
    });
  }
  function clickListen() {
    document.addEventListener("click", function(e) {
      const target = e.target;
      const parent = document.querySelector(".tasks") || document.querySelector(".grid-body");
      if (target.className === "taskItem-titleWrapper" || (parent == null ? void 0 : parent.contains(target))) {
        console.log("mstodo: click listener triggered");
        observerHandler();
        observe();
      }
    });
  }

})(markdownit, hljs);