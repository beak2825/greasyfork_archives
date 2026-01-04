// ==UserScript==
// @name         Emoji Inserter
// @namespace    https://github.com/lheintzmann1
// @version      1.0
// @description  Inserts emojis in text fields and text areas using a simple syntax like :emoji_name:.
// @author       lheintzmann1
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540663/Emoji%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/540663/Emoji%20Inserter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const emojiMap = {
        'smile': '😊',
        'grin': '😁',
        'joy': '😂',
        'laughing': '😆',
        'wink': '😉',
        'blush': '😊',
        'heart_eyes': '😍',
        'kissing_heart': '😘',
        'smirk': '😏',
        'neutral_face': '😐',
        'expressionless': '😑',
        'unamused': '😒',
        'sweat_smile': '😅',
        'sweat': '😓',
        'disappointed_relieved': '😥',
        'weary': '😩',
        'pensive': '😔',
        'confused': '😕',
        'confounded': '😖',
        'kissing': '😗',
        'kissing_smiling_eyes': '😙',
        'kissing_closed_eyes': '😚',
        'stuck_out_tongue': '😛',
        'stuck_out_tongue_winking_eye': '😜',
        'stuck_out_tongue_closed_eyes': '😝',
        'disappointed': '😞',
        'worried': '😟',
        'angry': '😠',
        'rage': '😡',
        'cry': '😢',
        'persevere': '😣',
        'triumph': '😤',
        'frowning': '😦',
        'anguished': '😧',
        'fearful': '😨',
        'cold_sweat': '😰',
        'hushed': '😯',
        'flushed': '😳',
        'dizzy_face': '😵',
        'mask': '😷',
        'sunglasses': '😎',

        'thumbsup': '👍',
        'thumbsdown': '👎',
        'ok_hand': '👌',
        'punch': '👊',
        'fist': '✊',
        'v': '✌️',
        'wave': '👋',
        'hand': '✋',
        'raised_hand': '✋',
        'open_hands': '👐',
        'point_up': '☝️',
        'point_down': '👇',
        'point_left': '👈',
        'point_right': '👉',
        'raised_hands': '🙌',
        'pray': '🙏',
        'clap': '👏',
        'muscle': '💪',

        'heart': '❤️',
        'broken_heart': '💔',
        'two_hearts': '💕',
        'heartpulse': '💗',
        'heartbeat': '💓',
        'sparkling_heart': '💖',
        'cupid': '💘',
        'gift_heart': '💝',
        'heart_decoration': '💟',
        'purple_heart': '💜',
        'yellow_heart': '💛',
        'green_heart': '💚',
        'blue_heart': '💙',

        'dog': '🐶',
        'cat': '🐱',
        'mouse': '🐭',
        'hamster': '🐹',
        'rabbit': '🐰',
        'fox': '🦊',
        'bear': '🐻',
        'panda': '🐼',
        'tiger': '🐯',
        'lion': '🦁',
        'cow': '🐮',
        'pig': '🐷',
        'monkey': '🐵',
        'see_no_evil': '🙈',
        'hear_no_evil': '🙉',
        'speak_no_evil': '🙊',

        'apple': '🍎',
        'banana': '🍌',
        'grapes': '🍇',
        'strawberry': '🍓',
        'melon': '🍈',
        'watermelon': '🍉',
        'orange': '🍊',
        'lemon': '🍋',
        'peach': '🍑',
        'cherries': '🍒',
        'pineapple': '🍍',
        'tomato': '🍅',
        'eggplant': '🍆',
        'corn': '🌽',
        'pizza': '🍕',
        'hamburger': '🍔',
        'fries': '🍟',
        'hotdog': '🌭',
        'cake': '🍰',
        'cookie': '🍪',
        'chocolate_bar': '🍫',
        'candy': '🍬',
        'coffee': '☕',
        'beer': '🍺',
        'wine_glass': '🍷',

        'soccer': '⚽',
        'basketball': '🏀',
        'football': '🏈',
        'baseball': '⚾',
        'tennis': '🎾',
        'car': '🚗',
        'taxi': '🚕',
        'bus': '🚌',
        'fire': '🔥',
        'bomb': '💣',
        'gun': '🔫',
        'hocho': '🔪',
        'pill': '💊',
        'syringe': '💉',
        'key': '🔑',
        'lock': '🔒',
        'unlock': '🔓',
        'bell': '🔔',
        'bookmark': '🔖',
        'toilet': '🚽',
        'shower': '🚿',
        'bathtub': '🛁',
        'money_with_wings': '💸',
        'dollar': '💵',
        'yen': '💴',
        'euro': '💶',
        'pound': '💷',
        'gem': '💎',

        'checkmark': '✅',
        'x': '❌',
        'o': '⭕',
        'question': '❓',
        'exclamation': '❗',
        'heavy_plus_sign': '➕',
        'heavy_minus_sign': '➖',
        'heavy_division_sign': '➗',
        'heavy_multiplication_x': '✖️',
        'star': '⭐',
        'star2': '🌟',
        'dizzy': '💫',
        'boom': '💥',
        'fire': '🔥',
        'snowflake': '❄️',
        'zap': '⚡',
        'tornado': '🌪️',
        'ocean': '🌊',

        'sunny': '☀️',
        'partly_sunny': '⛅',
        'cloud': '☁️',
        'zap': '⚡',
        'umbrella': '☔',
        'snowman': '⛄',
        'moon': '🌙',
        'sun_with_face': '🌞',
        'new_moon_with_face': '🌚',
        'full_moon_with_face': '🌝',
        'crescent_moon': '🌙',
        'earth_africa': '🌍',
        'earth_americas': '🌎',
        'earth_asia': '🌏',
        'volcano': '🌋',
        'milky_way': '🌌',
        'partly_sunny': '⛅',
        'octocat': '🐙',
        'squirrel': '🐿️'
    };

    function replaceEmojis(text) {
        return text.replace(/:([a-zA-Z0-9_+-]+):/g, function(match, emojiName) {
            return emojiMap[emojiName] || match;
        });
    }

    function processTextNode(textNode) {
        const originalText = textNode.textContent;
        const newText = replaceEmojis(originalText);

        if (originalText !== newText) {
            textNode.textContent = newText;
        }
    }

    function processElement(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(processTextNode);
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    processTextNode(node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    processElement(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    processElement(document.body);

    document.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const originalValue = e.target.value;
            const newValue = replaceEmojis(originalValue);

            if (originalValue !== newValue) {
                e.target.value = newValue;

                const diff = newValue.length - originalValue.length;
                e.target.setSelectionRange(start + diff, end + diff);
            }
        }
    });

    document.addEventListener('input', function(e) {
        if (e.target.contentEditable === 'true') {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const container = range.commonAncestorContainer;

            if (container.nodeType === Node.TEXT_NODE) {
                processTextNode(container);
            }
        }
    });

    window.showAvailableEmojis = function() {
        const emojiList = Object.keys(emojiMap).map(name => `:${name}: ${emojiMap[name]}`).join('\n');
        console.log('Available emojis:\n' + emojiList);
    };

    console.log('Emoji Inserter script loaded. Emojis will be automatically replaced in text fields and text areas.');
    console.log('You can use the syntax :emoji_name: to insert emojis.');
    console.log('To see available emojis, call showAvailableEmojis() in the console.');

})();