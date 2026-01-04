// ==UserScript==
// @name         哔哩哔哩视频笔记
// @namespace    bilibili-video-note
// @version      0.0.7
// @author       monkey
// @description  哔哩哔哩视频学习笔记插件，极大丰富当前视频学习体验
// @license      MIT
// @icon         https://api.iconify.design/carbon:notebook-reference.svg
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.8/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js
// @require      https://cdn.jsdelivr.net/npm/md-editor-v3@4.1.1/lib/umd/index.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/468829/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/468829/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

(o=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=o,document.head.append(e)})(` .splitpanes{display:flex;width:100%;height:100%}.splitpanes--vertical{flex-direction:row}.splitpanes--horizontal{flex-direction:column}.splitpanes--dragging *{user-select:none}.splitpanes__pane{width:100%;height:100%;overflow:hidden}.splitpanes--vertical .splitpanes__pane{transition:width .2s ease-out}.splitpanes--horizontal .splitpanes__pane{transition:height .2s ease-out}.splitpanes--dragging .splitpanes__pane{transition:none}.splitpanes__splitter{touch-action:none}.splitpanes--vertical>.splitpanes__splitter{min-width:1px;cursor:col-resize}.splitpanes--horizontal>.splitpanes__splitter{min-height:1px;cursor:row-resize}.splitpanes.default-theme .splitpanes__pane{background-color:#f2f2f2}.splitpanes.default-theme .splitpanes__splitter{background-color:#fff;box-sizing:border-box;position:relative;flex-shrink:0}.splitpanes.default-theme .splitpanes__splitter:before,.splitpanes.default-theme .splitpanes__splitter:after{content:"";position:absolute;top:50%;left:50%;background-color:#00000026;transition:background-color .3s}.splitpanes.default-theme .splitpanes__splitter:hover:before,.splitpanes.default-theme .splitpanes__splitter:hover:after{background-color:#00000040}.splitpanes.default-theme .splitpanes__splitter:first-child{cursor:auto}.default-theme.splitpanes .splitpanes .splitpanes__splitter{z-index:1}.default-theme.splitpanes--vertical>.splitpanes__splitter,.default-theme .splitpanes--vertical>.splitpanes__splitter{width:7px;border-left:1px solid #eee;margin-left:-1px}.default-theme.splitpanes--vertical>.splitpanes__splitter:before,.default-theme.splitpanes--vertical>.splitpanes__splitter:after,.default-theme .splitpanes--vertical>.splitpanes__splitter:before,.default-theme .splitpanes--vertical>.splitpanes__splitter:after{transform:translateY(-50%);width:1px;height:30px}.default-theme.splitpanes--vertical>.splitpanes__splitter:before,.default-theme .splitpanes--vertical>.splitpanes__splitter:before{margin-left:-2px}.default-theme.splitpanes--vertical>.splitpanes__splitter:after,.default-theme .splitpanes--vertical>.splitpanes__splitter:after{margin-left:1px}.default-theme.splitpanes--horizontal>.splitpanes__splitter,.default-theme .splitpanes--horizontal>.splitpanes__splitter{height:7px;border-top:1px solid #eee;margin-top:-1px}.default-theme.splitpanes--horizontal>.splitpanes__splitter:before,.default-theme.splitpanes--horizontal>.splitpanes__splitter:after,.default-theme .splitpanes--horizontal>.splitpanes__splitter:before,.default-theme .splitpanes--horizontal>.splitpanes__splitter:after{transform:translate(-50%);width:30px;height:1px}.default-theme.splitpanes--horizontal>.splitpanes__splitter:before,.default-theme .splitpanes--horizontal>.splitpanes__splitter:before{margin-top:-2px}.default-theme.splitpanes--horizontal>.splitpanes__splitter:after,.default-theme .splitpanes--horizontal>.splitpanes__splitter:after{margin-top:1px}.md-editor .md-editor-preview{--md-theme-color: var(--md-color);--md-theme-color-reverse: #eee;--md-theme-color-hover: #eee;--md-theme-color-hover-inset: #ddd;--md-theme-link-color: #2d8cf0;--md-theme-link-hover-color: #73d13d;--md-theme-border-color: #e6e6e6;--md-theme-border-color-reverse: #bebebe;--md-theme-border-color-inset: #d6d6d6;--md-theme-bg-color: #fff;--md-theme-bg-color-inset: #ececec;--md-theme-bg-color-scrollbar-track: #e2e2e2;--md-theme-bg-color-scrollbar-thumb: rgba(0, 0, 0, .3019607843);--md-theme-bg-color-scrollbar-thumb-hover: rgba(0, 0, 0, .3490196078);--md-theme-bg-color-scrollbar-thumb-active: rgba(0, 0, 0, .3803921569);--md-theme-code-copy-tips-color: inherit;--md-theme-code-copy-tips-bg-color: #fff;--md-theme-code-active-color: #61aeee}.md-editor-dark .md-editor-preview{--md-theme-color: var(--md-color);--md-theme-color-reverse: #222;--md-theme-color-hover: #191919;--md-theme-color-hover-inset: #444;--md-theme-link-color: #2d8cf0;--md-theme-link-hover-color: #73d13d;--md-theme-border-color: #2d2d2d;--md-theme-border-color-reverse: #e6e6e6;--md-theme-border-color-inset: #5a5a5a;--md-theme-bg-color: #000;--md-theme-bg-color-inset: #111;--md-theme-bg-color-scrollbar-track: #0f0f0f;--md-theme-bg-color-scrollbar-thumb: #2d2d2d;--md-theme-bg-color-scrollbar-thumb-hover: #3a3a3a;--md-theme-bg-color-scrollbar-thumb-active: #3a3a3a;--md-theme-code-copy-tips-color: inherit;--md-theme-code-copy-tips-bg-color: #3a3a3a;--md-theme-code-active-color: #e6c07b}.md-editor-scrn span[rn-wrapper]{position:absolute;pointer-events:none;top:1em;font-size:100%;left:0;width:3em;letter-spacing:-1px;user-select:none;counter-reset:linenumber}.md-editor-scrn span[rn-wrapper]>span{display:block;pointer-events:none;counter-increment:linenumber}.md-editor-scrn span[rn-wrapper]>span:before{color:#999;display:block;padding-right:.5em;text-align:right;content:counter(linenumber)}.md-editor-scrn pre code{padding-left:3.5em!important}.md-editor .md-editor-admonition-note{--md-admonition-color: #448aff;--md-admonition-bg-color: #d5e2f9}.md-editor .md-editor-admonition-abstract{--md-admonition-color: #02b1ff;--md-admonition-bg-color: #d1eefb}.md-editor .md-editor-admonition-info{--md-admonition-color: #333;--md-admonition-bg-color: #e3e3e3}.md-editor .md-editor-admonition-tip{--md-admonition-color: #666;--md-admonition-bg-color: #e6e6e6}.md-editor .md-editor-admonition-success{--md-admonition-color: #00c852;--md-admonition-bg-color: #c1f1d5}.md-editor .md-editor-admonition-question{--md-admonition-color: #f0b400;--md-admonition-bg-color: #fff1dd}.md-editor .md-editor-admonition-warning{--md-admonition-color: #ff9104;--md-admonition-bg-color: #ffe9cc}.md-editor .md-editor-admonition-failure{--md-admonition-color: #c2185b;--md-admonition-bg-color: #ffd9d9}.md-editor .md-editor-admonition-danger{--md-admonition-color: #ff5252;--md-admonition-bg-color: #ffe4e4}.md-editor .md-editor-admonition-bug{--md-admonition-color: #f60357;--md-admonition-bg-color: #ffd3e2}.md-editor .md-editor-admonition-example{--md-admonition-color: #7c4dff;--md-admonition-bg-color: #e3d8ff}.md-editor .md-editor-admonition-quote{--md-admonition-color: #9e9e9e;--md-admonition-bg-color: #f0f0f0}.md-editor .md-editor-admonition-hint{--md-admonition-color: #009688;--md-admonition-bg-color: #cdf4f0}.md-editor .md-editor-admonition-caution{--md-admonition-color: #ffa726;--md-admonition-bg-color: #ffe7c4}.md-editor .md-editor-admonition-error{--md-admonition-color: #d32f2f;--md-admonition-bg-color: #ffd8d8}.md-editor .md-editor-admonition-attention{--md-admonition-color: #455a64;--md-admonition-bg-color: #cbefff}.md-editor-dark .md-editor-admonition-note{--md-admonition-color: #1262e7;--md-admonition-bg-color: #021d4c}.md-editor-dark .md-editor-admonition-abstract{--md-admonition-color: #058dc9;--md-admonition-bg-color: #002433}.md-editor-dark .md-editor-admonition-info{--md-admonition-color: #999;--md-admonition-bg-color: #212121}.md-editor-dark .md-editor-admonition-tip{--md-admonition-color: #888;--md-admonition-bg-color: #191818}.md-editor-dark .md-editor-admonition-success{--md-admonition-color: #00c551;--md-admonition-bg-color: #003014}.md-editor-dark .md-editor-admonition-question{--md-admonition-color: #cd9a00;--md-admonition-bg-color: #311d00}.md-editor-dark .md-editor-admonition-warning{--md-admonition-color: #ed8500;--md-admonition-bg-color: #3c2200}.md-editor-dark .md-editor-admonition-failure{--md-admonition-color: #d5125f;--md-admonition-bg-color: #3f0000}.md-editor-dark .md-editor-admonition-danger{--md-admonition-color: #d80505;--md-admonition-bg-color: #390000}.md-editor-dark .md-editor-admonition-bug{--md-admonition-color: #da0d54;--md-admonition-bg-color: #390013}.md-editor-dark .md-editor-admonition-example{--md-admonition-color: #7443ff;--md-admonition-bg-color: #140045}.md-editor-dark .md-editor-admonition-quote{--md-admonition-color: #9e9e9e;--md-admonition-bg-color: #2b2b2b}.md-editor-dark .md-editor-admonition-hint{--md-admonition-color: #00ae9e;--md-admonition-bg-color: #00423b}.md-editor-dark .md-editor-admonition-caution{--md-admonition-color: #db8609;--md-admonition-bg-color: #573300}.md-editor-dark .md-editor-admonition-error{--md-admonition-color: #df1a1a;--md-admonition-bg-color: #440000}.md-editor-dark .md-editor-admonition-attention{--md-admonition-color: #0f8bc7;--md-admonition-bg-color: #00354d}.md-editor-preview .md-editor-admonition{background-color:var(--md-admonition-bg-color);border:1px solid var(--md-admonition-color);border-radius:.5rem;color:var(--md-admonition-color);display:flow-root;font-size:14px;font-weight:400;margin:1rem 0;padding:1em 1em .5em;page-break-inside:avoid}.md-editor-preview .md-editor-admonition-title{border-top-left-radius:.5rem;border-top-right-radius:.5rem;margin:0;padding:0;position:relative;font-weight:700}.md-editor-preview .md-editor-admonition p{margin:.5em 0;padding:0}.md-editor-preview .md-editor-admonition p:first-of-type{margin-top:0}.md-editor-preview .md-editor-admonition+p:empty,.md-editor-preview .md-editor-admonition+p:empty+p:empty{display:none}.md-editor-mermaid{overflow-x:auto;display:none;text-align:center}[class=md-editor-mermaid][data-processed]{display:block}.prefix-katex-block{text-align:center;margin:20px}.prefix-katex-inline,.prefix-katex-block{display:none}.prefix-katex-inline[data-processed]{display:initial}.prefix-katex-block[data-processed]{display:block}.md-editor-preview .code-tabs{border-radius:5px;margin:20px 0}.md-editor-preview .code-tabs pre{margin:0;border-top-left-radius:0;border-top-right-radius:0}.md-editor-preview .code-tabs pre:before{display:none}.md-editor-preview .code-tabs pre code{border-top-left-radius:0;border-top-right-radius:0}.md-editor-preview .code-tabs pre code[language]:before{top:-23px;right:46px}.md-editor-preview .code-tabs pre .copy-button{top:-29px;right:16px}.md-editor-preview .code-tabs pre,.md-editor-preview .code-tabs input{display:none}.md-editor-preview .code-tabs input:checked+pre{display:block}.md-editor-preview .code-tabs label{color:var(--md-theme-code-block-color)}.md-editor-preview .code-tabs input:checked+label{color:var(--md-theme-code-active-color)}.md-editor-preview .code-tabs ul{box-sizing:border-box;white-space:nowrap;overflow:auto;user-select:none;width:100%;background-color:var(--md-theme-code-block-bg-color);margin:0;padding:1em 1em 0;border-top-left-radius:5px;border-top-right-radius:5px}.md-editor-preview .code-tabs li{line-height:1;list-style:none;display:inline-block;position:relative;vertical-align:super;margin:0}.md-editor-preview .code-tabs label{cursor:pointer;user-select:none;display:inline-block;margin:0 5px;font-size:14px}.md-editor article.default-theme{--md-theme-code-inline-color: #3594f7;--md-theme-code-inline-bg-color: rgba(59, 170, 250, .1);--md-theme-code-block-color: #a9b7c6;--md-theme-code-block-bg-color: #282c34;--md-theme-code-before-bg-color: var(--md-theme-code-block-bg-color);--md-theme-code-copy-tips-color: #141414}.md-editor-dark article.default-theme{--md-theme-code-inline-color: #3594f7;--md-theme-code-inline-bg-color: rgba(59, 170, 250, .1);--md-theme-code-block-color: #a9b7c6;--md-theme-code-block-bg-color: #1a1a1a;--md-theme-code-before-bg-color: var(--md-theme-code-block-bg-color);--md-theme-code-copy-tips-color: inherit}.default-theme code{color:var(--md-theme-code-inline-color);background-color:var(--md-theme-code-inline-bg-color);display:inline-block;padding:0 4px;border-radius:2px;line-height:22px;z-index:-1}.default-theme pre{position:relative;border-radius:5px;box-shadow:#0005 0 2px 2px}.default-theme pre code{padding:1em;background-color:var(--md-theme-code-block-bg-color);color:var(--md-theme-code-block-color);border-radius:0 0 5px 5px}.default-theme pre code>*{line-height:1.6}.default-theme pre code span[rn-wrapper]{top:calc(1em + 32px)}.default-theme pre:before{content:"";display:block;background:url(data:image/png;base64,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);height:32px;width:100%;background-size:40px;background-repeat:no-repeat;background-color:var(--md-theme-code-before-bg-color);margin-bottom:0;border-top-left-radius:5px;border-top-right-radius:5px;background-position:10px 10px}.default-theme .code-tabs pre code span[rn-wrapper]{top:1em}.default-theme h1,.default-theme h2,.default-theme h3,.default-theme h4,.default-theme h5,.default-theme h6{margin:1.4em 0 .8em;font-weight:700;color:var(--md-theme-color)}.default-theme h1{font-size:2em}.default-theme h2{font-size:1.5em}.default-theme h3{font-size:1.25em}.default-theme h4{font-size:1em}.default-theme h5{font-size:.875em}.default-theme h6{font-size:.85em}.default-theme img{margin:0 auto;max-width:100%;box-sizing:border-box;padding:5px;border:1px solid var(--md-theme-border-color);border-radius:3px}.default-theme blockquote img{border-color:var(--md-theme-border-color-inset)}.default-theme a{color:var(--md-theme-link-color);transition:color .3s}.default-theme a:hover{color:var(--md-theme-link-hover-color)}.default-theme ol,.default-theme ul{margin:.6em 0;padding-left:1.6em}.default-theme ol li,.default-theme ul li{line-height:1.6;margin:.5em 0}.default-theme p{line-height:1.6;margin:0;padding:.5rem 0}.default-theme p:empty{display:none}.default-theme blockquote{margin:20px 0;padding:0 1.2em;line-height:2em;background-color:var(--md-theme-bg-color-inset);border-left:5px solid #35b378;display:block}.md-editor default-theme{--md-theme-table-stripe-color: #fafafa}.md-editor-dark default-theme{--md-theme-table-stripe-color: #0c0c0c}.default-theme table{overflow:auto;border-spacing:0;border-collapse:collapse;margin-bottom:1em;margin-top:1em}.default-theme table tr th,.default-theme table tr td{word-wrap:break-word;padding:8px 14px;border:1px solid var(--md-theme-border-color)}.default-theme table tbody tr:nth-child(2n){background-color:var(--md-theme-table-stripe-color)}.default-theme table tbody tr:hover{background-color:var(--md-theme-color-hover)}.default-theme blockquote table{line-height:initial}.default-theme blockquote table tr th,.default-theme blockquote table tr td{border-color:var(--md-theme-border-color-inset)}.default-theme blockquote table tbody tr:nth-child(n){background-color:inherit}.default-theme blockquote table tbody tr:hover{background-color:var(--md-theme-color-hover-inset)}.default-theme{color:var(--md-theme-color)}.default-theme ::-webkit-scrollbar{width:6px;height:6px}.default-theme ::-webkit-scrollbar-corner,.default-theme ::-webkit-scrollbar-track{background-color:var(--md-theme-bg-color-scrollbar-track);border-radius:2px}.default-theme ::-webkit-scrollbar-thumb{border-radius:2px;background-color:var(--md-theme-bg-color-scrollbar-thumb)}.default-theme ::-webkit-scrollbar-button:vertical{display:none}.default-theme ::-webkit-scrollbar-thumb:vertical:hover{background-color:var(--md-theme-bg-color-scrollbar-thumb-hover)}.default-theme ::-webkit-scrollbar-thumb:vertical:active{background-color:var(--md-theme-bg-color-scrollbar-thumb-active)}.default-theme h1,.default-theme h2,.default-theme h3,.default-theme h4,.default-theme h5,.default-theme h6{position:relative;word-break:break-all}.default-theme h1 a,.default-theme h2 a,.default-theme h3 a,.default-theme h4 a,.default-theme h5 a,.default-theme h6 a,.default-theme h1 a:hover,.default-theme h2 a:hover,.default-theme h3 a:hover,.default-theme h4 a:hover,.default-theme h5 a:hover,.default-theme h6 a:hover{color:inherit}.default-theme ol>li{list-style:decimal}.default-theme ul>li{list-style:disc}.default-theme ol .task-list-item,.default-theme ul .task-list-item{list-style-type:none}.default-theme ol .task-list-item input,.default-theme ul .task-list-item input{margin-left:-1.5em;margin-right:.1em}.default-theme a{text-decoration:none}.default-theme pre,.default-theme code{font-family:source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;font-size:14px}.default-theme pre{margin:20px 0}.default-theme pre code{display:block;line-height:1;overflow:auto}.default-theme pre code .code-block{display:inline-block;width:100%;overflow:auto;vertical-align:bottom}.default-theme pre code[language]:before{content:attr(language);font-size:12px;position:absolute;top:11px;right:40px;line-height:1;z-index:1}.default-theme .copy-button{color:var(--md-theme-code-block-color);position:absolute;font-size:12px;top:5px;right:7px;line-height:1;cursor:pointer;z-index:1}.default-theme .copy-button:before{content:attr(data-tips);color:var(--md-theme-code-copy-tips-color);background-color:var(--md-theme-code-copy-tips-bg-color);position:absolute;font-size:12px;font-family:sans-serif;width:max-content;text-align:center;padding:4px;border-radius:2px;box-shadow:0 0 2px #0003;left:0;top:50%;transform:translate(-100%,-50%)}.default-theme .copy-button:after{content:"";color:var(--md-theme-code-copy-tips-bg-color);position:absolute;width:0;height:0;border:5px solid rgba(0,0,0,0);border-right-width:0;border-left-color:currentColor;left:-2px;top:50%;transform:translateY(-50%);filter:drop-shadow(4px 0 2px rgba(0,0,0,.2))}.default-theme .copy-button:before,.default-theme .copy-button:after{visibility:hidden;transition:.3s}.default-theme .copy-button:hover:before,.default-theme .copy-button:hover:after{visibility:visible}.default-theme hr{height:1px;margin:10px 0;border:none;border-top:1px solid var(--md-theme-border-color)}.default-theme figure{margin:0 0 1em;display:inline-flex;flex-direction:column;text-align:center}.default-theme figure figcaption{color:var(--md-theme-color);font-size:.875em;margin-top:5px}.default-theme .md-editor-mermaid{line-height:1}.md-editor article.vuepress-theme{--md-theme-code-inline-color: #d63200;--md-theme-code-inline-bg-color: #f8f8f8;--md-theme-code-block-color: #747384;--md-theme-code-block-bg-color: #f8f8f8}.md-editor-dark article.vuepress-theme{--md-theme-code-inline-color: #e06c75;--md-theme-code-inline-bg-color: #1a1a1a;--md-theme-code-block-color: #999;--md-theme-code-block-bg-color: #1a1a1a}.vuepress-theme code{color:var(--md-theme-code-inline-color);padding:3px 5px;margin:0 2px;border-radius:2px;background-color:var(--md-theme-code-inline-bg-color)}.vuepress-theme pre{border-radius:2px;position:relative;font-size:.875em;margin:1em 0;background-color:var(--md-theme-code-block-bg-color)}.vuepress-theme pre code{overflow-x:auto;color:var(--md-theme-code-block-color);white-space:pre;padding:22px 1em;background-color:var(--md-theme-code-block-bg-color)}.vuepress-theme pre code>*{line-height:1.6}.vuepress-theme pre code span[rn-wrapper]{top:22px}.md-editor article.vuepress-theme{--md-theme-heading-color: #273849}.md-editor-dark article.vuepress-theme{--md-theme-heading-color: #999}.vuepress-theme h1,.vuepress-theme h2,.vuepress-theme h3,.vuepress-theme h4,.vuepress-theme h5,.vuepress-theme h6{font-weight:600;color:var(--heading-color);line-height:1.45;position:relative;margin-top:1em}.vuepress-theme h1{font-size:2.2em;margin:1em 0}.vuepress-theme h2{font-size:1.65em;padding-bottom:.3em;border-bottom:1px solid var(--md-theme-border-color)}.vuepress-theme h3{line-height:1.35em}.vuepress-theme img{max-width:100%}.vuepress-theme a{color:#42b983;font-weight:600}.vuepress-theme ul,.vuepress-theme ol{position:relative;padding-left:1.25em;line-height:1.4em;margin:1.2em 0;z-index:1}.vuepress-theme ul li,.vuepress-theme ol li{margin:1.2em 0}.vuepress-theme p{word-spacing:.05em;line-height:1.6em;margin:1.2em 0;position:relative}.vuepress-theme p:empty{display:none}.vuepress-theme blockquote{margin:2em 0;padding-left:20px;border-left:4px solid #42b983}.vuepress-theme blockquote p{margin-left:0;margin-top:1.2em;margin-bottom:0;padding:0}.md-editor article.vuepress-theme{--md-theme-table-border-color: #dfe2e5;--md-theme-table-bg-color: #f6f8fa}.md-editor-dark article.vuepress-theme{--md-theme-table-border-color: #2d2d2d;--md-theme-table-bg-color: #0c0c0c}.vuepress-theme table{border-collapse:collapse;margin:1rem 0;display:block;overflow-x:auto}.vuepress-theme table tr{border-top:1px solid var(--md-theme-table-border-color)}.vuepress-theme table tr th,.vuepress-theme table tr td{border:1px solid var(--md-theme-table-border-color);padding:.6em 1em}.vuepress-theme table tr:nth-child(2n){background-color:var(--md-theme-table-bg-color)}.md-editor .vuepress-theme{--md-theme-color: #304455}.md-editor-dark .vuepress-theme{--md-theme-color: #999}.vuepress-theme{font-size:16px;color:var(--md-theme-color)}.vuepress-theme ::-webkit-scrollbar{width:6px;height:6px}.vuepress-theme ::-webkit-scrollbar-corner,.vuepress-theme ::-webkit-scrollbar-track{background-color:var(--md-theme-bg-color-scrollbar-track);border-radius:2px}.vuepress-theme ::-webkit-scrollbar-thumb{border-radius:2px;background-color:var(--md-theme-bg-color-scrollbar-thumb)}.vuepress-theme ::-webkit-scrollbar-button:vertical{display:none}.vuepress-theme ::-webkit-scrollbar-thumb:vertical:hover{background-color:var(--md-theme-bg-color-scrollbar-thumb-hover)}.vuepress-theme ::-webkit-scrollbar-thumb:vertical:active{background-color:var(--md-theme-bg-color-scrollbar-thumb-active)}.vuepress-theme h1,.vuepress-theme h2,.vuepress-theme h3,.vuepress-theme h4,.vuepress-theme h5,.vuepress-theme h6{position:relative;word-break:break-all}.vuepress-theme h1 a,.vuepress-theme h2 a,.vuepress-theme h3 a,.vuepress-theme h4 a,.vuepress-theme h5 a,.vuepress-theme h6 a,.vuepress-theme h1 a:hover,.vuepress-theme h2 a:hover,.vuepress-theme h3 a:hover,.vuepress-theme h4 a:hover,.vuepress-theme h5 a:hover,.vuepress-theme h6 a:hover{color:inherit}.vuepress-theme ol>li{list-style:decimal}.vuepress-theme ul>li{list-style:disc}.vuepress-theme ol .task-list-item,.vuepress-theme ul .task-list-item{list-style-type:none}.vuepress-theme ol .task-list-item input,.vuepress-theme ul .task-list-item input{margin-left:-1.5em;margin-right:.1em}.vuepress-theme a{text-decoration:none}.vuepress-theme pre,.vuepress-theme code{font-family:source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;font-size:14px}.vuepress-theme pre{margin:20px 0}.vuepress-theme pre code{display:block;line-height:1;overflow:auto}.vuepress-theme pre code .code-block{display:inline-block;width:100%;overflow:auto;vertical-align:bottom}.vuepress-theme pre code[language]:before{content:attr(language);font-size:12px;position:absolute;top:11px;right:40px;line-height:1;z-index:1}.vuepress-theme .copy-button{color:var(--md-theme-code-block-color);position:absolute;font-size:12px;top:5px;right:7px;line-height:1;cursor:pointer;z-index:1}.vuepress-theme .copy-button:before{content:attr(data-tips);color:var(--md-theme-code-copy-tips-color);background-color:var(--md-theme-code-copy-tips-bg-color);position:absolute;font-size:12px;font-family:sans-serif;width:max-content;text-align:center;padding:4px;border-radius:2px;box-shadow:0 0 2px #0003;left:0;top:50%;transform:translate(-100%,-50%)}.vuepress-theme .copy-button:after{content:"";color:var(--md-theme-code-copy-tips-bg-color);position:absolute;width:0;height:0;border:5px solid rgba(0,0,0,0);border-right-width:0;border-left-color:currentColor;left:-2px;top:50%;transform:translateY(-50%);filter:drop-shadow(4px 0 2px rgba(0,0,0,.2))}.vuepress-theme .copy-button:before,.vuepress-theme .copy-button:after{visibility:hidden;transition:.3s}.vuepress-theme .copy-button:hover:before,.vuepress-theme .copy-button:hover:after{visibility:visible}.vuepress-theme hr{height:1px;margin:10px 0;border:none;border-top:1px solid var(--md-theme-border-color)}.vuepress-theme figure{margin:0 0 1em;display:inline-flex;flex-direction:column;text-align:center}.vuepress-theme figure figcaption{color:var(--md-theme-color);font-size:.875em;margin-top:5px}.vuepress-theme .md-editor-mermaid{line-height:1}.vuepress-theme em{color:#4f5959;padding:0 6px 0 4px}.md-editor article.github-theme{--md-theme-code-inline-color: inherit;--md-theme-code-inline-bg-color: #eff1f2;--md-theme-code-block-color: inherit;--md-theme-code-block-bg-color: #f6f8fa}.md-editor-dark article.github-theme{--md-theme-code-inline-color: #c9d1d9;--md-theme-code-inline-bg-color: #2d3339;--md-theme-code-block-color: #a9b7c6;--md-theme-code-block-bg-color: #161b22}.github-theme code{padding:.2em .4em;margin:0;color:var(--md-theme-code-inline-color);background-color:var(--md-theme-code-inline-bg-color);border-radius:6px}.github-theme pre{border-radius:6px;position:relative}.github-theme pre code{padding:22px 1em;margin-bottom:0;word-break:normal;letter-spacing:1px;color:var(--md-theme-code-block-color);background-color:var(--md-theme-code-block-bg-color)}.github-theme pre code>*{line-height:1.6}.github-theme pre code span[rn-wrapper]{top:22px}.md-editor article.github-theme{--md-theme-heading-color: inherit;--md-theme-heading-6-color: #2d3339;--md-theme-heading-border-color: #d9dee4}.md-editor-dark article.github-theme{--md-theme-heading-color: #c9d1d9;--md-theme-heading-6-color: #768390;--md-theme-heading-border-color: #373e47}.github-theme h1,.github-theme h2,.github-theme h3,.github-theme h4,.github-theme h5,.github-theme h6{margin-top:24px;margin-bottom:16px;font-weight:600;line-height:1.25;color:var(--md-theme-heading-color)}.github-theme h1{padding-bottom:.3em;font-size:2em;border-bottom:1px solid var(--md-theme-heading-border-color)}.github-theme h2{padding-bottom:.3em;font-size:1.5em;border-bottom:1px solid var(--md-theme-heading-border-color)}.github-theme h3{font-size:1.25em}.github-theme h4{font-size:1em}.github-theme h5{font-size:.875em}.github-theme h6{font-size:.85em;color:var(--md-theme-heading-6-color)}.md-editor article.github-theme{--md-theme-heading-bg-color: #fff}.md-editor-dark article.github-theme{--md-theme-heading-bg-color: #22272e}.github-theme img{max-width:100%;box-sizing:content-box;background-color:var(--md-theme-heading-bg-color)}.github-theme a{color:#539bf5}.github-theme a:hover{text-decoration:underline}.github-theme ol,.github-theme ul{padding-left:2em}.github-theme ol li+li,.github-theme ul li+li{margin-top:.25em}.github-theme p:empty{display:none}.md-editor article.github-theme{--md-theme-quote-color: #57606a;--md-theme-quote-border-color: #d0d7de}.md-editor-dark article.github-theme{--md-theme-quote-color: #8b949e;--md-theme-quote-border-color: #444c56}.github-theme blockquote{padding:0 1em;color:var(--md-theme-quote-color);border-left:.25em solid var(--md-theme-quote-border-color)}.md-editor article.github-theme{--md-theme-table-stripe-color: #f7f8fa;--md-theme-table-tr-bg-color: #fff;--md-theme-table-tr-border-color: #d8dee4;--md-theme-table-td-border-color: #d0d7de}.md-editor-dark article.github-theme{--md-theme-table-stripe-color: #161b22;--md-theme-table-tr-bg-color: transparent;--md-theme-table-tr-border-color: #808080;--md-theme-table-td-border-color: #30363d}.github-theme table{display:block;max-width:100%;overflow:auto;border-spacing:0;border-collapse:collapse}.github-theme table tr{background-color:var(--md-theme-table-tr-bg-color);border-top:1px solid var(--md-theme-table-tr-border-color)}.github-theme table tr th,.github-theme table tr td{padding:6px 13px;border:1px solid var(--md-theme-table-td-border-color)}.github-theme table tr:nth-child(2n){background-color:var(--md-theme-table-stripe-color)}.md-editor .github-theme{--md-theme-color: #222}.md-editor-dark .github-theme{--md-theme-color: #c9d1d9}.github-theme{line-height:1.5;color:var(--md-theme-color)}.github-theme ::-webkit-scrollbar{width:6px;height:6px}.github-theme ::-webkit-scrollbar-corner,.github-theme ::-webkit-scrollbar-track{background-color:var(--md-theme-bg-color-scrollbar-track);border-radius:2px}.github-theme ::-webkit-scrollbar-thumb{border-radius:2px;background-color:var(--md-theme-bg-color-scrollbar-thumb)}.github-theme ::-webkit-scrollbar-button:vertical{display:none}.github-theme ::-webkit-scrollbar-thumb:vertical:hover{background-color:var(--md-theme-bg-color-scrollbar-thumb-hover)}.github-theme ::-webkit-scrollbar-thumb:vertical:active{background-color:var(--md-theme-bg-color-scrollbar-thumb-active)}.github-theme h1,.github-theme h2,.github-theme h3,.github-theme h4,.github-theme h5,.github-theme h6{position:relative;word-break:break-all}.github-theme h1 a,.github-theme h2 a,.github-theme h3 a,.github-theme h4 a,.github-theme h5 a,.github-theme h6 a,.github-theme h1 a:hover,.github-theme h2 a:hover,.github-theme h3 a:hover,.github-theme h4 a:hover,.github-theme h5 a:hover,.github-theme h6 a:hover{color:inherit}.github-theme ol>li{list-style:decimal}.github-theme ul>li{list-style:disc}.github-theme ol .task-list-item,.github-theme ul .task-list-item{list-style-type:none}.github-theme ol .task-list-item input,.github-theme ul .task-list-item input{margin-left:-1.5em;margin-right:.1em}.github-theme a{text-decoration:none}.github-theme pre,.github-theme code{font-family:source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;font-size:14px}.github-theme pre{margin:20px 0}.github-theme pre code{display:block;line-height:1;overflow:auto}.github-theme pre code .code-block{display:inline-block;width:100%;overflow:auto;vertical-align:bottom}.github-theme pre code[language]:before{content:attr(language);font-size:12px;position:absolute;top:11px;right:40px;line-height:1;z-index:1}.github-theme .copy-button{color:var(--md-theme-code-block-color);position:absolute;font-size:12px;top:5px;right:7px;line-height:1;cursor:pointer;z-index:1}.github-theme .copy-button:before{content:attr(data-tips);color:var(--md-theme-code-copy-tips-color);background-color:var(--md-theme-code-copy-tips-bg-color);position:absolute;font-size:12px;font-family:sans-serif;width:max-content;text-align:center;padding:4px;border-radius:2px;box-shadow:0 0 2px #0003;left:0;top:50%;transform:translate(-100%,-50%)}.github-theme .copy-button:after{content:"";color:var(--md-theme-code-copy-tips-bg-color);position:absolute;width:0;height:0;border:5px solid rgba(0,0,0,0);border-right-width:0;border-left-color:currentColor;left:-2px;top:50%;transform:translateY(-50%);filter:drop-shadow(4px 0 2px rgba(0,0,0,.2))}.github-theme .copy-button:before,.github-theme .copy-button:after{visibility:hidden;transition:.3s}.github-theme .copy-button:hover:before,.github-theme .copy-button:hover:after{visibility:visible}.github-theme hr{height:1px;margin:10px 0;border:none;border-top:1px solid var(--md-theme-border-color)}.github-theme figure{margin:0 0 1em;display:inline-flex;flex-direction:column;text-align:center}.github-theme figure figcaption{color:var(--md-theme-color);font-size:.875em;margin-top:5px}.github-theme .md-editor-mermaid{line-height:1}.github-theme p,.github-theme blockquote,.github-theme ul,.github-theme ol,.github-theme dl,.github-theme table,.github-theme pre,.github-theme details{margin-top:0;margin-bottom:16px}.cyanosis-theme code{padding:.065em .4em;font-family:Menlo,Monaco,Consolas,Courier New,monospace;color:var(--md-theme-code-color);overflow-x:auto;background-color:var(--md-theme-code-bg-color);border-radius:2px}.cyanosis-theme code::selection{background-color:var(--md-theme-slct-codebg-color)}.cyanosis-theme pre{font-family:Menlo,Monaco,Consolas,Courier New,monospace;position:relative}.cyanosis-theme pre code{padding:22px 12px;margin:0;color:var(--md-theme-base-color);word-break:normal;overflow-x:auto;background:var(--md-theme-code-block-bg-color)}.cyanosis-theme pre code::selection{background-color:var(--md-theme-slct-prebg-color)}.cyanosis-theme pre code>*{line-height:1.75}.cyanosis-theme pre code::-webkit-scrollbar{width:4px;height:4px}.cyanosis-theme pre code::-webkit-scrollbar-track{background-color:var(--md-theme-border-color)}.cyanosis-theme pre code::-webkit-scrollbar-thumb{background-color:var(--md-theme-strong-color);border-radius:10px}.cyanosis-theme pre code span[rn-wrapper]{top:22px}.cyanosis-theme pre .copy-button{color:var(--md-theme-base-color)}.cyanosis-theme h1{padding-bottom:4px;margin-top:36px;margin-bottom:10px;font-size:30px;line-height:1.5;color:var(--cyanosis-theme-title-color);transition:color .35s}.cyanosis-theme h2{position:relative;padding-left:10px;padding-right:10px;padding-bottom:10px;margin-top:36px;margin-bottom:10px;font-size:24px;line-height:1.5;color:var(--cyanosis-theme-title-color);border-bottom:1px solid var(--md-theme-border-color-2);transition:color .35s}.cyanosis-theme h2:before{content:"\u300C";position:absolute;top:-6px;left:-14px}.cyanosis-theme h2:after{content:"\u300D";position:relative;top:6px;right:auto}.cyanosis-theme h3{position:relative;padding-bottom:0;margin-top:30px;margin-bottom:10px;font-size:20px;line-height:1.5;color:var(--cyanosis-theme-title-color);padding-left:6px;transition:color .35s}.cyanosis-theme h3:before{content:"\xBB";padding-right:6px;color:var(--md-theme-strong-color)}.cyanosis-theme h4{padding-bottom:0;margin-top:24px;margin-bottom:10px;font-size:16px;line-height:1.5;color:var(--cyanosis-theme-title-color);padding-left:6px;transition:color .35s}.cyanosis-theme h5{padding-bottom:0;margin-top:18px;margin-bottom:10px;font-size:14px;line-height:1.5;color:var(--cyanosis-theme-title-color);padding-left:6px;transition:color .35s}.cyanosis-theme h6{padding-bottom:0;margin-top:12px;margin-bottom:10px;font-size:12px;line-height:1.5;color:var(--cyanosis-theme-title-color);padding-left:6px;transition:color .35s}.cyanosis-theme h1::selection,.cyanosis-theme h2::selection,.cyanosis-theme h3::selection,.cyanosis-theme h4::selection,.cyanosis-theme h5::selection,.cyanosis-theme h6::selection{color:var(--md-theme-slct-title-color);background-color:var(--md-theme-slct-titlebg-color)}@media (max-width: 720px){.cyanosis-theme h1{font-size:24px}.cyanosis-theme h2{font-size:20px}.cyanosis-theme h3{font-size:18px}}.cyanosis-theme img{max-width:100%}.cyanosis-theme a{position:relative;display:inline-block;text-decoration:none;color:var(--md-theme-link-color);border-bottom:1px solid var(--md-theme-border-color)}.cyanosis-theme a:hover{color:var(--md-theme-linkh-color);border-bottom-color:var(--md-theme-linkh-color)}.cyanosis-theme a:active{color:var(--md-theme-linkh-color)}.cyanosis-theme a:after{position:absolute;content:"";top:100%;left:0;width:100%;opacity:0;border-bottom:1px solid var(--md-theme-border-color);transition:top .3s,opacity .3s;transform:translateZ(0)}.cyanosis-theme a:hover:after{top:0;opacity:1;border-bottom-color:var(--md-theme-linkh-color)}.cyanosis-theme ol,.cyanosis-theme ul{padding-left:28px}.cyanosis-theme ol li,.cyanosis-theme ul li{margin-bottom:0;list-style:inherit}.cyanosis-theme ol li .task-list-item,.cyanosis-theme ul li .task-list-item{list-style:none}.cyanosis-theme ol li .task-list-item ul,.cyanosis-theme ol li .task-list-item ol,.cyanosis-theme ul li .task-list-item ul,.cyanosis-theme ul li .task-list-item ol{margin-top:0}.cyanosis-theme ol ul,.cyanosis-theme ol ol,.cyanosis-theme ul ul,.cyanosis-theme ul ol{margin-top:4px}.cyanosis-theme ol li{padding-left:6px}.cyanosis-theme ol li::selection,.cyanosis-theme ul li::selection{color:var(--md-theme-slct-text-color);background-color:var(--md-theme-slct-bg-color)}.cyanosis-theme p{line-height:inherit;margin-top:16px;margin-bottom:16px}.cyanosis-theme p::selection{color:var(--md-theme-slct-text-color);background-color:var(--md-theme-slct-bg-color)}.cyanosis-theme blockquote{color:var(--md-theme-blockquote-color);border-left:4px solid var(--md-theme-strong-color);background-color:var(--md-theme-blockquote-bg-color);padding:1px 20px;margin:22px 0;transition:color .35s}.cyanosis-theme blockquote:after{display:block;content:""}.cyanosis-theme blockquote>p{margin:10px 0}.cyanosis-theme blockquote>b,.cyanosis-theme blockquote>strong{color:var(--md-theme-strong-color)}.cyanosis-theme table{display:inline-block!important;width:auto;max-width:100%;overflow:auto;border:1px solid var(--md-theme-table-border-color);border-spacing:0;border-collapse:collapse}.cyanosis-theme table thead{color:#000;text-align:left;background:#f6f6f6}.cyanosis-theme table tr:nth-child(2n){background-color:var(--md-theme-table-tr-nc-color)}.cyanosis-theme table tr:hover{background-color:var(--md-theme-table-trh-color)}.cyanosis-theme table th,.cyanosis-theme table td{padding:12px 8px;line-height:24px;border:1px solid var(--md-theme-table-border-color)}.cyanosis-theme table th{color:var(--md-theme-table-tht-color);background-color:var(--md-theme-table-th-color)}.cyanosis-theme table td{min-width:120px}.cyanosis-theme table thead th::selection{background-color:#0000}.cyanosis-theme table tbody td::selection{background-color:var(--md-theme-slct-bg-color)}.md-editor .cyanosis-theme{--md-theme-base-color:#353535;--md-theme-title-color:#005bb7;--md-theme-strong-color:#2196f3;--md-theme-em-color:#4fc3f7;--md-theme-del-color:#ccc;--md-theme-link-color:#3da8f5;--md-theme-linkh-color:#007fff;--md-theme-border-color:#bedcff;--md-theme-border-color-2:#ececec;--md-theme-bg-color:#fff;--md-theme-blockquote-color:#8c8c8c;--md-theme-blockquote-bg-color:#f0fdff;--md-theme-code-color:#c2185b;--md-theme-code-bg-color:#fff4f4;--md-theme-code-block-bg-color:#f8f8f8;--md-theme-table-border-color:#c3e0fd;--md-theme-table-th-color:#dff0ff;--md-theme-table-tht-color:#005bb7;--md-theme-table-tr-nc-color:#f7fbff;--md-theme-table-trh-color:#e0edf7;--md-theme-slct-title-color:#005bb7;--md-theme-slct-titlebg-color:rgba(175,207,247,.25);--md-theme-slct-text-color:#c80000;--md-theme-slct-bg-color:rgba(175,207,247,.25);--md-theme-slct-del-color:#999;--md-theme-slct-elbg-color:#e8ebec;--md-theme-slct-codebg-color:#ffeaeb;--md-theme-slct-prebg-color:rgba(160,200,255,.25)}.md-editor-dark .cyanosis-theme{--md-theme-base-color:#cacaca;--md-theme-title-color:#ddd;--md-theme-strong-color:#fe9900;--md-theme-em-color:#ffd28e;--md-theme-del-color:#ccc;--md-theme-link-color:#ffb648;--md-theme-linkh-color:#fe9900;--md-theme-border-color:#ffe3ba;--md-theme-border-color-2:#ffcb7b;--md-theme-bg-color:#2f2f2f;--md-theme-blockquote-color:#c7c7c7;--md-theme-blockquote-bg-color:rgba(255,199,116,.1);--md-theme-code-color:#000;--md-theme-code-bg-color:#ffcb7b;--md-theme-code-block-bg-color:rgba(30,25,18,.5);--md-theme-table-border-color:#fe9900;--md-theme-table-th-color:#ffb648;--md-theme-table-tht-color:#000;--md-theme-table-tr-nc-color:#6d5736;--md-theme-table-trh-color:#947443;--md-theme-slct-title-color:#000;--md-theme-slct-titlebg-color:#fe9900;--md-theme-slct-text-color:#00c888;--md-theme-slct-bg-color:rgba(175,207,247,.25);--md-theme-slct-del-color:#999;--md-theme-slct-elbg-color:#000;--md-theme-slct-codebg-color:#ffcb7b;--md-theme-slct-prebg-color:rgba(160,200,255,.25)}.cyanosis-theme{color:var(--md-theme-color);word-break:break-word;line-height:1.75;font-weight:400;overflow-x:hidden;color:var(--md-theme-base-color);transition:color .35s}.cyanosis-theme ::-webkit-scrollbar{width:6px;height:6px}.cyanosis-theme ::-webkit-scrollbar-corner,.cyanosis-theme ::-webkit-scrollbar-track{background-color:var(--md-theme-bg-color-scrollbar-track);border-radius:2px}.cyanosis-theme ::-webkit-scrollbar-thumb{border-radius:2px;background-color:var(--md-theme-bg-color-scrollbar-thumb)}.cyanosis-theme ::-webkit-scrollbar-button:vertical{display:none}.cyanosis-theme ::-webkit-scrollbar-thumb:vertical:hover{background-color:var(--md-theme-bg-color-scrollbar-thumb-hover)}.cyanosis-theme ::-webkit-scrollbar-thumb:vertical:active{background-color:var(--md-theme-bg-color-scrollbar-thumb-active)}.cyanosis-theme h1,.cyanosis-theme h2,.cyanosis-theme h3,.cyanosis-theme h4,.cyanosis-theme h5,.cyanosis-theme h6{position:relative;word-break:break-all}.cyanosis-theme h1 a,.cyanosis-theme h2 a,.cyanosis-theme h3 a,.cyanosis-theme h4 a,.cyanosis-theme h5 a,.cyanosis-theme h6 a,.cyanosis-theme h1 a:hover,.cyanosis-theme h2 a:hover,.cyanosis-theme h3 a:hover,.cyanosis-theme h4 a:hover,.cyanosis-theme h5 a:hover,.cyanosis-theme h6 a:hover{color:inherit}.cyanosis-theme ol>li{list-style:decimal}.cyanosis-theme ul>li{list-style:disc}.cyanosis-theme ol .task-list-item,.cyanosis-theme ul .task-list-item{list-style-type:none}.cyanosis-theme ol .task-list-item input,.cyanosis-theme ul .task-list-item input{margin-left:-1.5em;margin-right:.1em}.cyanosis-theme a{text-decoration:none}.cyanosis-theme pre,.cyanosis-theme code{font-family:source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;font-size:14px}.cyanosis-theme pre{margin:20px 0}.cyanosis-theme pre code{display:block;line-height:1;overflow:auto}.cyanosis-theme pre code .code-block{display:inline-block;width:100%;overflow:auto;vertical-align:bottom}.cyanosis-theme pre code[language]:before{content:attr(language);font-size:12px;position:absolute;top:11px;right:40px;line-height:1;z-index:1}.cyanosis-theme .copy-button{color:var(--md-theme-code-block-color);position:absolute;font-size:12px;top:5px;right:7px;line-height:1;cursor:pointer;z-index:1}.cyanosis-theme .copy-button:before{content:attr(data-tips);color:var(--md-theme-code-copy-tips-color);background-color:var(--md-theme-code-copy-tips-bg-color);position:absolute;font-size:12px;font-family:sans-serif;width:max-content;text-align:center;padding:4px;border-radius:2px;box-shadow:0 0 2px #0003;left:0;top:50%;transform:translate(-100%,-50%)}.cyanosis-theme .copy-button:after{content:"";color:var(--md-theme-code-copy-tips-bg-color);position:absolute;width:0;height:0;border:5px solid rgba(0,0,0,0);border-right-width:0;border-left-color:currentColor;left:-2px;top:50%;transform:translateY(-50%);filter:drop-shadow(4px 0 2px rgba(0,0,0,.2))}.cyanosis-theme .copy-button:before,.cyanosis-theme .copy-button:after{visibility:hidden;transition:.3s}.cyanosis-theme .copy-button:hover:before,.cyanosis-theme .copy-button:hover:after{visibility:visible}.cyanosis-theme hr{height:1px;margin:10px 0;border:none;border-top:1px solid var(--md-theme-border-color)}.cyanosis-theme figure{margin:0 0 1em;display:inline-flex;flex-direction:column;text-align:center}.cyanosis-theme figure figcaption{color:var(--md-theme-color);font-size:.875em;margin-top:5px}.cyanosis-theme .md-editor-mermaid{line-height:1}.cyanosis-theme hr{position:relative;width:98%;height:1px;margin-top:32px;margin-bottom:32px;background-image:linear-gradient(90deg,var(--md-theme-link-color),rgba(255,0,0,.3),rgba(37,163,65,.3),rgba(255,0,0,.3),var(--md-theme-link-color));border-width:0;overflow:visible}.cyanosis-theme b,.cyanosis-theme strong{color:var(--md-theme-strong-color)}.cyanosis-theme i,.cyanosis-theme em{color:var(--md-theme-em-color)}.cyanosis-theme del{color:var(--md-theme-del-color)}.cyanosis-theme details>summary{outline:none;color:var(--md-theme-title-color);font-size:20px;font-weight:bolder;border-bottom:1px solid var(--md-theme-border-color);cursor:pointer}.cyanosis-theme details>p{padding:10px 20px;margin:10px 0 0;color:#666;background-color:var(--md-theme-blockquote-bg-color);border:2px dashed var(--md-theme-strong-color)}.cyanosis-theme a::selection,.cyanosis-theme b::selection,.cyanosis-theme strong::selection,.cyanosis-theme i::selection,.cyanosis-theme em::selection{background-color:var(--md-theme-slct-elbg-color)}.cyanosis-theme del::selection{color:var(--md-theme-slct-del-color);background-color:var(--md-theme-slct-elbg-color)}.md-editor article.mk-cute-theme{--md-theme-code-inline-color: #4ec9b0;--md-theme-code-inline-bg-color: #282c34;--md-theme-code-block-color: #4ec9b0;--md-theme-code-block-bg-color: #282c34}.md-editor-dark article.mk-cute-theme{--md-theme-code-inline-color: #4ec9b0;--md-theme-code-inline-bg-color: #282c34;--md-theme-code-block-color: #4ec9b0;--md-theme-code-block-bg-color: #282c34}.mk-cute-theme code{font-family:Menlo,Monaco,Consolas,Courier New,monospace;border-radius:2px;overflow-x:auto;background-color:var(--md-theme-code-block-bg-color);color:var(--md-theme-code-inline-color);padding:.14em .46em;margin:0 4px}.mk-cute-theme pre{position:relative}.mk-cute-theme pre code{font-family:Menlo,Monaco,Consolas,Courier New,monospace;border-radius:10px;padding:22px;margin:0;word-break:normal;display:block;overflow-x:auto;color:var(--md-theme-code-block-color);background:var(--md-theme-code-block-bg-color)}.mk-cute-theme pre code>*{line-height:1.75}.mk-cute-theme pre code span[rn-wrapper]{top:22px}.mk-cute-theme .code-tabs{border-radius:10px}.mk-cute-theme .code-tabs ul{border-top-left-radius:10px;border-top-right-radius:10px}.mk-cute-theme h1,.mk-cute-theme h2,.mk-cute-theme h3,.mk-cute-theme h4,.mk-cute-theme h5,.mk-cute-theme h6{color:#36ace1}.mk-cute-theme h1:before,.mk-cute-theme h2:before,.mk-cute-theme h3:before,.mk-cute-theme h4:before,.mk-cute-theme h5:before,.mk-cute-theme h6:before{content:"";display:block;position:absolute;left:0;top:0;bottom:0;margin:auto;background-image:url(data:image/png;base64,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);animation:spin 2s linear 1s infinite}.mk-cute-theme h1{position:relative;font-size:30px;padding:12px 38px;margin:30px 0}.mk-cute-theme h1:before{width:30px;height:30px;background-size:30px 30px}.mk-cute-theme h2{position:relative;font-size:24px;padding:12px 36px;margin:28px 0}.mk-cute-theme h2:before{width:28px;height:28px;background-size:28px 28px}.mk-cute-theme h3{position:relative;font-size:18px;padding:4px 32px;margin:26px 0}.mk-cute-theme h3:before{width:24px;height:24px;background-size:24px 24px}.mk-cute-theme h4{position:relative;padding:4px 28px;font-size:16px;margin:22px 0}.mk-cute-theme h4:before{width:20px;height:20px;background-size:20px 20px}.mk-cute-theme h5{position:relative;padding:4px 26px;font-size:15px;margin:20px 0}.mk-cute-theme h5:before{width:18px;height:18px;background-size:18px 18px}.mk-cute-theme h6{position:relative;padding:4px 22px;font-size:14px;margin:16px 0}.mk-cute-theme h6:before{width:16px;height:16px;background-size:16px 16px}@media (max-width: 720px){.mk-cute-theme h1{font-size:24px}.mk-cute-theme h2{font-size:20px}.mk-cute-theme h3{font-size:18px}}.mk-cute-theme img{max-width:100%}.mk-cute-theme a{display:inline-block;text-decoration:none;color:#409eff;border-bottom:1px solid #409eff}.mk-cute-theme a:hover,.mk-cute-theme a:active{color:#007bff;border-bottom:1px solid #007bff}.mk-cute-theme ol,.mk-cute-theme ul{padding-left:28px}.mk-cute-theme ol li,.mk-cute-theme ul li{margin-bottom:0;list-style:inherit}.mk-cute-theme ol li .task-list-item,.mk-cute-theme ul li .task-list-item{list-style:none}.mk-cute-theme ol li .task-list-item ul,.mk-cute-theme ol li .task-list-item ol,.mk-cute-theme ul li .task-list-item ul,.mk-cute-theme ul li .task-list-item ol{margin-top:0}.mk-cute-theme ol ul,.mk-cute-theme ol ol,.mk-cute-theme ul ul,.mk-cute-theme ul ol{margin-top:3px}.mk-cute-theme ol li{padding-left:6px}.mk-cute-theme p{line-height:inherit;margin-top:22px;margin-bottom:22px}.mk-cute-theme p:empty{display:none}.md-editor article.mk-cute-theme{--md-theme-quote-color: #fff;--md-theme-quote-border-color: #409eff;--md-theme-quote-bg-color: rgba(54, 172, 225, .75)}.md-editor-dark article.mk-cute-theme{--md-theme-quote-color: inherit;--md-theme-quote-border-color: #265d97;--md-theme-quote-bg-color: rgba(18, 80, 108, .75)}.mk-cute-theme blockquote{position:relative;padding:8px 26px;background-color:var(--md-theme-quote-bg-color);margin:16px 0;border-left:4px solid var(--md-theme-quote-border-color);border-radius:5px}.mk-cute-theme blockquote:before{content:"\u275D";top:10px;left:8px;color:#409eff;font-size:20px;line-height:1;font-weight:700;position:absolute;opacity:.7}.mk-cute-theme blockquote:after{content:"\u275E";font-size:20px;position:absolute;right:8px;bottom:0;color:#409eff;opacity:.7}.mk-cute-theme blockquote>p,.mk-cute-theme blockquote ul li,.mk-cute-theme blockquote ol li{color:var(--md-theme-quote-color)}.md-editor article.mk-cute-theme{--md-theme-table-color: #000;--md-theme-table-border-color: #f6f6f6;--md-theme-table-thead-bg-color: #f6f6f6;--md-theme-table-stripe-color: #fcfcfc}.md-editor-dark article.mk-cute-theme{--md-theme-table-color: inherit;--md-theme-table-border-color: #1c1c1c;--md-theme-table-thead-bg-color: rgba(28, 28, 28, .631372549);--md-theme-table-stripe-color: rgba(28, 28, 28, .631372549)}.mk-cute-theme table{display:inline-block;width:auto;max-width:100%;overflow:auto;border:solid 1px var(--md-theme-table-border-color)}.mk-cute-theme thead{background-color:var(--md-theme-table-thead-bg-color);color:var(--md-theme-table-color);text-align:left}.mk-cute-theme tr:nth-child(2n){background-color:var(--md-theme-table-stripe-color)}.mk-cute-theme th,.mk-cute-theme td{padding:12px 7px;line-height:24px}.mk-cute-theme td{min-width:120px}.mk-cute-theme blockquote table tr{background-color:var(--md-theme-table-stripe-color)}.md-editor .mk-cute-theme{background-image:linear-gradient(90deg,rgba(50,58,66,.25) 3%,rgba(0,0,0,0) 3%),linear-gradient(360deg,rgba(50,58,66,.25) 3%,rgba(0,0,0,0) 3%)}.md-editor-dark .mk-cute-theme{background-image:linear-gradient(90deg,rgba(217,234,251,.25) 3%,rgba(0,0,0,0) 3%),linear-gradient(360deg,rgba(217,234,251,.25) 3%,rgba(0,0,0,0) 3%);--md-theme-bg-color-scrollbar-thumb: #4d4d4d}.mk-cute-theme{color:var(--md-theme-color);word-break:break-word;line-height:1.75;font-weight:400;overflow-x:hidden;color:#36ace1;background-size:20px 20px;background-position:center center}.mk-cute-theme ::-webkit-scrollbar{width:6px;height:6px}.mk-cute-theme ::-webkit-scrollbar-corner,.mk-cute-theme ::-webkit-scrollbar-track{background-color:var(--md-theme-bg-color-scrollbar-track);border-radius:2px}.mk-cute-theme ::-webkit-scrollbar-thumb{border-radius:2px;background-color:var(--md-theme-bg-color-scrollbar-thumb)}.mk-cute-theme ::-webkit-scrollbar-button:vertical{display:none}.mk-cute-theme ::-webkit-scrollbar-thumb:vertical:hover{background-color:var(--md-theme-bg-color-scrollbar-thumb-hover)}.mk-cute-theme ::-webkit-scrollbar-thumb:vertical:active{background-color:var(--md-theme-bg-color-scrollbar-thumb-active)}.mk-cute-theme h1,.mk-cute-theme h2,.mk-cute-theme h3,.mk-cute-theme h4,.mk-cute-theme h5,.mk-cute-theme h6{position:relative;word-break:break-all}.mk-cute-theme h1 a,.mk-cute-theme h2 a,.mk-cute-theme h3 a,.mk-cute-theme h4 a,.mk-cute-theme h5 a,.mk-cute-theme h6 a,.mk-cute-theme h1 a:hover,.mk-cute-theme h2 a:hover,.mk-cute-theme h3 a:hover,.mk-cute-theme h4 a:hover,.mk-cute-theme h5 a:hover,.mk-cute-theme h6 a:hover{color:inherit}.mk-cute-theme ol>li{list-style:decimal}.mk-cute-theme ul>li{list-style:disc}.mk-cute-theme ol .task-list-item,.mk-cute-theme ul .task-list-item{list-style-type:none}.mk-cute-theme ol .task-list-item input,.mk-cute-theme ul .task-list-item input{margin-left:-1.5em;margin-right:.1em}.mk-cute-theme a{text-decoration:none}.mk-cute-theme pre,.mk-cute-theme code{font-family:source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;font-size:14px}.mk-cute-theme pre{margin:20px 0}.mk-cute-theme pre code{display:block;line-height:1;overflow:auto}.mk-cute-theme pre code .code-block{display:inline-block;width:100%;overflow:auto;vertical-align:bottom}.mk-cute-theme pre code[language]:before{content:attr(language);font-size:12px;position:absolute;top:11px;right:40px;line-height:1;z-index:1}.mk-cute-theme .copy-button{color:var(--md-theme-code-block-color);position:absolute;font-size:12px;top:5px;right:7px;line-height:1;cursor:pointer;z-index:1}.mk-cute-theme .copy-button:before{content:attr(data-tips);color:var(--md-theme-code-copy-tips-color);background-color:var(--md-theme-code-copy-tips-bg-color);position:absolute;font-size:12px;font-family:sans-serif;width:max-content;text-align:center;padding:4px;border-radius:2px;box-shadow:0 0 2px #0003;left:0;top:50%;transform:translate(-100%,-50%)}.mk-cute-theme .copy-button:after{content:"";color:var(--md-theme-code-copy-tips-bg-color);position:absolute;width:0;height:0;border:5px solid rgba(0,0,0,0);border-right-width:0;border-left-color:currentColor;left:-2px;top:50%;transform:translateY(-50%);filter:drop-shadow(4px 0 2px rgba(0,0,0,.2))}.mk-cute-theme .copy-button:before,.mk-cute-theme .copy-button:after{visibility:hidden;transition:.3s}.mk-cute-theme .copy-button:hover:before,.mk-cute-theme .copy-button:hover:after{visibility:visible}.mk-cute-theme hr{height:1px;margin:10px 0;border:none;border-top:1px solid var(--md-theme-border-color)}.mk-cute-theme figure{margin:0 0 1em;display:inline-flex;flex-direction:column;text-align:center}.mk-cute-theme figure figcaption{color:var(--md-theme-color);font-size:.875em;margin-top:5px}.mk-cute-theme .md-editor-mermaid{line-height:1}.mk-cute-theme hr{position:relative;width:98%;height:1px;border:none;margin-top:32px;margin-bottom:32px;background-image:linear-gradient(to right,#36ace1,#dff0fe,#36ace1);overflow:visible}.mk-cute-theme del{color:#36ace1}.md-editor article.smart-blue-theme{--md-theme-code-inline-color: #d63200;--md-theme-code-inline-bg-color: #fff5f5;--md-theme-code-block-color: #333;--md-theme-code-block-bg-color: #f8f8f8}.md-editor-dark article.smart-blue-theme{--md-theme-code-inline-color: #e06c75;--md-theme-code-inline-bg-color: #1a1a1a;--md-theme-code-block-color: #999;--md-theme-code-block-bg-color: #1a1a1a}.smart-blue-theme pre{position:relative}.smart-blue-theme pre code{padding:22px 12px;margin:0;word-break:normal;display:block;overflow-x:auto;color:var(--md-theme-code-block-color);background-color:var(--md-theme-code-block-bg-color)}.smart-blue-theme pre code>*{line-height:1.6}.smart-blue-theme pre code span[rn-wrapper]{top:22px}.smart-blue-theme code{border-radius:2px;overflow-x:auto;background-color:var(--md-theme-code-inline-bg-color);color:#ff502c;padding:.065em .4em}.smart-blue-theme pre,.smart-blue-theme code{line-height:1.75;font-family:Menlo,Monaco,Consolas,Courier New,monospace}.md-editor article.smart-blue-theme{--md-theme-heading-color: #135ce0}.md-editor-dark article.smart-blue-theme{--md-theme-heading-color: #3a73dd}.smart-blue-theme h1,.smart-blue-theme h2,.smart-blue-theme h3,.smart-blue-theme h4,.smart-blue-theme h5,.smart-blue-theme h6{padding:30px 0;margin:0;color:var(--md-theme-heading-color)}.smart-blue-theme h1 a,.smart-blue-theme h2 a,.smart-blue-theme h3 a,.smart-blue-theme h4 a,.smart-blue-theme h5 a,.smart-blue-theme h6 a{border:none}.smart-blue-theme h1{position:relative;text-align:center;font-size:22px;margin:50px 0}.smart-blue-theme h2{position:relative;font-size:20px;border-left:4px solid;padding:0 0 0 10px;margin:30px 0}.smart-blue-theme h3{font-size:16px}.smart-blue-theme img{max-width:100%;margin:0 auto;display:block}.md-editor article.smart-blue-theme{--md-theme-link-color: #036aca}.md-editor-dark article.smart-blue-theme{--md-theme-link-color: #2d7dc7}.smart-blue-theme a{color:var(--md-theme-link-color);font-weight:400;text-decoration:none}.smart-blue-theme ul,.smart-blue-theme ol{margin-top:1em;padding-left:1.6em}.smart-blue-theme ul{list-style:disc outside}.smart-blue-theme li{line-height:2;margin-bottom:0;list-style:inherit}.smart-blue-theme p{line-height:2;font-weight:400}.smart-blue-theme *+p{margin-top:16px}.md-editor article.smart-blue-theme{--md-theme-quote-color: #666;--md-theme-quote-bg-color: #fff9f9;--md-theme-quote-border-color: #b2aec5}.md-editor-dark article.smart-blue-theme{--md-theme-quote-color: #999;--md-theme-quote-bg-color: #2a2a2a;--md-theme-quote-border-color: #0063bb}.smart-blue-theme blockquote{background-color:var(--md-theme-quote-bg-color);margin:2em 0;padding:2px 20px;border-left:4px solid var(--md-theme-quote-border-color)}.smart-blue-theme blockquote p{color:var(--md-theme-quote-color);line-height:2}.md-editor article.smart-blue-theme{--md-theme-table-border-color: #dfe2e5;--md-theme-table-bg-color: #f6f8fa}.md-editor-dark article.smart-blue-theme{--md-theme-table-border-color: #2d2d2d;--md-theme-table-bg-color: #0c0c0c}.smart-blue-theme table{border-collapse:collapse;margin:1rem 0;overflow-x:auto}.smart-blue-theme table tr{border-top:1px solid var(--md-theme-table-border-color)}.smart-blue-theme table tr:nth-child(2n){background-color:var(--md-theme-table-bg-color)}.smart-blue-theme table tr th,.smart-blue-theme table tr td{border:1px solid var(--md-theme-table-border-color);padding:.6em 1em}.smart-blue-theme blockquote table{line-height:initial}.smart-blue-theme blockquote table tr th,.smart-blue-theme blockquote table tr td{border-color:var(--md-theme-border-color-inset)}.smart-blue-theme blockquote table tbody tr:nth-child(n){background-color:inherit}.md-editor .smart-blue-theme{--md-theme-color: #595959}.md-editor .smart-blue-theme{background-image:linear-gradient(90deg,rgba(60,10,30,.04) 3%,rgba(0,0,0,0) 3%),linear-gradient(360deg,rgba(60,10,30,.04) 3%,rgba(0,0,0,0) 3%)}.md-editor-dark .smart-blue-theme{--md-theme-color: #999}.md-editor-dark .smart-blue-theme{background-image:linear-gradient(90deg,rgba(207,207,207,.04) 3%,rgba(255,255,255,0) 3%),linear-gradient(360deg,rgba(207,207,207,.04) 3%,rgba(255,255,255,0) 3%)}.smart-blue-theme{color:var(--md-theme-color);font-family:-apple-system,system-ui,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;background-size:20px 20px;background-position:center center}.smart-blue-theme ::-webkit-scrollbar{width:6px;height:6px}.smart-blue-theme ::-webkit-scrollbar-corner,.smart-blue-theme ::-webkit-scrollbar-track{background-color:var(--md-theme-bg-color-scrollbar-track);border-radius:2px}.smart-blue-theme ::-webkit-scrollbar-thumb{border-radius:2px;background-color:var(--md-theme-bg-color-scrollbar-thumb)}.smart-blue-theme ::-webkit-scrollbar-button:vertical{display:none}.smart-blue-theme ::-webkit-scrollbar-thumb:vertical:hover{background-color:var(--md-theme-bg-color-scrollbar-thumb-hover)}.smart-blue-theme ::-webkit-scrollbar-thumb:vertical:active{background-color:var(--md-theme-bg-color-scrollbar-thumb-active)}.smart-blue-theme h1,.smart-blue-theme h2,.smart-blue-theme h3,.smart-blue-theme h4,.smart-blue-theme h5,.smart-blue-theme h6{position:relative;word-break:break-all}.smart-blue-theme h1 a,.smart-blue-theme h2 a,.smart-blue-theme h3 a,.smart-blue-theme h4 a,.smart-blue-theme h5 a,.smart-blue-theme h6 a,.smart-blue-theme h1 a:hover,.smart-blue-theme h2 a:hover,.smart-blue-theme h3 a:hover,.smart-blue-theme h4 a:hover,.smart-blue-theme h5 a:hover,.smart-blue-theme h6 a:hover{color:inherit}.smart-blue-theme ol>li{list-style:decimal}.smart-blue-theme ul>li{list-style:disc}.smart-blue-theme ol .task-list-item,.smart-blue-theme ul .task-list-item{list-style-type:none}.smart-blue-theme ol .task-list-item input,.smart-blue-theme ul .task-list-item input{margin-left:-1.5em;margin-right:.1em}.smart-blue-theme a{text-decoration:none}.smart-blue-theme pre,.smart-blue-theme code{font-family:source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;font-size:14px}.smart-blue-theme pre{margin:20px 0}.smart-blue-theme pre code{display:block;line-height:1;overflow:auto}.smart-blue-theme pre code .code-block{display:inline-block;width:100%;overflow:auto;vertical-align:bottom}.smart-blue-theme pre code[language]:before{content:attr(language);font-size:12px;position:absolute;top:11px;right:40px;line-height:1;z-index:1}.smart-blue-theme .copy-button{color:var(--md-theme-code-block-color);position:absolute;font-size:12px;top:5px;right:7px;line-height:1;cursor:pointer;z-index:1}.smart-blue-theme .copy-button:before{content:attr(data-tips);color:var(--md-theme-code-copy-tips-color);background-color:var(--md-theme-code-copy-tips-bg-color);position:absolute;font-size:12px;font-family:sans-serif;width:max-content;text-align:center;padding:4px;border-radius:2px;box-shadow:0 0 2px #0003;left:0;top:50%;transform:translate(-100%,-50%)}.smart-blue-theme .copy-button:after{content:"";color:var(--md-theme-code-copy-tips-bg-color);position:absolute;width:0;height:0;border:5px solid rgba(0,0,0,0);border-right-width:0;border-left-color:currentColor;left:-2px;top:50%;transform:translateY(-50%);filter:drop-shadow(4px 0 2px rgba(0,0,0,.2))}.smart-blue-theme .copy-button:before,.smart-blue-theme .copy-button:after{visibility:hidden;transition:.3s}.smart-blue-theme .copy-button:hover:before,.smart-blue-theme .copy-button:hover:after{visibility:visible}.smart-blue-theme hr{height:1px;margin:10px 0;border:none;border-top:1px solid var(--md-theme-border-color)}.smart-blue-theme figure{margin:0 0 1em;display:inline-flex;flex-direction:column;text-align:center}.smart-blue-theme figure figcaption{color:var(--md-theme-color);font-size:.875em;margin-top:5px}.smart-blue-theme .md-editor-mermaid{line-height:1}.smart-blue-theme strong,.smart-blue-theme em strong{color:#036aca}.smart-blue-theme hr{border-top:1px solid #135ce0}.md-editor-checkbox{cursor:pointer;width:12px;height:12px;border:1px solid var(--md-border-color);background-color:var(--md-bk-color-outstand);border-radius:2px;line-height:1;text-align:center}.md-editor-checkbox:after{content:"";font-weight:700}.md-editor-checkbox-checked:after{content:"\u2713"}.md-editor-divider{position:relative;display:inline-block;width:1px;top:.1em;height:.9em;margin:0 8px;background-color:var(--md-border-color)}.md-editor-dropdown{overflow:hidden;box-sizing:border-box;position:absolute;transition:all .3s;opacity:1;z-index:10000;background-color:var(--md-bk-color)}.md-editor-dropdown-hidden{opacity:0;z-index:-10000}.md-editor-dropdown-overlay{margin-top:6px}.md-editor-modal-mask{position:fixed;top:0;right:0;bottom:0;left:0;z-index:20000;height:100%;background-color:var(--md-modal-mask)}.md-editor-modal{display:block;background-color:var(--md-bk-color);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol;border-radius:3px;border:1px solid var(--md-border-color);position:fixed;z-index:20001;flex-direction:column}.md-editor-modal-header{cursor:grab;display:flex;justify-content:space-between;padding:10px 24px;color:var(--md-color);font-weight:600;font-size:16px;line-height:22px;word-wrap:break-word;user-select:none;border-bottom:1px solid var(--md-border-color);position:relative}.md-editor-modal-body{padding:24px;font-size:14px;word-wrap:break-word;height:calc(100% - 61px);box-sizing:border-box}.md-editor-modal .md-editor-modal-func{position:absolute;top:10px;right:10px}.md-editor-modal .md-editor-modal-func .md-editor-modal-adjust,.md-editor-modal .md-editor-modal-func .md-editor-modal-close{cursor:pointer;width:24px;height:24px;line-height:24px;text-align:center;display:inline-block}.md-editor-modal .md-editor-modal-func .md-editor-modal-adjust{padding-right:10px}.animation{animation-duration:.15s;animation-fill-mode:forwards}@keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}50%{opacity:1}}.zoom-in{animation-name:zoomIn;animation-duration:.15s;animation-fill-mode:forwards}@keyframes zoomOut{0%{opacity:1}50%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}to{opacity:0}}.zoom-out{animation-name:zoomOut;animation-duration:.15s;animation-fill-mode:forwards}.md-editor-content{display:flex;flex:1;height:0;flex-shrink:0}.md-editor-input-wrapper{flex:1;box-sizing:border-box}.md-editor-html{font-size:16px;word-break:break-all}.md-editor-footer{height:24px;flex-shrink:0;font-size:12px;color:var(--md-color);border-top:1px solid var(--md-border-color);display:flex;justify-content:space-between}.md-editor-footer-item{display:inline-flex;align-items:center;height:100%;padding:0 10px}.md-editor-footer-label{padding-right:5px;line-height:1}.md-editor-clip{position:relative;display:flex;height:calc(100% - 32px)}.md-editor-clip-main,.md-editor-clip-preview{width:50%;height:100%;border:1px solid var(--md-border-color)}.md-editor-clip-main{margin-right:1em}.md-editor-clip-main .md-editor-clip-cropper{position:relative;width:100%;height:100%}.md-editor-clip-main .md-editor-clip-cropper .md-editor-clip-delete{position:absolute;top:0;right:0;font-size:0;background-color:var(--md-bk-color-outstand);border-bottom-left-radius:4px;color:var(--md-color);cursor:pointer}.md-editor-clip-main .md-editor-clip-upload{display:flex;align-items:center;justify-content:center;width:100%;height:100%;cursor:pointer}.md-editor-clip-main .md-editor-clip-upload .md-editor-icon{width:auto;height:40px}.md-editor-clip-preview-target{width:100%;height:100%;overflow:hidden}.md-editor-form-item{margin-bottom:14px;text-align:center}.md-editor-form-item:last-of-type{margin-bottom:0}.md-editor-label{font-size:14px;color:var(--md-color);width:80px;text-align:center;display:inline-block}.md-editor-input{border-radius:4px;padding:4px 11px;color:var(--md-color);font-size:14px;line-height:1.5715;background-color:var(--md-bk-color);background-image:none;border:1px solid var(--md-border-color);transition:all .2s}.md-editor-input:focus,.md-editor-input:hover{border-color:var(--md-border-hover-color);outline:0}.md-editor-input:focus{border-color:var(--md-border-active-color)}.md-editor-btn{font-weight:400;text-align:center;vertical-align:middle;cursor:pointer;border:1px solid var(--md-border-color);white-space:nowrap;user-select:none;height:32px;padding:0 15px;font-size:14px;border-radius:4px;transition:all .2s linear;color:var(--md-color);background-color:var(--md-bk-color);border-color:var(--md-border-color);margin-left:10px}.md-editor-btn:first-of-type{margin-left:0}.md-editor-btn:hover{color:var(--md-hover-color);background-color:var(--md-bk-color);border-color:var(--md-border-hover-color)}.md-editor-btn-row{width:100%}@media (max-width: 688px){.md-editor-modal-clip .md-editor-modal{max-width:calc(100% - 20px);max-height:calc(100% - 20px);margin:10px;left:0!important}.md-editor-modal-clip .md-editor-clip{flex-direction:column}.md-editor-modal-clip .md-editor-clip-main,.md-editor-modal-clip .md-editor-clip-preview{width:100%;height:0;flex:1}.md-editor-modal-clip .md-editor-clip-main{margin-bottom:1em}}.md-editor-menu{margin:0;padding:0;border-radius:3px;border:1px solid var(--md-border-color);background-color:inherit}.md-editor-menu-item{list-style:none;font-size:12px;color:var(--md-color);padding:4px 10px;cursor:pointer;line-height:16px}.md-editor-menu-item:first-of-type{padding-top:8px}.md-editor-menu-item:last-of-type{padding-bottom:8px}.md-editor-menu-item:hover{background-color:var(--md-bk-hover-color)}.md-editor-table-shape{padding:4px;border-radius:3px;border:1px solid var(--md-border-color);display:flex;flex-direction:column}.md-editor-table-shape-row{display:flex}.md-editor-table-shape-col{padding:2px;cursor:pointer}.md-editor-table-shape-col-default{width:16px;height:16px;background-color:#e0e0e0;border-radius:3px;transition:all .2s}.md-editor-table-shape-col-include{background-color:#aaa}.md-editor-toolbar-wrapper{overflow-x:auto;overflow-y:hidden;scrollbar-width:none;height:35px;flex-shrink:0;padding:4px;border-bottom:1px solid var(--md-border-color)}.md-editor-toolbar-wrapper::-webkit-scrollbar{height:0!important}.md-editor-toolbar-wrapper .md-editor-toolbar{height:100%;display:flex;justify-content:space-between;align-items:center;box-sizing:content-box}.md-editor-toolbar-wrapper .md-editor-toolbar-item{height:24px;display:inline-block;padding:0 4px;transition:all .3s;border-radius:0;cursor:pointer;list-style:none;user-select:none}.md-editor-toolbar-wrapper .md-editor-toolbar-item:hover{border-radius:3px;background-color:var(--md-bk-color-outstand)}.md-editor-toolbar-wrapper .md-editor-toolbar-left,.md-editor-toolbar-wrapper .md-editor-toolbar-right{padding:1px 0;display:flex;align-items:center}.md-editor-dark .md-editor-table-shape-col-default{background-color:#222}.md-editor-dark .md-editor-table-shape-col-include{background-color:#555}.cm-editor{font-size:14px;height:100%}.cm-editor.cm-focused{outline:none}.cm-editor .cm-tooltip.cm-tooltip-autocomplete{border-radius:3px}.cm-editor .cm-tooltip.cm-tooltip-autocomplete>ul{border-radius:3px;min-width:fit-content;max-width:fit-content}.cm-editor .cm-tooltip.cm-tooltip-autocomplete>ul li{background-color:var(--md-bk-color);color:var(--md-color);padding:4px 10px;line-height:16px}.cm-editor .cm-tooltip.cm-tooltip-autocomplete>ul li .cm-completionIcon{width:auto}.cm-editor .cm-tooltip.cm-tooltip-autocomplete>ul li[aria-selected]{background-color:var(--md-bk-hover-color)}.cm-editor .cm-tooltip.cm-tooltip-autocomplete .cm-completionInfo{margin-top:-2px;margin-left:3px;padding:4px 9px;border-radius:3px;overflow:hidden;background-color:var(--md-bk-hover-color);color:var(--md-color)}.cm-scroller{overflow-y:scroll}.cm-scroller .cm-content[contenteditable=true]{margin:10px}.cm-scroller .cm-gutters+.cm-content[contenteditable=true]{margin:0}.cm-scroller .cm-line{line-height:inherit}.\u037C1 .cm-scroller{font-family:source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;line-height:20px}.md-editor-catalog-editor{--md-color: #3f4a54;--md-hover-color: #000;--md-bk-color: #fff;--md-bk-color-outstand: #f6f6f6;--md-bk-hover-color: #f5f7fa;--md-border-color: #e6e6e6;--md-border-hover-color: #b9b9b9;--md-border-active-color: #999;--md-modal-mask: #00000073;--md-scrollbar-bg-color: #e2e2e2;--md-scrollbar-thumb-color: #0000004d;--md-scrollbar-thumb-hover-color: #00000059;--md-scrollbar-thumb-active-color: #00000061;position:absolute;overflow:auto;top:44px;right:0;height:calc(100% - 44px);background-color:var(--md-bk-color-outstand);border-left:1px solid var(--md-border-color);width:200px;box-sizing:border-box;margin:0;padding:5px 10px;font-size:14px;font-variant:tabular-nums;line-height:1.5715;list-style:none;font-feature-settings:"tnum";z-index:2}.md-editor-catalog>.md-editor-catalog-link{padding:5px 8px}.md-editor-catalog-link{padding:5px 0 5px 1em;line-height:1.2}.md-editor-catalog-link span{display:inline-block;width:100%;position:relative;overflow:hidden;color:var(--md-color);white-space:nowrap;text-overflow:ellipsis;transition:color .3s;cursor:pointer}.md-editor-catalog-link span:hover{color:#73d13d}.md-editor-catalog-wrapper>.md-editor-catalog-link{padding-top:5px;padding-bottom:5px}.md-editor-catalog-wrapper>.md-editor-catalog-link:first-of-type{padding-top:10px}.md-editor-catalog-wrapper>.md-editor-catalog-link:last-of-type{padding-bottom:0}.md-editor-catalog-active>span{color:#73d13d}.md-editor-catalog-dark{--md-color: #999;--md-hover-color: #bbb;--md-bk-color: #000;--md-bk-color-outstand: #111;--md-bk-hover-color: #1b1a1a;--md-border-color: #2d2d2d;--md-border-hover-color: #636262;--md-border-active-color: #777;--md-modal-mask: #00000073;--md-scrollbar-bg-color: #0f0f0f;--md-scrollbar-thumb-color: #2d2d2d;--md-scrollbar-thumb-hover-color: #3a3a3a;--md-scrollbar-thumb-active-color: #3a3a3a}.md-editor{--md-color: #3f4a54;--md-hover-color: #000;--md-bk-color: #fff;--md-bk-color-outstand: #f6f6f6;--md-bk-hover-color: #f5f7fa;--md-border-color: #e6e6e6;--md-border-hover-color: #b9b9b9;--md-border-active-color: #999;--md-modal-mask: #00000073;--md-scrollbar-bg-color: #e2e2e2;--md-scrollbar-thumb-color: #0000004d;--md-scrollbar-thumb-hover-color: #00000059;--md-scrollbar-thumb-active-color: #00000061;width:100%;height:500px;position:relative;box-sizing:border-box;border:1px solid var(--md-border-color);display:flex;flex-direction:column;overflow:hidden;color:var(--md-color);background-color:var(--md-bk-color);font-family:-apple-system,BlinkMacSystemFont,Segoe UI Variable,Segoe UI,system-ui,ui-sans-serif,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"}.md-editor ::-webkit-scrollbar{width:6px;height:6px}.md-editor ::-webkit-scrollbar-corner,.md-editor ::-webkit-scrollbar-track{background-color:var(--md-scrollbar-bg-color)}.md-editor ::-webkit-scrollbar-thumb{border-radius:2px;background-color:var(--md-scrollbar-thumb-color)}.md-editor ::-webkit-scrollbar-button:vertical{display:none}.md-editor ::-webkit-scrollbar-thumb:vertical:hover{background-color:var(--md-scrollbar-thumb-hover-color)}.md-editor ::-webkit-scrollbar-thumb:vertical:active{background-color:var(--md-scrollbar-thumb-active-color)}.md-editor .md-editor-fullscreen{position:fixed!important;top:0;right:0;bottom:0;left:0;width:auto!important;height:auto!important;z-index:10000}.md-editor-icon{width:24px;height:24px;fill:currentColor;overflow:hidden}.md-editor-preview-wrapper{position:relative;flex:1;box-sizing:border-box;overflow:auto;padding:10px 20px}.md-editor-preview{font-size:16px;word-break:break-all}.md-editor [data-show=false]{display:none}.md-editor-previewOnly{border:none;height:auto}.md-editor-previewOnly .md-editor-content{height:100%}.md-editor-previewOnly .md-editor-preview{padding:0}.md-editor-dark{--md-color: #999;--md-hover-color: #bbb;--md-bk-color: #000;--md-bk-color-outstand: #111;--md-bk-hover-color: #1b1a1a;--md-border-color: #2d2d2d;--md-border-hover-color: #636262;--md-border-active-color: #777;--md-modal-mask: #00000073;--md-scrollbar-bg-color: #0f0f0f;--md-scrollbar-thumb-color: #2d2d2d;--md-scrollbar-thumb-hover-color: #3a3a3a;--md-scrollbar-thumb-active-color: #3a3a3a}.medium-zoom-overlay,.medium-zoom-image--opened{z-index:100001}.md-editor-fullscreen{position:fixed!important;top:0;right:0;bottom:0;left:0;width:auto!important;height:auto!important;z-index:10000}[data-v-1ec61edd]::-webkit-scrollbar{display:none}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgba(0,0,0,0);--un-ring-shadow:0 0 rgba(0,0,0,0);--un-shadow-inset: ;--un-shadow:0 0 rgba(0,0,0,0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgba(0,0,0,0);--un-ring-shadow:0 0 rgba(0,0,0,0);--un-shadow-inset: ;--un-shadow:0 0 rgba(0,0,0,0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }:root,[data-theme]{background-color:hsla(var(--b1),var(--un-bg-opacity, 1));color:hsla(var(--bc),var(--un-text-opacity, 1))}html{-webkit-tap-highlight-color:transparent}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes button-pop{0%{transform:scale(var(--btn-focus-scale, .95))}40%{transform:scale(1.02)}to{transform:scale(1)}}@keyframes checkmark{0%{background-position-y:5px}50%{background-position-y:-2px}to{background-position-y:0}}@keyframes progress-loading{50%{left:107%}}@keyframes radiomark{0%{box-shadow:0 0 0 12px hsl(var(--b1)) inset,0 0 0 12px hsl(var(--b1)) inset}50%{box-shadow:0 0 0 3px hsl(var(--b1)) inset,0 0 0 3px hsl(var(--b1)) inset}to{box-shadow:0 0 0 4px hsl(var(--b1)) inset,0 0 0 4px hsl(var(--b1)) inset}}@keyframes rating-pop{0%{transform:translateY(-.125em)}40%{transform:translateY(-.125em)}to{transform:translateY(0)}}@keyframes toast-pop{0%{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}:root{color-scheme:light;--pf: 138.86, 15.982%, 34.353%;--sf: 96.923, 37.143%, 74.51%;--af: 0, 67.742%, 75.137%;--nf: 0, 3.9106%, 28.078%;--b2: 0, 4.3478%, 81.882%;--b3: 0, 4.3478%, 73.694%;--in: 198, 93%, 60%;--su: 158, 64%, 52%;--wa: 43, 96%, 56%;--er: 0, 91%, 71%;--pc: 138.86, 100%, 88.588%;--inc: 198, 100%, 12%;--suc: 158, 100%, 10%;--wac: 43, 100%, 11%;--erc: 0, 100%, 14%;--rounded-box: 1rem;--rounded-btn: .5rem;--rounded-badge: 1.9rem;--animation-btn: .25s;--animation-input: .2s;--btn-text-case: uppercase;--btn-focus-scale: .95;--border-btn: 1px;--tab-border: 1px;--tab-radius: .5rem;--p: 138.86, 15.982%, 42.941%;--s: 96.923, 37.143%, 93.137%;--sc: 96, 32.468%, 15.098%;--a: 0, 67.742%, 93.922%;--ac: 0, 21.951%, 16.078%;--n: 0, 3.9106%, 35.098%;--nc: 0, 4.3478%, 90.98%;--b1: 0, 4.3478%, 90.98%;--bc: 0, 3.2258%, 6.0784%}.i-carbon-add-alt{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M16 4c6.6 0 12 5.4 12 12s-5.4 12-12 12S4 22.6 4 16S9.4 4 16 4m0-2C8.3 2 2 8.3 2 16s6.3 14 14 14s14-6.3 14-14S23.7 2 16 2z'/%3E%3Cpath fill='currentColor' d='M24 15h-7V8h-2v7H8v2h7v7h2v-7h7z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon-alarm{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M16 28a11 11 0 1 1 11-11a11 11 0 0 1-11 11Zm0-20a9 9 0 1 0 9 9a9 9 0 0 0-9-9Z'/%3E%3Cpath fill='currentColor' d='M18.59 21L15 17.41V11h2v5.58l3 3.01L18.59 21zM4 7.592l3.582-3.589l1.416 1.413l-3.582 3.589zm19-2.184l1.415-1.413l3.581 3.589l-1.415 1.413z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon-camera{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M29 26H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h6.46l1.71-2.55A1 1 0 0 1 12 4h8a1 1 0 0 1 .83.45L22.54 7H29a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1ZM4 24h24V9h-6a1 1 0 0 1-.83-.45L19.46 6h-6.92l-1.71 2.55A1 1 0 0 1 10 9H4Z'/%3E%3Cpath fill='currentColor' d='M16 22a6 6 0 1 1 6-6a6 6 0 0 1-6 6Zm0-10a4 4 0 1 0 4 4a4 4 0 0 0-4-4Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon-close-outline{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2zm0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12z'/%3E%3Cpath fill='currentColor' d='M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon-document-download{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m30 25l-1.414-1.414L26 26.172V18h-2v8.172l-2.586-2.586L20 25l5 5l5-5z'/%3E%3Cpath fill='currentColor' d='M18 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6v3h2v-5a.91.91 0 0 0-.3-.7l-7-7A.909.909 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h10Zm0-23.6l5.6 5.6H18Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon-forward-5{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M26 18A10 10 0 1 1 16 8h4v5l6-6l-6-6v5h-4a12 12 0 1 0 12 12Z'/%3E%3Cpath fill='currentColor' d='M18.58 15.58h-3.45L15 18.15a4.83 4.83 0 0 1 .26-.45a1.59 1.59 0 0 1 .33-.35a1.53 1.53 0 0 1 .44-.23a2 2 0 0 1 .6-.08a2.54 2.54 0 0 1 .92.16a2.06 2.06 0 0 1 .74.48a2.28 2.28 0 0 1 .5.77a2.73 2.73 0 0 1 .18 1a2.87 2.87 0 0 1-.19 1.07a2.36 2.36 0 0 1-.55.84a2.44 2.44 0 0 1-.89.55a3.23 3.23 0 0 1-1.21.2a3.79 3.79 0 0 1-.94-.11a3 3 0 0 1-.74-.32a2.45 2.45 0 0 1-.55-.45a4.13 4.13 0 0 1-.41-.55l1.06-.81l.27.41a1.82 1.82 0 0 0 .34.34a1.59 1.59 0 0 0 .43.22a1.52 1.52 0 0 0 .55.08a1.29 1.29 0 0 0 1-.36a1.41 1.41 0 0 0 .33-1v-.06a1.18 1.18 0 0 0-1.28-1.27a1.44 1.44 0 0 0-.77.18a1.94 1.94 0 0 0-.48.39l-1.19-.17l.29-4.31h4.52Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon-headphones{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M25 16v-1a9 9 0 0 0-18 0v1a5 5 0 0 0 0 10h2V15a7 7 0 0 1 14 0v11h2a5 5 0 0 0 0-10ZM4 21a3 3 0 0 1 3-3v6a3 3 0 0 1-3-3Zm21 3v-6a3 3 0 0 1 0 6Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon-image{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M19 14a3 3 0 1 0-3-3a3 3 0 0 0 3 3Zm0-4a1 1 0 1 1-1 1a1 1 0 0 1 1-1Z'/%3E%3Cpath fill='currentColor' d='M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 22H6v-6l5-5l5.59 5.59a2 2 0 0 0 2.82 0L21 19l5 5Zm0-4.83l-3.59-3.59a2 2 0 0 0-2.82 0L18 19.17l-5.59-5.59a2 2 0 0 0-2.82 0L6 17.17V6h20Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon-notebook{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M19 10h7v2h-7zm0 5h7v2h-7zm0 5h7v2h-7z'/%3E%3Cpath fill='currentColor' d='M28 5H4a2.002 2.002 0 0 0-2 2v18a2.002 2.002 0 0 0 2 2h24a2.003 2.003 0 0 0 2-2V7a2.002 2.002 0 0 0-2-2ZM4 7h11v18H4Zm13 18V7h11l.002 18Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon-rewind-5{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M4 18A12 12 0 1 0 16 6h-4V1L6 7l6 6V8h4A10 10 0 1 1 6 18Z'/%3E%3Cpath fill='currentColor' d='M18.58 15.58h-3.45L15 18.15a4.83 4.83 0 0 1 .26-.45a1.59 1.59 0 0 1 .33-.35a1.53 1.53 0 0 1 .44-.23a2 2 0 0 1 .6-.08a2.54 2.54 0 0 1 .92.16a2.06 2.06 0 0 1 .74.48a2.28 2.28 0 0 1 .5.77a2.73 2.73 0 0 1 .18 1a2.87 2.87 0 0 1-.19 1.07a2.36 2.36 0 0 1-.55.84a2.44 2.44 0 0 1-.89.55a3.23 3.23 0 0 1-1.21.2a3.79 3.79 0 0 1-.94-.11a3 3 0 0 1-.74-.32a2.45 2.45 0 0 1-.55-.45a4.13 4.13 0 0 1-.41-.55l1.06-.81l.27.41a1.82 1.82 0 0 0 .34.34a1.59 1.59 0 0 0 .43.22a1.52 1.52 0 0 0 .55.08a1.29 1.29 0 0 0 1-.36a1.41 1.41 0 0 0 .33-1v-.06a1.18 1.18 0 0 0-1.28-1.27a1.44 1.44 0 0 0-.77.18a1.94 1.94 0 0 0-.48.39l-1.19-.17l.29-4.31h4.52Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon-string-text{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M29 22h-5a2.003 2.003 0 0 1-2-2v-6a2.002 2.002 0 0 1 2-2h5v2h-5v6h5zM18 12h-4V8h-2v14h6a2.003 2.003 0 0 0 2-2v-6a2.002 2.002 0 0 0-2-2zm-4 8v-6h4v6zm-6-8H3v2h5v2H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h6v-8a2.002 2.002 0 0 0-2-2zm0 8H4v-2h4z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon-trash-can{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M12 12h2v12h-2zm6 0h2v12h-2z'/%3E%3Cpath fill='currentColor' d='M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20zm4-26h8v2h-8z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon-video{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M21 26H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h17a2 2 0 0 1 2 2v4.06l5.42-3.87A1 1 0 0 1 30 9v14a1 1 0 0 1-1.58.81L23 19.94V24a2 2 0 0 1-2 2ZM4 8v16h17v-6a1 1 0 0 1 1.58-.81L28 21.06V10.94l-5.42 3.87A1 1 0 0 1 21 14V8Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.center{display:flex;align-items:center;justify-content:center}.text{font-size:1.125rem;line-height:1.75rem;font-weight:700}@media (min-width: 640px){.text{font-size:1.5rem;line-height:2rem}}@media (min-width: 768px){.text{font-size:1.875rem;line-height:2.25rem}}@media (min-width: 1024px){.text{font-size:2.25rem;line-height:2.5rem}}.btn{display:inline-flex;flex-shrink:0;cursor:pointer;user-select:none;flex-wrap:wrap;align-items:center;justify-content:center;border-color:transparent;border-color:hsl(var(--n),var(--un-border-opacity));text-align:center;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1);border-radius:var(--rounded-btn, .5rem);height:3rem;padding-left:1rem;padding-right:1rem;font-size:.875rem;line-height:1.25rem;line-height:1em;min-height:3rem;font-weight:600;text-transform:uppercase;text-transform:var(--btn-text-case, uppercase);text-decoration-line:none;border-width:var(--border-btn, 1px);animation:button-pop var(--animation-btn, .25s) ease-out;--un-border-opacity: 1;--un-bg-opacity: 1;background-color:hsl(var(--n),var(--un-bg-opacity));--un-text-opacity: 1;color:hsl(var(--nc),var(--un-text-opacity))}.btn.loading,.btn.loading:hover{pointer-events:none}.btn.loading:before{margin-right:.5rem;height:1rem;width:1rem;border-radius:9999px;border-width:2px;animation:spin 2s linear infinite;content:"";border-top-color:transparent;border-left-color:transparent;border-bottom-color:currentColor;border-right-color:currentColor}.btn.loading:before{animation:spin 10s linear infinite}.btn:active:hover,.btn:active:focus{animation:none}.btn:not(.no-animation):active:hover,.btn:not(.no-animation):active:focus{transform:scale(var(--btn-focus-scale, .95))}.btn:hover,.btn-active{--un-border-opacity: 1;border-color:hsl(var(--nf, var(--n)),var(--un-border-opacity));--un-bg-opacity: 1;background-color:hsl(var(--nf, var(--n)),var(--un-bg-opacity))}.btn:focus-visible{outline:2px solid hsl(var(--nf));outline-offset:2px}.btn.glass:hover,.btn.glass.btn-active{--glass-opacity: 25%;--glass-border-opacity: 15%}.btn.glass:focus-visible{outline:2px solid currentColor}.btn.loading.btn-square:before,.btn.loading.btn-circle:before{margin-right:0}.btn.loading.btn-xl:before,.btn.loading.btn-lg:before{height:1.25rem;width:1.25rem}.btn.loading.btn-sm:before,.btn.loading.btn-xs:before{height:.75rem;width:.75rem}.btn-square{height:3rem;width:3rem;padding:0}.btn-square:where(.btn-xs){height:1.5rem;width:1.5rem;padding:0}.btn-square:where(.btn-sm){height:2rem;width:2rem;padding:0}.btn-square:where(.btn-md){height:3rem;width:3rem;padding:0}.btn-square:where(.btn-lg){height:4rem;width:4rem;padding:0}.checkbox{flex-shrink:0;--chkbg: var(--bc);--chkfg: var(--b1);height:1.5rem;width:1.5rem;cursor:pointer;appearance:none;border-width:1px;border-color:hsl(var(--bc),var(--un-border-opacity));--un-border-opacity: .2;border-radius:var(--rounded-btn, .5rem)}.checkbox:focus-visible{outline:2px solid hsl(var(--bc));outline-offset:2px}.checkbox:checked,.checkbox[checked=true],.checkbox[aria-checked=true]{--un-bg-opacity: 1;background-color:hsl(var(--bc),var(--un-bg-opacity));background-repeat:no-repeat;animation:checkmark var(--animation-input, .2s) ease-in-out;background-image:linear-gradient(-45deg,transparent 65%,hsl(var(--chkbg)) 65.99%),linear-gradient(45deg,transparent 75%,hsl(var(--chkbg)) 75.99%),linear-gradient(-45deg,hsl(var(--chkbg)) 40%,transparent 40.99%),linear-gradient(45deg,hsl(var(--chkbg)) 30%,hsl(var(--chkfg)) 30.99%,hsl(var(--chkfg)) 40%,transparent 40.99%),linear-gradient(-45deg,hsl(var(--chkfg)) 50%,hsl(var(--chkbg)) 50.99%)}.checkbox:indeterminate{--un-bg-opacity: 1;background-color:hsl(var(--bc),var(--un-bg-opacity));background-repeat:no-repeat;animation:checkmark var(--animation-input, .2s) ease-in-out;background-image:linear-gradient(90deg,transparent 80%,hsl(var(--chkbg)) 80%),linear-gradient(-90deg,transparent 80%,hsl(var(--chkbg)) 80%),linear-gradient(0deg,hsl(var(--chkbg)) 43%,hsl(var(--chkfg)) 43%,hsl(var(--chkfg)) 57%,hsl(var(--chkbg)) 57%)}.checkbox:disabled{cursor:not-allowed;border-color:transparent;--un-bg-opacity: 1;background-color:hsl(var(--bc),var(--un-bg-opacity));opacity:.2}[dir=rtl] .checkbox:checked,[dir=rtl] .checkbox[checked=true],[dir=rtl] .checkbox[aria-checked=true]{background-image:linear-gradient(45deg,transparent 65%,hsl(var(--chkbg)) 65.99%),linear-gradient(-45deg,transparent 75%,hsl(var(--chkbg)) 75.99%),linear-gradient(45deg,hsl(var(--chkbg)) 40%,transparent 40.99%),linear-gradient(-45deg,hsl(var(--chkbg)) 30%,hsl(var(--chkfg)) 30.99%,hsl(var(--chkfg)) 40%,transparent 40.99%),linear-gradient(45deg,hsl(var(--chkfg)) 50%,hsl(var(--chkbg)) 50.99%)}.dropdown{position:relative;display:inline-block}.dropdown>*:focus{outline:2px solid transparent;outline-offset:2px}.dropdown .dropdown-content{visibility:hidden;position:absolute;z-index:50;opacity:0;transform-origin:top;--un-scale-x: .95;--un-scale-y: .95;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y));transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1)}.dropdown.dropdown-open .dropdown-content,.dropdown.dropdown-hover:hover .dropdown-content,.dropdown:not(.dropdown-hover):focus .dropdown-content,.dropdown:not(.dropdown-hover):focus-within .dropdown-content{visibility:visible;opacity:1}.dropdown.dropdown-open .dropdown-content,.dropdown.dropdown-hover:hover .dropdown-content,.dropdown:focus .dropdown-content,.dropdown:focus-within .dropdown-content{--un-scale-x: 1;--un-scale-y: 1;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.label{display:flex;user-select:none;align-items:center;justify-content:space-between;padding:.5rem .25rem}.label a:hover{--un-text-opacity: 1;color:hsl(var(--bc),var(--un-text-opacity))}.input{flex-shrink:1;height:3rem;padding-left:1rem;padding-right:1rem;font-size:.875rem;font-size:1rem;line-height:1.25rem;line-height:2;line-height:1.5rem;border-width:1px;border-color:hsl(var(--bc),var(--un-border-opacity));--un-border-opacity: 0;--un-bg-opacity: 1;background-color:hsl(var(--b1),var(--un-bg-opacity));border-radius:var(--rounded-btn, .5rem)}.input[list]::-webkit-calendar-picker-indicator{line-height:1em}.input:focus{outline:2px solid hsla(var(--bc),.2);outline-offset:2px}.link{cursor:pointer;text-decoration-line:underline}.link:focus{outline:2px solid transparent;outline-offset:2px}.link:focus-visible{outline:2px solid currentColor;outline-offset:2px}.menu{display:flex;flex-direction:column;flex-wrap:wrap}.menu.horizontal{display:inline-flex;flex-direction:row}.menu.horizontal :where(li){flex-direction:row}:where(.menu li){position:relative;display:flex;flex-shrink:0;flex-direction:column;flex-wrap:wrap;align-items:stretch}.menu :where(li:not(.menu-title))>:where(*:not(ul)){display:flex}.menu :where(li:not(.disabled):not(.menu-title))>:where(*:not(ul)){cursor:pointer;user-select:none;align-items:center;outline:2px solid transparent;outline-offset:2px}.menu>:where(li > *:not(ul):focus){outline:2px solid transparent;outline-offset:2px}.menu>:where(li.disabled > *:not(ul):focus){cursor:auto}.menu>:where(li) :where(ul){display:flex;flex-direction:column;align-items:stretch}.menu>:where(li)>:where(ul){position:absolute;display:none;top:initial;left:100%;border-top-left-radius:inherit;border-top-right-radius:inherit;border-bottom-right-radius:inherit;border-bottom-left-radius:inherit}.menu>:where(li:hover)>:where(ul){display:flex}.menu>:where(li:focus)>:where(ul){display:flex}.menu.horizontal>li.bordered>a,.menu.horizontal>li.bordered>button,.menu.horizontal>li.bordered>span{border-left-width:0px;border-bottom-width:4px;--un-border-opacity: 1;border-color:hsl(var(--p),var(--un-border-opacity))}.menu[class*=" px-"]:not(.menu[class*=" px-0"]) li>*,.menu[class^=px-]:not(.menu[class^="px-0"]) li>*,.menu[class*=" p-"]:not(.menu[class*=" p-0"]) li>*,.menu[class^=p-]:not(.menu[class^="p-0"]) li>*{border-radius:var(--rounded-btn, .5rem)}.menu :where(li.bordered > *){border-left-width:4px;--un-border-opacity: 1;border-color:hsl(var(--p),var(--un-border-opacity))}.menu :where(li)>:where(*:not(ul)){gap:.75rem;padding:.75rem 1rem;color:currentColor}.menu :where(li:not(.menu-title):not(:empty))>:where(*:not(ul):focus),.menu :where(li:not(.menu-title):not(:empty))>:where(*:not(ul):hover){background-color:hsl(var(--bc),var(--un-bg-opacity));--un-bg-opacity: .1}.menu :where(li:not(.menu-title):not(:empty))>:where(:not(ul).active),.menu :where(li:not(.menu-title):not(:empty))>:where(*:not(ul):active){--un-bg-opacity: 1;background-color:hsl(var(--p),var(--un-bg-opacity));--un-text-opacity: 1;color:hsl(var(--pc),var(--un-text-opacity))}.menu :where(li:empty){margin:.5rem 1rem;height:1px;background-color:hsl(var(--bc),var(--un-bg-opacity));--un-bg-opacity: .1}.menu li.disabled>*{user-select:none;color:hsl(var(--bc),var(--un-text-opacity));--un-text-opacity: .2}.menu li.disabled>*:hover{background-color:transparent}.menu li.hover-bordered a{border-left-width:4px;border-color:transparent}.menu li.hover-bordered a:hover{--un-border-opacity: 1;border-color:hsl(var(--p),var(--un-border-opacity))}.menu.compact li>a,.menu.compact li>span{padding-top:.5rem;padding-bottom:.5rem;font-size:.875rem;line-height:1.25rem}.menu .menu-title{font-size:.75rem;line-height:1rem;font-weight:700;opacity:.4}.menu .menu-title>*{padding-top:.25rem;padding-bottom:.25rem}.menu :where(li:not(.disabled))>:where(*:not(ul)){outline:2px solid transparent;outline-offset:2px;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1)}.menu>:where(li:first-child){border-top-left-radius:inherit;border-top-right-radius:inherit;border-bottom-right-radius:unset;border-bottom-left-radius:unset}.menu>:where(li:first-child)>:where(:not(ul)){border-top-left-radius:inherit;border-top-right-radius:inherit;border-bottom-right-radius:unset;border-bottom-left-radius:unset}.menu>:where(li:last-child){border-top-left-radius:unset;border-top-right-radius:unset;border-bottom-right-radius:inherit;border-bottom-left-radius:inherit}.menu>:where(li:last-child)>:where(:not(ul)){border-top-left-radius:unset;border-top-right-radius:unset;border-bottom-right-radius:inherit;border-bottom-left-radius:inherit}.menu>:where(li:first-child:last-child){border-top-left-radius:inherit;border-top-right-radius:inherit;border-bottom-right-radius:inherit;border-bottom-left-radius:inherit}.menu>:where(li:first-child:last-child)>:where(:not(ul)){border-top-left-radius:inherit;border-top-right-radius:inherit;border-bottom-right-radius:inherit;border-bottom-left-radius:inherit}.menu>:where(li)>:where(ul) :where(li){width:100%;white-space:nowrap}.menu>:where(li)>:where(ul) :where(li) :where(ul){padding-left:1rem}.menu>:where(li)>:where(ul) :where(li)>:where(:not(ul)){width:100%;white-space:nowrap}.menu>:where(li)>:where(ul)>:where(li:first-child){border-top-left-radius:inherit;border-top-right-radius:inherit;border-bottom-right-radius:unset;border-bottom-left-radius:unset}.menu>:where(li)>:where(ul)>:where(li:first-child)>:where(:not(ul)){border-top-left-radius:inherit;border-top-right-radius:inherit;border-bottom-right-radius:unset;border-bottom-left-radius:unset}.menu>:where(li)>:where(ul)>:where(li:last-child){border-top-left-radius:unset;border-top-right-radius:unset;border-bottom-right-radius:inherit;border-bottom-left-radius:inherit}.menu>:where(li)>:where(ul)>:where(li:last-child)>:where(:not(ul)){border-top-left-radius:unset;border-top-right-radius:unset;border-bottom-right-radius:inherit;border-bottom-left-radius:inherit}.menu>:where(li)>:where(ul)>:where(li:first-child:last-child){border-top-left-radius:inherit;border-top-right-radius:inherit;border-bottom-right-radius:inherit;border-bottom-left-radius:inherit}.menu>:where(li)>:where(ul)>:where(li:first-child:last-child)>:where(:not(ul)){border-top-left-radius:inherit;border-top-right-radius:inherit;border-bottom-right-radius:inherit;border-bottom-left-radius:inherit}.modal{pointer-events:none;visibility:hidden;position:fixed;inset:0px;display:flex;justify-content:center;opacity:0;z-index:999;background-color:hsl(var(--nf, var(--n)),var(--un-bg-opacity));--un-bg-opacity: .4;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-property:transform,opacity,visibility;overflow-y:hidden;overscroll-behavior:contain}:where(.modal){align-items:center}.modal-open,.modal:target,.modal-toggle:checked+.modal{pointer-events:auto;visibility:visible;opacity:1}.modal-box{max-height:calc(100vh - 5em);--un-bg-opacity: 1;background-color:hsl(var(--b1),var(--un-bg-opacity));padding:1.5rem;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1);width:91.666667%;max-width:32rem;--un-scale-x: .9;--un-scale-y: .9;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y));border-top-left-radius:var(--rounded-box, 1rem);border-top-right-radius:var(--rounded-box, 1rem);border-bottom-left-radius:var(--rounded-box, 1rem);border-bottom-right-radius:var(--rounded-box, 1rem);box-shadow:0 25px 50px -12px #00000040;overflow-y:auto;overscroll-behavior:contain}.modal-action{display:flex;margin-top:1.5rem;justify-content:flex-end}.modal-action>:not([hidden])~:not([hidden]){--un-space-x-reverse: 0;margin-right:calc(.5rem * var(--un-space-x-reverse));margin-left:calc(.5rem * calc(1 - var(--un-space-x-reverse)))}.modal-toggle{position:fixed;height:0px;width:0px;appearance:none;opacity:0}.modal-open .modal-box,.modal-toggle:checked+.modal .modal-box,.modal:target .modal-box{--un-translate-y: 0px;--un-scale-x: 1;--un-scale-y: 1;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.navbar{display:flex;align-items:center;padding:var(--navbar-padding, .5rem);min-height:4rem;width:100%}:where(.navbar > *){display:inline-flex;align-items:center}.range{height:1.5rem;width:100%;cursor:pointer;appearance:none;-webkit-appearance:none;--range-shdw: var(--bc);overflow:hidden;background-color:transparent;border-radius:var(--rounded-box, 1rem)}.range:focus{outline:none}.range:focus-visible::-webkit-slider-thumb{--focus-shadow: 0 0 0 6px hsl(var(--b1)) inset, 0 0 0 2rem hsl(var(--range-shdw)) inset}.range:focus-visible::-moz-range-thumb{--focus-shadow: 0 0 0 6px hsl(var(--b1)) inset, 0 0 0 2rem hsl(var(--range-shdw)) inset}.range::-webkit-slider-runnable-track{height:.5rem;width:100%;border-radius:var(--rounded-box, 1rem);background-color:hsla(var(--bc),.1)}.range::-moz-range-track{height:.5rem;width:100%;border-radius:var(--rounded-box, 1rem);background-color:hsla(var(--bc),.1)}.range::-webkit-slider-thumb{background-color:hsl(var(--b1));position:relative;height:1.5rem;width:1.5rem;border-style:none;border-radius:var(--rounded-box, 1rem);appearance:none;-webkit-appearance:none;top:50%;color:hsl(var(--range-shdw));transform:translateY(-50%);--filler-size: 100rem;--filler-offset: .6rem;box-shadow:0 0 0 3px hsl(var(--range-shdw)) inset,var(--focus-shadow, 0 0),calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size)}.range::-moz-range-thumb{background-color:hsl(var(--b1));position:relative;height:1.5rem;width:1.5rem;border-style:none;border-radius:var(--rounded-box, 1rem);top:50%;color:hsl(var(--range-shdw));--filler-size: 100rem;--filler-offset: .5rem;box-shadow:0 0 0 3px hsl(var(--range-shdw)) inset,var(--focus-shadow, 0 0),calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size)}.select{display:inline-flex;flex-shrink:0;cursor:pointer;user-select:none;appearance:none;height:3rem;padding-left:1rem;padding-right:2.5rem;font-size:.875rem;line-height:1.25rem;line-height:2;min-height:3rem;border-width:1px;border-color:hsl(var(--bc),var(--un-border-opacity));--un-border-opacity: 0;--un-bg-opacity: 1;background-color:hsl(var(--b1),var(--un-bg-opacity));font-weight:600;border-radius:var(--rounded-btn, .5rem);background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 20px) calc(1px + 50%),calc(100% - 16px) calc(1px + 50%);background-size:4px 4px,4px 4px;background-repeat:no-repeat}.select[multiple]{height:auto}.select:focus{outline:2px solid hsla(var(--bc),.2);outline-offset:2px}[dir=rtl] .select{background-position:calc(0% + 12px) calc(1px + 50%),calc(0% + 16px) calc(1px + 50%)}.tooltip{position:relative;display:inline-block;--tooltip-offset: calc(100% + 1px + var(--tooltip-tail, 0px));text-align:center;--tooltip-tail: 3px;--tooltip-color: hsl(var(--n));--tooltip-text-color: hsl(var(--nc));--tooltip-tail-offset: calc(100% + 1px - var(--tooltip-tail))}.tooltip:before{position:absolute;pointer-events:none;z-index:999;content:var(--un-content);--un-content: attr(data-tip);max-width:20rem;border-radius:.25rem;padding:.25rem .5rem;font-size:.875rem;line-height:1.25rem;background-color:var(--tooltip-color);color:var(--tooltip-text-color);width:max-content}.tooltip:before,.tooltip-top:before{transform:translate(-50%);top:auto;left:50%;right:auto;bottom:var(--tooltip-offset)}.tooltip:before,.tooltip:after{opacity:0;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-delay:.1s;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1)}.tooltip:after{position:absolute;content:"";border-style:solid;border-width:var(--tooltip-tail, 0);width:0;height:0;display:block}.tooltip.tooltip-open:before,.tooltip.tooltip-open:after,.tooltip:hover:before,.tooltip:hover:after{opacity:1;transition-delay:75ms}.tooltip:not([data-tip]):hover:before,.tooltip:not([data-tip]):hover:after{visibility:hidden;opacity:0}.tooltip:after,.tooltip-top:after{transform:translate(-50%);border-color:var(--tooltip-color) transparent transparent transparent;top:auto;left:50%;right:auto;bottom:var(--tooltip-tail-offset)}.tooltip-bottom:before{transform:translate(-50%);top:var(--tooltip-offset);left:50%;right:auto;bottom:auto}.tooltip-bottom:after{transform:translate(-50%);border-color:transparent transparent var(--tooltip-color) transparent;top:var(--tooltip-tail-offset);left:50%;right:auto;bottom:auto}.btn-ghost{border-width:1px;border-color:transparent;background-color:transparent;color:currentColor}.btn-ghost:hover,.btn-ghost.btn-active{--un-border-opacity: 0;background-color:hsl(var(--bc),var(--un-bg-opacity));--un-bg-opacity: .2}.btn-ghost:focus-visible{outline:2px solid currentColor}.input-bordered{--un-border-opacity: .2}.range-primary{--range-shdw: var(--p)}.rounded-box{border-radius:var(--rounded-box, 1rem)}.btn-md{height:3rem;padding-left:1rem;padding-right:1rem;min-height:3rem;font-size:.875rem}.range-xs{height:1rem}.range-xs::-webkit-slider-runnable-track{height:.25rem}.range-xs::-moz-range-track{height:.25rem}.range-xs::-webkit-slider-thumb{height:1rem;width:1rem;--filler-offset: .4rem}.range-xs::-moz-range-thumb{height:1rem;width:1rem;--filler-offset: .4rem}.absolute{position:absolute}.fixed{position:fixed}.bottom-6{bottom:1.5rem}.top-0{top:0}.z-999{z-index:999}.z-99999{z-index:99999}.ml-2{margin-left:.5rem}.block{display:block}.h-5{height:1.25rem}.h-6{height:1.5rem}.h-8{height:2rem}.h-full{height:100%}.h3{height:.75rem}.max-h-80{max-height:20rem}.max-h-9\\/10{max-height:90%}.max-w-xs{max-width:20rem}.w-18{width:4.5rem}.w-40{width:10rem}.w-5{width:1.25rem}.w-50{width:12.5rem}.w-6{width:1.5rem}.w-8{width:2rem}.w-full{width:100%}.flex{display:flex}.flex-1{flex:1 1 0%}.flex-none{flex:none}.flex-col{flex-direction:column}.table{display:table}.gap-2{grid-gap:.5rem;gap:.5rem}.gap-4{grid-gap:1rem;gap:1rem}.overflow-y-scroll{overflow-y:scroll}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rounded-xl{border-radius:.75rem}.bg-\\[\\#01a3d9\\]{--un-bg-opacity:1;background-color:rgba(1,163,217,var(--un-bg-opacity))}.bg-\\[\\#fc80a1\\],.hover\\:bg-\\[\\#fc80a1\\]:hover{--un-bg-opacity:1;background-color:rgba(252,128,161,var(--un-bg-opacity))}.bg-\\[\\#fc80a1\\]\\!{--un-bg-opacity:1 !important;background-color:rgba(252,128,161,var(--un-bg-opacity))!important}.bg-base-100{--un-bg-opacity:1;background-color:hsla(var(--b1),var(--un-bg-opacity))}.p-3{padding:.75rem}.px{padding-left:1rem;padding-right:1rem}.px-2{padding-left:.5rem;padding-right:.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.font-bold{font-weight:700}.normal-case{text-transform:none}.italic{font-style:italic}.hover\\:text-white\\!:hover,.text-white\\!{--un-text-opacity:1 !important;color:rgba(255,255,255,var(--un-text-opacity))!important}.text-black{--un-text-opacity:1;color:rgba(0,0,0,var(--un-text-opacity))}.text-black\\/70{color:#000000b3}.text-blue\\!{--un-text-opacity:1 !important;color:rgba(96,165,250,var(--un-text-opacity))!important}.text-white{--un-text-opacity:1;color:rgba(255,255,255,var(--un-text-opacity))}.underline{text-decoration-line:underline}.hover\\:shadow-md:hover{--un-shadow:var(--un-shadow-inset) 0 4px 6px -1px var(--un-shadow-color, rgba(0,0,0,.1)),var(--un-shadow-inset) 0 2px 4px -2px var(--un-shadow-color, rgba(0,0,0,.1));box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)}.shadow-lg{--un-shadow:var(--un-shadow-inset) 0 10px 15px -3px var(--un-shadow-color, rgba(0,0,0,.1)),var(--un-shadow-inset) 0 4px 6px -4px var(--un-shadow-color, rgba(0,0,0,.1));box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)} `);

(function (vue, localforage, mdEditorV3, axios, JSZip, dayjs) {
  'use strict';

  const M = {
    name: "splitpanes",
    emits: ["ready", "resize", "resized", "pane-click", "pane-maximize", "pane-add", "pane-remove", "splitter-click"],
    props: {
      horizontal: { type: Boolean },
      pushOtherPanes: { type: Boolean, default: true },
      dblClickSplitter: { type: Boolean, default: true },
      rtl: { type: Boolean, default: false },
      firstSplitter: { type: Boolean }
    },
    provide() {
      return {
        requestUpdate: this.requestUpdate,
        onPaneAdd: this.onPaneAdd,
        onPaneRemove: this.onPaneRemove,
        onPaneClick: this.onPaneClick
      };
    },
    data: () => ({
      container: null,
      ready: false,
      panes: [],
      touch: {
        mouseDown: false,
        dragging: false,
        activeSplitter: null
      },
      splitterTaps: {
        splitter: null,
        timeoutId: null
      }
    }),
    computed: {
      panesCount() {
        return this.panes.length;
      },
      indexedPanes() {
        return this.panes.reduce((e, i) => (e[i.id] = i) && e, {});
      }
    },
    methods: {
      updatePaneComponents() {
        this.panes.forEach((e) => {
          e.update && e.update({
            [this.horizontal ? "height" : "width"]: `${this.indexedPanes[e.id].size}%`
          });
        });
      },
      bindEvents() {
        document.addEventListener("mousemove", this.onMouseMove, { passive: false }), document.addEventListener("mouseup", this.onMouseUp), "ontouchstart" in window && (document.addEventListener("touchmove", this.onMouseMove, { passive: false }), document.addEventListener("touchend", this.onMouseUp));
      },
      unbindEvents() {
        document.removeEventListener("mousemove", this.onMouseMove, { passive: false }), document.removeEventListener("mouseup", this.onMouseUp), "ontouchstart" in window && (document.removeEventListener("touchmove", this.onMouseMove, { passive: false }), document.removeEventListener("touchend", this.onMouseUp));
      },
      onMouseDown(e, i) {
        this.bindEvents(), this.touch.mouseDown = true, this.touch.activeSplitter = i;
      },
      onMouseMove(e) {
        this.touch.mouseDown && (e.preventDefault(), this.touch.dragging = true, this.calculatePanesSize(this.getCurrentMouseDrag(e)), this.$emit("resize", this.panes.map((i) => ({ min: i.min, max: i.max, size: i.size }))));
      },
      onMouseUp() {
        this.touch.dragging && this.$emit("resized", this.panes.map((e) => ({ min: e.min, max: e.max, size: e.size }))), this.touch.mouseDown = false, setTimeout(() => {
          this.touch.dragging = false, this.unbindEvents();
        }, 100);
      },
      onSplitterClick(e, i) {
        "ontouchstart" in window && (e.preventDefault(), this.dblClickSplitter && (this.splitterTaps.splitter === i ? (clearTimeout(this.splitterTaps.timeoutId), this.splitterTaps.timeoutId = null, this.onSplitterDblClick(e, i), this.splitterTaps.splitter = null) : (this.splitterTaps.splitter = i, this.splitterTaps.timeoutId = setTimeout(() => {
          this.splitterTaps.splitter = null;
        }, 500)))), this.touch.dragging || this.$emit("splitter-click", this.panes[i]);
      },
      onSplitterDblClick(e, i) {
        let s = 0;
        this.panes = this.panes.map((n, t) => (n.size = t === i ? n.max : n.min, t !== i && (s += n.min), n)), this.panes[i].size -= s, this.$emit("pane-maximize", this.panes[i]), this.$emit("resized", this.panes.map((n) => ({ min: n.min, max: n.max, size: n.size })));
      },
      onPaneClick(e, i) {
        this.$emit("pane-click", this.indexedPanes[i]);
      },
      getCurrentMouseDrag(e) {
        const i = this.container.getBoundingClientRect(), { clientX: s, clientY: n } = "ontouchstart" in window && e.touches ? e.touches[0] : e;
        return {
          x: s - i.left,
          y: n - i.top
        };
      },
      getCurrentDragPercentage(e) {
        e = e[this.horizontal ? "y" : "x"];
        const i = this.container[this.horizontal ? "clientHeight" : "clientWidth"];
        return this.rtl && !this.horizontal && (e = i - e), e * 100 / i;
      },
      calculatePanesSize(e) {
        const i = this.touch.activeSplitter;
        let s = {
          prevPanesSize: this.sumPrevPanesSize(i),
          nextPanesSize: this.sumNextPanesSize(i),
          prevReachedMinPanes: 0,
          nextReachedMinPanes: 0
        };
        const n = 0 + (this.pushOtherPanes ? 0 : s.prevPanesSize), t = 100 - (this.pushOtherPanes ? 0 : s.nextPanesSize), a = Math.max(Math.min(this.getCurrentDragPercentage(e), t), n);
        let r = [i, i + 1], o = this.panes[r[0]] || null, h2 = this.panes[r[1]] || null;
        const l = o.max < 100 && a >= o.max + s.prevPanesSize, u = h2.max < 100 && a <= 100 - (h2.max + this.sumNextPanesSize(i + 1));
        if (l || u) {
          l ? (o.size = o.max, h2.size = Math.max(100 - o.max - s.prevPanesSize - s.nextPanesSize, 0)) : (o.size = Math.max(100 - h2.max - s.prevPanesSize - this.sumNextPanesSize(i + 1), 0), h2.size = h2.max);
          return;
        }
        if (this.pushOtherPanes) {
          const d = this.doPushOtherPanes(s, a);
          if (!d)
            return;
          (({ sums: s, panesToResize: r } = d)), o = this.panes[r[0]] || null, h2 = this.panes[r[1]] || null;
        }
        o !== null && (o.size = Math.min(Math.max(a - s.prevPanesSize - s.prevReachedMinPanes, o.min), o.max)), h2 !== null && (h2.size = Math.min(Math.max(100 - a - s.nextPanesSize - s.nextReachedMinPanes, h2.min), h2.max));
      },
      doPushOtherPanes(e, i) {
        const s = this.touch.activeSplitter, n = [s, s + 1];
        return i < e.prevPanesSize + this.panes[n[0]].min && (n[0] = this.findPrevExpandedPane(s).index, e.prevReachedMinPanes = 0, n[0] < s && this.panes.forEach((t, a) => {
          a > n[0] && a <= s && (t.size = t.min, e.prevReachedMinPanes += t.min);
        }), e.prevPanesSize = this.sumPrevPanesSize(n[0]), n[0] === void 0) ? (e.prevReachedMinPanes = 0, this.panes[0].size = this.panes[0].min, this.panes.forEach((t, a) => {
          a > 0 && a <= s && (t.size = t.min, e.prevReachedMinPanes += t.min);
        }), this.panes[n[1]].size = 100 - e.prevReachedMinPanes - this.panes[0].min - e.prevPanesSize - e.nextPanesSize, null) : i > 100 - e.nextPanesSize - this.panes[n[1]].min && (n[1] = this.findNextExpandedPane(s).index, e.nextReachedMinPanes = 0, n[1] > s + 1 && this.panes.forEach((t, a) => {
          a > s && a < n[1] && (t.size = t.min, e.nextReachedMinPanes += t.min);
        }), e.nextPanesSize = this.sumNextPanesSize(n[1] - 1), n[1] === void 0) ? (e.nextReachedMinPanes = 0, this.panes[this.panesCount - 1].size = this.panes[this.panesCount - 1].min, this.panes.forEach((t, a) => {
          a < this.panesCount - 1 && a >= s + 1 && (t.size = t.min, e.nextReachedMinPanes += t.min);
        }), this.panes[n[0]].size = 100 - e.prevPanesSize - e.nextReachedMinPanes - this.panes[this.panesCount - 1].min - e.nextPanesSize, null) : { sums: e, panesToResize: n };
      },
      sumPrevPanesSize(e) {
        return this.panes.reduce((i, s, n) => i + (n < e ? s.size : 0), 0);
      },
      sumNextPanesSize(e) {
        return this.panes.reduce((i, s, n) => i + (n > e + 1 ? s.size : 0), 0);
      },
      findPrevExpandedPane(e) {
        return [...this.panes].reverse().find((s) => s.index < e && s.size > s.min) || {};
      },
      findNextExpandedPane(e) {
        return this.panes.find((s) => s.index > e + 1 && s.size > s.min) || {};
      },
      checkSplitpanesNodes() {
        Array.from(this.container.children).forEach((i) => {
          const s = i.classList.contains("splitpanes__pane"), n = i.classList.contains("splitpanes__splitter");
          !s && !n && (i.parentNode.removeChild(i), console.warn("Splitpanes: Only <pane> elements are allowed at the root of <splitpanes>. One of your DOM nodes was removed."));
        });
      },
      addSplitter(e, i, s = false) {
        const n = e - 1, t = document.createElement("div");
        t.classList.add("splitpanes__splitter"), s || (t.onmousedown = (a) => this.onMouseDown(a, n), typeof window < "u" && "ontouchstart" in window && (t.ontouchstart = (a) => this.onMouseDown(a, n)), t.onclick = (a) => this.onSplitterClick(a, n + 1)), this.dblClickSplitter && (t.ondblclick = (a) => this.onSplitterDblClick(a, n + 1)), i.parentNode.insertBefore(t, i);
      },
      removeSplitter(e) {
        e.onmousedown = void 0, e.onclick = void 0, e.ondblclick = void 0, e.parentNode.removeChild(e);
      },
      redoSplitters() {
        const e = Array.from(this.container.children);
        e.forEach((s) => {
          s.className.includes("splitpanes__splitter") && this.removeSplitter(s);
        });
        let i = 0;
        e.forEach((s) => {
          s.className.includes("splitpanes__pane") && (!i && this.firstSplitter ? this.addSplitter(i, s, true) : i && this.addSplitter(i, s), i++);
        });
      },
      requestUpdate({ target: e, ...i }) {
        const s = this.indexedPanes[e._.uid];
        Object.entries(i).forEach(([n, t]) => s[n] = t);
      },
      onPaneAdd(e) {
        let i = -1;
        Array.from(e.$el.parentNode.children).some((t) => (t.className.includes("splitpanes__pane") && i++, t === e.$el));
        const s = parseFloat(e.minSize), n = parseFloat(e.maxSize);
        this.panes.splice(i, 0, {
          id: e._.uid,
          index: i,
          min: isNaN(s) ? 0 : s,
          max: isNaN(n) ? 100 : n,
          size: e.size === null ? null : parseFloat(e.size),
          givenSize: e.size,
          update: e.update
        }), this.panes.forEach((t, a) => t.index = a), this.ready && this.$nextTick(() => {
          this.redoSplitters(), this.resetPaneSizes({ addedPane: this.panes[i] }), this.$emit("pane-add", { index: i, panes: this.panes.map((t) => ({ min: t.min, max: t.max, size: t.size })) });
        });
      },
      onPaneRemove(e) {
        const i = this.panes.findIndex((n) => n.id === e._.uid), s = this.panes.splice(i, 1)[0];
        this.panes.forEach((n, t) => n.index = t), this.$nextTick(() => {
          this.redoSplitters(), this.resetPaneSizes({ removedPane: { ...s, index: i } }), this.$emit("pane-remove", { removed: s, panes: this.panes.map((n) => ({ min: n.min, max: n.max, size: n.size })) });
        });
      },
      resetPaneSizes(e = {}) {
        !e.addedPane && !e.removedPane ? this.initialPanesSizing() : this.panes.some((i) => i.givenSize !== null || i.min || i.max < 100) ? this.equalizeAfterAddOrRemove(e) : this.equalize(), this.ready && this.$emit("resized", this.panes.map((i) => ({ min: i.min, max: i.max, size: i.size })));
      },
      equalize() {
        const e = 100 / this.panesCount;
        let i = 0;
        const s = [], n = [];
        this.panes.forEach((t) => {
          t.size = Math.max(Math.min(e, t.max), t.min), i -= t.size, t.size >= t.max && s.push(t.id), t.size <= t.min && n.push(t.id);
        }), i > 0.1 && this.readjustSizes(i, s, n);
      },
      initialPanesSizing() {
        let e = 100;
        const i = [], s = [];
        let n = 0;
        this.panes.forEach((a) => {
          e -= a.size, a.size !== null && n++, a.size >= a.max && i.push(a.id), a.size <= a.min && s.push(a.id);
        });
        let t = 100;
        e > 0.1 && (this.panes.forEach((a) => {
          a.size === null && (a.size = Math.max(Math.min(e / (this.panesCount - n), a.max), a.min)), t -= a.size;
        }), t > 0.1 && this.readjustSizes(e, i, s));
      },
      equalizeAfterAddOrRemove({ addedPane: e, removedPane: i } = {}) {
        let s = 100 / this.panesCount, n = 0;
        const t = [], a = [];
        e && e.givenSize !== null && (s = (100 - e.givenSize) / (this.panesCount - 1)), this.panes.forEach((r) => {
          n -= r.size, r.size >= r.max && t.push(r.id), r.size <= r.min && a.push(r.id);
        }), !(Math.abs(n) < 0.1) && (this.panes.forEach((r) => {
          e && e.givenSize !== null && e.id === r.id || (r.size = Math.max(Math.min(s, r.max), r.min)), n -= r.size, r.size >= r.max && t.push(r.id), r.size <= r.min && a.push(r.id);
        }), n > 0.1 && this.readjustSizes(n, t, a));
      },
      readjustSizes(e, i, s) {
        let n;
        e > 0 ? n = e / (this.panesCount - i.length) : n = e / (this.panesCount - s.length), this.panes.forEach((t, a) => {
          if (e > 0 && !i.includes(t.id)) {
            const r = Math.max(Math.min(t.size + n, t.max), t.min), o = r - t.size;
            e -= o, t.size = r;
          } else if (!s.includes(t.id)) {
            const r = Math.max(Math.min(t.size + n, t.max), t.min), o = r - t.size;
            e -= o, t.size = r;
          }
          t.update({
            [this.horizontal ? "height" : "width"]: `${this.indexedPanes[t.id].size}%`
          });
        }), Math.abs(e) > 0.1 && this.$nextTick(() => {
          this.ready && console.warn("Splitpanes: Could not resize panes correctly due to their constraints.");
        });
      }
    },
    watch: {
      panes: {
        deep: true,
        immediate: false,
        handler() {
          this.updatePaneComponents();
        }
      },
      horizontal() {
        this.updatePaneComponents();
      },
      firstSplitter() {
        this.redoSplitters();
      },
      dblClickSplitter(e) {
        [...this.container.querySelectorAll(".splitpanes__splitter")].forEach((s, n) => {
          s.ondblclick = e ? (t) => this.onSplitterDblClick(t, n) : void 0;
        });
      }
    },
    beforeUnmount() {
      this.ready = false;
    },
    mounted() {
      this.container = this.$refs.container, this.checkSplitpanesNodes(), this.redoSplitters(), this.resetPaneSizes(), this.$emit("ready"), this.ready = true;
    },
    render() {
      return vue.h(
        "div",
        {
          ref: "container",
          class: [
            "splitpanes",
            `splitpanes--${this.horizontal ? "horizontal" : "vertical"}`,
            {
              "splitpanes--dragging": this.touch.dragging
            }
          ]
        },
        this.$slots.default()
      );
    }
  }, S = (e, i) => {
    const s = e.__vccOpts || e;
    for (const [n, t] of i)
      s[n] = t;
    return s;
  }, x = {
    name: "pane",
    inject: ["requestUpdate", "onPaneAdd", "onPaneRemove", "onPaneClick"],
    props: {
      size: { type: [Number, String], default: null },
      minSize: { type: [Number, String], default: 0 },
      maxSize: { type: [Number, String], default: 100 }
    },
    data: () => ({
      style: {}
    }),
    mounted() {
      this.onPaneAdd(this);
    },
    beforeUnmount() {
      this.onPaneRemove(this);
    },
    methods: {
      update(e) {
        this.style = e;
      }
    },
    computed: {
      sizeNumber() {
        return this.size || this.size === 0 ? parseFloat(this.size) : null;
      },
      minSizeNumber() {
        return parseFloat(this.minSize);
      },
      maxSizeNumber() {
        return parseFloat(this.maxSize);
      }
    },
    watch: {
      sizeNumber(e) {
        this.requestUpdate({ target: this, size: e });
      },
      minSizeNumber(e) {
        this.requestUpdate({ target: this, min: e });
      },
      maxSizeNumber(e) {
        this.requestUpdate({ target: this, max: e });
      }
    }
  };
  function P(e, i, s, n, t, a) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: "splitpanes__pane",
      onClick: i[0] || (i[0] = (r) => a.onPaneClick(r, e._.uid)),
      style: vue.normalizeStyle(e.style)
    }, [
      vue.renderSlot(e.$slots, "default")
    ], 4);
  }
  const g = /* @__PURE__ */ S(x, [["render", P]]);
  var isVue2 = false;
  /*!
    * pinia v2.1.4
    * (c) 2023 Eduardo San Martin Morote
    * @license MIT
    */
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const piniaSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = vue.markRaw({
      install(app) {
        setActivePinia(pinia);
        {
          pinia._a = app;
          app.provide(piniaSymbol, pinia);
          app.config.globalProperties.$pinia = pinia;
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    return pinia;
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    }
    if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(vue.isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia.state.value[id];
    let store;
    function setup() {
      if (!initialState && true) {
        {
          pinia.state.value[id] = state ? state() : {};
        }
      }
      const localState = vue.toRefs(pinia.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia);
          const store2 = pinia._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    const $subscribeOptions = {
      deep: true
      // flush: 'post',
    };
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia.state.value[$id];
    if (!isOptionsStore && !initialState && true) {
      {
        pinia.state.value[$id] = {};
      }
    }
    vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      noop
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia._s.delete($id);
    }
    function wrapAction(name, action) {
      return function() {
        setActivePinia(pinia);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
    }
    const partialStore = {
      _p: pinia,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(partialStore);
    pinia._s.set($id, store);
    const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
    const setupStore = pinia._e.run(() => {
      scope = vue.effectScope();
      return runWithContext(() => scope.run(setup));
    });
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia.state.value[$id][key] = prop;
          }
        }
      } else if (typeof prop === "function") {
        const actionValue = wrapAction(key, prop);
        {
          setupStore[key] = actionValue;
        }
        optionsForPlugin.actions[key] = prop;
      } else
        ;
    }
    {
      assign(store, setupStore);
      assign(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => pinia.state.value[$id],
      set: (state) => {
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    pinia._p.forEach((extender) => {
      {
        assign(store, scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        })));
      }
    });
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
    }
    function useStore(pinia, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia || (hasContext ? vue.inject(piniaSymbol, null) : null);
      if (pinia)
        setActivePinia(pinia);
      pinia = activePinia;
      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia);
        } else {
          createOptionsStore(id, options, pinia);
        }
      }
      const store = pinia._s.get(id);
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  function storeToRefs(store) {
    {
      store = vue.toRaw(store);
      const refs = {};
      for (const key in store) {
        const value = store[key];
        if (vue.isRef(value) || vue.isReactive(value)) {
          refs[key] = // ---
          vue.toRef(store, key);
        }
      }
      return refs;
    }
  }
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const useNoteStore = defineStore("note", () => {
    const isOn = vue.ref(false);
    const videoType = vue.ref(_unsafeWindow.location.href.includes("bangumi") ? "bangumi" : "video");
    const video = vue.ref(null);
    const currentTime = vue.ref(0);
    const vid = vue.ref("");
    const matchUrl = vue.ref("");
    const lastSave = vue.ref(Date.now());
    const screenshots = vue.ref([]);
    const notes = vue.ref([]);
    const currentNote = vue.reactive({
      id: crypto.randomUUID(),
      title: "",
      content: "",
      images: []
    });
    const autoSave = async () => {
      if (currentNote.content === "")
        return;
      const note = notes.value.find((note2) => note2.id === currentNote.id);
      if (note) {
        note.title = currentNote.title;
        note.content = currentNote.content;
        note.images = currentNote.images;
      } else {
        notes.value.push({ ...currentNote });
      }
      lastSave.value = Date.now();
      await localforage.setItem("notes", JSON.stringify(notes.value));
    };
    const loadNote = async (id) => {
      await autoSave();
      screenshots.value = [];
      const note = notes.value.find((note2) => note2.id === id);
      if (!note)
        return;
      for await (const image of note.images) {
        const content = await localforage.getItem(image);
        screenshots.value.push({ key: image, content });
      }
      setTimeout(() => {
        currentNote.id = note.id;
        currentNote.title = note.title;
        currentNote.content = note.content;
        currentNote.images = note.images;
      }, 300);
    };
    const addNote = () => {
      currentNote.id = crypto.randomUUID();
      currentNote.title = "";
      currentNote.content = "";
      currentNote.images = [];
    };
    const removeNote = async () => {
      const index = notes.value.findIndex((note) => note.id === currentNote.id);
      if (index === -1)
        return;
      notes.value.splice(index, 1);
      await localforage.setItem("notes", JSON.stringify(notes.value));
      for await (const image of currentNote.images)
        localforage.removeItem(image);
      addNote();
    };
    const getVideoInfo = () => {
      switch (videoType.value) {
        case "video":
          return {
            video: _unsafeWindow.document.getElementsByTagName("video")[0],
            vid: _unsafeWindow.__INITIAL_STATE__.bvid,
            p: _unsafeWindow.__INITIAL_STATE__.p,
            matchUrl: `bilibili.com/video/${_unsafeWindow.__INITIAL_STATE__.bvid}`
          };
        case "bangumi":
          return {
            video: _unsafeWindow.document.getElementsByTagName("video")[1],
            vid: `av${_unsafeWindow.$pbp.aid}`,
            matchUrl: `bilibili.com/video/av${_unsafeWindow.$pbp.aid}`
          };
      }
    };
    let lastUpdateTime = 0;
    let saveTimer;
    vue.watch(isOn, async (val) => {
      var _a, _b;
      if (val) {
        const videoInfo = getVideoInfo();
        video.value = videoInfo.video;
        vid.value = videoInfo.p === 1 || !videoInfo.p ? videoInfo.vid : `${videoInfo.vid}-P${videoInfo.p}`;
        matchUrl.value = videoInfo.p === 1 || !videoInfo.p ? `${videoInfo.matchUrl}?` : `${videoInfo.matchUrl}?p=${videoInfo.p}&`;
        currentTime.value = Number((_a = video.value) == null ? void 0 : _a.currentTime.toFixed(1));
        (_b = video.value) == null ? void 0 : _b.addEventListener("timeupdate", () => {
          var _a2;
          if (Date.now() - lastUpdateTime < 500)
            return;
          const videoInfo2 = getVideoInfo();
          vid.value = videoInfo2.p === 1 || !videoInfo2.p ? videoInfo2.vid : `${videoInfo2.vid}-P${videoInfo2.p}`;
          matchUrl.value = videoInfo2.p === 1 || !videoInfo2.p ? `${videoInfo2.matchUrl}?` : `${videoInfo2.matchUrl}?p=${videoInfo2.p}&`;
          currentTime.value = Number((_a2 = video.value) == null ? void 0 : _a2.currentTime.toFixed(1));
          lastUpdateTime = Date.now();
        });
        _unsafeWindow.document.body.style.overflow = "hidden";
        saveTimer = setInterval(autoSave, 1e3 * 60 * 2);
        notes.value = JSON.parse(await localforage.getItem("notes") || "[]");
      } else {
        autoSave();
        video.value = null;
        vid.value = "";
        currentTime.value = 0;
        currentNote.id = crypto.randomUUID();
        currentNote.title = "";
        currentNote.content = "";
        currentNote.images = [];
        _unsafeWindow.document.body.style.overflow = "";
        clearInterval(saveTimer);
      }
    });
    const jumpTo = (time) => {
      if (!video.value)
        return;
      video.value.currentTime = time;
    };
    const changePlaybackRate = (rate) => {
      if (!video.value)
        return;
      video.value.playbackRate = rate;
    };
    return {
      isOn,
      videoType,
      video,
      currentTime,
      vid,
      matchUrl,
      notes,
      screenshots,
      currentNote,
      lastSave,
      autoSave,
      jumpTo,
      loadNote,
      addNote,
      removeNote,
      changePlaybackRate,
      getVideoInfo
    };
  });
  const _hoisted_1$6 = { class: "rounded-xl bg-base-100 text-black navbar" };
  const _hoisted_2$2 = { class: "flex flex-1 gap-2" };
  const _hoisted_3$2 = { class: "dropdown" };
  const _hoisted_4$2 = ["tabindex"];
  const _hoisted_5$2 = ["tabindex"];
  const _hoisted_6$1 = { class: "overflow-y-scroll" };
  const _hoisted_7 = ["onClick"];
  const _hoisted_8 = { class: "block w-40 truncate hover:bg-[#fc80a1] hover:text-white!" };
  const _hoisted_9 = /* @__PURE__ */ vue.createElementVNode("span", { class: "i-carbon-add-alt h-8 w-8" }, null, -1);
  const _hoisted_10 = [
    _hoisted_9
  ];
  const _hoisted_11 = /* @__PURE__ */ vue.createElementVNode("div", {
    class: "tooltip tooltip-bottom",
    "data-tip": "删除笔记"
  }, [
    /* @__PURE__ */ vue.createElementVNode("label", {
      for: "deleteModal",
      class: "btn-neutral bg-[#fc80a1] text-white btn btn-square hover:bg-[#fc80a1] hover:shadow-md"
    }, [
      /* @__PURE__ */ vue.createElementVNode("span", { class: "i-carbon-trash-can h-8 w-8" })
    ])
  ], -1);
  const _hoisted_12 = { class: "flex-none" };
  const _hoisted_13 = /* @__PURE__ */ vue.createElementVNode("span", { class: "i-carbon-close-outline h-8 w-8" }, null, -1);
  const _hoisted_14 = [
    _hoisted_13
  ];
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "Navbar",
    setup(__props) {
      const { isOn, currentNote, notes } = storeToRefs(useNoteStore());
      const { loadNote, addNote, autoSave } = useNoteStore();
      const tabIndex = vue.ref(0);
      function handleNew() {
        autoSave();
        addNote();
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
          vue.createElementVNode("div", _hoisted_2$2, [
            vue.createElementVNode("div", _hoisted_3$2, [
              vue.createElementVNode("label", {
                tabindex: vue.unref(tabIndex),
                class: "w-18 bg-[#fc80a1] text-lg normal-case btn btn-ghost hover:bg-[#fc80a1] text-white! hover:shadow-md hover:text-white!"
              }, " 笔记 ", 8, _hoisted_4$2),
              vue.createElementVNode("ul", {
                tabindex: vue.unref(tabIndex),
                class: "dropdown-content max-h-80 w-50 flex flex-col bg-base-100 px-2 text-sm font-bold shadow-lg menu rounded-box"
              }, [
                vue.createElementVNode("div", _hoisted_6$1, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(notes), (note) => {
                    return vue.openBlock(), vue.createElementBlock("li", {
                      key: note.title,
                      onClick: ($event) => vue.unref(loadNote)(note.id)
                    }, [
                      vue.createElementVNode("a", _hoisted_8, vue.toDisplayString(note.title || note.id), 1)
                    ], 8, _hoisted_7);
                  }), 128))
                ])
              ], 8, _hoisted_5$2)
            ]),
            vue.createElementVNode("div", {
              class: "tooltip tooltip-bottom",
              "data-tip": "创建笔记"
            }, [
              vue.createElementVNode("label", {
                class: "btn-neutral bg-[#fc80a1] text-white btn btn-square hover:bg-[#fc80a1] hover:shadow-md",
                onClick: handleNew
              }, _hoisted_10)
            ]),
            vue.withDirectives(vue.createElementVNode("input", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(currentNote).title = $event),
              type: "text",
              placeholder: "笔记名称",
              class: "max-w-xs input input-bordered"
            }, null, 512), [
              [vue.vModelText, vue.unref(currentNote).title]
            ]),
            _hoisted_11
          ]),
          vue.createElementVNode("div", _hoisted_12, [
            vue.createElementVNode("button", {
              class: "ml-2 btn btn-square btn-ghost",
              onClick: _cache[1] || (_cache[1] = ($event) => isOn.value = false)
            }, _hoisted_14)
          ])
        ]);
      };
    }
  });
  function formatTime(time, type = "normal") {
    if (type === "normal") {
      const min = Math.floor(time / 60);
      const sec = Math.floor(time % 60);
      return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
    }
    if (type === "subtitle") {
      const hour = Math.floor(time / 3600);
      const min = Math.floor((time - hour * 3600) / 60);
      const sec = Math.floor(time % 60);
      const millisecond = Math.floor((time - Math.floor(time)) * 1e3);
      return `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}.${millisecond < 10 ? `00${millisecond}` : millisecond}`;
    }
  }
  function timestampLink() {
    const { currentTime, vid, matchUrl } = useNoteStore();
    const link = `https://www.${matchUrl}t=${currentTime}`;
    return `🔗 [${vid}-[${formatTime(currentTime)}]](${link})
`;
  }
  function captureFrame() {
    const { currentTime, vid, currentNote, video, screenshots } = useNoteStore();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/png");
    const fileName = `${currentNote.id}-${currentNote.images.length + 1}`;
    localforage.setItem(fileName, base64);
    screenshots.push({ key: fileName, content: base64 });
    return {
      key: fileName,
      content: `![${vid}-[${formatTime(currentTime)}]](./images/${fileName}.png)
`
    };
  }
  function downloadFile(content, filename) {
    const link = document.createElement("a");
    link.href = content;
    link.download = filename;
    link.target = "_blank";
    link.click();
  }
  async function downloadVideo() {
    const { videoType } = useNoteStore();
    const { aid, cid, bvid } = videoType === "video" ? _unsafeWindow.__INITIAL_STATE__.videoData : _unsafeWindow.$pbp;
    const url = `https://api.bilibili.com/x/player/playurl?avid=${aid}&cid=${cid}&otype=json&fourk=1&qn=16`;
    const { data } = await axios({
      url,
      method: "GET"
    });
    if (!data.data)
      alert("当前视频不支持下载");
    const downloadUrl = data.data.durl[0].url;
    downloadFile(downloadUrl, `${bvid || aid}.mp4`);
  }
  async function downloadAudio() {
    const { videoType } = useNoteStore();
    if (videoType === "bangumi") {
      alert("番剧不支持下载音频");
      return;
    }
    const { bvid } = _unsafeWindow.__INITIAL_STATE__.videoData;
    const { audio } = _unsafeWindow.__playinfo__.data.dash;
    const downloadUrl = audio[0].baseUrl;
    downloadFile(downloadUrl, `${bvid}.mp3`);
  }
  async function downloadCover() {
    const { videoType } = useNoteStore();
    if (videoType === "bangumi") {
      alert("番剧不支持下载封面");
      return;
    }
    const { bvid } = _unsafeWindow.__INITIAL_STATE__.videoData;
    const { pic } = _unsafeWindow.__INITIAL_STATE__.videoData;
    downloadFile(pic, `${bvid}封面.png`);
  }
  async function downloadSubtitle() {
    const { videoType } = useNoteStore();
    if (videoType === "bangumi")
      return;
    const { bvid, subtitle } = _unsafeWindow.__INITIAL_STATE__.videoData;
    if (!subtitle.list.length || !subtitle.list[0].subtitle_url) {
      alert("当前视频没有字幕");
      return;
    }
    const downloadUrl = subtitle.list[0].subtitle_url.replace("http://", "https://");
    const { data } = await axios.get(downloadUrl);
    const content = data.body.map((subtitle2, index) => {
      return `${index + 1}
${formatTime(subtitle2.from, "subtitle")} --> ${formatTime(subtitle2.to, "subtitle")}
${subtitle2.content}
`;
    }).join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    downloadFile(url, `${bvid}.srt`);
    window.URL.revokeObjectURL(url);
  }
  const _hoisted_1$5 = /* @__PURE__ */ vue.createElementVNode("div", { class: "h-full center" }, [
    /* @__PURE__ */ vue.createElementVNode("span", { class: "font-blod i-carbon-alarm h-6 w-6 bg-[#01a3d9]" })
  ], -1);
  const __default__$3 = {
    name: "TimeExtension"
  };
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$3,
    props: {
      onInsert: {
        type: Function,
        default: () => () => null
      }
    },
    setup(__props) {
      const props = __props;
      function timeHandler() {
        const generator = () => {
          return {
            targetValue: timestampLink(),
            select: false,
            deviationStart: 0,
            deviationEnd: 0
          };
        };
        props.onInsert(generator);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(mdEditorV3.NormalToolbar), {
          title: "插入时间戳",
          onClick: timeHandler
        }, {
          trigger: vue.withCtx(() => [
            _hoisted_1$5
          ]),
          _: 1
        });
      };
    }
  });
  const _hoisted_1$4 = /* @__PURE__ */ vue.createElementVNode("div", { class: "h-full center" }, [
    /* @__PURE__ */ vue.createElementVNode("span", { class: "font-blod i-carbon-camera h-6 w-6 bg-[#01a3d9]" })
  ], -1);
  const __default__$2 = {
    name: "CaptureExtension"
  };
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
    props: {
      onInsert: {
        type: Function,
        default: () => () => null
      }
    },
    setup(__props) {
      const props = __props;
      const { currentNote } = useNoteStore();
      function captureHandler() {
        const { content, key } = captureFrame();
        currentNote.images.push(key);
        const generator = () => {
          return {
            targetValue: content,
            select: false,
            deviationStart: 0,
            deviationEnd: 0
          };
        };
        props.onInsert(generator);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(mdEditorV3.NormalToolbar), {
          title: "插入视频当前帧",
          onClick: captureHandler
        }, {
          trigger: vue.withCtx(() => [
            _hoisted_1$4
          ]),
          _: 1
        });
      };
    }
  });
  function TargetBlankExtension(md) {
    const defaultRender = md.renderer.rules.link_open ?? function(tokens, idx, options, _env, self2) {
      return self2.renderToken(tokens, idx, options);
    };
    md.renderer.rules.link_open = function(tokens, idx, options, env, self2) {
      const { matchUrl } = useNoteStore();
      const href = tokens[idx].attrGet("href");
      if ((href == null ? void 0 : href.includes(matchUrl)) && (href == null ? void 0 : href.includes("t="))) {
        const time = href.split("t=")[1];
        tokens[idx].attrSet("data-time-jump", time);
        tokens[idx].attrSet("href", "javascript:void(0)");
        return defaultRender(tokens, idx, options, env, self2);
      }
      tokens[idx].attrSet("target", "_blank");
      return defaultRender(tokens, idx, options, env, self2);
    };
  }
  function ImageRenderExtension(md) {
    const defaultRender = md.renderer.rules.image ?? function(tokens, idx, options, _env, self2) {
      return self2.renderToken(tokens, idx, options);
    };
    md.renderer.rules.image = function(tokens, idx, options, env, self2) {
      const src = tokens[idx].attrGet("src");
      const { currentNote, screenshots } = useNoteStore();
      if (src == null ? void 0 : src.includes(`./images/${currentNote.id}`)) {
        const fileName = src.replace("./images/", "").replace(".png", "");
        const target = screenshots.find((image) => image.key === fileName);
        tokens[idx].attrSet("src", (target == null ? void 0 : target.content) || "");
      }
      return defaultRender(tokens, idx, options, env, self2);
    };
  }
  const _hoisted_1$3 = /* @__PURE__ */ vue.createElementVNode("div", { class: "h-full center" }, [
    /* @__PURE__ */ vue.createElementVNode("span", { class: "font-blod i-carbon-document-download h-5 w-5 bg-[#01a3d9]" })
  ], -1);
  const __default__$1 = {
    name: "DownloadExtension"
  };
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
    setup(__props) {
      async function downloadHandler() {
        const { currentNote, screenshots } = useNoteStore();
        const { content } = currentNote;
        if (!content)
          return;
        const zip = new JSZip();
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        zip.file(`${currentNote.title || currentNote.id}.md`, blob);
        if (screenshots.length) {
          const folder = zip.folder("images");
          for await (const img of screenshots) {
            const base64 = img.content.split(",")[1];
            folder == null ? void 0 : folder.file(`${img.key}.png`, base64, { base64: true });
          }
        }
        const blobData = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 5
          }
        });
        const url = window.URL.createObjectURL(blobData);
        downloadFile(url, `${currentNote.title || currentNote.id}.zip`);
        window.URL.revokeObjectURL(url);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(mdEditorV3.NormalToolbar), {
          title: "下载笔记",
          onClick: downloadHandler
        }, {
          trigger: vue.withCtx(() => [
            _hoisted_1$3
          ]),
          _: 1
        });
      };
    }
  });
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  var relativeTime$1 = { exports: {} };
  (function(module, exports) {
    !function(r, e) {
      module.exports = e();
    }(commonjsGlobal, function() {
      return function(r, e, t) {
        r = r || {};
        var n = e.prototype, o = { future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years" };
        function i(r2, e2, t2, o2) {
          return n.fromToBase(r2, e2, t2, o2);
        }
        t.en.relativeTime = o, n.fromToBase = function(e2, n2, i2, d2, u) {
          for (var f, a, s, l = i2.$locale().relativeTime || o, h2 = r.thresholds || [{ l: "s", r: 44, d: "second" }, { l: "m", r: 89 }, { l: "mm", r: 44, d: "minute" }, { l: "h", r: 89 }, { l: "hh", r: 21, d: "hour" }, { l: "d", r: 35 }, { l: "dd", r: 25, d: "day" }, { l: "M", r: 45 }, { l: "MM", r: 10, d: "month" }, { l: "y", r: 17 }, { l: "yy", d: "year" }], m = h2.length, c = 0; c < m; c += 1) {
            var y = h2[c];
            y.d && (f = d2 ? t(e2).diff(i2, y.d, true) : i2.diff(e2, y.d, true));
            var p = (r.rounding || Math.round)(Math.abs(f));
            if (s = f > 0, p <= y.r || !y.r) {
              p <= 1 && c > 0 && (y = h2[c - 1]);
              var v = l[y.l];
              u && (p = u("" + p)), a = "string" == typeof v ? v.replace("%d", p) : v(p, n2, y.l, s);
              break;
            }
          }
          if (n2)
            return a;
          var M2 = s ? l.future : l.past;
          return "function" == typeof M2 ? M2(a) : M2.replace("%s", a);
        }, n.to = function(r2, e2) {
          return i(r2, e2, this, true);
        }, n.from = function(r2, e2) {
          return i(r2, e2, this);
        };
        var d = function(r2) {
          return r2.$u ? t.utc() : t();
        };
        n.toNow = function(r2) {
          return this.to(d(this), r2);
        }, n.fromNow = function(r2) {
          return this.from(d(this), r2);
        };
      };
    });
  })(relativeTime$1);
  var relativeTimeExports = relativeTime$1.exports;
  const relativeTime = /* @__PURE__ */ getDefaultExportFromCjs(relativeTimeExports);
  var zhCn = { exports: {} };
  (function(module, exports) {
    !function(e, _) {
      module.exports = _(dayjs);
    }(commonjsGlobal, function(e) {
      function _(e2) {
        return e2 && "object" == typeof e2 && "default" in e2 ? e2 : { default: e2 };
      }
      var t = _(e), d = { name: "zh-cn", weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"), weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"), weekdaysMin: "日_一_二_三_四_五_六".split("_"), months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"), monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"), ordinal: function(e2, _2) {
        return "W" === _2 ? e2 + "周" : e2 + "日";
      }, weekStart: 1, yearStart: 4, formats: { LT: "HH:mm", LTS: "HH:mm:ss", L: "YYYY/MM/DD", LL: "YYYY年M月D日", LLL: "YYYY年M月D日Ah点mm分", LLLL: "YYYY年M月D日ddddAh点mm分", l: "YYYY/M/D", ll: "YYYY年M月D日", lll: "YYYY年M月D日 HH:mm", llll: "YYYY年M月D日dddd HH:mm" }, relativeTime: { future: "%s内", past: "%s前", s: "几秒", m: "1 分钟", mm: "%d 分钟", h: "1 小时", hh: "%d 小时", d: "1 天", dd: "%d 天", M: "1 个月", MM: "%d 个月", y: "1 年", yy: "%d 年" }, meridiem: function(e2, _2) {
        var t2 = 100 * e2 + _2;
        return t2 < 600 ? "凌晨" : t2 < 900 ? "早上" : t2 < 1100 ? "上午" : t2 < 1300 ? "中午" : t2 < 1800 ? "下午" : "晚上";
      } };
      return t.default.locale(d, null, true), d;
    });
  })(zhCn);
  const _hoisted_1$2 = { class: "h-full center px-2" };
  const __default__ = {
    name: "LastSaveExtension"
  };
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    setup(__props) {
      dayjs.extend(relativeTime);
      dayjs.locale("zh-cn");
      const text = vue.ref("");
      const timerId = setInterval(() => {
        const { lastSave } = useNoteStore();
        text.value = `最近保存：${dayjs(lastSave).fromNow()}`;
      }, 1e3);
      vue.onBeforeUnmount(() => {
        clearInterval(timerId);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(text)), 1)
        ]);
      };
    }
  });
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props) {
      const { currentNote, autoSave } = useNoteStore();
      const editorRef = vue.ref(null);
      const toolbars = [
        0,
        1,
        2,
        "-",
        "preview",
        "catalog",
        "save",
        "-",
        "bold",
        "underline",
        "italic",
        "-",
        "strikeThrough",
        "title",
        "quote",
        "unorderedList",
        "orderedList",
        "task",
        "-",
        "codeRow",
        "code",
        "link",
        "table",
        "mermaid",
        "katex",
        "-",
        "=",
        "pageFullscreen"
      ];
      mdEditorV3.config({
        markdownItConfig(md) {
          md.use(TargetBlankExtension);
          md.use(ImageRenderExtension);
        },
        editorConfig: {
          renderDelay: 50
        }
      });
      function insertTime(generator) {
        var _a;
        (_a = editorRef.value) == null ? void 0 : _a.insert(generator);
      }
      function insertFrame(generator) {
        var _a;
        (_a = editorRef.value) == null ? void 0 : _a.insert(generator);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(mdEditorV3.MdEditor), {
          ref_key: "editorRef",
          ref: editorRef,
          modelValue: vue.unref(currentNote).content,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(currentNote).content = $event),
          class: "h-full max-h-9/10",
          "show-code-row-number": true,
          toolbars,
          footers: ["markdownTotal", "scrollSwitch", "=", 0],
          "auto-focus": true,
          placeholder: "开始写作吧...",
          "preview-theme": "vuepress",
          "auto-detect-code": true,
          "no-upload-img": true,
          onSave: vue.unref(autoSave),
          onBlur: vue.unref(autoSave)
        }, {
          defToolbars: vue.withCtx(() => [
            vue.createVNode(_sfc_main$7, { "on-insert": insertTime }),
            vue.createVNode(_sfc_main$6, { "on-insert": insertFrame }),
            vue.createVNode(_sfc_main$5)
          ]),
          defFooters: vue.withCtx(() => [
            vue.createVNode(_sfc_main$4)
          ]),
          _: 1
        }, 8, ["modelValue", "onSave", "onBlur"]);
      };
    }
  });
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createVNode(_sfc_main$8),
          vue.createVNode(_sfc_main$3)
        ]);
      };
    }
  });
  const _hoisted_1$1 = { class: "center flex-col gap-2" };
  const _hoisted_2$1 = { class: "center gap-4" };
  const _hoisted_3$1 = ["data-tip"];
  const _hoisted_4$1 = ["onClick"];
  const _hoisted_5$1 = ["data-tip"];
  const _hoisted_6 = /* @__PURE__ */ vue.createElementVNode("span", { class: "absolute bottom-6 text-black/70" }, [
    /* @__PURE__ */ vue.createTextVNode(" 欢迎关注 "),
    /* @__PURE__ */ vue.createElementVNode("a", {
      href: "https://space.bilibili.com/405579368",
      target: "_blank",
      class: "font-bold text-blue!"
    }, "@半糖人类"),
    /* @__PURE__ */ vue.createTextVNode(" 反馈建议 ")
  ], -1);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props) {
      const videoRef = vue.ref(null);
      let playerNode = null;
      const btns = [
        {
          tooltip: "快退 5 秒",
          icon: "i-carbon-rewind-5",
          handler: () => handleSeek(-5)
        },
        {
          tooltip: "快进 5 秒",
          icon: "i-carbon-forward-5",
          handler: () => handleSeek(5)
        },
        {
          tooltip: "下载视频",
          icon: "i-carbon-video",
          handler: downloadVideo
        },
        {
          tooltip: "下载音频",
          icon: "i-carbon-headphones",
          handler: downloadAudio
        },
        {
          tooltip: "下载封面",
          icon: "i-carbon-image",
          handler: downloadCover
        },
        {
          tooltip: "下载字幕",
          icon: "i-carbon-string-text",
          handler: downloadSubtitle
        }
      ];
      const playbackRate = vue.ref(1);
      const { changePlaybackRate } = useNoteStore();
      function handleSeek(diff) {
        const { jumpTo, currentTime } = useNoteStore();
        jumpTo(currentTime + diff);
      }
      vue.watch(playbackRate, (rate) => {
        changePlaybackRate(rate);
      });
      vue.onMounted(() => {
        var _a;
        playerNode = _unsafeWindow.document.querySelector("#bilibili-player");
        if (!playerNode)
          return;
        (_a = videoRef.value) == null ? void 0 : _a.appendChild(playerNode);
      });
      vue.onUnmounted(() => {
        const { videoType } = useNoteStore();
        const playerWrap = videoType === "video" ? _unsafeWindow.document.querySelector("#playerWrap") : _unsafeWindow.document.querySelector(".video_playerInner__0_RRO");
        if (!playerWrap || !playerNode)
          return;
        playerWrap.appendChild(playerNode);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createElementVNode("div", {
            ref_key: "videoRef",
            ref: videoRef,
            class: "w-full center"
          }, null, 512),
          vue.createElementVNode("div", _hoisted_2$1, [
            (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(btns, (btn) => {
              return vue.createElementVNode("div", {
                key: btn.icon,
                class: "tooltip",
                "data-tip": btn.tooltip
              }, [
                vue.createElementVNode("button", {
                  class: "btn-neutral btn btn-square",
                  onClick: btn.handler
                }, [
                  vue.createElementVNode("span", {
                    class: vue.normalizeClass(["h-8 w-8", btn.icon])
                  }, null, 2)
                ], 8, _hoisted_4$1)
              ], 8, _hoisted_3$1);
            }), 64)),
            vue.createElementVNode("div", {
              class: "tooltip",
              "data-tip": `当前倍速 ${vue.unref(playbackRate)}`
            }, [
              vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(playbackRate) ? playbackRate.value = $event : null),
                type: "range",
                min: "0.1",
                max: "8",
                class: "range range-primary range-xs",
                step: "0.1"
              }, null, 512), [
                [vue.vModelText, vue.unref(playbackRate)]
              ])
            ], 8, _hoisted_5$1)
          ]),
          _hoisted_6
        ]);
      };
    }
  });
  const _withScopeId = (n) => (vue.pushScopeId("data-v-1ec61edd"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", { class: "i-carbon-notebook" }, null, -1));
  const _hoisted_2 = {
    key: 0,
    class: "fixed top-0 z-99999 h-full w-full"
  };
  const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("input", {
    id: "deleteModal",
    type: "checkbox",
    class: "modal-toggle"
  }, null, -1));
  const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("h3", { class: "text-lg font-bold" }, " 确认删除当前笔记及图片？ ", -1));
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("label", {
    for: "deleteModal",
    class: "text-black btn btn-ghost"
  }, "取消", -1));
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const { isOn } = storeToRefs(useNoteStore());
      const { jumpTo, removeNote } = useNoteStore();
      const btnRef = vue.ref(null);
      const style2 = vue.ref({
        left: "0px",
        top: "0px"
      });
      const viewbox = _unsafeWindow.document.querySelector("#bilibili-player");
      function setPositon() {
        if (!btnRef.value || isOn.value)
          return;
        style2.value = {
          left: `${viewbox.getBoundingClientRect().right - 150}px`,
          top: `${viewbox.getBoundingClientRect().top - 60}px`
        };
      }
      function handleRemove() {
        removeNote();
        const deleteModal = _unsafeWindow.document.querySelector("#deleteModal");
        deleteModal.checked = false;
      }
      _unsafeWindow.document.addEventListener("click", (e) => {
        const target = e.target;
        if (target.hasAttribute("data-time-jump")) {
          const time = target.getAttribute("data-time-jump");
          jumpTo(Number(time));
        }
      });
      setInterval(setPositon, 500);
      vue.onMounted(setPositon);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("button", {
            ref_key: "btnRef",
            ref: btnRef,
            style: vue.normalizeStyle(vue.unref(style2)),
            class: "btn-active absolute z-999 text-lg font-bold text-white btn btn-md bg-[#fc80a1]!",
            onClick: _cache[0] || (_cache[0] = ($event) => isOn.value = true)
          }, [
            vue.createTextVNode(" 笔记模式  "),
            _hoisted_1
          ], 4),
          vue.unref(isOn) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
            vue.createVNode(vue.unref(M), { class: "default-theme" }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(g), {
                  "min-size": "40",
                  class: "p-3"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_sfc_main$1, { class: "h-full p-3" })
                  ]),
                  _: 1
                }),
                vue.createVNode(vue.unref(g), { "min-size": "30" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_sfc_main$2, { class: "h-full p-3" })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _hoisted_3,
            vue.createElementVNode("div", { class: "modal" }, [
              vue.createElementVNode("div", { class: "modal-box" }, [
                _hoisted_4,
                vue.createElementVNode("div", { class: "modal-action" }, [
                  vue.createElementVNode("label", {
                    class: "bg-[#fc80a1] btn btn-ghost hover:bg-[#fc80a1] hover:text-white!",
                    onClick: handleRemove
                  }, "确认删除"),
                  _hoisted_5
                ])
              ])
            ])
          ])) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1ec61edd"]]);
  vue.createApp(App).use(createPinia()).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue, localforage, MdEditorV3, axios, JSZip, dayjs);
