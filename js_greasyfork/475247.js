// ==UserScript==
// @name         天雪下字幕赚金币助手
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  辅助标记下载过的字幕，赚金币用
// @author       kinami
// @match        https://*.skyey2.com/*
// @match        https://*.skyeysnow.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475247/%E5%A4%A9%E9%9B%AA%E4%B8%8B%E5%AD%97%E5%B9%95%E8%B5%9A%E9%87%91%E5%B8%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/475247/%E5%A4%A9%E9%9B%AA%E4%B8%8B%E5%AD%97%E5%B9%95%E8%B5%9A%E9%87%91%E5%B8%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const params = new URLSearchParams(window.location.search);
    const paramObj = {};
    for (const [key, value] of params.entries()) {
        paramObj[key] = value;
    }

    function saveHistory(history) {
        let objAsAtring = JSON.stringify(history);
        GM_setValue("SkyeySubHistory", objAsAtring);
    }

    function loadHistory() {
        let objAsString = GM_getValue("SkyeySubHistory");
        if (!objAsString) {
            objAsString = "{}";
        }
        const history = JSON.parse(objAsString);
        return history;
    }

    function waitUntil(condition, callback, interval = 300) {
        const intervalId = setInterval(() => {
            if (condition()) {
                clearInterval(intervalId);
                callback();
            }
        }, interval);
    }

    let history = loadHistory();
    console.log("当前下载历史:", history);

    const getSubDownloadLink = (tid) =>
        fetch(`/forum.php?mod=viewthread&tid=${tid}`, {
            method: "GET",
            headers: {
                "Content-Type": "text/html",
            },
            credentials: "same-origin",
        })
            .then((res) => res.text())
            .then((res) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(res, "text/html");
                const downloadLinkElement = Array.from(
                    doc.querySelectorAll("a")
                ).find((a) => a.textContent.trim() === "普通字幕(zip格式)");
                let downloadLink = downloadLinkElement.getAttribute("href");
                return downloadLink;
            });

    function modIsTorrents() {
        function modifyTrElement(tr) {
            let torrentType = tr
                .querySelector("td:nth-child(1) > font > a")
                .text.trim();
            if (torrentType !== "Rip字幕") {
                return;
            }
            let subUrl = tr.querySelector(
                "td:nth-child(2) > table > tbody > tr > td.embedded.torrent_title > a"
            );
            let subId = subUrl.getAttribute("href").match(/tid=(\d+)/)[1];

            // console.log(subUrl, subId);

            if (history[subId]) {
                tr.style.backgroundColor = "rgba(0, 128, 0, 0.2)"; // 已下载
            } else {
                tr.style.backgroundColor = "rgba(255, 255, 0, 0.2)"; // 未下载
            }

            let titleBody = tr.querySelector(".torrentname > tbody");
            let currentButtonWrapper =
                titleBody.querySelector(".buttonWrapper");
            if (currentButtonWrapper) {
                titleBody.removeChild(currentButtonWrapper);
            }

            let buttonWrapper = document.createElement("div");
            buttonWrapper.setAttribute("class", "buttonWrapper");

            let downloadedBtn = document.createElement("button");
            downloadedBtn.innerText = "标记为已下载";
            downloadedBtn.style["margin-right"] = "10px";
            downloadedBtn.addEventListener("click", function () {
                history[subId] = true;
                saveHistory(history);
                tr.style.backgroundColor = "rgba(0, 128, 0, 0.2)";
            });

            let notDownloadedBtn = document.createElement("button");
            notDownloadedBtn.innerText = "标记为未下载";
            notDownloadedBtn.style["margin-right"] = "10px";
            notDownloadedBtn.addEventListener("click", function () {
                delete history[subId];
                saveHistory(history);
                tr.style.backgroundColor = "rgba(255, 255, 0, 0.2)";
            });

            let autoDownloadBtn = document.createElement("button");
            autoDownloadBtn.innerText = "尝试直接获取下载链接";
            autoDownloadBtn.addEventListener("click", function () {
                const targetUrl = `/forum.php?mod=viewthread&tid=${subId}`;
                getSubDownloadLink(subId)
                    .then((downloadLink) => {
                        const a = document.createElement("a");
                        console.log("download:", downloadLink);
                        a.href = downloadLink;
                        a.click();
                        history[subId] = true;
                        saveHistory(history);
                        tr.style.backgroundColor = "rgba(0, 128, 0, 0.2)";
                    })
                    .catch((error) => alert("Something went wrong.\n" + error));
            });

            buttonWrapper.appendChild(downloadedBtn);
            buttonWrapper.appendChild(notDownloadedBtn);
            buttonWrapper.appendChild(autoDownloadBtn);

            titleBody.appendChild(buttonWrapper);
        }

        function main() {
            let trList = document.querySelectorAll(
                "#frame_torrents > table > tbody > tr:not(:first-child)"
            );
            trList.forEach(modifyTrElement);

            let centerElement = document.querySelector(
                "#frame_torrents > p:nth-child(1)"
            );
            if (!centerElement) {
                return;
            }
            centerElement.querySelectorAll("a").forEach((aElement) => {
                // console.log(aElement);
                // console.log(aElement.getAttribute("href"));
                // console.log(aElement.getAttribute("onClick"));
                if (
                    aElement.getAttribute("href") === "javascript:void(0);" &&
                    aElement.getAttribute("onclick") &&
                    aElement
                        .getAttribute("onclick")
                        .startsWith(
                            "javascript:ajax_refreash('/torrents_list_ajax.php"
                        )
                ) {
                    // console.log(aElement);
                    let url = aElement
                        .getAttribute("onclick")
                        .match(/'([^']+)'/)[1];
                    aElement.removeAttribute("onClick");
                    aElement.onclick = () => {
                        ajax_refreash(url);
                        waitForMain();
                    };
                    // console.log(aElement);
                }
            });
        }

        function waitForMain() {
            waitUntil(() => {
                console.log("waiting", paramObj);

                // 获取列表中第一个种子的类型
                const firstListItem = document.querySelector(
                    "#frame_torrents > table > tbody > tr:nth-child(3) > td:nth-child(1) > font > a"
                );
                if (!firstListItem) {
                    return true;
                }

                if (!firstListItem.text.includes("字幕")) {
                    return false;
                }
                let flag = false;
                let aElementList = document
                    .querySelector("#frame_torrents > p:nth-child(1)")
                    .querySelectorAll("a");
                if (aElementList.length > 0) {
                    for (let aElement of aElementList) {
                        if (
                            aElement.getAttribute("href") ===
                                "javascript:void(0);" &&
                            aElement.getAttribute("onclick")
                        ) {
                            flag = true;
                            break;
                        }
                    }
                } else {
                    flag = true;
                }

                return flag;
            }, main);
        }

        let oldChangesub = changesub;
        changesub = (id) => {
            console.log("call changesub");
            oldChangesub(id);
            if (id === 16) {
                waitForMain();
            }
        };

        let subBar = document.getElementById("tcat_16");
        const backgroundValue = subBar.getAttribute("style");

        if (
            backgroundValue === "background: rgb(34, 34, 34)" ||
            backgroundValue === "background:#222"
        ) {
            waitForMain();
        }
    }

    function modIsForumdisplay() {
        function modifyTbodyElement(tbody) {
            let tr = tbody.querySelector("tr");
            // console.log(tr);

            let torrentTypeElement = tr.querySelector("th > em > a");
            if (!torrentTypeElement) {
                return;
            }
            let torrentType = torrentTypeElement.text.trim();
            // console.log(torrentType);
            if (torrentType !== "Rip字幕") {
                return;
            }

            let subUrl = tr.querySelector("th > a:nth-child(4)");
            let subId = subUrl.getAttribute("href").match(/tid=(\d+)/)[1];

            console.log(subUrl, subId);

            if (history[subId]) {
                tbody.style.backgroundColor = "rgba(0, 128, 0, 0.2)"; // 已下载
            } else {
                tbody.style.backgroundColor = "rgba(255, 255, 0, 0.2)"; // 未下载
            }

            let titleBody = tbody.querySelector("tr:nth-child(1) > th");
            let currentButtonWrapper =
                titleBody.querySelector(".buttonWrapper");
            if (currentButtonWrapper) {
                titleBody.removeChild(currentButtonWrapper);
            }

            let buttonWrapper = document.createElement("div");
            buttonWrapper.style["text-align"] = "center";
            buttonWrapper.setAttribute("class", "buttonWrapper");

            let downloadedBtn = document.createElement("button");
            downloadedBtn.innerText = "标记为已下载";
            downloadedBtn.style["margin-right"] = "10px";
            downloadedBtn.addEventListener("click", function (event) {
                event.preventDefault();
                history[subId] = true;
                saveHistory(history);
                tbody.style.backgroundColor = "rgba(0, 128, 0, 0.2)";
            });

            let notDownloadedBtn = document.createElement("button");
            notDownloadedBtn.innerText = "标记为未下载";
            notDownloadedBtn.style["margin-right"] = "10px";
            notDownloadedBtn.addEventListener("click", function (event) {
                event.preventDefault();
                delete history[subId];
                saveHistory(history);
                tbody.style.backgroundColor = "rgba(255, 255, 0, 0.2)";
            });

            let autoDownloadBtn = document.createElement("button");
            autoDownloadBtn.innerText = "尝试直接获取下载链接";
            autoDownloadBtn.addEventListener("click", function (event) {
                event.preventDefault();
                const targetUrl = `/forum.php?mod=viewthread&tid=${subId}`;
                getSubDownloadLink(subId)
                    .then((downloadLink) => {
                        const a = document.createElement("a");
                        console.log("download:", downloadLink);
                        a.href = downloadLink;
                        a.click();
                        history[subId] = true;
                        saveHistory(history);
                        tbody.style.backgroundColor = "rgba(0, 128, 0, 0.2)";
                    })
                    .catch((error) => alert("Something went wrong.\n" + error));
            });

            buttonWrapper.appendChild(downloadedBtn);
            buttonWrapper.appendChild(notDownloadedBtn);
            buttonWrapper.appendChild(autoDownloadBtn);

            titleBody.appendChild(buttonWrapper);
        }

        function main() {
            let tableList = document.querySelectorAll(
                "#threadlisttableid > tbody:not(:first-child)"
            );
            tableList.forEach((item) => {
                try {
                    modifyTbodyElement(item);
                } catch (error) {
                    console.error("error:", error);
                }
            });
        }

        main();
    }

    if (window.location.pathname.endsWith("/forum.php")) {
        if (paramObj.mod === "forumdisplay") {
            console.log("is forumdisplay");
            modIsForumdisplay();
        } else if (paramObj.mod === "torrents") {
            console.log("is torrents");
            modIsTorrents();
        }
    }
})();
