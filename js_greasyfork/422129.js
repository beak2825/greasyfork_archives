// ==UserScript==
// @name The West - Enhanced Fort Arrow
// @name:pt-BR The West - Seta de forte melhorada
// @version 0.02
// @author Venozmat
// @include http://*.the-west.*/game.php*
// @include https://*.the-west.*/game.php*
// @include http://*.tw.innogames.*/game.php*
// @include https://*.tw.innogames.*/game.php*
// @grant none
// @description Enhanced Fort Arrow for The-West browser game
// @description:pt-br Seta de forte melhorada para o jogo de navegador The-West
// @namespace https://greasyfork.org/users/739715
// @downloadURL https://update.greasyfork.org/scripts/422129/The%20West%20-%20Enhanced%20Fort%20Arrow.user.js
// @updateURL https://update.greasyfork.org/scripts/422129/The%20West%20-%20Enhanced%20Fort%20Arrow.meta.js
// ==/UserScript==
 
var tilewidth = 15,
    tileheight = 15;
var guestId = 0xFFF;
var charclasses = {
    '-1': 'greenhorn',
    '0': 'adventurer',
    '1': 'duelist',
    '2': 'worker',
    '3': 'soldier'
};
FortBattleWindow.drawArrow = function(g, character) {
    if (character.dead || character.position === character.destinycell) return;
    var posXY = this.toxy(character.position);
    var targetXY = this.toxy(character.destinycell);
    var x = posXY[0] * tilewidth;
    var y = posXY[1] * tileheight;
    var tx = (targetXY[0] + .5) * tilewidth;
    var ty = (targetXY[1] + .5) * tileheight;
    x += tilewidth * .5;
    y += tileheight * .5;
    var dx = tx - x;
    var dy = ty - y;
    var len = Math.sqrt(dx * dx + dy * dy);
    dx /= len;
    dy /= len;
    var gradient = g.createLinearGradient(tx, ty, x - dy * tilewidth * .0 + dx * tilewidth * .5, y + dx * tileheight * .0 + dy * tileheight * .5);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    g.fillStyle = gradient;
    g.strokeStyle = '#000000';
    g.beginPath();
    g.moveTo(tx, ty);
    g.lineTo(tx - dx * tilewidth * 1 + dy * tilewidth * .5, ty - dy * tileheight * 1 - dx * tileheight * .5);
    g.lineTo(x + dy * tilewidth * .3 + dx * tilewidth * .25, y - dx * tileheight * .3 + dy * tileheight * .25);
    g.lineTo(x - dy * tilewidth * .0 + dx * tilewidth * .5, y + dx * tileheight * .0 + dy * tileheight * .5);
    g.lineTo(x - dy * tilewidth * .3 + dx * tilewidth * .25, y + dx * tileheight * .3 + dy * tileheight * .25);
    g.lineTo(tx - dx * tilewidth * 1 - dy * tilewidth * .5, ty - dy * tileheight * 1 + dx * tileheight * .5);
    g.closePath();
    g.fill();
    g.stroke();
};
FortBattleWindow.setSwapState = function(swapState) {
    if (swapState) document.querySelectorAll(".battleground_thick_arrow")[0].style.filter = "invert(1)";
    else document.querySelectorAll(".battleground_thick_arrow")[0].style.filter = "";
};