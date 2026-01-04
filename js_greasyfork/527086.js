// ==UserScript==
// @name         FUNCKA - TolyanHammerKombat
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Чёрный Список для FUNCKA - скрыть фриков из ленты. Скрывает посты и комментарии. Stalcraft, Сталкрафт, Funcka, Фанка.
// @author       Marina Khamsterkombat
// @match        https://vk.com/*
// @icon         https://i.imgur.com/9hJJv6a.png
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/527086/FUNCKA%20-%20TolyanHammerKombat.user.js
// @updateURL https://update.greasyfork.org/scripts/527086/FUNCKA%20-%20TolyanHammerKombat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // РЕЖИМЫ РАБОТЫ: hide - скрыть, replace - заменить
    const MODE = { REPLACE: 'replace', HIDE: 'hide' };

    // РЕЖИМЫ СКРЫТИЯ ПОСТА: content - содержимое, full - полностью
    const POSTMODE = { CONTENT: 'content', FULL: 'full' };

    // КОНФИГУРАЦИЯ СКРИПТА
    const config = {
        mode: MODE.REPLACE, // Режим работы: HIDE / REPLACE
        postMode: POSTMODE.CONTENT, // Режим скрытия поста: CONTENT / FULL
        setupHammer: true, // Включить анимацию молотка при клике на аватарку

        // ID фриков
        targets: ['356761121', '252323336', '1035510061', '1032968837', '1023730354', '867502146', '744130756', '649621677', '1047382637', '894118832', '252323336', '790014622', '207065667', '833269411'],

        // НАСТРОЙКИ ЗАМЕНЫ
        replace: {
            comment: '🐹🐹🐹',
            post: {
                text: '🚫🐹🔨 Попался, Хомяк! 🔨🐹🚫',
                textColor: '#71AAEB',
            },
        },

        // НАСТРОЙКИ АНИМАЦИИ МОЛОТКА
        hammer: {
            image: {
                url: 'https://i.imgur.com/9hJJv6a.png',
                size: { widthPx: 50, heightPx: 50 },
                offset: { leftPx: 8, topPx: 40 }
            },
            sound: {
                url: 'https://myinstants.com/media/sounds/fnaf-12-3-freddys-nose-sound.mp3',
                volume: 0.1,
                timeoutMs: 500,
            },
            animation: { durationMs: 200 }
        },
    };

    // Метка для обработанных элементов
    const attribute = {
        name: 'data-hammerkombat',
        hidden: 'hidden'
    };

    // Создает элемент уведомления
    const createNotice = () => {
        const notice = document.createElement('div');
        notice.className = 'hammerkombat-notice';

        const text = document.createElement('h2');
        text.className = 'hammerkombat-notice-text';
        text.textContent = config.replace.post.text;

        notice.append(text);
        return notice;
    }

    // Создает молоток в позиции клика
    const createHammer = (x, y) => {
        const { image } = config.hammer

        const hammer = document.createElement('img');
        hammer.className = 'hammerkombat-cursor';
        hammer.src = image.url;

        Object.assign(hammer.style, {
            left: `${x - image.offset.leftPx}px`,
            top: `${y - image.offset.topPx}px`,
            width: `${image.size.widthPx}px`,
            height: `${image.size.heightPx}px`
        });

        document.body.append(hammer);
        return hammer;
    }

    // Воспроизводит звук удара
   const playSound = () => {
       const { sound } = config.hammer

       const audio = new Audio(sound.url);
       audio.volume = sound.volume;
       audio.play().catch(() => {});
       setTimeout(() => audio.remove(), sound.timeoutMs);
    }

    // Настраивает обработчик клика на аватар
    const setupAvatarClick = (element) => {
        const avatar = element.querySelector('a.AvatarRich');
        if (!avatar) return;

        avatar.style.cursor = 'crosshair';
        avatar.style.userSelect = 'none';
        avatar.removeAttribute('href');

        avatar.addEventListener('click', (event) => {
            const hammer = createHammer(event.clientX, event.clientY);
            setTimeout(() => hammer.remove(), config.hammer.animation.durationMs);
            playSound();
        });
    }

    // Проверяет автора поста/коммента
    const handleAuthor = (element, field) => {
        const authorId = element?.dataset?.[field];
        if (!authorId) return false;
        if (!config.targets.includes(authorId)) return false;

        element.setAttribute(attribute.name, attribute.hidden);
        return true;
    };

    // Проверяет и обрабатывает пост
    const processPost = (post) => {
        if (!handleAuthor(post, 'postAuthorId')) return;

        // Скрываем содержание оригинального поста
        const content = config.postMode === POSTMODE.CONTENT ? post.querySelector('div.wall_text') : post;
        if (!content) return;

        content.style.setProperty('display', 'none');

        // Заменяем содержание поста
        if (config.mode === MODE.REPLACE) {
            content.before(createNotice());
        }

        // Настраиваем молоточек на аватарке
        if (config.setupHammer && MODE !== MODE.HIDE) setupAvatarClick(post);
    };

    // Проверяет и обрабатывает комментарий
    const processComment = (comment) => {
        if (!handleAuthor(comment, 'answeringId')) return;

        // Скрываем комментарий
        if (config.mode === MODE.HIDE) {
            comment.style.setProperty('display', 'none');
        }

         // Заменяем содержание комментария
        if (config.mode === MODE.REPLACE) {
             const replyText = comment.querySelector('div.wall_reply_text');
            if (replyText) replyText.textContent = config.replace.comment;
        }

        // Настраиваем молоточек на аватарке
        if (config.setupHammer && MODE !== MODE.HIDE) setupAvatarClick(comment);
    };

    // Проверяет все посты и комментарии на странице
    const checkContent = () => {
        document.querySelectorAll(`.post:not([${attribute.name}])`).forEach(processPost);
        document.querySelectorAll(`.replies_list div:not([${attribute.name}])`).forEach(processComment);
    };

    // Добавляет стили на страницу
    const addStyles = () => {
        const style = document.createElement('style');
        style.type = 'text/css';

        style.textContent = `
            .hammerkombat-notice {
                position: relative;
                text-align: center;
                padding: 16px;
                margin-top: 8px;
            }
            .hammerkombat-notice-text {
                color: ${config.replace.post.textColor};
                font-weight: bold;
                text-transform: uppercase;
                user-select: none;
            }
            .hammerkombat-cursor {
                position: fixed;
                pointer-events: none;
                transform-origin: bottom right;
                animation: hammer-hit ${config.hammer.animation.durationMs}ms ease-out;
            }
            @keyframes hammer-hit {
                0%   { transform: rotate(0deg); }
                50%  { transform: rotate(-30deg); }
                100% { transform: rotate(0deg); }
            }
        `;

        document.head.append(style);
    }

    // Запуск скрипта
    const init = () => {
        addStyles();
        window.addEventListener('load', checkContent);
        const observer = new MutationObserver(checkContent)
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();