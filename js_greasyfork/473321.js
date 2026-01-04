// ==UserScript==
// @name        s-pankki kirjaudu, jos tunnukset
// @description selects and focuses on proxysite.com
// @namespace   spankkikirjaudu
// @include  https://online.s-pankki.fi/ebank/auth/initLogin.do?language=1
// @version  0.2
// @grant    none
// @icon         https://online.s-pankki.fi/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/473321/s-pankki%20kirjaudu%2C%20jos%20tunnukset.user.js
// @updateURL https://update.greasyfork.org/scripts/473321/s-pankki%20kirjaudu%2C%20jos%20tunnukset.meta.js
// ==/UserScript==

// https://online.s-pankki.fi/ebank/auth/initLogin.do?language=1#PIN_TAN


function trySubmit() {

  let hash = window.location.hash.substring(1);

  if (hash == "ENCAP") {
    console.log("redirecting to '#PIN_TAN'...")

    document.location = 'https://online.s-pankki.fi/ebank/auth/initLogin.do?language=1#PIN_TAN';

  } else if (hash == "PIN_TAN") {

    let user = document.getElementById('username').value
    let pass = document.getElementById('password').value

    console.log("User was " + user)
    console.log("Pass was " + pass)

    if (user && pass) {
      let elements = document.getElementsByName("btn_log_in");
      console.log(elements[0])
      if (elements[0]) {
        // prevent multiple clicks
        trySubmit.timesCalled = 1000
        elements[0].click()
      }
    }
  }

  // create "static" variable
  trySubmit.timesCalled = trySubmit.timesCalled || 1;

  if (trySubmit.timesCalled <= 10) {
    setTimeout(trySubmit, 300)
  }
  trySubmit.timesCalled++
}

setTimeout(trySubmit, 300)