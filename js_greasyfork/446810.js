// ==UserScript==
// @name         AO3: [Wrangling] Peek fandoms used by tags in the bins!
// @description  Will show you what fandoms a tag is used in from unwrangled bins!
// @version      2.0.0

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tags/*/wrangle?*status=unwrangled*
// @match        *://*.archiveofourown.org/tags/*/wrangle?*show=mergers*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446810/AO3%3A%20%5BWrangling%5D%20Peek%20fandoms%20used%20by%20tags%20in%20the%20bins%21.user.js
// @updateURL https://update.greasyfork.org/scripts/446810/AO3%3A%20%5BWrangling%5D%20Peek%20fandoms%20used%20by%20tags%20in%20the%20bins%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // the return value of document.querySelectorAll is technically a "NodeList", which can be indexed like an array, but
    // doesn't have helpful functions like .map() or .forEach(). So this is a simple helper function to turn a NodeList
    // (or any other array-like object (indexed by integers starting at zero)) into an array
    const array = a => Array.prototype.slice.call(a, 0)

    //Checks if using dark mode
    const darkmode = window.getComputedStyle(document.body).backgroundColor == 'rgb(51, 51, 51)'

    // Called for each tag in the search results list
    // `url` is the url of the edit tag page
    // `result` is the span with the "Loading..." in it where we will put the results of our request
    const get_fandoms = function get_fandoms(url, result) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function xhr_onreadystatechange() {
            if (xhr.readyState == xhr.DONE ) {
                if (xhr.status == 200) {
                    //Returns all of the fandoms used on a tag
                    //Does this by peeking at all the "suggested fandoms" on the tag's edit form
                    let fandoms = []
                    let test2 = array(xhr.responseXML.documentElement.getElementsByClassName("tags commas"))

                    //If there are no suggested fandoms on a tag
                    if (test2.length == 0) {
                        result.innerText = "";
                        return;
                    }

                    //Get all text of all the children
                    fandoms = Array.prototype.slice.call(test2[0].children).map(f => f.textContent)
                    result.innerText = "\n" + fandoms.join("\n");
                } else if (xhr.status == 429) {
                    // ~ao3jail
                    result.innerText = "\nRate limited. Sorry :("
                } else {
                    result.innerText = "\nUnexpected error, check the console"
                    console.log(xhr)
                }
            }
        }
        xhr.open("GET", url)
        xhr.responseType = "document"
        xhr.send()
    }

    //Don't want to error when there's no tags in the bins
    if (document.querySelector("#wrangulator") != null) {
        //Adds new button at the beginning and end of the tag table
        const wranglebuttons = document.querySelector("#wrangulator").getElementsByClassName("submit actions")
        for (let a of wranglebuttons) {
            const peekfandombutton = document.createElement("button");
            peekfandombutton.name = "Peek fandoms button"
            peekfandombutton.style.textAlign = "center"
            peekfandombutton.textContent = "Peek fandoms";
            peekfandombutton.style.marginRight = "5px"
            peekfandombutton.style.paddingRight = "5px"
            //When either button is clicked
            peekfandombutton.addEventListener("click", (e) => {
                e.preventDefault()
                //Remove both peek fandoms buttons
                a.removeChild(peekfandombutton)
                const allpeekfandombuttons = document.getElementsByName("Peek fandoms button");
                allpeekfandombuttons.forEach(b => {
                    b.remove();
                });

                //For each row of the table
                const actionsbuttons = document.getElementById("wrangulator").querySelectorAll("td > ul.actions")
                for (const buttonset of actionsbuttons) {
                    if (buttonset.querySelector('a').href == "") {
                        continue
                    }

                    const span = buttonset.parentElement.parentElement.firstElementChild.getElementsByTagName("label")[0].parentElement

                    // this is the element that will hold the result when the request finishes
                    const loading = document.createElement("span");

                    //Before our request finishes, shows a loading text so user knows something is happening
                    loading.innerText = "\nLoading fandoms..."
                    if (darkmode) {
                        loading.style.color = "limegreen"
                    } else {
                        loading.style.color = "#00C"
                    }
                    loading.style.fontStyle = "italic"
                    span.appendChild(loading);

                    // trigger xhr (asynchronous)
                    get_fandoms("https://archiveofourown.org" + buttonset.querySelector('a').getAttribute('href'), loading);
                }
            })
            //What actually adds the buttons
            a.prepend(peekfandombutton)
        }
    }
    // Your code here...
})();