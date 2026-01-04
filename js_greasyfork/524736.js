// ==UserScript==
// @name         Ans YouTube GUI (Adblocker, Vol Boost, Age Bypass, 30+ Mods)
// @name:zh         Ans YouTube 界面（广告拦截器，音量调节器，30+ 个修改）
// @name:zh-TW         Ans YouTube 介面（廣告阻擋器，音量調節器，30+ 個修改）
// @name:fi         Anin YouTube UI (Mainosestäjä, Ikärajaeston poisto, BassBoost, 30+ modia)
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @noframes
// @description  Tools for youtube, these tools let you modify the likes, video title, subscribers and views of the vid, dm me on dc if you want me to add ur idea
// @description:zh 工具用于 YouTube，这些工具让你修改视频的点赞数、标题、订阅者和观看次数。如果你有想法，私信我，我会添加你的想法。
// @description:zh-TW 工具用於 YouTube，這些工具讓你修改影片的點讚數、標題、訂閱者和觀看次數。如果你有想法，私訊我，我會添加你的想法。
// @description:fi  Työkaluja youtubeen nämä työkalut antaa sinun modifioida tykkäyksiä, videon nimeä, tilaajia ja videon katselukertoja, lähetä viestiä discordissa jos haluat että minä lisään ideasi.
// @author       @theyhoppingonme on discord
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524736/Ans%20YouTube%20GUI%20%28Adblocker%2C%20Vol%20Boost%2C%20Age%20Bypass%2C%2030%2B%20Mods%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524736/Ans%20YouTube%20GUI%20%28Adblocker%2C%20Vol%20Boost%2C%20Age%20Bypass%2C%2030%2B%20Mods%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
//patch logs:
// V1.0.0: GUI released
// V1.0.1: Adblock
// V1.0.2: Just a simple name change and patch logs
// V1.0.3 Added more unsubscribe button filters
// V1.0.4 New GUI name
// V1.0.5 Added desc changer
// V1.0.6 Added pinned comment name changer
// V1.0.7 Added volume changer (bass boost epic), video width changer, video height changer, video duration changer, video time watched changer
// V1.0.8 Ad block has been fixed and enhanced as well as the unsubscribing, before you had to unsubscribe first manually but now its fully functional!
// V1.0.9 Adblock is ACTUALLY fixed sorry for the inconvinience it was broken a bit
// V1.1.0 Added change search placeholder
// V1.1.1 Fixed Description Filtering
// V1.1.2 new epic UI
// V1.1.3 Fixed the video height and width changing, made gui look a bit better
// V1.1.4 Just translations
// V1.1.5 Age verification bypass
// V1.1.6 Forgot to change the GUI version in the script
// V1.1.7 fixed like filtering
// V1.1.8 cool watermark and version thingy
// V1.1.9 added make everything editable thingy and quality changer
// V1.2.0 added hide comments, hide sidebar, disable subtitles
// V1.2.1 added profile pic changer, watermark link changer, hide watermark
// V1.2.2 fixed a bit of the button sizes and css overall and bug fixes
// V1.2.3 added disable video overlay
// V1.2.4 added country code changer
// V1.2.5 added hide game
// V1.2.6 added hide topic
// V1.2.7 bug fix
// V1.2.8 Added stay closed when site opened
// V1.2.81 Bug fixes and 500 users!! TYSM
// V1.2.82 fixed fake likes once and for all
// V1.2.83 forgot to change the gui version name LMFAO
// V1.3 added oneko
// V1.3.1 fixed the css messing with youtube

setTimeout(() => {
function setCookie(name, value) {
    document.cookie = name + "=" + value + "; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function setMaxExpiryCookie(cookieName) {
    const maxExpiryDate = new Date(9999, 11, 31, 23, 59, 59).toUTCString();
    document.cookie = `${cookieName}=true; expires=${maxExpiryDate}; path=/;`;
    console.log(`Cookie "${cookieName}" expiry date set to max.`);
}
if (getCookie("alwaysClosed") === null) {
    setCookie("alwaysClosed", "false");
}

const version = "1.3";
var developer = false;
if (developer) {
    const countrycode = document.querySelector("span#country-code");
if (countrycode) {
    countrycode.textContent = `Developer Beta V${version}`;
 }
} else {
    const countrycode = document.querySelector("span#country-code");
if (countrycode) {
    countrycode.textContent = `V${version}`;
 }
}
function watermark() {
    const logoObserver = new MutationObserver((mutationsList, observer) => {
        const logo = document.querySelector('yt-icon#logo-icon.style-scope.ytd-logo');
        if (logo) {
            const watermark = document.createElement('button');
            watermark.id = 'watermark';
            watermark.textContent = 'Ans Youtube GUI';
            watermark.title = `V${version}`;
            watermark.style.cssText = `
                 background: none;
                border: none;
                color: #913AA8;
                font-size: 15px;
                font-family: Arial, sans-serif;
                font-weight: bold;
                cursor: pointer;
                padding: 3px 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            logo.insertBefore(watermark, logo.firstChild);
            observer.disconnect();
        }
    });

    logoObserver.observe(document.body, { childList: true, subtree: true });

    const homeObserver = new MutationObserver((mutationsList, observer) => {
    const home = document.querySelector('tp-yt-paper-item.style-scope.ytd-guide-entry-renderer');
    if (home) {
        home.textContent = " ";
        const watermark2 = document.createElement('button');
        watermark2.id = 'GreasyForkLink';
        watermark2.textContent = 'Script on GreasyFork';
        watermark2.onclick = () => {
            window.location.href = "https://greasyfork.org/en/scripts/524736";
        };
        watermark2.title = `Visit greasyfork site`;
        watermark2.style.cssText = `
            background: none;
            border: none;
            font-size: 15px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            cursor: pointer;
            padding: 3px 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
        `;
        home.insertBefore(watermark2, home.lastChild);
        observer.disconnect();
    }
});

homeObserver.observe(document.body, { childList: true, subtree: true });

}

watermark();

function isYouTubeShort() {
    const currentURL = window.location.href;
    if (currentURL.includes('youtube.com/shorts/')) {
        console.log('Mostly everything is bugged on shorts, if you wish to use the script on this video, go and watch the non-short version.');
    }
}
isYouTubeShort();
var kill = false;
function isLiveChat() {
    const currentURL = window.location.href;
    if (currentURL.includes('youtube.com/live')) {
        kill = true;
    }
}
isLiveChat();
if (!kill) {
const style = document.createElement('style'); // style for the menu
style.textContent = `
    .containerz {
        text-align: center;
        width: 80%;
        max-width: 800px;
        padding: 20px 30px;
        background-color: #222;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
        font-family: 'Arial', sans-serif;
        color: white;
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        transition: box-shadow 0.3s ease-in-out, background-color 0.3s ease;
    }
    button {
        background-color: #444;
        border: none;
        color: white;
        font-size: 9px;
        padding: 5px 6px;
        margin: 5px;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.2s ease;
    }
    button:hover {
        background-color: #6B3EFF;
        transform: scale(1.05);
    }
    .close-button, .minimize-button {
        position: absolute;
        top: 12px;
        background-color: transparent;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        transition: color 0.2s ease;
    }
    .close-button {
        right: 40px;
    }
    .minimize-button {
        right: 0px;
    }
    .close-button:hover, .minimize-button:hover {
        color: #6B3EFF;
    }
`;
document.head.appendChild(style);
const containerz = document.createElement('div'); //Creating the menu
containerz.className = 'containerz';
document.body.appendChild(containerz);

const title = document.createElement('h1'); // menu name
const nameElement = document.getElementById("account-name");
const name = nameElement ? nameElement.textContent.trim() : "Guest";
title.textContent = `Ans Youtube GUI V${version}`;
containerz.appendChild(title);

const closeButton = document.createElement('button'); // close button
closeButton.className = 'close-button';
closeButton.textContent = 'X';
containerz.appendChild(closeButton);
closeButton.addEventListener('click', () => {
    containerz.style.display = 'none';
});
// minimize menu (button not shown, press insert to minimize)
const minimizeButton = document.createElement('button');
minimizeButton.className = 'minimize-button';
minimizeButton.textContent = '';
containerz.appendChild(minimizeButton);
minimizeButton.addEventListener('click', () => {
    containerz.style.display = 'none';
});


const inputs = [ // inputs
    { placeholder: 'Fake likes', action: setFakeLikes },
    { placeholder: 'Fake subs', action: setFakeSubs },
    { placeholder: 'Fake views', action: setFakeViews },
    { placeholder: 'Change Title', action: setChangeTitle },
    { placeholder: 'Change ChannelName', action: setFakeName },
    { placeholder: 'Change Playbackspeed', action: setPlaybackSpeed },
    { placeholder: 'Fake Description', action: setDesc },
    { placeholder: 'Fake CommentPinner', action: setPinner },
    { placeholder: 'Change volume', action: setVolume },
    { placeholder: 'Video Height', action: setHeight },
    { placeholder: 'Video Width', action: setWidth },
    { placeholder: 'Video Duration', action: setDuration },
    { placeholder: 'Set TimeWatched (seconds)', action: setTime },
    { placeholder: 'Set SearchPlaceholder', action: setSearch },
    { placeholder: 'Change Comment Text (your comment)', action: setComment },
    { placeholder: 'Change Quality (Your selection needs to be an option in the quality tab)', action: setQuality },
    { placeholder: 'Change PFP link', action: setPfp },
    { placeholder: 'Change Watermark Link', action: setWatermark },
    { placeholder: 'Change Countrycode', action: setCountryCode }
];

function createInputButton(inputConfig) { // creating input buttons
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = inputConfig.placeholder;
    containerz.appendChild(input);

    const button = document.createElement('button');
    button.textContent = `Set ${inputConfig.placeholder.split(' ')[1]}`;
    containerz.appendChild(button);

    button.addEventListener('click', () => {
        inputConfig.action(input.value);
    });
}

function createToggleButton(label, enableFunction, disableFunction) { // creating toggles
    const togglecontainerz = document.createElement('div');
    togglecontainerz.style.marginTop = '10px';
    containerz.appendChild(togglecontainerz);

    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    labelElement.style.marginRight = '10px';
    togglecontainerz.appendChild(labelElement);

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'OFF';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.cursor = 'pointer';
    togglecontainerz.appendChild(toggleButton);
    let isToggled = false;
    if (getCookie("alwaysClosed") == "true" && label == "Dont open every time") {
        isToggled = true;
        toggleButton.textContent = 'ON';
        toggleButton.style.backgroundColor = '#6B3EFF';
    }

    toggleButton.addEventListener('click', () => {
        isToggled = !isToggled;
        toggleButton.textContent = isToggled ? 'ON' : 'OFF';
        toggleButton.style.backgroundColor = isToggled ? '#6B3EFF' : '';

        if (isToggled) {
            enableFunction();
        } else {
            disableFunction();
        }
    });
}
const $e = (el) => document.querySelector(el);
  const $id = (el) => document.getElementById(el);
  const $qa = (el) => document.querySelectorAll(el);
  const $ce = (el) => document.createElement(el);
  const $sp = (el, pty) => document.documentElement.style.setProperty(el, pty);
  const $ac = (el) => document.body.appendChild(el);

const Adblock = () => {
    const scrub = document.querySelector('.ytp-fine-scrubbing')
    const player = document.querySelector('#movie_player')
    const adyesno = player.classList.contains('ad-showing')
    const vid = player.querySelector('video.html5-main-video')
    if (adyesno) {
        const skip = document.querySelector(`
            .ytp-skip-ad-button,
            .ytp-ad-skip-button,
            .ytp-ad-skip-button-modern,
            .ytp-ad-survey-answer-button
        `)
        if (skip) {
            skip.click()
            skip.remove()
        }
        else if (vid && vid.src) {
            vid.currentTime = 9999999999;
        }
    }
    const adSelectors = [
        '.ytp-ad-module',
        '.ytp-ad-text',
        '.ad-interrupting',
        '.video-ads',
        '.ytp-ad-image-overlay'
    ];

    const links = [
        'about:blank'
    ];

    const skipButton = document.querySelector('.ytp-ad-skip-button');
    if (skipButton) skipButton.click();

    adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(ad => {
            ad.currentTime = ad.duration;
        });
    });

function checkAndSkipAd() {
    const adBadge = document.querySelector('.ad-simple-attributed-string.ytp-ad-badge__text#ad-simple-attributed-string\\:a[aria-label="Sponsored"]');

    if (adBadge) {
        const vid = document.querySelector('video');
        if (vid) {
            vid.currentTime = vid.duration;
            console.log('Ad detected and ad skipped.');
        }
    }
}

const observer = new MutationObserver(() => {
    checkAndSkipAd();
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});

checkAndSkipAd();

};



const reenableAds = () => {
    const skipButton = document.querySelector('.ytp-ad-skip-button');
    if (skipButton) skipButton.style.display = 'block';

    const overlayAd = document.querySelector('.ytp-ad-overlay-slot');
    if (overlayAd) overlayAd.style.display = 'block';

    const bannerAd = document.querySelector('.ytp-ce-element');
    if (bannerAd) bannerAd.style.display = 'block';

    const adFrame = document.querySelector('iframe[src*="ads"]');
    if (adFrame) adFrame.style.display = 'block';

    const adSelectors = [
        '.ytp-ad-player-overlay',
        '.ytp-ad-module',
        '.ytp-ad-text',
        '.ad-interrupting',
        '.video-ads',
        '.ytp-ad-image-overlay'
    ];

    adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(ad => {
            ad.style.display = 'block';
        });
    });
    const originalFetch = window.fetch;
    window.fetch = originalFetch;

    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = originalXhrOpen;
};

createToggleButton('Toggle YouTube Ad Blocker', Adblock, reenableAds);
 // ad block

createToggleButton('Toggle Mute', // mute button, emulates the M key press
    () => {
        const keyEvent = new KeyboardEvent('keydown', {
            key: 'm',
            code: 'KeyM',
            keyCode: 77,
            which: 77,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyEvent);
    },
    () => {
        const keyEvent = new KeyboardEvent('keydown', {
            key: 'm',
            code: 'KeyM',
            keyCode: 77,
            which: 77,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyEvent);
    }
);


createToggleButton('Dont open every time',
    () => {
       setCookie("alwaysClosed", "true");
    },
    () => {
       setCookie("alwaysClosed", "false");
    }
);

// createToggleButton('Place Holder',
//    () => {
//
//    },
//    () => {
//
//    }
// );

createToggleButton('Hide comments', // toggles comments
    () => {
       const comments = $id('comments');
       if (comments) {
      comments.style.display = 'none';
      }
    },
    () => {
        const comments = $id('comments');
       if (comments) {
      comments.style.display = 'block';
      }
    }
);


createToggleButton('Hide sidebar', // toggles the sidebar
    () => {
       const sidebar = $id('secondary');
       if (sidebar) {
      sidebar.style.display = 'none';
      }
    },
    () => {
        const sidebar = $id('secondary');
       if (sidebar) {
      sidebar.style.display = 'block';
      }
    }
);

createToggleButton('Toggle autoplay', // toggles autoplay
    () => {
    const autoplay = $e('.ytp-autonav-toggle-button');
    if (autoplay) {
        autoplay.click();
      }
    },
    () => {
        const autoplay = $e('.ytp-autonav-toggle-button');
    if (autoplay) {
        autoplay.click();
      }
    }
);

createToggleButton('Oneko', // toggles oneko
    () => {
    (function oneko() {
    // smoother oneko by theyhoppingonme
    const nekoEl = document.createElement("div");
    let nekoPosX = 32;
    let nekoPosY = 32;
    let mousePosX = 0;
    let mousePosY = 0;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleAnimationFrame = 0;
    let lastTime = 0;
    let spriteUpdateTimer = 0;
    const nekoSpeed = 100; // pixels per second
    const spriteUpdateInterval = 50; // milliseconds between sprite frames
    const spriteSets = {
        idle: [[-3, -3]],
        alert: [[-7, -3]],
        scratch: [
            [-5, 0],
            [-6, 0],
            [-7, 0],
        ],
        tired: [[-3, -2]],
        sleeping: [
            [-2, 0],
            [-2, -1],
        ],
        N: [
            [-1, -2],
            [-1, -3],
        ],
        NE: [
            [0, -2],
            [0, -3],
        ],
        E: [
            [-3, 0],
            [-3, -1],
        ],
        SE: [
            [-5, -1],
            [-5, -2],
        ],
        S: [
            [-6, -3],
            [-7, -2],
        ],
        SW: [
            [-5, -3],
            [-6, -1],
        ],
        W: [
            [-4, -2],
            [-4, -3],
        ],
        NW: [
            [-1, 0],
            [-1, -1],
        ],
    };

    function create() {
        nekoEl.id = "oneko";
        nekoEl.style.width = "32px";
        nekoEl.style.height = "32px";
        nekoEl.style.position = "fixed";
        nekoEl.style.backgroundImage = "url('https://github.com/adryd325/oneko.js/blob/main/oneko.gif?raw=true')";
        nekoEl.style.imageRendering = "pixelated";
        nekoEl.style.left = "16px";
        nekoEl.style.top = "16px";
        nekoEl.style.zIndex = "999999";
        nekoEl.style.pointerEvents = "none";

        document.body.appendChild(nekoEl);

        document.onmousemove = (event) => {
            mousePosX = event.clientX;
            mousePosY = event.clientY;
        };

        requestAnimationFrame(frame);
    }

    function setSprite(name, frame) {
        const sprite = spriteSets[name][frame % spriteSets[name].length];
        nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${
            sprite[1] * 32
        }px`;
    }

    function resetIdleAnimation() {
        idleAnimation = null;
        idleAnimationFrame = 0;
    }

    function idle(deltaTime) {
        idleTime += deltaTime;

        if (
            idleTime > 10000 &&
            Math.floor(Math.random() * 200) == 0 &&
            idleAnimation == null
        ) {
            idleAnimation = ["sleeping", "scratch"][
                Math.floor(Math.random() * 2)
            ];
        }

        switch (idleAnimation) {
            case "sleeping":
                if (idleAnimationFrame < 8) {
                    setSprite("tired", 0);
                    break;
                }
                setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
                if (idleAnimationFrame > 192) {
                    resetIdleAnimation();
                }
                break;
            case "scratch":
                setSprite("scratch", idleAnimationFrame);
                if (idleAnimationFrame > 9) {
                    resetIdleAnimation();
                }
                break;
            default:
                setSprite("idle", 0);
                return;
        }
        idleAnimationFrame += 1;
    }

    function frame(currentTime) {
        if (lastTime === 0) {
            lastTime = currentTime;
        }

        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        frameCount += 1;
        spriteUpdateTimer += deltaTime;

        const diffX = nekoPosX - mousePosX;
        const diffY = nekoPosY - mousePosY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        if (distance < 48) {
            idle(deltaTime);
            requestAnimationFrame(frame);
            return;
        }

        idleAnimation = null;
        idleAnimationFrame = 0;

        if (idleTime > 1000) {
            setSprite("alert", 0);
            // count down after being alerted before moving
            idleTime = Math.min(idleTime, 7000);
            idleTime -= deltaTime;
            requestAnimationFrame(frame);
            return;
        }

        let direction = diffY / distance > 0.5 ? "N" : "";
        direction += diffY / distance < -0.5 ? "S" : "";
        direction += diffX / distance > 0.5 ? "W" : "";
        direction += diffX / distance < -0.5 ? "E" : "";

        if (spriteUpdateTimer >= spriteUpdateInterval) {
            setSprite(direction, Math.floor(frameCount / 8));
            spriteUpdateTimer = 0;
        }

        const moveDistance = (nekoSpeed * deltaTime) / 1000;
        const moveX = (diffX / distance) * moveDistance;
        const moveY = (diffY / distance) * moveDistance;

        if (Math.abs(moveX) < Math.abs(diffX)) {
            nekoPosX -= moveX;
        }
        if (Math.abs(moveY) < Math.abs(diffY)) {
            nekoPosY -= moveY;
        }

        const easingFactor = Math.min(distance / 200, 1); // Slow down when close
        nekoPosX = nekoPosX - (nekoPosX - (nekoPosX - moveX)) * easingFactor;
        nekoPosY = nekoPosY - (nekoPosY - (nekoPosY - moveY)) * easingFactor;

        // Update position with sub-pixel precision
        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;

        requestAnimationFrame(frame);
    }

    create();
})();
    },
    () => {
        document.querySelector("div#oneko").remove();
    }
);

createToggleButton('Toggle subtitles', // toggles subtitles
    () => {
          const subtitles = $e('.ytp-subtitles-button');
    if (subtitles) {
        subtitles.click();
      }
    },
    () => {
        const subtitles = $e('.ytp-subtitles-button');
    if (subtitles) {
        subtitles.click();
      }
    }
);
 createToggleButton('Hide channel watermark',
   () => {
    const watermark = $e('img.branding-img.iv-click-target[aria-label="Channel watermark"][width="40"][height="40"]');
     watermark.style.display = 'none';

   },
    () => {
      const watermark = $e('img.branding-img.iv-click-target[aria-label="Channel watermark"][width="40"][height="40"]');
      watermark.style.display = 'block';
     }
);
createToggleButton('Make everything editable', // makes everything editable
    () => {
       const allElements = document.querySelectorAll('*');
allElements.forEach(element => {
  const isNormallyEditable = ['input', 'textarea', 'select'].includes(element.tagName.toLowerCase());
  if (!isNormallyEditable) {
    if (!element.hasAttribute('contenteditable')) {
        if (element.textContent != "OFF") {
      element.setAttribute('contenteditable', 'true');
      element.setAttribute('data-not-normally-editable', 'true');
        }
    }
  } else {
    element.setAttribute('contenteditable', 'true');
  }
});
    },
    () => {
        const allElements = document.querySelectorAll('*');
allElements.forEach(element => {
  if (element.hasAttribute('data-not-normally-editable')) {
    element.setAttribute('contenteditable', 'false');
    element.removeAttribute('data-not-normally-editable');
  } else {
    element.setAttribute('contenteditable', 'false');
  }
});
    }
);

function waitForElement(selector, callback) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            callback(element);
        }
    }, 100);
}

function setQuality(value) { // set quality
    waitForElement('.ytp-settings-button', settingsButton => {
        settingsButton.click();
        waitForElement('.ytp-panel-menu .ytp-menuitem:last-child', qualityMenu => {
            qualityMenu.click();
            waitForElement('.ytp-quality-menu .ytp-menuitem', () => {
                const qualityOptions = [...document.querySelectorAll('.ytp-quality-menu .ytp-menuitem')];
                const targetOption = qualityOptions.find(option => option.innerText.includes(value) && !option.innerText.toLowerCase().includes('enhanced')) ||
                                     qualityOptions.find(option => !option.innerText.toLowerCase().includes('enhanced')) ||
                                     qualityOptions[0];
                targetOption.click();
            });
        });
    });
}

function setCountryCode(value) { // set country code
    const countrycode = $e("span#country-code");
    if (countrycode) {
        countrycode.textContent = value;
    }
}
createToggleButton(
    'Toggle subscription',
    () => {
        const subscribeButton = document.querySelector('.yt-spec-button-shape-next.yt-spec-button-shape-next--filled.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m');

        if (subscribeButton) {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            subscribeButton.dispatchEvent(clickEvent);
        } else {
            console.error('Subscribe button not found');
        }
    },
    () => {
        const unsubscribeButton = document.querySelector(
            'button[aria-label="Unsubscribe"].yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--size-m'
        );

        if (unsubscribeButton) {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            unsubscribeButton.dispatchEvent(clickEvent);
        } else {
            console.error('Unsubscribe button not found, creating it...');

            const button = document.querySelector(
                'button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading-trailing'
            );
            button.click();

            const observerz = new MutationObserver((mutationsList) => {
                mutationsList.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.textContent === 'Unsubscribe') {
                            node.click();
                            observerz.disconnect();
                        }
                    });
                });
            });

            observerz.observe(document.body, {
                childList: true,
                subtree: true
            });

            console.log("Step 1 success!");

                const cancelButton = document.querySelector(
                    'button.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m[aria-label="Cancel"]'
                );

                if (cancelButton) {
                    cancelButton.click();
                    console.log("Unsubscribe button created!");

                    if (unsubscribeButton) {
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        unsubscribeButton.dispatchEvent(clickEvent);
                    } else {
                        console.error('Failed to find unsubscribe button after cancel.');
                    }
                }
        }
    }
);

createToggleButton('Hide the game',
    () => {
        const game = document.querySelector("ytd-rich-metadata-renderer.style-scope.ytd-rich-metadata-row-renderer");
        game.style.display = "none";
    },
    () => {
        const game = document.querySelector("ytd-rich-metadata-renderer.style-scope.ytd-rich-metadata-row-renderer");
        game.style.display = "block";
    }
);


createToggleButton('Hide the topic',
    () => {
        const game = document.querySelector('ytd-rich-metadata-renderer.style-scope.ytd-rich-metadata-row-renderer[component-style="RICH_METADATA_RENDERER_STYLE_TOPIC"]');
        game.style.display = "none";
    },
    () => {
        const game = document.querySelector('ytd-rich-metadata-renderer.style-scope.ytd-rich-metadata-row-renderer[component-style="RICH_METADATA_RENDERER_STYLE_TOPIC"]');
        game.style.display = "block";
    }
);

createToggleButton('Disable video overlay (when watching video) (will reload when disabled)', // disable video overlay
    () => {
    const videooverlay = document.querySelectorAll('#mouseover-overlay, #hover-overlays, #overlays');
    videooverlay.forEach(el => el.remove());
    },
    () => {
        location.reload();
    }
);

createToggleButton('Paused', // pausing, self explainitory
    () => {
        const video = document.querySelector('video');
	video.pause();
    },
    () => {
        const video = document.querySelector('video');
	video.play();
    }
);
// age bypass
    let originalContent = null;
    let enabled = false;
    createToggleButton("Toggle Age Verification Bypass", () => {
        const ageGateContent = document.getElementById("watch7-player-age-gate-content");
        const playerApi = document.getElementById("player-api");
        const playerUnavailable = document.getElementById("player-unavailable");

        if (!ageGateContent || !playerApi || !playerUnavailable) return;
        if (!originalContent) originalContent = playerUnavailable.innerHTML;

        const urlParams = new URLSearchParams(window.location.search);
        let videoId = urlParams.get("v");
        if (!videoId) return;

        playerApi.remove();
        const playerFrame = document.createElement("iframe");
        playerFrame.setAttribute("src", `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&showinfo=0`);
        playerFrame.setAttribute("id", "player-frame");
        playerFrame.setAttribute("style", "position:absolute; z-index:99999; width:100%; height:100%;");

        playerUnavailable.innerHTML = "";
        playerUnavailable.appendChild(playerFrame);

        (function interceptXHR() {
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                if (url.includes("/youtubei/v1/player")) {
                    this.addEventListener("readystatechange", function() {
                        if (this.readyState === 4 && this.status === 200) {
                            try {
                                const response = JSON.parse(this.responseText);
                                if (response.playabilityStatus?.status === "AGE_RESTRICTED") {
                                    response.playabilityStatus.status = "OK";
                                    response.playabilityStatus.reason = "";
                                    Object.defineProperty(this, "responseText", { value: JSON.stringify(response) });
                                }
                            } catch (e) {}
                        }
                    });
                }
                return originalOpen.apply(this, arguments);
            };
        })();

        const observer = new MutationObserver(() => {
            if (document.querySelector("ytd-watch-flexy[is-restricted]")) {
                injectOverrideScript();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        function injectOverrideScript() {
            const script = document.createElement("script");
            script.innerHTML = `
                (function() {
                    if (window.ytPlayerConfig && window.ytPlayerConfig.args) {
                        window.ytPlayerConfig.args.raw_player_response.playabilityStatus.status = 'OK';
                    }
                })();
            `;
            document.body.appendChild(script);
            script.remove();
        }
    }, () => {
        const playerUnavailable = document.getElementById("player-unavailable");
        if (originalContent) playerUnavailable.innerHTML = originalContent;
    });

// fake likes, finally fixed it (i was a bit lazy)
function setFakeLikes(value) {
  const likes = $e("button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading.yt-spec-button-shape-next--segmented-start.yt-spec-button-shape-next--enable-backdrop-filter-experiment");
  if (likes) {
   const likecontent = likes.querySelector("div.yt-spec-button-shape-next__button-text-content");
   if (likecontent) {
      likecontent.textContent = value;
   }
  }
}
// playbackspeed
function setPlaybackSpeed(value) {
    const video = document.querySelector("video");
    video.playbackRate = value;
}
// comment
function setComment(value) {
    const Comment = $e("div#contenteditable-root.style-scope.yt-formatted-string")
    Comment.firstChild.nodeValue = value;
}
// channel watermark
function setWatermark(value) {
    const watermark = $e('img.branding-img.iv-click-target[aria-label="Channel watermark"][width="40"][height="40"]');
    watermark.src = value;
}
// set pfp
function setPfp(value) {
    const pfp = $e('img#img.style-scope.yt-img-shadow[draggable="false"][alt=""][width="40"]');
    if (pfp) {
        pfp.src = value;
    } else {
        console.error("not found");
    }
}
// set volume
    let audioContext;
    let gainNode;

function setVolume(value) {
    const vid5 = document.querySelector("video");
    if (!audioContext) {
        audioContext = new AudioContext();
    }

    if (!gainNode) {
        gainNode = audioContext.createGain();
        const source = audioContext.createMediaElementSource(vid5);
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
    }
    gainNode.gain.value = value;
}
// desc
function setDesc(value) {
    // Select all the spans that contain the relevant links and styles
const elements = document.querySelectorAll(
  'span.yt-core-attributed-string--link-inherit-color[dir="auto"][style*="color: rgb"]'
);

// Iterate through the found elements
elements.forEach((element) => {
      element.textContent = value;
  const link = element.querySelector('a');
  link.remove();
});
}
//fake subs
function setFakeSubs(value) {
    const subsElement = document.getElementById('owner-sub-count');
    if (subsElement) subsElement.textContent = value;
}

//fake pin
function setPinner(value) {
    const pinner = document.querySelector('yt-formatted-string#label.style-scope.ytd-pinned-comment-badge-renderer');

if (pinner && pinner.id === 'label') {
    pinner.textContent = value;
} else {
    console.log('404');
}

}
// fake views
function setFakeViews(value) {
    const viewsElement = document.getElementsByClassName('style-scope yt-formatted-string bold');
    if (viewsElement) viewsElement[0].textContent = value;
}
// search placeholder
function setSearch(value) {
const searchInput = document.querySelector('.ytSearchboxComponentInput.yt-searchbox-input.title');
if (searchInput) {
    searchInput.placeholder = value;
 }
}
// width
function setWidth(value) {
    const width = document.querySelector('video');
    if (width) width.style.width = value + 'px';
}
//height
function setHeight(value) {
    const height = document.querySelector('video');
    if (height) height.style.height = value + 'px';
}
//duration
function setDuration(value) {
    const duration = document.getElementsByClassName("ytp-time-duration");
    const duration2 = document.querySelector('span[class="ytp-time-duration"]')
    duration.value = value;
    duration.textContent = value;
    duration2.textContent = value;
}
//Time watched
function setTime(value) {
    const time = document.querySelector("video");
    time.currentTime = value;
}
//fake name
function setFakeName(value) {
   const nameElement = document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string[spellcheck="false"]');

if (nameElement) {
    nameElement.textContent = value;
} else {
    console.log("Element not found");
	}
}
// title changer
function setChangeTitle(value) {
const titleElement = document.querySelector('h1.style-scope.ytd-watch-metadata yt-formatted-string');

if (titleElement) {
    titleElement.textContent = value;
}
}

inputs.forEach(createInputButton);
// dragging script
let isDragging = false;
let offsetX, offsetY;
// minimizing
containerz.addEventListener('mousedown', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
        isDragging = true;
        offsetX = e.clientX - containerz.getBoundingClientRect().left;
        offsetY = e.clientY - containerz.getBoundingClientRect().top;
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        containerz.style.left = `${e.clientX - offsetX}px`;
        containerz.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

let isVisible = true;
document.addEventListener('keydown', (e) => {
    if (e.key === 'Insert') {
        if (isVisible) {
            containerz.style.display = 'none';
        } else {
            containerz.style.display = 'block';
        }
        isVisible = !isVisible;
    }
});

function wait() {
    setTimeout(function() {
        document.title = `YouTube (AYG V${version})`;
    }, 1000);
}

wait();

    if (getCookie("alwaysClosed") === "true") {
        containerz.style.display = 'none';
        isVisible = false;
    }
        setMaxExpiryCookie("alwaysClosed");
}
    // made by theyhoppingonme on discord
}, 1);
})();