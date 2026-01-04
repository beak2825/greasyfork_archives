// ==UserScript==
// @name         iOS emoji
// @namespace    
// @version      0.4
// @description  用自定義圖像取代網頁上的emoji圖示。
// @author       不能外流
// @match     *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494292/iOS%20emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/494292/iOS%20emoji.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the emojis you want to replace and their corresponding image URLs
    const emojiMap = {
"😀":"https://em-content.zobj.net/thumbs/60/apple/391/grinning-face_1f600.webp",
"😃":"https://em-content.zobj.net/thumbs/60/apple/391/grinning-face-with-big-eyes_1f603.webp",
"😄":"https://em-content.zobj.net/thumbs/60/apple/391/grinning-face-with-smiling-eyes_1f604.webp",
"😅":"https://em-content.zobj.net/thumbs/60/apple/391/grinning-face-with-sweat_1f605.webp",
"😆":"https://em-content.zobj.net/thumbs/60/apple/391/grinning-squinting-face_1f606.webp",
"🤪":"https://em-content.zobj.net/thumbs/60/apple/391/zany-face_1f92a.webp",
"🤐":"https://em-content.zobj.net/thumbs/60/apple/391/zipper-mouth-face_1f910.webp",
        "😗":"https://em-content.zobj.net/thumbs/60/apple/391/kissing-face_1f617.webp",
"😚":"https://em-content.zobj.net/thumbs/60/apple/391/kissing-face-with-closed-eyes_1f61a.webp",
"😙":"https://em-content.zobj.net/thumbs/60/apple/391/kissing-face-with-smiling-eyes_1f619.webp",
"🙂‍↔️":"https://em-content.zobj.net/thumbs/60/apple/391/head-shaking-horizontally_1f642-200d-2194-fe0f.webp",
"🙂‍↕️":"https://em-content.zobj.net/thumbs/60/apple/391/head-shaking-vertically_1f642-200d-2195-fe0f.webp",
        "🫨":"https://em-content.zobj.net/thumbs/60/apple/391/shaking-face_1fae8.webp",
        "😁":"https://em-content.zobj.net/thumbs/60/apple/391/beaming-face-with-smiling-eyes_1f601.webp",
        "🤣":"https://em-content.zobj.net/thumbs/60/apple/391/rolling-on-the-floor-laughing_1f923.webp",
        "🤯":"https://em-content.zobj.net/thumbs/60/apple/391/exploding-head_1f92f.webp",
"😑":"https://em-content.zobj.net/thumbs/60/apple/391/expressionless-face_1f611.webp",
"👁️":"https://em-content.zobj.net/thumbs/60/apple/391/eye_1f441-fe0f.webp",
"👁️‍🗨️":"https://em-content.zobj.net/thumbs/60/apple/391/eye-in-speech-bubble_1f441-fe0f-200d-1f5e8-fe0f.webp",
"👀":"https://em-content.zobj.net/thumbs/60/apple/391/eyes_1f440.webp",
"😘":"https://em-content.zobj.net/thumbs/60/apple/391/face-blowing-a-kiss_1f618.webp",
"😮‍💨":"https://em-content.zobj.net/thumbs/60/apple/391/face-exhaling_1f62e-200d-1f4a8.webp",
"🥹":"https://em-content.zobj.net/thumbs/60/apple/391/face-holding-back-tears_1f979.webp",
"😶‍🌫️":"https://em-content.zobj.net/thumbs/60/apple/391/face-in-clouds_1f636-200d-1f32b-fe0f.webp",
"😋":"https://em-content.zobj.net/thumbs/60/apple/391/face-savoring-food_1f60b.webp",
"😱":"https://em-content.zobj.net/thumbs/60/apple/391/face-screaming-in-fear_1f631.webp",
"🤮":"https://em-content.zobj.net/thumbs/60/apple/391/face-vomiting_1f92e.webp",
"🫤":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-diagonal-mouth_1fae4.webp",
"🤭":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-hand-over-mouth_1f92d.webp",
"🤕":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-head-bandage_1f915.webp",
"😷":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-medical-mask_1f637.webp",
"🧐":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-monocle_1f9d0.webp",
"🫢":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-open-eyes-and-hand-over-mouth_1fae2.webp",
"😮":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-open-mouth_1f62e.webp",
"😶":"https://em-content.zobj.net/thumbs/60/apple/391/face-without-mouth_1f636.webp",
"🫣":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-peeking-eye_1fae3.webp",
"🤨":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-raised-eyebrow_1f928.webp",
"🙄":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-rolling-eyes_1f644.webp",
"😵‍💫":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-spiral-eyes_1f635-200d-1f4ab.webp",
"😤":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-steam-from-nose_1f624.webp",
"🤬":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-symbols-on-mouth_1f92c.webp",
"😂":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-tears-of-joy_1f602.webp",
"🤒":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-thermometer_1f912.webp",
"😛":"https://em-content.zobj.net/thumbs/60/apple/391/face-with-tongue_1f61b.webp",
        // Add more emoji-image pairs as needed
    };

    // Function to replace emojis with images
    function replaceEmojis() {
        const textNodes = document.evaluate("//text()[not(ancestor::textarea) and not(ancestor::input) and not(ancestor::select)]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < textNodes.snapshotLength; i++) {
            const node = textNodes.snapshotItem(i);
            for (const [emoji, imageUrl] of Object.entries(emojiMap)) {
                const regex = new RegExp(escapeRegExp(emoji), 'g');
                if (regex.test(node.textContent)) {
                    const span = document.createElement('span');
                    const altText = emoji; // Use the emoji as alt text

                    // 创建一个用于计算高度的临时span元素
                    const tempSpan = document.createElement('span');
                    tempSpan.textContent = emoji;
                    tempSpan.style.visibility = 'hidden';
                    tempSpan.style.position = 'absolute';
                    document.body.appendChild(tempSpan);
                    const height = tempSpan.offsetHeight;
                    document.body.removeChild(tempSpan);

                    span.innerHTML = node.textContent.replace(regex, `<img src="${imageUrl}" alt="${altText}" style="height: ${height}px;">`);
                    node.parentNode.replaceChild(span, node);
                }
            }
        }
    }

    // Function to escape special characters in regex
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    // Run the replacement function initially
    replaceEmojis();

    // Listen for changes in the DOM and run the replacement function again if needed
    const observer = new MutationObserver(mutationsList => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                replaceEmojis();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
