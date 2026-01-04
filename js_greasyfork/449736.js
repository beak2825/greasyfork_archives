// ==UserScript==
// @name         Nitro Type - Team Page Badge Fixes
// @version      0.1.1
// @description  Removes Top Team badge on the members table.
// @author       Toonidy
// @match        *://*.nitrotype.com/team/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @require      https://greasyfork.org/scripts/443718-nitro-type-userscript-utils/code/Nitro%20Type%20Userscript%20Utils.js?version=1042360
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/449736/Nitro%20Type%20-%20Team%20Page%20Badge%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/449736/Nitro%20Type%20-%20Team%20Page%20Badge%20Fixes.meta.js
// ==/UserScript==

/* global findReact NTGLOBALS */

const badgeObserverCallbackFn = (mutations) => {
    for (const m of mutations) {
        for (const node of m.addedNodes) {
            if (node.className !== "prxxs" || !node.querySelector("img.db")) {
                continue
            }
            node.hidden = true
            return
        }
    }
}

const cleanupMemberTable = (observer) => {
    const root = document.querySelector("#root section.card"),
        reactObj = root ? findReact(root) : null
    if (!root || !reactObj) {
        return false
    }

    observer?.disconnect()

    const { members, info } = reactObj.props

    if (!(info.teamID in NTGLOBALS.TOP_PLAYERS.teams)) {
        return true
    }

    document.querySelectorAll("#root td.table-cell--racer div.bucket-content").forEach((node, i) => {
        if (!(members[i].userID in NTGLOBALS.TOP_PLAYERS.users)) {
            const imgNode = node.querySelector(".prxxs img.db")?.parentNode
            if (imgNode) {
                imgNode.hidden = true

                const checkNode = node.querySelector(".df.df--align-center")
                if (checkNode) {
                    const badgeObesrver = new MutationObserver(badgeObserverCallbackFn)
                    badgeObesrver.observe(checkNode, { childList: true })
                }
            }
        }
    })
    return true
}
cleanupMemberTable()

const teamPageObserver = new MutationObserver((_, observer) => cleanupMemberTable(observer))
teamPageObserver.observe(document.querySelector("#root main.structure-content"), { childList: true })
