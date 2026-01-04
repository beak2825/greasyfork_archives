// ==UserScript==
// @name         Add crime stats to result
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add the new number of crimes in the category to the result  message
// @author       miros
// @match        https://www.torn.com/crimes.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/453265/Add%20crime%20stats%20to%20result.user.js
// @updateURL https://update.greasyfork.org/scripts/453265/Add%20crime%20stats%20to%20result.meta.js
// ==/UserScript==

// set to true when status is shown, and to false when a crime is triggered
// either through the regular [do crime] button or through TornTools quick crimes
var status_shown = false;


var crime_to_nerve = {
    searchtrainstation  :  2,
    searchbridge        :  2,
    searchbins          :  2,
    searchfountain      :  2,
    searchdumpster      :  2,
    searchmovie         :  2,
    cdrock              :  3,
    cdheavymetal        :  3,
    cdpop               :  3,
    cdrap               :  3,
    cdreggae            :  3,
    dvdhorror           :  3,
    dvdaction           :  3,
    dvdromance          :  3,
    dvdsci              :  3,
    dvdthriller         :  3,
    sweetshop           :  4,
    marketstall         :  4,
    clothesshop         :  4,
    jewelryshop         :  4,
    hobo                :  5,
    kid                 :  5,
    oldwoman            :  5,
    businessman         :  5,
    lawyer              :  5,
    apartment           :  6,
    house               :  6,
    mansion             :  6,
    cartheft            :  6,
    office              :  6,
    swiftrobbery        :  7,
    thoroughrobbery     :  7,
    swiftconvenient     :  7,
    thoroughconvenient  :  7,
    swiftbank           :  7,
    thoroughbank        :  7,
    swiftcar            :  7,
    thoroughcar         :  7,
    cannabis            :  8,
    amphetamines        :  8,
    cocaine             :  8,
    drugscanabis        :  8,
    drugspills          :  8,
    drugscocaine        :  8,
    simplevirus         :  9,
    polymorphicvirus    :  9,
    tunnelingvirus      :  9,
    armoredvirus        :  9,
    stealthvirus        :  9,
    assasination        : 10,
    driveby             : 10,
    carbomb             : 10,
    murdermobboss       : 10,
    home                : 11,
    Carlot              : 11,
    OfficeBuilding      : 11,
    aptbuilding         : 11,
    warehouse           : 11,
    motel               : 11,
    govbuilding         : 11,
    parkedcar           : 12,
    movingcar           : 12,
    carshop             : 12,
    pawnshop            : 13,
    pawnshopcash        : 13,
    makemoney2          : 14,
    maketokens2         : 14,
    makecard            : 14,
    napkid              : 15,
    napwomen            : 15,
    napcop              : 15,
    napmayor            : 15,
    trafficbomb         : 16,
    trafficarms         : 16,
    bombfactory         : 17,
    bombbuilding        : 17,
    hackbank            : 18,
    hackfbi             : 18,
};

var nerve_to_cat = {
    2: 'other',
    3: 'selling_illegal_products',
    4: 'theft',
    5: 'theft',
    6: 'theft',
    7: 'theft',
    8: 'drug_deals',
    9: 'computer_crimes',
    10: 'murder',
    11: 'fraud_crimes',
    12: 'auto_theft',
    13: 'theft',
    14: 'fraud_crimes',
    15: 'theft',
    16: 'selling_illegal_products',
    17: 'fraud_crimes',
    18 : 'computer_crimes',
};

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
});

Object.defineProperty(String.prototype, 'cat_to_title', {
    value: function() {
        return this.split('_').map(element => { return element.capitalize() }).join(' ');
    }
});

Element.prototype.acs_add_handler = function () {
    console.log('[acs] adding handler');
    this.onclick = function() {
        status_shown = false;
        console.log('[acs] reset status_shown')
    };
}

NodeList.prototype.acs_add_handler = function () {
    this.forEach( function (elt) { elt.acs_add_handler(); });
}

function api_call (key) {
    return 'https://api.torn.com/user/' + key + '?selections=crimes&key=' + key + '&comment=crimestats';
}

function status_message (status, message) {
    //alert('status_message. status: [' + status + '] - message: [' + message + ']');
    var color = status == 'ok' ? 'green' : 'red';
    var title = status.capitalize();
    return '<span id="acs_status" class="' + status + '" style="color:' + color + ';">' + title + ': ' + message + '</span>';
}

function init_key() {
    //alert('in init_key');
    var div = document.createElement('div');
    var input = '<div class="acs_input_key" style="margin: 10px auto;";><input type="text" id="acs_key" name="acs_key" placeholder="API Key" style="line-height:1.5em; padding: 2px;"></input><button id="acs_save_key">Save</button></div>';
    div.innerHTML = '<div id="acs_modal" style="position: fixed;z-index: 1;left: 0;top: 0;width: 100%;height: 100%;overflow: auto;"><div id="acs_content" style="background-color: lightblue;margin: 15% auto;padding: 20px;border: 1px solid black;width: 20%;box-shadow:20px 20px 30px 2px gray;border-radius:7px;"><span id="acs_close" style="float: right;font-size:25px;cursor: pointer;color: black;">&times;</span>'+ input +'<div id="acs_message"></div></div></div>';
    document.body.appendChild(div);
    var modal = document.getElementById("acs_modal");
    var close = document.getElementById("acs_close");
    var button = document.getElementById("acs_save_key");
    close.onclick = function(){modal.style.display = "none";}
    button.onclick = function() {
        var key = document.getElementById('acs_key').value;
        //alert( 'key value should be [' + key + ']');
        save_key(key);
    }
}

function save_key (key) {
    fetch(api_call(key))
        .then((response) => {
        if (response.ok) {
            //alert('response is ok');
            return response.json();
        }
        else {
            //alert('response is NOT ok :' + response.status);
            return {error: response.status};
        }
    })
        .then((data) => {
        //alert( 'in second promise, data: ' + data);
        var message = document.getElementById('acs_message');
        if (data.hasOwnProperty('criminalrecord')) {
            //alert('criminalrecord found');
            localStorage.setItem('acs_key',key);
            save_last_data(data);
            message.innerHTML = status_message('ok', 'API Key Saved');
            show_stat(key);
            status_shown = true;
        }
        else {
            var error = data.hasOwnProperty('error') && data.error.hasOwnProperty('error') ? data.error.error : 'unknown error';
            //alert('error found: ' + error);
            message.innerHTML = status_message('error', error);
            status_shown = true;
        }
    });
}

function stat_message (title, stat) {
    return '<span id="acs_stat" style="display: inline-block; float: right; color:aquamarine;">' + title + ': ' + stat + '</span>';
}


function show_stat(key) {
    //alert( 'in show_stat (key is [' + key + '])');
    var intv = setInterval(function() {
        var message = document.querySelector('div.success-message');
        var status = document.getElementById('acs_status');
        if(status_shown || status != null || message == null) {
            return false;
        }
        //alert('found message: [' + message.innerHTML + ']');
        // I should be able to use nervetake to get the nerve value, but sometimes it's empty
        // need to be precise with the selector, torntools quick crimes also has a crime input
        var crime = document.querySelector('form[name="docrime2"] input[name="crime"]').getAttribute('value');
        var nerve = crime_to_nerve[crime];
        var cat = nerve_to_cat[nerve];
        var title = cat.cat_to_title();
        var last = JSON.parse(localStorage.getItem('acs_last'));
        console.log(last);
        console.log('[acs] nerve is [' + nerve + '], category is [' + cat + ']') ;
        var delta = Date.now() - last.time;
        console.log( '[acs] delta is: [' + delta +'], last.time is: [' + last.time + ']');
        if (Date.now() - last.time < 3000) {
            // last call was less than 3s ago, use the cache to compute the result
            console.log('[acs] using the cache');
            last.criminalrecord[cat]++;
            save_last_data(last);
            message.innerHTML = message.innerHTML + stat_message(title, last.criminalrecord[cat]);
        }
        else {
            // last call was more than 3s ago, use the API
            fetch(api_call(key))
                .then((response) => response.json())
                .then((data) => {
                console.log('[acs] using the API');
                save_last_data(data);
                message.innerHTML = message.innerHTML + stat_message(title, data.criminalrecord[cat]);
                return true;
            });
        }
        status_shown = true;
        document.querySelectorAll('#do_crimes button, #try_again button, #change_crime button, form.quick-item ul.forced-item ').acs_add_handler();
    }, 300);

}

function save_last_data (data) {
    localStorage.setItem('acs_last', JSON.stringify({ time: Date.now(), criminalrecord:data.criminalrecord }));
}

(function() {
    'use strict';
    //alert('running Add crime stats to result.user');
    var key = localStorage.getItem('acs_key');
    if (key) {
        show_stat(key);
    }
    else {
        init_key();
    }
}());
