// ==UserScript==
// @name               XiaoHongShu No Watermark
// @name:zh-CN         小红书无水印下载
// @description        XiaoHongShu No Watermark, and Show Some Useful Options.
// @description:zh-CN  小红书无水印下载，并展示一些有用的选项。
// @namespace          https://www.runningcheese.com
// @version            0.2
// @author             RunningCheese
// @match              http*://www.xiaohongshu.com/explore*
// @match              http*://www.xiaohongshu.com/user/profile/*
// @icon               https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.xiaohongshu.com
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/463750/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/463750/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

javascript: {
   (function(links, position, stopPropagation, showOnClick, timestamp) {
  var document = window.document;
  var style = ".ws_cmbmc{position:fixed;z-index:10123456;width:130px;min-width:135px;display:block;visibility:hidden;border:1px solid #D9DADC;background:#fff;padding:3px 3px 3px 3px;text-align:left;}.ws_cmbmc a{display:block;float:left;margin:0;width:127px;border:none;padding:8px 0 8px 22px;background:#fff;color:black;text-decoration:none;font:normal normal normal 12px/100% Verdana,sans-serif;letter-spacing:normal;word-spacing:normal;}.ws_cmbmc a:hover{background:#a0a0a0;color:white;border:none;text-decoration:none;font:normal normal normal 12px/100% Verdana,sans-serif;letter-spacing:normal;word-spacing:normal;}";
  var divId = "ws_cmbm-" + timestamp;
  var div = document.getElementById(divId);
  var styleId = "ws_cmbms-" + timestamp;
  var styleElement = document.getElementById(styleId);
  var positionMap = {
    tl: {
      right: "75px",
      top: "75px"
    },
    tr: {
      right: "75px",
      top: "75px"
    },
    bl: {
      right: "75px",
      bottom: "75px"
    },
    br: {
      right: "75px",
      bottom: "75px"
    }
  };

  function show() {
    div.style.visibility = "visible";
  }

  if (div) {
    if (div.style.visibility == "visible") {
      show();
    } else {
      show();
    }
    return;
  }

  if (!styleElement) {
    style = style.replace(/.ws_cmbmc/g, "#" + divId);
    styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.id = styleId;
    styleElement.appendChild(document.createTextNode(style));
    document.getElementsByTagName("head")[0].appendChild(styleElement);
  }

  div = document.createElement("div");
  div.setAttribute("id", divId);
  div.className = "ws_cmbmc";

  for (var i = 0; i < links.length; i++) {
    var link = document.createElement("a");
    link.appendChild(document.createTextNode(links[i].title));
    link.setAttribute("href", links[i].url);
    if (showOnClick) {
      link.onclick = show;
    }
    div.appendChild(link);
  }

  document.getElementsByTagName("body")[0].appendChild(div);

  if (positionMap.hasOwnProperty(position)) {
    for (var key in positionMap[position]) {
      div.style[key] = positionMap[position][key];
    }
  } else if (position == "c") {
    div.style.left = Math.round((window.innerWidth - div.offsetWidth) / 2) + "px";
    div.style.top = Math.round((window.innerHeight - div.offsetHeight) / 2) + "px";
  }

  if (stopPropagation) {
    document.onclick = function() {
      show();
      if (typeof window.onclick == "function") {
        window.onclick();
      }
    };
    div.onclick = function(event) {
      event.stopPropagation();
    };
  }

  show();
})([{
  title: "无水印下载",
  url: "javascript:window.open('https://dlpanda.com/zh-CN/xhs?url='%20+%20unescape(location.href));void(0);"
}], "tl", true, true, 1678121690605);
};