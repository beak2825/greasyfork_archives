// ==UserScript==
// @name         BraveStealth ™ (Chrome-Only Spoof)
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Hides all Brave browser traces and spoofs key browser properties to mimic Google Chrome for anti-detection and fingerprinting evasion.
// @author       Seed Taha
// @match        *://*/*
// @icon         https://i.postimg.cc/X7xRSKgh/1447-02-09-07-28-05-4d711534.jpg
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544475/BraveStealth%20%E2%84%A2%20%28Chrome-Only%20Spoof%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544475/BraveStealth%20%E2%84%A2%20%28Chrome-Only%20Spoof%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const fakeBrands = [
    { brand: "Google Chrome", version: "138" },
    { brand: "Not.A/Brand", version: "99" }
  ];

  const fakeHigh = {
    fullVersionList: fakeBrands.map(b => ({ brand: b.brand, version: b.version })),
    platform: "Windows",
    platformVersion: "10.0",
    architecture: "x86",
    model: "",
    mobile: false
  };

  function overrideProperty(parent, prop, getValue) {
    Object.defineProperty(parent, prop, {
      get: getValue,
      configurable: false,
      enumerable: true
    });
  }

  // 1. Hide navigator.brave
  overrideProperty(navigator, "brave", () => undefined);

  // 2. Override userAgentData
  const uaDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, "userAgentData") ||
                       Object.getOwnPropertyDescriptor(window.navigator, "userAgentData") ||
                       { configurable: true };

  overrideProperty(Navigator.prototype, "userAgentData", () => ({
    get highEntropyValues() {
      return fakeHigh;
    },
    brands: fakeBrands,
    mobile: false,
    platform: "Windows",
    getHighEntropyValues: async hints => {
      const out = {};
      hints.forEach(h => {
        if (h in fakeHigh) out[h] = fakeHigh[h];
      });
      return out;
    }
  }));

  // 3. Override navigator.platform, languages, appVersion
  overrideProperty(Navigator.prototype, "platform", () => "Win32");
  overrideProperty(Navigator.prototype, "languages", () => ["en-US", "en"]);
  overrideProperty(Navigator.prototype, "appVersion", () => navigator.userAgent);

  // 4. Spoof WebGL Vendor/Renderer
  const glProto = WebGLRenderingContext.prototype;
  const origGetParam = glProto.getParameter;
  glProto.getParameter = function(p) {
    if (p === this.UNMASKED_VENDOR_WEBGL) return "Intel Inc.";
    if (p === this.UNMASKED_RENDERER_WEBGL)
      return "ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)";
    return origGetParam.call(this, p);
  };

  // 5. Add minor noise to Canvas toDataURL
  const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function(...args) {
    const ctx = this.getContext("2d");
    if (ctx) {
      const w = this.width | 0, h = this.height | 0;
      if (w * h < 100_000) {
        try {
          const imageData = ctx.getImageData(0, 0, w, 1);
          const d = imageData.data;
          for (let i = 0; i < d.length; i += 4) {
            const noise = Math.floor(Math.random() * 3) - 1;
            d[i] = d[i] + noise;
          }
          ctx.putImageData(imageData, 0, 0);
        } catch (e) { }
      }
    }
    return origToDataURL.apply(this, args);
  };

  // 6. Remove plugins and mimeTypes
  overrideProperty(Navigator.prototype, "plugins", () => []);
  overrideProperty(Navigator.prototype, "mimeTypes", () => []);

})();
