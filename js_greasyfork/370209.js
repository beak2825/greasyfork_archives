// ==UserScript==
// @name          WaniKani Lock Script
// @namespace     https://www.wanikani.com
// @author        Doncr
// @description   Allows you to lock a set number of items from your review queue so you can keep on top of the rest.
// @version       1.1.6
// @match         https://www.wanikani.com/*
// @match         https://preview.wanikani.com/*
// @grant         GM_log
// @run-at        document-body
// @license       MIT
// @require       https://greasyfork.org/scripts/462049-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.user.js?version=1673570

// @downloadURL https://update.greasyfork.org/scripts/370209/WaniKani%20Lock%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/370209/WaniKani%20Lock%20Script.meta.js
// ==/UserScript==

(async function () {

    if (window.lockScriptInitialised) {
        return;
    }

    window.lockScriptInitialised = true;

    const dashboardPaths = [
        "/",
        "/dashboard"
    ];

    const reviewSessionPaths = [
        "/subjects/review"
    ];

    const localStorageConfigKey = "lockScriptCache";
    const localStorageAPIKeyKey = "apikeyv2";

    function getConfig() {

        var config = localStorage.getItem(localStorageConfigKey);

        if (config) {
            return JSON.parse(config);
        } else {
            return {
                availableAt: {},
                lockCount: 0,
            };
        }
    }

    function setConfig(config) {
        localStorage.setItem(localStorageConfigKey, JSON.stringify(config));
    }

    function getAPIKey() {
        return localStorage.getItem(localStorageAPIKeyKey);
    }

    async function reloadCache() {

        const apiKey = getAPIKey();

        if (apiKey.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {

            // Clear out any availability data from the cache.

            let config = getConfig();

            config.availableAt = {};
            delete config.availableUpdatedAt;

            setConfig(config);

            window.managedToUpdateLockCache = false;

            await updateAssignmentsCache();
        }
    }

    async function setAPIKey() {

        const apiKey = document.querySelector('#lockScriptAPIKey').value;

        if (apiKey.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {

            localStorage.setItem(localStorageAPIKeyKey, apiKey);

            await reloadCache();
            setLockCount(0);

        } else if (apiKey.match(/^[0-9a-f]{32}$/)) {

            alert("It looks like you entered an API Version 1 key. You need to use an API Version 2 key.");

        } else {

            alert("Invalid API key format. You need to use an API Version 2 key.");
        }
    }

    async function updateAssignmentsCache() {

        let cache = getConfig();

        if (getAPIKey()) {

            let uri = "https://api.wanikani.com/v2/assignments";

            if (cache.availableUpdatedAt) {
                uri = uri + "?updated_after=" + cache.availableUpdatedAt;
            }

            if (document.querySelector("#lsLoading")) {
                document.querySelector("#lsLoading").style.display = "block";
                document.querySelector("#lsLoaded").style.display = "none";
            }

            while (uri) {

                const response = await fetch(uri, {
                    headers: {
                        "Authorization": "Token token=" + getAPIKey(),
                        "Accept": "application/json"
                    }
                });

                const json = JSON.parse(await response.text());

                if (json.data_updated_at) {
                    cache.availableUpdatedAt = json.data_updated_at;
                }

                json.data.forEach(function (datum) {

                    let key = datum.data.subject_id.toString();
                    let avail = datum.data.available_at;
                    let srs_stage = datum.data.srs_stage;
                    let hidden = datum.data.hidden;

                    if ((avail != null) && (srs_stage > 0) && (srs_stage < 9) && (!hidden)) {
                        let value = Date.parse(avail) / 1000;
                        cache.availableAt[key] = { "t": value };
                    } else {
                        delete cache.availableAt[key];
                    }
                });

                uri = json.pages.next_url;
            }

            let now = Date.now() / 1000;
            let realQueueSize = Object.values(cache.availableAt).filter(function (item) { return item.t < now; }).length;

            if (cache.lockCount > realQueueSize) {
                cache.lockCount = realQueueSize;
            }

            let availableCount = 0;

            Object.keys(cache.availableAt).forEach(function (key) {
                if (cache.availableAt[key].t < now) {
                    availableCount++;
                }
            });

            window.managedToUpdateLockCache = true;
            window.realQueueSize = realQueueSize;
            window.availableCount = availableCount;

            setLockCount(cache.lockCount);

            if (document.querySelector("#lsLoading")) {
                document.querySelector("#lsLoading").style.display = "none";
                document.querySelector("#lsLoaded").style.display = "block";
            }

            setConfig(cache);

            updateElements();
        }
    }

    function modifyReviewQueue() {

        const config = getConfig();
        const availableAt = config.availableAt;
        const lockCount = parseInt(config.lockCount);

        const subjectTimeSortFunction = function (a, b) {

            const sortMethod1 = availableAt[a].t - availableAt[b].t;

            if (sortMethod1 !== 0) {
                return sortMethod1;
            }

            return a - b;
        }

        if (lockCount > 0) {

            wkQueue.applyManipulation(function (queue) {

                let queueByTime = queue.map(item => item.id).sort(subjectTimeSortFunction);

                queueByTime = queueByTime.slice(lockCount);

                let queueByTimeKeys = {};

                queueByTime.forEach(function (item) {
                    queueByTimeKeys[item] = true;
                });

                queue = queue.filter(item => queueByTimeKeys[item.id.toString()]);

                window.lockScriptFilter = true;
                window.lockScriptLockCount = config.lockCount;

                return queue;
            });
        }
    }

    function graphMarkup() {
        return `
<div class="dashboard__row">
  <style>
    button#lockScriptSettings {
      float: right;
      background: white;
      padding: 0.5em;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-radius: 4px;
    }

    button#lockScriptSettings:hover {
      float: right;
      background: #666;
      color: white;
      fill: white;
    }

    button#lockScriptSettings svg {
      fill: #666666;
    }

    button#lockScriptSettings:hover svg {
      fill: white;
    }

    div#lsLoading {
      color: #e44;
      margin-top: 1.2em;
      margin-bottom: 1.2em;
    }

    div#lsLoaded {
      color: #2a2;
      margin-top: 1.2em;
      margin-bottom: 1.2em;
    }

    div#lockScriptOptionsPane>* {
      margin-top: 1em;
    }

    p#lockedItemsHeader {
      margin-top: 1.0em;
      margin-bottom: 1.0em;
    }


    .lockScriptSlider>* {
      border: 1px solid gray;
      padding: 0.2em;
      padding-left: 0.4em;
      padding-right: 0.4em;
      border-radius: 4px;
    }

    .lockScriptSlider>*:hover {
      outline: 1px solid black;
    }

    div.lockScriptWidget {
      width: 100%;
    }
  </style>
  <div class="level-progress-widget theme--default lockScriptWidget">
    <div class="level-progress-widget__content">
      <div class="level-progress-widget__content-wrapper">
        <h3 class="level-progress-widget__title">WaniKani Lock Script
          <button title="Lock Script Settings" id="lockScriptSettings">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 16 16">
              <path
                d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
            </svg>
          </button>
        </h3>

        <div id="lockScriptOptionsPane" class="level-progress-dashboard__content">

          <p class="wk-text">
            See <a href="https://www.wanikani.com/settings/personal_access_tokens">API Tokens</a> to get a personal
            access token.
            You can use the default read-only token because the Lock Script doesn't need to make any changes to your
            account.
            Setting the token will erase cached data used by the Lock Script and so you can set the token again if you
            think that
            the script is not behaving correctly.
          </p>

          <p style="line-height: 20px; margin-bottom: 12px">
            Use the slider below to adjust the number of locked items once the API data has been loaded successfully.
          </p>

          <hr>

          <div class="control-group">
            <div class="input-group m-t-1">
              <label class="control-label" for="lockScriptAPIKey">Personal Access Token</label>
              <div style="display: flex; margin-top: 4px;" class="lockScriptSlider">
                <input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" id="lockScriptAPIKey" type="text"
                  class="lockScriptInput" style="flex: 1">
                <button id="setAPIKey" type="button" class="lockScriptButton"
                  style="margin-left: 0.5em; flex: 0; white-space: nowrap">Set Token</button>
              </div>
            </div>
          </div>

          <div class="center" id="lsLoading" style="display: none">Loading assignment data from API (Please wait...)
          </div>
          <div class="center" id="lsLoaded" style="display: none">Successfully loaded data from API</div>
        </div>

        <div id="lsSlider" style="display: none" class="level-progress-dashboard__content">
          <p id="lockedItemsHeader" class="wk-text">Locked Items</p>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style="fill: #666666"
              viewBox="0 0 16 16">
              <path
                d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2" />
            </svg>
            <input class="slider" id="lockRangeInput" style="width: calc(100% - 4em)" type="range" min="0" max="48"
              value="0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style="fill: #666666"
              viewBox="0 0 16 16">
              <path
                d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
      `;
    }

    function updateElements() {

        const config = getConfig();
        const lockCount = parseInt(config.lockCount);

        if (document.querySelector("div.quiz-statistics")) {

            if (document.querySelector("#lockScriptQuizStatistic") === null) {

                const newElement = document.createElement("div");

                newElement.setAttribute("class", "quiz-statistics__item");
                newElement.setAttribute("title", "lock count");

                newElement.innerHTML = `
                  <div class="quiz-statistics__item-count">
                    <div class="quiz-statistics__item-count-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock-fill" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                      </svg>
                    </div>
                    <div class="quiz-statistics__item-count-text" id="lockScriptQuizStatistic">0</div>
                  </div>
                `;

                document.querySelector("div.quiz-statistics").prepend(newElement);
            }

            if (lockCount && (lockCount > 0)) {
                document.querySelector("#lockScriptQuizStatistic").innerText = lockCount;
            }
        }

        const widgets = document.querySelector("div.dashboard__content");

        if (widgets) {

            if (document.querySelector("#lockScriptPanel") === null) {

                const newElement = document.createElement("section");

                newElement.setAttribute("id", "lockScriptPanel");
                newElement.innerHTML = graphMarkup();

                widgets.insertAdjacentElement("beforeend", newElement);

                const lockScriptOptionsPane = document.querySelector("#lockScriptOptionsPane");
                const lsSlider = document.querySelector("#lsSlider");
                const slider = document.querySelector("#lockRangeInput");
                const input = document.querySelector("#review-queue-lock-count");

                document.querySelector("#lockScriptSettings").addEventListener('click', function (event) {
                    if (lockScriptOptionsPane.style.display === "none") {
                        lockScriptOptionsPane.style.display = "block";
                    } else {
                        lockScriptOptionsPane.style.display = "none";
                    }
                });

                document.querySelector('#setAPIKey').addEventListener("click", setAPIKey);

                if (getAPIKey()) {
                    document.querySelector('#lockScriptAPIKey').value = getAPIKey();
                }

                if (!getAPIKey()) {
                    lockScriptOptionsPane.style.display = "block";
                } else {
                    lockScriptOptionsPane.style.display = "none";
                }

                slider.addEventListener("input", function () {
                    setLockCount(slider.value);
                });
            }

            if (!getAPIKey()) {
                document.querySelector("#lsSlider").style.display = "none";
            } else {
                document.querySelector("#lsSlider").style.display = "block";
            }

            document.querySelector('#lockRangeInput').setAttribute('max', window.realQueueSize);
            document.querySelector('#lockRangeInput').value = config.lockCount;

            document.querySelector("#lockedItemsHeader").textContent =
                (config.lockCount === 0 ? "No" : config.lockCount) + " Locked Items";
        }
    }

    function setLockCount(newCountString) {

        var newCount = parseInt(newCountString);

        if (isNaN(newCount)) {
            newCount = 0;
        }

        if (newCount < 0) {
            newCount = 0;
        }

        if (newCount > window.realQueueSize) {
            newCount = window.realQueueSize;
        }

        var config = getConfig();
        config.lockCount = newCount;
        setConfig(config);

        updateElements();
    }

    document.documentElement.addEventListener("turbo:load", async () => {

        if (reviewSessionPaths.indexOf(window.location.pathname) !== -1) {

            updateElements();
            await updateAssignmentsCache();

            modifyReviewQueue();
        }

        if (dashboardPaths.indexOf(window.location.pathname) !== -1) {

            updateElements();
            await updateAssignmentsCache();
        }
    });

})();
