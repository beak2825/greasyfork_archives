// ==UserScript==
// @name WhatsappWebInjector
// @description Inject HTML code in Whatsapp Web
// @author JlXip
// @namespace WWI
// @version 0.0.4
// @include https://web.whatsapp.com/

// @require http://code.jquery.com/jquery-git.min.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349

// @license APACHE LICENSE 2.0
// @supportURL https://gitlab.com/jlxip/WWI
// @downloadURL https://update.greasyfork.org/scripts/25866/WhatsappWebInjector.user.js
// @updateURL https://update.greasyfork.org/scripts/25866/WhatsappWebInjector.meta.js
// ==/UserScript==

function decrypt_n_message(n) {
    var WWIlastmsg = $('div.msg').get(n);

    if(WWIlastmsg.children[1] === undefined || WWIlastmsg.children[1].children[0].children[2].children[0].children[1] === undefined) { // Si el objeto no es un mensaje (como un paso temporal AYER-HOY)
        return;
    }

    var WWIchildmsg = WWIlastmsg.children[1].children[0].children[2].children[0].children[1];

    var WWIrawmsg = $(WWIchildmsg).html();
    var WWIbegmsg = WWIrawmsg.split('-->')[1];
    if(WWIbegmsg === undefined) {
        return;
    }
    var WWImsg = WWIbegmsg.split('<!--')[0];

    if(WWImsg.split("[WWI]").length > 1) {
        var WWIdecrypted = atob(WWImsg.split("[WWI]")[1]);
        $(WWIchildmsg).html(WWIdecrypted);
    }
}

function WWIloop_check_messages() {
    for(var WWIi=2;WWIi<$('div.msg').length;WWIi++) {
        decrypt_n_message(WWIi);
    }
}

function WWIrun() {
    WWIloop_check_messages();

	$('div.message-list').bind("DOMSubtreeModified", function(){
        WWIloop_check_messages();
	});
}

$(function() {
    waitForKeyElements('div.message-list', WWIrun);
});