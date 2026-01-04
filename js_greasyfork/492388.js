// ==UserScript==
// @name         Canva Start Deleting
// @namespace    http://tampermonkey.net/
// @version      2024-04-13
// @description  Canva - Empty ALL Images from Trash folder - simplest way - UPDATED 2024
// @author       James Vincent Carroll II
// @license      MIT
// @match        https://www.canva.com/folder/trash
// @icon         https://www.google.com/s2/favicons?sz=64&domain=canva.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492388/Canva%20Start%20Deleting.user.js
// @updateURL https://update.greasyfork.org/scripts/492388/Canva%20Start%20Deleting.meta.js
// ==/UserScript==

const btncss = { position: 'absolute', top: '27px', left: '75%', zIndex: '2147483647', fontSize: '17px', transform: 'translateX(-50%)', background: 'radial-gradient(circle, #ffffff 0%, #ffffffee 19%, #ffe88e 64%, #e791ff 100%)', padding: '4px 13px 5px', borderRadius: '13px', textAlign: 'center', boxShadow: 'black 0px 0px 10px, white 0px 0px 10px inset', minWidth: 'max-content', cursor: 'pointer', letterSpacing: '2px' };

function fn_start_deleting() {
	window.timeout = setInterval(()=> {
		$('button[aria-label="More actions"][aria-haspopup="menu"]').eq(0).click();
		setTimeout(()=> $('span:contains("Delete from Trash")').click(), 100);
		setTimeout(()=> $('span:contains("Delete from Trash")').click(), 200);
	}, 1000);
}
const btn = $('<div>').css(btncss).text('Start Deleting').click(fn_start_deleting);
$('body').append(btn);