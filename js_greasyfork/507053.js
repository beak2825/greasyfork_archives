// ==UserScript==
// @name         Repuls.io King
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Player ESP, WireFrame
// @author       November2246
// @match        https://repuls.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=repuls.io
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507053/Repulsio%20King.user.js
// @updateURL https://update.greasyfork.org/scripts/507053/Repulsio%20King.meta.js
// ==/UserScript==

const enableESP = true;
const wireframe = false;

/////

const WebGL = WebGL2RenderingContext.prototype;
HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
    apply(target, thisArgs, args) {
        if (args[1]) args[1].preserveDrawingBuffer = true;
        return Reflect.apply(...arguments);

    }
});

WebGL.shaderSource = new Proxy(WebGL.shaderSource, {
    apply(target, thisArgs, args) {
        let [shader, src] = args;
        let oldSrc = src;

        if (src.includes('gl_Position')) {
            if (src.includes('OutlineEnabled')) shader.isPlayerShader = true;

            src = src.replace( `void main()`, `
out float vDepth;
uniform bool enabled;
uniform float threshold;

void main()`);

            if (src.includes('hlslcc_mtx4x4unity_WorldToObject')) {
                src = src.replace(/return;/, `
vDepth = gl_Position.z;
if (enabled && vDepth > threshold)
{
    gl_Position.z = 0.01 + gl_Position.z * 0.1;
}`);
            }

        } else if (src.includes('SV_Target0') && !src.includes('_ScreenParams')) {
            if (src.includes('#extension GL_EXT_shader_texture_lod')) {
                src = src.replace('void main()', `
in float vDepth;
uniform bool enabled;
uniform float threshold;

void main()
` ).replace(/return;/, `
if (enabled && vDepth > threshold) {
	SV_Target0 = vec4(1.0, 0.0, 1.0, 1.0);
}
`);
            }
        }

        args[1] = src;
        return Reflect.apply(...arguments);
    }
});

WebGL.attachShader = new Proxy(WebGL.attachShader, {
    apply(target, thisArgs, [program, shader]) {
        if (shader.isPlayerShader) program.isPlayerProgram = true;
        return Reflect.apply(...arguments);

    },
});

WebGL.getUniformLocation = new Proxy(WebGL.getUniformLocation, {
    apply(target, thisArgs, [program, name]) {
        const result = Reflect.apply(...arguments);
        if (result) {
            result.name = name;
            result.program = program;
        }
        return result;
    },
});

WebGL.uniform4fv = new Proxy(WebGL.uniform4fv, {
    apply(target, thisArgs, [uniform]) {
        const name = uniform && uniform.name;
        if (name === "_ScreenParams") {
            uniform.program.isUIProgram = true;
        }
        return Reflect.apply(...arguments);
    },
});

const handler = {
    apply(target, thisArgs, args) {
        const program = thisArgs.getParameter(thisArgs.CURRENT_PROGRAM);

        if (!program.uniforms) {
            program.uniforms = {
                enabled: thisArgs.getUniformLocation(program, 'enabled'),
                threshold: thisArgs.getUniformLocation(program, 'threshold'),
            };
        }

        const threshold = 4.5;
        const min = 4800;
        const max = 4900;

        program.uniforms.enabled && thisArgs.uniform1i(program.uniforms.enabled, (enableESP && args[1] > min && args[1] < max && !args[3]));
        program.uniforms.threshold && thisArgs.uniform1f(program.uniforms.threshold, threshold);
        args[0] = (!program.isUIProgram && wireframe && (args[1] > 6)) ? thisArgs.LINES : args[0];

        return Reflect.apply(...arguments);
    }
};

WebGL.drawElements = new Proxy(WebGL.drawElements, handler);
WebGL.drawElementsInstanced = new Proxy(WebGL.drawElementsInstanced, handler);