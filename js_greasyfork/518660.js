// ==UserScript==
// @name         evolve-game-speed
// @namespace    https://github.com/julesferreira/evolve-game-speed
// @version      1.2
// @description  override the default game speed
// @author       jules
// @license      MIT
// @match        https://pmotschmann.github.io/Evolve/
// @homepage     https://github.com/julesferreira/evolve-game-speed
// @supportURL   https://github.com/julesferreira/evolve-game-speed/issues
// @icon         https://pmotschmann.github.io/Evolve/evolved.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/518660/evolve-game-speed.user.js
// @updateURL https://update.greasyfork.org/scripts/518660/evolve-game-speed.meta.js
// ==/UserScript==

/*
simplified version of Wushigejiajia's script: https://greasyfork.org/en/scripts/483805-%E8%BF%9B%E5%8C%96-evolve-%E8%87%AA%E5%8A%A8%E5%BB%BA%E9%80%A0-%E5%90%AB%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F
*/

(() => {
  "use strict";

  const getValue = (key, defaultValue) => {
    let value = JSON.parse(window.localStorage.getItem(key));
    return value || defaultValue;
  };

  const setValue = (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  const initialSpeed = getValue("customSpeed", 1);

  const script = document.createElement("script");
  script.textContent = `
        (() => {
            let customSpeed = ${initialSpeed};
            let fromScript = false;
            let vueMethod;

            const oldPost = Worker.prototype.postMessage;

            Worker.prototype.postMessage = function(...args) {
                if (args[0].period) {
                    args[0].period = args[0].period / customSpeed;
                }

                oldPost.apply(this, args);

                if (fromScript) {
                    setTimeout(() => {
                        if (vueMethod) {
                            vueMethod.pause();
                        }
                    }, 0);
                    fromScript = false;
                }
            };

            const hijackWorker = () => {
                if (vueMethod && !vueMethod._data.s.pause) {
                    fromScript = true;
                    vueMethod.pause();
                }
            };

            const updateSpeedDisplay = (speedSpan) => {
                speedSpan.textContent = \`speed ×\${customSpeed}\`;
            };

            let timer = setInterval(() => {
                const versionLog = document.getElementById("versionLog");
                if (!versionLog) {
                    return;
                }
                clearInterval(timer);

                const speedSpan = document.createElement("span");
                speedSpan.id = "customSpeed";
                speedSpan.className = "version";
                speedSpan.style.cursor = "pointer";
                updateSpeedDisplay(speedSpan);

                speedSpan.addEventListener("click", () => {
                    const newSpeed = Math.max(
                        Number(prompt("multiply default game speed by:", customSpeed)) || 1,
                        1
                    );
                    customSpeed = newSpeed;
                    document.dispatchEvent(new CustomEvent('speedChanged', { detail: newSpeed }));
                    updateSpeedDisplay(speedSpan);
                    hijackWorker();
                });

                versionLog.parentNode.insertBefore(speedSpan, versionLog);
                vueMethod = document.querySelector("#topBar").__vue__;
                hijackWorker();
            }, 100);
        })();
    `;

  document.documentElement.appendChild(script);
  script.remove();

  document.addEventListener("speedChanged", (event) => {
    setValue("customSpeed", event.detail);
  });
})();
