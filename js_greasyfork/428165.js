// ==UserScript==
// @name         Open Goodreads book in Amazon
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a button to a book's goodreads page to open that book's page in Aussie Amazon
// @author       You
// @match        https://www.goodreads.com/book/show/*
// @icon         https://www.google.com/s2/favicons?domain=goodreads.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428165/Open%20Goodreads%20book%20in%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/428165/Open%20Goodreads%20book%20in%20Amazon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var amazonURLPattern = "https://www.amazon.com.au/gp/product/";

    var panel = $('#imagecol');
    var button = document.createElement('BUTTON');
    button.innerHTML = "View on Amazon";
    button.id = "btnSearchOnAmazon";
    button.style.display = "flex";
    button.style.margin = "auto";
    button.style.marginTop = "10%";
    panel.append(button);

    $('#btnSearchOnAmazon').click(function() {
        var isbn = $('[itemprop*=isbn]')[0];
        while(true){
            if(isbn.classList.contains('infoBoxRowItem')){
                break
            }
            isbn = isbn.parentElement;
        }

        window.location.href = amazonURLPattern + isbn.innerText.split(" ")[0];
    });

})();