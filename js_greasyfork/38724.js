// ==UserScript==
// @name         Show Character Codes
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.3
// @license      AGPL v3
// @author       jcunews
// @description  Display a dialog showing the character code(s) of the selected character(s). This script is instended to be used as a bookmarklet using this URL: javascript:scc_ujs()
// @match        *://*/*
// @include      *:*
// @inject-into  page
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38724/Show%20Character%20Codes.user.js
// @updateURL https://update.greasyfork.org/scripts/38724/Show%20Character%20Codes.meta.js
// ==/UserScript==

window.scc_ujs = function(maxTextLength, wspaces, txt, ei, a, b, i, c, o, d, e) {

  //===== CONFIG START =====

  maxTextLength = 100;

  //===== CONFIG END =====

  function zerolead(s, l) {
    return ("0").repeat(l - s.length) + s;
  }

  function hex(n, h) {
    h = n.toString(16).toUpperCase();
    if (n <= 0xff) {
      return zerolead(h, 2);
    } else if (n <= 0xffff) {
      return zerolead(h, 4);
    } else return zerolead(h, 8);
  }

  txt = getSelection();
  if ((txt.anchorNode === txt.focusNode) && (txt.anchorOffset === txt.focusOffset)) {
    if (!(txt = document.activeElement) || !("value" in txt)) return;
    txt = txt.value.substring(txt.selectionStart, txt.selectionEnd);
  } else txt = txt.toString();
  if (!txt || document.querySelector('div.showCharCode[id^="scc"]')) return;
  ei = "scc" + (new Date()).getTime();
  a = document.createElement("DIV");
  a.id = ei;
  a.className = "showCharCode"
  a.innerHTML = `
<style>
#${ei} * {
  opacity:1!important; visibility:visible!important;
  position:static!important; z-index:auto!important; left:auto!important; top:auto!important; right:auto!important; bottom:auto!important; float:none!important;
  margin:0!important; vertical-align:baseline!important;
  border:none!important; padding:0!important; width:auto!important; height:auto!important; overflow:visible!important;
  background:transparent!important; text-align:left!important; text-decoration:none!important; color:#000!important;
  font:normal normal normal 16pt/normal sans-serif!important; cursor:auto!important;
}
#${ei}, #${ei} .curtain {
  display:block!important; position:fixed!important; z-index:999999996!important; left:0!important; top:0!important; right:0!important; bottom:0!important;
}
#${ei} .curtain {
  opacity:.3!important; z-index:999999997!important; background:#000!important; cursor:pointer!important;
}
#${ei} .dialog {
  display:block!important; z-index:999999998!important; visibility:visible!important;
  position:absolute!important;
  padding:10px 10px 0 10px!important; border:5px solid #55b!important; border-radius:10px!important;
  max-height:90%!important; overflow-y:scroll!important; background:#fff!important;
}
#${ei} label {
  margin-right:2ex!important; cursor:pointer!important;
}
#${ei} label:last-child {
  margin-right:0!important;
}
#${ei} table {
  margin:10px 0!important;
}
#${ei} th {
  padding:0 1ex!important; background:#000!important; text-align:center!important; color:#fff!important;
}
#${ei} table.no1Bytes .bytes1 {
  display:none!important;
}
#${ei} table.no2Bytes .bytes2 {
  display:none!important;
}
#${ei} table.no4Bytes .bytes4 {
  display:none!important;
}
#${ei} table.noWSpaces .wspace {
  display:none!important;
}
#${ei} td {
  padding:0 1ex!important; background:#ddd!important;
}
#${ei} td:first-child {
  position:relative!important; text-align:center!important;
}
#${ei} td:first-child:hover:after {
  position:absolute!important; z-index:999999999!important; top:-.54em!important;
  border: 2px solid #007; border-radius:10px!important; padding:0 .11em!important; background:#fff!important;
  font-size:80px; content:attr(char);
}
#${ei} tr:nth-child(2)~tr td:first-child:hover:after {
  top:-.89em!important;
}
#${ei} td+td {
  text-align:right!important;
}
</style>
<div class="curtain"></div>
<div class="dialog">
  <div style="white-space:nowrap!important">
    <label for="${ei}1bytes"><input id="${ei}1bytes" type="checkbox" checked /> 1-Byte</label>
    <label for="${ei}2bytes"><input id="${ei}2bytes" type="checkbox" checked /> 2-Bytes</label>
    <label for="${ei}4bytes"><input id="${ei}4bytes" type="checkbox" checked /> 4-Bytes</label>
    <label for="${ei}wspaces"><input id="${ei}wspaces" type="checkbox" /> White-Spaces</label>
  </div>
  <table class="noWSpaces">
    <tr><th>Char</th><th>Hex</th><th>Dec</th><th>UTF-16 Codes</th><th>UTF-8 Codes</th></tr>
  </table>
</div>
`;
  a.children[1].addEventListener("click", function() {
    a.remove();
    document.documentElement.style.overflow = "";
  }, true);
  b = a.lastElementChild.lastElementChild;
  a.querySelector("#" + ei + "1bytes").addEventListener("click", function() {
    b.classList.toggle("no1Bytes");
  }, true);
  a.querySelector("#" + ei + "2bytes").addEventListener("click", function() {
    b.classList.toggle("no2Bytes");
  }, true);
  a.querySelector("#" + ei + "4bytes").addEventListener("click", function() {
    b.classList.toggle("no4Bytes");
  }, true);
  a.querySelector("#" + ei + "wspaces").addEventListener("click", function() {
    b.classList.toggle("noWSpaces");
  }, true);
  wspaces = "\t\n\r \u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u202f\u205f\u3000\ufeff";
  i = 0;
  while (i < txt.length) {
    d = txt.codePointAt(i);
    (e = (o = b.insertRow()).insertCell()).textContent = c = String.fromCodePoint(d);
    e.setAttribute("char", c);
    if (c.length === 1) {
      o.className = ((c.charCodeAt(0) > 0xff) ? "bytes2" : "bytes1") + (wspaces.indexOf(c) >= 0 ? " wspace" : "");
    } else o.className = "bytes4";
    o.insertCell().textContent = "0x" + hex(d);
    o.insertCell().textContent = d;
    o.insertCell().textContent = c.split("").reduce(
      function(p, c) {
        p.push(hex(c.charCodeAt(0)));
        return p;
      }, []
    ).join(",");
    o.insertCell().textContent = unescape(encodeURIComponent(c)).split("").map(
      function(w) {
        return hex(w.charCodeAt(0));
      }
    ).join(",");
    i += c.length;
  }
  document.body.appendChild(a);
  c = b.parentNode;
  c.style.cssText =
    "left:" + Math.floor((innerWidth - c.offsetWidth) / 2) + "px!important;" +
    "top:" + Math.floor((innerHeight - c.offsetHeight) / 2) + "px!important";
  document.documentElement.style.overflow = "hidden";
};
