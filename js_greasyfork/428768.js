// ==UserScript==
// @name         Translate 3rdguide
// @namespace    Translate 3rdguide
// @version      0.15
// @description  Automated and updated version of honkai-guide.web.app's translation for 3rdguide's website
// @author       honkai-guide.web.app
// @match        https://www.3rdguide.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/428768/Translate%203rdguide.user.js
// @updateURL https://update.greasyfork.org/scripts/428768/Translate%203rdguide.meta.js
// ==/UserScript==

(function() {
	'use strict';
	/* globals $ */

	// Allow new tab opening of team links
	// https://honkai-guide.web.app/calc/calc.html#/
	// Doesn't allow middle click on FF, mouseup to get around isn't possible because of popup detection,
	// alternative is to just replace div->a in each td but that messes up layout on 2nd col. Meh.
	$('#ct_det tbody').off().on('click', 'tr', function() {
		const urlstr = $(this).find('.tgcol0').data('url');
		if (urlstr != undefined) window.open(urlstr, '_blank');
	});

	// Translations
	const
	tls = {
		// Misc
		'记忆战场':'Memorial Arena',
		'超弦空间':'Superstring',
		'战区:': 'Bracket',
		'终极战区': 'Exalted',
		'高级战区': 'Masters',
		'SSS难度':'SSS difficulty',
		'强敌:': 'Bosses',
		'女武神:': 'Valkyries',
		'阵容':'Line-up',
		'得分':'Score',
		'造价':'Cost',
		'操作难度':'Difficulty',
		'好评数':'Likes',
		'创建时间':'Date',
		'扰动幅度':'Disturbance',
		'红莲':'Red Lotus',
		'寂灭':'Nirvana',
		'苦痛':'Agony',
		'原罪':'Sinful',
		'禁忌':'Forbidden',
		'段位:':'Rank',
		'天气:':'Weather',
		'区域:':'Area',
		'边缘区':'Fringe   ',
		'密集区':'Intensive',
		'高危区':'Perilous ',
		'特异区':'Singular ',
		'恐雷':'Lightning',
		'怯火':'Fire',
		'惧冰':'Ice',
		'量子':'Quantum',
		'畏血':'Physical',
		'协奏':'Multi Elemental',
		'狙击':'Ranged',
		'天敌':'Counter',
		'燃素':'Ignited',
		'雷劫':'Electrified',
		'战意':'Bloodthirsty',
		'坚阵':'Fortified',
		'血棘':'Bleeding',
		'冰结':'Freeze',
		'白刃':'Melee',
		'统御':'Summon',
		'失衡':'Stun',
		'机械':'Mecha',
		'异能':'Psychic',
		'生物':'Bio',
		'机械、生物':'Mecha & Bio',
		'生物、机械':'Bio & Mecha',
		'异能、生物':'Psychic & Bio',
		'生物、异能':'Bio & Psychic',
		'异能、机械':'Psychic & Mecha',
		'机械、异能':'Mecha & Psychic',
		'虚数、异能':'Imaginary & Psychic',
		'生物、异能、机械':'Bio, Psychic & Mecha',
		'异种·巡行级崩坏兽':'Patroller',
		'督军级崩坏兽':'Emperor',
		'虚数':'Imaginary',
		'群怪':'Mobs',
		'群聚敌人':'Gather',
		'熔炎帝王':'Flame Emperor',
		'量产型教父':'Flame Emperor',
		'旋肢之影':'Spinning Shadow',

		// Bosses
		'托纳提乌·噬日之影':'Tonatiuh',
		'托纳提乌-噬日之影':'Tonatiuh',
		'祸斗':'Huodou',
		'吼姆王':'Homu King',
		'绯狱丸':'Hellmaru',
		'海姆达尔':'Heimdall',
		'湮灭沉灵':'Doom',
		'教父军团':'Padrino Legion',
		'特里波卡':'Mexicatl',
		'贝纳勒斯':'Benares',
		'姬麟·黑':'DXY',
		'MHT-3和平使者':'MHT-3 Pax',
		'MHT-3 和平使者':'MHT-3 Pax',
		'阿湿波':'Assaka',
		'地藏御魂':'Jizo Mitama',
		'赫菲斯托斯':'Hephaestus ',
		'帕凡提':'Parvati',
		'被诅咒的英魂':'Cursed Soul',
		'科亚特尔-复生之影':'Couatl',
		'八重霞':'Kasumi',
		'陨冰之律者':'Rimestar',
		'虚树神骸-虚无主义':'Nihilus Husk',
		'深渊终极区':'Quantum Emperor',
		'虚数神骸-虚无主义II':'Nihilism Husk [HitCount]',
		'虚树神骸-虚无主义II':'Nihilism Husk [HitCount]',
		'神机-海姆达尔':'Heimdall',
		'迦尼萨':'Ganesha',
		'昆巴卡纳':'Kumbhakarna',
		'特里波卡-混沌之影':'Frost Honkai',
		'娑婆 阿湿波':'Assaka',
		'和平使者':'MHT-3',
		'吼姆魔术师':'Homu King',
		'奔狼的领主':'Andrius',
		'MHT-3B 天堂使者':'MHT-3B',
		'支配之律者-乌合之众':'Herrscher of Dominance',
		'逐火十三英桀 爱莉希雅':'Elysia',
		'伪神·奥托':'False God Otto',
		'伪神奥托':'False God Otto',
		'奥托·阿波卡利斯':'Otto Apocalypse',
		'煌夜骑士':'Nocturnal Knight',
		'逐火十三英桀·科斯魔':'Kosma',
		'蔽光之影':'Quantum Whale',
		'雷神级崩坏兽':'Templar',
		'死亡编织者':'Spider',
		'逐火十三英桀·维尔薇':'Vill-V',
		'逐火十三英桀·千劫':'Kalpas',
		'贝纳勒斯·冰形态':'Benares [Ice]',
		'侵蚀之律者':'Herrscher of Corruption',
		'虚树神骸-神秘主义':'Mysticism',
		'虚树神骸-存在主义':'Existentialism',
		'「业魔」凯文':'Diabolic Kevin',
		'毕舍遮':'Pishacha',
		'逐火十三英桀 阿波尼亚':'Aponia',
		'塔之钳梏':'Warden',
		'黑之赐死、白之悬剑':'Wardens of Tower',
		'巡航审判团':'Cruising Judgment',
		'飞鱼：游弋集群':'Cruising Swarm',
		'冰之律者':'Herrcher of Ice',

		// Valkyries
		'爱衣·休伯利安Λ':'Ai Hyperion Λ',
		'时帆旅人':'Chrono Navi',

		'李素裳':'Li Sushang',
		'玉骑士·月痕':'Jade Knight',

		'维尔薇':'Vill-V',
		'螺旋·愚戏之匣':'Helical Contraption',

		'格蕾修':'Griseo',
		'繁星·绘世之卷':'Starry Impression',

		'卡萝尔·佩珀':'Carole Pepper',
		'甜辣女孩':'Sweet n Spicy',

		'娜塔莎·希奥拉':'Raven',
		'午夜苦艾':'Midnight Absinthe',

		'梅比乌斯':'Mobius',
		'无限·噬界之蛇':'Infinite Ouroboros',

		'符华':'Fu Hua',
		'识之律者':'Herrscher of Sentience',
		'云墨丹心':'Azure Empyrea',
		'雾都迅羽':'Hawk of the Fog',
		'白夜执事':'Night Squire',
		'炽翎':'Phoenix',
		'影骑士·月轮':'Shadow Knight',
		'女武神·迅羽':'Valkyrie Accipiter',

		'明日香':'Asuka',

		'八重樱':'Yae',
		'夜隐重霞':'Darkbolt Jonin',
		'真炎幸魂':'Flame Sakitama',
		'逆神巫女':'Gyakushinn Miko',
		'御神装·勿忘':'Goushinnso Memento',

		'希儿·芙乐艾':'Seele',
		'魇夜星渊':'Starchasm Nyx',
		'彼岸双生':'Stygian Nymph',
		'幻海梦蝶':'Swallowtail Phantasm',
		'死生之律者':'Herrscher of Rebirth',

		'幽兰黛尔':'Durandal',
		'女武神·荣光':'Valkyrie Gloria',
		'辉骑士·月魄':'Bright Knight: Excelsis',
		'不灭星锚':'Dea Anchora',
		'天元骑英':'Palatinus Equinox',

		'德丽莎':'Theresa',
		'暮光骑士·月煌':'Twilight Paladin',
		'月下初拥':'Luna Kindred',
		'神恩颂歌':'Celestial Hymn',
		'处刑装·紫苑':'Violet Executer',
		'樱火轮舞':'Sakura Rondo',
		'女武神·誓约':'Valkyrie Pledge',
		'朔夜观星':'Starlit Astrologos',
		'月下誓约·予爱以心':'Lunar Vow Crimson Love',

		'琪亚娜':'Kiana',
		'天穹游侠':'Void Ranger',
		'空之律者':'Herrscher of the Void',
		'圣女祈祷':'Divine Prayer',
		'女武神·游侠':'Valkyrie Ranger',
		'白骑士·月光':'Knight Moonbeam',
		'领域装·白练':'White Comet',
		'薪炎之律者':'Herrscher of Flamescion',
		'终焉之律者':'Herrscher of Finality',

		'布洛妮娅':'Bronya',
		'迷城骇兔':'Haxxor Bunny',
		'理之律者':'Herrscher of Reason',
		'彗星驱动':'Drive Kometa',
		'异度黑核侵蚀':'Black Nucleus',
		'银狼的黎明': "Wolf's Dawn",
		'次元边界突破':'Dimension Breaker',
		'女武神·战车':'Valkyrie Chariot',
		'驱动装·山吹':'Yamabuki Armor',
		'雪地狙击':'Snowy Sniper',
		'次生银翼':'Silver Wing',
		'真理之律者':'Herrscher of Truth',

		'阿琳姐妹':'Twins',
		'狂热蓝调Δ':'Fervent Tempo Delta',
		'樱桃炸弹':'Molotov Cherry',
		'蓝莓特攻':'Blueberry Blitz',

		'芽衣':'Mei',
		'断罪影舞':'Danzai Spectramancer',
		'雷之律者':'Herrscher of Thunder',
		'破晓强袭':'Striker Fulminata',
		'雷电女王的鬼铠':'Lightning Empress',
		'脉冲装·绯红':'Crimson Impulse',
		'女武神·强袭':'Valkyrie Bladestrike',
		'影舞冲击':'Shadow Dash',
		'始源之律者':'Herrscher of Origin',

		'丽塔':'Rita',
		'失落迷迭':'Fallen Rosemary',
		'苍骑士·月魂':'Argent Knight: Artemis',
		'猎袭装·影铁':'Phantom Iron',
		'黯蔷薇':'Umbral Rose',
		'缭乱星棘':'Spina Astera',

		'姬子':'Himeko',
		'真红骑士·月蚀':'Vermilion Knight: Eclipse',
		'极地战刃':'Arctic Kriegsmesser',
		'融核装·深红':'Scarlet Fusion',
		'战场疾风':'Battle Storm',
		'女武神·凯旋':'Valkyrie Triumph',
		'血色玫瑰':'Blood Rose',

		'卡莲':'Kallen',
		'原罪猎人':'Sündenjäger',
		'第六夜想曲':'Sixth Serenade',
		'圣仪装·今样':'Imayoh Ritual',

		'菲谢尔':'Fischl',
		'断罪皇女！！':'Prinzessin der Verurteilung',

		'爱莉希雅':'Elysia',
		'粉色妖精小姐♪':'Miss Pink Elf♪',
		'真我·人之律者':'Herrscher of Human',

		'帕朵菲莉丝':'Pardofelis',
		'空梦·掠集之兽':'Reverist Calico',

		'伊甸':'Eden',
		'黄金·璀耀之歌':'Golden Diva',

		'阿波尼亚':'Aponia',
		'戒律·深罪之槛':'Disciplinary Perdition',

		'苏莎娜':'Susannah',
		'女武神·热砂':'Valkirye Quicksand',

		'米丝忒琳·沙尼亚特':'Misteln',
		'织羽梦旌':'Dreamweaver',

		'普罗米修斯':'Prometheus',
		'终末协理0017':'Terminal Aide 0017',

		'时雨绮罗':'Shigure Kira',
		'糖露星霜':'Sugary Starburst',

		'西琳':'Sirin',
		'奇迹☆魔法少女':'Miracle Magic Girl'
	}

	const tl_el = function(tls, el) {
		if (el && tls[el.innerText]) {
			el.innerHTML = el.innerHTML.replace(el.innerText, tls[el.innerText])
		}
	}

	const translate = function() {
		$('th, span, .table-search .label, div.title').each(function() {
			tl_el(tls, this)
		});

		$('.table-search .filter-item .select-item').on('click', 'li', translate);
		$('.el-select-dropdown__item').on('click', 'li', translate);

		$('.table-search .filter-item .select-item').click(function(){setTimeout(function(){translate()}, 10)});
		$('.el-select-dropdown__item').click(function(){setTimeout(function(){translate()}, 10)});

		$('.table-search .filter-item .select-item').click(function(){setTimeout(function(){translate()}, 100)});
		$('.el-select-dropdown__item').click(function(){setTimeout(function(){translate()}, 100)});
	}

	translate()

	function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css.replace(/;/g, ' !important;');
		head.appendChild(style);
	}
	
	addGlobalStyle('.table-team-box table .tgcol1 {min-width: 228px;}')
})();