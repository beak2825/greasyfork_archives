// ==UserScript==
// @name		Theatre for iwara
// @namespace	xuyiming.open@outlook.com
// @description	2024/9/18 14:52:52
// @author		-
// @include		https://www.iwara.tv/*
// @match		https://www.iwara.tv/*
// @grant		unsafeWindow
// @inject-into	page
// @run-at		document-idle
// @version		1.1
// @require https://update.greasyfork.org/scripts/523672/1520050/Webpack%20Hacks.js
// @downloadURL https://update.greasyfork.org/scripts/543437/Theatre%20for%20iwara.user.js
// @updateURL https://update.greasyfork.org/scripts/543437/Theatre%20for%20iwara.meta.js
// ==/UserScript==

const createTheatrePlugin = videoJs => {
	const MAIN_SELECTOR = ".content .container-fluid"
	const VIDEO_PLAYER_SELECTOR = ".page-video__player"
	const VIDEO_DETAIL_SELECTOR = ".page-video__details"

	const PLAYER_THEATRE_STORAGE = "player-theatre"

	const Button = videoJs.getComponent('Button');

	const enterTheatre = (player) => {
		player.classList.add("block")
		player.classList.add("block--margin")
		player.style.marginLeft = "15px"
		player.style.marginRight = "15px"

		const main = document.querySelector(MAIN_SELECTOR)
		const mainParent = main?.parentNode
		if (mainParent != null) {
			mainParent.style.flexDirection = 'column'
			mainParent.insertBefore(player, main)
		}

		return true

	}

	const exitTheatre = (player) => {
		player.classList.remove("block")
		player.classList.remove("block--margin")
		player.style.removeProperty("margin-left")
		player.style.removeProperty("margin-right")

		const videoDetail = document.querySelector(VIDEO_DETAIL_SELECTOR)
		const mainParent = document.querySelector(MAIN_SELECTOR)?.parentNode

		if (videoDetail != null) {
			videoDetail.parentNode.insertBefore(player, videoDetail)
		}

		if (mainParent != null) {
			mainParent.style.removeProperty('flex-direction')
		}

		return false
	}

	const enableTheatre = () => {
		const player = document.querySelector(VIDEO_PLAYER_SELECTOR);

		if (player == null) {
			return
		} else if (!player.classList.contains("block")) {
			return enterTheatre(player)
		}
	}

	const toggleTheatre = () => {
		const player = document.querySelector(VIDEO_PLAYER_SELECTOR);

		if (player == null) {
			return
		} else if (player.classList.contains("block")) {
			return exitTheatre(player)
		} else {
			return enterTheatre(player)
		}
	}

	return function plugin() {
		const player = this
		const theatreToggle = new Button(player, {
			controlText: 'Theatre',
			clickHandler: function () {
				if (toggleTheatre()) {
					localStorage.setItem(PLAYER_THEATRE_STORAGE, '1')
				} else {
					localStorage.removeItem(PLAYER_THEATRE_STORAGE)
				}
			}
		})
		const theatreToggleEl = theatreToggle.el()
		theatreToggleEl.getElementsByClassName("vjs-icon-placeholder")[0].classList.add('vjs-icon-square')
		theatreToggleEl.style.cursor = 'pointer'
		player.controlBar.el().insertBefore(
			theatreToggle.el(),
			(player.controlBar.getChild("pictureInPictureToggle") ?? player.controlBar.getChild("audioTrackButton")).el().nextSibling
		)
		player.ready(() => {
			if (localStorage.getItem(PLAYER_THEATRE_STORAGE) != null) {
				enableTheatre()
			}
		})
	}
}

const createIsBasicPlugin = videoJs => {
	const Plugin = videoJs.getPlugin('plugin');
	return p => typeof p === 'function' && !Plugin.prototype.isPrototypeOf(p.prototype)
}

const createComposePlugin = videoJs => {
	const isBasicPlugin = createIsBasicPlugin(videoJs)

	return (plugin, basicPlugin) => {
		if (isBasicPlugin(plugin)) {
			return function (...args) {
				const result = plugin.apply(this, args)
				basicPlugin.call(this)
				return result
			}
		} else {
			return class extends plugin {
				constructor(player, ...args) {
					super(player, ...args)
					basicPlugin.call(player)
				}
			}
		}
	}
}

const fakeChunkId = -202863675014729
const chunkLoadingGlobal = "webpackChunkiwara3_pwa"

const hookVideoJs = videoJs => {
	const composePlugin = createComposePlugin(videoJs);
	const theatrePlugin = createTheatrePlugin(videoJs)

	const { registerPlugin, plugin } = videoJs

	videoJs.registerPlugin = function (...args) {
		videoJs.registerPlugin = registerPlugin
		const [_name, herePlugin] = args
		args[1] = composePlugin(herePlugin, theatrePlugin)
		return registerPlugin.apply(this, args)
	}

	videoJs.plugin = function (...args) {
		videoJs.plugin = plugin
		const [_name, herePlugin] = args
		args[1] = composePlugin(herePlugin, theatrePlugin)
		return plugin.apply(this, args)
	}
}

/** @param {WebpackRuntimeContext} context */
function main(context) {
	const unintercept = WebpackHacks.interceptChunkLoading(unsafeWindow, chunkLoadingGlobal, ([chunkIds, moreModules, runtime]) => {
		for (const [moduleId, moduleFactory] of Object.entries(moreModules)) {
			const moduleFactorySource = String(moduleFactory)
			if (
				moduleFactorySource.includes("vjs-") &&
				moduleFactorySource.includes("You aborted the media playback") &&
				moduleFactorySource.includes("A network error caused the media download to fail part-way.") &&
				moduleFactorySource.includes("The media playback was aborted due to a corruption problem or because the media used features your browser did not support.") &&
				moduleFactorySource.includes("The media could not be loaded, either because the server or network failed or because the format is not supported.") &&
				moduleFactorySource.includes("The media is encrypted and we do not have the keys to decrypt it.")
			) {
				moreModules[moduleId] = function (...args) {
					moduleFactory.apply(this, args)
					const [module, exports, require] = args
					hookVideoJs(require[WebpackHacks.RequireProperties.compatGetDefaultExport](exports)())
				}
				moreModules[moduleId].toString = moduleFactory.toString.bind(moduleFactory)
				unintercept()
				break
			}
		}
	})
}

WebpackHacks.loadFakeChink(unsafeWindow, chunkLoadingGlobal, fakeChunkId, main)