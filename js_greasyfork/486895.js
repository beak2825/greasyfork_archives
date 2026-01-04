// ==UserScript==
// @name        Freshdesk Enhancement
// @scriptURL   https://greasyfork.org/en/scripts/486895-freshdesk-enhancement
// @namespace   Violentmonkey Scripts
// @match       https://*.freshdesk.com/a/tickets/*
// @grant       none
// @version     1.5
// @author      GorvGoyl
// @supportURL  https://github.com/gorvGoyl/
// @description add buttons: open user's stripe account, mixpanel page
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486895/Freshdesk%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/486895/Freshdesk%20Enhancement.meta.js
// ==/UserScript==
async function init() {
  console.log("adding buttons");
  const existingButton = await getElement(
    'button[data-test-actions="tktDelete"]'
  );
  console.log("got reference btn");
  addStripeBtn(existingButton);
  addMixpanelBtn(existingButton);
  copyEmailBtn(existingButton);
  
  const styles = `.ticket_note>div>.gmail_quote>blockquote.gmail_quote {
    max-height: 200px;
    overflow: auto;
    background: #f5f5f4;
    border-radius: 6px;
}`;
  addCSS(styles);
}

function addStripeBtn(existingButton) {
  const id = "stripeAccountBtn";

  const btn = document.getElementById(id);

  if (btn) return;

  const newButton = document.createElement("button");
  newButton.id = id;
  newButton.innerHTML = "Stripe";

  newButton.style.border = "1px solid gray";
  newButton.style.padding = "4px 8px";
  newButton.style.borderRadius = "4px";
  newButton.style.margin = "0px 4px";

  newButton.addEventListener("click", openStripeAccount);

  newButton.setAttribute("title", "Open Stripe Account");

  existingButton.parentNode.insertBefore(newButton, existingButton.nextSibling);
}

function addMixpanelBtn(existingButton) {
  const id = "mixpanelUserPageBtn";

  const btn = document.getElementById(id);

  if (btn) return;

  const newButton = document.createElement("button");
  newButton.id = id;
  newButton.innerHTML = "Mixpanel";

  newButton.style.border = "1px solid gray";
  newButton.style.padding = "4px 8px";
  newButton.style.borderRadius = "4px";
  newButton.style.margin = "0px 4px";

  newButton.addEventListener("click", openMixpanelPage);

  newButton.setAttribute("title", "Open mixpanel users page");

  existingButton.parentNode.insertBefore(newButton, existingButton.nextSibling);
}

function copyEmailBtn(existingButton) {
  const id = "copyEmailBtn";

  const btn = document.getElementById(id);

  if (btn) return;

  const newButton = document.createElement("button");
  newButton.id = id;
  newButton.innerHTML = "Copy Email";

  newButton.style.border = "1px solid gray";
  newButton.style.padding = "4px 8px";
  newButton.style.borderRadius = "4px";
  newButton.style.margin = "0px 4px";

  newButton.addEventListener("click", copyEmail);

  newButton.setAttribute("title", "Copy email");

  existingButton.parentNode.insertBefore(newButton, existingButton.nextSibling);
}

async function openStripeAccount(e) {
  console.log("opening stripe account");
  e.preventDefault();

  const email = parseEmail();
  showToast("email copied: " + email);

  const url =
    `https://dashboard.stripe.com/search?query=` + encodeURIComponent(email);

  window.open(url, "stripeWindow");
}

async function copyEmail(e) {
  e.preventDefault();

  const email = parseEmail();

  await navigator.clipboard.writeText(email);

  showToast("email copied: " + email);
}

async function openMixpanelPage(e) {
  console.log("opening mixpanel page...");
  e.preventDefault();

  await copyEmail(e);

  const url = `https://mixpanel.com/project/2952645/view/3474349/app/users#CRgQ4fCX6zKj`;

  window.open(url, "mixpanelWindow");
}

function parseEmail() {
  const email = document
    .querySelector(
      "div.info-details-content.text__content.text--semibold._ar_redact_"
    )
    .innerText.trim();
  console.log("email", email);

  return email;
}
window.addEventListener("urlchange", function (e) {
  console.log(
    "URL changed to:",
    e.detail.url,
    "with state:",
    e.detail.state,
    "via:",
    e.detail.type
  );

  if (e.detail.url.includes("/tickets")) {
    init();
  }
});

init();

//-----------------------------HRLPER METHODS------------------------------//

function addCSS(css) {
    const styleSheet = document.createElement("style")
    styleSheet.innerText = css
    document.head.appendChild(styleSheet)
}

// helper menthod: get element whenever it becomes available
function getElement(selector) {
  return new Promise((resolve, reject) => {
    // Check if the element already exists
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    // Create a MutationObserver to listen for changes in the DOM
    const observer = new MutationObserver((mutations, observer) => {
      // Check for the element again within each mutation
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect(); // Stop observing
        resolve(element);
      }
    });

    // Start observing the document body for child list changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Set a timeout to reject the promise if the element isn't found within 10 seconds
    const timeoutId = setTimeout(() => {
      observer.disconnect(); // Ensure to disconnect the observer to prevent memory leaks
      resolve(null); // Resolve with null instead of rejecting to indicate the timeout without throwing an error
    }, 10000); // 10 seconds

    // Ensure that if the element is found and the observer is disconnected, we also clear the timeout
    observer.takeRecords().forEach((record) => {
      clearTimeout(timeoutId);
    });
  });
}

// helper menthod: detect url changes in SPA sites
(function (history) {
  var originalPushState = history.pushState;
  var originalReplaceState = history.replaceState;

  history.pushState = function (state, title, url) {
    var fullUrl = url ? window.location.origin + url : window.location.href;
    var returnValue = originalPushState.apply(history, [state, title, url]);

    window.dispatchEvent(
      new CustomEvent("urlchange", {
        detail: {
          state: state,
          url: fullUrl,
          type: "pushState",
        },
      })
    );

    return returnValue;
  };

  history.replaceState = function (state, title, url) {
    var fullUrl = url ? window.location.origin + url : window.location.href;
    var returnValue = originalReplaceState.apply(history, [state, title, url]);

    window.dispatchEvent(
      new CustomEvent("urlchange", {
        detail: {
          state: state,
          url: fullUrl,
          type: "replaceState",
        },
      })
    );

    return returnValue;
  };
})(window.history);

// helper function: show toast

function showToast(text) {
  // Create the toast container div
  const toast = document.createElement("div");
  toast.textContent = text;

  toast.style.position = "fixed";
  toast.style.left = "50%";
  toast.style.bottom = "100px";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = "#000000c4";
  toast.style.color = "white";
  toast.style.padding = "10px";
  toast.style.borderRadius = "5px";
  toast.style.textAlign = "center";
  toast.style.zIndex = "9999";
  toast.style.pointerEvents = "none"; // Make it click-through

  document.body.appendChild(toast);

  // Remove the toast after 3 seconds
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}
