// ==UserScript==
// @name         PTS Search
// @version      0.3
// @description  Adds extended functionality to the PTS.
// @author       You
// @include      *habbousdf.com/pts/*
// @grant        none
// @namespace https://greasyfork.org/users/98184
// @downloadURL https://update.greasyfork.org/scripts/26877/PTS%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/26877/PTS%20Search.meta.js
// ==/UserScript==

//Adds an external stylesheet to the page.
function addStyle(css){
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    s.appendChild(document.createTextNode(css));
    head.appendChild(s);
}

//Allows the containing element (div) to be inserted into a specific section of the page.
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

//Function which expands symbols into their letter components.
function expandFeats (input) {
    var tempOutput = input;
    var feats = ["@ BMS", "& PTU", "% AR", "< GD", "> JK", "! SM", "+ QZ", "= ZF", "^ TU"];
    for (i = 0; i < feats.length; i++) {
        tempOutput = tempOutput.replace(feats[i].split(' ')[0], feats[i].split(' ')[1]);
    }
    return tempOutput;
}

//Function which sorts a string into alphabetical order.
function makeAlphabet(str) {
    var arr = str.split(''),
        alpha = arr.sort().join('').replace(/\s+/g, '');
    return alpha;
} //Credit to Stackoverflow for this function.

//Function which checks which FEATs are available.
function checkAvailableFeats(paygrade, defaultFeats) {
    var availableFeats = "";
    var currentFeats = expandFeats(defaultFeats);
    var feats = ["1:JR", "2:GT", "3:AHPU", "4:BDKQSZ", "7:M"];

    for (i = 0; i < feats.length; i++) {
        var group = feats[i].split(':')[1];
        console.log(paygrade);
        console.log(group);
        if (parseInt(paygrade) < feats[i].split(':')[0]) {
            break;
        }
        for (x = 0; x < group.length; x++) {
            if (currentFeats.indexOf(group.charAt(x)) < 0) {
                availableFeats += group.charAt(x);
            }
        }
    }
    document.getElementById("featResults").innerHTML = makeAlphabet(availableFeats);
}

//Function which changes links on pages.
function changeLink(oldString, newString) {
    var links = document.getElementsByTagName("a");
    for (i = 0; i < links.length; i++) {
        if (links[i].getAttribute("href").toLowerCase() == oldString.toLowerCase()) {
            document.getElementsByTagName("a")[i].setAttribute("href", newString);
            break;
        }
    }
}
//Adds the CSS styling.
addStyle("label { font-size:20px; }#searchContainer { padding-top:50px; text-align:center; outline-width: 0; } input[type=text] { height:60px; margin-left:10px; margin-bottom:10px; border:6px solid #424242; padding:10px; font-size:30px !important; color:#000; outline:none !important; } input[type=text]:focus { outline:none; border:6px solid #e0b002 !important; }");

//Changes FEAT link to direct to the FEAT search page.
changeLink("index.php?page=feats", "index.php?page=feats_search");

//Checks if the current page is the FEATs search page.
if (window.location.href.toLowerCase().endsWith(".com/pts/index.php?page=feats_search".toLowerCase())) {

    //Creates the needed elements.
    var containerDiv = document.createElement("div");
    var searchInput = document.createElement("input");
    var rankInput = document.createElement("input");
    var results = document.createElement("p");
    var paygradeLabel = document.createElement("label");
    var featsLabel = document.createElement("label");

    //Sets the needed attributes for the needed elements.
    containerDiv.id = "searchContainer";
    searchInput.id = "searchInput";
    searchInput.type = "text";
    rankInput.id = "rankInput";
    rankInput.type = "text";
    paygradeLabel.innerHTML = "Paygrade - E";
    featsLabel.innerHTML = "Default FEATs";
    results.id = "featResults";

    //Appends the elements to the document.
    document.getElementById("results").appendChild(containerDiv);

    var container = document.getElementById("searchContainer");

    container.appendChild(paygradeLabel);
    container.appendChild(rankInput);
    container.appendChild(document.createElement("br"));
    container.appendChild(featsLabel);
    container.appendChild(searchInput);
    container.appendChild(document.createElement("br"));
    container.appendChild(results);
    document.getElementsByClassName("alert alert-danger")[0].remove();

    //Creates a reference for the keypress events to call.
    var eventRef = function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            checkAvailableFeats(document.getElementById("rankInput").value, document.getElementById("searchInput").value.toUpperCase());
        }
    };

    //Creates the keypress events for the inputs.
    document.getElementById("searchInput").addEventListener("keyup", eventRef);
    document.getElementById("rankInput").addEventListener("keyup", eventRef);

    //Ends the script.
    return;
}

var username;
var motto;

//Hides all users and rank titles besides ones which match the search query.
var ref =
    function () {
        var input = document.getElementById("searchInput").value.toLowerCase();
        username = input.split(/\s(.+)/)[0];
        motto = input.split(/\s(.+)/)[1];

        var branches = ["civilian", "airforce", "army", "marines", "navy"];

        for (x = 0; x < branches.length; x++) {
            var current = document.getElementsByClassName('third ' + branches[x]);
            for(i = 0; i < current.length; i++)
            {
                var elementRef = current[i];
                if (elementRef.getElementsByTagName("a")[0].innerHTML.toLowerCase().indexOf(username) < 0) {
                    elementRef.setAttribute("style", "display:none;");
                    console.log(i);
                }
                else {
                    elementRef.removeAttribute("style");
                    elementRef.parentNode.setAttribute("nohide", "true");
                }
            }
        }

        var ranks = document.getElementsByClassName("rank-title");
        for (i = 0; i < ranks.length; i++) {
            var ref = document.getElementsByClassName("rank-title")[i];

            if (ref.parentNode.getAttribute("nohide") == "true") {
                ref.setAttribute("style", "");
                ref.parentNode.removeAttribute("nohide");
                continue;
            }
            ref.setAttribute("style", "display:none;");
        }
    };

//Function which allows CSS styles to be dynamically added to the document.

var openPages = function openResources() {
    var pages = ["F:5365/manual-pts-personnel-list", "W:index.php?type=f&page=discharged", "W:index.php?type=w&page=discharged", "F:10/regulation-usdf-standing-orders-dress"];
    for (i = 0; i < pages.length; i++) {
        window.open(pages[i].replace("W:", "http://www.habbousdf.com/pts/").replace("F:", "http://habbousdf.boards.net/thread/"));
    }
};

//Creates the search Elements.
var containerDiv = document.createElement("div");
var searchInput = document.createElement("input");
var searchButton = document.createElement("button");
var openPagesLabel = document.createElement("a");

//Sets the needed attributes for the search elements and adds them to the document.
containerDiv.id = "searchContainer";
searchInput.id = "searchInput";
searchInput.type = "text";
openPagesLabel.innerHTML = "Click to open pages.";
openPagesLabel.href = "#";
openPagesLabel.onclick = openPages;
insertAfter(containerDiv, document.getElementById("filter"));
document.getElementById("searchContainer").appendChild(searchInput);
document.getElementById("searchContainer").appendChild(document.createElement("br"));
document.getElementById("searchContainer").appendChild(openPagesLabel);

//Allows the "enter" key to be pressed to initate the search.
document.getElementById("searchInput")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        ref();
    }
});
