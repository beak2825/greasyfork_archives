// ==UserScript==
// @name 贴吧首页优化
// @namespace Violentmonkey Scripts
// @description  美化贴吧首页显示，只保留动态和已关注贴吧，并且显示所有已关注贴吧
// @version      1.0.1
// @author       mzr1996
// @include *://tieba.baidu.com/#
// @include *://tieba.baidu.com/
// @include *://tieba.baidu.com/index*
// @run-at       document-body
// @license      MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/401484/%E8%B4%B4%E5%90%A7%E9%A6%96%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/401484/%E8%B4%B4%E5%90%A7%E9%A6%96%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// ====  Tips =====
//  本脚本受@BackRunner的“贴吧页面精简脚本”启发，增删了部分功能
// 如果需要功能更加强大、可定制化的精简效果请使用上述脚本
// 2020-4-20在本人电脑上使用Firefox测试没有问题
// 然本人JS小白，不保证脚本的持续更新和兼容性
// 如果你有好的修改意见，欢迎使用本脚本做二次修改或联系本人
// ================

(function(){
  "use strict";
  var startTime = new Date().getTime();
  
  //控制台信息
  console.warn('贴吧主页优化开始');
  
  // 触发ajax，加载更多关注贴吧
  $('#moreforum').trigger("mouseover");
  $('#moreforum').trigger("mouseout");
  
  // 将更多关注贴吧添加至左侧边栏
  var likeforumwrapper = document.getElementById('likeforumwraper');
  var morelikelist = document.getElementById('forumscontainer').firstChild.firstChild.childNodes;
  for (var i = 0;i<morelikelist.length;i++){
    if (morelikelist[i].className.indexOf('addnewforumbtn') == -1){
        var newitem = morelikelist[i].cloneNode(true);
        newitem.className += ' u-f-item';
        likeforumwrapper.appendChild(newitem);
        }
  }
  // 添加占位符以保证“添加爱逛的吧”另起一行
  //if (morelikelist.length%2===0){
  //  var placeholder = document.createElement('a');
  //  placeholder.setAttribute('class','u-f-item');
  //  likeforumwrapper.appendChild(placeholder);
  //}
  
  //var addnewforumbtn = morelikelist[morelikelist.length-1];
  //likeforumwrapper.appendChild(addnewforumbtn);
  
  configCSS();
  
  var finishTime = new Date().getTime() - startTime;
  console.log('贴吧主页优化用时: ' + finishTime);
  
  //修改CSS文件
  function configCSS(){
    var cssText = "";
    // 移除顶部滚动横幅
    cssText += '.top-sec {display: none !important;}';
    // 移除贴吧推荐
    cssText += '.r-top-sec {display: none !important;}';
    // 移除右侧二维码和热议榜
    cssText += '.r-right-sec {display: none !important;}';
    // 移除直播秀
    cssText += '.spage_liveshow_slide {display: none !important;}';
    // 移除我的游戏
    cssText += '#spage_game_tab_wrapper {display: none !important;}';
    // 移除贴吧精选专题
    cssText += '.aggregate_entrance_wrap {display: none !important;}';
    // 移除贴吧分类
    cssText += '.ufw-gap {display: none !important;}';
    cssText += '#f-d-w {display: none !important;}';
    // 移除更多关注贴吧按钮
    cssText += '#moreforum {display: none !important;}';
    cssText += '.pop-up-frame {display: none !important;}';

    // “添加爱逛的吧”按钮配置
    cssText += '.addnewforumbtn {background: url(//tb2.bdstatic.com/tb/static-spage/img/css1_44fc180.png) no-repeat; _background: url(//tb2.bdstatic.com/tb/static-spage/img/css1_7481ade.gif) no-repeat; background-position: -524px -208px;line-height: 35px;padding-left: 6px;color: #444;float: left;height: 35px;margin-bottom: 3px;overflow: hidden;width: 168px;position: relative;margin-left: 8px;_margin-left: 9px;}';
    // “爱逛的吧”边栏禁止滚动
    cssText += '.left-cont-fixed {position:unset !important;}';
    // 修改动态样式
    cssText += '.new_list {margin: 18px 0 0;}';
    cssText += '.j_feed_li {border-style: dashed solid none solid;border-width: 1px;padding: 10px;border-color: #E2D8D6;}';
    cssText += '.home-place-item {display: none !important;}';
    cssText += '.n_right {width: 530px;}';
    
    // 应用CSS
    var element = document.createElement('link');
    element.rel="stylesheet";
    element.type="text/css";
    element.href='data:text/css,'+cssText;

    document.documentElement.appendChild(element);
    var modStyle = document.querySelector('#modCSS');
    if (modStyle === null){
      modStyle = document.createElement('style');
      modStyle.id = 'modCSS';
      document.body.appendChild(modStyle);
      modStyle.innerHTML = cssText;
    }
  }
})();
