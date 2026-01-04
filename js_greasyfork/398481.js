// ==UserScript==
// @name         CDA Charter Grades Autologin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script will automatically sign you into the CDA Charter grade portal.
// @author       Matthew Barrett
// @match        https://www.cdacharter.org/onlinegrades/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398481/CDA%20Charter%20Grades%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/398481/CDA%20Charter%20Grades%20Autologin.meta.js
// ==/UserScript==

var email = localStorage.getItem("email")
var pass = localStorage.getItem("pass")

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function login() {
 document.getElementById("email").value = email
document.getElementById("email").onchange()
await sleep(200)
document.getElementsByName('cdacapinnum')[0].value = document.getElementsByTagName("b")[0].innerHTML
document.getElementsByName('cdacapass')[0].value = pass
completelogin()
}
var alreadyRun = localStorage.getItem("alreadyRun") || false

if ( ! alreadyRun) {
    localStorage.setItem("alreadyRun",true)

    email = window.prompt("Enter your email: ")
    localStorage.setItem("email", email)

    pass = window.prompt("Enter your password: ")
    localStorage.setItem("pass", pass)
    login()
} else {
 login()
}
