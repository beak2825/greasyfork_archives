// ==UserScript==
// @name        Ebay Money Converter
// @namespace   kunaifirestuff
// @description converts the monies
// @include     *ebay.*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15507/Ebay%20Money%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/15507/Ebay%20Money%20Converter.meta.js
// ==/UserScript==

var elements = document.getElementsByTagName("span")

prefix = "£"
rate = 439.702484 // weird money * rate = my money
mySuffix = " HUF"

for(var i = 0; i < elements.length; i++){
  if(elements[i].textContent.contains(prefix)){
    r = new RegExp("(.*)(" + prefix + ")([0-9\.,]*)(.*)").exec(elements[i].textContent)
    elements[i].textContent = r[1] + konvert(r[3]) + r[4]
  }
}

function konvert(money){
  return Math.ceil(money * rate).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + mySuffix
}