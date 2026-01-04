// ==UserScript==
// @name         alerty ll css
// @version      1.3
// @match        https://*.margonem.pl
// @grant        none
// @namespace https://greasyfork.org/users/867683
// @description zmiana wyglądu ll
// @downloadURL https://update.greasyfork.org/scripts/487099/alerty%20ll%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/487099/alerty%20ll%20css.meta.js
// ==/UserScript==

(function() {
    'use strict';
{
$(`<style>
.cll-alert { 
    box-shadow: 0 0 0 1px #010101, 0 0 0 2px #ccc, 0 0 0 3px #0c0d0d, 2px 2px 3px 3px #0c0d0d66 !important;
    background: rgba(0,0,0,.7) !important; 
	border-radius: 4px !important;
	border: none !important;
	cursor: url('../img/gui/cursor/1n.png'), auto !important;
}

.cll-alert-header { 
    color: #e6d6bf !important; 
}

.cll-alert-content { 
    color: white !important;	
	background: none !important;
	font-size: 13px !important;
}

.cll-alert button { 
    height: 28px !important;
    line-height: 24px !important;
    border-radius: 8px !important;
    box-shadow: inset 0 0 1px 1px #cecece, inset 0 0 0 3px #0c0d0d, inset 3px 3px 2px 1px #7ec568a6, inset -3px -3px 2px 1px #7ec568a6 !important;
    background-image: linear-gradient(to top,#12210d,#396b29) !important;
    color: #e6d6bf !important; 
	padding: 1px 10px 1px !important;
	cursor: url('../img/gui/cursor/5n.png'), auto !important;
	font-size: 13px !important;
}

.cll-alert button:hover { 
	background-image: linear-gradient(to top,#101010,#434343) !important;
	box-shadow: inset 0 0 1px 1px #cecece, inset 0 0 0 3px #0c0d0d, inset 3px 3px 2px 1px #949293, inset -3px -3px 2px 1px #949293 !important;
	font-size: 13px !important;
}

.cll-modal {
    background: rgba(0,0,0,.7) !important; 
	border-radius: 4px !important;
	box-shadow: 0 0 0 1px #010101, 0 0 0 2px #ccc, 0 0 0 3px #0c0d0d, 2px 2px 3px 3px #0c0d0d66 !important;
}

.cll-modal-title {
    color: #e6d6bf !important;
}

.cll-modal button {
    line-height: 26px !important;
    border-radius: 8px !important;
    box-shadow: inset 0 0 1px 1px #cecece, inset 0 0 0 3px #0c0d0d, inset 3px 3px 2px 1px #7ec568a6, inset -3px -3px 2px 1px #7ec568a6 !important;
    background-image: linear-gradient(to top,#12210d,#396b29) !important;
    color: #e6d6bf !important; 
	padding: 1px 10px 1px !important;
	cursor: url('../img/gui/cursor/5n.png'), auto !important;
	max-width: none !important;
}

.cll-modal button:hover { 
	background-image: linear-gradient(to top,#101010,#434343) !important;
	box-shadow: inset 0 0 1px 1px #cecece, inset 0 0 0 3px #0c0d0d, inset 3px 3px 2px 1px #949293, inset -3px -3px 2px 1px #949293 !important;
	max-width: none !important;
}

.cll-bordered-button {
    line-height: 26px !important;
	border: none !important;
    border-radius: 8px !important;
    box-shadow: inset 0 0 1px 1px #cecece, inset 0 0 0 3px #0c0d0d, inset 3px 3px 2px 1px #7ec568a6, inset -3px -3px 2px 1px #7ec568a6 !important;
    background-image: linear-gradient(to top,#12210d,#396b29) !important;
    color: #e6d6bf !important; 
	padding: 1px 10px 1px !important;
	cursor: url('../img/gui/cursor/5n.png'), auto !important;
	max-width: none !important;
}

.cll-bordered-button:hover { 
	background-image: linear-gradient(to top,#101010,#434343) !important;
	box-shadow: inset 0 0 1px 1px #cecece, inset 0 0 0 3px #0c0d0d, inset 3px 3px 2px 1px #949293, inset -3px -3px 2px 1px #949293 !important;
	max-width: none !important;
	border-color: transparent !important;
}

.cll-member:hover {
    cursor: url('../img/gui/cursor/5n.png'), auto !important;
}

.cll-menu {
	box-shadow: 0 0 0 1px #150f0d inset, 0 0 0 1px #b6bbc1b0, 0 0 0 2px #150f0d !important;
	max-width: 140px !important;
	padding: 2px !important;
	padding-bottom: 1px !important;
	background-color: #3f3b3d !important;
	border-radius: 4px !important;
	cursor: url('../img/gui/cursor/1n.png'), auto !important;
}

.cll-menu-item {
    min-width: 90px !important;
	text-align: center !important;
    border-radius: 3px !important;
    background-color: #244518 !important;
    color: #fff !important;
    border: 1px solid #396420 !important;
	margin-bottom: 1px !important;
	cursor: url('../img/gui/cursor/5n.png'), auto !important;
}

.cll-menu-item:hover {
    border: 1px solid #4f7b21 !important;
	background-color: #2e4f18 !important;
}

.cll-timer:hover {
    cursor: url('../img/gui/cursor/5n.png'), auto !important;
}

.cll-launcher:hover {
    cursor: url('../img/gui/cursor/5n.png'), auto !important;
}

</style>`).appendTo('head');
}
})();