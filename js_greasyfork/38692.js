// ==UserScript==
// @name        BlueCat Address Manager Auto-Switch to Tagged Objects
// @namespace   *
// @description Automatically switch to Tagged Objects if no SubTags exist in BlueCat Address Manager
// @include     */app*
// @exclude     */app*sp=ScontextId%3Dtag
// @license		MIT
// @version     4
// @grant       none
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/38692/BlueCat%20Address%20Manager%20Auto-Switch%20to%20Tagged%20Objects.user.js
// @updateURL https://update.greasyfork.org/scripts/38692/BlueCat%20Address%20Manager%20Auto-Switch%20to%20Tagged%20Objects.meta.js
// ==/UserScript==


// give up after 5 tries = 2,5 sec
var k = 0, howManyTimes = 5;
function getNodes() {
    var count = k+1;
    console.log(" + looking for nodes "+count+"/"+howManyTimes);
    var nodes = document.getElementsByClassName("TreeNode").length;
    k++;
    if(( k < howManyTimes )&&(nodes === 0)){
        setTimeout( getNodes, 500 );
    }
    else if ((k === howManyTimes)&&(nodes === 0)) {
        document.getElementById("contextTabLink_1").click();
    } else {
        //console.log("nothing to do");
        return;
    }
};


// Exclude Pattern will prevent endless loop :-)
if (document.readyState === "interactive" ) {
    var page = document.childNodes[2].nodeValue;
    if (/ Page: Tags /.test(page)) {
        // check subtab, should only be executed on Tags not Tagged Objects
        var subtab = document.getElementsByClassName("TabPanelLabelActive")[0];
        if (subtab.innerText === "Tags") {
            var info = document.getElementById("informal");
            if ((info !== undefined)&&(info !== null)) {
                //console.log("found informal table - assuming table view");
                // Table View
                if (document.getElementsByClassName("empty-table").length === 1) {
                    // empty -> switch to tagged objects
                    document.getElementById("contextTabLink_1").click();
                }
            } else {
                //console.log("informal id not found or null - assuming tree view");
                // checking nodes
                if (document.getElementsByClassName("TreeNode").length === 0) {
                    getNodes();
                    //console.log(document.getElementsByClassName("TreeNode").length);
                    //document.getElementById("contextTabLink_1").click();
                }
            }
        }
    }
}