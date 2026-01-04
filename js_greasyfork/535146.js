// ==UserScript==
// @license MIT
// @name         Auto Login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Js extension for autologin
// @author       dark2care
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535146/Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/535146/Auto%20Login.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const USERNAME = "login"; // 🔑 wprowadź login
  const PASSWORD = "password"; // 🔒 wprowadź hasło

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function waitForElement(selector, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) return resolve(element);

      const observer = new MutationObserver(() => {
        const found = document.querySelector(selector);
        if (found) {
          observer.disconnect();
          resolve(found);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Not found: ${selector}`));
      }, timeout);
    });
  }

  // wyszukiwania przycisku według tekstu
  function findButtonByText(text) {
    return Array.from(document.querySelectorAll("button")).find(
      (btn) => btn.textContent.trim().toLowerCase() === text.toLowerCase()
    );
  }

  // symulująca rzeczywistego naciskania klawisz w przegladarce
  async function typeIntoField(field, text) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;

    // czyścimy pole
    field.focus();
    field.select();
    nativeInputValueSetter.call(field, "");
    field.dispatchEvent(new Event("input", { bubbles: true }));

    // wprowadzanie tekstu znak po znaku (symulacja rzeczywistego wprowadzania)
    for (const char of text) {
      nativeInputValueSetter.call(field, field.value + char);
      field.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: char })
      );
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(
        new KeyboardEvent("keyup", { bubbles: true, key: char })
      );
      await delay(50); // opóźnienie między wprowadzaniem znaków
    }

    field.dispatchEvent(new Event("change", { bubbles: true }));
    field.blur(); // zmiana fokusu w celu wyzwolenia walidacji
    await delay(100);
  }

  // sprawdzanie faktycznego logowania
  function isLoggedIn() {
    const logoutButton = document.querySelector(".btn-danger"); // element wywołania logowania
    return logoutButton && logoutButton.textContent.trim().length > 0;
  }

  // przełączanie trybów "true domain..."/ "false domain..."
  async function handleDomainButton() {
    const domainButton = Array.from(document.querySelectorAll("button")).find(
      (btn) =>
        btn.textContent.startsWith("True") ||
        btn.textContent.startsWith("False")
    );

    if (domainButton && domainButton.textContent.startsWith("True")) {
      domainButton.click(); // przełączanie
      await delay(500);
    }
  }

  // symulowanie naciśnięcia enter, dla react
  async function pressEnter(field) {
    field.focus(); // input focus
    await delay(50); // dodatkowa pauza dla naturalności

    const eventOptions = {
      bubbles: true,
      cancelable: true,
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
    };

    // sekwencja zdarzeń taka jak po naciśnięciu Enter
    field.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
    field.dispatchEvent(new KeyboardEvent("keypress", eventOptions));
    await delay(20);
    field.dispatchEvent(new KeyboardEvent("keyup", eventOptions));

    await delay(100);

    // dodatkowy wyzwalacz
    const form = field.closest("form");
    if (form) {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await delay(100); // oczekiwanie na ewentualne przetworzenie
    }
  }

  // wypełnianie formularza logowania
  async function fillLoginForm() {
    const usernameInput = await waitForElement('input[placeholder="Username"]');
    await typeIntoField(usernameInput, USERNAME); // wpis logowania

    await delay(300);

    const passwordInput = await waitForElement('input[placeholder="Password"]');
    await typeIntoField(passwordInput, PASSWORD); // wpis hasła

    await pressEnter(passwordInput); // imitacja wciśnięcia Enter

    await delay(500);

    // jeżeli Enter nie działa - opcja zapasowa
    try {
      const loginButton = findButtonByText("Login");
      if (loginButton && !loginButton.disabled) {
        loginButton.click();
      } else {
        console.warn("Przycisk „Zaloguj” pozostał nieaktywny.");
      }
    } catch (err) {
      console.warn(`Błąd podczas naciskania przycisku: ${err.message}`);
    }
  }
  // cykl główny
  async function autoLoginLoop() {
    while (true) {
      await delay(5000); // ⏳ opóźnienie przed każdą próbą

      if (isLoggedIn()) {
        continue; // jesli zalogowany - pomiń
      }

      try {
        const loginTriggerButton = await waitForElement(".btn-danger"); // przycisk wywołujący formularz logowania
        loginTriggerButton.click();
        await delay(500);

        await handleDomainButton(); //  wrazie potrzeby przełączanie
        await fillLoginForm(); // wypełnianie formularza
      } catch (error) {
        console.error("cycle error:", error);
      }
    }
  }

  // start
  autoLoginLoop();
})();
