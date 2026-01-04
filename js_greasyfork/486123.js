// ==UserScript==
// @name         TMS_Library
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  util lib for TMS related scripts
// @author       bliushtein
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// ==/UserScript==

class Constants {
    static DESIGN_GAP = "DesignGap";
    static CROSS_STREAM_GAP = "CrossStreamGap";
    static OVERHEAD_CATEGORIES = [Constants.DESIGN_GAP, Constants.CROSS_STREAM_GAP];
    static DEV_STORY = "DevStory";
    static DESIGN_STORY = "DesignChapter";
    static BA_COMMUNICATION = "BACommunication";
    static CROSS_STREAM_COMMUNICATION = "CrossStreamCommunication";
    static DEV_TEST = "DevTest";
    static IMPLEMENTATION_CATEGORY = "Implementation";
    static TASK_CATEGORIES = [Constants.BA_COMMUNICATION, Constants.CROSS_STREAM_COMMUNICATION, Constants.DEV_TEST, Constants.IMPLEMENTATION_CATEGORY];
    static LINK_TYPE_IMPLEMENTATION = "10300";
    static ISSUE_TYPE_STORY = "17";
    static ISSUE_TYPE_EPIC = "16";
    static ISSUE_TYPE_TASK = "15";
    static ISSUE_TYPE_DEV_TASK = "9";
    static DU_PROJECT_ID = "37307";
}

function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

class TmsApi {
    static TMS_URL = "https://tms.netcracker.com";
    static ISSUE_LINK_PREFIX = TmsApi.TMS_URL + `/browse/`;
    static REST_API_URL_PREFIX = TmsApi.TMS_URL + `/rest/api/latest`;

    static sendRequest(url, method = 'GET', body = null) {
        console.log(url, method, body);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                timeout: 5000,
                onerror: reject,
                ontimeout: reject,
                onload: resolve,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    // If a user agent is not passed - a POST request fails with 403 error
                    'User-Agent': 'Any',
                },
                data: body,
                url: url,
            });
        }).then(response => {
            if ([200, 201].indexOf(response.status) !== -1) {
                if (response.responseText == null) {
                    return {};
                }
                return JSON.parse(response.responseText);
            }
            throw new Error(response.status + ' ' + response.statusText + ' ' + response.responseText);
        });
    }

    static async getIssue(key, fields = ["issuelinks","timetracking","components","issuetype","labels","status"]) {
        return await TmsApi.sendRequest(`${TmsApi.REST_API_URL_PREFIX}/issue/${key}?fields=${fields.join(",")}`);
    }

    static async getIssues(keys, fields = ["timetracking", "components", "issuetype", "labels", "priority", "customfield_10200", "customfield_10201", "customfield_10006", "summary", "status", "issuelinks"]) {
        if (keys.length == 0) {
            return {issues: []};
        }
        return await TmsApi.sendRequest(`${TmsApi.REST_API_URL_PREFIX}/search?jql=issuekey IN (${keys.join(",")})&fields=${fields.join(",")}`);
    }

    static async getSubtasks(keys, fields = ["timetracking", "components", "issuetype", "labels", "status", "parent"]) {
        if (keys.length == 0) {
            return {issues: []};
        }
        return await TmsApi.sendRequest(`${TmsApi.REST_API_URL_PREFIX}/search?jql=parent IN (${keys.join(",")})&fields=${fields.join(",")}`);
    }

    static async createIssueLink(issue1, issue2, linkType) {
        const request = {
            type: {id: linkType},
            inwardIssue: {key: issue1},
            outwardIssue: {key: issue2}
        };
        await TmsApi.sendRequest(`${TmsApi.REST_API_URL_PREFIX}/issueLink`, "POST", JSON.stringify(request));
    }

    static async createDevStoryFromDesignStory(designStory, epicKey, assignee = null) {
        const request = {
            fields : {
                priority: {id: designStory.fields.priority.id},
                labels: [Constants.DEV_STORY],
                assignee: {name: assignee},
                components: [{id: designStory.fields.components[0].id}],
                customfield_10200: designStory.fields.customfield_10200, //external issue link
                customfield_10201: designStory.fields.customfield_10201, //external issue key
                issuetype: {id: Constants.ISSUE_TYPE_STORY},
                project: {id: Constants.DU_PROJECT_ID},
                customfield_10006: designStory.fields.customfield_10006, //Epic Link
                summary: designStory.fields.summary.replace("[BA]", "[DEV]")
            }
        };
        const issue_info = await TmsApi.sendRequest(`${TmsApi.REST_API_URL_PREFIX}/issue`, "POST", JSON.stringify(request));
        await TmsApi.createIssueLink(issue_info.key, designStory.key, Constants.LINK_TYPE_IMPLEMENTATION);
        await TmsApi.createIssueLink(issue_info.key, epicKey, Constants.LINK_TYPE_IMPLEMENTATION);
        return issue_info.key;
    }

    static async getRelatedStories(keys, fields = ["timetracking", "components", "issuetype", "labels", "priority", "customfield_10200", "customfield_10201", "customfield_10006", "summary", "status", "issuelinks"]) {
        if (keys.length == 0) {
            return {issues: []};
        }
        const keysStr = keys.join(",");
        return await TmsApi.sendRequest(`${TmsApi.REST_API_URL_PREFIX}/search?jql=(issue in linkedIssuesOf("issuekey in (${keysStr})", "is implemented by") or parent in (${keysStr})) and type = Story&fields=${fields.join(",")}`);
    }

    static getLinkToIssue(key) {
        return TmsApi.ISSUE_LINK_PREFIX + key;
    }
}

class TmsTask {
    #errors;
    #issueInfo;
    #component;
    #category;
    #overheadCategory;

    constructor(issueInfo) {
        this.#errors = [];
        this.#issueInfo = issueInfo;
        if (issueInfo.fields.components == null) {
            this.#errors.push({ issue: this.key, message: `Task ${issueInfo.key} should have 1 component. Actual amount = 0`});
        } else if (issueInfo.fields.components.length != 1) {
            this.#errors.push({ issue: this.key, message: `Task ${issueInfo.key} should have 1 component. Actual amount = ${issueInfo.fields.components.length}`});
        }
        if (issueInfo.fields.components == null || issueInfo.fields.components.length == 0) {
            this.#component = null;
        } else {
            this.#component = issueInfo.fields.components[0].name;
        }
        const categoryLabels = this.#issueInfo.fields.labels.filter(label => Constants.TASK_CATEGORIES.includes(label));
        if (categoryLabels.length > 1) {
            this.#errors.push({ issue: this.key, message: `Task ${issueInfo.key} should't have more then one task category. Actual amount = ${categoryLabels.length}`});
            this.#category = categoryLabels[0];
        } else if (categoryLabels.length == 1) {
            this.#category = categoryLabels[0];
        } else {
            this.#category = Constants.IMPLEMENTATION_CATEGORY;
        }
        const overheadCategoryLabels = this.#issueInfo.fields.labels.filter(label => Constants.OVERHEAD_CATEGORIES.includes(label));
        if (overheadCategoryLabels.length > 1) {
            this.#errors.push({ issue: this.key, message: `Task ${issueInfo.key} should't have more then one overhead category. Actual amount = ${categoryLabels.length}`});
            this.#overheadCategory = overheadCategoryLabels[0];
        } else if (overheadCategoryLabels.length == 1) {
            this.#overheadCategory = overheadCategoryLabels[0];
        } else {
            this.#overheadCategory = null;
        }
    }

    get errors() {
        return this.#errors;
    }

    get key() {
        return this.#issueInfo.key;
    }

    get component() {
        return this.#component;
    }

    get category() {
        return this.#category;
    }

    get overheadCategory() {
        return this.#overheadCategory;
    }

    get parent() {
        if (this.#issueInfo.fields.parent == null) {
            return null;
        } else {
            return this.#issueInfo.fields.parent.key;
        }
    }

    get originalEstimate() {
        if (this.#issueInfo.fields.timetracking == null || this.#issueInfo.fields.timetracking.originalEstimateSeconds == null) {
            return 0;
        } else {
            return this.#issueInfo.fields.timetracking.originalEstimateSeconds;
        }
    }

    get loggedTime() {
        if (this.#issueInfo.fields.timetracking == null || this.#issueInfo.fields.timetracking.timeSpentSeconds == null) {
            return 0;
        } else {
            return this.#issueInfo.fields.timetracking.timeSpentSeconds;
        }
    }

    get type() {
        return this.#issueInfo.fields.issuetype.id;
    }

}

class TmsStory {
    #errors;
    #stotyType;
    #issueInfo;
    #isDevStory;
    #isDesignStory;
    #component;
    #subtasks;
    #subtasksFilled;
    #timeTracking;
    #timeTrackingFilled;

    constructor(issueInfo) {
        this.#issueInfo = issueInfo;
        this.#isDevStory = this.hasLabel(Constants.DEV_STORY);
        this.#isDesignStory = this.hasLabel(Constants.DESIGN_STORY);
        this.#errors = [];
        this.#timeTrackingFilled = false;
        this.#subtasksFilled = false;
        if (issueInfo.fields.components == null) {
            this.#errors.push({ issue: this.key, message: `Story ${issueInfo.key} should have 1 component. Actual amount = 0`});
        } else if (issueInfo.fields.components.length != 1) {
            this.#errors.push({ issue: this.key, message: `Story ${issueInfo.key} should have 1 component. Actual amount = ${issueInfo.fields.components.length}`});
        }
        if (issueInfo.fields.components == null || issueInfo.fields.components.length == 0) {
            this.#component = null;
        } else {
            this.#component = issueInfo.fields.components[0].name;
        }
    }

    get errors() {
        return this.#errors;
    }

    get key() {
        return this.#issueInfo.key;
    }

    get epicKey() {
        return this.#issueInfo.fields.customfield_10006;
    }

    get isDevStory() {
        return this.#isDevStory;
    }

    get isDesignStory() {
        return this.#isDesignStory;
    }

    get component() {
        return this.#component;
    }

    get issueInfo() {//TODO avoid direct usage of json
        return this.#issueInfo;
    }

    get timeTracking() {
        if (this.#timeTrackingFilled) {
            return this.#timeTracking;
        } else {
            throw new Error(`Time tracking info for ${this.key} is not calculated yet`);
        }
    }

    get subtasks() {
        if (this.#subtasksFilled) {
            return this.#subtasks;
        } else {
            throw new Error(`Time subtasks for ${this.key} are not filled yet`);
        }
    }

    fillSubtasks(subtasks) {
        this.#subtasks = [];
        for (const taskInfo of subtasks) {
            const task = new TmsTask(taskInfo);
            if (task.parent != this.key) {
                continue;
            }
            this.#subtasks.push(task);
        }
        this.#subtasksFilled = true;
        if (!this.isDevStory) {
            this.#timeTrackingFilled = false;
            return;
        }
        this.#timeTracking = new TimeTracking();
        let originalEstimate = 0;
        for (const task of this.#subtasks) {
            if (task.type != Constants.ISSUE_TYPE_DEV_TASK && task.type != Constants.ISSUE_TYPE_TASK) {
                continue;
            }
            if (task.loggedTime > 0) {
                this.#timeTracking.logTime(task.category, task.loggedTime);
            }
            if (task.overheadCategory == null) {
                originalEstimate += task.originalEstimate;
            }
        }
        this.#timeTracking.originalEstimate = originalEstimate;
        this.#timeTrackingFilled = true;
    }

    get status() {
        return this.#issueInfo.fields.status.name;
    }

    hasLabel(label) {
        return this.#issueInfo.fields.labels.includes(label);
    }

    getAllErrors() {
        const errors = [... this.#errors];
        if (this.#subtasksFilled) {
            for (const subtask of this.#subtasks) {
                errors.push(...subtask.errors);
            }
        }
        return errors;
    }
}

class ComponentDetails {
    #devStoryExists;
    #designStoryExists;
    #devStory;
    #designStory;

    constructor() {
        this.#devStoryExists = false;
        this.#designStoryExists = false;
        this.#devStory = null;
        this.#designStory = null;
    }

    get devStoryExists() {
        return this.#devStoryExists;
    }

    get designStoryExists() {
        return this.#designStoryExists;
    }

    get devStory() {
        return this.#devStory;
    }

    set devStory(story) {
        if (this.#devStoryExists) {
            throw new Error("Dev story is already filled");
        }
        this.#devStoryExists = true;
        this.#devStory = story;
    }

    get designStory() {
        return this.#designStory;
    }

    set designStory(story) {
        if (this.#designStoryExists) {
            throw new Error("Design story is already filled");
        }
        this.#designStoryExists = true;
        this.#designStory = story;
    }

    setStory(story, type) {
        if (type == Constants.DEV_STORY) {
            this.devStory = story;
        } else if (type == Constants.DESIGN_STORY) {
            this.designStory = story;
        }
    }

    isStoryExists(type) {
        if (type == Constants.DEV_STORY) {
            return this.devStoryExists;
        } else if (type == Constants.DESIGN_STORY) {
            return this.designStoryExists;
        }
    }

}

class TimeTracking {
    #originalEstimate;
    #loggedTimeByCategory;
    constructor() {
        this.#originalEstimate = null;
        this.#loggedTimeByCategory = {};
    }

    get originalEstimate() {
        return this.#originalEstimate;
    }

    set originalEstimate(estimate) {
        if (estimate >= 0) {
            this.#originalEstimate = estimate;
        } else {
            throw new Error(`Original Estimate should be positive. Current value = ${estimate}`);
        }
    }

    getExistingCategories() {
        return Object.keys(this.#loggedTimeByCategory);
    }

    getLoggedTimeByCategory(category) {
        return this.#loggedTimeByCategory[category];
    }

    logTime(category, time) {
        if (time >= 0) {
            if (this.#loggedTimeByCategory[category] == null) {
                this.#loggedTimeByCategory[category] = 0;
            }
            this.#loggedTimeByCategory[category] += time;
        } else {
            throw new Error(`Logged time should be positive. Current value = ${time}`);
        }
    }

    get total() {
        let total = 0;
        for (const category of this.getExistingCategories()) {
            total += this.#loggedTimeByCategory[category];
        }
        return total;
    }
}

class TmsEpic {
    #errors;
    #issueInfo;
    #components;
    #componentsDetails;
    #componentsDetailsFilled;
    #linkedStoryKeys;
    constructor(issueInfo, relatedStories = null) {
        this.#issueInfo = issueInfo;
        this.#errors = [];
        this.#components = [];
        this.#componentsDetails = {};
        this.#componentsDetailsFilled = false;
        this.#linkedStoryKeys = [];
        if (issueInfo.fields.components != null) {
            for (const comp of issueInfo.fields.components) {
                this.#componentsDetails[comp.name] = new ComponentDetails();
                this.#components.push(comp.name);
            }
        }
        for (const link of issueInfo.fields.issuelinks) {
            if (link.type.id == Constants.LINK_TYPE_IMPLEMENTATION && link.inwardIssue != null && link.inwardIssue.fields.issuetype.id == Constants.ISSUE_TYPE_STORY) {
                this.#linkedStoryKeys.push(link.inwardIssue.key);
            }
        }
        if (relatedStories != null) {
            this.fillComponentsDetails(relatedStories);
        }
    }

    get errors() {
        return this.#errors;
    }

    get key() {
        return this.#issueInfo.key;
    }

    get components() {
        return this.#components.slice();
    }

    get componentsDetails() {
        if (!this.#componentsDetailsFilled) {
            throw new Error(`Components details for epic ${this.key} are not calculated yet`);
        }
        return this.#componentsDetails;//Need to clone object
    }

    isRelatedStory(story) {
        if (story.component == null) {
            return false;
        }
        if (story.epicKey == this.key) {
            return true;
        }
        return this.#linkedStoryKeys.includes(story.key);
    }

    fillComponentsDetails(relatedStories) {
        if (this.#componentsDetailsFilled) {
            throw new Error(`Components details for epic ${this.key} are already calculated`);
        }
        for (const story of relatedStories) {
            if (this.isRelatedStory(story)) {
                if (!this.#components.includes(story.component)) {
                    this.#componentsDetails[story.component] = new ComponentDetails();
                    this.#errors.push({issue: this.key, message: `Component ${story.component} of linked story ${story.key} is not added in epic`});
                }
                const componentDetails = this.#componentsDetails[story.component];
                if (story.isDevStory) {
                    if (componentDetails.devStoryExists) {
                        this.#errors.push({issue: this.key, message: `More than one dev story with component ${story.component} is linked to epic`});
                    } else {
                        componentDetails.devStory = story;
                    }
                }
                if (story.isDesignStory) {
                    if (componentDetails.designStoryExists) {
                        this.#errors.push({issue: this.key, message: `More than one design story with component ${story.component} is linked to epic`});
                    } else {
                        componentDetails.designStory = story;
                    }
                }
            }
        }
        this.#componentsDetailsFilled = true;
    }

    fillSubtasks(subtasks) {
        if (!this.#componentsDetailsFilled) {
            throw new Error(`Components details for epic ${this.key} are not calculated yet`);
        }
        for (const component of Object.keys(this.#componentsDetails)) {
            const componentDetails = this.#componentsDetails[component];
            if (componentDetails.devStoryExists) {
                componentDetails.devStory.fillSubtasks(subtasks);
            }
        }
    }

    getAllErrors() {
        const errors = [... this.#errors];
        if (this.#componentsDetailsFilled) {
            for (const component of Object.keys(this.#componentsDetails)) {
                const componentDetails = this.#componentsDetails[component];
                if (componentDetails.devStoryExists) {
                    errors.push(...componentDetails.devStory.getAllErrors());
                }
                if (componentDetails.designStoryExists) {
                    errors.push(...componentDetails.designStory.getAllErrors());
                }
            }
        }
        return errors;
    }
}