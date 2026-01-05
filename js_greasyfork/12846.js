// ==UserScript==
// @name         RothOverview
// @namespace    
// @version      0.72
// @description  Rewrite overview tables : highlight hubs, filter by continent, and troop type. Convert numbers to K(thousand) and M(million)
// @author       Rothman
// @match        http://localhost:8000/troopTable.html
// @match        https://*.crownofthegods.com/overview/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
// @require       http://cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/12846/RothOverview.user.js
// @updateURL https://update.greasyfork.org/scripts/12846/RothOverview.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a major design
    change introduced in GM 1.0.
    It restores the sandbox.
*/
// @grant        none
// ==/UserScript==

/* straight copy from https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js 
 * external sciripts disallowed when publishing
 */

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
 actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
 bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
 iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
        .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey];
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                waitForKeyElements (    selectorTxt,
                                    actionFunction,
                                    bWaitOnce,
                                    iframeSelector
                                   );
            },
                                       300
                                      );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}


var troopTypes = [
    "Guards", "Ballista", "Ranger", "Triari", "Priestess", "Vanquisher", "Sorceror", "Scout", "Arbalist", "Praetor", "Horseman", "Druid", "Senator", "Ram", "Scorpion", "Galley", "Stinger", "Warship"
];

var DataTable={};
var tableCols = 
    {
        "City Overview":  [    "City",    "Reference", "Sorc Tower", "Academy", "Coordinates",    "Wood_Total",    "Wood_Per_Hr",    "Wood_Storage",    "Stone_Total",    "Stone_Per_Hr",    "Stone_Storage", "Iron_Total",    "Iron_Per_Hr",    "Iron_Storage",    "Food_Total",    "Food_Per_Hr",    "Food_Storage", "Carts_Home", "Carts_Total" , "Ships_Home", "Ships_Total"],
        "Troops Overview":[  "City",   "Coordinates", "Wall Lvl", "Spot Time",   "Guards_Home", "Guards_Total", "Ballista_Home", "Ballista_Total", "Ranger_Home", "Ranger_Total","Triari_Home", "Triari_Total", "Priestess_Home", "Priestess_Total", "Vanquisher_Home", "Vanquisher_Total", "Sorceror_Home", "Sorceror_Total", "Scout_Home", "Scout_Total", "Arbalist_Home", "Arbalist_Total", "Praetor_Home", "Praetor_Total", "Horseman_Home", "Horseman_Total", "Druid_Home", "Druid_Total", "Senator_Home", "Senator_Total", "Ram_Home", "Ram_Total", "Scorpion_Home", "Scorpion_Total", "Galley_Home", "Galley_Total", "Stinger_Home", "Stinger_Total", "Warship_Home", "Warship_Total"],
        "Alliance Overview":[],
        "Alliance Cities":[],
        "Incoming attacks":[],
        "Hubs Overview":  [    "City",    "Coordinates",    "Wood_Total",    "Wood_Storage",    "Stone_Total",    "Stone_Storage", "Iron_Total",   "Iron_Storage",    "Food_Total",    "Food_Storage", "Carts_Home", "Carts_Total" , "Ships_Home", "Ships_Total"],
    };

var StorageCols = ["Wood_Storage",    "Stone_Storage", "Iron_Storage",  "Food_Storage"];
var TotalCols = ["Wood_Total",    "Stone_Total", "Iron_Total",  "Food_Total"];

function getTable(page)
{
    // http://stackoverflow.com/questions/2240005/convert-a-html-table-data-into-a-json-object-in-jquery
    var tblHeadings = $('table#tables th').get().map(function(row) {
        return $(row).find('td').get().map(function(cell) {
            return $(cell).html();
        });
    });

    // skip the first 'row' which seems to be a header
    var tbl = $('table#tables tr:nth-child(n+2)').get().map(function(row) {
        return $(row).find('td').get().map(function(cell) {

            // convert comma separated numbers
            var num = $(cell).html().replace(/,/g, "");
            return num;
        });
    });

    var tblObj= {};

    // convert to JSON object
    // this part will be specific for each individual table
    //
    _.each(tbl, function(row) {
        if ( row.length > 0)
        {
            // coordinates are unique even if city name is not
            var coordsCol = _.indexOf(tableCols[page], "Coordinates");
            var k = row[coordsCol]; 

            tblObj[k] = _.object(tableCols[page], row);
        }
    });

    return tblObj;
}

function tableState(troop, cont)
{

    if ((troop === "All") && (cont === "All"))
    {
        $('#chrt_1').show();
        $('#chrt_2').show();
        $('#chrt_3').show();
        $('#tables').show();
        return;
    }
    else {
        // hide system old table, and remove our previous new table
        $('#chrt_1').hide();
        $('#chrt_2').hide();
        $('#chrt_3').hide();
        $('#tables').hide();
    }

    // in all cases remove any table we have created previously.
    $('#newTable').remove();

}

function contMatch(coords)
{
    // read the continent selector
    var cont = $('#contSelect option:selected').text();
    var contRegex = new RegExp(cont, "g");

    if (cont === "All" || coords.match(contRegex) )
    {
        return true;
    }

    return false;
}
var tableHdr = '<table id="newTable" class="table table-striped">';
var tableFooter = '</table>';
var HubLowerLimit = 2000000;

function doTroops ()
{
    var tr;
    var newTable= '';
    var contString;
    troopString = $('#troopSelect option:selected').text();
    contString = $('#contSelect option:selected').text();

    tableState(troopString, contString);

    newTable = newTable.concat(tableHdr);
    newTable = newTable.concat('<tr><th colspan=4>' + troopString + '</th></tr>');
    newTable = newTable.concat('<tr>');
    newTable = newTable.concat("<th>City</th>");
    newTable = newTable.concat("<th>Coordinates</th>");
    newTable = newTable.concat("<th>home</th>");
    newTable = newTable.concat("<th>total</th>");
    newTable = newTable.concat('</tr>');


    _.each(DataTable, function (data, key) 
           {
               var troopTotal = troopString + "_Total";
               var troopHome = troopString + "_Home";

               // selection criteria
               //

               if ( ( troopString === "All" || (data[troopTotal] > 0)) && contMatch(data.Coordinates) ) {
                   newTable = newTable.concat('<tr>');
                   newTable = newTable.concat("<td>" + data.City + "</td>");
                   newTable = newTable.concat("<td>" + data.Coordinates + "</td>");

                   // all troops -> sum up troops home and total
                   // TS or unit count?
                   if (troopString === "All")
                   {
                       console.log("Fix continent filter with troop type All");
                       newTable = newTable.concat("<td>" + "not calclated" + "</td>");
                       newTable = newTable.concat("<td>" + "not calclated" + "</td>");
                   }
                   else
                   {
                       newTable = newTable.concat("<td>" + data[troopHome] + "</td>");
                       newTable = newTable.concat("<td>" + data[troopTotal] + "</td>");
                   }
                   newTable = newTable.concat('</tr>');
               }

           });
    newTable = newTable.concat(tableFooter);
    $('#table').append(newTable);
}


function doHubs ()
{
    var neutral = 'beige';

    var tr;
    var newTable= '';

    tableState("Hubs");

    newTable = newTable.concat(tableHdr);
    newTable = newTable.concat('<tr><th colspan=14>' + 'Hubs' +  '</th></tr>');
    newTable = newTable.concat('<tr>');
    _.each(tableCols["Hubs Overview"], function(hdr)
           {
               newTable = newTable.concat("<th>" + hdr + "</th>");

           });
    newTable = newTable.concat('</tr>');

    _.each(DataTable, function (data, key) 
           {

               // selection criteria
               //
               if ( (data['Wood_Storage'] > HubLowerLimit || data['Stone_Storage'] > HubLowerLimit || data['Iron_Storage'] > HubLowerLimit || data['Food_Storage'] > HubLowerLimit) && contMatch(data.Coordinates) ) {
                   newTable = newTable.concat('<tr>');
                   _.each(tableCols["Hubs Overview"], function(col)
                          {
                              var storageCss= (_.indexOf(StorageCols, col) == -1) ? '': 'class=HubStorage';
                              var totalCss= (_.indexOf(TotalCols, col) == -1) ? '': 'class=HubTotal';
                              newTable = newTable.concat("<td " + storageCss + ">" + data[col] + "</td>");


                          });
                   newTable = newTable.concat('</tr>');
               }
               else
               { 

               }


           });

    newTable = newTable.concat(tableFooter);
    $('#table').append(newTable);

    // heat map for hubs
    // now work on the newly written table
    doHubHeatMap();

}

function toNum()
{
    $( "td:visible" ).each(function( ) {
        // replace comma separators
        $(this).text($(this).text().replace(/,/g, ""));
    });
}


function setKM()
{
    // present all numbers in thousands, or millions
    $( "td:visible" ).each(function( ) {
        if ( $.isNumeric($(this).text()))
        {
            var num = $(this).text();
            if ( num > 1000000 )
            {
                $(this).text( Math.floor(num/1000000) + 'M');
                $(this).css("font-size", "x-large");
            }
            else if ( num > 1000 )
            {
                $(this).text( Math.floor(num/1000) + 'K');
                $(this).css("font-size", "medium");
            }
            else
            {
                $(this).css("font-size", "small");
            }
        }
    });
}

// is value greater than the proportions in the map
// so dark green means almost full, red means less than 10% (0.1)
// these values generated by color brewer
var HeatMapHub = {
    '0.95': '#1a9641',
    '0.60': '#a6d96a',
    '0.30': '#ffffbf',
    '0.10': '#fdae61',
    '0.00': '#a7696c'
    // '0.00': '#d7191c' // this red makes underlying text too difficult to read
};

function heat(heatMap, fullness) {
    var prop=0;
    var found = false;
    prop = _.reduce(_.keys(heatMap), function(memo, proportion) {
        if ((fullness > proportion) && !found) {
            fullness = proportion;
            found=true;  // try to refactor this out
        }
        return fullness;
    }, fullness);

    return heatMap[prop];
}

function doKM(statstable)
{
    toNum();
    setKM();

}

function doHubHeatMap()
{
    var neutral = 'beige';
    var storageIdx = [3,5,7,9];
    var storage = 0;

    toNum();
    // really should use the gt selector to skip the table header rows
    // just doesn't seem to work
    $('#newTable tr').each(function(row) {
        _.each(storageIdx, function(idx) {
            storageEl = $("#newTable tr:eq(" + row + ") td:eq(" + idx + ")");

            storage = parseInt(storageEl.text(), 10);
            if (isNaN(storage)) return true;

            if ( storage > 2000000)
            {
                storageEl.css('background-color', neutral);
                storageEl.css( 'text-decoration', 'underline'); 
                cityEl = $("#newTable tr:eq(" + row + ") td:eq(" + 0 + ")");
                cityEl.css("font-size", "large");
                cityEl.css( 'text-decoration', 'underline'); 

                totalIdx = idx - 1;
                totalEl = $("#newTable tr:eq(" + row + ") td:eq(" + totalIdx + ")");
                fullness = totalEl.text() / storage;

                color = heat(HeatMapHub, fullness);
                $(totalEl).css("background-color", color);	
            }
        });
    });

}

function doFilter()
{
    // must refilter the appropriate table.
    //
    // determine which screen
    var page = $('#subtits').text(); 
    if ( page === "City Overview")
    {
        doHubs();
    }
    else if (page === "Troops Overview")
    {
        doTroops();

    }
}


function doCont()
{

}

var buttonStates = 
    {
        'City Overview':           {'doCont':true, 'doKM':true, 'doHub':true, 'troopSelect':false, 'doFilter':true, 'contSelect':true},
        'Troops Overview':         {'doCont':true, 'doKM':true, 'doHub':false, 'troopSelect':true, 'doFilter':true, 'contSelect':true},
        'Alliance Overview':       {'doCont':false, 'doKM':true, 'doHub':false, 'troopSelect':false, 'doFilter':false, 'contSelect':false},
        'Alliance Cites Overview': {'doCont':false, 'doKM':true, 'doHub':false, 'troopSelect':false, 'doFilter':false, 'contSelect':false},
        'Incoming Overview':       {'doCont':false, 'doKM':false, 'doHub':false, 'troopSelect':false, 'doFilter':false, 'contSelect':false}
    };

function getContinents()
{
    // determine which continents this set of cities represents
    // then set the continent selector to that set
    // current city loc specifier format "C 24 (426:246)" or for single digit continents "C 0 (8:9)"
    var locPatt = /^C\s\d{1,2}\s\(\d{1,3}:\d{1,3}\)$/;
    var contPatt = /^C\s\d{1,2}/;
    var contId = /\d{1,2}/;
    var contVals = _.chain(DataTable)
    .map(_.values)
    .flatten()
    .filter(function(str){ return locPatt.test(str);  })
    .map(function(str) { return str.match(contPatt);})
    .flatten()
    .uniq()
    .sortBy(function(contStr){return parseInt(contStr.match(contId));})
    .value();

    // prepend the list with and All conts selector
    contVals.unshift("All");

    return contVals;

}

// for some reason the waitfor KeyELements calls us 3 times
// fudge it so that the button initialisation only runs once.
var done=false;
var lastPage="";

function setInputs(page)
{
    var formStart= '<form class="form-inline" id="overlay-group1">';
    var formEnd= '</form>';

    var inputGroupStart = '<div class="form-group">';
    var inputGroupEnd = '</div>';
    var inputs="";

    var btnGroupStart='<div class="btn-group btn-group-xs" >';
    var btnGroupEnd='</div>';
    var buttons='';

    var conts = getContinents();
    var currentPage = $('#subtits').text();

    if (!done) {
        var select_id = 1;
        inputs=inputs.concat('<select class="form-control"  data-toggle="tooltip" data-placement="bottom" title="filter by Cont" id="contSelect">');
        _.each(conts, function(cont) {
            inputs=inputs.concat('<option value="' + select_id++ + '">' + cont + '</option>');

        });
        inputs=inputs.concat('</select>');

        select_id = 1;
        inputs=inputs.concat('<select class="form-control" data-toggle="tooltip" data-placement="bottom" title="filter troops" id="troopSelect">');
        inputs=inputs.concat('<option value="' + select_id++ + '">' + 'All' + '</option>');
        _.each(troopTypes, function(type) {
            inputs=inputs.concat('<option value="' + select_id++ + '">' + type + '</option>');
        });
        inputs=inputs.concat('</select>');

        inputs=inputs.concat('<button type="button" class="btn btn-primary" data-toggle="tooltip" data-placement="bottom" title="apply filter" id="doFilter">Filter</button>');


        buttons=buttons.concat('<button type="button" class="btn btn-primary" data-toggle="tooltip" data-placement="bottom" title="highlight >2M" id="doHub">Hub</button>');
        buttons=buttons.concat('<button type="button" class="btn btn-primary" data-toggle="tooltip" data-placement="bottom" title="thousands/millions" id="doKM">KM</button>');

        var r = formStart;
        r = r.concat(inputs);
        r = r.concat(buttons);
        r = r.concat(formEnd);
        $('nav .container-fluid').append(r);

        $('select[name=troopSelect]').val("All");
        $('select[name=contSelect]').val("All");
        //    $('.selectpicker').selectpicker('refresh');

        $("#overlay-group1").css("position", "fixed").css("top", 15).css("right", 100); 

        $('#troopSelect').change(function(){
            // doTroops($(this).val());
        });

        $('#contSelect').change(function(){
            //doCont($(this).val());
        });

        $('#doKM').click(function(){ 
            doKM();
        });
        $('#doHub').click(function(){ 
            doHubs();
        });
        $('#doFilter').click(function(){ 
            doFilter();
        });

        done=true;

    }

    // now enable/disable buttons for specific tabs
    _.each(buttonStates[$('#subtits').text()], function(value, key) {
        $( "#" + key).prop('disabled', !value);
    });

    if (currentPage != lastPage)
    {
        //reset the filters
        $('#contSelect').val(1);
        $('#contSelect').change();
        $('#troopSelect').val(1);
        $('#troopSelect').change();
        lastPage=currentPage;
    }
}

function processPage()
{

    DataTable=getTable($('#subtits').text());
    setInputs($('#subtits').text());
}

waitForKeyElements ("table", processPage, false);


