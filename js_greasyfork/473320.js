// ==UserScript==
// @name        s-pankki focus tunnusluku
// @description selects and focuses on proxysite.com
// @namespace   spankkifocus
// @include  https://online.s-pankki.fi/ebank/auth/loginEbank.do
// @version  0.2
// @grant    none
// @icon         https://online.s-pankki.fi/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/473320/s-pankki%20focus%20tunnusluku.user.js
// @updateURL https://update.greasyfork.org/scripts/473320/s-pankki%20focus%20tunnusluku.meta.js
// ==/UserScript==

//let pincode = document.getElementById('pin-code')
let pincode = document.getElementById('tan')
console.log("pincode is " + pincode)

if (pincode != null) {
  console.log("set focus to field type " + pincode.type)
  pincode.focus()
}
