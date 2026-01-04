// ==UserScript==
// @name         试客巴追评任务免验证
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  追评任务免验证
// @author       SHERWIN
// @match        https://wx.shike8888.com/reviewTask/reviewSearch?tid=*
// @match        https://wx.shike8888.com/reviewTask/reviewFillIn?tid=*
// @icon         https://www.google.com/s2/favicons?domain=shike8888.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426809/%E8%AF%95%E5%AE%A2%E5%B7%B4%E8%BF%BD%E8%AF%84%E4%BB%BB%E5%8A%A1%E5%85%8D%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/426809/%E8%AF%95%E5%AE%A2%E5%B7%B4%E8%BF%BD%E8%AF%84%E4%BB%BB%E5%8A%A1%E5%85%8D%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';


     $('#section div img').on("tap",function(event){
     var tid = window.Utils.request("tid");

     window.location.href='/reviewTask/reviewFillIn?tid='+tid;


     })
    // Your code here...
})();