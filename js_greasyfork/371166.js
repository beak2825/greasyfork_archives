// ==UserScript==
// @name     TMA Script
// @version  11
// @include https://mytma.fe.hhi.de/*
// @description "TMA Script"

// @namespace https://greasyfork.org/users/149650
// @downloadURL https://update.greasyfork.org/scripts/371166/TMA%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/371166/TMA%20Script.meta.js
// ==/UserScript==
        
           
window.setInterval(() => {
    let e;
    if (document.querySelector('#session')) {
        e = document.querySelector('#session');
    } else {
        e = document.createElement('span');
        e.id = 'session';
        document.querySelector('#fixiert').appendChild(e);
    }
    let session = document.cookie.replace('JSESSIONID=', '');
    if (e.innerHTML != session) {
        e.innerHTML = session;
    }

},  100);