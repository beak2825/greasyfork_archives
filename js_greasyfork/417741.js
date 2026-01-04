// ==UserScript==
// @name         OCV & Rave Plugin
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Make your case reviewing faster!
// @author       Bruce Lu
// @include      https://ocv.microsoft.com/*
// @include      https://rave.office.net/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @namespace    https://greasyfork.org/en/scripts/417741
// @downloadURL https://update.greasyfork.org/scripts/417741/OCV%20%20Rave%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/417741/OCV%20%20Rave%20Plugin.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // CSS Selectors
    const triageControllerSelector = 'div[ng-controller^="TriageController"]';
    const navBarControllerSelector = 'div[ng-controller^="NavbarController"]';
    const issueDetailsControllerSelector = 'div[ng-controller^="IssueDetailsController"]';
    const ribbonSelector = ".triage triage-ribbon .ribbon";
    const itemDetailsSelector = "item-details .item-detail";
    const itemKeyDetailsTableSelector =
          "item-details .item-details-key-details .fields-column table > tbody";
    const reviewTagSelector =
          ".item-details-key-details > .fields-column > table > tbody > tr:nth-child(2) > td.field-value > tag-list-with-states > div .dropdown .dropdown-toggle .fa-check-circle";
    const triageGroupRibbonSelector =
          "triage-ribbon > .ribbon > .ribbon-group:nth-child(2)";
    const unValuableIssuesArray = [
        "PFA\\Unsupported scenario",
        "PFA\\No repro",
        "PFA\\SIE or service issue",
        "PFA\\Customer discontinued or resolved on their own",
    ];

    // Other varables
    let db;
    const DB_NAME = "ReviewedData";
    const DB_VERSION = 1; // Use a long long for this value (don't use a float)
    const DB_STORE_NAME = "Cases";
    let MIN = 4;
    let MAX = 5;
    let alias;

    function convertUnixTimeStampToDate(timeStamp) {
        return new Date(timeStamp * 1000);
    }

    function getTruncatedCaseInfo(caseInfoObj) {
        const KEYS = ["id", "OcvAreas", "OcvIssues", "ReviewNotes", "SourceId"];
        console.table("case info", caseInfoObj);
        const newCaseInfo = {};
        KEYS.forEach((key) => {
            newCaseInfo[key] = caseInfoObj[key];
        });

        newCaseInfo["ModifiedOn"] = convertUnixTimeStampToDate(
            caseInfoObj["ReviewNotes"][0]["UpdatedOn"]
        );

        return newCaseInfo;
    }

    /* Start of IndexedDB functions */
    function openDb() {
        if (!window.indexedDB) {
            window.alert(
                "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
            );
        }
        let request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = function (event) {
            // Do something with request.errorCode!
            console.error(
                "failed to save case detail to indexedDB",
                event.target.errorCode
            );
        };

        request.onsuccess = function (event) {
            db = this.result;
            clearCacheByDays();
        };

        request.onupgradeneeded = function (event) {
            console.log("openDb.onupgradeneeded");
            db = event.target.result;
            let objectStore;
            if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
                objectStore = db.createObjectStore(DB_STORE_NAME, {
                    keyPath: "id",
                });
            }

            objectStore.createIndex("raveId", "SourceId", {
                unique: true,
            });
            objectStore.createIndex("ModifiedOn", "ModifiedOn", {
                unique: false,
            });
        };
    }

    /**
   * @param {string} store_name
   * @param {string} mode either 'readonly' or 'readwrite'
   *
   */
    function getObjectStore(store_name, mode) {
        let tx = db.transaction(store_name, mode);
        return tx.objectStore(store_name);
    }

    function clearObjectStore(store_name) {
        let store = getObjectStore(store_name, "readwrite");
        let req = store.clear();
        req.onsuccess = function (event) {
            console.log("store cleared");
        };
        req.onerror = function (event) {
            console.error("clearObjectStore: ", event.target.errorCode);
        };
    }

    /**
   * @param {object} item
   */
    function saveToDB(item) {
        return new Promise((resolve, reject) => {
            let store = getObjectStore(DB_STORE_NAME, "readwrite");
            let req = store.add(item);
            req.onsuccess = function (event) {
                console.log(`Id: ${item.SourceId} saved!`);
                resolve(event.target.result);
            };

            req.onerror = function (event) {
                console.log(
                    "case detail failed to save in indexedDB:",
                    event.target.error
                );
                reject(event.target.error);
            };
        });
    }

    function searchById(id) {
        return new Promise((resolve, reject) => {
            let store = getObjectStore(DB_STORE_NAME, "readonly");
            let req = store.get(id);
            req.onsuccess = function (event) {
                resolve(event.target.result);
            };

            req.onerror = function (event) {
                reject(event.target.errorCode);
            };
        });
    }

    function clearCacheByDays(days = 7) {
        const date = new Date();
        const fromDate = new Date(date.setDate(date.getDate() - days));
        const store = getObjectStore(DB_STORE_NAME, "readwrite");
        const index = store.index("ModifiedOn");
        const range = IDBKeyRange.upperBound(fromDate);

        index.openCursor(range).onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                const request = cursor.delete();
                request.onsuccess = function () {
                    console.log(`${cursor.value.SourceId} deleted!`);
                };
                cursor.continue();
            }
        };
    }

    /* End of IndexedDB functions */

    function changeReviewNotesTime(e) {
        e.stopPropagation();
        e.preventDefault();
        let min = document.getElementById("min-time").value || MIN;
        let max = document.getElementById("max-time").value || MAX;
        if (parseInt(min) > parseInt(max)) {
            alert(`Notes time invalid, max value must larger than min value. `);
            document.getElementById("min-time").value = MIN;
            document.getElementById("max-time").value = MAX;
            return false;
        } else {
            MIN = min;
            MAX = max;
            alert(`Notes time has changed between ${MIN} - ${MAX} `);
            return true;
        }
    }

    function getToken(key) {
        return localStorage.getItem(key);
    }

    function fetchOCVData(payloadString, apiString) {
        const tokenKey = "adal.idtoken";
        const baseURL = "https://ocv.microsoft.com/api/";
        return $.ajax({
            method: "POST",
            url: baseURL + apiString,
            contentType: "application/json;charset=UTF-8",
            headers: {
                Authorization: "Bearer " + getToken(tokenKey),
            },
            data: payloadString,
        })
            .done(function (data) {
            console.log(apiString, data);
            return data;
        })
            .fail(function (jqxhr, textStatus, errorThrown) {
            console.error("Error: " + textStatus + " : " + errorThrown);
            if (errorThrown === "Unauthorized") {
                refreshCurrentCase();
            }
            return errorThrown;
        });
    }

    function parseNestedQueryString(queryString) {
        let apiString = "ParseNestedQueryString";
        return fetchOCVData(queryString, apiString);
    }

    async function getDailyReviewedCount() {
        let seachApi = "es/ocv/_search";
        let dailyQueryString = `OcvIssues:(SetDate:${getCurrentDate(
            "-"
        )} AND (SetBy:"${alias}") AND LabelState:Reviewed)`;
        let parsedQuery;
        try {
            parsedQuery = await parseNestedQueryString(dailyQueryString);
        } catch (error) {
            console.error("failed to parse query string", error);
            return;
        }
        let dailyReviewedPayload = {
            _source: {
                excludes: [
                    "MlTextProcessingOutput",
                    "SysSieveTags",
                    "AlchemyIssuesHidden",
                    "UnclassifiableTaxonomies",
                    "ABConfigs",
                    "AFDFlightInfo",
                    "Flights",
                    "ProcessSessionTelemetry",
                    "WatsonCrashData",
                    "Telemetry",
                    "ResponseHistory",
                    "History",
                    "AutomatedEmailState",
                    "OcvAreasHidden",
                    "OcvIssuesHidden",
                ],
            },
            size: 0,
            query: {
                bool: {
                    filter: {
                        bool: {
                            must: [
                                {
                                    range: {
                                        CreatedDate: {
                                            gte: "2019-01-19T16:00:00.000Z",
                                            lte: new Date().toISOString(),
                                        },
                                    },
                                },
                                {
                                    bool: {
                                        filter: {
                                            nested: parsedQuery.query.nested,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        };

        let dailyReviewedData = await fetchOCVData(
            JSON.stringify(dailyReviewedPayload),
            seachApi
        );
        console.log(
            `Your daily reviewed cases is: ${dailyReviewedData.hits.total}`
    );

      return {
          reviewer: alias,
          total: dailyReviewedData.hits.total,
          reviewedDate: getCurrentDate("-"),
      };
  }

    async function updateReviewCount() {
        const dailyReviewed = await getDailyReviewedCount();
        $("#daily-reviewed-count").text(dailyReviewed.total);
    }

    function refreshCurrentCase() {
        const activeCase = document.querySelector(".list-group-item.item.active");
        activeCase && activeCase.click();
    }

    async function addNotODBIssue() {
        const ocvCase = getCaseInfo(triageControllerSelector);
        const isODB = isODBSyncTriagging(ocvCase.Theme);
        if (!isODB) return;
        const payload = {
            ocvId: ocvCase.id,
            ocvType: ocvCase.OcvType,
            taxonomyId: "4902f1bb-83d0-44f6-9306-a52e2c89e00d",
            taxonomyType: "OcvIssue",
            state: "User Set",
            updateVisibleChildTags: false,
        };

        let triageController = getController(triageControllerSelector);
        triageController.loadingItem = true;
        let result = await fetchOCVData(
            JSON.stringify(payload),
            "OcvItems/UpdateTaxonomyLabel"
        );
        if (typeof result === "string" && result.startsWith("Successfully")) {
            //refreshCurrentCase()
            switchToNextCase();
        }
    }

    function autoFocusActiveCase() {
        const activeCase = document.querySelector(".list-group-item.item.active");
        activeCase && activeCase.focus && activeCase.focus();
    }

    function displayHistoryFromStorage(caseInfoObj) {
        const reviewHistoryTable = document.getElementById("review-history");
        if (reviewHistoryTable) return;
        const fieldsColumnDiv = document.querySelector(
            ".item-details-key-details > .fields-column"
        );

        if (fieldsColumnDiv) {
            const tableHTML = `
      <table id="review-history">
        <caption style="font-weight: 700; padding-bottom: 30px;">Your History</caption>
        <tr class="form-inline">
          <td class="field-label">RaveId:</td>
          <td class="field-value">${caseInfoObj.SourceId}</td>
        </tr>
        <tr class="form-inline">
          <td class="field-label">Areas:</td>
          <td class="field-value">${caseInfoObj.OcvAreas.map(
              (area) => area.Path
          ).join("; ")}</td>
        </tr>
        <tr class="form-inline">
          <td class="field-label">Issues:</td>
          <td class="field-value">${caseInfoObj.OcvIssues.map(
              (issue) => issue.Title
          ).join("; ")}</td>
        </tr>
        <tr class="form-inline">
          <td class="field-label">ReviewNotes:</td>
          <td class="field-value">${caseInfoObj.ReviewNotes.map(
              (note) => note.Note
          )
      .join("")
      .substring(0, 60)}...</td>
        </tr>
        <tr class="form-inline">
          <td class="field-label">ModifiedOn:</td>
          <td class="field-value">${caseInfoObj.ModifiedOn.toLocaleDateString()}</td>
        </tr>
      </table>`;
        fieldsColumnDiv.style.display = "flex";
        fieldsColumnDiv.style.justifyContent = "space-between";
        fieldsColumnDiv.insertAdjacentHTML("beforeend", tableHTML);
    }
  }

    function insertPluginMenu() {
        // HTML Templates
        const menuTemplate = `
            <div class='ribbon-group' id="plugin-menu-container">
                <div class='ribbon-button group-by-button'>
                    <div title="Only working for Review shortcut key 'r'">
                        <label for="auto-save-notes">Notes AutoSave: </label>
                        <input id="auto-save-notes" type="checkbox" />
                    </div>
                    <div id="notes-time-controller" style="margin-top: 7px;">
                        <span>Notes Time</span>
                        <form>
                            <input type="number" name="min" class="form-control" id="min-time" onclick="event.stopPropagation();" placeholder="min" value=${MIN} style="display: inline-block; width: 30%;" min="1" max="8">
                            <input type="number" name="max" class="form-control" id="max-time" onclick="event.stopPropagation();" placeholder="max" value=${MAX} style="display: inline-block; width: 30%;" min="1" max="8">
                            <button type="button" class="btn btn-primary" id="apply-btn" style="margin-top: -5px;">Apply</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class='ribbon-group'>
                <div class='ribbon-button group-by-button'>
                    <div style="padding-bottom: 5px;">
                        <a id="daily-reviewed-link" href="#">DailyReviewed: </a>
                        <span id="daily-reviewed-count"></span>
                    </div>
                </div>
            </div>
        `;
      if ($("#plugin-menu-container").length) return;
      $(ribbonSelector).append(menuTemplate);
      const applyBtn = document.getElementById("apply-btn");
      applyBtn.addEventListener("click", changeReviewNotesTime);
      $("#daily-reviewed-link").on("click", function (event) {
          event.preventDefault();
          let myDailReviewedURL = `https://ocv.microsoft.com/#/discover/?searchtype=OcvItems&relDateType=all&offset=0&q=History.ModifiedDate:${getCurrentDate(
              "-"
          )} AND History.ModifiedBy:"${alias}"&allAreas`;
          window.open(encodeURI(myDailReviewedURL));
      });
  }

    function getCurrentDate(splitor) {
        splitor = splitor || "/";
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return `${year}${splitor}${month < 10 ? "0" + month : month}${splitor}${
      day < 10 ? "0" + day : day
  }`;
  }

    function matchedURL(keyword) {
        let hash = location.hash;
        return hash.startsWith(keyword) ? true : false;
    }

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //inlcude maximum and minimum value
    }

    // Get the controller
    function getController(selector) {
        if (!angular.element) return;
        let data = angular.element($(selector)).data();
        return data && data.$ngControllerController;
    }

    // Get user alias
    function getAlias() {
        let navBarController = getController(navBarControllerSelector) || {};
        if (navBarController.myFeedbackItemsLink) {
            let str = decodeURI(navBarController.myFeedbackItemsLink);
            let alias = str.match(/([\w-]+)@[a-zA-Z_]+?\.[a-zA-Z]{2,3}/)[1];
            console.log("Get alias: ", alias);
            if (alias.length > 3) {
                return alias;
            }
        }
    }

    // Get current triagging case
    function getCaseInfo(controllerSelector) {
        let controller = getController(controllerSelector) || {};
        return controller.boundItem || controller.item;
    }

    // Check if it's an OneDrive for Business sync issue triagging
    function isODBSyncTriagging(theme) {
        if (
            theme === "SharePoint - manage sites, documents and lists" ||
            theme === "OneDrive - Setup OneDrive and sync my documents"
        ) {
            return true;
        }
        return false;
    }

    function searchWithRaveId() {
        const raveLink = document.getElementById("rave-link");
        raveLink.click();
    }

    function saveReviewNotes() {
        const saveBtn = $(
            'item-details .tab-content .review-notes-section > button[ng-click="vm.upsertItemReviewNote()"]'
        );
        if (!saveBtn.length || saveBtn.attr("disabled")) return;
        saveBtn.click();
    }

    function shortCutHandler(e) {
        // alt + q
        if (e.altKey && e.keyCode === 81) {
            searchWithRaveId();
            // alt + s
        } else if (e.altKey && e.keyCode === 83) {
            saveReviewNotes();
            // alt + w
        } else if (e.altKey && e.keyCode === 87) {
            addNotODBIssue();
        }
    }

    function activeReviewNotesTab(callback) {
        const activeReviewNotesTab = $(
            "item-details .clean-tabs > span:nth-child(5) > a"
        );
        if (!activeReviewNotesTab.length) return;
        activeReviewNotesTab[0].click();
        if (callback) {
            setTimeout(callback, 600);
        }
    }

    function trackIssuesChange(isODB) {
        $("item-details").arrive(reviewTagSelector, function () {
            const issueText = this.nextElementSibling.textContent;
            let autoSaveCheckbox = document.getElementById("auto-save-notes");
            console.log("reviewed issue added", issueText);
            // Active review notes tab
            if (!isODB && autoSaveCheckbox.checked) {
                activeReviewNotesTab(saveReviewNotes);
            }
            activeReviewNotesTab();
        });
    }

    function getReviewedIssuesList() {
        const issuesArray = [];
        $(reviewTagSelector).each(function (index, element) {
            issuesArray.push(element.nextElementSibling.textContent);
        });
        return issuesArray;
    }

    function removeUnwantedChar(str) {
        return str.replaceAll(/#\S+/g, "");
    }

    function getReviewNotesTemplate(caseInfo, isODB) {
        let date = getCurrentDate();
        let reivewNotesTime = getRandomIntInclusive(MIN, MAX);
        let reviewNotes = "";
        let reviewedIssuesArray = getReviewedIssuesList();
        let problemDescription =
            caseInfo.ProblemDescription || caseInfo.CustomerProblemDescription || "";
        let symptom = removeUnwantedChar(problemDescription);
        let resolution = caseInfo.ActionsTaken || caseInfo.ResolutionSteps;
        if (!isODB) {
            reviewNotes = `${date}, ${alias}, ${reivewNotesTime}:\n${alias}, ${reviewedIssuesArray.join(
                "\n"
            )}`;
        } else {
            reviewNotes = `${date}, ${alias}, ${reivewNotesTime}:\nSymptom: ${symptom}\nRC: N/A\nResolution: \n${removeUnwantedChar(
                resolution
            )}`;

            for (let i = 0; i < reviewedIssuesArray.length; i++) {
                let reviewedIssue = reviewedIssuesArray[i];
                if (reviewedIssue === "PFA\\Duplicate case") {
                    reviewNotes = `${date}, ${alias}, 3:\nDuplicate case`;

                    break;
                }
                if (unValuableIssuesArray.includes(reviewedIssue)) {
                    reviewNotes = `${date}, ${alias}, ${reivewNotesTime}:\nSymptom: ${symptom}\nRC: N/A, ${reviewedIssue.substr(
                        4
                    )}`;
                }
            }
        }

        return reviewNotes;
    }

    function itemDetailChangeHandler() {
        $(document).arrive(itemDetailsSelector, function () {
            caseDetailObj = getCaseDetail();
        });
    }

    function addRaveLink(raveId) {
        if ($("#rave-id").length) {
            return;
        }
        const raveLinkRowTemplate = `
            <tr id="rave-id">
                <td class="field-label">RaveId:</td>
                <td class="field-value">
                    <a target="_blank" title="View in Rave(shortcut:alt+q)" id="rave-link" style="display:inline-block;" rel="noopener" href="https://rave.office.net/search?query=${raveId}">${raveId}</a>
                </td>
            </tr>
        `;
      $(itemKeyDetailsTableSelector).append(raveLinkRowTemplate);
  }

    function addNotODBRibbonBtn() {
        if ($("#not-odb-btn").length) {
            return;
        }
        const htmlTemplate = `
            <ribbon-button button="button">
            <div id="not-odb-btn" class="ribbon-button" data-toggle="tooltip" title="Mark selected items as Not ODB Sync for SharePoint (shortcut: alt + w)" tabindex="1">
                <div>
                    <div class="ribbon-button-icon">
                        <div>
                            <i class="fa fa-minus-circle"></i>
                        </div>
                    </div>
                    <div class="ribbon-button-description">
                        <div>
                            Not ODB Sync
                        </div>
                    </div>
                </div>
            </div>
        </ribbon-button>
        `;
      $(triageGroupRibbonSelector).append(htmlTemplate);
      $("#not-odb-btn").click(addNotODBIssue);
  }

    function addTriageLink(positionSelector) {
        if ($("#triage-link").length) return;
        const positionElement = document.querySelector(positionSelector);
        let hyperLink = `
        <td>
            <a target="_blank" title="triage items" id="triage-link" style="display:inline-block;" rel="noopener" href="#">
                triage
            </a>
        </td>`;
      positionElement.insertAdjacentHTML("beforeend", hyperLink);

      const triageLinkElement = document.querySelector("#triage-link");
      triageLinkElement.addEventListener("click", function (event) {
          event.preventDefault();
          let triageUrl;
          if (matchedURL("#/issue/")) {
              triageUrl = window.location.href
                  .replace("/?", "&")
                  .replace("#/issue/", "#/triage/?i=");
          } else if (matchedURL("#/discover/")) {
              triageUrl = window.location.href.replace("#/discover/", "#/triage/");
          }
          event.target.href = triageUrl;
          window.open(triageUrl);
      });
  }

    function switchToNextCase() {
        const keyCode = 40;
        var eventObj = new KeyboardEvent("keydown", {
            key: "ArrowDown",
            code: "ArrowDown",
            which: keyCode,
            keyCode: keyCode,
        });
        eventObj.initEvent("keydown", true, true);
        const triageContainer = document.querySelector(
            ".view-port > div > div.triage.container-fluid"
        );
        triageContainer && triageContainer.dispatchEvent(eventObj);
    }

    function saveCaseAndNext(caseInfo) {
        const updatedBySelector =
              ".item-detail-pane item-details .tab-content > div > div[ng-if*='vm.updates.reviewNote.UpdatedBy']";
        $(document).arrive(updatedBySelector, async () => {
            try {
                await saveToDB(getTruncatedCaseInfo(caseInfo));
            } catch (error) {
                console.error(error);
            }
            switchToNextCase();
            $(document).unbindArrive(updatedBySelector);
        });
        autoFocusActiveCase();
    }

    function triageInit() {
        openDb();
        // Initial the plugin when item details loaded
        let timer;
        $(document).arrive("item-details", function () {
            console.log("item detail loaded");
            alias = getAlias();
            insertPluginMenu();
            if (timer) clearInterval(timer);
            timer = setInterval(updateReviewCount, 1000 * 60 * 3);
            updateReviewCount();

            // Add handler for item details content changing
            $("item-details").arrive(
                '.item-detail div[ng-if="!showAuthenticatingUI && !vm.showLoadingUI && vm.areasLoaded && vm.item && !vm.error"]',
                async function () {
                    $("item-details").unbindArrive(
                        ".item-details-key-details > .fields-column > table > tbody > tr:nth-child(2) > td.field-value > tag-list-with-states > div .dropdown .dropdown-toggle .fa-check-circle"
                    );
                    $(".item-detail").unbindArrive(".tab-content textarea");
                    const caseInfo = getCaseInfo(triageControllerSelector);
                    const isODB = isODBSyncTriagging(caseInfo.Theme);
                    console.log("triagging case changed");
                    addRaveLink(caseInfo.ServiceRequestId);
                    if (isODB) {
                        addNotODBRibbonBtn();
                    }
                    // Check if it's reviewed in IndexedDB
                    try {
                        let reviewedCase = await searchById(caseInfo.id);
                        if (reviewedCase) {
                            displayHistoryFromStorage(reviewedCase);
                        }
                    } catch (error) {
                        console.error(error);
                    }

                    trackIssuesChange(isODB);

                    // Add handler for review notes tab active
                    $(".item-detail").arrive(".tab-content textarea", function () {
                        const caseInfo = getCaseInfo(triageControllerSelector);
                        this.setAttribute("rows", "20");
                        if (this.value.trim().length === 0) {
                            this.value = getReviewNotesTemplate(caseInfo, isODB);
                        }

                        this.dispatchEvent(new Event("change"));
                        const saveBtn = $(
                            'item-details .tab-content .review-notes-section > button[ng-click="vm.upsertItemReviewNote()"]'
                        );
                        if (saveBtn.prop("disabled")) {
                            return;
                        }
                        // Focus on active case element to enable "down" and "up" key to change case
                        saveBtn.one(
                            "click",
                            function() { saveCaseAndNext(caseInfo)}
                        );
                        // Enable "Enter" key to save note
                        saveBtn.keydown(function (event) {
                            if (event.which === 13) {
                                this.click();
                            }
                            autoFocusActiveCase();
                        });
                        // Auto save note for duplicate case
                        if (this.value.contains("Duplicate case")) {
                            saveBtn.click();
                        }
                    });
                }
            );
        });
    }

    function itemInit() {
        $(document).arrive(itemKeyDetailsTableSelector, function () {
            const caseInfo = getCaseInfo(".detail-page");
            addRaveLink(caseInfo.ServiceRequestId);
        });
    }

    function ravePluginInit() {
        function getAngularController(selector) {
            if (angular.element) {
                return angular.element($(selector)).data().$scope.caseController;
            }
        }
        return new Promise((resolve, reject) => {
            $(document).arrive(".chat-footer", { onceOnly: true }, () => {
                var caseController = getAngularController("#breadcrumb");
                caseController.ShowNewerFirstCaseHistory();
                if (!caseController.ShowExpandedMessages) {
                    caseController.ToggleExpandAllMessagesButton();
                }
                var resolution =
                    caseController.RequestDetails.RequestDetailsData.Resolution;
                if (resolution === "Duplicate") {
                    $("#rightPane > rct-case-summary > div > div > div.panel-body")
                        .prepend(`
                <div id="RaveEx-Resolution-Reminder" class="alert alert-danger">
                  Resolution: ${resolution}
</div>
              `);
        } else {
            $("#rightPane > rct-case-summary > div > div > div.panel-body")
                .prepend(`
                <div id="RaveEx-Resolution-Reminder" class="alert alert-success">
                  Resolution: ${resolution}
</div>
              `);
        }
          if (caseController.ShowExpandedMessages) {
              resolve("rave plugin intialized.");
          }
      });
    });
  }

    function OCVPluginInit() {
        if (matchedURL("#/triage/")) {
            triageInit();
        } else if (matchedURL("#/item/")) {
            itemInit();
        } else if (matchedURL("#/discover/")) {
            // Add triage link after the search box
            const searchBtnGroupSelector =
                  "#PageControllerDiv > div > div.filters-and-content-container > div > div.results-column > div > form > fieldset > table > tbody > tr";
            $(document).arrive(searchBtnGroupSelector, () => {
                addTriageLink(searchBtnGroupSelector, "#/discover/");
            });
        } else if (matchedURL("#/issue/")) {
            const searchBoxSelector =
                  "issue-details .results-column > .search-bar > form > fieldset > table > tbody > tr";

            $(document).arrive(searchBoxSelector, () => {
                addTriageLink(searchBoxSelector, "#/issue/");
                addToggleTrainingStatusBtn(searchBoxSelector)
            });
        }
        document.onkeydown = shortCutHandler;
    }

    function addToggleTrainingStatusBtn(selector) {
      if ($("#toggle-ts").length) return;
      const insertNode = document.querySelector(selector);
      let isShow = false;
      insertNode.insertAdjacentHTML("beforeend", `<button id="toggle-ts" title="Toggle training data status dropdown menu" class="btn btn-primary">Toggle TS </button>`);
      $("#toggle-ts").on("click", (e) => {
          isShow = toggleDropdownMenu(e, isShow);
      })
    }

    function toggleDropdownMenu(e, isShow) {
      const mlSearchResult = $(".ml-search-result")
      e.preventDefault();

      //let issueDetailsController = getController(issueDetailsControllerSelector);
      if (!isShow && mlSearchResult.length) {
        let styleEle = document.createElement("style")
        styleEle.setAttribute('id', 'custom-sytle')
        styleEle.textContent = `.taxonomy-details .dropdown-menu {
          display: block;
          top: 40px;
        }`
        document.head.appendChild(styleEle);
        return true;
      }
      $("#custom-sytle").remove();
      return false;
    }


    function expandAllRaveMessageExceptNDRMessage() {
        document.arrive(
            ".case-history  .chat-footer > div:nth-child(1) > .ms-Icon-FullMDL",
            function () {
                const messageTextContent =
                      this.parentElement &&
                      this.parentElement.parentElement &&
                      this.parentElement.parentElement.parentElement.textContent;
                const isNDRMessage =
                      messageTextContent.contains("From: MicrosoftExchange") ||
                      messageTextContent.contains("Subject: Undeliverable:");
                const isExpanded =
                      this.parentElement.textContent.trim() === "View less";
                // Expand all message
                if (!isExpanded) {
                    if (isNDRMessage) return;
                    this.click();
                } else {
                    // Collapse expanded Rave NDR message
                    if (isNDRMessage) {
                        this.click();
                    }
                }
                presentWhiteChatTextBody();
            }
        );
    }

    function presentWhiteChatTextBody() {
        const chatBubbleTextBodyElements = document.querySelectorAll(
            ".chat-bubble-note p.chattext-body div"
        );
        Array.from(chatBubbleTextBodyElements)
            .filter(
            (element) =>
            element.style.color === "" ||
            element.style.color === "rgb(255, 255, 255)"
        )
            .forEach((element) => (element.style.color = "rgb(0, 0, 0)"));
    }

    async function init() {
        // Plugin start to run point
        if (location.hostname === "rave.office.net") {
            await ravePluginInit();
            expandAllRaveMessageExceptNDRMessage();
        } else {
            OCVPluginInit();
            $(document).arrive(
                '.modal-dialog > .modal-content .modal-footer > button[ng-click="vm.resumeSession()"]',
                function () {
                    // click the button to keep session alive
                    $(this).click();
                    console.log("click the button to keep session alive");
                }
            );
            // Hide "(Create New)" issue option
            $(document).arrive(
                ".dropdown-menu.ocv-typeahead-popup > li.uib-typeahead-match.active > .typeahead-create-new",
                function () {
                    $(this).remove();
                }
            );
        }
    }

    window.addEventListener("hashchange", init);
    init();
})();
