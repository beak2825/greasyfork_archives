// ==UserScript==
// @name           Advertisement Hide - Kino HDrezka
// @namespace      scriptomatika
// @author         mouse-karaganda
// @description    Выключает рекламу на ресурсе HDrezka
// @license        MIT
// @include        https://rezka.ag/*
// @include        https://hdrezka.ag/*
// @include        http://hdrezkabbdmm8.net/*
// @require        https://greasyfork.org/scripts/379902-include-tools/code/Include%20Tools.js?version=1071128
// @version        2.14
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/379913/Advertisement%20Hide%20-%20Kino%20HDrezka.user.js
// @updateURL https://update.greasyfork.org/scripts/379913/Advertisement%20Hide%20-%20Kino%20HDrezka.meta.js
// ==/UserScript==

(function() {
    const $ = window.jQuery;
    const $$ = window.__krokodil;

    const deleteElement = function(selector, method) {
        $$.missingElement(selector, function(exists) {
            if (!exists) return;
            if ($$.isFunction(method)) {
                method.call(this);
            }
            if ($$.isIterable(this)) {
                $$.each(this, function(elem) {
                    $$.del(elem);
                });
            } else {
                $$.del(this);
            }
        });
    };

    /**
     * Упростим заголовок страницы
     */
    let movieTitle;
    if (!!(movieTitle = $$.get('.b-content__main .b-post__title'))) {
        document.title = movieTitle.innerText;
    }

    /**
     * Стили на всех страничках
     */
    $$.renderStyle(
        'body.active-brand { background-color: #313131; background-color: #777; background-color: #5d5d5d; }',
        'body.active-brand.pp { padding-top: 0 !important; }'
    );

    /**
     * Уберем рекламный блок бренда на всю страницу
     */
    deleteElement('body.has-brand.active-brand > noindex > div > iframe');

    /**
     * Баннер в списке сериалов
     */
    let banner;
    const bannerContains = !!(banner = $$.get('.b-seriesupdate__block .b-seriesupdate__block_list_item_inner > a > img[src*="banner"]'));
    if (bannerContains) {
        $$.del(banner.parentNode.parentNode.parentNode);
    }

    /**
     * Закроем всплывающую рекламу на мобильных устройствах
     */
    $$.missingElement('footer ~ #hdrezka-ajax-block ~ div', function(exists) {
        if (!exists) return;
        let button;
        const isBanner = ($$.css(this, 'position') == 'fixed') && !!(button = $$.get('img + span', this));
        if (isBanner) {
            $$.fireEvent(button, 'click');
        }
    });

    /**
     * Проверим, что мы на странице, где есть боковой блок с баннером
     */
    let bannerStyle = function() {
        $$.renderStyle(
            '.b-content__inline_inner_mainprobar { padding-right: 0 !important; }'
        );
    };
    deleteElement('.b-content__inline .b-content__inline_inner .b-content__inline_items + div[id] > div[id][style]', bannerStyle);

    /**
     * Проверим, что мы на странице, где есть боковой блок с виджетом VK
     */
    bannerStyle = function() {
        $$.renderStyle(
            '.b-content__columns .b-content__main + div[id] { display: none; }',
            '.b-content__columns { padding-right: 0 !important; }'
        );
    };
    deleteElement('.b-content__columns .b-content__main + div[id] #vk_groups + div[id][style]', bannerStyle);

    /**
     * Автоматический пропуск видео-рекламы
     */
    let bannerNumber = 0, bannerCount = 0;
    let skipTimer, missingTimer;
    const skipButtonClick = function(button) {
        return function() {
            if (button.innerText == 'Пропустить') {
                clearInterval(skipTimer);
                console.log(`Жмем ПРОПУСТИТЬ [bn=${bannerNumber}] == `, button);
                $$.fireEvent(button, 'click');

                // Запустим процесс со следующим рекламным роликом
                if (bannerNumber < bannerCount) {
                    console.log('missingVideoBanner == переход на следущий ролик');
                    missingVideoBanner();
                } else {
                    bannerNumber = 0;
                    missingTimer = setInterval(missingVideoBanner, 300100);
                    console.log('Реклама пропущена. Запустим missingTimer');
                    missingVideoBanner();
                }
            }
        };
    };

    /**
     * Автоматическое выключение звука на видео-рекламе
     */
    const missingVideoBanner = function() {
        console.log('missingVideoBanner == ', new Date());

        // Ждем, когда включится реклама
        const containerClass = ('scriptomatika_banner_container');
        const missingDiv = (`#cdnplayer > pjsdiv > pjsdiv > video ~ pjsdiv:nth-child(4):not(.${containerClass})`);
        $$.missingElement(missingDiv, function(exists) {
            if (!exists) return;
            console.log(`Ищем рекламу [bn=${bannerNumber}] == `, this);
            this.classList.add(containerClass);
            const parentContainer = this.parentNode;

            // Ищем кнопки для звука и для пропуска
            const innerLayers = $$.getAll('pjsdiv', parentContainer);
            $$.each(innerLayers, function(layer) {
                const part = layer.innerHTML.match(/Реклама (\d+)\/(\d+)/);
                if (!!part) {
                    console.log('Реклама найдена. Остановим missingTimer');
                    clearInterval(missingTimer);

                    bannerNumber = part[1] * 1;
                    bannerCount = part[2] * 1;
                    layer.classList.add('scriptomatika_reklama_title', 'bnumber_' + bannerNumber, 'bcount_' + bannerCount);

                    const soundButton = layer.nextSibling;
                    console.log('soundButton == ', soundButton);
                    if (bannerNumber == 1) {
                        const soundClass = ('scriptomatika_sound_off');
                        if (!soundButton.classList.contains(soundClass)) {
                            soundButton.classList.add(soundClass);
                            $$.fireEvent(soundButton, 'click');
                        }
                    }

                    const skipButton = soundButton.nextSibling;
                    skipTimer = setInterval(skipButtonClick(skipButton), 1000);

                    // Кладем фон, чтобы закрыть изображение
                    $$.renderElement({
                        cls: 'scriptomatika_banner_shadow',
                        renderTo: parentContainer
                    });
                    return true;
                }
            });
        });
    };

    /**
     * Проверим, что мы на странице, где есть видео-плеер
     */
    let player;
    const playerContains = !!(player = $$.get('#cdnplayer-container #cdnplayer'));
    if (playerContains) {
        $$.renderStyle(
            '#cdnplayer, #cdnplayer-container { width: 960px !important; height: calc(960px * 360 / 640) !important; }',
            '.scriptomatika_banner_shadow { position: absolute; left: 0; top: 0; right: 0; bottom: 0; z-index: 0; background: url(http://static.scriptomatika.ru/img/fon16.png); }',
            '.b-post__lastepisodeout .scriptomatika_full_screen { float: right; cursor: pointer; }',
            '.scriptomatika_full_screen .active_on, .scriptomatika_full_screen:hover .active_off, .scriptomatika_full_screen_activ .scriptomatika_full_screen .active_off, .scriptomatika_full_screen_activ .scriptomatika_full_screen:hover .active_on { display: inline; }',
            '.scriptomatika_full_screen .active_off, .scriptomatika_full_screen:hover .active_on, .scriptomatika_full_screen_activ .scriptomatika_full_screen .active_on, .scriptomatika_full_screen_activ .scriptomatika_full_screen:hover .active_off { display: none; }',
            '.scriptomatika_full_screen_activ .b-post__lastepisodeout .scriptomatika_full_screen { position: fixed; left: 0; top: 0; z-index: 4; transform: rotate(-90deg) translateX(-100%) translateY(100%); transform-origin: 0 100%; }',
            '.scriptomatika_full_screen_activ .b-post__lastepisodeout .scriptomatika_full_screen { padding: 0 8px; background-color: ##2d2d2d; color: #fff; font-size: 14px; font-weight: normal; line-height: 30px; }',
            '.scriptomatika_full_screen_activ .b-post__lastepisodeout .scriptomatika_full_screen:hover { background-color: #4d4d4d; }',
            '.scriptomatika_full_screen_activ #cdnplayer-container { position: fixed; left: 0; top: 0; right: 0; bottom: 0; width: auto !important; height: auto !important; margin: 0 !important; z-index: 3; background-color: black; }',
            '.scriptomatika_full_screen_activ #cdnplayer { width: auto !important; height: 100% !important; margin: 0 30px !important; }',
        );
        deleteElement('.b-post__rating_table + div[id][style]');
        deleteElement('.b-post__mixedtext + div[id][style]');
        deleteElement('.b-player__network_issues_holder + a[id][style]');

         // Переключает видео в режим на всё окно
        $$.missingElement('.b-post__lastepisodeout', function(exists) {
            if (!exists) return;
            let buttonToWindow = $$.renderElement({
                tagName: 'h2',
                cls: 'scriptomatika_full_screen',
                innerHTML: '<span class="active_on">🔴</span><span class="active_off">•&nbsp;</span> <span>В окне</span>',
                renderTo: this,
                renderType: 'prepend',
                listeners: {
                    click: function() {
                        $$.get('body').classList.toggle('scriptomatika_full_screen_activ');
                    }
                }
            });
        });

        missingTimer = setInterval(missingVideoBanner, 300100);
        console.log('missingVideoBanner == ВРУЧНУЮ');
        missingVideoBanner();
    }

    console.log('Advertisement Hide - Kino HDrezka 💬 2.14');
})();
