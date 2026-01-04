// ==UserScript==
// @name         Nitro Type - Safe Space
// @version      0.6.1
// @description  Replaces the Race Track with a Typing Test Lobby Chatroom. Choose which users to mute and block, it's your "safe space".
// @author       Toonidy
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @match        *://*.nitrotype.com/profile
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.1/dexie.min.js#sha512-ybuxSW2YL5rQG/JjACOUKLiosgV80VUfJWs4dOpmSWZEGwdfdsy2ldvDSQ806dDXGmg9j/csNycIbqsrcqW6tQ==
// @require      https://greasyfork.org/scripts/443718-nitro-type-userscript-utils/code/Nitro%20Type%20Userscript%20Utils.js?version=1042360
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/437661/Nitro%20Type%20-%20Safe%20Space.user.js
// @updateURL https://update.greasyfork.org/scripts/437661/Nitro%20Type%20-%20Safe%20Space.meta.js
// ==/UserScript==
 
/* globals Dexie findReact createLogger */
 
const logging = createLogger("Nitro Type Safe Space")
 
// Config storage
const db = new Dexie("NTSafeSpace")
db.version(1).stores({
    users: "id, &username, team, displayName, status",
})
db.open().catch(function (e) {
    logging.error("Init")("Failed to open up the config database", e)
})
 
/////////////////////
//  Settings Page  //
/////////////////////
 
if (window.location.pathname === "/profile") {
    //////////////////
    //  Components  //
    //////////////////
 
    const safeSpaceSettingRoot = document.createElement("div")
    safeSpaceSettingRoot.classList.add("g-b", "g-b--9of12")
    safeSpaceSettingRoot.innerHTML = `
        <h2 class="tbs">Nitro Type Safe Space Settings</h2>
        <p class="tc-ts">Manage settings from this Userscript.</p>
        <p class="input-label">Mute/Blocked Users<p>
        <table class="table table--selectable table--striped">
            <thead class="table-head">
                <tr class="table-row">
                    <th scope="col" class="table-cell table-cell--racer">Racer</th>
                    <th scope="col" class="table-cell table-cell--status">Status</th>
                    <th scope="col" class="table-cell table-cell--remove" style="width: 90px">Remove?</th>
                </tr>
            </thead>
            <tbody class="table-body">
            </tbody>
        </table>`
 
    const userTableBody = safeSpaceSettingRoot.querySelector("tbody.table-body")
 
    const userRow = document.createElement("tr")
    userRow.classList.add("table-row")
    userRow.innerHTML = `
        <td class="table-cell table-cell--racer">
            <div class="bucket bucket--s bucket--c">
                <div class="bucket-media bucket-media--w90">
                    <img class="img--noMax db">
                </div>
                <div class="bucket-content">
                    <div class="df df--align-center">
                        <div class="prxxs"><img alt="Nitro Gold" class="icon icon-nt-gold-s" src="/dist/site/images/themes/profiles/gold/nt-gold-icon-xl.png"></div>
                        <div class="prxxs df df--align-center">
                            <a class="link link--bare mrxxs twb" style="color: rgb(253, 182, 77);"></a>
                            <span class="type-ellip type-gold tss"></span>
                        </div>
                    </div>
                    <div class="tsi tc-lemon tsxs"></div>
                </div>
            </div>
        </td>
        <td class="table-cell table-cell--status">
            <select class="input-select">
                <option value="MUTE">Muted</option>
                <option value="BLOCK">Blocked</option>
            </select>
        </td>
        <td class="table-cell table-cell--remove tar prs">
            <button title="Remove Block/Mute User" type="button" class="btn btn--negative">
                <svg class="icon icon-x--s"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/dist/site/images/icons/icons.css.svg#icon-x"></use></svg>
            </button>
        </td>`
 
    const handleRowClick = (e) => {
        const row = e.target.closest(".table-row"),
            input = e.target.closest("a, button, select"),
            userID = row && !input ? parseInt(row.dataset.user, 10) : null
        if (userID !== null && !isNaN(userID)) {
            db.users.get(userID).then((user) => {
                window.location.href = `/racer/${user.username}`
            })
        }
    }
 
    const handleStatusUpdateChange = (e) => {
        const targetElement = e.target.closest("select"),
            row = e.target.closest(".table-row"),
            userID = row ? parseInt(row.dataset.user, 10) : null
        if (userID !== null && !isNaN(userID)) {
            db.users.update(userID, { status: targetElement.value })
        }
    }
 
    const handleRemoveButtonClick = (e) => {
        const row = e.target.closest(".table-row"),
            userID = row ? parseInt(row.dataset.user, 10) : null
        if (userID !== null && !isNaN(userID)) {
            db.users.delete(userID).then(() => row.remove())
        }
    }
 
    db.users.count().then((total) => {
        if (total === 0) {
            const emptyRow = document.createElement("tr")
            emptyRow.classList.add("table-row")
            emptyRow.innerHTML = `<td class="table-cell" colspan="3">No racers found</td>`
            userTableBody.append(emptyRow)
            userTableBody.parentNode.classList.remove("table--selectable")
            return
        }
 
        const rowFragment = document.createDocumentFragment()
        db.users
            .each((userData) => {
                const row = userRow.cloneNode(true),
                    carImage = row.querySelector("img.img--noMax"),
                    teamLink = row.querySelector("a.link"),
                    racerName = row.querySelector(".type-ellip"),
                    statusSelect = row.querySelector("select"),
                    removeButton = row.querySelector("button"),
                    displayName = userData.displayName || userData.username
 
                row.dataset.user = userData.id
                row.addEventListener("click", handleRowClick)
 
                carImage.src = userData.carImgSrc
                carImage.alt = `${displayName}'s car`
 
                teamLink.parentNode.title = displayName
                racerName.textContent = `${userData.team ? " " : ""}${displayName}`
                row.querySelector(".tsi").textContent = `"${userData.title}"`
 
                if (!userData.team) {
                    teamLink.remove()
                } else {
                    teamLink.textContent = `[${userData.team}]`
                    teamLink.href = `/team/${userData.team}`
                    teamLink.style.color = `#${userData.teamColor}`
                }
 
                if (!userData.isGold) {
                    row.querySelector(".icon-nt-gold-s").parentNode.remove()
                    racerName.classList.remove("type-gold")
                }
 
                statusSelect.value = userData.status
                statusSelect.addEventListener("change", handleStatusUpdateChange)
 
                removeButton.addEventListener("click", handleRemoveButtonClick)
 
                rowFragment.append(row)
            })
            .then(() => {
                userTableBody.append(rowFragment)
            })
    })
 
    /////////////
    //  Final  //
    /////////////
 
    /** Mutation observer to check whether setting page has loaded. */
    const settingPageObserver = new MutationObserver(([mutation], observer) => {
        const sideMenu = mutation.target.querySelector(".has-btn"),
            originalSettingRoot = mutation.target.querySelector(".g-b.g-b--9of12")
        if (sideMenu && originalSettingRoot) {
            observer.disconnect()
 
            const menuSafeSpaceButton = document.createElement("button")
            menuSafeSpaceButton.classList.add("btn", "btn--fw")
            menuSafeSpaceButton.textContent = "Nitro Type Safe Space"
            menuSafeSpaceButton.addEventListener("click", () => {
                const currentActiveButton = sideMenu.querySelector(".btn.is-active")
                if (currentActiveButton) {
                    currentActiveButton.classList.remove("is-active")
                }
                menuSafeSpaceButton.classList.add("is-active")
                originalSettingRoot.replaceWith(safeSpaceSettingRoot)
            })
 
            const handleOriginalMenuButtonClick = () => {
                menuSafeSpaceButton.classList.remove("is-active")
                safeSpaceSettingRoot.replaceWith(originalSettingRoot)
            }
            sideMenu.querySelectorAll(".btn").forEach((node) => {
                node.addEventListener("click", handleOriginalMenuButtonClick)
            })
 
            sideMenu.append(menuSafeSpaceButton)
        }
    })
    settingPageObserver.observe(document.querySelector("main.structure-content"), { childList: true })
 
    return
}
 
///////////////////
//  Racing Page  //
///////////////////
 
if (window.location.pathname === "/race" || window.location.pathname.startsWith("/race/")) {
    const raceContainer = document.getElementById("raceContainer"),
        canvasTrack = raceContainer?.querySelector("canvas"),
        raceObj = raceContainer ? findReact(raceContainer) : null
    if (!raceContainer || !canvasTrack || !raceObj) {
        logging.error("Init")("Could not find the race track")
        return
    }
    if (!raceObj.props.user.loggedIn) {
        logging.error("Init")("Safe Space is not available for Guest Racing")
        return
    }
 
    //////////////
    //  Styles  //
    //////////////
 
    const style = document.createElement("style")
    style.appendChild(
        document.createTextNode(`
:root {
    --chat-contacts-width: 265px;
}
 
.nt-safe-space-root {
    position: relative;
    box-sizing: border-box;
    width: 1024px;
    height: 400px;
    background-color: #202020;
}
 
/* Some Overrides */
.race-results {
    z-index: 6;
}
 
/* Info Section */
.nt-safe-space-info {
    position: absolute;
    left: 8px;
    top: 8px;
    bottom: 8px;
    right: 633px;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    color: #eee;
    background-color: #303030;
    transition: 0.3s right ease;
}
.nt-safe-space-chat-contacts-hidden .nt-safe-space-info {
    right: calc(617px - var(--chat-contacts-width));
}
.nt-safe-space-info-status {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
}
.nt-safe-space-info-status-title {
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 14px;
}
.nt-safe-space-info-status-subtitle {
    font-size: 14px;
    text-align: center;
}
.nt-safe-space-info-status-wampus {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}
.nt-safe-space-info-status-wampus img {
    width: 100px;
    height: 64px;
}
.nt-safe-space-info-footer {
    position: relative;
    height: 138px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}
.nt-safe-space-info-footer .nt-safe-space-contact-item {
    position: absolute;
    right: 8px;
    bottom: 8px;
    padding: 8px;
    border-radius: 8px;
}
 
/* Chat */
.nt-safe-space-chat {
    position: absolute;
    left: 400px;
    right: 8px;
    top: 8px;
    bottom: 8px;
    z-index: 5;
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    transition: 0.3s left ease;
}
.nt-safe-space-chat-contacts-hidden .nt-safe-space-chat {
    left: calc(415px + var(--chat-contacts-width));
}
 
/* Chat Contacts */
.nt-safe-space-contacts {
    display: flex;
    flex-direction: column;
    width: var(--chat-contacts-width);
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border-right-width: 1px;
    border-right-style: solid;
    border-right-color: #34344a;
    background-color: #0b0b10;
    color: #fff;
    transition-duration: 0.3s;
    transition-property: width, border-right-width;
    transition-timing-function: ease;
    overflow: hidden;
}
.nt-safe-space-chat-contacts-hidden .nt-safe-space-contacts {
    border-right-width: 0px;
    width: 0px;
}
.nt-safe-space-contact-item {
    padding: 2px 8px;
    border-bottom: 1px solid #20202e;
    background-color: #111218;
}
.nt-safe-space-contact-item:hover {
    background-color: #181822;
}
.nt-safe-space-contact-item:first-of-type {
    padding-top: 8px;
}
.nt-safe-space-contact-item:nth-child(4) {
    padding-bottom: 8px;
    border-bottom: 0;
}
.nt-safe-space-contact-item.alt-row {
    background-color: #181a22;
}
.nt-safe-space-contact-item.alt-row:hover {
    background-color: #20212c;
}
.nt-safe-space-contact-item-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.nt-safe-space-contact-player {
    display: flex;
    align-items: center;
    flex-grow: 1;
}
.nt-safe-space-contact-avatar  {
    display: flex;
    width: 64px;
    height: 64px;
    overflow: hidden;
    margin-right: 4px;
}
.nt-safe-space-contact-avatar img {
    margin: auto;
    max-width: 100%;
    max-height: 100%;
}
.nt-safe-space-contact-speech-bubble {
    position: relative;
    background: #fff;
    border-radius: 8px;
    padding: 4px;
    margin-left: 10px;
    transition: opacity 0.2s ease;
    opacity: 1;
}
.nt-safe-space-contact-speech-bubble.nt-safe-space-hidden {
    opacity: 0;
}
.nt-safe-space-contact-speech-bubble:after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-right-color: #fff;
    border-left: 0;
    margin-top: -10px;
    margin-left: -10px;
}
.nt-safe-space-contact-speech-bubble-img {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: 48px;
    height: 48px;
}
.nt-safe-space-contact-item-name {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
}
.nt-safe-space-contact-menu {
    display: flex;
    flex-direction: column;
    font-size: 10px;
}
.nt-safe-space-contact-menu-item {
    display: flex;
    align-items: center;
    padding: 4px;
    margin-bottom: 2px;
    border-radius: 4px;
    width: 80px;
    cursor: pointer;
}
.nt-safe-space-contact-menu-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
.nt-safe-space-contact-menu-icon {
    margin-right: 8px;
}
 
/* Chat Messages Container */
.nt-safe-space-chatroom {
    flex-grow: 1;
    background-color: #20222e;
    background-image: url(/dist/site/images/backgrounds/bg-noise.png)
}
.nt-safe-space-chatroom-messages {
    position: relative;
    height: 210px;
    transition: height 0.2s ease;
}
.nt-safe-space-chatroom.hide-reply-options .nt-safe-space-chatroom-messages {
    height: 344px;
}
.nt-safe-space-chatroom.disable-reply .nt-safe-space-chatroom-messages {
    height: 384px;
}
.nt-safe-space-chatroom-messages-scrollable {
    position: absolute;
    left: 8px;
    right: 8px;
    top: 8px;
    bottom: 8px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-face-color: #fff;
    scrollbar-track-color: #000;
    color: #eee;
    font-size: 12px;
}
.nt-safe-space-chatroom-messages-scrollable::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}
.nt-safe-space-chatroom-messages-scrollable::-webkit-scrollbar-thumb {
    background: #fff;
}
.nt-safe-space-chatroom-messages-scrollable::-webkit-scrollbar-track {
    background: #000;
}
 
/* Chat Message Item */
.nt-safe-space-chatroom-message {
    margin-top: auto;
    margin-bottom: 16px;
}
.nt-safe-space-chatroom-message:last-of-type {
    margin-bottom: unset;
}
.nt-safe-space-chatroom-message-heading, .nt-safe-space-chatroom-message-body  {
    display: flex;
    align-items: center;
}
.nt-safe-space-chatroom-message-heading {
    margin-bottom: 4px;
    font-weight: 600;
}
.nt-safe-space-chatroom-message-body {
    display: inline-flex;
    border-radius: 8px;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 8px;
    padding-right: 8px;
    background-color: rgba(255, 255, 255, 0.1);
}
.nt-safe-space-chatroom-message-team,
.nt-safe-space-chatroom-message-name {
    margin-right: 0.5ch;
}
.nt-safe-space-chatroom-message-name.nt-gold-user,
.nt-safe-space-contact-item-name.nt-gold-user {
    color: #E0BB2F;
}
.nt-safe-space-chatroom-message-heading svg.icon,
.nt-safe-space-contact-item svg.icon {
    margin-right: 0.2ch;
}
.nt-safe-space-chatroom-message-body .nt-safe-space-chatroom-message-text.system-message {
    font-style: italic;
}
.nt-safe-space-chatroom-message-body .nt-safe-space-chatroom-mesasge-img {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: 48px;
    height: 48px;
    margin-left: 1ch;
}
.nt-safe-space-chatroom-message-time {
    font-size: 10px;
    margin-top: 2px;
}
.nt-safe-space-chatroom-message.is-me {
    display: flex;
    flex-direction: column;
}
.nt-safe-space-chatroom-message.is-me,
.nt-safe-space-chatroom-message.is-me .nt-safe-space-chatroom-message-heading,
.nt-safe-space-chatroom-message.is-me .nt-safe-space-chatroom-message-body {
    margin-left: auto;
}
.nt-safe-space-chatroom-message.is-me .nt-safe-space-chatroom-message-time {
    text-align: right;
}
 
/* Chat Reply */
.nt-safe-space-chatroom-reply {
    height: 176px;
}
.nt-safe-space-chatroom-reply-toolbar {
    background-color: #093c60;
    padding: 2px;
}
.nt-safe-space-chatroom-reply-toolbar.friend-race {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
}
.nt-safe-space-chatroom-reply-toolbar-option {
    position: relative;
    padding: 8px;
    width: 100%;
    color: #fff;
    transition: background-color 0.2s ease;
    background-color: rgba(0, 0, 0, 0.1);
}
.nt-safe-space-chatroom-reply-toolbar-option:hover {
    background-color: rgba(0, 0, 0, 0.2);
}
.nt-safe-space-chatroom-reply-toolbar-option.selected {
    background-color: rgba(0, 0, 0, 0.3);
}
.nt-safe-space-chatroom.hide-reply-options .nt-safe-space-chatroom-reply-toolbar-option {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}
.nt-safe-space-chatroom-reply-toolbar-option svg {
    margin: 0 auto;
    width: 20px;
    height: 20px;
}
.nt-safe-space-chatroom-reply-options {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 2px;
    padding: 2px;
    background: linear-gradient(to bottom, #167ac3 30%, #1C99F4 100%);
}
.nt-safe-space-chatroom-reply-sticker {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    padding: 8px;
    background-color: rgba(0, 0, 0, 0.3);
    transition: background-color 0.2s ease;
    cursor: pointer;
}
.nt-safe-space-chatroom-reply-sticker:hover{
    background-color: #eee;
}
.nt-safe-space-chatroom-reply-sticker.nt-space-space-activated {
    background-color: #fff;
}
.nt-safe-space-chatroom-reply-sticker-img {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    transition: background-image 0.2s ease;
    width: 48px;
    height: 48px;
}
.nt-safe-space-chatroom-reply-sticker-shortcut, .nt-safe-space-chatroom-reply-toolbar-option-shortcut {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-bottom-left-radius: 4px;
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
    font-size: 12px;
}`)
    )
    document.head.appendChild(style)
 
    const root = document.createElement("div")
    root.classList.add("nt-safe-space-root", "nt-safe-space-chat-contacts-hidden")
 
    //////////////////
    //  Components  //
    //////////////////
 
    /** Display a chatroom with messages. */
    const ChatRoom = ((safeSpaceContainer, raceObj, db) => {
        const racerContactIDPrefix = "ntSafeSpaceRacer_",
            friendIconSVG = `<svg class="icon icon-friends-s tc-lemon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/dist/site/images/icons/icons.css.svg#icon-friends"></use></svg>`,
            smileyIconSVG = `<svg class="icon icon-smiley-l"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/dist/site/images/icons/icons.css.svg#icon-smiley"></use></svg>`,
            chatIconSVG = `<svg class="icon icon-chat"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/dist/site/images/icons/icons.css.svg#icon-chat"></use></svg>`,
            blockIconSVG = `<svg class="icon icon-lock-outline"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/dist/site/images/icons/icons.css.svg#icon-lock-outline"></use></svg>`,
            muteIconSVG = `<svg class="icon icon-eye"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/dist/site/images/icons/icons.css.svg#icon-eye"></use></svg>`,
            root = document.createElement("div"),
            systemUser = {
                userID: 0,
                profile: {
                    displayName: "Typing Test Instructor",
                    username: "Typing Test Instructor",
                    tag: null,
                    tagColor: null,
                    membership: "normal",
                },
            }
        let userStickers = [],
            userData = {},
            isStickers = true,
            isFriendRace = raceObj.state.friendsRace,
            racerCount = 0,
            userSpeechBubbleTimer = {},
            chatButtonTimer = [],
            updatingDB = [],
            raceKeyboardObj,
            originalChatObj
 
        root.classList.add("nt-safe-space-chat")
        root.innerHTML = `
            <div class="nt-safe-space-contacts"></div>
            <div class="nt-safe-space-chatroom">
                <div class="nt-safe-space-chatroom-messages">
                    <div class="nt-safe-space-chatroom-messages-scrollable"></div>
                </div>
                <div class="nt-safe-space-chatroom-reply">
                    <div class="nt-safe-space-chatroom-reply-toolbar friend-race">
                        <button class="nt-safe-space-chatroom-reply-toolbar-option option-sticker selected" type="button" title="Send Sticker">
                            ${smileyIconSVG}
                            <div class="nt-safe-space-chatroom-reply-toolbar-option-shortcut">S</div>
                        </button>
                        <button class="nt-safe-space-chatroom-reply-toolbar-option option-chat" type="button" title="Send Chat Message">
                            ${chatIconSVG}
                            <div class="nt-safe-space-chatroom-reply-toolbar-option-shortcut">C</div>
                        </button>
                    </div>
                    <div class="nt-safe-space-chatroom-reply-options">
                        ${Array.from(Array(8).keys())
                            .map(
                                (i) =>
                                    `<button class="nt-safe-space-chatroom-reply-sticker" type="button" data-stickerindex="${i}">
                            <div class="nt-safe-space-chatroom-reply-sticker-img"></div>
                            <div class="nt-safe-space-chatroom-reply-sticker-shortcut">${i + 1}</div>
                        </button>`
                            )
                            .join("")}
                    </div>
                </div>
            </div>`
 
        const handleNoHighlightButtonMouseDown = (e) => {
            e.preventDefault()
        }
 
        const handleChatOptionButtonClick = (e) => {
            e.preventDefault()
            const targetElement = e.target.closest(".nt-safe-space-chatroom-reply-toolbar-option")
            if (targetElement.classList.contains("selected")) {
                targetElement.classList.remove("selected")
                toggleChatOptions(false)
                return
            }
            toggleChatOptions(true)
            isStickers = targetElement.classList.contains("option-sticker")
            refreshChatOptions()
            root.querySelectorAll(".nt-safe-space-chatroom-reply-toolbar-option").forEach((optionElement) => {
                optionElement.classList.remove("selected")
            })
            targetElement.classList.add("selected")
        }
 
        const handleChatSendButtonClick = (e) => {
            e.preventDefault()
            const targetElement = e.target.closest(".nt-safe-space-chatroom-reply-sticker"),
                index = targetElement ? parseInt(targetElement.dataset.stickerindex, 10) : null
            if (index === null || isNaN(index)) {
                return
            }
            if (isStickers) {
                originalChatObj.sendMessage(userStickers[index].id, userStickers[index].src, "sticker")
            } else {
                originalChatObj.sendMessage(index, raceObj.props.chatTexts[index], "text")
            }
            flashChatButton(index)
        }
 
        root.querySelectorAll(".nt-safe-space-chatroom-reply-toolbar-option").forEach((node) => {
            node.addEventListener("click", handleChatOptionButtonClick)
            node.addEventListener("mousedown", handleNoHighlightButtonMouseDown)
        })
        root.querySelectorAll(".nt-safe-space-chatroom-reply-sticker").forEach((node) => {
            node.addEventListener("click", handleChatSendButtonClick)
            node.addEventListener("mousedown", handleNoHighlightButtonMouseDown)
        })
 
        const buttonSticker = root.querySelector(".nt-safe-space-chatroom-reply-toolbar-option.option-sticker"),
            buttonChat = root.querySelector(".nt-safe-space-chatroom-reply-toolbar-option.option-chat")
 
        if (!isFriendRace) {
            root.querySelector(".nt-safe-space-chatroom-reply-toolbar").classList.remove("friend-race")
            buttonChat.remove()
        }
 
        const chatMessages = root.querySelector(".nt-safe-space-chatroom-messages-scrollable")
 
        const refreshChatOptions = () => {
            root.querySelectorAll(".nt-safe-space-chatroom-reply-sticker-img").forEach((stickerItemContainer, i) => {
                if (isStickers) {
                    if (userStickers[i]) {
                        stickerItemContainer.parentNode.title = userStickers[i].name
                        stickerItemContainer.style.backgroundImage = `url(${userStickers[i].src})`
                    } else {
                        stickerItemContainer.parentNode.title = ""
                        stickerItemContainer.parentNode.style.display = "none"
                    }
                } else {
                    stickerItemContainer.style.backgroundImage = `url(/dist/site/images/chat/canned/chat_${i}.png)`
                    stickerItemContainer.parentNode.title = raceObj.props.chatTexts[i]
                    stickerItemContainer.parentNode.style.display = ""
                }
            })
        }
 
        const toggleChatOptions = (show) => {
            if (show) {
                chatMessages.parentNode.parentNode.classList.remove("hide-reply-options")
            } else {
                chatMessages.parentNode.parentNode.classList.add("hide-reply-options")
            }
        }
 
        const toggleChat = (show) => {
            if (show) {
                chatMessages.parentNode.parentNode.classList.remove("disable-reply")
            } else {
                chatMessages.parentNode.parentNode.classList.add("disable-reply")
            }
        }
 
        const flashChatButton = (index) => {
            const button = root.querySelector(`.nt-safe-space-chatroom-reply-sticker[data-stickerindex="${index}"]`)
            if (button) {
                if (chatButtonTimer[index]) {
                    clearTimeout(chatButtonTimer[index])
                }
                button.classList.add("nt-space-space-activated")
                chatButtonTimer[index] = setTimeout(() => {
                    button.classList.remove("nt-space-space-activated")
                }, 5e2)
            }
        }
 
        const addRacer = (user, status) => {
            const { userID } = user,
                { tag, tagColor, displayName, username, carID, carHueAngle } = user.profile,
                isMe = userID == currentUserID,
                isGold = user.profile.membership === "gold",
                isFriend = friendIDs && friendIDs.includes(userID) ? true : user.isFriend,
                imgCarSrc = raceObj.props.getCarUrl(carID, false, carHueAngle, false),
                newRacerElement = chatContactTemplate.cloneNode(true),
                newRacerTeamNode = newRacerElement.querySelector(".nt-safe-space-chatroom-message-team"),
                newRacerNameNode = newRacerElement.querySelector(".nt-safe-space-chatroom-message-name"),
                newRacerAvatarNode = newRacerElement.querySelector(".nt-safe-space-contact-avatar img"),
                newMuteButton = newRacerElement.querySelector(".nt-safe-space-btn-mute"),
                newBlockButton = newRacerElement.querySelector(".nt-safe-space-btn-block")
            newRacerElement.id = `${racerContactIDPrefix}${userID}`
            newRacerElement.dataset.user = userID
            newRacerNameNode.textContent = displayName || username
            newRacerAvatarNode.src = imgCarSrc
            newRacerAvatarNode.alt = `${displayName || username}'s car`
            if (isMe) {
                newRacerElement.classList.add("is-me")
                newRacerElement.querySelector(".nt-safe-space-contact-menu").remove()
            }
            if (tag) {
                newRacerTeamNode.textContent = `[${tag}]`
                newRacerTeamNode.style.color = `#${tagColor}`
            } else {
                newRacerTeamNode.remove()
            }
            if (!isGold) {
                newRacerNameNode.classList.remove("nt-gold-user")
                newRacerElement.querySelector(".icon-nt-gold-s").remove()
            }
            if (!isFriend) {
                newRacerElement.querySelector(".nt-safe-space-chatroom-message-friend").remove()
            }
            if (racerCount % 2 !== 0 || isMe) {
                newRacerElement.classList.add("alt-row")
            }
            if (status === "MUTE") {
                newMuteButton.classList.remove("nt-safe-space-btn-mute")
                newMuteButton.classList.add("nt-safe-space-btn-unmute")
                newMuteButton.querySelector(".nt-safe-space-contact-menu-label").textContent = "Unmute"
            }
            newMuteButton.addEventListener("click", handleContactOptionButtonClick)
            newBlockButton.addEventListener("click", handleContactOptionButtonClick)
            newMuteButton.addEventListener("mousedown", handleNoHighlightButtonMouseDown)
            newBlockButton.addEventListener("mousedown", handleNoHighlightButtonMouseDown)
 
            userData[userID] = user
 
            if (!isMe) {
                chatContacts.appendChild(newRacerElement)
                racerCount++
                safeSpaceContainer.classList.remove("nt-safe-space-chat-contacts-hidden")
            }
 
            return newRacerElement
        }
 
        const removeRacer = (userID) => {
            const contact = document.getElementById(`${racerContactIDPrefix}${userID}`)
            if (!contact || contact.classList.contains("is-me") || userID === currentUserID) {
                return
            }
            contact.remove()
 
            racerCount--
            if (racerCount === 0) {
                safeSpaceContainer.classList.add("nt-safe-space-chat-contacts-hidden")
            }
            root.querySelectorAll(".nt-safe-space-contact-item").forEach((node, i) => {
                if (i % 2 !== 0) {
                    node.classList.add("alt-row")
                } else {
                    node.classList.remove("alt-row")
                }
            })
        }
 
        const getRacer = (userID) => {
            return userData[userID]
        }
 
        const updateUser = (userID, status, user) => {
            if (updatingDB.includes(userID)) {
                return
            }
            user = user || raceObj.state.racers.find((r) => r.userID === userID)
            if (!user) {
                logging.warn("Chat")("User not found for sync", userID)
                return
            }
            const { tag, tagColor, displayName, username, title, membership, carID, carHueAngle } = user.profile,
                carImgSrc = raceObj.props.getCarUrl(carID, false, carHueAngle, false)
            updatingDB = updatingDB.concat(userID)
            return db.users
                .put({
                    id: userID,
                    username,
                    displayName,
                    isGold: membership === "gold",
                    title,
                    team: tag,
                    teamColor: tagColor,
                    carID: tagColor,
                    carHueAngle: tagColor,
                    carImgSrc,
                    status,
                })
                .then(() => {
                    updatingDB = updatingDB.filter((uid) => uid !== userID)
                    return true
                })
        }
 
        const muteUser = (userID) => {
            const user = raceObj.state.racers.find((r) => r.userID === userID)
            if (!user) {
                logging.warn("Chat")("Muting user not found", userID)
                return
            }
            updateUser(userID, "MUTE").then(() => {
                addMessage("system", user, "Has been muted =)")
                const muteButton = root.querySelector(`#${racerContactIDPrefix}${userID} .nt-safe-space-btn-mute`)
                muteButton.classList.remove("nt-safe-space-btn-mute")
                muteButton.classList.add("nt-safe-space-btn-unmute")
                muteButton.querySelector(".nt-safe-space-contact-menu-label").textContent = "Unmute"
            })
        }
 
        const unmuteUser = (userID) => {
            if (updatingDB.includes(userID)) {
                return
            }
            const user = raceObj.state.racers.find((r) => r.userID === userID)
            if (!user) {
                logging.warn("Chat")("Muting user not found", userID)
                return
            }
            updatingDB = updatingDB.concat(userID)
            db.users.delete(user.userID).then(() => {
                addMessage("system", user, "Has been unmuted =)")
                updatingDB = updatingDB.filter((uid) => uid !== userID)
                const muteButton = root.querySelector(`#${racerContactIDPrefix}${userID} .nt-safe-space-btn-unmute`)
                muteButton.classList.remove("nt-safe-space-btn-unmute")
                muteButton.classList.add("nt-safe-space-btn-mute")
                muteButton.querySelector(".nt-safe-space-contact-menu-label").textContent = "Mute"
            })
        }
 
        const blockUser = (userID) => {
            const user = raceObj.state.racers.find((r) => r.userID === userID)
            if (!user) {
                logging.warn("Chat")("Muting user not found", userID)
                return
            }
            updateUser(userID, "BLOCK").then(() => {
                addMessage("system", user, "Has been blocked =)")
                removeRacer(userID)
            })
        }
 
        // Chat Contact Template
        const chatContacts = root.querySelector(".nt-safe-space-contacts"),
            chatContactTemplate = document.createElement("div")
        chatContactTemplate.classList.add("nt-safe-space-contact-item")
        chatContactTemplate.innerHTML = `
            <div class="nt-safe-space-contact-item-name">
                <img class="icon icon-nt-gold-s" src="/dist/site/images/themes/profiles/gold/nt-gold-icon-xl.png" alt="Nitro Gold">
                <span class="nt-safe-space-chatroom-message-team"></span>
                <span class="nt-safe-space-chatroom-message-name nt-gold-user"></span>
                <span class="nt-safe-space-chatroom-message-friend">${friendIconSVG}</span>
            </div>
            <div class="nt-safe-space-contact-item-body">
                <div class="nt-safe-space-contact-player">
                    <div class="nt-safe-space-contact-avatar">
                        <img />
                    </div>
                    <div class="nt-safe-space-contact-speech-bubble nt-safe-space-hidden">
                        <div class="nt-safe-space-contact-speech-bubble-img"></div>
                    </div>
                </div>
                <div class="nt-safe-space-contact-menu">
                    <button class="nt-safe-space-contact-menu-item nt-safe-space-btn nt-safe-space-btn-mute">
                        <span class="nt-safe-space-contact-menu-icon">${muteIconSVG}</span>
                        <span class="nt-safe-space-contact-menu-label">Mute</span>
                    </button>
                    <button class="nt-safe-space-contact-menu-item nt-safe-space-btn nt-safe-space-btn-block">
                        <span class="nt-safe-space-contact-menu-icon">${blockIconSVG}</span>
                        <span class="nt-safe-space-contact-menu-label">Block</span>
                    </button>
                 </div>
            </div>`
 
        const handleContactOptionButtonClick = (e) => {
            e.preventDefault()
            const targetElement = e.target.closest(".nt-safe-space-btn"),
                userContact = e.target.closest(".nt-safe-space-contact-item"),
                targetUserID = parseInt(userContact?.dataset.user, 10)
            if (!targetUserID) {
                return
            }
            if (targetElement.classList.contains("nt-safe-space-btn-mute")) {
                muteUser(targetUserID)
            } else if (targetElement.classList.contains("nt-safe-space-btn-unmute")) {
                unmuteUser(targetUserID)
            } else if (targetElement.classList.contains("nt-safe-space-btn-block")) {
                blockUser(targetUserID)
            }
        }
 
        // Chat Message Template
        const chatMessageTemplate = document.createElement("div")
        chatMessageTemplate.classList.add("nt-safe-space-chatroom-message")
        chatMessageTemplate.innerHTML = `
            <div class="nt-safe-space-chatroom-message-heading">
                <img class="icon icon-nt-gold-s" src="/dist/site/images/themes/profiles/gold/nt-gold-icon-xl.png" alt="Nitro Gold">
                <span class="nt-safe-space-chatroom-message-team"></span>
                <span class="nt-safe-space-chatroom-message-name nt-gold-user"></span>
                <span class="nt-safe-space-chatroom-message-friend">${friendIconSVG}</span>
                <div class="nt-safe-space-chatroom-message-time"></div>
            </div>
            <div class="nt-safe-space-chatroom-message-body">
                <span class="nt-safe-space-chatroom-message-text"></span>
                <div class="nt-safe-space-chatroom-mesasge-img"></div>
            </div>`
 
        const chatNameTemplate = chatMessageTemplate.querySelector(".nt-safe-space-chatroom-message-heading").cloneNode(true)
        chatNameTemplate.querySelector(".nt-safe-space-chatroom-message-time").remove()
 
        // Setup Custom Sticker Shortcut Handler
        const handleKeyPress = (t, n) => {
            if (t !== "keydown") {
                return false
            }
            let selectedButton
            const { key } = n
 
            if (key.toLowerCase() === "s") {
                selectedButton = buttonSticker
            } else if (key.toLowerCase() === "c" && isFriendRace) {
                selectedButton = buttonChat
            }
            if (selectedButton) {
                if (selectedButton.classList.contains("selected")) {
                    selectedButton.classList.remove("selected")
                    toggleChatOptions(false)
                    return false
                }
                toggleChatOptions(true)
                isStickers = selectedButton.classList.contains("option-sticker")
                refreshChatOptions()
                root.querySelectorAll(".nt-safe-space-chatroom-reply-toolbar-option").forEach((optionElement) => {
                    optionElement.classList.remove("selected")
                })
                selectedButton.classList.add("selected")
                return false
            }
 
            // Handle Chat Send (if the menu is opened)
            const selected = root.querySelector(".nt-safe-space-chatroom-reply-toolbar-option.selected")
            if (!selected) {
                return false
            }
            if (/^[1-8]$/.test(key) && raceKeyboardObj) {
                const index = parseInt(key - 1, 10)
                if (isStickers) {
                    originalChatObj.sendMessage(userStickers[index].id, userStickers[index].src, "sticker")
                } else {
                    originalChatObj.sendMessage(index, raceObj.props.chatTexts[index], "text")
                }
                flashChatButton(index)
                return false
            }
        }
 
        const addMessage = (type, user, message, imgSrc) => {
            const { userID } = user,
                { tag, tagColor, displayName, username } = user.profile,
                isMe = userID == currentUserID,
                isGold = user.profile.membership === "gold",
                isFriend = friendIDs && friendIDs.includes(userID) ? true : user.isFriend,
                newMessageElement = chatMessageTemplate.cloneNode(true),
                stamp = new Date(),
                newMessageTeamNode = newMessageElement.querySelector(".nt-safe-space-chatroom-message-team"),
                newMessageNameNode = newMessageElement.querySelector(".nt-safe-space-chatroom-message-name"),
                newMessageTextNode = newMessageElement.querySelector(".nt-safe-space-chatroom-message-text"),
                newMessageImageNode = newMessageElement.querySelector(".nt-safe-space-chatroom-mesasge-img")
            newMessageElement.querySelector(".nt-safe-space-chatroom-message-time").textContent = `- ${stamp.toLocaleTimeString("en-US")}`
            newMessageElement.dataset.user = userID
            newMessageNameNode.textContent = displayName || username
            newMessageTextNode.textContent = message
            if (isMe) {
                newMessageElement.classList.add("is-me")
            }
            if (tag) {
                newMessageTeamNode.textContent = `[${tag}]`
                newMessageTeamNode.style.color = `#${tagColor}`
            } else {
                newMessageTeamNode.remove()
            }
            if (!isGold) {
                newMessageNameNode.classList.remove("nt-gold-user")
                newMessageElement.querySelector(".icon-nt-gold-s").remove()
            }
            if (!isFriend) {
                newMessageElement.querySelector(".nt-safe-space-chatroom-message-friend").remove()
            }
            if (type === "system") {
                newMessageTextNode.classList.add("system-message")
            }
            if (imgSrc) {
                newMessageImageNode.style.backgroundImage = `url(${imgSrc})`
            } else {
                newMessageImageNode.remove()
            }
 
            chatMessages.appendChild(newMessageElement)
            chatMessages.scrollTop = chatMessages.scrollHeight
        }
 
        // Return Chat component
        return {
            root: root,
            systemUser,
            addRacer,
            removeRacer,
            getRacer,
            addMessage,
            updateUser,
            assignStickers: (stickers = []) => {
                userStickers = stickers
                refreshChatOptions()
            },
            enableKeyListener: (kbObj, chatObj) => {
                if (!kbObj) {
                    throw new Error("Keyboard React Object is required")
                }
                if (!chatObj) {
                    throw new Error("Chat React Object is required")
                }
                originalChatObj = chatObj
                raceKeyboardObj = kbObj
                raceKeyboardObj.input.initialize({
                    boundElement: raceKeyboardObj.typingInputRef.current,
                    keyHandler: (t, n) => {
                        let continueEvent = true
                        if (!raceKeyboardObj.props.started) {
                            continueEvent = handleKeyPress(t, n)
                        }
                        if (continueEvent) {
                            raceKeyboardObj.handleKeyPress(t, n)
                        }
                    },
                })
            },
            disableChat: () => {
                toggleChat(false)
                if (raceKeyboardObj) {
                    raceKeyboardObj.input.initialize({
                        boundElement: raceKeyboardObj.typingInputRef.current,
                        keyHandler: raceKeyboardObj.handleKeyPress,
                    })
                }
            },
            displaySpeechBubble: (userID, imgSrc) => {
                const speechBubble = document.querySelector(`#${racerContactIDPrefix}${userID} .nt-safe-space-contact-speech-bubble-img`)
                if (speechBubble) {
                    if (userSpeechBubbleTimer[userID]) {
                        clearTimeout(userSpeechBubbleTimer[userID])
                    }
                    speechBubble.style.backgroundImage = `url(${imgSrc})`
                    speechBubble.parentNode.classList.remove("nt-safe-space-hidden")
                    userSpeechBubbleTimer[userID] = setTimeout(() => {
                        speechBubble.parentNode.classList.add("nt-safe-space-hidden")
                        userSpeechBubbleTimer[userID] = null
                    }, 4e3)
                }
            },
            getChatUser: (userID) => {
                return db.users.get(userID)
            },
        }
    })(root, raceObj, db)
 
    /** Displays Information about Race Status and Results. */
    const InfoSection = (() => {
        const root = document.createElement("div")
        root.classList.add("nt-safe-space-info")
        root.innerHTML = `
            <div class="nt-safe-space-info-status">
                <div class="nt-safe-space-info-status-title">Setting up Typing Test</div>
                <div class="nt-safe-space-info-status-subtitle"></div>
                <div class="nt-safe-space-info-status-wampus"><img src="/images/loot/sticker_1630508306.png" alt="Laughing Wampus" /></div>
            </div>
            <div class="nt-safe-space-info-footer">
            </div>`
 
        const status = root.querySelector(".nt-safe-space-info-status"),
            statusTitle = root.querySelector(".nt-safe-space-info-status-title"),
            statusSubTitle = root.querySelector(".nt-safe-space-info-status-subtitle"),
            statusWampus = root.querySelector(".nt-safe-space-info-status-wampus"),
            statusFooter = root.querySelector(".nt-safe-space-info-footer")
 
        statusSubTitle.remove()
        statusWampus.remove()
 
        const updateStatusTitle = (text) => {
            statusTitle.textContent = text
        }
 
        const updateStatusSubTitle = (text) => {
            if (text) {
                statusSubTitle.textContent = text
                if (statusWampus.isConnected) {
                    statusWampus.before(statusSubTitle)
                } else {
                    status.append(statusSubTitle)
                }
            } else {
                statusSubTitle.remove()
            }
        }
 
        const updatePlayer = (node) => {
            statusFooter.append(node)
        }
 
        const toggleWampus = (show) => {
            if (show) {
                status.append(statusWampus)
            } else {
                statusWampus.remove()
            }
        }
 
        const COUNTDOWN_STATES = [["Get Ready!", "It's Typing Test Time! Get ready..."], ["3..."], ["2..."], ["1..."], ["Let's Go!", "Go go go! GLHF!"]]
        let countdownTimer,
            lastCountdown = 0
 
        const updateText = (state, chat) => {
            let [status, systemChatMessage] = COUNTDOWN_STATES[state]
            systemChatMessage = systemChatMessage || status
            chat.addMessage("system", chat.systemUser, systemChatMessage)
            updateStatusTitle(status)
        }
 
        return {
            root,
            updateStatusTitle,
            updateStatusSubTitle,
            updatePlayer,
            toggleWampus,
            startCountdown: (chat) => {
                if (countdownTimer) {
                    logging.warn("Status")("You can only initiate countdown once")
                    return
                }
                lastCountdown = 0
                updateText(lastCountdown, chat)
                countdownTimer = setInterval(() => {
                    if (lastCountdown + 1 < COUNTDOWN_STATES.length - 1) {
                        updateText(++lastCountdown, chat)
                    }
                }, 1e3)
            },
            stopCountdown: (chat) => {
                clearTimeout(countdownTimer)
                lastCountdown = COUNTDOWN_STATES.length - 1
                updateText(lastCountdown, chat)
            },
        }
    })()
 
    ////////////////////////
    //  Backend Handling  //
    ////////////////////////
 
    let disqualifiedUsers = [],
        reloadRaceRequested = false,
        canReloadRace = false,
        isWampusRace = false
 
    const server = raceObj.server,
        currentUserID = raceObj.props.user.userID,
        friendIDs = raceObj.props.friendIDs,
        stickerList = raceObj.stickers,
        chatTextList = raceObj.props.chatTexts
 
    /** Reload next race earlier than usual. */
    const requestNextRaceASAP = (e) => {
        ChatRoom.addMessage("system", ChatRoom.systemUser, "No don't leave me :(")
        if (canReloadRace) {
            InfoSection.updateStatusSubTitle("Starting new race...")
            raceObj.raceAgain(e)
            return
        }
        reloadRaceRequested = true
        InfoSection.updateStatusSubTitle("Loading new race, please wait...")
    }
 
    /** Key Event handler to allow early race reloading. */
    const nextRaceASAPKeyHandler = (e) => {
        if (e.key === "Enter") {
            window.removeEventListener("keypress", nextRaceASAPKeyHandler)
            requestNextRaceASAP(e)
        }
    }
 
    // Setup User's stickers
    let userStickers = raceObj.userStickers
        .filter((s) => s.equipped)
        .sort((a, b) => a.equipped - b.equipped)
        .map((s) => s.lootID)
    if (userStickers.length === 0) {
        userStickers = raceObj.props.lootConfig.sticker.defaults
    }
    ChatRoom.assignStickers(
        userStickers.map((id) => {
            const s = raceObj.props.loot.find((s) => s.lootID === id)
            return {
                id,
                name: s.name,
                src: s.options.src,
            }
        })
    )
 
    // Track Speed Range and Race Mode
    server.on("setup", (e) => {
        if (typeof e.trackLeader === "string" && e.trackLeader !== "") {
            if (e.trackLeader === raceObj.props.user.username) {
                InfoSection.updateStatusTitle("Creating Friendly Typing Test")
            } else {
                InfoSection.updateStatusTitle("Joining Friendly Typing Test")
            }
        }
 
        let subTitle = ""
        if ((typeof e.trackLeader !== "string" || e.trackLeader !== raceObj.props.user.username) && e.scores && e.scores.length === 2) {
            const [from, to] = e.scores
            subTitle = `Speed Range: ${from} WPM - ${to} WPM`
        } else {
            subTitle = `${e.scoringMode.toUpperCase()} mode`
            server.on("settings", (e) => {
                InfoSection.updateStatusSubTitle(`${e.scoringMode.toUpperCase()} mode`)
            })
        }
        if (subTitle) {
            InfoSection.updateStatusSubTitle(subTitle)
        }
    })
 
    // Track Race Status
    server.on("status", (e) => {
        const raceStatus = e.status
        if (raceStatus === "countdown") {
            logging.info("Racing")("Start countdown")
            if (isWampusRace) {
                InfoSection.toggleWampus(false)
            }
            InfoSection.startCountdown(ChatRoom)
        } else if (raceStatus === "racing") {
            logging.info("Racing")("Start racing")
            InfoSection.stopCountdown(ChatRoom)
            ChatRoom.disableChat()
 
            const lastLetter = raceContainer.querySelector(".dash-copy .dash-word:last-of-type .dash-letter:nth-last-of-type(2)")
            if (lastLetter) {
                lastLetterObserver.observe(lastLetter, { attributes: true })
            } else {
                logging.warn("Init")("Unable to setup finish race tracker")
            }
        }
    })
 
    // Track New Racers
    server.on("joined", (user) => {
        if (user.robot) {
            if (user.profile.specialRobot === "wampus") {
                isWampusRace = true
                InfoSection.toggleWampus(true)
            }
            return
        }
        ChatRoom.getChatUser(user.userID).then((data) => {
            if (!data || data.status !== "BLOCK") {
                const chatNode = ChatRoom.addRacer(user, data?.status)
                if (user.userID === currentUserID) {
                    InfoSection.updatePlayer(chatNode)
                }
                ChatRoom.addMessage("system", user, "Has joined the chatroom")
            }
            if (data?.status === "MUTE") {
                ChatRoom.addMessage("system", user, "Has been muted =)")
            }
            if (data?.status === "BLOCK") {
                logging.info("Chat")("This user is blocked", JSON.stringify(user))
            }
            if (data) {
                ChatRoom.updateUser(user.userID, data.status, user).then(() => {
                    logging.info("Chat")(`Sync user details (${data.status})`, JSON.stringify(user))
                })
            }
        })
    })
 
    // Track Players Leaving (Friend Race)
    server.on("left", (e) => {
        if (!e) {
            return
        }
        ChatRoom.getChatUser(e).then((data) => {
            if (data?.status !== "BLOCK") {
                const user = ChatRoom.getRacer(e)
                if (user) {
                    ChatRoom.addMessage("system", user, "Has left the chatroom =(")
                }
            }
        })
        ChatRoom.removeRacer(e)
    })
 
    // Track New Chat Messages
    server.on("chat", (e) => {
        const user = raceObj.state.racers.find((r) => r.userID === e.from)
        if (!user) {
            logging.warn("Chat")("Received message from unknown user", JSON.stringify(e))
            return
        }
        ChatRoom.getChatUser(user.userID).then((data) => {
            let message, imgSrc
            if (e.chatType === "sticker" && stickerList) {
                const sticker = stickerList.find((s) => s.lootID === e.chatID)
                if (sticker) {
                    message = sticker.name
                    imgSrc = sticker.options.src
                }
            } else if (e.chatType === "text" && chatTextList) {
                message = chatTextList[e.chatID]
                imgSrc = `/dist/site/images/chat/canned/chat_${e.chatID}.png`
            } else {
                message = "???"
            }
            if (!data || !["MUTE", "BLOCK"].includes(data.status)) {
                ChatRoom.addMessage("msg", user, message, imgSrc)
                ChatRoom.displaySpeechBubble(user.userID, imgSrc)
            } else {
                logging.info("Chat")(`${data.status} message received`, JSON.stringify({ ...e, message, imgSrc }))
            }
        })
    })
 
    // Track Racing Updates for disqualify and completion
    server.on("update", (e) => {
        e?.racers?.forEach((user) => {
            if (!user.robot && user.disqualified && !disqualifiedUsers.includes(user.userID)) {
                disqualifiedUsers = disqualifiedUsers.concat(user.userID)
                ChatRoom.getChatUser(user.userID).then((data) => {
                    if (data?.status !== "BLOCK") {
                        ChatRoom.addMessage("system", user, "Has left the chatroom =(")
                    }
                })
            }
            if (user.userID === currentUserID && user.progress.completeStamp > 0 && user.profile && !canReloadRace && !raceContainer.querySelector(".race-results")) {
                if (reloadRaceRequested) {
                    InfoSection.updateStatusSubTitle("Starting new race...")
                    raceObj.raceAgain(e)
                } else {
                    canReloadRace = true
                }
            }
        })
    })
 
    /** Rank suffixes for Race Result. */
    const RANK_SUFFIX = ["st", "nd", "rd"]
 
    /** Mutation obverser to track whether results screen showed up. */
    const resultObserver = new MutationObserver(([mutation], observer) => {
        for (const newNode of mutation.addedNodes) {
            if (newNode.classList?.contains("race-results")) {
                observer.disconnect()
                window.removeEventListener("keypress", nextRaceASAPKeyHandler)
 
                const currentUserResult = raceObj.state.racers.find((r) => r.userID === currentUserID)
                if (!currentUserResult || !currentUserResult.progress || typeof currentUserResult.place === "undefined") {
                    logging.warn("Finish")("Unable to find race results")
                    return
                }
 
                const resultMain = raceContainer.querySelector(".raceResults"),
                    resultContainer = resultMain.parentNode,
                    obj = resultContainer ? findReact(resultContainer) : null
                if (!resultContainer || !obj) {
                    logging.warn("Finish")("Unable to hide result screen by default")
                    return
                }
                resultMain.style.marginLeft = "-10000px"
                resultContainer.classList.add("is-minimized", "has-minimized")
                obj.state.isHidden = true
                obj.state.hasMinimized = true
 
                setTimeout(() => {
                    resultMain.style.marginLeft = ""
                }, 500)
 
                const { typed, skipped, startStamp, completeStamp, errors } = currentUserResult.progress,
                    wpm = Math.round((typed - skipped) / 5 / ((completeStamp - startStamp) / 6e4)),
                    time = ((completeStamp - startStamp) / 1e3).toFixed(2),
                    acc = ((1 - errors / (typed - skipped)) * 100).toFixed(2),
                    points = Math.round((100 + wpm / 2) * (1 - errors / (typed - skipped))),
                    place = currentUserResult.place,
                    rankSuffix = place >= 1 && place <= 3 ? RANK_SUFFIX[place - 1] : "th"
                InfoSection.updateStatusTitle("Race Results")
                InfoSection.updateStatusSubTitle(`${place}${rankSuffix} | ${acc}% Acc | ${wpm} WPM | ${points} points | ${time} secs`)
 
                logging.info("Finish")("Display Alternative Result Screen")
                break
            }
        }
    })
 
    /** Mutation observer to track whether last letter was typed (just finished race). */
    const lastLetterObserver = new MutationObserver(([mutation], observer) => {
        if (mutation.target.classList.contains("is-correct")) {
            observer.disconnect()
            window.addEventListener("keypress", nextRaceASAPKeyHandler)
            InfoSection.updateStatusTitle("Finished")
            if (isWampusRace) {
                InfoSection.toggleWampus(true)
            }
            ChatRoom.addMessage("system", ChatRoom.systemUser, "Done! Time to review your result :)")
            resultObserver.observe(raceContainer, { childList: true })
        }
    })
 
    /////////////
    //  Final  //
    /////////////
 
    // Hide chat (Nitro Type will break if the DOM element is removed)
    const registerChatNode = (node, inputNode) => {
        if (!node?.classList?.contains("raceChat")) {
            if (node !== null) {
                logging.warn("Init")("Invalid node element for registering chat.")
            }
            return
        }
 
        const raceKeyboardObj = findReact(inputNode),
            originalChatObj = findReact(node)
        node.style.display = "none"
        if (raceKeyboardObj && originalChatObj) {
            ChatRoom.enableKeyListener(raceKeyboardObj, originalChatObj)
        } else {
            logging.warn("Init")("Unable to overwrite chat system")
        }
    }
    const typingInputObserver = new MutationObserver((mutations, observer) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.classList?.contains("dash-copy-input")) {
                    observer.disconnect()
                    const raceChatNode = raceContainer.querySelector(".raceChat")
                    if (raceChatNode) {
                        registerChatNode(raceChatNode, node)
                    } else {
                        logging.warn("Init")("Unable to overwrite chat system")
                    }
                    break
                }
            }
        }
    })
 
    const raceChatNode = raceContainer.querySelector(".raceChat"),
        typingInputNode = raceContainer.querySelector(".dash-copy-input")
    if (raceChatNode && typingInputNode) {
        registerChatNode(raceChatNode, typingInputNode)
    } else {
        typingInputObserver.observe(raceContainer.querySelector(".dash-center"), { childList: true })
    }
 
    // Setup Race Track
    root.append(InfoSection.root, ChatRoom.root)
 
    // Replace Race Track
    canvasTrack.replaceWith(root)
 
    logging.info("Init")("Race Track has been updated")
}