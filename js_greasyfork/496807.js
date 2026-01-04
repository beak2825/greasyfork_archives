// ==UserScript==
// @name     TuxunNoCar
// @name:zh-CN   图寻-隐藏街景车和指南针
// @description  Redacts the car from tuxun, the Chinese geoguessr. Shift-K to toggle compass. Transplanted from GeoNoCar by 2020, drparse. Referenced kakageo's Tuxun Replayer plugin.
// @description:zh-CN 去除图寻街景车。使用Shift+K切换指南针。移植自GeoNoCar by 2020, drparse。参考了Tuxun Replayer, kakageo。
// @namespace    https://tuxun.fun/
// @version      0.1.8
// @author       strombooli
// @match        https://tuxun.fun/*
// @match        https://tuxun.fun/world-match
// @match        https://tuxun.fun/china-match
// @match        https://tuxun.fun/solo/*
// @match        https://tuxun.fun/map/*
// @match        https://tuxun.fun/party
// @match        https://tuxun.fun/party/*
// @exclude      https://tuxun.fun/challenge/*
// @exclude      https://tuxun.fun/replay-pano?*
// @exclude      https://tuxun.fun/wonders
// @exclude      https://tuxun.fun/random
// @grant    unsafeWindow
// @run-at       document-start
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/496807/TuxunNoCar.user.js
// @updateURL https://update.greasyfork.org/scripts/496807/TuxunNoCar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injected() {
    const OPTIONS = {
        colorR: 0.5,
        colorG: 0.5,
        colorB: 0.5,
        colorRS: 0,
        colorGS: 0,
        colorBS: 0,
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
    const fragNewBaidu = `precision highp float;
const float h=3.1415926;
varying vec3 a;
varying vec3 potato;
uniform vec4 b;
uniform float f;
uniform sampler2D g;
void main(){

vec2 aD = potato.xy / a.z;
float thetaD = aD.y;

float thresholdD1 = 0.61;
float thresholdD2 = 0.61;

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

            const fragNewBaiduNew = `precision highp float;
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

float thresholdD1S = 0.8;
float thresholdD2S = 0.9;

float x = aD.x;
float y = abs(4.0*x - 2.0);
float phiD = smoothstep(1.0, 0.0, y > 1.0 ? 2.0 - y : y);

vec4 i = vec4(
  thetaD > mix(thresholdD1, thresholdD2, phiD)
  ? (thetaD > mix(thresholdD1S, thresholdD2S, phiD) ? vec3(float(${OPTIONS.colorRS}), float(${OPTIONS.colorGS}), float(${OPTIONS.colorBS})) : vec3(float(${OPTIONS.colorR}), float(${OPTIONS.colorG}), float(${OPTIONS.colorB})))
  : texture2DProj(g,a).rgb
,f);
gl_FragColor=i;
}`;
    let streetViewPanorama, isBaiduP = false;
    //let tryInit = setInterval(function(){
    //    const streetViewContainer = document.getElementById('viewer');
    //    if (streetViewContainer){
    //        const keys = Object.keys(streetViewContainer);
    //        const key = keys.find(key => key.startsWith("__reactFiber"));
    //        const props = streetViewContainer[key];
    //        streetViewPanorama = props.return.child.memoizedProps.children[1].props.googleMapInstance;
    //        if (streetViewPanorama) {
    //            streetViewPanorama.addListener('position_changed', () => {
    //                // console.log(streetViewPanorama.getPano());
    //                // console.log(/^[A-Z0-9]{27}$/.test(streetViewPanorama.getPano()));
    //                if (/^[A-Z0-9]{27}$/.test(streetViewPanorama.getPano())) {
    //                    isBaiduP = true;
    //                }
    //            });
    //            clearInterval(tryInit);
    //        }
    //    }
    //}, 100);

    var _send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(value) {
        this.addEventListener('load', function() {
            if (this.responseURL && this.responseURL.includes('https://tuxun.fun/api/v0/tuxun/mapProxy/getPanoInfo?pano=') && this.responseURL.length == 84) {
                isBaiduP = true;
            }
        }, false);
        _send.call(this, value);
    };


    function installShaderSource(ctx) {
        const g = ctx.shaderSource;
        function shaderSource() {
            if (typeof arguments[1] === 'string') {
                let glsl = arguments[1];
                //console.log('BINTULU shader', glsl);

                if (glsl === vertexOld) glsl = vertexNew;
                else if (glsl === fragOld){
                    if (isBaiduP) glsl = fragNewBaiduNew;
                    else glsl = fragNew;
                }
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
        style.innerHTML = '.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom { display: none }';
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