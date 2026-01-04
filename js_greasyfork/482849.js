// ==UserScript==
// @name         Luogu Diff Modify
// @namespace    http://tampermonkey.net/
// @version      114514
// @description  做题别看难度了哥
// @author       Cap1taL
// @match        https://www.luogu.com.cn/problem/*
// @require      https://cdn.staticfile.org/turndown/7.1.2/turndown.min.js
// @require      https://cdn.staticfile.org/markdown-it/13.0.1/markdown-it.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdn.staticfile.org/chroma-js/2.4.2/chroma.min.js
// @require      https://cdn.staticfile.org/xterm/3.9.2/xterm.min.js
// @require      https://cdn.staticfile.org/dexie/3.2.4/dexie.min.js
// @resource     acwing_cpp_code_completer https://aowuucdn.oss-cn-beijing.aliyuncs.com/acwing_cpp_code_completer-0.0.11.json
// @resource     wandboxlist https://wandbox.org/api/list.json
// @resource     xtermcss https://cdn.staticfile.org/xterm/3.9.2/xterm.min.css
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482849/Luogu%20Diff%20Modify.user.js
// @updateURL https://update.greasyfork.org/scripts/482849/Luogu%20Diff%20Modify.meta.js
// ==/UserScript==
window.addEventListener('load',function(){
        console.log("start!");
        var num=document.getElementsByClassName("info-rows")[0].childElementCount;
        document.getElementsByClassName("info-rows")[0].children[num-2].children[1].remove();
        var Diff=document.createElement("span");
        Diff.innerHTML='<span data-v-8b7f80ba=""><a data-v-0640126c="" data-v-263e39b8="" data-v-ea4425c6="" href="/problem/list?difficulty=7" class="color-none">🤣<span data-v-263e39b8="" style="color: red;background: linear-gradient(to right, rgb(254, 76, 97),rgb(243, 156, 17),rgb(255, 193, 22),rgb(82, 196, 26), rgb(52, 152, 219),rgb(157, 61, 207),rgb(14, 29, 105));-webkit-background-clip: text;-webkit-text-fill-color: transparent;">不是哥们你做题看难度啊</span>🤣</a></span>';
        document.getElementsByClassName("info-rows")[0].children[num-2].appendChild(Diff);
})