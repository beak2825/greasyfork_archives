// ==UserScript==
// @name        BlueCat Address Manager Table Counter
// @namespace   *
// @description Add count of value Table in BlueCat Address Manager (no paging support)
// @include     */app*
// @license		MIT
// @version     5
// @grant       none
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/373061/BlueCat%20Address%20Manager%20Table%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/373061/BlueCat%20Address%20Manager%20Table%20Counter.meta.js
// ==/UserScript==

if (document.readyState === "interactive" ) {
	var subtab = document.getElementsByClassName("TabPanelLabelActive")[0];
	if (subtab !== undefined) {
		if (/Details/.test(subtab.innerHTML.trim())) {
			// skip Details Section because counting it broken there a.t.m.
		} else {
			countTables();
		}
	}
}

function countTables() {
    //for dialog-hd
    var dialogBars = document.getElementsByClassName('dialog-hd');
    if (( dialogBars !== undefined ) || (dialogBars.length < 0)) {
        //console.log(dialogBars.length);
        if (dialogBars.length === 1) {
            if ( dialogBars[0] !== undefined ) {
                var idname = dialogBars[0].id;
                var prefix = idname.split('-bar')[0];
                var namepart = prefix.split('_');
                var part = namepart[1];
                var name = namepart[0];
                var outertable;
                if (part === undefined) {
                    //console.log("iterating through first "+name);
                    outertable = document.getElementById("outerTable");
                } else {
                    part = "_"+part;
                    //console.log("iterating "+name+" with part "+part);
                    outertable = document.getElementById("outerTable"+part);
                    //console.log(outertable);
                    if ((outertable == null)||(outertable === undefined)) {
                        // fallback to no part query
                        //console.log("ahhh");
                        outertable = document.getElementById("outerTable");
                        //console.log(outertable);
                    }
                }
                if (outertable.getElementsByClassName("empty-table").length !== 1) {
                    var count = outertable.rows.length - 1;
                    var tBody = dialogBars[0].getElementsByTagName('tbody')[0];
                    var tR = tBody.getElementsByTagName('tr')[0];
                    var tD = tR.getElementsByTagName('td')[0];
                    var span = tR.getElementsByTagName('span')[0];
                    var node = document.createElement("span");
                    node.innerHTML='<span class="label">&nbsp;&nbsp;&nbsp;&nbsp;<i>Count: '+count+'</i></span>';
                    span.appendChild(node);
                    //var x = tR.insertCell(2);
                    //x.innerHTML='<span class="label">Count: '+count+'</span>';
                }
            }
        } else {
            for (var i = 0; i < dialogBars.length; i++) {
                //console.log(dialogBars[i]);
                if ( dialogBars[i] !== undefined ) {
                    var idname = dialogBars[i].id;
                    var prefix = idname.split('-bar')[0];
                    var namepart = prefix.split('_');
                    var part = namepart[1];
                    var name = namepart[0];
                    var outertable;
                    if (part === undefined) {
                        //console.log("iterating through first "+name);
                        outertable = document.getElementById("outerTable");
                    } else {
                        part = "_"+part;
                        //console.log("iterating "+name+" with part "+part);
                        outertable = document.getElementById("outerTable"+part);
                    }
                    if (outertable.getElementsByClassName("empty-table").length !== 1) {
                        var count = outertable.rows.length - 1;
                        var tBody = dialogBars[i].getElementsByTagName('tbody')[0];
                        var tR = tBody.getElementsByTagName('tr')[1];
                        var w = tR.insertCell(-1);
                        w.innerHTML='<div class="separator"></div>';
                        var x = tR.insertCell(-1);
                        x.innerHTML='<span class="label"><i>Count: '+count+'</i></span>';
                    }
                }
            }
        }
    }
}