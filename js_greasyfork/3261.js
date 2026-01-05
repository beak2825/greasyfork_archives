// ==UserScript==
// @name        山东大学部分老系统侧边栏（menu_m.asp）显示脚本
// @namespace   https://github.com/liuycsd/shell-scripts/tree/master/user.js
// @description 显示山东大学部分老系统侧边栏（menu_m.asp）
// @include     http://202.194.15.97:8888/login.jsp
// @include     http://211.86.56.237:8080/xsgl/student/index_menu.jsp
// @version     0.2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3261/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E9%83%A8%E5%88%86%E8%80%81%E7%B3%BB%E7%BB%9F%E4%BE%A7%E8%BE%B9%E6%A0%8F%EF%BC%88menu_masp%EF%BC%89%E6%98%BE%E7%A4%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/3261/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E9%83%A8%E5%88%86%E8%80%81%E7%B3%BB%E7%BB%9F%E4%BE%A7%E8%BE%B9%E6%A0%8F%EF%BC%88menu_masp%EF%BC%89%E6%98%BE%E7%A4%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
document.getElementsByName('content1')[0].src='menu_m.jsp'
