// ==UserScript==
// @name         E-Arşiv Portal PDF
// @namespace    http://tampermonkey.net/
// @version      2025-02-13
// @description  Düzenlenen faturalar PDF indirme butonu
// @author       Deniz Tunç
// @license GPLv3
// @match        https://earsivportal.efatura.gov.tr/index.jsp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526812/E-Ar%C5%9Fiv%20Portal%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/526812/E-Ar%C5%9Fiv%20Portal%20PDF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    entry()

})();

async function entry() {
  await waitForElement("div[rel='leftMenu'] ul ul li:nth-child(2) a", false);
  document.querySelector("div[rel='leftMenu'] ul ul li:nth-child(2) a").addEventListener("click", async () => {
    await waitForElement("div[rel='goster']")
    createButton()
  })
}

function createButton() {
  let goster = document.querySelector("*[rel='goster']")

  let pdf = goster.cloneNode(true)
  pdf.setAttribute("rel", "pdf")
  pdf.querySelector("input").value = "PDF"
  pdf.querySelector("i.fa").classList.replace("fa-file-text","fa-print")
  pdf.querySelector("input").onclick = async () => {
    console.log(goster.querySelector("input"))
    goster.querySelector("input").click()
    await waitForElement("iframe.csc-iframe")
    console.log(document.querySelector("iframe.csc-iframe"))
    document.querySelector("iframe.csc-iframe").contentWindow.print()
  }

  goster.parentElement.insertBefore(
    pdf, goster.parentElement.childNodes[1])
}

function waitForElement(selector, timeout = 30000) {
  return new Promise((resolve, reject) => {
    // Immediately check if the element already exists
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }

    // Set up MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations, obs) => {
      // Check if element exists after each DOM change
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect(); // Stop observing
        resolve(element);
      }
    });

    // Start observing the entire document for changes
    observer.observe(document, {
      childList: true,
      subtree: true
    });

    // Set timeout to prevent infinite waiting
    if (timeout) {
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    }
  });
}