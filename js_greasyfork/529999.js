// ==UserScript==
// @name          Cowanimato
// @description   Um UserScript que tenta fazer com que você fique anonimo ao maximo na internet.
// @namespace     CowanNIMO
// @license       GPL-3.0
// @version       2.0
// @author        Cowanbas
// @match         *://*/*
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/529999/Cowanimato.user.js
// @updateURL https://update.greasyfork.org/scripts/529999/Cowanimato.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Bloqueia cookies de rastreamento
  Object.defineProperty(document, 'cookie', {
    get: () => "",
    set: () => { },
    configurable: true
  });

  setInterval(() => {
    try {
      Object.defineProperty(document, 'cookie', {
        get: () => "",
        set: () => { },
        configurable: true
      });
    } catch (e) { }
  }, 1000);

  // Bloqueia Referer (evita que sites saibam de onde você veio)
  Object.defineProperty(document, 'referrer', { get: () => '', configurable: true });

  // Altera User-Agent e outras propriedades para evitar fingerprinting
  const fakeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36';

  Object.defineProperty(navigator, 'userAgent', { get: () => fakeUA, configurable: true });
  Object.defineProperty(navigator, 'platform', { get: () => 'Win32', configurable: true });
  Object.defineProperty(navigator, 'language', { get: () => 'en-US', configurable: true });
  Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: true });
  Object.defineProperty(navigator, 'plugins', { get: () => [], configurable: true });
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4, configurable: true });

  // Impede fingerprinting básico (WebGL, Canvas, Audio)
  const blockFingerprinting = () => {
    const protectCanvas = (ctx) => {
      if (!ctx) return;
      const originalGetImageData = ctx.getImageData;
      ctx.getImageData = function (x, y, w, h) {
        const data = originalGetImageData.call(this, x, y, w, h);
        for (let i = 0; i < data.data.length; i += 4) {
          data.data[i] ^= 0xFF;
        }
        return data;
      };
    };
    protectCanvas(CanvasRenderingContext2D.prototype);

    // Bloqueia WebGL Fingerprinting
    const fakeWebGL = (gl) => {
      if (!gl) return;
      const originalGetParameter = gl.getParameter;
      gl.getParameter = function (param) {
        if (param === 37445) return 'Intel OpenGL Fake';
        if (param === 37446) return 'Fake GPU Model';
        return originalGetParameter.call(gl, param);
      };
    };
    fakeWebGL(WebGLRenderingContext.prototype);
    fakeWebGL(WebGL2RenderingContext.prototype);
  };
  blockFingerprinting();

  // Função utilitária para redefinir propriedades de objetos (usada nas novas proteções)
  function redefine(obj, prop, value) {
    try {
      Object.defineProperty(obj, prop, { get: () => value, set: () => { }, configurable: true });
    } catch (e) { }
  }

  // Acrescenta propriedades extras ao navigator
  redefine(navigator, 'languages', ['en-US', 'en']);
  redefine(navigator, 'deviceMemory', 8);

  // Canvas extra - Protege toDataURL e toBlob
  if (window.CanvasRenderingContext2D) {
    const ctxProto = CanvasRenderingContext2D.prototype;
    if (!ctxProto._anonimato_patched) {
      const scramble = str => str.split('').reverse().join('');
      const origToDataURL = ctxProto.toDataURL;
      ctxProto.toDataURL = function () {
        return scramble(origToDataURL.apply(this, arguments));
      };
      const origToBlob = ctxProto.toBlob;
      ctxProto.toBlob = function (callback, ...args) {
        origToBlob.call(this, function (blob) {
          callback(blob);
        }, ...args);
      };
      ctxProto._anonimato_patched = true;
    }
  }

  // Protege AudioContext (fingerprinting)
  if (window.OfflineAudioContext) {
    const origStartRendering = OfflineAudioContext.prototype.startRendering;
    OfflineAudioContext.prototype.startRendering = function () {
      this.oncomplete = null;
      return origStartRendering.apply(this, arguments);
    };
  }

  // Remove ou neutraliza APIs de rastreamento
  const blockAPIs = [
    'deviceorientation', 'devicemotion', 'geolocation', 'clipboard', 'bluetooth'
  ];
  blockAPIs.forEach(api => {
    if (navigator[api]) redefine(navigator, api, undefined);
  });

  // Remove permissões de rastreamento (Geolocalização, etc)
  if (navigator.permissions) {
    const originalQuery = navigator.permissions.query;
    navigator.permissions.query = function (parameters) {
      if (parameters.name === 'geolocation') {
        return Promise.resolve({ state: 'denied' });
      }
      return originalQuery.apply(this, arguments);
    };
  }

  // Tenta bloquear WebRTC (vaza IP local)
  if (window.RTCPeerConnection) {
    window.RTCPeerConnection = function () {
      throw new Error('WebRTC blocked');
    };
  }

  // Limpa localStorage e sessionStorage
  try { localStorage.clear(); } catch (e) { }
  try { sessionStorage.clear(); } catch (e) { }

  // Remove Service Workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }

  // Remove event listeners suspeitos
  window.addEventListener = function () { };
  document.addEventListener = function () { };

  // Remove métodos de fingerprinting conhecidos
  if (window.Intl) window.Intl = undefined;
  if (window.screen) {
    redefine(window.screen, 'width', 1920);
    redefine(window.screen, 'height', 1080);
    redefine(window.screen, 'colorDepth', 24);
  }

})();
