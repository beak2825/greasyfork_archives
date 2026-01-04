// ==UserScript==
// @name         YouTube Filter V4
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Hides all videos except those with "vanomas" OR graphics-related keywords. Remembers toggle state.
// @description:ru Скрывает все видео, кроме тех, у которых в заголовке есть "vanomas" ИЛИ ключевые слова о графике. Запоминает состояние кнопки.
// @author       Gemini
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544842/YouTube%20Filter%20V4.user.js
// @updateURL https://update.greasyfork.org/scripts/544842/YouTube%20Filter%20V4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ ---
    // Загружаем сохраненное состояние. Если ничего не сохранено, по умолчанию будет 'true' (включено).
    let isScriptEnabled = GM_getValue('isScriptEnabled', true);

    const keeperNames = ['vanomas', 'ваномас'];

    const graphicsKeywords = [
        // --- English Keywords ---
        'graphics', 'visuals', 'benchmark', 'performance', 'test', 'review', 'comparison', 'analysis', 'rtx', 'ray tracing', 'dlss', 'fsr',
        'ultra settings', 'max settings', 'low vs ultra', 'graphics comparison', 'frame rate', 'fps test', 'pc performance', 'console graphics',
        'ps5', 'xbox series x', '4k', '8k', '1440p', '1080p', 'gameplay', 'walkthrough', 'first look', 'tech analysis', 'digital foundry',
        'hardware unboxed', 'gamers nexus', 'unreal engine', 'ue5', 'unity engine', 'frostbite', 'decima engine', 'id tech', ' Dunia Engine',
        'anvilnext', 'northlight engine', 'redengine', 'cryengine', 'r.a.g.e.', 'glacier engine', 'iw engine', 'source 2',
        'textures', 'shadows', 'lighting', 'reflections', 'anti-aliasing', 'occlusion', 'tessellation', 'shaders', 'rendering',
        'geforce', 'radeon', 'rtx 5090', 'rtx 4090', 'rtx 4080', 'rtx 4070', 'rtx 3090', 'rtx 3080', 'rtx 3070', 'rtx 3060', 'rtx 2080',
        'rx 7900 xtx', 'rx 7800 xt', 'rx 6900 xt', 'rx 6800', 'intel arc', 'next-gen', 'current-gen', 'optimization', 'settings',
        'graphic mod', 'enb series', 'reshade', 'realism', 'photorealism', 'realistic graphics', 'best graphics', 'insane graphics',
        'mind-blowing visuals', 'game engine', 'tech demo', 'showcase', 'visual fidelity', 'image quality', 'iq test', 'frame generation',
        'path tracing', 'global illumination', 'hdr', 'dynamic resolution', 'checkerboarding', 'upscaling', 'native resolution',
        'texture filtering', 'anisotropic filtering', 'level of detail', 'lod', 'draw distance', 'foliage quality', 'water physics',
        'particle effects', 'motion blur', 'depth of field', 'dof', 'chromatic aberration', 'lens flare', 'post-processing',
        'nvidia', 'amd', 'intel', 'cpu bottleneck', 'gpu bound', 'vram usage', 'system requirements', 'can it run', 'frame pacing',
        'stuttering', 'smoothness', '60fps', '120fps', '240fps', 'high refresh rate', 'gsync', 'freesync', 'variable refresh rate',
        'vrr', 'overclocking', 'overclocked', 'stock vs oc', 'driver performance', 'new drivers', 'game ready driver', 'directx 12',
        'dx12', 'directx 11', 'dx11', 'vulkan api', 'api comparison', 'metal api', 'rendering pipeline', 'deferred rendering',
        'forward rendering', 'rasterization', 'compute shaders', 'mesh shaders', 'variable rate shading', 'vrs', 'ai upscaling',
        'tensor cores', 'rdna', 'ampere', 'ada lovelace', 'turing architecture', 'hopper', 'navi', 'sli', 'nvlink',
        'alan wake', 'starfield', 'red dead redemption 2', 'the last of us', 'god of war', 'horizon forbidden west',
        'a plague tale', 'microsoft flight simulator', 'control', 'metro exodus', 'ghost of tsushima', 'death stranding', 'assassin\'s creed',
        , 'final fantasy',
        'avatar frontiers of pandora', 'hellblade 2', 'the matrix awakens', 'fortnite chapter 5',
        'arma', 'star citizen', 'dying light 2', 'hogwarts legacy', 'baldurs gate 3', 'diablo iv',
        'remnant 2', 'lies of p', 'lords of the fallen', 'immortals of aveum', 'ark survival ascended', 'postal',

        // --- Russian Keywords ---
        'графика', 'графон', 'графоний', 'визуал', 'бенчмарк', 'производительность', 'тест', 'сравнение', 'анализ', 'ртх',
        'трассировка лучей', 'длсс', 'фср', 'ультра настройки', 'максимальные настройки', 'низкие против ультра', 'сравнение графики',
        'частота кадров', 'тест фпс', 'фпс', 'производительность пк', 'графика на консолях', 'пс5', 'xbox series x', '4к', '8к',
        '1440p', '1080p', 'первый взгляд', 'теханализ', 'технический анализ',
        'unreal engine 5', 'юнити', 'фростбайт', 'игровой движок', 'технологии', 'технология',
        'текстуры', 'тени', 'освещение', 'отражения', 'сглаживание', 'затенение', 'тесселяция', 'шейдеры', 'рендеринг', 'апгрейд пк',
        'geforce', 'radeon', 'rtx 5090', 'rtx 4090', 'rtx 4080', 'rtx 4070', 'rtx 3090', 'rtx 3080', 'rtx 3070', 'rtx 3060',
        'rx 7900 xtx', 'rx 7800 xt', 'rx 6900 xt', 'intel arc', 'некстген', 'оптимизация', 'настройки', 'настройки графики',
        'графический мод', 'енб', 'решейд', 'реализм', 'фотореализм', 'реалистичная графика', 'лучшая графика', 'безумная графика',
        'невероятный визуал', 'игровой движок', 'техно-демо', 'демонстрация', 'визуальная точность', 'качество изображения',
        'генерация кадров', 'path tracing', 'глобальное освещение', 'hdr', 'динамическое разрешение', 'шахматный рендеринг', 'апскейлинг',
        'нативное разрешение', 'фильтрация текстур', 'анизотропная фильтрация', 'уровень детализации', 'lod', 'дальность прорисовки',
        'качество растительности', 'физика воды', 'эффекты частиц', 'размытие в движении', 'глубина резкости', 'хроматическая аберрация',
        'постобработка', 'пост-обработка', 'нвидиа', 'амд', 'интел', 'упор в процессор', 'упор в видеокарту', 'потребление видеопамяти',
        'системные требования', 'потянет ли', 'фреймпейсинг', 'статтеры', 'плавность', '60фпс', '120фпс', '240фпс', 'высокая герцовка',
        'gsync', 'freesync', 'vrr', 'разгон', 'разогнанный', 'сток против разгона', 'производительность драйверов', 'новые драйвера',
        'драйвер', 'directx 12', 'dx12', 'directx 11', 'dx11', 'vulkan api', 'сравнение api', 'конвейер рендеринга',
        'отложенный рендеринг', 'прямой рендеринг', 'растеризация', 'вычислительные шейдеры', 'меш-шейдеры', 'vrs', 'ии-апскейлинг',
        'тензорные ядра', 'rdna', 'ampere', 'ada lovelace', 'архитектура turing', 'водяное охлаждение', 'сборка пк', 'игровой пк', 'игровой ноутбук',
        'алан уэйк', 'киберпанк 2077', 'старфилд', 'элден ринг', 'ред дед редемпшен 2', 'одни из нас', 'бог войны', 'хорайзон',
        'чумная сказка', 'симулятор полетов', 'контрол', 'метро исход', 'призрак цусимы', 'ассасин крид',
        'фар край', 'колда', 'батлфилд', 'резидент ивл', 'финальная фантазия', 'squad', 'цивилизация', 'civilization',
        'арма', 'стар ситизен', 'dying light 2', 'хогвартс', 'врата балдура', 'диабло 4'
    ].map(k => k.toLowerCase());


    // --- ЛОГИКА СКРИПТА ---

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clickNotInterested(videoElement, titleText) {
        const menuButton = videoElement.querySelector('button[aria-label="Ещё"], button[aria-label="Action menu"]');
        if (!menuButton) return;

        menuButton.click();
        await sleep(200);

        const menuItems = document.querySelectorAll('ytd-menu-service-item-renderer, yt-list-item-view-model');
        for (const item of menuItems) {
            const textElement = item.querySelector('yt-formatted-string, .yt-core-attributed-string');
            if (textElement && (textElement.textContent.trim() === 'Не интересует' || textElement.textContent.trim() === 'Not interested')) {
                item.click();
                console.log(`[Фильтр V4] Нажата кнопка "Не интересует" для: "${titleText}"`);
                return;
            }
        }
        document.body.click();
    }

    async function processVideo(videoElement) {
        if (videoElement.getAttribute('data-processed') === 'true' || !isScriptEnabled) {
            return;
        }
        videoElement.setAttribute('data-processed', 'true');

        const titleLink = videoElement.querySelector('a#video-title, .yt-lockup-metadata-view-model-wiz__title');
        if (!titleLink) return;

        const titleText = (titleLink.getAttribute('title') || titleLink.textContent).trim();
        const title = titleText.toLowerCase();

        const hasKeeperName = keeperNames.some(name => title.includes(name));
        const hasGraphicsKeyword = graphicsKeywords.some(keyword => title.includes(keyword));

        if (hasKeeperName || hasGraphicsKeyword) {
            console.log(`[Фильтр V4] ОСТАВЛЕНО: "${titleText}"`);
            videoElement.style.outline = '2px solid limegreen';
            return;
        }

        console.log(`[Фильтр V4] СКРЫТИЕ: "${titleText}"`);
        videoElement.style.display = 'none';
        clickNotInterested(videoElement, titleText);
    }

    function processAllVisibleVideos() {
        if (!isScriptEnabled) return;
        console.log('[Фильтр V4] Запуск обработки видимых видео...');
        document.querySelectorAll('ytd-rich-item-renderer:not([data-processed]), ytd-video-renderer:not([data-processed]), ytd-grid-video-renderer:not([data-processed]), ytd-compact-video-renderer:not([data-processed])').forEach(processVideo);
    }

    const observer = new MutationObserver(() => {
        if (!isScriptEnabled) return;
        processAllVisibleVideos();
    });

    // --- UI ЭЛЕМЕНТЫ ---
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'vanomas-filter-toggle';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            isScriptEnabled = !isScriptEnabled;
            // *** СОХРАНЯЕМ НОВОЕ СОСТОЯНИЕ ***
            GM_setValue('isScriptEnabled', isScriptEnabled);

            updateButtonState(button);

            if (isScriptEnabled) {
                processAllVisibleVideos();
            } else {
                 document.querySelectorAll('[data-processed]').forEach(el => {
                    if (el.style.display === 'none') {
                        el.style.display = 'flex'; // Используем flex, т.к. это стандарт для ytd-rich-item-renderer
                    }
                    el.style.outline = 'none';
                });
            }
        });
        updateButtonState(button);
    }

    function updateButtonState(button) {
        button.textContent = isScriptEnabled ? 'Фильтр Vanomas: ВКЛ' : 'Фильтр Vanomas: ВЫКЛ';
        button.className = isScriptEnabled ? 'enabled' : 'disabled';
    }

    GM_addStyle(`
        #vanomas-filter-toggle { position: fixed; bottom: 20px; left: 20px; z-index: 9999; padding: 10px 15px; border-radius: 8px; border: none; color: white; font-size: 14px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: background-color 0.3s, transform 0.2s; }
        #vanomas-filter-toggle.enabled { background-color: #1a73e8; }
        #vanomas-filter-toggle.disabled { background-color: #d93025; }
        #vanomas-filter-toggle:hover { transform: scale(1.05); }
    `);

    // --- ЗАПУСК ---
    function startObserver() {
        const targetNode = document.querySelector('ytd-app');
        if (targetNode) {
            console.log('[Фильтр V4] Скрипт запущен. Наблюдатель активирован.');
            observer.observe(targetNode, { childList: true, subtree: true });
            createToggleButton();
            if (isScriptEnabled) {
                setTimeout(processAllVisibleVideos, 1500);
            }
        } else {
            setTimeout(startObserver, 1000);
        }
    }

    startObserver();

})();