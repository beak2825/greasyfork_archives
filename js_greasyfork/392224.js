// ==UserScript==
// @name         Custom Jstris Skins
// @namespace    http://tampermonkey.net/
// @description  Set custom skins and ghost skins for Jstris
// @version      0.15
// @author       leonid
// @match        https://*.jstris.jezevec10.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/392224/Custom%20Jstris%20Skins.user.js
// @updateURL https://update.greasyfork.org/scripts/392224/Custom%20Jstris%20Skins.meta.js
// ==/UserScript==

(function() {
    const checkLoaded = setInterval(() => {
        if (typeof loadSkin !== 'undefined') {
            clearInterval(checkLoaded);
            setSkin();
        }
    }, 100);

    function setSkin() {
        const skinUrl = 'https://i.imgur.com/q2Kx060.png';
        const skinSize = 48;
        const ghostUrl = 'https://i.imgur.com/VbOkRzd.png';
        const ghostSize = 36;

        if (typeof Game !== 'undefined') {
            // Game Mode
            loadSkin(skinUrl, skinSize);
            loadGhostSkin(ghostUrl, ghostSize);
        } else {
            // Replay Mode

            // Don't load skin before replay starts playing, otherwise it shows stuff like this https://cdn.discordapp.com/attachments/340282855420723201/642924315272151045/unknown.png
            $('#load').click(() => loadSkin(skinUrl, skinSize));

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
    }
})();
