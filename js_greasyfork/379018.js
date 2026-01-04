// ==UserScript==
// @name         Number of rows in Polyglot
// @version      0.1
// @description  Just what it says on the tin
// @author       Gandalf
// @match        https://localization.google.com/polyglot
// @grant        none
// @namespace https://greasyfork.org/users/166154
// @downloadURL https://update.greasyfork.org/scripts/379018/Number%20of%20rows%20in%20Polyglot.user.js
// @updateURL https://update.greasyfork.org/scripts/379018/Number%20of%20rows%20in%20Polyglot.meta.js
// ==/UserScript==

var list = document.querySelector('div[data-smallest-page-size] > div > div[role="listbox"] > div[role="presentation"] > div:nth-child(1)');
var fivehundred = '<div class="MocG8c B9C6Gd Se8HVc LMgvRb" jsname="wQNmvb" jsaction="" data-value="500" aria-selected="false" tabindex="-1" aria-describedby="Dqp0Ae"><div class="kRoyt MbhUzd ziS7vd" jsname="ksKsZd" style="top: 17px; left: 45.9531px; width: 64px; height: 64px;"></div><content class="vRMGwf oJeWuf">500</content></div>'
var thousand = '<div class="MocG8c B9C6Gd Se8HVc LMgvRb" jsname="wQNmvb" jsaction="" data-value="1000" aria-selected="false" tabindex="-1" aria-describedby="Dqp0Ae"><div class="kRoyt MbhUzd ziS7vd" jsname="ksKsZd" style="top: 17px; left: 45.9531px; width: 64px; height: 64px;"></div><content class="vRMGwf oJeWuf">1000</content></div>'
var fivethousand = '<div class="MocG8c B9C6Gd Se8HVc LMgvRb" jsname="wQNmvb" jsaction="" data-value="5000" aria-selected="false" tabindex="-1" aria-describedby="Dqp0Ae"><div class="kRoyt MbhUzd ziS7vd" jsname="ksKsZd" style="top: 17px; left: 45.9531px; width: 64px; height: 64px;"></div><content class="vRMGwf oJeWuf">5000</content></div>'
list.childNodes[0].insertAdjacentHTML("afterend",fivehundred);
list.childNodes[0].insertAdjacentHTML("afterend",thousand);
list.childNodes[0].insertAdjacentHTML("afterend",fivethousand);
