// ==UserScript==
// @name		ZROJ Faker
// @version		0.5.3-test
// @description	ZROJ 假人神器（确信
// @author		PPPxcy
// @run-at		document-start
// @match		*://zhengruioi.com/*
// @grant		unsafeWindow
// @grant		GM_setValue
// @grant		GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/1350049
// @downloadURL https://update.greasyfork.org/scripts/513257/ZROJ%20Faker.user.js
// @updateURL https://update.greasyfork.org/scripts/513257/ZROJ%20Faker.meta.js
// ==/UserScript==

/* eslint-disable curly, no-sequences, no-return-assign */
/* global
	$, uojLocale, uojLocaleData, uojHome,
	standings, rating_data, getColOfRating, problems,
	showTooltip, showCrossHair, onHoverRating,
	getUserLink, getColOfScore, getPenaltyTimeStr, showStandings, ColorConverter, HSV
*/

// They also joined coding or provided some ideas: Wangmarui, Panhongxuan

//	Settings
//	let forceNameColors = false;	//	推荐
let forceNameColors = true;	//	不稳定
let canAutoFresh = false;	//	推荐
//	let canAutoFresh = true;	//	刷新量大

//	Ployfill XD
let aColorConverter = {
	toColor: function toColor(a) {
		if(/^rgb\(-?(\d+(\.\d?)?|\.\d+),-?(\d+(\.\d?)?|\.\d+),-?(\d+(\.\d?)?|\.\d+)\)$/i.test(a))
			return a.match(/-?(\d+(\.\d*)?|\.\d+)/g).map(Number);
		if(/^#[\da-f]{6}$/i.test(a))
			return a.match(/[\da-f]{2}/g).map(e => parseInt(e, 16));
		if(/^#[\da-f]{3}$/i.test(a))
			return a.match(/[\da-f]/g).map(e => parseInt(e, 16) * 17);
		return [0, 0, 0];
	}, averageColor: function averageColor(...a) {
		let sum = [0, 0, 0];
		for(let i of a)
			sum = sum.map((e, y) => e + i[y]);
		sum = sum.map(e => Math.round(e / Math.max(1, a.length)));
		return sum;
	}
};
let dateToTimeString = e => e.toISOString().replace(/^(\d{4}-\d\d-\d\d)T(\d\d:\d\d):\d\d\.\d{3}Z$/, "$1(#) $2").replace('#', ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][e.getUTCDay()]);
let GM_defaults = {
	pagesVisited: {all: 0, bad: 0, '404ed': 0, '404jump': 0}
};
function GM_changeValue(key, fun, dft) {
	return GM_setValue(key, fun(GM_getValue(key) ?? dft ?? GM_defaults[key]));
}

//	Hello!
GM_changeValue('pagesVisited', e => (e.all++, e));

//	Constants
var Styles = {
	profile_old: `#rating-chart{font-family:monospace;width:100%;text-align:center;word-break:keep-all;border:1px solid #ddd;&>tbody>tr:nth-child(odd){background-color:#f7f7f7}&>tbody>tr:hover{background-color:#eee}& td{border:1px solid #ddd;padding:0 .5em;&.textalign-left{text-align:left;word-break:normal}}& tr{height:1.75em}&>thead>tr>td{user-select:none;position:relative;&::after{content:"";background-image:url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAgMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTMgMCAzIDNoLTJ2N2gtMnYtN2gtMnoiIGZpbGw9InNpbHZlciIvPjxwYXRoIGQ9Im03IDEwLTMtM2gydi03aDJ2N2gyeiIgZmlsbD0ic2lsdmVyIi8+PC9zdmc+DQo=");display:inline-block;position:absolute;top:.25em;right:0;width:1.25em;height:1.25em;vertical-align:sub;margin:0 .25em}}&>thead>tr>td.sorted::after{background-image:url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAgMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTMgMCAzIDNoLTJ2N2gtMnYtN2gtMnoiIGZpbGw9ImJsYWNrIi8+PHBhdGggZD0ibTcgMTAtMy0zaDJ2LTdoMnY3aDJ6IiBmaWxsPSJzaWx2ZXIiLz48L3N2Zz4NCg==")}&>thead>tr>td.desorted::after{background-image:url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAgMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTMgMCAzIDNoLTJ2N2gtMnYtN2gtMnoiIGZpbGw9InNpbHZlciIvPjxwYXRoIGQ9Im03IDEwLTMtM2gydi03aDJ2N2gyeiIgZmlsbD0iYmxhY2siLz48L3N2Zz4NCg==")}&>thead>tr>td:hover{cursor:pointer;background-color:#eee}&>thead>tr>td:active{background-color:#ddd}}`,
	profile: `#rating-chart{font-family:monospace;width:100%;text-align:center;word-break:keep-all;border:1px solid #ddd;&>tbody>tr:nth-child(odd){background-color:#f7f7f7}&>tbody>tr:hover{background-color:#eee}& td{border:1px solid #ddd;padding:0 .5em;&.textalign-left{text-align:left;word-break:normal}}& tr{height:1.75em}&>thead>tr>td{white-space:nowrap;user-select:none;position:relative;&::after{font-family:"Glyphicons Halflings";color:#CCC;content:"\ue150";display:inline-block;position:absolute;top:.25em;right:0;width:1.25em;height:1.25em;vertical-align:sub;margin:0 .25em}}&>thead>tr>td.sorted::after{color:#000;content:"\ue155"}&>thead>tr>td.desorted::after{color:#000;content:"\ue156"}&>thead>tr>td:hover{cursor:pointer;background-color:#eee}&>thead>tr>td:active{background-color:#ddd}}`,
	disabledButtons: `a.btn.btn-info.pull-right[hasbeendisabled]{filter:grayscale(.9);&:hover{cursor:not-allowed}}`,
	usernameUppers: `.uoj-username,.uoj-honor{white-space:nowrap;&>.rating-bar{&.vertical{--direction:0deg;width:.4em;height:1em;}&.horizontal{--direction:90deg;width:3em;height:.5em;}display:inline-block;margin-left:.2em;border:1px solid currentcolor;background-image:linear-gradient(var(--direction),currentcolor var(--fillpercent),#0000 var(--fillpercent));}}`,
	testSign: `.Faker-sign{box-sizing:initial;position:fixed;top:0;left:0;z-index:999;padding-left:.25em;padding-right:.5em;font-family:monospace;font-weight:bold;color:#0003;user-select:none;white-space:nowrap;background-color:#0001;clip-path:polygon(0 0,100% 0,97.5% 100%,0 100%);}}`
}, DataSet = {
	tetrio_ratingArr: {values:[[9999,167,99,234,"+"],[2500,167,99,234,"X+"],[2300,255,69,255,"X"],[2150,255,56,19,"U"],[2000,219,139,31,"SS"],[1850,216,175,14,"S+"],[1750,224,167,27,"S"],[1650,178,151,43,"S-"],[1550,31,168,52,"A+"],[1450,70,173,81,"A"],[1350,59,182,135,"A-"],[1250,79,153,192,"B+"],[1150,79,100,201,"B"],[1050,86,80,199,"B-"],[975,85,40,131,"C+"],[900,115,62,143,"C"],[825,121,85,140,"C-"],[750,142,96,145,"D+"],[675,144,117,145,"D"],[0,55,84,51,"?"]]},
	atcoder_ratingArr: {values:[[9999,255,0,0],[2500,255,0,0],[2200,255,128,0],[1900,192,192,0],[1600,0,0,255],[1300,0,192,192],[1000,0,128,0],[700,128,64,0],[400,128,128,128],[0,0,0,0]]}
}, ExtandedLangPackage = {
	'contests::estimated rank': {en: 'Est. #', 'zh-cn': '预计 #'},
	'contests::rating diff': {en: 'Diff', 'zh-cn': '上分'},
	'contests::diff range': {en: 'max.=', 'zh-cn': 'max.='},
	'contests::rating change': {en: 'Rating Change', 'zh-cn': 'Rating 变化'},
	'contests::insert max rating change value': {en: 'Insert max rating change value:','zh-cn': '输入最大上分幅度：'},
	'contests::invalid input': {en: 'Invalid input!', 'zh-cn': '非法输入！'},
	'problem::original problem': {en: 'Original problem', 'zh-cn': '源题目'},
	'problem::solution': {en: 'Solution', 'zh-cn': '题解'},
	'problem::statistics': {en: 'Statistics', 'zh-cn': '统计'},
	'profile::no competition history': {en: 'Competition history: None', 'zh-cn': '比赛历史：无'},
	'profile::n competition history found': {en: function(n) { return `Competition history：${n} records found`; }, 'zh-cn': function(n) { return `比赛历史：共&nbsp;${n}&nbsp;条`; }},
	'profile::date': {en: 'Date', 'zh-cn': '日期'},
	'profile::contest name': {en: 'Contest Name', 'zh-cn': '比赛名称'},
	'profile::rank': {en: 'Rank', 'zh-cn': '排名'},
	'profile::rating': {en: 'Rating', 'zh-cn': 'Rating'},
	'profile::rating change': {en: 'Rating Change', 'zh-cn': 'Rating 变化'},
	'profile::set time offset': {en: 'Set chart time offset', 'zh-cn': '设定图表时间区间'},
	'profile::chart time setor': {en: 'Set', 'zh-cn': '设定'}
}, pageDeciders = {
	'404': {
		test() {
			return !![...document.querySelectorAll('div[style="font-size:233px"]')].filter(e => e.innerText == '404').length && !document.querySelectorAll('div.page-header').length;
		}
	}, contestStandings: /^\/contest\/\d+\/standings$/,
	profile: /^\/user\/profile\/\w+$/,
	problem: /^\/problem\/\d+$/,
	contestProblem: /^\/contest\/\d+\/problem\/\d+$/
};
function isPage(type) {
	return pageDeciders[type].test(location.pathname);
}
async function wait_for(exp, check = (e => !!e), interval = 5) {
	return new Promise((res, rej) => {
		(function f() {
			let val = exp();
			if(check(val))
				res(val);
			else
				setTimeout(f, interval);
		})();
	});
}
async function when_do(exp, check = (e => !!e), interval = 5, callBack) {
	(function f() {
		let val = exp();
		if(check(val))
			callBack(val);
		setTimeout(f, interval);
	})();
}
async function fill_style(styletxt) {
	let sty = document.createElement('style');
	sty.innerHTML = styletxt, document.head.appendChild(sty);
}

let langPackageExtanded = false;


if(1) {
	//	Outer values
	let gcorChanged = false;
	wait_for(() => !!document).then(function() {
		fill_style(Styles.disabledButtons);
		fill_style(Styles.usernameUppers);
		fill_style(Styles.testSign);
		if(isPage('profile'))
			fill_style(Styles.profile);
	}), wait_for(() => unsafeWindow.uojLocaleData).then(function() {
		Object.assign(uojLocaleData, ExtandedLangPackage), langPackageExtanded = true;
	}), wait_for(isPage('profile') ? () => unsafeWindow?.rating_plot : () => forceNameColors && unsafeWindow?.getColOfRating, undefined, 0).then(function() {
		let originalGcor = getColOfRating, getColOfLine = '#3850eb';
		async function arrangeRatingHistory() {
			let tab = document.createElement('div');
			tab.classList.add('list-group-item');
			if(rating_data[0][0][3] === undefined) {
				tab.innerHTML = `<h4 class="list-group-item-heading">${uojLocale('profile::no competition history')}</h4>`;
				return tab;
			}
			let TAB = document.createElement('table');
			TAB.id = 'rating-chart', tab.innerHTML = `<h4 class="list-group-item-heading">${uojLocale('profile::n competition history found', rating_data[0].length)}</h4>`, tab.append(TAB),
			TAB.innerHTML = `<thead><tr><td sort-for=0 style=width:22.5% class=sorted>${uojLocale('profile::date')}<td sort-for=1>${uojLocale('profile::contest name')}<td sort-for=2 style=width:12.5%>${uojLocale('profile::rank')}<td sort-for=3 style=width:12.5%>${uojLocale('profile::rating')}<td sort-for=4 style=width:12.5%>${uojLocale('profile::rating change')}</thead>`,
			TAB.innerHTML += `<tbody>${rating_data[0].map(y => {
				let	Dae = `<td>${dateToTimeString(new Date(y[0]))}</td>`,
					Contest = `<td class="textalign-left"><a href="http://zhengruioi.com/contest/${y[2]}">${y[3]}</a></td>`,
					Rank = `<td>${y[4]}</td>`, Rating = `<td>${(e => `<span style="color: ${getColOfRating(e)}">${e}</span>`)(y[1])}</td>`,
					Diff = `<td data-value="${y[5]}">${(e => (e > 0 ? '+' : (e == 0 ? '±' : '')) + e)(y[5])}</td>`;
				if(y[4] == 0)
					return `<tr>${Dae}${Contest}<td style=display:none data-value=running></td><td style=display:none data-value=running></td><td style=display:none data-value=running></td><td style=color:#00f colspan=3>Running now</td></tr>`;
				return `<tr>${Dae}${Contest}${Rank}${Rating}${Diff}</tr>`;
			}).join('')}</tbody>`;

			let sorten = '0,a';
			[...TAB.firstChild.firstChild.children].forEach(e => {
				e.addEventListener('click', function(ev) {
					let sfid = e.getAttribute('sort-for'), soorten = sfid + ',a';
					TAB.firstChild.firstChild.children[sorten.slice(0, -2)].classList.remove('sorted', 'desorted');
					if(soorten == sorten)
						soorten = sfid + ',d';
					sorten = soorten;
					let all = [...TAB.lastChild.children].map((E, i) => [E.children[sfid].getAttribute('data-value') ?? E.children[sfid].innerText, i, E.innerHTML]);
					if(sfid >= 2)
						all.forEach(E => E[0] = Number(E[0]));
					if(sorten.slice(-1) == 'd')
						all.sort((a, b) => ((a[0] < b[0]) - (a[0] > b[0]) || (a[1] > b[1]) - (a[1] < b[1])));
					else
						all.sort((a, b) => ((a[0] > b[0]) - (a[0] < b[0]) || (a[1] > b[1]) - (a[1] < b[1])));
					let fnd = all.findIndex(R => isNaN(R[0]));
					if(fnd != -1) {
						let T = all[fnd];
						all.splice(fnd, 1), all.splice(0, 0, T);
					}
					TAB.firstChild.firstChild.children[sorten.slice(0, -2)].classList.add((sorten.slice(-1) == 'd' ? 'de' : '') + 'sorted');
					[...TAB.lastChild.children].forEach((E, i) => E.innerHTML = all[i][2]);
				});
			});
			return tab;
		};

		(function redrawRatingGraph() {
			function generate_gcor(ratingArr, o = {mode: 'default'}) {
				let R = ratingArr.values;
				if(o.mode == 'default')
					return function getColOfRating(rating) {
						return `rgb(${(R.find((e, i) => !!i && rating >= e[0]) ?? [0, 0, 0, 0]).slice(1, 4).join()})`;
					};
				else if(o.mode == 'linear') {
					let Y = ratingArr.gradients ?? Array(R.length - 1).fill(1);
					return function getColOfRating(rating) {
						let i = R.findIndex((e, i) => !!i && rating >= e[0]);
						if(i == -1)
							return 'rgb(0,0,0)';
						return `rgb(${((a, b, t) => [0, 0, 0].map((x, j) => a[j] * Math.pow(t, Y[i - 1]) + b[j] * (1 - Math.pow(t, Y[i - 1]))))(
							R[i - 1].slice(1, 4), R[i].slice(1, 4),
							(rating - R[i][0]) / (R[i - 1][0] - R[i][0])
						)})`;
					};
				}
			}
			let getAlephsOfRating = function getAlephsOfRating(rating) {
				let alephs = '';
				if(rating >= 2500) {
					alephs += '<sup>';
					for (var i = 2500; i <= rating; i += 200)
						alephs += "&alefsym;"
					alephs += "</sup>";
				}
				return alephs;
			};
			let Presets = {	//	rating_data change presets
				change_gcor: function change_gcor(f) {	//	f: function(q)
					if(f instanceof Function)
						unsafeWindow.getColOfRating = f;
				}, change_line: function change_line(f) {	//	f: string(q)
					getColOfLine = f.toString();
				}, change_gaor: function change_gaor(f) {	//	f: function(q)
					if(f instanceof Function)
						getAlephsOfRating = f;
				}, raise_ratings: function raise_ratings(o) { //	o: { diff?: Number, first?: Number }
					o.diff ??= 0, o.first ??= o.diff + rating_data[0][0][1] - rating_data[0][0][5],
					rating_data[0].forEach(y => y[1] += o.diff), rating_data[0][0][5] = rating_data[0][0][1] - o.first,
					[...document.querySelectorAll('.list-group > .list-group-item > .list-group-item-text > strong')].forEach(e => e.innerHTML = +e.innerHTML + o.diff),
					$('body').find('.uoj-honor').each(function() {$(this).data('rating', +$(this).data('rating') + o.diff);});
				}, multiply_ratings: function multiply_ratings(o) { //	o: { multiplying?: Number }
					o.multiplying ??= 1, rating_data[0].forEach(y => (y[1] *= o.multiplying, y[5] *= o.multiplying)),
					[...document.querySelectorAll('.list-group > .list-group-item > .list-group-item-text > strong')].forEach(e => e.innerHTML = +e.innerHTML * o.multiplying),
					$('body').find('.uoj-honor').each(function() {$(this).data('rating', +$(this).data('rating') * o.multiplying);});
				}, round_ratings: function round_ratings() {
					let l = Math.round(rating_data[0][0][1] - rating_data[0][0][5]);
					rating_data[0].forEach(y => (y[1] = Math.round(y[1]), y[5] = y[1] - l, l = y[1])),
					[...document.querySelectorAll('.list-group > .list-group-item > .list-group-item-text > strong')].forEach(e => e.innerHTML = Math.round(+e.innerHTML)),
					$('body').find('.uoj-honor').each(function() {$(this).data('rating', Math.round(+$(this).data('rating')));});
				}, gcors: {
					generate_gcor: generate_gcor, tetrio_like_gcor: generate_gcor(DataSet.tetrio_ratingArr, {mode: 'linear'}), tetrio_gcor: generate_gcor(DataSet.tetrio_ratingArr, {mode: 'default'}),
					atcoder_like_gcor: generate_gcor(DataSet.atcoder_ratingArr, {mode: 'linear'}), atcoder_gcor: generate_gcor(DataSet.atcoder_ratingArr, {mode: 'default'}),
					simulate: function getColOfRating(rating) {
						let rr = (Math.max(500.0000000001, Math.min(2500, rating)) - 500) / 2000, ry = rr * 2 - 1, ary = Math.abs(ry), yep = Math.log2(ary + 1) * Math.pow(ary, 1.25) * .5 + .5;
						if(ry < 0)
							yep = 1 - yep;
						return ColorConverter.toStr(ColorConverter.toRGB(new HSV(360 - rr * 360, yep * 60 + 40, yep * 50 + 50)));
					}, inverted: function inverted(gcor) {
						return function getColOfRating(rating) {
							return `rgb(${gcor(rating).replace('rgb(', '').replace(')', '').split(',').map(e => e.trim()).map(e => (e.slice(-1) == '%' ? 100 - +e.slice(0, -1) : 255 - +e)).join(',')})`;
						};
					}
				}, gaors: {
					optimized_aleph: function getAlephsOfRating(rating) {
						if(Number(rating) != rating)
							return '';
						return (
							t => t > 0 ? `<sup>${t < 3 ? ['', 'ℵ', 'ℵℵ'][t] : `ℵ<sup>${t}</sup>`}</sup>` : ''
						)(Math.floor((Number(rating) - 2300) / 200));
					}, rating: function getAlephsOfRating(rating) {
						if(Number(rating) != rating)
							return '';
						return `<sup>${rating}</sup>`;
					}, ratingBar: direction => {
						if(['horizontal', 'vertical'].indexOf(direction) + 1)
							return function getAlephsOfRating(rating) {
								return `<span class="rating-bar ${direction}"style=--fillpercent:${Math.max(Math.min(2500, rating) - 300, 0) / 22}% title=${rating}></span>`;
							};
					}
				}
			}, rating_data_change = async function() {
				//	There're some presets
			//	Presets.change_gcor(Presets.gcors.tetrio_like_gcor);
			//	Presets.change_gcor(Presets.gcors.tetrio_gcor);
			//	Presets.change_gcor(Presets.gcors.atcoder_like_gcor);
			//	Presets.change_gcor(Presets.gcors.atcoder_gcor);
			//	Presets.change_gcor(Presets.gcors.inverted(getColOfRating));
			//	Presets.change_gcor(Presets.gcors.generate_gcor({values: [[9999, 0, 0, 0], [2500, 0, 0, 0], [0, 192, 192, 192]], gradients: [1, Math.E]}, {mode: 'linear'}));
				Presets.change_gcor(Presets.gcors.simulate);
				Presets.change_gaor(Presets.gaors.rating);
				if(isPage('profile')) {
					Presets.change_line('silver');
					//	Change rating_data here
				//	Presets.multiply_ratings({multiplying: 2/3});
				//	Presets.raise_ratings({diff: -0.5});
				//	Presets.round_ratings();
				}
				return {};	//	Return a piece of show setting
			};

			rating_data_change().then(function(v) {
				$.fn.uoj_honor = function(gaor = getAlephsOfRating) {
					return this.each(function() {
						let honor = $(this).text(), rating = +$(this).data("rating");
						if(isNaN(rating))
							return;
						honor += gaor(rating);
						$(this).css("color", getColOfRating(rating)).html(honor);
					});
				}, unsafeWindow.getUserLink = function getUserLink(username, rating, addSymbol, gcor = getColOfRating) {
					if(!username)
						return '';
					if(addSymbol == undefined)
						addSymbol = true;
					let text = username;
					if(username.charAt() == '@')
						username = username.substr(1);
					if(addSymbol)
						text += getAlephsOfRating(rating);
					return `<a class="uoj-username Faker-render" data-rating="${rating}"href="${uojHome}/user/profile/${username}" style="color:${gcor(rating)}">${text}</a>`;
				}, unsafeWindow.getUserSpan = function getUserSpan(username, rating, addSymbol, gcor = getColOfRating) {
					if(!username)
						return '';
					if(addSymbol == undefined)
						addSymbol = true;
					let text = username;
					if(username.charAt() == '@')
						username = username.substr(1);
					if(addSymbol)
						text += getAlephsOfRating(rating);
					return `<span class="uoj-username Faker-render" data-rating="${rating}"style="color:${gcor(rating)}">${text}</span>`;
				};

				gcorChanged = true;

				if(!isPage('profile'))
					return;

				setTimeout(async function redrawRatingChartWithTable() {
					wait_for(() => langPackageExtanded).then(arrangeRatingHistory).then(e => {
						let rp = document.getElementById('rating-plot').parentNode;
						return rp.parentNode.insertBefore(e, rp.nextSibling ?? null);
					});

					let nowrd = unsafeWindow.nowrd = [[...unsafeWindow.rating_data[0]]];
					unsafeWindow.rating_data = [[...nowrd[0]]];

					addEventListener('resize', e => {
						let xy = unsafeWindow.rating_plot.offset();
						$('#rating-tooltip').css('top', xy.top);
						$('#rating-tooltip').css('left', xy.left);
						$('#rating-crosshair-x, #rating-crosshair-y').remove();
					}), unsafeWindow.showTooltip = function showTooltip(contents) {
						let xy = unsafeWindow.rating_plot.offset();
						if($('#rating-tooltip').length == 0)
							$(`<div id="rating-tooltip" style="font-family: monospace;">${contents}</div>`).css({
								position: 'absolute', top: xy.top,
								left: xy.left, border: '1px solid silver', padding: '2px .5em 2px .2em',
								'font-size': '11px', 'background-color': 'white', opacity: 0.9,
							}).appendTo('body');
						else
							$('#rating-tooltip').html(contents);
					}, unsafeWindow.showCrossHair = function showCrossHair(i, x, y) {
						let xy = unsafeWindow.rating_plot.offset();
						if($('#rating-crosshair-x').length == 0)
							$(`<div id="rating-crosshair-x"></div>`).css({
								position: 'absolute', top: xy.top, 'pointer-event': 'none',
								left: x, height: unsafeWindow.rating_plot.height(),
								width: '1px', 'will-change': 'left', 'backdrop-filter': 'invert(1)'
							}).appendTo('body');
						else
							$('#rating-crosshair-x').css('left', x);
						if($('#rating-crosshair-y').length == 0)
							$(`<div id="rating-crosshair-y"></div>`).css({
								position: 'absolute', top: y, 'pointer-event': 'none',
								left: xy.left, width: unsafeWindow.rating_plot.width(),
								height: '1px', 'will-change': 'top', 'backdrop-filter': 'invert(1)'
							}).appendTo('body');
						else
							$('#rating-crosshair-y').css('top', y);
					};

					let prev = -1, prevType = 0;
					unsafeWindow.onHoverRating = function onHoverRating(event, pos, item, type) {
						if(type < prevType)
							return;
						prevType = type;
						if (prev != item.dataIndex) {
							let params = nowrd[0][item.dataIndex], total = params[1], contest_id = params[2], html;
							if (contest_id != 0) {
								let change = ['', '±', '+'][(params[5] > 0) + (params[5] >= 0)] + params[5],
									contestName = params[3], rank = params[4], time = params[0];
								if(rank == 0)
									html = `→ <span style=\"color: ${unsafeWindow.getColOfRating(total)};">${total}</span>, <span style="color: blue;">Running now</span><br/><a href="/contest/${contest_id}">${contestName}</a><br/>${dateToTimeString(new Date(time))}`;
								else
									html = `→ <span style=\"color: ${unsafeWindow.getColOfRating(total)};">${total}</span>, ${change}; Rank: ${rank}<br/><a href="/contest/${contest_id}">${contestName}</a><br/>${dateToTimeString(new Date(time))}`;
							} else
								html = `→ <span style=\"color: ${unsafeWindow.getColOfRating(total)};">${total}</span><br/>Unrated`;
							showTooltip(html), showCrossHair(item, item.pageX, item.pageY), prev = item.dataIndex;
						}
					}, $("#rating-plot").unbind("plothover"), $("#rating-plot").unbind("plotclick"),
					$("#rating-plot").bind("plothover", function(event, pos, item) {
						if(item)
							onHoverRating(event, pos, item, 0);
					}), $("#rating-plot").bind("plotclick", function(event, pos, item) {
						if(item)
							onHoverRating(event, pos, item, 1);
						else
							$("#rating-tooltip, #rating-crosshair-x, #rating-crosshair-y").remove(), prev = -1, prevType = 0;
					});

					let changeRatingChartDisplaying = unsafeWindow.changeRatingChartDisplaying = function changeRatingChartDisplaying(timel, timer) {
						let newSch = '?' + [['chart-min-time', timel], ['chart-max-time', timer]].filter(e => !!e[1]).map(e => e[0] + '=' + encodeURIComponent(e[1])).join('&');
						window.history.replaceState({}, '', location.pathname + (newSch == '?' ? '' : newSch));
						[timel, timer] = [timel, timer].map(e => e === String(e) ? (E => {
							return E.valueOf() - E.getTimezoneOffset() * 60000;
						})(new Date(e)) : undefined).map(e => isNaN(e) ? undefined : e);
						timel ??= rating_data[0].map(e => e[0]).reduce((a, b) => Math.min(a, b), Math.min());
						timer ??= rating_data[0].map(e => e[0]).reduce((a, b) => Math.max(a, b), Math.max());
						let left = rating_data[0].findLastIndex(e => e[0] <= timel),
							right = rating_data[0].findIndex(e => timer <= e[0]), len;
						if(left == -1 || timel === undefined)
							left = 0;
						if(right == -1 || timer === undefined)
							right = rating_data[0].length - 1;
						nowrd = [rating_data[0].slice(left, right + 1)], len = nowrd[0].length;
						let maxR = -Infinity, minR = Infinity, subR = 0, minT = timel, maxT = timer, size;
						if(maxT - minT == 0)
							maxT += 1, minT -= 1;
						for(let y of nowrd[0])
							maxR = Math.max(maxR, y[1]), minR = Math.min(minR, y[1]);
						subR = maxR - minR, [maxR, minR] = ((xR, nR, sR) => {
							if(sR != 0) {
								let ratio = Math.sqrt(sR);
								//	upper 4 lower 4
								if(ratio != 0)
									xR += sR / ratio * 4, nR -= sR / ratio * 4;
							}
							return [Math.max(maxR + 50, xR), Math.min(minR - 50, nR)];
						})(maxR, minR, subR), subR = maxR - minR, size = Math.max(3, Math.min(7, 15 / Math.log(len + 1))),
						$("#rating-tooltip, #rating-crosshair-x, #rating-crosshair-y").remove(),
						prev = -1, prevType = 0, unsafeWindow.rating_plot = $.plot($("#rating-plot"), [{
							color: getColOfLine ?? "#3850eb", data: nowrd[0],
							label: (a => a.substring(a.lastIndexOf('/') + 1))(location.pathname)
						}], {
							series: {
								lines: {show: true, lineWidth: size - 1.5}, points: {show: true, radius: size, lineWidth: Math.max(size / 1.5 - 1.5, 1)}, shadowSize: 2, highlightColor: '#0000'
							}, xaxis: {
								mode: "time", min: minT, max: maxT,
								timeformat: ["%Y/%m/%d", "%Y/%m/%d %H:%M:%S"][[172800000, 0].findIndex(e => maxT - minT >= e)],
								minTickSize: [undefined, [1, 'day'], [4, 'hour'], undefined][[864000000, 172800000, 86400000, 0].findIndex(e => maxT - minT >= e)]
							}, yaxis: {
								color: '#0000', min: minR, max: maxR
							}, legend: {labelFormatter: function(username) {
								return getUserLink(username, rating_data[0].at(-1)[1], false, getColOfRating);
							}}, grid: {
								clickable: true, hoverable: true
							}, hooks: {drawBackground: [function(plot, ctx) {
								for (let plotOffset = plot.getPlotOffset(), y = 0, rating; y < plot.height(); y += 1)
									rating = maxR - (maxR - minR) * y / plot.height(), ctx.fillStyle = getColOfRating(rating),
									ctx.fillRect(plotOffset.left, plotOffset.top + y - .5, plot.width(), 2);
							}]}
						});
					};

					let timeBox = document.createElement('div'), timeForm;
					timeBox.classList.add('list-group-item-text'),
					timeBox.innerHTML = `<form id="ZROJ-Faker-chart-form-search" class="form-inline" style="margin: 0.25em;"> <div id="ZROJ-Faker-chart-form-group" class="form-group"> <label for="ZROJ-Faker-chart-zoom-left" class="control-label">${uojLocale('profile::set time offset')}:</label> <input type="text" class="form-control input-sm" name="chart_min_time" id="ZROJ-Faker-chart-zoom-left" value="" style="width:10em"> <label for="ZROJ-Faker-chart-zoom-right" class="control-label">~</label> <input type="text" class="form-control input-sm" name="chart_max_time" id="ZROJ-Faker-chart-zoom-right" value="" style="width:10em"> </div> <button class="btn btn-info btn-sm" type="submit" id="ZROJ-Faker-chart-zoom"><span class="glyphicon glyphicon-zoom-in"></span> ${uojLocale('profile::chart time setor')}</div></form>`,
					timeForm = timeBox.firstChild, timeForm.addEventListener('submit', function(e) {
						e.preventDefault(), changeRatingChartDisplaying(...[...new FormData(timeForm).entries()].map(e => e[1]));
					}), document.getElementById('rating-plot').parentNode.appendChild(timeBox);

					let sch = new URLSearchParams(location.search);
					document.getElementById('ZROJ-Faker-chart-zoom-left').value = sch.get('chart-min-time') || '',
					document.getElementById('ZROJ-Faker-chart-zoom-right').value = sch.get('chart-max-time') || '',
					changeRatingChartDisplaying(sch.get('chart-min-time'), sch.get('chart-max-time'));
				}, 0.1);
			});
		})();
	}), forceNameColors && (() => {
		function f() {
			console.log('f');
			$.holdReady(true);
			wait_for(() => gcorChanged, undefined, 0).then(function() {
				$.holdReady(false), unsafeWindow.standings && showStandings();
			}).then(async function f() {
				wait_for(() => {
					return document.querySelectorAll('.uoj-username[style]:not(.Faker-render):not(#rating-plot *)');
				}, e => e.length, undefined).then(function(e) {
					console.log('Will reload!', ...[...e].map(r => r.parentNode.outerHTML));
					GM_changeValue('pagesVisited', e => (e.bad++, e));
					canAutoFresh && setTimeout(location.reload(), 10);
				});
			});
		}
		let jqs = document.querySelector('script[src="http://zhengruioi.com/js/jquery.min.js"]');
		console.log('owo', unsafeWindow.$);
		if(unsafeWindow.$)
			f();
		else
			jqs.addEventListener('load', f);
	})();
}

if(isPage('contestStandings')) {
	let standings_extand, delta = 0;
	function analyze(st) {
		let [q, w, o] = (function calcPredictedRatingChanges(s, del) {
			let l = s.length;
			if(l <= 1)
				return [[[], []], [[0], [1]]][l];
			let cnter = new Map(), cnter2 = new Map();
			s.forEach((e, i) => cnter.set(e[3], (cnter.get(e[3]) ?? [0, 0]).map((f, j) => f + [i, 1][j])));
			s.forEach((e, i) => cnter2.set(e[3], (cnter2.get(e[3]) ?? i)));
			let	realRank = s.map(e => cnter.get(e[3]).reduce((a, b) => a / Math.max(b, 1))),
				realRank2 = s.map(e => cnter2.get(e[3])),
				weight = s.map(e => Math.pow(7, e[2][1] / 500)),
				estimate = weight.map(i => weight.reduce((o, j) => o + j / (i + j), 0) - .5),
				maxRank = realRank.reduce((a, b) => Math.max(a, b)),
				diff = s.map((e, i) => Math.max(Math.ceil(del * Math.min(realRank[i] === maxRank ? 0 : Infinity, estimate[i] - realRank[i]) / (l - 1)), -e[2][1]));
			return [diff, estimate.map(e => (e + 1).toFixed(3)), realRank2];
		})(st.filter(e => e[2][3] == unsafeWindow.contest_id), delta);

		let last = 0;
		return st.map(e => {
			let scoreList = unsafeWindow.score[e[2][0]][e[2][3]] ?? [];
			scoreList = Object.entries(scoreList).map(([id, e = []]) => [id, e]);
			if(e[2][3] == unsafeWindow.contest_id)
				last++;
			return Object.assign({
				name: e[2][2],
				username: e[2][0],
				score: e[0],
				scores: Object.fromEntries(scoreList.map(([id, e]) => [id, e[0]])),
				penalty: e[1],
				penalties: Object.fromEntries(scoreList.map(([id, e]) => [id, e[1]])),
				submissionIds: Object.fromEntries(scoreList.map(([id, e]) => [id, e[2]])),
				globalRank: e[3],
				isVirtual: true,
				rating: e[2][1],
				contest: e[2][3]
			}, e[2][3] == unsafeWindow.contest_id ? {
				rank: o[last - 1] + 1,
				isVirtual: false,
				estimatedRank: w[last - 1],
				newRating: e[2][1] + q[last - 1],
				ratingDiff: q[last - 1]
			} : {});
		});
	}
	function makeRow(list, tag = 'td') {
		return `<tr>${list.map(e => e instanceof Array ? e : [e]).map(
			e => `<${tag}${e[2] === undefined ? '' : ` ${e[2]}`}${e[1] === undefined ? '' : ` style="${e[1]}"`}>${e[0]}</${tag}>`
		).join('')}</tr>`;
	}
	wait_for(() => unsafeWindow.showStandings).then(function() {
		unsafeWindow.showStandings = function showStandings() {
			standings_extand ??= analyze(standings);
			let qn = new RegExp($('#input-name').val(), 'i'), filtered = standings_extand.filter(p => qn.test(p.username) || qn.test(p.name)).sort((a, b) => {
				return [[b.score, a.score], [a.penalty, b.penalty], [b.rating, a.rating], [a.username, b.username]].map(e => ((a, b) => (a > b) - (b > a))(...e)).find(e => e !== 0);
			}).map((e, i) => ({...e, order: i + 1})), pc = problems.length;
			filtered.forEach((e, i, a) => {
				a[i].order = (a[i - 1]?.order ?? 0) + !(i > 0 && a[i - 1].globalRank == a[i].globalRank);
			});

			$('#standings').long_table(
				filtered, 1, makeRow([
					['#', 'width:4em'],
					[uojLocale('username'), 'width:14em'],
					[uojLocale('contests::total score'), 'width:5em'],
					...problems.map((e, i) => [`<a href="/contest/${unsafeWindow.contest_id}/problem/${e}">${String.fromCharCode('A'.charCodeAt(0) + i)}</a>`, 'width: 8em']),
					[uojLocale('contests::estimated rank'), 'width:6em'],
					[`<a id="Faker-delta-change" href="javascript:void 0">${delta ? uojLocale('contests::diff range') + delta : uojLocale('contests::rating diff')}</a>`, 'width:5em;'],
					[uojLocale('contests::rating change'), 'width:10em']
				], 'th'), r => makeRow([
					r.order + (r.isVirtual ? ` <b><big><a style=color:red;text-decoration:none href="/contest/${r.contest}">*</a></big></b>` : `<br><span class=text-muted>(${r.rank})</span>`),
					getUserLink(r.username, r.rating, true) + (r.name === undefined ? '' : `&nbsp;<span style=font-size:12px; class=text-muted>${r.name}</span>`),
					`<div><span class=uoj-score data-max=${pc}00 style="color:${getColOfScore(r.score / pc)}">${r.score}</span></div><div>${getPenaltyTimeStr(r.penalty)}</div>`,
					...problems.map((_, i) => (
						r.scores[i] === undefined ? '' : `<div><a href="/submission/${r.submissionIds[i]}" class=uoj-score style=color:${getColOfScore(r.scores[i])}>${r.scores[i]}</a></div>` + (
							unsafeWindow.standings_version < 2 || r.scores[i] > 0 ? `<div>${getPenaltyTimeStr(r.penalties[i])}</div>` : ''
						)
					)), r.isVirtual ? `<span class=text-muted>-</span>` : r.estimatedRank, (rd => [
						`<span class=text-muted>-</span>`, `<span style=color:#e00>${rd}</span>`,
						`<span style=color:#aaa>±0</span>`, `<span style=color:#0e0>+${rd}</span>`
					][(rd == rd) + (rd > 0) + (rd >= 0)])(Number(r.ratingDiff)),
					`<span style="color:${getColOfRating(r.rating)}">${r.rating}</span>` + (r.isVirtual ? '' : `&nbsp;→&nbsp;<span style="color:${getColOfRating(r.newRating)}">${r.newRating}</span>`)
				]), {
					table_classes: [
						'table', 'table-bordered', 'table-striped',
						'table-text-center', 'table-vertical-middle', 'table-condensed'
					], page_len: standings.length,
					print_after_table: () => `<div class="text-right text-muted">${uojLocale("contests::n participants", standings.length)}</div>`
				}
			);
			$('#Faker-delta-change').bind('click', function() {
				let resp = Number(prompt(uojLocale('contests::insert max rating change value')));
				if(resp !== resp)
					alert(uojLocale('contests::invalid input'));
				else
					delta = resp, standings_extand = undefined, showStandings();
			});
		};
		if(unsafeWindow.standings)
			showStandings();
	}).then(() => wait_for(() => document.getElementById('input-name'))).then(() => {
		document.getElementById('input-name').removeAttribute('maxlength');
	});
}

if(isPage('problem') || isPage('contestProblem'))
	wait_for(() => unsafeWindow.$).then(() => wait_for(() => unsafeWindow.locale)).then(function() {
		if(unsafeWindow.locale === 'en')
			[...$('.btn.btn-info.pull-right:contains("题解")')[0].childNodes]
				.filter(n => n.nodeType === 3 && n.data.includes('题解'))
				.forEach(n => n.data = n.data.replace('题解', uojLocale('problem::solution')));
	});

wait_for(() => document).then(() => wait_for(() => document.body)).then(async function(body) {
	(function addTestSign() {
		let sign = document.createElement('div');
		sign.innerHTML = 'ZROJ Faker Test Version 0.5.3', sign.classList.add('Faker-sign');
		body.appendChild(sign);
	})();

	await wait_for(() => document.getElementsByClassName('uoj-footer').length);

	if(isPage('404'))
		GM_changeValue('pagesVisited', e => (e['404ed']++, e));
	/**
	 *	实际上，这个禁用比赛界面题解以及统计的功能 2024/4/20 就写出来了（当时仍然处于内测状态），似乎早于洛谷的 “比赛模式” 功能（大概在 2024/4/25 11:00）。
	**/
	if(isPage('contestProblem'))
		if(isPage('404'))
			GM_changeValue('pagesVisited', e => (e['404jump']++, e)),
			location.replace(location.pathname.replace(/^\/contest\/\d+/, ''));
		else
			wait_for(() => document.querySelector('ul.nav.nav-tabs')).then(function() {
				document.querySelector('ul.nav.nav-tabs').insertAdjacentHTML('beforeend', `<li><a href="/problem/${location.pathname.match(/^\/contest\/\d+\/problem\/(\d+)$/)[1]}" role="tab">${uojLocale('problem::original problem')}</a></li>`);
			}), when_do(() => document.querySelector('a.btn.btn-info.pull-right:not([hasbeendisabled])'), undefined, undefined, function() {
				[...document.querySelectorAll('a.btn.btn-info.pull-right:not([hasbeendisabled])')].forEach(e => {
					if((txt => [uojLocale('problem::solution'), uojLocale('problem::statistics')].indexOf(txt.trim()) + 1)(e.innerText))
						e.addEventListener('click', ev => ev.preventDefault()),
						e.setAttribute('hasbeendisabled', ''), e.removeAttribute('href');
				});
			});
});

console.log('Faker Test Log:', GM_getValue('pagesVisited'));
