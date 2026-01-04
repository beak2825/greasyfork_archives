// ==UserScript==
// @name         NoredInk Bubble Fill 100% Hack
// @namespace    https://discord.gg/fUYvHeg3sN
// @version      2.0
// @description  Automatically fills mastery bubbles every 1 second
// Authot        Jaguar
// icon          https://media.discordapp.net/attachments/1140295926741745804/1140439131781087262/7234c7dfb6b45cb72a80b44a2303a342.png?width=473&height=473
// @match        https://www.noredink.com/learn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473472/NoredInk%20Bubble%20Fill%20100%25%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/473472/NoredInk%20Bubble%20Fill%20100%25%20Hack.meta.js
// ==/UserScript==


    // Pick How Many Bubbles You Want Filled with 100%
             const BubbleFill = 10;                 //
   // Pick How Many Bubbles You Want Filled with 100%

    setInterval(() => {
        const completedElements = document.querySelectorAll('.Nri-Mastery-MasteryBadgeMasteryFilledCompletion');
        for (let i = 0; i < Math.min(BubbleFill, completedElements.length); i++) {
            completedElements[i].outerHTML = '<span class="mastery-tracking-MasteryLearningPathCompletion _19fe9621"><div class="_e97297e4"><div class="_f7973529 Nri-Mastery-MasteryBadgeMasteryFilledCompletion"><div class="_f7973529 Nri-Mastery-MasteryBadgeMasteryFilledCompletion"><div class="_f7973529 Nri-Mastery-MasteryBadgeMasteryFilledCompletion"><div class="_91b4b8b8"></div><div class="_3f22129b">100%</div></div></div></div></div></span>';
        }
        const notCompletedElements = document.querySelectorAll('.Nri-Mastery-MasteryBadgeMasteryNoActivityCompletion');
        for (let i = 0; i < Math.min(BubbleFill , notCompletedElements.length); i++) {
            notCompletedElements[i].outerHTML = '<span class="mastery-tracking-MasteryLearningPathCompletion _19fe9621"><div class="_e97297e4"><div class="_f7973529 Nri-Mastery-MasteryBadgeMasteryFilledCompletion"><div class="_f7973529 Nri-Mastery-MasteryBadgeMasteryFilledCompletion"><div class="_f7973529 Nri-Mastery-MasteryBadgeMasteryFilledCompletion"><div class="_91b4b8b8"></div><div class="_3f22129b">100%</div></div></div></div></div></span>';
        }
    }, 1);

