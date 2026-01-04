// ==UserScript==
// @name         Paraulogic
// @namespace    paraulogic-carles
// @homepageURL  https://greasyfork.org/en/scripts/437767-paraulogic
// @version      0.2
// @description  Mostra la puntuació que portes al joc Paraulogic
// @author       CarlesV
// @match        https://paraulogic.rodamots.cat/
// @icon         https://paraulogic.rodamots.cat/favicon.ico
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437767/Paraulogic.user.js
// @updateURL https://update.greasyfork.org/scripts/437767/Paraulogic.meta.js
// ==/UserScript==

var lletres;
var found=0;

function puntuar_paraula(paraula)
{
    var punts=0;
    //Trec accents
    paraula = paraula.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    var e = paraula.indexOf(" ");
    if (e>-1)
    {
        paraula=paraula.substring(0,e);
    }

    //punts per longitud
    switch(paraula.length)
    {
       case 3: punts=1; break;
       case 4: punts=2; break;
       default: punts=paraula.length;
    }
    //punts per 'tuti'
    var error=false;
    for(var x=0;x<7;x++)
    {
       if (paraula.indexOf(lletres[x])==-1)
       {
          error=true;
          break;
       }
    }
    if (!error)
    {
        punts=punts+10;
    }
    console.log(paraula + " " + punts);
    return punts;
}

function puntuar_tauler()
{
   var total=0;
   $("#discovered-text .show-def").each(function(index){
        //console.log( index + ": " + $(this).text() );
       total = total + puntuar_paraula($(this).text());
     });
    if (total==1)
      $("#score").html("<b>" + total + "</b> punt");
    else
      $("#score").html("<b>" + total + "</b> punts");
}

function ini()
{
    lletres=[];
    $(".hex-link p").each(function(index){
        //console.log( index + ": " + $(this).html() );
        if ($(this).html().length>0)
        {
          lletres.push($(this).html());
        }
    });
    if (lletres.length<7)
    {
       setTimeout(ini,500);
       return 0;
    }
    console.log(lletres);

    puntuar_tauler();

    found = parseInt($("#letters-found").text());

    $(document).bind('DOMSubtreeModified', function () {
        var actuals = parseInt($("#letters-found").text());
        if (actuals>found)
        {
            found=actuals;
            puntuar_tauler();
            //console.log( "Handler for .change() called. " + found );
        }
    });
}

(function() {
    'use strict';

    // Your code here...
    lletres=[];
    setTimeout(ini,500);

})();