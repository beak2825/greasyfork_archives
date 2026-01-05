// ==UserScript==
// @name        FT Ignorelist (Private)
// @namespace   ftignorelist
// @description Ignore users on the FastTech forums
// @include     https://www.fasttech.com/forums/*/t/*
// @include     https://m.fasttech.com/forums/*/t/*
// @include     https://www.fasttech.com/forums/settings
// @version     1.1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/14154/FT%20Ignorelist%20%28Private%29.user.js
// @updateURL https://update.greasyfork.org/scripts/14154/FT%20Ignorelist%20%28Private%29.meta.js
// ==/UserScript==

/* Changelog:
 * 1.0: Initial release
 * 1.1: Fixed several silly bugs
 * 1.2: TBA
 */

// FIXME: change @name

console.log('FTIL GO!')

// There's no compelling reason to enable this.
var use_localstorage = false

var default_settings = {
	'ignore': true,          // Hide posts from users on the ignore list
	'ignore_quotes': false,  // Hide posts that quote users on the ignore list
	'ignore_deleted': false, // Hide deleted posts
	'insert_menu': true,     // Add a menu to the forum toolbar
	'ignorelist': [],        // The acutal ignore list
}

// Settings wrappers that automatically default missing values
function ftil_get(name) {
	if (use_localstorage)
		var item = localStorage.getItem('ftil_' + name)
	else
		var item = GM_getValue(name, null)

	if (item !== null)
		return JSON.parse(item)
	return default_settings[name]
}

function ftil_set(name, val) {
	if (use_localstorage)
		localStorage.setItem('ftil_' + name, JSON.stringify(val))
	else
		GM_setValue(name, JSON.stringify(val))
}

function ftil_in_thread() {
	return new RegExp('^https://www.fasttech.com/forums/[^/]*/t/[0-9]*/').test(location.href)
}

function ftil_in_mthread() {
	return new RegExp('^https://m.fasttech.com/forums/[^/]*/t/[0-9]*/').test(location.href)
}

// ignore = "(ignore|unignore|toggle)"
function ftil_ignore_user(user, ignore) {
	var ignorelist = ftil_get('ignorelist')

	var idx = ftil_ci_indexof(ignorelist, user)
	if (idx === -1 && ignore !== 'unignore')
		ignorelist.push(user)
	else if (ignore !== 'ignore')
		ignorelist.splice(idx, 1)

	ftil_set('ignorelist', ignorelist)
	if (ftil_in_thread()) {
		ftil_hide_posts()
		ftil_update_buttons()
		ftil_update_popout()
	} else if (ftil_in_mthread()) {
		ftil_m_hide_posts()
		ftil_m_update_buttons()
	} else if (location.href === "https://www.fasttech.com/forums/settings") {
		ftil_settings_update()
	}
}

// Case-insensitive indexOf
function ftil_ci_indexof(a, n) {
	for (var i = 0; i < a.length; i++) {
		if (a[i].toLowerCase() === n.toLowerCase())
			return i
	}
	return -1
}

function ftil_toggle_menu() {
	var val = !ftil_get('insert_menu')
	ftil_set('insert_menu', val)
	
	if (val) {
		ftil_add_popout()
		ftil_update_popout()
	} else {
		var menu = document.getElementById('Ignorelist')
		if (menu !== null)
			menu.remove()
		var popout = document.getElementById('IgnorelistPopout')
		if (popout !== null)
			popout.remove()
	}
}
if (ftil_in_thread())
	GM_registerMenuCommand('FTIL: toggle menu', ftil_toggle_menu)

// Event handler for toggling ignored state of a user
function ftil_ignore_listen() {
	ftil_ignore_user(this.getAttribute('username'), 'toggle')
}

// Hide/unhide posts as the ignore list changes
function ftil_hide_posts() {
	var ignorelist = ftil_get('ignorelist')
	var ignore = ftil_get('ignore')
	var ignore_quotes = ftil_get('ignore_quotes')
	var ignore_deleted = ftil_get('ignore_deleted')

	var quote_res = []
	if (ftil_get('ignore_quotes')) {
		for (var i in ignorelist)
			quote_res.push(new RegExp('\\b' + ignorelist[i] + ' wrote(</a>)?:?\n*<br>', 'i'))
	}

	var deleted_re = /post deleted/i

	var posts = document.getElementsByClassName('ForumThread')[0].getElementsByClassName('PostFlags')
	for (var i = 0; i < posts.length; i++) {
		var tr = posts[i].parentElement
		var display = ''

		if (ignore) {
			var pc = tr.getElementsByClassName('PostContent')[0]
			var wb = tr.getElementsByClassName('WarningBox')[0]
			if ((ftil_ci_indexof(ignorelist, pc.getAttribute('data-username')) !== -1) ||
					(ignore_deleted && wb !== undefined && deleted_re.test(wb.innerHTML)))
				display = 'none'
			else if (ignore_quotes) {
				for (var j = 0; j < quote_res.length; j++) {
					if (quote_res[j].test(pc.innerHTML)) {
						display = 'none'
						break
					}
				}
			}
		}

		tr.previousElementSibling.style.display = display
		tr.style.display = display
	}
}

// Add "ignore" links to the header above each post
function ftil_add_buttons() {
	var posts = document.getElementsByClassName('ForumThread')[0].getElementsByClassName('PostContent')
	for (var i = 0; i < posts.length; i++) {
		var top_elem = posts[i].parentElement.parentElement.parentElement
		var header = top_elem.previousElementSibling.firstElementChild.lastElementChild
		var new_a = document.createElement('a')
		var user = header.lastElementChild.getAttribute('data-username')
		new_a.setAttribute('href', 'javascript:void(0)')
		new_a.setAttribute('class', 'IgnoreButton')
		new_a.setAttribute('username', header.lastElementChild.getAttribute('data-username'))
		new_a.addEventListener('click', ftil_ignore_listen)
		header.appendChild(new_a)
	}
}

// As needed, change "ignore" and "unignore" in post headers
function ftil_update_buttons() {
	var ignorelist = ftil_get('ignorelist')
	var buttons = document.getElementsByClassName('IgnoreButton')
	for (var i = 0; i < buttons.length; i++) {
		var button = buttons[i]
		if (ftil_ci_indexof(ignorelist, button.getAttribute('username')) === -1)
			button.innerHTML = '+ ignore'
		else
			button.innerHTML = '+ unignore'
	}
}

// Listeners for the popout menu
function ftil_cb_listen() {
	var v = this.getAttribute('var')
	ftil_set(v, this.checked)
	if (ftil_in_thread())
		ftil_hide_posts()
	else if (ftil_in_mthread())
		ftil_m_hide_posts()
}

function ftil_add_handler(tb, k) {
	if (k !== null && k.which !== 13)
			return true

	ftil_ignore_user(tb.value, 'ignore')

	tb.value = ''

	if (k !== null) {
		k.stopPropagation()
		k.preventDefault()
		return false
	}
}

// Insert a checkbox to control a setting
function ftil_checkbox(p, t, n) {
	var cb = document.createElement('input')
	cb.setAttribute('id', 'ftil_cb_' + n)
	cb.setAttribute('type', 'checkbox')
	cb.setAttribute('var', n)
	cb.checked = ftil_get(n)
	cb.addEventListener('click', ftil_cb_listen)
	p.appendChild(cb)

	var l = document.createElement('label')
	l.setAttribute('for', 'ftil_cb_' + n)
	l.innerHTML = t
	p.appendChild(l)
	p.appendChild(document.createElement('br'))
}

// Build the popout menu
function ftil_add_popout() {
	if (!ftil_get('insert_menu'))
		return

	var bar = document.getElementsByClassName('ThreadCommandBar')[0]
	var span = document.createElement('span')
	span.setAttribute('id', 'Ignorelist')
	span.setAttribute('class', 'ThreadCommand')
	span.innerHTML = 'Ignore Users '
	bar.appendChild(span)

	var panel = document.createElement('div')
	panel.setAttribute('id', 'IgnorelistPopout')
	panel.setAttribute('class', 'PopoutPanel')
	panel.setAttribute('align', 'left')
	panel.setAttribute('style', 'position: absolute; height: auto; background-color: white; padding: 20px')
	bar.appendChild(panel)

	ftil_checkbox(panel, 'Hide posts', 'ignore')
	ftil_checkbox(panel, 'Hide quoting posts', 'ignore_quotes')
	ftil_checkbox(panel, 'Hide deleted posts', 'ignore_deleted')

	var ltbl = document.createElement('table')
	panel.appendChild(ltbl)

	var ltby = document.createElement('tbody')
	ltby.setAttribute('id', 'ftil_tbody_ignorelist')
	ltbl.appendChild(ltby)

	var tb = document.createElement('input')
	tb.setAttribute('type', 'text')
	tb.setAttribute('placeholder', 'Add user...')
	tb.addEventListener('keydown', function (k) { ftil_add_handler(this, k) })
	panel.appendChild(tb)

	console.log('PopoutMenu.init returns ' +
		window.eval('PopoutMenu.init($("#Ignorelist"), $("#IgnorelistPopout"))'))
}

// Add missing users to the popout
function ftil_list_add_missing(l, n) {
	for (var i = 0; i < l.children.length; i++) {
		if (n.toLowerCase() === l.children[i].lastElementChild.firstElementChild.getAttribute('username').toLowerCase())
			return
	}

	var tr = document.createElement('tr')
	tr.innerHTML = '<td>' + n + '</td><td><a href=javascript:void(0)><img src="/images/minus-button.png"></img></a></td>'
	var rem = tr.lastElementChild.firstElementChild
	rem.setAttribute('username', n)
	rem.addEventListener('click', ftil_ignore_listen)
	l.appendChild(tr)
}

// Update the popout to reflect changes to the ignore list
function ftil_update_popout() {
	if (!ftil_get('insert_menu'))
		return

	var ignorelist = ftil_get('ignorelist')
	var list = document.getElementById('ftil_tbody_ignorelist')

	for (var i = 0; i < ignorelist.length; i++)
		ftil_list_add_missing(list, ignorelist[i])
	for (var i = list.children.length - 1; i >= 0; i--) {
		var child = list.children[i]
		if (ftil_ci_indexof(ignorelist, child.lastElementChild.firstElementChild.getAttribute('username')) === -1)
			child.remove()
	}
}

// Settings page stuff
function ftil_settings_update() {
	var ignorelist = ftil_get('ignorelist')
	var list = document.getElementById('ftil_ignorelist')

	var ents = {}
	for (var i = 0; i < list.children.length; i++) {
		var div = list.children[i]
		var user = div.getElementsByClassName('ftil_remove_btn')[0].getAttribute('username')
		ents[user] = div
	}

	for (var i in ents) {
		if (ftil_ci_indexof(ignorelist, i) === -1)
			ents[i].remove()
	}
	for (var i = 0; i < ignorelist.length; i++) {
		if (ents[ignorelist[i]] === undefined) {
			var tr = document.createElement('tr')
			tr.innerHTML = '<td>' + ignorelist[i] + '</td>\n' +
				'<td><a class="ftil_remove_btn" href="javascript:void(0)">' +
					'<img alt="Remove" src="/images/minus-button.png"></img></a></td>\n'

			var a = tr.getElementsByClassName('ftil_remove_btn')[0]
			a.setAttribute('username', ignorelist[i])
			a.addEventListener('click', ftil_ignore_listen)
			list.appendChild(tr)
		}
	}
}

function ftil_settings_insert() {
	var pc = document.getElementsByClassName('PageContentPanel')[0]
	var div = document.createElement('div')
	div.setAttribute('class', 'MediumLabel Bold EndOfInlineSection')
	div.setAttribute('style', 'margin-top: 10px')
	div.innerHTML = 'Ignored Users'
	pc.appendChild(div)

	div = document.createElement('div')
	div.setAttribute('id', 'ftil_settings')
	div.setAttribute('class', 'BGShadow')
	div.setAttribute('style', 'padding: 10px')
	div.innerHTML = '<div id="ftil_hide_settings"></div>\n' +
		'<table><tbody id="ftil_ignorelist"></tbody></table>\n' +
		'<input id="ftil_adduser" type="text" placeholder="Add user..."></input>\n' +
		'<div id="ftil_adduser_btn" class="FormButton blue">Add</div>\n'
	pc.appendChild(div)

	document.getElementById('ftil_adduser').addEventListener('keydown',
		function (k) { ftil_add_handler(this, k) })
	document.getElementById('ftil_adduser_btn').addEventListener('click',
		function () { ftil_add_handler(document.getElementById('ftil_adduser'), null) })

	var sdiv = document.getElementById('ftil_hide_settings')
	ftil_checkbox(sdiv, 'Hide posts', 'ignore')
	ftil_checkbox(sdiv, 'Hide quoting posts', 'ignore_quotes')
	ftil_checkbox(sdiv, 'Hide deleted posts', 'ignore_deleted')
}

// Mobile stuff
function ftil_m_hide_posts() {
	var ignorelist = ftil_get('ignorelist')
	var ignore = ftil_get('ignore')
	var ignore_quotes = ftil_get('ignore_quotes')
	var ignore_deleted = ftil_get('ignore_deleted')

	var quote_res = []
	if (ftil_get('ignore_quotes')) {
		for (var i in ignorelist)
			quote_res.push(new RegExp('\\b' + ignorelist[i] + ' wrote(</a>)?:?\n*<br>', 'i'))
	}

	var deleted_re = /post deleted/i

	var posts = document.getElementsByClassName('PostContent')
	for (var i = 0; i < posts.length; i++) {
		var pc = posts[i]
		var display = ''

		if (ignore) {
			var wb = pc.getElementsByClassName('WarningBox')[0]
			if ((ftil_ci_indexof(ignorelist, pc.getAttribute('data-username')) !== -1) ||
			    (ignore_deleted && wb !== undefined && deleted_re.test(wb.innerHTML)))
				display = 'none'
			else if (ignore_quotes) {
				for (var j = 0; j < quote_res.length; j++) {
					if (quote_res[j].test(pc.innerHTML)) {
						display = 'none'
						break
					}
				}
			}
		}
		pc.parentElement.style.display = display
	}
}

function ftil_m_add_buttons() {
	var cont = document.getElementsByClassName('container-fluid')[0]

	var menus = cont.getElementsByClassName('dropdown-menu')
	for (var i = 0; i < menus.length; i++) {
		var li = document.createElement('li')
		var user = menus[i].getElementsByTagName('b')[0].innerHTML
		li.innerHTML = '<a href="javascript:void(0)" tabindex="-1" role="menuitem">'
		li.setAttribute('role', 'presentation')
		li.setAttribute('username', user)
		li.setAttribute('class', 'ftil_ignore_btn')

		var a = li.getElementsByTagName('a')[0]
		a.setAttribute('username', user)
		a.addEventListener('click', ftil_ignore_listen)
		var j
		for (j = 0; j < menus[i].children.length; j++) {
			if (menus[i].children[j].innerHTML.match('Report'))
				break
		}
		//menus[i].insertBefore(li, menus[i].children[7])
		menus[i].insertBefore(li, menus[i].children[j])
	}

	// TODO Menuize?
	var body = document.getElementsByClassName('body-content')[0]
	ftil_checkbox(body, 'Hide posts', 'ignore')
	ftil_checkbox(body, 'Hide quoting posts', 'ignore_quotes')
	ftil_checkbox(body, 'Hide deleted posts', 'ignore_deleted')
}

function ftil_m_update_buttons() {
	var btns = document.getElementsByClassName('ftil_ignore_btn')
	var ignorelist = ftil_get('ignorelist')
	for (var i = 0; i < btns.length; i++) {
		var user = btns[i].getAttribute('username')
		if (ftil_ci_indexof(ignorelist, user) === -1)
			var text = 'Ignore'
		else
			var text = 'Unignore'
		btns[i].getElementsByTagName('a')[0].innerHTML = 
			'<span class="glyphicon glyphicon-plus red"></span> ' + text + '</a>\n'
	}
}

if (ftil_in_thread()) {
	ftil_hide_posts()
	ftil_add_buttons()
	ftil_update_buttons()
	ftil_add_popout()
	ftil_update_popout()
} else if (ftil_in_mthread()) {
	ftil_m_hide_posts()
	ftil_m_add_buttons()
	ftil_m_update_buttons()
} else if (location.href === "https://www.fasttech.com/forums/settings") {
	ftil_settings_insert()
	ftil_settings_update()
}
console.log('FTIL OUT!')
