// ==UserScript==
// @name        Work Hours Calculator with Retry Policy and jQuery in iframe
// @namespace   http://tampermonkey.net/
// @version     1.3.11
// @description Calculate work hours and estimated stop time with retry policy using jQuery inside an iframe, targeting specific tables and minimum lunch time of 30 mins
// @author      Em-e-si Tim
// @match       https://saas.hrzucchetti.it/hrpmsctechita2/jsp/home.jsp*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/501840/Work%20Hours%20Calculator%20with%20Retry%20Policy%20and%20jQuery%20in%20iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/501840/Work%20Hours%20Calculator%20with%20Retry%20Policy%20and%20jQuery%20in%20iframe.meta.js
// ==/UserScript==

(function() {
    const MAX_RETRIES = 10;
    const RETRY_INTERVAL = 1000; // in milliseconds
    const REFRESH_INTERVAL = 5000;
    const MINUMUN_START_TIME = '07:30';
    const ENTRATA = ["EntrataEntrata", "EntryEntry"]
    const USCITA = ["UscitaUscita", "ExitExit"]
    const MINUMUN_LUNCH_BREAK = 30;
    const DUE_TIME_STYLE="color: green; weight:bold;";
    let notificationSent = false;

    // Utility function to parse time in HH:MM format
    function parseTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return { hours, minutes };
    }
    function sendNotification(title, body) {
        if (!notificationSent){
            // We need to ask the user for permission
            Notification.requestPermission().then((permission) => {
                // If the user accepts, let's create a notification
                if (permission === 'granted') {
                    new Notification(title, { body: body, icon: '' });
                    notificationSent = true;
                }
            });
        }
    }
    function showExitMessage($parent, $gifContainer){

        const trDueTimeBanner = jQuery('<tr id="trDueTime" class="grid_rowodd">');
        trDueTimeBanner.append(`<td colspan="5"><div class="px-1" style="line-height: 35px; text-align:center; font-weight: bold; color: #721c24; background-color: #f8d7da; border-color: #f5c6cb; border-radius:5px;">GOOD BYE & THANKS FOR ALL THE FISH!</div></td>`);

        const trDueTimeGif = jQuery('<tr class="grid_rowodd" style="width:100%;">');
        trDueTimeGif.append(`<td colspan="5"><div style="width:100%;"><div style="text-align:center; width: 100%; height: 250px;">
            <img src="https://c.tenor.com/I17VcGwPIugAAAAC/tenor.gif" alt="E' un bel direttore!" style="border-radius:3px;" />
            </div></div></td>`);
        $parent.append(trDueTimeBanner);
        // $gifContainer.empty();
        $parent.append(trDueTimeGif);
        // $gifContainer.css({"height": "100%","position": "relative","top": "0px","background": "white","z-index": "1000","display": "flex","align-items": "center"});
    }

    // Calculate total worked minutes from table rows
    function calculateTotalWorkedMinutes(rows) {
        let totalMinutes = 0;
        let entryTime = null;

        for(let i=0;i<rows.length;i+=2){
            const row1 = jQuery(rows[i]);
            const row2 = jQuery(rows[i+1]);
            if(row1 && row2) {
                let entryIn = row1.find('td:nth-child(3) div').text().trim();
                let entryOut = row2.find('td:nth-child(3) div').text().trim();
                console.log('calculateTotalWorkedMinutes', entryIn, entryOut);

                if (entryIn && entryOut) {
                    let parsedEntryIn = parseTime(entryIn);
                    let parsedEntryOut = parseTime(entryOut);
                    if(parsedEntryIn.hours <= parseTime(MINUMUN_START_TIME).hours && parsedEntryIn.minutes <= parseTime(MINUMUN_START_TIME).minutes ){
                        parsedEntryIn = MINUMUN_START_TIME;
                    }
                    totalMinutes += calculateMinutes(entryIn, entryOut);
                }
            }
        }
        if(rows.length % 2 !== 0){
            const now = new Date();
            const nowFormatted = formatTime(now.getHours(), now.getMinutes());
            const row = jQuery(rows[rows.length-1]);
            let entryIn = row.find('td:nth-child(3) div').text().trim();

            totalMinutes += calculateMinutes(entryIn, nowFormatted);
        }

        return totalMinutes;
    }
    // Calculate total non-working minutes between "Uscita" and "Entrata"
    function calculateNonWorkingMinutes(rows) {
        let totalNonWorkingMinutes = 0;
        let lastExitTime = null;
        let entryTime = null;

        for(let i=1;i<rows.length;i+=2){
            const row1 = jQuery(rows[i]);
            const row2 = jQuery(rows[i+1]);
            if(row1 && row2) {
                let entryIn = row1.find('td:nth-child(3) div').text().trim();
                let entryOut = row2.find('td:nth-child(3) div').text().trim();

                console.log('calculateNonWorkingMinutes', entryIn, entryOut);
                if (entryIn && entryOut) {
                    let parsedEntryIn = parseTime(entryIn);
                    let parsedEntryOut = parseTime(entryOut);
                    if(parsedEntryIn.hours <= parseTime(MINUMUN_START_TIME).hours && parsedEntryIn.minutes <= parseTime(MINUMUN_START_TIME).minutes ){
                        parsedEntryIn = MINUMUN_START_TIME;
                    }
                    totalNonWorkingMinutes += calculateMinutes(entryIn, entryOut);
                }
            }
        }

        return totalNonWorkingMinutes;
    }
    function getStopTimes(totalWorkedMinutes, notWorkedMinutes, $tbody){
        const totalHours = Math.floor(totalWorkedMinutes / 60);
        const totalMinutes = totalWorkedMinutes % 60;
        const totalHoursFormatted = `${totalHours}h ${totalMinutes}m`;

        const startTime = $tbody.find('tr:first-child td:nth-child(3) div').text().trim();
        let start = parseTime(startTime);

        if(start.hours <= parseTime(MINUMUN_START_TIME).hours && start.minutes <= parseTime(MINUMUN_START_TIME).minutes ){
            start = parseTime(MINUMUN_START_TIME);
        }

        const stopMinutes = start.hours * 60 + start.minutes + 480 + Math.max(notWorkedMinutes, 30); // 8 hours in minutes
        const stopHours = Math.floor(stopMinutes / 60);
        const stopMinutesRemaining = stopMinutes % 60;
        const stopTimeFormatted = formatTime(stopHours, stopMinutesRemaining);
        const maxStopMinutes = stopMinutes + 30;
        const maxStopHours = Math.floor(maxStopMinutes / 60);
        const maxStopMinutesRemaining = maxStopMinutes % 60;
        const maxStopTimeFormatted = formatTime(maxStopHours, maxStopMinutesRemaining);
        return {totalHoursFormatted:totalHoursFormatted, stopTimeFormatted: stopTimeFormatted, maxStopTimeFormatted: maxStopTimeFormatted}
    }

    // Append a new row with the total worked hours and estimated stop time
    function appendTotalRow(totalWorkedMinutes, notWorkedMinutes, isDueTime, $parent) {
        const {totalHoursFormatted,stopTimeFormatted,maxStopTimeFormatted} = getStopTimes(totalWorkedMinutes, notWorkedMinutes, $parent)

        let isLunchBreakPassed = notWorkedMinutes>0;
        let lunchBreak = Math.max(notWorkedMinutes, MINUMUN_LUNCH_BREAK);
        const lunchBreakHours = Math.floor(lunchBreak / 60);
        const lunchBreakMinutes = lunchBreak % 60;
        const lunchBreakHoursFormatted = `${lunchBreakHours}h ${lunchBreakMinutes}m`;

        const trTotalWorkedMinutes = jQuery('<tr id="trTotalWorkedMinutes" class="grid_rowodd">');
        trTotalWorkedMinutes.append(`<td colspan="2" style="margin-right:10px;"><span>Total Worked Time:</span></td><td colspan="3"> <span style="${isDueTime?DUE_TIME_STYLE:''}">${totalHoursFormatted}</span></td>`);
        $parent.append(trTotalWorkedMinutes);
        const trLunchBreak = jQuery('<tr id="trLunchBreak" class="grid_rowodd">');
        trLunchBreak.append(`<td colspan="2" style="margin-right:10px;"><span>Lunch break duration:</span></td><td colspan="3"> <span>${isLunchBreakPassed ? lunchBreakHoursFormatted : '-'}</span></td>`);
        $parent.append(trLunchBreak);
        const trStopTime = jQuery('<tr id="trStopTime" class="grid_rowodd">');
        trStopTime.append(`<td colspan="2"><span style="margin-right:10px;">Min Exit Time:</span></td><td colspan="3"><span style="${isDueTime?DUE_TIME_STYLE:''}">${stopTimeFormatted}</span></td>`);
        $parent.append(trStopTime);
        const trMaxStopTime = jQuery('<tr id="trMaxStopTime" class="grid_rowodd">');
        trMaxStopTime.append(`<td colspan="2"><span style="margin-right:10px;">Max Exit Time:</span></td><td colspan="3"><span> ${maxStopTimeFormatted}</span></td>`);
        $parent.append(trMaxStopTime);

    }


    // Function to execute the main logic
    function run($iframeContents, loop) {
        // alert('ciao')
        const $tbody = $iframeContents.find('table[id$="_grid_timbrus"] > tbody');

        purgeLastData($tbody);

        const rows = $tbody.find('tr');

        const totalWorkedMinutes = calculateTotalWorkedMinutes(rows);
        const notWorkedMinutes = calculateNonWorkingMinutes(rows);
        const {totalHoursFormatted,stopTimeFormatted,maxStopTimeFormatted} = getStopTimes(totalWorkedMinutes, notWorkedMinutes, $tbody)
        let isDueTime = checkExitTime(stopTimeFormatted);
        appendTotalRow(totalWorkedMinutes, notWorkedMinutes, isDueTime, $tbody);

        if(isDueTime){
            sendNotification('Exit Time Alert', `It is now time to exit: ${stopTimeFormatted}`);
            let $GifContainer = $iframeContents.find("[id$=Grid2].Grid2_ctrl");
            showExitMessage($tbody, $GifContainer);
        }

        if(loop === true){
            setTimeout(()=>{
                run($iframeContents, true);
            }, REFRESH_INTERVAL)
        }
    }

    // Retry policy to wait for the table to load
    function waitForTableToLoad($iframeContents, retries) {
        if (isTableLoaded($iframeContents)) {
            run($iframeContents, true);
        } else if (retries > 0) {
            setTimeout(() => waitForTableToLoad($iframeContents, retries - 1), RETRY_INTERVAL);
        } else {
            console.error('Failed to load the table after maximum retries.');
        }
    }
    window.addEventListener('load', () => {
        waitForIframeToLoad(MAX_RETRIES);
    });

    // Function to check if the table is loaded
    function isTableLoaded($iframeContents) {
        return $iframeContents.find('table[id$="_grid_timbrus"] tbody').length > 0;
    }
    // Function to check if the iframe is loaded
    function isIframeLoaded() {
        return jQuery('iframe').filter(function() {
            return this.id.endsWith('_gsmd_container.jsp');
        }).length > 0;
    }
    // Retry policy to wait for the iframe to load
    function waitForIframeToLoad(retries) {
        if (isIframeLoaded()) {
            const $iframe = jQuery('iframe')
            $iframe.on('load', function() {
                const $iframeContents = jQuery($iframe.contents());
                waitForTableToLoad($iframeContents, MAX_RETRIES);
            });
        } else if (retries > 0) {
            setTimeout(() => waitForIframeToLoad(retries - 1), RETRY_INTERVAL);
        } else {
            console.error('Failed to load the iframe after maximum retries.');
        }
    }
    function purgeLastData($parent){
        let rowsToBeRemoved = $parent.children().filter(function() {
            return this.id.indexOf('grid_timbrus_row')<0;
        });
        if(rowsToBeRemoved){
            for(let i=0; i< rowsToBeRemoved.length;i++){
                if(rowsToBeRemoved[i]){
                    rowsToBeRemoved[i].remove();
                }
            }
        }
    }
    function convertToTimeOfDay(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const now = new Date();
        now.setHours(hours, minutes, 0, 0);
        return now;
    }
    function checkExitTime(exitTime) {
        const now = new Date();
        const exitDate = convertToTimeOfDay(exitTime);

        return exitDate - now < 0;
    }
    // Utility function to format time in HH:MM format
    function formatTime(hours, minutes) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    // Calculate total minutes between two times
    function calculateMinutes(startTime, endTime) {
        const start = parseTime(startTime);
        const end = parseTime(endTime);
        return (end.hours * 60 + end.minutes) - (start.hours * 60 + start.minutes);
    }
    // Start the script
})();