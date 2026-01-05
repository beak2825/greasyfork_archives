// ==UserScript==
// @name           The Waze Forum Theme
// @namespace      https://greasyfork.org/users/11629-TheLastTaterTot
// @description    A clean, Waze-ish theme for the Waze forum
// @include        http*://*.waze.com/forum/*
// @author         TheLastTaterTot
// @version        0.1.2
// @grant          GM_addStyle
// @grant          GM_getResourceText
// @resource       bootstrap https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/16538/The%20Waze%20Forum%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/16538/The%20Waze%20Forum%20Theme.meta.js
// ==/UserScript==

// Global(s)
thisPage = {};

var bootstrap = GM_getResourceText("bootstrap");
//var fontawesome = GM_getResourceText("fontawesome"); // @resource       fontawesome https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css
//GM_addStyle(GM_getResourceText("prettify")); // @require        http://google-code-prettify.googlecode.com/svn/trunk/src/prettify.js // @resource       prettify http://google-code-prettify.googlecode.com/svn/trunk/src/prettify.css

var cssFont = '@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800);)';
var awesomeFont = '@import url(https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css);';

/////////////////////////////////////////////////////////////////////////////////

window.addEventListener('DOMContentLoaded', function(){
	GM_addStyle(bootstrap);
	GM_addStyle(awesomeFont);
	GM_addStyle(cssFont);
	/*
	var head = document.head || document.getElementsByTagName('head')[0],
	    style = document.createElement('style');

	style.type = 'text/css';
	if (style.styleSheet){
	    style.styleSheet.cssText = cssFont;
	} else {
	    style.appendChild(document.createTextNode(cssFont));
	}
	head.appendChild(style);
		//console.log('Imported Open Sans.')
	*/
//	(function(jQuery){
//		jQuery( document ).ready( function() {
//	    prettyPrint();
//	  } );
//	 }(jQuery))

	//~~~~~CSS~~~~~~
	var prettify = '', bootstrapMods = '';

	// Google Prettify CSS for prettify.js - https://google-code-prettify.googlecode.com/svn/trunk/src/prettify.css
	/*
	prettify = '\
		.pln { color: #000 }\
		@media screen {\
		  .str { color: #080 } \
		  .kwd { color: #008 } \
		  .com { color: #800 } \
		  .typ { color: #606 } \
		  .lit { color: #066 } \
		  .pun, .opn, .clo { color: #660 }\
		  .tag { color: #008 } \
		  .atn { color: #606 } \
		  .atv { color: #080 } \
		  .dec, .var { color: #606 }  \
		  .fun { color: red }  \
		}\
		@media print, projection {\
		  .str { color: #060 }\
		  .kwd { color: #006; font-weight: bold }\
		  .com { color: #600; font-style: italic }\
		  .typ { color: #404; font-weight: bold }\
		  .lit { color: #044 }\
		  .pun, .opn, .clo { color: #440 }\
		  .tag { color: #006; font-weight: bold }\
		  .atn { color: #404 }\
		  .atv { color: #060 }\
		}\
		pre.prettyprint, code.prettyprint { border: 2px solid #ccc; border-radius: 5px; margin-bottom: 0; padding: 9.5px; }\
		ol.linenums { margin-top: 0; margin-bottom: 0 } \
		li.L0, li.L1, li.L2, li.L3, li.L5, li.L6, li.L7, li.L8 { list-style-type: decimal !important }\
		li.L1, li.L3, li.L5, li.L7, li.L9 { background: #eee }';

	bootstrapMods = prettify;
	*/
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// CSS: BOOTSTRAP BUTTONS
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	bootstrapMods += '\n\
		#phpbb .btn { border-radius: 5px; border-width: 0px 0px 2px; font-weight: bold; \
				 display: inline-block; margin-bottom: 0px; text-align: center; vertical-align: middle; \
				 background-image: none; white-space: nowrap; line-height: normal; cursor: pointer; -moz-user-select: none; \
				 border-top-style: solid !important; border-right-style: solid !important; border-bottom-style: solid !important; border-left-style: solid !important; \
				 -moz-border-top-colors: none; -moz-border-right-colors: none; -moz-border-bottom-colors: none; -moz-border-left-colors: none;}\n\
		#phpbb .btn.disabled, #phpbb .btn[disabled], #phpbb fieldset[disabled] .btn { cursor: default }\n\
		#phpbb .btn-text-light {color: #FFF !important; font-weight: bold !important; }\n\
		#phpbb .btn-dark {color: #3D3D3D !important; font-weight: bold !important; }\n\
		#phpbb .btn.disabled {pointer-events: none; } \n\
\
		#phpbb .btn-default, #phpbb a.btn-default \
				{ color: #3D3D3D !important; font-weight: bold !important; background-color: #E9E9E9; border-color: #C2C2C2 !important; }\n\
		#phpbb .btn-default:hover, #phpbb .btn-default:focus, #phpbb .btn-default:active, #phpbb .btn-default.active, \
			#phpbb a.btn-default:hover, #phpbb a.btn-default:focus, #phpbb a.btn-default:active, #phpbb a.btn-default.active \
				{ color: #3D3D3D !important; font-weight: bold; background-color: #D5D5D5; border-color: #A3A3A3 !important; outline: none; }\n\
		#phpbb .btn-default:hover, #phpbb a.btn-default:hover \
				{ background-color: #F3F3F3; }\n\
		#phpbb .btn-default:active, #phpbb a.btn-default:active \
				{ background-color: #C2C2C2; }\n\
\
		#phpbb .btn-secondary, #phpbb a.btn-secondary \
				{ color: #3D3D3D !important; font-weight: bold !important; background-color: #F9F9F9; border-color: #E2E2E2 !important; }\n\
		#phpbb .btn-secondary:hover, #phpbb .btn-secondary:focus, #phpbb .btn-secondary:active, #phpbb .btn-secondary.active, \
			#phpbb a.btn-secondary:hover, #phpbb a.btn-secondary:focus, #phpbb a.btn-secondary:active, #phpbb a.btn-secondary.active \
				{ color: #3D3D3D !important; font-weight: bold; background-color: #E5E5E5; border-color: #C3C3C3 !important; outline: none; }\n\
		#phpbb .btn-secondary:hover, #phpbb a.btn-secondary:hover \
				{ background-color: #FDFDFD; }\n\
		#phpbb .btn-secondary:active, #phpbb a.btn-secondary:active \
				{ background-color: #E2E2E2; }\n\
\
		#phpbb .btn-primary, #phpbb a.btn-primary\
				{ color: #FFF !important; font-weight: bold !important; background-color: #92C2D1; border-color: #78B0BF !important; }\n\
		#phpbb .btn-primary:hover, #phpbb .btn-primary:focus, #phpbb .btn-primary:active, #phpbb .btn-primary.active, \
			#phpbb a.btn-primary:hover, #phpbb a.btn-primary:focus, #phpbb a.btn-primary:active, #phpbb a.btn-primary.active \
				{ color: #FFF !important; font-weight: bold; background-color: #75B2C5; border-color: #5097A9 !important; outline: none; }\n\
		#phpbb .btn-primary:hover, #phpbb a.btn-primary:hover \
				{ background-color: #A7D2DF; }\n\
		#phpbb .btn-primary:active, #phpbb a.btn-primary:active \
				{ background-color: #78B0BF; }\n\
\
		#phpbb .btn-warning, #phpbb a.btn-warning\
				{ color: #3D3D3D !important; font-weight: bold !important; background-color: #E6D87E; border-color: #D9CB73 !important; }\n\
		#phpbb .btn-warning:hover, #phpbb .btn-warning:focus, #phpbb .btn-warning:active, #phpbb .btn-warning.active, \
			#phpbb a.btn-warning:hover, #phpbb a.btn-warning:focus, #phpbb a.btn-warning:active, #phpbb a.btn-warning.active \
				{ color: #3D3D3D !important; font-weight: bold; background-color: #DFCE5C; border-color: #CCB943 !important; outline: none; }\n\
		#phpbb .btn-warning:hover, #phpbb a.btn-warning:hover \
				{ background-color: #F3E797; }\n\
		#phpbb .btn-warning:active, #phpbb a.btn-warning:active \
				{ background-color: #D9CB73; }\n\
\
		#phpbb .btn-success, #phpbb a.btn-success\
				{ color: #FFF !important; font-weight: bold !important; background-color: #95C491; border-color: #82B57F !important; }\n\
		#phpbb .btn-success:hover, #phpbb .btn-success:focus, #phpbb .btn-success:active, #phpbb .btn-success.active,\
			#phpbb a.btn-success:hover, #phpbb a.btn-success:focus, #phpbb a.btn-success:active, #phpbb a.btn-success.active \
				{ color: #FFF !important; font-weight: bold; background-color: #7BB676; border-color: #5E9C5A !important; outline: none; }\n\
		#phpbb .btn-success:hover, #phpbb a.btn-success:hover \
				{ background-color: #A6D3A4; }\n\
		#phpbb .btn-success:active, #phpbb a.btn-success:active \
				{ background-color: #82B57F; }\n\
\
		#phpbb .btn-danger, #phpbb a.btn-danger\
				{ color: #FFF !important; font-weight: bold !important; background-color: #FF8383; border-color: #EB7171 !important; }\n\
		#phpbb .btn-danger:hover, #phpbb .btn-danger:focus, #phpbb .btn-danger:active, #phpbb .btn-danger.active,\
			#phpbb a.btn-danger:hover, #phpbb a.btn-danger:focus, #phpbb a.btn-danger:active, #phpbb a.btn-danger.active \
				{ color: #FFF !important; font-weight: bold; background-color: #FF5A5A; border-color: #E33B3B !important; outline: none; }\n\
		#phpbb .btn-danger:hover, #phpbb a.btn-danger:hover \
				{ background-color: #F99; }\n\
		#phpbb .btn-danger:active, #phpbb a.btn-danger:active \
				{ background-color: #EB7171; }\n\
\
		#phpbb .btn-info, #phpbb a.btn-info\
				{ color: #FFF !important; font-weight: bold !important; background-color: #C290C6; border-color: #B380B7 !important; }\n\
		#phpbb .btn-info:hover, #phpbb .btn-info:focus, #phpbb .btn-info:active, #phpbb .btn-info.active,\
			#phpbb a.btn-info:hover, #phpbb a.btn-info:focus, #phpbb a.btn-info:active, #phpbb a.btn-info.active \
				{ color: #FFF !important; font-weight: bold; background-color: #B375B8; border-color: #9A5A9F !important; outline: none; }\n\
		#phpbb .btn-info:hover, #phpbb a.btn-info:hover \
				{ background-color: #D1A6D4; }\n\
		#phpbb .btn-info:active, #phpbb a.btn-info:active \
				{ background-color: #B380B7; }\n\
		';

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// CSS: BOOTSTRAP PANELS AND ETC
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	bootstrapMods += '\
	    #phpbb .bg-primary {background-color: #92C2D1; } \n\
	    #phpbb .bg-info {background-color: #E4C4E6; } \n\
	 	#phpbb .panel { background-color: #FFF; box-shadow: 0; border-radius: 5px; border: 2px solid transparent; }\n\
	    #phpbb .panel-heading { 5px 5px 0px 0px} \n\
	    #phpbb .panel-footer {0px 0px 5px 5px}\n\
	    #phpbb .panel-default>.panel-heading, #phpbb .panel-default>.panel-footer {background-color: #C2C2C2; color: #FFF; font-weight: 600;}\n\
	    #phpbb .panel-default, #phpbb .panel-default>.panel-body {background-color: #FAFAFA; border-color: #E9E9E9;}\n\
	    #phpbb .panel-primary, #phpbb .panel-primary>.panel-body {background-color: #EDF5F7; border-color: #DFECF0;}\n\
	    #phpbb .panel-warning>.panel-heading, #phpbb .panel-warning>.panel-footer {background-color: #EEE3C2; color: #000; font-weight: 600;}\n\
	    #phpbb .panel-warning, #phpbb .panel-warning>.panel-body {background-color: #FBF9E8; border-color: #F5ECD1;}\n\
\
		.alert {border-radius: 5px; border-width: 2px; padding: 12px 15px 17px; margin-bottom: 30px; }\n\
	    #phpbb hr {margin: 5px 0px 5px 0px; border-top: 1px solid #E9E9E9; border-color: #E9E9E9;}\n\
		.alert strong {font-size: 150%; text-transform: uppercase; padding: 0px 0px 2px 0px;}\n\
		#phpbb dl.codebox {background-color: #FFF; border-radius: 5px; border-color: #BBB; border-width: 2px; margin: 10px 0px; }\n\
		#phpbb code, #phpbb pre {color: #FFF; background-color: #888; border-radius: 5px; border: 1px solid #666; padding: 10px; margin: 0; font-family: monospace; }\n\
		#phpbb .codebox>dt {padding-left: 4px;}\n\
		#phpbb .text-normal { font-weight: normal !important; }\n\
		';

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// CSS: BOOTSTRAP INPUT FORM ELEMENTS
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	bootstrapMods += '\
	    input, button, select, textarea { font-family: inherit; }\n\
	    button, input, select, textarea { margin: 0px; }\n\
	    #phpbb input.form-control:focus, #phpbb select.form-control:focus, #phpbb textarea.form-control:focus, #phpbb input.form-inline:focus, #phpbb select.form-inline:focus, #phpbb textarea.form-inline:focus { outline: 0px none; box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.075) inset; border: 1px solid #93C4D3;}\n\
		.form-inline .form-control { max-width: 500px; }\n\
		.input-group .form-control { float: initial; }\n\
		#phpbb input.form-control, textarea.form-control, select.form-control { color: #3D3D3D; box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.075) inset; padding: 6px 10px;}\n\
		#phpbb .form-control { border-radius: 5px; font-size: 13px; line-height: normal; background-color: #FFF; border: 1px solid #CCC; transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;}\n\
		#phpbb input[type="text"], #phpbb input[type="email"], #phpbb input[type="number"], #phpbb input[type="password"], #phpbb select:not([multiple]), #phpbb textarea, .form-control \
	    		{ height: 33px; }\n\
	    #phpbb .form-secondary { border: 1px solid #E2E2E2; }\n\
\
		fieldset { font-family: "Open Sans", Helvetica, Arial, sans-serif; }\n\
		fieldset.submit-buttons input { padding-top: 6px; padding-bottom: 6px }\n\
		fieldset input { font-family: "Open Sans", Helvetica, Arial, sans-serif !important; }\n\
		fieldset.submit-buttons {margin: 0;}\n\
		';

	//-------------------------------
	// CSS: GENERAL
	//-------------------------------
	bootstrapMods += '\
		.corners-top, .corners-bottom, span.corners-top, span.corners-bottom, span.corners-top span, span.corners-bottom span { height: 0px; background-image: none; margin: 0; visibility: hidden }\n\
		.headerbar { background-image: none; background-color: transparent; background: none; padding: 0; }\n\
		* html .clearfix, * html .navbar, ul.linklist { height: auto; }\n\
		ul.linklist>li { font-size: 10pt; line-height: 2.0rem; color: #777777; }\n\
		#page-header+.navbar ul.linklist>li, .navbar ul.linklist>li>a, .navbar-rightside { margin: 0px 2px 4px; }\n\
		#page-header+.navbar ul.linklist>li { } \n\
		#page-footer ul.linklist>li { margin: 7px 4px; }\n\
		div#page-body {margin: 0;}\n\
		div#page-body h2:first-child {color: #7DBCCF; font-weight: 400; font-size: 24pt; }\n\
		div#page-body h2:first-child>a { color: #7DBCCF; font-weight: 400; }\n\
		';

	//-------------------------------------
	// CSS: TOP NAVBAR WITH BREADCRUMB
	//-------------------------------------
	bootstrapMods += '\
		div.navbar { border: 0; background-color: #F3F3F3; border: 2px solid #DDD; min-height: 40px; border-radius: 5px;}\n\
		.nav-home, a#nav-home, a#nav-home:link { text-shadow: 0px 1px 2px #888; padding: 3px 7px 7px 7px; margin-right: 3px; font-size: 13pt; background-color: #bcbcbc; color: #FFF !important; border-bottom-left-radius: 2px; }\n\
		ul.navlinks { list-style-type: none; border-bottom-color: transparent; border: 0; padding: 0; margin: 0; height: auto; vertical-align: middle;} \n\
		#content_wrapper .navbar-icons>a, #content_wrapper a.navbar-icons { font-weight: normal !important; color: #898989; margin-left: 2px; margin-right: 3px;}\n\
		.breadcrumbs {padding: 0; }\n\
		.breadcrumbs>li:first-child {list-style-type: none; margin-top: 10px;  margin-bottom: 4px; padding: 0px 1px 1px; background-color: #E8E8E8; border-radius: 5px; border-top: 2px solid #CFCFCF; border-bottom: 1px solid #FAFAFA;}\n\
		.breadcrumbs>li:first-child>a {color: #898989 !important; font-weight: 400; text-decoration: none; }\n\
		.breadcrumbs>li:first-child>a:hover, .breadcrumbs>li:first-child>a.active, .breadcrumbs>li:first-child>a:active { outline: 0px none; color: #3D3D3D; text-decoration: none; }\n\
		.label-as-badge { border-radius: 1rem; padding: .09rem .55rem .2rem;}\n\
		';

	bootstrapMods += '\b\
		input#btnForumSearch { width: 37px !important; border-right: 2px inset #CCC !important; }\n\
		a#btnAdvSearch, input#btnTopicSearch { width: 37px !important;}\n\
		#search-box { float: initial; margin: 4px 0px 8px 0px; }\n\
		#search-box #keywords {width: 160px; border-radius: 5px 0px 0px 5px;}\n\
		.submit-button { width: 90px; }\n\
		.topic-actions.form-inline { min-height: initial; vertical-align: middle; }\n\
		.topic-actions>.search-box {margin: 0px 5px;}\n\
		fieldset.display-options label, label { padding: 0; margin: 0 }\n\
		fieldset.display-options a {margin: 0px; padding-right: 4px; }\n\
		.displayopt-row { margin: 0; padding: 10px; border-radius: 5px; border: 1px solid #C8DBE5; background-color: #F1F7F9; }\n\
		.jumpbox-row {margin: 0px 0px 10px 0px; }\n\
		.pagination-row, ul.linklist>li.pagination { margin: 20px 0px 15px; }\n\
		';
		//	'#search-box a:link, .navbg a:link { color: #59899E !important; }\n\

	//----------------------------------------
	// CSS: USER CONTROL PANEL (inbox, etc)
	//----------------------------------------
	bootstrapMods += '\n\
		.nav-tabs>li {margin-bottom: -2px}\n\
		.nav>li>a { padding: 9px 15px; } \n\
		.nav-tabs {border-bottom: 2px solid #DDD; padding-left: 20px;}\n\
		.nav-tabs>li.active { border-bottom: 0; background-color: #FFF; outline: none; }\n\
		.nav-tabs>li.active>a, .nav-tabs>li.active>a:focus, .nav-tabs>li.active>a:hover { border-top: 2px solid #ddd; border-right: 2px solid #ddd; border-left: 2px solid #ddd; border-bottom: 0; box-shadow: 0px 2px 0px #FFF; color: #555 !important; outline: none; }\n\
		.nav-tabs>li>a { margin-right: 4px; border-radius: 5px 5px 0 0; background-color: #DADBDC; color: #3D3D3D !important; font-weight: 600 !important;}\n\
		.bg3 { box-shadow: 0px 1px 2px #DDD; border-top: 0; padding-bottom: 10px; }\n\
		#cp-menu { width: 21% }\n\
		#cp-main { width: 79% }\n\
		#cp-main .panel, #cp-menu .panel { background-color: #FFF; box-shadow: 0; border-radius: 5px; }\n\
		#cp-main .panel { margin-bottom: 15px; }\n\
		#cp-main ul.topiclist dt { width: 60%;}\n\
		#cp-main h2 { font-size: 18pt !important; } \n\
		#phpbb .emoji {font-family: sans-serif !important; font-size: 20px;} \n\
		table.table1 tbody tr {border: 0}\n\
		#navigation { padding-top: 5px; }\n\
		#navigation a { border-radius: 5px 0px 0px 5px; padding: 10px; background-image: none; background: none; background-color: transparent;}\n\
		#navigation a:hover {background-color: #D4E7ED;}\n\
		#navigation #active-subsection a {color: #3CB3D8;}\n\
		#navigation ul:first-child { margin-bottom: 0px; }\n\
		#cp-menu .cp-mini { border-radius: 5px 0px 0px 5px; padding: 10px; margin: 0; background-color: #F3F3F3;}\n\
		#cp-menu dl.mini>dt {margin-bottom: 5px;}\n\
		#postingbox .column1 { width: 50%; }\n\
		#postingbox #composePanel>.column1 { width: 80%; }\n\
		#postingbox fieldset.fields1 dd {margin-left: 130px; width: auto}\n\
		dl#dlSubject>dt, dl#dlPMIcon>dt {width: 8rem !important;}\n\
		dl#dlSubject>dd, dl#dlPMIcon>dd {margin-left: 8rem !important;}\n\
		.radio-inline {padding-left: 18px;}\n\
		.radio-inline input[type=radio] { margin-left: -18px;}\n\
		.radio-inline+.radio-inline { margin-left: 8px;}\n\
		.pmlist-btn-spacer { margin-right: 5px; padding: 4px 10px 4px;}\n\
		ul.cplist { border-top: 0; margin-bottom: 20px; }\n\
		dd.mark.form-inline { background-color: transparent; }\n\
		';
	//	ul.cplist dl.icon a.topictitle { font-size: 12pt }\n\

	//-------------------------------
	// CSS: SEARCH USER
	//-------------------------------
	thisPage.searchUser = location.href.indexOf('php?mode=searchuser') !== -1;
	if (thisPage.searchUser) {
		bootstrapMods += '\
		#memberlist th.joined {width: 22%}\n\
		fieldset.fields1.column1 dt { margin-left: 5px; width: 100px;}\n\
		fieldset.fields1.column1 dd { margin-left: 100px; width: 300px; margin-right: 5px;}\n\
		fieldset.fields1.column2 dt { margin-left: 5px; width: 60px;}\n\
		fieldset.fields1.column2 dd { margin-left: 90px; width: 300px; margin-right: 5px;}\n\
		.column1 { width: 44%; }\n\
		.column2 { width: 54%; }\n\
		table.table1 .info {width: inherit;}\n\
		table.table1 .posts { width: 90px;}\n\
		table.table1 .name { width: 200px;}\n\
		table.table1 span.rank-img { width: 70px;}\n\
		';
	}

	//-------------------------------
	// CSS: FORUM TABLES
	//-------------------------------
	bootstrapMods += '\n\
		.row-container {vertical-align: middle; display: inline-block; width: 100% }\n\
		.row-icon-col {position: absolute; margin: auto; vertical-align: middle; display: inline-block; padding-left: 6px; padding-top: 5px; width: 50px;}\n\
		.row-contents-col {}\n\
		dd.topics { margin-left: 30px !important; }\n\
		ul.topiclist dl.icon dt {padding-top: 2px; padding-bottom: 5px; padding-right: 0px; padding-left: 0px !important;}\n\
		ul.topiclist li.bg2 a.topictitle, ul.topiclist li.bg3 a.topictitle { font-size: 12pt }\n\
		ul.topiclist { padding: 0 }\n\
		ul.topiclist li.row dl { padding: 1px 0px 8px 50px; }\n\
		ul.topiclist.forums { padding: 0 }\n\
		ul.topiclist dt { font-size: 11pt; width: 50%; }\n\
		ul.topiclist dd { border-left: 0; font-size: 10pt; margin: 0; padding-left: 10px; padding-top: 0; padding-bottom: 0; }\n\
		ul.topiclist li.header dl.icon>dt>a, li.header dl.icon>dt>a:link, li.header dl.icon>dt { font-size: 16pt; text-transform: lowercase; \
			font-weight: 500 !important; color: white !important; line-height: 1.3em; font-family: "Arial Rounded MT Bold", Arial, "Sans Serif";}\n\
		ul.topiclist dd.lastpostthanks { padding-left: 15px; } \n\
		ul.topiclist dd.lastpost { width: 30%;}\n\
		ul.topiclist dd.lastpost span { padding-top: 5px }\n\
		ul.topiclist-header { box-shadow: 1px 0px 0px #93C4D3; border-radius: 5px 5px 0px 0px; padding: 4px 0px 0px; } \n\
		ul.forums {background-image: none; background-color: #FFF; }\n\
		li.row { border-top: 0; border-bottom-color: #D4E7ED; }\n\
		li.row:hover, li.row:active, li.row.active { background-color: #D4E7ED; background: #D4E7ED; padding-bottom: 0px; }\n\
		li.header { padding: 0px 10px 0px; height: 35px; border-bottom: 1px solid #CCC; }\n\
		li.header dt { margin: 0px 20px 0px 0px; height: 35px;}\n\
		li.header dd { font-family: "Open Sans", Helvetica, Arial, sans-serif !important; letter-spacing: 1px; } \n\
		li.header dt, li.header dd { line-height: 2.3em; height: 35px; };\n\
		.fa-level-up { color: #CCC } \n\
		.fa-level-up.unread { color: #555 }\n\
		.table1 thead>tr { height: 36px;}\n\
		table.table1 thead>tr>th {letter-spacing: 1px; }\n\
		table.table1 thead>tr>th, table.table1 tbody>tr>td {padding: 0px 15px;}\n\
		'; //padding-left: 20px !important; margin-left: 80px !important; \

	bootstrapMods += '\
		.forabg {border-radius: 5px; background-image: none; background-color: #93C4D3; padding: 0; margin-bottom: 20px; box-shadow: 0px 1px 4px #DDD; }\n\
		.forumbg {border-radius: 5px; background-image: none; background-color: #93C4D3; padding: 0; margin-bottom: 20px; box-shadow: 0px 1px 4px #DDD; }\n\
		.left-nav, .right-nav { margin: 6px 6px; padding: 0; font-size: 12pt; font-weight: normal !important; }\n\
		.return-nav { margin: 6px 0px; padding: 0; font-size: 12pt; }\n\
		.pagination { text-align: center; margin: 20px 0px 10px; font-size: 11px; }\n\
		.pagination span a, .pagination span a:link, .pagination span a:visited  { font-size: 13px; line-height: 1rem; padding: 1px 3px; margin: 0px; border-radius: 3px; background-color: #F1F7F9; border-color: #C8DBE5; }\
		.pagination span a:hover { border-color: #A7D2DF; background-color: #D4E7ED; color: #709AAD !important;} \n\
		.row .pagination {background-image: none; font-size: 11px !important; padding: 0; margin: 0px; }\n\
		.row .pagination span a:hover, li.pagination span a:hover {border-color: #A7D2DF; background-color: #D4E7ED; color: #709AAD !important;}\n\
		.pagination span strong { padding: 1px 4px; margin: 1px; border-radius: 3px; background-color: #A7D2DF; border: 1px solid #93C4D3;}\n\
		.pagination-sm span>a { font-size: 8pt !important; }\n\
		';

	//-------------------------------
	// CSS: THREADS AND POSTS
	//-------------------------------
	bootstrapMods += '\n\
		.bg2 {background-color: white}\n\
		.bg1 {background-color: white}\n\
		.post {background-color: white; box-shadow: 0px 1px 2px #BBB; border-radius: 5px; margin-bottom: 25px; padding: 0;}\n\
		.post .inner {padding: 10px; }\n\
  	    .first-post-bg {background-color: #F6FBFD; box-shadow: 0px 1px 2px #9FB8C6}\n\
		.postbody {font-size: 11pt; color: #777; border-right: 1px solid #EDEEEE; padding: 0px 20px 0px 10px;}\n\
		.postbody .content { padding: 10px 3px 0px; font-size: 11pt; border-top: solid 3px #C8DBE5; }\n\
		.postbody .signature {border-top: 1px solid #EDEEEE; font-size: 11pt; padding: 10px 3px 15px;}\n\
		.postbody h3 { font-size: 13pt; font-family: inherit; padding: 0px 3px 0px; }\n\
		.postbody ul.profile-icons {padding: 10px 0px 0px; }\n\
		.postbody.small, small {border: 0; margin: -10px -5px 0px; }\n\
		.postbody.small>dt, .postbody.small>dd { color: #999; width: 640px; padding: 5px; }\n\
		.postbody.small>dd { padding-top: 0px; }\n\
		.signature+.content {border-top: 0; border: 1px dotted #DDD; border-radius: 4px; }\n\
		p.author { font-family: inherit; padding: 0px 3px 0px; }\n\
		.post-quote {font-size: 11px}\n\
		.postprofile {margin: 5px; border-left-color: transparent; }\n\
		.postprofile strong {font-size: 10pt;}\n\
		.postprofile a:link, .postprofile a:visited, .postprofile dt.author a {font-weight: normal !important; text-decoration: none !important; font-size:13pt !important; }\n\
		.postprofile a.username-coloured:link, .postprofile a.username-coloured:visited, .postprofile dt.author a.username-coloured {font-weight: 600 !important;}\n\
		a#thankCount { font-size: 11pt !important; }\n\
		div#thankList {font-size: 8pt !important; }\n\
		.content { font-family: "Open Sans", Helvetica, Arial, sans-serif !important; }\n\
		.postprofile>dd:nth-child(2) {padding-top: 3px;}\n\
		.first-post-bg {background-color: #F6FBFD; box-shadow: 0px 1px 2px #9FB8C6}\n\
		.well, blockquote.uncited .well {padding-top: 15px; margin: 20px; } \n\
		.postbody cite { margin-bottom: 6px; margin-left: 0px; }\n\
		.content {min-height: initial}\n\
		div#qr_showeditor_div {padding: 0; margin: 0; display: inline-block; border: 0;}\n\
		.pagination-row+p { margin: 30px }\n\
		';

	//-------------------------------
	// CSS: TOP WAZE BAR
	//-------------------------------
	bootstrapMods += '#phpbb { font-family: "Open Sans", Helvetica, Arial, sans-serif !important; }\n\
		div {}\n\
		dt, dd {font-size: 11pt; font-weight: 400}\n\
		dt {font weight: 400}\n\
		dl {margin-bottom: 0px; }\n\
		.waze-header-contents a:hover, .waze-header-contents a:visited { color: #FFF; text-decoration: none; }\n\
		.login_tab {text-transform: capitalize;}\n\
		.login_tab .actions {text-transform: capitalize;}\n\
		.login_tab .actions>a:hover {text-decorations: none; color: #59899e}\n\
		';

	//-------------------------------
	// CSS: various <a> tags
	//-------------------------------
	bootstrapMods += '\n\
		:link:focus, :visited:focus {outline: none; }\n\
		#content_wrapper a, #content_wrapper a:link, #content_wrapper a:visited { font-family: "Open Sans", Helvetica, Arial, sans-serif; font-weight: 600; color: #59899E; text-decoration: none;}\n\
		#content_wrapper a:hover { color: #3D3D3D; text-decoration: none !important; }\n\
		#content_wrapper a:active, #content_wrapper a.active, #content_wrapper a:hover { outline: 0px none; }\n\
		a.subfeed, a.subfeed:link, a.subfeed:active, a.subfeed.active, a#rssIcon:link, a#rssIcon:active, a#rssIcon.active, a#rssIcon:visited \
			 { font-weight: normal; padding-right: 1px; color: DarkOrange !important; }\n\
		a.subfeed:visited { font-weight: normal; color: Chocolate !important; }\n\
		.icon-rss a { margin-top: 2px; }\n\
		a.fa, a.fa:link, a.fa:visited, a.fa:focused, a.fa:hover, a.fa:active a.fa.active { font-weight: normal ; }\n\
		a.forumtitle { font-size: 13pt }\n\
		a.disabled { pointer-events: none; cursor: default; }\n\
		a.right-box.up { margin: 20px 5px; font-size: 11pt; }\n\
		';

	bootstrapMods += '\n\
		.tooltip { border: 0; box-shadow: none; };'

	GM_addStyle(bootstrapMods);


/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//                          TARGETED PAGE CHANGES                              //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////

function changePageStyle () {

	//===========================================================================
	// GENERAL PAGE TEMPLATE
	//===========================================================================
	//$('code, pre').addClass('prettyprint');

	// Change buttons to bootstrap buttons
	$('.button1').addClass('btn btn-default');
	$('.btn').removeClass('button1');

	$('.button2').addClass('btn btn-default');
	$('.btn').removeClass('button2');

	// Change all dropdown 'select' to bootstrap
	$('select').addClass('form-control');

	// Change all input textboxs to bootstrap
	$('input[type="text"]').addClass('form-control');
	$('fieldset').addClass('form-inline');

	$('input[value="Submit"], button[value="Submit"]').addClass('submit-button btn-primary submit-button');
	$('.submit-button').removeClass('btn-default');

	//---------------------------------------------------------------------------
	// Style header
	$('.icon-home').addClass('fa fa-home');
	//$('#page-footer .icon-home>a').css('padding-left','5px');
	$('.fa-home').removeClass('icon-home');

	// breadcrumb
	$('.navlinks').addClass('breadcrumbs');
	$('.breadcrumbs').removeClass('linklist');
	$('ul.breadcrumbs > li.fa-home').attr('class','nav-dummy');
	//$('.nav-dummy').html('<a href="./index.php" accesskey="h" class="fa fa-home fa-lg nav-home"></a>')
	$('a[accesskey="h"]').attr('id','nav-home');
	$('#nav-home').addClass('fa fa-home nav-home');
	$('#nav-home').html('');
	$('.nav-dummy > strong').html('<span class="fa fa-chevron-right" style="color: #CCC"></span>')
	$('.nav-dummy').css('padding','');
	//$('.nav-dummy').css('margin-bottom','3px');

	$('.print').addClass('fa fa-print fa-fw navbar-rightside');
	$('.print').html('');
	$('.print').attr('style','line-height: 2rem; color: #777777 !important;');
	$('.print').toggleClass('print');
	$('.sendemail').html('');
	$('.sendemail').attr('style','line-height: 2rem; padding-right: 3px; color: #777777 !important;');
	$('.sendemail').attr('class','fa fa-envelope fa-fw navbar-rightside');

	$('.fontsize').remove();

	// Top search-box
	$('#keywords').removeClass('search');
	$('#search-box').addClass('dummy-search-class')


	// Style top search-box/bottom display options containers
	$('.topic-actions').addClass('form-inline');
	//$('.topic-actions').css('margin-top','20px');


	// Generic textarea boxes
	$('textarea').addClass('form-control');

	//---------------------------------------------------------------------------
	// #search-box
	//---------------------------------------------------------------------------
	thisPage.advSearch = location.href.length-location.href.lastIndexOf('search.php') == 10;

	if (!thisPage.advSearch && !thisPage.searchUser) {

		//Search entire forum
		//$('.search-box input[value="Search"]')
		$('input[value="Search"]')[0].id = 'btnForumSearch';
		$('#btnForumSearch').attr('class','btn btn-secondary dummy-class-search');
		$('#btnForumSearch').val('➜')

		$('a[title^="View the advanced"]').attr('id','btnAdvSearch');
		$("#btnAdvSearch").addClass('btn btn-secondary dummy-class-search');
		$('#btnAdvSearch').html('<span class="fa fa-cog"></span>');

		$('#btnForumSearch').attr('style','border-radius: 0px !important;');
		$('#btnAdvSearch').attr('style','border-radius: 0px 5px 5px 0px !important; border-left: 1px solid #E2E2E2 !important;');
		//$('#btnAdvSearch').css('color','#3D3D3D');

		$('#search-box>#search').html('<div class="input-group">' + $('#keywords')[0].outerHTML + '<div class="input-group-btn">' + $('.dummy-class-search')[0].outerHTML + $('.dummy-class-search')[1].outerHTML + '</div></div>');
		$('#keywords').addClass('form-secondary')
		//$('#search-box>#search>.form-inline').html($('#keywords')[0].outerHTML + '<div class="btn-group">' + $('.dummy-class-search')[0].outerHTML + $('.dummy-class-search')[1].outerHTML + '</div>');

		//$('#search-box > #search').html('<div class="form-inline input-group">' +$('#search-box > #search > fieldset').html() + '</div>');

		//$("#keywords").click(function() { $("#search").submit() });
		//$('.dummy-class-search').wrap('<div class="btn-group"></div>');

		//$('.input-group').removeClass('form-control')

		// Search within this forum
		$('.search-box input[value="Search"]').attr('id','btnThisForumSearch');
		$('#btnThisForumSearch').attr('class','btn btn-default');

		$('#forum-search').html('<div class="input-group" id="divThisForuSearch">' + $('#forum-search>fieldset').html() + '</div>');
		$('#divThisForuSearch>:submit').attr('id','btnThisForumSearch');
		$('#btnThisForumSearch').wrap('<div class="input-group-btn"></div>');
		$('#btnThisForumSearch').attr('style','border-radius: 0px 5px 5px 0px; margin: 0px 0px 0px -2px;');
		$('#btnThisForumSearch').val('➜');
		$('#search_keywords').attr('class','inputbox form-control');

		// Within-topic search
		$('#topic-search').html('<div class="input-group" id="divTopicSearch">' + $('#topic-search>fieldset').html() + '</div>');
		$('#divTopicSearch>:submit').attr('id','btnTopicSearch');
		$('#btnTopicSearch').wrap('<div class="input-group-btn"></div>');
		//$('#search_keywords').attr('style','width: 150px; border-radius: 5px 0px 0px 5px;');
		$('#btnTopicSearch').attr('style','border-radius: 0px 5px 5px 0px; margin: 0px 0px 0px -2px;');
		$('#btnTopicSearch').val('➜');
		$('#search_keywords').attr('class','inputbox form-control');

		$('#add_keywords').parents('.search-box').addClass('input-group');

		$('#search_keywords, #add_keywords').attr('style','width: 150px; border-radius: 5px 0px 0px 5px;');

	} else {
		$('input[value="Search"]').addClass('btn-primary');
		$('input[value="Search"]').removeClass('btn-default')
	}

	//---------------------------------------------------------------------------
	// Replace big buttons
	//---------------------------------------------------------------------------
	//Reply button
	$('.reply-icon').addClass('btn btn-info');
	$('.reply-icon>a').addClass('alink-reply-class-dummy');
	$('.reply-icon').toggleClass('reply-icon');
	$('.alink-reply-class-dummy').addClass('btn-text-light');
	$('.alink-reply-class-dummy').html('Post Reply <i class="fa fa-mail-reply"></i>');

	// Locked button
	$('.locked-icon').addClass('btn btn-danger disabled');
	$('.locked-icon>a').addClass('alink-locked-class-dummy');
	$('.locked-icon').toggleClass('locked-icon');
	$('.alink-locked-class-dummy').addClass('btn-text-light disabled');
	$('.alink-locked-class-dummy').html('Locked <i class="fa fa-lock"></i>');

	//New Topic button
	$('.post-icon').addClass('btn btn-info');
	$('.post-icon>a').addClass('alink-post-class-dummy');
	$('.post-icon').toggleClass('post-icon');
	$('.alink-post-class-dummy').addClass('btn-text-light');
	$('.alink-post-class-dummy').html('Post New Topic&nbsp;&nbsp;<i class="fa fa-pencil-square"></i>');

	//---------------------------------------------------------------------------
	// Replace other small icons in top nav bar
	//---------------------------------------------------------------------------
	$('a[title*="RSS feed "]').attr('id','rssIcon');
	$('#rssIcon').html('');
	$('#rssIcon').addClass('fa fa-rss-square fa-fw fa-lg navbar-icons');
	$('#rssIcon').parent().removeClass('icon-rss leftside');

	$('a[title^="User Control "]').attr('id','userIcon');
	//$('#userIcon').html('');
	//$('#userIcon').addClass('fa fa-user fa-fw navbar-icons');
	$('.icon-ucp').addClass('fa fa-user fa-fw navbar-icons');
	$('.fa-user').removeClass('icon-ucp');
	$('#userIcon:first-child').addClass('navbar-icons');

	$('.icon-thanks_toplist').addClass('fa fa-line-chart fa-fw navbar-icons');
	$('.fa-line-chart').removeClass('icon-thanks_toplist');

	$('.icon-members').addClass('fa fa-users fa-fw navbar-icons');
	$('.fa-users').removeClass('icon-members');


	$('.icon-faq').addClass('fa fa-question-circle fa-fw navbar-icons');
	$('.fa-question-circle').removeClass('icon-faq');


	$('.icon-thanks').addClass('fa fa-thumbs-up fa-fw navbar-icons');
	$('.fa-thumbs-up').removeClass('icon-thanks');

	$('.icon-subscribe').addClass('fa fa-plus-square');
	$('.icon-subscribe').toggleClass('icon-subscribe');
	$('.icon-unsubscribe').addClass('fa fa-minus-square');
	$('.icon-unsubscribe').toggleClass('icon-unsubscribe');
	$('.icon-bookmark').addClass('fa fa-bookmark');
	$('.icon-bookmark').toggleClass('icon-bookmark');
	//---------------------------------------------------------------------------
	// Display options
	//---------------------------------------------------------------------------
	$('.display-options').parent().attr('id','displayOptions');
	$('#displayOptions').wrap('<div class="row displayopt-row" style="margin: 0;"></div>');
	$('.display-options').addClass('pull-right');
	$('.display-options').css('margin','0px');
	$('#displayOptions input').val('Apply');

	$('.displayopt-row+hr').remove();

	//---------------------------------------------------------------------------
	// Style "Jump to" dropdown
	//---------------------------------------------------------------------------
	//$('.jumpbox').addClass('form-inline');
	$('.jumpbox').css('display','inline-block');
	//$('#f').addClass('form-control');
	$('#f').css('width','260px');
	$('#jumpbox').wrap('<div class="row jumpbox-row"></div>');
	$('#jumpbox').addClass('pull-right');
	$('.jumpbox').css('margin','0');
	$('.jumpbox>label:first-child').html('');

	// Bottom left-side return-link
	var returnLink = $('div.topic-actions~p>a.left-box.left');
	returnLink.attr('class','fa fa-arrow-circle-left pull-left return-nav');
	returnLink.html(' ' + returnLink.html());

	$('.left-box.left').attr('class','fa fa-angle-double-left left-nav');
	$('.right-box.right').attr('class','fa fa-angle-double-right right-nav');

	$('.topic-actions>.pagination').parents(':not("html, #phpbb, #page-body, #content_wrapper")').addClass('row pagination-row');
	$('form.row.pagination-row').css('margin','0px');

	var jumpToLinkEl = $('div.pagination-row>div.pagination a[onclick^="jumpto"]');
	jumpToLinkEl.after($('.fa-angle-double-right.right-nav'));
	jumpToLinkEl.before($('.fa-angle-double-left.left-nav'));
	$('.fa-angle-double-left.left-nav').html('');
	$('.fa-angle-double-right.right-nav').html('');

	returnLink = $('div#page-body>p>a.left');
	//returnLink.css('margin','6px 0px 15px');
	returnLink.attr('class','fa fa-arrow-circle-left pull-left return-nav');
	returnLink.html(' ' + returnLink.html());


	//===========================================================================
	// FORUM LISTINGS
	//===========================================================================
	$('.topiclist>.header').parent().addClass('topiclist-header');

	$('.lastpostthanks').html('Last post');
	$('li.header').parent().css('border-right','1px solid #93C4D3');
	$('li.header').parent().css('border-left','1px solid #93C4D3');

	$('li.bg1 .pagination, li.bg2 .pagination').addClass('pagination-sm');

	var forumIcon = Array(8);
	forumIcon[0] = '<div class="fa-stack fa-lg"><div style="color: #909CAD" class="fa fa-circle fa-stack-2x"></div><div id="icnForumStatus" style="color: #EEEEEE" class="fa fa-list fa-stack-1x"></div></div>',
	forumIcon[1] = '<div class="fa-stack fa-lg"><div style="color: #909CAD" class="fa fa-circle fa-stack-2x"></div><div id="icnForumStatus" style="color: #EEEEEE" class="fa fa-indent fa-stack-1x"></div></div>',
	forumIcon[2] = '<div class="fa-stack fa-lg"><div class="fa fa-circle fa-stack-2x"></div><div id="icnForumStatus" style="color: white" class="fa fa-list fa-stack-1x"></div></div>',
	forumIcon[3] = '<div class="fa-stack fa-lg"><div class="fa fa-circle fa-stack-2x"></div><div id="icnForumStatus" style="color: white" class="fa fa-indent fa-stack-1x"></div></div>',
	forumIcon[4] = '<div class="fa-stack fa-lg"><div style="color: #909CAD" class="fa fa-circle fa-stack-2x"></div><div id="icnForumStatus" style="color: #EEEEEE" class="fa fa-list fa-stack-1x"></div><div style="color: #FF8383" class="fa fa-lock fa-stack-1x"></div></div>',
	forumIcon[5] = '<div class="fa-stack fa-lg"><div style="color: #909CAD" class="fa fa-circle fa-stack-2x"></div><div id="icnForumStatus" style="color: #EEEEEE" class="fa fa-indent fa-stack-1x"></div><div style="color: #FF8383" class="fa fa-lock fa-stack-1x"></div></div>',
	forumIcon[6] = '<div class="fa-stack fa-lg"><div class="fa fa-circle fa-stack-2x"></div><div id="icnForumStatus" style="color: white" class="fa fa-list fa-stack-1x"></div><div style="color: Crimson" class="fa fa-lock fa-stack-1x"></div></div>',
	forumIcon[7] = '<div class="fa-stack fa-lg"><div class="fa fa-circle fa-stack-2x"></div><div id="icnForumStatus" style="color: white" class="fa fa-indent fa-stack-1x"></div><div style="color: Crimson" class="fa fa-lock fa-stack-1x"></div></div>';

	var forumIconElements = $('dl.icon'),
	numElements = forumIconElements.length,
	forumStatus = Array(numElements),
	divForumIcon;

	forumIconElements.wrap('<div class="row-container"><div class="row-contents-col"></div></div>');
	var forumRowContainers = $('.row-container'), forumIconContainer;

	for (el = numElements; el--;) {
		forumStatus[el] = 0;
		bgImgForumIcn = forumIconElements.get(el).style.backgroundImage;
		if (bgImgForumIcn.length !== 0) {
			if (bgImgForumIcn.lastIndexOf('subforum') !== -1) {
				forumStatus[el] += 1;
			}
			if (bgImgForumIcn.lastIndexOf('unread') !== -1) {
				forumStatus[el] += 2;
			}
			if (bgImgForumIcn.lastIndexOf('locked') !== -1) {
				forumStatus[el] += 4;
			}


			forumIconElements.get(el).style.backgroundImage = 'none';
			//forumIconElements.get(el).innerHTML = '<div>' +forumIconElements.get(el).innerHTML + '</div>';
			forumIconContainer = document.createElement('div');
			forumIconContainer.className = "row-icon-col";
			forumIconContainer.innerHTML = forumIcon[forumStatus[el]];
			forumRowContainers.get(el).insertBefore(forumIconContainer, forumRowContainers.get(el).firstChild);
			bgImgForumIcn = null;
		}
	}

	$('.subforum').before('<span class="fa fa-level-up fa-fw fa-rotate-90"></span>');
	$('.subforum').toggleClass('subforum');
	$('img[title^="View the latest"]').parent().html('<i class="fa fa-thumb-tack fa-fw"></i>');

	var attachmentIcon = $('img[src$="icon_topic_attach.gif"]');
	attachmentIcon.before('<span class="fa fa-paperclip"></span>');
	attachmentIcon.remove();

	var unreadIcon = $('.cplist dt[title^="Unread posts"]>a:first-child, .topiclist dt[title^="Unread posts"]>a:first-child');

	var numUnreadIcon = unreadIcon.length, forumTitleText = Array(numUnreadIcon), ft;

	if (numUnreadIcon > 0) {
		for (ft = numUnreadIcon; ft--;) {
			if (unreadIcon[ft].className != "forumtitle") {
				unreadIcon[ft].innerHTML = '';
			} else { unreadIcon[ft].innerHTML = ' ' + unreadIcon[ft].innerHTML; }
		}
	}

	unreadIcon.addClass('fa fa-sign-in');

	$('dl.icon img[src$="icon_topic_newest.gif"]').remove();

	//---------------------------------------------------------------------------
	// Various other icons on forum listing page
	//---------------------------------------------------------------------------
	// RSS feed subscribing icon for each forum/subforum
	$('dt').contents().each(function(index, node) {
		if (node.nodeType == 8) {
			// node is a comment
			$(node).replaceWith(node.nodeValue);
		}
	});
	$('.feed-icon-forum').addClass('fa fa-rss subfeed fa-fw');
	$('.fa-rss').removeClass('feed-icon-forum');
	$('img[alt^="Feed"]').remove();

	//Append some cute icons to forum info at the end of the table
	$('a[href="./viewonline.php"]').before('<span class="fa fa-street-view"></span>&nbsp;');
	//$('a[href="./viewonline.php"]').before('<span class="fa fa-circle fa-fw" style="color: #00A700"></span>');
	$('a[href="./viewonline.php"]').parent().attr('id','fWhoIsOnline');

	var forumStatsNStuffEl = $('div#page-body>h3'), f, numInfos = forumStatsNStuffEl.length;

	for (f=0; f<numInfos;f++) {
		switch (forumStatsNStuffEl[f].innerHTML) {
			case "Birthdays":
				forumStatsNStuffEl[f].id = 'fBirthdays';
				forumStatsNStuffEl[f].innerHTML = '<span class="fa fa-birthday-cake"></span>&nbsp;' +forumStatsNStuffEl[f].innerHTML;
			break;
			case "Thanks Toplist ":
				forumStatsNStuffEl[f].id = 'fThanksToplist';
				forumStatsNStuffEl[f].innerHTML = '<span class="fa fa-line-chart"></span>&nbsp;' +forumStatsNStuffEl[f].innerHTML;
			break;
			case "Statistics":
				forumStatsNStuffEl[f].id = 'fStatistics';
				forumStatsNStuffEl[f].innerHTML = '<span class="fa fa-bar-chart"></span>&nbsp;' +forumStatsNStuffEl[f].innerHTML;
			break;
		}
	}

	//===========================================================================
	// THREADS & POSTS
	//===========================================================================
	$('.postprofile a[href^="./thankslist"]').attr('id','thankCount')

	$('p.author>a').html('');
	$('p.author>a').addClass('fa fa-link');

	$('.rules').addClass('alert alert-danger');
	$('.rules').toggleClass('rules');
	$('.alert a.postlink').addClass('alert-link');
	$('.postlink').toggleClass('postlink');
	$('a.fa-link').attr('style','margin-right: 3px; color: #7DBCCF');

	var postLinkEl = $('.postbody>h3>a'), numPostLinks = postLinkEl.length, pl, plID;
	for (pl = numPostLinks; pl--;) {
		plID = postLinkEl[pl].getAttribute('href');
		postLinkEl[pl].setAttribute('href', '?p=' + plID.substr(2) + plID);//location.host + location.pathname +
	}


	//---------------------------------------------------------------------------
	//thisPage.searchUser = location.href.indexOf('php?mode=searchuser') !== -1;

	if(!thisPage.searchUser) {
		$('.topiclist>.header dd.mark').remove();
		$('.topiclist dd').addClass('form-inline');
		$(':checkbox').parent().addClass('checkbox-inline');
		$(':radio').parent().addClass('radio-inline');
	}

	var leftQuote = '<span class="fa fa-quote-left fa-3x fa-pull-left" style="color: #AAA"></span>',
		rightQuote = '<span class="fa-quote-right fa-3x fa-pull-right" style="color: #AAA; padding-top: 5px;"></span>';

	thisPage.viewTopic = location.href.indexOf('viewtopic.php') !== -1;
	thisPage.post = location.href.indexOf('posting.php') !== -1;

	if(thisPage.viewTopic || thisPage.post) {

		$('hr').remove();

		// FIrst post of a thread
		var firstPost = $('h3.first').parents('.post');
		firstPost.addClass('first-post-bg');
		$('h3.first').css('font-size','13pt');

		$('div[style*="reput"]').parents('.content').remove();
		$('a[title^="Say Thanks"]').addClass('fa fa-thumbs-o-up fa-lg fa-fw text-normal');
		$('a[title^="Reply with"]').addClass('fa fa-quote-left fa-lg fa-fw text-normal');
		$('a[title^="Report this"]').addClass('fa fa-flag fa-lg fa-fw text-normal');
		$('a[title^="Edit post"]').addClass('fa fa-pencil fa-lg fa-fw text-normal');
		$('a[title^="Delete post"]').addClass('fa fa-times fa-lg fa-fw text-normal');
		$('a[title^="Remove your thanks"]').addClass('fa fa-thumbs-o-down fa-lg fa-fw text-normal');
		$('.thanks-icon').removeClass('thanks-icon');
		$('.quote-icon').removeClass('quote-icon');
		$('.report-icon').removeClass('report-icon');
		$('.edit-icon').removeClass('edit-icon');
		$('.delete-icon').removeClass('delete-icon');
		$('.removethanks-icon').removeClass('removethanks-icon');
		$('blockquote').addClass('well post-quote');
		$('blockquote').css('background-image','none');
		var blockDivCiteEl = $('blockquote>div>cite');
		var blockDivEl = $('blockquote>div')
		if (blockDivCiteEl.length > 0) {
			blockDivCiteEl.after(leftQuote);
			$('blockquote>div>:not(cite):first-child').parent().prepend(leftQuote);
		} else {
			blockDivEl.prepend(leftQuote);
		}
		blockDivEl.append(rightQuote);
		//$('blockquote>div').html(leftQuote + $('blockquote').html() + rightQuote);

		$('a[title="Private message"]').addClass('fa fa-paper-plane');
		$('.pm-icon').toggleClass('pm-icon');
		$('a[href^="./memberlist.php?mode=email"]').addClass('fa fa-envelope');
		$('.email-icon').toggleClass('email-icon');
		$('a[title^="WWW:"]').addClass('fa fa-globe');
		$('.web-icon').toggleClass('web-icon');
		$('a[title="Jabber"]').addClass('fa fa-comments-o');
		$('.jabber-icon').toggleClass('jabber-icon');

		// thank list
		var thankdPostsEls = $('.postbody .small > dd'), numPostsWithTHanks = thankdPostsEls.length, tyPost, t, thankList, evenNum, newThankList, newDateList;

		if (numPostsWithTHanks > 0) {
			for (tyPost = numPostsWithTHanks; tyPost--;) {
					thankList = thankdPostsEls[tyPost].childNodes;
					evenNum=true;
					newThankList = [];
					newDateList = [];

				for (t=thankList.length; t--;) {
					if (evenNum) {
						newDateList.push(thankList[t].parentNode.childNodes[t].nodeValue);
						if (t !== thankList.length-1 ) { thankList[t].parentNode.childNodes[t].nodeValue = ' ⋆ ';
						} else { thankList[t].parentNode.childNodes[t].nodeValue = '' }
						evenNum = false;
					} else {
						newThankList.push(thankList[t]);
						evenNum = true;
					}
					thankdPostsEls[tyPost].appendChild(thankList[t]);
				}

				for (var nt=newThankList.length; nt--;) {
					newThankList[nt].setAttribute('data-toggle','tooltip');
					//newThankList[nt].setAttribute('data-placement','top');
					//newThankList[nt].setAttribute('data-container', 'body');
					newThankList[nt].setAttribute('title',newDateList[nt].match(/\([^)]+\)/g));
				}

				thankdPostsEls[tyPost].innerHTML = '<div id="thankList">' + thankdPostsEls[tyPost].innerHTML + '</div>';
				//$('[data-toggle="tooltip"]').tooltip({template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>' });
			}
		}


	}

	$('img[src*="icon_topic_solved"]').parent().append('<span class="fa fa-check-square-o" style="color: #62C202 !important"></span>');
	$('img[src*="icon_topic_solved"]').remove();

	$('.displayopt-row').prepend($('.row.displayopt-row+.topic-actions.form-inline>.buttons'));
	$('.row.displayopt-row+.topic-actions.form-inline').prepend($('#displayOptions>.display-options>a'));


	//=======================================================================================
	// Control Panel
	//=======================================================================================
	thisPage.controlPanel = location.href.indexOf('ucp.php');
	if (thisPage.controlPanel !== -1) {
		//left side nav panel
		$('div#tabs>ul').addClass('nav nav-tabs');
		$('#tabs').attr('id','navTabs');
		$('.activetab').addClass('active');
		$('.activetab').toggleClass('activetab');
		$('#active-subsection').addClass('active');

		//Left-side menu
		$('#cp-menu>#navigation>ul').addClass('nav nav-pills nav-stacked');

		var navTabs = $('#navigation>ul>li>a');
		switch (true) {
			case location.href.lastIndexOf('=164')!==-1 || location.href.lastIndexOf('i=profile')!==-1:  //profile
				navTabs[0].innerHTML = '<i class="fa fa-pencil-square-o fa-lg fa-fw" style="color: black"></i> ' + navTabs[0].innerHTML;
				navTabs[1].innerHTML = '<i class="fa fa-file-text-o fa-lg fa-fw" style="color: black"></i> ' + navTabs[1].innerHTML;
				break;
			case location.href.lastIndexOf('=165')!==-1 || location.href.lastIndexOf('i=prefs')!==-1:  //board preferences
				navTabs[0].innerHTML = '<i class="fa fa-globe fa-lg fa-fw" style="color: black"></i> ' + navTabs[0].innerHTML;
				navTabs[1].innerHTML = '<i class="fa fa-pencil-square fa-lg fa-fw" style="color: black"></i> ' + navTabs[1].innerHTML;
				navTabs[2].innerHTML = '<i class="fa fa-columns fa-lg fa-fw" style="color: black"></i> ' + navTabs[2].innerHTML;
				break;
			case location.href.lastIndexOf('=166')!==-1 || location.href.lastIndexOf('i=pm')!==-1:  //overview
				navTabs[0].innerHTML = '<i class="fa fa-pencil-square-o fa-lg fa-fw" style="color: black"></i> ' + navTabs[0].innerHTML;
				navTabs[1].innerHTML = '<i class="fa fa-file-text-o fa-lg fa-fw" style="color: black"></i> ' + navTabs[1].innerHTML;
				navTabs[2].innerHTML = '<i class="fa fa-inbox fa-lg fa-fw" style="color: black"></i> ' + navTabs[2].innerHTML;
				navTabs[3].innerHTML = '<i class="fa fa-spinner fa-lg fa-fw" style="color: black"></i> ' + navTabs[3].innerHTML;
				navTabs[4].innerHTML = '<i class="fa fa-paper-plane fa-lg fa-fw" style="color: black"></i> ' + navTabs[4].innerHTML;
				navTabs[5].innerHTML = '<i class="fa fa-cogs fa-lg fa-fw" style="color: black"></i> ' + navTabs[5].innerHTML;

				//-------------------
				// PM Compose Box
				//-------------------
				var postingBoxEls = $('#postingbox fieldset.fields1 dl');
				if (postingBoxEls.length !== 0) {
					postingBoxEls[0].id = 'dlPMList';
					postingBoxEls[1].id = 'dlPMIcon';
					postingBoxEls[2].id = 'dlSubject';
					$('#dlPMIcon').addClass('form-inline');
					$('#dlSubject').addClass('form-inline');
					$('#dlSubject :text').attr('size','60');
					$('#dlPMList>dt').attr('style','width: 22rem !important;');
					$('#dlPMList>dd').attr('style','margin-left: 22rem !important;');

					$('#dlPMList>dd')[0].id = "ddPMList";
					$('#dlPMList>dd')[1].className = "delete-dummy";
					$('#dlPMList>dd')[2].className = "delete-dummy";
					$('#ddPMList').html($('#ddPMList>span').html() + $('.delete-dummy')[0].innerHTML + $('.delete-dummy')[1].innerHTML);
					$('.delete-dummy').remove();

					$('#username_list').attr('row','1');
					$('.pmlist a').addClass('btn btn-default btn-sm pmlist-btn-spacer');
					$('.pmlist a').html('Find username »')

					$('.pmlist input').addClass('btn-sm pmlist-btn-spacer'); //add, add[bcc]
				}

				//-------------------
				//Inbox
				//-------------------
				//PM button
				$('a[title="Compose message"]').attr('id','aPM');
				$('#aPM').addClass('fa fa-pencil-square-o');
				$('.newpm-icon').attr('id','btnPM');
				$('.newpm-icon').toggleClass('newpm-icon');
				$('#aPM').text(' Compose PM');
				$('#aPM').addClass('btn btn-info');

				break;
			case location.href.lastIndexOf('=167')!==-1 || location.href.lastIndexOf('i=groups')!==-1:  //usergroups
				navTabs[0].innerHTML = '<i class="fa fa-user-secret fa-lg fa-fw" style="color: black"></i> ' + navTabs[0].innerHTML;
				navTabs[1].innerHTML = '<i class="fa fa-wrench fa-lg fa-fw" style="color: black"></i> ' + navTabs[1].innerHTML;
				break;
			case location.href.lastIndexOf('=168')!==-1 || location.href.lastIndexOf('i=zebra')!==-1: //friends/foes
				navTabs[0].innerHTML = '<i class="fa fa-smile-o fa-lg fa-fw" style="color: black"></i> ' + navTabs[0].innerHTML;
				navTabs[1].innerHTML = '<i class="fa fa-frown-o fa-lg fa-fw" style="color: black"></i> ' + navTabs[1].innerHTML;
				break;
			default:
				navTabs[0].innerHTML = '<i class="fa fa-user fa-lg fa-fw" style="color: black"></i> ' + navTabs[0].innerHTML;
				navTabs[1].innerHTML = '<i class="fa fa-plus-square fa-lg fa-fw" style="color: black"></i> ' + navTabs[1].innerHTML;
				navTabs[2].innerHTML = '<i class="fa fa-bookmark fa-lg fa-fw" style="color: black"></i> ' + navTabs[2].innerHTML;
				navTabs[3].innerHTML = '<i class="fa fa-folder-open fa-lg fa-fw" style="color: black"></i> ' + navTabs[3].innerHTML;
				navTabs[4].innerHTML = '<i class="fa fa-paperclip fa-lg fa-fw" style="color: black"></i> ' + navTabs[4].innerHTML;
		}



		$('#cp-main .fields1 > .column1').parent().attr('id','composePanel');
		$('#composePanel').removeClass('form-inline');

		//topiclist
		var topicListHeaderEls = $('#cp-main .topiclist>.header').parents('.topiclist');
		if (tlh !== 0) {
			for (var tlh = topicListHeaderEls.length; tlh--;) {
				topicListHeaderEls[tlh].setAttribute('style','');
			}
		}

	}


	//================================================================================
	// Text editing buttons
	//================================================================================

	$('input[name="addbbcode6"]').attr('id','btnQuote');
	$('input[name="addbbcode8"]').val('');
	$('#btnQuote').val('');
	$('#btnQuote').css('width','');
	$('input[name="addbbcode10"]').val('');
	$('input[name="addbbcode12"]').val('');
	$('input[name="addbbcode14"]').val('');
	$('input[name="addbbcode16"]').attr('id','btnURL');
	$('#btnURL').val('');
	$('#btnURL').css('text-decoration','none');
	$('input[name="bbpalette"]').val('A');
	$('input[name="addbbcode22"]').val('');
	$('input[name="addbbcode24"]').val('');
	$('input[name="addbbcode26"]').attr('id','btnYoutube1');
	$('#btnYoutube1').remove();
	//$('#btnYoutube1').val('');
	$('#btnYoutube1').attr('style','font-weight: normal; color: #AAA;');
	$('input[name="addbbcode28"]').attr('id','btnYoutube2');
	$('#btnYoutube2').val('');
	$('#btnYoutube2').css('font-weight','normal');

	$(':button').css('width','');

	$('div#format-buttons > :button').attr('style','padding: 6px 8px 5px;'); // border-left: 1px solid #DDD;
	$('#format-buttons').addClass('form-inline');

	$('#message').css('height','350px');
	//------------------------------
	// Text formatting
	//------------------------------
	$('#smiley-box').html('\
		<hr>\
		<a href="#" class="emoji" onclick="insert_text(\':D\', true); return false;" title="Very Happy">&#x1F604;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':)\', true); return false;" title="Smile">&#x1F600;</a>\
		<a href="#" class="emoji" onclick="insert_text(\';)\', true); return false;" title="Wink">&#x1F609;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':(\', true); return false;" title="Sad">&#x1F61E;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':o\', true); return false;" title="Surprised">&#x1F62E;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':shock:\', true); return false;" title="Shocked">&#x1F627;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':?\', true); return false;" title="Confused">&#x1F615;</a>\
		<a href="#" class="emoji" onclick="insert_text(\'B-)\', true); return false;" title="Cool">&#x1F60E;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':lol:\', true); return false;" title="Laughing">&#x1F606;</a>\
		<a href="#" class="emoji" onclick="insert_text(\'>:|\', true); return false;" title="Mad">&#x1F620;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':P\', true); return false;" title="Razz">&#x1F61B;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':oops:\', true); return false;" title="Embarrassed">&#x1F633;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':cry:\', true); return false;" title="Crying or Very Sad">&#x1F622;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':evil:\', true); return false;" title="Evil or Very Mad">&#x1F47F;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':twisted:\', true); return false;" title="Twisted Evil">&#x1F608;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':roll:\', true); return false;" title="Rolling Eyes">&#x1F612;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':!:\', true); return false;" title="Exclamation">&#x2757;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':?:\', true); return false;" title="Question">&#x2753;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':idea:\', true); return false;" title="Idea">&#x1F4A1;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':soon:\', true); return false;" title="Arrow (Soon)">&#x1F51C;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':|\', true); return false;" title="Neutral">&#x1F610;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':poop:\', true); return false;" title="Mr. Brown">&#x1F4A9;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':geek:\', true); return false;" title="Geek">&#x1F47E;</a>\
		<a href="#" class="emoji" onclick="insert_text(\':ugeek:\', true); return false;"><img src="./images/smilies/icon_e_ugeek.gif" width="18" height="19" alt=":ugeek:" title="Uber Geek"></a>\
		<hr>\
	<div style="font-size: 8pt">\
		<a href="./faq.php?mode=bbcode">BBCode</a> is <em>ON</em><br>\
		[img] is <em>ON</em><br>\
		[flash] is <em>OFF</em><br>\
		[url] is <em>ON</em><br>\
		Smilies are <em>ON</em>\
	</span>');

	// smileys
	$('img[alt=":D"]').parent().attr('title',$('img[alt=":D"]').attr('title'));
	$('img[alt=":D"]').after('&#x1F604;');
	$('img[alt=":D"]').remove();
	$('img[alt=":)"]').parent().attr('title',$('img[alt=":)"]').attr('title'));
	$('img[alt=":)"]').after('&#x1F600;');
	$('img[alt=":)"]').remove()
	$('img[alt=";)"]').parent().attr('title',$('img[alt=";)"]').attr('title'));
	$('img[alt=";)"]').after('&#x1F609;')
	$('img[alt=";)"]').remove();
	$('img[alt=":("]').parent().attr('title',$('img[alt=":("]').attr('title'));
	$('img[alt=":("]').after('&#x1F61E;')
	$('img[alt=":("]').remove();
	$('img[alt=":o"]').parent().attr('title',$('img[alt=":o"]').attr('title'));
	$('img[alt=":o"]').after('&#x1F62E;')
	$('img[alt=":o"]').remove()
	$('img[alt=":shock:"]').parent().attr('title',$('img[alt=":shock:"]').attr('title'));
	$('img[alt=":shock:"]').after('&#x1F627;')
	$('img[alt=":shock:"]').remove();
	$('img[alt=":?"]').parent().attr('title',$('img[alt=":?"]').attr('title'));
	$('img[alt=":?"]').after('&#x1F615;')
	$('img[alt=":?"]').remove();
	$('img[alt="8-)"]').parent().attr('title',$('img[alt="8-)"]').attr('title'));
	$('img[alt="8-)"]').after('&#x1F60E;')
	$('img[alt="8-)"]').remove()
	$('img[alt=":lol:"]').parent().attr('title',$('img[alt=":lol:"]').attr('title'));
	$('img[alt=":lol:"]').after('&#x1F606;')
	$('img[alt=":lol:"]').remove();
	$('img[alt=":x"]').parent().attr('title',$('img[alt=":x"]').attr('title'));
	$('img[alt=":x"]').after('&#x1F620;')
	$('img[alt=":x"]').remove()
	$('img[alt=":P"]').parent().attr('title',$('img[alt=":P"]').attr('title'));
	$('img[alt=":P"]').after('&#x1F61B;')
	$('img[alt=":P"]').remove()
	$('img[alt=":oops:"]').parent().attr('title',$('img[alt=":oops:"]').attr('title'));
	$('img[alt=":oops:"]').after('&#x1F633;')
	$('img[alt=":oops:"]').remove()
	$('img[alt=":cry:"]').parent().attr('title',$('img[alt=":cry:"]').attr('title'));
	$('img[alt=":cry:"]').after('&#x1F622;')
	$('img[alt=":cry:"]').remove();
	$('img[alt=":evil:"]').parent().attr('title',$('img[alt=":evil:"]').attr('title'));
	$('img[alt=":evil:"]').after('&#x1F47F;')
	$('img[alt=":evil:"]').remove();
	$('img[alt=":twisted:"]').parent().attr('title',$('img[alt=":twisted:"]').attr('title'));
	$('img[alt=":twisted:"]').after('&#x1F608;')
	$('img[alt=":twisted:"]').remove();
	$('img[alt=":roll:"]').parent().attr('title',$('img[alt=":roll:"]').attr('title'));
	$('img[alt=":roll:"]').after('&#x1F612;')
	$('img[alt=":roll:"]').remove();
	$('img[alt=":!:"]').parent().attr('title',$('img[alt=":!:"]').attr('title'));
	$('img[alt=":!:"]').after('&#x2757;')
	$('img[alt=":!:"]').remove();
	$('img[alt=":?:"]').parent().attr('title',$('img[alt=":?:"]').attr('title'));
	$('img[alt=":?:"]').after('&#x2753;')
	$('img[alt=":?:"]').remove();
	$('img[alt=":idea:"]').parent().attr('title',$('img[alt=":idea:"]').attr('title'));
	$('img[alt=":idea:"]').after('&#x1F4A1;')
	$('img[alt=":idea:"]').remove();
	$('img[alt=":arrow:"]').parent().attr('title','Arrow (Soon)');
	$('img[alt=":arrow:"]').after('&#x1F51C;')
	$('img[alt=":arrow:"]').remove();
	$('img[alt=":|"]').parent().attr('title',$('img[alt=":|"]').attr('title'));
	$('img[alt=":|"]').after('&#x1F610;')
	$('img[alt=":|"]').remove();
	$('img[alt=":mrgreen:"]').parent().attr('title','Mr. Brown');
	$('img[alt=":mrgreen:"]').after('&#x1F4A9;')
	$('img[alt=":mrgreen:"]').remove();
	$('img[alt=":geek:"]').parent().attr('title',$('img[alt=":geek:"]').attr('title'));
	$('img[alt=":geek:"]').after('&#x1F47E;');
	$('img[alt=":geek:"]').remove();
	//$('img[alt=":ugeek:"]').parent().html('&#x1F600;')

	// Modify position of quick reply button
	var postReplyBtn = $('.displayopt-row>.buttons');
	postReplyBtn.append($('[name="show_qr"]').parents('fieldset'));
	$('[name="show_qr"]').val('Quick Reply ');
	$('div#qr_showeditor_div').attr('style','');
	$('#message-box>input.inputbox').css('width','100%')
	$('#qr_editor_div input#subject').css('width','70%')

	// Small hide button
	$('.btnlite').attr('style','');
	$('.btnlite').addClass('btn-xs');
	$('.btnlite').toggleClass('btnlite');

};

changePageStyle();
});


//window.addEventListener('onload', changePageStyle, false);


