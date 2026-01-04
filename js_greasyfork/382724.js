// ==UserScript==
// @name     DLSite language switching
// @description Adds a link to switch between EN/JP versions of certain pages.
// @version  5
// @include  http*://*.dlsite.com/*

// This namespace is a legacy URL. The project now lives at https://git.coom.tech/NaN64/DLsite-language-switching/
// @namespace https://greasyfork.org/users/298896

// @downloadURL https://update.greasyfork.org/scripts/382724/DLSite%20language%20switching.user.js
// @updateURL https://update.greasyfork.org/scripts/382724/DLSite%20language%20switching.meta.js
// ==/UserScript==

var url = document.URL.split("/");

var textPart;
var newLetter;
if(url[3] === "ecchi-eng") {
    textPart = "Japanese page";
    url[3] = "maniax";
    newLetter = 'J';
} else if(url[3] === "maniax") {
    textPart = "English page";
    url[3] = "ecchi-eng";
    newLetter = 'E';
} else {
    return;
}

// Change RJ123456 to RE123456 or vice-versa
if(url[4] === "work" | url[4] === "announce") {
    url[7] = url[7].slice(0,1) + newLetter + url[7].slice(2);

    // Create the button and inject it
    var butdiv = document.createElement("div");
    butdiv.setAttribute("style","padding: 10px 10px;text-align: center;position: relative;/*! height: 30px; */");
    var link = document.createElement("a");
    link.href = url.join("/");
    link.textContent = "Switch to " + textPart;
    if(url[4] === "announce" & newLetter === "E") {
      link.textContent = link.textContent + " (probably broken)";
      link.setAttribute("style","color: red;");
    }
    butdiv.append(link);
    var dataSection = document.getElementById("right");
    dataSection.insertBefore(butdiv, dataSection.firstChild);
} 
  else if(url[4] === "circle") {

    // Create a new table entry, find the table, inject the entry
    var tableLink = document.createElement("a");
    tableLink.href = url.join("/");
    tableLink.textContent = url.join("/");
    var tabletd = document.createElement("td")
    tabletd.append(tableLink);
    var tableth = document.createElement("th");
    tableth.textContent = textPart;
    var tableEntry = document.createElement("tr");
    tableEntry.append(tableth);
    tableEntry.append(tabletd);
    
    if(newLetter === "J") {
        document.getElementsByClassName("prof_table")[0].children[0].appendChild(tableEntry);
    } else {
        document.getElementsByClassName("table_inframe_box_inner")[0].children[0].children[0].appendChild(tableEntry);
    }
}
