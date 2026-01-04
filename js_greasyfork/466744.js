// ==UserScript==
// @name        Pardus Starbase Population Logger
// @author      Math (Orion), Bocaj (Orion)
// @namespace   gamer4ages@hotmail.com
// @description Logs data about starbases population from the statistics page to AWS server.
// @include     http*://*.pardus.at/statistics.php*
// @version     1.0.1
// @license     MIT
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/466744/Pardus%20Starbase%20Population%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/466744/Pardus%20Starbase%20Population%20Logger.meta.js
// ==/UserScript==

const idEntry       = 739792085;
const sbStatsEntry  = [1031727216, 1090285757, 918357285];  // [fed, emp, uni]

var dataStr = '';
var data = {
    universe : window.location.host.substr(0, window.location.host.indexOf('.')),
    pardusCluster : {
        updated: "",
        PFC : {},
        PEC : {},
        PUC : {}
    }
};

if (location.href.indexOf("statistics.php?display=parduscluster") > -1 || location.href.endsWith("statistics.php") > -1) {

    //send userid only, sector and coords are meaningless
    var userid = unsafeWindow.userid;
    addToDataStr(idEntry, userid);
    data.user = userid;

    //get cached time
    try {
        data.pardusCluster.updated = document.getElementsByClassName("cached")[0].innerHTML.replace("Last updated:<br>", "");
        harvestSBData();
    } catch { // This isn't the parduscluster tab
    }
}

function harvestSBData() {
    //get table of PFC, PEC, and PUC SBs
    var tables = document.getElementsByTagName("table");
    var sbTables = [];
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].width === '90%') {
            sbTables.push(tables[i]);
        }
    }

    const pardusClusters = ['PFC', 'PEC', 'PUC'];

    //For each P*C, get SB names and populations and combine into one string to send to the google doc.
    for (let i = 0; i < 3; i++) {
        var table = sbTables[i];
        var result = '';
        var baseName, workers;
        for (let j = 1; j < table.rows.length; j++) {
            baseName = table.rows[j].cells[2].innerHTML;
            workers = table.rows[j].cells[3].innerHTML.replace(/,/g, ''); //remove commas
            data.pardusCluster[pardusClusters[i]][baseName] = Number(workers);
            result += ";" + baseName + ";" + workers;
        }
        result = result.replace(/;/, ''); //remove leading semicolon
        //Add result (i=0,1,2 corresponds to Fed, Emp, Uni) to data string
        addToDataStr(sbStatsEntry[i], result);
    }

    sendData();
}

function sendData() {
    // console.log(data);

    //Remove leading ampersand
    dataStr = dataStr.replace(/&/, '');

    // Don't send the same log twice in a short time to prevent nav spam generating thousands of logs
    let lastDataStr = GM_getValue('sbLoggerDataStr');

    if (dataStr == lastDataStr) {
        return;
    }

    GM_setValue('sbLoggerDataStr', dataStr);

    // console.log(JSON.stringify(data));
    data.pardusCluster.PFC.test = Math.floor((Math.random() * 100000) + 1);

    //Send data to google form
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://q7kywrrtauc4bz7ow4tazwiw4e0tkapy.lambda-url.ap-southeast-2.on.aws/",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
    });

    alert("Starbase data sent to server");
}

function addToDataStr(entry, value) {
    dataStr += "&entry." + entry + "=" + value;
}
