// ==UserScript==
// @name       youtube Title control
// @namespace    mscststs
// @version      0.1
// @description  Control the navbar of youtube and move the Tile
// @author       mscststs
// @match        http*://www.youtube.com/watch?*
// @grant        none
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=249281
// @downloadURL https://update.greasyfork.org/scripts/38223/youtube%20Title%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/38223/youtube%20Title%20control.meta.js
// ==/UserScript==

(function() {
    'use strict';
	async function start(){
		let s = await mscststs.wait("#ticker");
		s.innerHTML+=`<style>#masthead-container.ytd-app{
    position:relative !important;
}
#page-manager{
	margin-top:0px !important;
}
</style>`;
	}
	start();

})();