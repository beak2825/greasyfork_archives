// ==UserScript==
// @name        Automatic login - magister.net
// @namespace   Violentmonkey Scripts
// @match       https://accounts.magister.net/account/login
// @grant       none
// @version     1.0
// @author      Not me
// @description 5/25/2021, 9:27:50 AM
// @downloadURL https://update.greasyfork.org/scripts/427000/Automatic%20login%20-%20magisternet.user.js
// @updateURL https://update.greasyfork.org/scripts/427000/Automatic%20login%20-%20magisternet.meta.js
// ==/UserScript==

username = "gebruikersnaam"
password = "wachtwoord"

function typeText (input, text, callback){
  let lastValue = input.value;
  input.value = text;
  let event = new Event('input', { bubbles: true });
  event.simulated = true;
  let tracker = input._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  input.dispatchEvent(event);
  
  var checkHandeld = setInterval (function () {
    if (input.value) {
      clearInterval(checkHandeld)
      callback()
    }
  }, 100)
}

var checkLogin = setInterval (function () {
  if (document.getElementById('username')){
    typeText(document.getElementById('username'), username, function(){
      document.getElementById("username_submit").click()

      var checkLoaded = setInterval (function (){
        if (document.getElementById("password")) {
            typeText(document.getElementById("password"), password, function(){
              document.getElementById("password_submit").click()
            })
          clearInterval(checkLoaded)
        }
      }, 100)
    })
    clearInterval(checkLogin)
  }
}, 100)