// ==UserScript==
// @name         jail script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  advanced search at-a-glance refills + xanax
// @author       Metaldog 1996277
// @match        https://www.torn.com/jailview.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376498/jail%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/376498/jail%20script.meta.js
// ==/UserScript==

var targetNode = document.getElementsByClassName("userlist-wrapper")[0];

var config = { childList: true, subtree: true };

var callback = function() {
    observer.disconnect();
    $(".info-wrap").load().each(function() {
        var time = $(this).find(".time").text().trim();
        var timeSplit = time.split(":");
        var actualTime = timeSplit[1].trim().split(" ");
        console.log(actualTime);
        console.log(actualTime.length);
        var score = 0;
        if (actualTime.length == 2) {
            var hours = actualTime[0].split("h")[0];
            var minutes = actualTime[1].split("m")[0];
            score = parseInt(hours,10) * 60 + parseInt(minutes,10);
        } else {
            score = parseInt(actualTime[0].split("m")[0],10);
        }
        console.log(score);
        var level = parseInt($(this).find(".level").text().trim().split(":")[1].trim(),10);
        console.log(level);

        score = score * level;
        console.log(score);

        $(this).find(".reason").text(numberWithCommas(score));
        var reason = $(this).find(".reason").text().trim();
        console.log(reason);
    });
}

const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

var observer = new MutationObserver(callback);

observer.observe(targetNode, config);