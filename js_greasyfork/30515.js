// ==UserScript==
// @name       Fussballcup Plus
// @include https://fussballcup.de/*
// @version    0.3
// @description  Erweiterung der Menüleiste!
// @copyright  mot33 | Sempervivum, 2017
// @namespace https://greasyfork.org/users/83290
// @connect <value>
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @run-at      document-end
// @run-at      document-idle
// @grant       GM_xmlhttpRequest
// @require     https://unpkg.com/sweetalert2@7.0.6/dist/sweetalert2.all.js
// @downloadURL https://update.greasyfork.org/scripts/30515/Fussballcup%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/30515/Fussballcup%20Plus.meta.js
// ==/UserScript==

// ############### CONFIGURATION ###############
var icon_path = "http://forum.fussballcup.de/images/gamed/header_de.png";
var icon_config = "width='350px'";
// ######################################

(function() {
    var vorhanden = 0;
    var einladung = 0;
    var call = 0;
    var jetzt = new Date();
    GM_addStyle("h2#swal2-title {display: none;}");
    GM_addStyle(".aniopen {animation: expand 1000ms cubic-bezier(0.185, 0.455, 0.395, 1.375);}");
    GM_addStyle(".aniclose {animation: expand 1000ms cubic-bezier(0.185, 0.455, 0.395, 1.375) reverse forwards;}");
    GM_addStyle("@keyframes expand {0% {transform: scale(0)} 100% {transform: scale(1)}");

function firstUse()
{
    if(!GM_getValue('Ingame_Greeting02'))
    {
        var modhtml = "<img "+ icon_config + " src='" + icon_path + "' />"+"<br></br><p><FONT SIZE='3'>Vielen Dank für die Installation von diesem Tool, welche nun erfolgreich abgeschlossen wurde.</p><p> Dieses Tool verknüpft unter anderem das Spiel mit dem Forum.</p><p>Für eine optimale Nutzung wird daher ein Forum Account benötigt!</p><br><p>Viel Spaß mit dem Tool wünscht<br>mot33</p>";
        setTimeout(function() {
            swal({
                html: modhtml,
                type: "info",
                animation: false,
                showCloseButton: true,
                showConfirmButton: false,
                customClass: 'aniopen',
                onOpen: function(modal) {
                    var el = document.getElementsByClassName('swal2-close')[0],
                        elClone = el.cloneNode(true);
                    el.parentNode.replaceChild(elClone, el);
                    elClone.addEventListener('click', function() {
                        modal.classList.remove('aniopen');
                        setTimeout(function() {
                            modal.classList.add('aniclose');
                            modal.addEventListener("animationend", function() {
                                swal.close();
                            });
                        }, 50);
                    });
                }
            });
        }, 500);
        GM_setValue('Ingame_Greeting02', true);
    }
}

firstUse();
})();

///////////////////////////////////////////////////////////////////////////////////

// ############### CONFIGURATION ###############
var icon_path = "https://abload.de/img/navigation_spriteutjz3.png";
var icon_config = "width='1px'";
// ######################################

// ############### CONFIGURATION ###############
var icon_pathp = "https://abload.de/img/plus-304947_6404dlo4.png";
var icon_configp = "width='16px'";
// ######################################

function grafik()
{
    	if(!document.getElementById("Grafikabteilung"))
        {
          document.getElementById("user-profile-signatures").innerHTML +="<div id='Grafikabteilung'></div>";

            var grafik = document.getElementsByClassName("last")[0].firstElementChild.getAttribute("href");
    		document.getElementsByClassName("category-links category4")[0].innerHTML += "<b style='bottom:0px;padding:0px ;'>"+"<a target= '_blank' href=http://forum.fussballcup.de/forumdisplay.php?f=19 " + "'class: last'<span>Grafikabteilung</span></b></a><img "+ icon_config + " src='" + icon_path + "' />";

        }
    }
window.setTimeout(function() { grafik();}, 2000);
window.setInterval(function() { grafik(); }, 5000);

////////////////////////////////////////////////////////////////////////////////

// ############### CONFIGURATION ###############
var icon_path = "https://abload.de/img/navigation_spriteutjz3.png";
var icon_config = "width='1px'";
// ######################################

function tools()
{
    	if(!document.getElementById("Tools"))
        {
          document.getElementById("user-tricotshop-index").innerHTML += "<div id='Tools'></div>";

            var tools = document.getElementsByClassName("last")[0].firstElementChild.getAttribute("href");
    		document.getElementsByClassName("category-links category5")[0].innerHTML += "<b style='bottom:0px;padding:0px ;'>"+"<a target= '_blank' href=http://forum.fussballcup.de/forumdisplay.php?f=176 " + "'<span>Tools</span></b></a><img "+ icon_config + " src='" + icon_path + "' />";
        }
    }
window.setTimeout(function() { tools();}, 2000);
window.setInterval(function() { tools(); }, 5000);

////////////////////////////////////////////////////////////////////////////////

// ############### CONFIGURATION ###############
var icon_path = "https://abload.de/img/navigation_spriteutjz3.png";
var icon_config = "width='1px'";
// ######################################

function rechner()
{
    	if(!document.getElementById("Rechner"))
        {
          document.getElementById("user-transfermarket-index").innerHTML += "<div id='Rechner'></div>";

            var rechner = document.getElementsByClassName("last")[0].firstElementChild.getAttribute("href");
    		document.getElementsByClassName("category-links category2")[0].innerHTML += "<b style='bottom:0px;padding:0px ;'>"+"<a target= '_blank' href=http://tsc1996.wixsite.com/fcup-tools/fcup-rechner " + "'<span>Rechner</span></b></a><img "+ icon_config + " src='" + icon_path + "' />";
        }
    }
window.setTimeout(function() { rechner();}, 2000);
window.setInterval(function() { rechner(); }, 5000);

////////////////////////////////////////////////////////////////////////////////

// ############### CONFIGURATION ###############
var icon_path = "https://abload.de/img/navigation_spriteutjz3.png";
var icon_config = "width='1px'";
// ######################################

function club()
{
    	if(!document.getElementById("Club-Lounge"))
        {
          document.getElementById("user-betoffice-index").innerHTML += "<div id='Club-Lounge'></div>";

            var club = document.getElementsByClassName("last")[0].firstElementChild.getAttribute("href");
    		document.getElementsByClassName("category-links category1")[0].innerHTML += "<b style='bottom:0px;padding:0px ;'>"+"<a target= '_blank' href=http://forum.fussballcup.de/forumdisplay.php?f=172 " + "'<span>Club-Lounge</span></b></a><img "+ icon_config + " src='" + icon_path + "' />";
        }
    }
window.setTimeout(function() { club();}, 2000);
window.setInterval(function() { club(); }, 5000);

/////////////////////////////////////////////////////////////////////////////////

// ############### CONFIGURATION ###############
// change URL for other icon for "Alterung"
var icon_path3 = "https://abload.de/img/navigation_green_spri8ujbs.png";
var icon_path1 = "https://abload.de/img/alter-mann-zu-fub-mit7fsec.png";
var icon_config3 = "higth='32px'";
var icon_config1 = "width='16px'";
// ######################################

function alterung()
{
    	if(!document.getElementById("alterung"))
        {
            var alterung = document.getElementsByClassName("handle skills inactive")[0].firstElementChild.getAttribute("href");
			document.getElementsByClassName("handle-container container-handle")[0].innerHTML += "<b style= position:absolute;bottom:8px;> "+" <a  target= '_blank' href=http://forum.fussballcup.de/showthread.php?t=321707"  + "' class='inactive' id='alterung'><img " + icon_config1 + " src='" + icon_path1 + "' /></a>";
    		document.getElementsByClassName("handle-container container-handle")[0].innerHTML += "<b style= position:absolute;bottom:8px;> "+" <a  target= '_blank' href=http://forum.fussballcup.de/showthread.php?t=321707"  + "' class='inactive' id='alterung'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>Alterung</span></b>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<img " + icon_config3 + " src='" + icon_path3 + "' /></a>";
		}
}

window.setTimeout(function() { alterung();}, 2000);
window.setInterval(function() { alterung();}, 5000);

//////////////////////////////////////////////////////////////////////////////

// ############### CONFIGURATION ###############
// change URL for other icon for "Magazin"
var icon_path4 = "https://abload.de/img/navigation_sprite51q2y.png";
var icon_config4 = "higth=32px'";
// ######################################


function magazin()
{
    	if(!document.getElementById("magazin"))
        {
            document.getElementById("press-header").innerHTML +="<div id='magazin'></div>";

            var magazin = document.getElementsByClassName("handle-container")[0].firstElementChild.getAttribute("href");

    		document.getElementsByClassName("handle-container")[0].innerHTML += "<b style= position:absolute;bottom:9px;> "+" <a "+" target= '_blank' href=http://forum.fussballcup.de/forumdisplay.php?f=89"  + " id='magazin'>&nbsp<span>Das Fcup - Magazin</span></b>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<img " + icon_config4 + " src='" + icon_path4 + "' /></a>";
		}
}

window.setTimeout(function() { magazin();}, 2000);
window.setInterval(function() { magazin();}, 5000);


// ############### CONFIGURATION ###############
// change URL for other icon for "Alterung"
var icon_path5 = "https://abload.de/img/navigation_green_spri8ujbs.png";
var icon_config5 = "higth='32px'";
// ######################################

function turnier()
{
    	if(!document.getElementById("turnier"))
        {
            document.getElementById("tournament").innerHTML +="<div id='turnier'></div>";

            var turnier = document.getElementsByClassName("handle-container")[0].firstElementChild.getAttribute("href");

    		document.getElementsByClassName("handle-container")[0].innerHTML += "<b style= position:absolute;bottom:8px;> "+" <a  target= '_blank' href=http://forum.fussballcup.de/forumdisplay.php?f=25"  + "' class='active' id='turnier'>&nbsp<span>Forum - Großturniere</span></b>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<img " + icon_config5 + " src='" + icon_path5 + "' /></a>";
		}
}

window.setTimeout(function() { turnier();}, 2000);
window.setInterval(function() { turnier();}, 5000);

///////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////

// ############### CONFIGURATION ###############
var icon_path6 = "http://fs5.directupload.net/images/170310/nxsl9ity.png";
var icon_config6 = "width='22px'";
// ######################################

function goalgetter()
{
    if(!document.getElementById("goal"))
    {
        document.getElementById("league-table-container").getElementsByClassName("last-column")[0].innerHTML += "<li id='goal'></li>";

    }

    GM_xmlhttpRequest({
        method: "GET",
        url: "http://fussballcup.de/index.php?w=301&area=user&module=statistics&action=goalgetter#/index.php?w=301&area=user&module=statistics&action=goalgetter&_=*",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
         onload: function(responseDetails){
             var inhalt = document.implementation.createHTMLDocument("");
             inhalt.documentElement.innerHTML = responseDetails.responseText;
           var goalgetter = inhalt.getElementById("goalgetters");
            goalgetter = inhalt.querySelectorAll('#goalgetters tbody tr:nth-child(1) a');


             if (goalgetter[0])
             {
             document.getElementById("goal").style.cursor = "default";
             document.getElementById("goal").innerHTML ="<b style=position:absolute;top:645px;left:340px;</b> <img " + icon_config6 + " src='" + icon_path6 + "' />"+"&nbsp&nbsp Top-Torjäger vom Verein: <a href=http://fussballcup.de/index.php?w=301&area=user&module=statistics&action=goalgetter#/index.php?w=301&area=user&module=statistics&action=goalgetter&_=*  <b>"+ goalgetter[0].innerHTML;

             }

        }
    });
}

window.setTimeout(function() { goalgetter(); }, 2000);
window.setInterval(function() {goalgetter(); }, 5000);


////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////

(function() {
    'use strict';
    var tables = [
        {
            selector: ".transfermarket table",
            columns: [{id: "name-column"}, {id: "age-column"}]
        },{
            selector: "table#simulations",
            columns: [{id: 1, sortvalue: true}]
        }
    ];
    function makeSortValues(tbl, icol) {
        var tbl = tbl[0];
        for (var i = 1; i < tbl.rows.length - 1; i++) {
            tbl.rows[i].cells[icol].setAttribute("sortvalue", parseInt(tbl.rows[i].cells[icol].innerHTML.replace(".", "")));
        }
    }
    function sortTables() {
        tables.forEach(function(item, idx) {
            var tbl = $(item.selector).eq(0);
            if (tbl.length != 0 && !tbl.hasClass("sortable")) {
                console.log("triggered");
                tbl.find("th").each(function(ith) {
                    var found = false,
                        th = $(this);
                    item.columns.forEach(function(item,idx) {
                        if (isNaN(parseInt(item.id))) {
                            if (th.hasClass(item.id)) {
                                found = true;
                                if (item.sortvalue) makeSortValues(tbl, ith);
                            }
                        } else {
                            if (ith == item.id) {
                                found = true;
                                if (item.sortvalue) makeSortValues(tbl, ith);
                            }
                        }
                    });
                    if (found) {
                        var sortstatus = document.createElement("span");
                        sortstatus.className = "sort-status";
                        $(this).append($(sortstatus));
                    }
                });
                tbl.addClass('sortable').jqTableKit({
                    'rowEvenClass' : 'odd',
                    'rowOddClass' : 'even'
                });
            }
        });
    }


        var observeDOM = (function(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function(obj, callback){
            if( MutationObserver ){
                // define a new observer
                var obs = new MutationObserver(function(mutations, observer){
                    // if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                        callback();
                });
                // have the observer observe foo for changes in children
                obs.observe( obj, { characterData: true, childList:true, subtree:true });
            }
            else if( eventListenerSupported ){
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    })();

    //observeDOM(document.getElementById('content'), sortTables);
    observeDOM(document.body, sortTables);

})();