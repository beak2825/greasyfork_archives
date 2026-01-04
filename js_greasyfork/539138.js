// ==UserScript==
// @name         Google Workspace Dark Theme - Accessible only by students right now.
// @namespace    nothing yet
// @author       Swix
// @version      0.1.1
// @description  For those looking for a cozy feel for Google Workspace.
// @match        *://workspace.google.com/*
// @grant        none
// @license      MIT; https://mit-license.org/
// @downloadURL https://update.greasyfork.org/scripts/539138/Google%20Workspace%20Dark%20Theme%20-%20Accessible%20only%20by%20students%20right%20now.user.js
// @updateURL https://update.greasyfork.org/scripts/539138/Google%20Workspace%20Dark%20Theme%20-%20Accessible%20only%20by%20students%20right%20now.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = `
.vhoiae.KkxPLb
Specificity: (0,2,0){
    --dt-on-background: #313131;
    --dt-on-background-secondary: #5e5e5e;
    --dt-background: #000000;
    --dt-on-surface: #676767;
    --dt-inverse-surface: #303030;
    --dt-on-surface-secondary: #5e5e5e;
    --dt-on-surface-variant: #444746;
    --dt-surface-variant: #e9e9e9;
    --dt-inverse-on-surface: #f2f2f2;
    --dt-surface: #ffffff;
    --dt-surface-tint: #6991d6;
    --dt-shadow-elevation-1: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    --dt-shadow-elevation-2: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    --dt-shadow-elevation-3: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
    --dt-shadow-elevation-4: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
    --dt-shadow-elevation-5: 0px 8px 10px -6px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12);
    --dt-surface-container-lowest: #fff;
    --dt-surface-container-low: #f8fafd;
    --dt-surface-container: #f0f4f9;
    --dt-surface-container-high: #e9eef6;
    --dt-surface-container-highest: #dde3ea;
    --dt-surface-dim: #d3dbe5;
    --dt-surface-bright: #fff;
    --dt-scrim: rgba(0, 0, 0, 0.32);
    --dt-scrim-2x: rgba(0, 0, 0, 0.64);
    --dt-on-primary-container: #0842a0;
    --dt-primary-container-icon: #0842a0;
    --dt-primary-container-link: #0842a0;
    --dt-primary: #0b57d0;
    --dt-primary-action: #0b57d0;
    --dt-primary-action-stateful: #0b57d0;
    --dt-primary-outline: #0b57d0;
    --dt-primary-action-state-layer: #0b57d0;
    --dt-primary-container: #d3e3fd;
    --dt-on-primary: #fff;
    --dt-primary-icon: #fff;
    --dt-primary-link: #fff;
    --dt-on-secondary-container: #004a77;
    --dt-secondary-container-icon: #004a77;
    --dt-secondary-container-link: #004a77;
    --dt-secondary: #00639b;
    --dt-secondary-action: #00639b;
    --dt-secondary-action-stateful: #00639b;
    --dt-secondary-outline: #00639b;
    --dt-secondary-action-state-layer: #00639b;
    --dt-secondary-container: #c2e7ff;
    --dt-on-secondary: #fff;
    --dt-secondary-icon: #fff;
    --dt-secondary-link: #fff;
    --dt-on-tertiary-container: #0f5223;
    --dt-tertiary-container-icon: #0f5223;
    --dt-tertiary-container-link: #0f5223;
    --dt-tertiary: #146c2e;
    --dt-tertiary-action: #146c2e;
    --dt-tertiary-action-stateful: #146c2e;
    --dt-tertiary-outline: #146c2e;
    --dt-tertiary-action-state-layer: #146c2e;
    --dt-tertiary-container: #c4eed0;
    --dt-on-tertiary: #fff;
    --dt-tertiary-icon: #fff;
    --dt-tertiary-link: #fff;
    --dt-on-neutral-container: #1f1f1f;
    --dt-neutral-container-icon: #1f1f1f;
    --dt-neutral-container-link: #1f1f1f;
    --dt-neutral: #474747;
    --dt-neutral-action: #1f1f1f;
    --dt-neutral-action-stateful: #1f1f1f;
    --dt-neutral-outline: #1f1f1f;
    --dt-neutral-action-state-layer: #1f1f1f;
    --dt-neutral-container: #e3e3e3;
    --dt-on-neutral: #fff;
    --dt-neutral-icon: #fff;
    --dt-neutral-link: #fff;
    --dt-on-warning-container: #2f1400;
    --dt-warning-container-icon: #2f1400;
    --dt-warning-container-link: #2f1400;
    --dt-warning: #ef9800;
    --dt-warning-action: #2f1400;
    --dt-warning-action-stateful: #2f1400;
    --dt-warning-outline: #2f1400;
    --dt-warning-action-state-layer: #2f1400;
    --dt-warning-container: #ffe07c;
    --dt-on-warning: #1f1f1f;
    --dt-warning-icon: #1f1f1f;
    --dt-warning-link: #1f1f1f;
    --dt-on-error-container: #410e0b;
    --dt-error-container-icon: #410e0b;
    --dt-error-container-link: #410e0b;
    --dt-error: #b3261e;
    --dt-error-action: #b3261e;
    --dt-error-action-stateful: #b3261e;
    --dt-error-outline: #b3261e;
    --dt-error-action-state-layer: #b3261e;
    --dt-error-container: #f9dedc;
    --dt-on-error: #fff;
    --dt-error-icon: #fff;
    --dt-error-link: #fff;
    --dt-mime-type-blue: #4285f4;
    --dt-mime-type-dark-blue: #4d5dba;
    --dt-mime-type-green: #34a853;
    --dt-mime-type-grey: #5f6368;
    --dt-mime-type-purple: #a142f4;
    --dt-mime-type-deep-purple: #673ab7;
    --dt-mime-type-red: #ea4335;
    --dt-mime-type-yellow: #fbbc04;
    --dt-disabled: rgba(31, 31, 31, 0.12);
    --dt-on-disabled: rgba(31, 31, 31, 0.38);
    --dt-outline: #747775;
    --dt-outline-variant: #c7c7c7;
    --dt-light-info-banner-button: #0842a0;
    --dt-light-neutral-banner-button: #474747;
    --dt-light-success-banner-button: #0f5223;
    --dt-light-warning-banner-button: #6d3a01;
    --dt-light-error-banner-button: #8c1d18;
    --dt-blue-fill: #1157ce;
    --dt-blue-outline: #d0e4ff;
    --dt-blue-tonal: #d0e4ff;
    --dt-gray-fill: #5e5e5e;
    --dt-gray-outline: #e3e3e3;
    --dt-gray-tonal: #e3e3e3;
    --dt-green-fill: #006c35;
    --dt-green-outline: #beefbb;
    --dt-green-tonal: #beefbb;
    --dt-on-blue-fill: #fff;
    --dt-on-blue-outline: #1157ce;
    --dt-on-blue-tonal: #1157ce;
    --dt-on-gray-fill: #fff;
    --dt-on-gray-outline: #5e5e5e;
    --dt-on-gray-tonal: #5e5e5e;
    --dt-on-green-fill: #fff;
    --dt-on-green-outline: #006c35;
    --dt-on-green-tonal: #006c35;
    --dt-on-orange-fill: #522302;
    --dt-on-orange-outline: #522302;
    --dt-on-orange-tonal: #522302;
    --dt-on-purple-fill: #fff;
    --dt-on-purple-outline: #7438d2;
    --dt-on-purple-tonal: #7438d2;
    --dt-on-red-fill: #fff;
    --dt-on-red-outline: #b3251e;
    --dt-on-red-tonal: #b3251e;
    --dt-on-yellow-fill: #6d3a01;
    --dt-on-yellow-outline: #6d3a01;
    --dt-on-yellow-tonal: #6d3a01;
    --dt-orange-fill: #ff8d41;
    --dt-orange-outline: #ffdcc3;
    --dt-orange-tonal: #ffdcc3;
    --dt-purple-fill: #7438d2;
    --dt-purple-outline: #eedcfe;
    --dt-purple-tonal: #eedcfe;
    --dt-red-fill: #b3251e;
    --dt-red-outline: #ffdadc;
    --dt-red-tonal: #ffdadc;
    --dt-yellow-fill: #fcbd00;
    --dt-yellow-outline: #ffe07c;
    --dt-yellow-tonal: #ffe07c;
    --gm3-sys-color-background: #fff;
    --gm3-sys-color-background-rgb: 255, 255, 255;
    --gm3-sys-color-error: #690600;
    --gm3-sys-color-error-rgb: 179, 38, 30;
    --gm3-sys-color-error-container: #f9dedc;
    --gm3-sys-color-error-container-rgb: 249, 222, 220;
    --gm3-sys-color-inverse-on-surface: #ebebeb;
    --gm3-sys-color-inverse-on-surface-rgb: 242, 242, 242;
    --gm3-sys-color-inverse-primary: #a8c7fa;
    --gm3-sys-color-inverse-primary-rgb: 168, 199, 250;
    --gm3-sys-color-inverse-surface: #303030;
    --gm3-sys-color-inverse-surface-rgb: 48, 48, 48;
    --gm3-sys-color-on-background: #1f1f1f;
    --gm3-sys-color-on-background-rgb: 31, 31, 31;
    --gm3-sys-color-on-error: #ede7e7;
    --gm3-sys-color-on-error-rgb: 255, 255, 255;
    --gm3-sys-color-on-error-container: #410e0b;
    --gm3-sys-color-on-error-container-rgb: 65, 14, 11;
    --gm3-sys-color-on-primary: #fff;
    --gm3-sys-color-on-primary-rgb: 255, 255, 255;
    --gm3-sys-color-on-primary-container: #041e49;
    --gm3-sys-color-on-primary-container-rgb: 4, 30, 73;
    --gm3-sys-color-on-primary-fixed: #041e49;
    --gm3-sys-color-on-primary-fixed-rgb: 4, 30, 73;
    --gm3-sys-color-on-primary-fixed-variant: #0842a0;
    --gm3-sys-color-on-primary-fixed-variant-rgb: 8, 66, 160;
    --gm3-sys-color-on-secondary: #fff;
    --gm3-sys-color-on-secondary-rgb: 255, 255, 255;
    --gm3-sys-color-on-secondary-container: #001d35;
    --gm3-sys-color-on-secondary-container-rgb: 0, 29, 53;
    --gm3-sys-color-on-secondary-fixed: #001d35;
    --gm3-sys-color-on-secondary-fixed-rgb: 0, 29, 53;
    --gm3-sys-color-on-secondary-fixed-variant: #004a77;
    --gm3-sys-color-on-secondary-fixed-variant-rgb: 0, 74, 119;
    --gm3-sys-color-on-surface: #1f1f1f;
    --gm3-sys-color-on-surface-rgb: 31, 31, 31;
    --gm3-sys-color-on-surface-variant: #444746;
    --gm3-sys-color-on-surface-variant-rgb: 68, 71, 70;
    --gm3-sys-color-on-tertiary: #fff;
    --gm3-sys-color-on-tertiary-rgb: 255, 255, 255;
    --gm3-sys-color-on-tertiary-container: #072711;
    --gm3-sys-color-on-tertiary-container-rgb: 7, 39, 17;
    --gm3-sys-color-on-tertiary-fixed: #072711;
    --gm3-sys-color-on-tertiary-fixed-rgb: 7, 39, 17;
    --gm3-sys-color-on-tertiary-fixed-variant: #0f5223;
    --gm3-sys-color-on-tertiary-fixed-variant-rgb: 15, 82, 35;
    --gm3-sys-color-outline: #747775;
    --gm3-sys-color-outline-rgb: 116, 119, 117;
    --gm3-sys-color-outline-variant: #c4c7c5;
    --gm3-sys-color-outline-variant-rgb: 196, 199, 197;
    --gm3-sys-color-primary: #0b57d0;
    --gm3-sys-color-primary-rgb: 11, 87, 208;
    --gm3-sys-color-primary-container: #d3e3fd;
    --gm3-sys-color-primary-container-rgb: 211, 227, 253;
    --gm3-sys-color-primary-fixed: #d3e3fd;
    --gm3-sys-color-primary-fixed-rgb: 211, 227, 253;
    --gm3-sys-color-primary-fixed-dim: #a8c7fa;
    --gm3-sys-color-primary-fixed-dim-rgb: 168, 199, 250;
    --gm3-sys-color-scrim: #000;
    --gm3-sys-color-scrim-rgb: 0, 0, 0;
    --gm3-sys-color-secondary: #00639b;
    --gm3-sys-color-secondary-rgb: 0, 99, 155;
    --gm3-sys-color-secondary-container: #c2e7ff;
    --gm3-sys-color-secondary-container-rgb: 194, 231, 255;
    --gm3-sys-color-secondary-fixed: #c2e7ff;
    --gm3-sys-color-secondary-fixed-rgb: 194, 231, 255;
    --gm3-sys-color-secondary-fixed-dim: #7fcfff;
    --gm3-sys-color-secondary-fixed-dim-rgb: 127, 207, 255;
    --gm3-sys-color-shadow: #000;
    --gm3-sys-color-shadow-rgb: 0, 0, 0;
    --gm3-sys-color-surface: #fff;
    --gm3-sys-color-surface-rgb: 255, 255, 255;
    --gm3-sys-color-surface-bright: #fff;
    --gm3-sys-color-surface-bright-rgb: 255, 255, 255;
    --gm3-sys-color-surface-container: #f0f4f9;
    --gm3-sys-color-surface-container-rgb: 240, 244, 249;
    --gm3-sys-color-surface-container-high: #e9eef6;
    --gm3-sys-color-surface-container-high-rgb: 233, 238, 246;
    --gm3-sys-color-surface-container-highest: #dde3ea;
    --gm3-sys-color-surface-container-highest-rgb: 221, 227, 234;
    --gm3-sys-color-surface-container-low: #f8fafd;
    --gm3-sys-color-surface-container-low-rgb: 248, 250, 253;
    --gm3-sys-color-surface-container-lowest: #fff;
    --gm3-sys-color-surface-container-lowest-rgb: 255, 255, 255;
    --gm3-sys-color-surface-dim: #d3dbe5;
    --gm3-sys-color-surface-dim-rgb: 211, 219, 229;
    --gm3-sys-color-surface-tint: #6991d6;
    --gm3-sys-color-surface-tint-rgb: 105, 145, 214;
    --gm3-sys-color-surface-variant: #e1e3e1;
    --gm3-sys-color-surface-variant-rgb: 225, 227, 225;
    --gm3-sys-color-tertiary: #146c2e;
    --gm3-sys-color-tertiary-rgb: 20, 108, 46;
    --gm3-sys-color-tertiary-container: #c4eed0;
    --gm3-sys-color-tertiary-container-rgb: 196, 238, 208;
    --gm3-sys-color-tertiary-fixed: #c4eed0;
    --gm3-sys-color-tertiary-fixed-rgb: 196, 238, 208;
    --gm3-sys-color-tertiary-fixed-dim: #6dd58c;
    --gm3-sys-color-tertiary-fixed-dim-rgb: 109, 213, 140;
}
.Dsuz9e.MELUue {
    color: white;
    padding: .5rem .5rem .75rem;
}
.XzbSje {
    border: solid 1px transparent;
    border-radius: var(--dt-corner-banner, .25rem);
    box-sizing: border-box;
    background: #2d2d2d;
    color: var(--dt-on-background, rgb(60, 64, 67));
    display: -webkit-box;
    display: -webkit-flex;
    display: flex
;
    padding-bottom: .6875rem;
    padding-left: .9375rem;
    padding-right: .4375rem;
    padding-top: .6875rem;
    -webkit-transition: height .25s cubic-bezier(0,0,.2,1), margin .25s cubic-bezier(0,0,.2,1);
    transition: height .25s cubic-bezier(0,0,.2,1), margin .25s cubic-bezier(0,0,.2,1);
    -webkit-user-select: text;
    user-select: text;
}
.WxatGc {
    color: #9b9b9b;
    text-align: center;
    text-decoration: none;
}
.JQga7 {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background-color: #232323;
    border-radius: 50%;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex
;
    height: 72px;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    margin: 6px auto;
    width: 72px;
}
.gb_Fa .gb_md.gb_nd.gb_Id {
    background: #474747;
    min-width: 0;
}
.gb_ad.gb_bd {
    color: #ffffff;
}
.qdOxv-fmcmS-yrriRe-OWXEXe-INsAgc:not(.qdOxv-fmcmS-yrriRe-OWXEXe-OWB6Me) {
    -webkit-text-fill-color: white;
    background: black;
    --gm3-notched-outline-border-color
#4b4b4b
: #4b4b4b;
}
.uNGfIf {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    color: #a7a7a7;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex
;
    font-weight: 700;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    margin: 30px auto 0;
    text-align: center;
}
.DKA9eb {
    font-family: "Google Sans Text";
    font-size: .875rem;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 1.25rem;
    color: #04ff00;
    font-weight: 700;
}
.iEGE0e {
    background-color: #000000;
    box-sizing: border-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    margin-top: 24px;
    min-height: 100vh;
    padding-top: 64px;
    width: 100%;
}`;
    var elem = document.createElement('style');
    elem.innerText = style;
    document.head.appendChild(elem);
})();


