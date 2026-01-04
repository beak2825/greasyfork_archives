// ==UserScript==
// @name         Margonem Spotify Player
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Integracja odtwarzacza Spotify Web Playback SDK w grze Margonem
// @author       Fiddlio
// @match        http://*.margonem.pl/*
// @match        https://*.margonem.pl/*
// @match        http://*.margonem.com/*
// @match        https://*.margonem.com/*
// @exclude      https://commons.margonem.pl/*
// @exclude      https://forum.margonem.pl/*
// @exclude      https://margonem.pl/*
// @exclude      https://www.margonem.pl/*
// @exclude      https://margonem.com/*
// @exclude      https://www.margonem.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528548/Margonem%20Spotify%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/528548/Margonem%20Spotify%20Player.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Konfiguracja Spotify API
    const SPOTIFY_EMBED_URL = 'https://open.spotify.com/embed?uri='; // Podstawowy URL odtwarzacza
    let PLAYLIST_URI = localStorage.getItem('spotifyPlaylistURI') || 'spotify:playlist:37i9dQZEVXbN6itCcaL3Tt'; // URI domyślnej playlisty
    let player;

    // Tworzenie iframe z odtwarzaczem Spotify
    function createSpotifyIframe() {
        const container = document.createElement('div');
        container.id = 'spotify-player-wrapper';
        container.style.position = 'fixed';
        const savedPosition = JSON.parse(localStorage.getItem('spotifyPlayerPosition'));
if (savedPosition) {
    container.style.top = savedPosition.top;
    container.style.left = savedPosition.left;
} else {
    container.style.top = '10px';
    container.style.left = '10px';
}
        container.style.width = '230px';
        container.style.height = '400px';
        container.style.border = '4px solid #B3B3B3';
        container.style.borderRadius = '15px';
        container.style.backgroundColor = 'transparent';
        container.style.zIndex = '9999';
        container.style.cursor = 'move';

        const iframe = document.createElement('iframe');
        iframe.id = 'spotify-iframe';
        iframe.src = `${SPOTIFY_EMBED_URL}${encodeURIComponent(PLAYLIST_URI)}&theme=0`;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';

        const resizeHandle = document.createElement('div');
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.width = '20px';
        resizeHandle.style.height = '20px';
        resizeHandle.style.bottom = '0';
        resizeHandle.style.right = '0';
        resizeHandle.style.cursor = 'se-resize';
        resizeHandle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        resizeHandle.style.borderRadius = '50%';

        container.appendChild(iframe);
        container.appendChild(resizeHandle);
        document.body.appendChild(container);

        // Dodanie przycisku zamknięcia
const closeButton = document.createElement('button');
closeButton.innerHTML = '✖';
closeButton.style.position = 'absolute';
closeButton.style.top = '1px';
closeButton.style.left = '1px';
closeButton.style.backgroundColor = 'transparent';
closeButton.style.color = '#fff';
closeButton.style.border = 'none';
closeButton.style.borderRadius = '50%';
closeButton.style.cursor = 'pointer';
closeButton.style.width = '20px';
closeButton.style.height = '20px';
closeButton.style.fontSize = '14px';
closeButton.style.textAlign = 'center';
closeButton.style.lineHeight = '18px';
closeButton.addEventListener('click', () => {
    container.style.display = 'none';
});

container.appendChild(closeButton);

        // Dodanie obsługi przesuwania
        enableDragging(container);

        // Dodanie obsługi skalowania
        enableResizing(container, resizeHandle);

        return iframe;
    }

    // Funkcja dodająca możliwość przesuwania elementu
    function enableDragging(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();

            // Pobierz początkowe położenie kursora
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            // Oblicz przesunięcie kursora
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // Ustaw nowe położenie elementu
            element.style.top = (element.offsetTop - pos2) + 'px';
            element.style.left = (element.offsetLeft - pos1) + 'px';

            localStorage.setItem('spotifyPlayerPosition', JSON.stringify({
    top: element.style.top,
    left: element.style.left
}));
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Funkcja dodająca możliwość skalowania elementu
    function enableResizing(element, handle) {
        let startX, startY, startWidth, startHeight;

        handle.onmousedown = function (e) {
            e = e || window.event;
            e.preventDefault();

            // Początkowe położenie kursora i rozmiar elementu
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);

            document.onmouseup = stopResizing;
            document.onmousemove = resizeElement;
        };

        function resizeElement(e) {
            e = e || window.event;
            e.preventDefault();

            // Oblicz nowy rozmiar elementu
            element.style.width = (startWidth + e.clientX - startX) + 'px';
            element.style.height = (startHeight + e.clientY - startY) + 'px';
        }

        function stopResizing() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Funkcja tworząca przycisk do chowania/wywoływania odtwarzacza
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'spotify-toggle-button';
        const img = document.createElement('img');
        img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/252px-Spotify_logo_without_text.svg.png';
        img.alt = 'Spotify';
        img.style.width = '18px';
        img.style.height = '18px';
        button.appendChild(img);
        button.style.position = 'fixed';
        button.style.bottom = '0.5%';
        button.style.right = '78%';
        button.style.padding = '10px';
        button.style.backgroundColor = '#212121';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';
        document.body.appendChild(button);

        return button;
    }

    // Funkcja tworząca okno do ustawienia playlisty
    function createPlaylistConfig() {
        const configContainer = document.createElement('div');
        configContainer.id = 'playlist-config-wrapper';
        configContainer.style.position = 'fixed';
        configContainer.style.top = '50%';
        configContainer.style.left = '50%';
        configContainer.style.transform = 'translate(-50%, -50%)';
        configContainer.style.width = '300px';
        configContainer.style.padding = '20px';
        configContainer.style.backgroundColor = '#ffffff';
        configContainer.style.border = '2px solid #1DB954';
        configContainer.style.borderRadius = '10px';
        configContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        configContainer.style.zIndex = '10000';
        configContainer.style.display = 'none';

        const label = document.createElement('label');
        label.innerText = 'Wprowadź link do playlisty Spotify:';
        label.style.display = 'block';
        label.style.marginBottom = '10px';

        const input = document.createElement('input');
        input.type = 'text';
        input.style.width = '100%';
        input.style.padding = '5px';
        input.style.marginBottom = '10px';
        input.value = PLAYLIST_URI;

        const saveButton = document.createElement('button');
        saveButton.innerText = 'Zapisz';
        saveButton.style.padding = '10px';
        saveButton.style.backgroundColor = '#1DB954';
        saveButton.style.color = '#ffffff';
        saveButton.style.border = 'none';
        saveButton.style.cursor = 'pointer';
        saveButton.style.width = '100%';

        saveButton.addEventListener('click', () => {
    PLAYLIST_URI = input.value;
    localStorage.setItem('spotifyPlaylistURI', PLAYLIST_URI); // Zapisz w localStorage
    const iframe = document.getElementById('spotify-iframe');
    iframe.src = `${SPOTIFY_EMBED_URL}${encodeURIComponent(PLAYLIST_URI)}&theme=0`;
    configContainer.style.display = 'none';
});

        configContainer.appendChild(label);
        configContainer.appendChild(input);
        configContainer.appendChild(saveButton);
        document.body.appendChild(configContainer);

        return configContainer;
    }

    // Funkcja chowania/wywoływania odtwarzacza
    function toggleSpotifyPlayer() {
        const player = document.getElementById('spotify-player-wrapper');
        if (player) {
            if (player.style.display === 'none') {
                player.style.display = 'block';
            } else {
                player.style.display = 'none';
            }
        } else {
            console.warn('Odtwarzacz Spotify nie został znaleziony.');
        }
    }

    // Dodanie przycisku do strony
    function addToggleButton() {
        const button = createToggleButton();
        button.addEventListener('click', toggleSpotifyPlayer);

        const configButton = document.createElement('button');
        configButton.id = 'playlist-config-button';
        configButton.innerText = '⚙️';
        configButton.style.position = 'fixed';
        configButton.style.bottom = '0.7%';
        configButton.style.right = '80%';
        configButton.style.padding = '10px';
        configButton.style.backgroundColor = '#212121';
        configButton.style.color = '#ffffff';
        configButton.style.border = 'none';
        configButton.style.borderRadius = '5px';
        configButton.style.cursor = 'pointer';
        configButton.style.zIndex = '9999';

        const configContainer = createPlaylistConfig();

        configButton.addEventListener('click', () => {
            configContainer.style.display = configContainer.style.display === 'none' ? 'block' : 'none';
        });

        document.body.appendChild(configButton);
    }

    // Inicjalizacja iFrame API
    function initializeIFrameAPI() {
        const iframe = createSpotifyIframe();
        iframe.onload = () => {
            window.SpotifyIframeApi.createController(
                iframe,
                {
                    uri: PLAYLIST_URI,
                },
                (controller) => {
                    player = controller;

                    // Rejestracja zdarzeń
                    registerPlayerEvents(controller);
                }
            );
        };
    }

    // Rejestracja zdarzeń odtwarzacza
    function registerPlayerEvents(controller) {
        controller.addListener('ready', () => {
            console.log('Spotify iFrame Player is ready!');
        });

        controller.addListener('play', () => {
            console.log('Playback started!');
        });

        controller.addListener('pause', () => {
            console.log('Playback paused!');
        });

        controller.addListener('end', () => {
            console.log('Playback ended!');
        });
    }

    // Inicjalizacja skryptu
    function init() {
        if (typeof window.SpotifyIframeApi === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://open.spotify.com/embed-podcast/iframe-api/v1';
            document.body.appendChild(script);
            script.onload = initializeIFrameAPI;
        } else {
            initializeIFrameAPI();
        }

        addToggleButton();
    }

    init();
})();

