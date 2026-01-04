// ==UserScript==
// @name         picrew tweaker
// @namespace    https://github.com/adrianmgg
// @version      1.2.1
// @description  force-enables various picrew features
// @author       amgg
// @match        https://picrew.me/image_maker/*
// @match        https://picrew.me/*/image_maker/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=picrew.me
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/454723/picrew%20tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/454723/picrew%20tweaker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // not all userscript managers have unsafeWindow
    const _unsafeWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Sharing_objects_with_page_scripts#sharing_content_script_objects_with_page_scripts
    // necessary on greasemonkey to avoid errors when the page calls our wrapped functions
    const _exportFunctionToUnsafeWindow = typeof exportFunction !== 'undefined' ?
        (func) => exportFunction(func, _unsafeWindow) :
        (func) => func;
    const _cloneIntoUnsafeWindow = typeof cloneInto !== 'undefined' ?
        (obj) => cloneInto(obj, _unsafeWindow) :
        (obj) => obj;
    const _cloneIntoUnsafeWindowWithFunctions = typeof cloneInto !== 'undefined' ?
        (obj) => cloneInto(obj, _unsafeWindow, {cloneFunctions: true}) :
        (obj) => obj;

    // can't seem to get this part working with cloneInto/exportFunction yet so i guess i'll just eval it
    _unsafeWindow.eval(`
(() => {
const window__Image = window.Image;
window.Image = class ImageWrapper extends window__Image {
    constructor(...args) {
        super(...args);
    }
    set src(v) {
        if(typeof v === 'string' && v.endsWith('?INTERCEPT_SCALE_X2')) {
            this.loadX2version(v).then(src => { super.src = src; });
        } else {
            super.src = v;
        }
        return super.src;
    }
    get src() {
        return super.src;
    }
    loadX2version(x1url) {
        return new Promise((resolve) => {
            const origImg = new window__Image(x1url);
            origImg.crossOrigin = 'anonymous';
            origImg.addEventListener('load', () => {
                const canvas = document.createElement('canvas');
                canvas.width = origImg.naturalWidth * 2;
                canvas.height = origImg.naturalHeight * 2;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(origImg, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/png'));
            });
            origImg.src = x1url;
        });
    }
};
})();
    `);


    // apply our modifications to the parts list
    const patchNuxt = _exportFunctionToUnsafeWindow(function patchNuxt(nuxt) {
        try {
            // enable randomizing
            nuxt.state.imageMakerInfo.can_randomize = 1;
            nuxt.state.imageMakerInfo.can_fixed_randomize = 1;
            // find min/max scale levels
            let minScale = 0, maxScale = 0;
            for(let i = 0; i in nuxt.state.scales; i++) { maxScale = i; }
            for(let i = 0; i in nuxt.state.scales; i--) { minScale = i; }
            // inject new scale levels & update min/max to match
            {
                const lowestScaleLevel = parseFloat(nuxt.state.scales[minScale]);
                const secondLowestScaleLevel = parseFloat(nuxt.state.scales[minScale + 1]);
                const lowScaleDelta = secondLowestScaleLevel - lowestScaleLevel;
                for(let i = minScale - 1, f = lowestScaleLevel - lowScaleDelta; f > 0; i--, f -= lowScaleDelta) {
                    nuxt.state.scales[i] = f.toString();
                    minScale = i;
                }
                const highestScaleLevel = parseFloat(nuxt.state.scales[maxScale]);
                const secondHighestScaleLevel = parseFloat(nuxt.state.scales[maxScale - 1]);
                const highScaleDelta = highestScaleLevel - secondHighestScaleLevel;
                const newMaxScaleTarget = highestScaleLevel * 2;
                for(let i = maxScale + 1, f = highestScaleLevel + highScaleDelta; f < newMaxScaleTarget; i++, f += highScaleDelta) {
                    nuxt.state.scales[i] = f.toString();
                    maxScale = i;
                }
            }
            // add fake x2 urls which we later intercept in the Image() wrapper
            for(const k1 in nuxt.state.commonImages) {
                for(const k2 in nuxt.state.commonImages[k1]) {
                    for(const k3 in nuxt.state.commonImages[k1][k2]) {
                        const cimg = nuxt.state.commonImages[k1][k2][k3];
                        if(!('x2Url' in cimg)) {
                            cimg.x2Url = cimg.url + '?INTERCEPT_SCALE_X2';
                        }
                    }
                }
            }
            // patch part list
            nuxt.state.config.pList.forEach(p=>{
                // i think various *Cnt attrs have max of 99 via editor? maybe
                // enable move button
                p.canMv = 1;
                // x axis move
                p.isMX = 1; // enable x axis movement
                p.ticX = p.ticX ?? 2; // needs to have a step size
                p.lCnt = Infinity; // left steps
                p.rCnt = Infinity; // right steps
                // y axis move
                p.isMY = 1; // enable y axis movement
                p.ticY = p.ticY ?? 2; // needs to have a step size
                p.upCnt = Infinity; // up steps
                p.dwnCnt = Infinity; // down steps
                // rotation
                p.isRota = 1; // enable rotation
                p.ticRota = p.ticRota ?? 2; // needs to have a step size
                p.rotaLCnt = Infinity; // left rot steps
                p.rotaRCnt = Infinity; // right rot steps
                // resize
                p.isRsiz = 1; // enable resizing
                p.miSNo = minScale;
                p.mxSNo = maxScale;
                p.sNo ??= 0;
                // enable removing part
                p.isRmv = 1;
                // in/out can't be enabled for most parts, but we can increase the range for parts that do have it
                if('isAWSp' in p && p.isAWSp === 1) {
                    // p.ticWSp;
                    p.wSpInCnt = Infinity;
                    p.wSpOutCnt = Infinity;
                }
            });
        } catch(err) {
            console.log('error patching nuxt', err);
        }
    });

    if('__NUXT__' in _unsafeWindow) {
        console.log('patching existing __NUXT__')
        patchNuxt(_unsafeWindow.__NUXT__);
    } else {
        console.log('no __NUXT__ yet, patching via defineProperty');
        let nuxt = undefined;
        Object.defineProperty(_unsafeWindow, '__NUXT__', {
            get: _exportFunctionToUnsafeWindow(() => nuxt),
            set: _exportFunctionToUnsafeWindow((v) => {
                nuxt = v;
                patchNuxt(nuxt);
                return nuxt;
            }),
        });
    }
})();
