// ==UserScript==
// @name         Auto Like Lives TRIBO
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Dá like automaticamente em lives de canais da Tribo
// @match        https://www.youtube.com/watch*
// @grant        none
// @author       Delkz
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541349/Auto%20Like%20Lives%20TRIBO.user.js
// @updateURL https://update.greasyfork.org/scripts/541349/Auto%20Like%20Lives%20TRIBO.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const friendlyContentCreators = ["Gaules","bt0", "LiminhaG0d","steelegabr","nak"];

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let waited = 0;
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                }
                waited += interval;
                if (waited >= timeout) {
                    clearInterval(timer);
                    reject("⏰ Timeout esperando elemento: " + selector);
                }
            }, interval);
        });
    }

    async function autoLike() {
        try {
            const channelLink = await waitForElement(".ytd-channel-name a");
            const currentContentCreator = channelLink.textContent.trim();

            if (!friendlyContentCreators.includes(currentContentCreator)) {
                console.log("🔕 Canal não está na whitelist:", currentContentCreator);
                return;
            }

            const likeButton = await waitForElement('like-button-view-model button[aria-label*="Gostei"]');
            const isAlreadyLiked = likeButton.getAttribute("aria-pressed") === "true";

            if (!isAlreadyLiked) {
                likeButton.click();
                console.log("👍 Like dado automaticamente em:", currentContentCreator);
            } else {
                console.log("✅ Vídeo já curtido de:", currentContentCreator);
            }
        } catch (err) {
            console.warn("❌ Erro no auto-like:", err);
        }
    }

    // Observa mudanças de URL (SPA) e executa a função sempre que um novo vídeo for aberto
    const onNavigation = () => {
        console.log("🔄 Nova navegação detectada");
        autoLike();
    };

    // Ativamos o evento customizado emitido pelo YouTube (navegação SPA concluída)
    window.addEventListener("yt-navigate-finish", onNavigation);

    // Executa também no primeiro carregamento
    autoLike();
})();
