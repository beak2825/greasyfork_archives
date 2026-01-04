// ==UserScript==
// @name         Voxiom.IO Yellow Box Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Create a yellow box instead of game blocks in Voxiom IO and render it on top of the other blocks
// @author       ChatGPT
// @match        *://voxiom.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://unpkg.com/three@latest/build/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/462781/VoxiomIO%20Yellow%20Box%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/462781/VoxiomIO%20Yellow%20Box%20Script.meta.js
// ==/UserScript==

const THREE = window.THREE;

let gameScene;
WeakMap.prototype.set = new Proxy(WeakMap.prototype.set, {apply(t, args, [scene]) {
    if(scene.type === 'Scene') {
        if(scene.children.length === 9) {
            window.scene = scene;
            gameScene = scene;
        }
    }
    return Reflect.apply( ...arguments );
}});

function createYellowBox() {
    const yellowBoxGeometry = new THREE.BoxGeometry(1.0, 1.0, 1.0).translate(0, 0.5, 0);
    const yellowBoxMaterial = new THREE.MeshBasicMaterial({color: 'yellow'});
    const yellowBoxMesh = new THREE.Mesh(yellowBoxGeometry, yellowBoxMaterial);
    yellowBoxMesh.position.set(0, 0, 0);
    return yellowBoxMesh;
}

window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {apply(target, args, args2){
    args2[0] = new Proxy(args2[0], {
        apply() {
            if(gameScene == null) { return; }

            const allEntities = gameScene.children[5].children;
            for ( let i = 0; i < allEntities.length; i++ ) {
                const entity = allEntities[ i ];
                if (entity.children.length === 0) {
                    continue;
                }
                if (!entity.isYellowBox) {
                    const name = entity.children[0].name;
                    
                    if (name !== 'Parachute') {
                        const yellowBoxMesh = createYellowBox();
                        entity.add(yellowBoxMesh);
                        entity.isYellowBox = true;
                    }
                }
            }
            return Reflect.apply( ...arguments );
        }
    });
    return Reflect.apply( ...arguments );
}});
