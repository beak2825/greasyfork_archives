// ==UserScript==
// @name         MZ - Player Training History
// @namespace    douglaskampl
// @version      7.2
// @description  Provides player development/gains across previous MZ seasons
// @author       Douglas
// @match        https://www.managerzone.com/?p=players
// @match        https://www.managerzone.com/?p=players&pid=*
// @match        https://www.managerzone.com/?p=players&tid=*
// @match        https://www.managerzone.com/?p=transfer*
// @exclude      https://www.managerzone.com/?p=transfer_history*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js
// @require      https://unpkg.com/vple/echarts.min.js
// @resource     trainingHistoryStyles https://mzdv.me/mz/userscript/other/Ayutthaya.css
// @resource     skillTranslationsJS https://mzdv.me/16translations.js
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522149/MZ%20-%20Player%20Training%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/522149/MZ%20-%20Player%20Training%20History.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const SKILL_MAP = { '1': 'Speed', '2': 'Stamina', '3': 'Play Intelligence', '4': 'Passing', '5': 'Shooting', '6': 'Heading', '7': 'Keeping', '8': 'Ball Control', '9': 'Tackling', '10': 'Aerial Passing', '11': 'Set Plays' };
    const ORDERED_SKILLS = ['Speed', 'Stamina', 'Play Intelligence', 'Passing', 'Shooting', 'Heading', 'Keeping', 'Ball Control', 'Tackling', 'Aerial Passing', 'Set Plays'];
    const CURRENCIES = {
        "R$": 2.62589,    EUR: 9.1775,     USD: 7.4234,     "点": 1,
        SEK: 1,           NOK: 1.07245,    DKK: 1.23522,    GBP: 13.35247,
        CHF: 5.86737,     RUB: 0.26313,    CAD: 5.70899,    AUD: 5.66999,
        MZ: 1,            MM: 1,           PLN: 1.95278,    ILS: 1.6953,
        INR: 0.17,        THB: 0.17079,    ZAR: 1.23733,    SKK: 0.24946,
        BGN: 4.70738,     MXN: 0.68576,    ARS: 2.64445,    BOB: 0.939,
        UYU: 0.256963,    PYG: 0.001309,   ISK: 0.10433,    SIT: 0.03896,
        JPY: 0.06,
    };
    const SPECIAL_CHIP_ICONS = {
        'availability chip': 'availability',
        'time saver chip': 'time_saver',
        'efficiency chip': 'efficiency',
        'freebie chip': 'freebie'
    };

    let skillTranslations = {};
    let insensitiveSkillTranslations = {};
    let myTeamId = null;
    let preferredCurrency = GM_getValue('PREFERRED_CURRENCY', 'USD');
    let comparisonChartInstances = {};

    try {
        GM_addStyle(GM_getResourceText('trainingHistoryStyles'));
        const translationsCode = GM_getResourceText('skillTranslationsJS');
        if (!translationsCode) {
            throw new Error("Could not load tr resource.");
        }
        const toBeRun = translationsCode.replace(/^export\s+/gm, '');
        const getTranslations = new Function(`${toBeRun}; return { SKILL_TRANSLATIONS, insensitiveSkillTranslations };`);
        const loadedTranslations = getTranslations();
        skillTranslations = loadedTranslations.SKILL_TRANSLATIONS || {};
        insensitiveSkillTranslations = loadedTranslations.insensitiveSkillTranslations || {};
        if (Object.keys(skillTranslations).length === 0) {
            throw new Error("Could not load tr resource.");
        }
        if (Object.keys(insensitiveSkillTranslations).length === 0) {
            if(Object.keys(skillTranslations).length > 0) {
                insensitiveSkillTranslations = Object.fromEntries(
                    Object.entries(skillTranslations).map(([key, value]) => [key.toLowerCase(), value])
                );
            } else {
                throw new Error("Could not create tr map.");
            }
        }
    } catch (_err) {
        return;
    }

    const getEnglishSkillName = (nativeName) => {
        if (!nativeName) return '';
        return insensitiveSkillTranslations[nativeName.toLowerCase()] || nativeName;
    };

    const isClubMember = () => {
        const headerUsernameStyle = document.querySelector('#header-username')?.getAttribute('style');
        return headerUsernameStyle && headerUsernameStyle.includes('background-image');
    };

    const canRunUserscript = () => isClubMember();

    const getCurrentSeasonInfo = () => {
        const w = document.querySelector('#header-stats-wrapper');
        if (!w) return null;
        const dn = w.querySelector('h5.flex-grow-1.textCenter:not(.linked)');
        const ln = w.querySelector('h5.flex-grow-1.textCenter.linked');
        if (!dn || !ln) return null;
        const dm = dn.textContent.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
        if (!dm) return null;
        const d = dm[1];
        const m = dm[2];
        const y = dm[3];
        const currentDate = new Date([m, d, y].join('/'));
        const digits = ln.textContent.match(/\d+/g);
        if (!digits || digits.length < 3) return null;
        const season = parseInt(digits[0], 10);
        const day = parseInt(digits[2], 10);
        return { currentDate, season, day };
    };

    const getSeasonCalculator = (cs) => {
        if (!cs) return () => 0;
        const baseSeason = cs.season;
        const baseDate = cs.currentDate;
        const dayOffset = cs.day;
        const seasonStart = new Date(baseDate);
        seasonStart.setDate(seasonStart.getDate() - (dayOffset));
        return d => {
            if (!(d instanceof Date)) return 0;
            let s = baseSeason;
            let ref = seasonStart.getTime();
            let diff = Math.floor((d.getTime() - ref) / 86400000);
            while (diff < 0) {
                s--;
                diff += 91;
            }
            while (diff >= 91) {
                s++;
                diff -= 91;
            }
            return s;
        };
    };

    const calculateHistoricalAge = ({ currentAge, currentSeason, targetSeason }) => {
        if (!currentAge) return null;
        const seasonDiff = currentSeason - targetSeason;
        return currentAge - seasonDiff;
    };

    const getPlayerContainerNode = (n) => {
        let c = n.closest('.playerContainer');
        if (!c) c = document.querySelector('.playerContainer');
        return c;
    };

    const hasVisibleSkills = (container) => container.querySelector('table.player_skills') !== null;

    const parsePlayerAge = (container) => {
        const strongEls = container.querySelectorAll('strong');
        for (const el of strongEls) {
            const numberMatch = el.textContent.trim().match(/^(\d{1,2})$/);
            if (numberMatch) {
                const age = parseInt(numberMatch[1], 10);
                if (age >= 15 && age <= 45) return age;
            }
        }
        const allNums = container.textContent.match(/\b(\d{1,2})\b/g);
        if (allNums) {
            for (const numString of allNums) {
                const age = parseInt(numString, 10);
                if (age >= 15 && age <= 45) return age;
            }
        }
        return null;
    };

    const parsePriceString = (priceStr) => {
        if (!priceStr || priceStr === 'N/A' || priceStr === '-') return { amount: 0, currency: '' };
        const match = priceStr.match(/(\d[\d\s]+)(?:\s*)([A-Za-z$]+|点|MM|R\$)/);
        if (!match) return { amount: 0, currency: '' };
        const rawAmount = match[1].replace(/\s+/g, '');
        const amount = parseFloat(rawAmount);
        const currency = match[2];
        return { amount, currency };
    };

    const convertPrice = (priceObj, targetCurrency) => {
        if (!priceObj.amount || !priceObj.currency || !CURRENCIES[priceObj.currency]) {
            return { amount: 0, currency: targetCurrency };
        }
        const sourceRate = CURRENCIES[priceObj.currency];
        const targetRate = CURRENCIES[targetCurrency];
        if (!sourceRate || !targetRate) {
            return { amount: priceObj.amount, currency: priceObj.currency };
        }
        const inSEK = priceObj.amount * sourceRate;
        const convertedAmount = inSEK / targetRate;
        return {
            amount: Math.round(convertedAmount),
            currency: targetCurrency
        };
    };

    const formatPrice = (priceObj) => {
        if (!priceObj.amount) return 'N/A';
        const formatted = new Intl.NumberFormat().format(priceObj.amount);
        return `${formatted} ${priceObj.currency}`;
    };

    const parseSeriesData = (txt) => {
        const m = txt.match(/var series = (\[.*?\]);/);
        return m ? JSON.parse(m[1]) : null;
    };

    const sanitizeChipName = (name) => {
        if (!name) return '';
        return name.replace(/<[^>]*>/g, '').replace(/"/g, '').replace(/ No\. \d+/, '').trim();
    };

    const extractChipsInfo = (series) => {
        const chips = [];
        if (!series) return chips;
        series.forEach(s => {
            s.data.forEach(pt => {
                if (pt.marker?.symbol.includes('training_camp_chip.png') && pt.name) {
                    const chipName = sanitizeChipName(pt.name);
                    const date = new Date(pt.x);
                    chips.push({
                        name: chipName,
                        date: date,
                        dateString: date.toLocaleDateString()
                    });
                }
            });
        });
        return chips;
    };

    const generateChipDisplayHTML = (chipName, iconOnly = false) => {
        const lowerCaseChipName = chipName.toLowerCase();
        let canonicalName = chipName;
        let iconFile = '';

        for (const knownChip in SPECIAL_CHIP_ICONS) {
            if (lowerCaseChipName.includes(knownChip)) {
                canonicalName = knownChip;
                iconFile = `${SPECIAL_CHIP_ICONS[knownChip]}.png`;
                break;
            }
        }

        if (!iconFile) {
            const cleanName = lowerCaseChipName.replace(/ chip$/, '').replace(/ package$/, '').replace(/\s+/g, '_');
            iconFile = `${cleanName}.png`;
        }

        const iconUrl = `img/training/chip/${iconFile}`;
        const displayName = canonicalName.charAt(0).toUpperCase() + canonicalName.slice(1);

        if (iconOnly) {
            return `<img src="${iconUrl}" class="th-chip-icon-table" title="${displayName}">`;
        }

        return `
            <span class="th-chip-display" title="${displayName}">
                <img src="${iconUrl}" class="th-chip-icon">
                <span>${displayName}</span>
            </span>
        `;
    };

    const gatherCurrentSkills = (container) => {
        const rows = container.querySelectorAll('table.player_skills tr');
        const out = {};
        let i = 1;
        rows.forEach(r => {
            const valCell = r.querySelector('.skillval span');
            if (!valCell) return;
            const name = SKILL_MAP[i.toString()];
            if (name) {
                const v = parseInt(valCell.textContent.trim(), 10);
                out[name] = isNaN(v) ? 0 : v;
            }
            i++;
        });
        return out;
    };

    const getTotalBallsFromSkillMap = (map) => Object.values(map).reduce((a, b) => a + b, 0);

    const processTrainingHistory = (series, getSeasonFn) => {
        const bySeason = {};
        const skillTotals = {};
        const chips = extractChipsInfo(series);
        const chipsBySeason = {};
        const skillMaxedSeason = {};
        let total = 0;
        let earliest = 9999;

        chips.forEach(chip => {
            const season = getSeasonFn(chip.date);
            if (!chipsBySeason[season]) chipsBySeason[season] = [];
            chipsBySeason[season].push(chip);
        });

        if (series) {
            series.forEach(s => {
                s.data.forEach((pt, i) => {
                    if (pt.marker?.symbol.includes('gained_skill.png') && s.data[i + 1]) {
                        const nextPt = s.data[i + 1];
                        const d = new Date(nextPt.x - 1000);
                        const sea = getSeasonFn(d);
                        if (!bySeason[sea]) bySeason[sea] = [];
                        const sid = nextPt.y.toString();
                        const sk = SKILL_MAP[sid] || 'Unknown';
                        const isMaxed = nextPt.hasOwnProperty('name');
                        bySeason[sea].push({ dateString: d.toLocaleDateString(), skillName: sk, maxed: isMaxed });

                        if (isMaxed && sk !== 'Unknown' && !skillMaxedSeason[sk]) {
                            skillMaxedSeason[sk] = sea;
                        }

                        if (!skillTotals[sk]) skillTotals[sk] = 0;
                        skillTotals[sk]++;
                        total++;
                        if (sea < earliest) earliest = sea;
                    }
                });
            });
        }

        return { bySeason, skillTotals, total, earliestSeason: earliest, chips, chipsBySeason, skillMaxedSeason };
    };

    const fillSeasonGains = (bySeason, earliestSeason, currentSeason, skillTotals) => {
        const out = {};
        for (let s = earliestSeason; s <= currentSeason; s++) {
            out[s] = {};
            ORDERED_SKILLS.forEach(sk => { out[s][sk] = 0; });
            if (bySeason[s]) {
                bySeason[s].forEach(ev => {
                    if (skillTotals[ev.skillName]) {
                        if (!out[s][ev.skillName]) out[s][ev.skillName] = 0;
                        out[s][ev.skillName]++;
                    }
                });
            }
        }
        return out;
    };

    const buildSeasonCheckpointData = (earliestSeason, currentSeason, finalMap, seasonGains, currentAge) => {
        const out = [];
        const currentMap = {};
        ORDERED_SKILLS.forEach(sk => {
            currentMap[sk] = finalMap[sk] || 0;
        });

        out.push({
            season: currentSeason,
            label: 'Current',
            distribution: { ...finalMap }
        });

        for (let s = currentSeason; s >= earliestSeason; s--) {
            if (seasonGains[s]) {
                Object.keys(seasonGains[s]).forEach(k => {
                    if (currentMap.hasOwnProperty(k)) {
                        currentMap[k] -= seasonGains[s][k];
                        if (currentMap[k] < 0) currentMap[k] = 0;
                    }
                });
            }
            const age = calculateHistoricalAge({ currentAge, currentSeason, targetSeason: s });
            const label = age !== null ? `${s} (${age})` : s.toString();
            const snapshot = { ...currentMap };
            out.unshift({ season: s, label, distribution: snapshot });
        }
        return out;
    };

    const makeSkillRows = (params) => {
        const { map, prevMap, arrivalMap, currentSeasonForState, isCurrentState, scoutData, skillMaxedSeason } = params;
        let comparisonHtml = '';
        let arrivalGainHtml = '';
        let totalIncreaseFromPrev = 0;
        let totalGainSinceArrival = 0;

        ORDERED_SKILLS.forEach((k, idx) => {
            let v = map[k] || 0;
            if (v < 0) v = 0;
            if (v > 10) v = 10;
            let changeHTML = '';
            let gainSinceArrivalTextHTML = '';
            let initialBallsVizHTML = '';
            let gainedBallsVizHTML = '';
            let potentialClass = '';
            let potentialIcon = '';
            let skillNameSpecificClass = '';

            const maxedSeasonForSkill = skillMaxedSeason[k];
            const isVisuallyMaxed = (v === 10) || (maxedSeasonForSkill && maxedSeasonForSkill < currentSeasonForState);
            const isMaxedClass = isVisuallyMaxed ? ' th-skill-maxed' : '';

            if (scoutData) {
                if (scoutData.hp > 0 && (k === scoutData.firstHpSkill || k === scoutData.secondHpSkill)) {
                    skillNameSpecificClass = ` th-skill-potential-hp${scoutData.hp}`;
                } else if (scoutData.lp > 0 && (k === scoutData.firstLpSkill || k === scoutData.secondLpSkill)) {
                    skillNameSpecificClass = ` th-skill-potential-lp${scoutData.lp}`;
                }

                if (scoutData.hp > 0 && scoutData.hpPotentialIndices?.includes(idx)) {
                    potentialClass = ` th-skill-potential-hp${scoutData.hp}`;
                    potentialIcon = `<i class="fas fa-star th-potential-icon th-potential-icon-hp${scoutData.hp}"></i>`;
                } else if (scoutData.lp > 0 && scoutData.lpPotentialIndices?.includes(idx)) {
                    potentialClass = ` th-skill-potential-lp${scoutData.lp}`;
                    potentialIcon = `<i class="fas fa-star th-potential-icon th-potential-icon-lp${scoutData.lp}"></i>`;
                }
            }

            if (prevMap) {
                const prevVal = prevMap[k] || 0;
                const change = v - prevVal;
                if (change > 0) {
                    changeHTML = `<span class="th-skill-increase">(+${change})</span>`;
                    totalIncreaseFromPrev += change;
                }
            }

            const baseSkillRowStartHtml = `
            <div class="th-state-skill${potentialClass}">
                <div class="th-skill-name${skillNameSpecificClass}">${potentialIcon}<strong>${k}</strong></div>`;

            comparisonHtml += `${baseSkillRowStartHtml}
                <div class="th-skill-val">
                    <img src="nocache-922/img/soccer/wlevel_${v}.gif" alt="">
                    <span class="th-skill-value-text${isMaxedClass}">(${v})</span>
                </div>
                <div class="th-skill-change">${changeHTML}</div>
            </div>`;

            if (arrivalMap && isCurrentState) {
                const arrivalVal = arrivalMap[k] || 0;
                const gainSinceArrival = v - arrivalVal;
                initialBallsVizHTML = `<span class="th-initial-balls">${arrivalVal > 0 ? '●'.repeat(arrivalVal) : ''}</span>`;

                if (gainSinceArrival > 0) {
                    gainSinceArrivalTextHTML = `<span class="th-gain-since-arrival">(+${gainSinceArrival})</span>`;
                    totalGainSinceArrival += gainSinceArrival;
                    gainedBallsVizHTML = `<span class="th-gained-balls">${'●'.repeat(gainSinceArrival)}</span>`;
                } else {
                    gainSinceArrivalTextHTML = '';
                    gainedBallsVizHTML = '';
                }

                arrivalGainHtml += `${baseSkillRowStartHtml}
                    <div class="th-skill-val th-arrival-skill-val">
                        ${initialBallsVizHTML}
                        ${gainedBallsVizHTML}
                    </div>
                    <div class="th-skill-change">${gainSinceArrivalTextHTML}</div>
                </div>`;
            }
        });
        return { comparisonHtml, arrivalGainHtml, totalIncrease: totalIncreaseFromPrev, totalGainSinceArrival };
    };

    const createModal = (content, spin) => {
        const ov = document.createElement('div');
        ov.className = 'th-overlay';
        const mo = document.createElement('div');
        mo.className = 'th-modal';
        const bd = document.createElement('div');
        bd.className = 'th-modal-content';
        const sp = document.createElement('div');
        sp.style.height = '60px';
        sp.style.display = spin ? 'block' : 'none';
        bd.appendChild(sp);
        if (content) bd.innerHTML += content;
        const cl = document.createElement('div');
        cl.className = 'th-modal-close';
        cl.innerHTML = '×';
        cl.onclick = () => {
            Object.values(comparisonChartInstances).forEach(instance => instance.dispose());
            comparisonChartInstances = {};
            ov.remove();
        }
        mo.appendChild(cl);
        mo.appendChild(bd);
        ov.appendChild(mo);
        document.body.appendChild(ov);
        ov.addEventListener('click', e => {
            if (e.target === ov) {
                Object.values(comparisonChartInstances).forEach(instance => instance.dispose());
                comparisonChartInstances = {};
                ov.remove();
            }
        });
        requestAnimationFrame(() => {
            ov.classList.add('show');
            mo.classList.add('show');
        });
        let spinnerInstance = null;
        if (spin) {
            spinnerInstance = new Spinner({ color: '#5555aa', lines: 12 });
            spinnerInstance.spin(sp);
        }
        return { modal: mo, spinnerEl: sp, spinnerInstance, overlay: ov };
    };

    const generateEvolHTML = (processedData, currentAge, currentSeason) => {
        const { bySeason, total, skillTotals, chips, chipsBySeason } = processedData;
        let html = '';
        const getSeason = getSeasonCalculator({ currentDate: new Date(), season: currentSeason, day: 1 });
        const sortedSeasons = Object.keys(bySeason)
        .map(x => parseInt(x, 10))
        .sort((a, b) => a - b);

        sortedSeasons.forEach(se => {
            const items = bySeason[se];
            const age = calculateHistoricalAge({ currentAge, currentSeason, targetSeason: se });
            const label = age !== null ? `Season ${se} (Age ${age})` : `Season ${se}`;
            let seasonChipsHtml = '';
            if (chipsBySeason[se] && chipsBySeason[se].length > 0) {
                const chipDisplays = chipsBySeason[se].map(c => generateChipDisplayHTML(c.name)).join('');
                seasonChipsHtml = `<div class="th-chips-list">Chips: ${chipDisplays}</div>`;
            }
            html += `<div class="th-training-season">
                <h3>${label} — ${items.length} Ball${items.length !== 1 ? 's' : ''} Earned</h3>
                ${seasonChipsHtml}
                <ul>`;
            items.forEach(it => {
                const maxedIndicator = it.maxed ? ' <span class="th-maxed-indicator">(Maxed)</span>' : '';
                html += `<li><strong>${it.dateString}</strong> ${it.skillName}${maxedIndicator}</li>`;
            });
            html += '</ul></div>';
        });

        html += `<hr><h3 class="th-training-final-summary">Total Balls Earned: ${total}</h3>`;
        const fs = Object.entries(skillTotals)
        .filter(([, count]) => count > 0)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([skill, count]) => `${skill} (${count})`)
        .join(', ');
        html += `<h3 class="th-training-skilltotals">${fs}</h3>`;

        const allChipsSorted = [...chips].sort((a, b) => a.date - b.date);
        if (allChipsSorted.length > 0) {
            html += `<h3 class="th-training-final-summary">All Applied Chips</h3><ul class="th-all-chips-list">`;
            allChipsSorted.forEach(chip => {
                const chipSeason = getSeason(chip.date);
                html += `<li>S${chipSeason}: ${generateChipDisplayHTML(chip.name)} (${chip.dateString})</li>`;
            });
            html += `</ul>`;
        }
        return html;
    };

    const buildStatesLayout = (processedData, finalMap, currentAge, currentSeason, scoutData, transferData) => {
        const { bySeason, skillTotals, earliestSeason, chipsBySeason, skillMaxedSeason } = processedData;
        const seasonGains = fillSeasonGains(bySeason, earliestSeason, currentSeason, skillTotals);
        const arr = buildSeasonCheckpointData(earliestSeason, currentSeason, finalMap, seasonGains, currentAge);
        const arrivalMap = arr.length > 0 ? arr[0].distribution : null;
        let paginatedHtml = '<div class="th-state-wrapper th-paginated-view">';
        let allViewHtml = '<div class="th-state-wrapper th-all-view" style="display:none;">';

        arr.forEach((o, index) => {
            const sum = getTotalBallsFromSkillMap(o.distribution);
            let headerText;
            const isCurrent = o.label === 'Current';
            const seasonNumber = isCurrent ? currentSeason : parseInt(o.label.split(' ')[0], 10);
            let stateSkillsHtml = '';
            const prevDistribution = index > 0 ? arr[index - 1].distribution : null;
            const useArrivalMapForComparison = isCurrent ? arrivalMap : null;

            const skillRowsResult = makeSkillRows({
                map: o.distribution,
                prevMap: prevDistribution,
                arrivalMap: useArrivalMapForComparison,
                currentSeasonForState: seasonNumber,
                isCurrentState: isCurrent,
                scoutData: scoutData,
                skillMaxedSeason: skillMaxedSeason
            });

            if (isCurrent) {
                headerText = `Current State - Season ${currentSeason}`;
                if (currentAge !== null) headerText += ` (Age ${currentAge})`;
                stateSkillsHtml = `
                    <div class="th-state-skills">
                        <h5>Changes vs Start of Season ${currentSeason}</h5>
                        ${skillRowsResult.comparisonHtml}
                        ${skillRowsResult.totalIncrease > 0 ? `<div class="th-skill-total-increase"><span>(+${skillRowsResult.totalIncrease} total this season)</span></div>` : ''}
                    </div>
                    <div class="th-state-skills th-arrival-gains">
                        <h5>Gains Since Arrival (Season ${arr[0]?.season || '?'})</h5>
                        ${skillRowsResult.arrivalGainHtml}
                        ${skillRowsResult.totalGainSinceArrival > 0 ? `<div class="th-skill-total-increase"><span>(+${skillRowsResult.totalGainSinceArrival} total since arrival)</span></div>` : ''}
                    </div>
                `;
            } else {
                const [seasonStr, ageStr] = o.label.split(' ');
                const agePart = ageStr ? ageStr.replace(/[()]/g, '') : '?';
                if (index === 0) {
                    headerText = `Arrival at Club - Season ${seasonStr}`;
                    if (agePart !== '?') headerText += ` (Age ${agePart})`;
                } else {
                    headerText = `Start of Season ${seasonStr}`;
                    if (agePart !== '?') headerText += ` (Age ${agePart})`;
                }
                stateSkillsHtml = `
                     <div class="th-state-skills">
                        ${index > 0 ? `<h5>Changes vs Start of Season ${arr[index - 1]?.season}</h5>` : ''}
                         ${skillRowsResult.comparisonHtml}
                         ${skillRowsResult.totalIncrease > 0 ? `<div class="th-skill-total-increase"><span>(+${skillRowsResult.totalIncrease} total vs prev)</span></div>` : ''}
                     </div>
                 `;
            }

            let chipInfo = '';
            if (chipsBySeason[seasonNumber] && chipsBySeason[seasonNumber].length > 0 && !isCurrent) {
                const chipDisplays = chipsBySeason[seasonNumber].map(c => generateChipDisplayHTML(c.name)).join('');
                chipInfo = `<div class="th-chips-list">Chips used during S${seasonNumber}: ${chipDisplays}</div>`;
            }

            let transferInfo = '';
            if (transferData && transferData[seasonNumber] && transferData[seasonNumber].length > 0 && !isCurrent) {
                transferInfo = '<div class="th-transfer-info" data-season="' + seasonNumber + '">' +
                    '<div class="th-transfer-header">Season ' + seasonNumber + ': ' +
                    '<i class="fa fa-cog th-transfer-currency-icon" title="Change currency"></i>' +
                    '<div class="th-transfer-currency-dropdown"><ul>';
                Object.keys(CURRENCIES).forEach(curr => {
                    transferInfo += `<li data-currency="${curr}" ${curr === preferredCurrency ? 'class="selected"' : ''}>${curr}</li>`;
                });
                transferInfo += '</ul></div></div><ul>';
                transferData[seasonNumber].forEach(t => {
                    const priceObj = parsePriceString(t.price);
                    const convertedPrice = convertPrice(priceObj, preferredCurrency);
                    const displayPrice = formatPrice(convertedPrice);
                    transferInfo += `<li data-original-price="${t.price}" data-price-amount="${priceObj.amount}" data-price-currency="${priceObj.currency}">
                        ${t.dateString}: ${t.fromTeamName} <i class="fa fa-arrow-right"></i> ${t.toTeamName} (${displayPrice})
                    </li>`;
                });
                transferInfo += '</ul></div>';
            }

            const colHtml = `<div class="th-state-col" data-page="${index}" data-season="${seasonNumber}">
                    <h4>${headerText}</h4>
                    <div class="th-state-info">Total Balls: <strong>${sum}</strong></div>
                    ${stateSkillsHtml}
                    ${chipInfo}
                    ${transferInfo}
                 </div>`;
            paginatedHtml += colHtml;
            allViewHtml += colHtml;
        });

        paginatedHtml += '</div>';
        allViewHtml += '</div>';
        let scoutHtml = '';
        if (scoutData) {
            const { trainingSpeed, hp, lp, firstHpSkill, secondHpSkill, firstLpSkill, secondLpSkill } = scoutData;
            const speedClass = `th-speed-s${trainingSpeed}`;
            const hpClass = `th-hp-h${hp}`;
            const lpClass = `th-lp-l${lp}`;
            const speedText = trainingSpeed > 0 ? `S${trainingSpeed}` : 'N/A';
            const hpText = hp > 0 ? `HP${hp}` : 'N/A';
            const lpText = lp > 0 ? `LP${lp}` : 'N/A';

            let hpSkillsText = '';
            if (hp > 0 && firstHpSkill) {
                hpSkillsText += `<span class="th-potential-skill th-skill-potential-hp${hp}">${firstHpSkill}</span>`;
                if (secondHpSkill) hpSkillsText += `/<span class="th-potential-skill th-skill-potential-hp${hp}">${secondHpSkill}</span>`;
            }
            hpSkillsText = hpSkillsText ? ` ${hpSkillsText}` : '';

            let lpSkillsText = '';
            if (lp > 0 && firstLpSkill) {
                lpSkillsText += `<span class="th-potential-skill th-skill-potential-lp${lp}">${firstLpSkill}</span>`;
                if (secondLpSkill) lpSkillsText += `/<span class="th-potential-skill th-skill-potential-lp${lp}">${secondLpSkill}</span>`;
            }
            lpSkillsText = lpSkillsText ? ` ${lpSkillsText}` : '';

            scoutHtml = `
            <div class="th-scout-info">
            <span class="${speedClass}">TrainingSpeed ${speedText}</span> |
            <span class="${hpClass}">${hpText}</span>${hpSkillsText} |
            <span class="${lpClass}">${lpText}</span>${lpSkillsText}
            </div>`;
        }
        return scoutHtml + paginatedHtml + allViewHtml;
    };

    const generateCompareHTML = () => `
        <div class="th-compare-controls">
            <textarea id="th-compare-pids" placeholder="Enter player IDs separated by commas"></textarea>
            <button id="th-compare-btn" class="th-action-btn">Compare Players</button>
        </div>
        <div id="th-compare-results" class="th-compare-results-wrapper">
            <div id="th-compare-spinner" style="display: none; height: 60px;"></div>
            <div id="th-compare-textual-results"></div>
            <div id="th-compare-graphical-results" class="th-compare-graphical-results"></div>
            <div id="th-compare-error-log"></div>
        </div>
    `;

    const generateTabsHTML = (name, evo, st) => `
        <h2 class="th-title">${name}</h2>
        <div class="th-tabs">
            <div class="th-tab-row">
                <div class="th-tab-buttons">
                    <button class="th-tab-btn active" data-tab="states">Player Development</button>
                    <button class="th-tab-btn" data-tab="evolution">Gains Log</button>
                    <button class="th-tab-btn" data-tab="compare">Compare</button>
                </div>
                <div class="th-pagination-controls">
                    <button class="th-pagination-btn th-prev-btn" disabled>←</button>
                    <span class="th-pagination-indicator">1 / 1</span>
                    <button class="th-pagination-btn th-next-btn" disabled>→</button>
                    <button class="th-pagination-toggle">Show All</button>
                </div>
            </div>
            <div class="th-tab-content" data-content="evolution">${evo}</div>
            <div class="th-tab-content" data-content="compare">${generateCompareHTML()}</div>
            <div class="th-tab-content active" data-content="states">${st}</div>
        </div>`;

    const detachPaginationEvents = (modal) => {
        const prevBtn = modal.querySelector('.th-prev-btn');
        const nextBtn = modal.querySelector('.th-next-btn');
        const toggleBtn = modal.querySelector('.th-pagination-toggle');
        if (prevBtn) {
            const newPrevBtn = prevBtn.cloneNode(true);
            prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        }
        if (nextBtn) {
            const newNextBtn = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        }
        if (toggleBtn) {
            const newToggleBtn = toggleBtn.cloneNode(true);
            toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
        }
    };

    const attachPaginationEvents = (modal, initialIndex) => {
        const statesContent = modal.querySelector('.th-tab-content[data-content="states"]');
        if (!statesContent) return;
        const prevBtn = modal.querySelector('.th-prev-btn');
        const nextBtn = modal.querySelector('.th-next-btn');
        const paginationIndicator = modal.querySelector('.th-pagination-indicator');
        const toggleBtn = modal.querySelector('.th-pagination-toggle');
        const paginatedView = statesContent.querySelector('.th-paginated-view');
        const allView = statesContent.querySelector('.th-all-view');

        if (!paginatedView || !allView || !prevBtn || !nextBtn || !paginationIndicator || !toggleBtn) return;
        const stateColumns = Array.from(paginatedView.querySelectorAll('.th-state-col'));
        const totalPages = stateColumns.length;
        let currentIndex = initialIndex;

        const updatePaginationUI = () => {
            if (totalPages === 0) {
                prevBtn.disabled = true;
                nextBtn.disabled = true;
                paginationIndicator.textContent = '0 / 0';
                toggleBtn.style.display = 'none';
                return;
            }
            toggleBtn.style.display = '';
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalPages - 1;
            paginationIndicator.textContent = `${currentIndex + 1} / ${totalPages}`;
            stateColumns.forEach((col, index) => {
                col.style.display = index === currentIndex ? '' : 'none';
            });
        };

        prevBtn.addEventListener('click', () => {
            if (paginatedView.style.display === 'none') return;
            if (currentIndex > 0) {
                currentIndex--;
                updatePaginationUI();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (paginatedView.style.display === 'none') return;
            if (currentIndex < totalPages - 1) {
                currentIndex++;
                updatePaginationUI();
            }
        });

        toggleBtn.addEventListener('click', () => {
            const isPaginated = paginatedView.style.display !== 'none';
            paginatedView.style.display = isPaginated ? 'none' : '';
            allView.style.display = isPaginated ? '' : 'none';
            toggleBtn.textContent = isPaginated ? 'Show Paginated' : 'Show All';
            prevBtn.disabled = !isPaginated || currentIndex === 0;
            nextBtn.disabled = !isPaginated || currentIndex === totalPages - 1;
            if (!isPaginated) {
                updatePaginationUI();
            }
        });
        updatePaginationUI();
    };

    const initPaginationState = (modal) => {
        const statesContent = modal.querySelector('.th-tab-content[data-content="states"]');
        if (!statesContent) return;
        const paginatedView = statesContent.querySelector('.th-paginated-view');
        const allView = statesContent.querySelector('.th-all-view');
        const paginationToggle = modal.querySelector('.th-pagination-toggle');
        const paginationControls = modal.querySelector('.th-pagination-controls');

        if (!paginatedView || !allView || !paginationToggle || !paginationControls) {
            if (paginationControls) paginationControls.style.display = 'none';
            return;
        }

        const stateColumns = paginatedView.querySelectorAll('.th-state-col');
        if (!stateColumns.length) {
            if (paginationControls) paginationControls.style.display = 'none';
            return;
        } else {
            paginationControls.style.display = '';
        }

        paginatedView.style.display = '';
        allView.style.display = 'none';
        paginationToggle.textContent = 'Show All';
        let initialIndex = 0;

        stateColumns.forEach((col, index) => {
            col.style.display = index === initialIndex ? '' : 'none';
        });

        const paginationIndicator = modal.querySelector('.th-pagination-indicator');
        const prevBtn = modal.querySelector('.th-prev-btn');
        const nextBtn = modal.querySelector('.th-next-btn');

        if (paginationIndicator) {
            paginationIndicator.textContent = `${initialIndex + 1} / ${stateColumns.length}`;
        }
        if (prevBtn) prevBtn.disabled = initialIndex === 0;
        if (nextBtn) nextBtn.disabled = initialIndex >= stateColumns.length - 1;
        detachPaginationEvents(modal);
        attachPaginationEvents(modal, initialIndex);
    };

    const updateTransferPrices = (modal, newCurrency) => {
        const transferInfoSections = modal.querySelectorAll('.th-transfer-info');
        transferInfoSections.forEach(section => {
            const items = section.querySelectorAll('li');
            items.forEach(item => {
                const originalAmount = parseFloat(item.getAttribute('data-price-amount'));
                const originalCurrency = item.getAttribute('data-price-currency');
                if (originalAmount && originalCurrency) {
                    const priceObj = { amount: originalAmount, currency: originalCurrency };
                    const convertedPrice = convertPrice(priceObj, newCurrency);
                    const displayPrice = formatPrice(convertedPrice);
                    const text = item.innerHTML;
                    const pricePattern = /\([^)]*\)(?=[^(]*$)/;
                    item.innerHTML = text.replace(pricePattern, `(${displayPrice})`);
                }
            });
        });
    };

    const setUpCurrencyDropdowns = (modal) => {
        const icons = modal.querySelectorAll('.th-transfer-currency-icon');
        icons.forEach(icon => {
            const newIcon = icon.cloneNode(true);
            icon.parentNode.replaceChild(newIcon, icon);
        });

        modal.querySelectorAll('.th-transfer-currency-icon').forEach(icon => {
            icon.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                const dropdown = this.nextElementSibling;
                dropdown.classList.toggle('show');
                if (dropdown.classList.contains('show')) {
                    const rect = this.getBoundingClientRect();
                    dropdown.style.top = (rect.bottom - rect.top) + 5 + 'px';
                    dropdown.style.left = '0px';
                }
            });
        });

        modal.querySelectorAll('.th-transfer-currency-dropdown li').forEach(item => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            newItem.addEventListener('click', function(e) {
                e.stopPropagation();
                const newCurrency = this.getAttribute('data-currency');
                preferredCurrency = newCurrency;
                GM_setValue('PREFERRED_CURRENCY', newCurrency);
                modal.querySelectorAll('.th-transfer-currency-dropdown li').forEach(li => {
                    li.classList.remove('selected');
                });
                modal.querySelectorAll(`.th-transfer-currency-dropdown li[data-currency="${newCurrency}"]`).forEach(li => {
                    li.classList.add('selected');
                });
                updateTransferPrices(modal, newCurrency);
                this.closest('.th-transfer-currency-dropdown').classList.remove('show');
            });
        });
    };

    const attachTabEvents = (modal) => {
        const tbs = modal.querySelectorAll('.th-tab-btn');
        const cs = modal.querySelectorAll('.th-tab-content');
        const paginationControls = modal.querySelector('.th-pagination-controls');
        const statesContent = modal.querySelector('.th-tab-content[data-content="states"]');

        if (!statesContent || !paginationControls) return;

        const updatePaginationVisibility = () => {
            const activeTab = modal.querySelector('.th-tab-btn.active')?.getAttribute('data-tab');
            const isPaginatedTab = activeTab === 'states';
            paginationControls.style.display = isPaginatedTab ? 'flex' : 'none';
        };

        setUpCurrencyDropdowns(modal);
        attachCompareTabEvents(modal);

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.th-transfer-currency-dropdown') && !e.target.classList.contains('th-transfer-currency-icon')) {
                document.querySelectorAll('.th-transfer-currency-dropdown.show').forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });

        updatePaginationVisibility();

        tbs.forEach(btn => {
            btn.addEventListener('click', () => {
                tbs.forEach(x => x.classList.remove('active'));
                btn.classList.add('active');
                const t = btn.getAttribute('data-tab');
                cs.forEach(cc => {
                    cc.classList.toggle('active', cc.getAttribute('data-content') === t);
                });
                updatePaginationVisibility();
                if (t === 'states') {
                    initPaginationState(modal);
                }
            });
        });
    };

    const fetchScoutData = async (pid) => {
        try {
            const response = await fetch(`https://www.managerzone.com/ajax.php?p=players&sub=scout_report&pid=${pid}&sport=soccer`);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const defaultResult = { trainingSpeed: 0, hp: 0, lp: 0, firstHpSkill: '', secondHpSkill: '', firstLpSkill: '', secondLpSkill: '', hpPotentialIndices: [], lpPotentialIndices: [] };
            const paperContent = doc.querySelector('.paper-content');
            if (!paperContent) return defaultResult;

            const dlElement = paperContent.querySelector('dl');
            if (!dlElement) return defaultResult;

            const hpDd = dlElement.querySelector('dd i.fa-line-chart')?.closest('dd');
            const lpDd = dlElement.querySelector('dd i.fa-exclamation-triangle')?.closest('dd');
            const speedDd = dlElement.querySelector('dd i.fa-heartbeat')?.closest('dd');

            const getSkillsAndIndices = (dd) => {
                const skills = [];
                const indices = [];
                if (!dd) return { skills, indices };
                const listItems = dd.querySelectorAll('ul li');
                listItems.forEach((li, index) => {
                    const span = li.querySelector('.blurred span:last-child');
                    if (span) {
                        const skillName = span.textContent.trim();
                        skills.push(skillName);
                        if (li.querySelector('.stars i.fa-star.lit')) {
                            indices.push(index);
                        }
                    }
                });
                return { skills, indices };
            };

            const getStars = (dd) =>
            dd ? dd.querySelectorAll('.stars i.fa-star.lit').length : 0;

            const { skills: hpSkillsNative, indices: hpIndices } = getSkillsAndIndices(hpDd);
            const { skills: lpSkillsNative, indices: lpIndices } = getSkillsAndIndices(lpDd);

            const hpStars = getStars(hpDd);
            const lpStars = getStars(lpDd);
            const speedStars = getStars(speedDd);

            const firstHpNative = hpSkillsNative[0] || '';
            const secondHpNative = hpSkillsNative[1] || '';
            const firstLpNative = lpSkillsNative[0] || '';
            const secondLpNative = lpSkillsNative[1] || '';

            return {
                hp: hpStars,
                lp: lpStars,
                trainingSpeed: speedStars,
                firstHpSkill: getEnglishSkillName(firstHpNative),
                secondHpSkill: getEnglishSkillName(secondHpNative),
                firstLpSkill: getEnglishSkillName(firstLpNative),
                secondLpSkill: getEnglishSkillName(secondLpNative),
                hpPotentialIndices: hpIndices,
                lpPotentialIndices: lpIndices
            };
        } catch (error) {
            return null;
        }
    };

    const fetchTransferData = async (pid, getSeasonFn) => {
        const url = `https://www.managerzone.com/?p=players&pid=${pid}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');

            let transferTable = null;
            const potentialTables = doc.querySelectorAll('table.hitlist');

            for (const table of potentialTables) {
                if (!table.classList.contains('hitlist-compact-list-included') && table.id !== 'suspensionsList') {
                    transferTable = table;
                    break;
                }
            }

            if (!transferTable) {
                return {};
            }

            const transfersBySeason = {};
            const rows = transferTable.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 5) return;

                const dateCell = cells[0];
                const actionOrFromTeamCell = cells[1];
                const toTeamCell = cells[3];
                const priceCell = cells[4];

                const dateStrRaw = dateCell?.textContent.trim();
                const dateMatch = dateStrRaw.match(/(\d{2})-(\d{2})-(\d{4})|(\d{4})-(\d{2})-(\d{2})/);
                if (!dateMatch) return;

                let day, month, year;
                if (dateMatch[1]) {
                    day = dateMatch[1]; month = dateMatch[2]; year = dateMatch[3];
                } else {
                    day = dateMatch[6]; month = dateMatch[5]; year = dateMatch[4];
                }
                const transferDate = new Date(`${year}-${month}-${day}`);
                if (isNaN(transferDate)) return;

                const season = getSeasonFn(transferDate);

                const fromTeamLink = actionOrFromTeamCell.querySelector('a[href*="tid="]');
                const toTeamLink = toTeamCell.querySelector('a[href*="tid="]');
                let fromTeamName = 'Youth Academy';

                if (fromTeamLink) {
                    fromTeamName = fromTeamLink.textContent.trim();
                } else {
                    const fromText = actionOrFromTeamCell.textContent.trim();
                    if (fromText && fromText !== '-') {
                        fromTeamName = fromText;
                    }
                }

                const toTeamName = toTeamLink ? toTeamLink.textContent.trim() : toTeamCell.textContent.trim();

                const priceDiv = priceCell?.querySelector('div[title]');
                let price = priceDiv?.title || priceCell?.textContent.trim() || 'N/A';
                if (price === '-') price = 'N/A';

                if (!transfersBySeason[season]) {
                    transfersBySeason[season] = [];
                }

                transfersBySeason[season].push({
                    date: transferDate,
                    dateString: transferDate.toLocaleDateString(),
                    fromTeamName: fromTeamName,
                    toTeamName: toTeamName,
                    price: price
                });
            });

            Object.values(transfersBySeason).forEach(seasonTransfers => {
                seasonTransfers.sort((a, b) => a.date - b.date);
            });

            return transfersBySeason;
        } catch (_error) {
            return {};
        }
    };

    function decodeHtmlEntities(text) {
        if (!text) return '';
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    async function fetchCurrentSkillsViaAjax(pid) {
        return new Promise((resolve, reject) => {
            const url = `https://www.managerzone.com/ajax.php?p=transfer&sub=transfer-search&sport=soccer&issearch=true&u=${pid}&nationality=all_nationalities&deadline=0&category=&valuea=&valueb=&bida=&bidb=&agea=15&ageb=45&birth_season_low=0&birth_season_high=100&tot_low=0&tot_high=120&s0a=0&s0b=10&s1a=0&s1b=10&s2a=0&s2b=10&s3a=0&s3b=10&s4a=0&s4b=10&s5a=0&s5b=10&s6a=0&s6b=10&s7a=0&s7b=10&s8a=0&s8b=10&s9a=0&s9b=10&s10a=0&s10b=10&s11a=0&s11b=10&s12a=0&s12b=10&o=0`;

            fetch(url, { credentials: 'include' })
                .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return response.json();
            })
                .then(data => {
                if (data && data.players) {
                    try {
                        const decodedHtml = decodeHtmlEntities(data.players);
                        const parser = new DOMParser();
                        const ajaxDoc = parser.parseFromString(decodedHtml, 'text/html');
                        const skillsTable = ajaxDoc.querySelector('.player_skills');
                        if (skillsTable) {
                            const skills = {};
                            const skillRows = skillsTable.querySelectorAll('tbody > tr');
                            skillRows.forEach((row, index) => {
                                const skillId = (index + 1).toString();
                                const skillName = SKILL_MAP[skillId];
                                if (skillName) {
                                    const valueElem = row.querySelector('td.skillval > span');
                                    if (valueElem) {
                                        const value = parseInt(valueElem.textContent.trim().replace(/[()]/g, ''), 10);
                                        if (!isNaN(value)) {
                                            skills[skillName] = value;
                                        } else {
                                            skills[skillName] = 0;
                                        }
                                    } else {
                                        skills[skillName] = 0;
                                    }
                                }
                            });

                            if (Object.keys(skills).length === ORDERED_SKILLS.length) {
                                resolve(skills);
                            } else {
                                reject("Could not extract all expected skills from the AJAX response table.");
                            }
                        } else {
                            reject("Skills table not found in AJAX response.");
                        }
                    } catch (e) {
                        reject("Error parsing AJAX response: " + e.message);
                    }
                } else {
                    reject("No player data found in AJAX response.");
                }
            })
                .catch(error => {
                reject("Error during fetch request: " + error.message);
            });
        });
    }

    const fetchCombinedPlayerData = async (pid, node, getSeasonFn, csi) => {
        const cont = getPlayerContainerNode(node);
        if (!cont) return;
        const curSeason = csi.season;
        const nmEl = cont.querySelector('.player_name');
        const nm = nmEl ? nmEl.textContent.trim() : 'Unknown Player';
        const { modal, spinnerEl, spinnerInstance } = createModal('', true);
        const currentAge = parsePlayerAge(cont);

        try {
            let currentSkillsMap = {};
            const isSpecificPlayerPage = window.location.href.includes('/?p=players&pid=');

            if (isSpecificPlayerPage) {
                if (hasVisibleSkills(cont)) {
                    currentSkillsMap = gatherCurrentSkills(cont);
                } else {
                    try {
                        currentSkillsMap = await fetchCurrentSkillsViaAjax(pid);
                    } catch (fetchError) {
                        throw new Error(`Could not retrieve current skills via AJAX. ${fetchError.message || fetchError}`);
                    }
                }
            } else {
                currentSkillsMap = gatherCurrentSkills(cont);
            }

            if (!currentSkillsMap || Object.keys(currentSkillsMap).length === 0) {
                throw new Error("Failed to determine current skills for player.");
            }

            const [trainingResponse, scoutData, transferData] = await Promise.all([
                fetch(`https://www.managerzone.com/ajax.php?p=trainingGraph&sub=getJsonTrainingHistory&sport=soccer&player_id=${pid}`).then(res => res.ok ? res.text() : Promise.reject(`HTTP error ${res.status} for training data`)),
                fetchScoutData(pid),
                fetchTransferData(pid, getSeasonFn)
            ]);

            if (spinnerInstance) spinnerInstance.stop();
            spinnerEl.style.display = 'none';

            const series = parseSeriesData(trainingResponse);
            const processedTrainingData = processTrainingHistory(series, getSeasonFn);
            const transferSeasons = Object.keys(transferData).map(s => parseInt(s)).filter(s => !isNaN(s));
            let effectiveEarliestSeason = processedTrainingData.earliestSeason;

            if (transferSeasons.length > 0) {
                const earliestTransferSeason = Math.min(...transferSeasons);
                effectiveEarliestSeason = Math.max(1, Math.min(effectiveEarliestSeason, earliestTransferSeason));
            }

            if (effectiveEarliestSeason === 9999) {
                if (transferSeasons.length > 0) {
                    effectiveEarliestSeason = Math.max(1, Math.min(...transferSeasons));
                } else {
                    effectiveEarliestSeason = curSeason;
                }
            }
            processedTrainingData.earliestSeason = effectiveEarliestSeason;

            const evoHTML = generateEvolHTML(processedTrainingData, currentAge, curSeason);
            const stHTML = buildStatesLayout(processedTrainingData, currentSkillsMap, currentAge, curSeason, scoutData, transferData);
            const finalHTML = generateTabsHTML(nm, evoHTML, stHTML);
            modal.querySelector('.th-modal-content').innerHTML = finalHTML;

            setTimeout(() => {
                attachTabEvents(modal);
                initPaginationState(modal);
            }, 50);

        } catch (error) {
            if (spinnerInstance) spinnerInstance.stop();
            if(spinnerEl) spinnerEl.style.display = 'none';
            const contentDiv = modal.querySelector('.th-modal-content');
            if (contentDiv) {
                contentDiv.innerHTML = `<div class="th-error-message"><p>Failed to process player data. (${error.message || 'Unknown error'})</p></div>`;
            }
        }
    };

    async function fetchComparativePlayerData(pid, getSeasonFn, currentSeason) {
        try {
            const playerPageResponse = await fetch(`https://www.managerzone.com/?p=players&pid=${pid}`);
            if(!playerPageResponse.ok) throw new Error(`HTTP ${playerPageResponse.status} for player page`);
            const playerPageText = await playerPageResponse.text();
            const doc = new DOMParser().parseFromString(playerPageText, 'text/html');

            const nameEl = doc.querySelector('.player_name');
            const name = nameEl ? nameEl.textContent.trim() : `Player ${pid}`;
            const age = parsePlayerAge(doc.body);
            if (!age) throw new Error('Could not parse age');

            const trainingResponse = await fetch(`https://www.managerzone.com/ajax.php?p=trainingGraph&sub=getJsonTrainingHistory&sport=soccer&player_id=${pid}`);
            if(!trainingResponse.ok) throw new Error(`HTTP ${trainingResponse.status} for training data`);
            const trainingText = await trainingResponse.text();

            const scoutData = await fetchScoutData(pid);
            if(!scoutData) throw new Error('Could not fetch scout data');

            const series = parseSeriesData(trainingText);
            const { bySeason, chipsBySeason } = processTrainingHistory(series, getSeasonFn);

            const gainsByAge = {};
            Object.keys(bySeason).forEach(seasonStr => {
                const season = parseInt(seasonStr, 10);
                const historicalAge = calculateHistoricalAge({ currentAge: age, currentSeason, targetSeason: season });
                if (historicalAge) {
                    if (!gainsByAge[historicalAge]) {
                        gainsByAge[historicalAge] = { gains: 0, chips: [] };
                    }
                    gainsByAge[historicalAge].gains += bySeason[season].length;
                    if (chipsBySeason[season]) {
                        const chipNames = chipsBySeason[season].map(c => c.name);
                        gainsByAge[historicalAge].chips.push(...chipNames);
                    }
                }
            });

            return {
                pid,
                name,
                trainingSpeed: scoutData.trainingSpeed || 0,
                gainsByAge,
                totalGains: Object.values(gainsByAge).reduce((sum, ageData) => sum + ageData.gains, 0)
            };
        } catch (error) {
            throw new Error(`Failed to fetch data for PID ${pid}: ${error.message}`);
        }
    }

    function buildComparisonTable(playersData, allAges) {
        let tableHtml = `<table class="th-compare-table"><thead><tr><th>Age</th>`;
        playersData.forEach(p => {
            tableHtml += `<th>${p.name}</th>`;
        });
        tableHtml += `</tr><tr><td class="th-table-subheader"></td>`;
        playersData.forEach(p => {
            tableHtml += `<td class="th-table-subheader th-speed-s${p.trainingSpeed}">${p.trainingSpeed > 0 ? `S${p.trainingSpeed}` : ''}</td>`;
        });
        tableHtml += `</tr></thead><tbody>`;

        allAges.forEach(age => {
            tableHtml += `<tr><td>${age}</td>`;
            playersData.forEach(p => {
                const ageData = p.gainsByAge[age];
                const gains = ageData?.gains || 0;
                const chips = ageData?.chips || [];
                let cellContent = gains > 0 ? gains : '-';
                if (chips.length > 0) {
                    cellContent += ' ' + chips.map(chipName => generateChipDisplayHTML(chipName, true)).join('');
                }
                tableHtml += `<td>${cellContent}</td>`;
            });
            tableHtml += `</tr>`;
        });

        tableHtml += `</tbody><tfoot><tr><td>Total Gains</td>`;
        playersData.forEach(p => {
            tableHtml += `<td>${p.totalGains}</td>`;
        });
        tableHtml += `</tr></tfoot></table>`;
        return tableHtml;
    }

    function renderComparisonChart(chartContainerId, players, chartTitle, isCumulative, dataKey, xAxisLabels, labelFormatter) {
        const container = document.getElementById('th-compare-graphical-results');

        if (comparisonChartInstances[chartContainerId]) {
            comparisonChartInstances[chartContainerId].dispose();
            delete comparisonChartInstances[chartContainerId];
        }

        const oldChartWrapper = container.querySelector(`.th-chart-wrapper[data-chart-id="${chartContainerId}"]`);
        if (oldChartWrapper) {
            oldChartWrapper.remove();
        }

        if (xAxisLabels.length === 0) return;

        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'th-chart-wrapper';
        chartWrapper.dataset.chartId = chartContainerId;
        chartWrapper.innerHTML = `${chartTitle ? `<h3>${chartTitle}</h3>` : ''}<div id="${chartContainerId}" style="height: 100%; width: 100%;"></div>`;
        container.appendChild(chartWrapper);

        const chartDom = document.getElementById(chartContainerId);
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);

        const colors = ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#ff8c00', '#5f9ea0', '#6b8e23', '#4682b4', '#d2691e'];

        const seriesData = players.map(p => {
            let cumulativeValue = 0;
            const playerDataSet = p[dataKey] || {};
            const data = xAxisLabels.map(label => {
                let value = (dataKey === 'gainsByAge') ? (playerDataSet[label]?.gains || 0) : (playerDataSet[label] || 0);
                if (isCumulative) {
                    cumulativeValue += value;
                    return cumulativeValue;
                }
                return value;
            });
            return {
                name: `${p.name} (S${p.trainingSpeed})`,
                type: 'line',
                smooth: true,
                data: data,
            };
        });

        const option = {
            color: colors,
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: seriesData.map(s => s.name),
                type: 'scroll'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: labelFormatter(xAxisLabels)
            },
            yAxis: {
                type: 'value'
            },
            series: seriesData
        };

        myChart.setOption(option);
        comparisonChartInstances[chartContainerId] = myChart;
    }

    const attachCompareTabEvents = (modal) => {
        const compareBtn = modal.querySelector('#th-compare-btn');
        if (!compareBtn) return;
        const csi = getCurrentSeasonInfo();
        if (!csi) return;
        const getSeasonFn = getSeasonCalculator(csi);

        compareBtn.addEventListener('click', async () => {
            const pidsInput = modal.querySelector('#th-compare-pids');
            const textualResultsDiv = modal.querySelector('#th-compare-textual-results');
            const graphicalResultsDiv = modal.querySelector('#th-compare-graphical-results');
            const errorLogDiv = modal.querySelector('#th-compare-error-log');
            const spinnerDiv = modal.querySelector('#th-compare-spinner');

            textualResultsDiv.innerHTML = '';
            graphicalResultsDiv.innerHTML = '';
            errorLogDiv.innerHTML = '';
            Object.values(comparisonChartInstances).forEach(instance => instance.dispose());
            comparisonChartInstances = {};

            const pids = [...new Set(pidsInput.value.split(',').map(id => id.trim()).filter(id => /^\d+$/.test(id)))];
            if (pids.length === 0) {
                textualResultsDiv.innerHTML = '<div class="th-no-data-message"><p>Please enter at least one valid player ID.</p></div>';
                return;
            }

            const spinner = new Spinner({ color: '#5555aa', lines: 12 }).spin(spinnerDiv);
            spinnerDiv.style.display = 'block';

            const results = await Promise.allSettled(pids.map(pid => fetchComparativePlayerData(pid, getSeasonFn, csi.season)));

            spinner.stop();
            spinnerDiv.style.display = 'none';

            const successfulPlayers = [];
            const failedPids = [];

            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    successfulPlayers.push(result.value);
                } else {
                    failedPids.push({ pid: pids[index], reason: result.reason.message });
                }
            });

            if (failedPids.length > 0) {
                errorLogDiv.innerHTML = '<p>Could not fetch data for the following players:</p><ul>' +
                    failedPids.map(f => `<li><strong>ID ${f.pid}:</strong> ${f.reason}</li>`).join('') +
                    '</ul>';
            }

            if (successfulPlayers.length > 0) {
                successfulPlayers.sort((a, b) => b.trainingSpeed - a.trainingSpeed);

                const allAges = [...new Set(successfulPlayers.flatMap(p => Object.keys(p.gainsByAge)))]
                    .map(age => parseInt(age, 10))
                    .sort((a, b) => a - b);

                if (allAges.length > 0) {
                    textualResultsDiv.innerHTML = buildComparisonTable(successfulPlayers, allAges);

                    const ageLabelFormatter = ages => ages.map(age => `${age} yrs`);

                    renderComparisonChart(
                        'all-players-age-chart',
                        successfulPlayers,
                        '',
                        false,
                        'gainsByAge',
                        allAges,
                        ageLabelFormatter
                    );
                } else {
                     textualResultsDiv.innerHTML = '<div class="th-no-data-message"><p>No training history found for the selected players.</p></div>';
                     graphicalResultsDiv.innerHTML = '<div class="th-no-data-message"><p>No training history found to generate charts.</p></div>';
                }
            } else if (failedPids.length > 0) {
                 textualResultsDiv.innerHTML = '<div class="th-error-message"><p>Failed to retrieve data for all specified players.</p></div>';
            }
        });
    };

    const insertButtons = (getSeasonFn, csi) => {
        const containers = document.querySelectorAll('.playerContainer');
        const isPlayerProfilePage = window.location.href.includes('/?p=players&pid=');

        containers.forEach(cc => {
            const targetElements = cc.querySelectorAll('.floatRight[id^="player_id_"]');

            targetElements.forEach(ff => {
                const pidSpan = ff.querySelector('.player_id_span');
                if (!pidSpan) return;
                const pid = pidSpan.textContent.trim();
                if (!pid) return;

                const existingBtn = ff.querySelector('.th-btn');
                if (existingBtn) return;

                let shouldInsert = false;
                const disabledGraphIcon = cc.querySelector('.training-graphs-icon.training-graphs-icon--disabled');

                if (!disabledGraphIcon) {
                    if (isPlayerProfilePage) {
                        const trainingGraphIcon = document.querySelector(
                            `span.player_icon_placeholder.training_graphs.soccer a[href*="p=training_graphs"][href*="pid=${pid}"]`
                        );
                        if (trainingGraphIcon) {
                            shouldInsert = true;
                        }
                    } else {
                        if (hasVisibleSkills(cc)) {
                            shouldInsert = true;
                        }
                    }
                }

                if (shouldInsert) {
                    const b = document.createElement('button');
                    b.className = 'th-btn';
                    b.innerHTML = '<i class="fa fa-chart-line"></i>';
                    b.title = 'View Training History';
                    b.onclick = (e) => {
                        e.preventDefault();
                        fetchCombinedPlayerData(pid, ff, getSeasonFn, csi);
                    };
                    ff.appendChild(b);
                }
            });
        });
    };

    const initTeamId = () => {
        const stored = GM_getValue('TEAM_ID');
        if (stored) {
            myTeamId = stored;
            return;
        }
        const usernameEl = document.querySelector('#header-username');
        if (!usernameEl) return;
        const username = usernameEl.textContent.trim();
        if (!username) return;

        fetch(`https://www.managerzone.com/xml/manager_data.php?sport_id=1&username=${encodeURIComponent(username)}`)
            .then(response => {
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return response.text();
        })
            .then(text => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/xml');
            const teamNodes = doc.querySelectorAll('Team[sport="soccer"]');
            if (!teamNodes || !teamNodes.length) return;
            const tid = teamNodes[0].getAttribute('teamId');
            if (tid) {
                GM_setValue('TEAM_ID', tid);
                myTeamId = tid;
            }
        }).catch((_err) => {});
    };

    const run = () => {
        initTeamId();
        if (!canRunUserscript()) {
            return;
        }
        const csi = getCurrentSeasonInfo();
        if (!csi) {
            return;
        }
        const getSeasonFn = getSeasonCalculator(csi);
        insertButtons(getSeasonFn, csi);

        const obs = new MutationObserver((mutations) => {
            let playerContainerChanged = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    if (mutation.target.matches && (mutation.target.matches('.playerContainer') || mutation.target.querySelector('.playerContainer'))) {
                        playerContainerChanged = true;
                        break;
                    }
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && (node.matches('.playerContainer') || node.querySelector('.playerContainer'))) {
                            playerContainerChanged = true;
                            break;
                        }
                    }
                    if (playerContainerChanged) break;
                }
            }
            if (playerContainerChanged) {
                insertButtons(getSeasonFn, csi);
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    };

    run();
})();