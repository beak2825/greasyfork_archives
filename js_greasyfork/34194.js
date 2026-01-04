// ==UserScript==
// @name         Eternity Tower User Mute
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  User muting for Eternity Tower. Must refresh after altering list.
// @author       Aes Sedai
// @match        http*://*.eternitytower.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34194/Eternity%20Tower%20User%20Mute.user.js
// @updateURL https://update.greasyfork.org/scripts/34194/Eternity%20Tower%20User%20Mute.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.usermute = {};
    window.usermute.users = JSON.parse(localStorage.getItem('usermute_users')) || [];

    var muteInterval = setInterval(function() {
        if (document.querySelector("#navbarSupportedContent > form > ul") !== null) {
            var shopNav = document.querySelector("#navbarSupportedContent > form > ul");
            var muteButtonLi = document.createElement("li");
            muteButtonLi.className = "nav-item";
            var muteButton = document.createElement("a");
            muteButton.className = "nav-link";
            muteButton.href = "#";
            muteButton.id = "muteButton";
            muteButton.innerHTML = "Muted Users";
            muteButton.onclick = function() {
                var users = prompt("Please enter a lowercased, comma-separated list of users", window.usermute.users.join(','));
                if (users !== null) {
                    window.usermute.users = users.split(',');
                    console.log("usernames: ", window.usermute.users);
                }
            };
            muteButtonLi.appendChild(muteButton);
            shopNav.insertBefore(muteButtonLi, shopNav.childNodes[0]);
            clearInterval(muteInterval); // here muteInterval is undefined, but when we call this function it will be defined in this context
        }
    }, 100);

    Meteor.connection._stream.on('message', function(sMeteorRawData){
        try {
            var oMeteorData = JSON.parse(sMeteorRawData);
            if (oMeteorData.collection == "simpleChats") {
                if (window.usermute.users.indexOf(oMeteorData.fields.username) > -1) {
                    var interval = setInterval(function() {
                        if (document.getElementById(oMeteorData.id) !== null) {
                            var elem = document.getElementById(oMeteorData.id);
                            elem.setAttribute("style", "display:none;");
                            clearInterval(interval); // here interval is undefined, but when we call this function it will be defined in this context
                        }
                    }, 50);
                }
            }
        }
        catch (err) { }
    });

    window.onbeforeunload = function() {
        localStorage.setItem('usermute_users', JSON.stringify(window.usermute.users));
    };
})();