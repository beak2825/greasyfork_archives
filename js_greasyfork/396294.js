// ==UserScript==
// @name Joykabo
// @description Joyreactor comments highlighter
// @description:ru Выделение вложенности комментариев как на пикабу.
// @include        *://joyreactor.cc/*
// @include        *://*.joyreactor.cc/*
// @include        *://*.reactor.cc/*
// @include        *://pornreactor.cc/*
// @version 0.0.3
// @namespace https://greasyfork.org/users/443585
// @downloadURL https://update.greasyfork.org/scripts/396294/Joykabo.user.js
// @updateURL https://update.greasyfork.org/scripts/396294/Joykabo.meta.js
// ==/UserScript==
var style = document.createElement('style');
style.innerHTML = `
.comment_list {
border-left:2px solid #FDB201;
margin-left: 18px;
}
.comment_list:hover {
border-left:4px solid #FDB201;
margin-left: 16px;
}
`;
document.head.appendChild(style);