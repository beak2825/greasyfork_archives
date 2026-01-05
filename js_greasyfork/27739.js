// ==UserScript==
// @name        eyny-img
// @namespace   yanagiragi
// @include     http://*.eyny.com/thread*
// @include     http://*.eyny.com/forum.php?mod=viewthread&tid=*
// @include     http://*.eyny.com/forum.php?mod=forumdisplay&fid*
// @include     https://*.eyny.com/thread*
// @include     https://*.eyny.com/forum.php?mod=viewthread&tid=*
// @include     https://*.eyny.com/forum.php?mod=forumdisplay&fid*
// @version     1.6
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @description Hide Image on eyny.com
// @downloadURL https://update.greasyfork.org/scripts/27739/eyny-img.user.js
// @updateURL https://update.greasyfork.org/scripts/27739/eyny-img.meta.js
// ==/UserScript==
$ = jQuery.noConflict(true)
$(`
<style>
.myButton {
	-moz-box-shadow:inset 0px 1px 0px 0px #ffffff;
	-webkit-box-shadow:inset 0px 1px 0px 0px #ffffff;
	box-shadow:inset 0px 1px 0px 0px #ffffff;
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #f9f9f9), color-stop(1, #e9e9e9));
	background:-moz-linear-gradient(top, #f9f9f9 5%, #e9e9e9 100%);
	background:-webkit-linear-gradient(top, #f9f9f9 5%, #e9e9e9 100%);
	background:-o-linear-gradient(top, #f9f9f9 5%, #e9e9e9 100%);
	background:-ms-linear-gradient(top, #f9f9f9 5%, #e9e9e9 100%);
	background:linear-gradient(to bottom, #f9f9f9 5%, #e9e9e9 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#f9f9f9', endColorstr='#e9e9e9',GradientType=0);
	background-color:#f9f9f9;
	-moz-border-radius:6px;
	-webkit-border-radius:6px;
	border-radius:6px;
	border:1px solid #dcdcdc;
	display:inline-block;
	cursor:pointer;
	color:#666666;
	font-family:Arial;
	font-size:15px;
	font-weight:bold;
	padding:6px 24px;
	text-decoration:none;
	text-shadow:-1px 2px 31px #ffffff;
}
.myButton:hover {
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #e9e9e9), color-stop(1, #f9f9f9));
	background:-moz-linear-gradient(top, #e9e9e9 5%, #f9f9f9 100%);
	background:-webkit-linear-gradient(top, #e9e9e9 5%, #f9f9f9 100%);
	background:-o-linear-gradient(top, #e9e9e9 5%, #f9f9f9 100%);
	background:-ms-linear-gradient(top, #e9e9e9 5%, #f9f9f9 100%);
	background:linear-gradient(to bottom, #e9e9e9 5%, #f9f9f9 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#e9e9e9', endColorstr='#f9f9f9',GradientType=0);
	background-color:#e9e9e9;
}
.myButton:active {
	position:relative;
	top:1px;
}
</sytle>`).appendTo('head')

var btn = $('#append_parent').append("<a href='#' class='myButton' style=' \
                                          text-decoration : none; \
                                          position: fixed; \
                                          margin-top: 10px; \
                                          margin-left: 10px; \
                                          '>Hide/Show All</a>")

$(btn).click(function(event){
  event.preventDefault()
  if($('img').css('display') === 'none')
    $('img').each(function(index, value){ $(this).css('display','')})
  else
    $('img').each(function(index, value){ $(this).css('display','none')})
})

// default show all
//$('img').each(function(index, value){ $(this).css('display','none')})