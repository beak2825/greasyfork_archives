// ==UserScript==
// @name         WME Toronto Closure Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically removes closures matching specified keywords and filters
// @author       htristan
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523505/WME%20Toronto%20Closure%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/523505/WME%20Toronto%20Closure%20Cleaner.meta.js
// ==/UserScript==

(function() {
 'use strict';

 const GLOBAL_KEYWORD = 'Toronto-TMC';

 console.log('WME Closure Detection script is starting.');

 function onWmeReady() {
     console.log('WME Closure Detection is ready!');

     if (typeof WazeWrap !== 'undefined') {
         console.log('WazeWrap is loaded.');
         initUserPanel();
     } else {
         console.error('WazeWrap is not loaded.');
     }
 }

 function initUserPanel() {
     const $tab = $('<li>', { title: 'Closure Detector' }).append(
         $('<a>', { 'data-toggle': 'tab', href: '#sidepanel-closure-detector' }).append($('<span>').text('TorontoCD'))
     );

     const $panel = $('<div>', { class: 'tab-pane', id: 'sidepanel-closure-detector' }).append(
         $('<div>', { class: 'side-panel-section' }).append(
             $('<p>').text(`This tool will find any closures that are not already marked as finished, from the provider "City of Toronto" and matching the keyword "${GLOBAL_KEYWORD}".`),
             $('<button>', { id: 'detectClosures', text: 'Detect Closures' }),
             $('<button>', { id: 'deleteClosures', text: 'Delete Matching Closures' })
         )
     );

     $('#user-tabs > .nav-tabs').append($tab);
     $('#user-info > .flex-parent > .tab-content').append($panel);

     $('#detectClosures').on('click', function() {
         detectClosures(GLOBAL_KEYWORD);
     });
     $('#deleteClosures').on('click', function() {
         deleteClosuresWithKeyword(GLOBAL_KEYWORD);
     });

     // Add the event listener for segment links
     $('#sidepanel-closure-detector').on('click', '.segment-link', function(e) {
         e.preventDefault();
         const segmentID = $(this).data('segment-id');
         const segment = W.model.segments.getObjectById(segmentID);
         if (segment) {
             const geometry = segment.geometry;
             const center = geometry.getCentroid();

             // Directly use center.x and center.y with setCenter
             W.map.setCenter(new OpenLayers.LonLat(center.x, center.y));

             W.selectionManager.setSelectedModels([segment]);
         }
     });
 }

 function getStreetNameFromSegmentID(segmentID) {
     let streetName = "Unknown";

     const segment = W.model.segments.getObjectById(segmentID);
     if (segment) {
         if (segment.attributes.primaryStreetID) {
             const street = W.model.streets.getObjectById(segment.attributes.primaryStreetID);
             if (street) {
                 streetName = street.attributes.name;
             } else {
                 console.warn(`Street with ID ${segment.attributes.primaryStreetID} not found.`);
             }
         } else {
             console.warn(`Segment with ID ${segmentID} has no primary street.`);
         }
     } else {
         console.warn(`Segment with ID ${segmentID} not found.`);
     }

     return streetName;
 }

 function getMatchingClosures(keyword, bounds) {
     const closures = W.model.roadClosures.getObjectArray().filter(closure => {
         const segment = W.model.segments.getObjectById(closure.attributes.segID);
         if (segment) {
             // Check if the segment's geometry is within the bounds
             if (bounds && !bounds.intersectsBounds(segment.geometry.getBounds())) {
                 return false;
             }
             const reason = closure.attributes.reason?.toLowerCase() || '';
             const provider = closure.attributes.provider;
             const status = closure.attributes.closureStatus;
             const searchKeyword = keyword.toLowerCase();
             return reason.includes(searchKeyword) &&
                    !status.toLowerCase().includes('finished') &&
                    provider === "City of Toronto";
         }
         return false;
     });

     return closures;
 }

 function detectClosures(keyword) {
     console.log(`Detecting closures with keyword: ${keyword}...`);

     // Get the bounds of the current map view
     const bounds = W.map.getExtent();

     // Use the new function to get matching closures
     const closures = getMatchingClosures(keyword, bounds);

     // Clear previous results
     $('#sidepanel-closure-detector .closure-list').remove();

     const $closureList = $('<div>', { class: 'closure-list' });

     let matchingClosuresCount = 0;

     closures.forEach(closure => {
         const reason = closure.attributes.reason?.toLowerCase() || '';
         const provider = closure.attributes.provider;
         const status = closure.attributes.closureStatus;

         // Filter closures by keyword and provider
         const searchKeyword = keyword.toLowerCase();
         if (reason.includes(searchKeyword) &&
             !status.toLowerCase().includes('finished') &&
             provider === "City of Toronto") {
             console.log(status);

             matchingClosuresCount++;

             // Fetch the road name using the segment ID
             const roadName = getStreetNameFromSegmentID(closure.attributes.segID);

             // Check if we already have an entry for this segment/reason combo
             const existingItem = $closureList.find(`.closure-item[data-segment-id="${closure.attributes.segID}"][data-reason="${closure.attributes.reason}"]`);
             // Skip if segment not found in model
             if (!W.model.segments.objects.hasOwnProperty(closure.attributes.segID)) {
                 console.warn(`Segment with ID ${closure.attributes.segID} not found in the model.`);
                 return;
             }

             if (existingItem.length) {
                 // Update count on existing item
                 const countEl = existingItem.find('.closure-count');
                 const currentCount = parseInt(countEl.data('count')) + 1;
                 countEl.data('count', currentCount);
                 countEl.text(`${currentCount} closure events with same description on same segment`);
             } else {
                 // Create new closure info
                 const closureInfo = `
                     <div class="closure-item" style="border: 1px solid #ccc; padding: 8px; margin-bottom: 8px;" data-segment-id="${closure.attributes.segID}" data-reason="${closure.attributes.reason}"><a href="#" class="segment-link" data-segment-id="${closure.attributes.segID}">
                         <p style="font-weight: bold; margin-bottom: 2px;">${roadName}</p>
                         <div style="font-size: 0.9em; line-height: 1.2;">
                             <p style="margin: 0"><strong>ID:</strong> ${closure.attributes.segID}</p>
                             <p style="margin: 0"><strong>Reason:</strong> ${closure.attributes.reason}</p>
                             <p style="margin: 0" class="closure-count" data-count="1">1 closure event on same segment</p>
                         </div>
                     </div>
                 `;
                 $closureList.append(closureInfo);
             }
         }
     });

     // Add the total count at the top
     $closureList.prepend(`
         <div style="padding: 10px; margin-bottom: 10px; font-weight: bold;">
             Total closures detected: ${matchingClosuresCount}
         </div>
     `);

     $('#sidepanel-closure-detector').append($closureList);

     console.log('Closure detection completed.');
 }

 function deleteClosuresWithKeyword(keyword) {
     console.log(`Deleting closures with keyword: ${keyword}...`);

     // Use the new function to get matching closures
     const closuresToDelete = getMatchingClosures(keyword);

     console.debug(closuresToDelete);
     if (closuresToDelete.length === 0) {
         console.log(`No closures found with keyword: ${keyword}`);
         return;
     }

     const cab = require("Waze/Modules/Closures/Models/ClosureActionBuilder");
     const sc = require("Waze/Modules/Closures/Models/SharedClosure");

     // Get unique segment IDs from the closures to delete
     const segmentIDs = [...new Set(closuresToDelete.map(closure => closure.attributes.segID))];
     const segments = segmentIDs.map(id => {
         if (W.model.segments.objects.hasOwnProperty(id)) {
             return W.model.segments.get(id);
         } else {
             console.warn(`Segment with ID ${id} not found in the model.`);
             // Correctly access segID through closure.attributes.segID
             closuresToDelete = closuresToDelete.filter(closure => closure.attributes.segID !== id);
         }
     }).filter(segment => segment !== undefined);

     console.debug(segments);
     const t = {};
    //  console.log('Would have deleted ' + closuresToDelete.length + ' closures');
    //  return;
     t.actions = [cab.delete(W.model, new sc({
         segments: segments,
         closures: closuresToDelete,
         reverseSegments: {} // You might need to adjust this if needed
     }, {
         dataModel: W.model,
         segmentSelection: W.selectionManager.getSegmentSelection(),
         isNew: true
     }))];

     W.controller.save(t).then(function() {
         console.log("Closures deleted successfully!");

         // Clear previous results
         $('#sidepanel-closure-detector .closure-list').remove();
         $('#sidepanel-closure-detector .closure-message').remove();

         // Display message on the left bar
         $('#sidepanel-closure-detector').append(`
             <div class="closure-message" style="padding: 10px; margin-top: 10px; font-weight: bold; color: green;">
                 ${closuresToDelete.length} closures deleted
             </div>
         `);
         // Optionally refresh the closures layer:
         // One option is to use:
         // W.map.getLayerByName("closures").redraw({force: true});
     }).catch(function(error) {
         console.error("Error deleting closures:", error);
     });
 }

 function bootstrap() {
     console.log('Checking if WME is ready...');
     if (typeof W !== 'undefined' && W.userscripts?.state.isReady) {
         console.log('WME is ready.');
         onWmeReady();
     } else {
         console.log('WME not ready, retrying...');
         setTimeout(bootstrap, 250);
     }
 }

 bootstrap();
})();