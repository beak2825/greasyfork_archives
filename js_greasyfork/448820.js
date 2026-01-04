// ==UserScript==
// @name         Amino Chat Grabber
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  A utility to grab and compile chat histories, for parsing, archiving or viewing in an accompanying WIP chat history viewer.
// @author       Rasutei
// @match        https://aminoapps.com/*
// @exclude		  https://aminoapps.com/partial/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aminoapps.com
// @grant        none
// @license      GNU GPLv3
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/448820/Amino%20Chat%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/448820/Amino%20Chat%20Grabber.meta.js
// ==/UserScript==
/* eslint-disable curly, no-loop-func, no-return-assign */

//# Script version
const ScriptVersion = '2.3'

//# Settings
//- How long to wait for chat window pages to load when scrolling to the beginning of a chat (in ms).
//- Increase this if your connection is slow, and/or if you find that the script stops scrolling
//- prematurely. Very low values are unadvised, as you will be rate-limited by the server upon making
//- long operations, such as grabbing all chats in a community, or all chats in all communities.
//- Default value is 1500 (1.5 seconds)
const LoadDelay = 1500
//- Whether the script will save images as URIs directly into the file by default. Depending on how
//- many chats and how many sticker and image messages will be collected, it may incur a significant
//- filesize increase. Also, each compiled JSON will have its own setting for this.
//- Default is true.
const SaveURIs = true

//# CORS proxy for file requests
const corsp = 'https://api.codetabs.com/v1/proxy/?quest='

//# Classes
class CompObj {
	init(obj={}) {
		Array.from(Object.keys(obj)).forEach(key => this[key] = obj[key])
	}
	ErrURI(path, detail) {
		if (path == '') {
			console.warn('Error converting to URI: '+detail)
			return
		}
		console.group('Error converting to URI: '+detail)
		console.warn('Content path:\n'+path)
		console.groupEnd()
	}
}
class Community extends CompObj {
	name = ''
	notes = ''
	link = ''
	chats = []
	icon = ''
	iconURI = ''

	/**
	 * @param {{
			name:string,
			link:url,
			icon:url
		}} init
	 */
	constructor(init) {
		super()
		this.init(init)
	}

	genURIs(path='') {
		if (this.iconURI == '')
			URL2URI(this.icon, 'image/jpg', (uri) => this.iconURI = uri, () => this.ErrURI(path, 'Community icon'))
	}
}
class Chat extends CompObj {
	username = ''
	notes = ''
	link = ''
	oldest_timestamp = ''
	avatar = ''
	cover = ''
	avatarURI = ''
	coverURI = ''
	history = []

	/**
	 * @param {{
			username:string,
			link:url,
			avatar:url,
			cover:url
		}} init
	 */
	constructor(init) {
		super()
		this.init(init)
	}

	genURIs(path='') {
		if (this.avatarURI == '')
			URL2URI(this.avatar, 'image/jpg', (uri) => this.avatarURI = uri, () => this.ErrURI(path, 'User avatar'))
		if (this.coverURI == '')
			URL2URI(this.cover, 'image/jpg', (uri) => this.coverURI = uri, () => this.ErrURI(path, 'User cover'))
	}
}
class Message extends CompObj {
	type = ''
	user = ''
	bookmark = ''
	content = ''
	contentURI = ''

	/**
	 * @param {{
			type:string,
			user:string,
			content:string/url
		}} init
	 */
	constructor(init) {
		super()
		this.init(init)
	}

	genURIs(path='') {
		if (this.contentURI == '') {
			if (this.type == 'image' || this.type == 'sticker')
				URL2URI(this.content, 'image/jpg', (uri) => this.contentURI = uri, () => this.ErrURI(path, 'Message content of type '+this.type))
			if (this.type == 'audio')
				URL2URI(this.content, 'audio/aac', (uri) => this.contentURI = uri, () => this.ErrURI(path, 'Message content of type '+this.type))
		}
	}
}

//# File handling
const reader = new FileReader()
const template = {
	gen_version: ScriptVersion,
	cur_version: ScriptVersion,
	save_uris: SaveURIs,
	communities: []
}
window.json_internal = {
	gen_version: ScriptVersion,
	cur_version: ScriptVersion,
	save_uris: SaveURIs,
	communities: []
}
window.archived_users = {}
reader.onload = event => {
	json_internal = JSON.parse(event.target.result)
	MigrateFile()
	UpdateInfo()
	UpdateArchivedChats()
}
reader.onerror = error => {
	log(error)
	Notify('Unable to read JSON file. Make sure you selected the right file, and that it is a valid JSON structure.\nRead the console for more info.')
}

//# UI styling
const css = $('<style id="cgrabber-css"></style>')
	.text(`
		/* //- Widget */
		#cgrabber {
			position: fixed;
			top: 0;
			left: 0;
			display: grid;
			padding: .3rem;
			text-align: center;
			background-color: rgb(10 10 10 / 50%);
			border: 1px solid rgb(40 40 40);
			border-left: 0;
			border-top: 0;
			border-bottom-right-radius: 1rem;
			z-index: 10000;
		}
		/* //- Header */
		#cgrabber #header {

		}
		#cgrabber #header:hover {
			background-color: rgb(50 50 50);
		}
		/* //- Children */
		#cgrabber > * {
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: .3rem .5rem;
			margin: 2px;
			border: 1px outset rgb(40 40 40);
			border-radius: .3rem;
			background-color: rgb(20 20 20);
			color: white;
			font-family: 'Calibri', monospace;
			font-size: 1rem;
			transition: border-radius 300ms 100ms, border-color 300ms 0ms, background-color 300ms 0ms, color 300ms 0ms;
		}
		/* //- Fix width on jQuery show/hide */
		#cgrabber > :not(:first-child, dialog){
			width: 100% !important;
		}
		/* //- No background on text */
		#cgrabber > span,
		#cgrabber > #json_info {
			background-color: transparent;
			border: none;
		}
		/* //- Rounded corner on widget header when closed */
		#cgrabber > :first-child {
			border-bottom-right-radius: 1rem;
			cursor: pointer;
		}
		/* //- Remove rounded corner on widget header when open */
		#cgrabber:hover > :first-child,
		#cgrabber:focus-within > :first-child,
		#cgrabber.open > :first-child {
			border-radius: .3rem;
			transition-duration: 300ms;
			// transition-delay: 200ms, 0ms;
		}
		/* //- Rounded corner on last child */
		#cgrabber > :last-child {
			border-bottom-right-radius: 1rem;
		}
		/* //- Labels and buttons */
		#cgrabber button,
		#cgrabber label {
			appearance: none;
			-webkit-appearance: none;
			cursor: pointer;
		}
		/* //- Hover highlight on labels and buttons */
		#cgrabber > label:hover,
		#cgrabber > button:hover,
		#cgrabber.open > :first-child {
			background-color: rgb(50 50 50);
		}
		/* //- Disabled labels and buttons */
		#cgrabber button[disabled],
		#cgrabber label[disabled],
		#cgrabber .not_implemented{
			filter: contrast(0.5);
			pointer-events: none;
		}
		/* //- Archive info */
		#cgrabber #json_info {
			display: flex;
			flex-direction: column;
		}
		/* //- Archive info numbers */
		#cgrabber #json_info .num {
			font-weight: bold;
		}
		/* //- Dialog */
		#cgrabber dialog {
			display: none !important;
			border-radius: 1rem;
			border: solid 1px rgb(30 30 30);
			padding: 0;
		}
		/* //- Dialog children */
		#cgrabber dialog > * {
			padding: .5rem 1rem;
		}
		/* //- Migration changelog items */
		#cgrabber dialog ul {
			margin: 0;
			text-align: left;
			padding-inline: 1rem;
		}
		/* //- Dialog title */
		#cgrabber dialog > :first-child {
			display: block;
			border-bottom: solid 1px rgb(30 30 30);
			font-weight: bold;
		}
		/* //- Dialog "okay" button */
		#cgrabber dialog > :last-child {
			display: block;
			border-top: solid 1px rgb(30 30 30);
			font-weight: bold;
			cursor: pointer;
			transition: background 300ms ease;
		}
		/* //- Dialog "okay" button highlight */
		#cgrabber dialog > :last-child:hover {
			background-color: red;
		}
		/* //- Dialog modal */
		#cgrabber dialog:modal {
			display: block !important;
			position: absolute;
			top: 50%;
			left: 50%;
			min-width: 15rem;
			background-color: black;
			transform: translate(-50%, -50%);
		}
		/* //- Dialog backdrop */
		#cgrabber dialog::backdrop {
			background: rgb(0 0 0 / .5)
		}
		/* //- Mark on chats that have been archived */
		.cgrabber-archived-mark {
			position: absolute;
			top: -2ch;
			left: 0;
			text-shadow: 0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black;
		}
		/* //- Tree view */
		#cgrabber dialog details {
			text-align: left;
		}
		#cgrabber dialog summary {
			cursor: pointer;
		}
		#cgrabber dialog summary:hover {
			background-color: rgb(200 200 200 / 10%)
		}
		#cgrabber dialog details > div > :not(summary) {
			margin-left: .3rem;
			padding-left: 1rem;
			border-left: solid 1px lightgray;
		}
		#cgrabber dialog details > div {
			transform-origin: top center;
			transform: scaleY(0);
		}
		#cgrabber dialog details.open > div{
			transform: scaleY(1);
			transition: transform ease .3s;
		}
		#cgrabber dialog details > div > :not(summary):last-child {
			border-bottom-left-radius: .5rem;
		}
		#cgrabber dialog details > div > :not(summary, details[open]) {
			border-bottom: solid 1px #333;
		}
		#cgrabber dialog details > div > details {
			margin-left: .3rem;
		}
		#cgrabber dialog details > div > div {
			display: flex;
			justify-content: space-between;
			gap: 2rem;
		}
		#cgrabber dialog details > div > div > span {
			max-width: 50ch;
			word-break: break-all;
		}
		#cgrabber dialog details > div > div > span:nth-child(2) {
			text-align: right;
			color: khaki;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		#cgrabber dialog summary::marker {
			color: crimson;
		}
		#cgrabber dialog summary > span:nth-child(2) {
			color: lightgray;
		}
	`)

//# UI building
const new_button = (text, id='', order='') => {
	return $('<button></button>')
		.attr('id', id)
		.html(text)
		.css('order', order)
}
const $ui_wrapper = $('<div id="cgrabber"></div>')
const $json_info = $('<div id="json_info"></div>').text('No JSON loaded')
const $modal_info = $('<div id="#modal-info"></div>')
const $modal = $('<dialog></dialog>')
	.append($('<div>Chat Grabber</div>'))
	.append($modal_info)
	.append($('<div id="okay">Okay</div>').on('click', () => $modal[0].close()))
$ui_wrapper.append(
		$('<div id="header"></div>')
			.text(`> Chat Archiver ${ScriptVersion} <`)
			.attr('title', 'Click to keep open')
			.on('click', function() {
				$ui_wrapper.toggleClass('open')
				if ($ui_wrapper.hasClass('open'))
					this.textContent = `<< Chat Archiver ${ScriptVersion} >>`
				else
					this.textContent = `> Chat Archiver ${ScriptVersion} <`
			})
	).append(
		$('<span>Internal:</span>')
	).append(
		$('<label for="json_input"></label>')
			.text('Load .JSON')
			.append(
				$('<input hidden type="file" id="json_input">')
					.on('change', JSONLoad)
			)
	).append(
		$json_info
	).append(
		new_button('Download .JSON', 'json_output')
			.on('click', JSONDownload)
	).append(
		$modal
	).append(
		$('<span>Archive:</span>')
	).append(
		$('<label for="save_uri"></label>')
			.append(
				$('<input hidden type="checkbox" id="save_uri" style="margin: 0; margin-right: 1ch" checked>')
					.on('change', (e) => {
						const $cb = $ui_wrapper.find('#save_uri')
						json_internal.save_uris = $cb[0].checked
						$ui_wrapper.find('label[for="save_uri"] > span')
							.text('Save images in-file: '  + ($cb[0].checked? '✔' : '✘'))
					})
			)
			.append(
				$('<span></span>')
					.text('Save images in-file: ' + (json_internal.save_uris? '✔' : '✘'))
			)
	).append(
		new_button('Current chat', 'gen_chat')
			.on('click', GrabChat)
	)/*.append(
		new_button('Current community, all chats<br>(ill-advised)', 'gen_cur_all')
			.on('click', GrabAllInCommunity)
	).append(
		new_button('All communities, all chats<br>(ill-advised)', 'gen_all_all')
			.on('click', GrabEverything)
			.addClass('not_implemented')
	)*/
	.append(
		$('<span>Archive:</span>')
	).append(
		new_button('Clear internal')
			.on('click', () => {
				Object.assign(json_internal, template)
				UpdateInfo()
				UpdateArchivedChats()
			})
	).append(
		new_button('Clear local storage')
			.on('click', () => {
				localStorage.setItem('ras_chatcomp', JSON.stringify(template))
				UpdateInfo()
				UpdateArchivedChats()
			})
	).append(
		$('<span>View:</span>')
	).append(
		new_button('Internal')
			.on('click', () => Display(json_internal))
	).append(
		new_button('LocalStorage')
			.on('click', () => {
				if (localStorage.getItem('ras_chatcomp'))
					Display(JSON.parse(localStorage.getItem('ras_chatcomp')))
				else
					Notify('Nothing in LocalStorage.')
			})
	)
.on('mouseenter', function(){
	if ($ui_wrapper.hasClass('open')) return
	window.jQuery(this).find('> :not(:first-child, dialog)').stop().show(300)
	setTimeout(() => {
		window.jQuery(this).find('> :not(:first-child, dialog)').css('height', '')
	}, 300)
})
.on('mouseleave', function(){
	if ($ui_wrapper.hasClass('open')) return
	window.jQuery(this).find('> :not(:first-child, dialog)').stop().hide(300)
})

//# DOM access
const $chat = () => window.jQuery(document.querySelector('iframe')?.contentDocument)
const $msglist = () => $chat()?.find('.message-list')

//# Unbind $
$.noConflict()

//# Runtime
window.addEventListener('load', () => {
	const $ = window.jQuery
	console.log('ChatGrabber: Loading...')

	//- Append CSS and UI widget, and hide widget buttons
	$(document.head).append(css)
	$(document.body).append($ui_wrapper)
	$ui_wrapper.find('> :not(:first-child)').hide(0)

	//- Check for the chat window, to add marks and other stuff
	setInterval(function() {
		//- Append CSS to chat window as well
		if (!$chat()[0]?.querySelector('#cgrabber-css'))
			$chat()[0]?.head.appendChild(css[0].cloneNode(true))

		//- Get community by link, which is more consistent
		const comm_link = $chat()[0]?.querySelector('header a').href
		if (!comm_link) return
		for (room of $chat()[0].querySelectorAll('.chatroom')) {
			if (!archived_users[comm_link]?.length || !archived_users[comm_link].some(e => e.username == room.querySelector('.name').textContent)) continue
			const entry = archived_users[comm_link].filter(e => e.username == room.querySelector('.name').textContent)[0]
			const mark = document.createElement('div')
			mark.classList.add('cgrabber-archived-mark')
			mark.textContent = '['
				//- Add 'A' for Archived
				// +'A'
				//- Add 'N' for New if the message summary does not display the last message archived
				// + (room.querySelector('.message-summary').textContent.includes(entry.lastMessage)? '' : 'N')
				//- Add '?' if the message summary displays the first message archived
				// + (room.querySelector('.message-summary').textContent.includes(entry.firstMessage)? '?' : '')
				//- Add history length
				+ entry.length
				+']'

			if (room.querySelector('.cgrabber-archived-mark'))
				room.querySelector('.cgrabber-archived-mark').textContent = mark.textContent
			else
				$(room).append(mark)
		}
	}, 1000)

	//- Check in localStorage for a chatcomp
	LSLoad()

	console.log('ChatGrabber: Loaded.')
})

//# Helper functions
function UI(enabled) {
	enabled?
		$ui_wrapper.find('button, label').each(function(){this.removeAttribute('disabled')})
		:
		$ui_wrapper.find('button, label').each(function(){this.setAttribute('disabled', '')})
}
async function Notify(text, ok=true, replace=false) {
	const interval = setInterval(() => {
		if (!replace)
			if ($modal[0].open) return
		clearInterval(interval)
		$modal_info.html(text)
		ok?
			$modal.find('#okay').show()
			:
			$modal.find('#okay').hide()
		try {
			$modal[0].showModal()
		} catch(e) {}
	})
}
function DismissNotify() {
	$modal[0].close()
}
async function URL2URI(url, type, callback, onfail) {
	if (url == '') return
	const reader = new FileReader()
	reader.onload = (e) => {
		if (e.target.result == 'data:image/jpg;base64,PGh0bWw+CjxoZWFkPjx0aXRsZT40MDQgTm90IEZvdW5kPC90aXRsZT48L2hlYWQ+Cjxib2R5Pgo8aDE+NDA0IE5vdCBGb3VuZDwvaDE+Cjx1bD4KPGxpPkNvZGU6IE5vU3VjaEZpbGU8L2xpPgo8bGk+TWVzc2FnZTogVGhlIHNwZWNpZmllZCBmaWxlIGRvZXMgbm90IGV4aXN0LjwvbGk+CjwvdWw+Cjxoci8+CjwvYm9keT4KPC9odG1sPg==') {
			onfail()
			return
		}
		callback(e.target.result)
	}
	let err = false
	fetch(corsp + url)
		.then(res => res.blob())
		.then(blob => {
			reader.readAsDataURL(new Blob([blob], {type: type}))
		})
}
async function WaitFor(f) {
	return new Promise(async (resolve) => {
		setTimeout(() => {
			resolve(false)
		}, 5000)
		do {
			await new Promise(r => setTimeout(r, 16))
			if (f().length)
				break
		} while (true)
		resolve(true)
	})
}
function Display(object) {
	const $ = window.jQuery
	const content = document.createElement('div')
	content.append(DetailTree(object, 'root'))
	Notify(content.innerHTML, true)
	setTimeout(() => {
		$modal[0].querySelectorAll('summary').forEach(e => {
			e.addEventListener('click', () => 
				setTimeout(() => e.closest('details').classList.toggle('open'), 100)
			)
		})
	}, 100)
}
function DetailTree(object, summ) {
	if (typeof(object) != 'object') {
		const content = document.createElement('div')
		content.innerHTML = `<span>${summ}</span><span>${JSON.stringify(object)}</span>`
		return content
	} else {
		const div = document.createElement('div')
		const content = document.createElement('details')
		const summary = document.createElement('summary')
		content.append(summary)
		content.append(div)
		if (Array.isArray(object))
			summary.innerHTML = `<span>${summ}</span> - <span>[${Object.keys(object).length}]</span>`
		else
			summary.innerHTML = `<span>${summ}</span>`
		for (const key of Object.keys(object)) {
			div.append(DetailTree(object[key], key))
		}
		return content
	}
}
//# JSON-handling functions
function LSLoad() {
	if (localStorage.getItem('ras_chatcomp') === null) return false
	const ls = JSON.parse(localStorage.getItem('ras_chatcomp'))
	if (!ls.hasOwnProperty('gen_version') && !ls.hasOwnProperty('cur_version') && !ls.hasOwnProperty('communities')) return false
	json_internal = JSON.parse(localStorage.getItem('ras_chatcomp'))
	window.chatcomp = json_internal
	MigrateFile()
	UpdateInfo()
	UpdateArchivedChats()
}
function LSSave() {
	try {
		localStorage.setItem('ras_chatcomp', JSON.stringify(json_internal))
	} catch(e) {
		console.error(e)
		const last_warning = +localStorage.getItem('ras_chatcomp_storagewarning')
		if (last_warning && (last_warning + 2_629_800_000) < Date.now()) { //? 1 month ago
			Notify('Your compilation is too big to be stored in your browser\'s LocalStorage.<br>What is currently stored will continue to get loaded, but further operations will not be saved to LocalStorage.<br><br>Remember to download the JSON file from now on, or save the current compilation and start another!<br><br>This warning will not be displayed again for a month.', true, true)
			localStorage.setItem('ras_chatcomp_storagewarning', Date.now())
		}
	}
}
function JSONLoad() {
	const $ = window.jQuery
	//- Lock UI
	UI(false)
	//- Cache the button element
	const $load = $('#json_input')
	//- Read the file
	reader.readAsText($load[0].files[0])
	//- Clear the input
	$load[0].value = ''
	//- Update info and unlock UI
	UpdateInfo()
	//- Save to LocalStorage
	LSSave()
	UI(true)
}
function JSONDownload() {
	console.dir(json_internal)
	const file = new Blob([JSON.stringify(json_internal, null, '\t')], {type:'application/json'})
	const a = document.createElement('a')
	a.href = URL.createObjectURL(file)
	a.download = `amino-chat-compilation-v${ScriptVersion}.json`
	a.click()
}
async function UpdateInfo() {
	const comms = json_internal.communities.length
	const chats = json_internal.communities.reduce(
		(prev, cur) => prev += cur.chats.length, 0
	)
	const msgs = json_internal.communities.reduce(
		(prev, cur) => prev += cur.chats.reduce(
			(prev, cur) => prev += cur.history.length, 0
		), 0
	)
	$json_info.html(
		`<div><span class="num">${comms}</span> communities</div><div><span class="num">${chats}</span> chats</div><div><span class="num">${msgs}</span> messages</div>`)
}
function MigrateFile() {
	if (json_internal.cur_version == ScriptVersion) return
	if (parseFloat(json_internal.cur_version) > parseFloat(ScriptVersion)) {
		Notify("Your script is outdated in relation to the JSON file, and, as such, using them together is unadvised.")
	}
	Notify("Your JSON file is outdated; if necessary, migrations will be applied.\nThe browser might hang for a few moments. Please wait. You will be notified once this process ends.", true)
	UI(false)
	try {
		const initial_version = json_internal.cur_version
		let changes = ''
		//- 1.7 - Added DataURI saving for images (covers, icons, avatars and image/sticker messages)
		//- 2.0 - Added message bookmark field
		if (parseFloat(initial_version) <= 1.6 || parseFloat(initial_version) <= 1.7) {
			if (parseFloat(initial_version) < 1.7)
				changes += `
				<b>1.7</b>
				<ul>
					<li>Added 'notes' field to communities and user chats.</li>
					<li>Added fields to store images (community and user icons/avatars and covers, message images/stickers) as DataURI (they'll be saved as Base64 strings directly into the JSON file).
					<ul>
						<li>Images already present in the file as links were automatically converted and stored if available. Some images may no longer be available.</li></ul>
				</ul>
				`
			if (parseFloat(initial_version) < 2.0) {
				changes += `
				<b>2.0</b>
				<ul>
					<li>Added 'bookmark' field to messages. It defaults to an empty string on all messages, but messages where this is filled will be marked for easy finding in the separate Chat History Viewer utility.</li>
					<li>Added 'save_uris' field to top-level object, which defaults to true, and indicates whether the user would like to save images as DataURI, which incurs a fairly significant file size increase.</li>
				</ul>
				`
				json_internal.save_uris = true
			}
			json_internal.communities.forEach((com, com_i) => {
				const new_com = new Community()
				new_com.init(com)
				new_com.genURIs(new_com.name)
				json_internal.communities[com_i] = new_com
				com.chats.forEach((chat, chat_i) => {
					const new_chat = new Chat()
					new_chat.init(chat)
					new_chat.genURIs(new_com.name+' > '+new_chat.username)
					json_internal.communities[com_i].chats[chat_i] = new_chat
					chat.history.forEach((msg, msg_i) => {
						const new_msg = new Message()
						new_msg.init(msg)
						new_msg.genURIs(new_com.name+' > '+new_chat.username+' > history['+msg_i+']')
						json_internal.communities[com_i].chats[chat_i].history[msg_i] = new_msg
					})
				})
			})
		}
		if (changes !== '')
			Notify(`Your JSON file has had its structure and fields updated from version ${initial_version} to ${ScriptVersion}.<br>The following changes were applied:<br><br>${changes}`, true, true)
		else
			Notify(`No migrations were necessary. Your JSON file's current version was updated.`, true, true)
		json_internal.cur_version = ScriptVersion
		UI(true)
		LSSave()
	} catch(e) {
		console.error(e)
		UI(true)
	}

}
function UpdateArchivedChats() {
	for (com of Array.from(json_internal.communities)) {
		archived_users[com.link] = []
		for (chat of com.chats)
			archived_users[com.link].push({
				'username': chat.username,
				'length': chat.history.length,
				'lastMessage': chat.history[chat.history.length-1].content,
				'firstMessage': chat.history[0],
			})
	}
}
//# Grabber functions
function GrabCommunity() {
	try {
		//- Lock UI
		UI(false)
		//- Cache queries
		const chat = $chat()
		//- Create entry and grab all info
		const entry = new Community({
			name: JSON.stringify(chat.find('.community-title').text().trim()),
			link: chat.find('.community-title :first-child')[0].href,
			icon: chat.find('.community-title img.logo')[0].src
		})
		//- Generate URIs, if set to
		if (json_internal.save_uris)
			entry.genURIs()
		//- Append community to structure communities
		json_internal.communities.push(entry)
		//- Update info and return
		UpdateInfo()
		LSSave()
		return entry
	} catch(e) {
		//! This should not happen under normal circumstances
		console.error('!! This should not happen under normal circumstances !!')
		console.error(e)
		UI(true)
		return undefined
	}
}
async function GrabChat() {
	const $ = window.jQuery
	try {
		//- Lock UI
		UI(false)
		Notify('Please wait while it works...', false)
		//- Cache queries
		const chat = $chat()
		const msglist = $msglist()
		//- Find community in structure, or generate it
		const com_link = chat.find('.community-title :first-child')[0].href
		let com = undefined;
		let com_i = undefined;
		json_internal.communities.forEach((c, ci) => {
			if (c.link != com_link) return
			com = c
			com_i = ci
			return
		})
		if (com == undefined)
			com = GrabCommunity()
		if (com == undefined)
			throw 'Community not found in file or on page, despite being open in the chat window.'
		//- Open profile panel, if not already open
		if (chat.find('.user-profile').length == 0) {
			chat.find('.user-message:not(.from-me)').find('.message-author.cover-img')[0].click()
			await WaitFor(() => chat.find('.user-profile'))
		}
		await WaitFor(() => chat.find('.user-profile .user-link'))
		//- If it's a banned/deleted account, skip
		if (chat.find('.thread-title').text().trim() == '-')
			return undefined
		//- Create entry and grab all info
		const entry_c = new Chat({
			username: chat.find('.thread-title').text().trim(),
			link: chat.find('.user-profile .user-link')[0].href,
			avatar: chat.find('.avatar')[0].src,
			cover: chat.find('.user-cover .img-cover')[0].src
		})
		//- Generate URIs, if set to
		if (json_internal.save_uris)
			entry_c.genURIs()
		//- Scroll up as far as possible
		do {
			const count = msglist[0].childElementCount
			msglist[0].scrollTo(top)
			await new Promise(r => setTimeout(r, LoadDelay))
			if (msglist[0].childElementCount == count)
				break
		} while (true)
		//- Grab oldest timestamp
		entry_c.oldest_timestamp = msglist.find('.timestamp')[0].innerText
		//- Grab messages
		msglist.find('.user-message').each(function() {
			const $this = $(this)
			const entry_m = new Message({
				user: ($this.hasClass('from-me')? 'Me' : entry_c.username)
			})
			//* Sticker or image
			if ($this.find('.sticker-message, .img-msg').length) {
				if ($this.find('.sticker-message').length)
					entry_m.type = 'sticker'
				if ($this.find('.img-msg').length)
					entry_m.type = 'image'
				entry_m.content = $this.find('.sticker-message > :first-child, .img-msg > :first-child')[0].src
			}
			//* Audio
			else if ($this.find('.voice-message-container').length) {
				entry_m.type = 'audio'
				entry_m.content = $this.find('.voice-message-container audio')[0].src
			}
			//* Text
			else if ($this.find('.text-msg').length) {
				entry_m.type = 'text'
				entry_m.content = $this.find('.text-msg').html()
				//- Replace tags and restore formatting
				entry_m.content = entry_m.content
					.replaceAll('<p>','')
					.replaceAll('</p>','\n')
					.replaceAll('<p class="', '[')
					.replaceAll('">', ']')
					.replaceAll('center', 'C')
					.replaceAll('italic', 'I')
					.replaceAll('bolder', 'B')
					.replaceAll('strike', 'S')
					.replaceAll('underline', 'U')
				//- Remove spaces from formatting brackets
				const replace = entry_m.content.slice(entry_m.content.indexOf('[')+1,entry_m.content.indexOf(']'))
				if (replace.length != entry_m.content.length-1) {
					entry_m.content = entry_m.content.replace(replace, replace.replaceAll(' ', ''))
				}
				//- Remove trailing line break
				entry_m.content = entry_m.content.slice(0, entry_m.content.length-1)
				//- Try to determine whether the message is a comment
				if (
					entry_m.content.trim().startsWith('|') ||
					entry_m.content.trim().startsWith('(') ||
					entry_m.content.trim().startsWith('/') ||
					entry_m.content.trim().startsWith(`\\`) ||
					entry_m.content.trim().endsWith('|') ||
					entry_m.content.trim().endsWith('(') ||
					entry_m.content.trim().endsWith('/') ||
					entry_m.content.trim().endsWith(`\\`)
				) entry_m.type += ' comment'
			}
			//* Unknown
			else {
				entry_m.type = 'unknown'
				Message.ErrURI(com.name)
			}
			//- Generate and save URIs, if set to
			if (json_internal.save_uris)
				entry_m.genURIs()
			//- Append message to chat history and update info
			entry_c.history.push(entry_m)
			UpdateInfo()
		})
		//- Check if chat with same link already exists
		if (com.chats.map(c => c.link).includes(entry_c.link)) {
			//- If it does, check if it has more or less messages
			com.chats.forEach((c, ci) => {
				if (c.link != entry_c.link) return
				//- If it has less, replace it
				if (c.history.length < entry_c.history.length)
					json_internal.communities[com_i].chats[ci] = entry_c
				//! The only case where this may backfire, to my knowledge, is if the user
				//! could keep sending messages to a chat with a banned account, which is,
				//! as of writing, not possible.
			})
		}
		//- Else, append chat to community chats
		else
			com.chats.push(entry_c)

		LSSave()
	} catch(e) {
		console.error(e)
		UI(true)
		Notify('Something went wrong.<br>Check the console for more information.', true, true)
		return false
	}
	//- Update info and Unlock UI
	UpdateArchivedChats()
	UpdateInfo()
	UI(true)
	DismissNotify()
	//- Finally return
	return true
}
async function GrabAllInCommunity() {
	try {
		//- Lock UI
		UI(false)
		//- Cache queries
		const chat = $chat()
		const chatrooms = chat.find('.thread-list .animation-list').find('.chatroom')
		//- Keep track of errors
		let errors = 0
		//- Iterate over each room
		for (let i=0; i<chatrooms.length; i++) {
			if (errors > 3) {
				Notify(`${errors} sequential failed attempts to grab chats.<br>You are probably being rate-limited. If so, messages won't load for a short while and you may be unable to send messages, until the limit is revoked by the server.<br>Try grabbing chats one by one, and if errors continue, slow down.`)
			}
			console.log(`GrabAllInCommunity: Getting chatroom ${i}:`)
			chatrooms.get(i)
			//- Select the chatroom and wait for it to load
			chatrooms.get(i).click()
			await new Promise(r => setTimeout(r, LoadDelay))
			//- Grab the now-current chat
			GrabChat()? (() => {
				errors++
				console.warn(`GrabAllInCommunity: ${errors} sequential errors.`)
			}) : errors = 0
			console.log('GrabAllInCommunity: Finished. Delaying...')
			await new Promise(r => setTimeout(r, LoadDelay))
		}
	} catch(e) {
		console.error(e)
		UI(true)
	}
}
function GrabEverything() {}