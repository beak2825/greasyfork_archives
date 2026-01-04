// ==UserScript==
// @name         海角社区脚本
// @namespace    haijiao
// @version      0.0.1
// @author       dadaewqq
// @description  海角社区视频解析
// @license      MIT
// @icon         https://pomf2.lain.la/f/erejxtfo.ico
// @match        https://haijiao.com/*

// @downloadURL https://update.greasyfork.org/scripts/462318/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/462318/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// 待修改 需要加入一个点击弹出事件，不然会被拦截
var myFunction = function () {
  const isHaiJiaoPid = window.location.href.includes("?pid=");
  if (!isHaiJiaoPid) return;

  var getkey = function (callback) {
    $.get($('[id^="video_"]').attr("data-url"), function (data) {
      var regex = /https:\/\/[\w.\/]+\.ts/g; // 匹配以https://开头，以.ts结尾的URL
      var matches = data.match(regex); // 查找所有匹配项
      var firstMatch = matches[0]; // 获取数组中的第一个元素
      var lastSlashIndex = firstMatch.lastIndexOf("/"); // 获取最后一个斜杠的位置
      var slicedString = firstMatch.substr(lastSlashIndex, 16); // 获取从最后一个斜杠的位置+1开始的15个字符
      callback(slicedString); // pass the slicedString value to the callback function
    });
  };

  var getpre = function () {
    var keyPath = $('[id^="video_"]').attr("key-path");
    var lastSlashIndex = keyPath.lastIndexOf("/");
    var thirdLastSlashIndex = keyPath.lastIndexOf("/", lastSlashIndex - 1);
    var secondLastSlashIndex = keyPath.lastIndexOf("/", thirdLastSlashIndex - 1);
    var slicedString = keyPath.substring(secondLastSlashIndex + 1, lastSlashIndex);
    return slicedString;
  };

  getkey(function (slicedString) {
    // define the callback function to receive slicedString
    var all_string = "https://ip.hjcfcf.com/hjstore/video/" + getpre() + slicedString + "_i.m3u8";
    console.log(all_string);
    playurl = "https://m3u8play.com/?play=" + all_string;
    window.open(playurl);
  });
};

setTimeout(myFunction, 3000);
