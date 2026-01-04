// ==UserScript==
// @name         Times Show Fuel
// @namespace    times_show_fuel
// @description  Show Times car share fuel remaining
// @author       stream3715
// @match        https://share.timescar.jp/view/station/stationMap.jsp*
// @version      0.12
// @since        0.1  - 20220101 初版
// @since        0.11 - 20220103 コメント削除
// @since        0.12 - 20220103 root.getElementById(x.id).getElementByXPath("./p/a")がnullのときに処理が続行するバグを修正
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437983/Times%20Show%20Fuel.user.js
// @updateURL https://update.greasyfork.org/scripts/437983/Times%20Show%20Fuel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    HTMLElement.prototype.getElementByXPath = function (path) {
        const result = document.evaluate(path, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return result.snapshotLength > 0 ? result.snapshotItem(0) : null;
    }

    const option = { childList: true };

    async function processStationDetail(root, stationId) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', "https://share.timescar.jp/view/reserve/input.jsp?scd=" + stationId);
        xhr.responseType = "document";
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                Array.from(xhr.response.getElementById("timetableHtmlTag").getElementsByTagName("div")).forEach(x => {
                    const fuelStatus = x.getElementByXPath('./table/tbody/tr[2]/td[2]')
                    if (fuelStatus && root.getElementById(x.id)) {
                        const tableCarName = root.getElementById(x.id).getElementByXPath("./p/a")
                        tableCarName.textContent += "／" + fuelStatus.textContent
                    }
                });
            }
        }
    }

    async function callback(mutationsList, observer) {
        observer.disconnect();
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length > 1) {
                const fuelPromise = Array.from(mutation.addedNodes)
                    .filter(x => x.nodeName === "H4")
                    .map(x => x.innerHTML.match(/(?<=openPop\(').*?(?='\))/)[0])
                    .map(x => processStationDetail(document, x));
                await Promise.all(fuelPromise);
            }
        }
        observer.observe(target, option);
    }

    const target = document.getElementById("timetableHtmlTag");
    if (target) {
        const obs = new MutationObserver(callback);
        obs.observe(target, option);
    }

})();