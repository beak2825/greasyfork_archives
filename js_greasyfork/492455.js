// ==UserScript==
// @name         Notion Apple Emojis
// @version      1.2
// @description  Replace Notion's Twemojis with Telegram's Apple (iOS) Emojis
// @author       bernzrdo
// @match        https://*.notion.so/*
// @match        https://*.notion.site/*
// @icon         https://i.imgur.com/7lsfUJ8.png
// @license      MIT
// @namespace https://greasyfork.org/users/1207477
// @downloadURL https://update.greasyfork.org/scripts/492455/Notion%20Apple%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/492455/Notion%20Apple%20Emojis.meta.js
// ==/UserScript==

function emojiURL(emoji){
    if(!emoji) return;

    if(emoji == '♀️') return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Female_Sign_Emoji_%28Unofficial_Apple_Emoji%29.svg/64px-Female_Sign_Emoji_%28Unofficial_Apple_Emoji%29.svg.png';
    if(emoji == '♂️') return 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Male_Sign_Emoji_%28Unofficial_Apple_Emoji%29.svg/64px-Male_Sign_Emoji_%28Unofficial_Apple_Emoji%29.svg.png';

    let codes = [];

    for(let i = 0; i < emoji.length; i++){

        let code = emoji.charCodeAt(i);
        if(code == 0xfe0f) continue;

        if(code >= 0xd800 && code <= 0xdbff){

            let nextCode = emoji.charCodeAt(i + 1);

            if(nextCode >= 0xdc00 && nextCode <= 0xdfff){
                codes.push(
                    (code - 0xd800) * 0x400 +
                    (nextCode - 0xdc00) + 0x10000
                );
            }

        }else if(code < 0xd800 || code > 0xdfff){
            codes.push(code);
        }

    }

    codes = codes.map(c=>c.toString(16).padStart(4, '0'));

    return `https://web.telegram.org/k/assets/img/emoji/${codes.join('-')}.png`;

}

document.body.innerHTML += `<style>

.notion-emoji {
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
	opacity: 1 !important;
    transform: scale(1.2);
}

</style>`;

(function update(){

    // remove big emojis
    for(let $emoji of document.querySelectorAll('[src^="https://notion-emojis"]')){
        $emoji.remove();
    }

    for(let $emoji of document.querySelectorAll('.notion-emoji')){
        let [emoji] = $emoji.alt.split(/\s+/);
        $emoji.style.background = `url('${emojiURL(emoji)}')`;
    }

    requestAnimationFrame(update);
})();