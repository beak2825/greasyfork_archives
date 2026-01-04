// ==UserScript==
// @name         Reddit ads hiding as post removed
// @namespace    https://www.reddit.com/
// @version      1.01
// @description  remove reddit post ads Jan2020
// @author       thundermilksage@gmail.com
// @include      https://www.reddit.com/
// @include      https://www.reddit.com/r/*
// @include      https://old.reddit.com/
// @include      https://old.reddit.com/r/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394667/Reddit%20ads%20hiding%20as%20post%20removed.user.js
// @updateURL https://update.greasyfork.org/scripts/394667/Reddit%20ads%20hiding%20as%20post%20removed.meta.js
// ==/UserScript==

    const divliste = document.getElementsByTagName('div');
    var i;
    for (i = 0; i < divliste.length; i++) {
        const choosendiv = divliste[i];
        //    console.log(i+': '+choosendiv.className);
        //    console.log(i+': '+choosendiv.className+ ' - '+choosendiv.className.includes("promotedlink"));
        if (choosendiv.className.includes("promotedlink")) {
            choosendiv.parentElement.removeChild(choosendiv);
        }
    }