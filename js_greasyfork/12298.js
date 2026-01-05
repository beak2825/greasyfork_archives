// ==UserScript==
// @name        Steam - track games
// @description When visiting your games list on the Steam website, this script looks at your games and alerts you when games are added, removed or renamed.
// @namespace   http://userscripts.org/users/274735
// @match       http://steamcommunity.com/id/*/games?tab=all
// @match       http://steamcommunity.com/id/*/games/?tab=all
// @match       https://steamcommunity.com/id/*/games?tab=all
// @match       https://steamcommunity.com/id/*/games/?tab=all
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/12298/Steam%20-%20track%20games.user.js
// @updateURL https://update.greasyfork.org/scripts/12298/Steam%20-%20track%20games.meta.js
// ==/UserScript==
var path_matches = window.location.pathname.match(/^\/+id\/([^\/]+)\/games\/?$/)
var all_games = /^\?(?:[^&]\&)*tab=all(?:\&.*)?$/.test(window.location.search)
if (path_matches && path_matches.length > 1 && all_games) {
	var logged_in_username_e = document.querySelector('.user_avatar>.playerAvatar>a')
	var viewing_username_e = document.querySelector('.profile_small_header_text>.profile_small_header_name>a')

	if (logged_in_username_e && viewing_username_e) {
		var re = /^(?:https?:)?\/\/steamcommunity.com\/id\/([^\/?]+)$/
		var logged_in_matches = logged_in_username_e.href.match(re)
		var viewing_matches = viewing_username_e.href.match(re)

		if (logged_in_matches && logged_in_matches.length > 1 && viewing_matches && viewing_matches.length > 1) {
			var logged_in_id = logged_in_matches[1]
			var viewing_id = viewing_matches[1]

			if (logged_in_id == viewing_id) {
				get_steam_games()

				setTimeout(track_collection.bind(null, viewing_id), 1)
			} else console.log("not your profile")

		}
	}
}

function get_steam_games() {
	try {
		var script_element = document.createElement("script");
		script_element.textContent = 'window.GM_steam_track_games_vars = {games:rgGames, steam_id: g_steamID}'
		document.body.appendChild(script_element)
	} catch (e) {
		console.log("Exception", e.toString())
	}
}

function track_collection(logged_in_id) {
	var storage_key = 'steam collections'

	var steam_id = logged_in_id
	var steam_apps = unsafeWindow.GM_steam_track_games_vars.games

	var now = Date.now().valueOf()
	var collections, collection
	var lookup = {}
	var num_already_missing = 0
	var num_rediscovered = 0
	var num_missing = 0
	var num_present = 0
	var num_discovered = 0
	var num_renamed = 0
	var rediscovered_games = []
	var present_games = []
	var discovered_games = []
	var renamed_games = []
	var missing_games = []
	var already_missing_games = []


	// retrieve stored collection
	var collection_string
	{
		var collections_string = GM_getValue(storage_key, "{}")
		collections = JSON.parse(collections_string)	

		collection = collections[steam_id]

		if (collection === undefined) {
			collection = []
			collections[steam_id] = collection
		}

		collection_string = JSON.stringify(collection)
	}

	// build a lookup table
	for (i in collection) {
		lookup[collection[i].appid] = i
	}


	// run through current game list
	for (var j = 0; j < steam_apps.length; j += 1) {
		var app = steam_apps[j]

		// look up the index from known apps
		var i = lookup[app.appid]
		
		// add or update record
		if (i === undefined) {
			var new_app = {
				first_seen: now,
				last_seen: now,
				title: app.name,
				appid: app.appid
			}
			collection.push(new_app)
			num_present += 1
			num_discovered += 1
			present_games.push(app.name)
			discovered_games.push(app.name)
		} else {
			var old_app = collection[i]

			if (old_app.first_missing) {
				rediscovered_games.push([old_app.title, app.name])
				num_rediscovered += 1
			}

			if (old_app.title != app.name) {
				if (!Array.isArray(old_app.old_names)) old_app.old_names = []
				old_app.old_names.push(old_app.title)
				renamed_games.push([old_app.title, app.name])
				num_renamed += 1
				old_app.title = app.name
			}
			old_app.last_seen = now
			old_app.first_missing = undefined
			num_present += 1
			present_games.push(app.name)
		}
	}


	// check for missing games
	for (i in collection) {
		var app = collection[i]
		if (app.first_missing !== undefined) {
			num_already_missing += 1
			already_missing_games.push(app)
		}
		else if (app.last_seen != now) {
			app.first_missing = now
			missing_games.push(app.title)
			num_missing += 1
		}
	}


	// store collection
	GM_setValue(storage_key, JSON.stringify(collections))

	// create area for display
	var mainContents = document.querySelector('#mainContents')
	var output_e = document.createElement('div')
	output_e.setAttribute('class', 'steam-track-games-output')
	mainContents.parentNode.insertBefore(output_e, mainContents)

	function create_element(tag, parent, text, class_name) {
		var element = document.createElement(tag)
		if (class_name) element.setAttribute('class', class_name)
		if (text) element.appendChild(document.createTextNode(text))
		if (parent) parent.appendChild(element)
		return element
	}

	// insert stylesheet
	create_element('style', document.head, 
		".steam-track-games-output {"
		+	"margin-bottom: 1em;"
		+"}"
		+".steam-track-games-output h1 {"
		+	"font-size: 14px;"
		+	"border-bottom: 1px solid rgb(65, 123, 156);"
		+"}"
		+".steam-track-games-output ul {"
		+	"margin: 0.5em 0 0.5em;"
		+"}"
		+".steam-track-games-output p {"
		+	"margin: 1em 0 0.5em;"
		+"}"
		+".steam-track-games-new, .steam-track-games-new+ul>li {"
		+	"color: #08B308;"
		+"}"
		+".steam-track-games-missing, .steam-track-games-missing+ul>li {"
		+	"color: #B30808;"
		+"}"
		+".steam-track-games-renamed, .steam-track-games-output b {"
		+	"color: #B38708;"
		+"}"
		+".steam-track-games-forget {"
		+	"cursor: pointer;"
		+"}"
		+".steam-track-games-forget:hover {"
		+	"text-decoration: underline;"
		+"}"
		+".steam-track-games-output p.steam-track-games-forget, .steam-track-games-output p.steam-track-games-forgotten {"
		+	"text-align: right;"
		+	"max-width: 936px;"
		+	"margin: 0.5em 0;"
		+"}"
	)
	
	// display stats
	create_element('h1', output_e, 'Steam - Track Games')
	create_element('p', output_e, 'Scan complete. '+((num_present == 1) ? "1 app" : (num_present + " apps"))+" currently present in your account.")

try {
	if (num_discovered == 0 && num_missing == 0 && num_renamed == 0) create_element('p', output_e, 'No changes since the previous scan.')
	else {
		if (num_discovered > 0) {
			create_element('p', output_e, 1==num_discovered ? "1 new game discovered" : num_discovered + " new games discovered", 'steam-track-games-new')
			var list = create_element('ul')
			for (var i in discovered_games) {
				create_element('li', list, discovered_games[i])
			}
			output_e.appendChild(list)
		}
		if (num_missing > 0) {
			create_element('p', output_e, 1==num_missing ? "1 game no longer present" : num_missing + " games no longer present", 'steam-track-games-missing')
			var list = create_element('ul')
			for (var i in missing_games) {
				create_element('li', list, missing_games[i])
			}
			output_e.appendChild(list)
		}
		if (num_renamed > 0) {
			create_element('p', output_e, 1==num_missing ? "1 game renamed" : num_renamed + " games renamed", 'steam-track-games-renamed')
			var list = create_element('ul')
			for (var i in renamed_games) {
				var li = create_element('li', list, renamed_games[i][0] + ' ➟ ')
				create_element('b', li, renamed_games[i][1])
			}
			output_e.appendChild(list)
		}

		var p = document.createElement('p')
		p.setAttribute('class', 'steam-track-games-forget')
		p.appendChild(document.createTextNode("click here to forget these changes"))
		output_e.appendChild(p)
		p.addEventListener('click', function(event) {
			var p = document.createElement('p')
			p.setAttribute('class', 'steam-track-games-forgotten')
			p.appendChild(document.createTextNode("The above changes have been forgotten."))
			output_e.appendChild(p)
			output_e.removeChild(event.target)
			collections[steam_id] = JSON.parse(collection_string)
			GM_setValue(storage_key, JSON.stringify(collections))
		})
	}
}catch (exception) {console.log(exception)}

	unsafeWindow.missing =JSON.stringify(already_missing_games)

}
