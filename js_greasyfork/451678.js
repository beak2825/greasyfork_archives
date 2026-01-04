// ==UserScript==
// @name         AO3: [Wrangling] Check for comments from bins!
// @description  Will show if (or many) comments a tag has from the bins!
// @version      1.0.0

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tags/*/wrangle?*
// @match        *://*.archiveofourown.org/tag_wranglings*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451678/AO3%3A%20%5BWrangling%5D%20Check%20for%20comments%20from%20bins%21.user.js
// @updateURL https://update.greasyfork.org/scripts/451678/AO3%3A%20%5BWrangling%5D%20Check%20for%20comments%20from%20bins%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //By default, this will change the tag's color if it has any comments
    //Set this true if you'd also like to see the number of comments on a tag!
    const SHOW_COMMENT_COUNT = false;

    //Dark mode support
    //Read it like this: Is the window is in dark mode ? If so, the commented color is "#00FFFF" : Otherwise, the commented color is "#00C"
    const commented_color = (window.getComputedStyle(document.body).backgroundColor == 'rgb(51, 51, 51)') ? "#00FFFF" : "#00C"

    //So things like getElementsByTagName get a nodelist, not an array
    //This lets us convert the nodelists into an actual array so we can use array functions on it
    //See https://stackoverflow.com/questions/5145032/whats-the-use-of-array-prototype-slice-callarray-0
    const array = a => Array.prototype.slice.call(a, 0)

    //If the user is in an empty bin, nothing will happen
    if (document.getElementById("wrangulator") == null) {
        return
    }

    //If we are in a mass wrangling bin or a regular wrangling bin
    let massbins = window.location.pathname.includes("/tag_wranglings")

    //Grabbing the link connected to a row
    const get_url = function get_url(label) {
        // This will return the link if iconify is enabled
        const a = label.parentElement.parentElement.querySelector("ul.actions > li[title='Edit'] > a");
        if (a) {
            return a.href.slice(0,-4) +'comments';
        }
        // If there's no iconify, we'll stick with the default path
        const buttons = label.parentElement.parentElement.querySelectorAll("ul.actions > li > a");
        return array(buttons).filter(b => b.innerText == "Edit")[0].href.slice(0,-4) +'comments';
    }

    //Button aesthetics
    const showcommentbutton = document.createElement("button");
    showcommentbutton.style.textAlign = "center"
    showcommentbutton.textContent = "Check for comments";
    //Looks pretty on the mass bins too~!
    if (massbins) {
        showcommentbutton.style.marginLeft="10px"
    } else {
        showcommentbutton.style.marginRight = "5px"
        showcommentbutton.style.paddingRight = "5px"
    }

    //What happens when you click the button
    showcommentbutton.addEventListener("click", (e) => {
        e.preventDefault()

        const actionsbuttons = document.getElementById("wrangulator").querySelectorAll("td > ul.actions")

        //For each tag in the table
        for (const buttonset of actionsbuttons) {
            const iframe2 = document.createElement("iframe");
            const onload1 = function onload1() {
                //Loads the tag comment page and sees if there's comments
                var commentcount = iframe2.contentWindow.document.getElementById("comments_placeholder").getElementsByClassName("thread")[0].childElementCount
                //If multiple pages of comments
                var plus = iframe2.contentWindow.document.querySelector("#comments_placeholder > ol:nth-child(2)") == null ? "" : "+"

                //Number of comments displayed, or just an indicator if there are comments at all?
                if (SHOW_COMMENT_COUNT) {
                    let singular = commentcount == 1 ? "" : "s";
                    buttonset.parentElement.parentElement.firstElementChild.getElementsByTagName("label")[0].innerText += "\n\n" + commentcount + plus + " comment" + singular
                    //If there's any comments on a tag, we'll change the tags' font to be blue
                    if (commentcount > 0) {
                        buttonset.parentElement.parentElement.firstElementChild.getElementsByTagName("label")[0].style.color=commented_color
                    }
                } else {
                    //If there's any comments on a tag, we'll change the tags' font to be blue
                    if (commentcount > 0) {
                        buttonset.parentElement.parentElement.firstElementChild.getElementsByTagName("label")[0].style.color=commented_color
                    }
                }
                iframe2.remove()
            }
            iframe2.addEventListener("load", onload1);
            iframe2.src = get_url(buttonset)

            // don't show ao3 wranglers our dirty little secrets (iframes)
            // can be removed for debugging
            iframe2.style.display = "none";

            document.getElementById("wrangulator").appendChild(iframe2);
        }
        showcommentbutton.parentElement.removeChild(showcommentbutton)
    })

    //Adding button to page
    if (massbins) {
        document.querySelector("#wrangulator > fieldset.table").parentNode.insertBefore(showcommentbutton, document.querySelector("#wrangulator > fieldset.table"))
    } else {
        document.querySelector("#wrangulator").getElementsByClassName("submit actions")[0].prepend(showcommentbutton)
    }

    // Your code here...
})();