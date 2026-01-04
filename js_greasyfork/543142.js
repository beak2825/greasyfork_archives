// ==UserScript==
// @name         WME Cambridge Closure Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically removes closures from provider "Cambridge" with reason containing "One Lane" or "Low - N/A"
// @author       htristan
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543142/WME%20Cambridge%20Closure%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/543142/WME%20Cambridge%20Closure%20Cleaner.meta.js
// ==/UserScript==

(function() {
 'use strict';

 const GLOBAL_KEYWORDS = ['One Lane', 'Low - N/A'];
 const PROVIDER_FILTER = 'Cambridge';

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
         $('<a>', { 'data-toggle': 'tab', href: '#sidepanel-closure-detector' }).append($('<span>').text('CambridgeCD'))
     );

     const $panel = $('<div>', { class: 'tab-pane', id: 'sidepanel-closure-detector' }).append(
         $('<div>', { class: 'side-panel-section' }).append(
             $('<p>').text(`This tool will find any closures that are not already marked as finished, from the provider "${PROVIDER_FILTER}" and matching any of these keywords: ${GLOBAL_KEYWORDS.map(k => `"${k}"`).join(", ")}.`),
             $('<button>', { id: 'detectClosures', text: 'Detect Closures' }),
             $('<button>', { id: 'deleteClosures', text: 'Delete Matching Closures' })
         )
     );

     $('#user-tabs > .nav-tabs').append($tab);
     $('#user-info > .flex-parent > .tab-content').append($panel);

     $('#detectClosures').on('click', function() {
         detectClosures();
     });
     $('#deleteClosures').on('click', function() {
         deleteClosuresWithKeyword();
     });

     $('#sidepanel-closure-detector').on('click', '.segment-link', function(e) {
         e.preventDefault();
         const segmentID = $(this).data('segment-id');
         const segment = W.model.segments.getObjectById(segmentID);
         if (segment) {
             const geometry = segment.geometry;
             const center = geometry.getCentroid();
             W.map.setCenter(new OpenLayers.LonLat(center.x, center.y));
             W.selectionManager.setSelectedModels([segment]);
         }
     });
 }

 function getStreetNameFromSegmentID(segmentID) {
     let streetName = "Unknown";
     const segment = W.model.segments.getObjectById(segmentID);
     if (segment && segment.attributes.primaryStreetID) {
         const street = W.model.streets.getObjectById(segment.attributes.primaryStreetID);
         if (street) streetName = street.attributes.name;
     }
     return streetName;
 }

 function getMatchingClosures(bounds) {
     const closures = W.model.roadClosures.getObjectArray().filter(closure => {
         const segment = W.model.segments.getObjectById(closure.attributes.segID);
         if (!segment || (bounds && !bounds.intersectsBounds(segment.geometry.getBounds()))) return false;

         const reason = closure.attributes.reason?.toLowerCase() || '';
         const provider = closure.attributes.provider;
         const status = closure.attributes.closureStatus;
         return GLOBAL_KEYWORDS.some(kw => reason.includes(kw.toLowerCase())) &&
                !status.toLowerCase().includes('finished') &&
                provider === PROVIDER_FILTER;
     });

     return closures;
 }

 function detectClosures() {
     console.log(`Detecting closures with keywords: ${GLOBAL_KEYWORDS.join(", ")}...`);
     const bounds = W.map.getExtent();
     const closures = getMatchingClosures(bounds);

     $('#sidepanel-closure-detector .closure-list').remove();
     const $closureList = $('<div>', { class: 'closure-list' });

     let count = 0;

     closures.forEach(closure => {
         const reason = closure.attributes.reason?.toLowerCase() || '';
         const provider = closure.attributes.provider;
         const status = closure.attributes.closureStatus;
         if (!GLOBAL_KEYWORDS.some(kw => reason.includes(kw.toLowerCase())) ||
             status.toLowerCase().includes('finished') ||
             provider !== PROVIDER_FILTER) return;

         count++;
         const roadName = getStreetNameFromSegmentID(closure.attributes.segID);
         const existingItem = $closureList.find(`.closure-item[data-segment-id="${closure.attributes.segID}"][data-reason="${closure.attributes.reason}"]`);
         if (!W.model.segments.objects.hasOwnProperty(closure.attributes.segID)) return;

         if (existingItem.length) {
             const countEl = existingItem.find('.closure-count');
             const currentCount = parseInt(countEl.data('count')) + 1;
             countEl.data('count', currentCount);
             countEl.text(`${currentCount} closure events with same description on same segment`);
         } else {
             const closureInfo = `
                 <div class="closure-item" style="border: 1px solid #ccc; padding: 8px; margin-bottom: 8px;" data-segment-id="${closure.attributes.segID}" data-reason="${closure.attributes.reason}">
                     <a href="#" class="segment-link" data-segment-id="${closure.attributes.segID}">
                         <p style="font-weight: bold; margin-bottom: 2px;">${roadName}</p>
                         <div style="font-size: 0.9em; line-height: 1.2;">
                             <p style="margin: 0"><strong>ID:</strong> ${closure.attributes.segID}</p>
                             <p style="margin: 0"><strong>Reason:</strong> ${closure.attributes.reason}</p>
                             <p style="margin: 0" class="closure-count" data-count="1">1 closure event on same segment</p>
                         </div>
                     </a>
                 </div>
             `;
             $closureList.append(closureInfo);
         }
     });

     $closureList.prepend(`<div style="padding: 10px; margin-bottom: 10px; font-weight: bold;">Total closures detected: ${count}</div>`);
     $('#sidepanel-closure-detector').append($closureList);
     console.log('Closure detection completed.');
 }

 function deleteClosuresWithKeyword() {
     console.log(`Deleting closures with keywords: ${GLOBAL_KEYWORDS.join(", ")}...`);
     let closuresToDelete = getMatchingClosures();
     if (!closuresToDelete.length) {
         $('#sidepanel-closure-detector').append(`
             <div class="closure-message" style="padding: 10px; margin-top: 10px; font-weight: bold; color: green;">
                 0 closures deleted
             </div>
         `);
         return;
     }

     const cab = require("Waze/Modules/Closures/Models/ClosureActionBuilder");
     const sc = require("Waze/Modules/Closures/Models/SharedClosure");

     const segmentIDs = [...new Set(closuresToDelete.map(closure => closure.attributes.segID))];
     const segments = segmentIDs.map(id => {
         if (W.model.segments.objects.hasOwnProperty(id)) {
             return W.model.segments.get(id);
         } else {
             closuresToDelete = closuresToDelete.filter(closure => closure.attributes.segID !== id);
         }
     }).filter(Boolean);

     const t = {
         actions: [cab.delete(W.model, new sc({
             segments: segments,
             closures: closuresToDelete,
             reverseSegments: {}
         }, {
             dataModel: W.model,
             segmentSelection: W.selectionManager.getSegmentSelection(),
             isNew: true
         }))]
     };

     W.controller.save(t).then(() => {
         console.log("Closures deleted successfully!");
         $('#sidepanel-closure-detector .closure-list, .closure-message').remove();
         $('#sidepanel-closure-detector').append(`
             <div class="closure-message" style="padding: 10px; margin-top: 10px; font-weight: bold; color: green;">
                 ${closuresToDelete.length} closures deleted
             </div>
         `);
     }).catch(error => {
         console.error("Error deleting closures:", error);
     });
 }

 function bootstrap() {
     if (typeof W !== 'undefined' && W.userscripts?.state.isReady) {
         onWmeReady();
     } else {
         setTimeout(bootstrap, 250);
     }
 }

 bootstrap();
})();