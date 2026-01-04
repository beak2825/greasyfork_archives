// ==UserScript==
// @name                bilibili直播获取有效观看时长
// @namespace           https://greasyfork.org/zh-CN/users/435703-y-jun
// @description         bilibili直播获取有效观看时长和直播有效率
// @version             1.0.1
// @author              Y_jun
// @match               *://link.bilibili.com/p/center/index*
// @require             https://code.jquery.com/jquery-3.7.1.min.js
// @run-at              document-end
// @icon                https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant               none
// @license             GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/519335/bilibili%E7%9B%B4%E6%92%AD%E8%8E%B7%E5%8F%96%E6%9C%89%E6%95%88%E8%A7%82%E7%9C%8B%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/519335/bilibili%E7%9B%B4%E6%92%AD%E8%8E%B7%E5%8F%96%E6%9C%89%E6%95%88%E8%A7%82%E7%9C%8B%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

/*
This project is licensed under **GNU AFFERO GENERAL PUBLIC LICENSE Version 3**
*/

(function () {
    'use strict';

    const RECORD_LIST_API_PREFIX = 'https://api.live.bilibili.com/xlive/app-blink/v1/index/getSessionRecordList';

    $(function () {

        console.log('bilibili-live-effective-rate loaded');

        const handleResponse = async function handleResponse(url, response) {
            if (url.startsWith(RECORD_LIST_API_PREFIX)) {
                const body = response instanceof Response ? await response.clone().text() : response.toString();
                try {
                    const json = JSON.parse(body);
                    if (json.code === 0) {
                        let items = json.data?.date_info?.date_item_info;
                        if (items && items.length > 0) {
                            setTimeout(addAction, 100, items);
                        }
                    }
                } catch (ex) {
                    console.error(ex);
                }
            }
        }

        const $fetch = window.fetch;

        window.fetch = async function fetchHacker() {
            const response = await $fetch(...arguments);
            if (response.status === 200 && response.headers.get('content-type')?.includes('application/json')) {
                await handleResponse(response.url, response);
            }
            return response;
        };

        /**
         * @this XMLHttpRequest
         */
        const onReadyStateChange = function onReadyStateChange() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200 && this.getAllResponseHeaders().split("\n").find((v) => v.toLowerCase().includes('content-type: application/json'))) {
                handleResponse(this.responseURL, this.response);
            }
        };

        const jsonpHacker = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName.toLowerCase() !== 'script' || node.src.trim() === '') {
                        return;
                    }
                    const u = new URL(node.src);
                    if (u.searchParams.has('callback')) {
                        const callbackName = u.searchParams.get('callback');
                        const callback = window[callbackName];
                        window[callbackName] = function (data) {
                            handleResponse(u.href, JSON.stringify(data));
                            callback(data);
                        };
                    }
                });
            });
        });

        document.addEventListener('DOMContentLoaded', () => {
            jsonpHacker.observe(document.head, {
                childList: true,
            });
        });

        window.XMLHttpRequest = class XMLHttpRequestHacker extends window.XMLHttpRequest {
            constructor() {
                super();
                this.addEventListener('readystatechange', onReadyStateChange.bind(this));
            }
        };

        function getStartTime(timeDom) {
            let timeRow = timeDom.text();
            let startTimeRow = timeRow.replace(/～.*/, "");
            if (startTimeRow.indexOf('今日') > -1) {
                var currentDate = new Date();
                var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                var day = currentDate.getDate().toString().padStart(2, '0');
                startTimeRow = startTimeRow.replace(/今日/, month + "-" + day);
            }
            return startTimeRow;
        }

        function colorRate(effectiveRate) {
            if (effectiveRate.indexOf('-') > -1) {
                return 'gray'
            }
            if (effectiveRate < 50) {
                return 'darkgreen';
            }
            if (effectiveRate < 100) {
                return 'green';
            }
            if (effectiveRate < 150) {
                return 'darkgoldenrod';
            }
            if (effectiveRate < 200) {
                return 'orange';
            }
            return 'red';
        };

        function addAction(items) {
            let sessionDataTable = $('.session-data-table');


            if (sessionDataTable.length == 0) {
                return;
            }

            if (sessionDataTable.attr('effectiveRateFlag')) {
                return;
            }

            let effectiveTimeHead = '<td data-v-bc058b76 class="effective-time-head" style="width: 8em">有效观看时长</td>';
            let effectiveRateHead = '<td data-v-bc058b76 class="effective-rate-head" style="width: 10em">有效率</td>';

            let sessionDataTableThead = sessionDataTable.find('thead');

            let sessionDataTableTheadTrList = sessionDataTableThead.find('tr');
            sessionDataTableTheadTrList.each(function (i) {
                let tr = $(this);
                let tdList = tr.find('td');

                let sessionDataTableTheadFansDom = $(tdList[5]);

                sessionDataTableTheadFansDom.after(effectiveRateHead);
                sessionDataTableTheadFansDom.after(effectiveTimeHead);

            });


            let sessionDataTableTbody = sessionDataTable.find('tbody');
            let sessionDataTableTbodyTrList = sessionDataTableTbody.find('tr');

            sessionDataTableTbodyTrList.each(function (i) {
                let tr = $(this);
                let tdList = tr.find('td');

                let startTime = getStartTime($(tdList[0]));

                let jsonData;
                for (const item of items) {
                    if (item.start_time.indexOf(startTime) > -1) {
                        jsonData = item;
                        break;
                    }
                }
                if (!jsonData) return;

                let fansDom = $(tdList[5]);

                let duration = jsonData.live_time;
                let effectiveTime = jsonData.effective_viewing_time;

                let effectiveTimeStr = effectiveTime + '秒';
                let effectiveTimeTitle = effectiveTimeStr.indexOf('-') > -1 ? '-' : (effectiveTime / 3600).toFixed(2) + '小时';

                let effectiveRate = (effectiveTime / duration * 100).toFixed(2);
                let effectiveRatePercent = effectiveRate.indexOf('-') > -1 ? '-' : effectiveRate + ' %';

                let color = colorRate(effectiveRate);

                let effectiveTimeTd = `<td data-v-bc058b76 class="effective-time" style="width: 10em;" title="${effectiveTimeTitle}">${effectiveTimeStr}</td>`;
                let effectiveRateTd = `<td data-v-bc058b76 class="effective-rate" style="width: 10em; color: ${color}">${effectiveRatePercent}</td>`;

                fansDom.after(effectiveRateTd);
                fansDom.after(effectiveTimeTd);
            });

            sessionDataTable.attr('effectiveRateFlag', 1);
        }
    });
})();

/*
This project is licensed under **GNU AFFERO GENERAL PUBLIC LICENSE Version 3**
*/