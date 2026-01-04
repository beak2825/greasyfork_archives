// ==UserScript==
// @name         SDR页面添加一个拨号按钮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  SDR页面添加一个拨号按钮...
// @author       任亚军
// @match        https://www.wjx.cn/customerservices/sdrworkingtable.aspx
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458329/SDR%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%8B%A8%E5%8F%B7%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/458329/SDR%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%8B%A8%E5%8F%B7%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
      var rows = document.querySelector("#grvwUsers").rows.length;
//      alert(rows);
      for(var i=2; i<= rows; i++){
            var lujing1 = "#grvwUsers > tbody > tr:nth-child("+ i +") > td:nth-child(2) a"
            var lujing2 = "#grvwUsers_ctl"+ i +"_lblmobile";
            var telnumber = document.querySelector(lujing1).innerText
            var pos = document.querySelector(lujing1).parentNode;
            var a1 = document.createElement("a");
            pos.appendChild(a1);
            a1.href = "Web2Python://intelunison/"+telnumber;
            a1.innerText = "拨号";
            a1.target="_blank";
        }
})();