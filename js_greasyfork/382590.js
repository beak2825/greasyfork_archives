// ==UserScript==
// @name         Twitch chat block utility
// @namespace    https://avaglir.com
// @version      0.1
// @description  better experience for blocking users in twitch chat
// @author       Nathan Perry <avaglir@gmail.com>
// @match        https://www.twitch.tv/*
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/382590/Twitch%20chat%20block%20utility.user.js
// @updateURL https://update.greasyfork.org/scripts/382590/Twitch%20chat%20block%20utility.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const clientId = 'jzkbprff40iqj646a697cyrvl0zt2m6';

    const tokenPair = document.cookie.split('; ')
        .map(elt => {
            const parts = elt.split('=');

            const fst = parts.shift();
            const snd = parts.join('=');

            return [fst, snd];
        })
        .find(elt => elt[0] === 'auth-token');

    let oAuthToken;
    if (tokenPair === null) {
        console.error('User not signed into Twitch; ignores will not work');
        oAuthToken = null;
    } else {
        oAuthToken = tokenPair[1];
    }

    const nthParent = (elt, n) => {
        if (n === 0 || !elt) return elt;
        return nthParent(elt.parentElement, n - 1);
    };

    const flatten = ary => ary.reduce((acc, x) => acc.concat(x), []);

    const query = `mutation BlockUser($input: BlockUserInput!) { blockUser(input: $input) { targetUser { id } } }`;

    const blockTwitchUser = async (username) => {
        if (!oAuthToken) throw new Error('couldn\'t block user -- not signed in to twitch');

        const baseUrl = new URL('https://api.twitch.tv/helix/users');
        baseUrl.searchParams.append('login', username);

        const idResp = await fetch(baseUrl, {
            headers: {
                "client-id": clientId,
            },
        });

        const userId = (await idResp.json()).data[0].id;

        await fetch("https://gql.twitch.tv/gql", {
            method: "POST",
            headers: {
                "client-id": clientId,
                "Authorization": `OAuth ${oAuthToken}`,
                "content-type": "application/json",
            },
            body: JSON.stringify([{
                query: query,
                operationName: 'BlockUser',
                variables: {
                    input: {
                        sourceContext: 'CHAT',
                        reason: 'none',
                        targetUserID: userId,
                    }
                },
            }]),
        });
    };

    const blockedResp = await fetch('https://gql.twitch.tv/gql', {
        method: 'POST',
        headers: {
            'client-id': clientId,
            'Authorization': `OAuth ${oAuthToken}`,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            query: 'query { currentUser { blockedUsers { login } } }',
        }),
    });

    const json = await blockedResp.json();
    const blockedUsersAry = json.data.currentUser.blockedUsers.map(user => user.login).filter(user => user !== null).map(user => user.toLowerCase());
    const blockedUsers = new Set(blockedUsersAry);

    console.info(`downloaded ${blockedUsers.size} blocked users`);

    const mutObs = new MutationObserver(records => {
        records.filter(rec => rec.addedNodes.length > 0 && Array.from(rec.addedNodes).every(node => node.matches('.chat-line__message')))
            .forEach(rec => {
                const newNodes = Array.from(rec.addedNodes);

                // block user on ctrl-click
                newNodes.map(node => node.querySelector('span.chat-author__display-name'))
                    .forEach(usernameNode => {
                        const username = usernameNode.innerText;

                        if (blockedUsers.has(username.toLowerCase())) {
                            nthParent(usernameNode, 3).style.display = 'none';
                            console.debug(`blocked message from user '${username}'`);
                            return;
                        }

                        nthParent(usernameNode, 2).addEventListener('click', (evt) => {
                            if (evt.button !== 0 || !evt.ctrlKey) return;
                            evt.stopPropagation();

                            blockedUsers.add(username.toLowerCase());

                            blockTwitchUser(username)
                                .catch(err => console.error(`error blocking specified user: ${err}`))
                                .then(() => {
                                    console.info(`user '${username}' blocked`);
                                    usernameNode.style.color = '#ff0000';

                                    const span = document.createElement('span');
                                    span.innerText = ' (BLOCKED)';

                                    nthParent(usernameNode, 3).insertBefore(span, nthParent(usernameNode, 2).nextSibling);
                                });
                        });
                    });
            });
    });

    const registerObserver = () => {
        const handle = setInterval(() => {
            const logElem = document.querySelector('[role=log]');

            if (!logElem) return;
            clearInterval(handle);

            mutObs.observe(logElem, { childList: true });
        }, 50);

        return () => {
            clearInterval(handle);
        };
    };

    let cleanup = registerObserver();

    let curLocation = window.location.href;
    setInterval(() => {
        if (window.location.href === curLocation) return;

        console.debug('detected navigation');

        curLocation = window.location.href;

        cleanup();
        mutObs.disconnect();
        cleanup = registerObserver();
    }, 100);
})();
