// ==UserScript==
// @name         smmo+
// @namespace    https://simple-mmo.com/
// @version      0.0.27
// @description  simple-mmo.com improvements
// @author       somebody
// @match        https://simple-mmo.com/*
// @match        http://simple-mmo.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/390293/smmo%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/390293/smmo%2B.meta.js
// ==/UserScript==

/* globals $, closeNav, openNav, inventoryFilter, marketFilter */
(function() {
    'use strict';

    function xhr(method, url, cb) {
        var req = new XMLHttpRequest();
        req.addEventListener('load', function () {
            let response = this.response;
            try {
                response = JSON.parse(response);
            } catch (e) {
            }
            cb(response);
        });
        req.open(method, url);
        req.send();
    }

    const IS_DARK_THEME = getComputedStyle(document.body).backgroundColor === 'rgb(51, 51, 51)';
    const JOB_GOLD_LOOKUP = {
        'Novice Blacksmith': 10,
        'Apprentice Blacksmith': 100,
        'Adept Blacksmith': 500,
        'Master Blacksmith': 1000,
        'Legendary Blacksmith': 2500,
        'Petty Crook': 30,
        'Pickpocket': 250,
        'Skilled Burglar': 650,
        'Master Thief': 1500,
        'Legendary Thief': 2750,
        'Couch Potato': 10,
        'Sandwich Artist': 100,
        'Finally a Chef': 500,
        'Master Chef': 1000,
        'Lord of the Fries': 2500,
        'Novice Guard': 10,
        'Apprentice Guard': 100,
        'Adept Guard': 500,
        'Master Guard': 1000,
        'Legendary Guard': 2500,
        'Novice Banker': 50,
        'Apprentice Banker': 325,
        'Adept Banker': 850,
        'Master Banker': 2300,
        'Legendary Banker': 3800,
    };

    let emojiHandle = setInterval(function () {
        if (!unsafeWindow.$) {
            return;
        }
        clearInterval(emojiHandle);
        unsafeWindow.jQuery = unsafeWindow.$;
        let emojiHandle2 = setInterval(function () {
            if (!unsafeWindow.jQuery) {
                return;
            }
            let emojioneAreaCss = document.createElement('link');
            emojioneAreaCss.rel = 'stylesheet';
            emojioneAreaCss.href = 'https://cdn.jsdelivr.net/gh/mervick/emojionearea@3.2.1/dist/emojionearea.min.css';
            document.head.appendChild(emojioneAreaCss);
            let emojioneAreaJs = document.createElement('script');
            emojioneAreaJs.src = 'https://cdn.jsdelivr.net/gh/mervick/emojionearea@3.2.1/dist/emojionearea.min.js';
            document.body.appendChild(emojioneAreaJs);
            clearInterval(emojiHandle2);
        }, 100);
        let emojiHandle3 = setInterval(function () {
            unsafeWindow.$('#chatText').emojioneArea({pickerPosition: 'top'});
            document.getElementById('chattextBtn').addEventListener('click', function () {
                setTimeout(function () {
                    document.getElementsByClassName('emojionearea-editor')[0].innerHTML = '';
                }, 100);
            });
            clearInterval(emojiHandle3);
        }, 100);
    }, 100);

    let sidenav = document.getElementById('mySidenav');
    document.getElementsByClassName('container-two')[0].appendChild(sidenav);

    function darkenedCss (clazz) {
        return `
.${clazz}::before {
    z-index: -1;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${document.getElementsByClassName(clazz)[0] ? getComputedStyle(document.getElementsByClassName(clazz)[0]).background : 'none'};
    filter: brightness(50%);
}

.${clazz} {
    background: none;
}
`;
    }

    if (IS_DARK_THEME) {
        document.querySelectorAll('span[style*="rgba(0,0,0,"]').forEach(function (e) { e.style.color = e.style.color.replace('(0, 0, 0, ', '(255, 255, 255, '); });
        document.querySelectorAll('img[src="/img/online.gif"]').forEach(function (e) { e.style.filter = 'invert(1)'; });
        let style = document.createElement('style');
        style.textContent = `\
${darkenedCss('travel')}
${darkenedCss('attackbg')}
${darkenedCss('surround')}

.progress-moved .progress-bar2 {
    background-color: #8d0c2a;
}

.demo-card-wide > .mdl-card__title {
    filter: brightness(50%);
}

.speech-bubble-you {
    color: #FFF;
}

.speech-bubble-them {
    color: #FFF;
    background: #121212;
}

.speech-bubble-them:after {
    border-right-color: #121212;
}

.speech-bubble {
    color: rgba(255, 255, 255, 0.6);
    background: #0f0f0f;
}

.speech-bubble:after {
    border-top-color: #0f0f0f;
}

.cta {
    color: rgb(255, 255, 255, 0.6);
    background-color: rgb(17, 17, 17);
}

.cta:hover, .cta:focus {
    color: rgb(255, 255, 255, 0.9);
}

h1, h2, h3, h4, h5, h6 {
    color: white;
}

#stepUsercountContainer > div {
    background: #0a0a0a !important;
    color: white !important;
}

.mdl-textfield__input::placeholder {
    color: rgba(255,255,255,0.4);
}

.mdl-textfield__input {
    color: rgba(255,255,255,0.7) !important;
}

.fab {
    color: rgba(255, 255, 255, 0.6);
    background: rgb(0, 0, 0);
}`;
        document.body.appendChild(style);
    }

    // sidebar
    let sidebarContainer = document.createElement('div'),
        sidebar = document.createElement('div');
    sidebarContainer.appendChild(sidebar);
    sidebar.id = 's-sidebar';
    let computed = getComputedStyle(document.getElementById('mySidenav'));
    sidebarContainer.style.flex = '0 0 0';
    sidebar.style.position = 'fixed';
    sidebar.style.height = '100%';
    sidebar.style.width = '0';
    sidebar.style.display = 'flex';
    sidebar.style.flexFlow = 'column nowrap';
    sidebar.style.overflowY = 'auto';
    sidebar.style.background = IS_DARK_THEME ? '#222' : '#DDD';
    for (let prop of ['transition', 'overflowX']) {
        sidebarContainer.style[prop] = sidebar.style[prop] = computed[prop];
    }

    let sidebarVisible = GM_getValue('sidebarVisible', false);

    function openSidebar(event) {
        if (sidebarVisible) {
            return;
        }
        GM_setValue('sidebarVisible', sidebarVisible = true);
        sidebarContainer.style.flex = '0 0 200px';
        sidebar.style.width = '200px';
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    function closeSidebar(event) {
        if (!sidebarVisible) {
            return;
        }
        GM_setValue('sidebarVisible', sidebarVisible = false);
        sidebarContainer.style.flex = '0 0 0';
        sidebar.style.width = '0';
    }

    if (sidebarVisible) {
        sidebarVisible = false;
        openSidebar();
    }

    let chatVisible = GM_getValue('chatVisible', false);

    let updateChatHandle;
    let messages = [];

    function closeChat(event) {
        if (!chatVisible) {
            return;
        }
        GM_setValue('chatVisible', chatVisible = false);
        sidenav.style.flex = '0 0 0';
        messages = [];
        clearInterval(updateChatHandle);
        unsafeWindow.closeNav();
    }

    function updateChatPerSecond() {
        let now = +new Date();
        if (messages.every(([_, time]) => now - time >= 60000)) {
            clearInterval(updateChatHandle);
            updateChatHandle = setInterval(function () {
                let now = +new Date();
                for (let [el, time] of messages) {
                    let mins = Math.floor((now - time) / 60000);
                    el.innerText = mins === 1 ? '1 minute ago' : mins + ' minutes ago';
                }
            }, 15000);
        }
        for (let [el, time] of messages) {
            let mins = Math.floor((now - time) / 60000);
            let secs = Math.floor((now - time) / 1000) % 60;
            el.innerText = mins === 0 ? secs === 1 ? '1 second ago' : secs + ' seconds ago' : mins === 1 ? '1 minute ago' : mins + ' minutes ago';
        }
    }

    function openChat(event) {
        if (chatVisible) {
            return;
        }
        GM_setValue('chatVisible', chatVisible = true);
        sidenav.style.flex = '0 0 30%';
        updateChatHandle = setInterval(updateChatPerSecond, 1000);
        unsafeWindow.openNav();
    }
    unsafeWindow.openChat = openChat;

    if (chatVisible) {
        chatVisible = false;
        let chatOpenHandle = setInterval(function () {
            if (!unsafeWindow.openNav || !unsafeWindow.startChatSSE) {
                return;
            }
            openChat();
            clearInterval(chatOpenHandle);
        }, 100);
    }

    let playerInfo = document.createElement('div');
    playerInfo.innerHTML = `\
<div style="padding:4px 8px;display:flex;flex-flow:row nowrap;align-items:center">
    <div style="padding:0 8px"><img id="s-avatar" src="/img/sprites/0.png"></div>
    <center style="width:100%">
        <a style="font-weight:bold;color:${IS_DARK_THEME ? 'white' : 'black'}" id="s-name" href="/me"></a><br />
        Level <span id="s-level"></span>
    </center>
    <span style="cursor:pointer;font-size:16pt" id="s-close">×</span>
</div>
<center style="padding:4px 8px">
    <img src="/img/icons/I_GoldCoin.png" height="15px"> <span id="s-gp">0</span> gold<br />
    Experience:<br />
    <span id="s-xp">0</span>/<span id="s-xpm">50</span>
    <div style="width:120px;height:8px;background:#111"><div id="s-xpb" style="width:0%;float:left;height:100%;background:#aaa"></div></div>
    Health:<br />
    <span id="s-hp">50</span>/<span id="s-hpm">50</span>
    <div style="width:120px;height:8px;background:#111"><div id="s-hpb" style="width:100%;float:left;height:100%;background:#aaa"></div></div>
    Energy:<br />
    <span id="s-ep">5</span>/<span id="s-epm">5</span>
    <div style="width:120px;height:8px;background:#111"><div id="s-epb" style="width:100%;float:left;height:100%;background:#aaa"></div></div>
    Steps:<br />
    <span id="s-sp">50</span>/<span id="s-spm">50</span>
    <div style="width:120px;height:8px;background:#111"><div id="s-spb" style="width:100%;float:left;height:100%;background:#aaa"></div></div>
    Quest Points:<br />
    <span id="s-qp">5</span>/<span id="s-qpm">5</span>
    <div style="width:120px;height:8px;background:#111"><div id="s-qpb" style="width:100%;float:left;height:100%;background:#aaa"></div></div>
    Job:<br />
    <span id="s-jt">0</span>/<span id="s-jtm">0</span> minutes
    <div style="width:120px;height:8px;background:#111"><div id="s-jtb" style="width:0%;float:left;height:100%;background:#aaa"></div></div>
</center>`;
    playerInfo.querySelector('#s-close').addEventListener('click', closeSidebar);

    sidebar.appendChild(playerInfo);

    for (let [name, path] of [
        ['Chat', 'javascript:openChat()'],
        ['Main Page', '/home'],
        ['Travel'],
        ['Town'],
        ['Battle Arena', '/npcs/viewall'],
        ['World Bosses'],
        ['Notifications', '/events'],
        ['Messages', '/messages/inbox'],
        ['Guilds', '/guilds/menu'],
        ['Jobs', '/jobs/viewall'],
        ['Quests', '/quests/viewall'],
        ['Tasks', '/tasks/viewall'],
        ['Character'],
        ['Inventory'],
        ['Leaderboards'],
        ['Community'],
        ['Friends'],
        ['Your Profile', '/me'],
        ['Preferences'],
        ['About'],
        ['Support'],
    ]) {
        let a = document.createElement('a');
        a.style.color = IS_DARK_THEME ? 'white' : 'black';
        a.style.fontSize = '12pt';
        a.style.fontWeight = 'bold';
        a.style.whiteSpace = 'nowrap';
        a.style.margin = '3px 12px';
        a.href = path || '/' + name.replace(/ /g, '').toLowerCase();
        a.innerText = name;
        sidebar.appendChild(a);
    }

    let main = document.getElementsByClassName('container-two')[0];
    main.style.flex = '1 0 0';
    main.parentNode.style.display = 'flex';
    main.parentNode.style.flexFlow = 'row nowrap';
    main.parentNode.insertBefore(sidebarContainer, main);

    document.addEventListener('contextmenu', openSidebar);

    // horizontal chat
    let style = document.createElement('style');
    style.textContent = `\
.loading {
    position: absolute;
    left: 50%;
    margin-left: -1em;
    top: 50%;
    margin-top: -1em;
}

.attackbg {
    position: relative;
}

.container {
    width: 100%;
}

.container-two {
    flex: 0 1 0;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
}

#s-main {
    display: flex;
    flex-flow: column nowrap;
}

#mySidenav {
    position: unset;
    flex: 0 0 0;
    width: 100% !important;
}

#chatload {
    width: 100%;
}

#chatArea tr {
    height: 0;
}

#chatArea tr:nth-child(even), #chatArea tr:nth-child(even):hover {
    background: #${IS_DARK_THEME ? '333' : 'EEE'} !important;
}

#chatArea th {
    white-space: nowrap !important;
    padding: 0 6px !important;
    position: unset !important;
    height: 0;
}

#chatArea th:nth-child(3) {
    white-space: normal !important;
}

.emojionearea .emojionearea-editor {
    min-height: 5vh;
}`;
    document.body.appendChild(style);
    let newMain = document.createElement('div');
    newMain.id = 's-main';
    newMain.style.flex = '1 0 0';
    main.parentNode.insertBefore(newMain, main);
    newMain.appendChild(main);

    let chatbox = document.getElementById('mySidenav');
    chatbox.style.display = 'flex';
    chatbox.style.flexFlow = 'column nowrap';
    document.getElementById('chatContainer').style.overflowY = 'scroll';
    let chatarea = document.getElementById('chatArea');
    let chatloadObserver = new MutationObserver(function () {
        let messageEls = [...chatarea.children].map(child => child.children[1]);
        for (let message of messageEls) {
            if (message.childNodes.length !== 6) {
                // already processed
                continue;
            }
            let date = +new Date();
            let dateText = message.childNodes[3].innerText;
            let dateMatch;
            if (dateMatch = dateText.match(/\d+(?= minutes? ago)/)) {
                date -= dateMatch[0] * 60000;
            } else if (dateMatch = dateText.match(/\d+(?= seconds? ago)/)) {
                date -= dateMatch[0] * 1000;
            }
            messages.push([message.childNodes[3], date]);
            let parent = message.parentNode;
            let th = document.createElement('th');
            th.appendChild(message.childNodes[5]);
            th.style.width = '0';
            th.style.wordBreak = 'break-word';
            parent.appendChild(th);
            th = document.createElement('th');
            th.appendChild(message.childNodes[3]);
            parent.appendChild(th);
            parent.children[0].style.display = 'none';
            message.removeChild(message.childNodes[2]);
            message.removeChild(message.childNodes[1]);
        }
        clearInterval(updateChatHandle);
        updateChatHandle = setInterval(updateChatPerSecond, 1000);
    });
    let closeButton = document.createElement('span');
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '16pt';
    closeButton.style.padding = '6px';
    closeButton.innerText = '×';
    closeButton.addEventListener('click', closeChat);
    let chatParent = document.getElementById('chatText').parentNode;
    chatParent.style.display = 'flex';
    chatParent.style.flexFlow = 'row nowrap';
    chatParent.style.alignItems = 'center';
    chatParent.appendChild(closeButton);
    chatloadObserver.observe(chatarea, {childList: true});
    let sidenavObserver = new MutationObserver(function () {
        if (chatVisible && sidenav.style.width === '0px') {
            unsafeWindow.openNav();
        }
    });
    sidenavObserver.observe(sidenav, {attributes: true});
    newMain.appendChild(chatbox);

    function commas(n) {
        return (n + '').split('').reverse().join('').replace(/\d{3}(?!$)/g, '$&,').split('').reverse().join('');
    }

    // get player data
    let maxSteps = 50;
    [...sidebar.children].filter(e=>e.innerText === 'Messages')[0].id = 's-messages';
    [...sidebar.children].filter(e=>e.innerText === 'Notifications')[0].id = 's-notifications';
    function refreshSidebar() {
        xhr('get', '/mobapi', function (data) {
            document.getElementById('s-avatar').src = document.getElementById('s-avatar').src.replace(/[^/]+(?=\.png)/, data.avatar);
            document.getElementById('s-name').innerText = data.username;
            document.getElementById('s-level').innerText = data.level;
            document.getElementById('s-gp').innerText = commas(data.gold);
            document.getElementById('s-xp').innerText = data.exp;
            document.getElementById('s-xpm').innerText = data.max_exp;
            document.getElementById('s-xpb').style.width = data.exp_percent + '%';
            document.getElementById('s-hp').innerText = data.current_hp;
            document.getElementById('s-hpm').innerText = data.max_hp;
            document.getElementById('s-hpb').style.width = data.hp_percent + '%';
            document.getElementById('s-ep').innerText = data.energy;
            document.getElementById('s-epm').innerText = data.max_energy;
            document.getElementById('s-epb').style.width = data.energy_percent + '%';
            document.getElementById('s-sp').innerText = data.stepsleft;
            document.getElementById('s-spm').innerText = maxSteps = data.maxsteps;
            document.getElementById('s-spb').style.width = Math.round(100 * data.stepsleft / data.maxsteps) + '%';
            document.getElementById('s-messages').innerText = data.messages ? `Messages (${data.messages})` : 'Messages';
            document.getElementById('s-notifications').innerText = data.events ? `Notifications (${data.events})` : 'Notifications';
        });
    }

    refreshSidebar();
    setInterval(refreshSidebar, 10000);

    // quest points aren't in mobapi. sad
    let qp = 0,
        maxQp = 5,
        lastQpUpdate = 0,
        updateQpHandle = 0;
    function updateQp(newQp, increment=true) {
        clearTimeout(updateQpHandle);
        let qpUpdate = +new Date();
        if (newQp === undefined) {
            newQp = qp;
        }
        if (increment && newQp < maxQp && Math.floor(lastQpUpdate / 600000) !== Math.floor(qpUpdate / 600000)) {
            newQp++;
        }
        lastQpUpdate = qpUpdate;
        if (qp !== newQp) {
            refreshSidebar();
            document.getElementById('s-qp').innerText = newQp;
            document.getElementById('s-qpb').style.width = Math.round(100 * newQp / maxQp) + '%';
            qp = newQp;
        }
        updateQpHandle = setTimeout(updateQp, Math.max((600000 - qpUpdate % 600000) / 2, 1000));
    }
    xhr('get', '/quests/viewall', function (html) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        qp = +doc.getElementById('questPoints').innerText;
        maxQp = +doc.getElementById('questPoints').parentNode.parentNode.nextElementSibling.children[1].innerText.match(/\d+/)[0];
        document.getElementById('s-qp').innerText = qp;
        document.getElementById('s-qpm').innerText = maxQp;
        document.getElementById('s-qpb').style.width = Math.round(100 * qp / maxQp) + '%';
        updateQp(qp, false);
    });

    // keyboard shortcuts
    let chattext = document.getElementById('chatText');
    let send = document.getElementById('chattextBtn');
    document.addEventListener('keydown', function (event) {
        // TODO: more precise input checks
        if (document.activeElement.classList.contains('emojionearea-editor') && event.key === 'Enter' && event.ctrlKey) {
            chattext.value = chattext.emojioneArea.getText();
            send.click();
        }
        if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT' || document.activeElement.classList.contains('emojionearea-editor')) {
            return;
        }
        switch (event.key) {
            case 't':
                if (chatbox.style.width === '0px') {
                    openChat();
                } else {
                    closeChat();
                }
                break;
            case 's':
                if (sidebarVisible) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
                break;
            case 'f':
                if (event.ctrlKey) {
                    if (!window.__cfRLUnblockHandlers) return false;
                    if (location.href.includes('/inventory')) {
                        inventoryFilter();
                        event.preventDefault();
                        event.stopPropagation();
                    } else if (location.href.includes('/market')) {
                        marketFilter();
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
                break;
        }
    });

    // updates jobs
    let jobFinish = 0,
        jobStart = 0;
    xhr('get', '/jobs/viewall', function (html) {
        // may not have job running
        try {
            let minutesLeft = +html.match(/(\d+)(?= minutes\.)/)[0],
                jobName = html.match(/[^>]+(?=<\/strong>)/)[0],
                gold = +html.match(/[\d,]+(?=\s*<img src="\/img\/icons\/S_Light01)/)[0].replace(/,/g, ''),
                nJobs = gold / JOB_GOLD_LOOKUP[jobName];
            document.getElementById('s-jtm').innerText = nJobs * 10;
            jobFinish = (+new Date()) + minutesLeft * 60000;
            jobStart = jobFinish - nJobs * 600000;
            let current = document.getElementById('s-jt'),
                bar = document.getElementById('s-jtb'),
                handle = 0;
            let update = function () {
                let mins = Math.min(nJobs * 10, Math.floor(((+new Date()) - jobStart) / 60000));
                current.innerText = mins;
                let percent = 10 * mins / nJobs;
                bar.style.width = percent + '%';
                if (percent === 100) {
                    clearInterval(handle);
                }
            }
            update();
            handle = setInterval(update, 10000);
            if (location.href.includes('/jobs/view')) {
                // might not have job running
                let minsNode = [...document.getElementsByTagName('strong')].find(el => el.innerText.includes('currently')).nextSibling.nextSibling;
                setInterval(function () {
                    minsNode.nodeValue = minsNode.nodeValue.replace(/\d+/, Math.ceil((jobFinish - new Date()) / 60000));
                    if (jobFinish - new Date() < 0) {
                        location.href += '';
                    }
                }, 10000);
            }
        } catch (e) {}
    });

    // monitor changes
    if (location.href.includes('/travel')) {
        document.getElementById('travel').style.position = 'relative';
        document.getElementById('travel').parentNode.style.height = '100%';

        let stepCounter = document.getElementById('s-sp');
        let stepBar = document.getElementById('s-spb');
        let stepObserver = new MutationObserver(function () {
            let steps = +document.getElementById('stepsleft').innerText;
            stepCounter.innerText = steps;
            stepBar.style.width = Math.round(100 * steps / maxSteps) + '%';
        });
        stepObserver.observe(document.getElementById('stepsleft'), {childList: true});
    }

    if (location.href.includes('/quests/viewall')) {
        let questObserver = new MutationObserver(function () {
            updateQp(qp - 1);
        });
        questObserver.observe(document.getElementById('questPoints'), {childList: true});
    }

    // refresh energy
    if (location.href.includes('/npcs/attack')) {
        document.getElementsByClassName('attackbg')[0].style.width = 'auto';
        let handler = setInterval(function () {
            let attackNPC = eval('(' + (unsafeWindow.attackNPC + '').replace('function (data) {',`\
function (data) {
        refreshSidebar();
`) + ')');
            document.getElementById('attackButton').onclick = attackNPC;
            clearInterval(handler);
        }, 1000);
    }

    // return to travel on step npc's
    if (location.href.includes('/npcs/attack') && (+location.href.match(/\d+$/)[0]) > 284206 /* if it's less old than Ben Dover, the latest arena enemy */) {
        let npcSwalObserver = new MutationObserver(function () {
            document.getElementsByClassName('swal2-confirm')[0].addEventListener('click', function () {
                setTimeout(function () {
                    location.href = '/travel';
                }, 1000);
            });
        });
        npcSwalObserver.observe(document.body, {attributes: true});
        //document.body
    }

    // fix swal placeholders
    let swalObserver = new MutationObserver(function () {
        document.querySelectorAll('label.mdl-textfield__label').forEach(function (e) {
            e.previousElementSibling.placeholder = e.innerText;
            e.parentNode.removeChild(e);
        });
    });
    swalObserver.observe(document.body, {attributes: true});

    // fix dark mode
    if (IS_DARK_THEME && location.href.includes('/userlist/all')) {
        // TODO: auto quit modal
        let modal = document.getElementsByClassName('mdl-dialog')[0];
        modal.style.background = '#333';
        modal.style.color = 'white';
        modal.children[2].children[0].style.color = 'white';
        modal.children[2].children[1].style.color = 'white';
    }
})();