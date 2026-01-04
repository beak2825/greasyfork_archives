// ==UserScript==
// @name         GreasyFork Search
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  To search scripts using Google Search
// @author       CY Fung
// @match        https://greasyfork.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @require      https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@d897f4cbe709f61ba4a57903f252c64903aedfe1/library/sort-by-PCA.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468495/GreasyFork%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/468495/GreasyFork%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let input = document.querySelector('form input[name="q"]');
    if (!(input instanceof HTMLInputElement)) return;
    let form = input.closest('form');
    if (!(form instanceof HTMLFormElement)) return;


    let locales = [...document.querySelectorAll('select#language-selector-locale > option')].map(x => x.value)

    document.head.appendChild(document.createElement('style')).textContent = `


    @keyframes rs1tmAnimation {
        0% {
            background-position-x: 3px;
        }
        100% {
            background-position-x: 4px;
        }
    }

    form.rs1tm{
        position: fixed;
        top:-300px;
        left:-300px;
        width: 1px;
        height: 1px;
        contain: strict;
        display: flex;
        overflow: hidden;
        animation: rs1tmAnimation 1ms linear 1ms 1 normal forwards;
    }

    `
    document.addEventListener('animationstart', (evt) => {

        if (evt.animationName === 'rs1tmAnimation') {
            const target = evt.target;
            target && target.parentNode && target.remove();
        }

    }, true);

    window.callback947 = function (rainijpolynomialRegressionJs) {
        if (!rainijpolynomialRegressionJs) return;
        const { PolynomialFeatures, PolynomialRegressor, RegressionError } = rainijpolynomialRegressionJs;
        if (!PolynomialFeatures || !PolynomialRegressor || !RegressionError) return;

        console.log(rainijpolynomialRegressionJs)
    }

    form.addEventListener('submit', function (evt) {

        try {


            let form = evt.target;
            if (!(form instanceof HTMLFormElement)) return;
            let input = form.querySelector('input[name="q"]');
            if (!(input instanceof HTMLInputElement)) return;

            if (form.classList.contains('rs1tm')) return;

            let value = input.value;
            const lang = document.documentElement.lang || '';

            let useLang = false;


            let u = 0;
            let isGoogleSearch = false;

            let sites = [];

            const split = value.split(/\s+/);
            let forceLang = 'all';
            let reformedSplit = [];
            for (const s of split) {

                if (!isGoogleSearch && /^[a-z][a-z0-9_-]{2,}(\.[a-z][a-z0-9_-]{2,})*(\.[a-z-]{2,4})+$/.test(s)) {
                    if (/\.(js|css|html|htm|xml|img|svg|txt|php|cgi|xhtml|ini|vue|xhr|ajax)$/.test(s)) {
                        reformedSplit.push(s);
                    } else {
                        sites.push(s);
                    }
                } else if (s === 'js') {
                    forceLang = 'js'; reformedSplit.push(s);
                } else if (s === 'css') {
                    forceLang = 'css'; reformedSplit.push(s);
                } else if (s === 'user.js') {
                    forceLang = 'js';
                } else if (s === 'user.css') {
                    forceLang = 'css';
                } else if (s === '"js"') {
                    reformedSplit.push('js');
                } else if (s === '"css"') {
                    reformedSplit.push('css');
                } else if (u === 0 && s === 'g') {
                    isGoogleSearch = true;
                } else if (locales.indexOf(s) >= 0 || s === lang) {
                    useLang = s;
                } else {
                    reformedSplit.push(s);
                }
                u++;
            }
            console.log(sites)

            value = reformedSplit.join(' ')

            let onlySite = '';

            if (sites.length === 1 && sites[0]) {
                onlySite = sites[0];
            }

            /*
              if (!isGoogleSearch && onlySite && /\.\w+\.\w+/.test(onlySite)) {
                  alert('Greasy Fork only lists eTLD+1.');
                      evt.preventDefault();
                  evt.stopImmediatePropagation();
                  evt.stopPropagation();
                  return;
              }
              */


            if (isGoogleSearch && value) {
                let q = value.replace('g ', '');

                let m = "-inurl%3A%22%2Fusers%2F%22+-inurl%3A%22%2Fdiscussions%22-inurl%3A%22%2Fstats%22+-inurl%3A%22%2Ffeedback%22+-inurl%3A%22%2Fcode%22+-inurl%3A%22q%3D%22+-inurl%3A%22%2Fby-site%2F%22+inurl%3A%22%2Fscripts%2F%22+site%3Agreasyfork.org";



                let lr = useLang ? `&lr=lang_${useLang}` : '';
                evt.preventDefault();
                evt.stopImmediatePropagation();
                evt.stopPropagation();
                location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}+${m}${lr}`

            } else if (!isGoogleSearch && (value || onlySite)) {


                let newForm = document.createElement('form');
                newForm.className = 'rs1tm';
                const copyAttr = (x) => {
                    let t = form.getAttribute(x);
                    if (typeof t === 'string') newForm.setAttribute(x, t);
                }
                copyAttr('action');
                copyAttr('accept-charset');
                copyAttr('method');
                newForm.innerHTML = `<input name="q" type="hidden" value="" /><input name="site" type="hidden" /><input name="language" type="hidden" value="all" /><input name="sort" type="hidden" /><input name="vl" type="hidden" value="">`


                const nq = newForm.querySelector('input[name="q"]');
                const language = newForm.querySelector('input[name="language"]');
                const site = newForm.querySelector('input[name="site"]');
                const sort = newForm.querySelector('input[name="sort"]');

                value = value.replace(/\s+/g, ' ');
                site.value = onlySite;

                if (form.getAttribute('action') === `/${lang}/scripts` && useLang && useLang !== lang) {
                    form.setAttribute('action', `/${useLang}/scripts`)
                }


                if (site.value === '') site.remove();

                nq.value = value;

                language.value = forceLang;

                if (language.value === '') language.remove();


                sort.value = 'updated';

                let sorting = document.querySelector('#script-list-sort');
                if (sorting) {
                    let sorts1 = {
                        nil: 0,
                        daily_installs: 0,
                        total_installs: 0,
                        ratings: 0,
                        created: 0,
                        updated: 0,
                        name: 0
                    }
                    let sorts2 = {
                        daily_installs: 0,
                        total_installs: 0,
                        ratings: 0,
                        created: 0,
                        updated: 0,
                        name: 0
                    }
                    const allOptions = sorting.querySelectorAll('.list-option');
                    const sorts = allOptions.length === 6 ? (sorts2) : (sorts1);
                    const keys = Object.keys(sorts)

                    if (allOptions.length === keys.length) {


                        for (const key of keys) {
                            let e = `.list-option:not(.list-current) a[href$="sort=${key}"]`
                            if (key === 'nil') {
                                e = `.list-option:not(.list-current) a[href]:not([href*="sort="])`
                                e = sorting.querySelector(e)
                            } else {
                                e = sorting.querySelector(e)
                            }

                            if (e) {
                                sorts[key] = 1;
                            }

                        }



                        let p = Object.entries(sorts).filter(r => !r[1])
                        if (p.length === 1) {
                            sort.value = p[0][0]
                        }

                    }

                }




                if (sort.value === '') sort.remove();

                evt.preventDefault();
                evt.stopImmediatePropagation();
                evt.stopPropagation();

                form.parentNode.insertBefore(newForm, form);
                newForm.submit();
                Promise.resolve().then(() => {
                    newForm.remove();
                })


            } else {
                evt.preventDefault();
                evt.stopImmediatePropagation();
                evt.stopPropagation();
            }

        } catch (e) {
            console.log(e);

            evt.preventDefault();
            evt.stopImmediatePropagation();
            evt.stopPropagation();
        }

    })

    // Your code here...
})();

(() => {

    function prettyMatrix(A) {
        let w = '';
        for (let i = 0; i < A.length; i++) {
            for (let j = 0; j < A[i].length; j++) {
                w += A[i][j].toFixed(4) + '\t'
            }
            w += '\n\t';
        }
        return '[\n\t' + w.trim() + '\n]';
    }

    // Compute z-scores + mean + sample sd in one function (numerically stable)
    function standardizeWithStats(values) {
        const n = values.length;
        if (n === 0) {
            throw new Error("Cannot standardize an empty array");
        }

        // ----- Pass 1: numerically stable mean & variance (Welford) -----
        let mean = 0;
        let M2 = 0; // sum of squared deviations from the mean
        let count = 0;

        for (let i = 0; i < n; i++) {
            const x = values[i];
            count += 1;
            const delta = x - mean;
            mean += delta / count;
            const delta2 = x - mean;
            M2 += delta * delta2;
        }

        const variance = count > 1 ? M2 / (count - 1) : 0; // sample variance
        const sd = Math.sqrt(variance);

        // ----- Pass 2: standardize using (x - mean) / sd -----
        const z = new Array(n);

        // If sd is 0 or not finite, return all zeros to avoid NaN/Infinity
        if (sd === 0 || !isFinite(sd)) {
            for (let i = 0; i < n; i++) {
                z[i] = 0;
            }
        } else {
            const invSd = 1 / sd;
            for (let i = 0; i < n; i++) {
                z[i] = (values[i] - mean) * invSd;
            }
        }

        return { z, mean, sd };
    }


    /**
     * Generates averaged standardized z-scores for daily and total values.
     *
     * @param {Array} data - Array of objects with { daily, total }
     * @param {Function} standardizeWithStats - Function returning { z: [...] }
     * @param {number} repeats - Number of noisy sampling repetitions (default 5)
     * @returns {Array} Array of [avgDailyZ, avgTotalZ] pairs
     */
    function generateAveragedZScores(data, repeats = 5) {
        const dailyZ = Array.from({ length: repeats }, () => []);
        const totalZ = Array.from({ length: repeats }, () => []);

        for (let r = 0; r < repeats; r++) {
            const daily = data.map(d => d.daily * 100 + Math.round(25 + 50 * Math.random()));
            const total = data.map(d => d.total * 100 + Math.round(25 + 50 * Math.random()));

            const uDaily = standardizeWithStats(daily);
            const uTotal = standardizeWithStats(total);

            dailyZ[r] = uDaily.z;
            totalZ[r] = uTotal.z;
        }

        return data.map((_, i) => {
            const avgDaily = dailyZ.reduce((sum, arr) => sum + arr[i], 0) / repeats;
            const avgTotal = totalZ.reduce((sum, arr) => sum + arr[i], 0) / repeats;
            return [avgDaily, avgTotal];
        });
    }

    const getY = (data) => {

        const dataA = generateAveragedZScores(data);

        // dataA = dataA.slice(0, 4)
        // console.log(dataA)

        const res = sortByPCA(dataA);
        return res.scores;

    }

    class AvgMap {
        constructor() {
            this.map = new Map();
        }
        add(key, val) {
            let m = this.map.get(key);
            if (!m) this.map.set(key, (m = [0, 0]));
            m[0] += val;
            m[1]++;
        }
        avg(key) {
            let m = this.map.get(key);
            if (!m) return 0;
            return m[0] / m[1];
        }
    }


    requestAnimationFrame(() => {

        setTimeout(() => {

            if ((location.search.includes('sort=updated') || location.search.includes('sort=created')) && location.pathname.endsWith('/scripts')) { } else return;
            if (!/[?&]vl=/.test(location.search)) return;
            let items = document.querySelectorAll('[data-script-id][data-script-daily-installs][data-script-total-installs]');

            let data = [...items].map(e => ({
                id: parseInt(e.getAttribute('data-script-id')),
                daily: parseInt(e.getAttribute('data-script-daily-installs')),
                total: parseInt(e.getAttribute('data-script-total-installs'))
            })).filter(e => e.id && !isNaN(e.daily) && !isNaN(e.total));
            const Y = getY(data);



            let q = null;
            let qSet = null;
            if (location.search.includes('q=')) {
                q = new URLSearchParams(location.search)
                q = q.get('q')

            }

            function makeQA(q) {
                let qSet = new Set();
                q.replace(/_-/g, ' ').replace(/\b\S+\b/g, (_) => {
                    qSet.add(_.toLowerCase())
                });
                return qSet;
            }

            if (q) {
                qSet = makeQA(q);
            }

            let mr = new Map();
            let u = 0;

            const pcaScoreMap = new AvgMap();
            for (const d of data) {
                const k = `${d.daily}|${d.total}`;
                pcaScoreMap.add(k, Y[u++]);
            }

            for (const d of data) {
                const k = `${d.daily}|${d.total}`;
                d.pcaScore = pcaScoreMap.avg(k);
                let elm = document.querySelector(`[data-script-id="${d.id}"]`);
                if (elm) {

                    let order = 0;
                    order -= Math.floor(d.pcaScore * 1000);

                    let u1 = new Set(), u2 = new Set();

                    if (qSet) {

                        const pSet = qSet;

                        let elp = elm.querySelector('.script-link')
                        if (elp) {
                            let t = elp.textContent

                            t.replace(/_-/g, ' ').replace(/\b\S+\b/g, (_) => {
                                if (pSet.has(_.toLowerCase())) u1.add(_.toLowerCase());
                            });


                        }



                        let elq = elm.querySelector('.script-description')

                        if (elq) {
                            let t = elq.textContent

                            t.replace(/_-/g, ' ').replace(/\b\S+\b/g, (_) => {
                                if (pSet.has(_.toLowerCase())) u2.add(_.toLowerCase());
                            });


                        }


                    }
                    u1 = u1.size;
                    u2 = u2.size;

                    if (u1 > 0 && u2 > 0 && u1 > 3 * u2 + 2) order -= 58000
                    else if (u1 > 0 && u2 > 0 && u2 > 3 * u1 + 2) order -= 54000
                    else if (u1 > 0 && u2 > 0 && u1 > 2 * u2 + 1) order -= 48000
                    else if (u1 > 0 && u2 > 0 && u2 > 2 * u1 + 1) order -= 44000
                    else if (u1 > 0 && u2 > 0 && u1 > u2) order -= 38000
                    else if (u1 > 0 && u2 > 0 && u2 > u1) order -= 34000
                    else if (u1 && u2) order -= 30000
                    else if (u1) order -= 20000
                    else if (u2) order -= 10000


                    mr.set(d.id, order);
                    // elm.style.order = order;
                    // elm.parentNode.style.display = 'flex';


                    // elm.parentNode.style.flexDirection = 'column';


                }
            }


            let lists = [...new Set([...document.querySelectorAll(`[data-script-id]`)].map(p => p.parentNode))];
            for (const list of lists) {

                let m = [...list.childNodes].map((e, originalIdx) => ({
                    originalIdx,
                    element: e,
                    order: mr.get(e instanceof HTMLElement ? (+e.getAttribute('data-script-id') || '') : '') || 0
                }));

                m.sort((a, b) => {
                    return a.order - b.order || a.originalIdx - b.originalIdx
                });
                let newNodes = m.map(e => e.element);

                list.replaceChildren(...newNodes);
            }


            // console.log(prettyMatrix(X))

            // console.log(prettyMatrix(Y))





        }, 300);

    });



})();