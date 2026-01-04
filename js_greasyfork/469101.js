// ==UserScript==
// @name         GGn Inventory Favorites
// @author       drlivog
// @namespace    http://greasyfork.org/
// @version      1.22
// @license      MIT
// @description  Adds a Favorite Tab to the Inventory Page of GGn
// @match        https://gazellegames.net/user.php?*action=inventory*
// @match        https://gazellegames.net/shop.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/469101/GGn%20Inventory%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/469101/GGn%20Inventory%20Favorites.meta.js
// ==/UserScript==

/* globals $ userid authkey */
/* jshint esversion: 11 */

const expandFavorites = true;
const disableShop = false;

let KEY = '';
let USER_ID=''; //optional, if empty, will obtain userid from the page

let mode=null;

(function() {
    'use strict';
    GM_registerMenuCommand("Edit Favorites", () => {editFavorites();},'e');
    GM_registerMenuCommand("Reset API KEY", () => {
        if (confirm("Please confirm you would like to reset the API KEY.")) {
            GM_setValue("API_KEY","");
        }
    },'a');
    GM_registerMenuCommand("Reset Favorites", () => {
        if (mode && confirm(`Please confirm you would like to reset the Favorites for ${mode}. This cannot be undone. You will have to recreate all favorites.`)) {
            GM_setValue("Favorites_"+mode, "[]");
            $('#favorites_list').empty();
            loadFavorites();
        }
    },'r');
    GM_registerMenuCommand("Toggle Shop", () => {
        if (disableShop) {
            alert("Shop hardcoded disabled in script. Please edit script to allow toggling shop");
        }
        GM_setValue("disableShop", !GM_getValue("disableShop", false));
    },'t');
    if (USER_ID === null || USER_ID === "") {
        USER_ID = $('#items_list').attr('data-userid');
    }
    if (window.location.href.includes("shop.php")) {
        if (disableShop || GM_getValue("disableShop", false)) return;
        mode = "shop";
    } else if (window.location.href.includes("action=inventory")) {
        mode = "inventory";
        if (GM_getValue("Favorites")) {
        if (confirm("Old favorites settings detected. Would you ike to convert to the new format? You will be messaged on each page load.")) {
            GM_setValue("Favorites_inventory", GM_getValue("Favorites"));
            GM_deleteValue("Favorites");
        }
    }
    } else {
        console.log(`Don't know what page we are on: ${window.location.href}. Error...`);
        return;
    }
    $('<ul id="favorites"><li style="padding-bottom: 5px"><a id="favorites_link" href="#0">Favorites\n</a></li><ul id="favorites_list" class="subcat subcat_1 hidden"></li></ul></ul>').insertAfter('#items_navigation h3 :first');
    $('#favorites_link').click( () => {
        if ($('#favorites_list').hasClass('hidden')) {
            applySelectedLinkCSS($('#favorites li:first a'), true);
        } else {
            applySelectedLinkCSS($('#favorites li:first a'), false);
        }
        $('#favorites_list').toggleClass('hidden');
    });
    if (expandFavorites && $('#favorites_list').hasClass('hidden')) {
        $('#favorites_link').click();
    }
    loadFavorites();
})();

function loadFavorites() {
    $('#favorites_link').text("Favorites");
    const favoriteSettings = JSON.parse(GM_getValue("Favorites_"+mode) || "[]");
    for(let i=0; i<favoriteSettings.length; i++) {
        const fav = favoriteSettings[i];
        addToFavoriteList(fav?.name, fav?.type, fav?.value);
    }
    $('#favorites_list').append('<li><a id="addnewfavorite" href="#0">(+) Add New Favorite</a></li>');
    $('#addnewfavorite').click(()=>{addNewFavorite();});
}

function addToFavoriteList(name, type=null, value=null) {
    const name_id = name.replace(/[\W]/g, '_'); //substitute non-alphanumeric characters for id
    $('#favorites_list').append(`<li><a id="favorite${name_id}" href="#0">${name}</a></li>`);
    if (type==="Link") {
        $('#favorite'+name_id).attr('href', value);
        if (window.location.href === value) {
            applySelectedLinkCSS($('#favorite'+name_id), true);
        }
    }
    if (type==="List") {
        if ($('#items_list').data('favorites') === name_id) applySelectedLinkCSS($('#favorite'+name_id), true);
        $('#favorite'+name_id).click(evt => {
            applySelectedLinkCSS($('#favorites_list li a'), false);
            applySelectedLinkCSS($('#favorite'+name_id), true);
            filterInventory(value, name_id);
        });
    }
}

function addNewFavorite() {
    $('<div id="newfavoritemodalcontent" class="modalcontent"><span class="closemodal">&times;</span><h3>New Favorite</h3><label>Name: <input type="text" id="newfavoritename" size="30"></label><br><label>Type: <select id="newfavoritetype"><option>Link</option><option>List</option></select></label><br><label>Value: <input type="text" id="newfavoritevalue" size="50"></label><br><button id=newfavoritecreate>Create</button>&nbsp;&nbsp;<button id=newfavoritecancel>Cancel</button></div>').appendTo('body');
    $('.modal').css({"position": "fixed", "z-index": "1", "left": "0", "top":"0", "width": "100%", "height": "100%"});
    $('.modalcontent').css({"top": "40%", "left": "40%", "padding": "20px", "position": "fixed", "z-index": "1", "border-radius": "10px", "border": "1", "background-color":"rgba(0,0,0,.9)"});
    $('.closemodal').css({"color": "#aaa", "float": "right", "font-size": "24px", "font-weight": "bold"}).on("mouseenter", function() { $(this).css({"color": "white", "cursor":"pointer"});}).on("mouseleave", function() { $(this).css({"color": "#aaa", "cursor":"none"});}).click(function() {document.querySelector('.modalcontent')?.remove();});
    $('#newfavoritecancel').click(function() {document.querySelector('.modalcontent')?.remove();});
    if (mode === "shop") { //Only allow Link for shop favorites
        $('#newfavoritetype').val("Link");
        $('#newfavoritetype').prop('disabled',true);
    }
    $('#newfavoritecreate').click(function() {
        if ($('#newfavoritename').val() === "") {
            alert("Favorite name cannot be empty!");
            return false;
        }
        saveFavorite($('#newfavoritename').val(), $('#newfavoritetype').val(), $('#newfavoritevalue').val());
        document.querySelector('.modalcontent')?.remove();
    });
}

function saveFavorite(name, type=null, value=null, index=null) {
    let favoriteSettings = JSON.parse(GM_getValue("Favorites_"+mode) || "[]");
    if (index != null && index>-1) { //Edit Favorites
        if (name === null) {
            favoriteSettings.splice(index,1);
        } else {
            favoriteSettings[index] = {"name": name, "type": type, "value": value};
        }
        GM_setValue("Favorites_"+mode, JSON.stringify(favoriteSettings));
        $('#favorites_list').empty();
        editFavorites();
    } else { //Add New Favorite
        favoriteSettings.push({"name": name, "type": type, "value": value});
        GM_setValue("Favorites_"+mode, JSON.stringify(favoriteSettings));
        $('#favorites_list').empty();
        loadFavorites();
    }
}

function editFavorites() {
    $('#favorites_list').empty();
    $('#favorites_link').text("Favorites [edit mode]");
    const favoriteSettings = JSON.parse(GM_getValue("Favorites_"+mode) || "[]");
    for(let i=0; i<favoriteSettings.length; i++) {
        const fav = favoriteSettings[i];
        $('#favorites_list').append(`<li><a id="favorite${fav.name.replace(/[\W]/g, '_')}" href="#0" title="Click to edit favorite">(*) ${fav.name}</a></li>`);
        $('#favorite'+fav.name.replace(/[\W]/g, '_')).click(evt => {editFavorite(fav.name, fav.type, fav.value, i);});
    }
    $('#favorites_list').append(`<li><a id="favorite_canceledit" href="#0" title="Exit Edit Mode">(&#x02E3;) Exit Edit Mode</a></li>`);
    $('#favorite_canceledit').click(()=>{$('#favorites_list').empty(); loadFavorites();});
}

function editFavorite(name, type, value, index=-1) {
    $(`<div id="editfavoritemodalcontent" class="modalcontent"><span class="closemodal">&times;</span><h3>Edit Favorite</h3>
        <label>Name: <input type="text" id="editfavoritename" size="30" value="${name}"></label><br><label>Type: <select id="editfavoritetype">
        <option>Link</option><option>List</option></select></label><br><label>Value: <input type="text" id="editfavoritevalue" size="50" value="${value}"></label>
        <br><button id=editfavoritesave>Save</button>&nbsp;&nbsp;<button id=editfavoritecancel>Cancel</button>&nbsp;&nbsp;<button id=editfavoritedelete>Delete</button></div>`)
        .appendTo('body');
    $(`#editfavoritetype option:contains(${type})`).prop('selected', 'selected');
    $('.modal').css({"position": "fixed", "z-index": "1", "left": "0", "top":"0", "width": "100%", "height": "100%"});
    $('.modalcontent').css({"top": "40%", "left": "40%", "padding": "20px", "position": "fixed", "z-index": "1", "border-radius": "10px", "border": "1", "background-color":"rgba(0,0,0,.9)"});
    $('.closemodal').css({"color": "#aaa", "float": "right", "font-size": "24px", "font-weight": "bold"}).on("mouseenter", function() { $(this).css({"color": "white", "cursor":"pointer"});}).on("mouseleave", function() { $(this).css({"color": "#aaa", "cursor":"none"});}).click(function() {document.querySelector('.modalcontent')?.remove();});
    if (mode === "shop") { //Only allow Link for shop favorites
        $('#editfavoritetype').val("Link");
        $('#editfavoritetype').prop('disabled',true);
    }
    $('#editfavoritesave').click(function() {
        if ($('#editfavoritename').val() === "") {
            alert("Favorite name cannot be empty!");
            return false;
        }
        saveFavorite($('#editfavoritename').val(), $('#editfavoritetype').val(), $('#editfavoritevalue').val(), index);
        document.querySelector('.modalcontent')?.remove();
    });
    $('#editfavoritecancel').click(function() {document.querySelector('.modalcontent')?.remove();});
    $('#editfavoritedelete').click(function() {
        if (confirm("Are you sure you want to delete this favorite? Cannot be undone.")) {
            saveFavorite(null, null, null, index);
            document.querySelector('.modalcontent')?.remove();
        }
    });
}

function filterInventory(filters, name=null) {
    if (filters.includes(",")) { //if has , assume its a string
        filters = filters.split(",");
    }
    checkAPIKey();
    ajax("https://gazellegames.net/api.php?request=items&type=inventory&include_info=true&userid="+USER_ID+"&key="+KEY, null,
         (r) => {
            if (r?.status != 200) return;
            const data = JSON.parse(r.response)?.response;
            if (!data) return;
            let items = filterItems(data, filters);
            const orderby = $('#order_by').val();
            const orderway = $('#order_way').val();
            if (orderby === "PurchaseTime") {
                console.log("Sort by date added");
                items.sort( (a,b) => {
                    const c = (a.item.dateAdded.localeCompare(b.item.dateAdded)) * ((orderway==="ASC")? 1:-1);
                    if (c === 0) {
                        return a.item.name.localeCompare(b) * ((orderway==="ASC")? 1:-1);
                    }
                    return c;
                });
            } else if (orderby === "Category") {
                items.sort( (a,b) => {
                    const c = (a.item.category.localeCompare(b.item.category)) * ((orderway==="ASC")? 1:-1);
                    if (c === 0) {
                        return a.item.name.localeCompare(b) * ((orderway==="ASC")? 1:-1);
                    }
                    return c;
                });
            } else if (orderby === "Name") {
                items.sort( (a,b) => {
                    const c = (a.item.name.localeCompare(b.item.name)) * ((orderway==="ASC")? 1:-1);
                    return c;
                });
            } else if (orderby === "Cost") {
                items.sort( (a,b) => {
                    const c = (Number(a.item.gold) - Number(b.item.gold)) * ((orderway==="ASC")? 1:-1);
                    if (c === 0) {
                        return a.item.name.localeCompare(b) * ((orderway==="ASC")? 1:-1);
                    }
                    return c;
                });
            }
            else if (orderby === "Amount") {
                items.sort( (a,b) => {
                    const c = (Number(a.amount) - Number(b.amount)) * ((orderway==="ASC")? 1:-1);
                    if (c === 0) {
                        return a.item.name.localeCompare(b) * ((orderway==="ASC")? 1:-1);
                    }
                    return c;
                });
            }
            $('#items_list').empty().data('favorites', name); //remove all items because we are going to replace them
            $('div.linkbox').empty();
            $('#content').append('<div id="favoriteextraainfo" class="hidden"/>');
            for (let i=0; i<items.length; i++) {
                addInventoryItemDisplay(items[i], String(i), userid, authkey);
            }
    });
}

function addInventoryItemDisplay(obj, index, userid, auth) {
    $('#items_list').append(`<li class="item_li item_type_0 available" data-userid="${userid}"><img src="static/styles/game_room/images/icons/trash.gif" title="Remove Item Permanently" alt="Trash" class="trash_icon flright" onclick='Trash($(this), "${obj.itemid}", "${obj.item.itemType}", "${userid}");'>	<form action="" method="post" data-itemid="${obj.itemid}" data-itemname="${obj.item.name}">
					<input type="hidden" name="useItem" value="${obj.itemid}">
					<input type="hidden" name="itemType" value="0">
					<input type="hidden" name="itemName" value="${obj.item.name}">
                                        <input type="hidden" name="search" value="">
					<input type="hidden" name="auth" value="${auth}">	   <div title="More Info..." onclick='ItemInfo("${index+1000}","${obj.item.name}");' class="item_info" id="clickable">
					<h3 class="center">${obj.item.name}</h3>	<div class="item_image_div"><img src="${obj.item.image}" alt="${obj.item.name}" class="item_center item_image"></div>	  </div>	<br>
					<div class="center item_description">${obj.item.description}</div>	<p id="amount_${obj.itemid}">Amount: ${obj.amount}</p><div>     <div id="extended_info">    </div>	<div class="submit_section">
						<br>	<input type="submit" name="submit" value="Feature" class="submit submit_feature hidden">	</div>	</div>	</form>
			</li>`);
    $('#favoriteextraainfo').append(`<div id="${index+1000}" name="${obj.item.name}" data-itemid="${obj.itemid}">
					<div class="more_info">
						<div class="col_1">
							<div id="img_box">		<img src="${obj.item.image}" alt="${obj.item.name}" class="item_center">			</div>
							<div class="info_cost"><p id="cost">${obj.item.gold}&nbsp;<img src="static/styles/game_room/images/icons/coins.png" title="Gold" alt="Gold">&nbsp;</p>${obj.item.infStock?'∞':'<strong class="important_text">Out of Stock</strong>'}<p>You own: ${obj.amount}</p>			</div>
						</div>

						<div class="col_2">
							<div class="info_box info_basic">
								<span class="label">Basic Info</span>
								<div class="info_sub_basic"></div><p>Category: ${obj.item.category}</p><p>Tradeable: ${obj.item.notTradeable?"No":"Yes"}</p>			</div>
							<div class="info_box info_description">
								<span class="label">Description</span>			<p>${obj.item.description}</p>			</div>
						</div>
					  </div>
					</div>`);
}

//filter item array items, check category, name or id in filter
function filterItems(items, filters) {
    let ret = Array();
    for (let i=0; i<items.length; i++) {
        const item = items[i];
        if (typeof filters == "string") {
            if (checkItem(item,filters.trim())) {
                ret.push(item);
            }
        } else {
            for (let j=0; j<filters.length; j++) {
                if (checkItem(item,filters[j].trim())) {
                    ret.push(item);
                }
            }
        }
    }
    return ret;
}

function checkItem(item, filter) {
    if (String(item?.itemid) === filter) return true;
    if (item?.item?.category?.includes(filter)) return true;
    if (item?.item?.name?.includes(filter)) return true;
    return false;
}

function checkAPIKey() {
    if (KEY=="" || KEY==null) {
        if (GM_getValue("API_KEY")) {
            KEY = GM_getValue("API_KEY");
            return true;
        } else {
            const input = window.prompt(`Please input your GGn API key.
If you don't have one, please generate one from your Edit Profile page: https://gazellegames.net/user.php?action=edit.
The API key must have "Inventory" permission.`);
            const trimmed = input.trim();
            if (/[a-f0-9]{64}/.test(trimmed)) {
                GM_setValue("API_KEY", trimmed);
                KEY = trimmed;
                return true;
            }
            else {
                console.log('API key entered is not valid. It must be 64 hex characters 0-9a-f.');
                throw 'No API key found.';
                return false;
            }
        }
    }
}

//Applies CSS for selected link to a jQuery Object. Returns jQuery object for chaining.
function applySelectedLinkCSS(link, on=true) {
    if (on) link.css('font-weight', "bold").css('color',"#b49629");
    else link.css('font-weight', "").css('color',"");
    return link;
}

function ajax(url, data=null, returnCall=null) {
    let xhr = new XMLHttpRequest();
    xhr.open(data==null? 'GET':'POST', url);
    if (returnCall != null) {
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                returnCall(xhr);
            }
        };
    }
    if (data==null) {
        xhr.send();
    } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
    return xhr;
}

