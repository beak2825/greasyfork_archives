// ==UserScript==
// @name         YouTube Subscribe Button Themes
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Custom animated subscribe button themes
// @author       NOT_FIND
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531990/YouTube%20Subscribe%20Button%20Themes.user.js
// @updateURL https://update.greasyfork.org/scripts/531990/YouTube%20Subscribe%20Button%20Themes.meta.js
// ==/UserScript==

const themeSelector = document.createElement('div');
themeSelector.innerHTML = `
    <div id="theme-popup" style="display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#202020;padding:20px;border-radius:10px;z-index:9999;box-shadow:0 0 20px rgba(0,0,0,0.5);width:400px">
        <h2 style="text-align:center;margin:0 0 20px;color:#fff">Subscribe Button Themes</h2>
        <div style="display:flex;justify-content:space-between;margin-bottom:20px">
            <div class="theme-preview">
                <div class="preview-btn futuristic">SUBSCRIBE</div>
                <button class="select-btn" onclick="selectTheme('futuristic')">Select</button>
            </div>
            <div class="theme-preview">
                <div class="preview-btn bendy">SUBSCRIBE</div>
                <button class="select-btn" onclick="selectTheme('bendy')">Select</button>
            </div>
            <div class="theme-preview">
                <div class="preview-btn particles">SUBSCRIBE</div>
                <button class="select-btn" onclick="selectTheme('particles')">Select</button>
            </div>
            <div class="theme-preview">
                <button class="select-btn" onclick="selectTheme('default')">Default</button>
            </div>
        </div>
    </div>
`;
document.body.appendChild(themeSelector);

const styles = document.createElement('style');
styles.textContent = `
    .select-btn {
        width: 100%;
        padding: 5px;
        border: none;
        border-radius: 4px;
        background: #065fd4;
        color: white;
        cursor: pointer;
    }

    .custom-subscribe-btn {
        width: 120px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        border: none;
        margin: 0 4px;
        position: relative;
        overflow: hidden;
    }

    .preview-btn {
        width: 100px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        font-size: 12px;
        font-weight: bold;
        position: relative;
        overflow: hidden;
    }

    /* Futuristic Theme */
    .futuristic {
        background: #7b2ff7;
        color: white;
        position: relative;
        overflow: hidden;
        border-radius: 5px;
        text-transform: uppercase;
        letter-spacing: 2px;
        transition: all 0.3s;
    }
    .futuristic::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: 0.5s;
    }
    .futuristic:hover::before {
        left: 100%;
    }

    /* Bendy Theme */
    .bendy {
        background: #00ff95;
        color: black;
        border-radius: 8px;
        transform-origin: center;
        animation: bendAnimation 2s ease-in-out infinite;
    }
    @keyframes bendAnimation {
        0% { transform: rotateX(0deg) scale(1); }
        25% { transform: rotateX(15deg) scale(1.05); }
        50% { transform: rotateX(0deg) scale(1); }
        75% { transform: rotateX(-15deg) scale(0.95); }
        100% { transform: rotateX(0deg) scale(1); }
    }

    /* Particles Theme */
    .particles {
        background: #2d2d2d;
        color: white;
        border-radius: 5px;
    }

    .preview-btn.particles::before,
    .preview-btn.particles::after,
    .custom-subscribe-btn.particles::before,
    .custom-subscribe-btn.particles::after {
        content: '❄';
        position: absolute;
        color: white;
        font-size: 10px;
        animation: snow 2s linear infinite;
        opacity: 0;
        z-index: 1;
    }

    .preview-btn.particles::before,
    .custom-subscribe-btn.particles::before {
        left: 30%;
        animation-delay: 0s;
    }

    .preview-btn.particles::after,
    .custom-subscribe-btn.particles::after {
        left: 70%;
        animation-delay: 1s;
    }

    @keyframes snow {
        0% {
            top: -20%;
            opacity: 0;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            top: 120%;
            opacity: 0;
        }
    }
`;
document.head.appendChild(styles);

function replaceSubscribeButton(theme) {
    const subscribeButton = document.querySelector('#subscribe-button');
    if (subscribeButton) {
        const oldButton = subscribeButton.querySelector('button');
        if (oldButton) {
            if (theme === 'default') {
                return;
            }

            const newButton = document.createElement('div');
            newButton.className = `custom-subscribe-btn ${theme}`;

            const buttonText = oldButton.textContent.trim().toUpperCase();
            const isSubscribed = buttonText === 'SUBSCRIBED' || buttonText === 'UNSUBSCRIBE';

            newButton.innerHTML = isSubscribed ? 'SUBSCRIBED' : 'SUBSCRIBE';
            newButton.onclick = oldButton.onclick;
            oldButton.replaceWith(newButton);
        }
    }
}

window.selectTheme = function(theme) {
    if (theme === 'default') {
        localStorage.removeItem('subscribeTheme');
    } else {
        localStorage.setItem('subscribeTheme', theme);
    }
    location.reload();
}

window.addEventListener('keydown', (e) => {
    if(e.key === ';') {
        const popup = document.getElementById('theme-popup');
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    }
});

const observer = new MutationObserver(() => {
    const savedTheme = localStorage.getItem('subscribeTheme');
    if(savedTheme) {
        replaceSubscribeButton(savedTheme);
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

const savedTheme = localStorage.getItem('subscribeTheme');
if(savedTheme) {
    replaceSubscribeButton(savedTheme);
}