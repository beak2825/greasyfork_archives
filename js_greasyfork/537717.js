// ==UserScript==
// @name         Shohoz Seat Layout User Script (Corrected Date Parsing v1.6.10)
// @namespace    [http://tampermonkey.net/](http://tampermonkey.net/)
// @version      1.6.10
// @description  Round-robin processing of a persistent trip queue: searches, allows selection/reordering. For each trip, attempts to reserve seats until target, POSTs details, verifies OTP, confirms. Includes seat release.
// @author       Your Name
// @match        [https://eticket.railway.gov.bd/booking/train/search](https://eticket.railway.gov.bd/booking/train/search)?*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start 
// @downloadURL https://update.greasyfork.org/scripts/537717/Shohoz%20Seat%20Layout%20User%20Script%20%28Corrected%20Date%20Parsing%20v1610%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537717/Shohoz%20Seat%20Layout%20User%20Script%20%28Corrected%20Date%20Parsing%20v1610%29.meta.js
// ==/UserScript==

(function() {
   'use strict';

   // --- Global Variable Declarations ---
   let capturedAccessToken = null;
   let currentOtp = null; 
   let isReservationLoopActive = false; 
   let loopTimeoutId = null; 
   let currentTripDetailsForSingleRun = null; 
   let allFoundTrainsMasterList = []; 
   let selectedTripsForQueue = []; 
   let currentQueueIndex = -1; 
   let manualOtpConfirmation = (localStorage.getItem('shohoz_manualOtpConfirm') === 'true'); 
   
   // --- UI Elements ---
   let mainButton, settingsButton, otpModeButton, releaseSeatsButton, previewContainer, settingsModal, trainNameSelect, seatClassSelect, queuedTripsDiv, seatPriorityInput; 

   // --- localStorage Keys ---
   const QUEUE_STORAGE_KEY = 'shohoz_bookingQueue';
   const HELD_SEATS_STORAGE_KEY = 'shohoz_heldSeats'; 

   // --- Configuration for Initial Trip Search ---
   const DEFAULT_FROM_CITY = "Mymensingh";
   const DEFAULT_TO_CITY = "Dhaka";
   
   // --- Helper function to get URL parameters ---
   function getUrlParameterByName(name, url = window.location.href) {
       name = name.replace(/[\[\]]/g, '\\$&');
       const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
       const results = regex.exec(url);
       if (!results) return null;
       if (!results[2]) return ''; 
       return decodeURIComponent(results[2].replace(/\+/g, ' '));
   }

   // --- Helper function to get date 10 days ahead in DD-Mon-YYYY format ---
   function getCalculatedFutureDate() {
       const today = new Date();
       const futureDate = new Date(today);
       futureDate.setDate(today.getDate() + 10);
       const day = ('0' + futureDate.getDate()).slice(-2);
       const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
       const month = monthNames[futureDate.getMonth()];
       const year = futureDate.getFullYear();
       return `${day}-${month}-${year}`;
   }
   
   const SEARCH_FROM_CITY = getUrlParameterByName('fromcity') || DEFAULT_FROM_CITY;
   const SEARCH_TO_CITY = getUrlParameterByName('tocity') || DEFAULT_TO_CITY;
   const SEARCH_DATE_OF_JOURNEY = getUrlParameterByName('doj') || getCalculatedFutureDate(); 
   const SEARCH_SEAT_CLASS = getUrlParameterByName('class') || "S_CHAIR"; 

   // --- API Endpoints ---
   const searchTripsApiUrl = '[https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2](https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2)';
   const getApiBaseUrl = '[https://railspaapi.shohoz.com/v1.0/web/bookings/seat-layout](https://railspaapi.shohoz.com/v1.0/web/bookings/seat-layout)';
   const reserveApiUrl = '[https://railspaapi.shohoz.com/v1.0/web/bookings/reserve-seat](https://railspaapi.shohoz.com/v1.0/web/bookings/reserve-seat)';
   const releaseSeatApiUrl = '[https://railspaapi.shohoz.com/v1.0/web/bookings/release-seat](https://railspaapi.shohoz.com/v1.0/web/bookings/release-seat)'; 
   const passengerDetailsApiUrl = '[https://railspaapi.shohoz.com/v1.0/web/bookings/passenger-details](https://railspaapi.shohoz.com/v1.0/web/bookings/passenger-details)';
   const verifyOtpApiUrl = '[https://railspaapi.shohoz.com/v1.0/web/bookings/verify-otp](https://railspaapi.shohoz.com/v1.0/web/bookings/verify-otp)'; 
   const confirmBookingApiUrl = '[https://railspaapi.shohoz.com/v1.0/web/bookings/confirm](https://railspaapi.shohoz.com/v1.0/web/bookings/confirm)';
   const targetApiDomain = 'railspaapi.shohoz.com';

   const TARGET_SUCCESSFUL_RESERVATIONS = 4; 
   const RETRY_DELAY_MS = 1000; 

   
   // --- Helper function to format date (User-provided if/else structure) ---
   function formatDateToDDMonYYYY(yyyy_mm_dd_str_param) { // Renamed parameter to avoid conflict with global
       if (!yyyy_mm_dd_str_param) return SEARCH_DATE_OF_JOURNEY; 
       try {
           let parts;
           if (typeof yyyy_mm_dd_str_param === 'string' && yyyy_mm_dd_str_param.includes('-')) {
               parts = yyyy_mm_dd_str_param.split('-');
           } else { 
               parts = []; 
           }
           let year, month, day;
           if (parts.length === 3) {
               if (parts[0].length === 4) { // YYYY-MM-DD format
                   [year, month, day] = parts.map(p => parseInt(p, 10));
               } else if (parts[2].length === 4) { // DD-MM-YYYY format 
                   [day, month, year] = parts.map(p => parseInt(p, 10));
               } else { 
                    if (/[A-Za-z]/.test(parts[1])) return yyyy_mm_dd_str_param; // Already DD-Mon-YYYY
                   console.warn("Unrecognized date parts order for: " + yyyy_mm_dd_str_param);
                   throw new Error("Unrecognized date parts order for: " + yyyy_mm_dd_str_param); 
               }
               const dateObj = new Date(year, month - 1, day); // Month is 0-indexed
               if (isNaN(dateObj.getTime())) {
                   console.warn("Invalid date object created from parts: " + year + "/" + month + "/" + day);
                   throw new Error("Invalid date object from parts: " + year + "/" + month + "/" + day);
               }
               const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
               const formattedDay = ('0' + dateObj.getDate()).slice(-2); 
               return `${formattedDay}-${monthNames[dateObj.getMonth()]}-${dateObj.getFullYear()}`;
           } else if (yyyy_mm_dd_str_param && typeof yyyy_mm_dd_str_param === 'string' && yyyy_mm_dd_str_param.trim() !== '') {
               const dateParts = yyyy_mm_dd_str_param.split('-');
               if (dateParts.length === 3 && isNaN(parseInt(dateParts[1])) && dateParts[1].length === 3) { // Check if it's DD-Mon-YYYY
                   return yyyy_mm_dd_str_param; 
               }
               console.warn("Date string not in expected YYYY-MM-DD or DD-Mon-YYYY format: " + yyyy_mm_dd_str_param);
               throw new Error("Date string not in expected YYYY-MM-DD or DD-Mon-YYYY format: " + yyyy_mm_dd_str_param); 
           } else { 
               console.warn("Invalid or empty date string provided to formatDateToDDMonYYYY:", yyyy_mm_dd_str_param);
               return SEARCH_DATE_OF_JOURNEY; 
           }
       } catch (e) { 
           console.error("UserScript: Error formatting date '", yyyy_mm_dd_str_param, "':", e); 
           return SEARCH_DATE_OF_JOURNEY; 
       }
   }

   // --- Helper function to extract numeric part of seat number ---
   function getSeatNumericPart(seatNumberStr) {
       if (!seatNumberStr || typeof seatNumberStr !== 'string') return null;
       const parts = seatNumberStr.split('-');
       if (parts.length > 0) { 
           const num = parseInt(parts[parts.length - 1], 10);
           return isNaN(num) ? null : num;
       }
       return null;
   }

   // --- Helper function to extract bogie prefix from seat number ---
   function getSeatPrefix(seatNumberStr) {
       if (!seatNumberStr || typeof seatNumberStr !== 'string') return "UNKNOWN"; 
       const parts = seatNumberStr.split('-');
       if (parts.length > 1) {
           return parts[0];
       }
       return "NONE"; // If seat is just a number like "10" (no prefix)
   }


   // --- Held Seats localStorage Functions ---
   function getHeldSeats() { try { const s = localStorage.getItem(HELD_SEATS_STORAGE_KEY); return s ? JSON.parse(s) : []; } catch (e) { console.error("Error loading held seats:", e); return []; } }
   function saveHeldSeats(seats) { try { localStorage.setItem(HELD_SEATS_STORAGE_KEY, JSON.stringify(seats)); } catch (e) { console.error("Error saving held seats:", e); } }
   function addHeldSeat(trip, seatDetail) { const hS = getHeldSeats(); const nHS = {ticket_id:parseInt(seatDetail.ticket_id), seat_number:seatDetail.seat_number, trip_route_id:trip.trip_route_id, trip_process_id:trip.processId, train_number:trip.train_number, date_of_journey:trip.date_of_journey}; if(!hS.find(s=>s.ticket_id===nHS.ticket_id)){hS.push(nHS);saveHeldSeats(hS);}}
   function removeHeldSeat(ticketIdToRemove) { let hS=getHeldSeats(); hS=hS.filter(s=>s.ticket_id!==parseInt(ticketIdToRemove)); saveHeldSeats(hS); }
   function clearAllHeldSeatsFromStorage() { saveHeldSeats([]); }


   // --- Queue localStorage Functions ---
   function saveQueueToLocalStorage() { try { localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(selectedTripsForQueue)); } catch (e) { console.error("Error saving queue", e); } }
   function loadQueueFromLocalStorage() { try { const sQ = localStorage.getItem(QUEUE_STORAGE_KEY); if(sQ){selectedTripsForQueue=JSON.parse(sQ); if(!Array.isArray(selectedTripsForQueue))selectedTripsForQueue=[];} else selectedTripsForQueue=[]; } catch(e){console.error("Error loading queue",e);selectedTripsForQueue=[];} }

   function updateMainButtonState(statusMessage = null) { /* ... (Same as v1.6.2, ensures all UI elements are updated based on state) ... */ 
       if (!mainButton) return;
       let currentTripForButtonDisplay = null;
       if (selectedTripsForQueue.length > 0 && currentQueueIndex >= 0 && currentQueueIndex < selectedTripsForQueue.length) {
           currentTripForButtonDisplay = selectedTripsForQueue[currentQueueIndex];
       } else if (currentTripDetailsForSingleRun && isReservationLoopActive) { 
           currentTripForButtonDisplay = currentTripDetailsForSingleRun;
       }
       let reservedForCurrentDisplay = 0;
       if (currentTripForButtonDisplay && typeof currentTripForButtonDisplay.totalReservedForThisTrip !== 'undefined') {
           reservedForCurrentDisplay = currentTripForButtonDisplay.totalReservedForThisTrip;
       }
       let commonDisabled = !capturedAccessToken || isReservationLoopActive;
       if(settingsButton) settingsButton.disabled = commonDisabled;
       if(otpModeButton) otpModeButton.disabled = commonDisabled;
       const heldSeats = getHeldSeats();
       if (releaseSeatsButton) releaseSeatsButton.disabled = !capturedAccessToken || isReservationLoopActive || heldSeats.length === 0;
       if (statusMessage) { 
           mainButton.textContent = statusMessage; mainButton.disabled = true; mainButton.style.backgroundColor = '#ffc107'; 
       } else if (!capturedAccessToken) {
           mainButton.textContent = 'Waiting for Token...'; mainButton.disabled = true; mainButton.style.backgroundColor = '#aaa';
       } else if (isReservationLoopActive) {
           let queueProgress = "";
           if (currentTripForButtonDisplay) { queueProgress = ` (Processing ${currentTripForButtonDisplay.train_number.substring(0,10)}... ${reservedForCurrentDisplay}/${TARGET_SUCCESSFUL_RESERVATIONS})`;
           } else if (selectedTripsForQueue.length > 0) { queueProgress = ` (Queue: ${selectedTripsForQueue.length} items)`;}
           mainButton.textContent = `Stop Processing ${queueProgress}`; mainButton.disabled = false; mainButton.style.backgroundColor = '#dc3545'; 
       } else if (selectedTripsForQueue.length > 0) {
           mainButton.textContent = `Process Queued Trips (${selectedTripsForQueue.length} items)`; mainButton.disabled = false; mainButton.style.backgroundColor = '#17a2b8'; 
       } else if (currentTripDetailsForSingleRun && !document.querySelector('button[id^="confirmDetailsRequestOtpButton_"]')) { 
            mainButton.textContent = `Start Loop for ${currentTripDetailsForSingleRun.train_number.substring(0,15)} (${currentTripDetailsForSingleRun.seat_class})`; mainButton.disabled = false; mainButton.style.backgroundColor = '#007bff'; 
       } else if (document.querySelector('button[id^="confirmDetailsRequestOtpButton_"]') || document.querySelector('.try-more-seats-btn')) { 
            mainButton.textContent = `Action Required in Preview`; mainButton.disabled = true; mainButton.style.backgroundColor = '#6c757d';
       } else { 
           mainButton.textContent = `Search (${SEARCH_DATE_OF_JOURNEY}) & Start Default Loop`; mainButton.disabled = false; mainButton.style.backgroundColor = '#007bff';
       }
       if(settingsButton) settingsButton.disabled = !capturedAccessToken || isReservationLoopActive;
       if(otpModeButton) otpModeButton.disabled = !capturedAccessToken || isReservationLoopActive;
   }
   
   function handleTokenUpdate(newTokenValue) { capturedAccessToken = newTokenValue; if(!mainButton)initializeUI(); updateMainButtonState(); }
   const oSRH=XMLHttpRequest.prototype.setRequestHeader;XMLHttpRequest.prototype.setRequestHeader=function(h,v){if(h&&h.toLowerCase()==='authorization'&&v&&v.toLowerCase().startsWith('bearer ')&&this._url&&this._url.includes(targetApiDomain)&&capturedAccessToken!==v)handleTokenUpdate(v);oSRH.apply(this,arguments);};const oXHR=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){this._url=u;oXHR.apply(this,arguments);};const oF=window.fetch;window.fetch=async function(...a){let u=a[0]instanceof Request?a[0].url:a[0],o=a[1]||{},hV=null;if(u.includes(targetApiDomain)){if(o.headers){if(o.headers instanceof Headers)hV=o.headers.get('Authorization');else if(typeof o.headers==='object')for(const k in o.headers)if(k.toLowerCase()==='authorization'){hV=o.headers[k];break;}}else if(a[0]instanceof Request&&a[0].headers)hV=a[0].headers.get('Authorization');if(hV&&hV.toLowerCase().startsWith('bearer ')&&capturedAccessToken!==hV)handleTokenUpdate(hV);}return oF.apply(this,a);};
   function applyStyles() { GM_addStyle(` #seatLayoutPreviewContainer { position: fixed; top: 70px; right: 20px; width: 450px; max-height: calc(100vh - 90px); overflow-y: auto; background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 8px; padding: 10px; z-index: 9998; box-shadow: 0 6px 12px rgba(0,0,0,0.15); font-family: Arial, sans-serif; font-size: 14px; } #mainLoopControlButton, #settingsButton, #otpModeButton, #releaseAllHeldSeatsButton { position: fixed; top: 20px; padding: 10px 15px; color: white; border: none; border-radius: 5px; cursor: pointer; z-index: 10000; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: background-color 0.3s ease, opacity 0.3s ease; margin-right:10px; } #mainLoopControlButton { left: 20px; min-width: 240px; text-align:center;} #settingsButton { left: 270px; background-color: #6c757d; } #otpModeButton { left: 420px; background-color: #17a2b8; width: 180px; text-align: center;} #releaseAllHeldSeatsButton { left: 610px; background-color: #fd7e14; } #mainLoopControlButton:hover:not(:disabled), #settingsButton:hover:not(:disabled), #otpModeButton:hover:not(:disabled), #releaseAllHeldSeatsButton:hover:not(:disabled) { filter: brightness(1.1); } #mainLoopControlButton:disabled, #settingsButton:disabled, #otpModeButton:disabled, #releaseAllHeldSeatsButton:disabled { background-color: #aaa !important; cursor: not-allowed; opacity: 0.7; } #seatLayoutPreviewContainer .trip-process-box { border:1px solid #ddd; padding:10px; margin-bottom:10px; border-radius:5px; background-color:#fff; } #seatLayoutPreviewContainer .trip-process-box h4 {margin-top:0; padding-bottom:5px; border-bottom:1px solid #eee;} #seatLayoutPreviewContainer h3, #seatLayoutPreviewContainer h4 { margin-top: 0; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 18px; } #seatLayoutPreviewContainer h4 { font-size: 16px; margin-top:15px;}  #seatLayoutPreviewContainer .slp-error { color: #d9534f; font-weight: bold; background-color: #f2dede; border: 1px solid #ebccd1; padding: 10px; border-radius: 4px; margin-bottom:10px;} #seatLayoutPreviewContainer .slp-info { color: #31708f; background-color: #d9edf7; border: 1px solid #bce8f1; padding: 10px; border-radius: 4px; margin-bottom: 10px; } #seatLayoutPreviewContainer .slp-success { color: #155724; background-color: #d4edda; border-color: #c3e6cb; padding: 10px; border-radius: 4px; margin-bottom: 10px; font-weight: bold; } .slp-loader { border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 30px; height: 30px; animation: slp-spin 1s linear infinite; margin: 20px auto; } @keyframes slp-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .reservation-summary { margin-bottom: 15px; padding: 10px; border: 1px solid #bee5eb; background-color: #d1ecf1; color: #0c5460; border-radius: 4px;} .reservation-summary strong { color: #004085; } .reservation-summary ul { list-style-type: none; padding-left: 0; max-height: 100px; overflow-y: auto; font-size: 0.9em; } .reservation-summary li.success { color: green; display: flex; justify-content: space-between; align-items: center; } .reservation-summary li.failure { color: red; } .release-seat-btn { margin-left: 10px; padding: 2px 5px; font-size: 0.8em; background-color: #ffc107; color: black; border: 1px solid #dda60a; cursor: pointer; border-radius:3px;} .release-seat-btn:hover { background-color: #e0a800;} .try-more-seats-btn { background-color: #20c997; color:white; padding: 5px 10px; border-radius: 4px; border:none; cursor:pointer; margin-top:5px; display:inline-block;} .try-more-seats-btn:hover { background-color: #1baa80; } .slp-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: none; justify-content: center; align-items: center; } .slp-modal-content { background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 90%; max-width: 600px; } .slp-modal-content h3 { margin-top: 0; } .slp-modal-content label { display: block; margin-top: 10px; margin-bottom: 5px; font-weight: bold; } .slp-modal-content select, .slp-modal-content input[type="text"], .slp-modal-content button { width: 100%; padding: 10px; margin-top: 5px; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box; } .slp-modal-content button { background-color: #007bff; color: white; cursor: pointer; margin-top: 15px; } .slp-modal-content button:hover { background-color: #0056b3; } .slp-modal-close-btn { float: right; font-size: 1.5rem; font-weight: bold; line-height: 1; color: #000; text-shadow: 0 1px 0 #fff; opacity: .5; cursor:pointer; background:none; border:none; } .slp-modal-close-btn:hover { opacity: .75; } #queuedTripsDiv { margin-top: 15px; padding:10px; border:1px solid #eee; border-radius:4px; max-height:150px; overflow-y:auto; } #queuedTripsDiv div { padding: 5px 0; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; } #queuedTripsDiv div:last-child { border-bottom: none; } .queue-item-controls button { padding: 3px 6px; font-size: 0.8em; margin-left: 5px; background-color: #e9ecef; color: #495057; border: 1px solid #ced4da;} .queue-item-controls button:hover { background-color: #dee2e6;} #confirmDetailsRequestOtpButton { background-color: #28a745; color: white; padding: 10px 15px; border:none; border-radius: 5px; cursor:pointer; margin-top:10px; display:block; } #confirmDetailsRequestOtpButton:hover { background-color: #1e7e34; } `); }
   
   function getTripProcessDiv(tripProcessId, tripName = "Trip") {
       let tripDiv = document.getElementById(tripProcessId);
       if (!tripDiv) {
           tripDiv = document.createElement('div');
           tripDiv.id = tripProcessId;
           tripDiv.className = 'trip-process-box'; 
           if (previewContainer.firstChild) {
               previewContainer.insertBefore(tripDiv, previewContainer.firstChild);
           } else {
               previewContainer.appendChild(tripDiv);
           }
       }
       return tripDiv;
   }

   function displayMessageInPreview(htmlMessage, append = false, tripProcessId = null, tripName = "Trip Details") {
       if (!previewContainer || !document.body.contains(previewContainer)) { 
           if(previewContainer) previewContainer.remove(); 
           previewContainer = document.createElement('div');
           previewContainer.id = 'seatLayoutPreviewContainer';
           document.body.appendChild(previewContainer);
       }
       let targetDiv;
       if (tripProcessId) {
           targetDiv = getTripProcessDiv(tripProcessId, tripName);
           const dynamicButton = targetDiv.querySelector('button[id^="confirmDetailsRequestOtpButton_"]'); 
           if (dynamicButton && !append) dynamicButton.remove();
           const tryMoreButton = targetDiv.querySelector('button[id^="tryMoreSeatsButton_"]');
           if (tryMoreButton && !append && !htmlMessage.includes('try-more-seats-btn')) { 
                tryMoreButton.remove();
           }

       } else {
           targetDiv = previewContainer; 
           const dynamicButton = document.getElementById('confirmDetailsRequestOtpButton'); 
           if (dynamicButton && !append) dynamicButton.remove(); 
       }
       if (append && targetDiv.innerHTML.length < 50000) { targetDiv.innerHTML += htmlMessage; } 
       else { targetDiv.innerHTML = htmlMessage; }
       if (targetDiv.scrollHeight > targetDiv.clientHeight) targetDiv.scrollTop = targetDiv.scrollHeight;
       if (previewContainer.scrollHeight > previewContainer.clientHeight) previewContainer.scrollTop = previewContainer.scrollHeight;
   }

   async function searchForTrips(autoProceed = false, callback = null) { 
       if (!capturedAccessToken) { /* ... */ if (callback) callback(); return; }
       updateMainButtonState("Searching Trips...");
       if (!callback || autoProceed) displayMessageInPreview(`<h3>Trip Search</h3><div class="slp-loader"></div><p class="slp-info">Searching: ${SEARCH_FROM_CITY} to ${SEARCH_TO_CITY} on ${SEARCH_DATE_OF_JOURNEY} for ${SEARCH_SEAT_CLASS}...</p>`);
       allFoundTrainsMasterList = []; 
       const searchUrl = `${searchTripsApiUrl}?from_city=${encodeURIComponent(SEARCH_FROM_CITY)}&to_city=${encodeURIComponent(SEARCH_TO_CITY)}&date_of_journey=${encodeURIComponent(SEARCH_DATE_OF_JOURNEY)}&seat_class=${encodeURIComponent(SEARCH_SEAT_CLASS)}`;
       GM_xmlhttpRequest({
           method: "GET", url: searchUrl, headers: { "Authorization": capturedAccessToken, "Accept": "application/json", "Referer": "[https://eticket.railway.gov.bd/](https://eticket.railway.gov.bd/)", "X-Requested-With": "XMLHttpRequest" },
           onload: function(response) {
               let rdT = response.responseText; console.log("Search Trips Response:", rdT); 
               if (response.status === 200) {
                   try {
                       const rJ = JSON.parse(rdT);
                       if (rJ.data && rJ.data.trains && Array.isArray(rJ.data.trains)) {
                           rJ.data.trains.forEach(train => {
                               if (train.seat_types && Array.isArray(train.seat_types) && train.seat_types.length > 0) {
                                   allFoundTrainsMasterList.push({
                                       train_number: train.trip_number || "Unknown", departure_date_time: train.departure_date_time_jd || train.departure_date_time,
                                       arrival_date_time: train.arrival_date_time, origin_city_name: train.origin_city_name, destination_city_name: train.destination_city_name,
                                       departure_full_date: train.departure_full_date, 
                                       seat_types: train.seat_types.map(st => ({ type: st.type, trip_id: st.trip_id, trip_route_id: st.trip_route_id, fare: st.fare, seat_counts: st.seat_counts })),
                                       boarding_points: train.boarding_points 
                                   });
                               }
                           });
                           if (allFoundTrainsMasterList.length > 0) {
                               if (!callback || autoProceed) displayMessageInPreview(`<h3>Trip Search</h3><p class="slp-success">Found ${allFoundTrainsMasterList.length} train(s) for ${SEARCH_DATE_OF_JOURNEY}.</p>`, true);
                               if(settingsButton) settingsButton.disabled = false; 
                               if (autoProceed && !currentTripDetailsForSingleRun && selectedTripsForQueue.length === 0) { 
                                   let autoSelected = false;
                                   for (const train of allFoundTrainsMasterList) {
                                       const mST = train.seat_types.find(st => st.type === SEARCH_SEAT_CLASS);
                                       if (mST) {
                                           currentTripDetailsForSingleRun = { 
                                               trip_id: mST.trip_id, trip_route_id: mST.trip_route_id, from_city: train.origin_city_name || SEARCH_FROM_CITY,
                                               to_city: train.destination_city_name || SEARCH_TO_CITY, 
                                               date_of_journey: SEARCH_DATE_OF_JOURNEY, 
                                               seat_class: mST.type, train_number: train.train_number, boarding_points: train.boarding_points,
                                               processId: `single_trip_${Date.now()}`, status: 'queued', totalReservedForThisTrip: 0, reservedTicketIdsForThisTrip: [] , isActiveInLoop: true, currentOtpForThisTrip: null, timeoutId: null,
                                               seatPriority: [] 
                                           };
                                           displayMessageInPreview(`<p class="slp-info">Auto-selected: ${currentTripDetailsForSingleRun.train_number} (${currentTripDetailsForSingleRun.seat_class}) on ${currentTripDetailsForSingleRun.date_of_journey}. Starting loop...</p>`, true, currentTripDetailsForSingleRun.processId);
                                           autoSelected = true; 
                                           isReservationLoopActive = true; 
                                           fetchAndDisplaySeatLayout(currentTripDetailsForSingleRun); break; 
                                       }
                                   }
                                   if (!autoSelected) { displayMessageInPreview(`<p class="slp-error">Could not auto-select '${SEARCH_SEAT_CLASS}'. Use 'Configure Trip'.</p>`, true); isReservationLoopActive = false; updateMainButtonState(); }
                               } else if (!callback) { updateMainButtonState(); }
                           } else { if (!callback || autoProceed) displayMessageInPreview(`<h3>Trip Search</h3><p class="slp-error">No trains found for ${SEARCH_DATE_OF_JOURNEY}.</p>`); isReservationLoopActive = false; updateMainButtonState(); }
                       } else { if (!callback || autoProceed) displayMessageInPreview(`<h3>Trip Search</h3><p class="slp-error">Bad response structure.</p>`); isReservationLoopActive = false; updateMainButtonState(); }
                   } catch (e) { if (!callback || autoProceed) displayMessageInPreview(`<h3>Trip Search</h3><p class="slp-error">Error parsing response.</p>`); isReservationLoopActive = false; updateMainButtonState(); }
               } else { if (!callback || autoProceed) displayMessageInPreview(`<h3>Trip Search</h3><p class="slp-error">Search failed. Status: ${response.status}</p>`); isReservationLoopActive = false; updateMainButtonState(); }
               if (callback) callback(); 
           },
           onerror: function() { if (!callback || autoProceed) displayMessageInPreview(`<h3>Trip Search</h3><p class="slp-error">Network error.</p>`); isReservationLoopActive = false; updateMainButtonState(); if (callback) callback();},
           ontimeout: function() { if (!callback || autoProceed) displayMessageInPreview(`<h3>Trip Search</h3><p class="slp-error">Timeout.</p>`); isReservationLoopActive = false; updateMainButtonState(); if (callback) callback();}
       });
   }

   function fetchAndDisplaySeatLayout(tripToProcess) { 
       if (tripToProcess.timeoutId) clearTimeout(tripToProcess.timeoutId); 
       if (!isReservationLoopActive || !tripToProcess.isActiveInLoop || tripToProcess.status === 'completed_success' || tripToProcess.status === 'failed_permanently' || tripToProcess.status === 'completed_partial_no_more_seats') { 
           checkAllTripsCompletion(); return; 
       }
       if (!capturedAccessToken) { displayMessageInPreview(`<h4>${tripToProcess.train_number}</h4><p class="slp-error">Token unavailable.</p>`, false, tripToProcess.processId); tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); return; }
       tripToProcess.status = 'fetching_layout';
       const fullGetApiUrl = `${getApiBaseUrl}?trip_id=${tripToProcess.trip_id}&trip_route_id=${tripToProcess.trip_route_id}`;
       displayMessageInPreview(`<h4>${tripToProcess.train_number} (${tripToProcess.seat_class}) on ${tripToProcess.date_of_journey}</h4><div class="slp-loader"></div><p class="slp-info">Fetching layout... (Reserved: ${tripToProcess.totalReservedForThisTrip}/${TARGET_SUCCESSFUL_RESERVATIONS})</p>`, false, tripToProcess.processId, tripToProcess.train_number);
       let localCurrentlyBookableSeats = []; 
       GM_xmlhttpRequest({
           method: "GET", url: fullGetApiUrl, headers: { "Authorization": capturedAccessToken, "Accept": "application/json", "Referer": "[https://eticket.railway.gov.bd/](https://eticket.railway.gov.bd/)", "X-Requested-With": "XMLHttpRequest" },
           onload: function(r) {
               let rdT = r.responseText; console.log(`Seat Layout for ${tripToProcess.train_number}:`, rdT); 
               if (r.status === 200) {
                   try {
                       let jD = JSON.parse(rdT);
                       if (jD.data && jD.data.seatLayout && Array.isArray(jD.data.seatLayout)) {
                           jD.data.seatLayout.forEach(f => { if (f && Array.isArray(f.layout)) { f.layout.forEach(rw => { if(Array.isArray(rw)) { rw.forEach(s => { if(s && s.seat_availability===1) localCurrentlyBookableSeats.push(s); });}});}});
                           if (localCurrentlyBookableSeats.length === 0) {
                               if (tripToProcess.totalReservedForThisTrip >= 1) { 
                                   tripToProcess.status = 'completed_partial_no_more_seats';
                                   isReservationLoopActive = false; if(loopTimeoutId) clearTimeout(loopTimeoutId); tripToProcess.isActiveInLoop = false; 
                                   let msg = `<h4>${tripToProcess.train_number} (${tripToProcess.seat_class}) on ${tripToProcess.date_of_journey}</h4><p class="slp-info">No more available seats found. Finalizing with ${tripToProcess.totalReservedForThisTrip} seat(s).</p>`;
                                   if (!document.getElementById(`tryMoreSeatsButton_${tripToProcess.processId}`) && tripToProcess.totalReservedForThisTrip < TARGET_SUCCESSFUL_RESERVATIONS) { 
                                       msg += `<button class="try-more-seats-btn" id="tryMoreSeatsButton_${tripToProcess.processId}" data-trip-process-id="${tripToProcess.processId}">Try More Seats for ${tripToProcess.train_number}</button>`;
                                   }
                                   displayMessageInPreview(msg, false, tripToProcess.processId, tripToProcess.train_number);
                                   if (manualOtpConfirmation) {
                                       displayMessageInPreview(`<button id="confirmDetailsRequestOtpButton_${tripToProcess.processId}">Confirm Details & Request OTP for ${tripToProcess.train_number}</button>`, true, tripToProcess.processId, tripToProcess.train_number);
                                       const confirmBtn = document.getElementById(`confirmDetailsRequestOtpButton_${tripToProcess.processId}`);
                                       if (confirmBtn) { confirmBtn.addEventListener('click', () => { confirmBtn.disabled = true; confirmBtn.textContent = "Processing..."; submitPassengerDetails(tripToProcess); });}
                                   } else {
                                       submitPassengerDetails(tripToProcess);
                                   }
                                   updateMainButtonState(); 
                               } else { 
                                   tripToProcess.status = 'failed_no_seats_this_round'; 
                                   displayMessageInPreview(`<h4>${tripToProcess.train_number} (${tripToProcess.seat_class}) on ${tripToProcess.date_of_journey}</h4><p class="slp-info">No available seats found in this attempt.</p>`, false, tripToProcess.processId, tripToProcess.train_number); 
                                   checkAllTripsCompletion(); 
                               }
                           } else {
                               const fSM = `<p class="slp-info">Found ${localCurrentlyBookableSeats.length} available seat(s). Reserving...</p>`;
                               displayMessageInPreview(`<h4>${tripToProcess.train_number} (${tripToProcess.seat_class}) on ${tripToProcess.date_of_journey}</h4><p class="slp-info">Total reserved: ${tripToProcess.totalReservedForThisTrip}/${TARGET_SUCCESSFUL_RESERVATIONS}</p>${fSM}<div class="slp-loader"></div>`, false, tripToProcess.processId, tripToProcess.train_number); 
                               reserveAllAvailableSeats(tripToProcess, localCurrentlyBookableSeats); 
                           }
                       } else { displayMessageInPreview(`<h4>${tripToProcess.train_number}</h4><p class="slp-error">Bad layout data.</p>`, false, tripToProcess.processId, tripToProcess.train_number); tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion();}
                   } catch (e) { displayMessageInPreview(`<h4>${tripToProcess.train_number}</h4><p class="slp-error">Error processing layout.</p>`, false, tripToProcess.processId, tripToProcess.train_number); tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion();}
               } else { 
                   displayMessageInPreview(`<h4>${tripToProcess.train_number}</h4><p class="slp-error">Error fetching layout. Status: ${r.status}</p>`, false, tripToProcess.processId, tripToProcess.train_number);
                   if(r.status===401){ handleTokenUpdate(null); tripToProcess.status = 'failed_permanently';} 
                   else {tripToProcess.status = 'failed_fetch_this_round';} 
                   checkAllTripsCompletion();
               }
           },
           onerror: function() { displayMessageInPreview(`<h4>${tripToProcess.train_number}</h4><p class="slp-error">GET Network Error.</p>`, false, tripToProcess.processId, tripToProcess.train_number); tripToProcess.status = 'failed_fetch_this_round'; checkAllTripsCompletion();},
           ontimeout: function() { displayMessageInPreview(`<h4>${tripToProcess.train_number}</h4><p class="slp-error">GET Timeout.</p>`, false, tripToProcess.processId, tripToProcess.train_number); tripToProcess.status = 'failed_fetch_this_round'; checkAllTripsCompletion();}
       });
   }

   async function reserveAllAvailableSeats(tripToProcess, availableSeatsFromApi) { 
       if (!isReservationLoopActive || !tripToProcess.isActiveInLoop) { checkAllTripsCompletion(); return; }
       if (!capturedAccessToken) { /* ... */ tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); return; }
       tripToProcess.status = 'reserving';
       
       if (!availableSeatsFromApi || !Array.isArray(availableSeatsFromApi)) {
           console.error("UserScript CRITICAL: availableSeatsFromApi is undefined or not an array in reserveAllAvailableSeats!", availableSeatsFromApi);
           displayMessageInPreview(`<h4>Error in Reserving Seats for ${tripToProcess.train_number}</h4><p class="slp-error">Internal script error: seat data missing or invalid. Please report this.</p>`, false, tripToProcess.processId, tripToProcess.train_number);
           tripToProcess.status = 'failed_permanently';
           checkAllTripsCompletion();
           return;
       }
       console.log(`UserScript: reserveAllAvailableSeats called for ${tripToProcess.train_number}. seatsToBook length: ${availableSeatsFromApi.length}`, availableSeatsFromApi);
       
       let finalOrderedSeatsToAttempt = [];
       const bogieMap = {};
       availableSeatsFromApi.forEach(seat => {
           const prefix = getSeatPrefix(seat.seat_number);
           if (!bogieMap[prefix]) {
               bogieMap[prefix] = [];
           }
           bogieMap[prefix].push(seat);
       });

       const sortedBogies = Object.keys(bogieMap).sort((a, b) => bogieMap[b].length - bogieMap[a].length);
       console.log(`UserScript: Bogies sorted by seat count for ${tripToProcess.train_number}:`, sortedBogies);

       sortedBogies.forEach(prefix => {
           let seatsInThisBogie = bogieMap[prefix];
           if (tripToProcess.seatPriority && tripToProcess.seatPriority.length > 0) {
               const prioritySeatsInBogie = [];
               const otherSeatsInBogie = [];
               seatsInThisBogie.forEach(seat => {
                   const numPart = getSeatNumericPart(seat.seat_number);
                   if (numPart !== null && tripToProcess.seatPriority.includes(numPart)) {
                       prioritySeatsInBogie.push(seat);
                   } else {
                       otherSeatsInBogie.push(seat);
                   }
               });
               prioritySeatsInBogie.sort((a, b) => {
                   const numA = getSeatNumericPart(a.seat_number);
                   const numB = getSeatNumericPart(b.seat_number);
                   return tripToProcess.seatPriority.indexOf(numA) - tripToProcess.seatPriority.indexOf(numB);
               });
               finalOrderedSeatsToAttempt.push(...prioritySeatsInBogie, ...otherSeatsInBogie);
           } else {
               finalOrderedSeatsToAttempt.push(...seatsInThisBogie);
           }
       });
        console.log(`UserScript: Final ordered seats to attempt for ${tripToProcess.train_number}:`, finalOrderedSeatsToAttempt.map(s => s.seat_number));


       let sBT = 0, fBT = 0; const sSeatNumbers = [], fSeatInfo = [];
       const rP = finalOrderedSeatsToAttempt.map(seat => {
           if (tripToProcess.totalReservedForThisTrip + sBT >= TARGET_SUCCESSFUL_RESERVATIONS) return Promise.resolve();
           return new Promise((resolve) => {
               const pL = { ticket_id: seat.ticket_id, route_id: parseInt(tripToProcess.trip_route_id) }; 
               GM_xmlhttpRequest({
                   method: "PATCH", url: reserveApiUrl, headers: { "Authorization": capturedAccessToken, "Content-Type": "application/json", "Accept": "application/json", "Referer": "[https://eticket.railway.gov.bd/](https://eticket.railway.gov.bd/)", "X-Requested-With": "XMLHttpRequest" },
                   data: JSON.stringify(pL),
                   onload: function(r) { try {const j=JSON.parse(r.responseText); console.log(`Reserve seat ${seat.seat_number} (ID: ${seat.ticket_id}) response:`, j); if(r.status===200&&j.data&&j.data.error===0){if(tripToProcess.totalReservedForThisTrip+sBT<TARGET_SUCCESSFUL_RESERVATIONS){sBT++;sSeatNumbers.push(seat.seat_number);const seatDetail = {ticket_id: parseInt(seat.ticket_id), seat_number: seat.seat_number}; tripToProcess.reservedTicketIdsForThisTrip.push(seatDetail); addHeldSeat(tripToProcess, seatDetail);}}else{fBT++;fSeatInfo.push({seat:seat.seat_number, id:seat.ticket_id,r:j.data?j.data.message:`HTTP ${r.status}`,s:r.status});}}catch(e){fBT++;fSeatInfo.push({seat:seat.seat_number,id:seat.ticket_id,r:"Invalid JSON",s:r.status});} resolve(); },
                   onerror: function(){fBT++;fSeatInfo.push({seat:seat.seat_number,id:seat.ticket_id,r:"Network error",s:"N/A"});resolve();},
                   ontimeout: function(){fBT++;fSeatInfo.push({seat:seat.seat_number,id:seat.ticket_id,r:"Timeout",s:"N/A"});resolve();}
               });
           });
       });
       await Promise.allSettled(rP);
       tripToProcess.totalReservedForThisTrip += sBT;
       
       let seatsToBookLength = 0;
       if (availableSeatsFromApi && typeof availableSeatsFromApi.length === 'number') { 
           seatsToBookLength = availableSeatsFromApi.length;
       } else {
           console.warn("UserScript: availableSeatsFromApi was not an array or had no length at iFM creation point inside reserveAllAvailableSeats:", availableSeatsFromApi);
       }
       const trainNumStr = tripToProcess && tripToProcess.train_number ? tripToProcess.train_number : "N/A";
       const journeyDateStr = tripToProcess && tripToProcess.date_of_journey ? tripToProcess.date_of_journey : "N/A";
       const iFM = `<p class="slp-info">Attempted to reserve from ${seatsToBookLength} available seats for ${trainNumStr} on ${journeyDateStr}.</p>`;
       
       let sumHTML = `<div class="reservation-summary"><strong>Batch Summary for ${tripToProcess.train_number}:</strong> Reserved ${sBT}, Failed ${fBT}.<br>`;
       if(tripToProcess.reservedTicketIdsForThisTrip.length > 0) { 
           sumHTML += `Currently Held Seats for this Trip:<ul>${tripToProcess.reservedTicketIdsForThisTrip.map(s => `<li class="success">${s.seat_number} <button class="release-seat-btn" data-trip-process-id="${tripToProcess.processId}" data-ticket-id="${s.ticket_id}" data-seat-number="${s.seat_number}">X</button></li>`).join('')}</ul>`;
       }
       if(fSeatInfo.length > 0) sumHTML += `Failed Seat Numbers & Reasons (Batch):<ul>${fSeatInfo.map(f=>`<li class="failure">${f.seat} (S:${f.s}-${f.r})</li>`).join('')}</ul>`;
       sumHTML += `<strong>Total Reserved for this Trip: ${tripToProcess.totalReservedForThisTrip}/${TARGET_SUCCESSFUL_RESERVATIONS}</strong></div>`;
       
       let fHTML = `<h4>Reservation for ${tripToProcess.train_number} on ${tripToProcess.date_of_journey}</h4>${sumHTML}${iFM}`; 
       
       if (tripToProcess.totalReservedForThisTrip >= TARGET_SUCCESSFUL_RESERVATIONS || (tripToProcess.totalReservedForThisTrip > 0 && availableSeatsFromApi.length === sBT && sBT < TARGET_SUCCESSFUL_RESERVATIONS) ) {
           tripToProcess.status = (tripToProcess.totalReservedForThisTrip >= TARGET_SUCCESSFUL_RESERVATIONS) ? 'target_met_reservation' : 'completed_partial_no_more_seats';
           
           if (tripToProcess.status === 'target_met_reservation') {
                fHTML = `<h4>TARGET RESERVED for ${tripToProcess.train_number} on ${tripToProcess.date_of_journey}!</h4><p class="slp-success">Successfully reserved ${tripToProcess.totalReservedForThisTrip} seat(s)!</p>` + sumHTML + iFM;
           } else { // completed_partial_no_more_seats
                fHTML += `<p class="slp-info">All available seats in this batch booked. Total for trip: ${tripToProcess.totalReservedForThisTrip}. No more seats found in this attempt. Proceeding to finalize this trip.</p>`;
           }
           
           displayMessageInPreview(fHTML, false, tripToProcess.processId, tripToProcess.train_number); 
           // addReleaseButtonListeners(tripToProcess.processId); // Event delegation handles this

           isReservationLoopActive = false; 
           if (loopTimeoutId) { clearTimeout(loopTimeoutId); loopTimeoutId = null; }
           tripToProcess.isActiveInLoop = false; 
           if (tripToProcess.timeoutId) { clearTimeout(tripToProcess.timeoutId); tripToProcess.timeoutId = null;}


           if (manualOtpConfirmation) {
               displayMessageInPreview(`<button id="confirmDetailsRequestOtpButton_${tripToProcess.processId}">Confirm Details & Request OTP for ${tripToProcess.train_number}</button>`, true, tripToProcess.processId, tripToProcess.train_number);
               const confirmBtn = document.getElementById(`confirmDetailsRequestOtpButton_${tripToProcess.processId}`);
               if (confirmBtn) { confirmBtn.addEventListener('click', () => { confirmBtn.disabled = true; confirmBtn.textContent = "Processing..."; submitPassengerDetails(tripToProcess); });}
               updateMainButtonState("Action Required in Preview"); 
           } else {
               submitPassengerDetails(tripToProcess); 
           }
           updateMainButtonState(); 
           return; 

       } else { 
           tripToProcess.status = sBT > 0 ? 'pending_more_seats_this_round' : 'failed_reservations_this_round';
           fHTML += `<p class="slp-info">Target not met for ${tripToProcess.train_number}. Will try next trip or next round.</p>`;
           if (tripToProcess.totalReservedForThisTrip > 0 && tripToProcess.totalReservedForThisTrip < TARGET_SUCCESSFUL_RESERVATIONS && !isReservationLoopActive) { 
                if (!document.getElementById(`tryMoreSeatsButton_${tripToProcess.processId}`)) {
                   fHTML += `<button class="try-more-seats-btn" id="tryMoreSeatsButton_${tripToProcess.processId}" data-trip-process-id="${tripToProcess.processId}">Try More Seats for ${tripToProcess.train_number}</button>`;
                }
           }
           displayMessageInPreview(fHTML, false, tripToProcess.processId, tripToProcess.train_number); 
           // addReleaseButtonListeners(tripToProcess.processId); // Event delegation handles this
           checkAllTripsCompletion(); 
       }
   }

   async function submitPassengerDetails(tripToProcess) { /* Same as v1.6.2 */ 
       const confirmBtn = document.getElementById(`confirmDetailsRequestOtpButton_${tripToProcess.processId}`);
       if(confirmBtn) confirmBtn.remove(); 
       if (!capturedAccessToken) { tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); return; }
       if (tripToProcess.reservedTicketIdsForThisTrip.length === 0) { tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); return; }
       tripToProcess.status = 'submitting_details';
       displayMessageInPreview(`<h3>Passenger Details for ${tripToProcess.train_number} on ${tripToProcess.date_of_journey}</h3><div class="slp-loader"></div><p class="slp-info">Submitting details...</p>`, true, tripToProcess.processId, tripToProcess.train_number);
       const ticketIdsOnly = tripToProcess.reservedTicketIdsForThisTrip.map(s => s.ticket_id);
       const payload = { trip_id: parseInt(tripToProcess.trip_id), trip_route_id: parseInt(tripToProcess.trip_route_id), ticket_ids: ticketIdsOnly };
       GM_xmlhttpRequest({
           method: "POST", url: passengerDetailsApiUrl, headers: { "Authorization": capturedAccessToken, "Content-Type": "application/json", "Accept": "application/json", "Referer": "[https://eticket.railway.gov.bd/](https://eticket.railway.gov.bd/)", "X-Requested-With": "XMLHttpRequest" },
           data: JSON.stringify(payload),
           onload: function(r) {
               let pRHTML = `<h4>Passenger Details Result for ${tripToProcess.train_number}:</h4>`; let detailsSuccess = false;
               try { const j = JSON.parse(r.responseText); console.log(`Passenger Details for ${tripToProcess.train_number} response:`, j);
                   if (r.status === 200 && j.data && j.data.success === true) { pRHTML += `<p class="slp-success">Details submitted! Msg: ${j.data.msg || 'OTP sent.'}</p>`; detailsSuccess = true;
                   } else { let eM = 'Unknown error.'; if(j.data && (j.data.message||j.data.msg)) eM=j.data.message||j.data.msg; else if(j.message) eM=j.message; pRHTML += `<p class="slp-error">Failed. Status: ${r.status}. Msg: ${eM}</p>`;}
               } catch (e) { pRHTML += `<p class="slp-error">Error parsing response (Status: ${r.status}).</p>`;}
               displayMessageInPreview(pRHTML, true, tripToProcess.processId, tripToProcess.train_number); 
               if (detailsSuccess) { tripToProcess.status = 'otp_pending'; promptAndVerifyOtp(tripToProcess); } 
               else { tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); } 
           },
           onerror: function() { displayMessageInPreview(`<h4>Passenger Details for ${tripToProcess.train_number}</h4><p class="slp-error">Network error.</p>`, true, tripToProcess.processId, tripToProcess.train_number); tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); },
           ontimeout: function() { displayMessageInPreview(`<h4>Passenger Details for ${tripToProcess.train_number}</h4><p class="slp-error">Timeout.</p>`, true, tripToProcess.processId, tripToProcess.train_number); tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); }
       });
   }

   async function promptAndVerifyOtp(tripToProcess) { /* Same as v1.6.2 */
       if (!capturedAccessToken) { tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); return; }
       if (tripToProcess.reservedTicketIdsForThisTrip.length === 0) { tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); return; }
       const reservedSeatNumbers = tripToProcess.reservedTicketIdsForThisTrip.map(s => s.seat_number).join(', ');
       const otpInput = prompt(`OTP sent for ${tripToProcess.train_number} on ${tripToProcess.date_of_journey}. Enter OTP for seats: ${reservedSeatNumbers}`);
       if (otpInput === null || otpInput.trim() === "") { displayMessageInPreview(`<h3>OTP for ${tripToProcess.train_number}</h3><p class="slp-info">OTP entry cancelled.</p>`, true, tripToProcess.processId, tripToProcess.train_number); tripToProcess.status = 'halted'; checkAllTripsCompletion(); return; }
       tripToProcess.currentOtpForThisTrip = otpInput.trim(); 
       displayMessageInPreview(`<h3>OTP Verification for ${tripToProcess.train_number}</h3><div class="slp-loader"></div><p class="slp-info">Verifying OTP...</p>`, true, tripToProcess.processId, tripToProcess.train_number);
       const ticketIdsOnly = tripToProcess.reservedTicketIdsForThisTrip.map(s => s.ticket_id);
       const payload = { trip_id: parseInt(tripToProcess.trip_id), trip_route_id: parseInt(tripToProcess.trip_route_id), ticket_ids: ticketIdsOnly, otp: tripToProcess.currentOtpForThisTrip };
       GM_xmlhttpRequest({
           method: "POST", url: verifyOtpApiUrl, headers: { "Authorization": capturedAccessToken, "Content-Type": "application/json", "Accept": "application/json", "Referer": "[https://eticket.railway.gov.bd/](https://eticket.railway.gov.bd/)", "X-Requested-With": "XMLHttpRequest" },
           data: JSON.stringify(payload),
           onload: function(r) {
               let otpRHTML = `<h4>OTP Result for ${tripToProcess.train_number}:</h4>`; let otpSuccess = false;
               try { const j = JSON.parse(r.responseText); console.log(`OTP Verify for ${tripToProcess.train_number} response:`, j);
                   if (r.status === 200 && j.data && j.data.success === true) { otpRHTML += `<p class="slp-success">OTP Verified!</p>`; otpSuccess = true;
                   } else { let eM='Unknown OTP error.';if(j.data&&(j.data.message||j.data.msg))eM=j.data.message||j.data.msg;else if(j.message)eM=j.message; otpRHTML += `<p class="slp-error">OTP Failed. Status: ${r.status}. Msg: ${eM}</p>`;}
               } catch (e) { otpRHTML += `<p class="slp-error">Error parsing OTP response (Status: ${r.status}).</p>`; }
               displayMessageInPreview(otpRHTML, true, tripToProcess.processId, tripToProcess.train_number);
               if (otpSuccess) { tripToProcess.status = 'otp_verified'; confirmBooking(tripToProcess); 
               } else { tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); }
           },
           onerror: function() { displayMessageInPreview(`<h4>OTP Result for ${tripToProcess.train_number}</h4><p class="slp-error">Network error.</p>`, true, tripToProcess.processId, tripToProcess.train_number); tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion();},
           ontimeout: function() { displayMessageInPreview(`<h4>OTP Result for ${tripToProcess.train_number}</h4><p class="slp-error">Timeout.</p>`, true, tripToProcess.processId, tripToProcess.train_number); tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion();}
       });
   }

   async function confirmBooking(tripToProcess) { /* Same as v1.6.2 */
       if (!capturedAccessToken) { tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); return; }
       if (tripToProcess.reservedTicketIdsForThisTrip.length === 0) { tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); return; }
       if (!tripToProcess.currentOtpForThisTrip) { tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion(); return; }
       tripToProcess.status = 'confirming_booking';
       displayMessageInPreview(`<h3>Booking Confirmation for ${tripToProcess.train_number} on ${tripToProcess.date_of_journey}</h3><div class="slp-loader"></div><p class="slp-info">Confirming booking...</p>`, true, tripToProcess.processId, tripToProcess.train_number);
       const numTickets = tripToProcess.reservedTicketIdsForThisTrip.length; 
       const defaultPassengerArray = (val) => Array(numTickets).fill(val);
       const defaultPassengerNameArray = Array.from({length: numTickets}, (_, i) => `Passenger ${i + 1}`); 
       const ticketIdsOnly = tripToProcess.reservedTicketIdsForThisTrip.map(s => s.ticket_id);
       const payload = {
           is_bkash_online: true, boarding_point_id: (tripToProcess.boarding_points && tripToProcess.boarding_points.length > 0) ? tripToProcess.boarding_points[0].trip_point_id : 108315645, 
           contactperson: 0, date_of_birth: defaultPassengerArray(null), date_of_journey: tripToProcess.date_of_journey, enable_sms_alert: 0,
           first_name: defaultPassengerArray(null), from_city: tripToProcess.from_city, gender: defaultPassengerArray("male"), 
           isShohoz: 0, last_name: defaultPassengerArray(null), middle_name: defaultPassengerArray(null),
           nationality: defaultPassengerArray(null), otp: tripToProcess.currentOtpForThisTrip, page: defaultPassengerArray(""),
           passengerType: defaultPassengerArray("Adult"), passport_expiry_date: defaultPassengerArray(null),
           passport_no: defaultPassengerArray(null), passport_type: defaultPassengerArray(null),
           pemail: "toukirsbl19@gmail.com", pmobile: "01770102419", pname: defaultPassengerNameArray, 
           ppassport: defaultPassengerArray(""), priyojon_order_id: null, referral_mobile_number: null,
           seat_class: tripToProcess.seat_class, selected_mobile_transaction: 1, 
           ticket_ids: ticketIdsOnly, to_city: tripToProcess.to_city, 
           trip_id: parseInt(tripToProcess.trip_id), trip_route_id: parseInt(tripToProcess.trip_route_id), 
           visa_expire_date: defaultPassengerArray(null), visa_issue_date: defaultPassengerArray(null),
           visa_issue_place: defaultPassengerArray(null), visa_no: defaultPassengerArray(null),
           visa_type: defaultPassengerArray(null),
       };
       GM_xmlhttpRequest({
           method: "PATCH", url: confirmBookingApiUrl, headers: { "Authorization": capturedAccessToken, "Content-Type": "application/json", "Accept": "application/json", "Referer": "[https://eticket.railway.gov.bd/](https://eticket.railway.gov.bd/)", "X-Requested-With": "XMLHttpRequest" },
           data: JSON.stringify(payload),
           onload: function(r) {
               let cRHTML = `<h4>Confirm Result for ${tripToProcess.train_number}:</h4>`; let bookingSuccess = false; 
               try {
                   const j = JSON.parse(r.responseText); console.log(`Confirm Booking for ${tripToProcess.train_number} response:`, j); let sM=(j.data&&(j.data.message||j.data.msg))||j.message||"No message.";
                   if(r.status===200&&j.data&&(j.data.success===true||j.data.error===0||j.data.redirectUrl||sM.toLowerCase().includes("confirmed"))){bookingSuccess=true;} 
                   if(bookingSuccess){cRHTML+=`<p class="slp-success">Confirmed! Msg: ${sM}</p>`; if(j.data&&j.data.redirectUrl){cRHTML+=`<p class="slp-info">Payment Gateway URL: <a href="${j.data.redirectUrl}" target="_blank">${j.data.redirectUrl}</a>. Redirecting...</p>`; window.location.href = j.data.redirectUrl;} tripToProcess.status = 'completed_success';}
                   else{cRHTML+=`<p class="slp-error">Confirm Failed. Status: ${r.status}. Msg: ${sM}</p>`; tripToProcess.status = 'failed_permanently';}
               } catch (e) { cRHTML+=`<p class="slp-error">Error parsing confirm response (Status: ${r.status}).</p>`; tripToProcess.status = 'failed_permanently';}
               displayMessageInPreview(cRHTML, true, tripToProcess.processId, tripToProcess.train_number);
               if(bookingSuccess) { 
                   let heldSeats = getHeldSeats();
                   tripToProcess.reservedTicketIdsForThisTrip.forEach(confirmedSeat => {
                       heldSeats = heldSeats.filter(hs => hs.ticket_id !== confirmedSeat.ticket_id);
                   });
                   saveHeldSeats(heldSeats);
               }
               checkAllTripsCompletion();
           },
           onerror: function() { displayMessageInPreview(`<h4>Confirm Result for ${tripToProcess.train_number}</h4><p class="slp-error">Network error.</p>`, true, tripToProcess.processId, tripToProcess.train_number); tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion();},
           ontimeout: function() { displayMessageInPreview(`<h4>Confirm Result for ${tripToProcess.train_number}</h4><p class="slp-error">Timeout.</p>`, true, tripToProcess.processId, tripToProcess.train_number); tripToProcess.status = 'failed_permanently'; checkAllTripsCompletion();}
       });
   }
   
   async function releaseAllScriptHeldSeats(calledFromRestart = false) { /* Same as v1.6.2 */
       if (!capturedAccessToken) { displayMessageInPreview("<h3>Release Seats</h3><p class='slp-error'>Access Token not available.</p>"); return false; }
       if (isReservationLoopActive && !calledFromRestart) { displayMessageInPreview("<h3>Release Seats</h3><p class='slp-error'>Cannot release seats while booking loop is active. Please stop the loop first.</p>"); return false; }
       updateMainButtonState("Releasing Seats...");
       displayMessageInPreview("<h3>Releasing All Held Seats</h3><div class='slp-loader'></div><p class='slp-info'>Attempting to release all seats currently held by the script...</p>");
       let heldSeats = getHeldSeats();
       if (heldSeats.length === 0) { 
           displayMessageInPreview("<h3>Release Seats</h3><p class='slp-info'>No seats currently held by the script to release.</p>"); 
           if (calledFromRestart) startNewBookingProcessActual(); else updateMainButtonState();
           return true; 
       }
       let successfulReleases = 0; let failedReleases = 0; const releasedSeatNumbers = []; const failedReleaseInfo = [];
       const releasePromises = heldSeats.map(seatInfo => {
           return new Promise((resolve) => {
               const payload = { ticket_id: parseInt(seatInfo.ticket_id), route_id: parseInt(seatInfo.trip_route_id) };
               GM_xmlhttpRequest({
                   method: "PATCH", url: releaseSeatApiUrl, 
                   headers: { "Authorization": capturedAccessToken, "Content-Type": "application/json", "Accept": "application/json", "Referer": "[https://eticket.railway.gov.bd/](https://eticket.railway.gov.bd/)", "X-Requested-With": "XMLHttpRequest" },
                   data: JSON.stringify(payload),
                   onload: function(response) {
                       try {
                           const responseJson = JSON.parse(response.responseText); console.log(`Release seat ${seatInfo.seat_number} (ID: ${seatInfo.ticket_id}) response:`, responseJson);
                           let isSuccess = (response.status === 200 && (!responseJson.data || responseJson.data.error === 0 || responseJson.data.success === true || !responseJson.error));
                           if (responseJson.data && typeof responseJson.data.message === 'string' && responseJson.data.message.toLowerCase().includes("already released")) isSuccess = true; 
                           if (isSuccess) { 
                               successfulReleases++; releasedSeatNumbers.push(seatInfo.seat_number); 
                               removeHeldSeat(seatInfo.ticket_id); 
                               const tripInQueue = selectedTripsForQueue.find(t => t.processId === seatInfo.trip_process_id);
                               if (tripInQueue) {
                                   tripInQueue.reservedTicketIdsForThisTrip = tripInQueue.reservedTicketIdsForThisTrip.filter(s => s.ticket_id !== seatInfo.ticket_id);
                                   tripInQueue.totalReservedForThisTrip = tripInQueue.reservedTicketIdsForThisTrip.length;
                                    if(tripInQueue.status.startsWith('target_met')) tripInQueue.status = 'queued';
                               } else if (currentTripDetailsForSingleRun && currentTripDetailsForSingleRun.processId === seatInfo.trip_process_id) {
                                   currentTripDetailsForSingleRun.reservedTicketIdsForThisTrip = currentTripDetailsForSingleRun.reservedTicketIdsForThisTrip.filter(s => s.ticket_id !== seatInfo.ticket_id);
                                   currentTripDetailsForSingleRun.totalReservedForThisTrip = currentTripDetailsForSingleRun.reservedTicketIdsForThisTrip.length;
                                    if(currentTripDetailsForSingleRun.status.startsWith('target_met')) currentTripDetailsForSingleRun.status = 'queued';
                               }
                           } 
                           else { failedReleases++; failedReleaseInfo.push({ seat: seatInfo.seat_number, id: seatInfo.ticket_id, reason: (responseJson.data ? responseJson.data.message : (responseJson.message || "Unknown error")), status: response.status }); }
                       } catch (e) { failedReleases++; failedReleaseInfo.push({ seat: seatInfo.seat_number, id: seatInfo.ticket_id, reason: "Invalid JSON response or script error", status: response.status }); console.error(`UserScript: Error processing release response for ticket_id: ${seatInfo.ticket_id}`, e, response.responseText); }
                       resolve();
                   },
                   onerror: function() { failedReleases++; failedReleaseInfo.push({ seat: seatInfo.seat_number, id: seatInfo.ticket_id, reason: "Network error", status: "N/A" }); resolve(); },
                   ontimeout: function() { failedReleases++; failedReleaseInfo.push({ seat: seatInfo.seat_number, id: seatInfo.ticket_id, reason: "Request timeout", status: "N/A" }); resolve(); }
               });
           });
       });
       await Promise.allSettled(releasePromises);
       let summaryHTML = `<div class="reservation-summary"><strong>Seat Release Attempt Summary:</strong><br>Successfully released: <strong>${successfulReleases}</strong> seat(s).<br>`;
       if (releasedSeatNumbers.length > 0) summaryHTML += `Released Seat Numbers:<ul>${releasedSeatNumbers.map(sNum => `<li class="success">${sNum}</li>`).join('')}</ul>`;
       summaryHTML += `Failed to release: <strong>${failedReleases}</strong> seat(s).<br>`;
       if (failedReleaseInfo.length > 0) summaryHTML += `Failed Releases:<ul>${failedReleaseInfo.map(f => `<li class="failure">${f.seat} (ID: ${f.id}, Status: ${f.status} - ${f.reason})</li>`).join('')}</ul>`;
       summaryHTML += `</div>`;
       displayMessageInPreview(`<h3>Release Seat Results</h3>${summaryHTML}`);
       if (calledFromRestart) {
           displayMessageInPreview("<p class='slp-info'>Previous seats released. Starting new booking process...</p>", true);
           startNewBookingProcessActual(); 
       } else {
           updateMainButtonState(); 
       }
       updateQueuedTripsDisplay(); 
       return true; 
   }

   async function releaseSingleSeat(tripToProcess, ticketIdToReleaseStr, seatNumberToDisplay) { /* Same as v1.6.2 */
       if (!capturedAccessToken) { displayMessageInPreview(`<h4>${tripToProcess.train_number}</h4><p class="slp-error">Token lost. Cannot release seat.</p>`, true, tripToProcess.processId); return; }
       if (!tripToProcess) { console.error("UserScript: Trip object missing for single seat release."); return; }
       const ticketIdToRelease = parseInt(ticketIdToReleaseStr); 
       console.log(`UserScript: Attempting to release seat: ${seatNumberToDisplay} (Ticket ID: ${ticketIdToRelease}) for trip ${tripToProcess.train_number}`);
       displayMessageInPreview(`<h4>${tripToProcess.train_number}</h4><p class="slp-info">Attempting to release seat ${seatNumberToDisplay} (ID: ${ticketIdToRelease})...</p>`, true, tripToProcess.processId);
       const payload = { ticket_id: ticketIdToRelease, route_id: parseInt(tripToProcess.trip_route_id) };
       GM_xmlhttpRequest({
           method: "PATCH", url: releaseSeatApiUrl,
           headers: { "Authorization": capturedAccessToken, "Content-Type": "application/json", "Accept": "application/json", "Referer": "[https://eticket.railway.gov.bd/](https://eticket.railway.gov.bd/)", "X-Requested-With": "XMLHttpRequest" },
           data: JSON.stringify(payload),
           onload: function(response) {
               let releaseMsg = "";
               try {
                   const responseJson = JSON.parse(response.responseText);
                   console.log(`Release single seat ${seatNumberToDisplay} response:`, responseJson);
                    let isSuccess = (response.status === 200 && (!responseJson.data || responseJson.data.error === 0 || responseJson.data.success === true || !responseJson.error));
                    if (responseJson.data && typeof responseJson.data.message === 'string' && responseJson.data.message.toLowerCase().includes("already released")) isSuccess = true;
                   if (isSuccess) {
                       releaseMsg = `<p class="slp-success">Seat ${seatNumberToDisplay} released successfully (or was already free).</p>`;
                       tripToProcess.reservedTicketIdsForThisTrip = tripToProcess.reservedTicketIdsForThisTrip.filter(s => s.ticket_id !== ticketIdToRelease);
                       tripToProcess.totalReservedForThisTrip = tripToProcess.reservedTicketIdsForThisTrip.length;
                       removeHeldSeat(ticketIdToRelease); 
                       const summaryDiv = document.getElementById(tripToProcess.processId)?.querySelector('.reservation-summary');
                       if(summaryDiv) {
                           const totalReservedSpan = summaryDiv.querySelector('strong:last-of-type'); 
                           if(totalReservedSpan) totalReservedSpan.textContent = `${tripToProcess.totalReservedForThisTrip}/${TARGET_SUCCESSFUL_RESERVATIONS}`;
                           const ulElements = summaryDiv.querySelectorAll('ul');
                           ulElements.forEach(ulElement => { 
                               const firstLi = ulElement.querySelector('li.success button.release-seat-btn');
                               if (firstLi && firstLi.dataset.tripProcessId === tripToProcess.processId) {
                                   ulElement.innerHTML = tripToProcess.reservedTicketIdsForThisTrip.map(s => `<li class="success">${s.seat_number} <button class="release-seat-btn" data-trip-process-id="${tripToProcess.processId}" data-ticket-id="${s.ticket_id}" data-seat-number="${s.seat_number}">X</button></li>`).join('');
                               }
                           });
                       }
                       if (tripToProcess.status.startsWith('target_met') && tripToProcess.totalReservedForThisTrip < TARGET_SUCCESSFUL_RESERVATIONS) {
                           tripToProcess.status = 'pending_more_seats_this_round'; 
                           if(isReservationLoopActive && tripToProcess.isActiveInLoop) {
                                displayMessageInPreview(`<p class="slp-info">Target no longer met for ${tripToProcess.train_number}. Will retry in next round if loop active.</p>`, true, tripToProcess.processId);
                           }
                       }
                       if (!isReservationLoopActive && tripToProcess.totalReservedForThisTrip < TARGET_SUCCESSFUL_RESERVATIONS && tripToProcess.totalReservedForThisTrip > 0) {
                           const tripDiv = document.getElementById(tripToProcess.processId);
                           if (tripDiv && !tripDiv.querySelector('.try-more-seats-btn')) {
                               displayMessageInPreview(`<button class="try-more-seats-btn" id="tryMoreSeatsButton_${tripToProcess.processId}" data-trip-process-id="${tripToProcess.processId}">Try More Seats for ${tripToProcess.train_number}</button>`, true, tripToProcess.processId);
                           }
                       } else if (!isReservationLoopActive && tripToProcess.totalReservedForThisTrip === 0) { 
                            const tryMoreButton = document.getElementById(tripToProcess.processId)?.querySelector('.try-more-seats-btn');
                            if(tryMoreButton) tryMoreButton.remove();
                       }
                   } else {
                       releaseMsg = `<p class="slp-error">Failed to release seat ${seatNumberToDisplay}. Server: ${responseJson.data ? responseJson.data.message : "Unknown error"}</p>`;
                   }
               } catch (e) {
                   releaseMsg = `<p class="slp-error">Error processing release for seat ${seatNumberToDisplay}.</p>`;
                   console.error("Error releasing single seat:", e);
               }
               displayMessageInPreview(releaseMsg, true, tripToProcess.processId);
               updateMainButtonState(); 
               checkAllTripsCompletion(); 
           },
           onerror: function() { displayMessageInPreview(`<h4>${tripToProcess.train_number}</h4><p class="slp-error">Network error releasing seat ${seatNumberToDisplay}.</p>`, true, tripToProcess.processId); updateMainButtonState(); },
           ontimeout: function() { displayMessageInPreview(`<h4>${tripToProcess.train_number}</h4><p class="slp-error">Timeout releasing seat ${seatNumberToDisplay}.</p>`, true, tripToProcess.processId); updateMainButtonState(); }
       });
   }

   // --- Settings Modal Functions ---
   function openSettingsModal() { 
       if (!settingsModal) createSettingsModal(); 
       if (allFoundTrainsMasterList.length === 0 && capturedAccessToken) {
           trainNameSelect.innerHTML = '<option value="">Fetching train list...</option>';
           seatClassSelect.innerHTML = '<option value="">-- Select Seat Class --</option>';
           seatClassSelect.disabled = true;
           document.getElementById('addTripToQueueButton').disabled = true; 
           settingsModal.style.display = 'flex'; 
           searchForTrips(false, populateModalDropdowns); 
       } else {
           populateModalDropdowns(); 
           settingsModal.style.display = 'flex';
       }
   }
   function populateModalDropdowns() {
       if (!settingsModal && !trainNameSelect) { return; }
       trainNameSelect.innerHTML = '<option value="">-- Select a Train --</option>';
       seatClassSelect.innerHTML = '<option value="">-- Select Seat Class --</option>';
       seatClassSelect.disabled = true;
       document.getElementById('addTripToQueueButton').disabled = true;
       document.getElementById('seatPriorityInput').value = ''; 
       if (allFoundTrainsMasterList.length === 0) {
           trainNameSelect.innerHTML = '<option value="">No trips found or search failed. Try main search.</option>';
       } else {
           allFoundTrainsMasterList.forEach((train, index) => {
               const option = document.createElement('option');
               option.value = index; 
               option.textContent = `${train.train_number} (Dep: ${train.departure_date_time})`;
               trainNameSelect.appendChild(option);
           });
       }
       updateQueuedTripsDisplay(); 
       if (settingsModal && settingsModal.style.display !== 'flex') {
           settingsModal.style.display = 'flex';
       }
   }
   function closeSettingsModal() { if (settingsModal) settingsModal.style.display = 'none'; updateMainButtonState(); }
   function handleTrainSelection() { 
       const selectedTrainIndex = trainNameSelect.value;
       seatClassSelect.innerHTML = '<option value="">-- Select Seat Class --</option>';
       seatClassSelect.disabled = true;
       document.getElementById('addTripToQueueButton').disabled = true;
       if (selectedTrainIndex === "") return;
       const selectedTrain = allFoundTrainsMasterList[parseInt(selectedTrainIndex)];
       if (selectedTrain && selectedTrain.seat_types) {
           selectedTrain.seat_types.forEach(sc => {
               const option = document.createElement('option');
               option.value = sc.type;
               let totalSeats = 'N/A';
               if (sc.seat_counts && typeof sc.seat_counts.online === 'number' && typeof sc.seat_counts.offline === 'number') {
                   totalSeats = sc.seat_counts.online + sc.seat_counts.offline;
               } else if (sc.seat_counts && typeof sc.seat_counts.online === 'number') { 
                   totalSeats = sc.seat_counts.online;
               } else if (sc.seat_counts && typeof sc.seat_counts.offline === 'number') { 
                    totalSeats = sc.seat_counts.offline;
               }
               option.textContent = `${sc.type} (Fare: ${sc.fare}, Seats: ${totalSeats})`; 
               option.dataset.tripId = sc.trip_id; 
               option.dataset.tripRouteId = sc.trip_route_id;
               seatClassSelect.appendChild(option);
           });
           seatClassSelect.disabled = false;
       }
   }
   function handleSeatClassSelection() { 
        if (seatClassSelect.value !== "") document.getElementById('addTripToQueueButton').disabled = false;
        else document.getElementById('addTripToQueueButton').disabled = true;
   }
   function addSelectedTripToQueue() {
       const selectedTrainIndex = trainNameSelect.value;
       const selectedSeatClassValue = seatClassSelect.value;
       const priorityInput = document.getElementById('seatPriorityInput').value.trim();
       let seatPriorityNumbers = [];
       if (priorityInput) {
           seatPriorityNumbers = priorityInput.split(',')
               .map(numStr => parseInt(numStr.trim(), 10))
               .filter(num => !isNaN(num) && num > 0); 
       }

       if (selectedTrainIndex === "" || selectedSeatClassValue === "") { alert("Please select both a train and a seat class."); return; }
       const selectedTrain = allFoundTrainsMasterList[parseInt(selectedTrainIndex)];
       const seatTypeDetails = selectedTrain.seat_types.find(st => st.type === selectedSeatClassValue);
       if (selectedTrain && seatTypeDetails) {
           const tripConfig = {
               trip_id: seatTypeDetails.trip_id,
               trip_route_id: seatTypeDetails.trip_route_id,
               from_city: selectedTrain.origin_city_name || SEARCH_FROM_CITY,
               to_city: selectedTrain.destination_city_name || SEARCH_TO_CITY,
               date_of_journey: SEARCH_DATE_OF_JOURNEY, 
               seat_class: seatTypeDetails.type,
               train_number: selectedTrain.train_number,
               boarding_points: selectedTrain.boarding_points,
               seatPriority: seatPriorityNumbers, 
               processId: `trip_proc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
               status: 'queued', 
               totalReservedForThisTrip: 0,
               reservedTicketIdsForThisTrip: [], 
               currentOtpForThisTrip: null,
               isActiveInLoop: false, 
               timeoutId : null
           };
           selectedTripsForQueue.push(tripConfig);
           saveQueueToLocalStorage(); 
           console.log("UserScript: Added to queue:", tripConfig);
           updateQueuedTripsDisplay();
           trainNameSelect.value = "";
           seatClassSelect.innerHTML = '<option value="">-- Select Seat Class --</option>';
           seatClassSelect.disabled = true;
           document.getElementById('addTripToQueueButton').disabled = true;
           document.getElementById('seatPriorityInput').value = ''; 
       } else { alert("Error adding trip to queue. Please try again."); }
   }
   function updateQueuedTripsDisplay() { 
       if (!queuedTripsDiv) return;
       queuedTripsDiv.innerHTML = "<strong>Booking Queue:</strong><br>";
       if (selectedTripsForQueue.length === 0) {
           queuedTripsDiv.innerHTML += "<em>Queue is empty.</em>";
       } else {
           selectedTripsForQueue.forEach((trip, index) => {
               const itemDiv = document.createElement('div');
               let priorityText = trip.seatPriority && trip.seatPriority.length > 0 ? ` (Prio: ${trip.seatPriority.join(',')})` : '';
               itemDiv.innerHTML = `
                   <span>${index + 1}. ${trip.train_number} (${trip.seat_class}) on ${trip.date_of_journey}${priorityText} - Target: ${TARGET_SUCCESSFUL_RESERVATIONS}</span>
                   <span class="queue-item-controls">
                       ${index > 0 ? `<button data-index="${index}" class="move-up">↑</button>` : ''}
                       ${index < selectedTripsForQueue.length - 1 ? `<button data-index="${index}" class="move-down">↓</button>` : ''}
                   </span>`;
               queuedTripsDiv.appendChild(itemDiv);
           });
           queuedTripsDiv.querySelectorAll('.move-up').forEach(btn => btn.addEventListener('click', (e) => moveQueueItem(parseInt(e.target.dataset.index), -1)));
           queuedTripsDiv.querySelectorAll('.move-down').forEach(btn => btn.addEventListener('click', (e) => moveQueueItem(parseInt(e.target.dataset.index), 1)));
       }
   }
   function moveQueueItem(index, direction) { 
       if (direction === -1 && index > 0) { [selectedTripsForQueue[index], selectedTripsForQueue[index - 1]] = [selectedTripsForQueue[index - 1], selectedTripsForQueue[index]];
       } else if (direction === 1 && index < selectedTripsForQueue.length - 1) { [selectedTripsForQueue[index], selectedTripsForQueue[index + 1]] = [selectedTripsForQueue[index + 1], selectedTripsForQueue[index]];}
       saveQueueToLocalStorage(); updateQueuedTripsDisplay();
   }
   function clearBookingQueue() { 
       selectedTripsForQueue = []; currentTripDetailsForSingleRun = null; 
       saveQueueToLocalStorage(); updateQueuedTripsDisplay(); updateMainButtonState(); 
       console.log("UserScript: Booking queue cleared.");
   }
   function createSettingsModal() { 
       settingsModal = document.createElement('div');
       settingsModal.className = 'slp-modal-overlay';
       settingsModal.innerHTML = `
           <div class="slp-modal-content">
               <button class="slp-modal-close-btn" id="slpModalCloseButton">×</button>
               <h3>Configure Trip Queue</h3>
               <p style="font-size:0.9em; color:#555;">Click 'Configure Trip' button (top-left) to refresh train list if needed after initial page search.</p>
               <label for="trainNameSelect">Select Train:</label>
               <select id="trainNameSelect"></select>
               <label for="seatClassSelect">Select Seat Class:</label>
               <select id="seatClassSelect" disabled></select>
               <label for="seatPriorityInput">Seat Number Priority (optional, comma-separated, e.g., 10,15,20):</label>
               <input type="text" id="seatPriorityInput" placeholder="e.g., 10,15,20,21">
               <button id="addTripToQueueButton" disabled>Add Selected Trip to Queue</button>
               <div id="queuedTripsDiv" style="margin-top: 15px; padding:10px; border:1px solid #eee; border-radius:4px; max-height:150px; overflow-y:auto;">Booking Queue: Empty</div>
               <button id="clearQueueButton" style="background-color:#dc3545; margin-top:10px;">Clear Booking Queue</button>
               <button id="doneConfiguringButton" style="background-color:#28a745; margin-top:10px;">Done Configuring & Use Queue</button>
           </div>
       `;
       document.body.appendChild(settingsModal);
       trainNameSelect = document.getElementById('trainNameSelect');
       seatClassSelect = document.getElementById('seatClassSelect');
       seatPriorityInput = document.getElementById('seatPriorityInput'); 
       queuedTripsDiv = document.getElementById('queuedTripsDiv');
       document.getElementById('slpModalCloseButton').addEventListener('click', closeSettingsModal);
       settingsModal.addEventListener('click', function(e) { if (e.target === settingsModal) closeSettingsModal(); });
       trainNameSelect.addEventListener('change', handleTrainSelection);
       seatClassSelect.addEventListener('change', handleSeatClassSelection);
       document.getElementById('addTripToQueueButton').addEventListener('click', addSelectedTripToQueue);
       document.getElementById('clearQueueButton').addEventListener('click', clearBookingQueue);
       document.getElementById('doneConfiguringButton').addEventListener('click', closeSettingsModal);
   }

   // --- Queue Processing Logic ---
   async function processTripQueue() { 
       if (!isReservationLoopActive) { console.log("UserScript: Main loop not active, halting queue processing."); updateMainButtonState(); return; }
       currentQueueIndex++; 
       if (currentQueueIndex < selectedTripsForQueue.length) {
           const tripToProcess = selectedTripsForQueue[currentQueueIndex]; 
           if (tripToProcess.status === 'completed_success' || tripToProcess.status === 'failed_permanently' || tripToProcess.status === 'completed_partial_no_more_seats') {
               console.log(`UserScript: Skipping already processed/finalized trip in queue: ${tripToProcess.train_number}`);
               processTripQueue(); return;
           }
           tripToProcess.isActiveInLoop = true; 
           tripToProcess.status = 'queued'; 
           tripToProcess.date_of_journey = SEARCH_DATE_OF_JOURNEY; 
           if(tripToProcess.status !== 'target_met_reservation' && tripToProcess.status !== 'otp_pending' && tripToProcess.status !== 'otp_verified' && tripToProcess.status !== 'confirming_booking') {
               // Only reset these if not in the middle of OTP/confirmation for this trip
               // tripToProcess.totalReservedForThisTrip = 0; // This is reset before fetch
               // tripToProcess.reservedTicketIdsForThisTrip = []; // This is reset before fetch
               tripToProcess.currentOtpForThisTrip = null;
           }
           if(tripToProcess.timeoutId) clearTimeout(tripToProcess.timeoutId);
           
           displayMessageInPreview(`<h3>Processing Queue Item ${currentQueueIndex + 1}/${selectedTripsForQueue.length}: ${tripToProcess.train_number}</h3>`, false, tripToProcess.processId, tripToProcess.train_number); 
           updateMainButtonState(); 
           fetchAndDisplaySeatLayout(tripToProcess); 
       } else {
           currentQueueIndex = -1; 
           const activeTripsInQueue = selectedTripsForQueue.filter(t => t.status !== 'completed_success' && t.status !== 'failed_permanently' && t.status !== 'halted' && t.status !== 'completed_partial_no_more_seats');
           if (isReservationLoopActive && activeTripsInQueue.length > 0) {
               displayMessageInPreview(`<h3>Queue Round Complete</h3><p class="slp-info">Completed a round. ${activeTripsInQueue.length} trip(s) still pending/active. Retrying queue in ${RETRY_DELAY_MS / 1000}s...</p><div class="slp-loader"></div>`);
               loopTimeoutId = setTimeout(processTripQueue, RETRY_DELAY_MS); 
           } else {
               console.log("UserScript: Finished processing all trips in the queue or loop stopped.");
               displayMessageInPreview(`<h3>Queue Processing Complete</h3><p class="slp-success">All ${selectedTripsForQueue.length} queued trips have been processed or loop stopped.</p>`, true);
               isReservationLoopActive = false;
               currentTripDetailsForSingleRun = null; 
               updateMainButtonState();
           }
       }
   }

   function checkAllTripsCompletion() { 
       if (!isReservationLoopActive && currentTripDetailsForSingleRun) { 
           currentTripDetailsForSingleRun.isActiveInLoop = false;
           updateMainButtonState();
           return;
       }
       if (!isReservationLoopActive && selectedTripsForQueue.length === 0) { 
            updateMainButtonState();
            return;
       }
       let currentTrip = null;
       if (selectedTripsForQueue.length > 0 && currentQueueIndex >=0 && currentQueueIndex < selectedTripsForQueue.length) {
           currentTrip = selectedTripsForQueue[currentQueueIndex];
       } else if (currentTripDetailsForSingleRun && currentTripDetailsForSingleRun.isActiveInLoop) {
           currentTrip = currentTripDetailsForSingleRun;
       }
       if (currentTrip) {
           const currentTripIsDoneForThisAttempt = 
               currentTrip.status === 'target_met_reservation' || 
               currentTrip.status === 'completed_success' || 
               currentTrip.status === 'failed_permanently' || 
               currentTrip.status === 'halted' ||
               currentTrip.status === 'failed_no_seats_this_round' ||
               currentTrip.status === 'failed_reservations_this_round' ||
               currentTrip.status === 'failed_fetch_this_round' ||
               currentTrip.status === 'completed_partial_no_more_seats'; 
           
           if (currentTripIsDoneForThisAttempt || !currentTrip.isActiveInLoop) {
               currentTrip.isActiveInLoop = false; 
               if (isReservationLoopActive) { 
                   if (currentTripDetailsForSingleRun && currentTripDetailsForSingleRun.processId === currentTrip.processId) {
                       isReservationLoopActive = false; console.log("UserScript: Single default trip processing finished or failed."); updateMainButtonState(); return;
                   }
                   processTripQueue(); 
               } else { updateMainButtonState(); }
               return; 
           }
       }
       const allQueueItemsTrulyDone = selectedTripsForQueue.every(trip => trip.status === 'completed_success' || trip.status === 'failed_permanently' || trip.status === 'halted' || trip.status === 'completed_partial_no_more_seats');
       if (allQueueItemsTrulyDone && selectedTripsForQueue.length > 0 && currentQueueIndex >= selectedTripsForQueue.length -1) { 
           console.log("UserScript: All queued trips have reached a final state.");
           displayMessageInPreview(`<h3>All Queued Trips Processed</h3>`, true);
           isReservationLoopActive = false;
       }
       updateMainButtonState();
   }


   function initializeUI() { 
       if (document.getElementById('mainLoopControlButton')) return;
       applyStyles();
       mainButton = document.createElement('button');
       mainButton.id = 'mainLoopControlButton';
       mainButton.addEventListener('click', async function() { 
           if (isReservationLoopActive) { 
               isReservationLoopActive = false;
               if (loopTimeoutId) clearTimeout(loopTimeoutId);
               selectedTripsForQueue.forEach(trip => { 
                   if (trip.timeoutId) clearTimeout(trip.timeoutId);
                   trip.isActiveInLoop = false; 
               });
               if(currentTripDetailsForSingleRun && currentTripDetailsForSingleRun.timeoutId) clearTimeout(currentTripDetailsForSingleRun.timeoutId);
               if(currentTripDetailsForSingleRun) currentTripDetailsForSingleRun.isActiveInLoop = false;
               displayMessageInPreview(`<h3>Booking Process Halted</h3><p class="slp-info">Loop stopped by user.</p>`, true);
           } else { 
               let hasAnyHeldSeats = getHeldSeats().length > 0;

               if (hasAnyHeldSeats) {
                   displayMessageInPreview(`<h3>Releasing Previous Seats</h3><p class="slp-info">Attempting to release previously held seats before starting new loop...</p><div class="slp-loader"></div>`);
                   await releaseAllScriptHeldSeats(true); 
               } else {
                   startNewBookingProcessActual(); 
               }
           }
           updateMainButtonState(); 
       });
       document.body.appendChild(mainButton);

       settingsButton = document.createElement('button');
       settingsButton.id = 'settingsButton';
       settingsButton.textContent = 'Configure Trip Queue';
       settingsButton.disabled = true; 
       settingsButton.addEventListener('click', openSettingsModal);
       document.body.appendChild(settingsButton);

       otpModeButton = document.createElement('button');
       otpModeButton.id = 'otpModeButton';
       otpModeButton.textContent = `OTP Mode: ${manualOtpConfirmation ? 'Manual Confirm' : 'Auto-Submit'}`;
       otpModeButton.disabled = true; 
       otpModeButton.addEventListener('click', function() {
           manualOtpConfirmation = !manualOtpConfirmation;
           this.textContent = `OTP Mode: ${manualOtpConfirmation ? 'Manual Confirm' : 'Auto-Submit'}`;
           localStorage.setItem('shohoz_manualOtpConfirm', manualOtpConfirmation); 
           console.log("UserScript: OTP Confirmation Mode set to:", manualOtpConfirmation ? "Manual" : "Auto");
           displayMessageInPreview(`<p class="slp-info">OTP submission mode changed to: <strong>${manualOtpConfirmation ? 'Manual Confirm' : 'Auto-Submit'}</strong>.</p>`, true);
       });
       document.body.appendChild(otpModeButton);

       releaseSeatsButton = document.createElement('button');
       releaseSeatsButton.id = 'releaseAllHeldSeatsButton';
       releaseSeatsButton.textContent = 'Release All Held Seats';
       releaseSeatsButton.disabled = true; 
       releaseSeatsButton.style.backgroundColor = '#fd7e14'; 
       releaseSeatsButton.style.left = '610px'; 
       releaseSeatsButton.addEventListener('click', () => releaseAllScriptHeldSeats(false)); 
       document.body.appendChild(releaseSeatsButton);

       // Event delegation for release seat buttons and "Try More Seats"
       document.body.addEventListener('click', function(e) {
           if (e.target) {
               if (e.target.classList.contains('release-seat-btn')) {
                   e.preventDefault();
                   e.stopPropagation();
                   
                   const button = e.target;
                   const ticketId = button.dataset.ticketId;
                   const seatNum = button.dataset.seatNumber;
                   const tripProcId = button.dataset.tripProcessId;

                   console.log(`UserScript: Delegated click - Release Seat: ${seatNum}, Ticket ID: ${ticketId}, Trip Process ID: ${tripProcId}`);

                   let tripObjectToReleaseFrom = null;
                   if (selectedTripsForQueue.length > 0) {
                       tripObjectToReleaseFrom = selectedTripsForQueue.find(trip => trip.processId === tripProcId);
                   } 
                   if (!tripObjectToReleaseFrom && currentTripDetailsForSingleRun && currentTripDetailsForSingleRun.processId === tripProcId) {
                       tripObjectToReleaseFrom = currentTripDetailsForSingleRun;
                   }

                   if (tripObjectToReleaseFrom) {
                       console.log("UserScript: Delegated - Found trip object for release:", tripObjectToReleaseFrom.train_number);
                       releaseSingleSeat(tripObjectToReleaseFrom, ticketId, seatNum);
                   } else {
                       console.error("UserScript: Delegated - Could not find trip object for release button. Trip Process ID:", tripProcId);
                       const heldSeatInfo = getHeldSeats().find(hs => hs.ticket_id === parseInt(ticketId) && hs.trip_process_id === tripProcId);
                       if (heldSeatInfo) {
                            console.warn("UserScript: Releasing seat based on heldSeats localStorage data as trip object not in active memory.");
                            const tempTripObject = {
                                train_number: heldSeatInfo.train_number || "Unknown Train",
                                trip_route_id: heldSeatInfo.trip_route_id,
                                processId: heldSeatInfo.trip_process_id,
                                date_of_journey: heldSeatInfo.date_of_journey, 
                                reservedTicketIdsForThisTrip: [heldSeatInfo], 
                                totalReservedForThisTrip: 1 
                            };
                            releaseSingleSeat(tempTripObject, ticketId, seatNum);
                       } else {
                            alert("Error: Could not find trip data to release this seat. Check console.");
                       }
                   }
               } else if (e.target.classList.contains('try-more-seats-btn')) {
                   e.preventDefault();
                   e.stopPropagation();
                   if (isReservationLoopActive) {
                       alert("Please stop the main booking loop before trying for more seats on a specific trip.");
                       return;
                   }
                   const tripProcId = e.target.dataset.tripProcessId;
                   console.log(`UserScript: Clicked 'Try More Seats' for Trip Process ID: ${tripProcId}`);
                   let tripToRetry = selectedTripsForQueue.find(t => t.processId === tripProcId);
                   if (!tripToRetry && currentTripDetailsForSingleRun && currentTripDetailsForSingleRun.processId === tripProcId) {
                       tripToRetry = currentTripDetailsForSingleRun;
                   }

                   if (tripToRetry) {
                       console.log("UserScript: Found trip to retry:", tripToRetry.train_number);
                       isReservationLoopActive = true; 
                       currentQueueIndex = selectedTripsForQueue.indexOf(tripToRetry); 
                       if (currentQueueIndex === -1 && currentTripDetailsForSingleRun && currentTripDetailsForSingleRun.processId === tripToRetry.processId) {
                          selectedTripsForQueue = [currentTripDetailsForSingleRun]; 
                          currentQueueIndex = 0;
                       }
                       
                       tripToRetry.isActiveInLoop = true;
                       tripToRetry.status = 'queued'; 
                       if(tripToRetry.timeoutId) clearTimeout(tripToRetry.timeoutId);
                       
                       displayMessageInPreview(`<h3>Retrying for ${tripToRetry.train_number}</h3><p class="slp-info">Attempting to find more seats...</p>`, false, tripToRetry.processId, tripToRetry.train_number);
                       updateMainButtonState();
                       fetchAndDisplaySeatLayout(tripToRetry);
                   } else {
                       console.error("UserScript: Could not find trip object for 'Try More Seats' button. Trip Process ID:", tripProcId);
                   }
               }
           }
       });


       updateMainButtonState(); 
   }
   
   function startNewBookingProcessActual() {
       isReservationLoopActive = true;
       currentOtp = null; 
       if (selectedTripsForQueue.length > 0) {
           currentQueueIndex = -1; 
           displayMessageInPreview(`<h3>Queue Processing Started</h3><p class="slp-info">Starting to process ${selectedTripsForQueue.length} queued trip(s) sequentially...</p>`);
           selectedTripsForQueue.forEach(trip => {
               trip.status = 'queued'; 
               trip.totalReservedForThisTrip = 0; 
               trip.reservedTicketIdsForThisTrip = [];
               trip.currentOtpForThisTrip = null; 
               trip.isActiveInLoop = false; 
               if(trip.timeoutId) clearTimeout(trip.timeoutId);
           });
           processTripQueue();
       } else if (currentTripDetailsForSingleRun) { 
           console.log("UserScript: Starting loop with pre-configured single trip:", currentTripDetailsForSingleRun);
           currentTripDetailsForSingleRun.isActiveInLoop = true;
           currentTripDetailsForSingleRun.totalReservedForThisTrip = 0;
           currentTripDetailsForSingleRun.reservedTicketIdsForThisTrip = [];
           currentTripDetailsForSingleRun.currentOtpForThisTrip = null;
           if(!currentTripDetailsForSingleRun.processId) currentTripDetailsForSingleRun.processId = `single_trip_${Date.now()}`;
           selectedTripsForQueue = [currentTripDetailsForSingleRun]; 
           currentQueueIndex = -1; 
           displayMessageInPreview(`<h3>Processing Single Configured Trip</h3>`);
           processTripQueue();
       } else { 
           currentTripDetailsForSingleRun = null; 
           searchForTrips(true); 
       }
       updateMainButtonState(); 
   }


   loadQueueFromLocalStorage(); 
   const storedOtpMode = localStorage.getItem('shohoz_manualOtpConfirm');
   if (storedOtpMode !== null) {
       manualOtpConfirmation = (storedOtpMode === 'true');
   }

   if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeUI);
   else initializeUI();

   console.log(`Shohoz Seat Layout User Script (Corrected Date Parsing v2) active...`);
})();