// ==UserScript==
// @name         Fix QNAP QTS Username Autofill
// @version      1
// @description  Convert username field from a textarea to input allowing password managers to autofill
// @author       Caretaker007
// @match        http://<your-qnap-address>:8080/*
// @grant        none
// @namespace https://greasyfork.org/users/721949
// @downloadURL https://update.greasyfork.org/scripts/419313/Fix%20QNAP%20QTS%20Username%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/419313/Fix%20QNAP%20QTS%20Username%20Autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Get old Username textarea
    var usernameTextArea = document.getElementById('username');

    //Check if the field exist to avoid errors outside of the login page
    if(usernameTextArea != null){
        //Create the new input element
        var usernameInput = document.createElement('input');
        usernameInput.id = 'username';
        usernameInput.placeholder = "Username";
        usernameInput.class = "qStr";

        //Replace
        usernameTextArea.parentNode.replaceChild(usernameInput, usernameTextArea);
    }
})();