// ==UserScript==
// @name         Singup Widgets form helper
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  A helper to fill development forms
// @author       Hubertokf
// @match        *://*/*
// @grant        none
// @grant		 GM_addStyle
// @grant		 GM_getValue
// @grant		 GM_setValue
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530379/Singup%20Widgets%20form%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/530379/Singup%20Widgets%20form%20helper.meta.js
// ==/UserScript==

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

setInterval(()=>{
    var account = document.getElementsByClassName('planne-widget-account')
 
    if (account?.length < 1) {
        return;
    }
 
    var source = document.getElementsByTagName('html')[0].innerHTML;
    var found = source.search("Criar conta");
 
    if (found === -1) {
        return;
    }

    if (!document.getElementById('form-helper-flag')) {
        const flag = document.createElement('div');
        flag.id = 'form-helper-flag';
        flag.style.display = 'none';
        document.body.appendChild(flag);
    } else {
        return;
    }
 
    var identityType = document.getElementsByName('identityType')[0]
    identityType.value = 'cpf'

    var firstName = document.getElementsByName('firstName')[0]
    firstName.value = 'Kaiser Filho'

    var lastName = document.getElementsByName('lastName')[0]
    lastName.value = 'Kaiser Filho'

    const code = generateRandomString(5)

    var email = document.getElementsByName('email')[0]
    email.value = `huberto.kaiser${code}@planne.com.br`

    var emailConfirmation = document.getElementsByName('emailConfirmation')[0]
    emailConfirmation.value = `huberto.kaiser${code}@planne.com.br`

    var identity = document.getElementsByName('identity')[0]
    identity.value = '83043969049'

    var zipCode = document.getElementsByName('zipCode')[0]
    zipCode.value = '96020045'

    var birthdate = document.getElementsByName('birthdate')[0]
    birthdate.value = '03/04/1991'

    var phone = document.getElementsByName('phone')[0]
    phone.value = '53981177468'

    var password = document.getElementsByName('password')[0]
    password.value = '12345678'

    var passwordConfirmation = document.getElementsByName('passwordConfirmation')[0]
    passwordConfirmation.value = '12345678'

    var agreesToTerms = document.getElementById('agreesToTerms')
    agreesToTerms.checked = true
}, 2000);