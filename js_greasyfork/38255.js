// ==UserScript==
// @name         TagPro Long Names
// @description  Don't cut of balls' awefully long names like @@@@@@@@@@@@
// @author       Ko
// @version      1.2
// @include      *.koalabeast.com:*
// @include      *.koalabeast.com/game
// @include      *.jukejuice.com:*
// @include      *.newcompte.fr:*
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/38255/TagPro%20Long%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/38255/TagPro%20Long%20Names.meta.js
// ==/UserScript==

tagpro.ready(function(){

    // This script works by overwriting the 'veryPrettyText' function
    // which is used for displaying names. I only added one thing,
    // compared to the original TagPro code; namely the maxWidth.

    tagpro.renderer.veryPrettyText = function(text, color) {

        var canvas = document.createElement("canvas");
        canvas.width = 32 + 16 * text.length;   //   <<<< This was 128, so 16 pixels per character should be plenty
        canvas.height = 32;
        var context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = "bold 11px arial";
        context.fillStyle = color || "#ffffff";
        context.strokeStyle = "#000000";
        context.shadowColor = "#000000";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.lineWidth = 2;
        context.shadowBlur = 10;
        context.strokeText(text, 16, 16);
        context.shadowBlur = 0;
        context.fillText(text, 16, 16);

        var texture = PIXI.Texture.fromCanvas(canvas);
        return new PIXI.Sprite(texture);
    };

});
