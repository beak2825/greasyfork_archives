// ==UserScript==
// @name         Laby.net/names Username Filter
// @namespace    Captains thing
// @version      1
// @description  Funny little username tables. This script features a rare/simple usernames ui, spam filter, stat tracks, multi-load, and other useful features.
// @author       Captain
// @license      GNU
// @icon         https://laby.net/texture/badge/629b36dc-5c0b-4a3c-85bf-ea111954f6fa.webp
// @match        *://laby.net/names
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/537046/Labynetnames%20Username%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/537046/Labynetnames%20Username%20Filter.meta.js
// ==/UserScript==

// Extra comment, this isnt perfect so options to hide any names flagged in the ui or restore names are provided. I plan to add user confirmation later. o/

(function() {
'use strict';

const DARK_BG = "#191826";
const DARK_BG2 = "#23213a";
const DARK_BG3 = "#23213a";
const DARK_BORDER = "#6a43c7";
const DARK_ACCENT = "#b966f7";
const DARK_TEXT = "#dcddee";
const DARK_FADE = "#4a3c74";
const DARK_HR = "#322a4e";
const DARK_BTN = "#4e36a7";
const DARK_BTN_H = "#6a43c7";
const DARK_BTN2 = "#23213a";
const DARK_CONTRAST = "#fff";
const DARK_INPUT = "#221f33";
const DARK_SHADOW = "0 6px 28px #000a";
const DARK_LOGO = "https://laby.net/texture/badge/629b36dc-5c0b-4a3c-85bf-ea111954f6fa.webp";
const CAPTAIN_GRADIENT = "linear-gradient(90deg,#b966f7 5%,#6a43c7 45%,#ff7fad 95%)";

// Smart positioning for UIs
function getUIPositions() {
    return [
        {top: 70, left: 70},
        {top: 70, left: 510},
        {top: 70, left: 950},
        {top: 390, left: 70},
        {top: 390, left: 510},
        {top: 390, left: 950}
    ];
}
function getNextUIPosition(idx) {
    const pos = getUIPositions();
    if(idx < pos.length) return pos[idx];
    const base = pos[pos.length-1];
    return {top: base.top + (idx-pos.length+1)*80, left: base.left + (idx-pos.length+1)*40};
}
function fadeInUI(el) {
    el.style.opacity = 0;
    el.style.transition = "opacity 0.6s cubic-bezier(.32,1.36,.53,1)";
    setTimeout(() => { el.style.opacity = 1; }, 10);
}

// Core logic and state
let removed_rows = [];
let kept_names = [];
let rare_spam_names = [];
let filter_numbers = false;
let filter_underscores = false;
let hidden_console_names = new Set();
let auto_scan_interval = null;
let minimize_state = false;
let multiload_tries = 3;
let stats_loaded_pages = 1;
let stats_last_usernames = [];
let stats_last_count = 0;
let stats_last_time = Date.now();

function is_spam(name, filter_numbers, filter_underscores) {
    if (filter_numbers && /\d/.test(name)) return true;
    if (filter_underscores && /_/.test(name)) return true;
    let n = name.replace(/_/g, '');
    if (/^[a-zA-Z0-9_]{3,4}$/.test(name)) return true;
    if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(n)) return true;
    if (!/[aeiou]/i.test(n)) return true;
    let alt = 0;
    for (let i = 1; i < n.length; i++) {
        let a = n[i], b = n[i-1];
        if ((/[aeiou]/i.test(a) && /[bcdfghjklmnpqrstvwxyz]/i.test(b)) ||
            (/[bcdfghjklmnpqrstvwxyz]/i.test(a) && /[aeiou]/i.test(b))) alt++;
    }
    if (alt >= n.length - 1 && n.length > 4) return true;
    let cons = (n.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length / n.length;
    if (n.length >= 5 && cons > 0.7) return true;
    return false;
}
function is_rare_simple(name, name_counts) {
    return (
        name_counts[name] === 1 &&
        (
            /^[a-z]{3,7}$/.test(name) ||
            /^[A-Z][a-z]{2,7}$/.test(name) ||
            (/^[a-z]+$/.test(name) && name.length <= 8)
        )
    );
}
function scan_and_remove() {
    removed_rows = [];
    kept_names = [];
    rare_spam_names = [];
    let names_in_table = new Set();
    let name_counts = {};
    document.querySelectorAll('tr.profile').forEach(row => {
        let name = row.getAttribute('data-profile');
        if (!name) return;
        name_counts[name] = (name_counts[name] || 0) + 1;
    });
    document.querySelectorAll('tr.profile').forEach(row => {
        let name = row.getAttribute('data-profile');
        if (!name || names_in_table.has(name)) return;
        names_in_table.add(name);
        let spammy = is_spam(name, filter_numbers, filter_underscores);
        if (spammy) {
            if (is_rare_simple(name, name_counts)) {
                rare_spam_names.push({ name, html: row.outerHTML });
            } else {
                removed_rows.push({ name, html: row.outerHTML });
            }
            row.remove();
        } else {
            kept_names.push(name);
        }
    });
    update_popup();
    update_console_ui();
    update_rare_spam_ui();
    update_stats_ui();
}
function restore_row(name) {
    let obj = removed_rows.find(x => x.name === name);
    if (obj) {
        let temp = document.createElement('table');
        temp.innerHTML = obj.html;
        let tr = temp.querySelector('tr');
        let table = document.querySelector('table');
        if (table) table.appendChild(tr);
        kept_names.push(obj.name);
        removed_rows = removed_rows.filter(x => x.name !== name);
        update_popup();
        update_console_ui();
        update_rare_spam_ui();
        update_stats_ui();
        return;
    }
    obj = rare_spam_names.find(x => x.name === name);
    if (obj) {
        let temp = document.createElement('table');
        temp.innerHTML = obj.html;
        let tr = temp.querySelector('tr');
        let table = document.querySelector('table');
        if (table) table.appendChild(tr);
        kept_names.push(obj.name);
        rare_spam_names = rare_spam_names.filter(x => x.name !== name);
        update_popup();
        update_console_ui();
        update_rare_spam_ui();
        update_stats_ui();
        return;
    }
}
function keep_removed_rare_spam(name) {
    rare_spam_names = rare_spam_names.filter(x => x.name !== name);
    removed_rows.push({ name, html: '' });
    update_popup();
    update_console_ui();
    update_rare_spam_ui();
    update_stats_ui();
}
function update_popup() {
    let popup = document.getElementById('restore-popup');
    if (!popup) return;
    let removed_list = popup.querySelector('#removed-list');
    let kept_pre = popup.querySelector('#kept-pre');
    removed_list.innerHTML = '';
    if (removed_rows.length === 0) {
        let li = document.createElement('li');
        li.textContent = 'None';
        removed_list.appendChild(li);
    } else {
        for (let obj of removed_rows) {
            let li = document.createElement('li');
            li.style.marginBottom = '6px';
            let span = document.createElement('span');
            span.innerText = obj.name;
            span.style.marginRight = '8px';
            let btn = document.createElement('button');
            btn.innerText = 'Restore';
            btn.className = 'restore-btn';
            btn.style.cursor = 'pointer';
            btn.onclick = function() {
                restore_row(obj.name);
            };
            li.appendChild(span);
            li.appendChild(btn);
            removed_list.appendChild(li);
        }
    }
    kept_pre.innerText = kept_names.length ? kept_names.join('\n') : 'None';
}
function get_simple_rare_names() {
    let name_counts = {};
    let names = [];
    document.querySelectorAll('tr.profile').forEach(row => {
        let name = row.getAttribute('data-profile');
        if (!name) return;
        names.push(name);
        name_counts[name] = (name_counts[name] || 0) + 1;
    });
    let rare = names.filter(n => name_counts[n] === 1);
    let simple = names.filter(n =>
        /^[a-z]{3,7}$/.test(n) ||
        /^[A-Z][a-z]{2,7}$/.test(n) ||
        (/^[a-z]+$/.test(n) && n.length <= 8)
    );
    let unique = Array.from(new Set([...rare, ...simple])).filter(n => !hidden_console_names.has(n));
    let scored = unique.map(n => {
        let score = 3;
        if (rare.includes(n) && simple.includes(n)) score = 0;
        else if (rare.includes(n)) score = 1;
        else if (simple.includes(n)) score = 2;
        else score = 3;
        return { name: n, score, length: n.length };
    });
    scored.sort((a, b) =>
        a.score - b.score ||
        a.length - b.length ||
        a.name.localeCompare(b.name)
    );
    return scored.map(obj => obj.name);
}
function update_console_ui() {
    let console_box = document.getElementById('username-console-ui');
    if (!console_box) return;
    let highlighted = get_simple_rare_names();
    console_box.innerHTML = '';
    if (!highlighted.length) {
        let no = document.createElement('div');
        no.textContent = '(none)';
        no.style.color = DARK_FADE;
        console_box.appendChild(no);
    } else {
        highlighted.forEach(name => {
            let wrap = document.createElement('div');
            wrap.style.display = 'flex';
            wrap.style.alignItems = 'center';
            wrap.style.marginBottom = '2px';
            let user = document.createElement('span');
            user.textContent = name;
            user.style.fontFamily = 'monospace';
            user.style.fontSize = '13px';
            user.style.color = DARK_ACCENT;
            user.style.cursor = 'pointer';
            user.style.textDecoration = 'underline';
            user.onclick = function() {
                let row = Array.from(document.querySelectorAll('tr.profile'))
                    .find(r => r.getAttribute('data-profile') === name);
                if (row) {
                    row.scrollIntoView({behavior: "smooth", block: "center"});
                    row.style.background = '#392c5b';
                    setTimeout(() => row.style.background = '', 1400);
                }
            };
            let hidebtn = document.createElement('button');
            hidebtn.textContent = "Hide";
            hidebtn.className = 'hide-console-btn';
            hidebtn.style.fontSize = '11px';
            hidebtn.style.marginLeft = '7px';
            hidebtn.style.background = DARK_BTN2;
            hidebtn.style.color = DARK_ACCENT;
            hidebtn.style.border = `1px solid ${DARK_FADE}`;
            hidebtn.style.borderRadius = '5px';
            hidebtn.style.cursor = 'pointer';
            hidebtn.onmouseenter = function(){ hidebtn.style.background = DARK_BTN_H; hidebtn.style.color = DARK_CONTRAST; };
            hidebtn.onmouseleave = function(){ hidebtn.style.background = DARK_BTN2; hidebtn.style.color = DARK_ACCENT; };
            hidebtn.onclick = function() {
                hidden_console_names.add(name);
                update_console_ui();
            };
            wrap.appendChild(user);
            wrap.appendChild(hidebtn);
            console_box.appendChild(wrap);
        });
    }
}
function make_draggable_console(el) {
    let x = 0, y = 0, start_x = 0, start_y = 0;
    el.onmousedown = down;
    function down(e) {
        if (e.target.classList.contains('hide-console-btn')) return;
        e.preventDefault();
        start_x = e.clientX;
        start_y = e.clientY;
        document.onmouseup = up;
        document.onmousemove = move;
    }
    function move(e) {
        x = e.clientX - start_x;
        y = e.clientY - start_y;
        el.style.left = (el.offsetLeft + x) + "px";
        el.style.top = (el.offsetTop + y) + "px";
        start_x = e.clientX;
        start_y = e.clientY;
    }
    function up() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
function show_console_ui() {
    let old = document.getElementById('username-console-ui-wrap');
    if (old) old.remove();
    let box = document.createElement('div');
    box.id = 'username-console-ui-wrap';
    let pos = getNextUIPosition(1);
    box.style.position = 'fixed';
    box.style.top = pos.top + 'px';
    box.style.left = pos.left + 'px';
    box.style.background = DARK_BG3;
    box.style.color = DARK_TEXT;
    box.style.border = `2px solid ${DARK_BORDER}`;
    box.style.zIndex = '9999';
    box.style.padding = '10px 13px 10px 13px';
    box.style.fontFamily = 'monospace';
    box.style.fontSize = '13px';
    box.style.maxHeight = '60vh';
    box.style.overflowY = 'auto';
    box.style.minWidth = '180px';
    box.style.boxShadow = DARK_SHADOW;
    box.style.borderRadius = '7px';
    box.style.transition = 'opacity 0.6s cubic-bezier(.32,1.36,.53,1)';
    box.style.opacity = 0;
    let head = document.createElement('div');
    head.innerHTML = `<b style="font-size:13px;color:${DARK_ACCENT};">Potential</b>`;
    box.appendChild(head);
    let hr = document.createElement('hr');
    hr.style.margin = '7px 0';
    hr.style.border = `1px solid ${DARK_HR}`;
    box.appendChild(hr);
    let console_box = document.createElement('div');
    console_box.id = 'username-console-ui';
    box.appendChild(console_box);
    let show_hidden_btn = document.createElement('button');
    show_hidden_btn.textContent = "Show Hidden";
    show_hidden_btn.style.fontSize = '11px';
    show_hidden_btn.style.marginTop = '7px';
    show_hidden_btn.style.background = DARK_BTN2;
    show_hidden_btn.style.color = DARK_ACCENT;
    show_hidden_btn.style.border = `1px solid ${DARK_FADE}`;
    show_hidden_btn.style.borderRadius = '5px';
    show_hidden_btn.style.cursor = 'pointer';
    show_hidden_btn.onmouseenter = function(){ show_hidden_btn.style.background = DARK_BTN_H; show_hidden_btn.style.color = DARK_CONTRAST; };
    show_hidden_btn.onmouseleave = function(){ show_hidden_btn.style.background = DARK_BTN2; show_hidden_btn.style.color = DARK_ACCENT; };
    show_hidden_btn.onclick = function() {
        hidden_console_names.clear();
        update_console_ui();
    };
    box.appendChild(show_hidden_btn);
    document.body.appendChild(box);
    fadeInUI(box);
    make_draggable_console(box);
    update_console_ui();
}
function update_rare_spam_ui() {
    let box = document.getElementById('rare-spam-ui');
    if (!box) return;
    box.innerHTML = '';
    let head = document.createElement('div');
    head.innerHTML = `<b style="font-size:13px;color:#ffb86b;">UC Feedback</b>`;
    box.appendChild(head);
    let hr = document.createElement('hr');
    hr.style.margin = '7px 0';
    hr.style.border = `1px solid ${DARK_HR}`;
    box.appendChild(hr);
    if (!rare_spam_names.length) {
        let no = document.createElement('div');
        no.textContent = '(none)';
        no.style.color = DARK_FADE;
        box.appendChild(no);
        return;
    }
    rare_spam_names.forEach(obj => {
        let wrap = document.createElement('div');
        wrap.style.display = 'flex';
        wrap.style.alignItems = 'center';
        wrap.style.marginBottom = '2px';
        let user = document.createElement('span');
        user.textContent = obj.name;
        user.style.fontFamily = 'monospace';
        user.style.fontSize = '13px';
        user.style.color = '#ffb86b';
        user.style.marginRight = '6px';
        user.style.cursor = 'pointer';
        user.style.textDecoration = 'underline';
        let restorebtn = document.createElement('button');
        restorebtn.textContent = "Restore";
        restorebtn.className = 'restore-rare-btn';
        restorebtn.style.fontSize = '11px';
        restorebtn.style.marginLeft = '6px';
        restorebtn.style.background = DARK_BTN2;
        restorebtn.style.color = '#ffb86b';
        restorebtn.style.border = `1px solid ${DARK_FADE}`;
        restorebtn.style.borderRadius = '5px';
        restorebtn.style.cursor = 'pointer';
        restorebtn.onmouseenter = function(){ restorebtn.style.background = DARK_BTN_H; restorebtn.style.color = DARK_CONTRAST; };
        restorebtn.onmouseleave = function(){ restorebtn.style.background = DARK_BTN2; restorebtn.style.color = '#ffb86b'; };
        restorebtn.onclick = function() {
            restore_row(obj.name);
        };
        let keepbtn = document.createElement('button');
        keepbtn.textContent = "Keep Removed";
        keepbtn.className = 'keep-rare-btn';
        keepbtn.style.fontSize = '11px';
        keepbtn.style.marginLeft = '6px';
        keepbtn.style.background = DARK_BTN2;
        keepbtn.style.color = '#ffb86b';
        keepbtn.style.border = `1px solid ${DARK_FADE}`;
        keepbtn.style.borderRadius = '5px';
        keepbtn.style.cursor = 'pointer';
        keepbtn.onmouseenter = function(){ keepbtn.style.background = DARK_BTN_H; keepbtn.style.color = DARK_CONTRAST; };
        keepbtn.onmouseleave = function(){ keepbtn.style.background = DARK_BTN2; keepbtn.style.color = '#ffb86b'; };
        keepbtn.onclick = function() {
            keep_removed_rare_spam(obj.name);
        };
        wrap.appendChild(user);
        wrap.appendChild(restorebtn);
        wrap.appendChild(keepbtn);
        box.appendChild(wrap);
    });
}
function make_draggable_rare(el) {
    let x = 0, y = 0, start_x = 0, start_y = 0;
    el.onmousedown = down;
    function down(e) {
        if (
            e.target.classList.contains('restore-rare-btn') ||
            e.target.classList.contains('keep-rare-btn')
        ) return;
        e.preventDefault();
        start_x = e.clientX;
        start_y = e.clientY;
        document.onmouseup = up;
        document.onmousemove = move;
    }
    function move(e) {
        x = e.clientX - start_x;
        y = e.clientY - start_y;
        el.style.left = (el.offsetLeft + x) + "px";
        el.style.top = (el.offsetTop + y) + "px";
        start_x = e.clientX;
        start_y = e.clientY;
    }
    function up() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
function show_rare_spam_ui() {
    let old = document.getElementById('rare-spam-ui-wrap');
    if (old) old.remove();
    let box = document.createElement('div');
    box.id = 'rare-spam-ui-wrap';
    let pos = getNextUIPosition(2);
    box.style.position = 'fixed';
    box.style.top = pos.top + 'px';
    box.style.left = pos.left + 'px';
    box.style.background = DARK_BG2;
    box.style.color = DARK_TEXT;
    box.style.border = `2px solid #ffb86b`;
    box.style.zIndex = '9999';
    box.style.padding = '10px 13px 10px 13px';
    box.style.fontFamily = 'monospace';
    box.style.fontSize = '13px';
    box.style.maxHeight = '60vh';
    box.style.overflowY = 'auto';
    box.style.minWidth = '220px';
    box.style.boxShadow = DARK_SHADOW;
    box.style.borderRadius = '7px';
    box.style.transition = 'opacity 0.6s cubic-bezier(.32,1.36,.53,1)';
    box.style.opacity = 0;
    let inner = document.createElement('div');
    inner.id = 'rare-spam-ui';
    box.appendChild(inner);
    document.body.appendChild(box);
    fadeInUI(box);
    make_draggable_rare(box);
    update_rare_spam_ui();
}
function make_draggable(el) {
    let x = 0, y = 0, start_x = 0, start_y = 0;
    el.onmousedown = down;
    function down(e) {
        if (
            e.target.classList.contains('restore-btn') ||
            e.target.classList.contains('scan-btn') ||
            e.target.classList.contains('close-btn') ||
            e.target.classList.contains('filter-checkbox') ||
            e.target.classList.contains('load-more-btn') ||
            e.target.classList.contains('minimize-btn') ||
            e.target.classList.contains('tries-input')
        ) return;
        e.preventDefault();
        start_x = e.clientX;
        start_y = e.clientY;
        document.onmouseup = up;
        document.onmousemove = move;
    }
    function move(e) {
        x = e.clientX - start_x;
        y = e.clientY - start_y;
        el.style.left = (el.offsetLeft + x) + "px";
        el.style.top = (el.offsetTop + y) + "px";
        start_x = e.clientX;
        start_y = e.clientY;
    }
    function up() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
function refreshCheckboxStyles(filter_numbers_box, filter_numbers_label, filter_underscores_box, filter_underscores_label) {
    if (filter_numbers_box.checked) {
        filter_numbers_label.style.background = DARK_FADE;
        filter_numbers_label.style.color = DARK_ACCENT;
        filter_numbers_label.style.fontWeight = 'bold';
        filter_numbers_label.style.borderRadius = '4px';
        filter_numbers_label.style.padding = '0 5px';
    } else {
        filter_numbers_label.style.background = '';
        filter_numbers_label.style.color = '';
        filter_numbers_label.style.fontWeight = '';
        filter_numbers_label.style.borderRadius = '';
        filter_numbers_label.style.padding = '';
    }
    if (filter_underscores_box.checked) {
        filter_underscores_label.style.background = DARK_FADE;
        filter_underscores_label.style.color = DARK_ACCENT;
        filter_underscores_label.style.fontWeight = 'bold';
        filter_underscores_label.style.borderRadius = '4px';
        filter_underscores_label.style.padding = '0 5px';
    } else {
        filter_underscores_label.style.background = '';
        filter_underscores_label.style.color = '';
        filter_underscores_label.style.fontWeight = '';
        filter_underscores_label.style.borderRadius = '';
        filter_underscores_label.style.padding = '';
    }
}
function get_current_usernames() {
    return Array.from(document.querySelectorAll('tr.profile'))
        .map(row => row.getAttribute('data-profile'))
        .filter(Boolean);
}
function try_load_more(times, on_complete) {
    let tries = 0;
    let lastCount = get_current_usernames().length;
    function attempt() {
        if (tries >= times) {
            if (typeof on_complete === "function") on_complete();
            return;
        }
        let el = document.querySelector('a#loadMore.btn[data-trans="search.results.more"]');
        if (!el) {
            if (typeof on_complete === "function") on_complete();
            return;
        }
        el.click();
        setTimeout(() => {
            let namesNow = get_current_usernames();
            if (namesNow.length > lastCount) {
                lastCount = namesNow.length;
                tries++;
                attempt();
            } else {
                setTimeout(() => {
                    let namesNow2 = get_current_usernames();
                    if (namesNow2.length > lastCount) {
                        lastCount = namesNow2.length;
                        tries++;
                        attempt();
                    } else {
                        tries++;
                        attempt();
                    }
                }, 600);
            }
        }, 600);
    }
    attempt();
}
function set_all_ui_minimized(minimize) {
    const ids = [
        'restore-popup',
        'username-console-ui-wrap',
        'rare-spam-ui-wrap',
        'stats-ui-wrap'
    ];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (minimize) {
                el.style.opacity = '0.13';
                el.style.pointerEvents = 'none';
            } else {
                el.style.opacity = '1';
                el.style.pointerEvents = '';
            }
        }
    });
}
function show_stats_ui() {
    let old = document.getElementById('stats-ui-wrap');
    if (old) old.remove();
    let box = document.createElement('div');
    box.id = 'stats-ui-wrap';
    let pos = getNextUIPosition(3);
    box.style.position = 'fixed';
    box.style.top = pos.top + 'px';
    box.style.left = pos.left + 'px';
    box.style.background = DARK_BG2;
    box.style.color = DARK_TEXT;
    box.style.border = `2px solid ${DARK_BORDER}`;
    box.style.zIndex = '9999';
    box.style.padding = '13px 18px 13px 18px';
    box.style.fontFamily = 'monospace';
    box.style.fontSize = '13px';
    box.style.maxHeight = '60vh';
    box.style.overflowY = 'auto';
    box.style.minWidth = '260px';
    box.style.boxShadow = DARK_SHADOW;
    box.style.borderRadius = '7px';
    box.style.transition = 'opacity 0.6s cubic-bezier(.32,1.36,.53,1)';
    box.style.opacity = 0;
    let head = document.createElement('div');
    head.innerHTML = `<b style="font-size:13px;color:${DARK_ACCENT};">Statistics</b>`;
    box.appendChild(head);
    let hr = document.createElement('hr');
    hr.style.margin = '7px 0';
    hr.style.border = `1px solid ${DARK_HR}`;
    box.appendChild(hr);
    let statContent = document.createElement('div');
    statContent.id = 'stats-ui-content';
    box.appendChild(statContent);
    document.body.appendChild(box);
    fadeInUI(box);
    make_draggable_stats(box);
    update_stats_ui();
}
function make_draggable_stats(el) {
    let x = 0, y = 0, start_x = 0, start_y = 0;
    el.onmousedown = down;
    function down(e) {
        if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
        e.preventDefault();
        start_x = e.clientX;
        start_y = e.clientY;
        document.onmouseup = up;
        document.onmousemove = move;
    }
    function move(e) {
        x = e.clientX - start_x;
        y = e.clientY - start_y;
        el.style.left = (el.offsetLeft + x) + "px";
        el.style.top = (el.offsetTop + y) + "px";
        start_x = e.clientX;
        start_y = e.clientY;
    }
    function up() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
function update_stats_ui() {
    let statContent = document.getElementById('stats-ui-content');
    if (!statContent) return;
    let curUsernames = get_current_usernames();
    let stats = `
<div><b>Pages loaded:</b> <span style="color:${DARK_ACCENT};">${stats_loaded_pages}</span></div>
<div><b>Usernames loaded:</b> <span style="color:${DARK_ACCENT};">${curUsernames.length}</span></div>
<div style="margin-top:7px"><b>All loaded usernames:</b></div>
<pre style="font-size:12px;max-height:170px;overflow:auto;background:${DARK_BG};border:1px solid ${DARK_FADE};padding:4px;border-radius:4px;margin:0 0 5px 0;color:${DARK_ACCENT};">${curUsernames.join('\n')}</pre>
    `;
    statContent.innerHTML = stats;
}
function stats_monitor_loads() {
    let curUsernames = get_current_usernames();
    if (curUsernames.length > stats_last_count) {
        stats_loaded_pages++;
        stats_last_count = curUsernames.length;
        stats_last_time = Date.now();
    }
    stats_last_usernames = curUsernames;
    update_stats_ui();
}

// --- Main popup (with fade-in and smart position) ---
function show_popup() {
    let old = document.getElementById('restore-popup');
    if (old) old.remove();
    let box = document.createElement('div');
    box.id = 'restore-popup';
    let pos = getNextUIPosition(0);
    box.style.position = 'fixed';
    box.style.top = pos.top + 'px';
    box.style.left = pos.left + 'px';
    box.style.background = DARK_BG;
    box.style.color = DARK_TEXT;
    box.style.border = `2px solid ${DARK_BORDER}`;
    box.style.zIndex = '9999';
    box.style.padding = '18px 26px 18px 18px';
    box.style.fontFamily = 'monospace';
    box.style.fontSize = '14px';
    box.style.maxHeight = '72vh';
    box.style.overflowY = 'auto';
    box.style.minWidth = '400px';
    box.style.boxShadow = DARK_SHADOW;
    box.style.borderRadius = '13px';
    box.style.opacity = 0;
    let logoBar = document.createElement('div');
    logoBar.style.position = 'absolute';
    logoBar.style.top = '8px';
    logoBar.style.right = '23px';
    logoBar.style.display = 'flex';
    logoBar.style.flexDirection = 'column';
    logoBar.style.alignItems = 'center';
    logoBar.style.zIndex = '2';
    let logo = document.createElement('img');
    logo.src = DARK_LOGO;
    logo.style.width = '44px';
    logo.style.height = '44px';
    logo.style.borderRadius = '13px';
    logo.style.background = '#211d31';
    logo.style.border = `2px solid ${DARK_BORDER}`;
    logo.style.boxShadow = '0 2px 12px #000a';
    let captainName = document.createElement('span');
    captainName.textContent = "Captain";
    captainName.style.fontFamily = 'monospace, Consolas, Menlo, Monaco, monospace';
    captainName.style.fontSize = '23px';
    captainName.style.fontWeight = 'bold';
    captainName.style.letterSpacing = '1.5px';
    captainName.style.background = CAPTAIN_GRADIENT;
    captainName.style.webkitBackgroundClip = "text";
    captainName.style.webkitTextFillColor = "transparent";
    captainName.style.backgroundClip = "text";
    captainName.style.marginTop = '-2px';
    captainName.style.marginBottom = '0px';
    logoBar.appendChild(logo);
    logoBar.appendChild(captainName);
    box.appendChild(logoBar);
    let bar = document.createElement('div');
    bar.style.display = 'flex';
    bar.style.alignItems = 'center';
    bar.style.marginBottom = '10px';
    bar.style.gap = '10px';
    let scan_btn = document.createElement('button');
    scan_btn.innerText = 'Scan Again';
    scan_btn.className = 'scan-btn';
    scan_btn.style.background = DARK_BTN;
    scan_btn.style.color = DARK_CONTRAST;
    scan_btn.style.border = 'none';
    scan_btn.style.fontWeight = 'bold';
    scan_btn.style.borderRadius = '5px';
    scan_btn.style.padding = '4px 14px';
    scan_btn.style.cursor = 'pointer';
    scan_btn.onmouseenter = function(){ scan_btn.style.background = DARK_BTN_H; };
    scan_btn.onmouseleave = function(){ scan_btn.style.background = DARK_BTN; };
    scan_btn.onclick = function() {
        scan_and_remove();
    };
    bar.appendChild(scan_btn);
    let load_more_btn = document.createElement('button');
    load_more_btn.innerText = 'Load more';
    load_more_btn.className = 'load-more-btn';
    load_more_btn.style.background = DARK_BTN2;
    load_more_btn.style.color = DARK_ACCENT;
    load_more_btn.style.border = `1px solid ${DARK_FADE}`;
    load_more_btn.style.padding = '4px 16px';
    load_more_btn.style.marginLeft = '0px';
    load_more_btn.style.cursor = 'pointer';
    load_more_btn.style.borderRadius = '5px';
    load_more_btn.style.fontWeight = 'bold';
    load_more_btn.onmouseenter = function(){ load_more_btn.style.background = DARK_BTN_H; load_more_btn.style.color = DARK_CONTRAST; };
    load_more_btn.onmouseleave = function(){ load_more_btn.style.background = DARK_BTN2; load_more_btn.style.color = DARK_ACCENT; };
    load_more_btn.onclick = function() {
        let el = document.querySelector('a#loadMore.btn[data-trans="search.results.more"]');
        if (el) el.click();
    };
    bar.appendChild(load_more_btn);
    let multiLoadDiv = document.createElement('div');
    multiLoadDiv.style.marginLeft = '14px';
    multiLoadDiv.style.display = 'flex';
    multiLoadDiv.style.alignItems = 'center';
    let triesInput = document.createElement('input');
    triesInput.type = 'number';
    triesInput.value = multiload_tries;
    triesInput.min = 1;
    triesInput.max = 99;
    triesInput.className = 'tries-input';
    triesInput.style.width = '36px';
    triesInput.style.textAlign = 'center';
    triesInput.style.marginRight = '3px';
    triesInput.style.border = `1px solid ${DARK_FADE}`;
    triesInput.style.background = DARK_INPUT;
    triesInput.style.color = DARK_ACCENT;
    triesInput.style.borderRadius = '3px';
    triesInput.style.padding = '2px 2px';
    triesInput.oninput = function() {
        if (triesInput.value === "") return;
        multiload_tries = Math.max(1, Math.min(99, Number(triesInput.value) || 1));
    };
    let triesLabel = document.createElement('span');
    triesLabel.innerText = "× Load";
    triesLabel.style.marginRight = '6px';
    triesLabel.style.fontSize = '12px';
    triesLabel.style.color = DARK_ACCENT;
    let multiLoadBtn = document.createElement('button');
    multiLoadBtn.innerText = 'Try Load';
    multiLoadBtn.style.background = DARK_BTN2;
    multiLoadBtn.style.color = DARK_ACCENT;
    multiLoadBtn.style.border = `1px solid ${DARK_FADE}`;
    multiLoadBtn.style.borderRadius = '5px';
    multiLoadBtn.style.fontWeight = 'bold';
    multiLoadBtn.style.padding = '3px 10px';
    multiLoadBtn.style.cursor = 'pointer';
    multiLoadBtn.style.fontSize = '13px';
    multiLoadBtn.onmouseenter = function(){ multiLoadBtn.style.background = DARK_BTN_H; multiLoadBtn.style.color = DARK_CONTRAST; };
    multiLoadBtn.onmouseleave = function(){ multiLoadBtn.style.background = DARK_BTN2; multiLoadBtn.style.color = DARK_ACCENT; };
    let statusSpan = document.createElement('span');
    statusSpan.style.marginLeft = '8px';
    statusSpan.style.fontSize = '12px';
    statusSpan.style.color = DARK_ACCENT;
    multiLoadBtn.onclick = function() {
        statusSpan.textContent = 'Loading...';
        try_load_more(
            multiload_tries,
            function() {
                statusSpan.textContent = 'Done.';
                setTimeout(() => { statusSpan.textContent = ''; }, 1200);
            }
        );
    };
    multiLoadDiv.appendChild(triesInput);
    multiLoadDiv.appendChild(triesLabel);
    multiLoadDiv.appendChild(multiLoadBtn);
    multiLoadDiv.appendChild(statusSpan);
    bar.appendChild(multiLoadDiv);
    let minimizeBtn = document.createElement('button');
    minimizeBtn.innerText = minimize_state ? '▢' : '–';
    minimizeBtn.className = 'minimize-btn';
    minimizeBtn.title = minimize_state ? "Restore all UIs" : "Minimize all UIs";
    minimizeBtn.style.background = 'none';
    minimizeBtn.style.color = DARK_FADE;
    minimizeBtn.style.border = 'none';
    minimizeBtn.style.fontSize = '20px';
    minimizeBtn.style.cursor = 'pointer';
    minimizeBtn.style.marginLeft = 'auto';
    minimizeBtn.style.marginRight = '6px';
    minimizeBtn.onclick = function() {
        minimize_state = !minimize_state;
        set_all_ui_minimized(minimize_state);
        minimizeBtn.innerText = minimize_state ? '▢' : '–';
        minimizeBtn.title = minimize_state ? "Restore all UIs" : "Minimize all UIs";
    };
    bar.appendChild(minimizeBtn);
    let close = document.createElement('button');
    close.innerText = '✖';
    close.className = 'close-btn';
    close.style.background = 'none';
    close.style.color = DARK_FADE;
    close.style.border = 'none';
    close.style.fontSize = '18px';
    close.style.cursor = 'pointer';
    close.style.fontWeight = 'bold';
    close.onmouseenter = function() { close.style.color = "#ff7fad"; };
    close.onmouseleave = function() { close.style.color = DARK_FADE; };
    close.onclick = function(){ box.remove(); };
    bar.appendChild(close);
    box.appendChild(bar);
    let filterBar = document.createElement('div');
    filterBar.style.display = 'flex';
    filterBar.style.alignItems = 'center';
    filterBar.style.marginTop = '5px';
    filterBar.style.gap = '16px';
    let filter_numbers_box = document.createElement('input');
    filter_numbers_box.type = 'checkbox';
    filter_numbers_box.className = 'filter-checkbox';
    filter_numbers_box.id = 'filter-numbers';
    filter_numbers_box.checked = filter_numbers;
    filter_numbers_box.style.margin = '0 6px 0 0';
    filter_numbers_box.onchange = function() {
        filter_numbers = filter_numbers_box.checked;
        refreshCheckboxStyles(filter_numbers_box, filter_numbers_label, filter_underscores_box, filter_underscores_label);
    };
    let filter_numbers_label = document.createElement('label');
    filter_numbers_label.htmlFor = 'filter-numbers';
    filter_numbers_label.innerText = 'Filter numbers';
    filter_numbers_label.style.fontSize = '13px';
    filter_numbers_label.style.marginRight = '8px';
    let filter_underscores_box = document.createElement('input');
    filter_underscores_box.type = 'checkbox';
    filter_underscores_box.className = 'filter-checkbox';
    filter_underscores_box.id = 'filter-underscores';
    filter_underscores_box.checked = filter_underscores;
    filter_underscores_box.style.margin = '0 6px 0 0';
    filter_underscores_box.onchange = function() {
        filter_underscores = filter_underscores_box.checked;
        refreshCheckboxStyles(filter_numbers_box, filter_numbers_label, filter_underscores_box, filter_underscores_label);
    };
    let filter_underscores_label = document.createElement('label');
    filter_underscores_label.htmlFor = 'filter-underscores';
    filter_underscores_label.innerText = 'Filter underscores';
    filter_underscores_label.style.fontSize = '13px';
    filterBar.appendChild(filter_numbers_box);
    filterBar.appendChild(filter_numbers_label);
    filterBar.appendChild(filter_underscores_box);
    filterBar.appendChild(filter_underscores_label);
    refreshCheckboxStyles(filter_numbers_box, filter_numbers_label, filter_underscores_box, filter_underscores_label);
    box.appendChild(filterBar);
    let head = document.createElement('div');
    head.innerHTML = `<b>Removed:</b><br>`;
    head.style.marginTop = '9px';
    box.appendChild(head);
    let removed_list = document.createElement('ul');
    removed_list.style.listStyle = 'none';
    removed_list.style.padding = '0';
    removed_list.id = 'removed-list';
    box.appendChild(removed_list);
    let kept_div = document.createElement('div');
    kept_div.innerHTML = `<br><b>Kept:</b><br>`;
    let kept_pre = document.createElement('pre');
    kept_pre.style.margin = '0';
    kept_pre.id = 'kept-pre';
    kept_pre.style.background = DARK_BG2;
    kept_pre.style.color = DARK_ACCENT;
    kept_pre.style.borderRadius = '6px';
    kept_pre.style.padding = '4px';
    kept_pre.style.maxHeight = '80px';
    kept_pre.style.overflow = 'auto';
    kept_div.appendChild(kept_pre);
    box.appendChild(kept_div);
    document.body.appendChild(box);
    fadeInUI(box);
    make_draggable(box);
    update_popup();
    if (auto_scan_interval) clearInterval(auto_scan_interval);
    auto_scan_interval = setInterval(() => {
        let filter_numbers_box = document.getElementById('filter-numbers');
        let filter_underscores_box = document.getElementById('filter-underscores');
        if (!filter_numbers_box || !filter_underscores_box) return;
        if (filter_numbers_box.checked !== filter_numbers) filter_numbers = filter_numbers_box.checked;
        if (filter_underscores_box.checked !== filter_underscores) filter_underscores = filter_underscores_box.checked;
        if (filter_numbers || filter_underscores) scan_and_remove();
    }, 1800);
}

unsafeWindow.scan_and_remove = scan_and_remove;
scan_and_remove();
show_popup();
show_console_ui();
show_rare_spam_ui();
show_stats_ui();
setInterval(update_console_ui, 2400);
setInterval(update_rare_spam_ui, 2400);
setInterval(stats_monitor_loads, 1500);

})();