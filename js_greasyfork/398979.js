// ==UserScript==
// @name         Pixiv extended dashboard statistics.
// @namespace    http://tampermonkey.net/
// @version      0.7
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
            if (maybe_child)
            {
                return maybe_child;
            }
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
            if (target_node && denom_node)
            {
                let value = (count(target_node) / count(denom_node) * 100).toFixed(2);
                get_container(target_node).textContent = ` (${value}%)`;
            }
        };
    };

    let set_ratio = make_set_ratio(`span:last-of-type:not(#${id_name})`);
    let paths = ['/dashboard', '/dashboard/works'];

    let process_all = function()
    {
        if (paths.includes(window.location.pathname))
        {
            let illusts = Array.from(document.querySelectorAll('a[href*="/artworks/')).map(x=>x.href.match(/\d+/)[0]);

            for (let id of illusts)
            {
                let likes = document.querySelector(`a[href="/dashboard/report/artworks?section=rating&id=${id}`);
                let views = document.querySelector(`a[href="/dashboard/report/artworks?section=access&id=${id}`);
                let bookmarks = document.querySelector(`a[href="/bookmark_detail.php?illust_id=${id}`);
                set_ratio(likes, views);
                set_ratio(bookmarks, views);
            }
        }
    };

    setInterval(process_all, 500);
})();