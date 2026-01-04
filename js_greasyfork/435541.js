// ==UserScript==
// @name        FUTBIN - Vivalemuc autobuyer player list
// @version     1.0.1
// @description Advanced mode from player list
// @license     MIT
// @author      Vivalemuc
// @match       https://www.futbin.com/players*
// @match       https://www.futbin.com/22/players*

// @grant       none
// @namespace https://greasyfork.org/users/839270
// @downloadURL https://update.greasyfork.org/scripts/435541/FUTBIN%20-%20Vivalemuc%20autobuyer%20player%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/435541/FUTBIN%20-%20Vivalemuc%20autobuyer%20player%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a = document.createElement('button');
     // Create the text node for anchor element.
    var link = document.createTextNode("PS advanced");
    // Append the text node to anchor element.
    a.appendChild(link);
    a.setAttribute('onclick','createCsv("PS");'); // for FF
    a.onclick = function() {createCsv("PS");}; // for IE
    a.setAttribute('class','btn-csv btn btn-sm btn-primary submit-comment waves-effect waves-light float-right');
    $('.row.mb-2')[0].appendChild(a);


    var aX = document.createElement('button');
     // Create the text node for anchor element.
    var linkX = document.createTextNode("XB advanced");
    // Append the text node to anchor element.
    aX.appendChild(linkX);
    aX.setAttribute('onclick','createCsv("XB");'); // for FF
    aX.onclick = function() {createCsv("XB");}; // for IE
    aX.setAttribute('class','btn-csv btn btn-sm btn-primary submit-comment waves-effect waves-light float-right');
    $('.row.mb-2')[0].appendChild(aX);

    var aP = document.createElement('button');
    // Create the text node for anchor element.
    var linkP = document.createTextNode("PC advanced");
    // Append the text node to anchor element.
    aP.appendChild(linkP);
    aP.setAttribute('onclick','createCsv("PC");'); // for FF
    aP.onclick = function() {createCsv("PC");}; // for IE
    aP.setAttribute('class','btn-csv btn btn-sm btn-primary submit-comment waves-effect waves-light float-right');
    $('.row.mb-2')[0].appendChild(aP);

       function createCsv(platform){
        const queryString =window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const page = urlParams.get('page')
        var ids = "";

        var rows = $(".table.table-bordered.table-hover tbody").find('tr').each(function( index ) {
            ids+=$($(this)[0]).find('.player_name_players_table')[0].dataset.siteId;
            ids+=",";
        });

           var futbinIds = ids.slice(0, -1);

        var link = document.createElement('a');
        link.id = 'getAdvanced-'+platform+'-'+Date.now();

        link.setAttribute('target', '_blank');
        link.setAttribute('href', 'https://vivalemuc.vercel.app/api/futbinInfo?futbinId='+futbinIds+'&platform='+platform);
        document.body.appendChild(link);
        document.querySelector('#'+link.id).click();

    }

})();