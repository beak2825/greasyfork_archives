// ==UserScript==
// @name         AG No Modal Share
// @version      16082021
// @description  Отключает навязчивое окно с предложением поделиться оценкой с друзьями после голосования
// @author       pronin
// @include      https://ag.mos.ru/*
// @namespace    https://greasyfork.org/users/506633
// @require https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js?version=198809
// @downloadURL https://update.greasyfork.org/scripts/418358/AG%20No%20Modal%20Share.user.js
// @updateURL https://update.greasyfork.org/scripts/418358/AG%20No%20Modal%20Share.meta.js
// ==/UserScript==


document.arrive('.modal-actions', {existing: true}, function() { var obj=document.querySelector('.button--muted');
  if (obj) obj.click();});
