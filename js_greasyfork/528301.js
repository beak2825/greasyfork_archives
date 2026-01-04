// ==UserScript==
// @name         3d effect
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  3D
// @author       Destiny
// @match        *://landgreen.github.io/n-gon*
// @icon         https://www.google.com/s2/favicons?domain=landgreen.github.io/n-gon
// @grant        none
// @require      https://unpkg.com/three@0.77.0/three.min.js
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528301/3d%20effect.user.js
// @updateURL https://update.greasyfork.org/scripts/528301/3d%20effect.meta.js
// ==/UserScript==

window.Image = new Proxy(window.Image, {
    construct() {
        const result = Reflect.construct(...arguments);
        result.crossOrigin = 'anonymous';
        return result;
    }
});
let skipRectMethods = true;
const originalFillRect = ctx.fillRect;
ctx.fillRect = function() {
    if (!skipRectMethods) {
        originalFillRect.apply(this, arguments);
    }
};

const originalStrokeRect = ctx.strokeRect;
ctx.strokeRect = function() {
    if (!skipRectMethods) {
        originalStrokeRect.apply(this, arguments);
    }
};

// const originalStroke = ctx.stroke;
// ctx.stroke = function() {
//     if (!(arguments[0] instanceof Path2D)) {
//         originalStroke.apply(this, arguments);
//     }
// };

// const originalFill = ctx.fill;
// ctx.fill = function() {
//     if (!skipRectMethods || !(arguments[0] instanceof Path2D)) {
//         originalFill.apply(this, arguments);
//     }
// };

canvas.style.opacity = '0';
console.warn = function() {
    // Do nothing
};

const renderer = new THREE.WebGLRenderer({ alpha: true, powerPreference: "high-performance" });

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.domElement.style.position = 'absolute';
renderer.domElement.style.left = '0';
renderer.domElement.style.top = '0';
renderer.domElement.style.pointerEvents = 'none';

canvas.parentNode.insertBefore(renderer.domElement, canvas);

const scene = new THREE.Scene();

scene.background = new THREE.Color('red');

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

camera.position.z = Math.sin(Math.PI / 3) * 2;

const texture = new THREE.CanvasTexture(canvas);

texture.minFilter = THREE.LinearMipMapLinearFilter;
texture.magFilter = THREE.LinearFilter;

const material = new THREE.RawShaderMaterial({
    vertexShader: `
        attribute vec3 position;
        varying vec3 vPosition;
        void main() {
            vPosition = position;
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        precision mediump float;
        uniform sampler2D mainTexture;
        uniform float depth;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec3 vPosition;

        void main() {
            vec3 groundColor = vec3(0.804, 0.804, 0.804);
            vec3 red = vec3(0.867, 0.675, 0.678);
            vec4 a = vec4(0.0), b;
            const int count = 20;

            // Define light source in UV space (center of screen)
            vec2 lightPos = vec2(0.5, 0.5);

            for (int i = 0; i <= count; i++) {
                vec3 pos = vec3(vPosition.xy, float(i) / float(count) * depth);
                vec4 transformed = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                vec2 uv = transformed.xy / transformed.w * 0.5 + 0.5;

                b = (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0)
                    ? vec4(groundColor, 1.0)
                    : texture2D(mainTexture, uv);



                a.rgb = a.rgb * a.a + b.rgb * b.a * (1.0 - a.a);
                a.a += b.a * (1.0 - a.a);
            }

            gl_FragColor = a;
        }
    `,
    uniforms: {
        mainTexture: { value: texture },
        depth: { value: 0.2 }
    }
});

const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// let lastUpdate = performance.now();
function animate() {
    // const now = performance.now();
    // if (now - lastUpdate > 16) {
        skipRectMethods = true;
        texture.needsUpdate = true;
        skipRectMethods = false;
        // lastUpdate = now;
    // }
    renderer.render(scene, camera);
}
cycle = () => {
    if (!simulation.paused) requestAnimationFrame(cycle);
    const now = Date.now();
    const elapsed = now - simulation.then; // calc elapsed time since last loop
    if (elapsed > simulation.fpsInterval) { // if enough time has elapsed, draw the next frame
        simulation.then = now - (elapsed % simulation.fpsInterval); // Get ready for next frame by setting then=now.   Also, adjust for fpsInterval not being multiple of 16.67

        simulation.cycle++; //tracks game cycles
        m.cycle++; //tracks player cycles  //used to alow time to stop for everything, but the player
        if (simulation.clearNow) {
            simulation.clearNow = false;
            simulation.clearMap();
            level.start();
        }
        simulation.loop();
    }
    // animate();
}
setInterval(()=>{animate();}, 60);