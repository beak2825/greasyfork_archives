// ==UserScript==
// @name         Machinemetrics Reports on load click today drop down
// @namespace    https://app.machinemetrics.com/
// @version      0.13
// @description  if it ain't broke - don't fix it.......
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.js
// @author       rickzabel
// @match        https://app.machinemetrics.com/app/reports/builder?id=3056
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/465396/Machinemetrics%20Reports%20on%20load%20click%20today%20drop%20down.user.js
// @updateURL https://update.greasyfork.org/scripts/465396/Machinemetrics%20Reports%20on%20load%20click%20today%20drop%20down.meta.js
// ==/UserScript==

(function() {
    const myInterval = setInterval(myTimer, 3000);
    const myInterval2 = setInterval(myTimer2, 3000);

    function myTimer() {
        var x = document.querySelector('.SelectBase__MenuItem-sc-1p5n5sa-7');
        if (x != null) {

            //call function to stop timer
            myStopFunction()

            //click the dropdown for the desired date range
            document.querySelector('#today.SelectBase__MenuItem-sc-1p5n5sa-7').click();
            //document.querySelector('#last-2-days.SelectBase__MenuItem-sc-1p5n5sa-7').click();
            //document.querySelector('#last-month.SelectBase__MenuItem-sc-1p5n5sa-7').click();

        }
    }

    function myStopFunction() {
        clearInterval(myInterval);
    }

    function myTimer2() {
        //The chart seems to be the last item to draw so we are going to search for it to determine if it is time to run
        var x2 = document.querySelector('#hide-chart');

        if (x2 != null) {
            //stop timer
            myStopFunction2()

            //get the innerText of the hide and show chart button
            var HideChartText = document.querySelector('#hide-chart').innerText;
            if (HideChartText == "Hide Chart") {
                //Hide the chart
                document.querySelector('#hide-chart').click();
            }

            //expand first shift
            document.querySelector("#table-row-undefined div div .Cells__EntityText-sc-1o23ezk-3.bIOdKK").click();

            //expand 2nd shift
            document.querySelector("#table-row-undefined ~ div div div .Cells__EntityText-sc-1o23ezk-3.bIOdKK").click();
        }
    }


    function myStopFunction2() {
        clearInterval(myInterval2);
    }

    //reload ever 24 hours
    //setTimeout(MyReload, 86400);

    //clear reload parge and cache
    function MyReload(){
        // location.reload(true)
    }

})();