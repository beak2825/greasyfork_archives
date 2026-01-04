// ==UserScript==
// @name         Follow friends' ratings
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Easily check your friends' movie ratings without any hassle
// @author       amarsik1
// @match        https://www.youtube.com/*
// @match        https://www.imdb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503018/Follow%20friends%27%20ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/503018/Follow%20friends%27%20ratings.meta.js
// ==/UserScript==

//         CONSTANTS BEGIN
const MY_FOLLOWINGS_LS_KEY = 'my_followings_list';
const FOLLOW_BTN_CLASS_LIST = ['ipc-btn', 'ipc-btn--half-padding', 'ipc-btn--center-align-conten', 'ipc-btn--default-height', 'ipc-btn--core-accent2', 'ipc-btn--theme-baseAlt', 'imdb-header__app-button'];

//         CONSTANTS ENDED


function log(...rest) {return console.log(...rest)}

function _getPersistedQuery() {
    return {
        version: 1,
        sha256Hash: '9672397d6bf156302f8f61e7ede2750222bd2689e65e21cfedc5abd5ca0f4aea'
    }
}

async function apiRequest(body, method = "GET") {
    const extensions = { persistedQuery: _getPersistedQuery() };

    const res = await fetch("https://api.graphql.imdb.com/", {
        "headers": {
            "accept": "application/graphql+json, application/json",
            "content-type": "application/json",
        },
        "body": JSON.stringify({ ...body, extensions }),
        "method": method,
    });

    return res.json();
}

async function getUserTitleRating (titleId, userId) {
    const res = await apiRequest({
        operationName: "UserRatingsAndWatchOptions",
        variables: {
            idArray: [titleId],
            otherUserId: userId,
            fetchOtherUserRating: true,
            includeUserRating: false,
        }
    }, "POST");

    return res.data.titles[0];
}

function getAppInfo () {
    const info = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
    return info;
}

function getMyUserId () {
    const appInfo = getAppInfo();

    return appInfo.props.pageProps.requestContext.sidecar.account.userId;
}

function USER_MAIN_unfollowUser ({ target }) {
    const data = getMyFollowings();
    const { userId } = target.dataset;

    const filtered = data.filter((i) => i.userId!== userId);

    setMyFollowings(filtered);

    target.remove();

    USER_MAIN_addButton({
        userId,
        label: 'Follow',
        onClick: USER_MAIN_followUser,
    });
}

function USER_MAIN_followUser ({ target }) {
    const data = getMyFollowings();
    const avatarUrl = document.querySelector('img#avatar').currentSrc;
    const username = document.querySelector('#avatar-frame+h1').innerText;

    data.push({
        userId: target.dataset.userId,
        avatarUrl,
        username,
    });

    setMyFollowings(data)

    target.remove();

    USER_MAIN_addButton({
        userId: target.dataset.userId,
        label: 'Unfollow',
        onClick: USER_MAIN_unfollowUser,
    });
}

function USER_MAIN_addButton ({ label, onClick, userId }) {
    const parent = document.querySelector('div#main div.header');
    const button = document.createElement('button');

    button.innerText = label;
    button.addEventListener('click', onClick);
    button.dataset.userId = userId;

    FOLLOW_BTN_CLASS_LIST.forEach((cl) => button.classList.add(cl));

    parent.append(button);
}

function setMyFollowings (data) {
    localStorage.setItem(MY_FOLLOWINGS_LS_KEY, JSON.stringify(data));
}

function getMyFollowings () {
    const data = localStorage.getItem(MY_FOLLOWINGS_LS_KEY);

    if (!data) {
        localStorage.setItem(MY_FOLLOWINGS_LS_KEY, []);
        return [];
    }

    return JSON.parse(data);
}

function _getHTMLFollowingListItem (item) {
    return `<a href="/user/${item.userId}"><img src="${item.avatarUrl}" style="width: 50px; border-radius: 50%; margin-right: 10px;" /><span style="font-size:20px">${item.username}</span></a>`;
}

function renderFollowingListBlock(list) {
    if (!list.length) return;

    const parentEl = document.querySelector('#sidebar');
    if (!parentEl.firstChild.nextElementSibling) return;

    const html = `<div class="aux-content-widget-2"><h3>Followings</h3>${list.map(_getHTMLFollowingListItem)}</div>`;

    const newElement = document.createElement('div');
    newElement.innerHTML = html;
    parentEl.insertBefore(newElement, parentEl.firstChild);
}

function USER_MAIN ({ userId }) {
    const myId = window.IMDbReactInitialState[0].user.id;
    const isThisMyPage = userId === myId;

    const myFollowingsList = getMyFollowings();

    const inFollowings = myFollowingsList.some((i) => i.userId === userId);

    if (isThisMyPage) {
        renderFollowingListBlock(myFollowingsList);

        return;
    }



    if (inFollowings) {
        USER_MAIN_addButton({
            userId,
            label: 'Unfollow',
            onClick: USER_MAIN_unfollowUser,
        });
    } else {
        USER_MAIN_addButton({
            userId,
            label: 'Follow',
            onClick: USER_MAIN_followUser,
        });
    }
}

function _generateFollowingRatingElement({ username, value, avatarUrl, userId }) {
    const wrapper = document.querySelector('[data-testid=hero-rating-bar__aggregate-rating]');
    const [title, button] = wrapper.children;
    const icon = button.querySelector('.ipc-icon');
    const mobileWrapper = button.querySelector('.ipc-btn__text>div');
    const scoreWrapper = wrapper.querySelector('[data-testid=hero-rating-bar__aggregate-rating__score]');

    return `<div class="${wrapper.className}"><div class="${title.className}">${username.toUpperCase()} RATING</div><a href="/user/${userId}" class="${button.className}"><div class="${mobileWrapper.className}" style="gap:5px"><div class="sc-acdbf0f3-4 jIEDat"><img width="100%" height="100%" class="${icon.className.baseVal}" src="${avatarUrl}" style="border-radius: 50%; margin-right: 5px; max-width:${icon.scrollWidth}px"/></div><div class="sc-4f0b1185-0 bjCZfn"><div data-testid="hero-rating-bar__user-rating__score" class="${scoreWrapper.className}"><span class="${scoreWrapper.firstChild.className}">${value}</span>/10</div></div></div></a></div>`;
}

function addFollowingRatingIntoDOM(value) {

    const [desktopEl, mobileEl] = document.querySelectorAll('div[data-testid=hero-rating-bar__aggregate-rating]');

    const elValue = _generateFollowingRatingElement(value);

    const newElementDesktop = document.createElement('div');
    newElementDesktop.innerHTML = elValue;

    const newElementMobile = document.createElement('div');
    newElementMobile.innerHTML = elValue;

    // Append the new desktop element to the parent of the desktopEl
    desktopEl.parentElement.append(newElementDesktop.firstChild);

    // Append the new mobile element to the parent of the mobileEl
    mobileEl.parentElement.append(newElementMobile.firstChild);

}

async function TITLE_showFollowingRating (titleId) {
    const list = getMyFollowings();
    const promises = list.map((user) => getUserTitleRating(titleId, user.userId));

    const res = await Promise.all(promises);

    res.forEach((item, index) => {
        if (!item.otherUserRating) return;

        addFollowingRatingIntoDOM({
            ...list[index],
            value: item.otherUserRating.value,
        });
    });
}

function TITLE_MAIN (titleId) {

    TITLE_showFollowingRating(titleId);

}

(function() {
    'use strict';

    // hide sponsor videos on YT
    const css = '#contents ytd-rich-item-renderer:has(.badge-style-type-members-only) {display: none}';
    document.head.appendChild(document.createElement("style")).innerText = css
    // end



    const [page1, id, page2] = location.pathname.slice(1).split('/');

    switch(page1) {
        case 'user': {
            USER_MAIN({ userId: id });
            break;
        }
        case 'title': {
            TITLE_MAIN(id);
            break;
        }

        default: break;

    }

})();