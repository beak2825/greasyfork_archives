// ==UserScript==
// @name         Tag Incomings
// @version      0.4.5
// @description  Checks for new incomings
// @author       FunnyPocketBook
// @match        https://*/game.php?village=*&screen=overview_villages&mode=incomings*
// @grant        none
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/38025/Tag%20Incomings.user.js
// @updateURL https://update.greasyfork.org/scripts/38025/Tag%20Incomings.meta.js
// ==/UserScript==


setInterval(function() {
    "use strict";
    checker();
    tagger();
}, 10000);

function checker() {
    "use strict";
    var link = $("#incomings_cell").children();
    localStorage.setItem("incomings", document.getElementById("incomings_amount").innerHTML);
    var interval = setInterval(function() {
        localStorage.setItem("incomings2", document.getElementById("incomings_amount").innerHTML);
        if(parseInt(localStorage.getItem("incomings2")) > parseInt(localStorage.getItem("incomings"))) {
            window.location.reload();
            link[0].click();
            tagger();
            localStorage.setItem("incomings", document.getElementById("incomings_amount").innerHTML);
            clearInterval(interval);
        } else if (parseInt(localStorage.getItem("incomings2")) < parseInt(localStorage.getItem("incomings"))) {
            localStorage.setItem("incomings", document.getElementById("incomings_amount").innerHTML);
        }
    }, 190);
}

function tagger() {
	"use strict";
	var incRow = document.querySelector("#incomings_table").rows.length;
	for (var i = 2; i < incRow; i++) {
		var incName = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(1) > span > span > a:nth-child(1) > span.quickedit-label");
        var nobleIcon = "";
        if (document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(1) > span > span > a:nth-child(1) > span:nth-child(2) > img")) {
            nobleIcon = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(1) > span > span > a:nth-child(1) > span:nth-child(2) > img").getAttribute("src");
        }
        incName = incName.innerHTML;
		incName = incName.replace(/(\r\n|\n|\r)/gm,"").replace(/ /g,'').toLowerCase();
        if (nobleIcon.includes("snob.png") && !incName.includes("noble")) {
            document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(1) > span > span > a.rename-icon").click();
            document.querySelector('#incomings_table > tbody > tr:nth-child(' + i + ') > td:nth-child(1) > span > span.quickedit-edit > input[type="text"]:nth-child(1)').value = "Noble";
            document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(1) > span > span.quickedit-edit > input.btn").click();
        } else if (incName.includes("attack") || incName.includes("support")) {
			document.querySelector('#incomings_table > tbody > tr:nth-child(' + i + ') > td:nth-child(1) > input[type="checkbox"]:nth-child(2)').click();
		}
	}
	setTimeout(function() {
		document.querySelector("#incomings_table > tbody > tr:nth-child(" + incRow + ") > th:nth-child(2) > input:nth-child(2)").click();
	}, 300);
}