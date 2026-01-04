// ==UserScript==
// @name         AutoPriceSubmitter
// @name:en      AutoPriceSubmitter
// @namespace    https://zelenka.guru/m1ch4elx/
// @version      1.1
// @description  Auto repeat request for price change if the price is 2x lower
// @description:en Auto repeat request for price change if the price is 2x lower
// @author       @M1ch4elx
// @match        https://lzt.market/*/
// @match        https://lolz.market/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lzt.market
// @license @M1ch4elx
// @downloadURL https://update.greasyfork.org/scripts/490480/AutoPriceSubmitter.user.js
// @updateURL https://update.greasyfork.org/scripts/490480/AutoPriceSubmitter.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function send_again(value) {
    let price_elem = $(".value.Editable");
    let request_url = price_elem.data("save-url");
    price_elem.text(value);
    fetch(request_url, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-ajax-referer":
          "https://zelenka.guru/?tab=mythreads&order=last_post_date&direction=desc",
        "x-requested-with": "XMLHttpRequest",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `value=${value}&key=price`,
      method: "POST",
    });
  }

  function find_error_window() {
    const errorElement = document.querySelector(".errorDetails");
    if (errorElement) {
      const elem = document.querySelector(".close.OverlayCloser");
      elem.click();
      return true;
    }
    return false;
  }

  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (
        mutation.addedNodes.length &&
        mutation.target.className == "value Editable"
      ) {
        $(mutation.addedNodes[0]).on("submit", function (event) {
          let value = $(".textCtrl.extraLarge").val();
          event.preventDefault();
          let counter = 0;
          let interval = setInterval(function () {
            let result = find_error_window();
            if (result) {
              send_again(value);
              clearInterval(interval);
            }
            if (counter == 10) {
              clearInterval(interval);
            }
            counter++;
          }, 1000);
        });
      }
    }
  });
  const config = {
    childList: true,
    subtree: true,
  };
  observer.observe(document.body, config);
})();
