// ==UserScript==
// @name        Nitter/Nonitter Companion for Twitter to Nitter Redirector with Skip
// @name:en     Nitter/Nonitter Companion for Twitter to Nitter Redirector with Skip
// @name:nl     Nitter/Nonitter Companion voor Twitter naar Nitter Doorverwijzing met Overslaan
// @name:es     Compañero Nitter/Nonitter para el Redireccionador de Twitter a Nitter con Omisión
// @name:fr     Compagnon Nitter/Nonitter pour le Redirecteur de Twitter vers Nitter avec Contournement
// @name:de     Nitter/Nonitter-Begleiter für Twitter zu Nitter Weiterleitung mit Überspringen
// @name:zh-CN  Nitter/Nonitter 伴侣，用于 Twitter 到 Nitter 重定向并跳过
// @name:ja     TwitterからNitterへのリダイレクト用Nitter/Nonitterコンパニオン（スキップ付き）
// @name:ru     Компаньон Nitter/Nonitter для перенаправления Twitter на Nitter с пропуском
// @name:pt     Companheiro Nitter/Nonitter para Redirecionador de Twitter para Nitter com Ignorar
// @name:it     Compagno Nitter/Nonitter per il Reindirizzatore da Twitter a Nitter con Salto
// @namespace   https://greasyfork.org/nl/users/1197317-opus-x
// @version     1.02
// @description Companion script for X.com/Twitter to Nitter Redirector, adds ?nonitter to Twitter icon links on nitter.net to prevent redirect back to Nitter
// @description:en Companion script for X.com/Twitter to Nitter Redirector, adds ?nonitter to Twitter icon links on nitter.net to prevent redirect back to Nitter
// @description:nl Companion-script voor X.com/Twitter naar Nitter Doorverwijzer, voegt ?nonitter toe aan Twitter-icoonlinks op nitter.net om terugverwijzing naar Nitter te voorkomen
// @description:es Script compañero para el Redireccionador de X.com/Twitter a Nitter, agrega ?nonitter a los enlaces de íconos de Twitter en nitter.net para evitar redirecciones de vuelta a Nitter
// @description:fr Script compagnon pour le Redirecteur de X.com/Twitter vers Nitter, ajoute ?nonitter aux liens d'icônes Twitter sur nitter.net pour éviter une redirection vers Nitter
// @description:de Begleitscript für die Weiterleitung von X.com/Twitter zu Nitter, fügt ?nonitter zu Twitter-Symbollinks auf nitter.net hinzu, um eine Rückweiterleitung zu Nitter zu verhindern
// @description:zh-CN X.com/Twitter 到 Nitter 重定向的伴侣脚本，在 nitter.net 上的 Twitter 图标链接添加 ?nonitter 以防止重定向回 Nitter
// @description:ja X.com/TwitterからNitterへのリダイレクト用コンパニオンスクリプト。nitter.net上のTwitterアイコンリンクに?nonitterを追加して、Nitterへのリダイレクトを防ぎます
// @description:ru Скрипт-компаньон для перенаправления X.com/Twitter на Nitter, добавляет ?nonitter к ссылкам на иконки Twitter на nitter.net, чтобы предотвратить перенаправление обратно на Nitter
// @description:pt Script companheiro para o Redirecionador de X.com/Twitter para Nitter, adiciona ?nonitter aos links de ícones do Twitter em nitter.net para evitar redirecionamento de volta ao Nitter
// @description:it Script compagno per il Reindirizzatore da X.com/Twitter a Nitter, aggiunge ?nonitter ai link delle icone di Twitter su nitter.net per evitare il reindirizzamento a Nitter
// @author      Opus-X
// @license     MIT
// @match       https://nitter.net/*
// @match       https://xcancel.com/*
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/545781/NitterNonitter%20Companion%20for%20Twitter%20to%20Nitter%20Redirector%20with%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/545781/NitterNonitter%20Companion%20for%20Twitter%20to%20Nitter%20Redirector%20with%20Skip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function appendNonitter() {
        console.log('Running appendNonitter on nitter.net');
        const links = document.querySelectorAll('a.icon-bird[title="Open in Twitter"]');
        links.forEach(link => {
            let href = link.getAttribute('href');
            // Skip if already has nonitter
            if (!href.includes('?nonitter') && !href.includes('&nonitter')) {
                console.log('Modifying link: ' + href);
                if (href.includes('?')) {
                    link.href = href + '&nonitter';
                } else {
                    link.href = href + '?nonitter';
                }
                console.log('Modified to: ' + link.href);
            }
        });
    }

    // Run on initial load
    appendNonitter();

    // Observe for dynamic content
    const observer = new MutationObserver(() => {
        console.log('Mutation detected, running appendNonitter');
        appendNonitter();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Additional run after 2 seconds for late-loaded content
    setTimeout(appendNonitter, 2000);
})();