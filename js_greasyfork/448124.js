// ==UserScript==
// @name        ASIN to Goodreads Pages
// @namespace   Violentmonkey Scripts
// @match       https://www.goodreads.com/book/show/*
// @grant       GM_setClipboard
// @require     https://code.jquery.com/jquery-latest.min.js
// @version     1.0.1
// @author      spiritomb
// @run-at      document-end
// @icon        https://www.google.com/s2/favicons?domain=goodreads.com
// @description Adds mobi-asin to individual book pages and copies it to the clipboard when clicked. On desktop, clicking "mobi-asin:" will copy the asin to the clipboard with "mobi-asin:" as a prefix for easy pasting into Calibre ebook library software. Works on book pages that have a button to buy from the Kindle Store or are listed under the book details as a Kindle edition.
// @downloadURL https://update.greasyfork.org/scripts/448124/ASIN%20to%20Goodreads%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/448124/ASIN%20to%20Goodreads%20Pages.meta.js
// ==/UserScript==

// inspired by CH Amazon ASIN Adder by clickhappier https://greasyfork.org/en/scripts/6862-ch-amazon-asin-adder

function matchASIN(href) { // adapted from getASIN function in clickhappier's userscript
  var asinMatch;
  if (!asinMatch) { asinMatch = href.match(/\/gp\/product\/(\w{10})/i); }
  if (!asinMatch) { asinMatch = href.match(/\/dp\/(\w{10})/i); }
  if (!asinMatch) { return null; }
  return asinMatch[1];
}

function isKindleEd() {
    let bookFormat = $('span[itemprop=bookFormat]')[0].innerText;
    if (bookFormat == "Kindle Edition"){
        return bookFormat;
    } else {
        return null;
    }
}

function addAsin(element, asin) {
    let asinWrapper = document.createElement("span");
    asinWrapper.style.fontSize = "90%";
    asinWrapper.id = "asinwrapper";
    let asinPrefix = document.createElement("span");
    asinPrefix.id = "calibreprefix";
    asinPrefix.innerHTML = "mobi-asin:";
    asinWrapper.append(asinPrefix);
    let asinForReal= document.createElement("span");
    asinForReal.id = "mobiasin";
    asinForReal.innerHTML = asin;
    asinWrapper.append(asinForReal);
    

    if (asin != null){
        element.after(asinWrapper);
        $('span#calibreprefix').on('click',function(){
            let clippedText = `mobi-asin:${asin}`;
            GM_setClipboard(clippedText);
            alert(`Copied "${clippedText}" to clipboard`);
        });
        $('span#mobiasin').on('click',function(){
            GM_setClipboard(asin);
            alert(`Copied ${asin} to clipboard`);
        });
    } else {
        console.log("no asin found");
    }
}

var asin;

$('h1#bookTitle').each(function(){
    if ( isKindleEd() != null ){
        asin = $('div[itemprop=isbn]')[0].innerText;
    }
    else {
        asin = $('a.buttonBar[data-asin]').attr('data-asin');
    }
    if (asin != null){
        addAsin(this, asin);
    }
});

$('h1.bookTitle').each(function(){
    if ( isKindleEd() != null ){
        asin = $('dd.bookAsin')[0].innerText;
    }
    else {
        asin = matchASIN( $('a.glideButton').attr('href') );
    }
    if (asin != null){
        addAsin(this, asin);
    }
});

if ( !!( $("link[rel='stylesheet'][href*='_next']")) ) {
    setTimeout( function () {
        var bookData = document.querySelector("body > script#__NEXT_DATA__").textContent;
        bookData = JSON.parse(bookData);
        let apollo = bookData.props.pageProps.apolloState;
        let legacyBookId = bookData.query.book_id;
        legacyBookId = JSON.stringify(legacyBookId);
        legacyBookId = legacyBookId.split("-")[0];
        legacyBookId = legacyBookId.replace("\"", "");
        let fancyBookId = apollo.ROOT_QUERY[`getBookByLegacyId({"legacyId":"${legacyBookId}"})`].__ref;
        let details = apollo[`${fancyBookId}`].details;
        asin = details.asin;
        console.log(asin);
        $("h1[data-testid='bookTitle']").each(function() {
            addAsin(this, asin);
        });
    }, 5000);
}
