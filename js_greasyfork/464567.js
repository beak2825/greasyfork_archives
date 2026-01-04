// ==UserScript==
// @name        ehentai tag translator
// @namespace   Violentmonkey Scripts
// @match       https://exhentai.org/*
// @exclude-match https://exhentai.org/s/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.1
// @author      -
// @description hover tag, show translation
// @downloadURL https://update.greasyfork.org/scripts/464567/ehentai%20tag%20translator.user.js
// @updateURL https://update.greasyfork.org/scripts/464567/ehentai%20tag%20translator.meta.js
// ==/UserScript==

/**
 * find node
 * if have node, define translation, css
 * add translation div
 */

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

main();

function fetch2(detail) {
    return new Promise((resolve, reject) => {
        detail.onload = resolve;
        detail.onerror = reject;
        GM_xmlhttpRequest(detail);
    });
}

async function updateDB(db) {
    console.info('[ehentai_tag_translator] updating translation database.');
    const DBversion = 6;
    const dbUrl = 'https://github.com/EhTagTranslation/Database/releases/latest/download/db.text.json';
    const remoteDB = await fetch2({ url: dbUrl, method: 'GET' }).then(rsp => JSON.parse(rsp.responseText)).catch(err => alert('failed to download tag database from github'));
    if (remoteDB.version !== DBversion) {
        // database changelog: https://github.com/EhTagTranslation/Database/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93%E7%BB%93%E6%9E%84%E7%89%88%E6%9C%AC%E4%BF%A1%E6%81%AF
        alert('EhTag Database version changed, please update script');
        return;
    }
    if (remoteDB.head.sha === db.sha) {
        return;
    }

    db.sha = remoteDB.head.sha;
    db.data = {};
    for (let data of remoteDB.data) {
        const key = data.namespace;
        db.data[key] = {};
        for (let subKey in data.data) {
            // needs name translation only
            const value = data.data[subKey]['name'];
            if (subKey !== value) {
                // ignore invalid translation
                db.data[key][subKey] = value;
            }
        }
    }
    console.info('[ehentai_tag_translator] translation database updated.');
    return db;
}

async function loadDB() {
    let db = GM_getValue('db', {});
    // update database after 7 days
    const expiration = 7 * 24 * 60 * 60 * 1000;
    if (db.lastUpdate === undefined) {
        db.lastUpdate = 0; // needs update
    }
    const expired = Date.now() - db.lastUpdate > expiration ? true : false;
    if (expired) {
        db = await updateDB(db);
        db.lastUpdate = Date.now();
        GM_setValue('db', db);
    }
    // console.log(db);
    return db;
}

function translateTagEl(el, translation) {
    const translationEl = document.createElement('div');
    translationEl.classList.add('eh-tag-translation');
    translationEl.innerText = translation;
    el.append(translationEl);
}

async function main() {
    let tagEls = $$('div[class^="gt"]');

    if (tagEls.length > 0) {
        // load db only if needs translation
        const db = await loadDB();
        const css = `
             .eh-tag-translation{
                 display:none;
                 position: absolute;
                 top: 20px;
                 left: 0;
                 z-index: 999;
                 background: #5f636b;
                 padding: 5px;
                 width: max-content;
                 max-width: 300px;
                 border-radius: 2px;
                 box-shadow: 1px 1px 2px 0 #0005;
                 transition-duration: 1000ms;
             }
             /*show translation in list page*/
             .gl3c > a > div{
                 overflow: inherit!important;
             }
             div.gt,
             div.gtl{
                 opacity: 1!important;
             }
             div.gt:hover .eh-tag-translation,
             div.gtl:hover .eh-tag-translation{
                 display: block;
             }
             .eh-tag-translation::before {
                 border: 5px solid transparent;
                 border-bottom-color: transparent;
                 border-bottom-color: #5f636b;
                 content: '';
                 top: -10px;
                 width: 0;
                 height: 0;
                 position: absolute;
             }
         `;
        GM_addStyle(css);
        for (let el of tagEls) {
            let arr;
            if (el.id === 'ehv-panel-btn') {
                continue;
            } else if (el.id !== '') {
                arr = el.id.replace('td_', '').split(':');
            } else if (el.title !== '') {
                arr = el.title.split(':');
            } else {
                console.log('tag not found in element', el);
                continue;
            }
            if (arr.length === 2) {
                const key = arr[0];
                const subKey = arr[1].replace('_', ' ');
                if(db.data[key]){
                    const translation = db.data[key][subKey];
                    if (translation) {
                        translateTagEl(el, translation);
                    } else {
                        console.log('[ehentai_tag_translator] translation not found:', { key, subKey });
                    }
                }else{
                    console.log('[ehentai_tag_translator] unknown tag type: ', key);
                }
            } else {
                console.log('[ehentai_tag_translator] unknown attribute:', arr);
            }
        }
    }
}