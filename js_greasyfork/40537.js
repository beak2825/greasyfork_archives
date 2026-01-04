// ==UserScript==
// @name         hairong-tapd
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tapd.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40537/hairong-tapd.user.js
// @updateURL https://update.greasyfork.org/scripts/40537/hairong-tapd.meta.js
// ==/UserScript==

jQuery(function(){
    let url = window.location.href;
    if(url === "https://www.tapd.cn/my_worktable/index/created"){
        created();
    }else if(url === "https://www.tapd.cn/my_worktable/index/done"){
        done();
    }else if(url === "https://www.tapd.cn/my_worktable/index/todo"){
        todo();
    }else if(url === "https://www.tapd.cn/my_worktable/?from=left_tree_cloud_v2"){
        my_create();
    }else if(url.indexOf("https://www.tapd.cn/letters/?from=top_nav_worktable_v2") !== -1){
        info();
    }else if(url === "https://www.tapd.cn/21934581/personal_documents/my_create/?from=left_tree_v2"){
        text();
    }else if(url === "https://www.tapd.cn/personal_settings/index?tab=dynamic"){
        my();
    }else if(url === "https://www.tapd.cn/21934581/personal_documents/my_cooperation"){
        my_cooperation();
    }
    else{
        project();
    }

    function public(){
        document.querySelectorAll(".left-tree-project-list")[0].style.right = "-300px";
        document.querySelectorAll(".left-tree-project-list")[0].style.width = "300px";
        for(let i = 0; i < document.querySelectorAll("#myprojects-list span").length;i++){
            document.querySelectorAll("#myprojects-list span")[i].style.overflow = "inherit";
        }
    }

    function created(){
        document.querySelectorAll(".section-work")[0].style.paddingLeft = "300px";
        public();
    }/*兼容我的创建*/

    function todo(){
        document.querySelectorAll("#worktable_iaction")[0].style.paddingLeft = "300px";
        document.querySelectorAll(".section-work")[0].style.paddingLeft = "300px";
        public();
    }/*兼容我的待办*/

    function done(){
        document.querySelectorAll(".section-work")[0].style.paddingLeft = "300px";
        document.querySelectorAll(".view-wrap")[0].style.paddingLeft = "300px";
        document.querySelectorAll("#worktable_iaction")[0].style.paddingLeft = "300px";
        public();
    }/*兼容我的已办*/

    function my_create(){
        document.querySelectorAll("#pege-content")[0].style.paddingLeft = "325px";
        document.querySelectorAll("#operate-bar-personal")[0].style.paddingLeft = "325px";
        public();
    }/*兼容我的创建*/

    function info(){
        document.querySelectorAll("#page-content")[0].style.paddingLeft = "300px";
        public();
    }/*兼容消息中心*/

    function text(){
        document.querySelectorAll("#page-content-inner")[0].style.paddingLeft = "300px";
        document.querySelectorAll("#operate-bar-personal")[0].style.paddingLeft = "300px";
        public();
    }/*兼容个人文档*/

    function project(){
        document.querySelectorAll(".project-nav")[0].style.paddingLeft = "300px";
        document.querySelectorAll(".frame-main ")[0].style.paddingLeft = "300px";
        public();
    }/*兼容项目明细*/

    function my(){
        document.querySelectorAll("#page-content")[0].style.paddingLeft = "300px";
        public();
    }/*兼容我的动态*/

    function my_cooperation(){
        document.querySelectorAll('#operate-bar-personal')[0].style.paddingLeft = "300px";
        document.querySelectorAll('#file-list')[0].style.paddingLeft = "300px";
        public();
    }
    // Your code here...
});