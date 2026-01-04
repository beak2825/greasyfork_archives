// ==UserScript==
// @name         Megagroup Scrappy Extension
// @namespace    http://tampermonkey.net/
// @version      1.0.1.1
// @description  Облегчаем сборку заказов на сайте megagroup.ru!
// @author       DIMASSS
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        https://cp21.megagroup.ru/my/s3/data/menu/edit.php*
// @downloadURL https://update.greasyfork.org/scripts/395378/Megagroup%20Scrappy%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/395378/Megagroup%20Scrappy%20Extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
  function waitForKeyElements(
    selectorTxt /* Required: The jQuery selector string that
                          specifies the desired element(s).
                      */,
    actionFunction /* Required: The code to run when elements are
                          found. It is passed a jNode to the matched
                          element.
                      */,
    bWaitOnce /* Optional: If false, will continue to scan for
                          new elements even after the first match is
                          found.
                      */,
    iframeSelector /* Optional: If set, identifies the iframe to
                          search.
                      */
  ) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
    else
      targetNodes = $(iframeSelector)
        .contents()
        .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
      btargetsFound = true;
      /*--- Found target node(s).  Go through each and act if they
              are new.
          */
      targetNodes.each(function() {
        var jThis = $(this);
        var alreadyFound = jThis.data("alreadyFound") || false;

        if (!alreadyFound) {
          //--- Call the payload function.
          var cancelFound = actionFunction(jThis);
          if (cancelFound) btargetsFound = false;
          else jThis.data("alreadyFound", true);
        }
      });
    } else {
      btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
      //--- The only condition where we need to clear the timer.
      clearInterval(timeControl);
      delete controlObj[controlKey];
    } else {
      //--- Set a timer, if needed.
      if (!timeControl) {
        timeControl = setInterval(function() {
          waitForKeyElements(
            selectorTxt,
            actionFunction,
            bWaitOnce,
            iframeSelector
          );
        }, 300);
        controlObj[controlKey] = timeControl;
      }
    }
    waitForKeyElements.controlObj = controlObj;
  }    
    
    
    // Your code here...

    //-------


var debug = 0;
var index = 0;
var values="";
var selected_values="";
var tbodyRowCount = 0;

//KOPIRUEM NOMER ZAKAZA
    waitForKeyElements ("#ajaxPopupWindow_0 > div > table > tbody > tr:nth-child(1) > td.draggable_title > span", copyNomerZakaza);

    function copyNomerZakaza (jNode) {

     jNode.parent().css ("background", "#F3E2E0"); // example
        var number = jNode.text();
        number=number.substring(7, number.indexOf("(") );
    navigator.clipboard.writeText(number);
values="";
    }

//copy all section
waitForKeyElements ("#order-products-table", copyAll);

function copyAll(jNode)
    {
if( debug)  { console.log("copyAll function called"); }

//document.getElementById("myTable").rows[0].cells[0].innerHTML
var table = document.querySelector("#order-products-table");
 tbodyRowCount = table.tBodies[0].rows.length;

if( debug)  { console.log("copyAll: table got"); }
        var i;
for (i = 1; i <= tbodyRowCount; i++) {

if (table.rows[i].cells[8].innerText != '1.00')
{
    table.rows[i].cells[8].style.color = "#F0EDD5";
    table.rows[i].cells[8].style.background = "#6D7CD1";
    table.rows[i].cells[8].style.fontweight = "900";

}
}
if( debug)  { console.log("copyAll: passed amount check"); }


var button_all = document.createElement("button");
button_all.innerHTML = 'copy All';
button_all.setAttribute("class", "s3-btn without-margin prn-hidden" );
jNode.after(button_all);
if( debug)  { console.log("copyAll: button created"); }




 button_all.addEventListener ("click", function() {
//jNode.parent().css ("background", "#FFE7D1"); // example
//console.log('values index of quote: ' + values.indexOf("]"));
if( debug)  { console.log("copyAll -> button_all -> click:"); }
values="[ all ] ";

var i;
for (i = 1; i <= tbodyRowCount; i++) {
if( debug)  { console.log("copyAll -> button_all -> click: parsing table row ( " + i + " ), "+table.rows[i].cells[2].innerText); }
//if (table.rows[i].cells[8].innerText != '1.00')
//{
//    table.rows[i].cells[8].style.background = "#9E3D0D";
//}
table.rows[i].style.background="#FFE7D1";
  var pol;

    if (table.rows[i].cells[4].outerText.length > 5 )
    { pol = '(' + table.rows[i].cells[4].outerText.substring(5, table.rows[i].cells[4].innerText.indexOf('\n')) + ')';

    }
var pre_val = table.rows[i].cells[2].innerText + ' ' + pol ;
    pre_val=pre_val.replace(/(\r\n|\n|\r)/gm,"");
    pre_val=pre_val.replace('-',"");
pre_val=pre_val.replace('  '," ");
    pre_val+= ' - ' + table.rows[i].cells[8].innerText.substring(0,table.rows[i].cells[8].innerText.indexOf('.'))
pre_val=pre_val.replace(/(\r\n|\n|\r)/gm,"");
  values += '\r\n' + pre_val ;
}

//alert(values);

values = values.replace("undefined", "");
if( debug)  { console.log("copyAll -> button_all -> click: passing to clipboard "); }
if( debug)  { console.log(values.replace("copy", "")); }


navigator.clipboard.writeText(values.replace("copy", ""));
     if( debug)  { console.log("copyAll -> button_all -> click: finish!"); }
 });





    }

//KOPIRUEM TOVAR PO ODNOMY

waitForKeyElements (".actions", actionFunction);


    function actionFunction (jNode) {
    if (tbodyRowCount > 1 )
    {
   var button = document.createElement("button");

  button.innerHTML = 'copy';
        index++;

button.setAttribute("class", "s3-btn without-margin prn-hidden" );
jNode.append (button);

button.addEventListener ("click", function() {

jNode.parent().css ("background", "#FFE7D1"); // example



jNode.parent().each(function( index  ) {

selected_values=$( this ).text();
});



selected_values=selected_values.replace("        ","");
selected_values=selected_values.replace(/(\r\n|\n|\r)/gm,"");
selected_values=selected_values.replace("Пол:							","Пол: ");
    selected_values = selected_values.replace("undefined", "");
navigator.clipboard.writeText(selected_values.replace("copy", ""));

  });



    }}
    //------
})();