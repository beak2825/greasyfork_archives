// ==UserScript==
// @name         Nicer BNU Portforlio
// @namespace    https://greasyfork.org/users/781390
// @version      0.1
// @description  Open a new window for BNU Stock
// @author       Anthony T @ Macau
// @email        stifire@163.com
// @match        https://online.bnu.com.mo/ebank/bnu/StockPortfolio
// @match        https://trade.boom.com.hk/hongkong/portfolio.jsp
// @license      MIT
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/427687/Nicer%20BNU%20Portforlio.user.js
// @updateURL https://update.greasyfork.org/scripts/427687/Nicer%20BNU%20Portforlio.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  url = window.location.href;
  //alert("loaded: " + url);
  if (url == "https://online.bnu.com.mo/ebank/bnu/StockPortfolio")
  {
    var mainif = document.getElementById("mainIframe");
    if (mainif) {
        var boomurl = mainif.src;
        window.open(boomurl, '_blank').focus();
    }
    else
      alert("Unable to find mainIframe!")
  }
  else if (url == "https://trade.boom.com.hk/hongkong/portfolio.jsp")
      {
        document.getElementsByClassName("select-market")[0].selectedIndex = 0;
        document.getElementById("mrkForm").submit(); //Change
      }
}, false);