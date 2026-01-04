// ==UserScript==
// @name        muahahaha theoldreader
// @namespace   muahahaha
// @version     1.2.0
// @include     https://theoldreader.com/*
// @run-at      document-end
// @grant       GM_addStyle
// @description dark theme
// @downloadURL https://update.greasyfork.org/scripts/40698/muahahaha%20theoldreader.user.js
// @updateURL https://update.greasyfork.org/scripts/40698/muahahaha%20theoldreader.meta.js
// ==/UserScript==

// https://userstyles.org/styles/106898/the-old-reader-dark

if(typeof(unsafeWindow.$)==='function'){

	var $=unsafeWindow.$;



	{$('head').append('<style id="muahahaha_s">\
	.navbar-fixed-top{background-color:#252525!important}\
	.navbar .nav li a{color:#ddd!important}\
	.navbar .nav li a:hover{color:#26687f!important;color:white!important;}\
	.navbar .nav li.divider-vertical{background-color:#222!important}\
	.navbar-fixed-top{border-bottom-color:#000!important}\
	.form-search .btn{background-color:transparent!important;background-image:url(http://theoldreader.com/assets/ico-search.png)!important;background-position:center center!important}\
	.dropdown .open{background-color:#222!important}\
	.dropdown-menu > li > a:hover{color:#333!important}\
	textarea,input[type="text"],input[type="password"],input[type="datetime"],input[type="datetime-local"],input[type="date"],input[type="month"],input[type="time"],input[type="week"],input[type="number"],input[type="email"],input[type="url"],input[type="search"],input[type="tel"],input[type="color"],.uneditable-input{background-color:#444!important;color:#fff!important;box-shadow:0 1px 1px rgba(0,0,0,0.075) inset!important;border-color:#000!important}\
	body{background-color:#333!important;color:#999!important;font-size:16px!important}\
	.well{background-color:#222!important;border:1px solid #222!important}\
	.btn{color:#ccc!important;text-shadow:0 1px 1px rgba(0,0,0,0.75)!important;background-color:#222!important;background-image:linear-gradient(to bottom,#444,#555)!important;box-shadow:0 1px 0 rgba(255,255,255,0.05) inset,0 1px 2px rgba(0,0,0,0.05)!important}\
	.reader .subscribe-button-container .bg{background-color:#333!important}\
	.reader .subscribe-fixed-top .bg{background:none repeat scroll 0 0 #333!important}\
	.subscribe .btn-primary{border:1px solid #191919!important}\
	.nav-list li a{color:#ccc!important}\
	.nav-list li a:hover{color:#26687f!important}\
	.nav-list li.social a:hover{color:#da3f2d!important}\
	.nav-list li.nav-header a{color:#666!important}\
	.nav-list li.nav-header a:hover{color:#bbb!important}\
	.loader{background-color:#333!important}\
	.page-header{border-bottom:1px solid #222!important}\
	.reader .floating{background:#333!important}\
	.post h3 a{color:#ccc!important}\
	.label.label-transparent{color:#999!important}\
	.post.unread{border-left:10px solid #26687f!important;padding:10px 10px 10px 11px !important}\
	.post.unread .content{color:#888!important}\
	.post .content{color:#ccc!important}\
	.post{padding:10px 10px 10px 20px !important}\
	.post blockquote{background-color:#222!important}\
	img{margin-bottom:15px!important;margin-top:5px!important}\
	.home-page dl dd p a{color:#ccc!important}\
	legend{color:#ddd!important}\
	.dropdown-menu{background-color:#252525!important}\
	.alert{background-color:#26687f!important}\
	.alert.alert-info{color:#fff!important}\
	.hero-unit{background-color:#222!important}\
	.sponsorship{background-color:#222!important;border-color:#444!important}\
	.sponsorship a{color:#ddd!important}\
	</style>');}



	if(localStorage.getItem('muahahaha_d')!=='1'){
		$('#muahahaha_s').prop('disabled',true);
	}

	$('a[href="/users/edit"]').parent().after('<li id="muahahaha_d"><a href="#"><i class="fa fa-adjust"></i> Dark mode</a></li>');

	$('#muahahaha_d').on('click',function($ev){
        $ev.preventDefault();
		var a=$('#muahahaha_s').prop('disabled');
		$('#muahahaha_s').prop('disabled',!a);
		localStorage.setItem('muahahaha_d',a?1:0);
	});



	if(localStorage.getItem('muahahaha_u')!=='1'){
		unsafeWindow.SETTINGS.sidebar_unread_only=false;
	}

	$('a[href="/users/edit"]').parent().after('<li id="muahahaha_u"><a href="#"><i class="fa fa-list-alt"></i> Read mode</a></li>');

	$('#muahahaha_u').on('click',function($ev){
        $ev.preventDefault();
		var a=unsafeWindow.SETTINGS.sidebar_unread_only;
		unsafeWindow.SETTINGS.sidebar_unread_only=!a;
		localStorage.setItem('muahahaha_u',a?1:0);
    });



	$('#sidebar-liked,\
	#sidebar-shared,\
	#sidebar-starred,\
	#sidebar-bookmarked,\
	#sidebar-trending')
		.css('display','none')
		.each(function($i,$e){
			$e=$($e);
// 			$('a[href="/users/edit"]').closest('ul').prepend('<li id="muahahaha_l_'+$i+'" class="muahahaha_l" data-target="'+$e.attr('id')+'">'+$e.html()+'</li>');
			$('a[href="/users/edit"]').closest('ul').prepend('<li>'+$e.html()+'</li>');
		})
	;

}
