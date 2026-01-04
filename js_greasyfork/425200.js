// ==UserScript==
// @name         </> Kurt & Java Hedef İzleyici
// @namespace    http://tampermonkey.net/
// @version      22.2
// @description  Kurt & Java
// @author       Kurt
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/425200/%3C%3E%20Kurt%20%20Java%20Hedef%20%C4%B0zleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/425200/%3C%3E%20Kurt%20%20Java%20Hedef%20%C4%B0zleyici.meta.js
// ==/UserScript==

//Aim Kodları
const pointAtEntity = uid => {
    let entityPos = game.world.entities[uid].targetTick.position;
    document.dispatchEvent(
        new MouseEvent(
            'mousemove', {
                clientX: game.renderer.worldToScreen(entityPos.x, entityPos.y)
                    .x,
                clientY: game.renderer.worldToScreen(entityPos.x, entityPos.y)
                    .y
            }
        )
    );
};

let playerAimInterval = setInterval(() => {
    let entities = Object.values(game.world.entities);

    entities.forEach((item => {

        if (item.entityClass === "PlayerEntity" && item.uid !== game.world.localPlayer.entity.uid) {
            pointAtEntity(item.uid)
        };

    }));
}, 100);  