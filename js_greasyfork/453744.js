// ==UserScript==
// @name         AO3: Auto-scrape accurate tag usage data from Ao3's tag search!!
// @description  Takes a search from tag search and exports those tags + their total usage on ao3 in a new tab!
// @version      1.0.2

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tags/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453744/AO3%3A%20Auto-scrape%20accurate%20tag%20usage%20data%20from%20Ao3%27s%20tag%20search%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/453744/AO3%3A%20Auto-scrape%20accurate%20tag%20usage%20data%20from%20Ao3%27s%20tag%20search%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //This script takes a search from tag search and exports the results in a new tab
    //It is!!! Very slow!!! Because I am also scraping to get further information about each tag
    //   ie, how many fics use each tag
    //   (the number displayed via tag search is only the number of works that use that exact tag,
    //   not the number of fics that redirect to that tag)
    // When I say slow, I mean it!!
    // It took me about 4 days to scrape the 271 pages of No Fandom canonical freeforms
    // It takes that long so as to not get us rate limited by the ao3 server gods :)

    //Creating a simple "scrape" button - since this can get someone rate limited,
    // we definitely don't want to have it happen automatically
    const button = document.createElement("button")
    const buttondiv = document.createElement("div")
    buttondiv.append(button)
    document.querySelector("#main > h3").append(buttondiv)

    // called for each tag in the search results list
    // `url` is the url of the tag's works page
    // `tagname` is the name of the tag
    // `doc` is the page we are writing our results to
    const getRealCount = function getRealCount(url, tagname, doc) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function xhr_onreadystatechange() {
            if (xhr.readyState == xhr.DONE ) {
                if (xhr.status == 200) {
                    //Grabs the title text including number of works
                    let titletext = xhr.responseXML.documentElement.querySelector("h2").innerText

                    //Trims whitespace
                    titletext = titletext.replace(/\s+/g, ' ').trim()

                    let workcount
                    //If there's multiple pages of results
                    if (xhr.responseXML.documentElement.querySelector(".next") != null) {
                        //Format: 1 - 20 of 39 Works in #ficwip 5k Challenge
                        workcount= titletext.split(" ")[4]
                    } else {
                        //Format: 1 Work in #AksaraAgustus2017
                        //Gets just the first word
                        workcount = titletext.replace(/ .*/,'');
                    }
                    //Writing the tagname & workcount to our new tab
                    doc.write(`<tr><td>${tagname}</td> <td>${workcount}</td> </tr>`)

                    console.log(tagname + " " + workcount)
                } else if (xhr.status == 429) {
                    // ~ao3jail
                    return "Rate limited. Sorry :("
                } else {
                    return "Unexpected error, check the console :("
                    console.log(xhr)
                }
            }
        }
        xhr.open("GET", url)
        xhr.responseType = "document"
        xhr.send()
    }

    //Code to export search results to a table in a new tab
    //Adjusted from the original code here: https://github.com/vaaas/ao3_wrangling_scripts/blob/master/bookmarklets/ao3_tags_as_table.js
    async function async_export(url) {
        //CSS of the page we are exporting our results to
        const export_css = "table { border-collapse: collapse; border: 1px solid black; width: 100%; } td, th { padding: 4px; } tr:nth-child(even) { background: #eee; } th { background: #eFe; }";

        //Some helper functions
        const get = url => new Promise(resolve => {
            const xhr = new XMLHttpRequest();
            xhr.onload = (() => resolve(xhr.responseText));
            xhr.open("GET", url);
            xhr.send()
        });
        const get_next_page_link = doc => doc.querySelector("a[rel='next']");
        const sleep = time => new Promise(resolve => setTimeout(resolve, time));

        let page = 1;
        const parser = new DOMParser();
        const win = window.open();
        const doc = win.document;
        doc.write("<meta charset='utf-8'><table><tr>");
        doc.write("<style>" + export_css + "</style>");
        //This is where you can change the header row text!
        doc.write(["Tag", "Count"].map(x => `<th>${x}</th>`).join(""));
        doc.write("</tr>");

        //For each page of the search results:
        while (url !== null) {
            doc.title = `${page} pages deep`;
            page++;
            const loaded_page = parser.parseFromString(await get(url), "text/html");
            let resulttags = loaded_page.querySelectorAll("li .tag");

            //For each tag on that search results page:
            for (const row of resulttags) {
                //Goes to the works page of that tag so we can grab the accurate tag count!!
                //You can change this to the tag edit page if you want to collect different data
                //Such as the fandoms all those tags are in
                //Just be sure to change what getRealCount() is grabbing if you are doing so
                getRealCount(row.href + "/works", row.innerText, doc);
                //If you want to make this script faster, you can lower the number
                //But this number is sure to not get you rate limited
                await sleep(10000)
            }
            const next_page_link = get_next_page_link(loaded_page);
            url = next_page_link ? next_page_link.href : null;
            //If you want to make this script faster, you can also lower the number
            //But this number is sure to not get you rate limited
            await sleep(10000)
        }
        doc.write("</table>");
        doc.title = "Done!";
        alert("Done!")
    }

    //Just calls the async function when the button is clicked
    const export_results = function export_results(e) {
        e.preventDefault()
        //Only run script on canonical tag search (check via url)
        if (!window.location.href.includes("canonical%5D=T")) {
            window.alert("Please only run this script on a canonical tag search - change the \"Wrangling status\" option to \"Canonical\" and re-search tags!");
            return;
        }
        async_export(location.href)
    }

    // Styles "scrape" button
    button.innerText = "Scrape data"
    button.addEventListener("click", export_results)
    button.style.display = "inline"
    button.style.fontSize = "0.627rem"
    button.style.marginTop = "10px"

    // Your code here...
})();