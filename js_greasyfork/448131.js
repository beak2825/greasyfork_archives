// ==UserScript==
// @name         Old Roblox Header
// @namespace    aubymori
// @version      1.1
// @description  Restores the old "Hello, {username}!" header on the Roblox homepage.
// @author       You
// @match        www.roblox.com/*
// @match        web.roblox.com/*
// @icon         https://www.roblox.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448131/Old%20Roblox%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/448131/Old%20Roblox%20Header.meta.js
// ==/UserScript==

const CONFIG = {
    helloGreeting: true
};

function header(usrLink, usrPhoto, usrName) {
    return `
    <div id="home-header" class="col-xs-12 home-header-container">
        <div class="home-header">
            <a href="${ usrLink ?? "/users/1/profile" }" class="user-avatar-container avatar avatar-headshot-lg">
                <span class="thumbnail-2d-container avatar-card-image">
                    <img src="${ usrPhoto ?? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" }" alt="" class="avatar-card-image">
                </span>
            </a>
            <div class="user-info-container">
                <h1 class="user-name-container">
                    <a href="${ usrLink ?? "/users/1/profile" }">${ usrName ?? "Roblox" }</a>
                </h1>
            </div>
        </div>
    </div>
    `;
}

// style to fix the home-header
var orhStyle = document.createElement("style");
orhStyle.innerHTML = `
.home-header {
    display: flex;
    flex-direction: row;
    margin-bottom: 25px;
}

.user-info-container {
    display: flex;
    align-items: center;
    margin-left: 25px;
}

.user-avatar-container {
    min-width: 150px;
}
`;
document.getElementsByTagName("head")[0].appendChild(orhStyle);

// the holy function
async function waitForElm(q) {
    while (document.querySelector(q) == null) {
        await new Promise(r => requestAnimationFrame(r));
    };
    return document.querySelector(q);
};

waitForElm("#HomeContainer .section:first-child").then(async (hdrSec) => {
    let sidebarUser = await waitForElm("#navigation.rbx-left-col > ul > li > a") ?? null;
    let usrLink = sidebarUser.getAttribute("href") ?? null;
    let usrPhoto = (await waitForElm("#navigation.rbx-left-col > ul > li > a img")).getAttribute("src") ?? null;
    let usrName = (await waitForElm("#navigation.rbx-left-col > ul > li > a .font-header-2")).innerText ?? null;
    if (CONFIG.helloGreeting) usrName = "Hello, " + usrName + "!";
    let htmlToInsert = header(usrLink, usrPhoto, usrName);

    hdrSec.outerHTML = htmlToInsert;
});