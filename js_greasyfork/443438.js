// ==UserScript==
// @name         RepairsCounter
// @namespace
// @version      0.3
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/pl_transfers.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @namespace https://greasyfork.org/users/449752
// @downloadURL https://update.greasyfork.org/scripts/443438/RepairsCounter.user.js
// @updateURL https://update.greasyfork.org/scripts/443438/RepairsCounter.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }
    let heroId;
    let startDate = ''
    let endDate = ''
    let smith;
    let pageCount = 0
    let totalPrice = 0;
    let isOutOfRange = false

    let elem = document.querySelector("div.hwm_pagination.global_inside_shadow");

    if (/(pl_transfers)/.test(location.href)) {
        heroId = new URLSearchParams(window.location.search).get("id");
        elem.insertAdjacentHTML('afterend', `
        <div id="count-elements" style="display: flex; flex-direction: column; margin: auto; align-items: center; ">
            <input type="text" id="elements-from" placeholder="type start date">
            <input type="text" id="elements-to" placeholder="type end date">
            <input type="text" id="smith" placeholder="smith %">
            <button id="count-elements-but">Count repairs</button>
            <div id="pages"></div>
            <div id="total"></div>
            <div id="result-elements" style="display: flex; flex-direction: column"></div>
        </div>
        `)
        $('count-elements-but').addEventListener('click', () => {
            $('count-elements-but').setAttribute("disabled", "")
            let startDateTemp = hwmTimeToTimestamp($('elements-from').value)
            let endDateTemp = hwmTimeToTimestamp($('elements-to').value)
            smith = $('smith').value
            console.log(smith)
            if (startDateTemp > endDateTemp) {
                endDate = startDateTemp
                startDate = endDateTemp
            } else {
                endDate = endDateTemp
                startDate = startDateTemp
            }
            startCount()
        })
    }

    function startCount() {
        doGet(`https://${location.host}/pl_transfers.php?id=${heroId}&page=${pageCount}`, doc => {
            pageCount++;
            let dates = findAll(/\d{2}-\d{2}-\d{2} \d{2}:\d{2}/g, doc.body.innerText)
            $('total').innerText = `page №${pageCount}, last date on page is ${dates[dates.length-1]}`
            let boughtElems = findAll( /(\d{2}-\d{2}-\d{2} \d{2}:\d{2}): Передан предмет \'[а-яА-яёЁ -]+( \[.+])?\' \[\d{1,3}\/\d{1,3}] на ремонт для [а-яА-ЯёЁa-zA-Z0-9 _*()-]+\. Оплачено за ремонт: (\d{1,6}) \((\d{1,3})%\), доп\. комиссия: (\d{1,4})/g, doc.body.innerText)

            processElems(boughtElems)
        })
    }

    function processElems(elems) {
        elems.forEach(elem => {
            if (isInTimerange(elem[1]) && (smith === "" ? true : smith === elem[4])) {
                totalPrice += (elem[3]-0) + (elem[5]-0)
                $('pages').innerText = `total = ${totalPrice}`
                console.log(elem)
            }
        })
        if (!isOutOfRange) {
            startCount()
        } else {
            $(`result-elements`).insertAdjacentHTML('afterbegin', `<span>finished</span>`)
        }
    }

    function isInTimerange(hwmTime) {
        let currentTime = hwmTimeToTimestamp(hwmTime)
        if (currentTime <= endDate && currentTime >= startDate) {
            return true
        }
        if (currentTime < startDate) {
            isOutOfRange = true
        }
        return false
    }

    function hwmTimeToTimestamp(hwmTime) {
        let params = findAll(/\d{2}/g, hwmTime).map(param => param[0]-0)
        return Math.round(new Date(2000+params[2], params[1]-1, params[0], params[3], params[4]).getTime()/1000)
    }

    function $(id, where = document) {
        return where.querySelector(`#${id}`);
    }

    function doGet(url, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            overrideMimeType: "text/xml; charset=windows-1251",
            onload: function (res) {
                callback(new DOMParser().parseFromString(res.responseText, "text/html"))
            }
        });
    }

    function findAll(regexPattern, sourceString) {
        let output = []
        let match
        let regexPatternWithGlobal = RegExp(regexPattern, [...new Set("g" + regexPattern.flags)].join(""))
        while (match = regexPatternWithGlobal.exec(sourceString)) {
            delete match.input
            output.push(match)
        }
        return output
    }
})(window);