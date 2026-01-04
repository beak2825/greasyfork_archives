// ==UserScript==
// @name         Sort Filelist
// @namespace    Sort Filelist
// @version      0.3
// @description  Sorts Filelist by size
// @author       Conkuist
// @match        https://www.empornium.sx/torrents.php?id=*
// @match        https://www.empornium.is/torrents.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433038/Sort%20Filelist.user.js
// @updateURL https://update.greasyfork.org/scripts/433038/Sort%20Filelist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const filelist_table = document.querySelector(`#content #details_top .torrent_table div[id^="files"] table tbody`);

    if(filelist_table)
    {
        const filelist_table_rows = filelist_table.querySelectorAll(`tr:not(.smallhead,.rowa)`);

        if(filelist_table_rows)
        {

            Array.from(filelist_table_rows).sort(function(a,b)
            {
                return GetSize(b) - GetSize(a);
            }
            ).forEach(function(e)
            {
                filelist_table.appendChild(e);
            }
            );
        }
    }

    function GetSize(e)
    {
        const cell = e.querySelector("td:last-child");

        if(cell)
        {
            const file_size = cell.innerHTML;
            return ParseSize(file_size);
        }

        return 0;
    }

    function ParseSize(string)
    {
        const parts = string.split(" ");

        if(parts.length > 1)
        {
            const number = parseFloat(parts[0]);

            if(isNaN(number))
            {
                return 0;
            }

            switch(parts[1])
            {
                case "KiB":
                    return number * Math.pow(1024,1);
                case "MiB":
                    return number * Math.pow(1024,2);
                case "GiB":
                    return number * Math.pow(1024,3);
                case "TiB":
                    return number * Math.pow(1024,4);
                default:
                    return number;
            }
        }

        return 0;
    }
})();