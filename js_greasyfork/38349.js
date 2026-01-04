// ==UserScript==
// @name         Ocquiliser HackClient
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  HackClient for Ocquiliser
// @author       Qyther
// @match        http://ocquiliser.paperplane.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/38349/Ocquiliser%20HackClient.user.js
// @updateURL https://update.greasyfork.org/scripts/38349/Ocquiliser%20HackClient.meta.js
// ==/UserScript==
function hax() {
  //--//
  ctx.fillStyle = "gold";
  ctx.globalAlpha = oy;
  ctx.arc(20, window.innerHeight-22, bs, 0, 2*Math.PI);
  ctx.fill();
  ctx.globalAlpha = 1;
  //--//
  requestAnimationFrame(hax);
}
document.addEventListener("keydown", (e) => {
  if (mnudis === 0) {
  if (e.keyCode === 17) {
    ckd++;
    acd = 1;
    setTimeout(() => {
     if (acd === 1 && cdk !== 0) {
       acd = 0;
       ckd = 0;
     }
    }, 300);
  }
  if (ckd >= 2) {
    ckd = 0;
    oy = 0.7;
    opmn();
    setTimeout(() => {
      oy = 0.1;
    }, 750);
  }
  }
});
var mndis = 0;
function opmn() {
  mnudis = 1;
  alert("Listening...");
  setTimeout(() => {
    document.addEventListener("keydown", (e) => {
      var keyn = String.fromCharCode(e.keyCode);
      if (keyn === "T") {
        var gmds = prompt("Enter coordinates! Left x Top , maximum is 1900").split(" x ");
        if (gmds[0] > 0 || gmds[0] < 1900) {
          pos.x = gmds[0] - 230;
        }
        if (gmds[1] > 0 || gmds[1] < 1900) {
          pos.y = gmds[1] - 230;
        }
      }
    if (keyn === "O") {
      LOFML.b = setInterval(() => {
        ocquilised = {
          a:1,
          b:1,
          c:1,
          d:1,
          e:1
        };
    });
    }
    if (keyn === "I") {
      score = Number.MAX_SAFE_INTEGER;
    }
    if (keyn === "M") {
      var mvkd = prompt("Enter number 0 to 6");
      if (mvkd > 0 && mvkd <7) {
        dis0 = mvkd;
      }
    }
      if (keyn === "G") {
        LOFML.a = setInterval(() => {
          mnu = 0;
        });
      }
      if (keyn === "R") {
      clearInterval(LOFML.a);
      clearInterval(LOFML.b);
      score = 0;
      }
    });
    alert("Here are the keys!\n\nT = Teleportation\nO = Ocquilised enemies\nI = Infinite score\nM = Change music\nG = Godmode\nR = Reset");
}, 300);
}
var LOFML = {
a:"",
b:""
};
var acd = 0;
var ckd = 0;
var oy = 0.1;
var bs = 20;
var mnudis = 0;
requestAnimationFrame(hax);