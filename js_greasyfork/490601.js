// Library for ADDING and PLAYING AUDIO anywhere you need
/*global player*/

"use strict";

window.player = {};

player.play = function (
    source,
    { volume = 0.5, controls = false, removePlayerAfterPlayed = true },
    insertNode = document.body,
    referenceNode = null,
) {
    return new Promise((resolve) => {
        const player = document.createElement("audio");
        player.addEventListener("ended", () => {
            if (removePlayerAfterPlayed) {
                this.remove(player.id);
            }
            resolve(player);
        });
        player.id = Math.random().toString(32).substring(2);
        player.src = source;
        player.autoplay = true;
        player.controls = controls;
        player.volume = volume;
        insertNode.insertBefore(player, referenceNode);
    });
};

player.remove = function (id) {
    document.getElementById(id).remove();
};