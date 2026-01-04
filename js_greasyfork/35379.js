// ==UserScript==
// @name        Mock Old Search Bar
// @name:ja     旧検索バーもどき
// @description Slightly customizes the search bar on the tool bar to the old one’s like behavior.
// @description:ja ツールバーの検索バーの挙動を、旧検索バー風に微調整します。
// @namespace   https://greasyfork.org/users/137
// @version     1.3.0
// @include     main
// @license     MPL-2.0
// @contributionURL https://github.com/sponsors/esperecyan
// @compatible  Firefox userChromeJS用スクリプト です (※GreasemonkeyスクリプトでもuserChromeES用スクリプトでもありません) / This script is for userChromeJS (* neither Greasemonkey nor userChromeES)
// @incompatible Opera
// @incompatible Chrome
// @charset     UTF-8
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/35379
// @downloadURL https://update.greasyfork.org/scripts/35379/Mock%20Old%20Search%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/35379/Mock%20Old%20Search%20Bar.meta.js
// ==/UserScript==

new (class {
	constructor()
	{
		/**
		 * @access private
		 * @type {Ci.nsIDOMXULPopupElement}
		 */
		this.popup = document.getElementById('PopupSearchAutoComplete');

		/**
		 * @access private
		 * @type {Ci.nsIDOMXULPopupElement}
		 */
		this.buttons = this.popup.oneOffButtons.buttons;

		this.buttons.addEventListener('click', this);
		this.integrateCurrentEngine();
	}

	/**
	 * ワンクリック検索ボタンクリック時に検索を実行せず、既定の検索エンジンを切り替えてポップアップを閉じます。
	 * @param {MouseEvent} event - clickイベント。
	 */
	handleEvent(event)
	{
		if (event.button === 0 && event.originalTarget.engine) {
			event.stopPropagation();
			this.popup.closePopup();
			Services.search.setDefault(event.originalTarget.engine, Services.search.CHANGE_REASON_USER_SEARCHBAR);
		}
	}

	/**
	 * CustomCSSforFxのsearchbar_popup_engines_show_labels.css向けに、既定の検索エンジンを太字にします。
	 * @access private
	 * @type {Object.<Function>}
	 * @see {@link https://github.com/Aris-t2/CustomCSSforFx/blob/master/classic/css/generalui/searchbar_popup_engines_show_labels.css}
	 */
	setCurrentEngineButtonHighlightTrap()
	{
		new MutationObserver(function (mutations) {
			const name = Services.search.defaultEngine.name;
			for (const mutation of mutations) {
				const currentEngineButton
					= Array.from(mutation.addedNodes).find(node => node.getAttribute('tooltiptext') === name);
				if (currentEngineButton) {
					currentEngineButton.style.fontWeight = 'bold';
					break;
				}
			}
		}).observe(this.buttons, { childList: true });
	}

	/**
	 * @access private
	 * @type {Object.<Function>}
	 * 		【Firefox 60 ESR】CustomCSSforFxのsearchbar_popup_engines_show_labels.css向けに、既定の検索エンジンを太字にします。
	 */
	get currentEngineButtonHighlightTrap()
	{
		return {apply: (target, thisArg, argumentsList) => {
			const returnValue = Reflect.apply(target, thisArg, argumentsList);

			for (const button of this.buttons.querySelectorAll(
				'.searchbar-engine-one-off-item:not(.dummy):not(.search-setting-button-compact)[style*="font-weight"]'
			)) {
				button.style.fontWeight = '';
			}
			this.buttons.querySelector(`[tooltiptext="${CSS.escape(Services.search.defaultEngine.name)}"]`)
				.style.fontWeight = 'bold';

			return returnValue;
		}};
	}

	/**
	 * 既定の検索エンジンを、他の検索エンジンのボタンリストに統合します。
	 * @access private
	 */
	integrateCurrentEngine()
	{
		let searchPanelCurrentEngine = this.popup.getElementsByClassName('search-panel-current-engine')[0];
		if (searchPanelCurrentEngine) {
			this.setCurrentEngineButtonHighlightTrap();
		} else {
			// Firefox 60 ESR
			searchPanelCurrentEngine
				= document.getAnonymousElementByAttribute(this.popup, 'anonid', 'searchbar-engine');
			this.popup.oneOffButtons._rebuild
				= new Proxy(this.popup.oneOffButtons._rebuild, this.currentEngineButtonHighlightTrap);
			BrowserSearch.searchBar.selectEngine
				= new Proxy(BrowserSearch.searchBar.selectEngine, this.currentEngineButtonHighlightTrap);
		}
		searchPanelCurrentEngine.style.display = 'none';
		this.popup.oneOffButtons.header.style.display = 'none';
		this.popup.oneOffButtons.setAttribute('includecurrentengine', 'on');
	}
})();
