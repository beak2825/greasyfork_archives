// ==UserScript==
// @name        Red Leaves torrent images helper
// @namespace   https://leaves.red
// @match       https://*.leaves.red/details.php*
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @license     MIT
// @author      cosmogao
// @description Red Leaves torrent images check helper
// @version     0.0.4
// @icon        https://leaves.red/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/474364/Red%20Leaves%20torrent%20images%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/474364/Red%20Leaves%20torrent%20images%20helper.meta.js
// ==/UserScript==

function getImageSize(img_url) {
  var request = new XMLHttpRequest();
  request.open("HEAD", img_url, false);
  request.send(null);
  var headerText = request.getAllResponseHeaders();
  var re = /Content\-length\s*:\s*(\d+)/i;
  re.exec(headerText);
  return parseInt(RegExp.$1);
}


function sizeFilter($bytesize) {
  let $i = 0
  while (Math.abs($bytesize) >=1024) {
    $bytesize = $bytesize / 1024
    $i++
    if ($i ===4) break
  }
  const $units = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  const $newsize = Math.round($bytesize,2)
  return $newsize + ' ' + $units[$i]
}



(function () {
  window.onload = function() {
	  var kdescr=document.querySelector('#kdescr')
	  var images=kdescr.querySelectorAll('img')
	  var links=[]


	  images.forEach((img)=>{
		var info = ''
		info += '『<b>' + img.src.split('.').at(-1).toUpperCase() + '</b>』'
		info += '『<b>' + img.width + '×' + img.height + '</b>』'
		info += '『<b>' + sizeFilter(()=> {try{getImageSize(img.src)} catch {0}}) + '</b>』'
		info += img.src
		links.push(info)
	  })

	  var newRow = document.createElement('tr');
	  var titleCell = newRow.insertCell();
	  titleCell.innerHTML = '<b>图片信息</b>';
	  titleCell.align = 'right';
	  var infoCell = newRow.insertCell()
	  infoCell.innerHTML = links.join('<br>');
	  var row = kdescr.parentNode.parentNode;
	  row.parentNode.insertBefore(newRow,row);
	}
})();