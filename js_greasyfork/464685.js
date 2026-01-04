// ==UserScript==
// @name         Skeb Pricing Manager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Store and display skeb's price 
// @author       /skeb/ anon
// @match        https://*.skeb.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skeb.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464685/Skeb%20Pricing%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/464685/Skeb%20Pricing%20Manager.meta.js
// ==/UserScript==


(function () {
    'use strict';

    //////////////////////////////////////////////////////
    //////////// CONSTANT AND UTILITIES
    //////////////////////////////////////////////////////

    const LOCALSTORAGE_KEY = 'ext_skeb_price'
    const LOCALSTORAGE_FC = 'ext_skeb_following_creators'

    const ignores = ['works', 'followings', 'lookup', 'following_creators']
    const worksUrl = ['https://skeb.jp/api/works', 'following_works']

    function pick(object, keys) {
        const result = {};

        for (const key of keys) {
            if (key in object) {
                result[key] = object[key];
            }
        }

        return result;
    }

    function getCreatorTableBodyElement() {
        const tables = document.getElementsByClassName('table is-fullwidth is-narrow')

        if (tables.length === 0) return null
        const table = tables.item(0)

        if (table.length === 0) return null
        return table.children.item(0);
    }

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    function extractSearchParams(urlString) {
        const url = new URL(urlString);
        const searchParams = url.searchParams;
        const paramsObject = {};
        for (const [key, value] of searchParams) {
            paramsObject[key] = value;
        }
        return paramsObject;
    }

    function createMap(keyName, items) {
        const map = {};
        items.forEach((item) => {
            const key = map[item[keyName]];
            if (!key) {
                map[item[keyName]] = item;
            }
        });
        return map;
    }

    function renderTimeDuration(durationInSeconds) {
        const days = Math.floor(durationInSeconds / 86400);
        const hours = Math.floor((durationInSeconds % 86400) / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;

        return `${days} day(s) ${hours}h${minutes}m${seconds}s`;
    }

    async function waitRandomTime(min, max) {
        const waitTime = Math.floor(Math.random() * (max - min + 1) + min);
        const randomMs = Math.floor(Math.random() * 1000);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000 + randomMs));
    }

    //////////////////////////////////////////////////////
    //////////// MAIN
    //////////////////////////////////////////////////////


    function logNetworkRequests() {
        const originalOpen = window.XMLHttpRequest.prototype.open;
        const originalSend = window.XMLHttpRequest.prototype.send;

        window.XMLHttpRequest.prototype.open = function (method, url) {
            this._url = url;
            return originalOpen.apply(this, arguments);
        };

        window.XMLHttpRequest.prototype.send = function (body) {
            this.addEventListener('load', () => {

                //////////////////////////////////////////////////////
                //////////// HANDLE REQUEST FROM CREATOR PAGE
                //////////////////////////////////////////////////////
                if (this._url.includes(`https://skeb.jp/api/users/`) && !ignores.some(ignore => this._url.includes(ignore))) {

                    //////////////////////////////////////////////////////
                    //////////// SAVE PRICE TO LOCAL STORAGE
                    //////////////////////////////////////////////////////

                    let savedPrices = {};
                    let creatorData = {};

                    try {
                        creatorData = JSON.parse(this.responseText) || {};
                    } catch { }

                    try {
                        savedPrices = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || {};
                    } catch { }

                    if (creatorData && creatorData.id) {
                        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({
                            ...savedPrices,
                            [creatorData.id]: pick(creatorData, ['id', 'name', 'skills', 'complete_rate', 'complete_expiration_days', 'completing_average_time'])
                        }))
                    }



                    //////////////////////////////////////////////////////
                    //////////// RENDER PRICE IF CLOSED
                    //////////////////////////////////////////////////////

                    if (creatorData.acceptable === false) {
                        setTimeout(() => {
                            const tableBody = getCreatorTableBodyElement()

                            if (tableBody) {
                                for (const skill of (creatorData.skills || []).reverse()) {
                                    /// Genre
                                    const tr1 = document.createElement('tr');
                                    tr1.className = 'join-with-next-row'

                                    const td1 = document.createElement('td');
                                    const small1 = document.createElement('small');

                                    const td2 = document.createElement('td');
                                    const small2 = document.createElement('small');

                                    small1.innerText = 'Genre';
                                    small2.innerText = skill.genre === 'correction' ? 'Advice' : capitalizeFirstLetter(skill.genre);
                                    td1.appendChild(small1);
                                    td2.appendChild(small2);

                                    tr1.appendChild(td1);
                                    tr1.appendChild(td2);



                                    /// Price
                                    const tr2 = document.createElement('tr');

                                    const td3 = document.createElement('td');
                                    const small3 = document.createElement('small');

                                    const td4 = document.createElement('td');
                                    const small4 = document.createElement('small');

                                    small3.innerText = 'Previous amount';
                                    small4.innerText = skill.default_amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
                                    td3.appendChild(small3);
                                    td4.appendChild(small4);

                                    tr2.appendChild(td3);
                                    tr2.appendChild(td4);

                                    tableBody.insertBefore(tr2, tableBody.firstChild);
                                    tableBody.insertBefore(tr1, tableBody.firstChild);
                                }
                            }
                        }, 1000)
                    }
                }

                //////////////////////////////////////////////////////
                //////////// HANDLE REQUEST FROM WORKS LIST
                //////////////////////////////////////////////////////
                else if (worksUrl.some(url => this._url.includes(url))) {
                    const searchParams = extractSearchParams(this._url)
                    const { genre } = searchParams
                    try {
                        const data = JSON.parse(this.responseText)
                        const pathMap = createMap('path', data)
                        const localStorageData = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || {}

                        setTimeout(() => {

                            for (const path of Object.keys(pathMap)) {
                                const anchors = document.querySelectorAll(`a[href$="${path}"]`);
                                for (const anchor of anchors) {

                                    const isAlreadyRendered = Boolean(anchor.querySelector(`.ext-price-container`));
                                    if (isAlreadyRendered) continue;

                                    const pathData = pathMap[path]
                                    if (!pathData || !anchor) continue;

                                    const savedData = localStorageData[pathData.creator_id]
                                    if (!savedData) continue;

                                    const card = anchor.firstChild

                                    const container = document.createElement('div');
                                    container.className = 'ext-price-container'
                                    container.style = `
                                        position: absolute;
                                        bottom: 0px;
                                        left: 0px;
                                        right: 0px;
                                        z-index: 2;
                                        text-align: center;
                                        background: rgb(0, 0, 0, 0.6);
                                        color: white;
                                        transition: all 0.5s;`

                                    anchor.onmouseover = function () {
                                        container.style.display = 'none';
                                    };
                                    anchor.onmouseout = function () {
                                        container.style.display = 'block';
                                    };


                                    const title = document.createElement('p');
                                    title.style = `
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                    `
                                    title.innerText = savedData.name;
                                    container.appendChild(title);


                                    const priceData = savedData.skills.find(skill => skill.genre === genre) || savedData.skills[0]
                                    const price = document.createElement('p');
                                    price.style = `
                                        font-size: 0.8em;
                                    `
                                    price.innerText = priceData?.default_amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }) || `(unavailable)`;
                                    container.appendChild(price);


                                    const completion = document.createElement('p');
                                    completion.style = `
                                        font-size: 0.7em;

                                    `
                                    completion.innerText = `Deadline: ${savedData.complete_expiration_days} days ${!!savedData.complete_rate ? `(${savedData.complete_rate * 100}%)` : `(No data)`}`
                                    container.appendChild(completion);


                                    if (savedData.completing_average_time) {
                                        const avgCompletion = document.createElement('p');
                                        avgCompletion.style = `
                                            font-size: 0.65em;
                                        `
                                        avgCompletion.innerText = `Average Complete: ${renderTimeDuration(savedData.completing_average_time)}`
                                        container.appendChild(avgCompletion);
                                    }

                                    card.appendChild(container);
                                }
                            }
                        }, 2000)
                    } catch (err) {
                        console.error(err)
                    }
                }

                //////////////////////////////////////////////////////
                //////////// SAVE FOLLOWING CREATORS
                //////////////////////////////////////////////////////
                else if (this._url.includes('/following_creators') && this._url.includes('https://skeb.jp/api/users/')) {
                    let data = [];
                    let followingCreators = []
                    try {
                        data = JSON.parse(this.responseText)
                        followingCreators = JSON.parse(localStorage.getItem(LOCALSTORAGE_FC) || '[]') || [];
                    } catch { }

                    if (data && data.length > 0) {
                        localStorage.setItem(LOCALSTORAGE_FC, JSON.stringify([
                            ...followingCreators,
                            ...data.map(item => item.screen_name)
                        ].filter((value, index, self) => {
                            return self.indexOf(value) === index;
                        })))
                    }
                }
            });

            return originalSend.apply(this, arguments);
        };
    }

    const fetchFollowingCreatorData = async (creator) => {
        return new Promise((resolve, reject) => {
            const url = 'https://skeb.jp/api/users/' + creator;
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.open('GET', url);

            xhr.setRequestHeader("Authorization", `Bearer ${localStorage.token}`);
            xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
            xhr.setRequestHeader("Referer", "");

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data);
                } else {
                    reject(xhr.statusText);
                }
            };

            xhr.onerror = () => {
                reject('Network Error');
            };

            xhr.send();
        });
    };

    async function updateFollowingCreatorsPrice() {
        let followingCreators = []
        let removingError = []
        let i = 0
        try {
            followingCreators = JSON.parse(localStorage.getItem(LOCALSTORAGE_FC) || '[]') || [];
        } catch { }
        if (followingCreators.length === 0) {
            alert('There is no data, please go to Following Creators and scroll to the bottom to populate the data. After that, try again')
        } else {
            followingCreators = shuffleArray(followingCreators)

            /// await in for statement so it doesn't spam and make your account ban + random sleep time for less chance being ban
            for (const creator of followingCreators) {
                try {
                    await fetchFollowingCreatorData(creator)
                }
                catch {
                    console.error('Failed: ', creator)
                    removingError.push(creator)
                }

                if (i % 10) await waitRandomTime(2, 5) /// rest time
                await waitRandomTime(0, 1)
                i++
            }
            alert('Finished!!')
        }

        if (followingCreators.length > 0 && removingError.length > 0) {
            localStorage.setItem(LOCALSTORAGE_FC, JSON.stringify(followingCreators.filter((value, index, self) => {
                return self.indexOf(value) === index && !removingError.includes(value);
            })))
        }
    }

    function renderSpecialButton() {
        setTimeout(() => {
            const nav = document.querySelectorAll('div.navbar-dropdown.is-right').item(1)

            const button = document.createElement('button');
            button.className = 'button is-primary is-fullwidth is-medium'
            button.style = "font-size: 1em; margin: 10px; width: fit-content"
            button.onclick = updateFollowingCreatorsPrice
            button.innerText = "Update following creators' price"

            nav.insertBefore(button, nav.firstChild);

        }, 1000)

    }

    logNetworkRequests();
    renderSpecialButton();
})();