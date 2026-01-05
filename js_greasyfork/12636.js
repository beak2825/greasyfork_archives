// ==UserScript==
// @name           Search Page Modification
// @namespace      HR_74 Modified Search
// @include        http://glb.warriorgeneral.com/game/search.pl*
// @copyright      2015 - High_Roller74
// @version        1.0
// @description    Modified Search Page Script
// @downloadURL https://update.greasyfork.org/scripts/12636/Search%20Page%20Modification.user.js
// @updateURL https://update.greasyfork.org/scripts/12636/Search%20Page%20Modification.meta.js
// ==/UserScript==

window.setTimeout( function() {
    main();
}, 100);

var atts = ["Arch", "Agent", "Contract Expire", "SP Value", "Open"];

function main() {

    var results = document.getElementsByClassName("search_name_head");
    if (results == null) return;
    results = results[0];
    results.style.width = "150px";
    for (var i=0; i<atts.length; i++) {
        var td = document.createElement("td");
        td.innerHTML = atts[i];   
		results.parentNode.insertBefore(td, results.parentNode.lastChild.previousSibling);
    }

    var a = document.getElementsByTagName("a");
    for (var i=0; i<a.length; i++) {
        if (a[i].href.toString().indexOf("/game/player.pl") != -1) {
            getInetPage(a[i].href.toString(),handlePlayer);
        }
    }
}

function handlePlayer(address, page) {
    var div = document.createElement("div");
    div.innerHTML = page.responseText.replace(/<img/g,"<div").replace(/\/img/g,"/div>");

    var attributes = new Array();
	
	var arch = "";
	var a = div.innerHTML.split("set_tip('");
	if (a.length > 1) {
		arch = a[1].split("', ")[0];
	}
	attributes.push(arch);

	var agent = "";
	if(div.getElementsByClassName("vital_data")[3].innerHTML == "None (Free Agent)")
	{
		agent = div.getElementsByClassName("vital_data")[4].innerHTML;
	}
	else
	{
		agent = div.getElementsByClassName("vital_data")[5].innerHTML;
	}
	attributes.push(agent);
	
	var exp = "";
	if(div.getElementsByClassName("vital_data")[3].innerHTML == "None (Free Agent)")
	{
		exp = "---";
	}
	else
	{
		exp1 = div.getElementsByClassName("vital_data")[3].innerHTML;
		exp2 = exp1.split('Exp. s');
		exp3 = exp2[1].split('<span');
		exp = 'S' + exp3[0];
	}
	attributes.push(exp);
	
	var spVal = "";
	spVal = div.getElementsByClassName("current_player_value")[0].textContent;
	attributes.push(spVal);
	
	
	var open = "";
	var open2 = div.getElementsByClassName('medium_head').length;
	if(open2 > 2)
	{
		open = 'YES';
	}
	else
	{
		open = 'NO';
	}
	attributes.push(open);
	
	var v = 2;
    var r = [0,1,2,3,4,5];
    var a = document.getElementsByTagName("a");
    for (var i=0; i<a.length; i++) {
        if (a[i].href.toString() == address) {
            for (var att=0; att<attributes.length; att++) {
                var td = document.createElement("td");
                td.innerHTML = "<div>"+attributes[r[att]]+"</div>";
                a[i].parentNode.parentNode.insertBefore(td, a[i].parentNode.parentNode.lastChild.previousSibling);
            }
        }
    }
}

function getInetPage(address, func) {
    console.log("getInetPage : "+address);
    var req = new XMLHttpRequest();
	req.open( 'GET', address, true );
	req.onload = function() {
		if (this.status != 200) {
			alert("pbr gm script: Error "+this.status+" loading "+address);
		}
		else {
			console.log("loaded: "+address)
			func(address,this);
		}
	};

	req.send(null);
	return req;
}