// ==UserScript==
// @name         Krunker.io Woobly Wobbly World
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Woobly wobbly and disco effect for krunker.io
// @author       Guava_Thrower
// @match        *://krunker.io/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406678/Krunkerio%20Woobly%20Wobbly%20World.user.js
// @updateURL https://update.greasyfork.org/scripts/406678/Krunkerio%20Woobly%20Wobbly%20World.meta.js
// ==/UserScript==

GM_addStyle(`
.modal {
    position: absolute;
    left: 50%;
    top: 10px;
    transform: translate(-50%, 0);
    background: #fff;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    font-size: 0.6em;
    padding: 10px;
    background: hsla(0, 100%, 100%, 0.7);
    border-radius: 5px;
    backdrop-filter: blur(2px);
}

.modal label {
    color: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
`);

(function() {
    'use strict';

    const html = `<div class="modal">
        <label>
            <span>Wobble Strength:</span>
            <input type="range" min="0" max="2" value="0.5" step="0.25" id="effectStrength">
        </label>
        <label>
            <span>Wobble Speed:</span>
            <input type="range" min="0" max="4" value="0.5" step="0.25" id="effectSpeed">
        </label>
        <label>
            <span>Color Speed:</span>
            <input type="range" min="0" max="4" value="0.5" step="0.25" id="colorSpeed">
        </label>
    </div>`;

    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);

    const Config = {
        effectStrength: 0.5,
        colorSpeed: 0.5,
        effectSpeed: 0.5
    };

    document.getElementById("effectStrength").oninput = function () {
        Config.effectStrength = this.value;
    }

    document.getElementById("colorSpeed").oninput = function () {
        Config.colorSpeed = this.value;
    }

    document.getElementById("effectSpeed").oninput = function () {
        Config.effectSpeed = this.value;
    }

    document.addEventListener("pointerlockchange", function () {
        if (document.pointerLockElement) {
            div.style.display = "none";
        } else {
            div.style.display = "";
        }
    })

    const glPrototype = unsafeWindow.WebGLRenderingContext.prototype;
    const colorData = [];

    glPrototype.getUniformLocation = new Proxy(glPrototype.getUniformLocation, {
        apply(target, thisArgs, args) {
            const result = Reflect.apply(...arguments);
            if (args[1] === "diffuse" && !colorData.find(x => x.program === args[0])) {
                colorData.push({
                    gl: thisArgs,
                    program: args[0],
                    uniformLocation: result
                });
            }
            return result;
        }
    });

    glPrototype.uniform3f = new Proxy(glPrototype.uniform3f, {
        apply(target, thisArgs, args) {
            if (colorData.find(x => x.uniformLocation == args[0])) {
                return;
            }
            return Reflect.apply(...arguments);
        }
    });

    const wobbleData = [];
    let line = "uniform mat4 projectionMatrix;\n";
    let uniformLine = "uniform float time;\n" +
                      "uniform float effectStrength;\n";
    let line2 = "gl_Position = projectionMatrix * mvPosition;";
    let positionLine = "mvPosition.x += cos(time + mvPosition.x) * 0.5 * effectStrength;\n" +
                       "mvPosition.y += sin(time + mvPosition.y) * 3.0 * effectStrength;\n" +
                       "mvPosition.z += sin(time + mvPosition.z) * 0.5 * effectStrength;\n";

    glPrototype.shaderSource = new Proxy(glPrototype.shaderSource, {
        apply(target, gl, args) {
            let srcChanged = false;
            if (gl.getShaderParameter(args[0], gl.SHADER_TYPE) === gl.VERTEX_SHADER && args[1].indexOf(line) > -1) {
                args[1] = args[1].replace(line, line + "\n" + uniformLine);
                args[1] = args[1].replace(line2, positionLine + "\n" + line2);
                srcChanged = true;
            }
            const result = Reflect.apply(...arguments);
            if (srcChanged) {
                wobbleData.push({
                    shader: args[0],
                    program: null,
                    gl: null,
                    uniforms: {},
                });
                console.log("[SCRIPT] Shader found.");
            }
            return result;
        }
    });

    glPrototype.attachShader = new Proxy(glPrototype.attachShader, {
        apply(target, thisArgs, args) {
            let object = wobbleData.find(x => x.shader == args[1]);
            if (object) {
                object.program = args[0];
                console.log("[SCRIPT] Program found!");
            }
            return Reflect.apply(...arguments);
        }
    });

    glPrototype.linkProgram = new Proxy(glPrototype.linkProgram, {
        apply(target, thisArgs, args) {
            let result = Reflect.apply(...arguments);
            let object = wobbleData.find(x => x.program == args[0]);
            if (object) {
                object.gl = thisArgs;
                object.uniforms.time = object.gl.getUniformLocation(object.program, "time");
                object.uniforms.effectStrength = object.gl.getUniformLocation(object.program, "effectStrength");
                console.log("[SCRIPT] Program linked!");
            }
            return result;
        }
    });

    glPrototype.deleteProgram = new Proxy(glPrototype.deleteProgram, {
        apply(target, thisArgs, args) {
            let i1 = colorData.findIndex(x => x.program === args[0]);
            if (i1 > -1) {
                colorData.splice(i1, 1);
            }
            let i2 = wobbleData.findIndex(x => x.program === args[0]);
            if (i2 > -1) {
                wobbleData.splice(i2, 1);
            }
            return Reflect.apply(...arguments);
        }
    });

    let frames = 0;
    let color = [0, 0, 0];

    setInterval(function () {
        frames++;

        // color
        color[0] = Math.sin(frames / 10 * Config.colorSpeed) * 0.5 + 0.5;
        color[1] = -Math.sin(frames / 10 * Config.colorSpeed) * 0.5 + 0.5;
        color[2] = Math.sin(Math.sin(frames / 10 * Config.colorSpeed)) * 0.5 + 0.5;
        colorData.forEach((object) => {
            let { gl, uniformLocation, program } = object;
            let temp = gl.getParameter(gl.CURRENT_PROGRAM);
            gl.useProgram(program);
            gl.uniform3fv(uniformLocation, color);
            gl.useProgram(temp);
        });

        // wobble wobble
        wobbleData.forEach((object) => {
            if (!object.gl) return;
            let { gl, uniforms, program } = object;
            let temp = gl.getParameter(gl.CURRENT_PROGRAM);
            gl.useProgram(program);
            gl.uniform1f(uniforms.time, frames / 100 * Config.effectSpeed);
            gl.uniform1f(uniforms.effectStrength, Config.effectStrength);
            gl.useProgram(temp);
        });
    }, 1000 / 60);
})();