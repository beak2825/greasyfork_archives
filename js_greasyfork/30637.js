// ==UserScript==
// @name         Subeta Closing
// @description  Makes restocking slightly easier.
// @version      1.4
// @author       Unknown
// @match        *://subeta.net/shop.php?shop*
// @grant        none
// @icon         https://subeta.net/favicon.ico
// @icon64       https://img.subeta.net/items/bottle_apothecary_02.gif
// @namespace https://greasyfork.org/users/133026
// @downloadURL https://update.greasyfork.org/scripts/30637/Subeta%20Closing.user.js
// @updateURL https://update.greasyfork.org/scripts/30637/Subeta%20Closing.meta.js
// ==/UserScript==
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



var content = document.body.textContent || document.body.innerText;
var hasText5 = content.indexOf("There are no items")!==-1;
var hasText4 = content.indexOf("is sold out")!==-1;
var hasText3 = content.indexOf(" been put in your items")!==-1;
var hasText2 = content.indexOf("Give everyone else a chance")!==-1;
var hasText = content.indexOf("has been added to your inventory")!==-1;
async function close_window() {
  if (hasText || hasText3) {
      await sleep(3160);
    close();
  }
}
async function close_windows() {
  if (hasText2 || hasText4) {
      await sleep(1);
    close();
  }
}
async function close_windows3() {
  if (hasText5) {
      await sleep(1);
    var shops = [36, 31, 28, 30, 32, 41, 11, 14, 34, 6, 29, 37, 16, 5, 19, 2, 22, 46, 49, 40,
                     24, 45, 26, 23, 12, 44, 27, 39, 42, 9, 21, 4, 17, 20, 47, 25],
            url = location.href.split("="),
            iNext = Math.floor(Math.random()*shops.length),//shops.indexOf(parseInt(url[1])) + 1,
            next = url[0] + "=" + shops[(iNext >= shops.length) ? 0 : iNext];
        document.location.href = next;
  }
}
close_window();
close_windows();
close_windows3();

// for(i in document.getElementsByTagName('form')) {
//	if(document.getElementsByTagName('form')[i].action.indexOf("/shop.php?") != -1) {
//		document.getElementsByTagName('form')[i].target = "_blank";
// 	}
// }


