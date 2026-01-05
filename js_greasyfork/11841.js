// ==UserScript==
// @name         TradingView
// @namespace    http://codelinkapps.com
// @version      1.0
// @description  Maximizes tradingview charts.
// @author       BossCan
// @match        https://www.tradingview.com/chart/?symbol=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11841/TradingView.user.js
// @updateURL https://update.greasyfork.org/scripts/11841/TradingView.meta.js
// ==/UserScript==

document.getElementsByClassName("tv-close-panel")[1].click();
document.getElementsByClassName("tv-side-panel")[0].parentNode.removeChild(document.getElementsByClassName("tv-side-panel")[0]);
document.getElementById("footer-chart-panel").parentNode.removeChild(document.getElementById("footer-chart-panel"));

window.dispatchEvent(new Event('resize'));