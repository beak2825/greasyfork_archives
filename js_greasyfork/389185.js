
// ==UserScript==
// @name           FinCrawler
// @description    Look Above
// @author         Capital Media LLC
// @include        http://https://www.redfin.com
// @version        1.2
// @namespace https://greasyfork.org/users/330955
// @downloadURL https://update.greasyfork.org/scripts/389185/FinCrawler.user.js
// @updateURL https://update.greasyfork.org/scripts/389185/FinCrawler.meta.js
// ==/UserScript==




var cityStateZip = document.querySelectorAll(".address.inline-block").item(HTMLContentElement).innerText;
var sold = document.querySelectorAll("div.home-sash-container.large").item(HTMLContentElement).innerText;
var findAgent = document.querySelectorAll("div.agent-basic-details.font-color-gray-dark").item(HTMLContentElement).innerText;
var keyInfo = cityStateZip + " " + "|" + " " + sold + " " + "|" + " " + findAgent;
function thisProperty() {
  alert(keyInfo);
}
thisProperty();