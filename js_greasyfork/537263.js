// ==UserScript==
// @name         Nitro Type - Admin Panel
// @version      0.2.1
// @description  Always displays the selected car, hue and trail on the race track.
// @author       Toonidy
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @match        *://*.nitrotype.com/garage
// @match        *://*.nitrotype.com/garage/customizer
// @match        *://*.nitrotype.com/garage/customizer/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @grant        GM_getResourceURL
// @resource     icon_tab https://i.ibb.co/28Ts3Xd/key-icon.png#sha512=3b8723fb0a6f220c9fa03ea38d9a600df2efe9dc38217b0be4a71132d12457edd6344c7c12370e5a451ea6199fb39a06dabc94c7c8c9782c1c4584b6e5d04a53
// @require      https://greasyfork.org/scripts/443718-nitro-type-userscript-utils/code/Nitro%20Type%20Userscript%20Utils.js?version=1042360
// @require      https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.2/dexie.min.js#sha512-/Aa8vGWIh0EnOTIVN/ZWTS3UqyJJDhWYtIPS/IqtaaSG0VA6hC6CSvtWdh2+T72q74+2l1RFgu+ig91LGLX57A==
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/537263/Nitro%20Type%20-%20Admin%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/537263/Nitro%20Type%20-%20Admin%20Panel.meta.js
// ==/UserScript==

/* global NTGLOBALS findReact createLogger Dexie */

const logging = createLogger("Nitro Type Admin Panel")

// Config storage
const db = new Dexie("NTAdminPanel")
db.version(1).stores({
	savedCar: "userID",
})
db.open().catch(function (e) {
	logging.error("Init")("Failed to open up the config database", e)
})

let currentUser = null
try {
	currentUser = JSON.parse(JSON.parse(localStorage.getItem("persist:nt")).user)
	if (!currentUser.loggedIn) {
		logging.error("Init")("Custom Car is only available for logged in users.")
		return
	}
} catch (err) {
	logging.error("Init")("Failed to identify current logged in user")
	return
}

db.savedCar.get(currentUser.userID).then(main)

////////////
//  Main  //
////////////

function main(config) {
	///////////////////////
	//  Customizer Page  //
	///////////////////////

	if (window.location.pathname === "/garage/customizer" || window.location.pathname.startsWith("/garage/customizer/")) {
		const container = document.querySelector("#root main.structure-content div.customizer"),
			reactObj = container ? findReact(container) : null
		if (!container || !reactObj) {
			logging.error("Init")("Unable to find customizer container")
			return
		}

		const RARITY_VALUES = {
			common: 1,
			uncommon: 2,
			rare: 3,
			epic: 4,
			legendary: 5,
		}

		const tabContainer = container.querySelector(".customizer--tabs.nav-list"),
			titleHeading = container.querySelector(".customizer--about--title"),
			previewer = container.querySelector(".customizer--previewer"),
			previewerCanvas = previewer.querySelector("canvas")
		if (!tabContainer || !titleHeading) {
			logging.error("Init")("Unable to modify tab navigation")
			return
		}

		/* Styles */
		const style = document.createElement("style")
		style.appendChild(
			document.createTextNode(`
.section-nt-admin-panel .customizer--previewer {
    right: 714px;
    bottom: 230px;
}
.section-nt-admin-panel.nt-admin-panel-unset .customizer--previewer {
    right: 580px;
    bottom: 230px;
}
.nt-admin-panel-label.customizer--preview {
    left: 10px;
    right: 715px;
    top: 285px;
    bottom: 230px;
}
.nt-admin-panel-label.customizer--preview .customizer--vehicle-selection--name {
    font-size: 16px;
}
.nt-admin-panel-label.customizer--preview .customizer--vehicle-selection--rarity {
    padding-bottom: 0;
}
.nt-admin-panel-no-cars {
    position: absolute;
    top: 90px;
    left: 10px;
    right: 580px;
    bottom: 230px;
    display: none;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    background-color: #202020;
    font-size: 18px;
    font-weight: 600;
    text-shadow: 0 2px 3px rgb(0 0 0 / 50%);
    color: #fff;
    z-index: 2;
}
.nt-admin-panel-unset .nt-admin-panel-no-cars {
    display: flex;
}
.nt-admin-panel-scrollable {
    overflow-y: scroll;
    scrollbar-face-color: #1C99F4;
    scrollbar-track-color: #232633;
}
.nt-admin-panel-scrollable::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
.nt-admin-panel-scrollable::-webkit-scrollbar-thumb {
    background-color: #1C99F4;
}
.nt-admin-panel-scrollable::-webkit-scrollbar-track {
    background-color: #232633;
}
.section-nt-admin-panel .customizer--item-selector-controls {
    grid-template-columns: 1fr 210px;
}
.customizer--item-selector.nt-admin-panel-car-selector {
    width: 560px;
}
.customizer--item-selector.nt-admin-panel-car-selector .customizer--item-selector-items {
    grid-template-columns: repeat(4, 1fr);
}
.customizer--item-selector.nt-admin-panel-trail-selector {
    top: 380px;
    left: 10px;
}
.customizer--item-selector.nt-admin-panel-paint-selector {
    top: 90px;
    bottom: 230px;
    left: 320px;
    width: 125px;
}
.customizer--item-selector.nt-admin-panel-paint-selector .nt-admin-panel-paint-selector-heading {
    display: flex;
    align-items: center;
    column-gap: 10px;
    height: 35px;
    padding: 0 10px;
    margin-bottom: 5px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background-color: #282b3a;
    color: #eee;
    font-weight: bold;
    font-size: 13px;
}
.customizer--item-selector.nt-admin-panel-paint-selector .nt-admin-panel-paint-selector-heading .nt-admin-panel-paint-selector-heading-icon,
.customizer--item-selector.nt-admin-panel-paint-selector .nt-admin-panel-paint-selector-heading .nt-admin-panel-paint-selector-heading-icon svg{
    width: 20px;
    height: 20px;
}
.customizer--item-selector.nt-admin-panel-paint-selector .nt-admin-panel-paint-selector-heading .nt-admin-panel-paint-selector-heading-icon svg {
    fill: #ccc;
}
.customizer--item-selector.nt-admin-panel-paint-selector .nt-admin-panel-paint-selector-heading .nt-admin-panel-paint-selector-heading-label {
    flex-grow: 1;
    color: #ccc;
}
.customizer--item-selector.nt-admin-panel-paint-selector .nt-admin-panel-scrollable {
    position: absolute;
    left: 0;
    top: 40px;
    right: 0;
    bottom: 0;
}
.customizer--item-selector.nt-admin-panel-paint-selector .customizer--item-selector-items {
    grid-template-columns: 1fr;
    grid-gap: 5px;
    margin: 0 5px 5px;
}
.nt-admin-panel-unset .customizer--item-selector.nt-admin-panel-paint-selector {
    display: none;
}
.nt-admin-panel-paint-selector .paint-select-preview {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: auto 40px;
}`),
		)
		document.head.appendChild(style)

		const saveConfig = (carID, hue, trailID) => {
			config = {
				userID: currentUser.userID,
				car: carID || null,
				hue: hue || 0,
				trail: trailID || null,
			}
			db.savedCar.put(config)
		}

		const setCar = (carID, hue, trailID) => {
			const carData = reactObj.props.getCarMetaData(carID),
				isAnimated = carData.isAnimated,
				trailData = trailID ? NTGLOBALS.LOOT.find((l) => l.lootID === trailID && l.type === "trail")?.assetKey : undefined
			reactObj.previewer.setCar({
				type: isAnimated ? carData.assetKey : carID,
				hue,
				isAnimated,
				trail: trailData,
				tweaks: carData.tweaks,
			})

			// TODO: Sound N/A, will have to figure out how to trigger manually
		}

		/* Car Paint Worker */
		const CarPainter = ((reactObj) => {
			// Source: https://www.nitrotype.com/dist/site/js/cu.js
			/* eslint-disable */
			function carHueShiftWorkerScript() {
				this.onmessage = function (e) {
					for (var t = e.data, r = t.pixels, n = t.hue, a = t.id, o = r.length, i = 0; i < o; i += 4) {
						var l,
							s,
							c = r[i] / 255,
							u = r[i + 1] / 255,
							f = r[i + 2] / 255,
							d = Math.min(c, u, f),
							p = Math.max(c, u, f),
							m = p - d,
							h = 0
						;(h = 0 === m ? 0 : p === c ? ((u - f) / m) % 6 : p === u ? (f - c) / m + 2 : (c - u) / m + 4),
							(h = Math.round(60 * h)),
							(h += n) < 0 && (h += 360),
							(h %= 360),
							(s = (p + d) / 2),
							(l = 0 === m ? 0 : m / (1 - Math.abs(2 * s - 1)))
						var v = (1 - Math.abs(2 * s - 1)) * l,
							b = v * (1 - Math.abs(((h / 60) % 2) - 1)),
							g = s - v / 2
						0 <= h && h < 60
							? ((c = v), (u = b), (f = 0))
							: 60 <= h && h < 120
							? ((c = b), (u = v), (f = 0))
							: 120 <= h && h < 180
							? ((c = 0), (u = v), (f = b))
							: 180 <= h && h < 240
							? ((c = 0), (u = b), (f = v))
							: 240 <= h && h < 300
							? ((c = b), (u = 0), (f = v))
							: 300 <= h && h < 360 && ((c = v), (u = 0), (f = b)),
							(r[i] = Math.round(255 * (c + g))),
							(r[i + 1] = Math.round(255 * (u + g))),
							(r[i + 2] = Math.round(255 * (f + g)))
					}
					this.postMessage(
						{
							id: a,
							updated: r,
						},
						[r.buffer],
					)
				}
			}
			/* eslint-enable */

			let carPaintRequestIndex = 0,
				completed = {},
				pending = {},
				onCarPaintCreated = null

			const carHueShiftWorker = (() => {
				try {
					const data = carHueShiftWorkerScript
							.toString()
							.replace(/^[^{]*{\s*/, "")
							.replace(/\s*}[^}]*$/, ""),
						scriptBlobData = new Blob([data], { type: "text/javascript" }),
						scriptBlobURL = URL.createObjectURL(scriptBlobData)
					return new Worker(scriptBlobURL)
				} catch (e) {
					logging.error("Init")("Failed to setup worker")
				}
			})(carHueShiftWorkerScript)

			carHueShiftWorker.onmessage = (e) => {
				const { id, updated } = e.data,
					{ canvas, ctx, width, height } = pending[id],
					newImgData = ctx.createImageData(width, height)

				delete pending[id]
				newImgData.data.set(updated)
				ctx.putImageData(newImgData, 0, 0)

				completed[id] = canvas.toDataURL()

				if (onCarPaintCreated) {
					onCarPaintCreated(id, completed[id])
				}
			}

			const performHueShift = (carImg, hue) => {
				const renderCanvas = document.createElement("canvas"),
					ctx = renderCanvas.getContext("2d"),
					{ width, height } = carImg

				renderCanvas.width = width
				renderCanvas.height = height
				ctx.drawImage(carImg, 0, 0)

				const imgData = ctx.getImageData(0, 0, width, height)

				pending[hue] = {
					id: hue,
					width,
					height,
					canvas: renderCanvas,
					ctx,
				}

				carHueShiftWorker.postMessage(
					{
						id: hue,
						hue,
						pixels: imgData.data,
					},
					[imgData.data.buffer],
				)
			}

			return {
				generateSampleCarPaints: (carID) => {
					const carImgSrc = reactObj.props.getCarUrl(carID, false, 0)
					if (!carImgSrc) {
						return
					}

					const carImgNode = document.createElement("img")
					carImgNode.addEventListener("load", () => {
						pending = {}
						completed = {}
						for (let hue = 0; hue <= 340; hue += 10) {
							performHueShift(carImgNode, hue)
						}
					})
					carImgNode.src = carImgSrc
				},
				setCarPaintCreatedHandler: (fn) => {
					onCarPaintCreated = fn
				},
			}
		})(reactObj)

		/* Sort Handlers */
		const sortAlphaHandler = (reverse) => {
			return (a, b) => (reverse ? b.data.name.localeCompare(a.data.name) : a.data.name.localeCompare(b.data.name))
		}
		const sortRarityHandler = (reverse) => {
			return (a, b) => {
				const rarityA = RARITY_VALUES[a.data.options?.rarity] || 0,
					rarityB = RARITY_VALUES[b.data.options?.rarity] || 0
				if (rarityA === rarityB) {
					return 0
				}
				if (reverse) {
					return rarityA < rarityB ? -1 : 1
				}
				return rarityA > rarityB ? -1 : 1
			}
		}
		const sortIDHandler = (idKey, reverse) => {
			return (a, b) => {
				if (a.data[idKey] === b.data[idKey]) {
					return 0
				}
				if (reverse) {
					return a.data[idKey] < b.data[idKey] ? 1 : -1
				}
				return a.data[idKey] > b.data[idKey] ? 1 : -1
			}
		}

		/* Selected Car Label */
		const selectedCarLabel = document.createElement("div")
		selectedCarLabel.className = "nt-admin-panel-label customizer--preview vehicle-preview"
		selectedCarLabel.innerHTML = `
            <div class="customizer--vehicle-selection">
                <div class="customizer--vehicle-selection--name"></div>
                <div class="customizer--vehicle-selection--rarity">
                    <div class="rarity-badge rarity-badge--small">
                        <div class="rarity-badge--extra"></div>
                        <div class="rarity-badge--content"></div>
                    </div>
                </div>
                <div class="customizer--vehicle-selection--equipped">Currently Equipped</div>
            </div>`

		const carLabel = selectedCarLabel.querySelector(".customizer--vehicle-selection--name"),
			rarityBadge = selectedCarLabel.querySelector(".customizer--vehicle-selection--rarity .rarity-badge"),
			rarityLabel = selectedCarLabel.querySelector(".customizer--vehicle-selection--rarity .rarity-badge--content")

		const updateCarLabel = (c) => {
			carLabel.textContent = c.name
			if (c.options?.rarity) {
				rarityBadge.className = `rarity-badge rarity-badge--small  rarity-badge--${c.options.rarity}`
				rarityLabel.textContent = `${c.options.rarity[0].toUpperCase() + c.options.rarity.substr(1)} Car`
			}
		}

		/* Selector UI */
		const selectItemTemplate = document.createElement("div")
		selectItemTemplate.className = "customizer--item-selector-item"
		selectItemTemplate.innerHTML = `
            <div class="customizer--item-selector-item--labels">
                <div class="customizer--item-selector-item--equipped">Equipped</div>
            </div>
            <div class="customizer--item-selector-item--controls">
                <div class="customizer--item-selector-item--favorite">Favorite</div>
                <div class="customizer--item-selector-item--hide">Hide</div>
            </div>
            <div class="customizer--item-selector-item--content">
                <div class="rarity-frame rarity-frame--small">
                    <div class="rarity-frame--extra"></div>
                    <div class="rarity-frame--content">
                        <div class="customizer--item-selector-item--container">
                            <div>
                                <div class="customizer--item-selector-item--vehicle"></div>
                                <div class="customizer--tooltip"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`

		/* Custom Car Selector UI */
		const customCarUI = document.createElement("div")
		customCarUI.className = "nt-admin-panel-car-selector customizer--item-selector vehicle-selector show-search scrollable"
		customCarUI.innerHTML = `
            <div class="customizer--item-selector-controls">
                <div class="customizer--item-selector-controls--filter">
                    <input type="filter" class="input-field customizer--item-selector-controls--filter-input" placeholder="Search" value="">
                    <button class="customizer--item-selector-controls--filter-clear">×</button>
                </div>
                <div class="customizer--item-selector-controls--sort">
                    <div class="customizer--item-selector-controls--sort-label">Sort By</div>
                    <select class="input-select customizer--item-selector-controls--sort-options">
                        <option value="rarity_commons">Rarity: Least Rarest</option>
                        <option value="rarity_rarests">Rarity: Most Rarest</option>
                        <option value="name_a-z" selected>Name: A - Z</option>
                        <option value="name_z-a">Name: Z - A</option>
                        <option value="id_asc">ID: Ascending</option>
                        <option value="id_desc">ID: Descending</option>
                    </select>
                </div>
            </div>
            <div class="customizer--item-selector-container nt-admin-panel-scrollable">
                <div class="customizer--item-selector-items"></div>
            </div>`

		const customCarSelectorContainer = customCarUI.querySelector(".customizer--item-selector-items")

		const customCarNoPreview = document.createElement("div")
		customCarNoPreview.className = "nt-admin-panel-no-cars"
		customCarNoPreview.textContent = "Choose your Custom Car"
		if (!config?.car) {
			container.classList.add("nt-admin-panel-unset")
		}

		const noCarItem = document.createElement("div")
		noCarItem.className = " customizer--item-selector-item"
		noCarItem.innerHTML = `
            <div class="customizer--item-selector-item--labels">
                <div class="customizer--item-selector-item--equipped">Equipped</div>
            </div>
            <div class="customizer--item-selector-item--content">
                <div class="customizer--item-selector-item--container">
                    <div>
                        <div class="customizer--item-selector-item--remove">No Car</div>
                        <div class="customizer--tooltip">Remove Car</div>
                    </div>
                </div>
            </div>`
		noCarItem.addEventListener("pointerup", () => {
			if (!config?.car) {
				return
			}
			container.classList.add("nt-admin-panel-unset")
			saveConfig(null, config?.hue, config?.trail)
			customCarSelectorContainer.querySelectorAll(".is-equipped").forEach((node) => node.classList.remove("is-equipped"))
			noCarItem.classList.add("is-equipped")
			selectedCarLabel.remove()
		})
		if (!config?.car) {
			noCarItem.classList.add("is-equipped")
		} else {
			noCarItem.classList.remove("is-equipped")
		}

		const carSelectItems = NTGLOBALS.CARS.map((c) => {
			const item = selectItemTemplate.cloneNode(true)
			item.querySelector(".rarity-frame").classList.add(`rarity-frame--${c.options?.rarity}`)
			item.querySelector(".customizer--tooltip").textContent = c.name
			item.querySelector(".customizer--item-selector-item--vehicle").style.backgroundImage = `url(/cars/${c.options?.smallSrc})`
			item.addEventListener("pointerup", () => {
				if (c.id === config?.car) {
					return
				}
				container.classList.remove("nt-admin-panel-unset")
				setCar(c.id, config?.hue, config?.trail)
				saveConfig(c.id, config?.hue, config?.trail)
				CarPainter.generateSampleCarPaints(config.car)
				customCarSelectorContainer.querySelectorAll(".is-equipped").forEach((node) => node.classList.remove("is-equipped"))
				item.classList.add("is-equipped")
				container.querySelector(".customizer--preview").after(selectedCarLabel)
				updateCarLabel(c)
			})
			if (c.id === config?.car) {
				item.classList.add("is-equipped")
			}
			return { data: c, node: item }
		})

		const populateList = (search, sortBy) => {
			if (sortBy === "name_a-z") {
				carSelectItems.sort(sortAlphaHandler(false))
			} else if (sortBy === "name_z-a") {
				carSelectItems.sort(sortAlphaHandler(true))
			} else if (sortBy === "rarity_rarests") {
				carSelectItems.sort(sortRarityHandler(false))
			} else if (sortBy === "rarity_commons") {
				carSelectItems.sort(sortRarityHandler(true))
			} else if (sortBy === "id_asc") {
				carSelectItems.sort(sortIDHandler("id", false))
			} else if (sortBy === "id_desc") {
				carSelectItems.sort(sortIDHandler("id", true))
			}
			const carSelectorFragment = document.createDocumentFragment()
			carSelectorFragment.append(noCarItem)
			carSelectItems.forEach((c) => {
				if (search && c.data.name.toLowerCase().indexOf(search.toLowerCase()) === -1) {
					return
				}
				carSelectorFragment.append(c.node)
			})
			while (customCarSelectorContainer.firstChild !== null) {
				customCarSelectorContainer.removeChild(customCarSelectorContainer.firstChild)
			}
			customCarSelectorContainer.append(carSelectorFragment)
		}

		const customCarSortBy = customCarUI.querySelector(".input-select.customizer--item-selector-controls--sort-options"),
			customCarSearch = customCarUI.querySelector(".input-field.customizer--item-selector-controls--filter-input"),
			customCarSearchClear = customCarUI.querySelector(".customizer--item-selector-controls--filter-clear")

		customCarSearch.placeholder = "Search Car"

		const customCarApplyFilters = (e) => {
			populateList(customCarSearch.value, customCarSortBy.value)
		}

		customCarSortBy.addEventListener("change", customCarApplyFilters)
		customCarSearch.addEventListener("keyup", customCarApplyFilters)
		customCarSearchClear.addEventListener("click", () => {
			customCarSearch.value = ""
			populateList(customCarSearch.value, customCarSortBy.value)
		})

		/* Custom Car Trail Selector UI */
		const customTrailUI = customCarUI.cloneNode(true)
		customTrailUI.className = "nt-admin-panel-trail-selector customizer--item-selector vehicle-selector show-search scrollable"

		const customTrailSelectorContainer = customTrailUI.querySelector(".customizer--item-selector-items")

		const noTrailItem = noCarItem.cloneNode(true)
		noTrailItem.querySelector(".customizer--item-selector-item--remove").textContent = "No Trail"
		noTrailItem.querySelector(".customizer--tooltip").textContent = "Remove Trail"
		noTrailItem.addEventListener("pointerup", () => {
			if (!config?.trail) {
				return
			}
			if (config?.car) {
				setCar(config.car, config?.hue, null)
			}
			saveConfig(config?.car, config?.hue, null)
			customTrailSelectorContainer.querySelectorAll(".is-equipped").forEach((node) => node.classList.remove("is-equipped"))
			noTrailItem.classList.add("is-equipped")
		})
		if (!config?.trail) {
			noTrailItem.classList.add("is-equipped")
		} else {
			noTrailItem.classList.remove("is-equipped")
		}

		const trailSelectItems = NTGLOBALS.LOOT.filter((l) => l.type === "trail").map((t) => {
			const item = selectItemTemplate.cloneNode(true)
			item.querySelector(".rarity-frame").classList.add(`rarity-frame--${t.options?.rarity}`)
			item.querySelector(".customizer--tooltip").textContent = t.name
			item.querySelector(".customizer--item-selector-item--vehicle").style.backgroundImage = `url(${t.options?.src})`
			item.addEventListener("pointerup", () => {
				if (t.lootID === config?.trail) {
					return
				}
				if (config?.car) {
					setCar(config.car, config?.hue, t.lootID)
				}
				saveConfig(config?.car, config?.hue, t.lootID)
				customTrailSelectorContainer.querySelectorAll(".is-equipped").forEach((node) => node.classList.remove("is-equipped"))
				item.classList.add("is-equipped")
			})
			if (t.lootID === config?.trail) {
				item.classList.add("is-equipped")
			}
			return { data: t, node: item }
		})

		const populateTrailList = (search, sortBy) => {
			if (sortBy === "name_a-z") {
				trailSelectItems.sort(sortAlphaHandler(false))
			} else if (sortBy === "name_z-a") {
				trailSelectItems.sort(sortAlphaHandler(true))
			} else if (sortBy === "rarity_rarests") {
				trailSelectItems.sort(sortRarityHandler(false))
			} else if (sortBy === "rarity_commons") {
				trailSelectItems.sort(sortRarityHandler(true))
			} else if (sortBy === "id_asc") {
				trailSelectItems.sort(sortIDHandler("lootID", false))
			} else if (sortBy === "id_desc") {
				trailSelectItems.sort(sortIDHandler("lootID", true))
			}
			const trailSelectorFragment = document.createDocumentFragment()
			trailSelectorFragment.append(noTrailItem)
			trailSelectItems.forEach((t) => {
				if (search && t.data.name.toLowerCase().indexOf(search.toLowerCase()) === -1) {
					return
				}
				trailSelectorFragment.append(t.node)
			})
			while (customTrailSelectorContainer.firstChild !== null) {
				customTrailSelectorContainer.removeChild(customTrailSelectorContainer.firstChild)
			}
			customTrailSelectorContainer.append(trailSelectorFragment)
		}

		const customTrailSortBy = customTrailUI.querySelector(".input-select.customizer--item-selector-controls--sort-options"),
			customTrailSearch = customTrailUI.querySelector(".input-field.customizer--item-selector-controls--filter-input"),
			customTrailSearchClear = customTrailUI.querySelector(".customizer--item-selector-controls--filter-clear")

		customTrailSearch.placeholder = "Search Trail"

		const customTrailApplyFilters = (e) => {
			populateTrailList(customTrailSearch.value, customTrailSortBy.value)
		}

		customTrailSortBy.addEventListener("change", customTrailApplyFilters)
		customTrailSearch.addEventListener("keyup", customTrailApplyFilters)
		customTrailSearchClear.addEventListener("click", () => {
			customTrailSearch.value = ""
			populateTrailList(customTrailSearch.value, customTrailSortBy.value)
		})

		/* Paint Selector UI */
		const customCarPaintUI = document.createElement("div")
		customCarPaintUI.className = "nt-admin-panel-paint-selector customizer--item-selector paint-selector"
		customCarPaintUI.innerHTML = `
            <div class="customizer--item-selector-container">
                <div class="nt-admin-panel-paint-selector-heading">
                    <div class="nt-admin-panel-paint-selector-heading-icon">
                        <svg width="296" height="298" viewBox="0 0 296 298" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M122.94 67.8906C125.687 80.7934 131.287 90.9781 139.312 99.0844C149.684 109.561 163.054 115.395 174.89 120.029C177.209 120.938 179.494 121.814 181.74 122.677L181.742 122.677L181.749 122.68C203.696 131.103 222.001 138.128 233.456 159.298L234.766 168.903L185.238 218.432L78.8184 112.012L122.94 67.8906ZM71.7473 119.083L42.0488 148.782C38.1436 152.687 38.1436 159.018 42.0488 162.924L66.7976 187.672L8.99159 245.478C-2.82176 257.292 -2.82177 276.445 8.99159 288.258C20.805 300.072 39.9582 300.072 51.7716 288.258L109.578 230.452L134.326 255.201C138.232 259.106 144.563 259.106 148.468 255.201L178.167 225.503L71.7473 119.083ZM19.775 277.829C26.6091 284.663 37.6895 284.663 44.5237 277.829C51.3579 270.994 51.3579 259.914 44.5237 253.08C37.6895 246.246 26.6091 246.246 19.775 253.08C12.9408 259.914 12.9408 270.994 19.775 277.829Z"></path><path d="M176.206 5.20904L137.797 45.0956C136.002 46.959 134.976 49.5184 135.082 52.1031C137.946 122.171 214.991 94.7163 246.062 153.181C246.687 154.356 247.092 155.673 247.272 156.992L251.312 186.622C252.279 193.713 258.336 199 265.492 199C272.213 199 278.028 194.324 279.47 187.761L294.699 118.468C296.136 111.929 294.207 105.105 289.558 100.287L197.805 5.19812C191.903 -0.918788 182.102 -0.913825 176.206 5.20904Z"></path><circle cx="265" cy="226" r="14"></circle></svg>
                    </div>
                    <div class="nt-admin-panel-paint-selector-heading-label">Paint</div>
                </div>
                <div class="nt-admin-panel-scrollable">
                    <div class="customizer--item-selector-items"></div>
                </div>
            </div>`

		const customCarPaintContainer = customCarPaintUI.querySelector(".customizer--item-selector-items")

		;(() => {
			const customCarPaintItemTemplate = document.createElement("div")
			customCarPaintItemTemplate.className = "customizer--item-selector-item"
			customCarPaintItemTemplate.innerHTML = `
                <div class="customizer--item-selector-item--labels">
                    <div class="customizer--item-selector-item--equipped">Equipped</div>
                </div>
                <div class="paint-select-preview"></div>`

			const carSelectPointerHandler = (e) => {
				const item = e.target.closest(".customizer--item-selector-item"),
					hue = parseInt(item.dataset.selectedhue)
				if (hue === (config?.hue || 0)) {
					return
				}
				if (config?.car) {
					setCar(config.car, hue, config.trail)
				}
				saveConfig(config?.car, hue, config.trail)
				customCarPaintContainer.querySelectorAll(".is-equipped").forEach((node) => node.classList.remove("is-equipped"))
				item.classList.add("is-equipped")
			}

			const fragment = document.createDocumentFragment()
			for (let hue = 0; hue <= 340; hue += 10) {
				const item = customCarPaintItemTemplate.cloneNode(true)
				item.dataset.selectedhue = hue
				if (hue === config?.hue) {
					item.classList.add("is-equipped")
				}
				item.addEventListener("pointerup", carSelectPointerHandler)
				fragment.append(item)
			}
			customCarPaintContainer.append(fragment)
		})()

		CarPainter.setCarPaintCreatedHandler((hue, imgDataURL) => {
			const target = customCarPaintContainer.querySelector(`.customizer--item-selector-item[data-selectedhue="${hue}"] .paint-select-preview`)
			if (!target) {
				logging.warn("Update Car Paints")("Unable to place custom car paint image on selector")
				return
			}
			target.style.backgroundImage = `url(${imgDataURL})`
		})
		if (config?.car) {
			CarPainter.generateSampleCarPaints(config.car)
		}

		/* Custom Car Tab */
		const customCarTab = tabContainer.firstElementChild.cloneNode(true)
		customCarTab.setAttribute("customizertabindex", null)
		customCarTab.classList.remove("customizer--tab--selected", "is-current")
		customCarTab.querySelector(".customizer--tab--label").textContent = "Admin Panel"
		customCarTab.querySelector(".customizer--tab--icon").innerHTML = `<img src="${GM_getResourceURL(
			"icon_tab",
		)}" alt="admin_panel_icon" width="25" height="24" />`

		customCarTab.addEventListener("pointerup", (e) => {
			e.preventDefault()
			showCustomCarPage(true)
		})

		/* Setup Custom Car Section */
		const changeTitle = (title) => {
			const titleHeading = container.querySelector(".customizer--about--title")
			if (!titleHeading) {
				logging.warn("Init")("Unable to update title heading")
				return
			}
			titleHeading.textContent = title
		}

		const showCustomCarPage = (show, tabName) => {
			const customizerItemSelector = container.querySelector(".customizer--item-selector"),
				customizerPreview = container.querySelector(".customizer--preview")
			customizerItemSelector.hidden = show

			if (show) {
				customizerPreview.style.opacity = 0
				customizerPreview.style.zIndex = -1000
				container.classList.remove("section-paint", "section-trails", "section-stickers", "section-titles", "no-preview")
				container.classList.add("section-cars", "section-nt-admin-panel")
				previewerCanvas.style.width = "300px"
				previewerCanvas.style.height = "280px"
				otherTabs.forEach((tab) => {
					tab.classList.remove("customizer--tab--selected", "is-current")
				})
				customCarTab.classList.add("customizer--tab--selected", "is-current")
				changeTitle("Admin Panel")

				reactObj.previewer.setFocus("car")
				if (config?.car) {
					setCar(config.car, config.hue || 0, config.trail)
				}
				customizerItemSelector.after(customCarUI, customTrailUI, customCarPaintUI)
				previewer.after(customCarNoPreview)

				if (config?.car) {
					updateCarLabel(NTGLOBALS.CARS.find((c) => c.id === config.car))
					customizerPreview.after(selectedCarLabel)
				}

				const selectedCar = customCarSelectorContainer.querySelector(".is-equipped"),
					selectedTrail = customTrailSelectorContainer.querySelector(".is-equipped"),
					selectedPaint = customCarPaintContainer.querySelector(".is-equipped")
				if (selectedCar) {
					customCarSelectorContainer.parentNode.scrollTop = selectedCar.offsetTop
				}
				if (selectedTrail) {
					customTrailSelectorContainer.parentNode.scrollTop = selectedTrail.offsetTop
				}
				if (selectedPaint) {
					customCarPaintContainer.parentNode.scrollTop = selectedPaint.offsetTop
				}
			} else {
				customizerPreview.style.opacity = 1
				customizerPreview.style.zIndex = ""
				container.classList.add(`section-${tabName.toLowerCase()}`)
				container.classList.remove("section-nt-admin-panel")
				previewerCanvas.style.width = "559px"
				previewerCanvas.style.height = "500px"
				if (tabName !== "Cars") {
					container.classList.remove("section-cars")
				}
				if (tabName === "Trails") {
					reactObj.previewer.setFocus("trails")
				}
				if (["Stickers", "Titles"].includes(tabName)) {
					container.classList.add("no-preview")
				}
				customCarTab.classList.remove("customizer--tab--selected", "is-current")
				changeTitle(tabName)

				const realConfig = reactObj.props.config
				if (!realConfig) {
					logging.warn("Init")("Unable to find user's customizer settings")
					return
				}

				const { id: realCarID, hueAngle: realHue } = realConfig.find((c) => c.type === "car") || { id: null, hueAngle: null },
					realTrailID = realConfig.find((c) => c.type === "trail")?.id
				setCar(realCarID, realHue, realTrailID)

				customCarUI.remove()
				customTrailUI.remove()
				customCarPaintUI.remove()
				customCarNoPreview.remove()
				selectedCarLabel.remove()
			}
		}

		const otherTabs = tabContainer.querySelectorAll(".nav-list-item.customizer--tab")
		otherTabs.forEach((tab) => {
			tab.addEventListener("pointerup", (e) => {
				const title = tab.querySelector(".customizer--tab--label").textContent
				showCustomCarPage(false, title)
				tab.classList.add("customizer--tab--selected", "is-current")
			})
		})

		populateList("", "name_a-z")
		populateTrailList("", "name_a-z")

		tabContainer.firstElementChild.before(customCarTab)
	}

	///////////////////
	//  Garage Page  //
	///////////////////
	else if (config?.car && window.location.pathname === "/garage") {
		const profileContainer = document.querySelector("section.profile"),
			profileObj = profileContainer ? findReact(profileContainer) : null
		if (!profileObj) {
			logging.error("Init")("Could not find profile container")
			return
		}

		/* Styles */
		const style = document.createElement("style")
		style.appendChild(
			document.createTextNode(`
.nt-admin-panel-label-garage {
	position: absolute;
	bottom: 150px;
	left: calc((100% - 202px) / 2);
	z-index: -1;
	margin: 0 auto;
	padding: 2px 8px;
	border-radius: 4px;
	font-size: 12px;
	text-align: center;
	text-shadow: 0 2px 2px rgba(2, 2, 2, 0.25);
	color: #fff;
	background-color: #136cac;
}`),
		)
		document.head.appendChild(style)

		/* Replace car with custom car */
		const car = NTGLOBALS.CARS.find((c) => c.id === config.car)
		if (!car) {
			logging.error("Init")("Custom Car setting is invalid")
			return
		}
		const oldGetCarParamsFn = profileObj.getCarParams
		profileObj.getCarParams = function () {
			this.props.carID = car.id
			this.props.carHueAngle = config.hue || 0
			this.props.selectedTrail = config.trail ? NTGLOBALS.LOOT.find((l) => l.lootID === config.trail && l.type === "trail") : undefined
			return oldGetCarParamsFn()
		}
		profileObj.forceUpdate()

		/* Attach label about custom cars */
		const customCarText = document.createElement("div")
		customCarText.className = "nt-admin-panel-label-garage"
		customCarText.textContent = "Custom Car from Admin Panel"

		const targetElement = document.querySelector("div.profile--grid--center div")
		if (targetElement) {
			targetElement.after(customCarText)
		}
	}

	///////////////////
	//  Racing Page  //
	///////////////////
	else if (config?.car && (window.location.pathname === "/race" || window.location.pathname.startsWith("/race/"))) {
		const raceContainer = document.getElementById("raceContainer"),
			raceObj = raceContainer ? findReact(raceContainer) : null
		if (!raceObj) {
			logging.error("Init")("Could not find the race track")
			return
		}

		const car = NTGLOBALS.CARS.find((c) => c.id === config.car)
		if (!car) {
			logging.error("Init")("Custom Car setting is invalid")
			return
		}

		/* Styles */
		const style = document.createElement("style")
		style.appendChild(
			document.createTextNode(`
.nt-admin-panel-label {
    position: absolute;
    right: -20px;
    top: 595px;
    z-index: 3;
    color: #383c4f;
    font-size: 10px;
}`),
		)
		document.head.appendChild(style)

		/* Show label on dashboard indicating using custom car */
		const customCarText = document.createElement("div")
		customCarText.className = "nt-admin-panel-label"
		customCarText.textContent = "CC"

		raceContainer.after(customCarText)

		/** Display Custom Car on Race Track. **/
		const oldGameAddPlayer = raceObj.game.track.addPlayer
		raceObj.game.track.addPlayer = (e, r) => {
			if (e.isPlayer) {
				e.type = !!car.options?.isAnimated ? car.key || car.assetKey || car.carID : car.carID
				e.isAnimated = !!car.options?.isAnimated
				e.hue = config.hue || 0
				e.mods.trail = config.trail ? NTGLOBALS.LOOT.find((l) => l.lootID === config.trail && l.type === "trail")?.assetKey : undefined
			}
			oldGameAddPlayer(e, r)
		}

		/** Display Custom Car on Race Results. */
		raceObj.server.on("status", (e) => {
			if (e.status === "racing") {
				raceObj.state.racers = raceObj.state.racers.map((r) => {
					if (r.userID === raceObj.props.user.userID) {
						r.profile.carHueAngle = config.hue || 0
						r.profile.carID = config.car
					}
					return r
				})
			}
		})

		/** Display Custom Car on Popover (race results). **/
		const racerPopupObserver = new MutationObserver((mutations) => {
			for (const m of mutations) {
				for (const node of m.addedNodes) {
					if (node.classList?.contains("pane--overlay")) {
						const reactObj = findReact(node, 1)
						if (!reactObj) {
							logging.warn("Race Results")("Unable to review popup racer modal")
						}
						if (reactObj.props.userID !== raceObj.props.user.userID) {
							return
						}
						reactObj.props.profile.carID = config.car
						reactObj.props.profile.carHueAngle = config.hue
						reactObj.forceUpdate()
						return
					}
				}
			}
		})
		racerPopupObserver.observe(document.body, { childList: true })
	}
}