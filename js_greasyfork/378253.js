// ==UserScript==
// @name         Jogg.se user blocker
// @namespace    http://www.jogg.se/
// @version      0.3
// @description  Hide forum posts made by a specific user on Jogg.se
// @author       Tor
// @match        https://www.jogg.se/Forum/Trad.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378253/Joggse%20user%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/378253/Joggse%20user%20blocker.meta.js
// ==/UserScript==


(function() {
    'use strict';
    createInput();
    var u = getCookie('userToBlock');
    console.log("Cookie: " + u);
    var input = document.getElementById('blockUser');
    input.value = u;
    hidePosts()
})();

// *** Create input and button
function createInput() {
    var container = document.getElementById('menu');

    // Div
    var div = document.createElement('DIV');
    div.style.cssFloat = 'right'
    // Span
    var span = document.createElement('SPAN');
    span.innerHTML = "Dölj inlägg från: "
    // Input
    var input = document.createElement('INPUT');
    input.id = 'blockUser';
    // Button
    var button = document.createElement('BUTTON');
    button.innerText = "Ok";
    button.onclick = hidePosts;
    button.type = 'button';
    button.style.margin = "0 6px 0 4px";

    // Insert
    container.insertAdjacentElement('afterend', div);
    div.insertAdjacentElement('beforeend', span);
    div.insertAdjacentElement('beforeend', input);
    div.insertAdjacentElement('beforeend', button);
}

// *** Hide posts
function hidePosts() {
    var userToBlock = document.getElementById('blockUser').value;
    setCookie('userToBlock', userToBlock, 100)
    console.log(userToBlock)

    var posts = [0];
    posts = document.getElementsByClassName('user');

    for (var i = 0; i < posts.length; i++) {
        var user = posts[i].children[0].innerHTML;
        if (user == userToBlock) {
            posts[i].parentElement.parentElement.style.display = "none";
            console.log("BLOCK: " + posts[i].children[0].innerHTML)
        }
    }
}


// *** Set cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// *** Get cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}