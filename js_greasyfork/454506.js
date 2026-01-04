// ==UserScript==
// @name         刷课插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自用学习测试
// @author       yangc
// @match        http://snce.xidian.edu.cn/learning/loginController.do?login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454506/%E5%88%B7%E8%AF%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/454506/%E5%88%B7%E8%AF%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

    var user=123;
    var pass='';
    //当前页面路由
    var rout="login";
    let isplay=false;


  function playVideo(){
            if(rout=='main'){
          //      console.log("是否开启"+isplay);
        //        if(!isplay){
        //            const iframe = document.querySelector('iframe');
           //         console.log(iframe)
           //         console.log("脚本启动！")
            //        let video = iframe.querySelector("#pybt")
             //       console.log(iframe.querySelector("#content-main"));
            //        console.log(video)
            //        if(video){
              //          isplay=true;
              //          let arrlist=iframe.getElementsByClassName("mejs-time mejs-duration-container")
            //            console.log(arrlist)
               //     }
           // }
          //获得菜单栏
                var sideMenu=document.querySelector("#side-menu");
                //点击第一个标签页
                sideMenu.children[1].children[0].click();
                //点击子标签页
                sideMenu.children[1].children[1].children[0].children[0].click()
                //获得操作栏
                 setTimeout(function(){
                  var editRowDoc=document.querySelector("#content-main").children[2].contentWindow.document;
                  //展示列表页面
                  editRowDoc.querySelector("#datagrid-row-r1-2-0").children[15].children[0].children[0].click();
                  //
                     setTimeout(function(){
                         console.log(editRowDoc)
                       var listNode=editRowDoc.querySelectorAll(".datagrid-view")[1];
                       var tableNode=listNode.querySelector(".datagrid-view2").querySelector(".datagrid-body").children[0].children[0].children;
                       for(let a=0;a<tableNode.length;a++){
                         let node=tableNode[a];
                         if(node.children[10].children[0].innerHTML!="已学"){
                          console.log("开始学习："+node)
                          node.children[18].children[0].children[0].click();
                          setTimeout(function(){
                              location.reload();
                          },2700000)
                          return;
                         }
                       }
                       //遍历列表
                     },2000);
                 }, 5000 )
            }else{
            //关闭登录页面
            }
  }

function login(){

     var userName=document.getElementsByName("userName")[0];
     var password=document.getElementsByName("password")[0];
      if(userName&&password){
          userName.value=user;
          password.value=pass;
          var loginBnt=document.querySelector("#but_login");
          loginBnt.click();
       }
      if(rout=='login'){
          rout="main";
          setTimeout(playVideo, 5000 )
      }
 }

(function() {
    'use strict';
     //登录方法

     login();

     // Your code here...
})();