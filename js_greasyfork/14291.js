// ==UserScript==
// @name       GoogleNum
// @description Показывает нумрацию в поиске google
// @include    *google*
// @author     www.chuvyr.ru / Sanek508
// @version 0.0.1.20151129093415
// @namespace https://greasyfork.org/users/21389
// @downloadURL https://update.greasyfork.org/scripts/14291/GoogleNum.user.js
// @updateURL https://update.greasyfork.org/scripts/14291/GoogleNum.meta.js
// ==/UserScript==
 
var num = 10,
    start = 0,
    params = location.search.substr(1).split('&'),
	url = ['alpha-t.org/','alpha-t.ru/','agp24.ru/','agrp24.ru/','sanek508.net/'];

for ( var k in params ) {
  var v = params[k].split('=');
  params[v[0]] = parseInt(v[1]);
}

if (
  ( typeof params['num'] !== 'undefined' ) &&
  ( !isNaN(params['num']) )
) num = params['num'];

var cur = document.getElementsByClassName('cur')[0];
if ( typeof cur === 'undefined' ) {
  if (
    ( typeof params['start'] !== 'undefined' ) &&
    ( !isNaN(params['start']) )
  ) start = params['start'];
} else {
  cur = parseInt( ( document.all ) ? cur.innerText : cur.textContent );
  start = ( cur - 1 ) * num;
}

[].forEach.call(document.getElementsByClassName('g'), function(e){
  if ( ( typeof e.id != 'undefined' ) && ( e.id == 'imagebox_bigimages') || (e.getElementsByClassName('rc').length == 0) ) { } 
  else {
	/* проверка url */
	var links = e.getElementsByTagName('cite');
	  if ( links.length > 0 ) {
		var link = links[0].textContent;
		url.forEach(function(item) {
			if ( link.match(new RegExp(item, 'gi')) ) {
				e.setAttribute('style', 'border:4px solid #c4df9b');
			}
		});
	  }
    var span = document.createElement('span');
	span.setAttribute('style', 'float:left;margin-left:-40px;line-height:21.6px');
    span.innerHTML = (start + 1)+'.';
    e.insertBefore(span, e.firstChild);
    start++;
  }
});
