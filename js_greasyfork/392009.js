// ==UserScript==
// @name 赛尔号页面免刷新提示
// @match *://seer.61.com/
// @match *://seer.61.com/play.shtml
// @version 1.0.0
// @author  橙汁
// @copyright   橙汁
// @namespace http://tampermonkey.net/
// @homepageURL https://space.bilibili.com/293848435
// @supportURL  http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=973354623@qq.com
// @license     GNU General Public License version 2; https://opensource.org/licenses/GPL-2.0
// @description 去除赛尔号页面的刷新确认提示。
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/392009/%E8%B5%9B%E5%B0%94%E5%8F%B7%E9%A1%B5%E9%9D%A2%E5%85%8D%E5%88%B7%E6%96%B0%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/392009/%E8%B5%9B%E5%B0%94%E5%8F%B7%E9%A1%B5%E9%9D%A2%E5%85%8D%E5%88%B7%E6%96%B0%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

var t=setInterval("clearConfirmInitLocal()",3000);

clearConfirmInitLocal=function(){
  if (window.onbeforeunload==null)
    return;
  else
    {
      window.onbeforeunload=null;
      clearInterval(t);
    }
}