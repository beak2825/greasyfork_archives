// ==UserScript==
// @name         TPM Notification Sound Disabler
// @version      1.0
// @description  A simple script that prevents the TPM notification sound
// @author       ASAP
// @match        https://tpm.gg/Match/*
// @grant        none
// @namespace https://greasyfork.org/users/1257201
// @downloadURL https://update.greasyfork.org/scripts/486556/TPM%20Notification%20Sound%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/486556/TPM%20Notification%20Sound%20Disabler.meta.js
// ==/UserScript==

(function() {
const { prototype } = HTMLMediaElement;
const { set: setter, get: getter } = Object.getOwnPropertyDescriptor(prototype, 'volume');
Object.defineProperty(prototype, 'volume', {
  get() {
    return getter.call(this);
  },
  set(arg) {
    const newArg = this.src.endsWith('/audio/Default.mp3')
    ? arg / 10
    : arg;
    setter.call(this, newArg);
  }
});
})();