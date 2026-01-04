// ==UserScript==
// @name         TuxunNoCar
// @description  Redacts the car from Tuxun. Shift-K to toggle compass.
// @namespace    Tuxun.Fun/
// @version      0.2.0
// @author       Rylleon
// @match        Tuxun.Fun/*
// @grant        unsafeWindow
// @run-at       document-start
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/484799/TuxunNoCar.user.js
// @updateURL https://update.greasyfork.org/scripts/484799/TuxunNoCar.meta.js
// ==/UserScript==

(function() {
    'use strict';

function injected() {
    const OPTIONS = {
        colorR: 0.5,
        colorG: 0.5,
        colorB: 0.5,
    };

    // If the script breaks, search devtools for "BINTULU" and replace these lines with the new one
    const vertexOld = "const float f=3.1415926;varying vec3 a;uniform vec4 b;attribute vec3 c;attribute vec2 d;uniform mat4 e;void main(){vec4 g=vec4(c,1);gl_Position=e*g;a=vec3(d.xy*b.xy+b.zw,1);a*=length(c);}";
    const fragOld = "precision highp float;const float h=3.1415926;varying vec3 a;uniform vec4 b;uniform float f;uniform sampler2D g;void main(){vec4 i=vec4(texture2DProj(g,a).rgb,f);gl_FragColor=i;}";

    const vertexNew = `
const float f=3.1415926;
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
    const fragNew = `precision highp float;
const float h=3.1415926;
varying vec3 a;
varying vec3 potato;
uniform vec4 b;
uniform float f;
uniform sampler2D g;
void main(){

vec2 aD = potato.xy / a.z;
float thetaD = aD.y;

float thresholdD1 = 0.6;
float thresholdD2 = 0.7;

float x = aD.x;
float y = abs(4.0*x - 2.0);
float phiD = smoothstep(0.0, 1.0, y > 1.0 ? 2.0 - y : y);

vec4 i = vec4(
  thetaD > mix(thresholdD1, thresholdD2, phiD)
  ? vec3(float(${OPTIONS.colorR}), float(${OPTIONS.colorG}), float(${OPTIONS.colorB})) // texture2DProj(g,a).rgb * 0.25
  : texture2DProj(g,a).rgb
,f);
gl_FragColor=i;
}`;

    function installShaderSource(ctx) {
        const g = ctx.shaderSource;
        function shaderSource() {
            if (typeof arguments[1] === 'string') {
                let glsl = arguments[1];
                console.log('BINTULU shader', glsl);
                if (glsl === vertexOld) glsl = vertexNew;
                else if (glsl === fragOld) glsl = fragNew;
                return g.call(this, arguments[0], glsl);
            }
            return g.apply(this, arguments);
        }
        shaderSource.bestcity = 'bintulu';
        ctx.shaderSource = shaderSource;
    }
    function installGetContext(el) {
        const g = el.getContext;
        el.getContext = function() {
            if (arguments[0] === 'webgl' || arguments[0] === 'webgl2') {
                const ctx = g.apply(this, arguments);
                if (ctx && ctx.shaderSource && ctx.shaderSource.bestcity !== 'bintulu') {
                    installShaderSource(ctx);
                }
                return ctx;
            }
            return g.apply(this, arguments);
        };
    }
    const f = document.createElement;
    document.createElement = function() {
        if (arguments[0] === 'canvas' || arguments[0] === 'CANVAS') {
            const el = f.apply(this, arguments);
            installGetContext(el);
            return el;
        }
        return f.apply(this, arguments);
    };
    function addCompassStyle() {
        let style = document.createElement('style');
        style.id = 'bintulu_nocompass';
        style.innerHTML = '.compass { display: none } .gm-compass { display: none }';
        document.head.appendChild(style);
    }
    addCompassStyle();
    document.addEventListener('keydown', (evt) => {
      if (!evt.repeat && evt.code === 'KeyK' && evt.shiftKey && !evt.altKey && !evt.ctrlKey && !evt.metaKey) {
          let style = document.getElementById('bintulu_nocompass');
          if (!style) {
              addCompassStyle();
          } else {
              style.remove();
          }
      }
   });
}

  unsafeWindow.eval(`(${injected.toString()})()`);

})();