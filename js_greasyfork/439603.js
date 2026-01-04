// ==UserScript==
// @name         Auto Brilliant Move (Click B)
// @namespace    http://tampermonkey.net/
// @version      1.0 Beta
// @description  Makes your moves brilliant! Broken? DC: 9674#9674
// @author       mrozio13pl
// @match        https://www.chess.com/*
// @icon         https://www.chess.com/bundles/web/favicons/favicon-32x32.c2a8280d.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439603/Auto%20Brilliant%20Move%20%28Click%20B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439603/Auto%20Brilliant%20Move%20%28Click%20B%29.meta.js
// ==/UserScript==

window.addEventListener('keydown', brilliant);
function brilliant(event) {
    if (event.key == 'b') {
        makeItBrilliant();
    }
}

function makeItBrilliant() {
    const movesAnalysis = [
        '.analysis-mistake',
        '.analysis-bestMove',
        '.analysis-missedWin',
        '.analysis-blunder',
        '.analysis-greatFind',
        '.analysis-excellent',
        '.analysis-good',
        '.analysis-miss',
        '.analysis-inaccuracy',
        '.analysis-book'
    ]

    document.querySelectorAll('chess-board .highlight').forEach(highlight => {
        highlight.style = 'background-color: rgb(27, 172, 166); opacity: .5'
    })
    
    document.querySelector('chess-board .effect').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="" width="100%" height="100%" viewBox="0 0 18 19"> <g id="Brilliant"> <path class="icon-shadow" opacity="0.3" d="M9,.5a9,9,0,1,0,9,9A9,9,0,0,0,9,.5Z"></path> <path class="icon-background" fill="#1bada6" d="M9,0a9,9,0,1,0,9,9A9,9,0,0,0,9,0Z"></path> <g class="icon-component-shadow" opacity="0.2"> <path d="M12.57,14.6a.51.51,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0h-2l-.13,0L10,14.84A.41.41,0,0,1,10,14.6V12.7a.32.32,0,0,1,.09-.23.39.39,0,0,1,.1-.08l.13,0h2a.31.31,0,0,1,.24.1.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13Zm-.12-3.93a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H10.35a.31.31,0,0,1-.34-.31L9.86,3.9A.36.36,0,0,1,10,3.66a.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0H12.3a.32.32,0,0,1,.25.1.36.36,0,0,1,.09.24Z"></path> <path d="M8.07,14.6a.51.51,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0h-2l-.13,0-.11-.08a.41.41,0,0,1-.08-.24V12.7a.27.27,0,0,1,0-.13.36.36,0,0,1,.07-.1.39.39,0,0,1,.1-.08l.13,0h2a.31.31,0,0,1,.24.1.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13ZM8,10.67a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H5.85a.31.31,0,0,1-.34-.31L5.36,3.9a.36.36,0,0,1,.09-.24.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0H7.8a.35.35,0,0,1,.25.1.36.36,0,0,1,.09.24Z"></path> </g> <g> <path class="icon-component" fill="#fff" d="M12.57,14.1a.51.51,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0h-2l-.13,0L10,14.34A.41.41,0,0,1,10,14.1V12.2A.32.32,0,0,1,10,12a.39.39,0,0,1,.1-.08l.13,0h2a.31.31,0,0,1,.24.1.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13Zm-.12-3.93a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H10.35a.31.31,0,0,1-.34-.31L9.86,3.4A.36.36,0,0,1,10,3.16a.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0H12.3a.32.32,0,0,1,.25.1.36.36,0,0,1,.09.24Z"></path> <path class="icon-component" fill="#fff" d="M8.07,14.1a.51.51,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0h-2l-.13,0-.11-.08a.41.41,0,0,1-.08-.24V12.2a.27.27,0,0,1,0-.13.36.36,0,0,1,.07-.1.39.39,0,0,1,.1-.08l.13,0h2A.31.31,0,0,1,8,12a.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13ZM8,10.17a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H5.85a.31.31,0,0,1-.34-.31L5.36,3.4a.36.36,0,0,1,.09-.24.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0H7.8a.35.35,0,0,1,.25.1.36.36,0,0,1,.09.24Z"></path> </g> </g> </svg>`;
    
    document.querySelectorAll('.arrows *').forEach(arrow => arrow.style = 'visibility: hidden');
    
    document.querySelectorAll('.analysis-feedback-row-icon, .move-list-node-selected .move-list-node-icon, #board-layout-sidebar > div > div > div.sidebar-tab-content-component.sidebar-view-content > div > div > div.review-move-list > section.review-view-section.review-view-movelist > div > div.move-list-content > div > div > div.coach-content > div.coach-comment-component.move-feedback-box-component > div.move-feedback-box-content > div.move-feedback-box-icon').forEach(el => el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="" width="26" height="26" viewBox="0 0 18 19"> <g id="Brilliant"> <path class="icon-shadow" opacity="0.3" d="M9,.5a9,9,0,1,0,9,9A9,9,0,0,0,9,.5Z"></path> <path class="icon-background" fill="#1bada6" d="M9,0a9,9,0,1,0,9,9A9,9,0,0,0,9,0Z"></path> <g class="icon-component-shadow" opacity="0.2"> <path d="M12.57,14.6a.51.51,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0h-2l-.13,0L10,14.84A.41.41,0,0,1,10,14.6V12.7a.32.32,0,0,1,.09-.23.39.39,0,0,1,.1-.08l.13,0h2a.31.31,0,0,1,.24.1.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13Zm-.12-3.93a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H10.35a.31.31,0,0,1-.34-.31L9.86,3.9A.36.36,0,0,1,10,3.66a.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0H12.3a.32.32,0,0,1,.25.1.36.36,0,0,1,.09.24Z"></path> <path d="M8.07,14.6a.51.51,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0h-2l-.13,0-.11-.08a.41.41,0,0,1-.08-.24V12.7a.27.27,0,0,1,0-.13.36.36,0,0,1,.07-.1.39.39,0,0,1,.1-.08l.13,0h2a.31.31,0,0,1,.24.1.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13ZM8,10.67a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H5.85a.31.31,0,0,1-.34-.31L5.36,3.9a.36.36,0,0,1,.09-.24.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0H7.8a.35.35,0,0,1,.25.1.36.36,0,0,1,.09.24Z"></path> </g> <g> <path class="icon-component" fill="#fff" d="M12.57,14.1a.51.51,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0h-2l-.13,0L10,14.34A.41.41,0,0,1,10,14.1V12.2A.32.32,0,0,1,10,12a.39.39,0,0,1,.1-.08l.13,0h2a.31.31,0,0,1,.24.1.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13Zm-.12-3.93a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H10.35a.31.31,0,0,1-.34-.31L9.86,3.4A.36.36,0,0,1,10,3.16a.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0H12.3a.32.32,0,0,1,.25.1.36.36,0,0,1,.09.24Z"></path> <path class="icon-component" fill="#fff" d="M8.07,14.1a.51.51,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0h-2l-.13,0-.11-.08a.41.41,0,0,1-.08-.24V12.2a.27.27,0,0,1,0-.13.36.36,0,0,1,.07-.1.39.39,0,0,1,.1-.08l.13,0h2A.31.31,0,0,1,8,12a.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13ZM8,10.17a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H5.85a.31.31,0,0,1-.34-.31L5.36,3.4a.36.36,0,0,1,.09-.24.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0H7.8a.35.35,0,0,1,.25.1.36.36,0,0,1,.09.24Z"></path> </g> </g> </svg>`);
    
    if(document.querySelector('[data-cy="analysis-tab-button-review"]').classList.contains('sidebar-tabs-active')) // review
    {
        if (document.querySelector('#board-layout-sidebar > div > div > div.sidebar-tab-content-component.sidebar-view-content > div > div > div.review-move-list > section.review-view-section.review-view-movelist > div > div.move-list-content > div > div > div.coach-content > div.coach-comment-component.move-feedback-box-component > div.move-feedback-box-content > div.move-feedback-box-move > div')) {
            document.querySelector('#board-layout-sidebar > div > div > div.sidebar-tab-content-component.sidebar-view-content > div > div > div.review-move-list > section.review-view-section.review-view-movelist > div > div.move-list-content > div > div > div.coach-content > div.coach-comment-component.move-feedback-box-component > div.move-feedback-box-content > div.move-feedback-box-move > div').textContent = 'is brilliant'
        };

        document.querySelectorAll('g.highcharts-series-group > g > path.highcharts-point.highcharts-point-select, svg > g.highcharts-series-group > g.highcharts-series-background.highcharts-tracker > rect.highcharts-point.highcharts-point-select').forEach(el => {
            movesAnalysis.forEach(move => {
                el.classList.remove(move.split('.')[1] + '-bg');
            });
            el.classList.add('analysis-brilliant-bg');
        })
    }
    else if(document.querySelector('[data-cy="analysis-tab-button-analysis"]').classList.contains('sidebar-tabs-active')) // analysis
    {
        if (document.querySelectorAll('.analysis-feedback-row-component').length > 1) document.querySelectorAll('.analysis-feedback-row-component')[1].style = 'display:none';
        document.querySelectorAll('.analysis-feedback-row-description')[0].innerText = 'is brilliant';
        if(document.querySelector('.customColor.selected'))
        {
            document.querySelector('.customColor.selected .move-text').textContent = document.querySelector('.customColor.selected .move-text').textContent.replace(/[^a-zA-Z0-9]/g, "") + "!!";
            document.querySelector('.customColor.selected').style = '--nodeCustomColor:#e6912c;';
        }
    }
    
    const elements = document.querySelectorAll(
        '.analysis-feedback-row-colored' + movesAnalysis.join(', .analysis-feedback-row-colored') +
        ', .move-list-row-open ' + movesAnalysis.join(', .move-list-row-open ') +
        ', .move-list-node-selected .move-list-node-text ' + movesAnalysis.join(', .move-list-node-selected .move-list-node-text ') +
        ', .move-feedback-box-move .move-feedback-box-san' + movesAnalysis.join(', .move-feedback-box-move .move-feedback-box-san') +
        ', #board-layout-sidebar > div > div > div.sidebar-tab-content-component.sidebar-view-content > div > div > div.review-move-list > section.review-view-section.review-view-movelist > div > div.move-list-content > div > div > div.coach-content > div.coach-comment-component.move-feedback-box-component > div.move-feedback-box-content > div.move-feedback-box-move > div' + movesAnalysis.join(', #board-layout-sidebar > div > div > div.sidebar-tab-content-component.sidebar-view-content > div > div > div.review-move-list > section.review-view-section.review-view-movelist > div > div.move-list-content > div > div > div.coach-content > div.coach-comment-component.move-feedback-box-component > div.move-feedback-box-content > div.move-feedback-box-move > div')
        );
    elements.forEach(element => {
        movesAnalysis.forEach(move => {
            element.classList.remove(move.split('.')[1]);
        })
        element.classList.add('analysis-brilliant');
    });
}