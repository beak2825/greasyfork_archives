// ==UserScript==
// @name         Darflen Notification Selector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows you to select which notifications you want in Darflen.
// @author       DaGreenBoi
// @match        https://darflen.com/*
// @icon         https://static.darflen.com/img/favicons/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499911/Darflen%20Notification%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/499911/Darflen%20Notification%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.pathname == "/notifications" || window.location.pathname == "/notifications/") {
        const container = document.createElement('div');
        const actions = ['Post', 'Comment', 'Repost', 'Reply', 'Love', 'Follow'];

        function parseBoolean(str) {
            if (str === "true") {
                return true;
            } else if (str === "false") {
                return false;
            } else {
                return true;
            }
        }

        let post = parseBoolean(localStorage.getItem(actions[0]));
        let comment = parseBoolean(localStorage.getItem(actions[1]));
        let repost = parseBoolean(localStorage.getItem(actions[2]));
        let reply = parseBoolean(localStorage.getItem(actions[3]));
        let love = parseBoolean(localStorage.getItem(actions[4]));
        let follow = parseBoolean(localStorage.getItem(actions[5]));

        for (let no of document.getElementsByClassName("notification")) {
            let n = no.getElementsByClassName("notification-text")[0];
            no.style.display = "block";
            let text = n.textContent.toString();
            let isPost = (text.endsWith("shared a new post.") && !post) ||
                (text.endsWith("shared a new comment in post.") && !comment) ||
                (text.endsWith("shared a new repost.") && !repost) ||
                (text.endsWith("shared a new reply in comment.") && !reply) ||
                ((text.endsWith("loved your post.") || text.endsWith("loved your comment.") || text.endsWith("loved your reply.")) && !love) ||
                (text.endsWith("followed you.") && !follow);

            if (isPost) {
                no.style.display = "none";
            }
        }

        actions.forEach(action => {
            const div = document.createElement('div');
            div.style.display = 'block';
            div.style.marginBottom = '5px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.style.marginRight = '5px';
            checkbox.style.height = '25px';
            checkbox.style.width = '25px';
            checkbox.style.cursor = 'pointer';
            if (action == actions[0]) {
                checkbox.checked = post;
            } else if (action == actions[1]) {
                checkbox.checked = comment;
            } else if (action == actions[2]) {
                checkbox.checked = repost;
            } else if (action == actions[3]) {
                checkbox.checked = reply;
            } else if (action == actions[4]) {
                checkbox.checked = love;
            } else if (action == actions[5]) {
                checkbox.checked = follow;
            }
            checkbox.addEventListener("change", () => {
                if (action == actions[0]) {
                    post = checkbox.checked;
                } else if (action == actions[1]) {
                    comment = checkbox.checked;
                } else if (action == actions[2]) {
                    repost = checkbox.checked;
                } else if (action == actions[3]) {
                    reply = checkbox.checked;
                } else if (action == actions[4]) {
                    love = checkbox.checked;
                } else if (action == actions[5]) {
                    follow = checkbox.checked;
                }
                localStorage.setItem(action,checkbox.checked.toString());
                for (let no of document.getElementsByClassName("notification")) {
                    let n = no.getElementsByClassName("notification-text")[0];
                    no.style.display = "block";
                    let text = n.textContent.toString();
                    let isPost = (text.endsWith("shared a new post.") && !post) ||
                        (text.endsWith("shared a new comment in post.") && !comment) ||
                        (text.endsWith("shared a new repost.") && !repost) ||
                        (text.endsWith("shared a new reply in comment.") && !reply) ||
                        ((text.endsWith("loved your post.") || text.endsWith("loved your comment.") || text.endsWith("loved your reply.")) && !love) ||
                        (text.endsWith("followed you.") && !follow);

                    if (isPost) {
                        no.style.display = "none";
                    }
                }
            });

            const span = document.createElement('span');
            span.textContent = action;

            div.appendChild(checkbox);
            div.appendChild(span);
            container.appendChild(div);
        });

        document.getElementById("content").insertBefore(container, document.getElementById("notifications"));
    }
})();