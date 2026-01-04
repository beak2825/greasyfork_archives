// ==UserScript==
// @name         Zero Travel Tracker
// @namespace    zero.ztravel.torn
// @version      0.2
// @description  Shows travel time
// @author       -zero [2669774]
// @match        https://www.torn.com/profiles.php?XID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @connect      docs.google.com
// @downloadURL https://update.greasyfork.org/scripts/468528/Zero%20Travel%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/468528/Zero%20Travel%20Tracker.meta.js
// ==/UserScript==

// https://docs.google.com/spreadsheets/d/1KA54SbpvO603ICaoTgdf-MYzaHKxaeiNsyAPaeO4J14/edit?usp=sharing
const sheetId = '1KA54SbpvO603ICaoTgdf-MYzaHKxaeiNsyAPaeO4J14';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'users';
const query = encodeURIComponent('Select *');
const url = `${base}&sheet=${sheetName}&tq=${query}`;
var data = {};
var locurl = window.location.href;
var curTime = Math.round(Date.now()/1000);

var travel_data = {};

var location_url = window.location.href;
var playerId = location_url.split('XID=')[1];

const countryTimes = {
    "Argentina"      : 167,
    "Canada"         :  41,
    "Islands" :  35,
    "China"          : 242,
    "Hawaii"         : 134,
    "Japan"          : 225,
    "Mexico"         :  26,
    "Africa"   : 297,
    "Switzerland"    : 175,
    "UAE"            : 271,
    "Kingdom" : 159,
};

const flightModifier = {
    "standard": 1.0,
    "airstrip": 0.7,
    "private" : 0.5,
    "business": 0.3,
};

function checkTravel(){
    if ($('.main-desc').length > 0){
        if ($('.main-desc').text().includes('Returning') || $('.main-desc').text().includes('Traveling')){
            var desc = $('.main-desc').text().trim().split(' ');
            var destination = desc[desc.length -1];

            if (countryTimes[destination]){
                var time_taken = flightModifier[typeOfTravel()] * countryTimes[destination];
                console.log("Time Taken: "+time_taken);
                var departure_time = getDeparture(time_taken);
            }
        }

    }
    else{
        setTimeout(checkTravel, 200);
    }
}

function typeOfTravel(){
    if ($('.profile-status').hasClass('private')){
        return "private";
    }
    if ($('.profile-status').hasClass('airstrip')){
        return "airstrip";
    }
    return "business";
}

function main(){
    console.log('here');
    checkTravel();


}

async function getDeparture(extra_time){
    GM.xmlHttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            // console.log(response);
            var rep = response.responseText;

            var jdata = JSON.parse(rep.substr(47).slice(0,-2));

            console.log(jdata);

            for (var row = 0; row < jdata.table.rows.length; row++){
                   console.log(`${jdata.table.rows[row].c[0].v} ${jdata.table.rows[row].c[1].v}`);
                if (jdata.table.rows[row].c[2]){
                    var now = new Date((parseInt(jdata.table.rows[row].c[2].v) + extra_time * 60)*1000);
                    console.log(now);
                    var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
                    console.log(utc);
                    travel_data[jdata.table.rows[row].c[0].v] = `${utc.getHours().toString().padStart(2, "0")}:${utc.getMinutes().toString().padStart(2, "0")}:${utc.getSeconds().toString().padStart(2, "0")}`;
                }


            }
            insert();


        }
    });
}

function insert(){
    console.log(playerId);
    if (travel_data[playerId]){
        $('.sub-desc').html(`Landing after ${travel_data[playerId]}`);
    }

}







main();