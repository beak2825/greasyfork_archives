// ==UserScript==
// @name         DEE2 Formatter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Digital Emergency Exit 2 Entry Grid Layout Formatter and Client-Side Sorter
// @author       Noisysundae
// @match        *manbow.nothing.sh/event/event.cgi*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nothing.sh
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454914/DEE2%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/454914/DEE2%20Formatter.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(() => {
	const sortEntries = (by) =>
		entries
			.sort((a, b) => {
				switch (by) {
					case 'index':
						return a[by] - b[by];
					case 'title':
					case 'artists':
					case 'genre':
					case 'production':
						return a[by].localeCompare(b[by]);
					case 'updated':
					case 'impressions':
					case 'total':
					case 'median':
					case 'avg':
					case 'weighted':
					case 'fs':
					case 'dq':
						return b[by] - a[by];
					case 'random':
						return Math.random() > 0.5 ? 1 : -1;
				}
			})
			.reduce(
				(last, current, i, arr) => {
					const lastInfo = {
						order:
							last.value === (current[by] ?? 0) ? last.order : i,
						value: current[by],
					};
					const isRankedSort = [
						'impressions',
						'total',
						'median',
						'avg',
						'weighted',
					].includes(by);
					const topPct =
						((isRankedSort ? lastInfo.order : current.index) /
							arr.length) *
						100;
					list.appendChild(current.element.base);
					if (current.element.ranking)
						current.element.ranking.innerHTML = `${
							isRankedSort
								? `<i class="icon-trophy"></i>${
										lastInfo.order + 1
								  }`
								: `#${current.index}`
						}${
							isRankedSort
								? ' <small>(top' +
								  (topPct
										? ` <b>${topPct.toFixed(2)}</b> %`
										: '') +
								  ')</small>'
								: ''
						}`;
					return lastInfo;
				},
				{ order: -1, value: null }
			);
	const list = document.getElementById('modern_list');
	const teams = document.querySelectorAll('.team_information');
	const entries = Array.from(
		document.querySelectorAll('.team_information .row > div[style]')
	)
		.filter(
			(e) =>
				!e.querySelector('.pricing-title h4.textOverflow span#notready')
		)
		.map((base) => {
			const title = base.querySelector(
				'.pricing-title .center > *:nth-child(2) a'
			);
			const artists = base.querySelector(
				'.pricing-title .center > *:nth-child(3)'
			);
			const genre = base.querySelector(
				'.pricing-title .center > *:nth-child(1)'
			);
			const ranking = base.querySelector(
				'.pricing-features:nth-child(2) .tleft.textOverflow span:nth-child(1)'
			);
			const stats = base.querySelector(
				'.pricing-features > .bofu_meters'
			);
			const info = base.querySelector('.pricing-action small');
			const total = stats.querySelector('p:nth-child(1) > span');
			const avg = stats.querySelector('p:nth-child(3) > span');
			const median = stats.querySelector('p:nth-child(2) > span');

			const entry = {
				element: {
					base,
					title,
					artists,
					genre,
					ranking,
					stats,
					info,
					total,
					median,
					avg,
				},
				index: parseInt(info?.innerHTML.match(/No\.([\d]+?)\ /)[1]),
				title: title.innerHTML,
				artists: artists.innerHTML.replace('(mov:', ' (mov: '),
				genre: genre.innerHTML,
				production: info?.innerHTML.match(/ \/ ([\w]+?)\ /)[1],
				updated: new Date(
					`${info?.innerHTML.match(/update : (.+?)$/)[1]} GMT+9`
				),
				impressions: parseInt(ranking?.innerHTML),
				total: parseFloat(
					(total?.innerHTML.match(/Total : ([\d\.]+?) /) ?? [
						'',
						'0',
					])[1]
				),
				median: parseFloat(
					(median?.innerHTML.match(/Median : ([\d\.]+?) /) ?? [
						'',
						'0',
					])[1]
				),
				avg: 0,
				weighted: 0,
				fs: base.firstElementChild.id === 'ace_mus',
				dq: false,
			};
			if (entry.fs) entry.total *= 2 / 3;
			entry.avg = entry.total / entry.impressions;
			if (entry.total)
				entry.weighted = entry.avg * 0.5 + entry.median * 0.5;
			else entry.dq = true;
			return entry;
		});
	const styles = document.createElement('style');
	const sortLabel = document.createElement('label');
	const sortOptions = document.createElement('select');

	/*
	 * Prefixed by https://autoprefixer.github.io
	 * PostCSS: v8.4.14,
	 * Autoprefixer: v10.4.7
	 * Browsers: last 4 version
	 */
	styles.innerHTML = `
		div#modern_list {
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-ms-flex-wrap: wrap;
			flex-wrap: wrap;
			-webkit-box-pack: center;
			-ms-flex-pack: center;
			justify-content: center;
		}

		div#modern_list * {
			font-family: 'Yanone Kaffeesatz';
			letter-spacing: 0.03em;
		}

		div#modern_list .label {
			letter-spacing: 0.12em;
			font-size: 0.9em;
		}

		div#modern_list > div {
			width: 8.8cm;
			padding: 0;
		}

		div#modern_list .header_grad .pricing-title > .center {
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-orient: vertical;
			-webkit-box-direction: normal;
			-ms-flex-direction: column;
			flex-direction: column;
			-webkit-box-align: end;
			-ms-flex-align: end;
			align-items: end;
			font-size: 1.2em;
		}

		div#modern_list .header_grad .pricing-title > .center > * {
			width: 90%;
			text-align: right;
			font-size: 1em;
			letter-spacing: 0.04em;
		}

		div#modern_list
			.header_grad
			.header_alpha
			.pricing-title
			> .center
			> *:nth-child(1) {
			padding-right: 0.6rem;
		}
		div#modern_list
			.header_grad
			.header_alpha
			.pricing-title
			> .center
			> *:nth-child(2) {
			padding-right: 1.4rem;
		}
		div#modern_list
			.header_grad
			.header_alpha
			.pricing-title
			> .center
			> *:nth-child(3) {
			padding-right: 2.2rem;
		}

		h4.textOverflow > strong {
			font-size: 1.4em;
		}

		.bmsinfo.textOverflow {
			text-align: right;
		}

		.header_alpha .bmsinfo.textOverflow {
			padding-right: 3rem;
		}

		.header_grad {
			margin: 0.4em;
			border-radius: 0.8em;
		}

		div#modern_list .pricing-box.best-price,
		.header_grad {
			overflow: hidden;
		}

		div#modern_list .pricing-box.best-price {
			margin: 0.6em;
			padding: 0.4em;
			border-radius: 1.6em;
		}

		.dark .pricing-box.best-price:not(#ace_mus) {
			background: #222;
			color: #bbb;
		}

		div#modern_list
			.pricing-box.best-price
			> .pricing-features
			.tleft.textOverflow {
			margin: 0;
		}

		div#modern_list
			.pricing-box.best-price
			> .pricing-features
			.tleft.textOverflow
			.icon-trophy {
			margin-right: 0.1em;
		}

		div#modern_list .pricing-box.best-price > .pricing-features span > small {
			font-size: 10pt;
		}

		div#modern_list .pricing-features > .bofu_meters,
		.pricing-action > span {
			padding: 0 2rem;
		}

		div#modern_list .pricing-features > .bofu_meters {
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			height: 7.5em;
			-ms-flex-wrap: wrap;
			flex-wrap: wrap;
			font-size: 1.2em;
			margin: 0;
		}

		div#modern_list .pricing-features > .bofu_meters > p {
			width: 100%;
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-pack: start;
			-ms-flex-pack: start;
			justify-content: flex-start;
			line-height: 1;
		}

		div#modern_list .pricing-features > .bofu_meters > p > *:first-child {
			width: 5em;
			font-size: inherit;
		}

		div#modern_list .pricing-features > .bofu_meters > p > *:nth-child(3) {
			max-width: 7.2em;
			-webkit-box-flex: 1;
			-ms-flex: 1;
			flex: 1;
			margin-left: auto;
			font-size: inherit;
		}

		.textOverflow {
			margin: 0.2em 0.6em;
		}

		#ace_mus {
			background: -o-linear-gradient(
				30deg,
				rgba(131, 58, 180, 0.2) 0%,
				rgba(253, 29, 29, 0.2) 40%,
				rgba(252, 176, 69, 0.2) 100%
			);
			background: linear-gradient(
				60deg,
				rgba(131, 58, 180, 0.2) 0%,
				rgba(253, 29, 29, 0.2) 40%,
				rgba(252, 176, 69, 0.2) 100%
			);
		}

		.dark #ace_mus {
			color: #ddd;
		}

		.header_alpha {
			background: -o-linear-gradient(
				285deg,
				transparent 2.4em,
				#fffd 2.45em,
				#fff8 14em,
				transparent 14.05em
			);
			background: -o-linear-gradient(
				165deg,
				transparent 2.4em,
				#fffd 2.45em,
				#fff8 14em,
				transparent 14.05em
			);
			background: linear-gradient(
				285deg,
				transparent 2.4em,
				#fffd 2.45em,
				#fff8 14em,
				transparent 14.05em
			);
		}

		.header_alpha_dark {
			background: -o-linear-gradient(
				285deg,
				transparent 2.4em,
				#000e 2.45em,
				#0004 14em,
				transparent 14.05em
			);
			background: -o-linear-gradient(
				165deg,
				transparent 2.4em,
				#000e 2.45em,
				#0004 14em,
				transparent 14.05em
			);
			background: linear-gradient(
				285deg,
				transparent 2.4em,
				#000e 2.45em,
				#0004 14em,
				transparent 14.05em
			);
		}

		.pricing-box.best-price .header_alpha .pricing-title {
			text-shadow: none;
			-webkit-filter: drop-shadow(0 0 0.4em white) drop-shadow(0 0 0.8em white)
				drop-shadow(0 0 1.2em white);
			filter: drop-shadow(0 0 0.4em white) drop-shadow(0 0 0.8em white)
				drop-shadow(0 0 1.2em white);
		}

		.pricing-box.best-price .header_alpha_dark .pricing-title {
			text-shadow: none;
			-webkit-filter: drop-shadow(0 0 0.4em #2228) drop-shadow(0 0 0.8em #2228)
				drop-shadow(0 0 1.2em #2228);
			filter: drop-shadow(0 0 0.4em #2228) drop-shadow(0 0 0.8em #2228)
				drop-shadow(0 0 1.2em #2228);
		}

		.pricing-action {
			margin-top: 0.4em;
			padding: 0;
		}

		.pricing-action > span {
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-pack: justify;
			-ms-flex-pack: justify;
			justify-content: space-between;
		}

		.pricing-action small {
			font-size: 1.2em;
		}

		div.TeamJumpArea {
			margin: 0.6em;
			-webkit-filter: drop-shadow(0 0 0.6em #0002);
			filter: drop-shadow(0 0 0.6em #0002);
		}

		[class^='icon-'] {
			font-family: 'font-icons' !important;
		}
	`;

	// add sorting dropdown
	sortLabel.innerHTML = '<i class="icon-sort-by-attributes"></i> Sort by';
	sortOptions.className = 'sm-form-control';
	sortOptions.onchange = (e) => {
		const { value } = e.target;
		sortEntries(value);
		localStorage.setItem('dee2formatter_sortby', value);
	};
	sortOptions.innerHTML = `
		<option value="fs">Final Strikers First</option>
		<option value="index">Entry No.</option>
		<option value="title">Title</option>
		<option value="artists">Artists</option>
		<option value="genre">Genre</option>
		<option value="updated">Latest Activity</option>
		<option value="impressions">Impressions</option>
		<option value="total">Total Points</option>
		<option value="median">Median Points</option>
		${entries[0].element.avg ? '<option value="avg">Average Points</option>' : ''}
		<option value="weighted">Weighted Score</option>
		<option value="random">Random</option>
	`;
	sortOptions.value = localStorage.getItem('dee2formatter_sortby') ?? 'random';
	document.querySelector('.TeamJumpArea').innerHTML = '';
	document.querySelector('.TeamJumpArea').appendChild(sortLabel);
	document.querySelector('.TeamJumpArea').appendChild(sortOptions);

	document
		.querySelector('#musiclist .content-wrap')
		.removeChild(
			document.querySelector('#musiclist .content-wrap>*:first-child')
		);
	for (let t of teams) {
		list.removeChild(t);
		// t.outerHTML = '';
	}
	list.appendChild(styles);
	for (let e of entries) {
		if (!isNaN(e.impressions)) {
			const total = e.element.stats.querySelector('p');
			const ranking = e.element.ranking;
			const rankingParent = ranking?.parentElement;
			const newImpressionElement = document.createElement('p');
			const weightedScoreElement = document.createElement('p');

			newImpressionElement.innerHTML = `<span>Impressions</span><b>${e.impressions}</b>`;
			total.innerHTML = `<span>Total</span><b>${e.total.toFixed(2)}</b>${
				e.fs
					? `<span>× 1.5 = <b>${(e.total * 1.5).toFixed(
							2
					  )}</b></span>`
					: ''
			}`;
			total.parentElement.insertBefore(newImpressionElement, total);
			if (rankingParent)
				rankingParent.innerHTML = `<span style="font-size:220%;font-family: 'Yanone Kaffeesatz', sans-serif; color:#FA8072;"></span>`;
			e.element.ranking = rankingParent?.firstElementChild;
			if (e.element.avg)
				e.element.avg.parentElement.innerHTML = `<span>Average</span><b>${e.avg.toFixed(
					2
				)}</b><meter value="${
					e.avg
				}" min="100" max="1000" low="500" high="850" optimum="1000"></meter>`;
			if (e.element.median)
				e.element.median.parentElement.innerHTML = `<span>Median</span><b>${e.median}</b><meter value="${e.median}" min="100" max="1000" low="700" high="950" optimum="1000"></meter>`;
			weightedScoreElement.innerHTML = `<span>Weighted</span><b>${e.weighted.toFixed(
				2
			)}</b><meter value="${e.weighted.toFixed(
				2
			)}" min="100" max="1000" low="600" high="900" optimum="1000"></meter>`;
			e.element.stats.appendChild(weightedScoreElement);

			e.element.total = total;
			e.element.avg = e.element.avg?.parentElement;
			e.element.median = e.element.median?.parentElement;
		} else {
			e.element.stats.innerHTML = '';
			e.element.total = null;
			e.element.avg = null;
			e.element.median = null;
		}

		e.element.base.removeAttribute('style');
		e.element.base.removeAttribute('class');
		e.element.title.title = e.title;
		e.element.artists.title = e.artists;
		e.element.genre.title = e.genre;
		e.element.artists.innerHTML = e.artists;
		e.element.info.parentElement.parentElement.removeAttribute('style');
		e.element.info.innerHTML = e.element.info.innerHTML.replace(
			/No\.\d+? \/ /,
			''
		);
		e.element.info.outerHTML = `<small>
			<i class="icon-music2"></i> ${e.production}
		</small><small>
			<i class="icon-clock"></i> ${e.updated.toLocaleString(undefined, {
				timeZone: 'JST',
			})}
		</small>`;
	}
	sortEntries(sortOptions.value);

	// .sort((a, b) => b.pts.avg - a.pts.avg)
	return entries;
})();
