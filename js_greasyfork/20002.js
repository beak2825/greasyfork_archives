// ==UserScript==
// @id             e64cfa11-ff2f-4d8e-a0c5-71637d0a71ad
// @name           豌豆荚直接下载
// @version        1.3
// @namespace      
// @author         liangsai12
// @description   在app名字下面添加 直接下载按钮
// @grant none
// @include        *www.wandoujia.com/apps/*

// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/20002/%E8%B1%8C%E8%B1%86%E8%8D%9A%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/20002/%E8%B1%8C%E8%B1%86%E8%8D%9A%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

var downUrl = '/download';
var url = window.location.toString();

var downloadStr1 = '直接下载';
var download = document.createElement('a');
download.setAttribute('href', url+downUrl);
download.setAttribute('id', 'CASHARE');
download.setAttribute('target', '_blank');
download.innerHTML = downloadStr1;
var CASHARE;
function insertAfter(newEl, targetEl)
{
  var parentEl = targetEl.parentNode;
  if (parentEl.lastChild == targetEl) {
    parentEl.appendChild(newEl);
  } else {
    parentEl.insertBefore(newEl, targetEl.nextSibling);
  }
}
function setInnerHtml() {
  if (url.indexOf('wandoujia.com') >= 0) {
    var pushBtn = document.getElementsByClassName('app-name') [0];  
    download.setAttribute('class', 'install-btn i-source');
    insertAfter(download, pushBtn);
 
  } 
}
function insertRun() {
  setInterval(function () {
    try {
      CASHARE = document.getElementById('CASHARE');
    } catch (e) {
      CASHARE = null;
    }
    if (CASHARE == null) {
      setInnerHtml();
    }
  }, 1000);
}
 insertRun();