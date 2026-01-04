// ==UserScript==
// @name         Unfollow Instagram
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Deixa de seguir todas as pessoas do instagram
// @author       HuhRyan
// @match        *://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402008/Unfollow%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/402008/Unfollow%20Instagram.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        var b = document.getElementsByClassName('-nal3')[2]
        b.click()
        var a = document.getElementsByClassName('sqdOP  L3NKy    _8A5w5    ')
        a[1].click()
        var c = document.getElementsByClassName('aOOlW -Cab_   ')
        c[0].click()
        location.reload(true)
    }, 2000)
})();