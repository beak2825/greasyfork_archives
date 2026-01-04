// ==UserScript==
// @name         简书目录
// @name:zh-CN 简书目录
// @description:zh-cn 自动生成简书目录
// @namespace    https://github.com/lucid-lynxz
// @version      0.1.4
// @description  try to take over the world!
// @author       Lynxz
// @match        http://www.jianshu.com/p/*
// @match        https://www.jianshu.com/p/*
//// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31351/%E7%AE%80%E4%B9%A6%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/31351/%E7%AE%80%E4%B9%A6%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==
// 简书文章自动插入目录的脚本,用于tampermonkey
// 自适应屏幕宽度
// 简书已自带jquery了,不需要添加此依赖
var menuIndex = 0;
var firstPaddingOrder = 1; //第一个标题行标签层级 <h1> -> 1  , <h2> -> 2, 第一个层级不用缩进

function scrollToView(id) {
    var element = $("#" + id)[0];
    console.log(id + " \n" + element);
    //            document.getElementById(id).scrollIntoView();
    element.scrollIntoView();
}

// 在侧边栏中添加目录项
function appendMenuItem(tagName,id,content){
    let paddingLeft = (tagName.substring(1) - firstPaddingOrder) * 20;
    //$('#menu_nav_ol').append('<li class="' + id +  '" style="list-style:none;padding-left: '+ paddingLeft +'px;">' + content + '</li>');
    $('#menu_nav_ol').append('<li class="' + id +'" style="padding-left: '+ paddingLeft +'px;">' + content + '</li>');
    }

(function() {
    'use strict';
        // 使文章区域宽度适配屏幕
    let wider = $('.note').width() - 400;
    let oriWidth = $('.post').width();
    if (wider < oriWidth){
       wider = oriWidth;
    }
    // 有需要适配宽度的话,把这句启用即可
    $('.post').width(wider);

    let titles = $('body').find('h2,h3,h4,h5,h6');
    if(titles.length == 0){
        return;
    }
    // 在 body 标签内部添加 aside 侧边栏,用于显示文档目录
    $('.show-content').prepend('<aside id="sideMenu" style="width: 100%; padding: 0px 15px 5px 15px;margin-bottom:20px;background-color: #dedede">目录</aside>');
    $('#sideMenu').append('<ol id="menu_nav_ol" style="list-style:none;margin:0px;padding:0px;">');// 不显示 li 项前面默认的点标志, 也不使用默认缩进

    // 获取文章中除标题外的第一个目录行层级
    let firstElement = titles.first();
    let firstTagName = firstElement[0].tagName;
    firstPaddingOrder = parseInt(firstTagName.substring(1));
    // 遍历文章中的所有标题行, 按需添加id值, 并增加记录到目录列表中
    titles.each(function(){
          let tagName = $(this)[0].tagName.toLocaleLowerCase();
          let content = $(this).text();
          // console.log('oriId = '+$(this).attr('id') + '\t menuIndex = ' + menuIndex);
          // 若标题的id不存在,则使用新id
          let newTagId =$(this).attr('id');
          if(!$(this).attr('id')){
              newTagId = 'id_'+menuIndex;
              $(this).attr('id',newTagId);
              menuIndex++;
          }
          // console.log('newId = ' +newTagId);
          appendMenuItem(tagName,newTagId,content);
    });

    $('#sideMenu').append('</ol>');
    // 绑定目录li点击事件,点击时跳转到对应的位置
    $('#menu_nav_ol li').on('click',function(){
        let targetId = $(this).attr('class');
        //            document.getElementById(id).scrollIntoView();
        $("#"+targetId)[0].scrollIntoView(true);
    });

    // 删除侧边栏广告
    $('#note-fixed-ad-container').remove();
})();