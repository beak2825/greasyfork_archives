// ==UserScript==
// @name         解除掌上道聚城限制
// @namespace    https://jinzig.com
// @version      1.1.0
// @description  提前参与掌上道聚城优惠活动
// @author       jinzig
// @match        *://app.daoju.qq.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/422635/%E8%A7%A3%E9%99%A4%E6%8E%8C%E4%B8%8A%E9%81%93%E8%81%9A%E5%9F%8E%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/422635/%E8%A7%A3%E9%99%A4%E6%8E%8C%E4%B8%8A%E9%81%93%E8%81%9A%E5%9F%8E%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.appendChild(document.createTextNode("var isDjcApp = function(){return true;};var HostApp = {};"));
    document.getElementsByTagName('head')[0].appendChild(script);
    var text = "var run = true;\nvar print2 = 0;\nvar rst = '';\nvar showmsg = function (e){\n\tif(!run)\n\t\treturn;\n\tif(e.indexOf('太快了') != -1)\n\t\treturn;\n\tconsole.log(e);\n\tif(e.indexOf('钥匙不足') != -1){\n\t\trun = false;\n\t\tif(rst == '')\n\t\t\trst = '未抽中任何永久道具';\n\t\tprint2(rst);\n\t}else{\n\t\tif(e.indexOf('30天') != -1 || e.indexOf('交易专用钥匙')!= -1)\n\t\t\treturn;\n\t\trst = rst + '\\n' + e;\n\t}\n}\n\nfunction _start(){\n\tif(run)\n\t\tamsCJ();\n\telse\n\t\talert = print;\n}\n\nfunction start(){\n\tprint2 = alert;\n\talert = showmsg;\n\trun = true;\n\tsetInterval(_start, 233);\n}";
    var script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.appendChild(document.createTextNode(text));
    document.getElementsByTagName('head')[0].appendChild(script2);
    console.log("--------------------START--------------------\n");
    console.log("%c解除掌上道聚城限制", 'color: #43bb88;font-size: 24px;font-weight: bold;text-decoration: underline;');
    console.log("版本:  V1.1.0");
    console.log("使用帮助:");
    console.log("1. 直接购买后, 即可点击领取道聚城额外钥匙");
    console.log("2. 购买好钥匙, 在控制台输入\"start()\"并按下回车键即可快速抽奖");
    console.log("---------------------END---------------------\n");
    // Your code here...
})();