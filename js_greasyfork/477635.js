// ==UserScript==
// @name         NSSCTF去签
// @namespace    https://www.nssctf.cn/*
// @version      1.5.1
// @description  給NSSCTF去掉所有提示标签这样做题就不会一目了然了,如果没去掉说明jquery没联系上，没关系用着用着就好了。
// @author	     少世
// @match        https://www.nssctf.cn/*
// @match        https://www.ctfer.vip/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/477635/NSSCTF%E5%8E%BB%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/477635/NSSCTF%E5%8E%BB%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "https://code.jquery.com/jquery-3.6.0.min.js");
        script.addEventListener('load', function() {
            callback();
        });
        document.body.appendChild(script);
    }

    function main() {
        // 在此处编写您想要执行的控制台命令
        var consoleCommand = "setInterval(function() { $('.el-tag--light').remove(); })";
        var consoleCommands = "setInterval(function() { $('.el-tag--small').remove(); })";


        // 在油猴脚本中执行控制台命令
        function executeConsoleCommand(command) {
            if (typeof unsafeWindow !== 'undefined') {
                unsafeWindow.eval(command);
            }
        }

        // 在页面加载时执行控制台命令
        executeConsoleCommand(consoleCommand);
        executeConsoleCommand(consoleCommands);
    }

    addJQuery(main);
})();