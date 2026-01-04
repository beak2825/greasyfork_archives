// ==UserScript==
// @name     Twitter Move DM Tab
// @version  1
// @include  https://twitter.com*
// @grant    none
// @description This moves the little Twitter DM popup tab on the bottom right a little further to the left
// @license MIT
// @namespace https://greasyfork.org/users/856630
// @downloadURL https://update.greasyfork.org/scripts/437446/Twitter%20Move%20DM%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/437446/Twitter%20Move%20DM%20Tab.meta.js
// ==/UserScript==




var wait = setInterval(checkForElem,100)

function checkForElem(){
  var elem = document.querySelectorAll("[data-testid=\"DMDrawer\"]")
	if (elem.length != 0){
  	clearInterval(wait)
    elem[0].style.marginRight = "20vw"
  }
  
}
