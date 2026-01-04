// ==UserScript==
// @name         掌阅在线看书宽屏样式
// @description   这是一个把页面调整成宽屏样式的脚本，理论上适用于大多数屏幕。
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Keung Tan
// @match        https://www.ireader.com.cn/index.php?ca=Chapter.Index&pca=Chapter.Index&bid=*&cid=*
// @icon         https://www.ireader.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430054/%E6%8E%8C%E9%98%85%E5%9C%A8%E7%BA%BF%E7%9C%8B%E4%B9%A6%E5%AE%BD%E5%B1%8F%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/430054/%E6%8E%8C%E9%98%85%E5%9C%A8%E7%BA%BF%E7%9C%8B%E4%B9%A6%E5%AE%BD%E5%B1%8F%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 动态添加样式
    var style = document.createElement("style");
    style.type = "text/css";
    var stylesheet = ".content{width: 100%} .article{width: 100%} #iframe_chapter{width: 95%;/*margin-top: -28%;*/} .conRightTop{display: none} .fixed{width: 100%;left: 0;margin-left: 0;position: unset;} .header{margin: 0 auto;height: unset;} .listLeft{left: 0;} .header .headLeft{padding-top: 0} .chapter{left: unset; right: 1rem}";
    try{
        style.appendChild(document.createTextNode(stylesheet));
    }catch(ex){
        //针对IE
        style.styleSheet.cssText = stylesheet;
    }
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);

    var node = document.createElement("a");
    node.style = "position: fixed; top: 0px; right: 20px;";
    node.innerText = "新窗口阅读";
    node.id = "btnNewTab";
    node.onclick = function(){
        window.open(document.getElementById("iframe_chapter").attributes.src.value);
    }
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(node);
})();