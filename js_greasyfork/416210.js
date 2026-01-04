// ==UserScript==
// @name         Connpass nnap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1. 昨日以前のイベント背景を暗くする．2. ランキングページなどで参加済みイベントでタグを描画．
// @author       kimitsu
// @match        https://connpass.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416210/Connpass%20nnap.user.js
// @updateURL https://update.greasyfork.org/scripts/416210/Connpass%20nnap.meta.js
// ==/UserScript==

function getDate() {
    let dt = new Date();
    let yyyy = dt.getFullYear();
    let mm = ("00" + (dt.getMonth()+1)).slice(-2);
    let dd = ("00" + dt.getDate()).slice(-2);
    return `${yyyy}/${mm}/${dd}`;
}

function darkenOldEvent() {
    let eventLists = document.getElementsByClassName('event_list');
    let today = getDate()
    for (let elm of eventLists) {
        let schedule = elm.children[0].children;
        let date = `${schedule[0].innerText}/${schedule[1].innerText}`;
        if (date < today) elm.style.backgroundColor = '#e0e0e0';
    }
}

async function getEventURLs(username, owner) {
    let url = `https://connpass.com/api/v1/event/?${owner ? 'owner_' : ''}nickname=${username}&order=2&count=100`;
    let eventURLs = [];
    await fetch(url)
    .then(function(data) {
        return data.json();
    }).then(function(json) {
        for (let event of json.events) {
            eventURLs.push(event.event_url);
        }
    });
    return eventURLs;
}

function createNewTag(owner) {
    let newtag = document.createElement('p');
    newtag.className = `label_status_tag ${owner ? 'owner' : 'join'}`;
    newtag.innerText = owner ? '主催' : '参加';
    return newtag;
}

function getEventList(path) {
    if (path === 'user' || path === 'upcoming_events') {
        return document.getElementsByClassName('event_list');
    } else if (path === 'ranking') {
        return document.getElementsByClassName('ranking_event_list');
    } else if (path === 'explore') {
        return document.getElementsByClassName('recent_event_list');
    }
}

function findParent(elm, path) {
    if (path === 'user') {
        return elm.children[1].children[1];
    } else if (path === 'explore' || path === 'ranking') {
        return elm.children[0];
    } else if (path === 'upcoming_events') {
        return elm.children[1].children[0];
    }
}

function getTitle(parent) {
    for (let e of parent.children) {
        if (e.className === 'event_title') {
            return e;
        }
    }
}

async function addParticipationTag(username, path, owner) {
    // 参加イベントのURL
    let eventURLs = await getEventURLs(username, owner);

    // userの参加イベントに参加ステータスを追加
    let eventList = getEventList(path);
    for (let elm of eventList) {
        let parent = findParent(elm, path);

        let title = getTitle(parent);

        if (eventURLs.indexOf(title.children[0].href) !== -1) {
            let newtag = createNewTag(owner);
            if (path === 'user') {
                elm.children[1].children[0].appendChild(newtag);
            } else {
                let pos = parent.childElementCount - 2;
                parent.children[pos].appendChild(newtag);
            }
        }
    }
}

(async function() {
    'use strict';

    let paths = location.pathname.split('/');

    if (paths[1] === 'user') {
        darkenOldEvent();
    }

    let username = document.getElementsByClassName('username image_link')[0].children[0].title;
    if ((paths[1] === 'user' &&　paths[2] !== username) || ['explore', 'upcoming_events', 'ranking'].indexOf(paths[1]) !== -1) {
        addParticipationTag(username, paths[1], true);
        addParticipationTag(username, paths[1], false);
    }
})();