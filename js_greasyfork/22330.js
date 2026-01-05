// ==UserScript==
// @name         MTNY Auto Login
// @version      1.2.0
// @description  Auto-Login script for MyTown New York Wifi
// @author       Jed Buenaventura
// @match        *hotspot.mytown-newyork.ph/login
// @match        192.168.11.1/login
// @match        goo.gl/IUt7fk
// @match        *hotspot.mytown-newyork.ph/*status*
// @grant        none
// @namespace https://greasyfork.org/en/scripts/22330-mtny-auto-login
// @downloadURL https://update.greasyfork.org/scripts/22330/MTNY%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/22330/MTNY%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var nameuser = 'user';
    var wordpass = 'Subway1244';

    // Check if on login screen
    if (window.location.href.indexOf('login') > -1 && window.location.href.indexOf('status') <= -1)
    {
        if (document.getElementsByName("submit")[0] === undefined) {
            return;
        }
        var text = document.querySelector(".footer").innerText.trim();
        if (text.length > 0) {
            alert(text);
            return;
        }
        console.log('Logging in...');
        document.getElementsByName("username")[1].value = nameuser;
        document.getElementsByName("password")[1].value = wordpass;
        document.getElementsByName("submit")[0].click();
    }
    else
    {
         // Refresh rate every n minutes
        var RefreshRate = 1 * 60;
        var rawTitle = document.title;

        setInterval(function(){
            if (RefreshRate >= 1)
            {
                document.title = RefreshRate + ' | ' + rawTitle;
                console.log('Refreshing in ' + RefreshRate);
            }
            else
            {
                window.location = 'http://hotspot.mytown-newyork.ph/login';
            }
            RefreshRate--;
        }, 1000);
    }
})();