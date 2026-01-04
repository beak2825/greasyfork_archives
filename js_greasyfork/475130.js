// ==UserScript==
// @name         Cafe Bazaar Downloader
// @namespace    http://your-namespace.com
// @version      1.0
// @description  Script for extracting app information and downloading from Cafe Bazaar
// @author       https://t.me/TheErfon
// @match        https://cafebazaar.ir/*
// @grant        none
// @license      CC BY-NC-ND 4.0
// @licenseURL   https://github.com/Rainman69/CafeBazaar-Downloader/blob/main/LICENSE
// @downloadURL https://update.greasyfork.org/scripts/475130/Cafe%20Bazaar%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/475130/Cafe%20Bazaar%20Downloader.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function extractPackageName(url) {
    const regex = /https:\/\/cafebazaar\.ir\/app\/(?:\?id=)?([\w.-]+)/;
    const match = url.match(regex);
    if (match) {
      const packageName = match[1];
      return packageName;
    } else {
      console.error("Invalid URL format: " + url);
      throw new Error("Invalid URL format");
    }
  }

  function callDownloadApi(packageName, sdk, retry = true) {
    const payload = {
      "properties": {
        "language": 2,
        "clientVersionCode": 1100301,
        "androidClientInfo": {
          "sdkVersion": sdk,
          "cpu": "x86,armeabi-v7a,armeabi"
        },
        "clientVersion": "11.3.1",
        "isKidsEnabled": false
      },
      "singleRequest": {
        "appDownloadInfoRequest": {
          "downloadStatus": 1,
          "packageName": packageName,
          "referrers": []
        }
      }
    };

    return fetch("https://api.cafebazaar.ir/rest-v1/process/AppDownloadInfoRequest", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.error("API request failed for package: " + packageName);
        if (retry && sdk !== 25) {
          console.log("Retrying with SDK version 25 for package: " + packageName);
          return callDownloadApi(packageName, 25, false);
        } else {
          console.error("Abnormal API response for package: " + packageName);
          throw new Error("Abnormal API response. Check your request and try again.");
        }
      }
    })
    .then(data => handleResponse(data));
  }

  function handleResponse(data) {
    const appInfo = data.singleReply.appDownloadInfoReply;
    if (!appInfo) {
      console.error("Response does not include expected data");
      throw new Error("Response does not include expected data");
    }

    const downloadUrls = appInfo.fullPathUrls || [];
    if (!downloadUrls.length) {
      console.error("Download URLs are empty");
      throw new Error("Download URLs are empty");
    }

    const fileSize = parseInt(appInfo.packageSize, 10) / 1024 / 1024;
    const versionCode = appInfo.versionCode || 0;

    return {
      downloadLink: downloadUrls[downloadUrls.length - 1],
      fileSize,
      versionCode
    };
  }

  function main() {
    try {
      const currentUrl = window.location.href;
      console.log("Current URL: " + currentUrl);

      const packageName = extractPackageName(currentUrl);
      callDownloadApi(packageName, 33)
        .then(downloadInfo => {
          const { downloadLink, fileSize, versionCode } = downloadInfo;

          console.log("App information retrieved successfully for package: " + packageName);
          console.log("Download link: " + downloadLink);
          console.log("File size: " + fileSize.toFixed(2) + " MB");
          console.log("Version: " + versionCode);

          // Perform the download automatically
          window.location.href = downloadLink;
        })
        .catch(error => {
          console.error("An error occurred: " + error.message);
        });
    } catch (error) {
      console.error("An error occurred: " + error.message);
    }
  }

  main();
})();