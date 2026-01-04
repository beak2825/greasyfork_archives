// ==UserScript==
// @name         Riot Games Account Email
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  check your riot games account email
// @author       sNezz
// @match        https://support.riotgames.com/hc*
// @downloadURL https://update.greasyfork.org/scripts/369848/Riot%20Games%20Account%20Email.user.js
// @updateURL https://update.greasyfork.org/scripts/369848/Riot%20Games%20Account%20Email.meta.js
// ==/UserScript==

'use strict';

var res = document.getElementsByTagName("script")[25].innerHTML; /* save 25th script tag, the one who contains the info we want */
var n = res.indexOf('"email"'); /* look for the email start */
var m = res.indexOf(',"name"', n); /* and end */

var str = res.substring(n+9, m-1) /* the string of the email */

if(str.indexOf('@') != -1){ /* checks email to be correct */
    alert(str); /* shows email */
}