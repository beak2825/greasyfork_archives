// ==UserScript==
// @name         TheTVDB Export Episodes
// @namespace    https://www.thetvdb.com/
// @version      1.0
// @license      GPLv3
// @description  Export TV show episode names and air dates from Aired Order pages on TheTVDB
// @author       xdpirate
// @match        https://thetvdb.com/series/*/allseasons/*
// @match        https://www.thetvdb.com/series/*/allseasons/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thetvdb.com
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526603/TheTVDB%20Export%20Episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/526603/TheTVDB%20Export%20Episodes.meta.js
// ==/UserScript==

GM_addStyle(`
    .EADButton {
        background-color: #0DA;
        color: black;
    }
`);

document.querySelector("h1").insertAdjacentHTML("afterend", `
    <div>
        <input type="button" class="EADButton" value="Export" id="EADExportButton">
        <input type="radio" id="EADChoiceCSV" name="EADChoice" value="CSV" checked><label for="EADChoiceCSV"> CSV</label>
        <input type="radio" id="EADChoiceJSON" name="EADChoice" value="JSON"><label for="EADChoiceJSON"> JSON</label>
    </div>
`);

function downloadFile(filename, text) {
    let element = document.createElement('a');
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

let exportData = function() {
    let episodes = document.querySelectorAll(".list-group-item");
    let showName = document.querySelector("div.crumbs > a[href*='/series/']").innerText.trim();

    let showArr = [];
    for(let i = 0; i < episodes.length; i++) {
        let epName = episodes[i].querySelector("h4.list-group-item-heading > a").innerText.trim();
        let epNum = episodes[i].querySelector(".episode-label").innerText.trim();
        let epDate = episodes[i].querySelector("ul.list-inline > li:first-child").innerText.trim();

        let epObj = {
            showName: showName,
            epNum: epNum,
            epName: epName,
            epDate: epDate,
        }

        showArr.push(epObj);
    }

    let seriesID = location.href.match(/^https:\/\/(?:www\.)?thetvdb\.com\/series\/(.+)\/allseasons\/(.+)/)[1];
    if(document.querySelector("#EADChoiceCSV").checked) {
        showName = `"${showName.replaceAll(`"`, `""`)}"`;
        let outputText = `showName,epNum,epName,epDate\n`;
        for(let i = 0; i < showArr.length; i++) {
            let epNum = `"${showArr[i].epNum.replaceAll(`"`, `""`)}"`;
            let epName = `"${showArr[i].epName.replaceAll(`"`, `""`)}"`;
            let epDate = `"${showArr[i].epDate.replaceAll(`"`, `""`)}"`;
            outputText = `${outputText}${showName},${epNum},${epName},${epDate}\n`;
        }

        downloadFile(`export-${seriesID}-${Date.now()}.csv`, outputText);
    } else {
        downloadFile(`export-${seriesID}-${Date.now()}.json`, JSON.stringify(showArr));
    }
};

document.querySelector("#EADExportButton").addEventListener("click", exportData);
