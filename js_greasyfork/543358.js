// ==UserScript==
// @name         Mapinfo button 2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  display map information
// @author       n'wah
// @match        https://gpop.io/*
// @icon         https://www.google.com/s2/favicons?domain=gpop.io
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT Apache BSD GPL LGPL MPL EPL
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/543358/Mapinfo%20button%202.user.js
// @updateURL https://update.greasyfork.org/scripts/543358/Mapinfo%20button%202.meta.js
// ==/UserScript==

(function() {
    'use strict';
        // Select the element to hide
    var elementToHide = document.querySelector('div.playpage-a12-block-c');

    // Check if exists
    if (elementToHide) {
        elementToHide.remove();
    }

    // Configuration
    const PANEL_ID = 'mapInfoPanel';
    const SAVE_POSITION = true; // False - disable position saving

    // Custom styles
    GM_addStyle(`
        #${PANEL_ID} {
            position: fixed;
            top: 20px;
            left: 20px;
            background: #1a1a1aee;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            min-width: 260px;
            backdrop-filter: blur(4px);
            border: 1px solid #ffffff22;
            display: none;
        }

        .panel-header {
            padding: 10px;
            background: #2a2a2a;
            border-radius: 8px 8px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ffffff1a;
        }

        .panel-title {
            color: #fff;
            font-weight: bold;
            font-size: 14px;
            user-select: none;
        }

        .panel-close {
            background: none;
            border: none;
            color: #ffffff99;
            cursor: pointer;
            padding: 2px 8px;
            font-size: 18px;
            transition: color 0.2s;
            border-radius: 3px;
        }

        .panel-close:hover {
            color: #fff;
            background: #ffffff22;
        }

        .panel-content {
            padding: 12px;
        }

        .map-info-btn {
            width: 100%;
            padding: 8px;
            background: #2a2a2a;
            border: 1px solid #ffffff1a;
            color: #fff;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 10px;
        }

        .map-info-btn:hover {
            background: #3a3a3a;
            transform: translateY(-1px);
        }

        .map-info-results {
            background: #2a2a2a;
            padding: 12px;
            border-radius: 5px;
            border: 1px solid #ffffff1a;
        }

        .map-info-item {
            color: #ffffffdd;
            font-size: 16px;
            margin: 6px 0;
            line-height: 1.4;
        }

        .map-info-highlight {
            color: #71ffbd;
            font-weight: bold;
        }
    `);

    // Floating panel
    const createPanel = () => {
        const panelHTML = `
            <div id="${PANEL_ID}">
                <div class="panel-header">
                    <span class="panel-title">🎮 Map Analyzer</span>
                    <button class="panel-close" title="Close">×</button>
                </div>
                <div class="panel-content">
                    <button class="map-info-btn">🔄 Generate Map Info</button>
                    <div class="map-info-results"></div>
                </div>
            </div>
        `;

        $('body').append(panelHTML);
        return $(`#${PANEL_ID}`);
    };

    // Draggo
    const makeDraggable = (panel) => {
        let isDragging = false;
        let startX = 0, startY = 0;
        let savedX = SAVE_POSITION ? GM_getValue('panelX', 20) : 20;
        let savedY = SAVE_POSITION ? GM_getValue('panelY', 20) : 20;

        panel.css({ top: `${savedY}px`, left: `${savedX}px` });

        panel.find('.panel-header').on('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX - panel.offset().left;
            startY = e.clientY - panel.offset().top;
            panel.addClass('dragging');
            return false;
        });

        $(document).on('mousemove', function(e) {
            if (!isDragging) return;
            const newX = e.clientX - startX;
            const newY = e.clientY - startY;

            panel.css({
                left: `${newX}px`,
                top: `${newY}px`
            });

            if (SAVE_POSITION) {
                GM_setValue('panelX', newX);
                GM_setValue('panelY', newY);
            }
        });

        $(document).on('mouseup', () => {
            isDragging = false;
            panel.removeClass('dragging');
        });
    };

    // Main
    window.addEventListener('load', () => {
        const panel = createPanel();
        makeDraggable(panel);

        // Panel controls
        panel.find('.panel-close').click(() => panel.hide());
        panel.find('.map-info-btn').click(updateMapInfo);

        // Original button
        $('.createpage-right').append(`
            <button class="gbutton" id="openPanelBtn" style="margin: 10px;">
                🗺️ Show Map Panel
            </button>
        `);

        $('#openPanelBtn').click(() => panel.show());
    });

    // Map info generation
    function genmapinfo(serverData) {
                let gamemode = '4k';
        if (/"j"/.test(serverData)) { gamemode = '6k'; }

        let notedata = (serverData.split("}},")[1]).split("]")[0];
        let notes = notedata.split(',');
        let streak = 0, score = 0;
        let LN = [], N = [];

        if (gamemode == '4k') {
            LN = [1,3,5,7];
            N = [0,2,4,6];
        } else {
            LN = [1,3,5,7,9,11];
            N = [0,2,4,6,8,10];
        }

        let LNamount = 0, Namount = 0;

        for (let i = 0; i < notes.length; i++) {
            let note = notes[i] * 1;
            if (N.includes(note)) {
                let multiplier = Math.min(1.005**streak, 3000);
                score += 10*multiplier;
                streak++;
                Namount++;
            }
            if (LN.includes(note)) {
                let multiplier = Math.min(1.005**streak, 3000);
                let noteLength = notes[i+2] * 1;
                let LNscore = (noteLength*40) * multiplier;
                score += (10*multiplier) + LNscore;
                streak++;
                LNamount++;
            }
        }

        return [Namount, LNamount, streak, score];
    }
    function updateMapInfo() {
        let serverData;
        for (let i = 0; i < 40; i++) {
            if (/window.GAMEMODE/.test($(`script:eq(${i})`).text())) {
                serverData = $(`script:eq(${i})`).text();
                break;
            }
        }

        if (serverData) {
            const [Namount, LNamount, streak, score] = genmapinfo(serverData);
            const resultsHTML = `
                <div class="map-info-item">
                    🎵 Total Notes: <span class="map-info-highlight">${Namount + LNamount}</span>
                </div>
                <div class="map-info-item">
                    ⚪ Regular: <span class="map-info-highlight">${Namount}</span>
                </div>
                <div class="map-info-item">
                    🔵 Long Notes: <span class="map-info-highlight">${LNamount}</span>
                </div>
                <div class="map-info-item">
                    💯 Max Score: <span class="map-info-highlight">${score.toFixed(2)}</span>
                </div>
            `;

            $(`#${PANEL_ID} .map-info-results`).html(resultsHTML);
        }
    }
})();