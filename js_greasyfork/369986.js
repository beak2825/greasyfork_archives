// SoundSnap-铃声下载! example user script
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
// select "SoundSnap-铃声下载", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          SoundSnap-铃声下载
// @namespace     http://diveintogreasemonkey.org/download/
// @description   ww.soundsnap.com 铃声免费下载
// @require       http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @include       *
// @exclude       http://diveintogreasemonkey.org/*
// @exclude       http://www.diveintogreasemonkey.org/*
// @run-at      document-end
// @version    0.1.20200331000002
// @downloadURL https://update.greasyfork.org/scripts/369986/SoundSnap-%E9%93%83%E5%A3%B0%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/369986/SoundSnap-%E9%93%83%E5%A3%B0%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function () {
  'use strict';
  var regSound = 'www.soundsnap.com';
  function watchInterval() {
     setInterval(init, 3000);
  }
  if (location.host === regSound) {
    watchInterval();
    init();
  }
  
  function init() {
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
    ele.style.left = '-30px';
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
    button.style.left = '-30px';
    button.innerText = '下载全部';
    var container = document.getElementsByClassName('search-results');
    if (container && container.length > 0) {
      container[0].style.position = 'relative';
      container[0].appendChild(button);
    }
  }

})();
