// ==UserScript==
// @name         HTML Access Key Helper
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.1.4
// @license      AGPLv3
// @author       jcunews
// @description  Adds keyboard shortcuts to display available HTML Access Keys, if the websites provide them.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418971/HTML%20Access%20Key%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/418971/HTML%20Access%20Key%20Helper.meta.js
// ==/UserScript==

/*
This script is used to find out which link, button, or form field elements have Access Keys, and what key is assigned for each of them.

When the keyboard focus is not on a text form field...

If CTRL key is held down, for each element with Access Key, the assigned key will be displayed on that element.

If ALT key is also held down when CTRL is held down, a list of Access Keys and their associated element information will be displayed.

In Firefox web browser, Access Key can be accessed by pressing SHIFT+ALT+<AccessKey>.

In Chrome web browser, Access Key can be accessed by pressing ALT+<AccessKey>, or SHIFT+ALT+<AccessKey>.

For more information about Access Key and how to access it in other web browsers, see below page.

https://en.wikipedia.org/wiki/Access_key
*/

((sty, pop, tbl) => {
  var to = {createHTML: s => s}, tp = window.trustedTypes?.createPolicy ? trustedTypes.createPolicy("", to) : to, html = s => tp.createHTML(s);

  function dopop() {
    tbl.innerHTML = html("");
    document.querySelectorAll("[accesskey]").forEach((el, r, t) => {
      if (!(el.accessKeyLabel || el.accessKey)) return;
      (r = tbl.insertRow()).innerHTML = html('<td></td><td></td><td></td><td></td>');
      r.children[0].textContent = el.accessKeyLabel || (el.accessKey ? "[" + el.accessKey + "]" : "");
      switch (el.tagName) {
        case "INPUT":
          t = el.type || "text";
          t = t.charAt(0).toUpperCase() + t.substr(1) + " input";
          break;
        case "BUTTON":
          t = "Button";
          break;
        case "A":
          t = "Link";
          break;
        default:
          t = "Element";
      }
      r.children[1].textContent = t;
      t = el.textContent;
      if (t === el.href) t = t.substr(0, 10) + "..."
      r.children[2].textContent = t;
      r.children[3].textContent = el.href || el.value;
    });
    if (!tbl.childElementCount) tbl.insertRow().innerHTML = html('<td colspan="4" style="text-align:center">(none)</td>');
    document.body.appendChild(pop);
  }
  if (!window.document || !document.documentElement || (document.contentType !== "text/html")) return;
  (sty = document.createElement("STYLE")).innerHTML = html(`
.hakhhint_ujs [accesskey]:after {
  position: absolute;
  margin: -.2em 0 0 -1.1em;
  border: 1px solid #000;
  border-radius: 33%;
  padding-bottom:. 1em;
  width: 1.1em;
  background: #aea;
  text-align: center;
  font-size: 12pt;
  font-weight: bold;
  line-height: 1em;
  content: attr(accesskey);
}`);
  (pop = document.createElement("DIV")).innerHTML = html(`
<style>
#hakh_ujs {
  position: fixed;
  z-index: 999999999;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: .1em solid #000;
  border-radius: .5em;
  padding: .3em;
  background: #fff;
  font:normal normal normal 12pt/normal serif;
  color: #000;
}
.hakhtitle_usj {
  padding: 0 .2em;
  background: #000;
  text-align: center;
  line-height: 1.3em;
  font-weight: bold;
  color: #fff;
}
.hakhcnt_ujs {
  max-height: calc(100vh - 3em);
  overflow-y: auto;
}
.hakhtbl_ujs {
  margin: 0;
  border-collapse: separate;
  border-spacing: revert;
  border: none;
  width: auto;
  font: inherit;
}
.hakhtbl_ujs tr {
  border: none;
}
.hakhtbl_ujs thead tr {
  background: #777;
  color: #fff;
}
.hakhtbl_ujs tbody tr:nth-child(2n) {
  background: #eee;
}
.hakhtbl_ujs th, .hakhcnt_ujs td {
  margin: 0;
  vertical-align: revert;
  border: none;
  padding: .06em .2em;
  height: auto;
  background: inherit;
  text-align: revert;
  font: inherit;
  color: inherit;
}
.hakhtbl_ujs th {
  text-align: revert;
}
.hakhtbl_ujs td:nth-child(2) {
  white-space: nowrap;
}
</style>
<div class="hakhtitle_usj">List of Access Keys</div>
<div class="hakhcnt_ujs">
  <table class="hakhtbl_ujs">
    <thead><th>Key</th><th>Element</th><th>Name</th><th>Details</th></thead>
    <tbody></tbody>
  </table>
</div>`);
  pop.id = "hakh_ujs";
  tbl = pop.lastElementChild.firstElementChild.tBodies[0];
  addEventListener("keydown", ev => {
    if (!(/Control(Left|Right)?/).test(ev.code)) return;
    if (ev.altKey) {
      dopop();
    } else if (!sty.parentNode) {
      document.documentElement.appendChild(sty);
      document.body.classList.add("hakhhint_ujs")
    }
  });
  addEventListener("keyup", ev => {
    if (!(/Control(Left|Right)?/).test(ev.code)) return;
    if (ev.altKey) {
      if (pop.parentNode) pop.parentNode.removeChild(pop);
    } else {
      document.body.classList.remove("hakhhint_ujs");
      sty.remove()
    }
  });
  addEventListener("blur", ev => {
    document.body.classList.remove("hakhhint_ujs");
    sty.remove();
    if (pop.parentNode) pop.parentNode.removeChild(pop);
  });
})();
