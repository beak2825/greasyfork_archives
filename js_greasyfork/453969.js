// ==UserScript==
// @name         AO3: [Wrangling] Peek at unassigned fandoms' bins!!
// @description  Peek at the sizes of the unwrangled tags on the "Fandoms in Need of a Wrangler" pages!
// @version      1.0.1

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/fandoms/unassigned*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453969/AO3%3A%20%5BWrangling%5D%20Peek%20at%20unassigned%20fandoms%27%20bins%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/453969/AO3%3A%20%5BWrangling%5D%20Peek%20at%20unassigned%20fandoms%27%20bins%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Set to be true if you are using the Direct Links on Unassigned Fandoms Page script
    //https://greasyfork.org/en/scripts/435045-ao3-wrangling-direct-links-on-unassigned-fandoms-page/code
    var USING_DIRECT_LINK_SCRIPT = false;

    //Set to false if you don't want the bins to be highlighted
    var SHOW_COLORS = true;

    //Creating a simple "load bins" button
    const button = document.createElement("button")
    const buttondiv = document.createElement("div")
    buttondiv.append(button)
    document.querySelector(".fandoms").prepend(buttondiv)

    //We'll use this to pause the script if we get rate limited
    var ratelimited = false;

    //From a value 0-1, returns a color on the green-red scale
    //Where 0 will display as pure green
    //And 1 will display as pure red
    function getColor(value){
        //value from 0 to 1
        var hue=((1-value)*120).toString(10);
        return ["hsl(",hue,",60%,70%)"].join("");
    }

    // called for each of the 3 unwrangled bins in the fandoms list (char/rel/ff)
    // `url` is the url of that bin's edit page
    // `Results` is the space we are writing the count to
    const getBinCount = function getBinCount(url, results) {
        results.innerText = "Loading...!"
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function xhr_onreadystatechange() {
            if (xhr.readyState == xhr.DONE ) {
                if (xhr.status == 200) {
                    ratelimited = false;
                    var binsize;
                    results.href = url
                    var table = xhr.responseXML.documentElement.querySelector("table")
                    var pagination = xhr.responseXML.documentElement.querySelector(".pagination")
                    if (table == null) {
                        //Nothing in this bin
                        binsize = 0;
                        results.innerText = 0;
                    } else if (pagination == null) {
                        //One page in this bin
                        binsize = table.rows.length - 1;
                        results.innerText = binsize;
                    } else {
                        //Multiple pages in this bin
                        //Gets the text of the button that leads to the last page of that bin
                        var a = xhr.responseXML.documentElement.querySelector(".pagination").querySelectorAll("li")
                        var b = xhr.responseXML.documentElement.querySelector(".pagination").querySelectorAll("li").length-2
                        var c = a[b].innerText;
                        //Max page number -1, then * 20 works per page to get the estimated size
                        //ie 3 pages would mean at least (2*20) tags in the bins
                        binsize = (parseInt(c)-1) * 20
                        results.innerText = binsize + "+"
                    }

                    //Displays highlight color
                    if (SHOW_COLORS) {
                        var normalizednum = binsize/500;
                        if (normalizednum > 1) {
                            normalizednum = 1;
                        }
                        var color = getColor(normalizednum);
                        results.parentElement.style.backgroundColor = color;
                    }

                } else if (xhr.status == 429) {
                    // ~ao3jail
                    //We will pause further queries until not rate limited
                    ratelimited = true;
                    //We'll also wait then retry this xhr request once no longer rate limited
                    waitthenretry(url, results)
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

    const sleep = time => new Promise(resolve => setTimeout(resolve, time));
    const array = f => Array.prototype.slice.call(f, 0)

    //After 30 seconds, we will retry the same xhr request
    async function waitthenretry(url, results) {
        results.innerText = "Retrying"
        await sleep(10000)
        results.innerText = "Retrying."
        await sleep(10000)
        results.innerText = "Retrying.."
        await sleep(10000)
        results.innerText = "Retrying...!"
        getBinCount(url, results)
    }

    //Will go through fandoms on a page, put them in a table,
    //then will make the necessary xhr requests
    async function get_unwrangleddata() {
        button.parentElement.removeChild(button);
        const fandomslist = array(document.querySelectorAll(".fandoms a"))

        var tableheaders = ["Fandom", "Characters", "Relationships", "Freeforms"]
        let table = document.createElement("table");
        let thead = table.createTHead();
        let row = thead.insertRow();
        //Adds headers to table
        for (let key of tableheaders) {
            let th = document.createElement("th");
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }

        document.querySelector(".fandoms").innerHTML = ''
        document.querySelector(".fandoms").appendChild(table)

        //Instantly load the fandomslist in the table
        //We'll go back through each fandom later
        for (var fandom of fandomslist) {
            const tr = table.insertRow();
            const trlink = document.createElement("a")
            trlink.innerHTML = fandom.innerText;
            trlink.href = fandom.href;
            tr.appendChild(trlink)
        }

        //Now we'll go through each fandom!!
        //We'll create the cells for the resulting links
        //and counts to go
        for (let i = 1; i < table.rows.length; i++) {
            let currentrow = table.rows[i]
            let fandomlink = currentrow.querySelector("a").href

            var charbincell = currentrow.insertCell()
            var charbinlink = document.createElement("a")
            charbincell.appendChild(charbinlink)
            charbinlink.target = "_blank"
            charbinlink.style.color = "black";

            var relbincell = currentrow.insertCell()
            var relbinlink = document.createElement("a")
            relbincell.appendChild(relbinlink)
            relbinlink.target = "_blank"
            relbinlink.style.color = "black";

            var ffbincell = currentrow.insertCell()
            var ffbinlink = document.createElement("a")
            ffbincell.appendChild(ffbinlink)
            ffbinlink.target = "_blank"
            ffbinlink.style.color = "black";

            //If rate limited, prevent new xhr requests
            //Then wait until no longer rate limited to continue
            while (ratelimited) {
                charbinlink.innerText = "Paused"
                relbinlink.innerText = "Paused"
                ffbinlink.innerText = "Paused"
                await sleep(10000)
            }

            //Short delay so the servers won't hate us
            charbinlink.innerText = "Loading."
            relbinlink.innerText = "Loading."
            ffbinlink.innerText = "Loading."
            await sleep(1000)
            charbinlink.innerText = "Loading.."
            relbinlink.innerText = "Loading.."
            ffbinlink.innerText = "Loading.."
            await sleep(1000)
            charbinlink.innerText = "Loading..."
            relbinlink.innerText = "Loading..."
            ffbinlink.innerText = "Loading..."
            await sleep(1000)

            if (USING_DIRECT_LINK_SCRIPT) {
                const lastIndex = fandomlink.lastIndexOf('/');
                fandomlink = fandomlink.slice(0, lastIndex)
            }

            getBinCount(fandomlink + "/wrangle?show=characters&status=unwrangled", charbinlink)
            getBinCount(fandomlink + "/wrangle?show=relationships&status=unwrangled", relbinlink)
            getBinCount(fandomlink + "/wrangle?show=freeforms&status=unwrangled", ffbinlink)
        }
    }

    // Styles button
    button.innerText = "Show bins!"
    button.addEventListener("click", get_unwrangleddata)
    button.style.display = "inline"
    button.style.fontSize = "0.627rem"
    button.style.marginTop = "10px"

    //Making the text on the table look nicer
    const style = document.createElement("style")
    style.innerHTML = ".a:visited { color: black !important; } tr { border-bottom: 1px solid #fff !important}"
    document.head.appendChild(style)
})();