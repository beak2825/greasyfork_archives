// ==UserScript==
// @name         平台订单旅行费率
// @namespace    https://greasyfork.org/zh-CN/users/104201
// @version      0.37
// @description  美团旅行，携程度假，自动计算费率!
// @author       黄盐
// @match        *://mpc.meituan.com/old/otp.html
// @match        *://vbooking.ctrip.com/*/OrderManagement/DetailVBKOrder.aspx?o=*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379010/%E5%B9%B3%E5%8F%B0%E8%AE%A2%E5%8D%95%E6%97%85%E8%A1%8C%E8%B4%B9%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/379010/%E5%B9%B3%E5%8F%B0%E8%AE%A2%E5%8D%95%E6%97%85%E8%A1%8C%E8%B4%B9%E7%8E%87.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if(location.href.indexOf("mpc.meituan.com/old/otp.html")>-1){
    function getRate() {
      var strs = document.querySelectorAll("div.order-pay-info p");
      var pAfter,pPromo,pBefore,rate;
      if(strs.length == 4){
        pAfter = parseFloat(strs[2].textContent.replace(/[￥,]/g, ""));
        pBefore = parseFloat(strs[1].textContent.replace(/[￥,]/g, ""));
        rate = (parseFloat((1 - pAfter / pBefore).toFixed(3))*100).toFixed(1);
      }
      else if(strs.length==6){
        pAfter = parseFloat(strs[4].textContent.replace(/[￥,]/g, ""));
        pPromo = parseFloat(strs[3].textContent.replace(/[￥,]/g, ""));
        pBefore = parseFloat(strs[1].textContent.replace(/[￥,]/g, ""));
        rate = (parseFloat((1 - (pAfter+pPromo) / pBefore).toFixed(3)) * 100).toFixed(1); 
      }
      document.querySelector("section .order-progress span").setAttribute("style", "font-size:2.5em;font-weight:bolder;");
      document.querySelector("section .order-progress span").textContent = rate;
      console.log("rate:"+rate,pAfter, pBefore);
    }
    function isReady(){
      if(document.querySelectorAll("div.order-pay-info p").length >= 4){
        clearInterval(itv);
        setTimeout(getRate, 300);
        return true;
      }
      else
        return false;
    }
    var itv = setInterval(isReady, 200);
  }else {
    function getRate() {
      var pAfter = parseFloat(document.querySelector("tbody.tBodySettlementDetail tr:nth-child(2) td:nth-child(4)").textContent);
      var pBefore = parseFloat(document.querySelector("#divOrder table tr:nth-child(2) td:nth-child(8)").textContent);
      var rate = ((1-(pAfter / pBefore))*100).toFixed(1);
      document.querySelector("#view_deliverInfo h3").textContent = "费率";
      document.querySelector("#view_deliverInfo span").setAttribute("style", "font-size:2.5em;font-weight:bolder;");
      document.querySelector("#view_deliverInfo span").textContent = rate;
      console.log("rate:"+rate);
    }
    function isReady(){
      if(getComputedStyle(document.getElementById('loading_deliverinfo'))
        && document.getElementById('loading_deliverinfo').style.display == "none"
        && document.querySelector("tbody.tBodySettlementDetail tr:nth-child(2) td:nth-child(4)")
        ){
        clearInterval(itv1);
        setTimeout(getRate, 200);
        return true;
      }
      else
        return false;
    }
    var itv1 = setInterval(isReady, 200);
  }
})();