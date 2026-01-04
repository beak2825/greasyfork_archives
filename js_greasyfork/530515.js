// ==UserScript==
// @name         EZ-Train
// @namespace    Violentmonkey Scripts
// @version      0.1.7
// @description  Highlights the player in terms of train they've received
// @author       ingine
// @match        https://www.torn.com/companies.php*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530515/EZ-Train.user.js
// @updateURL https://update.greasyfork.org/scripts/530515/EZ-Train.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Add our styles
  GM_addStyle(`
      .api-key-button {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color:rgb(0, 0, 0);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 15px;
          cursor: pointer;
          z-index: 9999;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      }
      
      .api-key-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          z-index: 10000;
          justify-content: center;
          align-items: center;
      }
      
      .api-key-modal-content {
          background-color: #333333;
          padding: 20px;
          border-radius: 5px;
          width: 400px;
          max-width: 90%;
      }
      
      .api-key-modal-content h2 {
          margin-top: 0;
      }
      
      .api-key-modal-content input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          box-sizing: border-box;
      }
      
      .api-key-modal-content button {
          padding: 10px 15px;
          margin-right: 10px;
          background-color: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
      }
      
      .trained-employee {
          background-color:rgb(255, 59, 59) !important;
      }

      .untrained-employee {
          background-color:rgb(82, 255, 59) !important;
      }
      
      .time-range-info {
            margin-top: 10px;
            font-size: 0.9em;
            color: #555;
        }
  `);
  const EZ_KEY = "ez-train-tornAPIKey";

  // state object stores the timestamps and date
  const state = {
    startTime: 0,
    endTime: 0,
    dateUsedForCalculation: null,
    formattedStart: "",
    formattedEnd: "",
  };

  // shouldUpdateTimestamps checks if the timestamps needs to be updated (true if date changed)
  function shouldUpdateTimestamps() {
    const now = new Date();
    const today = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      )
    );

    // If timestamps are not calculated yet, or the current date is different from the one used for calculation
    if (
      !state.dateUsedForCalculation ||
      today.getTime() !== state.dateUsedForCalculation.getTime()
    ) {
      return true;
    }
    return false;
  }

  // Get previous day's timestamps in UTC
  function getPreviousDayTimestamps() {
    // Check if timestamps need to be updated
    if (shouldUpdateTimestamps()) {
      const now = new Date();

      // Create yesterday's date at 00:00:00 UTC
      const startDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - 1,
          0,
          0,
          0
        )
      );

      // Create today's date at 00:00:00 UTC
      const endDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          now.getUTCSeconds()
        )
      );

      // Convert to Unix timestamps (seconds, not milliseconds)
      state.startTime = Math.floor(startDate.getTime() / 1000);
      state.endTime = Math.floor(endDate.getTime() / 1000);

      // Store date used for calculation
      state.dateUsedForCalculation = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          now.getUTCSeconds()
        )
      );

      // Format for display
      state.formattedStart = formatDate(startDate);
      state.formattedEnd = formatDate(endDate);

      console.log("Updated timestamps for the new day:", {
        start: state.formattedStart,
        end: state.formattedEnd,
        calculationDate: state.dateUsedForCalculation.toISOString(),
      });
    }

    return {
      startTime: state.startTime,
      endTime: state.endTime,
      formattedStart: state.formattedStart,
      formattedEnd: state.formattedEnd,
    };
  }

  // Helper function to format dates
  function formatDate(date) {
    return `${date.toISOString().split("T")[0]} ${date
      .toISOString()
      .split("T")[1]
      .substring(0, 8)} UTC`;
  }

  // Create API key button
  const apiKeyButton = document.createElement("button");
  apiKeyButton.className = "api-key-button";
  apiKeyButton.textContent = "API Key";
  document.body.appendChild(apiKeyButton);

  // Create modal
  const modal = document.createElement("div");
  modal.className = "api-key-modal";

  // Initialize time range
  const initialTimeRange = getPreviousDayTimestamps();
  modal.innerHTML = `
      <div class="api-key-modal-content">
          <h2>API Key Manager</h2>
          <p>Enter your Torn API key below. It will be stored in your browser's local storage.</p>
          <input type="text" id="api-key-input" placeholder="Enter API key here">
           <div class="time-range-info">
                Fetching data for previous day (UTC):<br>
                From: ${initialTimeRange.formattedStart}<br>
                To: ${initialTimeRange.formattedEnd}
            </div>
          <div>
              <button id="save-api-key">Save Key</button>
              <button id="close-modal">Cancel</button>
              <button id="check-now">Check News Now</button>
          </div>
          <div id="status-message" style="margin-top: 10px; font-style: italic;"></div>
      </div>
  `;
  document.body.appendChild(modal);

  // Show modal when button is clicked
  apiKeyButton.addEventListener("click", () => {
    const apiKeyInput = document.getElementById("api-key-input");
    apiKeyInput.value = localStorage.getItem(EZ_KEY) || "";
    modal.style.display = "flex";

    // Update time range display each time modal opens
    const timeRange = getPreviousDayTimestamps();
    const timeRangeInfoDiv = modal.querySelector(".time-range-info");
    if (timeRangeInfoDiv) {
      timeRangeInfoDiv.innerHTML = `
            Fetching data for previous day (UTC):<br>
            From: ${timeRange.formattedStart}<br>
            To: ${timeRange.formattedEnd}
        `;
    }
  });

  // Close modal when clicking outside or on cancel
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  document.getElementById("close-modal").addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Save API key
  document.getElementById("save-api-key").addEventListener("click", () => {
    const apiKey = document.getElementById("api-key-input").value.trim();
    if (apiKey) {
      localStorage.setItem(EZ_KEY, apiKey);
      document.getElementById("status-message").textContent =
        "API key saved successfully!";
      setTimeout(() => {
        modal.style.display = "none";
        fetchNewsAndHighlight();
      }, 1500);
    } else {
      document.getElementById("status-message").textContent =
        "Please enter a valid API key.";
    }
  });

  // Check news button
  document.getElementById("check-now").addEventListener("click", () => {
    fetchNewsAndHighlight();
    modal.style.display = "none";
  });

  // Function to fetch news and highlight employees
  async function fetchNewsAndHighlight() {
    console.log("fetchNewsAndHighlight called");

    const apiKey = localStorage.getItem(EZ_KEY);
    if (!apiKey) {
      console.log("No API key found. Please set your API key first.");
      return;
    }

    const statusElement = document.getElementById("status-message");
    if (statusElement) {
      statusElement.textContent = "Fetching news...";
    }

    try {
      // Fetch news from API using fetch
      console.log("Fetching news from API...");
      const { startTime, endTime, formattedStart, formattedEnd } =
        getPreviousDayTimestamps();

      const response = await fetch(
        `https://api.torn.com/company/?selections=news&key=${apiKey}`
      );
      const data = await response.json();

      console.log("API response data:", data);

      // Check for error
      if (data.error) {
        console.error("API Error:", data.error);
        if (statusElement) {
          statusElement.textContent = `API Error: ${data.error.error}`;
        }
        return;
      }

      // Process news items
      const newsItems = data.news || {};
      const trainedXIDs = [];
      let trainedCount = 0;

      for (const key in newsItems) {
        const newsItem = newsItems[key];
        // Check if news item is within previous day
        if (newsItem.timestamp >= startTime && newsItem.timestamp < endTime) {
          if (
            newsItem.news &&
            newsItem.news.includes("trained by the director")
          ) {
            trainedCount++;
            // Extract XID from the news text
            const match = newsItem.news.match(/XID=(\d+)/);
            if (match && match[1]) {
              trainedXIDs.push(match[1]);
            }
          }
        }
      }

      if (trainedXIDs.length > 0) {
        // Highlight employees in the list
        highlightEmployees(trainedXIDs);
        if (statusElement) {
          statusElement.textContent = `Found ${trainedXIDs.length} employee(s) trained by the director.`;
        }
      } else {
        if (statusElement) {
          statusElement.textContent =
            "No employees trained by the director found in recent news.";
        }
      }

      console.log(
        `Processed data for time range: ${formatDate(
          new Date(startTime * 1000)
        )} to ${formatDate(new Date(endTime * 1000))}`
      );
      console.log(
        `Found ${trainedCount} training events, extracted ${trainedXIDs.length} employee XIDs`
      );
    } catch (e) {
      console.error("Error processing API response:", e);
      if (statusElement) {
        statusElement.textContent = "Error processing API response.";
      }
    }
  }

  // Function to highlight employees in the list
  function highlightEmployees(xidList) {
    // Find all employee list items
    const employeeItems = document.querySelectorAll(
      ".employee-list li[data-user]"
    );

    employeeItems.forEach((item) => {
      const employeeIcons = item.querySelectorAll("div.employee.icons");

      employeeIcons.forEach((employee) => {
        const userLink = employee.getElementsByTagName("a");
        const href = userLink[0].getAttribute("href");
        if (href) {
          const xidMatch = href.match(/XID=(\d+)/);
          console.log("[EZ] xidMatch", xidList.includes(xidMatch[1]));
          if (xidMatch && xidMatch[1] && xidList.includes(xidMatch[1])) {
            // This employee was trained by the director
            employee.classList.add("trained-employee");
          } else {
            employee.classList.add("untrained-employee");
          }
        }

        // Also check data-user attribute of parent li
        const parentLi = employee.closest("li[data-user]");
        if (parentLi) {
          const dataUser = parentLi.getAttribute("data-user");
          if (dataUser && xidList.includes(dataUser)) {
            employee.classList.add("trained-employee");
          } else {
            employee.classList.add("untrained-employee");
          }
        }
      });
    });
  }

  // Check for timestamp update on page load and whenever script is run
  getPreviousDayTimestamps();

  // Run on page load
  fetchNewsAndHighlight();

  // Set up a daily check at midnight UTC to update timestamps
  function scheduleMidnightCheck() {
    const now = new Date();
    const utcMidnight = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,
        0,
        0
      )
    );

    // Calculate milliseconds until next midnight UTC
    const timeUntilMidnight = utcMidnight.getTime() - now.getTime();

    console.log(
      `Scheduling next timestamp refresh in ${Math.floor(
        timeUntilMidnight / 1000 / 60
      )} minutes`
    );

    // Set timeout to update timestamps at midnight
    setTimeout(() => {
      console.log("Midnight UTC reached, refreshing timestamps");
      getPreviousDayTimestamps(); // Force update of timestamps
      fetchNewsAndHighlight(); // Re-fetch with new time range
      scheduleMidnightCheck(); // Schedule next check
    }, timeUntilMidnight);
  }

  // Start the midnight check schedule
  scheduleMidnightCheck();
})();
