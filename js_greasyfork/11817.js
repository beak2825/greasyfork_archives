// ==UserScript==
// @name          WME Maximized (Basic edits)
// @version       0.47 (Beta)
// @namespace     http://greasyfork.org
// @description   Modifies the Waze Map Editor layout to provide a larger viewing area for editing, adds additional navigation links to menu, and prevents Place Update and UR panels from dropping below visible area.
// @author        CarlosLaso
// @homepage      https://greasyfork.org/en/scripts/11817-wme-maximized-basic-carloslaso-edits
// @include       https://www.waze.com/editor*
// @include       https://www.waze.com/*/editor*
// @include       https://beta.waze.com*
// @exclude       https://www.waze.com/user/editor*
// @run-at        document-start
// @grant         none
// @thx           SeekingSerenity for making this and SuperMedic for function begin() and integration support and rickzabel.
// @downloadURL https://update.greasyfork.org/scripts/11817/WME%20Maximized%20%28Basic%20edits%29.user.js
// @updateURL https://update.greasyfork.org/scripts/11817/WME%20Maximized%20%28Basic%20edits%29.meta.js
// ==/UserScript==



(function() {

	function bootstrap(tries) {
		tries = tries || 1;

		if (window.W &&
			window.W.map &&
			window.W.model &&
			$) {
			init();
		} else if (tries < 1000) {
			setTimeout(function () {bootstrap(tries++);}, 200);
		}
	}

	function addGlobalStyle(css) {

		var head, style;
		head = document.getElementsByTagName('head')[0];

		if (!head) {return;}
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}


	bootstrap();

	function init(){
		addGlobalStyle(' #overlay-buttons { position: absolute !important; right: 12px !important; top: 50px !important; z-index: 8 !important; } ');
		addGlobalStyle('"#sidepanel-WMEmagic":{"icon":{"fontFamily":"FontAwesome","charCode":"61648"}}');
		addGlobalStyle('#sidebar #links::before { display: none !important; }');
		addGlobalStyle('#sidebar #user-info #user-box { display: none !important; }');
		addGlobalStyle('#user-info .tab-content { padding: 1px 10px 5px 10px !important; }');
		addGlobalStyle('#WMETB_NavBar { background-color: #cccccc !important; opacity: 1 !important; }');
		addGlobalStyle('#WMETB_NavBar {left: 329px !important; top: 903px !important; }');
		addGlobalStyle('#WMETB_Dashboard {left: 1px !important; top: 720px !important; }');
	}
})();