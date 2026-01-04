// ==UserScript==
// @name         Dark Mode + Animations
// @version      1.2
// @description  basically dark mode with some decent animations to add to the experience?
// @author       ThaCheeseBun + sudface + onion
// @match        *://classroom.google.com/*
// @grant        none
// @license      WTFPL
// @namespace    https://greasyfork.org/users/809510
// @downloadURL https://update.greasyfork.org/scripts/477134/Dark%20Mode%20%2B%20Animations.user.js
// @updateURL https://update.greasyfork.org/scripts/477134/Dark%20Mode%20%2B%20Animations.meta.js
// ==/UserScript==

// LICENSE:
/*
               DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                   Version 2, December 2004

Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.
 */

// Requires Greasemonkey, Tampermonkey, or a similar JS-based userscript manager.

// Original Code by ThaCheeseBun: https://greasyfork.org/en/scripts/395319-google-classroom-dark-mode-theme
// Updated and made Smart by sudface: https://greasyfork.org/en/scripts/431522-google-classroom-dark-mode-theme
// Improved even more by onion

// Auto-darkmode is removed.

// Note:
// For your privacy and peace of mind, this script will _not_ auto-update

//TODO:
// Add animations to the elements (in progress)
// Fix colors
// pray that google doesnt update the ui

var style = `
body {
    background: #2c2c2c;
    color: #fff;
    overflow-x: hidden;
}

/* help btn */
.K2mXPb {
    color: #fff;
    fill: #fff;
}

/* links */
a {
    color: white;
}

a:visited {
    color: mediumorchid;
}

.Tabkde {
    background: #2c2c2c !important;
}

.S3aLQd,.n42Gr:not(:disabled), .VfPpkd-vQzf8d {
color: #fff !important;
}

.ee1HBc,.n42Gr:not(:disabled), .nZ34k:not(:disabled) {
color: #fff !important;
}

.NMm5M {
fill: #e9e9e9;
}
/* side bar animation */
.e19J0b CeoRYc:hover,
.l4V7wb Fxmcue:hover,
.NPEfkd RveJvd snByac:hover,
.Fvio9d MbhUzd:hover,
.asQXV YVvGBb:hover,
.p1KYTc:hover,
.LlcfK:hover,
.Xi8cpb:hover, .e19J0b CeoRYc:hover {
    transform: scale(1.02, 1.02) !important; /* 1.035 transform scale */
    transition: 0.07s !important;
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
    }
/* side bar animation */
.e19J0b CeoRYc,
.l4V7wb Fxmcue,
.NPEfkd RveJvd snByac,
.Fvio9d MbhUzd,
.asQXV YVvGBb,
.p1KYTc,
.LlcfK,
.Xi8cpb, .e19J0b CeoRYc {
transform: scale(1);
    transition: 0.4s !important;
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
}
/* classroom post/messages animation */
.n4xnA:hover,
.qhnNic LBlAUc Aopndd TIunU ZoT1D idtp4e DkDwHe:hover,
.Aopndd:hover,
.SFCE1b:hover,
.OlXwxf:not(.xp2dJ):hover,
.u73Apc:hover {
    transform: scale(1.004, 1.004) !important;
    transition: 0.08s !important;
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
}
/* classroom post/messages animation */
.n4xnA,
.qhnNic LBlAUc Aopndd TIunU ZoT1D idtp4e DkDwHe,
.Aopndd,
.SFCE1b,
.OlXwxf:not(.xp2dJ),
.u73Apc {
transform: scale(1);
    transition: 0.2s !important;
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
    background-color: #2a2a2a !important;
}
/*
no idea what this was for
--------------------------------------
.UvHKof,
.FL3Khc:not(:disabled),
.VfPpkd-RLmnJb,
.ee1HBc,
.FL3Khc, .IPGLSb {
transform: scale(1);
    color: #fff !important;
    transition: 0.2s !important;
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
}

.UvHKof:hover .FL3Khc:not(:disabled):hover,
.VfPpkd-RLmnJb:hover,
.FL3Khc:hover, .IPGLSb:hover {
background: red;
color: red;
    transform: scale(1.02, 1.02) !important;
    transition: 0.7s !important;
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
}*/

.OX4Vcb {
    background: #2c2c2c !important;
    border: none !important;
}

.mwJvDe .KEDCCd {
    background: #2c2c2c !important;
    box-shadow: 5px 10px 18px #2c2c2c;
    border-style: hidden hidden solid hidden;
    border-color: #000;
    border-radius: 4px;
}

.z3vRcc-J3yWx,
.rpo4wf-J3yWx,
.xSP5ic,
.xSP5ic.yHy1rc,
.xVPuB .Aworge,
.vnnr5e .Aworge {
    color: #fff !important;
}

.VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe LQeN7 eVOdue FL3Khc {
    color: #fff;
}

.q6oraf .VfPpkd-StrnGf-rymPhb,
.dDKhVc-Wvd9Cc {
    color: #fff !important;
    background: #2c2c2c !important;
}

.xSP5ic,
.xSP5ic.yHy1rc {
    fill: #fff !important;
}

/* top bar */
.joJglb {
    background: #3c3c3c;
    border-style: hidden hidden solid hidden;
    border-color: #000;
    border-radius: 4px;
}

.joJglb,
.joJglb.kLHn3 {
    box-shadow: 0px 0px 6px 4px rgba(0, 0, 0, .3); /* 28 */
}

/* google apps */
.gb_qa svg,
.gb_C[aria-expanded="true"] .gb_Ve {
    fill: #fff;
}

/* icons */
.IqJTee,
.ViCi4,
.xSP5ic,
.cjq2Db {
    color: #fff;
}

/* classroom elems */
.Aopndd {
    background: #3c3c3c;
    border-color: #5c5c5c;
}

.SZ0kZe {
    border-top: none !important;
}

.apFsO.onkcGd,
.apFsO.onkcGd:visited {
    color: #fff;
}

.oBSRLe {
    color: #fff;
}

.JPdR6b {
    background: #3c3c3c;
    box-shadow: 0px 0px 2px 1px rgba(28, 28, 28, .4);
}

/* nav menu */
.asQXV {
    color: #fff;
    border: none !important;
}

.STek2d {
border: none !important;
transition: 0.4s;
transform: scale(1);
}

.STek2d:hover {
transition: 0.4s;
transform: scale(1.005);
}

.dDKhVc,
.iLjzDc {
    color: #afafaf;
}

.kCtYwe {
    border-color: #4c4c4c !important;
}

.ETRkCe {
    background-color: #3c3c3c !important;
}

.DShyMc-AaTFfe, .Xi8cpb.qs41qe .LlcfK,
.bFjUmb-Ysl7Fe,
.VUoKZ {
    background-color: #4c4c4c !important;
}

.Xi8cpb:hover .LlcfK {
    background-color: rgba(76, 76, 76, .5) !important;
}

/* calendar */
.Evt7cb,
.Evt7cb:visited,
.fKz7Od .TpQm9d {
    color: #fff !important;
}

.BOW64 {
    border-color: #5c5c5c !important;
}

.wQuPk .JsqLM.N4XV7d {
    color: #afafaf !important;
}

.ybOdnf .OA0qNb .LMgvRb[aria-selected="true"] {
    background-color: rgba(76, 76, 76, .5) !important;
}

.ncFHed .MocG8c.KKjvXb {
    background-color: #4c4c4c !important;
}

/* todo page */
.Xp0OCe,
.ncFHed {
    background-color: #3c3c3c !important;
}

.Xp0OCe {
    border: none !important;
}

.HZ3kWc,
.WOPwXe,
.gJk24c,
.asQXV-FGzYL {
    color: #fff;
}

.MHxtic:not(:last-child),
.LKqFXc {
    border-color: #4c4c4c !important;
}

.MHxtic:hover {
    box-shadow: none !important;
    background-color: #4c4c4c;
}

/* class page */
.d4Fe0d,
.qk0lee {
    background-color: #3c3c3c !important;
    border-color: #5c5c5c !important;
}

.EZrbnd,
.A6dC2c,
.O98Lj,
.rpo4wf,
.tLDEHd,
.cSyPgb,
.wZTANe .J1raN:hover,
.udxSmc,
.lziZub,
.lziZub:visited {
    color: #fff !important;
}

.sdDCme,
.K6Ovqd,
.T8rTjd,
.Lzdwhd-BrZSOd,
.onkcGd,
.onkcGd:visited,
.wZTANe .J1raN {
    color: #ccc;
}

.VnOHwf-Tvm9db,
.BEAGS:not(.RDPZE),
.VnOHwf-Wvd9Cc,
.CJXzee a:active,
.CJXzee a:focus,
.CJXzee a:hover,
.sdDCme,
.K6Ovqd,
.vnnr5e .snByac,
.vnnr5e .Aworge,
.XpxsVb .Aworge,
.UQuaGc,
.wCDkmf,
.ksaOtd {
    color: #fff !important;
}

.MymH0d:hover .VBEdtc-Wvd9Cc,
.l3F1ye:not(.RDPZE),
.IMvYId,
.IMvYId:visited,
.nRLOzd:hover,
.nRLOzd:hover *,
.O98Lj,
.Lzdwhd-BrZSOd {
    color: #ccc !important;
}

.GWZ7yf,
.hgjBDc,
.vnnr5e .CIy9F,
.qk0lee:focus::after {
    background-color: #3c3c3c !important;
    box-shadow: none !important;
}

.vnnr5e .I9OJHe {
    background-color: #3c3c3c !important;
}

.ndcsBf.cjzpkc-Wvd9Cc {
    border-color: #5c5c5c;
}

.Y5FYJe.RDPZE {
    fill: #ccc;
    color: #ccc;
}

.OZ6W0d:not(.RDPZE),
.l3F1ye:not(.RDPZE) .TpQm9d,
.wwnMtb:not(.RDPZE) {
    fill: #fff !important;
    color: #fff !important;
}

.ZoT1D:hover.idtp4e,
.tUJKGd:not(.xp2dJ):not(.rZXyy):hover .idtp4e,
.tUJKGd:not(.xp2dJ).ndcsBf .idtp4e,
.V8apv,
.P3W0Dd-Ysl7Fe:focus {
    background-color: #4c4c4c !important;
}

.Niache,
.QTD2uf {
    border-color: #3c3c3c !important;
}

.UISY8d-Ysl7Fe:hover {
    background-color: #3c3c3c !important;
    color: #ccc;
}

.eumXzf:after {
    border-color: #fff !important;
}

.tUJKGd:not(:first-child),
.ySjuvd .eqqrO,
.s2g3Xd,
.oleV8d,
.ZNE4y,
.PeGHgb.Q8U8uc .Ono85c+.oh9CFb,
.O9YpHb,
.u73Apc,
.d6CWTd {
    border-color: #4c4c4c !important;
}

.lXuxY {
    -webkit-box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75);
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75)
}

.BEAGS,
.P02DYb,
.ycbm1d {
    border-color: #4c4c4c !important;
}

.Y5sE8d:not(.RDPZE) {
    background-color: hsl(123deg 46% 44%) !important;
}

.Y5sE8d:not(.RDPZE):hover {
    box-shadow: none !important;
}

.ksaOtd {
    color: #1e8e3e;
}

.uO32ac {
    border-color: #5c5c5c !important;
}

.uQ3ESd {
    background-color: #3c3c3c !important;
}

.apFsO.onkcGd,
.apFsO.onkcGd:visited {
    color: white !important;
}

.oBSRLe {
    color: white !important;
}

.OjOEXb {
    filter: blur(1px) brightness(0.8);
}

.PFLqgc {
    filter: blur(1px) brightness(0.8);
}

.vzcr8 {
    color: hsl(123deg 46% 59%);
}

/* dialog */
.iph-dialog {
    background-color: #4c4c4c !important;
}

.iph-dialog-title,
.iph-dialog-content {
    color: #fff !important;
}

/* join classroom */
.gKkZCe,
.D3oBEe .n9IS1:before,
.AeAAkf {
    border-color: #4c4c4c;
}

.D3oBEe .qTs5Xc {
    background-color: #3c3c3c;
}

.qTs5Xc,
.poFWNe {
    color: #fff;
}

.I7OXgf.ZEeHrd,
.NZ9wdc,
.i5sehe,
.kox42c {
    background-color: #2c2c2c !important;
}
`;

var darkelem = document.createElement('style');
darkelem.innerText = style;
darkelem.id = "darkcss";
document.head.appendChild(darkelem);