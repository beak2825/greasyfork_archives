// ==UserScript==
// @name         MW emoji
// @namespace    http://tampermonkey.net/
// @version      2024-07-25
// @description  Add emojis to the game chat
// @author       Mangoflavor
// @match        https://www.milkywayidle.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501826/MW%20emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/501826/MW%20emoji.meta.js
// ==/UserScript==

(() => {
    let faces = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🌚", "🌝", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍",
                 "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
                 "🥳", "😏", "😒", "😔", "😞", "😕", "😟", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤",
                 "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭",
                 "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤",
                 "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹",
                 "👺", "🤡", "💩", "👻", "💀", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽",
                 "🙀", "😿", "😾", "🙈", "🙉", "🙊", "🧙",];

    let hands = ["🫶", "🤲", "👐", "🤝", "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "👌", "🤏", "👈", "👆",
                 "👉", "👇", "🖕", "✋", "🤚", "🖖", "👋", "🤙", "💅","💪", "🦾", "🦶", "🦿", "👄", "🦷",
                 "👅", "👂", "🦻", "👃", "👣", "👁", "👀", "🧠"];
    let symbols = ["🧡", "💔", "💓", "💕", "💖", "💗", "💘", "💝", "💞", "💙", "💚", "💛", "💜", "🖤", "🤍",
                   "🤎", "💋", "🎀", "🎁", "🎂", "🎄", "🎅", "🎈", "🎉", "🎊", "🎓", "💰", "💲", "💳", "💵",
                   "💸", "🔍", "🔨", "🔬", "🧲", "🔴", "🔵", "🔶", "🔷", "🔶", "💢", "💣", "💥", "💦", "💨",
                   "🔔", "🔥", "🧺", "📈", "📉", "📢", "📣", "🌟", "👑", "👒"];
    let animals = ["🐄", "🐃", "🐀", "🐁", "🐅", "🐆", "🐇", "🐈", "🐉", "🐊", "🐋", "🐳", "🐌", "🐍", "🐎",
                   "🐏", "🐒", "🐔", "🐕", "🐖", "🐘", "🐢", "🐣", "🐤", "🐥", "🐸", "🦄", "🦉", "🐫", "🐾",
                   "🐵", "🐶", "🐷", "🐯", "🐰", "🐱"];
    let e_btn = "";
    let emoji_panal = "";
    let chat_input = ""; // the chat input itself
    let chat_input_offsetParent = "";
    let chat_key = ""; //to hold a changing key
    // Start checking for the React app to be fully loaded
    const waitForReactApp = () => {
        const targetNode = document.querySelector("div.GamePage_mainPanel__2njyb");
        if (targetNode) {
            //set vars
            const chat_ = document.querySelector('.Chat_chatInputContainer__2euR8');
            e_btn = document.createElement('div');
            const e_btnInner = document.createElement('div');
            e_btnInner.setAttribute("class", "Button_button__1Fe9z Button_fullWidth__17pVU");
            e_btnInner.innerHTML = "😀";
            e_btn.appendChild(e_btnInner);
            chat_.appendChild(e_btn);
            chat_.style["align-items"] = "center";
            chat_input = document.querySelector('.Chat_chatInput__16dhX');
            chat_input_offsetParent = chat_input.offsetParent;
            let keysArray = Object.keys(chat_input);
            chat_key = keysArray[1];
            //create chate panal
            emoji_panal = document.createElement('div');
            emoji_panal.style["user-select"] = "none";
            emoji_panal.style.position = "absolute";
            emoji_panal.style.display = "none";
            emoji_panal.style["box-sizing"] = "border-box";
            emoji_panal.style["grid-template-columns"] = "repeat(10, auto)";
            emoji_panal.style["grid-auto-rows"] = "1fr";
            emoji_panal.style["grid-gap"] = "4px";
            emoji_panal.style.width = "fit-content";
            emoji_panal.style.height = "200px";
            emoji_panal.style["background-color"] = "#131419";
            emojisPanel_Position();
            emoji_panal.style.border = "1px solid #98a7e9";
            emoji_panal.style.padding = "6px";
            emoji_panal.style["overflow-x"] = "hidden";
            emoji_panal.style["overflow-y"] = "auto";
            emoji_panal.style["scrollbar-color"] = "#98a7e9 #20212f";
            emoji_panal.style["scrollbar-width"] = "thin";
            // Generate emojis (faces, symbols, etc.)
            generateEmojis(faces); // Emotions (Faces) range
            generateEmojis(hands); // Hands range
            generateEmojis(symbols); // Asymbols
            generateEmojis(animals); // Animals
            e_btn.addEventListener("click", function (evt) {
                if (emoji_panal.style.display === 'none' || emoji_panal.style.display === '') {
                    emoji_panal.style.display = 'grid';
                    emojisPanel_Position();
                } else {
                    emoji_panal.style.display = 'none';
                }
            });
            document.body.appendChild(emoji_panal);
        } else {
            setTimeout(waitForReactApp, 500);
        }
    };
    waitForReactApp();
    function generateEmojis(arr) {
        arr.forEach(function(elm) {
            var emojiSpan = document.createElement('div');
            emojiSpan.innerHTML = elm;
            emojiSpan.style.cursor = "pointer";
            emojiSpan.style["font-size"] = "1.25rem";
            emojiSpan.addEventListener('click', handle_emoji_click);
            emojiSpan.addEventListener('touch', handle_emoji_click);
            emoji_panal.appendChild(emojiSpan);
        });
    }
    window.addEventListener('resize', emojisPanel_Position);
    function emojisPanel_Position() {
        let rect_btn = e_btn.getBoundingClientRect();
        let rect_panel = emoji_panal.getBoundingClientRect();
        emoji_panal.style.top = rect_btn.top-206+"px";
        emoji_panal.style.left = rect_btn.left+rect_btn.width-rect_panel.width-16+"px";
    }
    function handle_emoji_click() {
        // Append the clicked emoji to the string
        chat_input.value += this.innerHTML;
        const event = new Event('input', {
            bubbles: true, // The event should bubble up through the DOM
            cancelable: true // The event can be canceled
        });
        // Dispatch the change event on the input element
        chat_input.dispatchEvent(event);
        chat_input_offsetParent[chat_key].children._owner.stateNode.handleChatInputChanged(event);
    }
})();