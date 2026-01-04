// ==UserScript==
// @name         AutoSmith
// @namespace   https://greasyfork.org/ru/scripts/415696-autosmith
// @version      0.3
// @description  try to take over the world!
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(inventory).+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/415696/AutoSmith.user.js
// @updateURL https://update.greasyfork.org/scripts/415696/AutoSmith.meta.js
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
    let smithUrl = "https://www.heroeswm.ru/mod_workbench.php?type=repair"
    let availableArts = []
    let smithQueue = []
    let artsTrSelectorNumber = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td").colSpan === 11 ? 3 : 2;
    let isSmithAvailable = false;
    getArtsToSmith();
    setHandlersToArts();

    doGet(smithUrl, checkIfSmithAvailable)
    // removeArtFromQueue();

    function main() {
        console.log(1)
        if (smithQueue.length > 0) {
            doGet(smithQueue.shift().replace("cancel", "accept"), null)
        }
        console.log(2)
        doGet(smithUrl, checkIfSmithAvailable)
    }
    function getArtsToSmith() {
        document.querySelector(`body > center > table > tbody > tr > td > table > tbody > tr:nth-child(${artsTrSelectorNumber}) > td:nth-child(1) > table > tbody`).childNodes.forEach(node => {
            if (node.textContent.match(/(Ремонтировать|Кузница)/)) {
                availableArts.push(node)
            }
        })
    }
    function setHandlersToArts() {
        availableArts.forEach( (art, index) => {
            let doSmith = document.createElement('a');
            doSmith.text = "add to queue"
            doSmith.href = "javascript:void(0);"
            doSmith.id = "smith" + index

            let smh = document.createElement('p');
            smh.text = "    "

            doSmith.addEventListener("click", function () {
                addArtToQueue(art, doSmith.id);
            });
            art.querySelector("td").appendChild(smh)
            art.querySelector("td").appendChild(doSmith)
        })

    }
    function addArtToQueue(art, id) {
        let tradeUrl = art.querySelector("td > a").href
        smithQueue.push(tradeUrl)
        document.getElementById(id).textContent = `In queue (${smithQueue.length})`;
    }
    function checkIfSmithAvailable(docc) {
        let totalTimeLeftInMillis = 0;
        if (!docc.querySelector("body > center > table > tbody > tr > td > table.wbwhite > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > center > b")) {
            isSmithAvailable = true;
        }
        else {
            let timeMatches = docc.querySelector("body > center > table > tbody > tr > td > table.wbwhite > tbody > tr:nth-child(2) > td")
                .textContent
                .match(/В ремонте: еще (\d{1,2} ч\. )?(\d{1,2} мин.)/)
            if (timeMatches[1]) {
                totalTimeLeftInMillis += (timeMatches[1].match(/\d{1,2}/)-0)*3600*1000
            }
            if (timeMatches[2]) {
                totalTimeLeftInMillis += (timeMatches[2].match(/\d{1,2}/)-0+1)*60*1000
            }
        }
        setTimeout(main, totalTimeLeftInMillis)
    }

    function doGet(url, callback) {
        console.log(url);
        let http = new XMLHttpRequest();
        http.open("GET", url, true); // false for synchronous request
        http.overrideMimeType("text/xml; charset=windows-1251");
        http.onreadystatechange = function () {//Call a function when the state changes
            if (http.readyState === 4 && http.status === 200) {
                if (callback != null) {
                    return callback(new DOMParser().parseFromString(http.responseText, "text/html"));
                }
            }
        };
        http.send(null);

    }

})(window);