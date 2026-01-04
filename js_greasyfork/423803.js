// ==UserScript==
// @name         Rave Admin Quality Tool
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  get quality data by filters
// @author       Bruce Lu
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @match        https://beta.rave.office.net/admin/quality
// @match        https://rave.office.net/admin/quality
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423803/Rave%20Admin%20Quality%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/423803/Rave%20Admin%20Quality%20Tool.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let isMenuAdded = false;

  let ultilHTML = `
      <div class="qm-btn-pad-top btn-filters ng-scope">
          <button id="export-btn" type="button" class="btn btn-success btn-caselist-height">
              <i class="ms-Icon-FullMDL ms-Icon-FullMDL--Save"></i>
              <span translate="" class="ng-scope">Export to CSV</span>
          </button>
      </div>
    `;

  function getAngularController(selector, controllerName) {
    if (!angular.element) return;
    let scope = angular.element($(selector)).scope();
    return scope && scope[controllerName];
  }

  /**
   *
   * @param node Node
   * @param htmlString String
   */
  function addMenuInPage(node, htmlString) {
    if (isMenuAdded) return;
    node.insertAdjacentHTML("beforeend", htmlString);
    let exportBtn = document.getElementById("export-btn");
    exportBtn.addEventListener("click", async () => {
      const data = await getData();

      const reportName = "report";
      download(data, reportName);
      $(document).unbindLeave();
    });

    isMenuAdded = true;
  }

  function transformData(requestsArray, splitor) {
    const transformedData = [];
    requestsArray.forEach((request) => {
      transformedData.push(Object.values(request).join(splitor));
    });
    return transformedData;
  }

  /**
   * export the data as a CSV file
   * @param ticketsArray Array [Object]
   * @param fileName String
   * @returns undefined
   */
  function download(ticketsArray, fileName) {
    if (!ticketsArray.length) {
      return;
    }
    let headers = Object.keys(ticketsArray[0]).join("=");
    let data = transformData(ticketsArray, "=");
    let csvContent = [headers, ...data].join("\n");
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
   * get the current page binding data
   *
   * @returns Array [Object]
   */
  function getCurrentPageData() {
    const qualityControllerSelector = `a[ng-click^="qualityController.ManualRefresh()"]`;
    const qualityController = getAngularController(
      qualityControllerSelector,
      "qualityController"
    );
    if (!qualityController.IsLoadingDatas) {
      const requests = qualityController.CurrentPageBindingSupportRequests;
      const ticketsArray = [];
      requests.forEach((request) => {
        const { Alerts, AmbassadorFullName } = request;
        const {
          CreateDateTime,
          CompletedDateTime,
          ParatureTicketNumber,
          UserDescription,
          Rating,
        } = request.RequestData;

        ticketsArray.push({
          Alerts: Alerts.length,
          CreateDateTime,
          ClosedDateTime: CompletedDateTime,
          CaseNumber: ParatureTicketNumber,
          AmbassadorFullName,
          UserDescription:
            UserDescription &&
            (UserDescription.length <= 100
              ? UserDescription.replace(/[(?:\r\n|\r|\n)|"="]/g, " ")
              : UserDescription.replace(/[(?:\r\n|\r|\n)|"="]/g, " ").slice(
                  0,
                  99
                ) + "..."),
          Rating: Rating || 0,
        });
      });
      console.log(ticketsArray[ticketsArray.length - 1]);
      return ticketsArray;
    }
  }

  /**
   * export the data as a CSV file
   *
   * @returns Promise<Array[Object]>
   */
  async function getData() {
    return new Promise((resolve, reject) => {
      try {
        let requestsArray = [];
        const nextBtn = document.querySelector(
          `a[ng-click="selectPage(page + 1, $event)"]`
        );
        $(".admin-panel").leave(".large-progress", function () {
          const pageData = getCurrentPageData();
          requestsArray = requestsArray.concat(pageData);
          if (nextBtn.getAttribute("disabled") === "disabled") {
            resolve(requestsArray);
          } else {
            nextBtn.click();
          }
        });
        // get the first page data
        requestsArray = requestsArray.concat(getCurrentPageData());

        if (nextBtn.getAttribute("disabled") === "disabled") {
          resolve(requestsArray);
        } else {
          nextBtn.click();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  function ravePluginInit() {
    $(document).arrive(".filter-container", { onceOnly: true }, function () {
      addMenuInPage(this, ultilHTML);
    });
  }

  ravePluginInit();
})();
