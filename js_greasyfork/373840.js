// ==UserScript==
// @name         Bahamut mail mark all as read
// @namespace    https://blog.maple3142.net/
// @version      0.1
// @description  Mark all as read
// @author       maple3142
// @match        https://mailbox.gamer.com.tw/
// @grant        none
// @compatible   firefox >=52
// @compatible   chrome >=55
// @downloadURL https://update.greasyfork.org/scripts/373840/Bahamut%20mail%20mark%20all%20as%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/373840/Bahamut%20mail%20mark%20all%20as%20read.meta.js
// ==/UserScript==

(function($) {
	'use strict'
	const read=sn=>Promise.resolve($.post('https://mailbox.gamer.com.tw/ajax/unreadRead.php',{sn}))
	$('#delFrm').before($('<button>').text('全部標記已讀').click(()=>{
		const $titles=$('.mailTitle')
		const sns=$titles.map((i,e)=>$(e).data('sn')).toArray()
		Promise.all(sns.map((sn,i)=>read(sn).then(()=>$($titles[i]).parent().parent().parent().remove()))).then(()=>console.log('ok'))
	}))
})(jQuery)
