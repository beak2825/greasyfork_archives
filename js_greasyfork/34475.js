// ==UserScript==
// @name        unbias
// @namespace   idaho
// @description Remove implicit bias from exam grading by replacing name with applicants exam identifier.
// @include     https://labor.idaho.gov/DHR/ATS/SME/Exams.aspx
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34475/unbias.user.js
// @updateURL https://update.greasyfork.org/scripts/34475/unbias.meta.js
// ==/UserScript==
var table = document.getElementsByTagName("table")[4];
for (var i = 0, row; row = table.rows[i]; i++) {
  if (i > 0) {
    var a = row.cells[1].getElementsByTagName("a")[0];
    var p = params(a.href);
    var x = p["applicant_exams_id"];
    x = x.substr(x.length - 3);
    row.cells[0].innerText = x;
    a.href = unname(a.href, "name", x);
  }
}
function params(u){
    var a = u.split('?')[1].split('&');
    var p = Array();
    for (var i = 0; i < a.length; i++) {
        var t = a[i].split('=');
        p[t[0]] = t[1];
    }
    return p;
  }
function unname(u, n, v) {
  var p = new RegExp('\\b('+n+'=).*?(&|$)');
  if (u.search(p)>=0) {
    return u.replace(p,'$1' + v + '$2');
  }
  return u + (u.indexOf('?')>0 ? '&' : '?') + n + '=' + v 
}
