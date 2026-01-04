// ==UserScript==
// @name            YouTube Similar Comments Hider
// @version         1.7.3
// @description     Ensure originality in YouTube's comment section by hiding all sorts of repeated comments, copy-paste comments, repeated quotes from the video and saturated memes.
// @author          BLBC (github.com/hjk789, greasyfork.org/users/679182-hjk789)
// @copyright       2021+, BLBC (github.com/hjk789, greasyfork.org/users/679182-hjk789)
// @homepage        https://github.com/hjk789/Userscripts/tree/master/YouTube-Similar-Comments-Hider
// @license         https://github.com/hjk789/Userscripts/tree/master/YouTube-Similar-Comments-Hider#license
// @match           https://www.youtube.com/*
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.listValues
// @namespace https://greasyfork.org/users/679182
// @downloadURL https://update.greasyfork.org/scripts/433914/YouTube%20Similar%20Comments%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/433914/YouTube%20Similar%20Comments%20Hider.meta.js
// ==/UserScript==


//--------------- SETTINGS ---------------

const tolerance = 3
// 1 - Loosely similar: Pretty much all similar comments will be detected, but there will be many false positives. False positives are comments that are *worded* similarly but have two totally different subjects.
// 2 - Significantly similar: Most similar comments will be detected, but with some or few false positives.
// 3 - Very similar: A moderate detection with few to no false positives, but several comments that are similar, but worded differently, won't be detected.
// 4 - Mostly similar: Detects comments that are close variations of another, such as several comments repeating the same quote from the video with few differences.
// 5 - Almost identical: Detects only comments that are mostly copy-pasted with little to no variation.
// 6 - Custom (advanced): Use a specific minimum threshold, in the 2-90 range. Set the customThreshold variable below to the value you want.

const customThreshold = 20

let lightenSimilarComments = false           // If set to true, all similar comments will be dimmed (faded) instead of completely hidden.

const rememberFilteredComments = false       // Whether the script should store locally every filtered comment from past videos to use them as a second layer of filtering.
                                             // This impacts performance over time. If set to false, only the comments in the current video are considered.
//----------------------------------------



let threshold
let currentSamples, storedSamples
let blockedUsers, selectedUser, blockUserContainer
let currentPage, currentVideoId
let loadedCommentsObserver

const waitForURLchange = setInterval(function()             // Because YouTube is a single-page web app, everything happens in the same page, only changing the URL.
{                                                           // So the script needs to check when the URL changes so it can be reassigned to the page and be able to work.
    if (location.href == currentPage)
        return

    currentPage = location.href

    if (!location.href.includes("watch"))
        return

    constructor()

}, 500)





function constructor()
{
    threshold = getThreshold(tolerance)

    currentSamples = []
    storedSamples = []

    blockedUsers = selectedUser = undefined

    currentVideoId = cleanVideoUrl(location.href).split("=")[1]


    if (rememberFilteredComments)
    {
        GM.listValues().then(function(GmList)
        {
            storedSamples = GmList

            storedSamples.splice(storedSamples.indexOf("blockedUsers"),1)

            main()
        })
    }
    else main()
}

async function main()
{
    const waitForCommentSection = setInterval(async function()
    {
        let commentSection = document.getElementById("comments")?.querySelector("#contents")

        if (!commentSection)
            return

        clearInterval(waitForCommentSection)


        let value = await GM.getValue("blockedUsers")

        if (!value)
        {
            value = "[]"
            GM.setValue("blockedUsers", value)
        }

        blockedUsers = JSON.parse(value)


        /* Attach a mutation observer to the comments section to detect when more comments are loaded, and process them */
        {
            if (!loadedCommentsObserver)
            {
                loadedCommentsObserver = new MutationObserver(function(mutations)
                {
                    for (let i=0; i < mutations.length; i++)
                    {
                        if (!!mutations[i].addedNodes)
                            processComments(mutations[i].addedNodes)
                    }
                })

                loadedCommentsObserver.observe(commentSection, {childList: true})
            }
        }


        const waitForCommentSectionHeader = setInterval(function()
        {
            if (!document.getElementById("sort-menu"))
                return

            clearInterval(waitForCommentSectionHeader)


            if (document.getElementById("toleranceMenu"))
                return


            /* Create the hover styles for the menu items */
            {
                const style = document.createElement("style")
                style.innerHTML = "#toleranceMenu div div div:hover, #blockUser:hover { background-color: var(--yt-spec-10-percent-layer) !important; }"
                document.head.appendChild(style)
            }

            /* Create the "Filter tolerance" dropdown menu */
            {
                const toleranceMenuContainer = document.createElement("div")
                toleranceMenuContainer.id = "toleranceMenu"
                toleranceMenuContainer.innerHTML = "FILTER TOLERANCE"
                toleranceMenuContainer.style = "color: var(--yt-spec-text-primary); width: 130px; height: 24px; margin-left: 50px; font-size: 14px; font-weight: 500; z-index: 99; cursor: pointer;"
                toleranceMenuContainer.onclick = function() { this.lastChild.style.visibility = this.lastChild.style.visibility ? "" : "hidden"; event.stopPropagation() }

                const dropdownContainer = document.createElement("div")
                dropdownContainer.style = "background-color: var(--yt-spec-brand-background-solid); width: max-content; margin-left: -15px; margin-top: 16px; border: lightgray 1px solid; border-radius: 3px; visibility: hidden;"

                var dropdownItemsContainer = document.createElement("div")
                dropdownItemsContainer.style = "font-weight: initial; letter-spacing: 0.3px; padding-top: 7px;"

                createToleranceDropdownItem("Loosely similar", 1, dropdownItemsContainer, "Pretty much all similar comments will be detected, but there will be many false positives.")
                createToleranceDropdownItem("Significantly similar", 2, dropdownItemsContainer, "Most similar comments will be detected, but with some or few false positives.")
                createToleranceDropdownItem("Very similar", 3, dropdownItemsContainer, "A moderate detection with few to no false positives, but several comments that are similar, but worded differently, won't be detected.")
                createToleranceDropdownItem("Mostly similar", 4, dropdownItemsContainer, "Detects comments that are close variations of another.")
                createToleranceDropdownItem("Almost indentical", 5, dropdownItemsContainer, "Detects only comments that are mostly copy-pasted with little to no variation.")
                createToleranceDropdownItem("Custom (advanced)", 6, dropdownItemsContainer, "Use a specific minimum threshold, in the 2-90 range.")

                dropdownContainer.appendChild(dropdownItemsContainer)

                toleranceMenuContainer.appendChild(dropdownContainer)

                document.getElementById("sort-menu").parentElement.appendChild(toleranceMenuContainer)

                document.body.onclick = function() { document.getElementById("toleranceMenu").lastChild.style.visibility = "hidden" }               // Make the dropdown be dismissed when clicked outside of it.


                /* Create the "Hide comments" checkbox */
                {
                    const hideCommentsCheckbox = document.createElement("input")
                    hideCommentsCheckbox.id = "hideComments"
                    hideCommentsCheckbox.type = "checkbox"
                    hideCommentsCheckbox.style = "margin-top: 10px; margin-bottom: 10px;"
                    hideCommentsCheckbox.checked = !lightenSimilarComments
                    hideCommentsCheckbox.onchange = function()
                    {
                        lightenSimilarComments = !this.checked

                        if (this.checked)
                        {
                            const comments = document.getElementById("comments").querySelectorAll("ytd-comment-thread-renderer[style^='opacity']")

                            for (let i=0; i < comments.length; i++)
                                comments[i].style = "display: none;"
                        }
                        else
                        {
                            const comments = document.getElementById("comments").querySelectorAll("ytd-comment-thread-renderer[style^='display']")

                            for (let i=0; i < comments.length; i++)
                                comments[i].style = "opacity: 0.5;"
                        }

                    }

                    const hideCommentsLabel = document.createElement("label")
                    hideCommentsLabel.for = "hideComments"
                    hideCommentsLabel.style = "padding: 8px 19px; border-top: 1px solid; user-select: none;"
                    hideCommentsLabel.innerHTML = "Hide comments"

                    hideCommentsLabel.insertBefore(hideCommentsCheckbox, hideCommentsLabel.firstChild)

                    dropdownItemsContainer.appendChild(hideCommentsLabel)
                }
            }

            /* Create the "Block this user" option in the comment's side-menu */
            {
                blockUserContainer = document.createElement("div")
                blockUserContainer.id = "blockUser"
                blockUserContainer.style = "background-color: var(--yt-spec-brand-background-solid); color: var(--yt-spec-text-primary); font-size: 14px; text-align: left; padding: 8px 0px 8px 0px; cursor: pointer; margin-bottom: 8px; justify-self: left; width: 100%;"
                blockUserContainer.innerHTML = "Block this user"
                blockUserContainer.onclick = function()
                {
                    if (confirm("This will hide all comments from ''"+selectedUser.innerText.trim()+"'' in any video. Are you sure?"))
                    {
                        blockedUsers.push(selectedUser.href)
                        GM.setValue("blockedUsers", JSON.stringify(blockedUsers))
                        reprocessComments()
                    }

                    document.body.click()     // Dismiss the menu.
                }

                const blockUserIcon = document.createElement("span")
                blockUserIcon.innerHTML = "🚫"
                blockUserIcon.style = "margin-right: 17px; margin-left: 20px;"

                blockUserContainer.insertBefore(blockUserIcon, blockUserContainer.firstChild)

                const commentMenuButton = commentSection.querySelector("ytd-menu-renderer yt-icon")

                if (commentMenuButton)
                {
                    commentMenuButton.click()
                    commentMenuButton.click()      // The comment menu doesn't exist in the HTML before it's clicked for the first time. This forces it to be created and dismisses it immediately.

                    const blockUserParent = document.querySelector("ytd-menu-popup-renderer")
                    blockUserParent.style = "max-height: max-content !important; max-width: max-content !important;"                // Change the max width and height so that the new item fits in the menu.
                }
            }

            document.body.onclick = function()
            {
                document.getElementById("blockUser")?.remove()                // Remove the "Block this user" option when not used.

                const toleranceMenu = document.getElementById("toleranceMenu")
                if (toleranceMenu)  toleranceMenu.firstElementChild.style.visibility = "hidden"              // Dismiss the Filter Tolerance menu when clicked outside.
            }

        }, 100)

    }, 100)
}

function getThreshold(tolerance)
{
    // Return the minimum threshold to treat the comment as similar, depending on the tolerance level. The final threshold can be higher than that, but not lower.
    return tolerance == 1 ? 14 : tolerance == 2 ? 24 : tolerance == 3 ? 35 : tolerance == 4 ? 45 : tolerance == 5 ? 65 :
        customThreshold < 2 ? 2 : customThreshold > 90 ? 90 : customThreshold
}

function createToleranceDropdownItem(text, toleranceLevel, container, title)
{
    const item = document.createElement("div")
    item.innerHTML = text
    item.title = title
    item.style.padding = "15px"
    item.onclick = function()
    {
        this.parentElement.querySelector("[style*='background-color']").style.backgroundColor = ""              // Remove the selection style from the previous selected item.
        this.style.backgroundColor = "var(--yt-spec-10-percent-layer)"
        this.parentElement.parentElement.style.visibility = "hidden !important"             // Hide the dropdown list when an item is selected.

        reprocessComments(getThreshold(toleranceLevel))
    }

    if (tolerance == toleranceLevel)
        item.style.backgroundColor = "var(--yt-spec-10-percent-layer)"

    container.appendChild(item)
}

function reprocessComments(thresholdValue = 0)
{
    if (thresholdValue)
        threshold = thresholdValue

    const comments = document.getElementById("comments").querySelector("#contents").children

    processComments(comments, true)
}

function processComments(comments, reprocess = false)
{
    let isSimilar = false

    for (let i=0; i < comments.length; i++)
    {
        const commentBody = comments[i].querySelector("#content-text")
        if (!commentBody)               // Sometimes the comments list includes an empty object. When it's such a case, skip to the next one.
            continue

        // Because the comment's side-menu is separated from the comments section, this listens to clicks on each three-dot
        // button and store in a variable in what comment it was clicked, to then be used by the "Block this user" button.
        const commentMenuButton = comments[i].querySelector("ytd-menu-renderer")
        if (commentMenuButton)
        {
            commentMenuButton.onclick = function()
            {
                event.stopPropagation()             // Prevent the "Block this user" option from being removed by clicking the comment menu.

                selectedUser = this.parentElement.parentElement.querySelector("#author-text")

                document.querySelector("ytd-menu-popup-renderer").appendChild(blockUserContainer)               // YouTube reuses the same menu element for every menu in the site. This adds the "Block this user" option
            }                                                                                                   // to the menu only when the comment menu is opened. It's then removed whenever any other menu is opened.
        }

        // Standardize the comments for the processing by making them lowercase and without punctuation marks, diacritics, linebreaks, commonly used emojis or repeated characters,
        // so that the differences between comments are in the words used instead of the characters. Also long comments are trimmed to 400 characters, to make the processing lighter.
        const comment = commentBody.textContent.toLocaleLowerCase().replace(/[.,!\-\s]+/g, " ").replace(/(.)\1+|(\W\W)\2+/gu, "$1$2").replace(/(👏|🤩|😁|😂|🤣|😍|❤️|👍🏼|💯|👊🏻)+/g, "#").normalize("NFD").replace(/[\u0300-\u036f*"'’“”]/g, "").substring(0,400).trim()

        if (!reprocess)             // If it's a reprocess, don't add the comment again to the samples list, otherwise the list would get duplicated.
        {
            currentSamples.push(comment)

            if (rememberFilteredComments)
                GM.setValue(currentVideoId +"::"+ comment, "")
        }

        // Reset the style of the comments, if any.
        if (comments[i].style.opacity || comments[i].style.display)
            comments[i].removeAttribute("style")


        if (blockedUsers.includes(comments[i].querySelector("#author-text").href))              // The check need to be made *after* the push, otherwise the comments list and the samples list get out of sync.
        {
            comments[i].style.display = "none"
            continue
        }

        let n = currentSamples.length
        if (!reprocess)  n--                // The first time the processing is done, the comment should not be compared to the sample added last, as it would be comparing to itself ...

        /* Compare the comment with the previous ones of this video */

        for (let j=0; j < n; j++)
        {
            if (reprocess && i == j)       // ... On the other hand, in the reprocessings, the comparison should stop on equal indexes to not compare to itself.
                break

            isSimilar = calculateAndCheckThreshold(comment, comments[i], currentSamples[j], "This video")

            if (isSimilar)
                break
        }

        /* Compare the comment with the stored ones */

        if (rememberFilteredComments && !isSimilar)             // If the comment is already detected as similar, skip the stored samples.
        {
            for (let j=0; j < storedSamples.length; j++)
            {
                const sampleSplit = storedSamples[j].split("::")

                if (location.search.includes(sampleSplit[0]))             // If the sample came from the same video, skip it, otherwise each comment would be compared to itself.
                    continue

                if (calculateAndCheckThreshold(comment, comments[i], sampleSplit[1], "Other video", threshold + 10))
                    break
            }
        }
    }
}

function calculateAndCheckThreshold(comment, commentNode, sample, sampleSource, pthreshold = threshold)
{
    const lengthSum = comment.length + sample.length

    let tmpthreshold = lengthSum * pthreshold/100              // The length of both comments is connected to the minimum threshold, this way the threshold is adapted to each comparison.

    if (lengthSum/100 < 1)
        tmpthreshold /= lengthSum/100

    if (tmpthreshold > 90)
        tmpthreshold = 90


    const similarity1 = calculateSimilarity(sample, comment)

    if (similarity1 >= tmpthreshold)
    {
        const similarity2 = calculateSimilarity(comment, sample)                // Recalculate the other way round to ensure that the two comments are similar to each other in both ways.

        if (similarity2 >= tmpthreshold)
        {
            console.log("Similarity C->S: "+similarity1.toFixed(2)
                       +"   ###   Similarity S->C: "+similarity2.toFixed(2)
                       +"   ###   Threshold: "+tmpthreshold.toFixed(2)
                       +"   ###   C+S length: "+(comment.length+sample.length)
                       +"   ###   Sample source: "+sampleSource
                       +"   ###   Sample: "+sample
                       +"   ###   Comment: "+comment)

            if (lightenSimilarComments)
                commentNode.style.opacity = 0.5
            else
                commentNode.style.display = "none"

            return true
        }
    }
}

function calculateSimilarity(a, b)
{
    let hits = 0
    let string = ""
    const length = b.length > 400 ? 400 : b.length      // Calculate only the first 400 characters of the comments, otherwise comments that are exaggeratedly long can cause hangs and slow down the processing.
                                                        // Also, long comments are practically never similar, and when they do, they are identical, so 400 chacters are more than enough to detect these cases.

    for (let i=0; i < length; i++)                      // For each character of the comment ...
    {
        string += b[i]                                  // ... append it to a string ...

        if (a.includes(string))                         // ... and check if the resulting string can be found in the sample comment, and if so, continue appending the characters.
        {
            if (string.length > 3)                      // When the sample comment contains the string, when it's at least 4 characters long ...
            {
                hits++                                  // ... start counting the number of hits for each character.

                if (string.length == 4)                 // If the string has three characters, recover the two uncounted hits.
                    hits += 3
            }
        }
        else string = ""                                // If the comment doesn't contain the string, clear the string and start building it again with the rest of the characters.
    }

    const similarity = hits/length*100                  // Get the proportion of hits out of the total of characters of the comment.

    return similarity
}

function cleanVideoUrl(fullUrl)
{
    const urlSplit = fullUrl.split("?")                 // Separate the page path from the parameters.
    const paramsSplit = urlSplit[1].split("&")          // Separate each parameter.

    for (let i=0; i < paramsSplit.length; i++)
    {
        if (paramsSplit[i].includes("v="))              // Get the video's id.
            return urlSplit[0]+"?"+paramsSplit[i]       // Return the cleaned video URL.
    }
}