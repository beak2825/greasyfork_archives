// ==UserScript==
// @name         Turn bullets into Spike
// @version      1
// @description  Turns every tank and bullet into a spike! Legend says they do more damage.
// @author       Crabby#9242
// @match        *://diep.io/*
// @icon         https://cdn.discordapp.com/icons/791777406263754752/92821d38dac49e09a43a7967b5872b33.png?size=256
// @namespace https://greasyfork.org/users/750733
// @downloadURL https://update.greasyfork.org/scripts/425867/Turn%20bullets%20into%20Spike.user.js
// @updateURL https://update.greasyfork.org/scripts/425867/Turn%20bullets%20into%20Spike.meta.js
// ==/UserScript==

const IMG_SIZE = 2.5;
const spike = new Image;
spike.src = 'https://cdn.discordapp.com/icons/791777406263754752/92821d38dac49e09a43a7967b5872b33.png?size=2048'
CanvasRenderingContext2D.prototype._arc = CanvasRenderingContext2D.prototype.arc;
CanvasRenderingContext2D.prototype.arc = function () {
    this.drawImage(spike, -IMG_SIZE/2, -IMG_SIZE/2, IMG_SIZE, IMG_SIZE)
}