// ==UserScript==
// @name         RequestsCounter
// @namespace    http://sanyabeast.xyz/
// @version      0.1
// @description  null
// @author       sanyabeast
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455215/RequestsCounter.user.js
// @updateURL https://update.greasyfork.org/scripts/455215/RequestsCounter.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let statistics = {
        per_range: {},
        prev_request_date: +new Date(),
        summary: 0,
        history: [],
        history_limit: 300,
        xhr_requests: 0
    }
    let state = {
        stat_update_timer: undefined,
        filter: 'quotes',
        main_button: undefined,
        main_window: undefined,
    }
    function parse_html(code) {
        let d = document.createElement('div')
        d.innerHTML = code;
        return d.children[0]
    }
    function test_request(alias) {
        if (alias.match(new RegExp(state.filter, 'gmi'))) {
            let now_time = +new Date();
            let delta_time = now_time - statistics.prev_request_date
            statistics.prev_request_date = now_time
            statistics.summary++;
            statistics.history.push([now_time, delta_time])
            update_statistics()
            update_summary()
        }
    }
    XMLHttpRequest.$rc_test_request = test_request
    function setup_injection() {
        let orig_XMLHttpRequest_prototype_open = XMLHttpRequest.prototype.open
        let orig_XMLHttpRequest_prototype_send = XMLHttpRequest.prototype.send
        XMLHttpRequest.prototype.open = function (method, url) {
            this._method = method;
            this._url = url;
            return orig_XMLHttpRequest_prototype_open.apply(this, arguments);
        }
        XMLHttpRequest.prototype.send = function () {
            let alias = `${this._method}:${this._url.split('?')[0]}`;
            test_request(alias);
            return orig_XMLHttpRequest_prototype_send.apply(this, arguments);
        }
    }
    function update_average_value(range) {
        statistics.history = statistics.history.slice(Math.max(0, statistics.history.length - statistics.history_limit), statistics.history.length)
        let count = 0;
        let now_time = +new Date();
        statistics.history.forEach((pair) => {
            if (now_time - pair[0] < range * 1000) {
                count++;
            }
        })
        if (statistics.per_range[range] === undefined) {
            statistics.per_range[range] = 0;
        }
        statistics.per_range[range] = Math.max(statistics.per_range[range], count)
        let last_val_el = state.main_window.querySelector(`.per-second-val-${range}`)
        let max_val_el = state.main_window.querySelector(`.max-per-second-val-${range}`)
        if (last_val_el) {
            last_val_el.innerHTML = `last ${range}s: ${count}`
        }
        if (max_val_el) {
            max_val_el.innerHTML = `max per ${range}s: ${statistics.per_range[range]}`
        }
    }
    function update_summary() {
        state.main_button.querySelector('.summary-val').innerHTML = statistics.summary;
        state.main_window.querySelector('.summary-val').innerHTML = `summary: ${statistics.summary}`;
    }
    function show_window() {
        state.main_button.style.visibility = "hidden";
        state.main_window.style.visibility = "visible";
    }
    function hide_window() {
        state.main_button.style.visibility = "visible";
        state.main_window.style.visibility = "hidden";
    }
    function get_summary() {
        return statistics.summary;
    }
    function update_statistics() {
        update_average_value(1);
        update_average_value(5);
        update_average_value(15);
        update_average_value(60);
    }
    function reset() {
        state.filter = state.main_window.querySelector('.filter').value
        statistics.per_range = {}
        statistics.prev_request_date = +new Date()
        statistics.summary = 0
        statistics.history = []
        update_statistics();
        update_summary()
    }
    function setup_gui() {
        let main_button = state.main_button = parse_html(`
           <div
               class="rq-main-button"
               style="
                   visibility: hidden; border-radius: 50%; background: rgba(0,0,0,0.5); width: 32px; height: 32px; position: fixed; right: 24px; top: 24px; display: flex; align-items: center; justify-content: center; z-index: 9999; cursor: pointer;"
               >
               <p class="summary-val" style="font-family: monospace; color: #eee;">0</p>
           </div>
        `);
        let main_window = state.main_window = parse_html(`
           <div
               class="rq-main-button"
               style="visibility: visible; border-radius: 8px; background: rgba(0,0,0,0.75); width: 150px; height: 150px; position: fixed; right: 24px; top: 24px; display: flex; justify-content: flex-start; align-items: flex-start; z-index: 9999; padding: 8px; font-family: monospace; flex-direction: column; padding: 8px;"
           >
               <input class="filter" type="text" value="quotes" style="box-sizing: border-box; width: 100%; overflow; hidden; background: black; color: #fff; outline: none; border: 1px solid #eee;"/>
               <div class="reset-button" style="user-select: none; cursor: pointer; color: red; border: 1px solid red; margin: 8px 0; align-self: flex-end;">reset</div>
               <p class="summary-val"            style="border-top: 1px dotted #ddd; width: 100%; margin: 0; white-space: nowrap; ont-family: monospace; color: #eee;">0</p>
               <p class="per-second-val-1"       style="margin: 0; white-space: nowrap; font-family: monospace; color: #eee;">0</p>
               <p class="per-second-val-5"       style="margin: 0; white-space: nowrap; font-family: monospace; color: #eee;">0</p>
               <p class="per-second-val-15"      style="margin: 0; white-space: nowrap; font-family: monospace; color: #eee;">0</p>
               <p class="per-second-val-60"      style="margin: 0; white-space: nowrap; font-family: monospace; color: #eee;">0</p>

               <p class="max-per-second-val-1"   style="margin: 0; white-space: nowrap; font-family: monospace; color: #aaa;">0</p>
           </div>
        `);
        main_button.onclick = show_window
        main_window.querySelector('.filter').addEventListener('input', reset)
        main_window.querySelector('.reset-button').addEventListener('mousedown', reset)
        document.body.appendChild(main_button)
        document.body.appendChild(main_window)
        state.stat_update_timer = setInterval(() => {
            update_statistics();
        }, 500)
    }
    setup_injection();
    setup_gui();
})();