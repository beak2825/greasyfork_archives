// ==UserScript==
// @name        Rocket's GJ Price Checker
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
// @version     2.1.5
// @run-at document-end
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=FDW4NZ6PRMDMJ&lc=US&item_name=Lowes%20Price%20Checker&item_number=LPC&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted
// @contributionAmount $2.00
// @downloadURL https://update.greasyfork.org/scripts/11698/Rocket%27s%20GJ%20Price%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/11698/Rocket%27s%20GJ%20Price%20Checker.meta.js
// ==/UserScript==

// Copyright Phllip Cazzola 2015
// Lowes Price Checker is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// See http://creativecommons.org/licenses/by-nc-sa/4.0/ for license details.
//
//  The developer has no associated with Lowe's Company, Inc or the Lowe's home improvements stores.
//  The word "Lowes" in the title is used for identification and does not imply endorsement by Lowes Company, Inc.
//

// get our own version of jquery.   The first line should be enough, but Android tampermonkey needed something more explicit....
//this.$ = this.jQuery = jQuery.noConflict(true);

// creat a jquery variable and pass it into main
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


var resHolder = {};

// list of store locations
var storeList = {};

// list of store to search
var searchStore = {};
searchStore['2295'] = 1;
searchStore['2202'] = 1;

//options, default values
defOptions = {};
defOptions.sortSel = "any";
defOptions.hideEmpty = false;

// sorted list for the results
var sortedRes = new Array();

var states = [ 
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

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
        searchStore = {
        };
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
         .ui-tabs .ui-tabs-nav {background: white;}                               \
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
    $('#productImg').before('<div id="checkPrice"><button id="checkPriceBtn" class="btn btn-green">Check Prices</button></div>');
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
    
     // create some controls for the store list table
    $('#mySSTableHeader').html(
         "<button type='button' id='clrBtn' style='margin-right: 20px;'>Clear All</button>   \
          <button type='button' id='allBtn'>Select All</button> \
          <div style='float:right;'> Filter by state: <select id='stateSel' style='width: 100px;'></select></div>");

        // fill in the state drop down box
    var sel = $('#stateSel');
    sel.append($('<option>', {value: '',text: '--'}));
    
    for (var sn = 0; sn < 50; sn++) {
        sel.append($('<option>', {value: states[sn],text: states[sn]}));
    }
    
    // action for "clear all", uncheck all checkboxes
    $('#clrBtn').click(function () { $('#mySSTabBody input:checkbox').prop('checked', false);});
    // action for "select all", check all checkboxes
    $('#allBtn').click(function () { $('#mySSTabBody input:checkbox').prop('checked', true);});
    
    // filter by state
    $('#stateSel').change(function () {
        var str = '';
        var storeName,
        rowName,
        regStr;
        // get the state string
        $('#stateSel option:selected').each(function () {str += $(this).val();});
        // interate over the stores to hide or display each row
        for (var storeId in storeList) {
            if (storeList.hasOwnProperty(storeId)) {
                storeName = storeList[storeId];
                rowName = 'row' + storeId;
                regStr = new RegExp(', ' + str);
                // find all row with this store id
                if (regStr.exec(storeName)) {
                    $('#' + rowName).css('display', 'table-row');
                } else {
                    $('#' + rowName).css('display', 'none');
                }
            }
        }
    });
    
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
           </tbody></table></div>  \
               <div id="myOptTableFooter" data-role="footer" style="display: inline; font-size: 0.5em;"> \
               <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">\
                 <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />\
               </a><br /><span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/Text" property="dct:title" rel="dct:type">Lowes Price Checker</span> is licensed under a ' +
              '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a></div>');
    
    
    // select the sort options
    $("#sortSel").val(options.sortSel);
    
    // filter by state
    $('#sortSel').change(function () {
        options.sortSel = $("#sortSel :selected").val();
        // save off the selected stores
        GM_setValue('options', JSON.stringify(options));
    });
    
     // filter by state
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

        // switch back to the main tab
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
        // loop over the stores and request the product details for each store
        for (var storeId in searchStore) {
            if (searchStore.hasOwnProperty(storeId) && searchStore[storeId]) {
                // build the URL of the product details page w/ store ID
                var qURL = 'http://m.lowes.com/content/lowes/mobile/en_us/product/detail.availability.mobile.html/' + prodId + '.' + storeId + '.html';
                //var pURL = 'http://m.lowes.com/content/lowes/mobile/en_us/product/detail.price.mobile.html/' + prodId + '.' + storeId + '.html';
                // request the prodcut details.  The result is processed by the parseResponse() function
                setTimeout( function(url, sId) { return function() { $.get(url, parseQty(sId));}} (qURL,storeId), msgNum *100);
                msgNum++;
                
                // instead of making 2 calls, all the data can be obtained from the availability call
                //$.get(pURL, parsePrice(storeId));
            }
        }
        
    }
    
    // Parse the data out of the response from the web call.  Fill in the table with the results
    function parseQty(storeId) {
        var storeName = storeList[storeId];
        // return this function to parse the return from the web call
        return function (respObject, status) {
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
            for (s = 1; s < docScripts.length; s++) {
                var pMatch = /\"lowesPrice\"\:(.+?)\,/.exec(docScripts[s].text);
                if (pMatch.length >= 2) price = pMatch[1];
            }
            price = parseFloat(price).toFixed(2);
            debug('price: ' + price);
           
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
            
            console.log (responseDoc);
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
})(jq_2) // end of "main"

function buildStoreList() {
    // list of all the stores
    storeList['2295'] = 'BUCKEYE, AZ';
    storeList['2202'] = 'BULLHEAD CITY, AZ';
    storeList['2683'] = 'CAREFREE, AZ';
    storeList['2272'] = 'CASA GRANDE, AZ';
    storeList['1032'] = 'E. CHANDLER, AZ';
    storeList['0674'] = 'W. CHANDLER, AZ';
    storeList['2582'] = 'OCOTILLO, AZ';
    storeList['1090'] = 'GILBERT, AZ';
    storeList['2808'] = 'E. GILBERT, AZ';
    storeList['1728'] = 'GLENDALE, AZ';
    storeList['1553'] = 'GOODYEAR, AZ';
    storeList['2562'] = 'LAKE HAVASU, AZ';
    storeList['0714'] = 'E. MESA, AZ';
    storeList['2527'] = 'APACHE JUNCTION, AZ';
    storeList['1117'] = 'PEORIA, AZ';
    storeList['2820'] = 'N. PEORIA, AZ';
    storeList['1042'] = 'W. PHOENIX, AZ';
    storeList['2421'] = 'S. PHOENIX, AZ';
    storeList['1204'] = 'N. PHOENIX, AZ';
    storeList['2557'] = 'HAPPY VALLEY, AZ';
    storeList['1157'] = 'PRESCOTT, AZ';
    storeList['0792'] = 'SCOTTSDALE, AZ';
    storeList['1850'] = 'S. SCOTTSDALE, AZ';
    storeList['2833'] = 'SHOWLOW, AZ';
    storeList['2663'] = 'SIERRA VISTA, AZ';
    storeList['1607'] = 'SURPRISE, AZ';
    storeList['3000'] = 'TEMPE, AZ';
    storeList['1638'] = 'C. TUCSON, AZ';
    storeList['1754'] = 'E. TUCSON, AZ';
    storeList['1707'] = 'MARANA, AZ';
    storeList['1791'] = 'S.W. TUCSON, AZ';
    storeList['1082'] = 'YUMA, AZ';
    storeList['2230'] = 'N. BENTONVILLE, AR';
    storeList['2534'] = 'BLYTHEVILLE, AR';
    storeList['2471'] = 'BRYANT, AR';
    storeList['0236'] = 'CONWAY, AR';
    storeList['0432'] = 'FAYETTEVILLE, AR';
    storeList['1806'] = 'S. FAYETTEVILLE, AR';
    storeList['0462'] = 'FORT SMITH, AR';
    storeList['0597'] = 'HOT SPRINGS, AR';
    storeList['1766'] = 'JACKSONVILLE, AR';
    storeList['0414'] = 'JONESBORO, AR';
    storeList['2236'] = 'MOUNTAIN HOME, AR';
    storeList['1627'] = 'N. LITTLE ROCK, AR';
    storeList['2847'] = 'PARAGOULD, AR';
    storeList['1628'] = 'PINE BLUFF, AR';
    storeList['0694'] = 'ROGERS, AR';
    storeList['0235'] = 'RUSSELLVILLE, AR';
    storeList['1775'] = 'SEARCY, AR';
    storeList['2491'] = 'SILOAM SPRINGS, AR';
    storeList['1826'] = 'SPRINGDALE, AR';
    storeList['2598'] = 'VAN BUREN, AR';
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
    storeList['0340'] = 'ARVADA, CO';
    storeList['0102'] = 'AURORA, CO';
    storeList['1730'] = 'S.E. AURORA, CO';
    storeList['2780'] = 'E. AURORA, CO';
    storeList['2479'] = 'BRIGHTON, CO';
    storeList['2274'] = 'CASTLE ROCK, CO';
    storeList['2806'] = 'C. COLORADO SPRINGS, CO';
    storeList['2423'] = 'W. COLORADO SPRINGS, CO';
    storeList['2578'] = 'N. COLORADO SPRINGS, CO';
    storeList['1099'] = 'E. COLORADO SPRINGS, CO';
    storeList['2697'] = 'FORT COLLINS, CO';
    storeList['2607'] = 'FOUNTAIN, CO';
    storeList['1905'] = 'GLENWOOD SPRINGS, CO';
    storeList['1554'] = 'GRAND JUNCTION, CO';
    storeList['1812'] = 'GREELEY, CO';
    storeList['0311'] = 'GREENWOOD VILLAGE, CO';
    storeList['1903'] = 'N. LAKEWOOD, CO';
    storeList['2419'] = 'LITTLETON, CO';
    storeList['1630'] = 'LAKEWOOD, CO';
    storeList['1874'] = 'LONGMONT, CO';
    storeList['0220'] = 'LOUISVILLE, CO';
    storeList['2568'] = 'LOVELAND, CO';
    storeList['0246'] = 'NORTHGLENN, CO';
    storeList['1755'] = 'PARKER, CO';
    storeList['2742'] = 'S. PUEBLO, CO';
    storeList['0318'] = 'PUEBLO, CO';
    storeList['2432'] = 'N. WESTMINSTER, CO';
    storeList['1989'] = 'WESTMINSTER, CO';
    storeList['1665'] = 'BLOOMFIELD, CT';
    storeList['2383'] = 'CROMWELL, CT';
    storeList['2544'] = 'DANBURY, CT';
    storeList['2396'] = 'KILLINGLY, CT';
    storeList['2327'] = 'DERBY, CT';
    storeList['2938'] = 'LISBON, CT';
    storeList['0763'] = 'MANCHESTER, CT';
    storeList['2658'] = 'MILFORD, CT';
    storeList['0593'] = 'NEW HAVEN, CT';
    storeList['0623'] = 'NEWINGTON, CT';
    storeList['0621'] = 'ORANGE, CT';
    storeList['0650'] = 'PLAINVILLE, CT';
    storeList['2910'] = 'SOUTHINGTON, CT';
    storeList['2395'] = 'TORRINGTON, CT';
    storeList['2288'] = 'WALLINGFORD, CT';
    storeList['2263'] = 'WATERFORD, CT';
    storeList['0217'] = 'CHRISTIANA, DE';
    storeList['2537'] = 'CAMDEN, DE';
    storeList['0587'] = 'DOVER, DE';
    storeList['0658'] = 'SUSSEX COUNTY, DE';
    storeList['1571'] = 'MIDDLETOWN, DE';
    storeList['2795'] = 'MILLSBORO, DE';
    storeList['2429'] = 'WILMINGTON, DE';
    storeList['2258'] = 'NEWARK, DE';
    storeList['2248'] = 'SEAFORD, DE';
    storeList['0622'] = 'N. WILMINGTON, DE';
    storeList['2984'] = 'ALACHUA, FL';
    storeList['0604'] = 'ALTAMONTE SPRINGS, FL';
    storeList['2673'] = 'APOPKA, FL';
    storeList['2457'] = 'AUBURNDALE, FL';
    storeList['2531'] = 'BARTOW, FL';
    storeList['1069'] = 'W. BOCA RATON, FL';
    storeList['1111'] = 'BOYNTON BEACH, FL';
    storeList['0772'] = 'BRADENTON, FL';
    storeList['1843'] = 'CENTRAL BRADENTON, FL';
    storeList['0573'] = 'BRANDON, FL';
    storeList['2282'] = 'E. BRANDON, FL';
    storeList['1827'] = 'BROOKSVILLE, FL';
    storeList['0592'] = 'CAPE CORAL, FL';
    storeList['2361'] = 'W. CAPE CORAL, FL';
    storeList['1714'] = 'S. CLEARWATER, FL';
    storeList['0771'] = 'CLEARWATER, FL';
    storeList['2437'] = 'CLERMONT, FL';
    storeList['2438'] = 'S.W. ORLANDO, FL';
    storeList['0704'] = 'CORAL SPRINGS, FL';
    storeList['1782'] = 'CRESTVIEW, FL';
    storeList['2886'] = 'DEFUNIAK SPRINGS, FL';
    storeList['1945'] = 'DELAND, FL';
    storeList['2364'] = 'DELTONA, FL';
    storeList['3166'] = 'DESTIN, FL';
    storeList['2362'] = 'ESTERO, FL';
    storeList['2652'] = 'FERN PARK, FL';
    storeList['1647'] = 'FERNANDINA BEACH, FL';
    storeList['0582'] = 'FT. MYERS, FL';
    storeList['0479'] = 'FT. WALTON BEACH, FL';
    storeList['2221'] = 'N.E. FT. MYERS, FL';
    storeList['0418'] = 'S.W. GAINESVILLE, FL';
    storeList['2365'] = 'N.E. GAINESVILLE, FL';
    storeList['1073'] = 'GULF BREEZE, FL';
    storeList['2702'] = 'HAINES CITY, FL';
    storeList['2254'] = 'HIALEAH, FL';
    storeList['1841'] = 'N.W. MIAMI-DADE, FL';
    storeList['2707'] = 'HOMESTEAD, FL';
    storeList['2351'] = 'INDIAN HARBOUR BEACH, FL';
    storeList['1853'] = 'INVERNESS, FL';
    storeList['1691'] = 'W. JACKSONVILLE, FL';
    storeList['2472'] = 'N. JACKSONVILLE, FL';
    storeList['0502'] = 'S. JACKSONVILLE, FL';
    storeList['0503'] = 'E. JACKSONVILLE, FL';
    storeList['1699'] = 'N.E. JACKSONVILLE, FL';
    storeList['1842'] = 'S. CENTRAL JACKSONVILLE, FL';
    storeList['0703'] = 'JENSEN BEACH, FL';
    storeList['1652'] = 'N. KISSIMMEE, FL';
    storeList['2363'] = 'POINCIANA, FL';
    storeList['1685'] = 'LADY LAKE, FL';
    storeList['0179'] = 'LAKE CITY, FL';
    storeList['1720'] = 'LAKE PARK, FL';
    storeList['2240'] = 'LAKE WALES, FL';
    storeList['0783'] = 'LAKELAND, FL';
    storeList['2253'] = 'N. LAKELAND, FL';
    storeList['1701'] = 'LARGO, FL';
    storeList['0569'] = 'LAKE COUNTY, FL';
    storeList['2462'] = 'LIVE OAK, FL';
    storeList['1924'] = 'MARIANNA, FL';
    storeList['0696'] = 'MELBOURNE, FL';
    storeList['2904'] = 'KENDALL, FL';
    storeList['2970'] = 'MIDDLEBURG, FL';
    storeList['2577'] = 'MT. DORA, FL';
    storeList['0613'] = 'NAPLES, FL';
    storeList['2261'] = 'S. NAPLES, FL';
    storeList['0724'] = 'PORT RICHEY, FL';
    storeList['2727'] = 'NORTH PORT, FL';
    storeList['0754'] = 'OAKLAND PARK, FL';
    storeList['1855'] = 'E. OCALA, FL';
    storeList['0440'] = 'OCALA, FL';
    storeList['2753'] = 'S.W. MARION COUNTY, FL';
    storeList['0467'] = 'ORANGE CITY, FL';
    storeList['1897'] = 'ORANGE PARK, FL';
    storeList['0642'] = 'W. ORLANDO, FL';
    storeList['0670'] = 'S. ORLANDO, FL';
    storeList['1598'] = 'S.E. ORLANDO, FL';
    storeList['1161'] = 'WATERFORD LAKE, FL';
    storeList['0742'] = 'ORMOND BEACH, FL';
    storeList['1140'] = 'OVIEDO, FL';
    storeList['2715'] = 'MILTON, FL';
    storeList['1820'] = 'PALATKA, FL';
    storeList['2644'] = 'PALM BAY, FL';
    storeList['2241'] = 'PALM COAST, FL';
    storeList['0448'] = 'PANAMA CITY, FL';
    storeList['2367'] = 'PANAMA CITY BEACH, FL';
    storeList['1681'] = 'PEMBROKE PINES, FL';
    storeList['0438'] = 'PENSACOLA, FL';
    storeList['1142'] = 'S.W. PENSACOLA, FL';
    storeList['2788'] = 'ENSLEY, FL';
    storeList['1190'] = 'PINELLAS PARK, FL';
    storeList['1592'] = 'PLANT CITY, FL';
    storeList['1792'] = 'POMPANO BEACH, FL';
    storeList['1732'] = 'PORT CHARLOTTE, FL';
    storeList['0741'] = 'PORT ORANGE, FL';
    storeList['2349'] = 'ST. LUCIE WEST, FL';
    storeList['1911'] = 'RIVERVIEW, FL';
    storeList['1506'] = 'ROCKLEDGE, FL';
    storeList['0654'] = 'ROYAL PALM BEACH, FL';
    storeList['0740'] = 'ST. PETERSBURG, FL';
    storeList['1657'] = 'SANFORD, FL';
    storeList['1935'] = 'N.E. SARASOTA, FL';
    storeList['2933'] = 'SW SARASOTA, FL';
    storeList['2224'] = 'SEBRING, FL';
    storeList['0725'] = 'W. DAVIE, FL';
    storeList['1605'] = 'SPRING HILL, FL';
    storeList['1109'] = 'STUART, FL';
    storeList['1113'] = 'SUNRISE, FL';
    storeList['0716'] = 'N.W. TALLAHASSEE, FL';
    storeList['0417'] = 'N.E. TALLAHASSEE, FL';
    storeList['1629'] = 'S. TAMPA, FL';
    storeList['2360'] = 'N. TAMPA, FL';
    storeList['0564'] = 'CENTRAL TAMPA, FL';
    storeList['2639'] = 'OLDSMAR, FL';
    storeList['1003'] = 'TAMPA PALMS, FL';
    storeList['0504'] = 'TITUSVILLE, FL';
    storeList['1683'] = 'VENICE, FL';
    storeList['0240'] = 'VERO BEACH, FL';
    storeList['1962'] = 'WEST PALM BEACH, FL';
    storeList['2651'] = 'WINTER GARDEN, FL';
    storeList['1079'] = 'WINTER HAVEN, FL';
    storeList['1854'] = 'ZEPHYRHILLS, FL';
    storeList['0491'] = 'ALBANY, GA';
    storeList['0615'] = 'ALPHARETTA, GA';
    storeList['1668'] = 'N. ALPHARETTA, GA';
    storeList['2674'] = 'AMERICUS, GA';
    storeList['2204'] = 'E. ATHENS, GA';
    storeList['0506'] = 'ATHENS, GA';
    storeList['1875'] = 'ATLANTA-EDGEWOOD, GA';
    storeList['1116'] = 'S.W. AUGUSTA, GA';
    storeList['0482'] = 'AUGUSTA, GA';
    storeList['0531'] = 'AUSTELL, GA';
    storeList['2643'] = 'BRUNSWICK, GA';
    storeList['0662'] = 'BUFORD, GA';
    storeList['2838'] = 'CANTON, GA';
    storeList['2968'] = 'CARROLLTON, GA';
    storeList['0190'] = 'CARTERSVILLE, GA';
    storeList['1119'] = 'CHAMBLEE, GA';
    storeList['0636'] = 'N. COLUMBUS, GA';
    storeList['1076'] = 'CONYERS, GA';
    storeList['1925'] = 'CORNELIA, GA';
    storeList['0678'] = 'CUMMING, GA';
    storeList['1646'] = 'DALTON, GA';
    storeList['1783'] = 'DOUGLAS, GA';
    storeList['0730'] = 'DOUGLASVILLE, GA';
    storeList['1793'] = 'E. ELLIJAY, GA';
    storeList['1715'] = 'CAMP CREEK, GA';
    storeList['2366'] = 'EVANS, GA';
    storeList['0686'] = 'FAYETTEVILLE, GA';
    storeList['0485'] = 'FT. OGLETHORPE, GA';
    storeList['0434'] = 'GAINESVILLE, GA';
    storeList['1733'] = 'GRIFFIN, GA';
    storeList['1856'] = 'HINESVILLE, GA';
    storeList['2478'] = 'S. WARNER ROBINS, GA';
    storeList['1651'] = 'ACWORTH, GA';
    storeList['2489'] = 'CAMDEN COUNTY, GA';
    storeList['0640'] = 'STONE MOUNTAIN, GA';
    storeList['2232'] = 'S. DEKALB-LITHONIA, GA';
    storeList['2969'] = 'LOGANVILLE, GA';
    storeList['0546'] = 'MACON, GA';
    storeList['1016'] = 'N.W. MACON, GA';
    storeList['1958'] = 'MADISON, GA';
    storeList['0545'] = 'W. MARIETTA, GA';
    storeList['1153'] = 'MCDONOUGH, GA';
    storeList['1644'] = 'MILLEDGEVILLE, GA';
    storeList['2621'] = 'MOULTRIE, GA';
    storeList['0033'] = 'NEWNAN, GA';
    storeList['1507'] = 'NORCROSS, GA';
    storeList['2772'] = 'POOLER, GA';
    storeList['2813'] = 'RINCON, GA';
    storeList['1513'] = 'ROME, GA';
    storeList['1807'] = 'SANDY SPRINGS, GA';
    storeList['0403'] = 'S. SAVANNAH, GA';
    storeList['1603'] = 'SNELLVILLE, GA';
    storeList['0177'] = 'STATESBORO, GA';
    storeList['0512'] = 'STOCKBRIDGE, GA';
    storeList['0710'] = 'JOHN\'S CREEK, GA';
    storeList['2908'] = 'SUWANEE, GA';
    storeList['1564'] = 'THOMASVILLE, GA';
    storeList['1508'] = 'TIFTON, GA';
    storeList['1794'] = 'VALDOSTA, GA';
    storeList['1787'] = 'VIDALIA, GA';
    storeList['0483'] = 'WARNER ROBINS, GA';
    storeList['1617'] = 'WAYCROSS, GA';
    storeList['0543'] = 'WOODSTOCK, GA';
    storeList['2336'] = 'IWILEI, HONOLULU, HI';
    storeList['0021'] = 'KAHULUI, HI';
    storeList['1561'] = 'KONA, HI';
    storeList['0119'] = 'WAIPAHU, HI';
    storeList['0688'] = 'BOISE, ID';
    storeList['0018'] = 'COEUR D\'ALENE, ID';
    storeList['1906'] = 'IDAHO FALLS, ID';
    storeList['2792'] = 'S. MERIDIAN, ID';
    storeList['2573'] = 'MERIDIAN, ID';
    storeList['1785'] = 'NAMPA, ID';
    storeList['2587'] = 'POCATELLO, ID';
    storeList['2597'] = 'TWIN FALLS, ID';
    storeList['0591'] = 'ALTON, IL';
    storeList['2529'] = 'ARLINGTON HEIGHTS, IL';
    storeList['2302'] = 'BELLEVILLE, IL';
    storeList['1203'] = 'BLOOMINGTON, IL';
    storeList['2535'] = 'BOLINGBROOK, IL';
    storeList['0118'] = 'KANKAKEE, IL';
    storeList['0493'] = 'CARBONDALE, IL';
    storeList['1821'] = 'CAROL STREAM, IL';
    storeList['0080'] = 'CHAMPAIGN, IL';
    storeList['2301'] = 'CHICAGO, 83RD AND STEWART, IL';
    storeList['1845'] = 'CHICAGO-BRICKYARD, IL';
    storeList['2304'] = 'CHICAGO, 79TH & CICERO, IL';
    storeList['0052'] = 'DANVILLE, IL';
    storeList['0059'] = 'DE KALB, IL';
    storeList['1193'] = 'EAST PEORIA, IL';
    storeList['0643'] = 'FAIRVIEW HEIGHTS, IL';
    storeList['0245'] = 'DECATUR, IL';
    storeList['0092'] = 'GALESBURG, IL';
    storeList['1795'] = 'GLEN CARBON, IL';
    storeList['3028'] = 'GRANITE CITY, IL';
    storeList['1829'] = 'GURNEE, IL';
    storeList['1739'] = 'LAKE IN THE HILLS, IL';
    storeList['1748'] = 'LINCOLNWOOD, IL';
    storeList['2310'] = 'MACHESNEY PARK, IL';
    storeList['0104'] = 'MOLINE, IL';
    storeList['0066'] = 'MT. VERNON, IL';
    storeList['1711'] = 'NAPERVILLE, IL';
    storeList['2580'] = 'NEW LENOX, IL';
    storeList['2728'] = 'NORTHBROOK, IL';
    storeList['1828'] = 'ORLAND PARK, IL';
    storeList['0167'] = 'PEORIA, IL';
    storeList['1680'] = 'QUINCY, IL';
    storeList['0191'] = 'ROCKFORD, IL';
    storeList['1738'] = 'ST. CHARLES, IL';
    storeList['1679'] = 'N. SPRINGFIELD, IL';
    storeList['0258'] = 'SPRINGFIELD, IL';
    storeList['2751'] = 'VERNON HILLS, IL';
    storeList['1031'] = 'ANDERSON, IN';
    storeList['1135'] = 'AVON, IN';
    storeList['1894'] = 'BEDFORD, IN';
    storeList['0634'] = 'BLOOMINGTON, IN';
    storeList['1773'] = 'BLUFFTON, IN';
    storeList['2681'] = 'BROWNSBURG, IN';
    storeList['1525'] = 'CARMEL, IN';
    storeList['2542'] = 'CLARKSVILLE, IN';
    storeList['1516'] = 'COLUMBUS, IN';
    storeList['2942'] = 'ELKHART, IN';
    storeList['0679'] = 'W. EVANSVILLE, IN';
    storeList['0630'] = 'E. EVANSVILLE, IN';
    storeList['0053'] = 'W. FORT WAYNE, IN';
    storeList['0126'] = 'E. FORT WAYNE, IN';
    storeList['1105'] = 'N. FT WAYNE, IN';
    storeList['2523'] = 'FRANKLIN, IN';
    storeList['0071'] = 'GOSHEN, IN';
    storeList['2319'] = 'BEECH GROVE, IN';
    storeList['0272'] = 'E. INDIANAPOLIS, IN';
    storeList['0635'] = 'CENTRAL INDIANAPOLIS, IN';
    storeList['0275'] = 'W. INDIANAPOLIS, IN';
    storeList['0442'] = 'S. INDIANAPOLIS, IN';
    storeList['0288'] = 'N.E. INDIANAPOLIS, IN';
    storeList['0145'] = 'N.W. INDIANAPOLIS, IN';
    storeList['0357'] = 'KOKOMO, IN';
    storeList['0012'] = 'LAFAYETTE, IN';
    storeList['2522'] = 'LAWRENCEBURG, IN';
    storeList['1735'] = 'MADISON, IN';
    storeList['0211'] = 'MARION, IN';
    storeList['1569'] = 'MERRILLVILLE, IN';
    storeList['0195'] = 'MICHIGAN CITY, IN';
    storeList['0200'] = 'MISHAWAKA, IN';
    storeList['1168'] = 'MOORESVILLE, IN';
    storeList['0116'] = 'MUNCIE, IN';
    storeList['1191'] = 'NOBLESVILLE, IN';
    storeList['1956'] = 'PLYMOUTH, IN';
    storeList['1778'] = 'PORTAGE, IN';
    storeList['1092'] = 'RICHMOND, IN';
    storeList['1601'] = 'SCHERERVILLE, IN';
    storeList['2593'] = 'SOUTH BEND, IN';
    storeList['0215'] = 'TERRE HAUTE, IN';
    storeList['1610'] = 'VINCENNES, IN';
    storeList['1615'] = 'WARSAW, IN';
    storeList['2766'] = 'ZIONSVILLE, IN';
    storeList['2503'] = 'ALTOONA, IA';
    storeList['0581'] = 'AMES, IA';
    storeList['0057'] = 'BURLINGTON, IA';
    storeList['2231'] = 'CEDAR RAPIDS, IA';
    storeList['1688'] = 'CORALVILLE, IA';
    storeList['0107'] = 'DAVENPORT, IA';
    storeList['0117'] = 'DUBUQUE, IA';
    storeList['1695'] = 'SIOUX CITY, IA';
    storeList['1712'] = 'WATERLOO, IA';
    storeList['0552'] = 'W. DES MOINES, IA';
    storeList['2648'] = 'JORDAN CREEK, IA';
    storeList['2504'] = 'DERBY, KS';
    storeList['1745'] = 'HUTCHINSON, KS';
    storeList['1830'] = 'KANSAS CITY, KS';
    storeList['0721'] = 'OLATHE, KS';
    storeList['2588'] = 'ROELAND PARK, KS';
    storeList['1559'] = 'SALINA, KS';
    storeList['1084'] = 'SHAWNEE, KS';
    storeList['0521'] = 'TOPEKA, KS';
    storeList['2340'] = 'N.W. WICHITA, KS';
    storeList['1547'] = 'E. WICHITA, KS';
    storeList['0614'] = 'W. WICHITA, KS';
    storeList['1123'] = 'RUSSELL, KY';
    storeList['2530'] = 'BARDSTOWN, KY';
    storeList['0451'] = 'BOWLING GREEN, KY';
    storeList['1770'] = 'CAMPBELLSVILLE, KY';
    storeList['0494'] = 'CORBIN, KY';
    storeList['1622'] = 'DANVILLE, KY';
    storeList['0460'] = 'ELIZABETHTOWN, KY';
    storeList['0554'] = 'FLORENCE, KY';
    storeList['0492'] = 'FRANKFORT, KY';
    storeList['2776'] = 'FRANKLIN, KY';
    storeList['1736'] = 'GEORGETOWN, KY';
    storeList['1796'] = 'GLASGOW, KY';
    storeList['1819'] = 'HAZARD, KY';
    storeList['2558'] = 'HENDERSON, KY';
    storeList['1071'] = 'HIGHLAND HEIGHTS, KY';
    storeList['1666'] = 'HOPKINSVILLE, KY';
    storeList['0607'] = 'S. LEXINGTON, KY';
    storeList['0507'] = 'E. LEXINGTON, KY';
    storeList['2345'] = 'N.E. LEXINGTON, KY';
    storeList['2666'] = 'LONDON, KY';
    storeList['1923'] = 'C. LOUISVILLE, KY';
    storeList['0474'] = 'E. LOUISVILLE, KY';
    storeList['1518'] = 'S. LOUISVILLE, KY';
    storeList['2245'] = 'N.E. LOUISVILLE, KY';
    storeList['0705'] = 'S.W. LOUISVILLE, KY';
    storeList['0016'] = 'MADISONVILLE, KY';
    storeList['2490'] = 'MAYFIELD, KY';
    storeList['2497'] = 'MAYSVILLE, KY';
    storeList['1808'] = 'MOREHEAD, KY';
    storeList['2768'] = 'MT. STERLING, KY';
    storeList['0722'] = 'MURRAY, KY';
    storeList['2581'] = 'NICHOLASVILLE, KY';
    storeList['0657'] = 'OWENSBORO, KY';
    storeList['0465'] = 'PADUCAH, KY';
    storeList['2460'] = 'E. PADUCAH, KY';
    storeList['1797'] = 'PAINTSVILLE, KY';
    storeList['0435'] = 'PIKEVILLE, KY';
    storeList['1006'] = 'RICHMOND, KY';
    storeList['2592'] = 'SHELBYVILLE, KY';
    storeList['2945'] = 'SHEPHERDSVILLE, KY';
    storeList['0558'] = 'SOMERSET, KY';
    storeList['0464'] = 'WINCHESTER, KY';
    storeList['3015'] = 'ABBEVILLE, LA';
    storeList['0586'] = 'ALEXANDRIA, LA';
    storeList['0186'] = 'S. BATON ROUGE, LA';
    storeList['0461'] = 'N. BATON ROUGE, LA';
    storeList['2484'] = 'E. BATON ROUGE, LA';
    storeList['1813'] = 'BOSSIER CITY, LA';
    storeList['1698'] = 'COVINGTON, LA';
    storeList['2203'] = 'CROWLEY, LA';
    storeList['2645'] = 'GONZALES, LA';
    storeList['1070'] = 'HAMMOND, LA';
    storeList['1085'] = 'HARVEY, LA';
    storeList['0596'] = 'HOUMA, LA';
    storeList['1877'] = 'JEFFERSON HIGHWAY, LA';
    storeList['0484'] = 'LAFAYETTE, LA';
    storeList['0618'] = 'N. LAFAYETTE, LA';
    storeList['0589'] = 'LAKE CHARLES, LA';
    storeList['2234'] = 'LEESVILLE, LA';
    storeList['2975'] = 'MARRERO, LA';
    storeList['1054'] = 'METAIRIE, LA';
    storeList['0450'] = 'MONROE, LA';
    storeList['1107'] = 'NEW IBERIA, LA';
    storeList['2470'] = 'CENTRAL NEW ORLEANS, LA';
    storeList['2690'] = 'E. NEW ORLEANS, LA';
    storeList['1822'] = 'OPELOUSAS, LA';
    storeList['2965'] = 'PINEVILLE, LA';
    storeList['2418'] = 'RUSTON, LA';
    storeList['1968'] = 'S.E. SHREVEPORT, LA';
    storeList['0428'] = 'SHREVEPORT, LA';
    storeList['1684'] = 'SLIDELL, LA';
    storeList['1899'] = 'SULPHUR, LA';
    storeList['2596'] = 'THIBODAUX, LA';
    storeList['2514'] = 'AUBURN, ME';
    storeList['2265'] = 'AUGUSTA, ME';
    storeList['1940'] = 'BANGOR, ME';
    storeList['2291'] = 'BREWER, ME';
    storeList['2536'] = 'BRUNSWICK, ME';
    storeList['1946'] = 'PORTLAND, ME';
    storeList['2209'] = 'PRESQUE ISLE, ME';
    storeList['2388'] = 'SANFORD, ME';
    storeList['2407'] = 'SCARBOROUGH, ME';
    storeList['2496'] = 'THOMASTON, ME';
    storeList['2629'] = 'N. WINDHAM, ME';
    storeList['2589'] = 'S. BEL AIR, MD';
    storeList['0624'] = 'CATONSVILLE, MD';
    storeList['0691'] = 'WHITE MARSH, MD';
    storeList['0452'] = 'BOWIE, MD';
    storeList['0719'] = 'ST. MARY\'S COUNTY, MD';
    storeList['1136'] = 'CLINTON, MD';
    storeList['1982'] = 'EASTON, MD';
    storeList['2244'] = 'COLUMBIA, MD';
    storeList['2826'] = 'N. FREDERICK, MD';
    storeList['0516'] = 'FREDERICK, MD';
    storeList['0223'] = 'GAITHERSBURG, MD';
    storeList['0631'] = 'GLEN BURNIE, MD';
    storeList['0471'] = 'HAGERSTOWN, MD';
    storeList['2357'] = 'N. HAGERSTOWN, MD';
    storeList['2354'] = 'LA PLATA, MD';
    storeList['1188'] = 'LAUREL, MD';
    storeList['0468'] = 'ALLEGANY, MD';
    storeList['1122'] = 'NEW CARROLLTON, MD';
    storeList['2848'] = 'NORTH EAST, MD';
    storeList['2800'] = 'OAKLAND, MD';
    storeList['2995'] = 'TOWSON, MD';
    storeList['2414'] = 'POCOMOKE CITY, MD';
    storeList['0424'] = 'SALISBURY, MD';
    storeList['2594'] = 'SEVERN, MD';
    storeList['0720'] = 'TIMONIUM, MD';
    storeList['0702'] = 'LARGO, MD';
    storeList['0402'] = 'CHARLES COUNTY, MD';
    storeList['0568'] = 'WESTMINSTER, MD';
    storeList['2785'] = 'ABINGTON, MA';
    storeList['1174'] = 'BROCKTON, MA';
    storeList['1094'] = 'DANVERS, MA';
    storeList['1914'] = 'DEDHAM, MA';
    storeList['2384'] = 'FRAMINGHAM, MA';
    storeList['1916'] = 'HADLEY, MA';
    storeList['2375'] = 'HUDSON, MA';
    storeList['1663'] = 'KINGSTON, MA';
    storeList['1858'] = 'LEOMINSTER, MA';
    storeList['2657'] = 'LOWELL, MA';
    storeList['1889'] = 'MILFORD, MA';
    storeList['1832'] = 'N. DARTMOUTH, MA';
    storeList['1014'] = 'NORTH ATTLEBORO, MA';
    storeList['1758'] = 'PEMBROKE, MA';
    storeList['2393'] = 'PLAINVILLE, MA';
    storeList['2267'] = 'QUINCY, MA';
    storeList['1857'] = 'RAYNHAM, MA';
    storeList['2372'] = 'SAUGUS, MA';
    storeList['1932'] = 'SEEKONK, MA';
    storeList['0660'] = 'E. SPRINGFIELD, MA';
    storeList['2386'] = 'WARE, MA';
    storeList['2376'] = 'WAREHAM, MA';
    storeList['2752'] = 'WEST BRIDGEWATER, MA';
    storeList['1831'] = 'WESTBOROUGH, MA';
    storeList['1618'] = 'WEYMOUTH, MA';
    storeList['1198'] = 'WOBURN, MA';
    storeList['1206'] = 'WORCESTER, MA';
    storeList['0088'] = 'ADRIAN, MI';
    storeList['1859'] = 'ALLEN PARK, MI';
    storeList['1750'] = 'SCIO TOWNSHIP, MI';
    storeList['0069'] = 'BATTLE CREEK, MI';
    storeList['0046'] = 'BENTON HARBOR, MI';
    storeList['2532'] = 'BIG RAPIDS, MI';
    storeList['0713'] = 'BLOOMFIELD TOWNSHIP, MI';
    storeList['0761'] = 'BURTON, MI';
    storeList['1847'] = 'CANTON, MI';
    storeList['1156'] = 'N. CHESTERFIELD, MI';
    storeList['1716'] = 'S. CLINTON TOWNSHIP, MI';
    storeList['1008'] = 'CLINTON TOWNSHIP, MI';
    storeList['1814'] = 'COMMERCE TOWNSHIP, MI';
    storeList['0669'] = 'FLINT, MI';
    storeList['0695'] = 'FT. GRATIOT, MI';
    storeList['1551'] = 'GAYLORD, MI';
    storeList['1514'] = 'N.E. GRAND RAPIDS, MI';
    storeList['1121'] = 'GRANDVILLE, MI';
    storeList['1677'] = 'HARPER WOODS, MI';
    storeList['0330'] = 'HOLLAND, MI';
    storeList['0779'] = 'HOWELL, MI';
    storeList['0146'] = 'JACKSON, MI';
    storeList['0765'] = 'KALAMAZOO, MI';
    storeList['1517'] = 'KENTWOOD, MI';
    storeList['1596'] = 'S. LANSING, MI';
    storeList['0777'] = 'W. LANSING, MI';
    storeList['2318'] = 'LUDINGTON, MI';
    storeList['2312'] = 'MADISON HEIGHTS, MI';
    storeList['2868'] = 'MARQUETTE, MI';
    storeList['0575'] = 'MIDLAND, MI';
    storeList['1074'] = 'FRENCHTOWN TOWNSHIP, MI';
    storeList['0199'] = 'MUSKEGON, MI';
    storeList['2570'] = 'LYON TOWNSHIP, MI';
    storeList['1860'] = 'NILES, MI';
    storeList['2585'] = 'PETOSKEY, MI';
    storeList['1110'] = 'PORTAGE, MI';
    storeList['2305'] = 'ROCHESTER HILLS, MI';
    storeList['0562'] = 'SAGINAW, MI';
    storeList['1604'] = 'SOUTHFIELD, MI';
    storeList['1205'] = 'SOUTHGATE, MI';
    storeList['1779'] = 'STERLING HEIGHTS, MI';
    storeList['1609'] = 'TRAVERSE CITY, MI';
    storeList['0684'] = 'WARREN, MI';
    storeList['0768'] = 'WESTLAND, MI';
    storeList['1823'] = 'WHITE LAKE, MI';
    storeList['2765'] = 'WOODHAVEN, MI';
    storeList['0734'] = 'ANN ARBOR, MI';
    storeList['2465'] = 'BLAINE, MN';
    storeList['1833'] = 'COON RAPIDS, MN';
    storeList['2333'] = 'HIBBING, MN';
    storeList['2855'] = 'MANKATO, MN';
    storeList['2627'] = 'MAPLE GROVE, MN';
    storeList['2315'] = 'OAK PARK HEIGHTS, MN';
    storeList['2518'] = 'OWATONNA, MN';
    storeList['1955'] = 'PLYMOUTH, MN';
    storeList['2736'] = 'ROCHESTER, MN';
    storeList['2628'] = 'SHAKOPEE, MN';
    storeList['2313'] = 'W. ST. PAUL, MN';
    storeList['1757'] = 'BATESVILLE, MS';
    storeList['1166'] = 'COLUMBUS, MS';
    storeList['0091'] = 'CORINTH, MS';
    storeList['0690'] = 'D\'IBERVILLE, MS';
    storeList['2553'] = 'FLOWOOD, MS';
    storeList['2700'] = 'GAUTIER, MS';
    storeList['1527'] = 'GREENVILLE, MS';
    storeList['0466'] = 'GULFPORT, MS';
    storeList['0537'] = 'HATTIESBURG, MS';
    storeList['2369'] = 'W. JACKSON, MS';
    storeList['2563'] = 'LAUREL, MS';
    storeList['2620'] = 'MADISON, MS';
    storeList['1774'] = 'MCCOMB, MS';
    storeList['1568'] = 'MERIDIAN, MS';
    storeList['3041'] = 'NEW ALBANY, MS';
    storeList['1988'] = 'OLIVE BRANCH, MS';
    storeList['0712'] = 'PASCAGOULA, MS';
    storeList['3033'] = 'PETAL, MS';
    storeList['2208'] = 'PHILADELPHIA, MS';
    storeList['2622'] = 'RIDGELAND, MS';
    storeList['1721'] = 'SOUTHAVEN, MS';
    storeList['2519'] = 'STARKVILLE, MS';
    storeList['0529'] = 'TUPELO, MS';
    storeList['2350'] = 'WAVELAND, MS';
    storeList['2303'] = 'ARNOLD, MO';
    storeList['1503'] = 'BALLWIN, MO';
    storeList['2299'] = 'BRIDGETON, MO';
    storeList['0317'] = 'CAPE GIRARDEAU, MO';
    storeList['2647'] = 'CARTHAGE, MO';
    storeList['0731'] = 'CHESTERFIELD, MO';
    storeList['2459'] = 'CHILLICOTHE, MO';
    storeList['0008'] = 'COLUMBIA, MO';
    storeList['1746'] = 'FARMINGTON, MO';
    storeList['1055'] = 'FENTON, MO';
    storeList['1809'] = 'FESTUS, MO';
    storeList['0748'] = 'FLORISSANT, MO';
    storeList['2991'] = 'HANNIBAL, MO';
    storeList['1096'] = 'HOLLISTER, MO';
    storeList['1098'] = 'INDEPENDENCE, MO';
    storeList['1077'] = 'JEFFERSON CITY, MO';
    storeList['0278'] = 'JOPLIN, MO';
    storeList['2767'] = 'KANSAS CITY, GLADSTONE, MO';
    storeList['2943'] = 'EAST KANSAS CITY, MO';
    storeList['1623'] = 'S. KANSAS CITY, MO';
    storeList['1078'] = 'N. KANSAS CITY, MO';
    storeList['0764'] = 'KIRKWOOD, MO';
    storeList['2311'] = 'LAKE ST. LOUIS, MO';
    storeList['2565'] = 'LEBANON, MO';
    storeList['1180'] = 'LEE\'S SUMMIT, MO';
    storeList['1565'] = 'LIBERTY, MO';
    storeList['1966'] = 'MAPLEWOOD, MO';
    storeList['3088'] = 'MOBERLY, MO';
    storeList['2576'] = 'MONETT, MO';
    storeList['2849'] = 'NEOSHO, MO';
    storeList['1147'] = 'OSAGE BEACH, MO';
    storeList['2226'] = 'OZARK, MO';
    storeList['2626'] = 'RAYMORE, MO';
    storeList['2314'] = 'REPUBLIC, MO';
    storeList['1083'] = 'ROLLA, MO';
    storeList['1057'] = 'ST. CHARLES, MO';
    storeList['0305'] = 'ST. JOSEPH, MO';
    storeList['2300'] = 'S. ST. LOUIS, MO';
    storeList['0753'] = 'O\'FALLON, MO';
    storeList['2769'] = 'ST. ROBERT, MO';
    storeList['1067'] = 'SEDALIA, MO';
    storeList['1209'] = 'SIKESTON, MO';
    storeList['0733'] = 'N. SPRINGFIELD, MO';
    storeList['0422'] = 'SPRINGFIELD, MO';
    storeList['2729'] = 'OAK GROVE VILLAGE, MO';
    storeList['2600'] = 'WARRENSBURG, MO';
    storeList['1648'] = 'WASHINGTON, MO';
    storeList['2761'] = 'WENTZVILLE, MO';
    storeList['0319'] = 'BILLINGS, MT';
    storeList['2608'] = 'BOZEMAN, MT';
    storeList['2277'] = 'HELENA, MT';
    storeList['1904'] = 'KALISPELL, MT';
    storeList['1682'] = 'MISSOULA, MT';
    storeList['2739'] = 'S. LINCOLN, NE';
    storeList['1159'] = 'CENTRAL OMAHA, NE';
    storeList['1520'] = 'N.W. OMAHA, NE';
    storeList['1184'] = 'S.W. OMAHA, NE';
    storeList['2611'] = 'PAPILLION, NE';
    storeList['1024'] = 'CARSON CITY, NV';
    storeList['2661'] = 'FERNLEY, NV';
    storeList['1033'] = 'HENDERSON, NV';
    storeList['1537'] = 'C. HENDERSON, NV';
    storeList['1639'] = 'C. LAS VEGAS, NV';
    storeList['1620'] = 'SUNRISE, NV';
    storeList['2477'] = 'N.E. LAS VEGAS, NV';
    storeList['2271'] = 'LAS VEGAS, NV';
    storeList['0784'] = 'SUMMERLIN, NV';
    storeList['1863'] = 'N.W. LAS VEGAS, NV';
    storeList['2844'] = 'CENTENNIAL HILLS, NV';
    storeList['1836'] = 'W. SUMMERLIN, NV';
    storeList['1703'] = 'W. SPRING VALLEY, NV';
    storeList['1719'] = 'W. HENDERSON, NV';
    storeList['2721'] = 'NORTH LAS VEGAS, NV';
    storeList['0321'] = 'RENO, NV';
    storeList['3034'] = 'SPARKS, NV';
    storeList['2526'] = 'AMHERST, NH';
    storeList['1907'] = 'BEDFORD, NH';
    storeList['2617'] = 'CONCORD, NH';
    storeList['2374'] = 'N. CONWAY, NH';
    storeList['2551'] = 'EPPING, NH';
    storeList['2322'] = 'GILFORD, NH';
    storeList['1879'] = 'GREENLAND, NH';
    storeList['2321'] = 'LITTLETON, NH';
    storeList['2391'] = 'S. NASHUA, NH';
    storeList['2449'] = 'ROCHESTER, NH';
    storeList['2382'] = 'SALEM, NH';
    storeList['1979'] = 'SEABROOK, NH';
    storeList['2610'] = 'TILTON, NH';
    storeList['2676'] = 'BAYONNE, NJ';
    storeList['1535'] = 'BRICK TOWNSHIP, NJ';
    storeList['1957'] = 'BUTLER, NJ';
    storeList['1670'] = 'DELRAN, NJ';
    storeList['1542'] = 'DEPTFORD, NJ';
    storeList['1942'] = 'E. RUTHERFORD, NJ';
    storeList['1862'] = 'E. BRUNSWICK, NJ';
    storeList['1548'] = 'EATONTOWN, NJ';
    storeList['1034'] = 'EGG HARBOR TOWNSHIP, NJ';
    storeList['1512'] = 'MT. OLIVE, NJ';
    storeList['2552'] = 'FLEMINGTON, RARITAN, NJ';
    storeList['1938'] = 'HACKETTSTOWN, NJ';
    storeList['1046'] = 'HAMILTON, NJ';
    storeList['1656'] = 'HILLSBOROUGH, NJ';
    storeList['1035'] = 'HOLMDEL, NJ';
    storeList['1676'] = 'HOWELL, NJ';
    storeList['1937'] = 'JERSEY CITY, NJ';
    storeList['1149'] = 'LAWNSIDE, NJ';
    storeList['1575'] = 'MT. HOLLY, NJ';
    storeList['2260'] = 'MANAHAWKIN, NJ';
    storeList['2428'] = 'MANCHESTER TOWNSHIP, NJ';
    storeList['1637'] = 'MAPLE SHADE, NJ';
    storeList['1816'] = 'MILLVILLE, NJ';
    storeList['1567'] = 'MARLBORO, NJ';
    storeList['1976'] = 'HAMPTON TOWNSHIP, NJ';
    storeList['1106'] = 'NORTH BERGEN, NJ';
    storeList['2431'] = 'PARAMUS, NJ';
    storeList['2328'] = 'PATERSON, NJ';
    storeList['1590'] = 'PHILLIPSBURG, NJ';
    storeList['0692'] = 'PISCATAWAY, NJ';
    storeList['1185'] = 'W. WINDSOR, NJ';
    storeList['1861'] = 'CAPE MAY, NJ';
    storeList['2402'] = 'MANTUA TOWNSHIP, NJ';
    storeList['2630'] = 'GLOUCESTER TOWNSHIP, NJ';
    storeList['1608'] = 'TOMS RIVER, NJ';
    storeList['0751'] = 'TURNERSVILLE, NJ';
    storeList['1939'] = 'UNION, NJ';
    storeList['2389'] = 'VOORHEES, NJ';
    storeList['1658'] = 'WOODBRIDGE, NJ';
    storeList['1761'] = 'ALAMOGORDO, NM';
    storeList['2539'] = 'C. ALBUQUERQUE, NM';
    storeList['1543'] = 'E. ALBUQUERQUE, NM';
    storeList['0756'] = 'N.E. ALBUQUERQUE, NM';
    storeList['1636'] = 'N.W. ALBUQUERQUE, NM';
    storeList['3167'] = 'CARLSBAD, NM';
    storeList['1781'] = 'CLOVIS, NM';
    storeList['2510'] = 'ESPANOLA, NM';
    storeList['2501'] = 'FARMINGTON, NM';
    storeList['3202'] = 'HOBBS, NM';
    storeList['1158'] = 'LAS CRUCES, NM';
    storeList['3048'] = 'LOS LUNAS, NM';
    storeList['2879'] = 'RIO RANCHO, NM';
    storeList['2556'] = 'SANTA FE, NM';
    storeList['1883'] = 'W. AMHERST, NY';
    storeList['1880'] = 'AMSTERDAM, NY';
    storeList['0561'] = 'AUBURN, NY';
    storeList['1709'] = 'BAY SHORE, NY';
    storeList['1502'] = 'BINGHAMTON, NY';
    storeList['2434'] = 'BROCKPORT, NY';
    storeList['1674'] = 'BROOKLYN, NY';
    storeList['2284'] = 'BROOKLYN, KINGS PLAZA, NY';
    storeList['2538'] = 'CAMILLUS, NY';
    storeList['1817'] = 'CANANDAIGUA, NY';
    storeList['2483'] = 'CATSKILL, NY';
    storeList['2685'] = 'CHESTER, NY';
    storeList['2541'] = 'CICERO, NY';
    storeList['1973'] = 'ALBANY-NORTHWAY MALL, NY';
    storeList['1953'] = 'CORTLANDVILLE, NY';
    storeList['2731'] = 'PATCHOGUE, NY';
    storeList['0530'] = 'BIG FLATS, NY';
    storeList['1917'] = 'FARMINGDALE, NY';
    storeList['1624'] = 'GARDEN CITY, NY';
    storeList['2759'] = 'WATERLOO, NY';
    storeList['1784'] = 'GLENMONT, NY';
    storeList['2701'] = 'GLENVILLE, NY';
    storeList['1740'] = 'HALFMOON, NY';
    storeList['2704'] = 'HAMBURG, NY';
    storeList['2400'] = 'HERKIMER, NY';
    storeList['2612'] = 'HICKSVILLE, NY';
    storeList['2326'] = 'LLOYD, NY';
    storeList['2444'] = 'HORNELL, NY';
    storeList['2927'] = 'GREENPORT, NY';
    storeList['1864'] = 'ITHACA, NY';
    storeList['0524'] = 'ULSTER, NY';
    storeList['1177'] = 'COLONIE, NY';
    storeList['2379'] = 'CLAY, NY';
    storeList['2668'] = 'MACEDON, NY';
    storeList['1189'] = 'MEDFORD, NY';
    storeList['0540'] = 'MIDDLETOWN, NY';
    storeList['2249'] = 'CLARKSTOWN, NY';
    storeList['2726'] = 'NEW HARTFORD, NY';
    storeList['1584'] = 'NEWBURGH, NY';
    storeList['2399'] = 'NORWICH, NY';
    storeList['2401'] = 'OGDENSBURG, NY';
    storeList['2289'] = 'ONEIDA, NY';
    storeList['1967'] = 'ONEONTA, NY';
    storeList['1192'] = 'ORANGEBURG, NY';
    storeList['1882'] = 'ORCHARD PARK, NY';
    storeList['1908'] = 'OSWEGO, NY';
    storeList['1195'] = 'PLATTSBURGH, NY';
    storeList['2250'] = 'POTSDAM, NY';
    storeList['0541'] = 'POUGHKEEPSIE, NY';
    storeList['0641'] = 'GLENS FALLS, NY';
    storeList['2921'] = 'RIVERHEAD, SOUTH, NY';
    storeList['0645'] = 'HENRIETTA, NY';
    storeList['1655'] = 'GREECE, NY';
    storeList['1865'] = 'ROME, NY';
    storeList['2664'] = 'ROSEDALE, NY';
    storeList['0560'] = 'SARATOGA SPRINGS, NY';
    storeList['1612'] = 'NISKAYUNA, NY';
    storeList['2453'] = 'SPRINGVILLE, NY';
    storeList['1583'] = 'N.W. STATEN ISLAND, NY';
    storeList['1597'] = 'S. STATEN ISLAND, NY';
    storeList['2233'] = 'STONY BROOK, NY';
    storeList['2380'] = 'SYRACUSE, NY';
    storeList['0523'] = 'UTICA, NY';
    storeList['0202'] = 'VESTAL, NY';
    storeList['1022'] = 'WATERTOWN, NY';
    storeList['1581'] = 'WEBSTER, NY';
    storeList['1881'] = 'E. AMHERST, NY';
    storeList['1529'] = 'ALBEMARLE, NC';
    storeList['1878'] = 'APEX, NC';
    storeList['2201'] = 'S. ASHEVILLE, NC';
    storeList['0449'] = 'ASHEBORO, NC';
    storeList['0617'] = 'E. ASHEVILLE, NC';
    storeList['0526'] = 'W. ASHEVILLE, NC';
    storeList['1834'] = 'BANNER ELK, NC';
    storeList['2650'] = 'BELMONT, NC';
    storeList['1522'] = 'BOONE, NC';
    storeList['1990'] = 'BREVARD, NC';
    storeList['0508'] = 'BURLINGTON, NC';
    storeList['2436'] = 'CAPE CARTERET, NC';
    storeList['1835'] = 'N. CARY, NC';
    storeList['0426'] = 'CARY, NC';
    storeList['0487'] = 'CHAPEL HILL, NC';
    storeList['2348'] = 'CENTRAL CHARLOTTE, NC';
    storeList['0408'] = 'N. CHARLOTTE, NC';
    storeList['2352'] = 'CHARLOTTE, NORTHLAKE MALL, NC';
    storeList['0377'] = 'PINEVILLE, NC';
    storeList['1920'] = 'E. CHARLOTTE, NC';
    storeList['1060'] = 'S.W. CHARLOTTE, NC';
    storeList['1112'] = 'S. CHARLOTTE, NC';
    storeList['1689'] = 'CLINTON, NC';
    storeList['0697'] = 'CONCORD, NC';
    storeList['2981'] = 'S.W. CONCORD, NC';
    storeList['2636'] = 'E. LINCOLN COUNTY, NC';
    storeList['0576'] = 'N. DURHAM, NC';
    storeList['2778'] = 'S. DURHAM, NC';
    storeList['1713'] = 'ELIZABETH CITY, NC';
    storeList['1653'] = 'ELKIN, NC';
    storeList['1777'] = 'ERWIN, NC';
    storeList['2905'] = 'W. FAYETTEVILLE, NC';
    storeList['0767'] = 'N. FAYETTEVILLE, NC';
    storeList['0388'] = 'FAYETTEVILLE, NC';
    storeList['1788'] = 'FOREST CITY, NC';
    storeList['0717'] = 'FRANKLIN, NC';
    storeList['0488'] = 'GARNER, NC';
    storeList['0677'] = 'CLAYTON, NC';
    storeList['0457'] = 'FRANKLIN SQUARE, NC';
    storeList['0557'] = 'GOLDSBORO, NC';
    storeList['2771'] = 'N.E. GREENSBORO, NC';
    storeList['2222'] = 'S.E. GREENSBORO, NC';
    storeList['0404'] = 'S.W. GREENSBORO, NC';
    storeList['0387'] = 'N. GREENSBORO, NC';
    storeList['2837'] = 'E. GREENVILLE, NC';
    storeList['2256'] = 'SURF CITY, NC';
    storeList['0738'] = 'HENDERSON, NC';
    storeList['0031'] = 'HENDERSONVILLE, NC';
    storeList['2370'] = 'N. HICKORY, NC';
    storeList['1557'] = 'HICKORY, NC';
    storeList['0459'] = 'N. HIGH POINT, NC';
    storeList['0489'] = 'HUNTERSVILLE, NC';
    storeList['2907'] = 'INDIAN TRAIL, NC';
    storeList['2737'] = 'S. JACKSONVILLE, NC';
    storeList['0556'] = 'JACKSONVILLE, NC';
    storeList['2368'] = 'N. CONCORD, NC';
    storeList['1141'] = 'KERNERSVILLE, NC';
    storeList['3216'] = 'KILL DEVIL HILLS, NC';
    storeList['1722'] = 'KINSTON, NC';
    storeList['1095'] = 'KNIGHTDALE, NC';
    storeList['2564'] = 'LAURINBURG, NC';
    storeList['1509'] = 'LENOIR, NC';
    storeList['0490'] = 'LEXINGTON, NC';
    storeList['0700'] = 'LINCOLNTON, NC';
    storeList['0739'] = 'LUMBERTON, NC';
    storeList['1922'] = 'MARION, NC';
    storeList['1124'] = 'S.E. CHARLOTTE, NC';
    storeList['2996'] = 'MAYODAN, NC';
    storeList['2517'] = 'MEBANE, NC';
    storeList['2575'] = 'MOCKSVILLE, NC';
    storeList['0680'] = 'MONROE, NC';
    storeList['1999'] = 'MOORESVILLE, NC';
    storeList['0595'] = 'MOORESVILLE, NC';
    storeList['0619'] = 'MOREHEAD CITY, NC';
    storeList['1097'] = 'MORGANTON, NC';
    storeList['0478'] = 'MOUNT AIRY, NC';
    storeList['2505'] = 'MURPHY, NC';
    storeList['0566'] = 'NEW BERN, NC';
    storeList['2448'] = 'PITTSBORO, NC';
    storeList['0444'] = 'N. RALEIGH, NC';
    storeList['0625'] = 'W. RALEIGH, NC';
    storeList['1210'] = 'REIDSVILLE, NC';
    storeList['1815'] = 'ROANOKE RAPIDS, NC';
    storeList['1038'] = 'ROCKINGHAM, NC';
    storeList['0547'] = 'ROCKY MOUNT, NC';
    storeList['2210'] = 'ROXBORO, NC';
    storeList['0495'] = 'SALISBURY, NC';
    storeList['3608'] = 'SANFORD, NC';
    storeList['1068'] = 'SHALLOTTE, NC';
    storeList['0612'] = 'SHELBY, NC';
    storeList['0647'] = 'SMITHFIELD, NC';
    storeList['0538'] = 'SOUTHERN PINES, NC';
    storeList['0682'] = 'SOUTHPORT, NC';
    storeList['0458'] = 'STATESVILLE, NC';
    storeList['2257'] = 'SYLVA, NC';
    storeList['3022'] = 'TARBORO, NC';
    storeList['2750'] = 'TROUTMAN, NC';
    storeList['2255'] = 'W. JEFFERSON, NC';
    storeList['1798'] = 'WAKE FOREST, NC';
    storeList['0786'] = 'WASHINGTON, NC';
    storeList['2638'] = 'WAXHAW, NC';
    storeList['0470'] = 'WAYNESVILLE, NC';
    storeList['2634'] = 'WEAVERVILLE, NC';
    storeList['2869'] = 'WHITEVILLE, NC';
    storeList['0701'] = 'WILKESBORO, NC';
    storeList['1998'] = 'WILKESBORO, NC';
    storeList['0445'] = 'UNIVERSITY CENTRE, NC';
    storeList['2982'] = 'N.E. NEW HANOVER COUNTY, NC';
    storeList['1138'] = 'S. WILMINGTON, NC';
    storeList['0726'] = 'WILSON, NC';
    storeList['0436'] = 'WINSTON WEST, NC';
    storeList['0480'] = 'N. WINSTON, NC';
    storeList['2653'] = 'S. WINSTON-SALEM, NC';
    storeList['0598'] = 'GREENVILLE, NC';
    storeList['2533'] = 'BISMARCK, ND';
    storeList['1650'] = 'FARGO, ND';
    storeList['1896'] = 'GRAND FORKS, ND';
    storeList['1768'] = 'GREEN, OH';
    storeList['0633'] = 'FAIRLAWN, OH';
    storeList['0297'] = 'ALLIANCE, OH';
    storeList['1519'] = 'ASHTABULA, OH';
    storeList['1866'] = 'ATHENS, OH';
    storeList['2770'] = 'AVON, OH';
    storeList['1023'] = 'BEDFORD HEIGHTS, OH';
    storeList['0009'] = 'BELLEFONTAINE, OH';
    storeList['0770'] = 'BROOKLYN, OH';
    storeList['0207'] = 'WILMINGTON PIKE, OH';
    storeList['0472'] = 'CHILLICOTHE, OH';
    storeList['1585'] = 'NORWOOD, OH';
    storeList['1160'] = 'S.E. CINCINNATI, OH';
    storeList['0760'] = 'SPRINGDALE, OH';
    storeList['2338'] = 'WESTERN HILLS, OH';
    storeList['0534'] = 'N.W. CINCINNATI, OH';
    storeList['1595'] = 'S. COLUMBUS, OH';
    storeList['1175'] = 'CENTRAL COLUMBUS, OH';
    storeList['1211'] = 'E. COLUMBUS, OH';
    storeList['0265'] = 'N.E. COLUMBUS, OH';
    storeList['0181'] = 'S.W. COLUMBUS, OH';
    storeList['0003'] = 'S.E. COLUMBUS, OH';
    storeList['0711'] = 'N. COLUMBUS, OH';
    storeList['0231'] = 'DEFIANCE, OH';
    storeList['0755'] = 'DUBLIN, OH';
    storeList['0224'] = 'ELYRIA, OH';
    storeList['0089'] = 'BEAVERCREEK, OH';
    storeList['1045'] = 'FINDLAY, OH';
    storeList['0019'] = 'FREMONT, OH';
    storeList['2524'] = 'GREENVILLE, OH';
    storeList['0168'] = 'HAMILTON, OH';
    storeList['0708'] = 'HEATH, OH';
    storeList['0037'] = 'W. COLUMBUS, OH';
    storeList['2343'] = 'HILLSBORO, OH';
    storeList['0781'] = 'HUBER HEIGHTS, OH';
    storeList['2500'] = 'BRIMFIELD TOWNSHIP, OH';
    storeList['0527'] = 'LANCASTER, OH';
    storeList['0255'] = 'LIMA, OH';
    storeList['2867'] = 'LORAIN, OH';
    storeList['0264'] = 'ONTARIO, OH';
    storeList['1566'] = 'MARIETTA, OH';
    storeList['1091'] = 'MARION, OH';
    storeList['2944'] = 'MARYSVILLE, OH';
    storeList['0542'] = 'MASON, OH';
    storeList['0766'] = 'MASSILLON, OH';
    storeList['1621'] = 'MENTOR, OH';
    storeList['0303'] = 'MIDDLETOWN, OH';
    storeList['1664'] = 'MILFORD-MIAMI TOWNSHIP, OH';
    storeList['1765'] = 'MT. VERNON, OH';
    storeList['0269'] = 'NEW PHILADELPHIA, OH';
    storeList['0222'] = 'CANTON, OH';
    storeList['1139'] = 'MACEDONIA, OH';
    storeList['1649'] = 'PERRYSBURG, OH';
    storeList['2852'] = 'REYNOLDSBURG, OH';
    storeList['2450'] = 'ROCKY RIVER, OH';
    storeList['0110'] = 'ST. CLAIRSVILLE, OH';
    storeList['0077'] = 'SANDUSKY, OH';
    storeList['2511'] = 'SIDNEY, OH';
    storeList['2853'] = 'S. LEBANON, OH';
    storeList['0455'] = 'BURLINGTON, OH';
    storeList['0453'] = 'SPRINGFIELD, OH';
    storeList['0044'] = 'STEUBENVILLE, OH';
    storeList['0605'] = 'STOW, OH';
    storeList['1606'] = 'STREETSBORO, OH';
    storeList['2339'] = 'STRONGSVILLE, OH';
    storeList['2930'] = 'TIFFIN, OH';
    storeList['1659'] = 'N. TOLEDO, OH';
    storeList['1643'] = 'S.W. TOLEDO, OH';
    storeList['1614'] = 'SYLVANIA TOWNSHIP, OH';
    storeList['0042'] = 'DAYTON-TROTWOOD, OH';
    storeList['1523'] = 'TROY, OH';
    storeList['2213'] = 'WADSWORTH, OH';
    storeList['2978'] = 'WAPAKONETA, OH';
    storeList['0244'] = 'TRUMBULL COUNTY, OH';
    storeList['0203'] = 'DAYTON MALL, OH';
    storeList['2649'] = 'WEST CHESTER, OH';
    storeList['0477'] = 'WHEELERSBURG, OH';
    storeList['1642'] = 'WILLOUGHBY, OH';
    storeList['0298'] = 'WILMINGTON, OH';
    storeList['1696'] = 'WOOSTER, OH';
    storeList['2603'] = 'XENIA, OH';
    storeList['0188'] = 'BOARDMAN, OH';
    storeList['0210'] = 'ZANESVILLE, OH';
    storeList['1749'] = 'ARDMORE, OK';
    storeList['0351'] = 'BARTLESVILLE, OK';
    storeList['1532'] = 'BIXBY, OK';
    storeList['1536'] = 'BROKEN ARROW, OK';
    storeList['1891'] = 'CLAREMORE, OK';
    storeList['2214'] = 'DURANT, OK';
    storeList['2854'] = 'N. EDMOND, OK';
    storeList['1549'] = 'EDMOND, OK';
    storeList['0205'] = 'ENID, OK';
    storeList['1752'] = 'GROVE, OK';
    storeList['1724'] = 'LAWTON, OK';
    storeList['2571'] = 'MCALESTER, OK';
    storeList['2574'] = 'MIDWEST CITY, OK';
    storeList['2655'] = 'MOORE, OK';
    storeList['0124'] = 'MUSKOGEE, OK';
    storeList['2903'] = 'MUSTANG, OK';
    storeList['1165'] = 'NORMAN, OK';
    storeList['2540'] = 'C. OKLAHOMA CITY, OK';
    storeList['0535'] = 'N. OKLAHOMA CITY, OK';
    storeList['0268'] = 'S. OKLAHOMA CITY, OK';
    storeList['1500'] = 'OWASSO, OK';
    storeList['0072'] = 'PONCA CITY, OK';
    storeList['0005'] = 'SHAWNEE, OK';
    storeList['0241'] = 'STILLWATER, OK';
    storeList['1818'] = 'TAHLEQUAH, OK';
    storeList['1580'] = 'TULSA-MIDTOWN, OK';
    storeList['2756'] = 'W. TULSA, OK';
    storeList['0243'] = 'S. TULSA, OK';
    storeList['1134'] = 'YUKON, OK';
    storeList['1690'] = 'BEND, OR';
    storeList['2940'] = 'W. EUGENE, OR';
    storeList['1558'] = 'HILLSBORO, OR';
    storeList['2619'] = 'KEIZER, OR';
    storeList['1693'] = 'MCMINNVILLE, OR';
    storeList['0248'] = 'MEDFORD, OR';
    storeList['1824'] = 'CLACKAMAS COUNTY, OR';
    storeList['2579'] = 'PORTLAND-DELTA PARK, OR';
    storeList['2865'] = 'REDMOND, OR';
    storeList['1741'] = 'ROSEBURG, OR';
    storeList['1600'] = 'SALEM, OR';
    storeList['1108'] = 'TIGARD, OR';
    storeList['1114'] = 'WOOD VILLAGE, OR';
    storeList['0446'] = 'ALTOONA, PA';
    storeList['2405'] = 'AVONDALE, PA';
    storeList['2252'] = 'STROUDSBURG, PA';
    storeList['0120'] = 'BELLE VERNON, PA';
    storeList['2247'] = 'BETHEL PARK, PA';
    storeList['1867'] = 'BETHLEHEM, PA';
    storeList['1868'] = 'BLOOMSBURG, PA';
    storeList['0165'] = 'BUTLER, PA';
    storeList['1710'] = 'CARLISLE, PA';
    storeList['2417'] = 'SCOTT TOWNSHIP, PA';
    storeList['0706'] = 'CHAMBERSBURG, PA';
    storeList['2613'] = 'CLEARFIELD, PA';
    storeList['0653'] = 'CRANBERRY TOWNSHIP, PA';
    storeList['0242'] = 'SCRANTON, PA';
    storeList['1729'] = 'EAST CALN TOWNSHIP, PA';
    storeList['1010'] = 'DU BOIS, PA';
    storeList['1759'] = 'EASTON, PA';
    storeList['2412'] = 'EDWARDSVILLE, PA';
    storeList['2476'] = 'MORGANTOWN, PA';
    storeList['1654'] = 'W. ERIE, PA';
    storeList['0226'] = 'ERIE, PA';
    storeList['2411'] = 'RICHLAND TOWNSHIP, PA';
    storeList['0180'] = 'GREENSBURG, PA';
    storeList['2894'] = 'HAMBURG, PA';
    storeList['0628'] = 'HANOVER, PA';
    storeList['0522'] = 'HARRISBURG, PA';
    storeList['2706'] = 'HATFIELD TOWNSHIP, PA';
    storeList['0139'] = 'HERMITAGE, PA';
    storeList['0197'] = 'INDIANA, PA';
    storeList['0175'] = 'JOHNSTOWN, PA';
    storeList['2687'] = 'E. LANCASTER, PA';
    storeList['1127'] = 'W. LANCASTER, PA';
    storeList['1572'] = 'MIDDLETOWN TOWNSHIP, PA';
    storeList['1669'] = 'MONTGOMERYVILLE, PA';
    storeList['1687'] = 'LATROBE, PA';
    storeList['0022'] = 'LEBANON, PA';
    storeList['2566'] = 'LEHIGHTON, PA';
    storeList['2216'] = 'LEWISTOWN, PA';
    storeList['2893'] = 'MANSFIELD, PA';
    storeList['1952'] = 'MATAMORAS, PA';
    storeList['2223'] = 'MECHANICSBURG, PA';
    storeList['2229'] = 'LOCK HAVEN, PA';
    storeList['0500'] = 'MONACA, PA';
    storeList['1660'] = 'MONROEVILLE, PA';
    storeList['0356'] = 'MONTOURSVILLE, PA';
    storeList['1934'] = 'MT. POCONO, PA';
    storeList['0780'] = 'HOMESTEAD, PA';
    storeList['1130'] = 'UNION TOWNSHIP, PA';
    storeList['1047'] = 'OAKS, PA';
    storeList['2584'] = 'PALMYRA, PA';
    storeList['1848'] = 'N.E. PHILADELPHIA, PA';
    storeList['2378'] = 'W. PHILADELPHIA, PA';
    storeList['2732'] = 'PHILADELPHIA, ARAMINGO AVEN, PA';
    storeList['1849'] = 'S. PHILADELPHIA, PA';
    storeList['3051'] = 'MCCANDLESS TOWNSHIP, PA';
    storeList['1200'] = 'ROBINSON TOWNSHIP, PA';
    storeList['0757'] = 'PLYMOUTH MEETING, PA';
    storeList['1886'] = 'POTTSTOWN, PA';
    storeList['0553'] = 'POTTSVILLE, PA';
    storeList['1667'] = 'QUAKERTOWN, PA';
    storeList['0279'] = 'READING, PA';
    storeList['2819'] = 'EXETER TOWNSHIP, PA';
    storeList['2385'] = 'SAYRE, PA';
    storeList['0644'] = 'SUNBURY, PA';
    storeList['2816'] = 'SHIPPENSBURG, PA';
    storeList['1717'] = 'S. READING, PA';
    storeList['1944'] = 'SOMERSET, PA';
    storeList['2355'] = 'STATE COLLEGE, PA';
    storeList['2219'] = 'N.E. PITTSBURGH, PA';
    storeList['1980'] = 'BENSALEM, PA';
    storeList['0187'] = 'UNIONTOWN, PA';
    storeList['2614'] = 'WARREN, PA';
    storeList['0735'] = 'WARRINGTON, PA';
    storeList['0671'] = 'WASHINGTON, PA';
    storeList['2228'] = 'WAYNESBORO, PA';
    storeList['0292'] = 'HAZLETON, PA';
    storeList['2763'] = 'WHITEHALL TOWNSHIP, PA';
    storeList['0652'] = 'WILKES-BARRE, PA';
    storeList['1837'] = 'UPPER MORELAND, PA';
    storeList['0415'] = 'YORK, PA';
    storeList['2409'] = 'W. YORK, PA';
    storeList['1505'] = 'CRANSTON, RI';
    storeList['2863'] = 'NORTH PROVIDENCE, RI';
    storeList['1197'] = 'WARWICK, RI';
    storeList['2397'] = 'N. WARWICK, RI';
    storeList['1208'] = 'WOONSOCKET, RI';
    storeList['0639'] = 'AIKEN, SC';
    storeList['0728'] = 'ANDERSON, SC';
    storeList['3050'] = 'S. ANDERSON, SC';
    storeList['1521'] = 'BEAUFORT, SC';
    storeList['1533'] = 'BLUFFTON, SC';
    storeList['1986'] = 'BOILING SPRINGS, SC';
    storeList['1751'] = 'CAMDEN, SC';
    storeList['3071'] = 'CLEMSON, SC';
    storeList['0661'] = 'JAMES ISLAND, SC';
    storeList['0655'] = 'W. ASHLEY, SC';
    storeList['2920'] = 'N. YORK COUNTY, SC';
    storeList['1064'] = 'S.E. COLUMBIA, SC';
    storeList['0385'] = 'IRMO, SC';
    storeList['0433'] = 'N.E. COLUMBIA, SC';
    storeList['2356'] = 'RICHLAND COUNTY, SC';
    storeList['3026'] = 'N. RICHLAND COUNTY, SC';
    storeList['1705'] = 'CONWAY, SC';
    storeList['0469'] = 'EASLEY, SC';
    storeList['1120'] = 'FLORENCE, SC';
    storeList['1075'] = 'S. FLORENCE, SC';
    storeList['2442'] = 'FORT MILL, SC';
    storeList['2358'] = 'GAFFNEY, SC';
    storeList['2464'] = 'GOOSE CREEK, SC';
    storeList['1983'] = 'GREENVILLE, SC';
    storeList['1718'] = 'N.W. GREENVILLE, SC';
    storeList['0518'] = 'GREENWOOD, SC';
    storeList['0667'] = 'GREER, SC';
    storeList['2803'] = 'HARTSVILLE, SC';
    storeList['3040'] = 'N. LANCASTER COUNTY, SC';
    storeList['1066'] = 'LEXINGTON, SC';
    storeList['2967'] = 'S.E. LEXINGTON COUNTY, SC';
    storeList['0539'] = 'MT. PLEASANT, SC';
    storeList['0410'] = 'MYRTLE BEACH, SC';
    storeList['1004'] = 'S. MYRTLE BEACH, SC';
    storeList['2520'] = 'NEWBERRY, SC';
    storeList['2207'] = 'N. AUGUSTA, SC';
    storeList['0497'] = 'NORTH CHARLESTON, SC';
    storeList['0603'] = 'NORTH MYRTLE BEACH, SC';
    storeList['0559'] = 'ORANGEBURG, SC';
    storeList['0416'] = 'ROCK HILL, SC';
    storeList['1635'] = 'SENECA, SC';
    storeList['0528'] = 'SIMPSONVILLE, SC';
    storeList['2595'] = 'SPARTANBURG, SC';
    storeList['2548'] = 'E. SPARTANBURG, SC';
    storeList['0358'] = 'SUMMERVILLE, SC';
    storeList['2948'] = 'N.W. CHARLESTON, SC';
    storeList['0626'] = 'SUMTER, SC';
    storeList['0499'] = 'WEST COLUMBIA, SC';
    storeList['1776'] = 'YORK, SC';
    storeList['2435'] = 'BROOKINGS, SD';
    storeList['1634'] = 'RAPID CITY, SD';
    storeList['2466'] = 'SIOUX FALLS, SD';
    storeList['0638'] = 'BLOUNT COUNTY, TN';
    storeList['1196'] = 'ATHENS, TN';
    storeList['1187'] = 'E. BARTLETT, TN';
    storeList['2591'] = 'S. BRISTOL, TN';
    storeList['0425'] = 'CHATTANOOGA, TN';
    storeList['0498'] = 'CLARKSVILLE, TN';
    storeList['3003'] = 'S. CLARKSVILLE, TN';
    storeList['0649'] = 'CLEVELAND, TN';
    storeList['2543'] = 'COLLIERVILLE, TN';
    storeList['0729'] = 'COLUMBIA, TN';
    storeList['0578'] = 'COOKEVILLE, TN';
    storeList['1526'] = 'GERMANTOWN PARKWAY, TN';
    storeList['0548'] = 'CROSSVILLE, TN';
    storeList['2866'] = 'DAYTON, TN';
    storeList['1675'] = 'DICKSON, TN';
    storeList['1731'] = 'DYERSBURG, TN';
    storeList['2509'] = 'ELIZABETHTON, TN';
    storeList['0532'] = 'FRANKLIN, TN';
    storeList['2618'] = 'GALLATIN, TN';
    storeList['1202'] = 'GREENEVILLE, TN';
    storeList['1800'] = 'HARRIMAN, TN';
    storeList['0668'] = 'HENDERSONVILLE, TN';
    storeList['0390'] = 'HERMITAGE, TN';
    storeList['0749'] = 'N. CHATTANOOGA, TN';
    storeList['1893'] = 'S. JACKSON, TN';
    storeList['0496'] = 'JACKSON, TN';
    storeList['2709'] = 'JEFFERSON CITY, TN';
    storeList['0737'] = 'JOHNSON CITY, TN';
    storeList['2993'] = 'JONESBOROUGH, TN';
    storeList['1910'] = 'KIMBALL, TN';
    storeList['0718'] = 'KINGSPORT, TN';
    storeList['2773'] = 'WEST KINGSPORT, TN';
    storeList['0637'] = 'N. KNOXVILLE, TN';
    storeList['2239'] = 'S. KNOXVILLE, TN';
    storeList['0486'] = 'W. KNOXVILLE, TN';
    storeList['1544'] = 'E. KNOXVILLE, TN';
    storeList['2823'] = 'LA FOLLETTE, TN';
    storeList['1692'] = 'LEBANON, TN';
    storeList['0413'] = 'MADISON, TN';
    storeList['1890'] = 'MCMINNVILLE, TN';
    storeList['2237'] = 'MEMPHIS, TN';
    storeList['1163'] = 'S.E. MEMPHIS, TN';
    storeList['2487'] = 'MILAN, TN';
    storeList['1869'] = 'MILLINGTON, TN';
    storeList['0579'] = 'MORRISTOWN, TN';
    storeList['2654'] = 'MT. JULIET, TN';
    storeList['0659'] = 'MURFREESBORO, TN';
    storeList['2851'] = 'N. NASHVILLE, TN';
    storeList['0629'] = 'W. NASHVILLE, TN';
    storeList['2725'] = 'NASHVILLE, TN';
    storeList['2609'] = 'NEWPORT, TN';
    storeList['1789'] = 'PARIS, TN';
    storeList['2218'] = 'SAVANNAH, TN';
    storeList['0693'] = 'SEVIERVILLE, TN';
    storeList['1767'] = 'SHELBYVILLE, TN';
    storeList['1626'] = 'SMYRNA, TN';
    storeList['2474'] = 'SPRING HILL, TN';
    storeList['1747'] = 'SPRINGFIELD, TN';
    storeList['0727'] = 'TULLAHOMA, TN';
    storeList['1704'] = 'UNION CITY, TN';
    storeList['2719'] = 'N. ABILENE, TX';
    storeList['0138'] = 'ABILENE, TX';
    storeList['1199'] = 'ALLEN, TX';
    storeList['0270'] = 'AMARILLO, TX';
    storeList['2801'] = 'N.W. AMARILLO, TX';
    storeList['2506'] = 'ARANSAS PASS, TX';
    storeList['0520'] = 'S. ARLINGTON, TX';
    storeList['0590'] = 'N.W. AUSTIN, TX';
    storeList['0689'] = 'S.E. AUSTIN, TX';
    storeList['2513'] = 'S.W. AUSTIN, TX';
    storeList['1725'] = 'N.E. AUSTIN, TX';
    storeList['1727'] = 'CENTRAL AUSTIN, TX';
    storeList['2840'] = 'BASTROP, TX';
    storeList['0097'] = 'BAYTOWN, TX';
    storeList['0095'] = 'BEAUMONT, TX';
    storeList['1948'] = 'BEE CAVE, TX';
    storeList['2521'] = 'BRENHAM, TX';
    storeList['2669'] = 'BROWNSVILLE, TX';
    storeList['0103'] = 'BRYAN, TX';
    storeList['0514'] = 'BURLESON, TX';
    storeList['0550'] = 'CARROLLTON, TX';
    storeList['2220'] = 'CLEBURNE, TX';
    storeList['3032'] = 'COLLEGE STATION, TX';
    storeList['0232'] = 'CONROE, TX';
    storeList['1515'] = 'THE WOODLANDS, TX';
    storeList['1825'] = 'CORPUS CHRISTI, TX';
    storeList['2371'] = 'CYPRESS, TX';
    storeList['2280'] = 'C. DALLAS, TX';
    storeList['1771'] = 'W. DALLAS, TX';
    storeList['0513'] = 'S.W. DALLAS, TX';
    storeList['1780'] = 'N.E. DALLAS, TX';
    storeList['0515'] = 'N. DALLAS, TX';
    storeList['0665'] = 'W. PLANO, TX';
    storeList['2235'] = 'DECATUR, TX';
    storeList['0183'] = 'DENTON, TX';
    storeList['2798'] = 'EAGLE PASS, TX';
    storeList['2485'] = 'EDINBURG, TX';
    storeList['1152'] = 'W. EL PASO, TX';
    storeList['1137'] = 'N. EL PASO, TX';
    storeList['1146'] = 'E. EL PASO, TX';
    storeList['2928'] = 'FAR EAST EL PASO, TX';
    storeList['2440'] = 'EULESS, TX';
    storeList['2516'] = 'FLOWER MOUND, TX';
    storeList['2441'] = 'FORNEY, TX';
    storeList['1619'] = 'WHITE SETTLEMENT, TX';
    storeList['0525'] = 'S. FT. WORTH, TX';
    storeList['1582'] = 'LAKE WORTH, TX';
    storeList['1059'] = 'FRISCO, TX';
    storeList['2546'] = 'E. FORT WORTH, TX';
    storeList['0611'] = 'GARLAND, TX';
    storeList['2225'] = 'GRANBURY, TX';
    storeList['2646'] = 'GREENVILLE, TX';
    storeList['1801'] = 'GUN BARREL CITY, TX';
    storeList['2468'] = 'HARLINGEN, TX';
    storeList['2559'] = 'HENDERSON, TX';
    storeList['0681'] = 'N. CENTRAL HOUSTON, TX';
    storeList['1145'] = 'E. HOUSTON, TX';
    storeList['1058'] = 'BUNKER HILL, TX';
    storeList['0501'] = 'N.W. HOUSTON, TX';
    storeList['1131'] = 'ROYAL OAKS, TX';
    storeList['1128'] = 'S.E. HOUSTON, TX';
    storeList['0098'] = 'KATY, TX';
    storeList['0555'] = 'W. HOUSTON, TX';
    storeList['1570'] = 'MEYERLAND, TX';
    storeList['1530'] = 'ATASCOCITA, TX';
    storeList['0533'] = 'HURST, TX';
    storeList['2670'] = 'HUTTO, TX';
    storeList['1811'] = 'IRVING, TX';
    storeList['1769'] = 'JASPER, TX';
    storeList['1524'] = 'KELLER, TX';
    storeList['1560'] = 'KERRVILLE, TX';
    storeList['0209'] = 'KILLEEN, TX';
    storeList['1763'] = 'KINGSVILLE, TX';
    storeList['0750'] = 'KINGWOOD, TX';
    storeList['2961'] = 'KYLE, TX';
    storeList['0137'] = 'LAKE JACKSON, TX';
    storeList['1563'] = 'LAREDO, TX';
    storeList['2821'] = 'LEAGUE CITY, TX';
    storeList['2774'] = 'LEANDER, TX';
    storeList['0551'] = 'LEWISVILLE, TX';
    storeList['1965'] = 'LINDALE, TX';
    storeList['2567'] = 'LITTLE ELM, TX';
    storeList['1790'] = 'LIVINGSTON, TX';
    storeList['0519'] = 'LONGVIEW, TX';
    storeList['0271'] = 'LUBBOCK, TX';
    storeList['0082'] = 'LUFKIN, TX';
    storeList['1511'] = 'MANSFIELD, TX';
    storeList['3002'] = 'MARBLE FALLS, TX';
    storeList['1762'] = 'MARSHALL, TX';
    storeList['2656'] = 'N. MCALLEN, TX';
    storeList['2825'] = 'MCKINNEY, TX';
    storeList['2878'] = 'S. MCKINNEY, TX';
    storeList['0510'] = 'MESQUITE, TX';
    storeList['0063'] = 'MIDLAND, TX';
    storeList['3027'] = 'MISSOURI CITY, TX';
    storeList['1802'] = 'MT. PLEASANT, TX';
    storeList['2929'] = 'MURPHY, TX';
    storeList['1772'] = 'NACOGDOCHES, TX';
    storeList['2812'] = 'NEW BRAUNFELS, TX';
    storeList['2962'] = 'ODESSA, TX';
    storeList['1892'] = 'PALESTINE, TX';
    storeList['1053'] = 'PASADENA, TX';
    storeList['0685'] = 'PEARLAND, TX';
    storeList['1702'] = 'PHARR, TX';
    storeList['0505'] = 'E. PLANO, TX';
    storeList['1151'] = 'PORT ARTHUR, TX';
    storeList['2779'] = 'RICHARDSON, TX';
    storeList['0610'] = 'ROCKWALL, TX';
    storeList['1898'] = 'ROSENBERG, TX';
    storeList['0778'] = 'ROUND ROCK, TX';
    storeList['0090'] = 'SAN ANGELO, TX';
    storeList['1645'] = 'N.E. CENTRAL SAN ANTONIO, TX';
    storeList['2789'] = 'S.E. SAN ANTONIO, TX';
    storeList['2786'] = 'S. SAN ANTONIO, TX';
    storeList['1155'] = 'N.W. CENTRAL SAN ANTONIO, TX';
    storeList['1625'] = 'N.E. SAN ANTONIO, TX';
    storeList['1504'] = 'W. SAN ANTONIO, TX';
    storeList['1579'] = 'N. SAN ANTONIO, TX';
    storeList['1088'] = 'N.W. SAN ANTONIO, TX';
    storeList['2898'] = 'ALAMO RANCH, SAN ANTONIO, TX';
    storeList['2480'] = 'SAN ANTONIO, TX';
    storeList['0159'] = 'SAN MARCOS, TX';
    storeList['2824'] = 'SCHERTZ, TX';
    storeList['0127'] = 'SHERMAN, TX';
    storeList['0732'] = 'SOUTHLAKE, TX';
    storeList['2822'] = 'W. SPRING, TX';
    storeList['0563'] = 'SPRING, TX';
    storeList['0511'] = 'SUGAR LAND, TX';
    storeList['1810'] = 'SULPHUR SPRINGS, TX';
    storeList['0221'] = 'TEMPLE, TX';
    storeList['0174'] = 'TEXARKANA, TX';
    storeList['0028'] = 'TEXAS CITY, TX';
    storeList['1052'] = 'TOMBALL, TX';
    storeList['0463'] = 'TYLER, TX';
    storeList['0282'] = 'VICTORIA, TX';
    storeList['0129'] = 'WACO, TX';
    storeList['2601'] = 'WAXAHACHIE, TX';
    storeList['1969'] = 'WEATHERFORD, TX';
    storeList['0651'] = 'BAYBROOK, TX';
    storeList['2980'] = 'WESLACO, TX';
    storeList['0075'] = 'WICHITA FALLS, TX';
    storeList['2845'] = 'CLINTON, UT';
    storeList['0015'] = 'LAYTON, UT';
    storeList['2293'] = 'LEHI, UT';
    storeList['1501'] = 'LOGAN, UT';
    storeList['0342'] = 'MURRAY, UT';
    storeList['2858'] = 'OGDEN, UT';
    storeList['0178'] = 'OREM, UT';
    storeList['1080'] = 'RIVERDALE, UT';
    storeList['2296'] = 'RIVERTON, UT';
    storeList['1118'] = 'ST. GEORGE, UT';
    storeList['2275'] = 'SALT LAKE CITY, UT';
    storeList['2606'] = 'SANDY, UT';
    storeList['2834'] = 'VERNAL, UT';
    storeList['2662'] = 'WEST BOUNTIFUL, UT';
    storeList['1613'] = 'W. JORDAN, UT';
    storeList['1133'] = 'WEST VALLEY CITY, UT';
    storeList['2693'] = 'ESSEX, VT';
    storeList['1913'] = 'SOUTH BURLINGTON, VT';
    storeList['2974'] = 'ABINGDON, VA';
    storeList['0715'] = 'ALEXANDRIA, VA';
    storeList['2809'] = 'BEDFORD, VA';
    storeList['1959'] = 'BLUEFIELD, VA';
    storeList['0456'] = 'BRISTOL, VA';
    storeList['1538'] = 'CHANTILLY, VA';
    storeList['0517'] = 'CHARLOTTESVILLE, VA';
    storeList['0439'] = 'CHESAPEAKE, VA';
    storeList['0709'] = 'W. CHESAPEAKE, VA';
    storeList['0599'] = 'CHESTER, VA';
    storeList['0609'] = 'W. CHESTERFIELD, VA';
    storeList['0447'] = 'CHRISTIANSBURG, VA';
    storeList['1803'] = 'CULPEPER, VA';
    storeList['0787'] = 'DANVILLE, VA';
    storeList['2810'] = 'FARMVILLE, VA';
    storeList['2698'] = 'FRANKLIN, VA';
    storeList['0476'] = 'FREDERICKSBURG, VA';
    storeList['2870'] = 'S. STAFFORD, VA';
    storeList['2623'] = 'SPOTSYLVANIA COUNTY, VA';
    storeList['2555'] = 'FRONT ROYAL, VA';
    storeList['1870'] = 'GAINESVILLE, VA';
    storeList['1072'] = 'GALAX, VA';
    storeList['0687'] = 'SHORT PUMP, VA';
    storeList['1723'] = 'GLOUCESTER, VA';
    storeList['2862'] = 'ZION CROSSROADS, VA';
    storeList['1186'] = 'HAMPTON, VA';
    storeList['0509'] = 'HARRISONBURG, VA';
    storeList['2691'] = 'E. RICHMOND, VA';
    storeList['1528'] = 'LEXINGTON, VA';
    storeList['0437'] = 'LYNCHBURG, VA';
    storeList['1839'] = 'MADISON HEIGHTS, VA';
    storeList['0397'] = 'N. MANASSAS, VA';
    storeList['0707'] = 'MARTINSVILLE, VA';
    storeList['2572'] = 'MECHANICSVILLE, VA';
    storeList['0420'] = 'NEWPORT NEWS, VA';
    storeList['1065'] = 'NORFOLK, VA';
    storeList['1593'] = 'PORTSMOUTH, VA';
    storeList['1838'] = 'CLAYPOOL HILL, VA';
    storeList['2918'] = 'PRINCE GEORGE, VA';
    storeList['2458'] = 'PULASKI COUNTY, VA';
    storeList['1037'] = 'CENTRAL RICHMOND, VA';
    storeList['0676'] = 'S. RICHMOND, VA';
    storeList['0247'] = 'N. RICHMOND, VA';
    storeList['0113'] = 'MIDLOTHIAN, VA';
    storeList['0381'] = 'W. RICHMOND, VA';
    storeList['0419'] = 'ROANOKE, VA';
    storeList['1764'] = 'E. ROANOKE, VA';
    storeList['0664'] = 'S. ROANOKE, VA';
    storeList['2217'] = 'ROCKY MOUNT, VA';
    storeList['2828'] = 'RUCKERSVILLE, VA';
    storeList['2939'] = 'SALEM, VA';
    storeList['1760'] = 'SOUTH BOSTON, VA';
    storeList['1909'] = 'STAFFORD, VA';
    storeList['0646'] = 'STAUNTON, VA';
    storeList['1125'] = 'STERLING, VA';
    storeList['1126'] = 'SUFFOLK, VA';
    storeList['2624'] = 'TAPPAHANNOCK, VA';
    storeList['0086'] = 'VIRGINIA BEACH, VA';
    storeList['1546'] = 'E. VIRGINIA BEACH, VA';
    storeList['2602'] = 'WAYNESBORO, VA';
    storeList['0632'] = 'WILLIAMSBURG, VA';
    storeList['0656'] = 'WINCHESTER, VA';
    storeList['2724'] = 'N. WINCHESTER, VA';
    storeList['1678'] = 'WISE COUNTY, VA';
    storeList['1602'] = 'DALE CITY, VA';
    storeList['2637'] = 'WOODSTOCK, VA';
    storeList['1164'] = 'WYTHEVILLE, VA';
    storeList['0061'] = 'SMOKEY POINT, WA';
    storeList['1089'] = 'AUBURN, WA';
    storeList['0040'] = 'BELLEVUE, WA';
    storeList['1631'] = 'BELLINGHAM, WA';
    storeList['2895'] = 'BONNEY LAKE, WA';
    storeList['1534'] = 'BREMERTON, WA';
    storeList['0149'] = 'EVERETT, WA';
    storeList['2346'] = 'FEDERAL WAY, WA';
    storeList['0140'] = 'ISSAQUAH, WA';
    storeList['0249'] = 'KENNEWICK, WA';
    storeList['2561'] = 'KENT-MIDWAY, WA';
    storeList['2738'] = 'S. LACEY, WA';
    storeList['1081'] = 'LAKEWOOD, WA';
    storeList['1887'] = 'LONGVIEW, WA';
    storeList['0285'] = 'LYNNWOOD, WA';
    storeList['1573'] = 'MILL CREEK, WA';
    storeList['2781'] = 'MONROE, WA';
    storeList['2956'] = 'MOSES LAKE, WA';
    storeList['0035'] = 'MOUNT VERNON, WA';
    storeList['1167'] = 'OLYMPIA, WA';
    storeList['2344'] = 'PASCO, WA';
    storeList['2733'] = 'PORT ORCHARD, WA';
    storeList['2734'] = 'PUYALLUP, WA';
    storeList['2420'] = 'RENTON, WA';
    storeList['0252'] = 'N. SEATTLE, WA';
    storeList['0004'] = 'RAINIER, WA';
    storeList['2746'] = 'SILVERDALE, WA';
    storeList['0206'] = 'SPOKANE, WA';
    storeList['0172'] = 'SPOKANE VALLEY, WA';
    storeList['2793'] = 'E. SPOKANE VALLEY, WA';
    storeList['0026'] = 'TACOMA, WA';
    storeList['0010'] = 'TUKWILA, WA';
    storeList['0160'] = 'UNION GAP, WA';
    storeList['1632'] = 'E. VANCOUVER, WA';
    storeList['2954'] = 'LACAMAS LAKE, WA';
    storeList['0152'] = 'WENATCHEE, WA';
    storeList['0454'] = 'BARBOURSVILLE, WV';
    storeList['1888'] = 'BECKLEY, WV';
    storeList['1805'] = 'BUCKHANNON, WV';
    storeList['0675'] = 'E. CHARLESTON, WV';
    storeList['1641'] = 'CLARKSBURG, WV';
    storeList['0616'] = 'NITRO, WV';
    storeList['2205'] = 'FAYETTEVILLE, WV';
    storeList['2507'] = 'LEWISBURG, WV';
    storeList['0588'] = 'LOGAN, WV';
    storeList['0627'] = 'MARTINSBURG, WV';
    storeList['1671'] = 'S. MORGANTOWN, WV';
    storeList['0567'] = 'MORGANTOWN, WV';
    storeList['2246'] = 'S. PARKERSBURG, WV';
    storeList['1984'] = 'PRINCETON, WV';
    storeList['0746'] = 'S. CHARLESTON, WV';
    storeList['1040'] = 'SUMMERSVILLE, WV';
    storeList['0473'] = 'WOOD COUNTY, WV';
    storeList['2625'] = 'WHEELING, WV';
    storeList['2486'] = 'BUCHANAN, WI';
    storeList['2545'] = 'DELAVAN, WI';
    storeList['2554'] = 'FRANKLIN, WI';
    storeList['2560'] = 'KENOSHA, WI';
    storeList['2206'] = 'MANITOWOC, WI';
    storeList['2308'] = 'OSHKOSH, WI';
    storeList['2586'] = 'PLOVER, WI';
    storeList['2309'] = 'WAUWATOSA, WI';
    storeList['1539'] = 'CHEYENNE, WY';
}


// end of script ....
debug('Lowes price checker script loaded')