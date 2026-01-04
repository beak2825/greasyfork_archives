// ==UserScript==
// @name         quizii组卷查重工具——修改习题
// @namespace    http://jz.quizii.com/
// @version      0.2.5
// @description  选中习题，点击修改习题按钮，跳转到习题编辑页面
// @author       JinJunwei
// @match        http://jz.quizii.com/math/exams/new/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389977/quizii%E7%BB%84%E5%8D%B7%E6%9F%A5%E9%87%8D%E5%B7%A5%E5%85%B7%E2%80%94%E2%80%94%E4%BF%AE%E6%94%B9%E4%B9%A0%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/389977/quizii%E7%BB%84%E5%8D%B7%E6%9F%A5%E9%87%8D%E5%B7%A5%E5%85%B7%E2%80%94%E2%80%94%E4%BF%AE%E6%94%B9%E4%B9%A0%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setCss();

    // 收藏和试卷页面
    MathJax.Hub.Queue(insertAll);

    // 知识点和章节页面，需要先点击tree_panel
    const tree = document.querySelector("#tree_panel");
    if(tree){
        tree.onclick=()=>setTimeout(()=>MathJax.Hub.Queue(insertAll),1000);
    }
    // 搜索按钮
    const query_btn = document.querySelector("#query_btn");
    if(query_btn){
        query_btn.onclick=()=>setTimeout(()=>MathJax.Hub.Queue(insertAll),1000);
    }
    // 过滤条件
    const qs_filter_tb = document.querySelector("#sub_page_bd > div.right_panel > div.qs_filter_tb");
    if(qs_filter_tb){
        qs_filter_tb.onclick=()=>setTimeout(()=>MathJax.Hub.Queue(insertAll),1000);
    }

    function insertAll(){
        console.log("开始插入‘修改习题按钮’")
        document.querySelectorAll("div.operate_area").forEach(parentElement=>{
            if (parentElement.querySelector(".insert_like_show_info")){ return;}
            parentElement.appendChild(createMenu2(parentElement.previousElementSibling.id));
            parentElement.appendChild(createMenu());
        });
        // 换页
        const page = document.querySelector("div.table_page");
        if(page){
            page.onclick=()=>setTimeout(()=>MathJax.Hub.Queue(insertAll),1000);
        }
    }
    // 打开修改习题页面
    function createMenu(){
        let newElement = document.createElement('div');
        newElement.innerHTML = '<div class="insert_like_show_info" title="油猴脚本，打开修改习题页面" >修改习题</div>';
        newElement = newElement.firstChild
        // 功能脚本
        newElement.onclick = function(){
            const qId = newElement.parentElement.previousElementSibling.id;
            // 需要考虑习题被聚类的情况，不能直接打开习题修改页面
            // const url = "http://121.42.229.71:8200/item/"+qId+"/typesetting";
            const url = "http://121.42.229.71:8200/items/search?id="+qId;
            openInNewTab(url);
        };
        return newElement;
    }
    function createMenu2(id){
        let newElement = document.createElement('div');
        newElement.innerHTML = '<div class="insert_like_show_info" title="油猴脚本，显示习题id" >'+id+'</div>';
        newElement = newElement.firstChild
        // 功能脚本
        newElement.onclick = function(){
            const qItem = newElement.parentElement.previousElementSibling;
            const qId = qItem.id;
            const sub_qs_count = qItem.querySelectorAll("subq").length;
            localStorage.setItem(qId, sub_qs_count); // 用于按id换题
            console.log("localStorage保存了",qId, sub_qs_count);
        };
        return newElement;
    }

    function setCss(){
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
.insert_like_show_info{
    color: #599d41;
    float: right;
    margin-left: 10px;
    display: inline-block;
    cursor: pointer;
}`;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function setPosition(referenceElement, newElement){
        newElement.style.top = referenceElement.offsetTop+ referenceElement.offsetHeight+"px";
    }

    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }


})();