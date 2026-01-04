// ==UserScript==
// @name         Facebook autoclick
// @namespace    http://github.com/and3k5
// @version      2025-04-28
// @description  Automatic facebook poke. Clicks on poke back every second.
// @homepageURL  https://github.com/and3k5/auto-facebook-poke
// @supportURL   https://github.com/and3k5/auto-facebook-poke/issues
// @copyright    2025 And3k5
// @author       And3k5
// @match        https://www.facebook.com/pokes*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534272/Facebook%20autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/534272/Facebook%20autoclick.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const button = document
        .evaluate(
            "//body//*//span[text()[contains(.,'Pokes')]]",
            document.body,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        )
        .singleNodeValue.appendChild(document.createElement("button"));
    button.textContent = "_";
    button.type = "button";
    button.style.fontSize = "12pt";
    button.style.verticalAlign = "baseline";
    button.style.overflow = "visible";
    button.style.borderRadius = "50px";
    button.style.margin = "6px";
    button.style.marginLeft = "20px";
    button.style.cursor = "pointer";

    const spinner = button.appendChild(document.createElement("span"));
    spinner.textContent = "|";
    const animation = spinner.animate(
        [
            { transform: "rotate(0)" },
            { transform: "rotate(360deg)" },
        ],
        {
            duration: 1000,
            iterations: 1,
        }
    );

    let intervalId = null;
    const pokeBack = () =>
        document
            .evaluate(
                "//*[text()[contains(.,'Poke Back')]]",
                document.body,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            )
            .singleNodeValue?.click();
    const setActiveState = () => {
        button.childNodes[0].textContent = "Stop auto poke";
        spinner.style.display = "inline-block";
    };
    const start = () => {
        if (intervalId != null) return;
        intervalId = setInterval(() => {
            pokeBack();
            animation.currentTime = 0;
        }, 1000);
        setActiveState();
    };
    const setIdleState = () => {
        button.childNodes[0].textContent = "Start auto poke";
        spinner.style.display = "none";
    };
    const stop = () => {
        if (intervalId == null) return;
        clearInterval(intervalId);
        intervalId = null;
        setIdleState();
    };
    setIdleState();
    button.addEventListener("click", () => {
        if (intervalId == null) return start();
        else stop();
    });
})();
