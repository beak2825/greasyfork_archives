// ==UserScript==
// @name         SLR Video review icons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display SLR playlists on thumbnails SLR https://forum.sexlikereal.com/d/6856-mark-videos-as-not-interested
// @author       jambavant
// @match        https://www.sexlikereal.com/tags/*
// @match        https://www.sexlikereal.com/search/*
// @match        https://www.sexlikereal.com/pornstars/*
// @match        https://www.sexlikereal.com/playlists/*
// @match        https://www.sexlikereal.com
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/487111/SLR%20Video%20review%20icons.user.js
// @updateURL https://update.greasyfork.org/scripts/487111/SLR%20Video%20review%20icons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isHidden = sessionStorage.videosHidden === 'true';
    const classifications = ['standing', 'sitting', 'lying-down','no-orgasm','multiple']

    // Function to toggle visibility
    function toggleVisibility() {
        isHidden = !isHidden
        sessionStorage.videosHidden = isHidden;
        toggleButton.textContent = isHidden ? 'Show all videos' : 'Hide reviewed videos';
        document.querySelectorAll('article').forEach(article => {
            if (article.querySelector('button.male-orgasm-icon')) {
                article.style.display = isHidden ? 'none' : '';
            }
        });
    }

    // Create and style toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = isHidden ? 'Show all videos' : 'Hide reviewed videos';
    Object.assign(toggleButton.style, {position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: '1000', padding: '10px 20px',
                                       background: 'radial-gradient(circle, rgba(105,105,105,1) 0%, rgba(169,169,169,1) 100%)', color: 'white', border: 'none',
                                       borderRadius: '5px', cursor: 'pointer', fontSize: '16px'});
    toggleButton.addEventListener('click', toggleVisibility);
    document.body.appendChild(toggleButton);


    // Define SVGs
    const svgHTML = `<svg xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <g id="icon-sitting"> <path d="M7.40192 4.5C7 5.19615 7 6.13077 7 8V11.0269C7.43028 10.9999 7.91397 11 8.43477 11H15.5648C16.0858 11 16.5696 10.9999 17 11.0269V8C17 6.13077 17 5.19615 16.5981 4.5C16.3348 4.04394 15.9561 3.66523 15.5 3.40192C14.8038 3 13.8692 3 12 3C10.1308 3 9.19615 3 8.5 3.40192C8.04394 3.66523 7.66523 4.04394 7.40192 4.5Z" fill="#ffd500"></path> <path d="M6.25 15.9914C5.74796 15.9711 5.44406 15.9032 5.236 15.6762C4.93926 15.3523 4.97792 14.9018 5.05525 14.0008C5.11107 13.3503 5.2373 12.9125 5.52274 12.5858C6.0345 12 6.85816 12 8.50549 12H15.4945C17.1418 12 17.9655 12 18.4773 12.5858C18.7627 12.9125 18.8889 13.3503 18.9448 14.0008C19.0221 14.9018 19.0607 15.3523 18.764 15.6762C18.5559 15.9032 18.252 15.9711 17.75 15.9914V20.9999C17.75 21.4142 17.4142 21.7499 17 21.7499C16.5858 21.7499 16.25 21.4142 16.25 20.9999V16H7.75V20.9999C7.75 21.4142 7.41421 21.7499 7 21.7499C6.58579 21.7499 6.25 21.4142 6.25 20.9999V15.9914Z" fill="#ffd500"></path> </g>
                            <g id="icon-lying-down"> <path d="M3 5V19M3 16H21M21 19V13.2C21 12.0799 21 11.5198 20.782 11.092C20.5903 10.7157 20.2843 10.4097 19.908 10.218C19.4802 10 18.9201 10 17.8 10H11V15.7273M7 12H7.01M8 12C8 12.5523 7.55228 13 7 13C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11C7.55228 11 8 11.4477 8 12Z" stroke="#00ff40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
                            <g id="icon-standing"> <title>up</title> <path fill="#009dff" d="M11.25 15.688l-7.656 7.656-3.594-3.688 11.063-11.094 11.344 11.344-3.5 3.5z"></path> </g>
                            <g id="icon-multiple" stroke="#c933ff"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.67129 3.14634C4.47603 3.34161 4.47603 3.65819 4.67129 3.85345L7.14616 6.32833C7.34142 6.52359 7.65801 6.52359 7.85327 6.32833L10.3281 3.85345C10.5234 3.65819 10.5234 3.34161 10.3281 3.14634L7.85327 0.671471C7.65801 0.476209 7.34142 0.476209 7.14616 0.671471L4.67129 3.14634ZM7.49971 5.26766L5.73195 3.4999L7.49971 1.73213L9.26748 3.4999L7.49971 5.26766ZM8.67129 7.14634C8.47603 7.34161 8.47603 7.65819 8.67129 7.85345L11.1462 10.3283C11.3414 10.5236 11.658 10.5236 11.8533 10.3283L14.3281 7.85345C14.5234 7.65819 14.5234 7.34161 14.3281 7.14634L11.8533 4.67147C11.658 4.47621 11.3414 4.47621 11.1462 4.67147L8.67129 7.14634ZM11.4997 9.26766L9.73195 7.4999L11.4997 5.73213L13.2675 7.4999L11.4997 9.26766ZM4.67129 11.8535C4.47603 11.6582 4.47603 11.3416 4.67129 11.1463L7.14616 8.67147C7.34142 8.47621 7.65801 8.47621 7.85327 8.67147L10.3281 11.1463C10.5234 11.3416 10.5234 11.6582 10.3281 11.8535L7.85327 14.3283C7.65801 14.5236 7.34142 14.5236 7.14616 14.3283L4.67129 11.8535ZM5.73195 11.4999L7.49971 13.2677L9.26748 11.4999L7.49971 9.73213L5.73195 11.4999ZM0.671288 7.14649C0.476026 7.34175 0.476026 7.65834 0.671288 7.8536L3.14616 10.3285C3.34142 10.5237 3.65801 10.5237 3.85327 10.3285L6.32814 7.8536C6.5234 7.65834 6.5234 7.34175 6.32814 7.14649L3.85327 4.67162C3.65801 4.47636 3.34142 4.47636 3.14616 4.67162L0.671288 7.14649ZM3.49972 9.26781L1.73195 7.50005L3.49972 5.73228L5.26748 7.50005L3.49972 9.26781Z" fill="#000000"></path> </g>
                            <g id="icon-no-orgasm"> <title>cross</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-469.000000, -1041.000000)" fill="#ff0000"> <path d="M487.148,1053.48 L492.813,1047.82 C494.376,1046.26 494.376,1043.72 492.813,1042.16 C491.248,1040.59 488.712,1040.59 487.148,1042.16 L481.484,1047.82 L475.82,1042.16 C474.257,1040.59 471.721,1040.59 470.156,1042.16 C468.593,1043.72 468.593,1046.26 470.156,1047.82 L475.82,1053.48 L470.156,1059.15 C468.593,1060.71 468.593,1063.25 470.156,1064.81 C471.721,1066.38 474.257,1066.38 475.82,1064.81 L481.484,1059.15 L487.148,1064.81 C488.712,1066.38 491.248,1066.38 492.813,1064.81 C494.376,1063.25 494.376,1060.71 492.813,1059.15 L487.148,1053.48" id="cross" sketch:type="MSShapeGroup"> </path> </g> </g> </g>
                        </defs>
                     </svg>`;

    // Inject the SVG into the body once so we can reference it with use
    document.body.insertAdjacentHTML('beforeend', svgHTML);

    function fetchPlaylistsAndUpdateVideos() {

        const url = `https://www.sexlikereal.com/ajax_playlists/getList?project_id=${globalObj.projectId}&user_id=${globalObj.userId}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const result = JSON.parse(response.responseText);
                document.querySelectorAll('article').forEach(article => {
                    result.list.forEach(playlist => {
                        if (classifications.includes(playlist.title) && playlist.scenes.includes(Number(article.getAttribute('data-scene-id')))) {
                            const watchLaterButton = article.querySelector('.c-playlist-watch-later-trigger--btn');
                            const svgUseElement = `<button class="o-btn o-btn--small2 o-btn--text o-btn--squared js-m-tooltips male-orgasm-icon"><span class="o-icon o-icon--small"><svg class="o-icon o-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><use href="#icon-${playlist.title}"></use></svg></span></button>`;
                            watchLaterButton.parentNode.insertAdjacentHTML('beforeend', svgUseElement);
                            article.style.display = isHidden ? 'none' : '';
                        };
                    });
                });
            },
            onerror: function(error) {
                console.error('Error fetching playlists:', error);
            }
        });
    }

    fetchPlaylistsAndUpdateVideos();
})();
