// ==UserScript==
// @name                bilibili-live-effective-rate
// @name:zh-HK          bilibili-live-effective-rate
// @name:zh-TW          bilibili-live-effective-rate
// @name:en             bilibili-live-effective-rate
// @name:ja             bilibili-live-effective-rate
// @namespace           https://github.com/catscarlet/bilibili-live-effective-rate
// @description         bilibili-live-effective-rate 有效观看时长÷直播时长=直播有效率
// @description:zh-HK   bilibili-live-effective-rate 有效觀看時長÷直播時長=直播有效率
// @description:zh-TW   bilibili-live-effective-rate 有效觀看時長÷直播時長=直播有效率
// @description:en      bilibili-live-effective-rate Effective-watching-time / live-duration = live-effective-rate
// @description:ja      bilibili-live-effective-rate 有効観看時長÷直播時長=直播有効率
// @version             0.4.0
// @author              catscarlet
// @match               *://link.bilibili.com/p/center/index*
// @require             https://code.jquery.com/jquery-latest.js
// @run-at              document-end
// @grant               none
// @license             GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/421252/bilibili-live-effective-rate.user.js
// @updateURL https://update.greasyfork.org/scripts/421252/bilibili-live-effective-rate.meta.js
// ==/UserScript==

/*
This project is licensed under **GNU AFFERO GENERAL PUBLIC LICENSE Version 3**
*/

(function() {
    'use strict';

    $(function() {

        console.log('bilibili-live-effective-rate loaded');

        checkUrl(document.location);

        window.onpopstate = function(event) {
            checkUrl(document.location);
        };

        function checkUrl(url) {
            let urlRe = new RegExp('https://link\.bilibili\.com/p/center/index\\??\\S*#/live-data/session-data');
            let result = urlRe.test(url);
            if (result) {
                findCenterGrid();
                //findLinkPopupCtnr();
            }
        }

        function findCenterGrid() {
            const targetNode = document.getElementsByClassName('main-ctnr p-relative f-right')[0];
            const config = {attributes: false, childList: true, subtree: true};
            const callback = function(mutationsList, observer) {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        addAction();
                    } else if (mutation.type === 'attributes') {
                    }
                }
            };
            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        };

        /*
        function findLinkPopupCtnr() {
            const targetNode = document.getElementsByClassName('link-popup-ctnr')[0];
            const config = {attributes: false, childList: true, subtree: true};
            const callback = function(mutationsList, observer) {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        addActionToPopup();
                    } else if (mutation.type === 'attributes') {
                    }
                }
            };
            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        };
        */

        function colorRate(effectiveRate) {
            let color;
            if (effectiveRate < 50) {
                color = 'darkgreen';
            } else if (effectiveRate < 100) {
                color = 'green';
            } else if (effectiveRate < 150) {
                color = 'darkgoldenrod';
            } else if (effectiveRate < 200) {
                color = 'orange';
            } else {
                color = 'red';
            }

            return color;
        };

        function unitConverter(raw) {
            let duration = raw.slice(-2);
            let durationInMinute = 0;

            if (duration == '小时') {
                durationInMinute = parseFloat(raw.substr(0, raw.length - 2)) * 60;
            } else if (duration == ' 秒') {
                durationInMinute = parseFloat(raw.substr(0, raw.length - 2)) / 60;
            } else {
                durationInMinute = parseFloat(raw.substr(0, raw.length - 2));
            }

            return durationInMinute;
        };

        function addAction() {
            let sessionDataTable = $('.session-data-table');


            if (sessionDataTable.length == 0) {
                return;
            }

            if (sessionDataTable.attr('effectiveRateFlag')) {
                return;
            }

            let effectiveHead = '<td class="effective-rate-head" style="width: 10em">有效率</td>';

            let sessionDataTableThead = sessionDataTable.find('thead');

            let sessionDataTableTheadTrList = sessionDataTableThead.find('tr');
            sessionDataTableTheadTrList.each(function(i) {
                let tr = $(this);
                let tdList = tr.find('td');

                let sessionDataTableTheadAverageTimeDom = $(tdList[6]);

                sessionDataTableTheadAverageTimeDom.after(effectiveHead);

            });


            let sessionDataTableTbody = sessionDataTable.find('tbody');
            let sessionDataTableTbodyTrList = sessionDataTableTbody.find('tr');

            sessionDataTableTbodyTrList.each(function(i) {
                let tr = $(this);
                let tdList = tr.find('td');

                let durationDom = $(tdList[2]);
                let averageTimeDom = $(tdList[6]);

                let durationRaw = durationDom.text();
                let averageTimeRaw = averageTimeDom.text();

                let duration = unitConverter(durationRaw);
                let averageTime = unitConverter(averageTimeRaw);

                let effectiveRate = (averageTime / duration * 100).toFixed(2);
                let effectiveRatePercent = effectiveRate + ' %';

                let color = colorRate(effectiveRate);

                let effectiveRateTd = '<td data-v-045de783="" class="effective-rate" style="width: 10em; color: ' + color + '">' + effectiveRatePercent + '</td>';

                averageTimeDom.after(effectiveRateTd);
            });

            sessionDataTable.attr('effectiveRateFlag', 1);
        }

        /*
        function addActionToPopup() {
            let linkPopupPanel = $('.link-popup-panel');
            linkPopupPanel.css('width', 'max-content');

            if (linkPopupPanel.length == 0) {
                console.log('no linkPopupPanel. Return');
                return;
            }

            if (linkPopupPanel.attr('effectiveRateFlag')) {
                console.log('linkPopupPanel effectiveRateFlag. Return');
                return;
            }

            let linkPopupPanelEffectiveHead = '<span class="effective-rate-head" style="display: inline-block; line-height: 38px; font-size: 12px; text-align: center;">有效率</td>';

            let linkPopupPanelTitle = linkPopupPanel.find('.title');
            linkPopupPanelTitle.find('.average-time').after(linkPopupPanelEffectiveHead);

            let linkPopupPanelContent = linkPopupPanel.find('.content');
            let linkPopupPanelContentList = linkPopupPanelContent.find('.item');
            linkPopupPanelContentList.each(function(i) {
                let linkPopupPanelContentItem = $(this);

                let durationRaw = linkPopupPanelContentItem.find('.duration').text();
                let averageTimeRaw = linkPopupPanelContentItem.find('.average-time').text();

                let duration = unitConverter(durationRaw);
                let averageTime = unitConverter(averageTimeRaw);

                let effectiveRate = (averageTime / duration * 100).toFixed(2);
                let effectiveRatePercent = effectiveRate + ' %';

                let color = colorRate(effectiveRate);

                let effectiveRateSpan = '<span class="effective-rate-item" style="color: ' + color + '; display: inline-block; line-height: 38px; font-size: 12px; text-align: center;">' + effectiveRatePercent + '</td>';
                linkPopupPanelContentItem.find('.average-time').after(effectiveRateSpan);
            });

            linkPopupPanel.attr('effectiveRateFlag', 1);
        }
        */

    });
})();

/*
This project is licensed under **GNU AFFERO GENERAL PUBLIC LICENSE Version 3**
*/
