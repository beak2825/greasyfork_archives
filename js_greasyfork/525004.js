// ==UserScript==
// @name            Jut.su АвтоСкип+ (Skip Intro, Next Episode, Preview, Download)
// @name:en         Jut.su Auto+ (Skip Intro, Next Episode, Preview, Download)
// @namespace       http://tampermonkey.net/
// @version         3.1
// @description     Автоскип заставок, автопереход, предпросмотр серий и кнопка загрузки на Jut.su.
// @description:en  Automatically skip intros, auto switch episodes, show previews and add download button on Jut.su.
// @author          Rodion (integrator), Diorhc (preview), VakiKrin (download)
// @match           https://jut.su/*
// @license         MIT
// @grant           GM_registerMenuCommand
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/525004/Jutsu%20%D0%90%D0%B2%D1%82%D0%BE%D0%A1%D0%BA%D0%B8%D0%BF%2B%20%28Skip%20Intro%2C%20Next%20Episode%2C%20Preview%2C%20Download%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525004/Jutsu%20%D0%90%D0%B2%D1%82%D0%BE%D0%A1%D0%BA%D0%B8%D0%BF%2B%20%28Skip%20Intro%2C%20Next%20Episode%2C%20Preview%2C%20Download%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const SETTINGS = {
        autoSkip: true,
        autoNext: true,
        previewEnabled: true,
        downloadButton: true
    };

    // Меню
    function registerMenu() {
        GM_registerMenuCommand(`Автоскип интро: ${SETTINGS.autoSkip ? '✅ ВКЛ' : '❌ ВЫКЛ'}`, () => toggleSetting('autoSkip'));
        GM_registerMenuCommand(`Автопереход: ${SETTINGS.autoNext ? '✅ ВКЛ' : '❌ ВЫКЛ'}`, () => toggleSetting('autoNext'));
        GM_registerMenuCommand(`Превью серий: ${SETTINGS.previewEnabled ? '✅ ВКЛ' : '❌ ВЫКЛ'}`, () => toggleSetting('previewEnabled'));
        GM_registerMenuCommand(`Кнопка загрузки: ${SETTINGS.downloadButton ? '✅ ВКЛ' : '❌ ВЫКЛ'}`, () => toggleSetting('downloadButton'));
    }

    function toggleSetting(key) {
        SETTINGS[key] = !SETTINGS[key];
        location.reload();
    }

    // Автоскип
function autoSkipAndNext() {
    const isVisible = elem => elem && elem.offsetParent !== null;
    let fullscreenTriggered = false;
    let skipTriggered = false;

    const loop = () => {
        const skipButton = document.querySelector("div[title='Нажмите, если лень смотреть опенинг']");
        const nextButton = document.querySelector("div[title='Перейти к следующему эпизоду']");
        const playButton = document.querySelector("button[title='Воспроизвести видео']");
        const video = document.querySelector('video');
        const fullscreenBtn = document.querySelector("button.vjs-fullscreen-control");

        // Нажать "Пропустить интро"
        if (SETTINGS.autoSkip && isVisible(skipButton)) {
            skipButton.click();
            skipTriggered = true;
            console.log('[JUTSU] Skip intro clicked');
        }

        // Нажать "Следующая серия"
        if (SETTINGS.autoNext && isVisible(nextButton)) {
            nextButton.click();
            console.log('[JUTSU] Next episode clicked');
        }

        // Нажать "Пуск", если видно кнопку
        if (isVisible(playButton)) {
            playButton.click();
            console.log('[JUTSU] Play button clicked');
        }

        // После скипа включить фуллскрин, если видео идёт
        if (skipTriggered && video && !fullscreenTriggered && !video.paused && fullscreenBtn && isVisible(fullscreenBtn)) {
            fullscreenBtn.click();
            fullscreenTriggered = true;
            console.log('[JUTSU] Fullscreen activated');
        }

        setTimeout(loop, 500);
    };

    loop();

    const video = document.querySelector('video');
    if (video && SETTINGS.autoNext) {
        video.addEventListener('ended', () => {
            const nextLink = document.querySelector('.vnright a');
            if (nextLink) window.location.href = nextLink.href;
        });
    }
}

    // Стили превью
    function injectPreviewStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .prevbox {
                margin-top: 55px;
                margin-left: -163px;
                display: none;
                width: 200px;
                position: absolute;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.2s ease;
                box-shadow: 0 0 15px black;
                border-radius: 5px;
                border: 2px solid rgba(102, 107, 102, 0.8);
                text-align: center;
            }
            .prevbox > div {
                border-radius: 0 0 5px 5px;
                padding: 3px 14px;
                background-color: #363a37;
                border-top: 1px solid #505550;
            }
            .prevbox > img {
                border-radius: 5px;
                width: 200px;
                height: 112.5px;
                background: url(https://i.imgur.com/DLLjUig.png) center no-repeat rgb(54, 58, 55);
            }
        `;
        document.head.appendChild(style);
    }

    // Превью
    function enablePreviewTooltips() {
        const links = document.querySelectorAll(`#dle-content > div > div:nth-child(2) > a[href*='${window.location.pathname}']`);
        links.forEach((link, index) => {
            const box = document.createElement('div');
            box.className = 'prevbox';
            const img = document.createElement('img');
            const title = document.createElement('div');
            box.append(img, title);
            let t1, t2;

            link.addEventListener('mouseenter', () => {
                clearTimeout(t1); clearTimeout(t2);
                t1 = setTimeout(() => {
                    if (!localStorage[link.href]) {
                        fetch(link.href).then(res => res.arrayBuffer()).then(buffer => {
                            const html = new TextDecoder('windows-1251').decode(buffer);
                            const temp = document.createElement('div');
                            temp.innerHTML = html;
                            const imgUrl = temp.querySelector('meta[property="og:image"]').content;
                            const titleText = temp.querySelector('#dle-content div.video_plate_title h2').textContent;
                            img.src = imgUrl;
                            title.textContent = titleText;
                            localStorage[link.href] = imgUrl;
                            localStorage[link.href + '-title'] = titleText;
                        });
                    } else {
                        img.src = localStorage[link.href];
                        title.textContent = localStorage[link.href + '-title'];
                    }
                    link.insertAdjacentElement('afterend', box);
                    box.style.display = 'block';
                    box.style.opacity = '0';
                    t2 = setTimeout(() => box.style.opacity = '1', 300);
                }, 200);
            });

            link.addEventListener('mouseleave', () => {
                clearTimeout(t1); clearTimeout(t2);
                box.style.opacity = '0';
                setTimeout(() => box.style.display = 'none', 200);
            });
        });
    }

    // Download button (от VakiKrin)
    function waitForKeyElements(selector, callback) {
        const run = () => {
            const nodes = $(selector);
            if (nodes.length) {
                nodes.each((_, el) => {
                    const $el = $(el);
                    if (!$el.data('alreadyFound')) {
                        $el.data('alreadyFound', true);
                        callback($el);
                    }
                });
                return true;
            }
            return false;
        };

        const interval = setInterval(() => {
            if (run()) clearInterval(interval);
        }, 300);
    }

    function addDownloadButton($node) {
        const src = $node[0].src;
        const name = location.pathname.split("/")[1] + '.mp4';
        const container = document.querySelector('.videoContent');
        if (!container) return;

        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.alignItems = 'center';

        const a = document.createElement('a');
        a.href = src;
        a.className = 'short-btn';
        a.textContent = 'DOWNLOAD';
        a.onclick = e => {
            e.preventDefault();
            const link = document.createElement('a');
            link.href = src;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        div.appendChild(a);
        container.appendChild(div);
    }

    // Init
    registerMenu();
    if (SETTINGS.autoSkip || SETTINGS.autoNext) autoSkipAndNext();
    if (SETTINGS.previewEnabled) {
        setTimeout(() => {
            injectPreviewStyle();
            enablePreviewTooltips();
        }, 1000);
    }
    if (SETTINGS.downloadButton) {
        waitForKeyElements('#my-player_html5_api > source[label="1080p"]', addDownloadButton);
    }
})();