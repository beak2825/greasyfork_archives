// ==UserScript==
// @name        Wenku8 Download Text
// @namespace   saltfish.moe
// @description Download TXTs from contents page.
// @include     https://www.wenku8.net/novel/*/*/index.htm
// @include     http://www.wenku8.net/novel/*/*/index.htm
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/375818/Wenku8%20Download%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/375818/Wenku8%20Download%20Text.meta.js
// ==/UserScript==
function getElementsByClass(searchClass) {
  if (document.getElementsByClassName)
  return document.getElementsByClassName(searchClass);
   else if (document.all) {
    var classElements = new Array();
    var allElements = document.all;
    for (i = 0, j = 0; i < allElements.length; i++) {
      if (allElements[i].className == searchClass) {
        classElements[j] = allElements[i];
        j++;
      }
    }
  } else if (document.getElementsByTagName) {
    var classElements = new Array();
    var allElements = document.getElementsByTagName('*');
    for (i = 0, j = 0; i < allElements.length; i++) {
      if (allElements[i].className == searchClass) {
        classElements[j] = allElements[i];
        j++;
      }
    }
  } else {
    return;
  }
  return classElements;
}
var novelId = window.location.pathname.split('/') [window.location.pathname.split('/').length - 2];
var items = getElementsByClass('vcss');
var addlink = function (init) {
  var current = init.parentElement.nextElementSibling.firstElementChild;
  var dlNode = document.createElement('A');
  var paragraphId = current.childNodes[0].getAttribute('href').replace('.htm', '');
  var downadd = 'http://dl.wenku8.com/packtxt.php?aid=' + novelId + '&vid=' + paragraphId + '&charset=utf-8';
  dlNode.setAttribute('href', downadd);
  dlNode.innerHTML = '下载(UTF-8)';
  init.appendChild(dlNode);
};
for (var i = 0; i < items.length; i++) addlink(items.item(i));
return 0;
