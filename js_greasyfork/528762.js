// ==UserScript==
// @name         Push creators to Feishu
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Show and update Feishu Table ID with a floating box (Persistent Storage)
// @match        *://pgy.xiaohongshu.com/solar/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/528762/Push%20creators%20to%20Feishu.user.js
// @updateURL https://update.greasyfork.org/scripts/528762/Push%20creators%20to%20Feishu.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  // Create the display box for Table ID
  const box = document.createElement("div");
  box.id = "tableIdBox";
  box.style.position = "fixed";
  box.style.bottom = "120px"; // Adjust to fit both buttons
  box.style.right = "30px";
  box.style.zIndex = "999999";
  box.style.padding = "10px";
  box.style.fontSize = "14px";
  box.style.background = "#fff";
  box.style.color = "#333";
  box.style.border = "1px solid #007bff";
  box.style.borderRadius = "5px";
  box.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.2)";
  box.style.textAlign = "center";
  box.style.minWidth = "200px";
  document.body.appendChild(box);

  // Create the "Set Feishu Table ID" button
  const btnSet = document.createElement("button");
  btnSet.textContent = "Set Feishu Table ID";
  btnSet.style.position = "fixed";
  btnSet.style.bottom = "70px"; // Adjusted
  btnSet.style.right = "20px";
  btnSet.style.zIndex = "999999";
  btnSet.style.padding = "0.7em 1.2em";
  btnSet.style.fontSize = "1.5rem";
  btnSet.style.background = "#007bff";
  btnSet.style.color = "#fff";
  btnSet.style.border = "none";
  btnSet.style.borderRadius = "5px";
  btnSet.style.cursor = "pointer";
  btnSet.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.2)";
  // Create the "Send Data to Feishu" button
  const btnSend = document.createElement("button");
  btnSend.textContent = "Send Data to Feishu";
  btnSend.style.position = "fixed";
  btnSend.style.bottom = "20px";
  btnSend.style.right = "20px";
  btnSend.style.zIndex = "999999";
  btnSend.style.padding = "0.5em 1.2em";
  btnSend.style.fontSize = "1.5rem";
  btnSend.style.background = "#28a745"; // Green color
  btnSend.style.color = "#fff";
  btnSend.style.border = "none";
  btnSend.style.borderRadius = "5px";
  btnSend.style.cursor = "pointer";
  btnSend.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.2)";
  // Hover effect
  // Hover effects
  btnSet.addEventListener(
    "mouseover",
    () => (btnSet.style.background = "#0056b3")
  );
  btnSet.addEventListener(
    "mouseout",
    () => (btnSet.style.background = "#007bff")
  );
  btnSend.addEventListener(
    "mouseover",
    () => (btnSend.style.background = "#218838")
  );
  btnSend.addEventListener(
    "mouseout",
    () => (btnSend.style.background = "#28a745")
  );

  // Function to update and display Table ID
  async function updateTableIdDisplay() {
    let savedTableId =
      (await GM_getValue("feishu_table_id", null)) ||
      localStorage.getItem("feishu_table_id") ||
      "Not Set";
    box.textContent = "Feishu Table ID: " + savedTableId;
  }

  function askTableId() {
    let savedTableId = localStorage.getItem("feishu_table_id") || "";

    let tableId = prompt("Enter your Feishu Table ID:", savedTableId);

    if (tableId) {
      GM_setValue("feishu_table_id", tableId);
      localStorage.setItem("feishu_table_id", tableId);
      alert("✅ Table ID updated: " + tableId);
      updateTableIdDisplay(); // Update the box immediately
    } else {
      alert("❌ No Table ID entered. Keeping the old one.");
    }
  }

  /// Fetch Feishu Auth Token with Tampermonkey CORS Bypass
  async function fetchAuth() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          app_id: "cli_a7ed50b93cf81013", // Replace with your real App ID
          app_secret: "UpfwudsU6XjexK12atBW2dHIJ8cpHoiO", // Replace with your real App Secret
        }),
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            if (data.tenant_access_token) {
              resolve(data.tenant_access_token);
            } else {
              alert("❌ Failed to fetch auth token. Check your credentials.");
              reject(null);
            }
          } catch (error) {
            console.error("❌ JSON Parse Error:", error);
            reject(null);
          }
        },
        onerror: function (error) {
          console.error("❌ Feishu Auth API Request Error:", error);
          reject(null);
        },
      });
    });
  }

  // ✅ Send Data to Feishu Table using GM_xmlhttpRequest (Bypass CORS)
  async function postToFeishu() {
    let tableId = localStorage.getItem("feishu_table_id");
    if (!tableId || tableId === "Not Set") {
      alert("❌ No Feishu Table ID saved. Please set one first.");
      return;
    }

    const authToken = await fetchAuth();
    if (!authToken) return;

    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/H6yybtp50azBCTsUMVNc8HD3nob/tables/${tableId}/records`;

    const element = document.querySelector(
      "#body_wrapper > section > div > div > div > div.d-spinner-nested-loading > div > div > div.blogger-detail__left > div > div.blogger-info-cell > div.blogger-info-cell-content > div.blogger-base-info > div.base-info-list > div:nth-child(1) > div.blogger-name"
    );
    let extractedText = element ? element.textContent.trim() : "No Data Found"; // Default if element not found

    // ✅ Get the current page URL
    const currentPageUrl = window.location.href;

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        data: JSON.stringify({
          fields: {
            达人昵称: extractedText,
            其他备注: currentPageUrl,
          },
        }),
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            if (data.code === 0) {
              alert("✅ Data successfully sent to Feishu Table!");
              console.log("📨 Response:", data);
              resolve(data);
            } else {
              alert(`❌ API Error: ${data.msg}`);
              console.error("❌ API Response:", data);
              reject(null);
            }
          } catch (error) {
            console.error("❌ JSON Parse Error:", error);
            reject(null);
          }
        },
        onerror: function (error) {
          console.error("❌ Feishu API Request Error:", error);
          alert("❌ Failed to send data.");
          reject(null);
        },
      });
    });
  }

  // Update Table ID box on page load
  await updateTableIdDisplay();

  // Button Click Events
  btnSet.addEventListener("click", askTableId);
  btnSend.addEventListener("click", postToFeishu);

  // Add buttons to the webpage
  document.body.appendChild(btnSet);
  document.body.appendChild(btnSend);
})();
