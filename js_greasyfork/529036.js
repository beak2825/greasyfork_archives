// ==UserScript==
// @name        Hide Street View Road Names
// @namespace   Violentmonkey Scripts
// @match       *://www.google.com/maps/embed/v1/streetview*
// @match       *://openguessr.com/*
// @grant       none
// @version     1.3
// @author      Evan Boehs
// @description Useful for guessr style games
// @license     MIT
// @resource    script https://maps.gstatic.com/maps-api-v3/embed/js/60/2/init_embed.js
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/529036/Hide%20Street%20View%20Road%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/529036/Hide%20Street%20View%20Road%20Names.meta.js
// ==/UserScript==

(function () {
  const targetScript = "init_embed.js";
  // Attempt to prevent original script from loading
  if (typeof Element !== "undefined" && Element.prototype) {
    const originalAppChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
      if (arguments[0].src && arguments[0].src.includes(targetScript)) {
        return arguments[0];
      }
      return originalAppChild.apply(this, arguments);
    };
  }

  const embedPreload = document.querySelector(`link[href*="${targetScript}"]`);

  if (embedPreload) {
    embedPreload.parentNode.removeChild(embedPreload);

    const modifiedScript = GM_getResourceText("script").replace(
      '};b.dir="";',
      '};b.dir="";a.showRoadLabels=false;console.log("Successful Hijack");'
    );
    window.addEventListener("load", function () {
      const int = setInterval(() => {
        if (!window.google) {
          console.warn('window.google not defined despite load event.')
        }
        const newScript = document.createElement("script");
        newScript.textContent = modifiedScript;
        document.body.appendChild(newScript);
        clearInterval(int)
      },50)
    });
  }
})();
