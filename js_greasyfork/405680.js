// ==UserScript==
// @name         fuulea-打标签
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.fuulea.com/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405680/fuulea-%E6%89%93%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/405680/fuulea-%E6%89%93%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 章节目录
    setTimeout(set_onclick_chapter,1000)
    function set_onclick_chapter(){
        // 章 目录
        const chapters = document.querySelectorAll("body > fl-root > fl-base-lay-out > nz-layout > nz-layout > nz-content > fl-course-detail > div > div > div.ant-col > nz-card > div.ant-card-body > nz-spin > div > nz-tree > ul > nz-tree-node.ng-star-inserted > li > span.tree-node.ng-star-inserted");
        chapters.forEach(el=>el.onclick=el.previousElementSibling.onclick=function(e){
            setTimeout(set_onclick_edit,1000);
            setTimeout(set_onclick_subchapter,300);
        });
        // 背景颜色标记
        chapters.forEach(el=>el.style.backgroundColor="#ddd");
        console.log("找到了"+chapters.length +"个 章 目录")
    }
    function set_onclick_subchapter(){
        // 节目录
        const chapters = document.querySelectorAll("body > fl-root > fl-base-lay-out > nz-layout > nz-layout > nz-content > fl-course-detail > div > div > div.ant-col.ant-col-5 > nz-card > div.ant-card-body > nz-spin > div > nz-tree > ul > nz-tree-node.ng-star-inserted > li > ul > nz-tree-node.ng-star-inserted > li > span.tree-node.ng-star-inserted > span");
        chapters.forEach(el=>el.onclick=function(e){
            setTimeout(set_onclick_edit,1000);
        });
        // 背景颜色标记
        chapters.forEach(el=>el.style.backgroundColor="#ddd");
        console.log("找到了"+chapters.length +"个 节 目录")
    }

    // 延时设置 编辑章节内容 按钮的onclick
    setTimeout(set_onclick_edit,1000)
    function set_onclick_edit(){
        // 编辑章节内容 按钮
        const btn = document.querySelector("body > fl-root > fl-base-lay-out > nz-layout > nz-layout > nz-content > fl-course-detail > div > div > div.ant-col.ant-col-19 > nz-content > fl-chapter-detail > fl-chapter-analysis-tab > nz-page-header > div > nz-page-header-extra > div > button.mr-md.ant-btn.ng-star-inserted.ant-btn-default")
        // 延时设置 关联图谱 按钮 的onclick
        if(btn){
            btn.onclick=function(e){setTimeout(set_onclick_gltp,1000)};
            btn.style.backgroundColor="#ddd";
            console.log("找到了 1 个 节 编辑章节内容 按钮")
        }else{
            setTimeout(set_onclick_gltp,1000);
        }

    }

    function set_onclick_gltp(){
        // 关联图谱 按钮
        const btns = document.querySelectorAll("body > fl-root > fl-base-lay-out > nz-layout > nz-layout > nz-content > fl-course-detail > div > div > div.ant-col.ant-col-19 > nz-content > fl-edit-module-info > nz-card > div.ant-card-body > nz-spin > div > div > div > fl-exercise-module > nz-spin > div > div.card_content.p-sm > div > fl-question > nz-card > div.ant-card-head.ng-star-inserted > div > div.ant-card-extra.ng-star-inserted > span.ml-md.point.mr-md.ng-star-inserted")
        console.log("找到了"+btns.length +"个 关联图谱 按钮")
        // 延时设置下级 知识点 开关 的onclick
        btns.forEach(btn=>btn.onclick=function(e){
                setTimeout(set_onclick_modal,200)
                // 自动选择 知识点
                const selectors = JSON.parse(localStorage.getItem("selectors"));
                setTimeout(()=>auto_select(selectors),200);
        });
        // 背景颜色标记
        btns.forEach(el=>el.style.backgroundColor="#ddd");
    }

    function set_onclick_modal(){
        // 知识点 checkbox
        const checkboxs = document.querySelectorAll("div.ant-modal-body .ant-tree-checkbox-inner")
        console.log("找到了"+checkboxs.length +"个 知识点 选择框")
        checkboxs.forEach(el=>el.onclick=onclick_checkbox);
        // 下级知识点 开关
        const switers = document.querySelectorAll("div.ant-modal-body .ant-tree-switcher_close")
        console.log("找到了"+switers.length +"个 下级知识点 开关")
        // 延时设置 新checkbox 的onclick
        switers.forEach(el=>el.onclick=function(e){setTimeout(set_onclick_modal,300)});
    }

    function onclick_checkbox(e){
        console.log("点击了知识点选择框");
        const checkbox = e.target.parentElement
        let switer = e.target.parentElement.previousElementSibling
        const selectors = [modalPath(checkbox)]
        while( switer = get_parent_switer(switer)){
            selectors.unshift(modalPath(switer));
        }
        localStorage.setItem("selectors",JSON.stringify(selectors));
        console.log("保存了"+selectors.length +"个selector")
    }

    function auto_select(selectors){
        if(!selectors || selectors.length==0){
            return;
        }else if(selectors.length==1){
            set_onclick_modal();
        }

        const s =selectors.shift();
        const el = document.querySelector(s)
        el.click();
        setTimeout(()=>auto_select(selectors),300);
    }
    function get_parent_switer(switer){
        try {
            switer = switer.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling
        }
        catch(err) {
            return null;
        }

        if (switer.classList.contains("ant-tree-switcher")){
            return switer;
        }else{
            return null
        }
    }

    function modalPath(el){
        const names = [];
        while (el.parentNode){
            if(el.classList.contains("ant-modal-content")){
                names.unshift("div.ant-modal-content");
                break;
            }
            if (el.id){
                names.unshift('#'+el.id);
                break;
            }else{
                if (el==el.ownerDocument.documentElement) names.unshift(el.tagName);
                else{
                    for (var c=1,e=el;e.previousElementSibling;e=e.previousElementSibling,c++);
                    names.unshift(el.tagName+":nth-child("+c+")");
                }
                el=el.parentNode;
            }
        }
        return names.join(" > ");
    }

})();