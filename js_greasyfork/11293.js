// ==UserScript==
// @name        KAT - FAQ Search Fix
// @namespace   Rock
// @description Why this wasn't fixed ages ago I don't know :P
// @include     *kat.cr/faq/search/?s=*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11293/KAT%20-%20FAQ%20Search%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/11293/KAT%20-%20FAQ%20Search%20Fix.meta.js
// ==/UserScript==

var list = [];
$('.questionList li').each(function() {
	var name = $('> a', $(this)).text();
	if (/(.*) \[(.+)\]$/.test(name))
		name = name.match(/(.*) \[(.+)\]$/)[1];
	var href = $('> a', $(this)).attr('href').match(/\/faq\/show\/[^\/]*\//)[0];
	var lang = /\/faq\/show\/[^\/]*\/(\w*)\//.test($('> a', $(this)).attr('href'))?$('> a', $(this)).attr('href').match(/\/faq\/show\/[^\/]*\/(\w*)\//)[1]:'';
	var catN = $('> span > a', $(this)).text();
	var catL = $('> span > a', $(this)).attr('href');
	list.push({'name':name, 'href':href, 'lang':lang, 'catN':catN, 'catL':catL});
});
 

triSort(list, 'catN', 'name', 'lang');
function triSort(array, col1, col2, col3) {
	array.sort(function(a, b) {
	  var x1 = a[col1].toLowerCase();
	  var x2 = b[col1].toLowerCase();
	  var y1 = a[col2].toLowerCase();
	  var y2 = b[col2].toLowerCase();
	  var z1 = a[col3].toLowerCase();
	  var z2 = b[col3].toLowerCase();
	
	  if (x1 < x2) return -1;
	  if (x1 > x2) return 1;
	  if (y1 < y2) return -1;
	  if (y1 > y2) return 1;
	  if (z1 < z2) return -1;
	  if (z1 > z2) return 1;
	  return 0;
	});
}
 
$('.questionList').html('');
 
var lastFaq = '', lastCat = '';
var html = '';
for (var i=0;i<list.length;i++) {
	if (lastCat != list[i].catN) {
		lastCat = list[i].catN;
		catHref = list[i].catL;
		html += '<h2 class="topmarg20px"><strong><a href="'+catHref+'">'+lastCat+'</a></strong></h2>';
	}
	if (lastFaq != list[i].href) {
		lastFaq = list[i].href;
		html += '<li class="faqLinks topmarg5px"><a href="'+lastFaq+'">'+list[i].name+'</a><br><span class="lightgrey">Available translations:</span> ';
	}
	if (!list[i].lang) {
		html = html.substring(0, html.length-31)+'No translations available</span>';
	}else{
		html += ' <a class="plain" href="'+lastFaq+list[i].lang+'/">['+list[i].lang+']</a>';
	}
	if (i == list.length-1 || list[i+1].href != lastFaq) {
		html += '</li>'; /* <div class="lightgrey font10px">'+list[i].catg+'</div> */
	}
}
$('.questionList').html(html);
$('.questionList').prev().html($('.questionList li').length+' questions found ('+list.length+' translations):');