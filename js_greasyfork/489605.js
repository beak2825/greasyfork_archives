// ==UserScript==
// @name         YouTube Watch Later Remove Button on Hover
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  Show a remove button on hover over video thumbnails in the Watch Later list
// @license MIT
// @match        https://www.youtube.com/*
// @run-at              document-start
// @grant               none
// @inject-into         page
// @downloadURL https://update.greasyfork.org/scripts/489605/YouTube%20Watch%20Later%20Remove%20Button%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/489605/YouTube%20Watch%20Later%20Remove%20Button%20on%20Hover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let scriptEnable = false;

    const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

    function getItemData(menu) {
        if (!menu) return;
        let items = ((menu || 0).menuRenderer || 0).items || 0;
        if (!(items.length >= 1)) return;
        const filtered = items.filter((entry) => {
            if (!entry || typeof entry !== 'object') return false;
            try {
                const t = (JSON.stringify(entry) || '');
                return t.includes('ACTION_REMOVE_VIDEO');
            } catch (e) {
                return false;
            }
        });
        if (filtered.length !== 1) return;
        let itemData = filtered[0];
        itemData = Object.values(itemData).filter(e => e.serviceEndpoint || e.command)[0];
        if (!itemData) return;
        return itemData;
    }

    const removeButtonOnclick = function (e) {
        const button = this;
        if (!scriptEnable) return;

        let videoElement = button.closest('ytd-thumbnail');
        if (!videoElement) return;
        let renderer = videoElement.closest('ytd-playlist-video-renderer.style-scope.ytd-playlist-video-list-renderer');
        if (!renderer) return;

        let data = insp(renderer).data || 0;
        const itemData = getItemData(data.menu);
        if (!itemData) return;

        e.preventDefault(); // Prevent the default action of the event
        e.stopPropagation(); // Stop the event from bubbling up
        e.stopImmediatePropagation(); // Prevents other listeners of the same event from being called

        const cntNode = (document.querySelector('ytd-app') || renderer);

        (function (data) {

            const a = data.serviceEndpoint;
            const b = data.command;

            a && this.ytComponentBehavior.resolveCommand(a);
            b && this.ytComponentBehavior.resolveCommand(b);

        }).call(insp(cntNode), itemData);

    };

    function createRemoveButton(videoElement) {
        let removeButton = document.createElement('button');
        removeButton.className = 'watch-later-remove-button';
        removeButton.textContent = 'Remove';
        removeButton.style.position = 'absolute';
        removeButton.style.top = '5px';
        removeButton.style.right = '5px';
        removeButton.style.zIndex = '1000';

        removeButton.onclick = removeButtonOnclick;
        videoElement.appendChild(removeButton);
    }

    const mouseenterHandler = function (e) {
        if (!e || !(e.target instanceof HTMLElement)) return;
        if (!scriptEnable) return;
        if (!e.target.classList.contains('ytd-playlist-video-renderer')) return;
        let videoElement = e.target.closest('ytd-thumbnail');
        if (!videoElement) return;
        let renderer = videoElement.closest('ytd-playlist-video-renderer.style-scope.ytd-playlist-video-list-renderer');
        if (!renderer || renderer.is !== 'ytd-playlist-video-renderer') return;
        let data = insp(renderer).data || 0;
        let itemData = getItemData(data.menu);
        if (!itemData) return;
        let button = videoElement.querySelector('button.watch-later-remove-button')
        if (!button) {
            createRemoveButton(videoElement);
        } else {
            button.style.display = '';
        }
    };

    const mouseleaveHandler = function (e) {
        if (!e || !(e.target instanceof HTMLElement)) return;
        if (!e.target.classList.contains('ytd-playlist-video-renderer')) return;
        let button = e.target.querySelector('button.watch-later-remove-button');
        if (button) {
            button.style.display = 'none';
        }
    };


    document.addEventListener('yt-navigate-finish', () => {

        const newEnable = location.pathname === '/playlist' && location.search.includes('list=WL');

        if (scriptEnable ^ newEnable) {

            if (scriptEnable) {
                scriptEnable = false;
                document.removeEventListener('mouseenter', mouseenterHandler, true);
                document.removeEventListener('mouseleave', mouseleaveHandler, true);
            } else if (newEnable) {
                scriptEnable = true;
                document.addEventListener('mouseenter', mouseenterHandler, true);
                document.addEventListener('mouseleave', mouseleaveHandler, true);
            }

        }

    }, false);

})();