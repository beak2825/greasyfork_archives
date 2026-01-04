// ==UserScript==
// @name        kuan-url-copy
// @match       https://www.coolapk.com/link?*
// @namespace   http://github.com/zhichengroup/kuanurl
// @grant       none
// @version     1.0
// @author      zcg
// @description 2023/12/4 09:11:30
// @downloadURL https://update.greasyfork.org/scripts/481347/kuan-url-copy.user.js
// @updateURL https://update.greasyfork.org/scripts/481347/kuan-url-copy.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.info('开启酷安自动跳转脚本');
  var url = document.getElementsByTagName('p')[0].innerText;

  var a =document.createElement('a');
  a.innerHTML = '<a href="' + url +'">open</a>';
  document.body.appendChild(a);

  var b =document.createElement('button');
  b.innerText='copy url'
  b.onclick=function(){
    var oInput = document.createElement('input');
    oInput.value = url;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    alert('复制成功');
  }
  document.body.appendChild(b);

})();

