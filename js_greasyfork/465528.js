// ==UserScript==
// @name         TGX | Deshabilitar Byfron
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  Deshabilitar byfron de roblox
// @author       HamstaGang (V3RM)
// @match        *://*.roblox.com/*
// @match        *://roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license      MIT
// @noframes
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/465528/TGX%20%7C%20Deshabilitar%20Byfron.user.js
// @updateURL https://update.greasyfork.org/scripts/465528/TGX%20%7C%20Deshabilitar%20Byfron.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  while (typeof Roblox === 'undefined' || typeof Roblox.ProtocolHandlerClientInterface === 'undefined') {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  try {
    const ProtocolHandlerClientInterface = Roblox.ProtocolHandlerClientInterface;
    Object.defineProperty(ProtocolHandlerClientInterface, 'playerChannel', {
      value: 'ZLIVE',
      writable: false
    });
    Object.defineProperty(ProtocolHandlerClientInterface, 'channel', {
      value: 'ZLIVE',
      writable: false
    });
    Object.defineProperty(ProtocolHandlerClientInterface, 'studioChannel', {
      value: '',
      writable: false
    });
    
   
    
    
      
      console.log('TGX | Byfron desactivado (seguro)');

  } catch (error) {
    alert(error);
  }
})();
