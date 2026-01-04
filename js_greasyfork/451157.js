// ==UserScript==
// @name         PyScript加载插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  PyScript加载插件,帮助加载PyScript
// @author       bob chen
// @match        https://warranty.bba-app.biz/desktop/
// @match        https://spark-dms.bmwgroup.com.cn/*
// @license      MIT
// @icon         https://warranty.bba-app.biz/desktop/static/image/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451157/PyScript%E5%8A%A0%E8%BD%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/451157/PyScript%E5%8A%A0%E8%BD%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function addScriptAndLink() { // 添加两个标签 link和 script
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://pyscript.net/alpha/pyscript.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://pyscript.net/alpha/pyscript.js";
        script.defer = true;
        document.head.appendChild(script);
    }


    function addPyEnv() { // 添加一个标签 py-env
        const pyEnv = document.createElement("py-env");
        pyEnv.innerHTML = `
    - numpy
    - pandas
    - lxml
    `;
        document.body.appendChild(pyEnv);
    }



    function addPyRepl() { // 添加一个标签 <py-repl></py-repl>
        const pyRepl = document.createElement("py-repl");
        document.body.appendChild(pyRepl);
    }


    function addPyScript() { // 添加一个标签 py-script
        const pyScript = document.createElement("py-script");
        pyScript.innerHTML = `
    import numpy as np
    import pandas as pd
    import js
    js.alert("PyScript已加载完成")


    `;
    document.body.appendChild(pyScript);
}


    function addBtn() { // 添加一个标签 button 实现功能控制 py-repl 删除和添加
        const btn = document.createElement("button");
        btn.innerHTML = "显示/隐藏";
        // btn的颜色为绿色,提交按钮
        btn.style.backgroundColor = "green";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "5px";
        btn.style.padding = "5px 10px";
        btn.style.margin = "10px";
        btn.style.cursor = "pointer";

        btn.onclick = function () {
            const pyRepl = document.querySelector("py-repl");
            // 实现功能控制 py-repl 删除和添加
            if (pyRepl) {
                pyRepl.remove();
            } else {
                addPyRepl();
            }



        };
        document.body.appendChild(btn); // 将button添加到body中
    }

    // 将html所有的元素转换为string data
    function html2str(){
        window.data = document.querySelector('html').outerHTML
        return window.data
    }

    // addPyScript();
    function main() {

        addPyEnv(); // 添加一个标签 py-env
        addPyRepl(); // 添加一个标签 <py-repl></py-repl>
        addPyScript(); // 添加一个标签 py-script
        addScriptAndLink(); // 添加两个标签 link和 script
        // addBtn(); // 添加一个标签 button 实现功能控制 py-repl 显得和隐藏
    }

    main(); // 运行main函数

    // 通过window.setInterval()方法来实现定时器,每隔一段时间执行一次函数html2str
    window.setInterval(html2str, 1000);



})();