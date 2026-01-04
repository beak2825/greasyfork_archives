// ==UserScript==
// @name        rutor.info - name to filename
// @namespace   bayarookie
// @description create tag H2
// @match       *://rutor.info/torrent/*
// @match       *://rutor.is/torrent/*
// @match       *://6tor.org/torrent/*
// @version     1.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35995/rutorinfo%20-%20name%20to%20filename.user.js
// @updateURL https://update.greasyfork.org/scripts/35995/rutorinfo%20-%20name%20to%20filename.meta.js
// ==/UserScript==

function create_h2(s) {
  document.title = s;
  s = s.replace(/[\"]/g, "“");
  s = s.replace(/[\*]/g, "⁎");
  s = s.replace(/[\/]/g, "∕");
  s = s.replace(/[:]/g, "꞉");
  s = s.replace(/[<]/g, "‹");
  s = s.replace(/[>]/g, "›");
  s = s.replace(/[?]/g, "¿");
  s = s.replace(/[\\]/g, "∖");
  s = s.replace(/[\|]/g, "¦");
  s = s.trim();
  document.getElementById("all").appendChild(document.createElement("h2")).appendChild(document.createTextNode(s))
}

let e_h1 = document.getElementsByTagName('h1')[0];
let s_h1 = e_h1.firstChild.data;
let s_h2 = s_h1;
let pos1 = s_h1.indexOf(" / ");
if (pos1 > 0) {
  let sub1 = s_h1.slice(0, pos1);
  let pos2 = s_h1.indexOf(" (2");
  if (pos2 > 0) {
    let sub2 = s_h1.slice(pos1 + 3, pos2);
    s_h2 = sub2.trim() + " / " + sub1.trim();
    let sub3 = s_h1.slice(pos2 + 1);
    s_h2 = s_h2 + " " + sub3;
  }
}
if (s_h1.indexOf("VA") === 0 || s_h1.indexOf("V.A.") === 0 || s_h1.indexOf("Сборник") === 0 || s_h1.indexOf("Various Artists") === 0) {
  let pos1 = s_h1.indexOf("(");
  if (pos1 > 0) {
    s_h2 = "VA - ";
    let pos2 = s_h1.indexOf(")");
    let sub1 = s_h1.slice(pos1 + 1, pos2);
    let d = new Date();
    if (sub1 == d.getFullYear()) {
      let m = d.getMonth() + 1;
      if (m.toString().length == 1) {
        m = "0" + m;
      }
      let c = d.getDate();
      if (c.toString().length == 1) {
        c = "0" + c;
      }
      sub1 = sub1 + "." + m + "." + c;
    } else if (sub1.indexOf(".") > 0) {
      let pdt1 = sub1.indexOf(".");
      let sdt1 = sub1.slice(0, pdt1);
      let pdt2 = sub1.indexOf(".", pdt1 + 1);
      let sdt2 = sub1.slice(pdt1 + 1, pdt2);
      sub1 = sub1.slice(pdt2 + 1) + "." + sdt2 + "." + sdt1;
    }
    let i;
    if (s_h1.indexOf("VA") === 0) {i = 5;}
    else if (s_h1.indexOf("V.A.") === 0) {i = 7;}
    else if (s_h1.indexOf("Various") === 0) {i = 18;}
    else {i = 10;}
    s_h2 = s_h2 + sub1 + " - " + s_h1.slice(i, pos1);
  }
}
create_h2(s_h2);
