// ==UserScript==
// @version         0.0.1
// @name            Græ
// @namespace       https://github.com/Suhvon
// @description     For night users.
// @compatible      firefox
// @compatible      opera
// @icon            http://icons.iconarchive.com/icons/pelfusion/christmas-shadow-2/512/Moon-icon.png
// @match           *://trace.cel-lab.org/*
// @run-at          document-start
// @noframes
// @require https://code.jquery.com/jquery-3.2.1.js
// @require https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.1/js/materialize.min.js
// @downloadURL https://update.greasyfork.org/scripts/32646/Gr%C3%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/32646/Gr%C3%A6.meta.js
// ==/UserScript==
(function() {
	'use strict';
	$(document).ready(function() {
		// $('head').append(`<link rel="stylesheet" href="https://necolas.github.io/normalize.css/latest/normalize.css">`);
		/*
        //$('#reset-pass').removeClass('gray-btn').hide();
        $('head').append(`<link rel="stylesheet" href="https://unpkg.com/material-components-web@latest/dist/material-components-web.css">`);
        //hought i needed this shit guess not
        //$('body').append(`<script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.js"></script>`);
        $('#reset-password').append('<button id="test" type="button" class="mdc-button mdc-button--raised mdc-button--primary mdc-ripple-surface" data-mdc-auto-init="MDCRipple">Print Greeting</button>');
        mdc.ripple.MDCRipple.attachTo(document.querySelector('#test'));
        */

		$('#user-details').prepend('<h2>' + $('#body h1').text() + '</h2>');

		$('style').append(`<link href="https://fonts.googleapis.com/css?family=Righteous" rel="stylesheet"><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.1/css/materialize.min.css">`);
		// $('#password').prev().addBack().wrapAll(`<div id="nuts"></div>`);
		$('input[type="password"]').each(function () {
			$(this).prev().addBack().wrapAll('<div class="input-field">');
		});
		$('#reset-pass').after(`<button id="reset-pass" class="btn waves-effect waves-light" type="submit" name="action">Update Settings<i class="material-icons right">save</i></button>`).remove();

		// $('#course-select').addClass('nav-wrapper').removeAttr('id');

		$('head').after(`
		<nav>
			<div class="nav-wrapper">
			<a href="https://trace.cel-lab.org/" class="brand-logo">TrACE</a>
			<a href="#" data-activates="mobile-mode" class="button-collapse "><i class="material-icons">menu</i></a>
			<ul id="nav-mobile" class="right hide-on-med-and-down">
				<li><a href="/account-settings.php"><i class="material-icons left">account_circle</i>Account Settings</a></li>
				<li><a href="/report-bug.php"><i class="material-icons left">bug_report</i>Report Bugs</a></li>
				<li><a href="/logout.php"><i class="material-icons left">exit_to_app</i>Logout</a></li>
			</ul>
			<ul class="side-nav" id="mobile-mode">
				<li><div class="user-view">
					<div class="background">
						<img src="http://i.imgur.com/2omj8zL.png">
					</div>
					<a href="#!name"><span class="white-text name">Made by Meow</span></a>
					<a href="#!email"><span class="white-text email">The Betelgeusian</span></a>
				</div></li>
					<li><a class="waves-effect" href="/account-settings.php"><i class="material-icons left">home</i>Home</a></li>
					<li><a class="waves-effect" href="/account-settings.php"><i class="material-icons left">account_circle</i>Account Settings</a></li>
					<li><a class="waves-effect" href="/report-bug.php"><i class="material-icons left">bug_report</i>Report Bugs</a></li>
					<li><a class="waves-effect" href="/logout.php"><i class="material-icons left">exit_to_app</i>Logout</a></li>
				</ul>
			</div>
		</nav>
		`);
		$('.brand-logo').css({"font-family": 'Righteous', "font-size": 40, "letter-spacing": 1, "padding-left":20});


		// $('#courses > ul').wrapInner(`<ul class="collapsible" data-collapsible="accordion"></ul>`);
		// $('.collapsible').unwrap();
		// $('.title:first').replaceWith($('<div class="row">').append($('.title:first').contents()));
		
		
/* 		$('.title').each(function(){
			$(this).replaceWith($('<div class="row">').append($(this).contents()));
		});
 */
		// $('.container').append($('#body').contents());
		$('#body').contents().unwrap();


		// $('.container h1').text('Enrolled Courses').prepend('<i class="small material-icons">class</i>');
		
/* 		parallax pics = http://imgur.com/a/sncfx */
		$('#course-select').prepend(`
		<div class="parallax-container">
				<h2 class="header white-text">&nbsp;Enrolled Courses</h2>
			<div class="parallax"><img src="http://i.imgur.com/YmHKPYl.png?1"></div>
		</div>
		`);
		
		$('h2.header').addClass('truncate').css({"padding-top":400, "font-weight":300});
		$('#content').css({"padding-top":20});
		
/* 		$('.container h1').each(function(){
			$(this).replaceWith($('<h2>').append($(this).contents()));
		}); */
		
		$('.container h1').remove();
		
		
		
/* 			.wrap('<div class="row "><div class="col s12 m6"><div class="card"><div class="card-content ">'); */
		
/* 		$('.container h1').each(function(){
			$(this).replaceWith($('<span class="card-title">').append($(this).contents()).text('Enrolled Courses').wrap('<div class="row"><div class="col s12 m6"><div class="card">'));
		}); */
		
		
/* 		$('.container h1').each(function(){
			$(this).wrap('<div class="row"><div class="col s12 m4 offset-m4"><div class="card"><div class="card-content">').replaceWith($('<span class="card-title center-align">').append($(this).contents()).text('Enrolled Courses'));
		}); */
		
		
		$('#courses ul li').each(function(){
			$(this).wrap('<div class="col s12 m6">').replaceWith($('<div class="card hoverable swap">').append($(this).contents()));
		});
		
		// $('.card-content a').wrap(`<span class="card-title">`);
		$('.swap a').each(function(){
			$(this).wrap('<div class="card-content">').replaceWith($('<a class="truncate card-title" href="' + $(this).attr("href") +'">').append($(this).contents()));
		});
		$('.swap p').each(function(){
			$(this).replaceWith($('<a href="#">').append($(this).contents()));
		});
		
/* 		$('.card-content p').each(function(){
			$(this).replaceWith($('<a href="#">').append($(this).contents()));
		}); */
		$('.swap').each(function(){
			$(this).find('a[href="#"]').wrapAll('<div class="card-action">');
		});
		// $('a[href="#"]').wrapAll('<div class="card-action">');
// 		.wrap(`<div class="card hoverable medium"></div>`)
		// $('.courseCard').wrap("<div class='card hoverable medium'>");
		$('#courses').addClass('row');
		// $('.title').children().unwrap();
		$('.title,.course-info .col, .course-info,#courses ul').children().unwrap();
// 		shit to be removed
		$('head,#account-links,#mainHeader,.clearfix,.col h3').remove();
// 		js setup for materialize shit
		$(".button-collapse").sideNav();
		$('.parallax').parallax();
		// alert("asdf");

	});
	// Your code here...
	$('a:contains("TrACE")').html().replace('TrACE', '<a class="brand-logo">TrACE</a>');
	//window.mdc.autoInit();
})();