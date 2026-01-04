// ==UserScript==
// @name        Internet Roadtrip Anti-Marco
// @namespace   http://tampermonkey.net/
// @version     0.1.2.1
// @description Removes Marco options from IRT
// @author      LoG42
// @license     MIT
// @match       https://neal.fun/internet-roadtrip/
// @run-at      document-start
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/543944/Internet%20Roadtrip%20Anti-Marco.user.js
// @updateURL https://update.greasyfork.org/scripts/543944/Internet%20Roadtrip%20Anti-Marco.meta.js
// ==/UserScript==

// type hints
// import IRF from 'internet-roadtrip-framework';

(async () => {
    if (!IRF.isInternetRoadtrip) return;

    const containerVDOM = await IRF.vdom.container;
    const optionsBody = await IRF.dom.options;

    let justSaidIt = false;

    containerVDOM.state.updateData = new Proxy(containerVDOM.state.updateData, {
        apply: (target,thisArgs,args) => {
            let options = optionsBody.getElementsByClassName('option');
            let saidHere = false;
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                if (option.querySelector('.option-text') && option.querySelector('.option-text').textContent.trim() === "Marco Tedus") {
                    option.style.display = 'none';
                    if (!justSaidIt && !saidHere) {
                        console.log(`It's ${new Date().toString()}, and there's a Marco option, which means it's time to VAPORIZE IT`);
                    }
                    saidHere = true;
                }
            }
            justSaidIt = saidHere;
            return Reflect.apply(target, thisArgs, args);
        }
    })
})();