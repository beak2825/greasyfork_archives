// ==UserScript==
// @name         Voxiom.io Copy Lyrics to Clipboard (Looping)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Copies lyrics of "Thick Of It" by KSI to clipboard when pressing '\'. You can manually paste it into the chat. The lyrics will loop once the last one is copied.
// @author       Joel Guerra
// @match        https://voxiom.io/*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/530311/Voxiomio%20Copy%20Lyrics%20to%20Clipboard%20%28Looping%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530311/Voxiomio%20Copy%20Lyrics%20to%20Clipboard%20%28Looping%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const lyrics = [
        "Im in the thick of it, everybody knows",
        "They know me where it snows, I skied in and they froze",
        "I dont know no nothin about no ice, Im just cold",
        "Forty somethin milli subs or so, Ive been told",
        "Im in my prime and this aint even final form",
        "They knocked me down, but still, my feet, they find the floor",
        "I went from living rooms straight out to sold-out tours",
        "Lifes a fight, but trust, Im ready for the war",
        "Woah-oh-oh",
        "This is how the story goes",
        "Woah-oh-oh",
        "I guess this is how the story goes",
        "Im in the thick of it, everybody knows X",
        "They know me where it snows, I skied in and they froze Y",
        "I dont know no nothin about no ice, Im just cold Z",
        "Forty somethin milli subs or so, Ive been told A",
        "From the screen to the ring, to the pen, to the king",
        "Wheres my crown? Thats my bling",
        "Always drama when I ring",
        "See, I believe that if I see it in my heart",
        "Smash through the ceiling cause Im reachin for the stars",
        "Woah-oh-oh",
        "This is how the story goes B",
        "Woah-oh-oh",
        "I guess this is how the story goes C",
        "Im in the thick of it, everybody knows D",
        "They know me where it snows, I skied in and they froze E",
        "I dont know no nothin about no ice, Im just cold F",
        "Forty somethin milli subs or so, Ive been told G",
        "Highway to heaven, Im just cruisin by my lone",
        "They cast me out, left me for dead, them people cold",
        "My faith in God, mind in the sun, Im bout to sow",
        "My life is hard, I took the wheel, I cracked the code",
        "Aint nobody gon save you, man, this life will break you",
        "In the thick of it, this is how the story goes",
        "Im in the thick of it, everybody knows H",
        "They know me where it snows, I skied in and they froze I",
        "I dont know no nothin about no ice, Im just cold J",
        "Forty somethin milli subs or so, Ive been told K",
        "Woah-oh-oh",
        "This is how the story goes L",
        "Woah-oh-oh",
        "I guess this is how the story goes M"
    ];

    let lyricIndex = 0;
    let lastToggleTime = 0;

    // Sub to Joel G
    function copyToClipboard(lyric) {
        const textarea = document.createElement("textarea");
        document.body.appendChild(textarea);
        textarea.value = lyric;
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        console.log(`Copied: ${lyric}`);
    }

    // Sub to Joel G
    document.addEventListener('keydown', (event) => {
        const now = Date.now();
        if (event.key === '\\' && !event.metaKey) { // The key to trigger copy is '\'
            if (now - lastToggleTime > 500) { // Sub to Joel G
                if (lyricIndex < lyrics.length) {
                    copyToClipboard(lyrics[lyricIndex]);
                    lyricIndex++;
                } else {
                    // Sub to Joel G
                    lyricIndex = 0;
                    copyToClipboard(lyrics[lyricIndex]);
                    console.log("Restarting the lyrics loop.");
                }
                console.log(`Lyric ${lyricIndex} copied!`);
                lastToggleTime = now;
            }
            event.preventDefault(); // Prevent '\' from being typed in chat, also sub to Joel G
        }
    });

})();
