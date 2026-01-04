// ==UserScript==
// @name         Game Dark Minimalist Mod (Red Accent & Semi-Transparent)
// @namespace    http://tampermonkey.net/
// @version      2025-01-19
// @description  Applies a dark, minimalist theme with red/orange accents and semi-transparent backgrounds to the game interface, preserving original layout.
// @author       me
// @match        https://worldcats.ru/play/
// @match        https://worldcats.ru/play/?v=b
// @match        https://catlifeonline.com/play/
// @match        https://catlifeonline.com/play/?v=b
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catlifeonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543700/Game%20Dark%20Minimalist%20Mod%20%28Red%20Accent%20%20Semi-Transparent%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543700/Game%20Dark%20Minimalist%20Mod%20%28Red%20Accent%20%20Semi-Transparent%29.meta.js
// ==/UserScript==

(function() {
    const styleId = 'game-mod-dark-minimalist-advanced';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
        console.log('Создан новый элемент <style> для мода.');
    } else {
        console.log('Элемент <style> для мода уже существует, обновляем его.');
    }

    const css = `
        :root {
            --bg-color-darkest: rgba(15, 15, 15, 0.5); /* Почти черный, полупрозрачный */
            --bg-color-dark: rgba(26, 26, 26, 0.5);    /* Темно-серый, полупрозрачный */
            --bg-color-medium: rgba(42, 42, 42, 0.5);   /* Средне-серый, полупрозрачный */
            --text-color-light: #e0e0e0; /* Светлый текст для контраста */
            --accent-color: #e54c00;     /* ОРАНЖЕВО-КРАСНЫЙ */
            --accent-hover-color: #ff6a00; /* Более яркий ОРАНЖЕВО-КРАСНЫЙ */
            --border-color: #333333;     /* Темный цвет границ */
            --scrollbar-thumb: #555555; /* Цвет ползунка скроллбара */
            --scrollbar-track: #222222; /* Цвет дорожки скроллбара */
            --main-alpha: 0.5;           /* Общая прозрачность для большинства фонов */
            --accent-alpha: 0.8;         /* Прозрачность для акцентных фонов */
            --transition-speed: 0.2s ease-in-out; /* Скорость анимаций */
            --font-family-base: system-ui, -apple-system, -apple-system-font, 'Segoe UI', 'Roboto', sans-serif;
        }
        * { -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important; box-sizing: border-box !important; margin: revert; padding: revert; }
        body { -webkit-touch-callout: none !important; -webkit-text-size-adjust: none !important; -webkit-user-select: none !important; user-select: none !important; font-family: var(--font-family-base) !important; font-size: 12px; line-height: 20px; height: 100vh; background-color: var(--bg-color-darkest) !important; color: var(--text-color-light) !important; padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px); width: 100%; overflow: hidden !important; }
        body, a:hover, .cl-chat-hide, .cl-small-bl li:not(.disabled), #clAuthForm input[type=submit], .cl-chat-button { cursor: pointer !important; }
        ::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
        ::-webkit-scrollbar-track { background: var(--scrollbar-track) !important; border-radius: 10px !important; }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb) !important; border-radius: 10px !important; border: 2px solid var(--scrollbar-track) !important; }
        ::-webkit-scrollbar-thumb:hover { background: var(--accent-color) !important; }.scroll-table { margin: 2px 0; border-radius: 8px !important; overflow: hidden !important; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4) !important; }
        .scroll-table::-webkit-scrollbar-track { background: var(--bg-color-dark) !important; }
        .scroll-table table { margin: 2px auto; border-collapse: collapse !important; background: var(--bg-color-dark) !important; color: var(--text-color-light) !important; }
        .scroll-table tr { padding: 5px; transition: background var(--transition-speed) !important; }
        .scroll-table tr:nth-child(even) { background-color: var(--bg-color-medium) !important; }
        .scroll-table tr:hover { background-color: var(--accent-color) !important; color: white !important; }
        .scroll-table th { padding: 5px 0; background-color: rgba(229, 76, 0, var(--accent-alpha)) !important; color: white !important; text-transform: uppercase !important; font-weight: bold !important; letter-spacing: 0.5px !important; border: none !important; }
        .scroll-table td { padding: 5px; border: 1px solid var(--border-color) !important; text-align: center !important; }

        #cl_top { position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 1 !important; color: var(--text-color-light) !important; font-size: 16px !important; text-shadow: 0 0 5px rgba(0, 0, 0, 0.5) !important; }

        #clInteractPage { position: fixed; top: 0; left: 0; padding: 5px; z-index: 1 !important; overflow: hidden !important; transition: width 250ms ease-out, height 250ms ease-out, opacity 250ms ease-out !important; border-radius: 15px !important; background-color: rgba(15, 15, 15, var(--main-alpha)) !important; backdrop-filter: blur(8px) brightness(0.7) !important; -webkit-backdrop-filter: blur(8px) brightness(0.7) !important; box-shadow: 0 0 20px rgba(0, 0, 0, 0.7) !important; }
        #clInteractPage:not(.full) { width: 50%; height: 100%; }
        @media screen and (max-width: 700px) { #clInteractPage { top: auto; bottom: 0; } #clInteractPage:not(.full) { width: 100%; height: 50%; } }
        .full { height: 100%; width: 100%; }

        #iframeNews, .cl-new-chat, .cl-new-chat textarea { border-radius: 10px !important; box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3) !important; }

        .cl-text-chat { position: relative; padding: 5px 5px 0 5px; }
        .cl-new-chat { background: rgba(26, 26, 26, var(--main-alpha)) !important; width: 100%; height: 100%; overflow: hidden !important; position: relative; color: var(--text-color-light) !important; border: 1px solid var(--border-color) !important; box-shadow: 0 0 15px rgba(0, 0, 0, 0.6) !important; }
        .cl-new-chat span { font-variant: small-caps !important; font-size: 12px; color: var(--text-color-light) !important; }

        .cl-top-chat { background: linear-gradient(to right, rgba(15, 15, 15, var(--main-alpha)), rgba(42, 42, 42, var(--main-alpha))) !important; width: 100%; height: 40px; padding-right: 80px; overflow: hidden !important; white-space: nowrap !important; text-align: center !important; overflow-x: auto !important; font-variant: small-caps !important; border-bottom: 1px solid var(--border-color) !important; box-shadow: inset 0 -2px 5px rgba(0, 0, 0, 0.2) !important; }
        .cl-top-chat li { display: inline-block !important; line-height: 40px; padding: 0 8px; margin: 0; font-size: 16px !important; font-weight: 300 !important; color: var(--text-color-light) !important; transition: background var(--transition-speed), color var(--transition-speed), transform var(--transition-speed) !important; }
        .cl-top-chat li.disabled { background: rgba(229, 76, 0, var(--accent-alpha)) !important; color: white !important; font-weight: bold !important; cursor: default !important; box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4) !important; }
        .cl-top-chat li:not(.disabled):hover { color: var(--accent-hover-color) !important; background-color: rgba(229, 76, 0, 0.1) !important; transform: translateY(-2px) !important; }.cl-btn-chat { width: 40px; height: 40px; position: absolute; top: 0; right: 0; background-color: rgba(15, 15, 15, var(--main-alpha)) !important; border-left: 1px solid var(--border-color) !important; transition: background-color var(--transition-speed) !important; }
        .cl-btn-chat:hover { background-color: var(--accent-color) !important; }

        .cl-content-chat { width: 100%; height: 100%; overflow-y: auto !important; padding: 0 5px 120px 5px; scrollbar-width: thin !important; scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track) !important; background-color: rgba(26, 26, 26, var(--main-alpha)) !important; border-radius: 0 0 10px 10px !important; }
        .cl-content-chat.load { filter: blur(3px) brightness(0.6) !important; pointer-events: none !important; }
        .cl-load-bar { position: absolute; top: 50%; left: 50%; width: 25px; height: 25px; transform: translateX(-50%) translateY(45px); z-index: 20 !important; }
        .cl-load-bar img { width: 30px; height: 30px; animation: cl-load 700ms cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite !important; filter: drop-shadow(0 0 5px var(--accent-color)) !important; }
        @keyframes cl-load { 0% { transform: rotateZ(0deg) !important; } 100% { transform: rotateZ(360deg) !important; } }

        .cl-text-chat textarea { background: rgba(26, 26, 26, var(--main-alpha)) !important; color: var(--text-color-light) !important; width: 100%; margin: 0; padding: 10px; font-size: 16px !important; resize: vertical !important; max-height: 200px; min-height: 50px; outline: none !important; border: 1px solid var(--border-color) !important; border-radius: 10px !important; box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.5) !important; transition: border-color var(--transition-speed), box-shadow var(--transition-speed) !important; }
        .cl-text-chat textarea:focus { border-color: var(--accent-hover-color) !important; box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.7), 0 0 0 3px rgba(229, 76, 0, 0.3) !important; }
        .cl-text-chat textarea::placeholder { color: #777777 !important; opacity: 0.8 !important; }
        .cl-text-chat span { padding: 0 5px; color: var(--text-color-light) !important; }

        .cl-chat-ava { position: absolute; top: 10px; left: 5px; width: 40px; height: 40px; border-radius: 50% !important; border: 2px solid var(--accent-color) !important; box-shadow: 0 0 8px rgba(229, 76, 0, 0.5) !important; overflow: hidden !important; }
        .cl-chat-ava img { width: 100%; height: 100%; border-radius: 50% !important; object-fit: cover !important; }
        #loadNews { position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%); z-index: 5 !important; }
        #iframeNews { width: 100%; height: 100%; border: 3px solid var(--accent-color) !important; border-radius: 12px !important; background-color: rgba(26, 26, 26, var(--main-alpha)) !important; box-shadow: 0 0 15px rgba(0, 0, 0, 0.6) !important; }
        #clChatContent { word-break: break-word !important; color: var(--text-color-light) !important; line-height: 1.6 !important; }
        .cl-page-container { overflow-y: auto !important; scroll-behavior: smooth !important; width: 100%; height: 100%; scrollbar-width: thin !important; scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track) !important; }
        .cl-emote { display: inline-block !important; max-width: 32px; max-height: 32px; vertical-align: middle !important; margin: 0 2px !important; filter: drop-shadow(0 0 2px rgba(229, 76, 0, 0.5)) !important; border-radius: 4px !important; }.cl-chat { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background: rgba(15, 15, 15, 0) !important; /* <--- ИЗМЕНЕНИЕ ЗДЕСЬ */ z-index: 1000 !important; font-family: var(--font-family-base) !important; color: var(--text-color-light) !important; animation: cl-chat-open 300ms cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards !important; backdrop-filter: blur(10px) brightness(0.7) !important; -webkit-backdrop-filter: blur(10px) brightness(0.7) !important; box-shadow: 0 0 40px rgba(0, 0, 0, 0.9) !important; }
        @keyframes cl-chat-open { 0% { opacity: 0 !important; transform: translateY(20px) !important; } 100% { opacity: 1 !important; transform: translateY(0) !important; } }
        .cl-chat-header { background: linear-gradient(to right, rgba(229, 76, 0, var(--accent-alpha)), rgba(255, 106, 0, var(--accent-alpha))) !important; height: 46px; text-align: center !important; font-weight: bold !important; font-size: 18px; padding: 14px; border-bottom: 2px solid var(--border-color) !important; position: absolute; top: 0; left: 0; width: 100%; z-index: 3 !important; font-variant: small-caps !important; color: white !important; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4) !important; display: flex !important; align-items: center !important; justify-content: center !important; }
        #clChatForm { padding: 5px; position: absolute; top: 0; left: 0; width: 100%; z-index: 3 !important; background-color: rgba(26, 26, 26, var(--main-alpha)) !important; border-top: 1px solid var(--border-color) !important; box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5) !important; }
        .cl-chat-text { padding: 10px 5px; color: var(--text-color-light) !important; border-radius: 8px !important; margin: 8px 0 !important; background-color: rgba(26, 26, 26, var(--main-alpha)) !important; transition: background-color 0.1s ease !important; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important; }
        .cl-chat-text:not(:first-child) { border-top: 1px solid rgba(255, 255, 255, 0.08) !important; }
        .cl-chat-text:not(:last-child) { border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important; }
        .cl-chat-text:hover { background-color: rgba(255, 255, 255, 0.1) !important; }.cl-chat-hide { height: 46px; padding: 10px; position: absolute; top: 0; left: 0; z-index: 4 !important; background-color: rgba(15, 15, 15, var(--main-alpha)) !important; color: var(--accent-hover-color) !important; font-size: 24px !important; border-radius: 50% !important; display: flex !important; justify-content: center !important; align-items: center !important; transition: background-color var(--transition-speed), transform var(--transition-speed), color var(--transition-speed) !important; box-shadow: 0 0 8px rgba(0, 0, 0, 0.4) !important; }
        .cl-chat-hide:hover { background-color: var(--accent-color) !important; transform: scale(1.05) !important; color: white !important; }
        #clChatInput { border: 1px solid var(--border-color) !important; background: rgba(15, 15, 15, var(--main-alpha)) !important; outline: none !important; color: var(--text-color-light) !important; width: 100%; font-size: 16px !important; height: 36px; line-height: 16px; padding: 10px 82px 10px 36px; overflow: hidden !important; resize: none !important; border-radius: 8px !important; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3) !important; transition: border-color var(--transition-speed), box-shadow var(--transition-speed) !important; }
        #clChatInput:focus { border-color: var(--accent-hover-color) !important; box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(229, 76, 0, 0.3) !important; }
        .cl-chat-button { width: 36px; height: 36px; padding: 5px; position: absolute; top: 5px; border: none !important; right: 5px; background-color: rgba(229, 76, 0, var(--accent-alpha)) !important; color: white !important; border-radius: 8px !important; display: flex !important; justify-content: center !important; align-items: center !important; transition: background-color var(--transition-speed), transform var(--transition-speed), opacity var(--transition-speed) !important; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4) !important; }
        .cl-chat-button:hover { background-color: var(--accent-hover-color) !important; transform: scale(1.05) !important; }
        .cl-chat-button-2 { right: 41px; opacity: 0.7 !important; }
        .cl-chat-button-2:hover { opacity: 1 !important; }
        .cl-chat-button-3 { left: 5px; }

        .cl-chat-content { position: absolute; top: 0; left: 0; overflow-y: scroll !important; scroll-behavior: smooth !important; height: 100%; width: 100%; padding: 45px 5px 5px 5px; z-index: 2 !important; font-size: 14px !important; -webkit-user-select: text !important; user-select: text !important; background-color: rgba(26, 26, 26, var(--main-alpha)) !important; }
        .cl-chat-content::-webkit-scrollbar-track { margin-top: 46px; }

        .cl-info-content { position: absolute; top: 0; left: 0; overflow-y: scroll !important; scroll-behavior: smooth !important; height: 100%; width: 100%; padding: 51px 5px 5px 5px; z-index: 2 !important; font-size: 14px !important; color: var(--text-color-light) !important; text-align: center !important; background-color: rgba(26, 26, 26, var(--main-alpha)) !important; scrollbar-width: thin !important; scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track) !important; }
        .cl-info-content::-webkit-scrollbar-track { margin-top: 46px; }
        .cl-info-content.dark { background: rgba(26, 26, 26, var(--main-alpha)) !important; background-size: cover !important; background-attachment: fixed !important; }.cl-bl { background: rgba(42, 42, 42, var(--main-alpha)) !important; width: 100%; max-width: 600px; margin: 0 auto 10px auto; text-align: center !important; overflow: hidden !important; border-radius: 12px !important; padding: 10px; border-bottom: 3px solid var(--accent-color) !important; position: relative; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5) !important; color: var(--text-color-light) !important; transition: transform var(--transition-speed), box-shadow var(--transition-speed) !important; }
        .cl-bl:hover { transform: translateY(-3px) !important; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6) !important; }
        .cl-bl.spoiler:not(.active) { max-height: 100px; transition: max-height 500ms ease-in-out !important; overflow: hidden !important; }
        .cl-bl.spoiler:not(.active):hover { max-height: 110px; }
        .cl-bl.spoiler:not(.active)::after { display: block !important; position: absolute !important; content: 'Раскрыть заметку' !important; line-height: 70px !important; text-align: center !important; height: 70px; width: 100%; bottom: 0; left: 0; color: var(--text-color-light) !important; background: linear-gradient(to top, rgba(15, 15, 15, var(--main-alpha)), transparent) !important; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7) !important; cursor: pointer !important; font-weight: bold !important; }
        .cl-text { text-align: justify !important; user-select: text !important; word-break: break-word !important; color: var(--text-color-light) !important; line-height: 1.6 !important; }

        .cl-text blockquote { padding: 5px 10px; border-radius: 8px !important; background: rgba(42, 42, 42, var(--main-alpha)) !important; border: 1px solid var(--border-color) !important; border-top-width: 2px !important; border-top-color: var(--accent-color) !important; box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3) !important; color: var(--text-color-light) !important; margin: 5px 0 !important; }
        .cl-text ul, .cl-text ol { padding: 0 5px; color: var(--text-color-light) !important; list-style-position: inside !important; margin-left: 10px !important; }
        .cl-text ul li::marker, .cl-text ol li::marker { color: var(--accent-color) !important; }

        .cl-small-bl { background: rgba(26, 26, 26, var(--main-alpha)) !important; font-size: 16px !important; border-radius: 10px !important; margin: 5px auto 5px auto; overflow: hidden !important; display: inline-block !important; font-weight: bold !important; padding: 0 5px 0 5px; font-variant: small-caps !important; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3) !important; border: 1px solid var(--border-color) !important; transition: background var(--transition-speed), box-shadow var(--transition-speed), transform var(--transition-speed) !important; }
        .cl-small-bl:hover { background: rgba(42, 42, 42, var(--main-alpha)) !important; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4) !important; transform: translateY(-2px) !important; }
        .cl-small-bl li { display: inline-block !important; list-style: none !important; margin: 0; padding: 5px; color: #777777 !important; transition: color var(--transition-speed) !important; }
        .cl-small-bl li:not(.disabled) { color: var(--text-color-light) !important; }
        .cl-small-bl li:not(.disabled):hover { color: var(--accent-hover-color) !important; }

        .sf { font-size: 12px; }
        h3 { padding: 10px; color: var(--text-color-light) !important; font-size: 14px; font-variant: small-caps !important; background-color: rgba(26, 26, 26, var(--main-alpha)) !important; border-bottom: 1px solid var(--border-color) !important; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important; border-radius: 8px 8px 0 0 !important; }.cl-li-dark { padding: 5px; border: 1px solid var(--border-color) !important; background: rgba(26, 26, 26, var(--main-alpha)) !important; margin: 5px 0 5px 0; line-height: 36px; text-align: left !important; width: 100%; height: 46px; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; color: var(--text-color-light) !important; border-radius: 8px !important; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3) !important; transition: opacity 250ms, background-color 250ms, transform 250ms !important; }
        .cl-li-dark:first-child { margin-top: 0; }
        .cl-li-dark.disabled { opacity: 0.5 !important; pointer-events: none !important; background-color: rgba(42, 42, 42, var(--main-alpha)) !important; }
        .cl-li-dark:hover { opacity: 1 !important; background-color: rgba(229, 76, 0, 0.25) !important; transform: translateX(5px) !important; }

        .cl-li-menu-icon { height: 16px; vertical-align: middle !important; position: absolute; top: 0; right: 0; width: 46px; height: 46px; background-color: transparent !important; transition: background-color var(--transition-speed) !important; display: flex !important; justify-content: center !important; align-items: center !important; }
        .cl-li-menu-icon:hover { background: rgba(229, 76, 0, 0.25) !important; border-radius: 50% !important; }

        @media only screen and (max-width: 500px) { .cl-table-entities td { display: block; width: 100%; } }

        .cl-task { padding-bottom: 10px; position: relative; padding-left: 26px; color: var(--text-color-light) !important; transition: color var(--transition-speed) !important; }
        .cl-task.grey { text-decoration: line-through !important; color: #777777 !important; }
        .cl-task.stat { padding-left: 58px; }
        .cl-task:last-child { padding-bottom: 0; }
        .cl-task:first-child:not(.grey) { color: var(--accent-hover-color) !important; font-style: italic !important; }
        .cl-li-icon { height: 16px; position: absolute; left: 0; top: 2px; filter: drop-shadow(0 0 3px rgba(229, 76, 0, 0.7)) !important; }
        .cl-li-icon.icon-2x { height: 48px; }

        .cl-progress { position: relative; height: 12px; margin-bottom: 12px; width: 100%; background-color: rgba(51, 51, 51, var(--main-alpha)) !important; border-radius: 15px !important; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3) !important; overflow: hidden !important; }
        .cl-progress-color { position: absolute; background: linear-gradient(to right, rgba(229, 76, 0, var(--accent-alpha)), rgba(255, 106, 0, var(--accent-alpha))) !important; width: 100%; min-width: 30px; height: 12px; border-radius: 15px !important; top: 0px !important; left: 0 !important; box-shadow: 0 0 8px rgba(229, 76, 0, 0.7) !important; transition: width 0.5s ease-out !important; }
        .cl-progress-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) !important; color: white !important; font-weight: bold !important; font-size: 12px; white-space: nowrap !important; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7) !important; z-index: 1 !important; }
        @keyframes progress { 0% { width: 0%; } }
        @keyframes task { 0% { transform: scaleY(0); } }

        .cl-m-button { width: 48px; height: 48px; margin: 5px; display: inline-block !important; background-color: rgba(26, 26, 26, var(--main-alpha)) !important; border-radius: 10px !important; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4) !important; transition: transform var(--transition-speed), box-shadow var(--transition-speed), background-color var(--transition-speed) !important; border: 1px solid var(--border-color) !important; display: flex !important; justify-content: center !important; align-items: center !important; }
        .cl-m-button:hover { transform: translateY(-2px) !important; box-shadow: 0 5px 12px rgba(0, 0, 0, 0.5) !important; background-color: var(--accent-color) !important; }.cl-bl-button, .cl-bl-button-2 { width: 36px; height: 36px; position: absolute; top: 2px; background-color: rgba(229, 76, 0, var(--accent-alpha)) !important; color: white !important; border-radius: 50% !important; display: flex !important; justify-content: center !important; align-items: center !important; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4) !important; transition: background-color var(--transition-speed), transform var(--transition-speed), box-shadow var(--transition-speed) !important; }
        .cl-bl-button:hover, .cl-bl-button-2:hover { background-color: var(--accent-hover-color) !important; transform: scale(1.1) !important; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6) !important; }
        .cl-bl-button { right: 2px; }
        .cl-bl-button-2 { right: 38px; }
        .cl-bl-min { display: inline-block; max-width: 300px; width: 50%; margin: 0; }

        label { display: block; font-size: 14px; margin: 20px 0 5px 0; font-weight: bold !important; color: var(--text-color-light) !important; }

        .cl_custom { max-width: 240px; display: block !important; appearance: none !important; -webkit-appearance: none !important; margin: 10px auto; border-radius: 9px !important; width: 100%; outline: none !important; cursor: inherit !important; background-color: transparent !important; }
        .cl_custom::-webkit-slider-runnable-track { height: 18px; border-radius: 9px !important; background: rgba(42, 42, 42, var(--main-alpha)) !important; border: 2px solid var(--border-color) !important; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4) !important; }
        .cl_custom::-webkit-slider-thumb { background: var(--accent-color) !important; border: 1px solid var(--accent-hover-color) !important; width: 28px; height: 14px; border-radius: 7px !important; -webkit-appearance: none !important; margin-top: calc(9px - 14px/2) !important; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4), 0 0 5px rgba(229, 76, 0, 0.7) !important; transition: background 250ms, box-shadow 250ms, transform 250ms !important; }
        .cl_custom::-webkit-slider-thumb:hover { transform: scale(1.1) !important; background: var(--accent-hover-color) !important; }
        .cl_custom[value="0"]::-webkit-slider-thumb { background: #777777 !important; border-color: #555555 !important; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4) !important; }

        .cl_color, .cl_custom { display: block !important; appearance: none !important; -webkit-appearance: none !important; margin: 10px auto; border-radius: 12px !important; width: 100%; outline: none !important; cursor: inherit !important; }
        .cl_color { max-width: 600px; }
        .cl_color::-webkit-slider-runnable-track { height: 24px; border-radius: 12px !important; border: 2px solid var(--border-color) !important; background: linear-gradient(to right, rgba(229, 76, 0, 0.8), rgba(255, 106, 0, 0.8), rgba(255, 193, 7, 0.8), rgba(40, 167, 69, 0.8), rgba(23, 162, 184, 0.8), rgba(0, 123, 255, 0.8), rgba(111, 66, 193, 0.8)) !important; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4) !important; }
        .cl_color::-webkit-slider-thumb { background: var(--text-color-light) !important; border: 1px solid var(--border-color) !important; width: 20px; height: 20px; border-radius: 10px !important; -webkit-appearance: none !important; margin-top: calc(12px - 20px/2) !important; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4), 0 0 5px rgba(255, 255, 255, 0.7) !important; transition: transform 250ms, box-shadow 250ms !important; }
        .cl_color::-webkit-slider-thumb:hover { transform: scale(1.2) !important; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6), 0 0 8px rgba(255, 255, 255, 0.9) !important; }

        .center { text-align: center !important; }
        canvas { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: transparent !important; z-index: 0 !important; }
    `;styleElement.innerHTML = css;
    console.log('Мод CSS успешно обновлен, фон .cl-chat теперь полностью прозрачный!');
    console.log('Все элементы должны соответствовать темной, минималистичной теме, сохраняя оригинальный лейаут.');
    console.log('Если мод все еще не работает или вызывает баги, возможно, игра использует сложные теневые DOM-структуры или iframe, что усложняет прямое стилизация.');
})();