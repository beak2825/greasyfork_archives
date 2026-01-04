// ==UserScript==
// @name         Toothpaste Mail Helper
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/competition.php*
// @match       *.torn.com/messages.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/411241/Toothpaste%20Mail%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/411241/Toothpaste%20Mail%20Helper.meta.js
// ==/UserScript==

const mail_subject = 'TITLE'
const mail_content = '<p>testing testing</p><p>testing testing</p>'

GM_addStyle(`
li>i.elimination-team-logo.toothpaste {
  cursor: pointer;
}
`)


switch (document.location.pathname) {
  case '/competition.php':
    $( document ).ajaxComplete(function(event, jqXHR, ajaxObj) {
      if (ajaxObj.url.includes('/competition.php')) document.querySelectorAll('li>i.elimination-team-logo.toothpaste').forEach(i => addMailLink(i))
    })
    break
  case '/messages.php':
    if(document.location.hash) {
      document.addEventListener('click', (e) => {
        document.querySelector('input.subject').value = mail_subject
        document.querySelector('#mailcompose_ifr').contentWindow.document.querySelector('[data-id=mailcompose]').innerHTML = mail_content
      })
    }
    break
  default:
    console.log('locatoin:', document.location)
}

function addMailLink(i) {
  const userID = i.closest('UL').querySelector('a.user').href.split('XID=')[1]
  i.insertAdjacentHTML('beforebegin', `<a href="https://www.torn.com/messages.php#/p=compose&XID=${userID}" target="_blank"></a>`)
  i.parentElement.querySelector('a').appendChild(i)
}
