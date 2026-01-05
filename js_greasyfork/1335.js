// ==UserScript==
// @name       HNR Filter
// @namespace  http://www.partis.si/uporabnik/351136
// @version    0.9
// @description  Test HNR filter skripta
// @match      http://www.partis.si/torrent/seznami3/*
// @copyright  2014+, NoBody
// @downloadURL https://update.greasyfork.org/scripts/1335/HNR%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/1335/HNR%20Filter.meta.js
// ==/UserScript==

//Get Table Header Elements
var head_ratio = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[1];
var head_povez = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[2];
var head_active = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[3];
var head_koncan = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[4];
var head_seeded = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[5];
var head_leeched = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[6];
var head_times = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[7];
var head_date = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[8];

//Resize table
head_ratio.setAttribute("style", "min-width: 120px;");
head_povez.setAttribute("style", "min-width: 120px;");
head_active.setAttribute("style", "min-width: 120px;");
head_koncan.setAttribute("style", "min-width: 120px;");
head_seeded.setAttribute("style", "min-width: 120px;");
head_leeched.setAttribute("style", "min-width: 120px;");
head_times.setAttribute("style", "min-width: 120px;");


/// Create Panel Elements ///

//Ratio
var numericc = document.createElement("input");
numericc.type = "number";
numericc.setAttribute("value", "0.40");
numericc.setAttribute("name", "maxratio");
numericc.setAttribute("step", "0.10");
numericc.setAttribute("style", "width:50px;");
numericc.setAttribute("min", "0");
head_ratio.appendChild(document.createTextNode(" pod"));
head_ratio.appendChild(document.createElement('br'));
head_ratio.appendChild(numericc);
head_ratio.appendChild(document.createElement('p'));

//Seeded
var seededvar = document.createElement("input");
seededvar.type = "number";
seededvar.setAttribute("name", "seedlimit");
seededvar.setAttribute("step", "100");
seededvar.setAttribute("style", "width:60px;");
seededvar.setAttribute("min", "0");
head_seeded.appendChild(document.createTextNode(" pod"));
head_seeded.appendChild(document.createElement('br'));
head_seeded.appendChild(seededvar);
head_seeded.appendChild(document.createTextNode(" MB"));
head_seeded.appendChild(document.createElement('p'));

//Leeched
var leechedvar = document.createElement("input");
leechedvar.type = "number";
leechedvar.setAttribute("name", "leechlimit");
leechedvar.setAttribute("step", "100");
leechedvar.setAttribute("style", "width:60px;");
leechedvar.setAttribute("min", "0");
head_leeched.appendChild(document.createTextNode(" nad"));
head_leeched.appendChild(document.createElement('br'));
head_leeched.appendChild(leechedvar);
head_leeched.appendChild(document.createTextNode(" MB"));
head_leeched.appendChild(document.createElement('p'));

//Connectable
var connectvar = document.createElement("input");
connectvar.type = "checkbox";
connectvar.setAttribute("name", "ifconnect");
head_povez.setAttribute("align", "center");
head_povez.appendChild(document.createElement('br'));
head_povez.appendChild(connectvar);
head_povez.appendChild(document.createElement('p'));

//Active
var activever = document.createElement("input");
activever.type = "checkbox";
activever.setAttribute("name", "ifactive");
head_active.setAttribute("align", "center");
head_active.appendChild(document.createElement('br'));
head_active.appendChild(activever);
head_active.appendChild(document.createElement('p'));

//Ended
var koncanvar = document.createElement("input");
koncanvar.type = "checkbox";
koncanvar.setAttribute("name", "ifended");
head_koncan.setAttribute("align", "center");
head_koncan.appendChild(document.createElement('br'));
head_koncan.appendChild(koncanvar);
head_koncan.appendChild(document.createElement('p'));

//Times
var timesvar = document.createElement("input");
timesvar.type = "number";
timesvar.setAttribute("value", "0");
timesvar.setAttribute("name", "timeslimit");
timesvar.setAttribute("step", "1");
timesvar.setAttribute("style", "width:50px;");
timesvar.setAttribute("min", "0");
head_times.appendChild(document.createElement('br'));
head_times.appendChild(timesvar);
head_times.appendChild(document.createElement('p'));

//GoGoGadgetTM button
var gogovar = document.createElement("input");
gogovar.type = "button";
gogovar.setAttribute("name", "GoGoGadgetTM");
gogovar.setAttribute("value", "Filtriraj");
gogovar.setAttribute("style", "min-width: 150px;");
head_date.appendChild(document.createElement('br'));
head_date.appendChild(gogovar);
head_date.appendChild(document.createElement('p'));
gogovar.addEventListener("click", gogogo, false);


function gogogo() {
    
	var elem = document.getElementsByClassName("tabelatr1");

	for (var i = 0; i <= elem.length - 1; i += 1) {
		var inner_elem = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[0];
		var inner_connect = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[1];
		var inner_active = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[2];
		var inner_ended = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[3];
		var inner_seeded = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[4];
		var inner_leeched = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[5];
		var inner_times = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[6];
        
        var isalltrue = true;
        
    	if (inner_elem.innerHTML.trim() != "Infinity" && isalltrue == true) {
        	if (parseFloat(inner_elem.innerHTML.trim().replace(",", ".")) >= document.getElementsByName("maxratio")[0].value && isalltrue == true) {
        		isalltrue = false;
        	}
        //} else { isalltrue = false;
        }
        
        
        var checkConnect;
        if (inner_connect.innerHTML.indexOf("/img/icons/accept.png") != -1) {
            checkConnect = true;
        } else if (inner_connect.innerHTML.indexOf("/img/icons/delete.png") != -1) 
        { checkConnect = false; }
            
		if (document.getElementsByName("ifconnect")[0].checked != checkConnect && isalltrue == true) {
			isalltrue = false;
		}
        
        var activeConnect;
        if (inner_active.innerHTML.indexOf("/img/icons/accept.png") != -1) {
            activeConnect = true;
        } else if (inner_active.innerHTML.indexOf("/img/icons/delete.png") != -1) 
        { activeConnect = false; }
            
		if (document.getElementsByName("ifactive")[0].checked != activeConnect && isalltrue == true) {
			isalltrue = false;
		}
        
        var endConnect;
        if (inner_ended.innerHTML.indexOf("/img/icons/accept.png") != -1) {
            endConnect = true;
        } else if (inner_ended.innerHTML.indexOf("/img/icons/delete.png") != -1) 
        { endConnect = false; }
            
		if (document.getElementsByName("ifended")[0].checked != endConnect && isalltrue == true) {
			isalltrue = false;
		}
        
        
        //if (parseFloat(inner_times.innerHTML.trim().replace(",", ".")) == document.getElementsByName("timeslimit")[0].value && isalltrue == true) {
        //	isalltrue = false;
        //}
        
        
        
/*
        if ( && isalltrue == true) {
            isalltrue = false;
        }
*/      
        
        
        if (isalltrue == true) {
        	elem[i].setAttribute("style", "");
        } else {
            elem[i].setAttribute("style", "display:none;");
        }
	}
    
}





