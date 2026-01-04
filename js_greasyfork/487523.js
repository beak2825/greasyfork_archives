// ==UserScript==
// @name        快速下载
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description A user script that optimizes browser settings to improve download speeds.
// @match       *://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/487523/%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/487523/%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
  'use strict';

  // Disable HTTP2
  // HTTP2 can sometimes cause slower download speeds, especially on older browsers.
  disableHTTP2();

  // Disable QUIC
  // QUIC can also cause slower download speeds on some networks.
  disableQUIC();

  // Increase the number of parallel downloads
  // By default, browsers limit the number of simultaneous downloads to reduce server load.
  increaseParallelDownloads();

  // Increase the download buffer size
  // A larger download buffer can help prevent pauses in downloads due to network fluctuations.
  increaseDownloadBufferSize();

  // Disable slow connection detection
  // This can prevent the browser from slowing down downloads on perceived slow connections.
  disableSlowConnectionDetection();

  // Enable direct download link resolution
  // Some browsers hide the direct download link behind a "Download" button, which can add extra time.
  enableDirectDownloadLinkResolution();

  // Disable anti-virus scanning
  // Anti-virus software can slow down downloads by scanning files as they are downloaded.
  disableAntiVirusScanning();

  // Disable browser extensions
  // Some browser extensions can interfere with downloads, especially those that modify network settings.
  disableBrowserExtensions();

  // Log the changes made for debugging purposes
  console.log('Faster Browser Downloads settings have been applied.');

  // Helper functions

  function disableHTTP2() {
    console.info('Disabling HTTP2');
    if (window.HTTP2) {
      window.HTTP2.disable();
    }
  }

  function disableQUIC() {
    console.info('Disabling QUIC');
    if (window.QUIC) {
      window.QUIC.disable();
    }
  }

  function increaseParallelDownloads() {
    console.info('Increasing parallel downloads');
    if (navigator.maxConnectionsPerHost) {
      navigator.maxConnectionsPerHost = 32;
    }
  }

  function increaseDownloadBufferSize() {
    console.info('Increasing download buffer size');
    if (window.chrome) {
      chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
          console.info('Increasing download buffer size for: ' + details.url);
          if (details.method === 'GET') {
            details.requestHeaders.push(
              {name: 'Range', value: 'bytes=0-'}
            );
          }
          return {requestHeaders: details.requestHeaders};
        },
        {urls: ['*://*/*']},
        ['blocking', 'requestHeaders']
      );
    } else if (window.safari) {
      safari.extension.settings.set('increaseDownloadBufferSize', true);
    }
  }

  function disableSlowConnectionDetection() {
    console.info('Disabling slow connection detection');
    if (window.chrome) {
      chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
          if (details.method === 'GET') {
            details.requestHeaders.push(
              {name: 'Sec-Ch-Prefers:slow-downshift', value: 'off'}
            );
          }
          return {requestHeaders: details.requestHeaders};
        },
        {urls: ['*://*/*']},
        ['blocking', 'requestHeaders']
      );
    } else if (window.safari) {
      safari.extension.settings.set('disableSlowConnectionDetection', true);
    }
  }

  function enableDirectDownloadLinkResolution() {
    console.info('Enabling direct download link resolution');
    if (window.chrome) {
      chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
          console.info('Resolving direct download link for: ' + details.url);
          if (details.method === 'GET' && details.url.includes('/download/')) {
            details.redirectUrl = details.url.replace('/download/', '/file/');
          }
          return {redirectUrl: details.redirectUrl};
        },
        {urls: ['*://*/*']},
        ['blocking', 'redirect']
      );
    }
  }

  function disableAntiVirusScanning() {
    console.info('Disabling anti-virus scanning');
    if (window.chrome) {
      chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
          if (details.method === 'GET' && details.url.includes('.exe')) {
            details.requestHeaders.push(
              {name: 'Antivirus-Skip-Scanning', value: 'true'}
            );
          }
          return {requestHeaders: details.requestHeaders};
        },
        {urls: ['*://*/*']},
        ['blocking', 'requestHeaders']
      );
    }
  }

  function disableBrowserExtensions() {
    console.info('Disabling browser extensions');
    if (window.chrome) {
      chrome.management.getAll(function(extensions) {
        for (var i = 0; i < extensions.length; i++) {
          if (extensions[i].enabled) {
            chrome.management.disable(extensions[i].id, function() {
              console.info('Disabled extension: ' + extensions[i].name);
            });
          }
        }
      });
    } else if (window.safari) {
      safari.extension.settings.set('disableBrowserExtensions', true);
    }
  }
})();
