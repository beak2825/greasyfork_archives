// ==UserScript==
// @name         steam创意工坊一键下载（非合集版）
// @namespace    https://greasyfork.org/zh-CN/users/935835
// @version      0.1
// @description  steam创意工坊选择下载，***仅支持单页内下载，需配合steamcmd下载
// @author       menkeng
// @match        https://steamcommunity.com/workshop/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/503110/steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%EF%BC%88%E9%9D%9E%E5%90%88%E9%9B%86%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/503110/steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%EF%BC%88%E9%9D%9E%E5%90%88%E9%9B%86%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
/* globals jQuery, $,*/
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383
const modIds = new Set()
const getGameId = () => {
    const match = window.location.href.match(/https:\/\/steamcommunity.com\/workshop\/browse\/\?appid=([0-9]+)/)
    return match ? match[1] : null
}

const generateDownloadText = (gameId, modIds) => {
    const modIdStr = modIds.map((modId) => `+workshop_download_item ${gameId} ${modId}`).join(" ")
    return `@echo off\nsteamcmd +login anonymous ${modIdStr}`
}

const downloadMods = (gameId, modIds) => {
    const text = generateDownloadText(gameId, modIds)
    const filename = $("div.workshopItemTitle")[0]?.textContent + ".bat"
    $("<a>", {
        href: "data:text/plain;charset=utf-8," + encodeURIComponent(text),
        download: filename,
        style: "display:none",
    })
        .appendTo("body")[0]
        .click()
}

const createDownloadButton = (modId) => {
    let dl = document.createElement("div")
    dl.style.cssText =
        "width: 60px; height: 30px; font-size: 14px; font-weight: bold; text-align: center; line-height: 30px; background-color: #4CAF50; color: white; border-radius: 5px; cursor: pointer; box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);"
    dl.innerText = "加入"
    dl.onclick = () => {
        modIds.has(modId) ? (modIds.delete(modId), $(dl).text("加入"), $(dl).css("background-color", "#4CAF50")) : (modIds.add(modId), $(dl).text("已加入"), $(dl).css("background-color", "red"));
    }
    return dl
}

setTimeout(() => {
    $(".workshopBrowseItems .workshopItem").each(function () {
        var $this = $(this)
        var modId = $this.find("a").attr("data-publishedfileid")
        modId && $(this).append(createDownloadButton(modId))
    })
    const dl_all = document.createElement("button")
    dl_all.innerText = "下载已选"
    dl_all.style.cssText =
        "position: fixed; top: 120px; right: 50px; width: 80px; height: 30px; font-size: 16px; font-weight: bold; text-align: center; line-height: 30px; background-color: #4CAF50; color: white; border-radius: 5px; cursor: pointer; box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);z-index: 9999"
    dl_all.onclick = () => {
        const gameId = getGameId()
        downloadMods(gameId, Array.from(modIds))
        alert("已下载" + modIds.size + "个 mod")
    }
    $("body").append(dl_all)
}, 2000)
