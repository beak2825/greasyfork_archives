// ==UserScript==
// @name         Lazy Banana 1.0
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Automate (PR -> Productive (Message + Status) -> Slack)
// @author       Ahmed Ennab
// @match        https://dev.azure.com/*
// @icon         https://www.coldbanana.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/477109/Lazy%20Banana%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/477109/Lazy%20Banana%2010.meta.js
// ==/UserScript==

var $ = window.jQuery;

//API KEYS - START (place your keys here)
const PRODUCTIVE_API_TOKEN = "put-your-key-here";
const PRODUCTIVE_API_ORG = "15997";
const SLACK_API_OAUTH = "put-token-here"
//API KEYS - END

//CONSTANTS - START (no need to change anything here if you don't want to)
//current variables:
//{PR_LINK} - the link to the PR
//{DEPT} - the department selected from the dropdown
//{COMMIT_MESSAGE} - the commit message of the PR
//{REPO_NAME} - the name of the repo
const PRODUCTIVE_MESSAGE_TO_SEND = "{PR_LINK}";
const SLACK_MESSAGE_TO_SEND = "{DEPT} - {REPO_NAME} - {COMMIT_MESSAGE}\n{PR_LINK}";
const SLACK_CHANNEL_ID = "C05PB7QA15L" // 'pull-requests'   
const NEW_STATUS_VALUE = "65711"; // 'in PR'
const DEPARTMENTS = ["FED", "BED", "FED & BED"]
const MATCHING_REPOS = [{"Uniwebsite Flipside": "Unilabs"}]
//CONSTANTS - END

//API ENDPOINTS - START
const PRODUCITVE_API_BASEURL = "https://api.productive.io/api/v2";
const SLACK_API_BASEURL = "https://slack.com/api/";
//API ENDPOINTS - END

const productiveIdRegex = /tasks?\/(\d+)/g

function productiveHeaders() {
    return {
        "Content-Type": "application/vnd.api+json",
        "X-Auth-Token": PRODUCTIVE_API_TOKEN,
        "X-Organization-Id": PRODUCTIVE_API_ORG
    }
}

function matchRepoName(repoName) {
    const matchingRepo = MATCHING_REPOS.find((repo) => {
        const key = Object.keys(repo)[0];
        return key.toLowerCase() === repoName.toLowerCase();
    });

    if (matchingRepo) {
        return matchingRepo[Object.keys(matchingRepo)[0]];
    }

    return repoName;
}

function createMessage(message, prLink, dept, commitMessage, repoName) {
    return message.replace("{DEPT}", dept)
    .replace("{COMMIT_MESSAGE}", commitMessage)
    .replace("{REPO_NAME}", repoName)
}

function createProductiveMessage(taskId, message) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: `${PRODUCITVE_API_BASEURL}/comments`,
            headers: productiveHeaders(),
            data: JSON.stringify({
                "data": {
                    "attributes": {
                        "commentable_type": "task",
                        "body": `<div>${message}</div>`
                    },
                    "relationships": {
                        "task": {
                            "data": {
                                "type": "tasks",
                                "id": taskId
                            }
                        }
                    },
                    "type": "comments"
                }
            }),
            onload: function(_response) {
                if (!_response.ok && _response.status != 201)  {
                    reject({
                        error: `Failed to create message: ${_response.responseText}}`
                    });
                }
                const response = JSON.parse(_response.responseText);
                resolve({
                    commentId: response.data.id
                });
            },
            onerror: function(_response) {
                reject({
                    error: `Failed to create message: ${_response.responseText}}}}`
                });
            }
        });
    });
}

function updateTask(taskId, commentId, statusId) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "PATCH",
            url: `${PRODUCITVE_API_BASEURL}/tasks/${taskId}`,
            headers: productiveHeaders(),
            data: JSON.stringify({
                "data": {
                    "id": taskId,
                    "relationships": {
                        "last_comment": {
                            "data": {
                                "type": "comments",
                                "id": commentId
                            }
                        },
                        "workflow_status": {
                            "data": {
                                "type": "workflow-statuses",
                                "id": statusId
                            }
                        }
                    },
                    "type": "tasks"
                }
            }),
            onload: function(_response) {
                if (_response.status !== 200)  {
                    reject({
                        error: `Failed to update task: ${_response.responseText}}`
                    });
                }
                resolve();
            },
            onerror: function(_response) {
                reject({
                    error: `Failed to update task: ${_response.responseText}}`
                });
            }
        });
    })
}

function sendSlackMessage(channelId, message) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: `${SLACK_API_BASEURL}/chat.postMessage`,
            headers: {
                "Authorization": `Bearer ${SLACK_API_OAUTH}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "channel": channelId,
                "text": message
            }),
            onload: function(_response) {
                if (_response.status !== 200) {
                    reject({
                        error: `Failed to send slack message: ${_response.responseText}}`
                    });
                }
                resolve();
            },
            onerror: function(_response) {
                reject({
                    error: `Failed to send slack message: ${_response.responseText}}`
                });
            }
        });
    });
}


function setInputsAsSending() {
    document.getElementById('dept-select').disabled = true;
    var messageButton = document.getElementById('send-message-btn');
    messageButton.disabled = true;
    messageButton.textContent = "Sending Message...";
}

function setInputsAsDone(message, error = false) {
    document.getElementById('dept-select').remove();
    var messageButton = document.getElementById('send-message-btn');
    messageButton.disabled = true;
    messageButton.textContent = message;
}

function setInputsAsEnabled() {
    document.getElementById('dept-select').disabled = false;
    var messageButton = document.getElementById('send-message-btn');
    messageButton.disabled = false;
    messageButton.textContent = "Send Message";
}

function initLazyBanana(targetElement, productiveIds, commitMessage, repoName) {
    if (document.querySelector('#lazy-banana-container')) return;

    const container = document.createElement('div');
    container.style.marginRight = "10px";
    container.style.border = "3px solid #e6c300";
    container.style.borderRadius = "10px";
    container.style.padding = "10px";
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.gap = "20px";
    container.id = "lazy-banana-container";

    const img = document.createElement('img');
    img.src = "https://www.coldbanana.com/favicon.ico";
    img.style.height = "31px";
    img.style.width = "50px";

    const select = document.createElement('select');
    select.style.paddingInline = "17px";
    select.id = "dept-select";

    DEPARTMENTS.forEach((dept) => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        select.appendChild(option);
    });

    const button = document.createElement('button');
    button.className = 'bolt-split-button-main bolt-button enabled bolt-focus-treatment';
    button.textContent = 'Send Message';
    button.id = 'send-message-btn';
    
    button.addEventListener('click', async function() {
        try {
            setInputsAsSending();
            const dept = document.getElementById('dept-select').value;
            const prLink = window.location.href.split("?")[0];
            const slackMessage =
             createMessage(SLACK_MESSAGE_TO_SEND, prLink, dept, commitMessage, repoName)
             .replace("{PR_LINK}", prLink);

            const productiveMessage =
             createMessage(PRODUCTIVE_MESSAGE_TO_SEND, prLink, dept, commitMessage, repoName)
             .replace("{PR_LINK}", `<a href="${prLink}">${prLink}</a>`)
             
            productiveIds.forEach(async function(id) {
                const comment = await createProductiveMessage(id, productiveMessage);
                await updateTask(id, comment.commentId, NEW_STATUS_VALUE);
            })
            await sendSlackMessage(SLACK_CHANNEL_ID, slackMessage);
            setInputsAsDone("Message Sent!");
        } catch (error) {
            console.log(error)
            setInputsAsDone("Error Sending Message", true)
        }
     })

    container.appendChild(img);
    container.appendChild(select);
    container.appendChild(button);

    targetElement.parentElement.insertBefore(container, targetElement);
}

waitForKeyElements(".repos-pr-description-card", function(jNode) {
    var observer = new MutationObserver(_=> {
        const text = jNode.text();
        if (text.length > 15) {
            const _productiveIds = Array.from(text.matchAll(productiveIdRegex), x => x[1]);
            const productiveIds = [...new Set(_productiveIds)]

            const targetElement = document.querySelector('.repos-pr-header-vote-button');
            const commitMessage = document.querySelector('input[aria-label="Pull request title"]');
            const repoName = document.querySelector('.repository-selector');

            if (targetElement && targetElement && repoName) {
                initLazyBanana(targetElement, productiveIds, commitMessage.value, matchRepoName(repoName.innerText));
            }
            observer.disconnect();
        }
    });


    observer.observe(jNode[0], {
        childList: true,
        subtree: true,
        characterData: true
    });

    return true;
}, true);