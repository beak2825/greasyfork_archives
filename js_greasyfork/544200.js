// ==UserScript==
// @name        nyaa unhider
// @namespace   Violentmonkey Scripts
// @match       https://nyaa.si/
// @match       https://sukebei.nyaa.si/
// @grant       none
// @version     1.1
// @author      g
// @description 31/07/2025, 12:12:58
// @downloadURL https://update.greasyfork.org/scripts/544200/nyaa%20unhider.user.js
// @updateURL https://update.greasyfork.org/scripts/544200/nyaa%20unhider.meta.js
// ==/UserScript==

can_run = true;
let queries = new URLSearchParams(document.URL.split('?')[1]);
for ([k,v] of queries.entries()) {
  switch (k){
    case "f":
      if (v != 0) { can_run = false; }
      break;
    case "c":
      if (v != "0_0") { can_run = false; }
      break;
    case "q":
      if (v != "") { can_run = false; }
      break;
    case "s":
      if (v != "id") { can_run = false; }
      break;
    case "o":
      if (v != "desc") { can_run = false; }
      break;
  }
}
console.log(can_run)

if (can_run) {
  let torrentlist = document.getElementsByClassName("torrent-list")[0]

  torrents = torrentlist.tBodies[0]

  prev_id = null;
  for (let i = 0; i < torrents.children.length; i++) {
    torrent = torrents.children[i];

    links = torrent.cells[1].children;
    link = links[links.length - 1].href


    id_parts = link.split("/");
    id = id_parts[id_parts.length-1]


    if (prev_id - id > 1) {
       for (let j = 1; j < prev_id - id; j++) {
        hiddenrow = torrentlist.insertRow(i+j)
        hidden_id = Number(prev_id) - j

        res = "<tr class='warning'>"
        res += "<td></td>"
        res += "<td colspan='2'>"
        res += "<a href='/view/"
        res += hidden_id
        res += "'>Hidden/deleted torrent</a></td>"
        res += '<td class="text-center"><a href="/download/'
        res += hidden_id
        res += '.torrent"><i class="fa fa-fw fa-download"></i></a></td>'
        res += '<td colspan="5"></td>'
        res += "</tr>"

        console.log("added " + hidden_id)

        hiddenrow.outerHTML = res;
      }
    }

    prev_id = id;
  }
}