// ==UserScript==
// @name         Hidden Gikos
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  This script makes all the hidden gikopoi characters visible in the selection screen and removes the message indicating that they are secret. このスクリプトは、隠されていたgikopoiのキャラクターをすべて選択画面で見えるようにし、秘密であることを示すメッセージを削除します。
// @author       dinghy
// @author       roris
// @match        *://gikopoipoi.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426917/Hidden%20Gikos.user.js
// @updateURL https://update.greasyfork.org/scripts/426917/Hidden%20Gikos.meta.js
// ==/UserScript==

(function () {
  console.log("Hidden Gikos Enabled");
  'use strict';
  var elems = document.getElementsByTagName('label');
  for (var i = 0; i < elems.length; i++) {
    if (elems[i].style.display == 'none') {
      elems[i].style.display = 'block';
      elems[i].style.fontSize = 0;
    }
  }

  const loginButton = document.getElementById('login-button');
  loginButton.addEventListener('click', () => {
    // allow some time for vue to render the children
    setTimeout(() => {
      const henshinButton = document.createElement('button');
      if (window.vueApp._container._vnode.component.proxy.getSiteArea().id == 'gen')
      {
      console.log("Server: " + window.vueApp._container._vnode.component.proxy.getSiteArea().id)
      henshinButton.textContent = '#変身';
          }
        else {
            henshinButton.textContent = '#henshin';
        }
      henshinButton.setAttribute('type', 'button');

      const sendButton = document.getElementById('send-button');
      henshinButton.addEventListener('click', () => {
        const input = document.getElementById('input-textbox');
        input.value = '#henshin';
        sendButton.click();
      });

      const buttons = document.getElementsByClassName('fa-cogs');
      const settingsButton = buttons.length ? buttons[0] : null;
      settingsButton.parentElement.appendChild(henshinButton);
    }, 50);
  });
})();