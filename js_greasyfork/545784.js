// ==UserScript==
// @name        Twitter to Nitter Redirector
// @name:en     Twitter to Nitter Redirector
// @name:nl     Twitter naar Nitter Doorverwijzer
// @name:es     Redireccionador de Twitter a Nitter
// @name:fr     Redirecteur de Twitter vers Nitter
// @name:de     Twitter zu Nitter Weiterleiter
// @name:zh-CN  Twitter 到 Nitter 重定向器
// @name:ja     TwitterからNitterへのリダイレクト
// @name:ru     Перенаправитель Twitter на Nitter
// @name:pt     Redirecionador de Twitter para Nitter
// @name:it     Reindirizzatore da Twitter a Nitter
// @namespace   https://greasyfork.org/nl/users/1197317-opus-x
// @version      1.03
// @description Redirects Twitter/X.com to Nitter.net. Skips if ?nonitter is present and appends ?nonitter to links (see: Nitter/Nonitter Companion for Twitter to Nitter Redirector with Skip)
// @description:en Redirects Twitter/X.com to Nitter.net. Skips if ?nonitter is present and appends ?nonitter to links (see: Nitter/Nonitter Companion for Twitter to Nitter Redirector with Skip)
// @description:nl Leidt Twitter/X.com om naar Nitter.net. Slaat over als ?nonitter aanwezig is en voegt ?nonitter toe aan links (zie: Nitter/Nonitter Companion voor Twitter naar Nitter Doorverwijzer met Overslaan)
// @description:es Redirige Twitter/X.com a Nitter.net. Omite si ?nonitter está presente y agrega ?nonitter a los enlaces (ver: Compañero Nitter/Nonitter para Redireccionador de Twitter a Nitter con Omisión)
// @description:fr Redirige Twitter/X.com vers Nitter.net. Ignore si ?nonitter est présent et ajoute ?nonitter aux liens (voir : Compagnon Nitter/Nonitter pour Redirecteur de Twitter vers Nitter avec Contournement)
// @description:de Leitet Twitter/X.com zu Nitter.net um. Überspringt, wenn ?nonitter vorhanden ist, und fügt ?nonitter zu Links hinzu (siehe: Nitter/Nonitter-Begleiter für Twitter zu Nitter Weiterleitung mit Überspringen)
// @description:zh-CN 将 Twitter/X.com 重定向到 Nitter.net。如果存在 ?nonitter 则跳过，并将 ?nonitter 附加到链接（参见：Twitter 到 Nitter 重定向的 Nitter/Nonitter 伴侣，带跳过）
// @description:ja Twitter/X.comをNitter.netにリダイレクトします。?nonitterが存在する場合スキップし、リンクに?nonitterを追加（参照：TwitterからNitterへのリダイレクト用Nitter/Nonitterコンパニオン（スキップ付き））
// @description:ru Перенаправляет Twitter/X.com на Nitter.net. Пропускает, если присутствует ?nonitter, и добавляет ?nonitter к ссылкам (см.: Компаньон Nitter/Nonitter для перенаправления Twitter на Nitter с пропуском)
// @description:pt Redireciona Twitter/X.com para Nitter.net. Ignora se ?nonitter estiver presente e adiciona ?nonitter aos links (ver: Companheiro Nitter/Nonitter para Redirecionador de Twitter para Nitter com Ignorar)
// @description:it Reindirizza Twitter/X.com a Nitter.net. Salta se ?nonitter è presente e aggiunge ?nonitter ai link (vedi: Compagno Nitter/Nonitter per Reindirizzatore da Twitter a Nitter con Salto)
// @author      Opus-X
// @license     MIT
// @match       https://x.com/*
// @match       https://twitter.com/*
// @exclude-match https://x.com/
// @exclude-match https://x.com/home
// @exclude-match https://x.com/explore
// @exclude-match https://x.com/notifications
// @exclude-match https://x.com/messages
// @exclude-match https://x.com/i/*
// @exclude-match https://x.com/bookmarks
// @exclude-match https://x.com/*/communities
// @exclude-match https://x.com/compose
// @exclude-match https://x.com/intent/tweet
// @exclude-match https://twitter.com/
// @exclude-match https://twitter.com/home
// @exclude-match https://twitter.com/explore
// @exclude-match https://twitter.com/notifications
// @exclude-match https://twitter.com/messages
// @exclude-match https://twitter.com/i/*
// @exclude-match https://twitter.com/bookmarks
// @exclude-match https://twitter.com/*/communities
// @exclude-match https://twitter.com/compose
// @exclude-match https://twitter.com/intent/tweet
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/545784/Twitter%20to%20Nitter%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/545784/Twitter%20to%20Nitter%20Redirector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const NITTER = 'nitter.net';

    const currentURL = window.location.href;
    const hasNonitter = currentURL.includes('?nonitter') || currentURL.includes('&nonitter');
    const isRootOrHome = /^https:\/\/(x|twitter)\.com(\/|\/home)?$/.test(currentURL);

    if (hasNonitter || isRootOrHome) {
        // Skip redirect and append ?nonitter to links
        document.addEventListener('DOMContentLoaded', function() {
            function appendNonitter() {
                const links = document.querySelectorAll('a[href*="x.com"], a[href*="twitter.com"], a[href*="t.co"], a[href^="/"]');
                links.forEach(link => {
                    let href = link.getAttribute('href');
                    if (href.startsWith('/')) {
                        href = 'https://x.com' + href;
                    }
                    if (!href.includes('?nonitter') && !href.includes('&nonitter')) {
                        if (href.includes('?')) {
                            link.href = href + '&nonitter';
                        } else {
                            link.href = href + '?nonitter';
                        }
                    }
                });
            }

            appendNonitter();

            const observer = new MutationObserver(appendNonitter);
            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(appendNonitter, 2000);
        });
        if (isRootOrHome && !hasNonitter) {
            window.location.assign(currentURL + (currentURL.includes('?') ? '&nonitter' : '?nonitter'));
        }
        return;
    }

    const redirectedURL = currentURL.replace(/^https:\/\/(x|twitter)\.com/, `https://${NITTER}`);

    if (redirectedURL !== currentURL) {
        window.location.assign(redirectedURL);
    }
})();