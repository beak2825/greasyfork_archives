// ==UserScript==
// @name         Gitter Done for FreeCodeCamp
// @namespace    http://aimless.info/
// @version      0.4
// @description  Fix annoyances of of gitter.im FreeCodeCamp channels
// @author       Chuck Adams
// @match        https://gitter.im/FreeCodeCamp/*
// @grant        unsafeWindow
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
// @downloadURL https://update.greasyfork.org/scripts/18811/Gitter%20Done%20for%20FreeCodeCamp.user.js
// @updateURL https://update.greasyfork.org/scripts/18811/Gitter%20Done%20for%20FreeCodeCamp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //// config

    var STFU = ['@camperbot'];
    var GAGGED_TEXT = '...';

    //// main

    var $ = unsafeWindow.jQuery;

    addStyles();

    var targetNodes         = $("#chat-container");
    var MutationObserver    = window.MutationObserver || window.WebKitMutationObserver;
    var myObserver          = new MutationObserver(mutationObserved);
    var obsConfig           = { childList: true, characterData: false, attributes: false, subtree: true };

    targetNodes.each(function () {
        myObserver.observe (this, obsConfig);
    });

    //// end main

    function mutationObserved(recs) {
        _.each(recs, handleMutation);
    }

    function handleMutation(rec) {
        _.each(rec.addedNodes, nodeAdded);
    }

    function addStyles() {
        // Bit of a hack but it does the job
        $('<style>.gagged .chat-item__content { display: none; }</style>').appendTo('head');
        $('<style>.gagged .chat-item__actions { display: none; }</style>').appendTo('head');
        $('<style>.gagged .avatar__image { border: 5px double #fcf; }</style>').appendTo('head');
        $('<style>.muffled-screaming { display: none; position: absolute; top: 0; left: 64px; white-space: nowrap; }</style>').appendTo('head');
        $('<style>.muffled-screaming.audible { display: inline; color: #ccc; font-style: italic; }</style>').appendTo('head');
    }

    function nodeAdded(node) {
        var from = $('.chat-item__username', node);
        if (from.length === 0) return;

        var who = from.text();
        if (who === '') return;

        if (_.contains(STFU, who)) {
            gag(node);
        }
    }

    function gag(node) {
        var avatar = $('img.avatar__image', node);
        if (avatar.length === 0) return; // node is deeper than we wanted

        $(node).addClass('gagged');
        avatar.click(function () { ungag(node); });

        var screams = $('.muffled-screaming', node);
        if (screams.length === 0) {
            $('<span class="muffled-screaming audible">' + GAGGED_TEXT + '</span>').insertAfter(avatar);
            screams = $('.muffled-screaming', node);
        }
        screams.addClass('audible');
    }

    function ungag(node) {
        $(node).removeClass('gagged');
        var avatar = $('img.avatar__image', node);
        avatar.click(function () { gag(node); });
        $('.muffled-screaming', node).removeClass('audible');
    }

})();
