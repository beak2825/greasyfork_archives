// ==UserScript==
// @name         Mogenius Analytics
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Try to remove the limit of Mogenius Analytics.
// @author       yltx
// @match        https://studio.mogenius.com/studio/cloud-space/id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mogenius.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457481/Mogenius%20Analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/457481/Mogenius%20Analytics.meta.js
// ==/UserScript==

var del=setInterval(function(){
    'use strict';
    const cover = document.getElementsByClassName("analytics-upgrade-overlay");
    if(cover.length !== 0){
        for(let i of cover)i.remove();
        clearInterval(del);
    }
},100);