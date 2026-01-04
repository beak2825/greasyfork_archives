// ==UserScript==
// @name         SteamClientInfoBoxManage
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  隐藏"Steam个人游戏列表"页的客户端和下载信息，附加游戏列表排序功能
// @author       澪羽
// @match        https://steamcommunity.com/profiles/*/games/*
// @match        https://steamcommunity.com/id/*/games/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/433422/SteamClientInfoBoxManage.user.js
// @updateURL https://update.greasyfork.org/scripts/433422/SteamClientInfoBoxManage.meta.js
// ==/UserScript==

const iGameContainer = "games_list_row_container" // all games container div
const iGameList = "games_list_rows" // all games div
const cActiveBackground = "gameListItemActive" // 活动状态背景
const iClientInfo = "clientConnBlock" // 客户端计算机相关信息
const cDiskStatus = "clientConnItemBlock" // 磁盘信息和下载图标
const cAppInstalled = "gameListItemInstalled" // 客户端已安装

var gDefaultSortApps = getApps()
var gSortApps = new Array()
var gDiskStatus = document.querySelectorAll('.' + cDiskStatus)
var gmSettings = { "SortTypeIndex": 1, "DisplayClientInfo": true, "DisplayActiveBackground": true, "DisplayDiskStatus": true, "DisplayDownloadIcon": true }

function getApps() {
    let aNodeList = document.getElementById(iGameList).childNodes
    let ret = Array.prototype.slice.call(aNodeList, 0)
    return ret.slice(1, ret.length)
}

function getAppName(DOM) {
    return DOM.childNodes[2].childNodes[1].childNodes[1].childNodes[1].innerText
}

function getTimeRecord(DOM) {
    return DOM.childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerText
}

function getPlaytime(s) {
    var ret = 0.00
    let aString = s.split(" ")
    var sNumStr
    for (let i = 0; i < aString.length; i++) {
        if (!!(aString[i].match(/\d/g))) {
            sNumStr = aString[i]
        }
    }
    if (sNumStr.includes(",")) {
        let aLeft = sNumStr.split(",")
        let sLeft = aLeft.join('')
        ret = parseFloat(sLeft)
    } else {
        ret = parseFloat(sNumStr)
    }
    return ret
}

function rerenderAppList() {
    for (let i = 0; i < gSortApps.length; i++) {
        document.getElementById(iGameList).appendChild(gSortApps[i].DOM)
    }

    return
}

function sortAndRerender(sFieldName, sSortDirection) {
    switch (sSortDirection) {
        case "DESC":
            gSortApps.sort(compareDESC(sFieldName))
            break
        case "ASC":
            gSortApps.sort(compareASC(sFieldName))
            break
    }
    rerenderAppList()

    return
}

function defaultSortAndRerender() {
    for (let i = 0; i < gDefaultSortApps.length; i++) {
        document.getElementById(iGameList).appendChild(gDefaultSortApps[i])
    }

    return
}

function getFieldName(s) {
    return (s.split("_"))[0]
}

function getSortDirection(s) {
    return (s.split("_"))[1]
}

function initSortTypeSelect(dParent) {
    var dSortTypeArea = document.createElement('div')

    let lSortType = document.createElement('label')
    lSortType.innerText = "排序方式　"

    let sSortType = document.createElement('select')
    const sDefaultSort = "Default_Sort"
    const sPlaytimeDESC = "Playtime_DESC"
    const sPlaytimeASC = "Playtime_ASC"
    const sNameDESC = "Name_DESC"
    const sNameASC = "Name_ASC"
    sSortType.options.add(new Option("Default Sort(默认排序)", sDefaultSort))
    sSortType.options.add(new Option("Playtime DESC(时间降序)", sPlaytimeDESC))
    sSortType.options.add(new Option("Playtime ASC(时间升序)", sPlaytimeASC))
    sSortType.options.add(new Option("Name DESC(名称降序)", sNameDESC))
    sSortType.options.add(new Option("Name ASC(名称升序)", sNameASC))
    sSortType.setAttribute('id', "SortType")
    sSortType.onchange = function () {
        let self = document.getElementById("SortType")
        let sFieldName = getFieldName(self.value)
        let sSortDirection = getSortDirection(self.value)
        switch (self.value) {
            case sDefaultSort:
                defaultSortAndRerender()
                break
            case sPlaytimeDESC: case sPlaytimeASC: case sNameDESC: case sNameASC:
                sortAndRerender(sFieldName, sSortDirection)
                break
            default:
                console.log("unknown SortType：" + self.value)
                return
        }
        GM_setValue("SortTypeIndex", self.selectedIndex)
    }
    sSortType.selectedIndex = gmSettings.SortTypeIndex

    dSortTypeArea.appendChild(lSortType)
    dSortTypeArea.appendChild(sSortType)
    dParent.appendChild(dSortTypeArea)

    return
}

function displayClientInfo(bHide) {
    GM_setValue("DisplayClientInfo", bHide)
    if (bHide) {
        document.getElementById(iClientInfo).style.display = 'none'
    } else {
        document.getElementById(iClientInfo).style.display = 'block'
    }

    return
}

function displayActiveBackground(bHide) {
    GM_setValue("DisplayActiveBackground", bHide)
    if (bHide) {
        for (let i = 0; i < gSortApps.length; i++) {
            if (gSortApps[i].ActiveBackgroundFlag) {
                let sAppClass = gSortApps[i].DOM.getAttribute('class')
                sAppClass = sAppClass.replace(cActiveBackground, "")
                gSortApps[i].DOM.setAttribute('class', sAppClass)
            }
        }
    } else {
        for (let i = 0; i < gSortApps.length; i++) {
            if (gSortApps[i].ActiveBackgroundFlag) {
                let sAppClass = gSortApps[i].DOM.getAttribute('class')
                sAppClass = sAppClass.concat(" " + cActiveBackground)
                gSortApps[i].DOM.setAttribute('class', sAppClass)
            }
        }
    }

    return
}

function displayDiskStatus(bHide) {
    GM_setValue("DisplayDiskStatus", bHide)
    if (bHide) {
        for (let i = 0; i < gDiskStatus.length; i++) {
            gDiskStatus[i].childNodes[1].style.display = 'none'
        }
    } else {
        for (let i = 0; i < gDiskStatus.length; i++) {
            gDiskStatus[i].childNodes[1].style.display = 'block'
        }
    }

    return
}

function displayDownloadIcon(bHide) {
    GM_setValue("DisplayDownloadIcon", bHide)
    if (bHide) {
        for (let i = 0; i < gDiskStatus.length; i++) {
            let aDownloadInfo = gDiskStatus[i].childNodes
            if ((aDownloadInfo.length) >= 5) {
                aDownloadInfo[3].style.display = 'none'
            }
        }
    } else {
        for (let i = 0; i < gDiskStatus.length; i++) {
            let aDownloadInfo = gDiskStatus[i].childNodes
            if ((aDownloadInfo.length) >= 5) {
                aDownloadInfo[3].style.display = 'block'
            }
        }
    }

    return
}

function initSettingCheckbox(dParent) {
    var dCheckboxArea = document.createElement('div')

    let dClientInfo = document.createElement('div')
    let cClientInfo = document.createElement('input')
    cClientInfo.setAttribute('type', 'checkbox')
    cClientInfo.setAttribute('id', "ClientInfo")
    cClientInfo.onclick = function () {
        let self = document.getElementById("ClientInfo")
        displayClientInfo(self.checked)
    }
    cClientInfo.checked = gmSettings.DisplayClientInfo
    dClientInfo.appendChild(cClientInfo)
    let tClientInfo = document.createTextNode("Hide Client Info(隐藏客户端信息框)")
    dClientInfo.appendChild(tClientInfo)

    let dActiveBackground = document.createElement('div')
    let cActiveBackground = document.createElement('input')
    cActiveBackground.setAttribute('type', 'checkbox')
    cActiveBackground.setAttribute('id', "ActiveBackground")
    cActiveBackground.onclick = function () {
        let self = document.getElementById("ActiveBackground")
        displayActiveBackground(self.checked)
    }
    cActiveBackground.checked = gmSettings.DisplayActiveBackground
    dActiveBackground.appendChild(cActiveBackground)
    let tActiveBackground = document.createTextNode("Hide Active Background(隐藏活动中游戏的背景颜色条)")
    dActiveBackground.appendChild(tActiveBackground)

    let dDiskStatus = document.createElement('div')
    let cDiskStatus = document.createElement('input')
    cDiskStatus.setAttribute('type', 'checkbox')
    cDiskStatus.setAttribute('id', "DiskStatus")
    cDiskStatus.onclick = function () {
        let self = document.getElementById("DiskStatus")
        displayDiskStatus(self.checked)
    }
    cDiskStatus.checked = gmSettings.DisplayDiskStatus
    dDiskStatus.appendChild(cDiskStatus)
    let tDiskStatus = document.createTextNode("Hide Disk Status(隐藏磁盘占用信息)")
    dDiskStatus.appendChild(tDiskStatus)

    let dDownloadIcon = document.createElement('div')
    let cDownloadIcon = document.createElement('input')
    cDownloadIcon.setAttribute('type', 'checkbox')
    cDownloadIcon.setAttribute('id', "DownloadIcon")
    cDownloadIcon.onclick = function () {
        let self = document.getElementById("DownloadIcon")
        displayDownloadIcon(self.checked)
    }
    cDownloadIcon.checked = gmSettings.DisplayDownloadIcon
    dDownloadIcon.appendChild(cDownloadIcon)
    let tDownloadIcon = document.createTextNode("Hide Download Icon(隐藏下载图标)")
    dDownloadIcon.appendChild(tDownloadIcon)

    dCheckboxArea.appendChild(dClientInfo)
    dCheckboxArea.appendChild(dActiveBackground)
    dCheckboxArea.appendChild(dDiskStatus)
    dCheckboxArea.appendChild(dDownloadIcon)
    dParent.appendChild(dCheckboxArea)

    return
}

function initSettingArea() {
    // root dom
    var dRootDiv = document.createElement('div')

    // todo：展开/收起功能设置区域+(文字描述or分隔线)
    var dHeader = document.createElement('div')
    initSortTypeSelect(dHeader)

    // 选项
    var dSettingArea = document.createElement('div')
    initSettingCheckbox(dSettingArea)

    dRootDiv.appendChild(dHeader)
    dRootDiv.appendChild(dSettingArea)
    let dGameContainer = document.getElementById(iGameContainer)
    let dParent = dGameContainer.parentNode
    dParent.insertBefore(dRootDiv, dGameContainer)

    return
}

function loadStorageConfig() {
    if (!(typeof (GM_getValue("SortTypeIndex")) == 'undefined')) {
        gmSettings.SortTypeIndex = GM_getValue("SortTypeIndex")
    }

    if (!(typeof (GM_getValue("DisplayClientInfo")) == 'undefined')) {
        gmSettings.DisplayClientInfo = GM_getValue("DisplayClientInfo")
    }
    displayClientInfo(gmSettings.DisplayClientInfo)

    if (!(typeof (GM_getValue("DisplayActiveBackground")) == 'undefined')) {
        gmSettings.DisplayActiveBackground = GM_getValue("DisplayActiveBackground")
    }

    if (!(typeof (GM_getValue("DisplayDiskStatus")) == 'undefined')) {
        gmSettings.DisplayDiskStatus = GM_getValue("DisplayDiskStatus")
    }
    displayDiskStatus(gmSettings.DisplayDiskStatus)

    if (!(typeof (GM_getValue("DisplayDownloadIcon")) == 'undefined')) {
        gmSettings.DisplayDownloadIcon = GM_getValue("DisplayDownloadIcon")
    }
    displayDownloadIcon(gmSettings.DisplayDownloadIcon)

    return
}

(function () {
    'use strict';

    // Your code here...
    loadStorageConfig()
    initSettingArea()

    for (let i = 0; i < gDefaultSortApps.length; i++) {
        let dNode = { "ActiveBackgroundFlag": false, "Playtime": 0.00 }

        // ActiveBackground初始化
        let sAppClass = gDefaultSortApps[i].getAttribute('class')
        if (sAppClass.indexOf(cActiveBackground) != -1) {
            dNode.ActiveBackgroundFlag = true
            if (gmSettings.DisplayActiveBackground) {
                sAppClass = sAppClass.replace(cActiveBackground, "")
                gDefaultSortApps[i].setAttribute('class', sAppClass)
            }
        }

        dNode.DOM = gDefaultSortApps[i]
        dNode.Name = getAppName(gDefaultSortApps[i])
        let sTimeRecord = getTimeRecord(gDefaultSortApps[i])
        if (!(sTimeRecord == "")) {
            dNode.Playtime = getPlaytime(sTimeRecord)
        }

        gSortApps.push(dNode)
    }

    if (gmSettings.SortTypeIndex > 0) {
        let sSortType = document.getElementById("SortType")
        let sFieldName = getFieldName(sSortType.options[gmSettings.SortTypeIndex].value)
        let sSortDirection = getSortDirection(sSortType.options[gmSettings.SortTypeIndex].value)
        sortAndRerender(sFieldName, sSortDirection)
    }

    return
})();

function compareDESC(sFieldName) {
    return function (a, b) {
        let v1 = (a[sFieldName])
        let v2 = (b[sFieldName])
        if (v1 < v2) {
            return 1
        }
        if (v1 > v2) {
            return -1
        }
        return 0
    }
}

function compareASC(sFieldName) {
    return function (a, b) {
        let v1 = a[sFieldName]
        let v2 = b[sFieldName]
        if (v1 < v2) {
            return -1
        }
        if (v1 > v2) {
            return 1
        }
        return 0
    }
}