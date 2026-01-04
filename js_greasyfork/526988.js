// ==UserScript==
// @name         Cursor Button for Chatium
// @version      2025-01-06
// @author       Dmitry Space
// @description  Replace VSCode button to cursor
// @match        *://*/chtm/s/ide/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getscript.ru
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/878636
// @downloadURL https://update.greasyfork.org/scripts/526988/Cursor%20Button%20for%20Chatium.user.js
// @updateURL https://update.greasyfork.org/scripts/526988/Cursor%20Button%20for%20Chatium.meta.js
// ==/UserScript==

(function() {
    'use strict';

let waitVSCodeBtn = setInterval(()=>{
  let $VSCodeBtn = $('button:contains(VSCode)');
  if($VSCodeBtn.length) {
    clearInterval(waitVSCodeBtn);
    $VSCodeBtn.parent().css({'display': 'flex', 'gap': '10px'})
    let $CursorBtn = $VSCodeBtn.clone().text('Открыть в Cursor')
      .on('click', ()=>{openCursor()})
    $VSCodeBtn.after($CursorBtn);
    $('body').append(`
      <style>
        .ButtonBlock__button {
          font-size: 12px;
        }
      </style>
    `)
  }
},50);

function openCursor(){
  fetch("/chtm/s/login/extension/open", {
    "headers": {
      "content-type": "application/json;charset=UTF-8",
      "x-chatium-ide-csrf-token": getCSRFToken(),
    },
    "referrer": window.location.href,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  })
  .then((response) => response.json())
  .then((data) => {
      if(data.success && data.appAction?.openInExternalApp) {
        window.open(data.appAction.url.replace('vscode://', 'cursor://'));
      }
  });

  function getCSRFToken() {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const text = scripts[i].textContent || scripts[i].innerHTML;
      if (text.includes('window.x_chatium_ide_csrf_token')) {
        const match = text.match(/window\.x_chatium_ide_csrf_token\s*=\s*'([^']+)'/);
        if (match) {
          return match[1];
        }
      }
    }
    return null;
  }
}
})();