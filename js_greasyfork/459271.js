// ==UserScript==
// @name         Pixiv Bookmark Milestone Analytics
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Display a dashboard table of times when artworks reach 1000 bookmark milestones. The script must remain running to collect statistics accurately.
// @author       cro
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/459271/Pixiv%20Bookmark%20Milestone%20Analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/459271/Pixiv%20Bookmark%20Milestone%20Analytics.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';
    GM_addStyle(".scrolltable { display:block; border-spacing:0px; display:block; overflow:auto; height: 400px; }");
    GM_addStyle(".scrolltable td { min-width: 100px; width: 100px; }");

    let time_interval = 1000 * 60;
    let milestone_interval = 1000;
    let fetch_headers = {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9,ja;q=0.8",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
        },
        "referrer": "https://www.pixiv.net/dashboard",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    };

    let settings_key = "cro_pixiv_bma_settings";
    let settings = {
        order_asc: false,
    };
    Object.assign(settings, JSON.parse(GM_getValue(settings_key, "{}")));

    let data_key = "cro_pixiv_bma";
    let data = JSON.parse(GM_getValue(data_key, "{}"));
    let table = document.createElement("table");
    table.id = data_key;
    table.classList.add('scrolltable');

    let order_button = document.createElement("button");

    let order_button_set_text = () => void(order_button.innerText = `ORDER: ${settings.order_asc ? "ASC" : "DESC"}`);
    order_button_set_text();

    let get_latest_data = function() {
        return fetch("https://www.pixiv.net/ajax/dashboard/works/illust/request_strategy?lang=en", fetch_headers);
    };

    let initial_record = function(work) {
        return {
            title: work.illust.title,
            thumbnail: work.illust.url,
            last_milestone: 0,
            milestones: [],
        };
    };

    let update_record = function(record, bookmarks) {
        let last_milestone = Math.floor(bookmarks / milestone_interval) * milestone_interval;
        if (last_milestone <= record.last_milestone) {
            return;
        }
        record.last_milestone = last_milestone;
        record.milestones.push([last_milestone, Date.now()]);
    };

    let update_data = function(pixiv_data) {
        pixiv_data.body.data.works.forEach(function(work, index)
        {
            work.illust = pixiv_data.body.thumbnails.illust[index];

            if (!(work.workId in data))
            {
                data[work.workId] = initial_record(work);
            }

            update_record(data[work.workId], work.bookmarkCount);
        });

        GM_setValue(data_key, JSON.stringify(data));
    };

    let update_table = function() {
        let scrollTop = table.scrollTop;
        let scrollLeft = table.scrollLeft;
        table.innerHTML = "";
        let ids = Object.keys(data);
        ids = ids.sort((a, b) => b - a);
        for (let id of ids)
        {
            let record = data[id];
            let row = table.insertRow();
            let cell = row.insertCell();
            let link = document.createElement('a');
            link.href = `/artworks/${id}`;
            let thumbnail = document.createElement('img');
            thumbnail.src = record.thumbnail;
            thumbnail.height = 50;
            link.append(thumbnail);
            cell.append(link);
            cell.style.minWidth = 50;

            cell = row.insertCell();
            link = document.createElement('a');
            link.href = `/artworks/${id}`;
            link.append(record.title);
            cell.append(link);

            let milestones = [...record.milestones];
            if (settings.order_asc == false) {
                milestones.reverse();
            }

            for (let [count, timestamp] of milestones)
            {
                row.insertCell().innerHTML = `${count} - ${new Date(timestamp).toLocaleString()}`;
            }
        }
        table.scrollTop = scrollTop;
        table.scrollLeft = scrollLeft;
    };

    let inject_table = function() {
        if (window.location.pathname != "/dashboard") {
            return;
        }
        let maybe_table = document.querySelector(`#${data_key}`);
        if (!maybe_table) {
            let dock = document.querySelector("body");
            dock.prepend(table);
            dock.prepend(order_button);
        }
    };

    order_button.onclick = function() {
        settings.order_asc = !settings.order_asc;
        GM_setValue(settings_key, JSON.stringify(settings));
        order_button_set_text();
        update_table();
    };

    let update = function(pixiv_data) {
        update_data(pixiv_data);
        update_table();
    };

    let process = function() {
        if (window.location.pathname != "/dashboard") {
            return;
        }
        get_latest_data()
            .then(x => x.json())
            .then(x => update(x));
    };

    process();
    let interval = setInterval(process, time_interval);
    setInterval(inject_table, 1000);
})();