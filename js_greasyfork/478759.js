// ==UserScript==
// @name         壁紙変更スクリプト
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  このコードではquizlet.comにのみ対応しております！
// @author       Me
// @match        https://quizlet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478759/%E5%A3%81%E7%B4%99%E5%A4%89%E6%9B%B4%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/478759/%E5%A3%81%E7%B4%99%E5%A4%89%E6%9B%B4%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = `
/* css */
@import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');

/* background */
body {
   background: rgba(21,31,46,0.8) url("https://github.com/gamelist1990/gamelist1990/blob/main/%E5%A3%81%E7%B4%99/Screenshots/2.jpg?raw=true") center/100% fixed;
   background-repeat: no-repeat;
   background-size: cover;
}
/* global setting */
* {
  font-family: Caveat;
  color: #fff important;
}
* {
  border-color: rgba(21,31,46,0.8);
}
* {
  box-shadow: none important;
}

/* scrollbar */
  ::-webkit-scrollbar {
    background: transparent;
    width: 5px;
}
  ::-webkit-scrollbar-corner {
    background: transparent;
}
  ::-webkit-scrollbar-track {
  background: transparent;
}
  ::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(6,171,255,1) 5%, rgba(102,0,204,1) 97%);
  -webkit-border-radius: 1ex;
}
/* Annoucement box */
.hgjBDc {
  background: rgba(21,31,46,0.8);
}
.vnnr5e .I9OJHe, .vnnr5e .CIy9F {
  background: rgba(21,31,46,0.8);
}
.vnnr5e:not(.RDPZE):hover .I9OJHe, .vnnr5e:not(.RDPZE):hover .CIy9F {
  background: rgba(21,31,46,0.8);
}
.qk0lee:focus {
  background: rgba(21,31,46,0.8);
  color: #fff;
}
.Erb9le:not(.RDPZE) .qmMNRc:hover {
  color: #fff;
}
.rxO3db {
  background: rgba(21,31,46,0.8);
}
.e19J0b, .Y5sE8d:not(.RDPZE) {
  background: rgba(21,31,46,0.8);
}
.l4V7wb {
  color: #fff;
  background: rgba(21,31,46,0.8);
  border: 1px solid #4c4c4c;
  border-radius: 4px;
}
.T2Ybvb.KRoqRc.editable {
  font-size: 1.5rem;
}
.Erb9le:not(.RDPZE) .qmMNRc.y7OZL .DPvwYc {
  background-image: linear-gradient(to right, #06abff 5%, #6600CC 97%) important;
  -webkit-background-clip: text important;
  -webkit-text-fill-color: transparent important;
}
.Y5sE8d:not(.RDPZE) .snByac {
  font-size: 1.05rem;
  background-image: linear-gradient(to right, #06abff 5%, #6600CC 97%) important;
  -webkit-background-clip: text important;
  -webkit-text-fill-color: transparent important;
}
.Erb9le:not(.RDPZE) .qmMNRc.y7OZL {
  background: rgba(21,31,46,0.8) important;
}
.Y5sE8d:not(.RDPZE) {
  background: rgba(21,31,46,0.8) important;
}
.hVNH5c .K0NPx {
  background: rgba(21,31,46,0.8) important;
}
.FtBNWb {
  background: rgba(21,31,46,0.8) important;
}
.I7OXgf.ZEeHrd {
  background: rgba(21,31,46,0.8) important;
}
.jfvobd {
  color: #ffffff important;
}
.GWh4Ge .kx3Hed {
  color: #ffffff important;
}
/* top navbar */
.Hwv4mb, .xHPsid .hN1OOc {
  font-family: Caveat;
  font-size: 2rem;
}
.DShyMc-MTA5NzA3NjA1MzQy .eumXzf:after {
  -webkit-border-image: linear-gradient(to right, #06abff 5%, #6600CC 97%);
  border-image-slice: 9;
}
.DShyMc-MTA5NzA3NjA1MzQy .VnOHwf-Tvm9db {
  background-image: linear-gradient(to right, #06abff 5%, #6600CC 97%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.VnOHwf-Tvm9db {
  background-image: linear-gradient(to right, #06abff 5%, #6600CC 97%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.VnOHwf-Tvm9db {
  background-image: linear-gradient(to right, #06abff 5%, #6600CC 97%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.VnOHwf-Tvm9db {
  background-image: linear-gradient(to right, #06abff 5%, #6600CC 97%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.eumXzf:after {
  -webkit-border-image: linear-gradient(to right, #06abff 5%, #6600CC 97%);
  border-image-slice: 9;
}
/* loading gradient */
.DShyMc-AaTFfe .bFjUmb-Ysl7Fe.kRqvHe {
  background: linear-gradient(to right, #06abff 5%, #6600CC 97%) important;
}
.aP3ZPb.kRqvHe.bFjUmb-Ysl7Fe {
  background: linear-gradient(to right, #06abff 5%, #6600CC 97%) important;
}
.bFjUmb-Wvd9Cc:not(.O1l69):not(.J1HJOd):not(.TIunU) {
  background: linear-gradient(to right, #06abff 5%, #6600CC 97%) important;
}
.aP3ZPb {
  background: linear-gradient(to right, #06abff 5%, #6600CC 97%) important;
}

/* join/create class */
.D3oBEe .qTs5Xc, .fyExH {
  background: none;
}
[aria-checked="true"]>.rq8Mwb, [aria-checked="mixed"]>.rq8Mwb {
  background: #ffffffc4;
  border-radius: 5px;
}

/* font fix */
/* material post dates */
.tmMkWb {
  font-family: Caveat;
  font-size: 1.4em;
}
/* class details */
.uTUgB, .csjh4b {
  font-family: Caveat;
}
.csjh4b {
  font-size: 1.78rem;
}
/ "upcoming" /
.EZrbnd .sxa9Pc {
  font-family: Caveat;
}
/* member names */
.asQXV {
  font-family: Caveat;
  font-size: 1.2rem;
}
/* attachments */
.QDKOcc {
  font-family: Caveat;
  font-size: 1.1rem;
}
/* due work alert */
.sdDCme {
  font-size: 1.12rem;
}
.VBEdtc-Wvd9Cc:hover {
  color: #fff;
  font-size: 1rem;
}
/* textarea text */
textarea {
  font-family: Caveat important;
  font-size: 1.5em important;
}
/* default announement text */
.K6Ovqd {
  font-size: 1.5rem important;
}
.fidHdf {
  margin: 0 important;
}
/* semi-global text */
.EZrbnd {
  font-family: Caveat;
}
/* announement content */
.obylVb:not(:empty) {
  font-size: 1.2rem;
}
/* comments content */
.tLDEHd {
  font-size: 1.2rem
}
/* topic names */
.PazDv {
  font-family: Caveat;
  font-size: 2.5rem;
}
/* people list */
.XjYjO {
  font-family: Caveat;
  font-size: 2.5rem;
}
/* class name */
.YVvGBb {
  font-family: Caveat;
}
.A6dC2c {
  font-size: 1.15rem;
}
.dDKhVc {
  font-size: 1rem;
}
.tLDEHd {
  font-family: Caveat;
}
/* materials, questions, assignments, etc */
.tL9Q4c {
  font-family: Caveat;
  font-size: 1.5rem;
}
.NE9bBb {
  color: #fff important;
}
/* gradebook */
.VnOHwf-Tvm9db {
  font-family: Caveat;
}
.EhRlC {
  font-size: 1.5rem important;
  color: #1e8e3e important;
}
.lYU7F {
  font-size: 1.5rem important;
  color: #c5221f important;
}
.ppMo6b {
  font-size: 1.3rem;
  color: #b3d3ec important;
}
/* account panel */
.gb_1b {
  color: #fff;
}
.gb_wb.gb_wb {
  color: #fff;
}
.gb_l .gb_mb {
  color: #fff;
}
.gb_sb.gb_sb {
  color: #fff;
}
.gb_wb.gb_wb {
  color: #fff;
}

/* google drive attachment window */
.yawtRb, .TNg8Ce, .ye3Lg, .Y7Vyje {
  background: none important;
}
.jfvobd {
  color: #fff;
}
.GWh4Ge .kx3Hed {
  color: #ffffffad;
}
.w7qIhd {
  background-image: linear-gradient(to right, #06abff 5%, #6600CC 97%) important;
}
.TNg8Ce .KKjvXb .kx3Hed {
  background-image: linear-gradient(to right, #06abff 5%, #6600CC 97%) important;
  -webkit-background-clip: text important;
  -webkit-text-fill-color: transparent important;
}
.eizQhe-ObfsIf-mJRMzd-PFprWc, .eizQhe-ObfsIf-jXK9ad, {
  background: rgba(21,31,46,0.8);
}
.ndfHFb-jyrRxf-haAclf .ndfHFb-XuHpsb-haAclf {
  background: none;
}
.eizQhe-ObfsIf-jXK9ad {
  color: #dadce073;
}
.pGOlGd .eizQhe-ObfsIf-mJRMzd:not(.eizQhe-ObfsIf-gk6SMd) .eizQhe-mJRMzd-V1ur5d-fmcmS {
  color: #ffffffc4;
}
.iXlbzd, .ndfHFb-jyrRxf-tJHJj-r4nke, .ndfHFb-jyrRxf-haAclf .ndfHFb-rBfmuc-E2o6qc-V67aGc {
  color: #ffffffc4;
}
.ndfHFb-jyrRxf-tJHJj {
  background: none;
}
.eizQhe-jyrRxf-V1ur5d-r4nke>.eizQhe-mJRMzd-V1ur5d-fmcmS, .ndfHFb-vWsuo-s4QLm-haAclf > span {
  color: #ffffffc4;
}
.ndfHFb-vWsuo-s4QLm-haAclf > span:nth-child(1) {
  border-right: 1px solid #ffffffc4;
  padding-right: 5px;
}
.pGOlGd .eizQhe-ObfsIf-mJRMzd-V1ur5d-haAclf, .TgyWAb-ObfsIf-haAclf {
  border-top: 1px solid;
  border-image: radial-gradient(circle, #dadce073 60%, transparent 95%);
  border-image-slice: 9;
}
.picker-dialog.XKSfm-Sx9Kwc {
  background: rgba(21,31,46,0.8) important;
}
.yawtRb .Icoilb svg, .yawtRb .lVYtmc svg, .kZyufc svg {
  fill: #ffffffc4;
}
.iXlbzd, .pGOlGd .ndfHFb-ObfsIf-haAclf .ndfHFb-rBfmuc-E2o6qc-V67aGc {
  color: #ffffffc4;
}
.pGOlGd .ndfHFb-jyrRxf-haAclf .eizQhe-jyrRxf-V1ur5d-haAclf svg {
  fill: #fff;
}
.DrCRke {
  opacity .8;
}
.SI7vke ::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, #06abff 5%, #6600CC 97%);
}
.SI7vke ::-webkit-scrollbar-track {
  background: rgba(21,31,46,0.8) important;
}
.SI7vke ::-webkit-scrollbar {
  width: 5px important;
}
.eizQhe-ObfsIf-jXK9ad:hover {
  transform: scale(1.12);
  transition: transform .45s ease-out;
  z-index: 999;
}
.ndfHFb-jyrRxf-oKdM2c:hover {
  transform: scale(1.035);
  transition: transform .45s ease-out;
  z-index: 999;
}

/* Logo */
.s7ovNb {
  visibility: hidden;
  overflow: visible;
}
.s7ovNb::after {
  line-height: 3rem;
  overflow: visible;
  visibility: visible;
  position: absolute;
  top: 7px;
  left: 1.2em;
  content: 'Google Classroom';
  font-family: Caveat;
  font-size: 2.8rem;
  background-image: linear-gradient(to right, #06abff 5%, #6600CC 97%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.XIpEib {
  overflow: visible;
}
/* scheduled */
.VBEdtc-Wvd9Cc:hover {
  font-size: 1.5rem important;
}
.IMvYId, .IMvYId:visited {
  font-size: 1.05rem;
}
.DShyMc-MzI2OTAxNzI5NjYw .tUJKGd:not(.xp2dJ):not(.rZXyy):hover.idtp4e {
  background: rgba(21,31,46,0.8);
}
.p0oLxb>.bnqxkd {
  background: rgba(21,31,46,0.8);
}
.QkA63b .GJYBjd {
  background: rgba(21,31,46,0.8);
}
.DShyMc-MzI2OTAxNzI5NjYw.bFjUmb-Ysl7Fe, .DShyMc-MzI2OTAxNzI5NjYw .bFjUmb-Ysl7Fe, .DShyMc-MzI2OTAxNzI5NjYw .VUoKZ {
  background: rgba(21,31,46,0.8) important;
}
.y2d25 {
  background: rgba(21,31,46,0.9);
}
.dKKcxf, .RPt7lf.miHM0e>.NE9bBb {
  background: rgba(21,31,46,0.8);
}
.GJYBjd:not(.CeoRYc) {
  background: rgba(21,31,46,0.9) important;
}
.p0oLxb {
  background: rgba(21,31,46,0.9) important;
}
/* transitions */
.GWZ7yf:hover, .Aopndd:hover, .d4Fe0d:hover, .v9TZ3c:hover {
  transform: scale(1.05) important;
  transition: transform 0.2s linear important;
}
.ZoT1D:hover.idtp4e {
  background: rgba(21,31,46,0.8) important;
}
.tUJKGd:hover .SFCE1b, .UISY8d-Ysl7Fe:not(.S6Vdac):hover, .OlXwxf.OlXwxf:hover {
  background: rgba(21,31,46,0.8) important;
  transform: scale(1.05) important;
  transition: transform 0.2s linear important;
}
.GWZ7yf:focus-within {
  transform: scale(1.05) important;
  tansition: transform: 0.2s linear important;
}
.OlXwxf .SFCE1b:hover {
  background: rgba(21,31,46,0.8) important;
}
.uArJ5e.UQuaGc.kCyAyd.l3F1ye.TNOizd.pOf0gc.UJYYgf:hover {
  transform: scale(1.12);
  transition: transform .45s ease-out;
  z-index: 999;
}
.EmVfjc.qs41qe .xq3j6.ERcjC .X6jHbb {
  animation: spinner-left-spin 1333ms cubic-bezier(0.4,0.0,0.2,1) infinite both, loadingAnim 0.5s linear infinite both;
}
@keyframes loadingAnim{
  0% {border-color: #06abff}
  100% {border-color: #6600CC 97%}
}
/* transition fix */
.Sgw65b {
  overflow: visible important;
  max-width: 78.1%;
}
/* transparency */
.gHz6xd {
  background: rgba(21,31,46,0.8);
}
.Aopndd {
  background: rgba(21,31,46,0.8);
}
.d4Fe0d {
  background: rgba(21,31,46,0.8) important;
}
.qk0lee {
  background: rgba(21,31,46,0.8);
}
.joJglb {
  background: rgba(21,31,46,0.8);
}
.GWZ7yf {
  background: rgba(21,31,46,0.8);
}
.IzVHde {
  background: rgba(21,31,46,0.8);
}
.OX4Vcb {
  background: rgba(21,31,46,0.8);
  opacity: 0.7;
}
.ETRkCe {
  background: rgba(21,31,46,0.8) important;
}
.Xzp3fc {
  background: rgba(21,31,46,0.8);
  border-radius: 8px;
}
.FpfvHe {
  background: rgba(21,31,46,0.8);
  border-radius: 8px;
}
.CJXzee {
  background: rgba(21,31,46,0.8);
  border-radius: 8px;
}
.CJXzee a.rUnD6d {
  background: rgba(21,31,46,0.8);
  border-radius: 8px;
  background-clip: padding-box;
}
.l3F1ye:not(.RDPZE) {
  background: rgba(21,31,46,0);
  border-radius: 8px;
}
.pEwOBc {
  background: rgba(21,31,46,0.8);
  border-radius: 8px;
}
.feojCc {
  background: rgba(21,31,46,0.8);
}
.Xi8cpb, a.Xi8cpb {
  background: rgba(21,31,46,0.8);
}
.tUJKGd:not(.xp2dJ).ndcsBf .idtp4e {
  background: rgba(21,31,46,0.8);
}
.DShyMc-MTA5NzA3NjA1MzQy .tUJKGd:not(.xp2dJ).ndcsBf .idtp4e {
  background: rgba(21,31,46,0.8);
}
.SS7JKe .qRUolc {
  background: rgba(21,31,46,0.8) important;
}
.Shk6y {
  font-size: 1.5rem;
  background-image: linear-gradient(to right, #06abff 5%, #6600CC 97%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.pn5mce .MQL3Ob, .a4Vkrf, .ybOdnf:not(.RDPZE).iWO5td, .jBmls {
  background: rgba(21,31,46,0.8) important;
}
.ry3kXd {
  background: rgba(21,31,46,0.8) important;
}
.e19J0b .CeoRYc {
  background: rgba(21,31,46,0.8) important;
}
.CDELXb {
  background: rgba(21,31,46,0.8) important;
}
.I5Bhjd {
  background: rgba(21,31,46,0.8) important;
}
.cLpBac {
  background: rgba(21,31,46,0.8) important;
  background-clip: padding-box important;
}
.l4V7wb:not(.Fxmcue) {
  border: none important;
}
.dKKcxf, .STMvPe {
  background: rgba(21,31,46,0.8) important;
}
.ncFHed .MocG8c.KKjvXb, .OA0qNb .LMgvRb[aria-selected="true"], .tWfTvb [role="option"][aria-selected="true"] {
  background: rgba(21,31,46,0.8) important;
}
.gb_l.gb_1a.gb_2a {
  background: rgba(21,31,46,0.8);
}
.x7zFFe table {
  background: rgba(21,31,46,0.8) important;
}
.HMUCnd {
  background: rgba(21,31,46,0.8) important;
}
.jgvuAb.iWO5td .ncFHed {
  background: rgba(21,31,46,0.8) important;
}
.vUBwW .DPvwYc, .TGnLfc {
  color: white important;
}
.DShyMc-MzI2ODk3OTk4MjE5 .mxmXhf {
  fill: #fff important;
}
.tWfTvb, .XaepId, .NE9bBb, .aVeDNe .MQL3Ob {
  background: rgba(21,31,46,0.8) important;
}
.JPdR6b.qjTEB {
  background: rgba(21,31,46,0.8) important;
}
.fWf7qe .Yalane {
  background: rgba(21,31,46,0.8) important;
  background-clip: padding-box important;
}
.z80M1.FwR7Pc .jO7h3c {
  background-image: linear-gradient(to right, #06abff 5%, #6600CC 97%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.z80M1.qs41qe .jO7h3c {
  background-image: linear-gradient(to right, #06abff 5%, #6600CC 97%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.z80M1.FwR7Pc {
  background: rgba(21,31,46,0.8);
}
.FeRvI .oJeWuf {
  background: rgba(21,31,46,0.8);
}
.z80M1.qs41qe {
  background: rgba(21,31,46,0.8);
}
.xdKj9c, .Je07k, tbody .qwFLJb {
  background: rgba(21,31,46,0.5);
}
.YEeyed, .VUfVLb, thead .qwFLJb {
  background: rgba(21,31,46,0.8);
}
.xdKj9c.kTKNNc, .Je07k.kTKNNc, tbody .qwFLJb.kTKNNc {
  background: rgba(21,31,46,0.8);
}
.tUJKGd:not(.xp2dJ).ndcsBf .idtp4e {
  background: rgba(21,31,46,0.8);
}
.ypv4re {
  background: rgba(21,31,46,0.8);
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}
.ypv4re:not(.pco8Kc) {
  background: rgba(21,31,46,0.8);
  border-radius: 5px;
}
.j70YMc:not(.pco8Kc) {
  background: rgba(21,31,46,0.8);
  border-radius: 5px;
}
.vnnr5e:not(.RDPZE):hover .I9OJHe, .vnnr5e:not(.RDPZE):hover .CIy9F {
  background-color: transparent important;
}
.vnnr5e .CIy9F, .vnnr5e .I9OJHe {
  background: none;
}
.gb_wb.gb_wb {
  background: rgba(21,31,46,0.8);
}
.gb_sb.gb_sb {
  background: rgba(21,31,46,0.8);
}
.gb_wb.gb_wb {
  background: rgba(21,31,46,0.8);
}
.gb_Db.gb_Db {
  background: rgba(21,31,46,0.8);
}
.gb_Nb>.gb_Mb:hover {
  background: rgba(21,31,46,0.4);
}
/* borders fix */
.joJglb, .BdCNc, .d4Fe0d .Aopndd {
  border-color: transparent important;
}
.u73Apc, .uO32ac, .gQZxn, .ycbm1d, .s2g3Xd, .n4xnA, .d6CWTd, .tfGBod.tfGBod:not(.xp2dJ), .tfGBod.xp2dJ .jWCzBe, .tfGBod.xp2dJ .iobNdf, .PeGHgb.Q8U8uc .Ono85c+.oh9CFb, * {
  border-color: #4c4c4c important;
}
.QkA63b .GJYBjd {
  border: 1px solid #4c4c4c important;
}
`;

    var elem = document.createElement('style');
    elem.type = 'text/css';
    elem.innerText = style;
    document.head.appendChild(elem);
})();