// ==UserScript==
// @name         解除知网复制限制CNKI copy !!
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Lifting copy restrictions on CNKI online reading
// @description:zh-CN  解除知网在线阅读时复制限制
// @author       auko
// @supportURL   https://github.com/aukocharlie/my-script
// @match        *://*.cnki.net*/*/Detail*
// @match        *://*/rwt/CNKI/https/*/KXReader/Detail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393843/%E8%A7%A3%E9%99%A4%E7%9F%A5%E7%BD%91%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6CNKI%20copy%20%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/393843/%E8%A7%A3%E9%99%A4%E7%9F%A5%E7%BD%91%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6CNKI%20copy%20%21%21.meta.js
// ==/UserScript==

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