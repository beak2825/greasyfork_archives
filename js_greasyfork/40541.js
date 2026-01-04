// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tapd.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40541/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/40541/New%20Userscript.meta.js
// ==/UserScript==

(function() {
   let url = window.location.href;
if(url === "https://www.tapd.cn/my_worktable/index/created" || url === "https://www.tapd.cn/my_worktable/?from=left_tree_cloud_v2"){
    console.log(1);
    created();
}else if(url === "https://www.tapd.cn/my_worktable/index/done"){
    console.log(2);
    done();
}else if(url === "https://www.tapd.cn/my_worktable/index/todo" || url === "https://www.tapd.cn/my_worktable/?from=left_tree_cloud_v2"){
    console.log(3);
    todo();
}else if(url === "https://www.tapd.cn/my_worktable/?from=left_tree_cloud_v2"){
    console.log(4);
    my_create();
}else if(url.indexOf("https://www.tapd.cn/letters/?from=top_nav_worktable_v2") !== -1){
    console.log(5);
    info();
}else if(url === "https://www.tapd.cn/21934581/personal_documents/my_create/?from=left_tree_v2"){
    console.log(6);
    text();
}else if(url === "https://www.tapd.cn/personal_settings/index?tab=dynamic"){
    console.log(7);
    my();
}else if(url === "https://www.tapd.cn/21934581/personal_documents/my_cooperation"){
    console.log(8);
    my_cooperation();
}
else{
    console.log(9);
    project();
}

function public(){
    document.querySelectorAll(".left-tree-project-list")[0].style.right = "-300px";
    document.querySelectorAll(".left-tree-project-list")[0].style.width = "300px";
      setTimeout(function(){
      $('.project-name').css("overflow","inherit");
       $('.project-name').css("word-wrap ","break-word");
         $('.project-name').css("white-space"," initial");
      }, 1000);
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
    document.querySelectorAll("#page-content")[0].style.paddingLeft = "300px";
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
})();