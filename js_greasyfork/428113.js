// ==UserScript==
// @name         gelbooru click
// @namespace    wololo
// @version      0.2
// @description  click image to view in same tab
// @author       sanitysama
// @match        *://gelbooru.com/index.php?page=post*
// @match        *://danbooru.donmai.us/posts/*
// @match        *://chan.sankakucomplex.com/post/show/*
// @match        *://safebooru.org/index.php?page=post*
// @match        *://rule34.xxx/index.php?page=post*
// @match        *://safebooru.donmai.us/posts/*
// @match        *://booru.allthefallen.moe/posts/*
// @match        *://e621.net/posts/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428113/gelbooru%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/428113/gelbooru%20click.meta.js
// ==/UserScript==

(function() {
    $('#image').attr('onClick', 'window.location.assign(this.src)');
})();