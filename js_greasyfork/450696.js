// ==UserScript==
// @name         ahkcn代码块增强
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  使用highlight.js为ahkcn高亮代码, 使用highlightjs-line-numbers.js和highlightjs-copy提供行号和一键复制功能
// @author       Tebayaki
// @match        https://www.autoahk.com/archives/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/languages/python.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/languages/cpp.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/languages/javascript.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450696/ahkcn%E4%BB%A3%E7%A0%81%E5%9D%97%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/450696/ahkcn%E4%BB%A3%E7%A0%81%E5%9D%97%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // 增加一个空值判断, 避免在某些情况报错
    // https://unpkg.com/highlightjs-copy@1.0.3/dist/highlightjs-copy.min.js
    class CopyButtonPlugin{constructor(options={}){self.hook=options.hook;self.callback=options.callback}"after:highlightElement"({el,text}){let button=Object.assign(document.createElement("button"),{innerHTML:"Copy",className:"hljs-copy-button"});button.dataset.copied=false;if(!el.parentElement){return}el.parentElement.classList.add("hljs-copy-wrapper");el.parentElement.appendChild(button);el.parentElement.style.setProperty("--hljs-theme-background",window.getComputedStyle(el).backgroundColor);button.onclick=function(){if(!navigator.clipboard)return;let newText=text;if(hook&&typeof hook==="function"){newText=hook(text,el)||text}navigator.clipboard.writeText(newText).then(function(){button.innerHTML="Copied!";button.dataset.copied=true;let alert=Object.assign(document.createElement("div"),{role:"status",className:"hljs-copy-alert",innerHTML:"Copied to clipboard"});el.parentElement.appendChild(alert);setTimeout(()=>{button.innerHTML="Copy";button.dataset.copied=false;el.parentElement.removeChild(alert);alert=null},2e3)}).then(function(){if(typeof callback==="function")return callback(newText,el)})}}};
    // this lib need some change to prevent "highlight.js not detected!" error
    // https://cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.8.0/highlightjs-line-numbers.min.js
    !function(r,o){"use strict";var e,i="hljs-ln",l="hljs-ln-line",h="hljs-ln-code",s="hljs-ln-numbers",c="hljs-ln-n",m="data-line-number",a=/\r\n|\r|\n/g;function u(e){for(var n=e.toString(),t=e.anchorNode;"TD"!==t.nodeName;)t=t.parentNode;for(var r=e.focusNode;"TD"!==r.nodeName;)r=r.parentNode;var o=parseInt(t.dataset.lineNumber),a=parseInt(r.dataset.lineNumber);if(o==a)return n;var i,l=t.textContent,s=r.textContent;for(a<o&&(i=o,o=a,a=i,i=l,l=s,s=i);0!==n.indexOf(l);)l=l.slice(1);for(;-1===n.lastIndexOf(s);)s=s.slice(0,-1);for(var c=l,u=function(e){for(var n=e;"TABLE"!==n.nodeName;)n=n.parentNode;return n}(t),d=o+1;d<a;++d){var f=p('.{0}[{1}="{2}"]',[h,m,d]);c+="\n"+u.querySelector(f).textContent}return c+="\n"+s}function n(e){try{var n=o.querySelectorAll("code.hljs,code.nohighlight");for(var t in n)n.hasOwnProperty(t)&&(n[t].classList.contains("nohljsln")||d(n[t],e))}catch(e){r.console.error("LineNumbers error: ",e)}}function d(e,n){"object"==typeof e&&r.setTimeout(function(){e.innerHTML=f(e,n)},0)}function f(e,n){var t,r,o=(t=e,{singleLine:function(e){return!!e.singleLine&&e.singleLine}(r=(r=n)||{}),startFrom:function(e,n){var t=1;isFinite(n.startFrom)&&(t=n.startFrom);var r=function(e,n){return e.hasAttribute(n)?e.getAttribute(n):null}(e,"data-ln-start-from");return null!==r&&(t=function(e,n){if(!e)return n;var t=Number(e);return isFinite(t)?t:n}(r,1)),t}(t,r)});return function e(n){var t=n.childNodes;for(var r in t){var o;t.hasOwnProperty(r)&&(o=t[r],0<(o.textContent.trim().match(a)||[]).length&&(0<o.childNodes.length?e(o):v(o.parentNode)))}}(e),function(e,n){var t=g(e);""===t[t.length-1].trim()&&t.pop();if(1<t.length||n.singleLine){for(var r="",o=0,a=t.length;o<a;o++)r+=p('<tr><td class="{0} {1}" {3}="{5}"><div class="{2}" {3}="{5}"></div></td><td class="{0} {4}" {3}="{5}">{6}</td></tr>',[l,s,c,m,h,o+n.startFrom,0<t[o].length?t[o]:" "]);return p('<table class="{0}">{1}</table>',[i,r])}return e}(e.innerHTML,o)}function v(e){var n=e.className;if(/hljs-/.test(n)){for(var t=g(e.innerHTML),r=0,o="";r<t.length;r++){o+=p('<span class="{0}">{1}</span>\n',[n,0<t[r].length?t[r]:" "])}e.innerHTML=o.trim()}}function g(e){return 0===e.length?[]:e.split(a)}function p(e,t){return e.replace(/\{(\d+)\}/g,function(e,n){return void 0!==t[n]?t[n]:e})}hljs?(hljs.initLineNumbersOnLoad=function(e){"interactive"===o.readyState||"complete"===o.readyState?n(e):r.addEventListener("DOMContentLoaded",function(){n(e)})},hljs.lineNumbersBlock=d,hljs.lineNumbersValue=function(e,n){if("string"!=typeof e)return;var t=document.createElement("code");return t.innerHTML=e,f(t,n)},(e=o.createElement("style")).type="text/css",e.innerHTML=p(".{0}{border-collapse:collapse}.{0} td{padding:0}.{1}:before{content:attr({2})}",[i,c,m]),o.getElementsByTagName("head")[0].appendChild(e)):r.console.error("highlight.js not detected!"),document.addEventListener("copy",function(e){var n,t=window.getSelection();!function(e){for(var n=e;n;){if(n.className&&-1!==n.className.indexOf("hljs-ln-code"))return 1;n=n.parentNode}}(t.anchorNode)||(n=-1!==window.navigator.userAgent.indexOf("Edge")?u(t):t.toString(),e.clipboardData.setData("text/plain",n),e.preventDefault())})}(window,document);
    ///////////////////////////
    GM_addStyle(`
    pre {
        color: #dcdcdc;
        background: #1e1e1e;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 5px;
        padding-right: 5px;
    }

    .hljs-ln-line {
        background: #1e1e1e;
        border: 0px !important;
        padding-top: 0px !important;
        padding-bottom: 0px !important;
        font-family: -webkit-body !important;
        font-size: small !important
    }

    .hljs-ln-numbers {
        padding-left: 5px !important;
        padding-right: 10px !important;
        border-right: 1px solid #CCC !important;
        text-align: center !important;
        width: 20px !important;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none
    }

    .hljs-ln-code {
        padding-left: 10px !important;
        -webkit-user-select: text;
        -ms-user-select: text;
        user-select: text
    }

    .hljs {
        background: #1e1e1e;
        color: #dcdcdc
    }

    .hljs-params,
    .hljs-symbol,
    .hljs-object,
    .hljs-array,
    .hljs-expr,
    .hljs-punctuation {
        color: #dcdcdc
    }

    .hljs-char.escape_ {
        color: #d7ba7d
    }

    .hljs-class {
        color: #41c9a2
    }

    .hljs-keyword {
        color: #bd63c5
    }

    .hljs-literal,
    .hljs-built_in,
    .hljs-type {
        color: #569cd6
    }

    .hljs-number {
        color: #b8d7a3
    }

    .hljs-command,
    .hljs-meta .hljs-string,
    .hljs-string {
        color: #d69d85
    }

    .hljs-regexp,
    .hljs-template-tag {
        color: #9a5334
    }

    .hljs-formula,
    .hljs-function,
    .hljs-subst,
    .hljs-title {
        color: #dcdcaa
    }

    .hljs-comment,
    .hljs-quote {
        color: #57a64a;
        font-style: italic
    }

    .hljs-doctag {
        color: #608b4e
    }

    .hljs-punctuation2,
    .hljs-meta,
    .hljs-meta .hljs-keyword,
    .hljs-tag {
        color: #9b9b9b
    }

    .hljs-template-variable,
    .hljs-ref,
    .hljs-variable {
        color: #9cdcfe
    }

    .hljs-property,
    .hljs-attr,
    .hljs-doubleRef,
    .hljs-attribute {
        color: #008cff
    }

    .hljs-section {
        color: gold
    }

    .hljs-bullet,
    .hljs-selector-attr,
    .hljs-selector-class,
    .hljs-selector-id,
    .hljs-selector-pseudo,
    .hljs-selector-tag {
        color: #d7ba7d
    }

    .hljs-addition {
        background-color: #144212;
        display: inline-block;
        width: 100%
    }

    .hljs-deletion {
        background-color: #600;
        display: inline-block;
        width: 100%
    }

    .hljs-copy-wrapper {
        position: relative;
        overflow: auto
    }

    .hljs-copy-wrapper:hover .hljs-copy-button,
    .hljs-copy-button[data-copied="true"] {
        opacity: 1
    }

    .hljs-copy-button {
        position: absolute;
        top: 1em;
        right: 1em;
        width: 2rem;
        height: 2rem;
        padding: 2px;
        text-indent: -9999px;
        color: #fff;
        border-radius: .25rem;
        border: 1px solid #ffffff22;
        background-color: #2d2b57;
        background-color: var(--hljs-theme-background);
        background-image: url('data:image/svg+xml;utf-8,<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 5C5.73478 5 5.48043 5.10536 5.29289 5.29289C5.10536 5.48043 5 5.73478 5 6V20C5 20.2652 5.10536 20.5196 5.29289 20.7071C5.48043 20.8946 5.73478 21 6 21H18C18.2652 21 18.5196 20.8946 18.7071 20.7071C18.8946 20.5196 19 20.2652 19 20V6C19 5.73478 18.8946 5.48043 18.7071 5.29289C18.5196 5.10536 18.2652 5 18 5H16C15.4477 5 15 4.55228 15 4C15 3.44772 15.4477 3 16 3H18C18.7956 3 19.5587 3.31607 20.1213 3.87868C20.6839 4.44129 21 5.20435 21 6V20C21 20.7957 20.6839 21.5587 20.1213 22.1213C19.5587 22.6839 18.7957 23 18 23H6C5.20435 23 4.44129 22.6839 3.87868 22.1213C3.31607 21.5587 3 20.7957 3 20V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H8C8.55228 3 9 3.44772 9 4C9 4.55228 8.55228 5 8 5H6Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3C7 1.89543 7.89543 1 9 1H15C16.1046 1 17 1.89543 17 3V5C17 6.10457 16.1046 7 15 7H9C7.89543 7 7 6.10457 7 5V3ZM15 3H9V5H15V3Z" fill="white"/></svg>');
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0;
        transition: all 200ms ease
    }

    .hljs-copy-button:hover {
        border-color: #ffffff44
    }

    .hljs-copy-button:active {
        transform: scale(0.8, 0.8)
    }

    .hljs-copy-button[data-copied="true"] {
        background-image: url('data:image/svg+xml;utf-8,<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 5C5.73478 5 5.48043 5.10536 5.29289 5.29289C5.10536 5.48043 5 5.73478 5 6V20C5 20.2652 5.10536 20.5196 5.29289 20.7071C5.48043 20.8946 5.73478 21 6 21H18C18.2652 21 18.5196 20.8946 18.7071 20.7071C18.8946 20.5196 19 20.2652 19 20V6C19 5.73478 18.8946 5.48043 18.7071 5.29289C18.5196 5.10536 18.2652 5 18 5H16C15.4477 5 15 4.55228 15 4C15 3.44772 15.4477 3 16 3H18C18.7956 3 19.5587 3.31607 20.1213 3.87868C20.6839 4.44129 21 5.20435 21 6V20C21 20.7957 20.6839 21.5587 20.1213 22.1213C19.5587 22.6839 18.7957 23 18 23H6C5.20435 23 4.44129 22.6839 3.87868 22.1213C3.31607 21.5587 3 20.7957 3 20V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H8C8.55228 3 9 3.44772 9 4C9 4.55228 8.55228 5 8 5H6Z" fill="violet"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3C7 1.89543 7.89543 1 9 1H15C16.1046 1 17 1.89543 17 3V5C17 6.10457 16.1046 7 15 7H9C7.89543 7 7 6.10457 7 5V3ZM15 3H9V5H15V3Z" fill="violet"/></svg>')
    }

    @media(prefers-reduced-motion) {
        .hljs-copy-button {
            transition: none
        }
    }

    .hljs-copy-alert {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px
    }
    `);
    const gramr_autohotkey = e => {
        const reg = {
            ltrim: "^[ \\t]*",
            space: "[ \\t]+",
            space_opt: "[ \\t]*",
            name: "(?<![\\w\\u0080-\\uffff])[\\w\\u0080-\\uffff]+(?![\\w\\u0080-\\uffff])"
        },
              com = {
                  scope: "comment",
                  variants: [
                      { begin: /;/, end: /$/ },
                      { begin: /^\s*\/\*/, end: /^\s*\*\// },
                      { match: /(?<=\n)\*\// }
                  ],
                  contains: [{ scope: "doctag", match: /@\S+/ }]
              },
              keyword1 = { beginKeywords: "and byref case default else finally for in new not or return switch throw try until while" },
              built_in = { scope: "built_in", match: /\b(A_AhkPath|A_AhkVersion|A_AppData|A_AppDataCommon|A_Args|A_AutoTrim|A_BatchLines|A_CaretX|A_CaretY|A_ComputerName|A_ComSpec|A_ControlDelay|A_CoordModeCaret|A_CoordModeMenu|A_CoordModeMouse|A_CoordModePixel|A_CoordModeToolTip|A_Cursor|A_DD|A_DDD|A_DDDD|A_DefaultGui|A_DefaultListView|A_DefaultMouseSpeed|A_DefaultTreeView|A_Desktop|A_DesktopCommon|A_DetectHiddenText|A_DetectHiddenWindows|A_EndChar|A_EventInfo|A_ExitReason|A_FileEncoding|A_FormatFloat|A_FormatInteger|A_Gui|A_GuiControl|A_GuiControlEvent|A_GuiEvent|A_GuiHeight|A_GuiWidth|A_GuiX|A_GuiY|A_Hour|A_IconFile|A_IconHidden|A_IconNumber|A_IconTip|A_Index|A_IPAddress1|A_IPAddress2|A_IPAddress3|A_IPAddress4|A_Is64bitOS|A_IsAdmin|A_IsCompiled|A_IsCritical|A_IsPaused|A_IsSuspended|A_IsUnicode|A_KeyDelay|A_KeyDelayPlay|A_KeyDuration|A_KeyDurationPlay|A_Language|A_LastError|A_LineFile|A_LineNumber|A_ListLines|A_LoopField|A_LoopFileAttrib|A_LoopFileDir|A_LoopFileExt|A_LoopFileFullPath|A_LoopFileLongPath|A_LoopFileName|A_LoopFilePath|A_LoopFileShortName|A_LoopFileShortPath|A_LoopFileSize|A_LoopFileSizeKB|A_LoopFileSizeMB|A_LoopFileTimeAccessed|A_LoopFileTimeCreated|A_LoopFileTimeModified|A_LoopReadLine|A_LoopRegKey|A_LoopRegName|A_LoopRegSubKey|A_LoopRegTimeModified|A_LoopRegType|A_MDay|A_Min|A_MM|A_MMM|A_MMMM|A_Mon|A_MouseDelay|A_MouseDelayPlay|A_MSec|A_MyDocuments|A_Now|A_NowUTC|A_NumBatchLines|A_OSType|A_OSVersion|A_PriorHotkey|A_PriorKey|A_ProgramFiles|A_Programs|A_ProgramsCommon|A_PtrSize|A_RegView|A_ScreenDPI|A_ScreenHeight|A_ScreenWidth|A_ScriptDir|A_ScriptFullPath|A_ScriptHwnd|A_ScriptName|A_Sec|A_SendLevel|A_SendMode|A_Space|A_StartMenu|A_StartMenuCommon|A_Startup|A_StartupCommon|A_StoreCapsLockMode|A_StringCaseSense|A_Tab|A_Temp|A_ThisFunc|A_ThisHotkey|A_ThisLabel|A_ThisMenu|A_ThisMenuItem|A_ThisMenuItemPos|A_TickCount|A_TimeIdle|A_TimeIdleKeyboard|A_TimeIdleMouse|A_TimeIdlePhysical|A_TimeSincePriorHotkey|A_TimeSinceThisHotkey|A_TitleMatchMode|A_TitleMatchModeSpeed|A_UserName|A_WDay|A_WinDelay|A_WinDir|A_WorkingDir|A_YDay|A_Year|A_YWeek|A_YYYY|Clipboard|ClipboardAll|ComSpec|ErrorLevel|False|ProgramFiles|True|this)\b/ },
              num = hljs.C_NUMBER_MODE,
              esc = { scope: "char.escape", match: /`[\s\S]/ },
              esc2 = { scope: "char.escape", match: /""/ },
              variable = { scope: "variable", match: reg.name },
              ref = {
                  variants: [
                      { begin: [/%/, built_in.match, /%/], beginScope: { 1: "punctuation", 2: "built_in", 3: "punctuation" } },
                      { begin: [/%/, reg.name, /%/], beginScope: { 1: "punctuation", 2: "variable", 3: "punctuation" } },
                  ]
              },
              doubleRef = {
                  variants: [
                      { begin: [/%/, built_in.match, /%/], beginScope: { 1: "punctuation2", 2: "built_in", 3: "punctuation2" } },
                      { begin: [/%/, reg.name, /%/], beginScope: { 1: "punctuation2", 2: "variable", 3: "punctuation2" } },
                  ]
              },
              func = { begin: [reg.name, reg.space_opt, /(?=\()/], beginScope: { 1: "function" } },
              str = {}, obj = {}, arr = {}, parenExpr = {},
              exprs = [com, num, keyword1, built_in, str, func, doubleRef, obj, arr, parenExpr, variable];
        Object.assign(str, {
            scope: "string",
            end: /"/,
            variants: [
                {
                    begin: /"(?=[^"]*\n)/,
                    contains: [com, esc, esc2,
                               {
                                   scope: "string",
                                   begin: /^\s*\)/,
                                   end: /"/,
                                   contains: [esc, esc2],
                                   endsParent: 1
                               },
                               {
                                   scope: "punctuation",
                                   begin: [/^\s*\(/, /.*$/],
                                   beginScope: { 1: "string", 2: "meta" },
                                   end: /(?=\n\s*\).*")/,
                                   excludeEnd: 1,
                                   contains: [
                                       {
                                           scope: "string",
                                           begin: /^|"/,
                                           end: /$|"/,
                                           contains: [esc, esc2]
                                       },
                                       num, func, doubleRef, parenExpr, built_in, variable,
                                   ]
                               }
                              ]
                },
                {
                    begin: /"/,
                    contains: [esc, esc2]
                },
            ],
        });
        Object.assign(obj, {
            scope: "object",
            begin: /\{(?![\s\S]*\n\s*})/,
            end: /\}/,
            contains: [{
                begin: [reg.name, reg.space_opt, /:/],
                beginScope: { 1: "variable" }
            }, ...exprs]
        });
        Object.assign(arr, {
            scope: "array",
            begin: /\[/,
            end: /\]/,
            contains: exprs
        });
        Object.assign(obj, {
            scope: "object",
            begin: /\{(?![\s\S]*\n\s*})/,
            end: /\}/,
            contains: [{
                begin: [reg.name, reg.space_opt, /:/],
                beginScope: { 1: "variable" }
            }, ...exprs]
        });
        Object.assign(arr, {
            scope: "array",
            begin: /\[/,
            end: /\]/,
            contains: exprs
        });
        Object.assign(parenExpr, {
            scope: "expr",
            begin: /\(/,
            end: /\)/,
            contains: exprs
        });
        const cmdExpr = {
            scope: "command",
            begin: /[^]/,
            end: /$(?!\n\s*(,|\(|;|\/\*))/,
            contains: [
                { scope: "punctuation", match: /,/ },
                {
                    scope: "string",
                    begin: [reg.ltrim, /\(/, /.*$/],
                    beginScope: { 3: "meta" },
                    end: /^\s*\)/,
                    contains: [esc, ref]
                },
                {
                    scope: "punctuation",
                    begin: /%[ \t]+/,
                    end: /$|,/,
                    contains: exprs
                },
                ref,
                com,
                esc,
            ]
        },
              keyword2 = {
                  scope: "keyword",
                  match: /\b(break|catch|continue|goto|gosub)\b/,
                  starts: cmdExpr
              },
              exprAssign = {
                  begin: /:=/,
                  end: /$(?!\n\s*(?:,|;|\/\*))/,
                  contains: [com, num, func, keyword1, built_in, variable, doubleRef, str]
              },
              varDecl = {
                  beginKeywords: "global local static",
                  end: exprAssign.end,
                  contains: exprAssign.contains
              },
              cmdAssign = {
                  begin: [reg.name, reg.space_opt, /=/],
                  beginScope: { 1: "variable" },
                  starts: { scope: cmdExpr.scope, begin: cmdExpr.begin, end: cmdExpr.end, contains: cmdExpr.contains.slice(1) }
              },
              cmd = {
                  scope: "function",
                  variants: [
                      {
                          begin: /\b(AutoTrim|BlockInput|Click|ClipWait|Control|ControlClick|ControlFocus|ControlGet|ControlGetFocus|ControlGetPos|ControlGetText|ControlMove|ControlSend|ControlSendRaw|ControlSetText|CoordMode|Critical|DetectHiddenText|DetectHiddenWindows|Drive|DriveGet|DriveSpaceFree|Edit|EnvAdd|EnvDiv|EnvGet|EnvMult|EnvSet|EnvSub|EnvUpdate|Exit|ExitApp|FileAppend|FileCopy|FileCopyDir|FileCreateDir|FileCreateShortcut|FileDelete|FileEncoding|FileGetAttrib|FileGetShortcut|FileGetSize|FileGetTime|FileGetVersion|FileInstall|FileMove|FileMoveDir|FileRead|FileReadLine|FileRecycle|FileRecycleEmpty|FileRemoveDir|FileSelectFile|FileSelectFolder|FileSetAttrib|FileSetTime|FormatTime|GetKeyState|GroupActivate|GroupAdd|GroupClose|GroupDeactivate|Gui|GuiControl|GuiControlGet|Hotkey|ImageSearch|IniDelete|IniRead|IniWrite|Input|InputBox|InputBox|KeyHistory|KeyWait|ListHotkeys|ListLines|ListVars|Menu|MouseClick|MouseClickDrag|MouseGetPos|MouseMove|MsgBox|OnExit|OutputDebug|Pause|PixelGetColor|PixelSearch|PostMessage|Process|Progress|Random|RegDelete|RegRead|RegWrite|Reload|Run|RunAs|RunWait|Send|SendEvent|SendInput|SendLevel|SendMessage|SendMode|SendPlay|SendRaw|SetBatchLines|SetCapsLockState|SetControlDelay|SetDefaultMouseSpeed|SetEnv|SetFormat|SetKeyDelay|SetMouseDelay|SetNumLockState|SetRegView|SetScrollLockState|SetStoreCapsLockMode|SetTimer|SetTitleMatchMode|SetWinDelay|SetWorkingDir|Shutdown|Sort|SoundBeep|SoundGet|SoundGetWaveVolume|SoundPlay|SoundSet|SoundSetWaveVolume|SplashImage|SplashTextOff|SplashTextOn|SplitPath|StatusBarGetText|StatusBarWait|StringCaseSense|StringGetPos|StringLeft|StringLen|StringLower|StringMid|StringReplace|StringRight|StringSplit|StringTrimLeft|StringTrimRight|StringUpper|Suspend|SysGet|Thread|ToolTip|Transform|TrayTip|URLDownloadToFile|WinActivate|WinActivateBottom|WinClose|WinGet|WinGetActiveStats|WinGetActiveTitle|WinGetClass|WinGetPos|WinGetText|WinGetTitle|WinHide|WinKill|WinMaximize|WinMenuSelectItem|WinMinimize|WinMinimizeAll|WinMinimizeAllUndo|WinMove|WinRestore|WinSet|WinSetTitle|WinShow|WinWait|WinWaitActive|WinWaitClose|WinWaitNotActive|If(Not)?Exist|IfWin(Not)?Exist|IfWin(Not)?Active|IfMsgBox|IfEqual|IfNotEqual|IfLess|IfLessOrEqual|IfGreater|IfGreaterOrEqual)(?=(,|\s|$))/,
                          starts: cmdExpr
                      },
                      { begin: /\b(Sleep)(?=(,|\s|$))/ }
                  ]
              },
              loopStatement = {
                  beginKeywords: "loop",
                  starts: {
                      scope: cmdExpr.scope,
                      begin: cmdExpr.begin,
                      end: /(?={.*\n)|$(?!\n\s*(,|\(|;|\/\*))/,
                      contains: cmdExpr.contains
                  }
              },
              ifStatement = {
                  variants: [
                      {
                          scope: "string",
                          begin: [/\bif/, reg.space, reg.name, reg.space_opt, />=|<=|!=|<|>|=/],
                          beginScope: { 1: "keyword", 3: "variable", 5: "punctuation" },
                          starts: loopStatement.starts
                      },
                      {
                          scope: "string",
                          begin: [/\bif/, reg.space, /%/, reg.name, /%/, reg.space_opt, />=|<=|!=|>|<|=/],
                          beginScope: { 1: "keyword", 3: "punctuation", 4: "doubleRef", 5: "punctuation", 7: "punctuation" },
                          starts: loopStatement.starts
                      },
                      {
                          begin: [/\bif/, reg.space, reg.name, reg.space, /(not[ \t]+)?(in|contains)\b/],
                          beginScope: { 1: "keyword", 3: "variable", 5: "keyword" },
                          starts: cmdExpr
                      },
                      {
                          begin: [/\bif/, reg.space, reg.name, reg.space, /is([ \t]not)?/, reg.space, reg.name],
                          beginScope: { 1: "keyword", 3: "variable", 5: "keyword", 7: "class" }
                      },
                      {
                          begin: [/\bif/, reg.space, reg.name, reg.space, /(not[ \t]+)?between/],
                          beginScope: { 1: "keyword", 3: "variable", 5: "keyword" },
                          starts: { scope: cmdExpr.scope, begin: cmdExpr.begin, end: cmdExpr.end, contains: [{ scope: "keyword", match: /\band\b/ }, ...cmdExpr.contains.slice(1)] }
                      },
                      { beginKeywords: "if" }
                  ]
              },
              directives = {
                  scope: "meta",
                  variants: [
                      {
                          begin: /#(AllowSameLineComments|ClipboardTimeout|CommentFlag|ErrorStdOut|EscapeChar|HotkeyInterval|HotkeyModifierTimeout|Hotstring|IfWin(Not)?Active|IfWin(Not)?Exist|IfTimeout|Include(Again)?|InputLevel|InstallKeybdHook|InstallMouseHook|KeyHistory|MaxHotkeysPerInterval|MaxMem|MaxThreads|MaxThreadsBuffer|MaxThreadsPerHotkey|MenuMaskKey|NoEnv|NoTrayIcon|Persistent|Requires|SingleInstance|UseHook|Warn|WinActivateForce)\b/,
                          starts: cmdExpr
                      },
                      { begin: /#(If)/ }
                  ]
              },
              hotkey = {
                  scope: "label",
                  variants: [
                      // hotstring
                      {
                          begin: [reg.ltrim, /:/, /.*/, /:(?=.+::)/],
                          beginScope: { 3: "meta" },
                          end: /::/,
                          contains: [
                              {
                                  scope: "string",
                                  begin: /(?<=:)/,
                                  end: /(?=::)/,
                                  contains: [esc]
                              }
                          ],
                          starts: {
                              scope: "string",
                              end: /$/,
                              contains: [esc]
                          }
                      },
                      // hotkey
                      { match: [reg.ltrim, /[#!^+&<>*~$]*([a-z0-9]+|[\x21-\x7e ])([ \t]+&[ \t]+[#!^+&<>*~$]*([a-z0-9]+|[\x21-\x7e ]))*([ \t]+UP)*::/], beginScope: {} },
                  ]
              },
              lable = {
                  scope: "label",
                  match: [reg.ltrim, reg.name + ":(?!=)"],
                  beginScope: {}
              },
              classDecl = {
                  variants: [
                      {
                          begin: [/\bclass/, reg.space, reg.name, reg.space, /extends/, reg.space, reg.name],
                          beginScope: { 1: "keyword", 3: "class", 5: "keyword", 7: "class" }
                      },
                      {
                          begin: [/\bclass/, reg.space, reg.name],
                          beginScope: { 1: "keyword", 3: "class" }
                      }
                  ]
              },
              block = {
                  variants: [
                      { begin: /{(?=\s*\n)/ },
                      { begin: /(?<=^\s*){/ }
                  ],
                  end: /^\s*}/,
                  contains: [lable, cmd, ifStatement, loopStatement, varDecl, classDecl, exprAssign, cmdAssign, keyword2, "self", {
                      begin: [/get|set/, reg.space_opt, /(?=\{)/], beginScope: { 1: "function" }
                  }, ...exprs]
              };
        return {
            name: "AutoHotkey",
            case_insensitive: true,
            contains: [hotkey, lable, cmd, directives, ifStatement, loopStatement, varDecl, classDecl, exprAssign, cmdAssign, block, keyword2, ...exprs]
        }
    }
    Object.defineProperty(unsafeWindow, "PR_SHOULD_USE_CONTINUATION", {
        get: () => 1,
        set: (v) => { unsafeWindow.b2_global.prettify_load = 0 }
    });
    hljs.registerLanguage("autohotkey", gramr_autohotkey);
    hljs.addPlugin(new CopyButtonPlugin());
    hljs.highlightAll();
    hljs.initLineNumbersOnLoad();
})();
