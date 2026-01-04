// ==UserScript==
// @name        Kill drag,swipe gestures and enable selection of text
// @namespace   nostrum
// @match       https://epaper.bostonglobe.com/*
// @grant       GM_addStyle
// @version     1.0
// @author      Refael Ackermann<me@refack.com>
// @description 2/6/2025, 9:53:22 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526218/Kill%20drag%2Cswipe%20gestures%20and%20enable%20selection%20of%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/526218/Kill%20drag%2Cswipe%20gestures%20and%20enable%20selection%20of%20text.meta.js
// ==/UserScript==
'use strict';


GM_addStyle(`
  div {
    -webkit-user-select: text !important;
  }
`);


// The Argorithm is:
// 1. trap temporary value for window['Ext'] to capture 'blink' function
// 2. proxy window.Ext waiting for 'defaultSetupConfig'
// 3. kludge 'defaultSetupConfig.eventPublishers.touchGesture.recognizers'
// 4. replace proxy with actual target

// We need to act like a regular value and return undefined, until we are `set`
Object.defineProperty(unsafeWindow, "Ext", { configurable: true, set: extPropertySetter });

function extPropertySetter(tempExtValue) {
  // Just this one thing to handle; capturing definition of `blink`, then we disapear;
  Object.defineProperty(tempExtValue, "blink", { configurable: true, set: blinkPropertySetter });

  delete unsafeWindow.Ext;
  unsafeWindow.Ext = new Proxy(extKernel, { set: extProxySetter });;

  return true;
}

function blinkPropertySetter(blinkFunc) {
  extKernel.blink = blinkFunc;
}

const extKernel = new Object();

function extProxySetter(target, prop, value) {
  if (prop == 'defaultSetupConfig') {
    kludgeRecognizers(value.eventPublishers.touchGesture.recognizers)

    // We kludged what we wanted, so we go poof;
    delete unsafeWindow.Ext;
    unsafeWindow.Ext = extKernel;
  }
  target[prop] = value;
  return true;
}

function kludgeRecognizers(config) {
  const necessaryRecognizers = new Set(['doubleTap', 'tap']);
  for (const k in config) {
    if (!necessaryRecognizers.has(k))
      delete config[k];
  }
}
