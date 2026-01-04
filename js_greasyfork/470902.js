// ==UserScript==
// @name        Bing首页优化-developing
// @namespace   Bing首页优化
// @description Bing首页优化，去除bing首页的国内版和国际版切换标签，去除底部的版权信息和广告链接，保留首页壁纸切换按钮。
// @author      haigirl
// @icon        https://favicon.yandex.net/favicon/v2/bing.com
// @match       *://cn.bing.com/*
// @match       https://www.bing.com/*
// @match       https://cn.bing.com/search?q=
// @match       https://cn.bing.com/chrome/newtab
// @version     0.0.5
// @license     GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/470902/Bing%E9%A6%96%E9%A1%B5%E4%BC%98%E5%8C%96-developing.user.js
// @updateURL https://update.greasyfork.org/scripts/470902/Bing%E9%A6%96%E9%A1%B5%E4%BC%98%E5%8C%96-developing.meta.js
// ==/UserScript==
//
// @brief 本脚本原作者为haigirl@https://greasyfork.org/zh-CN/users/805725-haigirl，只是练习使用vscode开发脚本，并试图增加功能
// 匿名函数自执行，用于修改Bing首页的布局和功能
(function() {
  //console.log("Webhook_test");

  // 使用定时器检测页面加载完成
  var timeFunction = window.setInterval(function(){loadEnd()},1);
  function loadEnd(){

    // 获取需要操作的DOM元素
    var footer = document.querySelector('.vs'); // 页脚 
    //.通过className获取元素，#通过Id获取
    var searchNav = document.querySelector('#est_switch'); // 搜索切换标签
    var searchBox = document.querySelector('.sb_form_q'); // 搜索框
    var sbox = document.querySelector('.sbox'); // 搜索框容器
    var headline = document.querySelector('#headline'); // 页面头部
    var hp_trivia_inner = document.querySelector('.hp_trivia_inner'); // 首页小知识
    var id_rh = document.querySelector('#id_rh'); // 推荐搜索
    var id_qrcode = document.querySelector('#id_qrcode'); // 手机扫码
    var sa_ul = document.getElementById('sa_ul'); // 搜索框内部 "今日热点"
    var qrcode_popup = document.getElementById('id_qrcode_popup_positioner'); //弹出的二维码

    // 临时去除页面滚动条
  if (GetCurrentUrl()=="https://cn.bing.com/chrome/newtab")
  {
      document.documentElement.style.overflowY = "hidden";//搜索结果界面继续搜索无滚动条，去掉但会造成主页面出现滚动条
  }

    // 隐藏或移除需要操作的DOM元素
    if (footer){
      hidenDom(footer);
    }
    if(qrcode_popup)
    {
      removeDom(qrcode_popup);
    }
    if (searchNav){
      hidenDom(searchNav);
    }
    if (sbox){
      sbox.style.margin='0';
      sbox.style.top = "15%"; // 设置搜索框位置
      sbox.style.left = "30%";
    }
    if (headline){
      hidenDom(headline);
    }
    if (hp_trivia_inner){
      hidenDom(hp_trivia_inner);
    }
    if (id_rh) {
      hidenDom(id_rh);
    }
    if (id_qrcode) {
      hidenDom(id_qrcode);
    }

    // 去除搜索框内部 "今日热点" sa_ul为搜索框内部 "今日热点"
    if (sa_ul) {
      var sa_ul_child = sa_ul.children;

      for (var i = 0; i < sa_ul_child.length; i++)
      {
        if (sa_ul_child[i].className == 'sa_hd'||sa_ul_child[i].className =='sa_nestedList ')
        {
          for (var j = i; j < sa_ul_child.length; j++)
          {
            hidenDom(sa_ul_child[j]);
          }
          break;
        }
      }
    }
  }

  // 移除指定DOM元素
  function removeDom(dom){
    if(dom){
      dom.remove();
    }
  }

  // 隐藏指定DOM元素
  function hidenDom(dom){
    if(dom){
      dom.style.display = 'none';
    }
  }

     //获取=前地址
    function GetCurrentUrl(){
    var loc = window.location.href;//获取全部地址
    //var n1 = loc.length;         //地址的总长度
    var n = loc.indexOf("="); //取得=号的位置
    var url = loc.substr(0, n);//从=号前面的内容
    //console.log(url);
    return loc;
}
  // 修改搜索框样式和交互
  // function SearchBoxEditor(){
  //   var searchbox= document.querySelector('#sb_form_q'); // 搜索框
  //   var searchLabel = document.querySelector('#sb_form'); // 搜索框容器

  //   searchLabel.style.backgroundColor = "#FFFFFF00"; // 设置搜索框容器背景色

  //   // 搜索框获取焦点时的样式
  //   function SearchBoxOnFocus(){
  //     searchLabel.style.backgroundColor = "#FFFFFF";
  //   }

  //   // 搜索框失去焦点时的样式
  //   function SearchBoxOnBlur(){
  //     searchLabel.style.backgroundColor = "#FFFFFF00";
  //   }

  //   // 鼠标滑过搜索框时的样式
  //   function SearchBoxOnMouseOver(){
  //     if(document.activeElement.id == "sb_form_q"){
  //       // 搜索框仍然处于焦点状态
  //       searchLabel.style.backgroundColor = "#FFFFFF";
  //     }else{
  //       searchLabel.style.backgroundColor = "#FFFFFF00";
  //     }
  //   }

  //   // 鼠标离开搜索框时的样式
  //   function SearchBoxOnMouseLeave(){
  //     if(document.activeElement.id == "sb_form_q"){
  //       // 搜索框仍然处于焦点状态
  //     }else{
  //       searchLabel.style.backgroundColor = "#FFFFFF00";
  //     }
  //   }

  //   // 绑定事件到搜索框和搜索框容器
  //   searchbox.onblur = SearchBoxOnBlur; // 失去焦点
  //   searchbox.onfocus = SearchBoxOnFocus; // 获得焦点
  //   searchbox.onclick = SearchBoxOnFocus; // 点击事件
  //   searchLabel.onclick = SearchBoxOnFocus; // 点击事件
  //   searchLabel.onmouseover = SearchBoxOnMouseOver; // 鼠标滑过
  //   searchLabel.onmouseleave = SearchBoxOnMouseLeave; // 鼠标离开 = 失去焦点
  // }

  // window.setTimeout(SearchBoxEditor, 10); // 延迟执行搜索框修改函数

})();
