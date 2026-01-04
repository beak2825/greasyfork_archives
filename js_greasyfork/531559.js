// ==UserScript==
// @name         EZ-Train-2.0
// @namespace    Violentmonkey Scripts
// @version      0.0.0-a.2
// @description  Highlights the player in terms of train they've received
// @author       ingine
// @match        https://www.torn.com/companies.php*
// @match        http://127.0.0.1:3000/Companies%20_%20TORN.html*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531559/EZ-Train-20.user.js
// @updateURL https://update.greasyfork.org/scripts/531559/EZ-Train-20.meta.js
// ==/UserScript==

(function () {
  "use strict";

  try {
    GM_registerMenuCommand("Set API Key", function () {
      checkApiKey(false);
    });
  } catch (err) {
    console.warn("[EZ-Train] Tampermonkey not detected!");
  }

  const EZ_TRAIN_KEY = "ingine-ez-train-torn-api-key";

  let apiKey = localStorage.getItem(EZ_TRAIN_KEY) ?? "###PDA-APIKEY###";

  let GM_addStyle = function (s) {
    let style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = s;
    document.head.appendChild(style);
  };

  GM_addStyle(`
      .custom-hr{
        margin-top: 10px !important;
        border-bottom: 1px solid #333;
        border-left: none;
        border-right: none;
        border-top: 1px solid transparent;
      }
      .trainer-display{
        margin-top: 10px;
        border-radius: 5px 5px 0 0;
        border-bottom: 1px solid #444;
      }
      .custom-detail-wrap {
        line-height: 17px
      }

      .ingine-company-info {
        display: flex;
        background-color: #333
      }
      .ingine-company-info > li {
        position: relative;
        padding: 10px 0;
        width: 260px;
        border-right: 1px solid #222;
        border-left: 1px solid #444;
      }
      .custom-detail-wrap > .title {
        margin-left: 10px;
      }
      .custom-detail-wrap > .title > a {
        text-decoration: none;
        color: inherit;
      }
      .ingine-company-info > li:first-child {
        border-left: none;
      }
      .ingine-refresh-button {
        color: #74c0fc;
        cursor: pointer;
      }
      .trained-employee {
          background-color:rgb(255, 59, 59) !important;
      }
      .untrained-employee {
          background-color:rgb(82, 255, 59) !important;
      }
      @media screen and (max-width:784px){
        .ingine-company-info {
          flex-direction: column;
        }
        .ingine-company-info > li {
          width: 386px;
          border-bottom: 1px solid #222;
          border-top: 1px solid #444;
          border-right: 0;
          border-left: 0;
        }
        .ingine-company-info>li>.t-delimiter,
        .ingine-company-info>li>.b-delimiter{
          display: none;
        }
      }
  `);

  let now = new Date();
  let today = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    )
  );

  let yesterday = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - 1,
      0,
      0,
      0
    )
  );

  let lastRefreshTime = 0;

  function formatDateTime(date) {
    // Get day of week (Wed)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = days[date.getUTCDay()];

    // Get time (03:38:44)
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const time = `${hours}:${minutes}:${seconds}`;

    // Get date (02/04/25)
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = String(date.getUTCFullYear()).slice(-2);
    const formattedDate = `${day}/${month}/${year}`;

    // Combine all parts
    return `${dayOfWeek} ${time} - ${formattedDate}`;
  }

  let yesterdayTimestamp = Math.floor(yesterday.getTime() / 1000);
  let todayTimestamp = Math.floor(today.getTime() / 1000);

  const observerTarget = document.querySelector(".company-wrap");
  const hrCollection = observerTarget.querySelectorAll("hr[class*=delimiter-]");
  const ezTrainerContainer = elementFromHtml(`
     <div>
        <hr class="custom-hr" />
        <div class="company-stats-title white-grad p10 bold t-gray-9 trainer-display">
        EZTrainer:
        </div>
          <ul class="company-info ingine-company-info">
            <li>
              <div class="details-wrap custom-detail-wrap">
                <span class="title bold">From:</span>
                <span class="from-date">${formatDateTime(yesterday)}</span>
              </div>
              <div class="details-wrap custom-detail-wrap">
                <span class="title bold">To:</span>
                <span class="to-date">${formatDateTime(today)}</span>
              </div>
            </li>
            <li id="employees-li">
              <div class="t-delimiter"></div>
              <div class="b-delimiter"></div>
              <!-- Employee entries will be inserted here -->
            </li>
            <li>
              <div class="t-delimiter"></div>
              <div class="b-delimiter"></div>
              <button class="ingine-refresh-button">
                ↻ Refresh Data
              </button>
            </li>
          </ul>
      </div>
    `);

  const secondLi = ezTrainerContainer.querySelector("#employees-li");

  const fromElement = ezTrainerContainer.querySelector(".from-date");
  const toElement = ezTrainerContainer.querySelector(".to-date");
  const refreshButton = ezTrainerContainer.querySelector(
    ".ingine-refresh-button"
  );

  observerTarget.insertBefore(ezTrainerContainer, hrCollection[1]);

  refreshTrainingData();

  refreshButton.addEventListener("click", refreshTrainingData);

  // Function to refresh the training data
  async function refreshTrainingData() {
    // Prevent rapid clicking
    const now = new Date();
    console.log("Now: ", now);
    if (now - lastRefreshTime < 2000) {
      // 2 second cooldown
      return;
    }
    lastRefreshTime = now;

    // Update timestamp variables
    updateTimestamps(now);
    console.log(formatDateTime(yesterday));
    console.log(formatDateTime(today));

    // Update the date display
    fromElement.textContent = formatDateTime(yesterday);
    toElement.textContent = formatDateTime(today);

    // Clear current employee entries (keeping delimiters)
    const employeeEntries = secondLi.querySelectorAll(".custom-detail-wrap");
    employeeEntries.forEach((entry) => entry.remove());

    // Fetch and display new data
    const trainedEmployees = await fetchNews();

    return trainedEmployees;
  }

  // Updates the timestamp variables for the new date range
  function updateTimestamps(now) {
    // Calculate new timestamps
    today = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      )
    );

    yesterday = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 1,
        0,
        0,
        0
      )
    );

    console.log("Updating time stamps");
    console.log("New today: ", formatDateTime(today));
    console.log("New yesterday: ", formatDateTime(yesterday));

    // Update the timestamp values used by fetchNews
    todayTimestamp = Math.floor(today.getTime() / 1000);
    yesterdayTimestamp = Math.floor(yesterday.getTime() / 1000);
  }

  // const observerConfig = {
  //   attributes: false,
  //   childList: true,
  //   characterData: false,
  //   subtree: true,
  // };
  // const observer = new MutationObserver(function (mutations) {
  //   console.log(mutations);
  //   mutations.forEach((mutationRaw) => {
  //     let mutation = mutationRaw.target;
  //     mutation.querySelectorAll("hr").forEach((x) => addEZTrainerDisplay(x));
  //   });
  // });
  // observer.observe(observerTarget, observerConfig);

  function checkApiKey(checkExisting = true) {
    if (
      !checkExisting ||
      apiKey === null ||
      apiKey.indexOf("PDA-APIKEY") > -1 ||
      apiKey.length != 16
    ) {
      let userInput = prompt(
        "Please enter a LIMITED Api Key, it will be used to get current bazaar prices:",
        apiKey ?? ""
      );
      if (userInput !== null && userInput.length == 16) {
        apiKey = userInput;
        localStorage.setItem(EZ_TRAIN_KEY, userInput);
      } else {
        console.error("[EZ-Train] User cancelled the Api Key input.");
      }
    }
  }

  function elementFromHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();

    return template.content.firstElementChild;
  }

  async function fetchNews() {
    try {
      // ! Uncomment before posting the update
      // TODO: You know what to do
      const response = await fetch(
        `https://api.torn.com/company/?selections=news&key=${apiKey}`
      );
      const data = await response.json();

      if (data.error) {
        console.error("API Error: ", data.error);
        return;
      }

      // Process news items
      const newsItems = data.news;
      const trainedEmployees = {};
      let trainedCount = 0;

      for (const key in newsItems) {
        const newsItem = newsItems[key];
        // Check if news item is within today and the previous day
        if (
          newsItem.timestamp >= yesterdayTimestamp &&
          newsItem.timestamp < todayTimestamp
        ) {
          if (
            newsItem.news &&
            newsItem.news.includes("trained by the director")
          ) {
            trainedCount++;
            // Extract XID and name from the news text
            const xidMatch = newsItem.news.match(/XID=(\d+)/);
            const nameMatch = newsItem.news.match(
              />([^<]+)<\/a> has been trained/
            );
            if (xidMatch && xidMatch[1] && nameMatch && nameMatch[1]) {
              const xid = xidMatch[1];
              const name = nameMatch[1];

              // If the XID already exists, increment times_trained
              if (trainedEmployees[xid]) {
                trainedEmployees[xid].times_trained++;
              } else {
                // Otherwise create a new entry
                trainedEmployees[xid] = {
                  name: name,
                  XID: xid,
                  times_trained: 1,
                };
              }
            }
          }
        }
      }
      // Convert object to array for easier handling if needed
      const trainedEmployeesArray = Object.values(trainedEmployees);

      trainedEmployeesArray.forEach((employee) => {
        const employeeDiv = elementFromHtml(`
          <div class="details-wrap custom-detail-wrap">
            <span class="title bold">
              <a href="https://www.torn.com/profiles.php?XID=${employee.XID}" target="_blank">
                ${employee.name}
              </a>:
            </span>
            ${employee.times_trained}
          </div>  
        `);
        secondLi.appendChild(employeeDiv);
      });

      highlightEmployees(trainedEmployeesArray);
      return trainedEmployeesArray;
    } catch (e) {
      console.error(e);
    }
  }

  // Function to highlight employees in the list
  function highlightEmployees(trainedEmployeesArray) {
    // Create an array of just XIDs for easier checking
    const trainedXIDs = trainedEmployeesArray.map((employee) => employee.XID);
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
          console.log("[EZ] xidMatch", trainedXIDs.includes(xidMatch[1]));
          if (xidMatch && xidMatch[1] && trainedXIDs.includes(xidMatch[1])) {
            // This employee was trained by the director
            employee.classList.remove("untrained-employee");
            employee.classList.add("trained-employee");
          } else {
            employee.classList.remove("trained-employee");
            employee.classList.add("untrained-employee");
          }
        }

        // Also check data-user attribute of parent li
        const parentLi = employee.closest("li[data-user]");
        if (parentLi) {
          const dataUser = parentLi.getAttribute("data-user");
          if (dataUser && trainedXIDs.includes(dataUser)) {
            employee.classList.remove("untrained-employee");
            employee.classList.add("trained-employee");
          } else {
            employee.classList.remove("trained-employee");
            employee.classList.add("untrained-employee");
          }
        }
      });
    });
  }

  // fetchNews();
})();
