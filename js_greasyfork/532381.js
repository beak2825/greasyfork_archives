// ==UserScript==
// @name         Quotient Lead Autofill with Groq AI (Email-first + Company detection)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Autofill QuotientApp quote form using Groq AI (email search + company field support)
// @match        https://go.quotientapp.com/*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/532381/Quotient%20Lead%20Autofill%20with%20Groq%20AI%20%28Email-first%20%2B%20Company%20detection%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532381/Quotient%20Lead%20Autofill%20with%20Groq%20AI%20%28Email-first%20%2B%20Company%20detection%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let currentLead = null;
  const GROQ_API_KEY = "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";
  const QUOTE_PAGE_PATTERN = "/quotes/new?from-template=";
  let uiContainer = null;

  // SPA URL Monitor
  function onUrlChange(callback) {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    function checkPage() {
      const currentUrl = window.location.href;
      const isQuotePage = currentUrl.includes(QUOTE_PAGE_PATTERN);

      if (!isQuotePage && document.getElementById("autofill-box")) {
        console.log("🚪 Navigated away. Removing autofill UI.");
        document.getElementById("autofill-box").remove();
        uiContainer = null;
        window.__autofillLoaded__ = false;
      }

      if (isQuotePage && !window.__autofillLoaded__) {
        window.__autofillLoaded__ = true;
        console.log("✅ URL matched. Initializing autofill script...");
        initAutofillScript();
      }
    }

    history.pushState = function () {
      originalPushState.apply(this, arguments);
      checkPage();
    };

    history.replaceState = function () {
      originalReplaceState.apply(this, arguments);
      checkPage();
    };

    window.addEventListener("popstate", checkPage);
    checkPage();
  }

  onUrlChange(() => {});

  function initAutofillScript() {
    if (document.getElementById("autofill-box")) return;

    const container = document.createElement("div");
    container.id = "autofill-box";
    uiContainer = container;

    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.left = "20px";
    container.style.zIndex = "9999";
    container.style.background = "white";
    container.style.padding = "10px";
    container.style.border = "1px solid #ccc";
    container.style.borderRadius = "8px";
    container.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";

    const textarea = document.createElement("textarea");
    textarea.rows = 6;
    textarea.cols = 30;
    textarea.placeholder = "Paste full lead info here...";
    textarea.style.marginBottom = "8px";

    const button = document.createElement("button");
    button.innerText = "Parse & Fill Email";
    button.style.display = "block";
    button.style.width = "100%";

    container.appendChild(textarea);
    container.appendChild(button);
    document.body.appendChild(container);

    button.addEventListener("click", async () => {
      const raw = textarea.value.trim();
      if (!raw) return alert("Please paste lead info first.");

      currentLead = await parseWithGroq(raw);
      console.log("📬 Parsed lead:", currentLead);

      if (!currentLead) return alert("❌ Failed to parse lead data.");

      // 🔁 Step 1: Search by email
      const forField = document.querySelector('#find-contact');
      if (!forField) return alert("❌ 'For' field not found");

      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeSetter.call(forField, currentLead.email);
      forField.dispatchEvent(new Event("input", { bubbles: true }));

      console.log("🧍 Waiting for user to manually select or create a contact...");
      await waitForNewContactClick();

// Fill first and last name using updated field IDs
await waitFor(() => document.getElementById('contact-name-first'), 3000);
const firstField = document.getElementById('contact-name-first');
const lastField = document.getElementById('contact-name-last');
const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

if (firstField && currentLead.firstName) {
  setter.call(firstField, currentLead.firstName);
  firstField.dispatchEvent(new Event("input", { bubbles: true }));
}
if (lastField && currentLead.lastName) {
  setter.call(lastField, currentLead.lastName);
  lastField.dispatchEvent(new Event("input", { bubbles: true }));
}


      // Fill company if available
      if (currentLead.company) {
        await waitFor(() => document.getElementById('contact-company'), 3000);
        const companyField = document.getElementById('contact-company');
        if (companyField) {
          console.log("🏢 Filling company:", currentLead.company);
          nativeSetter.call(companyField, currentLead.company);
          companyField.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }

      // Click "Add Phone or Website"
      const addPhoneBtn = Array.from(document.querySelectorAll('button')).find(btn =>
        btn.textContent.trim() === "Add Phone or Website"
      );
      if (addPhoneBtn) {
        console.log("🖱️ Clicking 'Add Phone or Website' via pointer event");
        const rect = addPhoneBtn.getBoundingClientRect();
        simulatePointerClick(addPhoneBtn, rect.left + 5, rect.top + 5);
      }

      // Fill phone
      await waitFor(() => document.querySelector('input[id^="phoneOther"]'), 3000);
      const phoneField = document.querySelector('input[id^="phoneOther"]');
      if (phoneField) {
        console.log("📞 Filling phone:", currentLead.phone);
        const phoneSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        phoneSetter.call(phoneField, currentLead.phone || "");
        phoneField.dispatchEvent(new Event("input", { bubbles: true }));
      }

      // Click "Create Contact"
      const createContactBtn = Array.from(document.querySelectorAll('button')).find(btn =>
        btn.textContent.trim() === "Create Contact"
      );
      if (createContactBtn) {
        console.log("✅ Clicking 'Create Contact' button...");
        const rect = createContactBtn.getBoundingClientRect();
        simulatePointerClick(createContactBtn, rect.left + 5, rect.top + 5);
      }
    });
  }

  function simulatePointerClick(element, x, y) {
    element.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, cancelable: true, view: window,
      clientX: x, clientY: y, pointerType: 'mouse', isPrimary: true
    }));
    element.dispatchEvent(new PointerEvent('pointerup', {
      bubbles: true, cancelable: true, view: window,
      clientX: x, clientY: y, pointerType: 'mouse', isPrimary: true
    }));
    element.dispatchEvent(new MouseEvent('click', {
      bubbles: true, cancelable: true, view: window
    }));
  }

async function parseWithGroq(text) {
  const body = {
    // Use a *current* model. Good fast choice:
    //   llama-3.1-8b-instant
    // Alternatives:
    //   llama-3.3-70b-versatile  (bigger/$$)
    model: "llama-3.1-8b-instant",

    // Ask the model to return strict JSON
    response_format: { type: "json_object" },

    // Keep it deterministic so field extraction is stable
    temperature: 0,

    messages: [
      {
        role: "system",
        content:
          "Extract contact fields from the user's paste and return ONLY a single JSON object with keys: firstName, lastName, email, phone, company."
      },
      {
        role: "user",
        content: text
      }
    ],
    // (optional) cap tokens so you don't hit any model-specific limits
    max_tokens: 300
  };

  let resp;
  try {
    resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(body)
    });
  } catch (netErr) {
    console.error("🌐 Network error calling Groq:", netErr);
    return null;
  }

  let data;
  try {
    data = await resp.json();
  } catch (parseErr) {
    console.error("🧩 Could not parse JSON response:", parseErr);
    return null;
  }

  if (!resp.ok) {
    // Surface the real error so you can see exactly what's wrong
    console.error("❌ Groq API error:", data);
    alert(`Groq error: ${data?.error?.message || resp.statusText}`);
    return null;
  }

  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    console.error("⚠️ No content returned:", data);
    return null;
  }

  try {
    return JSON.parse(content); // JSON mode returns a JSON object string
  } catch (e) {
    console.error("🧩 JSON parse failed; content was:", content);
    return null;
  }
}


  function waitForNewContactClick() {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const newContactDiv = Array.from(document.querySelectorAll('div')).find(
          div => div.textContent.trim() === "Create a New Contact…"
        );
        if (newContactDiv && !newContactDiv.dataset.listenerAdded) {
          newContactDiv.dataset.listenerAdded = "true";
          newContactDiv.addEventListener("click", () => {
            console.log("🟢 User clicked 'Create a New Contact…'");
            observer.disconnect();
            resolve(true);
          });
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function waitFor(conditionFn, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const interval = setInterval(() => {
        if (conditionFn()) {
          clearInterval(interval);
          resolve();
        } else if (Date.now() - start > timeout) {
          clearInterval(interval);
          reject("⏰ Timeout waiting for condition.");
        }
      }, 250);
    });
  }
})();
