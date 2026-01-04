// ==UserScript==
// @namespace     http://www.fuzzwahracing.com/p/results-highlighter.html
// @name          iRacing My Results Highlighter
// @description   Highlights the rows of your entries in the iRacing event results table
// @include       *://members.iracing.com/membersite/member/EventResult.do*
// @version       1.20.03.19.02
// @author        fuzzwah
// @copyright     2018+, fuzzwah (https://github.com/fuzzwah)
// @license       MIT; https://raw.githubusercontent.com/fuzzwah/iRacing-My-Results-Highlighter/master/LICENSE
// @homepageURL   http://www.fuzzwahracing.com/p/results-highlighter.html
// @downloadURL https://update.greasyfork.org/scripts/40735/iRacing%20My%20Results%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/40735/iRacing%20My%20Results%20Highlighter.meta.js
// ==/UserScript==

// the script overwrites the addExportButton function (which is called at the end of the populateResults function
function addExportButton(parent, ssId, ssNum) {
    // so first we do the things that addExportButton normally does...
    var csv_div = parent.appendChild(element("div", {}, {
        position: "absolute",
        top: "1px",
        right: "21px"
    }));
    var getContrast = function (hexcolor){

        // If a leading # is provided, remove it
        if (hexcolor.slice(0, 1) === '#') {
            hexcolor = hexcolor.slice(1);
        }

        // If a three-character hexcode, make six-character
        if (hexcolor.length === 3) {
            hexcolor = hexcolor.split('').map(function (hex) {
                return hex + hex;
            }).join('');
        }

        // Convert to RGB value
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);

        // Get YIQ ratio
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        // Check contrast
        return (yiq >= 128) ? '#333' : '#eee';

    };
    var csvimg_link = csv_div.appendChild(element("a", {
        href: contextpath + "/member/GetEventResultsAsCSV?subsessionid=" + ssId + "&simsesnum=" + ssNum + "&includeSummary=1",
        className: "outputcsv_label"
    }, {
        display: "block",
        position: "absolute",
        top: "5px",
        right: "5px"
    }));
    imgpreload(imageserver + "/member_images/results/outputcsv.gif", csvimg_link, "outputcsv_label");

    // and then we do the things needed to highlight the driver's row in the tables:
    // this grabs the custid from the URL
    var custid = location.search.split('custid=').splice(1).join('').split('&')[0];

    // you can configure the array below to make the script highlight other drivers too
    // edit the examples below in the format: ["name", "custid", "html_color_code"]
    var drivers = [
        ["", ""+custid+"", "#FFF3B3"],
        ["Your Name", "your_custid_here", "#FFF3B3"],
        ["Driver1", "driver1_custid_here", "#FFB1CC"],
        ["Driver2", "driver2_custid_here", "#C1FFAF"],
        ["Driver3", "driver3_custid_here", "#B2ECFF"],
        ["Driver4", "driver4_custid_here", "#CEC1E7"],
        ["Driver5", "driver5_custid_here", "#FFB459"],
    ];

    // set up some variables to handle team race results
    var teamRace = false;
    var prevTeam = null;
    // spin through each row in the table
    var trs = document.getElementsByTagName('tr');
    for (var i = 0; i < trs.length; i++) {
        var elmRow = trs[i];
        // if any of these rows have the class "team_parent_row", results are from a team race
        if (elmRow.classList.contains("team_parent_row")) {
            teamRace = true;
            // hold onto the last team we saw
            prevTeam = elmRow;
        }
        // check if the id of the row contains against the custids our drivers
        var j
        var k
        var l
        for (l = 0; l < drivers.length; ++l) {
            if (elmRow.id.indexOf(drivers[l][1]) !== -1) {
                // set the color
                elmRow.style.background = drivers[l][2];
                for (j = 0; j < elmRow.cells.length; j++) {
                    elmRow.cells[j].style.color = getContrast(drivers[l][2]);
                    var link = elmRow.cells[j].getElementsByClassName("stats_table_link");
                    if (link.length > 0) {
                        link[0].style.color = getContrast(drivers[l][2]);
                    }
                }

                // if this was a team race....
                if (teamRace == true) {
                    // also highlight the last team row we saw
                    prevTeam.style.background = drivers[l][2];
                    for (k = 0; k < prevTeam.cells.length; k++) {
                        prevTeam.cells[k].style.color = getContrast(drivers[l][2]);
                    }
                }
            }
        }
    }
}

// the function below injects our updated addExportButton function into the page
addJS_Node(addExportButton);

function addJS_Node(text, s_URL, funcToRun, runOnLoad) {
    var D = document;
    var scriptNode = D.createElement('script');
    if (runOnLoad) {
        scriptNode.addEventListener("load", runOnLoad, false);
    }
    scriptNode.type = "text/javascript";
    if (text) scriptNode.textContent = text;
    if (s_URL) scriptNode.src = s_URL;
    if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
    targ.appendChild(scriptNode);
}
