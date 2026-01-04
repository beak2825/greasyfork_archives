// ==UserScript==
// @name         Steam Wishlist Scraper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Scrapes steam wishlist into a CSV file for Excel / LibreOffice
// @author       retnuh66@gmail.com
// @match        *store.steampowered.com/wishlist/profiles/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39569/Steam%20Wishlist%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/39569/Steam%20Wishlist%20Scraper.meta.js
// ==/UserScript==

( function() {
    'use strict';

    var titles = [];
    var dates = [];

    var final_output = [];

    checkData();

    // Scroll and collect data until we hit the bottom of the page
    function scrollScrape(){
        if ((window.innerHeight + window.scrollY) < document.body.offsetHeight) {
            scrapeData();
            setTimeout(function() {
                scrollScrape();
            }, 100);
        } else {
            console.log("End");
            doneScraping();
        }
    }

    // Scrape titles and release dates
    function scrapeData(){
        titles = document.getElementsByClassName('title');
        dates = document.getElementsByClassName('value release_date');

        var output = [];
        var clean_output = [];
        console.log(titles);

        for(var i = 0; i < titles.length; i++){
            var temp_title = titles[i].innerText;
            var temp_date = dates[i].innerText;
            //console.log(temp_title);
            //console.log(temp_date);
            if (typeof temp_title != 'undefined' && temp_title.length != 0 && typeof temp_date != 'undefined' && temp_date.length != 0){
                // Strip commas, add "^" for newlines
                temp_title = "^" + temp_title.replace(/,/g,"");
                temp_date = temp_date.replace(/,/g,"");
                // Trim whitespace
                temp_title = temp_title.trim();
                temp_date = temp_date.trim();

                if ( !final_output.includes(temp_title)){
                    output.push(temp_title);
                    output.push(temp_date);
                }
            }
        }

        clean_output = cleanArray(output);
        final_output = final_output.concat(clean_output);
        console.log(final_output);

        window.scrollBy(0, 500);
    }

    // Waits until the collection is populated by wishlist.js
    function checkData(){
        titles = document.getElementsByClassName('title');
        dates = document.getElementsByClassName('value release_date');
        if (typeof titles[0] == 'undefined' || titles[0] == null){
            console.log("waiting for wishlist.js...");
            setTimeout(function() {
                checkData();
            }, 1000);
        } else {
            console.log("wishlist.js completed.");
            scrollScrape();
        }
    }

    // Removes "undefined" and null entries in the array
    function cleanArray(arr) {
        var len = arr.length, i;

        for(i = 0; i < len; i++ ) {
            if (arr[i] && typeof arr[i] != 'undefined') {
                arr.push(arr[i]);  // copy non-empty values to the end of the array
            }
        }

        arr.splice(0 , len);  // cut the array and leave only the non-empty values

        return arr;
    }

    // Generate CSV file and download
    function downloadCSV(args) {
        var data, filename, link;
        // Remove leading '^'
        final_output[0] = final_output[0].slice(1, final_output[0].length);
        var csv = final_output.toString();

        if (csv == null) return;

        // Replaces "^" with newlines
        csv = csv.replace( /\^/g, "\n");
        csv = csv.replace(/,,/g, ',');

        console.log(csv);

        filename = 'wishlist.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

        function doneScraping(){
        window.scrollTo(0,0);

        console.log(final_output);
        console.log("Done!");

        downloadCSV();
    }

})();