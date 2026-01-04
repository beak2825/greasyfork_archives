// ==UserScript==
// @name        Abas 1500chan
// @namespace   Violentmonkey Scripts
// @match       https://1500chan.org/*
// @grant       none
// @version     1.0
// @author      -
// @description Mostra o conteúdo/assunto da thread no título da aba do 1500chan.
// @downloadURL https://update.greasyfork.org/scripts/426901/Abas%201500chan.user.js
// @updateURL https://update.greasyfork.org/scripts/426901/Abas%201500chan.meta.js
// ==/UserScript==

if($('body').hasClass('active-thread')) {
let subject = $('.post.op .subject').text();
let post = $('.post.op .body').text().substring(0,100);
let title = '/' + board_name + '/ - ';
title += subject || post;
document.title = title;

function updateTitle() {
let t = document.querySelector('title');
let r = t.textContent.match(/^\((\d+)\).*/);
if(r) {
t.textContent = '(' + r[1] + ') ' + title;
} else {
t.textContent = title;
}
}

$(window).on('new_post', () => setTimeout(updateTitle, 500));
$(window).focus(updateTitle);
$(window).scroll(updateTitle);
}