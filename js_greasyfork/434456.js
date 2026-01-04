// ==UserScript==
// @name         Custom Jstris Skins
// @namespace    http://tampermonkey.net/
// @description  Set custom skins and ghost skins for Jstris
// @version      0.13
// @author       leonid
// @match        https://*.jstris.jezevec10.com/*
// @downloadURL https://update.greasyfork.org/scripts/434456/Custom%20Jstris%20Skins.user.js
// @updateURL https://update.greasyfork.org/scripts/434456/Custom%20Jstris%20Skins.meta.js
// ==/UserScript==

(() => {
    const skinUrl = 'https://m.imgur.com/G6WbXoD.png';
    const skinSize = 48;
    const ghostUrl = 'https://i.imgur.com/t6bhAs3.png';
    const ghostSize = 36;
 
    window.addEventListener('load', () => {
        if (typeof Game != 'undefined') {
            // Game Mode
            loadSkin(skinUrl, skinSize);
            loadGhostSkin(ghostUrl, ghostSize);
        } else {
            // Replay Mode
 
            // Don't load skin before replay starts playing, otherwise it shows stuff like this https://cdn.discordapp.com/attachments/340282855420723201/642924315272151045/unknown.png
            // $('#load').click(() => loadSkin(skinUrl, skinSize));
            // loadSkin got taken away recently, so here's the workaround.
 
            const skin = new Image;
            skin.src = skinUrl;
            View.prototype.drawBlock = function(t, e, i) {
                if (i && t >= 0 && e >= 0 && t < 10 && e < 20) {
                    const s = this.drawScale * this.block_size;
                    this.ctx.drawImage(skin, this.g.coffset[i] * skinSize, 0, skinSize, skinSize, t * this.block_size, e * this.block_size, s, s);
                }
            }
            View.prototype.drawBlockOnCanvas = function(t, e, i, s) {
                let o = s === this.HOLD ? this.hctx : this.qctx;
                o.drawImage(skin, this.g.coffset[i] * skinSize, 0, skinSize, skinSize, t * this.block_size, e * this.block_size, this.block_size, this.block_size);
            }
 
            // They don't have loadGhostSkin in replays, so we gotta do it this way.
            
            const ghost = new Image;
            ghost.src = ghostUrl;
            View.prototype.drawGhostBlock = function(t, e, i) {
                if (t >= 0 && e >= 0 && t < 10 && e < 20) {
                    const s = this.drawScale * this.block_size;
                    this.ctx.drawImage(ghost, (this.g.coffset[i] - 2) * ghostSize, 0, ghostSize, ghostSize, t * this.block_size, e * this.block_size, s, s);
                }
            }
        }
    });
})();