// ==UserScript==
// @name         Show Epic details
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Show Dev/Design stories and logged time for Epic
// @author       bliushtein
// @match        https://tms.netcracker.com/browse/DUBSS*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      MIT
// @grant        GM_xmlhttpRequest
// @require https://update.greasyfork.org/scripts/486123/1324712/TMS_Library.js
// @downloadURL https://update.greasyfork.org/scripts/485435/Show%20Epic%20details.user.js
// @updateURL https://update.greasyfork.org/scripts/485435/Show%20Epic%20details.meta.js
// ==/UserScript==

function extractIssueKeyFromUrl(url) {
    const re = /DUBSS-\d+$/;
    const ticketId = re.exec(document.URL);
    console.log(`ticketId = ${ticketId}`);
    return ticketId;
}

class TMPageUpdater {
    #getRootElement;
    #getData;
    #updatePageContent;

    constructor(updatePageContent, getRootElement, getData) {
        this.#getRootElement = getRootElement;
        this.#getData = getData;
        this.#updatePageContent = updatePageContent;
    }

    async execute() {
        const rootElement = await this.#getRootElement();
        const data = await this.#getData();
        this.#updatePageContent(rootElement, data);
    }
}

class SingleTmsIssuePageUpdater extends TMPageUpdater {

    extractIssueKeyFromUrl() {
        const re = /DUBSS-\d+$/;
        const ticketId = re.exec(document.URL);
        console.log(`ticketId = ${ticketId}`);
        return ticketId;
    }

    constructor(updatePageContent) {
        super(updatePageContent,
              () => document.getElementById("viewissuesidebar"),
              async () => {
            const key = extractIssueKeyFromUrl();
            const issueInfo = await TmsApi.getIssue(key);
            if (issueInfo.fields.issuetype.id != Constants.ISSUE_TYPE_EPIC) {
                //Other issue types not supported now
                return null;
            }
            const relatedStoriesInfo = await TmsApi.getRelatedStories([key]);
            const relatedStories = relatedStoriesInfo.issues.map(story => new TmsStory(story));
            const epic = new TmsEpic(issueInfo, relatedStories);
            const devTaskContainers = relatedStories.filter((story) => story.isDevStory).map((story) => story.key);
            const subtasks = await TmsApi.getSubtasks(devTaskContainers);
            epic.fillSubtasks(subtasks.issues);
            return epic;
        });
    }
}

function addCellWithText(row, text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    row.appendChild(cell);
}

function formatTime(timeInSeconds) {
    if (timeInSeconds == null) {
        return "-";
    } else {
        const timeInWorkDays = timeInSeconds / 28800.0;
        return `${Math.round(timeInWorkDays * 100.0) / 100.0} md`;
    }
}

function convertToTable(epic) {
    const table = document.createElement('table');
    table.border = "1px solid grey";
    const headerRow = document.createElement('tr');
    addCellWithText(headerRow,"Component");
    addCellWithText(headerRow,"Design Story");
    addCellWithText(headerRow,"Dev Story");
    addCellWithText(headerRow,"Time Tracking");
    addCellWithText(headerRow,"Overheads");
    table.appendChild(headerRow);
    const componentsDetails = epic.componentsDetails;
    for(const key of Object.keys(componentsDetails)) {
        const compDetails = componentsDetails[key];
        const row = document.createElement('tr');
        const compСell = document.createElement('td');
        compСell.textContent = key;
        row.appendChild(compСell);
        const designStoryKeyCell = document.createElement('td');
        row.appendChild(designStoryKeyCell);
        const devStoryKeyCell = document.createElement('td');
        row.appendChild(devStoryKeyCell);
        const timeTrackingCell = document.createElement('td');
        row.appendChild(timeTrackingCell);
        const overheadsCell = document.createElement('td');
        row.appendChild(overheadsCell);
        if (!compDetails.designStoryExists) {
            designStoryKeyCell.textContent = "-";
        } else {
            const linkToDesignStory = document.createElement("a");
            linkToDesignStory.href = TmsApi.getLinkToIssue(compDetails.designStory.key);
            linkToDesignStory.textContent = `${compDetails.designStory.key}[${compDetails.designStory.status}]`;
            designStoryKeyCell.appendChild(linkToDesignStory);
        }
        const linkToDevStory = document.createElement("a");
        devStoryKeyCell.appendChild(linkToDevStory);

        if (!compDetails.devStoryExists) {
            linkToDevStory.style.display = "none";
            timeTrackingCell.textContent = "-";
            if (!compDetails.designStoryExists) {
                devStoryKeyCell.textContent = "-";
            } else {
                const createDevStoryButton = document.createElement("input");
                createDevStoryButton.type = "button"
                createDevStoryButton.value = "Create Dev Story";
                createDevStoryButton.onclick = async function() {
                    const createdDevStoryKey = await TmsApi.createDevStoryFromDesignStory(compDetails.designStory.issueInfo, epic.key);
                    linkToDevStory.style.display = "";
                    createDevStoryButton.style.display = "none";
                    linkToDevStory.href = TmsApi.getLinkToIssue(createdDevStoryKey);
                    linkToDevStory.textContent = `${createdDevStoryKey}[Open]`;
                }
                devStoryKeyCell.appendChild(createDevStoryButton);
            }
        } else {
            linkToDevStory.href = TmsApi.getLinkToIssue(compDetails.devStory.key);
            linkToDevStory.textContent = `${compDetails.devStory.key}[${compDetails.devStory.status}]`;
            const originalEstimate = formatTime(compDetails.devStory.timeTracking.originalEstimate);
            const totalLogged = formatTime(compDetails.devStory.timeTracking.total);
            let timeTrackingText = `Original Estimate:${originalEstimate}<br>\nTotal Logged:${totalLogged}<br>\n`;
            for (const category of compDetails.devStory.timeTracking.getExistingCategories()) {
                timeTrackingText = timeTrackingText + `${category}:${formatTime(compDetails.devStory.timeTracking.getLoggedTimeByCategory(category))}\n`;
            }
            timeTrackingCell.innerHTML = timeTrackingText;
            let overheadsText = "";
            for (const task of compDetails.devStory.subtasks.filter(task => task.overheadCategory != null)) {
                overheadsText += `task: ${task.key} type: ${task.overheadCategory} OE: ${formatTime(task.originalEstimate)} Logged:${formatTime(task.loggedTime)}<br>`;
            }
            overheadsCell.innerHTML = overheadsText;
        }
        table.appendChild(row);
    }
    return table;
}

function createAddEstimationsTableButton(epic) {
    const button = document.createElement("input");
    button.type = "button";
    button.value = "Create Estimations Table";
    button.onclick = async function() {
        const issueInfo = TmsApi.getIssue(epic.key, ["description"]);
        let tableText = "||Stream||LoE, md||";
        for (const comp of epic.components) {
            tableText = `${tableText}\\n|${comp}| |`;
        }
        await TmsApi.sendRequest(`${TmsApi.REST_API_URL_PREFIX}/issue/${epic.key}`, "PUT", `{"fields": {"description": "${tableText}"}}`);
    }
    return button;
}

(async function() {
    console.log("start TM script");
    const pageUpdater = new SingleTmsIssuePageUpdater(
        (rootElement, epic) => {
            if (epic == null || !(epic instanceof TmsEpic)) {
                return;
            }
            const errors = epic.getAllErrors();
            if (errors.length > 0) {
                const errorsElement = document.createElement('p');
                errorsElement.innerHTML = JSON.stringify(errors);
                rootElement.appendChild(errorsElement);
            }
            rootElement.appendChild(createAddEstimationsTableButton(epic));
            rootElement.appendChild(convertToTable(epic));
        });
    await pageUpdater.execute();
})();