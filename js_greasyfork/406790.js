// ==UserScript==
// @name         文字数チェック
// @namespace    https://fazerog02.github.io
// @version      0.1
// @description  選択した文字列の文字数を表示
// @author       fazerog02
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406790/%E6%96%87%E5%AD%97%E6%95%B0%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/406790/%E6%96%87%E5%AD%97%E6%95%B0%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(function() {
    let counter = document.createElement("p");
    counter.id = "__counter";
    counter.style.position = "fixed";
    counter.style.bottom = "0";
    counter.style.left = "0";
    counter.innerText = "0文字";
    counter.style.margin = "0 0 0 0";
    counter.style.zIndex = "1145141919810";
    counter.style.fontSize = "150%";
    counter.style.fontWeight = "900";
    counter.style.opacity = "0.6";
    document.body.appendChild(counter);
    document.onmouseup = (() => {
        let counter = document.getElementById("__counter");
        let num_of_char = window.getSelection().toString();
        counter.innerText = num_of_char.length + "文字";
        console.log(num_of_char.length);
    });
})();