// ==UserScript==
// @name         ESP PRIVATE VOXIOM
// @namespace    http://tampermonkey.net/
// @version      0.69696971
// @description  ESP Voxiom Private
// @author       Whoami
// @match        *://voxiom.io/*
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://unpkg.com/three@latest/build/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/506126/ESP%20PRIVATE%20VOXIOM.user.js
// @updateURL https://update.greasyfork.org/scripts/506126/ESP%20PRIVATE%20VOXIOM.meta.js
// ==/UserScript==

let playersVisible = true;

window.addEventListener('keyup', function (event) {
    if (event.code === 'KeyV') {
        playersVisible = !playersVisible;
        console.log(`Players visible: ${playersVisible}`);
    }
});

const THREE = window.THREE;
const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.0, 1.0, 1.0).translate(0, 0.5, 0));

// Prevents items from getting dropped when detected
Object.defineProperty(window, 'THREE', { get() { return undefined; } });

let currentColor = 0;

function makeHitbox() {
    let hitbox = new THREE.LineSegments(geo);
    hitbox.material = new THREE.RawShaderMaterial({
        vertexShader: `attribute vec3 position;uniform mat4 projectionMatrix;uniform mat4 modelViewMatrix;void main() {gl_Position = projectionMatrix*modelViewMatrix*vec4( position, 1.0 );gl_Position.z = 1.0;}`,
        fragmentShader: `precision mediump float;uniform vec3 color;void main() {gl_FragColor = vec4( color, 1.0 );}`,
        uniforms: { color: { value: new THREE.Color(`hsl(${currentColor}, 100%, 50%)`) } }
    });
    hitbox.scale.set(0.4, 1.2, 0.4);
    return hitbox;
}

let gameScene;
WeakMap.prototype.set = new Proxy(WeakMap.prototype.set, {
    apply(target, thisArg, [scene]) {
        if (scene.type === 'Scene') {
            if (scene.children.length === 9) {
                window.scene = scene;
                gameScene = scene;
                console.log('Game scene detected and set.');
            }
        }
        return Reflect.apply(target, thisArg, arguments);
    }
});

window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply(target, thisArg, args) {
        args[0] = new Proxy(args[0], {
            apply(callback, callbackThis, callbackArgs) {
                if (gameScene == null) {
                    return Reflect.apply(callback, callbackThis, callbackArgs);
                }

                currentColor = (currentColor + 1) % 360; // Increment currentColor by 1 and reset to 0 when it reaches 360

                const allEntities = gameScene.children[5].children;
                for (let i = 0; i < allEntities.length; i++) {
                    const entity = allEntities[i];
                    if (entity.children.length === 0) {
                        continue;
                    }
                    if (!entity.HitBox) {
                        const name = entity.children[0].name;
                        // Game scene saves name as parachute, hence can be used to recognize a player
                        if (name === 'Parachute') {
                            entity.isPlayer = true;
                            // Generate a hitbox for the player
                            let hitbox = makeHitbox();
                            entity.add(hitbox);
                            entity.HitBox = hitbox;
                            console.log('Hitbox added to player.');
                        }
                    }
                    if (entity.HitBox != null) {
                        entity.HitBox.material.uniforms.color.value = new THREE.Color(`hsl(${currentColor}, 100%, 50%)`); // Update hitbox color
                        entity.HitBox.visible = playersVisible;
                    }
                }
                return Reflect.apply(callback, callbackThis, callbackArgs);
            }
        });
        return Reflect.apply(target, thisArg, args);
    }
});

console.log('Script loaded.');
