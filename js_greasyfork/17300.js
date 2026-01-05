// ==UserScript==
// @author       @leoncastro
// @namespace    https://greasyfork.org/
// @name         magnet-isohunt
// @version      0.1
// @description  magnet and torrent links for isohunt lists
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @include      https://isohunt.to/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/17300/magnet-isohunt.user.js
// @updateURL https://update.greasyfork.org/scripts/17300/magnet-isohunt.meta.js
// ==/UserScript==

$('.table-torrents thead tr').append('<th class="links-row"><span class="glyphicon glyphicon-magnet"></span></th>');
$('.table-torrents .title-row').each(function(i,e){
 $(this).parent().append('<td class="links-row"></td>');
 var e=$(this), a=e.find('a')[0].getAttribute('href');
 GM_xmlhttpRequest({method:'GET',url:a,onload:function(r){
  var m=r.responseText.match(/\"magnet:[^\"]*\"/igm);
  var d=r.responseText.match(/\"https:\/\/torrent\.isohunt\.to\/download\.php\?id=[^\"]*\"/igm);
  var t='';
  if(m&&m[0])
   t+='<a href='+m[0]+'><span class="glyphicon glyphicon-magnet"></span></a><br>';
  if(d&&d[0])
   t+='<a href='+d[0]+'><span class="glyphicon glyphicon-download"></span></a><br>';
  $( e.parent().find('.links-row')[0] ).html(t);
 }});
});
$('.table-torrents tfooter tr').append('<td>&nbsp;</td>');
