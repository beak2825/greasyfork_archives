// ==UserScript==
// @name         ONVISTA.ORG
// @namespace    http*://www.onvista.de/*
// @include      http*://*.onvista.*/**
// @version      0.2
// @description  OnVista Layout, reduzierte Werbung
// @author       chillchef
// @match        http*://onvista.*/*
// @match        http*://www.onvista.*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/395803/ONVISTAORG.user.js
// @updateURL https://update.greasyfork.org/scripts/395803/ONVISTAORG.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("START TAMPERMONKEY SCRIPT");

    var d = document;
    var hBckup = new Object();

    var classesToHide = new Object();
    classesToHide[0] = "SKYSCRAPER";
    classesToHide[1] = "Ads_OV_SKY";
    classesToHide[2] = "SMART_BILLBOARD";
    classesToHide[3] = "CONTENT_AD";
    classesToHide[4] = "FOOTER_BANNER";
    classesToHide[5] = "NEWS_TEASERBOX ARTIKEL onvista";
    classesToHide[6] = "hubspot-messages-iframe-container";
    


    window.addEventListener('load', function()
    {
        setTimeout(function(){hideClasses(true);},3000);
    }, false);
    
    editStyle("ONVISTA","95%");

    function hideClasses(hide)
    {
        for(var v in classesToHide)
        {
            hideClass(classesToHide[v], hide);
        }
    }

    function hideClass(clsName, hide)
    {
        try
        {
            var sichtbarkeit = hide ? 'hidden' : 'visible';
            var ga = d.getElementsByClassName(clsName);


            if(ga !== null)
            {
                console.log("hideClasse Start: " + clsName);
                console.log(ga);
                for(var v in ga)
                {
                    if(ga[v].id !== undefined)
                    {
                        ga[v].style.visibility = sichtbarkeit;
                        if(hide === true)
                        {
                            if (hBckup[ga[v].id] === undefined) { hBckup[ga[v].id] = ga[v].style.height;}
                            ga[v].style.height = '0px';
                        }
                        else
                        {
                            if (hBckup[ga[v].id] !== undefined) { ga[v].style.height = hBckup[ga[v].id]}
                        }
                    }
                    try
                    {
                        ga[v].style.visibility = sichtbarkeit;
                        ga[v].style.height = '0px';
                    }
                    catch(e)
                    {

                    }
                }
            }


            try
            {
                var o = d.getElementById(clsName);
                o.style.height = '0px';
                o.style.visibility = sichtbarkeit;

            }catch(e){}

            try
            {
                var ga2 = d.getElementById(clsName);
                for(var v2 in ga2)
                {
                    try
                    {
                        ga2[v2].style = sichtbarkeit;
                    }
                    catch(e)
                    {
                    }
                }
            }
            catch(e)
            {
            }
        }
        catch(e)
        {
            window.alert("DiBa-Script-Hide-Class-Fehler: " + clsName + ": " + e.message);
            window.console.log("Fehler: " + e.message + " !!!");
            console.log(e);
        }
    }

    function editStyle(clsName, clsWidth)
    {
        try
             {
                 var c = d.getElementById(clsName);
                 c.style.width = clsWidth;
             }
             catch(ex)
             {
             }
    }

})();
