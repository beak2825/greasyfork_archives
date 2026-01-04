// ==UserScript==
// @name         AO3: CSV-Esque
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Get assignments out to a comma-separated format.
// @author       You
// @match        https://archiveofourown.org/collections/*/assignments?*
// @icon         https://icons.duckduckgo.com/ip2/archiveofourown.org.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472844/AO3%3A%20CSV-Esque.user.js
// @updateURL https://update.greasyfork.org/scripts/472844/AO3%3A%20CSV-Esque.meta.js
// ==/UserScript==

/* Uncomment this and comment out the other part if you want the cheap mode back. */
/*
var rows = document.getElementsByTagName("dt");
var whole = "";
for (var x = 0; x < rows.length; x++) {
    var whomst = rows[x].textContent.trim();
    var pieces = whomst.split("\n");
    var msg = pieces[0].trim() + "\t" + pieces[5].trim();
    whole = whole + msg + "\n";
}

var box = document.createElement("textarea");
box.innerHTML = whole;
document.getElementsByTagName("dd")[0].parentNode.appendChild(box);
*/

function loadCsv() {
    var sep = "\t";

    // Set the textarea.
    var div = document.createElement("div");

    var label = document.createElement("label");
    label.setAttribute("id", "export_label");
    label.setAttribute("for", "export_contents");
    label.appendChild(document.createTextNode("Exporting..."))
    div.appendChild(label);

    var box = document.createElement("textarea");
    box.setAttribute("id", "export_contents");
    box.setAttribute("name", "export_contents");
    div.appendChild(box);

    document.getElementsByTagName("dd")[0].parentNode.appendChild(div);

    var exporty = "";

    function extractFolk(elm)
    {
        var whomst = elm.textContent.trim();
        var pieces = whomst.split("\n");
        var msg = pieces[0].trim() + sep + pieces[5].trim();
        exporty = exporty + msg + "\n";
    }

    function loadXMLDoc(theURL)
    {
        var contents = "";
        xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                contents = xmlhttp.responseText;
            }
        }
        xmlhttp.open("GET", theURL, false);
        xmlhttp.send();
        return contents;
    }

    var coll = document.location.href.split("/")[4]
    var url = "https://archiveofourown.org/collections/" + coll + "/assignments?unfulfilled=true&page=";

    var maxPages = Number(document.getElementsByClassName("next")[0].previousSibling.previousSibling.textContent);

    for (var p = 1; p <= maxPages; p++) {
        var this_url = url + p.toString();
        response = loadXMLDoc(this_url);
        var el = document.createElement('html');
        el.innerHTML = response;
        var tags = el.getElementsByTagName("dt");
        for (var x = 0; x < tags.length; x++) {
            extractFolk(tags[x])
        }
        console.log("Finished page " + p.toString())
    }

    document.getElementById("export_label").innerHTML = "Finished!";
    document.getElementById("export_contents").innerHTML = exporty;
    var expbut = document.getElementById("exporting");
    expbut.parentNode.removeChild(expbut);
}

var newb = document.createElement("a");
newb.setAttribute("id", "exporting");
newb.setAttribute("title", "This is going to freeze your page until it's complete, be told.");
newb.setAttribute("style", "cursor: pointer");
newb.setAttribute("role", "button");
newb.addEventListener("click", loadCsv, false);
newb.appendChild(document.createTextNode("Export"));

var actions = document.getElementById("main").getElementsByClassName("navigation actions")[0];
actions.appendChild(newb);
