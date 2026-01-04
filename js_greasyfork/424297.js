// ==UserScript==
// @name         OCV Discover Data Export Tool
// @namespace    OCVDiscover
// @version      0.6
// @description  Export OCV Discover Page Data
// @author       Bruce Lu
// @include      https://ocv.microsoft.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/424297/OCV%20Discover%20Data%20Export%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/424297/OCV%20Discover%20Data%20Export%20Tool.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let db;
  const DB_NAME = "OCV";
  const DB_VERSION = 1; // Use a long long for this value (don't use a float)
  const DB_STORE_NAME = "Cases";

  /**
   * Transform data from IndexedDB
   * @param Array[Object] storeItemList
   * @return Array[String]
   */
  function transformData(storeItemList) {
    const result = [];
    let longestItemIndex = 0;
    let longestItem = 0;
    storeItemList.forEach((storeItem, index) => {
      const storeItemValues = Object.values(storeItem);
      if (storeItemValues.length > longestItem) {
        longestItem = storeItemValues.length;
        longestItemIndex = index;
      }
      result.push(storeItemValues.join("="));
    });
    const headers = Object.keys(storeItemList[longestItemIndex]).join("=");
    result.unshift(headers);
    return result;
  }

  /**
   * Get all data from IndexedDB
   * @return Promise: Array[Object] | Error
   */
  function getAllDBData() {
    return new Promise((resolve, reject) => {
      let store = getObjectStore(DB_STORE_NAME, "readonly");
      let req = store.getAll();
      req.onsuccess = function (event) {
        resolve(event.target.result);
      };

      req.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  /**
   * Download the data as a CSV file
   * @param fileName String
   * @return Promise: undefined
   */
  async function download(fileName) {
    let result = await getAllDBData();
    let data = transformData(result);
    let csvContent = data.join("\n");
    var blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    if (window.navigator.msSaveBlob) {
      // FOR IE BROWSER
      navigator.msSaveBlob(blob, fileName);
    } else {
      // FOR OTHER BROWSERS
      var link = document.createElement("a");
      var csvUrl = URL.createObjectURL(blob);
      link.href = csvUrl;
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /**
   * Open IndexedDB
   * @return undefined
   */
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
      clearObjectStore(DB_STORE_NAME);
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

      objectStore.createIndex("id", "id", {
        unique: true,
      });
    };
  }

  /**
   * Get Object Store by it's name in IndexedDB
   * @param store_name String
   * @param mode String['readonly' | 'readwrite']
   *
   */
  function getObjectStore(store_name, mode) {
    let tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  }

  /**
   * Clear IndexedDB Object Store
   * @param store_name String
   * @return undefined
   */
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
   * Save Object to IndexedDB
   * @param item Object
   * @return Promise: Null
   */
  function saveToDB(item) {
    return new Promise((resolve, reject) => {
      let store = getObjectStore(DB_STORE_NAME, "readwrite");
      let req = store.add(item);
      req.onsuccess = function (event) {
        console.log(`Id: ${item.id} saved!`);
        resolve();
      };

      req.onerror = function (event) {
        console.log(
          "case detail failed to save in indexedDB:",
          event.target.error
        );
        reject();
      };
    });
  }

  /**
   * Search item in IndexedDB by Id
   * @param  id String
   * @return Promise: Object
   */
  function searchInDB(id) {
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

  /**
   * Get Angular Controller via HTML element
   * @return Object
   */
  function getAngularController() {
    if (!angular.element) return;
    let controller = angular
      .element(document.getElementById("PageControllerDiv"))
      .data().$ngControllerController;
    return controller;
  }

  /**
   * Get discover page request payload depending on the Angular Controller
   * @return Object
   */
  function getRequestPayload() {
    const controller = getAngularController();
    let {
      filters,
      currentPage,
      pageSize,
      sort,
      _source,
    } = controller.searchDefinition;

    const { searchFrom: from, searchTo: to } = filters.dates;
    const globalAreaIdPath = filters.globalArea.IdPath;
    const queryString = filters.queryString;

    sort = {
      [sort.field.sortField]: {
        order: sort.order,
      },
    };

    let discoverPayload = {
      _source,
      size: pageSize,
      query: {
        bool: {
          filter: {
            bool: {
              must: [
                {
                  range: {
                    CreatedDate: {
                      gte:
                        from.utc &&
                        from.utc().format("YYYY-MM-DDTHH:mm:ss.SSS\\Z"),
                      lte:
                        to.utc && to.utc().format("YYYY-MM-DDTHH:mm:ss.SSS\\Z"),
                    },
                  },
                },
                { terms: { "OcvAreas.IdPath": globalAreaIdPath } },
                {
                  query_string: {
                    query: queryString,
                  },
                },
              ],
            },
          },
        },
      },
      highlight: {
        highlight_query: {
          query_string: { query: queryString },
        },
        pre_tags: ["<mark>"],
        post_tags: ["</mark>"],
        fields: { "*": { number_of_fragments: 0 } },
        encoder: "default",
        require_field_match: false,
      },
      sort,
      from: currentPage,
    };

    return discoverPayload;
  }

  /**
   * Escape Line Break And Equal character
   * @param input String | Null | undefined
   * @return String
   */
  function trimedLineBreakAndEqual(input) {
    if (input && input.length) {
      return input.replace(/[(?:\r\n|\r|\n)|"="]/g, " ");
    }
    return "";
  }

  /**
   * Get the token from localStorage
   * @param key String
   * @return String
   */
  function getToken(key) {
    return localStorage.getItem(key);
  }

  /**
   * Fetch data with the payload
   * @param payloadString String
   * @param apiString String
   * @return Promise: Object
   */
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

  /**
   * Get the data by PageNumber
   * @param pageNumber Number
   * @return Promise: Object
   */
  async function getDateByPage(pageNumber) {
    let seachApi = "es/ocv/_search?preference=_primary_first";

    try {
      const requestPayload = getRequestPayload();
      requestPayload.from = pageNumber;
      let discoverData = await fetchOCVData(
        JSON.stringify(requestPayload),
        seachApi
      );
      return discoverData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the issues list string
   * @param issuesArray Array[Object]
   * @return Object
   */
  function getOcvIssues(issuesArray) {
    const issuesObj = {};
    const skippedIssuesString = "CSS\\Resolution";
    const escapeResolutionIssues = issuesArray.filter(
      (issue) => issue.Title && !issue.Title.startsWith(skippedIssuesString)
    );
    escapeResolutionIssues.forEach((issue, index) => {
      issuesObj["Issue" + index] = issue.Title;
    });
    if (Object.keys(issuesObj).length !== 0) {
      return issuesObj;
    } else {
      return {
        Issue0: "",
      };
    }
  }


  /**
   * Extract the necessary data
   * @param data Object
   * @return Object
   */
  function extractData(data) {
    const { hits } = data.hits;
    const result = [];
    hits.forEach((element) => {
      const {
        id,
        ServiceRequestId,
        TranslatedCustomerProblemDescription,
        ProblemDescription,
        TranslatedTitle,
        ActionsTaken,
        ResolutionSteps,
        CreatedDate,
        OcvIssues,
      } = element._source;

      const issuesObj = getOcvIssues(OcvIssues);
      result.push({
        id,
        ServiceRequestId,
        Title: TranslatedTitle,
        ProblemDescription: trimedLineBreakAndEqual(ProblemDescription),
        CustomerProblemDescription: trimedLineBreakAndEqual(
          TranslatedCustomerProblemDescription
        ),
        ActionsTaken: trimedLineBreakAndEqual(ActionsTaken),
        ResolutionSteps: trimedLineBreakAndEqual(ResolutionSteps),
        CreatedDate,
        ...issuesObj,
      });
    });

    return result;
  }

  /**
   * Add Export button in the page
   * @param positionSelector String
   * @return undefined
   */
  function addExportLink(positionSelector) {
    if ($("#export-link").length) return;
    const positionElement = document.querySelector(positionSelector);
    let exportLink = `
    <td>
        <a title="export items" id="export-link" style="display:inline-block;" href="#">
            export
        </a>
    </td>`;
    positionElement.insertAdjacentHTML("beforeend", exportLink);

    const exportLinkElement = document.querySelector("#export-link");
    exportLinkElement.addEventListener("click", async function (event) {
      event.preventDefault();
      this.innerHTML = `<i class="fa fa-refresh fa-spin"></i>`;
      const data = await getDateByPage(0);
      const formatedData = extractData(data);
      formatedData.forEach(async (item) => {
        await saveToDB(item);
      });
      const pageSize = data.hits.hits.length;
      const total = data.hits.total || 0;
      const length = Math.ceil(total / pageSize);
      if (isNaN(length)) return;
      for (let i = 1; i < length; i++) {
        const data = await getDateByPage(i * pageSize);
        const formatedData = extractData(data);
        formatedData.forEach(async (item) => {
          await saveToDB(item);
        });
      }
      setTimeout(async () => {
        await download("OCV_Discover_Data");
        clearObjectStore(DB_STORE_NAME);
        exportLinkElement.innerText = "export";
      }, 500);
    });
  }

  /**
   * Initial the plugin
   * @return undefined
   */
  function OCVPluginInit() {
    if (matchedURL("#/discover/")) {
      // Add export button after the search box
      const searchBtnGroupSelector =
        "#PageControllerDiv > div > div.filters-and-content-container > div > div.results-column > div > form > fieldset > table > tbody > tr";
      $(document).arrive(searchBtnGroupSelector, () => {
        addExportLink(searchBtnGroupSelector, "#/discover/");
      });
    }
  }

  /**
   * Matching the URL hash with specific keyword
   * @param keyword String
   * @return Boolean
   */
  function matchedURL(keyword) {
    let hash = location.hash;
    return hash.startsWith(keyword) ? true : false;
  }

  openDb();
  OCVPluginInit();
})();
