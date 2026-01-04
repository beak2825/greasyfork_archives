// ==UserScript==
// @name         Tesla Voting RO
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Tesla Voting Romania.
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.com
// @grant        none
//  @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478948/Tesla%20Voting%20RO.user.js
// @updateURL https://update.greasyfork.org/scripts/478948/Tesla%20Voting%20RO.meta.js
// ==/UserScript==

const firstPage = setInterval(function() {
      if (window.location.href == 'https://www.tesla.com/ro_RO')
      {
        window.location.replace("https://auth.tesla.com/ro_ro/oauth2/v1/register?redirect_uri=https%3A%2F%2Fwww.tesla.com%2Fteslaaccount%2Fowner-xp%2Fauth%2Fcallback&response_type=code&client_id=ownership&scope=offline_access+openid+ou_code+email+phone&audience=https%3A%2F%2Fownership.tesla.com%2F&locale=ro-RO&set_defaults=true");
        clearInterval(firstPage)
      }
  }, 100);


 const intervalSecondStepReg = setInterval(function() {
      if (document.contains(document.getElementById("form-input-password") && document.getElementById("form-input-confirm-password")))
      {

        document.getElementById("form-input-password").value = "Blabla123..2"
      	document.getElementById("form-input-confirm-password").value = "Blabla123..2"
        document.getElementById("form-input-email").value = Math.round(Math.random()*1009825000)+"@email.com"

        document.getElementById("form-input-email").focus()
        document.getElementById("form-input-email").dispatchEvent(new KeyboardEvent('keypress', {'key':'h'}));
        document.getElementById("form-input-email").dispatchEvent(new KeyboardEvent('keydown', {'key':'e'}));
        document.getElementById("form-input-email").dispatchEvent(new KeyboardEvent('keyup', {'key':'y'}));

        document.getElementById('form-submit').click();
        clearInterval(intervalSecondStepReg)
      }
  }, 100);


 const intervalAccount = setInterval(function() {
      if (document.contains(document.getElementById('teslaaccount')))
      {
        window.location.replace("https://www.tesla.com/ro_ro/cua-api/supercharger-voting/login");
        clearInterval(intervalAccount)
      }
  }, 100);


 const intervalAccount2nd = setInterval(function() {
      if (document.contains(document.getElementsByClassName('tds-btn login-to-vote')[0]))
      {
        window.location.replace("https://www.tesla.com/ro_ro/cua-api/supercharger-voting/login");
        clearInterval(intervalAccount2nd)
      }
  }, 100);


 const intervalLogOut = setInterval(function() {
      if (document.contains(document.getElementsByClassName('leaderboard-votes-remaining')[0]))
      {
         if(document.getElementsByClassName('leaderboard-votes-remaining')[0].innerHTML == '0 voturi rămase')
         {
           window.location.replace("https://www.tesla.com/ro_ro/teslaaccount/owner-xp/auth/logout?redirect=true&locale=ro_RO");
         	clearInterval(intervalLogOut)
         }
        if(document.getElementsByClassName('leaderboard-votes-remaining')[0].innerHTML == '5 voturi rămase')
         {
               fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
              method: "POST",
              body: JSON.stringify({"reference_number":"165"}),
              headers: {
                  "Content-type": "application/json; charset=UTF-8"
              }
              });
              fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
                  method: "POST",
                  body: JSON.stringify({"reference_number":"163"}),
                  headers: {
                      "Content-type": "application/json; charset=UTF-8"
                 }
              });
              fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
                  method: "POST",
                  body: JSON.stringify({"reference_number":"173"}),
                  headers: {
                      "Content-type": "application/json; charset=UTF-8"
                  }
              });
              fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
                  method: "POST",
                  body: JSON.stringify({"reference_number":"166"}),
                  headers: {
                      "Content-type": "application/json; charset=UTF-8"
                  }
              });
              fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
                  method: "POST",
                  body: JSON.stringify({"reference_number":"158"}),
                  headers: {
                      "Content-type": "application/json; charset=UTF-8"
                  }
              });
             clearInterval(intervalLogOut)
             location.reload();
         }
      }
  }, 100);

var manual = false;
var x = 1;
 const intervalCaptcha = setInterval(function() {
      if (document.contains(document.getElementById("captcha")))
      {

       document.getElementById("captcha").addEventListener('focusout', (event) => {
           if(x===1 && manual ===false)
           {
           document.getElementById("form-input-first_name").value = "My First Name"
           document.getElementById("form-input-last_name").value = "My Last Name"

           document.activeElement.blur();
           document.getElementById("captcha").focus()
           document.getElementById("captcha").dispatchEvent(new KeyboardEvent('keypress', {'key':'h'}));
           document.getElementById("captcha").dispatchEvent(new KeyboardEvent('keydown', {'key':'e'}));
           document.getElementById("captcha").dispatchEvent(new KeyboardEvent('keyup', {'key':'y'}));
           document.getElementById('form-step1-next').disabled = false;
           document.getElementById('form-step1-next').click();
           x=2;
           }
       });
             clearInterval(intervalCaptcha)
      }
  }, 100);

document.addEventListener('keydown', (event) => {
  var name = event.key;
  var code = event.code;
   if (name === 'Control') {
      // Do nothing.
      return;
    }

  if(event.ctrlKey && name == 'z')
  {
    window.location.replace("https://auth.tesla.com/ro_ro/oauth2/v1/register?redirect_uri=https%3A%2F%2Fwww.tesla.com%2Fteslaaccount%2Fowner-xp%2Fauth%2Fcallback&response_type=code&client_id=ownership&scope=offline_access+openid+ou_code+email+phone&audience=https%3A%2F%2Fownership.tesla.com%2F&locale=ro-RO&set_defaults=true");
  }
  if(event.ctrlKey && name == 'x')
  {
      manual = true;
    document.getElementById("form-input-first_name").value = "My First Name"
		document.getElementById("form-input-last_name").value = "My Last Name"

    document.activeElement.blur();
    document.getElementById("captcha").focus()
    document.getElementById("captcha").dispatchEvent(new KeyboardEvent('keypress', {'key':'h'}));
    document.getElementById("captcha").dispatchEvent(new KeyboardEvent('keydown', {'key':'e'}));
    document.getElementById("captcha").dispatchEvent(new KeyboardEvent('keyup', {'key':'y'}));
    document.getElementById('form-step1-next').disabled = false;
    document.getElementById('form-step1-next').click();
  }
  if(event.ctrlKey && name == 'v')
  {
      fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
          method: "POST",
          body: JSON.stringify({"reference_number":"165"}),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      });
      fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
          method: "POST",
          body: JSON.stringify({"reference_number":"163"}),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
         }
      });
      fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
          method: "POST",
          body: JSON.stringify({"reference_number":"173"}),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      });
      fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
          method: "POST",
          body: JSON.stringify({"reference_number":"59"}),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      });

      fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
          method: "POST",
          body: JSON.stringify({"reference_number":"310"}),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      });
      location.reload();
  }
}, false);