// ==UserScript==
// @name         AO3: [Wrangling] Fetch All Tag Info
// @description  Fetch available tag information in tag search with one click
// @version      0.1

// @author       endofthyme
// @namespace    http://tampermonkey.net/
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tags/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503605/AO3%3A%20%5BWrangling%5D%20Fetch%20All%20Tag%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/503605/AO3%3A%20%5BWrangling%5D%20Fetch%20All%20Tag%20Info.meta.js
// ==/UserScript==

//IMPORTANT!! Requires the show results in a table script!! (Totally recommended, it's an awesome script!)
//https://greasyfork.org/en/scripts/448079-ao3-wrangling-search-term-highlighting-and-table

// WARNING: Setting this to true will result in a second page load per tag.
var CHECK_UNIQUE_USERS = false;

const RATE_LIMITED = "Rate limited. Sorry :("
const UNEXPECTED_ERROR = "Unexpected error, check the console"

const workscolumnlabel = CHECK_UNIQUE_USERS ? "Users" : "Works"
const columnlist = ["synnedto", "iscanonical", "comments", "works", "metatags", "subtags"]
const columninnertextlist = ["Synned to", "Canon?", "Comments", workscolumnlabel, "Metatags", "Subtags"]
const checkboxlabels = ["Syns ", "Canonical ", "Comments ", workscolumnlabel + " ", "Metatags ", "Subtags "]
// other idea: is wrangled?

//So things like getElementsByTagName get a nodelist, not an array
//This lets us convert the nodelists into an actual array so we can use array functions on it
//See https://stackoverflow.com/questions/5145032/whats-the-use-of-array-prototype-slice-callarray-0
const array = a => Array.prototype.slice.call(a, 0)

//Returns a tag's fandoms
//Does this by peeking at all the "fandoms to remove" on the tag's edit form and putting them into a list
function check_fandoms(xhr) {
    const fandoms = []
    const checks = array(xhr.responseXML.documentElement.querySelectorAll("label > input[name='tag[associations_to_remove][]']")).filter(foo => foo.id.indexOf("parent_Fandom_associations_to_remove") != -1);
    for (const check of checks) {
        const name = check.parentElement.nextElementSibling.innerText
        fandoms.push(name)
    }
    return fandoms.length == 0 ? "Unwrangled" : fandoms.join(", ");
}

function check_using_checkboxes(xhr, label_prefix) {
    const output = []
    const checks = array(xhr.responseXML.documentElement.querySelectorAll("label > input[name='tag[associations_to_remove][]']")).filter(foo => foo.id.indexOf(label_prefix + "_associations_to_remove") != -1);
    for (const check of checks) {
        const name = check.parentElement.nextElementSibling.innerText
        output.push(name)
    }
    return output.join(", ");
}

//Returns what a tag is synned to, or an empty string if its unsynned
function check_synnedto(xhr) {
    return xhr.responseXML.documentElement.querySelector("#tag_syn_string")?.value || ""
}

//Checks if tag is canonized
function check_if_canonical(xhr) {
    return xhr.responseXML.documentElement.querySelector("#tag_canonical")?.checked ? '✔' : "";
}

//Returns the comments
function check_comments(xhr) {
    const commenthtml = xhr.responseXML.documentElement.querySelector("p.navigation > a")?.innerHTML
    if (commenthtml != null) {
        const comment_count = commenthtml.match(/^\d+/)
        const comment_date = commenthtml.match(/\d{4}-\d{2}-\d{2}/)
        return comment_count[0] + (comment_date ? " (last: " + comment_date[0] + ")" : "")
    }
    return ""
}

//Returns the work count
function check_works(xhr) {
    return xhr.responseXML.documentElement.querySelector("#dashboard ul.navigation.actions > li a[href*='works']")?.innerHTML.match(/\d+/) || ""
}

//Returns the unique user count (from the tag landing page instead of the edit page)
function check_unique_users(xhr) {
    const works = array(xhr.responseXML.documentElement.querySelectorAll("div.work div.header h4"))
    var users = new Set();
    var user_count = 0;
    for (const work of works) {
        var found_a_user = false;
        var found_repeat_user_or_orphaned = false;
        var new_user_set = new Set(users);
        const authors = array(work.querySelectorAll("a[rel$='author']"))
        for (const author of authors) {
            var parsed_user = author.innerHTML;
            var check_pseud = parsed_user.match(/[^(]*\(([^)]*)\)/) // do not count pseuds separately
            if (check_pseud) {
                parsed_user = check_pseud[1]
            }
            if (parsed_user) {
                found_a_user = true;
                if (parsed_user == "orphan_account" || users.has(parsed_user)) {
                    found_repeat_user_or_orphaned = true;
                } else {
                    new_user_set.add(parsed_user);
                }
            }
        }
        if (found_a_user && !found_repeat_user_or_orphaned) {
            user_count++;
            // only add users to list if the work was counted as a unique use
            for (const x of new_user_set) {
                users.add(x);
            }
        }
    }
    const has_multiple_pages = xhr.responseXML.documentElement.querySelectorAll("div.work h4.landmark").length > 0;
    return user_count + (has_multiple_pages ? "+" : "")
}

function gather_data(url, a, result, tdlist, fandom) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function xhr_onreadystatechange() {
        if (xhr.readyState == xhr.DONE ) {
            if (xhr.status == 200) {
                const fandoms = check_using_checkboxes(xhr, "parent_Fandom")
                if (fandoms == "") {
                    result.innerText = "Unwrangled"
                } else if (fandom == fandoms) {
                    result.innerText = "-"
                } else {
                    result.innerText = fandoms
                }
                tdlist[0].innerText = check_synnedto(xhr)
                tdlist[1].innerText = check_if_canonical(xhr)
                tdlist[2].innerText = check_comments(xhr)
                tdlist[4].innerText = check_using_checkboxes(xhr, "parent_MetaTag")
                tdlist[5].innerText = check_using_checkboxes(xhr, "child_SubTag")

                if (!CHECK_UNIQUE_USERS) {
                    tdlist[3].innerText = check_works(xhr)
                } else if (tdlist[1].innerText != '✔') {
                    const xhr2 = new XMLHttpRequest();
                    xhr2.onreadystatechange = function xhr2_onreadystatechange() {
                        if (xhr2.readyState == xhr2.DONE ) {
                            if (xhr2.status == 200) {
                                tdlist[3].innerText = check_unique_users(xhr2)
                            } else if (xhr2.status == 429) {
                                result.innerText = RATE_LIMITED
                            } else {
                                result.innerText = UNEXPECTED_ERROR
                                console.log(xhr2)
                            }
                        }
                    }
                    xhr2.open("GET", url)
                    xhr2.responseType = "document"
                    xhr2.send()
                }
            } else if (xhr.status == 429) {
                result.innerText = RATE_LIMITED
            } else {
                result.innerText = UNEXPECTED_ERROR
                console.log(xhr)
            }
        }
    }
    xhr.open("GET", url + "/edit")
    xhr.responseType = "document"
    xhr.send()
}

(function($) {
    'use strict';

    var page_url = window.location.href;

    const button = document.createElement("button")
    const buttondiv = document.createElement("div")
    var checkboxlist = []
    for (let i = 0; i <= columnlist.length; i++) {
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.checked = true;
        checkboxlist.push(checkbox);
    }
    const checkboxdiv = document.createElement("div")
    checkboxdiv.style.marginTop = "10px"
    checkboxdiv.style.fontSize = "0.875rem"

    const fetch_data = function fetch_data(e) {
        e.preventDefault()

        //requires show results in table script to be enabled
        //https://greasyfork.org/en/scripts/448079-ao3-wrangling-search-term-highlighting-and-table
        const search_results = document.getElementById('resulttable').getElementsByClassName("tag")

        const fandom_input = document.getElementById('new_tag_search').getElementsByClassName("added")
        var fandom = ""
        if (fandom_input.length == 1) fandom = fandom_input[0].innerText.replace(" ×","")

        //These columns are not present by default
        document.querySelector("#resulttable .resultcheck").style.display = "table-cell"
        document.getElementById('resulttable').getElementsByClassName("resultcheck")[0].appendChild(document.createElement("span"));
        var columnindex = 0;
        for (const columnname of columnlist) {
            const column = document.createElement("th");
            column.innerText = columninnertextlist[columnindex];
            column.classList.add(columnname);
            column.appendChild(document.createElement("span"));
            document.getElementById('resulttable').getElementsByClassName("resultcheck")[0].parentElement.appendChild(column);
            columnindex += 1;
        }

        // **** start of table sorting logic (thanks owlwinter!!)
        const headers = array(document.getElementById('resulttable').querySelectorAll('thead th'));
        console.log(headers)
        for (let i = 0; i <= 4 + columnlist.length; i++) {
            headers[i].addEventListener('click', function (index) {
                sortColumn(i);
            });
        }

        // Track sort directions
        //If a row is clicked twice in a row, it will do a reverse sort
        //But if clicked a third time, it will switch back to a normal sort
        //And so on and so forth
        const directions = Array.from(headers).map(function (header) {
            return '';
        });

        //Special case - if you click sort by uses, we want to start with the highest uses at the top
        directions[1] = 'desc';

        const sortColumn = function (index) {
            // Get the current direction
            const direction = directions[index] || 'asc';

            // add a sorting direction triangle indicator
            $(headers[index]).find('span').html((direction === 'asc') ? '&#9652;' : ' &#9662;');

            // A factor based on the direction
            const multiplier = (direction === 'asc') ? 1 : -1;

            const table = document.getElementById('resulttable');
            const tableBody = table.querySelector('tbody');
            const rows = tableBody.querySelectorAll('tr');

            // Clone the rows
            const newRows = Array.from(rows);

            // Sort rows by the content of cells
            newRows.sort(function (rowA, rowB) {
                let cellA;
                let cellB;

                // Get the content of cells
                if (index == 0) {
                    cellA = rowA.querySelectorAll('th')[index].textContent.toLowerCase();
                    cellB = rowB.querySelectorAll('th')[index].textContent.toLowerCase();
                } else {
                    cellA = rowA.querySelectorAll('td')[index-1].textContent.toLowerCase();
                    cellB = rowB.querySelectorAll('td')[index-1].textContent.toLowerCase();
                }

                if (cellA.match(/^\d+$/) && cellB.match(/^\d+$/)) {
                    //javascript sure is something alright !
                    //...without this, it will happily tell you that 8938 < 9
                    cellA = parseFloat(cellA);
                    cellB = parseFloat(cellB);
                }

                switch (true) {
                    case cellA > cellB: return 1 * multiplier;
                    case cellA < cellB: return -1 * multiplier;
                    case cellA === cellB: return 0;
                }
            });

            // Remove old rows
            [].forEach.call(rows, function (row) { tableBody.removeChild(row); });
            // Append new row
            newRows.forEach(function (newRow) { tableBody.appendChild(newRow); });
            // Reverse the direction
            directions[index] = direction == 'asc' ? 'desc' : 'asc';
        }

        // **** end of table sorting logic

        // find each item in the tag search results list
        for (const a of search_results) {
            const span = a.parentElement.parentElement.getElementsByClassName("resultcheck")[0];
            a.parentElement.parentElement.getElementsByClassName("resultcheck")[0].style.display = "table-cell"
            span.innerHTML = ""

            // this is the span that will hold the result when the request finishes
            const loading = document.createElement("span");
            //Before our request finishes, shows a loading text so user knows something is happening
            loading.innerText = "Loading..."
            loading.style.fontStyle = "italic"
            span.appendChild(loading);

            var tdlist = []
            for (const item of columnlist) {
                const td = document.createElement("td")
                td.classList.add(item)
                a.parentElement.parentElement.appendChild(td)
                tdlist.push(td)
            }
            // trigger xhr (asynchronous)
            gather_data(a.href, a, loading, tdlist, fandom);
        }

        //Renames the header of the table
        document.getElementById('resulttable').querySelector('thead th.resultcheck').innerHTML = "Fandom";
        document.getElementById('resulttable').querySelector('thead th.resultcheck').appendChild(document.createElement("span"))

        //Removes button after it's clicked
        button.parentElement.parentElement.removeChild(buttondiv)
    }

    const show_check_column = function show_check_column(e) {
        for (var column of document.getElementsByClassName(this)) {
            if (e.currentTarget.checked) {
                column.style.display = "table-cell";
            } else {
                column.style.display = "none";
            }
        }
    }

    // Add the load fandom button - since this can get someone rate limited,
    // we definitely don't want to have it happen automatically
    button.innerText = "Fetch data"
    button.addEventListener("click", fetch_data)

    button.style.display = "inline"
    button.style.fontSize = "0.627rem"
    button.style.marginTop = "10px"
    buttondiv.append(button)

    checkboxlist[0].addEventListener("change", show_check_column.bind("resultcheck"))
    checkboxdiv.append("Show columns: Fandoms ")
    checkboxdiv.append(checkboxlist[0])
    const buffer = String.fromCharCode(160, 160, 160, 160)
    for (let i = 0; i < columnlist.length; i++) {
        checkboxlist[i + 1].addEventListener("change", show_check_column.bind(columnlist[i]))
        checkboxdiv.append(buffer + checkboxlabels[i])
        checkboxdiv.append(checkboxlist[i + 1])
    }

    document.querySelector("#main > h3").append(buttondiv)
    document.querySelector("#main > h3").append(checkboxdiv)

    // removes the color background color of the not synned tags are when the user's cursor hovers over them
    // trust me, keeping the same magenta but with the blue text was atrocious
    // comment out the next three lines out at your own risk
    // ......you really don't want to
    // .........don't say i didn't warn you....,
    const style = document.createElement("style")
    style.innerHTML = ".not_synned:hover { background-color: white !important; }"
    document.head.appendChild(style)
})(jQuery);