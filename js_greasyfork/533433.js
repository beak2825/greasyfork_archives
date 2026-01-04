// ==UserScript==
// @name         TEST Dollar Sale Navigator
// @namespace    dollar.sale
// @version      10.0.5
// @description  Navigate through a list of bazaar links with a floating menu in Torn City
// @author       Skarr02 [3462286]
// @license      Private to Skarr02 [3462286] – cannot be used or duplicated in any form
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533433/TEST%20Dollar%20Sale%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/533433/TEST%20Dollar%20Sale%20Navigator.meta.js
// ==/UserScript==


(() => {
    'use strict';

    if (typeof GM === 'undefined') window.GM = {};
    if (!GM.addStyle) {
        GM.addStyle = css => {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        };
    }

    const userIds = [
  3445243, 2693254, 1145056, 1636350, 2668560, 1853324, 2263400, 3182441, 2541678,
  3237207, 2321305, 3244939, 3444185, 3369647, 3338586, 3484482, 3304959, 2203576,
  2812113, 3400186, 2962007, 3394866, 2459465, 2352900, 3198458, 2334174, 3392180,
  3468210, 3466754, 1821105, 2700933, 3259246, 360330, 2332873, 3455398, 3528214,
  2649236, 3621114, 3570456, 3385583, 3390097, 3327900, 3504237, 3474044, 3480404,
  3249592, 3187441, 3284969, 3493798, 333493, 3372209, 2215721, 3443006, 3325064,
  3306975, 3488406, 2018311, 1441750, 3615849, 1826175, 2759415, 3561791, 2373781,
  3617287, 3351015, 1403609, 2865837, 3588663, 3455607, 3303003, 3532830, 286232,
  2601828, 3661330, 3484674, 3665796, 3200247, 3108759, 3220837, 3571449, 2656557,
  3357431, 3424078, 3603393, 1496324, 3347008, 2176411, 2418443, 3060802, 1010587,
  3476656, 3192720, 3399085, 3555668, 2561006, 830027, 2718606, 2676295, 3499388,
  3554441 // Replace with actual IDs
    ];

    const links = userIds.map(id => `https://www.torn.com/bazaar.php?userId=${id}`);

    let index = +localStorage.getItem('bazaarLinkIndex') || 0;
    if (index >= links.length) index = 0;

    GM.addStyle(`
        #bazaarNavFloat {
            z-index: 999999;
            position: fixed;
            bottom: 80px;
            right: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: linear-gradient(135deg, #f9d835, #f1b600);
            color: #222;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 14px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.25);
            overflow: hidden;
            user-select: none;
        }

        #bazaarNavFloat button {
            background: linear-gradient(180deg, #fff799 0%, #ffd700 100%);
            border: 1px solid #b38f00;
            padding: 8px 16px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            width: 100%;
            color: #333;
            text-shadow: 0 1px 1px #fff;
            transition: background 0.3s;
        }

        #bazaarNavFloat button:hover {
            background: linear-gradient(180deg, #ffe066 0%, #ffcc00 100%);
        }

        #bazaarCounter {
            padding: 10px 14px;
            background: #fff2b0;
            color: #000;
            width: 100%;
            text-align: center;
            border-bottom: 1px solid #e6c200;
            position: relative;
        }

        #bazaarCounter::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 0%;
            background: #3399ff; /* 🔵 blue loading bar */
            transition: width 0s;
        }

        #bazaarCounter.loading::after {
            width: 100%;
            transition: width 3s linear;
        }

        @media screen and (max-width: 1000px) {
            #bazaarNavFloat {
                bottom: 140px;
            }
        }
    `);

    const container = document.createElement('div');
    container.id = 'bazaarNavFloat';

    const counter = document.createElement('div');
    counter.id = 'bazaarCounter';
    counter.textContent = `${index + 1} / ${links.length}`;

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.onclick = () => {
        index = (index + 1) % links.length;
        localStorage.setItem('bazaarLinkIndex', index);
        counter.textContent = `${index + 1} / ${links.length}`;
        window.location.href = links[index];
    };

    let pressTimer;

    const jumpToFirstLink = () => {
        index = 0;
        localStorage.setItem('bazaarLinkIndex', index);
        counter.textContent = `${index + 1} / ${links.length}`;
        counter.classList.remove('loading');
        window.location.href = links[0];
    };

    const startHold = () => {
        counter.classList.add('loading');
        pressTimer = setTimeout(jumpToFirstLink, 3000);
    };

    const clearHold = () => {
        counter.classList.remove('loading');
        clearTimeout(pressTimer);
    };

    // Long press detection
    counter.addEventListener('mousedown', startHold);
    counter.addEventListener('mouseup', clearHold);
    counter.addEventListener('mouseleave', clearHold);
    counter.addEventListener('touchstart', startHold);
    counter.addEventListener('touchend', clearHold);
    counter.addEventListener('touchcancel', clearHold);

    container.append(counter, nextBtn);
    document.body.appendChild(container);
})();