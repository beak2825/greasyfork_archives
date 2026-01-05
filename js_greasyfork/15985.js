// ==UserScript==
// @name         TSwicher
// @namespace    http://www.taringa.net/Cazador4ever
// @version      0.1
// @description  Switch between different user accounts in Taringa!
// @author       Cazador
// @match        *://*.taringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15985/TSwicher.user.js
// @updateURL https://update.greasyfork.org/scripts/15985/TSwicher.meta.js
// ==/UserScript==

var accounts = [
	{   
        id: 26827683,
		nick: 'Cazador4ever',
		avatar: 'https://a06.t26.net/taringa/avatares/D/4/4/C/3/D/Cazador4ever/120x120_6FE.jpg',
		pass: '++++++'
        },
        {
        id: 25066741,
		nick: 'brodavid',
		avatar: 'https://a13.t26.net/taringa/avatares/C/3/9/D/8/9/brodavid/120x120_411.jpg',
		pass: '6264d0000'
        }
    
	/* pega desde { hasta el } aquí para añadir más usuarios */
];

$('body').prepend([
	'<style type="text/css">',
	'#tool-switcher {',
	'  left: -136px;',
	'}',
	'#tool-switcher .unread {',
	'  border: none;',
	'  font-weight: bold;',
	'  background: #f2fbff url(bullet.png) no-repeat!important;',
	'}',
	'.v6 .header .login .user-actions .user-action .ico-usuario:before {',
	'  font-family: "icomoon";',
	'  content: "\\e971";',
	'  color: inherit;',
	'  font-size: 1em;',
	'  line-height: 1em;',
	'  font-weight: normal;',
	'  font-style: normal;',
	'  text-decoration: inherit;',
	'  text-transform: none;',
	'  -webkit-font-smoothing: antialiased;',
	'  -moz-osx-font-smoothing: grayscale;',
	'  padding: 0 0 0 7px!important;',
	'}',
	'</style>'
].join(''));

$('.user-actions').prepend([
	'<div class="user-action">',
	'  <a href="#" class="ico-usuario tool-switcher"></a>',
	'  <div id="tool-switcher" class="tools" style="display:none">',
	'    <h4>User Accounts</h4>',
	'    <ul></ul>',
	'  </div>',
	'</div>'
].join(''));

$('.tool-switcher').click(function(event) {
	var switcher = $('#tool-switcher');

	switcher.toggle();
	$('.tools:not(.hide)').addClass('hide');

	if (switcher.is(':visible') && switcher.find('ul li').length === 0) {
		var list = switcher.find('ul');

		accounts.forEach(function(data, index) {
			list.append([
				'<li' + (global_data.user == data.id ? ' class="unread"' : '') + '>',
				'<a href="#" class="switch-account" data-index="' + index + '">',
				'<img src="' + data.avatar + '" href="/' + data.nick + '">',
				'<h5>' + data.nick + '</h5>',
				'<p>#' + data.id + '</p>',
				'</a>',
				'</li>'
			].join(''));
		});
	}
});

$('.user-action > a:not(.tool-switcher)').bind('click', function() {
	$('#tool-switcher').hide();
});

$('body').on('click', '.switch-account', function() {
	var account = accounts[+$(this).attr('data-index')];
	$.post('/ajax/user/logout').always(function() {
		$.ajax({
			url: '/registro/login-submit.php',
			type: 'post',
			dataType: 'json',
			beforeSend: function() {},
			data: {
				key: undefined,
				nick: account.nick,
				pass: account.pass,
				connect: '',
				redirect: '/' + window.location.pathName
			},
			success: function(data) {
				document.location.reload();
			}
		});
	});
});

//