// ==UserScript==
// @name         4plebs stub and hide button generator inside threads (for SpookyX).
// @namespace    http://tampermonkey.net/
// @version      2025-08-16.2
// @description  Some foolfuuka archives remove the post stubs + the hide buttons from the html entirely, not sure why but this script generates them so they can be used by spookyX.
// @author       You
// @match        https://archive.4plebs.org/*/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4plebs.org
// @grant        none
// @run-at       document-end
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/546003/4plebs%20stub%20and%20hide%20button%20generator%20inside%20threads%20%28for%20SpookyX%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546003/4plebs%20stub%20and%20hide%20button%20generator%20inside%20threads%20%28for%20SpookyX%29.meta.js
// ==/UserScript==


//If you are not using spookyX, then you will have to make some CSS to override the "display: none;" rule on the ".pull-left" containers that the hide buttons sit in.
(function() {
    'use strict';

    //I think the post doc id is a foolfuuka thing, it's different from the 4chan post id
    function make_hide_button(board_link, post_doc_id) {
        return `<div class="pull-left" style="float: left;"> <button class="btn-toggle-post" data-function="hidePost" data-board="${board_link}" data-doc-id="${post_doc_id}"><i class="icon-minus"></i></button> </div>`;
    }

    function insert_hide_buttons_within_existing_posts(board_link) {
        const thread_replies_container = document.querySelector(".posts");
        const [...thread_replies] = thread_replies_container.children;
        for(const thread_reply of thread_replies) {
            const post_doc_id = thread_reply.getAttribute("data-doc-id");
            thread_reply.insertAdjacentHTML("afterbegin", make_hide_button(board_link, post_doc_id));
        }
    }

    //the data-thread-num uses the 4chan OP id
    function make_stub(board_link, thread_id, post_doc_id, post_author, post_tripcode) {
        return `<div class="post stub stub_doc_id_${post_doc_id}" style="display: none;"> <button class="btn-toggle-post" data-function="showPost" data-board="${board_link}" data-doc-id="${post_doc_id}" data-thread-num="${thread_id}"><i class="icon-plus"></i></button> <span class="post_author">${post_author}</span><span class="${post_tripcode}"></span> </div>`;
    }

    function insert_stubs_within_existing_posts(board_link, thread_id) {
        const thread_replies_container = document.querySelector(".posts");
        const [...thread_replies] = thread_replies_container.children;
        for(const thread_reply of thread_replies) {
            const post_doc_id = thread_reply.getAttribute("data-doc-id");
            const post_author = thread_reply.querySelector(".post_author").textContent; //XSS possible? Dunno if 4chan sanitizes names :P
            const post_tripcode = thread_reply.querySelector(".post_tripcode").textContent;
            thread_reply.insertAdjacentHTML("beforebegin", make_stub(board_link, thread_id, post_doc_id, post_author, post_tripcode));
        }

    }

    const board_link_from_url = /(?<=\/)[^\/]+/;
    const board_link = window.location.pathname.match(board_link_from_url)[0];
    insert_hide_buttons_within_existing_posts(board_link);

    const thread_id_from_url = /[^\/]+(?=\/?$)/;
    const thread_id = window.location.pathname.match(thread_id_from_url)[0];
    insert_stubs_within_existing_posts(board_link, thread_id);


})();