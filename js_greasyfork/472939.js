// ==UserScript==
// @name         #benfest
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://eu.wasted-trucks.aces.amazon.dev/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472939/benfest.user.js
// @updateURL https://update.greasyfork.org/scripts/472939/benfest.meta.js
// ==/UserScript==

(function() {

    // Stworzenie obiektu
    var ben = document.createElement('div');
    ben.innerHTML = '<image id="ben_image" style="" src="https://drive.corp.amazon.com/view/nowaratn@/%23benfest/pirat_ben.gif" />';
    ben.setAttribute('id', 'barka_div_id');
    ben.setAttribute('style', 'display: inline-flex; width: 500; height: 300px; right: -700px; bottom: -20px; position: fixed; z-index: 101; transition: transform 15s linear; transform: translateX(0%);');
    document.body.appendChild(ben);

    const emojis = ["😄", "❤️", "👍", "😊", "🎉", "😍", "🔥", "🙌", "😎", "🚀"];

    function createEmoji() {
        const emoji = document.createElement("div");
        emoji.classList.add("emoji");
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        document.body.appendChild(emoji);

        const randomX = Math.random() * (window.innerWidth - 40); // 40 to szerokość emotikony
        const randomDuration = (Math.random() * 3) + 2;

        emoji.style.left = `${randomX}px`;
        emoji.style.animation = `floatUp ${randomDuration}s linear`;

        setTimeout(() => {
            document.body.removeChild(emoji);
        }, randomDuration * 1000);
    }

    const styles = document.createElement("style");
    styles.textContent = `
        .emoji {
            position: fixed;
            bottom: 0;
            transform: translateX(-50%);
            font-size: 24px;
        }
        @keyframes floatUp {
            0% {
                opacity: 1;
                bottom: 0;
            }
            100% {
                opacity: 0;
                bottom: 100%;
            }
        }
    `;
    document.head.appendChild(styles);

    // Uruchomienie muzyki
    var ben_audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/%23benfest/ben_pirate_song.mp3');
    ben_audio.play();

    setTimeout(function() {
        var pageWidth = window.innerWidth;
        ben.style.transform = 'translateX(-' + (pageWidth + 500) + 'px)';

        setTimeout(function() {
            var benfest_live = setInterval(createEmoji, 200);

            setTimeout(function() {

                clearInterval(benfest_live);
                ben.remove();
            }, 23000);
        },1500);
    }, 100);
})();