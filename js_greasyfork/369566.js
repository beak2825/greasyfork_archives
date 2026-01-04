// ==UserScript==
// @name         Steam auto key activator
// @description  Active steam Key
// @version      0.1
// @author       Zeper
// @match        https://store.steampowered.com/account/registerkey*
// @namespace https://greasyfork.org/users/191481
// @downloadURL https://update.greasyfork.org/scripts/369566/Steam%20auto%20key%20activator.user.js
// @updateURL https://update.greasyfork.org/scripts/369566/Steam%20auto%20key%20activator.meta.js
// ==/UserScript==
function register(){if(product_key.value.length>0){document.getElementsByName("accept_ssa")["0"].checked=true;RegisterProductKey();}}setInterval(register(), 100);
