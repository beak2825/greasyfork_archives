// ==UserScript==

// @name               Stackoverflow Add Button For Copy to clipboard
// @name:zh-TW         Stackoverflow 增加複製按鈕
// @name:zh-CN         Stackoverflow 添加复制按钮
// @name:ja            Stackoverflow はコピーボタンを追加します
// @namespace          https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @description        Stackoverflow add button for copy to clipboard.
// @description:zh-TW  Stackoverflow 增加複製按鈕以複製原始碼到剪貼簿。
// @description:zh-CN  Stackoverflow 添加复制按钮以复制原始码到剪贴簿。
// @description:ja     ソースコードをクリップボードにコピーするためのコピーボタンをStackoverflowに追加しました。
// @copyright          2022, HrJasn (https://greasyfork.org/zh-TW/users/142344-jasn-hr)
// @license            GPL3
// @license            Copyright HrJasn
// @version            1.7
// @icon               https://www.google.com/s2/favicons?domain=stackoverflow.com
// @match              /^http[s]?://stackoverflow\.com/questions/[0-9]+/.*/
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/438065/Stackoverflow%20Add%20Button%20For%20Copy%20to%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/438065/Stackoverflow%20Add%20Button%20For%20Copy%20to%20clipboard.meta.js
// ==/UserScript==

(() => {
    window.addEventListener('load',() => {
        const precodeObjs = document.querySelectorAll('pre code');
        const scrollbarChange = function(){
            let copyBtn = this.querySelector('input[value="Copy"]');
            copyBtn.style.right = (5-this.scrollLeft) + 'px';
            copyBtn.style.bottom = (5-this.scrollTop) + 'px';
        };
        precodeObjs.forEach(function(precodeObj){
            let copyBtn = document.createElement('input');
            copyBtn.type='button';
            copyBtn.value='Copy';
            copyBtn.style='cursor:pointer;opacity:0;position:absolute;right:5px;bottom:5px;font-size:15px;padding:10px;background-color:#888888;border:0px;border-style:solid;color: #ffffff;text-shadow: 0px 0px 2px #ffffff;border-radius:5px;';
            precodeObj.parentNode.style.position = 'relative';
            precodeObj.parentNode.appendChild(copyBtn);
            precodeObj.parentNode.addEventListener("wheel",scrollbarChange,false);
            precodeObj.parentNode.addEventListener("scroll",scrollbarChange,false);
            precodeObj.parentNode.addEventListener("keydown",scrollbarChange,false);
            copyBtn.addEventListener('click', function(){
                let targetObj = this.parentNode;
                let srcText = targetObj.textContent || targetObj.innerText || targetObj.nodeValue || '';
                navigator.clipboard.writeText(srcText);
                //let clipText = navigator.clipboard.readText();
                console.log(srcText);
                if(srcText !== undefined){
                    this.value='Copied';
                };
            });
            copyBtn.addEventListener('mouseenter', function(){
                this.style.opacity = 1;
            });
            copyBtn.addEventListener('mouseleave', function(){
                this.style.opacity = 0;
            });
        });
    });
})();