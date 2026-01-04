// ==UserScript==
// @name          在新标签页打开链接
// @namespace     https://greasyfork.org/
// @author        qinxs
// @version       1.0
// @description   强制所有链接在新标签页打开
// @license       MIT
// @include       http*://*/*
//
// @grant         none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/494161/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/494161/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

'use strict';

var base = document.createElement('base');
base.target = '_blank';
document.head.appendChild(base);

document.body.addEventListener('mouseup', function (event) {
  // console.log(event);
  try {
    var ele = event.target;
    ele = ele.href ? ele : getRealEle(ele);
    // console.log(ele);
    if (!ele.href) return;
    // javascript按钮，menu、选项卡
    if (ele.href.indexOf('javascript:') == 0 || checkIsMenu(ele)) {
      ele.target = '_self';
    }
  } catch (e) {}

  function getRealEle(ele) {
    // a 或者 上级为body 标签 停止查找
    if (!ele.parentNode || ele.parentNode.nodeName == 'BODY') return ele;
    var p = ele.parentNode;
    return p.nodeName == 'A' ? p : getRealEle(p);
  }

  function checkIsMenu(ele) {
    if (!ele.parentNode || ele.parentNode.nodeName == 'BODY') return false;
    var p = ele.parentNode;
    // console.log(p);
    var isMenu = p.nodeName == 'NAV' || /na?v|menu/.test(p.id);
    return isMenu ? true : checkIsMenu(p);
  }
});
