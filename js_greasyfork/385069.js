// ==UserScript==
// @name         phpmyadmin?db=sdgo
// @namespace    phpmyadmin?db=sdgo
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      /.*phpmyadmin.*db=sdgo.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385069/phpmyadmindb%3Dsdgo.user.js
// @updateURL https://update.greasyfork.org/scripts/385069/phpmyadmindb%3Dsdgo.meta.js
// ==/UserScript==
function fromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
function job() {
    var a = document.querySelectorAll("table.table_results");
    if (a.length) {
        var b = a[0].querySelectorAll("td.data a");
        var c = b[0].innerText.match(/[0-9]{5}/);
        if (c) {
            a[0].querySelector("thead tr").insertBefore(fromHTML("<a>Unit</a>"), a[0].querySelector("thead tr").childNodes[2]);
        }
        for (var z = 0; z < b.length; z++) {
            var d = b[z].innerText.match(/[0-9]{5}/);
            if (!d) continue;
            b[z].parentNode.parentNode.parentNode.insertBefore(fromHTML("<a target='_blank' href='http://localhost/sdgo/admin?id=<id>'><img src='http://localhost/sdgo/img/unit/<id>.gif' /></a>".replace(/<id>/g, d[0])), b[z].parentNode.parentNode.parentNode.childNodes[4]);
        }
    }
}
setInterval(function(){
    if (!document.body.innerHTML.match(/admin\?id/g)) job();
}, 1000);