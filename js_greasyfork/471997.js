// ==UserScript==
// @name        ELTE Neptun TOTP
// @namespace   Violentmonkey Scripts
// @match       https://neptun.elte.hu/Account/Login2FA
// @grant       none
// @version     1.3
// @license     MIT
// @author      Domonkos Lezsák
// @description Handles ELTE Neptun TOTP 2FA authentication. The user just has to click a button and not bother with an authenticator app, as long as uses the same browser. Setup instructions: Just go to "New TOTP pairing".
// @supportURL  https://gist.github.com/lezsakdomi/d453f881a06ab668dd94d6ac65637776
// @downloadURL https://update.greasyfork.org/scripts/471997/ELTE%20Neptun%20TOTP.user.js
// @updateURL https://update.greasyfork.org/scripts/471997/ELTE%20Neptun%20TOTP.meta.js
// ==/UserScript==
async function generateTotp() {
  if (!window.getToken) {
    await import('https://unpkg.com/jssha@3.3.0/dist/sha.js');
    const _requireBackup = window.require;
    const _moduleBackup = window.module;
    window.require = (pkg) => {
      switch(pkg) {
        case 'jssha': return window.jsSHA;
        default: throw new Error("No module called " + pkg);
      }
    }
    const module = window.module = {exports: {}}
    await import('https://unpkg.com/totp-generator@0.0.14/index.js');
    window.require = _requireBackup;
    window.module = _moduleBackup;
    window.getToken = module.exports;
  }

  return window.getToken(localStorage.getItem('totp:secret'));
}

(async () => {
  switch (location.pathname) {
    case '/Account/Login2FA': {
      const phase = document.querySelector('input[name="Phase"]').value;
      document.querySelector('main > h2').insertAdjacentElement('afterend', document.createElement('pre')).innerText = phase;
      switch (phase) {
        case 'TOTPPreparation': {
          document.querySelector('main form > div.form-group > button[type="submit"]').parentElement.insertAdjacentElement('beforebegin', document.createElement('p')).innerHTML = "Note: You have the TOTP userscript installed, it will substitue Microsoft Authenticatior for you. <b>Just click <i>Next</i></b>"
        } break

        case 'TOTPPairing': {
          const key = document.querySelector('main form > div.form-group > button[type="submit"]').parentElement.previousElementSibling.innerText.match(/[A-Z0-9]+\s*$/)[0];
          if (confirm("Found TOTP pairing key " + key + ".\nDo you want to save the key to this browser?")) {
            localStorage.setItem('totp:secret', key);
            document.querySelector('main form').action += "?autofill_totp=1"
            document.querySelector('main form > div.form-group > button[type="submit"]').click()
          }
        } break

        case 'TOTPPairingCheck': {
          if ((new URLSearchParams(location.search)).get('autofill_totp')) {
            document.querySelector('main form input#TOTPCode').value = await generateTotp()
            document.querySelector('main form > div.form-group > button[type="submit"]').click()
          }
        } break

        case 'RequestTOTP': {
          const $submitButton = document.querySelector('main form > div.form-group > button.btn-primary[type="submit"]');
          async function autofillAndLogin() {
            document.querySelector('main form input#TOTPCode').value = await generateTotp()
            $submitButton.click()
          }

          if ((new URLSearchParams(location.search)).get('autofill_totp')) {
            await autofillAndLogin();
          } else if (localStorage.getItem('totp:secret')) {
            {
              const $btn = $submitButton.insertAdjacentElement('afterend', document.createElement('button'))
              $btn.classList.add('btn')
              $btn.classList.add('btn-secondary')
              $btn.style.marginLeft = '1em'
              $btn.addEventListener('click', (evt) => {
                localStorage.removeItem('totp:secret')
                location.reload();
              })
              $btn.innerText = "Clear TOTP secret from this browser"
            }
            {
              const $btn = $submitButton.insertAdjacentElement('afterend', document.createElement('button'))
              $btn.classList.add('btn')
              $btn.classList.add('btn-primary')
              $btn.style.marginLeft = '1em'
              $btn.addEventListener('click', (evt) => {
                evt.preventDefault();
                autofillAndLogin();
              })
              $btn.innerText = "Autofill and log in"
            }
            {
              $submitButton.classList.add('btn-secondary')
              $submitButton.classList.remove('btn-primary')
            }
          }
        }
      }
    } break

    case '/Account/Login': {

    }
  }
})()
