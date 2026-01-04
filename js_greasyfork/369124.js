// ==UserScript==
// @name         Kinderschokolade - limited-star-edition
// @version      0.1
// @description  Kleine Hilfe für das Kinderschokolade Gewinnspiel
// @author       rabe85
// @match        https://www.kinderschokolade.de/limited-star-edition
// @grant        none
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/369124/Kinderschokolade%20-%20limited-star-edition.user.js
// @updateURL https://update.greasyfork.org/scripts/369124/Kinderschokolade%20-%20limited-star-edition.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function kinderschokolade() {

        // Kindergesichter im mitlaufenden Header anzeigen
        var insert = "";
        var header0 = document.getElementsByClassName('container-fluid');
        for(var h = 0, header; !!(header=header0[h]); h++) {
            insert += "<div style='display: grid; grid-template-rows: 85px 20px; grid-template-columns: 7.69% 7.69% 7.69% 7.69% 7.69% 7.69% 7.69% 7.69% 7.69% 7.69% 7.69% 7.69% 7.69%; height: 115px; align: center; background-color: #ee3224; padding-top: 5px;'>";
            insert += "<div style='grid-column-start: 1; grid-column-end: 2; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/Boateng.png' height='80px' width='80px' title='Boateng' alt='Boateng'></div>";
            insert += "<div style='grid-column-start: 2; grid-column-end: 3; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/Draxler.png' height='80px' width='80px' title='Draxler' alt='Draxler'></div>";
            insert += "<div style='grid-column-start: 3; grid-column-end: 4; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/Gomez.png' height='80px' width='80px' title='Gómez' alt='Gómez'></div>";
            insert += "<div style='grid-column-start: 4; grid-column-end: 5; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/Goretzka.png' height='80px' width='80px' title='Goretzka' alt='Goretzka'></div>";
            insert += "<div style='grid-column-start: 5; grid-column-end: 6; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/Hector.png' height='80px' width='80px' title='Hector' alt='Hector'></div>";
            insert += "<div style='grid-column-start: 6; grid-column-end: 7; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/Hummels.png' height='80px' width='80px' title='Hummels' alt='Hummels'></div>";
            insert += "<div style='grid-column-start: 7; grid-column-end: 8; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/Khedira.png' height='80px' width='80px' title='Khedira' alt='Khedira'></div>";
            insert += "<div style='grid-column-start: 8; grid-column-end: 9; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/Kimmich.png' height='80px' width='80px' title='Kimmich' alt='Kimmich'></div>";
            insert += "<div style='grid-column-start: 9; grid-column-end: 10; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/Kroos.png' height='80px' width='80px' title='Kroos' alt='Kroos'></div>";
            insert += "<div style='grid-column-start: 10; grid-column-end: 11; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/Loew.png' height='80px' width='80px' title='Löw' alt='Löw'></div>";
            insert += "<div style='grid-column-start: 11; grid-column-end: 12; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/Oezil.png' height='80px' width='80px' title='Özil' alt='Özil'></div>";
            insert += "<div style='grid-column-start: 12; grid-column-end: 13; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/ter_Stegen.png' height='80px' width='80px' title='ter Stegen' alt='ter Stegen'></div>";
            insert += "<div style='grid-column-start: 13; grid-column-end: 14; grid-row-start: 1; grid-row-end: 2;'><img src='https://www.otb-server.de/kinderschokolade/limited-star-edition/Trapp.png' height='80px' width='80px' title='Trapp' alt='Trapp'></div>";
            insert += "<div style='grid-column-start: 1; grid-column-end: 2; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>Boateng</div>";
            insert += "<div style='grid-column-start: 2; grid-column-end: 3; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>Draxler</div>";
            insert += "<div style='grid-column-start: 3; grid-column-end: 4; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>Gómez</div>";
            insert += "<div style='grid-column-start: 4; grid-column-end: 5; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>Goretzka</div>";
            insert += "<div style='grid-column-start: 5; grid-column-end: 6; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>Hector</div>";
            insert += "<div style='grid-column-start: 6; grid-column-end: 7; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>Hummels</div>";
            insert += "<div style='grid-column-start: 7; grid-column-end: 8; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>Khedira</div>";
            insert += "<div style='grid-column-start: 8; grid-column-end: 9; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>Kimmich</div>";
            insert += "<div style='grid-column-start: 9; grid-column-end: 10; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>Kroos</div>";
            insert += "<div style='grid-column-start: 10; grid-column-end: 11; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>Löw</div>";
            insert += "<div style='grid-column-start: 11; grid-column-end: 12; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>Özil</div>";
            insert += "<div style='grid-column-start: 12; grid-column-end: 13; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>ter Stegen</div>";
            insert += "<div style='grid-column-start: 13; grid-column-end: 14; grid-row-start: 2; grid-row-end: 3; font-size: medium; color: whitesmoke;'>Trapp</div>";
            insert += "</div>";
            header.innerHTML = insert;
        }


    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        kinderschokolade();
    } else {
        document.addEventListener("DOMContentLoaded", kinderschokolade, false);
    }

})();