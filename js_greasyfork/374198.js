// ==UserScript==
// @name         SteamGift MoreGameInfo
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Display little icon for success / cards
// @author       Mhaw
// @match        https://www.steamgifts.com/giveaway/*/*
// @match        https://www.steamgifts.com/
// @match        https://www.steamgifts.com/giveaways/search*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_log
// @connect      mhawon.000webhostapp.com
// @downloadURL https://update.greasyfork.org/scripts/374198/SteamGift%20MoreGameInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/374198/SteamGift%20MoreGameInfo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.body.innerHTML.includes("sidebar__entry-insert")){
        var steamurl = document.getElementsByClassName('global__image-outer-wrap global__image-outer-wrap--game-large')[0].href;
        var GameID = steamurl.split('/');
        var appID = GameID[4];
        var appType = GameID[3];
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://mhawon.000webhostapp.com/MhAPI.php?getdata=' + appType + '_' + appID,
            onload: function(xhr) {
                var GameInfo = xhr.responseText.split(';');
                var NewDiv = document.createElement('div');
                NewDiv.className = 'featured__column';
                NewDiv.style.maxHeight = '26px';
                NewDiv.style.textAlign = 'center';
                if (GameInfo[2] == 1){
                    if (GameInfo[0] == 1){NewDiv.innerHTML += '<img style="height: 23px; display: inline-block; vertical-align: middle" src="https://mhawon.000webhostapp.com/img/ico_ach.png" />';}
                    else{NewDiv.innerHTML += '<img style="height: 23px; display: inline-block;  vertical-align: middle" src="https://mhawon.000webhostapp.com/img/ico_noach.png" />';}
                    if (GameInfo[1] == 1){NewDiv.innerHTML += '<img style="height: 23px; padding-left: 4px; display: inline-block; vertical-align: middle" src="https://mhawon.000webhostapp.com/img/ico_car.png" />';}
                    else{NewDiv.innerHTML += '<img style="height: 23px; padding-left: 4px; display: inline-block; vertical-align: middle" src="https://mhawon.000webhostapp.com/img/ico_nocar.png" />';}
                }
                else{
                    NewDiv.innerHTML = 'NoStore';
                }
                var parrentElement = document.querySelector('.featured__columns');
                parrentElement.insertBefore(NewDiv, parrentElement.children[1]);
            }
        });
    }
    else{
        var SGurl = document.getElementsByClassName("global__image-outer-wrap global__image-outer-wrap--game-xlarge")[0].href;
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'document',
            url: SGurl,
            onreadystatechange: function(response) {
                if(response.readyState == 4){
                    var html = response.responseText;
                    var div = document.createElement('div');
                    div.innerHTML = html.data;
                    var steamurl = div.getElementsByClassName('global__image-outer-wrap global__image-outer-wrap--game-large')[0].href;
                    var GameID = steamurl.split('/');
                    var appID = GameID[4];
                    var appType = GameID[3];
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://mhawon.000webhostapp.com/MhAPI.php?getdata=' + appType + '_' + appID,
                        onload: function(xhr) {
                            var GameInfo = xhr.responseText.split(';');
                            var NewDiv = document.createElement('div');
                            NewDiv.className = 'featured__column';
                            NewDiv.style.maxHeight = '26px';
                            NewDiv.style.textAlign = 'center';
                            if (GameInfo[2] == 1){
                                if (GameInfo[0] == 1){NewDiv.innerHTML += '<img style="height: 23px; display: inline-block; vertical-align: middle" src="https://mhawon.000webhostapp.com/img/ico_ach.png" />';}
                                else{NewDiv.innerHTML += '<img style="height: 23px; display: inline-block;  vertical-align: middle" src="https://mhawon.000webhostapp.com/img/ico_noach.png" />';}
                                if (GameInfo[1] == 1){NewDiv.innerHTML += '<img style="height: 23px; padding-left: 4px; display: inline-block; vertical-align: middle" src="https://mhawon.000webhostapp.com/img/ico_car.png" />';}
                                else{NewDiv.innerHTML += '<img style="height: 23px; padding-left: 4px; display: inline-block; vertical-align: middle" src="https://mhawon.000webhostapp.com/img/ico_nocar.png" />';}
                            }
                            else{
                                NewDiv.innerHTML = 'NoStore';
                            }
                            var parrentElement = document.querySelector('.featured__columns');
                            parrentElement.insertBefore(NewDiv, parrentElement.children[1]);
                        }
                    });
                }
            }
        });
        [].forEach.call(document.body.getElementsByClassName("giveaway__row-outer-wrap"), function(v,i,a) {
            var SGurl = v.getElementsByClassName("giveaway__heading__name")[0].href;
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'document',
                url: SGurl,
                onreadystatechange: function(response) {
                    if(response.readyState == 4){
                        var html = response.responseText;
                        var div = document.createElement('div');
                        div.innerHTML = html.data;
                        var steamurl = div.getElementsByClassName('global__image-outer-wrap global__image-outer-wrap--game-large')[0].href;
                        var GameID = steamurl.split('/');
                        var appID = GameID[4];
                        var appType = GameID[3];
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'https://mhawon.000webhostapp.com/MhAPI.php?getdata=' + appType + '_' + appID,
                            onload: function(xhr) {
                                var GameInfo = xhr.responseText.split(';');
                                var NewDiv = document.createElement('div');
                                NewDiv.style.textAlign = 'center';
                                if (GameInfo[2] == 1){
                                    if (GameInfo[0] == 1){NewDiv.innerHTML += '<img style="height: 23px; display: inline-block; vertical-align: middle" src="https://mhawon.000webhostapp.com/img/ico_ach.png" />';}
                                    else{NewDiv.innerHTML += '<img style="height: 23px; display: inline-block;  vertical-align: middle" src="https://mhawon.000webhostapp.com/img/ico_noach.png" />';}
                                    if (GameInfo[1] == 1){NewDiv.innerHTML += '<img style="height: 23px; padding-left: 4px; display: inline-block; vertical-align: middle" src="https://mhawon.000webhostapp.com/img/ico_car.png" />';}
                                    else{NewDiv.innerHTML += '<img style="height: 23px; padding-left: 4px; display: inline-block; vertical-align: middle" src="https://mhawon.000webhostapp.com/img/ico_nocar.png" />';}
                                }
                                else{
                                    NewDiv.innerHTML = 'NoStore';
                                }
                                var parrentElement = v.querySelector('.giveaway__columns');
                                parrentElement.insertBefore(NewDiv, parrentElement.children[1]);
                            }
                        });
                    }
                }
            });
        });
    }
})();