// ==UserScript==
// @name Kaotandro
// @namespace http://tampermonkey.net/
// @license MIT
// @version 0.3
// @description Ermöglich das direkte Nutzen von Kaomoji in Tandro
// @author finolo
// @match https://tandro.de/*
// @grant GM_addStyle
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/544517/Kaotandro.user.js
// @updateURL https://update.greasyfork.org/scripts/544517/Kaotandro.meta.js
// ==/UserScript==

console.log("✅ Kaotandro running");

(function() {
    'use strict';

    let tandroPurple        = '#bf99ee';
    let tandroBackground    = '#1f2937'
    let tandroWindowColor   = '#374151';
    let tandroFontGrey      = '#9ca3af';
    let tandroFontPurple    = '#c4b5fd';

    let lastSentTime = 0;
    const cooldownPeriod = 1000;

    let kaomojiPanel;
    let favoriteKaomoji;

    /**
     * Insert Kaomoji into message. Only send it directly, if message was empty before.
     * @param {string} text The kaomoji string to send.
     */
    function sendMessage(text) {
        const input = document.querySelector('.message-text[contenteditable="true"]');
        if (input.innerText){
          console.log("text");
          input.innerText = input.innerText + text;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
        else {
          console.log("no text");
          input.innerText = text;
          input.dispatchEvent(new Event("input", { bubbles: true }));
           setTimeout(() => {
            input.dispatchEvent(new KeyboardEvent("keydown", {
                bubbles: true,
                cancelable: true,
                key: "Enter",
                code: "Enter"
              }));
          }, 100);
        }

    }

    /**
     * Checks if a message can be sent, respecting the cooldown period.
     * @returns {boolean} True if a message can be sent, otherwise false.
     */
    function canSendMessage() {
        return (Date.now() - lastSentTime) > cooldownPeriod;
    }

    /**
     * Makes an element draggable within the window.
     * @param {HTMLElement} element The element to be dragged.
     * @param {HTMLElement} handle The element that acts as the drag handle.
     */
    function makeDraggable(element, handle) {
        let isDragging = false;
        let currentX, currentY;
        let initialX, initialY;
        let xOffset = 0;
        let yOffset = 0;

        handle.addEventListener('mousedown', dragStart);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', drag);

        function dragStart(e) {
            const target = e.target;
            if (target.closest('#tab-bar-container') || target.closest('#tab-content-wrapper')) {
                return;
            }

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
            element.style.cursor = 'grabbing';
            element.style.zIndex = '10000';
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            element.style.cursor = 'grab';
            element.style.zIndex = '9999';
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, element);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }

    /**
     * Creates and appends the main kaomoji panel to the body.
     */
    function createUI() {
        if (document.getElementById("kaomojiPanel")) return;

        // look for AFK-Button to find position for Kaomoji Button
        const observer = new MutationObserver((mutationsList, observer) => {
            const afkButton = document.querySelector('button[title="AFK gehen"]');
            if (afkButton && kaomojiPanel) {
                const container = afkButton.parentElement;
                if (container){
                  const kaoButton = document.createElement('button');
                  kaoButton.className = 'px-1 py-2 text-gray-600 dark:text-gray-300 hover:text-violet-800 transition-colors';
                  kaoButton.title = 'kaoButton';
                  kaoButton.textContent = '◕‿◕';
                  container.appendChild(kaoButton);

                  kaoButton.addEventListener('click', () => {
                    if (kaomojiPanel.style.display === 'flex') {
                        kaomojiPanel.style.display = 'none';
                    } else {
                        kaomojiPanel.style.display = 'flex';
                    }
                  });
                }
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        favoriteKaomoji = localStorage.getItem('kaotandro_favorites');
        if (favoriteKaomoji) {
            favoriteKaomoji = JSON.parse(favoriteKaomoji);
        } else {
            favoriteKaomoji = [];
        }

        const panel = document.createElement("div");
        panel.id = "kaomojiPanel";
        panel.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ` + tandroWindowColor + `;
            opacity: 0.7;
            color: white;
            border: 1px solid #555;
            border-radius: 10px;
            z-index: 9999;
            font-family: sans-serif;
            box-shadow: 0 0 10px rgba(0,0,0,0.7);
            pointer-events: auto;
            width: 350px;
            min-height: 250px;
            max-height: 500px;
            display: flex;
            flex-direction: column;
            cursor: grab;
        `;

        kaomojiPanel = panel; // Assign the created panel to the global variable

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid ${tandroFontGrey}; margin-bottom: 1px;">
                <span style="font-weight: bold; color: ${tandroFontGrey};">KaoTandro ٩(◕‿◕｡)۶</span>
            </div>
            <div id="tab-bar-container" style="overflow-x: auto; flex-shrink: 0; cursor: default;">
                <div id="tab-bar" style="display: flex; flex-wrap: nowrap; width: max-content;">
                    ${Object.keys(stringsByTab).map((tabName, index) =>
                        `<span class="tab-button" data-tab="${tabName}" style="flex-shrink: 0; text-align: center; background: ${tandroWindowColor}; color: ${index === 1 ? tandroFontPurple : tandroFontGrey}; border: none; padding: 10px 5px; cursor: pointer; outline: none; border-right: 1px; white-space: nowrap; font-weight: bold">${tabName}</span>`
                    ).join('')}
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid ${tandroFontGrey};">
            </div>
            <div id="tab-content-wrapper" style="flex-grow: 1; overflow-y: auto; border-radius: 5px; background: ${tandroWindowColor}; padding: 5px; cursor: default;">
                ${Object.keys(stringsByTab).map((tabName, index) => {
                // Check if the current tab is 'Favorite'
                const dataToRender = tabName === 'Favorite' ? favoriteKaomoji : stringsByTab[tabName];

                return `<div id="copy-list-${tabName}" style="display: ${index === 1 ? 'block' : 'none'};">
                            ${dataToRender.map(str =>
                                `<span class="copy-item" style="cursor: pointer; padding: 5px; margin: 3px; border: 1px; border-radius: 3px; display: inline-block; font-size: 1.2em;">${str}</span>`
                            ).join('')}
                        </div>`;
                }).join('')}
            </div>
        `;

        document.body.appendChild(panel);

        const tabBarContainer = document.getElementById('tab-bar-container');
        const tabContentWrapper = document.getElementById('tab-content-wrapper');

        makeDraggable(panel, panel);

        // Add mouse wheel scrolling to the tab bar
        tabBarContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            tabBarContainer.scrollLeft += e.deltaY;
        });

        document.getElementById('tab-bar').addEventListener('click', (event) => {
            const targetButton = event.target.closest('.tab-button');
            if (targetButton) {
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.style.color = tandroFontGrey;
                });
                document.querySelectorAll('#tab-content-wrapper div').forEach(list => {
                    list.style.display = 'none';
                });

                targetButton.style.color = tandroFontPurple; // Set to highlight font color
                const tabName = targetButton.dataset.tab;
                const activeList = document.getElementById(`copy-list-${tabName}`);
                if (activeList) {
                    activeList.style.display = 'block';
                }
            }
        });

      tabContentWrapper.addEventListener('mouseover', (event) => {
        const targetElement = event.target.closest('.copy-item');
        document.querySelectorAll('.copy-item').forEach(btn => {
                    btn.style.color = 'white';
                });
        if (targetElement){
          targetElement.style.color = tandroFontPurple;
        }
      });

      tabContentWrapper.addEventListener('mouseout', (event) => {
        document.querySelectorAll('.copy-item').forEach(btn => {
                    btn.style.color = 'white';
                });
      });

      tabContentWrapper.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        const targetElement = event.target.closest('.copy-item');
        if (targetElement) {
            const textToCopy = targetElement.textContent;
            const index = favoriteKaomoji.indexOf(textToCopy);

            if (index > -1){
              favoriteKaomoji.splice(index, 1);
              const m_index = stringsByTab.Favorite.indexOf(textToCopy);
              stringsByTab.Favorite.splice(index, 1);
            }
            else{
              favoriteKaomoji.push(textToCopy);
              stringsByTab.Favorite.push(textToCopy);
            }

            localStorage.setItem('kaotandro_favorites', JSON.stringify(favoriteKaomoji));

            const favoriteTabPanel = document.getElementById('copy-list-Favorite');

            if (favoriteTabPanel) {
                // Generate the new HTML string from the updated data
                const newHTML = favoriteKaomoji.map(str =>
                    `<span class="copy-item" style="cursor: pointer; padding: 5px; margin: 3px; border: 1px; border-radius: 3px; display: inline-block; font-size: 1.2em;">${str}</span>`
                ).join('');

                favoriteTabPanel.innerHTML = newHTML;
            }

        }

      })

        tabContentWrapper.addEventListener('click', (event) => {
            const targetElement = event.target.closest('.copy-item');
            if (targetElement) {
                const textToCopy = targetElement.textContent;
                sendMessage(textToCopy);

                lastSentTime = Date.now();

                const originalText = targetElement.textContent;
                targetElement.dataset.originalText = originalText;

                const allKaomojiButtons = document.querySelectorAll('.copy-item');
                allKaomojiButtons.forEach(btn => {
                    btn.style.pointerEvents = 'none';
                    btn.style.opacity = '0.5';
                });

                setTimeout(() => {
                    allKaomojiButtons.forEach(btn => {
                        btn.style.pointerEvents = 'auto';
                        btn.style.opacity = '1';
                    });
                }, cooldownPeriod);
            }
        });
    }

   // Kaomojis, taken from https://github.com/mayudev/kaomoji-panel. Download their browser extension!
    const stringsByTab = {
        'Favorite': [],
        'Standard': [
            "٩(◕‿◕｡)۶",
            "(╯◕_◕)╯",
            "(╯︵╰,)",
            "(╯3╰)",
            "(╯_╰)",
            "(╹◡╹)凸",
            "(▰˘◡˘▰)",
            "(●´ω｀●)",
            "(●´∀｀●)",
            "(◑‿◐)",
            "(◑◡◑)",
            "(◕‿◕✿)",
            "(◕‿◕)",
            "(◕‿-)",
            "(◕︵◕)",
            "(◕ ^ ◕)",
            "(◕_◕)",
            "(◜௰◝)",
            "(◡‿◡✿)",
            "(◣_◢)",
            "(☞ﾟ∀ﾟ)☞",
            "(☞ﾟヮﾟ)☞",
            "(☞ﾟ ∀ﾟ )☞",
            "(☼◡☼)",
            "(☼_☼)",
            "(✌ﾟ∀ﾟ)☞",
            "(✖╭╮✖)",
            "(✪㉨✪)",
            "(✿◠‿◠)",
            "(✿ ♥‿♥)",
            "( ͡° ͜ʖ ͡°)",
        ],
        'Smiling': [
            "(•‿•)",
            "(・∀・)",
            "◉‿◉",
            "｡◕‿◕｡",
            "(. ❛ ᴗ ❛.)",
            "(θ‿θ)",
            "ʘ‿ʘ",
            "(✷‿✷)",
            "(◔‿◔)",
            "(◕ᴗ◕✿)",
            "(ʘᴗʘ✿)",
            "(人 •͈ᴗ•͈)",
            "(◍•ᴗ•◍)",
            "( ╹▽╹ )",
            "(≧▽≦)",
            "(☆▽☆)",
            "(✯ᴗ✯)",
            "ಡ ͜ ʖ ಡ",
            "(ㆁωㆁ)",
            "<(￣︶￣)>",
            "(*´ω｀*)",
            "( ꈍᴗꈍ)",
            "(✿^‿^)",
            "^_________^",
            "(◡ ω ◡)",
            "( ´◡‿ゝ◡`)",
            "(｡•̀ᴗ-)✧",
            "(◠‿◕)",
            "(◠‿・)—☆",
            "☆ ～('▽^人)",
            "✧◝(⁰▿⁰)◜✧",
            "(人*´∀｀)｡*ﾟ+",
            "(ﾉ◕ヮ◕)ﾉ*.✧",
            "( ´ ω ` )",
            "(⌒‿⌒)",
            "ヽ(・∀・)ﾉ",
            "(─‿‿─)",
            "(〃＾▽＾〃)",
            "(*≧ω≦*)",
            "\\(^ヮ^)/",
            "o( ❛ᴗ❛ )o",
            "(๑˃ᴗ˂)ﻭ",
            "(ﾉ´ヮ`)ﾉ*: ･ﾟ",
            "＼(٥⁀▽⁀ )／",
            "(￢‿￢)",
            "(¬‿¬)",
            "(„•ᴗ•„)",
            "(ᵔ◡ᵔ)",
            "(⌒ω⌒)",
            "(≧◡≦)",
            "＼(￣▽￣)／",
            "＼(＾▽＾)／",
            "o(>ω<)o",
            "(´･ᴗ･ ` )",
        ],
        'Love': [
            "(●♡∀♡)",
            "(๑♡⌓♡๑)",
            "(｡♡‿♡｡)",
            "(✿ ♡‿♡)",
            "(◍•ᴗ•◍)❤",
            "( ◜‿◝ )♡",
            "(｡･ω･｡)ﾉ♡",
            "(•ө•)♡",
            "(♡ω♡ ) ~♪",
            "꒰⑅ᵕ༚ᵕ꒱˖♡",
            "♡˖꒰ᵕ༚ᵕ⑅꒱",
            "♡(ӦｖӦ｡)",
            "ෆ╹ .̮ ╹ෆ",
            "(´∩｡• ᵕ •｡∩`)",
            "♡(> ਊ <)♡",
            "♥╣[-_-]╠♥",
            "(灬º‿º灬)♡",
            "(｡・//ε//・｡)",
            "(〃ﾟ3ﾟ〃)",
            "(´ε｀ )",
            "( ˘ ³˘)♥",
            "(~￣³￣)~",
            "(◕દ◕)",
            "(ʃƪ＾3＾）",
            "(*＾3＾)/～♡",
            "(っ˘з(˘⌣˘ )",
            "(●’3)♡(ε`●)",
            " (๑˙❥˙๑)",
            "(/^-^(^ ^*)/",
            "( ˶ ❛ ꁞ ❛ ˶ )",
            "(*˘︶˘*).｡*♡",
            "(◍•ᴗ•◍)✧*。",
        ],
        'Neutral': [
            "ヽ(ー_ー)ノ",
            "┐(‘～`)┌",
            "┐(￣～￣)┌",
            "╮(˘_˘)╭",
            "(¯¯٥)",
            "(¯ . ¯٥)",
            "(〃￣ω￣〃ゞ",
            "┐(￣ヘ￣;)┌",
            "(￢_￢)",
            "(→_→)",
            "(¬ ¬ )",
            "(ᓀ ᓀ)",
            "(↼_↼)",
            "(⇀_⇀)",
        ],
        'Hug': [
            "⊂((・▽・))⊃",
            "(づ｡◕‿‿◕｡)づ",
            "༼ つ ◕‿◕ ༽つ",
            "(づ￣ ³￣)づ",
            "(⊃｡•́‿•̀｡)⊃",
            "ʕっ•ᴥ•ʔっ",
            "(o´･_･)っ",
            "(⊃ • ʖ̫ • )⊃",
            "(つ≧▽≦)つ",
            "(つ✧ω✧)つ",
            "(っ.❛ ᴗ ❛.)っ",
            "～(つˆДˆ)つ｡☆",
            "ლ(´ ❥ `ლ)",
            "⊂(•‿•⊂ )*.✧",
            "⊂(´･◡･⊂ )∘˚˳°",
            "⊂(･ω･*⊂)",
            "⊂(・﹏・⊂)",
            "⊂(・▽・⊂)",
            "⊂(◉‿◉)つ",
            "o((*^▽^*))o",
            "╰(*´︶`*)╯",
            "╰(＾3＾)╯",
            "╰(⸝⸝⸝´꒳`⸝⸝⸝)╯",
            "♡(˃͈ દ ˂͈ ༶ )",
            "ヾ(˙❥˙)ﾉ",
            "＼(^o^)／",
            "ლ(・﹏・ლ)",
            "ლ(◕ω◕ლ)",
            "(/･ω･(-ω-)",
            "(･ω･)つ⊂(･ω･)",
            "( T_T)＼(^-^ )",
            "(･–･) \\(･◡･)/",
        ],
        'Muscles': [
            "ᕙ(⇀‸↼‶)ᕗ",
            "ᕙ(＠°▽°＠)ᕗ",
            "ᕙ( • ‿ • )ᕗ",
            "୧(﹒︠ᴗ﹒︡)୨",
            "ᕙ (° ~͜ʖ~ °) ᕗ",
            "ᕙ( ͡◉ ͜ ʖ ͡◉)ᕗ",
            "୧(＾ 〰 ＾)୨",
            "ᕙ( ¤ 〰 ¤ )ᕗ",
            "ᕙ( ~ . ~ )ᕗ",
            "ᕙ( : ˘ ∧ ˘ : )ᕗ",
            "ᕙ[･\u06dd･]ᕗ",
            "ᕦ( ⊡ 益 ⊡ )ᕤ",
            "ᕙ(ಠ ਊ ಠ)ᕗ",
            "ᕙ(☉ਊ☉)ᕗ",
            "୧( ಠ Д ಠ )୨",
            "ᕦ⊙෴⊙ᕤ",
            "ᕦ(ò_óˇ)ᕤ",
            "ᕦ(ಠ_ಠ)ᕤ",
            "ᕦ[ ◑ □ ◑ ]ᕤ",
            "ᕦ༼ ~ •́ ₒ •̀ ~ ༽ᕤ",
            "୧( ˵ ° ~ ° ˵ )୨",
            "୧| ͡ᵔ ﹏ ͡ᵔ |୨",
            "ᕙ (° ~ ° ~)",
            "( ͝° ͜ʖ͡°)ᕤ",
            "ᕙ( ͡° ͜ʖ ͡°)ᕗ",
            "ᕙ(͡°‿ ͡°)ᕗ",
            "ᕦ༼ຈل͜ຈ༽ᕤ",
            "༼ᕗຈل͜ຈ༽ᕗ",
            "ᕙ༼◕ ᴥ ◕༽ᕗ",
            "ᕦʕ •ᴥ•ʔᕤ",
            "ᕦᶘ ᵒ㉨ᵒᶅᕤ",
            "ᕦ༼✩ل͜✩༽ᕤ",
        ],
        'Animals': [
            "V●ᴥ●V",
            "▼・ᴥ・▼",
            "U ´꓃ ` U",
            "(◠ᴥ◕ʋ)",
            "U^ｪ^U",
            "( ͡°ᴥ ͡° ʋ)",
            "◖⚆ᴥ⚆◗",
            "/ᐠ｡ꞈ｡ᐟ\nฅ^•ﻌ•^ฅ",
            "(=^･ｪ･^=)",
            "(=｀ェ´=)",
            "(￣(ｴ)￣)ﾉ",
            "(*￣(ｴ)￣*)",
            "(≧(ｴ)≦ )",
            "(´(ｪ)｀）",
            "(・(ｪ)・）",
            "ʕ º ᴥ ºʔ",
            "ʕ·ᴥ·ʔ",
            "ʕ ꈍᴥꈍʔ",
            "ʕ´•ᴥ•`ʔ",
            "(✪㉨✪)",
            "(◕ᴥ◕)",
            "(ᵔᴥᵔ)",
            "Ꮚ˘ ꈊ ˘ Ꮚ",
            "(´・(oo)・｀)",
            "(^._.^)ﾉ",
            "～>`)～～～",
            "…ᘛ⁐̤ᕐᐷ",
            "くコ:彡",
            "-ᄒᴥᄒ-",
            "/╲/\\╭(•‿•)╮/\\╱\\",
            "Ƹ̵̡Ӝ̵̨̄Ʒ",
            "ᓚᘏᗢ",
        ],
        'Surprised': [
            "(･o･;)",
            "(・o・)",
            "(゜o゜;",
            "w(°ｏ°)w",
            "(☉｡☉)!",
            "(@_@)",
            "ヽ((◎д◎))ゝ",
            "＼(°o°)／",
            "ヽ(｡◕o◕｡)ﾉ.",
            "＼(◎o◎)／",
            "ヾ(*’Ｏ’*)/",
            "✧\\(>o<)ﾉ✧",
            "(ﾉ*0*)ﾉ",
            "ヽ༼⁰o⁰；༽ノ",
            "⋋✿ ⁰ o ⁰ ✿⋌",
            "щ(゜ロ゜щ)",
            "(ﾉﾟ0ﾟ)ﾉ~",
            "ლ(^o^ლ)",
            "(ﾟοﾟ人))",
            "⊙.☉",
            "(⑉⊙ȏ⊙)",
            "(ʘᗩʘ’)",
            "(‘◉⌓◉’)",
            "⁄(⁄ ⁄•⁄-⁄•⁄ ⁄)⁄",
            "(｡☬０☬｡)",
            "(´⊙ω⊙`)！",
            "(((;ꏿ_ꏿ;)))",
            "(●__●)",
            "(✿☉｡☉)",
            "(>0<；)",
            "༼⁰o⁰；༽",
            "(╬⁽⁽ ⁰ ⁾⁾ Д ⁽⁽ ⁰ ⁾⁾)",
        ],
        'Dancing': [
            "♪～(´ε｀ )",
            "(＾3＾♪",
            "┌(・。・)┘♪",
            "♪ヽ(･ˇ∀ˇ･ゞ)",
            "⁽⁽◝( •௰• )◜⁾⁾",
            "₍₍◞( •௰• )◟₎₎",
            "⁽⁽ଘ( ˊᵕˋ )ଓ⁾⁾",
            "₍₍ ◝(　ﾟ∀ ﾟ )◟ ⁾⁾",
            "\\(ϋ)/♩",
            "♪┌|∵|┘♪",
            "└|∵|┐♪",
            "♪ \\(^ω^\\ )",
            "( /^ω^)/♪♪",
            "(＾∇＾)ﾉ♪",
            "ヾ( ͝° ͜ʖ͡°)ノ♪",
            "\\(๑╹◡╹๑)ﾉ♬",
            "(*ﾉ・ω・)ﾉ♫",
            "┌|o^▽^o|┘♪",
            "┏(＾0＾)┛",
            "┌(★ｏ☆)┘",
            "└( ＾ω＾)」",
            "(｢`･ω･)｢",
            "♪(┌・。・)┌",
            "ヘ(￣ω￣ヘ)",
            "ƪ(‾.‾“)┐",
            "ƪ(˘⌣˘)ʃ",
            "(ノ^_^)ノ",
            "＼(ﾟｰﾟ＼)",
            "ヽ(*ﾟｰﾟ*)ﾉ",
            "ヾ(･ω･*)ﾉ",
            "(~‾▿‾)~",
            "〜(꒪꒳꒪)〜",
        ],
        'Shrug': [
            "¯\\_(ツ)_/¯",
            "¯\\_༼ •́ ͜ʖ •̀ ༽_/¯",
            "¯\\_( ͡° ͜ʖ ͡°)_/¯",
            "¯\\(°_o)/¯",
            "┐( ∵ )┌",
            "¯\\_༼ᴼل͜ᴼ༽_/¯",
            "╮(. ❛ ᴗ ❛.)╭",
            "乁༼☯‿☯✿༽ㄏ",
            "¯\\(◉‿◉)/¯",
            "¯\\_ʘ‿ʘ_/¯",
            "¯\\_༼ ಥ ‿ ಥ ༽_/¯",
            "╮(＾▽＾)╭",
            "乁[ ◕ ᴥ ◕ ]ㄏ",
            "乁[ᓀ˵▾˵ᓂ]ㄏ",
            "┐(´(エ)｀)┌",
            "┐( ˘_˘)┌",
            "┐(´ー｀)┌",
            "╮(╯_╰)╭",
            "¯\\_(⊙_ʖ⊙)_/¯",
            "乁( ⁰͡ Ĺ̯ ⁰͡ ) ㄏ",
            "¯\\_( ͠° ͟ʖ °͠ )_/¯",
            "乁( •_• )ㄏ",
            "乁| ･ 〰 ･ |ㄏ",
            "┐(‘～`;)┌",
            "┐(￣ヘ￣)┌",
            "┐(´д`)┌",
            "乁( . ര ʖ̯ ര . )ㄏ",
            "乁 ˘ o ˘ ㄏ",
            "乁ʕ •̀ \u06dd •́ ʔㄏ",
            "¯\\_〳 •̀ o •́ 〵_/¯",
            "¯\\_(☯෴☯)_/¯",
            "乁║ ˙ 益 ˙ ║ㄏ",
        ],
        'Tableflip': [
            "(╯°□°）╯︵ ┻━┻",
            "(ノ｀Д´)ノ彡┻━┻",
            "(┛◉Д◉)┛彡┻━┻",
            "(ﾉ≧∇≦)ﾉ ﾐ ┻━┻",
            "(ノಠ益ಠ)ノ彡┻━┻",
            "(╯ರ ~ ರ)╯︵ ┻━┻",
            "(┛ಸ_ಸ)┛彡┻━┻",
            "(ﾉ´･ω･)ﾉ ﾐ ┻━┻",
            "(ノಥ,_｣ಥ)ノ彡┻━┻",
            "(┛✧Д✧))┛彡┻━┻",
            "┻┻︵¯\\(ツ)/¯︵┻┻",
            "┻┻︵ヽ(`Д´)ﾉ︵┻┻",
            "(/¯◡ ‿ ◡)/¯ ~ ┻━┻",
            "(ノ｀⌒´)ノ┫：・┻┻",
            "(ﾉ°_o)ﾉ⌒┫ ┻ ┣ ┳",
            "┻━┻ミ＼(≧ﾛ≦＼)",
            "┻━┻︵└(՞▽՞ └)",
            "┻━┻︵└(´_｀└)",
            "┻━┻ ヘ╰( •̀ε•́ ╰)",
            "─=≡Σ(╯°□°)╯︵┻┻",
            "(ノ•̀ o •́ )ノ ~ ┻━┻",
            "(-_- )ﾉ⌒┫ ┻ ┣ ┳",
            "(ノ￣皿￣)ノ ⌒== ┫",
            "(┛❍ᴥ❍)┛彡┻━┻",
            "(ノT＿T)ノ ＾┻━┻",
            "ʕノ•ᴥ•ʔノ ︵ ┻━┻",
            "┬─┬ノ( ͡° ͜ʖ ͡°ノ)",
            "┬─┬ノ(ಠ_ಠノ)",
            "┬─┬ノ( º _ ºノ)",
            "┬──┬◡ﾉ(° -°ﾉ)",
            "(ヘ･_･)ヘ┳━┳",
            "┬──┬ ¯\\_(ツ)",
        ],
        'Disapproval': [
            "ಠ_ಠ",
            "ಠ_ʖಠ",
            "ಠ︵ಠ",
            "ಠ ೧ ಠ",
            "ಠಗಠ",
            "ಠ,_｣ಠ",
            "ಠωಠ",
            "ಠ ͜ʖ ಠ",
            "ಠ◡ಠ",
            "ಠ∀ಠ",
            "ಠ﹏ಠ",
            "ಠ‿ಠ",
            "ಠ益ಠ",
            "ಠᴥಠ",
            "ʕಠ_ಠʔ",
            "Σ(ಠ_ಠ)",
            "(ಠ_ಠ)>⌐■-■",
            "(⌐■-■)",
            "[̲̅$̲̅(̲̅ ͡ಠ_ಠ)̲̅$̲̅]",
            "ಠ ل͟ ಠ",
            "(ノಠ益ಠ)ノ",
            "(ಠ_ಠ)━☆ﾟ.*･｡ﾟ",
            "¯\\_ಠ_ಠ_/¯",
            "ರ_ರ",
            "ರ╭╮ರ",
            "(눈‸눈)",
            "(ب_ب)",
            "ತ_ತ",
            "ತ_ʖತ",
            "ಠಿ_ಠi",
            "ಠಿ_ಠ",
            "ಠಿヮಠ",
        ],
        'Cry': [
            "•́ ‿ ,•̀",
            "ಥ‿ಥ",
            "ʕ´• ᴥ•̥`ʔ",
            "༎ຶ‿༎ຶ",
            "( ；∀；)",
            "(´；ω；｀)",
            "(･ัω･ั)",
            "(╯︵╰,)",
            "Ó╭╮Ò",
            "(っ˘̩╭╮˘̩)っ",
            "( ･ั﹏･ั)",
            "(｡ŏ﹏ŏ)",
            "(๑´•.̫ • `๑)",
            "(´ . .̫ . `)",
            "(｡•́︿•̀｡)",
            "(｡ﾉω＼｡)",
            "ಥ╭╮ಥ",
            "(ᗒᗩᗕ)",
            "( ≧Д≦)",
            ".·´¯`(>▂<)´¯`·.",
            "( ⚈⌢⚈)",
            "ಥ_ಥ",
            "(´;︵;`)",
            "༼;´༎ຶ \u06dd ༎ຶ༽",
            "｡:ﾟ(;´∩`;)ﾟ:｡",
            "(༎ຶ ෴ ༎ຶ)",
            "( ꈨຶ ˙̫̮ ꈨຶ )",
            "(〒﹏〒)",
            "(个_个)",
            "(╥﹏╥)",
            "(-̩̩̩-̩̩̩-̩̩̩-̩̩̩-̩̩̩___-̩̩̩-̩̩̩-̩̩̩-̩̩̩-̩̩̩)",
            "(´°ω°｀)",
        ],
        'Nervous': [
            "(๑•﹏•)",
            "(⌒_⌒;)",
            "⊙﹏⊙",
            "╏ ” ⊚ ͟ʖ ⊚ ” ╏",
            "(╬☉д⊙)⊰⊹ฺ",
            "ヘ（。□°）ヘ",
            "(⊙_◎)",
            "ミ●﹏☉ミ",
            "(●´⌓`●)",
            "(*﹏*;)",
            "(＠_＠;)",
            "(ꏿ﹏ꏿ;)",
            "(;ŏ﹏ŏ)",
            "(• ▽ •;)",
            "(˘･_･˘)",
            "(*・～・*)",
            "(・_・;)",
            "(;;;・_・)",
            "(・–・;)ゞ",
            "(^～^;)ゞ",
            "(￣ヘ￣;)",
            "(٥↼_↼)",
            "(ー_ー゛)",
            "(─.─||）",
            "(-_-;)",
            "(-_-メ)",
            "(-_-;)・・・",
            "(´-﹏-`；)",
            "(~_~メ)",
            "(~_~;)",
            "(ʘ言ʘ╬)",
            "(^_^メ)",
            "(；^ω^）",
            "٩(｡•́‿•́｡)۶",
        ],
        'Pointing': [
            "┗(•ˇ_ˇ•)―→",
            "(☞ ಠ_ಠ)☞",
            "(☞ﾟ∀ﾟ)☞",
            "☞￣ᴥ￣☞",
            "→(° \u06dd °)┗",
            "→_→",
            "←_←",
            "⟵(o_O)",
            "⟵(๑¯◡¯๑)",
            "ԅ( ͒ \u06dd ͒ )ᕤ",
            "☜ (↼_↼)",
            "｡.ﾟ+ ⟵(｡･ω･)",
            "←(>▽<)ﾉ",
            "←(*꒪ヮ꒪*)",
            "(☞^o^) ☞",
            "(╭☞•́⍛•̀)╭☞",
            "〈(•ˇ‿ˇ•)-→",
            "(?・・)σ",
            "(☉｡☉)!→",
            "(ﾉﾟ0ﾟ)ﾉ→",
            "(´⊙ω⊙`)→",
            "(☞ﾟヮﾟ)☞",
            "(☞ ͡° ͜ʖ ͡°)☞",
            "´◔‿ゝ◔`)━☞",
            "( ՞ਊ ՞）→",
            "(\u3000･ω･)☞",
            "(*❛‿❛)→",
            "╰( ･ ᗜ ･ )➝",
            "(✧Д✧)→",
            "(｡◕‿◕｡)➜",
            "<(￣︶￣)↗",
            "*･゜ﾟ(^O^)↝",
        ],
    };

    // Initialize the script
    window.addEventListener('load', () => {
        createUI(); 
        kaomojiPanel.style.display = 'none';
    });

})();
