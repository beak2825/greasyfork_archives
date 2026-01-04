// ==UserScript==
// @name         给用户批量设置不出现验证码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给用户批量设置不出现验证码,给用户批量设置不出现验证码
// @author       任亚军
// @match        https://www.wjx.cn/customerservices/manageallq2.aspx?username=*
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451786/%E7%BB%99%E7%94%A8%E6%88%B7%E6%89%B9%E9%87%8F%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%87%BA%E7%8E%B0%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/451786/%E7%BB%99%E7%94%A8%E6%88%B7%E6%89%B9%E9%87%8F%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%87%BA%E7%8E%B0%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
      var rows = document.querySelector("#myQManagegrvw").rows.length;
//    alert(rows);
      for(var i=2; i<= rows+2; i++){
          var istr = i.toString();
          if (istr.length==1) {
              istr = "0" + istr;
          }
          //alert(istr)
          var wjidlujing = "#myQManagegrvw_ctl" +istr +"_lblWordId";
          var wjid = document.querySelector(wjidlujing).textContent;
          var pos = document.querySelector(wjidlujing);
          var a1 = document.createElement("a");
          pos.appendChild(a1);
          a1.href = "https://www.wjx.cn/customerservices/changenamedesc.aspx?id="+wjid+"&automa=20220921";
          a1.innerText = "关验证码";
          a1.target="_blank";
          a1.style.cssText="font-size:10px;"

        }
})();