// ==UserScript==
// @name         Grundo's Cafe Book Helper
// @namespace    github.com/windupbird144/
// @version      0.9
// @description  Show unread books on your pet's book page
// @author       You
// @match        https://www.grundos.cafe/books_read/?pet_name=*
// @match        https://grundos.cafe/books_read/?pet_name=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/464937/Grundo%27s%20Cafe%20Book%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/464937/Grundo%27s%20Cafe%20Book%20Helper.meta.js
// ==/UserScript==
/* globals $ */

// Add on-click toggle for booklist
function toggleBooks() {
    $("#books-to-read").toggle();
}

const booksUrl = `https://raw.githubusercontent.com/rowanberryyyy/gc-book-helper/main/books.json`;

/**
 * Analyse the document to find out which books your pet has read
 *
 * @returns string[] title of book your pets has read
 */
const getReadBooks = () =>
    Array.from(document.querySelectorAll(".center > table > tbody > tr:nth-of-type(n+1)")).map(e => e.childNodes[3].childNodes[0].textContent.trim().replace(" (","").toUpperCase())

/**
 * Return a list of books your pet has not read
 * TODO: Use a more efficient algorithm
 *
 * @param {[string, number][]} listOfBooks
 * @param {string[]} booksRead
 *
 * @returns {[string, number][]} the books your pet has not read
 */
const filterReadBooks = (listOfBooks, booksRead) => {
    return listOfBooks.filter(([name,_]) => !booksRead.includes(name.toUpperCase()));
}

// callback to sort books by rarity
const byRarity = ([_, rarity1], [__, rarity2]) => rarity1 - rarity2;

const html = (books) => `
<div class="bookbutton"><p><button id='viewbooks'>Your pet has ${books.length} books left to read!</button></p></div>
<div id="books-to-read" style="display:none">
    <div class="booklist">
    <ul>
            ${books.sort(byRarity).map(([name, rarity]) => `
                <li>
                    <span style="user-select:all">${name}</span> (<b>r${rarity})</b><br>
                    <a href="/market/wizard/?query=${name}" target="_bookSearch"><img width="15px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/wiz.png"></a>
                    <a href="/island/tradingpost/browse/?query=${name}" target="_bookSearch"><img width="15px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/tp.png"></a>
                    <a href="/safetydeposit/?page=1&category=&type=&query=${name}" target="_bookSearch"><img width="15px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/sdb.gif"></a>
                </li>
            `).join("")}
        </ul>
    </div>
</div>`;

// Append CSS to the page
let customCSS = `
.bookbutton {
    margin: auto;
}
.booklist {
    height: 800px;
    overflow: auto;
    line-height: 20px;
}
.booklist ul {
    column-count: 2;
}
.booklist li {
    width: 95%;
}
.booklist li:nth-of-type(2n) {
    background: var(--grid_select);
}
`;

$("<style>").prop("type", "text/css").html(customCSS).appendTo("head");

// Ty Riz for the SW/TP add-on!

async function main() {
    const listOfBooks = await fetch(booksUrl).then(res => res.json());
    const toRead = filterReadBooks(listOfBooks, getReadBooks());
    $(".center > table").before(html(toRead));

    // Attach the toggleBooks function to the button click event
    $("#viewbooks").on("click", toggleBooks);
}

main().then();
