// ==UserScript==
// @name                Duck.ai chats search bar
// @namespace           https://greasyfork.org/users/821661
// @match               https://duckduckgo.com/*
// @grant               GM_addStyle
// @version             0.2.1
// @author              hdyzen
// @description         Search bar in recent chats list
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/538358/Duckai%20chats%20search%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/538358/Duckai%20chats%20search%20bar.meta.js
// ==/UserScript==

const input = getInput();

function waitRecentChatList() {
    const observer = new MutationObserver(() => {
        const recentChatList = document.querySelector(".JmSIe7cXVoKWvdAQJ2iD");

        if (!location.search.includes("ia=chat") || !recentChatList || document.body.contains(input)) {
            return;
        }

        recentChatList.insertAdjacentElement("afterbegin", input);
    });

    observer.observe(document, { subtree: true, childList: true });
}
waitRecentChatList();

function filterChatsByText(searchBar, searchText) {
    let currentChatItem = searchBar.nextElementSibling;

    while (currentChatItem) {
        const title = currentChatItem.innerText.toLowerCase();
        const isMatch = title.includes(searchText);

        currentChatItem.setAttribute("match-search", isMatch.toString());

        currentChatItem = currentChatItem.nextElementSibling;
    }
}

function getInput() {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search";
    input.style =
        "width: 100%;font-size: 16px;padding-inline: 11px;height: 44px;border-radius: var(--default-border-radius);background-color: #333333;box-shadow: 0 1px 3px rgba(0,0,0,0.5);outline: none;position: sticky;top: 0;";
    input.addEventListener("input", (e) => {
        const searchText = e.target.value.toLowerCase();

        filterChatsByText(input, searchText);
    });

    return input;
}

GM_addStyle(`
.HTQSbbGLgf1_TYR3V7Ln:has([match-search]):not(:has(.JYOnH1YkhsxhT9yFGgea > [match-search="true"])), [match-search="false"] {
    display: none !important;
}
`);

/*
Search bar template

<input
    type="text"
    style="width: 100%;font-size: 16px;padding-inline: 11px;height: 44px;border-radius: var(--default-border-radius);background-color: #333333;box-shadow: 0 1px 3px rgba(0,0,0,0.5);outline: none;position: sticky;top: 0;"
    placeholder="Search"
>
*/
