// ==UserScript==
// @name         Platesmania Code Counter
// @version      1.1.2
// @description  Show country statistics for a user
// @author       You
// @match        https://platesmania.com/user*
// @grant        none
// @license     MIT
// @namespace https://greasyfork.org/users/976031
// @downloadURL https://update.greasyfork.org/scripts/524808/Platesmania%20Code%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/524808/Platesmania%20Code%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!/^\/user\d+$/.test(location.pathname)) return;

    const userId = window.location.href.match(/user(\d+)/)?.[1];
    if (!userId) {
        console.error('User ID could not be extracted.');
        return;
    }
    const button = document.createElement('button');
    button.innerHTML = 'Show Code Stats';
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        zIndex: '1000',
        padding: '10px 15px',
        backgroundColor: 'black',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    });
    const spinner = document.createElement('img');
    spinner.src = 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_%28wobbly%29.gif';
    Object.assign(spinner.style, {
        width: '20px',
        height: '20px',
        display: 'none',
    });
    button.appendChild(spinner);
    document.body.appendChild(button);
    button.addEventListener('click', async () => {
        const urls = [
            { url: `https://platesmania.com/userreg.php?gallery=al-${userId}`, name: `Albania` },
            { url: `https://platesmania.com/userreg.php?gallery=au-${userId}`, name: `Australia` },
            { url: `https://platesmania.com/userreg.php?gallery=at1-${userId}`, name: `Austria (1947 year system)` },
            { url: `https://platesmania.com/userreg.php?gallery=at3-${userId}`, name: `Austria (1990)` },
            { url: `https://platesmania.com/userreg.php?gallery=at2-${userId}`, name: `Austria (Official services and consulates)` },
            { url: `https://platesmania.com/userreg.php?gallery=az-${userId}`, name: `Azerbaijan` },
            { url: `https://platesmania.com/userreg.php?gallery=by3-${userId}`, name: `Belarus (1992)` },
            { url: `https://platesmania.com/userreg.php?gallery=by2-${userId}`, name: `Belarus (2000)` },
            { url: `https://platesmania.com/userreg.php?gallery=by1-${userId}`, name: `Belarus (2004)` },
            { url: `https://platesmania.com/userreg.php?gallery=br-${userId}`, name: `Brazil` },
            { url: `https://platesmania.com/userreg.php?gallery=bg-${userId}`, name: `Bulgaria` },
            { url: `https://platesmania.com/userreg.php?gallery=kh2-${userId}`, name: `Cambodia (Authorities)` },
            { url: `https://platesmania.com/userreg.php?gallery=kh1-${userId}`, name: `Cambodia (Regular plates)` },
            { url: `https://platesmania.com/userreg.php?gallery=ca-${userId}`, name: `Canada` },
            { url: `https://platesmania.com/userreg.php?gallery=cn-${userId}`, name: `China` },
            { url: `https://platesmania.com/userreg.php?gallery=hr-${userId}`, name: `Croatia` },
            { url: `https://platesmania.com/userreg.php?gallery=cz3-${userId}`, name: `Czech Republic (1960)` },
            { url: `https://platesmania.com/userreg.php?gallery=cz1-${userId}`, name: `Czech Republic (Cars, Motorcycles, Dealer)` },
            { url: `https://platesmania.com/userreg.php?gallery=cz2-${userId}`, name: `Czech Republic (Sportcars, Oldtimers)` },
            { url: `https://platesmania.com/userreg.php?gallery=eg1-${userId}`, name: `Egypt (2008)` },
            { url: `https://platesmania.com/userreg.php?gallery=fr2-${userId}`, name: `France (FNI)` },
            { url: `https://platesmania.com/userreg.php?gallery=fr1-${userId}`, name: `France (SIV)` },
            { url: `https://platesmania.com/userreg.php?gallery=de-${userId}`, name: `Germany` },
            { url: `https://platesmania.com/userreg.php?gallery=gr-${userId}`, name: `Greece` },
            { url: `https://platesmania.com/userreg.php?gallery=is1-${userId}`, name: `Iceland` },
            { url: `https://platesmania.com/userreg.php?gallery=is2-${userId}`, name: `Iceland (Diplomatic)` },
            { url: `https://platesmania.com/userreg.php?gallery=id-${userId}`, name: `Indonesia` },
            { url: `https://platesmania.com/userreg.php?gallery=iq-${userId}`, name: `Iraq` },
            { url: `https://platesmania.com/userreg.php?gallery=ie-${userId}`, name: `Ireland` },
            { url: `https://platesmania.com/userreg.php?gallery=it2-${userId}`, name: `Italy (1927)` },
            { url: `https://platesmania.com/userreg.php?gallery=it1-${userId}`, name: `Italy (1994)` },
            { url: `https://platesmania.com/userreg.php?gallery=jp-${userId}`, name: `Japan` },
            { url: `https://platesmania.com/userreg.php?gallery=kz1-${userId}`, name: `Kazakhstan (1993)` },
            { url: `https://platesmania.com/userreg.php?gallery=kz2-${userId}`, name: `Kazakhstan (2012)` },
            { url: `https://platesmania.com/userreg.php?gallery=kg1-${userId}`, name: `Kyrgyzstan (1994)` },
            { url: `https://platesmania.com/userreg.php?gallery=kg2-${userId}`, name: `Kyrgyzstan (2016)` },
            { url: `https://platesmania.com/userreg.php?gallery=my1-${userId}`, name: `Malaysia (A(BC) 1(234))` },
            { url: `https://platesmania.com/userreg.php?gallery=my2-${userId}`, name: `Malaysia (AB(C) 1(234) D)` },
            { url: `https://platesmania.com/userreg.php?gallery=my4-${userId}`, name: `Malaysia, Military` },
            { url: `https://platesmania.com/userreg.php?gallery=my3-${userId}`, name: `Malaysia, Taxi` },
            { url: `https://platesmania.com/userreg.php?gallery=mx-${userId}`, name: `Mexico` },
            { url: `https://platesmania.com/userreg.php?gallery=md1-${userId}`, name: `Moldova` },
            { url: `https://platesmania.com/userreg.php?gallery=mn-${userId}`, name: `Mongolia` },
            { url: `https://platesmania.com/userreg.php?gallery=me-${userId}`, name: `Montenegro` },
            { url: `https://platesmania.com/userreg.php?gallery=ma-${userId}`, name: `Morocco` },
            { url: `https://platesmania.com/userreg.php?gallery=mk1-${userId}`, name: `North Macedonia (1993)` },
            { url: `https://platesmania.com/userreg.php?gallery=mk2-${userId}`, name: `North Macedonia (2012)` },
            { url: `https://platesmania.com/userreg.php?gallery=no3-${userId}`, name: `Norway (1913-1971 - system)` },
            { url: `https://platesmania.com/userreg.php?gallery=no1-${userId}`, name: `Norway (Cars, Commercial vehicles, Tax-exempt vehicles)` },
            { url: `https://platesmania.com/userreg.php?gallery=no4-${userId}`, name: `Norway (Export/Tourist)` },
            { url: `https://platesmania.com/userreg.php?gallery=no2-${userId}`, name: `Norway (Trailers, motorcycles, special vehicles)` },
            { url: `https://platesmania.com/userreg.php?gallery=ps1-${userId}`, name: `Palestinian Authority (1994)` },
            { url: `https://platesmania.com/userreg.php?gallery=ps2-${userId}`, name: `Palestinian Authority (2018)` },
            { url: `https://platesmania.com/userreg.php?gallery=pl4-${userId}`, name: `Poland (1976)` },
            { url: `https://platesmania.com/userreg.php?gallery=pl1-${userId}`, name: `Poland (2000)` },
            { url: `https://platesmania.com/userreg.php?gallery=pl2-${userId}`, name: `Poland (Authorities, Military)` },
            { url: `https://platesmania.com/userreg.php?gallery=pl3-${userId}`, name: `Poland (Provisional and testing, Vanity Plates)` },
            { url: `https://platesmania.com/userreg.php?gallery=pt-${userId}`, name: `Portugal` },
            { url: `https://platesmania.com/userreg.php?gallery=ro-${userId}`, name: `Romania` },
            { url: `https://platesmania.com/userreg.php?gallery=ru-${userId}`, name: `Russia` },
            { url: `https://platesmania.com/userreg.php?gallery=rs-${userId}`, name: `Serbia` },
            { url: `https://platesmania.com/userreg.php?gallery=sk-${userId}`, name: `Slovakia` },
            { url: `https://platesmania.com/userreg.php?gallery=si-${userId}`, name: `Slovenia` },
            { url: `https://platesmania.com/userreg.php?gallery=kr-${userId}`, name: `South Korea` },
            { url: `https://platesmania.com/userreg.php?gallery=es4-${userId}`, name: `Spain (1900 year series)` },
            { url: `https://platesmania.com/userreg.php?gallery=es3-${userId}`, name: `Spain (1971 year series)` },
            { url: `https://platesmania.com/userreg.php?gallery=es2-${userId}`, name: `Spain (Official and military plates)` },
            { url: `https://platesmania.com/userreg.php?gallery=es1-${userId}`, name: `Spain (Specialty plates)` },
            { url: `https://platesmania.com/userreg.php?gallery=ch-${userId}`, name: `Switzerland` },
            { url: `https://platesmania.com/userreg.php?gallery=tj1-${userId}`, name: `Tajikistan (1996)` },
            { url: `https://platesmania.com/userreg.php?gallery=tj2-${userId}`, name: `Tajikistan (2009)` },
            { url: `https://platesmania.com/userreg.php?gallery=th-${userId}`, name: `Thailand` },
            { url: `https://platesmania.com/userreg.php?gallery=xx-${userId}`, name: `Transnistria (cars)` },
            { url: `https://platesmania.com/userreg.php?gallery=tr-${userId}`, name: `Turkey` },
            { url: `https://platesmania.com/userreg.php?gallery=ae-${userId}`, name: `UAE` },
            { url: `https://platesmania.com/userreg.php?gallery=us-${userId}`, name: `USA` },
            { url: `https://platesmania.com/userreg.php?gallery=su2-${userId}`, name: `USSR (1958)` },
            { url: `https://platesmania.com/userreg.php?gallery=su4-${userId}`, name: `USSR (1958, Trailers)` },
            { url: `https://platesmania.com/userreg.php?gallery=su1-${userId}`, name: `USSR (1977)` },
            { url: `https://platesmania.com/userreg.php?gallery=su3-${userId}`, name: `USSR (1977, Trailers)` },
            { url: `https://platesmania.com/userreg.php?gallery=ua1-${userId}`, name: `Ukraine (2004)` },
            { url: `https://platesmania.com/userreg.php?gallery=ua3-${userId}`, name: `Ukraine (Dealer 2004)` },
            { url: `https://platesmania.com/userreg.php?gallery=ua2-${userId}`, name: `Ukraine (Transit plates, Police, 2004)` },
            { url: `https://platesmania.com/userreg.php?gallery=uk5-${userId}`, name: `United Kingdom (1932 / 1903)` },
            { url: `https://platesmania.com/userreg.php?gallery=uk4-${userId}`, name: `United Kingdom (1963)` },
            { url: `https://platesmania.com/userreg.php?gallery=uk3-${userId}`, name: `United Kingdom (1983)` },
            { url: `https://platesmania.com/userreg.php?gallery=uk1-${userId}`, name: `United Kingdom (2001)` },
            { url: `https://platesmania.com/userreg.php?gallery=uk2-${userId}`, name: `United Kingdom (Northern Ireland (1966))` },
            { url: `https://platesmania.com/userreg.php?gallery=uz-${userId}`, name: `Uzbekistan` },
            { url: `https://platesmania.com/userreg.php?gallery=vn-${userId}`, name: `Vietnam` },
        ];
        const stats = [];
        for (const { name, url } of urls) {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const tableRows = doc.querySelectorAll('#example tbody tr');
            let spotted = 0;
            let total = 0;
            tableRows.forEach(row => {
                total++;
                const spotsCell = row.querySelector('td:nth-child(4)');
                if (spotsCell && spotsCell.querySelector('a')) {
                    spotted++;
                }
            });
            const percentage = total > 0 ? ((spotted / total) * 100).toFixed(2) : "0.00";
            const barWidth = percentage > 0 ? Math.min(100, percentage) : 0;
            const barHTML = `<div style="background: #ccc; height: 10px; width: 100%; border-radius: 5px; overflow: hidden;">
                    <div style="background: #007bff; height: 100%; width: ${barWidth}%;"></div>
                 </div>`;
            stats.push({ name, spotted, total, percentage, barHTML });
            spinner.style.display = 'inline';
            button.textContent = `Fetching ${name}...`;
            button.appendChild(spinner);
            console.log(`Fetched ${name}`);
        }
        spinner.style.display = 'none';
        button.textContent = 'Done';
        button.remove();
        const popup = document.createElement('div');
        Object.assign(popup.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '20px',
            zIndex: '9999',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            maxHeight: '90vh',
            overflowY: 'auto',
        });
        const heading = document.createElement('h3');
        heading.textContent = `Code Spotting Statistics for User ${userId}`;
        popup.appendChild(heading);
        stats.forEach(({ name, spotted, total, percentage, barHTML }) => {
            const statDiv = document.createElement('div');
            statDiv.style.marginBottom = '15px';
            const statText = document.createElement('p');
            statText.textContent = `${name}: ${spotted} / ${total} (${percentage}%)`;
            statDiv.appendChild(statText);
            const barContainer = document.createElement('div');
            barContainer.innerHTML = barHTML;
            statDiv.appendChild(barContainer);
            popup.appendChild(statDiv);
        });
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        Object.assign(closeButton.style, {
            marginTop: '10px',
            padding: '5px 10px',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
        });
        closeButton.addEventListener('click', () => popup.remove());
        popup.appendChild(closeButton);
        document.body.appendChild(popup);
    });
})();
