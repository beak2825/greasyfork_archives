// ==UserScript==
// @name			E-Hentai Click Space
// @version			1.01
// @description     Navigate using left/right empty spaces, removes gallery info on top of page.
// @author			HKJeffer
// @icon 			https://png.icons8.com/ios/50/000000/open-book.png
// @include		 	http://e-hentai.org/s/*
// @include 		http://exhentai.org/s/*
// @include 		https://e-hentai.org/s/*
// @include 		https://exhentai.org/s/*
// @require 		https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/187160
// @downloadURL https://update.greasyfork.org/scripts/368359/E-Hentai%20Click%20Space.user.js
// @updateURL https://update.greasyfork.org/scripts/368359/E-Hentai%20Click%20Space.meta.js
// ==/UserScript==

// This scripts uses jQuery because the author is quite lazy.

console.log("[ECS] E-Hentai Click Space is running, click the left/right empty space of this page to navigate.");
$('h1').css('display', 'none');
$('#i2').css('display', 'none');

jQuery('<div/>', {
    id: 'left',
    css: {
      left: '0px',
      top: '0px',
      width: '50%',
      height: '100%',
      position: 'absolute'
    }
}).appendTo('body');
$('#left').click(function(){$('#prev').trigger('click');});

jQuery('<div/>', {
    id: 'right',
    css: {
      left: '50%',
      top: '0px',
      width: '50%',
      height: '100%',
      position: 'absolute'
    }
}).appendTo('body');
$('#right').click(function(){$('#next').trigger('click');});

$('#left,#right').css('height', Math.max($(window).height(), $(document).height()));