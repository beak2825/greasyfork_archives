// ==UserScript==
// @name         5play.ru counter bypass
// @namespace    https://5play.ru/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://5play.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395315/5playru%20counter%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/395315/5playru%20counter%20bypass.meta.js
// ==/UserScript==

(function() {
/**/
    var counters = document.getElementsByClassName('counterhide');

    if(counters){

        var countersCount = counters.length;

        if(counters.length){

                for (var j = 0; j <countersCount; j++) {
                    counters[j].style.visibility = 'hidden';
                    counters[j].style.display = 'none';
                    counters[j].style.opacity = 0;
                    counters[j].style.height ='0';
                }j
        }

    }


    var downloadResults = document.getElementsByClassName('download-result');

    if(downloadResults){

          var downloadResultsCount = downloadResults.length;

        for (var i = 0; i < downloadResultsCount; i++) {
            downloadResults[i].style.visibility = 'visible';
            downloadResults[i].style.opacity = 1;
            downloadResults[i].style.height ='40px';

        }
    }




})();