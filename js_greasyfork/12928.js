// ==UserScript==
// @name         IoT Simulator - Randomize values
// @namespace    http://your.homepage/
// @version      0.1
// @description  Add checkbox next to the 'UP' and 'DOWN' buttons. When checked, will randomly change sensor values.
// @author       Rophy Tsai <tsaiyl@tw.ibm.com>
// @match        https://quickstart.internetofthings.ibmcloud.com/iotsensor/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12928/IoT%20Simulator%20-%20Randomize%20values.user.js
// @updateURL https://update.greasyfork.org/scripts/12928/IoT%20Simulator%20-%20Randomize%20values.meta.js
// ==/UserScript==

// Affects how fast the values change, bigger = slower.
var tick = 1;

function reading(readingNode) {
    try {
        return parseInt($(readingNode).text().match(/\d+/)[0]);
    } catch (ex) {
        return -1;
    }
}

function randomize(initialValue, readingNode, upButton, downButton) {
    
    if (!readingNode.valueChangeTime) {
        readingNode.valueChangeTime = new Date();
        return;
    }
    
    // chance for value change grows with time passed since last change.
    var chance = 1 - 1000*tick / (new Date() - readingNode.valueChangeTime);
    var roll = Math.random();
    if (roll > chance) {
        return;
    }
    
    
    readingNode.valueChangeTime = new Date();
    
    // up or down?
    
    var value = reading(readingNode);
    var delta = Math.abs( value - initialValue );
    // chance for further away decreases with bigger delta.
    chance = 1 / (2+delta/10);
    roll = Math.random();
    
    console.log(roll, chance, value, initialValue);
    if (roll < chance) {
        if (value > initialValue) {
            upButton.click();
        } else {
            downButton.click();
        }
    } else {
        if (value > initialValue) {
            downButton.click();
        } else {
            upButton.click();
        }
    }
    
}

$('.readingButtons').append('<input type="checkbox" class="randomize" style="margin-left:10px">');

function initRandomize(parentSelector, readingId, upId, downId) {
    $(parentSelector+' .randomize').on('change', function() {
        if (this.checked) {
            var readingNode = document.getElementById(readingId);
            var upButton = document.getElementById(upId);
            var downButton = document.getElementById(downId);
            var initialValue = reading(readingNode);
            this.randomizeHandle = setInterval( function() {
                randomize(initialValue, readingNode, upButton, downButton);
            }, tick*1000);
        } else {
            clearInterval(this.randomizeHandle);
        }
    });
}

initRandomize('.navy.item', 'tempReading', 'tempUp', 'tempDown');
initRandomize('.orange.item', 'objectTempReading', 'objectTempUp', 'objectTempDown');
initRandomize('.green.item', 'humidityReading', 'humidityUp', 'humidityDown');
