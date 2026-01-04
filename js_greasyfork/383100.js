// ==UserScript==
// @name         Stylus Auditor
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.2
// @license      AGPLv3
// @author       jcunews
// @description  Audit Stylus styles for the current page to list all applied styles, and list any CSS rules which have mismatched selectors or overridden styles. This script is designed to be used as a bookmarklet. To use this script, create a new bookmark with this URL (no quote): "javascript:ujs_stylusAuditor()", then use the bookmark on a website with UserStyle applied using Stylus.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383100/Stylus%20Auditor.user.js
// @updateURL https://update.greasyfork.org/scripts/383100/Stylus%20Auditor.meta.js
// ==/UserScript==

window.ujs_stylusAuditor = function(dd, tt) {
  (dd = document.createElement("DIV")).appendChild(document.createElement("STYLE")).innerHTML = `
p{margin:.5em;background:#ddd;padding:.5ex;word-break:break-all;font-family:monospace}
ul{margin-top:0;padding-left:3ex}
code{padding:0 .5ex;background:#ddd}
table{margin:1em 0}
th,td,pre{padding:.5ex}
th{background:#000;color:#fff}
td{background:#ddd;vertical-align:top}
td:last-child{white-space:pre-wrap;font-family:monospace;font-size:110%}
span{display:block;margin-bottom:.5em;font-family:serif;font-size:91%}
`;
  dd.appendChild(document.createTextNode("This list shows Stylus styles auditing data for the web page at below URL."));
  (tt = dd.appendChild(document.createElement("P"))).textContent = location.href;
  dd.insertAdjacentHTML("beforeend", `<b>Notes:</b><ul>
<li>Some CSS rule names are shortcuts for multiple CSS rules, so rules such as <code>padding</code> may be listed as: <code>padding-top</code>, <code>padding-right</code>, <code>padding-bottom</code>, and <code>padding-left</code>.</li>
<li>Because Stylus doesn't provide a way to retrieve the name of active UserStyles, to manually name a UserStyle, insert (no quote) a <code>/*&lt;[xyz]&gt;*/</code> comment line anywhere in the style code. The <code>xyz</code> is the name for the style.</li>
</ul>`);
  (tt = dd.appendChild(document.createElement("TABLE"))).createTHead().insertRow().innerHTML = '<th>ID</th><th>Name</th><th>Problematic CSS Rules</th>';
  Array.from(document.styleSheets).forEach((s, n, rr, cc, cs) => {
    if (!s.ownerNode || !s.ownerNode.matches('.stylus[id^="stylus-"]')) return;
    rr = tt.insertRow();
    rr.insertCell().textContent = s.ownerNode.id.match(/\d+/)[0];
    rr.insertCell().textContent = (n = s.ownerNode.innerHTML.match(/\/\*<\[\s*(.*?)\s*]>\*\//)) ? n[1] : "<n/a>";
    cc = rr.insertCell();
    cs = "";
    Array.from(s.cssRules).forEach((r, m, pp, yy) => {
      if ((m = document.querySelectorAll(r.selectorText)).length > 0) {
        pp = "";
        yy = [];
        m.forEach((e, u) => {
         u = getComputedStyle(e);
         Array.from(r.style).forEach(y => {
           if ((u.getPropertyValue(y) !== r.style.getPropertyValue(y)) && !yy.includes(y)) {
             pp += "\n  " + y + ": " + r.style.getPropertyValue(y) + (r.style.getPropertyPriority(y) ? " !" + r.style.getPropertyPriority(y) : "") + ";";
             yy.push(y);
           }
         });
        });
        if (yy.length) cs += "\n" + r.selectorText + " { /* overridden styles */" + pp + "\n}";
      } else cs += "\n" + r.selectorText + " {} /* selector mismatch */";
    });
    cc.textContent = cs.substr(1);
    if (s.cssRules.length) {
      cc.insertAdjacentHTML("afterbegin", (cs ? '' : '<span style="margin-bottom:0">This style has no problem.</span>'));
    } else cc.insertAdjacentHTML("afterbegin", '<span style="margin-bottom:0">This style has no CSS rule.</span>');
  });
  if (tt.rows.length > 1) {
    tt = open(dd = URL.createObjectURL(new Blob([dd.outerHTML], {type: "text/html"})));
    URL.revokeObjectURL(dd);
  } else alert("No Stylus style applied on this web page.");
};
