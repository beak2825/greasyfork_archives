// ==UserScript==
// @name         github链接新标签打开
// @namespace    https://greasyfork.org/
// @license      MIT
// @version      0.2
// @description  github站内所有的链接都从新的标签页打开，而不从当前页面打开
// @author       byhgz
// @match        *://github.com/*
// @icon         https://github.githubassets.com/assets/apple-touch-icon-144x144-b882e354c005.png
// @downloadURL https://update.greasyfork.org/scripts/489538/github%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/489538/github%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
'use strict';

const getInto = "进入到github页面了....";
console.log(getInto);

const links = document.links;


const timeout = 500;
setInterval(() => {//github站内所有的链接都从新的标签页打开，而不从当前页面打开
    for (let v of links) {
        if (v["target"] === "_blank") {
            continue;
        }
        if (v.tagName.toLowerCase() !== "a") {
            continue;
        }
        v.setAttribute("target", "_blank");
        console.log("已修改该a标签的跳转状态:", v);
    }
}, timeout);

console.log("                   _ooOoo_\n" +
    "                  o8888888o\n" +
    "                  88\" . \"88\n" +
    "                  (| -_- |)\n" +
    "                  O\\  =  /O\n" +
    "               ____/`---'\\____\n" +
    "             .'  \\\\|     |//  `.\n" +
    "            /  \\\\|||  :  |||//  \\\n" +
    "           /  _||||| -:- |||||-  \\\n" +
    "           |   | \\\\\\  -  /// |   |\n" +
    "           | \\_|  ''\\---/''  |   |\n" +
    "           \\  .-\\__  `-`  ___/-. /\n" +
    "         ___`. .'  /--.--\\  `. . __\n" +
    "      .\"\" '<  `.___\\_<|>_/___.'  >'\"\".\n" +
    "     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n" +
    "     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /\n" +
    "======`-.____`-.___\\_____/___.-`____.-'======\n" +
    "                   `=---='\n" +
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n" +
    "         佛祖保佑       永无BUG");

