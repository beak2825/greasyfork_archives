// ==UserScript==
// @name         BetterCSS
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Adds better CSS to the Icestar site
// @author       @theyhoppingonme on discord
// @match        https://icestar.com.de/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icestar.com.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539720/BetterCSS.user.js
// @updateURL https://update.greasyfork.org/scripts/539720/BetterCSS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Define new style
const newStyles = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-ice: #00e5ff;
    --secondary-ice: #18ffff;
    --accent-cyan: #00bcd4;
    --dark-ice: #004d5c;
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
    --shadow-glow: 0 0 30px rgba(0, 229, 255, 0.3);
    --gradient-ice: linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(24, 255, 255, 0.05) 100%);
}

body {
    font-family: 'Inter', sans-serif;
    color: #ffffff;
    overflow-x: hidden;
    min-height: 100vh;
    position: relative;
    background: #0a0f1c;
}

.background {
    position: relative;
    width: 100vw;
    height: 100vh;
    background:
        radial-gradient(circle at 20% 50%, rgba(0, 229, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(24, 255, 255, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(0, 188, 212, 0.06) 0%, transparent 50%),
        linear-gradient(135deg, #0a0f1c 0%, #0d1421 25%, #1a1f2e 50%, #0f1419 75%, #0a0f1c 100%);
    background-size: 100% 100%;
    animation: backgroundShift 20s ease-in-out infinite alternate;
    overflow: hidden;
}

@keyframes backgroundShift {
    0% {
        background-position: 0% 0%, 100% 0%, 50% 100%;
        filter: hue-rotate(0deg);
    }
    100% {
        background-position: 100% 100%, 0% 100%, 0% 0%;
        filter: hue-rotate(15deg);
    }
}

.background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
        radial-gradient(2px 2px at 20px 30px, rgba(0, 229, 255, 0.4), transparent),
        radial-gradient(2px 2px at 40px 70px, rgba(24, 255, 255, 0.3), transparent),
        radial-gradient(1px 1px at 90px 40px, rgba(0, 188, 212, 0.5), transparent),
        radial-gradient(1px 1px at 130px 80px, rgba(0, 229, 255, 0.4), transparent),
        radial-gradient(2px 2px at 160px 30px, rgba(24, 255, 255, 0.3), transparent);
    background-size: 200px 150px;
    animation: particleFloat 15s linear infinite;
    opacity: 0.6;
}

@keyframes particleFloat {
    0% { transform: translateY(0px) rotate(0deg); }
    100% { transform: translateY(-100vh) rotate(360deg); }
}

.main-title {
    text-align: center;
    font-family: 'Orbitron', monospace;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 900;
    margin: 0;
    padding: 1rem 0;
    background: linear-gradient(135deg, #00e5ff 0%, #18ffff 50%, #00bcd4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(0, 229, 255, 0.5);
    position: relative;
    animation: titleGlow 3s ease-in-out infinite alternate;
    letter-spacing: 2px;
    z-index: 2;
}

@keyframes titleGlow {
    0% {
        filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.3));
        transform: scale(1);
    }
    100% {
        filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.6));
        transform: scale(1.02);
    }
}

.panel {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(95vw, 1200px);
    height: 80vh;
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2rem;
    overflow-y: auto;
    box-shadow:
        var(--shadow-glow),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        0 20px 40px rgba(0, 0, 0, 0.3);
    animation: panelSlideIn 1s ease-out;
    position: relative;
}

@keyframes panelSlideIn {
    0% {
        opacity: 0;
        transform: translate(-50%, -40%) scale(0.9);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

.panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient-ice);
    border-radius: 20px;
    z-index: -1;
    opacity: 0.3;
}

.panel::-webkit-scrollbar {
    width: 8px;
}

.panel::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}

.panel::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, var(--primary-ice), var(--secondary-ice));
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
}

.panel::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, var(--secondary-ice), var(--primary-ice));
}

.category {
    margin-bottom: 2rem;
    text-align: center;
    animation: categoryFadeIn 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(30px);
}

.category:nth-child(1) { animation-delay: 0.2s; }
.category:nth-child(2) { animation-delay: 0.4s; }
.category:nth-child(3) { animation-delay: 0.6s; }
.category:nth-child(4) { animation-delay: 0.8s; }

@keyframes categoryFadeIn {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.category h2 {
    font-family: 'Orbitron', monospace;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--primary-ice);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    position: relative;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.category h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--primary-ice), transparent);
    animation: borderExpand 1s ease-out 0.5s forwards;
}

@keyframes borderExpand {
    to { width: 80%; }
}

.file {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin: 0.8rem;
    cursor: pointer;
    width: 90px;
    padding: 0.8rem;
    border-radius: 15px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid transparent;
}

.file::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(24, 255, 255, 0.05));
    border-radius: 15px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
}

.file:hover {
    transform: translateY(-8px) scale(1.05);
    border-color: var(--primary-ice);
    box-shadow:
        0 10px 25px rgba(0, 229, 255, 0.2),
        0 0 20px rgba(0, 229, 255, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.file:hover::before {
    opacity: 1;
}

.file:active {
    transform: translateY(-4px) scale(1.02);
}

.file img {
    width: 40px;
    height: 40px;
    image-rendering: pixelated;
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.3));
}

.file:hover img {
    transform: scale(1.1);
    filter: drop-shadow(0 0 15px rgba(0, 229, 255, 0.6));
}

.file span {
    margin-top: 0.5rem;
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    line-height: 1.2;
    transition: color 0.3s ease;
}

.file:hover span {
    color: var(--primary-ice);
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
}

.window {
    background: rgba(31, 41, 55, 0.6); /* bg-gray-800 with opacity */
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: fixed;
    top: 10%;
    left: 15%;
    width: 70%;
    height: 75%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    z-index: 100;
    resize: both;
    overflow: hidden;
    box-shadow:
        0 25px 50px rgba(0, 0, 0, 0.5),
        0 0 30px rgba(0, 229, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    animation: windowSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes windowSlideIn {
    0% {
        opacity: 0;
        transform: scale(0.8) translateY(-50px);
    }
    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.window-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(24, 255, 255, 0.05));
    border-bottom: 1px solid var(--glass-border);
    color: #ffffff;
    position: relative;
    cursor: move;
    user-select: none;
    font-family: 'Orbitron', monospace;
    font-weight: 600;
    letter-spacing: 1px;
}

#close-window {
    position: absolute;
    left: 20px;
    background: rgba(255, 82, 82, 0.1);
    border: 2px solid #ff5252;
    color: #ff5252;
    font-weight: bold;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 25px;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    backdrop-filter: blur(10px);
}

#close-window:hover {
    background: #ff5252;
    color: white;
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 82, 82, 0.4);
}

#window-content {
    flex: 1;
    width: 100%;
    border: none;
    background: rgba(255, 255, 255, 0.02);
}

#touch-warning {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(20px);
    color: white;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    text-align: center;
    font-family: 'Inter', sans-serif;
    padding: 2rem;
}

.domain-warning {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    width: min(90vw, 600px);
    background: rgba(255, 82, 82, 0.1);
    backdrop-filter: blur(20px);
    border: 2px solid #ff5252;
    color: #ff5252;
    font-weight: 600;
    padding: 1.5rem;
    border-radius: 15px;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 1rem;
    text-align: left;
    box-shadow: 0 10px 30px rgba(255, 82, 82, 0.2);
    animation: warningPulse 2s ease-in-out infinite alternate;
}

@keyframes warningPulse {
    0% { box-shadow: 0 10px 30px rgba(255, 82, 82, 0.2); }
    100% { box-shadow: 0 10px 40px rgba(255, 82, 82, 0.4); }
}

.copy-domain {
    text-decoration: underline dotted;
    color: #ff5252;
    cursor: pointer;
    transition: all 0.3s ease;
}

.copy-domain:hover {
    text-decoration: underline solid;
    color: #ff8a80;
    text-shadow: 0 0 10px rgba(255, 138, 128, 0.5);
}

@media (max-width: 768px) {
    .panel {
        width: 95vw;
        height: 85vh;
        padding: 1.5rem;
    }

    .main-title {
        font-size: 1.5rem;
        padding: 0.8rem 0;
    }

    .file {
        width: 70px;
        margin: 0.4rem;
        padding: 0.6rem;
    }

    .file img {
        width: 35px;
        height: 35px;
    }

    .file span {
        font-size: 0.7rem;
    }

    .category h2 {
        font-size: 1rem;
    }

    .window {
        width: 95vw;
        height: 80vh;
        top: 10%;
        left: 2.5%;
    }
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.loading-shimmer {
    position: relative;
    overflow: hidden;
}

.loading-shimmer::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: shimmer 2s infinite;
}
`;
// find the style element
const styleElement = document.createElement('style');
// if it exists, replace it
if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = newStyles;
} else {
    // if it doesnt exist, make a new one
    styleElement.appendChild(document.createTextNode(newStyles));
}
// append the style
document.head.appendChild(styleElement);
})();