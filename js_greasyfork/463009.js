// ==UserScript==
// @name         Whackamole Redesigned
// @namespace    m0tch.whackamole
// @version      0.1
// @description  Update styles for whackamole
// @match        https://whackamole.thatastronautguy.space/factionmembers
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=herokuapp.com
// @grant        GM_addStyle
// @author       m0tch
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463009/Whackamole%20Redesigned.user.js
// @updateURL https://update.greasyfork.org/scripts/463009/Whackamole%20Redesigned.meta.js
// ==/UserScript==


GM_addStyle(`
table td {
    padding: 5px 10px;
}
table th {
    padding: 5px 10px;
}
table {
    border-collapse: collapse;
}
tr + tr:hover {
    background-color:lightgray !important;
}
.dark-mode tr + tr:hover {
    background-color:#272727 !important;
}
tr:first-child {
    text-decoration: none;
}

.dark-mode a {
    color: lightblue;
}

:root {

}

.highlightred {
    background-color: #ffd2d2;
}
.highlightyellow {
    background-color: #f1e740;
}
.highlightgreen {
    background-color: #d7e2cc;
}

.dark-mode .highlightred {
    background-color: #602525 !important;
}
.dark-mode .highlightyellow {
    background-color: #5c580f !important;
}
.dark-mode .highlightgreen {
    background-color: #3d4b28 !important;
}

.dark-mode {
    background-color: #121212;
    color: white !important;
}

.dark-mode table {
    background-color: rgb(49,49,49);
}
`);

function updateRow(node) {
	if (!node) return;

    let profileLink = node.querySelector('a[href*="XID"]');
    if (!profileLink) {
        //assume that no profile link is the first row, which is the label row
        let headerNode = document.createElement("th");
        headerNode.innerHTML = "Lv";
        node.appendChild(headerNode);
        node.insertBefore(headerNode, node.children[1]);
        node.children[0].innerText = node.children[0].innerText.substring(8);
        return;
    }
    let status = node.children[2].innerText;
    let statusIcon = "🟢";
    if (status == "Idle") {
        statusIcon = "🟡";
    }
    if (status == "Offline") {
        statusIcon = "➖";
    }

	let profileText = profileLink.innerText;
	let lvNode = document.createElement("td");
    lvNode.innerText = profileText.substring(profileText.indexOf("[") + 1, profileText.indexOf("]"));
    node.children[0].children[0].innerText = statusIcon + " " + node.children[0].innerText.substring(profileText.indexOf("]") + 2);
    node.children[0].children[0].style = "text-decoration: none;";

    node.insertBefore(lvNode, node.children[1]);

}

function updateColorSelects() {
    var tempSelects = document.querySelectorAll(".color-select");
    tempSelects.forEach((s) => s.replaceWith(s.cloneNode(true)));
    var colorSelects = document.querySelectorAll(".color-select");

    for (var i = 0; i < colorSelects.length; i++) {
        var row = colorSelects[i].parentNode.parentNode;
        var rowId = row.id;
        row.style = "";
        row.classList.remove('highlightred');
        row.classList.remove('highlightyellow');
        row.classList.remove('highlightgreen');

        var color = localStorage.getItem(rowId);
        if (color && color != "transparent") {
            colorSelects[i].value = color;
            row.classList.add('highlight' + color);
            // localStorage.setItem(rowId, color);
            //row.style.backgroundColor = color;
        }


        colorSelects[i].addEventListener("change", function(e) {
            var row = this.parentNode.parentNode;
            var rowId = row.id;
            var color = this.value;
            row.classList.remove('highlightred');
            row.classList.remove('highlightyellow');
            row.classList.remove('highlightgreen');
            if(color != "transparent"){
                row.classList.add('highlight' + color);
            }
            localStorage.setItem(rowId, color);
        });
    }
}

function updateAllRows(node) {
	if (!node) node = Array.from(document.querySelectorAll("table"));
	if (!node) return;

	if (!(node instanceof Array)) {
		node = [node];
	}

	node.forEach((n) => n.querySelectorAll("tr").forEach((e) => updateRow(e)));
    updateColorSelects();
}

function addDarkMode(){
    var darkModeEnabled = localStorage.getItem("darkmode");
    var buttonText = "Enable Dark Mode";
    if (darkModeEnabled && darkModeEnabled == "true") {
        document.body.classList.add("dark-mode");
        buttonText = "Disable Dark Mode";
        document.querySelector(':root').style.setProperty('color-scheme', 'dark');

    }

    let darkModeButton = document.createElement("input");
	darkModeButton.type = "button";
	darkModeButton.value = buttonText;
    darkModeButton.style = "margin-right: 4px;";

    darkModeButton.addEventListener("click", function(e) {
        if(document.body.classList.contains("dark-mode")){
            document.querySelector(':root').style.setProperty('color-scheme', 'light');
            document.body.classList.remove("dark-mode");
            darkModeButton.value = "Enable Dark Mode";
            localStorage.setItem("darkmode", false);
        }
        else{
            document.querySelector(':root').style.setProperty('color-scheme', 'dark');
            document.body.classList.add("dark-mode");
            darkModeButton.value = "Disable Dark Mode";
            localStorage.setItem("darkmode", true);
        }
    });

    document.querySelector("form").appendChild(darkModeButton);
}

updateAllRows();
addDarkMode();