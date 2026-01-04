// HookAjax Test! example user script
// version 0.1 BETA!
// 2018-07-02
// Copyright (c) 2018, 安静的猫
// Released under the GPL license
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "HookAjax Test", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          HookAjax Test
// @namespace     http://diveintogreasemonkey.org/download/
// @description   ww.soundsnap.com 铃声免费下载
// @require       http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @require       https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @include       *
// @exclude       http://diveintogreasemonkey.org/*
// @exclude       http://www.diveintogreasemonkey.org/*
// @run-at      document-end
// @version    0.1.201807021811
// @downloadURL https://update.greasyfork.org/scripts/370037/HookAjax%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/370037/HookAjax%20Test.meta.js
// ==/UserScript==
(function () {
  'use strict';
  var regSound = 'www.soundsnap.com';
  hookAjax({
    onreadystatechange: function(xhr) {
      console.log("onreadystatechange called: %O", xhr)
      //return true

    },
    onload: function(xhr) {
      console.log("onload called: %O", xhr)
      xhr.responseText = "hook" + xhr.responseText;
      //return true;
    },
    open: function(arg, xhr) {
      console.log("open called: method:%s,url:%s,async:%s", arg[0], arg[1], arg[2], xhr)
      // arg[1] += "?hook_tag=1";
      //统一添加请求头

    },
    send: function(arg, xhr) {
      console.log("send called: %O", arg[0])
      xhr.setRequestHeader("_custom_header_", "ajaxhook")
    },
    setRequestHeader: function(arg, xhr) {
      console.log("setRequestHeader called!", arg)
    }
  });

  if (location.host === regSound) {
    createDownloadAllElement();
    var items = document.getElementsByClassName("wave");
    var parentsItems = document.getElementsByClassName("ojoo-teaser");
    if (items.length > 0) {
      for (var i = 0; i < items.length; i++) {
        var curChild = getChildrenByName(items[i], 'audio');
        if (curChild && curChild.length > 0) {
          // var src = curChild[0].getAttribute('src')
          var src = curChild[0].src;
          var btn = createElement(src);
          parentsItems[i].style.position = 'relative';
          parentsItems[i].appendChild(btn)
        }
      }
    }
  }

  function getChildrenByName(curEle, tagName) {
    var nodeList = curEle.childNodes;
    var ary = [],
      resultChild = [];
    if (/MSIE(6|7|8)/.test(navigator.userAgent)) {
      for (var i = 0; i < nodeList.length; i++) {
        var curNode = nodeList[i];
        if (curNode.nodeType === 1) {
          ary[ary.length] = curNode;
        }
      }
    } else {
      ary = Array.prototype.slice.call(curEle.children);
    }
    // 获取指定子元素
    if (typeof tagName === "string") {
      for (var k = 0; k < ary.length; k++) {
        var curTag = ary[k];
        if (curTag.nodeName.toLowerCase() === tagName.toLowerCase()) {
          resultChild.push(ary[k])
        }
      }
    }
    return resultChild;
  }

  function createElement(src) {
    var ele = document.createElement("a");
    ele.setAttribute("href", src);
    ele.setAttribute("target", '_blank');
    ele.setAttribute("class", 'download-link');
    ele.style.color = "blue";
    ele.text = "下载";
    ele.style.position = 'absolute';
    ele.style.bottom = '44px';
    ele.style.left = '0px';
    return ele;
  }

  function createDownloadAllElement() {
    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "my-btn");
    button.setAttribute("value", "下载全部");
    button.setAttribute("onClick", "var itemsLink = document.getElementsByClassName('download-link'); if (itemsLink && itemsLink.length > 0) {   for (var i = 0; i < itemsLink.length; i++) {itemsLink[i].click(); } }");
    button.style.width = "60px";
    button.style.height = "20px";
    button.style.borderRadius = "2px";
    button.style.align = "center";
    button.style.marginBottom = "4px";
    button.style.background = "#b46300";
    button.style.border = "1px solid #b46300";
    button.style.color = "white";
    button.style.position = 'absolute';
    button.style.bottom = '0px';
    button.style.left = '0px';
    button.innerText = '下载全部';
    var container = document.getElementsByClassName('search-results');
    if (container && container.length > 0) {
      container[0].style.position = 'relative';
      container[0].appendChild(button);
    }
  }

})();