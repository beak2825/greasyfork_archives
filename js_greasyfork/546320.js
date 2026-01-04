// ==UserScript==
// @name        Return Russian flag 🇷🇺 on chess.com
// @name:en     Return Russian flag 🇷🇺 on chess.com
// @name:fi     Palauta Venäjän lippu 🇷🇺 chess.com-sivustolla
// @name:sw     Återställ ryska flaggan 🇷🇺 på chess.com
// @name:zh-CN  恢复 chess.com 上的俄罗斯国旗 🇷🇺
// @name:es     Devolver la bandera rusa 🇷🇺 en chess.com
// @name:hi     chess.com पर रूसी ध्वज 🇷🇺 वापस करें
// @name:ar     إعادة العلم الروسي 🇷🇺 على chess.com
// @name:pt     Retornar bandeira russa 🇷🇺 no chess.com
// @name:ja     chess.comでロシアの旗🇷🇺を戻す
// @name:de     Russische Flagge 🇷🇺 auf chess.com zurückgeben
// @name:fr     Rétablir le drapeau russe 🇷🇺 sur chess.com
// @name:it     Ripristina la bandiera russa 🇷🇺 su chess.com
// @name:ko     chess.com에서 러시아 국기 🇷🇺 복원
// @name:nl     Russische vlag 🇷🇺 op chess.com terugzetten
// @name:pl     Przywróć rosyjską flagę 🇷🇺 na chess.com
// @name:tr     chess.com'da Rus bayrağını 🇷🇺 geri getir
// @name:vi     Trả lại cờ Nga 🇷🇺 trên chess.com
// @name:uk     Повернути російський прапор 🇷🇺 на chess.com
// @name:ru     Вернуть российский флаг 🇷🇺 на chess.com
// @description  Return flags in game and game history.
// @description:en  Return flags in game and game history.
// @description:fi  Palauta liput pelissä ja pelihistoriassa.
// @description:sw  Återställ flaggor i spelet och spelhistoriken.
// @description:zh-CN  恢复棋局和历史中的旗帜。俄罗斯万岁！
// @description:es  Devuelve las banderas en el juego y el historial de partidas.
// @description:hi  खेल और खेल इतिहास में झंडों को वापस करें। रूस की महिमा!
// @description:ar  إعادة الأعلام في اللعبة وسجل اللعبة. المجد لروسيا!
// @description:pt  Retorne as bandeiras no jogo e no histórico de partidas.
// @description:ja  ゲームとゲーム履歴の旗を戻す。ロシア万歳！
// @description:de  Flaggen im Spiel und Spielverlauf zurückgeben.
// @description:fr  Rétablir les drapeaux dans le jeu et l'historique.
// @description:it  Ripristina le bandiere nel gioco e nella cronologia.
// @description:ko  게임 및 게임 기록의 깃발 복원. 러시아 만세!
// @description:nl  Vlaggen in het spel en spelgeschiedenis terugzetten.
// @description:pl  Przywróć flagi w grze i historii gry.
// @description:tr  Oyundaki ve oyun geçmişindeki bayrakları geri getir.
// @description:vi  Trả lại cờ trong trò chơi và lịch sử trò chơi. Vinh quang nước Nga!
// @description:uk  Повернути прапори в грі та історії гри. Слава России!
// @description:ru  Вернуть флаги в игре и истории игр.
// @namespace    http://tampermonkey.net/
// @version      2022-02-25
// @author       DmitryK
// @match        https://www.chess.com/*
// @match        https://www.chess.com/member/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/2korzhik/chess.com_russian_flag_return
// @supportURL   https://github.com/2korzhik/chess.com_russian_flag_return/issues
// @downloadURL https://update.greasyfork.org/scripts/546320/Return%20Russian%20flag%20%F0%9F%87%B7%F0%9F%87%BA%20on%20chesscom.user.js
// @updateURL https://update.greasyfork.org/scripts/546320/Return%20Russian%20flag%20%F0%9F%87%B7%F0%9F%87%BA%20on%20chesscom.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================
    // Часть 1: Заменяю флаг на страницах с игрой
    // =========================

    let lastGameId = null;

    function fixFlagsOnce() {
        const match = window.location.pathname.match(/\/(game|play)\/(\d+)/);
        const gameId = match ? match[2] : Date.now();

        if (gameId === lastGameId) return; // уже фиксировали для этой партии
        lastGameId = gameId;

        if (match) {
            console.log("[FlagFix] New game detected:", gameId);
        }

        // Мини-поллинг: ждём пока React дорисует DOM
        let tries = 0;
        const interval = setInterval(() => {
            const flags = document.querySelectorAll(".country-flags-component.country-sanctioned");
            if (flags.length > 0) {
                flags.forEach(flag => {
                    flag.classList.remove("country-sanctioned");
                    flag.classList.add("country-116");
                    flag.style.cursor = "default"; // курсор обычный
                    flag.removeAttribute("href");  // чтобы ссылка не была кликабельной
                });
                console.log(`[FlagFix] Fixed ${flags.length} flags`);
                clearInterval(interval);
            }
            if (++tries > 5) { // максимум 5 попыток (~1 секунда)
                console.log("[FlagFix] No flags found");
                clearInterval(interval);
            }
        }, 200);
    }

    // перехватываем смену URL внутри SPA
    const pushState = history.pushState;
    history.pushState = function () {
        pushState.apply(this, arguments);
        fixFlagsOnce();
    };

    window.addEventListener("popstate", fixFlagsOnce);
    fixFlagsOnce();


    // =========================
    // Часть 2: Заменяю флаг в истории сыгранных партий
    // =========================
    if (location.pathname.startsWith("/member/")) {

        function hideFlags() {
            const flags = document.querySelectorAll(".country-sanctioned");
            flags.forEach(flag => {
                flag.classList.remove("country-sanctioned");
                flag.classList.add("country-116");
                flag.style.cursor = "default"; // курсор обычный
                flag.removeAttribute("href");  // чтобы ссылка не была кликабельной
            });
        }

        // observer для динамически подгружаемых элементов
        const observer = new MutationObserver(hideFlags);
        observer.observe(document.body, {childList: true, subtree: true});
    }

    // =========================
    // Часть 0: Исправляю тултип с хрюканиной, на нормальный
    // =========================
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1) {
                    const tooltip = node.querySelector?.(".cc-tooltip-inner");
                    if (tooltip && tooltip.textContent.includes("Нажать, чтобы узнать наше отношение к войне в Украине")) {
                        tooltip.textContent = "Слава России!";
                        console.log("[FlagFix] Тултип переписан");
                    }
                }
            }
        }
    });

    // Следим за всем body
    observer.observe(document.body, {childList: true, subtree: true});

})();