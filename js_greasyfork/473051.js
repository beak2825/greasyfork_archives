// ==UserScript==
// @name         cs.rin.ru quick search all terms
// @namespace    none
// @version      1
// @description  add a field beside the search button to search all terms and an option to search within posts https://cs.rin.ru/forum/viewtopic.php?f=14&t=134386
// @author       odusi
// @match        https://cs.rin.ru/forum/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473051/csrinru%20quick%20search%20all%20terms.user.js
// @updateURL https://update.greasyfork.org/scripts/473051/csrinru%20quick%20search%20all%20terms.meta.js
// ==/UserScript==
/*
Search within
all = Post subjects and message text. msgonly = Message text only. titleonly = Topic titles only. topics = First post of topics only
*/
let sf = 'titleonly'
/*
Sort results by
a = author. t = post time. f = forum. i = topic title. s = post subject
*/
const sk = 't'
const sd = 'd' // Sort results by: a = ascending. d = descending
const sr = 'topics' // Display results as: topics, posts
const ch = 300; // Return first # characters of posts

document.querySelector("#menubar > table:nth-child(3) > tbody > tr > td:nth-child(2)").insertAdjacentHTML('afterbegin', `
<div id="search-all-terms" style="position:relative;display:inline-block;"><input type="text" placeholder="Search for all terms">
    <div style="position: absolute; top: 110%">
    <input id="somecheckbox" type="checkbox" style="margin-right: 0.3rem;">
    <label for="somecheckbox">Search within posts</label></div>
    </div></div>
`)

const container = document.getElementById("search-all-terms")
const inputField = container.querySelector('input')
const checkbox = container.querySelector('#somecheckbox')

inputField.addEventListener('keydown', ev => {
    if (ev.code === 'Enter') {
        if (checkbox.checked) sf = 'all'
        window.location.href = `./search.php?keywords=${encodeURIComponent(inputField.value).replace(/%20/g, "+")}&terms=all&author=&sc=1&sf=${sf}&sk=${sk}&sd=${sd}&sr=${sr}&st=0&ch=${ch}&t=0`
    }
})