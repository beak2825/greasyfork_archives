// ==UserScript==
// @name			Hentai Heroes++ (OCD) Season version
// @namespace		https://sleazyfork.org/fr/scripts/415625-hentai-heroes-ocd-season-version
// @description		Adding things here and there in the Hentai Heroes game.
// @version			0.93.8
// @match           https://*.hentaiheroes.com/*
// @match           https://*.haremheroes.com/*
// @match           https://*.gayharem.com/*
// @match           https://*.comixharem.com/*
// @match           https://*.hornyheroes.com/*
// @match           https://*.pornstarharem.com/*
// @match           https://*.transpornstarharem.com/*
// @match           https://*.gaypornstarharem.com/*
// @match           https://*.mangarpg.com/*
// @run-at          document-idle
// @grant			none
// @author			Raphael, 1121, Sluimerstand, shal, Tom208, test_anon, 45026831(Numbers)
// @license			MIT
// @downloadURL https://update.greasyfork.org/scripts/415625/Hentai%20Heroes%2B%2B%20%28OCD%29%20Season%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/415625/Hentai%20Heroes%2B%2B%20%28OCD%29%20Season%20version.meta.js
// ==/UserScript==


/*	===========
	 CHANGELOG
	=========== */

// 0.93.8: Fixed a few things.
// 0.93.7: Added sub-menu for lust arena on home page. Added penta drill to hideClaimAllButton function. Fixed a few things.
// 0.93.6: Fixed minor issues.
// 0.93.5: Fixed a few things. Added an option to sort penta drill opponents by power.
// 0.93.4: Added highlight club members function in penta drill leaderboard. Changed boosters shortcut display on mobile.
// 0.93.3: Fixed an issue with league filter menu.
// 0.93.2: Fixed an issue in penta drill team edition. Added hide claimed rewards option for Penta Drill.
// 0.93.1: Fixed a bug in league filter.
// 0.93.0: Added new side story villain in HH. Fixed a minor issue in league filter menu display on mobile. 
// 0.92.9: Added an option to prevent the use of non legendary or mythic boosters. Added league filter options.
// 0.92.8: Added bar and shortcut for penta drill. Fixed a few things.
// 0.92.7: Fixed a few things.
// 0.92.6: Fixed a few things.
// 0.92.5: Added several colors for favorites league opponents. Fixed a few things.
// 0.92.4: Fixed a few things.
// 0.92.3: Added new rewards in villains menu.
// 0.92.2: Added new world and villain in GayPornstar Harem. Fixed a few things.
// 0.92.1: Fixed a few things after game update.
// 0.92.0: Fixed a few things.
// 0.91.9: Fixed an issue with girl class display in PoP. Fixed an issue with sim score sort in league.
// 0.91.8: Fixed an compatibility issue with the script Battle simulator v4
// 0.91.7: Fixed a few things.
// 0.91.6: Fixed a few things.
// 0.91.5: Fixed a few things.
// 0.91.4: Fixed a few things.
// 0.91.3: Fixed a bug on mobile.
// 0.91.2: Cleaned some code. Fixed a few things.
// 0.91.1: Added navigation on champion fight page. Fixed a few things.
// 0.91.0: Fixed a bug in league info.
// 0.90.9: Taken into account new game update.
// 0.90.8: Fixed a few things. Added new world and villain in Pornstar Harem.
// 0.90.7: Fixed a few things.
// 0.90.6: Fixed a few things. Changed position for raids on home screen with "Customized Home Screen" module.
// 0.90.5: Fixed minor things following the game update.
// 0.90.4: Fixed minor things.
// 0.90.3: Fixed a minor issue in raid.
// 0.90.2: Improved display for pass and pass+ in PoV and PoG. Increased opponents table display in league.
// 0.90.1: Improved a few things.
// 0.90.0: Fixed a few things.


/* =========
	GENERAL
   ========= */

// Define jQuery
var $ = window.jQuery;
if ($ == undefined) {
    console.log("Hentai Heroes++ (OCD) Season version WARNING: No jQuery found. Probably an error page. Ending the script here")
    return;
}

// Define CSS
var sheet = (() => {
    let style = document.createElement('style');
    document.head.appendChild(style);
    return style.sheet;
})();

var CurrentPage = window.location.pathname;
const testPage = (page) => CurrentPage.includes(page);
const testUniverse = (universe) => window.HH_UNIVERSE == universe;

const lvl_max_player = 1000;
const lvl_max_girl = 750;

//Change of time for the end of the league
//Next Thursday after change to DST at 12:00 UTC (14:00 Paris time) (02/04/2026)
const NonDSTtoDST_leagueTime = 1775131200;
//Next Thursday after change to non-DST at 11:00 UTC (12:00 Paris time) (29/10/2026)
const DSTtoNonDST_leagueTime = 1793271600;

/* ==============
	TRANSLATIONS
   ============== */

var texts = {
    en: {
        optionsVillain: 'Fight a villain menu',
        optionsTiers: 'Show tiers with available girls',
        optionsXPMoney : 'Better XP / Money',
        optionsMarket: 'Market information',
        optionsMarketRestockButton: 'Move the market "Restock" button',
        optionsFilterArmorItems: 'Filter market armors',
        optionsPreventBoostersUse: 'Prevent the use of boosters < legendary',
        optionsHarem: 'Harem information',
        optionsHaremFilters: 'Add some filters to the harem',
        optionsGirlsItemsFilter: 'Filter the girls equipments',
        optionsLeague: 'League information',
        optionsLeagueBoard: 'Show the league tops',
        optionsSimLeagueBoardFight: 'Show sim in the league table',
        optionsSimFight : 'League / Season / Villains sim',
        optionsTeamsFilter: 'Teams filter',
        optionsChampions: 'Champions information and quick navigation',
        optionsLinks: 'Shortcuts/Timers',
        optionsLabyrinth: 'Labyrinth information',
        optionsSeasonStats: 'Season stats',
        optionsPachinkoNames: 'Show names in Pachinko',
        optionsMissionsBackground: 'Change missions background',
        optionsCollectMoneyAnimation: 'Delete the collect money animation',
        optionsActivitiesTabChoice: 'Set Missions as main tab in Activities',
        optionsCustomizedHomeScreen: 'Customized home screen',
        optionsHideClaimedRewards: 'Hide claimed rewards',
        optionsDesktopDisplay: 'Desktop display mode on mobile',
        optionsHideClaimAllButtons: 'Hide "Claim All" button',
        optionsHideMultipleLeagueBattlesButton: 'Hide x15 button in league',
        optionsRemovePachinkoPopup: 'Remove the "no-girl" warning in Pachinko',
        optionsContestsExpiryTimer: 'Timer for contests rewards',
        optionsHideLeaguex3Button: 'Hide x3 button in league',
        optionsHideGradeUpgradeKobanButton: 'Hide girl\'s grade upgrade button in kobans',
        optionsLeagueBoostersStatus: 'Display opponents boosters status',
        optionsLeagueCompactDisplay: 'Display compact leagueboard',
        optionsSeasonFightsSort: 'Season fights sort',
        optionsHideIntroPictures: 'Hide pictures on login page',
        optionsDisplayLoveRaidsInfo: 'Add informations on Love Raids main page',
        optionsHideFinishedLoveRaids: 'Hide completed Love Raids',
        optionsPentaDrillSort: `${window.GT.design.penta_drill} opponents sort`,
        and: 'and',
        or: 'or',
        including: 'including',
        affection: 'affection',
        affections: 'affections',
        harem_stats: 'Harem Stats',
        haremettes: 'haremettes',
        hardcore: 'Hardcore',
        charm: 'Charm',
        know_how: 'Know-how',
        shagger: 'Shagger',
        lover: 'Lover',
        expert: 'Expert',
        Defense_against: 'Defense against ',
        specialist_in: 'specialist in ',
        harem_levels: 'harem levels',
        to_go: 'to go',
        unlocked_scenes: 'scenes unlocked',
        money_income: 'Money income',
        per_hour: 'per hour',
        when_all_collectable: 'when all collectable',
        required_to_unlock: 'Required to upgrade all haremettes',
        required_to_get_tier_max_level: 'Required to get all haremettes to the max level of their awakening level',
        required_to_get_max_level: 'Required to get all mythic and 5-star legendary haremettes to the level ' + lvl_max_girl,
        my_stocks: 'My stock',
        equipments: 'equipments',
        boosters: 'boosters',
        with_boosters: 'With boosters',
        no_boosters: 'No boosters',
        books: 'books',
        gifts: 'gifts',
        Equipments: 'Equipments',
        Boosters: 'Boosters',
        Books: 'Books',
        Gifts: 'Gifts',
        equipment: 'equipment',
        booster: 'booster',
        book: 'book',
        gift: 'gift',
        Equipment: 'Equipment',
        Booster: 'Booster',
        Book: 'Book',
        Gift: 'Gift',
        currently_buyable: 'Currently buyable stock',
        visit_the: 'Visit the <a href="' + transformNutakuURL('../shop.html') + '">Market</a> first.',
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
        mythic: 'Mythic',
        day: 'd',
        hour: 'h',
        minute: 'm',
        second: 's',
        demote_up: 'To <u>demote</u> you can have a maximum of ',
        demote_down: 'To <u>demote</u> you must be passed by players with as few as ',
        demote_holdzero: 'To <u>demote</u> you must remain at ',
        stagnate_up: 'To <u>not promote</u> you can have a maximum of ',
        stagnate_down: 'To <u>not promote</u> you must be passed by players with as few as ',
        stagnate_holdzero: 'To <u>not promote</u> you must remain at ',
        top4_up: 'To <u>be in the top 4</u> you must have a minimum of ',
        top4_hold: 'To <u>stay in the top 4</u> you must have a minimum of ',
        top15_up: 'To <u>be in the top 15</u> you must have a minimum of ',
        top15_hold: 'To <u>stay in the top 15</u> you must have a minimum of ',
        top30_up: 'To <u>be in the top 30</u> you must have a minimum of ',
        top30_hold: 'To <u>stay in the top 30</u> you must have a minimum of ',
        points: 'points',
        challenges_regen: 'Natural regeneration: ',
        challenges_left: '<BR>Challenges left: ',
        season_fights: 'Season fights: ',
        in: 'in',
        pop: 'Places',
        expeditions: 'Expeditions',
        season: 'Season',
        full_in: 'Full in',
        ends_at: 'Ends at',
        full: 'Full',
        league: 'League',
        boosters_end: 'Boosters end',
        victories: 'Victories',
        defeats: 'Defeats',
        unknown: 'Unknown',
        opponents: 'Opponents',
        notPlayed: 'Not played',
        leaguePoints: 'Points',
        avg: 'Average',
        league_ending: 'League ending on ',
        league_finished: 'League finished on ',
        current_league: 'Current league',
        averageScore: 'Average score per fight: ',
        scoreExpected: 'Score expected: ',
        available_girls: 'Available girls: ',
        fights: 'Fights',
        won_mojo: 'Won mojo',
        lost_mojo: 'Lost mojo',
        won_mojo_avg: 'Won mojo average',
        lost_mojo_avg: 'Lost mojo average',
        mojo_avg: 'Global mojo average',
        filter: 'Filter',
        searched_name : 'Searched name',
        girl_name: 'Girl name',
        searched_class: 'Searched class',
        searched_rarity: 'Searched rarity',
        team_number: 'Team number',
        all: 'All',
        team: 'Team',
        teams: 'Teams',
        save_as: 'Save as',
        load_from: 'Load from',
        level_range: 'Level range',
        searched_aff_category: 'Searched affection category',
        searched_aff_lvl: 'Searched affection <BR>level',
        aff_lvl: 'Affection level',
        zero_star: '0 star',
        one_star: '1 star',
        two_stars: '2 stars',
        three_stars: '3 stars',
        four_stars: '4 stars',
        five_stars: '5 stars',
        six_stars: '6 stars',
        time_passed: 'time has passed',
        combativity: 'Combativity',
        energy: 'Energy',
        sort: 'Sort',
        hide: 'Hide',
        display: 'Display',
        searched_blessed_attributes: 'Searched blessed girls',
        blessed_attributes: 'Blessed girls',
        non_blessed_attributes: 'Non-blessed girls',
        pantheon: 'Pantheon\'s Stairway',
        searched_element: 'Searched Element',
        element: 'Element',
        dominatrix: 'Dominatrix',
        submissive: 'Submissive',
        voyeur: 'Voyeur',
        eccentric: 'Eccentric',
        exhibitionist: 'Exhibitionist',
        physical: 'Physical',
        playful: 'Playful',
        sensual: 'Sensual',
        clubChampDuration: '{{duration}} since round start',
        searched_pose: 'Searched Pose',
        visit_teams: 'Visit <a href="' + transformNutakuURL('../teams.html') + '">Teams</a> first.',
        next: 'Next',
        Side_quests : 'Side quests',
        Club_champion: 'Club champion',
        Current_positions: 'Current positions',
        Current_stage: 'Current stage',
        Statistics: 'Statistics',
        Prev_stage: 'Prev stage',
        attempt: 'attempt',
        attempts: 'attempts',
        Gems_in_stock: 'Gems in stock',
        missing_gems: 'Missing gems to maximize each mythic or legendary 5-star girl',
        date_on: 'on',
        skilledGirls: 'Skilled Girls',
        last_season: 'Last Season',
        champion_girl_pose: 'Champion\'s girl pose',
        none_f: 'None',
        none_m: 'None',
        with: 'With',
        tier5_skill_filter: 'Tier 5 skill',
        already_fought: 'Already fought',
        new_girl_in: 'New girl in:',
        trollsMessage: '<a href="' + transformNutakuURL('../adventures.html') + '">Select main adventure to display worlds and villains shortcuts</a>',
        labyrinthGirlsTxt: 'The opposing team is based on these girls',
        zodiac: {1: '♈︎ Aries',
            2: '♉︎ Taurus',
            3: '♊︎ Gemini',
            4: '♋︎ Cancer',
            5: '♌︎ Leo',
            6: '♍︎ Virgo',
            7: '♎︎ Libra',
            8: '♏︎ Scorpio',
            9: '♐︎ Sagittarius',
            10: '♑︎ Capricorn',
            11: '♒︎ Aquarius',
            12: '♓︎ Pisces'
        },
        color: {'F99': 'Pink',
            'B06': 'Dark Pink',
            'F00': 'Red',
            'B62': 'Dark blond',
            'FFF': 'White',
            '321': 'Dark',
            '00F': 'Blue',
            'FF0': 'Blond',
            '0F0': 'Green',
            'XXX': 'Unknown',
            'A55': 'Brown',
            '000': 'Black',
            'CCC': 'Silver',
            'F0F': 'Purple',
            'F90': 'Orange',
            'EB8': 'Strawberry blonde',
            '888': 'Grey',
            'FD0': 'Golden',
            'D83': 'Bronze',
            '765': 'Ash brown',
        },
    },

    fr: {
        optionsVillain: 'Menu des combats des trolls',
        optionsTiers: 'Montrer les paliers avec filles disponibles',
        optionsXPMoney : 'XP / Argent + précis',
        optionsMarket: 'Infos marché',
        optionsMarketRestockButton: 'Déplacer le bouton "Remplir" du marché',
        optionsFilterArmorItems: 'Filtrer les équipements du marché',
        optionsPreventBoostersUse: 'Empêcher l\'utilisation de boosters < légendaires',
        optionsHarem: 'Infos harem',
        optionsHaremFilters: 'Ajouter des filtres dans le harem',
        optionsGirlsItemsFilter: 'Filtrer les équipements des filles',
        optionsLeague: 'Infos ligue',
        optionsLeagueBoard: 'Montrer les tops ligue',
        optionsSimLeagueBoardFight: 'Afficher simu dans le classement de ligue',
        optionsSimFight: 'Simu ligue / saison / combats de troll',
        optionsTeamsFilter: 'Filtre d\'équipes',
        optionsChampions: 'Infos + raccourcis champions',
        optionsLinks: 'Raccourcis/Timers',
        optionsLabyrinth: 'Infos labyrinthe',
        optionsSeasonStats: 'Stats de la saison',
        optionsPachinkoNames: 'Montrer les noms au Pachinko',
        optionsMissionsBackground: 'Change l\'arrière-plan des missions',
        optionsCollectMoneyAnimation: 'Désactive l\'animation de récolte d\'argent',
        optionsActivitiesTabChoice: 'Définir l\'onglet principal Missions dans Activités',
        optionsCustomizedHomeScreen: 'Ecran principal personnalisé',
        optionsHideClaimedRewards: 'Masquer les récompenses réclamées',
        optionsDesktopDisplay: 'Mode d\'affichage PC sur mobile',
        optionsHideClaimAllButtons: 'Masquer le bouton "Tout réclamer"',
        optionsHideMultipleLeagueBattlesButton: 'Masquer le bouton x15 dans la ligue',
        optionsRemovePachinkoPopup: 'Supprimer la fenêtre "pas de fille" au Pachinko',
        optionsContestsExpiryTimer: 'Timer pour les récompenses des compét',
        optionsHideLeaguex3Button: 'Masquer le bouton x3 dans la ligue',
        optionsHideGradeUpgradeKobanButton: 'Masquer l\'amélioration d\'affection en kobans',
        optionsLeagueBoostersStatus: 'Afficher l\'état des boosters adverses',
        optionsLeagueCompactDisplay: 'Affichage compact du classement de ligue',
        optionsSeasonFightsSort: 'Tri des combats de saison',
        optionsHideIntroPictures: 'Masquer les images sur la page de connexion',
        optionsDisplayLoveRaidsInfo: 'Ajouter des infos sur les raids de l\'amour',
        optionsHideFinishedLoveRaids: 'Masquer les raids de l\'amour achevés',
        optionsPentaDrillSort: `Tri des adversaires ${window.GT.design.penta_drill}`,
        and: 'et',
        or: 'ou',
        including: 'dont',
        affection: 'affection',
        harem_stats: 'Stats du harem',
        haremettes: 'haremettes',
        hardcore: 'Hardcore',
        charm: 'Charme',
        know_how: 'Savoir-faire',
        shagger: 'Niqueur',
        lover: 'Romantique',
        expert: 'Expert',
        Defense_against: 'Défense contre les ',
        specialist_in: 'spécialiste du ',
        harem_levels: 'niveaux de harem',
        to_go: 'restant',
        unlocked_scenes: 'scènes débloquées',
        money_income: 'Revenus',
        per_hour: 'par heure',
        when_all_collectable: 'quand tout est disponible',
        required_to_unlock: 'Requis pour débloquer toutes les scènes',
        required_to_get_tier_max_level: 'Requis pour obtenir toutes les filles au niveau max de leur palier d\'éveil',
        required_to_get_max_level: 'Requis pour obtenir toutes les filles mythiques et légendaires 5 étoiles au niveau ' + lvl_max_girl,
        my_stocks: 'Mes stocks',
        equipments: 'équipements',
        boosters: 'boosters',
        with_boosters: 'Avec boosters',
        no_boosters: 'Sans booster',
        books: 'livres',
        gifts: 'cadeaux',
        Equipments: 'Equipements',
        Boosters: 'Boosters',
        Books: 'Livres',
        Gifts: 'Cadeaux',
        equipment: 'équipement',
        booster: 'booster',
        book: 'livre',
        gift: 'cadeau',
        Equipment: 'Equipement',
        Booster: 'Booster',
        Book: 'Livre',
        Gift: 'Cadeau',
        currently_buyable: 'Stock disponible au marché',
        visit_the: 'Visite le <a href="' + transformNutakuURL('../shop.html') + '">marché</a> first.',
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
        mythic: 'Mythique',
        day: 'j',
        hour: 'h',
        minute: 'm',
        second: 's',
        demote_up: 'Pour <u>être rétrogradé</u> vous pouvez avoir un maximum de ',
        demote_down: 'Pour <u>être rétrogradé</u> vous devez être dépassé par les joueurs qui ont ',
        demote_holdzero: 'Pour <u>être rétrogradé</u> vous devez rester avec ',
        stagnate_up: 'Pour <u>ne pas être promu</u> vous pouvez avoir un maximum de ',
        stagnate_down: 'Pour <u>ne pas être promu</u> vous devez être dépassé par les joueurs qui ont ',
        stagnate_holdzero: 'Pour <u>ne pas être promu</u> vous devez rester avec ',
        top4_up: 'Pour <u>être dans le top 4</u> vous devez avoir un minimum de ',
        top4_hold: 'Pour <u>rester dans le top 4</u> vous devez avoir un minimum de ',
        top15_up: 'Pour <u>être dans le top 15</u> vous devez avoir un minimum de ',
        top15_hold: 'Pour <u>rester dans le top 15</u> vous devez avoir un minimum de ',
        top30_up: 'Pour <u>être dans le top 30</u> vous devez avoir un minimum de ',
        top30_hold: 'Pour <u>rester dans le top 30</u> vous devez avoir un minimum de ',
        points: 'points',
        challenges_regen: 'Régénération naturelle: ',
        challenges_left: '<BR>Défis restants: ',
        season_fights: 'Combats de Saison: ',
        in: 'dans',
        pop: 'Lieux',
        expeditions: 'Expéditions',
        season: 'Saison',
        full_in: 'Remplie dans',
        ends_at: 'Fin à',
        full: 'Remplie',
        league: 'Ligue',
        boosters_end: 'Fin boosters',
        victories: 'Victoires',
        defeats: 'Defaites',
        unknown: 'Inconnus',
        opponents: 'Adversaires',
        notPlayed: 'Non joués',
        leaguePoints: 'Points',
        avg: 'Moyenne',
        league_ending: 'Ligue terminant le ',
        league_finished: 'Ligue terminée le ',
        current_league: 'Ligue actuelle',
        averageScore: 'Score moyen par combat: ',
        scoreExpected: 'Score attendu: ',
        available_girls: 'Filles disponibles: ',
        fights: 'Combats',
        won_mojo: 'Mojo gagnés',
        lost_mojo: 'Mojo perdus',
        won_mojo_avg: 'Moyenne mojo gagnés',
        lost_mojo_avg: 'Moyenne mojo perdus',
        mojo_avg: 'Moyenne mojo globale',
        filter: 'Filtre',
        searched_name : 'Nom recherché',
        girl_name: 'Nom de la fille',
        searched_class: 'Classe recherchée',
        searched_rarity: 'Rareté recherchée',
        team_number: 'Équipe #',
        all: 'Toutes',
        team: 'Équipe',
        teams: 'Équipes',
        save_as: 'Sauver sous',
        load_from: 'Charger',
        level_range: 'Intervalle de niveaux',
        searched_aff_category: 'Catégorie d\'affection recherchée',
        searched_aff_lvl: 'Niveau d\'affection recherché',
        aff_lvl: 'Niveau d\'affection',
        zero_star: '0 étoile',
        one_star: '1 étoile',
        two_stars: '2 étoiles',
        three_stars: '3 étoiles',
        four_stars: '4 étoiles',
        five_stars: '5 étoiles',
        six_stars: '6 étoiles',
        time_passed: 'du temps a passé',
        combativity: 'Combativité',
        energy: 'Énergie',
        sort: 'Trier',
        hide: 'Masquer',
        display: 'Afficher',
        searched_blessed_attributes: 'Filles bénies recherchées',
        blessed_attributes: 'Filles bénies',
        non_blessed_attributes: 'Filles non bénies',
        pantheon: 'Escaliers du Panthéon',
        searched_element : 'Element recherché',
        element: 'Element',
        dominatrix: 'Dominatrice',
        submissive: 'Soumise',
        voyeur: 'Voyeuse',
        eccentric: 'Excentrique',
        exhibitionist: 'Exhibitioniste',
        physical: 'Physique',
        playful: 'Joueuse',
        sensual: 'Sensuelle',
        clubChampDuration: '{{duration}} depuis le début du tour',
        searched_pose: 'Pose recherchée',
        visit_teams: 'Visiter d\'abord <a href="' + transformNutakuURL('../teams.html') + '">les équipes</a>.',
        next: 'Suiv.',
        Side_quests : 'Quêtes secondaires',
        Club_champion: 'Champion de club',
        Current_positions: 'Positions actuelles',
        Current_stage: 'Niveau actuel',
        Statistics: 'Statistiques',
        Prev_stage: 'Niveau précédent',
        attempt: 'essai',
        attempts: 'essais',
        Gems_in_stock: 'Gemmes en stock',
        missing_gems: 'Gemmes manquantes pour maxer chaque fille mythique ou légendaire 5 étoiles',
        date_on: 'le',
        skilledGirls: 'Filles avec compétences',
        last_season: 'Saison précédente',
        champion_girl_pose: 'Position de la fille du champion',
        none_f: 'Aucune',
        none_m: 'Aucun',
        with: 'Avec',
        tier5_skill_filter: 'Compétences palier 5',
        already_fought: 'Déjà combattus',
        new_girl_in: 'Nouvelle fille dans :',
        trollsMessage: '<a href="' + transformNutakuURL('../adventures.html') + '">Sélectionner l\'aventure principale pour afficher les raccourcis des mondes et des trolls</a>',
        labyrinthGirlsTxt: 'L\'équipe adverse est basée sur ces filles',
        zodiac: {1: '♈︎ Bélier',
            2: '♉︎ Taureau',
            3: '♊︎ Gémeaux',
            4: '♋︎ Cancer',
            5: '♌︎ Lion',
            6: '♍︎ Vierge',
            7: '♎︎ Balance',
            8: '♏︎ Scorpion',
            9: '♐︎ Sagittaire',
            10: '♑︎ Capricorne',
            11: '♒︎ Verseau',
            12: '♓︎ Poissons'
        },
        color: {'F99': 'Rose',
            'B06': 'Rose sombre',
            'F00': 'Rouge',
            'B62': 'Châtain',
            'FFF': 'Blanc',
            '321': 'Brun',
            '00F': 'Bleu',
            'FF0': 'Blond',
            '0F0': 'Vert',
            'XXX': 'Inconnu',
            'A55': 'Marron',
            '000': 'Noir',
            'CCC': 'Argent',
            'F0F': 'Violet',
            'F90': 'Orange',
            'EB8': 'Blond vénitien',
            '888': 'Gris',
            'FD0': 'Doré',
            'D83': 'Bronze',
            '765': 'Brun cendré',
        },
    },

    es: {
        optionsVillain: 'Menu Pelear contra villano',
        optionsTiers: 'Mostrar gradas con chicas disponibles',
        optionsXPMoney : 'Mejor XP / Dinero',
        optionsMarket: 'Informacion de Mercado',
        optionsMarketRestockButton: 'Mover el botón "Reponer" del mercado',
        optionsFilterArmorItems: 'Filtrar armaduras del mercado',
        optionsPreventBoostersUse: 'Evitar el uso de potenciadores < legendarios',
        optionsHarem: 'Informacion de Harén',
        optionsHaremFilters: 'Añadir filtros al harén',
        optionsGirlsItemsFilter: 'Filtrar los equipos de chicas',
        optionsLeague: 'Informacion de Liga',
        optionsLeagueBoard: 'Mostrar los mejores de la liga',
        optionsSimLeagueBoardFight: 'Mostrar simulacion en la clasificación de liga',
        optionsSimFight: 'Simulacion de Liga / Temporada / Villano',
        optionsTeamsFilter: 'Filtro de equipos',
        optionsChampions: 'Informacion + atajos para campeones',
        optionsLinks: 'Atajos/Temporizadores',
        optionsLabyrinth: 'Información del laberinto',
        optionsSeasonStats: 'Season stats',
        optionsPachinkoNames: 'Mostrar nombres en Pachinko',
        optionsMissionsBackground: 'Cambiar el fondo de las misiones',
        optionsCollectMoneyAnimation: 'Desactivar la animación de recogida de dinero',
        optionsActivitiesTabChoice: 'Establecer misiones como pestaña principal en Actividades',
        optionsCustomizedHomeScreen: 'Pantalla de inicio personalizada',
        optionsHideClaimedRewards: 'Ocultar las recompensas reclamadas',
        optionsDesktopDisplay: 'Modo de visualización PC a móvil',
        optionsHideClaimAllButtons: 'Ocultar el botón "Reclamar todo"',
        optionsHideMultipleLeagueBattlesButton: 'Ocultar el botón x15 en liga',
        optionsRemovePachinkoPopup: 'Eliminar la ventana de "no chica" en Pachinko',
        optionsContestsExpiryTimer: 'Temporizador para recompensas de competitiones',
        optionsHideLeaguex3Button: 'Ocultar el botón x3 en liga',
        optionsHideGradeUpgradeKobanButton: 'Ocultar el botón de subita de afecto en kobans',
        optionsLeagueBoostersStatus: 'Visualizar el estado de los potenciadores de los adversarios',
        optionsLeagueCompactDisplay: 'Visualizar la tabla de ligas compactas',
        optionsSeasonFightsSort: 'Clasificando las peleas de la temporada',
        optionsHideIntroPictures: 'Ocultar imágenes en la página de login',
        optionsDisplayLoveRaidsInfo: 'Añadir información a la página principal de Incursión del Amor',
        optionsHideFinishedLoveRaids: 'Ocultación completada Incursión del Amor',
        optionsPentaDrillSort: `Clasificación de los adversarios ${window.GT.design.penta_drill}`,
        and: 'y',
        or: 'o',
        in: 'en',
        including: 'incluido',
        affection: 'afecto',
        harem_stats: 'Estatus del Harén',
        haremettes: 'haremettes',
        hardcore: 'Folladas',
        charm: 'Encanto',
        know_how: 'Saber-hacer',
        shagger: 'Follador',
        lover: 'Amante',
        expert: 'Experto',
        Defense_against: 'Defensa contra ',
        specialist_in: 'especialista en ',
        harem_levels: 'niveles de harén',
        to_go: 'restante',
        unlocked_scenes: 'escenas desbloqueadas',
        money_income: 'Ingreso de dinero',
        per_hour: 'por hora',
        when_all_collectable: 'cuando todo es coleccionable',
        required_to_unlock: 'Requerido para desbloquear todas las escenas bloqueadas',
        required_to_get_tier_max_level: 'Requerido para obtener todas las chicas al máximo nivel de su despertar nivel',
        required_to_get_max_level: 'Requerido para obtener todas las chicas míticas y legendarias de 5 estrellas al nivel ' + lvl_max_girl,
        my_stocks: 'Mi Stock',
        equipments: 'equipos',
        boosters: 'potenciadores',
        with_boosters: 'Con potenciadores',
        no_boosters: 'Sin potenciadores',
        books: 'libros',
        gifts: 'regalos',
        Equipments: 'Equipos',
        Boosters: 'Potenciadores',
        Books: 'Libros',
        Gifts: 'Regalos',
        equipment: 'equipo',
        booster: 'potenciador',
        book: 'libro',
        gift: 'regalo',
        Equipment: 'Equipo',
        Booster: 'Potenciador',
        Book: 'Libro',
        Gift: 'Regalo',
        currently_buyable: 'Stocks Comprables Actualmente',
        visit_the: 'Visita el <a href="' + transformNutakuURL('../shop.html') + '">Mercado</a> primero.',
        not_compatible: 'Tu navegador no es compatible.',
        or_level: 'o nivel',
        restock: 'Restock',
        wiki: 'Página wiki de ',
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
        mythic: 'Mítica',
        day: 'd',
        hour: 'h',
        minute: 'm',
        second: 's',
        demote_up: 'Para <u>degradar</u> puedes tener un máximo de ',
        demote_down: 'Para <u>degradar</u> debes ser superado por jugadores con tan solo ',
        demote_holdzero: 'Para <u>degradar</u> debes mantenerte en ',
        stagnate_up: 'Para <u>no promocionar</u> puedes tener un máximo de ',
        stagnate_down: 'Para <u>no promocionar</u> debes ser superado por jugadores con tan solo ',
        stagnate_holdzero: 'Para <u>no promocionar</u> debes mantenerte en ',
        top4_up: 'Para <u>estar entre los 4 primeros</u> debes tener un mínimo de  ',
        top4_hold: 'Para <u>quedar entre los 4 primeros</u> debes tener un mínimo de  ',
        top15_up: 'Para <u>estar entre los 15 primeros</u> debes tener un mínimo de  ',
        top15_hold: 'Para <u>quedar entre los 15 primeros</u> debes tener un mínimo de  ',
        top30_up: 'Para <u>estar entre los 30 primeros</u> debes tener un mínimo de  ',
        top30_hold: 'Para <u>quedar entre los 30 primeros</u> debes tener un mínimo de  ',
        points: 'puntos',
        challenges_regen: 'Regeneracion naturel: ',
        challenges_left: '<BR>Retos pendientes: ',
        pop: 'Lugares',
        season: 'Temporada',
        full_in: 'Completa',
        ends_at: 'Fin a las',
        full: 'Completa',
        league: 'Liga',
        boosters_end: 'Fin potenc.',
        victories: 'Victorias',
        defeats: 'Derrota',
        unknown: 'Desconocido',
        opponents: 'Oponentes',
        notPlayed: 'No jugado',
        leaguePoints: 'Puntos',
        avg: 'Media',
        league_ending: 'Liga termina el ',
        league_finished: 'Liga terminó el ',
        current_league: 'Liga actual',
        averageScore: 'Puntuación media por combate: ',
        scoreExpected: 'Puntuación esperada: ',
        available_girls: 'Chicas disponibles: ',
        fights: 'Fights',
        won_mojo: 'Won mojo',
        lost_mojo: 'Lost mojo',
        won_mojo_avg: 'Won mojo average',
        lost_mojo_avg: 'Lost mojo average',
        mojo_avg: 'Global mojo average',
        filter: 'Filtro',
        searched_name : 'Nombre buscado',
        girl_name: 'Nombre de la chica',
        searched_class: 'Clase buscada',
        searched_rarity: 'Rareza buscada',
        team_number: 'Equipo #',
        all: 'Todo',
        team: 'Equipo',
        teams: 'Equipos',
        save_as: 'Guardar como',
        load_from: 'Carga',
        level_range: 'Rango de nivel',
        searched_aff_category: 'Categoría de afecto buscada',
        searched_aff_lvl: 'Nivel de afecto buscado',
        aff_lvl: 'Nivel de afecto',
        zero_star: '0 estrella',
        one_star: '1 estrella',
        two_stars: '2 estrellas',
        three_stars: '3 estrellas',
        four_stars: '4 estrellas',
        five_stars: '5 estrellas',
        six_stars: '6 estrellas',
        time_passed: 'del tiempo ha pasado',
        combativity: 'Combatividad',
        energy: 'Energía',
        sort: 'Ordenar',
        hide: 'Ocultar',
        display: 'Mostrar',
        searched_blessed_attributes: 'Chicas bendecidas buscadas',
        blessed_attributes: 'Benditas chicas',
        non_blessed_attributes: 'Chicas no bendecidas',
        pantheon: 'Escalera del Panteón',
        searched_element : 'Elemento buscado',
        element: 'Elemento',
        dominatrix: 'Dominatrix',
        submissive: 'Sumisa',
        voyeur: 'Voyeur',
        eccentric: 'Excéntrica',
        exhibitionist: 'Exhibicionista',
        physical: 'Física',
        playful: 'Juguetona',
        sensual: 'Sensual',
        clubChampDuration: '{{duration}} desde el comienzo de la ronda',
        searched_pose: 'Pose buscada',
        visit_teams: 'Visita el <a href="' + transformNutakuURL('../teams.html') + '">Equipos</a> primero.',
        next: 'Sigui.',
        Side_quests : 'Misiones secundarias',
        Club_champion: 'Campeón de club',
        Current_positions: 'Posiciones actuales',
        Current_stage: 'Fase actual',
        Statistics: 'Estadísticas',
        Prev_stage: 'Fase previa',
        attempt: 'intento',
        attempts: 'intentos',
        Gems_in_stock: 'Gemas en stock',
        missing_gems: 'Gemas que faltan para maximizar cada chica mítica o legendaria de 5 estrellas',
        date_on: 'del',
        skilledGirls: 'Chicas con habilidades',
        last_season: 'Temporada anterior',
        champion_girl_pose: 'Pose de chica campeona',
        none_f: 'Ninguna',
        none_m: 'Ninguno',
        with: 'Con',
        tier5_skill_filter: 'Habilidades nivel 5',
        already_fought: 'Ya luchó',
        new_girl_in: 'Nueva chica en:',
        trollsMessage: '<a href="' + transformNutakuURL('../adventures.html') + '">Selecciona la aventura principal para mostrar accesos directos a mundos y villanos</a>',
        labyrinthGirlsTxt: 'El equipo contrario se basa en estas chicas',
        zodiac: {1: '♈︎ Aries',
            2: '♉︎ Tauro',
            3: '♊︎ Géminis',
            4: '♋︎ Cáncer',
            5: '♌︎ Leo',
            6: '♍︎ Virgo',
            7: '♎︎ Libra',
            8: '♏︎ Escorpión',
            9: '♐︎ Sagitario',
            10: '♑︎ Capricornio',
            11: '♒︎ Acuario',
            12: '♓︎ Piscis'
        },
        color: {'F99': 'Rosa',
            'B06': 'Rosa oscuro',
            'F00': 'Rojo',
            'A55': 'Marrón',
            'FFF': 'Blanco',
            '321': 'Oscuro',
            '00F': 'Azul',
            'FF0': 'Rubio',
            '0F0': 'Verde',
            'XXX': 'Desconocido',
            'B62': 'Marrón',
            '000': 'Negro',
            'CCC': 'Platino',
            'F0F': 'Lila',
            'F90': 'Naranja',
            'EB8': 'Rubio rojizo',
            '888': 'Gris',
            'FD0': 'Dorado',
            'D83': 'Cronce',
            '765': 'Castaño cenizo',
        },
    },

    it: {
        optionsVillain: 'Menù battaglia Troll',
        optionsTiers: 'Mostra i livelli con le ragazze disponibili',
        optionsXPMoney : 'Migliora XP / soldi',
        optionsMarket: 'Informazioni negozio',
        optionsMarketRestockButton: 'Spostate il pulsante "Rifornisci" del mercato',
        optionsFilterArmorItems: 'Filtrare armature di mercato',
        optionsPreventBoostersUse: 'Impedire l\'uso di booster < leggendari',
        optionsHarem: 'Informazioni Harem',
        optionsHaremFilters: 'Aggiungere filtri all\'harem',
        optionsGirlsItemsFilter: 'Filtrare le attrezzature delle ragazze',
        optionsLeague: 'Informazioni sulle Leghe',
        optionsLeagueBoard: 'Mostra i top della lega',
        optionsSimLeagueBoardFight: 'Visualizzazione simulazione nella classifica della lega',
        optionsSimFight: 'Simulazione Leghe / Stagione / Troll',
        optionsTeamsFilter: 'Filtro delle squadre',
        optionsChampions: 'Informazioni + scorciatoie per i campioni',
        optionsLinks: 'Scorciatoie/Timer',
        optionsLabyrinth: 'Informazioni sul labirinto',
        optionsSeasonStats: 'Season stats',
        optionsPachinkoNames: 'Mostra i nomi in Pachinko',
        optionsMissionsBackground: 'Cambiare lo sfondo delle missioni',
        optionsCollectMoneyAnimation: 'Disattivare l\'animazione di raccolta dei soldi',
        optionsActivitiesTabChoice: 'Impostare Missioni come scheda principale in Attività',
        optionsCustomizedHomeScreen: 'Schermata iniziale personalizzata',
        optionsHideClaimedRewards: 'Nascondere le ricompense reclamate',
        optionsDesktopDisplay: 'Modalità di visualizzazione PC a cellulare',
        optionsHideClaimAllButtons: 'Nascondere il pulsante "Rivendica tutto"',
        optionsHideMultipleLeagueBattlesButton: 'Nascondere il pulsante x15 nella lega',
        optionsRemovePachinkoPopup: 'Rimuovere la finestra "nessuna ragazza" in Pachinko',
        optionsContestsExpiryTimer: 'Timer per i premi dei concorsi',
        optionsHideLeaguex3Button: 'Nascondere il pulsante x3 nella lega',
        optionsHideGradeUpgradeKobanButton: 'Nascondere il pulsante di aggiornamento del affetto in Koban',
        optionsLeagueBoostersStatus: 'Visualizzare lo stato dei potenziamenti avversari',
        optionsLeagueCompactDisplay: 'Visualizzare la tabella delle leghe compatte',
        optionsSeasonFightsSort: 'Ordinamento dei combattimenti della stagione',
        optionsHideIntroPictures: 'Nascondere le immagini nella pagina di login',
        optionsDisplayLoveRaidsInfo: 'Aggiungere informazioni alla pagina principale di Raid dell\'Amore',
        optionsHideFinishedLoveRaids: 'Nascondere le Raid dell\'Amore completate',
        optionsPentaDrillSort: `Ordinamento degli avversari ${window.GT.design.penta_drill}`,
        and: 'e',
        or: 'o',
        in: 'in',
        including: 'incluso',
        affection: 'affetto',
        harem_stats: 'Stato dell Harem',
        haremettes: 'ragazze dell harem',
        hardcore: 'Prono',
        charm: 'Fascino',
        know_how: 'Competenza',
        shagger: 'Scopata',
        lover: 'Amante',
        expert: 'Esperto',
        Defense_against: 'Difesa contro ',
        specialist_in: 'specialista in ',
        harem_levels: 'livelli harem',
        to_go: 'mancanti',
        unlocked_scenes: 'scene sbloccate',
        money_income: 'Guadagni',
        per_hour: 'orario',
        when_all_collectable: 'quando si può raccogliere tutto',
        required_to_unlock: 'Necessario per sbloccare tutte le scene',
        required_to_get_tier_max_level: 'Necessario per livellare tutte le ragazze al massimo livello di risveglio livello',
        required_to_get_max_level: 'Necessario per livellare tutte le ragazze mitiche e leggendarie a 5 stelle al livello ' + lvl_max_girl,
        my_stocks: 'Mio inventario',
        equipments: 'attrezzature',
        boosters: 'potenziamenti',
        with_boosters: 'Con potenziamenti',
        no_boosters: 'Senza potenziamenti',
        books: 'libri',
        gifts: 'regali',
        Equipments: 'Attrezzature',
        Boosters: 'Potenziamenti',
        Books: 'Libri',
        Gifts: 'Regali',
        equipment: 'attrezzatura',
        booster: 'potenziamento',
        book: 'libro',
        gift: 'regalo',
        Equipment: 'Attrezzatura',
        Booster: 'Potenziamento',
        Book: 'Libro',
        Gift: 'Regalo',
        currently_buyable: 'Correntemente acquistabili',
        visit_the: 'Visita il <a href="' + transformNutakuURL('../shop.html') + '">negozio</a> prima.',
        not_compatible: 'Il tuo browser non è compatibile.',
        or_level: 'o livello',
        restock: 'Rifornimento',
        wiki: 'Pagina wiki di ',
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
        mythic: 'Mitica',
        day: 'g',
        hour: 'h',
        minute: 'm',
        second: 's',
        demote_up: 'Per <u>il degrado</u> devi avere al massimo ',
        demote_down: 'Per <u>il degrado</u> devi essere sorpassato da giocatori con ',
        demote_holdzero: 'Per <u>il degrado</u> devi rimanere a ',
        stagnate_up: 'Per <u>restare</u> devi avere al massimo ',
        stagnate_down: 'Per <u>restare</u> devi essere sorpassato da giocatori con ',
        stagnate_holdzero: 'Per <u>restare</u> devi rimanere a ',
        top4_up: 'Per <u>essere tra i primi 4</u> devi avere un minimo di ',
        top4_hold: 'Per <u>rimanere tra i primi 4</u> devi avere un minimo di ',
        top15_up: 'Per <u>essere tra i primi 15</u> devi avere un minimo di ',
        top15_hold: 'Per <u>rimanere tra i primi 15</u> devi avere un minimo di ',
        top30_up: 'Per <u>essere tra i primi 30</u> devi avere un minimo di ',
        top30_hold: 'Per <u>rimanere tra i primi 30</u> devi avere un minimo di ',
        points: 'punti',
        challenges_regen: 'Rigenerazione naturale: ',
        challenges_left: '<BR>Combattimenti mancanti: ',
        pop: 'Luoghi',
        season: 'Stagione',
        full_in: 'Piena tra',
        ends_at: 'Fine alle',
        full: 'Piena',
        league: 'Leghe',
        boosters_end: 'Fine potenz.',
        victories: 'Vittorie',
        defeats: 'Sconfitte',
        unknown: 'Sconosciuto',
        opponents: 'Avversari',
        notPlayed: 'Non giocato',
        leaguePoints: 'Punti',
        avg: 'Medio',
        league_ending: 'Fine della lega il ',
        league_finished: 'Lega finita il ',
        current_league: 'Lega attuale',
        averageScore: 'Punteggio medio per combattimento: ',
        scoreExpected: 'Punteggio previsto: ',
        available_girls: 'Ragazze disponibili: ',
        fights: 'Fights',
        won_mojo: 'Won mojo',
        lost_mojo: 'Lost mojo',
        won_mojo_avg: 'Won mojo average',
        lost_mojo_avg: 'Lost mojo average',
        mojo_avg: 'Global mojo average',
        filter: 'Filtro',
        searched_name : 'Nome ricercato',
        girl_name: 'Nome della ragazza',
        searched_class: 'Classe ricercata',
        searched_rarity: 'Rarità ricercata',
        team_number: 'Squadra #',
        all: 'Tutti',
        team: 'Squadra',
        teams: 'Squadre',
        save_as: 'Salvare come',
        load_from: 'Caricare',
        level_range: 'Gamma di livelli',
        searched_aff_category: 'Categoria di affetto ricercata',
        searched_aff_lvl: 'Livello di affetto ricercato',
        aff_lvl: 'Livello di affetto',
        zero_star: '0 stella',
        one_star: '1 stella',
        two_stars: '2 stelle',
        three_stars: '3 stelle',
        four_stars: '4 stelle',
        five_stars: '5 stelle',
        six_stars: '6 stelle',
        time_passed: 'del tempo è passato',
        combativity: 'Combattività',
        energy: 'Energia',
        sort: 'Ordinare',
        hide: 'Nascondere',
        display: 'Visualizzare',
        searched_blessed_attributes: 'Cercato ragazze benedette',
        blessed_attributes: 'Ragazze benedette',
        non_blessed_attributes: 'Ragazze non benedette',
        pantheon: 'Scalinata del Pantheon',
        searched_element : 'Elemento ricercato',
        element: 'Elemento',
        dominatrix: 'Dominatrice',
        submissive: 'Sottomessa',
        voyeur: 'Guardona',
        eccentric: 'Eccentrica',
        exhibitionist: 'Esibizionista',
        physical: 'Fisica',
        playful: 'Giocosa',
        sensual: 'Sensuale',
        clubChampDuration: '{{duration}} dall\'inizio del round',
        searched_pose: 'Posa ricercata',
        visit_teams: 'Visita le <a href="' + transformNutakuURL('../teams.html') + '">Squadre</a> prima.',
        next: 'Pross.',
        Side_quests : 'Missioni secondarie',
        Club_champion: 'Campione di club',
        Current_positions: 'Posizioni attuali',
        Current_stage: 'Fase attuale',
        Statistics: 'Statistiche',
        Prev_stage: 'Fase precedente',
        attempt: 'tentativo',
        attempts: 'tentativi',
        Gems_in_stock: 'Gemme in stock',
        missing_gems: 'Gemme mancanti per massimizzare ogni ragazza mitica o leggendaria a 5 stelle',
        date_on: 'del',
        skilledGirls: 'Ragazze con abilità',
        last_season: 'Stagione precedente',
        champion_girl_pose: 'Posa della ragazza del campione',
        none_f: 'Nessuna',
        none_m: 'Nessuno',
        with: 'Con',
        tier5_skill_filter: 'Abilità livello 5',
        already_fought: 'Già combattuti',
        new_girl_in: 'Nuova ragazza in:',
        trollsMessage: '<a href="' + transformNutakuURL('../adventures.html') + '">Selezionate l\'avventura principale per visualizzare le scorciatoie ai mondi e ai troll</a>',
        labyrinthGirlsTxt: 'La squadra avversaria è composta da queste ragazze',
        zodiac: {1: '♈︎ Ariete',
            2: '♉︎ Toro',
            3: '♊︎ Gemelli',
            4: '♋︎ Cancro',
            5: '♌︎ Leone',
            6: '♍︎ Vergine',
            7: '♎︎ Bilancia',
            8: '♏︎ Scorpione',
            9: '♐︎ Sagittario',
            10: '♑︎ Capricorno',
            11: '♒︎ Aquario',
            12: '♓︎ Pesci'
        },
        color: {'F99': 'Rosa',
            'B06': 'Rosa scuro',
            'F00': 'Rosso',
            'B62': 'Castano',
            'FFF': 'Bianco',
            '321': 'Scuro',
            '00F': 'Blu',
            'FF0': 'Biondo',
            '0F0': 'Verde',
            'XXX': 'Sconosciuto',
            'A55': 'Marrone',
            '000': 'Nero',
            'CCC': 'Argento',
            'F0F': 'Viola',
            'F90': 'Arancio',
            'EB8': 'Biondo veneziano',
            '888': 'Grigio',
            'FD0': 'Dorato',
            'D83': 'Bronzo',
            '765': 'Biondo cenere',
        },
    },

    de: {
        optionsVillain: 'Widersacher-Menü',
        optionsTiers: 'Stufen mit verfügbaren Mädchen anzeigen',
        optionsXPMoney : 'Migliora XP / soldi',
        optionsMarket: 'Marktplatz-Informationen',
        optionsMarketRestockButton: 'Verschieben Sie die Schaltfläche "Auffüllen"',
        optionsFilterArmorItems: 'Filter Markt Rüstungen',
        optionsPreventBoostersUse: 'Verhindern Sie die Verwendung von Boostern < legendären',
        optionsHarem: 'Harem-Informationen',
        optionsHaremFilters: 'Filter im Harem hinzufügen',
        optionsGirlsItemsFilter: 'Filtern der Mädchenausrüstungen',
        optionsLeague: 'Liga-Informationen',
        optionsLeagueBoard: 'Die Liga-Spitzen anzeigen',
        optionsSimLeagueBoardFight: 'Anzeige Simulation in der Liga-Rangliste',
        optionsSimFight: 'Liga/Saison/Widersacher-Simulation',
        optionsTeamsFilter: 'Mannschaften filtern',
        optionsChampions: 'Informationen + Abkürzungen für Champions',
        optionsLinks: 'Abkürzungen/Zeitgeber',
        optionsLabyrinth: 'Labyrinth-Informationen',
        optionsSeasonStats: 'Season stats',
        optionsPachinkoNames: 'Namen in Pachinko anzeigen',
        optionsMissionsBackground: 'Missionshintergrund ändern',
        optionsCollectMoneyAnimation: 'Deaktivieren Sie die Animation "Geld sammeln"',
        optionsActivitiesTabChoice: 'Missionen als Hauptregisterkarte in Aktivitäten festlegen',
        optionsCustomizedHomeScreen: 'Benutzerdefinierter Startbildschirm',
        optionsHideClaimedRewards: 'Beanspruchte Belohnungen ausblenden',
        optionsDesktopDisplay: 'Anzeigemodus PC auf Handy',
        optionsHideClaimAllButtons: 'Schaltfläche "Alles beanspruchen" ausblenden',
        optionsHideMultipleLeagueBattlesButton: 'Schaltfläche x15 in der Liga ausblenden',
        optionsRemovePachinkoPopup: 'Das Fenster "Kein Mädchen" in Pachinko entfernen',
        optionsContestsExpiryTimer: 'Timers für Wettbewerbe Belohnungen',
        optionsHideLeaguex3Button: 'Schaltfläche x3 in der Liga ausblenden',
        optionsHideGradeUpgradeKobanButton: 'Schaltfläche für die Zuneigung in Kobans ausblenden',
        optionsLeagueBoostersStatus: 'Status der gegnerischen Booster anzeigen',
        optionsLeagueCompactDisplay: 'Kompaktes Ligenboard anzeigen',
        optionsSeasonFightsSort: 'Sortierung der Saisonkämpfe',
        optionsHideIntroPictures: 'Bilder auf der Login-Seite ausblenden',
        optionsDisplayLoveRaidsInfo: 'Informationen zur Liebesüberfall Hauptseite hinzufügen',
        optionsHideFinishedLoveRaids: 'Verstecken abgeschlossen Liebesüberfall',
        optionsPentaDrillSort: `Sortierung der Gegner ${window.GT.design.penta_drill}`,
        and: 'und',
        or: 'oder',
        in: 'in',
        including: 'einschließlich',
        affection: 'Zuneigung',
        harem_stats: 'Harem-Statistiken',
        haremettes: 'Harem-Mädchen',
        hardcore: 'Hardcore',
        charm: 'Charme',
        know_how: 'Wissen',
        shagger: 'Stecher',
        lover: 'Liebhaber',
        expert: 'Experte',
        Defense_against: 'Verteidigung gegen ',
        specialist_in: 'spezialisiert auf ',
        harem_levels: 'Harem-Levels',
        to_go: 'übrig',
        unlocked_scenes: 'Szenen freigeschaltet',
        money_income: 'Einkommen',
        per_hour: 'pro Stunde',
        when_all_collectable: 'wenn komplett einsammelbar',
        required_to_unlock: 'Erforderlich für alle Mädchen-Upgrades',
        required_to_get_tier_max_level: 'Erforderlich für die maximale Mädchen-Level ihrer Erweckungsstufe',
        required_to_get_max_level: 'Erforderlich für alle mythischen und legendären 5-Sterne-Mädchen auf Stufe ' + lvl_max_girl,
        my_stocks: 'Meine Bestände',
        equipments: 'Ausrüstungen',
        boosters: 'Booster',
        with_boosters: 'Mit Booster',
        no_boosters: 'Keine Booster',
        books: 'Bücher',
        gifts: 'Geschenke',
        Equipments: 'Ausrüstungen',
        Boosters: 'Booster',
        Books: 'Bücher',
        Gifts: 'Geschenke',
        equipment: 'Ausrüstung',
        booster: 'Booster',
        book: 'Buch',
        gift: 'Geschenk',
        Equipment: 'Ausrüstung',
        Booster: 'Booster',
        Book: 'Buch',
        Gift: 'Geschenk',
        currently_buyable: 'Aktuelle Marktangebote',
        visit_the: 'Besuche zuerst den <a href="' + transformNutakuURL('../shop.html') + '">Marktplatz</a>.',
        not_compatible: 'Dein Browser ist nicht kompatibel.',
        or_level: 'oder Level',
        restock: 'neue Angebote',
        wiki: '\'s Wiki-Seite',
        evolution_costs: 'Die Upgradekosten betragen',
        world: 'Welt ',
        villain: ' Widersacher',
        fight_villain: 'Widersacher',
        you_own: 'Du besitzt',
        you_can_give: 'Insgesamt verteilbar:',
        you_can_sell: 'Du kannst alles verkaufen für',
        stat_points_need: 'benötigte Statuspunkte bis Maximum',
        money_need: 'nötiges Geld bis Maximum',
        money_spent: 'bisher ausgegeben',
        points_from_level: 'Statuspunkte durch Heldenlevel',
        bought_points: 'gekaufte Statuspunkte',
        equipment_points: 'Statuspunkte durch Ausrüstung',
        ginseng_points: 'Statuspunkte durch Booster',
        club_points: 'Statuspunkte durch Club-Boni',
        Xp: 'XP',
        starting: 'Starter',
        common: 'Gewöhnliche',
        rare: 'Seltene',
        epic: 'Epische',
        legendary: 'Legendäre',
        mythic: 'Mythische',
        day: 'd',
        hour: 'h',
        minute: 'm',
        second: 's',
        demote_up: 'Für den <u>Abstieg</u> maximal möglich: ',
        demote_down: 'Für den <u>Abstieg</u> musst du überholt werden von Spielern mit höchstens ',
        demote_holdzero: 'Für den <u>Abstieg</u> musst du verbleiben bei ',
        stagnate_up: 'Für den <u>Nichtaufstieg</u> maximal möglich: ',
        stagnate_down: 'Für den <u>Nichtaufstieg</u> musst du überholt werden von Spielern mit höchstens ',
        stagnate_holdzero: 'Für den <u>Nichtaufstieg</u> musst du verbleiben bei ',
        top4_up: 'Um <u>in den Top 4 zu kommen</u>, musst du mindestens folgende Voraussetzungen erfüllen  ',
        top4_hold: 'Um <u>in den Top 4 zu bleiben</u>, musst du mindestens folgende Voraussetzungen erfüllen  ',
        top15_up: 'Um <u>in den Top 15 zu kommen</u>, musst du mindestens folgende Voraussetzungen erfüllen  ',
        top15_hold: 'Um <u>in den Top 15 zu bleiben</u>, musst du mindestens folgende Voraussetzungen erfüllen  ',
        top30_up: 'Um <u>in den Top 30 zu kommen</u>, musst du mindestens folgende Voraussetzungen erfüllen  ',
        top30_hold: 'Um <u>in den Top 30 zu bleiben</u>, musst du mindestens folgende Voraussetzungen erfüllen  ',
        points: 'Punkte',
        challenges_regen: 'Regeneration: ',
        challenges_left: '<BR>verbleibende Kämpfe: ',
        pop: 'Orte',
        season: 'Saison',
        full_in: 'Voll in',
        ends_at: 'Ende um',
        full: 'Voll',
        league: 'Liga',
        boosters_end: 'Booster enden',
        victories: 'Siege',
        defeats: 'Niederlagen',
        unknown: 'Unbekannt',
        opponents: 'Gegner',
        notPlayed: 'Nicht gespielt',
        leaguePoints: 'Punkte',
        avg: 'Mittelwert',
        league_ending: 'Liga Ende ',
        league_finished: 'Liga endete am',
        current_league: 'Aktuelle Liga',
        averageScore: 'Durchschnitt pro Kampf: ',
        scoreExpected: 'Erwartetes Ergebnis: ',
        available_girls: 'Freie Mädchen: ',
        fights: 'Kämpfe',
        won_mojo: 'gewonnenes Mojo',
        lost_mojo: 'verlorenes Mojo',
        won_mojo_avg: 'im Mittel gewonnenes Mojo',
        lost_mojo_avg: 'im Mittel verlorenes Mojo',
        mojo_avg: 'Globales mittleres Mojo',
        filter: 'Filter',
        searched_name : 'Name',
        girl_name: 'Mädchen Name',
        searched_class: 'Klasse',
        searched_rarity: 'Seltenheit',
        team_number: 'Team #',
        all: 'Alle',
        team: 'Mannschaft',
        teams: 'Mannschaften',
        save_as: 'Speichern',
        load_from: 'Laden',
        level_range: 'Level',
        searched_aff_category: 'Maximale Zuneigung',
        searched_aff_lvl: 'Zuneigungslevel',
        aff_lvl: 'Zuneigungslevel',
        aff_lvl: 'Livello di affetto',
        zero_star: '0 Sterne',
        one_star: '1 Stern',
        two_stars: '2 Sterne',
        three_stars: '3 Sterne',
        four_stars: '4 Sterne',
        five_stars: '5 Sterne',
        six_stars: '6 Sterne',
        time_passed: 'Zeit ist vergangen',
        combativity: 'Kampflust',
        energy: 'Energie',
        sort: 'Sortieren',
        hide: 'Ausblenden',
        display: 'Anzeigen',
        searched_blessed_attributes: 'Segnungen',
        blessed_attributes: 'gesegnet',
        non_blessed_attributes: 'nicht gesegnet',
        pantheon: 'Aufstieg zum Pantheon',
        searched_element : 'Element',
        dominatrix: 'Domina',
        submissive: 'Unterwürfig',
        voyeur: 'Voyeur',
        eccentric: 'Exzentrisch',
        exhibitionist: 'Exhibitionist',
        physical: 'Körperlich',
        playful: 'Verspielt',
        sensual: 'Sinnlich',
        clubChampDuration: '{{duration}} seit Rundenbeginn',
        searched_pose: 'Stellung',
        visit_teams: 'Besuche zuerst die <a href="' + transformNutakuURL('../teams.html') + '">Teams</a>.',
        next: 'Näch.',
        Side_quests : 'Nebenquests',
        Club_champion: 'Clubmeister',
        Current_positions: 'Aktuelle Positionen',
        Current_stage: 'Aktuelle Etappe',
        Statistics: 'Statistik',
        Prev_stage: 'Vorherige Etappe',
        attempt: 'Versuch',
        attempts: 'Versuche',
        Gems_in_stock: 'Edelsteine auf Lager',
        missing_gems: 'Fehlende Edelsteine, um jedes mythische oder legendäre 5-Sterne-Mädchen zu maximieren',
        date_on: 'am',
        skilledGirls: 'Mädchen mit Fertigkeiten',
        last_season: 'Letzte Saison',
        champion_girl_pose: 'Stellung der Championsmädchen',
        none_f: 'Keine',
        none_m: 'Keiner',
        with: 'Mit',
        tier5_skill_filter: 'Stufe 5 Fertigkeiten',
        already_fought: 'Bereits bekämpft',
        new_girl_in: 'Neues Mädchen in:',
        trollsMessage: '<a href="' + transformNutakuURL('../adventures.html') + '">Wähle das Hauptabenteuer, um die Abkürzungen zu den Welten und Trollen anzuzeigen</a>',
        labyrinthGirlsTxt: 'Die gegnerische Mannschaft besteht aus diesen Mädchen',
        zodiac: {1: '♈︎ Widder',
            2: '♉︎ Stier',
            3: '♊︎ Zwillinge',
            4: '♋︎ Krebs',
            5: '♌︎ Löwe',
            6: '♍︎ Jungfrau',
            7: '♎︎ Waage',
            8: '♏︎ Skorpion',
            9: '♐︎ Schütze',
            10: '♑︎ Steinbock',
            11: '♒︎ Wassermann',
            12: '♓︎ Fische'
        },
        color: {'F99': 'Pink',
            'B06': 'Dunkelpink',
            'F00': 'Rot',
            'B62': 'Dunkelblond',
            'FFF': 'Weiß',
            '321': 'Dunkel',
            '00F': 'Blau',
            'FF0': 'Blond',
            '0F0': 'Grün',
            'XXX': 'Unbekannt',
            'A55': 'Braun',
            '000': 'Schwarz',
            'CCC': 'Silber',
            'F0F': 'Lila',
            'F90': 'Orange',
            'EB8': 'Erdbeerblond',
            '888': 'Grau',
            'FD0': 'Gold',
            'D83': 'Bronze',
            '765': 'Aschebraun',
        },
    }
}

// Numbers: rounding to K, M, G and T
function nRounding(num, digits, updown) {
    let power = [
        { value: 1, symbol: '' },
        { value: 1E3, symbol: 'K' },
        { value: 1E6, symbol: 'M' },
        { value: 1E9, symbol: 'B' },
        { value: 1E12, symbol: 'T' },
    ];
    let i;
    for (i = power.length - 1; i > 0; i--) {
        if (num >= power[i].value) {
            break;
        }
    }
    if (updown == 1) {
        return nThousand(+(Math.ceil(num / power[i].value * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits)) + power[i].symbol;
    }
    else if (updown == 0) {
        return nThousand(+(Math.round(num / power[i].value * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits)) + power[i].symbol;
    }
    else if (updown == -1) {
        return nThousand(+(Math.floor(num / power[i].value * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits)) + power[i].symbol;
    }
}

// Thousand spacing
function nThousand(x) {
    if(typeof x != 'number') {
        return 0;
    }
    switch(pageLang){ //atm this shows the numbers equal to the game
        case 'ja':
        case 'en': return x.toLocaleString("en")
        default: return x.toLocaleString("fr")
    }
}

function localeStringToNumber(s){
    let e = s.replace(/[^0-9]/gi,'x').split('x')
    switch(e.length){
        case 0: return 0
        case 1: return +e[0]
        default: break
    }
    let f =e.pop()
    e = e.toString().replace(/[^0-9]/gi,'')
    switch(f.length){
        case 1: return parseFloat(e)+f/10
        case 2: return parseFloat(e)+f/100
        default: return parseFloat(e+f)
    }
}

let lang = "en";
const pageLang = $('html')[0].lang.substring(0,2);
if(texts[pageLang]) lang=pageLang;

const labels = texts[lang];
const label = (key) => (labels && labels[key]) || texts.en[key];

let locale = 'fr';
if (lang == 'en') {
    locale = 'en'
}

var DST;
calculateDST();

function calculateDST() {
    if(((new Date).getUTCMonth() >= 3 && (new Date).getUTCMonth() <= 8) || ((new Date).getUTCMonth() == 9 && (new Date).getUTCDate() < 25))
        DST = true;
    else if((new Date).getUTCMonth() >= 10 || (new Date).getUTCMonth() <= 1 || ((new Date).getUTCMonth() == 2 && (new Date).getUTCDate() < 25))
        DST = false;
    else if((new Date).getUTCMonth() == 2 && (new Date).getUTCDate() >= 25) {
        if((new Date).getUTCDate() + (7-(new Date).getUTCDay()) <= 31 && (new Date).getUTCDay() != 0)
            DST = false;
        else {
            if((new Date).getUTCHours() >= 1) DST = true;
            else DST = false;
        }
    }
    else if((new Date).getUTCMonth() == 9 && (new Date).getUTCDate() >= 25) {
        if((new Date).getUTCDate() + (7-(new Date).getUTCDay()) <= 31 && (new Date).getUTCDay() != 0)
            DST = true;
        else {
            if((new Date).getUTCHours() >= 1) DST = false;
            else DST = true;
        }
    }
}

const GIRLS_EXP_LEVELS = {
    starting : [10],
    common : [10],
    rare : [12],
    epic : [14],
    legendary : [16],
    mythic : [40]
}
calculateGirlXPTab();

function calculateGirlXPTab() {
    for (let i=1; i < (lvl_max_girl-1); i++) {
        GIRLS_EXP_LEVELS.starting[i] = GIRLS_EXP_LEVELS.starting[(i-1)] + Math.ceil(GIRLS_EXP_LEVELS.starting[0]*Math.pow(1.0075, i));
        GIRLS_EXP_LEVELS.common[i] = GIRLS_EXP_LEVELS.common[(i-1)] + Math.ceil(GIRLS_EXP_LEVELS.common[0]*Math.pow(1.0075, i));
        GIRLS_EXP_LEVELS.rare[i] = GIRLS_EXP_LEVELS.rare[(i-1)] + Math.ceil(GIRLS_EXP_LEVELS.rare[0]*Math.pow(1.0075, i));
        GIRLS_EXP_LEVELS.epic[i] = GIRLS_EXP_LEVELS.epic[(i-1)] + Math.ceil(GIRLS_EXP_LEVELS.epic[0]*Math.pow(1.0075, i));
        GIRLS_EXP_LEVELS.legendary[i] = GIRLS_EXP_LEVELS.legendary[(i-1)] + Math.ceil(GIRLS_EXP_LEVELS.legendary[0]*Math.pow(1.0075, i));
        GIRLS_EXP_LEVELS.mythic[i] = GIRLS_EXP_LEVELS.mythic[(i-1)] + Math.ceil(GIRLS_EXP_LEVELS.mythic[0]*Math.pow(1.0075, i));
    }
}

const AWAKENING_GEMS_COST = {
    starting: [0, 40, 60, 80, 100, 125, 150, 200, 275, 350, 500],
    common: [0, 40, 60, 80, 100, 125, 150, 200, 275, 350, 500],
    rare: [0, 80, 120, 160, 200, 250, 300, 400, 550, 700, 1000],
    epic: [0, 120, 180, 240, 300, 375, 450, 600, 825, 1050, 1500],
    legendary: [0, 160, 240, 320, 400, 500, 600, 800, 1100, 1400, 2000],
    mythic: [0, 200, 300, 400, 500, 625, 750, 1000, 1375, 1750, 2500]
};
const AWAKENING_REQUIREMENT = [20, 25, 30, 35, 40, 50, 60, 70, 85, 100];
const AWAKENING_LEVELS = [250, 300, 350, 400, 450, 500, 550, 600, 650, 700];

/**
 * ELEMENTS ASSUMPTIONS
 *
 * 1) Girl and Harem synergy bonuses for Attack, Defense, Ego and Harmony are already included in the shown stats
 * 2) Countering bonuses are not included in any shown stats
 *
 * ELEMENTS FACTS
 *
 * 1) Crit damage and chance bonuses are additive; Ego and damage bonuses are multiplicative
 * 2) Opponent harem synergies are only available to the player in the leagues
 */
const ELEMENTS = {
    chance: {
        darkness: 'light',
        light: 'psychic',
        psychic: 'darkness'
    },
    egoDamage: {
        fire: 'nature',
        nature: 'stone',
        stone: 'sun',
        sun: 'water',
        water: 'fire'
    }
}
const ELEMENTS_ICON_NAMES = {
    "darkness": "Dominatrix",
    "light": "Submissive",
    "psychic": "Voyeurs",
    "fire": "Eccentric",
    "nature": "Exhibitionist",
    "stone": "Physical",
    "sun": "Playful",
    "water": "Sensual",
}

//Match pose number with class number
const GIRL_POSE_CLASS = {
    1: '1',
    2: '1',
    3: '1',
    4: '1',
    5: '2',
    6: '2',
    7: '2',
    8: '2',
    9: '3',
    10: '3',
    11: '3',
    12: '3',
}

const tier5_Skill_Id = [11, 12, 13, 14];

const timeout = 250;

const mediaMobile = '@media only screen and (max-width: 1025px)';
const mediaDesktop = '@media only screen and (min-width: 1026px)';

const DEFAULT_BOOSTERS = {normal: [], mythic:[]};
//4 normal boosters. The 5th normal booster is just to handle the display on 2 lines.
const MAX_BOOSTERS = {normal: 5, mythic: 5};

var trolls;
var tierGirlsID = [];
var sideTrolls;
var sideTierGirlsID = [];

function editTrollsAndTiers() {
    //Hentai Heroes villains and girls
    if (['hentai', 'horny_s', 'nutaku', 'test_h', 'hh_eroges'].some(testUniverse)) {
        trolls = ['Dark Lord', 'Ninja Spy', 'Gruntt', 'Edwarda', 'Donatien', 'Silvanus', 'Bremen', 'Finalmecia', 'Fredy Sih Roko Senseï', 'Karole', 'Jackson&#8217;s Crew', 'Pandora Witch', 'Nike', 'Sake', 'WereBunny Police', 'Auga', 'Gross', 'Harriet', 'Darth Excitor'];
        if (lang == 'fr') {
            trolls[1] = 'Espion Ninja';
            trolls[10] = 'Équipage de Jackson';
            trolls[11] = 'Sorcière Pandora';
            trolls[14] = 'Police des Lapines-Garous';
            trolls[18] = 'Excitateur sombre';
        }
        if (lang == 'es') {
            trolls[0] = 'Señor Oscuro';
            trolls[1] = 'Ninja espía';
            trolls[10] = 'Tripulación de Jackson';
            trolls[11] = 'Pandora Bruja';
            trolls[14] = 'Policía hombres-conejos';
            trolls[18] = 'Darth Excitador';
        }
        if (lang == 'it') {
            trolls[0] = 'Signore Oscuro';
            trolls[1] = 'Spia Ninja';
            trolls[10] ='Ciurma di Jackson';
            trolls[11] ='Strega Pandora';
            trolls[14] = 'Polizia del Conigli Mannari';
        }
        if (lang == 'de') {
            trolls[0] = 'Dunkler Lord';
            trolls[1] = 'Ninjaspion';
            trolls[10] ='Jacksons Crew';
            trolls[11] ='Pandora Hexe';
            trolls[14] = 'Wer-Kaninchen Polizei';
            trolls[18] = 'Darth Erreger';
        }

        tierGirlsID = [
            [['8', '9', '10'], ['7270263'], ['979916751']],
            [['14', '13', '12'], ['318292466'], ['936580004']],
            [['19', '16', '18'], ['610468472'], ['54950499']],
            [['29', '28', '26'], ['4749652'], ['345655744']],
            [['39', '40', '41'], ['267784162'], ['763020698']],
            [['64', '63', '31'], ['406004250'], ['864899873']],
            [['85', '86', '84'], ['267120960'], ['536361248']],
            [['114', '115', '116'], ['379441499'], ['447396000']],
            [['1247315', '4649579', '7968301'], ['46227677'], ['933487713']],
            [['1379661', '4479579', '1800186'], ['985085118'], ['339765042']],
            [['24316446', '219651566', '501847856'], ['383709663'], ['90685795']],
            [['225365882', '478693885', '231765083'], ['155415482'], ['769649470']],
            [['86962133', '243793871', '284483399'], [0], [0]],
            [['612527302', '167231135', '560979916', '184523411', '549524850', '784911160'], [0], [0]],
            [['164866290', '696124016', '841591253'], [0], [0]],
            [['344730128', '735302216', '851893423'], [0], [0]],
            [['547099506', '572827174', '653889168'], [0], [0]],
            [['275226156', '280313988', '641009897'], [0], [0]],
            [['410383467', '931778650', '968097691'], [0], [0]],
        ];

        sideTrolls = ['Arthur', 'Venam Kharney'];

        sideTierGirlsID = [
            [['666677364', '831625343', '851831359'], [0], [0]],
            [['124967437', '755350195', '855205805'], [0], [0]],
        ];
    }
    //Gay Harem villains and girls
    else if (['gay', 'gh_nutaku', 'gh_eroges'].some(testUniverse)) {
        trolls = ['Dark Lord', 'Ninja Spy', 'Gruntt', 'Edward', 'Donatien', 'Silvanus', 'Bremen', 'Edernas', 'Fredy Sih Roko Senseï', 'Maro', 'Jackson&#8217;s Crew', 'Icarus Warlock', 'Sol', 'Soju'];
        if (lang == 'fr') {
            trolls[1] = 'Espion Ninja';
            trolls[10] = 'Éq. de Jackson';
            trolls[11] = 'Sorcier Icarus';
        }
        if (lang == 'de') {
            trolls[0] = 'Dunkler Lord';
            trolls[1] = 'Ninjaspion';
            trolls[10] ='Jacksons Crew';
        }

        tierGirlsID = [
            [['8', '9', '10'], ['7270263'], ['979916751']],
            [['14', '13', '12'], ['318292466'], ['936580004']],
            [['19', '16', '18'], ['610468472'], ['54950499']],
            [['29', '28', '26'], ['4749652'], ['345655744']],
            [['39', '40', '41'], ['267784162'], ['763020698']],
            [['64', '63', '31'], ['406004250'], ['864899873']],
            [['85', '86', '84'], ['267120960'], ['536361248']],
            [['114', '115', '116'], ['379441499'], ['447396000']],
            [['1247315', '4649579', '7968301'], ['46227677'], ['933487713']],
            [['1379661', '4479579', '1800186'], ['985085118'], ['339765042']],
            [['24316446', '219651566', '501847856'], ['383709663'], ['90685795']],
            [['225365882', '478693885', '231765083'], ['155415482'], ['769649470']],
            [['86962133', '243793871', '284483399'], [0], [0]],
            [['167231135', '184523411', '549524850', '560979916', '612527302', '784911160'], [0], [0]],
        ];

        sideTrolls = [];

        sideTierGirlsID = [
            [[0], [0], [0]],
        ];
    }
    //Comix Harem villains and girls
    else if (['comix_c', 'nutaku_c'].some(testUniverse)) {
        trolls = ['BodyHack', 'Grey Golem', 'The Nymph', 'Athicus Ho\'ole', 'The Mimic', 'Cockatrice', 'Pomelo', 'Alexa Sl’thor', 'D\'Klong', 'Virtue Man', 'Asmodea', 'Blueball Gremlin'];
        if (lang == 'fr') {
            trolls[11] = 'Gremlin Couill\'bleues';
        }

        tierGirlsID = [
            [['830009523', '907801218', '943323021'], [0], [0]],
            [['271746999', '303805209', '701946373'], [0], [0]],
            [['743748788', '977228200', '943323021'], [0], [0]],
            [['140401381', '232860230', '514994766'], [0], [0]],
            [['623293037', '764791769', '801271903'], [0], [0]],
            [['921365371', '942523553', '973271744'], [0], [0]],
            [['364639341', '879781833', '895546748'], [0], [0]],
            [['148877065', '218927643', '340369336'], [0], [0]],
            [['258185125', '897951171', '971686222'], [0], [0]],
            [['125758004', '233499841', '647307160'], [0], [0]],
            [['994555359', '705713849', '973778141'], [0], [0]],
            [['986074436', '151807422', '993438296'], [0], [0]],
        ];

        sideTrolls = [];

        sideTierGirlsID = [
            [[0], [0], [0]],
        ];
    }
    //Pornstar Harem villains and girls
    else if (['star_t', 'nutaku_t'].some(testUniverse)) {
        trolls = ['Headmistress Asa Akira', 'Sammy Jayne', 'Ivy Winters', 'Sophia Jade', 'Amia Miley', 'Alyssa Reece', 'Kelly Kline', 'Jamie Brooks', 'Jordan Kingsley', 'Sierra Sinn', 'Jasmine Jae', 'Bella Rose', 'Paige Taylor', 'The Hooded Heroine', 'Monica Mattos', 'Caty Campbell'];
        if (lang == 'fr') {
            trolls[0] = 'Directrice Asa Akira';
            trolls[13] = 'L\'héroïne encapuchonnée';
        }

        tierGirlsID = [
            [['261345306', '795788039', '973280579'], [0], [0]],
            [['482529771', '658322339', '833308213'], [0], [0]],
            [['117837840', '160370794', '306287449', '828011942'], [0], [0]],
            [['564593641', '719705773', '934421949'], [0], [0]],
            [['270611414', '464811282', '781232070'], [0], [0]],
            [['219241809', '380385497', '879198752'], [0], [0]],
            [['165066536', '734325005', '805020628'], [0], [0]],
            [['191661045', '369105612', '665836932'], [0], [0]],
            [['169356639', '383702874', '943667167'], [0], [0]],
            [['169741198', '459885596', '507702178'], [0], [0]],
            [['258984943', '837109131', '888135956'], [0], [0]],
            [['270920965', '600910475', '799448349'], [0], [0]],
            [['832031905', '272818756', '477487889'], [0], [0]],
            [['814814392', '660703295', '450943401'], [0], [0]],
            [['409433993', '438706084', '673600948'], [0], [0]],
            [['248370930', '257485641', '381828319'], [0], [0]],
        ];

        sideTrolls = [];

        sideTierGirlsID = [
            [[0], [0], [0]],
        ];
    }
    //TransPornstar Harem villains and girls
    else if (['dotcom_startrans', 'nutaku_startrans'].some(testUniverse)) {
        trolls = ['Ariel Demure', 'Emma Rose', 'Natalie Stone', 'Janie Blade', 'Nikkie Nort', 'Mistress Venom', 'CEO Ramona', 'Mama Bee'];

        tierGirlsID = [
            [['171883542', '229180984', '771348244'], [0], [0]],
            [['484962893', '879574564', '910924260'], [0], [0]],
            [['334144727', '667194919', '911144911'], [0], [0]],
            [['473470854', '708191289', '945710078'], [0], [0]],
            [['104549634', '521022556', '526732951'], [0], [0]],
            [['317800067', '542090972', '920682672'], [0], [0]],
            [['558585439', '577205682', '741311311'], [0], [0]],
            [['692804877', '984917842', '581358076', '397703278', '704166982', '483645616', '349968569', '970429531', '954328841'], [0], [0]],
        ];

        sideTrolls = [];

        sideTierGirlsID = [
            [[0], [0], [0]],
        ];
    }
    //GayPornstar Harem villains and girls
    else if (['dotcom_stargay', 'nutaku_stargay'].some(testUniverse)) {
        trolls = ['Tristan Hunter', 'Jimmy Durano', 'Lucca Mazzi', 'Andrew Stark', 'Sean Duran & Bryce Evans', 'Trojan Pierce Paris', 'Ryan Rose', 'Pol Prince'];

        tierGirlsID = [
            [['374763633', '485499759', '780402171'], [0], [0]],
            [['290465722', '524315573', '970767946'], [0], [0]],
            [['127881092', '680366759', '836998610'], [0], [0]],
            [['182117271', '350309796', '361432643', '390918673', '426008459', '446246345', '590934200', '599355011', '712652761', '848616605', '921769175'], [0], [0]],
            [['284712878', '913932535', '352737504 '], [0], [0]],
            [['268000414', '809099695'], [0], [0]],
            [['578185725', '582322108', '695550243'], [0], [0]],
             [['316283043', '856464976', '619419056'], [0], [0]],
        ];

        sideTrolls = [];

        sideTierGirlsID = [
            [[0], [0], [0]],
        ];
    }
    //Manga RPG villains and girls
    else if (['mangarpg_m'].some(testUniverse)) {
        trolls = ['Jeshtar', 'Troll Hound'];

        tierGirlsID = [
            [[0], [0], [0]],
            [['355325809', '417946225', '860641919'], [0], [0]],
        ];

        sideTrolls = [];

        sideTierGirlsID = [
            [[0], [0], [0]],
        ];
    }
}

var heroData;

function transformNutakuURL(url) {
    if (window.location.host.includes('nutaku') && !url.includes("sess=")) {
        return url.includes('?') ? `${url}&sess=${window.PLATFORM_SESS}` : `${url}?sess=${window.PLATFORM_SESS}`
    }
    return url
}

function calculateTime(deadline) {
    let currentTime = new Date();
    let remaining = Math.floor((deadline - currentTime.getTime())/1000);
    return convertToTimeFormat(remaining);
}

function convertToTimeFormat(remainingTime) {
    let remM = Math.floor(remainingTime / 60);
    let remS = remainingTime - remM*60;
    if(remainingTime < 0){
        remM = 0;
        remS = 0;
    }
    if(remM > 59){
        let remH = Math.floor(remM / 60);
        let remD = Math.floor(remH / 24);
        remM -= remH * 60;
        remH -= remD * 24;
        if (remD > 0) {
            if (remH > 0) return remD + labels.day + " " + remH + labels.hour + " ";
            else return remD + labels.day + " ";
        }
        else {
            if (remH > 0) {
                if (remM > 0) return remH + labels.hour + " " + remM + labels.minute + " ";
                else return remH + labels.hour + " ";
            }
            else return remM + labels.minute + " ";
        }
    }
    else if(remM > 0){
        if (remS > 9) return remM + labels.minute + " " + remS + labels.second;
        else return remM + labels.minute + " 0" + remS + labels.second;
    }
    if (remS > 9 || remS < 1) return remS + labels.second;
    else return "0" + remS + labels.second;
}

function convertToTimeFormatMinutes(remainingTime) {
    let remM = Math.floor(remainingTime /60);
    let remS = remainingTime - remM*60;
    if(remainingTime < 0){
        remM = 0;
        remS = 0;
    }
    if(remM > 59){
        let remH = Math.floor(remM / 60);
        remM -= remH * 60;
        return remH + labels.hour + " " + remM + labels.minute + " "
    }
    else if(remM > 0) return remM + labels.minute;
    else if(remS < 10 & remS > 0) return "0" + remS + labels.second;
    return remS + labels.second;
}

function parseTime(remainingTimeStr) {
    let indexDay = remainingTimeStr.indexOf(labels.day);
    let indexHour = remainingTimeStr.indexOf(labels.hour);
    let indexMinute = remainingTimeStr.indexOf(labels.minute);
    let indexSecond = remainingTimeStr.indexOf(labels.second);
    let day = indexDay == -1 ? 0 : parseInt(remainingTimeStr.substring(0, indexDay).trim());
    let hour = indexHour == -1 ? 0 : parseInt(remainingTimeStr.substring(indexDay+1, indexHour).trim());
    let minute = indexMinute == -1 ? 0 : parseInt(remainingTimeStr.substring(indexHour+1, indexMinute).trim());
    let second = indexSecond == -1 ? 0 : parseInt(remainingTimeStr.substring(indexMinute+1, indexSecond).trim());
    return (day*24*3600 + hour*3600 + minute*60 + second);
}


/* =========
	OPTIONS
   ========= */
function loadSetting(e){
    try {var temp = JSON.parse(localStorage.getItem('HHS.'+ e))}
    catch(err) {console.log(`HH++ OCD script error (Problem with localStorage): ${err.name}\n ${err.message}\n ${err.stack}`)}

    if (temp == null) {
        switch (e) {
            case 'villain':
                return true;
            case 'tiers':
                return true;
            case 'xpMoney':
                return true;
            case 'market':
                return true;
            case 'marketRestockButton':
                return false;
            case 'filterArmorItems':
                return true;
            case 'preventBoostersUse':
                return false;
            case 'harem':
                return true;
            case 'haremFilter':
                return true;
            case 'girlsItemsFilter':
                return true;
            case 'league':
                return true;
            case 'leagueBoard':
                return true;
            case 'simLeagueBoardFight':
                return true;
            case 'hideLeaguex3Button':
                return false;
            case 'leagueBoardBoostersStatus':
                return true;
            case 'leagueBoardCompactDisplay':
                return true;
            case 'simFight':
                return true;
            case 'seasonFightsSort':
                return true;
            case 'teamsFilter':
                return true;
            case 'champions':
                return true;
            case 'links':
                return true;
            case 'labyrinth':
                return true;
            case 'seasonStats':
                return true;
            case 'pachinkoNames':
                return true;
            case 'missionsBackground':
                return true;
            case 'collectMoneyAnimation':
                return false;
            case 'activitiesTabChoice':
                return true;
            case 'customizedHomeScreen':
                return true;
            case 'hideClaimedRewards':
                return true;
            case 'desktopDisplay':
                return false;
            case 'hideClaimAllButtons':
                return false;
            case 'hideMultipleLeagueBattlesButton':
                return false;
            case 'contestsExpiryTimer':
                return true;
            case 'hideGradeUpgradeKobanButton':
                return false;
            case 'hideIntroPictures':
                return false;
            case 'displayLoveRaidsInfo':
                return true;
            case 'hideLoveRaids':
                return false;
            case 'pentaDrillSort':
                return true;
        }
    }
    return temp
}

loadFeatures();

function loadFeatures() {
    if (loadSetting('hideIntroPictures')) hideIntroPictures();
    fixCSSIssues();

    setTimeout(() => {
        if (window.shared == undefined && window.Hero == undefined) return;

        heroData = window.Hero || window.shared.Hero;

        if (heroData.infos.questing.choices_adventure == 0) localStorage.setItem('HHS.mainAdventureWorldID', heroData.infos.questing.id_world);
        else if (heroData.infos.questing.choices_adventure == 1) localStorage.setItem('HHS.sideAdventureWorldID', heroData.infos.questing.id_world);

        if (['home'].some(testPage)) options();

        try {editTrollsAndTiers();} catch(err) {console.log(`HH++ OCD script error (Problem with trolls): ${err.name}\n ${err.message}\n ${err.stack}`)}

        //Features without options
        try {
            highlightClubMembers();
            setTimeout(() => {moduleEventEndIndicator();}, 2*timeout)
            stopOrgyBackgroundSwitching();
            displayGirlsShards();
            if (['battle'].some(testPage)) skipBattleValues();
            if (['activities'].some(testPage)) {
                fixDailyGoalsBug();
                sortDailyMissions();
            }
            notifySultryMysteriesShopRefresh();
            fixGirlStatsTooltipPosition();
            fixProfilePopup();
            fixLeaderboardHeroDisplay();
            unhideGirlPosePreview();
            if (['/seasonal.html'].some(testPage)) displayTopRankingTooltip();
            if (window.location.search.includes('?tab=sm_event_')) displayEventTimer();
            displaySeasonMojo();
        } catch(err) {console.log(`HH++ OCD script error (Problem with non optional features): ${err.name}\n ${err.message}\n ${err.stack}`)}

        //Show which modules are enabled and if so, run them when appropriate
        if (loadSetting('villain')) {
            if (['edit-team', 'waifu'].some(testPage))
                try {getHaremGirlsData()} catch(err) {console.log(`HH++ OCD script error (Problem with harem girls data): ${err.name}\n${err.message}\n${err.stack}`)}
            if (['characters'].some(testPage) || ['harem'].some(testPage))
                try {getNonHaremGirlsData()} catch(err) {console.log(`HH++ OCD script error (Problem with non harem girls data): ${err.name}\n${err.message}\n${err.stack}`)}
            try {moduleVillain()} catch(err) {console.log(`HH++ OCD script error (Problem with villain module): ${err.name}\n${err.message}\n${err.stack}`)}
        }
        if (loadSetting('xpMoney')) {
            try {moduleXP()} catch(err) {console.log(`HH++ OCD script error (Problem with XP module): ${err.name}\n${err.message}\n${err.stack}`)}
            try {moduleMoney()} catch(err) {console.log(`HH++ OCD script error (Problem with money module): ${err.name}\n${err.message}\n${err.stack}`)}
        }
        if (loadSetting('market')) {
            if (['shop'].some(testPage))
                try {moduleMarket()} catch(err) {console.log(`HH++ OCD script error (Problem with market module): ${err.name}\n${err.message}\n${err.stack}`)}
        }
        if (loadSetting('marketRestockButton')) {
            if (['shop'].some(testPage))
                try {moduleMarketRestockButton()} catch(err) {console.log(`HH++ OCD script error (Problem with market restock button): ${err.name}\n${err.message}\n${err.stack}`)}
        }
        if (loadSetting('filterArmorItems')) {
            if (['shop'].some(testPage))
                try {moduleFilterArmorItems();} catch(err) {console.log(`HH++ OCD script error (Problem with armor items filter): ${err.name}\n${err.message}\n${err.stack}`)}
            if (['mythic-equipment-upgrade'].some(testPage))
                try {moduleMythicEquipmentUpgrade()} catch(err) {console.log(`HH++ OCD script error (Problem with mythic equipment upgrade module): ${err.name}\n${err.message}\n${err.stack}`)}
        }
        if (loadSetting('preventBoostersUse')) {
            if (['shop'].some(testPage))
                try {modulePreventBoosters();} catch(err) {console.log(`HH++ OCD script error (Problem with prevent boosters use): ${err.name}\n${err.message}\n${err.stack}`)}
        }
        if (loadSetting('harem')) {
            if ((['edit-team', 'waifu'].some(testPage)) && !loadSetting('villain'))
                try {getHaremGirlsData()} catch(err) {console.log(`HH++ OCD script error (Problem with harem girls data): ${err.name}\n ${err.message}\n ${err.stack}`)}
            if (['characters'].some(testPage) || ['harem'].some(testPage)) {
                try {moduleHarem();} catch(err) {console.log(`HH++ OCD script error (Problem with Harem module): ${err.name}\n ${err.message}\n ${err.stack}`)}
                try {haremGetFilteredGirls()} catch(err) {console.log(`HH++ OCD script error (Problem with getting harem filtered girls): ${err.name}\n ${err.message}\n ${err.stack}`)}
                if (!loadSetting('villain'))
                    try {getNonHaremGirlsData()} catch(err) {console.log(`HH++ OCD script error (Problem with non harem girls data): ${err.name}\n ${err.message}\n ${err.stack}`)}
            }
            if (['/girl/'].some(testPage))
                try {haremGirlsShortcut()} catch(err) {console.log(`HH++ OCD script error (Problem with girls shortcuts): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('haremFilter')) {
            if (['characters'].some(testPage) || ['harem'].some(testPage)) {
                try {moduleHaremFilter()} catch(err) {console.log(`HH++ OCD script error (Problem with harem filter): ${err.name}\n ${err.message}\n ${err.stack}`)}
                if (!loadSetting('harem'))
                    try {haremGetFilteredGirls()} catch(err) {console.log(`HH++ OCD script error (Problem with getting harem filtered girls): ${err.name}\n ${err.message}\n ${err.stack}`)}
            }
            if (['/teams', 'labyrinth-pre-battle'].some(testPage))
                try {moduleTeamsCollector()} catch(err) {console.log(`HH++ OCD script error (Problem with teams collector module): ${err.name}\n ${err.message}\n ${err.stack}`)}
            if (['/girl/'].some(testPage) && !loadSetting('harem'))
                try {haremGirlsShortcut()} catch(err) {console.log(`HH++ OCD script error (Problem with girls shortcuts): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('girlsItemsFilter')) {
            if (['/girl/'].some(testPage))
                try {moduleFilterGirlsItems()} catch(err) {console.log(`HH++ OCD script error (Problem with girls items filter module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('league')) {
            moduleLeague()
            if (['leagues-pre-battle'].some(testPage))
                try {moduleLeagueOpponentsShortcut()} catch(err) {console.log(`HH++ OCD script error (Problem with league opponents shortcut module): ${err.name}\n ${err.message}\n ${err.stack}`)}
            if ((['/teams', 'labyrinth-pre-battle'].some(testPage)) && !loadSetting('haremFilter'))
                try {moduleTeamsCollector()} catch(err) {console.log(`HH++ OCD script error (Problem with teams collector module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('hideLeaguex3Button')) {
            if (['leagues-pre-battle'].some(testPage))
                try {moduleHideLeaguex3Button()} catch(err) {console.log(`HH++ OCD script error (Problem with hidding x3 button in league): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('simFight')) {
            if (['leagues-pre-battle'].some(testPage))
                try {moduleLeagueSim()} catch(err) {console.log(`HH++ OCD script error (Problem with league battle simulator): ${err.name}\n ${err.message}\n ${err.stack}`)}
            if (['season-arena'].some(testPage))
                try {moduleSeasonSim()} catch(err) {console.log(`HH++ OCD script error (Problem with season battle simulator): ${err.name}\n ${err.message}\n ${err.stack}`)}
            if (['troll-pre-battle', 'pantheon-pre-battle'].some(testPage))
                try {moduleBattleSim()} catch(err) {console.log(`HH++ OCD script error (Problem with villain battle simulator): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('teamsFilter')) {
            try {moduleTeamsFilter()} catch(err) {console.log(`HH++ OCD script error (Problem with team filter module): ${err.name}\n ${err.message}\n ${err.stack}`)}
            if (['labyrinth-pool-select'].some(testPage))
                try {moduleLabyrinthFilter()} catch(err) {console.log(`HH++ OCD script error (Problem with labyrinth filter module): ${err.name}\n ${err.message}\n ${err.stack}`)}
            if (['edit-labyrinth-team', 'edit-world-boss-team', 'edit-penta-drill-team'].some(testPage))
                try {moduleLabyrinthTeamFilter()} catch(err) {console.log(`HH++ OCD script error (Problem with labyrinth team filter module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('champions')) {
            try {moduleChampions()} catch(err) {console.log(`HH++ OCD script error (Problem with champions module): ${err.name}\n ${err.message}\n ${err.stack}`)}
            if (['clubs'].some(testPage))
                try {moduleClubChampionFeatures()} catch(err) {console.log(`HH++ OCD script error (Problem with club champion module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('links')) {
            try {moduleLinks()} catch(err) {console.log(`HH++ OCD script error(Problem with links module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('labyrinth')) {
            try {moduleLabyrinth()} catch(err) {console.log(`HH++ OCD script error (Problem with labyrinth module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('seasonStats')) {
            if (['season-battle', 'season.html', 'season-arena'].some(testPage))
                try {moduleSeasonStats()} catch(err) {console.log(`HH++ OCD script error (Problem with season stats module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('pachinkoNames')) {
            if (['edit-team', 'waifu'].some(testPage) && !loadSetting('villain') && !loadSetting('harem'))
                try {getHaremGirlsData()} catch(err) {console.log(`HH++ OCD script error (Problem with harem girls data): ${err.name}\n ${err.message}\n ${err.stack}`)}
            if ((['characters'].some(testPage) || ['harem'].some(testPage)) && !loadSetting('villain') && !loadSetting('harem'))
                try {getNonHaremGirlsData()} catch(err) {console.log(`HH++ OCD script error (Problem with non harem girls data): ${err.name}\n ${err.message}\n ${err.stack}`)}
            try {modulePachinkoNames()} catch(err) {console.log(`HH++ OCD script error (Problem with pachinko names module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('missionsBackground')) {
            try {moduleMissionsBackground()} catch(err) {console.log(`HH++ OCD script error (Problem with background missions module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('collectMoneyAnimation')) {
            try {moduleCollectMoneyAnimation()} catch(err) {console.log(`HH++ OCD script error (Problem with money animation module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('activitiesTabChoice') && CurrentPage == '/home.html') {
            try {moduleActivitiesTabChoice()} catch(err) {console.log(`HH++ OCD script error (Problem with activities tab choice module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('customizedHomeScreen') && CurrentPage == '/home.html') {
            try {moduleCustomizedHomeScreen()} catch(err) {console.log(`HH++ OCD script error (Problem with customized home screen module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('hideClaimedRewards')) {
            try {moduleHideClaimedRewards()} catch(err) {console.log(`HH++ OCD script error (Problem with hide claimed rewards module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('desktopDisplay')) {
            try {moduleDesktopDisplay()} catch(err) {console.log(`HH++ OCD script error (Problem with desktop display module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('hideClaimAllButtons')) {
            try {moduleHideClaimAllButtons()} catch(err) {console.log(`HH++ OCD script error (Problem with hide claim-all button module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('hideMultipleLeagueBattlesButton') && ['leagues'].some(testPage)) {
            try {moduleHideMultipleLeagueBattlesButton()} catch(err) {console.log(`HH++ OCD script error (Problem with hidding x15 button in league): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('contestsExpiryTimer') && ['activities'].some(testPage)) {
            try {moduleContestsExpiryTimer()} catch(err) {console.log(`HH++ OCD script error (Problem with contests timer module): ${err.name}\n ${err.message}\n ${err.stack}`)}
        }
        if (loadSetting('hideGradeUpgradeKobanButton')) {
            hideGradeUpgradeKobanButton();
        }
        if (loadSetting('displayLoveRaidsInfo') && ['/love-raids.html'].some(testPage)) {
            displayLoveRaidsInfo();
        }
        if (loadSetting('pentaDrillSort') && ['penta-drill-arena'].some(testPage)) {
            sortPentaDrillOpponents();
        }
    }, timeout);
}

function options() {
    //Options menu
    $('div#contains_all').append(`<a href="#"><img src="https://i.postimg.cc/c1F37PYz/icon-options.png" id="hhsButton"></a>`);
    $('div#contains_all').append(`<div id="hhsOptions" class="hhsTooltip" style="display: none;">
        <span class="close-settings-panel"></span>
        <div class="script_setting" style="grid-row-end: span 2;">
        <label class="switch"><input type="checkbox" hhs="villain"><span class="slider"></span></label>${labels.optionsVillain}<BR>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class="switch"><input type="checkbox" hhs="tiers"><span class="slider"></span></label>${labels.optionsTiers}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="xpMoney"><span class="slider"></span></label>${labels.optionsXPMoney}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="market"><span class="slider"></span></label>${labels.optionsMarket}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="marketRestockButton"><span class="slider"></span></label>${labels.optionsMarketRestockButton}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="filterArmorItems"><span class="slider"></span></label>${labels.optionsFilterArmorItems}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="preventBoostersUse"><span class="slider"></span></label>${labels.optionsPreventBoostersUse}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="harem"><span class="slider"></span></label>${labels.optionsHarem}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="haremFilter"><span class="slider"></span></label>${labels.optionsHaremFilters}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="girlsItemsFilter"><span class="slider"></span></label>${labels.optionsGirlsItemsFilter}<BR></div>
        <div class="script_setting" style="grid-row-end: span 5;">
        <label class="switch"><input type="checkbox" hhs="league"><span class="slider"></span></label>${labels.optionsLeague}<BR>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class="switch"><input type="checkbox" hhs="leagueBoard"><span class="slider"></span></label>${labels.optionsLeagueBoard}<BR>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class="switch"><input type="checkbox" hhs="simLeagueBoardFight"><span class="slider"></span></label>${labels.optionsSimLeagueBoardFight}<BR>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class="switch"><input type="checkbox" hhs="leagueBoardBoostersStatus"><span class="slider"></span></label>${labels.optionsLeagueBoostersStatus}<BR>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class="switch"><input type="checkbox" hhs="leagueBoardCompactDisplay"><span class="slider"></span></label>${labels.optionsLeagueCompactDisplay}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="hideMultipleLeagueBattlesButton"><span class="slider"></span></label>${labels.optionsHideMultipleLeagueBattlesButton}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="hideLeaguex3Button"><span class="slider"></span></label>${labels.optionsHideLeaguex3Button}<BR></div>
        <div class="script_setting" style="grid-row-end: span 2;">
        <label class="switch"><input type="checkbox" hhs="simFight"><span class="slider"></span></label>${labels.optionsSimFight}<BR>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class="switch"><input type="checkbox" hhs="seasonFightsSort"><span class="slider"></span></label>${labels.optionsSeasonFightsSort}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="teamsFilter"><span class="slider"></span></label>${labels.optionsTeamsFilter}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="champions"><span class="slider"></span></label>${labels.optionsChampions}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="links"><span class="slider"></span></label>${labels.optionsLinks}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="labyrinth"><span class="slider"></span></label>${labels.optionsLabyrinth}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="seasonStats"><span class="slider"></span></label>${labels.optionsSeasonStats}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="pachinkoNames"><span class="slider"></span></label>${labels.optionsPachinkoNames}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="missionsBackground"><span class="slider"></span></label>${labels.optionsMissionsBackground}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="collectMoneyAnimation"><span class="slider"></span></label>${labels.optionsCollectMoneyAnimation}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="activitiesTabChoice"><span class="slider"></span></label>${labels.optionsActivitiesTabChoice}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="customizedHomeScreen"><span class="slider"></span></label>${labels.optionsCustomizedHomeScreen}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="hideClaimedRewards"><span class="slider"></span></label>${labels.optionsHideClaimedRewards}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="desktopDisplay"><span class="slider"></span></label>${labels.optionsDesktopDisplay}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="hideClaimAllButtons"><span class="slider"></span></label>${labels.optionsHideClaimAllButtons}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="contestsExpiryTimer"><span class="slider"></span></label>${labels.optionsContestsExpiryTimer}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="hideGradeUpgradeKobanButton"><span class="slider"></span></label>${labels.optionsHideGradeUpgradeKobanButton}<BR></div>
        <div class="script_setting" style="grid-row-end: span 2;">
        <label class="switch"><input type="checkbox" hhs="displayLoveRaidsInfo"><span class="slider"></span></label>${labels.optionsDisplayLoveRaidsInfo}<BR>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class="switch"><input type="checkbox" hhs="hideLoveRaids"><span class="slider"></span></label>${labels.optionsHideFinishedLoveRaids}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="hideIntroPictures"><span class="slider"></span></label>${labels.optionsHideIntroPictures}<BR></div>
        <div class="script_setting">
        <label class="switch"><input type="checkbox" hhs="pentaDrillSort"><span class="slider"></span></label>${labels.optionsPentaDrillSort}<BR></div>
        </div>`
    );

    //Show and hide options menu
    $('#hhsButton').click(() => {
        let x = document.getElementById('hhsOptions');
        if (x.style.display == 'none') x.style.display = 'grid';
        else x.style.display = 'none';
    });
    Array.from($('[hhs]')).forEach((input) => {
        $(input).attr('checked', loadSetting($(input).attr('hhs')))
    })
    Array.from($('[hhs]')).forEach((input) => {
                $(input).click(() => localStorage.setItem('HHS.'+$(input).attr('hhs'), $(input).prop('checked')))
    })
    $('#hhsOptions .close-settings-panel').click(() => {
        let x = document.getElementById('hhsOptions');
        x.style.display = 'none';
    });

    //Dependency of villain menu options
    $('[hhs=villain]').click(() => {
        if (!$(this).is(':checked')) {
            $('[hhs=tiers]').prop('checked', false);
            localStorage.setItem('HHS.tiers', false)
        }
    });
    $('[hhs=tiers]').click(() => {
        if ($(this).is(':checked')) {
            $('[hhs=villain]').prop('checked', true);
            localStorage.setItem('HHS.villain', true)
        }
    });

    //Dependency of league info options
    $('[hhs=league]').click(() => {
        if (!$(this).is(':checked')) {
            $('[hhs=leagueBoard]').prop('checked', false);
            localStorage.setItem('HHS.leagueBoard', false);

            $('[hhs=simLeagueBoardFight]').prop('checked', false);
            localStorage.setItem('HHS.simLeagueBoardFight', false);

            $('[hhs=leagueBoardBoostersStatus]').prop('checked', false);
            localStorage.setItem('HHS.leagueBoardBoostersStatus', false);

            $('[hhs=leagueBoardCompactDisplay]').prop('checked', false);
            localStorage.setItem('HHS.leagueBoardCompactDisplay', false);
        }
        else if ($(this).is(':checked')) {
            $('[hhs=leagueBoard]').prop('checked', true);
            localStorage.setItem('HHS.leagueBoard', true);

            $('[hhs=simLeagueBoardFight]').prop('checked', true);
            localStorage.setItem('HHS.simLeagueBoardFight', true);

            $('[hhs=leagueBoardBoostersStatus]').prop('checked', false);
            localStorage.setItem('HHS.leagueBoardBoostersStatus', false);

            $('[hhs=leagueBoardCompactDisplay]').prop('checked', false);
            localStorage.setItem('HHS.leagueBoardCompactDisplay', false);
        }
    });
    $('[hhs=leagueBoard]').click(() => {
        if ($(this).is(':checked')) {
            $('[hhs=league]').prop('checked', true);
            localStorage.setItem('HHS.league', true);
        }
    });
    $('[hhs=simLeagueBoardFight]').click(() => {
        if ($(this).is(':checked')) {
            $('[hhs=league]').prop('checked', true);
            localStorage.setItem('HHS.league', true);
        }
    });
    $('[hhs=leagueBoardBoostersStatus]').click(() => {
        if ($(this).is(':checked')) {
            $('[hhs=league]').prop('checked', true);
            localStorage.setItem('HHS.league', true);
        }
    });
    $('[hhs=leagueBoardCompactDisplay]').click(() => {
        if ($(this).is(':checked')) {
            $('[hhs=league]').prop('checked', true);
            localStorage.setItem('HHS.league', true);
        }
    });

    //Dependency of sim fights options
    $('[hhs=simFight]').click(() => {
        if (!$(this).is(':checked')) {
            $('[hhs=seasonFightsSort]').prop('checked', false);
            localStorage.setItem('HHS.seasonFightsSort', false)
        }
    });
    $('[hhs=seasonFightsSort]').click(() => {
        if ($(this).is(':checked')) {
            $('[hhs=simFight]').prop('checked', true);
            localStorage.setItem('HHS.simFight', true)
        }
    });

    //Dependency of Love Raids options
    $('[hhs=displayLoveRaidsInfo]').click(() => {
        if (!$(this).is(':checked')) {
            $('[hhs=hideLoveRaids]').prop('checked', false);
            localStorage.setItem('HHS.hideLoveRaids', false)
        }
    });
    $('[hhs=hideLoveRaids]').click(() => {
        if ($(this).is(':checked')) {
            $('[hhs=displayLoveRaidsInfo]').prop('checked', true);
            localStorage.setItem('HHS.displayLoveRaidsInfo', true)
        }
    });

    //CSS
    sheet.insertRule(`#hhsButton {
        height: 35px;
        position: absolute;
        z-index: 10;
        filter: drop-shadow(0px 0px 5px white);}`
    );

    if ($('.hh-plus-plus-config-button').length > 0) {
        if (loadSetting('customizedHomeScreen')) {
            sheet.insertRule(`${mediaDesktop} {
                    #hhsButton {
                right: 130px;
                top: 100px;}}`
            );

            sheet.insertRule(`${mediaMobile} {
                    #hhsButton {
                right: 140px;
                top: 114px;}}`
            );

            sheet.insertRule(`.hh-plus-plus-config-button {
                top: 100px !important;}`
            );
        }
        else {
            sheet.insertRule(`${mediaDesktop} {
                    #hhsButton {
                right: 130px;
                top: 90px;}}`
            );

            sheet.insertRule(`${mediaMobile} {
                    #hhsButton {
                right: 150px;
                top: 100px;}}`
            );

            sheet.insertRule(`${mediaDesktop} {
                .hh-plus-plus-config-button {
                top: 90px !important;}}`
            );

            sheet.insertRule(`${mediaMobile} {
                .hh-plus-plus-config-button {
                top: 80px !important;}}`
            );
        }
    }
    else {
        if (loadSetting('customizedHomeScreen')) {
            sheet.insertRule(`${mediaDesktop} {
                #hhsButton {
                right: 42px;
                top: 100px;}}`
            );

            sheet.insertRule(`${mediaMobile} {
                    #hhsButton {
                right: 45px;
                top: 114px;}}`
            );
        }
        else {
            sheet.insertRule(`${mediaDesktop} {
                #hhsButton {
                right: 42px;
                top: 90px;}}`
            );

            sheet.insertRule(`${mediaMobile} {
                    #hhsButton {
                right: 150px;
                top: 100px;}}`
            );
        }
    }

    sheet.insertRule(`${mediaMobile} {
            .hh-plus-plus-config-button {
        transform: scale(0.7);}}`
    );

    sheet.insertRule(`.hhsTooltip {
        grid-template-columns: 1fr 1fr;
        overflow: auto;
        text-align: left;
        z-index: 99;
        padding: 3px 5px 3px 5px;
        border: 2px solid #905312;
        border-radius: 6px;
        background-color: rgba(32,3,7,.9);
        position: absolute;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .hhsTooltip {
        width: 99%;
        left: 10px;
        top: 5px;
        max-height: 99%;
        font-size: 18px;
        line-height: 36px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .hhsTooltip {
        width: 98%;
        left: 10px;
        top: 68px;
        max-height: 88%;
        font-size: 14px;
        line-height: 28px;}}`
    );

    sheet.insertRule(`.close-settings-panel {
        position: fixed;
        display: block;
        background-size: cover;
        background-image: url(https://hh2.hh-content.com/clubs/ic_xCross.png);
        height: 37px;
        width: 41px;
        top: 80px;
        right: 28px;
        cursor: pointer;}`
    );

    sheet.insertRule(`.hhsTooltip .script_setting label input {
        display: none;}`
    );

    sheet.insertRule(`.switch {
        position: relative;
        display: inline-block;
        width: 34px;
        height: 17px;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .switch {
        top: -10px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .switch {
        top: -6px;}}`
    );

    sheet.insertRule(`.slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #CCCCCC;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 17px;
        margin-right: 4px;}`
    );

    sheet.insertRule(`.slider:before {
        position: absolute;
        content: \'\';
        height: 13px;
        width: 13px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;}`
    );

    sheet.insertRule(`input:checked + .slider {
        background-color: #F11F64;}`
    );

    sheet.insertRule(`input:checked + .slider:before {
        -webkit-transform: translateX(13px);
        -ms-transform: translateX(13px);
        transform: translateX(13px);}`
    );

    sheet.insertRule(`.script_setting {
        padding-right: 5px;}`
    );
}


/* ======================
	FIGHT A VILLAIN MENU
   ====================== */

function moduleVillain() {
    //Create localStorage if it doesn't exist yet
    if (!localStorage.getItem('HHS.mainAdventureWorldID') || localStorage.getItem('HHS.mainAdventureWorldID') == "" || localStorage.getItem('HHS.mainAdventureWorldID') == 'undefined')
        localStorage.setItem('HHS.mainAdventureWorldID', 0);
    if (!localStorage.getItem('HHS.sideAdventureWorldID') || localStorage.getItem('HHS.sideAdventureWorldID') == "" || localStorage.getItem('HHS.sideAdventureWorldID') == 'undefined')
        localStorage.setItem('HHS.sideAdventureWorldID', 0);
    if (!localStorage.getItem('HHS.eventTrolls') || localStorage.getItem('HHS.eventTrolls') == "" || localStorage.getItem('HHS.eventTrolls') == 'undefined')
        localStorage.setItem('HHS.eventTrolls', JSON.stringify([]));
    if (!localStorage.getItem('HHS.raidTrolls') || localStorage.getItem('HHS.raidTrolls') == "" || localStorage.getItem('HHS.raidTrolls') == 'undefined')
        localStorage.setItem('HHS.raidTrolls', JSON.stringify([]));
    if (!localStorage.getItem('HHS.mythicEventTrolls') || localStorage.getItem('HHS.mythicEventTrolls') == "" || localStorage.getItem('HHS.mythicEventTrolls') == 'undefined')
        localStorage.setItem('HHS.mythicEventTrolls', JSON.stringify([]));
    if (!localStorage.getItem('HHS.tierGirlsOwned') || localStorage.getItem('HHS.tierGirlsOwned') == "" || localStorage.getItem('HHS.tierGirlsOwned') == 'undefined')
        localStorage.setItem('HHS.tierGirlsOwned', JSON.stringify([[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]));
    if (!localStorage.getItem('HHS.sideTierGirlsOwned') || localStorage.getItem('HHS.sideTierGirlsOwned') == "" || localStorage.getItem('HHS.sideTierGirlsOwned') == 'undefined')
        localStorage.setItem('HHS.sideTierGirlsOwned', JSON.stringify([[]]));
    if (!localStorage.getItem('HHS.HHPNMap'))
        localStorage.setItem('HHS.HHPNMap', JSON.stringify([]));
    if (!localStorage.getItem('HHS.HHPNShardsMap'))
        localStorage.setItem('HHS.HHPNShardsMap', JSON.stringify([]));
    if (!localStorage.getItem('HHS.HHPNSkinsMap'))
        localStorage.setItem('HHS.HHPNSkinsMap', JSON.stringify([]));

    let mainAdventureWorldID = parseInt(localStorage.getItem('HHS.mainAdventureWorldID'), 10);
    let sideAdventureWorldID = parseInt(localStorage.getItem('HHS.sideAdventureWorldID'), 10);
    let eventTrolls = JSON.parse(localStorage.getItem('HHS.eventTrolls'));
    let raidTrolls = JSON.parse(localStorage.getItem('HHS.raidTrolls'));
    let mythicEventTrolls = JSON.parse(localStorage.getItem('HHS.mythicEventTrolls'));
    let tierGirlsOwned = JSON.parse(localStorage.getItem('HHS.tierGirlsOwned'));
    let sideTierGirlsOwned = JSON.parse(localStorage.getItem('HHS.sideTierGirlsOwned'));
    const girlDictionary = new Map(JSON.parse(localStorage.getItem('HHS.HHPNMap')));
    const girlShardsDictionary = new Map(JSON.parse(localStorage.getItem('HHS.HHPNShardsMap')));
    const girlSkinsDictionary = new Map(JSON.parse(localStorage.getItem('HHS.HHPNSkinsMap')));
    let	includeTiers = false;
    let eventEndTime = localStorage.getItem('HHS.eventTime') || 0;
    let mythicEventEndTime = localStorage.getItem('HHS.mythicEventTime') || 0;

    if (loadSetting('tiers')) includeTiers = true;

    if (Math.floor(new Date().getTime()/1000) > eventEndTime) localStorage.setItem('HHS.eventTrolls', JSON.stringify([]));
    if (Math.floor(new Date().getTime()/1000) > mythicEventEndTime) localStorage.setItem('HHS.mythicEventTrolls', JSON.stringify([]));

    //Get shards info from event widget
    if (window.location.search.includes("tab=event") || window.location.search.includes("tab=kinky_event")) {
        let totalGirls = window.event_girls.length;
        for (let i=0; i<totalGirls; i++) {
            let girlId = parseInt(window.event_girls[i].id_girl, 10);
            let girlName = window.event_girls[i].name;
            let girlShards = window.event_girls[i].shards;
            let girlSkinShards;
            if (window.event_girls[i].preview.grade_skins_data.length > 0) {
                let j=0;
                let exit = 0;
                while (j<window.event_girls[i].preview.grade_skins_data.length && exit == 0) {
                    if (window.event_girls[i].preview.grade_skins_data[j].is_owned) j++;
                    else exit = 1;
                }
                girlSkinShards = (j == window.event_girls[i].preview.grade_skins_data.length) ? 33 : window.event_girls[i].preview.grade_skins_data[j].shards_count;
            }
            else girlSkinShards = 'none';

            if (girlShards < 100 && girlSkinShards == 'none') {
                let girlData = {id: girlId,
                                n: girlName,
                                sh: girlShards}
                girlShardsDictionary.set(girlId, girlData);
            }
            else if (girlShards < 100 && girlSkinShards != 'none') {
                let girlData = {id: girlId,
                                n: girlName,
                                sh: girlShards};
                let girlSkinData = {id: girlId,
                                n: girlName,
                                sh: 0};
                girlShardsDictionary.set(girlId, girlData);
                girlSkinsDictionary.set(girlId, girlSkinData);
            }
            else if (girlShards >= 100 && girlSkinShards != 'none') {
                let girlSkinData = {id: girlId,
                                    n: girlName,
                                    sh: girlSkinShards};
                girlShardsDictionary.delete(girlId);
                girlSkinsDictionary.set(girlId, girlSkinData);
            }
            else girlShardsDictionary.delete(girlId);
        }
        localStorage.setItem('HHS.HHPNShardsMap', JSON.stringify(Array.from(girlShardsDictionary.entries())));
        localStorage.setItem('HHS.HHPNSkinsMap', JSON.stringify(Array.from(girlSkinsDictionary.entries())));
    }

    if (window.location.search.includes("tab=event")) {
        let eventRemainingTime = parseInt(window.event_data.seconds_until_event_end, 10);
        eventEndTime = Math.floor(new Date().getTime()/1000) + eventRemainingTime;
        localStorage.setItem('HHS.eventTime', eventEndTime);

        eventTrolls = [];

        let totalGirls = window.event_girls.length;
        for (let i=0; i<totalGirls; i++) {
            let girlId = window.event_girls[i].id_girl;
            let girlRarity = window.event_girls[i].rarity;

            let girlLocation = (window.event_girls[i].source.anchor_source != null) ? window.event_girls[i].source.anchor_source.url : "";
            if (girlLocation.includes('troll-pre-battle')) eventTrolls.push({id: girlId, troll: girlLocation.substring(35), rarity: girlRarity});
        }
        localStorage.setItem('HHS.eventTrolls', JSON.stringify(eventTrolls));
    }

    if (window.location.search.includes("tab=mythic_event")) {
        let eventRemainingTime = parseInt(window.event_data.seconds_until_event_end, 10);
        mythicEventEndTime = Math.floor(new Date().getTime()/1000) + eventRemainingTime;
        localStorage.setItem('HHS.mythicEventTime', mythicEventEndTime);

        mythicEventTrolls = [];

        let totalGirls = window.event_girls.length;
        for (let i=0; i<totalGirls; i++) {
            let girlId = window.event_girls[i].id_girl;
            let girlRarity = window.event_girls[i].rarity;
            let girlName = window.event_girls[i].name;
            let girlShards = window.event_girls[i].shards;
            let girlSkinShards;

            if (window.event_girls[i].preview.grade_skins_data.length > 0) {
                let j=0;
                let exit = 0;
                while (j<window.event_girls[i].preview.grade_skins_data.length && exit == 0) {
                    if (window.event_girls[i].preview.grade_skins_data[j].is_owned) j++;
                    else exit = 1;
                }
                girlSkinShards = (j == window.event_girls[i].preview.grade_skins_data.length) ? 33 : window.event_girls[i].preview.grade_skins_data[j].shards_count;
            }
            else girlSkinShards = 'none';

            let girlLocation = window.event_girls[i].source.anchor_source.url;
            if (girlLocation.includes('troll-pre-battle')) mythicEventTrolls.push({id: girlId, troll: girlLocation.substring(35), rarity: girlRarity});

            if (girlShards < 100 && girlSkinShards == 'none') {
                let girlData = {id: girlId,
                                n: girlName,
                                sh: girlShards}
                girlShardsDictionary.set(girlId, girlData);
            }
            else if (girlShards < 100 && girlSkinShards != 'none') {
                let girlData = {id: girlId,
                                n: girlName,
                                sh: girlShards};
                let girlSkinData = {id: girlId,
                                n: girlName,
                                sh: 0};
                girlShardsDictionary.set(girlId, girlData);
                girlSkinsDictionary.set(girlId, girlSkinData);
            }
            else if (girlShards >= 100 && girlSkinShards != 'none') {
                let girlSkinData = {id: girlId,
                                    n: girlName,
                                    sh: girlSkinShards};
                girlShardsDictionary.delete(girlId);
                girlSkinsDictionary.set(girlId, girlSkinData);
            }
            else girlShardsDictionary.delete(girlId);
        }
        localStorage.setItem('HHS.mythicEventTrolls', JSON.stringify(mythicEventTrolls));
        localStorage.setItem('HHS.HHPNShardsMap', JSON.stringify(Array.from(girlShardsDictionary.entries())));
        localStorage.setItem('HHS.HHPNSkinsMap', JSON.stringify(Array.from(girlSkinsDictionary.entries())));
    }

    if (['love-raids'].some(testPage)) {
        let raidTrolls = [];
        for (let i=0; i<love_raids.length; i++) {
            if (love_raids[i].status == 'ongoing') {
                let raidRemainingTime = parseInt(love_raids[i].seconds_until_event_end, 10);
                let raidEndTime = window.server_now_ts + raidRemainingTime;

                let girlId = love_raids[i].id_girl;
                let girlName = love_raids[i].girl_data.name;
                let girlRarity = love_raids[i].girl_data.rarity;
                let girlShards = love_raids[i].girl_data.shards;
                let girlLocation = (love_raids[i].girl_data.source.anchor_source != null) ? love_raids[i].girl_data.source.anchor_source.url : "";
                if (girlLocation.includes('troll-pre-battle')) raidTrolls.push({id: girlId, troll: girlLocation.substring(35), rarity: girlRarity, endTime: raidEndTime});

                if ($('.raid-card')[i].classList.contains('multiple-girl')) {
                    let girlSkinShards = parseInt($($($('.raid-card')[i].getElementsByClassName('shards'))[1]).attr('skins-shard'), 10);
                    let girlData = {id: girlId,
                                    n: girlName,
                                    sh: girlSkinShards}
                    girlSkinsDictionary.set(girlId, girlData);
                }

                if (girlShards < 100) {
                    let girlData = {id: girlId,
                                    n: girlName,
                                    sh: girlShards}
                    girlShardsDictionary.set(girlId, girlData);
                }
            }
        }
        localStorage.setItem('HHS.raidTrolls', JSON.stringify(raidTrolls));
        localStorage.setItem('HHS.HHPNShardsMap', JSON.stringify(Array.from(girlShardsDictionary.entries())));
        localStorage.setItem('HHS.HHPNSkinsMap', JSON.stringify(Array.from(girlSkinsDictionary.entries())));
    }

    if (includeTiers) {
        //Check if villain tier girls have been collected (to update when a new villain is added)
        tierGirlsOwned = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
        sideTierGirlsOwned = [[], []];

        for (let tIdx = 0; tIdx < tierGirlsID.length; tIdx++) {
            for (let pIdx = 0; pIdx < tierGirlsID[tIdx].length; pIdx++) {
                tierGirlsOwned[tIdx][pIdx] = true;
                for (let gIdx = 0; gIdx < tierGirlsID[tIdx][pIdx].length; gIdx++) {
                    let idGirl = parseInt(tierGirlsID[tIdx][pIdx][gIdx], 10);
                    if (idGirl == 0) tierGirlsOwned[tIdx][pIdx] = true;
                    else if (!girlDictionary.get(idGirl)) tierGirlsOwned[tIdx][pIdx] = false;
                }

            }
        }

        for (let tIdx = 0; tIdx < sideTierGirlsID.length; tIdx++) {
            for (let pIdx = 0; pIdx < sideTierGirlsID[tIdx].length; pIdx++) {
                sideTierGirlsOwned[tIdx][pIdx] = true;
                for (let gIdx = 0; gIdx < sideTierGirlsID[tIdx][pIdx].length; gIdx++) {
                    let idGirl = parseInt(sideTierGirlsID[tIdx][pIdx][gIdx], 10);
                    if (idGirl == 0) sideTierGirlsOwned[tIdx][pIdx] = true;
                    else if (!girlDictionary.get(idGirl)) sideTierGirlsOwned[tIdx][pIdx] = false;
                }

            }
        }

        localStorage.setItem('HHS.tierGirlsOwned', JSON.stringify(tierGirlsOwned));
        localStorage.setItem('HHS.sideTierGirlsOwned', JSON.stringify(sideTierGirlsOwned));
    }

    //To update when a new villain is added.
    let troll_rewards = [
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span>&nbsp;<span class="energy_reward"></span>&nbsp;<span class="fire_gem"></span>&nbsp;<span class="sun_gem"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="darkness_gem"></span>&nbsp;<span class="light_gem"></span>&nbsp;<span class="book_reward"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="psychic_gem"></span>&nbsp;<span class="water_gem"></span>&nbsp;<span class="gift_reward"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span>&nbsp;<span class="orbEq_reward"></span>&nbsp;<span class="nature_gem"></span>&nbsp;<span class="stone_gem"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span>&nbsp;<span class="lightBulb_reward"></span>&nbsp;<span class="darkness_gem"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span>&nbsp;<span class="kiss_reward"></span>&nbsp;<span class="light_gem"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span>&nbsp;<span class="psychic_gem"></span>&nbsp;<span class="booster_reward"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span>&nbsp;<span class="orbEP_reward"></span>&nbsp;<span class="water_gem"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span>&nbsp;<span class="lightBulb_reward"></span>&nbsp;<span class="fire_gem"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="nature_gem"></span>&nbsp;<span class="gift_reward"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="stone_gem"></span>&nbsp;<span class="book_reward"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="sun_gem"></span>&nbsp;<span class="gift_reward"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span>&nbsp;<span class="orbEq_reward"></span>&nbsp;<span class="darkness_gem"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span>&nbsp;<span class="kiss_reward"></span>&nbsp;<span class="light_gem"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span>&nbsp;<span class="lightBulb_reward"></span>&nbsp;<span class="psychic_gem"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span>&nbsp;<span class="water_gem"></span>&nbsp;<span class="booster_reward"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="fire_gem"></span>&nbsp;<span class="book_reward"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="nature_gem"></span>&nbsp;<span class="gift_reward"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span>&nbsp;<span class="kiss_reward"></span>&nbsp;<span class="stone_gem"></span>',
        '&nbsp;<span class="ticket_reward"></span>&nbsp;<span class="money_reward"></span><span class="lightBulb_reward"></span>&nbsp;<span class="sun_gem"></span>',
                   ];

    let trollName = '',
        trollNameTiers = '',
        trollRewards = '',
        trollsMenu = '',
        sideTrollsMenu = '',
        //Associate  the world ID (first number) to its villain ID (second number): world_ID: villain_ID
        worldID = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21],
        trollsId = {2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9, 11: 10, 12: 11, 13: 12, 14: 13, 15: 14, 16: 15, 17: 16, 18: 17, 19: 18, 21: 19},
        sideWorldID = [22, 23],
        sideTrollsId = {22: 20, 23: 21};

    //Comix Harem
    if (['comix_c', 'nutaku_c'].some(testUniverse)) {
        //To update when a new villain is added.
        worldID = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        trollsId = {2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9, 11: 10, 12: 11, 13: 12};
        sideWorldID = [];
        sideTrollsId = {};
    }

    //Pornstar Harem
    if (['star_t', 'nutaku_t'].some(testUniverse)) {
        //To update when a new villain is added.
        worldID = [2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 16, 18, 20, 23, 26, 27];
        trollsId = {2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9, 14: 11, 16: 12, 18: 13, 20: 14, 23: 15, 26: 17, 27: 18};
        sideWorldID = [];
        sideTrollsId = {};
    }

    //Transpornstar harem
    if (['dotcom_startrans', 'nutaku_startrans'].some(testUniverse)) {
        //To update when a new villain is added.
        worldID = [2, 3, 5, 6, 7, 8, 9, 11];
        trollsId = {2: 1, 3: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7, 11: 8};
        sideWorldID = [];
        sideTrollsId = {};
    }

    //Gaypornstar harem
    if (['dotcom_stargay', 'nutaku_stargay'].some(testUniverse)) {
        //To update when a new villain is added.
        worldID = [2, 6, 7, 10, 11, 13, 16, 17];
        trollsId = {2: 1, 6: 2, 7: 3, 10: 4, 11: 5, 13: 6, 16: 7, 17: 8};
        sideWorldID = [];
        sideTrollsId = {};
    }

    //Manga RPG
    if (['mangarpg_m'].some(testUniverse)) {
        //To update when a new villain is added.
        worldID = [2, 3];
        trollsId = {2: 1, 3: 3};
        sideWorldID = [];
        sideTrollsId = {};
    }

    let lastMainWorldIndex = (worldID.indexOf(mainAdventureWorldID) == -1) ? worldID.length-1 : worldID.indexOf(mainAdventureWorldID);
    let lastSideWorldIndex = (sideWorldID.indexOf(sideAdventureWorldID) == -1 && sideAdventureWorldID >= sideWorldID[0]) ? sideWorldID.length-1 : sideWorldID.indexOf(sideAdventureWorldID);

    for (let i=0; i<=lastMainWorldIndex; i++) {
        if (typeof trolls[i] !== typeof undefined && trolls[i] !== false) {
            trollName = trolls[i];
            trollRewards = troll_rewards[i];
            if (includeTiers) {
                trollNameTiers = ' ';
                if (!(tierGirlsOwned[i][0])) {
                    trollNameTiers = trollNameTiers + '&#185;';
                }
                if (!(tierGirlsOwned[i][1])) {
                    trollNameTiers = trollNameTiers + '&#178;';
                }
                if (!(tierGirlsOwned[i][2])) {
                    trollNameTiers = trollNameTiers + '&#179;';
                }
            }
        }
        else trollName = labels.world + ' ' + (worldID[worldID.length-1]+1) + ' ' + labels.villain;

        let type = 'regular';
        for (let j = 0; j < eventTrolls.length; j++) {
            let shards = girlShardsDictionary.get(parseInt(eventTrolls[j].id, 10)) ? girlShardsDictionary.get(parseInt(eventTrolls[j].id, 10)).sh : 0;
            if (eventTrolls[j].troll == trollsId[worldID[i]] && shards < 100) {
                type = `eventTroll ${eventTrolls[j].rarity}`;
            }
        }

        for (let j = 0; j < raidTrolls.length; j++) {
            if (raidTrolls[j].troll == trollsId[worldID[i]] && window.server_now_ts < raidTrolls[j].endTime) {
                type = `eventTroll ${raidTrolls[j].rarity}`;
            }
        }

        for (let j = 0; j < mythicEventTrolls.length; j++) {
            let shards = girlShardsDictionary.get(parseInt(mythicEventTrolls[j].id, 10)) ? girlShardsDictionary.get(parseInt(mythicEventTrolls[j].id, 10)).sh : 0;
            if (mythicEventTrolls[j].troll == trollsId[worldID[i]] && shards < 100) {
                type = `eventTroll ${mythicEventTrolls[j].rarity}`;
            }
        }
        if(heroData.infos.questing.choices_adventure == 0)
            trollsMenu += `<a class="${type}" href="${transformNutakuURL('/troll-pre-battle.html?id_opponent=' + trollsId[worldID[i]])}"> ${trollName} ${trollNameTiers} </a> ${trollRewards} &nbsp;&nbsp; <a class="troll_world_script" href="${transformNutakuURL('/world/' + worldID[i])}"></a><BR>`;
        else
            trollsMenu += `<a class="${type}" href="${transformNutakuURL('/troll-pre-battle.html?id_opponent=' + trollsId[worldID[i]])}"> ${trollName} ${trollNameTiers} </a> ${trollRewards}<BR>`;
    }

    for (let i=0; i<=lastSideWorldIndex; i++) {
        if (typeof sideTrolls[i] !== typeof undefined && sideTrolls[i] !== false) {
            trollName = sideTrolls[i];
            trollRewards = troll_rewards[i];
            if (includeTiers) {
                trollNameTiers = ' ';
                if (!(sideTierGirlsOwned[i][0])) {
                    trollNameTiers = trollNameTiers + '&#185;';
                }
                if (!(sideTierGirlsOwned[i][1])) {
                    trollNameTiers = trollNameTiers + '&#178;';
                }
                if (!(sideTierGirlsOwned[i][2])) {
                    trollNameTiers = trollNameTiers + '&#179;';
                }
            }
        }
        else trollName = labels.world + ' ' + (sideWorldID[sideWorldID.length-1]+1) + ' ' + labels.villain;

        let type = 'regular';

        if(heroData.infos.questing.choices_adventure == 1)
            sideTrollsMenu += `<a class="${type}" href="${transformNutakuURL('/troll-pre-battle.html?id_opponent=' + sideTrollsId[sideWorldID[i]])}"> ${trollName} ${trollNameTiers} </a> ${trollRewards} &nbsp;&nbsp; <a class="troll_world_script" href="${transformNutakuURL('/world/' + sideWorldID[i])}"></a><BR>`;
        else
            sideTrollsMenu += `<a class="${type}" href="${transformNutakuURL('/troll-pre-battle.html?id_opponent=' + sideTrollsId[sideWorldID[i]])}"> ${trollName} ${trollNameTiers} </a> ${trollRewards}<BR>`;
    }

    this.$overlay = $('<div class="script-fight-a-villain-menu-overlay"></div>');
    $('body').append(this.$overlay);

    this.$overlay.click(() => {
        this.$container.removeClass('shown');
        this.$overlay.removeClass('shown');
    });

    $('#fight_energy_bar .bar-wrapper').click(() => {
        if (!this.$container) {
            this.$container = $(`<div class="script-fight-a-villain-menu-container fixed_scaled"></div>`);
            this.$container.append(`<div class="TrollsMenu" id="TrollsID">${trollsMenu}</div>`);
            this.$container.append(`<div class="TrollsMenu" id="SideTrollsID">${sideTrollsMenu}</div>`);
            $('body').append(this.$container);
        }
        this.$container.addClass('shown');
        this.$overlay.addClass('shown');
    });

    //CSS
    sheet.insertRule(`#fight_energy_bar .bar-wrapper {
        cursor: pointer;}`
    );

    sheet.insertRule(`.script-fight-a-villain-menu-overlay {
        display: none;
        background-color: #0808087a;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9;}`
    );

    sheet.insertRule(`.script-fight-a-villain-menu-overlay.shown {
        display: block;}`
    );

    sheet.insertRule(`.script-fight-a-villain-menu-container {
        display: none;
        align-items: start;
        justify-content: center;
        color: #fff;
        width: 1040px;
        height: 585px;
        z-index: 10;
        font-size: 16px;
        pointer-events: none;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .script-fight-a-villain-menu-container {
        gap: 20px;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .script-fight-a-villain-menu-container {
        gap: 2px;}`
    );

    sheet.insertRule(`.script-fight-a-villain-menu-container.shown {
        display: flex;}`
    );

    sheet.insertRule(`.TrollsMenu {
        position: relative;
        overflow: auto;
        column-width: auto;
        width: max-content;
        border-radius: 8px 8px 8px 8px;
        background-color: rgba(0,0,0,.8);
        box-shadow: 0 0 0 1px rgba(255,255,255,0.73);
        font-weight: 400;
        letter-spacing: .22px;
        color: #fff;
        text-align: center;
        pointer-events: all;}`
    );

    sheet.insertRule(`#TrollsID {
        column-count: 2;`
    );

    sheet.insertRule(`#SideTrollsID {
        column-count: 1;`
    );

    sheet.insertRule(`${mediaDesktop} {
            .TrollsMenu, .TrollsMessage {
        top: 66px;
        max-height: 87%;
        line-height: 28px;
        font-size: 14px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .TrollsMenu, .TrollsMessage {
        top: 82px;
        max-height: 85%;
        line-height: 48px;
        font-size: 18px;}}`
    );

    sheet.insertRule(`.eventTroll.common {
        color: #8d8e9f;}`
    );

    sheet.insertRule(`.eventTroll.common:hover {
        color: #b4b5c9;}`
    );

    sheet.insertRule(`.eventTroll.rare {
        color: #23b56b;}`
    );

    sheet.insertRule(`.eventTroll.rare:hover {
        color: #2bdf84;}`
    );

    sheet.insertRule(`.eventTroll.epic {
        color: #ffb244;}`
    );

    sheet.insertRule(`.eventTroll.epic:hover {
        color: #ffc97b;}`
    );

    sheet.insertRule(`.eventTroll.legendary {
        color: #9370db;}`
    );

    sheet.insertRule(`.eventTroll.legendary:hover {
        color: #b19cd9;}`
    );

    sheet.insertRule(`.eventTroll.mythic {
        color: #ec0039;}`
    );

    sheet.insertRule(`.eventTroll.mythic:hover {
        color: #ff003e;}`
    );

    sheet.insertRule(`.eventTroll {
        color: #f70;}`
    );

    sheet.insertRule(`.eventTroll:hover {
        color: #fa0;}`
    );

    sheet.insertRule(`.TrollsMenu a {
        color: rgb(255, 255, 255);
        text-decoration: none;}`
    );

    sheet.insertRule(`.TrollsMenu a:hover {
        color: rgb(255, 247, 204);
        text-decoration: underline;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .TrollsMenu .darkness_gem,
            .TrollsMenu .light_gem,
            .TrollsMenu .psychic_gem,
            .TrollsMenu .fire_gem,
            .TrollsMenu .nature_gem,
            .TrollsMenu .stone_gem,
            .TrollsMenu .sun_gem,
            .TrollsMenu .water_gem {
        position: relative;
        top: -8px;
        height: 14px;
        width: 14px;
        display: inline-block;
        background-size: 14px;
        background-repeat: no-repeat;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .TrollsMenu .darkness_gem,
            .TrollsMenu .light_gem,
            .TrollsMenu .psychic_gem,
            .TrollsMenu .fire_gem,
            .TrollsMenu .nature_gem,
            .TrollsMenu .stone_gem,
            .TrollsMenu .sun_gem,
            .TrollsMenu .water_gem {
        position: relative;
        top: -15px;
        height: 20px;
        width: 20px;
        display: inline-block;
        background-size: 20px;
        background-repeat: no-repeat;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .gift_reward,
            .book_reward {
        position: relative;
        top: -7px;
        width: 16px;
        height: 16px;
        background-size: 16px;
        background-repeat: no-repeat;
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .gift_reward,
            .book_reward {
        position: relative;
        top: -15px;
        width: 22px;
        height: 22px;
        background-size: 22px;
        background-repeat: no-repeat;
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .money_reward {
        position: relative;
        top: -7px;
        width: 14px;
        height: 14px;
        background-size: 13px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_topbar_soft_currency.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .money_reward {
        position: relative;
        top: -15px;
        width: 20px;
        height: 20px;
        background-size: 20px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_topbar_soft_currency.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .energy_reward {
        position: relative;
        top: -8px;
        width: 11px;
        height: 14px;
        background-size: 10px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_topbar_energy_quest.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .energy_reward {
        position: relative;
        top: -15px;
        width: 15px;
        height: 20px;
        background-size: 15px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_topbar_energy_quest.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .orbEq_reward {
        position: relative;
        top: -7px;
        width: 15px;
        height: 15px;
        background-size: 15px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pachinko/o_eq1.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .orbEq_reward {
        position: relative;
        top: -15px;
        width: 20px;
        height: 20px;
        background-size: 20px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pachinko/o_eq1.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .orbEP_reward {
        position: relative;
        top: -7px;
        width: 15px;
        height: 15px;
        background-size: 15px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pachinko/o_e1.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .orbEP_reward {
        position: relative;
        top: -15px;
        width: 20px;
        height: 20px;
        background-size: 20px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pachinko/o_e1.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .lightBulb_reward {
        position: relative;
        top: -7px;
        width: 14px;
        height: 16px;
        background-size: 16px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/girl_skills/common_resource.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .lightBulb_reward {
        position: relative;
        top: -14px;
        width: 19px;
        height: 22px;
        background-size: 22px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/girl_skills/common_resource.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .kiss_reward {
        position: relative;
        top: -7px;
        width: 15px;
        height: 15px;
        background-size: 15px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_kiss.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .kiss_reward {
        position: relative;
        top: -15px;
        width: 20px;
        height: 20px;
        background-size: 20px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_kiss.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .booster_reward {
        position: relative;
        top: -7px;
        width: 16px;
        height: 16px;
        background-size: 16px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/pachinko/ic_booster.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .booster_reward {
        position: relative;
        top: -14px;
        width: 22px;
        height: 22px;
        background-size: 22px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/pachinko/ic_booster.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .ticket_reward {
        position: relative;
        top: -7px;
        width: 15px;
        height: 15px;
        background-size: 15px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/champion_ticket.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .ticket_reward {
        position: relative;
        top: -14px;
        width: 21px;
        height: 21px;
        background-size: 21px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/champion_ticket.png");
        display: inline-block;}}`
    );

    sheet.insertRule(`.TrollsMenu .darkness_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/darkness.png");}`
    );

    sheet.insertRule(`.TrollsMenu .light_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/light.png");}`
    );

    sheet.insertRule(`.TrollsMenu .psychic_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/psychic.png");}`
    );

    sheet.insertRule(`.TrollsMenu .fire_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/fire.png");}`
    );

    sheet.insertRule(`.TrollsMenu .nature_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/nature.png");}`
    );

    sheet.insertRule(`.TrollsMenu .stone_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/stone.png");}`
    );

    sheet.insertRule(`.TrollsMenu .sun_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/sun.png");}`
    );

    sheet.insertRule(`.TrollsMenu .water_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/water.png");}`
    );

    sheet.insertRule(`.TrollsMenu .gift_reward {
        background-image: url("${window.IMAGES_URL}/pictures/items/K2.png");}`
    );

    sheet.insertRule(`.TrollsMenu .book_reward {
        background-image: url("${window.IMAGES_URL}/pictures/items/XP3.png");}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .TrollsMenu .troll_world_script {
        position: relative;
        top: -6px;
        height: 18px;
        width: 18px;
        display: inline-block;
        background-size: 18px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/quest/ico-quest.png");}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .TrollsMenu .troll_world_script {
        position: relative;
        top: -13px;
        height: 28px;
        width: 28px;
        display: inline-block;
        background-size: 28px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/pictures/design/quest/ico-quest.png");}}`
    );
}

/* ===========
	BETTER XP
   =========== */

function moduleXP() {
    function betterXP() {
        if (heroData.infos.level < lvl_max_player) {
            $('span[hero="xp"]').empty().append(`${labels.next}:&nbsp;`);
            $('span[hero="xp_sep"]').empty().append(`${nThousand(heroData.infos.Xp.left)}`);
            $('span[hero="xp_max"]').empty().append(` XP`);
        }
        else {
            $('span[hero="xp"]').empty();
            $('span[hero="xp_sep"]').empty().append(`${nThousand(heroData.infos.Xp.cur)}`);
            $('span[hero="xp_max"]').empty().append(` XP`);
        }
    };

    betterXP();

    $('.button_glow').click(() => {
        setInterval(() => {
            betterXP();
        }, 3000)
    });
}

/* ==============
	BETTER MONEY
   ============== */

function moduleMoney() {
    function betterMoney() {
        if (heroData.currencies.soft_currency >= 1E6)
            $('div[hero="soft_currency"]').empty().append(`${nRounding(heroData.currencies.soft_currency, 3, -1)}`);
    };

    betterMoney();

    $('.button_glow').click(() => {
        setInterval(() => {betterMoney();}, 3000)
    });

    $('#collect_all').click(() => {
        setInterval(() => {betterMoney();}, 3000)
    });

    $('.collect_money').click(() => {
        setInterval(() => {betterMoney();}, 3000)
    });
}

/* ====================
	MARKET INFORMATION
   ==================== */

function moduleMarket() {
    let loc2 = $('#my-hero-stats-upgrade-tab-container .upgrade-stats-container').children();
    Array.from(loc2).forEach((loc) => {
        let stat = $(loc).attr('class');
        if (stat == 'caracs-1-container' || stat == 'caracs-2-container' || stat == 'caracs-3-container') {
            stat = 'carac' + localeStringToNumber(stat);
            $(loc).append(`<span class="CustomStats"></span><div id="CustomStats${stat}" class="StatsTooltip"></div>`);
        }
    });

    updateStats();

    function updateStats() {
        let loc2 = $('#my-hero-stats-upgrade-tab-container .upgrade-stats-container').children();
        let levelMoney = 0,
            levelPoints = heroData.infos.level * 30;
        levelMoney = calculateTotalPrice(levelPoints);
        Array.from(loc2).forEach((loc) => {
            let stat = $(loc).attr('class');
            $('.CustomStats').html('');
            if (stat == 'caracs-1-container' || stat == 'caracs-2-container' || stat == 'caracs-3-container') {
                stat = 'carac' + localeStringToNumber(stat);
                let boughtPoints = heroData.infos[stat],
                    remainingPoints = levelPoints - boughtPoints,
                    spentMoney = calculateTotalPrice(boughtPoints),
                    remainingMoney = levelMoney - spentMoney;

                let totalPoints = heroData.infos.caracs[stat];
                let iClass = heroData.infos.class - 1;
                let iStat = parseInt(stat.substr(5)) - 1;
                let matMul = [[9, 5, 7], [7, 9, 5], [5, 7, 9]];
                let skillPoints = matMul[iClass][iStat] * heroData.infos.level;

                let equipmentsData = $('#equiped.armor-container .armor .slot-container').children(),
                    itemPoints = 0;
                Array.from(equipmentsData).forEach((equipment) => {
                    if ($(equipment).attr('class').indexOf('slot empty') == -1) {
                        let equipmentsStats = $(equipment).attr('data-d'),
                            statPosStart = equipmentsStats.indexOf(stat + '_equip') + 15,
                            statPosEnd = equipmentsStats.substr(statPosStart).indexOf(',');
                        itemPoints = itemPoints + parseInt(equipmentsStats.substr(statPosStart, statPosEnd - 1), 10);
                    }});

                let boostersData = $('#equiped.booster-container .booster').children(),
                    ginsengPoints = 0,
                    ginsengLegendary = 0;
                Array.from(boostersData).forEach((booster) => {
                    if ($(booster).attr('class') != 'slot empty') {
                        if ($(booster).attr('id_item') == '7') {
                            ginsengPoints = ginsengPoints + 100;
                        }
                        else if ($(booster).attr('id_item') == '8') {
                            ginsengPoints = ginsengPoints + 350;
                        }
                        else if ($(booster).attr('id_item') == '9') {
                            ginsengPoints = ginsengPoints + 1225;
                        }
                        else if ($(booster).attr('id_item') == '316') {
                            ginsengLegendary = ginsengLegendary + 1;
                        }
                    }
                });
                ginsengPoints = ginsengPoints + Math.ceil((skillPoints + boughtPoints + itemPoints + ginsengPoints) * 0.06 * ginsengLegendary);

                let clubPoints = totalPoints - skillPoints - boughtPoints - itemPoints - ginsengPoints;

                $(`#CustomStats${stat}`).html(`
                    <b>${labels.stat_points_need}:</b> ${nThousand(remainingPoints)}<BR>
                    <b>${labels.money_need}:</b> ${nThousand(remainingMoney)}<BR>
                    <b>${labels.money_spent}:</b> ${nThousand(spentMoney)}<BR><BR>
                    <b>${labels.points_from_level}:</b> ${nThousand(skillPoints)}<BR>
                    <b>${labels.bought_points}:</b> ${nThousand(boughtPoints)}<BR>
                    <b>${labels.equipment_points}:</b> ${nThousand(itemPoints)}<BR>
                    <b>${labels.ginseng_points}:</b> ${nThousand(ginsengPoints)}<BR>
                    <b>${labels.club_points}:</b> ${nThousand(clubPoints)}<BR>
                `);
            }
        });
    }

    function calculateTotalPrice(points) {
        let last_price = calculateStatPrice(points);
        let price = 0;
        if (points < 2000)
            price = (7 + last_price) / 2 * points;
        else if (points < 4000)
            price = 4012000 + (4009 + last_price) / 2 * (points - 2000);
        else if (points < 6000)
            price = 20026000 + (12011 + last_price) / 2 * (points - 4000);
        else if (points < 8000)
            price = 56042000 + (24013 + last_price) / 2 * (points - 6000);
        else if (points < 10000)
            price = 120060000 + (40015 + last_price) / 2 * (points - 8000);
        else if (points < 12000)
            price = 220080000 + (60017 + last_price) / 2 * (points - 10000);
        else if (points < 14000)
            price = 364102000 + (84019 + last_price) / 2 * (points - 12000);
        else if (points < 16000)
            price = 560126000 + (112021 + last_price) / 2 * (points - 14000);
        else if (points < 18000)
            price = 816152000 + (144023 + last_price) / 2 * (points - 16000);
        else if (points < 20000)
            price = 1140180000 + (180025 + last_price) / 2 * (points - 18000);
        else if (points < 22000)
            price = 1540210000 + (220027 + last_price) / 2 * (points - 20000);
        else if (points < 24000)
            price = 2024242000 + (264029 + last_price) / 2 * (points - 22000);
        else if (points < 26000)
            price = 2600276000 + (312031 + last_price) / 2 * (points - 24000);
        else if (points < 28000)
            price = 3276312000 + (364033 + last_price) / 2 * (points - 26000);
        else if (points < 30000)
            price = 4060350000 + (420035 + last_price) / 2 * (points - 28000);
        return price;
    }

    function calculateStatPrice(points) {
        let cost = 0;
        if (points < 2000)
            cost = 5 + points * 2;
        else if (points < 4000)
            cost = 4005 + (points - 2000) * 4;
        else if (points < 6000)
            cost = 12005 + (points - 4000) * 6;
        else if (points < 8000)
            cost = 24005 + (points - 6000) * 8;
        else if (points < 10000)
            cost = 40005 + (points - 8000) * 10;
        else if (points < 12000)
            cost = 60005 + (points - 10000) * 12;
        else if (points < 14000)
            cost = 84005 + (points - 12000) * 14;
        else if (points < 16000)
            cost = 112005 + (points - 14000) * 16;
        else if (points < 18000)
            cost = 144005 + (points - 16000) * 18;
        else if (points < 20000)
            cost = 180005 + (points - 18000) * 20;
        else if (points < 22000)
            cost = 220005 + (points - 20000) * 22;
        else if (points < 24000)
            cost = 264005 + (points - 22000) * 24;
        else if (points < 26000)
            cost = 312005 + (points - 24000) * 26;
        else if (points < 28000)
            cost = 364005 + (points - 26000) * 28;
        else if (points < 30000)
            cost = 420005 + (points - 28000) * 30;
        return cost;
    }

    let lsMarket = {};
    lsMarket.buyable = {};
    lsMarket.stocks = {};
    lsMarket.restock = {};

    let restocktime = 0;
    let time = $('#equipement-tab-container .restock-info-timer span').text();
    if (time.indexOf('h') > -1) {
        restocktime = parseInt(time.substring(0, time.indexOf('h')), 10) * 3600;
        time = time.substring(time.indexOf('h') + 1);
    }
    if (time.indexOf('m') > -1) {
        restocktime += parseInt(time.substring(0, time.indexOf('m')), 10) * 60;
        time = time.substring(time.indexOf('h') + 1);
    }
    if (time.indexOf('s') > -1) {
        restocktime += parseInt(time.substring(0, time.indexOf('s')), 10);
    }

    lsMarket.restock.herolvl = heroData.infos.level;
    lsMarket.restock.time = (new Date()).getTime() + restocktime * 1000;

    get_buyableStocks('potion');
    get_buyableStocks('gift');
    equipments_shop(0);
    boosters_shop(0);
    books_shop(0);
    gifts_shop(0);

    new MutationObserver(() => {
        equipments_shop(1);
    }).observe($('#player-inventory.armor')[0], {childList: true})

    let timer;
    $('#shops button').click(() => {
        let clickedButton = $(this).attr('rel'),
            opened_shop = $('#tabs-switcher').children('.active');
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (opened_shop[0].attributes.type.value == 'armor') equipments_shop(1);
            else if (opened_shop[0].attributes.type.value == 'booster') boosters_shop(1);
            else if (opened_shop[0].attributes.type.value == 'potion') {
                if (clickedButton == 'buy' || clickedButton == 'buy_all' || clickedButton == 'shop_reload') get_buyableStocks('potion');
                books_shop(1);
            }
            else if (opened_shop[0].attributes.type.value == 'gift') {
                if (clickedButton == 'buy' || clickedButton == 'buy_all' || clickedButton == 'shop_reload') get_buyableStocks('gift');
                gifts_shop(1);
            }
        }, 2*timeout);
    });

    function get_buyableStocks(loc_class) {
        let itemsNb = 0,
            itemsXp = 0,
            itemsPriceYmens = 0,
            itemsPriceKobans = 0,
            loc2 = $(`#merchant-inventory.${loc_class} .slot`);

        Array.from(loc2).forEach((loc) => {
            if ($(loc).hasClass('empty')) return false;
            let item = JSON.parse($(loc).attr('data-d'));
            itemsNb++;
            itemsXp += parseInt(item.item.value, 10);
            if (item.item.currency == "sc") {
                itemsPriceYmens += parseInt(item.price_buy, 10);
            }
            else {
                itemsPriceKobans += parseInt(item.price_buy, 10);
            }
        });
        lsMarket.buyable[loc_class] = {'Nb':itemsNb, 'Xp':itemsXp, 'ValueYmens':itemsPriceYmens, 'ValueKobans':itemsPriceKobans};
    }

    function equipments_shop(update) {tt_create(update, 'armor', 'EquipmentsTooltip', 'equipments', '');}
    function boosters_shop(update) {tt_create(update, 'booster', 'BoostersTooltip', 'boosters', '');}
    function books_shop(update) {tt_create(update, 'potion', 'BooksTooltip', 'books', 'Xp');}
    function gifts_shop(update) {tt_create(update, 'gift', 'GiftsTooltip', 'gifts', 'affection');}

    function tt_create(update, loc_class, tt_class, itemName, itemUnit) {
        let itemsNb = 0,
            itemsXp = (itemUnit == '') ? -1 : 0,
            itemsSell = 0,
            loc2 = $(`#player-inventory.${loc_class} .slot`);

        Array.from(loc2).forEach((loc) => {
            if ($(loc).hasClass('empty')) return false;
            let item = JSON.parse($(loc).attr('data-d')),
                Nb = parseInt(item.quantity, 10) || 1;
            itemsNb += Nb;
            itemsSell += Nb * parseInt(item.price_sell, 10);
            if (itemsXp != -1) itemsXp += Nb * parseInt(item.item.value, 10);
        });

        let tooltip = labels.you_own + ' <b>' + nThousand(itemsNb) + '</b> ' + labels[itemName] + '.<BR>' +
            (itemsXp == -1 ? '' : labels.you_can_give + ' <b>' + nThousand(itemsXp) + '</b> ' + labels[itemUnit] + '.<BR>') +
            labels.you_can_sell + ' <b>' + nThousand(itemsSell) + '</b> <span class="imgMoney"></span>.';

        lsMarket.stocks[loc_class] = (loc_class == 'potion' || loc_class == 'gift') ? {'Nb':itemsNb, 'Xp':itemsXp} : {'Nb':itemsNb};
        localStorage.setItem('HHS.lsMarket', JSON.stringify(lsMarket));

        if (update == 0) {
            $(`#player-inventory.${loc_class}`).prepend(`<span class="CustomTT"></span><div class="${tt_class}">${tooltip}</div>`);
        }
        else {
            $(`#player-inventory.${loc_class}`).children('.' + tt_class).html(tooltip);
        }
    }
    $('plus').on('click', function (event) {
        let stat = 'carac' + $(this).attr('for_carac');
        heroData.infos[stat] += window.statsMultiplier[window.statsMultiplierIndex].nb;
        timer = setTimeout(() => {
            updateStats();
        }, 400);
    });

    modulePreventMythicBoosterSelling();

    function modulePreventMythicBoosterSelling() {
        const observer = new MutationObserver(() => {
            const sellButton = $('#boosters-tab-container .right-container .bottom-container button[rel=sell]');
            if($('#player-inventory.booster .slot.mythic.selected').length) sellButton.prop('disabled', true);
        });
        observer.observe($('#player-inventory.booster')[0], {subtree: true, attributes: true, attributeFilter: ['class']});
    }

    focusEquipmentKeeper();

    function focusEquipmentKeeper() {
        let selectedEquip;
        let previousSelectedEquip;

        const observerHero = new MutationObserver(() => {
            setTimeout(() => {
                selectedEquip = $('#player-inventory-armor .selected')[0];
                if (selectedEquip) {
                    previousSelectedEquip = selectedEquip.parentNode.previousElementSibling;
                    if (previousSelectedEquip) {
                        if (previousSelectedEquip.className != "slot-container")
                            previousSelectedEquip = selectedEquip.parentNode.nextElementSibling.children[0];
                        else previousSelectedEquip = selectedEquip.parentNode.previousElementSibling.children[0];
                    }
                    else previousSelectedEquip = selectedEquip.parentNode.nextElementSibling.children[0];
                }
            }, timeout)
        });
        observerHero.observe($('#player-inventory-armor')[0], {subtree: true, attributes: true, attributeFilter: ['class']});

        $('#my-hero-equipement-tab-container button[rel=use]').click(() => {
            setTimeout(() => {
                $($('#my-hero-equipement-tab-container #equiped .selected')).removeClass('selected');
                $(previousSelectedEquip).addClass('selected');
                setTimeout(() => {$('#my-hero-equipement-tab-container button[rel=use]').prop('disabled', false)}, 100);
            }, timeout);
        });
    }

    //CSS
    sheet.insertRule(`#player-inventory-container .CustomTT {
        position: absolute;
        margin-top: -25px;
        background-image: url("https://i.postimg.cc/qBDt6yHV/icon-question.png");
        background-size: 20px;
        width: 20px;
        height: 20px;}`
    );

    sheet.insertRule(`#player-inventory-container .CustomTT:hover {
        cursor: help;}`
    );

    sheet.insertRule(`#player-inventory-container .CustomTT:hover + div {
        opacity: 1;
        visibility: visible;}`
    );

    sheet.insertRule(`#player-inventory-container .EquipmentsTooltip,
            #player-inventory-container .BoostersTooltip,
            #player-inventory-container .BooksTooltip,
            #player-inventory-container .GiftsTooltip {
        position: absolute;
        z-index: 99;
        width: 240px;
        border: 1px solid rgb(162, 195, 215);
        border-radius: 8px;
        box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1);
        padding: 3px 7px 4px 7px;
        background-color: #F2F2F2;
        font: normal 10px/17px Tahoma, Helvetica, Arial, sans-serif;
        color: #057;
        opacity: 0;
        visibility: hidden;
        transition: opacity 400ms, visibility 400ms;}`
    );

    sheet.insertRule(`#player-inventory-container .EquipmentsTooltip,
            #player-inventory-container .BoostersTooltip {
        margin: -50px 0 0 30px;
        height: 43px;}`
    );

    sheet.insertRule(`#player-inventory-container .BooksTooltip,
            #player-inventory-container .GiftsTooltip {
        margin: -67px 0 0 30px;
        height: 60px;}`
    );

    sheet.insertRule(`#player-inventory-container .EquipmentsTooltip b,
            #player-inventory-container .BoostersTooltip b,
            #player-inventory-container .BooksTooltip b,
            #player-inventory-container .GiftsTooltip b {
        font-weight: bold;}`);

    sheet.insertRule(`#player-inventory-container .imgMoney {
        background-size: 12px;
        background-repeat: no-repeat;
        width: 12px;
        height: 14px;
        vertical-align: text-bottom;
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_topbar_soft_currency.png");
        display: inline-block;}`
    );

    sheet.insertRule(`#my-hero-stats-upgrade-tab-container .upgrade-stats-container .CustomStats:hover {
        cursor: help;}`
    );

    sheet.insertRule(`#my-hero-stats-upgrade-tab-container .upgrade-stats-container .CustomStats {
        position: relative;
        left: -550px;
        margin-top: 0px;
        background-image: url("https://i.postimg.cc/qBDt6yHV/icon-question.png");
        background-size: 18px 18px;
        background-position: center;
        background-repeat: no-repeat;
        width: 18px;
        height: 100%;
        visibility: none;}`
    );

    sheet.insertRule(`#my-hero-stats-upgrade-tab-container .upgrade-stats-container .CustomStats:hover + div {
        opacity: 1;
        visibility: visible;}`
    );

    sheet.insertRule(`#my-hero-stats-upgrade-tab-container .upgrade-stats-container .StatsTooltip {
        position: absolute;
        z-index: 99;
        margin: -30px 0 0 32px;
        border: 1px solid rgb(162, 195, 215);
        border-radius: 8px;
        box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1);
        padding: 2px 17px 2px 7px;
        background-color: #F2F2F2;
        font: normal 10px/17px Tahoma, Helvetica, Arial, sans-serif;
        text-align: left;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        color: #057;
        transition: opacity 400ms, visibility 400ms;}`
    );

    sheet.insertRule(`#my-hero-stats-upgrade-tab-container .upgrade-stats-container .StatsTooltip b {
        font-weight: bold;}`
    );

    sheet.insertRule(`#equipement-tab-container button[rel=buy_all] {
        display: none !important;}`
    );
}

function moduleMarketRestockButton() {
    sheet.insertRule(`#books-tab-container .left-container .bottom-container,
            #gifts-tab-container .left-container .bottom-container {
        margin-right: 15px;}`
    );

    if (localStorage.getItem('HHPlusPlusConfig')) {
        if (JSON.parse(localStorage.getItem('HHPlusPlusConfig')).zoo_MarketTweaks) {
            sheet.insertRule(`#shops #gifts-tab-container .top-container button[rel="shop_reload"],
                    #shops #books-tab-container .top-container button[rel="shop_reload"] {
                top: 17px;
                left: 0px;}`
            );
        }
    }

    sheet.insertRule(`#shops #gifts-tab-container .top-container button[rel="shop_reload"],
            #shops #books-tab-container .top-container button[rel="shop_reload"] {
        position: relative;
        left: 114px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #shops #gifts-tab-container .top-container button[rel="shop_reload"],
            #shops #books-tab-container .top-container button[rel="shop_reload"] {
        top: 392px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #shops #gifts-tab-container .top-container button[rel="shop_reload"],
            #shops #books-tab-container .top-container button[rel="shop_reload"] {
        top: 380px;}}`
    );

    sheet.insertRule(`#shops [rel="buy"],
            #shops [rel="buy_all"],
            #shops [rel="sell"],
            #shops [rel="shop_reload"],
            #shops [rel="use"] {
        max-width: 11rem;}`
    );

    sheet.insertRule(`.restock-timer > p {
        min-width: 155px;}`
    );
}


/* ========================
	FILTER EQUIPMENT ITEMS
   ======================== */
function moduleFilterArmorItems() {
    const getFavorites = () => JSON.parse(localStorage.getItem('HHS.EQUIP_FAVORITES')) || [];
    const setFavorites = (favorites) => localStorage.setItem('HHS.EQUIP_FAVORITES', JSON.stringify(favorites));
    const addToFavorites = (id) => {
        const favorites = getFavorites()
        if (favorites.includes(id)) {return}

        favorites.push(id)
        setFavorites(favorites)
    };
    const removeFromFavorites = (id) => {
        const favorites = getFavorites()
        const index = favorites.indexOf(id)
        if (index < 0) {return}

        favorites.splice(index, 1)
        setFavorites(favorites)
    };

    const getParamFilterHero = () => JSON.parse(localStorage.getItem('HHS.market_paramFilterHero')) || {subtype: FILTER_DEFAULT, rarity: FILTER_DEFAULT, stats: FILTER_DEFAULT, favorites: FILTER_DEFAULT, resonance_class: FILTER_DEFAULT, resonance_class_type: FILTER_DEFAULT, resonance_theme: FILTER_DEFAULT, resonance_theme_type: FILTER_DEFAULT};
    const setParamFilterHero = (paramFilterHero) => localStorage.setItem('HHS.market_paramFilterHero', JSON.stringify(paramFilterHero));
    const getParamFilterEquip = () => JSON.parse(localStorage.getItem('HHS.market_paramFilterEquip')) || {subtype: FILTER_DEFAULT, rarity: FILTER_DEFAULT, stats: FILTER_DEFAULT, favorites: FILTER_DEFAULT, resonance_class: FILTER_DEFAULT, resonance_class_type: FILTER_DEFAULT, resonance_theme: FILTER_DEFAULT, resonance_theme_type: FILTER_DEFAULT};
    const setParamFilterEquip = (paramFilterEquip) => localStorage.setItem('HHS.market_paramFilterEquip', JSON.stringify(paramFilterEquip));

    const FILTER_DEFAULT = 'all';
    const FILTER_DEFAULT_ICON = 'caracs/no_class.png';
    const FILTER_OPTIONS = new (class {
        get subtype () {return [
            {value: '1', icon: 'pictures/items/ET1.png'},
            {value: '2', icon: 'pictures/items/EH1.png'},
            {value: '3', icon: 'pictures/items/EB1.png'},
            {value: '4', icon: 'pictures/items/ES1.png'},
            {value: '5', icon: 'pictures/items/EF1.png'},
            {value: '6', icon: 'pictures/items/EA1.png'}
        ]}
        get rarity () {return [
            {value: 'common', bgColor: '#8d8e9f'},
            {value: 'rare', bgColor: '#23b56b'},
            {value: 'epic', bgColor: '#ffb244'},
            {value: 'legendary', bgImage: `url(${window.IMAGES_URL}/legendary.png)`},
            {value: 'mythic', bgColor: 'transparent radial-gradient(closest-side at 50% 50%,#f5a866 0,#ec0039 51%,#9e0e27 100%) 0 0 no-repeat padding-box'}
        ]}
        get stats () {return [
            {value: 'rainbow', icon: 'pictures/misc/items_icons/16.svg'},
            {value: 'hc', icon: 'pictures/misc/items_icons/1.png'},
            {value: 'ch', icon: 'pictures/misc/items_icons/2.png'},
            {value: 'kh', icon: 'pictures/misc/items_icons/3.png'},
            {value: 'end', icon: 'pictures/misc/items_icons/4.png'},
            {value: 'har', icon: 'pictures/misc/items_icons/5.png'}
        ]}
        get favorites () {return [
            {value: true, icon: 'design/ic_star_orange.svg'},
            {value: false, icon: 'design/ic_star_white.svg'}
        ]}
        get resonance_class () {return [
            {value: '1', icon: 'pictures/misc/items_icons/1.png'},
            {value: '2', icon: 'pictures/misc/items_icons/2.png'},
            {value: '3', icon: 'pictures/misc/items_icons/3.png'}
        ]}
        get resonance_class_type () {return [
            {value: 'damage', icon: 'caracs/damage.png'},
            {value: 'ego', icon: 'caracs/ego.png'}
        ]}
        get resonance_theme () {return [
            {value: 'multi', icon: 'pictures/girls_elements/Multicolored.png'},
            {value: 'fire', icon: 'pictures/girls_elements/Eccentric.png'},
            {value: 'nature', icon: 'pictures/girls_elements/Exhibitionist.png'},
            {value: 'stone', icon: 'pictures/girls_elements/Physical.png'},
            {value: 'sun', icon: 'pictures/girls_elements/Playful.png'},
            {value: 'water', icon: 'pictures/girls_elements/Sensual.png'},
            {value: 'darkness', icon: 'pictures/girls_elements/Dominatrix.png'},
            {value: 'light', icon: 'pictures/girls_elements/Submissive.png'},
            {value: 'psychic', icon: 'pictures/girls_elements/Voyeurs.png'}
        ]}
        get resonance_theme_type () {return [
            {value: 'defense', icon: 'caracs/deff_undefined.png'},
            {value: 'chance', icon: 'pictures/misc/items_icons/5.png'}
        ]}
    })();
    const FILTER_OPTIONS_GRIDS = {
        subtype: {
            flow: 'column',
            cols: '1fr 1fr 1fr',
            rows: '1fr 1fr'
        },
        rarity: {
            flow: 'row',
            cols: '1fr 1fr 1fr',
            rows: '1fr 1fr'
        },
        stats: {
            flow: 'row',
            cols: '1fr 1fr 1fr',
            rows: '1fr 1fr',
        },
        favorites: {
            flow: 'row',
            cols: '1fr auto',
            rows: '1fr'
        },
        resonance_class: {
            flow: 'row',
            cols: '1fr 1fr 1fr',
            rows: '1fr'
        },
        resonance_class_type: {
            flow: 'row',
            cols: '1fr 1fr',
            rows: '1fr'
        },
        resonance_theme: {
            flow: 'row',
            cols: '1fr 1fr 1fr',
            rows: '1fr 1fr 1fr'
        },
        resonance_theme_type: {
            flow: 'row',
            cols: '1fr 1fr',
            rows: '1fr'
        }
    };
    const STATS_MAP = {
        rainbow: [16],
        hc:[1, 6, 7, 8, 9],
        ch: [2, 6, 10, 11, 12],
        kh: [3, 7, 10, 13, 14],
        end: [4, 8, 11, 13, 15],
        har: [5, 9, 12, 14, 15],
    };

    const createGridSelectorItem = ({location, id, value, icon, bgColor, bgImage}) => (`
        <input type="radio" name=${location}-${id} id="${location}-${id}-${value}" value="${value}" class="${(currentFilter(location)[id] == '' + value) ? "filter_selected" : ""}" />
        <label for="${location}-${id}-${value}">
        ${icon ? `<img src="${window.IMAGES_URL}/${icon}">` : ''}
        ${bgColor || bgImage ? `<div style="${bgColor?`background:${bgColor};`:''}${bgImage?`background-image:${bgImage};background-size:contain;`:''}"></div>` : ''}
        </label>`
    )

    const createGridSelector = ({location, id, options, gridConfig}) => (`
        <div class="grid-selector" rel="${location}-${id}">
        <div class="clear-selector">
        <input type="radio" name="${location}-${id}" id="${location}-${id}-${FILTER_DEFAULT}" class="${(currentFilter(location)[id] == FILTER_DEFAULT) ? "filter_selected" : ""}" value="${FILTER_DEFAULT}" />
        <label for="${location}-${id}-${FILTER_DEFAULT}">
        <img src="${window.IMAGES_URL}/${FILTER_DEFAULT_ICON}" />
        </label></div>
        <div class="selector-options" style="grid-auto-flow:${gridConfig.flow}; grid-template-rows:${gridConfig.rows}; grid-template-columns:${gridConfig.cols}">
        ${options.map(option => {
            const {value, icon, bgColor, bgImage} = option
            return createGridSelectorItem({location, id, value, icon, bgColor, bgImage})
        }).join('')}
        </div>
        </div>
        <hr style="margin-top: 3px;margin-bottom: 3px; background: rgba(255, 255, 255, 0.533);">`
    );

    const createFilterBox = (location) => {
        return $(`<div style="position:relative">
            <div class="equip_filter_box ${location} form-wrapper" style="display: none;">
            ${['subtype', 'rarity', 'stats', 'favorites'].map(key => createGridSelector({location : location, id: key, options: FILTER_OPTIONS[key], gridConfig: FILTER_OPTIONS_GRIDS[key]})).join('')}
            <button id="reset_button-${location}" class="square_blue_btn">Reset</button>
            </div>
            <div class="equip_filter_box resonance ${location} form-wrapper" style="display: none;">
            <span>${window.GT.design.mythic_equipment_resonance_bonus}</span>
            ${['resonance_class', 'resonance_class_type', 'resonance_theme', 'resonance_theme_type'].map(key => createGridSelector({location : location, id: key, options: FILTER_OPTIONS[key], gridConfig: FILTER_OPTIONS_GRIDS[key]})).join('')}
            </div></div>`
        )
    };

    const createFilterBtn = () => {
        return $('<label class="equip_filter"><input type="button" class="blue_button_L" value="" /></label>')
    };

    const makeEquipKey = ({level, carac1_equip, carac2_equip, carac3_equip, endurance_equip, chance_equip},{id_equip},{identifier, subtype}) => [identifier, subtype, id_equip, level, carac1_equip, carac2_equip, carac3_equip, endurance_equip, chance_equip].join('_');

    const makeEquipKeyMythic = ({level, carac1_equip, carac2_equip, carac3_equip, endurance_equip, chance_equip},{identifier, subtype},classIdentifier,classResonance,themeIdentifier,themeResonance) => [identifier, subtype, level, carac1_equip, carac2_equip, carac3_equip, endurance_equip, chance_equip, classIdentifier, classResonance, themeIdentifier, themeResonance].join('_');

    const currentFilter = (location) => (location == 'hero') ? this.currentFilterHero : this.currentFilterEquip;
    this.currentFilterHero = getParamFilterHero();
    this.currentFilterEquip = getParamFilterEquip();

    function applyFilter($target, location) {
        const favorites = getFavorites()
        const $visibleEquips = $target.find('.slot:not(.empty)')

        let visibleCount = 0

        $visibleEquips.each((i,el) => {
            const $el = $(el)
            const equipData = $el.data('d')
            const {name_add, rarity} = equipData.item
            const {subtype} = equipData.skin

            const classIdentifier = (rarity == 'mythic') ? equipData.resonance_bonuses.class.identifier : 0
            const classResonance = (rarity == 'mythic') ? equipData.resonance_bonuses.class.resonance : 0
            const themeIdentifier = (rarity == 'mythic') ? (equipData.resonance_bonuses.theme.identifier || 'multi') : 0
            const themeResonance = (rarity == 'mythic') ? equipData.resonance_bonuses.theme.resonance : 0

            const equipKey = (rarity != 'mythic') ? makeEquipKey(equipData, equipData.item, equipData.skin) : makeEquipKeyMythic(equipData, equipData.skin, classIdentifier, classResonance, themeIdentifier, themeResonance)

            const isFavorite = favorites.includes(equipKey)

            let $favoriteToggle = $el.find('.favorite-toggle')
            if (!$favoriteToggle.length) {
                $favoriteToggle = this.$favoriteToggle.clone().attr('data-equip-key', equipKey)
                $el.prepend($favoriteToggle)
            } else {
                $favoriteToggle.off('click')
            }
            $favoriteToggle.click(this.favoriteToggleCallback)
            $favoriteToggle.attr('data-is-favorite', isFavorite)

            const subtypeMatches = (location == 'hero') ? (this.currentFilterHero.subtype == FILTER_DEFAULT || this.currentFilterHero.subtype == subtype) : (this.currentFilterEquip.subtype == FILTER_DEFAULT || this.currentFilterEquip.subtype == subtype)
            const rarityMatches = (location == 'hero') ? (this.currentFilterHero.rarity == FILTER_DEFAULT || this.currentFilterHero.rarity == rarity) : (this.currentFilterEquip.rarity == FILTER_DEFAULT || this.currentFilterEquip.rarity == rarity)
            const statsMatches = (location == 'hero') ? (this.currentFilterHero.stats == FILTER_DEFAULT || STATS_MAP[this.currentFilterHero.stats].includes(name_add)) : (this.currentFilterEquip.stats == FILTER_DEFAULT || STATS_MAP[this.currentFilterEquip.stats].includes(name_add))
            const favoritesMatches = (location == 'hero') ? (this.currentFilterHero.favorites == FILTER_DEFAULT || JSON.parse(this.currentFilterHero.favorites) == isFavorite) : (this.currentFilterEquip.favorites == FILTER_DEFAULT || JSON.parse(this.currentFilterEquip.favorites) == isFavorite)
            const classIdentifierMatches = (location == 'hero') ? (this.currentFilterHero.resonance_class == FILTER_DEFAULT || this.currentFilterHero.resonance_class == classIdentifier) : (this.currentFilterEquip.resonance_class == FILTER_DEFAULT || this.currentFilterEquip.resonance_class == classIdentifier)
            const classResonanceMatches = (location == 'hero') ? (this.currentFilterHero.resonance_class_type == FILTER_DEFAULT || this.currentFilterHero.resonance_class_type == classResonance) : (this.currentFilterEquip.resonance_class_type == FILTER_DEFAULT || this.currentFilterEquip.resonance_class_type == classResonance)
            const themeIdentifierMatches = (location == 'hero') ? (this.currentFilterHero.resonance_theme == FILTER_DEFAULT || this.currentFilterHero.resonance_theme == themeIdentifier) : (this.currentFilterEquip.resonance_theme == FILTER_DEFAULT || this.currentFilterEquip.resonance_theme == themeIdentifier)
            const themeResonanceMatches = (location == 'hero') ? (this.currentFilterHero.resonance_theme_type == FILTER_DEFAULT || this.currentFilterHero.resonance_theme_type == themeResonance) : (this.currentFilterEquip.resonance_theme_type == FILTER_DEFAULT || this.currentFilterEquip.resonance_theme_type == themeResonance)

            if ([subtypeMatches, rarityMatches, statsMatches, favoritesMatches, classIdentifierMatches, classResonanceMatches, themeIdentifierMatches, themeResonanceMatches].every(a=>a)) {
                $(el).removeClass('filtered_out')
                $(el)[0].parentNode.classList.remove('filtered_out')
                visibleCount++
            } else {
                $(el).addClass('filtered_out')
                $(el)[0].parentNode.classList.add('filtered_out')
            }
        })

        const $container = $target
        if (visibleCount < 12) {
            const $visibleSlots = $container.find('.slot:visible()')
            // pad with empty slots
            let toPad = 12 - $visibleSlots.length
            while (toPad > 0) {
                $container.find('.slot').last().after(`<div class="slot empty"></div>`)
                toPad--
            }
        }
    }

    function checkSelection($target) {
        let $selected = $target.find('.selected');
        const sellButton = $('#equipement-tab-container .right-container .bottom-container button[rel=sell]');
        const equipButton = $('#my-hero-equipement-tab-container .my-inventory-equipement-container .my-inventory .bottom-container button[rel=use]');

        if ($selected.length){
            if ($selected.is(':visible')) {
                // check for favourite
                const isFavorite = JSON.parse($selected.find('.favorite-toggle').attr('data-is-favorite'))
                if (isFavorite) {
                    sellButton.prop('disabled', true)
                }
            } else {
                // change selection
                const $container = $target;
                const index = $selected.index()
                let $newSelection
                let newSelection

                // first, try after
                $newSelection = $container.find(`.slot:gt(${index}):not(.empty):visible()`)
                if ($newSelection.length) {
                    newSelection = $newSelection[0]
                }

                if (!newSelection) {
                    // try before instead
                    $newSelection = $container.find(`.slot:lt(${index}):not(.empty):visible()`)

                    if ($newSelection.length) {
                        newSelection = $newSelection[$newSelection.length - 1]
                    }
                }

                if (newSelection) {
                    $(newSelection).click()
                } else {
                    // Nothing left visible, disable buttons
                    sellButton.prop('disabled', true);
                    equipButton.prop('disabled', true);
                }
            }
        }
    }

    $(document).on('market:equips-updated', () => {
        applyFilter($('#my-hero-equipement-tab-container #player-inventory-container'), 'hero');
        applyFilter($('#equipement-tab-container #player-inventory-container'), 'equip');
        checkSelection($('#my-hero-equipement-tab-container #player-inventory-container'));
        checkSelection($('#equipement-tab-container #player-inventory-container'))
    });

    const attachFilterBox = ($target, location) => {
        const $btn = createFilterBtn()
        const $box = createFilterBox(location)
        const $togglable = $box.find('.equip_filter_box')

        $target.append($btn).append($box)

        $btn.click(() => $togglable.toggle())
        $(`#reset_button-${location}`).click(() => resetFilter($target, location));
        $box.find('input').each((i, input) => {
            $(input).click((e) => {
                const {value, name} = e.target;
                $(`div[rel=${name}] .filter_selected`).removeClass('filter_selected');
                $(`#${name}-${value}`).addClass('filter_selected');
                let newName = name.split('-')[1]
                if (location == 'hero') {
                    this.currentFilterHero[newName] = value;
                    setParamFilterHero(this.currentFilterHero);
                }
                else {
                    this.currentFilterEquip[newName] = value;
                    setParamFilterEquip(this.currentFilterEquip);
                }
                applyFilter($target, location)
                checkSelection($target);
            })
        })
    }

    function resetFilter($target, location) {
        let formerSubtype = currentFilter(location).subtype;
        let formerRarity = currentFilter(location).rarity;
        let formerStats = currentFilter(location).stats;
        let formerFavorites = currentFilter(location).favorites;
        let formerClass = currentFilter(location).resonance_class;
        let formerClassType = currentFilter(location).resonance_class_type;
        let formerTheme = currentFilter(location).resonance_theme;
        let formerThemeType = currentFilter(location).resonance_theme_type;

        currentFilter(location).subtype = FILTER_DEFAULT;
        currentFilter(location).rarity = FILTER_DEFAULT;
        currentFilter(location).stats = FILTER_DEFAULT;
        currentFilter(location).favorites = FILTER_DEFAULT;
        currentFilter(location).resonance_class = FILTER_DEFAULT;
        currentFilter(location).resonance_class_type = FILTER_DEFAULT;
        currentFilter(location).resonance_theme = FILTER_DEFAULT;
        currentFilter(location).resonance_theme_type = FILTER_DEFAULT;

        $(`#${location}-subtype-${formerSubtype}`).removeClass('filter_selected');
        $(`#${location}-subtype-${FILTER_DEFAULT}`).addClass('filter_selected');
        $(`#${location}-rarity-${formerRarity}`).removeClass('filter_selected');
        $(`#${location}-rarity-${FILTER_DEFAULT}`).addClass('filter_selected');
        $(`#${location}-stats-${formerStats}`).removeClass('filter_selected');
        $(`#${location}-stats-${FILTER_DEFAULT}`).addClass('filter_selected');
        $(`#${location}-favorites-${formerFavorites}`).removeClass('filter_selected');
        $(`#${location}-favorites-${FILTER_DEFAULT}`).addClass('filter_selected');
        $(`#${location}-resonance_class-${formerClass}`).removeClass('filter_selected');
        $(`#${location}-resonance_class-${FILTER_DEFAULT}`).addClass('filter_selected');
        $(`#${location}-resonance_class_type-${formerClassType}`).removeClass('filter_selected');
        $(`#${location}-resonance_class_type-${FILTER_DEFAULT}`).addClass('filter_selected');
        $(`#${location}-resonance_theme-${formerTheme}`).removeClass('filter_selected');
        $(`#${location}-resonance_theme-${FILTER_DEFAULT}`).addClass('filter_selected');
        $(`#${location}-resonance_theme_type-${formerThemeType}`).removeClass('filter_selected');
        $(`#${location}-resonance_theme_type-${FILTER_DEFAULT}`).addClass('filter_selected');

        if (location == 'hero') setParamFilterHero(this.currentFilterHero);
        else setParamFilterEquip(this.currentFilterEquip);
        applyFilter($target, location);
        checkSelection($target);
    }

    this.$favoriteToggle = $('<div class="favorite-toggle"></div>')
    this.favoriteToggleCallback = (e) => {
        const $favoriteToggle = $(e.target)
        const equipKey = `${$favoriteToggle.data('equip-key')}`
        const isFavorite = JSON.parse($favoriteToggle.attr('data-is-favorite'))

        if (isFavorite) {
            removeFromFavorites(equipKey)
        } else {
            addToFavorites(equipKey)
        }
        applyFilter($('#my-hero-equipement-tab-container #player-inventory-container'), 'hero')
        applyFilter($('#equipement-tab-container #player-inventory-container'), 'equip')
    }

    attachFilterBox($('#my-hero-equipement-tab-container #player-inventory-container'), 'hero')
    attachFilterBox($('#equipement-tab-container #player-inventory-container'), 'equip')
    applyFilter($('#my-hero-equipement-tab-container #player-inventory-container'), 'hero')
    applyFilter($('#equipement-tab-container #player-inventory-container'), 'equip')

    const favouriteSafetyObserver1 = new MutationObserver(() => checkSelection($('#my-hero-equipement-tab-container #player-inventory-container')))
    const favouriteSafetyObserver2 = new MutationObserver(() => checkSelection($('#equipement-tab-container #player-inventory-container')))
    favouriteSafetyObserver1.observe($('#my-hero-equipement-tab-container #player-inventory-container')[0], {subtree: true, attributes: true, attributeFilter: ['class']})
    favouriteSafetyObserver2.observe($('#equipement-tab-container #player-inventory-container')[0], {subtree: true, attributes: true, attributeFilter: ['class']})

    //CSS
    if (localStorage.getItem('HHPlusPlusConfig')) {
        if (JSON.parse(localStorage.getItem('HHPlusPlusConfig')).zoo_MarketTweaks) {
            sheet.insertRule(`#my-hero-equipement-tab-container #player-inventory-container label.equip_filter {
                left: 302px !important;}`
            );

            sheet.insertRule(`#my-hero-equipement-tab-container #player-inventory-container .equip_filter_box {
                top: -448px;
                left: -57px !important;}`
            );

            sheet.insertRule(`#my-hero-equipement-tab-container #player-inventory-container .equip_filter_box.resonance {
                top: -448px;
                left: -162px !important;}`
            );

            sheet.insertRule(`#equipement-tab-container #player-inventory-container .equip_filter_box {
                left: -557px;
                top: 10px;}`
            );

            sheet.insertRule(`#equipement-tab-container #player-inventory-container .equip_filter_box.resonance {
                left: -662px;
                top: 10px;}`
            );

            sheet.insertRule(`#equipement-tab-container .right-container .bottom-container button[rel="sell"] {
                margin-left: 155px;}`
            );
        }
    }

    sheet.insertRule(`label.equip_filter {
        width: 32px;
        position: absolute;
        background: transparent;}`
    );

    sheet.insertRule(`#my-hero-equipement-tab-container #player-inventory-container label.equip_filter {
        left: 227px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #my-hero-equipement-tab-container #player-inventory-container label.equip_filter {
        top: 87px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #my-hero-equipement-tab-container #player-inventory-container label.equip_filter {
        top: 62px;}}`
    );

    sheet.insertRule(`#equipement-tab-container #player-inventory-container label.equip_filter {
        top: 30px;}`
    );

    sheet.insertRule(`.equip_filter input {
        height: 32px;
        width: 32px;
        display: block;
        padding: 0px;}`
    );

    sheet.insertRule(`label.equip_filter::before {
        content: " ";
        display: block;
        position: absolute;
        height: 100%;
        width: 100%;
        background-position: center;
        background-size: 24px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/design_v2/search_open.png");
        pointer-events: none;}`
    );

    sheet.insertRule(`.equip_filter_box {
        position: absolute;
        width: 105px;
        height: -moz-fit-content;
        height: fit-content;
        z-index: 351;
        border-radius: 8px 10px 10px 8px;
        background-color: rgb(30, 38, 30);
        box-shadow: rgba(255, 255, 255, 0.73) 0px 0px;
        padding: 5px;
        border: 1px solid rgb(255, 162, 62);}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #my-hero-equipement-tab-container #player-inventory-container .equip_filter_box {
        left: -118px;
        top: -377px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #my-hero-equipement-tab-container #player-inventory-container .equip_filter_box.resonance {
        text-align: center;
        left: -222px;
        top: -377px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #equipement-tab-container #player-inventory-container .equip_filter_box {
        left: -578px;
        top: 15px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #equipement-tab-container #player-inventory-container .equip_filter_box.resonance {
        text-align: center;
        left: -683px;
        top: 15px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #my-hero-equipement-tab-container #player-inventory-container .equip_filter_box {
        left: -118px;
        top: -397px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #my-hero-equipement-tab-container #player-inventory-container .equip_filter_box.resonance {
        text-align: center;
        left: -222px;
        top: -397px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #equipement-tab-container #player-inventory-container .equip_filter_box {
        left: -578px;
        top: 0px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #equipement-tab-container #player-inventory-container .equip_filter_box.resonance {
        text-align: center;
        left: -683px;
        top: 0px;}}`
    );

    sheet.insertRule(`.equip_filter_box label {
        background: transparent;
        width: auto;
        margin: 0px;}`
    );

    sheet.insertRule(`.equip_filter_box button {
        width: 93px;
        color: #fff;}`
    );

    sheet.insertRule(`.grid-selector {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;}`
    );

    sheet.insertRule(`.grid-selector:last-child {
        margin-bottom: 0px;}`
    );

    sheet.insertRule(`.grid-selector input {
        display: none;}`
    );

    sheet.insertRule(`.grid-selector .selector-options {
        width: -moz-fit-content;
        width: fit-content;
        display: grid;
        grid-gap: 2px;}`
    );

    sheet.insertRule(`.grid-selector .selector-options img {
        height: 28px;
        width: 28px;
        margin: 2px;}`
    );

    sheet.insertRule(`.grid-selector .selector-options div {
        height: 28px;
        width: 28px;
        margin: 2px;
        border-radius: 5px;}`
    );

    sheet.insertRule(`.grid-selector .clear-selector {
        margin-bottom: 5px;
        width: fit-content;}`
    );

    sheet.insertRule(`.grid-selector .clear-selector img {
        height: 32px;
        width: 32px;}`
    );

    sheet.insertRule(`.equip_filter_box .grid-selector input.filter_selected + label, .equip_filter_box .grid-selector input:hover + label {
        background-color: #fff8;}`
    );

    sheet.insertRule(`.slot .favorite-toggle {
        position: absolute;
        display: none;
        height: 32px;
        width: 32px;
        top: 0px;
        right: 0px;
        background-size: 22px;
        background-repeat: no-repeat;
        background-position: center;
        z-index: 1;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;}`
    );

    sheet.insertRule(`.slot:hover .favorite-toggle[data-is-favorite="false"], .slot .favorite-toggle[data-is-favorite="true"] {
        display: block;}`
    );

    sheet.insertRule(`.slot .favorite-toggle[data-is-favorite="false"] {
        background-image: url("${window.IMAGES_URL}/design/ic_star_white.svg");
        opacity: 0.7;}`
    );

    sheet.insertRule(`.slot .favorite-toggle[data-is-favorite="true"] {
        background-color: rgba(30, 38, 30, 0.7);
        background-image: url("${window.IMAGES_URL}/design/ic_star_orange.svg");}`
    );

    sheet.insertRule(`.filtered_out {
        display: none !important;}`
    );

    sheet.insertRule(`#player-inventory-armor .slot.empty, #player-inventory .slot.empty, #merchant-inventory .slot.empty {
        display: none !important;}`
    );
}

function modulePreventBoosters() {
    function checkSelection() {
        let $selected = $('#my-hero-boosters-tab-container .selected');

        if ($selected.length) {
            const checkRarity = JSON.parse($selected.attr('data-d')).item.rarity
            if (checkRarity != 'legendary' && checkRarity != 'mythic') 
                $('#my-hero-boosters-tab-container .my-inventory-equipement-container .my-inventory .bottom-container').css('display', 'none');
            else 
                $('#my-hero-boosters-tab-container .my-inventory-equipement-container .my-inventory .bottom-container').css('display', 'flex');
        }
    }

    checkSelection();
    new MutationObserver(() => checkSelection()).observe($('#my-hero-boosters-tab-container #player-inventory-booster')[0], {subtree: true, attributes: true, attributeFilter: ['class']});
}


/* ==========================
	MYTHIC EQUIPMENT UPGRADE
   ========================== */

function moduleMythicEquipmentUpgrade() {
    const fixFavoritesID = () => {
        if(!localStorage.getItem('HHS.EQUIP_FAVORITES')) return [];

        let favoritesID = JSON.parse(localStorage.getItem('HHS.EQUIP_FAVORITES'));
        let newFavoritesID = [];
        favoritesID.forEach(id => {
            if (id.indexOf('-') != -1) {
                let indexBegin = id.indexOf('-') - 3;
                let indexEnd = id.lastIndexOf('-') + 3;
                newFavoritesID.push(id.substring(0,indexBegin).concat(id.substring(indexEnd)));
            }
            else newFavoritesID.push(id);
        })

        return newFavoritesID;
    }

    const makeEquipKey = ({level, carac1_equip, carac2_equip, carac3_equip, endurance_equip, chance_equip},{identifier, subtype}) => [identifier, subtype, level, carac1_equip, carac2_equip, carac3_equip, endurance_equip, chance_equip].join('_');

    const makeEquipKeyMythic = ({level, carac1_equip, carac2_equip, carac3_equip, endurance_equip, chance_equip},{identifier, subtype},classIdentifier,classResonance,themeIdentifier,themeResonance) => [identifier, subtype, level, carac1_equip, carac2_equip, carac3_equip, endurance_equip, chance_equip, classIdentifier, classResonance, themeIdentifier, themeResonance].join('_');


    function protectFavoriteItems() {
        const favorites = fixFavoritesID();
        const $visibleEquips = $('.mythic-equipment-panel .mythic-equipment-container .inventory-section .inventory-container .items-container').find('.slot');

        if($('.item-container.protected.selected').length > 0) {
            $('button#level-up').prop('disabled', true);
        }

        for (let i=0; i<$visibleEquips.length; i++) {
            const $el = $visibleEquips[i];
            const equipData = JSON.parse($el.dataset.d)
            const {rarity} = equipData.item

            const classIdentifier = (rarity == 'mythic') ? equipData.resonance_bonuses.class.identifier : 0
            const classResonance = (rarity == 'mythic') ? equipData.resonance_bonuses.class.resonance : 0
            const themeIdentifier = (rarity == 'mythic') ? (equipData.resonance_bonuses.theme.identifier || 'multi') : 0
            const themeResonance = (rarity == 'mythic') ? equipData.resonance_bonuses.theme.resonance : 0

            const equipKey = (rarity != 'mythic') ? makeEquipKey(equipData, equipData.skin) : makeEquipKeyMythic(equipData, equipData.skin, classIdentifier, classResonance, themeIdentifier, themeResonance)

            const isFavorite = favorites.includes(equipKey)

            if (isFavorite) {
                $($el.parentNode).removeClass('not-selected');
                $($el.parentNode).addClass('protected');

                let $favoriteToggle = $($el).find('.favorite-toggle')
                if (!$favoriteToggle.length) {
                    $($el).append(`<div class="favorite-toggle"></div>`);
                }
            }
        }

        //CSS
        sheet.insertRule(`.item-container.protected .slot .favorite-toggle {
            position: absolute;
            display: block;
            height: 32px;
            width: 32px;
            top: 0px;
            right: 0px;
            background-image: url("${window.IMAGES_URL}/design/ic_star_orange.svg");
            background-size: 22px;
            background-repeat: no-repeat;
            background-position: center;
            background-color: rgba(30, 38, 30, 0.7);
            z-index: 1;
            border-top-right-radius: 5px;
            border-bottom-left-radius: 5px;}`
        );
    }

    protectFavoriteItems();
    const favouriteSafetyObserver = new MutationObserver(() => protectFavoriteItems());
    favouriteSafetyObserver.observe($('.mythic-equipment-panel .mythic-equipment-container .inventory-section .inventory-container .items-container')[0], {childList: true, subtree: true, attributes: true, attributeFilter: ['class']})

    function filterArmorItems() {
        const getFavorites = () => JSON.parse(localStorage.getItem('HHS.EQUIP_FAVORITES')) || [];
        const getParamFilter = () => {return {subtype: FILTER_DEFAULT, rarity: FILTER_DEFAULT, stats: FILTER_DEFAULT, favorites: FILTER_DEFAULT, resonance_class: FILTER_DEFAULT, resonance_class_type: FILTER_DEFAULT, resonance_theme: FILTER_DEFAULT, resonance_theme_type: FILTER_DEFAULT}};

        const FILTER_DEFAULT = 'all';
        const FILTER_DEFAULT_ICON = 'caracs/no_class.png';
        const FILTER_OPTIONS = new (class {
            get subtype () {return [
                {value: '1', icon: 'pictures/items/ET1.png'},
                {value: '2', icon: 'pictures/items/EH1.png'},
                {value: '3', icon: 'pictures/items/EB1.png'},
                {value: '4', icon: 'pictures/items/ES1.png'},
                {value: '5', icon: 'pictures/items/EF1.png'},
                {value: '6', icon: 'pictures/items/EA1.png'}
            ]}
            get rarity () {return [
                {value: 'common', bgColor: '#8d8e9f'},
                {value: 'rare', bgColor: '#23b56b'},
                {value: 'epic', bgColor: '#ffb244'},
                {value: 'legendary', bgImage: `url(${window.IMAGES_URL}/legendary.png)`},
                {value: 'mythic', bgColor: 'transparent radial-gradient(closest-side at 50% 50%,#f5a866 0,#ec0039 51%,#9e0e27 100%) 0 0 no-repeat padding-box'}
            ]}
            get stats () {return [
                {value: 'rainbow', icon: 'pictures/misc/items_icons/16.svg'},
                {value: 'hc', icon: 'pictures/misc/items_icons/1.png'},
                {value: 'ch', icon: 'pictures/misc/items_icons/2.png'},
                {value: 'kh', icon: 'pictures/misc/items_icons/3.png'},
                {value: 'end', icon: 'pictures/misc/items_icons/4.png'},
                {value: 'har', icon: 'pictures/misc/items_icons/5.png'}
            ]}
            get favorites () {return [
                {value: true, icon: 'design/ic_star_orange.svg'},
                {value: false, icon: 'design/ic_star_white.svg'}
            ]}
            get resonance_class () {return [
                {value: '1', icon: 'pictures/misc/items_icons/1.png'},
                {value: '2', icon: 'pictures/misc/items_icons/2.png'},
                {value: '3', icon: 'pictures/misc/items_icons/3.png'}
            ]}
            get resonance_class_type () {return [
                {value: 'damage', icon: 'caracs/damage.png'},
                {value: 'ego', icon: 'caracs/ego.png'}
            ]}
            get resonance_theme () {return [
                {value: 'multi', icon: 'pictures/girls_elements/Multicolored.png'},
                {value: 'fire', icon: 'pictures/girls_elements/Eccentric.png'},
                {value: 'nature', icon: 'pictures/girls_elements/Exhibitionist.png'},
                {value: 'stone', icon: 'pictures/girls_elements/Physical.png'},
                {value: 'sun', icon: 'pictures/girls_elements/Playful.png'},
                {value: 'water', icon: 'pictures/girls_elements/Sensual.png'},
                {value: 'darkness', icon: 'pictures/girls_elements/Dominatrix.png'},
                {value: 'light', icon: 'pictures/girls_elements/Submissive.png'},
                {value: 'psychic', icon: 'pictures/girls_elements/Voyeurs.png'}
            ]}
            get resonance_theme_type () {return [
                {value: 'defense', icon: 'caracs/deff_undefined.png'},
                {value: 'chance', icon: 'pictures/misc/items_icons/5.png'}
            ]}
        })();
        const FILTER_OPTIONS_GRIDS = {
            subtype: {
                flow: 'column',
                cols: '1fr 1fr 1fr',
                rows: '1fr 1fr'
            },
            rarity: {
                flow: 'row',
                cols: '1fr 1fr 1fr',
                rows: '1fr 1fr'
            },
            stats: {
                flow: 'row',
                cols: '1fr 1fr 1fr',
                rows: '1fr 1fr',
            },
            favorites: {
                flow: 'row',
                cols: '1fr auto',
                rows: '1fr'
            },
            resonance_class: {
                flow: 'row',
                cols: '1fr 1fr 1fr',
                rows: '1fr'
            },
            resonance_class_type: {
                flow: 'row',
                cols: '1fr 1fr',
                rows: '1fr'
            },
            resonance_theme: {
                flow: 'row',
                cols: '1fr 1fr 1fr',
                rows: '1fr 1fr 1fr'
            },
            resonance_theme_type: {
                flow: 'row',
                cols: '1fr 1fr',
                rows: '1fr'
            }
        };
        const STATS_MAP = {
            rainbow: [16],
            hc:[1, 6, 7, 8, 9],
            ch: [2, 6, 10, 11, 12],
            kh: [3, 7, 10, 13, 14],
            end: [4, 8, 11, 13, 15],
            har: [5, 9, 12, 14, 15],
        };

        const createGridSelectorItem = ({location, id, value, icon, bgColor, bgImage}) => (
            `<input type="radio" name=${location}-${id} id="${location}-${id}-${value}" value="${value}" class="${(currentFilter(location)[id] == '' + value) ? "filter_selected" : ""}" />
            <label for="${location}-${id}-${value}">
            ${icon ? `<img src="${window.IMAGES_URL}/${icon}">` : ''}
            ${bgColor || bgImage ? `<div style="${bgColor?`background:${bgColor};`:''}${bgImage?`background-image:${bgImage};background-size:contain;`:''}"></div>` : ''}
            </label>`)

        const createGridSelector = ({location, id, options, gridConfig}) => (
            `<div class="grid-selector" rel="${location}-${id}">
            <div class="clear-selector">
            <input type="radio" name="${location}-${id}" id="${location}-${id}-${FILTER_DEFAULT}" class="${(currentFilter(location)[id] == FILTER_DEFAULT) ? "filter_selected" : ""}" value="${FILTER_DEFAULT}" />
            <label for="${location}-${id}-${FILTER_DEFAULT}">
            <img src="${window.IMAGES_URL}/${FILTER_DEFAULT_ICON}" />
            </label></div>
            <div class="selector-options" style="grid-auto-flow:${gridConfig.flow}; grid-template-rows:${gridConfig.rows}; grid-template-columns:${gridConfig.cols}">
            ${options.map(option => {
                const {value, icon, bgColor, bgImage} = option
                return createGridSelectorItem({location, id, value, icon, bgColor, bgImage})
            }).join('')}
            </div></div>
            <hr style="margin-top: 3px;margin-bottom: 3px; background: rgba(255, 255, 255, 0.533);">`
        );

        const createFilterBox = (location) => {
            return $(`<div style="position:relative">
                <div class="equip_filter_box ${location} form-wrapper" style="display: none;">
                ${['subtype', 'rarity', 'stats', 'favorites'].map(key => createGridSelector({location : location, id: key, options: FILTER_OPTIONS[key], gridConfig: FILTER_OPTIONS_GRIDS[key]})).join('')}
                <button id="reset_button-${location}" class="square_blue_btn">Reset</button>
                </div>
                <div class="equip_filter_box resonance ${location} form-wrapper" style="display: none;">
                <span>${window.GT.design.mythic_equipment_resonance_bonus}</span>
                ${['resonance_class', 'resonance_class_type', 'resonance_theme', 'resonance_theme_type'].map(key => createGridSelector({location : location, id: key, options: FILTER_OPTIONS[key], gridConfig: FILTER_OPTIONS_GRIDS[key]})).join('')}
                </div></div>`
            );
        };

        const createFilterBtn = () => {
            return $('<label class="equip_filter"><input type="button" class="blue_button_L" value="" /></label>')
        };

        const makeEquipKey = ({level, carac1_equip, carac2_equip, carac3_equip, endurance_equip, chance_equip},{id_equip},{identifier, subtype}) => [identifier, subtype, id_equip, level, carac1_equip, carac2_equip, carac3_equip, endurance_equip, chance_equip].join('_');

        const makeEquipKeyMythic = ({level, carac1_equip, carac2_equip, carac3_equip, endurance_equip, chance_equip},{identifier, subtype},classIdentifier,classResonance,themeIdentifier,themeResonance) => [identifier, subtype, level, carac1_equip, carac2_equip, carac3_equip, endurance_equip, chance_equip, classIdentifier, classResonance, themeIdentifier, themeResonance].join('_');

        const currentFilter = () => this.currentFilter;
        this.currentFilter = getParamFilter();

        function applyFilter($target) {
            const favorites = getFavorites();
            const $visibleEquips = $target.find('.slot:not(.empty)');

            $visibleEquips.each((i,el) => {
                const $el = $(el);
                const equipData = $el.data('d');
                const {name_add, rarity} = equipData.item;
                const {subtype} = equipData.skin;

                const classIdentifier = (rarity == 'mythic') ? equipData.resonance_bonuses.class.identifier : 0;
                const classResonance = (rarity == 'mythic') ? equipData.resonance_bonuses.class.resonance : 0;
                const themeIdentifier = (rarity == 'mythic') ? (equipData.resonance_bonuses.theme.identifier || 'multi') : 0;
                const themeResonance = (rarity == 'mythic') ? equipData.resonance_bonuses.theme.resonance : 0;

                const equipKey = (rarity != 'mythic') ? makeEquipKey(equipData, equipData.item, equipData.skin) : makeEquipKeyMythic(equipData, equipData.skin, classIdentifier, classResonance, themeIdentifier, themeResonance)

                const isFavorite = favorites.includes(equipKey);

                const subtypeMatches = this.currentFilter.subtype == FILTER_DEFAULT || this.currentFilter.subtype == subtype;
                const rarityMatches = this.currentFilter.rarity == FILTER_DEFAULT || this.currentFilter.rarity == rarity;
                const statsMatches = this.currentFilter.stats == FILTER_DEFAULT || STATS_MAP[this.currentFilter.stats].includes(name_add);
                const favoritesMatches = this.currentFilter.favorites == FILTER_DEFAULT || JSON.parse(this.currentFilter.favorites) == isFavorite;
                const classIdentifierMatches = this.currentFilter.resonance_class == FILTER_DEFAULT || this.currentFilter.resonance_class == classIdentifier;
                const classResonanceMatches = this.currentFilter.resonance_class_type == FILTER_DEFAULT || this.currentFilter.resonance_class_type == classResonance;
                const themeIdentifierMatches = this.currentFilter.resonance_theme == FILTER_DEFAULT || this.currentFilter.resonance_theme == themeIdentifier;
                const themeResonanceMatches = this.currentFilter.resonance_theme_type == FILTER_DEFAULT || this.currentFilter.resonance_theme_type == themeResonance;

                if ([subtypeMatches, rarityMatches, statsMatches, favoritesMatches, classIdentifierMatches, classResonanceMatches, themeIdentifierMatches, themeResonanceMatches].every(a=>a)) {
                    $(el).removeClass('filtered_out')
                    $(el)[0].parentNode.classList.remove('filtered_out')
                } else {
                    $(el).addClass('filtered_out')
                    $(el)[0].parentNode.classList.add('filtered_out')
                }
            })
        }

        const attachFilterBox = ($target, location) => {
            const $btn = createFilterBtn()
            const $box = createFilterBox(location)
            const $togglable = $box.find('.equip_filter_box')

            $target.append($btn).append($box)

            $btn.click(() => $togglable.toggle())
            $(`#reset_button-${location}`).click(() => resetFilter($target, location));
            $box.find('input').each((i, input) => {
                $(input).click((e) => {
                    const {value, name} = e.target;
                    $(`div[rel=${name}] .filter_selected`).removeClass('filter_selected');
                    $(`#${name}-${value}`).addClass('filter_selected');
                    let newName = name.split('-')[1]
                    this.currentFilter[newName] = value;
                    applyFilter($target)
                    checkSelection($target);
                })
            })
        }

        function resetFilter($target, location) {
            let formerSubtype = currentFilter().subtype;
            let formerRarity = currentFilter().rarity;
            let formerStats = currentFilter().stats;
            let formerFavorites = currentFilter().favorites;
            let formerClass = currentFilter().resonance_class;
            let formerClassType = currentFilter().resonance_class_type;
            let formerTheme = currentFilter().resonance_theme;
            let formerThemeType = currentFilter().resonance_theme_type;

            currentFilter().subtype = FILTER_DEFAULT;
            currentFilter().rarity = FILTER_DEFAULT;
            currentFilter().stats = FILTER_DEFAULT;
            currentFilter().favorites = FILTER_DEFAULT;
            currentFilter().resonance_class = FILTER_DEFAULT;
            currentFilter().resonance_class_type = FILTER_DEFAULT;
            currentFilter().resonance_theme = FILTER_DEFAULT;
            currentFilter().resonance_theme_type = FILTER_DEFAULT;

            $(`#${location}-subtype-${formerSubtype}`).removeClass('filter_selected');
            $(`#${location}-subtype-${FILTER_DEFAULT}`).addClass('filter_selected');
            $(`#${location}-rarity-${formerRarity}`).removeClass('filter_selected');
            $(`#${location}-rarity-${FILTER_DEFAULT}`).addClass('filter_selected');
            $(`#${location}-stats-${formerStats}`).removeClass('filter_selected');
            $(`#${location}-stats-${FILTER_DEFAULT}`).addClass('filter_selected');
            $(`#${location}-favorites-${formerFavorites}`).removeClass('filter_selected');
            $(`#${location}-favorites-${FILTER_DEFAULT}`).addClass('filter_selected');
            $(`#${location}-resonance_class-${formerClass}`).removeClass('filter_selected');
            $(`#${location}-resonance_class-${FILTER_DEFAULT}`).addClass('filter_selected');
            $(`#${location}-resonance_class_type-${formerClassType}`).removeClass('filter_selected');
            $(`#${location}-resonance_class_type-${FILTER_DEFAULT}`).addClass('filter_selected');
            $(`#${location}-resonance_theme-${formerTheme}`).removeClass('filter_selected');
            $(`#${location}-resonance_theme-${FILTER_DEFAULT}`).addClass('filter_selected');
            $(`#${location}-resonance_theme_type-${formerThemeType}`).removeClass('filter_selected');
            $(`#${location}-resonance_theme_type-${FILTER_DEFAULT}`).addClass('filter_selected');

            applyFilter($target);
        }

        attachFilterBox($('.mythic-equipment-container .inventory-section .inventory-container'), 'hero')
        applyFilter($('.mythic-equipment-container .inventory-section .inventory-container'));

        //CSS
        sheet.insertRule(`label.equip_filter {
            width: 32px;
            position: absolute;
            background: transparent;}`
        );

        sheet.insertRule(`.inventory-container label.equip_filter {
            left: 505px;}`
        );

        sheet.insertRule(`${mediaDesktop} {
                .inventory-container label.equip_filter {
            top: 30px;}`
        );

        sheet.insertRule(`${mediaMobile} {
                .inventory-container label.equip_filter {
            top: 58px;}`
        );

        sheet.insertRule(`.equip_filter input {
            height: 32px;
            width: 32px;
            display: block;
            padding: 0px;}`
        );

        sheet.insertRule(`label.equip_filter::before {
            content: " ";
            display: block;
            position: absolute;
            height: 100%;
            width: 100%;
            background-position: center;
            background-size: 24px;
            background-repeat: no-repeat;
            background-image: url("${window.IMAGES_URL}/design_v2/search_open.png");
            pointer-events: none;}`
        );

        sheet.insertRule(`.equip_filter_box {
            position: absolute;
            width: 105px;
            height: -moz-fit-content;
            height: fit-content;
            z-index: 351;
            border-radius: 8px 10px 10px 8px;
            background-color: rgb(30, 38, 30);
            box-shadow: rgba(255, 255, 255, 0.73) 0px 0px;
            padding: 5px;
            border: 1px solid rgb(255, 162, 62);}`
        );

        sheet.insertRule(`.inventory-container .equip_filter_box {
            left: -118px;
            top: -400px;}`
        );

        sheet.insertRule(`.inventory-container .equip_filter_box.resonance {
            text-align: center;
            left: -222px;
            top: -400px;}`
        );

        sheet.insertRule(`.equip_filter_box label {
            background: transparent;
            width: auto;
            margin: 0px;}`
        );

        sheet.insertRule(`.equip_filter_box button {
            width: 93px;
            color: #fff;}`
        );

        sheet.insertRule(`.grid-selector {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;}`
        );

        sheet.insertRule(`.grid-selector:last-child {
            margin-bottom: 0px;}`
        );

        sheet.insertRule(`.grid-selector input {
            display: none;}`
        );

        sheet.insertRule(`.grid-selector .selector-options {
            width: -moz-fit-content;
            width: fit-content;
            display: grid;
            grid-gap: 2px;}`
        );

        sheet.insertRule(`.grid-selector .selector-options img {
            height: 28px;
            width: 28px;
            margin: 2px;}`
        );

        sheet.insertRule(`.grid-selector .selector-options div {
            height: 28px;
            width: 28px;
            margin: 2px;
            border-radius: 5px;}`
        );

        sheet.insertRule(`.grid-selector .clear-selector {
            margin-bottom: 5px;
            width: fit-content;}`
        );

        sheet.insertRule(`.grid-selector .clear-selector img {
            height: 32px;
            width: 32px;}`
        );

        sheet.insertRule(`.equip_filter_box .grid-selector input.filter_selected + label, .equip_filter_box .grid-selector input:hover + label {
            background-color: #fff8;}`
        );

        sheet.insertRule(`.slot .favorite-toggle {
            position: absolute;
            display: none;
            height: 32px;
            width: 32px;
            top: 0px;
            right: 0px;
            background-size: 22px;
            background-repeat: no-repeat;
            background-position: center;
            z-index: 1;
            border-top-right-radius: 5px;
            border-bottom-left-radius: 5px;}`
        );

        sheet.insertRule(`.slot:hover .favorite-toggle[data-is-favorite="false"], .slot .favorite-toggle[data-is-favorite="true"] {
            display: block;}`
        );

        sheet.insertRule(`.slot .favorite-toggle[data-is-favorite="false"] {
            background-image: url("${window.IMAGES_URL}/design/ic_star_white.svg");
            opacity: 0.7;}`
        );

        sheet.insertRule(`.slot .favorite-toggle[data-is-favorite="true"] {
            background-color: rgba(30, 38, 30, 0.7);
            background-image: url("${window.IMAGES_URL}/design/ic_star_orange.svg");}`
        );

        sheet.insertRule(`.filtered_out {
            display: none !important;}`
        );

        sheet.insertRule(`.inventory-container .slot.empty {
            display: none !important;}`
        );
    }

    filterArmorItems();
}


/* ===================
	HAREM INFORMATION
   =================== */

function moduleHarem() {
    const haremGirls = JSON.parse(localStorage.getItem('HHS.HHPNMap')) || '[]';

    let stats = [];
    let haremRight = $('#harem_right');

    stats.girls = 0;
    stats.level_max = 0;
    stats.hourlyMoney = 0;
    stats.allCollect = 0;
    stats.unlockedScenes = 0;
    stats.allScenes = 0;
    stats.rarities = {starting: 0, common: 0, rare: 0, epic: 0, legendary: 0, mythic: 0};
    stats.elements = {darkness: 0, light: 0, psychic: 0, fire: 0, nature: 0, stone: 0, sun: 0, water: 0};
    stats.caracs = {1: 0, 2: 0, 3: 0};
    stats.stars = {affection: 0, money: 0, kobans: 0};
    stats.xp = 0;
    stats.LMxp = 0;
    stats.affection = 0;
    stats.money = 0;
    stats.kobans = 0;
    stats.grades = {starting: {3: 0, 5: 0}, common: {1: 0, 3: 0, 5: 0}, rare: {3: 0, 5: 0}, epic: {3: 0, 5: 0}, legendary: {3: 0, 5: 0}, mythic: {6: 0}};
    stats.gemsRequirements = {darkness: 0, light: 0, psychic: 0, fire: 0, nature: 0, stone: 0, sun: 0, water: 0};
    stats.awakeningStages = {250: 0, 300: 0, 350: 0, 400: 0, 450: 0, 500: 0, 550: 0, 600: 0, 650: 0, 700: 0}

    let EvoReq = [];

    let starting = [];
    starting.push({affection: 90, money: 36000, kobans: 36, taffection: 90, tmoney: 36000, tkobans: 36});
    starting.push({affection: 225, money: 90000, kobans: 60, taffection: 315, tmoney: 126000, tkobans: 96});
    starting.push({affection: 563, money: 225000, kobans: 114, taffection: 878, tmoney: 351000, tkobans: 210});
    starting.push({affection: 1125, money: 450000, kobans: 180, taffection: 2003, tmoney: 801000, tkobans: 390});
    starting.push({affection: 2250, money: 900000, kobans: 300, taffection: 4253, tmoney: 1701000, tkobans: 690});
    EvoReq.starting = starting;

    let commonGirls = [];
    commonGirls.push({affection: 180, money: 72000, kobans: 72, taffection: 180, tmoney: 72000, tkobans: 72});
    commonGirls.push({affection: 450, money: 180000, kobans: 120, taffection: 630, tmoney: 252000, tkobans: 192});
    commonGirls.push({affection: 1125, money: 450000, kobans: 228, taffection: 1755, tmoney: 702000, tkobans: 420});
    commonGirls.push({affection: 2250, money: 900000, kobans: 360, taffection: 4005, tmoney: 1602000, tkobans: 780});
    commonGirls.push({affection: 4500, money: 1800000, kobans: 600, taffection: 8505, tmoney: 3402000, tkobans: 1380});
    EvoReq.common = commonGirls;

    let rareGirls = [];
    rareGirls.push({affection: 540, money: 216000, kobans: 216, taffection: 540, tmoney: 216000, tkobans: 216});
    rareGirls.push({affection: 1350, money: 540000, kobans: 360, taffection: 1890, tmoney: 756000, tkobans: 576});
    rareGirls.push({affection: 3375, money: 1350000, kobans: 678, taffection: 5265, tmoney: 2106000, tkobans: 1254});
    rareGirls.push({affection: 6750, money: 2700000, kobans: 1080, taffection: 12015, tmoney: 4806000, tkobans: 2334});
    rareGirls.push({affection: 13500, money: 5400000, kobans: 1800, taffection: 25515, tmoney: 10206000, tkobans: 4134});
    EvoReq.rare = rareGirls;

    let epicGirls = [];
    epicGirls.push({affection: 1260, money: 504000, kobans: 504, taffection: 1260, tmoney: 504000, tkobans: 504});
    epicGirls.push({affection: 3150, money: 1260000, kobans: 840, taffection: 4410, tmoney: 1764000, tkobans: 1344});
    epicGirls.push({affection: 7875, money: 3150000, kobans: 1578, taffection: 12285, tmoney: 4914000, tkobans: 2922});
    epicGirls.push({affection: 15750, money: 6300000, kobans: 2520, taffection: 28035, tmoney: 11214000, tkobans: 5442});
    epicGirls.push({affection: 31500, money: 12600000, kobans: 4200, taffection: 59535, tmoney: 23814000, tkobans: 9642});
    EvoReq.epic = epicGirls;

    let legendGirls = [];
    legendGirls.push({affection: 1800, money: 720000, kobans: 720, taffection: 1800, tmoney: 720000, tkobans: 720});
    legendGirls.push({affection: 4500, money: 1800000, kobans: 1200, taffection: 6300, tmoney: 2520000, tkobans: 1920});
    legendGirls.push({affection: 11250, money: 4500000, kobans: 2250, taffection: 17550, tmoney: 7020000, tkobans: 4170});
    legendGirls.push({affection: 22500, money: 9000000, kobans: 3600, taffection: 40050, tmoney: 16020000, tkobans: 7770});
    legendGirls.push({affection: 45000, money: 18000000, kobans: 6000, taffection: 85050, tmoney: 34020000, tkobans: 13770});
    EvoReq.legendary = legendGirls;

    let mythicGirls = [];
    mythicGirls.push({affection: 4500, money: 1800000, kobans: 1800, taffection: 4500, tmoney: 1800000, tkobans: 1800});
    mythicGirls.push({affection: 11250, money: 4500000, kobans: 3000, taffection: 15750, tmoney: 6300000, tkobans: 4800});
    mythicGirls.push({affection: 28125, money: 11300000, kobans: 5628, taffection: 43875, tmoney: 17600000, tkobans: 10428});
    mythicGirls.push({affection: 56250 , money: 22500000, kobans: 9000, taffection: 100125, tmoney: 40100000, tkobans: 19428});
    mythicGirls.push({affection: 112500, money: 45000000, kobans: 15000, taffection: 212625, tmoney: 85100000, tkobans: 34428});
    mythicGirls.push({affection: 225000, money: 90000000, kobans: 18000, taffection: 437625, tmoney: 175100000, tkobans: 52428});
    EvoReq.mythic = mythicGirls;

    try {
        haremGirls.forEach((data) => {
            let girl = data[1];

                stats.allCollect += girl.s;
                stats.rarities[girl.r]++;
                stats.elements[girl.e]++;
                stats.caracs[girl.c]++;
                stats.girls++;
                stats.level_max += (250 + girl.awL * 50);
                stats.hourlyMoney += Math.round(girl.sH);
                stats.unlockedScenes += girl.gr;
                stats.allScenes += parseInt(girl.nbGr, 10);
                let nbgrades = parseInt(girl.nbGr, 10);
                if (girl.gr != nbgrades) {
                    stats.affection += EvoReq[girl.r][nbgrades - 1].taffection - girl.af;
                    let currentLevelMoney = 0,
                        currentLevelKobans = 0;
                    if (girl.gr != 0) {
                        currentLevelMoney = EvoReq[girl.r][girl.gr - 1].tmoney;
                        currentLevelKobans = EvoReq[girl.r][girl.gr - 1].tkobans;
                    }
                    stats.money += EvoReq[girl.r][nbgrades - 1].tmoney - currentLevelMoney;
                    if (window.hh_nutaku) {
                        stats.kobans += Math.ceil((EvoReq[girl.r][nbgrades - 1].tkobans - currentLevelKobans) / 6);
                    }
                    else {
                        stats.kobans += EvoReq[girl.r][nbgrades - 1].tkobans - currentLevelKobans;
                    }
                }

                let expToMax = (GIRLS_EXP_LEVELS[girl.r][(250 + girl.awL * 50) - 2] - girl.xp);
                if (expToMax < 0) expToMax = 0;
                stats.xp += expToMax;

                if(nbgrades >= 5 && (girl.r == 'legendary' || girl.r == 'mythic')) {
                    let expToLvlMax = (GIRLS_EXP_LEVELS[girl.r][lvl_max_girl - 2] - girl.xp);
                    if (expToLvlMax < 0) expToLvlMax = 0;
                    stats.LMxp += expToLvlMax;
                }

                stats.grades[girl.r][girl.nbGr]++;

                //Girls number per awakening stage
                let girlLevel = parseInt(girl.l, 10);
                for (let i=0; i<AWAKENING_LEVELS.length; i++) {
                    if (girlLevel >= AWAKENING_LEVELS[i]) {
                        stats.awakeningStages[AWAKENING_LEVELS[i]]++;
                    }
                }

                //Gems needed only for 5* and mythic girls
                if (girl.awL < (AWAKENING_GEMS_COST[girl.r].length-1) && nbgrades >= 5 && (girl.r == 'legendary' || girl.r == 'mythic')) {
                    for (let i = (girl.awL+1); i < AWAKENING_GEMS_COST[girl.r].length; i++) {
                        stats.gemsRequirements[girl.e] += AWAKENING_GEMS_COST[girl.r][i];
                    }
                }
        })
    } catch(err) {console.log("Visit the team edition page to get harem girls data")}

    let MarketStocks;
    try {
        let lsMarket = JSON.parse(localStorage.getItem('HHS.lsMarket')),
            d = new Date(lsMarket.restock.time),
            RestockInfo;

        if (new Date() > lsMarket.restock.time || heroData.infos.level > lsMarket.restock.herolvl) {

            RestockInfo = `> The <a href="${transformNutakuURL("../shop.html")}">Market</a> restocked since your last visit.`;
        }
        else {
            let	marketBookTxt = `${lsMarket.buyable.potion.Nb} ${(lsMarket.buyable.potion.Nb > 1 ? labels.books : labels.book)} (${nThousand(lsMarket.buyable.potion.Xp)} ${labels.Xp})`,
                marketGiftTxt = `${lsMarket.buyable.gift.Nb} ${(lsMarket.buyable.gift.Nb > 1 ? labels.gifts : labels.gift)} (${nThousand(lsMarket.buyable.gift.Xp)} ${labels.affection})`;
            RestockInfo = `- ${marketBookTxt} = ${nThousand(lsMarket.buyable.potion.ValueYmens)} <span class="imgMoney icon-small"></span> ${labels.and} ${nThousand(lsMarket.buyable.potion.ValueKobans)} <span class="imgKobans icon-small"></span>
                <BR>- ${marketGiftTxt} = ${nThousand(lsMarket.buyable.gift.ValueYmens)} <span class="imgMoney icon-small"></span> ${labels.and} ${nThousand(lsMarket.buyable.gift.ValueKobans)} <span class="imgKobans icon-small"></span>
                <BR><font style="color: gray;">${labels.restock}: ${d.toLocaleString()} (${labels.or_level} ${(heroData.infos.level+1)})</font>`;
        }

        MarketStocks =
            `<ul class="grid-harem-infos market-stocks">
            <li><span tooltip="${labels.Equipments}"><span class="equipments-icon icon-big"></span><span>${nThousand(lsMarket.stocks.armor.Nb)}</span></span></li>
            <li><span tooltip="${labels.Boosters}"><span class="boosters-icon icon-big"></span><span>${nThousand(lsMarket.stocks.booster.Nb)}</span></span></li>
            <li><span tooltip="${labels.Books}"><span class="books-icon icon-big"></span><span>${nThousand(lsMarket.stocks.potion.Nb)}<BR>(${nThousand(lsMarket.stocks.potion.Xp)} ${window.GT.design.XP}) </span></span></li>
            <li><span tooltip="${labels.Gifts}"><span class="gifts-icon icon-big"></span><span>${nThousand(lsMarket.stocks.gift.Nb)}<BR>(${nThousand(lsMarket.stocks.gift.Xp)} ${window.GT.design.Aff}) </span></span></li></ul>
            <span class="subTitle">${labels.currently_buyable}:</span>
            ${RestockInfo}`;
    } catch(e) {
        MarketStocks = (window.lsAvailable == 'yes') ? `> ${labels.visit_the}` : `> ${labels.not_compatible}`;
    }

    let StatsString = `<div class="StatsContent">
        <div>
        <span class="Title">${labels.harem_stats}:</span>
        <span class="subTitle" style="margin-top: -10px;">${nThousand(stats.girls)} ${labels.haremettes}</span>

        <ul class="grid-harem-infos girls-class">
        <li><span tooltip="${window.GT.design.caracs.split('\n')[0]}"><span carac="1"></span><span>${stats.caracs[1]}</span></span></li>
        <li><span tooltip="${window.GT.design.caracs.split('\n')[1]}"><span carac="2"></span><span>${stats.caracs[2]}</span></span></li>
        <li><span tooltip="${window.GT.design.caracs.split('\n')[2]}"><span carac="3"></span><span>${stats.caracs[3]}</span></span></li>
        </ul>

        <ul class="grid-harem-infos girls-rarities">
        <ul class="grid-harem-infos girls-rarity">
        <li class="common-rarity"><span class="rarity-tooltip" tooltip="${window.GT.design.girls_rarity_common}"><span class="initial">C</span><span>${(stats.rarities.starting + stats.rarities.common)}</span></span></li>
        <li style="text-align: center;">${labels.including}: </li>
        <li class="common-rarity"><span class="stars"><span class="initial">1<span class="imgStar icon-small"></span></span><span>${stats.grades.common['1']}</span></span></li>
        <li class="common-rarity"><span class="stars"><span class="initial">3<span class="imgStar icon-small"></span></span><span>${stats.grades.common['3']}</span></span></li>
        <li class="common-rarity"><span class="stars"><span class="initial">5<span class="imgStar icon-small"></span></span><span>${stats.grades.common['5']}</span></span></li>
        </ul>

        <ul class="grid-harem-infos girls-rarity">
        <li class="rare-rarity"><span class="rarity-tooltip" tooltip="${window.GT.design.girls_rarity_rare}"><span class="initial">R</span><span>${stats.rarities.rare}</span></span></li>
        <li style="text-align: center;">${labels.including}: </li>
        <li></li>
        <li class="rare-rarity"><span class="stars"><span class="initial">3<span class="imgStar icon-small"></span></span><span>${stats.grades.rare['3']}</span></span></li>
        <li class="rare-rarity"><span class="stars"><span class="initial">5<span class="imgStar icon-small"></span></span><span>${stats.grades.rare['5']}</span></span></li>
        </ul>

        <ul class="grid-harem-infos girls-rarity">
        <li class="epic-rarity"><span class="rarity-tooltip" tooltip="${window.GT.design.girls_rarity_epic}"><span class="initial">E</span><span>${stats.rarities.epic}</span></span></li>
        <li style="text-align: center;">${labels.including}: </li>
        <li></li>
        <li class="epic-rarity"><span class="stars"><span class="initial">3<span class="imgStar icon-small"></span></span><span>${stats.grades.epic['3']}</span></span></li>
        <li class="epic-rarity"><span class="stars"><span class="initial">5<span class="imgStar icon-small"></span></span><span>${stats.grades.epic['5']}</span></span></li>
        </ul>

        <ul class="grid-harem-infos girls-rarity">
        <li class="legendary-rarity"><span class="rarity-tooltip" tooltip="${window.GT.design.girls_rarity_legendary}"><span class="initial">L</span><span>${stats.rarities.legendary}</span></span></li>
        <li style="text-align: center;">${labels.including}: </li>
        <li></li>
        <li class="legendary-rarity"><span class="stars"><span class="initial">3<span class="imgStar icon-small"></span></span><span>${stats.grades.legendary['3']}</span></span></li>
        <li class="legendary-rarity"><span class="stars"><span class="initial">5<span class="imgStar icon-small"></span></span><span>${stats.grades.legendary['5']}</span></span></li>
        </ul>

        <ul class="grid-harem-infos girls-rarity">
        <li class="mythic-rarity"><span class="rarity-tooltip" tooltip="${window.GT.design.girls_rarity_mythic}"><span class="initial">M</span><span>${stats.rarities.mythic}</span></span></li>
        </ul>
        </ul>

        <ul class="grid-harem-infos girls-elements">
        <li><span tooltip="${window.GT.design.darkness_flavor_element}"><span class="element darkness_elem icon"></span><span>${stats.elements.darkness}</span></span></li>
        <li><span tooltip="${window.GT.design.light_flavor_element}"><span class="element light_elem icon"></span><span>${stats.elements.light}</span></span></li>
        <li><span tooltip="${window.GT.design.psychic_flavor_element}"><span class="element psychic_elem icon"></span><span>${stats.elements.psychic}</span></span></li>
        <li><span tooltip="${window.GT.design.fire_flavor_element}"><span class="element fire_elem icon"></span><span>${stats.elements.fire}</span></span></li>
        <li><span tooltip="${window.GT.design.nature_flavor_element}"><span class="element nature_elem icon"></span><span>${stats.elements.nature}</span></span></li>
        <li><span tooltip="${window.GT.design.stone_flavor_element}"><span class="element stone_elem icon"></span><span>${stats.elements.stone}</span></span></li>
        <li><span tooltip="${window.GT.design.sun_flavor_element}"><span class="element sun_elem icon"></span><span>${stats.elements.sun}</span></span></li>
        <li><span tooltip="${window.GT.design.water_flavor_element}"><span class="element water_elem icon"></span><span>${stats.elements.water}</span></span></li>
        </ul>

        <ul class="grid-harem-infos girls-xp">
        <li><span><span class="initial">${window.GT.design.Lvl}</span><span>${nThousand(localeStringToNumber(document.getElementsByClassName('focus_text')[0].innerHTML))} / ${nThousand(stats.level_max)} <BR>(${nThousand(stats.level_max - localeStringToNumber(document.getElementsByClassName('focus_text')[0].innerHTML))})</span></span></li>
        <li><span tooltip="${labels.required_to_get_tier_max_level}"><span class="initial">${window.GT.design.XP}</span><span>${nThousand(stats.xp)} ${window.GT.design.XP} (${nThousand(stats.xp * 200)} <span class="imgMoney icon-small"></span>)</span></span></li>
        <li><span tooltip="${labels.required_to_get_max_level}"><span class="initial">${window.GT.design.XP}</span><span>${nThousand(stats.LMxp)} ${window.GT.design.XP} (${nThousand(stats.LMxp * 200)} <span class="imgMoney icon-small"></span>)</span></span></li>
        </ul>

        <ul class="grid-harem-infos girls-aff">
        <li><span><span class="imgStar icon"></span><span>${stats.unlockedScenes} / ${stats.allScenes} <BR>(${nThousand(stats.allScenes - stats.unlockedScenes)} <span class="emptyStar icon-small"></span>)</span></span></li>
        <li><span tooltip="${labels.required_to_unlock}"><span class="initial">${window.GT.design.Aff}</span><span>${addPriceRow2('', stats.affection, stats.money)}</span></span></li>
        </ul>
        </div>

        <div>
        <span class="subTitle">${window.GT.design.awakening}:</span>
        <ul class="grid-harem-infos girls-awakening">
        <li><span><span class="awakening-lvl">${window.GT.design.Lvl} ${AWAKENING_LEVELS[0]}</span><span>${stats.awakeningStages[AWAKENING_LEVELS[0]]} / ${AWAKENING_REQUIREMENT[0]}</span></span></li>
        <li><span><span class="awakening-lvl">${window.GT.design.Lvl} ${AWAKENING_LEVELS[1]}</span><span>${stats.awakeningStages[AWAKENING_LEVELS[1]]} / ${AWAKENING_REQUIREMENT[1]}</span></span></li>
        <li><span><span class="awakening-lvl">${window.GT.design.Lvl} ${AWAKENING_LEVELS[2]}</span><span>${stats.awakeningStages[AWAKENING_LEVELS[2]]} / ${AWAKENING_REQUIREMENT[2]}</span></span></li>
        <li><span><span class="awakening-lvl">${window.GT.design.Lvl} ${AWAKENING_LEVELS[3]}</span><span>${stats.awakeningStages[AWAKENING_LEVELS[3]]} / ${AWAKENING_REQUIREMENT[3]}</span></span></li>
        <li><span><span class="awakening-lvl">${window.GT.design.Lvl} ${AWAKENING_LEVELS[4]}</span><span>${stats.awakeningStages[AWAKENING_LEVELS[4]]} / ${AWAKENING_REQUIREMENT[4]}</span></span></li>
        <li><span><span class="awakening-lvl">${window.GT.design.Lvl} ${AWAKENING_LEVELS[5]}</span><span>${stats.awakeningStages[AWAKENING_LEVELS[5]]} / ${AWAKENING_REQUIREMENT[5]}</span></span></li>
        <li><span><span class="awakening-lvl">${window.GT.design.Lvl} ${AWAKENING_LEVELS[6]}</span><span>${stats.awakeningStages[AWAKENING_LEVELS[6]]} / ${AWAKENING_REQUIREMENT[6]}</span></span></li>
        <li><span><span class="awakening-lvl">${window.GT.design.Lvl} ${AWAKENING_LEVELS[7]}</span><span>${stats.awakeningStages[AWAKENING_LEVELS[7]]} / ${AWAKENING_REQUIREMENT[7]}</span></span></li>
        <li><span><span class="awakening-lvl">${window.GT.design.Lvl} ${AWAKENING_LEVELS[8]}</span><span>${stats.awakeningStages[AWAKENING_LEVELS[8]]} / ${AWAKENING_REQUIREMENT[8]}</span></span></li>
        <li><span><span class="awakening-lvl">${window.GT.design.Lvl} ${AWAKENING_LEVELS[9]}</span><span>${stats.awakeningStages[AWAKENING_LEVELS[9]]} / ${AWAKENING_REQUIREMENT[9]}</span></span></li>
        </ul>

        <span class="subTitle">${window.GT.design.haremdex_income}:</span>
        <ul class="grid-harem-infos girls-income">
        <li><span><span class="imgMoney icon"></span><span>${nThousand(stats.hourlyMoney)} <span class="imgMoney icon-small"></span> /${window.GT.time.h}</span></span></li>
        <li><span tooltip="${labels.when_all_collectable}"><span class="initial">${window.GT.design.Max}</span><span>${nThousand(stats.allCollect)} <span class="imgMoney icon-small"></span></span></span></li>
        </ul>

        <span class="subTitle">${labels.my_stocks}:</span>
        <ul class="grid-harem-infos gems-stock">
        <li><span tooltip="${window.GT.design.darkness_gem}"><span class="gems darkness_gem icon"></span><span>${nThousand(parseInt(window.player_gems_amount.darkness.amount))}</span></span></li>
        <li><span tooltip="${window.GT.design.light_gem}"><span class="gems light_gem icon"></span><span>${nThousand(parseInt(window.player_gems_amount.light.amount))}</span></span></li>
        <li><span tooltip="${window.GT.design.psychic_gem}"><span class="gems psychic_gem icon"></span><span>${nThousand(parseInt(window.player_gems_amount.psychic.amount))}</span></span></li>
        <li><span tooltip="${window.GT.design.fire_gem}"><span class="gems fire_gem icon"></span><span>${nThousand(parseInt(window.player_gems_amount.fire.amount))}</span></span></li>
        <li><span tooltip="${window.GT.design.nature_gem}"><span class="gems nature_gem icon"></span><span>${nThousand(parseInt(window.player_gems_amount.nature.amount))}</span></span></li>
        <li><span tooltip="${window.GT.design.stone_gem}"><span class="gems stone_gem icon"></span><span>${nThousand(parseInt(window.player_gems_amount.stone.amount))}</span></span></li>
        <li><span tooltip="${window.GT.design.sun_gem}"><span class="gems sun_gem icon"></span><span>${nThousand(parseInt(window.player_gems_amount.sun.amount))}</span></span></li>
        <li><span tooltip="${window.GT.design.water_gem}"><span class="gems water_gem icon"></span><span>${nThousand(parseInt(window.player_gems_amount.water.amount))}</span></span></li>
        </ul>

        ${MarketStocks}</div></div>`;


    $('#harem_left').append(`<div id="CustomBar"><img f="stats" src="https://i.postimg.cc/8cYj8QmP/icon-info.png"></div>`);

    this.$overlayHarem = $(`<div class="script-harem-info-overlay"></div>`);
    $('body').append(this.$overlayHarem);

    this.$overlayHarem.click(() => {
        this.$containerHarem.removeClass('shown');
        this.$overlayHarem.removeClass('shown');
    });

    $('#CustomBar').click(() => {
        if (!this.$containerHarem) {
            this.$containerHarem = $(`<div class="script-harem-info-container fixed_scaled"></div>`);
            this.$containerHarem.append(`<div id="TabsContainer">${StatsString}</div>`);
            $('body').append(this.$containerHarem);
        }
        this.$containerHarem.addClass('shown');
        this.$overlayHarem.addClass('shown');
    });

    function addPriceRow2(rowName, affection, money) {
        return `<b>${rowName}</b> ${nThousand(affection)} ${window.GT.design.Aff} (${nThousand(affection * 417)} <span class="imgMoney icon-small"></span>)<BR>
        ${labels.and} ${nThousand(money)} <span class="imgMoney icon-small"></span>`;
    }

    function addPriceRowGirl(rowName, affection, money, kobans) {
        return `<b>${rowName}:</b> ${nThousand(affection)} ${labels.affection} ${(affection > 1 && lang == 'fr' ? 's' : '')} (${nThousand(affection * 417)} <span class="imgMoney icon-small"></span>) ${labels.and}
        ${nThousand(money)} <span class="imgMoney icon-small"></span> ${labels.or} ${nThousand(kobans)} <span class="imgKobans icon-small"></span><BR>`;
    }

    $('.girls_list').click(() => {
        setTimeout(() => {updateInfo()}, 3*timeout);
    });

    $('#filtering_girls').click(() => {
        setTimeout(() => {updateInfo()}, 5*timeout);
    });

    setTimeout(() => {updateInfo()}, 5*timeout);

    function updateInfo() {
        let girl_html = haremRight.children('[girl]')[0];
        let girlID = $(girl_html).attr('girl');
        let girl = window.girlsDataList[girlID];

        if (window.HH_UNIVERSE != 'comix_c' && window.HH_UNIVERSE != 'nutaku_c' && window.HH_UNIVERSE != 'star_t' && window.HH_UNIVERSE != 'nutaku_t' && window.HH_UNIVERSE != "dotcom_startrans" && window.HH_UNIVERSE != 'nutaku_startrans' && window.HH_UNIVERSE != "dotcom_stargay" && window.HH_UNIVERSE != "nutaku_stargay" && window.HH_UNIVERSE != "mangarpg_m") {
            if ($(girl_html).find('.middle_part .WikiLink h3').length == 0) {
                if ($('#harem_right > div[girl] .middle_part.missing_girl .hidden_girl_info').length > 0) {
                    if (['gay', 'gh_nutaku', 'gh_eroges'].some(testUniverse)) {
                        $(girl_html).find('.middle_part.missing_girl .dialog-box').after(`<div class="WikiLinkDialogbox"><a href="https://harem-battle.club/wiki/Gay-Harem/GH:${girl.name}" target="_blank"> ${girl.name}${labels.wiki} </a></div>`);
                    }
                    else if (lang == 'en') {
                        $(girl_html).find('.middle_part.missing_girl .dialog-box').after(`<div class="WikiLinkDialogbox"><a href="https://harem-battle.club/wiki/Harem-Heroes/HH:${girl.name}" target="_blank"> ${girl.name}${labels.wiki} </a></div>`);
                    }
                    else {
                        $(girl_html).find('.middle_part.missing_girl .dialog-box').after(`<div class="WikiLinkDialogbox"><a href="http://hentaiheroes.go.yj.fr/?id=${girlID}" target="_blank"> ${labels.wiki}${girl.name} </a></div>`);
                    }
                }
                if (($('#harem_right > div[girl] .middle_part.missing_girl .hidden_girl_info').length == 0) && ($('#harem_right .WikiLink').length == 0)) {
                    if (['gay', 'gh_nutaku', 'gh_eroges'].some(testUniverse)) {
                        $(girl_html).find('.middle_part .avatar-box').before(`<div class="WikiLink"><a href="https://harem-battle.club/wiki/Gay-Harem/GH:${girl.name}" target="_blank"> ${girl.name}${labels.wiki} </a></div>`);
                    }
                    else if (lang == 'en') {
                        $(girl_html).find('.middle_part .avatar-box').before(`<div class="WikiLink"><a href="https://harem-battle.club/wiki/Harem-Heroes/HH:${girl.name}" target="_blank"> ${girl.name}${labels.wiki} </a></div>`);
                    }
                    else {
                        $(girl_html).find('.middle_part .avatar-box').before(`<div class="WikiLink"><a href="http://hentaiheroes.go.yj.fr/?id=${girlID}" target="_blank"> ${labels.wiki}${girl.name} </a></div>`);
                    }
                }
            }
            else {
                let newHref = '';
                if (['gay', 'gh_nutaku', 'gh_eroges'].some(testUniverse)) {
                    newHref = `https://harem-battle.club/wiki/Gay-Harem/GH:${girl.name}`;
                }
                else if (lang == 'fr') {
                    newHref = `http://hentaiheroes.go.yj.fr/?id=${girlID}`;
                }
                else {
                    newHref = `https://harem-battle.club/wiki/Harem-Heroes/HH:${girl.name}`;
                }
                $(girl_html).find('.middle_part .WikiLink a').attr('href', newHref);
            }
        }
        let i=0,
            FirstLockedScene = 1,
            AffectionTT = `${labels.evolution_costs}:<BR>`,
            ScenesLink = '',
            girl_quests = (window.FullSize.width > 1025) ? $(girl_html).find('.girl_line .girl_quests') : $(girl_html).find('.mobile-tab-harem-girl .girl_quests');

        girl_quests.find('g').each(() => {
            i++;
            let aff = 0,
                money = 0,
                kobans = 0;
            let currentLevelMoney = 0,
                currentLevelKobans = 0;
            if (girl.graded != 0) {
                currentLevelMoney = EvoReq[girl.rarity][girl.graded - 1].tmoney;
                currentLevelKobans = EvoReq[girl.rarity][girl.graded - 1].tkobans;
            }
            if (girl.graded >= i) {
            }
            else if ((girl.graded + 1) == i && girl.affection_details.level == i) {
                money = EvoReq[girl.rarity][i - 1].tmoney - currentLevelMoney;
                if (window.hh_nutaku) {
                    kobans = Math.ceil((EvoReq[girl.rarity][i - 1].tkobans - currentLevelKobans) / 6);
                }
                else {
                    kobans = EvoReq[girl.rarity][i - 1].tkobans - currentLevelKobans;
                }
            }
            else {
                aff = EvoReq[girl.rarity][i - 1].taffection - girl.affection_details.cur;
                money = EvoReq[girl.rarity][i - 1].tmoney - currentLevelMoney;
                if (window.hh_nutaku) {
                    kobans = Math.ceil((EvoReq[girl.rarity][i - 1].tkobans - currentLevelKobans) / 6);
                }
                else {
                    kobans = EvoReq[girl.rarity][i - 1].tkobans - currentLevelKobans;
                }
            }
            AffectionTT += addPriceRowGirl(`${i}</b><span class="imgStar icon-small"></span>`, aff, money, kobans);
            ScenesLink += (ScenesLink == '') ? 'hh_scenes=' : ',';
            if ($(girl_html).hasClass('grey') || $(girl_html).hasClass('green')) {
                if (FirstLockedScene == 0) {
                    ScenesLink += '0';
                }
                else {
                    FirstLockedScene = 0;
                    let isUpgradable = girl_quests.parent().children('.green_text_button');
                    ScenesLink += (isUpgradable.length) ? '0.' + isUpgradable.attr('href').substr(7) : '0';
                }
            }
            else {
                let attrHref = $(girl_html).parent().attr('href');
                if (typeof attrHref != 'undefined') {
                    ScenesLink += attrHref.substr(7);
                }
            }
        });

        girl_quests.children('a').each(() => {
            let attr = $(girl_html).attr('href');
            if (typeof attr !== typeof undefined && attr !== false) {
                $(girl_html).attr('href', attr + '?' + ScenesLink);
            }
        });
        ScenesLink = '';

        if (girl.affection_details.maxed == false)
            girl_quests.parent().children('h4').prepend(`<span class="CustomTT"></span><div class="AffectionTooltip">${AffectionTT}</div>`);
    }

    moduleGemStock();

    function moduleGemStock() {
        const elements = Object.keys(ELEMENTS_ICON_NAMES)

        const displayGemStock = () => {
            const $gemStock = $(`<div class="gemStock" tooltip=""></div>`)
            const stockTable = `<div style="max-width: 290px;">${labels.Gems_in_stock}<BR>(${labels.missing_gems})</div>
            <table class="gemStockTable" style="justify-content: center; display: flex;"><tbody>
            ${elements.map(element => `<tr>
                                      <td><img src="${window.IMAGES_URL}/pictures/design/gems/${element}.png"></td>
                                      <td>${nThousand(+window.player_gems_amount[element].amount)} (${nThousand(stats.gemsRequirements[element]-(+window.player_gems_amount[element].amount))})</td>
                                      </tr>`).join('')}
            </tody></table>`.replace(/(\n| {4})/g, '');
            $gemStock.attr('tooltip', stockTable);
            $('.haremdex-wrapper').append($gemStock);
        }

        const injectCSS = () => {
            sheet.insertRule(`.gemStock {
                display: block;
                position: absolute;
                background-image: url("${window.IMAGES_URL}/pictures/design/gems/all.png");
                background-size: contain;
                height: 30px;
                width: 30px;
                z-index: 30;}`
            );

            sheet.insertRule(`${mediaDesktop} {
                    .gemStock {
                right: 293px;
                top: 18px;}}`
            );

            sheet.insertRule(`${mediaMobile} {
                    .gemStock {
                left: 665px;
                top: 22px;}}`
            );

            sheet.insertRule(`.gemStockTable img {
                height: 25px;
                width: 25px;}`
            );
        }

        injectCSS();
        displayGemStock();
    }

    //CSS
    sheet.insertRule(`.script-harem-info-overlay {
        display: none;
        background-color: #0808087a;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9;}`
    );

    sheet.insertRule(`.script-harem-info-overlay.shown {
        display: block;}`
    );

    sheet.insertRule(`.script-harem-info-container {
        display: none;
        align-items: center;
        justify-content: center;
        color: #fff;
        width: 1040px;
        height: 585px;
        z-index: 10;
        font-size: 16px;
        pointer-events: none;}`
    );

    sheet.insertRule(`.script-harem-info-container.shown {
        display: flex;}`
    );

    sheet.insertRule(`${mediaMobile} {
            #TabsContainer {
        top: 60px;
        font-size: 14px;
        line-height: 22px;
        font-weight: bold;}}`
    );

    sheet.insertRule(`#TabsContainer {
        z-index: 99;
        position: absolute;
        left: 9px;
        top: 85px;
        width: 1016px;
        border: 1px solid rgb(156, 182, 213);
        box-shadow: 1px -1px 1px 0px rgba(0,0,0,0.3);
        font: normal 12px/16px Tahoma, Helvetica, Arial, sans-serif;
        color: lightgray;
        background-color: rgba(8, 8, 8);
        pointer-events: all;}`
    );

    sheet.insertRule(`.StatsContent {
        display: grid;
        gap: 20px;
        grid-template-columns: 0.8fr 1fr;}`
    );

    sheet.insertRule(`#TabsContainer .initial {
        font-weight: bold;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #TabsContainer .icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background-size: 20px;
        background-repeat: no-repeat;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #TabsContainer .icon {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-size: 24px;
        background-repeat: no-repeat;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #TabsContainer .icon-small {
        display: inline-block;
        width: 14px;
        height: 14px;
        background-size:14px;
        background-repeat: no-repeat;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #TabsContainer .icon-small {
        display: inline-block;
        width: 18px;
        height: 18px;
        background-size:18px;
        background-repeat: no-repeat;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #TabsContainer .icon-big {
        display: inline-block;
        width: 30px;
        height: 30px;
        background-size: 30px;
        background-repeat: no-repeat;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #TabsContainer .icon-big {
        display: inline-block;
        width: 40px;
        height: 40px;
        background-size: 40px;
        background-repeat: no-repeat;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #harem_right .icon-small {
        display: inline-block;
        width: 14px;
        height: 14px;
        background-size:12px;
        background-repeat: no-repeat;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #harem_right .icon-small {
        display: inline-block;
        width: 18px;
        height: 18px;
        background-size: 18px;
        background-repeat: no-repeat;}}`
    );

    sheet.insertRule(`.imgMoney {
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_topbar_soft_currency.png");}`
    );

    sheet.insertRule(`.imgKobans {
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_topbar_hard_currency.png");}`
    );

    sheet.insertRule(`#TabsContainer > div {
        padding: 1px 10px 8px 10px;}`
    );

    sheet.insertRule(`#TabsContainer .Title {
        margin-left: -5px;
        font: bold 16px/22px Tahoma, Helvetica, Arial, sans-serif;
        text-decoration: underline;
        color: #B14;}`
    );

    sheet.insertRule(`#TabsContainer .subTitle {
        padding-top: 6px;
        font: bold 14px/22px Tahoma, Helvetica, Arial, sans-serif;
        text-decoration: underline;
        display: block;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .grid-harem-infos {
        row-gap: 12px;}}`
    );

    sheet.insertRule(`.grid-harem-infos {
        display: grid;
        list-style: none;
        grid-gap: 6px;
        padding-left: 0px;
        break-inside: avoid-column;}`
    );

    sheet.insertRule(`.grid-harem-infos li {
        display: inline-grid;
        min-height: 20px;
        border-radius: 5px;
        padding-right: 7px;
        margin-left: 10px;}`
    );

    sheet.insertRule(`.grid-harem-infos li>span {
        display: flex;
        justify-content: space-between;
        text-align: center;
        align-items: center;}`
    );

    sheet.insertRule(`.girls-class {
        grid-template-columns: 1fr 1fr 1fr;}`
    );

    sheet.insertRule(`.girls-class li, .girls-elements li, .girls-xp li, .girls-aff li, .girls-awakening li, .girls-income li, .gems-stock li, .market-stocks li {
        background: #cccccc42;}`
    );

    sheet.insertRule(`.girls-class li>span, .girls-elements li>span, .girls-xp li>span, .girls-aff li>span, .girls-awakening .awakening-lvl, .girls-income li>span, .gems-stock li>span, .market-stocks li>span  {
        margin-left: -10px;}`
    );

    sheet.insertRule(`.girls-class span[carac]::before {
        width: 20px;
        height: 20px;}`
    );

    sheet.insertRule(`.girls-rarity {
        align-items: center;
        grid-template-columns: 1fr 0.6fr 1fr 1fr 1fr;}`
    );

    sheet.insertRule(`.imgStar {
        background-image: url("${window.IMAGES_URL}/design_v2/affstar_S.png");}`
    );

    sheet.insertRule(`.girls-rarity li span.stars {
        margin-left: -9px;}`
    );

    sheet.insertRule(`.girls-rarity li span.rarity-tooltip {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 5px;}`
    );

    sheet.insertRule(`.common-rarity {
        background: #8d8e9f;}`
    );

    sheet.insertRule(`.rare-rarity {
        background: #23b56b;}`
    );

    sheet.insertRule(`.epic-rarity {
        background: darkgoldenrod;}`
    );

    sheet.insertRule(`.legendary-rarity {
        background-image: url("${window.IMAGES_URL}/legendary.png");}`
    );

    sheet.insertRule(`.mythic-rarity {
        background: transparent radial-gradient(closest-side at 50% 50%,#f5a866 0,#ec0039 51%,#9e0e27 100%) 0 0 no-repeat padding-box;}`
    );

    sheet.insertRule(`.girls-elements {
        margin-block-start: 26px;
        grid-template-columns: 1fr 1fr 1fr 1fr;}`
    );

    sheet.insertRule(`.girls-xp {
        margin-block-start: 25px;
        grid-template-columns: 1fr 1fr 1fr;}`
    );

    sheet.insertRule(`.girls-aff {
        grid-template-columns: 1fr 2fr;}`
    );

    sheet.insertRule(`.girls-aff .emptyStar {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-size: 16px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/design_v2/affstar_empty.png");}`
    );

    sheet.insertRule(`.girls-awakening {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;}`
    );

    sheet.insertRule(`.girls-awakening .awakening-lvl {
        width: 30px;}`
    );

    sheet.insertRule(`.girls-income {
        grid-template-columns: 0.33fr 0.33fr;}`
    );

    sheet.insertRule(`.gems-stock {
        grid-template-columns: 1fr 1fr 1fr 1fr;}`
    );

    sheet.insertRule(`.market-stocks {
        grid-template-columns: 0.7fr 0.7fr 1fr 1fr;}`
    );

    sheet.insertRule(`#TabsContainer .darkness_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/darkness.png");}`
    );

    sheet.insertRule(`#TabsContainer .light_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/light.png");}`
    );

    sheet.insertRule(`#TabsContainer .psychic_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/psychic.png");}`
    );

    sheet.insertRule(`#TabsContainer .fire_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/fire.png");}`
    );

    sheet.insertRule(`#TabsContainer .nature_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/nature.png");}`
    );

    sheet.insertRule(`#TabsContainer .stone_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/stone.png");}`
    );

    sheet.insertRule(`#TabsContainer .sun_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/sun.png");}`
    );

    sheet.insertRule(`#TabsContainer .water_gem {
        background-image: url("${window.IMAGES_URL}/pictures/design/gems/water.png");}`
    );

    sheet.insertRule(`#TabsContainer .darkness_elem {
        background-image: url("${window.IMAGES_URL}/pictures/girls_elements/Dominatrix.png");}`
    );

    sheet.insertRule(`#TabsContainer .light_elem {
        background-image: url("${window.IMAGES_URL}/pictures/girls_elements/Submissive.png");}`
    );

    sheet.insertRule(`#TabsContainer .psychic_elem {
        background-image: url("${window.IMAGES_URL}/pictures/girls_elements/Voyeurs.png");}`
    );

    sheet.insertRule(`#TabsContainer .fire_elem {
        background-image: url("${window.IMAGES_URL}/pictures/girls_elements/Eccentric.png");}`
    );

    sheet.insertRule(`#TabsContainer .nature_elem {
        background-image: url("${window.IMAGES_URL}/pictures/girls_elements/Exhibitionist.png");}`
    );

    sheet.insertRule(`#TabsContainer .stone_elem {
        background-image: url("${window.IMAGES_URL}/pictures/girls_elements/Physical.png");}`
    );

    sheet.insertRule(`#TabsContainer .sun_elem {
        background-image: url("${window.IMAGES_URL}/pictures/girls_elements/Playful.png");}`
    );

    sheet.insertRule(`#TabsContainer .water_elem {
        background-image: url("${window.IMAGES_URL}/pictures/girls_elements/Sensual.png");}`
    );

    sheet.insertRule(`#TabsContainer .equipments-icon {
        background-image: url("${window.IMAGES_URL}/pictures/design/pachinko/ic_equipment.png");}`
    );

    sheet.insertRule(`#TabsContainer .boosters-icon {
        background-image: url("${window.IMAGES_URL}/pictures/design/pachinko/ic_booster.png");}`
    );

    sheet.insertRule(`#TabsContainer .books-icon {
        background-image: url("${window.IMAGES_URL}/pictures/design/pachinko/ic_book.png");}`
    );

    sheet.insertRule(`#TabsContainer .gifts-icon {
        background-image: url("${window.IMAGES_URL}/pictures/design/pachinko/ic_gift.png");}`
    );

    sheet.insertRule(`#harem_left .HaremetteNb {
        float: right;
        line-height: 14px;
        font-size: 12px;}`
    );

    sheet.insertRule(`#CustomBar {
        z-index: 99;
        width: 35px;
        padding: 3px 10px 0 3px;
        font: bold 10px Tahoma, Helvetica, Arial, sans-serif;
        position: absolute;}`
    );

    sheet.insertRule(`${mediaMobile} {
            #CustomBar {
        left: 90px;
        top: 50px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #CustomBar {
        left: 60px;
        top: 40px;}}`
    );

    sheet.insertRule(`#CustomBar img {
        width: 20px;
        height: 20px;
        margin-right: 3px;
        margin-bottom: 3px;
        opacity: 0.5;}`
    );

    sheet.insertRule(`#CustomBar img:hover {
        opacity: 1;
        cursor: pointer;}`
    );

    sheet.insertRule(`#CustomBar .TopBottomLinks {
        float: right;
        margin-top: 2px;}`
    );

    sheet.insertRule(`#CustomBar a {
        color: #008;
        text-decoration: none;}`
    );

    sheet.insertRule(`#TabsContainer a {
        color: lightcoral;
        text-decoration: none;}`
    );

    sheet.insertRule(`#harem_whole .WikiLink a {
        color: #87CEFA;
        text-decoration: none;}`
    );

    sheet.insertRule(`#CustomBar a:hover, #TabsContainer a:hover, #harem_right .WikiLink a:hover {
        color: #B14;
        text-decoration: underline;}`
    );

    sheet.insertRule(`${mediaMobile} {
            #harem_whole .CustomTT {
        position: absolute;
        z-index: 100;
        background-image: url("https://i.postimg.cc/qBDt6yHV/icon-question.png");
        background-size: 20px;
        width: 20px;
        height: 20px;
        visibility: none;
        top: 32px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #harem_whole .CustomTT {
        position: absolute;
        z-index: 100;
        background-image: url("https://i.postimg.cc/qBDt6yHV/icon-question.png");
        background-size: 18px;
        width: 18px;
        height: 18px;
        visibility: none;
        top: 25px;}}`
    );

    sheet.insertRule(`#harem_whole .CustomTT:hover {
        cursor: help;}`
    );

    sheet.insertRule(`#harem_whole .CustomTT:hover + div {
        opacity: 1;
        visibility: visible;}`
    );

    sheet.insertRule(`#harem_whole .AffectionTooltip {
        position: absolute;
        z-index: 99;
        margin: 59px 0 0 0;
        display: block; overflow: auto;
        border: 1px solid rgb(162, 195, 215);
        border-radius: 8px;
        box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1);
        padding: 3px 7px 4px 7px;
        background-color: #F2F2F2;
        color: #1E90FF;
        font: normal 9px/17px Tahoma, Helvetica, Arial, sans-serif;
        text-align: left;
        text-shadow: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 400ms, visibility 400ms;}`
    );

    sheet.insertRule(`#harem_whole .AffectionTooltip b {
        font-weight: bold;}`
    );

    sheet.insertRule(`#harem_whole .WikiLink {
        z-index: 99;
        position: absolute;
        top: 10px;
        width: 47%;
        font-size: 12px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #harem_whole .WikiLink {
        width: 41%;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #harem_whole .WikiLink {
        width: 47%;}}`
    );

    sheet.insertRule(`#harem_whole .WikiLinkDialogbox a {
        font-size: 14px;
        position: absolute;
        margin-top: 100px;
        margin-left: -117px;
        width: 235px;
        text-decoration: none;
        color: #24a0ff;}`
    );

    sheet.insertRule(`#harem_whole .WikiLinkDialogbox a:hover {
        text-decoration: underline;}`
    );
}


/* ===============
	HAREM FILTER
   =============== */

function moduleHaremFilter() {
    createAndAttach();

    new MutationObserver(() => {
        if ($('#harem_whole #filtering_girls .form-wrapper .reset-filters-container').length > 0 && $('#teams-filter').length == 0) createAndAttach();
    }).observe($('#harem_whole #filtering_girls')[0], {childList: true, subtree: true})

    function createAndAttach() {
        const $teamsButton = createTeamsButton();
        $('#filtering_girls .reset-filters-container').prepend($teamsButton);

        const $teamsBox = createTeamsBox();
        $('#harem_whole').append($teamsBox);

        const bdsmTeams = JSON.parse(localStorage.getItem('HHS.TeamsDictionary'));
        const labyTeam = JSON.parse(localStorage.getItem('HHS.LabyTeamDictionary'));

        $teamsButton.click(()=>$teamsBox.find('.team-selection').toggle());
        $teamsBox.find('.team-slot-container').click(function () {
            $teamsBox.find('.team-selection').css('display', 'none');
        });
        $teamsBox.find('.close-team-selection').click(() => $teamsBox.find('.team-selection').css('display', 'none'));

        if (bdsmTeams) {
            const {teamsDict} = bdsmTeams;
            Array.from($('.team-slot-container:not(.laby)')).forEach((team) => {
                team.addEventListener('click', () => {
                    const girlDictionary = (!localStorage.getItem('HHS.HHPNMap')) ? new Map(): new Map(JSON.parse(localStorage.getItem('HHS.HHPNMap')));
                    let avatarList = [];

                    let girlsTeam = teamsDict[$(team).attr('data-id-team')].girls;
                    localStorage.setItem('HHS.filteredGirlsList', JSON.stringify(girlsTeam));

                    girlsTeam.forEach((girlId) => {
                        let avatar = 0;
                        if (girlDictionary.get(girlId)) avatar = girlDictionary.get(girlId).av;
                        avatarList.push(`${window.IMAGES_URL}/pictures/girls/${girlId}/ava${avatar}-1200x.webp`);
                    })
                    localStorage.setItem('HHS.filteredAvatarList', JSON.stringify(avatarList));
                })
            })
        }

        if (labyTeam) {
            const {labyTeamDict} = labyTeam;
            Array.from($('.team-slot-container.laby')).forEach((team) => {
                team.addEventListener('click', () => {
                    const girlDictionary = (!localStorage.getItem('HHS.HHPNMap')) ? new Map(): new Map(JSON.parse(localStorage.getItem('HHS.HHPNMap')));
                    let avatarList = [];

                    let girlsTeam = labyTeamDict[$(team).attr('data-id-team')].girls;
                    localStorage.setItem('HHS.filteredGirlsList', JSON.stringify(girlsTeam));

                    girlsTeam.forEach((girlId) => {
                        let avatar = 0;
                        if (girlDictionary.get(girlId)) avatar = girlDictionary.get(girlId).av;
                        avatarList.push(`${window.IMAGES_URL}/pictures/girls/${girlId}/ava${avatar}-1200x.webp`);
                    })
                    localStorage.setItem('HHS.filteredAvatarList', JSON.stringify(avatarList));
                })
            })
        }
    }

    function createTeamsButton() {
        return $(`<button id="teams-filter" class="square_blue_btn" style="height: ${$('#reset-filters').css('height')}">${labels.teams}</button>`);
    }

    function createTeamsBox() {
        const bdsmTeams = JSON.parse(localStorage.getItem('HHS.TeamsDictionary'));
        const labyTeam = JSON.parse(localStorage.getItem('HHS.LabyTeamDictionary'));

        if (!bdsmTeams) {
            return $(`<div style="position:relative">
            <div class="team-selection" style="display: none;">
            <span class="close-team-selection"></span>
            ${labels.visit_teams}
            </div></div>`)
        }

        const {teamIds, teamsDict} = bdsmTeams;
        let labyContainer;

        if (labyTeam) {
            const {labyTeamDict} = labyTeam;
            labyContainer = `<a class="team-slot-container laby ${labyTeamDict[0].iconRarity}" data-id-team="${labyTeamDict[0].teamId}" data-girl-ids='${JSON.stringify(labyTeamDict[0].girls)}' href="${transformNutakuURL(`/girl/${labyTeamDict[0].girls[0]}`)}">
                                <img src="${window.IMAGES_URL}/pictures/girls/${labyTeamDict[0].iconId}/ico${labyTeamDict[0].iconLevel}.png" />
                            </a>`
        }
        else {
            labyContainer = '';
        }

        return $(`<div style="position:relative">
            <div class="team-selection" style="display: none;">
            <span class="close-team-selection"></span>
            <div class="teams-grid-container rarity-background">${teamIds.map(teamId => teamsDict[teamId]).map(team =>
                `<a class="team-slot-container ${team.iconRarity}" data-id-team="${team.teamId}" data-girl-ids='${JSON.stringify(team.girls)}' href="${transformNutakuURL(`/girl/${team.girls[0]}`)}">
                <img src="${window.IMAGES_URL}/pictures/girls/${team.iconId}/ico${team.iconLevel}.png" />
                ${team.themeElements ?
                    `<div class="theme-icons">${team.themeElements.map(element=>`<img class="theme-icon" src="${window.IMAGES_URL}/pictures/girls_elements/${element}.png"/>`).join('')}
                    </div>` : ''}
                </a>`).join('')}
            ${labyContainer}
            </div></div></div>`)
    }

    //CSS
    sheet.insertRule(`#filtering_girls > .form-wrapper .reset-filters-container {
        justify-content: space-around;}`
    );

    sheet.insertRule(`.team-selection {
        position: absolute;
        left: 3px;
        width: 400px;
        height: fit-content;
        border-radius: 8px 10px 10px 8px;
        background-color: #1e261e;
        box-shadow: rgba(255, 255, 255, 0.73) 0px 0px;
        padding: 5px;
        border: 1px solid #ffa23e;
        z-index: 10;
        padding-bottom: 16px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .team-selection {
        top: 55px}`
    );

    sheet.insertRule(`${mediaMobile} {
            .team-selection {
        top: 30px;}`
    );

    sheet.insertRule(`.teams-grid-container {
        display: grid;
        grid-template-columns: auto auto auto auto;
        grid-row-gap: 0.7rem;
        padding: 0.4rem 0.9rem 0.4rem 0.9rem;
        margin-right: -1rem;
        & .team-slot-container > img {
        border-radius: 0.4rem;}}`
    );

    sheet.insertRule(`.close-team-selection, .close-filter {
        position: absolute;
        display: block;
        background-size: cover;
        background-image: url("${window.IMAGES_URL}/clubs/ic_xCross.png");
        height: 32px;
        width: 35px;
        top: -16px;
        right: -17px;
        cursor: pointer;}`
    );

    sheet.insertRule(`[rel="select-team"] {
        width: 100%;
        height: 36px;
        padding-top: 5px;}`
    );

    sheet.insertRule(`.theme-icons {
        position: absolute;
        bottom: -10px;}`
    );

    sheet.insertRule(`.theme-icon {
        width: 26px;}`
    );

    sheet.insertRule(`${mediaMobile} {
            #filtering_girls .form-wrapper .form-control .checkbox-group {
        margin: 1px 0 5px 0;}}`
    );

    sheet.insertRule(`#filtering_girls > .form-wrapper .reset-filters-container, #reset-filters {
        z-index: 10;
        height: max-content;}`
    );

    sheet.insertRule(`#teams-filter {
        margin-top: 3px;
        color: #fff;
        min-width: 120px;}`
    );

    sheet.insertRule(`.team-slot-container.laby {
        grid-column-start: 1;}`
    );
}

//Add previous/next arrows on girl screen to navigate easily between the harem filtered girls
function haremGetFilteredGirls() {
    function getHaremGirls() {
        let girlsDictionary = [];
        let filteredGirlsList = [];
        let filteredAvatarList = [];

        if ($('#harem_left .girls_list .harem-girl').length > 0) {
            for (let i=0; i<$('#harem_left .girls_list .harem-girl').length; i++) {
                let girl_id = parseInt($($('#harem_left .girls_list .harem-girl')[i]).attr('girl'), 10);
                girlsDictionary.push(girlsDataList[girl_id]);
            }
            girlsDictionary.forEach((girl) => {if (girl.shards >= 100) {
                filteredGirlsList.push(girl.id_girl);
                filteredAvatarList.push(`${window.IMAGES_URL}/pictures/girls/${girl.id_girl}/ava${girlsDataList[girl.id_girl].ico.charAt(girlsDataList[girl.id_girl].ico.indexOf("ico")+3)}-1200x.webp`);
            }});
        }

        return {filteredGirlsList: filteredGirlsList, filteredAvatarList: filteredAvatarList};
    }

    setTimeout(() => {
        if (!$('#harem_left .harem-top-controls .nb_girls').length) {
            $('#harem_left .harem-top-controls').after(`<div class="nb_girls">${window.GT.design.Girls} :
                <span id="girls_nb" style="color: #fff">${nThousand(Object.keys(window.girlsDataList).length)}</span></div>`);
        }

        let filteredGirlsList = getHaremGirls().filteredGirlsList;
        let filteredAvatarList = getHaremGirls().filteredAvatarList;
        localStorage.setItem('HHS.filteredGirlsList', JSON.stringify(filteredGirlsList));
        localStorage.setItem('HHS.filteredAvatarList', JSON.stringify(filteredAvatarList));

        new MutationObserver(() => {
            $('#girls_nb')[0].textContent = nThousand($('#harem_left .girls_list .harem-girl').length);
            let filteredGirlsList = getHaremGirls().filteredGirlsList;
            let filteredAvatarList = getHaremGirls().filteredAvatarList;
            localStorage.setItem('HHS.filteredGirlsList', JSON.stringify(filteredGirlsList));
            localStorage.setItem('HHS.filteredAvatarList', JSON.stringify(filteredAvatarList));
        }).observe($('#harem_left .girls_list')[0], {childList: true})

        //CSS
        sheet.insertRule(`#harem_left .nb_girls {
            font-weight: 400;
            color: #ffb827;
            letter-spacing: .22px;
            text-align: center;
            text-shadow: 1px 1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000;}`
        );

        sheet.insertRule(`${mediaDesktop} {
                #harem_left .nb_girls {
            font-size: 14px;}}`
        );

        sheet.insertRule(`${mediaMobile} {
                #harem_left .nb_girls {
            font-size: 18px;}}`
        );

        sheet.insertRule(`${mediaDesktop} {
                #harem_left .buttons_container {
            height: 4rem;}}`
        );

        sheet.insertRule(`${mediaMobile} {
                #harem_left .harem-top-controls {
            margin-bottom: -5px;}}`
        );
    }, 2*timeout);
}

function haremGirlsShortcut() {
    setTimeout(() => {
        $('#experience .girl-section .girl-lower-info .girl-resource-section .bar-section .top-text p:first').after(
            `<span id="displayGirlXP" style="position: absolute; top: -3px; left: 124px; width: 100px; text-shadow: 0 0 15px rgba(153,68,0,.35); background: linear-gradient(to top,#ff9000 0,#ffec18 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${nThousand(parseInt(window.girl.xp, 10))} XP</span>`
        );

        if(pageLang == 'fr' && $('p.until-next-grade').length > 0) {
            $('p.until-next-grade')[0].childNodes[0].textContent = "Jusqu'à l'étoile ";
            $('p.until-max-grade')[0].childNodes[0].textContent = "Jusqu'à l'étoile ";
        }
        if(pageLang == 'fr' && $('p.girl_exp_left').length > 0) {
            $('p.girl_exp_left')[0].childNodes[0].textContent = "Jusqu'au lvl. ";
            $('p.girl-awakening-exp-left')[0].childNodes[0].textContent = "Jusqu'au lvl. ";
        }

        $('#gifts_tab').click(() => {
            if(pageLang == 'fr' && $('p.until-next-grade').length > 0) {
                $('p.until-next-grade')[0].childNodes[0].textContent = "Jusqu'à l'étoile ";
                $('p.until-max-grade')[0].childNodes[0].textContent = "Jusqu'à l'étoile ";
            }
        });
        $('#books_tab').click(() => {
            if (!$('#experience #displayGirlXP').length) {
                $('#experience .girl-section .girl-lower-info .girl-resource-section .bar-section .top-text p:first').after(
                    `<span id="displayGirlXP" style="position: absolute; top: -3px; left: 124px; width: 100px; text-shadow: 0 0 15px rgba(153,68,0,.35); background: linear-gradient(to top,#ff9000 0,#ffec18 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${nThousand(parseInt(window.girl.xp, 10))} XP</span>`
                );
            }
            if(pageLang == 'fr' && $('p.girl_exp_left').length > 0) {
                $('p.girl_exp_left')[0].childNodes[0].textContent = "Jusqu'au lvl. ";
                $('p.girl-awakening-exp-left')[0].childNodes[0].textContent = "Jusqu'au lvl. ";
            }
        });

        if ($('#experience .girl-section .girl-lower-info .girl-resource-section .girl_exp_left .xp-next-level').length > 0) {
            new MutationObserver(() => {
                $('#displayGirlXP').text(nThousand(parseInt(window.girl.Xp.cur, 10)) + ' XP')
            }).observe($('#experience .girl-section .girl-lower-info .girl-resource-section .girl_exp_left .xp-next-level')[0], {childList: true})
        }
    }, 1000);

    const idCurrentGirl = parseInt(window.girl.id_girl, 10);
    const filteredGirlsList = JSON.parse(localStorage.getItem('HHS.filteredGirlsList'));
    const filteredAvatarList = JSON.parse(localStorage.getItem('HHS.filteredAvatarList'));
    const nbGirls = filteredGirlsList.length
    const currentIndex = filteredGirlsList.indexOf(idCurrentGirl);
    const previousIndex = (nbGirls + currentIndex - 1) % nbGirls;
    const nextIndex = (nbGirls + currentIndex + 1) % nbGirls;
    const idPreviousGirl = filteredGirlsList[previousIndex];
    const idNextGirl = filteredGirlsList[nextIndex];

    $('#experience .girl-section').append(`<a href="${transformNutakuURL(`/girl/${idPreviousGirl}?resource=experience`)}" id="previous_girl" class="quicknav prev"><img src="${filteredAvatarList[previousIndex]}"></a>`);
    $('#experience .girl-section').append(`<a href="${transformNutakuURL(`/girl/${idNextGirl}?resource=experience`)}" id="next_girl" class="quicknav next"><img src="${filteredAvatarList[nextIndex]}"></a>`);

    $('#affection .girl-section').append(`<a href="${transformNutakuURL(`/girl/${idPreviousGirl}?resource=affection`)}" id="previous_girl" class="quicknav prev"><img src="${filteredAvatarList[previousIndex]}"></a>`);
    $('#affection .girl-section').append(`<a href="${transformNutakuURL(`/girl/${idNextGirl}?resource=affection`)}" id="next_girl" class="quicknav next"><img src="${filteredAvatarList[nextIndex]}"></a>`);

    $('#equipment .girl-section').append(`<a href="${transformNutakuURL(`/girl/${idPreviousGirl}?resource=equipment`)}" id="previous_girl" class="quicknav prev"><img src="${filteredAvatarList[previousIndex]}"></a>`);
    $('#equipment .girl-section').append(`<a href="${transformNutakuURL(`/girl/${idNextGirl}?resource=equipment`)}" id="next_girl" class="quicknav next"><img src="${filteredAvatarList[nextIndex]}"></a>`);

    $('#skills .girl-skills-overlay').append(`<a href="${transformNutakuURL(`/girl/${idPreviousGirl}?resource=skills`)}" id="previous_girl" class="quicknav-skills prev"><img src="${filteredAvatarList[previousIndex]}"></a>`);
    $('#skills .girl-skills-overlay').append(`<a href="${transformNutakuURL(`/girl/${idNextGirl}?resource=skills`)}" id="next_girl" class="quicknav-skills next"><img src="${filteredAvatarList[nextIndex]}"></a>`);

    new MutationObserver(() => {
        setTimeout(() => {
            $('#experience .girl-section .girl-lower-info .girl-resource-section .bar-section .top-text p:first').after(
                `<span id="displayGirlXP" style="position: absolute; top: -3px; left: 124px; width: 100px; text-shadow: 0 0 15px rgba(153,68,0,.35); background: linear-gradient(to top,#ff9000 0,#ffec18 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${nThousand(parseInt(window.girl.xp, 10))} XP</span>`
            );
        }, 4*timeout);

        if ($('#experience .girl-section .girl-lower-info .girl-resource-section .girl_exp_left .xp-next-level').length > 0) {
            new MutationObserver(() => {
                $('#displayGirlXP').text(`${nThousand(parseInt(window.girl.Xp.cur, 10))} XP`)
            }).observe($('#experience .girl-section .girl-lower-info .girl-resource-section .girl_exp_left .xp-next-level')[0], {childList: true});
        }
    }).observe($('#girl-leveler-tabs')[0], {subtree: true, attributes: true, attributeFilter: ['class']});


    //CSS
    sheet.insertRule(`.quicknav {
        position: absolute;
        width: 100px;
        bottom: 156px;}`
    );

    sheet.insertRule(`.quicknav-skills {
        position: absolute;
        width: 100px;}`
    );

    sheet.insertRule(`.quicknav.prev {
        left: 5px;}`
    );

    sheet.insertRule(`.quicknav-skills.prev {
        margin-left: 20px;}`
    );

    sheet.insertRule(`.quicknav.next {
        left: 405px;}`
    );

    sheet.insertRule(`.quicknav-skills.next {
        margin-left: 360px;}`
    );

    sheet.insertRule(`.quicknav img, .quicknav-skills img {
        opacity: 0.8;
        width: 100%;}`
    );

    sheet.insertRule(`.quicknav img:hover, .quicknav-skills img:hover {
        opacity: 1;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .overlayed-title {
        position: relative;
        top: 10px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .overlayed-title {
        position: relative;
        top: 5px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #girl-leveler-tabs {
        top: 5px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #experience .girl-lower-info, #affection .girl-lower-info {
        margin-top: -1px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #equipment .girl-lower-info {
        margin-top: -14px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #experience .girl-lower-info, #affection .girl-lower-info {
        margin-top: -11px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #equipment .girl-lower-info {
        margin-top: -26px;}}`
    );

    sheet.insertRule(`#equipment .girl-section .girl-avatar .item-column:nth-child(1) {
        position: relative;
        left: 25px;}`
    );

    sheet.insertRule(`#equipment .girl-section .girl-avatar .item-column:nth-child(3) {
        position: relative;
        left: -35px;}`
    );

    sheet.insertRule(`#equipment .girl-section .girl-avatar .girl-avatar-wrapper {
        position: relative;
        top: -20px;
        left: -5px;}`
    );
}

function moduleTeamsCollector() {
    const ID_FROM_URL_REGEX = /(?<id>[0-9]+)\/ico(?<level>[0-9])(-[0-9]+x)?\.[a-z]+(\?v=[0-9]+)?$/i
    const ELEMENT_FROM_URL_REGEX = /(?<element>[A-Z][a-z]+)\.[a-z]+(\?v=[0-9]+)?$/i

    const extractIdFromUrl = (url) => {
        const matches = url.match(ID_FROM_URL_REGEX)
        if (!matches || !matches.groups) {
            return {}
        }

        const {groups: {id, level}} = matches
        return {id, level}
    }
    const extractElementFromUrl = (url) => {
        const matches = url.match(ELEMENT_FROM_URL_REGEX)
        if (!matches || !matches.groups) {
            return
        }

        const {groups: {element}} = matches
        return element
    }

    if (['/teams'].some(testPage)) {
        const teamsDict = {}
        const teamIds = []

        $('.team-slot-container[data-is-empty!="1"][data-is-locked!="1"]').each((i, slot) => {
            const teamId = $(slot).data('id-team')
            const icon = $(slot).find('img').attr('girl-ico-src')
            const {id: iconId, level: iconLevel} = extractIdFromUrl(icon)

            const themeIcons = $(slot).find('.team-slot-themes-container img').map((i,el)=>$(el).attr('src')).toArray()
            const themeElements = themeIcons.map(extractElementFromUrl)

            const classes = $(slot).attr('class').replace(/\s+/g, ' ').split(' ')
            const iconRarity = ['mythic', 'legendary', 'epic', 'rare', 'common', 'starting'].find(rarity => classes.includes(rarity))

            teamsDict[teamId] = {
                teamId,
                iconId,
                iconLevel,
                iconRarity,
                themeElements,
            }
            teamIds.push(teamId)
        })

        const teamsData = window.teams_data;
        let i=1;
        while(!teamsData[i].locked && teamsData[i].id_team != null) {
            const id_team = teamsData[i].id_team;
            const girls = [];
            for(let j=0; j<teamsData[i].girls_ids.length; j++) {
                const girlId = parseInt(teamsData[i].girls_ids[j], 10);
                girls.push(girlId)
            }
            teamsDict[id_team].girls = girls;

            i++;
        }

        const teams = {
            teamsDict,
            teamIds
        }
        localStorage.setItem('HHS.TeamsDictionary', JSON.stringify(teams));
    }

    else if (['labyrinth-pre-battle'].some(testPage)) {
        const labyTeamDict = {};
        const labyTeamData = window.hero_fighter.team;

        const teamId = 0;
        const icon = labyTeamData.girls[0].ico;
        const {id: iconId, level: iconLevel} = extractIdFromUrl(icon);
        const iconRarity = labyTeamData.girls[0].girl.rarity;

        labyTeamDict[teamId] = {
            teamId,
            iconId,
            iconLevel,
            iconRarity,
        }
        labyTeamDict[teamId].girls = labyTeamData.girls_ids;

        const labyTeam = {labyTeamDict}
        localStorage.setItem('HHS.LabyTeamDictionary', JSON.stringify(labyTeam));
    }
}

function moduleFilterGirlsItems() {
    const getParamFilterGirlsItems = () => localStorage.getItem('HHS.paramFilterGirlsItems') ? JSON.parse(localStorage.getItem('HHS.paramFilterGirlsItems')) : {rarity: FILTER_DEFAULT, resonance_class: FILTER_DEFAULT, resonance_theme: FILTER_DEFAULT, resonance_figure: FILTER_DEFAULT};
    const setParamFilterGirlsItems = (paramFilterGirlsItems) => localStorage.setItem('HHS.paramFilterGirlsItems', JSON.stringify(paramFilterGirlsItems));

    const FILTER_DEFAULT = 'all';
    const FILTER_DEFAULT_ICON = 'caracs/no_class.png';
    const FILTER_OPTIONS = new (class {
        get rarity () {return [
            {value: 'common', bgColor: '#8d8e9f'},
            {value: 'rare', bgColor: '#23b56b'},
            {value: 'epic', bgColor: '#ffb244'},
            {value: 'legendary', bgImage: `url(${window.IMAGES_URL}/legendary.png)`},
            {value: 'mythic', bgColor: 'transparent radial-gradient(closest-side at 50% 50%,#f5a866 0,#ec0039 51%,#9e0e27 100%) 0 0 no-repeat padding-box'}
        ]}
        get resonance_class () {return [
            {value: '1', icon: 'pictures/misc/items_icons/1.png'},
            {value: '2', icon: 'pictures/misc/items_icons/2.png'},
            {value: '3', icon: 'pictures/misc/items_icons/3.png'}
        ]}
        get resonance_theme () {return [
            {value: 'darkness', icon: 'pictures/girls_elements/Dominatrix.png'},
            {value: 'light', icon: 'pictures/girls_elements/Submissive.png'},
            {value: 'psychic', icon: 'pictures/girls_elements/Voyeurs.png'},
            {value: 'fire', icon: 'pictures/girls_elements/Eccentric.png'},
            {value: 'nature', icon: 'pictures/girls_elements/Exhibitionist.png'},
            {value: 'stone', icon: 'pictures/girls_elements/Physical.png'},
            {value: 'sun', icon: 'pictures/girls_elements/Playful.png'},
            {value: 'water', icon: 'pictures/girls_elements/Sensual.png'}
        ]}
        get resonance_figure () {return [
            {value: '1', icon: '/pictures/design/battle_positions/1.png'},
            {value: '2', icon: '/pictures/design/battle_positions/2.png'},
            {value: '3', icon: '/pictures/design/battle_positions/3.png'},
            {value: '4', icon: '/pictures/design/battle_positions/4.png'},
            {value: '5', icon: '/pictures/design/battle_positions/5.png'},
            {value: '6', icon: '/pictures/design/battle_positions/6.png'},
            {value: '7', icon: '/pictures/design/battle_positions/7.png'},
            {value: '8', icon: '/pictures/design/battle_positions/8.png'},
            {value: '9', icon: '/pictures/design/battle_positions/9.png'},
            {value: '10', icon: '/pictures/design/battle_positions/10.png'},
            {value: '11', icon: '/pictures/design/battle_positions/11.png'},
            {value: '12', icon: '/pictures/design/battle_positions/12.png'}
        ]}
    })();
    const FILTER_OPTIONS_GRIDS = {
        rarity: {
            flow: 'row',
            cols: '1fr 1fr 1fr',
            rows: '1fr 1fr'
        },
        resonance_class: {
            flow: 'row',
            cols: '1fr 1fr 1fr',
            rows: '1fr'
        },
        resonance_theme: {
            flow: 'row',
            cols: '1fr 1fr 1fr 1fr',
            rows: '1fr 1fr'
        },
        resonance_figure: {
            flow: 'row',
            cols: '1fr 1fr 1fr 1fr',
            rows: '1fr 1fr 1fr'
        }
    };

    const createGridSelectorItem = ({id, value, icon, bgColor, bgImage}) => (
        `<input type="radio" name=${id} id="${id}-${value}" value="${value}" class="${(currentFilter[id] == '' + value) ? "filter_selected" : ""}" />
        <label for="${id}-${value}">
        ${icon ? `<img src="${window.IMAGES_URL}/${icon}">` : ''}
        ${bgColor || bgImage ? `<div style="${bgColor?`background:${bgColor};`:''}${bgImage?`background-image:${bgImage};background-size:contain;`:''}"></div>` : ''}
        </label>`
    )

    const createGridSelector = ({id, options, gridConfig}) => (
        `<div class="grid-selector" rel="${id}">
        <div class="clear-selector">
        <input type="radio" name="${id}" id="${id}-${FILTER_DEFAULT}" value="${FILTER_DEFAULT}"  class="${(currentFilter[id] == FILTER_DEFAULT) ? "filter_selected" : ""}" />
        <label for="${id}-${FILTER_DEFAULT}">
        <img src="${window.IMAGES_URL}/${FILTER_DEFAULT_ICON}" />
        </label></div>
        <div class="selector-options" style="grid-auto-flow:${gridConfig.flow}; grid-template-rows:${gridConfig.rows}; grid-template-columns:${gridConfig.cols}">
        ${options.map(option => {
            const {value, icon, bgColor, bgImage} = option
            return createGridSelectorItem({id, value, icon, bgColor, bgImage})
        }).join('')}
        </div></div>
        <hr style="margin-top: 3px;margin-bottom: 3px; background: rgba(255, 255, 255, 0.533);">`);

    const createFilterBox = () => {
        return $(`<div style="position:relative">
            <div class="girl_equip_filter_box form-wrapper" style="display: none;">
            ${['rarity', 'resonance_class', 'resonance_theme', 'resonance_figure'].map(key => createGridSelector({id: key, options: FILTER_OPTIONS[key], gridConfig: FILTER_OPTIONS_GRIDS[key]})).join('')}
            <div class="grid-selector">
            <button id="auto_select_button" class="square_blue_btn"">${window.GT.design.mythic_equipment_auto_select}</button>
            <button id="reset_button" class="square_blue_btn"">Reset</button>
            </div></div></div>`)
    };

    const createFilterBtn = () => {
        return $(`<label class="girl_equip_filter"><input type="button" class="square_blue_btn" value="" /></label>`);
    };

    let currentFilter = [];
    currentFilter = getParamFilterGirlsItems();

    function displayResonanceBonus($el, classIdentifier, element, figure) {
        if ($el.find('.slot_resonance_bonus').length == 0) {
            $el.append(`<div class="slot_resonance_bonus"></div>`);
            if(classIdentifier != 0) {
                $el.find('.slot_resonance_bonus').append(`<span class="resonance_bonus class" carac="class${classIdentifier}"></span>`);
                if (classIdentifier == window.girl.class) $el.find('.resonance_bonus.class').addClass('matched');

                if(element != 0 && element != null) {
                    $el.find('.slot_resonance_bonus').append(`<span class="resonance_bonus element">
                        <img src="${window.IMAGES_URL}/pictures/girls_elements/${ELEMENTS_ICON_NAMES[element]}.png">
                        </span>`);
                    if (element == window.girl.element) $el.find('.resonance_bonus.element').addClass('matched');

                    if(figure != 0 && figure != null) {
                        $el.find('.slot_resonance_bonus').append(`<span class="resonance_bonus figure">
                            <img src="${window.IMAGES_URL}/pictures/design/battle_positions/${figure}.png">
                            </span>`);
                        if (figure == window.girl.figure) $el.find('.resonance_bonus.figure').addClass('matched');
                    }
                }
            }
        }
    }

    function applyFilter() {
        const $visibleEquips = $('#equipment .inventory').find('.inventory-slot.filled-slot .slot:not(.empty)');
        const $usedEquips = $('.item-column').find('.slot.filled-slot');

        let visibleCount = 0;

        $visibleEquips.each((i, el) => {
            const $el = $(el);
            const equipData = $el.data('d');
            const {rarity} = equipData;
            const {element, figure} = equipData.variation ? equipData.variation : 0;
            const classIdentifier = equipData.variation ? equipData.variation.class : 0;

            displayResonanceBonus($el, classIdentifier, element, figure);

            const rarityMatches = currentFilter.rarity == FILTER_DEFAULT || currentFilter.rarity == rarity
            const classIdentifierMatches = currentFilter.resonance_class == FILTER_DEFAULT || currentFilter.resonance_class == classIdentifier
            const elementMatches = currentFilter.resonance_theme == FILTER_DEFAULT || currentFilter.resonance_theme == element
            const figureMatches = currentFilter.resonance_figure == FILTER_DEFAULT || currentFilter.resonance_figure == figure

            if ([rarityMatches, classIdentifierMatches, elementMatches, figureMatches].every(a=>a)) {
                $el.removeClass('filtered_out')
                $el[0].parentNode.classList.remove('filtered_out')
                visibleCount++
            } else {
                $el.addClass('filtered_out')
                $el[0].parentNode.classList.add('filtered_out')
            }
        })

        $usedEquips.each((i, el) => {
            const $el = $(el);
            const equipData = $el.data('d');
            const {element, figure} = equipData.variation ? equipData.variation : 0;
            const classIdentifier = equipData.variation ? equipData.variation.class : 0;

            displayResonanceBonus($el, classIdentifier, element, figure);
        })

        if (visibleCount < 15) {
            const $visibleSlots = $('#equipment .inventory').find('.slot:visible()')
            // pad with empty slots
            let toPad = 15 - $visibleSlots.length
            while (toPad > 0) {
                $('#equipment .inventory').find('.slot').last().after(`<div class="slot empty"></div>`)
                toPad--
            }
        }
    }

    const attachFilterBox = () => {
        const $btn = createFilterBtn();
        const $box = createFilterBox();
        const $togglable = $box.find('.girl_equip_filter_box');

        $('#equipment .wrapper').append($btn).append($box);

        $btn.click(() => $togglable.toggle());
        $('#auto_select_button').click(() => autoSelectFilter());
        $('#reset_button').click(() => resetFilter());
        $box.find('input').each((i, input) => {
            $(input).click((e) => {
                const {value, name} = e.target;
                $(`div[rel=${name}] .filter_selected`).removeClass('filter_selected');
                $(`#${name}-${value}`).addClass('filter_selected');
                let newName = name.split('-')[0];
                currentFilter[newName] = value;
                setParamFilterGirlsItems(currentFilter);
                applyFilter();
            })
        })
    }

    function autoSelectFilter() {
        let girlClass = window.girl.class;
        let girlElement = window.girl.element;
        let girlPosition = window.girl.figure;

        let formerClass = currentFilter.resonance_class;
        let formerElement = currentFilter.resonance_theme;
        let formerPosition = currentFilter.resonance_figure;

        currentFilter.resonance_class = girlClass;
        currentFilter.resonance_theme = girlElement;
        currentFilter.resonance_figure = girlPosition;

        $(`#resonance_class-${formerClass}`).removeClass('filter_selected');
        $(`#resonance_class-${girlClass}`).addClass('filter_selected');
        $(`#resonance_theme-${formerElement}`).removeClass('filter_selected');
        $(`#resonance_theme-${girlElement}`).addClass('filter_selected');
        $(`#resonance_figure-${formerPosition}`).removeClass('filter_selected');
        $(`#resonance_figure-${girlPosition}`).addClass('filter_selected');

        setParamFilterGirlsItems(currentFilter);
        applyFilter();
    }

    function resetFilter() {
        let formerRarity = currentFilter.rarity;
        let formerClass = currentFilter.resonance_class;
        let formerElement = currentFilter.resonance_theme;
        let formerPosition = currentFilter.resonance_figure;

        currentFilter.rarity = FILTER_DEFAULT;
        currentFilter.resonance_class = FILTER_DEFAULT;
        currentFilter.resonance_theme = FILTER_DEFAULT;
        currentFilter.resonance_figure = FILTER_DEFAULT;

        $(`#rarity-${formerRarity}`).removeClass('filter_selected');
        $(`#rarity-${FILTER_DEFAULT}`).addClass('filter_selected');
        $(`#resonance_class-${formerClass}`).removeClass('filter_selected');
        $(`#resonance_class-${FILTER_DEFAULT}`).addClass('filter_selected');
        $(`#resonance_theme-${formerElement}`).removeClass('filter_selected');
        $(`#resonance_theme-${FILTER_DEFAULT}`).addClass('filter_selected');
        $(`#resonance_figure-${formerPosition}`).removeClass('filter_selected');
        $(`#resonance_figure-${FILTER_DEFAULT}`).addClass('filter_selected');

        setParamFilterGirlsItems(currentFilter);
        applyFilter();
    }

    attachFilterBox();
    applyFilter();

    new MutationObserver(() => {
        if ($('#equipment_tab.underline-tab').length) {
            new MutationObserver(() => {applyFilter();}).observe($('#equipment .selectric .label')[0], {childList: true});
            new MutationObserver(() => {applyFilter();}).observe($('#equipment .inventory')[0], {childList: true});
        }
    }).observe($('#girl-leveler-tabs')[0], {subtree: true, attributes: true, attributeFilter: ['class']});

    new MutationObserver(() => {applyFilter();}).observe($('#equipment .inventory')[0], {childList: true});

    if($('#equipment_tab.underline-tab').length)
        new MutationObserver(() => {applyFilter();}).observe($('#equipment .selectric .label')[0], {childList: true});


    //CSS
    sheet.insertRule(`label.girl_equip_filter {
        width: 32px;
        position: absolute;
        background: transparent;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #equipment .wrapper label.girl_equip_filter {
        left: 890px;
        top: 92px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #equipment .wrapper label.girl_equip_filter {
        left: 890px;
        top: 72px;}}`
    );

    sheet.insertRule(`#equipment .total-from-items .wrapper .form-control {
        margin-right: 90px;}`
    );

    sheet.insertRule(`.girl_equip_filter input {
        height: 32px;
        width: 32px;
        display: block;
        padding: 0px;}`
    );

    sheet.insertRule(`label.girl_equip_filter::before {
        content: " ";
        display: block;
        position: absolute;
        height: 100%;
        width: 100%;
        background-position: center;
        background-size: 24px;
        background-repeat: no-repeat;
        background-image: url("${window.IMAGES_URL}/design_v2/search_open.png");
        pointer-events: none;}`
    );

    sheet.insertRule(`.girl_equip_filter_box {
        position: absolute;
        width: auto;
        height: fit-content;
        z-index: 4;
        border-radius: 8px 10px 10px 8px;
        background-color: rgb(30, 38, 30);
        box-shadow: rgba(255, 255, 255, 0.73) 0px 0px;
        padding: 5px;
        border: 1px solid rgb(255, 162, 62);}`
    );

    sheet.insertRule(`#equipment .wrapper .girl_equip_filter_box {
        left: -818px;
        top: -75px;}`
    );

    sheet.insertRule(`.girl_equip_filter_box label {
        background: transparent;
        width: auto;
        margin: 0px;}`
    );

    sheet.insertRule(`.grid-selector {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;}`
    );

    sheet.insertRule(`.grid-selector:last-child {
        margin-bottom: 0px;}`
    );

    sheet.insertRule(`.grid-selector input {
        display: none;}`
    );

    sheet.insertRule(`.grid-selector .selector-options {
        width: -moz-fit-content;
        width: fit-content;
        display: grid;
        grid-gap: 2px;}`
    );

    sheet.insertRule(`.grid-selector .selector-options img {
        height: 26px;
        width: 26px;
        margin: 2px;}`
    );

    sheet.insertRule(`.grid-selector .selector-options div {
        height: 26px;
        width: 26px;
        margin: 2px;
        border-radius: 5px;}`
    );

    sheet.insertRule(`.grid-selector .clear-selector {
        width: fit-content;
        margin-bottom: 2px;}`
    );

    sheet.insertRule(`.grid-selector .clear-selector img {
        height: 28px;
        width: 28px;}`
    );

    sheet.insertRule(`.girl_equip_filter_box .grid-selector input.filter_selected + label, .girl_equip_filter_box .grid-selector input:hover + label {
        background-color: #fff8;}`
    );

    sheet.insertRule(`.filtered_out {
        display: none !important;}`
    );

    sheet.insertRule(`.slot_resonance_bonus span[carac]::before {
        position: absolute;
        top: -10px;
        left: 0px;
        width: 16px;
        height: 16px;}`
    );

    sheet.insertRule(`.slot_resonance_bonus .resonance_bonus.element img, .slot_resonance_bonus .resonance_bonus.figure img {
        display: inline-block;
        position: absolute;
        top: -10px;
        background-size: 20px;
        background-repeat: no-repeat;}`
    );

    sheet.insertRule(`.slot_resonance_bonus .resonance_bonus.element img {
        width: 16px;
        height: 16px;
        left: 24px;}`
    );

    sheet.insertRule(`.slot_resonance_bonus .resonance_bonus.figure img {
        width: 20px;
        height: 20px;
        left: 48px;}`
    );

    sheet.insertRule(`.item-column .slot_resonance_bonus span[carac]::before, .item-column .slot_resonance_bonus .resonance_bonus.element img, .item-column .slot_resonance_bonus .resonance_bonus.figure img {
        top: 2px;}`
    );

    sheet.insertRule(`.item-column .slot_resonance_bonus .resonance_bonus.element img {
        left: 22px;}`
    );

    sheet.insertRule(`.item-column .slot_resonance_bonus .resonance_bonus.figure img {
        left: 42px;}`
    );

    sheet.insertRule(`.matched img, .matched::before {
        filter: drop-shadow(0px 0px 3px #00ff00) drop-shadow(0px 0px 3px #00ff00) drop-shadow(0px 0px 3px #00ff00);}`
    );

    sheet.insertRule(`#auto_select_button {
        color: #fff;
        width: 120px;}`
    );

    sheet.insertRule(`.girl_equip_filter_box #reset_button {
        margin-top: 5px;
        color: #fff;
        width: 120px;}`
    );
}


/* ====================
	LEAGUE INFORMATION
   ==================== */

function moduleLeague() {
    if (['/leagues.html'].some(testPage)) {
        if ($('#leagues .league_content .league_table').length == 0) return;

        if ($('#leagues .league_content .league_table .data-list').length == 0) {
            new MutationObserver(() => {
                if ($('#leagues .league_content .league_table .data-list').length > 0) {
                    leagueFunctions();
                }
            }).observe($('#leagues .league_content .league_table')[0], {childList: true, once: true})
        }
        else leagueFunctions();

        function leagueFunctions() {
            $('#league #leagues .page-title').after(`<div class="leagues_middle_header_script"></div>`);
            try{document.getElementById('change_team').className = "square_blue_btn";} catch{}

            let leagueData = window.opponents_list;
            let Hero_league_data = leagueData.find((player) => player.player.id_fighter == heroData.infos.id);
            let playersTotal = leagueData.length;
            let challengesLeft;
            let challengesPossibleMinutes = parseInt(Math.floor(window.season_end_at/60), 10);
            let challengesPossible = (heroData.energies.challenge.amount != heroData.energies.challenge.max_regen_amount)? Math.floor((challengesPossibleMinutes + (35 - heroData.energies.challenge.next_refresh_ts / 60))/35) + parseInt(heroData.energies.challenge.amount, 10) : Math.floor(challengesPossibleMinutes/35) + parseInt(heroData.energies.challenge.amount, 10);
            let challengesDone = 0;
            let challengesWon = 0;
            let challengesLost = 0;
            let HeroPosition = Hero_league_data.place;
            let HeroPoints = Hero_league_data.player_league_points;
            let maxDemotePoints;
            let maxDemoteDiff;
            let maxDemoteDisplay;
            let textDemote;
            let maxStagnatePoints;
            let maxStagnateDiff;
            let maxStagnateDisplay;
            let textStagnate;
            let minTop4Points;
            let minTop4Diff;
            let minTop4Display;
            let textTop4;
            let minTop15Points;
            let textTop15;
            let minTop15Display;
            let minTop30Points;
            let minTop30Diff;
            let minTop30Display;
            let textTop30;
            let avgScore;
            let scoreExpected;
            let top4Points = leagueData.find((el) => el.place == 4).player_league_points;
            let top5Points = leagueData.find((el) => el.place == 5).player_league_points;
            let top15Points = leagueData.find((el) => el.place == 15).player_league_points;
            let top16Points = leagueData.find((el) => el.place == 16).player_league_points;
            let top30Points = leagueData.find((el) => el.place == 30).player_league_points;
            let top31Points = leagueData.find((el) => el.place == 31).player_league_points;
            let topDemotePoints = leagueData.find((el) => el.place == (playersTotal-14)).player_league_points;
            let topNonDemotePoints = leagueData.find((el) => el.place == (playersTotal-15)).player_league_points;

            let	includeBoard = false;

            if (loadSetting('leagueBoard')) includeBoard = true;

            leagueData.forEach((player) => {
                if (player.player.id_fighter != heroData.infos.id) {
                    let fightsDone = 0;
                    let fightsWon = 0;
                    let fightsLost = 0;

                    let playerId = player.player.id_fighter;
                    let fightsData = player.match_history[playerId];
                    fightsData.forEach((fight) => {
                        if (fight == null) {}
                        else if (fight.attacker_won == "won") {
                            fightsDone++;
                            fightsWon++;
                        }
                        else if (fight.attacker_won == "lost") {
                            fightsDone++;
                            fightsLost++;
                        }
                    })
                    challengesDone += fightsDone;
                    challengesWon += fightsWon;
                    challengesLost += fightsLost;
                }
            })

            challengesLeft = 3*(playersTotal-1)-challengesDone;
            avgScore = (challengesDone != 0) ? HeroPoints/challengesDone : 0;
            scoreExpected = Math.floor(avgScore*3*(playersTotal-1));

            let leagueScore = {
                points: HeroPoints,
                avg: Math.round(avgScore*100)/100
            }
            let oldScore = JSON.parse(localStorage.getItem('HHS.leagueScore')) || {points: 0, avg: 0};
            let oldPoints = oldScore.points;
            if (HeroPoints > oldPoints) localStorage.setItem('HHS.leagueScore', JSON.stringify(leagueScore));

            if (HeroPosition > (playersTotal - 15)) {
                maxDemotePoints = topNonDemotePoints;
                maxDemoteDiff = maxDemotePoints - HeroPoints;
                if (HeroPoints == 0 && maxDemotePoints == 0) {
                    maxDemoteDisplay = '±' + nThousand(maxDemoteDiff);
                    textDemote = labels.demote_holdzero;
                }
                else {
                    maxDemoteDisplay = `+${nThousand(maxDemoteDiff)}`;
                    textDemote = labels.demote_up;
                }
            }
            else {
                maxDemotePoints = topDemotePoints
                maxDemoteDiff = maxDemotePoints - HeroPoints;
                if (HeroPoints == 0 && maxDemotePoints == 0) {
                    maxDemoteDisplay = `±${nThousand(maxDemoteDiff)}`;
                    textDemote = labels.demote_holdzero;
                }
                else {
                    if (maxDemoteDiff == 0) maxDemoteDisplay = '-' + nThousand(maxDemoteDiff);
                    else maxDemoteDisplay = nThousand(maxDemoteDiff);
                    textDemote = labels.demote_down;
                }
            }

            if (HeroPosition > 15) {
                maxStagnatePoints = top15Points;
                maxStagnateDiff = maxStagnatePoints - HeroPoints;
                minTop15Points = maxStagnatePoints + 1;
                if (HeroPoints == 0 && maxStagnatePoints == 0) {
                    maxStagnateDisplay = `±${nThousand(maxStagnateDiff)}`;
                    minTop15Display = `±${nThousand(maxStagnateDiff+1)}`;
                    textStagnate = labels.stagnate_holdzero;
                    textTop15 = labels.top15_up;
                }
                else {
                    maxStagnateDisplay = `+${nThousand(maxStagnateDiff)}`;
                    minTop15Display = `+${nThousand(maxStagnateDiff+1)}`;
                    textStagnate = labels.stagnate_up;
                    textTop15 = labels.top15_up;
                }
            }
            else {
                maxStagnatePoints = top16Points;
                maxStagnateDiff = maxStagnatePoints - HeroPoints;
                minTop15Points = top16Points;
                if (HeroPoints == 0 && maxStagnatePoints == 0) {
                    maxStagnateDisplay = `±${nThousand(maxStagnateDiff)}`;
                    minTop15Display = `±${nThousand(maxStagnateDiff)}`;
                    textStagnate = labels.stagnate_holdzero;
                    textTop15 = labels.top15_hold;
                }
                else {
                    if (maxStagnateDiff == 0) {
                        maxStagnateDisplay = `-${(nThousand(maxStagnateDiff))}`;
                        minTop15Display = `-${(nThousand(maxStagnateDiff))}`;
                    }
                    else {
                        maxStagnateDisplay = nThousand(maxStagnateDiff);
                        minTop15Display = nThousand(maxStagnateDiff);
                    }
                    textStagnate = labels.stagnate_down;
                    textTop15 = labels.top15_hold;
                }
            }

            if (HeroPosition > 30) {
                minTop30Points = top30Points + 1;
                minTop30Diff = minTop30Points - HeroPoints;
                if (minTop30Diff > 0) {
                    minTop30Display = `+${(nThousand(minTop30Diff))}`;
                    textTop30 = labels.top30_up;
                }
                else {
                    minTop30Display = nThousand(minTop30Diff);
                    textTop30 = labels.top30_hold;
                }
            }
            else {
                minTop30Points = top31Points;
                minTop30Diff = minTop30Points - HeroPoints;
                if (minTop30Diff < 0) {
                    minTop30Display = nThousand(minTop30Diff);
                    textTop30 = labels.top30_hold;
                }
                else {
                    minTop30Display = `+${(nThousand(minTop30Diff))}`;
                    textTop30 = labels.top30_hold;
                }
            }

            if (HeroPosition > 4) {
                minTop4Points = top4Points + 1;
                minTop4Diff = minTop4Points - HeroPoints;
                if (minTop4Diff > 0) {
                    minTop4Display = `+${(nThousand(minTop4Diff))}`;
                    textTop4 = labels.top4_up;
                }
                else {
                    minTop4Display = nThousand(minTop4Diff);
                    textTop4 = labels.top4_hold;
                }
            }
            else {
                minTop4Points = top5Points;
                minTop4Diff = minTop4Points - HeroPoints;
                if (minTop4Diff > 0) {
                    minTop4Display = `+${(nThousand(minTop4Diff))}`;
                    textTop4 = labels.top4_hold;
                }
                else {
                    minTop4Display = nThousand(minTop4Diff);
                    textTop4 = labels.top4_hold;
                }
            }

            if (window.current_tier_number == 9) {
                $('.leagues_middle_header_script').append(
                    `<div class="scriptLeagueInfo">
                    <span class="averageScore" tooltip="" hh_title="${labels.averageScore}${nThousand(Math.round(avgScore*100)/100)}<BR>${labels.scoreExpected}${nThousand(scoreExpected)}"><img src="https://cdn-icons-png.flaticon.com/32/1753/1753830.png" style="height: 15px; width: 16px; margin-left: 2px; margin-bottom: 5px;">${nThousand(Math.round(avgScore*100)/100)}</span>
                    <span class="possibleChallenges" tooltip="" hh_title="${labels.challenges_regen}${challengesPossible}${labels.challenges_left}${challengesLeft}"><img src="https://cdn-icons-png.flaticon.com/32/551/551227.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${challengesPossible}/${challengesLeft}
                    <span class="scriptLeagueInfoTooltip possibleChallengesTooltip"></span></span>
                    <span class="minTop4" tooltip="" hh_title="${textTop4}${nThousand(minTop4Points)} ${labels.points}"><img src="https://cdn-icons-png.flaticon.com/32/752/752667.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${minTop4Display}</span>
                    <span class="minTop15" tooltip="" hh_title="${textTop15}${nThousand(minTop15Points)} ${labels.points}"><img src="https://cdn-icons-png.flaticon.com/32/5259/5259722.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${minTop15Display}</span>
                    <span class="minTop30" tooltip="" hh_title="${textTop30}${nThousand(minTop30Points)} ${labels.points}"><img src="https://cdn-icons-png.flaticon.com/32/7123/7123659.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${minTop30Display}</span>
                    <span class="maxDemote" tooltip="" hh_title="${textDemote}${nThousand(maxDemotePoints)} ${labels.points}"><img src="https://cdn-icons-png.flaticon.com/32/892/892505.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${maxDemoteDisplay}</span>
                    </div>`
                );

                if (includeBoard == false) {
                    $('.minTop4').empty();
                    $('.minTop15').empty();
                    $('.minTop30').empty();
                }
            }
            else if (window.current_tier_number == 1) {
                $('.leagues_middle_header_script').append(
                    `<div class="scriptLeagueInfo">
                    <span class="averageScore" tooltip="" hh_title="${labels.averageScore}${nThousand(Math.round(avgScore*100)/100)}<BR>${labels.scoreExpected}${nThousand(scoreExpected)}"><img src="https://cdn-icons-png.flaticon.com/32/1753/1753830.png" style="height: 15px; width: 16px; margin-left: 2px; margin-bottom: 5px;">${nThousand(Math.round(avgScore*100)/100)}</span>
                    <span class="possibleChallenges" tooltip="" hh_title="${labels.challenges_regen}${challengesPossible}${labels.challenges_left}${challengesLeft}"><img src="https://cdn-icons-png.flaticon.com/32/551/551227.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${challengesPossible}/${challengesLeft}
                    <span class="scriptLeagueInfoTooltip possibleChallengesTooltip"></span></span>
                    <span class="minTop15" tooltip="" hh_title="${textStagnate}${nThousand(maxStagnatePoints)} ${labels.points}"><img src="https://i.postimg.cc/HnkyDtG3/icon-league-hold.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${maxStagnateDisplay}</span>
                    <span class="minTop30" tooltip="" hh_title="${textTop30}${nThousand(minTop30Points)} ${labels.points}"><img src="https://cdn-icons-png.flaticon.com/32/7123/7123659.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${minTop30Display}</span>
                    </div>`
                );

                if (includeBoard == false) $('.minTop30').empty();
            }
            else {
                $('.leagues_middle_header_script').append(
                    `<div class="scriptLeagueInfo">
                    <span class="averageScore" tooltip="" hh_title="${labels.averageScore}${nThousand(Math.round(avgScore*100)/100)}<BR>${labels.scoreExpected}${nThousand(scoreExpected)}"><img src="https://cdn-icons-png.flaticon.com/32/1753/1753830.png" style="height: 15px; width: 16px; margin-left: 2px; margin-bottom: 5px;">${nThousand(Math.round(avgScore*100)/100)}</span>
                    <span class="possibleChallenges" tooltip="" hh_title="${labels.challenges_regen}${challengesPossible}${labels.challenges_left}${challengesLeft}"><img src="https://cdn-icons-png.flaticon.com/32/551/551227.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${challengesPossible}/${challengesLeft}
                    <span class="scriptLeagueInfoTooltip possibleChallengesTooltip"></span></span>
                    <span class="minTop4" tooltip="" hh_title="${textTop4}${nThousand(minTop4Points)} ${labels.points}"><img src="https://cdn-icons-png.flaticon.com/32/752/752667.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${minTop4Display}</span>
                    <span class="minTop15" tooltip="" hh_title="${textStagnate}${nThousand(maxStagnatePoints)} ${labels.points}"><img src="https://i.postimg.cc/HnkyDtG3/icon-league-hold.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${maxStagnateDisplay}</span>
                    <span class="minTop30" tooltip="" hh_title="${textTop30}${nThousand(minTop30Points)} ${labels.points}"><img src="https://cdn-icons-png.flaticon.com/32/7123/7123659.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${minTop30Display}</span>
                    <span class="maxDemote" tooltip="" hh_title="${textDemote}${nThousand(maxDemotePoints)} ${labels.points}"><img src="https://cdn-icons-png.flaticon.com/32/892/892505.png" style="height: 15px; width: 16px; margin-left: 6px; margin-bottom: 4px;">${maxDemoteDisplay}</span>
                    </div>`
                );

                if (includeBoard == false) {
                    $('.minTop4').empty();
                    $('.minTop30').empty();
                }
            }

            try{document.getElementsByClassName('multiple-battles')[0].className = "square_blue_btn multiple-battles";} catch{};

            //CSS
            sheet.insertRule(`.leagues_middle_header_script {
                display: flow-root;
                margin-top: 0px;}`
            );

            sheet.insertRule(`.scriptLeagueInfo {
                position: absolute;
                width: max-content;
                left: 1rem;
                top: 0.5rem;
                font-size: 13px;
                color: #fff;
                display: flex;
                flex-direction: row;
                float: right;}`
            );

            sheet.insertRule(`.scriptLeagueInfoTooltip {
                visibility: hidden;
                font-size: 12px;
                background-color: black;
                color: #fff;
                text-align: center;
                padding: 3px 5px 3px 5px;
                border: 2px solid #905312;
                border-radius: 6px;
                background-color: rgba(32,3,7);
                position: absolute;
                margin-top: 5px;
                z-index: 9;}`
            );

            sheet.insertRule(`.scriptLeagueInfoTooltip::after {
                content: " ";
                position: absolute;
                bottom: 100%;
                left: 50%;
                margin-left: -10px;
                border-width: 10px;
                border-style: solid;
                border-color: transparent transparent #905312 transparent;}`
            );

            sheet.insertRule(`.possibleChallengesTooltip {
                top: 20px;
                margin-left: -146px;}`
            );

            sheet.insertRule(`.possibleChallenges:hover .possibleChallengesTooltip {
                visibility: visible;}`
            );

            //Compact display
            if (loadSetting('leagueBoardCompactDisplay')) {
                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row.body-row {
                    min-height: 2.44rem;
                    max-height: 2.44rem;}`
                );

                sheet.insertRule(`#leagues .circular-progress {
                    margin-right: 5px;
                    height: 20px;
                    width: 21px;}`
                );

                sheet.insertRule(`.tier5_skill {
                    top: 10px;
                    font-size: 11px;}`
                );

                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="boosters"] .player_stats {
                    position: relative;
                    top: -4px;}`
                );

                sheet.insertRule(`#leagues .league_content.hidden_girl .league_table .data-list .data-row .data-column[column="team"] {
                    position: relative;
                    top: -2px;}`
                );

                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="boosters"] .player_stats .player_stats_row .carac_value {
                    font-size: 11px;}`
                );

                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="boosters"] .boosters .slot {
                    width: 1.2rem;
                    height: 1.2rem;}`
                );

                sheet.insertRule(`.teamPower,
                        .team-power {
                    font-size: 11px;}`
                );

                sheet.insertRule(`#leagues .circular-progress .circle-bar {
                    height: 118%;
                    width: 111%;}`
                );

                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="boosters"] .boosters,
                        #leagues .league_content .league_table .data-list .data-row .head-column[column="boosters"] .boosters {
                    position: relative;
                    top: -7px;
                    min-height: 2.4rem;}`
                );

                sheet.insertRule(`#leagues .league_content .league_table .data-list.lock_hero {
                    padding-top: 65px;}`
                );

                sheet.insertRule(`#leagues .circular-progress .circle {
                    top: -19px;}`
                );

                sheet.insertRule(`.domination-toggle {
                    top: -4px;}`
                );
            }

            //League display
            sheet.insertRule(`${mediaMobile} {
                    #league {
                background: #222;}}`
            );

            sheet.insertRule(`#leagues .league_content {
                padding-top: 3.13rem;}`
            );

            sheet.insertRule(`#leagues .league_girl {
                top: 50px;
                height: 90%}`
            );

            sheet.insertRule(`#leagues .league_girl .girl-preview > img {
                height: 100%;}`
            );

            sheet.insertRule(`${mediaDesktop} {
                    #leagues .league_content .league_tiers {
                position: absolute;
                top: 2px;
                right: 48px;}}`
            );

            sheet.insertRule(`${mediaMobile} {
                    #leagues .league_content .league_tiers {
                position: absolute;
                top: 2px;
                right: 60px;}}`
            );

            sheet.insertRule(`#leagues .league_content .league_tiers .league_tier_progress .tier_icons {
                height: 3rem;
                margin-top: -3rem;}`
            );

            sheet.insertRule(`#leagues .league_content .league_tiers .league_tier_progress .tier_icons img {
                flex: 0;
                width: 3rem;}`
            );

            sheet.insertRule(`#leagues .league_content .league_tiers .league_tier_progress .bar-wrap {
                top: -14px;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row.head-row {
                position: fixed;
                height: 1.5rem;
                border-top-left-radius: 0px;
                min-height: 1.5rem;}`
            );

            sheet.insertRule(`#leagues .league_content.hidden_girl .league_table .data-list .data-row.head-row {
                width: 95%;
                right: 26px;}`
            );

            sheet.insertRule(`${mediaDesktop} {
                    #leagues .league_content .league_table .data-list .data-row.head-row {
                top: 116px;}}`
            );

            sheet.insertRule(`${mediaMobile} {
                    #leagues .league_content .league_table .data-list .data-row.head-row {
                top: 144px;}}`
            );

            sheet.insertRule(`#leagues .league_content .league_table {
                height: 26rem;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row.player-row {
                top: 0px;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .head-column[column="boosters"],
                    #leagues .league_content .league_table .data-list .data-row .head-column[column="team"],
                    #leagues .league_content.hidden_girl .league_table .data-list .data-row .head-column[column="boosters"],
                    #leagues .league_content.hidden_girl .league_table .data-list .data-row .head-column[column="team"] {
                height: 1.4rem;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="boosters"] .boosters,
                    #leagues .league_content .league_table .data-list .data-row .head-column[column="boosters"] .boosters {
                position: relative;
                top: -5px;
                width: 6.5rem;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row.body-row {
                min-height: 2.5rem;
                max-height: 2.8rem;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="place"],
                    #leagues .league_content .league_table .data-list .data-row .head-column[column="place"],
                    #leagues .league_content.hidden_girl .league_table .data-list .data-row .head-column[column="place"],
                    #leagues .league_content.hidden_girl .league_table .data-list .data-row .data-column[column="place"] {
                min-width: 3.5rem;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="nickname"],
                    #leagues .league_content .league_table .data-list .data-row .head-column[column="nickname"] {
                min-width: 5.9rem;}`
            );

            sheet.insertRule(`#leagues .league_content.hidden_girl .league_table .data-list .data-row .data-column[column="nickname"],
                    #leagues .league_content .league_table .data-list .data-row .head-column[column="nickname"] {
                min-width: 5.3rem;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="level"],
                    #leagues .league_content.hidden_girl .league_table .data-list .data-row .head-column[column="level"] {
                min-width: 2.5rem;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="power"],
                    #leagues .league_content .league_table .data-list .data-row .head-column[column="power"] {
                min-width: 3.8rem;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="match_history_sorting"],
                    #leagues .league_content .league_table .data-list .data-row .head-column[column="match_history_sorting"] {
                min-width: 4.5rem;}`
            );

            //A supprimer ?
            sheet.insertRule(`.hh_class_tooltip.hh_class_tooltip_click_disabled {
                height: 131px !important;}`
            );

            sheet.insertRule(`#leagues .league_content .league_buttons {
                margin-bottom: -4px;
                height: 1.7rem;}`
            );

            sheet.insertRule(`#leagues .league_content .league_buttons .league_buttons_block {
                margin-left: -38px;}`
            );

            sheet.insertRule(`#leagues .league_content .league_buttons .challenge_points {
                left: -7px;}`
            );

            sheet.insertRule(`#leagues .league_content .league_buttons .league_end_in {
                position: relative;
                min-width: 110px;
                left: -2px;}`
            );

            sheet.insertRule(`#leagues .league_content .league_buttons .league_end_in .season-timer.timer {
                width: max-content;}`
            );

            sheet.insertRule(`#leagues .league_content .league_buttons .change_team_container {
                position: relative;
                left: -7px;}`
            );

            sheet.insertRule(`#leagues .league_content .league_buttons #change_team {
                color: #fff;
                text-decoration: none;
                width: 150px;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list {
                padding-top: 23px;
                overflow: hidden;}`
            );

            sheet.insertRule(`#leagues .league_content .league_buttons button.multiple-battles {
                color: #fff;
                width: max-content;
                height: 50px;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .head-column[column="team"],
                    #leagues .league_content .league_table .data-list .data-row .data-column[column="team"],
                    #leagues .league_content.hidden_girl .league_table .data-list .data-row .head-column[column="team"],
                    #leagues .league_content.hidden_girl .league_table .data-list .data-row .data-column[column="team"] {
                opacity: 1;
                min-width: 3.2rem;}`
            );

            sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="team"],
                    #leagues .league_content.hidden_girl .league_table .data-list .data-row .data-column[column="team"] {
                pointer-events: auto;}`
            );

            if($('#leagues .league_content .league_tiers #toggle_columns.hidden_girl').length > 0 && $('#leagues .league_content .league_tiers .league_tier_progress .tier_icons').children().length == 9) {
                sheet.insertRule(`#league #leagues .page-title {
                    left: 45%;}`
                );
            }

            //League tracker script
            sheet.insertRule(`.team-theme.icon {
                margin-left: 0 !important;
                margin-right: 0 !important;}`
            );

            sheet.insertRule(`.button_team_synergy {
                opacity: 1;
                min-width: 3.2rem;
                top: -5px;}`
            );

            function leagueFilter() {
                const LEAGUE_FILTER_DEFAULT = {no_skill: 'checked', with_skill: 'checked', stun: 'checked', shield: 'checked', reflect: 'checked', execute: 'checked', fought: '', with_boosters: 'checked', no_boosters: 'checked', favorites_orange: 'checked', favorites_blue: 'checked', favorites_red: 'checked', favorites_purple: 'checked', favorites_green: 'checked', favorites_none: 'checked'};
                let LEAGUE_FILTER = localStorage.getItem('HHS.leagueFilter') || JSON.stringify(LEAGUE_FILTER_DEFAULT);
                LEAGUE_FILTER = JSON.parse(LEAGUE_FILTER);
                if (LEAGUE_FILTER.with_skill == undefined) {
                    if (LEAGUE_FILTER.stun == '' && LEAGUE_FILTER.shield == '' && LEAGUE_FILTER.reflect == '' && LEAGUE_FILTER.execute == '') LEAGUE_FILTER.with_skill = '';
                    else LEAGUE_FILTER.with_skill = 'checked';
                }
                if (LEAGUE_FILTER.fought == undefined) {
                    LEAGUE_FILTER.fought = '';
                }
                if (LEAGUE_FILTER.with_boosters == undefined) {
                    LEAGUE_FILTER.with_boosters = 'checked';
                    LEAGUE_FILTER.no_boosters = 'checked';
                }
                ['orange', 'blue', 'red', 'purple', 'green', 'none'].forEach((el) => {
                    if(LEAGUE_FILTER[`favorites_${el}`] == undefined) {
                        LEAGUE_FILTER[`favorites_${el}`] = 'checked';
                    }
                })
                localStorage.setItem('HHS.leagueFilter', JSON.stringify(LEAGUE_FILTER));

                $(".leagues_middle_header_script").append(`<button id="league_filter" class="square_blue_btn">${labels.filter}</button>`);
                $(".leagues_middle_header_script").append(createFilterBox());
                createFilterEvents();
                filterOpponents();

                function createFilterBox() {
                    return `<fieldset id="league_filter_box">
                                    <div class="filter_type" style="break-inside: avoid;"><legend>${labels.tier5_skill_filter}</legend>
                                        <div>
                                            <input type="checkbox" id="filter_no_skill" name="tier5_skill" value="no_skill" ${LEAGUE_FILTER.no_skill}/>
                                            <label for="no_skill">${labels.none_f}</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="filter_with_skill" name="tier5_skill" value="with_skill" ${LEAGUE_FILTER.with_skill}/>
                                            <label for="with_skill">${labels.with}</label>
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="filter_stun" name="tier5_skill" value="stun" ${LEAGUE_FILTER.stun}/>
                                            <label for="stun">Stun</label>
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="filter_shield" name="tier5_skill" value="shield" ${LEAGUE_FILTER.shield}/>
                                            <label for="shield">Shield</label>
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="filter_reflect" name="tier5_skill" value="reflect" ${LEAGUE_FILTER.reflect}/>
                                            <label for="reflect">Reflect</label>
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="filter_execute" name="tier5_skill" value="execute" ${LEAGUE_FILTER.execute}/>
                                            <label for="execute">Execute</label>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="filter_type"  style="break-inside: avoid;"><legend>${labels.opponents}</legend>
                                            <div>
                                                <input type="checkbox" id="filter_fought" name="opponents" value="fought" ${LEAGUE_FILTER.fought}/>
                                                <label for="none">${labels.already_fought}</label>
                                            </div>
                                            <div id="filter_favorites">
                                                <input type="button" name="opponents" id="filter_favorites-all" value="all">
                                                <label for="filter_favorites-all"><img src="https://hh2.hh-content.com/caracs/no_class.png"></label>
                                                <input type="button" name="opponents" id="filter_favorites-true" value="true">
                                                <label for="filter_favorites-true"><img src="https://hh2.hh-content.com/design/ic_star_orange.svg"></label>
                                                <input type="button" name="opponents" id="filter_favorites-false" value="false">
                                                <label for="filter_favorites-false"><img src="https://hh2.hh-content.com/design/ic_star_white.svg"></label>
                                            </div>
                                            <div id="filter_favorites_color">
                                                <input type="checkbox" name="favorite_color" id="filter_color_orange" value="orange" class=${LEAGUE_FILTER.favorites_orange == 'checked' ? 'filter_selected' : ""} ${LEAGUE_FILTER.favorites_orange}>
                                                <label for="filter_color_orange">
                                                    <img src="https://cdn-icons-png.flaticon.com/32/7269/7269753.png" style="width: 28px; height: 28px;">
                                                </label>
                                                <input type="checkbox" name="favorite_color" value="blue" id="filter_color_blue" class=${LEAGUE_FILTER.favorites_blue == 'checked' ? 'filter_selected' : ""} ${LEAGUE_FILTER.favorites_blue}>
                                                <label for="filter_color_blue">
                                                    <img src="https://cdn-icons-png.flaticon.com/32/6853/6853076.png" style="width: 31px; height: 31px;">
                                                </label>
                                                <input type="checkbox" name="favorite_color" id="filter_color_red" value="red" class=${LEAGUE_FILTER.favorites_red == 'checked' ? 'filter_selected' : ""} ${LEAGUE_FILTER.favorites_red}>
                                                <label for="filter_color_red">
                                                    <img src="https://cdn-icons-png.flaticon.com/32/8539/8539511.png" style="width: 26px; height: 26px;">
                                                </label>
                                                <input type="checkbox" name="favorite_color" id="filter_color_purple" value="purple" class=${LEAGUE_FILTER.favorites_purple == 'checked' ? 'filter_selected' : ""} ${LEAGUE_FILTER.favorites_purple}>
                                                <label for="filter_color_purple">
                                                    <img src="https://cdn-icons-png.flaticon.com/32/8206/8206824.png" style="width: 29px; height: 29px;">
                                                </label>
                                                <input type="checkbox" name="favorite_color" value="green" id="filter_color_green" class=${LEAGUE_FILTER.favorites_green == 'checked' ? 'filter_selected' : ""} ${LEAGUE_FILTER.favorites_green}>
                                                <label for="filter_color_green">
                                                    <img src="https://cdn-icons-png.flaticon.com/32/9351/9351980.png" style="width: 27px; height: 27px;">
                                                </label>
                                                <input type="checkbox" name="favorite_color" value="none" id="filter_color_none" class=${LEAGUE_FILTER.favorites_none == 'checked' ? 'filter_selected' : ""} ${LEAGUE_FILTER.favorites_none}>
                                                <label for="filter_color_none">
                                                    <img src="https://hh2.hh-content.com/design/ic_star_white.svg" style="width: 26px; height: 26px;">
                                                </label>
                                            </div>
                                        </div>
                                        <div class="filter_type" style="break-inside: avoid;"><legend style="padding: 15px 0 0;">${labels.Boosters}</legend>
                                            <div>
                                                <input type="checkbox" id="filter_with_boosters" name="boosters" value="with_boosters" ${LEAGUE_FILTER.with_boosters}/>
                                                <label for="none">${labels.with_boosters}</label>
                                            </div>
                                            <div>
                                                <input type="checkbox" id="filter_no_boosters" name="boosters" value="no_boosters" ${LEAGUE_FILTER.no_boosters}/>
                                                <label for="none">${labels.no_boosters}</label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>`
                }

                function createFilterEvents() {
                    $('#league_filter').on('click', () => {
                        let currentBoxDisplay = $("#league_filter_box").css('display');
                        $('#league_filter_box').css('display', currentBoxDisplay == "none" ? 'grid' : 'none');
                    });
                    $('#filter_no_skill').on('change', () => {filterOpponents(); saveFilterParameters();});
                    $('#filter_with_skill').on('change', () => {filterOpponents(); saveFilterParameters();});
                    $('#filter_stun').on('change', () => {filterOpponents(); saveFilterParameters();});
                    $('#filter_shield').on('change', () => {filterOpponents(); saveFilterParameters();});
                    $('#filter_reflect').on('change', () => {filterOpponents(); saveFilterParameters();});
                    $('#filter_execute').on('change', () => {filterOpponents(); saveFilterParameters();});
                    $('#filter_fought').on('change', () => {filterOpponents(); saveFilterParameters();});
                    $('#filter_favorites').on('click', () => {filterOpponents(); saveFilterParameters();});
                    $('#filter_favorites_color').on('change', () => {filterOpponents(); saveFilterParameters();});
                    $('#filter_with_boosters').on('change', () => {filterOpponents(); saveFilterParameters();});
                    $('#filter_no_boosters').on('change', () => {filterOpponents(); saveFilterParameters();});

                    $('#filter_with_skill').click(() => {
                        if (!$('#filter_with_skill').is(':checked')) {
                            $('#filter_stun').prop('checked', false);
                            $('#filter_shield').prop('checked', false);
                            $('#filter_reflect').prop('checked', false);
                            $('#filter_execute').prop('checked', false);
                        }
                        else {
                            $('#filter_stun').prop('checked', true);
                            $('#filter_shield').prop('checked', true);
                            $('#filter_reflect').prop('checked', true);
                            $('#filter_execute').prop('checked', true);
                        }
                    });
                    $('#filter_stun').click(() => {
                        if ($('#filter_stun').is(':checked')) {
                            $('#filter_with_skill').prop('checked', true);
                        }
                        if (!$('#filter_stun').is(':checked') && !$('#filter_shield').is(':checked') && !$('#filter_reflect').is(':checked') && !$('#filter_execute').is(':checked'))
                            $('#filter_with_skill').prop('checked', false);
                    });
                    $('#filter_shield').click(() => {
                        if ($('#filter_shield').is(':checked')) {
                            $('#filter_with_skill').prop('checked', true);
                        }
                        if (!$('#filter_stun').is(':checked') && !$('#filter_shield').is(':checked') && !$('#filter_reflect').is(':checked') && !$('#filter_execute').is(':checked'))
                            $('#filter_with_skill').prop('checked', false);
                    });
                    $('#filter_reflect').click(() => {
                        if ($('#filter_reflect').is(':checked')) {
                            $('#filter_with_skill').prop('checked', true);
                        }
                        if (!$('#filter_stun').is(':checked') && !$('#filter_shield').is(':checked') && !$('#filter_reflect').is(':checked') && !$('#filter_execute').is(':checked'))
                            $('#filter_with_skill').prop('checked', false);
                    });
                    $('#filter_execute').click(() => {
                        if ($('#filter_execute').is(':checked')) {
                            $('#filter_with_skill').prop('checked', true);
                        }
                        if (!$('#filter_stun').is(':checked') && !$('#filter_shield').is(':checked') && !$('#filter_reflect').is(':checked') && !$('#filter_execute').is(':checked'))
                            $('#filter_with_skill').prop('checked', false);
                    });

                    $('#filter_favorites-all').click(() => {
                        ['orange', 'blue', 'red', 'purple', 'green', 'none'].forEach((el) => {
                            $(`#filter_color_${el}`).addClass('filter_selected');
                            $(`#filter_color_${el}`).prop('checked', true);
                        });
                    });
                    $('#filter_favorites-true').click(() => {
                        ['orange', 'blue', 'red', 'purple', 'green'].forEach((el) => {
                            if (!$(`#filter_color_${el}`).is(':checked')) {
                                $(`#filter_color_${el}`).addClass('filter_selected');
                                $(`#filter_color_${el}`).prop('checked', true);
                            }
                        });
                        ['none'].forEach((el) => {
                            $(`#filter_color_${el}`).removeClass('filter_selected');
                            $(`#filter_color_${el}`).prop('checked', false);
                        });
                    });
                    $('#filter_favorites-false').click(() => {
                        ['orange', 'blue', 'red', 'purple', 'green'].forEach((el) => {
                            $(`#filter_color_${el}`).removeClass('filter_selected');
                            $(`#filter_color_${el}`).prop('checked', false);
                        });
                        ['none'].forEach((el) => {
                            if (!$(`#filter_color_${el}`).is(':checked')) {
                                $(`#filter_color_${el}`).addClass('filter_selected');
                                $(`#filter_color_${el}`).prop('checked', true);
                            }
                        });
                    });
                    ['orange', 'blue', 'red', 'purple', 'green', 'none'].forEach((el) => {
                        $(`#filter_color_${el}`).click(() => {
                            if(!document.querySelector(`#filter_color_${el}`).className.includes("filter_selected")) {
                                $(`#filter_color_${el}`).addClass('filter_selected');
                                $(`#filter_color_${el}`).prop('checked', true);
                            }
                            else {
                                $(`#filter_color_${el}`).removeClass('filter_selected');
                                $(`#filter_color_${el}`).prop('checked', false);
                            }
                        });
                    })
                }

                function saveFilterParameters() {
                    ['no_skill', 'with_skill', 'stun', 'shield', 'reflect', 'execute', 'fought', 'with_boosters', 'no_boosters'].forEach((el) => {
                        document.querySelector('#filter_' + el).checked ? LEAGUE_FILTER[el] = 'checked' : LEAGUE_FILTER[el] = 'none';
                    })
                    document.querySelector(`#filter_color_orange`).checked ? LEAGUE_FILTER.favorites_orange = 'checked' : LEAGUE_FILTER.favorites_orange = 'none';
                    document.querySelector(`#filter_color_blue`).checked ? LEAGUE_FILTER.favorites_blue = 'checked' : LEAGUE_FILTER.favorites_blue = 'none';
                    document.querySelector(`#filter_color_red`).checked ? LEAGUE_FILTER.favorites_red = 'checked' : LEAGUE_FILTER.favorites_red = 'none';
                    document.querySelector(`#filter_color_purple`).checked ? LEAGUE_FILTER.favorites_purple = 'checked' : LEAGUE_FILTER.favorites_purple = 'none';
                    document.querySelector(`#filter_color_green`).checked ? LEAGUE_FILTER.favorites_green = 'checked' : LEAGUE_FILTER.favorites_green = 'none';
                    document.querySelector(`#filter_color_none`).checked ? LEAGUE_FILTER.favorites_none = 'checked' : LEAGUE_FILTER.favorites_none = 'none';
                    localStorage.setItem('HHS.leagueFilter', JSON.stringify(LEAGUE_FILTER))
                }

                //CSS
                sheet.insertRule(`#league_filter_box {
                    position: absolute;
                    grid-template-columns: 1fr 1.2fr;
                    background-color: rgba(30, 38, 30, 0.85);
                    color: #fff;
                    font-size: 18px;
                    box-shadow: rgba(255, 255, 255, 0.73) 0px 0px;
                    border-radius: 8px 10px 10px 8px;
                    border: 1px solid #ffa23e;
                    display: none;
                    left: 60px;
                    width: max-content;
                    top: 68px;
                    z-index: 3;}`
                );

                sheet.insertRule(`${mediaMobile} {
                        #league_filter_box {
                    column-gap: 35px;}}`
                );

                sheet.insertRule(`${mediaDesktop} {
                        #league_filter_box {
                    column-gap: 25px;}}`
                );

                sheet.insertRule(`#league_filter {
                    position: absolute;
                    left: 13rem;
                    height: max-content;
                    color: #fff;
                    width: 84px;
                    z-index: 3;}`
                );

                sheet.insertRule(`${mediaDesktop} {
                        #league_filter {
                    font-size: 16px;
                    top: 2.6rem;}}`
                );

                sheet.insertRule(`${mediaMobile} {
                        #league_filter {
                    font-size: 18px;
                    top: 2.4rem;}}`
                );

                sheet.insertRule(`#league_filter_box legend {
                    color: #ffb827;}`
                );

                sheet.insertRule(`${mediaMobile} {
                        #league_filter_box .filter_type div {
                    line-height: 45px;}}`
                );

                sheet.insertRule(`${mediaMobile} {
                        #league_filter_box label {
                    position: relative;
                    top: 13px;
                    height: 2rem;}}`
                );

                sheet.insertRule(`${mediaDesktop} {
                        #league_filter_box label {
                    position: relative;
                    top: 4px;
                    height: 2rem;}}`
                );

                sheet.insertRule(`${mediaMobile} {
                        #league_filter_box .filter_type div:first-of-type {
                    margin-top: -15px;}}`
                );

                sheet.insertRule(`#filter_favorites {
                    display: grid;
                    grid-auto-flow : column;
                    column-gap: 25px;
                    justify-content: center;}`
                );

                sheet.insertRule(`#filter_favorites img {
                    position: relative;
                    height: 28px;
                    width: 28px;}`
                );

                sheet.insertRule(`${mediaDesktop} {
                        #filter_favorites_color img {
                    position: relative;
                    top: 1px;}}`
                );

                sheet.insertRule(`${mediaMobile} {
                        #filter_favorites_color img {
                    position: relative;
                    top: -16px;}}`
                );

                sheet.insertRule(`${mediaDesktop} {
                        #filter_favorites img {
                    margin: 0 2px -2px;}}`
                );

                sheet.insertRule(`${mediaMobile} {
                        #filter_favorites img {
                    margin: 0px 2px 14px;}}`
                );

                sheet.insertRule(`#filter_favorites input, #filter_favorites_color input {
                    display: none;}`
                );

                sheet.insertRule(`#filter_favorites input.filter_selected + label, #filter_favorites input:hover + label,
                        #filter_favorites_color input.filter_selected + label {
                    background-color: #fff8;}`
                );

                sheet.insertRule(`#filter_favorites_color {
                    display: inline flex;
                    column-gap: 25px;
                    margin-top: 15px;}`
                );

                sheet.insertRule(`${mediaMobile} {
                        input[type="checkbox"] {
                    transform: scale(1.5);}}`
                );
            }

            function filterOpponents() {
                const opponents = document.querySelectorAll('.data-row.body-row:not(.player-row)');

                let filterNoSkill = document.querySelector('#filter_no_skill').checked ? 0 : 1;
                let filterStun = document.querySelector('#filter_stun').checked ? "stun" : "none";
                let filterShield = document.querySelector('#filter_shield').checked ? "shield" : "none";
                let filterReflect = document.querySelector('#filter_reflect').checked ? "reflect" : "none";
                let filterExecute = document.querySelector('#filter_execute').checked ? "execute" : "none";
                let filterFought = document.querySelector('#filter_fought').checked ? 1 : 0;
                let filterFavoritesOrange = document.querySelector('#filter_color_orange').checked ? 'orange' : '';
                let filterFavoritesBlue = document.querySelector('#filter_color_blue').checked ? 'blue' : '';
                let filterFavoritesRed = document.querySelector('#filter_color_red').checked ? 'red' : '';
                let filterFavoritesPurple = document.querySelector('#filter_color_purple').checked ? 'purple' : '';
                let filterFavoritesGreen = document.querySelector('#filter_color_green').checked ? 'green' : '';
                let filterFavoritesNone = document.querySelector('#filter_color_none').checked ? 'none' : '';
                let filterWithBoosters = document.querySelector('#filter_with_boosters').checked ? 0 : 1;
                let filterNoBoosters = document.querySelector('#filter_no_boosters').checked ? 1 : 0;

                for (let opponent of opponents) {
                    const tier5 = $(opponent).find('.tier5_skill');
                    const fights = $(opponent).find('.result.won').length + $(opponent).find('.result.lost').length;
                    const boosters = $(opponent).find('.boosters .slot');
                    let boosters_expired = 1;
                    for (let booster of boosters) {
                        if (JSON.parse($(booster).attr('data-d')).expiration > 0) boosters_expired = 0;
                    }
                    const favorite_color = $(opponent).find('.favorite-toggle').attr('data-opponent-color');

                    let matchesNoSkill = (filterNoSkill == tier5.length);
                    let matchesStun = (tier5.length > 0) ? (tier5.text().includes(filterStun)) : false;
                    let matchesShield = (tier5.length > 0) ? (tier5.text().includes(filterShield)) : false;
                    let matchesReflect = (tier5.length > 0) ? (tier5.text().includes(filterReflect)) : false;
                    let matchesExecute = (tier5.length > 0) ? (tier5.text().includes(filterExecute)) : false;
                    let matchesFought = (filterFought == 1 || (fights < 3 && filterFought == 0));
                    let matchesFavoritesOrange = (filterFavoritesOrange == favorite_color);
                    let matchesFavoritesBlue = (filterFavoritesBlue == favorite_color);
                    let matchesFavoritesRed = (filterFavoritesRed == favorite_color);
                    let matchesFavoritesPurple = (filterFavoritesPurple == favorite_color);
                    let matchesFavoritesGreen = (filterFavoritesGreen == favorite_color);
                    let matchesFavoritesNone = (filterFavoritesNone == favorite_color);
                    let matchesWithBoosters = ((filterWithBoosters == 0) && (boosters_expired == 0));
                    let matchesNoBoosters = (filterNoBoosters == 1) && (boosters_expired == 1);

                    if (document.querySelector('#filter_no_skill').checked) {
                        $(opponent).removeClass('displayOpponent');
                        $(opponent).removeClass('hiddenOpponent');
                        if ((matchesNoSkill || (matchesStun || matchesShield || matchesReflect || matchesExecute)) && matchesFought && (matchesFavoritesOrange || matchesFavoritesBlue || matchesFavoritesRed || matchesFavoritesPurple || matchesFavoritesGreen || matchesFavoritesNone) && (matchesWithBoosters || matchesNoBoosters)) $(opponent).addClass('displayOpponent');
                        else $(opponent).addClass('hiddenOpponent');
                    }
                    else {
                        $(opponent).removeClass('displayOpponent');
                        $(opponent).removeClass('hiddenOpponent');
                        if ((matchesNoSkill && (matchesStun || matchesShield || matchesReflect || matchesExecute)) && matchesFought && (matchesFavoritesOrange || matchesFavoritesBlue || matchesFavoritesRed || matchesFavoritesPurple || matchesFavoritesGreen || matchesFavoritesNone) && (matchesWithBoosters || matchesNoBoosters)) $(opponent).addClass('displayOpponent');
                        else $(opponent).addClass('hiddenOpponent');
                    }
                }

                stripedLeague();
                if ($('.data-row.player-row.pinned').length == 0) lockHeroRow();

                //CSS
                sheet.insertRule(`.hiddenOpponent {
                    display: none !important;}`
                );
            }

            function favoriteOpponents() { 
                if (localStorage.getItem('HHS.LEAGUE_FAVORITES') != null) {
                    const old_favorites = JSON.parse(localStorage.getItem('HHS.LEAGUE_FAVORITES'));
                    if (!Array.isArray(old_favorites[0])) {
                        let new_favorites = new Map();
                        old_favorites.forEach((favorite) => {new_favorites.set(favorite, 'orange')})
                        localStorage.setItem('HHS.LEAGUE_FAVORITES', JSON.stringify(Array.from(new_favorites.entries())));
                    }
                }

                const favorite_colors = ['none', 'orange', 'blue', 'red', 'purple', 'green'];
                const getFavorites = () => (!localStorage.getItem('HHS.LEAGUE_FAVORITES')) ? new Map() : new Map(JSON.parse(localStorage.getItem('HHS.LEAGUE_FAVORITES')));
                const setFavorites = (favorites) => localStorage.setItem('HHS.LEAGUE_FAVORITES', JSON.stringify(Array.from(favorites.entries())));
                const addToFavorites = (id, color) => {
                    const favorites = getFavorites()
                    favorites.set(id, color)
                    setFavorites(favorites)
                };
                const removeFromFavorites = (id) => {
                    const favorites = getFavorites()
                    if (!favorites.has(id)) {return}
                    favorites.delete(id)
                    setFavorites(favorites)
                };

                const favorites = getFavorites();
                const $opponents = Array.from($('#leagues .league_content .league_table .data-list').find('.data-row.body-row:not(.player-row)'));

                $opponents.forEach((opponent) => {
                    const $opponent = $(opponent);
                    const opponent_id = $opponent.find('.nickname').attr('id-member');
                    const isFavorite = favorites.has(opponent_id);
                    const opponentColor = favorites.get(opponent_id) || 'none';

                    this.$favoriteToggle = $('<div class="favorite-toggle"></div>');
                    let $favoriteToggle = $opponent.find('.favorite-toggle');
                    if (!$favoriteToggle.length) {
                        $favoriteToggle = this.$favoriteToggle.clone().attr('data-opponent-id', opponent_id);
                        $favoriteToggle.attr('data-is-favorite', isFavorite);
                        $favoriteToggle.attr('data-opponent-color', opponentColor);
                        $favoriteToggle.addClass(opponentColor)
                        $opponent.append($favoriteToggle);
                    } else {
                        $favoriteToggle.off('click');
                    }

                    $favoriteToggle.click(() => {
                        const opponentID = `${$favoriteToggle.attr('data-opponent-id')}`;
                        const favorite = JSON.parse($favoriteToggle.attr('data-is-favorite'));
                        const oppColor = `${$favoriteToggle.attr('data-opponent-color')}`;
                        if (favorite) {
                            let new_color = favorite_colors[(favorite_colors.indexOf(oppColor)+1)%favorite_colors.length]
                            if (new_color == 'none') {
                                $favoriteToggle.removeClass(oppColor);
                                removeFromFavorites(opponentID);
                                $favoriteToggle.attr('data-opponent-color', new_color);
                                $favoriteToggle.attr('data-is-favorite', false);
                            }
                            else {
                                $favoriteToggle.attr('data-opponent-color', new_color);
                                $favoriteToggle.removeClass(oppColor);
                                $favoriteToggle.addClass(new_color);
                                addToFavorites(opponentID, new_color);
                            }
                        } else {
                            addToFavorites(opponentID, 'orange');
                            $favoriteToggle.attr('data-is-favorite', true);
                            $favoriteToggle.attr('data-opponent-color', 'orange');
                            $favoriteToggle.addClass('orange')
                        }
                        filterOpponents();
                    })
                })

                //CSS
                sheet.insertRule(`.body-row .favorite-toggle {
                    position: absolute;
                    height: 32px;
                    width: 32px;
                    top: 6px;
                    left: 40px;
                    background-size: 22px;
                    background-repeat: no-repeat;
                    background-position: center;
                    border-top-right-radius: 5px;
                    border-bottom-left-radius: 5px;}`
                );

                sheet.insertRule(`${mediaDesktop} {
                        .body-row .favorite-toggle {
                    display: none;}}`
                );

                sheet.insertRule(`${mediaMobile} {
                        .body-row .favorite-toggle {
                    display: block;}}`
                );

                sheet.insertRule(`${mediaDesktop} {
                        .body-row:hover .favorite-toggle[data-is-favorite="false"],
                        .body-row .favorite-toggle[data-is-favorite="true"] {
                    display: block;}}`
                );

                sheet.insertRule(`.body-row .favorite-toggle[data-is-favorite="false"] {
                    background-image: url("${window.IMAGES_URL}/design/ic_star_white.svg");
                    opacity: 0.7;}`
                );

                sheet.insertRule(`.body-row .favorite-toggle.orange[data-is-favorite="true"] {
                    background-image: url("https://cdn-icons-png.flaticon.com/32/7269/7269753.png");}`
                );

                sheet.insertRule(`.body-row .favorite-toggle.blue[data-is-favorite="true"] {
                    background-size: 28px;
                    background-image: url("https://cdn-icons-png.flaticon.com/32/6853/6853076.png");}`
                );

                sheet.insertRule(`.body-row .favorite-toggle.red[data-is-favorite="true"] {
                    background-image: url("https://cdn-icons-png.flaticon.com/32/8539/8539511.png");}`
                );

                sheet.insertRule(`.body-row .favorite-toggle.purple[data-is-favorite="true"] {
                    background-size: 24px;
                    background-image: url("https://cdn-icons-png.flaticon.com/32/8206/8206824.png");}`
                );

                sheet.insertRule(`.body-row .favorite-toggle.green[data-is-favorite="true"] {
                    background-image: url("https://cdn-icons-png.flaticon.com/32/9351/9351980.png");}`
                );
            }

            function stripedLeague() {
                let opponents = $('.body-row.displayOpponent');
                let isStripe = true;
                for (let opponent of opponents) {
                    $(opponent).removeClass('script-stripe');
                    $(opponent).removeClass('stripedOpponent')
                    if (isStripe) $(opponent).addClass('stripedOpponent')
                    isStripe = !isStripe;
                }

                //CSS
                sheet.insertRule(`.stripedOpponent {
                    background-color: rgba(191,40,90,.25);}`
                );
            }

            function displayLeaguePlayersInfo() {
                let board = document.getElementsByClassName("data-list")[0];
                if(!board) return;
                let opponents = board.getElementsByClassName("data-row body-row");
                let reflectOpponents = JSON.parse(localStorage.getItem('HHS.reflectLeaguePlayers')) || [];
                let stunOpponents = JSON.parse(localStorage.getItem('HHS.stunLeaguePlayers')) || [];
                let shieldOpponents = JSON.parse(localStorage.getItem('HHS.shieldLeaguePlayers')) || [];
                let executeOpponents = JSON.parse(localStorage.getItem('HHS.executeLeaguePlayers')) || [];

                for (let i=0; i<opponents.length; i++) {
                    const opponent_id = parseInt($(opponents[i]).find('.nickname').attr('id-member'), 10);
                    const opponent = window.opponents_list.find((el) => el.player.id_fighter == opponent_id);

                    //Display team power
                    if ($(`.data-list :nth-child(${(i+2)})`).find('div[column = "team"] .teamPower').length == 0)
                        $(`.data-list :nth-child(${(i+2)})`).find('div[column = "team"]').append(`<div class="teamPower">${nThousand(Math.ceil(parseInt(opponent.player.team.total_power, 10)))}</div>`);

                    if (!((opponent).match_history[(opponent).player.id_fighter][0] != null && (opponent).match_history[(opponent).player.id_fighter][1] != null && (opponent).match_history[(opponent).player.id_fighter][2] != null)) {
                        //Display true opponent defense
                        const opp_def = opponent.player.defense;
                        let opponent_defense = opp_def < 10000 ? Math.ceil(opp_def) : (opp_def >= 100000 ? nRounding(opp_def, 0, 1) : nRounding(opp_def, 1, 1));
                        $($('.data-list').find('#player_defence_stat #stats-defense')[i]).text(opponent_defense);

                        //Add booster status
                        if (loadSetting('leagueBoardBoostersStatus')) {
                            if (opponents[i].className.indexOf('player-row') == -1 && $(opponents[i]).find('.boosters .circular-progress').length == 0) {
                                let opponent_boosters = Array.from($(opponents[i]).find('.boosters .slot'));
                                opponent_boosters.forEach((booster) => {
                                    ($(opponents[i]).find('.boosters ')).append(leagueBoosterStatus(booster))

                                    //Display end time boosters
                                    let boosterData = JSON.parse($(booster).attr('data-d'));
                                    let endAt = window.server_now_ts + boosterData.expiration;
                                    const options = {hour: '2-digit', minute: '2-digit'};
                                    const formattedDate = new Date(endAt * 1000).toLocaleTimeString(undefined, options).replace(/(\d)/g, (x)=>`${x}<i></i>`);
                                    $(booster).attr('additional-tooltip-info', `${JSON.stringify({additionalText: `<span class="script-tooltip"></span>${labels.ends_at} ${formattedDate}`})}`);
                                });
                            }
                        }
                    }

                    //Display tier 5 skill
                    if ([11, 12, 13, 14].some(index => opponent.player.team.girls[0].skills[index])) {
                        const skill5_girl = opponent.player.team.girls[0].skills;
                        //Stun
                        if (!(skill5_girl[11] == undefined) && $(opponents[i]).find('.tier5_skill').length == 0) {
                            if ($($(opponents[i]).find('.nickname')[0]).attr('id-member') != heroData.infos.id) stunOpponents.push($($(opponents[i]).find('.nickname')[0]).attr('id-member'));
                            ($(opponents[i]).find('.boosters ')).after(`<span class="tier5_skill">${skill5_girl[11].skill.skill_type} / ${skill5_girl[11].skill.display_value_text}</span>`);
                            ($(opponents[i]).find('div[column = "team"]')).append(`<span class="team_skill"><span class="stun_icn"></span></span>`);
                        }
                        //Shield
                        else if (!(skill5_girl[12] == undefined) && $(opponents[i]).find('.tier5_skill').length == 0) {
                            if ($($(opponents[i]).find('.nickname')[0]).attr('id-member') != heroData.infos.id) shieldOpponents.push($($(opponents[i]).find('.nickname')[0]).attr('id-member'));
                            ($(opponents[i]).find('.boosters ')).after(`<span class="tier5_skill">${skill5_girl[12].skill.skill_type} / ${skill5_girl[12].skill.display_value_text}</span>`);
                            ($(opponents[i]).find('div[column = "team"]')).append(`<span class="team_skill"><span class="shield_icn"></span></span>`);
                        }
                        //Reflect
                        else if (!(skill5_girl[13] == undefined) && $(opponents[i]).find('.tier5_skill').length == 0) {
                            if ($($(opponents[i]).find('.nickname')[0]).attr('id-member') != heroData.infos.id) reflectOpponents.push($($(opponents[i]).find('.nickname')[0]).attr('id-member'));
                            ($(opponents[i]).find('.boosters ')).after(`<span class="tier5_skill">${skill5_girl[13].skill.skill_type} / ${skill5_girl[13].skill.display_value_text}</span>`);
                            ($(opponents[i]).find('div[column = "team"]')).append(`<span class="team_skill"><span class="reflect_icn"></span></span>`);
                        }
                        //Execute
                        else if (!(skill5_girl[14] == undefined) && $(opponents[i]).find('.tier5_skill').length == 0) {
                            if ($($(opponents[i]).find('.nickname')[0]).attr('id-member') != heroData.infos.id) executeOpponents.push($($(opponents[i]).find('.nickname')[0]).attr('id-member'));
                            ($(opponents[i]).find('.boosters ')).after(`<span class="tier5_skill">${skill5_girl[14].skill.skill_type} / ${skill5_girl[14].skill.display_value_text}</span>`);
                            ($(opponents[i]).find('div[column = "team"]')).append(`<span class="team_skill"><span class="execute_icn"></span></span>`);
                        }
                    }

                    if (reflectOpponents.includes($($(opponents[i]).find('.nickname')[0]).attr('id-member'))) $($(opponents[i]).find('.nickname')[0]).css('color', '#b968e6');
                    else if (stunOpponents.includes($($(opponents[i]).find('.nickname')[0]).attr('id-member'))) $($(opponents[i]).find('.nickname')[0]).css('color', '#14b4d9');
                    else if (shieldOpponents.includes($($(opponents[i]).find('.nickname')[0]).attr('id-member'))) $($(opponents[i]).find('.nickname')[0]).css('color', 'orange');
                    else if (executeOpponents.includes($($(opponents[i]).find('.nickname')[0]).attr('id-member'))) $($(opponents[i]).find('.nickname')[0]).css('color', '#66cd00');
                }

                localStorage.setItem('HHS.reflectLeaguePlayers', JSON.stringify(reflectOpponents));
                localStorage.setItem('HHS.stunLeaguePlayers', JSON.stringify(stunOpponents));
                localStorage.setItem('HHS.shieldLeaguePlayers', JSON.stringify(shieldOpponents));
                localStorage.setItem('HHS.executeLeaguePlayers', JSON.stringify(executeOpponents));

                try {
                    let player_boosters = [];
                    if (!(localStorage.getItem('HHS.booster_status') == null || localStorage.getItem('HHS.booster_status') == undefined)) {
                        JSON.parse(localStorage.getItem('HHS.booster_status')).mythic.forEach((booster) => {
                            player_boosters.push(booster.item.identifier);
                        });
                    }

                    let player_carac_dmg = window.opponents_list.find((el) => el.player.id_fighter == heroData.infos.id).player.team.caracs.damage;
                    let player_carac_def = window.opponents_list.find((el) => el.player.id_fighter == heroData.infos.id).player.team.caracs.defense;

                    window.opponents_list.find((el) => el.player.id_fighter == heroData.infos.id).player.defense = player_carac_def;
                    if (player_boosters.indexOf("MB2") != -1 || player_boosters.indexOf("MB8") != -1) {
                        player_carac_dmg *= 1.15;
                        window.opponents_list.find((el) => el.player.id_fighter == heroData.infos.id).player.team.caracs.damage = player_carac_dmg;
                    }

                    let player_dmg = player_carac_dmg < 10000 ? Math.ceil(player_carac_dmg) : (player_carac_dmg >= 100000 ? nRounding(player_carac_dmg, 0, 1) : nRounding(player_carac_dmg, 1, 1));
                    let player_defense = player_carac_def < 10000 ? Math.ceil(player_carac_def) : (player_carac_def >= 100000 ? nRounding(player_carac_def, 0, 1) : nRounding(player_carac_def, 1, 1));

                    //Display current player stats
                    $('.player-row #player_attack_stat #stats-damage').text(player_dmg);
                    $('.player-row #player_defence_stat #stats-defense').text(player_defense);

                    //Display sim score
                    if (loadSetting('simLeagueBoardFight')) {
                        if (localStorage.getItem('HHS.simLeagueBoardFight') == undefined) localStorage.setItem('HHS.simLeagueBoardFight', true);

                        //CSS
                        sheet.insertRule(`#leagues .league_content .league_table .data-list .body-row .go_pre_battle {
                            opacity: 0;}`
                        );

                        sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="can_fight"] .blue_button_L,
                                #leagues .league_content .league_table .data-list .data-row .head-column[column="can_fight"] .blue_button_L {
                            padding: 0;}`
                        );

                        sheet.insertRule(`#leagues .league_content.hidden_girl .league_table .data-list .data-row .data-column[column="boosters"],
                                #leagues .league_content.hidden_girl .league_table .data-list .data-row .head-column[column="boosters"] {
                            min-width: 14.5rem;}`
                        );

                        sheet.insertRule(`${mediaDesktop} {
                                #leagues .league_content .league_table .data-list.lock_hero .data-row.player-row .data-column[column="can_fight"] {
                            min-width: 3.5rem;}`
                        );

                        sheet.insertRule(`${mediaMobile} {
                                #leagues .league_content .league_table .data-list.lock_hero .data-row.player-row .data-column[column="can_fight"] {
                            min-width: 3.7rem;}`
                        );

                        sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="can_fight"],
                                #leagues .league_content .league_table .data-list .data-row .head-column[column="can_fight"] {
                            min-width: 4rem;}`
                        );

                        if ($('.head-column[column=can_fight]').length) {
                            $('.head-column[column=can_fight] > span')[0].firstChild.data = "SIM";
                        }

                        for (let i=0; i<opponents.length; i++) {
                            const opponent_id = parseInt($(opponents[i]).find('.nickname').attr('id-member'), 10);
                            const opponent = window.opponents_list.find((el) => el.player.id_fighter == opponent_id);

                            if (opponent.player.id_fighter != heroData.infos.id && !(opponent.match_history[opponent.player.id_fighter][0] != null && opponent.match_history[opponent.player.id_fighter][1] != null && opponent.match_history[opponent.player.id_fighter][2] != null)) {
                                if($($('.body-row .data-column[column=can_fight]')[i]).find('.matchRating').length == 0) {
                                    $($('.body-row .data-column[column=can_fight]')[i]).append(calcSimResults(opponent));
                                }
                            }
                        }
                        sortLeagueSimScore();
                    }
                } catch(err) {console.log(`HH++ OCD script error (Problem with league simulation): ${err.name}\n ${err.message}\n ${err.stack}`)}

                collectLeagueOpponents();
                new MutationObserver(() => {collectLeagueOpponents();}).observe($('.data-list')[0], {subtree: true, attributes: true, attributeFilter: ['class']});

                function calcSimResults(opponentData) {
                    let playerData = window.opponents_list.find((el) => el.player.id_fighter == heroData.infos.id).player;

                    let playerAtk = playerData.team.caracs.damage;
                    let playerEgo = playerData.team.caracs.ego;
                    let playerDef = playerData.team.caracs.defense;
                    let playerCrit = playerData.team.caracs.chance;

                    let playerElements = [];
                    playerData.team.theme_elements.forEach((el) => playerElements.push(el.type));

                    const playerBonuses = {
                        critDamage: playerData.team.synergies.find(({element: {type}})=>type == 'fire').bonus_multiplier,
                        critChance: playerData.team.synergies.find(({element: {type}})=>type == 'stone').bonus_multiplier,
                        defReduce: playerData.team.synergies.find(({element: {type}})=>type == 'sun').bonus_multiplier,
                        healOnHit: playerData.team.synergies.find(({element: {type}})=>type == 'water').bonus_multiplier
                    };

                    let opponentAtk = opponentData.player.damage;
                    let opponentEgo = opponentData.player.remaining_ego;
                    let opponentDef = opponentData.player.defense;
                    let opponentCrit = opponentData.player.chance;

                    let opponentElements = [];
                    opponentData.player.team.theme_elements.forEach((el) => opponentElements.push(el.type));

                    const opponentBonuses = {
                        critDamage: opponentData.player.team.synergies.find(({element: {type}})=>type == 'fire').bonus_multiplier,
                        critChance: opponentData.player.team.synergies.find(({element: {type}})=>type == 'stone').bonus_multiplier,
                        defReduce: opponentData.player.team.synergies.find(({element: {type}})=>type == 'sun').bonus_multiplier,
                        healOnHit: opponentData.player.team.synergies.find(({element: {type}})=>type == 'water').bonus_multiplier
                    };

                    const dominanceBonuses = calculateDominationBonuses(playerElements, opponentElements);

                    let player = {
                        hp: playerEgo * (1+dominanceBonuses.player.ego),
                        atk: playerAtk * (1+dominanceBonuses.player.attack),
                        adv_def: opponentDef,
                        critchance: calculateCritChanceShare(playerCrit, opponentCrit) + dominanceBonuses.player.chance + playerBonuses.critChance,
                        bonuses: playerBonuses,
                        tier4: calculateTier4SkillValue(playerData.team.girls),
                        tier5: calculateTier5SkillValue(playerData.team.girls)
                    };

                    let opponent = {
                        hp: opponentEgo,
                        atk: opponentAtk,
                        adv_def: playerDef * (1-opponentBonuses.defReduce),
                        critchance: calculateCritChanceShare(opponentCrit, playerCrit) + dominanceBonuses.opponent.chance + opponentBonuses.critChance,
                        name: opponentData.player.nickname,
                        bonuses: opponentBonuses,
                        tier4: calculateTier4SkillValue(opponentData.player.team.girls),
                        tier5: calculateTier5SkillValue(opponentData.player.team.girls)
                    };

                    const {points: calc, win, scoreClass} = calculateBattleProbabilities(player, opponent);

                    let probabilityTooltip = `<table class='probabilityTable'>`;
                    let expectedValue = 0;
                    const pointGrade=['#fff','#fff','#fff','#ff2f2f','#fe3c25','#fb4719','#f95107','#f65b00','#f26400','#ed6c00','#e97400','#e37c00','#de8400','#d88b00','#d19100','#ca9800','#c39e00','#bba400','#b3aa00','#aab000','#a1b500','#97ba00','#8cbf00','#81c400','#74c900','#66cd00'];
                    for (let i=25; i>=3; i--) {
                        if (calc[i] >= 0.0001) {
                            const isW = i>=15
                            probabilityTooltip += `<tr style='color:${isW?pointGrade[25]:pointGrade[3]};' data-tint='${isW?'w':'l'}'><td>${i}</td><td>${nRounding(100*calc[i], 2, -1)}%</td></tr>`;
                            expectedValue += i*calc[i];
                        }
                    }
                    probabilityTooltip += `<tr class='${scoreClass}'><td>${window.GT.design.leagues_won_letter}</td><td>${nRounding(100*win, 2, -1)}%</td></tr>`;
                    probabilityTooltip += '</table>';

                    const $rating = $(`<div class="matchRating" tooltip="" style="color:${pointGrade[Math.round(expectedValue)]};" hh_title="${probabilityTooltip}">${nRounding(100*win, 2, -1)}%<BR> ${nRounding(expectedValue, 3, -1)}</div>`)

                    opponentData.sim_result = $rating;
                    opponentData.can_fight = expectedValue;

                    return $rating
                }

                function leagueBoosterStatus(booster) {
                    const CIRCULAR_THRESHOLDS = {
                        1: 'green',
                        0.5: 'yellow',
                        0.2: 'red'
                    };

                    const buildProgressWrapper = (current, max) => {
                        const percentage = Math.min(current/max, 1)
                        const firstHalf = Math.min(percentage, 0.5) * 2
                        const secondHalf = Math.max(percentage - 0.5, 0) * 2

                        let colorClass = ''
                        let flashingClass = ''

                        //if (percentage > 0) {
                        Object.entries(CIRCULAR_THRESHOLDS).forEach(([threshold, className]) => {
                            if (percentage <= threshold) {
                                colorClass = className
                            }
                        })

                        if (percentage <= 0.0035 && percentage > 0) {
                            flashingClass = 'flashing'
                        }

                        if (percentage <= 0) {
                            flashingClass = 'expired'
                        }
                        //}

                        const $wrapper = $(`
                                <div class="circular-progress">
                                    <div class="circle">
                                        <div class="circle-bar left ${flashingClass}">
                                            <div class="progress ${colorClass}" style="transform: rotate(${180 * secondHalf}deg)"></div>
                                        </div>
                                        <div class="circle-bar right ${flashingClass}">
                                            <div class="progress ${colorClass}" style="transform: rotate(${180 * firstHalf}deg)"></div>
                                        </div>
                                    </div>
                                </div>
                            `)
                        return $wrapper
                    }

                    const booster_data = JSON.parse($(booster).attr('data-d'));
                    let booster_status = buildProgressWrapper(booster_data.expiration, parseInt(booster_data.item.duration, 10)*60);
                    booster_status.prepend($(booster));

                    return booster_status;
                }

                //CSS
                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row.player-row.pinned {
                    top: 30.2rem !important;
                    width: 61.75rem !important;}`
                );

                sheet.insertRule(`.teamThemeIcon {
                    z-index: 0;
                    height: 20px;
                    width: 20px;
                    top: 1px;
                    border: none;}`
                );

                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="team"] span.multi-elements {
                    background-size: 20px;
                    left: -9px;}`
                );

                sheet.insertRule(`.domination-toggle {
                    position: relative;
                    background-size: 20px;
                    width: 1.4rem;
                    top: -7px;
                    left: -4px;}`
                );

                sheet.insertRule(`.teamPower,
                        .team-power {
                    font-size: 12px;
                    position: absolute;
                    width: 3rem;
                    text-align: center;
                    top: 21px;
                    left: -3px;}`
                );

                sheet.insertRule(`.tier5_skill {
                    position: relative;
                    top: 12px;
                    left: -103px;
                    width: max-content;
                    font-size: 14px;}`
                );

                sheet.insertRule(`.team_skill {
                    position: absolute;
                    top: -4px;
                    left: 38px;
                    height: max-content;
                    width: max-content;}`
                );

                sheet.insertRule(`${mediaDesktop} {
                        .team_skill > .active_skills_icn,
                        .team_skill > .stun_icn,
                        .team_skill > .reflect_icn,
                        .team_skill > .execute_icn {
                    height: 18px;
                    width: 18px;}`
                );

                sheet.insertRule(`${mediaMobile} {
                        .team_skill > .active_skills_icn,
                        .team_skill > .stun_icn,
                        .team_skill > .reflect_icn,
                        .team_skill > .execute_icn {
                    height: 20px;
                    width: 20px;}`
                );

                sheet.insertRule(`${mediaDesktop} {
                        .team_skill > .shield_icn {
                    height: 20px;
                    width: 20px;}}`
                );

                sheet.insertRule(`${mediaMobile} {
                        .team_skill > .shield_icn {
                    height: 21px;
                    width: 21px;}}`
                );

                sheet.insertRule(`#leagues .boosters {
                    z-index: 0;
                    display: flex;
                    flex-direction: row;}`
                );

                sheet.insertRule(`#leagues .circular-progress {
                    margin-right: 2px;
                    position: relative;
                    height: 25px;
                    width: 24px;}`
                );

                sheet.insertRule(`#leagues .circular-progress .green {
                    background-color: #01d10b;}`
                );

                sheet.insertRule(`#leagues .circular-progress .yellow {
                    background-color: #ffc400;}`
                );

                sheet.insertRule(`#leagues .circular-progress .red {
                    background-color: #ff0000;}`
                );

                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="boosters"] .boosters .circular-progress .slot {
                    top: 2px;}`
                );

                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="boosters"] .boosters .slot {
                    position: relative;
                    height: 20px;
                    width: 20px;
                    top: 9px;
                    left: 2px;
                    border-width: 0px;
                    z-index: 6;}`
                );

                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .head-column[column="boosters"] .boosters .slot.empty,
                        #leagues .league_content .league_table .data-list .data-row .data-column[column="boosters"] .boosters .slot.empty {
                    cursor: inherit;}`
                );

                sheet.insertRule(`#leagues .slot.size_xs {
                    border-radius: 0;}`
                );

                sheet.insertRule(`#leagues .circular-progress .empty + .circle {
                    box-shadow: none;}`
                );

                sheet.insertRule(`#leagues .circular-progress .empty + .circle .circle-bar {
                    background-color: transparent;}`
                );

                sheet.insertRule(`#leagues .circular-progress .circle {
                    position: relative;
                    top: -20px;
                    height: 100%;
                    width: 100%;
                    box-shadow: 0px 0px 5px #000, 0px 0px 4px #000, 0px 0px 3px #000, 0px 0px 2px #000;}`
                );

                sheet.insertRule(`#leagues .circular-progress .circle-bar {
                    position: absolute;
                    height: 100%;
                    width: 100%;
                    background-color: #000000bf;
                    clip-path: polygon(0% 0%, 0% 100%, 50% 100%, 50% 0%);
                    overflow: hidden;}`
                );

                sheet.insertRule(`#leagues .circular-progress .circle-bar.flashing {
                    animation-name: flashing-background;
                    animation-duration: 3s;
                    animation-iteration-count: infinite;}`
                );

                sheet.insertRule(`@keyframes flashing-background {
                    0% {background-color: #000000bf;}
                    50% {background-color: #ff0000;}
                    100% {background-color: #000000bf;}}`
                );

                sheet.insertRule(`#leagues .circular-progress .circle-bar.expired {
                    z-index: 10;
                    animation-name: expired-background;
                    animation-duration: 3s;
                    animation-iteration-count: infinite;}`
                );

                sheet.insertRule(`@keyframes expired-background {
                    0% {background-color: #000000bf;}
                    50% {background-color: rgba(255,0,0,0.75);}
                    100% {background-color: #000000bf;}}`
                );

                sheet.insertRule(`#leagues .circular-progress .circle-bar .progress {
                    position: absolute;
                    height: 200%;
                    width: 200%;
                    top: -50%;
                    left: -50%;
                    clip-path: polygon(50% -50%, 150% -50%, 150% 150%, 50% 150%);}`
                );

                sheet.insertRule(`#leagues .circular-progress .circle-bar.right {
                    transform: rotate(180deg);
                    z-index: 3;}`
                );

                sheet.insertRule(`#leagues .circular-progress .circle-bar.left .progress {
                    z-index: 1;}`
                );

                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .head-column[column="sim_score"] {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 5.5rem;}`
                );

                sheet.insertRule(`.matchRating {
                    position: absolute;
                    text-align: center;
                    width: 4rem;
                    margin-right: 10px;
                    text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000;
                    font-size: 12px;}`
                );

                sheet.insertRule(`.probabilityTable tr {
                    line-height: 16px;
                    color: #fff;}`
                );

                sheet.insertRule(`.probabilityTable tr:nth-of-type(odd) {
                    background-color: rgba(0,0,0,0.2);}`
                );

                sheet.insertRule(`.probabilityTable tr:nth-of-type(even)[data-tint=w] {
                    background-color: #66cd0028;}`
                );

                sheet.insertRule(`.probabilityTable tr:nth-of-type(even)[data-tint=l] {
                    background-color: #ff2f2f28;}`
                );

                sheet.insertRule(`.probabilityTable .plus {
                    color: #66CD00;}`
                );

                sheet.insertRule(`.probabilityTable .minus {
                    color: #FF2F2F;}`
                );

                sheet.insertRule(`.probabilityTable .close {
                    color: #FFA500;}`
                );

                sheet.insertRule(`.winProb {
                    text-align: center;
                    text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000;
                    line-height: 17px;
                    font-size: 16px;}`
                );

                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column.head-column[column="team"],
                        #leagues .league_content .league_table .data-list .data-row .data-column.head-column[column="boosters"] {
                    overflow: visible;
                    cursor: pointer;}`
                );

                sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column.head-column[column="team"] .upDownArrows_mix_icn,
                        #leagues .league_content .league_table .data-list .data-row .data-column.head-column[column="boosters"] .upDownArrows_mix_icn {
                    display: inline-block;}`
                );
            }

            function collectLeagueOpponents() {
                let opponents_id = [];
                Array.from($('.body-row:not(.player-row):not(.hiddenOpponent)')).forEach((el) => {
                    if(($(el).find('.result.won').length + $(el).find('.result.lost').length) < 3) opponents_id.push($(el).find('.nickname').attr('id-member'));
                });
                localStorage.setItem('HHS.leagueOppId', JSON.stringify(opponents_id));
            }

            function sortLeagueSimScore() {
                let tbody = document.querySelector('.data-list');
                let tr_player = tbody.querySelectorAll('.data-row.body-row');

                const compare = (asc) => (row1, row2) => {
                    const tdValue = row => $(row).find('.matchRating').length == 0 ? 0 : parseFloat($(row).find('.matchRating')[0].lastChild.nodeValue.replace(',', '.'))
                    const tri = (v1, v2) => v1 - v2;
                    return tri(tdValue(asc ? row1 : row2), tdValue(asc ? row2 : row1));
                };

                if (document.querySelector('.data-column.head-column[column="can_fight"] > span > span').className == "upArrow_mix_icn") {
                    let classe = Array.from(tr_player).sort(compare(true));
                    classe.forEach(tr => tbody.appendChild(tr));
                }
                else if (document.querySelector('.data-column.head-column[column="can_fight"] > span > span').className == "downArrow_mix_icn") {
                    let classe = Array.from(tr_player).sort(compare(false));
                    classe.forEach(tr => tbody.appendChild(tr));
                }
            }

            function sortLeagueTeamPower() {
                let tbody = document.querySelector('.data-list');
                const th_name = document.querySelector('.data-column.head-column[column="team"]');
                let tr_player = tbody.querySelectorAll('.data-row.body-row');

                const compare = (asc) => (row1, row2) => {
                    const tdValue = row => parseInt(Array.from(row.children).find((el) => el.attributes.column.nodeValue == "team").lastElementChild.innerText.replace(/\s/g, ''), 10);
                    const tri = (v1, v2) => v1 - v2;
                    return tri(tdValue(asc ? row1 : row2), tdValue(asc ? row2 : row1));
                };

                if (localStorage.getItem('leaderboard_#leagues .league_table_sorting')  == '{"column":"team","sorting":"ASC"}') {
                    document.querySelector('.data-column.head-column[column="team"] > span > span').className = "upArrow_mix_icn";
                    let classe = Array.from(tr_player).sort(compare(true));
                    classe.forEach(tr => tbody.appendChild(tr));
                }
                else if (localStorage.getItem('leaderboard_#leagues .league_table_sorting')  == '{"column":"team","sorting":"DESC"}') {
                    asc = false;
                    document.querySelector('.data-column.head-column[column="team"] > span > span').className = "downArrow_mix_icn";
                    let classe = Array.from(tr_player).sort(compare(false));
                    classe.forEach(tr => tbody.appendChild(tr));
                }

                collectLeagueOpponents();

                function leagueTeamPowerEvent() {
                    tbody = document.querySelector('.data-list');
                    tr_player = tbody.querySelectorAll('.data-row.body-row');
                    let newSort = (localStorage.getItem('leaderboard_#leagues .league_table_sorting')  == '{"column":"team","sorting":"ASC"}') ? 0 : 1;
                    newSort = (newSort + 1) % 2;

                    let listSort = $('.head-column:not([column="team"])');
                    for (let sort of listSort) {
                        let arrow = sort.lastElementChild.lastElementChild;
                        if (arrow.className != "upDownArrows_mix_icn") arrow.className = "upDownArrows_mix_icn";
                        sort.removeAttribute('sorting');
                    }

                    switch (newSort) {
                        case 0:
                            document.querySelector('.data-column.head-column[column="team"] > span > span').className = "upArrow_mix_icn";
                            localStorage.setItem('leaderboard_#leagues .league_table_sorting', JSON.stringify({"column":"team","sorting":"ASC"}));
                            classe = Array.from(tr_player).sort(compare(true));
                            classe.forEach(tr => tbody.appendChild(tr));
                            collectLeagueOpponents();
                            stripedLeague();
                            if ($('.data-row.player-row.pinned').length == 0) lockHeroRow();
                            break;
                        case 1:
                            document.querySelector('.data-column.head-column[column="team"] > span > span').className = "downArrow_mix_icn";
                            localStorage.setItem('leaderboard_#leagues .league_table_sorting', JSON.stringify({"column":"team","sorting":"DESC"}));
                            classe = Array.from(tr_player).sort(compare(false));
                            classe.forEach(tr => tbody.appendChild(tr));
                            collectLeagueOpponents();
                            stripedLeague();
                            if ($('.data-row.player-row.pinned').length == 0) lockHeroRow();
                            break;
                    }
                }

                th_name.addEventListener('click', () => {leagueTeamPowerEvent()});
            }

            function sortLeagueBoostersTimer() {
                let tbody = document.querySelector('.data-list');
                const th_name = document.querySelector('.data-column.head-column[column="boosters"]');
                let tr_player = tbody.querySelectorAll('.data-row.body-row:not(.player-row)');

                const compare = (asc) => (row1, row2) => {
                    const tdValue = row => {
                        let boostersTimer = [];
                        let boosters = Array.from(row.children).find((el) => el.attributes.column.nodeValue == "boosters").children[1].querySelectorAll('.slot');
                        Array.from(boosters).forEach((booster) => {
                            boostersTimer.push(JSON.parse(booster.attributes['data-d'].value).expiration)
                        })
                        if (boosters.length == 0) boostersTimer.push(0);
                        return Math.min(...boostersTimer);
                    }
                    const tri = (v1, v2) => v1 - v2;
                    return tri(tdValue(asc ? row1 : row2), tdValue(asc ? row2 : row1));
                };

                if (localStorage.getItem('leaderboard_#leagues .league_table_sorting')  == '{"column":"boosters","sorting":"ASC"}') {
                    document.querySelector('.data-column.head-column[column="boosters"] > span > span').className = "upArrow_mix_icn";
                    let classe = Array.from(tr_player).sort(compare(true));
                    classe.forEach(tr => tbody.appendChild(tr));
                }
                else if (localStorage.getItem('leaderboard_#leagues .league_table_sorting')  == '{"column":"boosters","sorting":"DESC"}') {
                    asc = false;
                    document.querySelector('.data-column.head-column[column="boosters"] > span > span').className = "downArrow_mix_icn";
                    let classe = Array.from(tr_player).sort(compare(false));
                    classe.forEach(tr => tbody.appendChild(tr));
                }

                collectLeagueOpponents();

                function leagueBoostersTimerEvent() {
                    tbody = document.querySelector('.data-list');
                    tr_player = tbody.querySelectorAll('.data-row.body-row:not(.player-row)');
                    let newSort = (localStorage.getItem('leaderboard_#leagues .league_table_sorting')  == '{"column":"boosters","sorting":"ASC"}') ? 0 : 1;
                    newSort = (newSort + 1) % 2;

                    let listSort = $('.head-column:not([column="boosters"])');
                    for (let sort of listSort) {
                        let arrow = sort.lastElementChild.lastElementChild;
                        if (arrow.className != "upDownArrows_mix_icn") arrow.className = "upDownArrows_mix_icn";
                        sort.removeAttribute('sorting');
                    }

                    switch (newSort) {
                        case 0:
                            document.querySelector('.data-column.head-column[column="boosters"] > span > span').className = "upArrow_mix_icn";
                            localStorage.setItem('leaderboard_#leagues .league_table_sorting', JSON.stringify({"column":"boosters","sorting":"ASC"}));
                            classe = Array.from(tr_player).sort(compare(true));
                            classe.forEach(tr => tbody.appendChild(tr));
                            collectLeagueOpponents();
                            stripedLeague();
                            if ($('.data-row.player-row.pinned').length == 0) lockHeroRow();
                            break;
                        case 1:
                            document.querySelector('.data-column.head-column[column="boosters"] > span > span').className = "downArrow_mix_icn";
                            localStorage.setItem('leaderboard_#leagues .league_table_sorting', JSON.stringify({"column":"boosters","sorting":"DESC"}));
                            classe = Array.from(tr_player).sort(compare(false));
                            classe.forEach(tr => tbody.appendChild(tr));
                            collectLeagueOpponents();
                            stripedLeague();
                            if ($('.data-row.player-row.pinned').length == 0) lockHeroRow();
                            break;
                    }
                }
                th_name.addEventListener('click', () => {leagueBoostersTimerEvent()});
            }

            //Lock/unlock hero row at the top of the list
            function lockHeroRow() {
                if (!localStorage.getItem('HHS.leagueHeroLock')) localStorage.setItem('HHS.leagueHeroLock', 0);
                let leagueHeroLock = localStorage.getItem('HHS.leagueHeroLock');

                if (leagueHeroLock == 0 && $('.lock_leagueHero').length == 0) $('.data-row.player-row .data-column[column=can_fight]').append(`<span class="lock_leagueHero unlock"></span>`);
                else if (leagueHeroLock == 1) {
                    $('.data-list .head-row').after($('.data-list .player-row'));
                    $('.data-list').addClass('lock_hero');
                    if ($('.lock_leagueHero').length == 0) $('.data-row.player-row .data-column[column=can_fight]').append(`<span class="lock_leagueHero lock"></span>`);
                }

                $('.lock_leagueHero')[0].addEventListener('click', () => {
                    if (leagueHeroLock == 0) {
                        localStorage.setItem('HHS.leagueHeroLock', 1);
                        leagueHeroLock = 1;
                        $('.data-list .head-row').after($('.data-list .player-row'));
                        $('.lock_leagueHero').removeClass('unlock');
                        $('.lock_leagueHero').addClass('lock');
                        $('.data-list').addClass('lock_hero');
                    }
                    else if (leagueHeroLock == 1) {
                        localStorage.setItem('HHS.leagueHeroLock', 0);
                        leagueHeroLock = 0;
                        $('.lock_leagueHero').removeClass('lock');
                        $('.lock_leagueHero').addClass('unlock');
                        $('.data-list').removeClass('lock_hero');
                    }
                });

                //CSS
                sheet.insertRule(`.lock_leagueHero {
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    background-size: 30px;
                    background-repeat: no-repeat;}`
                );

                sheet.insertRule(`.lock {
                    background-image: url(https://cdn-icons-png.flaticon.com/64/456/456112.png);}`
                );

                sheet.insertRule(`.unlock {
                    background-image: url(https://cdn-icons-png.flaticon.com/64/880/880779.png);}`
                );

                sheet.insertRule(`${mediaDesktop} {
                        #leagues .league_content .league_table .data-list.lock_hero .data-row.player-row {
                    position: fixed;
                    top: 140px;}}`
                );

                sheet.insertRule(`${mediaMobile} {
                        #leagues .league_content .league_table .data-list.lock_hero .data-row.player-row {
                    position: fixed;
                    top: 168px;}}`
                );

                if ($('#leagues .league_girl:not(.hidden_girl)').length) $('#leagues .league_content .league_table .data-list.lock_hero .data-row.player-row').css('width', '760px');
                else $('#leagues .league_content .league_table .data-list.lock_hero .data-row.player-row').css('width', '980px');

                new MutationObserver(() => {
                    if ($('#leagues .league_girl:not(.hidden_girl)').length) $('#leagues .league_content .league_table .data-list.lock_hero .data-row.player-row').css('width', '760px');
                    else $('#leagues .league_content .league_table .data-list.lock_hero .data-row.player-row').css('width', '980px');
                }).observe($('#leagues .league_girl')[0], {attributes: true})

                sheet.insertRule(`#leagues .league_content .league_table .data-list.lock_hero {
                    padding-top: 69px;}`
                );
            }

            //Save results of the league
            function saveVictories() {
                let leagueDateInit = (DST == true) ? 11*3600 : 12*3600;

                let current_date_ts = Math.floor(new Date().getTime()/1000);
                let date_end_league = leagueDateInit + Math.ceil((current_date_ts - leagueDateInit)/604800)*604800;

                let time_results = localStorage.getItem('HHS.leagueTime');
                if (!time_results) {
                    time_results = date_end_league;
                    localStorage.setItem('HHS.leagueTime', time_results);
                }
                //Next Thursday after  change to DST at 12:00 UTC (14:00 Paris time)
                if (time_results == NonDSTtoDST_leagueTime) {
                    time_results = NonDSTtoDST_leagueTime - 3600;
                    localStorage.setItem('HHS.leagueTime', time_results);
                }

                //Next Thursday after change to non-DST at 11:00 UTC (12:00 Paris time)
                if (time_results == DSTtoNonDST_leagueTime) {
                    time_results = DSTtoNonDST_leagueTime + 3600;
                    localStorage.setItem('HHS.leagueTime', time_results);
                }

                if (current_date_ts > time_results) {
                    localStorage.setItem('HHS.oldLeagueTime', localStorage.getItem('HHS.leagueTime'));
                    localStorage.setItem('HHS.oldLeaguePlayers', localStorage.getItem('HHS.leaguePlayers'));
                    localStorage.setItem('HHS.oldLeagueScore', localStorage.getItem('HHS.leagueScore'));
                    localStorage.setItem('HHS.oldLeagueVictories', localStorage.getItem('HHS.leagueVictories'));
                    localStorage.setItem('HHS.oldLeagueDefeats', localStorage.getItem('HHS.leagueDefeats'));
                    localStorage.setItem('HHS.oldLeagueLvl', localStorage.getItem('HHS.leagueLvl'));
                    localStorage.setItem('HHS.leagueTime', date_end_league);
                    localStorage.removeItem('HHS.leagueScore');
                    localStorage.removeItem('HHS.reflectLeaguePlayers');
                    localStorage.removeItem('HHS.stunLeaguePlayers');
                    localStorage.removeItem('HHS.shieldLeaguePlayers');
                    localStorage.removeItem('HHS.executeLeaguePlayers');
                    localStorage.removeItem('HHS.LEAGUE_FAVORITES');
                }

                calculateVictories();
            }

            function calculateVictories() {
                let nb_opponents = $('.body-row:not(.player-row)').length ;
                localStorage.setItem('HHS.leaguePlayers', nb_opponents);

                let tot_victory = $('.body-row .data-column .result.won').length ;
                localStorage.setItem('HHS.leagueVictories', tot_victory);
                let tot_defeat = $('.body-row .data-column .result.lost').length ;
                localStorage.setItem('HHS.leagueDefeats', tot_defeat);
                let tot_notPlayed = 3*nb_opponents - tot_victory - tot_defeat;

                let lvl_data = Array.from($('.body-row .data-column[column="level"]'));
                let lvl = Array.from(lvl_data, (el) => parseInt(el.innerText, 10));
                let lvl_min = Math.min(...lvl);
                let lvl_max = Math.max(...lvl);

                let lvl_sum = 0;
                lvl.forEach((el) => lvl_sum += el);
                let lvl_avg = parseInt(lvl_sum / lvl.length, 10);

                localStorage.setItem('HHS.leagueLvl', JSON.stringify({min: lvl_min, max: lvl_max, avg: lvl_avg}));

                $('span.possibleChallenges span.scriptLeagueInfoTooltip.possibleChallengesTooltip').append(
                    `<span id="leagueStats"><u>${labels.current_league}</u><BR>
                    <BR>${labels.opponents} : ${nb_opponents}
                    <BR>${window.GT.design.level_range} : ${lvl_min} ... [${lvl_avg}] ... ${lvl_max}
                    <BR>${labels.victories} : ${tot_victory} / ${3*nb_opponents}
                    <BR>${labels.defeats} : ${tot_defeat} / ${3*nb_opponents}
                    <BR>${labels.notPlayed} : ${tot_notPlayed} / ${3*nb_opponents}
                    </span>`
                );

                let old_nb_opponents = localStorage.getItem('HHS.oldLeaguePlayers') || 0;
                let old_lvl_min = localStorage.getItem('HHS.oldLeagueLvl') ? JSON.parse(localStorage.getItem('HHS.oldLeagueLvl')).min : 0;
                let old_lvl_max = localStorage.getItem('HHS.oldLeagueLvl') ? JSON.parse(localStorage.getItem('HHS.oldLeagueLvl')).max : 0;
                let old_lvl_avg = localStorage.getItem('HHS.oldLeagueLvl') ? JSON.parse(localStorage.getItem('HHS.oldLeagueLvl')).avg : 0;
                let old_score = JSON.parse(localStorage.getItem('HHS.oldLeagueScore')) || {};
                let old_tot_victory = localStorage.getItem('HHS.oldLeagueVictories') ? localStorage.getItem('HHS.oldLeagueVictories') : 0;
                let old_tot_defeat = localStorage.getItem('HHS.oldLeagueDefeats') ? localStorage.getItem('HHS.oldLeagueDefeats') : 0;
                let old_tot_notPlayed = 3*old_nb_opponents - old_tot_victory - old_tot_defeat;
                let old_points = old_score.points || 0;
                let old_avg = old_score.avg || 0;

                const options = {year: 'numeric', month: 'short', day: 'numeric'};
                let old_date_end_league = new Date(localStorage.getItem('HHS.oldLeagueTime')*1000).toLocaleDateString(undefined, options);

                if (localStorage.getItem('HHS.oldLeagueTime')) {
                    $('span.possibleChallenges span.scriptLeagueInfoTooltip.possibleChallengesTooltip').append(
                        `<span id="oldLeagueStats"><BR>_______________________
                        <BR><BR>${labels.league_finished}${old_date_end_league} <BR>
                        <BR>${labels.opponents} : ${old_nb_opponents}
                        <BR>${window.GT.design.level_range} : ${old_lvl_min} ... [${old_lvl_avg}] ... ${old_lvl_max}
                        <BR>${labels.victories} : ${old_tot_victory} / ${3*old_nb_opponents}
                        <BR>${labels.defeats} : ${old_tot_defeat} / ${3*old_nb_opponents}
                        <BR>${labels.notPlayed} : ${old_tot_notPlayed} / ${3*old_nb_opponents}
                        <BR>${labels.leaguePoints} : ${nThousand(old_points)}
                        <BR>${labels.avg} : ${nThousand(old_avg)}
                        </span>`
                    );
                }
            }

            saveVictories();
            displayLeaguePlayersInfo();
            favoriteOpponents();
            leagueFilter();
            sortLeagueTeamPower();
            sortLeagueBoostersTimer();
            stripedLeague();
            if ($('.data-row.player-row.pinned').length == 0) lockHeroRow();
            if($('.data-column[column="player_pin"]').length > 0) $('.data-column[column="player_pin"]').remove();

            let observeCallback = () => {
                displayLeaguePlayersInfo();
                favoriteOpponents();
                filterOpponents();
                stripedLeague();
                if ($('.data-row.player-row.pinned').length == 0) lockHeroRow();
                if($('.data-column[column="player_pin"]').length > 0) $('.data-column[column="player_pin"]').remove();
            }

            let childrenObserved = $('.data-row.head-row')[0].children;
            for (let child of childrenObserved) {
                if(child.attributes.column.nodeValue != "team") child.addEventListener('click', () => {observeCallback()});
            }

            //CSS
            $($('.record_league')[0]).css('position', 'relative');
            $($('.record_league')[0]).css('left', '-14px');

            $($('.record_league')[1]).css('position', 'relative');
            $($('.record_league')[1]).css('left', '1px');
        }
    }
}

function moduleLeagueOpponentsShortcut() {
    let opponents_id = JSON.parse(localStorage.getItem('HHS.leagueOppId'));
    const current_id = window.location.href.substring(window.location.href.indexOf('=') + 1);
    const previous_id = opponents_id[(opponents_id.length + opponents_id.indexOf(current_id) - 1) % (opponents_id.length)];
    const next_id = opponents_id[(opponents_id.indexOf(current_id) + 1) % (opponents_id.length)];

    $('.battle-buttons-row').prepend(`<a href="${transformNutakuURL(`/leagues-pre-battle.html?id_opponent=${previous_id}`)}" class="back_button_s" id="previous_league_opp"></a>`);
    $('.battle-buttons-row').append(`<a href="${transformNutakuURL(`/leagues-pre-battle.html?id_opponent=${next_id}`)}" class="back_button_s" id="next_league_opp"></a>`);

    //CSS
    sheet.insertRule(`#previous_league_opp, #next_league_opp {
        position: relative;
        background-size: 38px;
        background-position: center;
        background-repeat: no-repeat;}`
    );

    sheet.insertRule(`#previous_league_opp {
        background-image: url(https://cdn-icons-png.flaticon.com/64/2879/2879564.png);}`
    );

    sheet.insertRule(`#next_league_opp {
        background-image: url(https://cdn-icons-png.flaticon.com/64/2879/2879593.png);}`
    );

    sheet.insertRule(`#pre-battle.leagues-battle .middle-container .battle-buttons-row {
        width: 106%;
        margin-left: -16px;
        justify-content: space-evenly;}`
    );
}

function moduleHideLeaguex3Button() {
    $('.league-multiple-battle-button').remove();
}

/* ============
	LEAGUE SIM
   ============ */

function moduleLeagueSim() {
    function calculatePower() {
        let playerAtk = window.hero_data.damage;
        let playerEgo = window.hero_data.remaining_ego;
        let playerDef = window.hero_data.defense;
        let playerCrit = window.hero_data.chance;

        let playerElements = [];
        window.hero_data.team.theme_elements.forEach((el) => playerElements.push(el.type));

        const playerBonuses = {
            critDamage: window.hero_data.team.synergies.find(({element: {type}})=>type == 'fire').bonus_multiplier,
            critChance: window.hero_data.team.synergies.find(({element: {type}})=>type == 'stone').bonus_multiplier,
            defReduce: window.hero_data.team.synergies.find(({element: {type}})=>type == 'sun').bonus_multiplier,
            healOnHit: window.hero_data.team.synergies.find(({element: {type}})=>type == 'water').bonus_multiplier
        };

        let opponentAtk = window.opponent_fighter.player.damage;
        let opponentEgo = window.opponent_fighter.player.remaining_ego;
        let opponentDef = window.opponent_fighter.player.defense;
        let opponentCrit = window.opponent_fighter.player.chance;

        let opponentElements = [];
        window.opponent_fighter.player.team.theme_elements.forEach((el) => opponentElements.push(el.type));

        const opponentBonuses = {
            critDamage: window.opponent_fighter.player.team.synergies.find(({element: {type}})=>type == 'fire').bonus_multiplier,
            critChance: window.opponent_fighter.player.team.synergies.find(({element: {type}})=>type == 'stone').bonus_multiplier,
            defReduce: window.opponent_fighter.player.team.synergies.find(({element: {type}})=>type == 'sun').bonus_multiplier,
            healOnHit: window.opponent_fighter.player.team.synergies.find(({element: {type}})=>type == 'water').bonus_multiplier
        };

        const dominanceBonuses = calculateDominationBonuses(playerElements, opponentElements);

        let player = {
            hp: playerEgo,
            atk: playerAtk,
            adv_def: opponentDef,
            critchance: calculateCritChanceShare(playerCrit, opponentCrit) + dominanceBonuses.player.chance + playerBonuses.critChance,
            bonuses: playerBonuses,
            tier4: calculateTier4SkillValue(window.hero_data.team.girls),
            tier5: calculateTier5SkillValue(window.hero_data.team.girls)
        };

        let opponent = {
            hp: opponentEgo,
            atk: opponentAtk,
            adv_def: playerDef,
            critchance: calculateCritChanceShare(opponentCrit, playerCrit) + dominanceBonuses.opponent.chance + opponentBonuses.critChance,
            name: window.opponent_fighter.player.nickname,
            bonuses: opponentBonuses,
            tier4: calculateTier4SkillValue(window.opponent_fighter.player.team.girls),
            tier5: calculateTier5SkillValue(window.opponent_fighter.player.team.girls)
        };

        //Display tier 5 skill
        //Player team
        if ([11, 12, 13, 14].some(index => window.hero_data.team.girls[0].skills[index])) {
            const skill5_girl = window.hero_data.team.girls[0].skills;
            //Stun
            if (!(skill5_girl[11] == undefined))
                $('#pre-battle .player_team_block.battle_hero .icon-area').after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[11].skill.skill_type}/${skill5_girl[11].skill.display_value_text}</span>`)
            //Shield
            else if (!(skill5_girl[12] == undefined))
                $('#pre-battle .player_team_block.battle_hero .icon-area').after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[12].skill.skill_type}/${skill5_girl[12].skill.display_value_text}</span>`)
            //Reflect
            else if (!(skill5_girl[13] == undefined))
                $('#pre-battle .player_team_block.battle_hero .icon-area').after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[13].skill.skill_type}/${skill5_girl[13].skill.display_value_text}</span>`)
            //Execute
            else if (!(skill5_girl[14] == undefined))
                $('#pre-battle .player_team_block.battle_hero .icon-area').after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[14].skill.skill_type}/${skill5_girl[14].skill.display_value_text}</span>`)
        }

        //Opponent team
        if ([11, 12, 13, 14].some(index => window.opponent_fighter.player.team.girls[0].skills[index])) {
            const skill5_girl = window.opponent_fighter.player.team.girls[0].skills;
            //Stun
            if (!(skill5_girl[11] == undefined))
                $('#pre-battle .player_team_block.opponent .icon-area').after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[11].skill.skill_type}/${skill5_girl[11].skill.display_value_text}</span>`);
            //Shield
            else if (!(skill5_girl[12] == undefined))
                $('#pre-battle .player_team_block.opponent .icon-area').after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[12].skill.skill_type}/${skill5_girl[12].skill.display_value_text}</span>`);
            //Reflect
            else if (!(skill5_girl[13] == undefined))
                $('#pre-battle .player_team_block.opponent .icon-area').after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[13].skill.skill_type}/${skill5_girl[13].skill.display_value_text}</span>`);
            //Execute
            else if (!(skill5_girl[14] == undefined))
                $('#pre-battle .player_team_block.opponent .icon-area').after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[14].skill.skill_type}/${skill5_girl[14].skill.display_value_text}</span>`);
        }

        const {points: calc, win, scoreClass} = calculateBattleProbabilities(player, opponent);

        let probabilityTooltip = `<table class='probabilityTable'>`;
        let expectedValue = 0;
        const pointGrade=['#fff','#fff','#fff','#ff2f2f','#fe3c25','#fb4719','#f95107','#f65b00','#f26400','#ed6c00','#e97400','#e37c00','#de8400','#d88b00','#d19100','#ca9800','#c39e00','#bba400','#b3aa00','#aab000','#a1b500','#97ba00','#8cbf00','#81c400','#74c900','#66cd00'];
        for (let i=25; i>=3; i--) {
            if (calc[i] >= 0.0001) {
                const isW = i>=15
                probabilityTooltip += `<tr style='color:${isW?pointGrade[25]:pointGrade[3]};' data-tint='${isW?'w':'l'}'><td>${i}</td><td>${nRounding(100*calc[i], 2, -1)}%</td></tr>`;
                expectedValue += i*calc[i];
            }
        }
        probabilityTooltip += `<tr class='${scoreClass}'><td>${window.GT.design.leagues_won_letter}</td><td>${nRounding(100*win, 2, -1)}%</td></tr>`;
        probabilityTooltip += '</table>';

        const $rating = $(`<div class="matchRating" tooltip="" style="color:${pointGrade[Math.round(expectedValue)]};" hh_title="${probabilityTooltip}">${nRounding(100*win, 2, -1)}% / ${nRounding(expectedValue, 3, -1)}</div>`)
        $('#pre-battle .player_team_block.opponent .average-lvl').after($rating);
    }

    calculatePower();

    //CSS
    sheet.insertRule(`.matchRating {
        text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000;
        font-size: 18px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .matchRating {
        text-align: center;
        line-height: 25px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .matchRating {
        margin-left: 15px;
        margin-top: 15px;
        line-height: 10px;}}`
    );

    sheet.insertRule(`.probabilityTable tr {
        line-height: 16px;
        color: #fff;}`
    );

    sheet.insertRule(`.probabilityTable tr:nth-of-type(odd) {
        background-color: rgba(0,0,0,0.2);}`
    );

    sheet.insertRule(`.probabilityTable tr:nth-of-type(even)[data-tint=w] {
        background-color: #66cd0028;}`
    );

    sheet.insertRule(`.probabilityTable tr:nth-of-type(even)[data-tint=l] {
        background-color: #ff2f2f28;}`
    );

    sheet.insertRule(`.probabilityTable .plus {
        color: #66CD00;}`
    );

    sheet.insertRule(`.probabilityTable .minus {
        color: #FF2F2F;}`
    );

    sheet.insertRule(`.probabilityTable .close {
        color: #FFA500;}`
    );

    sheet.insertRule(`.winProb {
        text-align: center;
        text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000;
        line-height: 17px;
        font-size: 16px;}`
    );

    sheet.insertRule(`.tier5_skill {
        position: relative;
        margin-bottom: -22px;
        bottom: 26px;
        left: 75px;}`
    );

    sheet.insertRule(`.tier5_skill > .active_skills_icn {
        position: absolute;
        bottom: 25px;}`
    );

    sheet.insertRule(`.battle_hero .sim-result.sim-right {
        margin-left: 90% !important;}`
    );
}

function calculateDominationBonuses(playerElements, opponentElements) {
    const bonuses = {
        player: {
            ego: 0,
            attack: 0,
            chance: 0
        },
        opponent: {
            ego: 0,
            attack: 0,
            chance: 0
        }
    };

    [
        {a: playerElements, b: opponentElements, k: 'player'},
        {a: opponentElements, b: playerElements, k: 'opponent'}
    ].forEach(({a,b,k})=>{
        a.forEach(element => {
            if (ELEMENTS.egoDamage[element] && b.includes(ELEMENTS.egoDamage[element])) {
                bonuses[k].ego += 0.1
                bonuses[k].attack += 0.1
            }
            if (ELEMENTS.chance[element] && b.includes(ELEMENTS.chance[element])) {
                bonuses[k].chance += 0.2
            }
        })
    })
    return bonuses
}

function countElementsInTeam(elements) {
    return elements.reduce((a,b)=>{a[b]++;return a}, {
        fire: 0,
        stone: 0,
        sun: 0,
        water: 0,
        nature: 0,
        darkness: 0,
        light: 0,
        psychic: 0
    })
}

function calculateCritChanceShare(ownHarmony, otherHarmony) {
    return 0.3*ownHarmony/(ownHarmony+otherHarmony)
}

function calculateTier4SkillValue(teamGirlsArray) {
    let skill_tier_4 = {dmg: 0, def: 0};

    teamGirlsArray.forEach((girl) => {
        if (girl.skills[9]) skill_tier_4.dmg += girl.skills[9].skill.percentage_value/100;
        if (girl.skills[10]) skill_tier_4.def += girl.skills[10].skill.percentage_value/100;
    })
    return skill_tier_4;
}

function calculateTier5SkillValue(teamGirlsArray) {
    let skill_tier_5 = {id: 0, value: 0};
    const girl = teamGirlsArray[0];

    tier5_Skill_Id.forEach((id) => {
        if (girl.skills[id]) {
            skill_tier_5.id = id;
            skill_tier_5.value = (id == 11) ? parseInt(girl.skills[id].skill.display_value_text, 10)/100 : girl.skills[id].skill.percentage_value/100;
        }
    })
    return skill_tier_5;
}

function calculateBattleProbabilities(player, opponent) {
    this.player = player;
    this.opponent = opponent

    const setup = x => {
        x.critMultiplier = 2 + x.bonuses.critDamage;
        x.hp = Math.ceil(x.hp);
    }

    setup(this.player);
    setup(this.opponent);

    this.player.playerShield = (this.player.tier5.id == 12) ? this.player.tier5.value * player.hp : 0;
    this.opponent.opponentShield = 0;

    this.player.stunned =  0;
    this.player.alreadyStunned = 0;
    this.opponent.stunned =  (this.player.tier5.id == 11) ? 2 : 0;
    this.opponent.alreadyStunned = 0;

    this.player.reflect =  (this.player.tier5.id == 13) ? 2 : 0;
    this.opponent.reflect =  0;

    let ret;
    try {
        //Start simulation from player's turn
        ret = playerTurn(this.player.hp, this.opponent.hp, this.player.playerShield, this.opponent.opponentShield, this.player.stunned, this.opponent.stunned, this.player.reflect, this.opponent.reflect, 1);
    } catch(error) {
        return {
            points: [],
            win: Number.NaN,
            loss: Number.NaN,
            scoreClass: 'minus'
        };
    }

    const sum = ret.win + ret.loss;
    ret.win /= sum;
    ret.loss /= sum;
    ret.scoreClass = (ret.win > 0.9) ? 'plus' : (ret.win < 0.5) ? 'minus' : 'close';

    return ret;

    function calculateDmg(x, turns) {
        const dmg = x.atk * (1 + x.tier4.dmg) ** turns - x.adv_def * (1 + x.tier4.def) ** turns;

        return {
            baseAtk : {
                probability: 1 - x.critchance,
                damageAmount: Math.ceil(dmg)
            },
            critAtk : {
                probability: x.critchance,
                damageAmount: Math.ceil(dmg * x.critMultiplier)
            }
        }
    }

    function mergeResult(x, xProbability, y, yProbability) {
        const points = {};
        Object.entries(x.points).map(([point, probability]) => [point, probability * xProbability])
            .concat(Object.entries(y.points).map(([point, probability]) => [point, probability * yProbability]))
            .forEach(([point, probability]) => {
            points[point] = (points[point] || 0) + probability
        });
        const merge = (x, y) => x * xProbability + y * yProbability;
        const win = merge(x.win, y.win);
        const loss = merge(x.loss, y.loss);

        return { points, win, loss };
    }

    function playerTurn(playerHP, opponentHP, playerShield, opponentShield, playerStunned, opponentStunned, playerReflect, opponentReflect, turns) {
        //Avoid a stack overflow
        const maxAllowedTurns = 50;
        if (turns > maxAllowedTurns) throw new Error();

        //Simulate base attack and critical attack
        const {baseAtk, critAtk} = calculateDmg(this.player, turns);
        const baseAtkResult = playerAttack(playerHP, opponentHP, playerShield, opponentShield, playerStunned, opponentStunned, playerReflect, opponentReflect, baseAtk, turns);
        const critAtkResult = playerAttack(playerHP, opponentHP, playerShield, opponentShield, playerStunned, opponentStunned, playerReflect, opponentReflect, critAtk, turns);

        //Merge result
        const mergedResult = mergeResult(baseAtkResult, baseAtk.probability, critAtkResult, critAtk.probability);
        return mergedResult;
    }

    function playerAttack(playerHP, opponentHP, playerShield, opponentShield, playerStunned, opponentStunned, playerReflect, opponentReflect, attack, turns) {
        //Player stunned
        if (playerStunned > 0) {
            playerStunned -= 1;

            //Opponent attack
            return opponentTurn(playerHP, opponentHP, playerShield, opponentShield, playerStunned, opponentStunned, playerReflect, opponentReflect, turns);
        }

        //Damage
        let playerDamage = Math.max(0, (attack.damageAmount - opponentShield));
        opponentHP -= playerDamage;
        opponentShield = Math.max(0, opponentShield - attack.damageAmount);

        //Tier 5 skill : Player Execute
        if (this.player.tier5.id == 14) {
            let opponentHPRate = opponentHP / this.opponent.hp;
            if (opponentHPRate <= this.player.tier5.value) opponentHP = 0;
        }

        //Tier 5 skill : Opponent Reflect
        let opponentReflectDmg = (opponentReflect > 0 && opponentHP > 0) ? Math.ceil(this.opponent.tier5.value * attack.damageAmount) : 0;
        playerHP -= Math.max(0, (opponentReflectDmg - playerShield));
        playerShield = Math.max(0, playerShield - opponentReflectDmg);
        opponentReflect -= 1;

        //Heal on hit
        let playerHeal = Math.ceil(this.player.bonuses.healOnHit * playerDamage);
        playerHP = Math.min(this.player.hp, playerHP + playerHeal);

        //Check win
        if (opponentHP <= 0) {
            const point = Math.min(25, 15 + Math.ceil(10 * playerHP / this.player.hp));
            return { points: { [point]: 1 }, win: 1, loss: 0 };
        }
        else {
            //Opponent attack
            return opponentTurn(playerHP, opponentHP, playerShield, opponentShield, playerStunned, opponentStunned, playerReflect, opponentReflect, turns);
        }
    }

    function opponentTurn(playerHP, opponentHP, playerShield, opponentShield, playerStunned, opponentStunned, playerReflect, opponentReflect, turns) {
        if (turns == 1) {
            playerStunned = (this.opponent.tier5.id == 11) ? 2 : 0;
            opponentShield = (this.opponent.tier5.id == 12) ? (this.opponent.tier5.value * this.opponent.hp) : 0;
            opponentReflect = (this.opponent.tier5.id == 13) ? 2 : 0;
        }

        //Simulate base attack and critical attack
        const {baseAtk, critAtk} = calculateDmg(this.opponent, turns);
        const baseAtkResult = opponentAttack(playerHP, opponentHP, playerShield, opponentShield, playerStunned, opponentStunned, playerReflect, opponentReflect, baseAtk, turns);
        const critAtkResult = opponentAttack(playerHP, opponentHP, playerShield, opponentShield, playerStunned, opponentStunned, playerReflect, opponentReflect, critAtk, turns);

        //Merge result
        const mergedResult = mergeResult(baseAtkResult, baseAtk.probability, critAtkResult, critAtk.probability);
        return mergedResult;
    }

    function opponentAttack(playerHP, opponentHP, playerShield, opponentShield, playerStunned, opponentStunned, playerReflect, opponentReflect, attack, turns) {
        //Opponent stunned
        if (opponentStunned > 0) {
            opponentStunned -= 1;

            //Next turn
            turns += 1;
            return playerTurn(playerHP, opponentHP, playerShield, opponentShield, playerStunned, opponentStunned, playerReflect, opponentReflect, turns);
        }

        //Damage
        let opponentDamage = Math.max(0, (attack.damageAmount - playerShield));
        playerHP -= opponentDamage;
        playerShield = Math.max(0, playerShield - attack.damageAmount);

        //Tier 5 skill : Opponent Execute
        if (this.opponent.tier5.id == 14) {
            let playerHPRate = playerHP / this.player.hp;
            if (playerHPRate <= this.opponent.tier5.value) playerHP = 0;
        }

        //Tier 5 skill : Player Reflect
        let playerReflectDmg = (playerReflect > 0 && playerHP > 0) ? Math.ceil(this.player.tier5.value * attack.damageAmount) : 0
        opponentHP -= Math.max(0, (playerReflectDmg - opponentShield));
        opponentShield = Math.max(0, opponentShield - playerReflectDmg);
        playerReflect -= 1;

        //Heal on hit
        let opponentHeal = Math.ceil(this.opponent.bonuses.healOnHit * opponentDamage);
        opponentHP = Math.min(this.opponent.hp, opponentHP + opponentHeal);

        //Check loss
        if (playerHP <= 0) {
            const point = Math.max(3, 3 + Math.ceil(10 * (this.opponent.hp - opponentHP) / this.opponent.hp));
            return { points: { [point]: 1 }, win: 0, loss: 1 };
        }
        else {
            //Next turn
            turns += 1;
            return playerTurn(playerHP, opponentHP, playerShield, opponentShield, playerStunned, opponentStunned, playerReflect, opponentReflect, turns);
        }
    }
}

/* ============
	SEASON SIM
   ============ */

function moduleSeasonSim() {
    function calculateSeasonPower(idOpponent) {
        //INIT
        let playerAtk = window.hero_data.damage;
        let playerEgo = window.hero_data.remaining_ego;
        let playerDef = window.hero_data.defense;
        let playerCrit = window.hero_data.chance;

        let playerElements = [];
        window.hero_data.team.theme_elements.forEach((el) => playerElements.push(el.type));

        const playerBonuses = {
            critDamage: window.hero_data.team.synergies.find(({element: {type}})=>type == 'fire').bonus_multiplier,
            critChance: window.hero_data.team.synergies.find(({element: {type}})=>type == 'stone').bonus_multiplier,
            defReduce: window.hero_data.team.synergies.find(({element: {type}})=>type == 'sun').bonus_multiplier,
            healOnHit: window.hero_data.team.synergies.find(({element: {type}})=>type == 'water').bonus_multiplier
        };

        let opponentAtk = window.opponents[idOpponent].player.damage;
        let opponentEgo = window.opponents[idOpponent].player.remaining_ego;
        let opponentDef = window.opponents[idOpponent].player.defense;
        let opponentCrit = window.opponents[idOpponent].player.chance;

        let opponentElements = [];
        window.opponents[idOpponent].player.team.theme_elements.forEach((el) => opponentElements.push(el.type));

        const opponentBonuses = {
            critDamage: window.opponents[idOpponent].player.team.synergies.find(({element: {type}})=>type == 'fire').bonus_multiplier,
            critChance: window.opponents[idOpponent].player.team.synergies.find(({element: {type}})=>type == 'stone').bonus_multiplier,
            defReduce: window.opponents[idOpponent].player.team.synergies.find(({element: {type}})=>type == 'sun').bonus_multiplier,
            healOnHit: window.opponents[idOpponent].player.team.synergies.find(({element: {type}})=>type == 'water').bonus_multiplier
        };

        const dominanceBonuses = calculateDominationBonuses(playerElements, opponentElements);

        let player = {
            hp: playerEgo,
            atk: playerAtk,
            adv_def: opponentDef,
            critchance: calculateCritChanceShare(playerCrit, opponentCrit) + dominanceBonuses.player.chance + playerBonuses.critChance,
            bonuses: playerBonuses,
            tier4: calculateTier4SkillValue(window.hero_data.team.girls),
            tier5: calculateTier5SkillValue(window.hero_data.team.girls)
        };

        let opponent = {
            hp: opponentEgo,
            atk: opponentAtk,
            adv_def: playerDef,
            critchance: calculateCritChanceShare(opponentCrit, playerCrit) + dominanceBonuses.opponent.chance + opponentBonuses.critChance,
            name: window.opponents[idOpponent].player.nickname,
            bonuses: opponentBonuses,
            tier4: calculateTier4SkillValue(window.opponents[idOpponent].player.team.girls),
            tier5: calculateTier5SkillValue(window.opponents[idOpponent].player.team.girls)
        };

        //Display tier 5 skill
        //Player team
        if ([11, 12, 13, 14].some(index => window.hero_data.team.girls[0].skills[index])) {
            const skill5_girl = window.hero_data.team.girls[0].skills;
            $('#season-arena .player_team_block.battle_hero .tier5_skill').remove();
            //Stun
            if (!(skill5_girl[11] == undefined))
                $('#season-arena .player_team_block.battle_hero .icon-area').after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[11].skill.skill_type}/${skill5_girl[11].skill.display_value_text}</span>`);
            //Shield
            else if (!(skill5_girl[12] == undefined))
                $('#season-arena .player_team_block.battle_hero .icon-area').after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[12].skill.skill_type}/${skill5_girl[12].skill.display_value_text}</span>`);
            //Reflect
            else if (!(skill5_girl[13] == undefined))
                $('#season-arena .player_team_block.battle_hero .icon-area').after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[13].skill.skill_type}/${skill5_girl[13].skill.display_value_text}</span>`);
            //Execute
            else if (!(skill5_girl[14] == undefined))
                $('#season-arena .player_team_block.battle_hero .icon-area').after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[14].skill.skill_type}/${skill5_girl[14].skill.display_value_text}</span>`);
        }

        //Opponent team
        if ([11, 12, 13, 14].some(index => window.opponents[idOpponent].player.team.girls[0].skills[index])) {
            const skill5_girl = window.opponents[idOpponent].player.team.girls[0].skills;
            $(`#season-arena .opponents_arena .season_arena_opponent_container.opponent-${idOpponent} .tier5_skill`).remove();
            //Stun
            if (!(skill5_girl[11] == undefined))
                $(`#season-arena .opponents_arena .season_arena_opponent_container.opponent-${idOpponent} .icon-area`).after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[11].skill.skill_type}/${skill5_girl[11].skill.display_value_text}</span>`)
            //Shield
            else if (!(skill5_girl[12] == undefined))
                $(`#season-arena .opponents_arena .season_arena_opponent_container.opponent-${idOpponent} .icon-area`).after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[12].skill.skill_type}/${skill5_girl[12].skill.display_value_text}</span>`)
            //Reflect
            else if (!(skill5_girl[13] == undefined))
                $(`#season-arena .opponents_arena .season_arena_opponent_container.opponent-${idOpponent} .icon-area`).after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[13].skill.skill_type}/${skill5_girl[13].skill.display_value_text}</span>`)
            //Execute
            else if (!(skill5_girl[14] == undefined))
                $(`#season-arena .opponents_arena .season_arena_opponent_container.opponent-${idOpponent} .icon-area`).after(
                    `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[14].skill.skill_type}/${skill5_girl[14].skill.display_value_text}</span>`)
        }

        const simu = calculateBattleProbabilities(player, opponent);

        $(`#season-arena .opponents_arena .season_arena_opponent_container.opponent-${idOpponent} .matchRating`).remove();
        $(`#season-arena .opponents_arena .season_arena_opponent_container.opponent-${idOpponent} .average-lvl`).before(
            `<span class="matchRating ${simu.scoreClass}">${nRounding(100*simu.win, 2, -1)}%</span>`);
    }

    calculateSeasonPower(0);
    calculateSeasonPower(1);
    calculateSeasonPower(2);

    const observer = new MutationObserver(() => {calculateSeasonPower(0);
                                                 calculateSeasonPower(1);
                                                 calculateSeasonPower(2);});
    observer.observe($('#season-arena .opponents_arena')[0], {subtree: true, attributes: true, attributeFilter: ['class']})

    //Add opponent profile link
    Array.from($('.season_arena_opponent_container')).forEach((opponent) => {
        $(opponent).find('.personal_info').attr('onclick', `shared.general.hero_page_popup({ id: ${$(opponent).attr('data-opponent')}, profile_fallback: true })`)
    })

    //Sort opponents by sim results and mojo
    if (loadSetting('seasonFightsSort')) {
        function compare(a, b) {
            if (a.rate < b.rate) return -1;
            else if (a.rate > b.rate) return 1;
            else {
                if (a.mojo < b.mojo) return -1;
                else if (a.mojo > b.mojo) return 1;
                else return 0;
            }
        }

        let opps = [];
        [0, 1, 2].forEach((i) => {opps.push({index: i, mojo: parseInt($('.slot_victory_points .amount')[i].textContent, 10), rate: parseFloat($('.matchRating')[i].textContent.replace(',', '.'), 10)})})

        opps.sort(compare);
        opps.forEach((opp) => {$('.round_blue_button.position_top_right').after($(`.season_arena_opponent_container.opponent-${opp.index}`))});
    }

    //CSS
    sheet.insertRule(`.matchRating {
        position: relative;
        top: -23px;
        left: -70px;
        text-align: center;
        margin-left: 10px;
        text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000;
        line-height: 17px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .matchRating {
        font-size: 16px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .matchRating {
        font-size: 22px;}}`
    );

    sheet.insertRule(`.plus {
        color: #66CD00;}`
    );

    sheet.insertRule(`.minus {
        color: #FF2F2F;}`
    );

    sheet.insertRule(`.close {
        color: #FFA500;}`
    );

    sheet.insertRule(`${mediaMobile} {
            #season-arena .hero_team .team-hexagon-container .average-lvl {
        margin-left: -15px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #season-arena .hero_team .team-hexagon-container .average-lvl {
        margin-left: -15px;}}`
    );

    sheet.insertRule(`.player_team_block.opponent .player-team .average-lvl {
        margin-top: -1rem;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .player_team_block.opponent .player-team .average-lvl {
        font-size: 1rem;}`
    );

    sheet.insertRule(`.tier5_skill {
        position: relative;
        margin-bottom: -22px;
        bottom: 26px;
        left: 67px;}`
    );

    sheet.insertRule(`.tier5_skill > .active_skills_icn {
        position: absolute;
        bottom: 25px;}`
    );
}

/* ====================
	BATTLE SIMULATION
   ==================== */

function moduleBattleSim() {
    // INIT
    let playerAtk = window.hero_data.damage;
    let playerEgo = window.hero_data.remaining_ego;
    let playerDef = window.hero_data.defense;
    let playerCrit = window.hero_data.chance;

    let playerElements = [];
    window.hero_data.team.theme_elements.forEach((el) => playerElements.push(el.type));

    const playerBonuses = {
        critDamage: window.hero_data.team.synergies.find(({element: {type}})=>type == 'fire').bonus_multiplier,
        critChance: window.hero_data.team.synergies.find(({element: {type}})=>type == 'stone').bonus_multiplier,
        defReduce: window.hero_data.team.synergies.find(({element: {type}})=>type == 'sun').bonus_multiplier,
        healOnHit: window.hero_data.team.synergies.find(({element: {type}})=>type == 'water').bonus_multiplier
    };

    let opponentAtk = window.opponent_fighter.player.damage;
    let opponentEgo = window.opponent_fighter.player.remaining_ego;
    let opponentDef = window.opponent_fighter.player.defense;
    let opponentCrit = window.opponent_fighter.player.chance;

    let opponentElements = [];
    window.opponent_fighter.player.team.theme_elements.forEach((el) => opponentElements.push(el.type));

    const opponentBonuses = {
        critDamage: window.opponent_fighter.player.team.synergies.find(({element: {type}})=>type == 'fire').bonus_multiplier,
        critChance: window.opponent_fighter.player.team.synergies.find(({element: {type}})=>type == 'stone').bonus_multiplier,
        defReduce: window.opponent_fighter.player.team.synergies.find(({element: {type}})=>type == 'sun').bonus_multiplier,
        healOnHit: window.opponent_fighter.player.team.synergies.find(({element: {type}})=>type == 'water').bonus_multiplier
    };

    const dominanceBonuses = calculateDominationBonuses(playerElements, opponentElements);

    let player = {
        hp: playerEgo,
        atk: playerAtk,
        adv_def: opponentDef,
        critchance: calculateCritChanceShare(playerCrit, opponentCrit) + dominanceBonuses.player.chance + playerBonuses.critChance,
        bonuses: playerBonuses,
        tier4: calculateTier4SkillValue(window.hero_data.team.girls),
        tier5: calculateTier5SkillValue(window.hero_data.team.girls)
    };

    let opponent = {
        hp: opponentEgo,
        atk: opponentAtk,
        adv_def: playerDef,
        critchance: calculateCritChanceShare(opponentCrit, playerCrit) + dominanceBonuses.opponent.chance + opponentBonuses.critChance,
        name: window.opponent_fighter.player.nickname,
        bonuses: opponentBonuses,
        tier4: calculateTier4SkillValue(window.opponent_fighter.player.team.girls),
        tier5: calculateTier5SkillValue(window.opponent_fighter.player.team.girls)
    };

    //Display tier 5 skill
    //Player team
    if ([11, 12, 13, 14].some(index => window.hero_data.team.girls[0].skills[index])) {
        const skill5_girl = window.hero_data.team.girls[0].skills;
        //Stun
        if (!(skill5_girl[11] == undefined))
            $('#pre-battle .player_team_block.battle_hero .icon-area').after(
                `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[11].skill.skill_type}/${skill5_girl[11].skill.display_value_text}</span>`);
        //Shield
        else if (!(skill5_girl[12] == undefined))
            $('#pre-battle .player_team_block.battle_hero .icon-area').after(
                `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[12].skill.skill_type}/${skill5_girl[12].skill.display_value_text}</span>`);
        //Reflect
        else if (!(skill5_girl[13] == undefined))
            $('#pre-battle .player_team_block.battle_hero .icon-area').after(
                `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[13].skill.skill_type}/${skill5_girl[13].skill.display_value_text}</span>`);
        //Execute
        else if (!(skill5_girl[14] == undefined))
            $('#pre-battle .player_team_block.battle_hero .icon-area').after(
                `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[14].skill.skill_type}/${skill5_girl[14].skill.display_value_text}</span>`);
    }

    //Opponent team
    if ([11, 12, 13, 14].some(index => window.opponent_fighter.player.team.girls[0].skills[index])) {
        const skill5_girl = window.opponent_fighter.player.team.girls[0].skills;
        //Stun
        if (!(skill5_girl[11] == undefined))
            $('#pre-battle .player_team_block.opponent .icon-area').after(
                `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[11].skill.skill_type}/${skill5_girl[11].skill.display_value_text}</span>`);
        //Shield
        else if (!(skill5_girl[12] == undefined))
            $('#pre-battle .player_team_block.opponent .icon-area').after(
                `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[12].skill.skill_type}/${skill5_girl[12].skill.display_value_text}</span>`);
        //Reflect
        else if (!(skill5_girl[13] == undefined))
            $('#pre-battle .player_team_block.opponent .icon-area').after(
                `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[13].skill.skill_type}/${skill5_girl[13].skill.display_value_text}</span>`);
        //Execute
        else if (!(skill5_girl[14] == undefined))
            $('#pre-battle .player_team_block.opponent .icon-area').after(
                `<span class="tier5_skill"><span class="active_skills_icn"></span>${skill5_girl[14].skill.skill_type}/${skill5_girl[14].skill.display_value_text}</span>`);
    }

    const simu = calculateBattleProbabilities(player, opponent);

    $('#pre-battle .player_team_block.opponent .average-lvl')
        .wrap(`<div class="gridWrapper"></div>`)
        .after(`<span class="matchRating ${simu.scoreClass}">${nRounding(100*simu.win, 2, -1)}%</span>`);

    //CSS
    sheet.insertRule(`.plus {
        color: #66CD00;}`
    );

    sheet.insertRule(`.minus {
        color: #FF2F2F;}`
    );

    sheet.insertRule(`.close {
        color: #FFA500;}`
    );

    sheet.insertRule(`.gridWrapper {
        display: inline;
        text-align: center;
        width: 100%;}`
    );

    sheet.insertRule(`.matchRating {
        text-align: center;
        font-size: 16px;
        position: absolute;
        margin-top: -48px;
        margin-left: -120px;}`
    );

    sheet.insertRule(`#pre-battle .fighter-team .team-hexagon-container .average-lvl {
        text-align: center;
        margin-top: 0px;
        line-height: 26px;}`
    );

    sheet.insertRule(`.tier5_skill {
        position: relative;
        margin-bottom: -22px;
        bottom: 26px;
        left: 75px;}`
    );

    sheet.insertRule(`.tier5_skill > .active_skills_icn {
        position: absolute;
        bottom: 25px;}`
    );

    sheet.insertRule(`.battle_hero .sim-result.sim-right {
        margin-left: 90% !important;}`
    );
}

/* ========================================
	TEAMS FILTER (Credit : randomfapper34)
   ======================================== */

function moduleTeamsFilter() {
    let arenaGirls = undefined;
    let girlsData = undefined;

    $(document).ready(() => {
        if (['edit-team', 'add-boss-bang-team', 'waifu'].some(testPage)) {
            arenaGirls = $('.harem-panel-girls .harem-girl-container');
            girlsData = ['waifu'].some(testPage) ? window.girls_data_list : window.availableGirls;
            if (['edit-team', 'add-boss-bang-team'].some(testPage)) {
                $("h3.panel-title").after(`<button id="arena_filter" class="square_blue_btn">${labels.filter}</button>`);
                $("h3.panel-title").after(createFilterBox("default"));
            }
            else {
                $(".change-girl-panel #filter_girls").after(`<button id="arena_filter" class="square_blue_btn">${labels.filter}</button>`);
                $(".waifu-page-container").append(createFilterBox("default"));
            }
            createFilterEvents();
            $(`#reset_button`).click(() => resetFilter());
        }
    });

    function createFilterEvents() {
        $("#arena_filter").on('click', () => {
            if (typeof arenaGirls == 'undefined' || typeof girlsData == 'undefined') return;
            let currentBoxDisplay = $("#arena_filter_box").css('display');
            $("#arena_filter_box").css('display', currentBoxDisplay == "none" ? 'block' : 'none');
        });
        $("#filter_name").get(0).oninput = filterGirls;
        $("#filter_class").on('change', filterGirls);
        $("#filter_element").on('change', filterGirls);
        $("#filter_rarity").on('change', filterGirls);
        $("#filter_aff_category").on('change', filterGirls);
        $("#filter_aff_lvl").on('change', filterGirls);
        $("#filter_blessed_attributes").on('change', filterGirls);
        $("#filter_skills").on('change', filterGirls);
        $("#filter_pose").on('change', filterGirls);
        $("#filter_zodiac").on('change', filterGirls);
        $("#filter_hair").on('change', filterGirls);
        $("#filter_eye").on('change', filterGirls);
    }

    function filterGirls() {
        let filterName = $("#filter_name").get(0).value;
        let nameRegex = new RegExp(filterName, "i");
        let filterClass = $("#filter_class").get(0).selectedIndex;
        let filterElement = $("#filter_element").get(0).value;
        let filterRarity = $("#filter_rarity").get(0).value;
        let filterAffCategory = $("#filter_aff_category").get(0).value;
        let filterAffLvl = $("#filter_aff_lvl").get(0).value;
        let filterBlessedAttributes = $("#filter_blessed_attributes").get(0).value;
        let filterSkills = $("#filter_skills").get(0).value;
        let filterPose = $("#filter_pose").get(0).value;
        let filterZodiac = $("#filter_zodiac").get(0).value;
        let filterHair= $("#filter_hair").get(0).value;
        let filterEye = $("#filter_eye").get(0).value;

        let girlsFiltered = $.map(girlsData, function(girl, index) {
            let matchesName = (girl.name.search(nameRegex) > -1);
            let matchesClass = (girl.class == filterClass) || (filterClass == 0);
            let matchesElement = (girl.element == filterElement) || (filterElement == 'all');
            let matchesRarity = (girl.rarity == filterRarity) || (filterRarity == 'all');
            let matchesAffCategory = (girl.nb_grades == filterAffCategory) || (filterAffCategory == 'all');
            let matchesAffLvl = (girl.graded == filterAffLvl) || (filterAffLvl == 'all');

            let matchesBlessedAttributes;
            switch (filterBlessedAttributes) {
                case 'blessed_attributes':
                    matchesBlessedAttributes = (girl.blessed_attributes != undefined);
                    break;
                case 'non_blessed_attributes':
                    matchesBlessedAttributes = (girl.blessed_attributes == undefined);
                    break;
                case 'all':
                    matchesBlessedAttributes = (filterBlessedAttributes == 'all');
                    break;
            }

            let skills = girl.skill_tiers_info;
            let indexSkill = 0;
            for (let id=1; id<6; id++) {
                if (skills[id])
                    if(skills[id].skill_points_used > 0) indexSkill = id;
            }
            let matchesSkills = (indexSkill == filterSkills) || (filterSkills == 'all')

            let matchesPose = (girl.figure == filterPose) || (filterPose == 'all');
            let matchesZodiac = (girl.zodiac == filterZodiac) || (filterZodiac == 'all');
            let matchesHair = (girl.hair_color1 == filterHair) || (girl.hair_color2 == filterHair) || (filterHair == 'all');
            let matchesEye = (girl.eye_color1 == filterEye) || (girl.eye_color2 == filterEye) || (filterEye == 'all');

            return (matchesName && matchesClass && matchesElement && matchesRarity && matchesAffCategory && matchesAffLvl && matchesBlessedAttributes && matchesSkills && matchesPose && matchesZodiac && matchesHair && matchesEye) ? index : null;
        });

        $.each(arenaGirls, function(index, girlElem) {
            $(girlElem).css('display', $.inArray(index, girlsFiltered) > -1 ? 'block' : 'none');
        });

        //update scroll display
        $(".harem-panel-girls").css('overflow', '');
        $(".harem-panel-girls").css('overflow', 'hidden');
    }

    function createFilterBox() {
        return `<div id="arena_filter_box" class="form-wrapper">
        <div class="form-wrapper">

        <div class="form-control" style="grid-column: 1;"><div class="input-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_name">${window.GT.design.Name}</label>
        <input type="text" autocomplete="off" id="filter_name" placeholder="${labels.girl_name}" icon="search">
        </div></div>

        <div class="form-control" style="grid-column: 1;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_class">${window.GT.design.mythic_equipment_class}</label>
        <select name="filter_class" id="filter_class" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="hardcore">${window.GT.caracs[1]}</option>
        <option value="charm">${window.GT.caracs[2]}</option>
        <option value="knowhow">${window.GT.caracs[3]}</option>
        </select></div></div>

        <div class="form-control" style="grid-column: 1;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_element">${labels.element}</label>
        <select name="filter_element" id="filter_element" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="darkness" style="color: #000; text-shadow: 1px 1px 0 #24a0ff,-1px 1px 0 #24a0ff,-1px -1px 0 #24a0ff,1px -1px 0 #24a0ff;">${window.GT.design.darkness_flavor_element}</option>
        <option value="light" style="color: #fff;">${window.GT.design.light_flavor_element}</option>
        <option value="psychic" style="color: #7e0c8e;">${window.GT.design.psychic_flavor_element}</option>
        <option value="fire" style="color: #ff2a52;">${window.GT.design.fire_flavor_element}</option>
        <option value="nature" style="color: #00e772;">${window.GT.design.nature_flavor_element}</option>
        <option value="stone" style="color: #cb6f2b;">${window.GT.design.stone_flavor_element}</option>
        <option value="sun" style="color: #fff049;">${window.GT.design.sun_flavor_element}</option>
        <option value="water" style="color: #24a0ff;">${window.GT.design.water_flavor_element}</option>
        </select></div></div>

        <div class="form-control" style="grid-column: 1;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_rarity">${window.GT.design.selectors_Rarity}</label>
        <select name="filter_rarity" id="filter_rarity" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="starting">${window.GT.design.girls_rarity_starting}</option>
        <option value="common">${window.GT.design.girls_rarity_common}</option>
        <option value="rare">${window.GT.design.girls_rarity_rare}</option>
        <option value="epic">${window.GT.design.girls_rarity_epic}</option>
        <option value="legendary">${window.GT.design.girls_rarity_legendary}</option>
        <option value="mythic">${window.GT.design.girls_rarity_mythic}</option>
        </select></div></div>

        <div class="form-control" style="grid-column: 1;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_aff_category">${window.GT.design.affection_category}</label>
        <select name="filter_aff_category" id="filter_aff_category" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="1">${labels.one_star}</option>
        <option value="3">${labels.three_stars}</option>
        <option value="5">${labels.five_stars}</option>
        <option value="6">${labels.six_stars}</option>
        </select></div></div>

        <div class="form-control" style="grid-column: 1;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_aff_lvl">${labels.aff_lvl}</label>
        <select name="filter_aff_lvl" id="filter_aff_lvl" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="0">${labels.zero_star}</option>
        <option value="1">${labels.one_star}</option>
        <option value="2">${labels.two_stars}</option>
        <option value="3">${labels.three_stars}</option>
        <option value="4">${labels.four_stars}</option>
        <option value="5">${labels.five_stars}</option>
        <option value="6">${labels.six_stars}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:1; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_blessed_attributes">${labels.blessed_attributes}</label>
        <select name="filter_blessed_attributes" id="filter_blessed_attributes" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="blessed_attributes">${labels.blessed_attributes}</option>
        <option value="non_blessed_attributes">${labels.non_blessed_attributes}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:2; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="skills">${window.GT.design.girl_skills}</label>
        <select name="filter_skills" id="filter_skills" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="0">${labels.none_f}</option>
        <option value="1">${window.GT.design.tier}&nbsp;1</option>
        <option value="2">${window.GT.design.tier}&nbsp;2</option>
        <option value="3">${window.GT.design.tier}&nbsp;3</option>
        <option value="4">${window.GT.design.tier}&nbsp;4</option>
        <option value="5">${window.GT.design.tier}&nbsp;5</option>
        </select></div></div>

        <div class="form-control" style="grid-row:3; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_pose">${window.GT.design.filter_pose}</label>
        <select name="filter_pose" id="filter_pose" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="1">${window.GT.figures[1]}</option>
        <option value="2">${window.GT.figures[2]}</option>
        <option value="3">${window.GT.figures[3]}</option>
        <option value="4">${window.GT.figures[4]}</option>
        <option value="5">${window.GT.figures[5]}</option>
        <option value="6">${window.GT.figures[6]}</option>
        <option value="7">${window.GT.figures[7]}</option>
        <option value="8">${window.GT.figures[8]}</option>
        <option value="9">${window.GT.figures[9]}</option>
        <option value="10">${window.GT.figures[10]}</option>
        <option value="11">${window.GT.figures[11]}</option>
        <option value="12">${window.GT.figures[12]}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:4; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_zodiac">${window.GT.design.haremdex_zodiac_sign}</label>
        <select name="filter_zodiac" id="filter_zodiac" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="${labels.zodiac[1]}">${labels.zodiac[1]}</option>
        <option value="${labels.zodiac[2]}">${labels.zodiac[2]}</option>
        <option value="${labels.zodiac[3]}">${labels.zodiac[3]}</option>
        <option value="${labels.zodiac[4]}">${labels.zodiac[4]}</option>
        <option value="${labels.zodiac[5]}">${labels.zodiac[5]}</option>
        <option value="${labels.zodiac[6]}">${labels.zodiac[6]}</option>
        <option value="${labels.zodiac[7]}">${labels.zodiac[7]}</option>
        <option value="${labels.zodiac[8]}">${labels.zodiac[8]}</option>
        <option value="${labels.zodiac[9]}">${labels.zodiac[9]}</option>
        <option value="${labels.zodiac[10]}">${labels.zodiac[10]}</option>
        <option value="${labels.zodiac[11]}">${labels.zodiac[11]}</option>
        <option value="${labels.zodiac[12]}">${labels.zodiac[12]}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:5; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_hair">${window.GT.design.haremdex_hair_color}</label>
        <select name="filter_hair" id="filter_hair" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="F99" style="color: #ff5a81;">${labels.color['F99']}</option>
        <option value="F00" style="color: #ff2a52;">${labels.color['F00']}</option>
        <option value="B62" style="color: #cb6f2b;">${labels.color['B62']}</option>
        <option value="FFF" style="color: #fff;">${labels.color['FFF']}</option>
        <option value="321" style="color: #67422a; text-shadow: 1px 1px 0 #fff,-1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff;">${labels.color['321']}</option>
        <option value="00F" style="color: #24a0ff;">${labels.color['00F']}</option>
        <option value="FF0" style="color: #fff049;">${labels.color['FF0']}</option>
        <option value="0F0" style="color: #00e772;">${labels.color['0F0']}</option>
        <option value="XXX" style="color: #fff;">${labels.color['XXX']}</option>
        <option value="A55" style="color: #cb6f2b;">${labels.color['A55']}</option>
        <option value="000" style="color: #000; text-shadow: 1px 1px 0 #24a0ff,-1px 1px 0 #24a0ff,-1px -1px 0 #24a0ff,1px -1px 0 #24a0ff;">${labels.color['000']}</option>
        <option value="CCC" style="color: #ccc;">${labels.color['CCC']}</option>
        <option value="F0F" style="color: #e42eff;">${labels.color['F0F']}</option>
        <option value="F90" style="color: #ff9600;">${labels.color['F90']}</option>
        <option value="EB8" style="color: #ffa792;">${labels.color['EB8']}</option>
        <option value="B06" style="color: #ca0080;">${labels.color['B06']}</option>
        <option value="888" style="color: #999;">${labels.color['888']}</option>
        <option value="FD0" style="color: #ffb923;">${labels.color['FD0']}</option>
        <option value="D83" style="color: #ca8521;">${labels.color['D83']}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:6; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_eye">${window.GT.design.haremdex_eye_color}</label>
        <select name="filter_eye" id="filter_eye" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="F99" style="color: #ff5a81;">${labels.color['F99']}</option>
        <option value="00F" style="color: #24a0ff;">${labels.color['00F']}</option>
        <option value="A55" style="color: #cb6f2b;">${labels.color['A55']}</option>
        <option value="0F0" style="color: #00e772;">${labels.color['0F0']}</option>
        <option value="F0F" style="color: #e42eff;">${labels.color['F0F']}</option>
        <option value="FD0" style="color: #ffb923;">${labels.color['FD0']}</option>
        <option value="F00" style="color: #ff2a52;">${labels.color['F00']}</option>
        <option value="B06" style="color: #ca0080;">${labels.color['B06']}</option>
        <option value="F90" style="color: #ff9600;">${labels.color['F90']}</option>
        <option value="888" style="color: #999;">${labels.color['888']}</option>
        <option value="CCC" style="color: #ccc;">${labels.color['CCC']}</option>
        <option value="000" style="color: #000; text-shadow: 1px 1px 0 #24a0ff,-1px 1px 0 #24a0ff,-1px -1px 0 #24a0ff,1px -1px 0 #24a0ff;">${labels.color['000']}</option>
        <option value="XXX" style="color: #fff;">${labels.color['XXX']}</option>
        <option value="321" style="color: #67422a; text-shadow: 1px 1px 0 #fff,-1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff;">${labels.color['321']}</option>
        <option value="FFF" style="color: #fff;">${labels.color['FFF']}</option>
        </select></div></div>

        </div>
        <button id="reset_button" class="square_blue_btn">Reset</button>
        </div>`;
    }

    function resetFilter() {
        $("#filter_name").get(0).value = "";
        $("#filter_class").get(0).selectedIndex = 0;
        $("#filter_element").get(0).value = "all";
        $("#filter_rarity").get(0).value = "all";
        $("#filter_aff_category").get(0).value = "all";
        $("#filter_aff_lvl").get(0).value = "all";
        $("#filter_blessed_attributes").get(0).value = "all";
        $("#filter_skills").get(0).value = "all";
        $("#filter_pose").get(0).value = "all";
        $("#filter_zodiac").get(0).value = "all";
        $("#filter_hair").get(0).value = "all";
        $("#filter_eye").get(0).value = "all";

        filterGirls();
    }

    //CSS
    sheet.insertRule(`#arena_filter_box {
        position: absolute;
        width: 417px;
        right: 408px;
        z-index: 99;
        border-radius: 8px 10px 10px 8px;
        background-color: #1e261e;
        box-shadow: rgba(255, 255, 255, 0.73) 0px 0px;
        padding: 5px;
        border: 1px solid #ffa23e;
        display: none;}`
    );

    sheet.insertRule(`${mediaMobile} {
            #arena_filter_box {
        top: 98px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #arena_filter_box {
        top: 66px;}}`
    );

    sheet.insertRule(`#arena_filter_box .form-wrapper {
        display: grid;
        grid-gap: 0px 10px;
        padding-bottom: 10px;
        grid-template-columns: 1fr 1fr;
        width: 100%;}`
    );

    sheet.insertRule(`#arena_filter_box .form-control {
        display: grid;}`
    );

    sheet.insertRule(`#arena_filter_box .form-wrapper > .form-control > .select-group > select > option {
        font-weight: bold;
        text-shadow: 1px 1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000;}`
    );

    sheet.insertRule(`.personal_info.hero {
        margin-top: 5px;}`
    );

    sheet.insertRule(`#season-arena .season_arena_block.battle_hero .hero_stats div {
        margin: 0;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .change-team-panel #filter_girls {
        margin-top: 11px !important;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .change-team-panel #filter_girls {
        margin-top: 16px !important;}}`
    );

    sheet.insertRule(`.change-team-panel #arena_filter {
        position: absolute;
        color: #fff;
        width: 84px;
        right: 98px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .change-team-panel #arena_filter {
        top: 72px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .change-team-panel #arena_filter {
        font-size: 18px;
        top: 97px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .change-team-panel .panel-title {
        margin-right: 70px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .change-team-panel .panel-title {
        margin-right: 70px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #change-team-page .change-team-panel.team-panel {
        margin-top: 20px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #change-team-page .change-team-panel.harem-panel {
        margin-top: 17px;}}`
    );

    sheet.insertRule(`#waifu-page #arena_filter {
        position: absolute;
        color: #fff;
        width: 84px;
        top: 11px;
        right: 15px;}`
    );

    sheet.insertRule(`#waifu-page #arena_filter_box {
        right: 346px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #waifu-page #arena_filter_box {
        top: 72px;}}`
    );

    sheet.insertRule(`#edit-team-page #arena_filter_box #reset_button, #waifu-page #arena_filter_box #reset_button {
        width: 50%;
        color: rgb(255, 255, 255);
        font-size: 1rem;
        position: relative;
        left: 25%;}`
    );
}

//Filter on girls selection screen for labyrinth
function moduleLabyrinthFilter() {
    let arenaGirls = undefined;
    let girlsData = undefined;

    $(document).ready(() => {
        getFilterGirlData();
        $(".team-pool-selection-container").append(`<button id="labyrinth_filter" class="square_blue_btn">${labels.filter}</button>`);
        $(".team-pool-selection-container").append(createFilterBox("default"));
        createFilterEvents();
        $(`#reset_button`).click(() => resetFilter());
    });

    function getFilterGirlData() {
        arenaGirls = $('.girl-grid .girl-container');

        girlsData = $.map(arenaGirls, function(girl, index) {
            return JSON.parse($(girl).find('.girl-image').attr("data-new-girl-tooltip"));
        });
    }

    function createFilterEvents() {
        $("#labyrinth_filter").on('click', () => {
            if (typeof arenaGirls == 'undefined' || typeof girlsData == 'undefined') return;
            let currentBoxDisplay = $("#labyrinth_filter_box").css('display');
            $("#labyrinth_filter_box").css('display', currentBoxDisplay == "none" ? 'block' : 'none');
        });
        $("#filter_class").on('change', filterGirls);
        $("#filter_rarity").on('change', filterGirls);
        $("#filter_name").get(0).oninput = filterGirls;
        $("#filter_aff_category").on('change', filterGirls);
        $("#filter_aff_lvl").on('change', filterGirls);
        $("#filter_element").on('change', filterGirls);
        $("#filter_skill5").on('change', filterGirls);
        $("#filter_role").on('change', filterGirls);
    }

    function filterGirls() {
        let filterClass = $("#filter_class").get(0).selectedIndex;
        let filterRarity = $("#filter_rarity").get(0).value;
        let filterName = $("#filter_name").get(0).value;
        let nameRegex = new RegExp(filterName, "i");
        let filterAffCategory = $("#filter_aff_category").get(0).value;
        let filterAffLvl = $("#filter_aff_lvl").get(0).value;
        let filterElement = $("#filter_element").get(0).value;
        let filterSkill5 = $("#filter_skill5").get(0).value;
        let filterRole = $("#filter_role").get(0).value;

        let girlsFiltered = $.map(girlsData, function(girl, index) {
            let matchesClass = (girl.class == filterClass) || (filterClass == 0);
            let matchesRarity = (girl.rarity == filterRarity) || (filterRarity == 'all');
            let matchesName = (girl.name.search(nameRegex) > -1);
            let matchesRole = (girl.role_data.id == filterRole) || (filterRole == 'all') || (girl.role_data.length == 0 && filterRole == 0);

            let affectionStr = girl.graded2;
            let affectionCategoryStr = affectionStr.split('</g>');
            let affectionCategory = affectionCategoryStr.length-1;
            let affectionLvlStr = affectionStr.split('<g >');
            let affectionLvl = affectionLvlStr.length-1;

            let matchesAffCategory = (affectionCategory == filterAffCategory) || (filterAffCategory == 'all');
            let matchesAffLvl = (affectionLvl == filterAffLvl) || (filterAffLvl == 'all');
            let matchesElement = (girl.element_data.type == filterElement) || (filterElement == 'all');

            let skill5Active = 0;
            if (girl.skill_tiers_info[5] != undefined) skill5Active = (girl.skill_tiers_info[5].skill_points_used == 0) ? 0 : 1;
            let matchesSkill5 = (skill5Active == filterSkill5) || (filterSkill5 == 'all');

            return (matchesClass && matchesRarity && matchesName && matchesAffCategory && matchesAffLvl && matchesElement && matchesSkill5 && matchesRole) ? index : null;
        });

        $.each(arenaGirls, function(index, girlElem) {
            $(girlElem).css('display', $.inArray(index, girlsFiltered) > -1 ? 'block' : 'none');
        });
    }

    function createFilterBox() {
        return `<div id="labyrinth_filter_box"><div class="form-wrapper">

        <div class="form-control" style="grid-column: 1;"><div class="input-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_name">${window.GT.design.Name}</label>
        <input type="text" autocomplete="off" id="filter_name" placeholder="${labels.girl_name}" icon="search">
        </div></div>

        <div class="form-control" style="grid-column: 1;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_class">${window.GT.design.mythic_equipment_class}</label>
        <select name="filter_class" id="filter_class" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="hardcore">${window.GT.design.class_hardcore}</option>
        <option value="charm">${window.GT.design.class_charm}</option>
        <option value="knowhow">${window.GT.design.class_knowhow}</option>
        </select></div></div>

        <div class="form-control" style="grid-column: 1;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_element">${labels.element}</label>
        <select name="filter_element" id="filter_element" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="darkness" style="color: #000; text-shadow: 1px 1px 0 #24a0ff,-1px 1px 0 #24a0ff,-1px -1px 0 #24a0ff,1px -1px 0 #24a0ff;">${window.GT.design.darkness_flavor_element}</option>
        <option value="light" style="color: #fff;">${window.GT.design.light_flavor_element}</option>
        <option value="psychic" style="color: #7e0c8e;">${window.GT.design.psychic_flavor_element}</option>
        <option value="fire" style="color: #ff2a52;">${window.GT.design.fire_flavor_element}</option>
        <option value="nature" style="color: #00e772;">${window.GT.design.nature_flavor_element}</option>
        <option value="stone" style="color: #cb6f2b;">${window.GT.design.stone_flavor_element}</option>
        <option value="sun" style="color: #fff049;">${window.GT.design.sun_flavor_element}</option>
        <option value="water" style="color: #24a0ff;">${window.GT.design.water_flavor_element}</option>
        </select></div></div>

        <div class="form-control" style="grid-column: 1;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_role">${window.GT.design.girl_role}</label>
        <select name="filter_role" id="filter_role" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="0">${labels.none_m}</option>
        <option value="4">${window.GT.design.girl_role_4_name}</option>
        <option value="10">${window.GT.design.girl_role_10_name}</option>
        <option value="9">${window.GT.design.girl_role_9_name}</option>
        <option value="3">${window.GT.design.girl_role_3_name}</option>
        <option value="1">${window.GT.design.girl_role_1_name}</option>
        <option value="2">${window.GT.design.girl_role_2_name}</option>
        <option value="5">${window.GT.design.girl_role_5_name}</option>
        <option value="6">${window.GT.design.girl_role_6_name}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:1; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_rarity">${window.GT.design.selectors_Rarity}</label>
        <select name="filter_rarity" id="filter_rarity" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="starting">${window.GT.design.girls_rarity_starting}</option>
        <option value="common">${window.GT.design.girls_rarity_common}</option>
        <option value="rare">${window.GT.design.girls_rarity_rare}</option>
        <option value="epic">${window.GT.design.girls_rarity_epic}</option>
        <option value="legendary">${window.GT.design.girls_rarity_legendary}</option>
        <option value="mythic">${window.GT.design.girls_rarity_mythic}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:2; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_skill5">${window.GT.design.girl_skills} ${window.GT.design.tier} 5</label>
        <select name="filter_skill5" id="filter_skill5" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value=1>${window.GT.design.Yes}</option>
        <option value=0>${window.GT.design.No}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:3; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_aff_category">${window.GT.design.affection_category}</label>
        <select name="filter_aff_category" id="filter_aff_category" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="1">${labels.one_star}</option>
        <option value="3">${labels.three_stars}</option>
        <option value="5">${labels.five_stars}</option>
        <option value="6">${labels.six_stars}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:4; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_aff_lvl">${labels.aff_lvl}</label>
        <select name="filter_aff_lvl" id="filter_aff_lvl" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="0">${labels.zero_star}</option>
        <option value="1">${labels.one_star}</option>
        <option value="2">${labels.two_stars}</option>
        <option value="3">${labels.three_stars}</option>
        <option value="4">${labels.four_stars}</option>
        <option value="5">${labels.five_stars}</option>
        <option value="6">${labels.six_stars}</option>
        </select></div></div>

        </div>
        <button id="reset_button" class="square_blue_btn">Reset</button>
        </div>`;
    }

    function resetFilter() {
        $("#filter_name").get(0).value = "";
        $("#filter_class").get(0).selectedIndex = 0;
        $("#filter_element").get(0).value = "all";
        $("#filter_role").get(0).value = "all";
        $("#filter_rarity").get(0).value = "all";
        $("#filter_skill5").get(0).value = "all";
        $("#filter_aff_category").get(0).value = "all";
        $("#filter_aff_lvl").get(0).value = "all";

        filterGirls();
    }

    //CSS
    sheet.insertRule(`#labyrinth_filter_box {
        position: absolute;
        width: 417px;
        top: 10px;
        left: 110px;
        z-index: 99;
        border-radius: 8px 10px 10px 8px;
        background-color: #1e261e;
        box-shadow: rgba(255, 255, 255, 0.73) 0px 0px;
        padding: 5px;
        border: 1px solid #ffa23e;
        display: none;}`
    );

    sheet.insertRule(`#labyrinth_filter_box .form-wrapper {
        display: grid;
        grid-gap: 0px 10px;
        padding-bottom: 10px;
        grid-template-columns: 1.1fr 0.9fr;
        width: 100%;}`
    );

    sheet.insertRule(`#labyrinth_filter_box .form-control {
        display: grid;}`
    );

    sheet.insertRule(`#labyrinth_filter_box .form-wrapper > .form-control > .select-group > select > option {
        font-weight: bold;
        text-shadow: 1px 1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000;}`
    );

    sheet.insertRule(`.team-pool-selection-container #labyrinth_filter {
        position: absolute;
        color: #fff;
        width: 84px;
        left: 10px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .team-pool-selection-container #labyrinth_filter {
        top: 12px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .team-pool-selection-container #labyrinth_filter {
        font-size: 18px;
        top: 6px;}}`
    );

    sheet.insertRule(`#labyrinth_filter_box .form-wrapper > .form-control label.head-group {
        text-align: left;}`
    );

    sheet.insertRule(`.labyrinth-pool-select-panel #reset_button {
        width: 50%;
        color: rgb(255, 255, 255);
        font-size: 1rem;
        position: relative;
        left: 25%;}`
    );
}

//Filter on team selection screen in the labyrinth
function moduleLabyrinthTeamFilter() {
    let arenaGirls = undefined;
    let girlsData = undefined;
    let girlsDictionary = (!localStorage.getItem('HHS.HHPNMap')) ? new Map() : new Map(JSON.parse(localStorage.getItem('HHS.HHPNMap')));

    $(document).ready(() => {
        getFilterGirlData();

        //Remove filters from labyrinth++ script
        $('.panel-title-custom').remove();
        //$('.panel-title').prepend($('#filter_girls'));
        $('.change-team-panel.harem-panel .square_blue_btn:not(#filter_girls):not(#labyrinth_filter):not(#reset_button)').remove();
        $('.panel-title').css('display', 'block');

        $("h3.panel-title").append(`<button id="labyrinth_filter" class="square_blue_btn">${labels.filter}</button>`);
        $("h3.panel-title").append(createFilterBox("default"));
        createFilterEvents();
        $(`#reset_button`).click(() => resetFilter());
    });

    function getFilterGirlData() {
        arenaGirls = $('.harem-panel-girls .harem-girl-container');

        girlsData = $.map(arenaGirls, function(girl, index) {
            let girlData = JSON.parse($(girl).find('.girl_img').attr("data-new-girl-tooltip"));
            girlData['id'] = parseInt($(girl).attr('id_girl'), 10);
            return girlData;
        });
    }

    function createFilterEvents() {
        $("#labyrinth_filter").on('click', () => {
            if (typeof arenaGirls == 'undefined' || typeof girlsData == 'undefined') return;
            let currentBoxDisplay = $("#labyrinth_filter_box").css('display');
            $("#labyrinth_filter_box").css('display', currentBoxDisplay == "none" ? 'block' : 'none');
        });
        $("#filter_class").on('change', filterGirls);
        $("#filter_rarity").on('change', filterGirls);
        $("#filter_name").get(0).oninput = filterGirls;
        $("#filter_aff_category").on('change', filterGirls);
        $("#filter_aff_lvl").on('change', filterGirls);
        $("#filter_element").on('change', filterGirls);
        $("#filter_skill5").on('change', filterGirls);
        $("#filter_role").on('change', filterGirls);
    }

    function filterGirls() {
        let filterClass = $("#filter_class").get(0).selectedIndex;
        let filterRarity = $("#filter_rarity").get(0).value;
        let filterName = $("#filter_name").get(0).value;
        let nameRegex = new RegExp(filterName, "i");
        let filterAffCategory = $("#filter_aff_category").get(0).value;
        let filterAffLvl = $("#filter_aff_lvl").get(0).value;
        let filterElement = $("#filter_element").get(0).value;
        let filterSkill5 = $("#filter_skill5").get(0).value;
        let filterRole = $("#filter_role").get(0).value;

        let girlsFiltered = $.map(girlsData, function(girl, index) {
            let matchesClass = (girl.class == filterClass) || (filterClass == 0);
            let matchesRarity = (girl.rarity == filterRarity) || (filterRarity == 'all');
            let matchesName = (girl.name.search(nameRegex) > -1);
            let matchesRole = (girl.role_data.id == filterRole) || (filterRole == 'all') || (girl.role_data.length == 0 && filterRole == 0);

            let affectionStr = girl.graded2;
            let affectionCategoryStr = affectionStr.split('</g>');
            let affectionCategory = affectionCategoryStr.length-1;
            let affectionLvlStr = affectionStr.split('<g >');
            let affectionLvl = affectionLvlStr.length-1;

            let matchesAffCategory = (affectionCategory == filterAffCategory) || (filterAffCategory == 'all');
            let matchesAffLvl = (affectionLvl == filterAffLvl) || (filterAffLvl == 'all');
            let matchesElement = (girl.element == filterElement) || (filterElement == 'all');

            let skill5Active = 0;
            try{skill5Active = (girlsDictionary.get(girl.id).sk[5] == 0) ? 0 : 1;} catch(err){}
            let matchesSkill5 = (skill5Active == filterSkill5) || (filterSkill5 == 'all');

            return (matchesClass && matchesRarity && matchesName && matchesAffCategory && matchesAffLvl && matchesElement && matchesSkill5 && matchesRole) ? index : null;
        });

        $.each(arenaGirls, function(index, girlElem) {
            $(girlElem).css('display', $.inArray(index, girlsFiltered) > -1 ? 'block' : 'none');
        });

        //update scroll display
        $('.harem-panel-girls').css('overflow', '');
        $('.harem-panel-girls').css('overflow', 'hidden');
    }

    function createFilterBox() {
        return `<div id="labyrinth_filter_box"><div class="form-wrapper">

        <div class="form-control" style="grid-column: 1;"><div class="input-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_name">${window.GT.design.Name}</label>
        <input type="text" autocomplete="off" id="filter_name" placeholder="${labels.girl_name}" icon="search">
        </div></div>

        <div class="form-control" style="grid-column: 1;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_class">${window.GT.design.mythic_equipment_class}</label>
        <select name="filter_class" id="filter_class" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="hardcore">${window.GT.design.class_hardcore}</option>
        <option value="charm">${window.GT.design.class_charm}</option>
        <option value="knowhow">${window.GT.design.class_knowhow}</option>
        </select></div></div>

        <div class="form-control" style="grid-column: 1;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_element">${labels.element}</label>
        <select name="filter_element" id="filter_element" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="darkness" style="color: #000; text-shadow: 1px 1px 0 #24a0ff,-1px 1px 0 #24a0ff,-1px -1px 0 #24a0ff,1px -1px 0 #24a0ff;">${window.GT.design.darkness_flavor_element}</option>
        <option value="light" style="color: #fff;">${window.GT.design.light_flavor_element}</option>
        <option value="psychic" style="color: #7e0c8e;">${window.GT.design.psychic_flavor_element}</option>
        <option value="fire" style="color: #ff2a52;">${window.GT.design.fire_flavor_element}</option>
        <option value="nature" style="color: #00e772;">${window.GT.design.nature_flavor_element}</option>
        <option value="stone" style="color: #cb6f2b;">${window.GT.design.stone_flavor_element}</option>
        <option value="sun" style="color: #fff049;">${window.GT.design.sun_flavor_element}</option>
        <option value="water" style="color: #24a0ff;">${window.GT.design.water_flavor_element}</option>
        </select></div></div>



        <div class="form-control" style="grid-column: 1;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_role">${window.GT.design.girl_role}</label>
        <select name="filter_role" id="filter_role" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="0">${labels.none_m}</option>
        <option value="4">${window.GT.design.girl_role_4_name}</option>
        <option value="10">${window.GT.design.girl_role_10_name}</option>
        <option value="9">${window.GT.design.girl_role_9_name}</option>
        <option value="3">${window.GT.design.girl_role_3_name}</option>
        <option value="1">${window.GT.design.girl_role_1_name}</option>
        <option value="2">${window.GT.design.girl_role_2_name}</option>
        <option value="5">${window.GT.design.girl_role_5_name}</option>
        <option value="6">${window.GT.design.girl_role_6_name}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:1; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_rarity">${window.GT.design.selectors_Rarity}</label>
        <select name="filter_rarity" id="filter_rarity" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="starting">${window.GT.design.girls_rarity_starting}</option>
        <option value="common">${window.GT.design.girls_rarity_common}</option>
        <option value="rare">${window.GT.design.girls_rarity_rare}</option>
        <option value="epic">${window.GT.design.girls_rarity_epic}</option>
        <option value="legendary">${window.GT.design.girls_rarity_legendary}</option>
        <option value="mythic">${window.GT.design.girls_rarity_mythic}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:2; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_skill5">${window.GT.design.girl_skills} ${window.GT.design.tier} 5</label>
        <select name="filter_skill5" id="filter_skill5" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value=1>${window.GT.design.Yes}</option>
        <option value=0>${window.GT.design.No}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:3; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_aff_category">${window.GT.design.affection_category}</label>
        <select name="filter_aff_category" id="filter_aff_category" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="1">${labels.one_star}</option>
        <option value="3">${labels.three_stars}</option>
        <option value="5">${labels.five_stars}</option>
        <option value="6">${labels.six_stars}</option>
        </select></div></div>

        <div class="form-control" style="grid-row:4; grid-column: 2;"><div class="select-group" style="break-inside: avoid;">
        <label class="head-group" for="filter_aff_lvl">${labels.aff_lvl}</label>
        <select name="filter_aff_lvl" id="filter_aff_lvl" icon="down-arrow">
        <option value="all" selected="selected">${labels.all}</option>
        <option value="0">${labels.zero_star}</option>
        <option value="1">${labels.one_star}</option>
        <option value="2">${labels.two_stars}</option>
        <option value="3">${labels.three_stars}</option>
        <option value="4">${labels.four_stars}</option>
        <option value="5">${labels.five_stars}</option>
        <option value="6">${labels.six_stars}</option>
        </select></div></div>

        </div>
        <button id="reset_button" class="square_blue_btn">Reset</button>
        </div>`
    }

    function resetFilter() {
        $("#filter_name").get(0).value = "";
        $("#filter_class").get(0).selectedIndex = 0;
        $("#filter_element").get(0).value = "all";
        $("#filter_role").get(0).value = "all";
        $("#filter_rarity").get(0).value = "all";
        $("#filter_skill5").get(0).value = "all";
        $("#filter_aff_category").get(0).value = "all";
        $("#filter_aff_lvl").get(0).value = "all";

        filterGirls();
    }

    //CSS
    sheet.insertRule(`#labyrinth_filter_box {
        position: absolute;
        width: 417px;
        right: 408px;
        z-index: 99;
        border-radius: 8px 10px 10px 8px;
        background-color: #1e261e;
        box-shadow: rgba(255, 255, 255, 0.73) 0px 0px;
        padding: 5px;
        border: 1px solid #ffa23e;
        display: none;}`
    );

    sheet.insertRule(`${mediaMobile} {
            #labyrinth_filter_box {
        top: 119px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #labyrinth_filter_box {
        top: 90px;}}`
    );

    sheet.insertRule(`#labyrinth_filter_box .form-wrapper {
        display: grid;
        grid-gap: 0px 10px;
        padding-bottom: 10px;
        grid-template-columns: 1.1fr 0.9fr;
        width: 100%;}`
    );

    sheet.insertRule(`#labyrinth_filter_box .form-control {
        display: grid;}`
    );

    sheet.insertRule(`#labyrinth_filter_box .form-wrapper > .form-control > .select-group > select > option {
        font-weight: bold;
        text-shadow: 1px 1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000;}`
    );

    sheet.insertRule(`.personal_info.hero {
        margin-top: 5px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .change-team-panel #filter_girls {
        margin-top: 11px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .change-team-panel #filter_girls {
        margin-top: 16px;}}`
    );

    sheet.insertRule(`.change-team-panel #labyrinth_filter {
        position: absolute;
        color: white;
        width: 84px;
        right: 98px;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .change-team-panel #labyrinth_filter {
        font-size: 18px;
        top: 98px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .change-team-panel #labyrinth_filter {
        font-size: 16px;
        top: 72px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .change-team-panel .panel-title {
        margin-right: 70px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #change-team-page .change-team-panel.team-panel {
        margin-top: 20px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #change-team-page .change-team-panel.harem-panel {
        margin-top: 17px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .change-team-panel .panel-title {
        margin-right: 70px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .team-context {
        top: 3.3rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .team-context {
        top: 5rem;}}`
    );

    sheet.insertRule(`labyrinth_filter_box .form-wrapper > .form-control label.head-group {
        text-align: left;}`
    );

    sheet.insertRule(`#edit-team-page #labyrinth_filter_box #reset_button {
        width: 50%;
        color: rgb(255, 255, 255);
        font-size: 1rem;
        position: relative;
        left: 25%;}`
    );
}


/* =========================================
	CHAMPIONS INFORMATION (Credit: Entwine)
   ========================================= */

function moduleChampions() {
    if (sessionStorage.getItem('championsCallBack') && $('.page-shop').length) {
        const championsCallBack = JSON.parse(sessionStorage.getItem('championsCallBack'));
        $('#breadcrumbs .back').after(
            `<span>&gt;</span>
            <a class="back" href="${transformNutakuURL('/champions-map.html')}"><nav [rel="content"] a[href="${transformNutakuURL('/champions-map.html')}"]>
            <span class="mapArrowBack_flat_icn"></span></a>
            <span>&gt;</span><a class="back" href="${championsCallBack.location}">${championsCallBack.name}
            <span class="mapArrowBack_flat_icn"></span></a>`
        );
        sessionStorage.removeItem('championsCallBack');
    }
    else if(CurrentPage.indexOf('/champions-map') != -1) {
        const champions_unlocked = $('.champion-lair-girl').length - $('.champion-lair-name.locked').length ;
        localStorage.setItem('HHS.nb_champions', champions_unlocked);
    }
    else if(['/champions/', '/club-champion'].some(testPage)) {
        const DEFAULT_CHAMPIONS_DATA = '{"attempts": {}, "config" : {}, "positions" : {}, "statistics" : {}}';
        const personalKey = heroData.infos.id + '/' + window.championData.champion.id;
        let championsData = ($('.page-champions').length == 1) ? JSON.parse(localStorage.getItem('HHS.championsData') || DEFAULT_CHAMPIONS_DATA) : JSON.parse(localStorage.getItem('HHS.clubChampionsData') || DEFAULT_CHAMPIONS_DATA);
        let positions = championsData.positions[personalKey];
        let positions2 = window.championData.champion.poses;
        let statistics = championsData.statistics[window.championData.champion.id];
        let attempts = championsData.attempts[personalKey] || 0;
        let config = championsData.config[heroData.infos.id] || {};

        $('.champions-top__title').append(`<span class="champion-lvl">(${window.GT.design.Lvl} ${window.championData.champion.level})</span>`);

        let page = (CurrentPage.indexOf('/champions/') != -1) ? $('.page-champions') : $('.page-club_champion');
        let isSkipButtonClicked;
        markMatchedPositions();
        highlightGirlPose();
        if (CurrentPage.indexOf('/champions/') != -1) showAdditionalInformation();
        showNumberOfTicketsWhileTeamResting();

        const observer = new MutationObserver(() => {markMatchedPositions()})
        observer.observe(document.querySelector('section'), {childList: true});

        page
            .on('click', '.champions-bottom__confirm-team', showNumberOfTicketsWhileTeamResting)
            .on('click', '.champions-bottom__skip-champion-cooldown', () => {isSkipButtonClicked = true});
        $('.page-club_champion')
            .on('click', '.champions-bottom__confirm-team', showNumberOfTicketsWhileTeamResting)
            .on('click', '.champions-bottom__skip-champion-cooldown', () => {isSkipButtonClicked = true});
        $(window).on('beforeunload', () => {
            championsData = (window.location.pathname.indexOf('/champions/') != -1) ? JSON.parse(localStorage.getItem('HHS.championsData') || DEFAULT_CHAMPIONS_DATA) : JSON.parse(localStorage.getItem('HHS.clubChampionsData') || DEFAULT_CHAMPIONS_DATA);
            championsData.positions[personalKey] = positions;
            championsData.attempts[personalKey] = attempts;
            championsData.statistics[window.championData.champion.id] = statistics;
            championsData.config[heroData.infos.id] = Object.keys(config).length? config : undefined;
            if (window.location.pathname.indexOf('/champions/') != -1)
                localStorage.setItem('HHS.championsData', JSON.stringify(championsData));
            else localStorage.setItem('HHS.clubChampionsData', JSON.stringify(championsData));
        });
        $(document).ajaxComplete(function(event, xhr, options) {
            if (!xhr.responseText.length) return;

            const response = JSON.parse(xhr.responseText);

            if (!response || !response.success) return;

            if (response.positions) {
                if (!positions) {
                    if (!statistics) statistics = Array($('.rounds-info__figures .figure').length).fill(0);
                    response.positions.forEach((e) => statistics[e]++);
                    attempts = 0;
                }
                if (response.final.attacker_ego > 0 || response.final.winner.type == 'hero') positions = undefined;
                else positions = response.positions;
                attempts += parseInt($('.champions-bottom__amount-slider .input-field .battles-number')[0].innerText, 10);
            }
            else markMatchedPositions();
            if (isSkipButtonClicked) {
                showAdditionalInformation();
                isSkipButtonClicked = false;
            }
        });
        const restTimer = $('.champions-bottom__rest [timer], .champions-middle__champion-resting[timer]');
        if (restTimer.is(':visible')) {
            const delayTime = Math.ceil(restTimer.attr('timer') * 1000 - Date.now());
            markMatchedPositions;
            setTimeout(markMatchedPositions, delayTime + 400);
        }

        if(CurrentPage.indexOf('/champions/') != -1) championShortcuts();

        function showAdditionalInformation() {
            if ($('.champions-middle__champion-resting-text').is(':visible') && positions) positions = undefined;
            if ($('#additionalInformation').is(':visible')) return;
            if (positions) createCurrentPositionsInfo();
            else if (statistics) createStatisticsInfo();
            if (positions || statistics) configureInfoBox();
        }

        function markMatchedPositions() {
            $('.girl-selection__girl-box').each(function(index) {
                const currentGirlsPose = $(this).find('.girl-box__pose');
                const currentGirlsPower = $(this).find('.damage_number');

                if (currentGirlsPose.next().length == 0) currentGirlsPose.parent().append(`<span style="margin-left: 35px; z-index: 10;" />`);
                if (positions2) {
                    if (currentGirlsPose.attr('src').indexOf(preparePositionImage(positions2[index % positions2.length])) >= 0) {
                        currentGirlsPose.next().removeClass('empty');
                        currentGirlsPose.next().addClass('green-tick-icon');
                        currentGirlsPose.next().css('filter', 'none');
                        currentGirlsPower.css('color', '#b0ff26');
                    }
                    else if (positions2.some((e) => (preparePositionImage(e) == currentGirlsPose.attr('src')))) {
                        currentGirlsPose.next().addClass('green-tick-icon empty');
                        currentGirlsPose.next().css('filter', 'hue-rotate(-233deg)');
                        let newPower = localeStringToNumber(currentGirlsPower.attr('hh_title') || currentGirlsPower.text())*2;
                        if (newPower < 100000) currentGirlsPower[0].innerText = nRounding(newPower, 1, 1);
                        else currentGirlsPower[0].innerText = nRounding(newPower, 0, 1);
                        currentGirlsPower.css('color', '#009fff');
                    }
                    else currentGirlsPose.next().removeClass('green-tick-icon');
                }
                else if (statistics) {
                    currentGirlsPose.next().css({'filter': 'invert'});
                    if (statistics.some((elem, idx) => (elem > 0 && preparePositionImage(idx) == currentGirlsPose.attr('src')))) {
                        currentGirlsPose.next().addClass('green-tick-icon empty');
                        currentGirlsPose.next().css('filter', 'hue-rotate(-233deg)');
                    }
                    else currentGirlsPose.next().removeClass('green-tick-icon');
                }
            });
        }

        function showNumberOfTicketsWhileTeamResting() {
            if ($('.champions-bottom__ticket-amount').is(':visible') == false) {
                $('.champions-bottom__rest').css({'width': '280px'})
                    .before(
                        `<div class="champions-bottom__ticket-amount">
                        <span class="ticket_icn"></span>
                        <span cur="ticket">x${window.championData.champion.currentTickets}</span>
                        </div>`
                    );
            }
        }

        function preparePositionImage(positionID) {
            return `${window.IMAGES_URL}/pictures/design/battle_positions/${positionID}.png`;
        }

        function createCurrentPositionsInfo() {
            let positionsBox = (
                `<div id="additionalInformation" style="position: absolute; top:${(config.top || 130)}px; right:${(config.right || -75)}px;">
                <div style="border: 2px solid #ffa23e; background-color: rgba(60,20,30,.8); border-radius: 7px; width: max-content;">&nbsp;${labels.Current_positions}:<div>`
            );
            positions.forEach((e) => {
                positionsBox += `<img style="height: 48px; width: 48px; cursor: pointer;" src="${preparePositionImage(e)}" hh_title="${window.GT.figures[e]}">`;
            });
            positionsBox += `</div>&nbsp;${labels.Current_stage}: ${attempts} ${(attempts == 1 ? labels.attempt : labels.attempts)}&nbsp;</div></div>`;
            $('.champions-over__champion-wrapper').append(positionsBox);
        }

        function createStatisticsInfo() {
            let statisticsBox = (
                `<div id="additionalInformation" style="position: absolute; top:${(config.top || 130)}px; right:${(config.right || -75)}px;">
                <div style="border: 2px solid #ffa23e; background-color: rgba(0,0,0,.8); border-radius: 7px; width: max-content;">&nbsp;${labels.Statistics}:
                <div>`
            );
            let total = statistics.reduce((a, b) => a + b);
            let positionList = (statistics.map((elem, idx) => ({'index': idx, 'value': elem}))
                                .filter((e) => e.index > 0 && e.value > 0)
                                .sort((a, b) => (a.value == b.value)? a.index - b.index : b.value - a.value));
            positionList.forEach((p) => {
                statisticsBox += `<div style="display: inline-block; width: 52px; text-align: center;">
                <img style="height: 48px; width: 48px; margin-bottom: -6px; cursor: pointer;" src="${preparePositionImage(p.index)}" hh_title="${window.GT.figures[p.index]}">
                <span>${Math.round(p.value / total * 1000) / 10}%</span></div>`;
            });
            statisticsBox += '</div>' + (attempts ? ('&nbsp;' + labels.Prev_stage + ': ' + attempts + ' ' + (attempts == 1 ? labels.attempt : labels.attempts) + '&nbsp;') : '') + '</div></div>';
            $('.champions-over__champion-wrapper').append(statisticsBox);
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
                    ui.position.top /= window.FullSize.scale;
                    ui.position.left /= window.FullSize.scale;
                },
                stop: function (event, ui) {
                    config.right = Math.round($(this).parent().width() - ui.position.left - $(this).width());
                    config.top = Math.round(ui.position.top);
                    $(this).css({'left': '', 'right': config.right + 'px'});
                    $(event.originalEvent.target).one('click', (e) => e.stopImmediatePropagation());
                }
            }).prepend(
                `<a class="eye" style="top: 3px; right: 3px; position: absolute; cursor: pointer;">
                <img src="${window.IMAGES_URL}/quest/ic_eyeclosed.svg" style="width: 30px; display: block;">
                <img src="${window.IMAGES_URL}/quest/ic_eyeopen.svg" style="width: 50px; display: none;">
                </div></a>`
            );
            if (config.visible == false) {
                $('#additionalInformation .eye').children().toggle();
                $('#additionalInformation .eye').next().toggle();
            }
        }

        //Add previous/next arrows in Places of Power to navigate easily between them
        function championShortcuts() {
            const champions_nb = parseInt(localStorage.getItem('HHS.nb_champions'), 10) || 6;
            let champions_id = [];
            for (let i=1; i<=champions_nb; i++) champions_id.push(i);
            const currentChampionId = parseInt(window.championData.champion.id, 10);

            $('.champions-over__champion-info').prepend(`<a href="${transformNutakuURL(`/champions/${champions_id[(champions_nb + (currentChampionId-2)) % champions_nb]}`)}" class="round_blue_button champion_shortcut" id="previous_champion"></a>`);
            $('#previous_champion').after(`<a href="${transformNutakuURL(`/champions/${champions_id[currentChampionId % champions_nb]}`)}" class="round_blue_button champion_shortcut" id="next_champion"></a>`);

            new MutationObserver(() => {
                if($('.section__battle-header').length > 0) {
                    if($('#previous_champion').length == 0) {
                        $('.section__battle-header').append(`<a href="${transformNutakuURL(`/champions/${champions_id[(champions_nb + (currentChampionId-2)) % champions_nb]}`)}" class="round_blue_button champion_shortcut" id="previous_champion"></a>`);
                        $('#previous_champion').after(`<a href="${transformNutakuURL(`/champions/${champions_id[currentChampionId % champions_nb]}`)}" class="round_blue_button champion_shortcut" id="next_champion"></a>`);
                    }
                }
            }).observe(document.querySelector('section'), {childList: true})
        }

        //Highlight champion girl's pose
        function highlightGirlPose() {
            const girl_figure = window.championData.champion.girl.figure;
            window.championData.champion.poses.forEach((pose, index) => {
                if(pose == girl_figure) {
                    $($('.champion-pose')[index]).addClass('matched');
                    $('.champion-pose')[index].setAttribute('tooltip', "");
                    $('.champion-pose')[index].setAttribute('hh_title', labels.champion_girl_pose);
                }
            });
        }

        //CSS
        sheet.insertRule(`.champions-bottom__ticket-amount {
            width: 145px;}`
        );

        sheet.insertRule(`.champions-bottom__ticket-amount.right {
            text-align: left;}`
        );

        sheet.insertRule(`.champion_shortcut {
            position: absolute;
            top: 5px;
            pointer-events: auto;
            background-size: 28px;
            background-position: center;
            background-repeat: no-repeat;}`
        );

        sheet.insertRule(`.champions-over__champion-info #previous_champion {
            left: -35px;
            background-image: url(https://cdn-icons-png.flaticon.com/64/2879/2879564.png);}`
        );

        sheet.insertRule(`.champions-over__champion-info #next_champion {
            left: 260px;
            background-image: url(https://cdn-icons-png.flaticon.com/64/2879/2879593.png);}`
        );

        sheet.insertRule(`.section__battle-header #previous_champion {
            top: 3px;
            left: 370px;
            background-image: url(https://cdn-icons-png.flaticon.com/64/2879/2879564.png);}`
        );

        sheet.insertRule(`.section__battle-header #next_champion {
            top: 3px;
            left: 640px;
            background-image: url(https://cdn-icons-png.flaticon.com/64/2879/2879593.png);}`
        );

        sheet.insertRule(`.round_blue_button.champion_shortcut {
            width: 30px;
            height: 30px;}`
        );

        sheet.insertRule(`.champion-pose.matched {
            filter: drop-shadow(0px 0px 3px #00ff00) drop-shadow(0px 0px 3px #00ff00) drop-shadow(0px 0px 3px #00ff00);}`
        );

        sheet.insertRule(`.champions-over__champion-wrapper {
            pointer-events: auto;}`
        );
    }
}


/* =======
    LINKS
   ======= */

function moduleLinks() {
    let time_now = window.server_now_ts;
    const options = {hour: '2-digit', minute: '2-digit'};

    // Current page: Homepage
    if (['home'].some(testPage)) home();
    // Current page: Pachinko
    else if (['pachinko'].some(testPage)) pachinko();
    // Current page: Activities
    else if (['activities'].some(testPage)){
        activities();
        if (!window.location.href.includes('?tab=pop&index')) popList();
        if (window.location.href.includes('?tab=pop&index')) {
            popShortcuts();
            popMission();
        }
    }
    // Current page: Champions
    else if (['champions'].some(testPage)) champions();
    else if (['/clubs.html', '/club-champion.html'].some(testPage) && !window.location.search.includes('&view_club')) clubChampion();
    // Current page: Market
    else if (['shop'].some(testPage)) collectBoostersFromMarket();
    else if (['map', 'world', 'quest', 'adventure'].some(testPage)) questTitle();
    else if (['path-of-valor'].some(testPage)) pov();
    else if (['path-of-glory'].some(testPage)) pog();
    else if (['/season.html'].some(testPage)) season();
    else if (['/penta-drill.html'].some(testPage)) pentaDrill();
    // Current page: Harem
    else if (['characters'].some(testPage) || ['harem'].some(testPage)) harem();

    getClubStatus();
    collectBoostersFromHeroUpdate();
    collectBoostersFromAjaxResponses();
    scriptTimers();

    //A supprimer dans quelques temps
    localStorage.removeItem("HHS.LeagueExists")
    localStorage.removeItem("HHS.SeasonExists")

    $('header .currency').before(
        `<div class="league_counter" id="LeagueTimer">
        <span class="league_icn" tooltip=""></span>
        <a href="${transformNutakuURL('/leagues.html')}">
        <div id="league_bar" class="tier_bar_league"></div>
        <div class="white_text centered_s" style="width: 100%;">
        <div id="league_data" style="width: 100%;">
        <span id="scriptLeagueAttempts">0</span>/<span rel="max">${heroData.energies.challenge.max_regen_amount}</span>
        <span id="scriptLeagueTimer" rel="league_count_txt" timeforsinglepoint="2100" timeonload="24"></span>
        </a></div></div></div>`
    );

    $('header .currency').before(
        `<div class="scriptSeasonInfo" id="FightSeason">
        <span class="season_icn" tooltip=""></span>
        <a href="${transformNutakuURL('/season-arena.html')}">
        <div id="kisses_bar" class="tier_bar_season"></div>
        <div class="white_text centered_s" style="width: 100%;">
        <div id="scriptSeasonTime" style="width: 100%;">
        <span id="scriptSeasonAttempts">0</span>/<span rel="max">${heroData.energies.kiss.max_regen_amount}</span>
        <span id="scriptSeasonTimer" rel="season_count_txt" timeforsinglepoint="3600" timeonload="24"></span>
        </a></div></div></div>`
    );

    if (window.shared.Hero.energies.drill != undefined) {
    $('header .currency').before(
        `<div class="scriptPentaDrillInfo" id="FightPentaDrill">
        <span class="pentaDrill_icn" tooltip=""></span>
        <a href="${transformNutakuURL('/penta-drill-arena.html')}">
        <div id="drill_bar" class="tier_bar_pentaDrill"></div>
        <div class="white_text centered_s" style="width: 100%;">
        <div id="scriptPentaDrillTime" style="width: 100%;">
        <span id="scriptPentaDrillAttempts">0</span>/<span rel="max">${heroData.energies.drill.max_regen_amount}</span>
        <span id="scriptPentaDrillTimer" rel="pentaDrill_count_txt" timeforsinglepoint="3600" timeonload="24"></span>
        </a></div></div></div>`
    );
    }

    if (heroData.infos.level >= 15 && heroData.energies.worship != undefined) {
        $('header .currency').before(
            `<div class="scriptPantheonInfo" id="FightPantheon">
            <span class="pantheon_icn" tooltip=""></span>
            <a href="${transformNutakuURL('/pantheon.html')}">
            <div id="worship_bar" class="tier_bar_pantheon"></div>
            <div class="white_text centered_s" style="width: 100%;">
            <div id="worship_data" style="width: 100%;">
            <span id="scriptPantheonAttempts">0</span>/<span rel="max">${heroData.energies.worship.max_regen_amount}</span>
            <span id="scriptPantheonTimer" rel="pantheon_count_txt" timeforsinglepoint="8640"></span>
            </a></div></div></div>`
        );
    }

    if ((JSON.parse(localStorage.getItem("HHS.popListId")) || []).length > 0) {
        $('header .currency').before(
            `<div class="pop_timer" id="PoPTimer" tooltip="">
            <a href="${transformNutakuURL('/activities.html?tab=pop')}">
            <div id="pop_bar" class="tier_bar_pop"></div>
            <div class="white_text centered_s" style="width: 100%;">
            <div id="pop_data" style="width: 100%;">${((window.HH_UNIVERSE == 'mangarpg_m') ? labels.expeditions : labels.pop)}
            <span id="scriptPoPTimer" rel="pop_count_txt"></span>
            </a></div></div></div>`
        );
    }

    $('#fight_energy_bar .hudBattlePts_mix_icn')[0].className = "trollPts_icn";
    document.querySelector('.trollPts_icn').removeAttribute('energy-fight-tooltip');
    document.querySelector('.trollPts_icn').setAttribute('tooltip', "");

    $('#quest_energy_bar .hudEnergy_mix_icn')[0].className = "energy_icn";
    document.querySelector('.energy_icn').removeAttribute('energy-quest-tooltip');
    document.querySelector('.energy_icn').setAttribute('tooltip', "");
    document.querySelector('.energy_counter_bar').setAttribute('tooltip', "");


    function scriptTimers(){
        questLink();

        addBoosterStatus();

        setInterval(() => {
            questTooltip();
            trollTooltip();
            popTimer();
            if (heroData.infos.level >= 20) leagueBattles();
            seasonBattles();
            if (window.shared.Hero.energies.drill != undefined) pentaDrillBattles();
            if (heroData.energies.worship != undefined && heroData.infos.level >= 15) pantheonBattles();
            addBoosterStatus();
        }, 1000);
    }

    function questTitle(){
        $('#breadcrumbs').css('z-index', '99');
        $('#breadcrumbs').css('top', '67px');
        $('.ico-quest[href="/quest/1305"]').css('top', '0%');
    }

    function questLink() {
        let quest_link = heroData.infos.questing.current_url;
        if (!quest_link.includes('quest') && heroData.infos.questing.id_world >= (trolls.length+1)) quest_link = "/champions-help.html";
        else quest_link = "/quest/" + heroData.infos.questing.id_quest;

        const $energybar = $('#quest_energy_bar .energy_counter_bar .bar-wrapper .over');
        $energybar.prepend(`<a href="${transformNutakuURL(quest_link)}"></a>`);
        $energybar.find('a').append($energybar.find('.energy_counter_amount'));
        $energybar.find('a').append($energybar.find('span[rel="count_txt"]'));
    }

    function questTooltip() {
        $('#energyTool').empty();

        let current_quest_energy = parseInt(heroData.energies.quest.amount, 10);
        const max_quest_energy = parseInt(heroData.energies.quest.max_regen_amount, 10);
        const time_for_new_quest = parseInt(heroData.energies.quest.seconds_per_point, 10);
        let remaining_quest_time = parseInt(heroData.energies.quest.next_refresh_ts, 10);
        let full_remaining_quest_time = remaining_quest_time + Math.max(0, (max_quest_energy-current_quest_energy-1))*time_for_new_quest;
        let full_quest_date = time_now + full_remaining_quest_time;

        if (current_quest_energy >= max_quest_energy) {
            document.querySelector('.energy_icn').setAttribute('hh_title',
                `<h5 class="">${labels.energy}</h5>
                <span class="orange" rel="timer">${labels.full}</span>`
            );

            document.querySelector('.energy_counter_bar').setAttribute('hh_title',
                `<h5 class="">${labels.energy}</h5>
                <span class="orange" rel="timer">${labels.full}</span>`
            );
        }
        else {
            document.querySelector('.energy_icn').setAttribute('hh_title',
                `<h5 class="">${labels.energy}</h5>
                ${labels.full_in} <span class="orange" rel="timer">${calculateTime(full_quest_date*1000)}</span><BR>
                ${labels.ends_at} <span class="orange" rel="timer">${new Date(full_quest_date*1000).toLocaleTimeString(undefined, options)}</span><BR>
                ${labels.date_on} ${new Date(full_quest_date*1000).toLocaleDateString()}`
            );

            document.querySelector('.energy_counter_bar').setAttribute('hh_title',
                `<h5 class="">${labels.energy}</h5>
                ${labels.full_in} <span class="orange" rel="timer">${calculateTime(full_quest_date*1000)}</span><BR>
                ${labels.ends_at} <span class="orange" rel="timer">${new Date(full_quest_date*1000).toLocaleTimeString(undefined, options)}</span><BR>
                ${labels.date_on} ${new Date(full_quest_date*1000).toLocaleDateString()}`
            );
        }
    }

    function trollTooltip() {
        let current_troll_energy = parseInt(heroData.energies.fight.amount, 10);
        const max_troll_energy = parseInt(heroData.energies.fight.max_regen_amount, 10);
        const time_for_new_troll = parseInt(heroData.energies.fight.seconds_per_point, 10);
        let remaining_troll_time = parseInt(heroData.energies.fight.next_refresh_ts, 10);
        let full_remaining_troll_time = remaining_troll_time + Math.max(0, (max_troll_energy-current_troll_energy-1))*time_for_new_troll;
        let full_troll_date = time_now + full_remaining_troll_time;

        if (current_troll_energy >= max_troll_energy) {
            document.querySelector('.trollPts_icn').setAttribute('hh_title',
                `<h5 class="">${labels.combativity}</h5>
                <span class="orange" rel="timer">${labels.full}</span>`
            );
        }
        else {
            document.querySelector('.trollPts_icn').setAttribute('hh_title',
                `<h5 class="">${labels.combativity}</h5>
                ${labels.full_in} <span class="orange" rel="timer">${calculateTime(full_troll_date*1000)}</span><BR>
                ${labels.ends_at} <span class="orange" rel="timer">${new Date(full_troll_date*1000).toLocaleTimeString(undefined, options)}</span><BR>
                ${labels.date_on} ${new Date(full_troll_date*1000).toLocaleDateString()}`
            );
        }
    }

    function popList() {
        for (let i=1; i<=15; i++) {
            localStorage.removeItem(`HHS.pop_${i}_can_start`);
            localStorage.removeItem(`HHS.popTime${i}`);
            localStorage.removeItem(`HHS.popDate${i}`);
        }
        localStorage.removeItem("HHS.pop_list_id");
        localStorage.removeItem("HHS.nb_Pop");

        let popIdList = [];
        let popMap = new Map();
        let popAll = (document.getElementsByClassName("pop_thumb").length > 0) ? document.getElementsByClassName("pop_thumb") : document.getElementsByClassName("pop-record");
        for (let i=0; i<popAll.length; i++) {
            let className = popAll[i].className;
            if (!className.includes('greyed')) {
                let id = (document.getElementsByClassName("pop_thumb").length > 0) ? parseInt(popAll[i].attributes.pop_id.nodeValue, 10) : parseInt(popAll[i].attributes["data-pop-id"].value, 10);
                if ((id >= 7 && id <= 9) || (id >= 13 && id <= 15)) {
                    $('div.pop_thumb_container:nth-child(3)').after($(`div.pop_thumb_container:nth-child(${(i+1)})`));
                    popIdList.splice(3, 0, id);
                }
                else popIdList.push(id);

                let popData = window.pop_data[id];
                let popInfo = {id: id,
                                status: popData.status,
                                duration: popData.time_to_finish,
                                end_date: Math.floor(new Date().getTime()/1000) + parseInt(popData.remaining_time, 10)
                };
                popMap.set(id, popInfo);
            }
        }
        localStorage.setItem('HHS.popListId', JSON.stringify(popIdList));
        localStorage.setItem('HHS.popMap', JSON.stringify(Array.from(popMap.entries())));
    }

    function popMission() {
        let popMap = (!localStorage.getItem('HHS.popMap')) ? new Map(): new Map(JSON.parse(localStorage.getItem('HHS.popMap')));

        //Update data for all Pop
        const popList = JSON.parse(localStorage.getItem('HHS.popListId')) || [];
        for (let i=0; i<popList.length; i++) {
            let popData = window.pop_data[popList[i]];
            let popInfo = {id: popData.id_places_of_power,
                            status: popData.status,
                            duration: popData.time_to_finish,
                            end_date: Math.floor(new Date().getTime()/1000) + parseInt(popData.remaining_time, 10)
                        };
            popMap.set(popData.id_places_of_power, popInfo);
        }
        localStorage.setItem('HHS.popMap', JSON.stringify(Array.from(popMap.entries())));

        if ($('#pop_info .pop_central_part.dark_subpanel_box button.blue_button_L').length > 0) {
            let button = document.querySelector('#pop_info .pop_central_part.dark_subpanel_box button.blue_button_L');
            button.addEventListener('click', () => {
                let popRemainingTime = parseTime($('.pop_remaining > span:nth-child(1)')[0].innerText);

                let popInfo = popMap.get(window.pop_index);
                popInfo.status = 'in_progress';
                popInfo.duration = popRemainingTime;
                popInfo.end_date = Math.floor(new Date().getTime()/1000) + popRemainingTime;
                popMap.set(window.pop_index, popInfo);

                localStorage.setItem('HHS.popMap', JSON.stringify(Array.from(popMap.entries())));
            });
        }

        if ($('#pop #pop_info .pop_right_part .grid_view').length > 0) {
            displayClassGirl();
            new MutationObserver(() => {displayClassGirl();}).observe($('#pop .pop_right_part .grid_view')[0], {childList: true})
        }

        function displayClassGirl() {
            if ($('#pop #pop_info .pop_right_part .grid_view .no_girls_message').length > 0) return;

            let girls = $('#pop #pop_info .pop_right_part .grid_view')[0].children;
            for (let i=0; i<girls.length; i++) {
                try {
                    if (girls[i].children[0].children[0].attributes["data-new-girl-tooltip"] != undefined) {
                        let girl_pose = parseInt(JSON.parse(girls[i].children[0].children[0].attributes["data-new-girl-tooltip"].nodeValue).position_img.replace(/[^\d]/g, ""), 10);
                        $($('#pop #pop_info .pop_right_part .grid_view')[0].children[i]).find('.girl_action').append(
                            $(`<div class="classGirl" style="background-image: url(${window.IMAGES_URL}/pictures/misc/items_icons/${GIRL_POSE_CLASS[girl_pose]}.png)"></div>`)
                        );
                    }
                } catch(err) {console.log(`HH++ OCD script error (Problem with girls class display): ${err.name}\n ${err.message}\n ${err.stack}`)}
            }

            //CSS
            sheet.insertRule(`.classGirl {
                position: relative;
                height: 17px;
                width: 17px;
                top: -93px;
                left: 45px;
                border: none;
                background-size: 17px;
                background-repeat: no-repeat;}`
            );
        }
    }

    function popTimer() {
        const popMap = (!localStorage.getItem('HHS.popMap')) ? new Map(): new Map(JSON.parse(localStorage.getItem('HHS.popMap')));
        const popList = JSON.parse(localStorage.getItem('HHS.popListId')) || [];
        const nb_Pop = popList.length;
        let popDate = [];
        let popTime = [];
        let time_remaining = 0;
        let pop_percent = 100;
        let pop_can_start = false;

        if (nb_Pop > 0) {
            for (let i=0; i<nb_Pop; i++) {
                if (popMap.get(popList[i]).status == "can_start") {
                    pop_can_start = true;
                }
                else {
                    popDate.push(popMap.get(popList[i]).end_date);
                    popTime.push(popMap.get(popList[i]).duration);
                }
            }
            let popDateMin = Math.min(...popDate);
            if (popDateMin == Infinity) {
                popDateMin = Math.floor(new Date().getTime()/1000);
            }
            time_remaining = popDateMin - Math.floor(new Date().getTime()/1000) || 0;
            let index = popDate.indexOf(popDateMin);
            pop_percent = Math.min(100, ((popTime[index]-(popDate[index]-Math.floor(new Date().getTime()/1000)))/popTime[index])*100);

            $('#scriptPoPTimer').html(` ${labels.in} <span rel=\"pop_count\">${convertToTimeFormat(time_remaining)}</span>`);
            $('#pop_bar').css('width', `${pop_percent}%`);

            if (time_remaining > 0) {
                $('.tier_bar_pop').css('background-image', 'linear-gradient(90deg,#780049,#c80053)');

                document.querySelector('#PoPTimer').setAttribute('hh_title',
                    `${labels.ends_at} <span class="orange" rel="timer">${new Date(popDateMin*1000).toLocaleTimeString(undefined, options)}</span><BR>
                    ${labels.date_on} ${new Date(popDateMin*1000).toLocaleDateString()}`
                );

                if (pop_can_start == true) $('#scriptPoPTimer').css('color', 'orange');
                else $('#scriptPoPTimer').css('color', '#8ec3ff');
            }
            else $('.tier_bar_pop').css('background-image', 'linear-gradient(to top,#008ed5 0,#05719c 100%)');
        }
    }

    //Add previous/next arrows in Places of Power to navigate easily between them
    function popShortcuts() {
        let currentPop = window.pop_index;
        let popList = JSON.parse(localStorage.getItem("HHS.popListId"));
        let currentIndex = popList.indexOf(currentPop);
        let previousPop = (currentIndex == 0) ? popList[popList.length - 1] : popList[currentIndex-1];
        let nextPop = (currentIndex == popList.length - 1) ? popList[0] : popList[currentIndex+1];

        $('.pop_right_part').prepend(`<a href="${transformNutakuURL(`/activities.html?tab=pop&index=${previousPop}`)}" class="back_button" id="previous_pop"></a>`);
        $('.pop_right_part a:nth-child(1)').after(`<a href="${transformNutakuURL(`/activities.html?tab=pop&index=${nextPop}`)}" class="back_button" id="next_pop"></a>`);

        //CSS
        sheet.insertRule(`#previous_pop {
            position: absolute;
            background-image: url(https://cdn-icons-png.flaticon.com/64/2879/2879564.png) !important;
            background-size: 38px;
            background-position: center;
            background-repeat: no-repeat;}`
        );

        sheet.insertRule(`${mediaDesktop} {
                #previous_pop {
            top: 518px !important;
            right: 301px;}}`
        );

        sheet.insertRule(`${mediaMobile} {
                #previous_pop {
            top: 495px !important;
            right: 317px;}}`
        );

        sheet.insertRule(`#next_pop {
            position: absolute;
            background-image: url(https://cdn-icons-png.flaticon.com/64/2879/2879593.png) !important;
            background-size: 38px;
            background-position: center;
            background-repeat: no-repeat;}`
        );

        sheet.insertRule(`${mediaDesktop} {
                #next_pop {
            top: 518px !important;
            right: 14px;}}`
        );

        sheet.insertRule(`${mediaMobile} {
                #next_pop {
            top: 495px !important;
            right: 15px;}}`
        );

        sheet.insertRule(`button[rel=pop_finish] {
            margin-right: 16px;}`
        );

        sheet.insertRule(`${mediaMobile} {
                #pop .pop_central_part > button[rel="pop_finish"] {
            margin-top: -22px;}}`
        );

        sheet.insertRule(`${mediaDesktop} {
                #pop .pop_right_part > [rel="pop_auto_assign"] {
            height: auto;
            min-height: 40px;
            max-width: 210px;}}`
        );

        sheet.insertRule(`${mediaMobile} {
                #pop .pop_right_part > [rel="pop_auto_assign"] {
            height: auto;
            min-height: 56px;
            max-width: 210px;}}`
        );

        sheet.insertRule(`${mediaDesktop} {
                #pop .pop_right_part .grid_view {
            height: 330px;}}`
        );

        sheet.insertRule(`${mediaMobile} {
                #pop .pop_right_part .grid_view {
            height: 320px;}}`
        );

        sheet.insertRule(`#pop .pop_rewards_container.pop_rewards_page {
            margin-top: 15px;}`
        );

        sheet.insertRule(`#pop .pop_central_part .pop_remaining {
            margin-top: 0px;}`
        );

        sheet.insertRule(`${mediaMobile} {
                #pop_info .pop_left_part .shards_bar_wrapper.shards_bar_page {
            margin-top: 380px;}}`
        );

        sheet.insertRule(`#pop .pop_rewards_container .pop_rewards .reward_wrap > div {
            margin-right: 35px;}`
        );

        sheet.insertRule(`${mediaMobile} {
                #pop .pop_central_part > button[rel="pop_claim"] {
            margin-top: 0px;}}`
        );

        sheet.insertRule(`${mediaMobile} {
                #pop .pop_central_part .pop_remaining_state {
            top: -15px;}}`
        );

        sheet.insertRule(`${mediaMobile} {
                #pop .pop_central_part > .hh_bar {
            margin-top: 17px;}}`
        );
    }

    function leagueBattles() {
        let time = Math.floor(new Date().getTime()/1000);
        let attempts = parseInt(heroData.energies.challenge.amount, 10);
        const max_attempts = parseInt(heroData.energies.challenge.max_regen_amount, 10);
        const time_for_new_battle = parseInt(heroData.energies.challenge.seconds_per_point, 10);
        let league_next_battle_in = parseInt(heroData.energies.challenge.next_refresh_ts, 10);
        let league_time_full = time_now + league_next_battle_in + Math.max(0, (max_attempts-attempts-1))*time_for_new_battle;
        let remaining_full_time = league_time_full-time;
        let remaining_next_battle = remaining_full_time%time_for_new_battle;

        if ((attempts < max_attempts) && (CurrentPage.indexOf('leagues') == -1))
            attempts = max_attempts - Math.max(0, Math.ceil(remaining_full_time/time_for_new_battle));
        let league_percent = (Math.min(attempts, max_attempts)/max_attempts)*100;
        $('#league_bar').css('width', league_percent + '%');
        $('#scriptLeagueAttempts').text(attempts);

        if(attempts < max_attempts) {
            $('#scriptLeagueTimer').html(` +1 ${labels.in} <span rel=\"count\">${convertToTimeFormat(remaining_next_battle)}</span>`);
            document.querySelector('.league_icn').setAttribute('hh_title',
                `<h5 class="">${labels.league}</h5>
                ${labels.full_in} <span class="orange" rel="timer">${convertToTimeFormat(remaining_full_time)}</span><BR>
                ${labels.ends_at} <span class="orange" rel="timer">${new Date(league_time_full*1000).toLocaleTimeString(undefined, options)}</span><BR>
                ${labels.date_on} ${new Date(league_time_full*1000).toLocaleDateString()}`
            );
            $('.tier_bar_league').css('background-image', 'linear-gradient(90deg,#780049,#c80053)');
        }
        else {
            $('#scriptLeagueTimer').empty();
            document.querySelector('.league_icn').setAttribute('hh_title',
                `<h5 class="">${labels.league}</h5>
                <span class="orange" rel="timer">${labels.full}</span>`
            );
            $('.tier_bar_league').css('background-image', 'linear-gradient(to top,#008ed5 0,#05719c 100%)');
        }
    }

    function seasonBattles() {
        let time = Math.floor(new Date().getTime()/1000);
        let timestamp_last_kiss = parseInt(heroData.energies.kiss.update_ts, 10);
        let current_kisses = parseInt(heroData.energies.kiss.amount, 10);
        const max_kisses_number = parseInt(heroData.energies.kiss.max_regen_amount, 10);
        const time_for_new_kiss = parseInt(heroData.energies.kiss.seconds_per_point, 10);
        let new_kiss_in = parseInt(heroData.energies.kiss.next_refresh_ts, 10);
        let full_time_remaining = new_kiss_in + Math.max(0, (max_kisses_number-current_kisses-1))*time_for_new_kiss;
        let season_date_full = time_now + full_time_remaining;
        let season_time_remaining = season_date_full - time;
        let current_date = Math.floor(new Date().getTime()/1000);
        let all_kisses = current_kisses;
        let time_passed_sec = current_date - timestamp_last_kiss;

        if (current_kisses < max_kisses_number) {
            all_kisses = max_kisses_number - Math.max(0, Math.ceil((season_date_full - current_date)/time_for_new_kiss));
        }

        let kisses_percent = (Math.min(all_kisses, max_kisses_number)/max_kisses_number)*100;
        $('#kisses_bar').css('width', kisses_percent + '%');

        $('#scriptSeasonAttempts').text(all_kisses);

        if (all_kisses < max_kisses_number) {
            $('#scriptSeasonTimer').html(
                ` +1 ${labels.in} <span rel=\"season_count\">${convertToTimeFormat(Math.floor(time_for_new_kiss - (time_passed_sec%time_for_new_kiss)))}</span>`
            );
            document.querySelector('.season_icn').setAttribute('hh_title',
                `<h5 class="">${window.GT.design.Season}</h5>
                ${labels.full_in} <span class="orange" rel="timer">${convertToTimeFormat(season_time_remaining)}</span><BR>
                ${labels.ends_at} <span class="orange" rel="timer">${new Date((time_now + full_time_remaining)*1000).toLocaleTimeString(undefined, options)}</span><BR>
                ${labels.date_on} ${new Date((time_now + full_time_remaining)*1000).toLocaleDateString()}`
            );
            $('.tier_bar_season').css('background-image', 'linear-gradient(90deg,#780049,#c80053)');
        }
        else {
            $('#scriptSeasonTimer').empty();
            document.querySelector('.season_icn').setAttribute('hh_title',
                `<h5 class="">${window.GT.design.Season}</h5>
                <span class="orange" rel="timer">${labels.full}</span>`
            );
            $('.tier_bar_season').css('background-image', 'linear-gradient(to top,#008ed5 0,#05719c 100%)');
        }
    }

    function pentaDrillBattles() {
        let time = Math.floor(new Date().getTime()/1000);
        let timestamp_last_drill = parseInt(heroData.energies.drill.update_ts, 10);
        let current_drill = parseInt(heroData.energies.drill.amount, 10);
        const max_drill_number = parseInt(heroData.energies.drill.max_regen_amount, 10);
        const time_for_new_drill = parseInt(heroData.energies.drill.seconds_per_point, 10);
        let new_drill_in = parseInt(heroData.energies.drill.next_refresh_ts, 10);
        let full_time_remaining = new_drill_in + Math.max(0, (max_drill_number-current_drill-1))*time_for_new_drill;
        let pentaDrill_date_full = time_now + full_time_remaining;
        let pentaDrill_time_remaining = pentaDrill_date_full - time;
        let current_date = Math.floor(new Date().getTime()/1000);
        let all_drill = current_drill;
        let time_passed_sec = current_date - timestamp_last_drill;

        if (current_drill < max_drill_number) {
            all_drill = max_drill_number - Math.max(0, Math.ceil((pentaDrill_date_full - current_date)/time_for_new_drill));
        }

        let drill_percent = (Math.min(all_drill, max_drill_number)/max_drill_number)*100;
        $('#drill_bar').css('width', drill_percent + '%');

        $('#scriptPentaDrillAttempts').text(all_drill);

        if (all_drill < max_drill_number) {
            $('#scriptPentaDrillTimer').html(
                ` +1 ${labels.in} <span rel=\"pentaDrill_count\">${convertToTimeFormat(Math.floor(time_for_new_drill - (time_passed_sec%time_for_new_drill)))}</span>`
            );
            document.querySelector('.pentaDrill_icn').setAttribute('hh_title',
                `<h5 class="">${window.GT.design.penta_drill}</h5>
                ${labels.full_in} <span class="orange" rel="timer">${convertToTimeFormat(pentaDrill_time_remaining)}</span><BR>
                ${labels.ends_at} <span class="orange" rel="timer">${new Date((time_now + full_time_remaining)*1000).toLocaleTimeString(undefined, options)}</span><BR>
                ${labels.date_on} ${new Date((time_now + full_time_remaining)*1000).toLocaleDateString()}`
            );
            $('.tier_bar_pentaDrill').css('background-image', 'linear-gradient(90deg,#780049,#c80053)');
        }
        else {
            $('#scriptPentaDrillTimer').empty();
            document.querySelector('.pentaDrill_icn').setAttribute('hh_title',
                `<h5 class="">${window.GT.design.penta_drill}</h5>
                <span class="orange" rel="timer">${labels.full}</span>`
            );
            $('.tier_bar_pentaDrill').css('background-image', 'linear-gradient(to top,#008ed5 0,#05719c 100%)');
        }
    }

    function pantheonBattles() {
        let time = Math.floor(new Date().getTime()/1000);
        let timestamp_last_worship = parseInt(heroData.energies.worship.update_ts, 10);
        let current_worships = parseInt(heroData.energies.worship.amount, 10);
        const max_worships_number = parseInt(heroData.energies.worship.max_regen_amount, 10);
        const time_for_new_worship = parseInt(heroData.energies.worship.seconds_per_point, 10);
        let new_worship_in = parseInt(heroData.energies.worship.next_refresh_ts, 10);
        let full_time_remaining = new_worship_in + Math.max(0, (max_worships_number-current_worships-1))*time_for_new_worship;
        let pantheon_date_full = time_now + full_time_remaining;
        let pantheon_time_remaining = pantheon_date_full - time;
        let current_date = Math.floor(new Date().getTime()/1000);
        let all_worships = current_worships;
        let time_passed_sec = current_date - timestamp_last_worship;

        if (current_worships < max_worships_number) {
            all_worships = max_worships_number - Math.max(0, Math.ceil((pantheon_date_full - current_date)/time_for_new_worship));
        }

        let worships_percent = (Math.min(all_worships, max_worships_number)/max_worships_number)*100;
        $('#worship_bar').css('width', worships_percent + '%');

        $('#scriptPantheonAttempts').text(all_worships);

        if (all_worships < max_worships_number) {
            $('#scriptPantheonTimer').html(
                ` +1 ${labels.in} <span rel=\"pantheon_count\">${convertToTimeFormat(Math.floor(time_for_new_worship - (time_passed_sec%time_for_new_worship)))}</span>`
            );
            document.querySelector('.pantheon_icn').setAttribute('hh_title',
                `<h5 class="">${window.GT.design.pantheon}</h5>
                ${labels.full_in} <span class="orange" rel="timer">${convertToTimeFormat(pantheon_time_remaining)}</span><BR>
                ${labels.ends_at} <span class="orange" rel="timer">${new Date((time_now + full_time_remaining)*1000).toLocaleTimeString(undefined, options)}</span><BR>
                ${labels.date_on} ${new Date((time_now + full_time_remaining)*1000).toLocaleDateString()}`
            );
            $('.tier_bar_pantheon').css('background-image', 'linear-gradient(90deg,#780049,#c80053)');
        }
        else {
            $('#scriptPantheonTimer').empty();
            document.querySelector('.pantheon_icn').setAttribute('hh_title',
                `<h5 class="">${window.GT.design.pantheon}</h5>
                <span class="orange" rel="timer">${labels.full}</span>`
            );
            $('.tier_bar_pantheon').css('background-image', 'linear-gradient(to top,#008ed5 0,#05719c 100%)');
        }
    }

    function home() {
        //Missions timer
        let next_missions_remaining_date = 0;
        if (window.missions_datas.reward == false && window.missions_datas.remaining_time == null) {
            next_missions_remaining_date = parseInt(localStorage.getItem("HHS.nextMissionsDate"), 10);

            if (time_now*1000 < next_missions_remaining_date) {
                $('#home_missions_bar1 .mission-timer-container .timer span[rel="expires"]').remove();
                $('#home_missions_bar1 .mission-timer-container .timer').append(`<div><span id="missionsTimer1" style="text-align: left;">${calculateTime(next_missions_remaining_date)}</span></div>`);
                $('#home_missions_bar2 .mission-timer-container .timer span[rel="expires"]').remove();
                $('#home_missions_bar2 .mission-timer-container .timer').append(`<div><span id="missionsTimer2" style="text-align: left;">${calculateTime(next_missions_remaining_date)}</span></div>`);
            }
        }
        else if (window.missions_datas.reward == true && window.missions_datas.remaining_time == null) {
            $('#home_missions_bar1 .mission-timer-container .timer span[rel="expires"]').remove();
            $('#home_missions_bar1 .mission-timer-container .timer').append(`<div><span id="missionsTimer1" style="text-align: left;">${calculateTime(time_now)}</span></div>`);
            $('#home_missions_bar2 .mission-timer-container .timer span[rel="expires"]').remove();
            $('#home_missions_bar2 .mission-timer-container .timer').append(`<div><span id="missionsTimer2" style="text-align: left;">${calculateTime(time_now)}</span></div>`);
        }


        //Market timer
        if($('#homepage .main-container .left-side-container a[rel="shop"] .notif-position .additional-menu-data .timer-box .timerClock_icn').length == 0) {
            let market = $('#homepage .main-container .left-side-container a[rel="shop"] .notif-position .additional-menu-data .timer-box');
            market.append(`<div class="timer"><span class="timerClock_icn"></span><span rel="expires">0s</span></div>`);
            $('#homepage .main-container .left-side-container a[rel="shop"] .notif-position .additional-menu-data .timer').css('display', 'flex');
        }

        if ($('.script-booster-status .slot:not(.mythic):not(.empty)').length > 0) $('#homepage a[rel=shop]').find('.expired_notification_icn').remove();

        //Pachinko timer
        let pachinkoTime = localStorage.getItem("HHS.pachinkoTime");
        let pachinko = $('a[href$="pachinko.html"]>.notif-position>span');
        pachinko.append(
            `<div id="home_pachinko_bar">
            <div class="pachinko-timer-container">
            <span class="timerClock_icn"></span>
            <div class="text"><span id="scriptPachinkoTimer">${calculateTime(pachinkoTime)}</span></div>
            </div></div>`
        );

        //Champions timer
        let championsTime = (parseInt(localStorage.getItem("HHS.championsTime"), 10) > time_now*1000) ? parseInt(localStorage.getItem("HHS.championsTime"), 10) : (parseInt($('.champion-timer').attr('timer'), 10)*1000 || parseInt($('#champion-timer').attr('timer'), 10)*1000 || 0);
        if (championsTime > time_now*1000) {
            let champions = $('a[rel="god-path"]>.notif-position>span');
            $('.champion-timer').remove();
            $('#champion-timer').remove();

            champions.append(
                `<div id="home_champions_bar">
                <div class="champions-timer-container">
                <span class="timerClock_icn"></span>
                <div class="text"><span id="scriptChampionsTimer">${calculateTime(championsTime)}</span></div>
                </div></div>`
            );

            if (lang != "en") champions.css('height', '81px');
        }

        //Club Champion timer
        let clubChampionTime = (parseInt(localStorage.getItem("HHS.clubChampionTime"), 10) > time_now*1000) ? parseInt(localStorage.getItem("HHS.clubChampionTime"), 10) : 0;
        if (clubChampionTime > time_now*1000) {
            $('a[rel=clubs] span[rel=expires]').remove();
            $('a[rel=clubs] .timerClock_icn').after(`<span id="scriptClubChampionTimer">${calculateTime(clubChampionTime)}</span>`);
        }

        //PoV timer
        let povTime = (localStorage.getItem("HHS.PovTime") == "NaN") ? 0 : localStorage.getItem("HHS.PovTime");
        if (heroData.infos.level >= 30) {
            let pov = $('a[rel="path-of-valor"]>.notif-position>.pov-widget:not(.locked-pov-widget)>.h_container');
            pov.append(
                `<div id="home_pov_bar">
                <div class="pov-timer-container">
                <span class="timerClock_icn"></span>
                <div class="text"><span id="scriptPovTime">${calculateTime(povTime*1000)}</span></div>
                </div></div>`
            );

            $('#homepage .pov-button a[rel="path-of-valor"] .severalQoL-PoVPoG-timer').remove();
            new MutationObserver(() => {
                if($('#homepage .pov-button a[rel="path-of-valor"] .white_text .severalQoL-PoVPoG-timer').length > 0)
                    $('#homepage .pov-button a[rel="path-of-valor"] .white_text .severalQoL-PoVPoG-timer').remove();
            }).observe(document.querySelector('#homepage .pov-button a[rel="path-of-valor"] .white_text'), {childList: true})
        }

        //PoG timer
        let pogTime = (localStorage.getItem("HHS.PogTime") == "NaN") ? 0 : localStorage.getItem("HHS.PogTime");
        if (heroData.infos.level >= 30) {
            let pog = $('a[rel="path-of-glory"]>.notif-position>.pov-widget:not(.locked-pov-widget)>.h_container');
            pog.append(
                `<div id="home_pog_bar">
                <div class="pog-timer-container">
                <span class="timerClock_icn"></span>
                <div class="text"><span id="scriptPogTime">${calculateTime(pogTime*1000)}</span></div>
                </div></div>`
            );

            $('#homepage .pov-button a[rel="path-of-glory"] .severalQoL-PoVPoG-timer').remove();
            new MutationObserver(() => {
                if($('#homepage .pov-button a[rel="path-of-glory"] .white_text .severalQoL-PoVPoG-timer').length > 0)
                    $('#homepage .pov-button a[rel="path-of-glory"] .white_text .severalQoL-PoVPoG-timer').remove();
            }).observe(document.querySelector('#homepage .pov-button a[rel="path-of-glory"] .white_text'), {childList: true})
        }

        //Add sub-menus for Champions
        let championsMenu_map = `<a class="champions_menu champions_map" href="${transformNutakuURL('/champions-map.html')}">${window.GT.design.Champions}</a>`;
        if (window.HH_UNIVERSE != 'mangarpg_m') {
            $('a[rel="god-path"]').append(championsMenu_map);
        }
        if (window.HH_UNIVERSE == 'mangarpg_m') $('a[rel="god-path"]').append(championsMenu_map);

        if (['hentai', 'nutaku', 'test_h', 'hh_eroges', 'gay', 'gh_nutaku', 'gh_eroges'].some(testUniverse)) {
            let championsMenu_Romero = `<a class="champions_menu champion1" href="${transformNutakuURL('/champions/1')}">Romero</a>`;
            let championsMenu_Whaty = `<a class="champions_menu champion2" href="${transformNutakuURL('/champions/2')}">Whaty</a>`;
            let championsMenu_Matsuda = `<a class="champions_menu champion3" href="${transformNutakuURL('/champions/3')}">Matsuda</a>`;
            let championsMenu_Ryu = `<a class="champions_menu champion4" href="${transformNutakuURL('/champions/4')}">Ryu</a>`;
            let championsMenu_Visor = `<a class="champions_menu champion5" href="${transformNutakuURL('/champions/5')}">Visor</a>`;
            let championsMenu_Alban = `<a class="champions_menu champion6" href="${transformNutakuURL('/champions/6')}">Alban</a>`;

            $('a[rel="god-path"]').append(championsMenu_Romero);
            $('a[rel="god-path"]').append(championsMenu_Whaty);
            $('a[rel="god-path"]').append(championsMenu_Matsuda);
            $('a[rel="god-path"]').append(championsMenu_Ryu);
            $('a[rel="god-path"]').append(championsMenu_Visor);
            $('a[rel="god-path"]').append(championsMenu_Alban);
        }

        if (heroData.energies.worship != undefined) {
            let championsMenu_pantheon = `<a class="champions_menu pantheon" href="${transformNutakuURL('/pantheon.html')}">${window.GT.design.pantheon}</a>`;
            if (heroData.infos.level >= 15) $('a[rel="god-path"]').append(championsMenu_pantheon);
        }

        if (window.HH_UNIVERSE != 'horny_s') {
            let championsMenu_labyrinth = `<a class="champions_menu labyrinth" href="${transformNutakuURL('/labyrinth-entrance.html')}">${window.GT.design.labyrinth}</a>`;
            $('a[rel="god-path"]').append(championsMenu_labyrinth);
        }

        //Club champion shortcut
        let clubChampion = `<a class="round_blue_button clubChampion" href="${transformNutakuURL('/club-champion.html')}"><div class="clubChampions_flat_icn"></div></a>`;
        $('a[rel="clubs"]').after(clubChampion);

        //Add sub-menus for Activities
        let dailyGoalsMenu = `<a class="daily_goals_menu" href="${transformNutakuURL('/activities.html?tab=daily_goals')}">${window.GT.design.daily_goals}</a>`;
        let missionsMenu = `<a class="missions_menu" href="${transformNutakuURL('/activities.html?tab=missions')}">${window.GT.design.missions}</a>`;
        let contestsMenu = `<a class="contests_menu" href="${transformNutakuURL('/activities.html?tab=contests')}">${window.GT.design.contests}</a>`;
        let popMenu = `<a class="pop_menu" href="${transformNutakuURL('/activities.html?tab=pop')}">${((window.HH_UNIVERSE == 'mangarpg_m') ? labels.expeditions : labels.pop)}</a>`;
        if (window.HH_UNIVERSE != 'horny_s') {
            $('a[rel="activities"]').append(dailyGoalsMenu);
        }
        $('a[rel="activities"]').append(missionsMenu);
        $('a[rel="activities"]').append(contestsMenu);
        if (window.HH_UNIVERSE != 'horny_s') {
            $('a[rel="activities"]').append(popMenu);
        }

        //Add sub-menus for Market
        let marketMenu_equipments = `<a class="market_menu equipments" href="${transformNutakuURL('/shop.html?type=armor')}">${labels.Equipments}</a>`;
        let marketMenu_boosters = `<a class="market_menu boosters" href="${transformNutakuURL('/shop?type=booster')}">${labels.Boosters}</a>`;
        let marketMenu_books = `<a class="market_menu books" href="${transformNutakuURL('/shop?type=potion')}">${labels.Books}</a>`;
        let marketMenu_gifts = `<a class="market_menu gifts" href="${transformNutakuURL('/shop?type=gift')}">${labels.Gifts}</a>`;
        $('a[rel="shop"]').append(marketMenu_equipments);
        $('a[rel="shop"]').append(marketMenu_boosters);
        $('a[rel="shop"]').append(marketMenu_books);
        $('a[rel="shop"]').append(marketMenu_gifts);

        //Add sub-menus for Lust Arena
        let lustArena_league = `<a class="lustArena_menu league" href="${transformNutakuURL('/leagues.html')}">${labels.league}</a>`;
        let lustArena_season = `<a class="lustArena_menu season" href="${transformNutakuURL('/season.html')}">${window.GT.design.Season}</a>`;
        let lustArena_pentaDrill = `<a class="lustArena_menu pentaDrill" href="${transformNutakuURL('/penta-drill.html')}">${window.GT.design.penta_drill}</a>`;
        $('a[rel="pvp-arena"]').append(lustArena_league);
        $('a[rel="pvp-arena"]').append(lustArena_season);
        $('a[rel="pvp-arena"]').append(lustArena_pentaDrill);

        //Quests shortcuts
        let currentQuest = `<a class="current_quest" href="${transformNutakuURL(heroData.infos.questing.current_url)}">${window.GT.design.current_quest}</a>`;
        let sideQuests = `<a class="side_quests" href="${transformNutakuURL('/side-quests.html')}">${labels.Side_quests}</a>`;
        $('a[rel="map"]').append(currentQuest);
        if (heroData.infos.questing.id_world > 1) $('a[rel="map"]').append(sideQuests);
        $('.continue-quest-container').remove();

        //Phone messages
        if ($('a.messenger-link').length > 0) {
            if (heroData.energies.reply.amount < heroData.energies.reply.max_regen_amount) {
                $('a.messenger-link').append(
                    `<span class=script_phone_messages>${heroData.energies.reply.amount} / ${heroData.energies.reply.max_regen_amount}<BR>
                    +1 ${labels.in} ${convertToTimeFormatMinutes(heroData.energies.reply.next_refresh_ts)}</span>`
                );
            }
            else $('a.messenger-link').append(
                `<span class=script_phone_messages>${heroData.energies.reply.amount} / ${heroData.energies.reply.max_regen_amount}<BR>
                ${labels.full}</span>`
            );
        }


        setInterval(() => {$('#scriptPachinkoTimer').text(calculateTime(pachinkoTime));
            $('#scriptChampionsTimer').text(calculateTime(championsTime));
            $('#scriptClubChampionTimer').text(calculateTime(clubChampionTime));
            $('#scriptPovTime').text(calculateTime(povTime*1000));
            $('#scriptPogTime').text(calculateTime(pogTime*1000));
            if (window.missions_datas.reward == false && window.missions_datas.remaining_time == null) {
                $('#missionsTimer1').text(calculateTime(next_missions_remaining_date));
                $('#missionsTimer2').text(calculateTime(next_missions_remaining_date));
            }
        }, 1000);
    }

    function pachinko() {
        let pachinkoTimeMin = Math.min(window.pachinkoVar.next_equipment_game, window.pachinkoVar.next_great_game, window.pachinkoVar.next_mythic_game);
        let pachinkoTime = window.server_now_ts*1000 + pachinkoTimeMin*1000;
        localStorage.setItem("HHS.pachinkoTime", pachinkoTime);

        if ($('#playzone-replace-info > div.btns-section > button.blue_button_L:nth-child(1)').length && ($('.playing-zone')[0].attributes[1].value == "great" || $('.playing-zone')[0].attributes[1].value == "equipment" || $('.playing-zone')[0].attributes[1].value == "mythic")) {
            let button = document.querySelector('#playzone-replace-info > div.btns-section > button.blue_button_L:nth-child(1)');
            button.addEventListener('click', () => {
                if (button.attributes["data-free"].value == "true") {
                    setTimeout(() => {
                        pachinkoTimeMin = Math.min(window.pachinkoVar.next_equipment_game, window.pachinkoVar.next_great_game, window.pachinkoVar.next_mythic_game);
                        pachinkoTime = window.server_now_ts*1000 + pachinkoTimeMin*1000;
                        localStorage.setItem("HHS.pachinkoTime", pachinkoTime);
                    }, 4*timeout)
                }
            });
        }

        let observer = new MutationObserver(() => {
            if ($('.playing-zone')[0].attributes[1].value != "great" && $('.playing-zone')[0].attributes[1].value != "equipment" && $('.playing-zone')[0].attributes[1].value != "mythic")
                return;
            if ($('#playzone-replace-info > div.btns-section > button.blue_button_L:nth-child(1)').length) {
                let button = document.querySelector('#playzone-replace-info > div.btns-section > button.blue_button_L:nth-child(1)');
                button.addEventListener('click', () => {
                    if (button.attributes["data-free"].value == "true") {
                        setTimeout(() => {
                            pachinkoTimeMin = Math.min(window.pachinkoVar.next_equipment_game, window.pachinkoVar.next_great_game, window.pachinkoVar.next_mythic_game);
                            pachinkoTime = window.server_now_ts*1000 + pachinkoTimeMin*1000;
                            localStorage.setItem("HHS.pachinkoTime", pachinkoTime);
                        }, 4*timeout)
                    }
                });
            }
        })
        observer.observe($('.playing-zone')[0], {childList: false, subtree: false, attributes: true})
    }

    function activities() {
        let next_missions_remaining_time = $('#missions .new-missions-timer.timer').attr('data-time-stamp');
        localStorage.setItem("HHS.nextMissionsDate", (time_now + parseInt(next_missions_remaining_time, 10))*1000);
    }

    function champions() {
        if (CurrentPage == "/champions-map.html") {
            let time_min_champions = time_now + 15*60 + 1;
            for (let i=0; i<6; i++){
                let time_champion = (time_now + parseInt($(`a.champion-lair[href$="champions/${(i+1)}"] > div.champion-lair-name.map-label-link > div`).attr('data-time'), 10)) || time_min_champions;
                time_min_champions = Math.min(time_min_champions, parseInt(time_champion, 10));
            }
            if (time_min_champions == time_now + 15*60 + 1) localStorage.setItem("HHS.championsTime", time_now*1000);
            else localStorage.setItem("HHS.championsTime", time_min_champions*1000);
        }
        else {
            let current_timer = parseInt($('.champions-bottom__rest .rest-timer.timer').attr('data-time-stamp'), 10);
            let current_min = parseInt(localStorage.getItem("HHS.championsTime"), 10);

            if (current_min < time_now*1000) {
                current_min = (time_now + 15*60 + 1)*1000;
            }
            if ((current_timer*1000) < current_min) {
                localStorage.setItem("HHS.championsTime", (time_now + current_timer)*1000);
            }

            if ($('button.champions-bottom__start-battle').length > 0) {
                let button = document.querySelector('.champions-bottom__wrapper .champions-bottom__footer .champions-bottom__buttons-wrapper button.champions-bottom__start-battle');
                button.addEventListener('click', () => {
                    let champion_timer = new Date().getTime() + (15*60)*1000;
                    let champion_min = parseInt(localStorage.getItem("HHS.championsTime"), 10);
                    if (champion_timer < champion_min || champion_min < new Date().getTime()) {
                        localStorage.setItem("HHS.championsTime", champion_timer);
                    }
                });
            }
        }
    }

    function clubChampion() {
        if (CurrentPage == "/clubs.html" && !window.location.search.includes('?view_club=')) {
            let current_timer = parseInt(window.club_champion_data.timers.teamRest, 10);
            localStorage.setItem("HHS.clubChampionTime", (time_now + current_timer)*1000);
        }
        else if (CurrentPage == "/club-champion.html") {
            let current_timer = parseInt($('.champions-bottom__rest .rest-timer.timer').attr('data-time-stamp'), 10);
            localStorage.setItem("HHS.clubChampionTime", (time_now + current_timer)*1000);

            if ($('button.champions-bottom__start-battle').length > 0) {
                let button = document.querySelector('.champions-bottom__wrapper .champions-bottom__footer .champions-bottom__buttons-wrapper button.champions-bottom__start-battle');
                button.addEventListener('click', () => {
                    let clubChampion_timer = new Date().getTime() + (15*60)*1000;
                    localStorage.setItem("HHS.clubChampionTime", clubChampion_timer);
                });
            }
        }
    }

    function pov() {
        let povTimer = parseInt($('.pov-timer.timer').attr('data-time-stamp'), 10) || parseInt($('.potions-paths-timer.timer').attr('data-time-stamp'), 10);
        let pov_end_time = time_now + povTimer;
        localStorage.setItem("HHS.PovTime", pov_end_time);
    }

    function pog() {
        let pogTimer = parseInt($('.potions-paths-timer.timer').attr('data-time-stamp'), 10);
        let pog_end_time = time_now + pogTimer;
        localStorage.setItem("HHS.PogTime", pog_end_time);
    }

    function season() {
        let seasonTimer = window.season_sec_untill_event_end;
        let season_end_time = time_now + seasonTimer;
        localStorage.setItem("HHS.SeasonTime", season_end_time);
    }

    function pentaDrill() {
        let pentaDrillTimer = parseInt($('.penta-drill-timer.timer').attr('data-time-stamp'), 10) ;
        let pentaDrill_end_time = time_now + pentaDrillTimer;
        localStorage.setItem("HHS.PentaDrillTime", pentaDrill_end_time);
    }

    function harem() {
        new MutationObserver(() => {
            if ($('#harem_right .diamond.locked.all').length == 0)
                $('.diamond-bar').append(`<div class="diamond locked all"></div>`);
        }).observe($('#harem_right')[0], {childList: true, subtree: true})

        //CSS
        sheet.insertRule(`.diamond.locked.all {
            display: block;
            background-image: url("/images/design/info_icon.png");
            background-position: center;
            background-repeat: no-repeat;
            background-color: transparent;
            height: 30px;
            width: 31px;
            background-size: 35px;
            border: none;
            box-shadow: none;
            opacity: 1;
            transform: rotate(0deg);}`
        );
    }

    function addBoosterStatus() {
        const CIRCULAR_THRESHOLDS = {
            1: 'green',
            0.5: 'yellow',
            0.2: 'red'
        };

        this.activeBoosters = {};
        const boosterStatus = JSON.parse(localStorage.getItem('HHS.booster_status')) || DEFAULT_BOOSTERS;
        boosterStatus.normal = boosterStatus.normal.filter(({endAt}) => endAt > window.server_now_ts);

        Object.keys(boosterStatus).forEach(key => {
            if (boosterStatus[key].length < MAX_BOOSTERS[key])
                boosterStatus[key] = [...boosterStatus[key], ...Array(MAX_BOOSTERS[key]-boosterStatus[key].length).fill({empty:true})];
        })

        $('.script-booster-status').remove();
        const $boosterStatusHTML = $(`<a class="script-booster-status" href="${transformNutakuURL('/shop.html?type=player-stats&subtab=booster')}"></a>`)

        const buildNormalSlot = (data) => {
            const {empty, id_item, ico, identifier, rarity, endAt} = {...data, ...data.item}
            if (empty) return '<div class="slot empty"></div>';
            data.expiry = endAt - (Math.floor(new Date().getTime()/1000));
            data.expiration = endAt - (Math.floor(new Date().getTime()/1000));
            const formattedDate = new Date(endAt * 1000).toLocaleTimeString(undefined, options).replace(/(\d)/g, (x)=>`${x}<i></i>`);
            return $(`
                <div class="slot ${rarity}" booster-item-tooltip="" id_item="${id_item}" data-d="${JSON.stringify(data).replace(/"/g, '&quot;')}" additional-tooltip-info="${JSON.stringify({additionalText: `<span class="script-tooltip"></span>${labels.ends_at} ${formattedDate}`}).replace(/"/g, '&quot;')}">
                <img src="${ico || `${window.IMAGES_URL}/pictures/items/${identifier}.png`}"/>
                </div>`
            );
        }

        const buildMythicSlot = (data) => {
            const {empty, id_item, ico, identifier} = {...data, ...data.item};
            if (empty) return '<div class="slot mythic empty"></div>';
            return $(`
                <div class="slot mythic" booster-item-tooltip="" id_item="${id_item}" data-d="${JSON.stringify(data).replace(/"/g, '&quot;')}" additional-tooltip-info="${JSON.stringify({additionalText: '<span class="script-tooltip"></span>'}).replace(/"/g, '&quot;')}">
                <img src="${ico || `${window.IMAGES_URL}/pictures/items/${identifier}.png`}"/>
                </div>`
            );
        }

        const buildProgressWrapper = (current, max, useTimer, rarity) => {
            const percentage = Math.min(current/max, 1);
            const firstHalf = Math.min(percentage, 0.5) * 2;
            const secondHalf = Math.max(percentage - 0.5, 0) * 2;
            let colorClass = '';
            let flashingClass = '';

            if (percentage > 0) {
                Object.entries(CIRCULAR_THRESHOLDS).forEach(([threshold, className]) => {
                    if (percentage <= threshold) colorClass = className
                })

                if (percentage <= 0.0035 && rarity != 'mythic') flashingClass = 'flashing';
                else if (percentage <= 0.06 && rarity == 'mythic') flashingClass = 'flashing';
            }

            const $wrapper = $(`<div class="circular-progress">
                <div class="circle">
                <div class="circle-bar left ${flashingClass}">
                <div class="progress ${colorClass}" style="transform: rotate(${180 * secondHalf}deg)"></div></div>
                <div class="circle-bar right ${flashingClass}">
                <div class="progress ${colorClass}" style="transform: rotate(${180 * firstHalf}deg)"></div></div>
                ${useTimer ? '<div class="dummy-timer-target" style="display: none;"></div>' : ''}
                </div></div>`
            );
            return $wrapper;
        }

        const buildSlotAndAddTooltip = (buildSlot, data, replaceEmpty) => {
            const {empty, id_member_booster_equipped, usages_remaining, endAt, item} = data;
            const {rarity, default_usages, duration} = item || {};
            const $slot = buildSlot(data);
            let current = 0;
            let max = 1;
            let useTimer = false;
            const isMythic = rarity == 'mythic';

            if (!empty) {
                if (isMythic) {
                    current = usages_remaining;
                    max = default_usages;
                } else {
                    let normalisedDuration = duration == 1440 ? 86400 : duration;
                    current = endAt - window.server_now_ts;
                    max = normalisedDuration;
                    useTimer = true;
                }
            }

            const $progressWrapper = buildProgressWrapper(current, max, useTimer, rarity);
            $progressWrapper.prepend($slot);

            if (replaceEmpty) $boosterStatusHTML.find(`.circular-progress:has(.empty${isMythic? '.mythic':':not(.mythic)'})`).first().replaceWith($progressWrapper);
            else $boosterStatusHTML.append($progressWrapper);

            if (!empty && isMythic) {
                const id_m_i = id_member_booster_equipped;
                this.activeBoosters[id_m_i] = $progressWrapper;
            }
        }

        boosterStatus.normal.forEach((data) => {buildSlotAndAddTooltip(buildNormalSlot, data)})
        boosterStatus.mythic.forEach((data) => {buildSlotAndAddTooltip(buildMythicSlot, data)})
        $('header .currency').before($boosterStatusHTML);

        $(document).on('boosters:equipped', (event, {id_item, isMythic, new_id}) => {
            const boosterStatus = JSON.parse(localStorage.getItem('HHS.booster_status')) || DEFAULT_BOOSTERS;
            const newBoosterData = boosterStatus[isMythic ? 'mythic' : 'normal'].find(data=>data.id_item == id_item&&(new_id && data.id_member_booster_equipped == new_id));

            if (newBoosterData) {
                const $slotToReplace = $boosterStatusHTML.find(`.slot.empty${isMythic ? '.mythic' : ':not(.mythic)'}`);
                if ($slotToReplace.length) buildSlotAndAddTooltip(isMythic ? buildMythicSlot : buildNormalSlot, newBoosterData, true);
                else console.log('somehow equipped a new equip but have no empty slot????');
            }
            else console.log('can\'t find data in LS for new booster with id', new_id, 'and itemid', id_item);
        })

        $(document).on('boosters:updated-mythic', () => {
            const boosterStatus = JSON.parse(localStorage.getItem('HHS.booster_status')) || {normal: [], mythic: []};
            const boostersByIdmi = {};
            boosterStatus.mythic.forEach((data) => {boostersByIdmi[data.id_member_booster_equipped] = data;})

            Object.entries(this.activeBoosters).forEach(([id_m_i, $elem]) => {
                const updatedData = boostersByIdmi[id_m_i]

                if (!updatedData) {
                    // Booster has expired
                    $elem.find('.slot').attr('class', 'slot mythic empty').empty().attr('data-d', '').attr('tooltip-id', '').attr('id_item', '')
                    $elem.find('.progress').css('transform', 'rotate(0deg)')
                }
                else {
                    const {item: {default_usages}, usages_remaining} = updatedData;
                    const percentage = Math.min(usages_remaining/default_usages, 1);
                    const firstHalf = Math.min(percentage, 0.5) * 2;
                    const secondHalf = Math.max(percentage - 0.5, 0) * 2;
                    let colorClass = 'green';

                    if (percentage > 0) Object.entries(CIRCULAR_THRESHOLDS).forEach(([threshold, className]) => {if (percentage <= threshold) colorClass = className;})
                    const $left = $elem.find('.left .progress');
                    const $right = $elem.find('.right .progress');
                    $left.css('transform', `rotate(${180 * secondHalf}deg)`).attr('class', `progress ${colorClass}`);
                    $right.css('transform', `rotate(${180 * firstHalf}deg)`).attr('class', `progress ${colorClass}`);
                    const $slot = $elem.find('.slot');
                    $slot.attr('data-d', JSON.stringify(updatedData));
                    $slot.data('d', updatedData);
                }
            })
        })

        new MutationObserver(() => {
            // Nasty hack. Wish there was a better way of setting a custom class on a tooltip
            $('.hh_tooltip_new:has(.script-tooltip)').addClass('script-booster-status-item')
        }).observe(document.body, {childList: true})
    }

    function collectBoostersFromMarket() {
        setTimeout(() => {
            const activeSlots = $('#equiped .booster .slot:not(.empty):not(.mythic)').map((i, el)=> $(el).data('d')).toArray();
            const activeMythicSlots = $('#equiped .booster .slot:not(.empty).mythic').map((i, el)=> $(el).data('d')).toArray();

            const boosterStatus = {
                normal: activeSlots.map((data) => ({...data, endAt: window.server_now_ts + data.expiration})),
                mythic: activeMythicSlots,
            }
            localStorage.setItem('HHS.booster_status', JSON.stringify(boosterStatus));
        }, timeout)
    }

    function getClubStatus() {
        if (window.location.pathname.includes('clubs') && window.membersList) {
            const {upgradesInformation: {upgrades}, membersList} = window;
            const clubStatus = {
                upgrades,
                memberIds: membersList.map(({id_member}) => id_member)
            };
            localStorage.setItem('HHS.club_status', JSON.stringify(clubStatus));
        }
    }

    function getClubXPBonus() {
        const clubStatus = JSON.parse(localStorage.getItem('HHS.club_status'));

        if (clubStatus) return clubStatus.upgrades.experience_gain.bonus;
        else if (window.Chat_vars && window.Chat_vars.CLUB_ID) return 0.1;
        else return 0;
    }

    function collectBoostersFromHeroUpdate() {
        const originalHeroUpdate = heroData.update.bind(heroData);
        const hookedUpdate = (field, value, add) => {
            if (field == 'xp') {
                const boosterStatus = JSON.parse(localStorage.getItem('HHS.booster_status')) || DEFAULT_BOOSTERS;
                const travelMemories = boosterStatus.mythic.find(({item: {identifier}}) => identifier == 'MB6');

                if (travelMemories) {
                    const {cur: oldValue, level} = heroData.infos.Xp;
                    let atmBonus = 0.05;
                    if (level < 300) atmBonus = 0.2;
                    const clubBonus = getClubXPBonus();
                    const diff = value - oldValue;
                    const extra = Math.ceil(Math.floor(diff/(1+clubBonus+atmBonus))*atmBonus);
                    travelMemories.usages_remaining -= extra
                    boosterStatus.mythic = boosterStatus.mythic.filter(({usages_remaining}) => usages_remaining > 0);
                    localStorage.setItem('HHS.booster_status', JSON.stringify(boosterStatus));
                    $(document).trigger('boosters:updated-mythic');
                }
            }
            return originalHeroUpdate(field, value, add);
        }
        heroData.update = hookedUpdate;
    }

    function collectBoostersFromAjaxResponses () {
        $(document).ajaxComplete(function(evt, xhr, opt) {
            if(opt && opt.data && opt.data.search && ~opt.data.search(/(action|class)/)) {
                setTimeout(() => {
                    if(!xhr || !xhr.responseText || !xhr.responseText.length) return;
                    const boosterStatus = JSON.parse(localStorage.getItem('HHS.booster_status')) || DEFAULT_BOOSTERS;
                    const response = JSON.parse(xhr.responseText);

                    if(!response || !response.success) return;

                    const searchParams = new URLSearchParams(opt.data)
                    const mappedParams = ['action', 'class', 'type', 'id_item', 'number_of_battles', 'battles_amount'].map(key => ({[key]: searchParams.get(key)})).reduce((a,b)=>Object.assign(a,b),{});
                    const {action, class: className, type, id_item, number_of_battles, battles_amount} = mappedParams;
                    const {success, equipped_booster} = response;

                    if (!success) return;

                    if (action == 'market_equip_booster' && type == 'booster') {
                        const idItemParsed = parseInt(id_item);
                        const isMythic = idItemParsed >= 632;
                        const boosterData = equipped_booster;

                        if (boosterData) {
                            const clonedData = {...boosterData}

                            if (isMythic) boosterStatus.mythic.push(clonedData)
                            else boosterStatus.normal.push({...clonedData, endAt: clonedData.lifetime})

                            localStorage.setItem('HHS.booster_status', JSON.stringify(boosterStatus));
                            $(document).trigger('boosters:equipped', {id_item, isMythic, new_id: clonedData.id_member_booster_equipped});
                        }
                        return
                    }
                    let mythicUpdated = false;

                    let sandalwood, allMastery, leagueMastery, seasonMastery, headband, watch, cinnamon, perfume;
                    boosterStatus.mythic.forEach((booster) => {
                        if (booster.item != undefined || booster.item != null) {
                            switch (booster.item.identifier) {
                                case 'MB1':
                                    sandalwood = booster;
                                    break;
                                case 'MB2':
                                    allMastery = booster;
                                    break;
                                case 'MB3':
                                    headband = booster;
                                    break;
                                case 'MB4':
                                    watch = booster;
                                    break;
                                case 'MB5':
                                    cinnamon = booster;
                                    break;
                                case 'MB7':
                                    perfume = booster;
                                    break;
                                case 'MB8':
                                    leagueMastery = booster;
                                    break;
                                case 'MB9':
                                    seasonMastery = booster;
                                    break;
                            }
                        }
                    })

                    if (sandalwood && action == 'do_battles_trolls') {
                        const isMultibattle = parseInt(number_of_battles) > 1;
                        const {rewards} = response;

                        if (rewards && rewards.data && rewards.data.shards) {
                            let drops = 0;
                            rewards.data.shards.forEach(({previous_value, value}) => {
                                if (isMultibattle) {
                                    // Can't reliably determine how many drops, assume MD where each drop would be 1 shard.
                                    const shardsDropped = value - previous_value;
                                    drops += Math.floor(shardsDropped/2);
                                }
                                else drops++
                            })
                            sandalwood.usages_remaining -= drops;
                            mythicUpdated = true;
                        }
                    }
                    if (allMastery && (action == 'do_battles_leagues' || action == 'do_battles_seasons')) {
                        allMastery.usages_remaining -= parseInt(number_of_battles);
                        mythicUpdated = true;
                    }
                    if (leagueMastery && (action == 'do_battles_leagues')) {
                        leagueMastery.usages_remaining -= parseInt(number_of_battles);
                        mythicUpdated = true;
                    }
                    if (seasonMastery && (action == 'do_battles_seasons')) {
                        seasonMastery.usages_remaining -= parseInt(number_of_battles);
                        mythicUpdated = true;
                    }
                    if (headband && (action == 'do_battles_pantheon' || action == 'do_battles_trolls')) {
                        headband.usages_remaining -= parseInt(number_of_battles);
                        mythicUpdated = true;
                    }
                    if (watch && className == 'TeamBattle') {
                        watch.usages_remaining -= parseInt(battles_amount);
                        mythicUpdated = true;
                    }
                    if (cinnamon && action == 'do_battles_seasons') {
                        cinnamon.usages_remaining -= parseInt(number_of_battles);
                        mythicUpdated = true;
                    }
                    if (perfume && action == 'start' && className == 'TempPlaceOfPower') {
                        perfume.usages_remaining--;
                        mythicUpdated = true;
                    }
                    boosterStatus.mythic = boosterStatus.mythic.filter(({usages_remaining}) => usages_remaining > 0);
                    localStorage.setItem('HHS.booster_status', JSON.stringify(boosterStatus));
                    if (mythicUpdated) $(document).trigger('boosters:updated-mythic');
                }, timeout);
            }
        })
    }

    //CSS
    //Penta script
    if (window.shared.Hero.energies.drill != undefined) {
        sheet.insertRule(`.script-booster-status {
            z-index: 15;
            display: grid;
            grid-gap: 3px;}`
        );

        sheet.insertRule(`${mediaDesktop} {
                .script-booster-status {
            position: fixed;
            top: 36px;
            left: -32px;
            grid-template-columns: repeat(9, 1fr);
            scale: 0.65}}`
        );

        sheet.insertRule(`${mediaMobile} {
                .script-booster-status {
            position: fixed;
            top: 40px;
            left: 1px;
            grid-template-columns: repeat(5, 1fr);
            scale: 0.9}}`
        );
    }
    else {
        sheet.insertRule(`.script-booster-status {
            z-index:15;
            display: grid;
            grid-gap: 3px;
            grid-template-columns: repeat(9, 1fr);}`
        );

        sheet.insertRule(`${mediaDesktop} {
                .script-booster-status {
            position: fixed;
            top: 37px;
            left: 10px;}}`
        );

        sheet.insertRule(`${mediaMobile} {
                .script-booster-status {
            position: fixed;
            top: 57px;
            left: 20px;}}`
        );
    }

    sheet.insertRule(`.script-booster-status .circular-progress {
        position: relative;
        height: 24px;
        width: 24px;}`
    );

    sheet.insertRule(`.script-booster-status .circular-progress .green {
        background-color: #01d10b;}`
    );

    sheet.insertRule(`.script-booster-status .circular-progress .yellow {
        background-color: #ffc400;}`
    );

    sheet.insertRule(`.script-booster-status .circular-progress .red {
        background-color: #ff0000;}`
    );

    sheet.insertRule(`.script-booster-status .circular-progress .slot {
        position: absolute;
        height: 20px;
        width: 20px;
        top: 2px;
        left: 2px;
        z-index: 6;}`
    );

    sheet.insertRule(`.script-booster-status .circular-progress .empty + .circle {
        box-shadow: none;}`
    );

    sheet.insertRule(`.script-booster-status .circular-progress .empty + .circle .circle-bar {
        background-color: transparent;}`
    );

    sheet.insertRule(`.script-booster-status .circular-progress .circle {
        height: 100%;
        width: 100%;
        box-shadow: 0px 0px 5px #000, 0px 0px 4px #000, 0px 0px 3px #000, 0px 0px 2px #000;}`
    );

    sheet.insertRule(`.script-booster-status .circular-progress .circle-bar {
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: #000000bf;
        clip-path: polygon(0% 0%, 0% 100%, 50% 100%, 50% 0%);
        overflow: hidden;}`
    );

    sheet.insertRule(`.script-booster-status .circular-progress .circle-bar.flashing {
        animation-name: flashing-background;
        animation-duration: 3s;
        animation-iteration-count: infinite;}`
    );

    sheet.insertRule(`@keyframes flashing-background {
        0% {background-color: #000000bf;}
        50% {background-color: #ff0000;}
        100% {background-color: #000000bf;}}`
    );

    sheet.insertRule(`.script-booster-status .circular-progress .circle-bar .progress {
        position: absolute;
        height: 200%;
        width: 200%;
        top: -50%;
        left: -50%;
        clip-path: polygon(50% -50%, 150% -50%, 150% 150%, 50% 150%);}`
    );

    sheet.insertRule(`.script-booster-status .circular-progress .circle-bar.right {
        transform: rotate(180deg);
        z-index: 3;}`
    );

    sheet.insertRule(`.script-booster-status .circular-progress .circle-bar.left .progress {
        z-index: 1;}`
    );

    sheet.insertRule(`.script-booster-status-item .season_rewards_tier_info, .script-booster-status-item .item-price {
        display: none;}`
    );

    sheet.insertRule(`.script-booster-status {
        grid-template-columns: 1fr 1fr 1fr;}`
    );

    sheet.insertRule(`.script-booster-status > .circular-progress > .slot {
        border-width: 0px;}`
    );

    sheet.insertRule(`.script-booster-status > .circular-progress > .slot.empty {
        cursor: pointer !important;}`
    );

    //Test booster
    sheet.insertRule(`${mediaDesktop} {
            .circular-progress:nth-child(5) {
        display: none;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .circular-progress:nth-child(5) {
        visibility: hidden;}`
    );

    sheet.insertRule(`a.messenger-link > .script_phone_messages {
        display: none;
        color: rgb(255, 255, 255);
        position: absolute;
        width: 100px;
        right: -18px;
        top: 14px;
        font-size: 14px;
        text-align: center;
        text-shadow: rgb(0, 0, 0) 1px 1px 0px, rgb(0, 0, 0) -1px 1px 0px, rgb(0, 0, 0) -1px -1px 0px, rgb(0, 0, 0) 1px -1px 0px;}`
    );

    sheet.insertRule(`.champions_menu, .lustArena_menu {
        position: absolute;
        z-index: 35;
        display: flex;
        flex-direction: column;
        width: 100px;
        border-radius: 3px;
        background-color: rgba(32, 3, 7, 0.75);
        box-shadow: 0 0 0 1px #ffb827;
        opacity: 0;
        visibility: hidden;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: .22px;
        color: #ffb827;
        font-family: \'Carter One\', \'Alegreya Sans\', cursive;
        text-decoration: none;
        justify-content: center;
        transition: opacity 200ms, visibility 200ms;
        text-align: center;}`
    );

    sheet.insertRule(`#hh_gay .champions_menu {
        box-shadow: 0 0 0 1px #69e5ff;
        color: #69e5ff;}`
    );

    sheet.insertRule(`#hh_star .champions_menu {
        box-shadow: 0 0 0 1px #ff9174;
        color: #ff9174;}`
    );

    sheet.insertRule(`#hh_comix .champions_menu,
            #hh_comix .market_menu,
            #hh_comix .current_quest,
            #hh_comix .side_quests,
            #hh_comix .daily_goals_menu,
            #hh_comix .missions_menu,
            #hh_comix .contests_menu,
            #hh_comix .pop_menu,
            #hh_comix .lustArena_menu {
        font-family: Montserrat;
        font-weight: 700;
        box-shadow: 0 0 0 1px #ffca47;
        color: #ffca47;}`
    );

    sheet.insertRule(`#homepage .main-container .left-side-container > a.clubChampion {
        position: absolute;
        height: 36px;
        width: 36px;
        left: 165px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .clubChampion {
        bottom: 31px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .clubChampion {
        bottom: 2px;}}`
    );

    let championsHeightDesktop = (parseInt($('.god-path-btn').css('height'), 10) - 2);

    sheet.insertRule(`.champions_map,
            .pantheon,
            .labyrinth {
        height: ${championsHeightDesktop}px;
        top: 1px;}`
    );

    sheet.insertRule(`.lustArena_menu {
        height: 52px;
        top: 1px}`
    );

    sheet.insertRule(`a[rel="god-path"] a:hover,
            a[rel="pvp-arena"] a:hover {
        text-decoration: underline;}`
    );

    sheet.insertRule(`a[rel="god-path"] > .champions_map,
            .champion1,
            .champion4,
            a[rel="pvp-arena"] > .league {
        margin-left: 130px;}`
    );

    sheet.insertRule(`a[rel="god-path"] > .pantheon,
            .champion2,
            .champion5,
            a[rel="pvp-arena"] > .season {
        margin-left: 230px;}`
    );

    sheet.insertRule(`a[rel="god-path"] > .labyrinth,
            .champion3,
            .champion6,
            a[rel="pvp-arena"] > .pentaDrill {
        margin-left: 330px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .champion1,
            .champion2,
            .champion3,
            .champion4,
            .champion5,
            .champion6 {
        height: 26px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .champion1,
            .champion2,
            .champion3,
            .champion4,
            .champion5,
            .champion6 {
        height: 52px;}}`
    );

    let subChampionsMenuTopDesktop1 = parseInt($('.god-path-btn').css('height'), 10) + 24;
    let subChampionsMenuTopDesktop2 = subChampionsMenuTopDesktop1 + 26;
    let subChampionsMenuTopMobile1 = parseInt($('.god-path-btn').css('height'), 10) + 52;
    let subChampionsMenuTopMobile2 = subChampionsMenuTopMobile1 + 52;


    sheet.insertRule(`${mediaDesktop} {
            .champion1,
            .champion2,
            .champion3 {
        margin-top: -${subChampionsMenuTopDesktop2}px;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .champion1,
            .champion2,
            .champion3 {
        margin-top: -${subChampionsMenuTopMobile2}px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .champion4,
            .champion5,
            .champion6 {
        margin-top: -${subChampionsMenuTopDesktop1}px;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .champion4,
            .champion5,
            .champion6 {
        margin-top: -${subChampionsMenuTopMobile1}px;}`
    );

    sheet.insertRule(`a[rel="god-path"]:hover > .champions_map,
            a[rel="god-path"]:hover > .pantheon,
            a[rel="god-path"]:hover > .labyrinth,
            a[rel="pvp-arena"]:hover > .league,
            a[rel="pvp-arena"]:hover > .season,
            a[rel="pvp-arena"]:hover > .pentaDrill {
        opacity: 1;
        visibility: visible;}`
    );

    sheet.insertRule(`a[rel="god-path"]:hover > .champion1,
            a[rel="god-path"]:hover > .champion2,
            a[rel="god-path"]:hover > .champion3,
            a[rel="god-path"]:hover > .champion4,
            a[rel="god-path"]:hover > .champion5,
            a[rel="god-path"]:hover > .champion6 {
        opacity: 1;
        visibility: visible;}`
    );

    sheet.insertRule(`.market_menu,
            .current_quest,
            .side_quests {
        position: absolute;
        z-index: 35;
        display: flex;
        flex-direction: column;
        top: 1px;
        text-decoration: none;
        border-radius: 3px;
        background-color: rgba(32, 3, 7, 0.75);
        box-shadow: 0 0 0 1px #ffb827;
        opacity: 0;
        visibility: hidden;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: .22px;
        color: #ffb827;
        font-family: \'Carter One\', \'Alegreya Sans\', cursive;
        justify-content: center;
        transition: opacity 200ms, visibility 200ms;
        text-align: center;}`
    );

    sheet.insertRule(`#hh_gay .market_menu,
            #hh_gay .current_quest,
            #hh_gay .side_quests,
            #hh_gay .lustArena_menu {
        box-shadow: 0 0 0 1px #69e5ff;
        color: #69e5ff;}`
    );

    sheet.insertRule(`#hh_star .market_menu,
            #hh_star .current_quest,
            #hh_star .side_quests,
            #hh_star .lustArena_menu {
        box-shadow: 0 0 0 1px #ff9174;
        color: #ff9174;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .market_menu,
            .current_quest,
            .side_quests {
        width: 130px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .equipments {
        width: 130px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .boosters {
        width: 120px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .books,
            .gifts {
        width: 90px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .current_quest,
            .side_quests {
        width: 130px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .market_menu,
            .current_quest,
            .side_quests {
        height: 26px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .market_menu,
            .current_quest,
            .side_quests {
        height: 52px;}}`
    );

    sheet.insertRule(`a[rel="shop"] a:hover {
        text-decoration: underline;}`
    );

    sheet.insertRule(`a[rel="shop"]:hover > .equipments,
            a[rel="shop"]:hover > .boosters,
            a[rel="shop"]:hover > .books,
            a[rel="shop"]:hover > .gifts {
        opacity: 1;
        visibility: visible;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="shop"] > .equipments {
        margin-left: 130px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="shop"] > .boosters {
        margin-left: 260.5px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="shop"] > .books {
        margin-top: 26px;
        margin-left: 130px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="shop"] > .gifts {
        margin-top: 26px;
        margin-left: 260.5px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="shop"] > .equipments {
        margin-left: 130px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="shop"] > .boosters {
        margin-left: 260px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="shop"] > .books {
        margin-left: 380px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="shop"] > .gifts {
        margin-left: 470px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="shop"]:hover > .equipments {
        margin-left: 130px;
        opacity: 1;
        visibility: visible;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="shop"]:hover > .boosters {
        margin-left: 260px;
        opacity: 1;
        visibility: visible;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="shop"]:hover > .books {
        margin-top: 26px;
        margin-left: 130px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="shop"]:hover > .gifts {
        margin-top: 26px;
        margin-left: 260px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="shop"]:hover > .equipments {
        margin-left: 130px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="shop"]:hover > .boosters {
        margin-left: 260px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="shop"]:hover > .books {
        margin-left: 381px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="shop"]:hover > .gifts {
        margin-left: 472px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .main-container .left-side-container .quest-container > a > .notif-position > span {
        height: 28px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .main-container .left-side-container .quest-container > a > .button-notification-icon {
        top: 1px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .main-container .left-side-container .quest-container > a > .new_notif {
        top: 0px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .main-container .left-side-container > a[rel="harem"] > .notif-position > span {
        height: 28px;}}`
    );

    sheet.insertRule(`a[rel="map"] a:hover {
        text-decoration: underline;}`
    );

    sheet.insertRule(`a[rel="map"] > .current_quest {
        width: 150px;
        margin-left: 130px;}`
    );

    sheet.insertRule(`a[rel="map"] > .side_quests {
        width: 150px;
        margin-left: 280px;}`
    );

    sheet.insertRule(`a[rel="map"]:hover > .current_quest {
        width: 150px;
        margin-left: 130px;
        opacity: 1;
        visibility: visible;}`
    );

    sheet.insertRule(`a[rel="map"]:hover > .side_quests {
        width: 150px;
        margin-left: 280px;
        opacity: 1;
        visibility: visible;}`
    );

    sheet.insertRule(`.daily_goals_menu, .missions_menu, .contests_menu, .pop_menu {
        position: absolute;
        z-index: 35;
        top: 1px;
        display: flex;
        flex-direction: column;
        border-radius: 3px;
        text-decoration: none;
        background-color: rgba(32, 3, 7, 0.75);
        box-shadow: 0 0 0 1px #ffb827;
        opacity: 0;
        visibility: hidden;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: .22px;
        color: #ffb827;
        font-family: \'Carter One\', \'Alegreya Sans\', cursive;
        justify-content: center;
        transition: opacity 200ms, visibility 200ms;
        text-align: center;}`
    );

    sheet.insertRule(`#hh_gay .daily_goals_menu, #hh_gay .missions_menu, #hh_gay .contests_menu, #hh_gay .pop_menu {
        box-shadow: 0 0 0 1px #69e5ff;
        color: #69e5ff;}`
    );

    sheet.insertRule(`#hh_star .daily_goals_menu, #hh_star .missions_menu, #hh_star .contests_menu, #hh_star .pop_menu {
        box-shadow: 0 0 0 1px #ff9174;
        color: #ff9174;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .daily_goals_menu, .missions_menu, .contests_menu, .pop_menu {
        width: 160px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .daily_goals_menu {
        width: 120px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .missions_menu {
        width: 90px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .contests_menu {
        width: 110px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .pop_menu {
        width: 80px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .daily_goals_menu, .missions_menu, .contests_menu, .pop_menu {
        height: 26px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .daily_goals_menu, .missions_menu, .contests_menu, .pop_menu {
        height: 52px;}}`
    );

    sheet.insertRule(`a[rel="activities"] a:hover {
        text-decoration: underline;}`
    );

    sheet.insertRule(`a[rel="activities"] > .daily_goals_menu {
        margin-left: 130px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="activities"] > .missions_menu {
        margin-left: 290px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="activities"] > .missions_menu {
        margin-left: 250px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="activities"] > .contests_menu {
        margin-top: 26px;
        margin-left: 130px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="activities"] > .pop_menu {
        margin-top: 26px;
        margin-left: 290px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="activities"] > .contests_menu {
        margin-left: 340px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="activities"] > .pop_menu {
        margin-left: 450px;}}`
    );

    sheet.insertRule(`#hh_sexy a[rel="activities"] > .missions_menu {
        margin-left: 130px;}`
    );

    sheet.insertRule(`#hh_sexy a[rel="activities"] > .contests_menu {
        margin-left: 290px;}`
    );

    sheet.insertRule(`a[rel="activities"]:hover > .daily_goals_menu {
        margin-left: 130px;
        opacity: 1;
        visibility: visible;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="activities"]:hover > .missions_menu {
        margin-left: 291px;
        opacity: 1;
        visibility: visible;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="activities"]:hover > .missions_menu {
        margin-left: 251px;
        opacity: 1;
        visibility: visible;}}`
    );

    sheet.insertRule(`a[rel="activities"]:hover > .contests_menu, a[rel="activities"]:hover > .pop_menu {
        opacity: 1;
        visibility: visible;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="activities"]:hover > .contests_menu {
        margin-top: 26px;
        margin-left: 130px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="activities"]:hover > .pop_menu {
        margin-top: 26px;
        margin-left: 291px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="activities"]:hover > .contests_menu {
        margin-left: 342px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="activities"]:hover > .pop_menu {
        margin-left: 453px;}}`
    );

    sheet.insertRule(`#hh_sexy a[rel="activities"]:hover > .missions_menu {
        margin-left: 130px;}`
    );

    sheet.insertRule(`#hh_sexy a[rel="activities"]:hover > .contests_menu {
        margin-left: 280px;}`
    );

    sheet.insertRule(`#home_pachinko_bar, #home_champions_bar {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: -5px;
        font-size: 11px;}`
    );

    sheet.insertRule(`.pachinko-timer-container, .champions-timer-container, .pov-timer-container, .season-timer-container, .pog-timer-container {
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;}`
    );

    sheet.insertRule(`#home_pachinko_bar .pachinko-timer-container .timerClock_icn, #home_champions_bar .champions-timer-container .timerClock_icn {
        width: 50px;
        background-size: 28px;}`
    );

    sheet.insertRule(`#home_pachinko_bar .text, #home_champions_bar .text, #home_missions_bar1 .text, #home_missions_bar2 .text {
        width: 140px;
        text-align: left;
        margin-left: 7px;
        font-size: 13px;
        color: #fff;
        text-decoration: none;}`
    );

    sheet.insertRule(`a[rel="pachinko"] .notif-position span {
        flex-direction: column;}`
    );

    sheet.insertRule(`a[rel="pachinko"] .notif-position span p {
        margin-top: 0;
        margin-bottom: 0;}`
    );

    sheet.insertRule(`a[rel="god-path"] .notif-position span {
        flex-direction: column;}`
    );

    sheet.insertRule(`a[rel="god-path"] .notif-position span p {
        margin-top: 0;
        margin-bottom: 0;}`
    );

    sheet.insertRule(`#home_pov_bar, #home_pog_bar {
        width: 97px;
        margin-left: -5px;
        margin-top: -26px;}`
    );

    sheet.insertRule(`#hh_comix #home_pov_bar, #hh_comix #home_season_bar, #hh_comix #home_pog_bar {
        width: 100%;}`
    );

    sheet.insertRule(`#home_season_bar {
        width: 70px;
        margin-left: -5px;}`
    );

    sheet.insertRule(`#home_season_bar .season-timer-container .timerClock_icn {
        height: 21px;}`
    );

    sheet.insertRule(`#home_pov_bar .pov-timer-container .timerClock_icn, #home_season_bar .season-timer-container .timerClock_icn, #home_pog_bar .pog-timer-container .timerClock_icn {
        width: 32px;
        background-size: 20px;}`
    );

    sheet.insertRule(`#home_pov_bar .text {
        font-size: 10px;
        color: #fff;
        text-decoration: none;}`
    );

    sheet.insertRule(`#home_season_bar .text {
        font-size: 10px;
        color: #fff;
        text-decoration: none;}`
    );

    sheet.insertRule(`#home_pog_bar .text {
        font-size: 10px;
        color: #fff;
        text-decoration: none;}`
    );

    sheet.insertRule(`#homepage .pov-widget .tier_bar_container, #homepage .pog-widget .tier_bar_container {
        margin-top: -4px;}`
    );

    sheet.insertRule(`.league_counter, .scriptSeasonInfo, .scriptPentaDrillInfo, .scriptPantheonInfo, .pop_timer {
        position: absolute;
        z-index: 4;
        height: 20px;
        border-radius: 8px 10px 10px 8px;
        background-color: rgba(0,0,0,.8);
        box-shadow: 0 0 0 1px rgba(255,255,255,0.73);
        font-size: 14px;
        font-weight: 400;
        letter-spacing: .22px;
        color: #fff;
        border: 3px;
        text-align: center;}`
    );

    sheet.insertRule(`.league_counter {
        width: 75%;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .league_counter {
        margin: 40px 0 0 10px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .league_counter {
        margin: 80px 0 0 10px;}}`
    );

    sheet.insertRule(`#hh_comix .league_counter, #hh_comix .pop_timer, #hh_comix .scriptPantheonInfo, #hh_comix .scriptSeasonInfo, #hh_comix .scriptPentaDrillInfo {
        font-family: Montserrat;
        font-weight: 700;}`
    );

    sheet.insertRule(`.league_counter a, .scriptSeasonInfo a, .scriptPentaDrillInfo a, .scriptPantheonInfo a, .pop_timer a {
        font-family: \'Carter One\', \'Alegreya Sans\', cursive;
        color: rgb(255, 255, 255);
        text-decoration: none;}`
    );

    //Penta script
    if (window.shared.Hero.energies.drill != undefined) {
    sheet.insertRule(`${mediaDesktop} {
            #LeagueTimer {
        width: 150px;
        top: 0px;
        left: 179px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #LeagueTimer {
        width: 150px;
        top: -10px;
        left: 169px;}}`
    );
    }
    else {
    sheet.insertRule(`${mediaDesktop} {
            #LeagueTimer {
        width: 150px;
        top: 0px;
        left: 276px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #LeagueTimer {
        width: 150px;
        top: -10px;
        left: 285px;}}`
    );
    }

    sheet.insertRule(`#LeagueTimer a, #FightSeason a, #FightPentaDrill a, #FightPantheon a, #PoPTimer a {
        color: rgb(255, 255, 255);
        text-decoration: none;}`
    );

    sheet.insertRule(`#LeagueTimer a:hover, #FightSeason a:hover, #FightPentaDrill a:hover, #FightPantheon a:hover, #PoPTimer a:hover {
        color: rgb(255, 247, 204);}`
    );

    sheet.insertRule(`#scriptLeagueTimer, #scriptSeasonTimer, #scriptPentaDrillTimer, #scriptPantheonTimer {
         font-size: 11px;
         color: #8ec3ff;}`
     );

    sheet.insertRule(`#league_bar, #kisses_bar, #drill_bar, #worship_bar, #pop_bar {
        border-radius: 8px 10px 10px 8px;
        width: 100%;
        height: 100%;}`
    );

    sheet.insertRule(`.league_icn, .season_icn, .pentaDrill_icn, .pantheon_icn {
        display: block;
        width: 29px;
        height: 31px;
        background-size: 25px;
        background-position: center;
        background-repeat: no-repeat;
        margin: 0;
        padding: 0;
        position: absolute;
        margin: -5px 0 0 -20px;
        z-index: 36;}`
    );

    sheet.insertRule(`.league_icn {
        background-image: url("${window.IMAGES_URL}/pictures/design/league_points.png");}`
    );

    sheet.insertRule(`.scriptSeasonInfo, .scriptPentaDrillInfo, .scriptPantheonInfo {
        display: block;
        width: 90%;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .scriptSeasonInfo, .scriptPentaDrillInfo {
        margin: 40px 0 0 220px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .scriptSeasonInfo, .scriptPentaDrillInfo {
        margin: 80px 0 0 190px;}}`
    );

    //Penta script
    if (window.shared.Hero.energies.drill != undefined) {
    sheet.insertRule(`${mediaDesktop} {
            #FightSeason {
        width: 150px;
        top: 0px;
        left: 148px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #FightSeason {
        width: 150px;
        top: -10px;
        left: 172px;}}`
    );
    }
    else {
    sheet.insertRule(`${mediaDesktop} {
            #FightSeason {
        width: 150px;
        top: 0px;
        left: 252px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #FightSeason {
        width: 150px;
        top: -10px;
        left: 290px;}}`
    );
    }

    sheet.insertRule(`.season_icn {
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_kiss.png");}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #FightPentaDrill {
        width: 150px;
        top: 0px;
        left: 324px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #FightPentaDrill {
        width: 150px;
        top: -10px;
        left: 353px;}}`
    );

    sheet.insertRule(`.pentaDrill_icn {
        background-image: url("/images/penta_drill/penta_drill.png");}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .scriptPantheonInfo {
        margin: 85px 0 0 10px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .scriptPantheonInfo {
        margin: 60px 0 0 34px;}}`
    );
    
    //Penta script
    if (window.shared.Hero.energies.drill != undefined) {
    sheet.insertRule(`${mediaDesktop} {
            #FightPantheon {
        width: 150px;
        top: -45px;
        left: 710px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #FightPantheon {
        width: 150px;
        top: 10px;
        left: 687px;}}`
    );
    }
    else {
    sheet.insertRule(`${mediaDesktop} {
            #FightPantheon {
        width: 150px;
        top: -45px;
        left: 650px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #FightPantheon {
        width: 150px;
        top: 10px;
        left: 630px;}}`
    );
    }

    sheet.insertRule(`.pantheon_icn {
        background-image:url("${window.IMAGES_URL}/pictures/design/ic_worship.svg");}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .pop_timer {
        width: 90%;
        margin: 40px 0 0 400px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .pop_timer {
        width: 90%;
        margin: 80px 0 0 350px;}}`
    );

    //Penta script
    if (window.shared.Hero.energies.drill != undefined) {
    sheet.insertRule(`${mediaDesktop} {
            #PoPTimer {
        width: 150px;
        top: 0px;
        left: 482px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #PoPTimer {
        width: 150px;
        top: -10px;
        left: 533px;}}`
    );
    }
    else {
    sheet.insertRule(`${mediaDesktop} {
            #PoPTimer {
        width: 150px;
        top:0px;
        left: 429px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #PoPTimer {
        width: 150px;
        top: -10px;
        left: 477px;}}`
    );
    }

    sheet.insertRule(`#scriptPoPTimer {
         font-size: 11px;}`
     );

    sheet.insertRule(`.club-wrapper span[sort_by] {
        display: block;}`
    );

    sheet.insertRule(`.club-wrapper > .club-container .club_champions_panel .club_champions_participants_container table tbody tr td:nth-child(2),
        .club-wrapper > .club-container .club_champions_panel .club_champions_participants_container table thead th:nth-child(2) {
        width: 40%;}`
    );

    sheet.insertRule(`.club-wrapper > .club-container .club_champions_panel .club_champions_participants_container table tbody tr td:nth-child(4),
        .club-wrapper > .club-container .club_champions_panel .club_champions_participants_container table thead th:nth-child(4) {
        width: 30%;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .page-champions .personal-bars__attacker,
            .page-champions .personal-bars__defender {
        top: -20px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .page-club_champion .personal-bars__attacker,
            .page-club_champion .personal-bars__defender {
        top: -15px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .champions-top__inner-wrapper {
        top: 4px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .section__battle-header {
        top: 15px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .section__battle-header {
        top: 25px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .special-ability-pending {
        top: 75px !important;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .special-ability-pending {
        top: 100px !important;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .trollPts_icn {
        position: absolute;
        top: 9px;
        left: 10px;
        z-index: 99;
        display: block;
        width: 29px;
        height: 31px;
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_topbar_energy_fight.png");
        background-size: 25px;
        background-position: center;
        background-repeat: no-repeat;
        margin: 0;
        padding: 0;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .trollPts_icn {
        position: absolute;
        top: 28px;
        left: 10px;
        z-index: 99;
        display: block;
        width: 30px;
        height: 33px;
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_topbar_energy_fight.png");
        background-size: 25px;
        background-position: center;
        background-repeat: no-repeat;
        margin: 0;
        padding: 0;}}`
    );

    sheet.insertRule(`#fight_energy_bar .trollTooltip {
        width: 190px;
        top: 32px;
        margin-left: -80px;}`
    );

    sheet.insertRule(`#fight_energy_bar .trollPts_icn:hover .trollTooltip {
        color: gray;
        font-size: 14px;
        visibility: visible;}`
    );

    sheet.insertRule(`#fight_energy_bar .trollPts_icn:hover #troll_title {
        color: white;
        font-size: 14px;
        visibility: visible;}`
    );

    sheet.insertRule(`#fight_energy_bar .trollPts_icn:hover #troll_time_remaining {
        color: orange;
        visibility: visible;}`
    );

    sheet.insertRule(`#quest_energy_bar .bar-wrapper .over a {
        display: flex;
        color: white;
        text-decoration: none;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #quest_energy_bar .bar-wrapper .over a {
        flex-direction: row;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #quest_energy_bar .bar-wrapper .over a {
        flex-direction: column;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #quest_energy_bar .energy_counter_bar .bar-wrapper .over [rel="count_txt"] {
        position: relative;
        top: 2px;
        left: 5px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .energy_icn {
        position: absolute;
        top: 9px;
        left: 21px;
        z-index: 36;
        display: block;
        width: 21px;
        height: 30px;
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_topbar_energy_quest.png");
        background-size: 21px;
        background-position: center;
        background-repeat: no-repeat;
        margin: 0;
        padding: 0;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .energy_icn {
        position: absolute;
        top: 28px;
        left: 3px;
        z-index: 36;
        display: block;
        width: 30px;
        height: 33px;
        background-image: url("${window.IMAGES_URL}/pictures/design/ic_topbar_energy_quest.png");
        background-size: 25px;
        background-position: center;
        background-repeat: no-repeat;
        margin: 0;
        padding: 0;}}`
    );

    sheet.insertRule(`#quest_energy_bar .energyTooltip {
        width: 190px;
        top: 32px;
        margin-left: -82px;}`
    );

    sheet.insertRule(`#quest_energy_bar .energy_icn:hover .energyTooltip {
        color: gray;
        font-size: 14px;
        visibility: visible;}`
    );

    sheet.insertRule(`#quest_energy_bar .energy_icn:hover #energy_title {
        color: white;
        font-size: 14px;
        visibility: visible;}`
    );

    sheet.insertRule(`#quest_energy_bar .energy_icn:hover #energy_time_remaining {
        color: orange;
        visibility: visible;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .page-pachinko #content-unscaled {
        margin-top: 7px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .page-pachinko #content-unscaled {
        margin-top: 13px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #season-arena .opponents_choose_text_container {
        margin-top: 10px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #season-arena .opponents_arena .season_arena_opponent_container {
        margin-top: -15px;
        height: 400px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #season-arena .opponents_arena .opponent_perform_button_container {
        margin-top:-15px;}}`
    );

    sheet.insertRule(`#season-arena .opponents_arena .opponents_choose_text_container .battle-action-button.orange_button_L {
        height: 44px;
        margin-top: 10px;}`
    );

    sheet.insertRule(`#season-arena .opponents_arena .opponents_choose_text_container .battle-action-button.orange_button_L .action-label {
        margin-top: -3px;}`
    );

    sheet.insertRule(`#season-arena .opponents_arena .opponents_choose_text_container .battle-action-button .action-cost {
        margin-top: -5px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #season-arena .player_team_block.battle_hero {
        height: 97%;
        margin-top: 13px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #season-arena .player_team_block.opponent .personal_info {
        margin-top: -0.2rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #new_battle .new-battle-hero-container.new-battle-player>div:nth-child(1) {
        margin-top: 35px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .hero-name-level-container {
        margin-top: 30px;}}`
    );

    sheet.insertRule(`a[rel="god-path"] .round_blue_button.champions {
        position: absolute;
        z-index: 100;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            a[rel="god-path"] .round_blue_button.champions {
        top: 11px;
        left: 147px;
        width: 30px;
        height: 30px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            a[rel="god-path"] .round_blue_button.champions {
        top: 7px;
        left: 140px;
        width: 40px;
        height: 40px;}}`
    );

    sheet.insertRule(`.champions_flat_icn {
        margin-top: 3px;
        background-image: url("${window.IMAGES_URL}/design/menu/ic_champions.svg");
        background-position: center;
        background-repeat: no-repeat;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .champions_flat_icn {
        height: 21px;
        width: 18px;
        background-size: 17px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .champions_flat_icn {
        height: 23px;
        width: 19px;
        background-size: 19px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .main-container .left-side-container {
        margin-top: 20px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .social_links {
        z-index: 2;
        position: absolute;
        top: 500px;
        left: 545px;}}`
    );

    sheet.insertRule(`#seasons_main_container,
            .pantheon_border_gradient,
            #season-arena .season_arena_block.opponent .hero_stats,
            #season-arena .season_arena_block.opponent .hero_team,
            #season-arena .season_arena_block.opponent .personal_info {
        z-index: 0;}`
    );

    sheet.insertRule(`#shops,
            #activities,
            .club-main-container,
            #league,
            .pantheon-container .pantheon_bgr,
            #harem_whole,
            .help-screen-container,
            .potions-paths-background-panel,
            #personal_forms .settings-container,
            .mega-event-panel,
            .girl-leveler-panel {
        z-index: 1;}`
    );

    sheet.insertRule(`.settings-container h3.headline-page {
        margin-top: 17px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #shops #my-hero-tab-container p.content-title {
        position: relative;
        top: 11px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #shops p.left-side-title, #shops p.right-side-title {
        position: relative;
        top: 10px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #shops .shop-container .menu-container .menu-title {
        margin-top: -6px;}}`
    );

    sheet.insertRule(`.mega-event-panel .mega-event-container .overlayed-section .page-title .overlayed-title {
        margin-top: -0.9rem;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #harem_left h3 {
        position: relative;
        top: 3px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #harem_left > .harem-top-controls {
        position: relative;
        top: 5px;
        margin-bottom: 5px;
        z-index: 10;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #league #leagues .page-title, #league #clubs .page-title {
        top: -1.5rem;}}`
    );

    if (CurrentPage.indexOf('troll-pre-battle') != -1) {
        if (localStorage.getItem('HHPlusPlusConfig')) {
            if (JSON.parse(localStorage.getItem('HHPlusPlusConfig')).core_villainBreadcrumbs) {
                sheet.insertRule(`#breadcrumbs {
                    margin-top: 15px;}`
                );

                sheet.insertRule(`#pre-battle .player-panel {
                    margin-top: 4px;}`
                );
            }
        }
    }

    sheet.insertRule(`${mediaDesktop} {
            body > div > header > a.hh_logo,
            header .square-avatar-wrapper[rel="avatar"] {
        width: 30px;
        height: 30px;}}`
    );

    /* sheet.insertRule(`${mediaMobile} {
            body > div > header > a.hh_logo {
        width: 50px;
        height: 50px;}}`
    ); */

    //Test booster
    sheet.insertRule(`${mediaMobile} {
            body > div > header > a.hh_logo {
        width: 40px;
        height: 40px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            body > div > header > a.hh_logo {
        margin-right: 0.8rem;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            body > div > header a#chat_btn {
        width: 30px;
        height: 30px;
        margin-right: 20px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            body > div > header a#chat_btn {
        width: 50px;
        height: 50px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .chat_mix_icn {
        background-size: 30px;
        width: 30px;
        height: 30px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            body > div > header > div[rel="avatar"] img:not(.button-notification-new) {
        width: 24px;
        height: 24px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            body > div > header > div[rel="avatar"] img:not(.button-notification-new) {
        width: 44px;
        height: 44px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            body > div > header plus {
        width: 32px;
        height: 32px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            body > div > header plus {
        width: 50px;
        height: 50px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            header plus[type="energy_quest"],
            header plus[type="energy_fight"] {
        top: 6px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            header plus[type="energy_quest"],
            header plus[type="energy_fight"] {
        top: 16px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            body > div > header #show-hero-resources,
            body > div > header #blessings-button {
        width: 32px;
        height: 32px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            body > div > header #show-hero-resources,
            body > div > header #blessings-button {
        width: 50px;
        height: 50px;
        margin-top: 13px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            body > div > header {
        margin-top: -10px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            header a.hh_logo,
            header .square-avatar-wrapper[rel="avatar"] {
        width: 50px;
        height: 50px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            body > div > header > a.hh_logo,
            body > div > header a#chat_btn,
            header #quest_energy_bar,
            body > div > header > div.currency  {
        margin-right: 15px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            header #fight_energy_bar,
            header #show-hero-resources  {
        margin-right: 10px;}}`
    );

    /* sheet.insertRule(`${mediaMobile} {
            body > div > header a#chat_btn .chat_mix_icn {
        background-size: 50px;
        width: 50px;
        height: 50px;}}`
    ); */

    //Test booster
    sheet.insertRule(`${mediaMobile} {
            body > div > header a#chat_btn .chat_mix_icn {
        background-size: 40px;
        width: 40px;
        height: 40px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            body > div > header div[rel="xp"] {
        margin-right: 20px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .page-hero_pages section .back {
        top: -77px;
        width: 47px;
        height: 47px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .page-hero_pages section .back span {
        background-size: 25px;
        background-repeat: no-repeat;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            body > div > header > div.currency plus {
        top: 4px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #contains_all > nav > [rel="open"] {
        top: 5px;
        width: 50px;
        height: 50px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #shops {
        margin-top: 0px;}}`
    );

    sheet.insertRule(`#harem_whole #filtering_girls > h3 {
        position: relative;
        top: 2px;}`
    );

    sheet.insertRule(`#mega-event a.close_cross {
        z-index: 100;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            body > div > header .promo_profile_discount_text {
        position : absolute;
        top: -4px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            body > div > header .promo_profile_discount_text {
        margin-left: 50px;
        margin-top: -58px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            body > div > header .promo_quest_discount_text {
        position : absolute;
        left: 292px;
        top: -3px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            body > div > header .promo_quest_discount_text {
        margin-left: -44px;
        margin-top: -58px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            body > div > header .promo_fight_discount_text {
        position : absolute;
        left: 495px;
        top: -3px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            body > div > header .promo_fight_discount_text {
        margin-left: -66px;
        margin-top: -58px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .labyrinth-splash-page .page-title {
        margin-top: 10px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #hero_club .club-main-container .top-row .page-title {
        margin-top: 6px;}}`
    );

    sheet.insertRule(`.labyrinth-panel .labyrinth-container #labyrinth_leaderboard_tab_container .labyrinth_leaderboard-container .labyrinth-filters {
        padding-bottom: 0;}`
    );

    sheet.insertRule(`.labyrinth-panel .labyrinth-container #labyrinth_leaderboard_tab_container .labyrinth_leaderboard-container .labyrinth-filters .form-wrapper {
        margin-top: 25px;}`
    );

    sheet.insertRule(`.page-labyrinth .leaderboard-ranking {
        top: 27px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .side-quests-header .side-quests-tab-text,
            #hh_mangarpg.page-adventures #breadcrumbs {
        margin-top: 10px;}}`
    );

    //Objective popup
    sheet.insertRule(`${mediaDesktop} {
            #toast-popups .popup_wrapper .popup {
        top: 6rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #toast-popups .popup_wrapper .popup {
        top: 8rem;}}`
    );
}

//Add some informations on team edit page in the labyrinth
function moduleLabyrinth() {
    function displayTeamGirlClass() {
        if (['edit-labyrinth-team', 'edit-world-boss-team', 'edit-penta-drill-team'].some(testPage)) {
            Array.from($('.player-team .girl_img')).forEach((girl) => {
                let girl_class = JSON.parse($(girl).attr('data-new-girl-tooltip')).class;
                $(girl).parent().parent().parent().parent().after(
                    `<img class="classGirlTeam" src="${window.IMAGES_URL}/pictures/misc/items_icons/${girl_class}.png" carac="class${girl_class}">`
                );
            });

            Array.from($('.harem-panel-girls .girl_img')).forEach((girl) => {
                let girl_class = JSON.parse($(girl).attr('data-new-girl-tooltip')).class;
                $(girl).after(
                    `<img class="classGirlList" src="${window.IMAGES_URL}/pictures/misc/items_icons/${girl_class}.png" carac="class${girl_class}">`
                );
            });
        }
        else if (['labyrinth-pre-battle', 'world-boss-pre-battle', 'penta-drill-pre-battle'].some(testPage)) {
            Array.from($('.girl_img')).forEach((girl) => {
                let girl_class = JSON.parse($(girl).attr('data-new-girl-tooltip')).class;
                $(girl).parent().parent().after(
                    `<img class="classGirlTeam" src="${window.IMAGES_URL}/pictures/misc/items_icons/${girl_class}.png" carac="class${girl_class}">`
                );
            });
        }
        else if (['labyrinth-pool-select'].some(testPage)) {
            Array.from($('.girl-image')).forEach((girl) => {
                let girl_class = JSON.parse($(girl).attr('data-new-girl-tooltip')).class;
                $(girl).after(
                    `<img class="classGirlList" src="${window.IMAGES_URL}/pictures/misc/items_icons/${girl_class}.png" carac="class${girl_class}">`
                );
            });
        }
    }

    function displayTeamGirlRole() {
        if (['edit-labyrinth-team', 'edit-world-boss-team', 'edit-penta-drill-team'].some(testPage)) {
            Array.from($('.player-team .girl_img')).forEach((girl) => {
                let girl_role = JSON.parse($(girl).attr('data-new-girl-tooltip')).role_data.id;
                if (girl_role != undefined) {
                    $(girl).parent().parent().parent().parent().after(
                        `<span role-tooltip="${girl_role}" class="roleGirlTeam girl_role_${girl_role}_icn" style="background-size: 17px;"></span>`
                    );
                }
            });

            Array.from($('.harem-panel-girls .girl_img')).forEach((girl) => {
                let girl_role = JSON.parse($(girl).attr('data-new-girl-tooltip')).role_data.id;
                if (girl_role != undefined) {
                    $(girl).after(
                        `<span role-tooltip="${girl_role}" class="roleGirlList girl_role_${girl_role}_icn" style="background-size: 24px;"></span>`
                    );
                }
            });
        }
        else if (['labyrinth-pre-battle', 'world-boss-pre-battle', 'penta-drill-pre-battle'].some(testPage)) {
            Array.from($('.girl_img')).forEach((girl) => {
                let girl_role = JSON.parse($(girl).attr('data-new-girl-tooltip')).role_data.id;
                if (girl_role != undefined) {
                    $(girl).parent().parent().after(
                        `<span role-tooltip="${girl_role}" class="roleGirlTeam girl_role_${girl_role}_icn" style="background-size: 17px;"></span>`
                    );
                }
            });
        }
        else if (['labyrinth-pool-select'].some(testPage)) {
            Array.from($('.girl-image')).forEach((girl) => {
                let girl_role = JSON.parse($(girl).attr('data-new-girl-tooltip')).role_data.id;
                if (girl_role != undefined) {
                    $(girl).parent().append(
                        `<span role-tooltip="${girl_role}" class="roleGirlList girl_role_${girl_role}_icn" style="background-size: 24px;"></span>`
                    );
                }
            });
        }
    }

    function highlightBaseGirls() {
        if (['labyrinth-pool-select'].some(testPage)) {
            $('.girl-grid').prepend(`<span class="highlight_girls_txt">${labels.labyrinthGirlsTxt}</span>`);
            const girlsList_container = Array.from($('.girl-container'));
            for (let i=0; i<7; i++) {
                $(girlsList_container[i]).css('border', '3px solid aqua')
            }

            const girlsList = Array.from($('.girl-image'));
            for (let i=0; i<girlsList.length; i++) {
                let girl_skill = JSON.parse($(girlsList[i]).attr('data-new-girl-tooltip')).skill_tiers_info;
                let girl_skill_tier5 = girl_skill[5];
                if (girl_skill_tier5 != undefined)
                    if (girl_skill_tier5.skill_points_used > 0 && i < 7)
                        $(girlsList[i]).parent().append($(`<p class="highlight_girls_tier5 red">${girl_skill_tier5.skill_points_used}</p>`));
                    else if (girl_skill_tier5.skill_points_used > 0 && i > 6)
                        $(girlsList[i]).parent().append($(`<p class="highlight_girls_tier5 yellow">${girl_skill_tier5.skill_points_used}</p>`));
                    else
                        $(girlsList[i]).parent().append($(`<p class="highlight_girls_tier5 green">${girl_skill_tier5.skill_points_used}</p>`));
                else
                    $(girlsList[i]).parent().append($(`<p class="highlight_girls_tier5 green">0</p>`));
            }
        }

        if (CurrentPage.indexOf('labyrinth.html') != -1) {
            if (localStorage.getItem('labyrinth_girls_sort_by') == '["power","desc"]') {
                $('.girl-grid').prepend(`<span class="highlight_girls_txt">${labels.labyrinthGirlsTxt}</span>`);
                const girlsList_container = Array.from($('.girl-container'));
                for (let i=0; i<7; i++) {
                    $(girlsList_container[i]).css('border', '3px solid aqua')
                }
            }

            const girlsList = Array.from($('.girl-image'));
            for (let i=0; i<girlsList.length; i++) {
                let girl_skill = JSON.parse($(girlsList[i]).attr('data-new-girl-tooltip')).skill_tiers_info;
                let girl_skill_tier5 = girl_skill[5];
                if (girl_skill_tier5 != undefined)
                    if (girl_skill_tier5.skill_points_used > 0 && i < 7)
                        $(girlsList[i]).parent().append($(`<p class="highlight_girls_tier5 red">${girl_skill_tier5.skill_points_used}</p>`));
                    else if (girl_skill_tier5.skill_points_used > 0 && i > 6)
                        $(girlsList[i]).parent().append($(`<p class="highlight_girls_tier5 yellow">${girl_skill_tier5.skill_points_used}</p>`));
                    else
                        $(girlsList[i]).parent().append($(`<p class="highlight_girls_tier5 green">${girl_skill_tier5.skill_points_used}</p>`));
                else
                    $(girlsList[i]).parent().append($(`<p class="highlight_girls_tier5 green">0</p>`));
            }
        }
    }

    function displayGirlOrder() {
        if (['labyrinth-pre-battle', 'world-boss-pre-battle'].some(testPage)) {
            const player_speeds = Object.values(window.hero_fighter.fighters).map(({speed, id_girl, position}) => {
                return {speed: speed, girl_id: id_girl, position: position}
            })
            const opponent_speeds = window.opponent_fighter.fighters.map(({speed, id_girl, position}) => {
                return {speed: speed, girl_id: id_girl, position: position+7}
            })
            const girl_speeds = [...player_speeds, ...opponent_speeds].sort((a, b) => b.speed-a.speed)

            girl_speeds.forEach(({position, girl_id}, i) => {
                $(`.${position < 7 ? 'player' : 'opponent'}-panel .team-member-container[data-girl-id="${girl_id}"]`).append(`<div class="team-order-number">${i+1}</div>`)
            })
        }
        else if (['penta-drill-pre-battle'].some(testPage)) {
            let index_team = parseInt($('.page-penta_drill_pre_battle section .penta-drill-battle .middle-container .team-slots-container .team-slot.selected').attr('index'), 10) - 1;
            const player_speeds = Object.values(window.hero_fighter.fighters[index_team]).map(({speed, id_girl, position}) => {
                return {speed: speed, girl_id: id_girl, position: position}
            })
            const opponent_speeds = window.opponent_fighter.fighters[index_team].map(({speed, id_girl, position}) => {
                return {speed: speed, girl_id: id_girl, position: position+7}
            })
            const girl_speeds = [...player_speeds, ...opponent_speeds].sort((a, b) => b.speed-a.speed)

            girl_speeds.forEach(({position, girl_id}, i) => {
                $(`.${position < 7 ? 'player' : 'opponent'}-panel .team-member-container[data-girl-id="${girl_id}"]`).append(`<div class="team-order-number">${i+1}</div>`)
            })
        }
        else if (['edit-labyrinth-team', 'edit-world-boss-team', 'edit-penta-drill-team'].some(testPage)) {
            const opponent_speeds = JSON.parse(localStorage.getItem('HHS.LABYRINTH_SPEEDS')) || [];
            let girl_speeds;
            let selected;

            const getTeam = () => {
                const player_speeds = [];
                $('.team-member-container').each((i, el) => {
                    const girl_id = parseInt($(el).attr('data-girl-id'))
                    if (girl_id) {
                        const speed = JSON.parse($(el).find('.team-member>img').attr('data-new-girl-tooltip')).battle_caracs.speed
                        const position = $(el).data('team-member-position')
                        player_speeds.push({speed: speed, girl_id: girl_id, position: position})
                    }
                })
                girl_speeds = [...player_speeds, ...opponent_speeds].sort((a,b) => a.position-b.position).sort((a,b) => b.speed-a.speed);
            }

            const getSelected = () => {
                let new_selected;
                const $container = $('.team-member-container.selected');
                const player_speeds = girl_speeds.filter(({position}) => position < 7);

                if ($container.length) {
                    const position = parseInt($container.attr('data-team-member-position'));
                    const new_id = parseInt($container.attr('data-girl-id')) || 0;
                    const index = girl_speeds.findIndex(({girl_id, position}) => girl_id === new_id && position < 7);
                    new_selected = {index: index, girl_id: new_id, position: position, method: 'selected'};
                }
                else if (player_speeds.length) {
                    const girl = player_speeds.at(-1);
                    const index = girl_speeds.findIndex(({girl_id, position}) => girl_id === girl.girl_id && position < 7);
                    new_selected = {index: index, girl_id: girl.girl_id, position: girl.position, method: 'slowest girl'};
                }
                else {
                    new_selected = {index: -1, girl_id: 0, position: 0, method: 'no girl'};
                }

                if (!selected || (selected.girl_id != new_selected.girl_id) || new_selected.girl_id === 0) {
                    selected = new_selected;
                    addToPanel();
                }
            }

            const addToHex = () => {
                girl_speeds.forEach(({position, girl_id}, i) => {
                    if (position < 7) {
                        const $container = $(`.team-member-container[data-girl-id="${girl_id}"]`);
                        $container.find('.team-order-number').remove();
                        $container.append(`<div class="team-order-number">${i+1}</div>`);
                    }
                })
            }

            const addToPanel = () => {
                const {index, position} = selected;
                const hasPosition = girl_speeds.findIndex((g) => g.position === position);
                $('.harem-girl-container .girl_img').each((i, el) => {
                    const new_speed = $(el).data('new-girl-tooltip').battle_caracs.speed;
                    const new_id = parseInt($(el).parent().attr('id_girl'));
                    let new_girl_speeds;
                    const inTeam = girl_speeds.findIndex(({girl_id, position}) => girl_id === new_id && position < 7);

                    if (inTeam > -1) {
                        if (index > -1) {
                            new_girl_speeds = girl_speeds.map(e => ({...e}));
                            new_girl_speeds[inTeam].position = girl_speeds[index].position;
                            new_girl_speeds[index].position = girl_speeds[inTeam].position;
                        } else {
                            new_girl_speeds = girl_speeds;
                        }
                    } else {
                        const new_girl = {speed: new_speed, girl_id: new_id, position: position};

                        if (hasPosition > -1) {
                            new_girl_speeds = [...girl_speeds.slice(0, index), new_girl, ...girl_speeds.slice(index+1)];
                        } else {
                            new_girl_speeds = [...girl_speeds, new_girl];
                        }
                    }
                    new_girl_speeds = new_girl_speeds.sort((a, b) => a.position-b.position).sort((a, b) => b.speed-a.speed);

                    const order = new_girl_speeds.findIndex(({girl_id, position}) => girl_id === new_id && position < 7) + 1;
                    $(el).siblings('.team-order-number').remove();
                    $(el).before(`<div class="team-order-number">${order}</div>`);
                })
            }

            const hex_observer = new MutationObserver(() => {
                getTeam();
                addToHex();
                getSelected();
            })

            getTeam();
            addToHex();
            hex_observer.observe($('.team-hexagon')[0], {subtree: true, attributes: true, attributeFilter: ['data-girl-id']});

            getSelected();
            $('.team-member-container, .harem-girl-container').click(() => {
                getSelected();
            })
        }
    }

    function collectGirlSpeed() {
        if (['labyrinth-pool-select'].some(testPage)) {
            localStorage.setItem('HHS.LABYRINTH_SPEEDS', JSON.stringify([]));
        }
        else if (['labyrinth-pre-battle', 'world-boss-pre-battle'].some(testPage)) {
            const opponent_speeds = opponent_fighter.fighters.map(({speed, id_girl, position}) => {
                return {speed: speed, girl_id: id_girl, position: position+7};
            })
            localStorage.setItem('HHS.LABYRINTH_SPEEDS', JSON.stringify(opponent_speeds));
        }
        else if (['penta-drill-pre-battle'].some(testPage)) {
            let index_team = parseInt($('.page-penta_drill_pre_battle section .penta-drill-battle .middle-container .team-slots-container .team-slot.selected').attr('index'), 10) - 1;
            const opponent_speeds = opponent_fighter.fighters[index_team].map(({speed, id_girl, position}) => {
                return {speed: speed, girl_id: id_girl, position: position+7};
            })
            localStorage.setItem('HHS.LABYRINTH_SPEEDS', JSON.stringify(opponent_speeds));
        }
    }

    function sortingRelics() {
        function sortingRelicTitle(relic1, relic2) {
            return (relic1.children[0].firstChild.textContent).localeCompare(relic2.children[0].firstChild.textContent);
        }

        function rarityRelicValue(relic) {
        let rarity = relic.classList[1].substring(0, relic.classList[1].indexOf('-'));
        switch (rarity) {
          case 'mythic':
            return 0;
          case 'legendary':
            return 1;
          case 'epic':
            return 2;
          case 'rare':
            return 3;
          case 'common':
            return 4;
        }}

        function sortingRelicRarity(relic1, relic2) {
            return rarityRelicValue(relic1) - rarityRelicValue(relic2);
        }

        function sortRelics(relic1, relic2) {
            let value = sortingRelicTitle(relic1, relic2);
            if (value == 0) value = sortingRelicRarity(relic1, relic2);
            return value;
        }

        let relics = $('.relic-container');
        let sortedRelics = [...relics].sort(sortRelics);

        $('.relics-grid').empty();
        sortedRelics.forEach((relic) => {$('.relics-grid').append(relic)});
    }

    function powerRelicsValue() {
        let powerElements = {darkness: 0, light: 0, psychic: 0, fire: 0, nature: 0, stone: 0, sun: 0, water: 0};
        let powerRelics = [];
        let relics = $('.team-relic-icon').children().parent().parent().parent();

        Array.from(relics).forEach((relic) => {
            let value = ($(relic).find('.relic-description')[0].textContent.match(/\d.\d/) || $(relic).find('.relic-description')[0].textContent.match(/\d/))[0];
            let indexElement = $($(relic).find('.team-relic-icon').children()[0]).attr('class').indexOf('_element_relic_icn');
            let element = $($(relic).find('.team-relic-icon').children()[0]).attr('class').substring(0, indexElement);
            powerRelics.push({element: element, value: value})
        })

        powerRelics.forEach((relic) => {
            powerElements[relic.element] += parseFloat(relic.value)
        })

        console.log(`Power relics value: ${powerElements}`);
    }

    function displayNbGirls() {
        $('h3.panel-title').append(
            `<div class="nb_girls">${window.GT.design.Girls} :&nbsp;
            <span id="girls_nb" style="color: #fff">${$('.harem-panel-girls .harem-girl-container').length}</span>
            </div>`
        );
    }

    if (['edit-labyrinth-team', 'labyrinth-pre-battle', 'labyrinth-pool-select', 'world-boss-pre-battle', 'edit-world-boss-team', 'edit-penta-drill-team', 'penta-drill-pre-battle'].some(testPage)) {
        highlightBaseGirls();
        collectGirlSpeed();
        displayTeamGirlRole();
        displayTeamGirlClass();
        displayGirlOrder();
    }

    if (['edit-penta-drill-team', 'penta-drill-pre-battle'].some(testPage)) {
        new MutationObserver(() => {
            collectGirlSpeed();
            displayTeamGirlRole();
            displayTeamGirlClass();
            displayGirlOrder();

            const observer = new MutationObserver(() => {
                $('.roleGirlTeam').remove();
                displayTeamGirlRole();
                $('.classGirlTeam').remove();
                displayTeamGirlClass();
            })
            observer.observe($('.player-team .team-hexagon')[0], {attributes: true, subtree: true});
        }).observe($('.team-slots-container')[0], {subtree: true, attributes: true, attributeFilter: ['class']})
    }

    if (['edit-labyrinth-team', 'edit-world-boss-team', 'edit-penta-drill-team'].some(testPage)) {
        displayNbGirls();

        const observer = new MutationObserver(() => {
            $('.roleGirlTeam').remove();
            displayTeamGirlRole();
            $('.classGirlTeam').remove();
            displayTeamGirlClass();
        })
        observer.observe($('.player-team .team-hexagon')[0], {attributes: true, subtree: true});
    }

    if (['labyrinth.html'].some(testPage)) {
        const observer = new MutationObserver(() => {
            if ($('.relics-grid').length > 0) {
                sortingRelics();
                powerRelicsValue();
            }
        })
        observer.observe($('#relics_tab_container .relics-container')[0], {childList: true, once: true});

        const observer1 = new MutationObserver(() => {
            if ($('.girl-grid').length > 0) {
                highlightBaseGirls();
            }
        })
        observer1.observe($('#squad_tab_container .squad-container')[0], {childList: true, once: true});

        let lab_ts = Date.parse(labyrinth_data.labyrinth_cycle.labyrinth_season.event_end)/1000 - server_now_ts;
        let lab_d = Math.floor(lab_ts/3600/24);
        let lab_h = Math.floor(lab_ts/3600%24);
        let lab_m = Math.floor(lab_ts%3600/60);
        let lab_s = Math.floor(lab_ts%60);

        let time_label;
        if (lab_d > 0) time_label = lab_d + labels.day + ' ' + lab_h + labels.hour;
        else if (lab_h > 0) time_label = lab_h + labels.hour + ' ' + lab_m + labels.minute;
        else time_label = lab_m + labels.minute + ' ' + lab_s + labels.second;

        ['first', 'second', 'third', 'fourth', 'fifth'].forEach((el) => {
            $('#' + el + '_floor_tab_container').prepend(`<span class="floor-time">${labels.new_girl_in} <span class="floor-time-label">${time_label}</span></span>`);
        })
    }

    //CSS
    sheet.insertRule(`.classGirlList, .classGirlTeam, .roleGirlList, .roleGirlTeam {
        position: absolute;
        border: none;}`
    );

    sheet.insertRule(`.classGirlList {
        height: 24px;
        width: 24px;
        top: 0px;
        left: 0px;}`
    );

    sheet.insertRule(`.roleGirlList {
        height: 24px;
        width: 24px;
        top: 50px;
        left: 43px;}`
    );

    sheet.insertRule(`.labyrinth-pool-select-panel .classGirlList {
        position: relative;
        top: -82px;
        left: -24px;}`
    );

    sheet.insertRule(`.labyrinth-pool-select-panel .roleGirlList {
        position: relative;
        top: -145px;
        left: 47px;}`
    );

    sheet.insertRule(`.labyrinth-pool-select-panel .girl-power-container {
        margin-top: -25px;}`
    );

    sheet.insertRule(`.classGirlTeam {
        height: 17px;
        width: 17px;
        top: 65px;
        left: 12px;}`
    );

    sheet.insertRule(`.roleGirlTeam {
        height: 17px;
        width: 17px;
        top: 65px;
        left: 49px;}`
    );

    sheet.insertRule(`.labyrinth-battle .classGirlTeam, .world-boss-battle .classGirlTeam, .penta-drill-battle .classGirlTeam {
        top: 45px;
        left: 3px;}`
    );

    sheet.insertRule(`.labyrinth-battle .roleGirlTeam, .world-boss-battle .roleGirlTeam, .penta-drill-battle .roleGirlTeam {
        top: 45px;
        left: 40px;}`
    );

    sheet.insertRule(`.team-order-number {
        position: absolute;
        width: 1.5rem;
        height: 1.5rem;
        font-size: 0.8rem;
        text-align: center;
        background: linear-gradient(90deg,#333750 0,#1e9fdf 100%);
        border-radius: 1.5rem;
        border: 2px solid #fff;
        z-index: 2;}`
    );

    sheet.insertRule(`.harem-panel-girls .team-order-number {
        top: 50px;
        left: 0px;}`
    );

    sheet.insertRule(`.change-team-panel .team-hexagon .team-order-number {
        top: 4px;}`
    );

    sheet.insertRule(`h3.panel-title .nb_girls {
        font-weight: 400;
        color: rgb(255, 184, 39);
        letter-spacing: 0.22px;
        text-align: center;
        text-shadow: rgb(0, 0, 0) 1px 1px 0px, rgb(0, 0, 0) -1px 1px 0px, rgb(0, 0, 0) -1px -1px 0px, rgb(0, 0, 0) 1px -1px 0px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            h3.panel-title .nb_girls {
        font-size: 14px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            h3.panel-title .nb_girls {
        font-size: 18px;}}`
    );

    sheet.insertRule(`.change-team-panel .panel-title {
        margin-bottom: 0rem;}`
    );

    sheet.insertRule(`.labyrinth-pool-select-panel .highlight_girls_txt {
            position: absolute;
            left: 28px;
            width: 614px;
            color: aqua;}`
        );

    sheet.insertRule(`${mediaDesktop} {
            .labyrinth-pool-select-panel .highlight_girls_txt {
        top: 77px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .labyrinth-pool-select-panel .highlight_girls_txt {
        top: 64px;}}`
    );

    sheet.insertRule(`#squad_tab_container .squad-container .highlight_girls_txt {
        position: absolute;
        top: 51px;
        left: 7px;
        width: 632px;
        color: aqua;}`
    );

    sheet.insertRule(`.highlight_girls_tier5 {
        position: relative;
        display: block;
        top: -63px;
        left: 3px;
        height: 18px;
        width:18px;
        line-height: 19px;
        font-size: 14px;
        background-color: black;
        border-radius: 50%;}`
    );

    sheet.insertRule(`.highlight_girls_tier5.red {
        color: crimson;}`
    );

    sheet.insertRule(`.highlight_girls_tier5.yellow {
        color: gold;}`
    );

    sheet.insertRule(`.highlight_girls_tier5.green {
        color: limegreen;}`
    );

    sheet.insertRule(`.labyrinth-pool-select-panel .highlight_girls_tier5 {
        top: -63px;}`
    );

    sheet.insertRule(`#squad_tab_container .squad-container .highlight_girls_tier5 {
        top: -93px;
        margin-bottom: -32px;}`
    );

    sheet.insertRule(`.labyrinth-panel .tabs-section .floor-time {
        position: absolute;
        top: 35px;
        left: 17px;
        text-shadow: 1px 1px 0 #000000, -1px 1px 0 #000000, -1px -1px 0 #000000, 1px -1px 0 #000000;}`
    );

    sheet.insertRule(`.labyrinth-panel .tabs-section .floor-time .floor-time-label {
        color: #2296e4;}`
    );

    sheet.insertRule(`.labyrinth-panel .labyrinth-container .bottom-section .credits {
        bottom: 89px;
        left: 171px;}`
    );

    sheet.insertRule(`.labyrinth-panel .labyrinth-container .tabs-section button#sweeping-floor {
        bottom: 2rem;
        left: 24rem;
        right: auto;}`
    );
}

/* ==============
	SEASON STATS
   ============== */

function moduleSeasonStats() {
    const resetUTCHour = 12;
    let seasonDateEndData = localStorage.getItem('HHS.SeasonDateEnd') || JSON.stringify({day: 0, month: 0, year: 0, hour: 0});
    let seasonDateEnd = JSON.parse(seasonDateEndData);
    let currentDay = new Date().getUTCDate();
    let currentMonth = new Date().getUTCMonth();
    let currentYear = new Date().getUTCFullYear();
    let currentHour = new Date().getUTCHours();
    if (seasonDateEnd.hour == 0) {
        seasonDateEnd.day = 1;
        if ((currentDay == 1) && (currentHour < 12)) seasonDateEnd.month = currentMonth;
        else seasonDateEnd.month = (currentMonth + 1)%12;
        seasonDateEnd.year = currentYear;
        if (seasonDateEnd.month == 0) seasonDateEnd.year += 1;
        seasonDateEnd.hour = (seasonDateEnd.month > 2 && seasonDateEnd.month < 10) ? (resetUTCHour - 1) : resetUTCHour;
        localStorage.setItem('HHS.SeasonDateEnd', JSON.stringify(seasonDateEnd));
    }
    if ((currentMonth == seasonDateEnd.month) && (currentDay >= seasonDateEnd.day) && (currentHour >= seasonDateEnd.hour)) {
        localStorage.setItem('HHS.oldSeasonStats', localStorage.getItem('HHS.SeasonStats'));
        localStorage.removeItem('HHS.SeasonStats');
        seasonDateEnd.day = 1;
        seasonDateEnd.month = (currentMonth + 1)%12;
        seasonDateEnd.year = (seasonDateEnd.month == 0) ? (seasonDateEnd.year + 1) : seasonDateEnd.year;
        seasonDateEnd.hour = (seasonDateEnd.month > 2 && seasonDateEnd.month < 10) ? (resetUTCHour - 1) : resetUTCHour;
        localStorage.setItem('HHS.SeasonDateEnd', JSON.stringify(seasonDateEnd));
    }
    else if ((currentMonth == seasonDateEnd.month) && (currentDay > seasonDateEnd.day)) {
        localStorage.setItem('HHS.oldSeasonStats', localStorage.getItem('HHS.SeasonStats'));
        localStorage.removeItem('HHS.SeasonStats');
        seasonDateEnd.day = 1;
        seasonDateEnd.month = (currentMonth + 1)%12;
        seasonDateEnd.year = (seasonDateEnd.month == 0) ? (seasonDateEnd.year + 1) : seasonDateEnd.year;
        seasonDateEnd.hour = (seasonDateEnd.month > 2 && seasonDateEnd.month < 10) ? (resetUTCHour - 1) : resetUTCHour;
        localStorage.setItem('HHS.SeasonDateEnd', JSON.stringify(seasonDateEnd));
    }
    else if ((currentMonth > seasonDateEnd.month) && (currentYear == seasonDateEnd.year)) {
        localStorage.setItem('HHS.oldSeasonStats', localStorage.getItem('HHS.SeasonStats'));
        localStorage.removeItem('HHS.SeasonStats');
        seasonDateEnd.day = 1;
        seasonDateEnd.month = (currentMonth + 1)%12;
        seasonDateEnd.year = (seasonDateEnd.month == 0) ? (seasonDateEnd.year + 1) : seasonDateEnd.year;
        seasonDateEnd.hour = (seasonDateEnd.month > 2 && seasonDateEnd.month < 10) ? (resetUTCHour - 1) : resetUTCHour;
        localStorage.setItem('HHS.SeasonDateEnd', JSON.stringify(seasonDateEnd));
    }
    else if (currentYear > seasonDateEnd.year) {
        localStorage.setItem('HHS.oldSeasonStats', localStorage.getItem('HHS.SeasonStats'));
        localStorage.removeItem('HHS.SeasonStats');
        seasonDateEnd.day = 1;
        seasonDateEnd.month = (currentMonth + 1)%12;
        seasonDateEnd.year = (seasonDateEnd.month == 0) ? (currentYear + 1) : currentYear;
        seasonDateEnd.hour = (seasonDateEnd.month > 2 && seasonDateEnd.month < 10) ? (resetUTCHour - 1) : resetUTCHour;
        localStorage.setItem('HHS.SeasonDateEnd', JSON.stringify(seasonDateEnd));
    }

    let seasonStatsData = localStorage.getItem('HHS.SeasonStats') || JSON.stringify({fights: 0, victories: 0, losses: 0, won_mojo: 0, lost_mojo: 0, won_mojo_avg: 0, lost_mojo_avg: 0, mojo_avg: 0});
    let seasonStats = JSON.parse(seasonStatsData);
    localStorage.setItem('HHS.SeasonStats', JSON.stringify(seasonStats));
    let fights = seasonStats.fights;
    let victories = seasonStats.victories;
    let losses = seasonStats.losses;
    let won_mojo = seasonStats.won_mojo;
    let lost_mojo = seasonStats.lost_mojo;
    let won_mojo_avg = seasonStats.won_mojo_avg;
    let lost_mojo_avg = seasonStats.lost_mojo_avg;
    let mojo_avg = seasonStats.mojo_avg;

    let oldSeasonStatsData = localStorage.getItem('HHS.oldSeasonStats') || JSON.stringify({fights: 0, victories: 0, losses: 0, won_mojo: 0, lost_mojo: 0, won_mojo_avg: 0, lost_mojo_avg: 0, mojo_avg: 0});
    let oldSeasonStats = JSON.parse(oldSeasonStatsData);
    localStorage.setItem('HHS.oldSeasonStats', JSON.stringify(oldSeasonStats));
    let old_fights = oldSeasonStats.fights;
    let old_victories = oldSeasonStats.victories;
    let old_losses = oldSeasonStats.losses;
    let old_won_mojo = oldSeasonStats.won_mojo;
    let old_lost_mojo = oldSeasonStats.lost_mojo;
    let old_won_mojo_avg = oldSeasonStats.won_mojo_avg;
    let old_lost_mojo_avg = oldSeasonStats.lost_mojo_avg;
    let old_mojo_avg = oldSeasonStats.mojo_avg;

    if (CurrentPage.indexOf('season-battle') != -1) {
        $(document).ajaxComplete(function(evt, xhr, opt) {
            const searchParams = new URLSearchParams(opt.data)
            if(searchParams.get('action') == 'do_battles_seasons') {
                if(!xhr.responseText.length) return;

                const response = JSON.parse(xhr.responseText);

                if(!response || !response.success) return;

                fights +=1;

                if (response.rewards.data.rewards[0].type == "victory_points") {
                    victories += 1;
                    won_mojo += localeStringToNumber(response.rewards.data.rewards[0].value);
                    won_mojo_avg = Math.floor(won_mojo/victories*100)/100;
                    mojo_avg = Math.floor((won_mojo-lost_mojo)/fights*100)/100;
                }
                else {
                    losses += 1;
                    lost_mojo += localeStringToNumber(response.rewards.data.rewards[1].value.substring(1));
                    lost_mojo_avg = Math.floor(lost_mojo/losses*100)/100;
                    mojo_avg = Math.floor((won_mojo-lost_mojo)/fights*100)/100;
                }

                seasonStats.fights = fights;
                seasonStats.victories = victories;
                seasonStats.won_mojo = won_mojo;
                seasonStats.won_mojo_avg = won_mojo_avg;
                seasonStats.losses = losses;
                seasonStats.lost_mojo = lost_mojo;
                seasonStats.lost_mojo_avg = lost_mojo_avg;
                seasonStats.mojo_avg = mojo_avg;
                localStorage.setItem('HHS.SeasonStats', JSON.stringify(seasonStats));
            }
        })
    }

    if (CurrentPage.indexOf('season-arena') == -1) {
        $('div#seasons_tab_title').append(
            `<span class="scriptSeasonStats" style="color: #8ec3ff; margin-left: 54px; font-size: 16px">Stats
            <span class="scriptSeasonStatsTooltip">${labels.fights} : ${fights}
            <BR>${labels.victories} : ${nThousand(victories)} / ${labels.defeats} : ${nThousand(losses)}
             <BR><BR>${labels.won_mojo} : ${nThousand(won_mojo)}
             <BR>${labels.lost_mojo} : ${nThousand(lost_mojo)}
             <BR><BR>${labels.won_mojo_avg} : ${won_mojo_avg}
             <BR>${labels.lost_mojo_avg} : ${lost_mojo_avg}
             <BR>${labels.mojo_avg} : ${mojo_avg}
             <BR>_______________________
             <BR>${labels.last_season}
             <BR><BR>${labels.fights} : ${old_fights}
             <BR>${labels.victories} : ${nThousand(old_victories)} / ${labels.defeats} : ${nThousand(old_losses)}
             <BR><BR>${labels.won_mojo} : ${nThousand(old_won_mojo)}
             <BR>${labels.lost_mojo} : ${nThousand(old_lost_mojo)}
             <BR><BR>${labels.won_mojo_avg} : ${old_won_mojo_avg}
             <BR>${labels.lost_mojo_avg} : ${old_lost_mojo_avg}
             <BR>${labels.mojo_avg} : ${old_mojo_avg}
             </span>
             </span>`
            );
    }

    if (CurrentPage.indexOf('season-arena') != -1) {
        $('#season-arena .player_team_block.battle_hero .personal_info').append(
            `<div class="scriptSeasonStatsArena" style="color: #8ec3ff; margin-left: 15px; margin-top: 28px; font-size: 16px">Stats
            <span class="scriptSeasonStatsTooltipArena">${labels.fights} : ${fights}
            <BR>${labels.victories} : ${nThousand(victories)} / ${labels.defeats} : ${nThousand(losses)}
            <BR><BR>${labels.won_mojo} : ${nThousand(won_mojo)}
            <BR>${labels.lost_mojo} : ${nThousand(lost_mojo)}
            <BR><BR>${labels.won_mojo_avg}' : ${won_mojo_avg}
            <BR>${labels.lost_mojo_avg} : ${lost_mojo_avg}
            <BR>${labels.mojo_avg} : ${mojo_avg}
            <BR>_______________________
            <BR>${labels.last_season}
            <BR><BR>${labels.fights} : ${old_fights}
            <BR>${labels.victories} : ${nThousand(old_victories)} / ${labels.defeats} : ${nThousand(old_losses)}
            <BR><BR>${labels.won_mojo} : ${nThousand(old_won_mojo)}
            <BR>${labels.lost_mojo} : ${nThousand(old_lost_mojo)}
            <BR><BR>${labels.won_mojo_avg} : ${old_won_mojo_avg}
            <BR>${labels.lost_mojo_avg} : ${old_lost_mojo_avg}
            <BR>${labels.mojo_avg} : ${old_mojo_avg}
            </span>
            </div>`);
    }

    //CSS
    sheet.insertRule(`.scriptSeasonStatsTooltip {
        visibility: hidden;
        font-size: 12px;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 3px 5px 3px 5px;
        border: 2px solid #905312;
        border-radius: 6px;
        background-color: rgba(32,3,7,.9);
        position: absolute;
        margin-top: 35px;
        margin-left: -112px;
        width: 90%;
        z-index: 2000;}`
    );

    sheet.insertRule(`.scriptSeasonStatsTooltip::after {
        content: " ";
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-top:  3px;
        margin-left:  -10px;
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent #905312 transparent;}`
    );

    sheet.insertRule(`.scriptSeasonStats:hover .scriptSeasonStatsTooltip {
        visibility: visible;}`
    );

    sheet.insertRule(`.scriptSeasonStatsTooltipArena {
        visibility: hidden;
        font-size: 12px;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 3px 5px 3px 5px;
        border: 2px solid #905312;
        border-radius: 6px;
        background-color: rgba(32,3,7,.9);
        position: absolute;
        margin-top: 30px;
        margin-left: -112px;
        width: max-content;
        z-index: 100;}`
    );

    sheet.insertRule(`.scriptSeasonStatsTooltipArena::after {
        content: " ";
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left:  -10px;
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent #905312 transparent;}`
    );

    sheet.insertRule(`.scriptSeasonStatsArena:hover .scriptSeasonStatsTooltipArena {
        visibility: visible;}`
    );
}

/* ==================================
	PACHINKO NAMES (Credit : Shinya)
   ================================== */

function modulePachinkoNames() {
    if ($('#pachinko_whole').length){
        const jsonMapData = localStorage.getItem('HHS.HHPNMap') || '[]';
        const jsonShardsMapData = localStorage.getItem('HHS.HHPNShardsMap') || '[]';
        if (!jsonMapData) {
            return
        }
        const localizationMap = new Map(JSON.parse(jsonMapData).concat(JSON.parse(jsonShardsMapData)));
        const targetNode = document.getElementById('pachinko_whole');
        const config = { attributes: true, childList: true, subtree: true };

        const callback = function(mutationsList, observer){
            let text = $('#playzone-replace-info');
            if (text.find('.HHMI-INFO').length != 0 && text.find('.HHMI-INFO1').length != 0) {
                return
            } else if (text.find('.HHMI-INFO').length == 0 && $('#playzone-replace-info').find('.girl_shards').length) {
                const rewards = $('#playzone-replace-info').find('.girl_shards').attr('data-rewards')
                const regex = /id_girl\":\d+/g;
                const found = rewards.match(regex);

                let girls1 = displayWikiGirlsNames(found);

                if (found.length > 10){
                    text = text.find('.game-rewards');
                    text.css("fontSize", "11px");
                    text.css("line-height", "13px");
                    text.css("margin-top", "61px");

                    text.append(`<div class="HHMI-INFO">${labels.available_girls + girls1}</div>`);

                    text = text.find('.HHMI-INFO');
                    text.css("height", "52px");
                    text.css("width", "410px");
                    text.css("position", "relative");
                    text.css("top", "-96px");
                    text.css("left", "-60px");
                    text.css("text-align", "center");
                    text.css("overflow-y", "scroll");
                }

                else if (found.length > 3){
                    text = text.find('.game-rewards');
                    text.css("fontSize", "11px");
                    text.css("line-height", "15px");
                    text.css("margin-top", "55px");

                    text.append(`<div class="HHMI-INFO">${labels.available_girls + girls1}</div>`);

                    text = text.find('.HHMI-INFO');
                    text.css("height", "60px");
                    text.css("width", "390px");
                    text.css("position", "relative");
                    text.css("top", "-90px");
                    text.css("left", "-55px");
                    text.css("text-align", "center");
                }

                else {
                    text = text.find('.game-rewards');
                    text.css("fontSize", "11.5px");
                    text.css("margin-top", "55px");

                    text.append(`<div class="HHMI-INFO">${labels.available_girls + girls1}</div>`);

                    text = text.find('.HHMI-INFO');
                    text.css("width", "390px");
                    text.css("position", "relative");
                    text.css("top", "-85px");
                    text.css("left", "-55px");
                    text.css("text-align", "center");
                }
            }
            if (text.find('.HHMI-INFO1').length == 0 && $('#playzone-replace-info').find('.pachinko-pool-girl').length) {
                const rewards = $('#playzone-replace-info').find('.pachinko-pool-girl').attr('data-rewards')
                const regex = /id_girl\":\d+/g;
                const found = rewards.match(regex);

                let girls2 = displayHaremGirlsNames(found);

                text = text.find('.pachinko_img');
                text.css("fontSize", "11.5px");

                text.append(`<div class="HHMI-INFO1">${window.GT.design.mythic_pachinko_current_selection} ${girls2}</div>`);

                text = text.find('.HHMI-INFO1');
                text.css("width", "283px");
                text.css("position", "absolute");
                text.css("top", "9px");
                text.css("left", "48px");
                text.css("text-align", "center");
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

        function displayHaremGirlsNames(found) {
            let girls = "";
            for (let i=0, j=found.length; i<j; i++) {
                const raw = found[i];
                const id = parseInt(raw.match(/\d+/g), 10);
                const name = localizationMap.get(id) ? localizationMap.get(id).n : 'Unknown';
                let girlName = name.replaceAll("’", "-").replaceAll("/", "-");
                if (id == 145462484) girlName = girlName.concat('-', 'Usagi');

                let element = (girlName != 'Unknown') ? `<a href="${transformNutakuURL(`/characters/${id}`)}"> ${name} </a>` : name;

                if (girls != ""){
                    girls += ", " + element;
                } else {
                    girls += element;
                }
            }
            return girls;
        }

        function displayWikiGirlsNames(found) {
            let girls = "";
            for (let i=0, j=found.length; i<j; i++){
                const raw = found[i];
                const id = parseInt(raw.match(/\d+/g), 10);
                const name = localizationMap.get(id) ? localizationMap.get(id).n : 'Unknown';
                let girlName = name.replaceAll("’", "-").replaceAll("/", "-");
                if (id == 145462484) girlName = girlName.concat('-', 'Usagi');
                let element;

                if (['gay', 'gh_nutaku', 'gh_eroges'].some(testUniverse)) {
                    element = (girlName != 'Unknown') ? `<a href="https://harem-battle.club/wiki/Gay-Harem/GH:${name}" target="_blank"> ${name}</a>` : name;
                }
                else if (lang == 'fr' && ['hentai', 'nutaku', 'test_h', 'hh_eroges'].some(testUniverse)) {
                    element = (girlName != 'Unknown') ? `<a href="http://hentaiheroes.go.yj.fr/?id=${id}" target="_blank">${name}</a>` : name;
                }
                else if (['hentai', 'nutaku', 'test_h', 'hh_eroges'].some(testUniverse)) {
                    element = (girlName != 'Unknown') ? `<a href="https://harem-battle.club/wiki/Harem-Heroes/HH:${girlName}" target="_blank">${name}</a>` : name;
                }
                else {
                    element = (girlName != 'Unknown') ? `<a href="transformNutakuURL('/characters/${id}')">${name}</a>` : name;
                }

                if (girls != ""){
                    girls += ", " + element;
                } else {
                    girls += element;
                }
            }
            return girls;
        }
    }

    //CSS
    sheet.insertRule(`#playzone-replace-info a {
        text-decoration: none;
        text-shadow: rgb(0, 0, 0) 1px 1px 0px, rgb(0, 0, 0) -1px 1px 0px, rgb(0, 0, 0) -1px -1px 0px, rgb(0, 0, 0) 1px -1px 0px;
        color: #fa8072;}`
    );

    sheet.insertRule(`#playzone-replace-info .cover, #playzone-replace-info .cover .pachinko_img img {
        height: 275px;}`
    );

    sheet.insertRule(`#playzone-replace-info .cover h2 {
        top: -10px;}`
    );

    sheet.insertRule(`#playzone-replace-info .cover h3.shadow-text {
        top: 193px;}`
    );

    if (['comix_c', 'nutaku_c'].some(testUniverse)) {
        sheet.insertRule(`#playzone-replace-info .cover p {
            position: relative;
            font-size: 14px;
            top: -18px;}`
        );
    }
    else {
        sheet.insertRule(`#playzone-replace-info .cover p {
            position: relative;
            top: -10px;}`
        );
    }

    sheet.insertRule(`#playzone-replace-info .game-rewards {
        margin-top: 10px;
        height: 40px;}`
    );

    sheet.insertRule(`#playzone-replace-info .btns-section {
        margin-top: 10px;}`
    );

    sheet.insertRule(`#playzone-replace-info .graduation {
        font-size: 10px;}`
    );
}

//CSS rules to improve the display of the missions
function moduleMissionsBackground() {
    sheet.insertRule(`#missions .missions_wrap .mission_object.mission_entry.common {
        background: #ffffff20;}`
    );

    sheet.insertRule(`#missions .missions_wrap .mission_object.mission_entry.rare {
        background: #32bc4f30;}`
    );

    sheet.insertRule(`#missions .missions_wrap .mission_object.mission_entry.epic {
        background: #ffb24440;}`
    );

    sheet.insertRule(`#missions .missions_wrap .mission_object.mission_entry.legendary {
        background: #6ebeff40;}`
    );
}

//CSS rule to not display the collect money animation
function moduleCollectMoneyAnimation() {
    sheet.insertRule(`.collect_img {
        display: none !important;}`
    );
}

//Change the defaut tab in Activities to Missions
function moduleActivitiesTabChoice() {
    $('#homepage').find('[rel=activities]')[0].href = transformNutakuURL("/activities.html?tab=missions");
}

//Change items order on home screen
function moduleCustomizedHomeScreen() {
    if ($('a[rel="clubs"]').length) $('#homepage .main-container .left-side-container .quest-container').after($('a[rel="clubs"]'));
    $('#homepage .main-container .left-side-container .quest-container').after($('a[rel="god-path"]'));
    $('#homepage .main-container .left-side-container .quest-container').after($('a[rel="pachinko"]'));
    //$('#homepage .main-container .left-side-container .quest-container').after($('a[rel="pvp-arena"]'));
    if ($('.lust-arena-style-tweak-wrapper').length) $('#homepage .main-container .left-side-container .quest-container').after($('.lust-arena-style-tweak-wrapper'));
    else $('#homepage .main-container .left-side-container .quest-container').after($('a[rel="pvp-arena"]'));
    $('#homepage .main-container .left-side-container .quest-container').after($('a[rel="shop"]'));
    $('#homepage .main-container .left-side-container .quest-container').after($('a[rel="harem"]'));
    $('#homepage .main-container .left-side-container .quest-container').after($('a[rel="activities"]'));

    $('a[rel="map"] > .notif-position > span:nth-child(1) > p:nth-child(1)').after(`<img class="script-home-icon" src="https://hh2.hh-content.com/pictures/design/menu/map.svg" style="left: 0px;">`);
    $('a[rel="activities"] > .notif-position > span:nth-child(1) > p:nth-child(1)').after(`<img class="script-home-icon" src="https://hh2.hh-content.com/design/menu/missions.svg" style="right: 0px;">`);
    $('a[rel="harem"] > .notif-position > span:nth-child(1) > p:nth-child(1)').after(`<img class="script-home-icon" src="https://hh2.hh-content.com/pictures/design/harem.svg" style="left: 0px;">`);
    $('a[rel="shop"] > .notif-position > span:nth-child(1) > p:nth-child(1)').after(`<img class="script-home-icon" src="https://hh2.hh-content.com/design/menu/shop.svg" style="right: 0px;">`);
    $('a[rel="pvp-arena"] > .notif-position > span:nth-child(1) > p:nth-child(1)').after(`<img class="script-home-icon" src="https://hh2.hh-content.com/design/menu/leaderboard.svg" style="left: -9px;">`);
    $('a[rel="pachinko"] > .notif-position > span:nth-child(1) > p:nth-child(1)').after(`<img class="script-home-icon" src="https://hh2.hh-content.com/pictures/design/menu/pachinko.svg" style="right: 0px;">`);
    $('a[rel="god-path"] > .notif-position > span:nth-child(1) > p:nth-child(1)').after(`<img class="script-home-icon" src="https://hh2.hh-content.com/design/menu/ic_champions.svg" style="left: 0px;">`);
    $('a[rel="clubs"] > .notif-position > span:nth-child(1) > p:nth-child(1)').after(`<img class="script-home-icon" src="https://hh2.hh-content.com/pictures/design/clubs.svg" style="right: 0px;">`);

    $('.event-cards-container').prepend($('.raids'));

    //CSS
    sheet.insertRule(`#homepage .main-container .left-side-container .quest-container > a > .notif-position > span,
            #homepage .main-container .left-side-container > a > .notif-position > span,
            .event-widget .event-thumbnail .bar-wrapper, #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .pov-button > a[rel="path-of-valor"] > .notif-position .pov-widget,
            #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .season-button > a > .notif-position > span,
            .lust-arena-style-tweak-wrapper > [rel="leagues"], .lust-arena-style-tweak-wrapper > [rel="pvp-arena"] p, .lust-arena-style-tweak-wrapper > [rel="season"] {
        background-color: rgba(32, 3, 7, 0.75) !important;}`
    );

    sheet.insertRule(`#homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .pov-button > a[rel="path-of-valor"] > .notif-position .pov-widget,
            #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .pov-button > a[rel="path-of-glory"] > .notif-position .pov-widget {
        background-color: rgba(32, 3, 7, 0.75) !important;}`
    );

    sheet.insertRule(`.lust-arena-right-section > [rel="penta-drill"] p,
            .lust-arena-right-section > [rel="season"] p {
        background-color: rgba(32, 3, 7, 0.75) !important;}`
    );

    sheet.insertRule(`#homepage #home_missions_bar2 .text {
        text-shadow: none;}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage #home_missions_bar2 .text {
        font-size: 13px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .main-container .left-side-container .harem-container .collect-button {
        top: -23.25rem;
        left: 9.8rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .main-container .left-side-container .harem-container .collect-button {
        top: -22.1rem;
        left: 9.6rem;}}`
    );

    sheet.insertRule(`#homepage .main-container .left-side-container .harem-container .collect-button #collect_all {
        height: 36px;
        width: 36px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .season-pov-container, #homepage .event-cards-container {
        position: absolute;
        bottom: 81px;
        right: -8px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .season-pov-container, #homepage .event-cards-container {
        position: absolute;
        bottom: 81px;
        right: -18px;}}`
    );

    sheet.insertRule(`#homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-widget-container {
        position: relative;
        width: 14.15rem;
        margin-left: -15px;
        bottom: 7px;}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-widget-container {
        margin-left: -11px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .bottom-container .info-container {
        z-index: 2;
        position: absolute;
        bottom: 0px;
        right: -67px;
        transform: scale(0.7);}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .bottom-container .info-container {
        z-index: 2;
        position: absolute;
        right: -85px;
        bottom: 2px;
        transform: scale(0.68);}}`
    );

    sheet.insertRule(`#homepage #mc-selector {
        max-width: 95px;
        align-items: center;}`
    );

    sheet.insertRule(`#homepage #mc-selector .expired-text {
        z-index: 1;}`
    );

    sheet.insertRule(`#homepage .main-container .middle-container .bottom-container .box-container .waifu-buttons-container {
        position: fixed;
        top: 450px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .main-container .middle-container .bottom-container .box-container .waifu-buttons-container {
        right: 411px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .main-container .middle-container .bottom-container .box-container .waifu-buttons-container {
        right: 401px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .social_links {
        z-index: 2;
        transform: scale(0.7);
        position: absolute;
        margin-left: 0rem !important;
        top: 455px;
        left: 547px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .social_links .social_links_buttons .links, #homepage .social_links .social_links_games .links {
        position: relative;
        top: 0px;
        right: -6px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .social_links .social_links_games.shown {
        margin-right: -9rem;
        width: 15rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .social_links .social_links_buttons.shown {
        margin-right: -12rem;
        width: 15rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .social_links .social_links_buttons.shown .links, #homepage .social_links .social_links_games.shown .links {
        top: 0.5rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .social_links .social_links_games.shown .links {
        right: -0.5rem;}}`
    );

    sheet.insertRule(`#homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-widget-container .event-widget {
        margin-bottom: 0px;}`
    );

    sheet.insertRule(`#homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .mega-event {
        margin-left: 10px;
        width: 230px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .main-container .left-side-container > a[rel="harem"] > .button-notification-icon {
        top: 1px;}}`
    );

    sheet.insertRule(`.script-home-icon {
        position: absolute;
        top: 0px;
        height: 100%;
        max-height: 54px;
        opacity: 0.3;}`
    );

    sheet.insertRule(`.seasons_button, #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .pov-button > a[rel="path-of-glory"] > .notif-position .pov-widget, #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .pov-button > a[rel="path-of-valor"] > .notif-position .pov-widget {
        margin-left: 10px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .main-container .middle-container .waifu-and-right-side-container .waifu-container img {
        height: 509px;
        width: 204px;
        margin-left: 100px;
        margin-top: 24px !important;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .main-container .middle-container .waifu-and-right-side-container .waifu-container img {
        height: 481px;
        width: 193px;
        margin-left: 105px;
        margin-top: 30px !important;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .main-container .middle-container .waifu-and-right-side-container .waifu-container canvas.animated-girl-display {
        top: -15rem;
        -webkit-transform: translate3d(0,0,0) scale(.41);}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .main-container .middle-container .waifu-and-right-side-container .waifu-container canvas.animated-girl-display {
        top: -19.5rem;
        -webkit-transform: translate3d(0,0,0) scale(.39);}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .season-button > a > .button-notification-icon,
            #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .pov-button > a > .button-notification-icon {
        left: 221px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .season-button > a > .button-notification-icon,
            #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .pov-button > a > .button-notification-icon {
        left: 219px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .event-widget .event-timer .button-notification-icon.button-notification-reward {
        top: -21px;
        right: 11px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .event-widget .event-timer .button-notification-icon.button-notification-reward {
        top: -12px;
        right: 7px;}}`
    );

    sheet.insertRule(`#homepage .promo_discount span {
        right: 0px;}`
    );

    sheet.insertRule(`#homepage .main-container .left-side-container > a[rel="leaderboard"] > .notif-position .additional-menu-data > img {
        margin-left: -3px;}`
    );

    sheet.insertRule(`#homepage .main-container .left-side-container > a[rel="leaderboard"] > .notif-position .additional-menu-data > p.league-rank {
        margin-top: 6px;
        margin-left: 4px;}`
    );

    sheet.insertRule(`#homepage .mega-event .button-notification-icon {
        top: -6px;
        right: -8px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .event-widget-container .world-boss .button-notification-icon {
        top: -6px;
        right: -3px;}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .event-widget-container .world-boss .button-notification-icon {
        top: -7px;
        right: -8px;}`
    );

    sheet.insertRule(`#homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .mega-event {
	    height: 4rem;}`
    );

    sheet.insertRule(`#homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .raids {
        display: flex;
        height: 4rem;
        width: 230px;
        position: relative;
        right: -10px;
        margin-bottom: 4px;
        opacity: 1;
        color: #fff;
        text-decoration: none;
        background-color: #200307;
        border: 1px solid #ffb827;
        padding: 0 4px;
        transition: background 150ms, transform 200ms;
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.35);
        border-radius: 2px;
        padding-left: 1rem;
        background: url("/images/design/raids/1.jpg") no-repeat center;
        background-size: cover;}`
    );

    sheet.insertRule(`#homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .raids a {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        text-decoration: none;
        color: white;}`
    );

    sheet.insertRule(`#homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .raids a .over {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        left: 0;}`
    );

    sheet.insertRule(`#homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .raids a .over > p {
        margin: 0;
        text-shadow: 1px 1px 0 #000000, -1px 1px 0 #000000, -1px -1px 0 #000000, 1px -1px 0 #000000;}`
    );

    sheet.insertRule(`#homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .raids a .over > .raids-amount {
        font-size: 0.75rem;
        color: #8EC3FF;
        text-shadow: 1px 1px 0 #000000, -1px 1px 0 #000000, -1px -1px 0 #000000, 1px -1px 0 #000000;}`
    );
}

//Hide claimed rewards in Season, PoV, PoG, PoA, DP, Hero and mega-events
function moduleHideClaimedRewards() {
    //PoV and PoG rewards
    if(['/path-of-valor.html', '/path-of-glory.html'].some(testPage)) {
        const POV_REM_PER_GROUP = 0.3 + 3.6; // margin-top + height
        const POV_PX_PER_GROUP = POV_REM_PER_GROUP * 16;
        let hidden = false;
        let $groupsToHide = $('.potions-paths-tier:not(.unclaimed):has(.claimed-slot)');
        let $groupsRemaining = $('.potions-paths-tier.unclaimed');
        let claimedCount = $groupsToHide.length;
        let unclaimedCount = $groupsRemaining.length;
        const heightPattern = /height: ?(?<existingLength>[0-9.a-z%]+);?/;
        let existingLengthStr;
        let newLength;
        const $progressBar = $('.potions-paths-progress-bar .potions-paths-progress-bar-current');
        const styleAttr = $progressBar.attr('style');

        const assertHidden = () => {
            $groupsToHide = $('.potions-paths-tier:not(.unclaimed):has(.claimed-slot)');
            $groupsRemaining = $('.potions-paths-tier.unclaimed');
            claimedCount = $groupsToHide.length;
            unclaimedCount = $groupsRemaining.length;

            if (claimedCount == 0) {
                // nothing to do
                return
            }

            $groupsToHide.addClass('script-hide-claimed');
            progressBarLength();
            hidden = true;
            if (styleAttr) $progressBar.attr('style', styleAttr.replace(heightPattern, `height:${newLength};`));
        }

        const assertShown = () => {
            $('.script-hide-claimed').removeClass('script-hide-claimed')
            hidden = false
            if (styleAttr) $progressBar.attr('style', styleAttr.replace(heightPattern, `height:${existingLengthStr};`))
        }

        const progressBarLength = () => {
            if (styleAttr) {
                const matches = styleAttr.match(heightPattern);
                if (matches && matches.groups) existingLengthStr = matches.groups.existingLength;
                if (existingLengthStr) {
                    newLength = existingLengthStr;
                    if (existingLengthStr.endsWith('px')) {
                        const existingLength = parseInt(existingLengthStr);
                        newLength = Math.round(existingLength - (claimedCount * POV_PX_PER_GROUP)) + 'px';
                    } else if (existingLengthStr.endsWith('rem')) {
                        const existingLength = parseFloat(existingLengthStr);
                        newLength = existingLength - (claimedCount * POV_REM_PER_GROUP) + 'rem';
                    }
                }
            }
        }

        progressBarLength();
        assertHidden();
        $('.potions-paths-progress-bar-section').stop(true).animate({
            scrollTop: Math.max(0, (unclaimedCount * POV_PX_PER_GROUP) - 150)
        }, 100)

        const toggle = () => {
            if (hidden) assertShown();
            else assertHidden();
        }
        $('.girl-preview .avatar').click(toggle);
    }

    function eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $rewards, $rewardsRow, start_px, width_px, freePath, paidPath, freeClaimedRewards, paidClaimedRewards, claimableRewards, $progressBar, nbDisplayedRewards, $girls, nbTimeout) {
        let rewards_unclaimed = 0;
        let rewards_hidden = 0;
        let progress_bar_width = 0;
        let progress_bar_width_hidden = 0;
        let init = true;

        const fixWidth = () => {if (!CurrentPage.includes("/world-boss-event")) $rewardsRow.css('width', 'max-content');}

        const assertHidden = (shouldScroll) => {
            rewards_hidden = 0;
            rewards_unclaimed = 0;

            $rewards.each((i, el) => {
                const $free = $(el).find(freePath);
                const $pass = $(el).find(paidPath);
                if ($free.hasClass(freeClaimedRewards) && ($pass.hasClass(paidClaimedRewards) || !bonusRewardsUnlocked)) $(el).addClass('script-hide-claimed');

                if($('a.active[href*="?tab=path_event_"]').length || CurrentPage == "/season.html")
                    if ($free.hasClass(claimableRewards) || ($pass.hasClass(claimableRewards) && bonusRewardsUnlocked)) rewards_unclaimed += 1;
            })

            fixWidth();

            if (CurrentPage == "/member-progression.html") rewards_unclaimed = $('.tier').length - ($('.tier.available').length + $('.tier.claimed').length);
            else if (CurrentPage.includes("/world-boss-event")) rewards_unclaimed = $('.tier.unclaimed').length;
            else if (CurrentPage == "/penta-drill.html") rewards_unclaimed = $('.rewards_penta_drill_row .rewards_pair .btn_claim').length;
            else if(!($('a.active[href*="?tab=path_event_"]').length || CurrentPage == "/season.html")) {
                rewards_unclaimed = $('button.purple_button_L.button_glow:not(.hidden)').length;
                Array.from($('button.purple_button_L.button_glow:not(.hidden)')).forEach((button) => {if($(button).css('display') == "none") rewards_unclaimed--;});
            }

            rewards_hidden = $('.script-hide-claimed').length;
            progress_bar_width = parseInt(start_px + (rewards_unclaimed + rewards_hidden - 1) * width_px, 10);
            progress_bar_width_hidden = parseInt(start_px + (rewards_unclaimed - 1) * width_px, 10);

            if (!CurrentPage.includes("/world-boss-event")) $progressBar.css('width', progress_bar_width_hidden + 'px');
            else $progressBar.css('height', progress_bar_width_hidden + 'px');

            function hideClaimedRewards() {
                let scroll_left_px = parseInt(width_px * Math.max(0, (rewards_unclaimed - nbDisplayedRewards)), 10);

                if (!CurrentPage.includes("/world-boss-event"))
                    try {$rowScroll.scrollLeft = scroll_left_px} catch(err) {console.log(`HH++ OCD script error (Problem with scroll): ${err.name}\n ${err.message}\n ${err.stack}`)}
                else
                    try {$rowScroll.scrollTop = scroll_left_px} catch(err) {console.log(`HH++ OCD script error (Problem with scroll): ${err.name}\n ${err.message}\n ${err.stack}`)}
            }

            if (shouldScroll) {
                if (init) {
                    setTimeout(() => {
                        hideClaimedRewards();
                        init = false;
                    }, nbTimeout*timeout);
                }
                else hideClaimedRewards();
            }
        }

        const assertShown = (shouldScroll) => {
            $rewards.removeClass('script-hide-claimed');

            if (!CurrentPage.includes("/world-boss-event")) $progressBar.css('width', progress_bar_width + 'px');
            else $progressBar.css('height', progress_bar_width + 'px');

            fixWidth();

            if (shouldScroll) {
                let scroll_right_px = parseInt((rewards_unclaimed + rewards_hidden - nbDisplayedRewards) * width_px, 10);

                if (!CurrentPage.includes("/world-boss-event"))
                    try {$rowScroll.scrollLeft = scroll_right_px} catch(err) {console.log(`HH++ OCD script error (Problem with scroll): ${err.name}\n ${err.message}\n ${err.stack}`)}
                else
                    try {$rowScroll.scrollTop = scroll_right_px} catch(err) {console.log(`HH++ OCD script error (Problem with scroll): ${err.name}\n ${err.message}\n ${err.stack}`)}
            }
        }

        const toggle = () => {
            if ($('.script-hide-claimed').length) assertShown(true);
            else assertHidden(true);
        }

        assertHidden(true);

        $girls.click(()=>{toggle()});

        if($('#mega-event-tabs #home_tab').length > 0) {
            document.getElementById('home_tab').addEventListener('click', () => {
                $('.girl').click(()=>{toggle()});
            });
        }
    }

    //World Boss Tournament
    if(CurrentPage.includes("/world-boss-event")) {
        const bonusRewardsUnlocked = false;
        const start_px_desktop = 44;
        const start_px_mobile = 48;
        const width_px_desktop = 56.76;
        const width_px_mobile = 64.79;

        new MutationObserver(() => {
            const $rowScroll = document.getElementsByClassName('progress-bar-section')[0];

            if (window.FullSize.width > 1025)
                eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $('#milestones_tab_container .tier'), $('#milestones_tab_container .progress-bar-tiers'), start_px_desktop, width_px_desktop, '.free-slot', '', 'claimed-slot', '', 'unclaimed', $('#milestones_tab_container .progress-bar-current'), 4, $('#milestones_tab_container .right-container'), 4);
            else
                eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $('#milestones_tab_container .tier'), $('#milestones_tab_container .progress-bar-tiers'), start_px_mobile, width_px_mobile, '.free-slot', '', 'claimed-slot', '', 'unclaimed', $('#milestones_tab_container .progress-bar-current'), 4, $('#milestones_tab_container .right-container'), 4);
        }).observe($('#milestones_tab')[0], {attributes: true});

        if(window.location.search == "?tab=milestones_tab_container") {
            const $rowScroll = document.getElementsByClassName('progress-bar-section')[0];

            if (window.FullSize.width > 1025)
                eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $('#milestones_tab_container .tier'), $('#milestones_tab_container .progress-bar-tiers'), start_px_desktop, width_px_desktop, '.free-slot', '', 'claimed-slot', '', 'unclaimed', $('#milestones_tab_container .progress-bar-current'), 4, $('#milestones_tab_container .right-container'), 4);
            else
                eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $('#milestones_tab_container .tier'), $('#milestones_tab_container .progress-bar-tiers'), start_px_mobile, width_px_mobile, '.free-slot', '', 'claimed-slot', '', 'unclaimed', $('#milestones_tab_container .progress-bar-current'), 4, $('#milestones_tab_container .right-container'), 4);
        }

        //CSS
        sheet.insertRule(`#world-boss-event .tabs-section #milestones_tab_container .middle-container .tiers-section .progress-bar-section .progress-bar-tiers > .tier {
            margin-bottom: 0.05rem;}`
        );
    }

    //Season rewards
    if(CurrentPage == "/season.html") {
        const bonusRewardsUnlocked = (!$('#gsp_btn_holder').length == 1);
        const $rowScroll = document.getElementById('rewards_container');
        const start_px = 0;
        const width_px_desktop = 79;
        const width_px_mobile = 87;

        if (window.FullSize.width > 1025)
            eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $('.rewards_pair'), $('#rewards_row'), start_px, width_px_desktop, '.free_reward', '.pass_reward', 'reward_claimed', 'reward_claimed', 'reward_is_claimable', $(''), 6, $('#girls_holder .girl_block'), 6);
        else
            eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $('.rewards_pair'), $('#rewards_row'), start_px, width_px_mobile, '.free_reward', '.pass_reward', 'reward_claimed', 'reward_claimed', 'reward_is_claimable', $(''), 5, $('#girls_holder .girl_block'), 6);
    }

    //PoA and DP events
    if(CurrentPage == "/event.html") {
        //PoA event
        if($('a.active[href*="?tab=path_event_"]').length) {
            const bonusRewardsUnlocked = (!$('.nc-poa-tape-blocker').length == 1);
            const $rowScroll = document.getElementsByClassName('scroll-area poa')[0];
            const start_px = 0;
            const width_px = 75;

            eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $('.nc-poa-reward-pair'), $('#nc-poa-tape-rewards'), start_px, width_px, '.nc-poa-free-reward', '.nc-poa-locked-reward', 'claimed', 'claimed', 'claimable', $(''), 7, $('#poa-content .girls .girl-avatar'), 6);

            //CSS
            sheet.insertRule(`#events .nc-panel-container .nc-panel-body #nc-poa-tape-rewards .nc-poa-reward-pair {
                margin: 0;}`
            );
        }

        //DP event
        if($('a.active[href*="?tab=dp_event_"]').length) {
            const bonusRewardsUnlocked = (!$('.nc-poa-tape-blocker').length == 1);
            const $rowScroll = document.getElementsByClassName('player-progression-container')[0];
            const start_px = 40;
            const width_px = 96;

            eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $('.tiers-progression .tier-container'), $('.tiers-progression'), start_px, width_px, '.free-slot', '.paid-slot', 'claimed', 'claimed', '', $('.dp-progress-bar-current'), 4, $('#dp-content .right-container>img'), 4);

            //CSS
            sheet.insertRule(`#dp-content .left-container .tiers-container .player-progression-container .tiers-progression .tier-container {
                width: 3.5rem;}`
            );

            sheet.insertRule(`#dp-content .left-container .tiers-container {
                margin-top: 2rem;
                width: 63rem;}`
            );

            sheet.insertRule(`#dp-content .left-container .tiers-container .player-progression-container,
                    #dp-content .left-container .tiers-container .player-progression-container .yellow-banner {
                z-index: 3;
                width: 57rem;}`
            );

            sheet.insertRule(`#dp-content .left-container .tiers-container .player-progression-container .nc-poa-tape-blocker:not(.yellow-banner) {
                left: 28.6rem;
                z-index: 4;}`
            );
        }
    }

    //Hero rewards
    if(CurrentPage == "/member-progression.html") {
        const bonusRewardsUnlocked = (!$('#pass_holder').length == 1);
        const $rowScroll = document.getElementsByClassName('tiers-container hh-scroll')[0];
        const start_px = 70;
        const width_px = 104;

        eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $('.tiers-container .tiers .tier'), $('.tiers-container .tiers'), start_px, width_px, '.free-slot', '.paid-slots', 'claimed-slot', 'claimed-slot', '', $('.progress-bar-current'), 3, $('.page-girl'), 4);
    }

    //Penta Drill
    if(CurrentPage == "/penta-drill.html") {
        const bonusRewardsUnlocked = (!$('#penta_pass_overlay').length == 1);
        const $rowScroll = document.getElementsByClassName('rewards_container_penta_drill hh-scroll')[0];
        const start_px = 0;
        const width_px = 85;

        eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $('.rewards_pair'), $('.rewards_penta_drill_row'), start_px, width_px, '.free_reward', '.pass_reward', 'reward_claimed', 'reward_claimed', 'reward_is_claimable', $(''), 5, $('.girl_block'), 6);

        //CSS
        sheet.insertRule(`.rewards_penta_drill_row .rewards_pair {
            margin: 0 -2px;}`
        );
    }

    //Mega-events (Lusty Race, Hot Assembly, Seasonal Event)
    if(CurrentPage == "/seasonal.html") {
        const $rowScroll = document.getElementsByClassName('mega-progress-bar-section hh-scroll')[0];

        //Lusty Race
        if ($('.mega-tiers-section .mega-tier-container.double-tier').length) {
            const bonusRewardsUnlocked = (!$('#get_mega_pass_kobans_btn').length == 1);
            const start_px = 20;
            const width_px = 77;

            eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $('.mega-tier-container'), $('.mega-progress-bar-tiers'), start_px, width_px, '.free-slot', '.pass-slot', 'claimed', 'paid-claimed', '', $('.mega-progress-bar-current'), 6, $('#home_tab_container .girls-reward-container .girl'), 4);

            //CSS
            sheet.insertRule(`.mega-event-panel .mega-event-container .tabs-section #home_tab_container .bottom-container .right-part-container .mega-tiers-section .mega-progress-bar-section .mega-progress-bar-tiers.double-mega-event .mega-tier-container {
                width: 77px;}`
            );

            sheet.insertRule(`.mega-event-panel .mega-event-container .tabs-section #home_tab_container .bottom-container .right-part-container .mega-tiers-section .mega-progress-bar-section .mega-progress-bar-tiers .double-tier .mega-tier {
                margin: 1rem 0 0;}`
            );
        }

        //Seasonal event and Hot Assembly
        else {
            const bonusRewardsUnlocked = false;
            const start_px = 37;
            const width_px = 92;

            eventsRewardsDisplay(bonusRewardsUnlocked, $rowScroll, $('.mega-tier-container'), $('.mega-progress-bar-tiers'), start_px, width_px, '.mega-tier', '', 'claimed', 'claimed', '', $('.mega-progress-bar-current'), 5, $('#home_tab_container .girls-reward-container .girl'), 4);

            //CSS
            sheet.insertRule(`.mega-event-panel .mega-event-container .tabs-section #home_tab_container .bottom-container .right-part-container .mega-tiers-section .mega-progress-bar-section .mega-progress-bar-tiers .mega-tier-container {
                width: ${width_px} + px;}`
            );

            sheet.insertRule(`.mega-event-panel .mega-event-container .tabs-section #home_tab_container .bottom-container .right-part-container .mega-tiers-section .mega-progress-bar-section .mega-progress-bar-tiers .mega-tier-container .mega-tier {
                margin: 1rem 0 0;}`
            );
        }
    }
}

//Force desktop display on mobile
function moduleDesktopDisplay() {
    setTimeout(() => {
        let viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute('content', 'width=1026px, user-scalable=0');

        if (['event'].some(testPage)) {
            $('#events .scroll-area').css('overflow', 'auto');
            $('#events .scroll-area').css('touch-action', '');
            $('#dp-content .left-container .tiers-container .player-progression-container').css('overflow-x', 'auto');
            $('#dp-content .left-container .tiers-container .player-progression-container').css('touch-action', '');
        }

        else if (['shop'].some(testPage)) {
            $('#tabs-switcher .market-menu-switch-tab[type="armor"]')[0].addEventListener("click", () => {
                setTimeout(() => {
                    $('#player-inventory.armor').css('overflow', 'auto');
                    $('#player-inventory.armor').css('touch-action', '');
                }, timeout);
            }, {once: false});

            $('#tabs-switcher .market-menu-switch-tab[type="booster"]')[0].addEventListener("click", () => {
                setTimeout(() => {
                    $('#player-inventory.booster').css('overflow', 'auto');
                    $('#player-inventory.booster').css('touch-action', '');
                }, timeout);
            }, {once: false});

            $('#tabs-switcher .market-menu-switch-tab[type="potion"]')[0].addEventListener("click", () => {
                setTimeout(() => {
                    $('#player-inventory.potion').css('overflow', 'auto');
                    $('#player-inventory.potion').css('touch-action', '');
                }, timeout);
            }, {once: false});

            $('#tabs-switcher .market-menu-switch-tab[type="gift"]')[0].addEventListener("click", () => {
                setTimeout(() => {
                    $('#player-inventory.gift').css('overflow', 'auto');
                    $('#player-inventory.gift').css('touch-action', '');
                }, timeout);
            }, {once: false});
        }

        else if (['girl'].some(testPage)) {
            if (window.location.search.includes('experience')) {
                $('#experience .inventory').css('overflow', 'auto');
                $('#experience .inventory').css('touch-action', '');

                $('#gifts_tab')[0].addEventListener("click", () => {
                    setTimeout(() => {
                        $('#affection .inventory').css('overflow', 'auto');
                        $('#affection .inventory').css('touch-action', '');
                    }, timeout);
                }, {once: true});
            }
            else {
                $('#affection .inventory').css('overflow', 'auto');
                $('#affection .inventory').css('touch-action', '');

                $('#books_tab')[0].addEventListener("click", () => {
                    setTimeout(() => {
                        $('#experience .inventory').css('overflow', 'auto');
                        $('#experience .inventory').css('touch-action', '');
                    }, timeout);
                }, {once: true});
            }
        }

        else if (['seasonal'].some(testPage)) {
            $('.seasonal-progress-bar-section').css('overflow', 'auto');
            $('.seasonal-progress-bar-section').css('touch-action', '');
        }

        else if (['activities'].some(testPage)) {
            $('#missions .missions_wrap').css('overflow', 'auto');
            $('#missions .missions_wrap').css('touch-action', '');
        }

        else if (['member-progression'].some(testPage)) {
            $('.tiers-container').css('overflow', 'auto');
            $('.tiers-container').css('touch-action', '');
        }
    }, timeout)
}

//Hide Claim All button in season, PoV and PoG
function moduleHideClaimAllButtons() {
    if(['/season.html', '/path-of-valor.html', '/path-of-glory.html', '/member-progression.html', '/world-boss-event', '/penta-drill.html'].some(testPage)) {
        sheet.insertRule(`button#claim-all {
            visibility: hidden !important;}`
        );
    }
}

function moduleHideMultipleLeagueBattlesButton() {
    $('.league_buttons_block').remove();
}

function moduleEventEndIndicator() {
    const THRESHOLD = 24*60*60;

    annotateEventWidget();
    annotatePathEvents();
    annotateSeasonalWidget();

    function annotateEventWidget () {
        const $eventTimers = $('.event-widget .timer:not(.severalQoL-event-timer)')

        $eventTimers.each((i, el) => {
            const $el = $(el);
            const timeleft = $el.data('timeStamp');
            const link = $el.parent().parent().attr('href')

            if (timeleft < THRESHOLD && link != "#") {
                $el.find('p').addClass('script-event-ending-soon');
            }
            else if (timeleft < THRESHOLD && link == "#") {
                $el.find('p').addClass('script-event-starting-soon');
            }
        })
    }

    function annotateSeasonalWidget () {
        const $eventTimers = $('.mega-event .timer')

        $eventTimers.each((i, el) => {
            const $el = $(el);
            const timeleft = $el.data('timeStamp');

            if (timeleft < THRESHOLD) {
                $el.find('p').addClass('script-ending-soon');
            }
        })
    }

    function annotatePathEvents () {
        ['Pov', 'Pog', 'Season', 'PentaDrill'].forEach(type => annotatePathEvent(type));
    }

    function annotatePathEvent (type) {
        const endTime = localStorage.getItem('HHS.' + type + 'Time');
        const {server_now_ts} = window;

        if (endTime && endTime > server_now_ts && endTime - THRESHOLD < server_now_ts || endTime < server_now_ts || typeof endTime == 'undefined') {
            if (type == 'Pov' || type == 'Pog') $('#script' + type + 'Time').addClass('script-ending-soon');
            else if (type == 'Season') {
                $('#script' + type + 'Time').addClass('script-season-ending-soon');
                $('#homepage a[rel=season]').addClass('script-ending-soon');
                $('#homepage a[rel=season] p').addClass('script-ending-soon');
            }
            else if (type == 'PentaDrill') {
                $('#script' + type + 'Time').addClass('script-season-ending-soon');
                $('#homepage a[rel=penta-drill]').addClass('script-ending-soon');
                $('#homepage a[rel=penta-drill] p').addClass('script-ending-soon');
            }
        }
    }

    //CSS
    sheet.insertRule(`.script-ending-soon {
        animation-name: pulsing-seasons-and-path;
        animation-duration: 4s;
        animation-iteration-count: infinite;}`
    );

    sheet.insertRule(`.script-season-ending-soon {
        animation-name: pulsing-seasons-and-path;
        animation-duration: 4s;
        animation-iteration-count: infinite;
        border-radius: 8px 10px 10px 8px;}`
    );

    sheet.insertRule(`.script-event-ending-soon {
        animation-name: pulsing-events;
        animation-duration: 4s;
        animation-iteration-count: infinite;}`
    );

    sheet.insertRule(`.script-event-starting-soon {
        animation-name: pulsing-starting-events;
        animation-duration: 4s;
        animation-iteration-count: infinite;}`
    );

    sheet.insertRule(`@keyframes pulsing-events {
        0% {opacity: 0.8; background-color: rgba(32, 3, 7, 0); color: red;}
        50% {opacity: 1; background-color: rgba(255, 0, 0, 0.8); color: #8ec3ff;}
        100% {opacity: 0.8; background-color: rgba(32, 3, 7, 0); color: red;}}`
    );

    sheet.insertRule(`@keyframes pulsing-starting-events {
        0% {opacity: 0.8; background-color: rgba(32, 3, 7, 0); color: green;}
        50% {opacity: 1; background-color: rgba(0, 180, 0, 0.8); color: #8ec3ff;}
        100% {opacity: 0.8; background-color: rgba(32, 3, 7, 0); color: green;}}`
    );

    sheet.insertRule(`@keyframes pulsing-seasons-and-path {
        0% {opacity: 1; background-color: rgba(32, 3, 7, 0); color: red;}
        50% {opacity: 1; background-color: rgba(255, 0, 0, 0.8); color: white;}
        100% {opacity: 1; background-color: rgba(32, 3, 7, 0); color: red;}}`
    );
}

//Add contests expiration timer in Activities
function moduleContestsExpiryTimer() {
    if (!window.contests.finished) return;
    const contestExpiration = 21*24*60*60 - 60*60;

    function displayExpiryTimer() {
        window.contests.finished.forEach(function(contest) {
            const remainingTime = contestExpiration + contest.remaining_time;
            let days = Math.floor(remainingTime/3600/24);
            let hours = Math.floor((remainingTime - days*24*3600)/3600);
            let minutes = Math.floor((remainingTime - days*24*3600 - hours*3600)/60);

            if (days == 0) $(`#contests .contest[id_contest=${contest.id_contest}]`).children('.contest_header').append(`<div class="contest_expiration_timer">${window.GT.design.expires_in} : ${hours}${labels.hour} ${minutes}${labels.minute}</div>`);
            else $(`#contests .contest[id_contest=${contest.id_contest}]`).children('.contest_header').append(`<div class="contest_expiration_timer">${window.GT.design.expires_in} : ${days}${labels.day} ${hours}${labels.hour}</div>`);
        })
    }

    displayExpiryTimer();
    new MutationObserver(() => {displayExpiryTimer()}).observe($('#contests')[0], {childList: true})

    //CSS
    sheet.insertRule(`.contest_expiration_timer {
        position: relative;
        z-index: 100;
        bottom: 107px;
        left: 11px;
        font-size: 14px;}`
    );
}

//Stop background switching during Orgy Days event (Credit: Finderkeeper)
function stopOrgyBackgroundSwitching() {
    if ($("body[ page ]").attr("page") != "map") {
        $("#bg_all").replaceWith( $("#bg_all").clone() );
        $("#bg_all > div > img").not($("#bg_all > div > img")[Math.floor(Math.random()*$("#bg_all > div > img").length)]).remove();
        $("#bg_all > div > img").css("opacity","1");
        $("#bg_all > div > img").css("display","block");
    }
}

//Get data for girls already got
function getHaremGirlsData() {
    if ($('.harem-girl-container').length) {
        let girlShardsDictionary = (!localStorage.getItem('HHS.HHPNShardsMap')) ? new Map(): new Map(JSON.parse(localStorage.getItem('HHS.HHPNShardsMap')));
        let girlSkinsDictionary = (!localStorage.getItem('HHS.HHPNSkinsMap')) ? new Map(): new Map(JSON.parse(localStorage.getItem('HHS.HHPNSkinsMap')));

        let girlsData = ['waifu'].some(testPage) ? window.girls_data_list : window.availableGirls;
        let girlNameDictionary = new Map();

        for (let i=0; i<girlsData.length; i++) {
            let girl_data = {af: 0,
                            xp: 0,
                            awL: 0,
                            av: null,
                            c: null,
                            e: null,
                            f: null,
                            gr: null,
                            id: null,
                            l: null,
                            n: null,
                            nbGr: null,
                            r: null,
                            s: null,
                            sh: 100,
                            sH: null,
                            sk: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
                            }

            girl_data.af = girlsData[i].affection;
            girl_data.xp = girlsData[i].xp;
            girl_data.awL = girlsData[i].awakening_level;
            girl_data.av = girlsData[i].avatar.charAt(girlsData[i].avatar.indexOf('ava') + 3)
            girl_data.c = girlsData[i].class;
            girl_data.e = girlsData[i].element;
            girl_data.f = girlsData[i].figure;
            girl_data.gr = girlsData[i].graded;
            girl_data.id = parseInt(girlsData[i].id_girl, 10);
            girl_data.l = girlsData[i].level;
            girl_data.n = girlsData[i].name;
            girl_data.nbGr = girlsData[i].nb_grades;
            girl_data.r = girlsData[i].rarity;
            girl_data.s = girlsData[i].salary;
            girl_data.sh = girlsData[i].shards;
            girl_data.sH = girlsData[i].salary_per_hour;
            girl_data.sk[1] = girlsData[i].skill_tiers_info[1].skill_points_used;
            girl_data.sk[2] = (girlsData[i].skill_tiers_info[2] != undefined) ? girlsData[i].skill_tiers_info[2].skill_points_used : 0;
            girl_data.sk[3] = (girlsData[i].skill_tiers_info[3] != undefined) ? girlsData[i].skill_tiers_info[3].skill_points_used : 0;
            girl_data.sk[4] = (girlsData[i].skill_tiers_info[4] != undefined) ? girlsData[i].skill_tiers_info[4].skill_points_used : 0;
            girl_data.sk[5] = (girlsData[i].skill_tiers_info[5] != undefined) ? girlsData[i].skill_tiers_info[5].skill_points_used : 0;

            girlNameDictionary.set(girl_data.id, girl_data);
            girlShardsDictionary.delete(girl_data.id);
            girlShardsDictionary.delete('' + girl_data.id);

            if (['waifu'].some(testPage)) {
                let girl_skins = girlsData[i].preview.grade_skins_data;
                if (girl_skins.length > 0) {
                    let j = 0;
                    while (j < girl_skins.length) {
                        if (!girl_skins[j].is_owned) break;
                        j++;
                    }
                    let girl_skin_shards = (j == girl_skins.length) ? 33 : girl_skins[j].shards_count;

                    let girlData = {id: girl_data.id,
                                    n: girl_data.n,
                                    sh: girl_skin_shards};
                    girlSkinsDictionary.set(girl_data.id, girlData);
                }
            }
        }
        if (girlNameDictionary.size > 0) {
            let json = JSON.stringify(Array.from(girlNameDictionary.entries()));
            localStorage.setItem('HHS.HHPNMap', json);
        }
        localStorage.setItem('HHS.HHPNShardsMap', JSON.stringify(Array.from(girlShardsDictionary.entries())));
        localStorage.setItem('HHS.HHPNSkinsMap', JSON.stringify(Array.from(girlSkinsDictionary.entries())));
    }
}

function getNonHaremGirlsData() {
    let girlShardsDictionary = (!localStorage.getItem('HHS.HHPNShardsMap')) ? new Map(): new Map(JSON.parse(localStorage.getItem('HHS.HHPNShardsMap')));
    let girlSkinsDictionary = (!localStorage.getItem('HHS.HHPNSkinsMap')) ? new Map(): new Map(JSON.parse(localStorage.getItem('HHS.HHPNSkinsMap')));

    //Girls shards
    new MutationObserver(() => {
        if ($('#harem_left .girls_list .harem-girl').length > 0) {
            for (let i=0; i<$('#harem_left .girls_list .harem-girl').length; i++) {
                let girl_id = parseInt($($('#harem_left .girls_list .harem-girl')[i]).attr('girl'), 10);
                let girl_shards = girlsDataList[girl_id].shards || 0;
                let girl_name = girlsDataList[girl_id].name;
                if (girl_shards < 100) {
                    let girlData = {id: girl_id,
                                    n: girl_name,
                                    sh: girl_shards}
                    girlShardsDictionary.set(girl_id, girlData);
                }
            }
            localStorage.setItem('HHS.HHPNShardsMap', JSON.stringify(Array.from(girlShardsDictionary.entries())));
        }
    }).observe($('#harem_left .girls_list')[0], {childList: true})

    //Girls skins
    new MutationObserver(() => {
        if ($('#skins-tab_container').length > 0) {
            let girl = $($('.pose-preview_wrapper.skin .pose-preview')[0]);
            let first_index = girl.attr('src').indexOf('/girls/') + '/girls/'.length;
            let last_index = girl.attr('src').indexOf('/grade_skins/');
            let girl_id = parseInt(girl.attr('src').substring(first_index, last_index), 10);
            let girl_name = $('#girl_preview_popup .girl_title')[0].textContent;

            let skin_poses = Array.from($('#skins-tab_container .pose-preview_wrapper.skin'));
            let j = 0;
            while (j < skin_poses.length) {
                if (skin_poses[j].getElementsByClassName('progress-container').length > 0) break;
                j++;
            }
            let skin_shards = (j == skin_poses.length) ? 33 : parseInt(skin_poses[j].getElementsByClassName('progress-container')[0].textContent.split('/')[0], 10);

            let girlData = {id: girl_id,
                            n: girl_name,
                            sh: skin_shards};
            girlSkinsDictionary.set(girl_id, girlData);
            localStorage.setItem('HHS.HHPNSkinsMap', JSON.stringify(Array.from(girlSkinsDictionary.entries())));
        }
    }).observe($('#common-popups')[0], {childList: true})

    new MutationObserver(() => {
        if ($('#harem_right .opened .diamond-container .diamond-skins').length > 0) {
            let girl_id = parseInt($($('#harem_right .opened')[0]).attr('girl'), 10);
            let girl_name = $('.girl_infos_area h3')[0].innerText || '';

            let skins_shards = [];
            Array.from($('#harem_right .opened .diamond-container .diamond.skins')).forEach((skin) => {
                if (skin.className.includes('unlocked')) skins_shards.push(33);
                else skins_shards.push(0);
            });
            let skin_shards = Math.min(...skins_shards);

            if (skin_shards == 33) {
                let girlData = {id: girl_id,
                                n: girl_name,
                                sh: skin_shards};
                girlSkinsDictionary.set(girl_id, girlData);
            }
            else {
                if (girlSkinsDictionary.get(girl_id) == undefined) {
                    let girlData = {id: girl_id,
                                    n: girl_name,
                                    sh: skin_shards};
                    girlSkinsDictionary.set(girl_id, girlData);
                }
            }
            localStorage.setItem('HHS.HHPNSkinsMap', JSON.stringify(Array.from(girlSkinsDictionary.entries())));
        }
    }).observe($('#harem_right')[0], {childList: true, subtree: true})
}

//Display the number of shards for girls
function displayGirlsShards() {
    if (['troll-', 'season-', 'pachinko', 'clubs', 'labyrinth'].some(testPage)) {
        let girlDictionary = (!(localStorage.getItem('HHS.HHPNShardsMap') && localStorage.getItem('HHS.HHPNMap'))) ? new Map() : new Map(JSON.parse(localStorage.getItem('HHS.HHPNShardsMap')).concat(JSON.parse(localStorage.getItem('HHS.HHPNMap'))));
        let nonHaremGirlShardsDictionary = (!localStorage.getItem('HHS.HHPNShardsMap')) ? new Map(): new Map(JSON.parse(localStorage.getItem('HHS.HHPNShardsMap')));
        let girlSkinsDictionary = (!localStorage.getItem('HHS.HHPNSkinsMap')) ? new Map(): new Map(JSON.parse(localStorage.getItem('HHS.HHPNSkinsMap')));

        if (['troll-pre-battle', 'season-arena', 'pachinko'].some(testPage)) {
            displayTrollGirlsShards();
            updateTrollGirlsShards();
        }
        else if (CurrentPage.indexOf('clubs') != -1) {
            displayClubChampionGirlsShards();
        }
        else if (CurrentPage.indexOf('labyrinth.html') != -1) {
            displayLabyrinthGirlsShards();
        }
        else if (['troll-battle', 'season-battle', 'labyrinth'].some(testPage)) {
            setTimeout(updateTrollGirlsShards(), timeout);
        }

        function displayTrollGirlsShards() {
            if(($($('.slot.girl_ico')[0]).attr('data-rewards')) && (CurrentPage.indexOf('troll-pre-battle') != -1)) {
                let girlsData = JSON.parse($($('.slot.girl_ico')[0]).attr('data-rewards'));
                for (let i=0; i < girlsData.length; i++) {
                    let girlId = girlsData[i].id_girl;
                    if (!girlId) return;
                    let shards = nonHaremGirlShardsDictionary.get(girlId) ? nonHaremGirlShardsDictionary.get(girlId).sh : 0;
                    let skins = girlSkinsDictionary.get(girlId) ? girlSkinsDictionary.get(girlId).sh : 0;
                    let name = nonHaremGirlShardsDictionary.get(girlId) ? nonHaremGirlShardsDictionary.get(girlId).n : '';
                    if($($($('.slot.girl_ico')[0]).find('.girl_ico')[i]).find('.skins_shard_icn').length == 0) {
                        $($($('.slot.girl_ico')[0]).find('.girl_ico')[i]).append(
                            `<div class="shards_troll" shards="${shards}" name="${name}" shards-tooltip="">
                            <span class="shard_troll"></span>
                            <p id="shard_number">${shards}</p>
                            </div>`
                        );
                    }
                    else {
                        $($($('.slot.girl_ico')[0]).find('.girl_ico')[i]).append(
                            `<div class="shards_troll" shards="${skins}" name="${name}" shards-tooltip="">
                            <span class="shard_troll"></span>
                            <p id="shard_number">${skins}</p>
                            </div>`
                        );
                    }


                    if ($('.rewards_list')[0].children.length > 5) {
                        sheet.insertRule(`.page-troll-pre-battle #shard_number {
                            left: -11px;}`
                        );
                    }
                    else {
                        sheet.insertRule(`.page-troll-pre-battle #shard_number {
                            left: -8px;}`
                        );
                    }
                }
                //CSS
                sheet.insertRule(`.page-troll-pre-battle #shard_number {
                    position: absolute;
                    bottom: -1.1em;
                    color: #80058b;
                    text-shadow: 1px 1px 0 #fff,-1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff;
                    width: 28px;
                    text-align: right;
                    font-size: 10px;}`
                );

                sheet.insertRule(`.page-troll-pre-battle .shards_troll .shard_troll {
                    background-image: url(${window.IMAGES_URL}/shards.png);
                    background-repeat: no-repeat;
                    background-size: contain;
                    position: absolute;
                    bottom: -3px;
                    margin-left: -1px;
                    width: 18px;
                    height: 18px;}`
                );
            }
            else if (($($('.slot.girl_ico')[0]).attr('data-rewards')) && (['season-arena'].some(testPage))) {
                $('.slot.girl_ico').find('.slot_girl_shards .shards').remove();
                for (let i=0; i < $('.slot.girl_ico').length; i++) {
                    for (let j=0; j < $($('.slot.girl_ico')[i]).find('.slot.slot_girl_shards img').length; j++) {
                        let girl = $($($('.slot.girl_ico')[i]).find('.slot.slot_girl_shards img')[j]);
                        let first_index = girl.attr('src').indexOf('/girls/') + '/girls/'.length;
                        let last_index = girl.attr('src').indexOf('/ico');
                        let girlId = parseInt(girl.attr('src').substring(first_index, last_index), 10);
                        let shards = (typeof JSON.parse($($('.slot.girl_ico')[i]).attr('data-rewards'))[0].previous_value != 'undefined') ? JSON.parse($($('.slot.girl_ico')[i]).attr('data-rewards'))[0].previous_value : 100;
                        let skins = (typeof JSON.parse($($('.slot.girl_ico')[i]).attr('data-rewards'))[0].previous_skin_shards != 'undefined') ? JSON.parse($($('.slot.girl_ico')[i]).attr('data-rewards'))[0].previous_skin_shards : 0;
                        let name = (typeof JSON.parse($($('.slot.girl_ico')[0]).attr('data-rewards'))[0].name != 'undefined') ? JSON.parse($($('.slot.girl_ico')[0]).attr('data-rewards'))[0].name : JSON.parse($($('.slot.girl_ico')[0]).attr('data-rewards'))[0].grade_skin_name;

                        if (shards < 100) {
                            let girlData = {id: girlId,
                                n: name,
                                sh: shards}
                            nonHaremGirlShardsDictionary.set(girlId, girlData);
                            localStorage.setItem('HHS.HHPNShardsMap', JSON.stringify(Array.from(nonHaremGirlShardsDictionary.entries())));
                        }
                        else {
                            girlData = {id: girlId,
                                        n: name,
                                        sh: skins}
                            nonHaremGirlShardsDictionary.delete(girlId);
                            girlSkinsDictionary.set(girlId, girlData);
                            localStorage.setItem('HHS.HHPNShardsMap', JSON.stringify(Array.from(nonHaremGirlShardsDictionary.entries())));
                            localStorage.setItem('HHS.HHPNSkinsMap', JSON.stringify(Array.from(girlSkinsDictionary.entries())));
                        }

                        let shards_display = (shards < 100) ? shards : skins;

                        $($($('.slot.girl_ico')[i]).find('.slot_girl_shards .shards')[j]).remove();
                        $($($('.slot.girl_ico')[i]).find('.slot_girl_shards')[j]).append(
                            `<div class="shards_troll" shards="${shards_display}" name="${name}" shards-tooltip="">
                            <span class="shard_troll"></span>
                            <p id="shard_number">${shards_display}</p>
                            </div>`
                        );
                    }
                }

                //CSS
                sheet.insertRule(`.page-season_arena #shard_number {
                    position: absolute;
                    bottom: -16px;
                    color: #80058b;
                    text-shadow: 1px 1px 0 #fff,-1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff;
                    width: 24px;
                    text-align: right;}`
                );

                sheet.insertRule(`.page-season_arena .shards_troll .shard_troll {
                    background-image: url(${window.IMAGES_URL}/shards.png);
                    background-repeat: no-repeat;
                    background-size: contain;
                    position: absolute;
                    left: -5px;
                    width: 18px;
                    height: 18px;}`
                );

                if ($('.rewards_list')[0].children.length > 5) {
                    sheet.insertRule(`${mediaDesktop} {
                            .page-season_arena #shard_number {
                        top: 3px;
                        margin-left: -22px;
                        font-size: 9px;}}`
                    );

                    sheet.insertRule(`${mediaMobile} {
                            .page-season_arena #shard_number {
                        top: 1px;
                        margin-left: -22px;
                        font-size: 11px;}}`
                    );

                    sheet.insertRule(`.page-season_arena .shards_troll .shard_troll {
                        top: 10px;}`
                    );
                }
                else {
                    sheet.insertRule(`.page-season_arena #shard_number {
                        margin-left: -24px;
                        font-size: 10px;}`
                    );

                    sheet.insertRule(`.page-season_arena .shards_troll .shard_troll {
                        top: 11px;}`
                    );
                }
            }

            let observer = new MutationObserver(() => {
                if ($('.hh_tooltip_new .slot.girl_ico').length == 0) return;

                else if(($($('.hh_tooltip_new .slot.girl_ico')[0]).find('.girl_ico .shards_troll')).length != 0) return;

                else {
                    if ($($('.hh_tooltip_new .slot.girl_ico img')[0]).attr('src').indexOf('girls/') == -1) return;

                    else {
                        for (let i=0; i < $('.hh_tooltip_new .slot.girl_ico').length; i++) {
                            let idGirlStr = $($('.hh_tooltip_new .slot.girl_ico img')[i]).attr('src');
                            let indexStart = idGirlStr.indexOf('girls/') + 'girls/'.length;
                            let indexEnd = idGirlStr.indexOf('/ico');
                            let girlId = parseInt(idGirlStr.substring(indexStart, indexEnd), 10);
                            let shards = nonHaremGirlShardsDictionary.get(girlId) ? nonHaremGirlShardsDictionary.get(girlId).sh : 0;
                            let skins = girlSkinsDictionary.get(girlId) ? girlSkinsDictionary.get(girlId).sh : 0;
                            let name = girlDictionary.get(girlId) ? girlDictionary.get(girlId).n : '';
                            $($('.hh_tooltip_new .slot.girl_ico .shards_troll')[i]).remove();

                            if($($('.hh_tooltip_new .slot.girl_ico .girl_ico')[i]).find('.skins_shard_icn').length == 0) {
                                $($('.hh_tooltip_new .slot.girl_ico .girl_ico')[i]).append(
                                    `<div class="shards_troll" shards="${shards}" name="${name}" shards-tooltip="">
                                    <span class="shard_troll_tooltip" style="background-image: url(${window.IMAGES_URL}/shards.png); background-repeat: no-repeat; background-size: contain; position: absolute; bottom: -0.25em; top: 24px; margin-left: 2px; width: 15px; height: 15px;"></span>
                                    <p id="shard_number_tooltip" style="position: absolute; bottom: -1px; padding-left: 10px; color: #80058b; text-shadow: 1px 1px 0 #fff,-1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff; width: 28px; text-align: right; margin-left: -6px; font-size: 9px;">
                                    <span>${shards}</span>
                                    </p></div>`
                                );
                                                                                                }
                            else {
                                $($('.hh_tooltip_new .slot.girl_ico .girl_ico')[i]).append(
                                    `<div class="shards_troll" shards="${skins}" name="${name}" shards-tooltip="">
                                    <span class="shard_troll_tooltip" style="background-image: url(${window.IMAGES_URL}/shards.png); background-repeat: no-repeat; background-size: contain; position: absolute; bottom: -0.25em; top: 24px; margin-left: 2px; width: 15px; height: 15px;"></span>
                                    <p id="shard_number_tooltip" style="position: absolute; bottom: -1px; padding-left: 10px; color: #80058b; text-shadow: 1px 1px 0 #fff,-1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff; width: 28px; text-align: right; margin-left: -6px; font-size: 9px;">
                                    <span>${skins}</span>
                                    </p></div>`
                                );
                            }
                        }

                        sheet.insertRule(`#hh_comix .hh_tooltip_new .slot.girl_ico .girl_ico {
                            font-weight : bold !important;}`
                        );
                    }
                }
            })

            let observer1 = new MutationObserver(() => {
                if ($('.hh_tooltip_new .slot .girl_ico').length == 0) return;

                else if(($($('.hh_tooltip_new .slot')[0]).find('.girl_ico .shards_troll')).length != 0) return;

                else {
                    if ($($('.hh_tooltip_new .slot .girl_ico img')[0]).attr('src').indexOf('girls/') == -1) return;

                    else {
                        for (let i=0; i < $('.hh_tooltip_new .slot').length; i++) {
                            let idGirlStr = $($('.hh_tooltip_new .slot img')[i]).attr('src');
                            let indexStart = idGirlStr.indexOf('girls/') + 'girls/'.length;
                            let indexEnd = idGirlStr.indexOf('/ico');
                            let girlId = parseInt(idGirlStr.substring(indexStart, indexEnd), 10);
                            let shards = girlDictionary.get(girlId) ? (typeof girlDictionary.get(girlId).sh != "number" ? 100 : girlDictionary.get(girlId).sh) : 0;
                            let name = girlDictionary.get(girlId) ? girlDictionary.get(girlId).n : '';
                            $($('.hh_tooltip_new .slot .girl_ico .shards_troll')[i]).remove();
                            $($('.hh_tooltip_new .slot .girl_ico')[i]).append(
                                `<div class="shards_troll" shards="${shards}" name="${name}" shards-tooltip="">
                                <span class="shard_troll_tooltip" style="background-image: url(${window.IMAGES_URL}/shards.png); background-repeat: no-repeat; background-size: contain; position: absolute; bottom: -0.25em; top: 27px; margin-left: 2px; width: 15px; height: 15px;"></span>
                                <p id="shard_number_tooltip" style="position: absolute; bottom: -0.25em; padding-left: 10px; color: #80058b; text-shadow: 1px 1px 0 #fff,-1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff; width: 28px; text-align: right; margin-top: -10px; margin-left: -6px; font-size: 9px;">
                                <span>${shards}</span>
                                </p></div>`
                            );
                        }

                        sheet.insertRule(`#hh_comix .hh_tooltip_new .slot .girl_ico {
                            font-weight : bold !important;}`
                        );
                    }
                }
            })

            if (CurrentPage.indexOf('troll-pre-battle') != -1) observer.observe($('.page-troll-pre-battle')[0], {childList: true, subtree: true, attributes: false});
            else if (CurrentPage.indexOf('pachinko') != -1) observer1.observe($('.page-pachinko')[0], {childList: true, subtree: false, attributes: false});
        }

        function displayClubChampionGirlsShards() {
            if ($('#club_champions_tab').length == 0) return;

            let clubChampionTab = document.querySelector('#club_champions_tab');
            clubChampionTab.addEventListener('click', () => {
                if(!$('.girl-shards-reward-wrapper').length) return;

                let name = $($('.shards')[0]).attr('name');
                let shards = parseInt($($('.shards')[0]).attr('shards'), 10);
                let girls = $('.girl-shards-reward-wrapper');
                for (let i=0; i < girls.length; i++) {
                    $(`.girl-shards-reward-wrapper:nth-child(${(i+1)}) .slot.slot_girl_shards`).append(
                        `<div class="club_shards" shards="${shards}" name="${name}" shards-tooltip="">
                        <p id="club_shard_number" style="position: absolute; bottom: 14px; padding-left: 10px; color: #80058b; text-shadow: 1px 1px 0 #fff,-1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff;; width: 28px; text-align: right; margin-left: -46px; font-size: 12px;">
                        <span>${shards}</span>
                        <span class="club_shard" style="background-image: url(${window.IMAGES_URL}/shards.png); background-repeat: no-repeat; background-size: contain; display: block; position: relative; bottom: 1.75em; margin-left: 15px; width: 25px; height: 25px;"></span>
                        </p></div>`
                    );
                }
            })
        }

        function displayLabyrinthGirlsShards() {
            let labyShopTab = document.querySelector('#shop_tab');
            labyShopTab.addEventListener('click', () => {
                setTimeout(() => {
                    if(!$('.slot_girl_shards').length > 0) return;

                    let girls = $('.slot_girl_shards');
                    for (let i=0; i < girls.length; i++) {
                        let name = $($('.shards')[i]).attr('name');
                        let shards = parseInt($($('.shards')[i]).attr('shards'), 10);
                        $($('.slot_girl_shards')[i]).append(
                            `<div class="laby_shards" shards="${shards}" name="${name}" shards-tooltip="" style="position: absolute;top: 0px;right: 0px;">
                            <p id="laby_shard_number" style="position: absolute; top: -13px; padding-left: 10px; color: #80058b; text-shadow: 1px 1px 0 #fff,-1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff;; width: 28px; text-align: right; margin-left: -46px; font-size: 12px;">
                            <span>${shards}</span>
                            <span class="laby_shard" style="background-image: url(${window.IMAGES_URL}/shards.png); background-repeat: no-repeat; background-size: contain; display: block; position: relative; bottom: 1.75em; margin-left: 15px; width: 25px; height: 25px;"></span>
                            </p></div>`
                        );
                    }
                }, 2*timeout)
            })
        }

        function updateTrollGirlsShards() {
            $(document).ajaxComplete(function(evt, xhr, opt) {
                if(!opt.data) return;

                if(~opt.data.search(/action=do_battles_(seasons|trolls)/i)) {
                    if(!xhr.responseText.length) return;

                    const response = JSON.parse(xhr.responseText);

                    if(!response || !response.success) return;

                    if(!response.rewards.lose) {
                        if(response.rewards.data.shards && response.rewards.data.grade_skins) {
                            let eventTrolls = JSON.parse(localStorage.getItem('HHS.eventTrolls'));
                            let mythicEventTrolls = JSON.parse(localStorage.getItem('HHS.mythicEventTrolls'));
                            let raidTrolls = JSON.parse(localStorage.getItem('HHS.raidTrolls'));

                            response.rewards.data.shards.forEach(function(shard) {
                                let idGirl = shard.id_girl;
                                let name = shard.name;
                                let newShards = shard.value;
                                let girlData = {id: idGirl,
                                                n: name,
                                                sh: Math.min(newShards, 100)}
                                if (newShards >= 100 && !girlSkinsDictionary.has(idGirl)) {
                                    nonHaremGirlShardsDictionary.delete(idGirl);
                                    eventTrolls = eventTrolls.filter((girl) => girl.id != idGirl);
                                    mythicEventTrolls = mythicEventTrolls.filter((girl) => girl.id != idGirl);
                                    raidTrolls = raidTrolls.filter((girl) => girl.id != idGirl);
                                }
                                else if (newShards >= 100 && girlSkinsDictionary.has(idGirl)) {
                                    if (girlSkinsDictionary.get(idGirl).sh == 0) {
                                        girlData = {id: idGirl,
                                                    n: name,
                                                    sh: 0}
                                    }
                                    nonHaremGirlShardsDictionary.delete(idGirl);
                                }
                                else nonHaremGirlShardsDictionary.set(idGirl, girlData);
                            });

                            response.rewards.data.grade_skins.forEach(function(skin_shard) {
                                let idGirl = skin_shard.id_girl;
                                let name = skin_shard.grade_skin_name;
                                let newSkinShards = (parseInt(skin_shard.previous_skin_shards, 10) + parseInt(skin_shard.shards_added, 10)) % 33;
                                let girlData = {id: idGirl,
                                                n: name,
                                                sh: newSkinShards}
                                if (skin_shard.is_owned) {
                                    nonHaremGirlShardsDictionary.delete(idGirl);
                                    eventTrolls = eventTrolls.filter((girl) => girl.id != idGirl);
                                    mythicEventTrolls = mythicEventTrolls.filter((girl) => girl.id != idGirl);
                                    raidTrolls = raidTrolls.filter((girl) => girl.id != idGirl);
                                }
                                else {
                                    nonHaremGirlShardsDictionary.set(idGirl, girlData);
                                    girlSkinsDictionary.set(idGirl, girlData);
                                }
                            });
                            localStorage.setItem('HHS.eventTrolls', JSON.stringify(eventTrolls));
                            localStorage.setItem('HHS.mythicEventTrolls', JSON.stringify(mythicEventTrolls));
                            localStorage.setItem('HHS.raidTrolls', JSON.stringify(raidTrolls));
                            localStorage.setItem('HHS.HHPNShardsMap', JSON.stringify(Array.from(nonHaremGirlShardsDictionary.entries())));
                            localStorage.setItem('HHS.HHPNSkinsMap', JSON.stringify(Array.from(girlSkinsDictionary.entries())));
                        }
                        else if(response.rewards.data.shards) {
                            let eventTrolls = JSON.parse(localStorage.getItem('HHS.eventTrolls'));
                            let mythicEventTrolls = JSON.parse(localStorage.getItem('HHS.mythicEventTrolls'));
                            let raidTrolls = JSON.parse(localStorage.getItem('HHS.raidTrolls'));

                            response.rewards.data.shards.forEach(function(shard) {
                                let idGirl = shard.id_girl;
                                let name = shard.name;
                                let newShards = shard.value;
                                let girlData = {id: idGirl,
                                                n: name,
                                                sh: Math.min(newShards, 100)}
                                if (newShards >= 100 && !girlSkinsDictionary.has(idGirl)) {
                                    nonHaremGirlShardsDictionary.delete(idGirl);
                                    eventTrolls = eventTrolls.filter((girl) => girl.id != idGirl);
                                    mythicEventTrolls = mythicEventTrolls.filter((girl) => girl.id != idGirl);
                                    raidTrolls = raidTrolls.filter((girl) => girl.id != idGirl);
                                }
                                else if (newShards >= 100 && girlSkinsDictionary.has(idGirl) && nonHaremGirlShardsDictionary.has(idGirl)) {
                                    if (girlSkinsDictionary.get(idGirl).sh == 0) {
                                        girlData = {id: idGirl,
                                                    n: name,
                                                    sh: 0}
                                    }
                                    nonHaremGirlShardsDictionary.delete(idGirl);
                                }
                                else if (newShards >= 100 && girlSkinsDictionary.has(idGirl) && !nonHaremGirlShardsDictionary.has(idGirl)) {
                                    let newSkinShards = (parseInt(girlSkinsDictionary.get(idGirl).sh, 10) + parseInt(shard.value, 10) - parseInt(shard.previous_value, 10)) % 33;
                                    let girlData = {id: idGirl,
                                                    n: name,
                                                    sh: newSkinShards};
                                    girlSkinsDictionary.set(idGirl, girlData);
                                }
                                else nonHaremGirlShardsDictionary.set(idGirl, girlData);
                            });
                            localStorage.setItem('HHS.eventTrolls', JSON.stringify(eventTrolls));
                            localStorage.setItem('HHS.mythicEventTrolls', JSON.stringify(mythicEventTrolls));
                            localStorage.setItem('HHS.raidTrolls', JSON.stringify(raidTrolls));
                            localStorage.setItem('HHS.HHPNShardsMap', JSON.stringify(Array.from(nonHaremGirlShardsDictionary.entries())));
                            localStorage.setItem('HHS.HHPNSkinsMap', JSON.stringify(Array.from(girlSkinsDictionary.entries())));
                        }
                        else return;
                    }
                }
            })
        }
    }
}

//Remove button to access to club champion's positions during cooldown + add some datas about participation of club members
function moduleClubChampionFeatures() {
    if ($('#club_champions_tab').length == 0) return;

    function highlightMembersParticipation() {
        let clubMembers = window.members_list;
        let championPartipants = window.club_champion_data.fight.participants;
        let listChampionParticipantsId = [];
        championPartipants.forEach((participant) => {
            listChampionParticipantsId.push(participant.id_member);
        });
        clubMembers.forEach((member) => {
            if (!listChampionParticipantsId.includes(member.id_member)) {
                Array.from($('#club_members #members .body-row .avatar')).find((el) => $(el).attr('id-member') == member.id_member).parentElement.parentElement.style.color = '#ffa07a';
            }
        });
    }

    let clubChampionTab = document.querySelector('#club_champions_tab');
    clubChampionTab.addEventListener('click', () => {
        if ($('.club_champions_details_container').length) {
            $('button.orange_button_L.btn_skip_team_cooldown').css('display', 'none');
            if (!$('button.orange_button_L.btn_skip_champion_cooldown').length) {
                $('.challenge_container').css('display', 'block');
            }

            let participants = window.club_champion_data.fight.participants;
            let participants_number = participants.length;
            let club_members = window.members_list.length ;

            function calculateParticipation() {
                let championImpress = localeStringToNumber((JSON.parse($('.club_champions_bar_container').attr('champion-healing-tooltip')).impression_info).split('/')[1]);
                let list = $('#club_champions .club-champion-members-challenges .body-row .data-column:nth-child(4) .impression');
                for (let i=0; i<list.length; i++) {
                    let impress = localeStringToNumber($(list[i]).attr('tooltip'));
                    if (impress <= 0) {
                        participants_number--;
                    }
                }
                for (let i=0; i<list.length; i++) {
                    let impress = Math.max(0, localeStringToNumber($(list[i]).attr('tooltip')));
                    let percentage = Math.floor((impress/championImpress)*10000)/100;
                    let shards = Math.ceil(percentage - 0.501) + Math.round(0.6 * Math.sqrt(parseInt(participants_number, 10)));
                    let textImpress = '' + nThousand(localeStringToNumber($($($('.club-champion-members-challenges .body-row')[i]).find('.data-column:nth-child(4) .impression')[0]).attr('tooltip').trim()));

                    let newTextImpress = textImpress.concat(' / ', nThousand(percentage), '%');
                    $($('#club_champions .club-champion-members-challenges .body-row')[i]).find('.data-column:nth-child(4)').empty();
                    $($('#club_champions .club-champion-members-challenges .body-row')[i]).find('.data-column:nth-child(4)').append(`<div>${newTextImpress}</div>`);
                    $($('#club_champions .club-champion-members-challenges .body-row')[i]).find('.data-column:nth-child(4)').append(`<div>${shards}<span class="shard"></span></div>`);

                    if ($($('#club_champions .club-champion-members-challenges .body-row')[i]).attr('class') == "data-row body-row player-row" && $('.slot_girl_shards .shards p span').length == 2) {
                        $('.slot_girl_shards .shards p span')[1].innerText = parseInt($('.slot_girl_shards .shards p span')[1].innerText, 10) != 100 ? shards : $('.slot_girl_shards .shards p span')[1].innerText;
                        ($('.girl-shards-reward-wrapper .shards')[1]).attributes['shards'].nodeValue = parseInt($($('.club_shards')[0]).attr('shards'), 10) + shards;
                    }
                }
            }

            calculateParticipation();
            addTimeSinceStart();
            fixTimerBar();

            let sortImpression = document.querySelector('.club-champion-members-challenges .head-row .head-column[column=challenge_impression_done]');
            sortImpression.addEventListener('click', () => {
                calculateParticipation();
            });

            let sortChallenges = document.querySelector('.club-champion-members-challenges .head-row .head-column[column=challenge_count]');
            sortChallenges.addEventListener('click', () => {
                calculateParticipation();
            });

            let sortName = document.querySelector('.club-champion-members-challenges .head-row .head-column[column=nickname]');
            sortName.addEventListener('click', () => {
                calculateParticipation();
            });

            let sortLevel = document.querySelector('.club-champion-members-challenges .head-row .head-column[column=level]');
            sortLevel.addEventListener('click', () => {
                calculateParticipation();
            });

            function calculateTime(event_time, server_time) {
                let days = parseInt((server_time - event_time)/1000/3600/24);
                let hours = parseInt((server_time - event_time)/1000/3600 - days*24);
                let minutes = parseInt(((server_time - event_time)/1000 - days*24*3600 - hours*3600)/60);

                return {daysLeft: days,
                        hoursLeft: hours,
                        minutesLeft: minutes}
            }

            function addTimeSinceStart () {
                const $timerFight = $('.club_champions_timer_fight');
                if (!$timerFight.length || !window.club_champion_data.fight.active) {
                    return;
                }

                const duration = calculateTime(window.club_champion_data.fight.start_time * 1e3, window.server_now_ts * 1e3);

                const durationString = `${duration.daysLeft > 0 ? `${duration.daysLeft}${window.GT.time.d} ` : ''}${duration.hoursLeft > 0 ? `${duration.hoursLeft}${window.GT.time.h} ` : ''}${duration.minutesLeft > 0 ? `${duration.minutesLeft}${window.GT.time.m}` : ''}`.trim();

                if ($('.club_champion_start').length == 0)
                    $('.club_champions_impression').append(`<span class="club_champion_start">${label('clubChampDuration').replace('{{duration}}', durationString)}</span>`);
            }

            function fixTimerBar () {
                const $clubChampionsBar = $('.club_champions_bar');
                // Fix silly code putting a localised decimal separator as a CSS rule value
                $clubChampionsBar.attr('style', $clubChampionsBar.attr('style').replace(',','.'));
            }

            $('#club_champions .club-champion-members-challenges').prepend(`<div class="club-members-participants">Participants: ${participants_number} / ${club_members}</div>`);

            //CSS
            sheet.insertRule(`.club-champion-members-challenges .body-row .data-column:nth-child(4) {
                display: flex;
                flex-direction: column;
                line-height: 1.2;
                font-size: 0.9rem;}`
            );

            sheet.insertRule(`.club-champion-members-challenges .data-list .data-row .data-column:nth-child(4) {
                width: 11rem;}`
            );

            sheet.insertRule(`.club-champion-members-challenges .data-list .data-row .data-column:nth-child(3) {
                text-align: center;}`
            );

            sheet.insertRule(`.shard {
                height: 1rem;
                width: 1rem;
                display: inline-block;
                background-image: url(https://hh2.hh-content.com/shards.png);
                background-repeat: no-repeat;
                background-size: 140%;
                background-position: center;}`
            );

            sheet.insertRule(`.club_champion_start {
                display: flex;
                color: #24a0ff;
                letter-spacing: 1px;
                justify-content: center;
                font-size: 12px;}`
            );

            sheet.insertRule(`#hero_club .bottom-row #club_champions .club_champions_details_container .club_champions_impression {
                width: 92%;}`
            );

            sheet.insertRule(`#hero_club .bottom-row #club_champions .club_champions_details_container .club_champions_impression .club_champions_timer_fight {
                margin-left: -5px;
                width: 104%;}`
            );

            sheet.insertRule(`#club_champions .club-champion-members-challenges .club-members-participants {
                display: block;
                position: absolute;
                left: 500px;}`
            );

            sheet.insertRule(`${mediaMobile} {
                    #club_champions .club-champion-members-challenges .club-members-participants {
                top: 15px;}}`
            );

            sheet.insertRule(`${mediaDesktop} {
                    #club_champions .club-champion-members-challenges .club-members-participants {
                top: 25px;}}`
            );
        }
    });

    highlightMembersParticipation();
    clubMembersTabHighlight();

    let clubMembersTab = document.querySelector('#club-tabs #club_members_tab');
    clubMembersTab.addEventListener('click', () => {
        highlightMembersParticipation();
        clubMembersTabHighlight();
    });

    function clubMembersTabHighlight() {
        let sortClubLevel = document.querySelector('#members .head-row .head-column[column=level]');
        sortClubLevel.addEventListener('click', () => {
            highlightMembersParticipation();
        });
        let sortClubNames = document.querySelector('#members .head-row .head-column[column=nickname]');
        sortClubNames.addEventListener('click', () => {
            highlightMembersParticipation();
        });
        let sortClubGirls = document.querySelector('#members .head-row .head-column[column=count_girls]');
        sortClubGirls.addEventListener('click', () => {
            highlightMembersParticipation();
        });
        let sortClubMojo = document.querySelector('#members .head-row .head-column[column=mojo]');
        sortClubMojo.addEventListener('click', () => {
            highlightMembersParticipation();
        });
        let sortClubContribution = document.querySelector('#members .head-row .head-column[column=contribution_points]');
        sortClubContribution.addEventListener('click', () => {
            highlightMembersParticipation();
        });
    }
}

// Show final values when skipping battle
function skipBattleValues() {
    setTimeout(() => {
        $('#new-battle-skip-btn').show();
    }, timeout);

    $(document).ajaxComplete(function(evt, xhr, opt) {
        if(~opt.data.search(/action=do_battles_(league|seasons|trolls|pantheon|boss_bang)/i)) {
            if(!xhr.responseText.length) return;

            let respBattleData = JSON.parse(xhr.responseText);

            if(!respBattleData || !respBattleData.success) return;

            //We already spent some combativity, let's show this to the player:
            if(~location.pathname.indexOf("troll-battle") && ~location.search.search(/number_of_battles=\d+/i)) {
                let nBattlesCount = parseInt(location.search.match(/number_of_battles=(\d+)/i)[1]);
                if($.isNumeric(nBattlesCount)) {
                    heroData.update("energy_fight", -1 * nBattlesCount, true);
                }
            }

            if(!respBattleData.rounds) return;

            let arrRounds = respBattleData.rounds;
            let rewards = respBattleData.rewards;

            let nPlayerInitialEgo = $('.new-battle-player .new-battle-hero-ego-value').data("total-ego");
            let nOpponentInitialEgo = $('.new-battle-opponent .new-battle-hero-ego-value').data("total-ego");
            let nPlayerFinalEgo = 0;
            let nOpponentFinalEgo = 0;

            let nRoundsLen = arrRounds.length;
            if(nRoundsLen >= 2) {
                let arrLastRounds = [arrRounds[nRoundsLen - 2], arrRounds[nRoundsLen - 1]];
                if(!arrLastRounds[1].opponent_hit) {
                    nPlayerFinalEgo = arrLastRounds[0].opponent_hit.defender.remaining_ego;
                    nOpponentFinalEgo = arrLastRounds[1].hero_hit.defender.remaining_ego;
                }
                else if(!arrLastRounds[1].hero_hit) {
                    nPlayerFinalEgo = arrLastRounds[1].opponent_hit.defender.remaining_ego;
                    nOpponentFinalEgo = arrLastRounds[0].hero_hit.defender.remaining_ego;
                }
                else {
                    nPlayerFinalEgo = arrRounds[nRoundsLen - 1].opponent_hit.defender.remaining_ego;
                    nOpponentFinalEgo = arrRounds[nRoundsLen - 1].hero_hit.defender.remaining_ego;
                }
            }
            else {
                if(nRoundsLen == 1) {
                    if(!arrRounds[0].opponent_hit) {
                        nPlayerFinalEgo = nPlayerInitialEgo;
                        nOpponentFinalEgo = arrRounds[0].hero_hit.defender.remaining_ego;
                    }
                    else if(!arrRounds[0].hero_hit) {
                        nPlayerFinalEgo = arrRounds[0].opponent_hit.defender.remaining_ego;
                        nOpponentFinalEgo = nOpponentInitialEgo;
                    }
                    else {
                        nPlayerFinalEgo = arrRounds[0].opponent_hit.defender.remaining_ego;
                        nOpponentFinalEgo = arrRounds[0].hero_hit.defender.remaining_ego;
                    }
                }
                else {
                    throw new Error("incorrect amount of rounds");
                }
            }

            $('#new-battle-skip-btn').off("click");
            $('#new-battle-skip-btn').on("click", () => {
                $(this).remove();

                let $playerBar = $('.new-battle-player .new-battle-hero-ego-initial-bar');
                let $playerDamageBar = $('.new-battle-player .new-battle-hero-ego-damage-bar');
                let $playerHealBar = $('.new-battle-player .new-battle-hero-ego-heal-bar');
                let $opponentBar = $('.new-battle-opponent .new-battle-hero-ego-initial-bar');
                let $opponentDamageBar = $('.new-battle-opponent .new-battle-hero-ego-damage-bar');
                let $opponentHealBar = $('.new-battle-opponent .new-battle-hero-ego-heal-bar');

                let $playerEgo = $('.new-battle-player .new-battle-hero-ego-value');
                let $opponentEgo = $('.new-battle-opponent .new-battle-hero-ego-value');
                let $playerDamageDone = $('.new-battle-opponent .new-battle-hero-damage-taken-text');
                let $opponentDamageDone = $('.new-battle-player .new-battle-hero-damage-taken-text');
                let $criticalDamageIndicator = $('.new-battle-hero-container .new-battle-hero-critical-text');

                $playerDamageDone.css('opacity', '0');
                $opponentDamageDone.css('opacity', '0');
                $criticalDamageIndicator.css('opacity', '0');
                $playerHealBar.css('opacity', '0');
                $opponentHealBar.css('opacity', '0');

                let strPlayerCurEgo = $playerEgo.text().split(window.GT.ego)[1].replace(/[, ]/g, "");
                let nPlayerCurEgo = nPlayerInitialEgo;
                if($.isNumeric(strPlayerCurEgo)) {
                    nPlayerCurEgo = parseInt(strPlayerCurEgo);
                }
                let strOpponentCurEgo = $opponentEgo.text().split(window.GT.ego)[1].replace(/[, ]/g, "");
                let nOpponentCurEgo = nOpponentInitialEgo;
                if($.isNumeric(strOpponentCurEgo)) {
                    nOpponentCurEgo = parseInt(strOpponentCurEgo);
                }

                let nPlayerCompleteAtk = nOpponentCurEgo - nOpponentFinalEgo;
                let nOpponentCompleteAtk = nPlayerCurEgo - nPlayerFinalEgo;
                $playerDamageDone.text(nPlayerCompleteAtk.toString());
                $opponentDamageDone.text(nOpponentCompleteAtk.toString());

                let fPlayerEgoBarWidth = nPlayerFinalEgo <= 0 ? 0 : nPlayerFinalEgo / nPlayerInitialEgo * 100.0;
                let fOpponentEgoBarWidth = nOpponentFinalEgo <= 0 ? 0 : nOpponentFinalEgo / nOpponentInitialEgo * 100.0;

                let arrPlayerAnimationSequence = [
                    { e: $playerBar, p: { width: nRounding(fPlayerEgoBarWidth, 2, -1) + "%" }, o: { duration: 200 } },
                    { e: $playerDamageBar, p: { width: nRounding(fPlayerEgoBarWidth, 2, -1) + "%" }, o: { duration: 200 } },
                    { e: $playerDamageDone, p: { opacity: [0, 1], translateY: -20, translateZ: 0 }, o: {
                        duration: 300,
                        sequenceQueue: false,
                        complete: function(elm) {
                            $playerEgo.text(window.GT.ego + " " + nThousand(Math.ceil(nPlayerFinalEgo)));
                            $(elm).velocity({ translateY: 0 }, 0)
                        }
                    }
                    }
                ];
                let arrOpponentAnimationSequence = [
                    { e: $opponentBar, p: { width: nRounding(fOpponentEgoBarWidth, 2, -1) + "%" }, o: { duration: 200 } },
                    { e: $opponentDamageBar, p: { width: nRounding(fOpponentEgoBarWidth, 2, -1) + "%" }, o: { duration: 200 } },
                    { e: $opponentDamageDone, p: { opacity: [0, 1], translateY: -20, translateZ: 0 }, o: {
                        duration: 300,
                        sequenceQueue: false,
                        complete: function(elm) {
                            $opponentEgo.text(window.GT.ego + " " + nThousand(Math.ceil(nOpponentFinalEgo)));
                            $(elm).velocity({ translateY: 0 }, 0)
                        }
                    }
                    }
                ];

                $('.velocity-animating').velocity("stop", true);
                $.Velocity.RunSequence(arrPlayerAnimationSequence);
                $.Velocity.RunSequence(arrOpponentAnimationSequence);

                const Reward = window.Reward ? window.Reward : shared.reward_popup.Reward;
                setTimeout(() => {Reward.handlePopup(rewards)}, 800);
            });
        }
    });
}

//Fix a bug with decimal separator in daily goals
function fixDailyGoalsBug() {
    for(let i=0; i<$('#daily_goals .objective-progress-bar-fill').length; i++){
        $('#daily_goals .objective-progress-bar-fill')[i].attributes.style.value = $('#daily_goals .objective-progress-bar-fill')[i].attributes.style.value.replace(',', '.');
    }
}

//Sort daily missions by duration
function sortDailyMissions() {
    const compare = (asc) => (row1, row2) => {
        const missionDuration = row => parseInt(JSON.parse(row.attributes['data-d'].value).duration, 10)
        const tri = (v1, v2) => v1 - v2;
        return tri(missionDuration(asc ? row1 : row2), missionDuration(asc ? row2 : row1));
    };

    let missions = Array.from(document.querySelectorAll('.mission_object:not(.legendary)')).sort(compare(true));
    missions.forEach(tr => document.querySelector('.missions_wrap').appendChild(tr));
}

//Display a notification on home screen when Sultry Mysteries event's shop is refreshed
function notifySultryMysteriesShopRefresh() {
    if(CurrentPage == "/event.html") {
        if(!$('a.active[href*="?tab=sm_event_"]').length) return;

        const observer = new MutationObserver(() => {
            if(!$('#shop_tab.underline-tab').length) return;

            setTimeout(() => {
                let sm_shop_timer = parseInt($('#shop_tab_container .shop-timer.timer').attr('data-time-stamp'), 10);
                localStorage.setItem('HHS.sm_shop_timer', window.server_now_ts + sm_shop_timer);
            }, 1000);
        })
        observer.observe($('#shop_tab')[0], {attributes: true, attributeFilter: ['class']});
    }

    if(CurrentPage == "/home.html") {
        if(!localStorage.getItem('HHS.sm_shop_timer') && $($('.event-widget .event-thumbnail .bar-wrapper .over[rel="sm_event"]')).attr('href') != "#") {
            $('.event-widget .event-thumbnail .event-timer.bar-wrapper .over[rel="sm_event"]').append(`<span class="button-notification-icon expired_notification_icn" style="top: 0px;right: 229px;"></span>`)
            return;
        }

        else if(window.server_now_ts >= localStorage.getItem('HHS.sm_shop_timer') && $($('.event-widget .event-thumbnail .bar-wrapper .over[rel="sm_event"]')).attr('href') != "#") {
            $('.event-widget .event-thumbnail .event-timer.bar-wrapper .over[rel="sm_event"]').append(`<span class="button-notification-icon expired_notification_icn" style="top: 0px;right: 229px;"></span>`);
            return;
        }

        else if(localStorage.getItem('HHS.sm_shop_timer') == NaN && $($('.event-widget .event-thumbnail .bar-wrapper .over[rel="sm_event"]')).attr('href') != "#") {
            $('.event-widget .event-thumbnail .event-timer.bar-wrapper .over[rel="sm_event"]').append(`<span class="button-notification-icon expired_notification_icn" style="top: 0px;right: 229px;"></span>`);
            return;
        }
    }
}

//Fix girl stats tooltip position
function fixGirlStatsTooltipPosition() {
    new MutationObserver(() => {
        if (parseInt($('.hh_tooltip_new.new_girl_tooltip').css('top'), 10) < 0 || parseInt($('.hh_tooltip_new.new_girl_tooltip').css('top'), 10) > 360) {
            $('.hh_tooltip_new.new_girl_tooltip').css('top', 0)
        }
    }).observe(document.body, {childList: true});

    //Girl tooltip in event widget
    sheet.insertRule(`#events .nc-panel-container .nc-panel-body .nc-event-container .nc-event-reward-container .nc-event-reward-info {
        z-index: 10;
        top: -4px;
        left: 0rem;}`
    );
}

//Display stats screen instead of girls screen
function fixProfilePopup() {
    const default_hero_page_popup = window.shared.general.hero_page_popup;
    window.shared = {
        ...window.shared,
        general: {
            ...window.shared.general,
            hero_page_popup: (info) => {
                if (info && !info.page) {
                    info.page = 'profile'
                }
                return default_hero_page_popup(info)
            }
        }
    }
}

function fixLeaderboardHeroDisplay() {
    function displayHeroRank(button, leaderboard) {
        document.getElementById(button).addEventListener('click', () => {
            setTimeout(() => {
                if($(leaderboard)[0].length > 0) {
                    if($(leaderboard + ' #outer-hero-row')[0].children.length == 0) {
                        Array.from($(leaderboard + ' .leaderboard_row.hero-row').children()).forEach((child) => {
                            $(leaderboard + ' #outer-hero-row')[0].append(child.cloneNode(true));
                        })
                    }
                }
            }, 1000)
        })
    }

    if(['seasonal.html'].some(testPage)) {
        displayHeroRank('mega-event-tabs', '#top_ranking_tab_container');
    }
    else if(['path-of-valor.html', 'path-of-glory.html'].some(testPage)) {
        displayHeroRank('pov_leaderboard_tab', '#pov_leaderboard_tab_container');
        displayHeroRank('pog_leaderboard_tab', '#pog_leaderboard_tab_container');
    }
    else if(['season.html'].some(testPage)) {
        displayHeroRank('leaderboard_btn', '#leaderboard_tab_container');
    }
    else if(['labyrinth.html'].some(testPage)) {
        displayHeroRank('labyrinth_leaderboard_tab', '#labyrinth_leaderboard_tab_container');
    }
    else if(['pantheon.html'].some(testPage)) {
        displayHeroRank('leaderboard_tab', '#leaderboard_tab_container');
    }
}

function unhideGirlPosePreview() {
    new MutationObserver(() => {
        if ($('#girl_preview_popup').length > 0) {
            Array.from($('.pose-preview')).forEach((pose) => {pose.addEventListener('click', () => {
                if ($(pose).css('filter') == "none") {
                    $(pose).css('filter', 'blur(0.25rem)');
                    $(pose.parentNode).find('.preview-locked_icn').css('display', '');
                }
                else {
                    $(pose).css('filter', 'none');
                    $(pose.parentNode).find('.preview-locked_icn').css('display', 'none');
                }
            })})

            Array.from($('.pose-preview_wrapper .preview-locked_icn')).forEach((lock) => {lock.addEventListener('click', () => {
                if ($(lock).css('display') == "none") {
                    $(lock).css('display', '');
                    $(lock.parentNode.children[0]).css('filter', 'blur(0.25rem)');
                }
                else {
                    $(lock).css('display', 'none');
                    $(lock.parentNode.children[0]).css('filter', 'none');
                }
            })})
        }
    }).observe($('#common-popups')[0], {childList: true});
}

function highlightClubMembers() {
    function collectClubMembers() {
        let clubMembersId = [];
        Array.from($('#club_members .avatar')).forEach((member) => {
            let member_id = $(member).attr('id-member');
            if (member_id != heroData.infos.id) clubMembersId.push(member_id)
        });
        localStorage.setItem('HHS.clubMembersId', JSON.stringify(clubMembersId));
    }

    function addPlayerSortingId(action, feature, location) {
        $(document).ajaxComplete(function(evt, xhr, opt) {
            if(!opt.data) return;

            if(opt.data.includes(`action=${action}`) && opt.data.includes(`feature=${feature}`)) {
                if(!xhr.responseText.length) return;

                const response = JSON.parse(xhr.responseText);

                if(!response || !response.success) return;
                if (!response.leaderboard) return;

                setTimeout(() => {
                    for (let i=0; i<response.leaderboard.length; i++) {
                        $($(`${location} .leaderboard_row`)[i]).attr('sorting_id', response.leaderboard[i].id_member);
                        $($(`${location} .leaderboard_row`)[i]).attr('onclick', `shared.general.hero_page_popup({ id: ${response.leaderboard[i].id_member}, profile_fallback: true })`)
                    }
                }, 2*timeout)
            }
        });
    }

    //Highlight club members in league
    function highlightLeague() {
        let clubMembersId = JSON.parse(localStorage.getItem('HHS.clubMembersId'));
        if (clubMembersId == null) return;

        Array.from($('.nickname')).forEach((player) => {
            let member_id = $(player).attr('id-member');
		    if (clubMembersId.includes(member_id) && $(player).parent().find('.clubUpgrade_mix_icn').length == 0)
                $(player).after($(`<span class="clubUpgrade_mix_icn" style="background-size: 25px;"></span>`));
        });
    }

    //Highlight club members in Season, PoV, PoG, mega-event, labyrinth, Penta drill
    function highlightRankings() {
        let clubMembersId = JSON.parse(localStorage.getItem('HHS.clubMembersId'));
        if (clubMembersId == null) return;

        Array.from($('.leaderboard_row')).forEach((player) => {
            let member_id = $(player).attr('sorting_id');
	        if (clubMembersId.includes(member_id) && $(player).find('.clubUpgrade_mix_icn').length == 0)
                $(player).find('.leaderboard-nickname-align').append($(`<span class="clubUpgrade_mix_icn" style="background-size: 22px; position: relative; top: -1px;"></span>`))
        });
    }

    //Highlight club members in Contests
    function highlightContests() {
        let clubMembersId = JSON.parse(localStorage.getItem('HHS.clubMembersId'));
        if (clubMembersId == null) return;

        Array.from($('.leadTable>tr')).forEach((player) => {
            let member_id = $(player).attr('sorting_id');
            const clubHTML = $('<span class="clubUpgrade_mix_icn" style="background-size: 21px; display: inline-block; position: relative; top: 3px;"></span>')
			if (clubMembersId.includes(member_id) && $(player.children[1]).find('.clubUpgrade_mix_icn').length == 0)
                player.children[1].append(clubHTML[0]);
        });
    }

    if (['/clubs.html'].some(testPage)) collectClubMembers();

    if (['/leagues.html'].some(testPage)) {
        highlightLeague();

        if ($('#leagues .league_content .league_table .data-list').length > 0) {
            new MutationObserver(() => {
                highlightLeague();
            }).observe($('.data-list')[0], {childList: true, once: true})
        }
    }

    if (['/path-of-valor.html', '/path-of-glory.html'].some(testPage)) {
        addPlayerSortingId('leaderboard', 'path_of_valor', '#pov_leaderboard_tab_container');
        addPlayerSortingId('leaderboard', 'path_of_glory', '#pog_leaderboard_tab_container');
        new MutationObserver(() => {
            new MutationObserver(() => {
                highlightRankings();
            }).observe($('#pov_leaderboard_tab_container #leaderboard_list')[0], {attributes: true, subtree: true, once: true})

            new MutationObserver(() => {
                highlightRankings();
            }).observe($('#pog_leaderboard_tab_container #leaderboard_list')[0], {attributes: true, subtree: true, once: true})
        }).observe($('#potions-paths-tabs')[0], {attributes: true, subtree: true})
    }

    if (['/season.html', '/pantheon.html', '/penta-drill.html'].some(testPage)) {
        addPlayerSortingId('leaderboard', 'season', '#leaderboard_tab_container');
        addPlayerSortingId('leaderboard', 'pantheon', '#leaderboard_tab_container');
        addPlayerSortingId('leaderboard', 'penta_drill', '#leaderboard_tab_container');
        new MutationObserver(() => {
            highlightRankings();
        }).observe($('#leaderboard_list')[0], {attributes: true, subtree: true, once: true})
    }

    if (['/activities.html'].some(testPage)) {
        highlightContests();

        new MutationObserver(() => {
            highlightContests();
        }).observe($('#activities #contests')[0], {attributes: true, subtree: true, once: true})
    }

    if (['/seasonal.html'].some(testPage)) {
        addPlayerSortingId('leaderboard', 'seasonal_event_top', '#top_ranking_tab_container');
        new MutationObserver(() => {
            highlightRankings();
        }).observe($('#top_ranking_tab_container')[0], {attributes: true, subtree: true, once: true})
    }

    if (['/labyrinth.html'].some(testPage)) {
        addPlayerSortingId('labyrinth_leaderboard', 'labyrinth_leaderboard', '#labyrinth_leaderboard_tab_container');
        new MutationObserver(() => {
            highlightRankings();
        }).observe($('#labyrinth_leaderboard_tab_container')[0], {attributes: true, subtree: true, once: true})
    }
}

//Display values for top ranking in mega-event
function displayTopRankingTooltip() {
    new MutationObserver(() => {
        setTimeout(() => {
            const nb_players = $('#top_ranking_tab_container .top_ranking-container #leaderboard_holder .leaderboard_row').length;
            let top10 = (nb_players > 9) ? parseInt($('#top_ranking_tab_container .top_ranking-container #leaderboard_holder .leaderboard_row')[9].children[3].innerText, 10) : '0';
            let top50 = (nb_players > 49) ? parseInt($('#top_ranking_tab_container .top_ranking-container #leaderboard_holder .leaderboard_row')[49].children[3].innerText, 10) : '0';
            let top100 = (nb_players > 99) ? parseInt($('#top_ranking_tab_container .top_ranking-container #leaderboard_holder .leaderboard_row')[99].children[3].innerText, 10) : '0';
            let top250 = (nb_players > 249) ? parseInt($('#top_ranking_tab_container .top_ranking-container #leaderboard_holder .leaderboard_row')[249].children[3].innerText, 10) : '0';
            let top500 = (nb_players > 499) ? parseInt($('#top_ranking_tab_container .top_ranking-container #leaderboard_holder .leaderboard_row')[499].children[3].innerText, 10) : '0';
            let top1000 = (nb_players > 999) ? parseInt($('#top_ranking_tab_container .top_ranking-container #leaderboard_holder .leaderboard_row')[999].children[3].innerText, 10) : '0';
            let textTops = `Top 10 : ${nThousand(top10)}<BR>
                            Top 50 : ${nThousand(top50)}<BR>
                            Top 100 : ${nThousand(top100)}<BR>
                            Top 250 : ${nThousand(top250)}<BR>
                            Top 500 : ${nThousand(top500)}<BR>
                            Top 1000 : ${nThousand(top1000)}`;
            $('#top_ranking_tab_container .top_ranking-container').prepend($(
                `<div id="leaderboard_top" tooltip="" hh_title="${textTops}">
                <img src="https://cdn-icons-png.flaticon.com/128/5140/5140914.png">
                </div>`)
            );
        }, 2*timeout)
    }).observe($('#top_ranking_tab_container')[0], {attributes: true, subtree: true, once: true});

        //CSS
        sheet.insertRule(`#leaderboard_top {
            position: absolute;
            top: -1px;
            right: 218px;
            z-index: 100;}`
        );

        sheet.insertRule(`#leaderboard_top img {
            height: 30px;}`
        );
}

//Hide koban button for girl grade upgrade
function hideGradeUpgradeKobanButton() {
    sheet.insertRule(`.quest-container #controls p.or,
            .quest-container #controls .grade-complete-button.grade-complete-button.orange_text_button {
        display: none;}`
    );
}

//Add timer on sultry event and lively scene event screens
function displayEventTimer() {
    let sm_event_time_label = convertToTimeFormat(time_remaining);
    $('.nc-pull-right').append(
        `<div class="event-timer nc-expiration-label timer" data-time-stamp="${time_remaining}">
        <p>${window.GT.design.event_ends_in}: <span rel="expires">${sm_event_time_label}</span></p>
        </div>`
    );

    if(document.querySelectorAll('.event-timer.nc-expiration-label.timer').length > 1) document.querySelector('.event-timer.nc-expiration-label.timer').remove();
    new MutationObserver(() => {
        if(document.querySelectorAll('.event-timer.nc-expiration-label.timer').length > 1) document.querySelector('.event-timer.nc-expiration-label.timer').remove();
    }).observe($('#events .nc-panel-container .nc-panel-header .nc-pull-right')[0], {childList: true})

    //To remove in some times
    localStorage.removeItem('HHS.sm_event_data')
}

function displaySeasonMojo() {
    if (['season-arena'].some(testPage)) {
        if ($('.player_team_block.battle_hero #mojo_data').text().includes('Max') || $('.player_team_block.battle_hero #mojo_data').text().includes('MAX')) {
            $('.player_team_block.battle_hero #mojo_data').after(`<div class="white_text" style="font-size: 0.65rem;">&nbsp;${nThousand(window.season_mojo_s)}</div>`);

            //CSS
            sheet.insertRule(`.player_team_block .seasons_tab_mojo #bar_mojo_container .tier_bar_container .white_text.centered_s {
                width: 90%;}`
            );
        }
    }
}

function hideIntroPictures() {
    sheet.insertRule(`#contains_all section.intro .quest-container #scene > div.canvas #background, #common-popups #intro_variant_popup .variant-video, .background_image-style {
        display: none !important;}`
    );
}

function displayLoveRaidsInfo() {
    let raids = love_raids;
    let girlDictionary = (!(localStorage.getItem('HHS.HHPNShardsMap') && localStorage.getItem('HHS.HHPNMap'))) ? new Map() : new Map(JSON.parse(localStorage.getItem('HHS.HHPNShardsMap')).concat(JSON.parse(localStorage.getItem('HHS.HHPNMap'))));
    let girlSkinsDictionary = (!localStorage.getItem('HHS.HHPNSkinsMap')) ? new Map(): new Map(JSON.parse(localStorage.getItem('HHS.HHPNSkinsMap')));

    $('#love-raids .head-section').append(
        `<div class="eye">
        <img class="eye_closed" src="https://hh2.hh-content.com/quest/ic_eyeclosed.svg" style="display: none;">
        <img class="eye_open" src="https://hh2.hh-content.com/quest/ic_eyeopen.svg" style="">
        </div>`
    );

    for (let i=0; i<raids.length; i++) {
        let girlId = raids[i].id_girl;
        let raid_type = raids[i].raid_module_type;
        let raid_nb = raids[i].raid_module_pk || 'unknown';

        let raid_target = '';

        if (raid_type == 'troll') {
            if (raid_nb != 'unknown') raid_target = `<a class="target_icn troll" href="/troll-pre-battle.html?id_opponent=${raid_nb}"><span class="${raid_type} raid_icn"></span><img class="raid_icn" src="${window.IMAGES_URL}/pictures/trolls/${raid_nb}/ico1.png"></a>`;
            else raid_target = `<div class="target_icn season"><span class="${raid_type} raid_icn"></span></div>`;
        }
        else if (raid_type == 'champion') {
            if (raid_nb != 'unknown') raid_target = `<a class="target_icn champion" href="/champions/${raid_nb}"><span class="${raid_type} raid_icn"></span><span style="align-content: center;">${raid_nb}</span></a>`;
            else raid_target = `<div class="target_icn season"><span class="${raid_type} raid_icn"></span></div>`;
        }
        else if (raid_type == 'season') raid_target = `<a class="target_icn season" href="/season-arena.html"><span class="${raid_type} raid_icn"></span></a>`;;

        let girlStars_nb = (typeof raids[i].girl_data.nb_grades != 'undefined') ? raids[i].girl_data.nb_grades : (raids[i].girl_data.grade_offsets.static.length-1);
        if (girlStars_nb == -1) girlStars_nb = girlDictionary.get(girlId) ? girlDictionary.get(girlId).nbGr : 0
        let girlStars;
        let girl_shards = (typeof raids[i].girl_data.shards != 'undefined') ? raids[i].girl_data.shards : (girlDictionary.get(girlId) ? girlDictionary.get(girlId).sh : '?');
        let skin_shards = girlSkinsDictionary.get(girlId) ? girlSkinsDictionary.get(girlId).sh : 'none';
        let available_shards = raids[i].tranche_data.shards_left;

        if (girlStars_nb == 3) girlStars = `<div class="girl_aff">
            <span class="imgStar icon"></span>
            <span class="imgStar icon"></span>
            <span class="imgStar icon"></span>
            </div>`;
        else if (girlStars_nb == 5) girlStars = `<div class="girl_aff">
            <span class="imgStar icon"></span>
            <span class="imgStar icon"></span>
            <span class="imgStar icon"></span>
            <span class="imgStar icon"></span>
            <span class="imgStar icon"></span>
            </div>`;
        else if (girlStars_nb == 6) girlStars = `<div class="girl_aff">
            <span class="imgStar icon"></span>
            <span class="imgStar icon"></span>
            <span class="imgStar icon"></span>
            <span class="imgStar icon"></span>
            <span class="imgStar icon"></span>
            <span class="imgStar icon"></span>
            </div>`;
        else girlStars = `<div class="girl_aff" style="color: #FFB827; text-shadow: 1px 1px 0 #000000, -1px 1px 0 #000000, -1px -1px 0 #000000, 1px -1px 0 #000000;">
            ? </div>`;

        if ($('.raid-card')[i].classList.contains('single-girl')) {
            $($($('.raid-card')[i].getElementsByClassName('raid-card-header'))[0]).before(`${raid_target}
                ${girlStars}`);
            let shards_data;

            if (skin_shards == 'none')
                shards_data = `<div class="raid-shards">
                    <span class="shard_icn"></span>
                    <span>${girl_shards}/100</span>
                    </div>`
            else
                shards_data = `<div class="raid-shards">
                    <span class="shard_icn"></span>
                    <span>${girl_shards}/100</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span class="skins_shard_icn"></span>
                    <span>${skin_shards}/33</span>
                    </div>`

            $($($('.raid-card')[i].getElementsByClassName('raid-timer'))[0]).before(shards_data);
        }

        else if ($('.raid-card')[i].classList.contains('multiple-girl')) {
            let skins_shards;
            if (typeof raids[i].girl_data.preview != 'undefined') {
                if (raids[i].girl_data.preview.grade_skins_data.length > 0) {
                    let j = 0;
                    while (j<raids[i].girl_data.preview.grade_skins_data.length) {
                        if (!raids[i].girl_data.preview.grade_skins_data[j].is_owned) break;
                        j++;
                    }
                    skins_shards = (j == raids[i].girl_data.preview.grade_skins_data.length) ? 33 : raids[i].girl_data.preview.grade_skins_data[j].shards_count;
                }
            }
            else skins_shards = girlSkinsDictionary.get(girlId) ? girlSkinsDictionary.get(girlId).sh : '?';

            $($($('.raid-card')[i].getElementsByClassName('raid-card-header'))[0]).before(`${raid_target}
                ${girlStars}`);

            $($($('.raid-card')[i].getElementsByClassName('raid-timer'))[0]).before(
                `<div class="raid-shards">
                <span class="shard_icn"></span>
                <span>${girl_shards}/100</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span class="skins_shard_icn"></span>
                <span>${skins_shards}/33</span>
                </div>`
            );
        }

        if (raids[i].status == 'ongoing') {
            let event_end_time = raids[i].seconds_until_event_end;
            let next_shards_duration = raids[i].tranche_data.seconds_until_tranche_end;
            if (available_shards > 0 || event_end_time == next_shards_duration) {
                $($($('.raid-card')[i].getElementsByClassName('raid-timer'))[0]).before(`<div class="shards_remaining"><span class="remaining_shards_txt">${window.GT.design.event_total_shards_remaining}</span> <span class="nb_remaining_shards">${available_shards}</span></div>`);
                if (available_shards == 0) $($('.raid-card')[i].getElementsByClassName('nb_remaining_shards')[0]).css('color', 'red');
            }
            else {
                let time_now = window.server_now_ts;
                let next_shards_time = time_now + next_shards_duration;
                setInterval(() => {
                    let time = Math.floor(new Date().getTime()/1000);
                    $($('.raid-card')[i].getElementsByClassName('next_shards')).remove();
                    $($($('.raid-card')[i].getElementsByClassName('raid-timer'))[0]).before(`<div class="next_shards"><span class="next_shards_txt">${window.GT.design.more_shards_available_in}</span> ${convertToTimeFormat(next_shards_time-time)}</div>`);
                }, 1000);
            }
        }
        else {
            let event_duration = raids[i].event_duration_seconds;
            $($($('.raid-card')[i].getElementsByClassName('raid-timer'))[1]).append(`<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${window.GT.design.seasons_duration}: ${convertToTimeFormat(event_duration)}</p>`);
        }

        $($($('.raid-card')[i].getElementsByClassName('raid-timer'))[0]).before(`<a class="redirect_button blue_button_L harem_button" href=/characters/${girlId} style="padding: 3px 10px;">${window.GT.design.Harem}</div>`);

        if (raids[i].all_is_owned && loadSetting('hideLoveRaids')) {
            $($('.raid-card')[i]).addClass('hidden');
            $('.raid-card')[i].style.display = 'none';
        }
    }

    $('#love-raids .head-section')[0].addEventListener('click', () => {
        let display = ($('.raid-card.hidden').css('display') == 'none') ? 'block' : 'none';
        $('.raid-card.hidden').css('display', display);
        let eye_open_display = ($('#love-raids .head-section .eye .eye_open').css('display') == 'none') ? 'block' : 'none';
        $('#love-raids .head-section .eye .eye_open').css('display', eye_open_display);
        let eye_closed_display = ($('#love-raids .head-section .eye .eye_closed').css('display') == 'none') ? 'block' : 'none';
        $('#love-raids .head-section .eye .eye_closed').css('display', eye_closed_display);
    });

    //CSS
    sheet.insertRule(`.target_icn {
        position: absolute;
        z-index: 2;
        display: inline-flex;
        text-decoration: none;
        color: white;}`
    );

    sheet.insertRule(`.raid-card .target_icn.troll {
        left: 432px;}`
    );

    sheet.insertRule(`.raid-card .target_icn.champion {
        left: 443px;}`
    );

    sheet.insertRule(`.raid-card .target_icn.season {
        left: 455px;}`
    );

    sheet.insertRule(`.raid-shards {
        text-shadow: 1px 1px 0 white, -1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white;
        color: #80058b;}`
    );

    sheet.insertRule(`.raid_icn {
        display: block;
        width: 29px;
        height: 29px;
        background-size: 25px;
        background-repeat: no-repeat;
        background-position: center center;}`
    );

    sheet.insertRule(`.troll.raid_icn {
        background-image: url(${window.IMAGES_URL}/pictures/design/ic_topbar_energy_fight.png);}`
    );

    sheet.insertRule(`.season.raid_icn {
        background-image: url(${window.IMAGES_URL}/pictures/design/ic_kiss.png);}`
    );

    sheet.insertRule(`.champion.raid_icn {
        background-image: url(${window.IMAGES_URL}/pictures/design/champion_ticket.png);}`
    );

    sheet.insertRule(`.raid-card .girl_aff {
        position: absolute;
        z-index: 2;
        top: -5px;
        left: 3px;}`
    );

    sheet.insertRule(`.imgStar {
        background-image: url(${window.IMAGES_URL}/design_v2/affstar_S.png);}`
    );

    sheet.insertRule(`.icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        background-size: 16px;
        background-repeat: no-repeat;}`
    );

    sheet.insertRule(`.remaining_shards_txt,
            .next_shards_txt {
        color: #FFB827;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .shards_remaining,
            .next_shards {
        font-size: 13px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .shards_remaining,
            .next_shards {
        font-size: 15px;}}`
    );

    sheet.insertRule(`.raid-card-header {
        position: relative;}`
    );

    sheet.insertRule(`.raid-card.expanded .raid-shards,
            .raid-card.expanded .shards_remaining,
            .raid-card.expanded .next_shards {
        display: none;}`
    );

    sheet.insertRule(`.raid-card.expanded .girl_aff,
            .raid-card.expanded .target_icn,
            .raid-card.expanded .harem_button {
        top: 35px;}`
    );

    sheet.insertRule(`.raid-card.expanded .girl_aff {
        left: 5px;}`
    );

    sheet.insertRule(`.raid-card.expanded .target_icn.troll {
        left: 940px;}`
    );

    sheet.insertRule(`.raid-card.expanded .target_icn.champion {
        left: 955px;}`
    );

    sheet.insertRule(`.raid-card.expanded .target_icn.season {
        left: 970px;}`
    );

    sheet.insertRule(`.raid-card.expanded .harem_button {
        position: absolute;
        left: 462px;}`
    );

    sheet.insertRule(`.raid-card.expanded .icon {
        width: 24px;
        height: 24px;
        background-size: 26px;}`
    );

    sheet.insertRule(`#love-raids .head-section .eye {
        position: absolute;
        left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2rem;
        width: 3rem;
        cursor: pointer;
        transition: opacity 1s;}`
    );

    sheet.insertRule(`#love-raids .head-section .eye img {
        height: 80%;}`
    );
}

function sortPentaDrillOpponents() {
    let i=0;
    Array.from($('.opponent-info-container')).forEach((opponent) => {
        $(opponent).addClass('opponent-' + i);
        i++;
    })

    function compare(a, b) {
        if (a.power < b.power) return -1;
        else if (a.power > b.power) return 1;
        else return 0;
    }

    i=0;
    let opps = [];
    Array.from($('.opponents-container .opponent-info-container .total-power-container .value span')).forEach((value) => {
        opps.push({index: i, power: localeStringToNumber(value.textContent)});
        i++;
    })

    opps.sort(compare);
    opps.forEach((opp) => {$('.opponents-container.grid-container').append($(`.opponent-info-container.opponent-${opp.index}`))});
}

//CSS rules to optimize display and fix some bugs
function fixCSSIssues() {
    sheet.insertRule(`${mediaMobile} {
            #fight_energy_bar .energy_counter_bar .energy_counter_icon .hudBattlePts_mix_icn {
        left: 14px;}}`
    );

    sheet.insertRule(`.rotate_device {
        display: none;}`
    );

    //Home
    sheet.insertRule(`${mediaMobile} {
            #homepage .social_links .social_links_buttons.shown .links > span, #homepage .social_links .social_links_games.shown .links > span {
        width: 6rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .social_links {
        margin-left: 36rem !important;}}`
    );

    //Hide claimed rewards
    sheet.insertRule(`.script-hide-claimed {
        display: none !important;}`
    );

    //White border in market
    sheet.insertRule(`#shops .slot {
        border: none;}`
    );

    //Good position on wrong place for champions
    sheet.insertRule(`${mediaMobile} {
            .girl-box__draggable .green-tick-icon.empty {
        -webkit-mask: url(${window.IMAGES_URL}/design/ic_tick_white.svg) no-repeat 50% 50%;
        -webkit-mask-size: contain;
        background-image: none;
        background-color: snow;}}`
    );

    sheet.insertRule(`#hh_comix #harem_left .girls_list.grid_view div[girl] .right .salary .loading .over.count {
        font-weight: bold;}`
    );

    //Season
    sheet.insertRule(`${mediaMobile} {
            #season-arena .rewards_list .slot_victory_points .amount,
            #season-arena .rewards_list .slot_season_xp_girl .amount,
            #season-arena .rewards_list .slot_season_affection_girl .amount {
        font-size: 14px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #season-arena .player_team_block.opponent .opponent_rewards .rewards_list .slot.slot_victory_points .victory_points_icn {
        width: 45%;
        height: 45%;
        left: 27%;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .team-hexagon-container .team-hexagon {
        margin-top: -15px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #season-arena .opponents_arena .opponents_choose_text_container {
        margin-top: -6px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #seasons_tab_container .btn-control.girl-information {
        margin-right: -20px;
        margin-left: 19px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #seasons_tab_container .btn-control.girl-information {
        margin-bottom: 30px;
        margin-right: -20px;
        margin-left: 10px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #seasons_tab_container .nc-event-reward-info {
        bottom: 14rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #seasons_main_container .seasons_controls_holder {
        margin-top: -15px;}}`
    );

    sheet.insertRule(`.rewards_container_seasons {
        bottom: 0%;}`
    );

    sheet.insertRule(`.season-pass {
        bottom: 1.7rem;}`
    );

    sheet.insertRule(`#get_seasons_pass_btn {
        min-width: max-content;}`
    );

    //Raid in season
    sheet.insertRule(`${mediaMobile} {
            #seasons_main_container .love-raid-container {
        top: -20px;
        left: 6.6rem;}}`
    );

    //Move Claim all button in season
    sheet.insertRule(`#seasons_tab_container #claim-all {
        position: absolute;
        top: 22px;}`
    );

    //Skip button on battle screen
    sheet.insertRule(`#battle .new-battle-buttons-container button {
        position: absolute;
        max-width: 7rem;
        right: -57px;
        top: 422px;}`
    );

    sheet.insertRule(`.page-troll-battle #rewards_popup .flex-container button,
            .page-troll-pre-battle #rewards_popup .flex-container button,
            .page-activities #rewards_popup .flex-container button,
            .page-season-battle #rewards_popup .flex-container button,
            .page-league-battle #rewards_popup .flex-container button,
            .page-labyrinth-battle #rewards_popup .flex-container button {
        position: absolute;
        top: 493px;}`
    );

    sheet.insertRule(`.page-champions .section__preview-characters .skip-button {
        right: 460px;}`
    );

    //Girls display on battle screen
    sheet.insertRule(`#new_battle .new-battle-girl-container, #new_battle .new-battle-girl-container {
        z-index: -1;}`
    );

    sheet.insertRule(`.new-battle-girl-container .new-battle-image.js-displayed-girl {
        width: 164px !important;}`
    );

    //Team display
    sheet.insertRule(`${mediaMobile} {
            #season-arena .player_team_block .player-team, #teams .player-team {
        margin-top: 17px;}}`
    );

    //CSS rules to fix the rewards display in path of valor
    sheet.insertRule(`#pov_tab_container .potions-paths-title-panel, #pog_tab_container .potions-paths-title-panel {
        transform: scale(0.5);
        position: relative;
        top: -37px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #pov_tab_container .potions-paths-next-milestone-panel, #pog_tab_container .potions-paths-next-milestone-panel {
        transform: scale(0.8);
        margin-top: 15px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #pov_tab_container .potions-paths-next-milestone-panel, #pog_tab_container .potions-paths-next-milestone-panel {
        transform: scale(0.8);
        margin-top: 0px;}}`
    );

    sheet.insertRule(`#pov_tab_container .potions-paths-objective, #pog_tab_container .potions-paths-next-milestone-panel {
        transform: scale(0.8);
        margin-top: -22px;}`
    );

    sheet.insertRule(`#pov_tab_container .potions-paths-progress-bar-section, #pog_tab_container .potions-paths-progress-bar-section {
        margin-top: -63px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #pov_tab_container .potions-paths-progress-bar-section, #pog_tab_container .potions-paths-progress-bar-section {
        overflow-x: hidden;}}`
    );

    sheet.insertRule(`.pov-gradient-panel {
        z-index: 1;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .pov-title-panel {
        transform: scale(0.5);
        position: relative;
        top: -78px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .pov-title-panel {
        transform: scale(0.5);
        position: relative;
        top: -82px;}}`
    );

    sheet.insertRule(`#pov_tab_container .potions-paths-first-row .timer-box,
            #pog_tab_container .potions-paths-first-row .timer-box,
            #pov_tab_container .potions-paths-first-row .potions-paths-potions,
            #pog_tab_container .potions-paths-first-row .potions-paths-potions {
        background-color: rgba(39,5,43,0.7);}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #pov_tab_container .girl-preview > img, #pog_tab_container .girl-preview > img {
        margin-top: -79px !important;
        height: 160%;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #pov_tab_container .girl-preview > img, #pog_tab_container .girl-preview > img {
        margin-top: -79px !important;
        height: 153%;}}`
    );

    setTimeout(() => {
        if ($('.potions-paths-next-milestone-panel .potions-paths-tier ').length > 0) {
            sheet.insertRule(`${mediaDesktop} {
                    #pov_tab_container .potions-paths-progress-bar-section, #pog_tab_container .potions-paths-progress-bar-section {
                height: 286px;}}`
            );

            sheet.insertRule(`${mediaMobile} {
                    #pov_tab_container .potions-paths-progress-bar-section, #pog_tab_container .potions-paths-progress-bar-section {
                height: 271px;}}`
            );
        }
        else {
            sheet.insertRule(`${mediaDesktop} {
                    #pov_tab_container .potions-paths-progress-bar-section {
                height: 362px;}}`
            );

            sheet.insertRule(`${mediaDesktop} {
                    #pog_tab_container .potions-paths-progress-bar-section {
                height: 338px;}}`
            );

            sheet.insertRule(`${mediaMobile} {
                    #pov_tab_container .potions-paths-progress-bar-section, #pog_tab_container .potions-paths-progress-bar-section {
                height: 348px;}}`
            );
        }

        if ($('.pov-next-milestone-panel .pov-tier ').length > 0) {
            sheet.insertRule(`${mediaDesktop} {
                    .pov-progress-bar-section {
                height: 326px;}}`
            );

            sheet.insertRule(`${mediaMobile} {
                    .pov-progress-bar-section {
                height: 307px;}}`
            );
        }
        else {
            sheet.insertRule(`${mediaDesktop} {
                    .pov-progress-bar-section {
                height: 403px;}}`
            );

            sheet.insertRule(`${mediaMobile} {
                    .pov-progress-bar-section {
                height: 384px;}}`
            );
        }
    }, timeout)

    sheet.insertRule(`#pov_tab_container .timer-box, #pog_tab_container .timer-box {
        position: relative;
        top: -18px;
        left: 233px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-left-width: 2px;
        border-left-style: solid;
        border-left-color: rgb(255, 184, 39);}`
    );

    sheet.insertRule(`.potions-paths-tier .paid-slots.paid-locked .lock-icon {
        width: 15px;
        height: 15px;
        top: -0.5rem;
        left: 1.02rem;}`
    );

    sheet.insertRule(`.potions-paths-background-panel #pov_tab_container .potions-paths-second-row .potions-paths-central-section .potions-paths-tiers-section .potions-paths-progress-bar-section .potions-paths-progress-bar-tiers .pass-background {
        height: 98%;}`
    );

    sheet.insertRule(`.potions-paths-background-panel #pov_tab_container .potions-paths-second-row .potions-paths-central-section .potions-paths-tiers-section .potions-paths-progress-bar-section .potions-paths-progress-bar-tiers .pass-plus-background {
        height: 98.25%;}`
    );

    sheet.insertRule(`.potions-paths-background-panel .potions-paths-second-row .girl-preview .orange_button_L {
        top: -7.5rem;
        left: -11rem;}`
    );

    //CSS rules to fix the rewards display in path of glory
    sheet.insertRule(`${mediaDesktop} {
            .potions-paths-background-panel .potions-paths-first-row .potions-paths-title-panel h1 {
        margin-top: 0.5rem;
        font-size: 1.5rem;}}`
    );

    sheet.insertRule(`.potions-paths-background-panel #pog_tab_container .potions-paths-second-row .potions-paths-central-section .potions-paths-tiers-section .potions-paths-progress-bar-section .potions-paths-progress-bar-tiers .pass-background {
        height: 98.3%;}`
    );

    sheet.insertRule(`.potions-paths-background-panel #pog_tab_container .potions-paths-second-row .potions-paths-central-section .potions-paths-tiers-section .potions-paths-progress-bar-section .potions-paths-progress-bar-tiers .pass-plus-background {
        height: 98.5%;}`
    );

    //Market
    sheet.insertRule(`#shops .shop-container .content-container #my-hero-tab-container .my-hero-switch-content #my-hero-equipement-tab-container .my-inventory-equipement-container .my-inventory .my-inventory-container .armor .slot-container .slot .stack_num,
            #shops .shop-container .content-container #my-hero-tab-container .my-hero-switch-content #my-hero-boosters-tab-container .my-inventory-equipement-container .my-inventory .my-inventory-container .armor .slot-container .slot .stack_num,
            #shops .shop-container .content-container #my-hero-tab-container .my-hero-switch-content #my-hero-equipement-tab-container .my-inventory-equipement-container .my-inventory .my-inventory-container .booster .slot-container .slot .stack_num,
            #shops .shop-container .content-container #my-hero-tab-container .my-hero-switch-content #my-hero-boosters-tab-container .my-inventory-equipement-container .my-inventory .my-inventory-container .booster .slot-container .slot .stack_num,
            #shops .shop-container .content-container #equipement-tab-container .right-container .slot-container .slot .stack_num,
            #shops .shop-container .content-container #boosters-tab-container .right-container .slot-container .slot .stack_num,
            #shops .shop-container .content-container #books-tab-container .right-container .slot-container .slot .stack_num,
            #shops .shop-container .content-container #gifts-tab-container .right-container .slot-container .slot .stack_num {
        width: 3.2rem;}`
    );

    //Daily goals
    sheet.insertRule(`${mediaMobile} {
            #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container {
        z-index: 10;}`
    );

    //CSS to fix money and kobans display on mobile
    sheet.insertRule(`${mediaMobile} {
            body > div > header > div.currency div[hero="soft_currency"], body > div > header > div.currency div[hero="hard_currency"] {
        left: 29px;}}`
    );

    //Club champion
    sheet.insertRule(`.club_champions_rewards_container .slot.size_large {
        max-height: 4.5rem;
        max-width: 4.5rem;}`
    );

    //Hero level rewards window
    sheet.insertRule(`#member-progression-container .content-header {
        margin-top: 18px;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .page-member-progression .member-progression-container .tiers-container #pass_holder {
        margin-bottom: -40px;}}`
    );

    //Domination synergy popup
    sheet.insertRule(`@media only screen and (max-width: 1025px) and (orientation: landscape) {
            .popup_wrapper #domination_synergy_popup {
        top : 10px;
        transform: scale(1);
        height: max-content;
        width : 100%;}}`
    );

    sheet.insertRule(`@media only screen and (max-width: 1025px) and (orientation: portrait) {
            .popup_wrapper #domination_synergy_popup .crit-bonus .crit-bonus-description {
        right : -20px;}}`
    );

    sheet.insertRule(`@media only screen and (max-width: 1025px) and (orientation: landscape) {
            .popup_wrapper #domination_synergy_popup .impact-ego-bonus .impact-ego-bonus-description {
        margin-right : -15px;}}`
    );

    sheet.insertRule(`.popup_wrapper #domination_synergy_popup .impact-ego-bonus .impact-ego-bonus-description > p {
        margin-left : 0px;}`
    );

    sheet.insertRule(`@media only screen and (max-width: 1025px) and (orientation: landscape) {
            .popup_wrapper #domination_synergy_popup .crit-bonus .crit-bonus-description {
        margin-right : -45px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .popup_wrapper #domination_synergy_popup .crit-bonus .crit-bonus-description {
        right: 20px;}}`
    );

    //Champions display
    sheet.insertRule(`.champions-over__girl-image {
        bottom: -50px;}`
    );

    sheet.insertRule(`.champions-over__champion-wrapper .nc-event-reward-info {
        right: 10rem;
        bottom: 1rem;}`
    );

    sheet.insertRule(`.champions-over__champion-wrapper .btn-control.girl-information {
        bottom: 4rem;
        right: 19rem;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .champions-over__champion-image {
        scale: 0.9;}}`
    );

    sheet.insertRule(`.champions-middle__champion-resting-text .timer > p span {
        width: max-content;}`)

    //Mythic event widget
    sheet.insertRule(`#events .nc-panel-container .nc-panel-body .nc-event-container.mythic_event .nc-events-prize-locations-container .shards-info {
        left: 32.8rem;
        bottom: -2rem;
        min-width: 26rem;}`
    );

    sheet.insertRule(`#events .nc-panel-container .nc-panel-body .nc-event-container .nc-events-prize-locations-container .shards-info p {
        font-size: 14px;}`
    );

    sheet.insertRule(`#events .nc-panel-container .nc-panel-body .nc-event-container .nc-events-prize-locations-container .prize-locations-infos-container .nc-events-prize-locations-info {
        font-size: 14px;}`
    );

    sheet.insertRule(`#events .nc-events-prize-locations-container .prize-locations-infos-container .nc-events-prize-locations-info .girl-name {
        max-width: 500px;}`
    );

    sheet.insertRule(`#events .nc-events-prize-locations-container .prize-locations-infos-container .nc-events-prize-locations-info .girl-name.highlight {
        text-align: center;}`
    );

    sheet.insertRule(`#events .nc-panel-container .nc-panel-body .nc-event-container .nc-events-prize-locations-container .shards-progress-bar-container .shards_bar_wrapper p span {
        top: -0.6rem;
        font-size: 14px;}`
    );

    sheet.insertRule(`#events .nc-panel-container .nc-panel-body .nc-event-container .nc-events-prize-locations-container .shards-progress-bar-container .shards_bar_wrapper .shards_bar.skins-shards {
        margin-top: 1rem;}`
    );

    sheet.insertRule(`#events .nc-panel-container .nc-panel-body .nc-event-container .nc-events-prize-locations-container .girl-information.with-skin-shards {
        bottom: 10rem;
        left: 13rem;}`
    );

    //Mega-event widget
    sheet.insertRule(`.mega-event-panel .mega-event-container .overlayed-section .mega-timer {
        max-width: 115px;
        text-align: right;}`
    );

    sheet.insertRule(`.mega-event-panel .mega-event-container .tabs-section #home_tab_container .bottom-container .left-part-container .player-shards {
        top: 1.8rem;
        background: linear-gradient(to top,rgba(87, 35, 50, 0.8) 0,rgba(87, 35, 50, 0.8) 1%,rgba(44, 30, 28, 0.8) 100%);}`
    );

    sheet.insertRule(`.mega-event-panel .mega-event-container .tabs-section #top_ranking_tab_container .top_ranking-container #leaderboard_holder #outer-hero-row {
        z-index: 10;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .mega-event-panel .mega-event-container .tabs-section #event_ranking_tab_container .event_ranking-container .ranking-container {
        height: 5.4rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            .mega-event-panel .mega-event-container .tabs-section #event_ranking_tab_container .event_ranking-container .ranking-hero-container {
        height: 3rem;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .mega-event-panel.anniversary .mega-event-container .tabs-section #home_tab_container .middle-container .nc-event-reward-info {
        top: 4px;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .mega-event-panel.anniversary .mega-event-container .tabs-section #home_tab_container .middle-container .nc-event-reward-info {
        top: -5px;}`
    );

    sheet.insertRule(`.mega-event-panel .mega-event-container .tabs-section #home_tab_container .middle-container .girls-reward-container .btn-control.girl-information {
        bottom: 42px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .mega-event-panel .mega-event-container .tabs-section #home_tab_container {
        height: 32.25rem;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .mega-event-panel .mega-event-container .tabs-section #home_tab_container .bottom-container {
        margin-top: 0.75rem;}}`
    );

    sheet.insertRule(`.mega-event-panel .mega-event-container .tabs-section .market-container .shop-item button .button-container .shard_icn {
        position: relative;
        top: 12px;
        right: 23px;}`
    );

    //Labyrinth
    sheet.insertRule(`.pvp-container .team-container .pvp-girls .girl-image {
        height: 34rem;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            .labyrinth-panel .labyrinth-container #shop_tab_container .shop-container .shop-bottom-section .shop-items-container .shop-items-list {
        width: 32rem;}}`
    );

    sheet.insertRule(`.labyrinth-panel .labyrinth-container .relics-container .relics-grid {
        width: 101%;}`
    );

    sheet.insertRule(`${mediaMobile} {
            .labyrinth-panel .labyrinth-container #labyrinth_leaderboard_tab_container .labyrinth_leaderboard-container #leaderboard_holder #outer-hero-row.six-rows {
        margin-top: 0.15rem;}}`
    );

    //DP event
    sheet.insertRule(`${mediaMobile} {
            #dp-content .left-container .objectives-container .easy-objective .nc-sub-panel,
            #dp-content .left-container .objectives-container .hard-objective .nc-sub-panel {
        height: 13rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #dp-content .left-container .tiers-container {
        height: 11.75rem;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #dp-content .right-container .btn-control.girl-information {
        bottom: 184px}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #dp-content .right-container .btn-control.girl-information {
        bottom: 216px}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #dp-content .right-container .btn-control.girl-information.girl-information-1 {
        right: -1.3rem;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #dp-content .right-container .nc-event-reward-info.nc-event-reward-info-0 {
        left: -1.5rem;
        top: -2.6rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #dp-content .right-container .nc-event-reward-info.nc-event-reward-info-0 {
        top: -3.5rem;
        left: -2rem;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #dp-content .right-container .nc-event-reward-info.nc-event-reward-info-1 {
        top: -2rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #dp-content .right-container .nc-event-reward-info.nc-event-reward-info-1 {
        top: -3.5rem;
        right: 1rem;}}`
    );

    //PoA rewards
    sheet.insertRule(`${mediaDesktop} {
            #events .nc-panel-container .nc-panel-body #poa-content {
        height: 14rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #events .nc-panel-container .nc-panel-body #poa-content {
        height: 12rem;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #events .nc-panel-container .nc-panel-body .scroll-area.poa {
        height: 14.4rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #events .nc-panel-container .nc-panel-body .scroll-area.poa {
        height: 15.5rem;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #events .nc-panel-container .nc-panel-body #nc-poa-tape-rewards {
        top: 15px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #events .nc-panel-container .nc-panel-body #nc-poa-tape-rewards {
        top: 27px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #events .nc-panel-container .nc-panel-body .nc-poa-tape-blocker.poa-event {
        bottom: 16px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #events .nc-panel-container .nc-panel-body .scroll-area.poa .nc-poa-tape-blocker.yellow-banner {
        bottom: 16px;
        height: 87px;}}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #events .nc-panel-container .nc-panel-body #poa-content .girls .girls-container .btn-control.girl-information {
        top: 13.5rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #events .nc-panel-container .nc-panel-body #poa-content .girls .girls-container .btn-control.girl-information {
        top: 12.4rem}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #events .nc-panel-container .nc-panel-body #poa-content .girls .girls-container .nc-event-reward-info {
        top: -4px;}}`
    );

    sheet.insertRule(`.nc-event-reward-info.nc-event-reward-info_reduced .new_girl_info .class-text {
        width: 120%;
        text-align: center;}`
    );

    sheet.insertRule(`.nc-event-reward-info.nc-event-reward-info_reduced .new_girl_info .girl_tooltip_level {
        width: 102%;
        text-align: center;}`
    );

    sheet.insertRule(`#events .nc-panel-container .nc-panel-body .scroll-area.poa .nc-poa-tape-blocker.yellow-banner, .mega-event-panel .mega-event-container .tabs-section #home_tab_container .gsp_btn_holder.yellow-banner {
        z-index: 2;}`
    );

    //Pantheon
    sheet.insertRule(`.pantheon-container #pantheon_tab_container .bottom-container #pantheon_tab_worship_energy {
        margin-left: 90px;
        width: 220px;}`
    );

    //Sultry mysteries
    sheet.insertRule(`${mediaMobile} {
            .sultry-mysteries-container .sm-main #shop_tab_container button.restock-shop {
        margin-top: 2rem;}}`
    );

    //Market Hero equipments
    sheet.insertRule(`#shops .shop-container .content-container #my-hero-tab-container .my-hero-switch-content #my-hero-equipement-tab-container .my-inventory-equipement-container .my-inventory .my-inventory-container .armor .slot-container,
            #shops .shop-container .content-container #my-hero-tab-container .my-hero-switch-content #my-hero-boosters-tab-container .my-inventory-equipement-container .my-inventory .my-inventory-container .armor .slot-container,
            #shops .shop-container .content-container #my-hero-tab-container .my-hero-switch-content #my-hero-equipement-tab-container .my-inventory-equipement-container .my-inventory .my-inventory-container .booster .slot-container,
            #shops .shop-container .content-container #my-hero-tab-container .my-hero-switch-content #my-hero-boosters-tab-container .my-inventory-equipement-container .my-inventory .my-inventory-container .booster .slot-container,
            #shops .shop-container .content-container #equipement-tab-container .my-inventory-container .armor .slot-container, #shops .shop-container .content-container #boosters-tab-container .my-inventory-container .armor .slot-container,
            #shops .shop-container .content-container #books-tab-container .my-inventory-container .armor .slot-container, #shops .shop-container .content-container #gifts-tab-container .my-inventory-container .armor .slot-container,
            #shops .shop-container .content-container #equipement-tab-container .merchant-inventory-container .armor .slot-container, #shops .shop-container .content-container #boosters-tab-container .merchant-inventory-container .armor .slot-container,
            #shops .shop-container .content-container #books-tab-container .merchant-inventory-container .armor .slot-container, #shops .shop-container .content-container #gifts-tab-container .merchant-inventory-container .armor .slot-container,
            #shops .shop-container .content-container #equipement-tab-container .my-inventory-container .booster .slot-container,
            #shops .shop-container .content-container #boosters-tab-container .my-inventory-container .booster .slot-container,
            #shops .shop-container .content-container #books-tab-container .my-inventory-container .booster .slot-container,
            #shops .shop-container .content-container #gifts-tab-container .my-inventory-container .booster .slot-container,
            #shops .shop-container .content-container #equipement-tab-container .merchant-inventory-container .booster .slot-container,
            #shops .shop-container .content-container #boosters-tab-container .merchant-inventory-container .booster .slot-container,
            #shops .shop-container .content-container #books-tab-container .merchant-inventory-container .booster .slot-container,
            #shops .shop-container .content-container #gifts-tab-container .merchant-inventory-container .booster .slot-container,
            #shops .shop-container .content-container #equipement-tab-container .my-inventory-container .potion .slot-container,
            #shops .shop-container .content-container #boosters-tab-container .my-inventory-container .potion .slot-container,
            #shops .shop-container .content-container #books-tab-container .my-inventory-container .potion .slot-container,
            #shops .shop-container .content-container #gifts-tab-container .my-inventory-container .potion .slot-container,
            #shops .shop-container .content-container #equipement-tab-container .merchant-inventory-container .potion .slot-container,
            #shops .shop-container .content-container #boosters-tab-container .merchant-inventory-container .potion .slot-container,
            #shops .shop-container .content-container #books-tab-container .merchant-inventory-container .potion .slot-container,
            #shops .shop-container .content-container #gifts-tab-container .merchant-inventory-container .potion .slot-container,
            #shops .shop-container .content-container #equipement-tab-container .my-inventory-container .gift .slot-container,
            #shops .shop-container .content-container #boosters-tab-container .my-inventory-container .gift .slot-container,
            #shops .shop-container .content-container #books-tab-container .my-inventory-container .gift .slot-container,
            #shops .shop-container .content-container #gifts-tab-container .my-inventory-container .gift .slot-container,
            #shops .shop-container .content-container #equipement-tab-container .merchant-inventory-container .gift .slot-container,
            #shops .shop-container .content-container #boosters-tab-container .merchant-inventory-container .gift .slot-container,
            #shops .shop-container .content-container #books-tab-container .merchant-inventory-container .gift .slot-container,
            #shops .shop-container .content-container #gifts-tab-container .merchant-inventory-container .gift .slot-container {
        margin-right: 0.5rem;}`
    );

    //Select text missions and remove scrollbars for every mission description
    sheet.insertRule(`#activities .activities-container #missions .missions_wrap .mission_object .mission_details {
        overflow-y: hidden;
        user-select: text;}`
    );

    //Select ID user
    sheet.insertRule(`.hero_info > .bottom > .ranking_stats > .id {
        user-select: text;}`
    );

    //Rankings
    sheet.insertRule(`.leaderboard_list {
        height: 22.875rem;}`
    );

    sheet.insertRule(`.labyrinth-panel .labyrinth-container #labyrinth_leaderboard_tab_container .labyrinth_leaderboard-container #leaderboard_holder .leaderboard_list {
        height: 21rem;}`
    );

    sheet.insertRule(`.leaderboard_header {
        margin-bottom: 0.25rem;}`
    );

    sheet.insertRule(`.leaderboard_row {
        height: 2.1rem;}`
    );

    sheet.insertRule(`.mega-event-panel .mega-event-container .tabs-section #event_ranking_tab_container .top_ranking-container #leaderboard_holder .leaderboard_row, .mega-event-panel .mega-event-container .tabs-section #top_ranking_tab_container .top_ranking-container #leaderboard_holder .leaderboard_row {
        margin-bottom: 0.1rem;
        height: 2.5rem;}`
    );

    //Lively Scenes event
    if (lang == 'fr' || lang == 'es') {
        sheet.insertRule(`#lse_content .lse_main_view .lse_puzzle {
            margin-top: 15px;}`
        );

        sheet.insertRule(`#lse_content .lse_main_view .lse_preview_banner_container .lse_preview_banner_wrapper {
            margin-top: -13px;}`
        );
    }

    if (lang == 'es') {
        sheet.insertRule(`#lse_content .lse_main_view .lse_side_panel .lse_side_pannel_wrapper .lse_side_panel_subblock.objective>span {
            margin-top: -32px;}`
        );
    }

    sheet.insertRule(`#lse_content .lse_main_view .lse_side_panel .lse_side_pannel_wrapper .lse_side_panel_subblock > span {
        font-size: 16px;
        width: 115%;}`
    );

    //World Boss Event
    sheet.insertRule(`#world-boss-event .tabs-section #event_ranking_tab_container .right-container .ranking-leaderboard .ranking-hero-container .ranking-progression {
        padding-top: 0.5rem;}`
    );

    sheet.insertRule(`#world-boss-event .tabs-section #event_ranking_tab_container .right-container .ranking-leaderboard .ranking-hero-container {
        z-index: 10;
        bottom: -1.5rem;
        width: 97.4%;
        height: 2.3rem;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #world-boss-event .tabs-section #event_ranking_tab_container .right-container .ranking-leaderboard {
        height: 25rem;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #world-boss-event .tabs-section #event_ranking_tab_container .right-container .ranking-leaderboard {
        height: 23.3rem;}}`
    );

    sheet.insertRule(`#world-boss-event .tabs-section #perform_tab_container .middle-container.unlocked .community-panel {
        width: 18rem;}`
    );

    sheet.insertRule(`#world-boss-event .tabs-section #event_ranking_tab_container .right-container .ranking-leaderboard .ranking-progression {
        flex-direction: row;}`
    );

    //Places of Power buttons
    sheet.insertRule(`#pop .pop_list .pop-action-btn button .action-cost {
        margin-top: 0;}`
    );

    sheet.insertRule(`#pop .pop_list .pop-action-btn button {
        width: 18rem;
        height: 50px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #pop #ad_activities {
        top: -5.75rem;
        right: -0.5rem;}`
    );

    sheet.insertRule(`${mediaMobile} {
            #pop #ad_activities {
        top: -4rem;
        right: 7.4rem;}`
    );

    //Home Screen
    sheet.insertRule(`#homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .pov-button {
        margin-top: 0px;}`
    );

    sheet.insertRule(`${mediaDesktop} {
            #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .season-button,
            #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .mega-event {
        margin-bottom: 5px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .season-button,
            #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .mega-event {
        margin-bottom: 6px;}}`
    );

    sheet.insertRule(`${mediaMobile} {
            #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .event-cards-container .raids {
        margin-bottom: 6px;}}`
    );

    //Compact harem filter
    sheet.insertRule(`${mediaDesktop} {
            #harem_whole #filtering_girls .form-wrapper .form-control.filter-by-checkbox {
        margin: 9px 0 0 !important;}`
    );

    sheet.insertRule(`${mediaMobile} {
            #harem_whole #filtering_girls .form-wrapper .form-control.filter-by-checkbox {
        margin: 6px 0 0 !important;}`
    );

    //Villains rewards
    sheet.insertRule(`.player_team_block .opponent_rewards .rewards_list {
        gap: 0.05rem;}`
    );
}