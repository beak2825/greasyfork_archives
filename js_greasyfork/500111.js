// ==UserScript==
// @name         Coverage Preference Settings
// @namespace    https://greasyfork.org/users/1179204
// @version      1.0.5
// @description  filter specific coverage on map-making page
// @author       KaKa
// @match        *://map-making.app/maps/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      MIT
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @downloadURL https://update.greasyfork.org/scripts/500111/Coverage%20Preference%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/500111/Coverage%20Preference%20Settings.meta.js
// ==/UserScript==

(function() {
    let panoId,startTimestamp,endTimestamp,searchState,getState,preference,pIndex=0
    let preferences=['default','Unofficial','Specific Date']

    function showAlert(preference) {
        Swal.fire({
            title: 'Preference',
            text: `The default coverage has been set to "${preference}"`,
            icon: 'info',
            timer: 1500,
            showConfirmButton: false,
        });
        if (preference==='Specific Date'){
            setTimeout(async function(){await getDateRange()},1000)
        }
    }

    async function getDateRange(){
        const dateFormatRegex = /^\d{4}-(0\d|1[0-2]|[1-9])-(0\d|1\d|2\d|3[01]|[1-9])$/;

        await Swal.fire({
            title: 'Enter Date Range',
            icon:'question',
            html:
            '<input id="start-date" class="swal2-input" placeholder="Start Date (yyyy-mm-dd)">' +
            '<input id="end-date" class="swal2-input" placeholder="End Date (yyyy-mm-dd)">',
            focusConfirm: false,
            showCancelButton: false,
            preConfirm: () => {
                const startDate = document.getElementById('start-date').value.trim();
                const endDate = document.getElementById('end-date').value.trim();

                if (!startDate.match(dateFormatRegex) || !endDate.match(dateFormatRegex)) {
                    Swal.showValidationMessage('Please enter valid date range!')
                    return false;
                }

                if (startDate&&endDate) {
                    startTimestamp = Date.parse(startDate) / 1000;
                    endTimestamp = Date.parse(endDate) / 1000;
                }
            }
        });

    }


    const THE_WINDOW = unsafeWindow || window;

    THE_WINDOW.fetch = function(originalFetch) {
        return async function (...args) {
            const url = args[0].toString();
            if (pIndex===0){
                return originalFetch.apply(THE_WINDOW, args);
            }
            if (url.includes('SingleImageSearch') || url.includes('GetMetadata')) {
                try {
                    let requestData = JSON.parse(args[1].body);

                    if (url.includes('SingleImageSearch')&&!searchState) {

                        if(pIndex===1){
                            requestData[1][1]=30
                            requestData[2][10][0][0][0]=3
                        }

                        else if (pIndex===2){
                            requestData[1][1]=15
                            requestData[2][0] = [null, null, false, null, null, null, null, null, null, null, [startTimestamp, endTimestamp]];
                            requestData[3] = [[2, 6]]
                        }

                        args[1].body = JSON.stringify(requestData);
                    }

                    if (url.includes('GetMetadata')) {
                        requestData[2][0][0][1] = panoId
                        searchState=null
                        args[1].body = JSON.stringify(requestData);
                    }

                    const response = await originalFetch.apply(THE_WINDOW, args);

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const responseData = await response.json();

                    if (url.includes('SingleImageSearch')){
                        if (responseData&&!responseData[0].includes('generic')){
                            if(!searchState){
                                panoId=responseData[1][1][1]
                            }}
                        else{panoId=null}
                    }

                    return originalFetch.apply(THE_WINDOW, args);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    throw error;
                }
            } else {
                return originalFetch.apply(THE_WINDOW, args);
            }
        };
    }(THE_WINDOW.fetch);

    let onKeyDown = async (e) => {
        if (e.key === 'q' || e.key === 'Q') {
            e.stopImmediatePropagation();
            if (pIndex>=3)pIndex=0
            else{pIndex+=1}
            preference=preferences[pIndex]
            showAlert(preference)
        };
    }
    document.addEventListener("keydown", onKeyDown);
})();