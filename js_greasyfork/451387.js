// ==UserScript==
// @name                     Google Classroom Search
// @description              Search for classes in 𝗚𝗼𝗼𝗴𝗹𝗲 𝗖𝗹𝗮𝘀𝘀𝗿𝗼𝗼𝗺.
// @iconURL                  https://ssl.gstatic.com/classroom/favicon.png
// @version                  0.2
// @match                    https://classroom.google.com/*
// @noframes
// @namespace                GCS
// @homepageURL              https://greasyfork.org/en/scripts/451387-google-classroom-search
// @supportURL               https://greasyfork.org/en/scripts/451387-google-classroom-search
// @author                   CarlesV
// @developer                CarlesV
// @copyright                2022, CarlesV
// @license                  MIT
// @grant                    none
// @downloadURL https://update.greasyfork.org/scripts/451387/Google%20Classroom%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/451387/Google%20Classroom%20Search.meta.js
// ==/UserScript==

var text_anterior=null;
var debug=true;

(function() {
    'use strict';

    // Your code here...

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function reset_gcs()
{
    var lis = document.querySelectorAll("li a div");
    if (debug)
        console.log(lis.length);
    for(var i=0;i<lis.length;i=i+2)
    {
        lis[i].parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "block";
    }
}

function search_gcs(text_buscar)
{
       var lis = document.querySelectorAll("li a div");
       if (debug)
           console.log(lis.length);
       for(var i=0;i<lis.length;i=i+2)
       {
           var text = lis[i].innerText;
           var text2 = lis[i+1].innerText;
           if (debug)
               console.log(text + " | " + text2);
           text = text.normalize('NFD').replace(/\p{Diacritic}/gu, "").toLowerCase();
           text2 = text2.normalize('NFD').replace(/\p{Diacritic}/gu, "").toLowerCase();
           text_buscar = text_buscar.normalize('NFD').replace(/\p{Diacritic}/gu, "").toLowerCase();

           if (text.search(text_buscar)==-1 && text2.search(text_buscar)==-1)
           {
               if (debug)
                   console.log("Borro")
               lis[i].parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";
           }
           else
           {
               lis[i].parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "block";
           }
       }
}
function gcs_change()
{
    if (debug)
        console.log("edittttttttttttttttttttttttttt");
    var text_buscar = document.getElementById("GCS").value;
    if (text_buscar==text_anterior)
    {
        return;
    }
    text_anterior=text_buscar;
    if (text_buscar=="")
    {
        reset_gcs();
    }
    else
    {
        search_gcs(text_buscar);
    }
}

   if (debug)
       console.log("Helloooooooooooooooooooooooooooooooo");

   window.setTimeout(function(){
       if (debug)
           console.log("Helloooooooooooooooooooooooooooooooo222222222222");

       if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
           window.trustedTypes.createPolicy('default', {
               createHTML: string => string
               // Optional, only needed for script (url) tags
               //,createScriptURL: string => string
               //,createScript: string => string,
           });
       }

       var titol = document.querySelector("nav h1");
       titol.insertAdjacentHTML('afterend', '<input type="text" id="GCS" onchange="console.log(\"inline\");gcs_change()">');


       /*
       var escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {createHTML: (to_escape) => to_escape})
       escapeHTMLPolicy.createHTML("<h1>your_html</h1>");

       titol.insertAdjacentHTML('afterend', escapeHTMLPolicy);
       */

       //search_gcs("Tecno");
       setInterval(function(){
           gcs_change();
       },500);

   }, 2000);

    return;
})();