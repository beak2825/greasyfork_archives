// ==UserScript==
// @name         Unovafy Duolingo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turn Duolingo people ingo Pokeymen people
// @author       trashgaylie
// @match        https://www.duolingo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @grant        GM_log
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @license      GNU AGPLv3
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/470160/Unovafy%20Duolingo.user.js
// @updateURL https://update.greasyfork.org/scripts/470160/Unovafy%20Duolingo.meta.js
// ==/UserScript==

(function() {

    var interval = window.setInterval(function() {
        var canvas = $('canvas')[0];
        if (typeof canvas !== 'undefined')
            replace()
    }, 500);

    function replace() {
        'use strict';
        var width = 0;
        var height = 0;
        console.log("unovafy");

        var imgs = [
            "https://abload.de/img/hisuingoxwf33.png",
            "https://abload.de/img/eelektross84fhu.png",
            "https://abload.de/img/joltikkxe1g.png",
            "https://abload.de/img/litwickhucn2.png",
            "https://abload.de/img/chandelurev3cc0.png",
            "https://abload.de/img/drayden1nfyx.png",
            "https://abload.de/img/skylauve6p.png",
            "https://abload.de/img/elesaxfedm.png",
            "https://abload.de/img/emmetenem9.png",
            "https://abload.de/img/ingo1gdsu.png",
        ];

        var canvas = $('canvas')[0];
        var rand = imgs[Math.floor(Math.random()*imgs.length)];
        var context = canvas.getContext("2d");
        var img = new Image();
        img.src = rand;
        img.onload = function() {
            var ratio = Math.min(114/this.width,169/this.height);
            while (ratio < 1)
                ratio = ratio*10;

            this.height = 169*ratio;
            this.width = 114*ratio;

            context.drawImage(img, 0, 0);

            if (this.width > 800)
                $(img).css('max-width', '114px');

            $(img).css('max-height', '169px');
            $(img).css('height', 'auto');
            $(img).css('width', 'auto');
            $(img).css('position', 'absolute');
            $(img).css('bottom', '0');
            $(img).attr('id', 'unova_img');

            canvas.replaceWith(img);
            $("#unova_img").parent('div').css('position', 'relative');

        };


    }

})();