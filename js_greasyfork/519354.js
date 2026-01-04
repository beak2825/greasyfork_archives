// ==UserScript==
// @name         qBittorrent utils
// @namespace    http://tampermonkey.net/
// @version      2024-11-30
// @description  some qBittorrent utils
// @author       lorentz
// @license      GPL-3.0 License
// @match        http://localhost:8080/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.198
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/519354/qBittorrent%20utils.user.js
// @updateURL https://update.greasyfork.org/scripts/519354/qBittorrent%20utils.meta.js
// ==/UserScript==

const log = console.log.bind(console);
const error = console.error.bind(console);
const $ = document.$ = document.querySelector.bind(document);
const $$ = document.$$ = document.querySelectorAll.bind(document);
Element.prototype.$ = Element.prototype.querySelector;
Element.prototype.$$ = Element.prototype.querySelectorAll;
NodeList.prototype.toArray = function() {
	return Array.prototype.slice.call(this)
}
HTMLCollection.prototype.toArray = function() {
	return Array.prototype.slice.call(this)
}
function insertBefore(ref_ele, ele){
	ref_ele.parentNode.insertBefore(ele, ref_ele);
}
function insertAfter(ref_ele, ele){
	ref_ele.parentNode.insertBefore(ele, ref_ele.nextSibling);
}

const pathname = location.pathname,args = Object.fromEntries([...(new URLSearchParams(location.search)).entries()])
log(pathname, args)

function api_maindata() {
    return fetch("api/v2/sync/maindata?rid=0", {
        "headers": {
            "accept": "application/json",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "x-request": "JSON",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrerPolicy": "same-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(resp => resp.json())
}

function api_delete(hashes, deleteFiles) {
    return fetch("api/v2/torrents/delete", {
        "headers": {
            "accept": "text/javascript, text/html, application/xml, text/xml, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "pragma": "no-cache",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrerPolicy": "same-origin",
        "body": "hashes=" + hashes.join('|') + "&deleteFiles=" + deleteFiles,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
}

async function new_delete(delete_hashes) {
    if (!delete_hashes || delete_hashes.length == 0) return
    log(delete_hashes)
    const data = await api_maindata()
    log(data)
    const torrents = data.torrents
    let all_path2hash = {}
    for (const hash in torrents) {
        let t = torrents[hash]
        all_path2hash[t.content_path] = (all_path2hash[t.content_path] || []).concat([hash])
    }
    let delete_path2hash = {}
    for (const hash of delete_hashes) {
        let t = torrents[hash]
        if (!t) continue
        delete_path2hash[t.content_path] = (delete_path2hash[t.content_path] || []).concat([hash])
    }
    log(all_path2hash)
    log(delete_path2hash)
    if (confirm("是否开始移除选中的"+delete_hashes.length+"个种子？")) {
        for (const path in delete_path2hash) {
            if (delete_path2hash[path].length == all_path2hash[path].length) {
                await api_delete(delete_path2hash[path], true)
            } else {
                await api_delete(delete_path2hash[path], false)
            }
        }
        window.parent.qBittorrent.Client.closeWindows();
    }
}

async function main() {
    if (pathname == '/confirmdeletion.html') {
//         const delete_btn = $('#confirmBtn')
//         const new_delete_btn = delete_btn.clone()
//         new_delete_btn.id = 'newDeleteBtn'
//         new_delete_btn.value = '删除（如无其他站点保种则删除数据）'
//         insertAfter(delete_btn, new_delete_btn)
//         //insertAfter(delete_btn, document.createTextNode(' '))
//         insertAfter(delete_btn, document.createElement('hr'))
//         new_delete_btn.onclick = () => {
//             const delete_hashes = args.hashes.split('|')
//             new_delete(delete_hashes)
//         }
    }
    else if (pathname == '/') {
        const menu_ele = $('#torrentsTableMenu')
        const delete_menuitem_ele = menu_ele?.$('a[href="#delete"]')?.parentNode
        if (delete_menuitem_ele) {
            const new_delete_menuitem_ele = delete_menuitem_ele.clone()
            new_delete_menuitem_ele.className = ''
            new_delete_menuitem_ele.firstElementChild.href = '#'
            new_delete_menuitem_ele.firstElementChild.lastChild.textContent = ' 删除（如无其他站点保种则删除数据）'
            insertAfter(delete_menuitem_ele, new_delete_menuitem_ele)
            new_delete_menuitem_ele.firstElementChild.onclick = () => {
                const delete_hashes = torrentsTable.selectedRowsIds();
                new_delete(delete_hashes)
            }
        }
    }
}

(function() {
    'use strict';
    window.addEventListener('load', () => {
        main()
    })
})();