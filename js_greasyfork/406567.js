// ==UserScript==
// @name Enhanced BLAEO
// @namespace https://rafaelgssa.gitlab.io/monkey-scripts
// @version 5.0.2
// @author rafaelgssa
// @description Adds some cool features to BLAEO.
// @match https://www.backlog-assassins.net/*
// @match https://www.steamgifts.com/discussion/9VTBD/*
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require https://greasyfork.org/scripts/405813-monkey-utils/code/Monkey%20Utils.js?version=821710
// @require https://greasyfork.org/scripts/405802-monkey-dom/code/Monkey%20DOM.js?version=823982
// @require https://greasyfork.org/scripts/405831-monkey-storage/code/Monkey%20Storage.js?version=821709
// @require https://greasyfork.org/scripts/405822-monkey-requests/code/Monkey%20Requests.js?version=821708
// @require https://greasyfork.org/scripts/406057-blaeo-api/code/BLAEO%20API.js?version=823678
// @connect steamgifts.com
// @connect steamcommunity.com
// @run-at document-idle
// @grant GM.info
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.deleteValue
// @grant GM.xmlHttpRequest
// @grant GM.openInTab
// @grant GM_info
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/406567/Enhanced%20BLAEO.user.js
// @updateURL https://update.greasyfork.org/scripts/406567/Enhanced%20BLAEO.meta.js
// ==/UserScript==

/* global BlaeoApi, DOM, PersistentStorage, Requests, Utils */

/**
 * @typedef {'new' | GameProgress} GameCategory
 *
 * @typedef {'uncategorized' | 'never-played' | 'unfinished' | 'beaten' | 'completed' | 'wont-play'} GameProgress
 *
 * @typedef {Object} GameCategoryInfo
 * @property {string} name
 * @property {string} color
 * @property {string} bootstrapClass
 *
 * @typedef {Object} EblaeoGlobals Global variables for the entire script.
 * @property {UserData} user
 * @property {Partial<SmGlobals>} sm
 * @property {Partial<GlcGlobals>} glc
 * @property {Partial<PgGlobals>} pg
 * @property {HTMLElement | null} alertEl
 * @property {HTMLButtonElement | null} dialogModalButton
 * @property {HTMLElement | null} dialogModalHolderEl
 * @property {HTMLElement | null} dialogModalEl
 * @property {HTMLElement | null} dialogModalLabelEl
 * @property {HTMLElement | null} dialogModalFooterEl
 * @property {HTMLElement | null} dialogModalDenyButton
 * @property {HTMLElement | null} dialogModalConfirmButton
 *
 * @typedef {Object} UserData
 * @property {string} steamId
 * @property {string} username
 * @property {boolean} isAdmin
 * @property {Record<number, OwnedGame>} ownedGames
 * @property {number} lastSync
 * @property {Record<string, number[]>} glcLists
 * @property {Record<string, PgPreset<PgPresetType>>} pgPresets
 *
 * @typedef {Object} OwnedGame
 * @property {number} id
 * @property {GameProgress} [progress]
 *
 * @typedef {Object} SmGlobals Global variables for Settings Menu.
 * @property {HTMLElement | null} sidebarNavEl
 * @property {HTMLElement | null} button
 * @property {HTMLElement | null} mainContainerEl
 * @property {HTMLButtonElement | null} syncButton
 * @property {HTMLElement | null} lastSyncEl
 * @property {HTMLElement | null} usernameEl
 * @property {HTMLElement | null} ownedGamesEl
 *
 * @typedef {Object} GlcGlobals Global variables for Game List Checker.
 * @property {HTMLElement | null} postEl
 * @property {HTMLElement[]} listItemEls
 * @property {HTMLButtonElement | null} button
 * @property {HTMLElement | null} buttonIconEl
 * @property {HTMLButtonElement | null} modalButton
 * @property {HTMLElement | null} modalEl
 * @property {HTMLElement | null} modalBodyEl
 * @property {boolean} hasChecked
 * @property {boolean} isFirstCheck
 * @property {Partial<Record<GameCategory, GlcGame[]>>} games
 * @property {number} gamesCount
 * @property {string} postId
 *
 * @typedef {Object} GlcGame
 * @property {number} id
 * @property {string} name
 * @property {boolean} [isNew]
 *
 * @typedef {Object} PgGlobals Global variables for Post Generator.
 * @property {HTMLTextAreaElement | null} postField
 * @property {HTMLElement | null} previewButton
 * @property {HTMLElement | null} createButton
 * @property {Record<string, PgPreset<PgPresetType>>} defaultPresets
 * @property {PgGame} defaultGame
 * @property {PgPresetType[]} presetTypes
 * @property {Record<PgPresetType, string>} presetTypeNames
 * @property {Record<PgPresetType, PgPreset<PgPresetType>>} presets
 * @property {PgPresetType} currentPresetType
 * @property {PgGameInfo[]} gameInfos
 * @property {PgGame | null} selectedGame
 * @property {boolean} isEditing
 * @property {Partial<Record<PgPresetType, HTMLElement | null>>} presetTabNavEls
 * @property {Partial<Record<PgPresetType, HTMLElement | null>>} presetTabEls
 * @property {Partial<Record<PgPresetType, HTMLElement | null>>} presetDropdownEls
 * @property {Pick<PgFieldContainers, 'presets'> & Partial<PgFieldContainers>} fieldContainerEls
 * @property {Pick<PgFields, 'presets'> & Partial<PgFields>} fields
 * @property {boolean} isSearchingGames
 * @property {boolean} hasNewGameSearchQuery
 * @property {HTMLElement | null} generateButton
 * @property {HTMLElement | null} modalEl
 * @property {HTMLElement | null} modalBodyEl
 * @property {HTMLInputElement | null} searchGamesField
 * @property {HTMLElement | null} searchGamesResultsEl
 * @property {HTMLElement | null} generatorEl
 * @property {HTMLElement | null} generatorBodyEl
 * @property {HTMLElement | null} generatorNavEl
 * @property {HTMLElement | null} savePresetButton
 * @property {HTMLElement | null} gamePreviewContainerEl
 * @property {HTMLElement | null} gamePreviewEl
 * @property {HTMLElement | null} gamePreviewBodyEl
 * @property {HTMLElement | null} gamePreviewButton
 * @property {HTMLElement | null} fullPreviewEl
 * @property {HTMLElement | null} fullPreviewBodyEl
 * @property {HTMLElement | null} doneButton
 * @property {PgGame[]} gamesCache
 * @property {Record<number, number>} playtimeThisMonthCache
 * @property {Record<number, number>} screenshotsCache
 * @property {Record<number, PgReviewCache>} reviewsCache
 *
 * @typedef {'box' | 'bar' | 'panel' | 'custom'} PgPresetType
 *
 * @typedef {Object} PgPresets
 * @property {PgBoxPreset} box
 * @property {PgBarPreset} bar
 * @property {PgPanelPreset} panel
 * @property {PgCustomPreset} custom
 *
 * @typedef {PgPresetBase & PgBoxPresetBase} PgBoxPreset
 *
 * @typedef {PgPresetBase & PgBarPresetBase} PgBarPreset
 *
 * @typedef {PgPresetBase & PgPanelPresetBase} PgPanelPreset
 *
 * @typedef {PgCustomPresetBase} PgCustomPreset
 *
 * @typedef {Object} PgPresetBase
 * @property {boolean} showPlaytimeThisMonth
 * @property {string} playtimeTemplate
 * @property {boolean} linkAchievements
 * @property {string} achievementsTemplate
 * @property {string} noAchievementsTemplate
 * @property {boolean} checkScreenshots
 * @property {boolean} linkScreenshots
 * @property {string} screenshotsTemplate
 * @property {string} noScreenshotsTemplate
 * @property {'Solid' | 'Horizontal gradient' | 'Vertical gradient'} bgType
 * @property {string} bgColor1
 * @property {string} bgColor2
 * @property {string} titleColor
 * @property {string} textColor
 * @property {string} linkColor
 *
 * @typedef {Object} PgBoxPresetBase
 * @property {'Left' | 'Right'} reviewPosition
 *
 * @typedef {Object} PgBarPresetBase
 * @property {boolean} showInfoInOneLine
 * @property {'Left' | 'Right' | 'Hidden'} completionBarPosition
 * @property {'Left' | 'Right'} imagePosition
 * @property {boolean} useCollapsibleReview
 * @property {'Bar click' | 'Button click'} reviewTriggerMethod
 *
 * @typedef {Object} PgPanelPresetBase
 * @property {boolean} usePredefinedTheme
 * @property {'Blue' | 'Green' | 'Grey' | 'Red' | 'Yellow'} predefinedThemeColor
 * @property {boolean} useCustomTheme
 * @property {boolean} useCollapsibleReview
 *
 * @typedef {Object} PgCustomPresetBase
 * @property {string} htmlTemplate
 *
 * @typedef {Object} PgGame
 * @property {number} id
 * @property {string} name
 * @property {string} image
 * @property {GameProgress} progress
 * @property {PgGamePlaytime} playtime
 * @property {PgGameAchievements} achievements
 * @property {number} screenshotsCount
 * @property {string} customHtml
 * @property {string} rating
 * @property {string} review
 * @property {PgPreset<PgPresetType>} preset
 *
 * @typedef {Object} PgGamePlaytime
 * @property {number} thisMonth
 * @property {number} total
 *
 * @typedef {Object} PgGameAchievements
 * @property {number} unlocked
 * @property {number} total
 *
 * @typedef {Object} PgGameInfo
 * @property {PgGame} game
 * @property {ElementArray[]} elArrays
 *
 * @typedef {Record<'presets', PgPresetFieldContainers> & PgFieldContainersBase} PgFieldContainers
 *
 * @typedef {Object} PgPresetFieldContainers
 * @property {Partial<PgBoxFieldContainers>} box
 * @property {Partial<PgBarFieldContainers>} bar
 * @property {Partial<PgPanelFieldContainers>} panel
 * @property {Partial<PgCustomFieldContainers>} custom
 *
 * @typedef {PgPresetFieldContainersBase & PgBoxFieldContainersBase} PgBoxFieldContainers
 *
 * @typedef {PgPresetFieldContainersBase & PgBarFieldContainersBase} PgBarFieldContainers
 *
 * @typedef {PgPresetFieldContainersBase & PgPanelFieldContainersBase} PgPanelFieldContainers
 *
 * @typedef {PgCustomFieldContainersBase} PgCustomFieldContainers
 *
 * @typedef {Record<keyof PgPresetFieldsBase, HTMLElement | null>} PgPresetFieldContainersBase
 *
 * @typedef {Record<keyof PgBoxFieldsBase, HTMLElement | null>} PgBoxFieldContainersBase
 *
 * @typedef {Record<keyof PgBarFieldsBase, HTMLElement | null>} PgBarFieldContainersBase
 *
 * @typedef {Record<keyof PgPanelFieldsBase, HTMLElement | null>} PgPanelFieldContainersBase
 *
 * @typedef {Record<keyof PgCustomFieldsBase, HTMLElement | null>} PgCustomFieldContainersBase
 *
 * @typedef {Record<PgFieldKey, HTMLElement | null>} PgFieldContainersBase
 *
 * @typedef {Object} PgFields
 * @property {PgPresetFields} presets
 * @property {HTMLInputElement | null} customHtml
 * @property {HTMLInputElement | null} rating
 * @property {HTMLTextAreaElement | null} review
 * @property {HTMLInputElement | null} presetName
 *
 * @typedef {Object} PgPresetFields
 * @property {Partial<PgBoxFields>} box
 * @property {Partial<PgBarFields>} bar
 * @property {Partial<PgPanelFields>} panel
 * @property {Partial<PgCustomFields>} custom
 *
 * @typedef {PgPresetFieldsBase & PgBoxFieldsBase} PgBoxFields
 *
 * @typedef {PgPresetFieldsBase & PgBarFieldsBase} PgBarFields
 *
 * @typedef {PgPresetFieldsBase & PgPanelFieldsBase} PgPanelFields
 *
 * @typedef {PgCustomFieldsBase} PgCustomFields
 *
 * @typedef {Object} PgPresetFieldsBase
 * @property {HTMLInputElement | null} showPlaytimeThisMonth
 * @property {HTMLInputElement | null} playtimeTemplate
 * @property {HTMLInputElement | null} linkAchievements
 * @property {HTMLInputElement | null} achievementsTemplate
 * @property {HTMLInputElement | null} noAchievementsTemplate
 * @property {HTMLInputElement | null} checkScreenshots
 * @property {HTMLInputElement | null} linkScreenshots
 * @property {HTMLInputElement | null} screenshotsTemplate
 * @property {HTMLInputElement | null} noScreenshotsTemplate
 * @property {HTMLInputElement | null} bgType
 * @property {HTMLInputElement | null} bgColor1
 * @property {HTMLInputElement | null} bgColor2
 * @property {HTMLInputElement | null} titleColor
 * @property {HTMLInputElement | null} textColor
 * @property {HTMLInputElement | null} linkColor
 *
 * @typedef {Object} PgBoxFieldsBase
 * @property {HTMLInputElement | null} reviewPosition
 *
 * @typedef {Object} PgBarFieldsBase
 * @property {HTMLInputElement | null} showInfoInOneLine
 * @property {HTMLInputElement | null} customHtml
 * @property {HTMLInputElement | null} completionBarPosition
 * @property {HTMLInputElement | null} imagePosition
 * @property {HTMLInputElement | null} useCollapsibleReview
 * @property {HTMLInputElement | null} reviewTriggerMethod
 *
 * @typedef {Object} PgPanelFieldsBase
 * @property {HTMLInputElement | null} rating
 * @property {HTMLInputElement | null} usePredefinedTheme
 * @property {HTMLInputElement | null} predefinedThemeColor
 * @property {HTMLInputElement | null} useCustomTheme
 * @property {HTMLInputElement | null} useCollapsibleReview
 *
 * @typedef {Object} PgCustomFieldsBase
 * @property {HTMLInputElement | null} htmlTemplate
 *
 * @typedef {Object} PgFieldOptions
 * @property {'textarea' | 'text' | 'color' | 'checkbox' | 'radio' | 'select'} type
 * @property {PgPresetFieldKey | PgFieldKey} id
 * @property {string} htmlId
 * @property {string} label
 * @property {string} [description]
 * @property {boolean} [usePlaceholders]
 * @property {boolean} [useReviewPlaceholder]
 * @property {string[]} [selectOptions]
 *
 * @typedef {keyof PgPresetBase | keyof PgBoxPresetBase | keyof PgBarPresetBase | keyof PgPanelPresetBase | keyof PgCustomPresetBase} PgPresetFieldKey
 *
 * @typedef {keyof Omit<PgFields, 'presets'>} PgFieldKey
 *
 * @typedef {Object} PgReviewCache
 * @property {string} review
 * @property {string} reviewPreview
 */

/**
 * @template {PgPresetType} T
 * @typedef {Object} PgPreset
 * @property {T} type
 * @property {string} name
 * @property {PgPresets[T]} prefs
 */

class CustomError extends Error {
	/**
	 * @param {string} message
	 */
	constructor(message) {
		super(message);
	}
}

(async () => {
	'use strict';

	const scriptId = 'eblaeo';
	const scriptName = GM.info.script.name;

	/** @type {UserData} */
	const defaultValues = {
		steamId: '',
		username: '',
		isAdmin: false,
		ownedGames: {},
		lastSync: 0,
		glcLists: {},
		pgPresets: {},
	};

	const isInBlaeo = window.location.host === 'www.backlog-assassins.net';

	const gameCategories = /** @type {GameCategory[]} */ ([
		'new',
		'uncategorized',
		'never-played',
		'unfinished',
		'beaten',
		'completed',
		'wont-play',
	]);

	/** @type {Record<GameCategory, GameCategoryInfo>} */
	const gameCategoryInfos = {
		new: {
			name: 'New',
			color: '#555555',
			bootstrapClass: 'primary',
		},
		uncategorized: {
			name: 'Uncategorized',
			color: '#dddddd',
			bootstrapClass: 'default',
		},
		'never-played': {
			name: 'Never Played',
			color: '#eeeeee',
			bootstrapClass: 'default',
		},
		unfinished: {
			name: 'Unfinished',
			color: '#f0ad4e',
			bootstrapClass: 'warning',
		},
		beaten: {
			name: 'Beaten',
			color: '#5cb85c',
			bootstrapClass: 'success',
		},
		completed: {
			name: 'Completed',
			color: '#5bc0de',
			bootstrapClass: 'info',
		},
		'wont-play': {
			name: "Won't Play",
			color: '#d9534f',
			bootstrapClass: 'danger',
		},
	};

	/** @type {Record<BlaeoGameProgress, GameProgress>} */
	const gameProgresses = {
		uncategorized: 'uncategorized',
		'never played': 'never-played',
		unfinished: 'unfinished',
		beaten: 'beaten',
		completed: 'completed',
		'wont play': 'wont-play',
	};

	const bootstrapColorClasses = {
		Grey: 'default',
		Yellow: 'warning',
		Green: 'success',
		Blue: 'info',
		Red: 'danger',
	};

	const eblaeo = /** @type {EblaeoGlobals} */ ({
		user: {},
		sm: {},
		glc: {},
		pg: {},
	});

	/**
	 * Loads the script.
	 * @returns {Promise<void>}
	 */
	const load = async () => {
		await loadUserData();
		addStyles();
		await loadFeatures();
		if (isInBlaeo) {
			document.addEventListener('turbolinks:load', loadFeatures);
		}
	};

	/**
	 * Loads the user's data.
	 * @returns {Promise<void>}
	 */
	const loadUserData = async () => {
		const keys = /** @type {(keyof UserData)[]} */ (Object.keys(defaultValues));
		for (const key of keys) {
			eblaeo.user[key] = /** @type {never} */ (await PersistentStorage.getValue(key));
		}
	};

	/**
	 * Adds styles to the page.
	 */
	const addStyles = () => {
		// prettier-ignore
		DOM.insertElements(document.head, 'beforeend', [
			['style', null,
				isInBlaeo
					? `
						.clear-both {
							clear: both;
						}

						#eblaeo-alert, #eblaeo-dialog-modal-button, #eblaeo-glc-modal-button, #eblaeo-pg-generator, #eblaeo-pg-full-preview, .eblaeo-pg-collapse, .eblaeo-pg-expand {
							display: none;
						}

						#eblaeo-alert {
							margin: 10px 0;
						}

						#eblaeo-glc-button-container, .eblaeo-pg-full-preview-game {
							position: relative;
						}

						#eblaeo-glc-button {
							height: 38px;
							max-height: 38px;
							max-width: 38px;
							position: absolute;
							right: -19px;
							text-align: center;
							top: 15px;
							width: 38px;
						}

						#eblaeo-glc-button i {
							vertical-align: middle;
						}

						.eblaeo-glc-results-section .panel-heading {
							position: sticky;
							top: 0;
						}

						#eblaeo-pg-generate-button {
							margin-right: 5px;
						}

						#eblaeo-pg-modal {
							overflow: auto;
						}

						.eblaeo-pg-game-list-item-button {
							margin-bottom: 5px;
						}

						ul[id^='eblaeo-pg-preset-dropdown']:empty::after {
							content: 'No presets saved for this type.';
							padding: 5px;
						}

						ul[id^='eblaeo-pg-preset-dropdown'] li {
							align-items: center;
							display: flex;
						}

						ul[id^='eblaeo-pg-preset-dropdown'] li a {
							cursor: pointer;
							display: inline-block;
							flex: 1;
						}

						ul[id^='eblaeo-pg-preset-dropdown'] li i {
							cursor: pointer;
							padding: 3px 10px;
						}

						.eblaeo-pg-field-container {
							margin-bottom: 15px;
						}

						.eblaeo-pg-double-field-container, .eblaeo-pg-triple-field-container {
							display: flex;
						}

						:not(.eblaeo-pg-double-field-container) > .eblaeo-pg-field-container select {
							width: calc(50% - 15px);
						}

						.eblaeo-pg-double-field-container >* {
							width: calc(50% - 15px);
						}

						.eblaeo-pg-double-field-container >:first-child {
							margin-right: 15px;
						}

						.eblaeo-pg-double-field-container >:last-child {
							margin-left: 15px;
						}

						.eblaeo-pg-triple-field-container >* {
							width: calc(34% - 15px);
						}

						.eblaeo-pg-triple-field-container >:not(:last-child) {
							margin-right: 15px;
						}

						#eblaeo-pg-game-preview-container {
							background-color: #ffffff;
							bottom: 0;
							display: none;
							padding: 15px 0;
							position: sticky;
							z-index: 999;
						}

						#eblaeo-pg-game-preview {
							margin: 0;
							max-height: 300px;
							overflow: auto;
						}

						.eblaeo-pg-full-preview-game .btn-toolbar {
							background-color: rgba(0, 0, 0, 0.5);
							display: none;
							justify-content: center;
							left: 0;
							margin: 0;
							padding: 5px 5px 5px 0;
							position: absolute;
							right: 0;
							top: 0;
							z-index: 2;
						}

						.eblaeo-pg-full-preview-game:hover .btn-toolbar {
							display: flex;
						}

						#eblaeo-pg-game-preview .panel-heading.collapsed .eblaeo-pg-expand, #eblaeo-pg-game-preview .panel-heading:not(.collapsed) .eblaeo-pg-collapse, #eblaeo-pg-full-preview .panel-heading.collapsed .eblaeo-pg-expand, #eblaeo-pg-full-preview .panel-heading:not(.collapsed) .eblaeo-pg-collapse {
							display: block;
						}

						.eblaeo-pg-collapse, .eblaeo-pg-expand {
							cursor: pointer;
							float: right;
							font-weight: bold;
						}
					`
					: `
						.eblaeo-at-user-button {
							cursor: pointer;
						}
					`,
			],
		]);
	};

	/**
	 * Loads the features.
	 * @returns {Promise<void>}
	 */
	const loadFeatures = async () => {
		if (!isInBlaeo) {
			if (eblaeo.user.isAdmin && window.location.pathname.includes('/discussion/9VTBD/')) {
				at_addUserButtons(document.body);
				DOM.observeNode(document.body, null, /** @type {NodeCallback} */ (at_addUserButtons));
			}
			return;
		}
		if (window.location.pathname.includes('/settings')) {
			sm_addButton();
		} else if (window.location.href.includes('/admin/users/new?steam_id=')) {
			at_searchUser();
		} else if (window.location.pathname.includes('/posts/new')) {
			await pg_addButton();
		} else if (window.location.pathname.includes('/posts/')) {
			glc_addButton();
		}
	};

	/**
	 * Shows an alert in a context element.
	 * @param {HTMLElement} contextEl The context element where to show the alert.
	 * @param {ExtendedInsertPosition} position Where to insert the alert.
	 * @param {'loading' | 'success' | 'warning' | 'danger'} alertType The type of the alert.
	 * @param {string} message The message to show.
	 */
	const showAlert = (contextEl, position, alertType, message) => {
		if (eblaeo.alertEl) {
			// prettier-ignore
			DOM.insertElements(contextEl, position, [eblaeo.alertEl]);
		} else {
			// prettier-ignore
			DOM.insertElements(contextEl, position, [
				['div', {
					id: 'eblaeo-alert',
					ref: (/** @type {HTMLElement} */ ref) => (eblaeo.alertEl = ref),
				}, null],
			]);
		}
		if (!eblaeo.alertEl) {
			return;
		}
		eblaeo.alertEl.className = `alert alert-${alertType === 'loading' ? 'info' : alertType}`;
		/** @type {ElementArray[]} */
		let elArrays;
		switch (alertType) {
			case 'loading':
				// prettier-ignore
				elArrays = [
					['i', { className: 'fa fa-circle-o-notch fa-spin' }, null],
					' ',
					message,
				];
				break;
			case 'success':
				// prettier-ignore
				elArrays = [
					['i', { className: 'fa fa-check-circle' }, null],
					' ',
					message,
				];
				break;
			case 'warning':
				// prettier-ignore
				elArrays = [
					['i', { className: 'fa fa-question-circle' }, null],
					' ',
					message,
				];
				break;
			case 'danger':
				// prettier-ignore
				elArrays = [
					['i', { className: 'fa fa-times-circle' }, null],
					' An error happened: ',
					['span', null, message || null],
					'. Please try again later. If the error persists, please report it on ',
					['a', { href: 'https://gitlab.com/rafaelgssa/monkey-scripts/-/issues' }, 'GitLab'],
					'.',
				];
				break;
			// no default
		}
		// prettier-ignore
		DOM.insertElements(eblaeo.alertEl, 'atinner', elArrays);
		eblaeo.alertEl.style.display = 'block';
	};

	/**
	 * Shows a confirmation dialog.
	 * @param {string} message The message to show.
	 * @param {(event: MouseEvent) => unknown | null} [onYes] Callback to call when the 'yes' button is clicked.
	 * @param {(event: MouseEvent) => unknown | null} [onNo] Callback to call when the 'no' button is clicked.
	 * @returns {Promise<void>}
	 */
	const showDialog = async (message, onYes, onNo) => {
		if (!eblaeo.dialogModalEl) {
			// prettier-ignore
			DOM.insertElements(document.body, 'beforeend', [
				['button', {
					id: 'eblaeo-dialog-modal-button',
					dataset: { toggle: 'modal', target: '#eblaeo-dialog-modal' },
					ref: (/** @type {HTMLButtonElement} */ ref) => (eblaeo.dialogModalButton = ref),
				}, null],
				['div', {
					id: 'eblaeo-dialog-modal-holder',
					ref: (/** @type {HTMLElement} */ ref) => (eblaeo.dialogModalHolderEl = ref),
				}, [
					['div', {
						id: 'eblaeo-dialog-modal',
						className: 'modal',
						attrs: { role: 'dialog' },
						tabIndex: -1,
						ref: (/** @type {HTMLElement} */ ref) => (eblaeo.dialogModalEl = ref),
					}, [
						['div', { className: 'modal-dialog' }, [
							['div', { className: 'modal-content' }, [
								['div', { className: 'modal-header' }, [
									['button', { type: 'button', dataset: { dismiss: 'modal' } }, [
										['i', { className: 'fa fa-close' }, null],
									]],
									['h4', {
										id: 'eblaeo-dialog-modal-label', className: 'modal-title',
										ref: (/** @type {HTMLElement} */ ref) => (eblaeo.dialogModalLabelEl = ref),
									}, null],
								]],
								['div', {
									className: 'modal-footer',
									ref: (/** @type {HTMLElement} */ ref) => (eblaeo.dialogModalFooterEl = ref),
								}, [
									['button', {
										type: 'button',
										className: 'btn btn-default',
										dataset: { dismiss: 'modal' },
										ref: (/** @type {HTMLElement} */ ref) => (eblaeo.dialogModalDenyButton = ref),
									}, 'No'],
									['button', {
										id: 'eblaeo-pg-dialog-modal-confirm-button',
										type: 'button',
										className: 'btn btn-primary',
										dataset: { dismiss: 'modal' },
										ref: (/** @type {HTMLElement} */ ref) => (eblaeo.dialogModalConfirmButton = ref),
									}, 'Yes'],
								]],
							]],
						]],
					]],
				]],
			]);
		}
		if (
			!eblaeo.dialogModalButton ||
			!eblaeo.dialogModalEl ||
			!eblaeo.dialogModalLabelEl ||
			!eblaeo.dialogModalFooterEl ||
			!eblaeo.dialogModalDenyButton ||
			!eblaeo.dialogModalConfirmButton
		) {
			return;
		}
		eblaeo.dialogModalLabelEl.textContent = message;
		if (onYes || onNo) {
			eblaeo.dialogModalFooterEl.style.display = 'block';
			if (onYes) {
				eblaeo.dialogModalConfirmButton.onclick = onYes;
			}
			if (onNo) {
				eblaeo.dialogModalDenyButton.onclick = onNo;
			}
		} else {
			eblaeo.dialogModalFooterEl.style.display = 'none';
		}
		eblaeo.dialogModalButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		const isModalOpen = !!(await DOM.dynamicQuerySelector(
			'#eblaeo-dialog-modal.modal.in',
			60,
			0.1
		));
		if (isModalOpen) {
			eblaeo.dialogModalEl.style.zIndex = '1070';
			const modalBackdropEl = /** @type {HTMLElement | null} */ (await DOM.dynamicQuerySelector(
				'#eblaeo-dialog-modal-holder + .modal-backdrop.in',
				60,
				0.1
			));
			if (modalBackdropEl) {
				modalBackdropEl.style.zIndex = '1060';
			}
		}
	};

	/**
	 * [SM] Settings Menu
	 * Allows the user to sync their data.
	 */

	/**
	 * Adds a button to the settings page, which allows loading the settings menu.
	 */
	const sm_addButton = () => {
		eblaeo.sm = {};
		eblaeo.sm.sidebarNavEl = /** @type {HTMLElement | null} */ (document.querySelector(
			'.nav.nav-pills.nav-stacked'
		));
		if (!eblaeo.sm.sidebarNavEl) {
			return;
		}
		const oldButton = eblaeo.sm.sidebarNavEl.querySelector('#eblaeo-sm-button');
		if (oldButton) {
			oldButton.remove();
		}
		// prettier-ignore
		[eblaeo.sm.button] = DOM.insertElements(eblaeo.sm.sidebarNavEl, 'beforeend', [
			['li', { id: 'eblaeo-sm-button', onclick: sm_loadMenu }, [
				['a', { href: '#eblaeo-sm' }, 'Enhanced BLAEO'],
			]],
		]);
		if (window.location.hash === '#eblaeo-sm') {
			sm_loadMenu();
		}
	};

	/**
	 * Loads the settings menu.
	 */
	const sm_loadMenu = () => {
		if (!eblaeo.sm.sidebarNavEl || !eblaeo.sm.button) {
			return;
		}
		eblaeo.sm.mainContainerEl = /** @type {HTMLElement | null} */ (document.querySelector(
			'.col-sm-9.col-md-10'
		));
		if (!eblaeo.sm.mainContainerEl) {
			return;
		}
		window.location.hash = '#eblaeo-sm';
		const activeButton = eblaeo.sm.sidebarNavEl.querySelector('.active');
		if (activeButton) {
			activeButton.classList.remove('active');
		}
		eblaeo.sm.button.classList.add('active');
		// prettier-ignore
		DOM.insertElements(eblaeo.sm.mainContainerEl, 'atinner', [
			['div', { className: 'panel panel-default' }, [
				['div', { className: 'panel-body' }, [
					['button', {
						type: 'button',
						className: 'btn btn-success pull-right',
						ref: (/** @type {HTMLButtonElement} */ ref) => (eblaeo.sm.syncButton = ref),
						onclick: sm_sync,
					}, [
						['i', { className: 'fa fa-refresh' }, null],
						' Sync now',
					]],
					['p', null, [
						'Your data was last synced ',
						['span', {
							title: eblaeo.user.lastSync ? Utils.getUtcString(new Date(eblaeo.user.lastSync)) : null,
							ref: (/** @type {HTMLElement} */ ref) => (eblaeo.sm.lastSyncEl = ref),
						},
							eblaeo.user.lastSync ? Utils.getRelativeTimeFromUnix(eblaeo.user.lastSync / 1e3) : 'never'
						],
						' ago.',
					]],
					['p', null, [
						'Your current username is ',
						['b', { ref: (/** @type {HTMLElement} */ ref) => (eblaeo.sm.usernameEl = ref) },
							eblaeo.user.username || '?'
						],
						' and you have ',
						['b', { ref: (/** @type {HTMLElement} */ ref) => (eblaeo.sm.ownedGamesEl = ref) },
							Object.keys(eblaeo.user.ownedGames).length.toString()
						],
						' games in your library, right?',
					]],
				]],
			]],
		]);
	};

	/**
	 * Syncs the user's data.
	 * @returns {Promise<void>}
	 */
	const sm_sync = async () => {
		if (!eblaeo.sm.mainContainerEl || !eblaeo.sm.syncButton) {
			return;
		}
		if (eblaeo.alertEl) {
			eblaeo.alertEl.style.display = 'none';
		}
		eblaeo.sm.syncButton.disabled = true;
		// prettier-ignore
		DOM.insertElements(eblaeo.sm.syncButton, 'atinner', [
			['i', { className: 'fa fa-refresh fa-spin' }, null],
			' Syncing',
		]);
		try {
			await sm_syncUsername(true);
			await sm_syncSteamId(true);
			await sm_syncAdminStatus(true);
			await sm_syncOwnedGames(true);
			await sm_finishSync();
		} catch (err) {
			if (err instanceof CustomError) {
				showAlert(eblaeo.sm.mainContainerEl, 'beforeend', 'danger', err.message);
			} else {
				showAlert(eblaeo.sm.mainContainerEl, 'beforeend', 'danger', 'failed to sync data');
			}
		}
		// prettier-ignore
		DOM.insertElements(eblaeo.sm.syncButton, 'atinner', [
			['i', { className: 'fa fa-refresh' }, null],
			' Sync now',
		]);
		eblaeo.sm.syncButton.disabled = false;
	};

	/**
	 * Syncs the user's username.
	 * @param {boolean} inSettingsMenu Whether the sync will run in the settings menu or not.
	 * @returns {Promise<void>}
	 */
	const sm_syncUsername = async (inSettingsMenu) => {
		if (!sm_shouldSync(inSettingsMenu)) {
			return;
		}
		try {
			const avatarLink = /** @type {HTMLAnchorElement | null} */ (document.querySelector(
				'.navbar-btn.btn'
			));
			if (!avatarLink) {
				throw new CustomError('could not retrieve username');
			}
			const username = avatarLink.href.split('/users/')[1] || '';
			if (eblaeo.user.username === username) {
				return;
			}
			eblaeo.user.username = username;
			await PersistentStorage.setValue('username', eblaeo.user.username);
			if (eblaeo.sm.usernameEl) {
				eblaeo.sm.usernameEl.textContent = eblaeo.user.username || '?';
			}
		} catch (err) {
			if (err instanceof CustomError) {
				throw err;
			}
			throw new CustomError('failed to sync username');
		}
	};

	/**
	 * Syncs the user's Steam ID.
	 * @param {boolean} inSettingsMenu Whether the sync will run in the settings menu or not.
	 * @returns {Promise<void>}
	 */
	const sm_syncSteamId = async (inSettingsMenu) => {
		if (eblaeo.user.steamId) {
			return;
		}
		try {
			await sm_syncUsername(inSettingsMenu);
			if (!eblaeo.user.username) {
				throw new CustomError('cannot retrieve Steam ID without username');
			}
			const user = await BlaeoApi.getUser({ username: eblaeo.user.username });
			if (!user) {
				throw new CustomError('could not retrieve Steam ID');
			}
			eblaeo.user.steamId = user.steam_id;
			await PersistentStorage.setValue('steamId', eblaeo.user.steamId);
		} catch (err) {
			if (err instanceof CustomError) {
				throw err;
			}
			throw new CustomError('failed to sync Steam ID');
		}
	};

	/**
	 * Syncs the user's admin status.
	 * @param {boolean} inSettingsMenu Whether the sync will run in the settings menu or not.
	 * @returns {Promise<void>}
	 */
	const sm_syncAdminStatus = async (inSettingsMenu) => {
		if (!sm_shouldSync(inSettingsMenu)) {
			return;
		}
		try {
			const isAdmin = !!document.querySelector('[href="/admin"]');
			if (eblaeo.user.isAdmin === isAdmin) {
				return;
			}
			eblaeo.user.isAdmin = isAdmin;
			await PersistentStorage.setValue('isAdmin', eblaeo.user.isAdmin);
		} catch (err) {
			if (err instanceof CustomError) {
				throw err;
			}
			throw new CustomError('failed to sync admin status');
		}
	};

	/**
	 * Syncs the user's owned games.
	 * @param {boolean} inSettingsMenu Whether the sync will run in the settings menu or not.
	 * @returns {Promise<void>}
	 */
	const sm_syncOwnedGames = async (inSettingsMenu) => {
		if (!sm_shouldSync(inSettingsMenu)) {
			return;
		}
		try {
			await sm_syncSteamId(inSettingsMenu);
			if (!eblaeo.user.steamId) {
				throw new CustomError('cannot retrieve owned games without Steam ID');
			}
			eblaeo.user.ownedGames = {};
			const games = (await BlaeoApi.getGames({ steamId: eblaeo.user.steamId })) || [];
			for (const game of games) {
				const { steam_id: id, progress } = game;
				eblaeo.user.ownedGames[id] = { id };
				if (progress) {
					eblaeo.user.ownedGames[id].progress = gameProgresses[progress];
				}
			}
			await PersistentStorage.setValue('ownedGames', eblaeo.user.ownedGames);
			if (eblaeo.sm.ownedGamesEl) {
				eblaeo.sm.ownedGamesEl.textContent = Object.keys(eblaeo.user.ownedGames).length.toString();
			}
			if (!inSettingsMenu) {
				await sm_finishSync();
			}
		} catch (err) {
			if (err instanceof CustomError) {
				throw err;
			}
			throw new CustomError('failed to sync owned games');
		}
	};

	/**
	 * Finishes the sync.
	 * @returns {Promise<void>}
	 */
	const sm_finishSync = async () => {
		try {
			eblaeo.user.lastSync = Date.now();
			await PersistentStorage.setValue('lastSync', eblaeo.user.lastSync);
			if (!eblaeo.sm.lastSyncEl) {
				return;
			}
			eblaeo.sm.lastSyncEl.title = Utils.getUtcString(new Date(eblaeo.user.lastSync));
			eblaeo.sm.lastSyncEl.textContent = Utils.getRelativeTimeFromUnix(eblaeo.user.lastSync / 1e3);
		} catch (err) {
			if (err instanceof CustomError) {
				throw err;
			}
			throw new CustomError('failed to finish sync');
		}
	};

	/**
	 * Checks if the sync should run.
	 * @param {boolean} inSettingsMenu Whether the sync will run in the settings menu or not.
	 * @returns {boolean} Whether the sync should run or not.
	 */
	const sm_shouldSync = (inSettingsMenu) => {
		return inSettingsMenu || Date.now() - eblaeo.user.lastSync > Utils.ONE_WEEK_IN_MILLI;
	};

	/**
	 * [AT] Admin Tools
	 * Allows administrators to easily add new users to the website.
	 */

	/**
	 * Adds buttons for users in a context element on SteamGifts, which allow them to be added to BLAEO.
	 * @param {Element} contextEl The context element where to add the buttons.
	 */
	const at_addUserButtons = (contextEl) => {
		if (!(contextEl instanceof Element)) {
			return;
		}
		const selectors = '.comment__username';
		if (contextEl.matches(selectors)) {
			at_addUserButton(/** @type {HTMLElement} */ (contextEl));
		} else {
			const elements = Array.from(
				/** @type {NodeListOf<HTMLElement>} */ (contextEl.querySelectorAll(selectors))
			);
			elements.forEach(at_addUserButton);
		}
	};

	/**
	 * Adds a button for a user on SteamGifts, which allows them to be added to BLAEO.
	 * @param {HTMLElement} usernameEl The element containing the user's username.
	 */
	const at_addUserButton = (usernameEl) => {
		const username = (usernameEl.textContent || '').trim();
		// prettier-ignore
		const [button] = DOM.insertElements(usernameEl, 'beforeend', [
			' ',
			['img', {
				className: 'eblaeo-at-user-button',
				src: `${BlaeoApi.BLAEO_URL}/logo-32x32.png`,
				alt: 'BLAEO logo',
				title: `Add ${username} to BLAEO`,
				height: 12,
				onclick: () => at_onUserButtonClick(button, username),
			}, null],
		]);
	};

	/**
	 * Triggered when a user button is clicked on SteamGifts.
	 * @param {HTMLElement | undefined} button The button.
	 * @param {string} username The user's username.
	 * @returns {Promise<void>}
	 */
	const at_onUserButtonClick = async (button, username) => {
		try {
			await at_openUserTab(username);
			if (button) {
				button.remove();
			}
		} catch (err) {
			console.log(`[${scriptName}] Failed to open BLAEO admin tab for ${username}:`, err);
			window.alert(`Failed to open BLAEO admin tab for ${username}!`);
		}
	};

	/**
	 * Opens a BLAEO admin tab to search for a user.
	 * @param {string} username The user's username.
	 * @returns {Promise<void>}
	 */
	const at_openUserTab = async (username) => {
		const response = await Requests.GET(`https://www.steamgifts.com/user/${username}`);
		if (!response.dom) {
			throw new Error('Bad request');
		}
		const steamLink = response.dom.querySelector('[href*="/profiles/"]');
		if (!steamLink) {
			throw new Error('Could not retrieve Steam ID');
		}
		const url = steamLink.getAttribute('href');
		if (!url) {
			throw new Error('Could not retrieve Steam ID');
		}
		const [, steamId] = url.split('/profiles/');
		GM.openInTab(`${BlaeoApi.BLAEO_URL}/admin/users/new?steam_id=${steamId}`, true);
	};

	/**
	 * Searches for a user on BLAEO using their Steam ID, so they can be easily added.
	 */
	const at_searchUser = () => {
		const parts = window.location.search.split('steam_id=');
		if (parts.length !== 2) {
			return;
		}
		const searchField = /** @type {HTMLInputElement | null} */ (document.querySelector(
			'[name="q"]'
		));
		const searchButton = document.querySelector('.input-group-btn .btn.btn-default');
		if (!searchField || !searchButton) {
			return;
		}
		const [, steamId] = parts;
		searchField.value = steamId;
		searchButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	};

	/**
	 * [GLC] Game List Checker
	 * Allows the user to keep track of a game list in a post and check which games they own / what their progress is.
	 */

	/**
	 * Adds a button to a post if it has a list, which allows checking the list.
	 */
	const glc_addButton = () => {
		eblaeo.glc = {};
		eblaeo.glc.postEl = /** @type {HTMLElement | null} */ (document.querySelector(
			'.panel-default.post'
		));
		if (!eblaeo.glc.postEl) {
			return;
		}
		eblaeo.glc.listItemEls = Array.from(eblaeo.glc.postEl.querySelectorAll('li'));
		if (eblaeo.glc.listItemEls.length === 0) {
			return;
		}
		// prettier-ignore
		DOM.insertElements(eblaeo.glc.postEl, 'afterbegin', [
			['div', { id: 'eblaeo-glc-button-container' }, [
				['button', {
					id: 'eblaeo-glc-button',
					type: 'button',
					className: 'btn btn-info',
					title: 'Check list',
					ref: (/** @type {HTMLButtonElement} */ ref) => (eblaeo.glc.button = ref),
					onclick: glc_checkList,
				}, [
					['i', {
						className: 'fa fa-search',
						ref: (/** @type {HTMLElement} */ ref) => (eblaeo.glc.buttonIconEl = ref),
					}, null	],
				]],
			]],
			['button', {
				id: 'eblaeo-glc-modal-button',
				dataset: { toggle: 'modal', target: '#eblaeo-glc-modal' },
				ref: (/** @type {HTMLButtonElement} */ ref) => (eblaeo.glc.modalButton = ref),
			}, null],
			['div', { id: 'eblaeo-glc-modal-holder' }, [
				['div', {
					id: 'eblaeo-glc-modal',
					className: 'modal',
					attrs: { role: 'dialog' },
					tabIndex: -1,
					ref: (/** @type {HTMLElement} */ ref) => (eblaeo.glc.modalEl = ref),
				}, [
					['div', { className: 'modal-dialog' }, [
						['div', { className: 'modal-content' }, [
							['div', { className: 'modal-header' }, [
								['button', { type: 'button', dataset: { dismiss: 'modal' } }, [
									['i', { className: 'fa fa-close' }, null],
								]],
								['h4', { id: 'eblaeo-glc-modal-label', className: 'modal-title' }, 'List check results'],
							]],
							['div', {
								className: 'modal-body markdown',
								ref: (/** @type {HTMLElement} */ ref) => (eblaeo.glc.modalBodyEl = ref),
							}, null],
						]],
					]],
				]],
			]],
		]);
	};

	/**
	 * Checks a list.
	 * @returns {Promise<void>}
	 */
	const glc_checkList = async () => {
		if (
			!eblaeo.glc.postEl ||
			!eblaeo.glc.listItemEls ||
			!eblaeo.glc.button ||
			!eblaeo.glc.buttonIconEl
		) {
			return;
		}
		if (eblaeo.glc.hasChecked) {
			return glc_showResults();
		}
		if (eblaeo.alertEl) {
			eblaeo.alertEl.style.display = 'none';
		}
		eblaeo.glc.button.disabled = true;
		eblaeo.glc.button.title = 'Checking list...';
		eblaeo.glc.buttonIconEl.className = 'fa fa-circle-o-notch fa-spin';
		try {
			await sm_syncOwnedGames(false);
			eblaeo.glc.isFirstCheck = false;
			eblaeo.glc.games = {};
			eblaeo.glc.gamesCount = 0;
			[, eblaeo.glc.postId] = window.location.pathname.split('/posts/');
			if (!eblaeo.user.glcLists[eblaeo.glc.postId]) {
				eblaeo.user.glcLists[eblaeo.glc.postId] = [];
				eblaeo.glc.isFirstCheck = true;
			}
			const oldLength = eblaeo.user.glcLists[eblaeo.glc.postId].length;
			eblaeo.glc.listItemEls.forEach(glc_checkListItem);
			const newLength = eblaeo.user.glcLists[eblaeo.glc.postId].length;
			if (newLength > 0 && newLength !== oldLength) {
				await PersistentStorage.setValue('glcLists', eblaeo.user.glcLists);
			}
			eblaeo.glc.hasChecked = true;
			eblaeo.glc.button.className = 'btn btn-success';
			eblaeo.glc.button.title = 'List checked (click to see results)';
			eblaeo.glc.buttonIconEl.className = 'fa fa-check';
			eblaeo.glc.button.disabled = false;
			return glc_showResults();
		} catch (err) {
			if (err instanceof CustomError) {
				showAlert(eblaeo.glc.postEl, 'beforebegin', 'danger', err.message);
			} else {
				showAlert(eblaeo.glc.postEl, 'beforebegin', 'danger', 'failed to check list');
			}
			eblaeo.glc.button.title = 'Check list';
			eblaeo.glc.buttonIconEl.className = 'fa fa-search';
			eblaeo.glc.button.disabled = false;
		}
	};

	/**
	 * Checks a list item.
	 * @param {HTMLElement} listItemEl The element of the list item to check.
	 */
	const glc_checkListItem = (listItemEl) => {
		if (!eblaeo.glc.games || !Utils.isSet(eblaeo.glc.gamesCount) || !eblaeo.glc.postId) {
			return;
		}
		const link = /** @type {HTMLAnchorElement | null} */ (listItemEl.querySelector(
			'[href*="store.steampowered.com/app/"]'
		));
		if (!link) {
			return;
		}
		const matches = link.href.match(/\/app\/(\d+)/);
		if (!matches) {
			return;
		}
		const id = parseInt(matches[1]);
		const name = (listItemEl.textContent || '').trim().replace(/\n*/g, '');
		eblaeo.glc.gamesCount += 1;
		let isNew = false;
		if (!eblaeo.user.glcLists[eblaeo.glc.postId].includes(id)) {
			eblaeo.user.glcLists[eblaeo.glc.postId].push(id);
			isNew = true;
		}
		const ownedGame = eblaeo.user.ownedGames[id];
		if (ownedGame && ownedGame.progress) {
			if (!eblaeo.glc.games[ownedGame.progress]) {
				eblaeo.glc.games[ownedGame.progress] = [];
			}
			// @ts-ignore
			eblaeo.glc.games[ownedGame.progress].push({ id, name, isNew });
		}
		if (!isNew || (ownedGame && ownedGame.progress)) {
			return;
		}
		if (!eblaeo.glc.games.new) {
			eblaeo.glc.games.new = [];
		}
		eblaeo.glc.games.new.push({ id, name });
	};

	/**
	 * Shows the results.
	 */
	const glc_showResults = () => {
		if (
			!eblaeo.glc.modalButton ||
			!eblaeo.glc.modalEl ||
			!eblaeo.glc.modalBodyEl ||
			!eblaeo.glc.games ||
			!Utils.isSet(eblaeo.glc.gamesCount)
		) {
			return;
		}
		eblaeo.glc.modalBodyEl.innerHTML = '';
		try {
			const entries = /** @type {[GameCategoryInfo, GlcGame[]][]} */ (
				/** @type {GameCategory[]} */ (gameCategories)
					.map((key) =>
						(key !== 'new' || !eblaeo.glc.isFirstCheck) && eblaeo.glc.games && eblaeo.glc.games[key]
							? [gameCategoryInfos[key], eblaeo.glc.games[key]]
							: null
					)
					.filter(Utils.isSet)
			);
			for (const [categoryInfo, games] of entries) {
				// prettier-ignore
				DOM.insertElements(eblaeo.glc.modalBodyEl, 'beforeend', [
					['div', {
						className: `eblaeo-glc-results-section panel panel-${categoryInfo.bootstrapClass}`,
					}, [
						['div', { className: 'panel-heading' }, categoryInfo.name],
						['div', { className: 'panel-body' }, [
							['ul', null,
								games.map((game) => /** @type {ElementArray} */ (
									['li', null, [
										game.isNew && !eblaeo.glc.isFirstCheck ? ['b', null, '[NEW] '] : null,
										['a', { href: `https://store.steampowered.com/app/${game.id}` },
											game.name || game.id.toString()
										],
									]]
								))
							],
						]],
					]],
				]);
			}
		} catch (err) {
			if (err instanceof CustomError) {
				showAlert(eblaeo.glc.modalBodyEl, 'atinner', 'danger', err.message);
			} else {
				showAlert(eblaeo.glc.modalBodyEl, 'atinner', 'danger', 'failed to load list check results');
			}
		}
		eblaeo.glc.modalButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		const counterEl = document.querySelector('[id*="counter"]');
		if (!counterEl) {
			return;
		}
		// prettier-ignore
		DOM.insertElements(counterEl, 'atinner', [
			['font', { size: '4' }, [
				['b', null, `${eblaeo.glc.gamesCount} Games`],
			]],
		]);
	};

	/**
	 * [PG] Post Generator
	 * Allows the user to easily generate posts.
	 */

	/**
	 * Adds a button to the new post page, which allows generating posts.
	 * @returns {Promise<void> | void}
	 */
	const pg_addButton = () => {
		eblaeo.pg = {};
		eblaeo.pg.postField = /** @type {HTMLTextAreaElement | null} */ (document.querySelector(
			'[name="post[text]"]'
		));
		eblaeo.pg.previewButton = /** @type {HTMLElement | null} */ (document.querySelector(
			'#get-preview'
		));
		eblaeo.pg.createButton = /** @type {HTMLElement | null} */ (document.querySelector(
			'.btn.btn-primary.pull-right'
		));
		if (!eblaeo.pg.postField || !eblaeo.pg.previewButton || !eblaeo.pg.createButton) {
			return;
		}
		pg_loadInitialValues();
		eblaeo.pg.createButton.addEventListener('click', pg_deleteCaches);
		// prettier-ignore
		DOM.insertElements(eblaeo.pg.createButton, 'afterend', [
			['button', {
				id: 'eblaeo-pg-generate-button',
				type: 'button',
				className: 'btn btn-default pull-right',
				dataset: { toggle: 'modal', target: '#eblaeo-pg-modal' },
				ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.generateButton = ref),
				onclick: pg_focusSearchGamesField,
			}, 'Generate'],
		]);
		// prettier-ignore
		DOM.insertElements(document.body, 'beforeend', [
			['div', { id: 'eblaeo-pg-modal-holder' }, [
				['div', {
					id: 'eblaeo-pg-modal',
					className: 'modal',
					attrs: { role: 'dialog' },
					tabIndex: -1,
					ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.modalEl = ref),
				}, [
					['div', { className: 'modal-dialog modal-lg' }, [
						['div', { className: 'modal-content' }, [
							['div', { className: 'modal-header' }, [
								['button', { type: 'button', dataset: { dismiss: 'modal' } }, [
									['i', { className: 'fa fa-close' }, null],
								]],
								['h4', { id: 'eblaeo-pg-modal-label', className: 'modal-title' }, 'Generate post'],
							]],
							['div', {
								className: 'modal-body',
								ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.modalBodyEl = ref),
							}, [
								['input', {
									id: 'eblaeo-pg-search-games',
									type: 'text',
									className: 'form-control',
									placeholder: 'Start typing to search for games …',
									dataset: { target: '#eblaeo-pg-search-games-results' },
									ref: (/** @type {HTMLInputElement} */ ref) => (eblaeo.pg.searchGamesField = ref),
									oninput: pg_searchGames,
								}, null],
								['br', null, null],
								['div', {
									id: 'eblaeo-pg-search-games-results',
									ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.searchGamesResultsEl = ref),
								}, null],
								['br', null, null],
								['div', {
									id: 'eblaeo-pg-generator',
									className: 'panel panel-default',
									ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.generatorEl = ref),
								}, [
									['div', { className: 'panel-heading' }, 'Generator'],
									['div', {
										id: 'eblaeo-pg-generator-body',
										className: 'panel-body',
										ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.generatorBodyEl = ref),
									}, pg_getGeneratorBody()],
								]],
								['div', {
									id: 'eblaeo-pg-game-preview-container',
									ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.gamePreviewContainerEl = ref),
								}, [
									['div', {
										id: 'eblaeo-pg-game-preview',
										className: 'panel panel-default',
										ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.gamePreviewEl = ref),
									}, [
										['div', {
											className: 'panel-heading',
											dataset: { toggle: 'collapse', target: '#eblaeo-pg-game-preview-body' },
										}, [
											'Game preview',
											['span', { className: 'eblaeo-pg-collapse' }, [
												'Collapse ',
												['i', { className: 'fa fa-level-up' }],
											]],
											['span', { className: 'eblaeo-pg-expand' }, [
												'Expand ',
												['i', { className: 'fa fa-level-down' }],
											]],
										]],
										['div', {
											id: 'eblaeo-pg-game-preview-body',
											className: 'panel-body collapse in',
											ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.gamePreviewBodyEl = ref),
										}, null],
										['div', { className: 'panel-footer' }, [
											['button', {
												id: 'eblaeo-pg-game-preview-button',
												type: 'button',
												className: 'btn btn-primary pull-right',
												ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.gamePreviewButton = ref),
											}, null],
											['div', { className: 'clear-both' }, null],
										]],
									]],
								]],
								['div', {
									id: 'eblaeo-pg-full-preview',
									className: 'panel panel-default',
									ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.fullPreviewEl = ref),
								}, [
									['div', {
										className: 'panel-heading',
										dataset: { toggle: 'collapse', target: '#eblaeo-pg-full-preview-body' },
									}, [
										'Full preview',
										['span', { className: 'eblaeo-pg-collapse' }, [
											'Collapse ',
											['i', { className: 'fa fa-level-up' }],
										]],
										['span', { className: 'eblaeo-pg-expand' }, [
											'Expand ',
											['i', { className: 'fa fa-level-down' }],
										]],
									]],
									['div', {
										id: 'eblaeo-pg-full-preview-body',
										className: 'panel-body collapse in',
										ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.fullPreviewBodyEl = ref),
									}, null],
								]],
							]],
							['div', { className: 'modal-footer' }, [
								['button', {
									type: 'button',
									className: 'btn btn-default',
									dataset: { dismiss: 'modal' },
								}, 'Cancel'],
								['button', {
									id: 'eblaeo-pg-done-button',
									type: 'button',
									className: 'btn btn-primary',
									dataset: { dismiss: 'modal' },
									ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.doneButton = ref),
									onclick: pg_generatePost,
								}, 'Done'],
							]],
						]],
					]],
				]],
			]],
		]);
		return pg_loadCaches();
	};

	/**
	 * Loads the initial values.
	 */
	const pg_loadInitialValues = () => {
		const defaultPresetBase = /** @type {PgPresetBase} */ ({
			showPlaytimeThisMonth: false,
			playtimeTemplate: '%playtime% playtime',
			linkAchievements: true,
			achievementsTemplate: '%achievements_unlocked% of %achievements_total% achievements',
			noAchievementsTemplate: 'no achievements',
			checkScreenshots: false,
			linkScreenshots: true,
			screenshotsTemplate: '%screenshots_count% screenshots',
			noScreenshotsTemplate: 'no screenshots',
			bgType: 'Solid',
			bgColor1: '#ffffff',
			bgColor2: '#000000',
			titleColor: '#555555',
			textColor: '#333333',
			linkColor: '#337ab7',
		});
		eblaeo.pg.defaultPresets = {
			'Box default': {
				type: 'box',
				name: 'Box default',
				prefs: {
					...defaultPresetBase,
					reviewPosition: 'Left',
				},
			},
			'Bar default': {
				type: 'bar',
				name: 'Bar default',
				prefs: {
					showInfoInOneLine: false,
					...defaultPresetBase,
					achievementsTemplate:
						'%achievements_unlocked% of %achievements_total% achievements (%achievements_percentage%%)',
					titleColor: '#333333',
					completionBarPosition: 'Left',
					imagePosition: 'Left',
					useCollapsibleReview: false,
					reviewTriggerMethod: 'Bar click',
				},
			},
			'Panel default': {
				type: 'panel',
				name: 'Panel default',
				prefs: {
					...defaultPresetBase,
					achievementsTemplate:
						'%achievements_unlocked% of %achievements_total% achievements (%achievements_percentage%%)',
					usePredefinedTheme: true,
					predefinedThemeColor: 'Blue',
					useCustomTheme: false,
					useCollapsibleReview: false,
				},
			},
			'Custom default': {
				type: 'custom',
				name: 'Custom default',
				prefs: {
					htmlTemplate: '',
				},
			},
		};
		eblaeo.pg.defaultGame = {
			id: 0,
			name: '',
			image: '',
			progress: 'uncategorized',
			playtime: {
				thisMonth: 0,
				total: 0,
			},
			achievements: {
				unlocked: 0,
				total: 0,
			},
			screenshotsCount: 0,
			customHtml: '',
			rating: '',
			review: '',
			preset: {
				...eblaeo.pg.defaultPresets['Box default'],
				prefs: {
					...eblaeo.pg.defaultPresets['Box default'].prefs,
				},
			},
		};
		eblaeo.pg.presetTypes = ['box', 'bar', 'panel', 'custom'];
		eblaeo.pg.presetTypeNames = {
			box: 'Box',
			bar: 'Bar',
			panel: 'Panel',
			custom: 'Custom',
		};
		eblaeo.pg.presets = {
			box: {
				...eblaeo.pg.defaultPresets['Box default'],
				prefs: {
					...eblaeo.pg.defaultPresets['Box default'].prefs,
				},
			},
			bar: {
				...eblaeo.pg.defaultPresets['Bar default'],
				prefs: {
					...eblaeo.pg.defaultPresets['Bar default'].prefs,
				},
			},
			panel: {
				...eblaeo.pg.defaultPresets['Panel default'],
				prefs: {
					...eblaeo.pg.defaultPresets['Panel default'].prefs,
				},
			},
			custom: {
				...eblaeo.pg.defaultPresets['Custom default'],
				prefs: {
					...eblaeo.pg.defaultPresets['Custom default'].prefs,
				},
			},
		};
		eblaeo.pg.currentPresetType = 'box';
		eblaeo.pg.gameInfos = [];
		eblaeo.pg.selectedGame = null;
		eblaeo.pg.isEditing = false;
		eblaeo.pg.presetTabNavEls = {};
		eblaeo.pg.presetTabEls = {};
		eblaeo.pg.presetDropdownEls = {};
		eblaeo.pg.fieldContainerEls = {
			presets: {
				box: {},
				bar: {},
				panel: {},
				custom: {},
			},
		};
		eblaeo.pg.fields = {
			presets: {
				box: {},
				bar: {},
				panel: {},
				custom: {},
			},
		};
		eblaeo.pg.isSearchingGames = false;
		eblaeo.pg.hasNewGameSearchQuery = false;
	};

	/**
	 * Returns element arrays for the generator body.
	 * @returns {ElementArray[]} The element arrays for the body.
	 */
	const pg_getGeneratorBody = () => {
		if (!eblaeo.pg.presetTypeNames) {
			return [];
		}
		// prettier-ignore
		return /** @type {ElementArray[]} */ ([
			['div', null, [
				['p', null, 'These placeholders are replaced with info about you:'],
				['ul', null, [
					['li', null, [['b', null, '%steamid%'], ' - Your Steam ID.']],
					['li', null, [['b', null, '%username%'], ' - Your BLAEO username (this can be your SteamGifts or Steam username depending on your BLAEO settings).']],
				]],
				['p', null, 'These placeholders are replaced with info about the game:'],
				['ul', null, [
					['li', null, [['b', null, '%id%'], ' - The Steam ID of the game.']],
					['li', null, [['b', null, '%name%'], ' - The name of the game.']],
					['li', null, [['b', null, '%image%'], ' - The URL of the game image.']],
					['li', null, [['b', null, '%progress%'], " - The progress of the game ('uncategorized', 'never-played', 'unfinished', 'beaten', 'completed' or 'wont-play')"]],
					['li', null, [['b', null, '%progress_name%'], " - The name for the progress of the game ('Uncategorized', 'Never Played', 'Unfinished', 'Beaten', 'Completed' or \"Won't Play\")"]],
					['li', null, [['b', null, '%progress_color%'], ' - The HEX color for the progress of the game.']],
					['li', null, [['b', null, '%playtime%'], " - Your playtime in the '12 hours' format."]],
					['li', null, [['b', null, '%playtime_this_month%'], " - Your playtime this month in the '12 hours' format."]],
					['li', null, [['b', null, '%achievements%'], " - Your achievements in the 'X of Y achievements' or 'no achievements' format."]],
					['li', null, [['b', null, '%achievements_unlocked%'], ' - The number of achievements you have unlocked in the game.']],
					['li', null, [['b', null, '%achievements_total%'], ' - The total number of achievements in the game.']],
					['li', null, [['b', null, '%achievements_percentage%'], ' - The percentage of achievements you have unlocked in the game.']],
					['li', null, [['b', null, '%screenshots%'], " - Your screenshots in the 'X screenshots' or 'no screenshots' format (if the option to check screenshots is enabled)."]],
					['li', null, [['b', null, '%screenshots_count%'], ' - The number of screenshots you have taken for the game (if the option to check screenshots is enabled)']],
				]],
				['br', null, null],
				['ul', {
					id: 'eblaeo-pg-generator-nav',
					className: 'nav nav-tabs',
					attrs: { role: 'tablist' },
					ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.generatorNavEl = ref),
				},
					/** @type [PgPresetType, string][] */ (Object.entries(eblaeo.pg.presetTypeNames)).map(
						pg_getPresetTabNav
					)
				],
				['div', { className: 'tab-content' }, [
					pg_getBoxTab(),
					pg_getBarTab(),
					pg_getPanelTab(),
					pg_getCustomTab(),
				]],
				['div', { className: 'form-group' }, [
					pg_getField(null, {
						type: 'textarea',
						id: 'review',
						htmlId: 'review',
						label: 'Review',
						usePlaceholders: true,
					}),
				]],
				['div', { className: 'form-group' }, [
					pg_getField(null, {
						type: 'text',
						id: 'presetName',
						htmlId: 'preset-name',
						label: 'Preset name',
						description: 'Save these preferences as a preset to quickly reuse later.',
					}),
				]],
				['button', {
					id: 'eblaeo-pg-save-preset-button',
					type: 'button',
					className: 'btn btn-default',
					ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.savePresetButton = ref),
					onclick: pg_savePreset,
				}, 'Save preset'],
				['br', null, null],
				['br', null, null],
			]],
		]);
	};

	/**
	 * Returns an element array for a preset tab nav.
	 * @param {[PgPresetType, string]} presetTypeNameEntry The preset type and name for the tab nav.
	 * @returns {ElementArray} The element array for the tab nav.
	 */
	const pg_getPresetTabNav = ([presetType, presetName]) => {
		if (!eblaeo.pg.presetTabNavEls) {
			return null;
		}
		const tabId = `eblaeo-pg-tab-${presetType}`;
		// prettier-ignore
		return /** @type {ElementArray} */ (
			['li', {
				attrs: { role: 'presentation' },
				// @ts-expect-error
				ref: (/** @type {HTMLElement} */ ref) => eblaeo.pg.presetTabNavEls[presetType] = ref,
			}, [
				['a', {
					href: `#${tabId}`,
					attrs: { role: 'tab' },
					dataset: { toggle: 'tab' },
					onclick: () => pg_changeCurrentPreset(presetType),
				}, presetName],
			]]
		);
	};

	/**
	 * Returns an element array for a box tab.
	 * @returns {ElementArray} The element array for the tab.
	 */
	const pg_getBoxTab = () => {
		if (!eblaeo.pg.presetTabEls) {
			return null;
		}
		// prettier-ignore
		return /** @type {ElementArray} */ (
			['div', {
				id: 'eblaeo-pg-tab-box',
				className: 'tab-pane',
				attrs: { role: 'tabpanel' },
				// @ts-expect-error
				ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.presetTabEls.box = ref),
			}, [
				['div', { className: 'form-group' }, [
					pg_getPresetDropdown('box'),
					['br', null, null],
					...pg_getPresetBaseFields('box'),
					pg_getField('box', {
						type: 'select',
						id: 'reviewPosition',
						htmlId: 'review-position',
						label: 'Review position',
						selectOptions: ['Left', 'Right'],
					}),
				]],
			]]
		);
	};

	/**
	 * Returns an element array for a bar tab.
	 * @returns {ElementArray} The element array for the tab.
	 */
	const pg_getBarTab = () => {
		if (!eblaeo.pg.presetTabEls) {
			return null;
		}
		const presetBaseFields = pg_getPresetBaseFields('bar');
		// prettier-ignore
		return /** @type {ElementArray} */ (
			['div', {
				id: 'eblaeo-pg-tab-bar',
				className: 'tab-pane',
				attrs: { role: 'tabpanel' },
				// @ts-expect-error
				ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.presetTabEls.bar = ref),
			}, [
				['div', { className: 'form-group' }, [
					pg_getPresetDropdown('bar'),
					['br', null, null],
					pg_getField('bar', {
						type: 'checkbox',
						id: 'showInfoInOneLine',
						htmlId: 'show-info-in-one-line',
						label: 'Show playtime, achievements and screenshots in one line.',
					}),
					...presetBaseFields.slice(0, 9),
					pg_getField(null, {
						type: 'text',
						id: 'customHtml',
						htmlId: 'custom-html',
						label: 'Custom HTML',
						usePlaceholders: true,
						description: 'Forces playtime, achievements and screenshots to be shown in one line, and shows the custom HTML below the line.'
					}),
					['div', { className: 'eblaeo-pg-double-field-container' }, [
						pg_getField('bar', {
							type: 'select',
							id: 'completionBarPosition',
							htmlId: 'completion-bar-position',
							label: 'Completion bar position',
							selectOptions: ['Left', 'Right', 'Hidden'],
						}),
						pg_getField('bar', {
							type: 'select',
							id: 'imagePosition',
							htmlId: 'image-position',
							label: 'Image position',
							selectOptions: ['Left', 'Right'],
						}),
					]],
					...presetBaseFields.slice(9),
					pg_getField('bar', {
						type: 'checkbox',
						id: 'useCollapsibleReview',
						htmlId: 'use-collapsible-review',
						label: 'Use collapsible review.',
					}),
					pg_getField('bar', {
						type: 'select',
						id: 'reviewTriggerMethod',
						htmlId: 'review-trigger-method',
						label: 'Review trigger method',
						selectOptions: ['Bar click', 'Button click'],
					}),
				]],
			]]
		);
	};

	/**
	 * Returns an element array for a panel tab.
	 * @returns {ElementArray} The element array for the tab.
	 */
	const pg_getPanelTab = () => {
		if (!eblaeo.pg.presetTabEls) {
			return null;
		}
		const presetBaseFields = pg_getPresetBaseFields('panel');
		// prettier-ignore
		return /** @type {ElementArray} */ (
			['div', {
				id: 'eblaeo-pg-tab-panel',
				className: 'tab-pane',
				attrs: { role: 'tabpanel' },
				// @ts-expect-error
				ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.presetTabEls.panel = ref),
			}, [
				['div', { className: 'form-group' }, [
					pg_getPresetDropdown('panel'),
					['br', null, null],
					pg_getField(null, {
						type: 'text',
						id: 'rating',
						htmlId: 'rating',
						label: 'Rating',
					}),
					...presetBaseFields.slice(0, 9),
					pg_getField('panel', {
						type: 'radio',
						id: 'usePredefinedTheme',
						htmlId: 'use-predefined-theme',
						label: 'Use predefined theme.',
					}),
					pg_getField('panel', {
						type: 'select',
						id: 'predefinedThemeColor',
						htmlId: 'predefined-theme-color',
						label: 'Predefined theme color',
						selectOptions: ['Blue', 'Green', 'Grey', 'Red', 'Yellow'],
					}),
					pg_getField('panel', {
						type: 'radio',
						id: 'useCustomTheme',
						htmlId: 'use-custom-theme',
						label: 'Use custom theme.',
					}),
					...presetBaseFields.slice(9),
					pg_getField('panel', {
						type: 'checkbox',
						id: 'useCollapsibleReview',
						htmlId: 'use-collapsible-review',
						label: 'Use collapsible review.',
					}),
				]],
			]]
		);
	};

	/**
	 * Returns an element array for a custom tab.
	 * @returns {ElementArray} The element array for the tab.
	 */
	const pg_getCustomTab = () => {
		if (!eblaeo.pg.presetTabEls) {
			return null;
		}
		// prettier-ignore
		return /** @type {ElementArray} */ (
			['div', {
				id: 'eblaeo-pg-tab-custom',
				className: 'tab-pane',
				attrs: { role: 'tabpanel' },
				// @ts-expect-error
				ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.presetTabEls.custom = ref),
			}, [
				['div', { className: 'form-group' }, [
					pg_getPresetDropdown('custom'),
					['br', null, null],
					pg_getField('custom', {
						type: 'textarea',
						id: 'htmlTemplate',
						htmlId: 'html-template',
						label: 'Custom HTML template',
						usePlaceholders: true,
						useReviewPlaceholder: true,
					}),
				]],
			]]
		);
	};

	/**
	 * Returns an element array for a preset dropdown.
	 * @param {PgPresetType} presetType The preset type for the dropdown.
	 * @returns {ElementArray} The element array for the dropdown.
	 */
	const pg_getPresetDropdown = (presetType) => {
		if (!eblaeo.pg.presetDropdownEls) {
			return null;
		}
		const buttonId = `eblaeo-pg-apply-preset-button-${presetType}`;
		const presets = Object.values(eblaeo.user.pgPresets).filter(
			(preset) => preset.type === presetType
		);
		// prettier-ignore
		return /** @type {ElementArray} */ (
			['div', {
				className: 'dropdown',
				// @ts-expect-error
				ref: (/** @type {HTMLElement} */ ref) => (eblaeo.pg.presetDropdownEls[presetType] = ref),
			}, [
				['button', { id: buttonId, type: 'button', dataset: { toggle: 'dropdown' } }, [
					`Apply ${presetType} preset`,
					['span', { className: 'caret' }, null],
				]],
				['ul', { id: `eblaeo-pg-preset-dropdown-${presetType}`, className: 'dropdown-menu' },
					presets.length > 0 ? presets.map(pg_getPresetDropdownListItem) : null
				],
			]]
		);
	};

	/**
	 * Returns an element array for a preset dropdown list item.
	 * @param {PgPreset<PgPresetType>} preset The preset for the list item.
	 * @returns {ElementArray} The element array for the list item.
	 */
	const pg_getPresetDropdownListItem = (preset) => {
		/** @type {HTMLElement} */
		let listItemEl;
		// prettier-ignore
		return /** @type {ElementArray} */ (
			['li', { ref: (/** @type {HTMLElement} */ ref) => (listItemEl = ref) }, [
				['a', { onclick: () => pg_applyPreset(preset.type, preset.name) }, preset.name],
				['i', {
					className: 'fa fa-trash',
					title: 'Delete preset',
					onclick: () => pg_deletePreset(preset.type, preset.name, listItemEl),
				}, null],
			]]
		);
	};

	/**
	 * Returns element arrays for preset base fields.
	 * @param {PgPresetType} presetType The preset type for the fields.
	 * @returns {ElementArray[]} The element arrays for the fields.
	 */
	const pg_getPresetBaseFields = (presetType) => {
		// prettier-ignore
		return /** @type {ElementArray[]} */ ([
			pg_getField(presetType, {
				type: 'checkbox',
				id: 'showPlaytimeThisMonth',
				htmlId: 'show-playtime-this-month',
				label: 'Show your playtime for the game this month.',
			}),
			pg_getField(presetType, {
				type: 'text',
				id: 'playtimeTemplate',
				htmlId: 'playtime-template',
				label: 'Playtime template',
				usePlaceholders: true,
			}),
			pg_getField(presetType, {
				type: 'checkbox',
				id: 'linkAchievements',
				htmlId: 'link-achievements',
				label: 'Link achievements to your achievements page for the game.',
			}),
			pg_getField(presetType, {
				type: 'text',
				id: 'achievementsTemplate',
				htmlId: 'achievements-template',
				label: 'Achievements template',
				usePlaceholders: true,
			}),
			pg_getField(presetType, {
				type: 'text',
				id: 'noAchievementsTemplate',
				htmlId: 'no-achievements-template',
				label: 'No achievements template',
				usePlaceholders: true,
			}),
			pg_getField(presetType, {
				type: 'checkbox',
				id: 'checkScreenshots',
				htmlId: 'check-screenshots',
				label: 'Check if you have screenshots for the game.',
			}),
			pg_getField(presetType, {
				type: 'checkbox',
				id: 'linkScreenshots',
				htmlId: 'link-screenshots',
				label: 'Link screenshots to your screenshots page for the game.',
			}),
			pg_getField(presetType, {
				type: 'text',
				id: 'screenshotsTemplate',
				htmlId: 'screenshots-template',
				label: 'Screenshots template',
				usePlaceholders: true,
			}),
			pg_getField(presetType, {
				type: 'text',
				id: 'noScreenshotsTemplate',
				htmlId: 'no-screenshots-template',
				label: 'No screenshots template',
				usePlaceholders: true,
			}),
			pg_getField(presetType, {
				type: 'select',
				id: 'bgType',
				htmlId: 'bg-type',
				label: 'Background type',
				selectOptions: ['Solid', 'Horizontal gradient', 'Vertical gradient'],
			}),
			['div', { className: 'eblaeo-pg-double-field-container' }, [
				pg_getField(presetType, {
					type: 'color',
					id: 'bgColor1',
					htmlId: 'bg-color-1',
					label: 'Background color 1',
				}),
				pg_getField(presetType, {
					type: 'color',
					id: 'bgColor2',
					htmlId: 'bg-color-2',
					label: 'Background color 2',
				}),
			]],
			['div', { className: 'eblaeo-pg-triple-field-container' }, [
				pg_getField(presetType, {
					type: 'color',
					id: 'titleColor',
					htmlId: 'title-color',
					label: 'Title color',
				}),
				pg_getField(presetType, {
					type: 'color',
					id: 'textColor',
					htmlId: 'text-color',
					label: 'Text color',
				}),
				pg_getField(presetType, {
					type: 'color',
					id: 'linkColor',
					htmlId: 'link-color',
					label: 'Link color',
				}),
			]],
		]);
	};

	/**
	 * Returns element arrays for a field.
	 * @param {PgPresetType | null} presetType The preset type for the field, if any.
	 * @param {PgFieldOptions} options The options for the field.
	 * @returns {ElementArray[]} The element arrays for the field.
	 */
	const pg_getField = (presetType, options) => {
		let elArrays = /** @type {ElementArray[]} */ ([]);
		const fieldId = `eblaeo-pg-${presetType ? `${presetType}-` : ''}${options.htmlId}`;
		switch (options.type) {
			case 'textarea':
			case 'text':
			case 'color':
				// prettier-ignore
				elArrays.push(['label', { htmlFor: fieldId }, `${options.label}:`]);
				if (options.usePlaceholders) {
					// prettier-ignore
					elArrays.push(
						['p', null, `You can use placeholders here. ${
							options.useReviewPlaceholder
								? 'Additionally, place `<div id="review-%username%-%id%"></div>` (without the `) where you want the review to appear.'
								: ''
						} ${options.description || ''}`]
					);
				} else if (options.description) {
					// prettier-ignore
					elArrays.push(['p', null, options.description]);
				}
				if (options.type === 'textarea') {
					// prettier-ignore
					elArrays.push(
						['textarea', {
							id: fieldId,
							className: 'form-control',
							rows: 5,
							ref: (/** @type {HTMLElement} */ ref) => pg_assignField(ref, presetType, options),
							onchange: options.id === 'review' ? pg_gamePreview : null,
							oninput: options.id === 'review' ? null : pg_gamePreview,
						}, null]
					);
				} else {
					// prettier-ignore
					elArrays.push(
						['input', {
							id: fieldId,
							type: options.type,
							className: 'form-control',
							ref: (/** @type {HTMLElement} */ ref) => pg_assignField(ref, presetType, options),
							oninput: pg_gamePreview,
						}, null]
					);
				}
				break;
			case 'checkbox':
				// prettier-ignore
				elArrays.push(
					['div', { className: 'checkbox' }, [
						['label', { htmlFor: fieldId }, [
							['input', {
								id: fieldId,
								type: 'checkbox',
								ref: (/** @type {HTMLElement} */ ref) => pg_assignField(ref, presetType, options),
								onchange: pg_gamePreview,
							}, null],
							options.label,
						]],
					]]
				);
				break;
			case 'radio':
				// prettier-ignore
				elArrays.push(
					['div', { className: 'radio' }, [
						['label', { htmlFor: fieldId }, [
							['input', {
								id: fieldId,
								type: 'radio',
								name: 'optradio',
								ref: (/** @type {HTMLElement} */ ref) => pg_assignField(ref, presetType, options),
								onchange: pg_gamePreview,
							}, null],
							options.label,
						]],
					]]
				);
				break;
			case 'select':
				// prettier-ignore
				elArrays.push(
					['label', { htmlFor: fieldId }, `${options.label}:`],
					['select', {
						id: fieldId,
						className: 'form-control',
						ref: (/** @type {HTMLElement} */ ref) => pg_assignField(ref, presetType, options),
						onchange: pg_gamePreview,
					},
						options.selectOptions.map((option) => /** @type {ElementArray} */ (
							['option', null, option]
						))
					]
				);
				break;
		}
		// prettier-ignore
		elArrays = ['div', {
			className: 'eblaeo-pg-field-container',
			ref: (/** @type {HTMLElement} */ ref) => pg_assignFieldContainer(ref, presetType, options),
		}, elArrays];
		return elArrays;
	};

	/**
	 * Assigns a field container to a variable.
	 * @param {HTMLElement} field The field container to assign.
	 * @param {PgPresetType | null} presetType The preset type for the field container, if any.
	 * @param {PgFieldOptions} options The options for the field container.
	 */
	const pg_assignFieldContainer = (field, presetType, options) => {
		if (!eblaeo.pg.fieldContainerEls) {
			return;
		}
		if (presetType) {
			// @ts-expect-error
			eblaeo.pg.fieldContainerEls.presets[presetType][options.id] = field;
		} else {
			// @ts-expect-error
			eblaeo.pg.fieldContainerEls[options.id] = field;
		}
	};

	/**
	 * Assigns a field to a variable.
	 * @param {HTMLElement} field The field to assign.
	 * @param {PgPresetType | null} presetType The preset type for the field, if any.
	 * @param {PgFieldOptions} options The options for the field.
	 */
	const pg_assignField = (field, presetType, options) => {
		if (!eblaeo.pg.fields) {
			return;
		}
		if (presetType) {
			// @ts-expect-error
			eblaeo.pg.fields.presets[presetType][options.id] = field;
		} else {
			// @ts-expect-error
			eblaeo.pg.fields[options.id] = field;
		}
	};

	/**
	 * Changes the current preset.
	 * @param {PgPresetType} presetType The type of the new preset.
	 */
	const pg_changeCurrentPreset = (presetType) => {
		eblaeo.pg.currentPresetType = presetType;
		if (!eblaeo.pg.presets || !eblaeo.pg.selectedGame) {
			return;
		}
		eblaeo.pg.selectedGame.preset = eblaeo.pg.presets[presetType];
		pg_selectGame(eblaeo.pg.selectedGame, eblaeo.pg.isEditing || false);
	};

	/**
	 * Applies a preset.
	 * @param {PgPresetType} presetType The type of the preset to apply.
	 * @param {string} presetName The name of the preset to apply.
	 */
	const pg_applyPreset = (presetType, presetName) => {
		if (
			!eblaeo.pg.defaultPresets ||
			!eblaeo.pg.presetTypeNames ||
			!eblaeo.pg.presets ||
			!eblaeo.pg.selectedGame ||
			!eblaeo.pg.fields ||
			!eblaeo.pg.fields.presetName
		) {
			return;
		}
		const preset =
			eblaeo.user.pgPresets[presetName] ||
			eblaeo.pg.defaultPresets[presetName] ||
			eblaeo.pg.defaultPresets[`${eblaeo.pg.presetTypeNames[presetType]}} default`];
		eblaeo.pg.presets[presetType] = {
			...preset,
			prefs: {
				...preset.prefs,
			},
		};
		eblaeo.pg.currentPresetType = presetType;
		eblaeo.pg.selectedGame.preset = eblaeo.pg.presets[presetType];
		eblaeo.pg.fields.presetName.value = eblaeo.pg.presets[presetType].name;
		pg_selectGame(eblaeo.pg.selectedGame, eblaeo.pg.isEditing || false);
	};

	/**
	 * Deletes a preset.
	 * @param {PgPresetType} presetType The type of the preset to delete.
	 * @param {string} presetName The name of the preset to delete.
	 * @param {HTMLElement} [listItemEl] The element of the list item for the preset, if any.
	 */
	const pg_deletePreset = (presetType, presetName, listItemEl) => {
		showDialog('Are you sure you want to delete this preset?', async () => {
			const contextEl = eblaeo.pg.presetDropdownEls && eblaeo.pg.presetDropdownEls[presetType];
			if (!contextEl) {
				return;
			}
			try {
				delete eblaeo.user.pgPresets[presetName];
				await PersistentStorage.setValue('pgPresets', eblaeo.user.pgPresets);
				if (listItemEl) {
					listItemEl.remove();
				}
				showAlert(contextEl, 'afterend', 'success', 'Preset deleted!');
			} catch (err) {
				if (err instanceof CustomError) {
					showAlert(contextEl, 'afterend', 'danger', err.message);
				} else {
					showAlert(contextEl, 'afterend', 'danger', 'failed to delete preset');
				}
			}
		});
	};

	/**
	 * Saves the current preset.
	 * @returns Promise<void>
	 */
	const pg_savePreset = async () => {
		if (
			!eblaeo.pg.presets ||
			!eblaeo.pg.currentPresetType ||
			!eblaeo.pg.presetDropdownEls ||
			!eblaeo.pg.fields ||
			!eblaeo.pg.fields.presetName ||
			!eblaeo.pg.savePresetButton
		) {
			return;
		}
		try {
			eblaeo.pg.savePresetButton.textContent = 'Saving...';
			const presetName =
				eblaeo.pg.fields.presetName.value ||
				`Untitled preset ${Object.keys(eblaeo.user.pgPresets).length + 1}`;
			const currentPreset = eblaeo.pg.presets[eblaeo.pg.currentPresetType];
			eblaeo.user.pgPresets[presetName] = {
				...currentPreset,
				name: presetName,
				prefs: {
					...currentPreset.prefs,
				},
			};
			await PersistentStorage.setValue('pgPresets', eblaeo.user.pgPresets);
			const dropdownEl = eblaeo.pg.presetDropdownEls[eblaeo.pg.currentPresetType];
			if (dropdownEl) {
				const dropdownListEl = dropdownEl.lastElementChild;
				if (dropdownListEl) {
					// prettier-ignore
					DOM.insertElements(dropdownListEl, 'beforeend', [
						pg_getPresetDropdownListItem(eblaeo.user.pgPresets[presetName])
					]);
				}
			}
			showAlert(eblaeo.pg.savePresetButton, 'afterend', 'success', 'Preset saved!');
		} catch (err) {
			if (err instanceof CustomError) {
				showAlert(eblaeo.pg.savePresetButton, 'afterend', 'danger', err.message);
			} else {
				showAlert(eblaeo.pg.savePresetButton, 'afterend', 'danger', 'failed to save preset');
			}
		}
		eblaeo.pg.savePresetButton.textContent = 'Save preset';
	};

	/**
	 * Gives focus to the search games field when the modal is open.
	 * @returns {Promise<void>}
	 */
	const pg_focusSearchGamesField = async () => {
		if (!eblaeo.pg.searchGamesField) {
			return;
		}
		const isModalOpen = !!(await DOM.dynamicQuerySelector('#eblaeo-pg-modal.modal.in', 60, 0.1));
		if (isModalOpen) {
			eblaeo.pg.searchGamesField.focus();
		}
	};

	/**
	 * Searches for games.
	 * @returns {Promise<void>}
	 */
	const pg_searchGames = async () => {
		if (!eblaeo.pg.searchGamesField || !eblaeo.pg.searchGamesResultsEl) {
			return;
		}
		if (eblaeo.pg.isSearchingGames) {
			eblaeo.pg.hasNewGameSearchQuery = true;
			return;
		}
		try {
			eblaeo.pg.isSearchingGames = true;
			eblaeo.pg.searchGamesResultsEl.innerHTML = '';
			await sm_syncSteamId(false);
			const query = eblaeo.pg.searchGamesField.value;
			if (query) {
				const listEl = await BlaeoApi.searchGames({ steamId: eblaeo.user.steamId }, query);
				if (listEl) {
					eblaeo.pg.searchGamesResultsEl.appendChild(listEl);
					const elements = Array.from(
						/** @type {NodeListOf<HTMLElement>} */ (listEl.querySelectorAll('.game'))
					);
					elements.forEach(pg_addGameListItemButton);
				}
			}
			eblaeo.pg.isSearchingGames = false;
			if (!eblaeo.pg.hasNewGameSearchQuery) {
				return;
			}
			eblaeo.pg.hasNewGameSearchQuery = false;
			pg_searchGames();
		} catch (err) {
			eblaeo.pg.isSearchingGames = false;
			if (err instanceof CustomError) {
				showAlert(eblaeo.pg.searchGamesResultsEl, 'afterend', 'danger', err.message);
			} else {
				showAlert(
					eblaeo.pg.searchGamesResultsEl,
					'afterend',
					'danger',
					'failed to search for games'
				);
			}
		}
	};

	/**
	 * Adds a button to a game list item, which allows selecting it.
	 * @param {HTMLElement} listItemEl The element of the game list item where to add the button.
	 */
	const pg_addGameListItemButton = (listItemEl) => {
		// prettier-ignore
		DOM.insertElements(listItemEl, 'beforeend', [
			['button', {
				type: 'button',
				className: 'eblaeo-pg-game-list-item-button btn btn-default',
				onclick: () => pg_selectGameListItem(listItemEl),
			}, 'Select'],
		]);
	};

	/**
	 * Selects a game list item.
	 * @param {HTMLElement} listItemEl The element of the game list item to select.
	 * @returns {Promise<void>}
	 */
	const pg_selectGameListItem = async (listItemEl) => {
		if (!eblaeo.pg.presets || !eblaeo.pg.currentPresetType || !eblaeo.pg.searchGamesResultsEl) {
			return;
		}
		try {
			const link = /** @type {HTMLAnchorElement | null} */ (listItemEl.querySelector('a'));
			if (!link) {
				return;
			}
			const url = link.href;
			if (!url) {
				return;
			}
			const matches = url.match(/\/app\/(\d+)/);
			if (!matches) {
				return;
			}
			const gameId = parseInt(matches[1]);
			const game = await BlaeoApi.getGame({ steamId: eblaeo.user.steamId }, gameId);
			if (!game) {
				throw new CustomError('could not retrieve game');
			}
			const imageEl = listItemEl.querySelector('img');
			const currentPreset = eblaeo.pg.presets[eblaeo.pg.currentPresetType];
			eblaeo.pg.presets[eblaeo.pg.currentPresetType] = {
				...currentPreset,
				prefs: {
					...currentPreset.prefs,
				},
			};
			const pgGame = /** @type {PgGame} */ ({
				id: gameId,
				name: game.name,
				image: (imageEl && imageEl.src) || '',
				progress: game.progress ? gameProgresses[game.progress] : 'uncategorized',
				playtime: {
					thisMonth: 0,
					total: game.playtime,
				},
				achievements: game.achievements || {
					unlocked: 0,
					total: 0,
				},
				screenshotsCount: 0,
				customHtml: '',
				rating: '',
				review: '',
				preset: eblaeo.pg.presets[eblaeo.pg.currentPresetType],
			});
			pg_selectGame(pgGame, false);
		} catch (err) {
			if (err instanceof CustomError) {
				showAlert(eblaeo.pg.searchGamesResultsEl, 'afterend', 'danger', err.message);
			} else {
				showAlert(eblaeo.pg.searchGamesResultsEl, 'afterend', 'danger', 'failed to select game');
			}
		}
	};

	/**
	 * Generates the post.
	 */
	const pg_generatePost = () => {
		if (
			!eblaeo.pg.postField ||
			!eblaeo.pg.previewButton ||
			!eblaeo.pg.gameInfos ||
			!eblaeo.pg.modalEl
		) {
			return;
		}
		try {
			const divEl = document.createElement('div');
			const elArrays = [];
			let boxElArrays = [];
			for (const gameInfo of eblaeo.pg.gameInfos) {
				if (gameInfo.game.preset.type === 'box') {
					boxElArrays.push(...gameInfo.elArrays);
				} else {
					if (boxElArrays.length > 0) {
						// prettier-ignore
						elArrays.push(
							['ul', {
								className: 'games',
								style: {
									minHeight: '0',
								},
							}, boxElArrays]
						);
						boxElArrays = [];
					}
					elArrays.push(...gameInfo.elArrays);
				}
			}
			if (boxElArrays.length > 0) {
				// prettier-ignore
				elArrays.push(
					['ul', {
						className: 'games',
						style: {
							minHeight: '0',
						},
					}, boxElArrays]
				);
			}
			DOM.insertElements(divEl, 'atinner', elArrays);
			eblaeo.pg.postField.value = `${eblaeo.pg.postField.value}\n\n${divEl.innerHTML}\n\n`;
			eblaeo.pg.postField.dispatchEvent(new Event('input', { bubbles: true }));
			eblaeo.pg.previewButton.dispatchEvent(new Event('click', { bubbles: true }));
		} catch (err) {
			if (err instanceof CustomError) {
				showAlert(eblaeo.pg.modalEl, 'beforeend', 'danger', err.message);
			} else {
				showAlert(eblaeo.pg.modalEl, 'beforeend', 'danger', 'failed to generate post');
			}
		}
	};

	/**
	 * Selects a game.
	 * @param {PgGame} game The game to select.
	 * @param {boolean} isEdit Whether the game is being edited or not.
	 */
	const pg_selectGame = (game, isEdit) => {
		if (
			!eblaeo.pg.searchGamesField ||
			!eblaeo.pg.searchGamesResultsEl ||
			!eblaeo.pg.generatorEl ||
			!eblaeo.pg.presetTabNavEls ||
			!eblaeo.pg.presetTabEls ||
			!eblaeo.pg.gamePreviewContainerEl ||
			!eblaeo.pg.gamePreviewBodyEl ||
			!eblaeo.pg.gamePreviewButton ||
			!eblaeo.pg.fullPreviewEl
		) {
			return;
		}
		try {
			eblaeo.pg.currentPresetType = game.preset.type || 'box';
			const presetTabNavElEntries = /** @type {[PgPresetType, HTMLElement | null][]} */ (Object.entries(
				eblaeo.pg.presetTabNavEls
			));
			for (const [presetType, presetTabNavEl] of presetTabNavElEntries) {
				const presetTabEl = eblaeo.pg.presetTabEls[presetType];
				if (!presetTabNavEl || !presetTabEl) {
					continue;
				}
				if (presetType === eblaeo.pg.currentPresetType) {
					presetTabNavEl.classList.add('active');
					presetTabEl.classList.add('active');
				} else {
					presetTabNavEl.classList.remove('active');
					presetTabEl.classList.remove('active');
				}
			}
			eblaeo.pg.selectedGame = game;
			eblaeo.pg.isEditing = isEdit;
			eblaeo.pg.searchGamesField.value = '';
			eblaeo.pg.searchGamesResultsEl.innerHTML = '';
			eblaeo.pg.generatorEl.style.display = 'block';
			eblaeo.pg.gamePreviewContainerEl.style.display = 'block';
			eblaeo.pg.gamePreviewBodyEl.innerHTML = '';
			eblaeo.pg.gamePreviewButton.textContent = isEdit ? 'Edit' : 'Add';
			eblaeo.pg.fullPreviewEl.style.display = 'none';
			Object.entries(game.preset.prefs).forEach((entry) =>
				// @ts-expect-error
				pg_fillPresetField(game.preset.type, entry)
			);
			// @ts-expect-error
			Object.entries(game).forEach(pg_fillField);
			eblaeo.pg.gamePreviewButton.onclick = () => pg_generateGame(game, isEdit, false);
			pg_gamePreview();
		} catch (err) {
			if (err instanceof CustomError) {
				showAlert(eblaeo.pg.generatorEl, 'beforebegin', 'danger', err.message);
			} else {
				showAlert(eblaeo.pg.generatorEl, 'beforebegin', 'danger', 'failed to select game');
			}
		}
	};

	/**
	 * Generates a game.
	 * @param {PgGame} game The game to generate.
	 * @param {boolean} isEdit Whether the game is being edited or not.
	 * @param {boolean} isFromCache Whether the game is from the cache or not.
	 */
	const pg_generateGame = async (game, isEdit, isFromCache) => {
		if (
			!eblaeo.pg.gameInfos ||
			!eblaeo.pg.generatorEl ||
			!eblaeo.pg.gamePreviewContainerEl ||
			!eblaeo.pg.gamePreviewButton ||
			!eblaeo.pg.fullPreviewEl
		) {
			return;
		}
		try {
			if (!isFromCache) {
				eblaeo.pg.gamePreviewButton.textContent = isEdit ? 'Editing...' : 'Adding...';
			}
			const gameElArrays = await pg_getGame(game, isFromCache);
			if (!gameElArrays) {
				throw new CustomError('could not build elements for game generation');
			}
			if (isEdit) {
				const gameInfo = eblaeo.pg.gameInfos.find((gameInfo) => gameInfo.game === game);
				if (gameInfo) {
					gameInfo.elArrays = gameElArrays;
				}
			} else {
				eblaeo.pg.gameInfos.push({ game, elArrays: gameElArrays });
			}
			if (isFromCache) {
				return;
			}
			pg_saveCaches();
			eblaeo.pg.isEditing = false;
			eblaeo.pg.generatorEl.style.display = 'none';
			eblaeo.pg.gamePreviewContainerEl.style.display = 'none';
			eblaeo.pg.fullPreviewEl.style.display = 'block';
			pg_fullPreview();
		} catch (err) {
			if (err instanceof CustomError) {
				showAlert(eblaeo.pg.generatorEl, 'afterend', 'danger', err.message);
			} else {
				showAlert(eblaeo.pg.generatorEl, 'afterend', 'danger', 'failed to generate game');
			}
			throw err;
		}
	};

	/**
	 * Returns element arrays for a game.
	 * @param {PgGame} game The game.
	 * @param {boolean} isFromCache Whether the game is from the cache or not.
	 * @returns {Promise<ElementArray[] | undefined>} The element arrays for the game, if successful.
	 */
	const pg_getGame = async (game, isFromCache) => {
		if (!isFromCache) {
			pg_fillGameValues(game);
		}
		game.playtime.thisMonth = await pg_getPlaytimeThisMonth(game);
		game.screenshotsCount = await pg_getScreenshotsCount(game);
		const reviewPreviewEl = await pg_getReviewPreview(game);
		if (pg_isPresetType(game.preset, 'box')) {
			return pg_getBoxGame(game, game.preset, reviewPreviewEl);
		}
		if (pg_isPresetType(game.preset, 'bar')) {
			return pg_getBarGame(game, game.preset, reviewPreviewEl);
		}
		if (pg_isPresetType(game.preset, 'panel')) {
			return pg_getPanelGame(game, game.preset, reviewPreviewEl);
		}
		if (pg_isPresetType(game.preset, 'custom')) {
			return pg_getCustomGame(game, game.preset, reviewPreviewEl);
		}
	};

	/**
	 * Fills the values for a game from the field values.
	 * @param {PgGame} game The game.
	 */
	const pg_fillGameValues = (game) => {
		if (!eblaeo.pg.fields) {
			return;
		}
		const fieldKeys = /** @type {(keyof PgFields)[]} */ (Object.keys(eblaeo.pg.fields));
		for (const fieldKey of fieldKeys) {
			if (fieldKey === 'presets') {
				const presetKeys = /** @type {PgPresetFieldKey[]} */ (Object.keys(
					eblaeo.pg.fields.presets[game.preset.type]
				));
				for (const presetKey of presetKeys) {
					// @ts-expect-error
					game.preset.prefs[presetKey] = /** @type {never} */ (pg_getPresetFieldValue(
						game.preset.type,
						presetKey
					));
				}
			} else if (fieldKey !== 'presetName') {
				game[fieldKey] = /** @type {never} */ (pg_getFieldValue(fieldKey));
			}
		}
		pg_handleFieldDependencies(game);
		if (!pg_isNotPresetType(game.preset, 'custom')) {
			return;
		}
		const oldPlaytimeTemplate = game.preset.prefs.playtimeTemplate;
		if (game.preset.prefs.showPlaytimeThisMonth) {
			if (!game.preset.prefs.playtimeTemplate.includes('%playtime_this_month%')) {
				game.preset.prefs.playtimeTemplate = `${game.preset.prefs.playtimeTemplate} (%playtime_this_month% this month)`;
			}
		} else {
			game.preset.prefs.playtimeTemplate = game.preset.prefs.playtimeTemplate.replace(
				' (%playtime_this_month% this month)',
				''
			);
		}
		const newPlaytimeTemplate = game.preset.prefs.playtimeTemplate;
		if (newPlaytimeTemplate !== oldPlaytimeTemplate) {
			pg_fillPresetField(game.preset.type, ['playtimeTemplate', newPlaytimeTemplate]);
		}
	};

	/**
	 * Handles field dependencies for a game.
	 * @param {PgGame} game The game.
	 */
	const pg_handleFieldDependencies = (game) => {
		if (!eblaeo.pg.fields) {
			return;
		}
		const fieldKeys = /** @type {(keyof PgFields)[]} */ (Object.keys(eblaeo.pg.fields));
		for (const fieldKey of fieldKeys) {
			if (fieldKey === 'presets') {
				const presetKeys = /** @type {PgPresetFieldKey[]} */ (Object.keys(
					eblaeo.pg.fields.presets[game.preset.type]
				));
				for (const presetKey of presetKeys) {
					/** @type {boolean} */
					let shouldBeVisible;
					switch (presetKey) {
						case 'checkScreenshots':
							// @ts-expect-error
							shouldBeVisible = game.preset.prefs.checkScreenshots;
							pg_togglePresetField(game.preset.type, 'linkScreenshots', shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'screenshotsTemplate', shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'noScreenshotsTemplate', shouldBeVisible);
							break;
						case 'usePredefinedTheme':
							// @ts-expect-error
							shouldBeVisible = game.preset.prefs.usePredefinedTheme;
							pg_togglePresetField(game.preset.type, 'predefinedThemeColor', shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'bgType', !shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'bgColor1', !shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'bgColor2', !shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'titleColor', !shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'textColor', !shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'linkColor', !shouldBeVisible);
							break;
						case 'useCustomTheme':
							// @ts-expect-error
							shouldBeVisible = game.preset.prefs.useCustomTheme;
							pg_togglePresetField(game.preset.type, 'predefinedThemeColor', !shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'bgType', shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'bgColor1', shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'bgColor2', shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'titleColor', shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'textColor', shouldBeVisible);
							pg_togglePresetField(game.preset.type, 'linkColor', shouldBeVisible);
							break;
						case 'bgType':
							shouldBeVisible =
								// @ts-expect-error
								!game.preset.prefs.usePredefinedTheme && game.preset.prefs.bgType !== 'Solid';
							pg_togglePresetField(game.preset.type, 'bgColor2', shouldBeVisible);
							break;
						case 'useCollapsibleReview':
							// @ts-expect-error
							shouldBeVisible = game.preset.prefs.useCollapsibleReview;
							pg_togglePresetField(game.preset.type, 'reviewTriggerMethod', shouldBeVisible);
							break;
						// no default
					}
				}
			} else if (fieldKey !== 'presetName') {
				// Do nothing for now.
			}
		}
	};

	/**
	 * Fills a preset field
	 * @param {PgPresetType} presetType The preset type.
	 * @param {[PgPresetFieldKey, unknown]} pair The key / value pair to fill.
	 */
	const pg_fillPresetField = (presetType, [key, value]) => {
		if (!eblaeo.pg.fields) {
			return;
		}
		// @ts-expect-error
		const field = /** @type {HTMLInputElement | null} */ (eblaeo.pg.fields.presets[presetType][
			key
		]);
		if (!field) {
			return;
		}
		if (field.type === 'checkbox' || field.type === 'radio') {
			// @ts-expect-error
			field.checked = value;
		} else {
			// @ts-expect-error
			field.value = value;
		}
	};

	/**
	 * Fills a field
	 * @param {[PgFieldKey, unknown]} pair The key / value pair to fill.
	 */
	const pg_fillField = ([key, value]) => {
		if (!eblaeo.pg.fields) {
			return;
		}
		const field = /** @type {HTMLInputElement | null} */ (eblaeo.pg.fields[key]);
		if (!field) {
			return;
		}
		if (field.type === 'checkbox' || field.type === 'radio') {
			// @ts-expect-error
			field.checked = value;
		} else {
			// @ts-expect-error
			field.value = value;
		}
	};

	/**
	 * Returns a preset field value.
	 * @param {PgPresetType} presetType The preset type.
	 * @param {PgPresetFieldKey} key The field key.
	 * @returns {unknown} The field value.
	 */
	const pg_getPresetFieldValue = (presetType, key) => {
		if (!eblaeo.pg.fields) {
			return;
		}
		// @ts-expect-error
		const field = /** @type {HTMLInputElement | null} */ (eblaeo.pg.fields.presets[presetType][
			key
		]);
		return field
			? field.type === 'checkbox' || field.type === 'radio'
				? field.checked
				: field.value
			: null;
	};

	/**
	 * Returns a field value.
	 * @param {PgFieldKey} key The field key.
	 * @returns {unknown} The field value.
	 */
	const pg_getFieldValue = (key) => {
		if (!eblaeo.pg.fields) {
			return '';
		}
		const field = /** @type {HTMLInputElement | null} */ (eblaeo.pg.fields[key]);
		return field
			? field.type === 'checkbox' || field.type === 'radio'
				? field.checked
				: field.value
			: null;
	};

	/**
	 * Toggles a preset field visibility.
	 * @param {PgPresetType} presetType The preset type.
	 * @param {PgPresetFieldKey} key The field key.
	 * @param {boolean} shouldBeVisible Whether the field should be visible or not.
	 */
	const pg_togglePresetField = (presetType, key, shouldBeVisible) => {
		if (!eblaeo.pg.fieldContainerEls) {
			return;
		}
		// @ts-expect-error
		const field = /** @type {HTMLInputElement | null} */ (eblaeo.pg.fieldContainerEls.presets[
			presetType
		][key]);
		if (field) {
			field.style.display = shouldBeVisible ? 'block' : 'none';
		}
	};

	/**
	 * Toggles a field visibility.
	 * @param {PgFieldKey} key The field key.
	 * @param {boolean} shouldBeVisible Whether the field should be visible or not.
	 */
	// eslint-disable-next-line
	const pg_toggleField = (key, shouldBeVisible) => {
		if (!eblaeo.pg.fieldContainerEls) {
			return '';
		}
		const field = /** @type {HTMLInputElement | null} */ (eblaeo.pg.fieldContainerEls[key]);
		if (field) {
			field.style.display = shouldBeVisible ? 'block' : 'none';
		}
	};

	/**
	 * Retrieves the playtime for a game this month.
	 * @param {PgGame} game The game.
	 * @returns {Promise<number>} The playtime for the game this month.
	 */
	const pg_getPlaytimeThisMonth = async (game) => {
		if (
			(pg_isPresetType(game.preset, 'custom') &&
				!game.preset.prefs.htmlTemplate.includes('%playtime_this_month%')) ||
			(pg_isNotPresetType(game.preset, 'custom') && !game.preset.prefs.showPlaytimeThisMonth)
		) {
			return 0;
		}
		if (!eblaeo.pg.playtimeThisMonthCache) {
			const recentlyPlayed =
				(await BlaeoApi.getRecentlyPlayed({ steamId: eblaeo.user.steamId })) || [];
			eblaeo.pg.playtimeThisMonthCache = Object.fromEntries(
				recentlyPlayed.map((recentlyPlayedGame) => [
					recentlyPlayedGame.steam_id,
					recentlyPlayedGame.minutes,
				])
			);
		}
		return eblaeo.pg.playtimeThisMonthCache[game.id] || 0;
	};

	/**
	 * Retrieves the screenshots count for a game.
	 * @param {PgGame} game The game.
	 * @returns {Promise<number>} The screenshots count for the game.
	 */
	const pg_getScreenshotsCount = async (game) => {
		if (
			(pg_isPresetType(game.preset, 'custom') &&
				!game.preset.prefs.htmlTemplate.includes('%screenshots%') &&
				!game.preset.prefs.htmlTemplate.includes('%screenshots_count%')) ||
			(pg_isNotPresetType(game.preset, 'custom') && !game.preset.prefs.checkScreenshots)
		) {
			return 0;
		}
		if (!eblaeo.pg.screenshotsCache) {
			eblaeo.pg.screenshotsCache = {};
		}
		if (!Utils.isSet(eblaeo.pg.screenshotsCache[game.id])) {
			const response = await Requests.GET(
				`https://steamcommunity.com/profiles/${eblaeo.user.steamId}/screenshots?appid=${game.id}`
			);
			if (response.dom) {
				const elements = Array.from(
					response.dom.querySelectorAll('[href*="steamcommunity.com/sharedfiles/filedetails"]')
				);
				eblaeo.pg.screenshotsCache[game.id] = elements.length;
			}
		}
		return eblaeo.pg.screenshotsCache[game.id] || 0;
	};

	/**
	 * Retrieves the review preview for a game.
	 * @param {PgGame} game The game.
	 * @returns {Promise<HTMLElement | null>} The element of the review preview for the game, if successful.
	 */
	const pg_getReviewPreview = async (game) => {
		if (!game.review) {
			return null;
		}
		if (!eblaeo.pg.reviewsCache) {
			eblaeo.pg.reviewsCache = {};
		}
		let reviewCache = eblaeo.pg.reviewsCache[game.id];
		if (!reviewCache || reviewCache.review !== game.review) {
			const reviewPreviewEl =
				(await BlaeoApi.previewPost(
					{ steamId: eblaeo.user.steamId },
					pg_replacePlaceholders(game.review, game)
				)) || null;
			if (reviewPreviewEl) {
				eblaeo.pg.reviewsCache[game.id] = {
					review: game.review,
					reviewPreview: reviewPreviewEl.outerHTML,
				};
				reviewCache = eblaeo.pg.reviewsCache[game.id];
			}
		}
		if (!reviewCache) {
			return null;
		}
		const divEl = document.createElement('div');
		divEl.innerHTML = reviewCache.reviewPreview;
		return /** @type {HTMLElement | null} */ (divEl.firstElementChild);
	};

	/**
	 * Returns element arrays for a game using a box preset.
	 * @param {PgGame} game The game.
	 * @param {PgPreset<'box'>} preset The box preset to use.
	 * @param {HTMLElement | null} reviewPreviewEl The element of the review preview for the game, if any.
	 * @returns {ElementArray[]} The element arrays for the game.
	 */
	const pg_getBoxGame = (game, preset, reviewPreviewEl) => {
		// prettier-ignore
		let elArrays = /** @type {ElementArray[]} */ ([
			['li', {
				className: `game game-thumbnail game-${game.progress}`,
				style: {
					background:
						preset.prefs.bgType === 'Solid'
							? null
							: `linear-gradient(to ${
									preset.prefs.bgType === 'Horizontal gradient' ? 'right' : 'bottom'
								}, ${preset.prefs.bgColor1}, ${preset.prefs.bgColor2})`,
					backgroundColor: preset.prefs.bgType === 'Solid' ? preset.prefs.bgColor1 : null,
					color: preset.prefs.textColor,
				},
			}, [
				['div', {
					className: 'title',
					style: {
						color: preset.prefs.titleColor,
					},
				}, game.name],
				['a', { href: `https://store.steampowered.com/app/${game.id}/`, target: '_blank' }, [
					['img', { src: game.image, alt: game.name }, null],
				]],
				['div', {
					className: 'caption',
					style: {
						backgroundColor: 'transparent',
						color: 'inherit',
						height: 'auto',
						padding: '9px',
					},
				}, [
					['p', null, pg_replacePlaceholders(preset.prefs.playtimeTemplate, game)],
					game.achievements.total === 0
						? ['p', {
								style: {
									color: 'inherit',
									opacity: '0.5',
								},
							}, pg_replacePlaceholders(preset.prefs.noAchievementsTemplate, game)]
						: preset.prefs.linkAchievements
						? ['p', null, [
								['a', {
									href: pg_replacePlaceholders(
										'https://steamcommunity.com/profiles/%steamid%/stats/%id%/?tab=achievements',
										game
									),
									target: '_blank',
									style: {
										color: preset.prefs.linkColor,
									},
								}, pg_replacePlaceholders(preset.prefs.achievementsTemplate, game)],
							]]
						: ['p', null, pg_replacePlaceholders(preset.prefs.achievementsTemplate, game)],
					preset.prefs.checkScreenshots
						? (
								game.screenshotsCount === 0
									? ['p', {
											style: {
												color: 'inherit',
												opacity: '0.5',
											},
										}, pg_replacePlaceholders(preset.prefs.noScreenshotsTemplate, game)]
									: preset.prefs.linkScreenshots
									? ['p', null, [
											['a', {
												href: pg_replacePlaceholders(
													'https://steamcommunity.com/profiles/%steamid%/screenshots?appid=%id%',
													game
												),
												target: '_blank',
												style: {
													color: preset.prefs.linkColor,
												},
											}, pg_replacePlaceholders(preset.prefs.screenshotsTemplate, game)],
										]]
									: ['p', null, pg_replacePlaceholders(preset.prefs.screenshotsTemplate, game)]
							)
						: null,
				]],
			]],
		]);
		if (!reviewPreviewEl) {
			return elArrays;
		}
		// prettier-ignore
		elArrays = [
			['div', {
				style: {
					overflow: 'auto',
				},
			}, [
				['div', {
					style: {
						...(
							preset.prefs.reviewPosition === 'Left'
								? {
										float: 'right',
										margin: '5px 5px 5px 10px',
									}
								: {
										float: 'left',
										margin: '5px 10px 5px 5px',
									}
						),
						position: 'relative',
						zIndex: '1',
					},
				}, elArrays],
				['div', {
					style: {
						fontSize: '14px',
						textAlign: 'justify',
					},
				}, reviewPreviewEl],
			]],
		];
		return elArrays;
	};

	/**
	 * Returns element arrays for a game using a bar preset.
	 * @param {PgGame} game The game.
	 * @param {PgPreset<'bar'>} preset The bar preset to use.
	 * @param {HTMLElement | null} reviewPreviewEl The element of the review preview for the game, if any.
	 * @returns {ElementArray[]} The element arrays for the game.
	 */
	const pg_getBarGame = (game, preset, reviewPreviewEl) => {
		const showInfoInOneLine = preset.prefs.showInfoInOneLine || !!game.customHtml;
		let customEls;
		if (game.customHtml) {
			const divEl = document.createElement('div');
			divEl.innerHTML = game.customHtml;
			customEls = Array.from(divEl.childNodes).map((child) =>
				child.nodeType === Node.TEXT_NODE ? child.textContent : child
			);
		}
		const reviewId = `review-${eblaeo.user.username}-${game.id}`;
		// prettier-ignore
		const imageArray = /** @type {ElementArray} */ (
			['div', {
				className: `media-${preset.prefs.imagePosition.toLowerCase()}`,
				style: {
					padding: '0',
				},
			}, [
				['a', { href: `https://store.steampowered.com/app/${game.id}/`, target: '_blank' }, [
					['img', {
						src: game.image,
						alt: game.name,
						style: {
							maxWidth: 'unset',
						},
					}, null],
				]],
			]]
		);
		// prettier-ignore
		const barArray = /** @type {ElementArray} */ (
			['div', {
				className: 'media-body',
				style: {
					fontSize: showInfoInOneLine ? '12px' : null,
					padding: '0 10px',
					position: 'relative',
				},
			}, [
				['h4', {
					className: 'media-heading',
					style: {
						color: preset.prefs.titleColor,
					},
				}, game.name],
				pg_replacePlaceholders(preset.prefs.playtimeTemplate, game),
				showInfoInOneLine ? ', ' : ['br', null, null],
				game.achievements.total === 0
					? ['span', {
							style: {
								color: 'inherit',
								opacity: '0.5',
							},
						}, pg_replacePlaceholders(preset.prefs.noAchievementsTemplate, game)]
					: preset.prefs.linkAchievements
					? ['a', {
							href: pg_replacePlaceholders(
								'https://steamcommunity.com/profiles/%steamid%/stats/%id%/?tab=achievements',
								game
							),
							target: '_blank',
							style: {
								color: preset.prefs.linkColor,
							},
						}, pg_replacePlaceholders(preset.prefs.achievementsTemplate, game)]
					: pg_replacePlaceholders(preset.prefs.achievementsTemplate, game),
				...(
					preset.prefs.checkScreenshots
						? [
								', ',
								game.screenshotsCount === 0
									? ['span', {
											style: {
												color: 'inherit',
												opacity: '0.5',
											},
										}, pg_replacePlaceholders(preset.prefs.noScreenshotsTemplate, game)]
									: preset.prefs.linkScreenshots
									? ['a', {
											href: pg_replacePlaceholders(
												'https://steamcommunity.com/profiles/%steamid%/screenshots?appid=%id%',
												game
											),
											target: '_blank',
											style: {
												color: preset.prefs.linkColor,
											},
										}, pg_replacePlaceholders(preset.prefs.screenshotsTemplate, game)]
									: pg_replacePlaceholders(preset.prefs.screenshotsTemplate, game),
							]
						: []
				),
				...(
					customEls
						? [
								['br', null, null],
								...customEls,
							]
						: []
				),
				preset.prefs.useCollapsibleReview && reviewPreviewEl
					? (
							preset.prefs.reviewTriggerMethod === 'Bar click'
								? ['span', {
										style: {
											bottom: '50%',
											fontSize: '14px',
											fontWeight: 'bold',
											position: 'absolute',
											right: '10px',
											transform: 'translateY(50%)',
										},
									}, [
										'More ',
										['i', { className: 'fa fa-level-down' }, null],
									]]
								:	['button', {
										className: 'btn btn-xs',
										dataset: { toggle: 'collapse', target: `#${reviewId}` },
										style: {
											backgroundColor: preset.prefs.titleColor,
											bottom: '50%',
											color: preset.prefs.bgColor1,
											fontSize: '14px',
											fontWeight: 'bold',
											position: 'absolute',
											right: '10px',
											transform: 'translateY(50%)',
										},
									}, [
										'More ',
										['i', { className: 'fa fa-level-down' }, null],
									]]
						)
					: null,
			]]
		);
		// prettier-ignore
		return /** @type {ElementArray[]} */ ([
			['div', {
				className: `game game-media game-${game.progress}`,
				dataset:
					preset.prefs.useCollapsibleReview &&
					preset.prefs.reviewTriggerMethod === 'Bar click' &&
					reviewPreviewEl
						? { toggle: 'collapse', target: `#${reviewId}` }
						: null,
				style: {
					background:
						preset.prefs.bgType === 'Solid'
							? null
							: `linear-gradient(to ${
									preset.prefs.bgType === 'Horizontal gradient' ? 'right' : 'bottom'
								}, ${preset.prefs.bgColor1}, ${preset.prefs.bgColor2})`,
					backgroundColor: preset.prefs.bgType === 'Solid' ? preset.prefs.bgColor1 : null,
					borderLeft:
						preset.prefs.completionBarPosition === 'Left'
							? `10px solid ${gameCategoryInfos[game.progress].color}`
							: '0',
					borderRight:
						preset.prefs.completionBarPosition === 'Right'
							? `10px solid ${gameCategoryInfos[game.progress].color}`
							: '0',
					color: preset.prefs.textColor,
				},
			},
				preset.prefs.imagePosition === 'Left' ? [imageArray, barArray] : [barArray, imageArray]
			],
			reviewPreviewEl
				? ['div', {
						...(preset.prefs.useCollapsibleReview ? { id: reviewId, className: 'collapse' } : {}),
						style: {
							border: '1px solid #dee2e6',
							borderRadius: '0 0 4px 4px',
							borderTop: '0',
							padding: '10px',
							textAlign: 'justify',
						},
					}, reviewPreviewEl]
				: null,
		]);
	};

	/**
	 * Returns element arrays for a game using a panel preset.
	 * @param {PgGame} game The game.
	 * @param {PgPreset<'panel'>} preset The panel preset to use.
	 * @param {HTMLElement | null} reviewPreviewEl The element of the review preview for the game, if any.
	 * @returns {ElementArray[]} The element arrays for the game.
	 */
	const pg_getPanelGame = (game, preset, reviewPreviewEl) => {
		const reviewId = `review-${eblaeo.user.username}-${game.id}`;
		// prettier-ignore
		return /** @type {ElementArray[]} */ ([
			['div', {
				className: `panel ${
					preset.prefs.usePredefinedTheme
						? `panel-${bootstrapColorClasses[preset.prefs.predefinedThemeColor]}`
						: ''
				}`,
				style: {
					borderColor: preset.prefs.useCustomTheme ? preset.prefs.bgColor1 : null,
				},
			}, [
				['div', {
					className: 'panel-heading',
					dataset:
						preset.prefs.useCollapsibleReview && reviewPreviewEl
							? { toggle: 'collapse', target: `#${reviewId}` }
							: null,
					style: {
						background:
							preset.prefs.usePredefinedTheme || preset.prefs.bgType === 'Solid'
								? null
								: `linear-gradient(to ${
										preset.prefs.bgType === 'Horizontal gradient' ? 'right' : 'bottom'
									}, ${preset.prefs.bgColor1}, ${preset.prefs.bgColor2})`,
						backgroundColor:
							preset.prefs.useCustomTheme && preset.prefs.bgType === 'Solid'
								? preset.prefs.bgColor1
								: null,
					},
				}, [
					['div', {
						className: `game game-media game-${game.progress}`,
						style: {
							color: preset.prefs.useCustomTheme ? preset.prefs.textColor : null,
						},
					}, [
						['div', { className: 'media-left' }, [
							['a', { href: `https://store.steampowered.com/app/${game.id}/`, target: '_blank' }, [
								['img', {
									src: `https://steamcdn-a.akamaihd.net/steam/apps/${game.id}/header.jpg`,
									alt: game.name,
									style: {
										height: '90px',
										maxWidth: 'unset',
										width: 'unset',
									},
								}, null],
							]],
						]],
						['div', {
							className: 'media-body',
							style: {
								position: 'relative',
							},
						}, [
							['h4', {
								className: 'media-heading',
								style: {
									color: preset.prefs.useCustomTheme ? preset.prefs.titleColor : null,
								},
							}, [
								game.name,
								' ',
								['a', {
									href: `https://store.steampowered.com/app/${game.id}`,
									target: '_blank',
									style: {
										color: preset.prefs.useCustomTheme ? preset.prefs.linkColor : null,
									},
								}, [
									['font', { size: '2px' }, [
										['i', { className: 'fa fa-external-link' }, null],
									]],
								]],
								preset.prefs.checkScreenshots && game.rating
									? ['div', {
											style: {
												float: 'right',
											},
										}, [
											`${game.rating} `,
											['i', { className: 'fa fa-star' }, null],
										]]
									: null,
							]],
							!preset.prefs.checkScreenshots && game.rating
								? ['div', null, [
										['i', { className: 'fa fa-star' }, null],
										` ${game.rating}`,
									]]
								: null,
							!preset.prefs.checkScreenshots && !game.rating
								? ['br', null, null]
								: null,
							['div', null, [
								['i', { className: 'fa fa-clock-o' }, null],
								` ${pg_replacePlaceholders(preset.prefs.playtimeTemplate, game)}`,
							]],
							['div', null, [
								['i', { className: 'fa fa-trophy' }, null],
								' ',
								game.achievements.total === 0
									? ['span', {
											style: {
												color: 'inherit',
												opacity: '0.5',
											},
										}, pg_replacePlaceholders(preset.prefs.noAchievementsTemplate, game)]
									: preset.prefs.linkAchievements
									? ['a', {
											href: pg_replacePlaceholders(
												'https://steamcommunity.com/profiles/%steamid%/stats/%id%/?tab=achievements',
												game
											),
											target: '_blank',
											style: {
												color: preset.prefs.useCustomTheme ? preset.prefs.linkColor : null,
											},
										}, pg_replacePlaceholders(preset.prefs.achievementsTemplate, game)]
									: pg_replacePlaceholders(preset.prefs.achievementsTemplate, game)
							]],
							preset.prefs.checkScreenshots
								? ['div', null, [
										['i', { className: 'fa fa-image' }, null],
										' ',
										game.screenshotsCount === 0
											? ['span', {
													style: {
														color: 'inherit',
														opacity: '0.5',
													},
												}, pg_replacePlaceholders(preset.prefs.noScreenshotsTemplate, game)]
											: preset.prefs.linkScreenshots
											? ['a', {
													href: pg_replacePlaceholders(
														'https://steamcommunity.com/profiles/%steamid%/screenshots?appid=%id%',
														game
													),
													target: '_blank',
													style: {
														color: preset.prefs.useCustomTheme ? preset.prefs.linkColor : null,
													},
												}, pg_replacePlaceholders(preset.prefs.screenshotsTemplate, game)]
											: pg_replacePlaceholders(preset.prefs.screenshotsTemplate, game)
									]]
								: null,
							preset.prefs.useCollapsibleReview && reviewPreviewEl
								? ['span', {
										style: {
											bottom: '1px',
											fontWeight: 'bold',
											position: 'absolute',
											right: '10px',
										},
									}, [
										'More ',
										['i', { className: 'fa fa-level-down' }, null],
									]]
								: null,
						]],
					]],
				]],
				reviewPreviewEl
					? ['div', {
							...(preset.prefs.useCollapsibleReview ? { id: reviewId, className: 'collapse' } : {}),
							style: {
								padding: '10px',
								textAlign: 'justify',
							},
						}, reviewPreviewEl]
					: null,
			]],
		]);
	};

	/**
	 * Returns element arrays for a game using a custom preset.
	 * @param {PgGame} game The game.
	 * @param {PgPreset<'custom'>} preset The custom preset to use.
	 * @param {HTMLElement | null} reviewPreviewEl The element of the review preview for the game, if any.
	 * @returns {ElementArray[]} The element arrays for the game.
	 */
	const pg_getCustomGame = (game, preset, reviewPreviewEl) => {
		const divEl = document.createElement('div');
		divEl.innerHTML = pg_replacePlaceholders(preset.prefs.htmlTemplate, game);
		if (reviewPreviewEl) {
			const reviewId = `review-${eblaeo.user.username}-${game.id}`;
			const reviewEl = divEl.querySelector(`#${reviewId}`);
			if (reviewEl) {
				reviewEl.appendChild(reviewPreviewEl);
			}
		}
		return Array.from(divEl.childNodes).map((child) =>
			child.nodeType === Node.TEXT_NODE ? child.textContent : child
		);
	};

	/**
	 * Replaces placeholders in a text.
	 * @param {string} text The text where to replace the placeholders.
	 * @param {PgGame} game The game with the values to replace the placeholders.
	 * @returns {string} The text with the placeholders replaced.
	 */
	const pg_replacePlaceholders = (text, game) => {
		const achievementsPercentage =
			game.achievements.total > 0
				? Math.round((game.achievements.unlocked / game.achievements.total) * 10000) / 100
				: 0;
		return (text || '')
			.replace(/%steamid%/g, eblaeo.user.steamId)
			.replace(/%username%/g, eblaeo.user.username)
			.replace(/%id%/g, game.id.toString())
			.replace(/%name%/g, game.name)
			.replace(/%image%/g, game.image)
			.replace(/%progress%/g, game.progress)
			.replace(/%progress_name%/g, gameCategoryInfos[game.progress].name)
			.replace(/%progress_color%/g, gameCategoryInfos[game.progress].color)
			.replace(
				/%playtime%/g,
				Utils.getRelativeTimeFromMinutes(game.playtime.total, 'h').replace('about ', '')
			)
			.replace(
				/%playtime_this_month%/g,
				Utils.getRelativeTimeFromMinutes(game.playtime.thisMonth, 'h').replace('about ', '')
			)
			.replace(
				/%achievements%/g,
				game.achievements.total > 0
					? `${game.achievements.unlocked} of ${game.achievements.total} achievements`
					: 'no achievements'
			)
			.replace(/%achievements_unlocked%/g, game.achievements.unlocked.toLocaleString())
			.replace(/%achievements_total%/g, game.achievements.total.toLocaleString())
			.replace(/%achievements_percentage%/g, achievementsPercentage.toLocaleString())
			.replace(
				/%screenshots%/g,
				game.screenshotsCount > 0 ? `${game.screenshotsCount} screenshots` : 'no screenshots'
			)
			.replace(/%screenshots_count%/g, game.screenshotsCount.toLocaleString());
	};

	/**
	 * @template {PgPresetType} T
	 * @param {PgPreset<PgPresetType>} preset
	 * @param {T} type
	 * @returns {preset is PgPreset<T>}
	 */
	const pg_isPresetType = (preset, type) => {
		return preset.type === type;
	};

	/**
	 * @template {PgPresetType} T
	 * @param {PgPreset<PgPresetType>} preset
	 * @param {T} type
	 * @returns {preset is PgPreset<Exclude<PgPresetType, T>>}
	 */
	const pg_isNotPresetType = (preset, type) => {
		return preset.type !== type;
	};

	/**
	 * Previews the selected game.
	 * @returns {Promise<void>}
	 */
	const pg_gamePreview = async () => {
		if (
			!eblaeo.pg.gameInfos ||
			!eblaeo.pg.selectedGame ||
			!eblaeo.pg.gamePreviewContainerEl ||
			!eblaeo.pg.gamePreviewBodyEl
		) {
			return;
		}
		try {
			eblaeo.pg.gamePreviewContainerEl.style.display = 'block';
			showAlert(eblaeo.pg.gamePreviewBodyEl, 'atinner', 'loading', 'Loading game preview...');
			const gameElArrays = await pg_getGame(eblaeo.pg.selectedGame, false);
			if (!gameElArrays) {
				throw new CustomError('could not build elements for game preview');
			}
			// prettier-ignore
			DOM.insertElements(eblaeo.pg.gamePreviewBodyEl, 'atinner',
				eblaeo.pg.selectedGame.preset.type === 'box'
					? [
							['ul', {
								className: 'games',
								style: {
									minHeight: '0',
								},
							}, gameElArrays]
						]
					: gameElArrays
			);
		} catch (err) {
			if (err instanceof CustomError) {
				showAlert(eblaeo.pg.gamePreviewBodyEl, 'atinner', 'danger', err.message);
			} else {
				showAlert(eblaeo.pg.gamePreviewBodyEl, 'atinner', 'danger', 'failed to preview game');
			}
		}
	};

	/**
	 * Previews all games.
	 */
	const pg_fullPreview = () => {
		if (!eblaeo.pg.gameInfos || !eblaeo.pg.fullPreviewEl || !eblaeo.pg.fullPreviewBodyEl) {
			return;
		}
		try {
			eblaeo.pg.fullPreviewEl.style.display = 'block';
			showAlert(eblaeo.pg.fullPreviewBodyEl, 'atinner', 'loading', 'Loading full preview...');
			const elArrays = [];
			let boxElArrays = [];
			for (const gameInfo of eblaeo.pg.gameInfos) {
				if (gameInfo.game.preset.type === 'box') {
					boxElArrays.push(pg_getFullPreviewGame(gameInfo));
				} else {
					if (boxElArrays.length > 0) {
						// prettier-ignore
						elArrays.push(
							['ul', {
								className: 'games',
								style: {
									minHeight: '0',
								},
							}, boxElArrays]
						);
						boxElArrays = [];
					}
					elArrays.push(pg_getFullPreviewGame(gameInfo));
				}
			}
			if (boxElArrays.length > 0) {
				// prettier-ignore
				elArrays.push(
					['ul', {
						className: 'games',
						style: {
							minHeight: '0',
						},
					}, boxElArrays]
				);
			}
			DOM.insertElements(eblaeo.pg.fullPreviewBodyEl, 'atinner', elArrays);
		} catch (err) {
			if (err instanceof CustomError) {
				showAlert(eblaeo.pg.fullPreviewBodyEl, 'atinner', 'danger', err.message);
			} else {
				showAlert(eblaeo.pg.fullPreviewBodyEl, 'atinner', 'danger', 'failed to preview all games');
			}
		}
	};

	/**
	 * Returns an element array for a full preview game.
	 * @param {PgGameInfo} gameInfo The info for the game.
	 * @returns {ElementArray} The element array for the game.
	 */
	const pg_getFullPreviewGame = (gameInfo) => {
		// prettier-ignore
		return /** @type {ElementArray} */ (
			['div', {
				className: 'eblaeo-pg-full-preview-game',
				style: {
					display: gameInfo.game.preset.type === 'box' ? 'inline-block' : null,
				},
			}, [
				...gameInfo.elArrays,
				['div', { className: 'btn-toolbar' }, [
					['button', {
						type: 'button',
						className: 'btn btn-default edit',
						title: 'Edit',
						onclick: () => pg_selectGame(gameInfo.game, true),
					}, [
						['i', { className: 'fa fa-edit' }, null],
					]],
					['button', {
						type: 'button',
						className: 'btn btn-default remove',
						title: 'Remove',
						onclick: () => pg_removeGame(gameInfo.game),
					}, [
						['i', { className: 'fa fa-trash' }, null],
					]],
					['button', {
						type: 'button',
						className: 'btn btn-default move-down',
						title: 'Move down',
						onclick: () => pg_moveGameDown(gameInfo.game),
					}, [
						['i', { className: 'fa fa-arrow-down' }, null],
					]],
					['button', {
						type: 'button',
						className: 'btn btn-default move-up',
						title: 'Move up',
						onclick: () => pg_moveGameUp(gameInfo.game),
					}, [
						['i', { className: 'fa fa-arrow-up' }, null],
					]],
				]],
			]]
		);
	};

	/**
	 * Removes a game.
	 * @param {PgGame} game The game to remove.
	 */
	const pg_removeGame = (game) => {
		showDialog('Are you sure you want to remove this game?', () => {
			if (!eblaeo.pg.gameInfos) {
				return;
			}
			eblaeo.pg.gameInfos = eblaeo.pg.gameInfos.filter((gameInfo) => gameInfo.game !== game);
			pg_saveCaches();
			pg_fullPreview();
		});
	};

	/**
	 * Moves a game down.
	 * @param {PgGame} game The game to move down.
	 */
	const pg_moveGameDown = (game) => {
		if (!eblaeo.pg.gameInfos) {
			return;
		}
		const currentIndex = eblaeo.pg.gameInfos.findIndex((gameInfo) => gameInfo.game === game);
		const nextIndex = currentIndex + 1;
		if (nextIndex >= eblaeo.pg.gameInfos.length) {
			showDialog('Cannot move down!');
			return;
		}
		const tmpGameInfo = eblaeo.pg.gameInfos[nextIndex];
		eblaeo.pg.gameInfos[nextIndex] = eblaeo.pg.gameInfos[currentIndex];
		eblaeo.pg.gameInfos[currentIndex] = tmpGameInfo;
		pg_saveCaches();
		pg_fullPreview();
	};

	/**
	 * Moves a game up.
	 * @param {PgGame} game The game to move up.
	 */
	const pg_moveGameUp = (game) => {
		if (!eblaeo.pg.gameInfos) {
			return;
		}
		const currentIndex = eblaeo.pg.gameInfos.findIndex((gameInfo) => gameInfo.game === game);
		const previousIndex = currentIndex - 1;
		if (previousIndex < 0) {
			showDialog('Cannot move up!');
			return;
		}
		const tmpGameInfo = eblaeo.pg.gameInfos[previousIndex];
		eblaeo.pg.gameInfos[previousIndex] = eblaeo.pg.gameInfos[currentIndex];
		eblaeo.pg.gameInfos[currentIndex] = tmpGameInfo;
		pg_saveCaches();
		pg_fullPreview();
	};

	/**
	 * Loads the caches.
	 * @returns {Promise<void>}
	 */
	const pg_loadCaches = async () => {
		if (!eblaeo.pg.generatorEl) {
			return;
		}
		eblaeo.pg.gamesCache = /** @type {PgGame[]} */ (PersistentStorage.getLocalValue('gamesCache'));
		eblaeo.pg.playtimeThisMonthCache = /** @type {Record<number, number>} */ (PersistentStorage.getLocalValue(
			'playtimeThisMonthCache'
		));
		eblaeo.pg.screenshotsCache = /** @type {Record<number, number>} */ (PersistentStorage.getLocalValue(
			'screenshotsCache'
		));
		eblaeo.pg.reviewsCache = /** @type {Record<number, PgReviewCache>} */ (PersistentStorage.getLocalValue(
			'reviewsCache'
		));
		if (!eblaeo.pg.gamesCache || eblaeo.pg.gamesCache.length === 0) {
			return;
		}
		try {
			for (const game of eblaeo.pg.gamesCache) {
				await pg_generateGame(game, false, true);
			}
			pg_fullPreview();
		} catch (err) {
			if (err instanceof CustomError) {
				showAlert(eblaeo.pg.generatorEl, 'beforebegin', 'danger', err.message);
			} else {
				showAlert(eblaeo.pg.generatorEl, 'beforebegin', 'danger', 'failed to load games cache');
			}
		}
	};

	/**
	 * Saves the caches.
	 */
	const pg_saveCaches = () => {
		if (!eblaeo.pg.gameInfos) {
			return;
		}
		PersistentStorage.setLocalValue(
			'gamesCache',
			eblaeo.pg.gameInfos.map((gameInfo) => gameInfo.game)
		);
		PersistentStorage.setLocalValue(
			'playtimeThisMonthCache',
			eblaeo.pg.playtimeThisMonthCache || {}
		);
		PersistentStorage.setLocalValue('screenshotsCache', eblaeo.pg.screenshotsCache || {});
		PersistentStorage.setLocalValue('reviewsCache', eblaeo.pg.reviewsCache || {});
	};

	/**
	 * Deletes the caches.
	 */
	const pg_deleteCaches = () => {
		PersistentStorage.deleteLocalValue('gamesCache');
		PersistentStorage.deleteLocalValue('playtimeThisMonthCache');
		PersistentStorage.deleteLocalValue('screenshotsCache');
		PersistentStorage.deleteLocalValue('reviewsCache');
	};

	try {
		BlaeoApi.init();
		await PersistentStorage.init(scriptId, defaultValues);
		await load();
	} catch (err) {
		console.log(`Failed to load ${scriptName}: `, err);
	}
})();
