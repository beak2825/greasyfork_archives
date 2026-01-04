// ==UserScript==
// @name               Disable All CSS Blur Effects
// @name:ar            تعطيل جميع تأثيرات التمويه في CSS
// @name:es            Desactivar todos los efectos de desenfoque CSS
// @name:fr            Désactiver tous les effets de flou CSS
// @name:hi            सभी CSS धुंध प्रभाव अक्षम करें
// @name:id            Nonaktifkan Semua Efek Blur CSS
// @name:ja            すべての CSS ぼかし効果を無効にする
// @name:ko            모든 CSS 블러 효과 비활성화
// @name:nl            Alle CSS-vervaageffecten uitschakelen
// @name:pt-BR         Desativar Todos os Efeitos de Desfoque CSS
// @name:ru            Отключить все эффекты размытия CSS
// @name:vi            Tắt tất cả hiệu ứng mờ CSS
// @name:zh-CN         禁用所有 CSS 模糊效果
// @name:zh-TW         停用所有 CSS 模糊效果
// @description        Disables all CSS blur effects globally.
// @description:ar     يعطل جميع تأثيرات التمويه في صفحات الويب.
// @description:es     Desactiva todos los efectos de desenfoque CSS globalmente.
// @description:fr     Désactive tous les effets de flou CSS à l'échelle globale.
// @description:hi     वैश्विक रूप से सभी CSS धुंध प्रभाव अक्षम करता है।
// @description:id     Menonaktifkan semua efek blur CSS secara global.
// @description:ja     ページ全体のすべての CSS ぼかし効果を無効にします。
// @description:ko     전역적으로 모든 CSS 블러 효과를 비활성화합니다.
// @description:nl     Schakelt alle CSS-vervaageffecten wereldwijd uit.
// @description:pt-BR  Desativar globalmente todos os efeitos de desfoque do CSS.
// @description:ru     Глобально отключает все эффекты размытия CSS.
// @description:vi     Tắt tất cả hiệu ứng mờ CSS trên toàn bộ trang web.
// @description:zh-CN  全局禁用所有 CSS 模糊效果。
// @description:zh-TW  全域停用所有 CSS 模糊效果。
// @namespace http://tampermonkey.net/
// @version 1.0.0
// @match *://*/*
// @grant none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/540818/Disable%20All%20CSS%20Blur%20Effects.user.js
// @updateURL https://update.greasyfork.org/scripts/540818/Disable%20All%20CSS%20Blur%20Effects.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        * {
            filter: none !important;
            backdrop-filter: none !important;
        }
    `;

    document.head.appendChild(style);
})();