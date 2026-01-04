// ==UserScript==
// @name         AliExpress Invoice Downloader
// @namespace    https://www.aliexpress.com
// @version      1.1
// @description  Adds download buttons to the Aliexpress order page (https://www.aliexpress.com/p/order/index.html) and a bulk download button to download all invoices on the order page to save time.
// @match        https://www.aliexpress.com/p/order/index.html*
// @grant        GM_download
// @author       Peter Tanner
// @namespace    https://github.com/peter-tanner/AliExpress-Invoice-Downloader/
// @supportURL   https://github.com/peter-tanner/AliExpress-Invoice-Downloader/issues
// @license      GPL-3.0
// @website      https://www.petertanner.dev/
// @downloadURL https://update.greasyfork.org/scripts/488177/AliExpress%20Invoice%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/488177/AliExpress%20Invoice%20Downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let orderIds = [];

  function handleDownloadOrNavigate(link, orderId, name) {
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download Invoice";
    downloadButton.className = "aliexpress-invoice-download-button";
    downloadButton.style.marginLeft = "10px";
    downloadButton.addEventListener("click", () => {
      downloadInvoice(orderId, name);
    });

    link.parentNode.appendChild(downloadButton);
  }

  function downloadInvoice(orderId, name) {
    const sanitizedFileName = sanitizeFileName(name);
    const url = `https://trade.aliexpress.com/ajax/invoice/invoiceExportAjax.htm?orderId=${orderId}&name=${sanitizedFileName}`;
    GM_download({
      url: url,
      name: `invoice_${orderId}_${sanitizedFileName}.pdf`,
      onerror: function (error) {
        console.error("Error downloading:", error);
      },
    });
  }

  function sanitizeFileName(name) {
    const sanitized = name
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[/\\?%*:|"<>]/g, "_"); // Remove illegal filename characters
    return sanitized.substring(0, 16);
  }

  function addDownloadAllButton() {
    const downloadAllButton = document.createElement("button");
    downloadAllButton.textContent = "Download All Invoices";
    downloadAllButton.className = "aliexpress-download-all-button";
    downloadAllButton.style.position = "fixed";
    downloadAllButton.style.bottom = "10px";
    downloadAllButton.style.left = "10px";
    downloadAllButton.style.zIndex = "1000";
    downloadAllButton.style.backgroundColor = "red";
    downloadAllButton.style.color = "white";
    downloadAllButton.style.padding = "10px";
    downloadAllButton.style.border = "none";
    downloadAllButton.style.cursor = "pointer";
    downloadAllButton.addEventListener("click", () => {
      orderIds.forEach((order) => {
        downloadInvoice(order.orderId, order.name);
      });
    });

    document.body.appendChild(downloadAllButton);
  }

  function createDownloadButtons() {
    const invoiceItems = document.querySelectorAll("div.order-item");
    invoiceItems.forEach((item) => {
      const nameElement = item.querySelector(
        "div.order-item-content-info-name"
      );
      const name = nameElement ? nameElement.textContent.trim() : "";
      const link = item.querySelector(
        "div.order-item-header > div.order-item-header-right > a"
      );
      if (link) {
        const href = link.getAttribute("href");
        if (href) {
          const url = new URL(href, window.location.href);
          const orderId = url.searchParams.get("orderId");
          if (orderId) {
            orderIds.push({ orderId: orderId, name: name });
            handleDownloadOrNavigate(link, orderId, name);
          }
        }
      }
    });
  }

  const observerCallback = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        const addedNodes = mutation.addedNodes;
        addedNodes.forEach((node) => {
          if (node.matches && node.matches("div.order-item")) {
            const nameElement = node.querySelector(
              "div.order-item-content-info-name"
            );
            const name = nameElement ? nameElement.textContent.trim() : "";
            const link = node.querySelector(
              "div.order-item-header > div.order-item-header-right > a"
            );
            if (link) {
              const href = link.getAttribute("href");
              if (href) {
                const url = new URL(href, window.location.href);
                const orderId = url.searchParams.get("orderId");
                if (orderId) {
                  orderIds.push({ orderId: orderId, name: name });
                  handleDownloadOrNavigate(link, orderId, name);
                }
              }
            }
          }
        });
      }
    }
  };

  const startObserverWhenReady = () => {
    const targetNode = document.querySelector("div.comet-checkbox-group");
    if (targetNode) {
      const observer = new MutationObserver(observerCallback);
      const config = { childList: true, subtree: true };
      observer.observe(targetNode, config);
    } else {
      setTimeout(startObserverWhenReady, 100);
    }
  };

  startObserverWhenReady();
  addDownloadAllButton();
  createDownloadButtons();
})();
