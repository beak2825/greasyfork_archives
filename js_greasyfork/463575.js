// ==UserScript==
// @name         Twitter Thread Reader
// @namespace    https://github.com/WhyWhatHow/
// @homepage     https://github.com/WhyWhatHow/powertoys4browser
// @supportURL   https://github.com/WhyWhatHow/powertoys4browser/issues
// @version      1.9
// @description  when we read Twitter|X thread, it's sucks. so I try to generate twitter thread reader in one single page, so i can easily read and share. Anyway, it's easy to read twitter's thread.
// @author       whywhathow
// @match        https://x.com/
// @match        https://x.com/*/status/*
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463575/Twitter%20Thread%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/463575/Twitter%20Thread%20Reader.meta.js
// ==/UserScript==
/***
 * url checking ,if true, means twitter-thread, else ,means twitter.com
 * @param str
 * @returns {boolean}
 */
function checkURL(str) {
    const twitter = "https://x.com/home";
    return twitter === str ? false : true;
}

function getThreadID(url) {
    const arr = url.split("/");
    var threadId = arr[arr.length - 1];
    console.log("ThreadId:-> {}", threadId);
    return threadId;
}

function redirect(url) {
    if (!url) {
        showMessage("error", CONFIG.MESSAGES.ERROR_INVALID_URL);
        return;
    }
    console.log("Redirecting to:", url);
    GM_openInTab(url);

}


// actually doing something
function running() {
    // 1. get url and twitter's thread id.
    let currentUrl = window.location.href;
    if (!checkURL(currentUrl)) {
        alert("not home page!!!")
        // not thread page, don't anything.
        return;
    }
    // 2. get thread id
    var threadId = getThreadID(currentUrl);
    // 3. gengerate  thread page.
    // https://twitter-thread.com/api/unroll-thread?id=1643514082681602048
    // send GET Request
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://twitter-thread.com/api/unroll-thread?id=" + threadId,
        headers: {
            "User-Agent": "Mozilla/5.0",
        },
        onload: function (response) {
            //  go to twitter-thread.com to read.
            var redirectUrl = "https://twitter-thread.com/t/" + threadId;
            showMessage("success", "--- enjoy ^_^ ---")
            redirect(redirectUrl);
            // console.log(response.responseText);
        },
        onerror: function (error) {
            showMessage("error", "Load page error, please try again!")
            console.error(error);
        }
    });

}

// Checking if the current focus is in a Twitter input field
function isInTwitterInput() {
    const activeElement = document.activeElement;
    console.log(activeElement);

    // Check for standard input elements
    if (activeElement && (activeElement.nodeName === "INPUT" || activeElement.nodeName === "TEXTAREA")) {
        return true;
    }

    // Check for contenteditable divs and Twitter's custom textbox
    if (activeElement && activeElement.nodeName === "DIV") {
        // Check for role="textbox" (Twitter's custom input)
        if (activeElement.getAttribute("role") === "textbox") {
            return true;
        }
        // Check for contenteditable divs
        if (activeElement.getAttribute("contenteditable") === "true") {
            return true;
        }
        // Check for search box specific classes or attributes
        if (activeElement.getAttribute("data-testid")?.includes("search") ||
            activeElement.className.toLowerCase().includes("search")) {
            return true;
        }
    }

    return false;
}

/**
 * create a notification message component
 * @param type :
 * @returns {HTMLDivElement}
 */
function createMessageElement(type) {
    const messageElement = document.createElement('div');
    messageElement.style.position = 'fixed';
    messageElement.style.top = '20px';
    messageElement.style.right = '20px';
    messageElement.style.zIndex = '9999';
    messageElement.style.width = '350px';
    messageElement.style.maxWidth = '80%';
    messageElement.style.padding = '15px 50px 15px 15px';
    messageElement.style.color = '#fff';
    messageElement.style.fontSize = '14px';
    messageElement.style.lineHeight = '1.5';
    messageElement.style.borderRadius = '4px';
    messageElement.style.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, 0.1)';
    messageElement.style.transition = 'opacity .3s, transform .3s';
    // messageElement.style.opacity = '0';
    messageElement.style.transform = 'translate3d(0, -50%, 0)';
    messageElement.style.pointerEvents = 'none';
    // sett message backgroundColor
    switch (type) {
        case 'success':
            messageElement.style.backgroundColor = '#67C23A';
            break;
        case 'info':
            messageElement.style.backgroundColor = '#909399';
            break;
        case 'error':
            messageElement.style.backgroundColor = '#F56C6C';
            break;
        default:
            break;
    }
    messageElement.style.color = '#fff';
    messageElement.style.fontWeight = 'bold';

    return messageElement;
}


function showMessage(type = "success", message, timeout = 1000) {
    const container = createMessageElement(type);
    const content = document.createElement('p');
    content.style.margin = '0';
    content.innerText = message;
    container.appendChild(content);

    document.body.appendChild(container);
    setTimeout(() => {
        container.style.opacity = '0';
        container.style.transform = 'translate3d(0, -50%, 0)';
        container.style.pointerEvents = 'none';
        container.remove();
    }, timeout);
}

/**
 * create Icon ,choose Emoji (easy to create, don't need to care the fucking unicode),not font-awesome(too heavy and not suitable for unicode )
 */
function createIcon(elementType = "span", fontSize = "1.5em", fontWeight = "900", code = "&#129412;") {
    var icon = document.createElement(elementType);
    icon.style.fontWeight = fontWeight;
    icon.style.fontSize = fontSize; // fa-3x
    icon.innerHTML = code;
    return icon;
}

// icon left click
/**
 * click to call running method
 */
function createIconDiv() {
    // Create the initial div element
    const clickDiv = document.createElement('div');
    clickDiv.style.position = 'fixed';
    clickDiv.style.top = '30%';
    clickDiv.style.right = '1%';
    clickDiv.style.width = '30px';
    clickDiv.style.height = '30px';
    clickDiv.style.zIndex = "9999";
    clickDiv.style.cursor = 'pointer';
    //  add icon
    clickDiv.appendChild(createIcon())
    clickDiv.addEventListener('mouseenter', function () {
        clickDiv.style.backgroundColor = 'rgba(255, 68, 0, 0.7)';
        // clickDiv.title = 'Hello, World!';
        // console.log("mouseenter--------------------");
    });
    clickDiv.addEventListener('mouseleave', function () {
        clickDiv.style.backgroundColor = 'rgba(255, 68, 0, 0.5)';
        // clickDiv.title = '';
        // console.log("mouseleave ----------------------")
    });
    // left click
    clickDiv.addEventListener('click', function () {
        // console.log("-----------left click-----------------")
        running();
    });

    document.body.appendChild(clickDiv);
}

// main method
(function () {
    'use strict';
    GM_registerMenuCommand('read thread in another page', running, 'f');
    createIconDiv();
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'f') {
            return;
        }
        // If the f key is pressed and the event target is not an input field
        else if (event.key === 'f' && !isInTwitterInput()) {
            console.log('f------------------------------------f');
            // alert("just wait")
            showMessage("info", "Loading Page...", 1000)
            running()
        }
    }, true);
})();

