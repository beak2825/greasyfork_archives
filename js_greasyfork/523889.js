// ==UserScript==
// @name         Compile ETQ Document Details
// @namespace    https://greasyfork.org/en/scripts/523889-compile-etq-document-details
// @version      2025.05.23
// @description  Supports with gathering document information (e.g. description and revision) from ETQ - FPH.
// @author       Nicholas Kam
// @match        https://fisherpaykel.etq.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=etq.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523889/Compile%20ETQ%20Document%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/523889/Compile%20ETQ%20Document%20Details.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', () => {
        // Adds a listener to the page and injects the elements when it's on the correct page
        new MutationObserver(runOnLoad).observe(document, {childList: true, subtree: true})

        function runOnLoad(changes, observer){
            // Grab the container to put the information in
            var referenceNode ='app-view.ng-star-inserted'
            // Early return - checks if the search area even exist.
            if(! document.querySelector(referenceNode)) return;
            CreateGetDocNumEl()
        }

        function CreateGetDocNumEl(){
            // Early return. Doesn't make duplicate boxes
            if(document.getElementById('SearchBoxContainer')) return ;

            // Grab the container to put the information in
            var referenceNode = document.querySelector('app-view.ng-star-inserted')
            // Early return - checks if the search area even exist.
            if(!referenceNode) return;
            // Create an HTML element to house all of the inputs and outputs
            const SearchBoxContainer = document.createElement("div")
            SearchBoxContainer.id = 'SearchBoxContainer'
            referenceNode.insertBefore(SearchBoxContainer, referenceNode.firstChild)

            SearchBoxContainer.setAttribute("style", "display:flex; width:100%; height: fit-content; min-height:3em; z-index=100;minheight=2em; position:static; background-color:white; align-items:center; padding-left:5px; border: 2px solid #bdc3c7")
            SearchBoxContainer.className = "row no-gutters"
            const TitleAndMinimizeContainer = document.createElement("div")
            SearchBoxContainer.appendChild(TitleAndMinimizeContainer)
            TitleAndMinimizeContainer.setAttribute("style", "display:flex; flex-direction:row; align-items: stretch; width: 100%")


            // Box Header
            const titleBlock = document.createElement("H4")
            titleBlock.setAttribute("style", "flex-grow: 1; cursor:pointer; user-select: none")
            TitleAndMinimizeContainer.appendChild(titleBlock)
            titleBlock.innerHTML = "Get Document Information"
            titleBlock.addEventListener('click', () => {
                document.getElementById('minimizeButton').click()
            })

            // minimize button
            const minimizeButton = document.createElement("button")
            TitleAndMinimizeContainer.appendChild(minimizeButton)
            minimizeButton.id = 'minimizeButton'
            minimizeButton.setAttribute("style", "display: block; height: 30px; width: 30px; margin:5px; cursor:pointer")
            minimizeButton.innerHTML = "+"
            minimizeButton.addEventListener('click' , () => {
                let targetEl = document.getElementById("inputBoxAndButtonsContainer");
                let thisButton = document.getElementById('minimizeButton');
                if(getComputedStyle(targetEl)['display'] != "none") {
                    targetEl.style.display = "none";
                    thisButton.innerHTML = "+"
                } else {
                    targetEl.style.display = "flex";
                    thisButton.innerHTML = "-"
                }
            })

            // Input box and action buttons container
            const inputBoxAndButtonsContainer = document.createElement("div")
            SearchBoxContainer.appendChild(inputBoxAndButtonsContainer)
            inputBoxAndButtonsContainer.id = "inputBoxAndButtonsContainer"
            inputBoxAndButtonsContainer.setAttribute("style", "display:none;  flex-direction:column; width:100%; height: fit-content; min-height: 1.5em; z-index=100;min-height=1em; position:relative; background-color:inherit;")

            // Input box
            const docInputBox = document.createElement("textarea")
            inputBoxAndButtonsContainer.appendChild(docInputBox)
            docInputBox.id = 'docInputBox'
            docInputBox.setAttribute("style", "width:100%; height:7em")
            docInputBox.placeholder = "Input list of documents here. You can copy directly from a Word table, e.g.:\nSOP-1234\nJI-2115\nGD-501"


            // Buttons Container
            const buttonsContainer = document.createElement("div")
            inputBoxAndButtonsContainer.appendChild(buttonsContainer)
            buttonsContainer.setAttribute("style", "display:flex; width:100%; height: fit-content; min-height: 1.5em; z-index=100;min-height=1em; position:relative; background-color:inherit; justify-content:end; gap:5px; padding:5px")

            // Clear Entry Button
            const clearButton = document.createElement("button")
            buttonsContainer.appendChild(clearButton)
            clearButton.textContent = "Clear"
            clearButton.setAttribute("style","cursor:pointer")
            clearButton.removeAllListeners()
            clearButton.addEventListener('click', () => {
                observer.disconnect()
                document.getElementById('docInputBox').value = "";
                document.querySelector(documentNumberPath).value = ""
                document.querySelector(documentNumberPath).dispatchEvent(simulateInput)
                clearLocalData()
            })

            // Set up observer's scan area
            let searchAreaPath = 'div.ag-center-cols-container'
            // let searchAreaEl = document.querySelector(searchAreaPath)

            // Fetch document Button
            const fetchButton = document.createElement("button")
            buttonsContainer.appendChild(fetchButton )
            fetchButton.textContent = "Fetch data"
            fetchButton.setAttribute("style","cursor:pointer")
            fetchButton.removeAllListeners()
            fetchButton.addEventListener('click', () => {
                let searchAreaEl = document.querySelector(searchAreaPath)
                observer.disconnect()
                observer.observe(searchAreaEl, observerConfig)

                InputDocStr = document.getElementById('docInputBox').value
                InputDocArr = InputDocStr.split(/[\r|\n| |,|\t]/).filter(item => item);
                DocArrList = Array.from(InputDocArr)
                if(InputDocArr.length > 0) docSeachLoopTimeout = setTimeout(getDocInfo, 100, InputDocArr, OutputDocArr, searchAreaEl)
            })

            //=======================================================================//
            // Functions and Observers //
            // Set up the doc input section
            const documentNumberPath = "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off.ag-header-allow-overflow > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(2) input"
            var documentNumberEl = document.querySelector(documentNumberPath);

            // Set up a way to trigger ETQ to accept entry
            const simulateInput = new Event('input', {bubbles: true});

            // Extract array from input
            let InputDocStr = "";
            let InputDocArr = [];
            let OutputDocArr = [];
            let DocArrList = [];

            // Input the first entry. The mutation observer will loop through the rest. Debug only.
            // if(InputDocArr.length > 0) UpdateDocumentInput(InputDocArr.shift())


            // Function to add text to ETQ's document field
            function UpdateDocumentInput(docName){
                if(docName != ""){
                    var documentNumberEl = document.querySelector("#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off.ag-header-allow-overflow > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(2) input");
                    const simulateInput1 = new KeyboardEvent('input', {bubbles: true});
                     const simulateInput2 = new KeyboardEvent("keydown", {
                        key: 'Enter',
                        code: 'Enter',
                        which: 13,
                        keyCode: 13,
                        bubbles: true
                    })
                    documentNumberEl.value = docName
                    // Forces ETQ to update
                    documentNumberEl.dispatchEvent(simulateInput1)
                    documentNumberEl.dispatchEvent(simulateInput2)
                }
            }

            // MutationObserver to listen for updates. When there's no updates for 500ms, it'll collect information about the visible documents and then grabs the information that are visible.
            let docSeachLoopTimeout;
            let updateDocInfoTimeout;
            let skipDocTimeout;
            let filterDocTileout;
            const observer = new MutationObserver(function(mutations){
                let searchAreaEl = document.querySelector(searchAreaPath)
                clearTimeout(docSeachLoopTimeout);
                docSeachLoopTimeout = setTimeout(getDocInfo, 1000, InputDocArr, OutputDocArr, document.querySelector(searchAreaPath))

                // update data
                //clearTimeout(updateDocInfoTimeout) // only updates data when the searches are complete.
                updateDocInfoTimeout = setTimeout(() => {
                    document.getElementById('docInputBox').value = filterDocArr().map(item => `${item.DocumentNumber}\t${item.Title}\t${item.Revision}`).join('\n')
                } , 2000)

                // skip entry if no data shows up. This loops.
                clearInterval(skipDocTimeout);
                skipDocTimeout = setInterval(getDocInfo, 5000, InputDocArr, OutputDocArr, document.querySelector(searchAreaPath))
            })
            var observerConfig = { attributes: false, childList: true, characterData: false, subtree: true};

            // Create a function that gets document information and then searches the next doc.
            function getDocInfo (inputDocArr, ouputDocArr, targetElContainer){
                const targetDocNumber = document.querySelector(documentNumberPath).value
                const rowsEl = targetElContainer.querySelectorAll('[row-index]')
                if(rowsEl.length > 0){ rowsEl.forEach((row) => {
                    if(row.querySelector('[aria-colindex = "2"]').textContent.toUpperCase() === targetDocNumber.toUpperCase()){
                        ouputDocArr.push({
                            DocumentNumber: row.querySelector('[aria-colindex = "2"]').textContent,
                            Revision: row.querySelector('[aria-colindex = "3"]').textContent,
                            Title: row.querySelector('[aria-colindex = "4"]').textContent
                        })
                    }
                })}
                if(inputDocArr.length > 0){
                    UpdateDocumentInput(inputDocArr.shift())
                } else {
                    // Clears all pending searches if there's no more left to search. Also clears the mutation observer.
                    clearTimeout(docSeachLoopTimeout);
                    clearInterval(skipDocTimeout);
                    observer.disconnect();
                }
            }

            // Clears the variables
            function clearLocalData(){
                InputDocStr = ""
                InputDocArr = []
                OutputDocArr = []
                DocArrList = []
            }

            function filterDocArr(){
                return DocArrList.filter(item => item).map((item) => {
                    return OutputDocArr.reduce((accumulator, current) => {
                        return item.toUpperCase() === current.DocumentNumber.toUpperCase() && (!accumulator.Revision || current.Revision > accumulator.Revision) ? current : accumulator
                    }, {DocumentNumber: item})
                })
            }
        }
    }, false)
})();