// ==UserScript==
// @name         Goodreads Search Many
// @version      0.5
// @namespace    https://greasyfork.org/en/users/929273-eshuigugu
// @description  Add "Search MAM" button to Goodreads
// @author       Eshuigugu
// @match https://www.goodreads.com/list/*
// @match https://www.goodreads.com/award/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447036/Goodreads%20Search%20Many.user.js
// @updateURL https://update.greasyfork.org/scripts/447036/Goodreads%20Search%20Many.meta.js
// ==/UserScript==



var bookTitle = getBooksQuery();
var mam_url = new URL("https://www.myanonamouse.net/tor/browse.php");
mam_url.searchParams.append('tor[text]', bookTitle);
// Add 'Search MAM' button
var buttonBar = document.getElementsByClassName("right")[1]
//If it isn't "undefined" and it isn't "null", then it exists.
if(typeof(buttonBar) == 'undefined' || buttonBar == null){
    // if the page is an awards page then select a different element
    buttonBar = document.getElementsByTagName("h2")[0]
}
var buttonUl = buttonBar.getElementsByTagName("a");
let element = document.createElement("a");
element.href = mam_url.href;
element.innerHTML="Search MAM";
element.className = 'tab';
element.setAttribute("style", "float: right;");
element.target="_blank";
buttonBar.appendChild(element)
console.log("'Search MAM' button added!");



// Grab book title (and only title) from the element
function getBooksQuery(){
    var books_list = document.getElementsByTagName("tbody")[0];
    var joined_query="";
    for (const listed_book of books_list.getElementsByTagName("tr")
        ) {
        // prevent the query string from getting to long so it won't break if there are many long titles
        if (joined_query.length < 5640) {
            var book_title = listed_book.getElementsByClassName("bookTitle")[0].text.replace(/[\(;~].*/i,"").replace(/[/\\\"\@]/g, " ").trim()
            var book_author = listed_book.getElementsByClassName("authorName")[0].text.trim()
            undefined
            var query_str = `(${book_title} ${book_author })`;
            if (joined_query.length == 0){
                joined_query=query_str
            }
            else
            {
                joined_query+= "|"+query_str
            }
        }
    }
    return joined_query
}
