// ==UserScript==
// @name         MMS IAM Pull Request template
// @namespace    https://www.mongodb.com/
// @version      1.4
// @updateUrl    https://greasyfork.org/scripts/440137-mms-iam-pull-request-template/code/MMS%20IAM%20Pull%20Request%20template.user.js
// @description  A small script intended to apply a Cloud IAM team scoped Github PR template when creating new pull requests against the 10gen/mms repo
// @author       anbang.zhang@mongodb.com
// @match        https://github.com/10gen/mms/compare/*
// @icon         https://www.google.com/s2/favicons?domain=mongodb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440137/MMS%20IAM%20Pull%20Request%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/440137/MMS%20IAM%20Pull%20Request%20template.meta.js
// ==/UserScript==
// Happy Skunkworks! This a test comment for script autoupdating via TamperMonkey
// You should be automatically updated to version 1.3

/** Github base PR creation page element IDs **/
const PR_FORM_ELEMENT_ID = "new_pull_request";
const PR_TITLE_ELEMENT_ID = "pull_request_title";
const PR_BODY_ELEMENT_ID = "pull_request_body";

/** Regex **/
// matches CLOUDP-{any digits}
const CLOUD_JIRA_TICKET_REGEX = /CLOUDP-\d+/;
// matches CLOUDP-{any digits}:{any characters}
const PR_TITLE_REGEX = /CLOUDP-\d+:.*/;
// matches https://jira.mongodb.org/browse/CLOUDP-{any digits}
const CONTAINS_JIRA_URL_REGEX = /.*https:\/\/jira\.mongodb\.org\/browse\/CLOUDP-\d+.*/;

/** Custom UI elements **/
function createFillTemplateButton(text, onClick) {
    // https://www.mongodb.design/component/palette/example/
    const MONGO_GREEN_BASE = "#13AA52";
    const MONGO_GREEN_DARK_2 = "#116149";

    // Create button and disable default behavior (form submission) in favor of provided onclick
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = "Prefill PR Template";
    button.onclick = fillPrUsingTemplate;

    // Default styling
    button.style.display = "inline-block";
    button.style.color = "white";
    button.style.backgroundColor = MONGO_GREEN_BASE;
    button.style.border = "0.16em solid";
    button.style.borderRadius = "2em";
    button.style.borderColor = "white";
    button.style.padding = "0.3em 1.2em";
    button.style.margin = "1em 0em";
    button.style.textAlign = "center";
    button.style.fontSize = "1.12em";

    // Dynamic styling
    button.addEventListener("mouseenter", (e) => {
        button.style.backgroundColor = MONGO_GREEN_DARK_2;
    });

    button.addEventListener("mouseleave", (e) => {
        button.style.backgroundColor = MONGO_GREEN_BASE;
    });

    return button;
}

function createPrWarningElement(alertText, tooltipText) {
    // https://www.mongodb.design/component/palette/example/
    const MONGO_YELLOW_BASE = "#FFDD49";
    const MONGO_YELLOW_LIGHT_2 = "#FEF2C8";
    const MONGO_YELLOW_DARK_3 = "#543E07";

    const alert = document.createElement("div");

    // Default styling
    alert.style.display = "inline-block";
    alert.style.position = "relative"; // for anchoring the tooltip
    alert.style.color = MONGO_YELLOW_DARK_3;
    alert.style.backgroundColor = MONGO_YELLOW_LIGHT_2;
    alert.style.border = "0.05em solid";
    alert.style.borderRadius = "2em";
    alert.style.borderColor = MONGO_YELLOW_BASE;
    alert.style.padding = "0.3em 1.2em";
    alert.style.margin = "8px 8px";
    alert.style.textAlign = "center";
    alert.style.fontSize = ".87em";

    // Tooltip
    const tooltip = document.createElement("span");
    tooltip.innerHTML = `<a target="_blank" href="https://wiki.corp.mongodb.com/display/MMS/Cloud+Team+Code+Review+Guidelines">${tooltipText}</a>`;
    tooltip.style.display = "none"; // hide by default
    tooltip.style.zIndex = "10";
    tooltip.style.backgroundColor = "white";
    tooltip.style.color = "black";
    tooltip.style.border = "0.05em solid";
    tooltip.style.borderRadius = "8px";
    tooltip.style.borderColor = MONGO_YELLOW_BASE;
    tooltip.style.textAlign = "center";
    tooltip.style.position = "absolute";
    tooltip.style.padding = "12px";
    // center horizontally above the alert
    tooltip.style.left = "50%";
    tooltip.style.transform = "translateX(-50%)";
    tooltip.style.bottom = "100%";
    tooltip.style.width = "300px";
    tooltip.style.transition = ".3s opacity";

    alert.append(alertText);
    alert.append(tooltip);

    alert.addEventListener("mouseenter", (e) => {
        tooltip.style.display = "inline-block";
    });

    alert.addEventListener("mouseleave", (e) => {
        tooltip.style.display = "none";
    });

    return alert;
}

function createWarningAlertsContainer(...children) {
    const warningElementsContainer = document.createElement("div");
    warningElementsContainer.style.width = "100%";
    warningElementsContainer.style.display = "flex";
    warningElementsContainer.style.flexDirection = "row";
    warningElementsContainer.style.justifyContent = "flex-end";
    for (const child of children) {
        warningElementsContainer.appendChild(child);
    }
    return warningElementsContainer;
}

const PR_TITLE_INVALID_WARNING_ELEMENT = createPrWarningElement("Invalid PR Title", "PR Title must begin with a CLOUDP JIRA ticket ID, followed by a colon and space, then a description of your changes i.e. `CLOUDP-12345: Yay!`");
const PR_BODY_INVALID_WARNING_ELEMENT = createPrWarningElement("Invalid PR Body", "PR Body must contain a link to the relevant CLOUDP JIRA ticket's URL");

/** UI triggered functions **/
function generatePullRequestBodyMarkdown(jiraTicketUrl, prevTitle, prevBody) {
    const template =
`JIRA Ticket: ${jiraTicketUrl}

### Preflight Steps
* [ ] The PR title is of format '{TICKET_ID}: Description of changes', with the correct CLOUDP-XXXXX ticket as the TICKET_ID
* [ ] The link to the JIRA ticket above is correct
* [ ] I've reviewed my own code

### Description
* Hooray, my change is ready!

### QA Steps Taken
* Unit/Integ/Manual testing done
* Relevant screenshots, if applicable`

    let body = template;
    
    // If there exists previous input from the user, prepend it to the body such that no work is lost
    if (prevBody) {
        body = `Previous Body:\n${prevBody}\n\n` + body;
    }

    if (prevTitle) {
        body = `Previous Title:\n${prevTitle}\n\n` + body;
    }

    return body;
}

function fillPrUsingTemplate() {
    
    // Try to yoink the CLOUDP ticket id from the branch name, derived from the current URL
    // If none found, default to a '{TICKET_ID}' string
    const href = window.location.href;
    const hrefComponents = href.split("/");
    const branchName = hrefComponents[hrefComponents.length - 1].split("?")[0];
    const isBranchNameJiraTicket = CLOUD_JIRA_TICKET_REGEX.test(branchName);
    const jiraTicketId = isBranchNameJiraTicket ? branchName : "{TICKET_ID}";
    
    // Set PR title
    const prTitleInput = document.getElementById(PR_TITLE_ELEMENT_ID);
    const prevTitle = prTitleInput.value;

    const prefilledPrTitle = `${jiraTicketId}: {Description of Changes}`;
    prTitleInput.value = prefilledPrTitle;

    // Set PR Body
    const jiraTicketUrl = `https://jira.mongodb.org/browse/${jiraTicketId}`;
    const prBodyTextArea = document.getElementById(PR_BODY_ELEMENT_ID);
    const prevBody = prBodyTextArea.value;

    prBodyTextArea.value = generatePullRequestBodyMarkdown(jiraTicketUrl, prevTitle, prevBody);
    
    // Validate results of prefill
    validatePrTitle(prTitleInput.value);
    validatePrBody(prBodyTextArea.value);
}

function validatePrTitle(newTitle) {
    if (!PR_TITLE_REGEX.test(newTitle)) {
        PR_TITLE_INVALID_WARNING_ELEMENT.style.display = "inline-block";
    } else {
        PR_TITLE_INVALID_WARNING_ELEMENT.style.display = "none";
    }
}


function validatePrBody(newBody) {
    if (!CONTAINS_JIRA_URL_REGEX.test(newBody)) {
        PR_BODY_INVALID_WARNING_ELEMENT.style.display = "inline-block";
    } else {
        PR_BODY_INVALID_WARNING_ELEMENT.style.display = "none";
    }
}

// "main" immediately executed function
(function() {
    'use strict';
    // Register listeners for PR title and body input elements
    const prTitleInput = document.getElementById(PR_TITLE_ELEMENT_ID);
    const prBodyTextArea = document.getElementById(PR_BODY_ELEMENT_ID);

    prTitleInput.addEventListener('input', (event) => {
        validatePrTitle(event.target.value);
    });
    prTitleInput.addEventListener('change', (event) => {
        validatePrTitle(event.target.value);
    });

    prBodyTextArea.addEventListener('input', (event) => {
        validatePrBody(event.target.value);
    });

    prBodyTextArea.addEventListener('change', (event) => {
        validatePrBody(event.target.value);
    });

    // Inject custom elements into the page
    const formElement = document.getElementById(PR_FORM_ELEMENT_ID);
    formElement.insertBefore(createFillTemplateButton(), formElement.childNodes[0]);

    const tabContainerElement = formElement.getElementsByTagName("tab-container")[0];
    tabContainerElement.insertAdjacentElement("afterend", createWarningAlertsContainer(PR_TITLE_INVALID_WARNING_ELEMENT, PR_BODY_INVALID_WARNING_ELEMENT));
})();