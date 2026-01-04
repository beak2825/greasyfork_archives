// ==UserScript==
// @name        redmineTimer
// @namespace   redmine
// @include     http://redmine.kontora-dev.ru/issues/*
// @description Трекать время в редмайне
// @update      https://greasyfork.org/scripts/31945-redminetimer/code/redmineTimer.user.js
// @version     1.02
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31945/redmineTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/31945/redmineTimer.meta.js
// ==/UserScript==


$('.contextual:last').append('<a onclick="return false;" class="icon icon-settings js-timer" href="#edit">Трекать время</a>');
$('#time_entry_hours').after('<a class="my_jstimer">записать время</a>');

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}


$(document).on('click','.my_jstimer',function(){
	var start = getCookie('my_timer')
	var end = Date.now(); // засекли время
	var diff  = end - start;
	console.log(start+' '+end+' '+diff);
	var hours = Math.round(diff/(10*60*60))/100;
	$('#time_entry_hours').val(hours);

});


$(document).on('click','.js-timer',function(){

	if (!$(this).hasClass('js-start')){
		var id = location.href.match( /redmine.kontora-dev.ru\/issues\/([0-9]+)/i )[1];
		start = Date.now(); // засекли время
		$(this).addClass('js-start').text('время трекается');
		setCookie('my_timer',start,{expires:24*60*60,path:'/'})
	}
})