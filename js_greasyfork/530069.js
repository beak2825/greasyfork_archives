// ==UserScript==
// @name         Anime Chat Cringe Troll Popup (Multi-Style Otaku Edition - Random CSS & Delays)
// @namespace    http://tampermonkey.net/
// @version      2.2.3
// @description  Zeigt im Anime-Chat ein einzelnes, nerviges Popup an – mit dynamischen Textwechseln, diversen Popup-Styles, einem flüssig fliehenden Close-Button, zufälligen CSS-Änderungen an der gesamten Website und verzögerten Popup-/Sound-Intervallen (10-30 Minuten) sowie CSS-Änderungen (5-10 Minuten).
// @author       
// @license      MIT
// @match        https://anime.academy/chat*
// @match        https://anime.academy/profile/*
// @include      /^https?:\/\/(www\.)?tandro\.de\/.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530069/Anime%20Chat%20Cringe%20Troll%20Popup%20%28Multi-Style%20Otaku%20Edition%20-%20Random%20CSS%20%20Delays%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530069/Anime%20Chat%20Cringe%20Troll%20Popup%20%28Multi-Style%20Otaku%20Edition%20-%20Random%20CSS%20%20Delays%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CSS-Animationen injizieren
    const style = document.createElement('style');
    style.textContent = `
    @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
    @keyframes shake {
        0% { transform: translate(-50%, -50%) translate(0, 0); }
        25% { transform: translate(-50%, -50%) translate(5px, -5px); }
        50% { transform: translate(-50%, -50%) translate(0, 0); }
        75% { transform: translate(-50%, -50%) translate(-5px, 5px); }
        100% { transform: translate(-50%, -50%) translate(0, 0); }
    }
    @keyframes floatAround {
        0% { top: 10%; left: 10%; }
        25% { top: 10%; left: 80%; }
        50% { top: 80%; left: 80%; }
        75% { top: 80%; left: 10%; }
        100% { top: 10%; left: 10%; }
    }
    @keyframes spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.2); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }
    @keyframes bounce {
        0% { transform: translate(-50%, -50%) translateY(0); }
        50% { transform: translate(-50%, -50%) translateY(-30px); }
        100% { transform: translate(-50%, -50%) translateY(0); }
    }
    @keyframes wobble {
        0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
        25% { transform: translate(-50%, -50%) rotate(3deg) scale(1.1); }
        50% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
        75% { transform: translate(-50%, -50%) rotate(-3deg) scale(0.9); }
        100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
    }
    `;
    document.head.appendChild(style);

    // Verschiedene Popup-Styles mit unterschiedlichen Bewegungsmustern
    const popupStyles = [
        {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1e1e1e',
            color: '#f0f0f0',
            padding: '30px',
            border: '3px solid hotpink',
            borderRadius: '10px',
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 'bold',
            boxShadow: '0 0 20px hotpink',
            animation: 'blink 0.5s infinite alternate, shake 0.5s infinite'
        },
        {
            position: 'fixed',
            top: '10%',
            left: '10%',
            backgroundColor: '#000',
            color: '#ff0',
            padding: '40px',
            border: '5px dotted lime',
            borderRadius: '5px',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: '900',
            boxShadow: '0 0 30px lime',
            animation: 'floatAround 12s linear infinite'
        },
        {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ff00ff',
            color: '#000',
            padding: '20px',
            border: '4px double #00f',
            borderRadius: '15px',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            boxShadow: '0 0 25px #00f',
            animation: 'spin 4s linear infinite'
        },
        {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ff6347',
            color: '#fff',
            padding: '35px',
            border: '3px solid #000',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '23px',
            fontWeight: 'bold',
            boxShadow: '0 0 25px #ff6347',
            animation: 'pulse 1.5s ease-in-out infinite'
        },
        {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ff1493',
            color: '#000',
            padding: '40px',
            border: '4px dashed #fff',
            borderRadius: '20px',
            textAlign: 'center',
            fontSize: '26px',
            fontWeight: 'bold',
            boxShadow: '0 0 30px #ff1493',
            animation: 'bounce 1s ease-in-out infinite'
        },
        {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#222',
            color: '#39ff14',
            padding: '35px',
            border: '3px solid #39ff14',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 'bold',
            boxShadow: '0 0 25px #39ff14',
            animation: 'wobble 2s ease-in-out infinite'
        }
    ];

    // Erweiterte Sound-Arrays
    const openSounds = [
        'https://www.myinstants.com/media/sounds/vine-boom.mp3',
        'https://www.myinstants.com/media/sounds/airhorn.mp3',
        'https://www.myinstants.com/media/sounds/anime-scream.mp3',
        'https://www.myinstants.com/media/sounds/otaku-alert.mp3',
        'https://www.myinstants.com/media/sounds/anime-wow.mp3',
        'https://www.myinstants.com/media/sounds/nani.mp3',
        'https://www.myinstants.com/media/sounds/anime-laugh.mp3',
        'https://www.myinstants.com/media/sounds/chibi-beep.mp3'
    ];
    const closeSounds = [
        'https://www.myinstants.com/media/sounds/metal-pipe.mp3',
        'https://www.myinstants.com/media/sounds/sad-trombone.mp3',
        'https://www.myinstants.com/media/sounds/anime-magic.mp3',
        'https://www.myinstants.com/media/sounds/anime-fail.mp3',
        'https://www.myinstants.com/media/sounds/anime-disappoint.mp3',
        'https://www.myinstants.com/media/sounds/boing.mp3',
        'https://www.myinstants.com/media/sounds/anime-cry.mp3',
        'https://www.myinstants.com/media/sounds/otaku-shrug.mp3'
    ];
    const annoyingSounds = [
        'https://www.myinstants.com/media/sounds/airhorn.mp3',
        'https://www.myinstants.com/media/sounds/sad-trombone.mp3',
        'https://www.myinstants.com/media/sounds/vine-boom.mp3',
        'https://www.myinstants.com/media/sounds/anime-scream.mp3',
        'https://www.myinstants.com/media/sounds/anime-alert.mp3',
        'https://www.myinstants.com/media/sounds/boing.mp3',
        'https://www.myinstants.com/media/sounds/nani.mp3',
        'https://www.myinstants.com/media/sounds/chibi-beep.mp3',
        'https://www.myinstants.com/media/sounds/anime-laugh.mp3'
    ];

    // Cringe Otaku Nachrichten
    const messages = [
        { text: 'OMG, dein Chat ist so cringe – total otaku, total kawaii, Senpai approved!', buttonText: 'LOL, genug!' },
        { text: 'Onii-chan, dein Style ist mega weird und cringe – pure Otaku-Power, aber bitte stopp das!', buttonText: 'Ich kann nicht mehr!' },
        { text: 'Konnichiwa, cringe-otaku! Dein Chat-Vibe ist der absolute Shit – so weird, so fresh, so cringe!', buttonText: 'Stoppt den Wahnsinn!' },
        { text: 'Sugoi! Dein Chat ist cringe AF – ein totaler Anime-Fail, aber wir feiern den Vibe!', buttonText: 'Enough already!' },
        { text: 'Baka! Dein Vibe ist so cringe, dass sogar die Chibi-Charaktere erröten – total otaku!', buttonText: 'Cut it out!' },
        { text: 'Watashi wa cringe desu! Dein Chat ist der absolute Overload an Otaku-Cringe!', buttonText: 'I can’t even!' },
        { text: 'Hentai? Nein, es ist nur dein ultra-cringe, over-the-top Otaku-Style – einfach next level!', buttonText: 'Genug jetzt!' }
    ];

    // Hilfsfunktion: Spielt zufällig einen Sound
    function playRandomSound(soundArray) {
        const soundUrl = soundArray[Math.floor(Math.random() * soundArray.length)];
        new Audio(soundUrl).play();
    }
    function playOpenSound() { playRandomSound(openSounds); }
    function playCloseSound() { playRandomSound(closeSounds); }

    let annoyingSoundInterval;
    function startAnnoyingSounds() {
        annoyingSoundInterval = setInterval(() => {
            playRandomSound(annoyingSounds);
        }, 3000);
    }
    function stopAnnoyingSounds() {
        clearInterval(annoyingSoundInterval);
    }

    // Zufällige CSS-Änderungen an der gesamten Seite (alle 5-10 Minuten)
    function randomizeSiteCSS() {
        const option = Math.floor(Math.random() * 5);
        switch(option) {
            case 0:
                document.body.style.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg)`;
                break;
            case 1:
                document.body.style.fontSize = (Math.floor(Math.random() * 9) + 16) + 'px';
                break;
            case 2:
                document.body.style.letterSpacing = Math.floor(Math.random() * 6) + 'px';
                break;
            case 3:
                document.body.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
                break;
            case 4:
                document.body.style.opacity = (Math.random() * 0.5 + 0.5).toFixed(2);
                break;
        }
    }
    function scheduleRandomizeSiteCSS() {
        randomizeSiteCSS();
        const delay = Math.floor(Math.random() * (10 - 5 + 1) + 5) * 60000;
        setTimeout(scheduleRandomizeSiteCSS, delay);
    }
    scheduleRandomizeSiteCSS();

    // Zusätzliche Textinjektion in die Website
    function injectRandomText() {
        const injected = document.createElement('div');
        const textOptions = [
            "Extra cringe Nachricht!",
            "Otaku takeover!",
            "Nani? WTF!",
            "Senpai, notice me!",
            "Kawaii but cringe!",
            "Baka, so annoying!"
        ];
        injected.innerText = textOptions[Math.floor(Math.random() * textOptions.length)];
        injected.style.position = 'fixed';
        injected.style.top = Math.floor(Math.random() * 100) + '%';
        injected.style.left = Math.floor(Math.random() * 100) + '%';
        injected.style.zIndex = '10002';
        injected.style.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        injected.style.fontSize = (Math.floor(Math.random() * 10) + 16) + 'px';
        injected.style.pointerEvents = 'none';
        document.body.appendChild(injected);
        injected.style.transition = 'opacity 2s';
        setTimeout(() => { injected.style.opacity = '0'; }, 3000);
        setTimeout(() => { if(document.body.contains(injected)) { injected.remove(); } }, 5000);
    }
    setInterval(injectRandomText, 7000);

    // --- Helper: Ensure Popup stays within viewport ---
    function ensurePopupInViewport(popup) {
        const rect = popup.getBoundingClientRect();
        let newTop = rect.top;
        let newLeft = rect.left;
        if (rect.top < 0) newTop = 0;
        if (rect.left < 0) newLeft = 0;
        if (rect.right > window.innerWidth) newLeft = window.innerWidth - rect.width;
        if (rect.bottom > window.innerHeight) newTop = window.innerHeight - rect.height;
        popup.style.top = newTop + 'px';
        popup.style.left = newLeft + 'px';
        // Remove any translate transform so the element is positioned in pixels
        popup.style.transform = '';
    }

    // Funktion zum Erstellen eines Popups
    function showPopup() {
        playOpenSound();
        startAnnoyingSounds();

        // Overlay erstellen
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        overlay.style.zIndex = '9999';
        overlay.style.animation = 'blink 0.5s infinite alternate';
        document.body.appendChild(overlay);

        // Zufällig eine Nachricht und einen Style auswählen
        const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
        const selectedStyle = popupStyles[Math.floor(Math.random() * popupStyles.length)];

        // Popup erstellen und Style anwenden
        const popup = document.createElement('div');
        if (!selectedStyle.transform) {
            popup.style.transform = 'translate(-50%, -50%)';
        }
        if (!selectedStyle.animation.includes('floatAround')) {
            popup.style.top = '50%';
            popup.style.left = '50%';
        }
        for (const prop in selectedStyle) {
            popup.style[prop] = selectedStyle[prop];
        }
        popup.style.overflow = 'visible';
        popup.style.zIndex = '10000';

        // Nachricht mit dynamischem Text
        const messageElem = document.createElement('p');
        messageElem.innerText = selectedMessage.text;
        popup.appendChild(messageElem);
        const textInterval = setInterval(() => {
            messageElem.innerText = messages[Math.floor(Math.random() * messages.length)].text;
        }, 3000);
        popup.dataset.textInterval = textInterval;

        // Close-Button mit dynamisch fließendem Verhalten
        const closeButton = document.createElement('button');
        closeButton.innerText = selectedMessage.buttonText;
        closeButton.style.marginTop = '20px';
        closeButton.style.padding = '12px 25px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = 'hotpink';
        closeButton.style.color = '#fff';
        closeButton.style.cursor = 'pointer';
        closeButton.style.borderRadius = '5px';
        closeButton.style.fontSize = '20px';
        closeButton.style.position = 'absolute';
        closeButton.style.left = '50%';
        closeButton.style.top = '70%';
        closeButton.addEventListener('mouseover', () => {
            const randomSpeed = (Math.random() * 0.7 + 0.3).toFixed(2);
            closeButton.style.transition = `transform ${randomSpeed}s ease-out`;
            const offsetX = Math.floor(Math.random() * 300) - 150;
            const offsetY = Math.floor(Math.random() * 300) - 150;
            closeButton.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
        closeButton.addEventListener('click', () => {
            clearInterval(textInterval);
            popup.remove();
            overlay.remove();
            stopAnnoyingSounds();
            playCloseSound();
            const delay = Math.floor(Math.random() * (30 - 10 + 1) + 10) * 60000;
            setTimeout(showPopup, delay);
        });
        popup.appendChild(closeButton);

        document.body.appendChild(popup);
        ensurePopupInViewport(popup);
    }

    // Starte das erste Popup
    showPopup();

    // Expose a console command for testing: call "showTestPopup()" to trigger a new popup immediately.
    window.showTestPopup = showPopup;
})();
