// ==UserScript==
// @name 赛尔号官网夜间版开放
// @match *://seer.61.com/
// @version 1.0.0
// @author  橙汁
// @copyright   橙汁
// @namespace http://tampermonkey.net/
// @homepageURL https://space.bilibili.com/293848435
// @supportURL  http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=973354623@qq.com
// @license     GNU General Public License version 2; https://opensource.org/licenses/GPL-2.0
// @description  使赛尔号官网开放夜间版，在夜间也可以通过赛尔号官网进入游戏。
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/391995/%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%AE%98%E7%BD%91%E5%A4%9C%E9%97%B4%E7%89%88%E5%BC%80%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/391995/%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%AE%98%E7%BD%91%E5%A4%9C%E9%97%B4%E7%89%88%E5%BC%80%E6%94%BE.meta.js
// ==/UserScript==

var autoTimes = new Date();
var hour=autoTimes.getHours();
if (hour<6)
  {
    var flashUrl = "Client.swf?" + autoTimes.getTime();
    var so = new SWFObject(flashUrl, "Client", "960", "560", "8", "#000000");
    so.addParam("menu", "false");
    so.addParam("wmode", "opaque");
    so.addParam("allowFullScreen", "true");
    so.addParam("allowScriptAccess", "always");
    so.addParam("allowFullScreenInteractive", "true");
    so.addParam("quality", "low");
    so.write("flashContent");
  }