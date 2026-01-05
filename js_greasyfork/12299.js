// ==UserScript==
// @name        Steam - track games with card drops remaining
// @description When visiting your badges page, this script lets you know when there are changes to your experience or to which games have card drops remaining or are eligible for booster pack drops.
// @namespace   http://userscripts.org/users/274735
// @include     http://steamcommunity.com/id/barefoot-monkey/badges
// @include     http://steamcommunity.com/id/barefoot-monkey/badges/
// @include     https://steamcommunity.com/id/barefoot-monkey/badges
// @include     https://steamcommunity.com/id/barefoot-monkey/badges/
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/12299/Steam%20-%20track%20games%20with%20card%20drops%20remaining.user.js
// @updateURL https://update.greasyfork.org/scripts/12299/Steam%20-%20track%20games%20with%20card%20drops%20remaining.meta.js
// ==/UserScript==

//var storage_key = 'games with card drops' // TODO remove this data

var timestamp = Date.now()
var steam_id
var info = {
	last_updated: undefined,
	xp: 0,
	drops_remaining: {},
	eligible_for_booster: {}
}
var any_changes = false


// prepare for output
var message_area = document.createElement('div')
{
	var xp_block = document.querySelector('.profile_xp_block')

	message_area.setAttribute('class', 'track-badges-page-output')
	xp_block.appendChild(message_area)

	var style = document.createElement('style')
	style.textContent = ".profile_xp_block {"
	+ "overflow: hidden;"
	+"}"
	+".track-badges-page-output {"
	+ "overflow: hidden;"
	+"}"
	+".track-badges-page-output ul {"
	+ "margin: 0;"
	+ "overflow: hidden;"
	+"}"
	+".track-badges-page-output p {"
	+ "margin-bottom: 1px;"
	+ "cursor: pointer;"
  	+ "-webkit-user-select: none;"
  	+ "-moz-user-select: none;"
  	+ "-ms-user-select: none;"
  	+ "user-select: none;"
  	+"}"
	+".track-badges-page-output p.bad {"
	+ "color:#AA4A4A;"
	+"}"
	+".track-badges-page-output p.good {"
	+ "color:#4AAA4A;"
	+"}"
	document.head.appendChild(style)
}
function message(text, list, options)
{
	var p = document.createElement('p')
	if (options != null) {
		if (options.class != null) p.setAttribute('class', options.class)
	}
	p.textContent = text
	message_area.appendChild(p)
	
	if (options && options['is a change'] !== false) any_changes = true

	if (Array.isArray(list)) {

		p.addEventListener('click', function(event) { 
			if (event.target.nextElementSibling.nodeName == 'UL') {
				event.target.nextElementSibling.style.height = (event.target.nextElementSibling.style.height == '0px') ? 'auto' : '0px' }
		})

		var l = document.createElement('ul')
		for (var i in list) {
			var title = list[i]
			var item = document.createElement('li')
			item.textContent = title
			l.appendChild(item)
		}
		message_area.insertBefore(l, p.nextSibling)
	}
}

try {


// find steam id
// TODO handle accounts without steam id - /profiles/.*/badges
// seems like .badge_details_set_favorite exists only on own account
{
	let m = window.location.pathname.match(/\/id\/([^/]*)\/badges(?:\/.*)?/)
	if (m && m.length > 1) steam_id = m[1]
	else {
		console.log("Steam ID not found; aborting")
		return
	}
}


// check to ensure that this is our own account
{
	if (document.querySelector('.profile_xp_block_right') == null) {
		return
	}
}


// retrieve info from storage
{
	var info_text = GM_getValue(steam_id)
	if (info_text) info = JSON.parse(info_text)
}


// find XP
var old_xp = info.xp
{
	var e = document.querySelector('.profile_xp_block_xp')
	if (e == null) {
		console.log("XP could not be found; aborting")
		return
	}

	info.xp = Number.parseInt(e.textContent.replace(',', '').match(/XP ([0-9]*)/)[1])
}


// update timestamp
info.last_updated = timestamp

// save old collection xp
var old_collection_xp = info.collection_xp

// check for additional pages
var remaining_pages = 1
{
	var pager = document.querySelector('.profile_paging')
	if (pager) {
		var pages = pager.querySelectorAll('.pageLinks>a.pagelink')
		for (var i = 0; i < pages.length; i += 1) {
			var pagelink = pages[i]

			remaining_pages += 1
			var request = new XMLHttpRequest()
			request.open("get", pagelink.href)
			request.onload = function() {
				scan_page(this.response)
			}
			request.responseType = "document"
			request.send()
		}
	}
}

scan_page(document)
} catch (exception) { console.log(exception) }



function check_for_missing_games() {
	// check for missing games
	{
		for (var i in info.drops_remaining) {
			if (info.drops_remaining.hasOwnProperty(i)) {
				var game = info.drops_remaining[i]
				if (game.missing_since === undefined && game.last_seen != timestamp) {
					game.missing_since = timestamp
				}
			}
		}
	}
}


function check_booster_pack_eligibility() {
	// query games eligible for booster packs
	GM_xmlhttpRequest({
		method: 'GET',
		url: "http://steamcommunity.com/id/"+steam_id+"/ajaxgetboostereligibility/",
		onload: function(response) {
			if (response.responseText.search('<div class="booster_eligibility_results">') >= 0) {

				var regex = /<a class="whiteLink" href="http:\/\/steamcommunity.com\/my\/gamecards\/(.*?)">(.*?)<\/a>/g
				var match

				while ((match = regex.exec(response.responseText)) !== null) {
					var title = match[2]
					var appid = match[1]

					var game = info.eligible_for_booster[appid]
					if (game === undefined) {
						game = {
							title: title,
							first_seen: timestamp,
							last_seen: timestamp
						}
						info.eligible_for_booster[appid] = game
					} else {
						game.last_seen = timestamp

						// TODO track title changes

						if (game.missing_since !== undefined) delete game.missing_since
					}
				}

				// check for missing games
				{
					for (var i in info.eligible_for_booster) {
						if (info.eligible_for_booster.hasOwnProperty(i)) {
							var game = info.eligible_for_booster[i]
							if (game.missing_since === undefined && game.last_seen != timestamp) {
								game.missing_since = timestamp
							}
						}
					}
				}
			} else message("WARNING: Your list of games eligible for booster pack drops could not be accessed at this time.")

			display_changes()
			save_changes()
		},
		onerror: function() {
			message("WARNING: Your list of games eligible for booster pack drops could not be accessed at this time.")
			display_changes()

			// TODO avoid marking games eligible as "missing" if the current list cannot be retrieved
		}
	})
}


function scan_page(document) {

	// find new collection XP
	{
		var a = document.querySelector('a.badge_row_overlay[href$="/badges/13"]')
		if (a) {
			var div = a.parentNode.querySelector('.badge_info_title+div')
			info.collection_xp = Number.parseInt(div.textContent.replace(',', '').match(/([0-9]+) XP/)[1])
		}
	}
	
	// scan page for games with card drops remaining
	var rows = document.querySelectorAll('.badge_row_inner')
	for (var i = 0; i < rows.length; i += 1) {
		var row = rows[i]
		var progress = row.querySelector('.progress_info_bold')

		if (progress && null !== progress.textContent.match(/[0-9]+ card drops? remain/)) {
			var a = row.querySelector('.badge_title_playgame a[href^="steam://run/"]')
			var appid = a.href.match(/[0-9]*$/)[0]
			var title_element = row.querySelector('.badge_title')
			var title = title_element.childNodes[0].data.trim()

			var game = info.drops_remaining[appid]
			if (game === undefined) {
				game = {
					title: title,
					first_seen: timestamp,
					last_seen: timestamp
				}
				info.drops_remaining[appid] = game
			} else {
				game.last_seen = timestamp

				// TODO track title changes

				if (game.missing_since !== undefined) delete game.missing_since
			}
		}
	}

	remaining_pages -= 1
	if (remaining_pages == 0) {
		check_for_missing_games()
		check_booster_pack_eligibility()
	}
}

function display_changes() {

	var num_drops = 0, num_eligible = 0
	var remove = null

	// display drops games found/missing
	var found = [], missing = [], already_missing = []
	for (appid in info.drops_remaining) {
		if (info.drops_remaining.hasOwnProperty(appid)) {
			var game = info.drops_remaining[appid]

			if (timestamp == game.last_seen) num_drops += 1

			if (timestamp == game.first_seen) found.push(game.title)
			else if (game.missing_since !== undefined) {
				var eligible = info.eligible_for_booster[appid]
				if (eligible === undefined) {
					if (timestamp == game.missing_since) missing.push(game.title)
					else { 
						console.log(appid, game)
						remove = appid
						already_missing.push(game.title)
					}
				}
			}
		}
	}

	if (found.length > 0) message("Discovered games with card drops remaining", found, {'class':'good'})
	if (missing.length > 0) message("No more card drops remaining for:", missing, {'class':'bad'})
	if (already_missing.length > 0) message("Games with card drops already missing", already_missing, {'is a change': false})

	// display eligible games found/missing
	var eligible_found = [], eligible_missing = [], eligible_already_missing = []
	for (appid in info.eligible_for_booster) {
		if (info.eligible_for_booster.hasOwnProperty(appid)) {
			var game = info.eligible_for_booster[appid]

			if (timestamp == game.last_seen) num_eligible += 1

			if (timestamp == game.first_seen) eligible_found.push(game.title)
			else if (game.missing_since !== undefined) {
				if (timestamp == game.missing_since) eligible_missing.push(game.title)
				else eligible_already_missing.push(game.title)
			}
		}
	}
	if (eligible_found.length > 0) message("Games now eligible for booster packs", eligible_found, {'class':'good'})
	if (eligible_missing.length > 0) message("Games no longer eligible for booster packs", eligible_missing, {'class':'bad'})
	if (eligible_already_missing.length > 0) message("Games already missing from booster pack eligibility", eligible_already_missing)

	// display change in collection XP
	{
		if (info.collection_xp > old_collection_xp) {
			message("XP from your collection badge increased by " + (info.collection_xp - old_collection_xp) + ", from " + old_collection_xp + " to " + info.collection_xp, null, {'class':'good'})
		} else if (info.collection_xp < old_collection_xp) {
			message("XP from your collection badge decreased by " + (old_collection_xp - info.collection_xp) + ", from " + old_collection_xp + " to " + info.collection_xp, null, {'class':'bad'})
		}
	}

	// display change in XP
	{
		if (info.xp > old_xp) {
			message("Your XP increased by " + (info.xp - old_xp) + ", from " + old_xp + " to " + info.xp, null, {'class':'good'})
		} else if (info.xp < old_xp) {
			message("Your XP decreased by " + (old_xp - info.xp) + ", from " + old_xp + " to " + info.xp, null, {'class':'bad'})
		}
	}

	//message("Games with card drops remaining: " + num_drops)
	//message("Games eligible for booster packs: " + num_eligible)

	if (!any_changes) message("No changes since your previous visit")
}

function save_changes() {
	GM_setValue(steam_id, JSON.stringify(info))
}
