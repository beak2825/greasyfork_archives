// ==UserScript==
// @name        FT Ignorelist
// @namespace   ftignorelist
// @description An ignorelist for Fasttech forums
// @include     https://www.fasttech.com/forums/*
// @version     1.1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/14099/FT%20Ignorelist.user.js
// @updateURL https://update.greasyfork.org/scripts/14099/FT%20Ignorelist.meta.js
// ==/UserScript==

// There's no compelling reason to enable this.
var use_localstorage = false

var default_settings = {
	'ignore': true,         // Hide posts from users on the ignore list
	'ignore_quotes': false, // Hide posts that quote users on the ignore list
	'insert_menu': true,    // Add a menu to the forum toolbar
	'ignorelist': [],       // The acutal ignore list
}

// Settings wrappers that automatically default missing values
function ftil_get(name, def) {
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

// Case-insensitive indexOf
function ftil_ci_indexof(a, n) {
	for (var i = 0; i < a.length; i++) {
		if (a[i].toLowerCase() === n.toLowerCase())
			return i
	}
	return -1
}

// GM Menu entries
function ftil_toggle_ignoring() {
	ftil_set('ignore', !ftil_get('ignore'))
	ftil_hide_posts()
}
GM_registerMenuCommand('FTIL: toggle ignoring', ftil_toggle_ignoring)

function ftil_toggle_quote_ignoring() {
	ftil_set('ignore_quotes', !ftil_get('ignore_quotes'))
	ftil_hide_posts()
}
GM_registerMenuCommand('FTIL: toggle quote ignoring', ftil_toggle_quote_ignoring)

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
GM_registerMenuCommand('FTIL: toggle menu', ftil_toggle_menu)

// Event handler for toggling ignored state of a user
function ftil_toggle_ignore_user() {
	var user = this.getAttribute('username')
	var ignorelist = ftil_get('ignorelist')

	var idx = ftil_ci_indexof(ignorelist, user)
	if (idx === -1)
		ignorelist.push(user)
	else
		ignorelist.splice(idx, 1)

	ftil_set('ignorelist', ignorelist)
	ftil_hide_posts()
	ftil_update_buttons()
	ftil_update_popout()
}

// Hide/unhide posts as the ignore list changes
function ftil_hide_posts() {
	var ignorelist = ftil_get('ignorelist')
	var ignore = ftil_get('ignore')
	var ignore_quotes = ftil_get('ignore_quotes')

	var quote_res = []
	if (ftil_get('ignore_quotes')) {
		for (var i in ignorelist)
			quote_res.push(new RegExp('\\b' + ignorelist[i] + ' wrote(</a>)?:?\n*<br>', 'i'))
	}

	var posts = document.getElementsByClassName('ForumThread')[0].getElementsByClassName('PostContent')
	for (var i = 0; i < posts.length; i++) {
		var display = ''
		var post = posts[i]
		if (ignore) {
			for (var j = 0; j < ignorelist.length; j++) {
				if (ignorelist[j].toLowerCase() === post.getAttribute('data-username').toLowerCase() ||
						(ignore_quotes && quote_res[j].test(post.innerHTML))) {
					display = 'none'
					break
				}
			}
		}

		var top_elem = post.parentElement.parentElement.parentElement
		top_elem.previousElementSibling.style.display = display
		top_elem.style.display = display
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
		new_a.addEventListener('click', ftil_toggle_ignore_user)
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
	ftil_hide_posts()
}

function ftil_add_listen(k) {
	if (k.which !== 13)
			return true

	var user = this.value
	var ignorelist = ftil_get('ignorelist')
	if (user !== '' && ftil_ci_indexof(ignorelist, user) === -1) {
		ignorelist.push(user)
			ftil_set('ignorelist', ignorelist)
			ftil_hide_posts()
			ftil_update_buttons()
			ftil_update_popout()
	}

	this.value = ''

	k.stopPropagation()
	k.preventDefault()
	return false
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
// FIXME: this is just horrible
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

	var ltbl = document.createElement('table')
	panel.appendChild(ltbl)

	var ltby = document.createElement('tbody')
	ltby.setAttribute('id', 'ftil_tbody_ignorelist')
	ltbl.appendChild(ltby)

	var tb = document.createElement('input')
	tb.setAttribute('type', 'text')
	tb.setAttribute('placeholder', 'Add user...')
	tb.addEventListener('keydown', ftil_add_listen)
	panel.appendChild(tb)

	window.eval('PopoutMenu.init($("#Ignorelist"), $("#IgnorelistPopout"))')
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
	rem.addEventListener('click', ftil_toggle_ignore_user)
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

ftil_hide_posts()
ftil_add_buttons()
ftil_update_buttons()
ftil_add_popout()
ftil_update_popout()
