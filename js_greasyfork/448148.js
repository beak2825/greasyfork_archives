// ==UserScript==
// @name         fanyi自动
// @license      MIT
// @version      0.2
// @description  fanyi
// @author       liuzihaohao
// @match        https://fanyi.baidu.com/
// @grant        none
// @namespace https://greasyfork.org/users/937290
// @downloadURL https://update.greasyfork.org/scripts/448148/fanyi%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/448148/fanyi%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
$('document').ready(function(){setTimeout(function () {
    document.getElementsByClassName("strong")[0].onclick = function(){
        var a="";
        a+="<text><br/>";
        a+=document.getElementsByClassName("strong")[0].innerText;
        a+="<br/>";
        a+=document.getElementsByClassName("phonetic-transcription")[0].children[1].innerText;
        for(var i=0;i<document.getElementsByClassName("dictionary-comment")[0].childElementCount;i++){
            a+="<br/>";
            a+=document.getElementsByClassName("dictionary-comment")[0].children[i].children[0].innerText;
            a+=" ";
            a+=document.getElementsByClassName("dictionary-comment")[0].children[i].children[1].children[0].innerText;
        }
        a+="</text>";
        document.getElementById("transOtherRight").innerHTML+=a;
        const selection = window.getSelection();
        selection.removeAllRanges();
        const range = document.createRange();
        const node = document.getElementById("transOtherRight").children[document.getElementById("transOtherRight").childElementCount-1];
        range.selectNodeContents(node);
        selection.addRange(range);
        console.log(document.execCommand("Copy"));
    }
},2000)})
})();
