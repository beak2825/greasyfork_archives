// ==UserScript==
// @name         ElementsCounter
// @namespace    https://greasyfork.org/ru/scripts/419409-elementscounter
// @version      0.4
// @description  try to take over the world!
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/pl_transfers.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/419409/ElementsCounter.user.js
// @updateURL https://update.greasyfork.org/scripts/419409/ElementsCounter.meta.js
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
    let pageCount = 0
    let totalPrice = 0;
    let isOutOfRange = false
    let selector = "";

    let elementsData = {
        "клык тигра" : [0,0],
        "абразив": [0,0],
        "змеиный яд": [0,0],
        "ледяной кристалл": [0,0],
        "лунный камень": [0,0],
        "огненный кристалл": [0,0],
        "осколок метеорита": [0,0],
        "цветок ведьм": [0,0],
        "цветок ветров": [0,0],
        "цветок папоротника": [0,0],
        "ядовитый гриб": [0,0],
    }

    let elem;
    if (document.querySelectorAll("body > center > table").length>1){
        selector = "body > center > table:nth-child(2) > tbody > tr > td"  //корневой элемент
    } else {
        selector = "body > center > table > tbody > tr > td"  //корневой элемент
    }
    elem = document.querySelector(selector);
    console.log(elem)

    if (/(pl_transfers)/.test(location.href)) {
        heroId = new URLSearchParams(window.location.search).get("id");
        elem.getElementsByTagName('center')[0].insertAdjacentHTML('afterend', `
        <div id="count-elements" style="display: flex; flex-direction: column; margin: auto; align-items: center; ">
            <input type="text" id="elements-from" placeholder="type start date">
            <input type="text" id="elements-to" placeholder="type end date">
            <button id="count-elements-but">Count elements</button>
            <div id="pages"></div>
            <div id="total"></div>
            <div id="result-elements" style="display: flex; flex-direction: column"></div>
        </div>
        `)
        $('count-elements-but').addEventListener('click', () => {
            $('count-elements-but').setAttribute("disabled", "")
            let startDateTemp = hwmTimeToTimestamp($('elements-from').value)
            let endDateTemp = hwmTimeToTimestamp($('elements-to').value)
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
            let boughtElems = findAll( /(\d{2}-\d{2}-\d{2} \d{2}:\d{2}): Куплен "(клык тигра|абразив|змеиный яд|ледяной кристалл|лунный камень|огненный кристалл|осколок метеорита|цветок ведьм|цветок ветров|цветок папоротника|ядовитый гриб)"( \d{1,2} шт.)? за (\d{1,6}) золота/g, doc.body.innerText)

            processElems(boughtElems)
        })
    }

    function processElems(elems) {
        elems.forEach(elem => {
            if (isInTimerange(elem[1])) {
                totalPrice += (elem[4]-0)
                $('pages').innerText = `total = ${totalPrice}`
                elementsData[elem[2]] = [elementsData[elem[2]][0]+(elem[3]? elem[3].match(/\d{1,2}/)[0]-0: 1), elementsData[elem[2]][1]+(elem[4]-0)]
                $(`result-elements`).innerHTML = getResultElemensHTML()
            }
        })
        if (!isOutOfRange) {
            startCount()
        } else {
            $(`result-elements`).insertAdjacentHTML('afterbegin', `<span>finished</span>`)
        }
    }

    function getResultElemensHTML() {
        let result = ``
        for (const [key, value] of Object.entries(elementsData)) {
            result += `<div>Name: ${key}, Amount: ${value[0]}, Price: ${value[1]}</div>`
        }
        return result
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