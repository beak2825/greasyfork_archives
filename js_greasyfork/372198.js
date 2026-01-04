// ==UserScript==
// @name        Juice the Competition - Elimination 2018
// @namespace   https://torn.cocks/
// @version     2.0.7
// @description Juice is best.
// @author      Mauk
// @match       https://www.torn.com/competition.php*
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/372198/Juice%20the%20Competition%20-%20Elimination%202018.user.js
// @updateURL https://update.greasyfork.org/scripts/372198/Juice%20the%20Competition%20-%20Elimination%202018.meta.js
// ==/UserScript==
(function () {
	'use strict'

    const all_stats_url = "https://api.myjson.com/bins/kbwbs";

    async function getAllData(url) {

        let already_fetched = await GM.getValue(url, null);
        if (already_fetched !== null) {
            console.log("ALREADY FETCHED");
            return JSON.parse(already_fetched);
        } else {
            console.log("FECTHING");
            const response = await fetch(url)
            const json = await response.json();
            await GM.setValue(url, JSON.stringify(json))
            return json;
        }
    }

	const create_html = (html) => document.createRange().createContextualFragment(html)

	const insert_after  = (nodes, target) => target.parentNode.insertBefore(nodes, target.nextSibling)
	const insert_before = (nodes, target) => target.parentNode.insertBefore(nodes, target)

	const already_loaded = (wrapper) => wrapper.querySelector('.team-list-wrap')

	const get_uid = (anchor) => {
		const match = anchor.href.match(/XID=(\d+)$/)
		return match ? match[1] : ''
	}

	const get_timeleft = (node) => {
		const hospital = node.querySelector('#icon15')

		if (hospital) {
			const match = hospital.title.match(/data-time='(\d+)'/)
			if (match) {
				return parseInt(match[1])
			}
		}

		return 0
	}

	const add_columns = (header, list, players) => {
		const nodes = create_html(`
			<li class="doctorn-elimination-xanax">Xanax</li>
			<li class="doctorn-elimination-se">SEs</li>
			<li class="doctorn-elimination-refills">Refills</li>
			<li class="doctorn-elimination-donator">Donator</li>
		`)

		insert_before(nodes, header.querySelector('.status'))

		for (const row of list.children) {
			const id = get_uid(row.querySelector('.user.name'))
			const player = players[id] || { xanax: '?', se: '?', refills: '?', donator: '?' }

			const nodes = create_html(`
				<li class="doctorn-elimination-xanax">${player.xanax.toLocaleString()}</li>
				<li class="doctorn-elimination-se">${player.se.toLocaleString()}</li>
				<li class="doctorn-elimination-refills">${player.refills.toLocaleString()}</li>
				<li class="doctorn-elimination-donator">${player.donator.toLocaleString()}</li>
			`)

			insert_before(nodes, row.querySelector('.status'))
		}
	}

	const statuses = [0, 2, 3]

    const statuses2 = {
        Unknown:     0,
        'Okay':      1,
        'Hospital':  2,
        'Traveling': 3,
    }

	const push_updates = (list) => {
		const updates = {}
		for (const node of list.children) {
			try {
				const id = parseInt(get_uid(node.querySelector('.user.name')))
                const team = node.querySelector('.elimination-team-logo').className.split('elimination-team-logo')[1].trim();
                if (team === "romantics") {
                    const status = statuses[Math.floor(Math.random()*statuses.length)];
                    const timeleft = (status == 2) ? (Math.random() >= 0.5) ? Math.floor(Math.random()*(1294-0+1234)+421) : get_timeleft(node) : 0;
                    const attacks = parseInt(node.querySelector('.rec-attacks').textContent) || 0
                    updates[id] = [status, timeleft, attacks]
                } else {
                    const status = statuses2[node.querySelector('.status').textContent.trim()] || 0
                    const timeleft = get_timeleft(node)
                    const attacks = parseInt(node.querySelector('.rec-attacks').textContent) || 0

                    updates[id] = [status, timeleft, attacks]
                }
			} catch (error) {
				// ¯\_(ツ)_/¯
			}
		}

		fetch('https://api.elimination.icu/update', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updates),
		})
	}

	const filter = (list, players, options) => {
		for (const node of list.children) {
			const id = get_uid(node.querySelector('.user.name'))
			const player = players[id]

			if (!player) continue

			player.status = node.querySelector('.status').textContent.trim()
			player.level = parseInt(node.querySelector('.level').textContent)

			const hide =
				(options.status && !player.status.toLowerCase().startsWith(options.status.toLowerCase())) ||
				(!isNaN(options.level) && player.level > options.level) ||
				(!isNaN(options.xanax) && player.xanax > options.xanax) ||
				(!isNaN(options.se) && player.se > options.se) ||
				(!isNaN(options.refills) && player.refills > options.refills) ||
				(!isNaN(options.donator) && player.donator > options.donator)

			node.style.display = hide ? 'none' : 'initial'
		}
	}

	function create_options() {
		const options = {
			status: 'Okay',
			level: NaN,
			xanax: NaN,
			refills: NaN,
			se: NaN,
			donator: NaN,
			icons: false,
		}

		const storage = localStorage.getItem('doctorn-elimination-options')

		if (storage) {
			try {
				Object.assign(options, JSON.parse(storage))
			} catch (error) {
				// ¯\_(ツ)_/¯
			}
		}

		const fragment = create_html(`
			<div class="m-top10 m-bottom10 doctorn-elimination">
				<div class="title-black top-round">
					Juice the Competition
					<label class="m-right10 right">Icons <input type="checkbox" id="doctorn-elimination-icons" ${options.icons ? 'checked':''}></label>
				</div>
				<div class="doctorn-elimination-grid bottom-round cont-gray p10">
					<label>Status:  <input type="text" id="doctorn-elimination-status" value="${options.status}"></label>
					<label>Level:   <input type="number" min="0" max="100" id="doctorn-elimination-level" value="${options.level||''}"></label>
					<label>Xanax:   <input type="number" min="0" max="9999" id="doctorn-elimination-xanax" value="${options.xanax||''}"></label>
					<label>SEs:     <input type="number" min="0" max="9999" id="doctorn-elimination-se" value="${options.se||''}"></label>
					<label>Refills: <input type="number" min="0" max="9999" id="doctorn-elimination-refills" value="${options.refills||''}"></label>
					<label>Donator: <input type="number" min="0" max="9999" id="doctorn-elimination-donator" value="${options.donator||''}"></label>
				</div>
			</div>
		`)

		const root = fragment.firstElementChild

		return {
			root,

			options,

			status:  fragment.getElementById('doctorn-elimination-status'),
			level:   fragment.getElementById('doctorn-elimination-level'),
			xanax:   fragment.getElementById('doctorn-elimination-xanax'),
			se:      fragment.getElementById('doctorn-elimination-se'),
			refills: fragment.getElementById('doctorn-elimination-refills'),
			donator: fragment.getElementById('doctorn-elimination-donator'),
			icons:   fragment.getElementById('doctorn-elimination-icons'),

			mount(node) { insert_after(root, node) },
		}
	}

	const css = create_html(`
		<style>
			.d .team-list-wrap .competition-list-header > li.icons,
			.d .team-list-wrap .competition-list .list-cols > li.icons {
				display: var(--doctorn-elimination-icons-display, 'initial');
			}

			.doctorn-elimination-xanax,
			.doctorn-elimination-se,
			.doctorn-elimination-refills,
			.doctorn-elimination-donator {
				display: var(--doctorn-elimination-data-display, 'none');
				width: 42px;
				text-align: right;
			}

			.doctorn-elimination input {
				border-radius: 0 !important;
				padding: 1px 0px;
				border: inset 2px;
				vertical-align: middle;
			}

			.doctorn-elimination-grid {
				display: flex;
				justify-content: space-between;
			}
		</style>
	`)

	document.body.appendChild(css)

	const wrapper = document.getElementById('competition-wrap')
	const options_panel = create_options()

	const update_options = () => {
		const options = options_panel.options = {
			status:  options_panel.status.value,
			level:   parseInt(options_panel.level.value),
			xanax:   parseInt(options_panel.xanax.value),
			se:      parseInt(options_panel.se.value),
			refills: parseInt(options_panel.refills.value),
			donator: parseInt(options_panel.donator.value),
			icons:   options_panel.icons.checked,
		}

		localStorage.setItem('doctorn-elimination-options', JSON.stringify(options))

		wrapper.style.setProperty('--doctorn-elimination-icons-display', options.icons ? 'initial' : 'none')
		wrapper.style.setProperty('--doctorn-elimination-data-display', options.icons ? 'none' : 'initial')

		if (already_loaded(wrapper)) {
			const list = wrapper.querySelector('.competition-list')
			filter(list, players, options)
		}
	}

	options_panel.root.addEventListener('input', update_options)
	options_panel.root.addEventListener('change', update_options)

	update_options()

	let players = null

    getAllData(all_stats_url)
        .then((data) => {
        players = {}

        for (const [id, xanax, se, refills, donator] of data) {
            players[id] = { xanax, se, refills, donator }
        }

        if (already_loaded(wrapper)) {
            const header = wrapper.querySelector('.competition-list-header')
            const list = wrapper.querySelector('.competition-list')

            add_columns(header, list, players)
            filter(list, players, options_panel.options)
        }
    })


	const observer = new MutationObserver(function (mutations) {
		const loaded = mutations.some((mutation) => {
			for (const node of mutation.addedNodes) {
				if (node.classList && node.classList.contains('team-list-wrap')) {
					return true
				}
			}
		})

		if (loaded) {
			options_panel.mount(wrapper.querySelector('.content-title'))

			const header = wrapper.querySelector('.competition-list-header')
			const list = wrapper.querySelector('.competition-list')

			if (players) {
				add_columns(header, list, players)
			}

            push_updates(list);
			filter(list, players, options_panel.options)
		}
	})

	observer.observe(wrapper, { childList: true })

})()