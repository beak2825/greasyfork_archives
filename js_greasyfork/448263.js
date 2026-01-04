// ==UserScript==
// @name Google for tiny windows
// @namespace breg
// @version 1.0
// @description Shrinks google to be more usable on small windows
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.google.com/*
// @match *://*.ogs.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/448263/Google%20for%20tiny%20windows.user.js
// @updateURL https://update.greasyfork.org/scripts/448263/Google%20for%20tiny%20windows.meta.js
// ==/UserScript==

(function() {
let css = `

/*search home*/
.ssOUyb {
    display:none
}
.gb_Vd, .gb_Xd, .Ne6nSd {
    height:40px
}
.pHiOh {
    padding:8px
}
.gb_gd { /*DEMON PFP RESIZER*/
    padding:0
}
/*search suggest*/
.pcTkSc {
    padding:0
}
.sbic.vYOkbe {
    margin-top:0;
    margin-bottom:0;
    min-width:24px;
}
.sbic {
    margin-left:-1px;
    margin-right:7px
}
.wM6W7d {
    font-size:14px
}
.ClJ9Yb {
    font-size:12px
}
.lJ9FBc input[type="submit"] {
    margin:0
}
.lJ9FBc {
    height:auto;
    padding-bottom:5px
}
/*search result ALL*/
.CvDJxb, .LHJvCe, .main {
    min-width:0
}
    /*nav*/
.fLciMb, .minidiv .fLciMb {
    margin-top:0
}
.RNNXgb, .Tg7LZd, .BKRPef {
    height:38px;
    line-height:38px
}
.YacQv.gsfi {
    display:none
}
.gLFyf.i4ySpb.gsfi {
    display:none
}
.minidiv .gLFyf.i4ySpb.gsfi, .minidiv .YacQv.gsfi {
    display:block;
    margin-top:0!important
}
.a4bIc .gLFyf.i4ySpb.gsfi {
    margin-top:-33px!important
}
.sbfc .iblpc, .emcav .iblpc {
    padding-right:6px
}
.gLFyf {
    font-size:14px;
    margin-top:-3px;
    max-height:34px
}
.srp #searchform {
    top:15px!important;
    margin-top:0
}
.sfbg {
    height:40px
}
.e9EfHf {
    padding-top:15px
}
.dodTBe {
    height:40px
}
.h3L8Ub .rLrQHf {
    display:none
}
@media (max-width:870px) {
    .RNNXgb, .A8SBwf, .sbfc .RNNXgb, .emcav .RNNXgb, .sbfc.A8SBwf, .emcav.A8SBwf {
        width:auto
    }
}
.emcav.A8SBwf.h3L8Ub, .emcav.h3L8Ub .RNNXgb {
    width:auto
}
.minidiv .sfbg {
    height:40px;
    margin-top:0!important
}
.srp #searchform.minidiv {
    top:0!important
}
.minidiv #gb {
    top:0
}
.minidiv .RNNXgb {
    margin-top:3px
}
    /*quick setting*/
.q0yked a {
    padding:2px 4px;
}
.m0uvVb, .H8eL7d .GZcH3e {
    font-size:14px
}
.q0yked {
    margin:0
}
.m0uvVb {
    padding:0 14px
}
    /*result*/
.std, .g, .iUh30, .yuRUbf, .GI74Re, .ZE0LJd, .Uroaid, .P7xzyf { /*desc*/
    font-size:12px
}
.MBeuO, .mslg .l, h3 { /*blue title*/
    font-size:16px
}
.Pj0sIb, .oieSzd, .e2BEnf, .s6JM6d .O3JH7 { /*header*/
    font-size:18px;
    line-height:20px
}
.Ww4FFb {
    margin-bottom:12px
}
.hlcw0c, .ULSxyf {
    margin-bottom:20px
}
.c9EJob td, .s6JM6d .mslg .usJj9c {
    padding:0
}
.k8XOCe { /*related bubble*/
    min-height:16px;
    height:auto;
}
.aXBZVd { /*bubble icon*/
    padding:5px
}
    /*news and vids*/
.MBeuO {
    line-height:1.5
}
.CEMjEf, .GI74Re.jBgGLd.OSrXXb {
    margin:0!important
}
@media (max-width:1121px) {
    .srp {
        --center-abs-margin: 28px;
    }
}
.gke0pe, .f6F9Be, .U1XNfe {
    min-width:0
}
.F1IdKe {
    width:calc(100%)
}
.g.dFd2Tb {
    margin-bottom:10px
}
.i5w0Le {
    display:none
}
.U1TUId, .U1TUId .YQ4gaf {
    width:89px;
    height:50px
}
.NJjxre {
    font-size:12px;
    line-height:14px;
    padding:0;
    top:10px
}
.P7xzyf {
    margin-top:0
}
.A8SBwf, .RNNXgb {
    width:auto
}
    /*image*/
.M3w8Nb .o6juZc, .KZFCbe .o6juZc, .M3w8Nb, .KZFCbe, .o6juZc, .jOYx5b {
    width:100%;
}
.FtRlBe, .tAcEof, .ndYZfc, .mJxzWe, .ymoOte .Ew9oWb {
    min-width:0;
}
.Lj9fsd {
    top:15px;
    padding:0
}
.wQnou {
    height:40px
}
.o6juZc, .rCGXm {
    height:38px
}
.BsA1cc {
    margin-top:0px
}
.Bhmw4 {
    width:calc(100% + 2px)
}
.iSZmU {
    margin-left:28px
}
        /*suggest*/
.QBbk2d {
    padding:0;
}
.s8GCU {
    min-height:0;
    height:40px
}
.og3lId {
    font-size:14px;
    height:28px
}
.sU3bKf {
    font-size:14px
}
.Lj9fsd.DU1Mzb .og3lId {
    line-height:20px;
    height:20px;
    margin-top:-1px
}
        /*collections/sf*/
.cj2HCb {
    margin:0;
    height:30px;
    margin-top:30px
}
.jklcHd {
    padding:0
}
        /*img*/
@media (max-width:900px) {
    .islrc, #islmp {
        width:auto!important;
        padding-right:0!important
    }
}
/*ogs popoits*/
[style^="overflow: hidden; position: absolute; top: 0px; width: 328px;"] {
    margin-top:30px!important;
    width:281px!important
}
[style^="overflow: hidden; position: absolute; top: 0px; width: 372px"] {
    margin-top:30px!important;
    width:300px!important
}
.d2yxTb {
    padding:0 5px
}
.j1ei8c {
    padding:0
}
.LVal7b {
    width:auto;
    padding:0;
    margin:0 auto
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
