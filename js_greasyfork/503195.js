// ==UserScript==
// @name         湖南法网学法读本文字抓取
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  湖南法网学法读本文字抓取0
// @author       Your Name
// @match        http://hn.12348.gov.cn/fxmain/subpage/legalpublicity*
// @grant        GM_download
// @license      咀嚼
// @downloadURL https://update.greasyfork.org/scripts/503195/%E6%B9%96%E5%8D%97%E6%B3%95%E7%BD%91%E5%AD%A6%E6%B3%95%E8%AF%BB%E6%9C%AC%E6%96%87%E5%AD%97%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/503195/%E6%B9%96%E5%8D%97%E6%B3%95%E7%BD%91%E5%AD%A6%E6%B3%95%E8%AF%BB%E6%9C%AC%E6%96%87%E5%AD%97%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个下载字符串的函数
    function downloadStringAsFile(str, fileName) {
        // 创建一个Blob对象，包含要下载的字符串
        var blob = new Blob([str], { type: 'text/plain;charset=utf-8' });

        // 创建一个临时的a元素
        var tempLink = document.createElement('a');

        // 设置a元素的href属性为Blob对象的URL
        tempLink.href = URL.createObjectURL(blob);

        // 设置a元素的download属性为文件名
        tempLink.download = fileName;

        // 触发a元素的点击事件，开始下载
        tempLink.click();

        // 释放Blob对象的URL
        URL.revokeObjectURL(tempLink.href);
    }

    // 在页面加载完成后执行下载函数
    //window.addEventListener('load', function() {

   // });

  var xyz = document.getElementsByClassName('node_name')
  var str =''
  var fileName = document.querySelector("div.s_fzhd_title.regulationsTitle").innerText
  for(let a = 1; a <= xyz.length; a++) {
        setTimeout(function timer() {
        // 假设你有一个字符串变量str和一个文件名fileName
        var str1= document.querySelector("div.nei_wl.float_l").innerText;
        str =str +str1;
      // 调用下载函数
        if(a == xyz.length){ downloadStringAsFile(str, fileName);}
        xyz[a].click()
    }, a * 3000);
	}

  //setInterval(dzwxkc,3800)


})();