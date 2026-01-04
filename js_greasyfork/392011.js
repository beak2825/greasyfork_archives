// ==UserScript==
// @name 赛尔号官网页面精简化
// @match *://seer.61.com/
// @version 1.0.0
// @author  橙汁
// @copyright   橙汁
// @namespace http://tampermonkey.net/
// @homepageURL https://space.bilibili.com/293848435
// @supportURL  http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=973354623@qq.com
// @license     GNU General Public License version 2; https://opensource.org/licenses/GPL-2.0
// @description  精简赛尔号官方页面，去除其他游戏的滚动展示、十周年页面跳转事件，只保留游戏主体与下方信息等关键内容。
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/392011/%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%AE%98%E7%BD%91%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/392011/%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%AE%98%E7%BD%91%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

$("body").off("click");

removeClass('brand_zoon');
removeClass('add_1204');
removeClass('product');
removeClass('iframe_banner');
removeClass('topbar_wrap cf');
removeClass('footer-wrap-bott');

function removeClass(ClassName){
  var elem = document.getElementsByClassName(ClassName);
  elem[0].parentNode.removeChild(elem[0]);
}