// ==UserScript==
// @license      MIT
// @name         ahk中文社区代码块一键复制
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  为ahk中文网代码块添加一键复制功能, 并修复复制选中区时无法复制空行的问题.
// @author       Tebayaki
// @match        https://www.autoahk.com/archives/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/446010/ahk%E4%B8%AD%E6%96%87%E7%A4%BE%E5%8C%BA%E4%BB%A3%E7%A0%81%E5%9D%97%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/446010/ahk%E4%B8%AD%E6%96%87%E7%A4%BE%E5%8C%BA%E4%BB%A3%E7%A0%81%E5%9D%97%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    var codeBlocks = document.getElementsByClassName("prettyprint linenums prettyprinted");
    for (var i = 0; i < codeBlocks.length; i++) {
        var codeBlock = codeBlocks[i]
        var bar = document.createElement("div");
        bar.style = "border-radius: 4px; margin-bottom: 0px; background-color: #404040;";
        var btn = document.createElement("button");
        btn.innerHTML = "复制";
        btn.style = "border-radius: 3px; padding: 5px; width: 40px; background-color: #3a61f1; border: 0px";
        btn.codeBlock = codeBlock;
        btn.onclick = function(evt) {
            var obj = evt.path[0]
            navigator.clipboard.writeText(obj.codeBlock.innerText.replace(/\n\n/g, "\n"))
                .then(function(){
                obj.innerText = " ✔ "
                obj.style.backgroundColor = "#c674d2"
                setTimeout(function(){obj.innerText = "复制"; obj.style.backgroundColor = "#3a61f1"}, 2000);
            });
        }

        bar.appendChild(btn);
        codeBlock.parentElement.insertBefore(bar, codeBlock);
        var lis = codeBlock.getElementsByTagName("code");
        for (var ii = 0, len = lis.length; ii < len; ii++){
            if (lis[ii].innerText === ""){
                lis[ii].innerText = "\n";
            }
        }
    }
})();