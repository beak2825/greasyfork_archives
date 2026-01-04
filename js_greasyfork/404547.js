// ==UserScript==
// @name         filter_patches
// @namespace    https://greasyfork.org/users/577497
// @version      1.1
// @description  Parses patch JSON and displays only owned titles
// @author       Glenugie
// @match        http://tinfoil.media/repo/db/versions.json
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404547/filter_patches.user.js
// @updateURL https://update.greasyfork.org/scripts/404547/filter_patches.meta.js
// ==/UserScript==

// Set the titles you're interested in tracking here
var titles = {
    "01006F8002326000": "Animal Crossing: New Horizons",
    "0100000000010000": "Super Mario Odyssey",
    "01007EF00011E000": "Legend of Zelda: Breath of the Wild"
};



// Below function adapted from w3schools: https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("patchTable");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            var xComp = x.innerHTML.toLowerCase(); if (xComp == "unknown (v0)") { xComp = "0";}
            y = rows[i + 1].getElementsByTagName("TD")[n];
            var yComp = y.innerHTML.toLowerCase(); if (yComp == "unknown (v0)") { yComp = "0";}
            if (dir == "asc") {
                if (xComp > yComp) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (xComp < yComp) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

(function() {

    var bodyElement = document.getElementsByTagName("body")[0];
    var jsonElement = document.getElementsByTagName("pre")[0];
    var jsonTextContent = jsonElement.innerHTML;
    var jsonContent = JSON.parse(jsonTextContent);
    var newContent = "";

    for (var t in titles) {
        var tmp = jsonContent[t.toLowerCase()];
        var title = titles[t];

        var latestP = ""
        var latestId = 0
        var pCount = 0;
        for (var p in tmp) {
            if (p > latestId) {
                latestId = p
                latestP = tmp[p]
            }
            pCount += 1;
        }
        if (latestP == "") { latestP = "Unknown";}

        newContent += "<tr><td>"+title+"</td><td>"+latestP+" (v"+pCount+")</td></tr>";
    }

    bodyElement.innerHTML = "<div align=center><table id=patchTable cellpadding=10 border=1><tr><th>Title</th><th>Last Patch</th></tr>"+newContent+"</table></div><hr>"+bodyElement.innerHTML;
    sortTable(1);
    sortTable(1);
})();