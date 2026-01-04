// ==UserScript==
// @name         Diakad BOT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @grant        none
// @include     *://*diakad.smawh2.sch.id/*
// @downloadURL https://update.greasyfork.org/scripts/421592/Diakad%20BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/421592/Diakad%20BOT.meta.js
// ==/UserScript==

let dataForm = [
	[
		1,
		"tidak"
	],
	[
		2,
		"tidak"
	],
	[
		3,
		"tidak"
	],
	[
		4,
		"tidak"
	],
	[
		5,
		"tidak"
	],
	[
		6,
		"tidak"
	],
	[
		7,
		"tidak"
	],
	[
		8,
		"tidak"
	],
	[
		9,
		"tidak"
	],
	[
		10,
		"tidak"
	],
	[
		11,
		"tidak"
	],
	[
		12,
		"tidak"
	],
	[
		13,
		"tidak"
	],
	[
		14,
		"tidak"
	],
	[
		15,
		"tidak"
	],
	[
		16,
		"tidak"
	],
	[
		17,
		"tidak"
	],
	[
		18,
		"tidak"
	],
	[
		19,
		"tidak"
	],
	[
		20,
		"ya"
	],
	[
		21,
		"ya"
	],
	[
		22,
		"ya"
	],
	[
		23,
		"ya"
	],
	[
		24,
		"ya"
	],
	[
		25,
		"ya"
	],
]

let menu = '', id_telegram = ''
let isiForm = false
let username = '', password = ''

// Sleep function
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Set Up cookie
function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Get the cookie
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

// Get xpath
function _x(STR_XPATH) {
	var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
	var xnodes = [];
	var xres;
	while (xres = xresult.iterateNext()) {
		xnodes.push(xres);
	}
	return xnodes;
}

// Telegram function
async function sendMessageTelegram(chat_id = id_telegram,message) {
	await $.ajax({
		url: 'https://api.telegram.org/bot1248350732:AAEjfodbi5Vu_dfaet5tplYxH7IDVRcAW6I/sendMessage',
		method: 'POST',
		data: {
			chat_id: chat_id,
			text: message
		},
		success: function () {
			return 'success'
		},
		error: function() {
			return 'error'
		}
	});
}

// show time
function setTime() {
	function time() {
		var d = new Date();
		var s = d.getSeconds();
		var m = d.getMinutes();
		var h = d.getHours();
		let times = h + ":" + m + ":" + s;
		$(_x("//body/nav[1]/div[1]/div[1]/a[3]")).text("Now Time : " + times)
	}
	setInterval(time, 1000);
}

// create menu
function createMenu() {
	let botStatusCookie = getCookie('bot_status')
	let button = `
	<button class="btn btn-lg btn-primary" style="position: fixed; z-index: 9999; bottom: 10px; left: 10px" data-toggle="modal" data-target="#settingModal"><img style="width: 30px" src="https://cdn.iconscout.com/icon/free/png-512/settings-410-461751.png"> Setting MOD</button>
	`
	let modal = `
	<div class="modal fade" id="settingModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="exampleModalLabel">Pengaturan sistem</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div>
					<!-- Nav tabs -->
					<ul class="nav nav-tabs" role="tablist">
						<li role="presentation" id="menu-bot" class="` +((menu == '') ? `active` : `` )+ `"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">General</a></li>
						<li role="presentation" id="menu-account" class="` +((menu == 'account') ? `active` : `` )+ `"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Account</a></li>
						<li role="presentation" id="menu-notif" class="` +((menu == 'notif') ? `active` : `` )+ `"><a href="#notif" aria-controls="messages" role="tab" data-toggle="tab">Telegram Notification</a></li>
						<li role="presentation" id="menu-form" class="` +((menu == 'form') ? `active` : `` )+ `"><a href="#messages" aria-controls="messages" role="tab" data-toggle="tab"></a></li>
					</ul>
					<!-- Tab panes -->
					<div class="tab-content">
						<div role="tabpanel" class="tab-pane `+ ((menu == '') ? `active` : `` ) +`" id="home">
							  <label for="bot_status">Bot Status :</label>
							  <select class="form-control" id="bot_status">
							    <option `+ ((botStatusCookie == 'on') ? `selected` : ``) +` value="on">ON</option>
							    <option `+ ((botStatusCookie == 'off') ? `selected` : ``) +` value="off">OFF</option>
							  </select>
							<br>
							<button type="button" id="saveBotStatus" class="btn btn-primary">Save Bot Status</button>
						</div>
						<div role="tabpanel" class="tab-pane `+ ((menu == 'account') ? `active` : `` ) +`" id="profile">
							<div class="alert alert-warning" role="alert">
								Mohon masukkan data untuk auto login
							</div>	
							<label>Username</label>
							<input id="username" class="form-control" value="` +username+ `" type="text">
							<label>Password</label>
							<input id="password" class="form-control" value="` +password+ `" type="text">
							<br>
							<button type="button" id="saveLoginData" class="btn btn-primary">Save Account Login</button>
						</div>
						<div role="tabpanel" class="tab-pane `+ ((menu == 'notif') ? `active` : `` ) +`" id="notif">
							<div id="alertTelegram"></div>	
							<span>
								Go To <a target="_blank" href="https://t.me/dc_system_bot">https://t.me/dc_system_bot</a> and send message Hello for get id Chat
							</span>
							<br>
							<label>Id Chat Telegram</label>
							<input id="id_telegram" class="form-control" value="` +id_telegram+ `" type="text">
							<br>
							<button data-loading-text="Loading..." type="button" id="testTelegram" class="btn btn-primary">Save & Test Id Chat</button>
						</div>
						<div role="tabpanel" class="tab-pane `+ ((menu == 'form') ? `active` : `` ) +`" id="messages">...</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
			<button type="button" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
			<div style="text-align: left">
			Help : <br>
			<span>Instagram : <a href="https://www.instagram.com/dioclaude/" target="_blank">dioclaude</a></span><br>
			<span>Whatsapp : <a href="https://wa.me/62895410941799" target="_blank">0895410941799</a></span>
			</div>
			</div>
		</div>
	</div>
</div>
	`
	$(_x('//body')).append(button + modal)
	$('#myTabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	})
	// btn bot status save
	$('#saveBotStatus').on('click', function(){
		setCookie('bot_status', $('#bot_status').val())
		location.reload()
	})
	// btn save login data
	$('#saveLoginData').on('click', function(){
		let username = $('#username').val()
		let password = $('#password').val()
		setCookie('userpass', username + '{[|]}' + password)
		location.reload()
	})

	// btn test telegram
	$('#testTelegram').on('click', async function(){
		var $btn = $(this).button('loading')
		id_form_telegram = $('#id_telegram').val()
		sendMessageTelegram(id_form_telegram, "TIME : "+new Date().getHours() +':'+ new Date().getMinutes() +':'+  new Date().getSeconds()+"\nTesting notification")
		.then(() => {
			id_telegram = id_form_telegram
			setCookie('id_telegram', id_form_telegram);
			$btn.button('reset')
			$('#alertTelegram').append(`
			<div class="alert alert-success" role="alert">
				Success Sending chat, Check your telegram
				<button type="button" class="close" data-dismiss="alert" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>	
			`);
		}).catch(() => {
			$btn.button('reset')
			$('#alertTelegram').append(`
			<div class="alert alert-danger" role="alert">
				Error Sending chat, Your ID is INVALID
				<button type="button" class="close" data-dismiss="alert" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>	
			`);
		})
			
	})
}

function fillForm() {
	dataForm.forEach(function (data) {
		if (data[1] == "tidak") {
			if (data[0] == 14 || data[0] == 16 || data[0] == 17) {
				$(_x("//body/section[@id='content']/div[1]/div[2]/div[1]/div[1]/div[2]/form[1]/div[1]/div[" + data[0] + "]/div[1]/input[3]")).click()
			} else {
				$(_x("//body/section[@id='content']/div[1]/div[2]/div[1]/div[1]/div[2]/form[1]/div[1]/div[" + data[0] + "]/div[1]/input[2]")).click()
			}
		} else if (data[1] == "ya") {
			$(_x("//body/section[@id='content']/div[1]/div[2]/div[1]/div[1]/div[2]/form[1]/div[2]/div[" + (data[0] - 19) + "]/div[1]/input[1]")).click()
		}
	})
	setTimeout(() => {
		sendMessageTelegram(id_telegram, "TIME : "+new Date().getHours() +':'+ new Date().getMinutes() +':'+  new Date().getSeconds()+"\nSuccess Filled Form")
		$(_x("//body/section[@id='content']/div[1]/div[2]/div[1]/div[1]/div[2]/form[1]/div[4]/div[1]/button[1]")).click()
	}, 3000)
}

let loginButton = true

function clickForm() {
	function clicksForm() {
		console.log('standby')
		setTimeout(function () {
			$(_x("//button[contains(text(),'OK')]")).click()
			formC = getCookie('form');
			var d = new Date();
			if ((d.getDate() + ':' + (d.getMonth() + 1)) == getCookie('form')) {
				let div = `
				<div class="alert alert-success" role="alert">
					Anda Telah Mengisi Form Pada tanggal : `+(d.getDate() + '-' + (d.getMonth() + 1)) +`
				</div>`
				$(_x("//h2[contains(text(),'DATA PENGISIAN FORM KESEHATAN')]")).html(div)
			}

			if (d.getHours() >= 20 || d.getHours() <= 7) {
				console.log('sesuai jam')
				if ($(_x("//body/section[@id='content']/div[1]/div[1]/h2[1]/a[1]")).text().includes('note_addIsi FORM') && ((d.getDate() + ':' + (d.getMonth() + 1)) != formC)) {
					console.log("go to form")
					$(_x("//body/section[@id='content']/div[1]/div[1]/h2[1]/a[1]")).click()
				}
				if ($(_x("//b[contains(text(),'Monitoring Kesehatan COV-19')]")).length && ((d.getDate() + ':' + (d.getMonth() + 1)) != formC)) {
					console.log("fill form")
					setCookie('form', d.getDate() + ':' + (d.getMonth() + 1), 1)
					fillForm()
				}

			}
			if ($(_x("//button[contains(text(),'LOGIN')]")).length) {
				$(_x("//body/div[1]/div[1]/div[1]/div[2]/div[1]/form[1]/div[2]/div[2]/div[1]/div[1]/input[1]")).val(username)
				$(_x("//body/div[1]/div[1]/div[1]/div[2]/div[1]/form[1]/div[3]/div[2]/div[1]/div[1]/input[1]")).val(password)
				if (loginButton) {
					loginButton = false
					$(_x("//button[contains(text(),'LOGIN')]")).click()
				}
			} else if (!document.location.href.includes('https://diakad.smawh2.sch.id/siswa#kegiatan-harian/mengisi-form-kesehatan') && !document.location.href.includes('https://diakad.smawh2.sch.id/siswa#kegiatan-harian/mengisi-form-kesehatan/add')) {
				console.log("back to form")
				document.location.replace("https://diakad.smawh2.sch.id/siswa#kegiatan-harian/mengisi-form-kesehatan")
			}

			clicksForm()
		}, 1000)
	}
	clicksForm()

}

if (!getCookie('bot_status')) {
	setCookie('bot_status', 'on', 360)
}
if (getCookie('id_telegram')) {
	id_telegram = getCookie('id_telegram')
}
if (getCookie('userpass')) {
	let userpass = getCookie('userpass').split('{[|]}')
	username = userpass[0]
	password = userpass[1]
} else {
	menu = 'account'
}
createMenu()
if (!getCookie('userpass')) {
	$('#settingModal').modal('show')
}
if(getCookie('bot_status') == 'on') {
	setTime()
	clickForm()
}
setTimeout(() => {
	location.reload()
}, 300000)