// ==UserScript==
// @name         BetterInstagram
// @namespace    BetterInstagram
// @homepageURL  https://github.com/failed-404/BetterInstagram/
// @version      Beta
// @description  An awesome theme for Instagram. White is trash.
// @author       Error_404
// @match        https://www.instagram.com/*
// @grant        none
// @icon         https://raw.githubusercontent.com/failed-404/BetterInstagram/main/BetterInstagram_logo.png
// @downloadURL https://update.greasyfork.org/scripts/435506/BetterInstagram.user.js
// @updateURL https://update.greasyfork.org/scripts/435506/BetterInstagram.meta.js
// ==/UserScript==

// var link = document.querySelector("link[rel~='icon']");
// if (!link) {
//     link = document.createElement('link');
//     link.rel = 'icon';
//     document.getElementsByTagName('head')[0].appendChild(link);
// }
// link.href = 'https://raw.githubusercontent.com/failed-404/BetterInstagram/main/BetterInstagram_logo.png';

var conf = confirm("This is beta version, some parts of the CSS are broken. I'm fixing them. Press 'Cancel' to don't load the CSS.")

function customBtn() {
  var x = document.querySelector(".oJZym").getElementsByTagName("a");
  x[0].onclick = function (event) {
    event.preventDefault();
    window.open("https://instagram.com/failed.502/", "_blank");
    window.close();
  };
}

function addCSS(css) {
  var head, style;
  head = document.getElementsByTagName("head")[0];
  if (!head) {
    return;
  }
  style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = css;
  head.appendChild(style);
  customBtn();
}

// CHECKING DETAILS. ALMOST FINISHED.

if (conf == true) {
  addCSS(`
html, body, div, span, a {
  font-family: monospace !important;
}

.g47SY, ._8FvLi {
  color: #c2c2c2 !important;
}

.J_0ip.Vpz-1.TKi86 {
  background: #000 !important;
  color: #fff !important;
}

canvas.CfWVH, h1.NXVPg.Szr5J.coreSpriteLoggedOutWordmark {
  filter: brightness(100);
}

button.sqdOP.yWX7d.y3zKF {
  opacity: 1 !important;
  color: #fff !important;
}

img.s4Iyt {
  filter: brightness(100);
}

a.yLUwa, h2._7UhW9.fKFbl.yUEEX.KV-D4.fDxYl, .YFq-A ._7UhW9.xLCgt.MMzan.KV-D4.se6yk .FPmhX.notranslate.yrJyr, h2._7UhW9.x-6xq.yUEEX.KV-D4.uL8Hv.l4b0S, h3._7UhW9.LjQVu.qyrsm.KV-D4.uL8Hv, .tc8A9 ._32eiM, h1._7UhW9.fKFbl.yUEEX.KV-D4.fDxYl, h1._7UhW9.PIoXz.MMzan._0PwGv.uL8Hv.lV_gY, h1._7UhW9.PIoXz.MMzan._0PwGv.uL8Hv.M8ipN, .eXle2, h1.m82CD.TNiR1, a._2Lks6, a.cRH0J._6u7OO, a.sqdOP.yWX7d.y3zKF.ZIAjV, .TXw9c, .oVN1G, ._7LpC8, .rin8p, h3._7UhW9.LjQVu.MMzan._0PwGv.uL8Hv a {
  background: -webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
  background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);  
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

._lz6s, .cv3IO, .UE9AK, .-qQT3:hover, .PUHRj.H_sJK:hover, .qF0y9.Igw0E.rBNOH.eGOV_.ybXk5._4EzTm.rOtsg.ZUqME, ._8Rna9._3Laht.pC2e0, .h-aRd.fuQUr:hover, .h-aRd.-HRM-:hover, .qF0y9.Igw0E.IwRSH.eGOV_._4EzTm.HcJZg:hover {
  background: #f09433;
  background: -webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
  background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);   
}

.pR7Pc {
  padding-bottom: 35px;
  background: #f09433;
  background: -webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
  background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);   
}

.pbgfb.Di7vw {
  background-color: #3a3b3c !important;
  border: 2px solid white !important;
  color: #fff !important;
}

.sqdOP {
  border: none !important;
}

.zGtbP.IPQK5.VideM, .QzzMF.Igw0E.IwRSH.eGOV_.ui_ht.bPdm3 {
  background: #f09433;
  background: -webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
  background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
  border: 2px solid #fff;
  border-radius: 5px;
}

path, circle {
  fill: #fff !important;
}

.cv3IO a, .cv3IO button, .cv3IO time, h3._7UhW9.LjQVu.MMzan._0PwGv.uL8Hv {
  color: #000;
}

.zGtbP.IPQK5.VideM .puCyQ, .XTCZH div, .ItkAi div, .ItkAi a, .cv3IO, a.FPmhX.MBL3Z, .zwlfE, .PJXu4, .W9_iZ, ._08DtY, div._7UhW9, h4._7UhW9.vy6Bb.qyrsm.KV-D4.uL8Hv.T0kll, .YFq-A ._7UhW9.xLCgt.MMzan.KV-D4.se6yk, button.aOOlW.HoLwm, .tc8A9, ._7UhW9.xLCgt.MMzan._0PwGv.se6yk {
  color: #fff !important;
}

.qF0y9.Igw0E.rBNOH.eGOV_.ybXk5._4EzTm._49XvD.XfCBB.XTCZH {
  position: relative;
  bottom: 5px;
}

._8UZ6e {
  background: #f09433;
  background: -webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
  background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
  padding: 10px 15px;
  border: 2px solid #fff;
  border-radius: 5px;
}

.pV7Qt._6Rvw2.qF0y9.Igw0E.IwRSH.YBx95.ybXk5._4EzTm.i0EQd .oNO81, .pV7Qt._6Rvw2.qF0y9.Igw0E.IwRSH.YBx95.ybXk5._4EzTm.i0EQd .S-mcP, .pV7Qt._6Rvw2.qF0y9.Igw0E.IwRSH.YBx95.ybXk5._4EzTm.i0EQd .N9abW, .pV7Qt._6Rvw2.qF0y9.Igw0E.IwRSH.YBx95.ybXk5._4EzTm.i0EQd .DPiy6.qF0y9.Igw0E.IwRSH.eGOV_._4EzTm, .pV7Qt._6Rvw2.qF0y9.Igw0E.IwRSH.YBx95.ybXk5._4EzTm.i0EQd .DPiy6.qF0y9.Igw0E.IwRSH.eGOV_.vwCYk, .BvMHM.EzUlV.XfvCs {
  background: #A9A9A9;
}

.CMoMH._8_yLp {
  background: #7a7a7a;
}

main.SCxLW.o64aR, .oYYFH, ._6FEQj.CMoMH.RQUXn._8_yLp, .gr27e.QzU5v.o7laV, ._1XyCr {
  background: #3a3b3c;
}

._01UL2, .AvhYw.nLL4f, .piCib {
  background: #3a3b3c !important;
  border: none !important;
}

.TOh1s, .ijCUd._3eoV-.IjCL9._19dxx, ._2eEhX {
  display: none;
}

.tHaIX.qF0y9.Igw0E.IwRSH.eGOV_._4EzTm.HVWg4 {
  background: none !important;
}

.SkY6J {
  visibility: hidden;
  color: #fff !important;
}

.SkY6J::after {
  content: "CSS made by Error_404";
  visibility: visible;
  position: relative;
  top: -60px;
  left: 75px;
}
`);
}
