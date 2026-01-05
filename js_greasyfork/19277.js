// ==UserScript==
// @name         [HF] Colored thread reply numbers
// @namespace    @iNeo19
// @version      1.1
// @description  Color the thread reply number based on the post count.
// @author       You
// @match        http://hackforums.net/search.php?action=results&sid=*
// @match        http://hackforums.net/forumdisplay.php?fid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19277/%5BHF%5D%20Colored%20thread%20reply%20numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/19277/%5BHF%5D%20Colored%20thread%20reply%20numbers.meta.js
// ==/UserScript==

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function styleElement(element) {
    var postCount = element.innerHTML;
    if (postCount <= 0) {
        element.style.color = "#33accc";
        element.innerHTML = "New thread";
    }
    else if (postCount <= 10) {
        element.style.color = "#329C32";
    }
    else if (postCount > 100) {
        element.style.color = "#ff0000";
    }
    else if (postCount > 10) {
        element.style.color = "#cc8f33";
    }
    else if (postCount.indexOf(',') >= 0) {
        element.style.textShadow = "0 -0.05em 0.2em #FFF, 0.01em -0.02em 0.15em #FE0, 0.01em -0.05em 0.15em #FC0, 0.02em -0.15em 0.2em #F90, 0.04em -0.20em 0.3em #F70, 0.05em -0.25em 0.4em #F70, 0.06em -0.2em 0.9em #F50, 0.1em -0.1em 1.0em #F40";
    }
    else {
        return element;
    }
    return element;
}

(function() {
    'use strict';
    var browserPath = window.location.href;
    var threadList = false;
    if (browserPath.indexOf("/forumdisplay.php?fid=") !=-1) {
        threadList = getElementByXpath('//*[@id="content"]/div[2]/table[3]/tbody');
    }
    else if (browserPath.indexOf("/search.php?action=results&sid=") !=-1) {
        threadList = getElementByXpath('//*[@id="content"]/div[2]/table[2]/tbody');
    }
    if (threadList) {
        var threads = threadList.getElementsByTagName("tr");
        for(var threadIndex=0;threadIndex<threads.length;threadIndex++) {
            var threadData = threads[threadIndex].getElementsByClassName("forumdisplay_regular");
            var postCountRow = threadData[2];
            if (postCountRow) {
                var postCountRaw = postCountRow.getElementsByTagName("a");
                var postCountElement = postCountRaw[0];
                var postCount = postCountElement.innerHTML;
                postCountElement = styleElement(postCountElement);
            }

        }
    }
})();