// ==UserScript==
// @name         Pixiv extended dashboard statistics.
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Put view-ratio data on likes, bookmarks, etc.
// @author       cro
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-umd-min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/398979/Pixiv%20extended%20dashboard%20statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/398979/Pixiv%20extended%20dashboard%20statistics.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';
    let id_name = "cro_pixiv_extended";

    // Which container the source data is retrieved from.
    let make_set_ratio = function(container_query)
    {
        let get_container = function(node)
        {
            let maybe_child = node.querySelector(`span[id=${id_name}]`);
            if (maybe_child) return maybe_child;
            let child = document.createElement('span');
            child.id = id_name;
            let container = node.querySelector(container_query) || node;
            container.append(child);
            return child;
        };

        let count = function (node)
        {
            let data = node.querySelector(container_query) || node;
            return parseInt(data.textContent.replace(',', ''));
        };

        return function(target_node, denom_node)
        {
            if (target_node && denom_node) get_container(target_node).textContent = ` (${(count(target_node) / count(denom_node) * 100).toFixed(2)}%)`;
        };
    };

    let query_array = (selector) => Array.from(document.querySelectorAll(selector).values());
    let desktop_class = 'f4332f9e';
    let mobile_class = 'cb68f05f';

    let process_all = function()
    {
        if (window.location.pathname == "/dashboard/works")
        {
            // Desktop view
            if (document.querySelector(`[class*=sc-${desktop_class}-0]`))
            {
                let set_ratio = make_set_ratio('a');
                let indices = query_array('div[class*=gtm-dashboard-works-sort-select]');
                let get_index = function(name)
                {
                    let node = document.querySelector(`div[class*=gtm-dashboard-works-sort-select-${name}]`);
                    let i = indices.indexOf(node);
                    return i == -1 ? null : i - 1;
                };
                let view_index = get_index('view');
                let like_index = get_index('rating');
                let bookmark_index = get_index('bookmark');
                let rows = _.chunk(query_array(`div[class*=sc-${desktop_class}-25]`), indices.length + 1);
                rows = rows.map(row => row.slice(2));
                for (let row of rows)
                {
                    let view = row[view_index];
                    set_ratio(row[like_index], view);
                    set_ratio(row[bookmark_index], view);
                }
            }
            // Mobile view
            else if (document.querySelector(`[class*=sc-${mobile_class}-3]`))
            {
                let set_ratio = make_set_ratio(null);
                let cell_nodes = query_array(`div[class*=sc-${mobile_class}-6]`);
                for (let cell of cell_nodes)
                {
                    let view = cell.querySelector('a[href*=access]');
                    let like = cell.querySelector('a[href*=rating]');
                    let bookmark = cell.querySelector('a[href*=bookmark]');
                    set_ratio(like, view);
                    set_ratio(bookmark, view);
                }
            }
        }
        else if (window.location.pathname == "/dashboard")
        {
            let set_ratio = make_set_ratio(`span:last-of-type:not(#${id_name})`);
            let views = query_array('a.gtm-dashboard-home-latest-works-number-link-view');
            let likes = query_array('a.gtm-dashboard-home-latest-works-number-link-like');
            let bookmarks = query_array('a.gtm-dashboard-home-latest-works-number-link-bookmark');
            for (let [view, like, bookmark] of _.zip(views, likes, bookmarks))
            {
                set_ratio(like, view);
                set_ratio(bookmark, view);
            }
        }
    };

    setInterval(process_all, 500);
})();