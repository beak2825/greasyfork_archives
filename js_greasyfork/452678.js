// ==UserScript==
// @name        Mattermost - anti revoke.
// @description Anti revokes messages in Mattermost.
// @namespace   Violentmonkey Scripts
// @match       http://localhost:8065/*
// @inject-into page
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @version     1.0
// @author      -
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452678/Mattermost%20-%20anti%20revoke.user.js
// @updateURL https://update.greasyfork.org/scripts/452678/Mattermost%20-%20anti%20revoke.meta.js
// ==/UserScript==

'use strict';

const BASE_URL = new URL('http://localhost:8065');  // Change this locally!.
const myDeletedMessages = new Set();

function getDeletedPosts(channelId) {
    return GM_getValue(channelId, []);
}

function storePost(post) {
    const posts = getDeletedPosts(post.channel_id);
    posts.push(post);
    GM_setValue(post.channel_id, posts);
}


unsafeWindow.clearDeletedPosts = function () {
    GM_listValues().forEach((key) => {
        GM_deleteValue(key);
    });
}

function getReduxState() {
    let reactRoot = document.getElementById('root')?._reactRootContainer?._internalRoot?.current;
    if (!reactRoot) {
        console.error('[!] Could not get internal root information from reactRoot element');
        return;
    }

    while (reactRoot) {
        const reduxState = reactRoot?.pendingProps?.store?.getState();
        if (reduxState) {
            return reduxState;
        }
        reactRoot = reactRoot.child;
    }
    console.error('[!] Could not find redux state');
}

function getUserById(userId) {
    const reduxState = getReduxState();
    const profiles = reduxState?.entities?.users?.profiles;
    return profiles[userId]?.username || userId;
}

function getPostInfo(postId) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", `${BASE_URL.origin}/api/v4/posts/ids`, false);
    httpRequest.setRequestHeader("x-requested-with", "XMLHttpRequest");
    httpRequest.send(JSON.stringify([postId]));
    if (httpRequest.status !== 200) {
        return;
    }
    return JSON.parse(httpRequest.response)[0];
}

function onMessageHook(evt, originalOnMessage) {
    if (!evt) {
        return;
    }

    const msg = JSON.parse(evt.data);
    if (!msg.event || msg.event !== "post_deleted") {
        return originalOnMessage(evt);
    }

    const post = JSON.parse(msg.data.post);
    if (myDeletedMessages.has(post.id)) {
        myDeletedMessages.delete(post.id);
        return originalOnMessage(evt);
    }

    console.log('[*] Message deleted!')
    const now = new Date().getTime();
    const deletedBy = msg.data?.delete_by || getPostInfo(post.id)?.props?.deleteBy;
    msg.event = "post_edited";
    post.update_at = now;
    post.edit_at = now;
    post.type = "system_ephemeral";
    post.message += ` - [sent by @${getUserById(post.user_id)}]` +
        (deletedBy ? ` - [deleted by @${getUserById(deletedBy)}]` : '')  // delete_by field is sent only to admin users.
    delete msg.data.delete_by;
    msg.data.post = JSON.stringify(post);
    storePost(post);
    return originalOnMessage(Object.assign({ data: JSON.stringify(msg) }, evt));
}

function hookWebsocket() {
    const { get: onmessageGet, set: onmessageSet } = Object.getOwnPropertyDescriptor(WebSocket.prototype, 'onmessage');
    Object.defineProperty(WebSocket.prototype, 'onmessage', {
        get() { return onmessageGet.apply(this); },
        set(...args) {
            if (args.length < 0 || typeof args[0] !== 'function') {
                return onmessageSet.apply(this, args);
            }

            console.log('[*] Hooking websocket!')
            const onMessageHandler = args[0];
            args[0] = (evt) => onMessageHook(evt, onMessageHandler);
            return onmessageSet.apply(this, args);
        }
    });
}

function onFetchPostsRequestHook(url, data) {
    const channelDeletedPosts = getDeletedPosts((url.pathname.match(/\/channels\/(\w*)\//) || [])[1]);
    if (!channelDeletedPosts.length) {
        return data;
    }

    let added = 0;
    data.order = data.order.reverse();  // Reversing the order to make the code simpler.
    const newOrder = [...data.order];

    for (let i = 0; i < data.order.length; i++) {
        const currPost = data.posts[data.order[i]];
        const nextPost = i + 1 >= data.order.length ? { create_at: Number.MAX_SAFE_INTEGER } : data.posts[data.order[i + 1]];
        channelDeletedPosts.filter(post => {
            return post.create_at >= currPost.create_at && post.create_at < nextPost.create_at;
        })
            .sort((post1, post2) => post1.create_at - post2.create_at)
            .forEach((post) => {
                if (!data.posts.hasOwnProperty(post.id)) {
                    newOrder.splice(i + added + 1, 0, post.id);
                    added++;
                }
                data.posts[post.id] = post;
            });
    }
    data.order = newOrder.reverse();
    return data;
}

function hookFetchRequests() {
    const { fetch: originalFetch } = unsafeWindow;
    unsafeWindow.fetch = async (url, options) => {
        try {
            url = new URL(url);
        } catch (_) {
            return await originalFetch(url, options);
        }

        if (url.origin !== BASE_URL.origin || !new RegExp(/\/posts(?:[\/]\w+)?$/).test(url.pathname)) {
            return await originalFetch(url, options);
        }

        if (options.method === 'delete') {
            myDeletedMessages.add(url.pathname.slice(url.pathname.lastIndexOf('/') + 1));
        }

        const response = await originalFetch(url, options);
        response.json = options.method === 'get' ? () =>
            response
                .clone()
                .json()
                .then((data) => onFetchPostsRequestHook(url, data))
                .catch((error) => console.error(error))
            : response.json;
        return response;
    };

}

hookFetchRequests();
hookWebsocket();
