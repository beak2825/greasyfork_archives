// ==UserScript==
// @name              115艾薇预览+ 清洁版
// @namespace         https://sleazyfork.org/
// @version           1.5.0
// @description       115艾薇预览+ 的个人使用的修改版本，文件界面放大、自动获取艾薇封面+标题, 清理了不必要的代码, 修改了图片获取地址
// @author            someone
// @include           https://115.com/?*mode=wangpan*
// @domain            javdb.com
// @grant             GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/508755/115%E8%89%BE%E8%96%87%E9%A2%84%E8%A7%88%2B%20%E6%B8%85%E6%B4%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/508755/115%E8%89%BE%E8%96%87%E9%A2%84%E8%A7%88%2B%20%E6%B8%85%E6%B4%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
  "use strict";
  let item_list, ifr;
  
  // 获取指定style的iframe
  ifr = $("iframe[style='position: absolute; top: 0px;']");

  // iframe加载完成后执行
  ifr.load(function() {
    // 设置样式
    setCss();
    // 获取iframe中的body和div#js_data_list
    item_list = ifr.contents().find("body").find("div#js_data_list");
    // 为div#js_data_list添加鼠标进入事件
    item_list.mouseenter(itemEvent);
  });

  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  function getVideoCode(title) {
    var t = title.match(/[A-Za-z]+\-\d+/);
    if (!t) {
      t = title.match(/heyzo[\-\_]?\d{4}/);
    }
    if (!t) {
      t = title.match(/\d{6}[\-\_]\d{3}/);
    }
    if (!t) {
      t = title.match(/[A-Za-z]+\d+/);
    }
    return t;
  }

  // 定义一个函数getVideoInfo，用于获取视频信息
  function getVideoInfo(id) {
    // 定义一个变量info，用于存储视频信息
    var info = "<div id='" + id + "' class='item_info'></div>";
    // 将info添加到item_list中
    item_list.append(info);
    // 使用GM_xmlhttpRequest发送HTTP请求
    GM_xmlhttpRequest({
      // 请求方法
      method: "GET",
      // 请求地址
      url: "https://javdb.com/search?q=" + id + "&f=all",
      // 请求加载完成后的回调函数
      onload: xhr => {
        // 将响应内容转换为jQuery对象
        var xhr_data = $(xhr.responseText);
        // 如果响应内容中没有div.alert，则执行以下操作
        if (!xhr_data.find("div.alert").length) {
          // 获取视频标题
          var title = xhr_data.find("div.video-title").html();
          // 获取item_info
          var item_info = item_list.find("#" + id);
          // 定义info_html，用于存储视频信息
          var info_html =
            "<div class='item_border'><h4>" + title + "</h4></div>";
          // 将info_html添加到item_info中
          item_info.append(info_html);
          // 获取视频封面图片
          var img = xhr_data.find("div.cover img").attr("src");
          // 将视频封面图片添加到item_info中
          item_info.find(".item_border").append("<img src='" + img + "'>");
        }
      }
    });
  }

  function hiddenVideoInfo(id) {
    item_list.find("div#" + id).css("display", "none");
  }

  // 为item列表添加事件
  function itemEvent() {
    // 鼠标移入事件
    function onItemMouseEnter(event) {
      // 获取当前元素
      const $item = $(event.currentTarget);
      // 获取视频标题
      const title = $item.attr("title");
      // 获取视频id
      const id = getVideoCode(title);
  
      // 如果id存在
      if (id) {
        // 获取视频信息
        const $info = item_list.find(`div#${id}`);
  
        // 如果视频信息不存在
        if ($info.length === 0) {
          // 获取视频信息
          getVideoInfo(id);
        }
  
        // 显示视频信息
        showVideoInfo($info, event.clientX, event.clientY);
      }
    }
    // 鼠标移出事件
    function onItemMouseLeave(event) {
      // 获取当前元素
      const $item = $(event.currentTarget);
      // 获取视频标题
      const title = $item.attr("title");
      // 获取视频id
      const id = getVideoCode(title);
  
      // 隐藏视频信息
      hiddenVideoInfo(id);
    }

    // 为item列表中的li元素添加事件
    item_list.find("li")
      // 鼠标移入事件，使用防抖函数，延迟500毫秒
      .on("mouseenter", debounce(onItemMouseEnter, 200))
      // 鼠标移出事件
      .on("mouseleave", onItemMouseLeave);
  }

  function setCss() {
    ifr.contents().find("head").append(`
        <style type='text/css'>
          .item_info{
            display:none;
            width:400px;
            position:fixed;
            z-index:100;
            border-radius:5px;
            background:rgba(248,248,255,0.7);
          }
          .item_border{
            margin:5px;
            padding:5px 5px 0px 5px;
            border:1px solid gray;
            border-radius:5px;
          }
          .item_border h4{
            margin-bottom:5px;
          }
          .item_border img{
            width:100%;
          }
        </style>
      `);
  }

  // 函数showVideoInfo，用于显示视频信息
  function showVideoInfo($ele, x, y) {
    // 获取iframe的内容
    const $window = ifr.contents().find('body');
    // 获取窗口的宽度和高度
    const windowWidth = $window.width();
    const windowHeight = $window.height();
    // 获取元素的宽度和高度
    const eleWidth = $ele.outerWidth();
    const eleHeight = $ele.outerHeight();

    // 计算元素显示的位置
    let left = x + 40;
    let top = y;

    // 如果元素显示的位置超出窗口的宽度，则调整位置
    if (x + eleWidth > windowWidth) {
      left = x - eleWidth + 40;
    }

    // 如果元素显示的位置超出窗口的高度，则调整位置
    if (y + eleHeight > windowHeight) {
      top = y - eleHeight;
    }

    // 设置元素的显示位置和显示状态
    $ele.css({
      left,
      top,
      display: 'block',
    });
  }
})();
