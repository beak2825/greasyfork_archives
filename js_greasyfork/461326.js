// ==UserScript==
// @name         Bilibili Commnter Fetcher
// @namespace    https://scripts.lirc572.com/
// @version      0.1.1
// @description  fetch commenters for an opus (wth is that)
// @author       lirc572
// @match        https://www.bilibili.com/opus/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461326/Bilibili%20Commnter%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/461326/Bilibili%20Commnter%20Fetcher.meta.js
// ==/UserScript==

/**
 * Make delayInms larger if you encounter 412 errors
 */
/* https://stackoverflow.com/a/49813472 */
const delay = (delayInms = 800) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

function getCookie() {
    return document.cookie.split(';').map(x => x.trim().split('=')).reduce((m, x) => { m.set(x[0], x[1]); return m; }, new Map());
}

function getCsrfToken() {
    return getCookie().get('bili_jct');
}

async function getParams() {
    const pageUrl = window.location.href;
    const html = await fetch(pageUrl).then(res => res.text());
    const startIndex = html.indexOf('window.__INITIAL_STATE__=');
    const endIndex = html.indexOf(';', startIndex);
    const initialStateString = html.substring(startIndex + 'window.__INITIAL_STATE__='.length, endIndex);
    const initialState = JSON.parse(initialStateString);

    const oid = initialState.detail.basic.comment_id_str;
    const type = initialState.detail.basic.comment_type; // 11
    return { oid, type };
}

async function isFollowing(mid) {
    const res = await fetch(`https://api.bilibili.com/x/web-interface/card?mid=${mid}`);
    const json = await res.json();
    await delay();
    return json.data.following;
}

async function getComments(next = 0) {
    const results = [];
    let count = 0;
    const csrfToken = getCsrfToken();
    const { oid, type } = await getParams();
    for (; ;) {
        try {
            /**
             * `mode=3` and `plat=1` are magic numbers I don't understand...
             * If the values here don't work, try to find them in the network tab of your browser
             * by putting `/main` in the filter before checking the parameters in the request URL
             */
            const res = await fetch(`https://api.bilibili.com/x/v2/reply/main?csrf=${csrfToken}&mode=3&next=${next}&oid=${oid}&plat=1&type=${type}`);
            const json = await res.json();
            const data = json.data;
            const {
                replies, // array of replies
            } = data;
            for (const reply of replies) {
                const {
                    ctime, // UNIX timestamp of comment time
                    content, // comment content
                    member, // user info
                } = reply;
                const {
                    message, // comment message
                } = content;
                const {
                    is_contractor, // ?
                    is_senior_member, // da-member
                    mid, // user id
                    sex, // gender
                    uname, // username
                } = member;
                const is_following = await isFollowing(mid);
                results.push({
                    mid,
                    uname,
                    is_following,
                    sex,
                    is_contractor,
                    is_senior_member,
                    ctime,
                    message,
                });
                count++;
                console.log(`Fetched comment ${count}`);
            }
            if (data.cursor.is_end) {
                break;
            }
            console.log(`Fetched comments for page ${next}!`);
            next = data.cursor.next;
        } catch (e) {
            console.error(`Error while fetching comments for page ${next}:`, e);
            throw new Error(`Error while fetching comments for page ${next}:`, e);
        }
    }
    return results;
}

/* https://stackoverflow.com/a/18197341 */
function downloadTextFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function downloadAsJson(comments, filename) {
    downloadTextFile(filename, JSON.stringify(comments, null, 4));
}

/* Not completed, need to escape characters */
function downloadAsCsv(comments, filename) {
    const csvHeader = [
        'mid',
        'uname',
        'is_following',
        'sex',
        'is_contractor',
        'is_senior_member',
        'ctime',
        'message',
    ].join(',');
    const csvContent = comments.map(x => {
        const {
            mid,
            uname,
            is_following,
            sex,
            is_contractor,
            is_senior_member,
            ctime,
            message,
        } = x;
        return [
            mid,
            uname,
            is_following,
            sex,
            is_contractor,
            is_senior_member,
            ctime,
            message,
        ].join(',');
    }).join('\n');
    downloadTextFile(filename, csvHeader + '\n' + csvContent);
}

(function () {
    window.addEventListener('load', function () {
        const btnNode = document.createElement('button');
        btnNode.setAttribute('id', 'bcf-download-btn');
        btnNode.innerHTML = 'BCF Download';
        document.body.appendChild(btnNode);
        document.getElementById('bcf-download-btn').addEventListener(
            'click',
            () => {
                document.getElementById('bcf-download-btn').disabled = true;
                getComments().then(comments => {
                    downloadAsJson(comments, 'comments.json');
                    // downloadAsCsv(comments, 'comments.csv');
                    document.getElementById('bcf-download-btn').disabled = false;
                });
            },
            false,
        );
    });
})();

GM_addStyle(`
    #bcf-download-btn {
        position: fixed;
        top: 4rem;
        right: 0;
    }
`);
