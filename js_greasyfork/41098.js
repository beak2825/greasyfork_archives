// ==UserScript==
// @name			Gay Harem++
// @namespace		gayharem.com
// @description		Fixed to fit GH language and links. (Enlgish)
// @version			0.06.4
// @match			https://www.gayharem.com/*
// @run-at			document-end
// @grant			none
// @author			Raphael Updated by 1121 Orignal HH Link: https://greasyfork.org/en/scripts/39485-harem-heroes-modified-by-1121
// @downloadURL https://update.greasyfork.org/scripts/41098/Gay%20Harem%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/41098/Gay%20Harem%2B%2B.meta.js
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
			.potion.Xp		= total xp you can give to your guys
			.gift.Nb		= number of owned gifts
			.gift.Xp		= total affection you can give to your guys
		.restock
			.herolvl		= hero level before restock
			.time			= next market restock time
   ================== */
var lang = "en";
if($('html')[0].lang == "en")
    lang = "en";
else if($('html')[0].lang == "es_ES"){
        lang = "es";
}
else if($('html')[0].lang == "de_DE"){
    //    lang = "de";
}
else if($('html')[0].lang == "fr"){
        lang = "fr";
}
else if($('html')[0].lang == "it_IT"){
    //    lang = "it";
}

//alert($('html')[0].lang);
//lang = "et";
var texts = [];
texts.fr = {
    navigate:"Déplaces-toi",
    current:"actuelle",
    locked:"bloquée",
    unlock_it:"débloques-la!",
    scene:"scène",
    harem:"Harem",
    bottom:"bas",
    or:"ou",
    total:"total",
    affection:"affection",
    harem_stats:"Stats du harem",
    haremettes:"haremettes",
    hardcore:"Hardcore",
    charm:"Charme",
    know_how:"Savoir-faire",
    unlocked_scenes:"scènes débloquées",
    money_incomes:"Revenu",
    per_hour:"par heure",
    when_all_collectable:"quand tout est disponible",
    required_to_unlock:"Requis pour débloquer la scène",
    my_stocks:"Mes Stocks",
    top:"haut",
    equipments:"équipments",
    boosters:"boosters",
    books:"livres",
    gifts:"cadeaux",
    currently_buyable:"Stocks achetable",
    visit_the:'Visite le <a href="../shop.html">Marché</a> first.',
    not_combatible:"Votre navigateur n'est pas compatible.",
    or_level:"ou niveau",
    restock:"Restock",
    wiki:"wiki",
    she_is_your:"Elle est ta", //He_is_your:"Il est ton',
    evolution_costs:"ème haremette. Ses coûts d'évolutions sont",
    world:"Monde ",
    villain:" villain",
    fight_villain:"Combats un villain",
    you_own:"Tu possèdes",
    you_can_give:"Tu peux donner un total de",
    you_can_sell:"Tu peux tout vendre pour",
    Xp:"Xp",
    stat_points_need:"Nombre de points requis pour max",
    money_need:"Argent demandée pour max",
    money_spent:"Argent dépensé dans le Marché",
    bought_points:"Points achetés au Marché",
    equipment_points:"Points donnés par ton équipement",
    points_from_level:"Points donnés par ton niveau",
    quick_list:"Liste rapide"
};
texts.es = {
    navigate:"Navegar",
    current:"actual",
    locked:"bloqueado",
    unlock_it:"desbloquealo!",
    scene:"escena",
    harem:"Harén",
    bottom:"Fondo",
    or:"o",
    total:"Total",
    affection:"afecto",
    harem_stats:"Estatus del Harén",
    haremettes:"haremettes",
    hardcore:"Folladas",
    charm:"Encanto",
    know_how:"Saber-hacer",
    unlocked_scenes:"escenas desbloqueadas",
    money_incomes:"Ingreso de dinero",
    per_hour:"por hora",
    when_all_collectable:"cuando todo es coleccionable",
    required_to_unlock:"Requerido para desbloquear todas las escenas bloqueadas",
    my_stocks:"Mi Stock",
    top:"Tope",
    equipments:"equipamiento",
    boosters:"potenciadores",
    books:"libros",
    gifts:"regalos",
    currently_buyable:"Stocks Comprables Actualmente",
    visit_the:'Visita el <a href="../shop.html">Mercado</a> primero.',
    not_combatible:"Tu navegador no es compatible.",
    or_level:"o nivel",
    restock:"Restock",
    wiki:"wiki",
    she_is_your:"Ella es tu",
    evolution_costs:"ta haremette. Sus costo de evolucion son",
    world:"Mundo ",
    villain:" villano",
    fight_villain:"Pelear un villano",
    you_own:"Tienes",
    you_can_give:"Puedes dar un total de",
    you_can_sell:"Puedes vender todo por",
    Xp:"Xp",
    stat_points_need:"Puntos de estatus necesarios para maximo",
    money_need:"Dinero necesario para maximo",
    money_spent:"Dinero usado en el mercado",
    bought_points:"Puntos comprados del mercado",
    equipment_points:"Puntos de estatus de equipamiento",
    points_from_level:"Puntos de estatus de nivel",
    quick_list:"Lista Rapida"
};

texts.en = {
    navigate:"Navigate",
    current:"current",
    locked:"locked",
    unlock_it:"unlock it!",
    scene:"scene",
    harem:"Harem",
    bottom:"Bottom",
    or:"or",
    total:"Total",
    affection:"affection",
    harem_stats:"Harem Stats",
    haremettes:"guys",
    hardcore:"Hardcore",
    charm:"Charm",
    know_how:"Know-how",
    unlocked_scenes:"unlocked scenes",
    money_incomes:"Money incomes",
    per_hour:"per hour",
    when_all_collectable:"when all collectable",
    required_to_unlock:"Required to unlock all locked scenes",
    my_stocks:"My Stocks",
    top:"Top",
    equipments:"equipments",
    boosters:"boosters",
    books:"books",
    gifts:"gifts",
    currently_buyable:"Currently Buyable Stocks",
    visit_the:'Visit the <a href="../shop.html">Market</a> first.',
    not_combatible:"Your webbrowser is not compatible.",
    or_level:"or level",
    restock:"Restock",
    wiki:"'s wiki page",
    she_is_your:"he is your",
    evolution_costs:"th guy. His evolution costs are",
    world:"World ",
    villain:" villain",
    fight_villain:"Fight a villain",
    you_own:"You own",
    you_can_give:"You can give a total of",
    you_can_sell:"You can sell everything for",
    Xp:"Xp",
    stat_points_need:"Stat points need to max",
    money_need:"Money need to max",
    money_spent:"Money spent in market",
    bought_points:"Bought points from market",
    equipment_points:"Equipments stat points",
    points_from_level:"Stat points from level",
    quick_list:"Quick list"
};
texts.et = {
    navigate:"Navigeeri",
    current:"praegune",
    locked:"lukus",
    unlock_it:"ava!",
    scene:"stseen",
    harem:"Naase haaremisse",
    bottom:"Alla",
    or:"või",
    total:"Kokku",
    affection:"kiinduvust",
    harem_stats:"Haaremi näitajad",
    haremettes:"haaremi naist",
    hardcore:"Hardcore",
    charm:"Sarm",
    know_how:"Teadmisi",
    unlocked_scenes:"avatud stseene",
    money_incomes:"Sissetulek",
    per_hour:"tunnis",
    when_all_collectable:"kui kõik valmis",
    required_to_unlock:"Maksumus, et avada stseenid",
    my_stocks:"Minu laoseis",
    top:"Üles",
    equipments:"eset",
    boosters:"boonust",
    books:"raamatut",
    gifts:"kingitust",
    currently_buyable:"Praegu ostetavad",
    visit_the:'Külasta <a href="../shop.html">turgu</a> kõigepealt.',
    not_combatible:"Sinu brauser ei ühildu.",
    or_level:"või level",
    restock:"Lao uuendus",
    wiki:" wiki",
    she_is_your:"Ta on sinu",
    evolution_costs:" haaremi liige. Tema evolutsiooni maksumused",
    world:"Maailma",
    villain:"boss",
    fight_villain:"Võitle bossiga",
    you_own:"Sul on",
    you_can_give:"Sa saad lisada kokku",
    you_can_sell:"Sa saad müügiga teenida",
    Xp:"Xp",
    stat_points_need:"Oskuse punkte maksimumini",
    money_need:"Raha maksimumini",
    money_spent:"Raha kulunud oskuspunktidele",
    bought_points:"Ostetud oskuse punkte",
    equipment_points:"Esemete oskuse punktid",
    points_from_level:"Oskuse punkte levelist",
    quick_list:"Sorteeritud nimekiri"
};
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
    // Some pages don't carry the Hero data - skip the menu in this case by Hollo
    if (typeof Hero == 'undefined') {
        return;
    }
    // Trolls' database
    var Trolls = ['Dark Lord', 'Ninja Spy', 'Gruntt', 'Edward', 'Donatien', 'Silvanus', 'Bremen', 'Finalmecia'];

    // get current world of player
    var CurrentWorld = Hero.infos.questing.id_world - 1,
        TrollName = '',
        TrollsMenu = '';

    // generate troll list
    for (var i = 0; i < CurrentWorld; i++) {
        if (typeof Trolls[i] !== typeof undefined && Trolls[i] !== false) {
            TrollName = Trolls[i];
        } else TrollName = texts[lang].world + ' ' + (i+1) + ' ' + texts[lang].villain;
        TrollsMenu += '<a href="/battle.html?id_troll=' + (i+1) + '">' + TrollName + '</a><br />';
    }

    // display: 'Fight a troll' menu
    $('#contains_all > header').children('[type=energy_fight]').append('<div id="FightTroll">' + texts[lang].fight_villain + '<span class="Arrow"></span><div class="TrollsMenu">' + TrollsMenu + '</div></div>');
    fightTrollCss();
}


/* ==========
	 Market
   ========== */

function ModifyMarket() {
    var loc2 = $('.hero_stats').children();
    loc2.each(function() {
        var stat = $(this).attr("hero");
        if(stat == "carac1" || stat == "carac2" || stat == "carac3"){
            $(this).append('<span class="CustomStats"></span><div id="CustomStats' + stat +'" class="StatsTooltip"></div>');
        }
    });

    updateStats();

    function updateStats(){
        var loc2 = $('.hero_stats').children();
        var last_cost = 0,
            levelPoints = 0,
            levelMoney = 0,
            level = Hero.infos.level;
        if(level <=25)
            levelPoints = level *40;
        else
            levelPoints = 1000 + (level-25)*19;
        levelMoney = calculateTotalPrice(levelPoints);
        loc2.each(function() {
            var stat = $(this).attr("hero");
            $(".CustomStats").html('');
            if(stat == "carac1" || stat == "carac2" || stat == "carac3"){
                var currentStatPoints = Hero.infos[stat],
                    remainingPoints = levelPoints - currentStatPoints,
                    currentMoney = calculateTotalPrice(currentStatPoints),
                    remainingMoney = levelMoney - currentMoney,
                    skillPoints = Hero.infos.caracs[stat],
                    itemPoints = Hero.infos.items[stat],
                    boughtPoints = Hero.infos[stat];
                skillPoints = skillPoints - itemPoints - boughtPoints;


                $("#CustomStats" + stat).html(
                    "<b>" + texts[lang].stat_points_need + ":</b> " + NbCommas(remainingPoints) + "<br />" +
                    "<b>" + texts[lang].money_need + ": </b>" + NbCommas(remainingMoney) + "<br />" +
                    "<b>" + texts[lang].money_spent + ": </b>" + NbCommas(currentMoney) + "<br /><br />" +
                    "<b>" + texts[lang].bought_points + ": </b>" + NbCommas(boughtPoints) + "<br />" +
                    "<b>" + texts[lang].equipment_points + ": </b>" + NbCommas(itemPoints) + "<br />" +
                    "<b>" + texts[lang].points_from_level + ": </b>" + NbCommas(skillPoints) + "<br />"
                );
            }
        });
    }

    function calculateTotalPrice(points){
        var last_price = calculateStatPrice(points);
        if(points < 2001)
            price = (5+last_price)/2*(points);
        else if(points < 4001){
            price = 4012005+(4009+last_price)/2*(points-2001);
        }else if(points < 6001)
            price = 20026005+(12011+last_price)/2*(points-4001);
        else if(points < 8001)
            price = 56042005+(24013+last_price)/2*(points-6001);
        else if(points < 10001)
            price = 120060005+(40015+last_price)/2*(points-8001);
        return price;
    }

    function calculateStatPrice(points){
        var cost = 0;
        if(points < 2001)
            cost = 3 + points * 2;
        else if(points < 4001)
            cost = 4005+(points-2001)*4;
        else if(points < 6001)
            cost = 12005+(points-4001)*6;
        else if(points < 8001)
            cost = 24005+(points-6001)*8;
        else if(points < 10001)
            cost = 40005+(points-8001)*10;
        return cost;
    }


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

        var tooltip = texts[lang].you_own + ' <b>' + NbCommas(itemsNb) + '</b> ' + texts[lang][itemName] + '.<br />' +
            (itemsXp == -1 ? '' : texts[lang].you_can_give + ' <b>' + NbCommas(itemsXp) + '</b> ' + texts[lang][itemUnit] + '.<br />') +
            texts[lang].you_can_sell + ' <b>' + NbCommas(itemsSell) + '</b> <span class="imgMoney"></span>.';

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
    $('plus').on('click', function (event) {
        var stat = "carac" + $(this).attr("for_carac");
        Hero.infos[stat]++;
        timer = setTimeout( function() {
            updateStats();
        }, 400 );


    });
    marketCss();
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
    EvoReq.push({ affection: 15, money: 3150, kobans: 3 });
    EvoReq.push({ affection: 50, money: 6750, kobans: 6 });
    EvoReq.push({ affection: 150, money: 18000, kobans: 18 });
    EvoReq.push({ affection: 700, money: 135000, kobans: 90 });
    EvoReq.push({ affection: 1750, money: 968000, kobans: 300 });

    $('#harem_left').find('div[girl]').each( function(){
        i++;

        GirlId = $(this).attr('girl');
        GirlName = $(this).find('h4').text();
        IncCollect += parseInt($(this).find('.sal').text(), 10);
        HList.push({Id: GirlId, Order: i, Name: GirlName});

        $(this).attr('id', GirlName);
        if ($(this).hasClass('opened')) Anchor = GirlName;

        $(this).find('h4').append('<div class="HaremetteNb">' + i + '</div>');
    });
    var haremBottomGirl = GirlName;

    // auto-scroll to anchor
    location.hash = '#' + Anchor;

    // get haremettes stats & display wiki link
    i = 0;
    $('#harem_right').children('[girl]').each( function() {
        // display: wiki link
        $(this).append('<div class="WikiLink"><a href="https://harem-battle.club/wiki/Gay-Harem/GH:' + HList[i].Name + '" target="_blank"> ' + HList[i].Name + texts[lang].wiki + ' </a></div>');
        i++;

        var j = 0,
            Taffection = 0, // T= Total requirements (right tooltip)
            Tmoney = 0,
            Tkobans = 0,
            FirstLockedScene = 1,
            AffectionTT = texts[lang].she_is_your + ' <b>' + i + '</b>' + texts[lang].evolution_costs + ':<br />',
            girl_quests = $(this).find('.girl_quests');

        // get stats: specialty
        Spe = parseInt($(this).find('h3 > span').attr('carac'), 10) - 1;
        Specialty[Spe]++;

        // get stats: hourly income update by Hollo
        //IncHourly += parseInt($(this).find('.salary').text(), 10);
        var salaryStr = $(this).find('.salary').text().replace(/\s|,/g,"");
        IncHourly += parseInt(salaryStr, 10);

        girl_quests.find('g').each( function() {
            // prepare affection tooltip
            var Raffection = EvoReq[j].affection * i, // R= Required for this star (right tooltip)
                Rmoney = EvoReq[j].money * i,
                Rkobans = EvoReq[j].kobans * i;
            if(i>20){
                if(j==3){
                    Raffection = 14000;
                    Rmoney = 2700000;
                    Rkobans = 1800;
                } else if(j==4){
                    Raffection = 35000;
                    Rmoney = 19360000;
                    Rkobans = 6000;
                }
            }
            if(i>100){
                if(j==0){
                    Raffection = 1500;
                    Rmoney = 315000;
                    Rkobans = 300;
                } else if(j==1){
                    Raffection = 5000;
                    Rmoney = 675000;
                    Rkobans = 600;
                } else if(j==2){
                    Raffection = 15000;
                    Rmoney = 1800000;
                    Rkobans = 1800;
                }
            }
            if(hh_nutaku)
                Rkobans = Math.ceil(Rkobans/6);
            Taffection += Raffection;
            Tmoney += Rmoney;
            Tkobans += Rkobans;
            j++;
            AffectionTT += addPriceRow(j + '</b><span class="imgStar"></span>', Raffection, Rmoney, Rkobans);

            AvailableSc++;
            ScenesLink += (ScenesLink === '') ? 'hh_scenes=' : ',';
            var SceneHref = $(this).parent().attr('href');
            if ($(this).hasClass('grey') || $(this).hasClass('green')) {
                if (FirstLockedScene === 0) {
                    Saffection += Raffection;
                    ScenesLink += '0';
                } else {
                    FirstLockedScene = 0;
                    var XpLeft = girl_quests.parent().children('.girl_exp_left');
                    var isUpgradable = girl_quests.parent().children('.green_text_button');
                    Saffection += (XpLeft.length) ? parseInt(XpLeft.text().match(/^.+: (.*)$/)[1].replace(',',''), 10) : 0;
                    ScenesLink += (isUpgradable.length) ? '0.' + isUpgradable.attr('href').substr(7) : '0';
                }
                Smoney += Rmoney;
                Skobans += Rkobans;
            } else {
                UnlockedSc++;
                var attrHref = $(this).parent().attr('href');
                if (typeof attrHref != 'undefined') {
                    ScenesLink += attrHref.substr(7);
                }

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

        AffectionTT += addPriceRow(texts[lang].total, Taffection, Tmoney, Tkobans);

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
        QListString = '<div class="QListContent"><span class="Title">' + texts[lang].quick_list + ':</span>';
    for (i = 0; i < len; i++) {
        QListString += '<br /><a f="ql_girl" girl="' + HList[i].Id + '" href="#' + HList[i].Name + '">' + HList[i].Name + '</a> (#' + HList[i].Order + ')';
    }
    QListString += '</div>';

    // ### TAB: Stats ###

    // Market stocks
    try {
        var lsMarket = JSON.parse(localStorage.getItem('lsMarket')),
            d = new Date(lsMarket.restock.time);
        //		console.log(lsMarket);

        // buyable stocks
        if (new Date() > lsMarket.restock.time || Hero.infos.level > lsMarket.restock.herolvl) {
            var RestockInfo = '> The <a href="../shop.html">Market</a> restocked since your last visit.';
        } else {
            var	marketBookTxt = lsMarket.buyable.potion.Nb + ' ' + texts[lang].books + ' (' + NbCommas(lsMarket.buyable.potion.Xp) + ' Xp)',
                marketGiftTxt = lsMarket.buyable.gift.Nb + ' ' + texts[lang].gifts + ' (' + NbCommas(lsMarket.buyable.gift.Xp) + ' Aff)',
                RestockInfo = '- ' + marketBookTxt + ' = ' + NbCommas(lsMarket.buyable.potion.Value) + ' <img src="https://i.harem-battle.club/images/2017/01/07/0Gsvn.png">'
            + '<br />- ' + marketGiftTxt + ' = ' + NbCommas(lsMarket.buyable.gift.Value) + ' <img src="https://i.harem-battle.club/images/2017/01/07/0Gsvn.png">'
            + '<br /><font style="color:gray;">' + texts[lang].restock + ': ' + d.toLocaleString() + ' (' + texts[lang].or_level + ' ' + (Hero.infos.level+1) + ')</font>';
        }

        // my stocks
        var myArmorTxt = NbCommas(lsMarket.stocks.armor.Nb) + (lsMarket.stocks.armor.Nb > 99 ? '+ ' : ' ') + ' ' + texts[lang].equipments,
            myBoosterTxt = NbCommas(lsMarket.stocks.booster.Nb) + ' ' + texts[lang].boosters,
            myBookTxt = NbCommas(lsMarket.stocks.potion.Nb) + ' ' + texts[lang].books + ' (' + NbCommas(lsMarket.stocks.potion.Xp) + ' Xp)',
            myGiftTxt = NbCommas(lsMarket.stocks.gift.Nb) + ' ' + texts[lang].gifts + ' (' + NbCommas(lsMarket.stocks.gift.Xp) + ')',
            MarketStocks = '- ' + myArmorTxt + ', ' + myBoosterTxt
        + '<br />- ' + myBookTxt
        + '<br />- ' + myGiftTxt
        + '<span class="subTitle">' + texts[lang].currently_buyable + ':</span>'
        + RestockInfo;
    } catch(e) {
        var MarketStocks = (lsAvailable == 'yes') ? '> ' + texts[lang].visit_the : '> ' + texts[lang].not_combatible;
    }

    var StatsString = '<div class="StatsContent"><span class="Title">' + texts[lang].harem_stats + ':</span>' +
        '<span class="subTitle" style="margin-top:-10px;">' + i + ' ' + texts[lang].haremettes +':</span>' +
        '- ' + Specialty[0] + ' ' + texts[lang].hardcore + ', ' + Specialty[1] + ' ' + texts[lang].charm + ', ' + Specialty[2] + ' ' + texts[lang].know_how + ''
    + '<br />- ' + UnlockedSc + '/' + AvailableSc + ' ' + texts[lang].unlocked_scenes + ''
    + '<span class="subTitle">' + texts[lang].money_incomes + ':</span>'
    + '~' + NbCommas(IncHourly) + ' <img src="https://i.harem-battle.club/images/2017/01/07/0Gsvn.png"> ' + texts[lang].per_hour
    + '<br />' + NbCommas(IncCollect) + ' <img src="https://i.harem-battle.club/images/2017/01/07/0Gsvn.png"> ' + texts[lang].when_all_collectable
    + '<span class="subTitle">' + texts[lang].required_to_unlock + ':</span>'
    + addPriceRow('', Saffection, Smoney, Skobans)
    + '<span class="subTitle">' + texts[lang].my_stocks + ':</span>'
    + MarketStocks
    + '</div>';

    // add custom bar buttons/links & quick list div & stats div
    $('#harem_left').append('<div id="CustomBar">'
                            + '<img f="list" src="https://i.harem-battle.club/images/2017/09/10/FRW.png">'
                            + '<img f="stats" src="https://i.harem-battle.club/images/2017/09/11/FRh.png">'
                            + '<div class="TopBottomLinks"><a href="#Bunny">' + texts[lang].top + '</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#' + haremBottomGirl + '">' + texts[lang].bottom + '</a></div>'
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

    haremCss();

    function addPriceRow(rowName, affection, money, kobans){
        return '<b>' + rowName + ':</b> ' +
            NbCommas(affection) + ' ' + texts[lang].affection +  '(' + NbCommas(affection*417) + ' <span class="imgMoney"></span>), '+
            NbCommas(money) + ' <span class="imgMoney"></span> ' + texts[lang].or + ' '+
            NbCommas(kobans) + ' <span class="imgKobans"></span><br />';
    }

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
        var ScenesNavigate = '<div class="Scenes" style="display:block;">' + texts[lang].navigate + ':<br/>',
            SceneLink = '';

        for (var i = 0; i < len; i++ ) {
            // string format certification
            if (/^(0\.)?[0-9]{1,5}$/.test(hh_scenes[i]) === true) {
                if (hh_scenes[i] == currentScene) {
                    SceneLink = '<span class="current">' + texts[lang].current + '</span>';
                } else if (hh_scenes[i] == '0') {
                    SceneLink = '<span class="locked">' + texts[lang].locked + '</span>';
                } else if (parseInt(hh_scenes[i], 10) < 1) {
                    SceneLink = '<a href="/quest/' + hh_scenes[i].substr(2) + '">' + texts[lang].unlock_it + '!</a>';
                } else {
                    SceneLink = '<a href="/quest/' + hh_scenes[i] + '?hh_scenes=' + hh_scenesParams + '">' + texts[lang].scene + '</a>';
                }
                ScenesNavigate += (i+1) + '<span class="imgStar"></span> ' + SceneLink + '<br />';
            }
            // string error: doesn't match (human manipulation)
            else return false;
        }
        ScenesNavigate += '<span class="backToHarem">< <a href="' + $('#breadcrumbs').children('a').eq(2).attr('href') + '">' + texts[lang].harem + '</a></span></div>';

        // insert navigate interface
        $('#controls').append(ScenesNavigate);
    }

    scenesCss();
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

function fightTrollCss(){
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
                     + 'background-image: url("https://i.harem-battle.club/images/2017/09/19/Fmo.png");'
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

function marketCss(){
    // -----------------
    //     CSS RULES
    // -----------------

    sheet.insertRule('#inventory .CustomTT {'
                     + 'float: right;'
                     + 'margin: 11px 1px 0 0;'
                     + 'background-image: url("https://i.harem-battle.club/images/2017/09/13/FPE.png");'
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
                     + 'background-image: url("https://i.harem-battle.club/images/2017/01/07/0Gsvn.png");'
                     + 'display: inline-block; }');
    sheet.insertRule('.hero_stats .CustomStats:hover {'
                     + 'cursor: help; }');
    sheet.insertRule('.hero_stats .CustomStats {'
                     + 'float: right;'
                     + 'margin-left: -25px;'
                     + 'background-image: url("https://i.harem-battle.club/images/2017/09/13/FPE.png");'
                     + 'background-size: 18px 18px;'
                     + 'background-position: center;'
                     + 'background-repeat: no-repeat;'
                     + 'width: 18px;'
                     + 'height: 100%;'
                     + 'visibility: none; }');
    sheet.insertRule('.hero_stats .CustomStats:hover + div {' +
                     'opacity: 1;' +
                     'visibility: visible; }');

    sheet.insertRule('.hero_stats .StatsTooltip {'
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

    sheet.insertRule('.hero_stats .StatsTooltip b {'
                     + 'font-weight: bold; }');
}

function haremCss(){
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
                     + 'background-image: url("https://i.harem-battle.club/images/2017/09/13/FPE.png");'
                     + 'background-size: 18px 18px;'
                     + 'width: 18px;'
                     + 'height: 18px;'
                     + 'visibility: none; }');

    sheet.insertRule('#harem_right .CustomTT:hover {'
                     + 'cursor: help; }');

    sheet.insertRule('#harem_right .CustomTT:hover + div {'
                     + 'opacity: 1;'
                     + 'visibility: visible; }');

    sheet.insertRule('#harem_right .AffectionTooltip {'
                     + 'position: absolute;'
                     + 'z-index: 99;'
                     + 'margin: -130px 0 0 -28px;'
                     + 'width: 320px;'
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

    sheet.insertRule('#harem_right .imgStar, #harem_right .imgMoney, #harem_right .imgKobans, #harem_left .imgStar, #harem_left .imgMoney, #harem_left .imgKobans  {'
                     + 'background-size: 10px 10px;'
                     + 'background-repeat: no-repeat;'
                     + 'width: 10px;'
                     + 'height: 14px;'
                     + 'display: inline-block; }');

    sheet.insertRule('#harem_right .imgStar, #harem_left .imgStar {'
                     + 'background-image: url("https://i.harem-battle.club/images/2016/12/29/R9HWCKEtD.png"); }');

    sheet.insertRule('#harem_right .imgMoney, #harem_left .imgMoney {'
                     + 'background-image: url("https://i.harem-battle.club/images/2017/01/07/0Gsvn.png"); }');

    sheet.insertRule('#harem_right .imgKobans, #harem_left .imgKobans {'
                     + 'background-image: url("https://i.harem-battle.club/images/2016/08/30/gNUo3XdY.png"); }');
}

function scenesCss(){
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

    sheet.insertRule('#controls .Scenes a:hover {' +
                     'color: rgb(254, 202, 255);' +
                     'text-decoration: underline; }');

    sheet.insertRule('#controls .backToHarem {'
                     + 'position: absolute;'
                     + 'bottom: 0;'
                     + 'left: 0;'
                     + 'width: 100%; }');

    sheet.insertRule('#controls .imgStar {'
                     + 'background-image: url("https://i.harem-battle.club/images/2016/12/29/R9HWCKEtD.png");'
                     + 'background-size: 10px 10px;'
                     + 'background-repeat: no-repeat;'
                     + 'width: 10px;'
                     + 'height: 18px;'
                     + 'display: inline-block; }');
}