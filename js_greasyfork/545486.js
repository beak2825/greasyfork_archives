// ==UserScript==
// @name         PHX Collage Builder
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add torrents to and remove torrents from a collage while browsing torrents.php.
// @author       LRC
// @match        https://phoenixproject.app/*
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/545486/PHX%20Collage%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/545486/PHX%20Collage%20Builder.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const SITE_URL = 'https://phoenixproject.app';
    const STORAGE_KEY_ID = 'PHX_COLLAGE_BUILDER_ID';
    const STORAGE_KEY_NAME = 'PHX_COLLAGE_BUILDER_NAME';

    function getUserAuthFn() {
        const $logoutLink = $('html body#torrents div#wrapper div#header div.menu_container div#userinfo.user_mobile_menu_toggle ul#userinfo_username li#nav_logout.brackets a');
        if ($logoutLink.length === 0) {
            console.warn('User is not logged in.');
            return;
        }

        try {
            const href = $logoutLink.attr('href');
            const url = new URL(href, window.location.origin);
            const auth = url.searchParams.get('auth');
            return auth;
        } catch (e) {
            console.error('getUserAuthFn | Error:', e);
            return;
        }
    }

    async function requestCollageHtmlFn(collageId) {
        try {
            const params = new URLSearchParams();
            params.append('id', collageId);

            const response = await fetch(`${SITE_URL}/collages.php?${params.toString()}`, {
                method: "GET",
                headers: { "Content-Type": "text/html; charset=UTF-8" },
            });

            if (response.status === 200) {
                return await response.text();
            } else {
                console.log(`requestCollageHtmlFn | Response Status: ${response.status}`);
            }
        } catch (e) {
            console.error('requestCollageHtmlFn | Error:', e);
            return false;
        }
    }

    async function isTorrentInCollageFn(torrentId, collageId) {
       try {
            const collageHtml = await requestCollageHtmlFn(collageId);

            const regex = new RegExp(`torrents\\.php\\?id=${torrentId}(?!\\d)`);
            return regex.test(collageHtml);
        } catch (e) {
            console.error('isTorrentInCollageFn | Error:', e);
            return false;
        }
    }

    async function sendAddTorrentToCollageFn(torrentId, collageId) {
        const auth = getUserAuthFn();
        if (!auth) return;

        try {
            const params = new URLSearchParams();
            params.append('action', 'add_torrent');
            params.append('auth', auth);
            params.append('collageid', collageId);
            params.append('url', `${SITE_URL}/torrents.php?id=${torrentId}`);

            const response = await fetch(`${SITE_URL}/collages.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body: params.toString()
            });

            if (response.status === 200) {
                return true;
            } else {
                console.warn(`sendAddTorrentToCollageFn | Response Status: ${response.status}`);
                return false;
            }
        } catch (e) {
            console.error('sendAddTorrentToCollageFn | Error:', e);
            return false;
        }
    }

    async function sendRemoveTorrentFromCollageFn(torrentId, collageId) {
        const auth = getUserAuthFn();
        if (!auth) return;

        try {
            const params = new URLSearchParams();
            params.append('action', 'manage_handle');
            params.append('auth', auth);
            params.append('collageid', collageId);
            params.append('groupid', torrentId);
            params.append('submit', 'Remove');

            const response = await fetch(`${SITE_URL}/collages.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body: params.toString()
            });

            if (response.status === 200) {
                return true;
            } else {
                console.warn(`sendAddTorrentToCollageFn | Response Status: ${response.status}`);
                return false;
            }
        } catch (e) {
            console.error('sendAddTorrentToCollageFn | Error:', e);
            return false;
        }
    }

    function handleCollagesFn() {
       const thisCollageId = new URL(window.location.href).searchParams.get('id');
       if (!thisCollageId) return;

       const activeCollageId = localStorage.getItem(STORAGE_KEY_ID);

       const $bookmarkLink = $(`#bookmarklink_collage_${thisCollageId}`);
       if ($bookmarkLink.length === 0) return;

       const isPersonalCollage = $('html body#collage div#wrapper div#content div.thin div.sidebar div.box.box_category div.pad a:eq(0)').text() === 'Personal';

       if (isPersonalCollage) {
           const loggedInUsername = $('html body#collage div#wrapper div#header div.menu_container div#userinfo.user_mobile_menu_toggle ul#userinfo_username li#nav_userinfo a.username').text();
           const collageUsername = $('html body#collage div#wrapper div#content div.thin div.sidebar div.box.box_category div.pad a:eq(1)').text();

           if (loggedInUsername !== collageUsername) {
               const $disabled = $('<a>', {
                   id: `collage_builder_button`,
                   class: 'brackets',
                   href: '#',
                   text: 'Collage builder',
                   title: 'No permits for this construction site',
                   css: {
                       'opacity': '0.69'
                   }
               });

               $bookmarkLink.after(' ', $disabled);
               return;
           }
       }

       const collageName = $('html body#collage div#wrapper div#content div.thin div.header h2').text();

       let isCollageActive = thisCollageId === activeCollageId;

       const $button = $('<a>', {
           id: `collage_builder_button`,
           class: 'brackets',
           href: '#',
           text: isCollageActive ? 'Builder finish' : 'Builder start',
           title: isCollageActive ? `Finish construction on ${collageName}` : `Start construction on ${collageName}`,
           css: { color: isCollageActive ? '#f57d59' : 'white' }
       });

       $button.on('click', function (e) {
           e.preventDefault();

           isCollageActive = !isCollageActive;
           localStorage.setItem(STORAGE_KEY_ID, isCollageActive ? thisCollageId : '');
           localStorage.setItem(STORAGE_KEY_NAME, isCollageActive ? collageName : '');
           $button.text(isCollageActive ? 'Builder finish' : 'Builder start');
           $button.attr('title', isCollageActive ? `Finish construction on ${collageName}` : `Start construction on ${collageName}`);
           $button.css('color', isCollageActive ? '#f57d59' : 'white');
       });

       $bookmarkLink.after(' ', $button);
   }

    async function handleTorrentsFn() {
        const thisTorrentId = new URL(window.location.href).searchParams.get('id');
        if (!thisTorrentId) return;

        const activeCollageId = localStorage.getItem(STORAGE_KEY_ID);
        const activeCollageName = localStorage.getItem(STORAGE_KEY_NAME);

        const $subscribeLink = $(`html body#torrents div#wrapper div#content div.thin div.linkbox a#subscribelink_torrents${thisTorrentId}.brackets`);
        if ($subscribeLink.length === 0) return;

        if (!activeCollageId || !activeCollageName) {
            const $disabled = $('<a>', {
                id: `collage_builder_button`,
                class: 'brackets',
                href: '#',
                text: 'Collage builder',
                title: 'Start construction to build a collage',
                css: {
                    'opacity': '0.69'
                }
            });

            $subscribeLink.after(' ', $disabled);
            return;
        }

        const torrentName = $('html body#torrents div#wrapper div#content div.thin div.header h2 a').text();

        let isTorrentInCollage = await isTorrentInCollageFn(thisTorrentId, activeCollageId);

        const $button = $('<a>', {
            id: `collage_builder_button`,
            class: 'brackets',
            href: '#',
            text: isTorrentInCollage ? 'Collage remove' : 'Collage add',
            title: isTorrentInCollage ? `Remove ${torrentName} from ${activeCollageName}` : `Add ${torrentName} to ${activeCollageName}`,
            css: { color: isTorrentInCollage ? '#f57d59' : 'white' }
        });

        $button.on('click', async function (e) {
            e.preventDefault();

            const isResponseGood = isTorrentInCollage
            ? await sendRemoveTorrentFromCollageFn(thisTorrentId, activeCollageId)
            : await sendAddTorrentToCollageFn(thisTorrentId, activeCollageId);

            if (isResponseGood) {
                isTorrentInCollage = !isTorrentInCollage;
                $button.text(isTorrentInCollage ? 'Collage remove' : 'Collage add');
                $button.attr('title', isTorrentInCollage ? `Remove ${torrentName} from ${activeCollageName}` : `Add ${torrentName} to ${activeCollageName}`);
                $button.css('color', isTorrentInCollage ? '#f57d59' : 'white');
            }
        });

        $subscribeLink.after(' ', $button);
    }

    if (window.location.pathname === '/collages.php') {
        handleCollagesFn();
    }

    else if (window.location.pathname === '/torrents.php') {
        handleTorrentsFn();
    }

})(window.jQuery);