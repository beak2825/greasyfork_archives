// ==UserScript==
// @name         FxP Block Everyone
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Blocks every cunt
// @author       A Trap
// @match        https://www.fxp.co.il/profile.php?do=ignorelist*
// @match        https://www.fxp.co.il/showthread.php*
// @match        https://www.fxp.co.il/forumdisplay.php*
// @downloadURL https://update.greasyfork.org/scripts/381787/FxP%20Block%20Everyone.user.js
// @updateURL https://update.greasyfork.org/scripts/381787/FxP%20Block%20Everyone.meta.js
// ==/UserScript==

(function() {

    // String constants
    const strings = {
        header_add: 'חסימה מלאה - הוסף משתמשים לרשימה',
        label_add: 'שם משתמש: ',
        button_add: 'הוסף',
        success_add: 'המשתמש נוסף לרשימה בהצלחה',
        failed_add: 'המשתמש הזה כבר קיים ברשימה',
        header_rm: 'חסימה מלאה - הסר משתמשים מהרשימה',
        label_rm: 'שם משתמש: ',
        header2_rm: 'רשימת משתמשים',
        button_rm: 'הסר',
        success_rm: 'המשתמש הוסר מהרשימה בהצלחה',
        failed_rm: 'המשתמש הזה לא קיים ברשימה'
    }

    // Parse local storage
    let getData = function() {
        try {
            return JSON.parse(localStorage.fxpblock);
        } catch (ex) {
            localStorage.fxpblock = "[]";
            return [];
        }
    }

    // Check if a user exists in the list
    let findUser = function(user) {
        return getData().findIndex(u => {
            return u.toLowerCase() === user.toLowerCase();
        }) != -1;
    }

    // Adds a user to the list
    let pushData = function(user) {
        let temp = getData();
        temp.push(user);
        localStorage.fxpblock = JSON.stringify(temp);
    }

    // Removes a user from the list
    let removeUser = function(user) {
        if (!findUser(user)) {
            return false;
        }
        localStorage.fxpblock = JSON.stringify(getData().filter(u => {
            return u.toLowerCase() !== user.toLowerCase();
        }));
        return true;
    }

    // Creates forms for adding & deleting users
    let addForms = function() {

        let vanilla_add_user = document.querySelector('#ignorelist_add_form');
        let container_node = document.createElement('div');
        let new_add_user_html = `<h2 class="blockhead">${strings.header_add}</h2><form id="new_add_user_form"><div class="blockbody formcontrols settings_form_border"><div class="section"><div class="blockrow"><label for="new_add_user_txt">${strings.label_add}</label><div class="popupmenu nomouseover noclick nohovermenu popupcustom rightcol"><div><input type="text" class="primary textbox popupctrl" id="new_add_user_txt" name="username" autocomplete="off"></div></div></div></div></div></form><div class="blockfoot actionbuttons settings_form_border"><div class="group"><input type="submit" class="button" value="${strings.button_add}" form="new_add_user_form"></div></div>`;

        let remove_user_html = `<h2 class="blockhead">${strings.header_rm}</h2><form id="remove_user_form"><div class="blockbody formcontrols settings_form_border"><div class="section"><div class="blockrow"><label for="new_add_user_txt">${strings.label_rm}</label><div class="popupmenu nomouseover noclick nohovermenu popupcustom rightcol"><div><input type="text" class="primary textbox popupctrl" id="new_add_user_txt" name="username" autocomplete="off"></div></div></div></div><h3 class="blocksubhead">${strings.header2_rm}</h3><div class="section"><div class="blockrow"><span id="user_list">${getData().join(', ')}</span></div></div></div></form><div class="blockfoot actionbuttons settings_form_border"><div class="group"><input type="submit" class="button" value="${strings.button_rm}" form="remove_user_form"></div></div>`;

        container_node.innerHTML = new_add_user_html + remove_user_html;
        vanilla_add_user.parentNode.insertBefore(container_node, vanilla_add_user.nextSibling);

        let user_list_node = container_node.querySelector('#user_list');

        // Handles adding users on form submit
        container_node.querySelector('#new_add_user_form').addEventListener('submit', e => {
            e.preventDefault();
            let username = e.target.querySelector('input[name=username]').value;

            if (findUser(username)) {
                alert(strings.failed_add);
            } else {
                pushData(username);
                user_list_node.innerText = getData().join(', ');
                e.target.reset();
                alert(strings.success_add);
            }
        });

        // Handles removing users on form submit
        container_node.querySelector('#remove_user_form').addEventListener('submit', e => {
            e.preventDefault();
            let username = e.target.querySelector('input[name=username]').value;

            if (removeUser(username)) {
                user_list_node.innerText = getData().join(', ');
                e.target.reset();
                alert(strings.success_rm);
            } else {
                alert(strings.failed_rm);
            }
        });

    }

    // Deletes elements regarding a blocked user given the list element & where to look for the username
    let cleanBlockedUser = function(listSelector, usernameSelector) {
        document.querySelectorAll(listSelector).forEach(el => {
            if (getData().includes(el.querySelector(usernameSelector).textContent)) {
                el.remove();
            }
        });
    }

    // Runs the correct actions depending on the current location
    if (location.pathname.includes('profile')) {
        addForms();
    } else if (location.pathname.includes('forumdisplay')) {
        cleanBlockedUser('.threads .threadbit', '.author .username');
    } else if (location.pathname.includes('showthread')) {
        cleanBlockedUser('.posts .postbit', '.username_container .username');
    }

})();