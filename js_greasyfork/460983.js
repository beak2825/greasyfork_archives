// ==UserScript==
// @name        Gog Do not bother with stupid bot
// @namespace   NotStupid
// @match       https://support.gog.com/hc/en-us/requests/new
// @grant       none
// @version     1.0
// @author      LiefLayer
// @description 14/12/2022, 17:01:33
// @downloadURL https://update.greasyfork.org/scripts/460983/Gog%20Do%20not%20bother%20with%20stupid%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/460983/Gog%20Do%20not%20bother%20with%20stupid%20bot.meta.js
// ==/UserScript==
document.querySelector('div[data-default-form]').setAttribute('style', 'display:inline !important');
document.querySelector('div[data-chat-wrap]').style.display='none';
document.getElementsByClassName('row clearfix')[0].classList.remove('is-hidden');
document.getElementsByClassName('post-form-message')[0].classList.remove('is-hidden');
document.getElementsByClassName('new-request-form')[0].classList.remove('is-hidden');