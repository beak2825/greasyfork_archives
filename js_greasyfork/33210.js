// ==UserScript==
// @name			Harem Heroes++
// @namespace		haremheroes.com
// @description		Adding things here and there in Harem Heroes game.
// @version			0.05.1
// @match			http://nutaku.haremheroes.com/*
// @match			https://www.hentaiheroes.com/*
// @match			https://www.gayharem.com/*
// @run-at			document-end
// @grant			none
// @author			Raphael
// @downloadURL https://update.greasyfork.org/scripts/33210/Harem%20Heroes%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/33210/Harem%20Heroes%2B%2B.meta.js
// ==/UserScript==

/* ==================
      localStorage
   ==================
	- lsMarket				(updated each time you enter the Market / click buttons in Market)
		.buyable
			.potion.Nb		= number of buyable books
			.potion.Xp		= total xp of buyable books
			.potion.Value	= cost of buyable books
			.gift.Nb		= number of owned gifts
			.gift.Xp		= total affection of buyable gifts
			.gift.Value		= cost of buyable gifts
		.stocks
			.armor.Nb		= number of owned equipments
			.booster.Nb		= number of owned boosters
			.potion.Nb		= number of owned books
			.potion.Xp		= total xp you can give to your girls
			.gift.Nb		= number of owned gifts
			.gift.Xp		= total affection you can give to your girls
		.restock
			.herolvl		= hero level before restock
			.time			= next market restock time
   ================== */

var CurrentPage = window.location.pathname;

// css define
var sheet = (function() {
	var style = document.createElement('style');
	document.head.appendChild(style);
	return style.sheet;
})();

// verify localstorage
var lsAvailable = (lsTest() === true) ? 'yes' : 'no';

FightATroll();														// added everywhere
if (CurrentPage.indexOf('shop') != -1) ModifyMarket();				// Current page: Market
else if (CurrentPage.indexOf('harem') != -1) ModifyHarem();			// Current page: Harem
else if (CurrentPage.indexOf('quest') != -1) ModifyScenes();		// Current page: Haremettes' Scenes


/* ======================
	 Fight A Troll Menu
   ====================== */

function FightATroll() {
	// Trolls' database
	var Trolls = ['Dark Lord', 'Ninja Spy', 'Gruntt', 'Edwarda', 'Donatien', 'Silvanus', 'Bremen', 'Finalmecia'];

	// get current world of player
	var CurrentWorld = Hero.infos.questing.id_world - 1,
		TrollName = '',
		TrollsMenu = '';

	// generate troll list
	for (var i = 0; i < CurrentWorld; i++) {
		if (typeof Trolls[i] !== typeof undefined && Trolls[i] !== false) {
			TrollName = Trolls[i];
		} else TrollName = 'World ' + (i+1) + ' troll';
		TrollsMenu += '<a href="/battle.html?id_troll=' + (i+1) + '">' + TrollName + '</a><br />';
	}

	// display: 'Fight a troll' menu
	$('#contains_all > header').children('[type=energy_fight]').append('<div id="FightTroll">Fight a Troll<span class="Arrow"></span><div class="TrollsMenu">' + TrollsMenu + '</div></div>');

	// -----------------
	//     CSS RULES
	// -----------------

	sheet.insertRule('#FightTroll {'
						+ 'position: absolute;'
						+ 'z-index: 99;'
						+ 'width: 90%;'
						+ 'margin:21px 0 0 13px;'
						+ 'border-radius: 8px 10px 10px 8px;'
						+ 'background: rgba(102,136,153,0.67);'
						+ 'box-shadow: 0 0 0 1px rgba(255,255,255,0.73);'
						+ 'text-align: center; }');

	sheet.insertRule('#FightTroll > .Arrow {'
						+ 'float:right;'
						+ 'background-image: url("http://i.harem-battle.club/images/2017/09/19/Fmo.png");'
						+ 'background-size: 18px 18px;'
						+ 'background-repeat: no-repeat;'
						+ 'width: 18px;'
						+ 'height: 18px; }');

	sheet.insertRule('#FightTroll > .TrollsMenu {'
						+ 'position: absolute;'
						+ 'width: 88%;'
						+ 'margin-left:6px;'
						+ 'border-radius: 0px 0 8px 8px;'
						+ 'background: rgba(102,136,153,0.67);'
						+ 'line-height: 15px;'
						+ 'opacity: 0;'
						+ 'visibility: hidden;'
						+ 'transition: opacity 400ms, visibility 400ms; }');

	sheet.insertRule('#FightTroll:hover > .TrollsMenu {'
						+ 'opacity: 1;'
						+ 'visibility: visible; }');

	sheet.insertRule('#FightTroll a {'
						+ 'color: rgb(255, 255, 255);'
						+ 'text-decoration: none; }');

	sheet.insertRule('#FightTroll a:hover {'
						+ 'color: rgb(255, 247, 204);'
						+ 'text-decoration: underline; }');
}


/* ==========
	 Market
   ========== */

function ModifyMarket() {
	var lsMarket = {};
	lsMarket.buyable = {};
	lsMarket.stocks = {};
	lsMarket.restock = {};

	setTimeout( function() {
		// save time of restock
		var RestockTimer = $('#shop > .shop_count > span').text().split(':'),
			s = 0, m = 1;
		// convert HH:MM:SS or MM:SS or SS to seconds
		while (RestockTimer.length > 0) {
			s += m * parseInt(RestockTimer.pop(), 10);
			m *= 60;
		}
		lsMarket.restock.herolvl = Hero.infos.level;
		lsMarket.restock.time = (new Date()).getTime() + s*1000;

		// first load
		get_buyableStocks('potion');
		get_buyableStocks('gift');
		equipments_shop(0);
		boosters_shop(0);
		books_shop(0);
		gifts_shop(0);
	}, 500 );


	// catch click on Buy, Restock, Equip/Offer or Sell > update tooltip after 500ms
	var timer;
	$('#shop > button, #inventory > button').click(function() {
		var clickedButton = $(this).attr('rel'),
			opened_shop = $('#shop').children('.selected');
		clearTimeout(timer); // kill previous update
		timer = setTimeout( function() {
			if (opened_shop.hasClass('armor')) {
				equipments_shop(1);
			} else if (opened_shop.hasClass('booster')) {
				boosters_shop(1);
			} else if (opened_shop.hasClass('potion')) {
				if (clickedButton == 'buy' || clickedButton == 'shop_reload') get_buyableStocks('potion');
				books_shop(1);
			} else if (opened_shop.hasClass('gift')) {
				if (clickedButton == 'buy' || clickedButton == 'shop_reload') get_buyableStocks('gift');
				gifts_shop(1);
			}
		}, 500 );
    });

	function get_buyableStocks(loc_class) {
		// initialize
		var itemsNb = 0,
			itemsXp = 0,
			itemsPrice = 0,
			loc = $('#shop').children('.' + loc_class);
		// get stats
		loc.find('.slot').each(function() {
			if ($(this).hasClass('empty')) return false;
			var item = $(this).data('d');
			itemsNb++;
			itemsXp += parseInt(item.value, 10);
			itemsPrice += parseInt(item.price, 10);
		});
		// save
		lsMarket.buyable[loc_class] = {'Nb':itemsNb, 'Xp':itemsXp, 'Value':itemsPrice};
	}

	function equipments_shop(update) {
		tt_create(update, 'armor', 'EquipmentsTooltip', 'equipments', '');
	}
	function boosters_shop(update) {
		tt_create(update, 'booster', 'BoostersTooltip', 'boosters', '');
	}
	function books_shop(update) {
		tt_create(update, 'potion', 'BooksTooltip', 'books', 'Xp');
	}
	function gifts_shop(update) {
		tt_create(update, 'gift', 'GiftsTooltip', 'gifts', 'affection');
	}

	// create/update tooltip & save to localstorage
	function tt_create(update, loc_class, tt_class, itemName, itemUnit) {
		// initialize
		var itemsNb = 0,
			itemsXp = (itemUnit === '') ? -1 : 0,
			itemsSell = 0,
			loc = $('#inventory').children('.' + loc_class);

		// get stats
		loc.find('.slot').each(function() {
			if ($(this).hasClass('empty')) return false;
			var item = $(this).data('d'),
				Nb = parseInt(item.count, 10);
			itemsNb += Nb;
			itemsSell += Nb * parseInt(item.price_sell, 10);
			if (itemsXp != -1) itemsXp += Nb * parseInt(item.value, 10);
		});

		var tooltip = 'You own <b>' + NbCommas(itemsNb) + '</b> ' + itemName + '.<br />'
					+ (itemsXp == -1 ? '' : 'You can give a total of <b>' + NbCommas(itemsXp) + '</b> ' + itemUnit + '.<br />')
					+ 'You can sell everything for <b>' + NbCommas(itemsSell) + '</b> <span class="imgMoney"></span>.';

		// save to localstorage
		lsMarket.stocks[loc_class] = (loc_class == 'potion' || loc_class == 'gift') ? {'Nb':itemsNb, 'Xp':itemsXp} : {'Nb':itemsNb};
		localStorage.setItem('lsMarket', JSON.stringify(lsMarket));

		// create or update tooltip
		if (update === 0) {
			loc.prepend('<span class="CustomTT"></span><div class="' + tt_class + '">' + tooltip + '</div>');
		} else {
			loc.children('.' + tt_class).html(tooltip);
		}
	}

	// -----------------
	//     CSS RULES
	// -----------------

	sheet.insertRule('#inventory .CustomTT {'
						+ 'float: right;'
						+ 'margin: 11px 1px 0 0;'
						+ 'background-image: url("http://i.harem-battle.club/images/2017/09/13/FPE.png");'
						+ 'background-size: 20px 20px;'
						+ 'width: 20px;'
						+ 'height: 20px; }');

	sheet.insertRule('#inventory .CustomTT:hover {'
						+ 'cursor: help; }');

	sheet.insertRule('#inventory .CustomTT:hover + div {'
						+ 'opacity: 1;'
						+ 'visibility: visible; }');

	sheet.insertRule('#inventory .EquipmentsTooltip, #inventory .BoostersTooltip, #inventory .BooksTooltip, #inventory .GiftsTooltip {'
						+ 'position: absolute;'
						+ 'z-index: 99;'
						+ 'width: 240px;'
						+ 'border: 1px solid rgb(162, 195, 215);'
						+ 'border-radius: 8px;'
						+ 'box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1);'
						+ 'padding: 3px 7px 4px 7px;'
						+ 'background-color: #F2F2F2;'
						+ 'font: normal 10px/17px Tahoma, Helvetica, Arial, sans-serif;'
						+ 'color: #057;'
						+ 'opacity: 0;'
						+ 'visibility: hidden;'
						+ 'transition: opacity 400ms, visibility 400ms; }');

	sheet.insertRule('#inventory .EquipmentsTooltip, #inventory .BoostersTooltip {'
						+ 'margin: -33px 0 0 210px;'
						+ 'height: 43px; }');

	sheet.insertRule('#inventory .BooksTooltip, #inventory .GiftsTooltip {'
						+ 'margin: -50px 0 0 210px;'
						+ 'height: 60px; }');

	sheet.insertRule('#inventory .EquipmentsTooltip b, #inventory .BoostersTooltip b, #inventory .BooksTooltip b, #inventory .GiftsTooltip b {'
						+ 'font-weight:bold; }');

	sheet.insertRule('#inventory .imgMoney {'
						+ 'background-size: 12px 12px;'
						+ 'background-repeat: no-repeat;'
						+ 'width: 12px;'
						+ 'height: 14px;'
						+ 'vertical-align: text-bottom;'
						+ 'background-image: url("http://i.harem-battle.club/images/2017/01/07/0Gsvn.png");'
						+ 'display: inline-block; }');
}


/* =========
	 Harem
   ========= */

function ModifyHarem() {
	// initialize
	var i = 0,
		GirlId = '',
		GirlName = '',
		Anchor = '',
		Specialty = [0, 0, 0], // [Hardcore, Charm, Know-how]
		UnlockedSc = 0,
		AvailableSc = 0,
		IncHourly = 0,
		IncCollect = 0,
		HList = [],
		Saffection = 0, // S= Stats tab
		Smoney = 0,
		Skobans = 0,
		ScenesLink = '';

	var EvoReq = [];
	EvoReq.push({ affection: 15, money: 3150, kobans: 30 });
	EvoReq.push({ affection: 50, money: 6750, kobans: 90 });
	EvoReq.push({ affection: 150, money: 18000, kobans: 150 });
	EvoReq.push({ affection: 700, money: 135000, kobans: 240 });
	EvoReq.push({ affection: 1750, money: 968000, kobans: 300 });

	// parse haremettes list
	$('#harem_left').find('div[girl]').each( function(){
		i++;

		GirlId = $(this).attr('girl');
		GirlName = $(this).find('h4').text();
		IncCollect += parseInt($(this).find('.sal').text(), 10);
		HList.push({Id: GirlId, Order: i, Name: GirlName});

		// add anchor
		$(this).attr('id', GirlName);
		// is opened girl?
		if ($(this).hasClass('opened')) Anchor = GirlName;

		// display: haremette number
		$(this).find('h4').append('<div class="HaremetteNb">' + i + '</div>');
	});
	var HaremBottom = '<a href="#' + GirlName + '">Bottom</a>';

	// auto-scroll to anchor
	location.hash = '#' + Anchor;

	// get haremettes stats & display wiki link
	i = 0;
	$('#harem_right').children('[girl]').each( function() {
		// display: wiki link
		$(this).append('<div class="WikiLink"><a href="http://harem-battle.club/wiki/Harem-Heroes/HH:' + HList[i].Name + '" target="_blank"> her wiki page </a></div>');
		i++;

		var j = 0,
			Taffection = 0, // T= Total requirements (right tooltip)
			Tmoney = 0,
			Tkobans = 0,
			FirstLockedScene = 1,
			AffectionTT = 'She is your <b>' + i + '</b>th haremette. Her evolution costs are:<br />',
			girl_quests = $(this).find('.girl_quests');

		// get stats: specialty
		Spe = parseInt($(this).find('h3 > span').attr('carac'), 10) - 1;
		Specialty[Spe]++;

		// get stats: hourly income
		IncHourly += parseInt($(this).find('.salary').text(), 10);

		girl_quests.find('g').each( function() {
			// prepare affection tooltip
			var Raffection = EvoReq[j].affection * i, // R= Required for this star (right tooltip)
				Rmoney = EvoReq[j].money * i,
				Rkobans = EvoReq[j].kobans * i;
			Taffection += Raffection;
			Tmoney += Rmoney;
			Tkobans += Rkobans;
			j++;
			AffectionTT += '<b>' + j + '</b><span class="imgStar"></span> : '
						 + NbCommas(Raffection) + ' affection, '
						 + NbCommas(Rmoney) + ' <span class="imgMoney"></span> or '
						 + NbCommas(Rkobans) + ' <span class="imgKobans"></span><br />';

			// get stats: unlocked/available scenes & prepare scenes link
			AvailableSc++;
			ScenesLink += (ScenesLink === '') ? 'hh_scenes=' : ',';
			var SceneHref = $(this).parent().attr('href');
			if ($(this).hasClass('grey')) {
				if (FirstLockedScene === 0) {
					Saffection += Raffection;
					ScenesLink += '0';
				} else {
					FirstLockedScene = 0;
					var XpLeft = girl_quests.parent().children('.girl_exp_left');
					var isUpgradable = girl_quests.parent().children('.green_text_button');
					// girl has Xp left
					Saffection += (XpLeft.length) ? parseInt(XpLeft.text().match(/^.+: (.*)$/)[1].replace(',',''), 10) : 0;
					// girl is upgradable
					ScenesLink += (isUpgradable.length) ? '0.' + isUpgradable.attr('href').substr(7) : '0';
				}
				Smoney += Rmoney;
				Skobans += Rkobans;
			} else {
				UnlockedSc++;
				ScenesLink += $(this).parent().attr('href').substr(7);
			}
		});

		// change scene links
		girl_quests.children('a').each(function() {
			var attr = $(this).attr('href');
			if (typeof attr !== typeof undefined && attr !== false) {
				$(this).attr('href', attr + '?' + ScenesLink);
			}
		});
		ScenesLink = '';

		AffectionTT += '<b>Total:</b> '
					 + NbCommas(Taffection) + ' affection, '
					 + NbCommas(Tmoney) + ' <span class="imgMoney"></span> or '
					 + NbCommas(Tkobans) + ' <span class="imgKobans"></span>';

		// display: Affection costs tooltip
		girl_quests.parent().children('h4').prepend('<span class="CustomTT"></span><div class="AffectionTooltip">' + AffectionTT + '</div>');
	});

	// ### TAB: Quick List ###

	// order haremettes alphabetically
	HList.sort(function(a, b) {
		var textA = a.Name.toUpperCase(),
			textB = b.Name.toUpperCase();
		return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
	});
	// html quick list
	var len = HList.length,
		QListString = '<div class="QListContent"><span class="Title">Quick List:</span>';
	for (i = 0; i < len; i++) {
		QListString += '<br /><a f="ql_girl" girl="' + HList[i].Id + '" href="#' + HList[i].Name + '">' + HList[i].Name + '</a> (#' + HList[i].Order + ')';
	}
	QListString += '</div>';

	// ### TAB: Stats ###

	// Market stocks
	try {
		var lsMarket = JSON.parse(localStorage.getItem('lsMarket')),
			d = new Date(lsMarket.restock.time);
		console.log(lsMarket);

		// buyable stocks
		if (new Date() > lsMarket.restock.time || Hero.infos.level > lsMarket.restock.herolvl) {
			var RestockInfo = '> The <a href="../shop.html">Market</a> restocked since your last visit.';
		} else {
			var	marketBookTxt = lsMarket.buyable.potion.Nb + ' book' + (lsMarket.buyable.potion.Nb > 1 ? 's' : '') + ' (' + NbCommas(lsMarket.buyable.potion.Xp) + ' Xp)',
				marketGiftTxt = lsMarket.buyable.gift.Nb + ' gift' + (lsMarket.buyable.gift.Nb > 1 ? 's' : '') + ' (' + NbCommas(lsMarket.buyable.gift.Xp) + ' Aff)',
				RestockInfo = '- ' + marketBookTxt + ' for ' + NbCommas(lsMarket.buyable.potion.Value) + ' <img src="http://i.harem-battle.club/images/2017/01/07/0Gsvn.png">'
							+ '<br />- ' + marketGiftTxt + ' for ' + NbCommas(lsMarket.buyable.gift.Value) + ' <img src="http://i.harem-battle.club/images/2017/01/07/0Gsvn.png">'
							+ '<br /><font style="color:gray;">Restock: ' + d.toLocaleString() + ' (or level ' + (Hero.infos.level+1) + ')</font>';
		}

		// my stocks
		var myArmorTxt = NbCommas(lsMarket.stocks.armor.Nb) + (lsMarket.stocks.armor.Nb > 99 ? '+ ' : ' ') + 'equipment' + (lsMarket.stocks.armor.Nb > 1 ? 's' : ''),
			myBoosterTxt = NbCommas(lsMarket.stocks.booster.Nb) + ' booster' + (lsMarket.stocks.booster.Nb > 1 ? 's' : ''),
			myBookTxt = NbCommas(lsMarket.stocks.potion.Nb) + ' book' + (lsMarket.stocks.potion.Nb > 1 ? 's' : '') + ' (' + NbCommas(lsMarket.stocks.potion.Xp) + ' Xp)',
			myGiftTxt = NbCommas(lsMarket.stocks.gift.Nb) + ' gift' + (lsMarket.stocks.gift.Nb > 1 ? 's' : '') + ' (' + NbCommas(lsMarket.stocks.gift.Xp) + ' Aff)',
			MarketStocks = '- ' + myArmorTxt + ', ' + myBoosterTxt
						 + '<br />- ' + myBookTxt
						 + '<br />- ' + myGiftTxt
						 + '<span class="subTitle">Currently Buyable Stocks:</span>'
						 + RestockInfo;
	} catch(e) {
		var MarketStocks = (lsAvailable == 'yes') ? '> Visit the <a href="../shop.html">Market</a> first.' : '> Your webbrowser is not compatible.';
	}

	var StatsString = '<div class="StatsContent"><span class="Title">Harem Stats:</span>'
					+ '<span class="subTitle" style="margin-top:-10px;">' + i + ' haremettes:</span>'
					+ '- ' + Specialty[0] + ' Hardcore, ' + Specialty[1] + ' Charm, ' + Specialty[2] + ' Know-how'
					+ '<br />- ' + UnlockedSc + '/' + AvailableSc + ' unlocked scenes'
					+ '<span class="subTitle">Money incomes:</span>'
					+ '~' + NbCommas(IncHourly) + ' <img src="http://i.harem-battle.club/images/2017/01/07/0Gsvn.png"> per hour'
					+ '<br />' + NbCommas(IncCollect) + ' <img src="http://i.harem-battle.club/images/2017/01/07/0Gsvn.png"> when all collectable'
					+ '<span class="subTitle">Required to unlock all locked scenes:</span>'
					+ '- ' + NbCommas(Saffection) + ' affection'
					+ '<br />- ' + NbCommas(Smoney) + ' <img src="http://i.harem-battle.club/images/2017/01/07/0Gsvn.png">'
						+ ' or ' + NbCommas(Skobans) + ' <img src="http://i.harem-battle.club/images/2016/08/30/gNUo3XdY.png">'
					+ '<span class="subTitle">My Stocks:</span>'
					+ MarketStocks
					+ '</div>';

	// add custom bar buttons/links & quick list div & stats div
	$('#harem_left').append('<div id="CustomBar">'
						  + '<img f="list" src="http://i.harem-battle.club/images/2017/09/10/FRW.png">'
						  + '<img f="stats" src="http://i.harem-battle.club/images/2017/09/11/FRh.png">'
						  + '<div class="TopBottomLinks"><a href="#Bunny">Top</a>&nbsp;&nbsp;|&nbsp;&nbsp;' + HaremBottom + '</div>'
						  + '</div>'
						  + '<div id="TabsContainer">' + QListString + StatsString + '</div>');

	// cache
	TabsContainer = $('#TabsContainer');
	QList = TabsContainer.children('.QListContent');
	Stats = TabsContainer.children('.StatsContent');

	// catch clicks
	$('body').click(function(e) {
		var clickOn = e.target.getAttribute('f');
		switch (clickOn) {
			// on quick list button
			case 'list':
				toggleTabs(QList, Stats);
				break;
			// on stats button
			case 'stats':
				toggleTabs(Stats, QList);
				break;
			// on a girl in quick list
			case 'ql_girl':
				var clickedGirl = e.target.getAttribute('girl');
				$('#harem_left').find('[girl=' + clickedGirl + ']').triggerHandler('click');
				break;
			// somewhere else except custom containers
			default:
				var clickedContainer = $(e.target).closest('[id]').attr('id');
				if (clickedContainer == 'TabsContainer') return;
				TabsContainer.fadeOut(400);
		}
    });

	// tabs switching animations
	function toggleTabs(tabIn, tabOut) {
		if (TabsContainer.css('display') == 'block') {
			if (tabOut.css('display') == 'block') {
				tabOut.fadeOut(200);
				setTimeout( function(){ tabIn.fadeIn(300); }, 205 );
			} else {
				TabsContainer.fadeOut(400);
			}
		} else {
			tabOut.toggle(false);
			tabIn.toggle(true);
			TabsContainer.fadeIn(400);
		}
	}

	// -----------------
	//     CSS RULES
	// -----------------

	sheet.insertRule('#harem_left .HaremetteNb {'
						+ 'float: right;'
						+ 'line-height: 14px;'
						+ 'font-size: 12px; }');

	sheet.insertRule('#CustomBar {'
						+ 'position: absolute;'
						+ 'z-index: 99;'
						+ 'width: 100%;'
						+ 'padding: 3px 10px 0 3px;'
						+ 'font: bold 10px Tahoma, Helvetica, Arial, sans-serif; }');

	sheet.insertRule('#CustomBar img {'
						+ 'width: 20px;'
						+ 'height: 20px;'
						+ 'margin-right: 3px;'
						+ 'opacity: 0.5; }');

	sheet.insertRule('#CustomBar img:hover {'
						+ 'opacity: 1;'
						+ 'cursor: pointer; }');

	sheet.insertRule('#CustomBar .TopBottomLinks {'
						+ 'float: right;'
						+ 'margin-top: 2px; }');

	sheet.insertRule('#CustomBar a, #TabsContainer a, #harem_right .WikiLink a {'
						+ 'color: #057;'
						+ 'text-decoration: none; }');

	sheet.insertRule('#CustomBar a:hover, #TabsContainer a:hover, #harem_right .WikiLink a:hover {'
						+ 'color: #B14;'
						+ 'text-decoration: underline; }');

	sheet.insertRule('#TabsContainer {'
						+ 'position: absolute;'
						+ 'z-index: 99;'
						+ 'margin: -270px 0 0 -1px;'
						+ 'width: 240px;'
						+ 'height: 270px;'
						+ 'overflow-y: scroll;'
						+ 'border: 1px solid rgb(156, 182, 213);'
						+ 'box-shadow: 1px -1px 1px 0px rgba(0,0,0,0.3);'
						+ 'font: normal 10px/16px Tahoma, Helvetica, Arial, sans-serif;'
						+ 'color: #000000;'
						+ 'background-color: #ffffff;'
						+ 'display: none; }');

	sheet.insertRule('#TabsContainer > div {'
						+ 'padding: 1px 0 8px 10px; }');

	sheet.insertRule('#TabsContainer .Title {'
						+ 'margin-left: -5px;'
						+ 'font: bold 12px/22px Tahoma, Helvetica, Arial, sans-serif;'
						+ 'color: #B14; }');

	sheet.insertRule('#TabsContainer .subTitle {'
						+ 'padding-top: 10px;;'
						+ 'font-weight: bold;'
						+ 'display: block; }');

	sheet.insertRule('#TabsContainer img {'
						+ 'width: 14px;'
						+ 'height: 14px;'
						+ 'vertical-align: text-bottom; }');

	sheet.insertRule('#harem_right .CustomTT {'
						+ 'float: right;'
						+ 'margin-left: -25px;'
						+ 'background-image: url("http://i.harem-battle.club/images/2017/09/13/FPE.png");'
						+ 'background-size: 18px 18px;'
						+ 'width: 18px;'
						+ 'height: 18px; }');

	sheet.insertRule('#harem_right .CustomTT:hover {'
						+ 'cursor: help; }');

	sheet.insertRule('#harem_right .CustomTT:hover + div {'
						+ 'opacity: 1;'
						+ 'visibility: visible; }');

	sheet.insertRule('#harem_right .AffectionTooltip {'
						+ 'position: absolute;'
						+ 'z-index: 99;'
						+ 'margin: -130px 0 0 -28px;'
						+ 'width: 280px;'
						+ 'height: 127px;'
						+ 'border: 1px solid rgb(162, 195, 215);'
						+ 'border-radius: 8px;'
						+ 'box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1);'
						+ 'padding: 3px 7px 4px 7px;'
						+ 'background-color: #F2F2F2;'
						+ 'font: normal 10px/17px Tahoma, Helvetica, Arial, sans-serif;;'
						+ 'text-align: left;'
						+ 'opacity: 0;'
						+ 'visibility: hidden;'
						+ 'transition: opacity 400ms, visibility 400ms; }');

	sheet.insertRule('#harem_right .AffectionTooltip b {'
						+ 'font-weight: bold; }');

	sheet.insertRule('#harem_right .WikiLink {'
						+ 'float: right;'
						+ 'margin: -13px 7px 0 0;'
						+ 'font-size: 12px; }');

	sheet.insertRule('#harem_right .imgStar, #harem_right .imgMoney, #harem_right .imgKobans {'
						+ 'background-size: 10px 10px;'
						+ 'background-repeat: no-repeat;'
						+ 'width: 10px;'
						+ 'height: 14px;'
						+ 'display: inline-block; }');

	sheet.insertRule('#harem_right .imgStar {'
						+ 'background-image: url("http://i.harem-battle.club/images/2016/12/29/R9HWCKEtD.png"); }');

	sheet.insertRule('#harem_right .imgMoney {'
						+ 'background-image: url("http://i.harem-battle.club/images/2017/01/07/0Gsvn.png"); }');

	sheet.insertRule('#harem_right .imgKobans {'
						+ 'background-image: url("http://i.harem-battle.club/images/2016/08/30/gNUo3XdY.png"); }');
}


/* ==========
	 Scenes
   ========== */

function ModifyScenes() {
	// parse GET hh_scenes variable
	var currentScene = CurrentPage.substr(7),
		hh_scenesParams = new URL(window.location.href).searchParams.get('hh_scenes'),
		hh_scenes = hh_scenesParams.split(','),
		len = hh_scenes.length;

	// no scenes, less than 3 or more than 5 (human manipulation)
	if (!len || len < 3 || len > 5) {
		return false;
	} else {
		var ScenesNavigate = '<div class="Scenes" style="display:block;">Navigate:<br/>',
			SceneLink = '';

		for (var i = 0; i < len; i++ ) {
			// string format certification
			if (/^(0\.)?[0-9]{1,5}$/.test(hh_scenes[i]) === true) {
				if (hh_scenes[i] == currentScene) {
					SceneLink = '<span class="current">current</span>';
				} else if (hh_scenes[i] == '0') {
					SceneLink = '<span class="locked">locked</span>';
				} else if (parseInt(hh_scenes[i], 10) < 1) {
					SceneLink = '<a href="/quest/' + hh_scenes[i].substr(2) + '">unlock it!</a>';
				} else {
					SceneLink = '<a href="/quest/' + hh_scenes[i] + '?hh_scenes=' + hh_scenesParams + '">scene</a>';
				}
				ScenesNavigate += (i+1) + '<span class="imgStar"></span> ' + SceneLink + '<br />';
			}
			// string error: doesn't match (human manipulation)
			else return false;
		}
		ScenesNavigate += '<span class="backToHarem">< <a href="' + $('#breadcrumbs').children('a').eq(2).attr('href') + '">Harem</a></span></div>';

		// insert navigate interface
		$('#controls').append(ScenesNavigate);
	}

	// -----------------
	//     CSS RULES
	// -----------------

	sheet.insertRule('#controls .Scenes {'
						+ 'height:200px;'
						+ 'box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.3);'
						+ 'background-color:#000000;'
						+ 'background: linear-gradient(to bottom, rgba(196,3,35,1) 0%,rgba(132,2,30,1) 51%,rgba(79,0,14,1) 100%);'
						+ 'text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4);'
						+ 'display: block !important; }');

	sheet.insertRule('#controls .current {'
						+ 'color: rgb(251, 255, 108); }');

	sheet.insertRule('#controls .locked {'
						+ 'color: rgb(150, 99, 99); }');

	sheet.insertRule('#controls .Scenes a {'
						+ 'color: rgb(233, 142, 228);'
						+ 'text-decoration: none; }');

	sheet.insertRule('#controls .Scenes a:hover {'
						+ 'color: rgb(254, 202, 255);'
						+ 'text-decoration: underline; }');

	sheet.insertRule('#controls .backToHarem {'
						+ 'position: absolute;'
						+ 'bottom: 0;'
						+ 'left: 0;'
						+ 'width: 100%; }');

	sheet.insertRule('#controls .imgStar {'
						+ 'background-image: url("http://i.harem-battle.club/images/2016/12/29/R9HWCKEtD.png");'
						+ 'background-size: 10px 10px;'
						+ 'background-repeat: no-repeat;'
						+ 'width: 10px;'
						+ 'height: 18px;'
						+ 'display: inline-block; }');
}

// is localstorage available?
function lsTest() {
	try {
		localStorage.setItem('test', 'test');
		localStorage.removeItem('test');
		return true;
	} catch(e) {
		return false;
	}
}

// adds thousands commas
function NbCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

