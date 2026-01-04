// discord.gg/JjszyaD63A

// ==UserScript==
// @name         [Brick-Kill] Postfarmer
// @version      6
// @description  Sends automated messages on Brick Hill forums.
// @author       Spacekiller
// @match        *://www.brick-hill.com/*
// @icon         https://www.brick-hill.com/favicon.ico
// @license      MIT
// @namespace    bhpostfarmer
// @downloadURL https://update.greasyfork.org/scripts/492573/%5BBrick-Kill%5D%20Postfarmer.user.js
// @updateURL https://update.greasyfork.org/scripts/492573/%5BBrick-Kill%5D%20Postfarmer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*-    SETTINGS    -*/
    const config = {
        post: {
            title: "put stuff here", // Title of the post.
            body: "put stuff\nhere", // Text of the post.
            categoryID: 2, // Forum category ID, Off-Topic is 2 for example.
            randomCategory: false, // Set to true to enable random category selection.
            interval: 60, // Don't go below 60 seconds, cause that's the limit.
            enabled: true // True or false to enable post spam.
        },
        reply: {
            body: "put stuff\nhere", // Text of the reply.
            postID: 100000, // ID of the forum thread you want to target.
            interval: 15, // Don't go below 15 seconds, cause that's the limit.
            enabled: false // True or false to enable reply spam.
        },
        comment: {
            comment: "put stuff here", // Text of the comment.
            commentable_id: 375378, // ID of a shop item or a game.
            interval: 30, // Don't go below 30 seconds, cause that's the limit.
            polymorphic_type: 1,
            enabled: false // True or false to enable comment spam.
        },
        message: {
            title: "put stuff here", // Title of the message.
            reply: "put stuff\nhere", // Text of the post.
            recipient: 4787, // ID of the user you want to target.
            interval: 30, // Don't go below 30 seconds, cause that's the limit.
            enabled: false // True or false to enable message spam.
        }
    };
    /*-                -*/

    function getRandomCategoryID() {
        return Math.floor(Math.random() * 14) + 1; // Generates a random number between 1 and 14
    }

    function sendRequest(url, method, body) {
        const token = document.querySelector('input[name="_token"]').value;
        const requestBody = new FormData();
        for (const key in body) {
            requestBody.append(key, body[key]);
        }
        requestBody.append('_token', token);

        return fetch(url, {
            method: method,
            body: requestBody
        });
    }

    function handleRequest(config, sendFunction) {
        if (!config.enabled) return;
        sendFunction();
        const nextExecution = Date.now() + config.interval * 1000;
        const delay = nextExecution - Date.now();
        setTimeout(() => handleRequest(config, sendFunction), delay);
    }

    function handlePostRequest() {
        let categoryID = config.post.randomCategory ? getRandomCategoryID() : config.post.categoryID;
        const url = `https://www.brick-hill.com/forum/${categoryID}/create`;
        const body = {
            title: config.post.title,
            body: config.post.body
        };
        sendRequest(url, 'POST', body);
    }

    function handleReplyRequest() {
        const url = `https://www.brick-hill.com/forum/reply/${config.reply.postID}`;
        const body = {
            body: config.reply.body
        };
        sendRequest(url, 'POST', body);
    }

    function handleCommentRequest() {
        const url = `https://www.brick-hill.com/comments/create`;
        const body = {
            comment: config.comment.comment,
            commentable_id: config.comment.commentable_id,
            polymorphic_type: config.comment.polymorphic_type
        };
        sendRequest(url, 'POST', body);
    }

    function handleMessageRequest() {
        const url = `https://www.brick-hill.com/messages`;
        const body = {
            title: config.message.title,
            recipient: config.message.recipient,
            reply: config.message.reply
        };
        sendRequest(url, 'POST', body);
    }

    handleRequest(config.post, handlePostRequest);
    handleRequest(config.reply, handleReplyRequest);
    handleRequest(config.comment, handleCommentRequest);
    handleRequest(config.message, handleMessageRequest);

})();