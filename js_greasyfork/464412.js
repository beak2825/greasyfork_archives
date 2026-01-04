// ==UserScript==
// @name         知网编辑模式-复制限制解除
// @namespace    none
// @version      1.23
// @description  将知网网页设置为可编辑模式，可选择后进行Ctrl+C复制
// @match        *://*.cnki.net*/*/Detail*
// @match        *://*/rwt/CNKI/https/*/KXReader/Detail*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464412/%E7%9F%A5%E7%BD%91%E7%BC%96%E8%BE%91%E6%A8%A1%E5%BC%8F-%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/464412/%E7%9F%A5%E7%BD%91%E7%BC%96%E8%BE%91%E6%A8%A1%E5%BC%8F-%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.contentEditable = true;
})();

(function() {
    'use strict';

    var selectText = "";
    document.body.onkeydown=function(e){
        if(e.ctrlKey && e.keyCode == 67) {
            copy();
            return false;
        }
    };
    document.body.onmouseup = function(e){
        getSelectText();
    }
    var copytext = document.getElementById("copytext");
    var parent = document.getElementsByClassName("inner")[0];
    if(copytext!== null) parent.removeChild(copytext);

    var proxyBtn = document.createElement("A");

    parent.insertBefore(proxyBtn,parent.children[0]);

    proxyBtn.setAttribute("id","proxy");
    proxyBtn.innerHTML="复制";
    document.getElementById("proxy").onclick = function(e){
        if(document.getElementById("aukoToProxy")){
            document.getElementById("aukoToProxy").value = selectText;
            document.getElementById("aukoToProxy").select();
        }else{
            var temp = document.createElement('input');
            temp.value = selectText;
            temp.setAttribute("id","aukoToProxy");
            document.body.appendChild(temp);
            temp.select();
            temp.style.opacity='0';
        }
        copy();
    }

    function getSelectText() {
        if(document.selection) {
            if(document.selection.createRange().text && document.selection.createRange().text !== ''){
                selectText = document.selection.createRange().text;
            }
        } else {
            if(document.getSelection()&& document.getSelection().toString() !== ''){
                selectText = document.getSelection().toString();
            }
        }
    }

    function copy(){
        try{
            if(document.execCommand("Copy","false",null)){
                console.log("复制成功！");
            }else{
                console.warn("复制失败！");
            }
        }catch(err){
            console.warn("复制错误！")
        }
        return false;
    }
})();