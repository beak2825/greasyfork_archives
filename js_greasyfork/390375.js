// ==UserScript==
// @name         追新番复制所有磁力链接
// @include      *zhuixinfan.com/*viewtvplay*
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  追新番快捷复制所有磁力链接
// @author       leeyang1990@gmail.com
// @grant GM_xmlhttpRequest
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/390375/%E8%BF%BD%E6%96%B0%E7%95%AA%E5%A4%8D%E5%88%B6%E6%89%80%E6%9C%89%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/390375/%E8%BF%BD%E6%96%B0%E7%95%AA%E5%A4%8D%E5%88%B6%E6%89%80%E6%9C%89%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    "use strict";
    createAllMagnetLinkButton();
})();

function createAllMagnetLinkButton() {
    const filterTabElement = document.querySelectorAll(".filter-tab");
    if (filterTabElement && filterTabElement[0]) {
        const span = document.createElement("span");
        span.className = "a y";
        span.setAttribute("style", `margin:auto 2px;cursor:pointer`);
        const a = document.createElement("a");
        a.textContent = "复制全部磁力链接";
        span.appendChild(a);
        span.addEventListener(
            "click",
            function() {
                onAllMagnetLinkClick(onRequstAllMagnetLinkFinish);
            },
            false
        );
        filterTabElement[0].appendChild(span);
    }
}

//复制全部磁力链接按钮的回调
function onAllMagnetLinkClick(callback) {
    const list = getAllEpisodeUrls();
    const all = [];
    
    for (let index = 0; index < list.length; index++) {
        const link = list[index];
        getDocument(link, document => {
            all.push({index: index + 1, magnetLink: getMagnetLink(document)});
            if (all.length == list.length) {
                console.log("done");
                callback(all);
            }
        });
    }
}

function onRequstAllMagnetLinkFinish(objArray) {
    const availableMagnetLink = [];
    const unavailableIndex = [];
    for (const iterator of objArray) {
        if (iterator.magnetLink != null) {
            availableMagnetLink.push(iterator.magnetLink);
        }
        else {
            unavailableIndex.push(iterator.index);
        }
    }

    //console.log(`可用的磁力链接 ${availableMagnetLink.length} 个`);
    GM_setClipboard(availableMagnetLink.join("\n"), "text");
    let finishInfo = `成功复制了 ${availableMagnetLink.length} 个磁力链接`;
    if (unavailableIndex.length > 0) {
        finishInfo += `\n，${unavailableIndex.join(",")} 获取失败`;
    }
    alert(finishInfo);
}

//获取全部剧集的url
function getAllEpisodeUrls() {
    const urls = [];
    const list = document.getElementById("ajax_tbody").querySelectorAll(".td2");
    for (let i = 0; i < list.length; i++) {
        urls.push(list[i].children[0].href);
    }
    return urls;
}

function getDocument(_url, callback) {
    GM_xmlhttpRequest({
        method: "GET",
        url: _url,
        overrideMimeType: "text/html",
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            callback(doc);
        },
        onerror: function() {
            console.log("获取失败，重新请求");
            getDocument(_url, callback);
        },
        ontimeout: function() {
            console.log("获取失败，重新请求");
            getDocument(_url, callback);
        }
    });
}

function getMagnetLink(document) {
    const element = document.getElementById("torrent_url");
    if (element) {
        return document.getElementById("torrent_url").innerText;
    }
    else {
        return null;
    }
}
