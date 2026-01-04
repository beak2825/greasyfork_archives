// ==UserScript==
// @name         Easy Equipment Remove/Replace
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Easy Saving/Restoring of equipment configs for all your social needs
// @author       KSS
// @match        https://gazellegames.net/user.php?action=equipment
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/407574/Easy%20Equipment%20RemoveReplace.user.js
// @updateURL https://update.greasyfork.org/scripts/407574/Easy%20Equipment%20RemoveReplace.meta.js
// ==/UserScript==

const VERSION = '1.1.1';





function getUrlVars(url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var authKey = getUrlVars(document.getElementsByTagName('link')[4].href).authkey;
var userId = getUrlVars(document.getElementsByTagName('link')[4].href).user;
var urlBase = "https://gazellegames.net/user.php?action=ajax_equip_item&auth=" + authKey + "&userid=" + userId + "&itemid=" ;





async function flush_items() {
    let requests = [];
    for (var i = 1; i < 14 ; i++) {
        try {
            var url_sent = urlBase + $('#slot_' + i)[0].children[0].attributes["data-id"].value + "&equiptype=unequip" ;
            requests.push($.get(url_sent));
        }
        catch(e) {};
    }
    return Promise.all(requests);
}



async function restore_items(num) {
    let requests = [];
    var equipped_items = GM_getValue("Equipment_Config_" + num, []);
    for (var i = 1; i < 14 ; i++) {
        try {
            if (equipped_items[i]) {
                var url_sent = urlBase + equipped_items[i] + "&equiptype=equip";
                requests.push($.get(url_sent));
            }
        }
        catch(e) {};
    }
    return Promise.all(requests);
}



function refresh() {
    window.location.reload(true);
}





class Config_box {
    constructor(number) {
        $("#flexflex").append('<div id="config_box_' + number + '" style="border: 1px solid #fff;margin-bottom: 17px;display: block;clear: both;position:relative;background-color:rgba(0,0,0,.7);padding:5px; width:150px; border-radius:10px;"></div>');
        $("#config_box_" + number).append('<button style="margin-top:3px;margin-right:5px;background-color: green; width: 150px" id="Save' + number + '" class="just_a_button">Save config ' + number +'</button>');
        $("#config_box_" + number).append('<br />');
        var c1v = GM_getValue("Equipment_Config_" + number, [""])[0];
    $("#config_box_" + number).append('<input type="text" id="config' + number + '" value=' + c1v + '>');
    $("#config_box_" + number).append('<br />');
    $("#config_box_" + number).append('<button style="margin-top:3px;margin-right:5px;background-color: blue; width:150px" id="Restore' + number + '" class="just_a_button">Restore config ' + number + '</button>');


        $("#Save" + number).click(function() {
            var equipped_items = [];
            equipped_items[0] = document.getElementById("config" + number).value;
            for (var i = 1; i < 14 ; i++) {
                try {
                    var item = $('#slot_' + i)[0].children[0].attributes["data-id"].value;
                    equipped_items[i] =item;
                }
                catch(e) {};
            }
            alert("Config " + number + " saved");
            equipped_items[11] = "" ;
            GM_setValue("Equipment_Config_" + number,equipped_items);
    })


        $("#Restore" + number).click(async function() {
            if(document.getElementById("AutoRem").checked = GM_getValue("Auto_rm", false)) {await flush_items()};
            await restore_items(number);
            refresh();
    })
    }}




(function() {
    'use strict';

    $("#equip_panel").after(
        '<div id="equip_gestion" style="border: 1px solid #fff;margin-bottom: 17px;display: block;clear: both;position:relative;background-color:rgba(0,0,0,.7);padding:5px;"></div>');


    $("#equip_gestion").append('<span>Use this button to remove all items except the pets : </span>');
    $("#equip_gestion").append('<button style="margin-top:3px;margin-right:5px;background-color: red;" id="Remove" class="just_a_button">Remove</button>');
    $("#equip_gestion").append('<div id = "ARM">Check this box to auto-remove items before restoring (which will take more time) :</div>');
    $("#ARM").append('<input type="checkbox"; id="AutoRem" /input>');
    document.getElementById("AutoRem").checked = GM_getValue("Auto_rm", false);
    $("#equip_gestion").append('<br />');
    $("#equip_gestion").append('<style>.flex-container {display: flex;} .flex-container > div {margin: 10px; padding: 20px;font-size: 30px;}</style>');
    $("#equip_gestion").append(' <div class="flex-container"; id="flexflex"></div>');

    new Config_box(1);
    new Config_box(2);
    new Config_box(3);



    $("#Remove").click(async function() {
        await flush_items();
        refresh();
    })

    $("#AutoRem").click(function() {
        GM_setValue("Auto_rm", document.getElementById("AutoRem").checked);
    })

        })();