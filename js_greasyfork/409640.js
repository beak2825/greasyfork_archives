// ==UserScript==
// @name            Collapse HackerNews Parent Comments
// @description     Adds vertical bars to the left of the comments, enabling you to easily collapse the parent comments. It also can leave only a specified number of comments expanded and auto-collapse the rest.
// @author          BLBC (github.com/hjk789, greasyfork.org/users/679182-hjk789)
// @copyright       2020+, BLBC (github.com/hjk789, greasyfork.org/users/679182-hjk789)
// @version         1.2.6
// @homepage        https://github.com/hjk789/Userscripts/tree/master/Collapse-HackerNews-Parent-Comments
// @license         https://github.com/hjk789/Userscripts/tree/master/Collapse-HackerNews-Parent-Comments#license
// @grant           none
// @include         https://news.ycombinator.com/item*
// @namespace https://greasyfork.org/users/679182
// @downloadURL https://update.greasyfork.org/scripts/409640/Collapse%20HackerNews%20Parent%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/409640/Collapse%20HackerNews%20Parent%20Comments.meta.js
// ==/UserScript==


//--------------- Settings -----------------

const autoCollapse = false       // Whether all comments, other than the number of comments below, should be auto-collapsed.
                                 // If set to false, all comments will be left expanded and the settings below have no effect.
    const numberOfRoots = 5
    const numberOfReplies = 3
    const numberOfRepliesOfReplies = 1

//------------------------------------------


const fadeOnHoverStyle = document.createElement("style")
fadeOnHoverStyle.innerHTML = ".verticalBar:hover { background-color: gray !important; }"
document.body.appendChild(fadeOnHoverStyle)

// HackerNews puts a 1x1 image before each comment and sets it's width according to each comment depth. Each level of depth adds 40px of width to this
// image, starting from 0 which are the root comments. The ones with a 14px width are flagged comments and the "More comments" link.
// This userscript was first created before HN implemented the root/parent/prev/next links, and at that time the layout didn't have any easier way of identifying
// the hierarchy of the comments (it was just a list of comments pushed to the right), so that's the only way I had found to achieve this at that time.

const spacingImgs = document.querySelectorAll(".ind img[height='1']:not([width='14'])")

let root = 0
let index = spacingImgs.length-1        // It's required to loop backwards, otherwise the hidden comments reappear when collapsed.
let commentHier = []

if (autoCollapse)
    var collapseAll = setInterval(function() { main(index, collapseAll) }, 1)     // An interval of 1ms is being used to prevent the page from freezing until it finishes collapsing. Also, it creates a cool effect
else                                                                              // when the comments are being collapsed. It does make it take a few more seconds to finish in comment-heavy posts (150+) though.
{
    for (let j=0; j < spacingImgs.length; j++)        // Optimize the addition of the bars when the auto collapse is disabled.
        main(j)
}



function main(i, collapseAll)
{
    let commentContainer = spacingImgs[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    commentContainer.firstChild.style = "border-top: 5px transparent solid"             // To visually separate each vertical bar.
    spacingImgs[i].parentElement.style = "position: relative"

    const clicky = commentContainer.querySelectorAll(".clicky:not(.togg)")              // HN added a scrolling animation to the hierarchy links, which breaks the script.
    for (let j=0; j < clicky.length; j++)                                               // The animation is only applied to elements with the class "clicky".
        clicky[j].className = clicky[j].className.replace("clicky","")                  // This removes the clicky class from every hierarchy link of the comment.

    if (autoCollapse && !commentContainer.classList.contains("coll"))               // Collapse only if it's not collapsed yet. This is for signed-in users, as HN remembers which comments were collapsed.
        commentContainer.querySelector(".togg").click()

    index--
    i--

    if (i == -1 || i == spacingImgs.length-1)                // When finished collapsing all comments, now it's time to add the bars.
    {
        clearInterval(collapseAll)

        for (let i=0; i < spacingImgs.length; i++)
        {
            const level = spacingImgs[i].width / 40
            commentContainer = spacingImgs[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
            var commentToggle = commentContainer.querySelector(".togg")


            // Store the current hierarchy in an array
            commentHier[level] = commentToggle


            let divs = []
            for (let j = spacingImgs[i].width; j >= 0; j -= 40)             // Start adding the vertical bar from the current depth and go backwards.
            {
                // Create the vertical bar

                const div = document.createElement("div")
                div.className = "verticalBar"
                div.commentHier = commentHier[j/40]             // Store in an attribute of the element this comment's parent respective to the level of the vertical bar, for easy access.
                div.onclick = function(e)
                {
                    e.target.commentHier.click()                // When a vertical bar is clicked, collapse the respective parent comment.

                    // Click the "next" link of the parent comment when it's out of view.
                    if (e.target.commentHier.getBoundingClientRect().y < 0)
                        e.target.commentHier.previousElementSibling.lastChild.click()

                }

                let style = "left: " + (-5 + j) + "px; width: 12px; background-color: lightgray; position: absolute; z-index: 99; transition: 0.15s; "

                // Make it so that the vertical bars are only separated when followed by comments of same level of depth

                if (j == spacingImgs[i].width && spacingImgs[i-1] != null && spacingImgs[i].width <= spacingImgs[i-1].width)
                    style += "top: 5px; height: calc(100% + 8px); "
                else
                    style += "top: 0px; height: calc(100% + 13px); "

                div.style = style

                divs.push(div)
            }

            for (let j = divs.length - 1; j >= 0; j--)
                spacingImgs[i].parentElement.appendChild(divs[j])
        }

        if (autoCollapse)               // When finished collapsing and adding the vertical bars to all comments, now it's time to expand only a few of the first comments.
        {
            let sub40, sub80

            for (i=0; i < spacingImgs.length; i++)
            {
                commentToggle = spacingImgs[i].parentElement.parentElement.querySelector(".togg")

                if (spacingImgs[i].width == 0)          // If it's a root comment.
                {
                    root++
                    if (root == numberOfRoots + 1)          // If there's already <numberOfRoots> comments expanded, then stop expanding.
                        break

                    commentToggle.click()
                    sub40 = 0
                    sub80 = 0
                }
                else if (spacingImgs[i].width == 40 && sub40 < numberOfReplies)         // If it's a reply to the root comment, only expand up to <numberOfReplies>.
                {
                    commentToggle.click()
                    sub40++
                    sub80 = 0
                }
                else if (spacingImgs[i].width == 80 && sub80 < numberOfRepliesOfReplies)            // If it's a reply to the reply, only expand up to <numberOfRepliesOfReplies>.
                {
                    commentToggle.click()
                    sub80++
                }
            }
        }
    }
}