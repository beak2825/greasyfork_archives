// ==UserScript==
// @name         Torn Trade Export
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds “Export CSV” into the top‐bar links on Torn trades, exporting weapons+armour in one sheet.
// @author       You
// @match        https://www.torn.com/trade.php*
// @grant        none
// @author       HuzGPT
// @downloadURL https://update.greasyfork.org/scripts/535383/Torn%20Trade%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/535383/Torn%20Trade%20Export.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // ——— helper to escape CSV fields ———
    function csvEscape(field) {
        return '"' + String(field).replace(/"/g, '""') + '"';
    }

    // ——— scrape & export both tables into one CSV ———
    function exportTradeCSV() {
        const weapons = [], armour = [];

        document.querySelectorAll('.networth-info-icon').forEach(icon => {
            const html = icon.getAttribute('title') || '';
            const doc  = new DOMParser().parseFromString(html, 'text/html');

            // stats
            const stats = { damage:'', accuracy:'', defence:'' };
            doc.querySelectorAll('ul.bonus-tooltip li').forEach(li => {
                const ic  = li.querySelector('i');
                const val = li.querySelector('span')?.textContent.trim() || '';
                if (!ic) return;
                const c = ic.className;
                if (c.includes('damage-bonus'))       stats.damage   = val;
                else if (c.includes('accuracy-bonus')) stats.accuracy = val;
                else if (c.includes('defence-bonus')||c.includes('defense-bonus')) stats.defence = val;
            });

            // percent-only bonuses
            const bonuses = [];
            const bonusDiv = doc.querySelector('div.t-overflow');
            if (bonusDiv) {
                bonusDiv.querySelectorAll('b').forEach(b => {
                    const name = b.textContent.trim();
                    let nxt = b.nextSibling;
                    while(nxt && !nxt.textContent.trim()) nxt = nxt.nextSibling;
                    const desc = nxt?.textContent.trim()||'';
                    const pct  = (desc.match(/[\d.]+%/)||[])[0]||'';
                    bonuses.push(name + ': ' + pct);
                });
            }

            // name
            const wrap = icon.closest('.name.left');
            const name = wrap?.firstChild.textContent.trim()||'';

            const itm = { name, damage:stats.damage, accuracy:stats.accuracy, defence:stats.defence, bonuses };
            if (itm.damage||itm.accuracy) weapons.push(itm);
            else armour.push(itm);
        });

        if (!weapons.length && !armour.length) {
            return alert('No items found on this page.');
        }

        // find max bonuses
        const maxB = Math.max(
            weapons.length ? Math.max(...weapons.map(i=>i.bonuses.length)) : 0,
            armour.length  ? Math.max(...armour.map(i=>i.bonuses.length))  : 0
        );

        // assemble rows
        const rows = [];
        const hdr = ['Name','Damage','Accuracy','Defence'];
        for (let i=1; i<=maxB; i++) hdr.push('Bonus ' + i);

        if (weapons.length) {
            rows.push(['Weapons'], hdr);
            weapons.forEach(it => {
                const r=[it.name,it.damage,it.accuracy,it.defence];
                for(let i=0;i<maxB;i++) r.push(it.bonuses[i]||'');
                rows.push(r);
            });
        }

        if (weapons.length&&armour.length) rows.push([]);

        if (armour.length) {
            rows.push(['Armour'], hdr);
            armour.forEach(it => {
                const r=[it.name,it.damage,it.accuracy,it.defence];
                for(let i=0;i<maxB;i++) r.push(it.bonuses[i]||'');
                rows.push(r);
            });
        }

        // download
        const csv = rows.map(r=>r.map(csvEscape).join(',')).join('\r\n');
        const blob= new Blob([csv],{type:'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href     = url;
        a.download = 'torn_trade.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ——— inject “Export CSV” link into the top‐bar nav ———
    function addNavLink(){
        const navList = document.querySelector('#top-page-links-list.content-title-links');
        if (!navList) return;

        // create the <a> matching other links
        const link = document.createElement('a');
        link.href          = '#';
        link.id            = 'export-trade-csv';
        link.className     = 'export-csv t-clear h c-pointer m-icon line-h24 right';
        link.setAttribute('aria-label','Export CSV');
        link.innerHTML     = `<span>Export CSV</span>`;
        link.addEventListener('click', evt => {
            evt.preventDefault();
            exportTradeCSV();
        });

        // separator to match their vertical dividers
        const sep = document.createElement('div');
        sep.className = 'torn-divider divider-vertical';

        // insert just before the final <hr> or at end
        // here we append both sep + link
        navList.appendChild(sep);
        navList.appendChild(link);
    }

    window.addEventListener('load', addNavLink);
})();
