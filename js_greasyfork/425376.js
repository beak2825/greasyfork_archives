// ==UserScript==
// @name         Get BI PopOut Table Report Data
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Save BI popout table data to local as csv file which seperated by "="
// @author       Bruce Lu
// @include      https://msit.powerbi.com/groups/*/reports/*/ReportSection*
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @require      https://cdn.jsdelivr.net/npm/object-hash@2.0.3/dist/object_hash.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425376/Get%20BI%20PopOut%20Table%20Report%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/425376/Get%20BI%20PopOut%20Table%20Report%20Data.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let isMenuAdded = false;
  const popOutContainerSelector = "visual-container-modern > transform > .popOut"
  const rowSelector =
        `${popOutContainerSelector} visual-modern > div > div > .tableEx > .innerContainer > .columnHeaders`;
  const loadingCircleSelector = ".powerbi-spinner > .spinner > .circle";
  const reportNameSelector =
        "ng-include:last-child > .breadcrumb > ng-include > span.pbi-fcl-np";

  const tableBodyContentSelector =
        `${popOutContainerSelector} .bodyCells > div`;
  let ultilHTML = `
      <div _ngcontent-ipx-c30 class="app-bar-right">
      <button _ngcontent-efd-c30 class="rightActionBarBtn ng-star-inserted" id="get-btn" style="display: inline-block; padding: 12px;" title="Start Extract Data">Extract Data</button>
      <button _ngcontent-efd-c30 class="rightActionBarBtn ng-star-inserted" id="save-btn" style="display: inline-block; padding: 12px;" title="Export Data">Export</button>
      </div>
  `;


  let db;
  let timer;
  let headersList;
  const DB_NAME = "Report";
  const DB_VERSION = 1; // Use a long long for this value (don't use a float)
  const DB_STORE_NAME = "Posts";


  function stopExtract() {
      clearInterval(timer);
      //observer.disconnect();
      $(document).unbindLeave();
  }

  /**
 * transform data from IndexedDB
 * @param {object []} storeItemList
 */
  function transformData(storeItemList) {
      const result = [];
      storeItemList.forEach((element) => {
          delete element.Id;
          result.push(Object.values(element).map(text => text.replace(/[(?:\r\n|\r|\n)|"="]/g, " ")).join("="));
      });
      result.unshift(headersList.join("="));
      return result;
  }

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

  async function download(fileName) {
      let store = getObjectStore(DB_STORE_NAME, "readonly");
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
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }

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
                  keyPath: "Id",
              });
          }

          objectStore.createIndex("Id", "Id", {
              unique: true,
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
 * @param {object} caseDetailObj
 */
  function saveToDB(item) {
      return new Promise((resolve, reject) => {
          let store = getObjectStore(DB_STORE_NAME, "readwrite");
          let req = store.add(item);
          req.onsuccess = function (event) {
              console.log(`Id: ${item.Id} saved!`);
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

  function getHeaders() {
      const headersList = []
      const columnHeadersSelector = `${popOutContainerSelector} .columnHeaders > div > div`
      const headersNode = $(columnHeadersSelector)
      headersNode.each(function () {
          if (this.textContent) headersList.push(this.textContent.trim())
      })
      return headersList;
  }

  function getDivBlockTopPositionSet(divBlocks) {
      const divBlockPositionSet = new Set()
      divBlocks.forEach((block) => {
          const topPosition = block.offsetTop
          if (!divBlockPositionSet.has(topPosition)) {
              divBlockPositionSet.add(topPosition)
          }
      })

      return [...divBlockPositionSet]
  }

  function extractDivData(divBlock, startIndex, threadsArray) {
      const step = 10
      divBlock.childNodes.forEach((column, columnIndex) => {
          const headName = headersList[columnIndex + startIndex * step].trim().replace(/\s/g, '')
          const columnBlockLength = column.childElementCount
          column.childNodes.forEach((item, itemIndex) => {
              const timeStamp = Date.now()
              const threadObj = {}
              if (threadsArray.length >= columnBlockLength) {
                  const thread = threadsArray[itemIndex];
                  // rename the duplicate column's header
                  if (headName in thread) {
                      thread[headName + itemIndex] = item.textContent
                  }
                  thread[headName] = item.textContent
              } else {
                  threadObj[headName] = item.textContent
                  threadsArray.push(threadObj)
              }
          })
          column.style.border = "2px solid red";
      })
      return threadsArray
  }

  function getTopPosition(position) {
      const positionStr = position + '';
      if (positionStr === '0') {
          return positionStr;
      } else {
          return positionStr.substr(0, positionStr.length - 1)
      }
  }

  async function getColumnBlockDataByTopPostion() {
      const divBlocks = document.querySelectorAll(`${popOutContainerSelector} .tableEx > div.innerContainer > div.bodyCells > div > div`);
      const divBlockTopPositionArray = getDivBlockTopPositionSet(divBlocks)
      const lastDivBlock = document.querySelector(`${popOutContainerSelector} div.tableEx > .innerContainer > .bodyCells > div > div:last-child`);
      let result = []
      for (let i= 0; i < divBlockTopPositionArray.length; i++) {
          const divBlockTopPosition = getTopPosition(divBlockTopPositionArray[i]);
          const divBlockArray = document.querySelectorAll(`${popOutContainerSelector} .tableEx > div.innerContainer > div.bodyCells > div > div[style*="top:${divBlockTopPosition}"]`)
          let threadsArray = []
          divBlockArray.forEach((divBlock, divBlockIndex) => {
              if (divBlock.style.border === "2px solid red") return;
              threadsArray = extractDivData(divBlock, divBlockIndex, [...threadsArray])
              divBlock.style.border = "solid 2px red";
          })
          //console.log(threadsArray)
          result = [...result, ...threadsArray]
      }

      //console.log(result)
      for (let thread of result) {
          thread.Id = objectHash.sha1(thread);
          let isInDB = await searchInDB(thread.Id);
          if (isInDB) {
              console.log(`Id: ${thread.Id} is stored in DB, skipped`);
              continue;
          }
          await saveToDB(thread)
      }
      lastDivBlock.lastElementChild.lastElementChild.style.backgroundColor = "red";
      scrollY();
      /*         if (!isScrolledAtBottom()) {
          const lastDivBlock = document.querySelector(`${popOutContainerSelector} div.tableEx > .innerContainer > .bodyCells > div > div:last-child`);
          lastDivBlock.lastElementChild.lastElementChild.scrollIntoView()
      } else {
          stopExtract()
          window.confirm('Finished, you can export the data to CSV file.')
      } */

  }


  function addMenuInPage(selector, htmlString) {
      if (isMenuAdded) return
      let node = document.querySelector(selector);
      node.insertAdjacentHTML("afterend", htmlString);
      let saveBtn = document.getElementById("save-btn");
      let getBtn = document.getElementById("get-btn");
      saveBtn.addEventListener("click", () => {
          let reportName = "report";
          download(reportName + ".csv");
          stopExtract();
          
      });

      getBtn.addEventListener("click", () => {
          const isFocusMode = document.querySelector(popOutContainerSelector)
          if (!isFocusMode) {
              window.confirm('Please change the report to "Focus mode" at the top right hover menu bar and zoom out the tab to includes all columns.')
              return
          }
          init();
      });
      isMenuAdded = true;
  }

  function isScrolledAtBottom() {
      let tableContainer = document.querySelector(`${popOutContainerSelector} .tableExContainer`);
      if (!tableContainer) {
          throw new Error("Cannot find the table container");
      }
      let scrollBarDiv = tableContainer.querySelector(".scroll-bar-div:last-child")
      let scrollBar = scrollBarDiv.querySelector(".scroll-bar-part-bar")
      const scrolledY = scrollBar.offsetTop + scrollBar.clientHeight
      const scrollBarPartArrowHeight = 27;
      const scrollBarContainerInnerHeight = scrollBarDiv.clientHeight - scrollBarPartArrowHeight;
      if ((scrollBarContainerInnerHeight - scrolledY) <= 1) {
          return true;
      }
      return false;
  }

  function scrollY(deltaY = 3500) {
      const columnHeadersSelector = `${popOutContainerSelector} .columnHeaders > div > div`
      const headersNode = document.querySelector(columnHeadersSelector)
      headersNode.addEventListener('wheel', () => {
          if (timer) clearTimeout(timer)
          if (document.querySelector(loadingCircleSelector)) return
          timer = setTimeout(async() => {
              if (isScrolledAtBottom()) {
                  window.confirm('Finished, you can export the data to CSV file.')
                  stopExtract()
              } else {
                  await getColumnBlockDataByTopPostion()
              }
          }, 2000)
      })
      let evt = document.createEvent("MouseEvents");
      evt.initEvent("wheel", true, true);
      evt.deltaY = +deltaY;
      headersNode.dispatchEvent(evt);
      console.log("scrolling the table...");
  }


  async function init() {
      headersList = getHeaders();
      if (timer) clearInterval(timer);
      await getColumnBlockDataByTopPostion()
  }

  $(document).arrive(".appBarContent", function () {
      const popOutContainer = document.querySelector
      console.log("appBarContent element created, insert button to the page...");
      addMenuInPage(".appBarContent > div", ultilHTML);
  });

  openDb();
})();
