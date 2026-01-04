// ==UserScript==
// @name         Dibs
// @namespace    https://tornicorn.rocks/
// @version      0.8.1
// @description  Claim dibs in territory wars to avoid wasting E
// @author       sullengenie [1946152], Kessica [440210]
// @run-at       document-start
// @match        https://www.torn.com/factions.php?step=your
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      tornicorn.rocks
// @downloadURL https://update.greasyfork.org/scripts/406427/Dibs.user.js
// @updateURL https://update.greasyfork.org/scripts/406427/Dibs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const joinTimestamps = {};
    const dibsCalls = {};
    const currentDibs = {};

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    }

    const getRequesterId = () => {
        let storedId = GM_getValue('requesterId');
        if (storedId === undefined) {
            storedId = uuidv4();
            GM_setValue('requesterId', storedId);
        }
        return storedId;
    };

    const requesterId = getRequesterId();

    const createHtml = (html) => document.createRange().createContextualFragment(html);
    const insertBefore = (nodes, target) => {
        target.parentNode.insertBefore(nodes, target);
        return target.previousSibling;
    };
    const hide = (element) => { element.style.display = 'none'; };
    const show = (element) => { element.style.display = 'inline'; };

    const getPlayerIdFromRow = (rowNode) => {
        let nameButton = rowNode.querySelector('a.name');
        return parseInt(nameButton.getAttribute('href').split('=', 2)[1]);
    };

    const clearCurrentDibs = () => {
        delete currentDibs.id;
        if (currentDibs.timeoutId) {
            clearInterval(currentDibs.timeoutId);
            delete currentDibs.timeoutId;
        }
    };

    const showAttackButton = (attackButton, dibsButton) => {
        show(attackButton);
        hide(dibsButton);
    };

    const hideAttackButton = (attackButton, dibsButton) => {
        hide(attackButton);
        show(dibsButton);
    };

    const dibsSuccess = (dibsCalls, id) => {
        if (currentDibs.id) {
            hide(dibsCalls[currentDibs.id].attackButton);
            show(dibsCalls[currentDibs.id].dibsButton);
            clearCurrentDibs();
        }
        currentDibs.id = id;
        show(dibsCalls[id].attackButton);
        hide(dibsCalls[id].dibsButton);
        let timeoutId = setTimeout(() => {
            hide(dibsCalls[id].attackButton);
            show(dibsCalls[id].dibsButton);
            clearCurrentDibs();
        }, 30000);
        currentDibs.timeoutId = timeoutId;
    };

    const createDibsFragment = () => {
        let dibsFragment = createHtml(`<a class="c-pointer">Dibs!</a>`);
        return dibsFragment;
    };

    const createCountdownFragment = (timer) => {
        return createHtml(`<span style="color: #666; display: none">${timer}</span>`);
    };

    const addCountdownFragment = (countdownFragment, dibsButton) => {
        return insertBefore(countdownFragment, dibsButton);
    };

    const replaceWithDibsButton = (attackButton, id) => {
        let dibsFragment = createDibsFragment();
        let dibsButton = insertBefore(dibsFragment, attackButton);
        dibsButton.addEventListener('click', () => {
            let joinTimestamp = joinTimestamps[id];
            console.debug('Clicked on enemy with id ' + id + ' and timestamp ' + joinTimestamp);

            let start = Date.now();
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://tornicorn.rocks/dibs?target-id=${id}&timestamp=${joinTimestamp}&user-id=${requesterId}`,
                timeout: 5000,
                onload: (response) => {
                    if (response.status === 200) {
                        dibsSuccess(dibsCalls, id);
                        console.debug('Lock acquired', Date.now() - start);
                    } else if (response.status === 400) {
                        setDibsTimer(dibsCalls, id);
                    } else {
                        console.error('Unexpected response', response);
                    }
                }
            });
        });
        hide(attackButton);
        return dibsButton;
    };

    const clearDibsTimer = (dibsCalls, id) => {
        clearInterval(dibsCalls[id].intervalId);
        if (dibsCalls[id].countdownNode) {
            hide(dibsCalls[id].countdownNode);
        }
        if (dibsCalls[id].dibsButton) {
            show(dibsCalls[id].dibsButton);
        }
        delete dibsCalls[id].intervalId;
        delete dibsCalls[id].timer;
    };

    const rejectionMessage = 'Nope!';

    const updateDibsTimer = (dibsCalls, id) => {
        let secsRemaining = dibsCalls[id].timer;
        if (secsRemaining <= 1) {
            clearDibsTimer(dibsCalls, id);
        } else if (secsRemaining >= 1) {
            dibsCalls[id].timer -= 1;
            if (dibsCalls[id].countdownNode) {
                dibsCalls[id].countdownNode.innerText = (secsRemaining > 25 ? rejectionMessage : secsRemaining - 1);
            }
        } else {
            console.error('Unexpected dibs state');
            console.error(dibsCalls);
        }
    };

    const startCountdown = (dibsCalls, id) => {
        const dibs = dibsCalls[id];
        dibs.countdownNode.innerText = rejectionMessage;
        show(dibs.countdownNode);
        hide(dibs.dibsButton);
        dibs.intervalId = setInterval(() => updateDibsTimer(dibsCalls, id), 1000);
    };

    const setDibsTimer = (dibsCalls, id) => {
        dibsCalls[id].timer = 30;
        startCountdown(dibsCalls, id);
    };

    const resumeDibsTimer = (dibsCalls, id) => {
        startCountdown(dibsCalls, id);
    };

    const handleAddedEnemy = (rowNode) => {
        let attackButton = rowNode.querySelector('.attack a');
        let id = getPlayerIdFromRow(rowNode);
        let dibsButton = replaceWithDibsButton(attackButton, id);
        let countdownNode = addCountdownFragment(createCountdownFragment(30), dibsButton);
        // Clear old timer updater if it exists
        if (dibsCalls[id] && dibsCalls[id].intervalId) {
            clearInterval(dibsCalls[id].intervalId);
        }
        let {timer,joinTimestamp} = dibsCalls[id] || {};
        dibsCalls[id] = {attackButton, dibsButton, countdownNode, joinTimestamp: joinTimestamps[id]};
        if (timer && joinTimestamp === joinTimestamps[id]) {
            // If someone else still has dibs
            dibsCalls[id].timer = timer;
            resumeDibsTimer(dibsCalls, id);
        } else if (currentDibs[id] === id) {
            // If we have dibs
            hide(dibsButton);
            show(attackButton);
        }
    };

    const handleRemovedEnemy = (rowNode) => {
        // NOTE: We do not remove timer or joinTimestamp so they persist for
        // when this tab is reopened
        let attackButton = rowNode.querySelector('.attack a');
        let id = getPlayerIdFromRow(rowNode);
        delete dibsCalls[id].attackButton;
        delete dibsCalls[id].dibsButton;
        delete dibsCalls[id].countdownNode;
        if (dibsCalls[id].intervalId) {
            clearInterval(dibsCalls[id].intervalId);
        }
        if (currentDibs.id === id) {
            clearCurrentDibs();
        }
    };

    const waitForPageLoad = () => {
        return new Promise(function(resolve, reject) {
            console.debug('Waiting for page load');
            let target = document.getElementById('war-react-root').firstChild;
            console.debug(target);
            console.debug(target.childNodes.length);
            if (document.querySelector('.f-war-list')) {
                resolve(true);
            }
            let observer = new MutationObserver(function(mutations) {
                for (let mutation of mutations) {
                    console.debug(mutation);
                    if (mutation.addedNodes.length > 0) {
                        resolve(true);
                        return;
                    }
                }
            });
            observer.observe(target, {childList: true});
        });
    };

    const watchMembersList = (memberList) => {
        let observer = new MutationObserver(function(mutations) {
            for (let mutation of mutations) {
                console.debug('Member mutation');
                console.debug(mutation);
                for (let node of mutation.addedNodes) {
                    if (node.classList.contains('enemy')) {
                        console.debug('New enemy spotted!');
                        console.debug(node);
                        handleAddedEnemy(node);
                        // let attackButton = node.querySelector('.attack a');
                        // let nameButton = node.querySelector('a.name');
                        // let id = parseInt(nameButton.getAttribute('href').split('=', 2)[1]);
                        // let dibsButton = replaceWithDibsButton(attackButton, id, joinTimestamps[id]);
                        // console.debug('Enemy id: ' + id);
                    }
                }
                for (let node of mutation.removedNodes) {
                    if (node.classList.contains('enemy')) {
                        console.debug('Enemy off the wall!');
                        console.debug(node);
                        handleRemovedEnemy(node);
                        // let nameButton = node.querySelector('a.name');
                        // let id = parseInt(nameButton.getAttribute('href').split('=', 2)[1]);
                        // console.debug('Enemy id: ' + id);
                    }
                }
            }
        });
        observer.observe(memberList, {childList: true});
    };

    const waitForDescriptionLoad = () => {
        return new Promise(function(resolve, reject) {
            let target = document.querySelector('.desc-wrap');
            console.debug(target);
            console.debug('War list');
            console.debug(document.querySelector('.war-list'));
            console.debug('Descriptions');
            console.debug(document.querySelector('.desc-wrap'));
            console.debug('Faction war');
            console.debug(document.querySelector('.faction-war'));
            const factionWar = document.querySelector('.faction-war');
            if (factionWar) {
                console.debug('Faction war found!');
                console.debug(factionWar.querySelector('.members-list'));
                watchMembersList(factionWar.querySelector('.members-list'));
                for (let enemyNode of factionWar.querySelectorAll('.members-list .enemy:not(.row-animation-new)')) {
                    console.debug('Enemy on the wall!', enemyNode);
                    handleAddedEnemy(enemyNode);
                    // let attackButton = enemyNode.querySelector('.attack a');
                    // let nameButton = enemyNode.querySelector('a.name');
                    // let id = parseInt(nameButton.getAttribute('href').split('=', 2)[1]);
                    // let dibsButton = replaceWithDibsButton(attackButton, id, joinTimestamps[id]);
                    // console.debug('Group enemy id: ' + id);
                }
            }
            let observer = new MutationObserver(function(mutations) {
                for (let mutation of mutations) {
                    console.debug('Description load mutation');
                    console.debug(mutation);
                    for (let node of mutation.addedNodes) {
                        console.debug(node);
                        if (node.classList.contains('faction-war')) {
                            console.debug('Faction war!');
                            console.debug(node.querySelector('.members-list'));
                            watchMembersList(node.querySelector('.members-list'));
                            for (let enemyNode of node.querySelectorAll('.members-list .enemy:not(.row-animation-new)')) {
                                console.debug('Enemy on the wall!', enemyNode);
                                handleAddedEnemy(enemyNode);
                                // let attackButton = enemyNode.querySelector('.attack a');
                                // let nameButton = enemyNode.querySelector('a.name');
                                // let id = parseInt(nameButton.getAttribute('href').split('=', 2)[1]);
                                // let dibsButton = replaceWithDibsButton(attackButton, id, joinTimestamps[id]);
                                // console.debug('Group enemy id: ' + id);
                            }
                        }
                    }
                    for (let node of mutation.removedNodes) {
                        console.debug(node);
                        if (node.classList.contains('faction-war')) {
                            console.debug('Faction war!');
                            console.debug(node.querySelector('.members-list'));
                            for (let enemyNode of node.querySelectorAll('.members-list .enemy:not(.row-animation-new)')) {
                                console.debug('Enemy on the wall!', enemyNode);
                                handleRemovedEnemy(enemyNode);
                            }
                        }
                    }
                }
            });
            observer.observe(target, {childList: true});
        });
    };

    const watchForDescriptionChanges = () => {
        console.debug('Watching for description changes');
        let warList = document.querySelector('.f-war-list');
        console.debug(warList);
        let observer = new MutationObserver(function(mutations) {
            for (let mutation of mutations) {
                console.debug('Description change');
                console.debug(mutation);
                for (let node of mutation.addedNodes) {
                    if (node.classList.contains('descriptions')) {
                        waitForDescriptionLoad();
                    }
                }
            }
        });
        observer.observe(warList, {childList: true});
    };

    const noop = () => {};

    const customFetch = (fetch, {
        onrequest = noop,
        onresponse = noop,
        onresult = noop,
        onbody = [],
    }) => async (input, init) => {
        onrequest(input, init);
        const response = await fetch(input, init);
        onresponse(response);

        for (const handler of onbody) {
            if (handler.match(response)) {
                Promise.resolve(handler.execute(response.clone()))
                    .then((result) => onresult(result));
            }
        }

        return response;
    };

    const interceptFetch = (options) => (unsafeWindow.fetch = customFetch(fetch, options));

    // usage

    interceptFetch({
        //onrequest: (input, init) => console.debug('FETCH CALL', input, init),
        //onresponse: (response) => console.debug('FETCH RESPONSE', response),

        onbody: [{
            match: (response) => response.url.startsWith('https://www.torn.com/faction_wars.php'),
            execute: (response) => response.json().then((json) => {
                if (json.warDesc && json.warDesc.members) {
                    for (let member of json.warDesc.members) {
                        if (member !== 0) {
                            joinTimestamps[member.userID] = member.joinTimestamp;
                        }
                    }
                }
            })
        }],
    });

    var pollId;
    pollId = setInterval(() => {
        console.debug('polling');
        if (document && document.getElementById('war-react-root') && document.getElementById('war-react-root').firstChild !== null) {
            console.debug('done polling');
            console.debug(document.getElementById('war-react-root').firstChild);
            clearInterval(pollId);
            waitForPageLoad().then(() => {
                watchForDescriptionChanges();
                console.debug('Moving along');
                console.debug(document.querySelector('.desc-wrap'));
                if (document.querySelector('.desc-wrap') !== null) {
                    waitForDescriptionLoad().then(() => console.debug('Description Loaded!'));
                }
            });
        }
    }, 100);
})();