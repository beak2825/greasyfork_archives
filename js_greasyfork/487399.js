// ==UserScript==
// @name         Google Classroom Dark Mode
// @version      0.0.5
// @description  Dark mode for Google Classroom, is a modified version of https://greasyfork.org/scripts/395319-google-classroom-dark-mode-theme
// @author       dfawx31
// @match        *://classroom.google.com/*
// @license      MIT
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/487399/Google%20Classroom%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/487399/Google%20Classroom%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = `
body {
    background: #2c2c2c;
    color: #fff;
}

.Tabkde .OX4Vcb {
    background-color: #3c3c3c;
}

.rpo4wf-J3yWx {
    color: #fff;
}

.z3vRcc-J3yWx {
    color: #fff;
}

.xSP5ic:not([disabled]), .xSP5ic:not([disabled]).yHy1rc {
    color: #fff;
}

.mwJvDe .KEDCCd {
    color: #3c3c3c;
}

.ee1HBc .LgeCif.LgeCif:disabled {
    color: #fff;
}

.z80M1 {
    color: #fff;
}

.z80M1.FwR7Pc {
    background-color: #4d4d4d;
}

.mwJvDe .KEDCCd {
    background-color: #3c3c3c;
}

.xVPuB .Aworge, .vnnr5e .Aworge {
    color: #fff;
}

.xVPuB .snByac, .vnnr5e .snByac {
    color: #fff;
}

.xWw7yd:hover .asQXV {
    color: black;
}

.xWw7yd:hover .IMvYId {
    color: #444;
}

.gb_Pa svg, .gb_Tc svg, .gb_fd .gb_od, .gb_5c .gb_od {
    color: #fff;
}

.ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me).VfPpkd-O1htCb-OWXEXe-XpnDCe .VfPpkd-t08AT-Bz112c {
    color: #fff;
}

.ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me) .VfPpkd-uusGie-fmcmS {
    color: #fff;
}

.VfPpkd-xl07Ob .VfPpkd-StrnGf-rymPhb, .VfPpkd-xl07Ob .VfPpkd-rymPhb {
    background-color: #3c3c3c;
}

.s8kOBc .VfPpkd-rymPhb-fpDzbe-fmcmS {
    color: #fff;
}

.s8kOBc .VfPpkd-rymPhb-ibnC6b-OWXEXe-gk6SMd .VfPpkd-rymPhb-fpDzbe-fmcmS, .s8kOBc .VfPpkd-rymPhb-ibnC6b-OWXEXe-pXU01b .VfPpkd-rymPhb-fpDzbe-fmcmS, .s8kOBc .VfPpkd-rymPhb-ibnC6b-OWXEXe-gk6SMd.VfPpkd-rymPhb-ibnC6b-OWXEXe-SfQLQb-M1Soyc-Bz112c .VfPpkd-rymPhb-KkROqb, .s8kOBc .VfPpkd-rymPhb-ibnC6b-OWXEXe-pXU01b.VfPpkd-rymPhb-ibnC6b-OWXEXe-SfQLQb-M1Soyc-Bz112c .VfPpkd-rymPhb-KkROqb {
    color: #fff;
}

.s8kOBc .VfPpkd-rymPhb-ibnC6b.VfPpkd-rymPhb-ibnC6b-OWXEXe-gk6SMd {
    background-color: #4d4d4d;
}

.ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me) .VfPpkd-uusGie-fmcmS {
    color: #fff;
}

.ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me).VfPpkd-O1htCb-OWXEXe-XpnDCe .VfPpkd-t08AT-Bz112c {
    color: #fff;
}

.ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me):not(.VfPpkd-O1htCb-OWXEXe-XpnDCe) .VfPpkd-TkwUic:hover .VfPpkd-NSFCdd-i5vt6e .VfPpkd-NSFCdd-Brv4Fb, .ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me):not(.VfPpkd-O1htCb-OWXEXe-XpnDCe) .VfPpkd-TkwUic:hover .VfPpkd-NSFCdd-i5vt6e .VfPpkd-NSFCdd-Ra9xwd, .ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me):not(.VfPpkd-O1htCb-OWXEXe-XpnDCe) .VfPpkd-TkwUic:hover .VfPpkd-NSFCdd-i5vt6e .VfPpkd-NSFCdd-MpmGFe {
    border-color: rgb(26,115,232);
}

.EHzcec {
    background: var(--gm3-sys-color-surface-container-high,#3c3c3c);
}

.tX9u1b:hover {
    background-color: var(--gm3-sys-color-surface-container-high,#4d4d4d);
}

.Rq5Gcb {
    color: #fff;
}

.NQV3m:active, .NQV3m:active:focus {
    border-color: var(--gm3-sys-color-outline,#5e5e5e);
}

.NQV3m:active, .NQV3m:active:focus {
    background-color: #5e5e5e;
    color: #c3c3c3;
}

.gb_d[aria-expanded="true"] .gb_h {
    fill: #fff;
}

.Eajscb .vT1Gyc.N4XV7d {
    color: #fff;
}

.UvHKof .FL3Khc:not(:disabled) {
    color: #fff;
}

.UvHKof .n42Gr:not(:disabled):hover, .UvHKof .n42Gr:not(:disabled) {
    color: #fff;
}

.jDlKLb {
    color: #fff;
}

.A6dC2c-J3yWx, .Hwv4mb .OGhwGf:focus .Pce5Kb, .Hwv4mb .OGhwGf:hover .Pce5Kb {
    color: #fff;
}

.UvHKof .FL3Khc:not(:disabled):hover {
    color: rgb(255, 111, 111);
}

.Erb9le:not(.RDPZE) .qmMNRc:hover, .Erb9le:not(.RDPZE) .qmMNRc.y7OZL {
    color: rgba(255, 255, 255, 0.59);
}

.Erb9le:not(.RDPZE) .qmMNRc.y7OZL {
    background-color: #ffffff36;
}

.ee1HBc .Iwp0Ue:not(.xp2dJ):not(.rZXyy):hover.rXdid, .ee1HBc .Iwp0Ue:not(.xp2dJ):not(.rZXyy):hover.h7Ww0, .ee1HBc .Iwp0Ue:not(.xp2dJ):not(.rZXyy):hover .rXdid, .ee1HBc .Iwp0Ue:not(.xp2dJ):not(.rZXyy):hover .h7Ww0, .ee1HBc .xWw7yd:hover.rXdid, .ee1HBc .xWw7yd:hover.h7Ww0, .ee1HBc .xWw7yd:hover .rXdid, .ee1HBc .xWw7yd:hover .h7Ww0 {
    background-color: #000;
}

.ee1HBc .Iwp0Ue:not(.xp2dJ):focus-within.JiTjnd, .ee1HBc .Iwp0Ue:not(.xp2dJ):focus-within.h7Ww0, .ee1HBc .Iwp0Ue:not(.xp2dJ) :focus-within.JiTjnd, .ee1HBc .Iwp0Ue:not(.xp2dJ) :focus-within.h7Ww0, .ee1HBc .xWw7yd:focus-within.JiTjnd, .ee1HBc .xWw7yd:focus-within.h7Ww0, .ee1HBc .xWw7yd :focus-within.JiTjnd, .ee1HBc .xWw7yd :focus-within.h7Ww0 {
    background-color: #000;
}

/* help btn */
.K2mXPb {
    color: #fff;
    fill: #fff;
}

/* links */
a {
    color: dodgerblue;
}
a:visited {
    color: mediumorchid;
}

/* top bar */
.joJglb {
    background: #3c3c3c;
    border-bottom: none;
}
.joJglb, .joJglb.kLHn3 {
    box-shadow: 0px 0px 6px 4px rgba(28, 28, 28, .4);
}

/* google apps */
.gb_qa svg, .gb_C[aria-expanded="true"] .gb_Ve {
    fill: #fff;
}

/* icons */
.IqJTee, .ViCi4, .xSP5ic, .cjq2Db {
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
}
.dDKhVc, .iLjzDc {
    color: #afafaf;
}
.kCtYwe {
    border-color: #4c4c4c !important;
}
.ETRkCe {
    background-color: #3c3c3c !important;
}
.DShyMc-AaTFfe .Xi8cpb.qs41qe .LlcfK, .bFjUmb-Ysl7Fe, .VUoKZ {
    background-color: #4c4c4c !important;
}
.Xi8cpb:hover .LlcfK {
    background-color: rgba(76, 76, 76, .5) !important;
}

/* calendar */
.Evt7cb, .Evt7cb:visited, .fKz7Od .TpQm9d {
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
.Xp0OCe, .ncFHed {
    background-color: #3c3c3c !important;
}
.Xp0OCe {
    border: none !important;
}
.HZ3kWc, .WOPwXe, .gJk24c, .asQXV-FGzYL {
    color: #fff;
}
.MHxtic:not(:last-child), .LKqFXc {
    border-color: #4c4c4c !important;
}
.MHxtic:hover {
    box-shadow: none !important;
    background-color: #4c4c4c;
}

/* class page */
.d4Fe0d {
    background-color: #3c3c3c !important;
    border-color: #4c4c4c !important;
}
.EZrbnd, .A6dC2c, .O98Lj, .rpo4wf, .tLDEHd, .cSyPgb, .wZTANe .J1raN:hover, .udxSmc, .lziZub, .lziZub:visited {
    color: #fff !important;
}
.sdDCme, .K6Ovqd, .T8rTjd, .Lzdwhd-BrZSOd, .onkcGd, .onkcGd:visited, .wZTANe .J1raN {
    color: #ccc;
}
.VnOHwf-Tvm9db, .BEAGS:not(.RDPZE), .VnOHwf-Wvd9Cc, .CJXzee a:active,
.CJXzee a:focus, .CJXzee a:hover, .sdDCme, .K6Ovqd, .vnnr5e .snByac,
.vnnr5e .Aworge, .XpxsVb .Aworge, .UQuaGc, .wCDkmf, .ksaOtd {
    color: #fff !important;
}
.MymH0d:hover .VBEdtc-Wvd9Cc, .l3F1ye:not(.RDPZE), .IMvYId, .IMvYId:visited, .nRLOzd:hover, .nRLOzd:hover *, .O98Lj, .Lzdwhd-BrZSOd {
    color: #ccc !important;
}
.GWZ7yf, .hgjBDc, .vnnr5e .CIy9F, .qk0lee:focus::after {
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
.OZ6W0d:not(.RDPZE), .l3F1ye:not(.RDPZE) .TpQm9d, .wwnMtb:not(.RDPZE) {
    fill: #fff !important;
    color: #fff !important;
}
.ZoT1D:hover.idtp4e, .tUJKGd:not(.xp2dJ):not(.rZXyy):hover .idtp4e, .tUJKGd:not(.xp2dJ).ndcsBf .idtp4e, .V8apv, .P3W0Dd-Ysl7Fe:focus {
    background-color: #4c4c4c !important;
}
.Niache, .QTD2uf {
    border-color: #3c3c3c !important;
}
.UISY8d-Ysl7Fe:hover {
    background-color: #3c3c3c !important;
    color: #ccc;
}
.eumXzf:after {
    border-color: #fff !important;
}
.tUJKGd:not(:first-child), .ySjuvd .eqqrO, .s2g3Xd, .oleV8d, .ZNE4y, .PeGHgb.Q8U8uc .Ono85c+.oh9CFb, .O9YpHb, .u73Apc, .d6CWTd {
    border-color: #4c4c4c !important;
}
.lXuxY {
    -webkit-box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75);
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75)
}
.BEAGS, .P02DYb, .ycbm1d {
    border-color: #4c4c4c !important;
}
.Y5sE8d:not(.RDPZE) {
    background-color: #2c2c2c !important;
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

/* dialog */
.iph-dialog {
    background-color: #4c4c4c !important;
}
.iph-dialog-title, .iph-dialog-content {
    color: #fff !important;
}

/* join classroom */
.gKkZCe, .D3oBEe .n9IS1:before, .AeAAkf {
    border-color: #4c4c4c;
}
.D3oBEe .qTs5Xc {
    background-color: #3c3c3c;
}
.qTs5Xc, .poFWNe {
    color: #fff;
}
.I7OXgf.ZEeHrd, .NZ9wdc, .i5sehe, .kox42c {
    background-color: #2c2c2c !important;
}`;
    var elem = document.createElement('style');
    elem.innerText = style;
    document.head.appendChild(elem);
})();