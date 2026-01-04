// ==UserScript==
// @name         get agent table data
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Save data to local as csv file which seperated by "="
// @author       Bruce Lu
// @include      https://msit.powerbi.com/groups/3bcffed1-af57-414d-87ef-ff75458f96ae/reports/97268ed8-ea31-48e2-9270-c82f33e240b8/ReportSection5053595d317951a27460
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420043/get%20agent%20table%20data.user.js
// @updateURL https://update.greasyfork.org/scripts/420043/get%20agent%20table%20data.meta.js
// ==/UserScript==

(function () {
    "use strict";
    let isMenuAdded = false;
    const headerSelector = "#pvExplorationHost .pivotTable > div.innerContainer > .columnHeaders > div > div";
    const reportNameSelector = "#pvExplorationHost visual-container-pop-out-bar .title";
    let ultilHTML = `
    <div id='util-container' style="position: fixed; width: 350px; top: 90px; right: 400px; overflow: hidden; z-index: 9999;">
      <div style="margin-top: 10px;">
        <button type="button" class="btn btn-primary" id="get-btn" style="margin-top: -5px;">Extract Data</button>
        <button type="button" class="btn btn-primary" id="save-btn" style="margin-top: -5px;">Export</button>
      </div>
    </div>`;


    let timer;
    let headersList;
    let tableBodyData = [];
    let headersData = [];


    function stopExtract() {
        $(document).unbindLeave();
        clearInterval(timer)
        //document.body.style.zoom = "100%";
    }

    /**
     * transform data with special splitor
     * @param Array[] data
     * @param String splitor
     * @returns Array
     */
    function transformData(data, splitor) {
        const result = data.map((item) => {
            return item.join(splitor)
        });
        return result;
    }


    /**
     * transform data with special splitor
     * @param fileName String
     * @returns undefined
     */
    function download(fileName) {
        const cornerSelector = "#pvExplorationHost .pivotTable > .innerContainer > .corner"
        const cornerName = document.querySelector(cornerSelector).textContent.trim()
        let headersListContainCorner = [cornerName, ...headersList]
        let result = mergeBodyCellsAndRowHeaders(tableBodyData, headersData);
        if (!result.length) {
            return;
        }
        let data = transformData(result, "=")
        let headers = headersListContainCorner.join("=")
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
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    /**
     * 
     * @param selector CSS Selector String
     * @returns [string]
     */
    function getHeaders(selector) {
        const headersList = []
        const headersNode = $(selector)
        headersNode.each(function () {
            if (this.textContent) headersList.push(this.textContent.trim())
        })
        return headersList;
    }

    /**
     * 
     * @param divBlocks HTMLCollection 
     * @returns [String]
     */
    function getDivBlockTopPositionSet(divBlocks) {
        const divBlockPositionSet = new Set()
        divBlocks.each((index, block) => {
            const topPosition = block.offsetTop
            if (!divBlockPositionSet.has(topPosition)) {
                divBlockPositionSet.add(topPosition)
            }
        })

        return [...divBlockPositionSet]
    }

    /**
     * 
     * @param position String 
     * @returns String
     */
    function getTopPosition(position) {
        const positionStr = position + '';
        if (positionStr === '0') {
            return positionStr;
        } else {
            return positionStr.substr(0, positionStr.length - 1)
        }
    }

    /**
     * @returns Set
     */
    function getRowHeadersData() {
        const rowHeadersSelector = "#pvExplorationHost .pivotTable > .innerContainer > .rowHeaders > div";
        const rowHeaderColumn = document.querySelector(rowHeadersSelector);
        const rowHeaders = [];
        for (let i = 0; i < rowHeaderColumn.childElementCount; i++) {
            const element = rowHeaderColumn.childNodes[i];
            if (element.style.borderColor === "red") {
                continue;
            }
            rowHeaders.push(element.textContent.trim())
            element.style.border = "1px solid red";
        }
        return rowHeaders;
    }

    /**
     * 
     * @param divBlock HTMLCollection
     * @param rowsArray Array[String]
     * @returns Array[String]
     */
    function extractDivData(divBlock, rowsArray) {
        if (divBlock.style.borderColor === "red") {
            return [];
        }
        divBlock.childNodes.forEach((column) => {
            const columnBlockLength = column.childElementCount
            column.childNodes.forEach((item, itemIndex) => {
                if (item.style.borderColor === "red") return
                if (rowsArray.length >= columnBlockLength) {
                    rowsArray[itemIndex].push(item.textContent);
                } else {
                    rowsArray.push([item.textContent]);
                }
                item.style.border = "1px red solid";
            })
        })
        divBlock.style.border = "1px red solid";
        return rowsArray
    }

    /**
     * @returns Set
     */
    function getColumnBlockDataByTopPostion() {
        const tableBodyContentSelector = "#pvExplorationHost .pivotTable > div.innerContainer > div.bodyCells > div";
        const tableBody = document.querySelector(tableBodyContentSelector)
        const bodyDivBlocks = tableBody.children;
        const divBlockTopPositionArray = getDivBlockTopPositionSet($(bodyDivBlocks))
        let bodyRows = [];
        for (let i = 0; i < divBlockTopPositionArray.length; i++) {
            const divBlockTopPosition = getTopPosition(divBlockTopPositionArray[i]);
            let divBlockArray = document.querySelectorAll(`${tableBodyContentSelector} > div[style*="top:${divBlockTopPosition}"]`)
            if (!divBlockArray.length) {
                divBlockArray = document.querySelectorAll(`${tableBodyContentSelector} > div[style*="top: ${divBlockTopPosition}"]`)
            }
            let rowsBlockArray = []
            divBlockArray.forEach((divBlock) => {
                rowsBlockArray = extractDivData(divBlock, [...rowsBlockArray])
            })
            rowsBlockArray.forEach(item => bodyRows.push(item))
        }
        //const result = Array.from(new Set(bodyRows.map(a => JSON.stringify(a))), json => JSON.parse(json))
        return bodyRows;
    }

    /**
     * 
     * @param bodyCellsData [[String]]
     * @param rowHeadersData [String]
     * @returns [[String]]
     */
    function mergeBodyCellsAndRowHeaders(bodyCellsData, rowHeadersData) {
        if (bodyCellsData.length !== rowHeadersData.length) {
            confirm("The bodyCellsData and headersData are not match, please try again!")
            return [];
        }
        return bodyCellsData.map((bodyCellsRow, index) => {
            return [rowHeadersData[index], ...bodyCellsRow]
        })
    }

    function scrollingTable(deltaY) {
        // Let the last chid of the last div block scroll in to view to trigger the observer callback
        const tableCornerSelector = "#pvExplorationHost .pivotTable > div.innerContainer > div.corner";
        const tableCorner = document.querySelector(tableCornerSelector)
        const evt = document.createEvent('MouseEvents');
        evt.initEvent('wheel', true, true);
        evt.deltaY = +deltaY;
        tableCorner.dispatchEvent(evt)
    }

    /**
     * 
     * @param selector CSS Selector
     * @param htmlString String
     */
    function addMenuInPage(selector, htmlString) {
        if (isMenuAdded) return
        let node = document.querySelector(selector);
        node.insertAdjacentHTML("beforeend", htmlString);
        let saveBtn = document.getElementById("save-btn");
        let getBtn = document.getElementById("get-btn");
        saveBtn.addEventListener("click", () => {
            let reportName = document.querySelector(reportNameSelector).textContent.trim() || "report";
            download(reportName + ".csv");
            stopExtract();
        });

        getBtn.addEventListener("click", () => {
            const isFocusMode = document.querySelector("#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > .popOut")
            if (!isFocusMode) {
                alert('Please change the report to focus mode at the top right hover menu bar')
                return
            }
            init();
        });
        isMenuAdded = true;
    }


    function init() {
        tableBodyData = [];
        headersData = [];
        const horizontalScrollBar = document.querySelector("#pvExplorationHost .pivotTable > div.scroll-bar-div:nth-child(3)")
        if (horizontalScrollBar && horizontalScrollBar.style.visibility !== "hidden") {
            window.confirm("Please zoom out the tab to display the table completely! Otherwise, the extracted data will not be intact.")
            return;
        }
        headersList = getHeaders(headerSelector);
        let preTableBodyDataSize = NaN;
        let preHeadersData = NaN;
        //document.body.style.zoom = "50%";
        if (timer) {
            clearInterval(timer)
        }
        timer = setInterval(() => {
            /*             if (preTableBodyDataSize === tableBodyData.length && headersData.length === preHeadersData) {
                            clearInterval(timer)
                            window.confirm("Data extracted, you can export it by clicking export button.");
                        } */
            let bodyCellsData = getColumnBlockDataByTopPostion()
            let rowHeadrsData = getRowHeadersData()
            tableBodyData = tableBodyData.concat(Array.from(bodyCellsData))
            headersData = headersData.concat(Array.from(rowHeadrsData))
            console.log(`Table body data size:\n${tableBodyData.length}\nHeaders data size:\n${headersData.length}`)
            preHeadersData = headersData.length;
            preTableBodyDataSize = tableBodyData.length;
            scrollingTable(2000)
        }, 2000)
    }

    $(document).arrive(reportNameSelector, function () {
        const reportName = $(this).text();
        if (reportName !== "Agent Data") return;
        console.log("appBarContent element created, insert button to the page...");
        addMenuInPage("#pbiAppPlaceHolder", ultilHTML);
    });
})();
