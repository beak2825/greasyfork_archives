// ==UserScript==
// @name AutoEnter Amount
// @author Tyler Durden
// @description  auto enter the price shopkeep asks for
// @locale none
// @match http://www.neopets.com/haggle.phtml?obj_info_id=*
// @version 0.0.1.20200418104658
// @namespace https://greasyfork.org/users/521385
// @downloadURL https://update.greasyfork.org/scripts/401315/AutoEnter%20Amount.user.js
// @updateURL https://update.greasyfork.org/scripts/401315/AutoEnter%20Amount.meta.js
// ==/UserScript==

document.getElementsByName('current_offer')[0].value = document.getElementById("shopkeeper_makes_deal").firstElementChild.innerText.replace(/\D/g, "")