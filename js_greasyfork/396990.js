// ==UserScript==
// @name         Corona-Virus-Mapping JHU CSSE 2019-nCoV
// @namespace    https://www.arcgis.com
// @version      666.666
// @description  Corona-Virus-Map JHU CSSE 2019-nCoV Erweiterung
// @author       Chillchef
// @match        *.arcgis.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/396990/Corona-Virus-Mapping%20JHU%20CSSE%202019-nCoV.user.js
// @updateURL https://update.greasyfork.org/scripts/396990/Corona-Virus-Mapping%20JHU%20CSSE%202019-nCoV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var h;
    var err = 0;
    var space = "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";

    window.addEventListener('load', function()
    {
        setTimeout(function(){calc();},3000);
    }, false);

    window.addEventListener('click', function()
    {
        setTimeout(function(){calc();},5000);
    }, false);

    function calc()
    {
        try
        {
            if(err < 20)
            {
                   var labels = document.getElementsByClassName("responsive-text-label");
                   console.log(labels);

                   try
                   {
                       h = document.getElementsByClassName("title no-pointer-events text-ellipsis margin-right-half");
                       h[0].textContent = "";
                       h[0].classList.remove("text-ellipsis");
                   }
                   catch(e)
                   {
                       h = document.getElementsByClassName("title no-pointer-events margin-right-half");
                       h[0].textContent = "";
                   }


                   var i = labels[1];
                   var d = labels[7];
                   var r = labels[9];


                   var infect = parseFloat(i.textContent.trim().replace(".","").replace(".","").replace(".",""));
                   var dead = parseFloat(d.textContent.trim().replace(".","").replace(".","").replace(".",""));
                   var recover = parseFloat(r.textContent.trim().replace(".","").replace(".","").replace(".",""));

                   console.log("i:" + infect + "  d:" + dead + "  r:" + recover);

                   var deadP = ((dead * 100)/infect).toFixed(2);
                   var recP = ((recover * 100)/ infect).toFixed(2);
                   var infP = (((infect - dead - recover)*100) / infect).toFixed(2);

                   console.log("i:" + infP + "  d:" + deadP + "  r:" + recP);

                   if((navigator.language || navigator.userLanguage).toUpperCase() === "DE")
                   {
                       h[0].textContent = "Tote:  " + deadP + "%" + space + "Geheilt:  " + recP + "%" + space + "Noch infiziert: " + infP + "%";
                   }
                   else
                   {
                       h[0].textContent = "Death:  " + deadP + "%" + space + "Recovered:  " + recP + "%" + space + "Still infected: " + infP + "%";
                   }
                   //i.textContent = "\n    \n      "+deadP+"\n    \n  ";
                   //window.alert(infect + "\r\n " + dead + ":  " + deadP + "\r\n" + recover + ":  " + recP);


                   err = 0;
            }
        }
        catch(e)
        {
            err++;
            console.log("Scripterr: " + err + "   " );
            console.log(e);
            setTimeout(function(){calc();},3000);
        }
    }
    
})();