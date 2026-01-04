// ==UserScript==
// @name         去你大爷的玫瑰小镇新网址
// @namespace    CoolBreeze_RoseTown
// @version      0.1.1
// @description  通过访问1314.qq.com或meigui.qq.com自动重定向到新地址。谁特么的要去访问那又臭又长的新地址啊;顺便把背景铺满了窗口，下面露出一截太难受了。
// @author       CoolBreeze
// @match      *://meigui.qq.com/?from=platform
// @match      *://1314.qq.com/?from=platform
// @match        *://meigui.qq.com/index.htm*
// @match        *://1314.qq.com/index.htm*
// @match        *://meigui.qq.com/notice.htm*
// @match        *://1314.qq.com/notice.htm*
// @run-at       document-start
// @icon         https://meigui.qq.com/images/favicon.ico
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/451633/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E7%8E%AB%E7%91%B0%E5%B0%8F%E9%95%87%E6%96%B0%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/451633/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E7%8E%AB%E7%91%B0%E5%B0%8F%E9%95%87%E6%96%B0%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!window.location.href.indexOf("meigui.qq.com/?from=platform")){
        window.location.href = "https://meigui.qq.com/?from=platform";
    } else {
         document.addEventListener('DOMContentLoaded', ()=>{
            document.getElementsByClassName("wrap")[0].style.backgroundSize = "cover";
        });
    }
})();