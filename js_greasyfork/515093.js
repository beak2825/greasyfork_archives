// ==UserScript==
// @name         Auto Read bee
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Linuxdo auto read
// @author       bee
// @match        https://meta.discourse.org/*
// @match        https://linux.do/*
// @match        https://meta.appinn.net/*
// @match        https://community.openai.com/
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=linux.do
// @downloadURL https://update.greasyfork.org/scripts/515093/Auto%20Read%20bee.user.js
// @updateURL https://update.greasyfork.org/scripts/515093/Auto%20Read%20bee.meta.js
// ==/UserScript==

const readSuggestPost = false;
const postCommentsCount = 200; // filter post under this comments, over this will PASS
const BASE_URL = `https://${window.location.hostname}`;
const refreshRate = {
    normal: localStorage.getItem("refreshRateNormal") || 2400,
    blueDot: localStorage.getItem("refreshRateBlueDot") || 300,
};
/**
 * This function set Floor infos value, return how much post been read.
 * @param {boolean} refresh - if true, reset all values
 * @returns {Object} - Returns an object with the result of the operation and the number of posts read.
 */
let floorStatus = {
    startFloor: 0,
    endFloor: 0,
    lastStartFloor: 0,
    lastEndFloor: 0,
    readCounter: parseInt(localStorage.getItem("readCounter") || "0", 10),
    failCounter: 0,
    rebootUrl: null,
};

let directWaitCounter = 0;
let readInterval;
let waitNextRefresh = 0;

function autoRunStart(singleTopic = false) {

    let finalRate;
    if (localStorage.getItem("blueDotMode") === "true") {
        finalRate = localStorage.getItem("refreshRateBlueDot") || refreshRate.blueDot;
    } else {
        finalRate = localStorage.getItem("refreshRateNormal") || refreshRate.normal;
        if (finalRate < 2000) {
            finalRate += 2000;
        }
    }
    readInterval = setInterval(async () => {
        if ((!singleTopic && check_read_limit()) || !waitReady()) {
            return;
        }
        let errorElement = document.querySelector(".page-not-found");
        if (errorElement) {
            addDebugTextarea("[WARN] Page not found");
            await directNextPost();
            return;
        }
        let retryElement = document.querySelector(".btn.btn-icon-text.btn-primary.topic-retry");
        let retryElement2 = document.querySelector(".error-page");
        if (retryElement) {
            retryElement.click();
            return;
        }
        if (retryElement2) {
            document.querySelector(".btn.btn-icon-text.btn-primary").click();
        }
        if (floorStatus.rebootUrl) {
            gotoUrl(floorStatus.rebootUrl);
            floorStatus.rebootUrl = null;
            return;
        }
        if (window.location.href.includes("/t/topic/")) {
            const isNew = isNewPost();
            if (isNew) {
                addDebugTextarea("[INFO] New post");
                discourseDo("lastTimeReadProcess");
                setFloor(true);
            }
            if (localStorage.getItem("blueDotMode") === "false") {
                checkLastRead();
            }
            setBtnText_readToday();
            const existFloor = setFloor();
            // no article found
            if (existFloor.result === "fail" || existFloor.result === "EOF") {
                if (singleTopic) {
                    document.getElementById("btnAutoRead").click();
                    return;
                }
                await directNextPost();
                addDebugTextarea("[INFO] Direct post...");
                return;
            }
            if (existFloor.result === "noBlueDot") {
                scrollIntoBee(existFloor.targetElement);
                return;
            }
            let failRetry = localStorage.getItem("reloadWaitTime") || 25;
            if (floorStatus.failCounter < (failRetry / finalRate) * 500 && existFloor.result === "success" && !isInViewport(existFloor.targetElement)) {
                scrollIntoBee(existFloor.targetElement);
                return;
            }
            if (floorStatus.failCounter < (failRetry / finalRate) * 500 && existFloor.result === "success") {
                addDebugTextarea(`[INFO] wait for blue dot #${existFloor.targetElement.id}...`);
                return;
            }

            if (floorStatus.failCounter < (failRetry / finalRate) * 1000 && existFloor.result === "success") {
                /*addDebugTextarea("[INFO] +800...");
                        window.scrollBy(0, 800);*/
                addDebugTextarea("[INFO] wait for blue dot...50%...");
                return;
            }
            if (floorStatus.failCounter >= (failRetry / finalRate) * 1000 && existFloor.result === "success") {
                // refresh
                addDebugTextarea("[INFO] blue dot stuck, refresh...");
                floorStatus.failCounter = 0;
                //window.location.reload();
                floorStatus.rebootUrl = window.location.href;
                gotoUrl(BASE_URL);
            }

            //await directNextPost();
            return;
        }
        // not in topic page
        if (singleTopic) {
            document.getElementById("btnAutoRead").click();
            return;
        }
        await directNextPost();
    }, finalRate);
}

function setFloor(refresh = false) {
    if (refresh) {
        floorStatus = {
            startFloor: 0,
            endFloor: 0,
            lastStartFloor: 0,
            lastEndFloor: 0,
            readCounter: parseInt(localStorage.getItem("readCounter") || "0", 10),
            failCounter: 0,
        };
        return {result: "refreshed"};
    }

    let element_floor = document.querySelectorAll(".boxed.onscreen-post");

    if (!element_floor) {
        return {result: "fail"};
    }
    // Find which element.id === post_${postFloor}
    let targetElement = null;
    let secondOutOfView = false;
    for (let counterTemp = 0; element_floor.length > counterTemp; counterTemp++) {
        // if blueDotMode is true, find the first blue dot
        if (localStorage.getItem("blueDotMode") === "true" && element_floor[counterTemp].querySelector(".read-state:not(.read)")) {
            targetElement = element_floor[counterTemp];
            //addDebugTextarea(`found => #${element_floor[counterTemp].id}`);
            break;
        }
        if (secondOutOfView === true && localStorage.getItem("blueDotMode") === "false" && isInViewport(element_floor[counterTemp]) === false) {
            targetElement = element_floor[counterTemp];
            break;
        }
        if (localStorage.getItem("blueDotMode") === "false" && isInViewport(element_floor[counterTemp]) === true) {
            secondOutOfView = true;
        }
    }
    let floorNunsFromBar = document
        .querySelector(".timeline-replies")
        .textContent.trim()
        .split(" / ");
    if (floorNunsFromBar &&
        (parseInt(floorNunsFromBar[1]) - parseInt(floorNunsFromBar[0]) < 5) &&
        targetElement === null) {
        return {result: "EOF"};
    }
    if (targetElement === null) {
        return {
            result: "noBlueDot", targetElement: element_floor[element_floor.length - 1],
        };
    }

    floorStatus.lastStartFloor = floorStatus.startFloor;
    floorStatus.lastEndFloor = floorStatus.endFloor;
    floorStatus.startFloor = parseInt(targetElement.id.replace("post_", ""));
    floorStatus.endFloor = parseInt(element_floor[element_floor.length - 1].id.replace("post_", ""));
    // get readCounter from storage
    floorStatus.readCounter = parseInt(localStorage.getItem("readCounter") || "0", 10);
    floorStatus.readCounter += floorStatus.startFloor - floorStatus.lastStartFloor > 10 ? 0 : floorStatus.startFloor - floorStatus.lastStartFloor;
    localStorage.setItem("readCounter", floorStatus.readCounter.toString());
    if (floorStatus.startFloor - floorStatus.lastStartFloor === 0) {
        floorStatus.failCounter++;
    } else {
        floorStatus.failCounter = 0;
    }
    return {
        result: "success", targetElement: targetElement, readFloor: floorStatus.readCounter,
    };
}

// back to last read if exist
/**
 * This function checks if there is a 'last read' button on the page and clicks it if it exists.
 * The 'last read' button is typically used in forums to navigate to the last read post in a thread.
 *
 * @returns {boolean} - Returns true if the 'last read' button was found and clicked, false otherwise.
 */
function checkLastRead() {
    let buttonLastRead = document.querySelector(".timeline-last-read .btn");
    if (buttonLastRead) {
        buttonLastRead.click();
        return true;
    }
    return false;
}

function addDebugTextarea(debugText = "") {
    if (debugText === "" && !document.getElementById("debugTextarea")) {
        let textarea = document.createElement("textarea");
        textarea.id = "debugTextarea";
        textarea.style.cssText = `
        position: fixed;
        top: 4rem;
        right: 0;
        width: 300px;
        height: 600px;
        z-index: 1000;
        background: rgba(0, 0 ,0, 0.8);
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 4px;
        resize: none;
    `;
        document.body.appendChild(textarea);
    } else if (localStorage.getItem("debugPanel") === "true" && document.getElementById("debugTextarea")) {
        const textarea = document.getElementById("debugTextarea");
        const lines = textarea.value.split("\n");
        const lastLine = lines[lines.length - 1]; // 最後一行的內容
        const match = lastLine.match(/(.*?)(\s\(\d+\))?$/);
        const lastText = match[1];
        const count = match[2] ? parseInt(match[2].match(/\d+/)[0]) : 1;

        if (lastText === debugText) {
            lines[lines.length - 1] = `${lastText} (${count + 1})`;
        } else {
            lines.push(debugText);
        }

        textarea.value = lines.join("\n");
        textarea.scrollTop = textarea.scrollHeight;
    }
}

function setBtnText_readToday() {
    let btnAutoRead = document.getElementById("btnAutoRead");
    btnAutoRead.textContent = localStorage.getItem("read") === "true" ? `◼ ( ${floorStatus.readCounter} )` : `▶ ( ${floorStatus.readCounter} )`;
}

function check_read_limit() {
    if (floorStatus.readCounter > (localStorage.getItem("stopLimit") || 250)) {
        document.getElementById("btnAutoRead").click();
        return true;
    }
    return false;
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (rect.top >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        //rect.left >= 0 &&
        //rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        //rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

async function directNextPost() {
    if (waitNextRefresh === 0) {
        waitNextRefresh++;
        return;
    }
    waitNextRefresh = 0;

    if (window.location.href.includes("/t/topic/") && readSuggestPost) {
        let suggestPost;
        suggestPost = document.querySelector('a[href="/unread"]');
        if (suggestPost) {
            suggestPost.click();
            addDebugTextarea("[INFO] found unread ==> ○");
            return;
        }
        addDebugTextarea("[WARN] unread post ==> X");
    }
    if (window.location.href.includes("/search") /* && directWaitCounter < 5*/) {
        let links = document.querySelectorAll('a[href^="/t/topic"]');
        let hrefs;
        if (links && 0 < links.length) {
            directWaitCounter = 0;
            //hrefs = Array.from(links, link => link.getAttribute('href'));
            hrefs = Array.from(links, (link) => link.getAttribute("href").replace(/(\/t\/topic\/\d+).*/, "$1"));
            const tempUrl = hrefs.shift();
            localStorage.setItem("unreadList", JSON.stringify(hrefs));
            addDebugTextarea("[INFO] Got ", hrefs.length, " unread posts");
            gotoUrl(tempUrl);
            return;
        }
        directWaitCounter++;
        addDebugTextarea("[WARN] Got 0 unread posts");
    }
    /*if (window.location.href.includes("/search")) {
          directWaitCounter = 0;
          gotoUrl("/ubm"); //useBackupMethod
      }*/
    if (window.location.href === `${BASE_URL}/unread` /*||
        window.location.href === `${BASE_URL}/`*/) {
        let suggestPost = document.querySelector('a[class*="badge badge-notification"]');
        if (suggestPost) {
            addDebugTextarea("[INFO] found post ==> ○");
            suggestPost.click();
        }
        return;
    }
    let unreadList = JSON.parse(localStorage.getItem("unreadList"));
    if (!unreadList || unreadList.length <= 0) {
        gotoUrl("/search?expanded=true&q=in%3Aunseen%20min_posts%3A20");
        return;
    }
    if (0 < unreadList.length) {
        let tempUrl = unreadList.shift();
        let userUrl = window.location.href.match(/\/t\/topic\/(\d+)?/);
        if (userUrl !== null && userUrl[1] === tempUrl.match(/\/t\/topic\/(\d+)?/)[1]) {
            localStorage.setItem("unreadList", JSON.stringify(unreadList));
            tempUrl = unreadList.shift();
            addDebugTextarea("[INFO] Delete done post");
        }
        addDebugTextarea(`[INFO] Least ${unreadList.length} unread posts in storage`);
        if (tempUrl) {
            gotoUrl(tempUrl.replace(/(\/t\/topic\/\d+).*/, "$1"));
        }
        return;
    }

    // backup method
    /*addDebugTextarea("[WARN] Use api to get unread posts");
      const topicListStr = localStorage.getItem("topicList");
      if (!topicListStr) {
          await getLatestTopic();
      }
      const topicList = JSON.parse(topicListStr);
      if (topicList && 0 < topicList.length) {
          // 从未读列表中取出第一个
          let topic = topicList.shift();
          if (window.location.href.includes(`/t/topic/${topic.id}`)) {
              localStorage.setItem("topicList", JSON.stringify(topicList));
              topic = topicList.shift();
          }
          //window.location.href = `${BASE_URL}/t/topic/${topic.id}`;
          gotoUrl(`/t/topic/${topic.id}`);
      }*/
}

function gotoUrl(url) {
    let directPost = document.querySelector('a[href="/"]');
    directPost.href = `${url}`;
    directPost.click();
    directPost.href = "/";
}

function scrollIntoBee(element, marginOffset = 4) {
    const temp_marginTop = element.style.marginTop === undefined || "" ? "0px" : element.style.marginTop;
    //decrease 130px from temp_marginTop
    element.style.marginTop = `-${marginOffset}rem`;
    element.scrollIntoView({behavior: "smooth"});
    element.style.marginTop = temp_marginTop;
    if (element.id) {
        addDebugTextarea(`[INFO] Read => #${element.id}`);
    }
}

function discourseDo(action) {
    let eventFinal;
    switch (action) {
        case "lastTimeReadProcess":
            eventFinal = new KeyboardEvent("keydown", {
                key: "l", code: "KeyL", keyCode: 76, which: 76, shiftKey: true, bubbles: true, cancelable: true,
            });
            break;
        case "nextPost":
            eventFinal = new KeyboardEvent("keydown", {
                key: "j", code: "KeyJ", keyCode: 74, which: 74, shiftKey: true, bubbles: true, cancelable: true,
            });
            break;
        default:
            console.warn(`[ERROR] Unknown action: ${action}`);
            return;
    }
    document.body.dispatchEvent(eventFinal);
}

function isNewPost() {
    if (localStorage.getItem("readUrl").split("/").slice(0, 6).join("/") !== window.location.href.split("/").slice(0, 6).join("/")) {
        localStorage.setItem("readUrl", window.location.href.split("/").slice(0, 6).join("/"));
        return true;
    }
    return false;
}

function waitReady() {
    let element = document.querySelector(".loading-indicator-container");
    return element && element.classList.contains("ready");
}

function addStartBtn() {
    //let ul = document.querySelector('.icons.d-header-icons');btn btn-icon-text btn-default sidebar__panel-switch-button
    let ul = document.querySelector(".sidebar-footer-wrapper");
    let li = document.createElement("li");
    li.className = "sidebar-section-link-wrapper";

    let a = document.createElement("a");
    a.id = "startA";
    a.className = "ember-view sidebar-section-link sidebar-row";
    //let a2 = document.createElement('a');
    //a2.id = "directUrl";
    //a2.className = "ember-view sidebar-section-link sidebar-row";
    //a2.href = "";

    let span1 = document.createElement("span");
    span1.className = "sidebar-section-link-prefix icon";

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("fa", "d-icon", "d-icon-angle-right", "svg-icon", "prefix-icon", "svg-string");
    /*
      let use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        "#angle-right"
      );*/

    let span2 = document.createElement("span");
    span2.className = "sidebar-section-link-content-text";
    span2.id = "btnAutoRead";
    span2.textContent = "▶ ( - )";

    //svg.appendChild(use);
    span1.appendChild(svg);
    a.appendChild(span1);
    a.appendChild(span2);
    //li.appendChild(a2);
    li.appendChild(a);

    ul.prepend(li);
    a.onclick = function () {
        const currentlyReading = localStorage.getItem("read") === "true";
        const newReadState = !currentlyReading;
        localStorage.setItem("read", newReadState.toString());
        span2.textContent = newReadState ? `◼ ( ${floorStatus.readCounter} )` : `▶ ( ${floorStatus.readCounter} )`;
        if (newReadState) {
            autoRunStart();
        } else {
            clearInterval(readInterval);
        }
    };
}

function createButtonContainer() {
    let ul = document.querySelector(".sidebar-footer-wrapper");
    let container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.gap = "8px"; // 按鈕之間的間距
    ul.prepend(container);
    return container;
}

function addAutoBtn() {
    let container = document.querySelector(".sidebar-footer-wrapper > div") || createButtonContainer();
    let li = document.createElement("li");
    li.className = "sidebar-section-link-wrapper";
    li.style.margin = "0";

    let a = document.createElement("a");
    a.id = "startA2";
    a.className = "ember-view sidebar-section-link sidebar-row";
    //let a2 = document.createElement('a');
    //a2.id = "directUrl";
    //a2.className = "ember-view sidebar-section-link sidebar-row";
    //a2.href = "";

    let span1 = document.createElement("span");
    span1.className = "sidebar-section-link-prefix icon";

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("fa", "d-icon", "d-icon-angle-down", "svg-icon", "prefix-icon", "svg-string");

    let use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#angle-down");

    let span2 = document.createElement("span");
    span2.className = "sidebar-section-link-content-text";
    span2.id = "btnAutoRead2";
    //span2.textContent = "▼";

    svg.appendChild(use);
    span1.appendChild(svg);
    a.appendChild(span1);
    a.appendChild(span2);
    //li.appendChild(a2);
    li.appendChild(a);

    container.appendChild(li);
    a.onclick = function () {
        const currentlyReading = localStorage.getItem("read") === "true";
        const newReadState = !currentlyReading;
        localStorage.setItem("read", newReadState.toString());
        document.getElementById("btnAutoRead").textContent = newReadState ? `◼ ( ${floorStatus.readCounter} )` : `▶ ( ${floorStatus.readCounter} )`;
        if (newReadState) {
            autoRunStart(true);
        } else {
            clearInterval(readInterval);
        }
    };
}

function addCleanBtn() {
    let container = document.querySelector(".sidebar-footer-wrapper > div") || createButtonContainer();
    let li = document.createElement("li");
    li.className = "sidebar-section-link-wrapper";
    li.style.margin = "0";

    let a = document.createElement("a");
    a.id = "cleanA";
    a.className = "ember-view sidebar-section-link sidebar-row";

    let span1 = document.createElement("span");
    span1.className = "sidebar-section-link-prefix icon";

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("fa", "d-icon", "d-icon-discourse-sparkles", "svg-icon", "prefix-icon", "svg-string");

    let use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#discourse-sparkles");

    let span2 = document.createElement("span");
    span2.className = "sidebar-section-link-content-text";
    span2.id = "btnAutoReadReset";
    //span2.textContent = "✨";

    svg.appendChild(use);
    span1.appendChild(svg);
    a.appendChild(span1);
    a.appendChild(span2);
    li.appendChild(a);

    container.appendChild(li);
    li.onclick = function () {
        floorStatus.readCounter = 0;
        localStorage.setItem("readCounter", floorStatus.readCounter.toString());
        document.getElementById("btnAutoRead").textContent = localStorage.getItem("read") === "true" ? `◼ ( ${floorStatus.readCounter} )` : `▶ ( ${floorStatus.readCounter} )`;
    };
}

function addSettingBtn() {
    let container = document.querySelector(".sidebar-footer-wrapper > div") || createButtonContainer();
    let li = document.createElement("li");
    li.className = "sidebar-section-link-wrapper";
    li.style.margin = "0";

    let a = document.createElement("a");
    a.id = "settingA";
    a.className = "ember-view sidebar-section-link sidebar-row";

    let span1 = document.createElement("span");
    span1.className = "sidebar-section-link-prefix icon";

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("fa", "d-icon", "d-icon-ellipsis", "svg-icon", "prefix-icon", "svg-string");

    let use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#ellipsis");

    let span2 = document.createElement("span");
    span2.className = "sidebar-section-link-content-text";
    span2.id = "btnAutoReadSetting";
    //span2.textContent = "⚙️";

    svg.appendChild(use);
    span1.appendChild(svg);
    a.appendChild(span1);
    a.appendChild(span2);
    li.appendChild(a);

    container.appendChild(li);
    a.onclick = function (e) {
        e.preventDefault();
        const existingDialog = document.querySelector(".settings-dialog");
        if (existingDialog) {
            existingDialog.remove();
        } else {
            createSettingsDialog();
        }
    };
}

function createSettingsDialog() {
    const dialog = document.createElement("div");
    dialog.className = "settings-dialog";
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--primary-low);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        min-width: 300px;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // 讓dialog淡入顯示
    setTimeout(() => (dialog.style.opacity = "1"), 10);

    const title = document.createElement("h3");
    title.textContent = "設定";
    title.style.marginBottom = "20px";

    // 藍點模式設定行
    const blueDotRow = createSettingRow("藍點模式", "blueDotMode");
    const readLimitRow = createInputRow("讀多少休息呢？", "stopLimit", 350);
    const refreshRateForBlueDotMode = createInputRow("藍點模式速度", "refreshRateBlueDot", 300);
    const refreshRateForNormalMode = createInputRow("正常模式速度", "refreshRateNormal", 2400);
    const reloadWaitTime = createInputRow("藍點卡住多久要刷新呢？(s)", "reloadWaitTime", 25);
    const debugPanel = createSettingRow("開啟偵錯台", "debugPanel");

    // 創建清除閱讀序列行
    const clearReadSequenceRow = document.createElement("div");
    clearReadSequenceRow.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
    `;

    const clearLabel = document.createElement("label");
    const unreadList = JSON.parse(localStorage.getItem("unreadList") || "[]");
    clearLabel.textContent = `閱讀序列： ${unreadList.length} 帖`;

    clearLabel.style.marginRight = "10px";

    const clearButton = document.createElement("button");
    clearButton.textContent = "清除";
    clearButton.style.cssText = `
        padding: 6px 12px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s ease;
    `;

    clearButton.addEventListener("mouseover", () => {
        clearButton.style.background = "#c82333";
    });

    clearButton.addEventListener("mouseout", () => {
        clearButton.style.background = "#dc3545";
    });

    clearButton.addEventListener("click", () => {
        localStorage.setItem("unreadList", "[]");
        addDebugTextarea("[INFO] 清除閱讀序列");
        clearLabel.textContent = `閱讀序列： 0 帖`;
        alert("閱讀序列已清除，下次翻閱文章時，將重新取得列表。");
    });

    clearReadSequenceRow.appendChild(clearLabel);
    clearReadSequenceRow.appendChild(clearButton);

    // 創建關閉按鈕
    const closeButton = document.createElement("button");
    closeButton.textContent = "關閉";
    closeButton.style.cssText = `
        margin-top: 20px;
        padding: 8px 16px;
        background: var(--secondary);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s ease;
        width: 100%;
    `;
    closeButton.addEventListener("mouseover", () => {
        closeButton.style.background = "var(--header_background)";
    });
    closeButton.addEventListener("mouseout", () => {
        closeButton.style.background = "var(--secondary)";
    });
    closeButton.addEventListener("click", () => {
        dialog.style.opacity = "0";
        setTimeout(() => dialog.remove(), 300);
    });

    dialog.appendChild(title);
    dialog.appendChild(blueDotRow);
    dialog.appendChild(readLimitRow);
    dialog.appendChild(refreshRateForBlueDotMode);
    dialog.appendChild(refreshRateForNormalMode);
    dialog.appendChild(reloadWaitTime);
    dialog.appendChild(debugPanel);
    dialog.appendChild(clearReadSequenceRow);
    dialog.appendChild(closeButton);
    document.body.appendChild(dialog);

    return dialog;
}

function createSettingRow(labelText, storageKey) {
    const settingRow = document.createElement("div");
    settingRow.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
    `;

    const label = document.createElement("label");
    label.textContent = labelText;
    label.style.marginRight = "10px";

    const toggleSwitch = document.createElement("label");
    toggleSwitch.className = "switch";
    toggleSwitch.style.cssText = `
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    `;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.cssText = `
        opacity: 0;
        width: 0;
        height: 0;
    `;
    // 初始化時讀取localStorage的值

    // 檢查並設定預設值
    if (localStorage.getItem(storageKey) === null) {
        localStorage.setItem(storageKey, true);
    }

    const slider = document.createElement("span");
    slider.className = "slider";
    slider.style.cssText = `
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    `;

    // 添加滑動圓球
    const ball = document.createElement("span");
    ball.style.cssText = `
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: var(--primary-low);
        transition: .4s;
        border-radius: 50%;
    `;
    slider.appendChild(ball);

    const savedValue = localStorage.getItem(storageKey) || "false";
    if (savedValue === "true") {
        checkbox.checked = true;
        slider.style.backgroundColor = "#2196F3";
        ball.style.transform = "translateX(26px)";
    }

    checkbox.addEventListener("change", function () {
        try {
            slider.style.backgroundColor = this.checked ? "#2196F3" : "#ccc";
            ball.style.transform = this.checked ? "translateX(26px)" : "translateX(0)";
            // 儲存到localStorage
            localStorage.setItem(storageKey, this.checked.toString());
        } catch (error) {
            console.error("無法存取 localStorage:", error);
        }
        if (storageKey === "blueDotMode" && localStorage.getItem("read") === "true") {
            clearInterval(readInterval);
            autoRunStart();
        }
        if (storageKey === "debugPanel") {
            if (!this.checked) {
                addDebugTextarea("[INFO] Debug panel closed");
                document.getElementById("debugTextarea").remove();
            } else {
                addDebugTextarea();
            }
        }
    });
    toggleSwitch.appendChild(checkbox);
    toggleSwitch.appendChild(slider);
    settingRow.appendChild(label);
    settingRow.appendChild(toggleSwitch);

    return settingRow;
}

function createInputRow(labelText, storageKey, defaultValue) {
    const inputRow = document.createElement("div");
    inputRow.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
    `;

    const label = document.createElement("label");
    label.textContent = labelText;
    label.style.marginRight = "10px";

    const input = document.createElement("input");
    input.type = "text";
    input.style.cssText = `
        width: 5em;
        margin-left: auto;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
    `;

    const storedValue = localStorage.getItem(storageKey);
    if (storedValue === null) {
        input.value = defaultValue.toString();
    } else {
        input.value = storedValue;
    }
    input.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "");
        try {
            // 儲存到localStorage
            localStorage.setItem(storageKey, this.value);
        } catch (error) {
            console.error("無法存取 localStorage:", error);
        }
    });

    inputRow.appendChild(label);
    inputRow.appendChild(input);

    return inputRow;
}

function cleanTransition() {
    const style = document.createElement("style");
    style.innerHTML = `
  .read-state.read {
    transition: none !important;
  }
`;
    document.head.appendChild(style);
}

function checkContinue() {
    if (localStorage.getItem("read") === "true") {
        localStorage.setItem("read", "false");
        document.getElementById("btnAutoRead").click();
    }
}

function setDefaultLocalStorage(key, defaultValue) {
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, defaultValue);
    }
}

function checkAllLocalStorage() {
    setDefaultLocalStorage("isFirstRun", "false");
    setDefaultLocalStorage("read", "false");
    setDefaultLocalStorage("autoLikeEnabled", "false"); //默认关闭自动点赞
    setDefaultLocalStorage("unreadList", "[]");
    setDefaultLocalStorage("readUrl", "https://linux.do/t/topic/1");
    setDefaultLocalStorage("blueDotMode", "true");
    setDefaultLocalStorage("stopLimit", "250");
    setDefaultLocalStorage("refreshRateBlueDot", "350");
    setDefaultLocalStorage("refreshRateNormal", "2400");
    setDefaultLocalStorage("reloadWaitTime", "25");
    setDefaultLocalStorage("debugPanel", "false");
}

// 检查是否是第一次运行脚本
function checkFirstRun() {
    if (localStorage.getItem("debugPanel") === "true") {
        addDebugTextarea();
    }
    addDebugTextarea("[INFO] Init data");
    checkAllLocalStorage();
    // add element
    createButtonContainer();
    addAutoBtn();
    addCleanBtn();
    addSettingBtn();
    addStartBtn();
    cleanTransition();
    checkContinue();
}

// 1. 创建一个函数来处理 article 元素
function handleArticle(articleElement) {
    // 2. 提取 article 的 id 數字
    const postId = parseInt(articleElement.id.replace("post_", ""));

    // 3. 生成文字
    const text = postId + " F";

    // 4. 在 [[代碼插入處]] 插入文字 (修改部分)
    const avatarDiv = articleElement.querySelector(".topic-avatar");
    if (avatarDiv === null) return;
    const existingText = avatarDiv.querySelector(`div[id='post-${postId}-f']`); // 檢查是否存在新添加的文字

    if (!existingText) {
        // 如果不存在，才插入
        const newText = document.createElement("div");
        newText.textContent = text;
        newText.id = `post-${postId}-f`; // 添加 ID
        newText.style.textAlign = "center"; // 設置文字居中
        newText.style.cursor = "pointer"; // 設置鼠標指針為鏈接樣式

        avatarDiv.appendChild(newText);
    }
}

function addFloorListener() {
    // 6. 处理现有的 article 元素
    const articleElements = Array.from(document.querySelectorAll("article")).filter((articleElement) => articleElement.id !== undefined);

    articleElements.forEach((articleElement) => {
        handleArticle(articleElement);
    });

    // 7. 监听新的 article 元素的添加
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            //addDebugTextarea(mutation);
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    /*if (node.tagName === 'ARTICLE') {
                                          handleArticle(node);
                                            addDebugTextarea("run F");
                                        }*/
                    // 6. 处理现有的 article 元素
                    const articleElements = Array.from(document.querySelectorAll("article")).filter((articleElement) => articleElement.id !== undefined);

                    articleElements.forEach((articleElement) => {
                        handleArticle(articleElement);
                    });
                });
            }
        });
    });
    observer.observe(document.body, {childList: true, subtree: true});
}

(function () {
    ("use strict");
    checkFirstRun();
    addFloorListener();
})();
