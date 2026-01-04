// ==UserScript==
// @name         简书阅读增强脚本
// @namespace    https://github.com/pcy190/TamperMonkeyScript
// @version      1.2
// @description  生成简书侧边栏目录、去除侧边广告、滚动隐藏顶部导航栏
// @author       HAPPY
// @match        http://www.jianshu.com/p/*
// @match        https://www.jianshu.com/p/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/388438/%E7%AE%80%E4%B9%A6%E9%98%85%E8%AF%BB%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/388438/%E7%AE%80%E4%B9%A6%E9%98%85%E8%AF%BB%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
var menuIndex = 0; //初始化标题索引

// 在侧边栏中添加目录项
function appendMenuItem(tagName,id,content){
    console.log(tagName+" "+tagName.substring(1));
    let paddingLeft = tagName.substring(1) * 10; //添加标题缩进  tagName.substring(1) * 30
    $('#menu_nav_ol').append('<li class="' + id +'" style="padding-left: '+ paddingLeft +'px;cursor:pointer;transform:translate(0,-10px);"><b>' + content + '</b></li>');
}

(function() {
    'use strict';
    //去除广告#fixed-ad-container
    document.getElementById("fixed-ad-container").style.display="none";
    // 使文章区域宽度适配屏幕
    let wider = $('.note').width() - 300;
    let oriWidth = $('.post').width();
    console.log(wider);
    console.log(oriWidth);
    if (wider < oriWidth){
       wider = oriWidth;
    }
    // 适配宽度
    $('.post').width(wider);

    // 保存标题元素
    let titles = $('body').find('h1,h2,h3,h4,h5,h6');
    if(titles.length === 0){
        return;
    }
    // 将文章内容右移
    $('.post').css('padding-left','150px');
    // 在 body 标签内部添加 aside 侧边栏,用于显示文档目录
    let contentHeight = window.innerHeight; //设置目录高度
    let asideContent = '<aside id="sideMenu" style="position: fixed;padding: 80px 15px 20px 15px;top: 0;left: 0;margin-bottom:20px;background-color: #eee;background-color: #eee;z-index: 810;overflow: scroll;max-height:'+contentHeight+'px;min-height:'+contentHeight+'px;min-width:100px;max-width:250px;"><h3>目录<h3></aside>';
    $('.show-content').prepend(asideContent);
    $('#sideMenu').append('<ol id="menu_nav_ol" style="list-style:none;margin:0px;padding:0px;">');// 不显示 li 项前面默认的点标志, 也不使用默认缩进

    // 遍历文章中的所有标题行, 按需添加id值, 并增加记录到目录列表中
    titles.each(function(){
          let tagName = $(this)[0].tagName.toLocaleLowerCase();
          let content = $(this).text();
          // 若标题的id不存在,则使用新id
          let newTagId =$(this).attr('id');
          if(!$(this).attr('id')){
              newTagId = 'id_'+menuIndex;
              $(this).attr('id',newTagId);
              menuIndex++;
          }
          if(newTagId !=='id_0') //忽略标题
              appendMenuItem(tagName,newTagId,content);
    });

    $('#sideMenu').append('</ol>');
    // 绑定目录li点击事件,点击时跳转到对应的位置
    $('#menu_nav_ol li').on('click',function(){
        let targetId = $(this).attr('class');
        $("#"+targetId)[0].scrollIntoView({
          behavior: "smooth",  //behavior: "auto" | "instant" | "smooth"
          block: "center",      //block: "start" | "center" | "end" | "nearest"
          inline: "nearest",   //inline: "start" | "center" | "end" | "nearest"
        });
    });
})();


var style = document.createElement('style');
style.id="__web-inspector-hide-shortcut-style__";
style.type = 'text/css';
style.innerHTML=".__web-inspector-hide-shortcut__, .__web-inspector-hide-shortcut__ *, \.__web-inspector-hidebefore-shortcut__::before, .__web-inspector-hideafter-shortcut__::after\
{\
    visibility: hidden !important;\
}";
document.getElementsByTagName('HEAD').item(0).appendChild(style);



let top_nav=document.evaluate("/html/body/nav", document).iterateNext();

let scrollFunc = function (e) {
        e = e || window.event;
        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) {
                top_nav.className="navbar navbar-default navbar-fixed-top";
            }
            if (e.wheelDelta < -100) { //当滑轮向下滚动时  < 0
                top_nav.className="navbar navbar-default navbar-fixed-top __web-inspector-hide-shortcut__";

            }
        } else if (e.detail) {  //Firefox滑轮事件
            if (e.detail> 0) { //当滑轮向上滚动时
                top_nav.className="navbar navbar-default navbar-fixed-top";
            }
            if (e.detail< -100) { //当滑轮向下滚动时
                top_nav.className="navbar navbar-default navbar-fixed-top __web-inspector-hide-shortcut__";
            }
        }
    }

//绑定滚动事件
window.onmousewheel = document.onmousewheel = scrollFunc;   //滚动滑轮触发scrollFunc方法  //ie 谷歌
if (document.addEventListener) {//firefox
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
}