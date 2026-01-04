// ==UserScript==
// @name         H3 VSCode Dark Theme CSS
// @namespace    https://greasyfork.org/zh-CN/scripts/445809-h3-vscode-dark-theme-css
// @version      0.7
// @description  氚云编辑器 夜间css样式。
// @author       Patchouli_Go_
// @match        *://www.h3yun.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445809/H3%20VSCode%20Dark%20Theme%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/445809/H3%20VSCode%20Dark%20Theme%20CSS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setTimeout( function(){
        //基本css样式
        var style = document.createElement('style')
        style.type = 'text/css'
        style.appendChild(document.createTextNode(
            '.monaco-editor.vs .token.string {\n  color: #ce9178\n}\n' +
            '.monaco-editor.vs .token.keyword.ts{\n  color: #569cd6\n}\n' +
            '.monaco-editor.vs .token.keyword.js{\n  color: #569cd6\n}\n' +
            '.monaco-editor.vs .token.keyword.as {\n  color: #3ac9a4\n}\n' +
            '.monaco-editor.vs .token.delimiter.array {\n  color: #179fff\n}\n' +
            '.monaco-editor.vs .token.delimiter.parenthesis {\n  color: #ce70b3\n}\n' +
            '.monaco-editor.vs .token.delimiter {\n  color: #179ff1\n}\n' +
            '.monaco-editor.vs .token.number {\n  color: #a7ce9b\n}\n' +
            '.monaco-editor.vs .token.identifier {\n  color: #7cdcfe\n}\n' +
            '.monaco-editor.vs .token.comment {\n  color: #6a9955\n}\n' +
            '.monaco-editor-background {\n  background-color: #1e1e1e\n}\n' +
            '.form-design__navbar__left ul li a[data-v-36e38585] {\n  color: #ffffff\n}\n' +
            '.form-design__navbar[data-v-36e38585] {\n  background-color: #2d2d2d\n}\n' +
            '.monaco-editor.vs .glyph-margin {\n  background-color: #252526\n}\n' +
            '.monaco-editor-hover.monaco-editor-background > div > div > div {\n  color: #7cdcfe\n}\n' +
            '.monaco-menu .monaco-action-bar.vertical .action-item:hover:not(.disabled) {\n  background-color: #094771\n}\n' +
            '.context-view.monaco-menu-container {\n  background-color: #252526\n; color: #fff\n}\n' +
            '.context-view.monaco-menu-container.bottom.left > div > div > ul > li > a {\n  color: #fff\n}\n' +
            '.form-attribute-options .attr-row .attr-val .attr-wrap {\n  width: 100%\n}\n' +
            '.monaco-editor.vs .view-overlays.focused .selected-text {\n  background-color: #264f78\n}\n' +
            '.monaco-editor.vs .view-overlays .selected-text {\n  background-color: #3a3d41\n}\n' +
            '.monaco-editor.vs.focused .current-line {\n  border: 2px solid #282828\n}\n' +
            '.monaco-editor.vs .current-line {\n  border: 2px solid #282828\n}\n' +
            '.monaco-editor.vs .cursor {\n  background: #aeafad\n}\n' +
            '.monaco-editor .parameter-hints-widget .wrapper span {\n  color: #c1cccc\n}\n' +
            '.monaco-editor .parameter-hints-widget .wrapper {\n  background-color: #252526\n}\n' +
            '.monaco-editor .parameter-hints-widget .signatures {\n  color: #d4d4d4\n}\n' +
            '.monaco-editor .parameter-hints-widget .signature .parameter.active {\n  color: #18a3ff\n}\n' +
            '.monaco-editor .parameter-hints-widget .documentation .parameter {\n  color: #d4d4d4\n}\n'
        ))
        var head = document.getElementsByTagName('head')[0]
        head.appendChild(style)
        // console.log("test")
    }, 2000)
    setTimeout( function(){
        console.log("finish")
        cssChange();
        var xdoc = document.getElementsByClassName("monaco-editor vs")
        for(let i =0; i< xdoc.length; i++) {
            xdoc[i].addEventListener('mousewheel', function(){
                cssChange();
            });
        }
    }, 2000)
    //绑定滚轮事件实时更新方法函数的颜色样式
    function cssChange() {
        var obj = document.getElementsByClassName("delimiter parenthesis");
        for(let i =0; i< obj.length; i++) {
            if(obj[i].previousSibling.className.indexOf("token identifier") > -1 && (obj[i].innerText == "(" || obj[i].innerText == "()")) {
                obj[i].previousSibling.style.color = "#dcdcaa";
            }
        }
        // var obj = document.getElementsByClassName("string");
        // for(let i =0; i< obj.length; i++) {
        //     obj[i].style.color = "#ce9064";
        // }
        // obj = document.getElementsByClassName("keyword ts");
        // for(let i =0; i< obj.length; i++) {
        //     obj[i].style.color = "#2c7ad6";
        // }
        // obj = document.getElementsByClassName("keyword as");
        // for(let i =0; i< obj.length; i++) {
        //     obj[i].style.color = "#3ac9a4";
        // }
        // obj = document.getElementsByClassName("delimiter ts");
        // for(let i =0; i< obj.length; i++) {
        //     obj[i].style.color = "#179ff1";
        // }
        // obj = document.getElementsByClassName("identifier ts");
        // for(let i =0; i< obj.length; i++) {
        //     obj[i].style.color = "#68cefe";
        // }
        // obj = document.getElementsByClassName("comment ts");
        // for(let i =0; i< obj.length; i++) {
        //     obj[i].style.color = "#6a9955";
        // }
        // obj = document.getElementsByClassName("monaco-editor-background");
        // for(let i =0; i< obj.length; i++) {
        //     obj[i].style.background = "#1e1e1e";
        // }
    }
})();

