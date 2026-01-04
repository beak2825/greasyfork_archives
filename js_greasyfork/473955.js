// ==UserScript==
// @name         1_interpals
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Message everyone in the userNames list
// @author       Alex R
// @license      none
// @match        https://interpals.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=interpals.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473955/1_interpals.user.js
// @updateURL https://update.greasyfork.org/scripts/473955/1_interpals.meta.js
// ==/UserScript==

/*
what might go wrong:
time format inside the message: Aug, Dec, etc..., general format
classic view
restrictions on message access
*/

// list of usernames to send messages to
const userNames = ["DmitriyTheTrue"];
const timeBetweenMessagesMinutes = 2;
const databaseName = 'Interpals Script DB v1';
const logName = "Interpals Script error log";

const monthNames = {
    'Jan': 0,
    'Feb': 1,
    'Mar': 2,
    'Apr': 3,
    'May': 4,
    'Jun': 5,
    'Jul': 6,
    'Aug': 7,
    'Sep': 8,
    'Oct': 9,
    'Nov': 10,
    'Dec': 11
};

const EnglishMessages = [
    "message 1",
    "message 2",
    "message 3",
    "message 4",
]
const FrenchMessages = [
    "french message 1",
    "french message 2",
    "french message 3",
    "french message 4",
]

// log script error data to localStorage
function logErrorToLocalStorage(errorData, logName) {
    try {
        console.error(errorData.message);
        errorData.timestamp = new Date().toISOString();
        const existingErrors = JSON.parse(localStorage.getItem(logName)) || [];
        existingErrors.push(errorData);
        localStorage.setItem(logName, JSON.stringify(existingErrors));
    } catch (error) {
        console.error("Error logging to localStorage:", error);
    }
}
// function template

// function () {
//     try {

//     } catch (error) {
//         logErrorToLocalStorage({ message: error, functionName: default }, logName);
//     }
// }

// get all threads
function MessagesGetThreadsData() {
    try {
        const threads = {};
        document.querySelectorAll(`[id^="thread_"]`).forEach(thread => {
            // {threadId: username}
            // threads[thread.querySelector(".tui_username").textContent.trim().replace(/,.*/, "")] = thread.id.match(/\d+/)[0];
            threads[thread.id.match(/\d+/)[0]] = thread.querySelector(".tui_username").textContent.trim().replace(/,.*/, "");

        });
        return threads;
    } catch (error) {
        logErrorToLocalStorage({ message: error, functionName: getThreadsData }, logName);
    }
}

// const relevantThreads = Object.keys(getThreadsData()).filter(userName => { return userNames.includes(userName) });

function getPageMsgLog(htmlData) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlData, 'text/html');
        const allMsgDivs = doc.querySelectorAll("#conversation  div.pm_msg");
        const arr = [];
        for (const msgDiv of allMsgDivs) {
            const msgId = msgDiv.id.match(/\d+/)[0];
            const userName = msgDiv.querySelector(".msg_user").textContent.trim();
            const time = msgDiv.querySelector(".pm_time").textContent.trim();
            const msgContent = msgDiv.querySelector(".msg_body").textContent;
            const byScriptUser = msgDiv.querySelector(".msg_buttons_placeholder") !== null;
            arr.push({
                msgId: msgId,
                userName: userName,
                msgContent: msgContent,
                time: time,
                byScriptUser: byScriptUser
            });
        }
        return arr;
    } catch (error) {
        logErrorToLocalStorage({ message: error, functionName: populateMsgLog }, logName);
    }
}

function getAllMessages(threadId, page_i = 1, msgLog = {}) {
    return new Promise((resolve, reject) => {
        try {
            fetch(`https://interpals.net/pm.php?thread_id=${threadId}&page=${page_i}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(htmlData => {
                    const arr = getPageMsgLog(htmlData);
                    if (page_i > 1) {
                        if (arr[0] === undefined) {
                            resolve(msgLog);
                        }
                        if (arr[0].msgId === msgLog[page_i - 1][0].msgId) {
                            resolve(msgLog);
                        } else {
                            msgLog[page_i] = arr;
                            resolve(getAllMessages(threadId, page_i + 1, msgLog));
                        }
                    } else {
                        msgLog[page_i] = arr;
                        resolve(getAllMessages(threadId, page_i + 1, msgLog));
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    reject(error);
                });

        } catch (error) {
            logErrorToLocalStorage({ message: error, functionName: 'getAllMessages' }, logName);
            reject(error);
        }
    });
}


function timeToDateObject(timeString) {
    try {
        const regex = /\d+/g;
        let match;
        const matches = [];
        while ((match = regex.exec(timeString)) !== null) {
            matches.push(match[0]);
        }
        let foundMonth;
        for (const month of Object.keys(monthNames)) {
            if (timeString.includes(month)) foundMonth = monthNames[month];
        }
        const currentYear = "20" + matches[1];
        const month = foundMonth;
        const day = matches[0];
        const hour = matches[2];
        const minutes = matches[3];
        const seconds = 0;
        var manualDate = new Date(currentYear, month, day, hour, minutes, seconds);
        return manualDate;
    } catch (error) {
        logErrorToLocalStorage({ message: error, functionName: timeToDateObject }, logName);
    }
}

function sendMessage(threadId, messageText) {
    const encodedMessage = encodeURIComponent(messageText);
    const requestBody = `action=send_message&thread=${threadId}&message=${encodedMessage}`;
    fetch("https://interpals.net/pm.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: requestBody,
        })
        // .then(response => response.json())
        // .then(data => {
        //     // Handle the response data here
        // })
        .catch(error => {
            console.error(error);
        });
}

function getUserData(userName) {
    return new Promise((resolve, reject) => {
        fetch(`https://interpals.net/${userName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(htmlData => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlData, 'text/html');
                const language = doc.querySelector(".prLangName").textContent.trim();
                const messageLink = doc.querySelector("#prof-action-links > a:nth-child(1)").href;
                fetch(messageLink).then(response => {
                    if (response.ok) {
                        resolve({ language: language, threadId: response.url.match(/\d+/)[0] });
                    }
                })
            })
            .catch(error => {
                // Handle errors that may occur during the fetch
                logErrorToLocalStorage({ message: error, functionName: getUserData }, logName);
                reject(error);
            });
    });
};




function refresh() {
    // getAllKeysFromStore().then( for key in keys -> get scheduled object: thread id, message, time)
}

function getAllUsernamesData(userNames, i = 0, users = []) {
    return new Promise((resolve, reject) => {
        if (i >= userNames.length) {
            resolve(users);
        } else {
            getUserData(userNames[i])
                .then(data => {
                    users.push(data);
                    return resolve(getAllUsernamesData(userNames, i + 1, users));
                })
                .catch(error => {
                    // Handle errors that may occur during the fetch
                    logErrorToLocalStorage({ message: error, functionName: getAllUsernamesData }, logName);
                    reject(error);
                });
        }
    });
}


function main() {
    getAllUsernamesData(userNames).then(users => {
        console.log("users", users);
        for (const user of users) {
            getAllMessages(user.threadId).then(data => {
                console.log(data);
                let messageCount;
                if (Object.keys(data) === 0) {
                    messageCount = 0;
                } else {
                    const scriptUserMsgs = data[1].filter(messageObject => { return messageObject.byScriptUser });
                    messageCount = scriptUserMsgs.length;
                }
                if (messageCount > 3) return;
                let list;
                if (data.language === "French") list = FrenchMessages;
                else list = EnglishMessages;
                const timeDifference = (new Date() - timeToDateObject(data[1][0].time)) / 60000;
                if (timeDifference > timeBetweenMessagesMinutes) {
                    sendMessage(user.threadId, list[messageCount]);
                }
            });
        }
    });
};
let triggerClicked = false;
document.querySelector("#tn_cont").insertAdjacentHTML("beforeend", `<button id="script1_trigger"> Trigger Script</button>`);
document.querySelector("#script1_trigger").addEventListener("click", event => {
    triggerClicked = !triggerClicked;
    if (!triggerClicked) {
        alert("Script already triggered, automatsic messaging is active. In case of any issues please refresh the page and message the script author.");
        return;
    }
    document.querySelector("#script1_trigger").innerHTML = "Script triggered!";
    main();
    setInterval(main, 60000);
})