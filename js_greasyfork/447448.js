// ==UserScript==
// @name         Większe ikony kurierów na liście zamówień
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Większe ikony kurierów w panelu butosklep
// @author       You
// @match        https://butosklep.pl/panel/orders-list.php*
// @icon         https://butosklep.pl/gfx/pol/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447448/Wi%C4%99ksze%20ikony%20kurier%C3%B3w%20na%20li%C5%9Bcie%20zam%C3%B3wie%C5%84.user.js
// @updateURL https://update.greasyfork.org/scripts/447448/Wi%C4%99ksze%20ikony%20kurier%C3%B3w%20na%20li%C5%9Bcie%20zam%C3%B3wie%C5%84.meta.js
// ==/UserScript==
 
window.onload = function() {
  setTimeout(function() {
    let courierIcon = document.querySelectorAll("td.yui-dt0-col-deliverer.yui-dt-col-deliverer.yui-dt-resizeable > div");
    for (let icon of courierIcon) {
      icon.style.width = "75px";
    }
  }, 4000);
};