// ==UserScript==
// @name         SkyMods downloader for steam
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Download mod via skymods.ru directly from steam workshop
// @author       Namkazt ( nam.kazt.91@gmail.com )
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @match        https://steamcommunity.com/workshop/filedetails/*
// @match        https://steamcommunity.com/workshop/browse/*
// @match        https://steamcommunity.com/workshop/browse/*
// @connect      smods.ru
// @connect      modsbase.com
// @connect      modsbasedl.com
// @connect      uploadfiles.eu
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/382030/SkyMods%20downloader%20for%20steam.user.js
// @updateURL https://update.greasyfork.org/scripts/382030/SkyMods%20downloader%20for%20steam.meta.js
// ==/UserScript==
var DOWNLOAD_BTN =
    '<a id="DownloadBtn" class="btn_green_white_innerfade btn_border_2px btn_medium " style="line-height: 20px;transition: all 0.5s ease;height: 20px;background: linear-gradient( to bottom, #ffafbd 35%, #ffc3a0 65%);color: #345f59 !important;position: fixed;left: 10px;bottom: 50vh;display: block;padding: 6px;"> <span id="DownloadTxt" class="subscribeText" style="height: 20px;font-size: 13px;background: linear-gradient( to bottom, #ffafbd 35%, #ffc3a0 65%);color: #345f59 !important;line-height: 20px;text-align: center;padding: 0;font-weight: 700;"> Download </span></a>';
var DOWNLOAD_BTN_MINI =
    '<a id="DownloadBtn" class="btn_green_white_innerfade btn_border_2px btn_medium " style="z-index: 1000;line-height: 12px;transition: all 0.5s ease;height: 12px;background: linear-gradient( to bottom, #ffafbd 35%, #ffc3a0 65%);color: #345f59 !important;padding: 6px;position: absolute;margin-top: 5px;margin-left: 5px;"> <span id="DownloadTxt" class="subscribeText" style="height: 12px;font-size: 9px;background: linear-gradient( to bottom, #ffafbd 35%, #ffc3a0 65%);color: #345f59 !important;line-height: 12px;text-align: center;padding: 0;font-weight: 700;"> Download </span></a>';
var LOADING_CSS =
    ".lds-ripple { display: inline-block; position: relative; width: 64px; height: 64px; top: -40px; z-index: 999} .lds-ripple div { position: absolute; border: 4px solid #fff; opacity: 1; border-radius: 50%; animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite; } .lds-ripple div:nth-child(2) { animation-delay: -0.5s; } @keyframes lds-ripple { 0% { top: 28px; left: 28px; width: 0; height: 0; opacity: 1; } 100% { top: -1px; left: -1px; width: 58px; height: 58px; opacity: 0; } }";
var LOADING_BLOCK = '<div class="lds-ripple"><div></div><div></div></div>';

function Download(url) {
    document.getElementById("downloadHelper").src = url;
}

function init() {
    if ($ === undefined) {
        $ = JQuery;
        console.log("----------- Add $ for JQuery");
    }
    var downloadHelper = createElementFromHTML(
        '<iframe id="downloadHelper" style="display:none;"></iframe>'
    );
    document.body.appendChild(downloadHelper);

    if (window.location.href.indexOf("appid=") >= 0) {
        console.log("----------- Workshop browser page");
        var itemList = document.querySelectorAll(".workshopItemPreviewHolder");

        for (var item of itemList) {
            var itemDownloadId = item.id.replace("sharedfile_", "");
            var btnNode = createElementFromHTML(DOWNLOAD_BTN_MINI);

            searchForMod(itemDownloadId,
                (function() {
                    var workshopId = itemDownloadId;
                    var btn = btnNode;
                    var textNode = btn.querySelector("#DownloadTxt");
                    textNode.innerText = "Checking for mod";
                    return function(found, downloadId, downloadUrl, updated) {
                        if (found) {
                            changeButtonGradient(btn, "abecd6", "fbed96");
                            textNode.innerText = "Download - " + updated;
                            btn.addEventListener("click", function() {
                                searchForDownloadLink(btn, downloadId, downloadUrl);
                            });
                        } else {
                            textNode.innerText = "Not Available (REQUEST)";
                            changeButtonGradient(btn, "e6e9f0", "eef1f5");
                            btn.addEventListener("click", function() {
                                gotoRequestPage(workshopId);
                            });
                        }
                    };
                })()
            );

            item.parentNode.parentNode.insertBefore(
                btnNode,
                item.parentNode.parentNode.firstChild
            );
        }
    } else if (isCollectionPage()) {
        console.log("----------- Collection page");
        var itemList = document.querySelectorAll(".collectionItem");
        for (var item of itemList) {
            var itemDownloadId = item.id.replace("sharedfile_", "");
            var btnNode = createElementFromHTML(DOWNLOAD_BTN_MINI);
            searchForMod(itemDownloadId,
                (function() {
                    var workshopId = itemDownloadId;
                    var btn = btnNode;
                    var textNode = btn.querySelector("#DownloadTxt");
                    textNode.innerText = "Checking for mod";
                    return function(found, downloadId, downloadUrl, updated) {
                        if (found) {
                            changeButtonGradient(btn, "abecd6", "fbed96");
                            textNode.innerText = "Download - " + updated;
                            btn.addEventListener("click", function() {
                                searchForDownloadLink(btn, downloadId, downloadUrl);
                            });
                        } else {
                            textNode.innerText = "Not Available (REQUEST)";
                            changeButtonGradient(btn, "e6e9f0", "eef1f5");
                            btn.addEventListener("click", function() {
                                gotoRequestPage(workshopId);
                            });
                        }
                    };
                })()
            );

            item.insertBefore(btnNode, item.firstChild);
        }
    } else {
        console.log("----------- Single item page");
        // init style

        // add download button on steam page
        var btnNode = createElementFromHTML(DOWNLOAD_BTN);
        var textNode = btnNode.querySelector("#DownloadTxt");
        textNode.innerText = "Checking for mod";
        searchForMod(publishedfileid, function(
            found,
            downloadId,
            downloadUrl,
            updated
        ) {
            if (found) {
                changeButtonGradient(btnNode, "abecd6", "fbed96");
                textNode.innerText = "Download - " + updated;
                btnNode.addEventListener("click", function() {
                    searchForDownloadLink(btnNode, downloadId, downloadUrl);
                });
            } else {
                textNode.innerText = "Not Available (REQUEST)";
                changeButtonGradient(btnNode, "e6e9f0", "eef1f5");
                btnNode.addEventListener("click", function() {
                    gotoRequestPage(publishedfileid);
                });
            }
        });

        document.body.appendChild(btnNode);
    }
    console.log("----------- Init successfully");
}

function createElementFromHTML(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function getAppId() {
    return document.querySelector(".apphub_OtherSiteInfo a").getAttribute('data-appid');
}

function isCitiesSkylines() {
    return (
        document.querySelector(".apphub_HeaderTop .apphub_AppName").innerText ===
        "Cities: Skylines"
    );
}

function isCV6() {
    return (
        document.querySelector(".apphub_HeaderTop .apphub_AppName").innerText ===
        "Sid Meier's Civilization VI"
    );
}

function isCollectionPage() {
    return $("mainContentsCollection") != null;
}

function getDownloadId(downloadUrl) {
    console.log("----------- parsing download url: " + downloadUrl);
    var regex = /\/[^\/]*\//gm;
    var m;
    var downloadId = "";
    while ((m = regex.exec(downloadUrl)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        if (m.index > 6) {
            downloadId = m[0].substr(1, m[0].length - 2);
        }
    }
    return downloadId;
}

function downloadModBase(downloadId, referer, callback) {
    var formData = new FormData();
    formData.append("op", "download2");
    formData.append("id", downloadId);
    formData.append("rand", "");
    formData.append("referer", "");
    formData.append("method_free", "");
    formData.append("method_premium", "");
    var parameters = [];
    for (var pair of formData.entries()) {
        parameters.push(
            encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1])
        );
    }
    var postData = parameters.join("&");
    var request = GM_xmlhttpRequest({
        anonymous: true,
        method: "POST",
        url: "https://modsbase.com/",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "Referer": referer
        },
        data: postData,
        onreadystatechange: function(e) {
            if (this.readyState !== 4) {
                return;
            }

            var parser = new DOMParser();
            var temp = parser.parseFromString(e.response, "text/html").documentElement;
            var urlHolder = temp.querySelector('.download-details a');
            if (urlHolder === null || urlHolder == undefined) {
                window.open(referer, '_blank').focus();
            }else{
                const downloadUrl = urlHolder.href;
                console.log("----------- redirect download url: " +downloadUrl);
                Download(downloadUrl);
                callback(downloadUrl);
                request.abort();
            }
        }
    });
}

function searchForMod(id, callback) {
    var appId = getAppId();
    var url = "http://catalogue.smods.ru/?s=" + id + "&app=" + appId;

    console.log("----------- URL: " + url);

    GM_xmlhttpRequest({
        anonymous: true,
        method: "GET",
        url: url,
        headers: {
            "Referer": "http://catalogue.smods.ru"
        },
        onload: function(e) {
            doc = new DOMParser().parseFromString(e.responseText, "text/html");
            if (doc.getElementsByClassName("post-inner").length > 0) {
                var downloadUrl = doc.querySelector(".post-inner .skymods-excerpt-btn").href;
                var downloadId = getDownloadId(downloadUrl);
                if (downloadId != undefined || downloadId != null || downloadId != "") {
                    console.log("----------- download id: " + downloadId);
                    var rDateStr = doc.querySelector(".post-inner .skymods-item-date").innerText;
                    var updated = moment(rDateStr, "DD MMM at HH:mm YYYY").format(
                        "DD MMM, YYYY"
                    );
                    callback(true, downloadId, downloadUrl, updated);
                } else {
                    callback(false, downloadId, downloadUrl, "");
                }
            } else {
                callback(false, downloadId, downloadUrl, "");
            }
        }
    });
}

function gotoRequestPage(id) {
    var url = "https://steamcommunity.com/sharedfiles/filedetails/?id=" + id;
    if (isCitiesSkylines()) {
         window.open('https://docs.google.com/forms/d/e/1FAIpQLSdXlq9OAWVwX5lRLNvpkMSmpKbEDY50Bl-UU3f6P7OBI2Ny3Q/viewform?c=0&w=1&entry.417177883=' + url, '_blank');
    } else {
         window.open('https://docs.google.com/forms/d/e/1FAIpQLSe7MisYbKNUlTXBcSR2clHxpwaoo0HiZ3zWto0osemubdDP1g/viewform?entry.417177883=' + url, '_blank');
    }
}

function changeButtonGradient(btn, color1, color2) {
    var gradient =
        "linear-gradient(42deg, #" + color1 + " 35%, #" + color2 + " 65%)";
    btn.style.background = gradient;
    btn.querySelector("#DownloadTxt").style.background = gradient;
}

function searchForDownloadLink(e, id, downloadUrl) {
    var textNode = e.querySelector("#DownloadTxt");
    textNode.innerText = "Search for Link";
    downloadModBase(id, downloadUrl, function(downloadUrl) {
        textNode.innerHTML = "Completed [<a href='" + downloadUrl +"'>Link</a>]";
        changeButtonGradient(e, "209cff", "68e0cf");
    });
}

(function() {
    "use strict";

    init();
})();