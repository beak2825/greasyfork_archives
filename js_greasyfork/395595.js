// ==UserScript==
// @name         Wanikani: Locked Count
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adds a locked count to the SRS breakdown on the dashboard
// @author       Kumirei
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @include      *preview.wanikani.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395595/Wanikani%3A%20Locked%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/395595/Wanikani%3A%20Locked%20Count.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

;(function () {
    var wkof = window.wkof
    // Make sure WKOF is installed
    if (!wkof) {
        var response = confirm(
            '"Wanikani: Locked Count" requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.',
        )
        if (response)
            window.location.href =
                'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549'
        return
    } else {
        wkof.include('ItemData')
        wkof.ready('ItemData').then(fetch_items).then(get_counts).then(display_counts)
    }

    function fetch_items() {
        const config = {
            wk_items: {
                options: {
                    assignments: true,
                },
                filters: {
                    srs: '-1, 0',
                },
            },
        }
        return wkof.ItemData.get_items(config)
    }

    function get_counts(items) {
        const srs = wkof.ItemData.get_index(items, 'srs_stage')
        const type = wkof.ItemData.get_index(items, 'item_type')
        const counts = {
            locked: items.length,
            radical: (type.radical || []).length,
            kanji: (type.kanji || []).length,
            vocabulary: (type.vocabulary || []).length,
        }
        return counts
    }

    function display_counts(counts) {
        console.log(counts)
        $('.srs-progress #burned').before(`
            <li id="locked">
                <span>${counts.locked}</span>
                <span class="title">Locked</span>
            <div class="popover srs right in">
                <div class="arrow"></div>
                <div class="popover-inner">
                    <h3 class="popover-title">
                        <div class="srs-logo initiate"></div>
                    </h3>
                    <div class="popover-content">
                        <ul>
                            <li>Radicals
                                <span>${counts.radical}</span>
                            </li>
                            <li>Kanji
                                <span>${counts.kanji}</span>
                            </li>
                            <li>Vocabulary
                                <span>${counts.vocabulary}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
        `)
        $('.srs-progress #locked').hover(
            () => {
                $('.srs-progress #locked .popover').css('display', 'block')
            },
            () => {
                $('.srs-progress #locked .popover').css('display', 'none')
            },
        )
        $('.srs-progress #locked .popover').hover(() => {
            $('.srs-progress #locked .popover').css('display', 'none')
        })
        $('head').append(`<style id="WKLockedCount">
            .srs-progress {font-size: 0px;}
            .srs-progress > ul {display: flex;}
            .srs-progress > ul > li {
                font-size: 14px;
                width: 16.66% !important;
            }
            .srs-progress #apprentice {border-radius: 0;}
            .srs-progress #locked {
                position: relative;
                float: left;
                background-color: #aaa;
                order: -1;
                border-radius: 0 0 0 5px;
            }
            .srs-progress #locked .title {
                font-size: 14px;
                font-weight: normal;
                color: rgba(0,0,0,0.3);
                text-shadow: none;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                padding-bottom: 20px;
                margin-bottom: 2.5px;
            }
            .srs-progress #locked .popover {
                left: 100%;
                top: -46px;
            }
            .srs-progress #locked .popover ul li {
                width: 100%;
                border-radius: 0;
                text-align: left;
                text-shadow: none;
                box-shadow: none;
            }
            .srs-progress #locked .popover ul li span {
                font-size: 14px;
                font-weight: bold;
                text-shadow: none;
            }
        </style>`)
    }
})()
