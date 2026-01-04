// ==UserScript==
// @name         Brutal check-in for scboy.cc
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Replace native check-in button and brutally send check-in requests
// @author       tianyi
// @include      https://www.scboy.cc/*
// @downloadURL https://update.greasyfork.org/scripts/406773/Brutal%20check-in%20for%20scboycc.user.js
// @updateURL https://update.greasyfork.org/scripts/406773/Brutal%20check-in%20for%20scboycc.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let count = 0;
	let timeout;

	$(`
		<style>
			#brutal-checkin.running span:first-of-type {
				display: none;
			}
			#brutal-checkin.idle span:last-of-type {
				display: none;
			}
		</style>
	`).appendTo('head');

	$(`
		<li class="nav-item idle" id="brutal-checkin">
		<a class="nav-link" href="#"><i class="icon icon-check"></i> <span>暴力签到</span><span>签到中...</span></a>
		</li>
	`).insertBefore('#nav-usernotice').click((e) => {
		e.preventDefault();

		if (e.currentTarget.classList.contains('running')) {
			count = -1;
		} else {
			checkin();
		}
	});

	function checkin() {
		if (count === -1) {
			count = 0;
			setButtonMode('idle');
			return;
		}

		console.log(`Sending check-in request No.${++count}`);
		setButtonMode('running');

		$.post( "/?mod-checkin.htm", (res) => {
			let data = JSON.parse(res);
			if (data.message.includes('签到完成')) {
				setButtonMode('idle');
				$.alert(data.message);
			} else {
				if (data.message.includes('您已签到')) {
					if (count < 200) {
						timeout = setTimeout(() => checkin(), 50);
					} else {
						setButtonMode('idle');
						count = 0;
						$.alert('已发送200次签到请求，如要继续尝试，请再次点击暴力签到按钮');
					}
				} else {
					setButtonMode('idle');
					$.alert(data.message);
				}
			}
		})
		.fail((res) => {
			setButtonMode('idle');
			$.alert('出错了! 打开Console查看log');
			console.log(`ERROR RESPONSE:\n${res}`);
		});
	}

	function setButtonMode(mode) {
		if (mode === 'running') {
			$('#brutal-checkin').removeClass('idle').addClass('running');
		} else {
			$('#brutal-checkin').removeClass('running').addClass('idle');
		}
	}
})();