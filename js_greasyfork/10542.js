// ==UserScript==
// @name        Pardus Path Recorder
// @author      Math (Orion)
// @namespace   fear.math@gmail.com
// @description Records a path (such as an FWE trade route) and allows the player to quickly retrace the path by pressing one key multiple times.
// @include     http*://*.pardus.at/*main.php*
// @version     3.1
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/10542/Pardus%20Path%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/10542/Pardus%20Path%20Recorder.meta.js
// ==/UserScript==

// Credit to Jirina for writing a similar script before me which this script builds on.

//USER VARIABLE: Set which key you would like to be the "next tile" key.
var advance_key = "H";
//END USER VARIABLE

// Determine user location (tile ID)
var userloc;
var squad = false;
var height = unsafeWindow.navSizeVer;
var width = unsafeWindow.navSizeHor;
if(unsafeWindow.userloc !== undefined) {
    userloc = unsafeWindow.userloc;
} else { 
    // only applies to squads: need to calculate tile ID from the IDs of accessible and adjacent tiles
    squad = true;
    var north = document.getElementById("navarea").rows[(height-1)/2 - 1].cells[(width-1)/2].firstChild;
    var south = document.getElementById("navarea").rows[(height-1)/2 + 1].cells[(width-1)/2].firstChild;
    var south = document.getElementById("navarea").rows[(height-1)/2 + 1].cells[(width-1)/2].firstChild;
    var west = document.getElementById("navarea").rows[(height-1)/2].cells[(width-1)/2 - 1].firstChild;
    var east = document.getElementById("navarea").rows[(height-1)/2].cells[(width-1)/2 + 1].firstChild;
    if (north.tagName == "A") {
        userloc = parseInt(north.getAttribute("onclick").match(/\d+/)[0]) + 1;
    } else if (south.tagName == "A") {
        userloc = parseInt(south.getAttribute("onclick").match(/\d+/)[0]) - 1;
    } else {
        var westID = west.getAttribute("onclick").match(/\d+/)[0];
        var eastID = east.getAttribute("onclick").match(/\d+/)[0];
        userloc = 1/2 * (parseInt(westID) + parseInt(eastID));
    }       
}

// Determine sectors and coordinates
var sector = document.getElementById("sector").innerHTML;
var coord = document.getElementById("coords").innerHTML;

// Add the UI to the nav page below cargo
var cargo = document.getElementById("cargo");
var table = document.createElement("table");
table.id = "path_recorder";
table.width = 210; table.border = 0;
table.setAttribute("cellspacing","0");
table.setAttribute("cellpadding","0");
var imgDir;
if (squad) {imgDir = "http://static.pardus.at/images/";} else {imgDir = unsafeWindow.imgDir;}

table.innerHTML = '<tbody>\
                        <tr>\
                            <td>\
                                <img src="' + imgDir + '/position.png" height="34" width="210">\
                            </td>\
                        </tr>\
                        <tr>\
                            <td style="background-image:url(' + imgDir + '/panel.png); background-repeat:repeat-y; text-align:left;">\
                                <div style="margin:0 18px;">\
                                    <a id="file" title="Save or export the current path, or import another path." style="cursor:pointer">File</a>\
                                        | <a id="current" title="Record a new path or follow the current one." style="cursor:pointer">Current Path</a>\
                                        | <a id="all_paths" title="Load one of your saved paths." style="cursor:pointer">All Paths</a>\
                                    <br>\
                                    <br>\
                                    <div id="pr_div"></div>\
                                </div>\
                            </td>\
                        </tr>\
                        <tr>\
                            <td>\
                                <img src="' + imgDir + '/panelbottom.png" height="22" width="210">\
                            </td>\
                        </tr>\
                    </tbody>';
cargo.parentNode.insertBefore(table,cargo.parentNode.childNodes[3]);
var prDiv = document.getElementById("pr_div");

//If not recording and you reach the last tile on your current path, switch to the "All Paths" tab. Makes switching paths more convenient. Does not apply to squads since you often want to move multiple squads along the same path.
if (!squad && GM_getValue("path","") !== "") {
    var path = GM_getValue("path").split(",");
    if (!GM_getValue("recording") && path[path.length-1] == userloc) {
        GM_setValue("tab","allPaths");
    }
}
displayTab();

document.getElementById('file').addEventListener('click', file, false);
document.getElementById('current').addEventListener('click', current, false);
document.getElementById('all_paths').addEventListener('click', allPaths, false);

window.addEventListener('keydown', nextKey);

function displayTab() {
    if (GM_getValue("tab","current") == "file") {
        prDiv.innerHTML='   <a id="import" title="Import a path by pasting a string." style="cursor:pointer">Import</a>\
                            | <a id="export" title="Export path as a string for you or another user to import." style="cursor:pointer">Export</a>\
                            | <a id="clear" title="Clear all paths." style="cursor:pointer">Clear</a>\
                            <br>\
                            <br>';
        prDiv.innerHTML+='  <form>Save current path as:\
                                <br>\
                                <input type="text" name="savePath" id="savePath">\
                                <input type="button" name="saveButton" value="Save" id="saveButton">\
                            </form>';
        
        document.getElementById('import').addEventListener('click', importPath, false);
        document.getElementById('export').addEventListener('click', exportPath, false);
        document.getElementById('clear').addEventListener('click', clear, false);
        document.getElementById("saveButton").addEventListener("click", savePathAs, true);
        
    } else if (GM_getValue("tab","current") == "current") {
        
        prDiv.innerHTML='   <a id="next" title="Go to next tile on your current path." style="cursor:pointer">Next</a>\
                            | <a id="rec_stop" title="Start recording." style="cursor:pointer">Record</a>\
                            | <a id="clearAll" title="Clear every tile of the current path." style="cursor:pointer">Clear</a>\
                            | <a id="clearLast" title="CLear only the last tile of the current path." style="cursor:pointer">Last</a>';

        //check if recording is turned on
        if (GM_getValue("recording")) {
            document.getElementById('rec_stop').innerHTML = "Stop";
            document.getElementById('rec_stop').title = "Stop recording.";
            recordLocation();
        }

        //make and insert list of tiles on the current path
        prDiv.innerHTML += '<ol id="path_list" style ="padding-left: 2em; margin-top: 5px; margin-bottom: 0px;"></ol>';
        updateList();
        
        document.getElementById('next').addEventListener('click', next, false);
        document.getElementById('rec_stop').addEventListener('click', rec_stop, false);
        document.getElementById('clearAll').addEventListener('click', clearAll, false);
        document.getElementById('clearLast').addEventListener('click', clearLast, false);
        
    } else {
        
        prDiv.innerHTML='<a id="showAll" title="Show all paths, regardless of starting tile." style="cursor:pointer">Show All</a><br>';
        var list = '<ol id="path_list" style ="padding-left: 2em; margin-top: 5px; margin-bottom: 0px;">';
        var paths;
        if (GM_getValue("paths","") !== "") {
            paths = GM_getValue("paths").split("|");
        } else {
            paths = [];
        }
        for (i=1; i < paths.length; i++) {
            paths[i] = paths[i].split(";");
            if (paths[i][1] == userloc) {
                list += '<li><a id="load' + i + '" title="Load this path." style="cursor:pointer">' + paths[i][0] + '</a> - <a id="del' + i + '" title="Delete this path." style="color:red;cursor:pointer">X</a></li>';
            }
        }
        list += '</ol>';
        prDiv.innerHTML += list;
        
        for (i=1; i < paths.length; i++) {
            function addListeners() {
                var eye = i;
                if (document.getElementById("load" + eye)) {
                    document.getElementById("load" + eye).addEventListener('click',function() {loadPath(eye)},false);
                    document.getElementById("del" + eye).addEventListener('click',function() {delPath(eye)},false);
                }
            }
            addListeners();
        }
        document.getElementById('showAll').addEventListener('click', showAll, false);
    }
}

function file() {
    GM_setValue("tab","file");
    displayTab();
}

function current() {
    GM_setValue("tab","current");
    displayTab();
}

function allPaths() {
    GM_setValue("tab","allPaths");
    displayTab();
}

function importPath() {
    var saveFile = prompt("Paste a previously exported path:");
    try {
        var values = unpackSaveFile(saveFile);
        GM_setValue("path",values[0]);
        GM_setValue("sector",values[1]);
        GM_setValue("coord",values[2]);
        current();
    }
    catch(err) {
        alert("Invalid path, please try again.");
    }
}

function exportPath() {
    if (GM_getValue("path","") !== "") {
        var sectors = GM_getValue("sector").split(",");
        var coords = GM_getValue("coord").split(";");
        var name = sectors[1] + " " + coords[1] + " to " + sectors[sectors.length-1] + " " + coords[coords.length-1];
        var saveFile = createSaveFile(name);
        prompt("Copy and paste the text below to export your current path.",saveFile);
    } else {
        alert("You cannot export an empty path!");
    }
}

function clear() {
    var clearConfirm = confirm("Are you sure you want to delete all saved paths?");
    if (clearConfirm && GM_getValue("paths")) {
        var pathsList = GM_getValue("paths").split("|");
        for (i=1; i < pathsList.length; i++) {
            var pathName = "path:" + pathsList[i].split(";")[0];
            GM_deleteValue(pathName);
        }
        GM_deleteValue("paths");
    }
}

function createSaveFile(name) {
    var path = GM_getValue("path").split(",");
    var sectors = GM_getValue("sector").split(",");
    var coords = GM_getValue("coord").split(";");
    var pathList = path[1];
    var sectorList = sectors[1];
    var coordList = coords[1];
    for (i=2; i < path.length; i++) {
        pathList += ";" + path[i];
        sectorList += ";" + sectors[i];
        coordList += ";" + coords[i];
    }
    return name + "|" + pathList + "|" + sectorList + "|" + coordList;
}   

function savePathAs () {
    // Check if a name has been provided
    var nameSlot = document.getElementById("savePath");
    if (!nameSlot.value) {
        alert ("Please provide a name for the path.");
        return;
    }
    if (GM_getValue("path","") !== "") {
        var saveFile = createSaveFile(nameSlot.value);  
        GM_setValue("path:" + nameSlot.value, saveFile);
        GM_setValue("paths", GM_getValue("paths","paths") + "|" + nameSlot.value + ";" + GM_getValue("path").split(",")[1]);
        nameSlot.value = "";
    }
}

function next() {
    if (document.getElementById('rec_stop').innerHTML == "Stop") {
        rec_stop();
    }
    if (GM_getValue("path","") !== "") {
        var path = GM_getValue("path").split(",");
        var sectors = GM_getValue("sector").split(",");
        
        var enter_exit = document.getElementById("commands").getElementsByTagName("a")[0].href;
        
        // If you're inside a SB and off the path, exit fly close. Allows fast entering/exiting until you enter on the correct tile.
        if (document.body.innerHTML.indexOf("sb_space") != -1) {
            if (path.indexOf(userloc.toString()) == -1) {
                unsafeWindow.location.href = enter_exit;
                return;
            }
        }
        
        for (i = 1; i < path.length-1; i++) {
            if (path[i] == userloc) {
                if (sectors[i] == sectors[i+1]) {
                    unsafeWindow.location.href = "javascript:nav(" + path[i+1] + ")";
                    return;
                } else {
                    var centreImg = document.getElementById("navarea").rows[(height-1)/2].cells[(width-1)/2].getElementsByTagName("IMG")[0].src;
                    if (centreImg.indexOf("starbase") != -1) {
                        if (squad) {
                            unsafeWindow.location.href = enter_exit;
                            return;
                        } else if (location.href.indexOf("exit") == -1) {
                            unsafeWindow.location.href = location.href + "?entersb=1";
                            return;
                        } else {
                            unsafeWindow.location.href = location.href.substr(0,location.href.indexOf("exit")-1) + "?entersb=1";
                            return;
                        }
                    } else if (document.body.innerHTML.indexOf("sb_space") != -1) {
                        unsafeWindow.location.href = enter_exit;
                        return;
                    } else {
                        unsafeWindow.location.href = "javascript:warp(" + path[i] + ")";
                        return;
                    }
                }
            }
        }
    }
}

function nextKey(e) {
    if (String.fromCharCode(e.keyCode) == advance_key) {
        next();
    }
}

function rec_stop(){
    var name = document.getElementById('rec_stop');
    if (name.innerHTML == "Record") {
        name.innerHTML = "Stop";
        name.title = "Stop recording.";
        GM_setValue("recording", true);
    } else {
        name.innerHTML = "Record";
        name.title = "Start recording.";
        GM_setValue("recording", false);
    }
    recordLocation();
    updateList();
}


function clearAll() {
    GM_setValue("path","current_path");
    GM_setValue("sector","current_path");
    GM_setValue("coord","current_path");
    if (GM_getValue("recording")) {recordLocation();}
    updateList();
}

function clearLast() {
    if (GM_getValue("path","") !== "") {
        var path = GM_getValue("path").split(",");
        var sectors = GM_getValue("sector").split(",");
        var coords = GM_getValue("coord").split(";");
        var newPath = path[0];
        var newSectors = sectors[0];
        var newCoords = coords[0];
        for (i = 1; i < path.length-1; i++) {
            newPath += "," + path[i];
            newSectors += "," + sectors[i];
            newCoords += ";" + coords[i];
        }
        GM_setValue("path",newPath);
        GM_setValue("sector",newSectors);
        GM_setValue("coord",newCoords);
    }
    //if (GM_getValue("recording")) {recordLocation();}
    updateList();
}

function updateList() {
    var pathList = document.getElementById("path_list");
    var path = [];
    var sectors = [];
    var coords = [];
    if (GM_getValue("path","") !== "") {
        path = GM_getValue("path").split(",");
        sectors = GM_getValue("sector").split(",");
        coords = GM_getValue("coord").split(";");
    }
    var list = "";
    for (i = 1; i < path.length; i++) {
        if (path[i] == userloc) {
            list += '<a onclick="javascript:nav(' + path[i] + ')" title="Your current tile." style="cursor:pointer"><li>' + sectors[i] + ' ' + coords[i] + ' \<\<</li></a>';
        } else {
            list += '<a onclick="javascript:nav(' + path[i] + ')" title="Move to this tile." style="cursor:pointer"><li>' + sectors[i] + ' ' + coords[i] + '</li></a>';
        }
    }
    pathList.innerHTML = list;
}

function recordLocation() {
    var last = 0;
    if (GM_getValue("path","") !== "") {
        var path = GM_getValue("path").split(",");
        last = path[path.length-1];
    }
    if (last != userloc) {
        GM_setValue("path", GM_getValue("path","current_path") + "," + userloc);
        GM_setValue("sector", GM_getValue("sector","current_path") + "," + sector);
        GM_setValue("coord", GM_getValue("coord","current_path") + ";" + coord);
    }
}

function showAll() {
    var allList = "";
    if (GM_getValue("paths","") !== "") {
        var paths = GM_getValue("paths").split("|");
    } else {
        var paths = [];
    }
    for (i=1; i < paths.length; i++) {
        paths[i] = paths[i].split(";");
        allList += '<li><a id="load' + i + '" title="Load this path." style="cursor:pointer">' + paths[i][0] + '</a> - <a id="del' + i + '" title="Delete this path." style="color:red;cursor:pointer">X</a></li>';
    }
    document.getElementById("path_list").innerHTML = allList;
    
    for (i=1; i < paths.length; i++) {
        function addListeners() {
            var eye = i;
            if (document.getElementById("load" + eye)) {
                document.getElementById("load" + eye).addEventListener('click',function() {loadPath(eye)},false);
                document.getElementById("del" + eye).addEventListener('click',function() {delPath(eye)},false);
            }
        }
        addListeners();
    }
}

function loadPath(num) {
    var pathsList = GM_getValue("paths").split("|");
    var pathName = "path:" + pathsList[num].split(";")[0];
    var saveFile = GM_getValue(pathName);
    var values = unpackSaveFile(saveFile);
    GM_setValue("path",values[0]);
    GM_setValue("sector",values[1]);
    GM_setValue("coord",values[2]);
    current();
}

function delPath(num) {
    if (confirm("Are you sure you wish to delete this path?")) {
        var pathsList = GM_getValue("paths").split("|");
        var pathName = "path:" + pathsList[num].split(";")[0];
        GM_deleteValue(pathName);
        pathsList.splice(num, 1);
        var pathsString = pathsList[0];
        for (i=1; i < pathsList.length; i++) {
            pathsString += "|" + pathsList[i];
        }
        GM_setValue("paths",pathsString);
        allPaths();
    }
}

function clear() {
    var clear = confirm("Are you sure you want to delete all saved paths?");
    if (clear && GM_getValue("paths")) {
        var pathsList = GM_getValue("paths").split("|");
        for (i=1; i < pathsList.length; i++) {
            var pathName = "path:" + pathsList[i].split(";")[0];
            GM_deleteValue(pathName);
        }
        GM_deleteValue("paths");
    }
}

function unpackSaveFile(saveFile) {
    var file = saveFile.split("|");
    var pathList = file[1].split(";");
    var sectorsList = file[2].split(";");
    var coordsList = file[3].split(";");
    var path = "current_path";
    var sectors = "current_path";
    var coords = "current_path";
    for (i=0; i < pathList.length; i++) {
        path += "," + pathList[i];
        sectors += "," + sectorsList[i];
        coords += ";" + coordsList[i];
    }
    return [path,sectors,coords];
}