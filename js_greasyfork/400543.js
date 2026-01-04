// ==UserScript==
// @name           Deutsche Bank Vermögensentwicklung Table
// @name:de        Deutsche Bank Vermögensentwicklung Tabelle
// @namespace      https://windowsfreak.de
// @version        1.1
// @description    Display Vermögensentwicklung in various tables. Requires the Vermögensübersicht script.
// @description:de Stellt die Vermögensentwicklung in verschiedenen Tabellen dar. Benötigt das Vermögensübersicht-Skript.
// @author         Björn Eberhardt
// @license        MIT; https://opensource.org/licenses/MIT
// @icon           https://www.deutsche-bank.de/dam/deutschebank/de/shared/logo/deutsche_bank_logo_retina.gif
// @match          https://meine.deutsche-bank.de/trxm/db/invoke/*show.assets.overview.do?showTable=1
// @match          https://meine.deutsche-bank.de/trxm/db/invoke/*show.assets.overview.do?tab=purchase&showTable=1
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/400543/Deutsche%20Bank%20Verm%C3%B6gensentwicklung%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/400543/Deutsche%20Bank%20Verm%C3%B6gensentwicklung%20Table.meta.js
// ==/UserScript==
// MIT license used to import to OpenUserJS

(function() {
    'use strict';

    // Navigated to Vermögensaufstellung?
    if (document.getElementsByTagName('h1')[0].innerText === 'Vermögensaufstellung' && window.location.href.indexOf('showTable=1') > -1) {
        const user = document.getElementById('customerNumber').childNodes[1].data.trim().replace(/\s/, '_');
        const eur = str => parseFloat(str).toLocaleString([], {style: 'currency', currency: 'EUR'});
        const pct = str => parseFloat(str).toLocaleString([], {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2}).replace('\u00A0', '');
        const getNum = (bal, chg, dep = bal - chg, per = chg / dep) => ({
            bal: bal.toFixed(2),
            chg: chg.toFixed(2),
            dep: dep.toFixed(2),
            per: per.toFixed(4)
        });
        const navigateTo = target => {
            const url = new URL(window.location.href);
            for (let param of url.searchParams.keys()) {
                if (param.indexOf('show') >= 0) {
                    url.searchParams.delete(param);
                }
            }
            url.searchParams.append(target, '1');
            window.location.href = url.href;
        };
        const display = () => {
            // Collect all data from memory, print it in the console and also append it on the page below the table
            const wknref = JSON.parse(localStorage.getItem(`wf_${user}_wkn`) || '{}');
            const cats = JSON.parse(localStorage.getItem(`wf_${user}_cat`) || '{}');

            const days = {};
            for (let i = 0; i < localStorage.length; i++){
                const key = localStorage.key(i);
                if (key.startsWith(`wf_${user}_stats`)) {
                    days[key] = JSON.parse(localStorage.getItem(key));
                }
            }
            const rows = [];
            Object.keys(days).sort().forEach(key => rows.push(days[key]));

            // Gesamtstatistik
            const heads = [
                'ISO-Datum',
                'Datum',
            ];
            const heads_gesamtstatistik = [
                ...heads,
                'Eingezahlt',
                'Saldo',
                'Anlagekonto',
                'Investiert',
                'Bestand',
                'G/V',
                'G/V%'
            ];
            const lines_gesamtstatistik = [];
            for (let i = 0; i < rows.length; i++){
                const r = rows[i],
                    t = getNum(r.tbal, r.tchg),
                    b = getNum(r.bbal, r.bchg),
                    a = getNum(r.tbal - r.bbal, r.tchg - r.bchg);
                lines_gesamtstatistik.push([r.d_str, r.d, eur(t.dep), eur(t.bal), eur(b.bal), eur(a.dep), eur(a.bal), eur(a.chg), pct(a.per)].join(';'));
            }
            const str_gesamtstatistik = 'Gesamtstatistik\n\n' + [heads_gesamtstatistik.join(';'), ...lines_gesamtstatistik].join('\n');
            console.log(str_gesamtstatistik);

            // Fixate WKN order
            const wkns = [];
            const heads_wkn = [];
            for (const k in wknref) {
                const v = wknref[k];
                wkns.push([k, v]);
                heads_wkn.push(k + ' - ' + v);
            }

            const mapFn = (row, columns, dataSource, fieldFn, l = [row.d_str, row.d]) => {
                columns.forEach(v => {
                    const dat = dataSource[typeof v == "string" ? v : v[0]];
                    l.push(dat && fieldFn(dat))
                });
                return l.join(';');
            };

            // Gewinn und Verlust pro Aktie
            const str_guv = 'G/V je Fonds\n\n' + [
                [...heads, ...heads_wkn].join(';'),
                ...rows.map(r => mapFn(r, wkns, r.wkns, dat => eur(dat.chg)))
            ].join('\n');
            console.log(str_guv);

            // Bestand pro Aktie
            const str_bal = 'Bestand je Fonds\n\n' + [
                [...heads, ...heads_wkn].join(';'),
                ...rows.map(r => mapFn(r, wkns, r.wkns, dat => eur(dat.bal)))
            ].join('\n');
            console.log(str_bal);

            // Gewinn und Verlust pro Kategorie
            const str_cguv = 'G/V je Kategorie\n\n' + [
                [...heads, ...cats].join(';'),
                ...rows.map(r => mapFn(r, cats, r.cats, dat => eur(dat.chg)))
            ].join('\n');
            console.log(str_cguv);

            // Bestand pro Kategorie
            const str_cbal = 'Bestand je Kategorie\n\n' + [
                [...heads, ...cats].join(';'),
                ...rows.map(r => mapFn(r, cats, r.cats, dat => eur(dat.bal)))
            ].join('\n');
            console.log(str_cbal);

            const d = document.createElement('div');
            d.innerHTML = 'Der Abruf der Daten wurde erfolgreich beendet.<br /> <input type="button" value="Tabelle zeigen" class="button nextStep"> <input type="button" value="Diagramm zeigen" class="button nextStep">';
            d.getElementsByTagName('input')[0].onclick = () => navigateTo('showTable');
            d.getElementsByTagName('input')[1].onclick = () => navigateTo('showChart');

            const p = document.createElement('pre');
            p.style.maxWidth = '800px';
            p.style.overflowX = 'auto';
            p.style.lineHeight = '100%';
            p.style.fontSize = '.875em';
            p.textContent = str_gesamtstatistik + '\n\n' + str_cguv + '\n\n' + str_cbal + '\n\n' + str_guv + '\n\n' + str_bal;
            document.getElementById('assetsOverviewForm').prepend(p);
            document.getElementById('assetsOverviewForm').prepend(d);
        };

        display();
    }
})();
