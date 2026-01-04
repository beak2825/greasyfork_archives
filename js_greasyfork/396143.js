// ==UserScript==
// @name         filter hkepc banned thread
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.hkepc.com/forum/forumdisplay.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396143/filter%20hkepc%20banned%20thread.user.js
// @updateURL https://update.greasyfork.org/scripts/396143/filter%20hkepc%20banned%20thread.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
var threadList = document.getElementById("threadlist");
var moderateNode = -1;
var dataTableNode = -1;
var found = false;
var loopAll = false;
var target = "";
var banList = [
    { id: 'carl.20150508'},
    { id: 'yipyipfung'}
];


for (var i = 0; i < threadList.childNodes.length; i++) {
    if (threadList.childNodes[i].id == "moderate")
        moderateNode = i;
        console.log("moderateNode: "+moderateNode);
}

if (moderateNode != -1) {
    for (var i = 0; i < threadList.childNodes[moderateNode].childNodes.length; i++) {
    if (threadList.childNodes[moderateNode].childNodes[i].className == "datatable")
        dataTableNode = i;
    console.log("dataTableNode:"+ dataTableNode);
    }
}


if (dataTableNode != -1) {
    do {
        found = false;
        var threadTable = document.getElementById("threadlist").childNodes[moderateNode].childNodes[dataTableNode];

        for (var i = 0; i < threadTable.tBodies.length; i++) {
            if (threadTable.tBodies[i].getElementsByClassName("author").length == 0)
                continue;
            var authorString = threadTable.tBodies[i].getElementsByClassName("author")[0].innerText.replace(/\n.*/gi,"");
            for (var j = 0; j < banList.length; j++ ) {
                if (banList[j].id == authorString) {
                threadTable.removeChild(threadTable.tBodies[i]);
                found = true;
                }
            }

        }

    }
    while (found);

}


})();