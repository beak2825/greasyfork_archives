// ==UserScript==
// @name         Unhide eNotes
// @namespace    https://naeembolchhi.github.io/
// @version      0.53
// @description  Unhide eNotes answers and articles!
// @author       NaeemBolchhi
// @license      GPL-3.0-or-later
// @match        https://www.enotes.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAkBQTFRF/////vz8+Ojl8tPP67qy46CV45+U5aed67y089XQ+ero//7++ezp6rau13VlzldEyEMtxz4oyUQvz1lG2Xxt7Ly1+Obj9uDd5aWbz1tIyEAqzlZD4ZiM+ejm/ff2562kzlVBxz8p0V9N7cK7/vz7+u7s3Yh6ykgzykg0/fj4/vv64ZeLyEEr3IV36bOq5KGW4ZaKykcyykk02Xts/fn47L620mJRy0w48c7J6K6kyEIt8c/K5aaczVM/z1pH+Ofk8tPOy0s21Wtb+u/u9t/b0F1L24N1/Pb11nBg3o2B/fb19NrWzVI+78nD6rat1W1c/PPx67uzyEIs13Rk02VUy0s389bRyUUv7sS93Yp93Yt+24R2y0o19NjT1GlY0F5M+u/t5KKX8tDL5qie8tHL56yj6rWt8MzG9+LfzVE94JOH4JSH/PPy0mJQzE465qmf6rev0FtJ02ZU1W5e0WFP+/LwzlhF+OnmyEEszVRA+evp8tLN//395KOY78fBx0Aq78fA9dvXy0o20mVT02hX4pyR9d3Zy0w31W9e/PXz/v382n9w/fj3/PX09NfS7sa//ff335GF0V9My005+/Dv+/Lx1Wxc24Fz8MrE0FtI7sO99+Pfz1hFzFA8/vr58tLM2XprzE874JKG7sW++u3r+OXi7cG63Yp8zE050WBO1Gxc8c/J02dW2Hhp9dzY+uzq0F1K6LGo//7956uh02dVyUUw02ZV5qqg1nNjzlRB0mRS2n5w6K6l8tHM9+Th/PTz2w06LAAAAlBJREFUeJxjYBgFo2DYA0YmZhZWNjZ2Dk4ubjK08/Dy8QsIgoGQsIioGGlmcItLSAoiAylpGVkS9MvJKwiiA0UlZRVi9auqCcD1qSvCmRrsmsTp19LWgWqR1mXT0zfgM4RyjTiI028gBVFvzAkVMTE1g4iYWxBjgKUVxHZrJDFGG1uwoJ09Yf0OjuBQd3JGFXZxBZvgRjAg3T3ACj290CW8fcBJwpeQAX7gAPAPwJQJDALJBJvg1x8QAlIVGoZFyoQPJBVujUUKCUSAYzASa7r1FQLJReE3IBqkJiYWq5xcHEgyPgGffi5hkBoPLeyyieBg5MQuCQFJ4DScjEM2BSybis+ANJAKnXQcshmZIOksfAZkg1T4ZOCQzckFSfPhM0AEpCIvvwA74C0ESRdhpDEkUIxRDGCCklIKDSgrp9AAaXw5MhikoqJSGh/wr8JjQCTIgMpqe3ygqgaPAbXgWHDBo4IAqKsHGiDVQL4BjU0gJySSb4B7M8iAFnfyTWgFGUC43MIN2tpBJnR0km1AVzfIACkb7LI9vYRN6AM7wbAfm9yEiZPaCBrALQNOr5NrMaWmAF1nS7humjoNkuSn56BJzJgJEnacRdCE2XMgJszVm4cQ1Jq/AFLjShORTBuloflu4aLFS0ACS5ctXwEVmtNIWD+wHlyJlHsXqiNxVjERo5+Be/UaRUEsIGjtOqL0A8H61g0Y2uvjNxKRDGBg05LNW7Yiaw/fth1fQYINdDqw7XC1bQKCnbt279mLHqvEuUN1XyMQLN1PjuZRMAqGFAAAQRCVzMZUEeAAAAAASUVORK5CYII=
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444802/Unhide%20eNotes.user.js
// @updateURL https://update.greasyfork.org/scripts/444802/Unhide%20eNotes.meta.js
// ==/UserScript==

const location = window.location.href;

function addStyle() {
    let style = document.createElement('style');
    style.setAttribute('type','text/css');
    style.innerHTML = `* {
        color: initial;
        text-shadow: none;
        filter: initial;
        -webkit-user-select: initial;
        -moz-user-select: initial;
        -ms-user-select: initial;
        user-select: initial;
        pointer-events: initial;
        cursor: auto;
    }
    *[href], *[href] *, *[href] * *, *[href] * * * {
        cursor: pointer;
    }
    .u-paywall, .u-paywall > p {
        line-height: 1.77;
        font-family: "HCo Ideal Sans SSm", verdana, sans-serif;
        font-size: var(--font-size-s, 18px);
    }
    .u-paywall * + * {
        margin-top: 20px;
    }
    #enotes-paywall, .u-align--center.u-padding--and-half--top.u-font--s, .tonottobe {
        display: none;
    }`.replace(/\;/g,' !important;');
    document.head.appendChild(style);
}

function removeStuff() {
    let ads = document.querySelectorAll(`*[id*='-ad-']`);

    for (let x = 0; x < ads.length; x ++) {
        ads[x].parentNode.classList.add('tonottobe');
    }
}

try {addStyle();} catch {}
try {removeStuff();} catch {}