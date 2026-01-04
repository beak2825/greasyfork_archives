// ==UserScript==
// @name         Custom Dark Mode perplexity
// @namespace    http://tampermonkey.net/
// @version       1.1.2
// @description  thee style Darkmode
// @author       Gullampis810
// @license      MIT
// @match        https://www.perplexity.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai 
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531265/Custom%20Dark%20Mode%20perplexity.user.js
// @updateURL https://update.greasyfork.org/scripts/531265/Custom%20Dark%20Mode%20perplexity.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Функция для добавления стилей
    function addStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // Переопределение стилей
    var customStyles = `
    /* send button in chat */
    /* Темная тема */
        .dark button.bg-super.dark\\:bg-superDark {
            background: oklch(0.59 0.06 314.07) !important;
            color: #yourDarkTextColor !important; /* Замените на подходящий цвет текста */
        }

    /* Первый элемент */
        .pt-md.max-w-threadWidth.px-md.mx-auto {
            background-color: #3b2a46 !important; /* Ваш цвет */
        }

        /* Темная тема для первого элемента */
        .dark .pt-md.max-w-threadWidth.px-md.mx-auto {
            background-color: #3b2a46 !important; /* Тот же цвет или другой */
        }

        /* Второй элемент */
        .gap-md.flex.flex-col.pb-md {
            background: #3b2a46 !important; /* Ваш цвет */
        }

        /* Темная тема для второго элемента */
        .dark .gap-md.flex.flex-col.pb-md {
            background: #3b2a46 !important; /* Тот же цвет или другой */
        }
    @media (prefers-color-scheme: dark) {
        :root:not([data-color-scheme=light]) .dark\\:ring-borderMainDark\\/50 {
            --tw-ring-color: oklch(0.9 0.18 188.26);
        }
        .bg-background-100.-mx-md.px-md.mb-md.-top-0.z-10.md\\:sticky {
            background: #1f1225 !important;
            border: 2px #8a6a98 solid !important;
            border-radius: 15px !important;
        }
        .-mx-sm.relative.flex.gap-1\\.5 {
            background: #1f1225 !important;
        }
        :root:not([data-color-scheme=light]) .dark\\:bg-backgroundDark {
            --tw-bg-opacity: 1;
            background: linear-gradient(45deg, #392a3d 0%, #4b9b8894 50%, #231c2d 100%);
        }
        :root:not([data-color-scheme=light]) .dark\\:bg-offsetDark {
            --tw-bg-opacity: 1;
            background-color: oklch(0.21 0.04 315.27); /*Основной фиолетовый цвет фона бордов*/
        }
        :root:not([data-color-scheme=light]) .dark\\:scrollbar-thumb-idleDark {
            --scrollbar-thumb: #3febc6 !important;
        }
        :root:not([data-color-scheme=light]) .dark\\:ring-borderMainDark\\/50 {
            --tw-ring-color: oklch(0.9 0.18 188.26);
        }
        .px-md\\.md\\:px-lg\\.min-h-\\[calc\\(100dvh-var\\(--header-height\\)\\)\\].border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-transparent {
            background: linear-gradient(45deg, #833f00, #0f092c, #28d0adcc);
            background-size: 155%;
        }

        @media (prefers-color-scheme: dark) {
        :root:not([data-color-scheme=light]) .dark\\:bg-offsetPlusDark {
            --tw-bg-opacity: 1;
            background-color: oklch(0.42 0.08 314.19); /* цвет кнопок */
        }

         @media (prefers-color-scheme: dark) {
        :root:not([data-color-scheme=light]) .dark\\:ring-borderMainDark {
            --tw-ring-opacity: 1;
            --tw-ring-color: oklch(0.79 0.15 190.71); /* border граница чат - голубой  */
        }

         @media (prefers-color-scheme: dark) {
        :root:not([data-color-scheme=light]) .dark\\:text-textOffDark {
            --tw-text-opacity: 1;
            color: oklch(0.71 0.09 191.87);
        }

         .shrink-0 {
        color: #71b672;
    }
    audio, canvas, embed, iframe, img, object, svg, video {
        color: #20b8cd;
    }

    @media (min-width: 768px) {
        body {
            background: #342542;
        }
    }

    /*hover button*/
@media (min-width: 768px) {
        @media (prefers-color-scheme: dark) {
            :root:not([data-color-scheme="light"]) .md\\:dark\\:hover\\:bg-offsetPlusDark:hover {
                --tw-bg-opacity: 1;
                background-color: #68527f !important;
            }

    .flex.items-center.justify-between.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-background.dark\\:bg-backgroundDark {
        background: #2c1b34;
        border-radius: 5px;
        padding: 5px;
    }

    .bg-background.p-xs.px-md.py-sm.dark\\:border-borderMainDark\\/50.dark\\:bg-backgroundDark.w-80.rounded-lg.border.shadow-lg {
        background: #1b3434;
    }

    .text-text-200.bg-background-300.py-xs.px-sm.inline-block.rounded-br.rounded-tl-\\[3px\\].font-thin {
        background: #a585bf;
        color: black;
    }

    button.bg-idle.text-textOff.dark\\:bg-idleDark.dark\\:text-textOffDark.\\!duration-100.font-sans.focus\\:outline-none.outline-none.outline-transparent.transition.duration-300.ease-out.font-sans.select-none.items-center.relative.group\\/button.justify-center.text-center.items-center.rounded-full.cursor-default.opacity-50.whitespace-nowrap.inline-flex.text-sm.h-8.aspect-square {
        background: #417870;
    }


 .shadow-subtle.flex.min-h-0.min-w-0.rounded-md.border.data-\\[placement\\=bottom-end\\]\\:origin-top-right.data-\\[placement\\=bottom-start\\]\\:origin-top-left.data-\\[placement\\=top-end\\]\\:origin-bottom-right.data-\\[placement\\=top-start\\]\\:origin-bottom-left.duration-150.p-xs.animate-in.fade-in.zoom-in-\\[0\\.97\\].ease-out.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-background.dark\\:bg-backgroundDark {
        background: #6f5686;
        border: 2px solid #59a38e;
    }

@media (prefers-color-scheme: dark) {
        :root:not([data-color-scheme=light]) .md\\:dark\\:hover\\:bg-offsetDark:hover {
            --tw-bg-opacity: 1;
            background-color: oklch(0.31 0.07 312.34);
        }
    }

.sticky.-top-12.z-20.flex.justify-center.border-b.md\\:top-0.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-background.dark\\:bg-backgroundDark {
        background: #4f3b59;
    }

.sticky.left-0.right-0.top-0.z-10.border-b.md\\:mb-0.md\\:rounded-t-xl.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-background.dark\\:bg-backgroundDark {
        background: #46324f;
    }

    .bg-background.dark\\:bg-backgroundDark.absolute.inset-0.z-\\[1\\].opacity-90 {
        background: #1f1225b8;
        border-radius: 0px 0px 30px 30px;
    }

    .px-md.py-sm.md\\:py-md.sticky.top-0.z-\\[22\\].w-full.border-b.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-background.dark\\:bg-backgroundDark {
        background: #3b2a46;
    }

    .p-md.relative.rounded-lg.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-background.dark\\:bg-backgroundDark {
        background: #12221e;
        border-radius: 0px 0px 30px 30px;
    }

    .flex.h-full.w-\\[100vw\\].grow.flex-col.md\\:w-\\[unset\\].md\\:grow-\\[unset\\].border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-transparent {
        background: blanchedalmond;
        border-radius: 32px;
    }

    .bg-background.dark\\:bg-backgroundDark.shadow-md.overflow-y-auto.scrollbar-thin.scrollbar-thumb-idle.dark\\:scrollbar-thumb-idleDark.scrollbar-track-transparent.fill-mode-both.md\\:rounded-lg.md\\:min-w-\\[600px\\].max-w-screen-sm.shadow-md.relative.h-full.max-h-\\[100vh\\].md\\:max-h-\\[95vh\\].overflow-auto.md\\:w-full {
        border-radius: 30px;
    }

     .flex.select-none.items-center.justify-between.pl-1.pr-3 {
            background: #46324f;
        }

        .overflow-hidden.px-sm.rounded-lg.border.py-1\\.5.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-transparent {
            background: #0d1f1f;
        }

        p.my-0 {
            background: #321d385c;
            filter: drop-shadow(2px 4px 6px black);
            border-radius: 4px;
        }

        .erp-tab\\:rounded-none.erp-new_tab\\:rounded-none.erp-tab\\:shadow-none.erp-new_tab\\:shadow-none.erp-tab\\:shadow-left-sm.erp-new_tab\\:shadow-left-sm.flex-1.overflow-clip.bg-clip-border.shadow-sm.lg\\:rounded-lg.md\\:dark\\:border.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-background.dark\\:bg-backgroundDark {
            border-radius: 13px;
        }

        h2.mb-xs.mt-5.text-base.font-\\[525\\].first\\:mt-3 {
            background: #76511b;
            border-radius: 25px;
            padding: 5px;
        }

        .hover\\:bg-background-200:hover {
        --tw-bg-opacity: 1;
        background-color: #68527f !important;
    }

    @media (prefers-color-scheme: dark) {
        :root:not([data-color-scheme="light"]) .dark\\:hover\\:bg-offsetPlusDark:hover {
            --tw-bg-opacity: 1;
            background-color: #68527f !important;
        }

@media (prefers-color-scheme: dark) {
            :root:not([data-color-scheme=light]) .dark\\:bg-background-200 {
                --tw-bg-opacity: 1;
                background-color: #2d253a !important;
            }
        }

@media (prefers-color-scheme: dark) {
            :root:not([data-color-scheme=light]) .dark\\:border-borderMain {
                --tw-border-opacity: 1;
                border: 1px solid oklch(0.73 0.13 192.91) !important;
            }
        }

        .w-lg.text-textMain.dark\\:text-textMainDark.flex.aspect-square.shrink-0.items-center.justify-center.rounded-full.border.\\!bg-textMain.\\!text-background.dark\\:\\!bg-textMainDark.dark\\:\\!text-backgroundDark.border-0.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-background.dark\\:bg-backgroundDark {
            background: oklab(0.31 0.05 -0.04) !important;
        }

 button.bg-textMain.text-textMainDark.dark\\:bg-textMainDark.dark\\:text-light-text.hover\\:text-superDuper.hover\\:dark\\:text-superDuper.font-sans.focus\\:outline-none.outline-none.outline-transparent.transition.duration-300.ease-out.font-sans.select-none.items-center.relative.group\\/button.justify-center.text-center.items-center.rounded-full.cursor-pointer.active\\:scale-\\[0\\.97\\].active\\:duration-150.active\\:ease-outExpo.origin-center.whitespace-nowrap.inline-flex.text-sm.h-8.aspect-square {
            background: #1f1225 !important;
        }

        .grow.flex.flex-col.justify-center.py-md.px-md {
            background: #3b2a46;
}

    /* Полный селектор с переопределением */
        .shadow-overlay.dark\\:shadow-overlayDark.flex.min-h-0.min-w-0.rounded-xl {
            background: #312533 !important; /* Новый цвет фона, например оранжевый */
            border-color: #ff5733 !important; /* Переопределяем границу */
        }

        /* Темная тема */
        .dark .shadow-overlay.dark\\:shadow-overlayDark.flex.min-h-0.min-w-0.rounded-xl {
            background: #c70039 !important; /* Другой цвет для темной темы */
            border-color: #c70039 !important;
        }

    }`;

    addStyle(customStyles);
})();


// name         Переопределение кнопки Download
(function() {
    'use strict';

    // Добавляем стили кнопки Download
    GM_addStyle(`
        .custom-download-btn {
            background-color: #3b2a46 !important;
            padding: 10px 20px !important;
            border-radius: 12px !important;
            font-size: 16px !important;
            display: flex !important; /* Принудительно показываем */
            isolation: isolate;
            z-index: 9999 !important; /* Выше всех */
            position: fixed !important;
            top: 68px !important;
            width: 205px !important;
        }

        .custom-download-btn:hover {
            background-color: #312533 !important;
        }

        .custom-download-btn > div,
        .custom-download-btn svg {
            color: inherit !important;
            stroke: white !important;
        }

    `);

    // Функция для обработки кнопки
    function styleButton(button) {
        if (button.textContent.includes('Download') && !button.classList.contains('custom-download-btn')) {
            button.classList.add('custom-download-btn');
            button.style.display = 'flex'; // Принудительно показываем
        }
    }

    // Обрабатываем уже существующие кнопки
    document.querySelectorAll('button.bg-offsetPlus').forEach(styleButton);

    // Отслеживаем динамическое добавление кнопок
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'BUTTON' && node.classList.contains('bg-offsetPlus')) {
                        styleButton(node);
                    } else if (node.querySelector) {
                        node.querySelectorAll('button.bg-offsetPlus').forEach(styleButton);
                    }
                });
            }
        });
    });

    // Наблюдаем за изменениями в DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();


(function() {
    'use strict';

    // Переопределение стилей для кнопки "New Thread"
    var newThreadButton = document.querySelector('.mx-md.py-sm.pl-md.pr-sm.hover\\:ring-super.dark\\:hover\\:ring-superDark.group.flex.flex-none.cursor-pointer.select-none.items-center.justify-between.rounded-full.border.ring-1.ring-transparent.transition.duration-200.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-background.dark\\:bg-backgroundDark');
    if (newThreadButton) {
        newThreadButton.style.cssText = `
            position: absolute !important;
            bottom: 22px !important;
            z-index: 10001 !important;
            background: #36623a !important;
            width: 190px !important;
        `;
    } else {
        console.error('Кнопка "New Thread" не найдена.');
    }
})();