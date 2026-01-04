// ==UserScript==
// @match       *://*/*
// @name        YGGTorrent infinite session
// @description Stay signed in for real
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @version     1.1.0
// @author      KaKi87
// @license     GPL-3.0-or-later
// @namespace   https://git.kaki87.net/KaKi87/userscripts/src/branch/master/YGGTorrentInfiniteSession
// @downloadURL https://update.greasyfork.org/scripts/394508/YGGTorrent%20infinite%20session.user.js
// @updateURL https://update.greasyfork.org/scripts/394508/YGGTorrent%20infinite%20session.meta.js
// ==/UserScript==

/*

 Copyright (C) 2020 - KaKi87

 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program. If not, see https://www.gnu.org/licenses/.

 */

/*
 * [ Function ] Get logout link
 *
 * NOTE : link not in DOM while logged out
 *
 */

const getLogout = () => document.querySelector('[href$="/user/logout"]');

/*
 * [ Event handler ] Delete credentials on logout
 *
 */

const createLogoutHandler = () => {

    const logout = getLogout();

    if(!logout) return;

    logout.addEventListener('click', async event => {

        if(event.isTrusted)

        {

            event.preventDefault();

            await GM.deleteValue('username');

            await GM.deleteValue('password');

            logout.click();

        }

    }, true);

}

/*
 * [ Event listener ] Login callback
 *
 */

const onceLoggedIn = callback => {

    (function waitForLogin(){

        if(getLogout()) callback();

        else setTimeout(waitForLogin, 150);

    })();

};

/*
 * [ Main ]
 *
 */

document.addEventListener('readystatechange', async () => {

    if(document.readyState !== 'complete') return;

    /*
     * [Step #0] Misc
     *
     * Hide native ads
     *
     */

    document.styleSheets[0].insertRule('.ad-alert-wrapper { display: none; }');

    /*
     * [ Step #1 ] Smartly detect YGGTorrent website
     *
     * despite frequent domain name changes
     *
     * using regular expression
     *
     * NOTE : although this expression is pretty strict,
     *
     * it will match any "*.ygg.tld" and "*.yggtorrent.tld"
     *
     */

    if(!window.location.href.match(new RegExp([

        //  EXPRESSION    |     DESIGNATION  | COMMENT

        '^'             , //  start

        'https:\/\/'    , //  protocol       | http_s_ only

        '([^.]+\.)?'    , //  subdomain      | optional

        'ygg(torrent)?' , //  domain         | "ygg" or "yggtorrent"

        '\.[^.]+'       , //  extension      | aka. TLD

        '(\/.+)?'       , //  path           | optional

        '$'               //  end

    ].join('')))) return;

    /*
     * [ Step #2 ] Get login form
     *
     * NOTE : form exists in DOM while logged in
     *
     */

    const form = document.querySelector('#user-login');

    if(!form) return;

    const

        formUsername = form.querySelector('[type=text]'),

        formPassword = form.querySelector('[type=password]');

    /*
     * [ Step #3 ] Handle login & logout
     *
     * Inherent features :
     *
     *  - Save credentials on login
     *
     *  - Delete credentials on logout
     *
     */

    if(getLogout()) createLogoutHandler();

    else onceLoggedIn(() => {

        GM.setValue('username', formUsername.value);

        GM.setValue('password', formPassword.value);

        createLogoutHandler();

    });

    /*
     * [Step #4 ] Auto-login
     *
     */

    const

        username = await GM.getValue('username'),

        password = await GM.getValue('password');

    if(username && password && !getLogout())

    {

        formUsername.value = username;

        formPassword.value = password;

        form.querySelector('[type=submit]').click();

    }

});