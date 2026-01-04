// ==UserScript==
// @name        BlueCat Address Manager Table Quick-Filter
// @namespace   *
// @description Add a quick filter to visible Table content in BlueCat Address Manager
// @include     */app*
// @license		MIT
// @version     1
// @grant       none
// @copyright   2019, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @require     http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/378123/BlueCat%20Address%20Manager%20Table%20Quick-Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/378123/BlueCat%20Address%20Manager%20Table%20Quick-Filter.meta.js
// ==/UserScript==

if (document.readyState === "interactive" ) {
    var topBar = document.getElementsByClassName('value-table-topToolBar')[0];
    var tBody = topBar.getElementsByTagName('tbody')[2];
    var tR = tBody.getElementsByTagName('tr')[0];
    var w = tR.insertCell(-1);
    w.innerHTML='<div class="separator"></div>';
    var x = tR.insertCell(-1);
    x.innerHTML='<td><form action="#" method="get"><div class="input-group"><span class="title-center"><b> Quick Filter: </b></span><input autocomplete="off" class="form-control" id="system-search" name="q" placeholder=" Type to filter..." required=""></div></form></td>';
    var y = tR.insertCell(-1);
    y.innerHTML='<td><div id="qcontent"></div></td>';
}

$(document).ready(function() {
    var activeSystemClass = $('.list-group-item.active');
    var qcontent = $('#qcontent');

    //something is entered in search form
    $('#system-search').keyup( function() {
       var that = this;
        // affect all table rows on in systems table
        var tableBody = $('#outerTable tbody:first');
        var tableRowsClass = $('#outerTable tbody:first > tr').not(':first').not('th');
        $('.search-sf').remove();
        tableRowsClass.each( function(i, val) {
            //Lower text for case insensitive
            var rowText = $(val).text().toLowerCase();
            var inputText = $(that).val().toLowerCase();
            if(inputText != '')
            {
                $('.search-query-sf').remove();
                 qcontent.prepend('<span style="padding-left: 5px;" class="search-query-sf"><strong>Searching for: "'
                     + $(that).val()
                     + '"</strong></span>');
            }
            else
            {
                $('.search-query-sf').remove();
            }

            if( rowText.indexOf( inputText ) == -1 )
            {
                //hide rows
                tableRowsClass.eq(i).hide();
            }
            else
            {
                $('.search-sf').remove();
                tableRowsClass.eq(i).show();
            }
        });
        //all tr elements are hidden
        if(tableRowsClass.children(':visible').length == 0)
        {
            tableBody.append('<tr class="search-sf"><td class="text-muted" colspan="6">No entries found.</td></tr>');
        }
    });
});