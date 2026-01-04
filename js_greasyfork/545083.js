// ==UserScript==
// @name         Drawaria - Music Player PRO (Fixed)
// @namespace    http://violentmonkey.com/
// @version      6.7
// @description  Мод-меню для прослушивания музыки
// @match        *://drawaria.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545083/Drawaria%20-%20Music%20Player%20PRO%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545083/Drawaria%20-%20Music%20Player%20PRO%20%28Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Стили
    const style = document.createElement('style');
    style.textContent = `
    #music-mod {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        max-height: 80vh;
        background: rgba(10, 15, 25, 0.95);
        border: 1px solid #1e3a5a;
        border-radius: 12px;
        padding: 0;
        z-index: 9999;
        color: white;
        font-family: 'Segoe UI', sans-serif;
        box-shadow: 0 10px 25px rgba(0, 50, 100, 0.5);
        backdrop-filter: blur(8px);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }
    
    #music-mod-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: linear-gradient(to right, #0a1a2a, #0d2b40);
        cursor: move;
        user-select: none;
    }
    
    #music-mod-title {
        margin: 0;
        color: #00e1ff;
        font-size: 18px;
        font-weight: 600;
        text-shadow: 0 0 10px rgba(0, 225, 255, 0.5);
    }
    
    #music-mod-controls {
        display: flex;
        gap: 8px;
    }
    
    .mod-btn-control {
        width: 24px;
        height: 24px;
        border: none;
        border-radius: 6px;
        background: rgba(0, 150, 255, 0.2);
        color: #00e1ff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .mod-btn-control:hover {
        background: rgba(0, 180, 255, 0.4);
        transform: scale(1.1);
    }
    
    #music-mod-content {
        padding: 15px;
        overflow-y: auto;
        max-height: calc(80vh - 60px);
    }
    
    .mod-btn {
        width: 100%;
        padding: 12px 15px;
        margin: 8px 0;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #0d2b40, #003366);
        color: white;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    
    .mod-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(0, 200, 255, 0.3), transparent);
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .mod-btn:hover {
        background: linear-gradient(135deg, #0e3a5a, #004488);
        box-shadow: 0 6px 10px rgba(0, 100, 200, 0.3);
        transform: translateY(-2px);
    }
    
    .mod-btn:hover::before {
        opacity: 1;
    }
    
    .mod-btn:active {
        transform: translateY(0);
    }
    
    .mod-btn i {
        font-size: 16px;
    }
    
    .mod-section {
        margin: 15px 0;
        padding: 15px;
        background: rgba(5, 15, 25, 0.5);
        border-radius: 10px;
        border: 1px solid #1a3a5a;
    }
    
    .mod-section-title {
        margin: 0 0 12px 0;
        color: #00a8ff;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    #music-mod-content::-webkit-scrollbar {
        width: 6px;
    }
    
    #music-mod-content::-webkit-scrollbar-track {
        background: rgba(10, 20, 30, 0.3);
        border-radius: 3px;
    }
    
    #music-mod-content::-webkit-scrollbar-thumb {
        background: linear-gradient(#00a8ff, #0088ff);
        border-radius: 3px;
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 200, 255, 0.4); }
        70% { box-shadow: 0 0 0 12px rgba(0, 200, 255, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 200, 255, 0); }
    }
    
    .playing {
        animation: pulse 2s infinite;
    }
    
    select, input[type="text"], input[type="range"] {
        width: 100%;
        padding: 8px;
        margin: 5px 0;
        background: rgba(0, 20, 40, 0.7);
        border: 1px solid #1a3a5a;
        border-radius: 6px;
        color: white;
    }
    
    input[type="range"] {
        padding: 0;
        height: 6px;
        -webkit-appearance: none;
    }
    
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        background: #00e1ff;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 5px rgba(0, 225, 255, 0.5);
    }

    .search-container {
        position: relative;
        margin: 10px 0;
    }

    .search-input {
        width: 100%;
        padding: 8px 35px 8px 10px;
        background: rgba(0, 20, 40, 0.7);
        border: 1px solid #1a3a5a;
        border-radius: 6px;
        color: white;
    }

    .search-clear {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #00e1ff;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .search-clear:hover {
        color: #ff5555;
    }

    .bass-boost-active {
        background: linear-gradient(135deg, #3d2d69, #5a3a8a) !important;
    }

    /* Стили для инструкции */
    #instruction-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    #instruction-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    #instruction-modal {
        background: linear-gradient(135deg, #0a1a2a, #0d2b40);
        border: 2px solid #00e1ff;
        border-radius: 15px;
        padding: 25px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        color: white;
        font-family: 'Segoe UI', sans-serif;
        box-shadow: 0 10px 30px rgba(0, 225, 255, 0.3);
        transform: scale(0.9);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }

    #instruction-overlay.active #instruction-modal {
        transform: scale(1);
        opacity: 1;
    }

    #instruction-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #00e1ff;
    }

    #instruction-title {
        color: #00e1ff;
        font-size: 22px;
        font-weight: 600;
        text-shadow: 0 0 10px rgba(0, 225, 255, 0.5);
        margin: 0;
    }

    #instruction-close {
        background: none;
        border: none;
        color: #00e1ff;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    #instruction-close:hover {
        color: #ff5555;
        transform: scale(1.1);
    }

    #instruction-content {
        line-height: 1.6;
    }

    .instruction-section {
        margin-bottom: 20px;
    }

    .instruction-section h3 {
        color: #00a8ff;
        margin: 0 0 10px 0;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .instruction-section ul {
        margin: 0;
        padding-left: 20px;
    }

    .instruction-section li {
        margin-bottom: 8px;
        color: #e0f7ff;
    }

    .instruction-author {
        text-align: center;
        margin-top: 25px;
        padding-top: 15px;
        border-top: 1px solid #00e1ff;
        color: #88ccff;
        font-size: 14px;
    }

    .instruction-author a {
        color: #00e1ff;
        text-decoration: none;
        transition: color 0.2s;
    }

    .instruction-author a:hover {
        color: #ff5555;
        text-shadow: 0 0 5px rgba(255, 85, 85, 0.5);
    }
    `;
    document.head.appendChild(style);

    // HTML структура с добавлением басс буста и инструкции
    const mod = document.createElement('div');
    mod.id = 'music-mod';
    mod.innerHTML = `
    <div id="music-mod-header">
        <h3 id="music-mod-title">MUSIC PLAYER PRO</h3>
        <div id="music-mod-controls">
            <button id="collapse-btn" class="mod-btn-control">−</button>
            <button id="close-btn" class="mod-btn-control">×</button>
        </div>
    </div>
    <div id="music-mod-content">
        <div class="mod-section">
            <div class="mod-section-title">🎵 УПРАВЛЕНИЕ МУЗЫКОЙ</div>
            <button id="add-music-btn" class="mod-btn"><i>🎵</i> ДОБАВИТЬ ТРЕКИ</button>
            <input type="file" id="file-input" accept=".mp3,audio/*" multiple style="display:none">
            
            <div class="search-container">
                <input type="text" id="search-input" class="search-input" placeholder="🔍 Поиск музыки...">
                <button id="search-clear" class="search-clear">×</button>
            </div>
            
            <select id="song-list" size="4"></select>
            
            <div style="display:flex; gap:8px; margin-top:10px;">
                <button id="play-btn" class="mod-btn" style="flex:1;"><i>▶️</i> ИГРАТЬ</button>
                <button id="stop-btn" class="mod-btn" style="flex:1;"><i>⏹</i> СТОП</button>
            </div>
            
            <div style="display:flex; gap:8px;">
                <button id="prev-btn" class="mod-btn" style="flex:1;"><i>⏮</i> НАЗАД</button>
                <button id="next-btn" class="mod-btn" style="flex:1;"><i>⏭</i> ВПЕРЕД</button>
            </div>

            <div style="display:flex; gap:8px; margin-top:10px;">
                <button id="reverse-btn" class="mod-btn" style="flex:1;"><i>↕️</i> ОБРАТНЫЙ</button>
                <button id="normal-btn" class="mod-btn" style="flex:1;"><i>↔️</i> НОРМАЛЬНЫЙ</button>
            </div>
        </div>
        
        <div class="mod-section">
            <div class="mod-section-title">⚙️ НАСТРОЙКИ</div>
            <div style="margin:12px 0;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="color:#88ccff;">СКОРОСТЬ:</span>
                    <span id="speed-value" style="color:#00e1ff;">1.0x</span>
                </div>
                <input type="range" id="speed-slider" min="0.5" max="2" step="0.1" value="1">
            </div>
            
            <div style="margin:12px 0;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="color:#88ccff;">ГРОМКОСТЬ:</span>
                    <span id="volume-value" style="color:#00e1ff;">70%</span>
                </div>
                <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="0.7">
            </div>

            <div style="margin:12px 0;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="color:#88ccff;">ПОВТОРОВ:</span>
                    <span id="loop-count-value" style="color:#00e1ff;">∞</span>
                </div>
                <input type="range" id="loop-count-slider" min="0" max="10" step="1" value="0">
            </div>

            <div style="margin:12px 0;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="color:#88ccff;">БАСС БУСТ:</span>
                    <span id="bass-boost-value" style="color:#00e1ff;">0%</span>
                </div>
                <input type="range" id="bass-boost-slider" min="0" max="100" step="5" value="0">
            </div>
            
            <div style="display:flex; gap:8px;">
                <button id="loop-btn" class="mod-btn" style="flex:1;"><i>🔁</i> ПОВТОР</button>
                <button id="shuffle-btn" class="mod-btn" style="flex:1;"><i>🔀</i> МИКС</button>
            </div>

            <button id="bass-boost-btn" class="mod-btn"><i>🔊</i> БАСС БУСТ</button>
        </div>
        
        <div class="mod-section">
            <div class="mod-section-title">💾 УПРАВЛЕНИЕ ПЛЕЙЛИСТАМИ</div>
            <input type="text" id="playlist-name" placeholder="Имя плейлиста">
            <button id="save-playlist-btn" class="mod-btn"><i>💾</i> СОХРАНИТЬ</button>
            <select id="playlist-select"></select>
            <div style="display:flex; gap:8px;">
                <button id="load-playlist-btn" class="mod-btn" style="flex:1;"><i>📂</i> ЗАГРУЗИТЬ</button>
                <button id="delete-playlist-btn" class="mod-btn" style="flex:1;"><i>🗑️</i> УДАЛИТЬ</button>
            </div>
        </div>

        <div class="mod-section">
            <div class="mod-section-title">📖 ИНСТРУКЦИЯ</div>
            <button id="instruction-btn" class="mod-btn"><i>❓</i> ИНСТРУКЦИЯ</button>
        </div>
    </div>
    `;
    document.body.appendChild(mod);

    // Создаем модальное окно для инструкции
    const instructionOverlay = document.createElement('div');
    instructionOverlay.id = 'instruction-overlay';
    instructionOverlay.innerHTML = `
    <div id="instruction-modal">
        <div id="instruction-header">
            <h2 id="instruction-title">📖 ИНСТРУКЦИЯ</h2>
            <button id="instruction-close">×</button>
        </div>
        <div id="instruction-content">
            <div class="instruction-section">
                <h3>🎵 УПРАВЛЕНИЕ МУЗЫКОЙ</h3>
                <ul>
                    <li><strong>ДОБАВИТЬ ТРЕКИ</strong> - загрузите MP3-файлы с компьютера</li>
                    <li><strong>ИГРАТЬ/ПАУЗА</strong> - начать или приостановить воспроизведение</li>
                    <li><strong>СТОП</strong> - полностью остановить трек</li>
                    <li><strong>НАЗАД/ВПЕРЕД</strong> - переключение между треками</li>
                    <li><strong>ОБРАТНЫЙ/НОРМАЛЬНЫЙ</strong> - изменение порядка воспроизведения</li>
                </ul>
            </div>
            
            <div class="instruction-section">
                <h3>⚙️ НАСТРОЙКИ</h3>
                <ul>
                    <li><strong>СКОРОСТЬ</strong> - изменение скорости воспроизведения (0.5x - 2x)</li>
                    <li><strong>ГРОМКОСТЬ</strong> - регулировка уровня громкости</li>
                    <li><strong>ПОВТОРОВ</strong> - количество повторений трека (0 = бесконечно)</li>
                    <li><strong>БАСС БУСТ</strong> - уровень усиления низких частот (0%-100%)</li>
                    <li><strong>ПОВТОР</strong> - повтор трека или всего плейлиста</li>
                    <li><strong>МИКС</strong> - случайное перемешивание плейлиста</li>
                </ul>
            </div>
            
            <div class="instruction-section">
                <h3>💾 УПРАВЛЕНИЕ ПЛЕЙЛИСТАМИ</h3>
                <ul>
                    <li>Введите название и нажмите <strong>СОХРАНИТЬ</strong> для создания плейлиста</li>
                    <li>Выберите плейлист и нажмите <strong>ЗАГРУЗИТЬ</strong> для восстановления</li>
                    <li><strong>УДАЛИТЬ</strong> - удаление выбранного плейлиста</li>
                </ul>
            </div>
            
            <div class="instruction-section">
                <h3>🔍 ПОИСК</h3>
                <ul>
                    <li>Используйте поле поиска для быстрого поиска треков по названию</li>
                    <li>Кнопка "×" очищает поисковый запрос</li>
                </ul>
            </div>
            
            <div class="instruction-section">
                <h3>📌 ПОДСКАЗКИ</h3>
                <ul>
                    <li>Перетаскивайте окно за верхнюю панель</li>
                    <li>Используйте кнопки "−" и "×" для сворачивания и закрытия</li>
                    <li>При поиске отображаются только подходящие треки</li>
                </ul>
            </div>
            
            <div class="instruction-author">
                Автор этого скрипта: лазер дмитрий прайм<br>
                YouTube: <a href="https://www.youtube.com/@laz3r_dim" target="_blank">https://www.youtube.com/@laz3r_dim</a>
            </div>
        </div>
    </div>
    `;
    document.body.appendChild(instructionOverlay);

    // Инициализация плеера
    const audio = new Audio();
    let songs = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let loopMode = true;
    let isShuffled = false;
    let originalPlaylist = [];
    let reverseMode = false;
    let loopCount = 0;
    let currentLoop = 0;
    let filteredSongs = [];
    let isSearching = false;
    let bassBoostEnabled = false;
    let bassBoostLevel = 0;
    
    // Создаем AudioContext для басс буста
    let audioContext = null;
    let source = null;
    let gainNode = null;
    let biquadFilter = null;
    
    // Получаем все элементы
    const modElement = document.getElementById('music-mod');
    const header = document.getElementById('music-mod-header');
    const content = document.getElementById('music-mod-content');
    const collapseBtn = document.getElementById('collapse-btn');
    const closeBtn = document.getElementById('close-btn');
    const addBtn = document.getElementById('add-music-btn');
    const fileInput = document.getElementById('file-input');
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    const songList = document.getElementById('song-list');
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const reverseBtn = document.getElementById('reverse-btn');
    const normalBtn = document.getElementById('normal-btn');
    const loopBtn = document.getElementById('loop-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const speedSlider = document.getElementById('speed-slider');
    const volumeSlider = document.getElementById('volume-slider');
    const loopCountSlider = document.getElementById('loop-count-slider');
    const bassBoostSlider = document.getElementById('bass-boost-slider');
    const bassBoostBtn = document.getElementById('bass-boost-btn');
    const playlistNameInput = document.getElementById('playlist-name');
    const savePlaylistBtn = document.getElementById('save-playlist-btn');
    const playlistSelect = document.getElementById('playlist-select');
    const loadPlaylistBtn = document.getElementById('load-playlist-btn');
    const deletePlaylistBtn = document.getElementById('delete-playlist-btn');
    const instructionBtn = document.getElementById('instruction-btn');
    const instructionClose = document.getElementById('instruction-close');

    // Ключ для хранения плейлистов
    const PLAYLIST_STORAGE_KEY = "music_player_playlists";
    
    // Функция показа/скрытия инструкции
    function toggleInstruction(show) {
        if (show) {
            instructionOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            instructionOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Функция инициализации AudioContext
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            biquadFilter = audioContext.createBiquadFilter();
            
            biquadFilter.type = 'lowshelf';
            biquadFilter.frequency.setValueAtTime(150, audioContext.currentTime);
            
            biquadFilter.connect(gainNode);
            gainNode.connect(audioContext.destination);
        }
    }

    // Функция применения басс буста
    function applyBassBoost() {
        if (!bassBoostEnabled || !audioContext) return;
        
        const gainValue = bassBoostLevel / 100 * 20; // 0 to 20 dB boost
        biquadFilter.gain.setValueAtTime(gainValue, audioContext.currentTime);
    }

    // Функция включения/выключения басс буста
    function toggleBassBoost() {
        bassBoostEnabled = !bassBoostEnabled;
        
        if (bassBoostEnabled) {
            initAudioContext();
            applyBassBoost();
            bassBoostBtn.classList.add('bass-boost-active');
            bassBoostBtn.innerHTML = '<i>🔊</i> БАСС ВКЛ';
        } else {
            if (biquadFilter) {
                biquadFilter.gain.setValueAtTime(0, audioContext.currentTime);
            }
            bassBoostBtn.classList.remove('bass-boost-active');
            bassBoostBtn.innerHTML = '<i>🔊</i> БАСС БУСТ';
        }
    }

    // Функция установки уровня басс буста
    function setBassBoostLevel(level) {
        bassBoostLevel = level;
        document.getElementById('bass-boost-value').textContent = `${level}%`;
        
        if (bassBoostEnabled) {
            applyBassBoost();
        }
    }

    // Функция создания аудио ноды для обработки
    function createAudioNode() {
        if (!audioContext) return;
        
        if (source) {
            source.disconnect();
        }
        
        source = audioContext.createMediaElementSource(audio);
        source.connect(biquadFilter);
        
        if (bassBoostEnabled) {
            applyBassBoost();
        }
    }

    // Функция поиска музыки
    function searchMusic(query) {
        if (!query.trim()) {
            isSearching = false;
            filteredSongs = [];
            updateSongList();
            return;
        }

        isSearching = true;
        const searchTerm = query.toLowerCase().trim();
        filteredSongs = songs.filter(song => 
            song.name.toLowerCase().includes(searchTerm)
        );
        updateSongList();
    }

    // Функция очистки поиска
    function clearSearch() {
        searchInput.value = '';
        isSearching = false;
        filteredSongs = [];
        updateSongList();
    }

    // Функция сохранения плейлиста
    function savePlaylist() {
        const name = playlistNameInput.value.trim();
        if (!name) {
            alert("Пожалуйста, введите название плейлиста!");
            return;
        }
        
        // Получаем текущий список плейлистов
        const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "{}");
        
        // Сохраняем плейлист
        playlists[name] = {
            songs: songs.map(song => ({
                name: song.name,
                url: song.url
            })),
            currentIndex: currentSongIndex
        };
        
        localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
        updatePlaylists();
        alert(`Плейлист "${name}" успешно сохранен!`);
        playlistNameInput.value = '';
    }
    
    // Функция загрузки плейлиста
    function loadPlaylist() {
        const name = playlistSelect.value;
        if (!name) return;
        
        const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "{}");
        const playlist = playlists[name];
        
        if (playlist) {
            songs = playlist.songs;
            currentSongIndex = playlist.currentIndex || 0;
            clearSearch();
            updateSongList();
            alert(`Плейлист "${name}" загружен!`);
        } else {
            alert("Плейлист не найден!");
        }
    }
    
    // Функция удаления плейлиста
    function deletePlaylist() {
        const name = playlistSelect.value;
        if (!name) return;
        
        if (confirm(`Вы уверены, что хотите удалить плейлист "${name}"?`)) {
            const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "{}");
            delete playlists[name];
            localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
            updatePlaylists();
            alert(`Плейлист "${name}" удален!`);
        }
    }
    
    // Обновление списка плейлистов в выпадающем меню
    function updatePlaylists() {
        const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "{}");
        const playlistNames = Object.keys(playlists);
        
        // Очищаем список
        playlistSelect.innerHTML = '';
        
        if (playlistNames.length === 0) {
            const option = document.createElement('option');
            option.textContent = "Нет сохраненных плейлистов";
            playlistSelect.appendChild(option);
        } else {
            playlistNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                playlistSelect.appendChild(option);
            });
        }
    }
    
    // Функции плеера
    function playMusic() {
        if (songs.length === 0) {
            alert("Добавьте музыку сначала!");
            return;
        }
        
        const currentSongs = isSearching ? filteredSongs : songs;
        if (currentSongs.length === 0) {
            alert("Ничего не найдено!");
            return;
        }

        const songIndex = isSearching ? songs.findIndex(s => s.url === currentSongs[currentSongIndex].url) : currentSongIndex;
        const song = songs[songIndex];
        
        audio.src = song.url;
        
        // Инициализируем AudioContext если басс буст включен
        if (bassBoostEnabled) {
            initAudioContext();
            createAudioNode();
        }
        
        audio.play()
            .then(() => {
                isPlaying = true;
                playBtn.innerHTML = '<i>⏸</i> ПАУЗА';
                playBtn.classList.add('playing');
            })
            .catch(err => alert("Ошибка воспроизведения: " + err.message));
    }

    function stopMusic() {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        playBtn.innerHTML = '<i>▶️</i> ИГРАТЬ';
        playBtn.classList.remove('playing');
        currentLoop = 0;
    }

    function playNext() {
        const currentSongs = isSearching ? filteredSongs : songs;
        if (currentSongs.length === 0) return;
        
        if (reverseMode) {
            currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
        } else {
            currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
        }
        
        songList.selectedIndex = currentSongIndex;
        if (isPlaying) playMusic();
    }

    function playPrev() {
        const currentSongs = isSearching ? filteredSongs : songs;
        if (currentSongs.length === 0) return;
        
        if (reverseMode) {
            currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
        } else {
            currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
        }
        
        songList.selectedIndex = currentSongIndex;
        if (isPlaying) playMusic();
    }

    function toggleReverseMode() {
        reverseMode = true;
        reverseBtn.style.background = 'linear-gradient(135deg, #0d3b40, #005566)';
        normalBtn.style.background = 'linear-gradient(135deg, #0d2b40, #003366)';
    }

    function toggleNormalMode() {
        reverseMode = false;
        reverseBtn.style.background = 'linear-gradient(135deg, #0d2b40, #003366)';
        normalBtn.style.background = 'linear-gradient(135deg, #0d3b40, #005566)';
    }

    function toggleLoop() {
        loopMode = !loopMode;
        audio.loop = loopMode;
        loopBtn.innerHTML = loopMode ? '<i>🔁</i> ПОВТОР' : '<i>🔂</i> ОДНА';
        loopBtn.style.background = loopMode 
            ? 'linear-gradient(135deg, #0d2b40, #003366)' 
            : 'linear-gradient(135deg, #0d3b40, #005566)';
    }

    function toggleShuffle() {
        isShuffled = !isShuffled;
        
        if (isShuffled) {
            originalPlaylist = [...songs];
            const currentSong = songs[currentSongIndex];
            songs = songs.filter((_, i) => i !== currentSongIndex);
            
            // Перемешиваем
            for (let i = songs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [songs[i], songs[j]] = [songs[j], songs[i]];
            }
            
            songs.unshift(currentSong);
            currentSongIndex = 0;
        } else {
            if (originalPlaylist.length > 0) {
                currentSongIndex = originalPlaylist.findIndex(
                    song => song.url === songs[currentSongIndex].url
                );
                songs = [...originalPlaylist];
            }
        }
        
        shuffleBtn.innerHTML = isShuffled ? '<i>🔀</i> ОБЫЧНЫй' : '<i>🔀</i> МИКС';
        shuffleBtn.style.background = isShuffled 
            ? 'linear-gradient(135deg, #0d3b40, #005566)' 
            : 'linear-gradient(135deg, #0d2b40, #003366)';
            
        updateSongList();
    }

    function updateSongList() {
        const currentSongs = isSearching ? filteredSongs : songs;
        songList.innerHTML = currentSongs.map((song, i) => 
            `<option value="${i}" ${i === currentSongIndex ? 'selected' : ''}>${song.name}</option>`
        ).join('');
        
        // Показываем/скрываем кнопку очистки поиска
        searchClear.style.display = searchInput.value ? 'flex' : 'none';
    }

    // Обработчики кнопок плеера
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playBtn.innerHTML = '<i>▶️</i> ИГРАТЬ';
            playBtn.classList.remove('playing');
        } else {
            playMusic();
        }
    });

    stopBtn.addEventListener('click', stopMusic);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    reverseBtn.addEventListener('click', toggleReverseMode);
    normalBtn.addEventListener('click', toggleNormalMode);
    loopBtn.addEventListener('click', toggleLoop);
    shuffleBtn.addEventListener('click', toggleShuffle);

    // Обработчики басс буста
    bassBoostBtn.addEventListener('click', toggleBassBoost);
    bassBoostSlider.addEventListener('input', (e) => {
        setBassBoostLevel(parseInt(e.target.value));
    });

    // Поиск музыки
    searchInput.addEventListener('input', (e) => {
        searchMusic(e.target.value);
    });

    searchClear.addEventListener('click', clearSearch);

    // Добавление музыки
    addBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.type.startsWith('audio/')) {
                songs.push({
                    name: file.name.replace('.mp3', ''),
                    url: URL.createObjectURL(file),
                    file: file
                });
            }
        });
        clearSearch();
        updateSongList();
    });

    songList.addEventListener('change', (e) => {
        currentSongIndex = e.target.selectedIndex;
        if (isPlaying) playMusic();
    });

    // Настройки звука
    speedSlider.addEventListener('input', () => {
        audio.playbackRate = speedSlider.value;
        document.getElementById('speed-value').textContent = `${speedSlider.value}x`;
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
        document.getElementById('volume-value').textContent = `${Math.round(volumeSlider.value * 100)}%`;
    });

    // Настройка количества повторов
    loopCountSlider.addEventListener('input', () => {
        loopCount = parseInt(loopCountSlider.value);
        if (loopCount === 0) {
            document.getElementById('loop-count-value').textContent = '∞';
        } else {
            document.getElementById('loop-count-value').textContent = `${loopCount}`;
        }
    });

    // Управление окном
    let isDragging = false;
    let offsetX, offsetY;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('mod-btn-control')) return;
        
        isDragging = true;
        const rect = modElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        modElement.style.transition = 'none';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        modElement.style.left = `${e.clientX - offsetX}px`;
        modElement.style.top = `${e.clientY - offsetY}px`;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        modElement.style.transition = 'all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
    });

    let isCollapsed = false;
    collapseBtn.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        content.style.display = isCollapsed ? 'none' : 'block';
        collapseBtn.textContent = isCollapsed ? '+' : '−';
    });

    closeBtn.addEventListener('click', () => {
        modElement.style.transform = 'scale(0.8)';
        modElement.style.opacity = '0';
        setTimeout(() => modElement.remove(), 300);
    });

    // Обработка окончания трека
    audio.addEventListener('ended', () => {
        if (loopMode && loopCount > 0) {
            currentLoop++;
            if (currentLoop >= loopCount) {
                currentLoop = 0;
                playNext();
            } else {
                audio.currentTime = 0;
                audio.play();
            }
        } else if (loopMode) {
            audio.currentTime = 0;
            audio.play();
        } else {
            playNext();
        }
    });

    // Назначаем обработчики для кнопок плейлистов
    savePlaylistBtn.addEventListener('click', savePlaylist);
    loadPlaylistBtn.addEventListener('click', loadPlaylist);
    deletePlaylistBtn.addEventListener('click', deletePlaylist);

    // Назначаем обработчики для инструкции
    instructionBtn.addEventListener('click', () => toggleInstruction(true));
    instructionClose.addEventListener('click', () => toggleInstruction(false));
    instructionOverlay.addEventListener('click', (e) => {
        if (e.target === instructionOverlay) {
            toggleInstruction(false);
        }
    });

    // Закрытие инструкции по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && instructionOverlay.classList.contains('active')) {
            toggleInstruction(false);
        }
    });

    // Инициализация
    audio.volume = volumeSlider.value;
    audio.playbackRate = speedSlider.value;
    updatePlaylists();
    updateSongList();
})();