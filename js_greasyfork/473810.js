// ==UserScript==
// @name        Alior Bank 1Password AutoFill
// @namespace   bpetrynski
// @author      Bartosz Petrynski
// @description Autofills password input for 1Password support in Alior Bank.
// @match       https://bn.aliorbank.pl/hades/do/Login*
// @match       https://bn.aliorbank.pl/hades/do/LoginAlias*
// @match       https://bn.aliorbank.pl/hades/do/ConsentModule*
// @match       https://bn.aliorbank.pl/hades/do/MaskLogin*
// @match       https://bn.aliorbank.pl/hades/do/*
// @version     1.8
// @grant       none
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/473810/Alior%20Bank%201Password%20AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/473810/Alior%20Bank%201Password%20AutoFill.meta.js
// ==/UserScript==

(function() {
    function setupUsernameAutocomplete() {
        const login = document.querySelector('.login-input[name="p_alias"]');
        if (login) {
            login.autocomplete = "username";
        } else {
            console.error("Couldn't find the login input.");
        }
    }

    function createPasswordHelperInput() {
        const oldLogin = document.getElementById("PASSFIELD1").parentNode.parentNode;
        const input = document.createElement("input");

        input.style.width = oldLogin.offsetWidth + "px"; // Ensure width is set with "px" unit
        oldLogin.style.display = "none";
        input.id = "alior-helper";
        input.type = "password";

        oldLogin.parentNode.insertBefore(input, oldLogin);

        return input;
    }

    function handlePasswordChange(fields) {
        return function() {
            fields.forEach(field => {
                const pos = field.getAttribute("id").substr(9);
                field.setAttribute("value", this.value.substr(pos-1,1));
            });
        };
    }

    function main() {
        setupUsernameAutocomplete();

        const input = createPasswordHelperInput();
        const fields = Array.from(document.querySelectorAll(".input-mask > input[type='password']"));

        input.addEventListener('change', handlePasswordChange(fields));
    }

    main();
})();