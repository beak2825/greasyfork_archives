// ==UserScript==
// @name         Vbet Ripper
// @version      0.37
// @description  Asscheeck Ripper 
// @author       Barney
//
// @compatible   firefox
// @compatible   opera
// @compatible   chrome
// @compatible   edge
// @compatible   brave
//
// @icon         https://images.techhive.com/images/article/2016/10/firefox-logo-100690302-large.jpg?auto=webp&quality=85,70
// @connect      *
// @connect      self
// @connect      localhost
//
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.js
//
// @match        https://vbet.ua/*
// @match        https://m.vbet.ua/*
//
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        window.onurlchange
// @grant        unsafeWindow
//
// @license 	 MIT
// @run-at       document-start
// @noframes
// @namespace https://greasyfork.org/users/777928
// @downloadURL https://update.greasyfork.org/scripts/465187/Vbet%20Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/465187/Vbet%20Ripper.meta.js
// ==/UserScript==
window.mein_sleep = {};

async function jsleep(amt=500, ref='a') {

	return new Promise(function(resolve, reject){
	    window.mein_sleep[ref] = setTimeout(function () {
			resolve(true)
	    }, amt);
	});
}

const extras = {};


async function _send_cmd(cmd, val)
{
	console.log('request with params:', val)
	return new Promise(async function(resolve, reject){
		const toblob = new Blob([val], {});
		const payload_buffer = await toblob.arrayBuffer();
		const default_headers = {
			'Accept': '*/*',
			// it's again unclear whether it puts any default headers or not
			'User-Agent': window.navigator.userAgent,
		}
		const rqprms = {
			method:       'POST',
			url:          `http://127.0.0.1:36913/htbin/cmd.py?cmd=${cmd}`,
			binary:       true,
			headers:      default_headers,
			data:         toblob,
			nocache:      true,
			responseType: 'arraybuffer',

			onload: resolve,
		}

		GM_xmlhttpRequest(rqprms)
	});
}



async function send_cmd(cmd, val)
{
	console.log('request with params:', val)
	return new Promise(async function(resolve, reject){
		const toblob = new Blob([val], {});
		const payload_buffer = await toblob.arrayBuffer();
		const default_headers = {
			'Accept': '*/*',
			// it's again unclear whether it puts any default headers or not
			'User-Agent': window.navigator.userAgent,
		}

		const v_addr = GM_getValue('vmix_addr').trim()
		const rqprms = {
			method:       'GET',
			url:          `http://${v_addr}/API/?Function=SetText&Value=${val.win}&Input=vbet_title_named.gtzip&SelectedName=co_win1.Text`,
			// binary:       true,
			headers:      default_headers,
			// data:         toblob,
			nocache:      true,
			responseType: 'arraybuffer',

			// onload: resolve,
		}
		GM_xmlhttpRequest(rqprms)

		rqprms['url'] = `http://${v_addr}/API/?Function=SetText&Value=${val.draw}&Input=vbet_title_named.gtzip&SelectedName=co_draw.Text`
		GM_xmlhttpRequest(rqprms)

		rqprms['url'] = `http://${v_addr}/API/?Function=SetText&Value=${val.win2}&Input=vbet_title_named.gtzip&SelectedName=co_win2.Text`
		GM_xmlhttpRequest(rqprms)


		rqprms['url'] = `http://${v_addr}/API/?Function=SetText&Value=${val.team1name}&Input=vbet_title_named.gtzip&SelectedName=team1.Text`
		GM_xmlhttpRequest(rqprms)

		rqprms['url'] = `http://${v_addr}/API/?Function=SetText&Value=${val.team2name}&Input=vbet_title_named.gtzip&SelectedName=team2.Text`
		rqprms['onload'] = resolve
		GM_xmlhttpRequest(rqprms)
	});
}


const selectors = {
	'win': {
		'query': null,
		'elem': null,
	},
	'draw': {
		'query': null,
		'elem': null,
	},
	'win2': {
		'query': null,
		'elem': null,
	},
};


$('body').append(`
	<div id="barney_info">
		<div style="display: none;" id="barney_fullpath_info"></div>
		<div id="barney_text_content_info"></div>

		<div class="sel_row">
			<button id="sel_win">Win selector</button>
			<div class="callback_vis" id="win_callback"></div>
		</div>
		<div class="sel_row">
			<button id="sel_draw">Draw selector</button>
			<div class="callback_vis" id="draw_callback"></div>
		</div>
		<div class="sel_row">
			<button id="sel_win2">Win2 selector</button>
			<div class="callback_vis" id="win2_callback"></div>
		</div>


		<div class="sel_row" style="margin-top: 20px;">
			<button id="sel_team1name">Team 1 Name</button>
			<div class="callback_vis" id="team1name_callback"></div>
		</div>
		<div class="sel_row">
			<button id="sel_team2name">Team 2 Name</button>
			<div class="callback_vis" id="team2name_callback"></div>
		</div>


		<div id="barney_last_update_feedback">Waiting...</div>
	</div>
`)

$('body').append(`
	<div id="barney_cfg">
		<input value="${GM_getValue('vmix_addr') || ''}" placeholder="vmix address (ip:port)" id="barney_vmix_addr" type="text">
		<input value="${GM_getValue('team1_name') || ''}" placeholder="Team 1 Name" id="team1_name" type="text">
		<input value="${GM_getValue('team2_name') || ''}" placeholder="Team 2 Name" id="team2_name" type="text">
	</div>
`)
// onchange="GM_setValue('vmix_api', this.value)"

$('#barney_vmix_addr')[0].onchange = function(event){
	GM_setValue('vmix_addr', event.target.value)
}

const br_base = $('#barney_info')[0];
const br_fullpath = $('#barney_fullpath_info')[0];
const br_text = $('#barney_text_content_info')[0];

const vis_que = {
	'win':  $('#win_callback')[0],
	'draw': $('#draw_callback')[0],
	'win2': $('#win2_callback')[0],

	'team1name': $('#team1name_callback')[0],
	'team2name': $('#team2name_callback')[0],
}

$('#barney_info').find('#sel_win')[0].onclick = function(event){
	selectors['win'] = {
		// 'query': br_fullpath.textContent.trim(),
		// 'elem': document.querySelector(br_fullpath.textContent.trim()),
		'elem': extras['current_hover'],
	}
}

$('#barney_info').find('#sel_draw')[0].onclick = function(event){
	selectors['draw'] = {
		// 'query': br_fullpath.textContent.trim(),
		// 'elem': document.querySelector(br_fullpath.textContent.trim()),
		'elem': extras['current_hover'],
	}
}

$('#barney_info').find('#sel_win2')[0].onclick = function(event){
	selectors['win2'] = {
		// 'query': br_fullpath.textContent.trim(),
		// 'elem': document.querySelector(br_fullpath.textContent.trim()),
		'elem': extras['current_hover'],
	}
}





$('#barney_info').find('#sel_team1name')[0].onclick = function(event){
	GM_setValue('team1_name', extras['current_hover']?.innerText.trim())
	$('input#team1_name').val(extras['current_hover']?.innerText.trim())
}
$('#barney_info').find('#sel_team2name')[0].onclick = function(event){
	GM_setValue('team2_name', extras['current_hover']?.innerText.trim())
	$('input#team2_name').val(extras['current_hover']?.innerText.trim())
}



$('#barney_cfg').find('input#team1_name')[0].onchange = function(event){
	GM_setValue('team1_name', $('input#team1_name')?.val().trim())
}
$('#barney_cfg').find('input#team2_name')[0].onchange = function(event){
	GM_setValue('team2_name', $('input#team2_name')?.val().trim())
}




// const br_btn = $('#barney_info button')[0];

$('body').append(`
	<style>
		#barney_info{
			display: flex;
			flex-direction: column;
			position: fixed;
			top: 0px;
			left: 0px;
			padding: 5px;
			min-width: 100px;
			min-height: 50px;
			max-width: 95vw;
			outline: 1px solid rgb(128, 128, 128);
			background: black;
			z-index: 2147483640;
			margin: 5px;
			margin-top: 50px;
			color: white !important;
		}

		#barney_cfg{
			margin: 10px;
			padding: 10px;
			top: 0px;
			left: 50vw;
			background: black;
			outline: 1px solid green;
			display: flex;
			flex-direction: column;
			position: fixed;
			z-index: 214748364;
		}

		#barney_cfg input{
			all: revert;
			margin-top: 5px;
		}

		#barney_info button{
			all: revert;
			width: 100px;
		}

		#barney_text_content_info{
			margin: 10px;
			padding: 5px;
			padding-left: 10px;
			border-left: 2px solid white;
		}

		#barney_info.br_hidden{
			display: none !important;
		}

		.barney_hlight{
			outline: 1px solid red !important;
			background: #000000 !important;
		}

		.sel_row{
			display: flex;
		}
		.sel_row .callback_vis{
			margin-left: 10px;
		}

		#barney_last_update_feedback{
			color: white !important;
		}
	</style>
`)


document.addEventListener('mouseover', tr_event => {

	if (tr_event.altKey){
		display_hover_info(tr_event)
	}

});

document.addEventListener('keyup', tr_event => {

	// br_base.classList.add('br_hidden')
	// $('.barney_hlight').removeClass('barney_hlight')

});


function selector_priority(event){

	const stack = [];
	var parent = event.target;
	while (true){
		const sel = 
			(parent.id ? `#${parent.id}` : null)
				||
			['', ...parent.classList].join('.').replaceAll('.barney_hlight', '')
				||
			parent.tagName.toLowerCase()



		stack.unshift(sel)

		parent = parent.parentElement;

		if (parent == document.body){
			break
		}
	}

	return stack
}

function display_hover_info(event){
	$('.barney_hlight').removeClass('barney_hlight')
	br_base.classList.remove('br_hidden');
	// console.log(event)
	// br_base.style.left = event.clientX + 'px';
	br_base.style.top = event.clientY + 'px';
	br_text.textContent = event.target.textContent.trim().slice(0, 50);

	event.target.classList.add('barney_hlight')

	const selector_stack = selector_priority(event)
	// console.log(.join(' > '))

	br_fullpath.textContent = selector_stack.join(' > ');

	extras['current_hover'] = event.target;
}

function get_content(which){
	const elem = selectors[which].elem
	const sel = document.querySelector(selectors[which].query)

	if (elem && document.contains(elem)){
		return elem.textContent
	}

	if (sel){
		return sel.textContent
	}

	return null
}

async function stream_upds(){
	while (true){
		await jsleep(2000)
		const payload = {
			'win':  get_content('win'),
			'draw': get_content('draw'),
			'win2': get_content('win2'),

			'team1name': GM_getValue('team1_name'),
			'team2name': GM_getValue('team2_name'),
		}

		// console.log(selectors)

		vis_que.win.textContent =  `>${payload.win}<`;
		vis_que.draw.textContent = `>${payload.draw}<`;
		vis_que.win2.textContent = `>${payload.win2}<`;

		vis_que.team1name.textContent = `>${payload.team1name}<`;
		vis_que.team2name.textContent = `>${payload.team2name}<`;

		if (!payload.win || !payload.draw || !payload.win2 || !payload.team1name || !payload.team2name){
			continue
		}

		await send_cmd('json', payload)

		const last_date = new Date();
		$('#barney_last_update_feedback').text(`Last update: ${last_date.getHours().toString().padStart(2, '0')}:${last_date.getMinutes().toString().padStart(2, '0')}:${last_date.getSeconds().toString().padStart(2, '0')}`)
	}
}

stream_upds()











