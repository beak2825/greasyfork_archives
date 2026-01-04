// ==UserScript==
// @name         11
// @namespace    https://item.taobao.com/item.htm?spm=a2oq0.1debJ6Iafr&ft=t&id=
// @note         ↑是淘宝宝贝链接噢，欢迎进店定制脚本
// @note         可以自定义弹幕、自定义发送频率、随机发送弹幕
// @note         w9443
// @description  虎牙自动发弹幕【淘宝店铺制作】
// @version      1.3.13
// @author       淘宝店铺制作
// @match        https://www.huya.com/*
// @icon         https://www.huya.com/favicon.ico
// @require      https://greasyfork.org/scripts/392378-autosend-huya3/code/AutoSend_Huya3.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393163/11.user.js
// @updateURL https://update.greasyfork.org/scripts/393163/11.meta.js
// ==/UserScript==

(function() {
    // 默认发送频率60秒
    var time = 60;
    // 密钥
    var key = "c9e23cd2f292a372a970d75bdc5c57b8";

    var danmu = new Array();
    // 默认弹幕1
    danmu[1] = `[大笑][大笑]
[666][666][666]
哈哈哈哈哈哈
好秀
主播好菜
[偷笑][偷笑]`;
    // 默认弹幕2
    danmu[2] = `666666666
66666
666666
6翻了
这波操作666[大笑]
秀啊主播
厉害
[666][666][666]`;
    // 默认弹幕3
    danmu[3] = `？？？？？？？？
？？？？？
？？？？？？？？？？？
2333333
你在想屁吃
[奸笑][奸笑][奸笑]`;
    // 默认弹幕4
    danmu[4] = `老板大气
大气啊
大气大气大气大气大气
666666
[送花][送花][送花]
[大哥][大哥][大哥]`;
    // 默认弹幕5
    danmu[5] = `哈哈哈哈哈哈哈哈
这波操作666[大笑]
哈哈哈哈哈哈
[大笑][大笑][大笑]
[大笑][大笑][大笑]
[偷笑][偷笑][偷笑]
[奸笑][奸笑][奸笑]`;

    AutoSend_Huya(time, danmu, key);

})();