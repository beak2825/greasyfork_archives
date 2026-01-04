// ==UserScript==
// @name         搜索引擎切换 - Search Engine Switcher
// @namespace    https://ivanli.cc/
// @version      1.4.0
// @author       Ivan Li
// @description  A userscript to switch search engine with current keywords.
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyBzdHJva2U9ImN1cnJlbnRDb2xvciIgZmlsbD0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgaGVpZ2h0PSIxZW0iIHdpZHRoPSIxZW0iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xNSwxNiBMMjEsMjIgTDE1LDE2IFogTTEwLDE4IEMxMy44NjU5OTMyLDE4IDE3LDE0Ljg2NTk5MzIgMTcsMTEgQzE3LDcuMTM0MDA2NzUgMTMuODY1OTkzMiw0IDEwLDQgQzYuMTM0MDA2NzUsNCAzLDcuMTM0MDA2NzUgMywxMSBDMywxNC44NjU5OTMyIDYuMTM0MDA2NzUsMTggMTAsMTggWiBNMjAsMSBMMjAsNyBNMTcsNCBMMjMsNCI+PC9wYXRoPjwvc3ZnPg==
// @source       https://github.com/IvanLi-CN/TM-Search-Engine-Switcher
// @match        *://www.baidu.com/*
// @match        *://www.google.com/*
// @match        *://www.google.com.hk/*
// @match        *://www.bing.com/*
// @match        *://cn.bing.com/*
// @match        *://bing.com/*
// @match        *://www.sogou.com/*
// @match        *://duckduckgo.com/*
// @match        *://yandex.com/*
// @match        *://www.zhihu.com/*
// @match        *://search.bilibili.com/*
// @match        *://s.taobao.com/search*
// @match        *://github.com/*
// @match        *://crates.io/*
// @match        *://npmjs.com/*
// @match        *://www.npmjs.com/*
// @match        *://www.quora.com/search*
// @match        *://quora.com/search*
// @match        *://www.reddit.com/search*
// @match        *://reddit.com/search*
// @match        *://linux.do/*
// @match        *://www.linux.do/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/465246/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%20-%20Search%20Engine%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/465246/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%20-%20Search%20Engine%20Switcher.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_log = (() => typeof GM_log != "undefined" ? GM_log : void 0)();
  const indexCss = '/*! tailwindcss v4.1.14 | MIT License | https://tailwindcss.com */@layer properties{@supports ((-webkit-hyphens:none) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-divide-y-reverse:0;--tw-border-style:solid;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-sky-100:oklch(95.1% .026 236.824);--color-sky-300:oklch(82.8% .111 230.318);--color-sky-500:oklch(68.5% .169 237.323);--color-sky-700:oklch(50% .134 242.749);--color-sky-800:oklch(44.3% .11 240.79);--spacing:4px;--text-xl:20px;--text-xl--line-height:calc(1.75/1.25);--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::-moz-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-moz-placeholder{color:currentColor}::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::-moz-placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::file-selector-button{-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.absolute{position:absolute}.fixed{position:fixed}.top-1{top:calc(var(--spacing)*1)}.top-1\\/2{top:50%}.top-1\\/3{top:33.3333%}.-right-3{right:calc(var(--spacing)*-3)}.-left-16{left:calc(var(--spacing)*-16)}.left-4{left:calc(var(--spacing)*4)}.block{display:block}.flex{display:flex}.inline{display:inline}.table{display:table}.h-6{height:calc(var(--spacing)*6)}.w-6{width:calc(var(--spacing)*6)}.-translate-y-1{--tw-translate-y:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.rotate-180{rotate:180deg}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px*var(--tw-divide-y-reverse));border-bottom-width:calc(1px*calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-dotted>:not(:last-child)){--tw-border-style:dotted;border-style:dotted}:where(.divide-sky-300>:not(:last-child)){border-color:var(--color-sky-300)}.rounded{border-radius:4px}.rounded-full{border-radius:3.40282e38px}.bg-sky-100{background-color:var(--color-sky-100)}.bg-sky-100\\/50{background-color:#dff2fe80}@supports (color:color-mix(in lab,red,red)){.bg-sky-100\\/50{background-color:color-mix(in oklab,var(--color-sky-100)50%,transparent)}}.bg-sky-700{background-color:var(--color-sky-700)}.bg-sky-700\\/50{background-color:#0069a480}@supports (color:color-mix(in lab,red,red)){.bg-sky-700\\/50{background-color:color-mix(in oklab,var(--color-sky-700)50%,transparent)}}.px-4{padding-inline:calc(var(--spacing)*4)}.py-2{padding-block:calc(var(--spacing)*2)}.pr-0{padding-right:calc(var(--spacing)*0)}.pr-0\\.5{padding-right:calc(var(--spacing)*.5)}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-inherit{color:inherit}.text-sky-100{color:var(--color-sky-100)}.text-sky-700{color:var(--color-sky-700)}.no-underline{text-decoration-line:none}.opacity-50{opacity:.5}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.backdrop-blur{--tw-backdrop-blur:blur(8px);-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}@media (hover:hover){.hover\\:bg-sky-100:hover{background-color:var(--color-sky-100)}.hover\\:opacity-100:hover{opacity:1}}@media (prefers-color-scheme:dark){.dark\\:bg-sky-800\\/10{background-color:#0059861a}@supports (color:color-mix(in lab,red,red)){.dark\\:bg-sky-800\\/10{background-color:color-mix(in oklab,var(--color-sky-800)10%,transparent)}}.dark\\:text-sky-500{color:var(--color-sky-500)}@media (hover:hover){.dark\\:hover\\:bg-sky-800\\/20:hover{background-color:#00598633}@supports (color:color-mix(in lab,red,red)){.dark\\:hover\\:bg-sky-800\\/20:hover{background-color:color-mix(in oklab,var(--color-sky-800)20%,transparent)}}}}}@property --tw-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-z{syntax:"*";inherits:false;initial-value:0}@property --tw-divide-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}';
  var a;
  const d = (b) => (a = document.createElement("style"), a.append(b), a);
  const style = d(indexCss);
  const searchEngines = [
    {
      id: "v2ex",
      name: "V2EX",
      url: (w) => `https://www.google.com/search?q=site:v2ex.com/t%20${w}`,
      regUrl: /https:\/\/www.google.com\/search\?q=site:v2ex\.com\/t%20/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        const q = url.searchParams.get("q");
        return q?.replace("site:v2ex.com/t ", "") ?? null;
      }
    },
    {
      id: "linux-do",
      name: "LINUX DO",
      url: (w) => `https://linux.do/search?q=${w}`,
      regUrl: /(?:https?:\/\/)?(?:www\.)?linux\.do\/search/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("q");
      }
    },
    {
      id: "baidu",
      name: "百度搜索",
      url: (w) => `https://www.baidu.com/s?wd=${w}`,
      regUrl: /www.baidu.com/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("wd");
      }
    },
    {
      id: "google",
      name: "Google",
      url: (w) => `https://www.google.com/search?q=${w}`,
      regUrl: /www.google.com/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("q");
      }
    },
    {
      id: "bing",
      name: "Bing",
      url: (w) => `https://www.bing.com/search?q=${w}`,
      regUrl: /www.bing.com/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("q");
      }
    },
    {
      id: "bing-cn",
      name: "必应",
      url: (w) => `https://cn.bing.com/search?q=${w}`,
      regUrl: /cn.bing.com/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("q");
      }
    },
    {
      id: "duckduckgo",
      name: "DuckDuckGo",
      url: (w) => `https://duckduckgo.com/?q=${w}`,
      regUrl: /duckduckgo.com/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("q");
      }
    },
    {
      id: "yandex",
      name: "Yandex",
      url: (w) => `https://yandex.com/search/?text=${w}`,
      regUrl: /yandex.com/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("text");
      }
    },
    {
      id: "sogou",
      name: "搜狗",
      url: (w) => `https://www.sogou.com/web?query=${w}`,
      regUrl: /www.sogou.com/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("query");
      }
    },
    {
      id: "github",
      name: "GitHub",
      url: (w) => `https://github.com/search?q=${w}&ref=opensearch&type=repositories`,
      regUrl: /github.com/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("q");
      }
    },
    {
      id: "oshwhub",
      name: "OSHW Hub",
      url: (w) => `https://www.google.com/search?q=site:oshwhub.com%20${w}`,
      regUrl: /https:\/\/www.google.com\/search\?q=site:oshwhub\.com%20/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        const q = url.searchParams.get("q");
        return q?.replace("site:oshwhub.com ", "") ?? null;
      }
    },
    {
      id: "taobao",
      name: "淘宝",
      url: (w) => `https://s.taobao.com/search?q=${w}`,
      regUrl: /s.taobao.com/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("q");
      }
    },
    {
      id: "npm",
      name: "NPM",
      url: (w) => `https://www.npmjs.com/search?q=${w}`,
      regUrl: /www.npmjs.com/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("q");
      }
    },
    {
      id: "Crate",
      name: "Crate",
      url: (w) => `https://crates.io/search?q=${w}`,
      regUrl: /crates.io/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("q");
      }
    },
    {
      id: "zhihu",
      name: "知乎",
      url: (w) => `https://www.zhihu.com/search?q=${w}`,
      regUrl: /www.zhihu.com/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("q");
      }
    },
    {
      id: "bilibili",
      name: "哔哩哔哩",
      url: (w) => `http://search.bilibili.com/all?keyword=${w}`,
      regUrl: /search.bilibili.com/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("keyword");
      }
    },
    {
      id: "quora",
      name: "Quora",
      url: (w) => `https://www.quora.com/search?q=${w}`,
      regUrl: /(?:www\.)?quora\.com\/search/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("q");
      }
    },
    {
      id: "reddit",
      name: "Reddit",
      url: (w) => `https://www.reddit.com/search/?q=${w}`,
      regUrl: /(?:www\.)?reddit\.com\/search/i,
      getSearchWord: () => {
        const url = new URL(window.location.href);
        return url.searchParams.get("q");
      }
    }
  ];
  customElements.define(
    "engine-switch",
    class extends HTMLElement {
      connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const twStyle = style.cloneNode(true);
        shadow.appendChild(twStyle);
        function createIndexPanel(shadow2) {
          const indexPanel2 = shadow2.appendChild(document.createElement("div"));
          indexPanel2.setAttribute("id", "ivan_search-engine-switch");
          indexPanel2.className = "fixed -left-16 top-1/3 -translate-y-1/2 rounded shadow-lg flex flex-col transition-all bg-sky-100/50 backdrop-blur text-sky-700 dark:bg-sky-800/10 dark:text-sky-500";
          indexPanel2.style.zIndex = "999999";
          setTimeout(() => {
            indexPanel2.classList.remove("-left-16");
            indexPanel2.classList.add("left-4");
          });
          const ol = indexPanel2.appendChild(document.createElement("ol"));
          ol.className = "divide-dotted divide-y divide-sky-300";
          for (let i = 0; i < searchEngines.length; i++) {
            const engine = searchEngines[i];
            const li = ol.appendChild(document.createElement("li"));
            li.className = "hover:bg-sky-100 dark:hover:bg-sky-800/20 transition";
            const a2 = li.appendChild(document.createElement("a"));
            a2.className = `block px-4 py-2 switch-search-engine ${engine.id} block text-inherit no-underline`;
            a2.dataset.engineId = engine.id;
            a2.href = "javascript::void(0);";
            a2.text = engine.name;
          }
          const foldBtn = indexPanel2.appendChild(
            document.createElement("button")
          );
          foldBtn.className = "absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full shadow-lg bg-sky-700/50 backdrop-blur text-sky-100 flex items-center justify-center text-xl";
          const foldBtnIcon2 = foldBtn.appendChild(document.createElement("span"));
          foldBtnIcon2.className = " pr-0.5 transition";
          foldBtnIcon2.innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16.2426 6.34317L14.8284 4.92896L7.75739 12L14.8285 19.0711L16.2427 17.6569L10.5858 12L16.2426 6.34317Z" fill="currentColor"></path></svg>`;
          foldBtn.onclick = () => {
            console.log("click");
            const folded = foldBtnIcon2.classList.contains("rotate-180");
            if (folded) {
              unfoldPanel();
            } else {
              foldPanel();
            }
          };
          return {
            indexPanel: indexPanel2,
            foldBtnIcon: foldBtnIcon2,
            foldBtn
          };
        }
        const { indexPanel, foldBtnIcon } = createIndexPanel(shadow);
        function unfoldPanel() {
          indexPanel.classList.add("left-4");
          foldBtnIcon.classList.remove("rotate-180");
          indexPanel.classList.remove("opacity-50");
          indexPanel.classList.remove("hover:opacity-100");
          indexPanel.style.left = "";
        }
        function foldPanel() {
          indexPanel.classList.remove("left-4");
          indexPanel.classList.add("opacity-50");
          indexPanel.classList.add("hover:opacity-100");
          foldBtnIcon.classList.add("rotate-180");
          const rightBoardPosX = `-${indexPanel.offsetLeft + indexPanel.offsetWidth - 4}px`;
          indexPanel.style.left = rightBoardPosX;
        }
        function registerJump(shadow2) {
          const linkElems = shadow2.querySelectorAll(
            ".switch-search-engine"
          );
          for (const elem of linkElems) {
            elem.addEventListener("click", () => {
              const currUrl = new URL(window.location.href);
              const currSearchEngine = searchEngines.find(
                (it) => it.regUrl?.test(currUrl.toString())
              );
              if (!currSearchEngine) {
                _GM_log(
                  `The current page does not match the preset search engine. url: ${currUrl}`
                );
                return;
              }
              const words = currSearchEngine.getSearchWord();
              _GM_log(`match words: "${words}", url: ${currUrl}`);
              const engineId = elem.dataset.engineId;
              if (!engineId) return;
              const targetEngine = searchEngines.find((it) => it.id === engineId);
              if (!targetEngine) return;
              if (words == null) {
                const url = new URL(targetEngine.url(""));
                url.search = "";
                url.hash = "";
                url.pathname = "";
                elem.setAttribute("href", url.toString());
              } else {
                elem.setAttribute("href", targetEngine.url(words));
              }
            });
          }
        }
        registerJump(shadow);
        function autoHidePanel() {
          const currUrl = new URL(window.location.href);
          const currSearchEngine = searchEngines.find(
            (it) => it.regUrl?.test(currUrl.toString())
          );
          const keywords = currSearchEngine?.getSearchWord();
          if (keywords == null) {
            foldPanel();
          } else {
            unfoldPanel();
          }
        }
        setTimeout(() => {
          autoHidePanel();
        });
        const rerun = () => setTimeout(() => autoHidePanel(), 0);
        const origPush = history.pushState;
        const origReplace = history.replaceState;
        history.pushState = function(...args) {
          const ret = origPush.apply(this, args);
          rerun();
          return ret;
        };
        history.replaceState = function(...args) {
          const ret = origReplace.apply(this, args);
          rerun();
          return ret;
        };
        window.addEventListener("popstate", rerun);
        window.addEventListener("hashchange", rerun);
      }
    }
  );
  document.body.appendChild(document.createElement("engine-switch"));
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        if (!document.getElementsByTagName("engine-switch").length) {
          document.body.appendChild(document.createElement("engine-switch"));
          break;
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();