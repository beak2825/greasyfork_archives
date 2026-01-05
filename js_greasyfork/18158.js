// ==UserScript==
// @name        E-Hentai/Exhentai Galleries Sortable Front/Search Page Table + 2 New Columns: Length & Size
// @namespace   https://sleazyfork.org/en/users/34516-cqzyiqbq
// @description Script adds two new columns to table on front/search page, size in MB and length, both are using the EH API. Script also makes columns in table sortable by clicking on column name.
// @include     /^http://(g\.e-|ex|r\.e-)hentai\.org/(\?f_.*|\?page=\d+.*|uploader/.*|)$/
// @license     WTFPL v2
// @grant       GM_addStyle
// @version     0.07
// @require     http://code.jquery.com/jquery-2.2.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/18158/E-HentaiExhentai%20Galleries%20Sortable%20FrontSearch%20Page%20Table%20%2B%202%20New%20Columns%3A%20Length%20%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/18158/E-HentaiExhentai%20Galleries%20Sortable%20FrontSearch%20Page%20Table%20%2B%202%20New%20Columns%3A%20Length%20%20Size.meta.js
// ==/UserScript==
/*
@licstart

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.

@licend
*/
//New columns, (1) is the position of new column in table
var c = $("table.itg tr:first td").length;
$('table.itg').find('tr').each(function(){
    $(this).find('th').eq(1).after('<th>Size MB</th>');
    $(this).find('th').eq(1).after('<th>Length</th>');
    $("tr th:not([style]").attr("style" ,"white-space:nowrap");
    $(this).find('td').eq(1).after('<td> </td>');
    $("tr td:not([class]").attr("class","itx");
    $(this).find('td').eq(1).after('<td> </td>');
    $("tr td:not([class]").attr("class","itz");
});
//Sorting part
$('th').click(function(){
    var table = $(this).parents('table').eq(0)
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc){rows = rows.reverse()}
    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
});
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
    }
}
function getCellValue(row, index){
    return $(row).children('td').eq(index).html()
}
//takes filesize and filecount values from EH API
var apiurl = "http://g.e-hentai.org/api.php";
var apimax = 25;
(function(classes) {
  var reqs = get_reqs(classes, apimax);
  reqs.forEach(function(elems) {
    var ids   = elems.map(function(e) {
      var anchor = (e.getElementsByClassName('it5')[0]).firstElementChild;
      var ref    = anchor.href.split('/');
      return [ref[4], ref[5]];
    });
    var gdata = { "method" : "gdata", "gidlist" : ids };
    send_req(gdata, elems, apiurl);
  });
})(['gtr0','gtr1']);
function get_reqs(classes, maxlen) {
  var elems = classes.map(function(x) {
    return Array.prototype.slice.call(document.getElementsByClassName(x));
  });
  var all = elems[0];
  for (var i=1; i < elems.length; i++) all = all.concat(elems[i]);
  var api_reqs = [];
  for (var i=0; i<all.length; i+=maxlen) api_reqs.push(all.slice(i, i+maxlen));
  return api_reqs;
}
function addfcount(elem, metadata) {
  var itds = elem.getElementsByClassName('itx'),
      filesize = "";
  if ("undefined" !== typeof metadata.error) {
    console.error('gallery-filesize: no filesize in ' + metadata.gid);
    filesize += "error";
  } else {
      filesize += String(((parseInt(metadata.filesize,10))/1024/1024).toFixed(2));
  }
  itds[0].firstChild.nodeValue += filesize;
  var itds = elem.getElementsByClassName('itz'),
      filecount = "";
  if ("undefined" !== typeof metadata.error) {
    console.error('gallery-size: no filecount in ' + metadata.gid);
    filecount += "error";
  } else {
      filecount += "" + String(metadata.filecount);
  }
  itds[0].firstChild.nodeValue += filecount;
}
function send_req(gdata, elems, aurl) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = (function() {
    if (4 === req.readyState) {
      if (200 !== req.status) {
        console.error('gallery-size: cannot send request to ' + aurl);
      } else {
        var apirsp = JSON.parse(req.responseText);
        elems.forEach(function(e,i,arr) { addfcount(e,apirsp.gmetadata[i]); });
      }
    }
  });
  req.open("POST", aurl, true);
  req.send(JSON.stringify(gdata));
}