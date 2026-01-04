// ==UserScript==
// @name         Gumroad Region Lock Bypass on free items
// @namespace    DisableGumroadRegionLock
// @version      0.3
// @description  Disable gumroad.com Region Lock
// @author       Samu
// @match        https://*.gumroad.com/l/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/377585/Gumroad%20Region%20Lock%20Bypass%20on%20free%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/377585/Gumroad%20Region%20Lock%20Bypass%20on%20free%20items.meta.js
// ==/UserScript==

(function() {
  'use strict';

  setTimeout(init, 1000);

  function init() {

    var warningButton = document.querySelector("article.product section div.warning[role='status']");
    var productId = document.head.querySelector("meta[content][property='product:retailer_item_id']");

    if (warningButton != undefined && productId?.content) {
      createCustomButton(productId.content, warningButton);
    } else {
      setTimeout(init, 100);
    }

  }

  function createCustomButton(id, container) {

    var url = "https://" + window.location.host + "/purchases";
    var button = document.createElement("button");
    button.classList.add("primary");
    button.textContent = "View Content";

    var errorMsg = "UserScript (Gumroad Region Lock Bypass): Could not fetch contentUrl, script might need update";

    button.addEventListener("click", () => {
      fetchContentUrl(url, id)
        .then(contentUrl => {
          if (contentUrl) {
            window.open(contentUrl, '_blank');
          } else {
            alert(errorMsg);
          }
        })
        .catch(e => alert(errorMsg));
    });

    container.innerHTML = "";
    container.appendChild(button);
  }

  function fetchContentUrl(url, id) {
    var randomString = (Math.random() + 1).toString(36).substring(2);
    return fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        'line_items[0][permalink]': id,
        'line_items[0][perceived_price_cents]': +document.head.querySelector("meta[content][property='product:price:amount']").content,
        'email': `${randomString}@${randomString}.com`,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res?.success) {
          var content = res["line_items"][""];
          if (content?.success) {
            return content["content_url"];
          }
        }
        return null;
      });
  }

  //GM_addStyle(".i-want-this-container { display: block !important; }");
})();