// ==UserScript==
// @name         instoxlxs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Inpsection request ekranında excel indirir
// @author       Tevfik Bagcivan
// @match        https://b2b.defacto.com.tr/web/Inspection/InspectionRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=defacto.com.tr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458770/instoxlxs.user.js
// @updateURL https://update.greasyfork.org/scripts/458770/instoxlxs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let btn = document.createElement("button");
    btn.innerHTML = "Excel İndir";
    btn.className = 'class="onlyPassed k-button k-button-icontext k-grid-Search';"excelindir";
    btn.id = "excelindir";
    btn.type = "submit";

    document.querySelector("#inspectionHeaderGrid > div.k-header.k-grid-toolbar.k-grid-top").appendChild(btn);

    var instoxlsx = document.createElement('script');
    instoxlsx.setAttribute('src','https://unpkg.com/xlsx@0.15.1/dist/xlsx.full.min.js');
    document.head.appendChild(instoxlsx);

    function html_table_to_excel(type)
    {
        var data = document.querySelector('#inspectionHeaderGrid tbody');
        var column = ["S","h","e","e_1","t","J","S_1"];

        var file = XLSX.utils.table_to_book(data, {sheet: "sheet1",header:column});

        XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });

        XLSX.writeFile(file, 'inspectionsonuc.' + type);
    }

    const export_button = document.getElementById('excelindir');

    export_button.addEventListener('click', () => {
        html_table_to_excel('xlsx');
    });

})();