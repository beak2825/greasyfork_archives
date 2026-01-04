// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - Tea & Cake
// @description  Custom user interface preferences
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/*
// @noframes
// @run-at       document-start
// @version      5.4
// @downloadURL https://update.greasyfork.org/scripts/454925/7%20Cups%20-%20Tea%20%20Cake.user.js
// @updateURL https://update.greasyfork.org/scripts/454925/7%20Cups%20-%20Tea%20%20Cake.meta.js
// ==/UserScript==
{
	let pref = JSON.parse(localStorage.getItem('tea-and-cake')) || {},
			save = () => {localStorage.setItem('tea-and-cake', JSON.stringify(pref))}

	// style…
	let css = 'span.tc-ding {background: yellow; color: #00a; font-weight: bold; display: inline-block; '
	+ 'padding: 2px 4px; letter-spacing: .5px;}'
	+ '#tc-watch.tc-active {box-shadow: limegreen 0 0 8px 4px;}'
	+ '#tc-watch.tc-active i {font-weight: bold; color: limegreen;}'
	+ 'i.rc-fa {display: none;}'
	+ '.tc-postlink {position: absolute; top: 1.25em; right: 1.25em;}'
	+ 'div.img-profile-m {border-radius: 22.5%;}'

	if (pref.forum && location.pathname.startsWith('/home/')) css += '#popular > div {display: none;}'

	// inject style…
	!(new MutationObserver(function () {
		if (document.body) {
			this.disconnect()
			var s = document.head.appendChild(document.createElement('style'))
			s.id = 'tc-style'
			s.textContent = css
		}
	})).observe(document.documentElement, {childList: true})

	// settings…
	if (location.href.includes('/listener/editAccount.php')) {
		(new MutationObserver(function () {
			if (typeof($) == 'function' && $('h6').length) {
				this.disconnect()
				let pref = JSON.parse(localStorage.getItem('tea-and-cake')) || {},
						save = () => {localStorage.setItem('tea-and-cake', JSON.stringify(pref))},
						h6 = $('h6').filter(function () {return this.textContent == 'Site Preferences'}),
						div = h6.parent()

				div.append('<h6 class="form-section">Tea & Cake Preferences</h6>')
				div.append(`<style>.tc-btn {display: inline-block; width: 22px; height: 22px; border: 1px solid gray; border-radius: 50%; text-align: center;}
				   .tc-btn i {vertical-align: middle;}</style>`)
				div.append(`<img src="https://rarelycharlie.github.io/assets/cake-128.png"
				   style="width: 64px; height: 64px; float: left; margin: 0 1em 1em 0;">
				   <p><i>These preferences autosave.</i><br/>To apply changes, reload any open 7 Cups pages.</p>

				   <div class="d-flex flex-column" style="clear: both;"><label class="custom-control custom-checkbox">
				   <input id="tc-taglist" class="custom-control-input tc-pref" type="checkbox">
				   <span class="custom-control-indicator"></span>
				   <span class="custom-control-description"> Compile taglists
				   <i class="fa-solid fa-info-circle text-muted" data-bs-toggle="popover"
				   data-bs-content="Compile taglists in control threads by pressing the <i class=\'fa-solid fa-tags text-info\'></i> button."
				   aria-label="Compile taglists"></i></span>
				   </label></div>

				   <div class="d-flex flex-column" style="clear: both;"><label class="custom-control custom-checkbox">
				   <input id="tc-forum" class="custom-control-input tc-pref" type="checkbox">
				   <span class="custom-control-indicator"></span>
				   <span class="custom-control-description"> Forum display controls</span>
				   </label></div>

				   <div class="d-flex flex-column"><label class="custom-control custom-checkbox">
				   <input id="tc-watch" class="custom-control-input tc-pref" type="checkbox">
				   <span class="custom-control-indicator"></span>
				   <span class="custom-control-description"> Watch group chats for these trigger words:
				   <i class="fa-solid fa-info-circle text-muted" data-bs-toggle="popover"
				   data-bs-content="Spaced list of words with no punctuation. Activate in group chats using the
				   <span class=\'tc-btn\'><i class=\'far fa-eye\'></i></span> button (top right)."
				   aria-label="Watch group chats for trigger words"></i></span>
				   </label></div>

				   <div class="mb-3">
				   <label for="tc-watchlist" class="sr-only">Watch group chats for trigger words</label>
				   <input id="tc-watchlist" class="form-control tc-pref" value="" type="text">
				   </div>

				   </div>`)

				$('[type=checkbox].tc-pref').each(function () {
					this.checked = pref[this.id.replace('tc-', '')]
					})
				$('[type=text].tc-pref').each(function () {
					this.value = pref[this.id.replace('tc-', '')] || ''
					})

				$('body').on('change', '[type=checkbox].tc-pref', function () {
					pref[this.id.replace('tc-', '')] = this.checked
					save()
					})

				$('body').on('keyup', '[type=text].tc-pref', function () {
					pref[this.id.replace('tc-', '')] = this.value.replace(/\s+/g, ' ').trim()
					save()
					})
				}
			})).observe(document.documentElement, {childList: true})
		}
	else if (location.href.includes('/member/editAccount.php')) {
		(new MutationObserver(function () {
			if (typeof($) == 'function' && $('h4').length) {
				this.disconnect()
				let pref = JSON.parse(localStorage.getItem('tea-and-cake')) || {},
						save = () => {localStorage.setItem('tea-and-cake', JSON.stringify(pref))},
						h4 = $('h4').filter(function () {return this.textContent == 'Site Preferences'})

				h4.next().after(`<h4 class="formDivider">Tea & Cake Preferences</h4><div class="mb-3">
			<style>.tc-btn {display: inline-block; width: 22px; height: 22px; border: 1px solid gray; border-radius: 50%; text-align: center;}
			   .tc-btn i {vertical-align: middle;}</style>

<img src="https://rarelycharlie.github.io/assets/cake-128.png" style="width: 64px; height: 64px; float: left; margin: 0 1em 1em 0;">
<p><i>These preferences autosave.</i><br/>To apply changes, reload any open 7 Cups pages.</p>

<div class="mb-3 row" style="clear: both;">
<label class="control-label col-12 col-md-3" for="tc-taglist">Compile taglists
<i class="fa-solid fa-info-circle text-muted" data-bs-toggle="popover"
   data-bs-content="Compile taglists in control threads by pressing the <i class=\'fa-solid fa-tags text-info\'></i> button."
   aria-label="Compile taglists"></i>
</label>
<div class="col-12 col-md-9 form-wrap">
	<label class="custom-control custom-checkbox">
	<input class="custom-control-input tc-pref" id="tc-taglist" type="checkbox">
	<span class="custom-control-indicator"></span>
	<span class="custom-control-description"></span>
	</label>
	</div></div>

<div class="mb-3 row" style="clear: both;">
<label class="control-label col-12 col-md-3" for="tc-forum">Forum display controls
</label>
<div class="col-12 col-md-9 form-wrap">
	<label class="custom-control custom-checkbox">
	<input class="custom-control-input tc-pref" id="tc-forum" type="checkbox">
	<span class="custom-control-indicator"></span>
	<span class="custom-control-description"></span>
	</label>
	</div></div>

<div class="mb-3 row">
<label class="control-label col-12 col-md-3" for="tc-watch">Watch group chats:
<i class="fa-solid fa-info-circle text-muted" data-bs-toggle="popover"
   data-bs-content="Specify trigger words spaced with no punctuation. Activate in group chats using the
   <span class=\'tc-btn\'><i class=\'far fa-eye\'></i></span> button (top right)."
   aria-label="Watch group chats for trigger words"></i>
</label>
<div class="col-12 col-md-9 form-wrap">
	<label class="custom-control custom-checkbox">
	<input class="custom-control-input tc-pref" id="tc-watch" type="checkbox">
	<span class="custom-control-indicator"></span>
	<span class="custom-control-description"></span>
	</label>
	<input id="tc-watchlist" class="form-control input-large tc-pref" type="text" placeholder="Trigger words">
	</div></div>

</div></div`)

				$('[type=checkbox].tc-pref').each(function () {
					this.checked = pref[this.id.replace('tc-', '')]
				  })
				$('[type=text].tc-pref').each(function () {
					this.value = pref[this.id.replace('tc-', '')] || ''
				  })

				$('body').on('change', '[type=checkbox].tc-pref', function () {
					pref[this.id.replace('tc-', '')] = this.checked
					save()
				  })

				$('body').on('keyup', '[type=text].tc-pref', function () {
					pref[this.id.replace('tc-', '')] = this.value.replace(/\s+/g, ' ').trim()
					save()
				  })
			  }
		  })).observe(document.documentElement, {childList: true})

		}

	// chat…
	if (pref.watch && pref.watchlist && (location.href.includes('/chat/?c=') || location.href.includes('/conversation.php?c='))) {
		let gong = new Audio('https://rarelycharlie.github.io/assets/gong.mp3')

		let marquee = async () => {
			if (marquee.running) return
			marquee.running = true
			var t = document.title + '  '
			for (let i = 0; i < t.length; ++i) {
				document.title = t = t.substring(1) + t[0]
				await new Promise(w => setTimeout(w, 200))
				}
			marquee.running = false
			}

		// tab title…
		!(new MutationObserver(function () {
			if (typeof($) === 'function') {
				this.disconnect()
				var tcp = $.post
				$.post = function (url, data, success, type) {
					if (url === '/connect/getConversation.php') {
						let s = success
						success = function (json) {
							var n = json.conv.otherScreenName
							if (n) document.title = '💬 ' + n + ' - 7 Cups'
							return s(json)
							}
						}
					return tcp.apply(globalThis, arguments)
					}
				}
			})).observe(document.documentElement, {childList: true})

		// watch received messages…
		!(new MutationObserver(function () {
			var rcr = typeof(renderChatRow) == 'function'? renderChatRow : null
			if (rcr) {
				this.disconnect()
				renderChatRow = function (msg, skip, div) {
					if (renderChatRow.tc_watch) {
						let ding = true,
								list = pref.watchlist.toLowerCase().split(' ')
						for (let w of list) {
							if (w == '') continue
							let mm = msg.msgBody.match(new RegExp(w, 'gi'))
							if (mm !== null) {
								for (let w of mm)
									msg.msgBody = msg.msgBody.replace(new RegExp(w, 'g'), '<span class="tc-ding">' + w + '</span>')
								if (ding) {
									ding = false
									gong.play().then(() => {ding = true})
									}
								marquee()
								}
							}
						}
					rcr.call(globalThis, msg, skip, div)
					}
				renderChatRow.tc_watch = false
				}
			})).observe(document.documentElement, {childList: true})

		// watch button in toolbar…
		!(new MutationObserver(function () {
			var a = document.getElementById('actionButtonsChat')
			if (a) {
				this.disconnect()
				let b = a.firstChild? a.insertBefore(document.createElement('div'), a.firstChild) :
				a.appendChild(document.createElement('div'))
				b.className = 'action'
				b.innerHTML = '<div class="pointer" id="tc-watch" ' +
					'data-bs-toggle="tooltip" title="Watch this conversation">' +
					'<i class="far fa-eye"></i></div>'
				b.firstElementChild.addEventListener('click', function () {
					if (this.className.includes('tc-active')) {
						this.className = 'pointer'
						this.setAttribute('title', 'Watch this conversation')
						$(this).tooltip('dispose')
						renderChatRow.tc_watch = false
						}
					else {
						this.className += ' tc-active'
						this.setAttribute('title', 'Watching. Click to stop.')
						$(this).tooltip('dispose')
						renderChatRow.tc_watch = true
						new Notification('Tea & Cake', {
							body: 'notification body',
							image: 'https://rarelycharlie.github.io/assets/cake-128.png',
							actions: []
							})
						}
					})
				}
			})).observe(document.documentElement, {childList: true})
		}

	// taglist…
	let Taglist = {
		admin: [], // admins
		list: [], // the taglist
		owner: '', // current owner
		post: [], // posts to process {id, by, body}

		init () {
			console.log('T&C Taglist')
			$('button[data-thread-subscribe]')
				.after(`<button id="tc-tags" type="button" class="btn btn-link px-2 mb-1 text-info"
				title="Compile the taglist" data-bs-toggle="tooltip"><i class="fa-solid fa-tags"></i>
				</button>`)
			$('#tc-tags').on('click', () => {
				$('#tc-tags').tooltip('disable')
					.prop('disabled', true)
					.blur()
				this.ui()
				this.compile()
				})
			},

		insensitive (a, b) { // case-insensitive comparison
			a = a.toLowerCase(), b = b.toLowerCase()
			return a == b? 0 : (a < b? -1 : 1)
			},

		async compile () {
			// number of pages…
			var base = location.href.replace(/\?.*/, ''),
					p = $('a.page-link', $('ul.pagination').first())
			if (p.length) p = parseInt(/\d+$/.exec(p.last().attr('href'))[0])
			else p = 1

			var progress = document.querySelector('#tc-taglist-progress')
			progress.max = p + 1
			$('h1')[0].scrollIntoView()

			var r = await fetch('https://rarelycharlie.github.io/assets/cake/admin.json')
			if (!r.ok) return this.error('Cannot fetch list of admins')
			this.admin = await r.json()
			this.admin.push(GM_info.script.author)
			progress.value = 1

			var report = {page: 0, post: 0, noop: 0}
			for (let n = 1; n <= p; ++n) {
				await this.read(base, n, report)
				++progress.value
				}
			this.post.sort((a, b) => parseInt(a.id) - parseInt(b.id))
			this.owner = this.post[0].by
			for (let post of this.post) this.obey(post, report)
			if (this.list.length) {
				$('#tc-taglist-list').text('@' + this.list.join(' @'))
				$('#tc-taglist-copy, #tc-taglist-search').prop('disabled', false)
				}
			else
				$('#tc-taglist-list').css('color', '#777').text('The list is empty')
			$('#tc-taglist-n').text(this.list.length)
			$('#tc-taglist-owner').html(`<a href="/@${this.owner}">@${this.owner}</a>`)
			console.log('+++ report:', report)
			this.error(`Pages read: ${report.page}, posts found: ${report.post}, not valid: ${report.noop}`, true)
			},

		copy () { // copy to clipboard…
			$('#tc-taglist-copy').blur().tooltip('disable')
			var t = $('#tc-taglist-list')[0]
			if (document.body.createTextRange) {
				let r = document.body.createTextRange()
				r.moveToElementText(t)
				r.select()
				}
			else if (window.getSelection) {
				let s = window.getSelection()
				let r = document.createRange()
				r.selectNodeContents(t)
				s.removeAllRanges()
				s.addRange(r)
				}

			var ok = document.execCommand('copy')
			if (ok) setTimeout(function () {
				if (document.selection) document.selection.empty()
				else if (window.getSelection) window.getSelection().removeAllRanges()
				}, 500)
			},

		error (msg, report) {
			var t = $('#tc-taglist-error')
			t.text(msg)
			if (report) t.css('color', 'gray')
			},

		obey (post, report) { // do the thing the post wants {id, by, body}
			var n0 = this.list.length
			for (let r in this.op) {
				let op = this.op[r]
				let m = post.body.match(op.when)
				if (m === null) continue
				if (op.admin) {
					if (!this.admin.includes(post.by) && post.by != this.owner) continue
					}

				let tag = m[0].match(/@[\w._]+/ig)
				if (!tag) tag = [post.by]
				if (tag) tag = tag.map(t => t.replace(/[^A-Za-z0-9._]/g, ''))

				op.how.call(Taglist, tag)
				}
			if (this.list.length == n0) {
				++report.noop
				console.log(`noop: ${post.id} ${post.body}`)
				}
			},

		op: { // operations...
			clear: {
				when: new RegExp('please\\s+remove\\s+everyone', 'ig'),
				admin: true,
				how: function () {
					this.list = []
					}
				},

			removeme: {
				when: new RegExp('please\\s+remove\\s+me', 'ig'),
				admin: false,
				how: function (tag) {
					this.list = this.list.filter(u => u.toLowerCase() != tag[0].toLowerCase())
					}
				},

			addme: {
				when: new RegExp('please\\s+add\\s+me', 'ig'),
				admin: false,
				how: function (tag) {
					this.list.push(tag[0])
					this.list = Array.from(new Set(this.list))
					this.list.sort(this.insensitive)
					}
				},

			add: {
				when: new RegExp('please\\s+add(\\s*@[A-Za-z0-9\'._]+)+', 'ig'),
				admin: true,
				how: function (tag) {
					this.list = this.list.concat(tag)
					this.list = Array.from(new Set(this.list))
					this.list.sort(this.insensitive)
					}
				},

			remove: {
				when: new RegExp('please\\s+remove(\\s+@[A-Za-z0-9._]+)+', 'ig'),
				admin: true,
				how: function (tag) {
					tag = tag.map(u => u.toLowerCase())
					this.list = this.list.filter(u => !tag.includes(u.toLowerCase()))
					}
				},

			owner: {
				when: new RegExp('new\\sowner(\\s+@\\w+)|please\\s+transfer\\s+this\\s+taglist\\s+to(\\s+@\\w+)', 'ig'),
				admin: true,
				how: function (tag) {
					this.owner = tag[0]
					}
				}
			},

		async read (base, pagenum, report) { // fetch a page and extract its posts
			var r = await fetch(base + '?p=' + pagenum)
			if (!r.ok) return this.error('Can\'t read forum page')
			++report.page
			r = await r.text()
			var pp = $('div[id^=forum-post-]', $(r))
			if (pagenum > 1) pp = pp.slice(1) // ignore top post except on 1st page
			report.post += pp.length
			pp.each(function () {
				var p = $(this)
				var data = {
					id: p.attr('id').replace(/\D/g, ''),
					by: $('a[data-usercard]', p).attr('data-usercard'),
					body: $('div[data-id=post-body]', p).html()
					.replace(/\s/g, ' ')
					.replace(/"/g, '')
					.replace(/&nbsp;/g, ' ')
					.replace(/<[^>]+>/g, ' ')
					.replace(/\s+/g, ' ')
					.replace(/[^ @A-Za-z0-9]/g, '')
					.trim()
					}
				if (data.by) Taglist.post.push(data)
				})
			},

		ui () {
			$('h1').first().after(
`<style>span.found {background: #5df;}</style>
<div id="tc-taglist" class="card mb-3" style="width: 100%; min-height: 12em; padding: 1em; box-shadow: #0002 0 0 12px 2px;">
<div id="tc-taglist-x" style="position: absolute; top: .5ex; right: 1ex;" title="Close" data-bs-toggle="tooltip">
<i class="fa-solid fa-lg fa-xmark"></i></div>
<div id="tc-taglist-list" style="border: 1px solid #777; padding: 1ex; width: 100%; min-height: 3em; margin: 1em 0;">
Compiling…
<progress id="tc-taglist-progress" max="0" value="0" style="display: block; width: 100%;"></progress>
</div>
<p style="margin-bottom: 1ex;">
<button id="tc-taglist-copy" disabled class="btn btn-sm btn-outline-primary me-4" style="border-radius: 8px;" data-bs-toggle="tooltip" title="Copy to clipboard">Copy</button>
Tags: <span id="tc-taglist-n" style="display: inline-block; margin-right: 2em;">—</span>
Owner: <span id="tc-taglist-owner">—</span>
<span style="float: right;">
<span style="position: relative; left: 1.4em;">@</span>
<input id="tc-taglist-search" disabled title="Search for a tag" data-bs-toggle="tooltip" style="color: gray; width: 12em; padding: 2px 1em;" spellcheck=false>
<i class="fa-solid fa-magnifying-glass"></i></span></p>
<div>
<p id="tc-taglist-error" style="color: #a00; margin: 1em 0 0 0;">&nbsp;</p>
</div>
</div>`)

			$('#tc-taglist-x').on('click', function () {
				$('#tc-taglist-x').tooltip('dispose')
				$('#tc-taglist').hide(400, function () {$(this).remove()})
				$('#tc-tags').prop('disabled', false).tooltip('enable')
				})

			$('#tc-taglist-copy').on('click', function () {
				Taglist.copy()
				})

			$('#tc-taglist-search').on('keyup', function () {
				var list = $('#tc-taglist-list'),
						t = list.text(),
						v = event.target.value.replace(/\s.*/, '')
				if (v) t = t.replace(new RegExp('@(' + v + ')', 'ig'), '<span class="found">@$1</span>')
				list.html(t)
				})

			}
		}

	if (pref.taglist && location.href.includes('/forum/')) addEventListener('DOMContentLoaded', function () {
			if (/\btag\s?list\b/i.test($('h1').first().text())) Taglist.init()
		})

	// sticky forum controls…
	if (pref.forum && location.pathname.startsWith('/home/')) addEventListener('DOMContentLoaded', () => {
		// expand button…
		$('#forum-thread-tabs, #community-content-tabs')[pref.expanded? 'addClass' : 'removeClass']('view-expanded')

		$('#forum-thread-tabs-expand, #community-content-tabs-expand').attr('data-bs-toggle', 'tooltip')
			.tooltip()
			.css('border-radius', '2px')

		var fix = () => { // fix the button…
			var tabs = $('#community-content-tabs').length? 'community-content' : 'forum-thread',
				exp = $(`#${tabs}-tabs`).hasClass('view-expanded')
			$(`#${tabs}-tabs-expand`)
				.attr('title', exp? 'Collapse threads' : 'Expand threads')
				.tooltip('dispose')
				.tooltip()
			$(`#${tabs}-tabs-expand > i`)
				.addClass(exp? 'fa-list' : 'fa-th-list')
				.removeClass(exp? 'fa-th-list' : 'fa-list')
			pref.expanded = exp
			save()
			}
		fix()

		$('body').on('click', '#forum-thread-tabs-expand, #community-content-tabs-expand', fix)

		// page title…
		let com = location.pathname.replace(/\/home\/|\/$/g, '')
		if (com) $('h5').first().after(`<h6 style="font-style: italic;"><span id="tc-comorder"></span><span id="tc-comtopic"></span></h6>`)

		// order…
		$('body').on('click', 'a.nav-link-threadlist, a[data-forumsort]', function () {
			setTimeout(() => $('#tc-comorder').text($('[data-id=data-forumsort-selected]').text().trim()), 0)
			location.hash = pref.order = $(this).attr('href')
			save()
			})

		let ord = location.hash || pref.order || '#popular'
		setTimeout(() => {
			$('#popular > div').show()
			if (location.pathname == '/home/') {
				let a = $(`a.nav-link-threadlist[href="${ord}"]`)[0]
				if (a) a.click()
				}
			else $(`a[data-forumsort][href="${ord}"]`).click()
			$('#tc-comorder').text($('[data-id=data-forumsort-selected]').text().trim())
			}, 0)

		// topic…
		$('body').on('click', '[data-thread-filter-forumid]', function () {
			var active = $(this).hasClass('active')
			$('#tc-comtopic').text(active? '' : ': ' + $(this).text())
			if (!pref.topic) pref.topic = {}
			pref.topic[com] = active? '' : $(this).attr('data-thread-filter-forumid')
			save()
			})

		if (pref.topic && pref.topic[com] && !location.search.includes('topic='))
			setTimeout(() => {$(`[data-thread-filter-forumid=${pref.topic[com]}]`)[0].click()}, 0)

		})

	// topic search…
		if (location.pathname == '/home/') !(new MutationObserver(function () {
		var c = document.getElementById('community-tag-list')
		if (c) {
			this.disconnect()
			$('div', c).append(`<div class="list-group-item d-flex align-items-center px-2 py-1 fw-semibold">
			<img src="https://rarelycharlie.github.io/assets/cake/search.png" class="me-2" style="width:30px;"
				title="Topic search" data-bs-toggle="tooltip">
			<input id="tc-topic-search" spellcheck="false" placeholder="Topic">
			</div>`)
		}
	})).observe(document.documentElement, {childList: true})

	if (location.pathname == '/home/') addEventListener('DOMContentLoaded', async function () {
		var r = await fetch('https://rarelycharlie.github.io/assets/cake/topic.json')
		data = await r.json()

		// filters…
		if (!eventDetails.isListener) for (let com of ['interns', 'listenerjourney', 'qlp']) data[com] = []
		if (eventDetails.age == 'adult' && !eventDetails.teenMentor) {
			data.teens = []
			data.projectsandevents = data.projectsandevents.filter(d => !d.startsWith('1766'))
			}

		// UI…
		var h5p = $('h5').first().parent()
		h5p.parent().prepend(`<style>#tc-topic-hits p {margin: 1ex 0 0 0;} #tc-topic-hits a {display: block; margin: .5ex 0 0 1em;}</style>
		<div id="tc-topic-results" class="card card-body border" style="padding: 1em; display: none;">
		<h5 class="fw-semibold d-flex m-0">Topic search results</h5>
		<div id="tc-topic-hits" style="height: 100%; overflow-x: hidden; overflow-y: auto; line-height: 1.15em;"></div>
		</div>`)
		var results = $('#tc-topic-results'), hits = $('#tc-topic-hits')
		results.height($('#community-tag-list').height() - 32)

		var search = () => {
			var k = $('#tc-topic-search').val().toLowerCase().trim()
			if (k.length < 3) return

			var hit = [], head = ''
			for (let com in data) {
				for (let v of data[com]) {
					let t = $(`a[href="/home/${com}/"]`).first().text(),
							id = v.split(':')[0],
							d = v.replace(id + ':', '')

					if (v.toLowerCase().includes(k)) {
						let h = t == head? '' :`<p class="fw-semibold">${t}</p>`
						h += `<a href="/home/${com}/?topic=${id}">${d}</a>`
						hit.push(h)
						head = t
						}
					}
				}
			hits.html('')
			if (hit.length == 0) hits.append('<p class="text-muted"><i>No topic found</i></p>')
			else hits.append(hit.join(''))
			}

		var was = null
		$('body').on('focus', '#tc-topic-search', function () {
			$('#community-tag-list .active').removeClass('active')
			$(this).parent().addClass('active')
			h5p.removeClass('d-block').hide()
			results.show()
			})

		$('body').on('focus', 'a[data-community-filter-tag]', function () {
			$('#tc-topic-search').parent().removeClass('active')
			results.hide()
			h5p.addClass('d-block').show()
			})

		var wait = 0
		$('#tc-topic-search').on('keyup', function () {
			if (wait) clearTimeout(wait)
			wait = setTimeout(search, 600)
			})

		$('#tc-topic-search').parent().on('click', function () {
			$('#tc-topic-search').focus()
			})

		})

	if (/\/home\/[a-z0-9]+\//.test(location.href) && location.search.startsWith('?topic=')) {
		addEventListener('DOMContentLoaded', function () {
			var topic = location.search.replace('?topic=', '')
			setTimeout(() => $(`li[data-thread-filter-forumid=${topic}]`).first().click(), 0)
			})
		}

	// add post links...
	addEventListener('DOMContentLoaded', () => {
		var url = $('link[rel=canonical').attr('href')
		if (url) url = url.replace(/\?.*$/, '')
		$('div[id^=forum-post-]').each(function (i) {
			var post = i == 0? '' : '?post=' + this.id.replace(/[^0-9]/g, ''),
					thing = i == 0? 'thread' : 'post'
			if (i == 0) $(this).css('position', 'relative')
			$(this).prepend(`<a href="${url + post}"><i data-bs-toggle="tooltip" title="Link to this ${thing}" class="fa-solid fa-link tc-postlink"></i></a>`)
			})
		})

	}