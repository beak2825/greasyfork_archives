// ==UserScript==
// @name        proxysite.com autoselect + focus
// @description selects and focuses on proxysite.com
// @namespace   proxysitefocus
// @version  1.2
// @grant    none
// @include  https://www.proxysite.com/
// @icon        https://www.google.com/s2/favicons?sz=64&domain=proxysite.com
// @downloadURL https://update.greasyfork.org/scripts/473319/proxysitecom%20autoselect%20%2B%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/473319/proxysitecom%20autoselect%20%2B%20focus.meta.js
// ==/UserScript==

//   old webproxy.to stuff
// document.getElementById('input').focus()
// console.log("Greasemonkey: focus given to input field :).")

let serverSelection = document.getElementById("serverSelect")
serverSelection.selectedIndex = 0
console.log("Greasemonkey: selected the value " + serverSelection.value)
document.getElementsByName("d")[0].focus()
console.log("Greasemonkey: focus given to input field :).")