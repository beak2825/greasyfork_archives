// ==UserScript==
// @name          Anonimato
// @description   Um UserScript que tenta fazer com que você fique anonimo ao maximo na internet.
// @namespace     CowanNIMO
// @license       CowBas
// @version       1.0
// @author        Cowanbas
// @match         *://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529999/Anonimato.user.js
// @updateURL https://update.greasyfork.org/scripts/529999/Anonimato.meta.js
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

})();