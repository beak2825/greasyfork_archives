// ==UserScript==
// @name         Show design/build status for epic
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Show design/build status per components for epic in table
// @author       bliushtein
// @match        https://tms.netcracker.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netcracker.com
// @license      MIT
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/486123/1324712/TMS_Library.js
// @downloadURL https://update.greasyfork.org/scripts/486117/Show%20designbuild%20status%20for%20epic.user.js
// @updateURL https://update.greasyfork.org/scripts/486117/Show%20designbuild%20status%20for%20epic.meta.js
// ==/UserScript==

function getcomponentsColumnNumber(issueTableRootElement) {
    const headerRow = issueTableRootElement.querySelector(`tr.rowHeader`);
    for (let i = 0; i < headerRow.children.length; i++) {
        if (headerRow.children[i].attributes["data-id"].value == "components") {
            return i;
        }
    }
    return null;
}

function createElementForStory(story) {
    if (story == null) {
        return document.createTextNode("-");
    } else {
        const a = document.createElement("a");
        if (story.status == "Ready for Build") {
            a.textContent = "RFB";
        } else if (story.status == "Ready for Testing") {
            a.textContent = "RFT";
        } else {
            a.textContent = story.status;
        }
        a.href = TmsApi.getLinkToIssue(story.key);
        return a;
    }
}

(async function() {
    const errors = [];
    console.log("start TM script");
    await delay(1000);//wait until async elements will be loaded
    const issueTableRootElement = document.querySelector(`issuetable-web-component[data-content="issues"]`);
    if (issueTableRootElement == null) {
        return;
    }
    const epicKeys = [];
    const epicKeyToDataRow = {};
    const componentsColumnNumber = getcomponentsColumnNumber(issueTableRootElement);
    const dataRows = issueTableRootElement.querySelectorAll(`tr.issuerow`);
    for (const dataRow of dataRows) {
        console.log(dataRow);
        const issueTypeCol = dataRow.querySelector(`td.issuetype img[alt="Epic"]`);
        console.log(issueTypeCol);
        if (issueTypeCol != null) {
            const key = dataRow.attributes["data-issuekey"].value;
            epicKeys.push(key);
            epicKeyToDataRow[key] = dataRow;
        }
    }
    console.log(epicKeys);
    const epics = await TmsApi.getIssues(epicKeys);
    const storyInfos = await TmsApi.getRelatedStories(epicKeys);
    const stories = storyInfos.issues.map(storyInfo => new TmsStory(storyInfo));
    for (const epicInfo of epics.issues) {
        const epic = new TmsEpic(epicInfo, stories);
        const componentsDetails = epic.componentsDetails;
        const dataRow = epicKeyToDataRow[epic.key];
        const componentsCell = dataRow.querySelector("td.components");
        for (const componentElement of componentsCell.children) {
            const compDetails = componentsDetails[componentElement.innerHTML];
            if (compDetails != null) {
                componentElement.setAttribute("style", "font-weight: bold");
                const nextElement = componentElement.nextSibling;
                componentsCell.insertBefore(document.createTextNode("("), nextElement);
                componentsCell.insertBefore(createElementForStory(compDetails.designStory), nextElement);
                componentsCell.insertBefore(document.createTextNode(","), nextElement);
                componentsCell.insertBefore(createElementForStory(compDetails.devStory), nextElement);
                componentsCell.insertBefore(document.createTextNode(")"), nextElement);
            }
        }
        errors.push(...epic.getAllErrors());
    }
    console.log(errors);
})();