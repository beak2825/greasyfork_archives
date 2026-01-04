// ==UserScript==
// @name         Astre V7
// @namespace    astrev7
// @icon         https://www.gfi.world/favicon.ico
// @version      0.4
// @description  Améliorations de la nouvelle interface graphique du logiciel Astre V.7
// @author       MARIN Jean-Christophe
// @match        http://sgrus1.intranet:7001/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377061/Astre%20V7.user.js
// @updateURL https://update.greasyfork.org/scripts/377061/Astre%20V7.meta.js
// ==/UserScript==
(function()
{
        setTimeout(function()
        {
            var tab = document.getElementsByClassName('expandable');
            console.log(tab);

            var tabElementClick = Array();
            if (tab.length>0)
            {
                for (var k = 0; k < tab.length; k++)
                {
                    console.log('k='+k+' => id='+ tab[k].getAttribute('id'));
                    eval(tab[k].getAttribute('onclick'));
                    tabElementClick.push(tab[k].firstChild);
                }
            }

            for (k = 0; k < tabElementClick.length; k++)
            {
                console.log('Click on'+tabElementClick[k]);
                tabElementClick[k].click();
            }


            if (document.getElementById('boutonMenuFavori') != null)
            {
                document.getElementById('textHeadLogo').innerHTML = 'Astre <sup class="textHeadLogoSup">GF <span style=\'color: #ff9933 !important;\'>TAW</span></sup>';
                document.getElementById('textHeadLogo').innerHTML += '<style>.itemMenuFavori{opacity:0.8;}.itemMenuFavori a {color: #ff9933 !important;}</style>';
                deploieMenuFavori();
            }
        }, 500);
})();