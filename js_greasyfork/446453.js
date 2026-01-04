// ==UserScript==
// @name         AO3: [Wrangling] Show fandoms in Tag Search!
// @description  Show a tag's fandom, its synned/unsynned status, what it's synned to and more from the tag search results!!
// @version      5.0.0

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tags/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446453/AO3%3A%20%5BWrangling%5D%20Show%20fandoms%20in%20Tag%20Search%21.user.js
// @updateURL https://update.greasyfork.org/scripts/446453/AO3%3A%20%5BWrangling%5D%20Show%20fandoms%20in%20Tag%20Search%21.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //IMPORTANT!!
    //Set to be true if you are also using the show results in a table script!! (Totally recommended, it's an awesome script!)
    //https://greasyfork.org/en/scripts/448079-ao3-wrangling-search-term-highlighting-and-table
    var SEARCH_RESULTS_TABLE = false;

    //If the results will go in a table, no spacers will be necessary
    var spacer1 = SEARCH_RESULTS_TABLE ? "" : " - "
    var spacer2 = SEARCH_RESULTS_TABLE ? "" : " → "

    var page_url = window.location.href;

    //Dark mode support
    //Read it like this: Is the window is in dark mode ? If so, the unwrangled color is "#00FFFF" : Otherwise, the unwrangled color is "#00C"
    const unwrangled_color = (window.getComputedStyle(document.body).backgroundColor == 'rgb(51, 51, 51)') ? "#00FFFF" : "#00C"
    const unwrangled_color_text = (window.getComputedStyle(document.body).backgroundColor == 'rgb(51, 51, 51)') ? "Cyan" : "Blue"

    //So things like getElementsByTagName get a nodelist, not an array
    //This lets us convert the nodelists into an actual array so we can use array functions on it
    //See https://stackoverflow.com/questions/5145032/whats-the-use-of-array-prototype-slice-callarray-0
    const array = a => Array.prototype.slice.call(a, 0)

    //Checks if tag is canonized
    const check_canon = function check_canon(xhr) {
        return xhr.responseXML.documentElement.querySelector("#tag_canonical")?.checked
    }

    //Returns array of a tag's fandoms
    //Does this by peeking at all the "fandoms to remove" on the tag's edit form and putting them into a list
    const check_fandoms = function check_fandoms(xhr) {
        const fandoms = []
        const checks = array(xhr.responseXML.documentElement.querySelectorAll("label > input[name='tag[associations_to_remove][]']")).filter(foo => foo.id.indexOf("parent_Fandom_associations_to_remove") != -1);
        for (const check of checks) {
            const name = check.parentElement.nextElementSibling.innerText
            fandoms.push(name)
        }
        return fandoms
    }

    //Returns true or false if a tag is synned or not
    const check_issynned = function check_issynned(xhr) {
        if (xhr.responseXML.documentElement.querySelector("#tag_syn_string") != null) {
            return xhr.responseXML.documentElement.querySelector("#tag_syn_string").value
        }
        return false
    }

    //Returns true if the tag is a fandom tag
    const check_istypefandom = function check_istypefandom(xhr) {
        if (xhr.responseXML.documentElement.querySelector("#edit_tag > fieldset:nth-child(3) > dl > dd:nth-child(6) > strong") != null && xhr.responseXML.documentElement.querySelector("#edit_tag > fieldset:nth-child(3) > dl > dd:nth-child(6) > strong").innerHTML == "Fandom") {
            return true;
        }
        return false
    }

    //Returns what a tag is synned to, or an empty string if its unsynned
    const check_synnedto = function check_synnedto(xhr) {
        if (xhr.responseXML.documentElement.querySelector("#tag_syn_string") != null) {
            return xhr.responseXML.documentElement.querySelector("#tag_syn_string").value
        }
        return ""
    }

    //Returns the subtags of a tag, or an empty string if there is no subtag
    const check_subtags = function check_subtags(xhr) {
        if (xhr.responseXML.documentElement.querySelector(".sub .tags") != null) {
            let subtagresult = ""
            for (const currenttag of xhr.responseXML.documentElement.querySelector(".sub .tags").children) {
                //Ignores metatag trees, just gets directly connected metatags
                if (currenttag.querySelector("li") == null) {
                    subtagresult = subtagresult + "  • " + currenttag.innerText + "\n"
                }
            }
            return subtagresult
        }
        return ""
    }

    //Returns the metatags of a tag, or an empty string if there is no metatag
    const check_metatags = function check_metatags(xhr) {
        if (xhr.responseXML.documentElement.querySelector(".meta .tags") != null) {
            let metatagresult = ""
            for (const currenttag of xhr.responseXML.documentElement.querySelector(".meta .tags").children) {
                //Ignores metatag trees, just gets directly connected metatags
                if (currenttag.querySelector("li") == null) {
                    metatagresult = metatagresult + "• " + currenttag.innerText + "\n"
                }
            }
            return metatagresult
        }
        return ""
    }

    // called for each tag in the search results list
    // `url` is the url of the edit tag page
    // `a` is the link, whose color we will change based on whether the tag is a syn
    // `result` is the span with the "Loading..." in it where we will put the results of our request
    const get_fandoms = function get_fandoms(url, a, result) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function xhr_onreadystatechange() {
            if (xhr.readyState == xhr.DONE ) {
                if (xhr.status == 200) {
                    // the "Loading..." text that we show while our script is running is in italics - so clear that
                    result.style.fontStyle = "";

                    // gets the info on the tag
                    const fandoms = check_fandoms(xhr)
                    const isfandomtype = check_istypefandom(xhr)
                    const synned = check_issynned(xhr)
                    const canon = check_canon(xhr)

                    //Special case - you called get_fandoms on a fandom tag
                    //If its a fandom, we'll just show what fandom it is or that it syns to
                    //(Otherwise fandoms will always show as being unwrangled)
                    if (isfandomtype) {
                        if (canon) {
                            result.innerText = spacer1 + a.innerText
                            return;
                        }
                        result.innerText = spacer1 + check_synnedto(xhr)
                        //Make text blue if not synned to anything
                        if (!synned) {
                            a.style.color = unwrangled_color;
                            a.classList.toggle("not_synned")
                        }
                        return;
                    }

                    // figure out the text to display based on whether there were any fandoms or not
                    const text = fandoms.length == 0 ? "Unwrangled" : fandoms.join(", ");
                    result.innerText = spacer1 + text;

                    // if the tag is synned, leave it alone, otherwise make the tag's text blue
                    if (!synned & !canon) {
                        a.style.color = unwrangled_color;
                    }

                    // hovering over a blue link defaults to a purple background that is just totally unreadable, this class
                    // makes the hover background color white instead
                    if (!synned) {
                        a.classList.toggle("not_synned")
                    }
                } else if (xhr.status == 429) {
                    // ~ao3jail
                    result.innerText = spacer1 + "Rate limited. Sorry :("
                } else {
                    result.innerText = spacer1 + "Unexpected error, check the console"
                    console.log(xhr)
                }
            }
        }
        xhr.open("GET", url)
        xhr.responseType = "document"
        xhr.send()
    }

    // called for each tag in the search results list
    // `url` is the url of the edit tag page
    // `a` is the link, whose color we will change based on whether the tag is a syn
    // `result` is the span with the "Loading..." in it where we will put the results of our request
    const get_synnedto = function get_synnedto(url, a, result) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function xhr_onreadystatechange() {
            if (xhr.readyState == xhr.DONE ) {
                if (xhr.status == 200) {
                    // the "Loading..." text that we show while our script is running is in italics - so clear that
                    result.style.fontStyle = "";

                    // gets what the tag is synned to
                    const synned = check_issynned(xhr)
                    const synnedto = check_synnedto(xhr)
                    const canon = check_canon(xhr)

                    if (!SEARCH_RESULTS_TABLE) {
                        result.style.fontStyle = "italic";
                    }

                    if (canon) {
                        result.innerText = ""
                        return
                    }

                    //If tag is synned, set text to " → Syn", otherwise set text to empty string
                    result.innerText = synned ? spacer2 + synnedto : ""

                    // if the tag is synned, leave it alone, otherwise make the tag's text blue
                    if (!synned & !canon) {
                        a.style.color = unwrangled_color;
                    }

                    // hovering over a blue link defaults to a purple background that is just totally unreadable, this class
                    // makes the hover background color white instead
                    if (!synned) {
                        a.classList.toggle("not_synned")
                    }
                } else if (xhr.status == 429) {
                    // ~ao3jail
                    result.innerText = spacer1 + "Rate limited. Sorry :("
                } else {
                    result.innerText = spacer1 + "Unexpected error, check the console"
                    console.log(xhr)
                }
            }
        }
        xhr.open("GET", url)
        xhr.responseType = "document"
        xhr.send()
    }

    // called for each tag in the search results list
    // `url` is the url of the edit tag page
    // `a` is the link, whose color we will change based on whether the tag is a syn
    // `result` is the span with the "Loading..." in it where we will put the results of our request
    const check_wranglers = function check_wranglers(url, a, result) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function xhr_onreadystatechange() {
            if (xhr.readyState == xhr.DONE ) {
                if (xhr.status == 200) {
                    // the "Loading..." text that we show while our script is running is in italics - so clear that
                    result.style.fontStyle = "";

                    // gets the info on the tag
                    let wranglers = xhr.responseXML.documentElement.querySelector("#edit_tag > fieldset:nth-child(3) > dl > dd:nth-child(8)").innerText

                    if (wranglers == 'Sign Up') {
                        a.classList.toggle("not_synned")
                        a.parentElement.style.color = unwrangled_color;
                        a.style.color = unwrangled_color;
                        result.style.fontWeight = "normal";
                        wranglers = "No wranglers assigned!"
                    }

                    result.innerText = spacer1 + wranglers;
                } else if (xhr.status == 429) {
                    // ~ao3jail
                    result.innerText = spacer1 + "Rate limited. Sorry :("
                } else {
                    result.innerText = spacer1 + "Unexpected error, check the console"
                    console.log(xhr)
                }
            }
        }
        xhr.open("GET", url)
        xhr.responseType = "document"
        xhr.send()
    }

    // called for each tag in the search results list
    // `url` is the url of the edit tag page
    // `a` is the link
    // `result` is the span with the "Loading..." in it where we will put the results of our request
    const get_subtags = function get_subtags(url, a, result) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function xhr_onreadystatechange() {
            if (xhr.readyState == xhr.DONE ) {
                if (xhr.status == 200) {
                    // the "Loading..." text that we show while our script is running is in italics - so clear that
                    result.style.fontStyle = "";

                    // gets the info on the tag
                    const subtags = check_subtags(xhr)
                    if (!SEARCH_RESULTS_TABLE) {
                        result.style.marginLeft = "15px";
                    }
                    result.innerText = subtags;
                } else if (xhr.status == 429) {
                    // ~ao3jail
                    result.innerText = spacer1 + "Rate limited. Sorry :("
                } else {
                    result.innerText = spacer1 + "Unexpected error, check the console"
                    console.log(xhr)
                }
            }
        }
        xhr.open("GET", url)
        xhr.responseType = "document"
        xhr.send()
    }

    // called for each tag in the search results list
    // `url` is the url of the edit tag page
    // `a` is the link
    // `result` is the span with the "Loading..." in it where we will put the results of our request
    const get_metatags = function get_metatags(url, a, result) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function xhr_onreadystatechange() {
            if (xhr.readyState == xhr.DONE ) {
                if (xhr.status == 200) {
                    // the "Loading..." text that we show while our script is running is in italics - so clear that
                    result.style.fontStyle = "";

                    // gets the info on the tag
                    const metatags = check_metatags(xhr)
                    if (!SEARCH_RESULTS_TABLE) {
                        result.style.marginLeft = "15px";
                    }
                    result.innerText = metatags;
                } else if (xhr.status == 429) {
                    // ~ao3jail
                    result.innerText = spacer1 + "Rate limited. Sorry :("
                } else {
                    result.innerText = spacer1 + "Unexpected error, check the console"
                    console.log(xhr)
                }
            }
        }
        xhr.open("GET", url)
        xhr.responseType = "document"
        xhr.send()
    }

    const button = document.createElement("button")
    const button2 = document.createElement("button")
    const button3 = document.createElement("button")
    const button4 = document.createElement("button")
    const button5 = document.createElement("button")
    const button6 = document.createElement("button")
    const buttondiv = document.createElement("div")

    const fetch_fandoms = function fetch_fandoms(e) {
        e.preventDefault()

        //special case - if show results in table script is enabled
        //https://greasyfork.org/en/scripts/448079-ao3-wrangling-search-term-highlighting-and-table
        const search_results = SEARCH_RESULTS_TABLE ? document.getElementById('resulttable').getElementsByClassName("tag") : document.querySelector("#main > ol.tag.index.group").getElementsByClassName("tag")

        //This column is hidden by default, so clear that if the show results in table script is active
        if (SEARCH_RESULTS_TABLE) {
            document.querySelector("#resulttable .resultcheck").style.display = "table-cell"
        }

        // find each item in the tag search results list
        for (const a of search_results) {
            const span = SEARCH_RESULTS_TABLE ? a.parentElement.parentElement.getElementsByClassName("resultcheck")[0] : a.parentElement;
            if (SEARCH_RESULTS_TABLE) {
                a.parentElement.parentElement.getElementsByClassName("resultcheck")[0].style.display = "table-cell"
                span.innerHTML = ""
            }
            // this is the span that will hold the result when the request finishes
            const loading = document.createElement("span");
            //Before our request finishes, shows a loading text so user knows something is happening
            loading.innerText = spacer1 + "Loading..."
            loading.style.fontStyle = "italic"
            span.appendChild(loading);
            // trigger xhr (asynchronous)
            get_fandoms(a.href + "/edit", a, loading);
        }

        //Renames the header of the table, if the show results in table script is enabled
        if (SEARCH_RESULTS_TABLE) {
            document.getElementById('resulttable').querySelector('thead th.resultcheck').innerHTML = "Fandom";
        }

        // add the unsynned color explanation text to the top of the page, replacing the button
        const div = document.createElement("div")
        div.style.fontSize = "0.875rem"
        div.style.fontStyle = "italic"
        div.appendChild(document.createTextNode(""))
        const span = document.createElement("span")
        span.style.color = unwrangled_color
        span.innerText = unwrangled_color_text
        div.appendChild(span)
        div.appendChild(document.createTextNode(" means tag is not synned"))
        div.style.marginTop = "10px"
        //Removes both buttons after either is clicked
        button.parentElement.parentElement.appendChild(div)
        button.parentElement.parentElement.removeChild(buttondiv)
    }

    const fetch_syns = function fetch_syns(e) {
        e.preventDefault()

        //special case - if show results in table script is enabled
        //https://greasyfork.org/en/scripts/448079-ao3-wrangling-search-term-highlighting-and-table
        const search_results = SEARCH_RESULTS_TABLE ? document.getElementById('resulttable').getElementsByClassName("tag") : document.querySelector("#main > ol.tag.index.group").getElementsByClassName("tag")

        //This column is hidden by default, so clear that if the show results in table script is active
        if (SEARCH_RESULTS_TABLE) {
            document.querySelector("#resulttable .resultcheck").style.display = "table-cell"
        }

        // Find each item in the tag search results list
        for (const a of search_results) {
            const span = SEARCH_RESULTS_TABLE ? a.parentElement.parentElement.getElementsByClassName("resultcheck")[0] : a.parentElement;
            if (SEARCH_RESULTS_TABLE) {
                a.parentElement.parentElement.getElementsByClassName("resultcheck")[0].style.display = "table-cell"
                span.innerHTML = ""
            }
            // this is the span that will hold the result when the request finishes
            const loading = document.createElement("span");
            //Before our request finishes, shows a loading text so user knows something is happening
            loading.innerText = spacer1 + "Loading..."
            loading.style.fontStyle = "italic"
            span.appendChild(loading);
            // trigger xhr (asynchronous)
            get_synnedto(a.href + "/edit", a, loading);
        }

        //Renames the header of the table, if the show results in table script is enabled
        if (SEARCH_RESULTS_TABLE) {
            document.getElementById('resulttable').querySelector('thead th.resultcheck').innerHTML = "Synonym";
        }

        // add the unsynned color explanation text to the top of the page, replacing the button
        const div = document.createElement("div")
        div.style.fontSize = "0.875rem"
        div.style.fontStyle = "italic"
        div.appendChild(document.createTextNode(""))
        const span = document.createElement("span")
        span.style.color = unwrangled_color
        span.innerText = unwrangled_color_text
        div.appendChild(span)
        div.appendChild(document.createTextNode(" means tag is not synned"))
        div.style.marginTop = "10px"
        //Removes both buttons after either is clicked
        button2.parentElement.parentElement.appendChild(div)
        button2.parentElement.parentElement.removeChild(buttondiv)
    }

    const fetch_wranglers = function fetch_wranglers(e) {
        e.preventDefault()

        //special case - if show results in table script is enabled
        //https://greasyfork.org/en/scripts/448079-ao3-wrangling-search-term-highlighting-and-table
        const search_results = SEARCH_RESULTS_TABLE ? document.getElementById('resulttable').getElementsByClassName("tag") : document.querySelector("#main > ol.tag.index.group").getElementsByClassName("tag")

        //This column is hidden by default, so clear that if the show results in table script is active
        if (SEARCH_RESULTS_TABLE) {
            document.querySelector("#resulttable .resultcheck").style.display = "table-cell"
        }

        // find each item in the tag search results list
        for (const a of search_results) {
            const span = SEARCH_RESULTS_TABLE ? a.parentElement.parentElement.getElementsByClassName("resultcheck")[0] : a.parentElement;
            if (SEARCH_RESULTS_TABLE) {
                a.parentElement.parentElement.getElementsByClassName("resultcheck")[0].style.display = "table-cell"
                span.innerHTML = ""
            }
            // this is the span that will hold the result when the request finishes
            const loading = document.createElement("span");
            //Before our request finishes, shows a loading text so user knows something is happening
            loading.innerText = spacer1 + "Loading..."
            loading.style.fontStyle = "italic"
            span.appendChild(loading);
            // trigger xhr (asynchronous)
            check_wranglers(a.href + "/edit", a, loading);
        }

        //Renames the header of the table, if the show results in table script is enabled
        if (SEARCH_RESULTS_TABLE) {
            document.getElementById('resulttable').querySelector('thead th.resultcheck').innerHTML = "Wranglers";
        }

        // add the unsynned color explanation text to the top of the page, replacing the button
        const div = document.createElement("div")
        div.style.fontSize = "0.875rem"
        div.style.fontStyle = "italic"
        div.appendChild(document.createTextNode(""))
        const span = document.createElement("span")
        span.style.color = unwrangled_color
        span.innerText = unwrangled_color_text
        div.appendChild(span)
        div.appendChild(document.createTextNode(" means fandom has no wrangler"))
        div.style.marginTop = "10px"
        //Removes both buttons after either is clicked
        button2.parentElement.parentElement.appendChild(div)
        button2.parentElement.parentElement.removeChild(buttondiv)
    }

    const fetch_subtags = function fetch_subtags(e) {
        e.preventDefault()

        //special case - if show results in table script is enabled
        //https://greasyfork.org/en/scripts/448079-ao3-wrangling-search-term-highlighting-and-table
        const search_results = SEARCH_RESULTS_TABLE ? document.getElementById('resulttable').getElementsByClassName("tag") : document.querySelector("#main > ol.tag.index.group").getElementsByClassName("tag")

        //This column is hidden by default, so clear that if the show results in table script is active
        if (SEARCH_RESULTS_TABLE) {
            document.querySelector("#resulttable .resultcheck").style.display = "table-cell"
        }

        // find each item in the tag search results list
        for (const a of search_results) {
            const span = SEARCH_RESULTS_TABLE ? a.parentElement.parentElement.getElementsByClassName("resultcheck")[0] : a.parentElement;
            if (SEARCH_RESULTS_TABLE) {
                a.parentElement.parentElement.getElementsByClassName("resultcheck")[0].style.display = "table-cell"
                span.innerHTML = ""
            }
            // this is the span that will hold the result when the request finishes
            const loading = document.createElement("div");
            //Before our request finishes, shows a loading text so user knows something is happening
            loading.innerText = spacer1 + "Loading..."
            loading.style.fontStyle = "italic"
            loading.style.fontWeight = "normal"
            span.appendChild(loading);
            // trigger xhr (asynchronous)
            get_subtags(a.href, a, loading);
        }

        //Renames the header of the table, if the show results in table script is enabled
        if (SEARCH_RESULTS_TABLE) {
            document.getElementById('resulttable').querySelector('thead th.resultcheck').innerHTML = "Subtags";
        }

        //Removes all buttons after either is clicked
        button4.parentElement.parentElement.removeChild(buttondiv)
    }

    const fetch_metatags = function fetch_metatags(e) {
        e.preventDefault()

        //special case - if show results in table script is enabled
        //https://greasyfork.org/en/scripts/448079-ao3-wrangling-search-term-highlighting-and-table
        const search_results = SEARCH_RESULTS_TABLE ? document.getElementById('resulttable').getElementsByClassName("tag") : document.querySelector("#main > ol.tag.index.group").getElementsByClassName("tag")

        //This column is hidden by default, so clear that if the show results in table script is active
        if (SEARCH_RESULTS_TABLE) {
            document.querySelector("#resulttable .resultcheck").style.display = "table-cell"
        }

        // find each item in the tag search results list
        for (const a of search_results) {
            const span = SEARCH_RESULTS_TABLE ? a.parentElement.parentElement.getElementsByClassName("resultcheck")[0] : a.parentElement;
            if (SEARCH_RESULTS_TABLE) {
                a.parentElement.parentElement.getElementsByClassName("resultcheck")[0].style.display = "table-cell"
                span.innerHTML = ""
            }
            // this is the span that will hold the result when the request finishes
            const loading = document.createElement("div");
            //Before our request finishes, shows a loading text so user knows something is happening
            loading.innerText = spacer1 + "Loading..."
            loading.style.fontStyle = "italic"
            loading.style.fontWeight = "normal"
            span.appendChild(loading);
            // trigger xhr (asynchronous)
            get_metatags(a.href, a, loading);
        }

        //Renames the header of the table, if the show results in table script is enabled
        if (SEARCH_RESULTS_TABLE) {
            document.getElementById('resulttable').querySelector('thead th.resultcheck').innerHTML = "Metatags";
        }

        //Removes all buttons after either is clicked
        button4.parentElement.parentElement.removeChild(buttondiv)
    }

    //Code to export search results to a table in a new tab
    //Adjusted from the original code here: https://github.com/vaaas/ao3_wrangling_scripts/blob/master/bookmarklets/ao3_tags_as_table.js
    async function async_export(url) {
        const export_css = "table { border-collapse: collapse; border: 1px solid black; width: 100%; } td, th { padding: 4px; } tr:nth-child(even) { background: #eee; } th { background: #eFe; }";
        const get = url => new Promise(resolve => {
            const xhr = new XMLHttpRequest();
            xhr.onload = (() => resolve(xhr.responseText));
            xhr.open("GET", url);
            xhr.send()
        });
        const resulttags = doc => Array.from(doc.querySelector("#main > ol.tag.index.group").getElementsByTagName("li")).map(get_tag_details);
        const get_tag_details = tag => ({
            tag: tag.querySelector("a").innerHTML,
            type: tag.firstChild.firstChild.textContent.slice(0,-2),
            canonical: tag.querySelector(".canonical") == null? "No" : "Yes",
            taggings: tag.firstChild.lastChild.textContent.split('(')[1].split(')')[0]
        });
        const get_next_page_link = doc => doc.querySelector("a[rel='next']");
        const sleep = time => new Promise(resolve => setTimeout(resolve, time));
        const make_row = tag => `<tr><td>${tag.tag}</td> <td>${tag.type}</td> <td>${tag.canonical}</td> <td>${tag.taggings}</td></tr>`;

        let page = 1;
        const parser = new DOMParser();
        const win = window.open();
        const doc = win.document;
        doc.write("<meta charset='utf-8'><table><tr>");
        doc.write("<style>" + export_css + "</style>");
        doc.write(["Tag", "Type", "Canonical", "Taggings"].map(x => `<th>${x}</th>`).join(""));
        doc.write("</tr>");
        while (url !== null) {
            doc.title = `${page} pages deep`;
            page++;
            const loaded_page = parser.parseFromString(await get(url), "text/html");
            doc.write(resulttags(loaded_page).map(make_row).join(""));
            const next_page_link = get_next_page_link(loaded_page);
            url = next_page_link ? next_page_link.href : null;
            await sleep(page < 1000 ? 3000 : 10000)
        }
        doc.write("</table>");
        doc.title = "Done!";
        alert("Done!")
    }

    const export_results = function export_results(e) {
        e.preventDefault()
        async_export(location.href)
        //Removes all buttons after clicked
        button6.parentElement.parentElement.removeChild(buttondiv)
    }

    // Adds the load fandom button - since this can get someone rate limited,
    // we definitely don't want to have it happen automatically
    button.innerText = "Check fandoms"
    button.addEventListener("click", fetch_fandoms)
    button.style.display = "inline"
    button.style.fontSize = "0.627rem"
    button.style.marginTop = "10px"

    //Adds the load synned to button
    button2.innerText = "Check synned to"
    button2.addEventListener("click", fetch_syns)
    button2.style.display = "inline"
    button2.style.fontSize = "0.627rem"
    button2.style.marginTop = "10px"
    button2.style.marginLeft = "5px"

    //Adds the check wranglers button
    button3.innerText = "Check wranglers"
    button3.addEventListener("click", fetch_wranglers)
    button3.style.display = "inline"
    button3.style.fontSize = "0.627rem"
    button3.style.marginTop = "10px"
    button3.style.marginLeft = "5px"

    //Adds the show subtags button
    button4.innerText = "Check subtags"
    button4.addEventListener("click", fetch_subtags)
    button4.style.display = "inline"
    button4.style.fontSize = "0.627rem"
    button4.style.marginTop = "10px"
    button4.style.marginLeft = "5px"

    //Adds the show metatags button
    button5.innerText = "Check metatags"
    button5.addEventListener("click", fetch_metatags)
    button5.style.display = "inline"
    button5.style.fontSize = "0.627rem"
    button5.style.marginTop = "10px"
    button5.style.marginLeft = "5px"

    //Adds the load synned to button
    button6.innerText = "Export Results"
    button6.addEventListener("click", export_results)
    button6.style.display = "inline"
    button6.style.fontSize = "0.627rem"
    button6.style.marginTop = "10px"
    button6.style.marginLeft = "5px"

    buttondiv.append(button)
    buttondiv.append(button2)

    //Only add the load wranglers button if its a fandom search
    if (page_url.includes("type%5D=Fandom")) {
        buttondiv.append(button3)
    }

    //Only add the show metatag/subtag buttons if its a canonical search
    if (page_url.includes("canonical%5D=T")) {
        buttondiv.append(button4)
        buttondiv.append(button5)
    }

    //Only add the export tags button if on the first page of search results
    if (page_url.endsWith("&commit=Search+Tags") || page_url.includes("&page=1&")) {
        buttondiv.append(button6)
    }

    document.querySelector("#main > h3").append(buttondiv)

    // removes the color background color of the not synned tags are when the user's cursor hovers over them
    // trust me, keeping the same magenta but with the blue text was atrocious
    // comment out the next three lines out at your own risk
    // ......you really don't want to
    // .........don't say i didn't warn you....,
    const style = document.createElement("style")
    style.innerHTML = ".not_synned:hover { background-color: white !important; }"
    document.head.appendChild(style)
})();