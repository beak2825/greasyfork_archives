// ==UserScript==
// @name         John Legend Everywhere!
// @namespace    https://lel.wtf
// @license      GNU GPLv3
// @version      1.0
// @description  John Legend is the brand ambassador of Neopets and now the ambassador of your screen. Make every Neopets page LEGENDARY! He appears randomly every 15 pages or so after between 1 and 5 seconds.
// @author       Lamp
// @include      https://www.neopets.com/*
// @match        https://www.neopets.com/*
// @icon         https://lel.wtf/johnlegend.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481735/John%20Legend%20Everywhere%21.user.js
// @updateURL https://update.greasyfork.org/scripts/481735/John%20Legend%20Everywhere%21.meta.js
// ==/UserScript==

(function() {

    function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

    function johnlegend() {
        var img = document.createElement('img');
        // img.width = "60";
        // img.height = "60";
        img.id = 'johnlegend';
        img.src = "https://lel.wtf/johnlegend.png";
        bottom = 300;
        left = -450;
        rotate = 310;
        img.setAttribute("style", "z-index:999;transition: left 2s ease-in-out .5s;position:fixed;left:" + left + "px;bottom:" + bottom + "px;transform: scaleX(-1) rotate(" + rotate + "deg);-moz-transform: scaleX(-1) rotate(" + rotate + "deg);-o-transform: scaleX(-1) rotate(" + rotate + "deg);-webkit-transform: scaleX(-1) rotate(" + rotate + "deg); filter: FlipH;");
        document.getElementsByTagName('body')[0].append(img);


    }

    function hidelegend() {

        document.getElementById('johnlegend').style.left = "-450px";
    }

    function showlegend() {

        document.getElementById('johnlegend').style.left = "-150px";
        setTimeout(() => {
            hidelegend();
        }, 5000);
    }
    johnlegend();



    islegend = random(1, 15);
    whenlegend = random(1000, 5000);


    if (islegend == 11){
    setTimeout(() => {
        showlegend();
    }, whenlegend);
    }

    console.log(islegend);
    console.log(whenlegend);

})();