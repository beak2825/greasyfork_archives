// ==UserScript==
// @name           Hide a Ticker of Messages
// @name:ja        「～しました」を非表示
// @namespace      https://greasyfork.org/users/19523
// @version        0.1.1
// @description    Hide a ticker of messages that scrolls on the bottom of a video screen on Nico Live.
// @description:ja ニコニコ生放送で映像画面下部に流れる「ニコニ広告しました」「第○位にランクインしました」「が貼られました」「延長しました」などのメッセージテロップを非表示にします
// @match          https://live2.nicovideo.jp/watch/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/385617/Hide%20a%20Ticker%20of%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/385617/Hide%20a%20Ticker%20of%20Messages.meta.js
// ==/UserScript==

document.querySelector('div[class*="telop-layer"]').style.visibility = 'hidden';
