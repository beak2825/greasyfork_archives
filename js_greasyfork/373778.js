// ==UserScript==
// @name			HH_mini
// @namespace		haremheroes.com
// @description		Adding things here and there in the Hentai Heroes game.
// @version			1.54
// @match			https://www.hentaiheroes.com/*
// @match			https://nutaku.haremheroes.com/*
// @match			https://www.nutaku.net/games/harem-heroes/play/*
// @match			https://eroges.hentaiheroes.com/*
// @match			https://thrix.hentaiheroes.com/*
// @match			https://www.gayharem.com/*
// @match			https://nutaku.gayharem.com/*
// @match			https://test.hentaiheroes.com/*
// @run-at			document-end
// @grant			none
// @author			Raphael, 1121, Sluimerstand, shal
// @downloadURL https://update.greasyfork.org/scripts/373778/HH_mini.user.js
// @updateURL https://update.greasyfork.org/scripts/373778/HH_mini.meta.js
// ==/UserScript==

/*	===========
	 CHANGELOG
	=========== */

// 0.12.4: Fixed display of villains menu after server-side code changes 2020/11/25.
// 0.12.3: Support for Pandora Witch tier 2 / 3 girls.
// 0.12.2: Added support for German language. Cleaned up some old unused text strings in all languages.
// 0.12.1: Fixed recognition of villain event girl presence (again) after server-side code changes 2020/08/19.
// 0.12.0: Support for new world 14 villain Nike and her tier 1 girls.
// 0.11.9: Changed exponentiation operator from ** to Math.pow() after reports of it breaking on (very) old browsers.
// 0.11.8: Added support for Italian language (translation courtesy of Godius). Options menu now available in French (Tom208) and Spanish (Marcezeq), completing these localizations.
// 0.11.7: Minor changes to rounding logic for money and battle excitement displays.
// 0.11.6: Fixed an issue with non-promotion points targets in league information when league brackets have 115+ players.
// 0.11.5: Support for Karole tier 2 / 3 and Jackson's Crew tier 3 girls.
// 0.11.4: Cleaned up and improved calculations for demotion and non-promotion points targets in league information. (Additional es/fr info texts contributed by Marcezeq and Tom208.)
// 0.11.3: Fixed some number display issues in harem and league information when the game is played in languages other than English. (With thanks to Tom208.)
// 0.11.2: Support for Finalmecia and Roko Senseï tier 3 girls.
// 0.11.1: Replaced image links on imgur with Postimage after files were removed. Minor changes to affection tooltip display in harem.
// 0.11.0: Re-added support for automatic script updating.
// 0.10.9: Fixed recognition of villain event girl presence after server-side code changes 2020/05/14.
// 0.10.8: Extended villain menu to show which tiers still have world girls to get; can be toggled in options menu. (Note: Will require script update when new tier girls are released.)
// 0.10.7: Fixed market stats cost formulas; cost is now 7 rather than 5 for first stat purchase, 1999 increases from first to second price level rather than 2000.
// 0.10.6: Tweaked league sim to account for recently buffed charm proc, changed how procs are included in the sim, fixed omega girl effects, and generally cleaned up sim code.
// 0.10.5: Moved the market stats tooltip buttons from right to left to account for Kinkoid's new multi-buy button. Tweaked tooltip texts and display.
// 0.10.4: Added name of World 13 villain. Added localized villain names in fr/es language versions. Minor text tweaks in en version.
// 0.10.3: Now supporting girl XP level calculations up to new level 500 cap (with thanks to piturda for the reminder).
// 0.10.2: Incorporated piturda's Market fix (for server-side change 16/10/19) and Champion update. Added display of Club bonuses and Ginseng boosters to Market stats. Lots and lots of code clean-up.
// 0.10.1: Fixed calculation of demotion and non-promotion points >1000 and remaining tokens in League info. Disabled display of highest obtainable League reward. Some League info code clean-up.
// 0.10.0: Updated and expanded stats formula to reflect Patch of 14/08/19. (Contributed by Hare.)
// 0.9.9: Fixed a bug in the Champions information caused by server-side changes to the code. (Last update by Sluimerstand.)
// 0.9.8: Added Champions information (credit: Entwine). Fixed no longer working icons.
// 0.9.7: Fixed League rewards calculating badly when it involves usernames with spaces. Fixed League rewards at 0 challenges left.
// 0.9.6: Changed money abbreviations from K,M,G,T to K,M,B,T. Player values in Leagues are now exact. Sim result is orange if it's a close call.
// 0.9.5: Fixed an issue for the Villain menu when the localStorage does not exist yet or anymore.
// 0.9.4: Fixed a rare error in which the script would crash for trying to pull non-existent numbers to add thousand spacing to.
// 0.9.3: Fixed League rewards not properly calculating for point values higher than 999.
// 0.9.2: Added an options menu. Removed modifyScenes. Tweaked sim refresh. Tweaked League info. Tweaked better XP and money. Tweaked harem info.
// 0.9.1: Fixed sims not refreshing anymore because I wanted to wrap up the previous version so I could watch the new Game of Thrones.
// 0.9.0: Expanded on the extra League info. Added some missing translations for Spanish.
// 0.8.9: Fixed player beta/omega stats not calculating properly for girls with spëcìál characters in their names. I'm a professional, I swear.
// 0.8.8: Added Jackson's Crew villain name. Fixed Charm and Know-How defence in sim results. Added extra League info.
// 0.8.7: Fixed Charm proc not occurring in sim results. Fixed Know-How proc not calculating correctly. Added opponent name in the console logs.
// 0.8.6: Fixed wrong class defence stats for beta/omega girls. Fixed new line creation for wide sim results.
// 0.8.5: Fixed wrong class Harmony procs for League sims.
// 0.8.4: More tweaks to League sims.
// 0.8.3: Fixed excitement for League sims (formerly known as match rating formerly known as power levels).
// 0.8.2: Fixed an oopsie I made when calculating worst-case scenario. Console log (F12) is now also available.
// 0.8.1: Fixed League numbers for French and Spanish localisations. Changed League ratings to show a worst-case scenario.
// 0.8.0: Fixed the event villains issue.
// 0.7.9: Properly fixed the button displacement. Match rating is now even more accurate.
// 0.7.8: Fixed the collect all button displacement. Fixed Excitement stat in Leagues. Match rating is now more accurate.
// 0.7.7: Replaced the League power levels with a match rating.
// 0.7.6: Added better XP and better money.
// 0.7.5: Added the @downloadURL, so the script can be updated directly from Tampermonkey.
// 0.7.4: Removed the added mission and arena timers and the extra quest button. Added an auto refresh for the home screen.
// 0.7.3: Cleaned up the code and prepared the file for "public launch." Added power levels to Leagues.
// 0.7.2: Updated the harem info pane to be more pleasing to the eyes.

/* =========
	GENERAL
   ========= */

// Define jQuery
var $ = window.jQuery;

// Define CSS
var sheet = (function() {
	var style = document.createElement('style');
	document.head.appendChild(style);
	return style.sheet;
})();

// Numbers: thousand spacing
function nThousand(x) {
	if (typeof x != 'number') {
		x = 0;
	}
	return x.toLocaleString();
}

// Numbers: rounding to K, M, G and T
function nRounding(num, digits, updown) {
	var power = [
		{ value: 1, symbol: '' },
		{ value: 1E3, symbol: 'K' },
		{ value: 1E6, symbol: 'M' },
		{ value: 1E9, symbol: 'B' },
		{ value: 1E12, symbol: 'T' },
	];
	var i;
	for (i = power.length - 1; i > 0; i--) {
		if (num >= power[i].value) {
			break;
		}
	}
	if (updown == 1) {
		return (Math.ceil(num / power[i].value * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits) + power[i].symbol;
	}
	else if (updown == 0) {
		return (Math.round(num / power[i].value * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits) + power[i].symbol;
	}
	else if (updown == -1) {
		return (Math.floor(num / power[i].value * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits) + power[i].symbol;
	}
}

/* ==============
	TRANSLATIONS
   ============== */

var lang = 'en';

if ($('html')[0].lang === 'en') {
	lang = 'en';
}
else if ($('html')[0].lang === 'fr') {
	lang = 'fr';
}
else if ($('html')[0].lang === 'es_ES') {
	lang = 'es';
}
else if ($('html')[0].lang === 'it_IT') {
	lang = 'it';
}
else if ($('html')[0].lang === 'de_DE') {
	lang = 'de';
}

var texts = [];

texts.en = {
	optionsRefresh: 'Home screen refresh',
	optionsVillain: 'Fight a villain menu',
	optionsTiers: 'Show tiers with girls',
	optionsXP: 'Better XP',
	optionsMoney: 'Better money',
	optionsMarket: 'Market information',
	optionsHarem: 'Harem information',
	optionsLeague: 'League information',
	optionsSim: 'League sim',
	optionsChampions: 'Champions information',
	and: 'and',
	or: 'or',
	affection: 'affection',
	harem_stats: 'Harem Stats',
	haremettes: 'haremettes',
	hardcore: 'Hardcore',
	charm: 'Charm',
	know_how: 'Know-how',
	harem_level: 'harem level',
	to_go: 'to go',
	unlocked_scenes: 'scenes unlocked',
	money_income: 'Money income',
	per_hour: 'per hour',
	when_all_collectable: 'when all collectable',
	required_to_unlock: 'Required to upgrade all haremettes',
	required_to_get_max_level: 'Required to level all haremettes',
	my_stocks: 'My stock',
	equipments: 'equipments',
	boosters: 'boosters',
	books: 'books',
	gifts: 'gifts',
	currently_buyable: 'Currently buyable stock',
	visit_the: 'Visit the <a href="../shop.html">Market</a> first.',
	not_compatible: 'Your webbrowser is not compatible.',
	or_level: 'or level',
	restock: 'Restock',
	wiki: '\'s wiki page',
	evolution_costs: 'Upgrade costs are',
	world: 'World ',
	villain: ' villain',
	fight_villain: 'Fight a villain',
	you_own: 'You own',
	you_can_give: 'You can give a total of',
	you_can_sell: 'You can sell everything for',
	stat_points_need: 'Stat points buyable to max',
	money_need: 'Money required to max',
	money_spent: 'Money spent in market',
	points_from_level: 'Level-based stat points',
	bought_points: 'Market-bought stat points',
	equipment_points: 'Equipments stat points',
	ginseng_points: 'Boosters stat points',
	club_points: 'Club bonus stat points',
	Xp: 'XP',
	starting: 'Starting',
	common: 'Common',
	rare: 'Rare',
	epic: 'Epic',
	legendary: 'Legendary',
	day: 'd',
	hour: 'h',
	minute: 'm',
	demote_up: 'To <u>demote</u> you can have a maximum of ',
	demote_down: 'To <u>demote</u> you must be passed by players with as few as ',
	demote_holdzero: 'To <u>demote</u> you must remain at ',
	stagnate_up: 'To <u>not promote</u> you can have a maximum of ',
	stagnate_down: 'To <u>not promote</u> you must be passed by players with as few as ',
	stagnate_holdzero: 'To <u>not promote</u> you must remain at ',
	points: 'points',
	challenges_regen: 'Natural regeneration: ',
	challenges_left: '<br />Challenges left: '
};

texts.fr = {
	optionsRefresh: 'Rafraîchir page d\'accueil',
	optionsVillain: 'Menu combats un troll',
	optionsTiers: 'Montrer les paliers avec les filles',
	optionsXP: 'XP + précise',
	optionsMoney: 'Argent + précis',
	optionsMarket: 'Infos marché',
	optionsHarem: 'Infos harem',
	optionsLeague: 'Infos ligue',
	optionsSim: 'Simu ligue',
	optionsChampions: 'Infos des champions',
	and: 'et',
	or: 'ou',
	affection: 'affection',
	harem_stats: 'Stats du harem',
	haremettes: 'haremettes',
	hardcore: 'Hardcore',
	charm: 'Charme',
	know_how: 'Savoir-faire',
	harem_level: 'niveau de harem',
	to_go: 'restant',
	unlocked_scenes: 'scènes débloquées',
	money_income: 'Revenus',
	per_hour: 'par heure',
	when_all_collectable: 'quand tout est disponible',
	required_to_unlock: 'Requis pour débloquer la scène',
	required_to_get_max_level: 'Requis pour obtenir toutes les filles au niveau maximum',
	my_stocks: 'Mes stocks',
	equipments: 'équipements',
	boosters: 'boosters',
	books: 'livres',
	gifts: 'cadeaux',
	currently_buyable: 'Stock disponible au marché',
	visit_the: 'Visite le <a href="../shop.html">marché</a> first.',
	not_compatible: 'Votre navigateur n\'est pas compatible.',
	or_level: 'ou niveau',
	restock: 'Restock',
	wiki: 'Page wiki de ',
	evolution_costs: 'Ses couts d\'évolution sont',
	world: 'Monde ',
	villain: ' troll',
	fight_villain: 'Combats un troll',
	you_own: 'Tu possèdes',
	you_can_give: 'Tu peux donner un total de',
	you_can_sell: 'Tu peux tout vendre pour',
	stat_points_need: 'Nombre de points requis pour max',
	money_need: 'Argent demandé pour max',
	money_spent: 'Argent dépensé dans le marché',
	points_from_level: 'Points donnés par ton niveau',
	bought_points: 'Points achetés au marché',
	equipment_points: 'Points donnés par ton équipement',
	ginseng_points: 'Points donnés par tes boosters',
	club_points: 'Points donnés par ton club',
	Xp: 'XP',
	starting: 'Fille de départ',
	common: 'Commun',
	rare: 'Rare',
	epic: 'Épique',
	legendary: 'Légendaire',
	day: 'j',
	hour: 'h',
	minute: 'm',
	demote_up: 'Pour <u>être rétrogradé</u> vous pouvez avoir un maximum de ',
	demote_down: 'Pour <u>être rétrogradé</u> vous devez être dépassé par les joueurs qui ont ',
	demote_holdzero: 'Pour <u>être rétrogradé</u> vous devez rester avec ',
	stagnate_up: 'Pour <u>ne pas être promu</u> vous pouvez avoir un maximum de ',
	stagnate_down: 'Pour <u>ne pas être promu</u> vous devez être dépassé par les joueurs qui ont ',
	stagnate_holdzero: 'Pour <u>ne pas être promu</u> vous devez rester avec ',
	points: 'points',
	challenges_regen: 'Régénération naturelle: ',
	challenges_left: '<br />Défis restants: '
};

texts.es = {
	optionsRefresh: 'Actualizacion Menu principal',
	optionsVillain: 'Menu Pelear contra villano',
	optionsTiers: 'Mostrar Rangos con Chicas',
	optionsXP: 'Mejor XP',
	optionsMoney: 'Mejor Dinero',
	optionsMarket: 'Informacion de Mercado',
	optionsHarem: 'Informacion de Harén',
	optionsLeague: 'Informacion de Liga',
	optionsSim: 'Simulacion de Liga',
	optionsChampions: 'Informacion de Campeones',
	and: 'y',
	or: 'o',
	affection: 'afecto',
	harem_stats: 'Estatus del Harén',
	haremettes: 'haremettes',
	hardcore: 'Folladas',
	charm: 'Encanto',
	know_how: 'Saber-hacer',
	harem_level: 'nivel de harén',
	to_go: 'restante',
	unlocked_scenes: 'escenas desbloqueadas',
	money_income: 'Ingreso de dinero',
	per_hour: 'por hora',
	when_all_collectable: 'cuando todo es coleccionable',
	required_to_unlock: 'Requerido para desbloquear todas las escenas bloqueadas',
	required_to_get_max_level: 'Requerido para obtener el máximo nivel de todas las chicas',
	my_stocks: 'Mi Stock',
	equipments: 'equipamiento',
	boosters: 'potenciadores',
	books: 'libros',
	gifts: 'regalos',
	currently_buyable: 'Stocks Comprables Actualmente',
	visit_the: 'Visita el <a href="../shop.html">Mercado</a> primero.',
	not_compatible: 'Tu navegador no es compatible.',
	or_level: 'o nivel',
	restock: 'Restock',
	wiki: ' wiki',
	evolution_costs: 'Sus costo de evolucion son',
	world: 'Mundo ',
	villain: ' villano',
	fight_villain: 'Pelear un villano',
	you_own: 'Tienes',
	you_can_give: 'Puedes dar un total de',
	you_can_sell: 'Puedes vender todo por',
	stat_points_need: 'Puntos de estatus necesarios para maximo',
	money_need: 'Dinero necesario para maximo',
	money_spent: 'Dinero usado en el mercado',
	points_from_level: 'Puntos de estatus de nivel',
	bought_points: 'Puntos comprados del mercado',
	equipment_points: 'Puntos de estatus de equipamiento',
	ginseng_points: 'Puntos de estatus de los potenciadores',
	club_points: 'Puntos de estatus del club',
	Xp: 'XP',
	starting: 'Principiante',
	common: 'Común',
	rare: 'Raro',
	epic: 'Épico',
	legendary: 'Legendario',
	day: 'd',
	hour: 'h',
	minute: 'm',
	demote_up: 'Para <u>degradar</u> puedes tener un máximo de ',
	demote_down: 'Para <u>degradar</u> debes ser superado por jugadores con tan solo ',
	demote_holdzero: 'Para <u>degradar</u> debes mantenerte en ',
	stagnate_up: 'Para <u>no promocionar</u> puedes tener un máximo de ',
	stagnate_down: 'Para <u>no promocionar</u> debes ser superado por jugadores con tan solo ',
	stagnate_holdzero: 'Para <u>no promocionar</u> debes mantenerte en ',
	points: 'puntos',
	challenges_regen: 'Regeneracion naturel: ',
	challenges_left: '<br />Retos pendientes: '
};

texts.it = {
	optionsRefresh: 'Refresh pagina Home',
	optionsVillain: 'Menù battaglia Troll',
	optionsTiers: 'Mostra battaglie con ragazze',
	optionsXP: 'Mostra XP mancante al lvl successivo',
	optionsMoney: 'Migliora soldi',
	optionsMarket: 'Informazioni negozio',
	optionsHarem: 'Informazioni Harem',
	optionsLeague: 'Informazioni sulle Leghe',
	optionsSim: 'Simulazione Leghe',
	optionsChampions: 'Informazioni sui Campioni',
	and: 'e',
	or: 'o',
	affection: 'affetto',
	harem_stats: 'Stato dell Harem',
	haremettes: 'ragazze dell harem',
	hardcore: 'Scopata',
	charm: 'Amante',
	know_how: 'Esperto',
	harem_level: 'livello harem',
	to_go: 'mancanti',
	unlocked_scenes: 'scene sbloccate',
	money_income: 'Guadagni',
	per_hour: 'orario',
	when_all_collectable: 'quando si può raccogliere tutto',
	required_to_unlock: 'Necessario per sbloccare tutte le scene',
	required_to_get_max_level: 'Necessario per livellare tutte le ragazze',
	my_stocks: 'Mio inventario',
	equipments: 'equipaggiamento',
	boosters: 'potenziamenti',
	books: 'libri',
	gifts: 'regali',
	currently_buyable: 'Correntemente acquistabili',
	visit_the: 'Visita il <a href="../shop.html">negozio</a> prima.',
	not_compatible: 'Il tuo browser non è compatibile.',
	or_level: 'o livello',
	restock: 'Rifornimento',
	wiki: ' -> wiki',
	evolution_costs: 'Il costo del potenziamento è',
	world: 'Mondo ',
	villain: ' nemico',
	fight_villain: 'Combattimenti',
	you_own: 'Possiedi',
	you_can_give: 'Puoi dare il massimo a',
	you_can_sell: 'Puoi vendere tutto per',
	stat_points_need: 'Punti statistica necessari per il massimo',
	money_need: 'Soldi necessari per il massimo',
	money_spent: 'Soldi spesi al negozio',
	points_from_level: 'Punti acquisiti da aumento livello',
	bought_points: 'Punti comprati al negozio',
	equipment_points: 'Punti statistica da equipaggiamento',
	ginseng_points: 'Punti statistica dei potenziamenti',
	club_points: 'Punti statistica bonus del Club',
	Xp: 'XP',
	starting: 'Starter',
	common: 'Comuni',
	rare: 'Rare',
	epic: 'Epiche',
	legendary: 'Leggendarie',
	day: 'g',
	hour: 'h',
	minute: 'm',
	demote_up: 'Per <u>il degrado</u> devi avere al massimo ',
	demote_down: 'Per <u>il degrado</u> devi essere sorpassato da giocatori con ',
	demote_holdzero: 'Per <u>il degrado</u> devi rimanere a ',
	stagnate_up: 'Per <u>restare</u> devi avere al massimo ',
	stagnate_down: 'Per <u>restare</u> devi essere sorpassato da giocatori con ',
	stagnate_holdzero: 'Per <u>restare</u> devi rimanere a ',
	points: 'punti',
	challenges_regen: 'Rigenerazione naturale: ',
	challenges_left: '<br />Combattimenti mancanti: '
};

texts.de = {
optionsRefresh: 'Homepage aktualisieren',
optionsVillain: 'Widersacher-Menü',
optionsTiers: 'Stufen mit Girls anzeigen',
optionsXP: 'Verbesserte XP-Anzeige',
optionsMoney: 'Verbesserte Geld-Anzeige',
optionsMarket: 'Marktplatz-Informationen',
optionsHarem: 'Harem-Informationen',
optionsLeague: 'Liga-Informationen',
optionsSim: 'Liga-Simulation',
optionsChampions: 'Champion-Informationen',
and: 'und',
or: 'oder',
affection: 'Zuneigung',
harem_stats: 'Harem-Statistiken',
haremettes: 'Harem-Mädchen',
hardcore: 'Hardcore',
charm: 'Charme',
know_how: 'Wissen',
harem_level: 'Harem-Level',
to_go: 'übrig',
unlocked_scenes: 'Szenen freigeschaltet',
money_income: 'Einkommen',
per_hour: 'pro Stunde',
when_all_collectable: 'wenn komplett einsammelbar',
required_to_unlock: 'Erforderlich für alle Mädchen-Upgrades',
required_to_get_max_level: 'Erforderlich für maximale Mädchen-Level',
my_stocks: 'Meine Bestände',
equipments: 'Ausrüstungen',
boosters: 'Booster',
books: 'Bücher',
gifts: 'Geschenke',
currently_buyable: 'Aktuelle Bestände am Marktplatz',
visit_the: 'Besuche zuerst den <a href="../shop.html">Marktplatz</a>.',
not_compatible: 'Dein Browser ist nicht kompatibel.',
or_level: 'oder Level',
restock: 'neue Angebote',
wiki: '-Wikiseite',
evolution_costs: 'Die Upgradekosten betragen',
world: 'Welt ',
villain: ' Widersacher',
fight_villain: 'Widersacher',
you_own: 'Du besitzt',
you_can_give: 'Insgesamt verteilbar:',
you_can_sell: 'Du kannst alles verkaufen für',
stat_points_need: 'bis Maximum käufliche Statpunkte',
money_need: 'zum Maximieren nötiges Geld',
money_spent: 'bisher ausgegebenes Geld',
points_from_level: 'Statpunkte durch Heldenlevel',
bought_points: 'Statpunkte durch Markt-Käufe',
equipment_points: 'Statpunkte durch Ausrüstungen',
ginseng_points: 'Statpunkte durch Booster',
club_points: 'Statpunkte durch Club-Boni',
Xp: 'XP',
starting: 'Starting',
common: 'Common',
rare: 'Rare',
epic: 'Epic',
legendary: 'Legendary',
day: 'd',
hour: 'h',
minute: 'm',
demote_up: 'Für den <u>Abstieg</u> maximal möglich: ',
demote_down: 'Für den <u>Abstieg</u> musst du überholt werden von Spielern mit höchstens ',
demote_holdzero: 'Für den <u>Abstieg</u> musst du verbleiben bei ',
stagnate_up: 'Für den <u>Nichtaufstieg</u> maximal möglich: ',
stagnate_down: 'Für den <u>Nichtaufstieg</u> musst du überholt werden von Spielern mit höchstens ',
stagnate_holdzero: 'Für den <u>Nichtaufstieg</u> musst du verbleiben bei ',
points: 'Punkte',
challenges_regen: 'Natürliche Regeneration: ',
challenges_left: '<br />verbleibende Kämpfe: '
};

var tierGirlsID = [
	['8', '9', '10', '7270263', '979916751'],
	['14', '13', '12', '318292466', '936580004'],
	['19', '16', '18', '610468472', '54950499'],
	['29', '28', '26', '4749652', '345655744'],
	['39', '40', '41', '267784162', '763020698'],
	['64', '63', '31', '406004250', '864899873'],
	['85', '86', '84', '267120960', '536361248'],
	['114', '115', '116', '379441499', '447396000'],
	['1247315', '4649579', '7968301', '46227677', '933487713'],
	['1379661', '4479579', '1800186', '985085118', '339765042'],
	['24316446', '219651566', '501847856', '383709663', '90685795'],
	['225365882', '478693885', '231765083', '155415482', '769649470'],
	['86962133', '243793871', '284483399', 0, 0]
];

/* ==================
	WHEN TO RUN WHAT
   ================== */

var currentPage = window.location.pathname;
if (currentPage.indexOf('home') != -1) options();

// Show which modules are enabled and if so, run them when appropriate
if (localStorage.getItem('HHS.refresh') === '1') {
	$('#hhsRefresh').attr('checked', 'checked');
	if (currentPage.indexOf('home') != -1) {
		moduleRefresh();
	}
}
if (localStorage.getItem('HHS.villain') === '1') {
	$('#hhsVillain').attr('checked', 'checked');
	moduleVillain();
}
if (localStorage.getItem('HHS.tiers') === '1') {
	$('#hhsTiers').attr('checked', 'checked');
}
if (localStorage.getItem('HHS.xp') === '1') {
	$('#hhsXP').attr('checked', 'checked');
	moduleXP();
}
if (localStorage.getItem('HHS.money') === '1') {
	$('#hhsMoney').attr('checked', 'checked');
	moduleMoney();
}
if (localStorage.getItem('HHS.market') === '1') {
	$('#hhsMarket').attr('checked', 'checked');
	if (currentPage.indexOf('shop') != -1) {
		moduleMarket();
	}
}
if (localStorage.getItem('HHS.harem') === '1') {
	$('#hhsHarem').attr('checked', 'checked');
	if (currentPage.indexOf('harem') != -1) {
		moduleHarem();
	}
}
if (localStorage.getItem('HHS.league') === '1') {
	$('#hhsLeague').attr('checked', 'checked');
	if (currentPage.indexOf('tower-of-fame') != -1) {
		moduleLeague();
	}
}
if (localStorage.getItem('HHS.sim') === '1') {
	$('#hhsSim').attr('checked', 'checked');
	if (currentPage.indexOf('tower-of-fame') != -1) {
		moduleSim();
	}
}
if (localStorage.getItem('HHS.champions') === '1') {
	$('#hhsChampions').attr('checked', 'checked');
	moduleChampions();
}

/* =========
	OPTIONS
   ========= */

function options() {
	// Create localStorage if it doesn't exist yet
	if (localStorage.getItem('HHS.refresh') === null) {
		localStorage.setItem('HHS.refresh', '1');
	}
	if (localStorage.getItem('HHS.villain') === null) {
		localStorage.setItem('HHS.villain', '1');
	}
	if (localStorage.getItem('HHS.tiers') === null) {
		localStorage.setItem('HHS.tiers', '1');
	}
	if (localStorage.getItem('HHS.xp') === null) {
		localStorage.setItem('HHS.xp', '1');
	}
	if (localStorage.getItem('HHS.money') === null) {
		localStorage.setItem('HHS.money', '1');
	}
	if (localStorage.getItem('HHS.market') === null) {
		localStorage.setItem('HHS.market', '1');
	}
	if (localStorage.getItem('HHS.harem') === null) {
		localStorage.setItem('HHS.harem', '1');
	}
	if (localStorage.getItem('HHS.league') === null) {
		localStorage.setItem('HHS.league', '1');
	}
	if (localStorage.getItem('HHS.sim') === null) {
		localStorage.setItem('HHS.sim', '1');
	}
	if (localStorage.getItem('HHS.champions') === null) {
		localStorage.setItem('HHS.champions', '1');
	}

	// Options menu
	$('div#contains_all').append('<a href="#"><img src="https://i.postimg.cc/c1F37PYz/icon-options.png" id="hhsButton"></a>');
	$('div#contains_all').append('<div id="hhsOptions" class="hhsTooltip" style="display: none;">'
		+ '<label class="switch"><input type="checkbox" id="hhsRefresh"><span class="slider"></span></label>' + texts[lang].optionsRefresh + '<br />'
		+ '<label class="switch"><input type="checkbox" id="hhsVillain"><span class="slider"></span></label>' + texts[lang].optionsVillain + '<br />'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class="switch"><input type="checkbox" id="hhsTiers"><span class="slider"></span></label>' + texts[lang].optionsTiers + '<br />'
		+ '<label class="switch"><input type="checkbox" id="hhsXP"><span class="slider"></span></label>' + texts[lang].optionsXP + '<br />'
		+ '<label class="switch"><input type="checkbox" id="hhsMoney"><span class="slider"></span></label>' + texts[lang].optionsMoney + '<br />'
		+ '<label class="switch"><input type="checkbox" id="hhsMarket"><span class="slider"></span></label>' + texts[lang].optionsMarket + '<br />'
		+ '<label class="switch"><input type="checkbox" id="hhsHarem"><span class="slider"></span></label>' + texts[lang].optionsHarem + '<br />'
		+ '<label class="switch"><input type="checkbox" id="hhsLeague"><span class="slider"></span></label>' + texts[lang].optionsLeague + '<br />'
		+ '<label class="switch"><input type="checkbox" id="hhsSim"><span class="slider"></span></label>' + texts[lang].optionsSim + '<br />'
		+ '<label class="switch"><input type="checkbox" id="hhsChampions"><span class="slider"></span></label>' + texts[lang].optionsChampions
		+ '</div>');

	// Show and hide options menu
	$('#hhsButton').click(function() {
		var x = document.getElementById('hhsOptions');
		if (x.style.display === 'none') {
			x.style.display = 'block';
		}
		else {
			x.style.display = 'none';
		}
	});

	// Dependency of villain menu options
	$('#hhsVillain').click(function(event) {
		if (!$(this).is(':checked')) {
			$('#hhsTiers').prop('checked', false);
		}
	});
	$('#hhsTiers').click(function(event) {
		if ($(this).is(':checked')) {
			$('#hhsVillain').prop('checked', true);
		}
	});

	// Save changed options
	$('#hhsRefresh').click(function() {
		if (document.getElementById('hhsRefresh').checked == true) {
			localStorage.setItem('HHS.refresh', '1');
		}
		if (document.getElementById('hhsRefresh').checked == false) {
			localStorage.setItem('HHS.refresh', '0');
		}
	});

	$('#hhsVillain').click(function() {
		if (document.getElementById('hhsVillain').checked == true) {
			localStorage.setItem('HHS.villain', '1');
		}
		if (document.getElementById('hhsVillain').checked == false) {
			localStorage.setItem('HHS.villain', '0');
			localStorage.setItem('HHS.tiers', '0');
		}
	});

	$('#hhsTiers').click(function() {
		if (document.getElementById('hhsTiers').checked == true) {
			localStorage.setItem('HHS.villain', '1');
			localStorage.setItem('HHS.tiers', '1');
		}
		if (document.getElementById('hhsTiers').checked == false) {
			localStorage.setItem('HHS.tiers', '0');
		}
	});

	$('#hhsXP').click(function() {
		if (document.getElementById('hhsXP').checked == true) {
			localStorage.setItem('HHS.xp', '1');
		}
		if (document.getElementById('hhsXP').checked == false) {
			localStorage.setItem('HHS.xp', '0');
		}
	});

	$('#hhsMoney').click(function() {
		if (document.getElementById('hhsMoney').checked == true) {
			localStorage.setItem('HHS.money', '1');
		}
		if (document.getElementById('hhsMoney').checked == false) {
			localStorage.setItem('HHS.money', '0');
		}
	});

	$('#hhsMarket').click(function() {
		if (document.getElementById('hhsMarket').checked == true) {
			localStorage.setItem('HHS.market', '1');
		}
		if (document.getElementById('hhsMarket').checked == false) {
			localStorage.setItem('HHS.market', '0');
		}
	});

	$('#hhsHarem').click(function() {
		if (document.getElementById('hhsHarem').checked == true) {
			localStorage.setItem('HHS.harem', '1');
		}
		if (document.getElementById('hhsHarem').checked == false) {
			localStorage.setItem('HHS.harem', '0');
		}
	});

	$('#hhsLeague').click(function() {
		if (document.getElementById('hhsLeague').checked == true) {
			localStorage.setItem('HHS.league', '1');
		}
		if (document.getElementById('hhsLeague').checked == false) {
			localStorage.setItem('HHS.league', '0');
		}
	});

	$('#hhsSim').click(function() {
		if (document.getElementById('hhsSim').checked == true) {
			localStorage.setItem('HHS.sim', '1');
		}
		if (document.getElementById('hhsSim').checked == false) {
			localStorage.setItem('HHS.sim', '0');
		}
	});

	$('#hhsChampions').click(function() {
		if (document.getElementById('hhsChampions').checked == true) {
			localStorage.setItem('HHS.champions', '1');
		}
		if (document.getElementById('hhsChampions').checked == false) {
			localStorage.setItem('HHS.champions', '0');
		}
	});

	//CSS
	sheet.insertRule('#hhsButton {'
		+ 'height: 35px; '
		+ 'position: absolute; '
		+ 'top: 55px; '
		+ 'right: 15px; '
		+ 'filter: drop-shadow(0px 0px 5px white);}'
	);

	sheet.insertRule('.hhsTooltip {'
		+ 'font-size: 12px; '
		+ 'text-align: left; '
		+ 'padding: 3px 5px 3px 5px; '
		+ 'border: 2px solid #905312; '
		+ 'border-radius: 6px; '
		+ 'background-color: rgba(32,3,7,.9); '
		+ 'position: absolute; right: 55px; top: 55px;}'
	);

	sheet.insertRule('.switch {'
		+ 'position: relative; '
		+ 'display: inline-block; '
		+ 'width: 34px; '
		+ 'height: 17px;}'
	);

	sheet.insertRule('.slider {'
		+ 'position: absolute; '
		+ 'cursor: pointer; '
		+ 'top: 0; '
		+ 'left: 0; '
		+ 'right: 0; '
		+ 'bottom: 0; '
		+ 'background-color: #CCCCCC; '
		+ '-webkit-transition: .4s; '
		+ 'transition: .4s; '
		+ 'border-radius: 17px; '
		+ 'margin-right: 4px;}'
	);

	sheet.insertRule('.slider:before {'
		+ 'position: absolute; '
		+ 'content: \'\'; '
		+ 'height: 13px; '
		+ 'width: 13px; '
		+ 'left: 2px; '
		+ 'bottom: 2px; '
		+ 'background-color: white; '
		+ '-webkit-transition: .4s; '
		+ 'transition: .4s; '
		+ 'border-radius: 50%;}'
	);

	sheet.insertRule('input:checked + .slider {'
		+ 'background-color: #F11F64;}'
	);

	sheet.insertRule('input:checked + .slider:before {'
		+ '-webkit-transform: translateX(13px); '
		+ '-ms-transform: translateX(13px); '
		+ 'transform: translateX(13px);}'
	);
}

/* =====================
	HOME SCREEN REFRESH
   ===================== */

function moduleRefresh() {
	setInterval(function() {
		window.location.reload();
	}, 600000);
}

/* ======================
	FIGHT A VILLAIN MENU
   ====================== */

function moduleVillain() {
	//Create localStorage if it doesn't exist yet
	if (localStorage.getItem('eventTrolls') === null) {
		localStorage.setItem('eventTrolls', '[]');
	}
	if (localStorage.getItem('tierGirlsOwned') === null) {
		localStorage.setItem('tierGirlsOwned', '[[], [], [], [], [], [], [], [], [], [], [], [], []]');
	}

	var eventTrolls = JSON.parse(localStorage.getItem('eventTrolls'));
	var tierGirlsOwned = JSON.parse(localStorage.getItem('tierGirlsOwned'));
	var	includeTiers = false;

	if (localStorage.getItem('HHS.tiers') === '1') {
			includeTiers = true;
	}

	if (currentPage.indexOf('home') != -1) {

		//Check if event girls have been collected
		eventTrolls = [];
		if (typeof event_data !== 'undefined') {
			event_data.girls.forEach(function(girl) {
				if (girl.troll !== null) {
					if (girl.shards !== 100) {
						eventTrolls.push(girl.troll.id_troll);
					}
				}
			});
		}
		localStorage.setItem('eventTrolls', JSON.stringify(eventTrolls));

		if (includeTiers) {
			//Check if villain tier girls have been collected
			tierGirlsOwned = [[], [], [], [], [], [], [], [], [], [], [], [], []];

			for (var tIdx = 0; tIdx < tierGirlsID.length; tIdx++) {
				for (var gIdx = 0; gIdx < 5; gIdx++) {
					if (girlsDataList.hasOwnProperty(tierGirlsID[tIdx][gIdx]) || tierGirlsID[tIdx][gIdx] == 0) {
						tierGirlsOwned[tIdx][gIdx] = true;
					}
					else {
						tierGirlsOwned[tIdx][gIdx] = false;
					}
				}
			}
			localStorage.setItem('tierGirlsOwned', JSON.stringify(tierGirlsOwned));
		}
	}

	//Add the actual menu
	var trolls = ['Dark Lord', 'Ninja Spy', 'Gruntt', 'Edwarda', 'Donatien', 'Silvanus', 'Bremen', 'Finalmecia', 'Roko Senseï', 'Karole', 'Jackson&#8217;s Crew', 'Pandora Witch', 'Nike'];
	if (lang == 'fr') {
		trolls[1] = 'Espion Ninja';
		trolls[10] = 'Éq. de Jackson';
		trolls[11] = 'Sorcière Pandora';
	}
	if (lang == 'es') {
		trolls[0] = 'Señor Oscuro';
		trolls[1] = 'Ninja espía';
	}
	if (lang == 'it') {
		trolls[0] = 'Signore Oscuro';
		trolls[1] = 'Spia Ninja';
		trolls[10] ='Ciurma di Jackson';
		trolls[11] ='Strega Pandora';
	}
	if (lang == 'de') {
		trolls[0] = 'Dunkler Lord';
	}

	var currentWorld = Hero.infos.questing.id_world - 1,
		trollName = '',
		trollNameTiers = '',
		trollsMenu = '';

	for (var i = 0; i < currentWorld; i++) {
		if (typeof trolls[i] !== typeof undefined && trolls[i] !== false) {
			trollName = trolls[i];
			if (includeTiers) {
				trollNameTiers = ' ';
				if (!(tierGirlsOwned[i][0] && tierGirlsOwned[i][1] && tierGirlsOwned[i][2])) {
					trollNameTiers = trollNameTiers + '&#185;';
				}
				if (!(tierGirlsOwned[i][3])) {
					trollNameTiers = trollNameTiers + '&#178;';
				}
				if (!(tierGirlsOwned[i][4])) {
					trollNameTiers = trollNameTiers + '&#179;';
				}
			}
		}
		else trollName = texts[lang].world + ' ' + (i + 2) + ' ' + texts[lang].villain;
		var type = 'regular';
		for (var j = 0, len = eventTrolls.length; j < len; j++) {
			if (eventTrolls[j] == (i + 1)) {
				type = 'eventTroll';
			}
		}
		trollsMenu += '<a class="' + type + '" href="/battle.html?id_troll=' + (i + 1) + '">' + trollName + trollNameTiers + '</a><br />';
	}

	$('#contains_all > header').children('[type=fight]').append('<div class="scriptInfo" id="FightTroll">' + texts[lang].fight_villain + '<span class="Arrow"></span><div class="TrollsMenu">' + trollsMenu + '</div></div>');

	//CSS
	sheet.insertRule('.scriptInfo {'
		+ 'position: absolute; '
		+ 'z-index: 99; '
		+ 'width: 90%; '
		+ 'margin: 5px 0 0 13px; '
		+ 'border-radius: 8px 10px 10px 8px; '
		+ 'background-color: rgba(0,0,0,.8); '
		+ 'box-shadow: 0 0 0 1px rgba(255,255,255,0.73); '
		+ 'font-size: 12px; '
		+ 'font-weight: 400; '
		+ 'letter-spacing: .22px; '
		+ 'color: #fff; '
		+ 'text-align: center;}'
	);

	sheet.insertRule('.scriptInfo a {'
		+ 'font-family: \'Carter One\', \'Alegreya Sans\', cursive !important; '
		+ 'color: rgb(255, 255, 255); '
		+ 'text-decoration: none;}'
	);

	sheet.insertRule('#FightTroll {'
		+ 'width: 80%; '
		+ 'left: 20px; '
        + 'margin-top: 3em; }'
	);

	sheet.insertRule('.eventTroll {'
		+ 'color: #f70 !important;}'
	);

	sheet.insertRule('.eventTroll:hover {'
		+ 'color: #fa0 !important;}'
	);

	sheet.insertRule('#FightTroll > .Arrow {'
		+ 'float: right; '
		+ 'background-image: url("https://i.postimg.cc/d0cZtFPh/icon-arrow.png"); '
		+ 'background-size: 18px 18px; '
		+ 'background-repeat: no-repeat; '
		+ 'width: 18px; '
		+ 'height: 18px;}'
	);

	sheet.insertRule('#FightTroll > .TrollsMenu {'
		+ 'position: absolute; '
		+ 'width: 88%; '
		+ 'margin-left: 6px; '
		+ 'border-radius: 0px 0 8px 8px; '
		+ 'background-color: rgba(0,0,0,.8); '
		+ 'line-height: 15px; '
		+ 'opacity: 0; '
		+ 'visibility: hidden; '
		+ 'transition: opacity 400ms, visibility 400ms;}'
	);

	sheet.insertRule('#FightTroll:hover > .TrollsMenu {'
		+ 'opacity: 1; '
		+ 'visibility: visible;}'
	);

	sheet.insertRule('#FightTroll a {'
		+ 'color: rgb(255, 255, 255); '
		+ 'text-decoration: none;}'
	);

	sheet.insertRule('#FightTroll a:hover {'
		+ 'color: rgb(255, 247, 204); '
		+ 'text-decoration: underline;}'
	);
}

/* ===========
	BETTER XP
   =========== */

function moduleXP() {
	function betterXP() {
		$('span[hero="xp"]').empty().append('Next: ');
		$('span[hero="xp_sep"]').empty().append(nThousand(Hero.infos.Xp.left));
		$('span[hero="xp_max"]').empty().append(' XP');
	};

	betterXP();

	$('.button_glow').click(function() {
		setInterval(function() {
			betterXP();
		}, 3000)
	});
}

/* ==============
	BETTER MONEY
   ============== */

function moduleMoney() {
	function betterMoney() {
		$('div[hero="soft_currency"]').empty().append(nRounding(Hero.infos.soft_currency, 2, -1));
	};

	betterMoney();

	$('.button_glow').click(function() {
		setInterval(function() {
			betterMoney();
		}, 3000)
	});

	$('#collect_all').click(function() {
		setInterval(function() {
			betterMoney();
		}, 3000)
	});

	$('.collect_money').click(function() {
		setInterval(function() {
			betterMoney();
		}, 3000)
	});
}

/* ====================
	MARKET INFORMATION
   ==================== */

function moduleMarket() {
	var loc2 = $('.hero_stats').children();
	loc2.each(function() {
		var stat = $(this).attr('hero');
		if (stat == 'carac1' || stat == 'carac2' || stat == 'carac3') {
			$(this).append('<span class="CustomStats"></span><div id="CustomStats' + stat + '" class="StatsTooltip"></div>');
		}
	});

	updateStats();

	function updateStats() {
		var loc2 = $('.hero_stats').children();
		var last_cost = 0,
			levelMoney = 0,
			levelPoints = Hero.infos.level * 30;
		levelMoney = calculateTotalPrice(levelPoints);
		loc2.each(function() {
			var stat = $(this).attr('hero');
			$('.CustomStats').html('');
			if (stat == 'carac1' || stat == 'carac2' || stat == 'carac3') {
				var boughtPoints = Hero.infos[stat],
					remainingPoints = levelPoints - boughtPoints,
					spentMoney = calculateTotalPrice(boughtPoints),
					remainingMoney = levelMoney - spentMoney;

				var totalPoints = Hero.infos.caracs[stat],
					skillPoints = Hero.infos.caracs['stat' + stat.substr(5)] - boughtPoints;

				var equipmentsData = $('.armor#equiped .armor').children(),
					itemPoints = 0;
				equipmentsData.each(function() {
					var equipmentsStats = $(this).attr('data-d'),
						statPosStart = equipmentsStats.indexOf(stat + '_equip') + 15,
						statPosEnd = equipmentsStats.substr(statPosStart).indexOf(',');
					itemPoints = itemPoints + parseInt(equipmentsStats.substr(statPosStart, statPosEnd - 1));
				});

				var boostersData = $('.armor#equiped .sub_block .booster').children(),
					ginsengPoints = 0,
					ginsengLegendary = 0;
				boostersData.each(function() {
					if ($(this).attr('class') != 'slot empty') {
						if ($(this).attr('id_item') == '7') {
							ginsengPoints = ginsengPoints + 100;
						}
						else if ($(this).attr('id_item') == '8') {
							ginsengPoints = ginsengPoints + 350;
						}
						else if ($(this).attr('id_item') == '9') {
							ginsengPoints = ginsengPoints + 1225;
						}
						else if ($(this).attr('id_item') == '316') {
							ginsengLegendary = ginsengLegendary + 1;
						}
					}
				});
				ginsengPoints = ginsengPoints + Math.ceil((skillPoints + boughtPoints + itemPoints + ginsengPoints) * 0.06 * ginsengLegendary);

				var clubPoints = totalPoints - skillPoints - boughtPoints - itemPoints - ginsengPoints;

				$('#CustomStats' + stat).html(
					'<b>' + texts[lang].stat_points_need + ':</b> ' + nThousand(remainingPoints) + '<br />' +
					'<b>' + texts[lang].money_need + ':</b> ' + nThousand(remainingMoney) + '<br />' +
					'<b>' + texts[lang].money_spent + ':</b> ' + nThousand(spentMoney) + '<br /><br />' +
					'<b>' + texts[lang].points_from_level + ':</b> ' + nThousand(skillPoints) + '<br />' +
					'<b>' + texts[lang].bought_points + ':</b> ' + nThousand(boughtPoints) + '<br />' +
					'<b>' + texts[lang].equipment_points + ':</b> ' + nThousand(itemPoints) + '<br />' +
					'<b>' + texts[lang].ginseng_points + ':</b> ' + nThousand(ginsengPoints) + '<br />' +
					'<b>' + texts[lang].club_points + ':</b> ' + nThousand(clubPoints) + '<br />'
				);
			}
		});
	}

	function calculateTotalPrice(points) {
		var last_price = calculateStatPrice(points);
		var price = 0;
		if (points < 2000) {
			price = (7 + last_price) / 2 * points;
		}
		else if (points < 4000) {
			price = 4012000 + (4009 + last_price) / 2 * (points - 2000);
		}
		else if (points < 6000) {
			price = 20026000 + (12011 + last_price) / 2 * (points - 4000);
		}
		else if (points < 8000) {
			price = 56042000 + (24013 + last_price) / 2 * (points - 6000);
		}
		else if (points < 10000) {
			price = 120060000 + (40015 + last_price) / 2 * (points - 8000);
		}
		else if (points < 12000) {
			price = 220080000 + (60017 + last_price) / 2 * (points - 10000);
		}
		else if (points < 14000) {
			price = 364102000 + (84019 + last_price) / 2 * (points - 12000);
		}
		else if (points < 16000) {
			price = 560126000 + (112021 + last_price) / 2 * (points - 14000);
		}
		return price;
	}

	function calculateStatPrice(points) {
		var cost = 0;
		if (points < 2000) {
			cost = 5 + points * 2;
		}
		else if (points < 4000) {
			cost = 4005 + (points - 2000) * 4;
		}
		else if (points < 6000) {
			cost = 12005 + (points - 4000) * 6;
		}
		else if (points < 8000) {
			cost = 24005 + (points - 6000) * 8;
		}
		else if (points < 10000) {
			cost = 40005 + (points - 8000) * 10;
		}
		else if (points < 12000) {
			cost = 60005 + (points - 10000) * 12;
		}
		else if (points < 14000) {
			cost = 84005 + (points - 12000) * 14;
		}
		else if (points < 16000) {
			cost = 112005 + (points - 14000) * 16;
		}
		return cost;
	}

	var lsMarket = {};
	lsMarket.buyable = {};
	lsMarket.stocks = {};
	lsMarket.restock = {};

	setTimeout(function() {
		var restocktime = 0;
		var time = $('#shop > .shop_count > span').text();
		if (time.indexOf('h') > -1) {
			restocktime = parseInt(time.substring(0, time.indexOf('h'))) * 3600;
			time = time.substring(time.indexOf('h') + 1);
		}
		if (time.indexOf('m') > -1) {
			restocktime += parseInt(time.substring(0, time.indexOf('m'))) * 60;
			time = time.substring(time.indexOf('h') + 1);
		}
		if (time.indexOf('s') > -1) {
			restocktime += parseInt(time.substring(0, time.indexOf('s')));
		}

		lsMarket.restock.herolvl = Hero.infos.level;
		lsMarket.restock.time = (new Date()).getTime() + restocktime * 1000;

		get_buyableStocks('potion');
		get_buyableStocks('gift');
		equipments_shop(0);
		boosters_shop(0);
		books_shop(0);
		gifts_shop(0);
	}, 500);

	var timer;
	$('#shop > button, #inventory > button').click(function() {
		var clickedButton = $(this).attr('rel'),
			opened_shop = $('#shop').children('.selected');
		clearTimeout(timer);
		timer = setTimeout(function() {
			if (opened_shop.hasClass('armor')) {
				equipments_shop(1);
			}
			else if (opened_shop.hasClass('booster')) {
				boosters_shop(1);
			}
			else if (opened_shop.hasClass('potion')) {
				if (clickedButton == 'buy' || clickedButton == 'shop_reload') get_buyableStocks('potion');
				books_shop(1);
			}
			else if (opened_shop.hasClass('gift')) {
				if (clickedButton == 'buy' || clickedButton == 'shop_reload') get_buyableStocks('gift');
				gifts_shop(1);
			}
		}, 500);
	});

	function get_buyableStocks(loc_class) {
		var itemsNb = 0,
			itemsXp = 0,
			itemsPrice = 0,
			loc = $('#shop').children('.' + loc_class);
		loc.find('.slot').each(function() {
			if ($(this).hasClass('empty')) return false;
			var item = $(this).data('d');
			itemsNb++;
			itemsXp += parseInt(item.value, 10);
			itemsPrice += parseInt(item.price, 10);
		});
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

	function tt_create(update, loc_class, tt_class, itemName, itemUnit) {
		var itemsNb = 0,
			itemsXp = (itemUnit === '') ? -1 : 0,
			itemsSell = 0,
			loc = $('#inventory').children('.' + loc_class);

		loc.find('.slot').each(function() {
			if ($(this).hasClass('empty')) return false;
			var item = $(this).data('d'),
				Nb = parseInt(item.count, 10);
			itemsNb += Nb;
			itemsSell += Nb * parseInt(item.price_sell, 10);
			if (itemsXp != -1) itemsXp += Nb * parseInt(item.value, 10);
		});

		var tooltip = texts[lang].you_own + ' <b>' + nThousand(itemsNb) + '</b> ' + texts[lang][itemName] + '.<br />' +
			(itemsXp == -1 ? '' : texts[lang].you_can_give + ' <b>' + nThousand(itemsXp) + '</b> ' + texts[lang][itemUnit] + '.<br />') +
			texts[lang].you_can_sell + ' <b>' + nThousand(itemsSell) + '</b> <span class="imgMoney"></span>.';

		lsMarket.stocks[loc_class] = (loc_class == 'potion' || loc_class == 'gift') ? {'Nb':itemsNb, 'Xp':itemsXp} : {'Nb':itemsNb};
		localStorage.setItem('lsMarket', JSON.stringify(lsMarket));

		if (update === 0) {
			loc.prepend('<span class="CustomTT"></span><div class="' + tt_class + '">' + tooltip + '</div>');
		}
		else {
			loc.children('.' + tt_class).html(tooltip);
		}
	}
	$('plus').on('click', function (event) {
		var stat = 'carac' + $(this).attr('for_carac');
		Hero.infos[stat]++;
		timer = setTimeout(function() {
			updateStats();
		}, 400);
	});

	//CSS
	sheet.insertRule('#inventory .CustomTT {'
		+ 'float: right; '
		+ 'margin: 11px 1px 0 0; '
		+ 'background-image: url("https://i.postimg.cc/qBDt6yHV/icon-question.png"); '
		+ 'background-size: 20px 20px; '
		+ 'width: 20px; '
		+ 'height: 20px;}'
	);

	sheet.insertRule('#inventory .CustomTT:hover {'
		+ 'cursor: help;}'
	);

	sheet.insertRule('#inventory .CustomTT:hover + div {'
		+ 'opacity: 1; '
		+ 'visibility: visible;}'
	);

	sheet.insertRule('#inventory .EquipmentsTooltip, #inventory .BoostersTooltip, #inventory .BooksTooltip, #inventory .GiftsTooltip {'
		+ 'position: absolute; '
		+ 'z-index: 99; '
		+ 'width: 240px; '
		+ 'border: 1px solid rgb(162, 195, 215); '
		+ 'border-radius: 8px; '
		+ 'box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1); '
		+ 'padding: 3px 7px 4px 7px; '
		+ 'background-color: #F2F2F2; '
		+ 'font: normal 10px/17px Tahoma, Helvetica, Arial, sans-serif; '
		+ 'color: #057; '
		+ 'opacity: 0; '
		+ 'visibility: hidden; '
		+ 'transition: opacity 400ms, visibility 400ms;}'
	);

	sheet.insertRule('#inventory .EquipmentsTooltip, #inventory .BoostersTooltip {'
		+ 'margin: -33px 0 0 210px; '
		+ 'height: 43px;}'
	);

	sheet.insertRule('#inventory .BooksTooltip, #inventory .GiftsTooltip {'
		+ 'margin: -50px 0 0 210px; '
		+ 'height: 60px;}'
	);

	sheet.insertRule('#inventory .EquipmentsTooltip b, #inventory .BoostersTooltip b, #inventory .BooksTooltip b, #inventory .GiftsTooltip b {'
		+ 'font-weight: bold;}'
	);

	sheet.insertRule('#inventory .imgMoney {'
		+ 'background-size: 12px 12px; '
		+ 'background-repeat: no-repeat; '
		+ 'width: 12px; '
		+ 'height: 14px; '
		+ 'vertical-align: text-bottom; '
		+ 'background-image: url("https://i.postimg.cc/wv01VstN/icon-currency-ymen.png"); '
		+ 'display: inline-block;}'
	);

	sheet.insertRule('.hero_stats .CustomStats:hover {'
		+ 'cursor: help;}'
	);

	sheet.insertRule('.hero_stats .CustomStats {'
		+ 'float: left; '
		+ 'margin-left: -20px; '
		+ 'margin-top: 0px; '
		+ 'background-image: url("https://i.postimg.cc/qBDt6yHV/icon-question.png"); '
		+ 'background-size: 18px 18px; '
		+ 'background-position: center; '
		+ 'background-repeat: no-repeat; '
		+ 'width: 18px; '
		+ 'height: 100%; '
		+ 'visibility: none;}'
	);

	sheet.insertRule('.hero_stats .CustomStats:hover + div {'
		+ 'opacity: 1; '
		+ 'visibility: visible;}'
	);

	sheet.insertRule('.hero_stats .StatsTooltip {'
		+ 'position: absolute; '
		+ 'z-index: 99; '
		+ 'margin: -50px 0 0 -50px; '
		+ 'border: 1px solid rgb(162, 195, 215); '
		+ 'border-radius: 8px; '
		+ 'box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1); '
		+ 'padding: 2px 17px 2px 7px; '
		+ 'background-color: #F2F2F2; '
		+ 'font: normal 10px/17px Tahoma, Helvetica, Arial, sans-serif; '
		+ 'text-align: left; '
		+ 'white-space: nowrap; '
		+ 'opacity: 0; '
		+ 'visibility: hidden; '
		+ 'transition: opacity 400ms, visibility 400ms;}'
	);

	sheet.insertRule('.hero_stats .StatsTooltip b {'
		+ 'font-weight: bold;}'
	);
}

/* ===================
	HAREM INFORMATION
   =================== */

function moduleHarem() {
	var stats = [];
	var girlsList = [];
	var haremRight = $('#harem_right');

	stats.girls = 0;
	stats.hourlyMoney = 0;
	stats.allCollect = 0;
	stats.unlockedScenes = 0;
	stats.allScenes = 0;
	stats.rarities = {starting: 0, common: 0, rare: 0, epic: 0, legendary: 0, mythic: 0};
	stats.caracs = {1: 0, 2: 0, 3: 0};
	stats.stars = {affection: 0, money: 0, kobans: 0};
	stats.xp = 0;
	stats.affection = 0;
	stats.money = 0;
	stats.kobans = 0;

	var GIRLS_EXP_LEVELS = [];

	GIRLS_EXP_LEVELS.starting = [10, 21, 32, 43, 54, 65, 76, 87, 98, 109, 120, 131, 142, 154, 166, 178, 190, 202, 214, 226, 238, 250, 262, 274, 286, 299, 312, 325, 338, 351, 364, 377, 390, 403, 416, 429, 443, 457, 471, 485, 499, 513, 527, 541, 555, 569, 584, 599, 614, 629, 644, 659, 674, 689, 704, 720, 736, 752, 768, 784, 800, 816, 832, 849, 866, 883, 900, 917, 934, 951, 968, 985, 1003, 1021, 1039, 1057, 1075, 1093, 1111, 1130, 1149, 1168, 1187, 1206, 1225, 1244, 1264, 1284, 1304, 1324, 1344, 1364, 1384, 1405, 1426, 1447, 1468, 1489, 1510, 1531, 1553, 1575, 1597, 1619, 1641, 1663, 1686, 1709, 1732, 1755, 1778, 1801, 1825, 1849, 1873, 1897, 1921, 1945, 1970, 1995, 2020, 2045, 2070, 2096, 2122, 2148, 2174, 2200, 2227, 2254, 2281, 2308, 2335, 2363, 2391, 2419, 2447, 2475, 2504, 2533, 2562, 2591, 2620, 2650, 2680, 2710, 2740, 2770, 2801, 2832, 2863, 2894, 2926, 2958, 2990, 3022, 3055, 3088, 3121, 3154, 3188, 3222, 3256, 3290, 3325, 3360, 3395, 3430, 3466, 3502, 3538, 3574, 3611, 3648, 3685, 3722, 3760, 3798, 3836, 3875, 3914, 3953, 3992, 4032, 4072, 4112, 4153, 4194, 4235, 4277, 4319, 4361, 4403, 4446, 4489, 4532, 4576, 4620, 4664, 4709, 4754, 4799, 4845, 4891, 4937, 4984, 5031, 5078, 5126, 5174, 5223, 5272, 5321, 5371, 5421, 5471, 5522, 5573, 5624, 5676, 5728, 5781, 5834, 5887, 5941, 5995, 6050, 6105, 6160, 6216, 6272, 6329, 6386, 6444, 6502, 6560, 6619, 6678, 6738, 6798, 6859, 6920, 6981, 7043, 7105, 7168, 7231, 7295, 7359, 7424, 7489, 7555, 7621, 7688, 7755, 7823, 7891, 7960, 8029, 8099, 8169, 8240, 8311, 8383, 8455, 8528, 8601, 8675, 8750, 8825, 8901, 8977, 9054, 9131, 9209, 9288, 9367, 9447, 9527, 9608, 9690, 9772, 9855, 9938, 10022, 10107, 10192, 10278, 10365, 10452, 10540, 10628, 10717, 10807, 10897, 10988, 11080, 11172, 11265, 11359, 11454, 11549, 11645, 11742, 11839, 11937, 12036, 12136, 12236, 12337, 12439, 12542, 12645, 12749, 12854, 12960, 13067, 13174, 13282, 13391, 13501, 13612, 13723, 13835, 13948, 14062, 14177, 14293, 14409, 14526, 14644, 14763, 14883, 15004, 15126, 15249, 15373, 15498, 15623, 15749, 15876, 16004, 16133, 16263, 16394, 16526, 16659, 16793, 16928, 17064, 17201, 17339, 17478, 17618, 17759, 17901, 18044, 18189, 18335, 18482, 18630, 18779, 18929, 19080, 19232, 19385, 19540, 19696, 19853, 20011, 20170, 20330, 20492, 20655, 20819, 20984, 21151, 21319, 21488, 21658, 21830, 22003, 22177, 22352, 22529, 22707, 22886, 23067, 23249, 23432, 23617, 23803, 23991, 24180, 24370, 24562, 24755, 24950, 25146, 25344, 25543, 25744, 25946, 26150, 26355, 26562, 26770, 26980, 27191, 27404, 27619, 27835, 28053, 28272, 28493, 28716, 28940, 29166, 29394, 29623, 29854, 30087, 30322, 30558, 30796, 31036, 31278, 31522, 31767, 32014, 32263, 32514, 32767, 33022, 33279, 33537, 33797, 34059, 34323, 34589, 34857, 35127, 35399, 35673, 35949, 36228, 36509, 36792, 37077, 37364, 37653, 37944, 38237, 38533, 38831, 39131, 39433, 39738, 40045, 40354, 40665, 40979, 41295, 41614, 41935, 42258, 42584, 42912, 43243, 43576, 43912, 44250, 44591, 44934, 45280, 45628, 45979, 46333, 46689, 47048, 47410, 47774, 48141, 48511, 48884, 49259, 49637, 50018, 50402, 50789, 51179, 51572, 51967, 52365, 52766, 53170, 53577, 53988, 54402, 54819];

	GIRLS_EXP_LEVELS.common = [10, 21, 32, 43, 54, 65, 76, 87, 98, 109, 120, 131, 142, 154, 166, 178, 190, 202, 214, 226, 238, 250, 262, 274, 286, 299, 312, 325, 338, 351, 364, 377, 390, 403, 416, 429, 443, 457, 471, 485, 499, 513, 527, 541, 555, 569, 584, 599, 614, 629, 644, 659, 674, 689, 704, 720, 736, 752, 768, 784, 800, 816, 832, 849, 866, 883, 900, 917, 934, 951, 968, 985, 1003, 1021, 1039, 1057, 1075, 1093, 1111, 1130, 1149, 1168, 1187, 1206, 1225, 1244, 1264, 1284, 1304, 1324, 1344, 1364, 1384, 1405, 1426, 1447, 1468, 1489, 1510, 1531, 1553, 1575, 1597, 1619, 1641, 1663, 1686, 1709, 1732, 1755, 1778, 1801, 1825, 1849, 1873, 1897, 1921, 1945, 1970, 1995, 2020, 2045, 2070, 2096, 2122, 2148, 2174, 2200, 2227, 2254, 2281, 2308, 2335, 2363, 2391, 2419, 2447, 2475, 2504, 2533, 2562, 2591, 2620, 2650, 2680, 2710, 2740, 2770, 2801, 2832, 2863, 2894, 2926, 2958, 2990, 3022, 3055, 3088, 3121, 3154, 3188, 3222, 3256, 3290, 3325, 3360, 3395, 3430, 3466, 3502, 3538, 3574, 3611, 3648, 3685, 3722, 3760, 3798, 3836, 3875, 3914, 3953, 3992, 4032, 4072, 4112, 4153, 4194, 4235, 4277, 4319, 4361, 4403, 4446, 4489, 4532, 4576, 4620, 4664, 4709, 4754, 4799, 4845, 4891, 4937, 4984, 5031, 5078, 5126, 5174, 5223, 5272, 5321, 5371, 5421, 5471, 5522, 5573, 5624, 5676, 5728, 5781, 5834, 5887, 5941, 5995, 6050, 6105, 6160, 6216, 6272, 6329, 6386, 6444, 6502, 6560, 6619, 6678, 6738, 6798, 6859, 6920, 6981, 7043, 7105, 7168, 7231, 7295, 7359, 7424, 7489, 7555, 7621, 7688, 7755, 7823, 7891, 7960, 8029, 8099, 8169, 8240, 8311, 8383, 8455, 8528, 8601, 8675, 8750, 8825, 8901, 8977, 9054, 9131, 9209, 9288, 9367, 9447, 9527, 9608, 9690, 9772, 9855, 9938, 10022, 10107, 10192, 10278, 10365, 10452, 10540, 10628, 10717, 10807, 10897, 10988, 11080, 11172, 11265, 11359, 11454, 11549, 11645, 11742, 11839, 11937, 12036, 12136, 12236, 12337, 12439, 12542, 12645, 12749, 12854, 12960, 13067, 13174, 13282, 13391, 13501, 13612, 13723, 13835, 13948, 14062, 14177, 14293, 14409, 14526, 14644, 14763, 14883, 15004, 15126, 15249, 15373, 15498, 15623, 15749, 15876, 16004, 16133, 16263, 16394, 16526, 16659, 16793, 16928, 17064, 17201, 17339, 17478, 17618, 17759, 17901, 18044, 18189, 18335, 18482, 18630, 18779, 18929, 19080, 19232, 19385, 19540, 19696, 19853, 20011, 20170, 20330, 20492, 20655, 20819, 20984, 21151, 21319, 21488, 21658, 21830, 22003, 22177, 22352, 22529, 22707, 22886, 23067, 23249, 23432, 23617, 23803, 23991, 24180, 24370, 24562, 24755, 24950, 25146, 25344, 25543, 25744, 25946, 26150, 26355, 26562, 26770, 26980, 27191, 27404, 27619, 27835, 28053, 28272, 28493, 28716, 28940, 29166, 29394, 29623, 29854, 30087, 30322, 30558, 30796, 31036, 31278, 31522, 31767, 32014, 32263, 32514, 32767, 33022, 33279, 33537, 33797, 34059, 34323, 34589, 34857, 35127, 35399, 35673, 35949, 36228, 36509, 36792, 37077, 37364, 37653, 37944, 38237, 38533, 38831, 39131, 39433, 39738, 40045, 40354, 40665, 40979, 41295, 41614, 41935, 42258, 42584, 42912, 43243, 43576, 43912, 44250, 44591, 44934, 45280, 45628, 45979, 46333, 46689, 47048, 47410, 47774, 48141, 48511, 48884, 49259, 49637, 50018, 50402, 50789, 51179, 51572, 51967, 52365, 52766, 53170, 53577, 53988, 54402, 54819];

	GIRLS_EXP_LEVELS.rare = [12, 25, 38, 51, 64, 77, 90, 103, 116, 129, 142, 156, 170, 184, 198, 212, 226, 240, 254, 268, 282, 297, 312, 327, 342, 357, 372, 387, 402, 417, 433, 449, 465, 481, 497, 513, 529, 545, 561, 578, 595, 612, 629, 646, 663, 680, 697, 715, 733, 751, 769, 787, 805, 823, 841, 860, 879, 898, 917, 936, 955, 974, 994, 1014, 1034, 1054, 1074, 1094, 1114, 1135, 1156, 1177, 1198, 1219, 1240, 1262, 1284, 1306, 1328, 1350, 1372, 1394, 1417, 1440, 1463, 1486, 1509, 1532, 1556, 1580, 1604, 1628, 1652, 1677, 1702, 1727, 1752, 1777, 1802, 1828, 1854, 1880, 1906, 1932, 1959, 1986, 2013, 2040, 2067, 2095, 2123, 2151, 2179, 2207, 2236, 2265, 2294, 2323, 2352, 2382, 2412, 2442, 2472, 2503, 2534, 2565, 2596, 2627, 2659, 2691, 2723, 2755, 2788, 2821, 2854, 2887, 2921, 2955, 2989, 3023, 3058, 3093, 3128, 3163, 3199, 3235, 3271, 3307, 3344, 3381, 3418, 3456, 3494, 3532, 3570, 3609, 3648, 3687, 3727, 3767, 3807, 3847, 3888, 3929, 3970, 4012, 4054, 4096, 4139, 4182, 4225, 4269, 4313, 4357, 4402, 4447, 4492, 4538, 4584, 4630, 4677, 4724, 4771, 4819, 4867, 4915, 4964, 5013, 5062, 5112, 5162, 5213, 5264, 5315, 5367, 5419, 5471, 5524, 5577, 5631, 5685, 5739, 5794, 5849, 5905, 5961, 6017, 6074, 6131, 6189, 6247, 6306, 6365, 6424, 6484, 6544, 6605, 6666, 6728, 6790, 6853, 6916, 6980, 7044, 7108, 7173, 7238, 7304, 7370, 7437, 7504, 7572, 7640, 7709, 7778, 7848, 7918, 7989, 8061, 8133, 8206, 8279, 8353, 8427, 8502, 8577, 8653, 8729, 8806, 8884, 8962, 9041, 9120, 9200, 9281, 9362, 9444, 9526, 9609, 9693, 9777, 9862, 9947, 10033, 10120, 10207, 10295, 10384, 10473, 10563, 10654, 10745, 10837, 10930, 11023, 11117, 11212, 11308, 11404, 11501, 11599, 11697, 11796, 11896, 11997, 12098, 12200, 12303, 12407, 12511, 12616, 12722, 12829, 12937, 13045, 13154, 13264, 13375, 13487, 13600, 13713, 13827, 13942, 14058, 14175, 14293, 14412, 14531, 14651, 14772, 14894, 15017, 15141, 15266, 15392, 15519, 15647, 15776, 15906, 16037, 16169, 16302, 16436, 16571, 16707, 16844, 16982, 17121, 17261, 17402, 17544, 17687, 17831, 17976, 18122, 18269, 18417, 18566, 18716, 18868, 19021, 19175, 19330, 19486, 19643, 19802, 19962, 20123, 20285, 20448, 20613, 20779, 20946, 21114, 21284, 21455, 21627, 21800, 21975, 22151, 22328, 22507, 22687, 22868, 23051, 23235, 23420, 23607, 23795, 23985, 24176, 24368, 24562, 24757, 24954, 25152, 25352, 25553, 25756, 25960, 26166, 26373, 26582, 26792, 27004, 27218, 27433, 27650, 27868, 28088, 28310, 28533, 28758, 28985, 29213, 29443, 29675, 29909, 30144, 30381, 30620, 30861, 31103, 31347, 31593, 31841, 32091, 32343, 32597, 32852, 33109, 33368, 33629, 33892, 34157, 34424, 34693, 34964, 35237, 35512, 35789, 36068, 36349, 36633, 36919, 37207, 37497, 37789, 38083, 38380, 38679, 38980, 39283, 39588, 39896, 40206, 40518, 40833, 41150, 41469, 41791, 42115, 42442, 42771, 43103, 43437, 43774, 44113, 44455, 44799, 45146, 45495, 45847, 46202, 46559, 46919, 47282, 47647, 48015, 48386, 48760, 49136, 49515, 49897, 50282, 50670, 51061, 51455, 51852, 52252, 52655, 53061, 53470, 53882, 54297, 54715, 55136, 55560, 55987, 56418, 56852, 57289, 57729, 58173, 58620, 59070, 59524, 59981, 60442, 60906, 61373, 61844, 62318, 62796, 63278, 63763, 64252, 64745, 65241, 65741];

	GIRLS_EXP_LEVELS.epic = [14, 29, 44, 59, 74, 89, 104, 119, 134, 149, 165, 181, 197, 213, 229, 245, 261, 277, 294, 311, 328, 345, 362, 379, 396, 413, 431, 449, 467, 485, 503, 521, 539, 557, 576, 595, 614, 633, 652, 671, 690, 710, 730, 750, 770, 790, 810, 830, 851, 872, 893, 914, 935, 956, 977, 999, 1021, 1043, 1065, 1087, 1109, 1132, 1155, 1178, 1201, 1224, 1247, 1271, 1295, 1319, 1343, 1367, 1391, 1416, 1441, 1466, 1491, 1516, 1542, 1568, 1594, 1620, 1646, 1673, 1700, 1727, 1754, 1781, 1809, 1837, 1865, 1893, 1921, 1950, 1979, 2008, 2037, 2066, 2096, 2126, 2156, 2186, 2217, 2248, 2279, 2310, 2341, 2373, 2405, 2437, 2469, 2502, 2535, 2568, 2601, 2635, 2669, 2703, 2737, 2772, 2807, 2842, 2877, 2913, 2949, 2985, 3021, 3058, 3095, 3132, 3169, 3207, 3245, 3283, 3322, 3361, 3400, 3439, 3479, 3519, 3559, 3600, 3641, 3682, 3724, 3766, 3808, 3850, 3893, 3936, 3979, 4023, 4067, 4111, 4156, 4201, 4246, 4292, 4338, 4384, 4431, 4478, 4525, 4573, 4621, 4670, 4719, 4768, 4818, 4868, 4918, 4969, 5020, 5071, 5123, 5175, 5228, 5281, 5334, 5388, 5442, 5497, 5552, 5607, 5663, 5719, 5776, 5833, 5891, 5949, 6007, 6066, 6125, 6185, 6245, 6306, 6367, 6429, 6491, 6553, 6616, 6679, 6743, 6807, 6872, 6937, 7003, 7069, 7136, 7203, 7271, 7339, 7408, 7477, 7547, 7617, 7688, 7759, 7831, 7903, 7976, 8049, 8123, 8198, 8273, 8349, 8425, 8502, 8579, 8657, 8736, 8815, 8895, 8975, 9056, 9138, 9220, 9303, 9386, 9470, 9555, 9640, 9726, 9813, 9900, 9988, 10076, 10165, 10255, 10345, 10436, 10528, 10621, 10714, 10808, 10903, 10998, 11094, 11191, 11288, 11386, 11485, 11585, 11685, 11786, 11888, 11991, 12094, 12198, 12303, 12409, 12516, 12623, 12731, 12840, 12950, 13061, 13172, 13284, 13397, 13511, 13626, 13742, 13859, 13976, 14094, 14213, 14333, 14454, 14576, 14699, 14823, 14948, 15074, 15200, 15327, 15455, 15584, 15714, 15845, 15977, 16110, 16244, 16379, 16515, 16652, 16790, 16929, 17069, 17210, 17352, 17496, 17641, 17787, 17934, 18082, 18231, 18381, 18532, 18684, 18837, 18992, 19148, 19305, 19463, 19622, 19782, 19944, 20107, 20271, 20436, 20603, 20771, 20940, 21110, 21282, 21455, 21629, 21804, 21981, 22159, 22338, 22519, 22701, 22884, 23069, 23255, 23443, 23632, 23822, 24014, 24207, 24402, 24598, 24796, 24995, 25196, 25398, 25602, 25807, 26014, 26222, 26432, 26643, 26856, 27071, 27287, 27505, 27724, 27945, 28168, 28392, 28618, 28846, 29075, 29306, 29539, 29774, 30010, 30248, 30488, 30730, 30974, 31219, 31466, 31715, 31966, 32219, 32474, 32731, 32990, 33250, 33512, 33776, 34042, 34310, 34580, 34852, 35126, 35402, 35681, 35962, 36245, 36530, 36817, 37106, 37397, 37690, 37986, 38284, 38584, 38886, 39191, 39498, 39807, 40119, 40433, 40749, 41068, 41389, 41712, 42038, 42366, 42697, 43030, 43366, 43704, 44045, 44388, 44734, 45082, 45433, 45787, 46143, 46502, 46864, 47228, 47595, 47965, 48338, 48713, 49091, 49472, 49856, 50243, 50633, 51026, 51422, 51821, 52223, 52628, 53036, 53447, 53861, 54278, 54698, 55121, 55547, 55976, 56409, 56845, 57284, 57726, 58172, 58621, 59073, 59529, 59988, 60451, 60917, 61387, 61860, 62337, 62817, 63301, 63789, 64280, 64775, 65274, 65776, 66282, 66792, 67306, 67823, 68344, 68869, 69398, 69931, 70468, 71009, 71554, 72103, 72656, 73214, 73776, 74342, 74912, 75487, 76066, 76649];

	GIRLS_EXP_LEVELS.legendary = [16, 33, 50, 67, 84, 101, 118, 135, 152, 170, 188, 206, 224, 242, 260, 278, 297, 316, 335, 354, 373, 392, 411, 431, 451, 471, 491, 511, 531, 551, 572, 593, 614, 635, 656, 677, 698, 720, 742, 764, 786, 808, 830, 853, 876, 899, 922, 945, 968, 992, 1016, 1040, 1064, 1088, 1112, 1137, 1162, 1187, 1212, 1237, 1263, 1289, 1315, 1341, 1367, 1394, 1421, 1448, 1475, 1502, 1529, 1557, 1585, 1613, 1641, 1670, 1699, 1728, 1757, 1786, 1816, 1846, 1876, 1906, 1936, 1967, 1998, 2029, 2060, 2092, 2124, 2156, 2188, 2221, 2254, 2287, 2320, 2354, 2388, 2422, 2456, 2491, 2526, 2561, 2596, 2632, 2668, 2704, 2740, 2777, 2814, 2851, 2888, 2926, 2964, 3002, 3041, 3080, 3119, 3158, 3198, 3238, 3278, 3319, 3360, 3401, 3443, 3485, 3527, 3569, 3612, 3655, 3698, 3742, 3786, 3830, 3875, 3920, 3965, 4011, 4057, 4103, 4150, 4197, 4244, 4292, 4340, 4388, 4437, 4486, 4536, 4586, 4636, 4687, 4738, 4789, 4841, 4893, 4946, 4999, 5052, 5106, 5160, 5215, 5270, 5325, 5381, 5437, 5494, 5551, 5608, 5666, 5724, 5783, 5842, 5902, 5962, 6023, 6084, 6145, 6207, 6269, 6332, 6395, 6459, 6523, 6588, 6653, 6719, 6785, 6852, 6919, 6987, 7055, 7124, 7193, 7263, 7333, 7404, 7475, 7547, 7619, 7692, 7765, 7839, 7914, 7989, 8065, 8141, 8218, 8295, 8373, 8451, 8530, 8610, 8690, 8771, 8852, 8934, 9017, 9100, 9184, 9269, 9354, 9440, 9526, 9613, 9701, 9789, 9878, 9968, 10058, 10149, 10241, 10333, 10426, 10520, 10615, 10710, 10806, 10903, 11000, 11098, 11197, 11297, 11397, 11498, 11600, 11703, 11806, 11910, 12015, 12121, 12227, 12334, 12442, 12551, 12661, 12771, 12882, 12994, 13107, 13221, 13336, 13452, 13568, 13685, 13803, 13922, 14042, 14163, 14285, 14408, 14532, 14656, 14781, 14907, 15034, 15162, 15291, 15421, 15552, 15684, 15817, 15951, 16086, 16222, 16359, 16497, 16636, 16776, 16917, 17059, 17202, 17346, 17492, 17639, 17787, 17936, 18086, 18237, 18389, 18542, 18696, 18852, 19009, 19167, 19326, 19486, 19648, 19811, 19975, 20140, 20306, 20474, 20643, 20813, 20984, 21157, 21331, 21506, 21683, 21861, 22040, 22221, 22403, 22586, 22771, 22957, 23144, 23333, 23523, 23715, 23908, 24103, 24299, 24496, 24695, 24895, 25097, 25300, 25505, 25712, 25920, 26130, 26341, 26554, 26768, 26984, 27202, 27421, 27642, 27865, 28089, 28315, 28543, 28772, 29003, 29236, 29470, 29706, 29944, 30184, 30426, 30669, 30914, 31161, 31410, 31661, 31914, 32168, 32424, 32682, 32942, 33204, 33468, 33734, 34002, 34272, 34544, 34818, 35094, 35372, 35652, 35934, 36219, 36506, 36795, 37086, 37379, 37674, 37972, 38272, 38574, 38878, 39185, 39494, 39805, 40119, 40435, 40753, 41074, 41397, 41722, 42050, 42380, 42713, 43048, 43386, 43726, 44069, 44415, 44763, 45114, 45467, 45823, 46182, 46543, 46907, 47274, 47644, 48016, 48391, 48769, 49150, 49534, 49920, 50309, 50701, 51096, 51494, 51895, 52299, 52706, 53116, 53529, 53945, 54364, 54787, 55213, 55642, 56074, 56509, 56948, 57390, 57835, 58284, 58736, 59191, 59650, 60112, 60578, 61047, 61520, 61996, 62476, 62959, 63446, 63937, 64431, 64929, 65431, 65937, 66446, 66959, 67476, 67997, 68522, 69051, 69584, 70121, 70662, 71207, 71756, 72309, 72866, 73427, 73992, 74562, 75136, 75714, 76297, 76884, 77475, 78071, 78671, 79276, 79885, 80499, 81117, 81740, 82368, 83000, 83637, 84279, 84926, 85578, 86235, 86896, 87562];
    
    GIRLS_EXP_LEVELS.mythic = [16, 33, 50, 67, 84, 101, 118, 135, 152, 170, 188, 206, 224, 242, 260, 278, 297, 316, 335, 354, 373, 392, 411, 431, 451, 471, 491, 511, 531, 551, 572, 593, 614, 635, 656, 677, 698, 720, 742, 764, 786, 808, 830, 853, 876, 899, 922, 945, 968, 992, 1016, 1040, 1064, 1088, 1112, 1137, 1162, 1187, 1212, 1237, 1263, 1289, 1315, 1341, 1367, 1394, 1421, 1448, 1475, 1502, 1529, 1557, 1585, 1613, 1641, 1670, 1699, 1728, 1757, 1786, 1816, 1846, 1876, 1906, 1936, 1967, 1998, 2029, 2060, 2092, 2124, 2156, 2188, 2221, 2254, 2287, 2320, 2354, 2388, 2422, 2456, 2491, 2526, 2561, 2596, 2632, 2668, 2704, 2740, 2777, 2814, 2851, 2888, 2926, 2964, 3002, 3041, 3080, 3119, 3158, 3198, 3238, 3278, 3319, 3360, 3401, 3443, 3485, 3527, 3569, 3612, 3655, 3698, 3742, 3786, 3830, 3875, 3920, 3965, 4011, 4057, 4103, 4150, 4197, 4244, 4292, 4340, 4388, 4437, 4486, 4536, 4586, 4636, 4687, 4738, 4789, 4841, 4893, 4946, 4999, 5052, 5106, 5160, 5215, 5270, 5325, 5381, 5437, 5494, 5551, 5608, 5666, 5724, 5783, 5842, 5902, 5962, 6023, 6084, 6145, 6207, 6269, 6332, 6395, 6459, 6523, 6588, 6653, 6719, 6785, 6852, 6919, 6987, 7055, 7124, 7193, 7263, 7333, 7404, 7475, 7547, 7619, 7692, 7765, 7839, 7914, 7989, 8065, 8141, 8218, 8295, 8373, 8451, 8530, 8610, 8690, 8771, 8852, 8934, 9017, 9100, 9184, 9269, 9354, 9440, 9526, 9613, 9701, 9789, 9878, 9968, 10058, 10149, 10241, 10333, 10426, 10520, 10615, 10710, 10806, 10903, 11000, 11098, 11197, 11297, 11397, 11498, 11600, 11703, 11806, 11910, 12015, 12121, 12227, 12334, 12442, 12551, 12661, 12771, 12882, 12994, 13107, 13221, 13336, 13452, 13568, 13685, 13803, 13922, 14042, 14163, 14285, 14408, 14532, 14656, 14781, 14907, 15034, 15162, 15291, 15421, 15552, 15684, 15817, 15951, 16086, 16222, 16359, 16497, 16636, 16776, 16917, 17059, 17202, 17346, 17492, 17639, 17787, 17936, 18086, 18237, 18389, 18542, 18696, 18852, 19009, 19167, 19326, 19486, 19648, 19811, 19975, 20140, 20306, 20474, 20643, 20813, 20984, 21157, 21331, 21506, 21683, 21861, 22040, 22221, 22403, 22586, 22771, 22957, 23144, 23333, 23523, 23715, 23908, 24103, 24299, 24496, 24695, 24895, 25097, 25300, 25505, 25712, 25920, 26130, 26341, 26554, 26768, 26984, 27202, 27421, 27642, 27865, 28089, 28315, 28543, 28772, 29003, 29236, 29470, 29706, 29944, 30184, 30426, 30669, 30914, 31161, 31410, 31661, 31914, 32168, 32424, 32682, 32942, 33204, 33468, 33734, 34002, 34272, 34544, 34818, 35094, 35372, 35652, 35934, 36219, 36506, 36795, 37086, 37379, 37674, 37972, 38272, 38574, 38878, 39185, 39494, 39805, 40119, 40435, 40753, 41074, 41397, 41722, 42050, 42380, 42713, 43048, 43386, 43726, 44069, 44415, 44763, 45114, 45467, 45823, 46182, 46543, 46907, 47274, 47644, 48016, 48391, 48769, 49150, 49534, 49920, 50309, 50701, 51096, 51494, 51895, 52299, 52706, 53116, 53529, 53945, 54364, 54787, 55213, 55642, 56074, 56509, 56948, 57390, 57835, 58284, 58736, 59191, 59650, 60112, 60578, 61047, 61520, 61996, 62476, 62959, 63446, 63937, 64431, 64929, 65431, 65937, 66446, 66959, 67476, 67997, 68522, 69051, 69584, 70121, 70662, 71207, 71756, 72309, 72866, 73427, 73992, 74562, 75136, 75714, 76297, 76884, 77475, 78071, 78671, 79276, 79885, 80499, 81117, 81740, 82368, 83000, 83637, 84279, 84926, 85578, 86235, 86896, 87562];

	var EvoReq = [];

	var starting = [];
	starting.push({affection: 90, money: 36000, kobans: 36, taffection: 90, tmoney: 36000, tkobans: 36});
	starting.push({affection: 225, money: 90000, kobans: 60, taffection: 315, tmoney: 126000, tkobans: 96});
	starting.push({affection: 563, money: 225000, kobans: 114, taffection: 878, tmoney: 351000, tkobans: 210});
	starting.push({affection: 1125, money: 450000, kobans: 180, taffection: 2003, tmoney: 801000, tkobans: 390});
	starting.push({affection: 2250, money: 900000, kobans: 300, taffection: 4253, tmoney: 1701000, tkobans: 690});
	EvoReq.starting = starting;

	var commonGirls = [];
	commonGirls.push({affection: 180, money: 72000, kobans: 72, taffection: 180, tmoney: 72000, tkobans: 72});
	commonGirls.push({affection: 450, money: 180000, kobans: 120, taffection: 630, tmoney: 252000, tkobans: 192});
	commonGirls.push({affection: 1125, money: 450000, kobans: 228, taffection: 1755, tmoney: 702000, tkobans: 420});
	commonGirls.push({affection: 2250, money: 900000, kobans: 360, taffection: 4005, tmoney: 1602000, tkobans: 780});
	commonGirls.push({affection: 4500, money: 1800000, kobans: 600, taffection: 8505, tmoney: 3402000, tkobans: 1380});
	EvoReq.common = commonGirls;

	var rareGirls = [];
	rareGirls.push({affection: 540, money: 216000, kobans: 216, taffection: 540, tmoney: 216000, tkobans: 216});
	rareGirls.push({affection: 1350, money: 540000, kobans: 360, taffection: 1890, tmoney: 756000, tkobans: 576});
	rareGirls.push({affection: 3375, money: 1350000, kobans: 678, taffection: 5265, tmoney: 2106000, tkobans: 1254});
	rareGirls.push({affection: 6750, money: 2700000, kobans: 1080, taffection: 12015, tmoney: 4806000, tkobans: 2334});
	rareGirls.push({affection: 13500, money: 5400000, kobans: 1800, taffection: 25515, tmoney: 10206000, tkobans: 4134});
	EvoReq.rare = rareGirls;

	var epicGirls = [];
	epicGirls.push({affection: 1260, money: 504000, kobans: 504, taffection: 1260, tmoney: 504000, tkobans: 504});
	epicGirls.push({affection: 3150, money: 1260000, kobans: 840, taffection: 4410, tmoney: 1764000, tkobans: 1344});
	epicGirls.push({affection: 7875, money: 3150000, kobans: 1578, taffection: 12285, tmoney: 4914000, tkobans: 2922});
	epicGirls.push({affection: 15750, money: 6300000, kobans: 2520, taffection: 28035, tmoney: 11214000, tkobans: 5442});
	epicGirls.push({affection: 31500, money: 12600000, kobans: 4200, taffection: 59535, tmoney: 23814000, tkobans: 9642});
	EvoReq.epic = epicGirls;

	var legendGirls = [];
	legendGirls.push({affection: 1800, money: 720000, kobans: 720, taffection: 1800, tmoney: 720000, tkobans: 720});
	legendGirls.push({affection: 4500, money: 1800000, kobans: 1200, taffection: 6300, tmoney: 2520000, tkobans: 1920});
	legendGirls.push({affection: 11250, money: 4500000, kobans: 2250, taffection: 17550, tmoney: 7020000, tkobans: 4170});
	legendGirls.push({affection: 22500, money: 9000000, kobans: 3600, taffection: 40050, tmoney: 16020000, tkobans: 7770});
	legendGirls.push({affection: 45000, money: 18000000, kobans: 6000, taffection: 85050, tmoney: 34020000, tkobans: 13770});
	EvoReq.legendary = legendGirls;
    
        var mythicGirls = legendGirls;
        mythicGirls.push({affection: 45000, money: 18000000, kobans: 6000, taffection: 85050, tmoney: 34020000, tkobans: 13770});
        EvoReq.mythic = mythicGirls;

	for (var id in girlsDataList) {
		var girl = jQuery.extend(true, {}, girlsDataList[id]);
		if (girl.own) {
			stats.allCollect += girl.salary;
			stats.rarities[girl.rarity]++;
			stats.caracs[girl.class]++;
			stats.girls++;
			stats.hourlyMoney += Math.round(girl.salary_per_hour);
			stats.unlockedScenes += girl.graded;
			stats.allScenes += parseInt(girl.nb_grades);
			var nbgrades = parseInt(girl.nb_grades);
			if (girl.graded != nbgrades) {
				stats.affection += EvoReq[girl.rarity][nbgrades - 1].taffection - girl.Affection.cur;
				var currentLevelMoney = 0,
					currentLevelKobans = 0;
				if (girl.graded != 0) {
					currentLevelMoney = EvoReq[girl.rarity][girl.graded - 1].tmoney;
					currentLevelKobans = EvoReq[girl.rarity][girl.graded - 1].tkobans;
				}
				stats.money += EvoReq[girl.rarity][nbgrades - 1].tmoney - currentLevelMoney;
				if (hh_nutaku) {
					stats.kobans += Math.ceil((EvoReq[girl.rarity][nbgrades - 1].tkobans - currentLevelKobans) / 6);
				}
				else {
					stats.kobans += EvoReq[girl.rarity][nbgrades - 1].tkobans - currentLevelKobans;
				}
			}

			var expToMax = (GIRLS_EXP_LEVELS[girl.rarity][Hero.infos.level - 2] - girl.Xp.cur);
			if (expToMax < 0) expToMax = 0;
			stats.xp += expToMax;
		}
	}

    /********************************************************************************************************************************************************
    *
    *
    */

    let counter = 0;
    let wheight = $(window).height();
    let wwidth = $(window).width();

     $('#harem_left').find('div[girl]').each( function(){
        let button = $(this).find('.collect_money')[0];
        if (button) {
            let style = window.getComputedStyle(button);
            if (style.display != 'none') {
                setTimeout(function() {
                    var e = jQuery.Event( "click" );
                    e.pageX = Math.floor((Math.random() * 44) + wwidth / 3);
                    e.pageY = Math.floor((Math.random() * 34) + wheight / 3);
                    e.offsetX = Math.floor((Math.random() * 54) + wwidth / 3);
                    e.offsetY = Math.floor((Math.random() * 44) + wheight / 3);
                    e.screenX = Math.floor((Math.random() * 54) + wwidth / 3);
                    e.screenY = Math.floor((Math.random() * 84) + wheight / 3);
                    e.clientX = Math.floor((Math.random() * 64) + wwidth / 3);
                    e.clientY = Math.floor((Math.random() * 54) + wheight / 3);
                    $(button).trigger(e);
                }, Math.floor((Math.random() * 95 + 152) * counter++));
            } else {
                counter += 0.1;
            }
        }
     });

	try {
		var lsMarket = JSON.parse(localStorage.getItem('lsMarket')),
			d = new Date(lsMarket.restock.time),
			RestockInfo;

		if (new Date() > lsMarket.restock.time || Hero.infos.level > lsMarket.restock.herolvl) {

			RestockInfo = '> The <a href="../shop.html">Market</a> restocked since your last visit.';
		}
		else {
			var	marketBookTxt = lsMarket.buyable.potion.Nb + ' ' + texts[lang].books + ' (' + nThousand(lsMarket.buyable.potion.Xp) + ' ' + texts[lang].Xp + ')',
				marketGiftTxt = lsMarket.buyable.gift.Nb + ' ' + texts[lang].gifts + ' (' + nThousand(lsMarket.buyable.gift.Xp) + ' ' + texts[lang].affection + ')';
			RestockInfo = '- ' + marketBookTxt + ' = ' + nThousand(lsMarket.buyable.potion.Value) + ' <span class="imgMoney"></span>'
				+ '<br />- ' + marketGiftTxt + ' = ' + nThousand(lsMarket.buyable.gift.Value) + ' <span class="imgMoney"></span>'
				+ '<br /><font style="color: gray;">' + texts[lang].restock + ': ' + d.toLocaleString() + ' (' + texts[lang].or_level + ' ' + (Hero.infos.level+1) + ')</font>';
		}

		var myArmorTxt = nThousand(lsMarket.stocks.armor.Nb) + (lsMarket.stocks.armor.Nb > 99 ? '+ ' : ' ') + ' ' + texts[lang].equipments,
			myBoosterTxt = nThousand(lsMarket.stocks.booster.Nb) + ' ' + texts[lang].boosters,
			myBookTxt = nThousand(lsMarket.stocks.potion.Nb) + ' ' + texts[lang].books + ' (' + nThousand(lsMarket.stocks.potion.Xp) + ' ' + texts[lang].Xp + ')',
			myGiftTxt = nThousand(lsMarket.stocks.gift.Nb) + ' ' + texts[lang].gifts + ' (' + nThousand(lsMarket.stocks.gift.Xp) + ' ' + texts[lang].affection + ')',
			MarketStocks = '- ' + myArmorTxt + ', ' + myBoosterTxt
		+ '<br />- ' + myBookTxt
		+ '<br />- ' + myGiftTxt
		+ '<span class="subTitle">' + texts[lang].currently_buyable + ':</span>'
		+ RestockInfo;
	} catch(e) {
		MarketStocks = (lsAvailable == 'yes') ? '> ' + texts[lang].visit_the : '> ' + texts[lang].not_compatible;
	}

	var StatsString = '<div class="StatsContent"><span class="Title">' + texts[lang].harem_stats + ':</span>' +
		'<span class="subTitle" style="margin-top: -10px;">' + stats.girls + ' ' + texts[lang].haremettes + ':</span>' +
		'- ' + stats.caracs[1] + ' ' + texts[lang].hardcore + ', ' + stats.caracs[2] + ' ' + texts[lang].charm + ', ' + stats.caracs[3] + ' ' + texts[lang].know_how + '<br />- '
	+ (stats.rarities.starting + stats.rarities.common) + ' ' + texts[lang].common + ', ' + stats.rarities.rare + ' ' + texts[lang].rare + ', ' + stats.rarities.epic + ' ' + texts[lang].epic + ', ' + stats.rarities.legendary + ' ' + texts[lang].legendary + ' <br />- '
	+ nThousand(parseInt(document.getElementsByClassName('focus_text')[0].innerHTML.replace(/\D/g, ''))) + '/' + nThousand(Hero.infos.level * stats.girls) + ' ' + texts[lang].harem_level + ' (' + nThousand(Hero.infos.level * stats.girls - parseInt(document.getElementsByClassName('focus_text')[0].innerHTML.replace(/\D/g, ''))) + ' ' + texts[lang].to_go + ')<br />- '
	+ stats.unlockedScenes + '/' + stats.allScenes + ' ' + texts[lang].unlocked_scenes + ' (' + nThousand(stats.allScenes - stats.unlockedScenes) + ' ' + texts[lang].to_go + ')'
	+ '<span class="subTitle">' + texts[lang].money_income + ':</span>'
	+ '~' + nThousand(stats.hourlyMoney) + ' <span class="imgMoney"></span> ' + texts[lang].per_hour
	+ '<br />' + nThousand(stats.allCollect) + ' <span class="imgMoney"></span> ' + texts[lang].when_all_collectable
	+ '<span class="subTitle">' + texts[lang].required_to_unlock + ':</span>'
	+ addPriceRow('', stats.affection, stats.money, stats.kobans)
	+ '<span class="subTitle">' + texts[lang].required_to_get_max_level + ':</span>'
	+ nThousand(stats.xp) + ' ' + texts[lang].Xp + ' (' + nThousand(stats.xp * 200) + ' <span class="imgMoney"></span>) <br />'
	+ '<span class="subTitle">' + texts[lang].my_stocks + ':</span>'
	+ MarketStocks
	+ '</div>';

	$('#harem_left').append('<div id="CustomBar">'
							+ '<img f="stats" src="https://i.postimg.cc/8cYj8QmP/icon-info.png">'
							+ '</div>'
							+ '<div id="TabsContainer">' + StatsString + '</div>');

	var TabsContainer = $('#TabsContainer');
	var Stats = TabsContainer.children('.StatsContent');

	$('body').click(function(e) {
		var clickOn = e.target.getAttribute('f');
		switch (clickOn) {
			case 'stats':
				toggleTabs(Stats);
				break;
			default:
				var clickedContainer = $(e.target).closest('[id]').attr('id');
				if (clickedContainer == 'TabsContainer') return;
				TabsContainer.fadeOut(400);
		}
	});

	function toggleTabs(tabIn) {
		if (TabsContainer.css('display') == 'block') {
			setTimeout(function() { tabIn.fadeIn(300); }, 205);
			TabsContainer.fadeOut(400);
		}
		else {
			tabIn.toggle(true);
			TabsContainer.fadeIn(400);
		}
	}

	function addPriceRow(rowName, affection, money, kobans) {
		return '<b>' + rowName + '</b> ' +
			nThousand(affection) + ' ' + texts[lang].affection + ' (' + nThousand(affection * 417) + ' <span class="imgMoney"></span>) ' + texts[lang].and + ' <br />' +
			nThousand(money) + ' <span class="imgMoney"></span> ' + texts[lang].or + ' ' +
			nThousand(kobans) + ' <span class="imgKobans"></span><br />';
	}

	function addPriceRowGirl(rowName, affection, money, kobans) {
		return '<b>' + rowName + ':</b> ' +
			nThousand(affection) + ' ' + texts[lang].affection + ' (' + nThousand(affection * 417) + ' <span class="imgMoney"></span>) ' + texts[lang].and + ' ' +
			nThousand(money) + ' <span class="imgMoney"></span> ' + texts[lang].or + ' ' +
			nThousand(kobans) + ' <span class="imgKobans"></span><br />';
	}

	$('.girls_list div[id_girl]').click(function() {
		updateInfo();
	});

	updateInfo();

	function updateInfo() {
		setTimeout(function () {
			haremRight.children('[girl]').each(function() {
				var girl = girlsDataList[$(this).attr('girl')];

				if (!girl.own) {
					if (HH_UNIVERSE == 'gay') {
						$(this).find('p').after('<div class="WikiLinkDialogbox"><a href="https://harem-battle.club/wiki/Gay-Harem/GH:' + girl.Name + '" target="_blank"> ' + girl.Name + texts[lang].wiki + ' </a></div>');
					}
					else if (lang == 'fr') {
						$(this).find('p').after('<div class="WikiLinkDialogbox"><a href="http://hentaiheroes.wikidot.com/' + girl.Name + '" target="_blank"> ' + texts[lang].wiki + girl.Name + ' </a></div>');
					}
					else {
						$(this).find('p').after('<div class="WikiLinkDialogbox"><a href="https://harem-battle.club/wiki/Harem-Heroes/HH:' + girl.Name + '" target="_blank"> ' + girl.Name + texts[lang].wiki + ' </a></div>');
					}
				}
				if (girl.own) {
					if (HH_UNIVERSE == 'gay') {
						$(this).find('h3').after('<div class="WikiLink"><a href="https://harem-battle.club/wiki/Gay-Harem/GH:' + girl.Name + '" target="_blank"> ' + girl.Name + texts[lang].wiki + ' </a></div>');
					}
					else if (lang == 'fr') {
						$(this).find('h3').after('<div class="WikiLink"><a href="http://hentaiheroes.wikidot.com/' + girl.Name + '" target="_blank"> ' + texts[lang].wiki + girl.Name + ' </a></div>');
					}
					else {
						$(this).find('h3').after('<div class="WikiLink"><a href="https://harem-battle.club/wiki/Harem-Heroes/HH:' + girl.Name + '" target="_blank"> ' + girl.Name + texts[lang].wiki + ' </a></div>');
					}
				}
				var j = 0,
					FirstLockedScene = 1,
					AffectionTT = texts[lang].evolution_costs + ':<br />',
					ScenesLink = '',
					girl_quests = $(this).find('.girl_quests');
				girl_quests.find('g').each(function() {

					j++;
					var aff = 0,
						money = 0,
						kobans = 0;
					var currentLevelMoney = 0,
						currentLevelKobans = 0;
					if (girl.graded != 0) {
						currentLevelMoney = EvoReq[girl.rarity][girl.graded - 1].tmoney;
						currentLevelKobans = EvoReq[girl.rarity][girl.graded - 1].tkobans;
					}
					if (girl.graded >= j) {
					}
					else if ((girl.graded + 1) == j && girl.Affection.level == j) {
						money = EvoReq[girl.rarity][j - 1].tmoney - currentLevelMoney;
						if (hh_nutaku) {
							kobans = Math.ceil((EvoReq[girl.rarity][j - 1].tkobans - currentLevelKobans) / 6);
						}
						else {
							kobans = EvoReq[girl.rarity][j - 1].tkobans - currentLevelKobans;
						}
					}
					else {
						aff = EvoReq[girl.rarity][j - 1].taffection - girl.Affection.cur;
						money = EvoReq[girl.rarity][j - 1].tmoney - currentLevelMoney;
						if (hh_nutaku) {
							kobans = Math.ceil((EvoReq[girl.rarity][j - 1].tkobans - currentLevelKobans) / 6);
						}
						else {
							kobans = EvoReq[girl.rarity][j - 1].tkobans - currentLevelKobans;
						}
					}
					AffectionTT += addPriceRowGirl(j + '</b><span class="imgStar"></span>', aff, money, kobans);
					ScenesLink += (ScenesLink === '') ? 'hh_scenes=' : ',';
					var SceneHref = $(this).parent().attr('href');
					if ($(this).hasClass('grey') || $(this).hasClass('green')) {
						if (FirstLockedScene === 0) {
							ScenesLink += '0';
						}
						else {
							FirstLockedScene = 0;
							var XpLeft = girl_quests.parent().parent().children('.girl_exp_left');
							var isUpgradable = girl_quests.parent().children('.green_text_button');
							ScenesLink += (isUpgradable.length) ? '0.' + isUpgradable.attr('href').substr(7) : '0';
						}
					}
					else {
						var attrHref = $(this).parent().attr('href');
						if (typeof attrHref != 'undefined') {
							ScenesLink += attrHref.substr(7);
						}
					}
				});

				girl_quests.children('a').each(function() {
					var attr = $(this).attr('href');
					if (typeof attr !== typeof undefined && attr !== false) {
						$(this).attr('href', attr + '?' + ScenesLink);
					}
				});
				ScenesLink = '';

				girl_quests.parent().children('h4').prepend('<span class="CustomTT"></span><div class="AffectionTooltip">' + AffectionTT + '</div>');

			});
		}, 50);
	}

	//CSS
	sheet.insertRule('#harem_left .HaremetteNb {'
		+ 'float: right; '
		+ 'line-height: 14px; '
		+ 'font-size: 12px;}'
	);

	sheet.insertRule('#CustomBar {'
		+ 'z-index: 99; '
		+ 'width: 100%; '
		+ 'padding: 3px 10px 0 3px; '
		+ 'font: bold 10px Tahoma, Helvetica, Arial, sans-serif; '
		+ 'position: absolute; bottom: 3px; left: 0px;}'
	);

	sheet.insertRule('#CustomBar img {'
		+ 'width: 20px; '
		+ 'height: 20px; '
		+ 'margin-right: 3px; '
		+ 'margin-bottom: 3px; '
		+ 'opacity: 0.5;}'
	);

	sheet.insertRule('#CustomBar img:hover {'
		+ 'opacity: 1; '
		+ 'cursor: pointer;}'
	);

	sheet.insertRule('#CustomBar .TopBottomLinks {'
		+ 'float: right; '
		+ 'margin-top: 2px;}'
	);

	sheet.insertRule('#CustomBar a, #TabsContainer a {'
		+ 'color: #008; '
		+ 'text-decoration: none;}'
	);

	sheet.insertRule('#harem_whole .WikiLink a {'
		+ 'color: #87CEFA; '
		+ 'text-decoration: none;}'
	);

	sheet.insertRule('#CustomBar a:hover, #TabsContainer a:hover, #harem_right .WikiLink a:hover {'
		+ 'color: #B14; '
		+ 'text-decoration: underline;}'
	);

	sheet.insertRule('#TabsContainer {'
		+ 'z-index: 99; '
		+ 'position: absolute; '
		+ 'bottom: 30px; '
		+ 'left: 12px; '
		+ 'box-sizing: content-box; '
		+ 'border: 1px solid rgb(156, 182, 213); '
		+ 'box-shadow: 1px -1px 1px 0px rgba(0,0,0,0.3); '
		+ 'font: normal 10px/16px Tahoma, Helvetica, Arial, sans-serif; '
		+ 'color: #000000; '
		+ 'background-color: #ffffff; '
		+ 'display: none;}'
	);

	sheet.insertRule('#TabsContainer > div {'
		+ 'padding: 1px 10px 8px 10px;}'
	);

	sheet.insertRule('#TabsContainer .Title {'
		+ 'margin-left: -5px; '
		+ 'font: bold 12px/22px Tahoma, Helvetica, Arial, sans-serif; '
		+ 'color: #B14;}'
	);

	sheet.insertRule('#TabsContainer .subTitle {'
		+ 'padding-top: 10px; '
		+ 'font-weight: bold; '
		+ 'display: block;}'
	);

	sheet.insertRule('#TabsContainer img {'
		+ 'width: 14px; '
		+ 'height: 14px; '
		+ 'vertical-align: text-bottom;}'
	);

	sheet.insertRule('.StatsContent, #TabsContainer span, #TabsContainer img, #TabsContainer a, #TabsContainer b, #TabsContainer br {'
		+ 'box-sizing: content-box;}'
	);

	sheet.insertRule('#harem_whole .CustomTT {'
		+ 'float: right; '
		+ 'margin-left: -25px; '
		+ 'margin-top: -5px; '
		+ 'background-image: url("https://i.postimg.cc/qBDt6yHV/icon-question.png"); '
		+ 'background-size: 18px 18px; '
		+ 'width: 18px; '
		+ 'height: 18px; '
		+ 'visibility: none;}'
	);

	sheet.insertRule('#harem_whole .CustomTT:hover {'
		+ 'cursor: help;}'
	);

	sheet.insertRule('#harem_whole .CustomTT:hover + div {'
		+ 'opacity: 1; '
		+ 'visibility: visible;}'
	);

	sheet.insertRule('#harem_whole .AffectionTooltip {'
		+ 'position: absolute; '
		+ 'z-index: 99; '
		+ 'margin: 20px 0 0 0; '
		+ 'display: block; overflow: auto; '
		+ 'border: 1px solid rgb(162, 195, 215); '
		+ 'border-radius: 8px; '
		+ 'box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1); '
		+ 'padding: 3px 7px 4px 7px; '
		+ 'background-color: #F2F2F2; '
		+ 'color: #1E90FF; '
		+ 'font: normal 9px/17px Tahoma, Helvetica, Arial, sans-serif; '
		+ 'text-align: left; '
		+ 'text-shadow: none; '
		+ 'opacity: 0; '
		+ 'visibility: hidden; '
		+ 'transition: opacity 400ms, visibility 400ms;}'
	);

	sheet.insertRule('#collect_all_container {'
		+ 'margin-top: 0px !important;}'
	);

	sheet.insertRule('#harem_whole .AffectionTooltip b {'
		+ 'font-weight: bold;}'
	);

	sheet.insertRule('#harem_whole .WikiLink {'
		+ 'font-size: 12px;}'
	);

	sheet.insertRule('#harem_whole .WikiLinkDialogbox a {'
		+ 'text-decoration: none; '
		+ 'color: #24a0ff !important;}'
	);

	sheet.insertRule('#harem_whole .imgStar, #harem_whole .imgMoney, #harem_whole .imgKobans, #haremwhole .imgStar, #harem_whole .imgMoney, #harem_whole .imgKobans {'
		+ 'background-size: 10px 10px; '
		+ 'background-repeat: no-repeat; '
		+ 'width: 10px; '
		+ 'height: 14px; '
		+ 'display: inline-block;}'
	);

	sheet.insertRule('#harem_whole .imgStar, #harem_left .imgStar {'
		+ 'background-image: url("https://i.postimg.cc/L6h1xv38/icon-star.png");}'
	);

	sheet.insertRule('#harem_whole .imgMoney, #harem_left .imgMoney {'
		+ 'background-image: url("https://i.postimg.cc/wv01VstN/icon-currency-ymen.png");}'
	);

	sheet.insertRule('#harem_whole .imgKobans, #harem_left .imgKobans {'
		+ 'background-image: url("https://i.postimg.cc/9fPRDkCJ/icon-currency-koban.png");}'
	);
}

/* ====================
	LEAGUE INFORMATION
   ==================== */

function moduleLeague() {
	var seasonEnds;
	var playersTotal;
	var challengesLeft;
	var challengesPossibleParse;
	var challengesPossibleMinutes;
	var challengesPossible;
	var playerCurrentParse;
	var playerCurrentPos;
	var playerCurrentPoints;
	var maxDemoteParse;
	var maxDemotePoints;
	var maxDemoteDiff;
	var maxDemoteDisplay;
	var textDemote;
	var maxStagnateParse;
	var maxStagnatePoints;
	var maxStagnateDiff;
	var maxStagnateDisplay;
	var textStagnate;

	challengesPossibleParse = $('div.bar-wrap div.over span:nth-child(3) span[rel=count]').text();
	if (challengesPossibleParse == '') {
		challengesPossibleMinutes = 0;
	}
	else if (challengesPossibleParse.indexOf('s') > -1) {
		if (challengesPossibleParse.indexOf('m') > -1) {
			challengesPossibleMinutes = 33;
		}
		else {
			challengesPossibleMinutes = 34;
		}
	}
	else {
		challengesPossibleMinutes = 34 - parseInt(challengesPossibleParse.match(/[+-]?\d+(?:\.\d+)?/g));
	}

	seasonEnds = $('div.league_end_in span[rel=timer]').text();
	if (seasonEnds.indexOf(texts[lang].day) > -1) {
		challengesPossibleMinutes += seasonEnds.match(/[+-]?\d+(?:\.\d+)?/g)[0] * 1440;
		if (seasonEnds.indexOf(texts[lang].hour) > -1) {
			challengesPossibleMinutes += seasonEnds.match(/[+-]?\d+(?:\.\d+)?/g)[1] * 60;
			if (seasonEnds.indexOf(texts[lang].minute) > -1) {
				challengesPossibleMinutes += seasonEnds.match(/[+-]?\d+(?:\.\d+)?/g)[2] * 1;
			}
		}
		else {
			if (seasonEnds.indexOf(texts[lang].minute) > -1) {
				challengesPossibleMinutes += seasonEnds.match(/[+-]?\d+(?:\.\d+)?/g)[1] * 1;
			}
		}
	}
	else if (seasonEnds.indexOf(texts[lang].day) === -1 && seasonEnds.indexOf(texts[lang].hour) > -1) {
		challengesPossibleMinutes += seasonEnds.match(/[+-]?\d+(?:\.\d+)?/g)[0] * 60;
		if (seasonEnds.indexOf(texts[lang].minute) > -1) {
			challengesPossibleMinutes += seasonEnds.match(/[+-]?\d+(?:\.\d+)?/g)[1] * 1;
		}
	}
	else {
		if (seasonEnds.indexOf(texts[lang].minute) > -1) {
			challengesPossibleMinutes += seasonEnds.match(/[+-]?\d+(?:\.\d+)?/g)[0] * 1;
		}
	}

	playersTotal = (' ' + $('div.leagues_table table tbody.leadTable').text() + ' ').split('/3').length; // splits string into 'number of opponents' + 1 parts
	challengesLeft = 3 * ((' ' + $('div.leagues_table table tbody.leadTable').text() + ' ').split('0/').length - 1) + 2 * ((' ' + $('div.leagues_table table tbody.leadTable').text() + ' ').split('1/').length - 1) + ((' ' + $('div.leagues_table table tbody.leadTable').text() + ' ').split('2/').length - 1);
	challengesPossible = Math.floor(challengesPossibleMinutes/35) + parseInt($('div.bar-wrap div.over span[energy]').text());

	playerCurrentParse = $('div.leagues_table table tr td:nth-child(4):contains(-)').parent().text();
	playerCurrentPos = parseInt(playerCurrentParse.trim().substr(0, 3).replace(/\D/g, ''));
	playerCurrentPoints = parseInt(playerCurrentParse.substr(playerCurrentParse.lastIndexOf('-') + 1).replace(/\D/g, ''));

	if (playerCurrentPos > (playersTotal - 15)) {
		maxDemoteParse = $('div.leagues_table table tr td:nth-child(1):contains(' + (playersTotal - 15) + ')').parent().text();
		maxDemotePoints = parseInt(maxDemoteParse.substr(maxDemoteParse.lastIndexOf('/3') + 2).replace(/\D/g, ''));
		maxDemoteDiff = maxDemotePoints - playerCurrentPoints;
		if (playerCurrentPoints == 0 && maxDemotePoints == 0) {
			maxDemoteDisplay = '±' + nThousand(maxDemoteDiff);
			textDemote = texts[lang].demote_holdzero;
		}
		else {
			maxDemoteDisplay = '+' + nThousand(maxDemoteDiff);
			textDemote = texts[lang].demote_up;
		}
	}
	else {
		maxDemoteParse = $('div.leagues_table table tr td:nth-child(1):contains(' + (playersTotal - 14) + ')').parent().text();
		maxDemotePoints = parseInt(maxDemoteParse.substr(maxDemoteParse.lastIndexOf('/3') + 2).replace(/\D/g, ''));
		maxDemoteDiff = maxDemotePoints - playerCurrentPoints;
		if (playerCurrentPoints == 0 && maxDemotePoints == 0) {
			maxDemoteDisplay = '±' + nThousand(maxDemoteDiff);
			textDemote = texts[lang].demote_holdzero;
		}
		else {
			if (maxDemoteDiff == 0) {
				maxDemoteDisplay = '-' + nThousand(maxDemoteDiff);
			}
			else {
				maxDemoteDisplay = nThousand(maxDemoteDiff);
			}
			textDemote = texts[lang].demote_down;
		}
	}

	if (playerCurrentPos > 15) {
		maxStagnateParse = $('div.leagues_table table tr td:nth-child(1):contains(\t15 )').parent().text() + $('div.leagues_table table tr td:nth-child(1):contains(\t15\t)').parent().text();
		maxStagnatePoints = parseInt(maxStagnateParse.substr(maxStagnateParse.lastIndexOf('/3') + 2).replace(/\D/g, ''));
		maxStagnateDiff = maxStagnatePoints - playerCurrentPoints;
		if (playerCurrentPoints == 0 && maxStagnatePoints == 0) {
			maxStagnateDisplay = '±' + nThousand(maxStagnateDiff);
			textStagnate = texts[lang].stagnate_holdzero;
		}
		else {
			maxStagnateDisplay = '+' + nThousand(maxStagnateDiff);
			textStagnate = texts[lang].stagnate_up;
		}
	}
	else {
		maxStagnateParse = $('div.leagues_table table tr td:nth-child(1):contains(\t16\t)').parent().text();
		maxStagnatePoints = parseInt(maxStagnateParse.substr(maxStagnateParse.lastIndexOf('/3') + 2).replace(/\D/g, ''));
		maxStagnateDiff = maxStagnatePoints - playerCurrentPoints;
		if (playerCurrentPoints == 0 && maxStagnatePoints == 0) {
			maxStagnateDisplay = '±' + nThousand(maxStagnateDiff);
			textStagnate = texts[lang].stagnate_holdzero;
		}
		else {
			if (maxStagnateDiff == 0) {
				maxStagnateDisplay = '-' + nThousand(maxStagnateDiff);
			}
			else {
				maxStagnateDisplay = nThousand(maxStagnateDiff);
			}
			textStagnate = texts[lang].stagnate_down;
		}
	}

	if (league_tag == 9) {
		$('div.league_end_in').append('<span class="scriptLeagueInfo">'
		+ '<span class="possibleChallenges"><img src="https://i.postimg.cc/ydVJcTNB/icon-bluesquare.png" style="margin-left: 10px; margin-bottom: 2px;"> ' + challengesPossible + '/' + challengesLeft
		+ '<span class="scriptLeagueInfoTooltip possibleChallengesTooltip">' + texts[lang].challenges_regen + challengesPossible + texts[lang].challenges_left + challengesLeft + '</span></span>'
		+ '<span class="maxDemote"><img src="https://i.postimg.cc/qqqzZMn5/icon-league-demote.png" style="margin-left: 10px; margin-bottom: 2px;"> ' + maxDemoteDisplay
		+ '<span class="scriptLeagueInfoTooltip maxDemoteTooltip">' + textDemote + nThousand(maxDemotePoints) + ' ' + texts[lang].points + '.</span></span>'
		+ '</span>');
	}
	else if (league_tag == 1) {
		$('div.league_end_in').append('<span class="scriptLeagueInfo">'
		+ '<span class="possibleChallenges"><img src="https://i.postimg.cc/ydVJcTNB/icon-bluesquare.png" style="margin-left: 10px; margin-bottom: 2px;"> ' + challengesPossible + '/' + challengesLeft
		+ '<span class="scriptLeagueInfoTooltip possibleChallengesTooltip">' + texts[lang].challenges_regen + challengesPossible + texts[lang].challenges_left + challengesLeft + '</span></span>'
		+ '<span class="maxStagnate"><img src="https://i.postimg.cc/HnkyDtG3/icon-league-hold.png" style="margin-left: 10px; margin-bottom: 2px;"> ' + maxStagnateDisplay
		+ '<span class="scriptLeagueInfoTooltip maxStagnateTooltip">' + textStagnate + nThousand(maxStagnatePoints) + ' ' + texts[lang].points + '.</span></span>'
		+ '</span>');
	}
	else {
		$('div.league_end_in').append('<span class="scriptLeagueInfo">'
		+ '<span class="possibleChallenges"><img src="https://i.postimg.cc/ydVJcTNB/icon-bluesquare.png" style="margin-left: 10px; margin-bottom: 2px;"> ' + challengesPossible + '/' + challengesLeft
		+ '<span class="scriptLeagueInfoTooltip possibleChallengesTooltip">' + texts[lang].challenges_regen + challengesPossible + texts[lang].challenges_left + challengesLeft + '</span></span>'
		+ '<span class="maxStagnate"><img src="https://i.postimg.cc/HnkyDtG3/icon-league-hold.png" style="margin-left: 10px; margin-bottom: 2px;"> ' + maxStagnateDisplay
		+ '<span class="scriptLeagueInfoTooltip maxStagnateTooltip">' + textStagnate + nThousand(maxStagnatePoints) + ' ' + texts[lang].points + '.</span></span>'
		+ '<span class="maxDemote"><img src="https://i.postimg.cc/qqqzZMn5/icon-league-demote.png" style="margin-left: 10px; margin-bottom: 2px;"> ' + maxDemoteDisplay
		+ '<span class="scriptLeagueInfoTooltip maxDemoteTooltip">' + textDemote + nThousand(maxDemotePoints) + ' ' + texts[lang].points + '.</span></span>'
		+ '</span>');
	}

	//CSS
	sheet.insertRule('.scriptLeagueInfo {'
		+ 'font-size: 13px; '
		+ 'display: block; '
		+ 'float: right; '
		+ 'margin-right: 10px;}'
	);

	sheet.insertRule('.scriptLeagueInfoTooltip {'
		+ 'visibility: hidden; '
		+ 'font-size: 12px; '
		+ 'background-color: black; '
		+ 'color: #fff; '
		+ 'text-align: center; '
		+ 'padding: 3px 5px 3px 5px; '
		+ 'border: 2px solid #905312; '
		+ 'border-radius: 6px; '
		+ 'background-color: rgba(32,3,7,.9); '
		+ 'position: absolute; '
		+ 'margin-top: 5px; '
		+ 'z-index: 9;}'
	);

	sheet.insertRule('.scriptLeagueInfoTooltip::after {'
		+ 'content: " "; '
		+ 'position: absolute; '
		+ 'bottom: 100%; '
		+ 'left: 50%; '
		+ 'margin-left: -10px; '
		+ 'border-width: 10px; '
		+ 'border-style: solid; '
		+ 'border-color: transparent transparent #905312 transparent;}'
	);

	sheet.insertRule('.kobanWinningsTooltip {'
		+ 'top: 65px; '
		+ 'margin-left: -95px;}'
	);

	sheet.insertRule('.kobanWinnings:hover .kobanWinningsTooltip {'
		+ 'visibility: visible;}'
	);

	sheet.insertRule('.possibleChallengesTooltip {'
		+ 'top: 65px; '
		+ 'margin-left: -110px;}'
	);

	sheet.insertRule('.possibleChallenges:hover .possibleChallengesTooltip {'
		+ 'visibility: visible;}'
	);

	sheet.insertRule('.maxStagnateTooltip {'
		+ 'max-width: 190px; '
		+ 'top: 65px; '
		+ 'margin-left: -115px;}'
	);

	sheet.insertRule('.maxStagnate:hover .maxStagnateTooltip {'
		+ 'visibility: visible;}'
	);

	sheet.insertRule('.maxDemoteTooltip {'
		+ 'max-width: 170px; '
		+ 'top: 65px; '
		+ 'margin-left: -100px;}'
	);

	sheet.insertRule('.maxDemote:hover .maxDemoteTooltip {'
		+ 'visibility: visible;}'
	);
}

/* ============
	LEAGUE SIM
   ============ */

function moduleSim() {
	var playerEgo;
	var playerEgoCheck;
	var playerDefHC;
	var playerDefKH;
	var playerDefCH;
	var playerAtk;
	var playerClass;
	var playerAlpha;
	var playerBeta;
	var playerOmega;
	var playerExcitement;
	var playerBetaAdd;
	var playerOmegaAdd;
	var opponentEgo;
	var opponentDefHC;
	var opponentDefKH;
	var opponentDefCH;
	var opponentAtk;
	var opponentClass;
	var opponentAlpha;
	var opponentBeta;
	var opponentOmega;
	var opponentExcitement;
	var opponentBetaAdd;
	var opponentOmegaAdd;
	var opponentProcHCBase;
	var opponentProcHCAddOrgasm1;
	var opponentProcHCAddOrgasm2;
	var opponentProcHCAddOrgasm3;
	var opponentProcCH;
	var opponentProcKH;
	var opponentAlphaClass;
	var playerDef;
	var opponentDef;
	var playerOrgasm;
	var playerOrgasmCount;
	var opponentOrgasm;
	var opponentOrgasmCount;
	var matchRating;

	function calculatePower() {
		// player stats
		playerEgo = Math.round(Hero.infos.caracs.ego);
		playerDefHC = Math.round(Hero.infos.caracs.def_carac1);
		playerDefCH = Math.round(Hero.infos.caracs.def_carac2);
		playerDefKH = Math.round(Hero.infos.caracs.def_carac3);
		playerAtk = Math.round(Hero.infos.caracs.damage);
		playerClass = $('div#leagues_left .icon').attr('carac');
		playerAlpha = JSON.parse($('div#leagues_left .girls_wrapper .team_girl[g=1]').attr('girl-tooltip-data'));
		playerBeta = JSON.parse($('div#leagues_left .girls_wrapper .team_girl[g=2]').attr('girl-tooltip-data'));
		playerOmega = JSON.parse($('div#leagues_left .girls_wrapper .team_girl[g=3]').attr('girl-tooltip-data'));
		playerExcitement = Math.round((playerAlpha.caracs.carac1 + playerAlpha.caracs.carac2 + playerAlpha.caracs.carac3) * 28);

		if (playerClass == 'class1') {
			playerBetaAdd = playerBeta.caracs.carac1;
			playerOmegaAdd = playerOmega.caracs.carac1;
		}
		if (playerClass == 'class2') {
			playerBetaAdd = playerBeta.caracs.carac2;
			playerOmegaAdd = playerOmega.caracs.carac2;
		}
		if (playerClass == 'class3') {
			playerBetaAdd = playerBeta.caracs.carac3;
			playerOmegaAdd = playerOmega.caracs.carac3;
		}

		// opponent stats
		opponentEgo = parseInt($('div#leagues_right div.lead_ego div:nth-child(2)').text().replace(/[^0-9]/gi, ''));

		opponentDefHC = $('div#leagues_right div.stats_wrap div:nth-child(2)').text();
		if (opponentDefHC.includes('.') || opponentDefHC.includes(',')) {
			opponentDefHC = parseInt(opponentDefHC.replace('K', '00').replace(/[^0-9]/gi, ''));
		}
		else {
			opponentDefHC = parseInt(opponentDefHC.replace('K', '000').replace(/[^0-9]/gi, ''));
		}

		opponentDefCH = $('div#leagues_right div.stats_wrap div:nth-child(4)').text();
		if (opponentDefCH.includes('.') || opponentDefCH.includes(',')) {
			opponentDefCH = parseInt(opponentDefCH.replace('K', '00').replace(/[^0-9]/gi, ''));
		}
		else {
			opponentDefCH = parseInt(opponentDefCH.replace('K', '000').replace(/[^0-9]/gi, ''));
		}

		opponentDefKH = $('div#leagues_right div.stats_wrap div:nth-child(6)').text();
		if (opponentDefKH.includes('.') || opponentDefKH.includes(',')) {
			opponentDefKH = parseInt(opponentDefKH.replace('K', '00').replace(/[^0-9]/gi, ''));
		}
		else {
			opponentDefKH = parseInt(opponentDefKH.replace('K', '000').replace(/[^0-9]/gi, ''));
		}

		opponentAtk = $('div#leagues_right div.stats_wrap div:nth-child(8)').text();
		if (opponentAtk.includes('.') || opponentAtk.includes(',')) {
			opponentAtk = parseInt(opponentAtk.replace('K', '00').replace(/[^0-9]/gi, ''));
		}
		else {
			opponentAtk = parseInt(opponentAtk.replace('K', '000').replace(/[^0-9]/gi, ''));
		}

		opponentClass = $('div#leagues_right .icon').attr('carac');
		opponentAlpha = JSON.parse($('div#leagues_right .girls_wrapper .team_girl[g=1]').attr('girl-tooltip-data'));
		opponentBeta = JSON.parse($('div#leagues_right .girls_wrapper .team_girl[g=2]').attr('girl-tooltip-data'));
		opponentOmega = JSON.parse($('div#leagues_right .girls_wrapper .team_girl[g=3]').attr('girl-tooltip-data'));
		opponentExcitement = Math.round((opponentAlpha.caracs.carac1 + opponentAlpha.caracs.carac2 + opponentAlpha.caracs.carac3) * 28);

		if (opponentClass == 'class1') {
			opponentBetaAdd = opponentBeta.caracs.carac1;
			opponentOmegaAdd = opponentOmega.caracs.carac1;
		}
		if (opponentClass == 'class2') {
			opponentBetaAdd = opponentBeta.caracs.carac2;
			opponentOmegaAdd = opponentOmega.caracs.carac2;
		}
		if (opponentClass == 'class3') {
			opponentBetaAdd = opponentBeta.caracs.carac3;
			opponentOmegaAdd = opponentOmega.caracs.carac3;
		}

		//Determine each side's actual defense
		if (playerClass == 'class1') {
			opponentDef = opponentDefHC;
		}
		if (playerClass == 'class2') {
			opponentDef = opponentDefCH;
		}
		if (playerClass == 'class3') {
			opponentDef = opponentDefKH;
		}

		if (opponentClass == 'class1') {
			playerDef = playerDefHC;
		}
		if (opponentClass == 'class2') {
			playerDef = playerDefCH;
		}
		if (opponentClass == 'class3') {
			playerDef = playerDefKH;
		}

		//Calculate opponent proc values, determine applicable alpha class and adjust starting ego values for proc
		opponentProcHCBase = Math.round(opponentAtk * 0.5);
		opponentProcHCAddOrgasm1 = Math.round(opponentAtk * 0.25);
		opponentProcHCAddOrgasm2 = Math.round(opponentBetaAdd * 1.3 * 0.75);
		opponentProcHCAddOrgasm3 = Math.round(opponentOmegaAdd * 1.3 * 0.75);
		opponentProcCH = opponentDef * 2;
		opponentProcKH = Math.round(opponentEgo * 0.1);
		opponentAlphaClass = opponentAlpha.class;

		if (opponentAlphaClass == '1') {
			playerEgo -= opponentProcHCBase;
		}
		if (opponentAlphaClass == '2') {
			opponentEgo += opponentProcCH;
		}
		if (opponentAlphaClass == '3') {
			opponentEgo += opponentProcKH;
		}

		//Log opponent name and starting egos for sim
		console.log('Simulation log for: ' + $('div#leagues_right div.player_block div.title').text());
		console.log('Starting Egos adjusted for worst-case proc scenario:');
		console.log('Player Ego: ' + playerEgo);
		console.log('Opponent Ego: ' + opponentEgo);

		playerOrgasm = 0;
		playerOrgasmCount = 0;
		opponentOrgasm = 0;
		opponentOrgasmCount = 0;

		function playerTurn() {
			//Orgasm
			if (playerOrgasm >= playerExcitement) {
				//Orgasm damage
				opponentEgo -= Math.round(playerAtk * 1.5 - opponentDef);
				playerOrgasmCount++;

				//Log results
				console.log('Round ' + (turns + 1) + ': Player orgasm! -' + Math.round(playerAtk * 1.5 - opponentDef));

				//Orgasm 1
				if (playerOrgasmCount == 1) {
					playerAtk += Math.round(playerBetaAdd * 1.3);
					opponentDef += Math.round(opponentBetaAdd * 1.75);
				}

				//Orgasm 2
				if (playerOrgasmCount == 2) {
					playerAtk += Math.round(playerOmegaAdd * 1.3);
					opponentDef += Math.round(opponentOmegaAdd * 1.75);
				}

				//Reset excitement value
				playerOrgasm = 0;
			}

			//No orgasm
			else {
				opponentEgo -= playerAtk - opponentDef;
				playerOrgasm += playerAtk * 2;
				console.log('Round ' + (turns + 1) + ': Player hit! -' + (playerAtk - opponentDef));
			}

			//Log results
			console.log('after Round ' + (turns + 1) + ': Opponent ego: ' + opponentEgo);
		}

		function opponentTurn() {
			//Orgasm
			if (opponentOrgasm >= opponentExcitement) {
				//Orgasm damage
				playerEgo -= Math.round(opponentAtk * 1.5 - playerDef);
				opponentOrgasmCount++;

				//Log results
				console.log('Round ' + (turns + 1) + ': Opponent orgasm! -' + Math.round(opponentAtk * 1.5 - playerDef));

				//Orgasm 1
				if (opponentOrgasmCount == 1) {
					opponentAtk += Math.round(opponentBetaAdd * 1.3);
					playerDef += Math.round(playerBetaAdd * 1.75);
					if (opponentAlphaClass == '1') {
						playerEgo -= opponentProcHCAddOrgasm1;
						console.log('Round ' + (turns + 1) + ': HC opponent possibility of Wild Burst on first orgasm! -' + opponentProcHCAddOrgasm1);
					}
				}

				//Orgasm 2
				if (opponentOrgasmCount == 2) {
					opponentAtk += Math.round(opponentOmegaAdd * 1.3);
					playerDef += Math.round(playerOmegaAdd * 1.75);
					if (opponentAlphaClass == '1') {
						playerEgo -= opponentProcHCAddOrgasm2;
						console.log('Round ' + (turns + 1) + ': HC opponent possibility of Wild Burst on second orgasm! -' + opponentProcHCAddOrgasm2);
					}
				}

				//Orgasm 3
				if (opponentOrgasmCount == 3) {
					if (opponentAlphaClass == '1') {
						playerEgo -= opponentProcHCAddOrgasm3;
						console.log('Round ' + (turns + 1) + ': HC opponent possibility of Wild Burst on third orgasm! -' + opponentProcHCAddOrgasm3);
					}
				}

				//Reset excitement value
				opponentOrgasm = 0;
			}

			//No orgasm
			else {
				playerEgo -= opponentAtk - playerDef;
				opponentOrgasm += opponentAtk * 2;
				console.log('Round ' + (turns + 1) + ': Opponent hit! -' + (opponentAtk - playerDef));
			}

			//Log results
			console.log('after Round ' + (turns + 1) + ': Player ego: ' + playerEgo);
		}

		//Simulate challenge
		for (var turns = 0; turns < 99; turns++) {
			if (playerEgo > 0) {
				playerTurn()
			}
			else {
				break
			}
			if (opponentEgo > 0) {
				opponentTurn()
			}
			else {
				//Check if victory is only a one-turn advantage
				playerEgoCheck = playerEgo;

				//Orgasm
				if (opponentOrgasm >= opponentExcitement) {
					playerEgoCheck -= Math.round(opponentAtk * 1.5 - playerDef);
					opponentOrgasmCount++;

					//Log results
					console.log('Round ' + (turns + 1) + ': Possibly next: Opponent orgasm! -' + Math.round(opponentAtk * 1.5 - playerDef));

					if (opponentAlphaClass == '1') {
						if (opponentOrgasmCount == 1) {
							playerEgoCheck -= opponentProcHCAddOrgasm1;
							console.log('Round ' + (turns + 1) + ': Possibly next: HC opponent possibility of Wild Burst on first orgasm! -' + opponentProcHCAddOrgasm1);
						}
						if (opponentOrgasmCount == 2) {
							playerEgoCheck -= opponentProcHCAddOrgasm2;
							console.log('Round ' + (turns + 1) + ': Possibly next: HC opponent possibility of Wild Burst on second orgasm! -' + opponentProcHCAddOrgasm2);
						}
						if (opponentOrgasmCount == 3) {
							playerEgoCheck -= opponentProcHCAddOrgasm3;
							console.log('Round ' + (turns + 1) + ': Possibly next: HC opponent possibility of Wild Burst on third orgasm! -' + opponentProcHCAddOrgasm3);
						}
					}
				}
				//No orgasm
				else {
					playerEgoCheck -= opponentAtk - playerDef;
					console.log('Round ' + (turns + 1) + ': Possibly next: Opponent hit! -' + (opponentAtk - playerDef));
				}

				if (playerEgoCheck <= 0) {
					console.log('Close call! After Round ' + (turns + 1) + ': Player ego: ' + playerEgoCheck);
				}
				break
			}
		}

		//Round defeated player's ego up to 0 to not skew results
		if (playerEgo < 0) {
			playerEgo = 0;
		}
		if (opponentEgo < 0) {
			opponentEgo = 0;
		}

		//Publish the ego difference as a match rating
		matchRating = playerEgo - opponentEgo;
		if (matchRating >= 0) {
			matchRating = '+' + nThousand(matchRating);

			if (playerEgoCheck <= 0) {
				$('div#leagues_right .lead_player_profile').append('<div class="matchRating close"><img id="powerLevelScouter" src="https://i.postimg.cc/3xvDTR6M/icon-sim-yellow.png">' + matchRating + '</div>');
			}
			else {
				$('div#leagues_right .lead_player_profile').append('<div class="matchRating plus"><img id="powerLevelScouter" src="https://i.postimg.cc/J0YB1BM8/icon-sim-green.png">' + matchRating + '</div>');
			}
		}
		else {
			matchRating = nThousand(matchRating);
			$('div#leagues_right .lead_player_profile').append('<div class="matchRating minus"><img id="powerLevelScouter" src="https://i.postimg.cc/8P3r9WZB/icon-sim-red.png">' + matchRating + '</div>');
		}

		//Replace opponent excitement with the correct value
		$('div#leagues_right div.stats_wrap div:nth-child(9) span:nth-child(2)').empty().append(nRounding(opponentExcitement, 0, 1));
	}

	calculatePower();

	//Replace player excitement with the correct value
	$('div#leagues_left div.stats_wrap div:nth-child(9) span:nth-child(2)').empty().append(nRounding(playerExcitement, 0, 1));

	// Refresh sim on new opponent selection (Credit: BenBrazke)
	var opntName;
	$('.leadTable').click(function() {
		opntName=''
	})
	function waitOpnt() {
		setTimeout(function() {
			if (JSON.parse($('div#leagues_right .girls_wrapper .team_girl[g=3]').attr('girl-tooltip-data'))) {
				sessionStorage.setItem('opntName', opntName);
				calculatePower();
			}
			else {
				waitOpnt()
			}
		}, 50);
	}
	var observeCallback = function() {
		var opntNameNew = $('div#leagues_right div.player_block div.title')[0].innerHTML
		if (opntName !== opntNameNew) {
			opntName = opntNameNew;
			waitOpnt();
		}
	}
	var observer = new MutationObserver(observeCallback);
	var test = document.getElementById('leagues_right');
	observer.observe(test, {attributes: false, childList: true, subtree: false});

	//CSS
	sheet.insertRule('#leagues_right .player_block .lead_player_profile .level_wrapper {'
		+ 'top: -8px !important;}'
	);

	sheet.insertRule('#leagues_right .player_block .lead_player_profile .icon {'
		+ 'top: 5px !important;}'
	);

	sheet.insertRule('.matchRating {'
		+ 'margin-top: -25px; '
		+ 'margin-left: 70px; '
		+ 'text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000; '
		+ 'line-height: 17px; '
		+ 'font-size: 14px;}'
	);

	sheet.insertRule('.plus {'
		+ 'color: #66CD00;}'
	);

	sheet.insertRule('.minus {'
		+ 'color: #FF2F2F;}'
	);

	sheet.insertRule('.close {'
		+ 'color: #FFA500;}'
	);

	sheet.insertRule('#powerLevelScouter {'
		+ 'margin-left: -8px; '
		+ 'margin-right: 1px; '
		+ 'width: 25px;}'
	);
}

/* =========================================
	CHAMPIONS INFORMATION (Credit: Entwine)
   ========================================= */

function moduleChampions() {
	if (sessionStorage.getItem('championsCallBack') && $('.page-shop').length) {
		const championsCallBack = JSON.parse(sessionStorage.getItem('championsCallBack'));
		$('#breadcrumbs .back').after('<span>&gt;</span><a class="back" href="/champions-map.html" >'
		+ $('nav [rel="content"] a[href="/champions-map.html"]').text().trim()
		+ '<span class="mapArrowBack_flat_icn"></span></a><span>&gt;</span><a class="back" href="'
		+ championsCallBack.location + '">'
		+ championsCallBack.name + '<span class="mapArrowBack_flat_icn"></span></a>');
		sessionStorage.removeItem('championsCallBack');
	}
	else if ($('.page-champions').length || $('.page-club_champion').length) {
		const DEFAULT_CHAMPIONS_DATA = '{"attempts": {}, "config" : {}, "positions" : {}, "statistics" : {}}';
		const personalKey = Hero.infos.id + '/' + championData.champion.id;
		let championsData = JSON.parse(localStorage.getItem('championsData') || DEFAULT_CHAMPIONS_DATA);
		let positions = championsData.positions[personalKey];
		let positions2 = championData.champion.poses;
		let statistics = championsData.statistics[championData.champion.id];
		let attempts = championsData.attempts[personalKey];
		let config = championsData.config[Hero.infos.id] || {};
		let isSkipButtonClicked;
		markMatchedPositions();
		showAdditionalInformation();
		showNumberOfTicketsWhileTeamResting();
		$('.page-champions')
		.on('click', '.champions-bottom__draft-box > button', () => {setTimeout(markMatchedPositions, 500)})
		.on('click', '.champions-bottom__confirm-team', showNumberOfTicketsWhileTeamResting)
		.on('click', '.champions-bottom__skip-champion-cooldown', () => {isSkipButtonClicked = true});
		$(window).on('beforeunload', () => {
			championsData = JSON.parse(localStorage.getItem('championsData') || DEFAULT_CHAMPIONS_DATA);
			championsData.positions[personalKey] = positions;
			championsData.attempts[personalKey] = attempts;
			championsData.statistics[championData.champion.id] = statistics;
			championsData.config[Hero.infos.id] = Object.keys(config).length? config : undefined;
			localStorage.setItem('championsData', JSON.stringify(championsData));
		});
		$(document).ajaxComplete(function(event, xhr, options) {
			const response = JSON.parse(xhr.responseText);
			if (response.positions) {
				if (!positions) {
					if (!statistics) {
						statistics = Array(positionImages.length).fill(0);
					}
					response.positions.forEach((e) => statistics[e]++);
					attempts = 0;
				}
				if (response.final.attacker_ego > 0 || response.final.winner.type == 'hero') {
					positions = undefined;
				}
				else {
					positions = response.positions;
				}
				attempts++;
			}
			else {
				markMatchedPositions();
			}
			if (isSkipButtonClicked) {
				showAdditionalInformation();
				isSkipButtonClicked = false;
			}
		});
		const restTimer = $('.champions-bottom__rest [timer], .champions-middle__champion-resting[timer]');
		if (restTimer.is(':visible')) {
			const delayTime = Math.ceil(restTimer.attr('timer') * 1000 - Date.now());
			setTimeout(markMatchedPositions, delayTime + 400);
		}

		function showAdditionalInformation() {
			if ($('.champions-middle__champion-resting').is(':visible') && positions) {
				positions = undefined;
			}
			if ($('#additionalInformation').is(':visible')) {
				return;
			}
			if (positions) {
				createCurrentPositionsInfo();
			}
			else if (statistics) {
				createStatisticsInfo();
			}
			if (positions || statistics) {
				configureInfoBox();
			}
		}

		function markMatchedPositions() {
			$('.girl-selection__girl-box').each(function(index) {
				const currentGirlsPose = $(this).find('.girl-box__pose');
				if (currentGirlsPose.next().size() === 0) {
					currentGirlsPose.parent().append('<span style="margin-left: 35px; filter: hue-rotate(-45deg);" />');
				}
				if (positions2) {
					if (currentGirlsPose.attr('src').indexOf(preparePositionImage(positions2[index % positions2.length])) >= 0) {
						currentGirlsPose.next().removeClass('empty');
						currentGirlsPose.next().addClass('green-tick-icon');
					}
					else if (positions2.some((e) => (preparePositionImage(e) === currentGirlsPose.attr('src')))) {
						currentGirlsPose.next().addClass('green-tick-icon empty');
					}
					else {
						currentGirlsPose.next().removeClass('green-tick-icon');
					}
				}
				else if (statistics) {
					currentGirlsPose.next().css({'filter': 'invert'});
					if (statistics.some((elem, idx) => (elem > 0 && preparePositionImage(idx) === currentGirlsPose.attr('src')))) {
						currentGirlsPose.next().addClass('green-tick-icon empty');
					}
					else {
						currentGirlsPose.next().removeClass('green-tick-icon');
					}
				}
			});
		}

		function showNumberOfTicketsWhileTeamResting() {
			if ($('.champions-bottom__ticket-amount').is(':visible') == false) {
				$('.champions-bottom__rest').css({'width': '280px'})
					.before('<div class="champions-bottom__ticket-amount"><span cur="ticket">x ' + championData.champion.currentTickets + '</span></div>');
			}
		}

		function preparePositionImage(positionID) {
			return IMAGES_URL + '/pictures/design/battle_positions/' + positionImages[positionID];
		}

		function createCurrentPositionsInfo() {
			let positionsBox = ('<div id="additionalInformation" style="position: absolute; top:' + (config.top || 165) + 'px; right:' + (config.right || -165)
			+ 'px;"><div style="border: 2px solid #ffa23e; background-color: rgba(60,20,30,.8); border-radius: 7px; width: max-content;">&nbsp;Current positions:<div>');
			positions.forEach((e) => {
				positionsBox += '<img style="height: 48px; width: 48px; cursor: pointer;" src="' + preparePositionImage(e) + '" hh_title="' + GT.figures[e]+ '">';
			});
			positionsBox += '</div>&nbsp;Current stage: ' + attempts + ' attempt' + (attempts == 1 ? '':'s') + '&nbsp;</div></div>';
			$('.champions-over__champion-wrapper').append(positionsBox);
		}

		function createStatisticsInfo() {
			let statisticsBox = ('<div id="additionalInformation" style="position: absolute; top:' + (config.top || 165) + 'px; right:' + (config.right || -165)
			+ 'px;"><div style="border: 2px solid #ffa23e; background-color: rgba(0,0,0,.8); border-radius: 7px; width: max-content;">&nbsp;Statistics:'
			+ '<div class="scroll-area" style="font-size: 14px; max-width: 208px;"><div>');
			let total = statistics.reduce((a, b) => a + b);
			let positionList = (statistics.map((elem, idx) => ({'index': idx, 'value': elem}))
			.filter((e) => e.index > 0 && e.value > 0)
			.sort((a, b) => (a.value == b.value)? a.index - b.index : b.value - a.value));
			positionList.forEach((p) => {
				statisticsBox += '<div style="display: inline-block; width: 52px; text-align: center;">'
				+ '<img style="height: 48px; width: 48px; margin-bottom: -6px; cursor: pointer;" src="'
				+ preparePositionImage(p.index) + '" hh_title="' + GT.figures[p.index] + '" ><span>'
				+ Math.round(p.value / total * 1000) / 10 + '%</span></div>';
			});
			statisticsBox += '</div></div>' + (attempts? ('&nbsp;Prev stage: ' + attempts + ' attempt' + (attempts == 1 ? '':'s') + '&nbsp;') : '') + '</div></div>';
			$('.champions-over__champion-wrapper').append(statisticsBox);
			$('.champions-over__champion-wrapper').find('.scroll-area > div').css({'width': positionList.length * 52 + 'px'});
			if (positionList.length > 4) {
				if (is_mobile_size()) {
					$('.champions-over__champion-wrapper').find('.scroll-area').css({'padding-bottom': '10px', 'margin-bottom': '-5px'});
				}
				else {
					$('.champions-over__champion-wrapper').find('.scroll-area').css({'padding-bottom': '', 'margin-bottom': '5px'});
				}
				$('.champions-over__champion-wrapper').find('.scroll-area').niceScroll().resize();
			}
		}

		function configureInfoBox() {
			$('.girl-box__draggable').droppable('option', 'accept', (e) => e.hasClass('girl-box__draggable'));
			$('#additionalInformation').on('click', '.eye', (e) => {
				config.visible = config.visible == undefined? false : undefined;
				$(e.currentTarget).next().toggle('slow');
				$(e.currentTarget).children().toggle('fast');
			}).draggable({
				cursor: 'move',
				start: function () {
					$(this).css({'right': ''});
				},
				drag: function (event, ui) {
					ui.position.top /= FullSize.scale;
					ui.position.left /= FullSize.scale;
				},
				stop: function (event, ui) {
					config.right = Math.round($(this).parent().width() - ui.position.left - $(this).width());
					config.top = Math.round(ui.position.top);
					$(this).css({'left': '', 'right': config.right + 'px'});
					$(event.originalEvent.target).one('click', (e) => e.stopImmediatePropagation());
				}
			}).prepend('<a class="eye" style="top: 3px; right: 3px; position: absolute; cursor: pointer;">'
			+ '<img src="https://hh2.hh-content.com/quest/ic_eyeclosed.svg" style="width: 30px; display: block;">'
			+ '<img src="https://hh2.hh-content.com/quest/ic_eyeopen.svg" style="width: 50px; display: none;">'
			+ '</div></a>');
			if (config.visible == false) {
				$('#additionalInformation .eye').children().toggle();
				$('#additionalInformation .eye').next().toggle();
			}
		}
	}
}