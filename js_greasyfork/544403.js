// ==UserScript==
// @name         編集ポイント表示
// @namespace    https://greasyfork.org/en/users/1393710-majorjcms
// @description  I'm trying to teach myself JS
// @author       majorjc_MS
// @match        *://*.waze.com/*editor*
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @exclude      *://*.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @license      GNU GPLv3
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_addStyle
// @connect      www.waze.com
// @connect      greasyfork.org
// @version      2025-07-31-1708
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/544403/%E7%B7%A8%E9%9B%86%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/544403/%E7%B7%A8%E9%9B%86%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==
/* global bootstrap */

(async function main() {
    'use strict';
    const downloadUrl = 'https://update.greasyfork.org/scripts/543127/EditPointDisplay.user.js';
    const sdk = await bootstrap({ scriptUpdateMonitor: { downloadUrl } });
    const TOOLTIP_TEXT = 'Your daily edit count from your profile. Click to open your profile.';
    let $outputElem = null;
    let $outputElemContainer = null;
    let userName;
    let savesWithoutIncrease = 0;
    let lastProfile;
    let isDragging = false;
    let currentX;
    let currentY;
    let xOffset = 0;
    let yOffset = 0;

    function log(message) {
        console.log('Edit Count Monitor:', message);
    }

    // Save position to localStorage
    function savePosition() {
        const position = {
            top: $outputElemContainer.css('top'),
            left: $outputElemContainer.css('left')
        };
        localStorage.setItem('editPointDisplayPosition', JSON.stringify(position));
    }

    // Load position from localStorage
    function loadPosition() {
        const savedPosition = localStorage.getItem('editPointDisplayPosition');
        if (savedPosition) {
            const { top, left } = JSON.parse(savedPosition);
            $outputElemContainer.css({
                top: top,
                left: left
            });
        } else {
            // Default position if none saved
            $outputElemContainer.css({
                top: '100px',
                left: '100px'
            });
        }
    }

    // Drag event handlers
    function dragStart(e) {
        isDragging = true;
        currentX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        currentY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        xOffset = $outputElemContainer.position().left - currentX;
        yOffset = $outputElemContainer.position().top - currentY;
        $outputElemContainer.css('cursor', 'grabbing');
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            $outputElemContainer.css({
                left: (currentX + xOffset) + 'px',
                top: (currentY + yOffset) + 'px'
            });
        }
    }

    function dragEnd() {
        isDragging = false;
        $outputElemContainer.css('cursor', 'grab');
        savePosition();
    }

    function updateEditCount() {
        sdk.DataModel.Users.getUserProfile({ userName }).then(profile => {
            // Add the counter div if it doesn't exist.
            if ($('#wecm-count').length === 0) {
                $outputElemContainer = $('<div>', {
                    class: 'toolbar-button',
                    style: 'font-weight: bold; font-size: 16px; border-radius: 10px; position: absolute; cursor: grab; z-index: 1000;'
                });
                const $innerDiv = $('<div>', {
                    class: 'item-container',
                    style: 'padding-left: 10px; padding-right: 10px; cursor: default;'
                });
                $outputElem = $('<a>', {
                    id: 'wecm-count',
                    href: sdk.DataModel.Users.getUserProfileLink({ userName }),
                    target: '_blank',
                    style: 'text-decoration:none',
                    'data-original-title': TOOLTIP_TEXT
                });
                $innerDiv.append($outputElem);
                $outputElemContainer.append($innerDiv);
                // Append to body for absolute positioning
                $('body').append($outputElemContainer);
                // Load saved position or set default
                loadPosition();
                // Add drag event listeners
                $outputElemContainer.on('mousedown touchstart', dragStart);
                $(document).on('mousemove touchmove', drag);
                $(document).on('mouseup touchend', dragEnd);
                $outputElem.tooltip({
                    placement: 'auto top',
                    delay: { show: 100, hide: 100 },
                    html: true,
                    template: '<div class="tooltip wecm-tooltip" role="tooltip"><div class="tooltip-arrow"></div>'
                        + '<div class="wecm-tooltip-header"><b></b></div>'
                        + '<div class="wecm-tooltip-body tooltip-inner""></div></div>'
                });
            }
            if (!lastProfile) {
                lastProfile = profile;
            } else if (lastProfile.dailyEditCount[lastProfile.dailyEditCount.length - 1] !== profile.dailyEditCount[profile.dailyEditCount.length - 1]
                    || lastProfile.editCountByType.updateRequests !== profile.editCountByType.updateRequests
                    || lastProfile.editCountByType.mapProblems !== profile.editCountByType.mapProblems
                    || lastProfile.editCountByType.placeUpdateRequests !== profile.editCountByType.placeUpdateRequests
                    || lastProfile.editCountByType.segmentHouseNumbers !== profile.editCountByType.segmentHouseNumbers
                    || lastProfile.totalEditCount !== profile.totalEditCount) {
                savesWithoutIncrease = 0;
            } else {
                savesWithoutIncrease++;
            }

            let textColor;
            let bgColor;
            let warningStyleClass;
            if (savesWithoutIncrease < 5) {
                textColor = '#354148';
                bgColor = 'white';
                warningStyleClass = '';
            } else if (savesWithoutIncrease < 10) {
                textColor = '#354148';
                bgColor = 'yellow';
                warningStyleClass = 'yellow';
            } else {
                textColor = 'white';
                bgColor = 'red';
                warningStyleClass = 'red';
            }
            $outputElemContainer.css('background-color', bgColor);

            $outputElem.css('color', textColor).html(profile.dailyEditCount[profile.dailyEditCount.length - 1].toLocaleString());
            const totalEditCountText = `<li>Total&nbsp;edits:&nbsp;${profile.totalEditCount.toLocaleString()}</li>`;
            const urCountText = `<li>URs&nbsp;closed:&nbsp;${profile.editCountByType.updateRequests.toLocaleString()}</li>`;
            const purCountText = `<li>PURs&nbsp;closed:&nbsp;${profile.editCountByType.placeUpdateRequests.toLocaleString()}</li>`;
            const mpCountText = `<li>MPs&nbsp;closed:&nbsp;${profile.editCountByType.mapProblems.toLocaleString()}</li>`;
            const segmentEditCountText = `<li>Segment&nbsp;edits:&nbsp;${profile.editCountByType.segments.toLocaleString()}</li>`;
            const placeEditCountText = `<li>Place&nbsp;edits:&nbsp;${profile.editCountByType.venues.toLocaleString()}</li>`;
            const hnEditCountText = `<li>Segment&nbsp;HN&nbsp;edits:&nbsp;${profile.editCountByType.segmentHouseNumbers.toLocaleString()}</li>`;
            let warningText = '';
            if (savesWithoutIncrease) {
                warningText = `<div class="wecm-warning ${warningStyleClass}">${savesWithoutIncrease} ${
                    (savesWithoutIncrease > 1) ? 'consecutive saves' : 'save'} without an increase. ${
                    (savesWithoutIncrease >= 5) ? '(Are you throttled?)' : ''}</div>`;
            }
            $outputElem.attr('data-original-title', `${
                TOOLTIP_TEXT}<ul>${
                totalEditCountText}${
                urCountText}${
                purCountText}${
                mpCountText}${
                segmentEditCountText}${
                hnEditCountText}${
                placeEditCountText}</ul>${
                warningText}`);
            lastProfile = profile;
        });
    }

    async function init() {
        userName = sdk.State.getUserInfo().userName;

        GM_addStyle(`
            .wecm-tooltip li {text-align: left;}
            .wecm-tooltip .wecm-warning {border-radius:8px; padding:3px; margin-top:8px; margin-bottom:5px;}
            .wecm-tooltip .wecm-warning.yellow {background-color:yellow; color:black;}
            .wecm-tooltip .wecm-warning.red {background-color:red; color:white;}
            .toolbar-button {user-select: none;}
        `);

        sdk.Events.on({ eventName: 'wme-save-finished', eventHandler: onSaveFinished });
        // Update the edit count first time.
        updateEditCount();
        log('Initialized.');
    }

    function onSaveFinished(result) {
        if (result.success) updateEditCount();
    }

    init();
})();
