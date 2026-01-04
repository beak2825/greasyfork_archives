// ==UserScript==
// @name         Hard Curb
// @namespace    https://wilchan.org
// @version      3.1
// @description  Umożliwia zupełne schowanie tematu - brak belki, nie pojawia się w katalogu, nie pojawia się (*) przy nowym poście w tym temacie, inne tematy automatycznie ładują się na pierwszą.
// @author       Anonimas
// @match        https://wilchan.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wilchan.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510246/Hard%20Curb.user.js
// @updateURL https://update.greasyfork.org/scripts/510246/Hard%20Curb.meta.js
// ==/UserScript==

/* Hard curb+ v3.1 */

/* settings */
let hideCurbsBool = true;

if (localStorage.getItem("hideCurbsBool") !== null) {
    hideCurbsBool = JSON.parse(localStorage.getItem("hideCurbsBool"));
}
else {
    localStorage.setItem("hideCurbsBool", JSON.stringify(hideCurbsBool));
}

const addHideCurbsStyleTag = () => {
    let styleElem = document.createElement("style");
    styleElem.setAttribute("data-hide", "curbs");
    styleElem.innerHTML = ".thread.curb { display: none !important }";
    document.head.appendChild(styleElem);
}

const hideCurbsSwitch = (event) => {
    if (event.target.checked) {
        hideCurbsBool = true;
        localStorage.setItem("hideCurbsBool", JSON.stringify(hideCurbsBool));
    } else {
        hideCurbsBool = false;
        localStorage.setItem("hideCurbsBool", JSON.stringify(hideCurbsBool));
    }
}

if (hideCurbsBool) addHideCurbsStyleTag();

setTimeout(() => {
    document.querySelector("aside .settings").appendChild(createCheckboxSettingElement("Hide curbed threads", hideCurbsBool, "change", hideCurbsSwitch));
}, 100)
/* /// */

if (viewConfiguration.boardViewType === BoardViewType.ClassicBoard && hideCurbsBool) {
    let unreadPosts = 0;

    window.addEventListener("after-create-synchronization-event", function (event) {
        if (curbs[boardConfiguration.boardId] !== undefined && curbs[boardConfiguration.boardId][event.detail.threadId] !== undefined) {
            if (document.title.match(/^\(\*\)/) !== null && unreadPosts === 0)
                document.title = document.title.substring(4);
        } else if (document.hidden) {
            unreadPosts = 1;
        }
    }, false);

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            unreadPosts = 0
        }
    }, false);

    const createBoardIndex = async (boardId) => {
        let response = await fetch(`https://wilchan.org/${boardId}/catalog`),
            parser = new DOMParser(),
            template = await response.text(),
            threads;
        template = parser.parseFromString(template, "text/html")
        threads = template.querySelectorAll('article.thread');
        let threadIndex = [];
        for (let i = 0; i < threads.length; i++) {
            let id = threads[i].querySelector("section.thread > .info > a.reply").textContent;
            threadIndex.push(id);
        }
        return threadIndex;
    }

    const extendFirstPage = async (threadsLeft) => {
        let threadList = await createBoardIndex(boardConfiguration.boardId);
        let firstPageThreads = Array.prototype.slice.call(document.querySelectorAll("article.thread:not(.curb)")).map((e)=>e.getAttribute("data-threadid"));

        for (let i = 0; i < threadList.length; i++) {
            if (curbs[boardConfiguration.boardId][threadList[i]] !== undefined || firstPageThreads.indexOf(threadList[i]) != -1)
                threadList[i] = undefined;
        }
        threadList = threadList.filter((e)=>e !== undefined);

        if (threadList.length >= threadsLeft) {
            for (let i = 0; i < threadsLeft; i++) {
                let thread = await getPostAsync(boardConfiguration.boardId, threadList[i]);
                if (thread != null) {

                    let replyArray;

                    // if (thread.bump > 0) {
                        if (thread.pin) {
                            replyArray = await getRepliesAsync(boardConfiguration.boardId, threadList[i], boardConfiguration.threadPinReplyPreviewMax);
                        } else {
                            replyArray = await getRepliesAsync(boardConfiguration.boardId, threadList[i], boardConfiguration.threadReplyPreviewMax);
                        }
                    // }

                    document.querySelector("main").appendChild(createThreadArticleElement(thread, replyArray));
                }
            }
        }
    }

    const checkFirstPage = () => {
        let visibleThreads = document.querySelectorAll("article.thread:not(.curb)").length;
        let threadsLeft = 10 - visibleThreads;
        if (visibleThreads < 10)
            extendFirstPage(threadsLeft);
    }

    if (document.querySelector(`footer > nav a[href="/${boardConfiguration.boardId}"]`) === null) {
        checkFirstPage();
        document.querySelector("main").addEventListener("click", (e) => {
            if (e.target.classList.contains("curb") && e.target.parentNode !== null && e.target.parentNode.classList.contains("options"))
                checkFirstPage();
        });
    }
}

const curbInCatalog = (curbs) => {
    document.querySelectorAll("article.thread").forEach((thread) => {
        if (curbs[boardConfiguration.boardId] !== undefined) {
            if (Object.keys(curbs[boardConfiguration.boardId]).includes(thread.dataset.threadid.toString())) {
                // thread.style.setProperty("display", "none", "important");
                thread.remove();
            }
        }
    });
}
if (viewConfiguration.boardViewType === 3 && hideCurbsBool) {
    curbInCatalog(curbs);
}