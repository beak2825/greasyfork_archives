// ==UserScript==
// @name         Pixiv filter followers page for artists and inline illustrations
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Filters the followers pages to only show those who have illustrations, and also previews some illustrations.
// @description:ja フォロワーのページをイラストのある人だけに絞り込み、一部のイラストをプレビューすることができます。
// @author       Cro
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425459/Pixiv%20filter%20followers%20page%20for%20artists%20and%20inline%20illustrations.user.js
// @updateURL https://update.greasyfork.org/scripts/425459/Pixiv%20filter%20followers%20page%20for%20artists%20and%20inline%20illustrations.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';
    let users = [];
    let last_params = null;

    let fetch_users = function()
    {
        let request = new URL(location);
        let user_id = request.pathname.match(/\d+/g)[0];
        request.pathname = `/ajax/user/${user_id}/followers`;
        let page = 0;
        if (request.search.length > 0)
        {
            page = parseInt(request.search.replace(/\?p=/g, '')) - 1;
        }
        let params = { offset: page * 24, limit: 24, lang: 'en' };
        request.search = new URLSearchParams(params).toString();

        fetch(request, { headers: { 'content-type': 'application/json' } })
        .then(response => response.json())
        .then(function(data)
        {
            users = data.body.users;
        });
    };

    let get_target = user => document.querySelector(`a[href*="${user.userId}"`);

    let add_user_illusts = function(user)
    {
        let target = get_target(user);
        if (target)
        {
            let search_id = 'cro_img';
            let container_parent = target.closest('div').parentNode.parentNode;
            let maybe_img_container = container_parent.querySelector(`div [id="${search_id}"]`);
            if (!maybe_img_container)
            {
                let img_container = document.createElement('div');
                container_parent.append(img_container);
                img_container.style['padding-top'] = '5px';
                img_container.id = search_id;
                for (let illust of user.illusts.slice(0, 3))
                {
                    let a = document.createElement('a');
                    a.href = `/artworks/${illust.id}`;
                    let img = new Image();
                    img.src = illust.url;
                    img.style.height = '100px';
                    img.style.float = 'left';
                    img.style['padding-inline'] = '5px';
                    a.append(img);
                    img_container.append(a);
                }
            }
        }
    };

    let process_users = function()
    {
        if (!location.pathname.endsWith("followers"))
        {
            last_params = null;
            return;
        }

        if (last_params != location.search)
        {
            last_params = location.search;
            fetch_users();
            return;
        }

        for (let user of users)
        {
            if (user.illusts.length == 0)
            {
                let node = get_target(user)?.closest('li')?.remove();
            }
            else
            {
                add_user_illusts(user);
            }
        }
    };

    setInterval(process_users, 250);
})();