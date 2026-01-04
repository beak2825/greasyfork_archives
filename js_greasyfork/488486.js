// ==UserScript==
// @name         Youtube Collapsible Top Bar
// @version      2024-02-27
// @description  Allows you to hide/show the masthead with a dropdown button
// @author       alanpq
// @match        *://*.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/1267725
// @downloadURL https://update.greasyfork.org/scripts/488486/Youtube%20Collapsible%20Top%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/488486/Youtube%20Collapsible%20Top%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* **************** CONFIGURATION ************************ */

    ////// VISUALS
    /** Should the masthead be transparent? */
    const TRANSPARENT_MASTHEAD = false;
    /** Should the dropdown button be transparent? */
    const TRANSPARENT_DROPDOWN = false;


    ////// MISC
    /** Should the masthead start open?
        NOTE: This only applies on page load.
     */
    const START_OPEN = true;

    /** How long to wait (in ms) after the mouse stops moving, before hiding the dropdown button.
        Defaults to 2000 (2 seconds)
    */
    const HIDE_DELAY = 2000;
    /** Should the dropdown button hide instantly, when the mouse leaves the window? */
    const INSTANT_HIDE_ON_OUT = true;


    /* ************* END OF CONFIGURATION ******************** */

    const baseStyle = `
:root {
  --ytd-toolbar-height: 0px;
  --ytd-masthead-height: 0px;
}
#masthead-container #masthead {
  transition: margin-top 0.2s ease-in-out;
  margin-top: 0;
}
#masthead-container:not([data-open=true]) #masthead {
  margin-top: -56px;
}

#masthead-container[data-open=true] #dropToggle-asdlk2 svg {
  transform: rotate(180deg);
}

#dropToggle-asdlk2 {
  position: absolute;
  display: inline-block !important;
/*   background: var(--ytd-searchbox-background); */
  background: ${TRANSPARENT_DROPDOWN ? "rgba(0, 0, 0, .14)" : "var(--yt-spec-base-background)"};
  backdrop-filter: blur(50px);
  border-radius: 0 0 10px 10px;
  outline: none;
  border: none;
  margin: 0;
  padding: 0;
  right: 10px;
  top: 100%;
  width: 40px;
  height: 25px;
  z-index: 100;
  color: white;
  fill: #ffffff63;

  transition: opacity 0.1s ease-in-out;
  opacity: 0;
}

#dropToggle-asdlk2 svg {
  transform: rotate(0deg);
  transition: transform 0.1s ease-in-out;
}

#dropToggle-asdlk2[data-show=true] {
  opacity: 1;
}

#masthead-container[data-open=true] #dropToggle-asdlk2 {
  opacity: 1;
}
`;

    const transparentStyle = `
#masthead {
  --ytd-searchbox-background: rgba(0, 0, 0, .19);
  --ytd-searchbox-legacy-border-color: rgba(0,0,0,0);
  --ytd-searchbox-legacy-button-border-color: rgba(0,0,0,0);
}

#masthead #background {
  background: transparent;
  backdrop-filter: blur(50px);
}
    `;

    const style = document.createElement('style');
    const checkEnabled = () => {
        style.disabled = window.location.pathname != "/watch";
    }
    style.type = 'text/css';
    style.innerText = baseStyle + (TRANSPARENT_MASTHEAD ? transparentStyle : "");
    checkEnabled();
    const o = new MutationObserver((e) => {
        if(e.length > 0) {
            for(const m of e) {
                if (m.attributeName == "hidden") {
                    checkEnabled();
                }
            }
        }
    });
    for(const e of ["popstate", "pageshow", "hashchange"]) {
        window.addEventListener(e, checkEnabled);
    }

    document.head.appendChild(style);

    const try_observe = () => {
        const progress = document.querySelector("yt-page-navigation-progress");
        if(progress) o.observe(progress, {attributes: true});
        else setTimeout(try_observe, 100);
    }
    try_observe();

    const init = (masthead_c) => {
        let timer = null;
        masthead_c.dataset.open = START_OPEN;
        const masthead = document.getElementById("masthead");

        const dropToggle = document.createElement("button");
        dropToggle.style = "display: none;";
        dropToggle.id = "dropToggle-asdlk2";
        dropToggle.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 16 16" width="16" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><path d="M3.35 4.97 8 9.62 12.65 4.97l.71.71L8 11.03l-5.35-5.35.7-.71z"></path></svg>
    `;
        dropToggle.addEventListener("click", (e) => {
            const open = masthead_c.dataset.open == "true";
            masthead_c.dataset.open = !open;
            e.preventDefault();
        });

        document.addEventListener("mouseout", () => {
            if(!INSTANT_HIDE_ON_OUT) return;
            dropToggle.dataset.show = "false";
            if (timer) clearTimeout(timer);
        });

        document.addEventListener("mousemove", () => {
            dropToggle.dataset.show = "true";
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                dropToggle.dataset.show = "false";
            }, HIDE_DELAY);
        });
        masthead.appendChild(dropToggle);
    }
    const try_init = () => {
        let masthead_c = document.getElementById("masthead-container");
        if(masthead_c) init(masthead_c);
        else setTimeout(try_init, 100);
    };
    try_init();
})();