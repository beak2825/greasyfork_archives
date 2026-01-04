// ==UserScript==
// @name         Diep.io Glow Theme
// @namespace    http://tampermonkey.net/LIGMABALLS
// @version      3
// @description  lol
// @author       shlong#2873
// @match        *://diep.io/
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/430254/Diepio%20Glow%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/430254/Diepio%20Glow%20Theme.meta.js
// ==/UserScript==

(() => {
    "use strict";
    const proxied = CanvasRenderingContext2D.prototype;
    const canvas = document.getElementById("canvas"),
          ctx = canvas.getContext("2d");

    window = unsafeWindow;

    proxied.fillRect = new Proxy(proxied.fillRect, {
        apply(type, _this, args) {
            if (["#8efffb",
                 "#71ccc8",
                 "#a4fffb",
                 "#b4ff8e",
                 "#90cc71",
                 "#c3ffa4",
                 "#ff8e8e",
                 "#cc7171",
                 "#ffa4a4",
                 "#ffeb8e",
                 "#ccbc71",
                 "#ffefa4",
                 "#8eb2ff",
                 "#718ecc",
                 "#a4c1ff",
                 "#b58eff",
                 "#9071cc",
                 "#c3a4ff",
                 "#fb8eff",
                 "#c871cc",
                 "#fba4ff",
                 "#fdcdac",
                 "#caa489",
                 "#fdd7bc",
                ].includes(_this.fillStyle)) {
                _this.fillStyle = "transparent";
            }
            type.apply(_this, args);
        },
    });


    proxied.fillRect = new Proxy(proxied.fillRect, {
        apply(type, _this, args) {
            if (_this.fillStyle == "#cdcdcd") {
                _this.fillStyle = "#1f1f1f";
            }
            return type.apply(_this, args);
        },
    });

    proxied.stroke = new Proxy(proxied.stroke, {
        apply(type, _this, args) {
            _this.lineWidth = 3.5;
            _this.shadowColor = _this.strokeStyle;
            _this.shadowBlur = 13.5;
            return type.apply(_this, args);
        },
    });

    proxied.fill = new Proxy(proxied.fill, {
        apply(type, _this, args) {
            if (_this.fillStyle == "#cdcdcd") {
                _this.fillStyle = "#36393f";
            }
            _this.strokeStyle = _this.fillStyle;
            _this.stroke();
            _this.fillStyle = "transparent";
            return type.apply(_this, args);
        },
    });
})();