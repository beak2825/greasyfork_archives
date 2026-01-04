// ==UserScript==
// @name         Steam Workshop Collection - Server modlist
// @namespace    https://greasyfork.org/en/users/100713-hugepinball
// @version      0.0.2
// @description  Adds some buttons to create and export lists of ModIDs and WorkshopIDs from a mod collection for use in a server config file.
// @author       HugePinball
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @icon         https://avatars.akamai.steamstatic.com/73b523ebbf084f69e2cffbbe1ad5d04679eddbef.jpg
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/508922/Steam%20Workshop%20Collection%20-%20Server%20modlist.user.js
// @updateURL https://update.greasyfork.org/scripts/508922/Steam%20Workshop%20Collection%20-%20Server%20modlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

let $, jQuery;
$ = jQuery = window.jQuery;

$( document ).ready(function() {
    // console.log( "ready!" );

    let WorkshopItemURL = "https://steamcommunity.com/sharedfiles/filedetails/?id="
    let WorkshopItems = "";
    let Mods = "";
	const ModID_Array = [];
	const ModHash = {};
    const listWorkshopItems = [];
    let listWorkshopItemsObj = $("div.collectionChildren > div.collectionItem > div.workshopItem > a");
    const listMods = [];

    function addGlobalStyle(css) {
        let head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function copyToClip(event) {
        if (event.data.str == "WorkshopItems"){
            navigator.clipboard.writeText(WorkshopItems);
        } else if (event.data.str == "Mods"){
			for (let i = 0; i < listWorkshopItems.length; i++) {
				// $("div#ModIDs")[0].innerHTML = $("div#ModIDs")[0].innerHTML + ModHash[listWorkshopItems[i]] + "; ";
				ModID_Array.push(ModHash[listWorkshopItems[i]]);
				// console.log(ModHash[listWorkshopItems[i]] + "; ");
			}
			Mods = "Mods=" + ModID_Array.join(";");
            navigator.clipboard.writeText(Mods);
        }

        alert("Copied the " + event.data.opt + " to clipboard.");
    }
    function getModIDs( wID )
    {
		// $("div#debugPanel")[0].innerText = $("div#debugPanel")[0].innerText + wID + ", ";
        let result = null;
		let mIDs;
        let page = WorkshopItemURL + wID;
        let res = $.ajax({
            url: page,
            type: 'get',
            dataType: 'html',
            async: true,
            success: function(data) {
				cnt = cnt + 1;
				// mIDs = data.match(/<br>Mod ID: ([^<]+)/g);
				const iter = data.matchAll(/<br>Mod ID: ([^<]+)/g);
				// ModID_Array.push(mIDs);
				// console.log(iter);
				mIDs = Array.from(iter, m => m[1]);
				mIDs = [...new Set(mIDs)];
				// console.log(mIDs);
				mIDs = mIDs.join(";");
				ModHash[wID] = mIDs;
				// console.log(wID);
				// console.log(ModHash[wID]);
				// return data;
                // result = data;
                // $("div#ModIDs")[0].innerHTML = $("div#ModIDs")[0].innerHTML + mIDs;
				$("span#ModIDCount")[0].innerText = cnt + " / " +listWorkshopItems.length + " Mods";

            }
        });
        // result = result.match(/<br>Mod ID: ([^<]+)/g);
        return res.response;
    }

	let cnt = 0;
	function retrieveModIDs() {
		cnt = 0;
		// alert("retrieveModIDs")
        // alert("listWorkshopItems.length " + listWorkshopItems.length);
		for (let i = 0; i < listWorkshopItems.length; i++) {
			// alert("https://steamcommunity.com/sharedfiles/filedetails/?id=" + listWorkshopItems[i]);
			// listMods[i] = getModIDs(listWorkshopItems[i]);
			getModIDs(listWorkshopItems[i]);
			// alert("WID: " + listWorkshopItems[i] + "\r\nRetrieved ModID: " + listMods[i]);
			// $("span#ModIDCount")[0].innerText = (i+1) + " / " +listWorkshopItems.length + " Mods";
			// $("div#ModIDs")[0].innerHTML = $("div#ModIDs")[0].innerHTML + ModID_Array[i];
		}
	}

let breadcrumbs = $("div.breadcrumbs")[0].innerHTML;
if (breadcrumbs.includes("Collection")) {


    addGlobalStyle('.modButton { max-width: 100% !important; width: 100%; color: #66c0f4; padding: 3px 6px 2px 6px; background-color: rgba(102, 192, 244, 0.4); line-height: 20px; }');
    addGlobalStyle('.divBlock { clear: both !important; }');
    // addGlobalStyle('.midCount { width: 20%; }');


    // $("div#rightContents").prepend("<div id='debugPanel' class='panel workshopItemControls'></div>");

    $("div#rightContents").prepend("<div id='serverModListsPanel' class='panel workshopItemControls'></div>");

    $("div#serverModListsPanel").append("<div id='listRetModsBlock' class='rightDetailsBlock'></div>");
    // $("div#listRetModsBlock").append("<div id='listMods' class='workshopItemControlCtn'></div>");

	$("div#listRetModsBlock").append("<span id='retrieveModIDs' class='general_btn tooltip' data-tooltip-text='Click and wait for completion'>Retrieve ModIDs</span>");
    $("span#retrieveModIDs").click({str: "ret"}, retrieveModIDs);

	$("div#listRetModsBlock").append("<span id='ModIDCount' class='tooltip general_btn midCount' data-tooltip-text='Mods processed'>count</span>");
	// $("div#listMods").append("<div class='rightDetailsBlock'>&nbsp;</div>");

    $("div#serverModListsPanel").append("<div id='listMods' class='rightDetailsBlock'></div>");

	$("div#listMods").append("<span id='listMods' class='general_btn tooltip' data-tooltip-text='Retrieve ModIDs first!'>Copy Mods list</span>");
    $("span#listMods").click({str: "Mods", opt: "Mods list"}, copyToClip);

    $("div#serverModListsPanel").append("<div class='rightDetailsBlock'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>");

    $("div#serverModListsPanel").append("<div id='listWorkshopItems' class='rightDetailsBlock divBlock'></div>");

	$("div#listWorkshopItems").append("<span id='listWorkshopItems' class='general_btn tooltip divBlock' data-tooltip-text=''>Copy WorkshopItems list</span>");
    $("span#listWorkshopItems").click({str: "WorkshopItems", opt: "WorkshopItems list"}, copyToClip);

    // $("div#listWorkshopItemsBlock").append("<div id='listWorkshopItems' class='collectionItemAuthor modButton'></div>");
    // $("div#listWorkshopItems").append("<a>Copy WorkshopItems list</a>");
    // $("div#listWorkshopItems a").click({str: "WorkshopItems", opt: "WorkshopItems list"}, copyToClip);

    // $("div#serverModListsPanel").append("<div class='rightDetailsBlock'>&nbsp;</div>");
    // $("div#serverModListsPanel").append("<div id='ModIDs' class='rightDetailsBlock'></div>");

    // var collection = $("div.collectionChildren")[0];

    // var collectionItems = $("div.collectionChildren > div.collectionItem");

    // var listWorkshopItems = [];
    // var listWorkshopItemsObj = $("div.collectionChildren > div.collectionItem > div.workshopItem > a");
    // var listMods = [];
    for (let i = 0; i < listWorkshopItemsObj.length; i++) {
        listWorkshopItems[i] = listWorkshopItemsObj[i].href.substr(55,66);
		ModHash[listWorkshopItems[i]] = null;
    }
    WorkshopItems = "WorkshopItems=" + listWorkshopItems.join(";");

	$("span#ModIDCount")[0].innerText = "0 / " +listWorkshopItems.length + " Mods";

    for (let i = 0; i < listWorkshopItems.length; i++) {
        // alert("https://steamcommunity.com/sharedfiles/filedetails/?id=" + listWorkshopItems[i]);
        // listMods[i] = retrieveModIDs(listWorkshopItems[i]);
		// alert("WID: " + listWorkshopItems[i] + "\r\nRetrieved ModID: " + listMods[i]);
    }
    Mods = "Mods=" + listMods.join(";");
}

});
    // Your code here...
})();