// ==UserScript==
// @name         [hwm]_find_depo_transactions
// @namespace    Clan depo
// @version      0.1
// @description  Finds all instances of withdrawn and deposited items in depo
// @author       Hapkoman
// @include      https://www.lordswm.com/clan_info.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418922/%5Bhwm%5D_find_depo_transactions.user.js
// @updateURL https://update.greasyfork.org/scripts/418922/%5Bhwm%5D_find_depo_transactions.meta.js
// ==/UserScript==
var pages_to_search = 10;
var page = 0;
var start_page = 0;
var depo_id = 214;
var include_repairs = false;
var include_deposits = true;
var include_withdraws = true;

var stop_run = false;
var running = false;
console.log("RUNNING");
document.body.innerHTML = "<div max-he>"
    +"<br><input id='scan_depo_repair' type='checkbox' name='scan_depo_repair' >"
    + "<label for='scan_depo_repair'>include Repairs</label>"
    +"<br><input id='scan_depo_deposit' checked type='checkbox' name='scan_depo_deposit' >"
    + "<label for='scan_depo_deposit'>include Deposits</label>"
    +"<br><input id='scan_depo_withdraw' checked type='checkbox' name='scan_depo_withdraw' >"
    + "<label for='scan_depo_withdraw'>include Withdraws</label>"
    + "<br><input id='scan_depo_id' name='scan_depo_id' type='number' value='" + depo_id + "' min='0'>"
    + "<label for='scan_depo_id'> Depo ID </label>"
    + "<br><input id='scan_depo_pages_to_search' name='pages_to_search' type='number' value='" + pages_to_search + "' min='0'>"
    + "<label for='scan_depo_pages_to_search'> Pages to Search </label>"
    + "<br><input id='scan_depo_page_to_start_from' name='scan_depo_page_to_start_from' type='number' value='" + start_page + "' min='0'>"
    + "<label for='scan_depo_page_to_start_from'> Page to start from </label>"
    + "<br><button id='scan_depo_button'>CLICK TO SCAN</button>"
    + "<br><button id='scan_depo_button_stop'>CLICK TO STOP SCAN</button>"
    + "<ul style='max-height: 250px; overflow: auto; background-color: wheat' id='scan_depo_log'></ul>"
    +"</div>" + document.body.innerHTML;
document.getElementById("scan_depo_button").onclick = function(){doScan();};
document.getElementById("scan_depo_button_stop").onclick = function(){stopScan();};
document.getElementById("scan_depo_repair").onchange = function(){
    include_repairs = !include_repairs;
};
document.getElementById("scan_depo_deposit").onchange = function(){
    include_deposits = !include_deposits;
};
document.getElementById("scan_depo_withdraw").onchange = function(){
    include_withdraws = !include_withdraws;
};
document.getElementById("scan_depo_id").onchange = function(e){
    if (!running){
        depo_id = e.target.value;
    }
};
document.getElementById("scan_depo_id").onkeyup = function(e){
    if (!running){
        depo_id = e.target.value;
    }
};
document.getElementById("scan_depo_pages_to_search").onchange = function(e){
    if (!running){
        pages_to_search = e.target.value;
    }
};
document.getElementById("scan_depo_pages_to_search").onkeyup = function(e){
    if (!running){
        pages_to_search = e.target.value;
    }
};
document.getElementById("scan_depo_page_to_start_from").onchange = function(e){
    if (!running){
        start_page = e.target.value;
    }
};
document.getElementById("scan_depo_page_to_start_from").onkeyup = function(e){
    if (!running){
        start_page = e.target.value;
    }
};
var depo_log_element = document.getElementById("scan_depo_log");

function getPage(){
    page = parseInt(page);
    depo_id = parseInt(depo_id);
    start_page = parseInt(start_page);
    pages_to_search = parseInt(pages_to_search);
    console.log("GETTING PAGE");
    var depo_log = "https://www.lordswm.com/sklad_log.php?id=" + depo_id + "&page=" + page;
    var request = new XMLHttpRequest();
    request.open("GET", depo_log, true);
    //request.ovverrideMimeType("text/html: charset=windows-1251");
    request.send();
    request.onreadystatechange = function() {
        if (request.readyState === 4){
            if (request.status === 200){
                console.log("ready is in, creating html element");
                var responseText = request.responseText;
                var logDoc = document.createElement('html');
                logDoc.innerHTML = responseText;
                var tables = logDoc.getElementsByTagName("table");
                var logTable;
                var logLines = [];
                for (var i = 0; i < tables.length; i++){ //find all log lines
                    var table = tables[i];
                    if (table.innerHTML.indexOf('Depository <a href="sklad_info.php?id=' + depo_id + '">#' + depo_id + '</a> log (clan') > -1){ //found table where log is contained
                        logLines = table.children[0].children[0].children[0].innerHTML.split("<br>");
                        break;
                    }
                }
                for (i = 0; i < logLines.length; i++){ //find and insert all deposited, withdrew lines
                    var logLine = logLines[i];
                    //keywords deposited, withdrew (ignore for repairing?)
                    if ((logLine.indexOf(" deposited '") > -1 && include_deposits)
                        || (logLine.indexOf(" withdrew '") > -1 && logLine.indexOf("for repairing ") < 0 && include_withdraws)
                        || (logLine.indexOf(" withdrew '") > -1 && (include_repairs && logLine.indexOf("for repairing ") > -1)) && include_withdraws){
                        depo_log_element.innerHTML += "<li>"+logLines[i]+"</li>";
                    }
                }
                console.log("Current page " + page + " out of " + pages_to_search + " [started from " + start_page + "]")
                if (page < (pages_to_search + start_page)){ //if current page hasn't reached num of pages to search for
                    page++;
                    setTimeout(function(){
                        if (!stop_run){
                            getPage();
                        } else { //if user has pressed stop button, don't iterate further but just stop.
                            console.log("STOPPED SCAN");
                            running = false;
                            document.getElementById("scan_depo_button").disabled = false;
                        }
                    }, 1000 + getRandomInt(500));
                } else { //scan has finished
                    console.log("FINISHED SCAN");
                    document.getElementById("scan_depo_button").disabled = false;
                    running = false;
                }
            }
        }
    }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function stopScan(){
    stop_run = true;
    console.log("STOPPING SCAN");
}
function doScan(){
    page = start_page;
    depo_log_element.innerHTML = "";
    stop_run = false;
    running = true;
    console.log("SCANNING");
    document.getElementById("scan_depo_button").disabled = true;
    getPage();
}