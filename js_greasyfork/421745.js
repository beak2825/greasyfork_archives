// ==UserScript==
// @name         MH: Inventory History
// @author       Warden Slayer - Warden Slayer#2302
// @namespace    https://greasyfork.org/en/users/227259-wardenslayer
// @version      1.0.7
// @description  This script allows you to record your inventory and catch stats to be able to compare them over time.
// @resource     YOUR_CSS https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/js/all.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js
// @icon         https://www.mousehuntgame.com/images/items/weapons/974151e440f297f1b6d55385310ac63c.jpg?cv=2
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      self
// @connect      script.google.com
// @connect      script.googleusercontent.com
//
// @downloadURL https://update.greasyfork.org/scripts/421745/MH%3A%20Inventory%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/421745/MH%3A%20Inventory%20History.meta.js
// ==/UserScript==
$(document).ready(function() {
    const cssTxt = GM_getResourceText ("YOUR_CSS");
    GM_addStyle (cssTxt);
    addTouchPoint();
});

function addTouchPoint() {
    if ($('.invHix').length == 0) {
        const invPages = $('.inventory .torn_pages');
        //Inventory History Button
        const invHix = document.createElement('li');
        invHix.classList.add('invHix');
        const invHixBtn = document.createElement('a');
        invHixBtn.href = "#";
        invHixBtn.innerText = "Inventory History";
        invHixBtn.onclick = function () {
            onInvHXOnClick();
        };
        const icon = document.createElement("div");
        icon.className = "icon";
        invHixBtn.appendChild(icon);
        invHix.appendChild(invHixBtn);
        $(invHix).insertAfter(invPages);
    }
}

function getInvNow() {
    localStorage.setItem('ws.mh.invHx',"");
    localStorage.setItem('ws.mh.invHx.mice',"");
    fetchInventory();
    getMice();
    setTimeout(publishResults,10000);
}

function fetchInventory() {
    const itemsToGet = ['weapon','base', 'trinket', 'bait', 'skin', 'crafting_item','convertible', 'potion', 'stat','collectible','map_piece','adventure']; //future proof this to allow for exclusions
    let itemsArray = [];
    hg.utils.UserInventory.getItemsByClass(itemsToGet,true,function(data) {
        data.forEach(function(arrayItem, index) {
            itemsArray[index] = [arrayItem.name,arrayItem.quantity];
        })
        //hunter stats
        itemsArray.push(['Rank Percent',user.title_percent_accurate],['Points',user.points],['Gold',user.gold]);
        getHunts(itemsArray);
    })
    //console.log('items done')
    return itemsArray
}

function getHunts(itemsArray) {
    let hunts = [];
    hg.utils.User.getUserData([user.sn_user_id],['num_active_turns','num_passive_turns','num_link_turns','num_total_turns','map_num_clues_found','map_num_maps_dusted','wisdom','not_actually_real_field'],function(data) {
        const numClues = ['Map Clues',data[0].map_num_clues_found];
        const numDust = ['Maps Dusted',data[0].map_num_maps_dusted];
        const numHorns = ['Horn Calls',data[0].num_active_turns];
        const numTrapChecks = ['Trap Checks',data[0].num_passive_turns];
        const wisdom = ['Wisdom',data[0].wisdom];
        let numFriendHorns = [];
        if(data[0].num_link_turns) {
            numFriendHorns = ['Friend Horns',data[0].num_link_turns];
        } else {
            numFriendHorns = ['Friend Horns',data[0].num_total_turns-data[0].num_active_turns-data[0].num_passive_turns];
        }
        const numHunts = ['Total Hunts',data[0].num_total_turns];
        itemsArray.push(numHorns,numTrapChecks,numFriendHorns,numHunts,numClues,numDust,wisdom);
        getCrowns(itemsArray);
    })
    //console.log('stats done')
    return itemsArray
}

function getCrowns (itemsArray) {
    hg.utils.MouseUtil.getCrowns(function(data) {
        data.forEach(function(arrayItem, i) {
            let crownName = arrayItem.name;
            if (arrayItem.type == "none") {
                crownName = 'Uncrowned Mice';
            } else {
                crownName = crownName.concat(' Crowns');
            }
            itemsArray.push([crownName,arrayItem.count]);
        })
        localStorage.setItem('ws.mh.invHx', JSON.stringify(itemsArray))
    })
    //console.log('crowns done')
    return itemsArray
}

function getMice() {
    let mouseArray = [];
    hg.utils.MouseUtil.getHuntingStats(function(data) {
        data.forEach(function(arrayItem, index) {
            const mouseName = correctMouseName(arrayItem.name);
            mouseArray[index] = [mouseName, arrayItem.num_catches, arrayItem.num_misses];
        })
        localStorage.setItem('ws.mh.invHx.mice', JSON.stringify(mouseArray));
    })
    //console.log('mice done')
    return mouseArray
}

function correctMouseName(mouseName) {
    mouseName = mouseName.replace(" Mouse", "");
    let newMouseName = "";
    if (mouseName == "Ful'Mina, The Mountain Queen") {
        newMouseName = "Ful'mina the Mountain Queen";
    } else if (mouseName == "Inferna, The Engulfed") {
        newMouseName = "Inferna the Engulfed";
    } else if (mouseName == "Nachous, The Molten") {
        newMouseName = "Nachous the Molten";
    } else if (mouseName == "Stormsurge, the Vile Tempest") {
        newMouseName = "Stormsurge the Vile Tempest";
    } else if (mouseName == "Bruticus, the Blazing") {
        newMouseName = "Bruticus the Blazing";
    } else if (mouseName == "Vincent, The Magnificent") {
        newMouseName = "Vincent The Magnificent";
    } else if (mouseName == "Corky, the Collector") {
        newMouseName = "Corky the Collector";
    } else if (mouseName == "Ol' King Coal") {
        newMouseName = "Ol King Coal";
    } else {
        newMouseName = mouseName;
    }
    return newMouseName;
}


function publishResults(){
    const debug = localStorage.getItem('ws.debug');
    const webAppURL = localStorage.getItem('ws.mh.invHx.webApp');
    let timestamp_label = localStorage.getItem('ws.mh.invHx.dataLabel');
    const itemArray = localStorage.getItem('ws.mh.invHx');
    const mouseArray = localStorage.getItem('ws.mh.invHx.mice');
    if (debug == true) {
        console.log('Inventory',itemArray);
        console.log('Mice',mouseArray);
    }
    if (timestamp_label) {
    } else {
        timestamp_label = new Date().toString().split(" G")[0];
    }
    if (webAppURL){
        if (debug == true) {
            console.log(webAppURL);
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: webAppURL,
            data: JSON.stringify({ inventory: itemArray, timestamp: timestamp_label,mice: mouseArray}),
            onload: function(response) {
                if (debug == true) {
                    console.log('Inventory Submitted')
                }
            },
            onerror: function(response) {
                if (debug == true) {
                    console.log('No Good, Error')
                }
            }
        });
    } else {
        myAlert();
    }
}

//========== Modals ======================//
//https://craftpip.github.io/jquery-confirm/#getting-started
function onInvHXOnClick(){
    $.confirm({
        title: 'MH: Inventory History',
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        '<label>Custom Data Label</label>' +
        '<input type="text" placeholder="Give this data a name (i.e Pre-GWH) so you can recognize it (optional)" class="inventory nickname" size="100" "/>' +
        '<div width = "100"</div>' +
        '<label>Paste your WebApp link here. Only needed the first time unless you need to update it.</label>' +
        '<input type="text" placeholder="Paste WebApp Link Here" class="webapp link" size="100" "/>' +
        '</div>' +
        '</form>',
        boxWidth: '50%',
        useBootstrap: false,
        closeIcon: true,
        icon: 'fas fa-history',
        draggable: true,
        theme: 'dark',
        buttons: {
            formSubmit: {
                text: 'Submit Inventory',
                btnClass: 'btn-blue',
                action: function () {
                    const link = this.$content.find('.webapp.link').val();
                    const dataLabel = this.$content.find('.inventory.nickname').val();
                    if (link) {
                        localStorage.setItem('ws.mh.invHx.dataLabel',dataLabel)
                        localStorage.setItem('ws.mh.invHx.webApp',link)
                        getInvNow();
                    } else if (localStorage.getItem('ws.mh.invHx.webApp')) {
                        localStorage.setItem('ws.mh.invHx.dataLabel',dataLabel)
                        getInvNow();
                    } else {
                        myAlert();
                    }
                }
            },
            cancel: function () {
            },
        },
    })
}

function myAlert() {
    var icon = 'fas fa-exclamation-circle'
    var title = "WebApp Link Error"
    $.alert({
        autoClose: 'acknowledge|60000',
        title: title,
        content: 'There was an issue with your web app link. Please paste it in again',
        icon: icon,
        type: 'dark',
        typeAnimated: true,
        boxWidth: '30%',
        useBootstrap: false,
        draggable: true,
        escapeKey: 'aknowledge',
        buttons: {
            acknowledge: {
                text: 'Ok',
                keys: ['enter', 'space'],
                btnClass: 'btn-red',
                action: function() {
                }
            },
        }
    })
}






