// ==UserScript==
// @name         Export Posted DVDs
// @namespace    Swap-a-DVD
// @version      0.1
// @description  Exports a CSV of the current page of your DVD Tower listing in Swap-a-DVD
// @author       You
// @match        https://www.swapadvd.com/members/posted_dvds.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swapadvd.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @license      FSFAP
// @downloadURL https://update.greasyfork.org/scripts/459870/Export%20Posted%20DVDs.user.js
// @updateURL https://update.greasyfork.org/scripts/459870/Export%20Posted%20DVDs.meta.js
// ==/UserScript==
/* eslint-disable */

collection_name = 'swapadvd_inventory_page_' + $('select:first option:selected').text()
filename_array = [];
var csvContent = "data:text/csv;charset=utf-8,";

$target = $('#frm1').children('table').children('tbody').children().find('.display_dvd_table:first tr');

count = $target.length;
console.log(count);
scrape_dvds(count);

function scrape_dvds(count){
    $(this).find('.dvd_title');
    $target.each(function( index ) {
        console.log();
        title = $(this).find('.dvd_title').text().trim().replace((/  |\,|\t|\r\n|\n|\r/gm),"").replace('&','and');
        url = $(this).find('.dvd_title a').attr("href");
        posted_raw = $(this).find('.display_dvd_text').text().split('Posted: ')[1].split(' ET')[0];
        cover_art = $(this).find('.dvd_image').attr("src");
        posted = moment(posted_raw,'L LT');
        posted_formatted = posted.format('YYYY-MM-DD hh:mm a');

        raw_listing = title + "," + url + "," + posted_formatted + "," + cover_art;
        if (title !== ''){
            filename_array.push(raw_listing);
        }
        count--;
        if (count == 0){
            do_export(filename_array);
        }
    });
}

function do_export(fancy){
    var csvRows = [];
    var csvString = fancy.join("\n");
    csvString = csvString + "\n";
    var a         = document.createElement('a');
    a.href        = 'data:attachment/csv;charset=utf-8,%EF%BB%BF' +  encodeURIComponent(csvString);
    a.target      = '_blank';
    a.download    = collection_name+'.csv';

    document.body.appendChild(a);
    a.click();
}