// ==UserScript==
// @name         干净斗鱼
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  净化斗鱼广告
// @author       FJ
// @match        https://www.douyu.com/*
// @icon         https://www.google.com/s2/favicons?domain=douyu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437060/%E5%B9%B2%E5%87%80%E6%96%97%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/437060/%E5%B9%B2%E5%87%80%E6%96%97%E9%B1%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function (evt) {
        var elems = document.getElementsByClassName('layout-Player-video');
        if(elems.length == 0)
        {
            return;
        }
        var player = elems[0];
        document.body.appendChild(player);
        player.style.position='inherit';
        player.style.paddingTop='0px';
        document.body.style.backgroundColor='black'
        document.body.style.overflow='hidden';
        var root = document.getElementById('root');
        if(root)
        {
            root.style.visibility='collapse';
        }
        window.scrollTo(0,0);
        elems = document.getElementsByClassName('layout-Container');
        if(elems.length > 0)
        {
            var container = elems[0];
            container.style.visibility='collapse';
        }
        return true;
    }, false);
})();