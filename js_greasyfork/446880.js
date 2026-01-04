// ==UserScript==
// @name         Nitro Type - Leaderboard Team Banned Label
// @version      0.1.0
// @description  Displays "HAS BANNED MEMBER" next to any team with at least one banned player.
// @author       Toonidy
// @match        *://*.nitrotype.com/leaderboards
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/446880/Nitro%20Type%20-%20Leaderboard%20Team%20Banned%20Label.user.js
// @updateURL https://update.greasyfork.org/scripts/446880/Nitro%20Type%20-%20Leaderboard%20Team%20Banned%20Label.meta.js
// ==/UserScript==

const TAG_BRACKET_REGEXP = /^\[|\]$/g

const scanTable = () => {
    document.querySelectorAll("#root tbody .table-row td.table-cell--tag").forEach((node) => {
        const tag = node.textContent.replace(TAG_BRACKET_REGEXP, "")
        if (!tag || tag === "EMPTY") {
            return
        }
        fetch(`/api/v2/teams/${tag}`).then((r) => r.json()).then((r) => {
            const numBanned = r.results?.members?.filter((m) => m.status === "banned")?.length || 0
            if (!numBanned) {
                return
            }
            console.log(node.lastElementChild)
            node.nextElementSibling.lastElementChild?.classList.add("prxxs")

            const label = document.createElement("small")
            label.textContent = `HAS ${numBanned} BANNED MEMBER${numBanned != 1 ? "S" : ""}`
            node.nextElementSibling.append(label)
        })
    })
}

const leaderboardPageObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
        for (const newNode of m.addedNodes) {
            if (newNode.classList?.contains("table--leaderboard")) {
                console.log("Table Update", newNode)
                scanTable()
                return
            }
        }
    }
})

leaderboardPageObserver.observe(document.querySelector("#root"), { childList: true, subtree: true })