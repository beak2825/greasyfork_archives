// ==UserScript==
// @name         Hide bolds
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Hides bolds on RYM
// @author       You
// @match        https://rateyourmusic.com/artist/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/420996/Hide%20bolds.user.js
// @updateURL https://update.greasyfork.org/scripts/420996/Hide%20bolds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function doHideBolds(init)
    {
        if(!init && document.getElementsByClassName("loading_disco").length > 0)
        {
            setTimeout(doHideBolds, 50, false);
        }
        var discog = document.getElementsByClassName("disco_mainline");
        for(var i=0; i<discog.length; i++)
        {
            if(discog[i].children[0].title == "Recommended")
            {
                var inner = discog[i].innerHTML;
                var innerp = inner.split(">");

                discog[i].innerHTML = innerp[1] + ">" + innerp[2] + ">";
            }
        }
    }

    //document.children[0].style.display = "none";
    window.onload = function()
    {
        doHideBolds(true);
        window.doHideBolds = doHideBolds;

        var disco_expand_link = document.getElementsByClassName("disco_expand_section_link");
        for(let i=0;i<disco_expand_link.length;i++)
        {
            let outh = disco_expand_link[i].outerHTML;
            outh = outh.replace(";\"", ";doHideBolds(false);\"");
            disco_expand_link[i].outerHTML = outh;
        }

        var disco_expand = document.getElementsByClassName("disco_expand_section_btn");
        for(let i=0;i<disco_expand.length;i++)
        {
            let outh = disco_expand[i].outerHTML;
            outh = outh.replace(";\"", ";doHideBolds(false);\"");
            disco_expand[i].outerHTML = outh;
        }


        //document.children[0].style.display = "block";
    };
})();