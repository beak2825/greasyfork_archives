// ==UserScript==
// @name         Block Drawaria.online ⚠️
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Wanna stop playing and touch grass? Don't worry! This script Blocks Drawaria.online and shows a warning in the user's language with fun effects.
// @author       YouTubeDrawaria
// @match        *://drawaria.online/*
// @icon         https://drawaria.online/apple-touch-icon.png
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/535606/Block%20Drawariaonline%20%E2%9A%A0%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/535606/Block%20Drawariaonline%20%E2%9A%A0%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get the user's language
    function getUserLanguage() {
        const navigatorLanguage = navigator.language || navigator.userLanguage;
        return navigatorLanguage.split('-')[0]; // Get the primary language code
    }

    // Translations for the warning message and character's speech
    const translations = {
        en: {
            title: 'Everything is blocked',
            message: 'You should not play right now, you have important things to do.',
            characterSpeech: 'Hey! Go outside.'
        },
        es: {
            title: 'Todo está bloqueado',
            message: 'No debes jugar en este momento, tienes cosas importantes que hacer ahora mismo.',
            characterSpeech: '¡Oye! Sal afuera.'
        },
        fr: {
            title: 'Tout est bloqué',
            message: 'Vous ne devriez pas jouer en ce moment, vous avez des choses importantes à faire.',
            characterSpeech: 'Hé ! Sors dehors.'
        },
        de: {
            title: 'Alles ist blockiert',
            message: 'Du solltest im Moment nicht spielen, du hast wichtige Dinge zu tun.',
            characterSpeech: 'Hey! Geh nach draußen.'
        },
        it: {
            title: 'Tutto è bloccato',
            message: 'Non dovresti giocare in questo momento, hai cose importanti da fare.',
            characterSpeech: 'Ehi! Esci fuori.'
        },
        pt: {
            title: 'Tudo está bloqueado',
            message: 'Você não deveria jogar agora, você tem coisas importantes para fazer.',
            characterSpeech: 'Ei! Vá para fora.'
        },
        ru: {
            title: 'Все заблокировано',
            message: 'Вы не должны играть сейчас, у вас есть важные дела.',
            characterSpeech: 'Эй! Иди на улицу.'
        },
        ja: {
            title: 'すべてブロックされています',
            message: '今はプレイすべきではありません。重要なことがあります。',
            characterSpeech: 'ねえ！外に出ようよ。'
        },
        zh: {
            title: '一切都被阻止了',
            message: '您现在不应该玩，您有重要的事情要做。',
            characterSpeech: '嘿！出去外面。'
        },
        // Add more languages as needed
    };

    // Get the user's language and select the translation
    const userLanguage = getUserLanguage();
    const translation = translations[userLanguage] || translations['en']; // Default to English if translation is not available

    // Styles for the warning screen
    const overlayStyle = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8); /* Dark semi-transparent background */
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000; /* Ensure it's on top of everything */
        font-family: sans-serif;
        font-size: 24px;
        text-align: center;
    `;

    const warningBoxStyle = `
        background-color: #f44336; /* Red warning background - Initial */
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        cursor: pointer; /* Add pointer cursor to the warning box */
        position: relative; /* Needed for transform origins */
    `;

    const warningSymbolStyle = `
        font-size: 60px;
        margin-bottom: 20px;
        color: yellow;
    `;

    // Styles for the character and speech bubble
    const characterContainerStyle = `
        position: fixed;
        bottom: 20px;
        right: -100px; /* Start off-screen */
        z-index: 10001;
        display: flex;
        flex-direction: column; /* Stack items vertically */
        align-items: flex-end;
        transition: right 1s ease-in-out;
    `;

    const characterImageStyle = `
        width: 70px;
        height: 70px;
        transform-origin: bottom center; /* Set transform origin for dance */
    `;

    const speechBubbleStyle = `
        background-color: white;
        color: black;
        padding: 10px;
        border-radius: 10px;
        position: relative;
        margin-bottom: 10px; /* Space between bubble and character */
        opacity: 0; /* Start hidden */
        transition: opacity 0.5s ease-in-out;
        max-width: 200px; /* Limit bubble width */
        text-align: left;
    `;

    const speechBubbleArrowStyle = `
        content: '';
        position: absolute;
        bottom: -10px;
        right: 50%; /* Center the arrow horizontally */
        transform: translateX(50%); /* Fine-tune centering */
        border-width: 10px 10px 0;
        border-style: solid;
        border-color: white transparent;
    `;

     // Styles for the Rick Astley GIF
     const rickAstleyStyle = `
         position: fixed;
         bottom: 20px;
         left: -200px; /* Start off-screen on the left */
         z-index: 10001;
         width: 150px; /* Adjust size as needed */
         transition: left 1s ease-in-out;
     `;


    // Styles for particle and music note animations
    const particleKeyframes = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-500px) translateX(100px) rotate(360deg);
                opacity: 0;
            }
        }
    `;

     const musicNoteKeyframes = `
        @keyframes rise {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-400px) translateX(-50px) rotate(-30deg);
                opacity: 0;
            }
        }
     `;

    // Styles for the corner glow effect on the overlay and warning box borders
    const glowKeyframes = `
        @keyframes glow {
            0% {
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.6); /* Red */
            }
            25% {
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.6); /* Green */
            }
            50% {
                box-shadow: 0 0 20px rgba(0, 0, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.6); /* Blue */
            }
            75% {
                box-shadow: 0 0 20px rgba(255, 0, 255, 0.8), 0 0 40px rgba(255, 0, 255, 0.6); /* Magenta */
            }
            100% {
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.6); /* Red */
            }
        }
    `;

     // Styles for the warning box background color change
     const warningBoxColorChangeKeyframes = `
         @keyframes warningBoxColorChange {
             0% { background-color: #f44336; } /* Red */
             25% { background-color: #ff9800; } /* Orange */
             50% { background-color: #000000; } /* Black */
             75% { background-color: #8bc34a; } /* Light Green */
             100% { background-color: #2196f3; } /* Blue */
         }
     `;

    // CSS for the character dance animation (simple shake/rotate)
    const characterDanceKeyframes = `
        @keyframes characterDance {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
            75% { transform: rotate(-5deg); }
            100% { transform: rotate(5deg); }
        }
    `;


    // CSS for the pulse animation on the warning box content
    const pulseKeyframesWarningBox = `
        @keyframes pulseWarningBox {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.01);
            }
            100% {
                transform: scale(1);
            }
        }
    `;

    const pulseAnimationWarningBox = `
        pulseWarningBox 1s ease-in-out infinite
    `; // Removed 'animation:' prefix here for easier combination

    const glowAnimation = `
         glow 5s infinite alternate /* Removed 'animation:' prefix */
    `;

    const warningBoxColorChangeAnimation = `
        warningBoxColorChange 10s infinite alternate /* Removed 'animation:' prefix */
    `;

     const characterDanceAnimation = `
        characterDance 0.5s infinite alternate /* Removed 'animation:' prefix */
     `;


    // Create a style element for all animations
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        ${pulseKeyframesWarningBox}
        ${particleKeyframes}
        ${musicNoteKeyframes}
        ${glowKeyframes}
        ${warningBoxColorChangeKeyframes}
        ${characterDanceKeyframes}
    `;
    document.head.appendChild(styleSheet);

    // Create the element of the warning screen
    const overlay = document.createElement('div');
    overlay.style.cssText = overlayStyle;
     // Apply glow animation to the overlay border
    overlay.style.border = '5px solid transparent'; // Add a border to apply box-shadow to
    overlay.style.boxSizing = 'border-box'; // Include border in element's total width and height

    const warningBox = document.createElement('div');
    warningBox.style.cssText = warningBoxStyle;
    // Apply glow animation to the warning box border
    warningBox.style.border = '3px solid transparent'; // Add a border
    warningBox.style.boxSizing = 'border-box'; // Include border in element's total width and height


    const warningSymbol = document.createElement('span');
    warningSymbol.style.cssText = warningSymbolStyle;
    warningSymbol.textContent = '⚠️'; // Warning symbol

    const warningText = document.createElement('p');
    warningText.innerHTML = `<b>${translation.title}</b><br><br>${translation.message}`;

    warningBox.appendChild(warningSymbol);
    warningBox.appendChild(warningText);
    overlay.appendChild(warningBox); // Append warningBox to overlay

    // Create the audio element for the music
    const audio = new Audio('https://www.myinstants.com/media/sounds/rick-astley-never-gonna-give-you-up-mp3cut_2.mp3');
    audio.loop = true; // Set to loop

    // Create the character and speech bubble elements
    const characterContainer = document.createElement('div');
    characterContainer.style.cssText = characterContainerStyle;

    const characterImage = document.createElement('img');
    characterImage.src = 'https://img.itch.zone/aW1nLzE4NzkxNTczLnBuZw==/70x70%23/9VuXso.png'; // Reverted to original URL
    characterImage.style.cssText = characterImageStyle;

    const speechBubble = document.createElement('div');
    speechBubble.style.cssText = speechBubbleStyle;
    speechBubble.textContent = translation.characterSpeech;

    const speechBubbleArrow = document.createElement('div');
    speechBubbleArrow.style.cssText = speechBubbleArrowStyle;

    // Append speech bubble and character image in the correct order for column layout
    speechBubble.appendChild(speechBubbleArrow); // Arrow inside the speech bubble
    characterContainer.appendChild(speechBubble);
    characterContainer.appendChild(characterImage);

    // Create the Rick Astley GIF element
    const rickAstleyGif = document.createElement('img');
    rickAstleyGif.src = 'https://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif';
    rickAstleyGif.style.cssText = rickAstleyStyle;


    // Add the warning screen, character, and Rick Astley GIF to the body
    document.body.appendChild(overlay);
    document.body.appendChild(characterContainer);
     document.body.appendChild(rickAstleyGif);


    // Flag to ensure the click logic runs only once
    let clicked = false;

    // Function to create and animate a particle
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 5px;
            height: 5px;
            background-color: white;
            border-radius: 50%;
            pointer-events: none; /* Don't interfere with clicks */
            z-index: 10002;
            left: ${Math.random() * window.innerWidth}px; /* Random horizontal position */
            bottom: 0; /* Start from the bottom */
            animation: float ${2 + Math.random() * 3}s ease-out forwards; /* Random duration */
        `;
        document.body.appendChild(particle);

        // Remove particle after animation
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }

    // Function to create and animate a music note
    function createMusicNote() {
        const musicNote = document.createElement('span');
        musicNote.textContent = Math.random() > 0.5 ? '♪' : '♫'; // Randomly pick a note
        musicNote.style.cssText = `
            position: fixed;
            font-size: 20px;
            color: yellow; /* Music note color */
            pointer-events: none;
            z-index: 10002;
            left: ${Math.random() * window.innerWidth}px; /* Random horizontal position */
            bottom: 0; /* Start from the bottom */
            animation: rise ${3 + Math.random() * 4}s ease-out forwards; /* Random duration */
        `;
        document.body.appendChild(musicNote);

        // Remove music note after animation
        musicNote.addEventListener('animationend', () => {
            musicNote.remove();
        });
    }

    let particleInterval;
    let musicNoteInterval;

    // Add click event listener to the warningBox
    warningBox.addEventListener('click', function(event) {
        // Prevent the click event from propagating
        event.stopPropagation();

        if (!clicked) {
            clicked = true; // Mark as clicked

            // Start the music
            audio.play().catch(e => console.error("Error playing audio:", e)); // Add error handling

            // Apply the pulse animation to the warning box content
            warningSymbol.style.animation = pulseAnimationWarningBox;
            warningText.style.animation = pulseAnimationWarningBox;

            // Apply both the pulse animation and the progressive color change to the warning box
            warningBox.style.animation = `${pulseAnimationWarningBox}, ${warningBoxColorChangeAnimation}`;

            // Apply the glow animation to the overlay border
            overlay.style.animation = glowAnimation;

            // Make the character appear from the corner and dance
            characterContainer.style.right = '20px'; // Move onto the screen
            characterImage.style.animation = characterDanceAnimation; // Start dancing

            // Make the speech bubble visible after a delay
            setTimeout(() => {
                speechBubble.style.opacity = '1';
            }, 1000); // Adjust delay as needed

            // Start generating particles and music notes
            particleInterval = setInterval(createParticle, 100); // Adjust interval for density
            musicNoteInterval = setInterval(createMusicNote, 300); // Adjust interval for density

             // Make Rick Astley appear from the other corner
             rickAstleyGif.style.left = '20px';


            // Optional: Attempt to stop further script execution
             try {
                 throw new Error('Script execution stopped by Tampermonkey script');
             } catch (e) {
                 // Ignore the error, it's intended to stop execution.
             }
        }
    });

    // Initial attempt to stop further script execution immediately
     try {
         throw new Error('Script execution stopped by Tampermonkey script');
     } catch (e) {
         // Ignore the error, it's intended to stop execution.
     }

})();