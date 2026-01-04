// ==UserScript==
// @name         Hilan Fill Hours
// @namespace    https://greasyfork.org/en/scripts/430194/
// @grant        none
// @version      0.2
// @description  Adds a button to Hilan to fill hours
// @author       Aviem Zur
// @match        https://payroll.net.hilan.co.il/Hilannetv2/Attendance*
// @downloadURL https://update.greasyfork.org/scripts/430194/Hilan%20Fill%20Hours.user.js
// @updateURL https://update.greasyfork.org/scripts/430194/Hilan%20Fill%20Hours.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ENTRY_TIME = "09:00"
    var EXIT_TIME = "17:36"
    var TOTAL_TIME = "08:36"

    function addFillBtn() {
        function clickBtn(btn) { btn.click() }

        var btn = document.createElement("span")
        btn.innerText = "מלא שעות"
        btn.id = "fillBtn"
        btn.className = "buttonNormalBodySelected hbutton2 buttonNormalBody"

        btn.onclick = function() {
            var entryInputs = document.evaluate("//input[contains(@name, 'ManualEntry')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
            for (var i = 0; i < entryInputs.snapshotLength; i++) {
                var entryInput = entryInputs.snapshotItem(i)
                entryInput.value = ENTRY_TIME
                entryInput.click()
            }
            var exitInputs = document.evaluate("//input[contains(@name, 'ManualExit')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
            for (var j = 0; j < exitInputs.snapshotLength; j++) {
                var exitInput = exitInputs.snapshotItem(j)
                exitInput.value = EXIT_TIME
                exitInput.click()
            }
            var totalInputs = document.evaluate("//span[contains(@id, 'ManualTotal')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
            for (var k = 0; k < totalInputs.snapshotLength; k++) {
                var totalInput = totalInputs.snapshotItem(k)
                totalInput.value = TOTAL_TIME
                totalInput.click()
            }
            //setTimeout(function(){ document.getElementsByClassName('primary')[0].click() }, 5000)
        }

        var btnSection = document.evaluate("//span[@id='ctl00_mp_upBtns']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).parentNode
        btnSection.appendChild(btn)
    }

    if (window.addEventListener) {
        window.addEventListener('load', addFillBtn)
    } else {
        window.attachEvent('onload', addFillBtn)
    }
})();