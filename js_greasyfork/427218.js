// ==UserScript==
// @name         ClanLeftAttempts
// @namespace https://greasyfork.org/ru/scripts/427218-clanleftattempts
// @version      0.10
// @description  ololo
// @author       achepta
// @connect achepta.com
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/clan_info.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/427218/ClanLeftAttempts.user.js
// @updateURL https://update.greasyfork.org/scripts/427218/ClanLeftAttempts.meta.js
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


    let MAX_WIN_BATTLES = 84

    let tokens = {
        "1519" : "M8IBh9HaiK",
        "928" : "mxQniSmHIA",
        "104" : "qOK2wMlkRX",
        "1209" : "KwxIVlA4ZU",
    }

    let clan_id = window.location.href.match(/\d{1,5}/)[0]
    let clanAttempts = {};
    if (clan_id in tokens) {
        getClanAttempts();
    }


    function getClanAttempts() {
        var ret = GM_xmlhttpRequest({
            method: "GET",
            url: `https://achepta.com/attempts/${tokens[clan_id]}.json`,
            ignoreCache: true,
            redirectionLimit: 0, // this is equivalent to 'failOnRedirect: true'
            onload: function(res) {
                clanAttempts = JSON.parse(res.responseText);
                setAttempts()
                setSortButton()
                setFilterButton()
            },
            onerror: function(res) {
                GM_log("Error!");
            }
        });
    }

    function setAttempts() {
        let tbody = Array.from(document.getElementsByTagName("table")).slice(-1)[0].querySelector("tbody");
        if (!tbody) {
            tbody = document.querySelector("#android_container > table:nth-child(2) > tbody")
        }
        let heroesTrs = tbody.childNodes;
        let nodeList = [];
        for (let i = 0; i < heroesTrs.length; i++) {
            let hero_id = heroesTrs[i].getElementsByTagName('a')[0].href.match(/\d{1,10}/)[0];
            let hero_data = clanAttempts.hasOwnProperty(hero_id)?clanAttempts[hero_id]:[];
            heroesTrs[i].insertAdjacentHTML("beforeend", `<td class="wbwhite">${
                hero_data == 0
                    ? ""
                    : `<div class="hero-attempts">
                        <div>
                            <p><b>${hero_data[6]}</b> </p>
                        </div>
                        <div>
                            <p style="color: green">${hero_data[7]}</p>
                        </div>
                       </div>`
            }</td>`);
            nodeList.push(heroesTrs[i])
        }
        tbody.innerHTML = "";
        for (let i = 0; i < nodeList.length; i++) {
            tbody.insertAdjacentHTML('beforeend', nodeList[i].outerHTML)
        }
        tbody.insertAdjacentHTML("afterend", `<style>
            .hero-attempts {
            display: flex; flex-direction: row; justify-content: center
            }
            .hero-attempts p{
             margin: 0;
            }
            </style>`)
    }

    function setSortButton() {
        document.body.insertAdjacentHTML("beforeend", `
            <button id="sort_by_score" style="position: fixed; bottom: 20px">sort by score</button>
        `)
        $(`sort_by_score`).addEventListener("click", () => {
            let tbody = Array.from(document.getElementsByTagName("table")).slice(-1)[0].querySelector("tbody");
            if (!tbody) {
                tbody = document.querySelector("#android_container > table:nth-child(2) > tbody")
            }
            let heroesTrs = tbody.childNodes;
            let nodeList = [];
            for (let i = 0; i < heroesTrs.length; i++) {
                nodeList.push(heroesTrs[i])
            }
            nodeList = nodeList.sort((a, b) =>
                (a.lastChild.previousElementSibling.textContent.replaceAll(",", "")-0 < b.lastChild.previousElementSibling.textContent.replaceAll(",", "")-0 ) ? 1 : -1);
            tbody.innerHTML = "";
            for (let i = 0; i < nodeList.length; i++) {
                tbody.insertAdjacentHTML('beforeend', nodeList[i].outerHTML)
            }
        })
    }

    function setFilterButton() {
        document.body.insertAdjacentHTML("beforeend", `
            <button id="filter_finished" style="position: fixed; bottom: 60px">remove finished</button>
        `)
        $(`filter_finished`).addEventListener("click", () => {
            let tbody = Array.from(document.getElementsByTagName("table")).slice(-1)[0].querySelector("tbody");
            if (!tbody) {
                tbody = document.querySelector("#android_container > table:nth-child(2) > tbody")
            }
            let heroesTrs = tbody.childNodes;
            let nodeList = [];
            for (let i = 0; i < heroesTrs.length; i++) {
                nodeList.push(heroesTrs[i])
            }
            nodeList = nodeList.filter((elem) =>
                elem.lastChild.textContent.split(" ")[1]-0 !== MAX_WIN_BATTLES && elem.lastChild.textContent.split(" ")[0]-0 !== 0);
            tbody.innerHTML = "";
            for (let i = 0; i < nodeList.length; i++) {
                tbody.insertAdjacentHTML('beforeend', nodeList[i].outerHTML)
            }
            setShowBlueLeft()
        })

    }

    function setShowBlueLeft() {
        document.body.insertAdjacentHTML("beforeend", `
            <button id="blue_left" style="position: fixed; bottom: 100px">blue attempts</button>
        `)
        $(`blue_left`).addEventListener("click", () => {
            let tbody = Array.from(document.getElementsByTagName("table")).slice(-1)[0].querySelector("tbody");
            if (!tbody) {
                tbody = document.querySelector("#android_container > table:nth-child(2) > tbody")
            }
            let heroesTrs = tbody.childNodes;
            let nodeList = [];
            for (let i = 0; i < heroesTrs.length; i++) {
                nodeList.push(heroesTrs[i])
            }
            nodeList = nodeList.filter((elem) =>
                elem.lastChild.previousElementSibling.innerHTML.includes("blue"));
            let blueLeft = 0
            nodeList.forEach(elem => {
                blueLeft += Math.min(MAX_WIN_BATTLES-(elem.lastChild.textContent.split(" ")[1]-0), elem.lastChild.textContent.split(" ")[0]-0)
            })
            alert(`Blue wins left: ${blueLeft}`)
        })
    }

    function $(id, where = document) {
        return where.querySelector(`#${id}`);
    }
})(window);