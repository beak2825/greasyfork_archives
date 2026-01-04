// ==UserScript==
// @name			Roll20 Character Sheet Print Support
// @namespace		http://statonions.com
// @version			0.1.5
// @description		Adds Print support to character sheet pop-ups on Roll20.net
// @author			Justice Noon
// @match			https://app.roll20.net/editor/
// @downloadURL https://update.greasyfork.org/scripts/389733/Roll20%20Character%20Sheet%20Print%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/389733/Roll20%20Character%20Sheet%20Print%20Support.meta.js
// ==/UserScript==
// Changelog: Documented code so people can install it more soundly. Functionality has not changed.
(function() {
	//underscore and Campaign are assumed. charactersheet_useroptions is only present on some sheets
	/*globals _, charactersheet_useroptions, Campaign */

	//Waits for Roll20's CSS to arrive before proceeding. Max 20 retries at 2 second interval
	var areYouReady = function(times) {
		if (times > 20) {
			return; }
		if (typeof Campaign == 'undefined' || !Campaign.gameFullyLoaded) {
			_.delay(areYouReady, 2000, times++);
			return;
		}
		//Assures the script successfully runs once
		if (!document.getElementById('printCss')) {
			//Clones base.css (bootstrap css) into a stylesheet array excluding everything that affects the way a page is printed
			var newBase = '', oldBase = _.find(document.styleSheets, o => o.href && o.href.indexOf('base.css') > -1);
			for (var k in oldBase.rules) {
				if (oldBase.rules[k].conditionText != 'print') {
					newBase += oldBase.rules[k].cssText; }
			}
			//Remove base.css now that its services are no longer required
			document.querySelector('link[href*=base]').remove();
			//Creates a style element to take the old one's place. This is done so I don't have to request permissions and scare people unnecarily with warnings.
			//It also serves as my success detection for avoiding infinite loops and ensuring page load order.
			var insert = document.createElement('style'), baseStyle = document.createElement('style');
			insert.setAttribute('type', 'text/css'); insert.setAttribute('media', 'print'); insert.setAttribute('id', 'printCss');
			insert.innerHTML = newCss;
			//Detect if the sheet is Patherfinder Community and add some additional css if it is
			if (typeof charactersheet_useroptions != 'undefined' && charactersheet_useroptions[0].attribute == 'is_v1' && charactersheet_useroptions[1].attribute == 'migrate1') {
				insert.innerHTML += pfcCss; }
			//Button everything up and add to the DOM
			baseStyle.setAttribute('type', 'text/css');
			baseStyle.innerHTML = newBase;
			document.getElementsByTagName('head')[0].insertBefore(baseStyle, document.querySelector('head>link'));
			document.getElementsByTagName('head')[0].appendChild(insert);
		}
	};
	//Waits for page to be user interactable before attempting to replace css
	_.defer(areYouReady, 1);
	//CSS is written down here so I can use template literals and proper indendation for easy copy-paste and reading.
	var newCss =
`body>* {
        display: none!important;
  }

  .charactersheet,
    .ui-dialog,
    .ui-dialog-content
  {
    height: auto!important;
    display: block!important;
  }

  .ui-dialog
  {
    overflow: visible!important;
    position: relative!important;
    width: 100%!important;
    left: 0!important;
    top: 0!important;
    background-color: #fff;
    border-width: 0;
  }

  #editobject,
    #floatingtoolbar,
    #footer,
    #page-toolbar,
    .nav.nav-tabs,
    .ui-dialog-titlebar,
    .ui-resizable-handle
  {
    display: none!important;
  }

  body
  {
    overflow: visible;
    background: #fff;
  }
`;
var pfcCss =
`.sheet-h2-section,.sheet-section:not(.sheet-section1) {
    page-break-inside: avoid;
}
.sheet-top-buttons,sheet-main:not(.sheet-section),.sheet-mode,.sheet-selectedlabel-check,.sheet-selectedlabel-check+b,.sheet-showsect {
	display: none!important;
}`;
})();