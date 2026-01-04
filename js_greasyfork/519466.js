// ==UserScript==
// @name         bossdeer upload
// @namespace    http://violentmonkey.github.io
// @version      1.1
// @description  Enable image pasting and ImgBB upload integration in bossdeer
// @author       NotFenixio
// @match        https://deer.meltland.dev/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519466/bossdeer%20upload.user.js
// @updateURL https://update.greasyfork.org/scripts/519466/bossdeer%20upload.meta.js
// ==/UserScript==

(function () {
  "use strict";

  async function uploadToImgBB(apiKey, imageData) {
    const formData = new FormData();
    formData.append("key", apiKey);
    formData.append("image", imageData);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      return result.data.url;
    } else {
      console.error("ImgBB upload failed:", result);
      throw new Error("Failed to upload image");
    }
  }

  const mainConfig = document.getElementById("main-config");
  if (mainConfig) {
    const inputHTML = `
            <br>
            <input id="imgbb-api-key" placeholder="ImgBB API Key..." type="text" maxlength="656">
            <button id="save-api-key">Save API Key</button>
        `;
    const h2Element = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'Misc');
    if (h2Element) {
        h2Element.insertAdjacentHTML('beforebegin', inputHTML);
    }

    document.getElementById("save-api-key").onclick = () => {
      const apiKey = document.getElementById("imgbb-api-key").value;
      if (apiKey) {
        localStorage.setItem("imgbbApiKey", apiKey);
        alert("ImgBB API key saved");
      }
    };
  }

  const msMsg = document.querySelector("#ms-msg");
  if (msMsg) {
    msMsg.addEventListener("paste", async (event) => {
      const apiKey = localStorage.getItem("imgbbApiKey");
      if (!apiKey) {
        alert("Please set your ImgBB API key in the Settings section");
        return;
      }

      const items = (event.clipboardData || event.originalEvent.clipboardData)
        .items;
      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          const reader = new FileReader();

          reader.onload = async (e) => {
            try {
              document.querySelector("#error-text").innerText = "Uploading...";
              if (
                document
                  .querySelector("#error-bar")
                  .classList.contains("hidden")
              ) {
                document.querySelector("#error-bar").classList.toggle("hidden");
              }
              const imageUrl = await uploadToImgBB(
                apiKey,
                e.target.result.split(",")[1],
              );
              attachments.push(imageUrl);
              updateDetailsMsg();
              document.querySelector("#error-text").innerText = "Uploaded!";
              setTimeout(() => {
                document.querySelector("#error-bar").classList.toggle("hidden");
              }, 1000);
            } catch (error) {
              console.error("Error uploading image:", error);
              document.querySelector("#error-text").innerText =
                "Error uploading! " + error;
              document.querySelector("#error-bar").classList.toggle("hidden");
            }
          };

          reader.readAsDataURL(file);
        }
      }
    });
  }
})();
