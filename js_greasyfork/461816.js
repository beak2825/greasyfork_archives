// ==UserScript==
// @name            Remove Glassdoor Paywall
// @icon https://www.glassdoor.com/app/static/img/mobile/icons/touch-icon-57.png
// @description     Hide Glasdoor paywall belt from page navigation and reenable scroll.
// @version         1.1.4
// @namespace       http://www.greasyfork.org
// @include        	http*://*glassdoor.*
// @include   *://glassdoor.com/*
// @downloadURL https://update.greasyfork.org/scripts/461816/Remove%20Glassdoor%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/461816/Remove%20Glassdoor%20Paywall.meta.js
// ==/UserScript==


const runScript = () => {
    const overlay = document.getElementById('HardsellOverlay');

    if (!overlay) {
        clearInterval(interval);
        return;
    }

    document.getElementsByTagName("body")[0].style.position = "static";

    overlay.remove();
    document.getElementsByTagName("body")[0].style.overflow = "scroll";
    const style = document.createElement('style');
    style.innerHTML = `
      #LoginModal {
        display: none!important;
      }
    `;
    document.head.appendChild(style);
    window.addEventListener("scroll", function (event) {
      event.stopPropagation();
    }, true);
}

runScript();

const interval = setInterval(runScript, 200);