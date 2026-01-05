// ==UserScript==
// @name          Make Pety Great Again
// @version       1.0
// @description   huj
// @include       *://*.facebook.com/*
// @require       http://code.jquery.com/jquery-2.2.1.min.js
// @author        Niqueish
// @namespace https://greasyfork.org/users/31125
// @downloadURL https://update.greasyfork.org/scripts/24612/Make%20Pety%20Great%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/24612/Make%20Pety%20Great%20Again.meta.js
// ==/UserScript==

$('<audio id="zdycha"><source src="https://archive.org/download/zdycha/zdycha.mp3" type="audio/mpeg"></audio>').appendTo('body');

var css = '._4-u2._3hq5._4-u8{-webkit-transition:all .2s ease-in-out;-moz-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out}._4-u2._3hq5._4-u8:hover{background-color:#E9EBEE;transform:scale(.98);-webkit-transform:scale(.98)}';
style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.getElementsByTagName('head')[0].appendChild(style);



var banUser = function(uid) {
  var group_id = 1734302383515445; 
  var fb_dtsg = $('[name=fb_dtsg]').val();
console.log(uid);
console.log(group_id);
console.log(fb_dtsg);
	var aktZgonu = {
		"ban_user": "0",
		"confirm": "true",
		"fb_dtsg": fb_dtsg
	};

    $.post('https://web.facebook.com/ajax/groups/members/remove.php?group_id='+group_id+'&uid='+uid+'&is_undo=0&dpr=1', aktZgonu);
};

$( document ).on( 'click', '._4-u2._3hq5._4-u8:not(.dobrzeZeZdech)', function() {

    var uid = $(this).find('._8o._8r.lfloat._ohe').data('hovercard').match('id=' + '(.*)' + '&')[1];
    banUser(uid);
    $(this).fadeOut();
    $('#zdycha')[0].cloneNode(true).play();
	$(this).addClass('dobrzeZeZdech');

});