// ==UserScript==
// @name         NicoAd Ticket Info
// @version      1.0.2
// @description  ニコニ広告のチケット選択画面に有効期限を表示します。
// @author       蝙蝠の目
// @match        https://nicoad.nicovideo.jp/*/publish/*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @connect      api.koken.nicovideo.jp
// @namespace https://greasyfork.org/ja/users/808813
// @downloadURL https://update.greasyfork.org/scripts/431436/NicoAd%20Ticket%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/431436/NicoAd%20Ticket%20Info.meta.js
// ==/UserScript==

(async () => {
    "use strict";

    function fetchText(url, { method } = {}) {
        method = method || "GET";

        const requestApi = GM_xmlhttpRequest || (GM && GM.xmlHttpRequest);
        if (!requestApi) {
            throw new Error("ユーザースクリプトAPI（GM_xmlhttpRequest または GM.xmlHttpRequest）が見つかりません。");
        }

        return new Promise((resolve, reject) => {
            try {
                requestApi({
                    method,
                    url,
                    onload: (res) => resolve(res.responseText),
                    onerror: reject
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    function processTicketList(element) {
        for (const child of element.children) {
            processTicketListItem(child);
        }
    }

    function processTicketListItem(element) {
        const infoElement = element.querySelector(".info");
        if (!infoElement) return;

        const nameElement = infoElement.querySelector(".ticket-name");
        if (!nameElement) return;
        const ticketName = nameElement.textContent;

        const ticketData = ticketNameMap[ticketName];
        if (!ticketData) return;

        let isFirstElement = true;
        for (const group of ticketData) {
            const elm = document.createElement("span");
            if (isFirstElement) {
                elm.style.marginTop = "0.5rem";
                isFirstElement = false;
            }
            elm.textContent = `${group.text} まで　×`;
            elm.style.display = "flex";
            elm.style.color = group.expiringSoon ? "red" : "black";
            elm.style.fontSize = "1.2rem";

            const elm2 = document.createElement("strong");
            elm2.textContent = group.size;
            elm2.style.paddingLeft = "0.1rem";
            elm.append(elm2);

            infoElement.append(elm);
        }
    }

    function groupBy(list, fn) {
        const res = {};
        for (const item of list) {
            const key = fn(item);
            if (!res.hasOwnProperty(key)) res[key] = [];
            res[key].push(item);
        }
        return res;
    }

    function getDateId(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    }

    function DateIdToString(dateId) {
        const date = new Date(dateId);
        let year = date.getFullYear().toString();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        while (year.length < 4) year = "0" + year;
        while (month.length < 2) month = "0" + month;
        while (day.length < 2) day = "0" + day;
        return year + "." + month + "." + day;
    }

    function getTicketNameMap(tickets, serverTime) {
        const serverDateId = getDateId(new Date(serverTime * 1000));
        const res = {};

        const groupedByName = groupBy(tickets, ticket => ticket.ticketName);
        for (const ticketName in groupedByName) {
            const groupedByDateId = groupBy(
                groupedByName[ticketName],
                (ticket) => getDateId(new Date(ticket.expiredAt * 1000))
            );

            res[ticketName] = [];
            for (const dateIdStr in groupedByDateId) {
                const dateId = Number(dateIdStr);
                res[ticketName].push({
                    dateId,
                    text: DateIdToString(dateId),
                    size: groupedByDateId[dateId].length,
                    expiringSoon: dateId - serverDateId < 1000 * 60 * 60 * 24 * 7,
                });
            }
            res[ticketName].sort((a, b) => a.dateId - b.dateId);
        }

        return res;
    }

    const data = JSON.parse(await fetchText("https://api.koken.nicovideo.jp/v1/tickets")).data;
    const ticketNameMap = getTicketNameMap(data.tickets, data.serverTime);

    const processedTicketLists = new WeakSet();
    window.setInterval(() => {
        for (const element of document.querySelectorAll("ul.wrapper")) {
            if (processedTicketLists.has(element)) continue;
            processedTicketLists.add(element);
            processTicketList(element);
        }
    }, 500);

})().catch(e => {
    console.error(`[NicoAd Ticket Info] ${e instanceof Error ? e.message : e}`);
});
