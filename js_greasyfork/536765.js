// ==UserScript==
// @name         Duolingo Blur
// @description  Blur the text unless shift is held
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @author       You
// @match        https://www.duolingo.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536765/Duolingo%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/536765/Duolingo%20Blur.meta.js
// ==/UserScript==

const duoBlurClass = 'duo-blur'

const startLessonButtons = [
    '_1rcV8 _1VYyp _1ursp _7jW2t PbV1v _2sYfM _19ped', // start lesson
    '_1rcV8 _1VYyp _1ursp _7jW2t _2CzYJ _2JGBA _1A_ri', // complete legendary
]

const skipDataTests = [
    'session-duo',
    'session-complete-slide',
    'daily-quest-progress-slide',
    'daily-quest-reward-slide',
]

const style = document.createElement('style');
style.textContent = `
    .duo-blur .XxgPa {
        filter: blur(6px);
    }
`;
document.head.appendChild(style);
document.body.classList.add(duoBlurClass)

let hideBlurOverride = false;
let disableBlur = false;

function setBlurEnabled(blurEnabled) {
    const enabled = blurEnabled && !disableBlur
    if (enabled && !document.body.classList.contains(duoBlurClass)) {
        document.body.classList.add(duoBlurClass);
    } else if (!enabled && document.body.classList.contains(duoBlurClass)) {
        document.body.classList.remove(duoBlurClass);
    }
}

function setShiftDown(shiftDown) {
    setBlurEnabled(!shiftDown);
    hideBlurOverride = shiftDown;
}

document.addEventListener('keydown', e => {
    if (e.key === 'Shift') {
        setShiftDown(true);
        hideBlurOverride = true;
    } else if (e.key === "F8" ) {
        disableBlur = !disableBlur
        setShiftDown(false);
    } else if (e.key === 'Enter') {
        if (location.href === 'https://www.duolingo.com/learn') {
            for (const btn of document.getElementsByClassName('_1gEmM _7jW2t _1333i _22TV_ _3Jm09')) {
                const sibling = btn.parentElement.querySelector('div._36bu_')
                if (sibling && sibling.textContent.trim() === 'START') {
                    btn.click()
                    break
                }
            }
        }

        for (const className of startLessonButtons) {
            document.getElementsByClassName(className)[0]?.click()
        }
    }
});
document.addEventListener('keyup', e => {
    if (e.key === 'Shift') {
        setShiftDown(false);
    }
});

function hasSpeakerButton() {
    return !!document.getElementsByClassName('_1OCYa').length
}

function shouldSkipScreen() {
    for (const dataTest of skipDataTests) {
        if (document.querySelector(`[data-test="${dataTest}"]`)) {
            return true
        }
    }

    return false
}

function clickNext() {
    document.querySelector('[data-test="player-next"]')?.click()
}

function onTimer() {
    if (!hideBlurOverride) {
        setBlurEnabled(hasSpeakerButton());
    }

    if (shouldSkipScreen()) {
        clickNext()
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) setShiftDown(false);
});

window.addEventListener('blur', () => {
    setShiftDown(false);
});

setInterval(onTimer, 50)

window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        location.href = location.href;
    }
}, true); // useCapture = true