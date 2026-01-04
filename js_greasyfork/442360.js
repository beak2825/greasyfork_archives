// ==UserScript==
// @name         Discord - Use Emojis/Stickers
// @description  Use Emojis, Stickers as links.
// @author       AD
// @version      1.0.0
// @namespace    discord-emojis
// @license      GPL-3.0
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/442360/Discord%20-%20Use%20EmojisStickers.user.js
// @updateURL https://update.greasyfork.org/scripts/442360/Discord%20-%20Use%20EmojisStickers.meta.js
// ==/UserScript==

(function () {
    "use strict"
    // Select (1/0) to send immediately when clicked on the library + sizes.
    let send_emojis_immediately = 0;
    let size_emoji_left_click = 48;
    let size_emoji_right_click = 96;
    //[24, 48, 56, 96, 128, 160, 256, 512, 1024, 1280, 2048, 3072, 4096], '' means maximum.
    //Animated stickers will always be sent with maximum size.
    let size_emoji = 48;
    let size_gif_emoji = 96;
    let size_sticker_right_click = 256;
    let size_sticker_left_click = 160;
    
    let Discord = {window: typeof unsafeWindow !== "undefined" ? unsafeWindow : window,}, Utils = {
        Webpack: function () {
            if (this.cachedWebpack) return this.cachedWebpack;
            let webpackExports;
            if (Discord.window.webpackChunkdiscord_app != null) {
                const ids = ["__extra_id__"];
                Discord.window.webpackChunkdiscord_app.push([ids, {}, (req) => {
                    webpackExports = req;
                    ids.length = 0;
                },]);
            } else if (Discord.window.webpackJsonp != null) {
                webpackExports = typeof Discord.window.webpackJsonp === "function" ? Discord.window.webpackJsonp([], {
                    __extra_id__: (module, _export_, req) => {
                        _export_.default = req;
                    },
                }, ["__extra_id__"]).default : Discord.window.webpackJsonp.push([[], {
                    __extra_id__: (_module_, exports, req) => {
                        _module_.exports = req;
                    },
                }, [["__extra_id__"]],]);
            } else return null;
            const findModule = (filter) => {
                for (let i in webpackExports.c) {
                    if (webpackExports.c.hasOwnProperty(i)) {
                        let m = webpackExports.c[i].exports;
                        if (!m) continue;
                        if (m.__esModule && m.default) m = m.default;
                        if (filter(m)) return m;
                    }
                }
                return null;
            };
            const findModuleByUniqueProperties = (propNames) => findModule((module) => propNames.every((prop) => module[prop] !== undefined));
            return (this.cachedWebpack = {findModule, findModuleByUniqueProperties,});
        },
    };
    function send(message) {
        let iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        let token = iframe.contentWindow.localStorage.token.replace(/"/g, '');
        iframe.remove();
        let channel_id = document.location.pathname.split('/').pop();
        let data = {
            "content": message,
            "tts": "false"
        }
        if (document.querySelector('[class^="replyBar"]')) {
            let elem = document.querySelector('li > [class*="replying"]');
            if (elem) {
                data.message_reference = {
                    message_id: elem.parentNode.id.substring(14),
                    fail_if_not_exists: false
                }
            }
            document.querySelector('[class^="replyBar"] [class^="closeButton"]').click();
        }
        $.ajax({
            type: 'POST',
            url: 'https://discord.com/api/v6/channels/' + channel_id + '/messages',
            data: JSON.stringify(data),
            headers: {
                '%3Apath': '/api/v6/channels/' + channel_id + '/messages',
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
    }

    document.addEventListener('mousedown', function (e) {
        let right_click = (e.button === 2);

        if (e.target.classList.value.includes('emojiItem-') && (e.target.classList.value.includes('emojiItemDisabled') || right_click) && send_emojis_immediately === 1) {
            let img = e.target.querySelector('img');
            if (img !== null) {
                let link = new URL(img.src);
                link.search = '?' + (right_click ? 'size=' + size_emoji_right_click : `size=${size_emoji_left_click}`);
                send(link.href);
            }
        }
        if (e.target.classList.value.includes('stickerAsset-') && (e.target.parentNode.parentNode.classList.value.includes('stickerUnsendable') || right_click)) {
            let img = e.target;
            if (img !== null) {
                let link = new URL(img.src);
                link.search = '?' + (right_click ? 'size=' + size_sticker_right_click : `size=${size_sticker_left_click}`);
                send(link.href);
            }
        }

        if (Utils.Webpack() == null) return 0;
        const {findModuleByUniqueProperties} = Utils.Webpack();
        let emojisModule = findModuleByUniqueProperties(["getDisambiguatedEmojiContext", "searchWithoutFetchingLatest",]);
        let messageEmojiParserModule = findModuleByUniqueProperties(["parse", "parsePreprocessor", "unparse",]);
        let emojiPickerModule = findModuleByUniqueProperties(["useEmojiSelectHandler",]);
        if (emojisModule == null || messageEmojiParserModule == null || emojiPickerModule == null) return 0;

        function replaceEmoji(parseResult, emoji) {
            parseResult.content = parseResult.content.replace(`<${emoji.animated ? "a" : ""}:${emoji.originalName || emoji.name}:${emoji.id}>`, emoji.url.split("?")[0] + `?size=${emoji.animated ? size_gif_emoji : size_emoji}`);
        }

        const original_searchWithoutFetchingLatest = emojisModule.searchWithoutFetchingLatest;
        emojisModule.searchWithoutFetchingLatest = function () {
            let result = original_searchWithoutFetchingLatest.apply(this, arguments);
            result.unlocked.push(...result.locked);
            result.locked = [];
            return result;
        };

        if (send_emojis_immediately === 0) {
            const original_parse = messageEmojiParserModule.parse;
            messageEmojiParserModule.parse = function () {
                let result = original_parse.apply(this, arguments);
                if (result.invalidEmojis.length !== 0) {
                    for (let emoji of result.invalidEmojis) replaceEmoji(result, emoji);
                    result.invalidEmojis = [];
                }
                let validNonShortcutEmojis = result.validNonShortcutEmojis;

                for (let i = 0; i < validNonShortcutEmojis.length; i++) {
                    const emoji = validNonShortcutEmojis[i];
                    if (!emoji.available) {
                        replaceEmoji(result, emoji);
                        validNonShortcutEmojis.splice(i, 1);
                        i--;
                    }
                }
                return result;
            };

            const original_useEmojiSelectHandler = emojiPickerModule.useEmojiSelectHandler;
            emojiPickerModule.useEmojiSelectHandler = function (args) {
                const {onSelectEmoji} = args;
                const originalHandler = original_useEmojiSelectHandler.apply(this, arguments);
                return function (data, state) {
                    if (state.toggleFavorite) return originalHandler.apply(this, arguments);
                    const emoji = data.emoji;
                    if (emoji != null) onSelectEmoji(emoji, 1);
                };
            };
        }
    });
    GM_addStyle(
        `
            .theme-dark {
                --script-color: white;
            }
            ` +
        `.theme-dark [class*="emojiItemDisabled"] {\n` +
        `    filter: drop-shadow(0px 0px 1px white) !important;\n` +
        `}\n` +
        `.theme-light [class*="emojiItemDisabled"] {\n` +
        `    filter: drop-shadow(0px 0px 2px purple) !important;\n` +
        `}\n` +
        `.theme-dark [class*="stickerUnsendable"] {\n` +
        `    filter: drop-shadow(0px 0px 1px white) !important;\n` +
        `}\n` +
        `.theme-light [class*="stickerUnsendable"] {\n` +
        `    filter: drop-shadow(0px 0px 2px purple) !important;\n` +
        `}\n` +
        `[class*="premiumPromo-"], [class*="upsellWrapper-"] {\n` +
        `    display: none !important;\n` +
        `}\n`)
    ;

    return 1;
})();