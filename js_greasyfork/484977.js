// ==UserScript==
// @name         Tesla Voting Eastern Europe
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Vote for moldova
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.com
// @grant        none
//  @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484977/Tesla%20Voting%20Eastern%20Europe.user.js
// @updateURL https://update.greasyfork.org/scripts/484977/Tesla%20Voting%20Eastern%20Europe.meta.js
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
 
        document.getElementById("form-input-password").value = "TeslaModel3!"
      	document.getElementById("form-input-confirm-password").value = "TeslaModel3!"
        function setRandomEmail() {
    var names = ["Ion", "Maria", "Andrei", "Elena", "Alex", "Cristina", "Gheorghe", "David", "Ana", "Stefan", "Ioana",
    "Mihai", "Gabriela", "Daniel", "Mihaela", "Adrian", "Alina", "George", "Raluca", "Nicolae", "Oana",
    "Sorin", "Luminita", "Florin", "Diana", "Bogdan", "Simona", "Radu", "Irina", "Vasile", "Loredana",
    "Octavian", "Camelia", "Cosmin", "Carmen", "Liviu", "Laura", "Victor", "Alexandra", "Lucian", "Daniela",
    "Marian", "Monica", "Ionut", "Roxana", "Viorel", "Iulia", "Ciprian", "Andreea", "Dorel", "Teodora"]; // Add more Romanian names as desired
    var randomNumber = Math.floor(Math.random() * 100); // Generates a random number up to 10000
    var randomName = names[Math.floor(Math.random() * names.length)];
    var email = randomName.toLowerCase() + "_" + randomNumber + "@gmail.com"; // Creates the email string
    document.getElementById("form-input-email").value = email;
}
 
setRandomEmail(); // Call this function to set a random email
 
 
        document.getElementById("form-input-email").focus()
        document.getElementById("form-input-email").dispatchEvent(new KeyboardEvent('keypress', {'key':'h'}));
        document.getElementById("form-input-email").dispatchEvent(new KeyboardEvent('keydown', {'key':'e'}));
        document.getElementById("form-input-email").dispatchEvent(new KeyboardEvent('keyup', {'key':'y'}));
 
        document.getElementById('form-submit').click();
        clearInterval(intervalSecondStepReg)
      }
  }, 100);
 
 const smthWentWrong = setInterval(function() {
     ///teslaaccount/owner-xp/auth/callback?locale=ro-RO
      if (window.document.body.textContent.includes('Oops! Something went wrong.'))
      {
        window.location.replace("https://www.tesla.com/supercharger-voting");
        clearInterval(smthWentWrong)
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
              body: JSON.stringify({"reference_number":"85"}),
              headers: {
                  "Content-type": "application/json; charset=UTF-8"
              }
              });
              fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
                  method: "POST",
                  body: JSON.stringify({"reference_number":"150"}),
                  headers: {
                      "Content-type": "application/json; charset=UTF-8"
                 }
              });
              fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
                  method: "POST",
                  body: JSON.stringify({"reference_number":"147"}),
                  headers: {
                      "Content-type": "application/json; charset=UTF-8"
                  }
              });
              fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
                  method: "POST",
                  body: JSON.stringify({"reference_number":"64"}),
                  headers: {
                      "Content-type": "application/json; charset=UTF-8"
                  }
              });
              fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
                  method: "POST",
                  body: JSON.stringify({"reference_number":"89"}),
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
           document.getElementById("form-input-first_name").value = "Ion"
           document.getElementById("form-input-last_name").value = "Vasile"
 
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
    function setRandomName() {
    var names = ["Ion", "Ionut", "Ghita", "Maria", "Ana-maria", "Anamaria", "Andrei", "Elena", "Alex", "Cristina", "David", "Ana", "Stefan", "Ioana",
    "Mihai", "Gabriela", "Daniel", "Mihaela", "Antonia", "Ionel", "Bogdana", "Cristinel", "Iosif", "Mihaita", "Marius", "Andu", "Adriana", "Adrian", "Alina", "George", "Raluca", "Nicolae", "Oana",
    "Sorin", "Luminița", "Florin", "Diana", "Bogdan", "Simona", "Radu", "Irina", "Vasile", "Loredana",
    "Octavian", "Camelia", "Cosmin", "Carmen", "Liviu", "Laura", "Victor", "Alexandru", "Alexandra", "Lucian", "Daniela",
    "Marian", "Monica", "Ionuț", "Roxana", "Viorel", "Iulia", "Ciprian", "Andreea", "Dorel", "Teodora"]; // Add more names as desired
    var randomName = names[Math.floor(Math.random() * names.length)];
    document.getElementById("form-input-first_name").value = randomName;
}
 
setRandomName(); // Call this function to set a random name
 
		function setRandomLastName() {
    var lastNames = ["Popescu", "Ionescu", "Filip", "Stancu", "Badea", "Anghel", "Alexa", "Loghin", "Nistor", "Dumitrescu", "Stan", "Radu", "Ilie", "Stanciu", "Moldovan", "Vasile", "Dumitru", "Constantin", "Matei", "Munteanu", "Rusu", "Gheorghe", "Stoica", "Dinu", "Pop", "Dobre", "Popa", "Marin", "Tudor", "Barbu"]; // Add more Romanian last names as desired
    var randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    document.getElementById("form-input-last_name").value = randomLastName;
}
 
setRandomLastName(); // Call this function to set a random last name
 
 
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
          body: JSON.stringify({"reference_number":"85"}),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      });
      fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
          method: "POST",
          body: JSON.stringify({"reference_number":"150"}),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
         }
      });
      fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
          method: "POST",
          body: JSON.stringify({"reference_number":"147"}),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      });
      fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
          method: "POST",
          body: JSON.stringify({"reference_number":"64"}),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      });
 
      fetch("https://www.tesla.com/cua-api/supercharger-voting/set-user-preference", {
          method: "POST",
          body: JSON.stringify({"reference_number":"89"}),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      });
      location.reload();
  }
}, false);