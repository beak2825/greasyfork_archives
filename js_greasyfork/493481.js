// ==UserScript==
// @name         GeoNoCar liter
// @description  Hides part of the panorama to redact non-trekker gen 3/4 car meta
// @version      0.2.2
// @author       victheturtle#5159
// @match        https://www.geoguessr.com/*
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @icon         https://www.svgrepo.com/show/180174/pickup-truck-transport.svg
// @run-at       document-start
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/493481/GeoNoCar%20liter.user.js
// @updateURL https://update.greasyfork.org/scripts/493481/GeoNoCar%20liter.meta.js
// ==/UserScript==

// credits to drparse for the original GeoNoCar script

function injected() {
    const color = "vec3(float(0.3), float(0.3), float(0.3))";

    const vertexOld = "const float f=3.1415926;varying vec3 a;uniform vec4 b;attribute vec3 c;attribute vec2 d;uniform mat4 e;void main(){vec4 g=vec4(c,1);gl_Position=e*g;a=vec3(d.xy*b.xy+b.zw,1);a*=length(c);}";
    const fragOld = "precision highp float;const float h=3.1415926;varying vec3 a;uniform vec4 b;uniform float f;uniform sampler2D g;void main(){vec4 i=vec4(texture2DProj(g,a).rgb,f);gl_FragColor=i;}";

    const vertexNew = `
varying vec3 a;
varying vec3 potato;
uniform vec4 b;
attribute vec3 c;
attribute vec2 d;
uniform mat4 e;

void main(){
    vec4 g=vec4(c,1);
    gl_Position=e*g;
    a = vec3(d.xy * b.xy + b.zw,1);
    a *= length(c);
    potato = vec3(d.xy, 1.0) * length(c);
}`;
    const fragNew = `
precision highp float;
varying vec3 a;
varying vec3 potato;
uniform vec4 b;
uniform float f;
uniform sampler2D g;

bool show(float alpha1, float alpha2) {
    float alpha3 = abs(alpha1 - 0.5);
    float alpha4 = (alpha3 > 0.25) ? 0.5 - alpha3 : alpha3;
    if (alpha2 + 3.0 * alpha4 * alpha4 > 0.73) {
        return false;
    } else if (alpha4 < 0.0062) {
        return alpha2 > 0.63;
    } else if (alpha4 < 0.0066) {
        return alpha2 > mix(0.63, 0.67, (alpha4-0.0062) / (0.0066-0.0062));
    } else if (alpha4 < 0.065) {
        return alpha2 > 0.67;
    } else if (alpha4 < 0.10) {
        return alpha2 > mix(0.67, 0.715, (alpha4-0.065) / (0.10-0.065));
    } else {
        return false;
    }
}

void main(){
    vec2 aD = potato.xy / a.z;
    vec4 i = vec4(show(aD.x, aD.y) ? ${color} : texture2DProj(g,a).rgb, f);
    gl_FragColor=i;
}`;

    function installShaderSource(ctx) {
        const oldShaderSource = ctx.shaderSource;
        function shaderSource() {
            if (typeof arguments[1] === 'string') {
                if (arguments[1] === vertexOld) arguments[1] = vertexNew;
                else if (arguments[1] === fragOld) arguments[1] = fragNew;
            }
            return oldShaderSource.apply(this, arguments);
        }
        shaderSource.bestcity = 'bintulu';
        ctx.shaderSource = shaderSource;
    }
    function installGetContext(el) {
        const oldGetContext = el.getContext;
        el.getContext = function() {
            const ctx = oldGetContext.apply(this, arguments);
            if ((arguments[0] === 'webgl' || arguments[0] === 'webgl2') && ctx && ctx.shaderSource && ctx.shaderSource.bestcity !== 'bintulu') {
                installShaderSource(ctx);
            }
            return ctx;
        };
    }
    const oldCreateElement = document.createElement;
    document.createElement = function() {
        const el = oldCreateElement.apply(this, arguments);
        if (arguments[0] === 'canvas' || arguments[0] === 'CANVAS') {
            installGetContext(el);
        }
        return el;
    };
}

var script = document.createElement("script");
script.textContent = `(${injected.toString()})()`;
document.body.appendChild(script);
