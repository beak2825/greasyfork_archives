// ==UserScript==
// @name        AdopteUnMec - montre charmes
// @description Montre les charmes (info supprimée) dans l'encart de popularité des profils AdopteUnMec
// @author      PhiLhoSoft
// @version     1.1
// @grant       none
// @run-at      document-end
// @include     https://www.adopteunmec.com/profile/*
// @namespace PhiLhoSoft
// @downloadURL https://update.greasyfork.org/scripts/392196/AdopteUnMec%20-%20montre%20charmes.user.js
// @updateURL https://update.greasyfork.org/scripts/392196/AdopteUnMec%20-%20montre%20charmes.meta.js
// ==/UserScript==
/*
// by Philippe Lhoste <PhiLho(a)GMX.net> http://PhiLhoSoft.GitHub.io
// File/Project history:
 1.01 -- 2019/12/05 (PL) -- Handle a person with more than a million of visits… 17613196
 1.00 -- 2019/11/09 (PL) -- Creation.
*/
/* Copyright notice: For details, see the following file:
http://Phi.Lho.free.fr/softwares/PhiLhoSoft/PhiLhoSoftLicence.txt
This program is distributed under the zlib/libpng license.
Copyright (c) 2019 Philippe Lhoste / PhiLhoSoft
*/
(function()
{

	//console.info('AdopteUnMec - montre charmes');
	const encart = document.querySelector('.encart-popularite-content');
	if (!encart)
	{
		console.warn('[AdopteUnMec] Encart pas trouvé');
		return;
	}
	const rows = encart.querySelectorAll('tr');
	const stats = computeStats(rows);
	//console.log('Stats', stats);

	const target = rows[1];

	const trCharmes = document.createElement('tr');

	const thCharmes = document.createElement('th');
	thCharmes.appendChild(document.createTextNode('Charmes'));

	const tdCalcul = document.createElement('td');
	tdCalcul.className = 'calcul';
	tdCalcul.appendChild(document.createTextNode(stats.charmes.number.toString()));
	tdCalcul.appendChild(document.createTextNode(' x '));
	const str = document.createElement('strong');
	str.appendChild(document.createTextNode('20'));
	tdCalcul.appendChild(str);

	const tdEquals = document.createElement('td');
	tdEquals.className = 'equals';
	tdEquals.appendChild(document.createTextNode('='));

	const tdCount = document.createElement('td');
	tdCount.className = 'count';
	tdCount.appendChild(document.createTextNode(stats.charmes.subTotal.toString()));

	trCharmes.appendChild(thCharmes);
	trCharmes.appendChild(tdCalcul);
	trCharmes.appendChild(tdEquals);
	trCharmes.appendChild(tdCount);
	target.parentNode.insertBefore(trCharmes, target.nextSibling);

	const trRatio = document.createElement('tr');

	const thRatio = document.createElement('th');
	thRatio.colSpan = 2;
	thRatio.appendChild(document.createTextNode('Ratio paniers / charmes'));

	const tdEqualsR = document.createElement('td');
	tdEqualsR.className = 'equals';
	tdEqualsR.appendChild(document.createTextNode('='));

	const tdCountR = document.createElement('td');
	tdCountR.className = 'count';
	tdCountR.appendChild(document.createTextNode(
		stats.charmes.number === 0 ? 'N/A' : `${Math.floor(100 * stats.panier.number / stats.charmes.number)}%`
	));

	trRatio.appendChild(thRatio);
	trRatio.appendChild(tdEqualsR);
	trRatio.appendChild(tdCountR);
	trCharmes.parentNode.insertBefore(trRatio, trCharmes.nextSibling);
})();

function normalizeNumber(nb) { return nb.replace(/\u202F/g, ''); } // NARROW NO-BREAK SPACE
function parseRow(prefix, rowText, simple)
{
	const NB = '([\\d\u202F]+)';
	const re = simple ? // Simple = just a value; otherwise, has a multiplier (x) and a value
			new RegExp(`^${prefix}${NB}`) :
			new RegExp(`^${prefix}${NB}\\s+x\\s+(\\d+)=(\\d+[KM]?)`);
	const rem = rowText.match(re);
	//console.log('RE', re, rowText, rem);
	// Subtotal isn't used, can be deducted from number and value… and the K or M (kilo / mega suffixes) makes it useless anyway.
	return { number: parseInt(normalizeNumber(rem[1])), value: parseInt(rem[2]), subTotal: rem[3] };
}

function computeStats(rows)
{
	const stats = {};
	rows.forEach((row, i) =>
	{
		//console.log('Row', row);
		const text = row.innerText;
		switch (i)
		{
			case 0:
				stats.mails = parseRow('Mails', text);
				break;
			case 1:
				stats.visites = parseRow('Visites', text);
				break;
			case 2:
				stats.panier = parseRow('Panier', text);
				break;
			case 3:
				stats.bonus = parseRow('Bonus', text, true);
				break;
			case 4:
				stats.total = parseRow('Total', text, true);
				break;
		}
	});
    //console.log('Stats', stats);
	const computedTotal = stats.mails.number * stats.mails.value +
			stats.visites.number * stats.visites.value +
			stats.panier.number * stats.panier.value +
			stats.bonus.number;
	const charmTotal = stats.total.number - computedTotal;
	const charmValue = 20;
	stats.charmes = { number: charmTotal / charmValue, value: charmValue, subTotal: charmTotal };

	return stats;
}

