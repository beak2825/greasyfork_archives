// ==UserScript==
// @name         Torn Racing Helper Selector
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically inserts recommended cars, highlights the best available match on the first page and explains the tiered matching criteria. Designed for web and TornPDA.
// @author       Rosti
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=racing*
// @match        https://www.torn.com/page.php?sid=racing*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543259/Torn%20Racing%20Helper%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/543259/Torn%20Racing%20Helper%20Selector.meta.js
// ==/UserScript==

//Updated to work on the changed url. page.php instead of loader.php

(function() {
    'use strict';

    const logPrefix = '[RacingHelper]';

    const globalRecords = {
        "Underdog": { car: "Edomondo NSX", oldCar: "Honda NSX", image: "https://www.torn.com/images/items/78/small.png" },
        "Withdrawal": { car: "Veloria LFA", oldCar: "Lexus LFA", image: "https://www.torn.com/images/items/522/small.png" },
        "Uptown": { car: "Stormatti Casteon", oldCar: "Bugatti Veyron", image: "https://www.torn.com/images/items/519/small.png" },
        "Parkland": { car: "Colina Tanprice", oldCar: "Ford Sierra Cosworth", image: "https://www.torn.com/images/items/511/small.png" },
        "Docks": { car: "Volt GT", oldCar: "Ford GT", image: "https://www.torn.com/images/items/85/small.png" },
        "Commerce": { car: "Edomondo NSX", oldCar: "Honda NSX", image: "https://www.torn.com/images/items/78/small.png" },
        "Two Islands": { car: "Edomondo NSX", oldCar: "Honda NSX", image: "https://www.torn.com/images/items/78/small.png" },
        "Industrial": { car: "Edomondo NSX", oldCar: "Honda NSX", image: "https://www.torn.com/images/items/78/small.png" },
        "Vector": { car: "Edomondo NSX", oldCar: "Honda NSX", image: "https://www.torn.com/images/items/78/small.png" },
        "Mudpit": { car: "Colina Tanprice", oldCar: "Ford Sierra Cosworth", image: "https://www.torn.com/images/items/511/small.png" },
        "Hammerhead": { car: "Edomondo NSX", oldCar: "Honda NSX", image: "https://www.torn.com/images/items/78/small.png" },
        "Sewage": { car: "Edomondo NSX", oldCar: "Honda NSX", image: "https://www.torn.com/images/items/78/small.png" },
        "Meltdown": { car: "Edomondo NSX", oldCar: "Honda NSX", image: "https://www.torn.com/images/items/78/small.png" },
        "Speedway": { car: "Stormatti Casteon", oldCar: "Bugatti Veyron", image: "https://www.torn.com/images/items/519/small.png" },
        "Stone Park": { car: "Echo R8", oldCar: "Audi R8", image: "https://www.torn.com/images/items/518/small.png" },
        "Convict": { car: "Stormatti Casteon", oldCar: "Bugatti Veyron", image: "https://www.torn.com/images/items/519/small.png" }
    };
    const forumPostGuide = {
        "Underdog": { car: "Edomondo NSX", oldCar: "Honda NSX", setup: "(SR) (T2)", image: "https://www.torn.com/images/items/78/small.png" },
        "Withdrawal": { car: "Veloria LFA", oldCar: "Lexus LFA", setup: "(LR) (T3)", image: "https://www.torn.com/images/items/522/small.png" },
        "Uptown": { car: "Lambrini Torobravo", oldCar: "Lamborghini Gallardo", setup: "(LR) (T3)", image: "https://www.torn.com/images/items/521/small.png" },
        "Parkland": { car: "Edomondo NSX", oldCar: "Honda NSX", setup: "(SR) (T3)", image: "https://www.torn.com/images/items/78/small.png" },
        "Docks": { car: "Volt GT", oldCar: "Ford GT", setup: "(LR) (T3)", image: "https://www.torn.com/images/items/85/small.png" },
        "Commerce": { car: "Edomondo NSX", oldCar: "Honda NSX", setup: "(SR) (T2)", image: "https://www.torn.com/images/items/78/small.png" },
        "Two Islands": { car: "Edomondo NSX", oldCar: "Honda NSX", setup: "(LR) (T3)", image: "https://www.torn.com/images/items/78/small.png" },
        "Industrial": { car: "Edomondo NSX", oldCar: "Honda NSX", setup: "(SR) (T3)", image: "https://www.torn.com/images/items/78/small.png" },
        "Vector": { car: "Edomondo NSX", oldCar: "Honda NSX", setup: "(SR) (T3)", image: "https://www.torn.com/images/items/78/small.png" },
        "Mudpit": { car: "Colina Tanprice", oldCar: "Ford Sierra Cosworth", setup: "(LR) (T3)", image: "https://www.torn.com/images/items/511/small.png" },
        "Hammerhead": { car: "Edomondo NSX", oldCar: "Honda NSX", setup: "(SR) (T2)", image: "https://www.torn.com/images/items/78/small.png" },
        "Sewage": { car: "Edomondo NSX", oldCar: "Honda NSX", setup: "(SR) (T2)", image: "https://www.torn.com/images/items/78/small.png" },
        "Meltdown": { car: "Edomondo NSX", oldCar: "Honda NSX", setup: "(SR) (T3)", image: "https://www.torn.com/images/items/78/small.png" },
        "Speedway": { car: "Veloria LFA", oldCar: "Lexus LFA", setup: "(LR) (T3)", image: "https://www.torn.com/images/items/522/small.png" },
        "Stone Park": { car: "Echo R8", oldCar: "Audi R8", setup: "(SR) (T3)", image: "https://www.torn.com/images/items/518/small.png" },
        "Convict": { car: "Mercia SLR", oldCar: "Mercedes SLR", setup: "(LR) (T3)", image: "https://www.torn.com/images/items/523/small.png" }
    };
    const personalRecords = {
        "Underdog": "Veloria LFA",
        "Withdrawal": "Edomondo NSX",
        "Uptown": "Lolo 458",
        "Parkland": "Edomondo NSX",
        "Docks": "Sturmfahrt 111",
        "Commerce": "Edomondo NSX",
        "Two Islands": "Edomondo NSX",
        "Industrial": "Volt RS",
        "Vector": "Edomondo NSX",
        "Mudpit": "Colina Tanprice",
        "Hammerhead": "Edomondo NSX",
        "Sewage": "Edomondo NSX",
        "Meltdown": "Edomondo NSX",
        "Speedway": "Veloria LFA",
        "Stone Park": "Echo R8",
        "Convict": "Mercia SLR"
    };
    let showPersonalRecords = false;


    // ---------- HELPERS ----------
    function normalise(str) {
        return str.toLowerCase()
                  .split(/[-_\s]+/)
                  .map(s => s.trim())
                  .filter(Boolean);
    }

    function getTrackSurface(trackName) {
        return ['Parkland', 'Two Islands', 'Mudpit', 'Hammerhead', 'Stone Park']
               .includes(trackName) ? 'dirt' : 'tarmac';
    }

    function getMatchingCriteria(trackName) {
        const guide = forumPostGuide[trackName];
        if (!guide) return null;

        const isDirt = getTrackSurface(trackName);
        const parts   = guide.setup.toLowerCase().replace(/[()]/g, '').split(/\s+/).filter(Boolean);
        const gearbox = parts.find(p => p === 'lr' || p === 'sr') || '';
        const turbo   = parts.find(p => p.startsWith('t')) || '';

        return {
            carName:       guide.car.toLowerCase(),
            trackSurface:  isDirt,
            gearbox,
            turbo
        };
    }

    // ---------- SCORING ----------
    function detectSurface(tokens, expected) {
        const dirtSet  = new Set(['d', 'dir', 'dirt']);
        const tarSet   = new Set(['t', 'tar', 'tarmac']);
        for (const t of tokens) {
            if (expected === 'dirt'  && dirtSet.has(t))  return true;
            if (expected === 'tarmac' && tarSet.has(t))  return true;
        }
        return false;
    }
    // ---------- SCORING ----------
    function scoreCar(tokens, crit) {
        const ignore = new Set(['class', 'a', 'b', 'c', 's']);
        const cleaned = tokens.filter(t => !ignore.has(t));

        const dirtSet = new Set(['d', 'dir', 'dirt']);
        const tarSet  = new Set(['t', 'tar', 'tarmac']);

        let score = 0;

        // 1) Surface – must match or skip entirely
        const surfaceOk =
              (crit.trackSurface === 'dirt'   && cleaned.some(t => dirtSet.has(t))) ||
              (crit.trackSurface === 'tarmac' && cleaned.some(t => tarSet.has(t)));
        if (!surfaceOk) return 0;
        score += 1000;

        // 2) Car name – every word of the guide name must appear (order irrelevant)
        const carWords = crit.carName.split(' ');        // ["colina", "tanprice"]
        const hasCar   = carWords.every(w => cleaned.includes(w));
        if (hasCar) score += 500;

        // 3) Gearbox & turbo
        if (cleaned.includes(crit.gearbox)) score += 10;
        if (cleaned.includes(crit.turbo))   score += 5;

        return score;
    }


    // ---------- HIGHLIGHT ----------
    function findAndHighlightBestMatch(trackName) {
        const criteria = getMatchingCriteria(trackName);
        if (!criteria) return;

        document.querySelectorAll('.highlight-car').forEach(el => el.classList.remove('highlight-car'));

        const carElements = document.querySelectorAll('.enlist-list > li');
        let best = { score: 0, element: null };

        carElements.forEach(li => {
            const nameEl  = li.querySelector('.enlist-info .model .bold');
            const setupEl = li.querySelector('.enlist-info .info-content > span > span[class*="model-car-name-"]');
            if (!nameEl || !setupEl) return;

            const label = `${nameEl.textContent} ${setupEl.textContent}`;
            const tokens = normalise(label);

            const s = scoreCar(tokens, criteria);
            if (s > best.score) best = { score: s, element: li };
        });

        if (best.element && best.score > 0) {
            best.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            best.element.classList.add('highlight-car');
        }
    }

    // ---------- UI ----------
    function execute() {
        const poi = document.querySelector('.enlisted-btn-wrap');
        if (!poi) { console.log(`${logPrefix} No race container.`); return; }

        document.querySelector('.recommendation-section')?.remove();
        document.querySelectorAll('.highlight-car').forEach(el => el.classList.remove('highlight-car'));

        const trackName = poi.textContent.trim().split(' - ')[0];
        const criteria  = getMatchingCriteria(trackName);

        const globalCar = globalRecords[trackName]
        ? `<img src="${globalRecords[trackName].image}"> ${globalRecords[trackName].car} (${globalRecords[trackName].oldCar})`
        : 'No recommendation available';

        const forumCar = forumPostGuide[trackName]
        ? `<img src="${forumPostGuide[trackName].image}"> ${forumPostGuide[trackName].car} ${forumPostGuide[trackName].setup} (${getTrackSurface(trackName)}) (${forumPostGuide[trackName].oldCar})`
        : 'No recommendation available';

        const personalCar = showPersonalRecords && personalRecords[trackName]
        ? `<li>Personal Record: ${personalRecords[trackName]}</li>` : '';

        let html = `
    <div class="recommendation-section" style="padding:10px;margin-top:5px;border-top:1px solid #444;">
      <strong>Recommended Cars for ${trackName}:</strong>
      <ol style="margin:5px 0;padding-left:20px;">
        <li>Global Record: ${globalCar}</li>
        <li>Forum Post Guide: ${forumCar}</li>
        ${personalCar}
      </ol>
    </div>`;

        if (criteria) {
            html += `
      <div class="match-criteria" style="font-size:0.9em;color:#ccc;padding:5px 10px;">
        <b>Match Priority:</b> surface → car → gearbox → turbo
      </div>`;
        }

        poi.insertAdjacentHTML('afterend', html);
        findAndHighlightBestMatch(trackName);
    }

    function addTriggerButton() {
        const h = document.querySelector('.content-title.m-bottom10 h4#skip-to-content');
        if (!h || document.querySelector('.racing-helper-btn-wrapper')) return;

        const wrap = document.createElement('div');
        wrap.className = 'racing-helper-btn-wrapper';
        wrap.style.display = 'inline-block';
        wrap.style.marginLeft = '10px';

        const btn = document.createElement('button');
        btn.className = 'ladda-button torn-btn btn-dark-bg accept';
        btn.textContent = 'Helper';
        Object.assign(btn.style, {
            backgroundColor:'#333',color:'#fff',border:'1px solid #000',borderRadius:'5px',
            padding:'10px 20px',height:'40px',display:'flex',alignItems:'center',justifyContent:'center',
            transition:'background-color .3s,color .3s'
        });
        btn.onmouseover = () => { btn.style.backgroundColor='#444'; btn.style.color='#e0e0e0'; };
        btn.onmouseout  = () => { btn.style.backgroundColor='#333'; btn.style.color='#fff'; };
        btn.onmousedown = () => { btn.style.backgroundColor='#555'; btn.style.color='#ccc'; };
        btn.onmouseup   = () => { btn.style.backgroundColor='#444'; btn.style.color='#e0e0e0'; };
        btn.onclick = e => { e.preventDefault(); execute(); };

        wrap.appendChild(btn);
        h.parentElement.insertBefore(wrap, h.nextSibling);
    }

    // ---------- INIT ----------
    function init() {
        console.log(`${logPrefix} Initialising…`);
        if (!document.getElementById('racing-helper-style')) {
            const style = document.createElement('style');
            style.id = 'racing-helper-style';
            style.innerHTML = `
                @keyframes calmGreenFlash {
                    0%,100%{background-color:rgba(40,167,69,.1);box-shadow:0 0 5px rgba(40,167,69,.2);}
                    50%{background-color:rgba(40,167,69,.4);box-shadow:0 0 15px rgba(40,167,69,.7);}
                }
                .highlight-car{animation:calmGreenFlash 2.5s ease-in-out infinite;border-radius:5px;}
            `;
            document.head.appendChild(style);
        }

        const obs = new MutationObserver((_, o) => {
            const title = [...document.querySelectorAll('.title-black.top-round.m-top10')]
                          .find(el => el.textContent.trim() === 'Current race');
            if (title && title.nextElementSibling?.querySelector('.enlisted-btn-wrap')) {
                addTriggerButton();
                execute();
                o.disconnect();
                console.log(`${logPrefix} Script finished & observer disconnected.`);
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    console.log(`${logPrefix} Script loaded. Watching for race page.`);
})();
