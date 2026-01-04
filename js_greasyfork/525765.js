// ==UserScript==
// @name         mczwlt_fast_emoji_plugin
// @namespace    https://forum.mczwlt.net/
// @version      2025-02-01
// @description  love
// @author       Aurora_creeper
// @match        https://forum.mczwlt.net/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525765/mczwlt_fast_emoji_plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/525765/mczwlt_fast_emoji_plugin.meta.js
// ==/UserScript==

const DATA = {
    default: {
        icon: '',
        urls: [
            'https://attachment.mczwlt.net/mczwlt/public/user/2025/01/31/_NhmDq_mGPM2UycACZ447.png',
        ],
    },
};

function css(arg) {
    GM_addStyle(arg);
}

function html(arg) {
    return arg;
}

(function () {
    'use strict';

    css`
        .fast_emoji {
            z-index: 6000;
            user-select: none;
            position: fixed;
            left: 0.9rem;
            bottom: 5rem;
            display: flex;
            align-items: flex-end;
        }

        .fast_emoji_button {
            z-index: 5200;
            height: 3.25rem;
            width: 3.25rem;
            border-radius: 100rem;
            background: royalblue;
            display: inline-block;
            position: relative;
        }

        .fast_emoji_button > p {
            line-height: 2.5rem;
            font-size: 3.25rem;
            color: white;
            text-align: center;
            cursor: pointer;
        }

        .fast_emoji .fast_emoji_box {
            display: none;
        }

        .fast_emoji.active .fast_emoji_box {
            display: inline-block;
        }

        .fast_emoji_box {
            z-index: 5100;
            width: 32.5rem;
            height: 18.5rem;
            background-color: white;
            border-radius: 0.25rem;
            box-shadow: 0.1rem 0.1rem 0.25rem #eee, -0.1rem -0.1rem 0.25rem #eee;
            position: relative;
        }
    `;

    const fastEmoji = document.createElement('div');
    fastEmoji.classList.add('fast_emoji');

    // solve button icon
    const button_icon = document.createElement('p');
    button_icon.classList.add('fast_emoji_button_icon');
    button_icon.innerHTML = '+';

    // solve button
    const button = document.createElement('div');
    button.classList.add(`fast_emoji_button`);

    button.appendChild(button_icon);

    function activeToggle() {
        fastEmoji.classList.toggle('active');

        const inter = fastEmoji.classList.contains('active') ? '-' : '+';
        button_icon.innerHTML = inter;
    }

    button_icon.addEventListener('click', activeToggle);

    fastEmoji.appendChild(button);

    // solve box
    const box = document.createElement('p');
    box.classList.add('fast_emoji_box');
    fastEmoji.appendChild(box);

    // solve inner items
    // sorry for suck class name
    css`
        .fast_emoji_subBox {
            margin-left: 22px;
        }

        .fast_emoji_title {
            line-height: 40px;
            font-size: 1rem;
            margin: 0;
        }

        .fast_emoji_emojiBox {
            width: 500px;
            height: 265px;
            height: 200px;
            overflow: auto;
        }

        .fast_emoji_aEmoji {
            cursor: default;
            display: inline-block;
            width: 65px;
            height: 65px;
            padding: 5px;
            margin-right: -2px;
            margin-bottom: -2px;
            border: 2px solid #ededee;
            transition: color 0.1s cubic-bezier(0.2, 0.8, 0.1, 0.8);
            background-size: contain;
            background-repeat: no-repeat;
            background-origin: content-box;
            background-position: center;
        }

        .fast_emoji_aEmoji[style]:hover {
            width: 65px;
            height: 65px;
            padding: 2.5px;
            background-color: #f3f3f4;
        }
    `;

    let activeTextarea = null;
    document.addEventListener(
        'focus',
        (event) => {
            if (event.target.tagName === 'TEXTAREA') {
                activeTextarea = event.target;
            }
        },
        true
    );

    const subBox = document.createElement('div');
    subBox.classList.add('fast_emoji_subBox');
    box.appendChild(subBox);

    const title = document.createElement('p');
    title.classList.add('fast_emoji_title');
    title.innerText = 'Emoji';
    subBox.appendChild(title);

    const emojiBox = document.createElement('div');
    emojiBox.classList.add('fast_emoji_emojiBox');
    subBox.appendChild(emojiBox);

    function leftClickCallback(event) {
        event.preventDefault();
        if (!activeTextarea) return;

        const target = event.target;
        const cursorPosition = activeTextarea.selectionStart;
        const currentValue = activeTextarea.value;

        console.log(target.style.backgroundImage);

        const match = target.style.backgroundImage.match(
            /url\(["']?(.*?)["']?\)/
        );
        if (!match) return;

        const textToInsert = `![](${match[1]})`;
        const newValue =
            currentValue.slice(0, cursorPosition) +
            textToInsert +
            currentValue.slice(cursorPosition);

        activeTextarea.value = newValue;
        activeTextarea.selectionStart = activeTextarea.selectionEnd =
            cursorPosition + textToInsert.length;

        activeTextarea.focus();
        activeToggle();
    }

    let mxEmoji = 60;
    for (const name in DATA) {
        const slot = DATA[name];
        if (slot?.urls?.length instanceof Number)
            mxEmoji = Math.max(mxEmoji, slot.urls.length);
    }

    for (let index = 0; index < mxEmoji; index++) {
        // const itemWarpper = document.createElement('div');
        const item = document.createElement('div');
        item.classList.add('fast_emoji_aEmoji');
        item.style.backgroundImage = `url(${DATA.default.urls[index]})`;
        item.addEventListener('click', leftClickCallback);
        // itemWarpper.appendChild(item);
        emojiBox.appendChild(item);
    }

    // APPEND
    document.body.appendChild(fastEmoji);

    // post effect
})();
