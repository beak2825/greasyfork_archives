// ==UserScript==
// @name          WME Maximized (Basic rickzabel edits)
// @version       0.6.6 (Beta)
// @namespace     http://greasyfork.org
// @description	  Modifies the Waze Map Editor layout to provide a larger viewing area for editing, adds additional navigation links to menu, and prevents Place Update and UR panels from dropping below visible area.
// @author        rickzabel
// @homepage      https://greasyfork.org/en/scripts/13733-wme-maximized-basic-rickzabel-edits
// @include       https://www.waze.com/*
// @include       https://wiki.waze.com/*
// @include       https://editor-beta.waze.com/*     
// @run-at        document-start
// @grant         none
// @thx	          SeekingSerenity for making this and SuperMedic for function begin() and integration support
// @downloadURL https://update.greasyfork.org/scripts/13733/WME%20Maximized%20%28Basic%20rickzabel%20edits%29.user.js
// @updateURL https://update.greasyfork.org/scripts/13733/WME%20Maximized%20%28Basic%20rickzabel%20edits%29.meta.js
// ==/UserScript==
(function() {
	function begin() {
		if (typeof($) === 'function') {
			addLinks();
			CheckForMail();
			//check for mail every 20 seconds
			//window.window.setInterval(CheckForMail,20000);

			//check for mail every 5 minutes
			window.window.setInterval(CheckForMail, 300000);

			//biglocks
			//window.window.setInterval(offsetLockIcons,750);

		} else {
			console.info('Maximizer: no Jquery');
			window.setTimeout(begin, 400);
		}
	}

	function CheckForMail() {
		//thanks toolbox
		var WMETB_forumInbox = $.get('https://www.waze.com/forum/ucp.php?i=pm&folder=inbox', function(WMETB_forumInboxCheckResult) {
			var WMETB_availablePMText = 'Inbox (';
			if (WMETB_forumInboxCheckResult.indexOf(WMETB_availablePMText) != -1) {
				var InboxCountStart = WMETB_forumInboxCheckResult.indexOf(WMETB_availablePMText);
				var InboxEndPosistion = WMETB_forumInboxCheckResult.indexOf(")", WMETB_forumInboxCheckResult.indexOf(WMETB_availablePMText));
				var res = WMETB_forumInboxCheckResult.substring(InboxCountStart + 7, InboxEndPosistion);
				$('#maximizerInbox').html('INBOX (' + res + ')');
				$('#maximizerInbox').css('color', 'red');
				$('#maximizerInbox').css('font-size', '14px');
				//console.log('Maximizer: You have an unread Message in the forum! ' + InboxCountStart + ' ' + InboxEndPosistion + ' ' + res);
			} else {
				$('#maximizerInbox').html('INBOX');
				$('#maximizerInbox').css('color', 'white');
				$('#maximizerInbox').css('font-size', '11px');
				//console.log('Maximizer: No unread Private Messages in the forum');
			}
		});
	}

	function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) {
			return;
		}
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}

	function addLinks() {
		$("ul.waze-header-menu").append('<li><a href="https://www.waze.com/editor">EDITOR</a></li>');
		$("ul.waze-header-menu").append('<li><a href="https://www.waze.com/forum" target="_blank">FORUM</a></li>');
		$("ul.waze-header-menu").append('<li><a href="https://www.waze.com/forum/ucp.php?i=pm&folder=inbox" ID="maximizerInbox" target="_blank">INBOX</a></li>');
		$("ul.waze-header-menu").append('<li><a href="https://wiki.waze.com/wiki" target="_blank">WIKI</a></li>');
	}
/*
	function offsetLockIcons() {
		$('image[width="30"]').each(function() {
			temp = $(this);

			if (temp.attr('width') == 30) {
				y = temp.attr('y') - 11;
				temp.attr('y', y);
				x = temp.attr('x') - 11;
				temp.attr('x', x);
				temp.attr('width', '50px');
				temp.attr('height', '50px');
			}

		});
	}
*/
	//toolbar buttons icon expanded grey bar stuff
	//this is where the drop down menus show
	addGlobalStyle('.toolbar-button { height: 39px !important; }');

	//black bar
	addGlobalStyle('.topbar { height: 20px !important; line-height: 20px !important; padding: 0 10px !important; }');
	//topbar city info
	addGlobalStyle('.topbar .location-info { font-size: 12px !important; }');

	// Chat Styles
	addGlobalStyle('.room-name.single-room-label {font-size: 11px !important; padding-left: 8px !important; }');
	addGlobalStyle('.dropdown .dropdown-toggle { padding-left: 5px !important; padding-right: 0px !important; }');
	addGlobalStyle('.status { font-size: 11px !important; }');
	addGlobalStyle('#ChatJumper-JUMP.ChatJumper, #ChatJumper-JUMP-clear { font-size: 11px !important; padding-left: 1px !important; padding-right: 1px !important; }');
	//disable chat intro
	addGlobalStyle('.chat-intro-tip { display: none !important; }');

	//Waze Header
	addGlobalStyle('.waze-header { height: 24px !important;  line-height: 26px !important; }');
	addGlobalStyle('.waze-header-contents { margin-left: 0px !important; width: 100% !important; }');
	addGlobalStyle('.waze-header-logo { background-size: 60px !important; margin: 4px 0px auto auto !important; background-position: top center !important; }');
	addGlobalStyle('.waze-header-menu { line-height: 25px !important; font-size: 11px !important; }');
	addGlobalStyle('.waze-header-menu li a { padding: 0px 10px !important; }');
	addGlobalStyle('.waze-header .login-view { padding-right: 15px !important; }');
	addGlobalStyle('#login-status { margin-right: 5px !important; }');
	addGlobalStyle('#header-actions, .waze-header .login-view .login-button, .waze-header .navigation { right: 20px !important; }');

	//edit toolbar
	addGlobalStyle('#toolbar.toolbar-button { width: 25px !important; height: 25px !important; }');
	addGlobalStyle('.toolbar-sprite, .toolbar-addplace, .toolbar-addroad, .toolbar-layers, .toolbar-redo, .toolbar-save, .toolbar-trash, .toolbar-undo, #toolbar #layer-switcher-menu:after, #edit-buttons .toolbar-button.toolbar-group-drawing::after, #edit-buttons .toolbar-button.toolbar-group-venues::after, #edit-buttons .toolbar-button.WazeControlUndoControl::after, #edit-buttons .toolbar-button.WazeControlRedoControl::after, #edit-buttons .toolbar-button.WazeControlSave::after, #edit-buttons .toolbar-button.WazeControlDeleteFeature::after, #map-lightbox .content .header .toolbar .toolbar-addplace, #map-lightbox .content .header .toolbar .toolbar-addroad, #map-lightbox .content .header .toolbar .toolbar-layers, #map-lightbox .content .header .toolbar .toolbar-redo, #map-lightbox .content .header .toolbar .toolbar-save, #map-lightbox .content .header .toolbar .toolbar-trash, #map-lightbox .content .header .toolbar .toolbar-undo, #toolbar #layer-switcher-menu a span { background-size: 25px 175px !important; }');

	//squish the buttons together
	
	addGlobalStyle('#edit-buttons .toolbar-button { width: 44px !important;}');

	//places and roads icon triangle
	addGlobalStyle('#edit-buttons .dropdown-menu:before{ left: 16px; !important; }');
	addGlobalStyle('#edit-buttons .dropdown-menu:after{ left: 17px; !important; }');
	//layers icon triangle
	addGlobalStyle('#layer-switcher .dropdown-menu::before { right: 11px !important; }');
	addGlobalStyle('#layer-switcher .dropdown-menu::after { right: 12px !important; }');
	
	
	//width: 25px !important;
	addGlobalStyle('#toolbar .toolbar-button:after {  height: 25px !important; top: 9px !important; }');//remove width
	addGlobalStyle('#edit-buttons .toolbar-button.toolbar-group-drawing:after { background-position: 0px -21px !important; }');
	addGlobalStyle('#edit-buttons .toolbar-button.WazeControlDeleteFeature:after { background-position: 0px -129px !important; }');
	addGlobalStyle('#edit-buttons .toolbar-button.WazeControlRedoControl:after { background-position: 0px -83px !important; }');
	addGlobalStyle('#edit-buttons .toolbar-button.WazeControlUndoControl:after { background-position: 0px -152px !important; }');
	addGlobalStyle('#edit-buttons .toolbar-button.WazeControlSave:after { background-position: 0px -106px !important; }');
	addGlobalStyle('#toolbar #layer-switcher-menu a span, #toolbar #layer-switcher-menu:after { width: 25px !important; height: 25px !important; background-position: 0px -53px !important; }');

	//resize toolbox icon
	addGlobalStyle('.WazeControlLayerSwitcherIcon { width: 40px !important; height: 38px !important; background-size: 24px 24px !important; float: none !important; }');
	//move the toolbox icon
	addGlobalStyle('#WazeControlLayerSwitcherIconContainer { width: 40px !important; height: 60px !important; }');

	//search
	addGlobalStyle('#map-search { line-height: 60px !important; }');
	addGlobalStyle('#map-search, #toolbar { height: 41px !important;}');
	addGlobalStyle('#map-search { max-width: 280px !important; }');
	addGlobalStyle('#map-search .input-wrapper .input-addon-left { margin-top: 8px !important; }');
	//move the search bar up
	addGlobalStyle('#map-search > div > input { position: absolute !important; top: 7px! important;}');
	//move the search icon
	addGlobalStyle('#map-search > div > button { position: absolute !important; z-index: 999999;}');
	//move the search spinner
	addGlobalStyle('#map-search > div > i { position: absolute !important; padding: 18px 11px !important; z-index: 999999;}');

	addGlobalStyle('#layer-switcher-menu { width: 40px !important; height: 40px !important; }');
	addGlobalStyle('#layer-switcher .dropdown-menu { top: 39px !important; line-height: 18px !important; }');
	addGlobalStyle('#toolbar .toolbar-separator { height: 40px !important; }');

	addGlobalStyle('#sidebar #user-details .rank span  { margin: 0px !important; }');
	addGlobalStyle('#sidebar .message { font-size: 12px !important; line-height: 14px  !important; margin: 5px  !important; }');
	addGlobalStyle('.tips { display: none !important; }');
	addGlobalStyle('#sidebar .tab-content { margin-bottom: 35px !important; padding: 3px 3px 10px 0px !important; }');
	addGlobalStyle('#sidebar #sidepanel-prefs .tab-content { padding: 0px !important; }');
	addGlobalStyle('#sidebar #sidepanel-prefs .controls .btn-group { right: 20px !important; }');
	addGlobalStyle('table.add-alt-street-form { table-layout: fixed !important; }');
	addGlobalStyle('.alt-street-form-template > td:nth-child(2) { padding-bottom: 41px !important; }');
	addGlobalStyle('.alt-street-form-template > td:nth-child(3) { padding-bottom: 45px !important; }');
	addGlobalStyle('#edit-panel .address-form-actions { margin-top: 0px !important; }');
	addGlobalStyle('ul.typeahead .dropdown-menu { width: 100px !important; }');
	addGlobalStyle('.typeahead .dropdown-menu > li > a { padding: 3px !important; font-size: 11px !important; }');
	addGlobalStyle('.nav > li > a { padding: 4px !important; }');
	addGlobalStyle('#sidebar #links { width: 330px !important; font-size: 10px !important; background-color: #e9e9e9 !important; border-right: #dfdfdf thin solid !important; }');

	// Add Place Image Styles
	addGlobalStyle('.modal-dialog {margin: 90px auto !important;}');

	// Add WME Place Update Fix
	addGlobalStyle('.panel.place-update-edit .header {line-height:18px !important;}');

	// Add WME UR Panel Fix
	//css to fix the beta editors UR window
	addGlobalStyle('.problem-edit .header { line-height: 15px !important; padding: 0px 15px !important; }');
	addGlobalStyle('.problem-edit .section .title { line-height: 15px !important;  }');
	addGlobalStyle('.problem-edit .section .content { padding: 5px !important;}');

	//donebutton
	//addGlobalStyle('.problem-edit .actions .done { width: 30% !important; float: right !important; }');
	//addGlobalStyle('.problem-edit .actions .done { width: 30% !important; position: absolute !important; top: 90%!important;  right: 11%;}');

	//radio options
	addGlobalStyle('.problem-edit .actions .controls-container label { margin-bottom: 5px !important; }');

	// Add Location Info Styles
	//addGlobalStyle('.WazeControlLocationInfo { font-size: 14px !important; padding: 0px 10px !important; line-height: 30px !important; left: 50px !important; }');
	// Add Location Info Styles
	//addGlobalStyle('#RSconditions, #RSoperations, #RSselection { text-indent: 0px !important; }');

	// Add WME Aerial Shifter Styles
	addGlobalStyle('#header-actions > div:nth-child(5) { right: 380px !important; top: 20px !important;}');

	//validator
	addGlobalStyle('.c3584528711 { margin-top: 20px !important; }');

	//normname
	addGlobalStyle('.NormNameIcon { height: 40px !important; width: 37px !important; }');

	//biglocks
	//addGlobalStyle('image[width="30"] { opacity: 1 !important; width: 50px; height: 50px; }');

	//WME Favorites Icon
	addGlobalStyle('#fav-loc { position: absolute; top: 29px; }');
 

    //live map
    addGlobalStyle('.map-container #map {top: 24px !important;}');

    
	//begin();
	window.setTimeout(begin, 4000);

})();