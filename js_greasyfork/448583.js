// ==UserScript==
// @name         SemenChecker
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Checks posts on unique ips.
// @author       You
// @match        https://2ch.hk/*/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ch.hk
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448583/SemenChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/448583/SemenChecker.meta.js
// ==/UserScript==

const MAX_ALLOWED_STORE_TIME_IN_DAYS = 2; // Через сколько дней (с последнего посещения определенного треда на момент активации скрипта) удалится информация о треде.
const HIGHLIGHT_COLOR = 'lightgreen'; // Цвет подсветки нового поста.

const url = document.baseURI.replace('.html', '.json');
const current_thread = document.baseURI.split('#')[0].split('/').slice(3).join('/');

let last_modified;
let initial_poster_count

let unhighlighted_ids = [];
let highlighted_ids = [];

(async () => {
    const initial_response = await fetch(url);
    const initial_json = await initial_response.json();
    last_modified = initial_response.headers.get('Last-Modified');
    initial_poster_count = +initial_json.unique_posters;
    main();
})();


async function parse_json(url) {
    const response = await fetch(url, {
        headers: {
            'If-Modified-Since': last_modified
        }
    });
    if (!response.ok) {
        return false;
    }
    last_modified = response.headers.get('Last-Modified')
    return await response.json();
}

function get_json(url) {
    parse_json(url).then(json => {
        if (!json) {return;}
        const last_post = +json.posts_count;
        unique_checker(
            {
                related_poster_count: +json.unique_posters,
                last_post_id: +json.threads[0].posts[last_post].num
            }
        );
    });
}

function get_int_daytime() {
    return new Date().getTime() / 1000 / 3600 / 24;
}

function unique_checker(poster) {
    if (poster.related_poster_count > initial_poster_count) {
        initial_poster_count = poster.related_poster_count;
        const last_element_id = 'post-' + poster.last_post_id;
        unhighlighted_ids.push(last_element_id);
    }
    //console.log('initial poster count = ' + initial_poster_count);
    //console.log('unhighlighted ids = ' + unhighlighted_ids.length);
    //console.log('GM:');
    //console.log(GM_getValue(current_thread));
}

function inner_highlighter() {
    const uids = [...unhighlighted_ids];
    if (!uids.length) {return;}
    for (let i = 0; i < uids.length; i++) {
        const unhighlighted_post = document.getElementById(unhighlighted_ids[0]);
        if (unhighlighted_post) {
            highlighted_ids.push(unhighlighted_ids.shift());
            highlight_element(unhighlighted_post);
        }
    }
    GM_setValue(current_thread, {
        ids: highlighted_ids,
        date: get_int_daytime()
    });
}

function outer_highlighter(mutationsList) {
    for (let mutation of mutationsList) {
        [...mutation.target.children].slice(-1).forEach((post) => {
            if (highlighted_ids.includes(post.id.replace('-body', ''))) {
                highlight_element(post);
            }
        });
    }
}

function highlight_element(post) {
    let identification_element = document.createElement('span');
    identification_element.style.color = HIGHLIGHT_COLOR;
    identification_element.innerHTML = '[NEW IP]';
    identification_element.className = "new_ip";
    let insert_area = post.getElementsByClassName("post__details")[0];
    if (insert_area.getElementsByClassName(identification_element.className)[0] === undefined) {
        insert_area.appendChild(identification_element);
    }
}

function on_load() {
    const stored_data = GM_getValue(current_thread);
    if (!stored_data) {return;}
    stored_data.ids.forEach((item) => {
        let element = document.getElementById(item);
        if (element) {
            highlight_element(element);
            highlighted_ids.push(item);
        }
    });
    GM_setValue(current_thread, {
        ids: highlighted_ids,
        date: get_int_daytime()
    });
}

function main() {
    'use strict';

    on_load();
    //console.log(GM_listValues());
    GM_listValues().forEach((item) => {
        const stored_data = GM_getValue(item);
        //console.log(stored_data);
        if (Math.abs(get_int_daytime() - stored_data.date) >= MAX_ALLOWED_STORE_TIME_IN_DAYS) {
            GM_deleteValue(item);
        }
    });

    const inner_post_area = document.getElementsByClassName('thread')[0];
    const inner_observer = new MutationObserver(inner_highlighter);
    inner_observer.observe(inner_post_area, {childList: true});

    const outer_post_area = inner_post_area.parentElement;
    const outer_observer = new MutationObserver(outer_highlighter);
    outer_observer.observe(outer_post_area, {childList: true});

    setInterval(() => {get_json(url)}, 500);
    document.getElementsByClassName('de-thr-updater')[0].addEventListener("click", inner_highlighter)
}