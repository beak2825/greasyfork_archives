// ==UserScript==
// @name        Spiceworks
// @namespace   Violentmonkey Scripts
// @match       https://akhost02.wam.co.nz/tickets/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @version     1.0.1
// @author      -
// @description 12-8-2021 08:46:16
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @download https://greasyfork.org/scripts/430978-spiceworks/code/Spiceworks.user.js
// @downloadURL https://update.greasyfork.org/scripts/430978/Spiceworks.user.js
// @updateURL https://update.greasyfork.org/scripts/430978/Spiceworks.meta.js
// ==/UserScript==

function waitForKeyElements (
    selectorTxt,    // Required: The jQuery selector string that
                    //    specifies the desired element(s).
                    //
    actionFunction, // Required: The code to run when elements are
                      //  found. It is passed a jNode to the matched
                     //   element.
                    //
    bWaitOnce,      // Optional: If false, will continue to scan for
                    //    new elements even after the first match is
                      //  found.
                    //
    iframeSelector  // Optional: If set, identifies the iframe to
                    //    search.
                    //
) {
    var targetNodes, btargetsFound;
 
    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);
 
    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        //--- Found target node(s).  Go through each and act if they
         //   are new.
        //
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
        delete controlObj [controlKey]
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


//
// Color code rows
//

waitForKeyElements (
  "tr",
  colorCodeRows
);

var rowCount = 0;
var assigneeColumn = 7;

function colorCodeRows (row)
{
  row = row[0];
    
  if (rowCount == 0 )
  {
    // this is just being a dick so we're just gonna hardcode the assignee column value cause i'm p sure you can't reorder it anyway
    /*
    for( ii in row.childNodes.length)
    {
      console.log(row.childNodes[ii]);
      if (row.childNodes[ii] != undefined && row.childNodes[ii].getAttribute("class") == "column-assignee")
      {
        assigneeColumn = ii;
        console.log(assigneeColumn);
      }
    }
    */
  }
  else if( row.attributes[0].name == "data-id" )
  {
    if( row.childNodes[6].childNodes[1].innerText == SPICEWORKS.app.user.first_name + " " + SPICEWORKS.app.user.last_name )
    {
      row.style.backgroundColor = "rgba(14,209,69,0.2)";
      row.style.color = "rgba(0,0,0,1)";
    }
    else if ( row.childNodes[6].childNodes[1].innerText == "ICT Team" || row.childNodes[6].childNodes[1].innerText == "ICT Support" )
    {
      row.style.backgroundColor = "rgba(255,255,102,0.2)";
      row.style.color = "rgba(0,0,0,1)";
    }
    if( row.childNodes[34].childNodes[0].wholeText.includes("Auckland"))
    {
      // change the location cell color too if it matches at some point
      //row[34].style.backgroundColor = "rgba(100,100,100,0.2)";
    }
  }
  else if( rowCount > 25 )
  {
    console.log('----------------------------');
    console.log(ticketsJSON);
    exit;
  }
  console.log(rowCount);
  rowCount += 1;
}