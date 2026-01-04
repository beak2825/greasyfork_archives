// ==UserScript==
// @name         BlockPost King
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Simple Player ESP for BlockPost
// @author       November2246
// @match        https://49face0f-47f1-46fb-83d6-df7098677421.poki-gdn.com/*
// @match        https://playblockpost.pages.dev/assets/blockpost-main/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gbkgames.github.io
// @grant        none
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/536763/BlockPost%20King.user.js
// @updateURL https://update.greasyfork.org/scripts/536763/BlockPost%20King.meta.js
// ==/UserScript==

const WebGL = WebGL2RenderingContext.prototype;
WebGL.shaderSource = new Proxy(WebGL.shaderSource, {
    apply(target, thisArgs, args) {
        let [shader, src] = args;

        if (src.includes('gl_Position')) {
            src = src.replace( `void main()`, `
out float vDepth;
uniform bool enabled;
uniform float threshold;

void main()`);

            if (src.includes('hlslcc_mtx4x4unity_WorldToObject')) {
                src = src.replace(/return;/, `
vDepth = gl_Position.z;
if ( enabled && vDepth > threshold )
{
    gl_Position.z = 0.01 + gl_Position.z * 0.1;
}`);
            }

        } else if (src.includes('SV_Target0')) {
            src = src.replace( 'void main', `
in float vDepth;
uniform bool enabled;
uniform float threshold;

void main
` ).replace(/return;/, `
if( enabled && vDepth > threshold) {
	SV_Target0 = mix(SV_Target0 * 0.8, vec4(1.0, 0.0, 1.0, 1.0), 0.3);
	SV_Target0.a = 1.0;
}
`);
        }

        args[1] = src;
        return Reflect.apply(...arguments);
    }
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
        if (name === 'hlslcc_mtx4x4unity_ObjectToWorld' || name === 'hlslcc_mtx4x4unity_ObjectToWorld[0]') {
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

        program.uniforms.enabled && thisArgs.uniform1i(program.uniforms.enabled, (args[1] > 1100 && args[1] < 1800 && !args[3]));
        program.uniforms.threshold && thisArgs.uniform1f(program.uniforms.threshold, 5.0);

        return Reflect.apply(...arguments);
    }
};

WebGL.drawElements = new Proxy(WebGL.drawElements, handler);
WebGL.drawElementsInstanced = new Proxy(WebGL.drawElementsInstanced, handler);