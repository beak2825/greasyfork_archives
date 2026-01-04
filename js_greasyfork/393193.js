// ==UserScript==
// @name		Booru Show hidden CARDS
// @description:en	Automatic display of hidden CARDS，remove AD
// @description:zh-CN	自动显示被隐藏的卡片,隐藏掉广告
// @version     0.0.1
// @include     http*://*.booru.org/index.php*
// @name:en     Booru Show hidden CARDS
// @name:zh-CN  Booru隐藏卡片显示
// @namespace https://greasyfork.org/users/405441
// @description Automatic display of hidden CARDS，remove AD
// @downloadURL https://update.greasyfork.org/scripts/393193/Booru%20Show%20hidden%20CARDS.user.js
// @updateURL https://update.greasyfork.org/scripts/393193/Booru%20Show%20hidden%20CARDS.meta.js
// ==/UserScript==

 showHideIgnored('0','pi'); return false;
   var ad1 =  document.querySelector("#post-list > div.content > div > center");if(ad1!=null)ad1.style.display="none";
   var ad2 =  document.querySelector("#post-list > div.content > div > div.divTable");if(ad2!=null)ad2.style.display="none";
   var ad3 = document.querySelector("body > center > div:nth-child(1)");if(ad3!=null)ad3.style.display="none";
   var ad4 = document.querySelector("body > center > div:nth-child(2)");if(ad4!=null)ad4.style.display="none";
   var ad5 =  document.querySelector("body > center > div:nth-child(3)");if(ad5!=null)ad5.style.display="none";