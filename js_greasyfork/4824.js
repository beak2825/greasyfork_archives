// ==UserScript==
// @name        DraftIcon
// @description Change favicon on habrahabr when user moves post to drafts
// @version     0.4
// @icon        http://gm4.in/i/brb.ico
// @match       http://habrahabr.ru/post/*
// @match       http://habrahabr.ru/company/*/blog/*
// @run-at      document-end
// @namespace https://greasyfork.org/users/5010
// @downloadURL https://update.greasyfork.org/scripts/4824/DraftIcon.user.js
// @updateURL https://update.greasyfork.org/scripts/4824/DraftIcon.meta.js
// ==/UserScript==

if ( document.title == "Хабрахабр — Доступ к странице ограничен" )
{
	var link = document.createElement( 'link' );
	link.rel = 'icon';
	link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABlBMVEX////tHCQujCkBAAAALklEQVR42uXTIQoAAAgEwfP/nxaxWOTqipMMmw5UGKRAbZyHg/IgIEzNDgiftUqKAQKx2C5iUQAAAABJRU5ErkJggg==';
	document.head.appendChild( link );
}
