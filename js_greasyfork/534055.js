// ==UserScript==
// @name         Drift.io Crate Opener
// @namespace    https://greasyfork.org/en/users/1462379-3lectr0n-nj
// @version      V1
// @description  Let the script open all your crates while watching it(if you want to),rather than breaking ur fingers. Enjoy!
// @author       3lectr0N!nj@
// @match        https://drift.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drift.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534055/Driftio%20Crate%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/534055/Driftio%20Crate%20Opener.meta.js
// ==/UserScript==
let t = 1
const crate = window.crate = {
openall(){
    setTimeout(() => {
     const cselt = "gOcOyMdf2AutWVy_1_Xr "
     document.getElementsByClassName(cselt)[0].click()
    },t )
    setTimeout(() => {
     const opcr = "VWYQMoyTvRvkDsmkeCaQ   oUNyBxqmLpE4HIQT6WpA"
     document.getElementsByClassName(opcr)[0].click()
    },t)
    setTimeout(() => {
     const claim = "VWYQMoyTvRvkDsmkeCaQ   Qcld8QuUkixtNmrv6LgL"
   document.getElementsByClassName(claim)[0].click()
    },t)
    setTimeout(() => {
        crate.openall()
    },t )
}
}