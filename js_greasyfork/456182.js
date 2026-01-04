// ==UserScript==
// @name     HackerNews Post Hider (based on post Domains and Titles)
// @match https://news.ycombinator.com/
// @match https://news.ycombinator.com/?p=*
// @match https://news.ycombinator.com/front*
// @version  2.2
// @grant    none
// @namespace ahappyviking
// @license MIT
// @description Simply hides posts with specific user-specified domains or title keywords on HackerNews front page
// @icon https://www.kindpng.com/picc/m/61-613142_see-no-evil-monkey-icon-monkey-eyes-closed.png
// @downloadURL https://update.greasyfork.org/scripts/456182/HackerNews%20Post%20Hider%20%28based%20on%20post%20Domains%20and%20Titles%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456182/HackerNews%20Post%20Hider%20%28based%20on%20post%20Domains%20and%20Titles%29.meta.js
// ==/UserScript==

let hiddenDomains = ["dailymail.co.uk", "cbsnews.com"]
let hiddenTitleKeywords = ["chatgpt", "gpt", "llm", "ai-", "claude", "ai ", " agi "] //These should stay lowercase...

function hncleaner_main() {

    let numberOfBlocked = 0

    //First blocking based on domains...
    let posts = document.getElementsByClassName("athing")
    for (let post of posts) {
        let hasBeenHidden = false;

        //Check the title first...
        let titleHolder = post.querySelector(".titleline")
        const title = titleHolder.firstChild.textContent.toLocaleLowerCase()
        for (const word of hiddenTitleKeywords) {
            if (!title.includes(word)) continue;
            hidepost_hidePost(post)
            numberOfBlocked++
            hasBeenHidden = true
            break
        }

        if (hasBeenHidden) continue
        let link = post.querySelector(".sitestr")
        if (link && hiddenDomains.includes(link.innerHTML)) {
            hidepost_hidePost(post)
            numberOfBlocked++
        }
    }
    if (numberOfBlocked) {
        hncleaner_addBlockCount(numberOfBlocked);
    }
}

function hncleaner_createBlockNotice() {
    //Actually decided to have this return null just to make things cleaner
    const notice = document.createElement("div");
    return notice
}

function hidepost_hidePost(owner) {
    owner.nextElementSibling?.nextElementSibling?.remove() //Removing "spacer" element
    owner.nextElementSibling?.remove() //Removing comments
    owner.replaceWith(hncleaner_createBlockNotice()) //Removing title
}

function hncleaner_addBlockCount(blockCount) {
    const text = document.createElement("p")
    text.style.margin = "0 0 8 0"
    text.style.userSelect = "none"
    text.innerText = `Hidden posts: ${blockCount}`
    text.style.color = "grey"
    text.style.fontSize = "10px"
    document.getElementById("bigbox")?.before(text)
}

hncleaner_main()