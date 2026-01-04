// ==UserScript==
// @name         Bopimo Item Data Downloader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a button to download item textures from Bopimo.com
// @author       Teemsploit, Variant Tombstones, Evelyn
// @license      MIT
// @match        https://www.bopimo.com/items/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523680/Bopimo%20Item%20Data%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/523680/Bopimo%20Item%20Data%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function injectUI() {
    var buttonPanel = document.createElement('div');
    buttonPanel.id = "custom-download-panel";
    buttonPanel.className = "shop-card";
    buttonPanel.style = "position: fixed; z-index: 1000; padding: 1rem;";
    buttonPanel.style.bottom = "1rem";
    buttonPanel.style.right = "1rem";
    buttonPanel.innerHTML = `
      <button class="button" id="download-texture-btn">Download Texture</button>
      <button class="button" id="download-mesh-btn" style="margin-left: 10px;">Download Mesh</button>
      <p>Credits: Teemsploit & Variant Tombstones</p>
    `;
    document.body.appendChild(buttonPanel);
  }

  function makeButtonsDoStuffIGuess() {
    const textureButton = document.getElementById("download-texture-btn");
    const meshButton = document.getElementById("download-mesh-btn");

    if (textureButton) {
      textureButton.addEventListener("click", () => download('image'));
    }

    if (meshButton) {
      meshButton.addEventListener("click", () => download('mesh'));
    }
  }

  function download(type) {
    try {
      var imageUrl = document.querySelector('meta[property="og:image"]').getAttribute('content');
      if (!imageUrl) {
        alert('Image link not found.');
        return;
      }
      var assetUrl = imageUrl.replace("renders/thumbnail", "assets");

      // Fix: Proper comparison for the type
      if (type === 'mesh') {
        assetUrl = assetUrl.replace(".png", ".obj");
      }

      var parts = assetUrl.split("/");
      var fileName = parts[parts.length - 1];
      var link = document.createElement("a");
      link.setAttribute("href", assetUrl);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('An error occurred: ' + err);
    }
  }

  function waitForDomReady() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', makeButtonsDoStuffIGuess);
    } else {
      makeButtonsDoStuffIGuess();
    }
  }

  injectUI();

  waitForDomReady();
})();
