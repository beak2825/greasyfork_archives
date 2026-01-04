// ==UserScript==
// @name         BaseTao - Photo skipper
// @namespace    https://www.reddit.com/user/RobotOilInc
// @version      0.3
// @description  Adds some buttons so you can move around image pages.
// @author       RobotOilInc
// @match        https://new.basetao.com/best-taobao-agent-service/purchase/order_img/*.html
// @license      MIT
// @homepageURL  https://www.fashionreps.page/
// @grant        GM_xmlhttpRequest
// @connect      https://www.basetao.com
// @connect      https://basetao.com
// @run-at       document-end
// @icon         https://www.basetao.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/461823/BaseTao%20-%20Photo%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/461823/BaseTao%20-%20Photo%20skipper.meta.js
// ==/UserScript==

// jshint esversion: 8

// Global constants
const LOADING_IMAGE = 'data:image/gif;base64,R0lGODlhEAAQAPMAAP////r6+paWlr6+vnx8fIyMjOjo6NDQ0ISEhLa2tq6urvDw8MjIyODg4J6enqampiH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAAEAAQAAAETBDISau9NQjCiUxDYGmdhBCFkRUlcLCFOA3oNgXsQG2HRh0EAYWDIU6MGSSAR1G4ghRa7KjIUXCog6QzpRhYiC1HILsOEuJxGcNuTyIAIfkECQoAAAAsAAAAABAAEAAABGIQSGkQmzjLQkTTWDAgRGmAgMGVhAIESxZwBUMgSyAUATYQPIBg8OIQJwLCQbJkdjAlUCA6KfU0VEmyGWgenpNfcCAoEo6SmWtBYtCukxhAwQKeQAYWYgAHNZIFKBoMCHcTEQAh+QQJCgAAACwAAAAAEAAQAAAEWhDIOZejGDNysgyDQBAIGWRGMa7jgAVq0TUj0lEDUZxArvAU0a1nAAQOrsnIA1gqCZ6AUzI4nAxJwIEgyAQUhCQsjDmUCI1jDEhlrQrFV+ksGLApWwYz41jsIwAh+QQJCgAAACwAAAAAEAAQAAAEThDISau9IIQahiCEMGhCQxkFqBLFZ0pBWhzSkYIvMLAb/OGTBII2+QExSEBjuexhVgrKAZGgqKKTGGFgBc00Np71cVsVDJVo5ydyJt/wCAAh+QQJCgAAACwAAAAAEAAQAAAEWhDISau9OAxBiBjBtRRdSRTGpRRHeJBFOKWALAXkAKQNoSwWBgFRQAA4Q5DkgOwwhCXBYTJAdAQAopVhWSgIjR1gcLLVQrQbrBV4CcwSA8l0Alo0yA8cw+9TIgAh+QQJCgAAACwAAAAAEAAQAAAEWhDISau9WA5CxAhWMDDAwXGFQR0IgQRgWRBF7JyEQgXzIC2MFkc1MQkonMbAhyQ0Y5pBg0MREA4UwwnBWGhoUIAC55DwaAcQrIXATgyzE/bwCQ2sBGZmz7dEAAA7';
const MAX_ORDERS = 50;

(function() {
  'use strict';

  const PATHNAME = window.location.pathname;
  const ORDER_ID = Number(PATHNAME.substring(PATHNAME.lastIndexOf('/') + 1).replace('.html', ''));
  console.log("Currently on order", ORDER_ID);

  const titleElement = document.querySelector('h1.fs-3');

  const LEFT_BUTTON_CLASS = 'btn btn-left';
  const RIGHT_BUTTON_CLASS = 'btn btn-right';

  function createButton(content, className) {
    const button = document.createElement('button');
    button.className = className;
    button.innerHTML = content;
    return button;
  }

  const leftButton = createButton('<', LEFT_BUTTON_CLASS);
  const rightButton = createButton('>', RIGHT_BUTTON_CLASS);

  function setLoadingState(button) {
    const spinner = `<span class="spinner"><img src="${LOADING_IMAGE}" alt="Loading..."></span>`;
    button.innerHTML = spinner;
    button.disabled = true;
  }

  async function shouldRedirect(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
          const responseText = String(response.responseText);
          resolve(responseText.includes('Order image has become history is deleted') === false);
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  }

  async function tryRedirect(offset) {
    setLoadingState(offset > 0 ? rightButton : leftButton);
    for (let i = 1; i < MAX_ORDERS; i++) {
      const redirection = `https://new.basetao.com/best-taobao-agent-service/purchase/order_img/${offset > 0 ? ORDER_ID + i : ORDER_ID - i}.html`;
      if (await shouldRedirect(redirection)) {
        window.location = redirection;
        return;
      }

      console.log(`Could not redirect to ${redirection}, as item doesn't exist, retrying...`);
    }

    alert(`Tried going ${offset > 0 ? 'forward' : 'back'} ${Math.abs(offset)} orders, but to no avail`);
  }

  leftButton.addEventListener('click', () => tryRedirect(-1));
  rightButton.addEventListener('click', () => tryRedirect(1));

  titleElement.prepend(leftButton);
  titleElement.append(rightButton);
})();
