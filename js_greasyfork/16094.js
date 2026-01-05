// ==UserScript==
// @name        Lowes Price Checker
// @namespace   LPC
// @id          Lowes Price Checker
// @description Adds a button to check inventory and prices at a set of Lowes stores.
// @include     http://m.lowes.com/pd/*
// @include     https://m.lowes.com/pd/*
// @resource     jqcss https://code.jquery.com/ui/1.11.4/themes/ui-lightness/jquery-ui.css
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @require      https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @screenshot   https://i949.photobucket.com/albums/ad337/pcazzola/lpc_1.png http://i949.photobucket.com/albums/ad337/pcazzola/lpc_icon.png
// @noframes
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at document-end
// @version 0.0.1.20160110151020
// @downloadURL https://update.greasyfork.org/scripts/16094/Lowes%20Price%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/16094/Lowes%20Price%20Checker.meta.js
// ==/UserScript==

// Lowes Price Checker is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// See http://creativecommons.org/licenses/by-nc-sa/4.0/ for license details.
//
//  The developer has no associated with Lowe's Company, Inc or the Lowe's home improvements stores.
//  The word "Lowes" in the title is used for identification and does not imply endorsement by Lowes Company, Inc.
//
//   2.2 Update for Lowes website change

// get our own version of jquery.   The first line should be enough, but Android tampermonkey needed something more explicit....
//this.$ = this.jQuery = jQuery.noConflict(true);

// create a jquery variable and pass it into main
var jq_2 = jQuery.noConflict(true);

// conditional debugging
const DEBUG = false;

function debug(txt) {
    if (DEBUG && console) {
        console.log(txt);
    }
}

// starting ....
debug('Lowes price checker script start');

// not used.  Was used for making separate calls for price and quantity
var resHolder = {};

// list of store locations
var storeList = {};

// list of store to search
var searchStore = {};

//options, default values
defOptions = {};
defOptions.sortSel = "any";
defOptions.hideEmpty = false;
defOptions.speed = 10;

// sorted list for the results
var sortedRes = new Array();

// "main"
(function ($) {
    // fill in the stores
    buildStoreList();
    
    // retrieve any saved values
    searchStore = JSON.parse(GM_getValue('searchStore', JSON.stringify(searchStore)));
    
    if (!searchStore) {
        //JSON.parse() should never return any value that type-casts to false, assume there is an 
        //   error in the input string
        GM_log('Error! JSON.parse failed - The stored value for "searchStore" is likely to be corrupted.');
        searchStore = {};
    }
    
    options = JSON.parse(GM_getValue('options', JSON.stringify(defOptions)));
    
    if (!options) {
        //JSON.parse() should never return any value that type-casts to false, assume there is an 
        //   error in the input string
        GM_log('Error! JSON.parse failed - The stored value for "options" is likely to be corrupted.');
        options = defOptions;
    }

    // apply the default jQuery theme
    var newCSS = GM_getResourceText('jqcss');
    GM_addStyle(newCSS);
    
    //--- creates CSS styles so the popup looks OK...
    GM_addStyle(
        '#icDialog { padding: 1em; z-index: 777; overflow-y: scroll;} \
         .icDiag.ui-widget-content.ui-dialog { border: 1px solid #000 !important; } \
         .icDiag.ui-dialog.ui-widget .ui-dialog-titlebar { \
              display: block; font-size:1.0em; text-align: center; \
              background:  #15B6E5; color: white; border-width: 0px 0px 1px 0px; border-color: none none #ccc none ; } \
         .icDiag.ui-dialog.ui-widget .ui-dialog-titlebar { padding: 0px; border-radius: 8px 8px 0px 0px} \
         .icDiag.ui-dialog .ui-dialog-title { padding: 0em; float: none;}  \
         .pc-tab th, .pc-tab td { text-align: center;}                     \
         .pc-tab td { text-align: center; border: 1px solid #ccc;}         \
         table.pc-tab {border-collapse: separate;}                         \
         #myTableFooter h3 {text-align: center;}                           \
         #myTableHeader h3 {text-align: center;}                           \
         #mySSTableHeader {padding: 20px;}                                \
         .pc-tab tr th:first-child {border-top-left-radius: 15px;}         \
         .pc-tab tr th:last-child {border-top-right-radius: 15px;}         \
         .pc-tab tr:last-child td:first-child {border-bottom-left-radius: 15px;}  \
         .pc-tab tr:last-child td:last-child  {border-bottom-right-radius: 15px;} \
         .pc-tab tr th {background:  #15B6E5; color: white;}                      \
         #icDialog .ui-tabs-nav {background: white;}                               \
         #tab_ul { border: none;}                                                 \
         #tabs-options {border: 1px solid #ddd !important;}                       \
         #tabs-storesel {border: 1px solid #ddd !important;}                       \
         #tabs-price-check {border: 1px solid #ddd !important;}'
    );
    
    // Wait for the window to load.  Then fix the "See price in cart"
    window.addEventListener('load', function () {
        // look for the div w/ "See price in cart".  If it is there, show the price
        try {
            var realPrice = unsafeWindow.Lowes.ProductDetail.product.ProductInfo.lowesPrice;
            $('p.view-in-cart').append('<a>$' + realPrice + '</a>');
        } catch (err) {
            debug(err.message);
        }
    }, false);
    
    // add a button to the web page above the product image to bring up the price checker popup
    $('#imgContainer').prepend('<div id="checkPrice"><button id="checkPriceBtn" class="btn btn-green">Check Prices</button></div>');
    // add an action with the price check button is pressed  -> open dialog
    $('#checkPriceBtn').click(function () {
        // scrape the product description from the web page to put on the popup
        try {
            var prodName = unsafeWindow.Lowes.ProductDetail.product.brand + ' ' + unsafeWindow.Lowes.ProductDetail.product.description;
            $('#myTableHeader h3').html(prodName);
        } catch (err) {
            debug(err.message);
        }
        $('#icDialog').dialog('open');
    });
    
    // create the dialog box to display the results
    $('body').append('<div id="icDialog" title="Price Check"/>');
    // create the tabbed panes for options/checker
    $('#icDialog').html(
     '<div>      \
        <ul id="tab_ul">           \
           <li><a href="#tabs-price-check">Price Check</a></li>     \
           <li><a href="#tabs-storesel">Store Selector</a></li>      \
           <li><a href="#tabs-options">Options</a></li>      \
       </ul>          \
       <div id="tabs-price-check"></div>   \
       <div id="tabs-storesel">  Store Selection tab    </div>  \
       <div id="tabs-options">  Store Selection tab    </div>  \
     </div>');
    
    // generated the tabbed panes
    $('#icDialog').tabs({heightStyle: 'content'});
    
    // generate dialog/set properties
    $('#icDialog').dialog({
        title: 'Price Checker',
        draggable: true,
        height: 'auto',
        maxHeight: 500,
        width: 'auto',
        resizable: true,
        autoOpen: false,
        buttons: {
            'Go': goAction,
            'Close': function () {
                $(this).dialog('close');
            }
        }
    });
    
    // add a class to the dialog box elements to apply CSS properties without affecting other parts of the web page
    $('#icDialog').parent().addClass('icDiag');
    // create a table to put the results in
    $('#tabs-price-check').html(
         '<div id="myTableHeader" data-role="header"><h3> </h3></div> \
          <div><table data-role="table" data-mode="columntoggle" class="ui-responsive ui-shadow pc-tab" id="myTable">    \
            <thead>       \
              <tr><th>Store</th><th data-priority="1">Quantity</th><th data-priority="2">Price</th></tr>  \
            </thead>               \
            <tbody id="myTabBody"></tbody>  \
          </table></div>                    \
        <div id="myTableFooter" data-role="footer"><h3> </h3></div>');
    
    // build the store selection tab.  List of stores with check boxes
    $('#tabs-storesel').html(
         '<div id="mySSTableHeader" data-role="header"></div>   \
            <div><table data-role="table" data-mode="columntoggle" class="ui-responsive ui-shadow pc-tab" id="mySSTable"> \
              <thead>   \
                <tr><th>Use</th><th data-priority="1">Store Number</th><th data-priority="2">Location</th></tr>   \
             </thead>   \
             <tbody id="mySSTabBody"></tbody>          \
           </table></div>  \
               <div id="mySSTableFooter" data-role="footer" style="display: inline; font-size: 0.5em;"> \
              </div>');
    
    // call function to create table
    buildStoreTable();
    
    // build the options tab
    $('#tabs-options').html(
         '<div id="myOptDiv"></div>   \
            <div><table data-role="table" data-mode="columntoggle" class="ui-responsive ui-shadow pc-tab" id="myOptTable"> \
            <thead>   \
                <tr><th>Options</th></tr>   \
             </thead>   \
            <tbody id="myOptTabBody">        \
            <tr><td><div style="text-align: left;"><input type="checkbox" id="hideInput" name="hideEmpty"  ' + (options.hideEmpty ? "checked" : "" ) + ' /> Hide empty stores</div></td></tr> \
            <tr><td><div style="text-align: left;"> Sort order:  <select id="sortSel" style="width: 200px;"> \
                   <option value="any" text="Any">Any</option>\
                   <option value="priceup" text="Price Ascending">Price Ascending</option>\
                   <option value="pricedown" text="Price Descending">Price Descending</option>\
                   <option value="qup" text="Quantity Ascending">Quantity Ascending</option>\
                   <option value="qdown" text="Quantity Descending">Quantity Descending</option></select></div></td></tr> \
           <tr><td><div style="text-align: left;"> Number of requests per second:   1<input id="speedSel" type="range" min="1" max="10" step="1" value="5" style="width: 200px;"/> 10</div></td></tr> \
           </tbody></table></div>  \
               <div id="myOptTableFooter" data-role="footer" style="display: inline; font-size: 0.5em;"> \
               <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">\
                 <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />\
               </a><br /><span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/Text" property="dct:title" rel="dct:type">Lowes Price Checker</span> is licensed under a ' +
              '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a></div>');
    
    
    // set the sort option and speed slider
    $("#sortSel").val(options.sortSel);
    $("#speedSel").val(options.speed || 8);
    
    // filter by state when the pulldown is changed
    $('#sortSel').change(function () {
        options.sortSel = $("#sortSel :selected").val();
        // save off the options
        GM_setValue('options', JSON.stringify(options));
    });
    
    // set the message speed option when the slider is moved
    $('#speedSel').change(function () {
        options.speed = $("#speedSel").val();
        // save off the options
        GM_setValue('options', JSON.stringify(options));
    });
    
     // save the option to not make rows for stores with zero items
    $('#hideInput').change(function () {
        options.hideEmpty = $("#hideInput").prop('checked');
        // save off the selected stores
        GM_setValue('options', JSON.stringify(options));
    });
    
    // create the store list table
    function buildStoreTable() {
        // start over
        $('#mySSTabBody').empty();
        // fill in the table
        var useStore = false;
        var loc = '';
        for (var storeId in storeList) {
            if (storeList.hasOwnProperty(storeId)) {
                try {
                    // get the store location
                    loc = storeList[storeId];
                    // get the value for the checkbox
                    useStore = false;
                    if (searchStore.hasOwnProperty(storeId)) useStore = searchStore[storeId];
                    // create a row in the table
                    $('#mySSTabBody').append('<tr id=\'row' + storeId + '\'><td><input type=\'checkbox\' name=\'store' + storeId + '\' value=\'use\' ' + (useStore ? 'checked' : '') + ' ></td><td>' + storeId + '</td><td>' + loc + '</td></tr>');
                } catch (err) {
                    debug(err.message);
                }
            }
        }
    }
    
    // "Go" button was pressed.  Start getting prices and quantities
    function goAction() {
        
        // create a button to export csv values
        $("#myExportCSV").remove();
        $('#myTableFooter').append("<button type='button'  id='myExportCSV'>Export Results</button>");
        $('#myExportCSV').click( function() {
            debug('export');
            var csvContent = 'Store, Quantity, Price' + "\n";
            // iterate over the table
            $("#myTabBody").children("tr").each( function() {
                $(this).children("td").each( function() {
                    csvContent += '"' + $(this).text() + '",' ;
                });
                csvContent += "\n";
            });
            debug(csvContent);

            var a         = document.createElement('a');
            if (a.download !== undefined ) {
               a.href        = 'data:attachment/csv, ' + encodeURIComponent(csvContent);
               a.target      = '_blank';
               a.download    = 'Lowes_' + unsafeWindow.Lowes.ProductDetail.product.id +'.csv';
               document.body.appendChild(a);
               a.click();
               document.body.removeChild(a);
            } else {
              var encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
              window.open(encodedUri);
            }
        });

        // display the main tab
        $('#icDialog').tabs('option', 'active', 0);
        // rebuild the list of stores to search based on the checkboxes 
        $('#mySSTabBody input:checkbox').each(function () {
            var storeNum = '';
            storeNum = /\d+/.exec($(this).attr('name'));
            searchStore[storeNum] = $(this).prop('checked');
        });
        
        // save off the selected stores
        GM_setValue('searchStore', JSON.stringify(searchStore));
        
        // reset the results list
        resHolder = {};
        sortedRes = new Array();
        
        // clear the table
        $('#myTabBody').empty();
        // scrape the product ID from the web page
        var prodId = unsafeWindow.Lowes.ProductDetail.product.id;
        debug('Product id: ' + prodId);

        var msgNum = 0;
        
        // determine how fast to send messages
        var speed = options.speed || 8;
        var millis = 1000 / speed;
        
        // loop over the stores and request the product details for each store
        for (var storeId in searchStore) {
            if (searchStore.hasOwnProperty(storeId) && searchStore[storeId]) {
                // build the URL of the product details page w/ store ID
                var qURL = 'http://m.lowes.com/content/lowes/mobile/en_us/product/detail.availability.mobile.html/' + prodId + '.' + storeId + '.html';
                //var pURL = 'http://m.lowes.com/content/lowes/mobile/en_us/product/detail.price.mobile.html/' + prodId + '.' + storeId + '.html';
                // request the prodcut details.  The result is processed by the function returned by the parseResponse() function
                var storeName = storeList[storeId];
                setTimeout( function(url, sName) { return function() { $.get(url, parseQty(sName));}}(qURL,storeName), msgNum * millis);
                msgNum++;
                
                // instead of making 2 calls, all the data can be obtained from the availability call
                //$.get(pURL, parsePrice(storeId));
            }
        }
    }

    // Parse the data out of the response from the web call.  Fill in the table with the results
    function parseQty(storeName) {
        // return this function to parse the return from the web call
        return function (respObject) {
            // use a DOM parser to build an object from the text that we can search within
            ///   (This works on a PC, but Android tampermokey can't parse text/html)
            //var parser = new DOMParser();
            //var responseDoc = parser.parseFromString(respObject.responseText, 'text/html');
            //var responseDoc = parser.parseFromString(respObject, 'text/html');

            // replacement method ....
            var responseDoc = document.implementation.createHTMLDocument('');
            responseDoc.body.innerHTML = respObject;

            // find the div with the number in stock.  undefined = 0
            var availStatus = $(responseDoc).find('div.availStatus.store').attr('data-avlqty') || 0;
            debug('number in store: ' + availStatus);

            // get the price out of the scripts values
            var price;
            var docScripts = responseDoc.scripts;
            for (s = 0; s < docScripts.length; s++) {
                console.log(docScripts[s].text);
                try {
                   var re = new RegExp('\"lowesPrice\"\:(.+?)\,');
                   var pMatch = re.exec(docScripts[s].text);
                   if (pMatch && pMatch.length >= 2) price = pMatch[1];
                } catch (e) {
                    debug(e);
                }
            }
            price = parseFloat(price).toFixed(2);
            debug('price: ' + price);

            // this logic is no longer used.  This is for making 2 calls (one for price and one for quantity)
            /*
            // look to see if the price has been saved
            if (resHolder.hasOwnProperty(storeId) && resHolder[storeId]!= null)
            {
                var price = resHolder[storeId].sPrice;
                // convert to $N.NN format
                price = parseFloat(price).toFixed(2);
                debug('price: $' + price);
                
               // Creata a new row and add the data to the table
               $('#myTabBody').append('<tr><td>' + storeName + '</td><td>' + availStatus + '</td><td>$' + price + '</td></tr>');

                delete resHolder[storeId];
            } else {
                // store off the quantity
                resHolder[storeId] = {qty: availStatus, sPrice: ""};
            }
            */

            if (availStatus !=0 || !options.hideEmpty) {
                // Creata a new row and add the data to the table
                addResult(storeName, availStatus, price);
            }
        }
    }
    
    // create a row on the results table
    function addResult(storeName, qty, price) {
        // find where to put this result
        
        var value = 0.0;
        var direction = "up";
        switch( options.sortSel ) {
            case "any":
                value = 0;
                break;
            case "priceup":
                value = price;
                direction = "up";
                break;
            case "pricedown":
                value = price;
                direction = "down";
                break;
            case "qup":
                value = qty;
                direction = "up";
                break;
            case "qdown":
                value = qty;
                direction = "down";
                break;
        }
         
        // add to array and sort
        sortedRes.push(value);
        if (direction == "up") {
             sortedRes.sort(function(a, b){return a-b});
        } else {
             sortedRes.sort(function(a, b){return b-a});
        }
            
        // find where it landed
        var ind = sortedRes.indexOf(value);
        
        // insert
        if (ind == 0) {
            $('#myTabBody').prepend('<tr><td>' + storeName + '</td><td>' + qty + '</td><td>$' + price + '</td></tr>');
        } else if (ind >= sortedRes.length) {
            // add to the end
            $('#myTabBody').append('<tr><td>' + storeName + '</td><td>' + qty + '</td><td>$' + price + '</td></tr>');
        } else { 
            // add to the correct position
            var rowBefore = $('#myTabBody').children('tr').get(ind-1);
            $(rowBefore).after('<tr><td>' + storeName + '</td><td>' + qty + '</td><td>$' + price + '</td></tr>');
        }
    }
    
    //  Currently not used
    // Parse the data out of the response from the web call.  Fill in the table with the results
    function parsePrice(storeId) {
        var storeName = storeList[storeId];
        // return this function to parse the return from the web call
        return function (respObject, status) {
            // use a DOM parser to build an object from the text that we can search within
            //var parser = new DOMParser();
            //var responseDoc = parser.parseFromString(respObject.responseText, 'text/html');
            //var responseDoc = parser.parseFromString(respObject, 'text/html');
            var responseDoc = document.implementation.createHTMLDocument('');
            responseDoc.body.innerHTML = respObject;
            
            // debug(responseDoc);
            // find the div with the number in stock.  undefined = 0
            //var availStatus = $(responseDoc).find('div.availStatus.store').attr('data-avlqty') || 0;
            //debug('number in store: ' + availStatus);
            
            // find the price 
            var price = $(responseDoc).find('div.price').attr('data-lowesprice');
           
            // look to see if the qty has been saved
            if (resHolder.hasOwnProperty(storeId) && resHolder[storeId]!= null)
            {
                var sQty = resHolder[storeId].qty;
                // convert price to $N.NN format
                price = parseFloat(price).toFixed(2);
                debug('price: $' + price);
                
                // Creata a new row and add the data to the table
                $('#myTabBody').append('<tr><td>' + storeName + '</td><td>' + sQty + '</td><td>$' + price + '</td></tr>');

                delete resHolder[storeId];
            } else {
                // store off the quantity
                resHolder[storeId] = {qty: "", sPrice: price};
            }
        }
    }
})(jq_2) // end of "main".  Call main and pass in jQuery object

function buildStoreList() {
    // list of all the stores
    storeList['1900'] = 'ALISO VIEJO, CA';
    storeList['1030'] = 'ANAHEIM, CA';
    storeList['1043'] = 'ANTIOCH, CA';
    storeList['2508'] = 'S. ANTIOCH, CA';
    storeList['2528'] = 'APPLE VALLEY, CA';
    storeList['2424'] = 'N.E. BAKERSFIELD, CA';
    storeList['1708'] = 'S. BAKERSFIELD, CA';
    storeList['0790'] = 'BAKERSFIELD, CA';
    storeList['1144'] = 'BURBANK, CA';
    storeList['1201'] = 'CHICO, CA';
    storeList['0316'] = 'CHINO HILLS, CA';
    storeList['2783'] = 'S. CHINO HILLS, CA';
    storeList['1742'] = 'EASTLAKE, CA';
    storeList['1540'] = 'CITRUS HEIGHTS, CA';
    storeList['1872'] = 'PUENTE HILLS, CA';
    storeList['1541'] = 'CLOVIS, CA';
    storeList['2604'] = 'CONCORD, CA';
    storeList['1743'] = 'CORONA, CA';
    storeList['1901'] = 'COTATI, CA';
    storeList['3151'] = 'COVINA, CA';
    storeList['2273'] = 'DUBLIN, CA';
    storeList['2550'] = 'EL CENTRO, CA';
    storeList['1148'] = 'ELK GROVE, CA';
    storeList['2481'] = 'ESCONDIDO, CA';
    storeList['3164'] = 'FAIRFIELD, CA';
    storeList['1087'] = 'FOLSOM, CA';
    storeList['1700'] = 'N. FONTANA, CA';
    storeList['1895'] = 'FREMONT, CA';
    storeList['0795'] = 'FRESNO, CA';
    storeList['1552'] = 'GILROY, CA';
    storeList['2215'] = 'HANFORD, CA';
    storeList['1555'] = 'HAWTHORNE, CA';
    storeList['1556'] = 'HEMET, CA';
    storeList['2856'] = 'HIGHLAND, CA';
    storeList['1753'] = 'HUNTINGTON BEACH, CA';
    storeList['0769'] = 'IRVINE, CA';
    storeList['2335'] = 'MARTELL, CA';
    storeList['1562'] = 'LA HABRA, CA';
    storeList['0208'] = 'LA QUINTA, CA';
    storeList['1987'] = 'LAKE ELSINORE, CA';
    storeList['2502'] = 'LANCASTER, CA';
    storeList['2499'] = 'N. LINCOLN, CA';
    storeList['1150'] = 'LIVERMORE, CA';
    storeList['1706'] = 'LODI, CA';
    storeList['0773'] = 'N.E. LONG BEACH, CA';
    storeList['0785'] = 'CENTRAL LONG BEACH, CA';
    storeList['2714'] = 'MID-CITY LOS ANGELES, CA';
    storeList['2712'] = 'MADERA, CA';
    storeList['2294'] = 'MENIFEE, CA';
    storeList['1672'] = 'MERCED, CA';
    storeList['2330'] = 'MIRA LOMA, CA';
    storeList['1086'] = 'MODESTO, CA';
    storeList['1574'] = 'MORENO VALLEY, CA';
    storeList['1576'] = 'MURRIETA, CA';
    storeList['1873'] = 'NORTHRIDGE, CA';
    storeList['0056'] = 'NORWALK, CA';
    storeList['1588'] = 'OCEANSIDE, CA';
    storeList['2270'] = 'ONTARIO, CA';
    storeList['1941'] = 'OXNARD, CA';
    storeList['1852'] = 'PACOIMA, CA';
    storeList['2583'] = 'PALM DESERT, CA';
    storeList['1026'] = 'PALM SPRINGS, CA';
    storeList['0791'] = 'PALMDALE, CA';
    storeList['2547'] = 'E. PALMDALE, CA';
    storeList['2730'] = 'PASO ROBLES, CA';
    storeList['1591'] = 'PICO RIVERA, CA';
    storeList['2278'] = 'PORTERVILLE, CA';
    storeList['2341'] = 'RANCHO CORDOVA, CA';
    storeList['0774'] = 'RANCHO CUCAMONGA, CA';
    storeList['0758'] = 'RANCHO SANTA MARGARITA, CA';
    storeList['1926'] = 'REDDING, CA';
    storeList['0759'] = 'REDLANDS, CA';
    storeList['1048'] = 'RIVERSIDE, CA';
    storeList['1207'] = 'N. ROSEVILLE, CA';
    storeList['1019'] = 'SAN BRUNO, CA';
    storeList['1050'] = 'SAN CLEMENTE, CA';
    storeList['1013'] = 'MISSION VALLEY, CA';
    storeList['1170'] = 'SAN DIMAS, CA';
    storeList['3095'] = 'SAN FRANCISCO, CA';
    storeList['2842'] = 'C. SAN JOSE, CA';
    storeList['1756'] = 'S. SAN JOSE, CA';
    storeList['2790'] = 'E. SAN JOSE, CA';
    storeList['1697'] = 'SAN MARCOS, CA';
    storeList['1972'] = 'E. SANTA CLARITA, CA';
    storeList['1510'] = 'SANTA CLARITA, CA';
    storeList['1661'] = 'SANTEE, CA';
    storeList['1971'] = 'SIMI VALLEY, CA';
    storeList['2279'] = 'SONORA, CA';
    storeList['2452'] = 'SOUTH SAN FRANCISCO, CA';
    storeList['1545'] = 'E. STOCKTON, CA';
    storeList['2227'] = 'N. STOCKTON, CA';
    storeList['2211'] = 'SUNNYVALE, CA';
    storeList['0775'] = 'TEMECULA, CA';
    storeList['0250'] = 'TORRANCE, CA';
    storeList['2268'] = 'W. TORRANCE, CA';
    storeList['2473'] = 'TULARE, CA';
    storeList['2334'] = 'TURLOCK, CA';
    storeList['2605'] = 'TUSTIN, CA';
    storeList['1132'] = 'UNION CITY, CA';
    storeList['1041'] = 'UPLAND, CA';
    storeList['1143'] = 'VACAVILLE, CA';
    storeList['1871'] = 'VALLEJO, CA';
    storeList['1734'] = 'C. VENTURA, CA';
    storeList['1001'] = 'VICTORVILLE, CA';
    storeList['1611'] = 'VISALIA, CA';
    storeList['2660'] = 'N. VISALIA, CA';
    storeList['1616'] = 'VISTA, CA';
    storeList['1162'] = 'WEST HILLS, CA';
    storeList['2755'] = 'WEST SACRAMENTO, CA';
    storeList['1933'] = 'YUBA CITY, CA';
}


// end of script ....
debug('Lowes price checker script loaded');