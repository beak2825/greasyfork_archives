// ==UserScript==
// @name        Symbol Font to Greek Entities
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @description Replace symbol font tags with Greek HTML entities (2015-11-05)
// @version     0.2
// @include     http://www.wildwinds.com/coins/greece/*
// @copyright   Copyright 2015 Jefferson Scher
// @license     BSD 3-clause
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13652/Symbol%20Font%20to%20Greek%20Entities.user.js
// @updateURL https://update.greasyfork.org/scripts/13652/Symbol%20Font%20to%20Greek%20Entities.meta.js
// ==/UserScript==

// CHARACTERS NOT FOUND IN THE OBJECT REMAIN UNCHANGED IN THE CONVERTED STRING
var ge = {
  "A": "&Alpha;",
  "B": "&Beta;",
  "G": "&Gamma;",
  "D": "&Delta;",
  "E": "&Epsilon;",
  "Z": "&Zeta;",
  "H": "&Eta;",
  "Q": "&Theta;",
  "I": "&Iota;",
  "K": "&Kappa;",
  "L": "&Lambda;",
  "M": "&Mu;",
  "N": "&Nu;",
  "X": "&Xi;",
  "O": "&Omicron;",
  "P": "&Pi;",
  "R": "&Rho;",
  "S": "&Sigma;",
  "T": "&Tau;",
  "U": "&Upsilon;",
  "F": "&Phi;",
  "C": "&Chi;",
  "Y": "&Psi;",
  "W": "&Omega;",
  "a": "&alpha;",
  "b": "&beta;",
  "g": "&gamma;",
  "d": "&delta;",
  "e": "&epsilon;",
  "z": "&zeta;",
  "h": "&eta;",
  "q": "&theta;",
  "i": "&iota;",
  "k": "&kappa;",
  "l": "&lambda;",
  "m": "&mu;",
  "n": "&nu;",
  "x": "&xi;",
  "o": "&omicron;",
  "p": "&pi;",
  "r": "&rho;",
  "V": "&sigmaf;",
  "s": "&sigma;",
  "t": "&tau;",
  "u": "&upsilon;",
  "f": "&phi;",
  "c": "&chi;",
  "y": "&psi;",
  "w": "&omega;",
  "J": "&thetasym;",
  "j": "&#981;",
  "v": "&piv;"
}

// define a new tag for the greek entity string, insert style rules
var getag = document.createElement("sftgetag");
var sty = document.createElement("style");
sty.type = "text/css";
sty.appendChild(document.createTextNode("font[SFTGE]{display:none;} sftgetag{display:inline;} sftgetag:hover{background:#cff;}"));
document.body.appendChild(sty);

// Read symbol font tags and built greek entity tags to replace them
var gf = document.querySelectorAll('font[face="SYMBOL"],font[face="symbol"]');
for (var i=0; i<gf.length;i++){
  if (!gf[i].hasAttribute("SFTGE")){
    var txt = gf[i].textContent, txtnew = "";
    for (var j=0; j<txt.length; j++){
      txtnew += ge[txt.substr(j,1)] || txt.substr(j,1);
    }
    var txttag = getag.cloneNode(true);
    txttag.innerHTML = txtnew;
    txttag.setAttribute("title", txt);
    gf[i].parentNode.insertBefore(txttag, gf[i]);
    gf[i].setAttribute("SFTGE", "done");
  }
}