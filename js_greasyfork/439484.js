// ==UserScript==
// @name        Auto close VPN connection message
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/auto-close-vpn-connection-message
// @include     *127.0.0.1*
// @exclude     none
// @version     1.0.1
// @description:en	Auto closes the AWS VPN connection message
// @grant    		none
// @description Auto closes the AWS VPN connection message
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439484/Auto%20close%20VPN%20connection%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/439484/Auto%20close%20VPN%20connection%20message.meta.js
// ==/UserScript==

function closeTab(targetElement) {
  const newElement = document.createElement('a');
  newElement.href = "javascript:window.open('','_self').close();";
  newElement.innerText = 'Close';
  targetElement.appendChild(newElement);
  newElement.click();
}

function checkAndCloseTab() {
  const bodyElement = document.getElementsByTagName('BODY')[0];
  if (bodyElement.innerText.includes('You may close this window at any time')) {
    closeTab(bodyElement);
  }
}

function worker() {
  try {
    checkAndCloseTab();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

setInterval(worker, 500);
