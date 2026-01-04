// ==UserScript==
// @name            Add a Broadcaster Name at the Page Title
// @name:ja         番組情報ページタイトルに局名を表示
// @namespace       https://greasyfork.org/users/19523
// @description     Add a broadcaster name to the beginning of title on TV Kingdom
// @description:ja  テレビ王国の番組情報ページのタイトル(タブ)の冒頭に局名を追加する
// @include         https://tv.so-net.ne.jp/schedule/*
// @version         0.1
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/388387/Add%20a%20Broadcaster%20Name%20at%20the%20Page%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/388387/Add%20a%20Broadcaster%20Name%20at%20the%20Page%20Title.meta.js
// ==/UserScript==


document.title = document.querySelector('dl.basicTxt > dd:nth-child(3)').firstChild.nodeValue + ' ' + document.title;
