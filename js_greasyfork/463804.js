// ==UserScript==
// @name        Fix Gmail Priority Inbox
// @author      itsmejoeeey
// @description Update Gmail UI to visually separate priority inboxes.
// @homepageURL https://github.com/itsmejoeeey/userscript-fix-gmail-priority-inbox
// @supportURL  https://github.com/itsmejoeeey/userscript-fix-gmail-priority-inbox/issues
// @namespace   https://joeeey.com
// @license     MIT
// @version     1.0
//
// @match       https://mail.google.com/mail/u/*
// @downloadURL https://update.greasyfork.org/scripts/463804/Fix%20Gmail%20Priority%20Inbox.user.js
// @updateURL https://update.greasyfork.org/scripts/463804/Fix%20Gmail%20Priority%20Inbox.meta.js
// ==/UserScript==

function GM_checkAndApplyStyles()
{
  const hashRoute = window.location.hash;
  if(hashRoute === "#inbox")
  {
    // Remove parent background
    GM_addStyle(`
      .bkK > .nH {
        background-color: unset !important;
      }
    `);

    // Apply background to child elements
    GM_addStyle(`
      .ae4,
      .ae4.aDM.nH.oy8Mbf,
      .aeH,
      .aeJ .aeG {
        background-color: rgba(255,255,255,0.8) !important;
        overflow: hidden !important;
      }
    `)

    // Add separation between inbox sections (after the first one)
    GM_addStyle(`
      .ae4.aDM.nH.oy8Mbf:not(.aTP) {
          margin-top: 2rem !important;
      }
    `);

    // Prettify by adding rounded corners
    GM_addStyle(`
      .ae4.aDM.nH.oy8Mbf:not(.aTP) {
        border-top-left-radius: 16px !important;
        border-top-right-radius: 16px !important;
      }
    `);
  }
  else
  {
    GM_removeStyles();
  }
}

function GM_main()
{
  GM_checkAndApplyStyles()

  window.addEventListener('hashchange', (info) => {
    GM_checkAndApplyStyles()
  });
}

window.onload = function(){
  GM_main();
}


/*
 * Helpers
 */
// From https://stackoverflow.com/a/33176845/3213602
function GM_addStyle(css)
{
  const style = document.getElementById("GM_addStyleBy6156") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy6156";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

function GM_removeStyles()
{
  const style = document.getElementById("GM_addStyleBy6156")
  if(style) {
    style.remove();
  }
}
