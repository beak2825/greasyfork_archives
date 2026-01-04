// ==UserScript==
// @name         Universal Healthcare Revives
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  To request a revive from the Universal Healthcare Alliance
// @author       Natty_Boh[1651049]
// @match        https://www.torn.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @connect      tornuhc.eu
// @downloadURL https://update.greasyfork.org/scripts/412591/Universal%20Healthcare%20Revives.user.js
// @updateURL https://update.greasyfork.org/scripts/412591/Universal%20Healthcare%20Revives.meta.js
// ==/UserScript==
 
 
'use strict';
setTimeout(renderButton, 500);
 
GM_addStyle ( `
    .uhc {
	box-shadow:inset 0px 1px 0px 0px #cf866c;
	background:linear-gradient(to bottom, #d0451b 5%, #bc3315 100%);
	background-color:#d0451b;
	border-radius:1em;
	border:1px solid #942911;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:.75em;
	padding:.3em .5em;
	text-decoration:none;
	text-shadow:0px 1px 0px #854629;
    margin-bottom: .7em;
}
.uhc:hover {
	background:linear-gradient(to bottom, #bc3315 5%, #d0451b 100%);
	background-color:#bc3315;
}
.uhc:active {
	position:relative;
	top:1px;
}
` );
 
function renderButton(){
    if (!document.getElementById('uhc-button')) {
        var sidebar = getSidebar()
        if(sidebar.statusIcons.icons.hospital) {
            let elem;
            if (sidebar.windowSize != 'mobile') {
                elem = document.querySelector ( '.life___PlnzK' )
            }
            if (sidebar.windowSize == 'mobile') {
                elem = document.querySelector ( '.header-buttons-wrapper' )
            }
            if (elem != null) {
                let html = `<a href="#" class="uhc" id="uhc-button">REVIVE ME</a>`
                elem.children[0].insertAdjacentHTML('beforebegin', html);
                const uhcButton = document.getElementById('uhc-button');
                uhcButton.addEventListener('click', function () {
                checkAndTransmit()
            });
        }
        }
    }
    setTimeout(renderButton, 500)
}
 
function checkAndTransmit() {
    let sidebarData = getSidebar()
    let pid = sidebarData.user.userID
    let name = sidebarData.user.name
    let faction = sidebarData.statusIcons.icons.faction.subtitle.split(' of ')[1];
    let source = "UHC Script"
    let hospitalIcon = sidebarData.statusIcons.icons.hospital
    if (hospitalIcon == null) {
        alert('You are not in the hospital!')
    } else {
        var obj = new Object();
        obj.userID = pid;
        obj.userName = name;
        obj.factionName = faction;
        obj.source = source;
        var jsonString= JSON.stringify(obj);
        let url = 'https://tornuhc.eu/api/request'
        GM.xmlHttpRequest({
            method: 'POST',
            url: url,
            data: jsonString,
            headers:    {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                if (response.status == '200') {
                    alert('Sent to UHC! Please pay your reviver 2 xanax or $1.8m')
                } else {
                    alert(JSON.parse(response.responseText).reason)
                }
            },
            onerror: function (error) {
                alert('Something went wrong, please let Natty_Boh know')
            }
        })
    }
}
 
function getSidebar() {
    let key = Object.keys(sessionStorage).find(key => /sidebarData\d+/.test(key));
    let sidebarData = JSON.parse(sessionStorage.getItem(key))
    return sidebarData
}