// ==UserScript==
// @name              NetSkip
// @name:pt-BR        NetSkip
// @name:en           NetSkip
// @name:es           NetSkip
// @name:zh-CN        NetSkip
// @name:fr           NetSkip
// @namespace         https://github.com/0H4S
// @version           1.1
// @description       Automatically skips intros and clicks next episode on Netflix.
// @description:pt-BR Pula aberturas e clica em próximo episódio automaticamente na Netflix.
// @description:en    Automatically skips intros and clicks next episode on Netflix.
// @description:es    Omite introducciones y hace clic en el siguiente episodio automáticamente en Netflix.
// @description:zh-CN 自动跳过 Netflix 剧集的片头并点击下一集。
// @description:fr    Saute automatiquement les intros et clique sur l'épisode suivant sur Netflix.
// @author            OHAS
// @license           MIT
// @homepageURL       https://github.com/0H4S
// @icon              https://cdn-icons-png.flaticon.com/512/9546/9546390.png
// @match             https://www.netflix.com/*
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/545752/NetSkip.user.js
// @updateURL https://update.greasyfork.org/scripts/545752/NetSkip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const skipIntroButton = document.querySelector('button[data-uia="player-skip-intro"]');
                if (skipIntroButton) {
                    skipIntroButton.click();
                }
                const nextEpisodeButton = document.querySelector('button[data-uia="next-episode-seamless-button"]');
                if (nextEpisodeButton) {
                    nextEpisodeButton.click();
                }
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();