// ==UserScript==
// @name              bookget
// @author            songshu
// @description       某些学校分享电子书，提取图片进行打印。
// @version           2022.12.31.10
// @include           *://book.yunzhan365.com/mmdh/*
// @include           *://book.yunzhan365.com/*
// @include           *://www.yunzhan365.com/*
// @include           *://bp.pep.com.cn/ebook/*
// @run-at            document-end
// @namespace         https://greasyfork.org/zh-CN/users/songshu
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/396406/bookget.user.js
// @updateURL https://update.greasyfork.org/scripts/396406/bookget.meta.js
// ==/UserScript==
(function () {
  'use strict';
  //alert("欢迎使用图片提取插件");
  //添加图片一键提取
setTimeout(clock, 2000);

  function clock(){
  getbook("bookContainer");
  document.getElementById('bookContainer').addEventListener('click', showjpg, false); //默认自动加载;
  }

  function getbook(divID) {//bookContainer getbook("bookContainer");
  var modmenut,
  AnYigetjpg;
  modmenut = document.getElementById(divID);
  if (modmenut) {

    AnYigetjpg = document.createElement('div');
    AnYigetjpg.setAttribute('id','begbut');
    AnYigetjpg.innerHTML = '<div  style="z-index:99999;margin-top: 2px;left:70px;right:auto ; position: fixed;bottom: 100px;background:#28c0c6;border:1px #cdcdcd solid; ">  <button id="getjpg"  name="getjpg" ><span style="font-size: 22px;margin:3px;">获得图片</span></button></div>';
    modmenut.insertBefore(AnYigetjpg, modmenut.firstchild);
    //modmenut.innerHTML = AnYigetjpg.innerHTML;
     }
  }

  function showjpg(){//显示已获取的图片地址
    var i;//初始页
    var page;//初始页
    var phtml;//图片地址。
    i = getbeginID();
    page="page"+i;

    phtml="";
    while(ifdivid(page)){
      var jpgurl=gethref(page);
      if(jpgurl){
       phtml=phtml+ "<a target=\"_blank\" href='"+jpgurl+"'>"+page+"</a>";
      }
      i=Number(i)+1;
      page="page"+i;
    }

    var showjpgdiv;
    showjpgdiv = document.getElementById("showjpgid");
    if(showjpgdiv){
      var showjpgdivnxt=showjpgdiv.getElementsByTagName("div");
       showjpgdivnxt[0].innerHTML = phtml;
       }
    else {
      showjpgdiv= document.createElement('div');
      showjpgdiv.setAttribute('id','showjpgid');
      showjpgdiv.innerHTML = '<div style="z-index:1005;margin-top: 2px;left:70px;right:auto ; position: fixed;bottom: 150px;background:#28c0c6;border:1px #cdcdcd solid; ">'+phtml+'</div>';
    }
    var getjpgdiv = document.getElementById("bookContainer");
    getjpgdiv.insertBefore(showjpgdiv,getjpgdiv.firstchild);

  }

  function getbeginID(){//判断是否存在该id
    var path=1;
    var i=0;
    var domi;
    if(ifdivid("bookContainer")>0){
      domi = document.getElementById("bookContainer");
      var domibook =domi.getElementsByClassName("book");//book
      if(domibook){
        var dividpage=domibook[3].getElementsByClassName("down-single-mask-side");//选用第二个book里的内容。
        var divpageMask=dividpage[i];
        while(!divpageMask.id){
         i=i+1;
         divpageMask=dividpage[i];
        }
        path=divpageMask.id;
        path = path.substring(8,path.length); //文件名称去掉路径和后缀名
        return path;
      }
      else return 1;
    }
    else return 1;
  }


  function ifdivid(divID){//判断是否存在该id
    var domi;
    domi = document.getElementById(divID);
    if(domi){
      return 1;
    }
    else return 0;
  }

  function gethref(page){
    var imgurl="";
    var jpgdiv= document.getElementById(page).getElementsByTagName("div");
    var jpgget= jpgdiv[0].getElementsByTagName("img");
    if(jpgget[0].src){
     imgurl=jpgget[0].src;
     imgurl=imgurl.substring(0, imgurl.indexOf("?"));
      return imgurl;
    }
    else return "";
  }

}) ();