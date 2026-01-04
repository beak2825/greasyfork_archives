// ==UserScript==
// @name         WaniKani Erase Vocabulary Reviews
// @version      1.0
// @namespace    https://www.wanikani.com/
// @license      MIT
// @description  Removes Vocabulary items from the current review queue on WaniKani. Refresh the browser to have them back.
// @author       aendur
// @match        *://www.wanikani.com/review/session*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426633/WaniKani%20Erase%20Vocabulary%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/426633/WaniKani%20Erase%20Vocabulary%20Reviews.meta.js
// ==/UserScript==

/*
Copyright © 2021 Aendur

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {
	'use strict';
	(function() {
        $.jStorage.listenKeyChange("activeQueue", initialize);
	})();

    function initialize() {
        // detatch from jStorage
        $.jStorage.stopListening("activeQueue", initialize);

        // include a new button and shelf
        var newHtml = '<li id="option-erase-voc"><span title="Erase Vocabulary"><i class="icon-erase-voc" style="font-weight:bold">消</i></span></li>'
        document.getElementById('option-audio').insertAdjacentHTML("afterend", newHtml);
        var shelf = document.querySelectorAll("#additional-content ul li");
        var width = 99.99 / shelf.length;
        shelf.forEach(e => { e.style.width = width + "%"; });

        // check if the button should be enabled
        if (checkEnable()) {
            var element = document.getElementById('option-erase-voc');
            element.addEventListener('click', eraseVocab);
        } else {
            disableButton();
        }
	}

    function checkEnable() {
        var nRad = 0;
        var nKan = 0;
        var nVoc = 0;
        var reviewQueue = (jsGet("activeQueue")).concat(jsGet("reviewQueue"));
        var i;
        for (i = 0; i < reviewQueue.length; ++i) {
            if("rad" in reviewQueue[i]) { ++nRad; }
            else if("kan" in reviewQueue[i]) { ++nKan; }
            else if("voc" in reviewQueue[i]) { ++nVoc; }
        }
        return (nRad + nKan > 0) && (nVoc > 0);
    }

    function jsGet(key) {
        return $.jStorage.get(key);
    }

    function jsSet(key, val) {
        $.jStorage.set(key, val);
    }

    function disableButton() {
        var element = document.getElementById('option-erase-voc');
        element.classList.add('disabled');
        element.removeEventListener('click', eraseVocab);
    }

    function eraseVocab() {
        // retrieve item queue
        var activeQueue = jsGet("activeQueue");
        var reviewQueue = jsGet("reviewQueue");
        var activeQueueLength = activeQueue.length;

        // remove vocabulary items
        spliceQueue(activeQueue);
        spliceQueue(reviewQueue);

        // set active and review queues
        reviewQueue = activeQueue.concat(reviewQueue);
        activeQueue = reviewQueue.splice(0, activeQueueLength);

        // update current item with a new random item from the new active queue
        var currentItem = updateCurrentItem(activeQueue);
        var questionType = updateQuestionType(currentItem);

        // push modified queue. The order matters
        jsSet("questionType", questionType);
        jsSet("currentItem", currentItem);
        jsSet("reviewQueue", reviewQueue);
        jsSet("activeQueue", activeQueue);
        disableButton();
	}

	function spliceQueue(queue) {
        var i;
		for (i = 0; i < queue.length; ++i) {
            if("voc" in queue[i]) {
                queue.splice(i--, 1);
            }
        }
	}

    function updateCurrentItem(queue) {
        var item2 = queue[Math.floor(Math.random() * queue.length)];
        return item2;
    }

    function updateQuestionType(item) {
        if ("rad" in item) {
            return "meaning";
        } else {
            return (Math.floor(Math.random() * 2)) == 0 ? "reading" : "meaning";
        }
    }
})();
