// ==UserScript==
// @name       网易新年背景屏蔽
// @namespace    mscststs
// @version      0.1
// @description  网易新年背景屏蔽= =
// @author       mscststs
// @match        http*://www.163.com/
// @grant        none
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=249281
// @downloadURL https://update.greasyfork.org/scripts/38221/%E7%BD%91%E6%98%93%E6%96%B0%E5%B9%B4%E8%83%8C%E6%99%AF%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/38221/%E7%BD%91%E6%98%93%E6%96%B0%E5%B9%B4%E8%83%8C%E6%99%AF%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
	 async function start(){
	 	let k = await mscststs.wait("#js_festival_wrap > div.festival_main > span.close_fastival");
		k.click();
	 }
	start();

})();