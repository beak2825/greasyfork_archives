// ==UserScript==
// @name        点击示例，直接复制代码 - mockjs.com
// @namespace   Violentmonkey Scripts
// @match       http://mockjs.com/examples.html
// @grant       none
// @version     1.0
// @author      he.wei@email.cn
// @description 2023/3/23 17:16:58
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462389/%E7%82%B9%E5%87%BB%E7%A4%BA%E4%BE%8B%EF%BC%8C%E7%9B%B4%E6%8E%A5%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%20-%20mockjscom.user.js
// @updateURL https://update.greasyfork.org/scripts/462389/%E7%82%B9%E5%87%BB%E7%A4%BA%E4%BE%8B%EF%BC%8C%E7%9B%B4%E6%8E%A5%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%20-%20mockjscom.meta.js
// ==/UserScript==


const copyBox = document.createElement("div");
copyBox.id = "copy-box";
document.body.appendChild(copyBox);

document.querySelectorAll(".hljs-string").forEach(dom=>{
    dom.style = "cursor:pointer;"
    console.log(dom.innerText);
    dom.onclick = function(e){
        const input = document.createElement("input");
        copyBox.appendChild(input);
        input.value = e.target.innerText;
        input.select();
        document.execCommand("copy");
        copyBox.innerHTML = "";
    }
});

