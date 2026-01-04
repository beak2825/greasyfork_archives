// ==UserScript==
// @name        CodeWhisperer auth
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/codewhisperer-auth
// @include     *device.sso.us-east-1.amazonaws.com*
// @include     *awsapps.com/start*
// @exclude     none
// @version     1.1.0
// @description:en	Auto-selects and pastes (if possible) the CodeWhisperer auth code
// @grant    		none
// @description Auto-selects and pastes (if possible) the CodeWhisperer auth code
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467716/CodeWhisperer%20auth.user.js
// @updateURL https://update.greasyfork.org/scripts/467716/CodeWhisperer%20auth.meta.js
// ==/UserScript==

function closeTab(targetElement) {
  const existingButton = document.getElementById(
    'script-added-auto-close-button',
  );
  if (existingButton) {
    existingButton.click();
    return;
  }

  const newElement = document.createElement('a');
  newElement.id = 'script-added-auto-close-button';
  newElement.href = "javascript:window.open('','_self').close();";
  newElement.innerText = 'Close';
  targetElement.appendChild(newElement);
  newElement.click();
}

function doTask() {
  const codeInputElement = document.getElementById('verification_code');
  const buttons = [...document.getElementsByTagName('BUTTON')];
  let pasted = false;
  if (codeInputElement) {
    codeInputElement.focus();
    try {
      // get clipboard content
      const clipboardText = window.clipboardData.getData('Text');
      codeInputElement.value = clipboardText;
      pasted = true;
    } catch (e) {
      console.log('Code could not be pasted');
    }
  }
  const [confirmAndContinueButton] = buttons.filter((b) => b.innerText === "Confirm and continue")
  confirmAndContinueButton?.click();
  const [nextButton] = buttons.filter((b) => b.innerText === 'Next');
  if (pasted || codeInputElement?.value?.length === 9) {
    nextButton?.click();
  }
  const [allowButton] = buttons.filter((b) => b.innerText === 'Allow');
  allowButton?.click();
  if (document.body.innerText.includes('You can close this window')) {
    closeTab(document.getElementsByClassName('awsui-signin-success')[0]);
  }
}

function worker() {
  try {
    doTask();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

setInterval(worker, 200);
