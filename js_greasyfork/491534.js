// ==UserScript==
// @name         保存个人说明历史
// @namespace    https://github.com/lifegpc/userscript
// @version      0.0.1
// @description  保存幼儿园个人说明历史
// @author       lifegpc
// @match        https://u2.dmhy.org/usercp.php?action=personal*
// @icon         https://u2.dmhy.org/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491534/%E4%BF%9D%E5%AD%98%E4%B8%AA%E4%BA%BA%E8%AF%B4%E6%98%8E%E5%8E%86%E5%8F%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/491534/%E4%BF%9D%E5%AD%98%E4%B8%AA%E4%BA%BA%E8%AF%B4%E6%98%8E%E5%8E%86%E5%8F%B2.meta.js
// ==/UserScript==
/**@type {IDBDatabase} */
let db = undefined;
let need_reinit = false;
let storage = navigator.storage || globalThis['WorkerNavigator']['storage'];
async function make_storage_persist() {
    let persisted = await storage.persisted();
    if (!persisted) {
        persisted = await storage.persist();
    }
    return persisted;
}
function init() {
    return new Promise((resolve, reject) => {
        make_storage_persist().then(() => {
            if (db !== undefined && !need_reinit) {
                resolve();
                return;
            }
            let indexedReq = indexedDB.open('u2_history', 1);
            /**@param {IDBVersionChangeEvent} event*/
            indexedReq.onupgradeneeded = function (event) {
                let db = this.result;
                console.log(`upgrade u2_history from ${event.oldVersion} to ${event.newVersion}`);
                /*No version or version < 1 -> v1 */
                if (isNaN(event.oldVersion) || event.oldVersion < 1) {
                    db.createObjectStore('info', { keyPath: 'time' });
                }
            }
            indexedReq.onsuccess = () => {
                db = indexedReq.result;
                resolve();
            }
            indexedReq.onerror = () => {
                need_reinit = true;
                reject(indexedReq.error);
            }
        }).catch(reject);
    })
}
/**
 * @template T
 * @param {(tx: IDBDatabase) => IDBRequest<T>} callback
 * @returns {Promise<T>}
 */
function db_handle(callback) {
    return new Promise((resolve, reject) => {
        init().then(() => {
            let req = callback(db);
            req.onsuccess = () => {
                let re = req.result;
                resolve(re);
            }
            req.onerror = () => {
                need_reinit = true;
                reject(req.error);
            }
        }).catch(reject);
    })
}
async function get_all_info_keys() {
    return await db_handle(db => db.transaction('info').objectStore('info').getAllKeys());
}
async function get_info(time) {
    let info = await db_handle(db => db.transaction('info').objectStore('info').get(time));
    return info ? info.info : undefined;
}
async function delete_info(time) {
    await db_handle(db => db.transaction('info', 'readwrite').objectStore('info').delete(time));
}
async function save_info(time, info) {
    return await db_handle(db => db.transaction('info', 'readwrite').objectStore('info').put({ time, info }));
}
async function render_page() {}
(async function() {
let times = await get_all_info_keys();
let textarea = document.querySelector('textarea[name="info"]');
let submit = document.querySelector('input[type="submit"]');
if (!times.length) {
    let info = textarea.value;
    if (info) {
        times.push(await save_info(new Date, info));
    }
}
console.log(times)
if (times.length) {
    times.sort((a, b) => b.getTime() - a.getTime())
    let details = document.createElement('details');
    let summary = document.createElement('summary');
    summary.innerText = '历史记录';
    details.append(summary);
    let body = document.createElement('div');
    details.append(body);
    textarea.parentElement.append(details);
    let page = 0;
    const count_per_page = 10;
    /**
     * @param {Date} time
     * @param {string} info
     */
    function render_info(time, info) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.innerText = time.toLocaleString();
        details.append(summary);
        const form = document.createElement('form');
        form.target = '_blank';
        form.action = "/tags.php";
        form.method = "post";
        details.append(form);
        const ntextarea = document.createElement('textarea');
        ntextarea.readOnly = true;
        ntextarea.name = "test";
        ntextarea.value = info;
        ntextarea.style.width = textarea.style.width;
        ntextarea.rows = textarea.rows;
        form.append(ntextarea);
        const line = document.createElement('div');
        form.append(line);
        const use = document.createElement('input');
        use.type = "button";
        use.value = "使用";
        use.addEventListener('click', () => {
            textarea.value = info;
        })
        line.append(use);
        const preview = document.createElement('input');
        preview.type = "submit";
        preview.value = "预览";
        line.append(preview);
        const del = document.createElement('input');
        del.type = "button";
        del.value = "删除";
        del.addEventListener('click', async () => {
            await delete_info(time);
            times = await get_all_info_keys();
            times.sort((a, b) => b.getTime() - a.getTime());
            await render_page();
        })
        line.append(del);
        body.append(details);
    }
    async function render_page() {
        body.innerHTML = '';
        const total_page = Math.ceil(times.length / count_per_page);
        if (page < 0) page = 0;
        if (page >= total_page) page = total_page - 1;
        const max = Math.min((page + 1) * count_per_page, times.length);
        for (let i = page * count_per_page; i < max; i++) {
            const time = times[i];
            const info = await get_info(time);
            render_info(time, info);
        }
        const line = document.createElement('div');
        body.append(line);
        const pagei = document.createElement('input');
        pagei.type = 'number';
        pagei.min = '1';
        pagei.max = `${total_page}`;
        pagei.value = `${page + 1}`;
        pagei.addEventListener('change', () => {
            page = pagei.valueAsNumber - 1;
            render_page();
        })
        line.append(pagei);
        line.append(`/${total_page}页`);
        if (page > 0) {
            const first = document.createElement('input');
            first.type = 'button';
            first.value = '首页';
            first.addEventListener('click', () => {
                page = 0;
                render_page();
            })
            line.append(first);
            const prev = document.createElement('input');
            prev.type = 'button';
            prev.value = '上一页';
            prev.addEventListener('click', () => {
                page--;
                render_page();
            })
            line.append(prev);
        }
        if (page < total_page - 1) {
            const next = document.createElement('input');
            next.type = 'button';
            next.value = '下一页';
            next.addEventListener('click', () => {
                page++;
                render_page();
            })
            line.append(next);
            const last = document.createElement('input');
            last.type = 'button';
            last.value = '尾页';
            last.addEventListener('click', () => {
                page = total_page - 1;
                render_page();
            })
            line.append(last);
        }
    }
    await render_page();
} else {
    let div = document.createElement('div');
    div.innerText = "无历史记录";
    textarea.parentElement.append(div);
}
submit.addEventListener('click', async () => {
    const last_time = new Date(Math.max(...times));
    const info_db = await get_info(last_time);
    const info = textarea.value;
    if (info != info_db) {
        await save_info(new Date, info);
    }
})
})();
