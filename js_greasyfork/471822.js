// ==UserScript==
// @name         Copy JIRA task link
// @namespace    https://avito.ru/
// @version      0.6
// @description  JIRA command bar copy button
// @author       NoSilence
// @license      MIT
// @match        https://jr.avito.ru/browse/*
// @downloadURL https://update.greasyfork.org/scripts/471822/Copy%20JIRA%20task%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/471822/Copy%20JIRA%20task%20link.meta.js
// ==/UserScript==

(function() {
    "use strict"

    const TEXT_PREFIX = ""

    const TEXT_TASK_TYPE_DEFAULT = ":jira_new: "
    const TEXT_TASK_TYPE_IMPROVEMENT = TEXT_TASK_TYPE_DEFAULT
    const TEXT_TASK_TYPE_BUG = ":jira-"

    const TEXT_BUG_PRIORITY_P0 = "p0: "
    const TEXT_BUG_PRIORITY_P1 = "p1: "
    const TEXT_BUG_PRIORITY_P2 = "p2: "
    const TEXT_BUG_PRIORITY_P3 = "p3: "
    const TEXT_BUG_PRIORITY_P4 = "p4: "

    const TEXT_ADD_NUMBER = true

    const TEXT_ADD_PRIORITY = true
    const TEXT_PRIORITY_MINOR = ""
    const TEXT_PRIORITY_NORMAL = ""
    const TEXT_PRIORITY_MAJOR = ":jira-major:"
    const TEXT_PRIORITY_CRITICAL = ":jira-critical:"

    const prefixes = [
        // Task type
        (container, params) => {
            const typeValSpan = container.getElementById("type-val")
            if (!typeValSpan) {
                return TEXT_TASK_TYPE_DEFAULT
            }

            const text = typeValSpan.innerHTML
            if (text.contains("12610")) {
                return TEXT_TASK_TYPE_IMPROVEMENT
            }
            if (text.contains("12603")) {
                params.isBug = true
                return TEXT_TASK_TYPE_BUG
            }

            return TEXT_TASK_TYPE_DEFAULT
        },
        // Bug priority
        (container, params) => {
            if (!params.isBug) {
                return ""
            }

            const bugPriorityValSpan = container.getElementById("customfield_12170-val")
            if (!bugPriorityValSpan) {
                return ""
            }

            const text = bugPriorityValSpan.innerHTML
            if (text.contains("P0")) {
                return TEXT_BUG_PRIORITY_P0
            }
            if (text.contains("P1")) {
                return TEXT_BUG_PRIORITY_P1
            }
            if (text.contains("P2")) {
                return TEXT_BUG_PRIORITY_P2
            }
            if (text.contains("P3")) {
                return TEXT_BUG_PRIORITY_P3
            }
            if (text.contains("P4")) {
                return TEXT_BUG_PRIORITY_P4
            }

            return ""
        },
        // Task priority
        (container) => {
            const priorityValSpan = container.getElementById("priority-val")
            if (!priorityValSpan) {
                return ""
            }

            const text = priorityValSpan.innerHTML
            if (text.contains("minor")) {
                return TEXT_PRIORITY_MINOR
            }
            if (text.contains("normal")) {
                return TEXT_PRIORITY_NORMAL
            }
            if (text.contains("major")) {
                return TEXT_PRIORITY_MAJOR
            }
            if (text.contains("critical")) {
                return TEXT_PRIORITY_CRITICAL
            }

            return ""
        },
        // Task nubmer
        (container) => {
            const taskURL = window.location.href

            return taskURL.match(/\/(\w+-\d+)(\?[^$])*$/)[1] + " "
        }
    ]

    /**
     * @param {string} taskName
     * @param {string} taskURL
     * @returns {string}
     */
    function makeTaskMarkdownLink(taskName, taskURL) {
        let prefixesText = TEXT_PREFIX
        const params = {}
        for (const prefix of prefixes) {
            prefixesText = prefixesText + prefix(document, params)
        }

        return `[${prefixesText}${taskName}](${taskURL})`
    }

    /**
     * @param {string} text
     */
    function copyText(text) {
        const copyTextarea = document.createElement("textarea")
        copyTextarea.style.position = "fixed"
        copyTextarea.style.opacity = "0"
        copyTextarea.textContent = text

        document.body.appendChild(copyTextarea)
        copyTextarea.select()
        document.execCommand("copy")
        copyTextarea.remove()
    }

    function createCopyTaskButton() {
        // querying page components
        const commandBarDiv = document.querySelector(".command-bar .aui-toolbar2-primary")
        const summaryValSpan = document.getElementById("summary-val")
        if (!commandBarDiv || !summaryValSpan || !!document.getElementById("copy-task-button")) {
            return
        }

        // gathering task info
        const taskName = summaryValSpan.textContent
        const taskURL = window.location.href

        const link = makeTaskMarkdownLink(taskName, taskURL)

        // injecting new button
        const copyIconSpan = document.createElement("span")
        copyIconSpan.classList.add("icon", "aui-icon", "aui-icon-small", "aui-iconfont-copy", "icon-copy")

        const copyTaskA = document.createElement("a")
        copyTaskA.classList.add("aui-button", "toolbar-trigger")
        copyTaskA.addEventListener("click", () => copyText(link))
        copyTaskA.append(copyIconSpan)

        const copyTaskDiv = document.createElement("div")
        copyTaskDiv.id = "copy-task-button"
        copyTaskDiv.classList.add("aui-buttons", "pluggable-ops")
        copyTaskDiv.append(copyTaskA)

        commandBarDiv.append(copyTaskDiv)
    }

    const documentObserver = new MutationObserver(() => {
        createCopyTaskButton()
    })
    documentObserver.observe(document.getElementById("main"), { childList: true, subtree: true })
})()
