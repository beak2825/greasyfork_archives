// ==UserScript==
// @name         Manga Image Enhancement
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Make Manga Image Better
// @author       You
// @include        /https?\:\/\/(\w+\.)*manga1001\.com\/.*/
// @include        /https?\:\/\/(\w+\.)*manhuagui\.com\/comic\/\d+\/\d+.*/
// @include        /https?\:\/\/(\w+\.)*huhudm\.com\/.*/
// @icon         https://image.flaticon.com/icons/png/128/2881/2881629.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428397/Manga%20Image%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/428397/Manga%20Image%20Enhancement.meta.js
// ==/UserScript==

(function $$() {
    'use strict';

    if(!document||!document.documentElement)return window.requestAnimationFrame($$);


        function makeFilter(arr, k) {
            let res = ""
            for (const e of arr) {
                for (const d of e) {
                    res += " " + (1.0 * d * k).toFixed(9)
                }
            }
            return res.trim()
        }

function addStyle (styleText) {
  const styleNode = document.createElement('style');
  styleNode.type = 'text/css';
  styleNode.textContent = styleText;
  document.documentElement.appendChild(styleNode);
  return styleNode;
}

    function addSVG(rootView){

                let svgFilterElm = document.createElement('section')
                svgFilterElm.style.position = 'fixed';
                svgFilterElm.style.left = '-999px';
                svgFilterElm.style.width = '1px';
                svgFilterElm.style.top = '-999px';
                svgFilterElm.style.height = '1px';
                svgFilterElm.id = '_h5player_section_'
                let svgXML = `
                <svg id='_h5p_image' version="1.1" xmlns="http://www.w3.org/2000/svg">
                <defs>
                <filter id="_h5p_sharpen1">
                <feConvolveMatrix filterRes="100 100" style="color-interpolation-filters:sRGB" order="3" kernelMatrix="` + `
                -0.3 -0.3 -0.3
                -0.3 3.4 -0.3
                -0.3 -0.3 -0.3`.replace(/[\n\r]+/g, '  ').trim() + `"  preserveAlpha="true"/>
                </filter>
                <filter id="_h5p_unsharpen1">
                <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="5" kernelMatrix="` +
                    makeFilter([
                        [1, 4, 6, 4, 1],
                        [4, 16, 24, 16, 4],
                        [6, 24, -476, 24, 6],
                        [4, 16, 24, 16, 4],
                        [1, 4, 6, 4, 1]
                    ], -1 / 256) + `"  preserveAlpha="false"/>
                </filter>
                <filter id="_h5p_unsharpen3_05">
                <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="3" kernelMatrix="` +
                    makeFilter(
                        [
                            [0.025, 0.05, 0.025],
                            [0.05, -1.1, 0.05],
                            [0.025, 0.05, 0.025]
                        ], -1 / .8) + `"  preserveAlpha="false"/>
                </filter>
                <filter id="_h5p_unsharpen3_10">
                <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="3" kernelMatrix="` +
                    makeFilter(
                        [
                            [0.05, 0.1, 0.05],
                            [0.1, -1.4, 0.1],
                            [0.05, 0.1, 0.05]
                        ], -1 / .8) + `"  preserveAlpha="false"/>
                </filter>
                <filter id="_h5p_unsharpen5_05">
                <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="5" kernelMatrix="` +
                    makeFilter(
                        [
                            [0.025, 0.1, 0.15, 0.1, 0.025],
                            [0.1, 0.4, 0.6, 0.4, 0.1],
                            [0.15, 0.6, -18.3, 0.6, 0.15],
                            [0.1, 0.4, 0.6, 0.4, 0.1],
                            [0.025, 0.1, 0.15, 0.1, 0.025]
                        ], -1 / 12.8) + `"  preserveAlpha="false"/>
                </filter>
                <filter id="_h5p_unsharpen5_10">
                <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="5" kernelMatrix="` +
                    makeFilter(
                        [
                            [0.05, 0.2, 0.3, 0.2, 0.05],
                            [0.2, 0.8, 1.2, 0.8, 0.2],
                            [0.3, 1.2, -23.8, 1.2, 0.3],
                            [0.2, 0.8, 1.2, 0.8, 0.2],
                            [0.05, 0.2, 0.3, 0.2, 0.05]
                        ], -1 / 12.8) + `"  preserveAlpha="false"/>
                </filter>
                <filter id="_h5p_unsharpen9_05">
                <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="9" kernelMatrix="` +
                    makeFilter(
                        [
                            [0.025, 0.2, 0.7, 1.4, 1.75, 1.4, 0.7, 0.2, 0.025],
                            [0.2, 1.6, 5.6, 11.2, 14, 11.2, 5.6, 1.6, 0.2],
                            [0.7, 5.6, 19.6, 39.2, 49, 39.2, 19.6, 5.6, 0.7],
                            [1.4, 11.2, 39.2, 78.4, 98, 78.4, 39.2, 11.2, 1.4],
                            [1.75, 14, 49, 98, -4792.7, 98, 49, 14, 1.75],
                            [1.4, 11.2, 39.2, 78.4, 98, 78.4, 39.2, 11.2, 1.4],
                            [0.7, 5.6, 19.6, 39.2, 49, 39.2, 19.6, 5.6, 0.7],
                            [0.2, 1.6, 5.6, 11.2, 14, 11.2, 5.6, 1.6, 0.2],
                            [0.025, 0.2, 0.7, 1.4, 1.75, 1.4, 0.7, 0.2, 0.025]
                        ], -1 / 3276.8) + `"  preserveAlpha="false"/>
                </filter>
                <filter id="_h5p_unsharpen9_10">
                <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="9" kernelMatrix="` +
                    makeFilter(
                        [
                            [0.05, 0.4, 1.4, 2.8, 3.5, 2.8, 1.4, 0.4, 0.05],
                            [0.4, 3.2, 11.2, 22.4, 28, 22.4, 11.2, 3.2, 0.4],
                            [1.4, 11.2, 39.2, 78.4, 98, 78.4, 39.2, 11.2, 1.4],
                            [2.8, 22.4, 78.4, 156.8, 196, 156.8, 78.4, 22.4, 2.8],
                            [3.5, 28, 98, 196, -6308.6, 196, 98, 28, 3.5],
                            [2.8, 22.4, 78.4, 156.8, 196, 156.8, 78.4, 22.4, 2.8],
                            [1.4, 11.2, 39.2, 78.4, 98, 78.4, 39.2, 11.2, 1.4],
                            [0.4, 3.2, 11.2, 22.4, 28, 22.4, 11.2, 3.2, 0.4],
                            [0.05, 0.4, 1.4, 2.8, 3.5, 2.8, 1.4, 0.4, 0.05]
                        ], -1 / 3276.8) + `"  preserveAlpha="false"/>
                    </filter>
                    <filter id="_h5p_grey1">
                    <feColorMatrix values="0.3333 0.3333 0.3333 0 0
                    0.3333 0.3333 0.3333 0 0
                    0.3333 0.3333 0.3333 0 0
                    0      0      0      1 0"/>
                    <feColorMatrix type="saturate" values="0" />
                    </filter>
                    </defs>
                    </svg>
                    `;

                svgFilterElm.innerHTML = svgXML.replace(/[\r\n\s]+/g, ' ').trim();

                rootView.appendChild(svgFilterElm);

    }
    addSVG(document.documentElement)

    addStyle(`
    .wp-block-image>img[src*=".jpg"]:only-child:only-of-type, div#mangaBox>img[src*=".jpg"]:only-child:only-of-type, img[id][name][onload][src*="-comic"]:only-of-type{
    filter: contrast(50%) url(#_h5p_unsharpen3_10) contrast(120%) url(#_h5p_unsharpen3_10) brightness(120%);
    clip-path: inset(1px 1px 1px 1px);
    }
    `)

    // Your code here...
})();