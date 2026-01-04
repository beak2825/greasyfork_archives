// ==UserScript==
// @name        BlueCat Address Manager Expand Tree Button
// @namespace   *
// @description Expand Tree Button for TreeView in BlueCat Address Manager
// @include     */app*
// @license     MIT
// @version     9
// @grant       none
// @author      Marius Galm
// @copyright   2018, Marius Galm
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/38696/BlueCat%20Address%20Manager%20Expand%20Tree%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/38696/BlueCat%20Address%20Manager%20Expand%20Tree%20Button.meta.js
// ==/UserScript==

// do when there are container with class "TreeExpandClosed"
// trigger click event on "TreeExpand" class object
function expandLevel() {
    if (document.getElementsByClassName("TreeExpandClosed").length > 0) {
        var parent_els = document.getElementsByClassName("TreeExpandClosed");
        for (i = 0; i < parent_els.length; i++) {
            var els = parent_els[i].getElementsByClassName("TreeExpand");
            for (j = 0; j < els.length; j++) {
                els[j].click();
            }
        }
        // scroll back to top because the BlueCat interface gets jumpy while expanding
        scroll(0,0);
        document.getElementById('collapseButton').innerHTML = stripTag(document.getElementById('collapseButton').innerHTML);
    } else {
        var old = document.getElementById('expandButton').innerHTML;
        document.getElementById('expandButton').innerHTML = "<s>"+old+"</s>";
    }
}

// do when there are container with class "TreeExpandOpen"
// trigger click event on "TreeExpand" class object
function collapseLevel() {
    if ((document.getElementsByClassName("TreeExpandOpen").length > 0)||(document.getElementsByClassName("TreeStateChildrenYes-ExpandOpen").length > 0)) {
        var parent_els = document.getElementsByClassName("TreeExpandOpen");
        for (i = 0; i < parent_els.length; i++) {
            var els = parent_els[i].getElementsByClassName("TreeExpand");
            for (j = 0; j < els.length; j++) {
                els[j].click();
            }
        }
        // scroll back to top because the BlueCat interface gets jumpy while expanding
        scroll(0,0);
        document.getElementById('expandButton').innerHTML = stripTag(document.getElementById('expandButton').innerHTML);
    } else {
        var old = document.getElementById('collapseButton').innerHTML;
        document.getElementById('collapseButton').innerHTML = "<s>"+old+"</s>";
    }
}

// remove the disable style
function stripTag(html)
{
    html = html.replace(/<s>/g, "");
    html = html.replace(/<\/s>/g, "");
    return html;
}

if (document.readyState === "interactive" ) {
    var page = document.childNodes[2].nodeValue;
    if (/ Page: ConfigurationPage /.test(page)) {
        var subtab = document.getElementsByClassName("TabPanelLabelActive")[0];
        if (subtab.innerHTML.trim() == "IPv4" ) {
            // Add button to first table
            var topBars = document.getElementsByClassName('value-tree-topToolBar');
            if (( topBars !== undefined ) || (topBars.length <= 0)) {
                var topBar = topBars[0];
                if ( topBar !== undefined ) {
                    var comboBars = topBar.getElementsByClassName('combo-button-bar');
                    if ((comboBars !== undefined) || (comboBars.length <= 0)) {
                        var comboBar = comboBars[0];
                        var tBody = comboBar.getElementsByTagName('tbody')[0];
                        var tR = tBody.getElementsByTagName('tr')[0];
                        var w = tR.insertCell(-1);
                        w.innerHTML='<div class="separator"></div>';
                        var x = tR.insertCell(-1);
                        x.innerHTML='<span id="expandButton"><b>Expand</b></span>';
                        var lable = document.getElementById('expandButton');
                        lable.addEventListener("click",() => { expandLevel(); },false);
                        var y = tR.insertCell(-1);
                        y.innerHTML='<div class="separator"></div>';
                        var z = tR.insertCell(-1);
                        z.innerHTML='<span id="collapseButton"><s><b>Collapse</b></s></span>';
                        var lable2 = document.getElementById('collapseButton');
                        lable2.addEventListener("click",() => { collapseLevel(); },false);
                    }
                }
            }
        } else if (subtab.innerHTML.trim() == "Views" ) {
            // Add button to first table
            var topBars = document.getElementsByClassName('value-tree-topToolBar');
            if (( topBars !== undefined ) || (topBars.length <= 0)) {
                var topBar = topBars[0];
                if ( topBar !== undefined ) {
                    var comboBars = topBar.getElementsByClassName('combo-button-bar');
                    if ((comboBars !== undefined) || (comboBars.length <= 0)) {
                        var comboBar = comboBars[0];
                        var tBody = comboBar.getElementsByTagName('tbody')[0];
                        var tR = tBody.getElementsByTagName('tr')[0];
                        var w = tR.insertCell(-1);
                        w.innerHTML='<div class="separator"></div>';
                        var x = tR.insertCell(-1);
                        x.innerHTML='<span id="expandButton"><b>Expand</b></span>';
                        var lable = document.getElementById('expandButton');
                        lable.addEventListener("click",() => { expandLevel(); },false);
                        var y = tR.insertCell(-1);
                        y.innerHTML='<div class="separator"></div>';
                        var z = tR.insertCell(-1);
                        z.innerHTML='<span id="collapseButton"><s><b>Collapse</b></s></span>';
                        var lable2 = document.getElementById('collapseButton');
                        lable2.addEventListener("click",() => { collapseLevel(); },false);
                    }
				}
            }
        } else if (subtab.innerHTML.trim() == "IPv6" ) {
            // Unsupported for now :D
        }
    } else if (/ Page: GroupList /.test(page)) {
        // Add button to first table
        var topBars = document.getElementsByClassName('value-tree-topToolBar');
        if ((topBars !== undefined) || (topBars.length <= 0)) {
            var topBar = topBars[0];
            if ( topBar !== undefined ) {
                var comboBars = topBar.getElementsByClassName('combo-button-bar');
                if ((comboBars !== undefined) || (comboBars.length <= 0)) {
                    var comboBar = comboBars[0];
                    var tBody = comboBar.getElementsByTagName('tbody')[0];
                    var tR = tBody.getElementsByTagName('tr')[0];
                    var w = tR.insertCell(-1);
                    w.innerHTML='<div class="separator"></div>';
                    var x = tR.insertCell(-1);
                    x.innerHTML='<span id="expandButton"><b>Expand</b></span>';
                    var lable = document.getElementById('expandButton');
                    lable.addEventListener("click",() => { expandLevel(); },false);
                    var y = tR.insertCell(-1);
                    y.innerHTML='<div class="separator"></div>';
                    var z = tR.insertCell(-1);
                    z.innerHTML='<span id="collapseButton"><s><b>Collapse</b></s></span>';
                    var lable2 = document.getElementById('collapseButton');
                    lable2.addEventListener("click",() => { collapseLevel(); },false);
                }
            }
        }
    } else if (/ Page: TagGroup /.test(page)) {
        // Add button to first table
        var topBars = document.getElementsByClassName('value-tree-topToolBar');
        if (( topBars !== undefined ) || (topBars.length <= 0)) {
            var topBar = topBars[0];
            if ( topBar !== undefined ) {
                var comboBars = topBar.getElementsByClassName('combo-button-bar');
                if ((comboBars !== undefined) || (comboBars.length <= 0)) {
                    var comboBar = comboBars[0];
                    var tBody = comboBar.getElementsByTagName('tbody')[0];
                    var tR = tBody.getElementsByTagName('tr')[0];
                    var w = tR.insertCell(-1);
                    w.innerHTML='<div class="separator"></div>';
                    var x = tR.insertCell(-1);
                    x.innerHTML='<span id="expandButton"><b>Expand</b></span>';
                    var lable = document.getElementById('expandButton');
                    lable.addEventListener("click",() => { expandLevel(); },false);
                    var y = tR.insertCell(-1);
                    y.innerHTML='<div class="separator"></div>';
                    var z = tR.insertCell(-1);
                    z.innerHTML='<span id="collapseButton"><s><b>Collapse</b></s></span>';
                    var lable2 = document.getElementById('collapseButton');
                    lable2.addEventListener("click",() => { collapseLevel(); },false);
                }
            }
        }
    }
}