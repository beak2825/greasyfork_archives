// ==UserScript==
// @name        山东大学本科生奖助贷管理系统导航栏显示脚本
// @namespace   https://github.com/liuycsd/shell-scripts/tree/master/user.js
// @description 显示山东大学本科生奖助贷管理系统导航栏下拉菜单
// @include     http://211.86.56.237:8080/*
// @version     0.2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12678/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E6%9C%AC%E7%A7%91%E7%94%9F%E5%A5%96%E5%8A%A9%E8%B4%B7%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%98%BE%E7%A4%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/12678/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E6%9C%AC%E7%A7%91%E7%94%9F%E5%A5%96%E5%8A%A9%E8%B4%B7%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%98%BE%E7%A4%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
  var scriptNode, targ;

  if (typeof show === 'function') {
    scriptNode = document.createElement('script');
    scriptNode.type = "text/javascript";
    scriptNode.textContent = 'show = function(item) {\n  document.getElementById(item).removeAttribute(\'hidden\');\n  openMenu = item;\n  document.getElementById(item).style.visibility=\'visible\';\n}	';
    targ = (document.getElementsByTagName('head'))[0] || document.body;
    targ.appendChild(scriptNode);
  }

  if (typeof hideit === 'function') {
    scriptNode = document.createElement('script');
    scriptNode.type = "text/javascript";
    scriptNode.textContent = 'hideit = function(item) {\n  if(! window[\'in_\'+item]) {\n    openMenu = "";\n    document.getElementById(item).style.visibility=\'hidden\';\n  }\n}';
    targ = (document.getElementsByTagName('head'))[0] || document.body;
    targ.appendChild(scriptNode);
  }

}).call(this);
