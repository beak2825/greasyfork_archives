// ==UserScript==
// @icon          https://v.qq.com/favicon.ico
// @name        腾讯视频动漫源码视频链接解析
// @namespace       http://www.lxzy.ml
// @supportURL      http://www.lxzy.ml/?p=453
// @match       https://v.qq.com/x/page/*
// @match       https://v.qq.com/x/cover/*
// @version     2.0
// @author      银河以北吾彦最美
// @description 免登录免VIP解析腾讯视频的源码链接（部分不适用）
// @license         GPL-3.0-only
// @note      2021.07.11 v1.0 一键式解析腾讯视频的源码播放链接
// @note      2021.07.12 v1.1 UI设计调整，同时增加点击播放器右侧标题进入剧集详情页的功能
// @note      2021.07.19 v1.2 功能微调，弹出的输入框在用户点击“确认”时会自动跳转到web播放器播放解析到的源码视频
// @note      2021.07.22 v1.3 增加对url为https://v.qq.com/x/page/*的页面的解析支持
// @note      2021.07.23 v1.5 完善判断视频是否可以解析的逻辑bug
// @note      2021.07.27 v1.6 没有功能更新，最后注释添加了wetv部分非vip视频的解析方案
// @note      2021.08.05 v1.7 删除对剧集/电影类源码链接的解析（已失效），目前仅对page页面的视频可以提取源码链接
// @note      2022.02.27 v2.0 恢复对剧集/电影类源码链接的解析（仅部分可用）
// @grant        GM_xmlhttpRequest
// @connect     vv.video.qq.com
// @downloadURL https://update.greasyfork.org/scripts/440669/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%8A%A8%E6%BC%AB%E6%BA%90%E7%A0%81%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/440669/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%8A%A8%E6%BC%AB%E6%BA%90%E7%A0%81%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
 
//源码视频链接获取
let download = document.createElement("button");
download.innerHTML='<div style="border:2px solid rgb(204,204,204);background-color:rgb(43,137,234);height:40px;width:40px;border-radius:50%;line-height:40px;text-align:center;position:fixed;top:80px;left:20px;">解析</div>';
download.onclick=function(){
  var url = window.location.href;
  var keywords = url.split("/");
  if(keywords[4]=='page'){
    var vids = keywords[5].split(".");
  }else{
    var vids = keywords[6].split(".");
  }
  var api = "https://vv.video.qq.com/getinfo?vids="+vids[0]+"&platform=101001&charge=0&defn=fhd&otype=ojson";
  var title = document.title;
  var fn = "";
  var fvkey = "";
  $.ajaxSetup({async:false});
  $.getJSON(api,function(data){
    fn = data.vl.vi[0].fn;
    fns = fn.split(".");
    fvkey = data.vl.vi[0].fvkey;
    if(fns[1].substr(0,1)!="f"||vids==''){
      alert("解析失败！无效链接！")
    }
    else{
      /* function getRandom(min,max){
        return Math.floor((max-min)*Math.random()+min);
      } 
      var rand = getRandom(0,65536); */
      output = "http://ltsjdy.qq.com/"+fns[0]+".f0.mp4?vkey=86186933FB9535F400EA8235E8C23E571EB25DEBAA03829E6E153B360FA0EB697C3EB6830979ADB0275DD4A852733BDA1476CDB1C2EF940A7507FC5D2A994242842369E5CA1C142D3979C9976DBEB56D154CCB06809211D37C0CFC9CEEC0732826196240D4978DEC6595EE83B34E52223AE05416A5A21241";
      var choice = prompt(title,output);
      if(choice){
        //location.href = "https://player.lxzy.ml/player/?url="+output;
        location.href = output;
      }
    }
  });
}
let title = document.querySelector('.video_title._video_title');
title.parentElement.insertBefore(download,title);
//播放器标题处生成视频详情页链接
var player_title = document.querySelectorAll(".player_title a")[0];
var url = window.location.href;
var keywords = url.split("/");
var titleUrl = "https://v.qq.com/detail/t/"+keywords[5]+".html";
player_title.href = titleUrl;
 
//关于wetv部分非vip视频的ym解析：对于文件名f0系列的视频拼法相同，对于vid和fn相同的文件，拼接格式为 http://ltsyd.qq.com/[vid].p5.mp4 自己拼吧，懒得写脚本了（一些规则还没有完全摸索清，以及访问此域名经常莫名其妙503）