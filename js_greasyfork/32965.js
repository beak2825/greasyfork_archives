// ==UserScript==
// @name         Easy Signin | DH1
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Tired of manually signing in? Give this a try! :D
// @author       Lasse98brus
// @match        *.diamondhunt.co/DH1/
// @match        *.diamondhunt.co/DH1/index.php
// @match        *.diamondhunt.co/DH1/php/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32965/Easy%20Signin%20%7C%20DH1.user.js
// @updateURL https://update.greasyfork.org/scripts/32965/Easy%20Signin%20%7C%20DH1.meta.js
// ==/UserScript==

/*  ____________________________________________________________
 * | FOR THE FIRST TIME, THIS SCRIPT IS CONFIGURED IN A NEW UI! |
 * |------------------------------------------------------------|
 * | I'll say thank you a lot Zorbing for explaining how a lot  |
 * | of the code I've used here does work! I would not be able  |
 * | to complete this script like this without your help!       |
 * |------------------------------------------------------------|
 * | If you're a user of old versions of this script, you may   |
 * | think "Finally no more config after next update again!" :) |
 * |------------------------------------------------------------|
 * | The final notes here, thank you for using my script! :D    |
 * |____________________________________________________________|
 */

// >>> Error page | redirect back >>>
if (location.href.indexOf(/.co(\/php|\/DH1\/php)\//g)) {
    location.href = location.protocol + '//' + location.host + location.pathname.split('php/')[0];
}
// <<< Error page | redirect back <<<

// >>> Add HTML code to the signin page | DH1 and DH2 >>>
var addHTML = `<br>

<!-- START | EasySignin for DH1 and DH2 | ES Add User Box -->
<div class="login-box custom-class">
    <h1>Easy Signin</h1>
    <div id="custom-users">
        <input type="text" name="custom-username" id="custom-username" maxlength="12"><br>
        <input type="password" name="custom-password" id="custom-password" maxlength="40"><br>
        <input type="button" value="Add user" onclick="simply.add()">&nbsp;
        <input type="button" value="Clear list" onclick="simply.clear()">
    </div>
</div>
<!-- STOP | EasySignin for DH1 and DH2 | ES Add User Box -->

<!-- START | EasySignin for DH1 and DH2 | ES Easy Signin Box -->
<div class="login-box custom-class">
    <h1>Users List</h1>
    <div id="custom-users-list">
        <!-- This will be replaced by the script when it's fully loaded -->
    </div>
    <br>
</div>
<!-- STOP | EasySignin for DH1 and DH2 | ES Easy Signin Box -->

<!-- START | EasySignin for DH1 and DH2 | ES Easy Signin Box -->
<div class="login-box custom-class">
    <h1>About This</h1>
    <p>Version - 1.0</p>
    <p>Dev - Lasse Brustad</p>
    <p>Helper - Zorbing</p>
    <br>
</div>
<!-- STOP | EasySignin for DH1 and DH2 | ES Easy Signin Box -->

<!-- START | EasySignin for DH1 and DH2 | ES Style Tweaks -->
<style>
    /* Just some style tweaks for the added HTML */
    #custom-users input, #custom-users-list input {
        margin-bottom: 8px;
    }
    #custom-users-list, #custom-users-list input {
        width:100%;
    }
    .custom-class {
        margin-top: 24px;
    }
</style>
<!-- STOP | EasySignin for DH1 and DH2 | ES Style Tweaks -->

<!-- START | EasySignin for DH1 and DH2 | ES Failproofing Script Helper -->
<script>
    function simply() {}
</script>
<!-- STOP | EasySignin for DH1 and DH2 | ES Failproofing Script Helper -->
`;

var main_div = document.body.getElementsByTagName('div')[0];
main_div.innerHTML = main_div.innerHTML + addHTML;
// <<< Add HTML code to the signin page | DH1 and DH2 <<<

// >>> Default user settings >>>
var users = {
    dh1: [true],
    dh2: [true]
};
// <<< Default user settings <<<

// >>> Testing if you're playing DH1 or DH2 >>>
function init() {
    if (location.href.indexOf('.co/DH1/') !== -1) {
        return "dh1";
    } else {
        return "dh2";
    }
}
var game = init();
// <<< Testing if you're playing DH1 or DH2 <<<

// >>> Storing the user list encoded for security reason >>>
var key = 'easy_signin_' + game;
var store = {
    save: function() {
        localStorage.setItem(key, btoa(JSON.stringify(users)));
        console.log('Saved!');
    },
    load: function() {
        if (localStorage.getItem(key) === null) {
            store.save();
            console.log('Loaded!');
        } else {
            users = JSON.parse(atob(localStorage.getItem(key)));
            console.log('Loaded!');
        }
    }
};
store.load();
// <<< Storing the user list encoded for security reason <<<

// >>> Changing the function from the added HTML >>>
window.simply = {
    add: function() {
        // Add user
        var usr = document.getElementById('custom-username').value;
        usr = usr.toLowerCase();
        var pwd = document.getElementById('custom-password').value;
        if (users[game][0] == true) users[game] = [];
        users[game].push({
            username: usr,
            password: btoa(pwd)
        })
        store.save();
        reload_options();
    },
    clear: function() {
        // Clear user storage
        users[game] = [true];
        store.save();
        reload_options();
    },
    signin: function(usr) {
        // Signin choosen user
        var pwd;
        for (let i = 0; i < users[game].length; i++) {
            if (users[game][i].username == usr) {
                pwd = atob(users[game][i].password);
                break;
            }
        }
        document.getElementById("username").value = usr;
        document.getElementById("password").value = pwd;
        document.getElementById('loginSubmitButton').click();
    }
};
// <<< Changing the function from the added HTML <<<

// >>> Updating "Users List" >>>
function reload_options() {
    var test = users[game];
    var u = "";
    if (users[game][0] == true) {
        u = "<p>No users yet!</p>";
    } else {
        for (let i = 0; i < users[game].length; i++) {
            u += '<input type="button" value="' + users[game][i].username + '" onclick="simply.signin(this.value)">';
            if (i + 1 < users[game].length) u += '<br>';
        }
    }
    document.getElementById('custom-users-list').innerHTML = u;
}
reload_options();
// <<< Updating "Users List" <<<