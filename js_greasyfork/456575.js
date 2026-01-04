// ==UserScript==
// @name         Geoguessr Better Menu
// @namespace    https://greasyfork.org/en/users/997484-aimee4737
// @version      2.7
// @description  Adds a menu bar to Geoguessr's new UI
// @author       aimee
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @run-at       document-start
// @grant        none
// @license      MIT
// @require https://update.greasyfork.org/scripts/460322/1246943/Geoguessr%20Styles%20Scan.js
// @downloadURL https://update.greasyfork.org/scripts/456575/Geoguessr%20Better%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/456575/Geoguessr%20Better%20Menu.meta.js
// ==/UserScript==

// ======================================== DO NOT EDIT OUTSIDE THIS SECTION UNLESS YOU KNOW WHAT YOU ARE DOING ========================================

// menu items (can customise following the same structure as the others)
// const [variable name] = `<a href="[link]"> [name to show in menu] </a>`
const singleplayer = `<a href="/singleplayer"> Singleplayer </a>`
const multiplayer = `<a href="/multiplayer"> Multiplayer </a>`
const party = `<a href="/play-with-friends"> Party </a>`
const quiz = `<a href="/quiz"> Quiz </a>`
const ongoing_games = `<a href="/me/current"> Ongoing Games </a>`
const activities = `<a href="/me/activities"> Activities </a>`
const my_maps = `<a href="/me/maps"> My Maps </a>`
const liked_maps = `<a href="/me/likes"> Liked Maps </a>`
const new_party = `<a href="/party"> Party </a>`
const profile = `<a href="/me/profile"> Profile </a>`
const badges = `<a href="/me/badges"> Badges </a>`
const account = `<a href="/me/settings"> Account </a>`
const shop = `<a href="/shop"> Shop </a>`
const community = `<a href="/community"> Community </a>`
const explorer = `<a href="/explorer"> Explorer </a>`
const daily_challenge = `<a href="/daily-challenges"> Daily Challenge </a>`
const streaks = `<a href="/streaks"> Streaks </a>`

// items to show in menu (can customise list using variable names defined above)
const items = [liked_maps, ongoing_games, multiplayer, shop]

// ======================================================================================================================================================

async function setup(items) {
    await scanStyles();

    const start = `<div class="` + cn("slanted-wrapper_root__") + ` ` + cn("slanted-wrapper_variantGrayTransparent__") + `">
               <div class="` + cn("slanted-wrapper_start__") + ` ` + cn("slanted-wrapper_right__") + `"></div>
               <div class="` + cn("page-label_labelWrapper__") + `">
               <div style="--fs:var(--font-size-12);--lh:var(--line-height-12)" class="` + cn("label_label__") + `">`

    const end = `</div></div><div class="` + cn("slanted-wrapper_end__") + ` ` + cn("slanted-wrapper_right__") + `"></div></div>`
    let html = ""
    for (let item of items) {
        html = html + start + item + end
    }

    return html
}

const refresh = () => {

    // only refreshes if not loading
    if (document.querySelector("[class^='page-loading_loading__']")) return;

    // if header exists
    if (document.querySelector("[class^='header_header__']")) {
        const header = document.querySelector("[class^='header_header__']")

        // hides promos
        if (document.querySelector("[class^='header_promoDealButtonWrapper__']")) {
            document.querySelector("[class^='header_promoDealButtonWrapper__']").style.display = "none"
        }

        // hides existing page labels
        if (document.querySelectorAll("[class^='header_pageLabel__']").length > 1) {
            document.querySelectorAll("[class^='header_pageLabel__']")[1].style.display = "none"
        }

        // adds new page labels
        if (!document.querySelector("[class^='newItems']")) {

            let menu = document.createElement("div")
            menu.classList.add(cn("header_pageLabel__"))
            menu.style.display = "flex"
            header.childNodes[1].before(menu)

            // creates new div from html
            const newItems = document.createElement("div")
            newItems.className = "newItems"
            setup(items).then(function(result) { newItems.innerHTML = result })
            newItems.style.display = "flex"

            // prepends new div
            menu.prepend(newItems)
        }

        header.style.display = "grid"
        header.style.gridAutoFlow = "column"

        // highlights active menu item
        if (document.querySelector(".newItems")) {
            let url = window.location.href
            const newItems = document.querySelector(".newItems")
            for (let i = 0; i < newItems.childNodes.length; i++) {
                let link = newItems.childNodes[i].querySelector("a")
                link.style.color = "white"
                newItems.childNodes[i].classList.remove(cn("slanted-wrapper_variantWhite__"))
                newItems.childNodes[i].classList.add(cn("slanted-wrapper_variantGrayTransparent__"))
                if (link.href == url) {
                    link.style.color = "#1a1a2e"
                    newItems.childNodes[i].classList.remove(cn("slanted-wrapper_variantGrayTransparent__"))
                    newItems.childNodes[i].classList.add(cn("slanted-wrapper_variantWhite__"))
                }
            }
        }
    }

    if (document.querySelector("[class^='footer_footer__']")) {
        document.querySelector("[class^='footer_footer__']").style.display = "none"
    }

    if (document.querySelector("[class^='signed-in-start-page_avatar__']")) {
        document.querySelector("[class^='signed-in-start-page_avatar__']").style.display = "none"
    }

    if (document.querySelector("[class^='signed-in-start-page_playDailyReminder__']")) {
        document.querySelector("[class^='signed-in-start-page_playDailyReminder__']").style.display = "none"
    }
}

let observer = new MutationObserver((mutations) => {
    refresh();
});

observer.observe(document.body, {
    characterDataOldValue: false,
    subtree: true,
    childList: true,
    characterData: false
});