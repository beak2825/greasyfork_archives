// ==UserScript==
// @name     betterLH
// @version  1.1
// @run-at   document-start
// @include  https://*lusthaus.cc/*
// @require https://cdn.jsdelivr.net/jquery/latest/jquery.min.js
// @namespace https://greasyfork.org/users/290665
// @description Enhances LH
// @grant GM_addStyle
// @grant GM_download
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/399604/betterLH.user.js
// @updateURL https://update.greasyfork.org/scripts/399604/betterLH.meta.js
// ==/UserScript==

// addBoardColors(); // change board style
addOBadges(); // add style for badges
(function($){
    $(function() {
        $('img[title^="Gott mit dir, du"]').after('<div class="fo-badge">FO</div>');
        $('img[title^="Gott mit dir ..."]').after('<div class="ao-badge">AO</div>');
    // $('body table:nth-child(2)').remove();
});
})(jQuery);

function addBoardColors() {
    GM_addStyle(`
/* i really want this to be global */
@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:400,400i,700,700i|Roboto:400,400i,500,500i,700,700i&display=swap');
.vbmenu_control {
	background: #d7d7d7;
}

body>table:nth-of-type(2) {
	display: none;
}

body>table:nth-of-type(1) img {
	display: none;
}

body>div>div>div>table:nth-of-type(2)>tbody>tr>td:first-of-type {
	display: none;
}

[color="red"],
[color="#FF0000"],
.time {
	color: #305f7b !important;
}

a,
a:link {
	color: #313166 !important;
}

a:hover,
a:active,
body_ahover {
	color: black;
	text-decoration: none;
}

[bgcolor="#FF0000"],
.tcat {
	background-color: #697370 !important;
	background-image: none;
}

[bgcolor="#FFFF00"],
[style="background-color: #FFFF00"] {
	background-color: #C7E2EC !important;
	background-image: none;
}

img[src="https://images.lusthaus.cc/subforum.gif"] {
	filter: grayscale(100%);
}

img[src*="vidissimo"] {
	filter: grayscale(100%);
}

img[src^="customavatars/"] {
	filter: grayscale(100%);
}
`);
}

function addOBadges() {
    GM_addStyle(`
img[title^="Gott mit"] {
    position: relative;
}
.fo-badge, .ao-badge {
    display: inline-block;
    position: relative;
    margin-left: -15px;
    top: -9px;
    border-radius: 2px;
    padding: 1px 2px;
    background: #b600ff;
    color: white;
    font-size: 10px;
    opacity: 0.5;
    z-index: 0;
}
.fo-badge {
    left: -20px;
    top: 2px;
}
`);
}
