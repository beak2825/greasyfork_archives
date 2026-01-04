// ==UserScript==
// @name         WhatNot Export Shipments
// @namespace    http://tampermonkey.net/
// @version      2025
// @description  This is a new description.
// @author       You
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @match        https://www.whatnot.com/dashboard/shipments*
// @downloadURL https://update.greasyfork.org/scripts/513344/WhatNot%20Export%20Shipments.user.js
// @updateURL https://update.greasyfork.org/scripts/513344/WhatNot%20Export%20Shipments.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    console.log('start')

    var parentNode = document.createElement('div');
    parentNode.style.position = 'fixed';
    parentNode.style.top = '50%';
    parentNode.style.right = '0';
    parentNode.style.transform = 'translateY(-50%)';
    parentNode.style.backgroundColor = 'green';
    parentNode.style.padding = '10px';
    parentNode.style.fontSize = '2em'; // 2 times bigger font size
    parentNode.style.zIndex = '9999'; // Set a high z-index
    document.body.appendChild(parentNode);

    //Time node
    var timeNode = document.createElement('div');
    timeNode.innerHTML = 'Time left: 0'; // Initial text
    parentNode.appendChild(timeNode);

    // Create a button
    var buttonExport = document.createElement('button');
    buttonExport.innerHTML = 'Parse page';
    buttonExport.style.width = '100px'; // Adjust width as necessary
    buttonExport.style.height = '50px'; // Adjust height as necessary
    buttonExport.style.fontSize = '1em'; // Reset font size for button
    parentNode.appendChild(buttonExport);

    var buttonPrint = document.createElement('button');
    buttonPrint.innerHTML = 'Print';
    buttonPrint.style.width = '100px'; // Adjust width as necessary
    buttonPrint.style.height = '50px'; // Adjust height as necessary
    buttonPrint.style.fontSize = '1em'; // Reset font size for button
    parentNode.appendChild(buttonPrint);

    var buttonPrintLabels = document.createElement('button');
    buttonPrintLabels.innerHTML = 'Labels';
    buttonPrintLabels.style.width = '100px'; // Adjust width as necessary
    buttonPrintLabels.style.height = '50px'; // Adjust height as necessary
    buttonPrintLabels.style.fontSize = '1em'; // Reset font size for button
    parentNode.appendChild(buttonPrintLabels);
    console.log(buttonPrintLabels)

    const sleep = (delay) => {
        let totalTime = delay / 1000
        updateTimeLeft(totalTime)
        let intervalId = setInterval(() => {
            totalTime -= 0.1
            updateTimeLeft(Math.round(totalTime * 10) / 10);
        }, 100)
        let promise = (new Promise((resolve) => setTimeout(resolve, delay))).then(() => {
          clearInterval( intervalId)

            updateTimeLeft(0)
        })
        return promise
    }

    // Example function to update the time left text
    function updateTimeLeft(time) {
        timeNode.innerHTML = 'Time left: ' + time;
    }

    let list = new Map()
    // Attach click event listener to the button
    buttonExport.addEventListener('click', exportShipments);
    buttonPrint.addEventListener('click', printShipments);
    buttonPrintLabels.addEventListener('click', printLabels);

    function printShipments() {
        const obj = {};
for (const [key, value] of list) {
    obj[key] = value;
}
let v = JSON.stringify(obj)
console.log(v);
        navigator.clipboard.writeText(v);
    }

    function exportShipments() {
         let tbody = document.querySelectorAll('tbody')[0]
         console.log('iterating', tbody, tbody.childNodes)
         for (let tr of Array.from(tbody.childNodes).reverse()) {
             let usernameTr = tr.childNodes[2]
             let usernameContainer = usernameTr.childNodes[0].childNodes[0]
             let username = usernameContainer.childNodes[0].innerText ?? usernameContainer.childNodes[0].textContent
             if (usernameContainer.childNodes.length > 1) {
                     username = usernameContainer.childNodes[1].innerText
                 }

             if (!list.has(username)) {
                 list.set(username, 0)
             }

             let amountTr = tr.childNodes[4]
             let amountContainer = amountTr.childNodes[0].childNodes[0]
             let amount = parseInt(amountContainer.innerText)
             console.log(tr, username, amount, list.get(username), list.get(username) + amount)
             list.set(username, list.get(username) + amount)
         }
        console.log('done')
    }

    let printIndex = 0
    let printStep = 10
    function printLabels() {
        let tbody = document.querySelectorAll('tbody')[0]
        console.log('print', printIndex + 1, printIndex + 1 + printStep)
        let i = 0
        let nodes = Array.from(tbody.childNodes)
        let arr = nodes.slice(printIndex, printIndex + printStep)
        console.log(nodes, arr)
        for (let tr of arr.reverse()) {
            if (tr.childNodes.length < 12) {
                console.log(tr, 'doesn\'t have 12th children')
                continue
            }
            let printTr = tr.childNodes[11]
            if (printTr.childNodes.length < 1) {
                console.log(printTr, 'doesn\'t have 1st children')
                continue
            }
            if (printTr.childNodes[0].childNodes.length < 1) {
                console.log(printTr.childNodes[0], 'doesn\'t have 1st children')
                continue
            }
            let printA = printTr.childNodes[0].childNodes[0]
            if (printA.href == "" || printA.href == undefined) {
                console.log(printA, 'doesn\'t have href')
                continue
            }
            let href = printA.href
            i++
            setTimeout(() => {
                window.open(href, '_blank');

                console.log(href)
            }, i * 250)
        }
        printIndex+=i
        console.log('done')
    }

    console.log('init logic')
})();